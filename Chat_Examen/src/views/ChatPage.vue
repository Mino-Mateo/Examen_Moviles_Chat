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
          <ion-label v-if="message.sender !== uid">{{ message.sender }}</ion-label>
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
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonList, IonItem, IonLabel, IonInput, IonButton, IonIcon, IonFooter } from '@ionic/vue';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase';
import { send } from "ionicons/icons";

// Referencia a la colección de mensajes
const messagesCollection = collection(db, 'messages');

// Lista de mensajes
const messages = ref<{ sender: string; text: string }[]>([]);
const newMessage = ref('');

// Obtener mensajes de Firestore en tiempo real
onMounted(() => {
  const unsubscribe = onSnapshot(messagesCollection, (snapshot) => {
    messages.value = snapshot.docs.map(doc => doc.data() as { sender: string; text: string });
  });

  // Limpiar el listener cuando se destruya el componente
  onBeforeUnmount(unsubscribe);
});

// Usuario actual (simulado)
const uid = 'user1'; // Reemplaza esto con la lógica para obtener el ID del usuario actual

// Función para enviar un nuevo mensaje
const sendMessage = async () => {
  if (newMessage.value.trim() !== '') {
    await addDoc(messagesCollection, {
      sender: uid,
      text: newMessage.value,
      timestamp: new Date().toISOString()
    });
    newMessage.value = ''; // Limpiar el campo de entrada después de enviar el mensaje
  }
};

// Función para determinar la clase del mensaje (receptor/emisor)
const getMessageClass = (message: { sender: string }) => ({
  'message-received': message.sender !== uid,
  'message-sent': message.sender === uid
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
</style>
