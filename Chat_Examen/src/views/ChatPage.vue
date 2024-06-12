<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Chat</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-list>
        <ion-item v-for="(message, index) in messages" :key="index">
          {{ message.text }}
        </ion-item>
      </ion-list>

      <form @submit.prevent="sendMessage">
        <ion-input v-model="newMessage" placeholder="Escribe tu mensaje"></ion-input>
        <ion-button type="submit">Enviar</ion-button>
      </form>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getFirestore, collection, addDoc, onSnapshot, DocumentData } from 'firebase/firestore';

const db = getFirestore();
const messages = ref<DocumentData[]>([]);
const newMessage = ref('');

// Escuchar cambios en la colección 'messages'
onSnapshot(collection(db, 'messages'), (querySnapshot) => {
  messages.value = [];
  querySnapshot.forEach((doc) => {
    messages.value.push(doc.data());
  });
});

const sendMessage = async () => {
  try {
    await addDoc(collection(db, 'messages'), {
      text: newMessage.value,
      timestamp: new Date(),
    });
    newMessage.value = '';
  } catch (error) {
    console.error('Error adding document: ', error);
  }
};
</script>


<style scoped>
ion-list {
  padding: 10px;
}

form {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
}

ion-input {
  flex: 1;
  margin-right: 10px;
}
</style>
