export type AccountRole = 'administrateur' | 'receptionniste'

export interface Account {
  id: number
  name: string
  email: string
  role: AccountRole
  status: 'Actif' | 'Inactif'
  docId?: string
}

// TODO: remplacer ce tableau codé en dur par un appel à l'API
// (ex: GET /api/accounts) une fois le backend Firestore prêt.
export const accounts: Account[] = [
  {
    id: 1,
    name: 'MANGO Chefick',
    email: 'chefick@sunbeachhotel.com',
    role: 'administrateur',
    status: 'Actif',
  },
  {
    id: 2,
    name: 'AGBOTON Rachelle',
    email: 'rachelle@sunbeachhotel.com',
    role: 'receptionniste',
    status: 'Actif',
  },
]
