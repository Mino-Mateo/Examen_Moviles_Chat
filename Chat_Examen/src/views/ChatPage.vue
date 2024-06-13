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
          <ion-img v-if="message.type === 'image'" :src="message.fileUrl"></ion-img>
          <ion-button v-if="message.type === 'pdf'" @click="downloadFile(message.fileUrl)">
            Descargar PDF
          </ion-button>
          <ion-label v-if="message.type === 'location'">
            <a :href="message.text" target="_blank">Ver ubicación</a>
          </ion-label>
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
          Adjuntar Archivo
        </ion-button>
        <ion-button @click="sendLocation">
          Enviar Ubicación
        </ion-button>
        <input type="file" accept="image/jpeg,application/pdf" @change="handleFileUpload" ref="fileInput" style="display: none">
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
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

// Referencia a la colección de mensajes
const messagesCollection = collection(db, 'messages');

// Lista de mensajes ordenados por timestamp
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

// Referencia al input de archivo
const fileInput = ref<HTMLInputElement | null>(null);

// Función para enviar un nuevo mensaje
const sendMessage = async () => {
  if (newMessageValue.value.trim() !== '' || selectedFile) {
    let fileUrl = null;
    let fileType = 'text';

    if (selectedFile) {
      fileUrl = await uploadFile(selectedFile);
      fileType = selectedFile.type.includes('image') ? 'image' : 'pdf';
    }

    await addDoc(messagesCollection, {
      sender: currentUser,
      senderName: auth.currentUser?.displayName || 'Usuario Anónimo',
      text: newMessageValue.value,
      fileUrl: fileUrl,
      type: fileType,
      timestamp: new Date().toISOString()
    });

    newMessageValue.value = '';
    selectedFile = null;
  }
};

// Función para manejar la carga de archivos
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    if (file.size <= 5 * 1024 * 1024 && (file.type === 'image/jpeg' || file.type === 'application/pdf')) {
      selectedFile = file;
    } else {
      alert('El archivo debe ser una imagen JPEG o un PDF y no debe superar los 5 MB.');
    }
  }
};

// Función para subir el archivo a Firebase Storage
const uploadFile = async (file: File) => {
  const fileRef = storageRef(storage, `files/${file.name}`);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
};

// Función para abrir el input de archivos al hacer clic en el botón
const openFileInput = () => {
  fileInput.value?.click();
};

// Función para descargar el archivo PDF
const downloadFile = (url: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = 'archivo.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Función para enviar la ubicación actual
const sendLocation = async () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      await addDoc(messagesCollection, {
        sender: currentUser,
        senderName: auth.currentUser?.displayName || 'Usuario Anónimo',
        text: `https://www.google.com/maps?q=${latitude},${longitude}`,
        type: 'location',
        timestamp: new Date().toISOString()
      });
    }, (error) => {
      alert('Error obteniendo la ubicación: ' + error.message);
    });
  } else {
    alert('La geolocalización no es soportada por este navegador.');
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
