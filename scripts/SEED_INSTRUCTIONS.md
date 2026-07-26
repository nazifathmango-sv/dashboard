Seed Firestore instructions

1. Create a Firebase project and generate a service account JSON key:
   - Go to Firebase Console > Project Settings > Service accounts > Generate new private key
   - Save the file as `serviceAccountKey.json` in the project root

2. Install the dependency (in the repo root):

```bash
npm install firebase-admin
```

3. Run the seeder script:

```bash
node scripts/seedFirestore.js
```

Notes:
- The script writes to collections `clients`, `reservations`, `rooms`, `accounts`, `staff`, `services`.
- You can modify `scripts/seedFirestore.js` to add more documents or change fields.
- Alternatively, populate Firestore manually from the Firebase Console if you prefer not to use a service account.
