export interface Client {
  id: number
  nom: string
  prenom: string
  sexe: string
  dateNaissance: string
  nationalite: string
  adresse: string
  telephone: string
  email?: string
  typePiece: string
  paysProvenance: string
  dateEnregistrement: string
  lieuNaissance: string
  docId?: string
}

// TODO: remplacer ce tableau codé en dur par un appel à l'API
// (ex: GET /api/clients) une fois le backend Firestore prêt.
export const clients: Client[] = [
  {
    id: 1,
    nom: 'OHOUSSOU',
    prenom: 'Magnificat',
    sexe: 'M',
    dateNaissance: '2006-03-07',
    nationalite: 'Béninoise',
    adresse: 'Vodjè-Rail',
    telephone: '167239914',
    typePiece: "Carte d'identité CEDEAO",
    paysProvenance: 'Canada',
    dateEnregistrement: '2026-06-22',
    lieuNaissance: 'Cotonou',
  },
  {
    id: 2,
    nom: 'MANGO',
    prenom: 'Nazifath',
    sexe: 'F',
    dateNaissance: '1995-04-12',
    nationalite: 'Béninoise',
    adresse: 'Fidjrossè',
    telephone: '+229 01 60 00 00 00',
    email: 'nazifath@example.com',
    typePiece: "Carte d'identité CEDEAO",
    paysProvenance: 'Bénin',
    dateEnregistrement: '2026-07-15',
    lieuNaissance: 'Cotonou',
  },
  {
    id: 3,
    nom: 'KODJO',
    prenom: 'Jean',
    sexe: 'M',
    dateNaissance: '1988-11-02',
    nationalite: 'Togolaise',
    adresse: 'Lomé Centre',
    telephone: '+229 01 61 00 00 00',
    email: 'jean@example.com',
    typePiece: 'Passeport',
    paysProvenance: 'Togo',
    dateEnregistrement: '2026-07-28',
    lieuNaissance: 'Lomé',
  },
]
