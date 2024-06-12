<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Login/Register</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Login/Register</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <strong>{{ isLogin ? 'Login' : 'Register' }}</strong>
        <ion-input v-model="email" type="email" placeholder="Email"></ion-input>
        <ion-input v-model="password" type="password" placeholder="Password"></ion-input>
        <ion-button @click="handleAuth">{{ isLogin ? 'Login' : 'Register' }}</ion-button>
        <ion-button @click="handleGoogleAuth">Sign in with Google</ion-button>
        <p @click="toggleAuthMode">{{ isLogin ? 'Create an account' : 'Already have an account?' }}</p>
        <ion-toast :is-open="showToast" :message="toastMessage" duration="2000" position="top"></ion-toast>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonToast } from '@ionic/vue';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  databaseurl: import.meta.env.VITE_DATABASEURL,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementid: import.meta.env.VITE_MEASUREMENTID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const email = ref('');
const password = ref('');
const isLogin = ref(true);
const showToast = ref(false);
const toastMessage = ref('');

const handleAuth = async () => {
  try {
    if (isLogin.value) {
      await signInWithEmailAndPassword(auth, email.value, password.value);
      toastMessage.value = 'Login successful';
    } else {
      await createUserWithEmailAndPassword(auth, email.value, password.value);
      toastMessage.value = 'Registration successful';
    }
    showToast.value = true;
  } catch (error) {
    if (error instanceof Error) {
      toastMessage.value = error.message;
    } else {
      toastMessage.value = 'An unknown error occurred';
    }
    showToast.value = true;
  }
};

const handleGoogleAuth = async () => {
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    toastMessage.value = 'Google sign-in successful';
    showToast.value = true;
  } catch (error) {
    if (error instanceof Error) {
      toastMessage.value = error.message;
    } else {
      toastMessage.value = 'An unknown error occurred';
    }
    showToast.value = true;
  }
};

const toggleAuthMode = () => {
  isLogin.value = !isLogin.value;
};
</script>

<style scoped>
#container {
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container ion-input {
  margin: 10px 0;
}

#container ion-button {
  margin: 10px 0;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  color: #8c8c8c;
  margin: 0;
  cursor: pointer;
}
</style>
