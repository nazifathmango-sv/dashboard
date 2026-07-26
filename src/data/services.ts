import room from '@/assets/img/img_room1.webp'
import restaurant from '@/assets/img/img_manger2.webp'
import reception from '@/assets/img/img_fete1.webp'
import boiteDeNuit from '@/assets/img/Boite1.webp'
import spa from '@/assets/img/img_spa3.webp'
import salleDeJeux from '@/assets/img/img_jeu1.webp'
import salleDeSport from '@/assets/img/Sport1.webp'

export type ServiceIcon = 'bed' | 'restaurant' | 'party' | 'nightclub' | 'spa' | 'games' | 'sport'

export interface Service {
  id: number
  slug: string
  titre: string
  image: string
  icon: ServiceIcon
  description: string
  horaires: string
  info: string
  caracteristiques: string[]
  docId?: string
}

// TODO: remplacer ce tableau codé en dur par un appel à l'API
// (ex: GET /api/services) une fois le backend Firestore prêt.
export const services: Service[] = [
  {
    id: 1,
    slug: 'chambres',
    titre: 'Chambres',
    image: room,
    icon: 'bed',
    description:
      'Découvrez des espaces chaleureux et raffinés où chaque détail a été imaginé pour vous offrir un séjour paisible. Entre élégance, confort et tranquillité, profitez d’un véritable havre de repos après chaque journée.',
    horaires: 'Accès 24h/24',
    info: 'À partir de 120 000 FCFA / nuit',
    caracteristiques: ['Climatisation', 'Wi-Fi gratuit', 'Vue sur mer', 'Service en chambre'],
  },
  {
    id: 2,
    slug: 'restaurants',
    titre: 'Restaurants',
    image: restaurant,
    icon: 'restaurant',
    description:
      'Plus qu’un simple repas, nos restaurants sont des lieux de rencontre et de partage où chaque instant devient un souvenir. Profitez d’une cuisine savoureuse dans un cadre chaleureux avec votre famille, vos amis ou vos proches.',
    horaires: '7h00 - 23h00',
    info: 'Menu à partir de 8 000 FCFA',
    caracteristiques: ['Cuisine locale et internationale', 'Terrasse extérieure', 'Réservation de groupe'],
  },
  {
    id: 3,
    slug: 'salle-de-reception',
    titre: 'Salle de Réception',
    image: reception,
    icon: 'party',
    description:
      'Notre salle de fête est un espace élégant conçu pour accueillir vos moments importants : mariages, anniversaires, réceptions et célébrations. Chaque événement devient une expérience unique.',
    horaires: 'Sur réservation',
    info: 'Capacité jusqu’à 300 personnes',
    caracteristiques: ['Sonorisation incluse', 'Décoration personnalisable', 'Traiteur sur demande'],
  },
  {
    id: 4,
    slug: 'boite-de-nuit',
    titre: 'Boite de Nuit',
    image: boiteDeNuit,
    icon: 'nightclub',
    description:
      'Découvrez un espace de divertissement où musique, élégance et convivialité se rencontrent. Profitez d’une ambiance exceptionnelle pour prolonger vos soirées.',
    horaires: '22h00 - 4h00',
    info: 'Entrée à partir de 5 000 FCFA',
    caracteristiques: ['DJ résident', 'Bar à cocktails', 'Espace VIP'],
  },
  {
    id: 5,
    slug: 'spa',
    titre: 'Spa',
    image: spa,
    icon: 'spa',
    description:
      'Offrez-vous un moment de détente dans notre espace spa. Entre soins relaxants, ambiance chaleureuse et bien-être, profitez d’une expérience unique dédiée à votre relaxation.',
    horaires: '9h00 - 20h00',
    info: 'Soins à partir de 15 000 FCFA',
    caracteristiques: ['Massages', 'Hammam', 'Sauna', 'Soins du visage'],
  },
  {
    id: 6,
    slug: 'salle-de-jeux',
    titre: 'Salle de Jeux',
    image: salleDeJeux,
    icon: 'games',
    description:
      'Notre salle de jeux offre aux enfants un espace sécurisé et amusant. Pendant qu’ils profitent de leurs activités, les parents peuvent partager un moment calme et agréable.',
    horaires: '10h00 - 19h00',
    info: 'Accès libre pour les résidents',
    caracteristiques: ['Espace surveillé', 'Jeux pour tous âges', 'Anniversaires sur demande'],
  },
  {
    id: 7,
    slug: 'salle-de-sport',
    titre: 'Salle de Sport',
    image: salleDeSport,
    icon: 'sport',
    description:
      'Gardez votre équilibre et votre énergie grâce à notre salle de sport moderne. Un espace pensé pour votre bien-être, votre forme et votre confort.',
    horaires: '6h00 - 22h00',
    info: 'Accès libre pour les résidents',
    caracteristiques: ['Équipements modernes', 'Coach disponible sur demande', 'Vestiaires et douches'],
  },
]
