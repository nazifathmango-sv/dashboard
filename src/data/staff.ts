export interface StaffMember {
  id: number
  name: string
  poste: string
  phone: string
  status: 'Actif' | 'Inactif'
  docId?: string
}

// TODO: remplacer ce tableau codé en dur par un appel à l'API
// (ex: GET /api/staff) une fois le backend Firestore prêt.
export const staff: StaffMember[] = [
  {
    id: 1,
    name: 'AGBOTON Rachelle',
    poste: 'Réceptionniste',
    phone: '+229 01 62 00 00 00',
    status: 'Actif',
  },
  {
    id: 2,
    name: 'DOSSOU Marcel',
    poste: 'Chef de cuisine',
    phone: '+229 01 63 00 00 00',
    status: 'Actif',
  },
  {
    id: 3,
    name: 'HOUNSOU Bernadette',
    poste: 'Femme de chambre',
    phone: '+229 01 64 00 00 00',
    status: 'Inactif',
  },
]
