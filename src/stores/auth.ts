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

  const isAuthenticated = computed(() => user.value !== null && role.value !== null)

  async function loadRole(uid: string): Promise<Role | null> {
    const snapshot = await getDoc(doc(db, 'utilisateur', uid))
    if (!snapshot.exists()) return null
    const data = snapshot.data() as { role?: Role }
    return data.role ?? null
  }

  function start() {
    if (authListenerStarted) return
    authListenerStarted = true

    onAuthStateChanged(auth, async (firebaseUser) => {
      user.value = firebaseUser
      if (firebaseUser) {
        role.value = await loadRole(firebaseUser.uid)
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
  }

  return { user, role, ready, isAuthenticated, start, waitUntilReady, logout }
})
