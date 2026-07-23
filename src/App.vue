<script setup lang="ts">
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
const envoyerReservationTest = async () => {
  try {
    const docRef = await addDoc(collection(db, "reservations"), {
      nomClient: "Client Test Soutenance",
      chambre: "Chambre 101 - Standard",
      dateTest: new Date().toLocaleDateString('fr-FR'),
      statut: "En attente"
    });
    alert("Succès ! Réservation enregistrée sous l'ID : " + docRef.id);
  } catch (erreur) {
    console.error("Erreur d'intégration :", erreur);
    alert("Oups ! Erreur de connexion. Regardez la console de votre navigateur.");
  }
};

import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
  <button @click="envoyerReservationTest" style="padding: 10px 20px; background-color: #4CAF50; color: white; border: none; cursor: pointer; border-radius: 5px; margin: 20px;">
  Tester la connexion Firebase
</button>

</template>
