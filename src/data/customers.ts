export interface Customer {
  id: number
  name: string
  phone: string
  email: string
  country: string
}

// TODO: remplacer ce tableau codé en dur par un appel à l'API
// (ex: GET /api/customers) une fois le backend Firestore prêt.
export const customers: Customer[] = [
  {
    id: 1,
    name: 'MANGO Nazifath',
    phone: '+229 01 60 00 00 00',
    email: 'nazifath@example.com',
    country: 'Bénin',
  },
  {
    id: 2,
    name: 'KODJO Jean',
    phone: '+229 01 61 00 00 00',
    email: 'jean@example.com',
    country: 'Togo',
  },
]
