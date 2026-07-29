/*
Seed Firestore script using Firebase Admin SDK.
Usage:
  1. Create a service account JSON in the project root named `serviceAccountKey.json` (from Firebase Console).
  2. Install dependencies: `npm install firebase-admin`.
  3. Run: `node scripts/seedFirestore.js`.

This script will create collections: clients, reservations, rooms, accounts, staff, services.
*/

const admin = require('firebase-admin')
const fs = require('fs')

const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || './serviceAccountKey.json'
if (!fs.existsSync(keyPath)) {
  console.error('service account key not found at', keyPath)
  process.exit(1)
}

const serviceAccount = require(keyPath)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

async function seedCollection(name, items) {
  console.log(`Seeding collection: ${name} (${items.length} documents)`)
  for (const item of items) {
    try {
      await db.collection(name).add(item)
    } catch (err) {
      console.error('Error adding to', name, err)
    }
  }
}

async function run() {
  // Minimal sample data — extend as needed
  const clients = [
    {
      id: 1,
      nom: 'OHOUSSOU',
      prenom: 'Magnificat',
      sexe: 'M',
      dateNaissance: '2006-03-07',
      nationalite: 'Béninoise',
      adresse: 'Vodjè-Rail',
      telephone: '167239914',
      typePiece: 'Carte d\'identité CEDEAO',
      paysProvenance: 'Canada',
      dateEnregistrement: '2026-06-22',
      lieuNaissance: 'Cotonou',
    },
  ]

  const reservations = [
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
  ]

  const rooms = [
    {
      id: 1,
      titre: 'Chambre Standard',
      image: '/src/assets/img/img_room2.webp',
      description: 'Une chambre confortable et fonctionnelle.',
      prix: '45 000 FCFA / nuit',
      personnes: '2 adultes',
      lit: 'Queen Size',
      statut: 'Disponible',
      equipements: ['Climatisation', 'Wi-Fi gratuit'],
    },
  ]

  const accounts = [
    { id: 1, name: 'MANGO Chefick', email: 'chefick@sunbeachhotel.com', role: 'Admin', status: 'Actif' },
  ]

  const staff = [
    { id: 1, name: 'AGBOTON Rachelle', poste: 'Réceptionniste', phone: '+229 01 62 00 00 00', status: 'Actif' },
  ]

  const services = [
    { id: 1, slug: 'chambres', titre: 'Chambres', image: '/src/assets/img/img_room1.webp', icon: 'bed', description: '...', horaires: '24h', info: 'À partir de 120 000 FCFA / nuit', caracteristiques: ['Climatisation', 'Wi-Fi'] },
  ]

  await seedCollection('clients', clients)
  await seedCollection('reservations', reservations)
  await seedCollection('rooms', rooms)
  await seedCollection('accounts', accounts)
  await seedCollection('staff', staff)
  await seedCollection('services', services)

  console.log('Seeding completed.')
  process.exit(0)
}

run().catch((err) => {
  console.error('Seeder error', err)
  process.exit(1)
})
