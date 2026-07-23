export interface Client {
  id: number
  nom: string
  prenom: string
  sexe: string
  dateNaissance: string
  nationalite: string
  adresse: string
  telephone: string
  typePiece: string
  paysProvenance: string
  dateEnregistrement: string
  lieuNaissance: string
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
]
