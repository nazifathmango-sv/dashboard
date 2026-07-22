import chambreImg from '@/assets/img/img_room2.webp'

export interface Room {
  id: number
  titre: string
  image: string
  description: string
  prix: string
  personnes: string
  lit: string
}

// TODO: remplacer ce tableau codé en dur par un appel à l'API
// (ex: GET /api/rooms) une fois le backend Firestore prêt.
export const rooms: Room[] = [
  {
    id: 1,
    titre: 'Suite1',
    image: chambreImg,
    description: "Une suite spacieuse offrant une vue magnifique sur l'océan.",
    prix: '120 000 FCFA / nuit',
    personnes: '2 adultes',
    lit: 'King Size',
  },
  {
    id: 2,
    titre: 'Suite2',
    image: chambreImg,
    description: "Une suite spacieuse offrant une vue magnifique sur l'océan.",
    prix: '120 000 FCFA / nuit',
    personnes: '2 adultes',
    lit: 'King Size',
  },
  {
    id: 3,
    titre: 'Suite3',
    image: chambreImg,
    description: "Une suite spacieuse offrant une vue magnifique sur l'océan.",
    prix: '120 000 FCFA / nuit',
    personnes: '2 adultes',
    lit: 'King Size',
  },
  {
    id: 4,
    titre: 'Suite4',
    image: chambreImg,
    description: "Une suite spacieuse offrant une vue magnifique sur l'océan.",
    prix: '120 000 FCFA / nuit',
    personnes: '2 adultes',
    lit: 'King Size',
  },
  {
    id: 5,
    titre: 'Suite5',
    image: chambreImg,
    description: "Une suite spacieuse offrant une vue magnifique sur l'océan.",
    prix: '120 000 FCFA / nuit',
    personnes: '2 adultes',
    lit: 'King Size',
  },
  {
    id: 6,
    titre: 'Suite6',
    image: chambreImg,
    description: "Une suite spacieuse offrant une vue magnifique sur l'océan.",
    prix: '120 000 FCFA / nuit',
    personnes: '2 adultes',
    lit: 'King Size',
  },
]
