import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  collection,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  doc,
} from 'firebase/firestore'
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from 'firebase/auth'

import type { Account } from '@/data/accounts'
import { accounts as seedAccounts } from '@/data/accounts'
import { db, secondaryAuth } from '@/firebase'

function generateTemporaryPassword(): string {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 16)
}

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>([])
  const loading = ref(false)

  const accountsCollection = collection(db, 'utilisateur')

  /**
   * Récupérer les comptes depuis Firestore
   */
  async function fetchAccounts() {
    if (loading.value) return

    loading.value = true

    try {
      const snapshot = await getDocs(accountsCollection)

      if (snapshot.empty) {
        accounts.value = seedAccounts.map((account) => ({
          ...account,
        }))
      } else {
        accounts.value = snapshot.docs
          .map((firestoreDoc, index): Account | null => {
            const data = firestoreDoc.data() as Partial<Account> & {
              id?: number
            }

            // On ignore les documents incomplets
            if (!data.name || !data.role) {
              return null
            }

            return {
              name: data.name,
              email: data.email ?? '',
              role: data.role,
              status: data.status ?? 'Actif',
              id: data.id ?? index + 1,
              docId: firestoreDoc.id,
            }
          })
          .filter(
            (account): account is Account => account !== null,
          )
      }
    } catch (error) {
      console.error(
        '[accountsStore.fetchAccounts] Erreur :',
        error,
      )

      throw error
    } finally {
      loading.value = false
    }
  }

  /**
   * Récupérer un compte
   */
  function getById(idOrDocId: number | string) {
    if (typeof idOrDocId === 'string') {
      return accounts.value.find(
        (account) => account.docId === idOrDocId,
      )
    }

    return accounts.value.find(
      (account) => account.id === idOrDocId,
    )
  }

  /**
   * Créer un compte Administrateur ou Réceptionniste
   *
   * IMPORTANT :
   * - Création Firebase Authentication
   * - Création du document "utilisateur"
   * - Envoi du mail de définition du mot de passe
   *
   * La création utilise secondaryAuth afin de ne pas déconnecter
   * l'administrateur actuellement connecté.
   */
  async function add(
    data: Omit<Account, 'id' | 'docId'>,
  ) {
    const email = data.email.trim()

    if (!email) {
      throw new Error('L’adresse email est obligatoire.')
    }

    if (
      data.role !== 'administrateur' &&
      data.role !== 'receptionniste'
    ) {
      throw new Error('Rôle utilisateur invalide.')
    }

    const temporaryPassword =
      generateTemporaryPassword()

    try {
      /**
       * 1. Création du compte Firebase Authentication
       */
      const credential =
        await createUserWithEmailAndPassword(
          secondaryAuth,
          email,
          temporaryPassword,
        )

      const uid = credential.user.uid

      /**
       * 2. Création du profil dans Firestore
       *
       * Le UID Firebase sert d'identifiant du document.
       */
      await setDoc(
        doc(db, 'utilisateur', uid),
        {
          name: data.name.trim(),
          email,
          role: data.role,
          status: data.status,
        },
      )

      /**
       * 3. Envoi du mail pour définir le mot de passe
       */
      console.log('[accountsStore.add] Envoi du mail à :', email)

await sendPasswordResetEmail(
  secondaryAuth,
  email,
  {
    url: 'https://dashboard-cfe41.web.app/reset',
    handleCodeInApp: false,
  },
)

console.log('[accountsStore.add] Mail envoyé avec succès à :', email)

      /**
       * 4. Mise à jour de la liste locale
       */
      accounts.value.push({
        ...data,
        name: data.name.trim(),
        email,
        docId: uid,
      } as Account)

      console.log(
        '[accountsStore.add] Compte créé et email envoyé à :',
        email,
      )
    } catch (error) {
      console.error(
        '[accountsStore.add] Erreur :',
        error,
      )

      throw error
    } finally {
      /**
       * On déconnecte uniquement l'instance secondaire.
       *
       * L'administrateur reste connecté sur l'instance
       * Firebase principale.
       */
      await signOut(secondaryAuth).catch(() => {})
    }
  }

  /**
   * Modifier un compte
   */
  async function update(
    idOrDocId: number | string,
    patch: Partial<Account>,
  ) {
    try {
      const account =
        typeof idOrDocId === 'string'
          ? accounts.value.find(
              (item) => item.docId === idOrDocId,
            )
          : accounts.value.find(
              (item) => item.id === idOrDocId,
            )

      const docId = account?.docId

      if (docId) {
        await updateDoc(
          doc(db, 'utilisateur', docId),
          patch,
        )
      } else if (typeof idOrDocId === 'string') {
        await updateDoc(
          doc(db, 'utilisateur', idOrDocId),
          patch,
        )
      } else {
        const q = query(
          accountsCollection,
          where('id', '==', idOrDocId),
        )

        const snapshot = await getDocs(q)
        const firstDoc = snapshot.docs[0]

        if (firstDoc) {
          await updateDoc(
            doc(
              db,
              'utilisateur',
              firstDoc.id,
            ),
            patch,
          )
        }
      }

      if (account) {
        Object.assign(account, patch)
      }
    } catch (error) {
      console.error(
        '[accountsStore.update] Erreur :',
        error,
      )

      throw error
    }
  }

  /**
   * Supprimer un compte
   *
   * Attention :
   * depuis le frontend, cela supprime le profil Firestore.
   * La suppression du compte Firebase Authentication
   * nécessite normalement l'Admin SDK côté serveur.
   */
  async function remove(
    idOrDocId: number | string,
  ) {
    try {
      const index =
        typeof idOrDocId === 'string'
          ? accounts.value.findIndex(
              (item) => item.docId === idOrDocId,
            )
          : accounts.value.findIndex(
              (item) => item.id === idOrDocId,
            )

      if (index === -1) return

      const account = accounts.value[index]
      const docId = account?.docId

      if (docId) {
        await deleteDoc(
          doc(db, 'utilisateur', docId),
        )
      } else if (typeof idOrDocId === 'string') {
        await deleteDoc(
          doc(db, 'utilisateur', idOrDocId),
        )
      } else {
        const q = query(
          accountsCollection,
          where('id', '==', idOrDocId),
        )

        const snapshot = await getDocs(q)
        const firstDoc = snapshot.docs[0]

        if (firstDoc) {
          await deleteDoc(
            doc(
              db,
              'utilisateur',
              firstDoc.id,
            ),
          )
        }
      }

      accounts.value.splice(index, 1)
    } catch (error) {
      console.error(
        '[accountsStore.remove] Erreur :',
        error,
      )

      throw error
    }
  }

  fetchAccounts()

  return {
    accounts,
    loading,
    getById,
    add,
    update,
    remove,
    fetchAccounts,
  }
})
