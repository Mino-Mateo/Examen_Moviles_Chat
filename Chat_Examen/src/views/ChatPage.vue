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
          <ion-label v-if="message.type === 'text'">{{ message.text }}</ion-label>
          <ion-img v-if="message.type === 'image'" :src="message.imageUrl"></ion-img>
        </ion-item>
      </ion-list>
    </ion-content>

    <ion-footer>
      <ion-toolbar>
        <ion-input v-model="newMessageValue" @keyup.enter="sendMessage" placeholder="Escribe un mensaje"></ion-input>
        <ion-button @click="sendMessage">
          <ion-icon :icon="send"></ion-icon>
        </ion-button>
        <ion-button @click="openFileInput">
          Adjuntar Imagen
        </ion-button>
        <input type="file" accept="image/jpeg" @change="handleFileUpload" ref="fileInput" style="display: none">
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonList, IonItem, IonLabel, IonInput, IonButton, IonIcon, IonFooter, IonImg } from '@ionic/vue';
import { onMounted, ref } from 'vue';
import { collection, addDoc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db, storage } from '@/firebase';
import { send } from "ionicons/icons";
import { DocumentData } from 'firebase/firestore';
import { auth } from '@/main';
import { getDownloadURL, ref as storageRef, uploadBytes } from 'firebase/storage';

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

// Estado para el archivo seleccionado
let selectedFile: File | null = null;

// Función para enviar un nuevo mensaje
const sendMessage = async () => {
  if (newMessageValue.value.trim() !== '' || selectedFile) {
    let imageUrl = null;
    if (selectedFile) {
      imageUrl = await uploadImage(selectedFile);
    }

    await addDoc(messagesCollection, {
      sender: currentUser,
      senderName: auth.currentUser?.displayName || 'Usuario Anónimo',
      text: newMessageValue.value,
      imageUrl: imageUrl,
      type: selectedFile ? 'image' : 'text',
      timestamp: new Date().toISOString()
    });

    newMessageValue.value = '';
    selectedFile = null;
  }
};

// Función para manejar la carga de archivos (imágenes)
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    if (file.type === 'image/jpeg' && file.size <= 5 * 1024 * 1024) { // Verificar el tipo y tamaño del archivo
      selectedFile = file;
    } else {
      alert('Por favor, selecciona una imagen JPEG de no más de 5 MB.');
    }
  }
};

// Función para subir la imagen a Firebase Storage
const uploadImage = async (file: File) => {
  const imageRef = storageRef(storage, `images/${file.name}`);
  await uploadBytes(imageRef, file);
  return await getDownloadURL(imageRef);
};

// Función para abrir el input de archivos al hacer clic en el botón
const openFileInput = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/jpeg';
  input.style.display = 'none';
  input.onchange = (e) => handleFileUpload(e);
  document.body.appendChild(input);
  input.click();
  document.body.removeChild(input);
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
