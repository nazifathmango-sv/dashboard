import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { onAuthStateChanged, signOut, type User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/firebase'

export type Role = 'administrateur' | 'receptionniste'

let authListenerStarted = false

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const role = ref<Role | null>(null)
  const ready = ref(false)

  const isAuthenticated = computed(
    () => user.value !== null && role.value !== null,
  )

  async function loadRole(uid: string): Promise<Role | null> {
    try {
      const snapshot = await getDoc(
        doc(db, 'utilisateur', uid),
      )

      if (!snapshot.exists()) {
        return null
      }

      const data = snapshot.data() as {
        role?: string
        status?: string
      }

      // Compte désactivé
      if (data.status === 'Inactif') {
        return null
      }

      // Vérification du rôle
      if (
        data.role !== 'administrateur' &&
        data.role !== 'receptionniste'
      ) {
        return null
      }

      return data.role as Role
    } catch (error) {
      console.error('[auth] Impossible de récupérer le rôle :', error)
      return null
    }
  }

  function start() {
    if (authListenerStarted) return

    authListenerStarted = true

    onAuthStateChanged(auth, async (firebaseUser) => {
      user.value = firebaseUser

      if (firebaseUser) {
        const loadedRole = await loadRole(firebaseUser.uid)

        role.value = loadedRole

        // Si le compte n'a pas de rôle valide
        // ou est désactivé, on déconnecte l'utilisateur.
        if (!loadedRole) {
          await signOut(auth)
          user.value = null
          role.value = null
        }
      } else {
        role.value = null
      }

      ready.value = true
    })
  }

  async function waitUntilReady(): Promise<void> {
    if (ready.value) return

    await new Promise<void>((resolve) => {
      const unwatch = setInterval(() => {
        if (ready.value) {
          clearInterval(unwatch)
          resolve()
        }
      }, 20)
    })
  }

  async function logout() {
    await signOut(auth)

    user.value = null
    role.value = null

    localStorage.removeItem('role')
    localStorage.removeItem('userUid')
  }

  return {
    user,
    role,
    ready,
    isAuthenticated,
    start,
    waitUntilReady,
    logout,
  }
})
