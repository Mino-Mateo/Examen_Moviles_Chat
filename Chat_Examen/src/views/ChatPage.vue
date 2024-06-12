<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Chat</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-list>
        <ion-item v-for="(message, index) in messages" :key="index" :class="getMessageClass(message)">
          <ion-label v-if="message.sender !== currentUser" class="username">{{ message.senderName }}</ion-label>
          <ion-label>{{ message.text }}</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>

    <ion-footer>
      <ion-toolbar>
        <ion-input v-model="newMessageValue" @keyup.enter="sendMessage" placeholder="Escribe un mensaje"></ion-input>
        <ion-button @click="sendMessage">
          <ion-icon :icon="send"></ion-icon>
        </ion-button>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonList, IonItem, IonLabel, IonInput, IonButton, IonIcon, IonFooter } from '@ionic/vue';
import { onMounted, ref } from 'vue';
import { collection, addDoc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/firebase';
import { send } from "ionicons/icons";
import { DocumentData } from 'firebase/firestore';
import { auth } from '@/main';

// Referencia a la colección de mensajes
const messagesCollection = collection(db, 'messages');

// Lista de mensajes ordenados por timestamp o id
const messages = ref<DocumentData[]>([]);

// Usuario actual
let currentUser: string | null = null;

// Observa el estado de autenticación para obtener el usuario actual
onMounted(() => {
  auth.onAuthStateChanged(user => {
    if (user) {
      currentUser = user.uid;
    } else {
      currentUser = null;
    }
  });
});

// Obtener mensajes de Firestore en tiempo real y ordenarlos
onSnapshot(query(messagesCollection, orderBy('timestamp', 'asc')), (snapshot) => {
  messages.value = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as DocumentData[];
});

// Estado de la nueva entrada de mensaje
const newMessageValue = ref<string>('');

// Función para enviar un nuevo mensaje
const sendMessage = async () => {
  if (newMessageValue.value.trim() !== '') {
    await addDoc(messagesCollection, {
      sender: currentUser,
      senderName: auth.currentUser?.displayName || 'Usuario Anónimo',
      text: newMessageValue.value,
      timestamp: new Date().toISOString()
    });
    newMessageValue.value = '';
  }
};

// Función para determinar la clase del mensaje (receptor/emisor)
const getMessageClass = (message: DocumentData) => ({
  'message-received': message.sender !== currentUser,
  'message-sent': message.sender === currentUser
});
</script>

<style scoped>
.ion-content {
  --ion-background-color: #f0f0f0;
}

.ion-item {
  --inner-padding-end: 16px;
}

.message-sent {
  background-color: lightblue;
}

.message-received {
  background-color: white;
}

.username {
  font-weight: bold;
}
</style>
