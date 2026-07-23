import roomImg1 from '@/assets/img/img_room1.webp'
import roomImg2 from '@/assets/img/img_room2.webp'

export interface Room {
  id: number
  titre: string
  image: string
  description: string
  prix: string
  personnes: string
  lit: string
  statut: 'Disponible' | 'Complet'
  equipements: string[]
}

// TODO: remplacer ce tableau codé en dur par un appel à l'API
// (ex: GET /api/rooms) une fois le backend Firestore prêt.
export const rooms: Room[] = [
  {
    id: 1,
    titre: 'Chambre Standard',
    image: roomImg2,
    description: 'Une chambre confortable et fonctionnelle, idéale pour un séjour simple et agréable.',
    prix: '45 000 FCFA / nuit',
    personnes: '2 adultes',
    lit: 'Queen Size',
    statut: 'Disponible',
    equipements: ['Climatisation', 'Wi-Fi gratuit'],
  },
  {
    id: 2,
    titre: 'Chambre Double',
    image: roomImg1,
    description: 'Un espace spacieux avec deux lits, parfait pour les familles ou les groupes d’amis.',
    prix: '65 000 FCFA / nuit',
    personnes: '4 adultes',
    lit: '2 lits Queen Size',
    statut: 'Disponible',
    equipements: ['Climatisation', 'Wi-Fi gratuit', 'Salle de bain privée'],
  },
  {
    id: 3,
    titre: 'Suite Junior',
    image: roomImg2,
    description: 'Une suite élégante avec coin salon, alliant confort et espace pour un séjour prolongé.',
    prix: '95 000 FCFA / nuit',
    personnes: '2 adultes',
    lit: 'King Size',
    statut: 'Disponible',
    equipements: ['Climatisation', 'Wi-Fi gratuit', 'Salle de bain privée'],
  },
  {
    id: 4,
    titre: 'Suite Royale',
    image: roomImg1,
    description: 'Une suite spacieuse offrant une vue magnifique sur l’océan et des prestations haut de gamme.',
    prix: '120 000 FCFA / nuit',
    personnes: '2 adultes',
    lit: 'King Size',
    statut: 'Complet',
    equipements: ['Climatisation', 'Wi-Fi gratuit', 'Vue sur mer', 'Salle de bain privée'],
  },
  {
    id: 5,
    titre: 'Suite Familiale',
    image: roomImg2,
    description: 'Un grand espace pensé pour accueillir toute la famille dans le confort et la tranquillité.',
    prix: '150 000 FCFA / nuit',
    personnes: '6 adultes',
    lit: '3 lits Queen Size',
    statut: 'Disponible',
    equipements: ['Climatisation', 'Wi-Fi gratuit', 'Salle de bain privée'],
  },
  {
    id: 6,
    titre: 'Suite Présidentielle',
    image: roomImg1,
    description: 'Le summum du luxe : terrasse privée, salon indépendant et service personnalisé.',
    prix: '250 000 FCFA / nuit',
    personnes: '2 adultes',
    lit: 'King Size',
    statut: 'Complet',
    equipements: ['Climatisation', 'Wi-Fi gratuit', 'Vue sur mer', 'Salle de bain privée'],
  },
]
