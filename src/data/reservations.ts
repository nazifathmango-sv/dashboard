export type StayStatus = 'À venir' | 'Check-in' | 'En cours' | 'Check-out'

export interface Reservation {
  id: number
  name: string
  phone: string
  email: string
  identityCard: string
  country: string
  type: string
  roomId?: number
  dateDebut: string
  dateFin: string
  stayStatus: StayStatus
}

// TODO: remplacer ce tableau codé en dur par un appel à l'API
// (ex: GET /api/reservations) une fois le backend Firestore prêt.
export const reservations: Reservation[] = [
  {
    id: 1,
    name: 'MANGO Nazifath',
    phone: '+229 01 60 00 00 00',
    email: 'nazifath@example.com',
    identityCard: 'B1234567',
    country: 'Bénin',
    type: 'Chambre Luxe',
    roomId: 4,
    dateDebut: '2026-07-20',
    dateFin: '2026-07-25',
    stayStatus: 'En cours',
  },
  {
    id: 2,
    name: 'KODJO Jean',
    phone: '+229 01 61 00 00 00',
    email: 'jean@example.com',
    identityCard: 'A7654321',
    country: 'Togo',
    type: 'Salle de fête',
    dateDebut: '2026-08-01',
    dateFin: '2026-08-02',
    stayStatus: 'À venir',
  },
  {
    id: 3,
    name: 'KODJO Jean',
    phone: '+229 01 61 00 00 00',
    email: 'jean@example.com',
    identityCard: 'A7654321',
    country: 'Togo',
    type: 'Restaurants',
    dateDebut: '2026-08-01',
    dateFin: '2026-08-02',
    stayStatus: 'À venir',
  },
]
