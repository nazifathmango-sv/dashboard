import room from '@/assets/img/img_room1.webp'
import restaurant from '@/assets/img/img_manger2.webp'
import reception from '@/assets/img/img_fete1.webp'
import boiteDeNuit from '@/assets/img/Boite1.webp'
import spa from '@/assets/img/img_spa3.webp'
import salleDeJeux from '@/assets/img/img_jeu1.webp'
import salleDeSport from '@/assets/img/Sport1.webp'

export interface Service {
  id: number
  slug: string
  titre: string
  image: string
  description: string
}

// TODO: remplacer ce tableau codé en dur par un appel à l'API
// (ex: GET /api/services) une fois le backend Firestore prêt.
export const services: Service[] = [
  {
    id: 1,
    slug: 'chambres',
    titre: 'Chambres',
    image: room,
    description:
      'Découvrez des espaces chaleureux et raffinés où chaque détail a été imaginé pour vous offrir un séjour paisible. Entre élégance, confort et tranquillité, profitez d’un véritable havre de repos après chaque journée.',
  },
  {
    id: 2,
    slug: 'restaurants',
    titre: 'Restaurants',
    image: restaurant,
    description:
      'Plus qu’un simple repas, nos restaurants sont des lieux de rencontre et de partage où chaque instant devient un souvenir. Profitez d’une cuisine savoureuse dans un cadre chaleureux avec votre famille, vos amis ou vos proches.',
  },
  {
    id: 3,
    slug: 'salle-de-reception',
    titre: 'Salle de Réception',
    image: reception,
    description:
      'Notre salle de fête est un espace élégant conçu pour accueillir vos moments importants : mariages, anniversaires, réceptions et célébrations. Chaque événement devient une expérience unique.',
  },
  {
    id: 4,
    slug: 'boite-de-nuit',
    titre: 'Boite de Nuit',
    image: boiteDeNuit,
    description:
      'Découvrez un espace de divertissement où musique, élégance et convivialité se rencontrent. Profitez d’une ambiance exceptionnelle pour prolonger vos soirées.',
  },
  {
    id: 5,
    slug: 'spa',
    titre: 'Spa',
    image: spa,
    description:
      'Offrez-vous un moment de détente dans notre espace spa. Entre soins relaxants, ambiance chaleureuse et bien-être, profitez d’une expérience unique dédiée à votre relaxation.',
  },
  {
    id: 6,
    slug: 'salle-de-jeux',
    titre: 'Salle de Jeux',
    image: salleDeJeux,
    description:
      'Notre salle de jeux offre aux enfants un espace sécurisé et amusant. Pendant qu’ils profitent de leurs activités, les parents peuvent partager un moment calme et agréable.',
  },
  {
    id: 7,
    slug: 'salle-de-sport',
    titre: 'Salle de Sport',
    image: salleDeSport,
    description:
      'Gardez votre équilibre et votre énergie grâce à notre salle de sport moderne. Un espace pensé pour votre bien-être, votre forme et votre confort.',
  },
]
