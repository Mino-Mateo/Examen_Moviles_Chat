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
        <ion-input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Escribe un mensaje"></ion-input>
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
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase';
import { send } from "ionicons/icons";
import { DocumentData } from 'firebase/firestore';
import { auth } from '@/main';

// Referencia a la colección de mensajes
const messagesCollection = collection(db, 'messages');

// Lista de mensajes
const messages = ref<DocumentData[]>([]); // Especificamos el tipo DocumentData[]
const newMessage = ref('');

let currentUser: string | null = null; // Variable para almacenar el ID del usuario actual

// Observa el estado de autenticación para obtener el usuario actual
onMounted(() => {
  auth.onAuthStateChanged(user => {
    if (user) {
      currentUser = user.uid; // Obtén el ID del usuario actual
    } else {
      currentUser = null; // No hay usuario autenticado
    }
  });
});

// Obtener mensajes de Firestore en tiempo real
onSnapshot(messagesCollection, (snapshot) => {
  messages.value = snapshot.docs.map(doc => doc.data());
});

// Función para enviar un nuevo mensaje
const sendMessage = async () => {
  if (newMessage.value.trim() !== '') {
    await addDoc(messagesCollection, {
      sender: currentUser,
      senderName: auth.currentUser?.displayName || 'Usuario Anónimo', // Nombre del usuario actual
      text: newMessage.value,
      timestamp: new Date().toISOString()
    });
    newMessage.value = ''; // Limpiar el campo de entrada después de enviar el mensaje
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
  --ion-background-color: #f0f0f0; /* Color de fondo del contenido */
}

.ion-item {
  --inner-padding-end: 16px; /* Espaciado interno en el lado derecho del item */
}

.message-sent {
  background-color: lightblue; /* Estilo del mensaje enviado por el usuario */
}

.message-received {
  background-color: white; /* Estilo del mensaje recibido */
}

.username {
  font-weight: bold; /* Estilo para resaltar el nombre de usuario */
}
</style>
