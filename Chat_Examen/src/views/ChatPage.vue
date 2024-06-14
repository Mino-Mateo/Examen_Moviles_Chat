<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/login"></ion-back-button>
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
        <input type="file" accept="image/jpeg,application/pdf" @change="handleFileUpload" ref="fileInput"
          style="display: none">
      </ion-toolbar>
    </ion-footer>

    <ion-toast :is-open="toast.isOpen" :message="toast.message" :duration="toast.duration" :color="toast.color"
      @did-dismiss="toast.isOpen = false"></ion-toast>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonList, IonItem, IonLabel, IonInput, IonButton, IonIcon, IonFooter, IonImg, IonToast } from '@ionic/vue';
import { onMounted, ref } from 'vue';
import { collection, addDoc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db, storage } from '@/firebase';
import { send } from "ionicons/icons";
import { DocumentData } from 'firebase/firestore';
import { auth } from '@/main';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Geolocation } from '@capacitor/geolocation';

const messagesCollection = collection(db, 'messages');
const messages = ref<DocumentData[]>([]);
let currentUser: string | null = null;

auth.onAuthStateChanged(user => {
  currentUser = user ? user.uid : null;
});

onSnapshot(query(messagesCollection, orderBy('timestamp', 'asc')), (snapshot) => {
  messages.value = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as DocumentData[];
});

const newMessageValue = ref<string>('');
let selectedFile: File | null = null;
const fileInput = ref<HTMLInputElement | null>(null);

const toast = ref({
  isOpen: false,
  message: '',
  duration: 3000,
  color: 'danger'
});

const showToast = (message: string, color: string = 'danger') => {
  toast.value.message = message;
  toast.value.color = color;
  toast.value.isOpen = true;
};

const sendMessage = async () => {
  if (newMessageValue.value.trim() !== '' || selectedFile) {
    let fileUrl = null;
    let fileType = 'text';

    if (selectedFile) {
      if (selectedFile.type === 'image/jpeg') {
        fileUrl = await uploadFile(selectedFile, 'images');
        fileType = 'image';
      } else if (selectedFile.type === 'application/pdf') {
        fileUrl = await uploadFile(selectedFile, 'pdf');
        fileType = 'pdf';
      } else {
        showToast('El archivo no es un formato permitido.');
        return;
      }
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
    if (fileInput.value) {
      fileInput.value.value = '';
    }
  }
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    const fileType = file.type;
    const fileName = file.name.toLowerCase();

    if (file.size <= 5 * 1024 * 1024) {
      if ((fileType === 'image/jpeg' && fileName.endsWith('.jpeg')) || fileType === 'application/pdf') {
        selectedFile = file;
      } else {
        showToast('Solo se permiten imágenes en formato JPEG o archivos PDF.');
        selectedFile = null;
        if (fileInput.value) {
          fileInput.value.value = '';
        }
      }
    } else {
      showToast('El archivo no debe superar los 5 MB.');
      selectedFile = null;
      if (fileInput.value) {
        fileInput.value.value = '';
      }
    }
  }
};

const uploadFile = async (file: File, folder: string) => {
  const fileRef = storageRef(storage, `${folder}/${file.name}`);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
};

const openFileInput = () => {
  fileInput.value?.click();
};

const downloadFile = (url: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = 'archivo.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

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

const getMessageClass = (message: DocumentData) => ({
  'message-received': message.sender !== currentUser,
  'message-sent': message.sender === currentUser
});

// Ubicacion
onMounted(() => {
  requestLocationPermission();
  getCurrentLocation();
  if ('geolocation' in navigator) {
    navigator.permissions
      .query({ name: 'geolocation' })
      .then((permissionStatus) => {
        if (permissionStatus.state === 'granted') {
          console.log('Permisos de geolocalización ya concedidos');
          getCurrentLocation();
        } else if (permissionStatus.state === 'prompt') {
          console.log('Solicitando permisos de geolocalización...');
          permissionStatus.onchange = () => {
            if (permissionStatus.state === 'granted') {
              console.log('Permisos de geolocalización concedidos');
              getCurrentLocation();
            } else {
              console.warn('Permisos de geolocalización no concedidos');
              // Manejo si los permisos no se conceden
            }
          };
          navigator.geolocation.getCurrentPosition(
            (position) => {
              console.log('Ubicación obtenida:', position.coords.latitude, position.coords.longitude);
              // Aquí puedes enviar la ubicación a tu base de datos o hacer lo que necesites
            },
            (error) => {
              console.error('Error al obtener la ubicación:', error);
              alert('Error al obtener la ubicación: ' + error.message);
            }
          );
        } else {
          console.warn('Permisos de geolocalización no concedidos');
          // Manejo si los permisos no se conceden
        }
      })
      .catch((error) => {
        console.error('Error al consultar permisos de geolocalización:', error);
        alert('Error al consultar permisos de geolocalización: ' + error.message);
      });
  } else {
    console.warn('La geolocalización no está soportada por este navegador.');
    alert('La geolocalización no está soportada por este navegador.');
  }
});

const getCurrentLocation = () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      console.log('Ubicación obtenida:', position.coords.latitude, position.coords.longitude);
      // Aquí puedes enviar la ubicación a tu base de datos o hacer lo que necesites
    },
    (error) => {
      console.error('Error al obtener la ubicación:', error);
      alert('Error al obtener la ubicación: ' + error.message);
    }
  );
};

const requestLocationPermission = async () => {
  try {
    const hasPermission = await Geolocation.checkPermissions();
    if (hasPermission.location !== 'granted') {
      await Geolocation.requestPermissions();
    }
  } catch (error) {
    console.error('Error al solicitar permisos de localización:', error);
  }
};

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
