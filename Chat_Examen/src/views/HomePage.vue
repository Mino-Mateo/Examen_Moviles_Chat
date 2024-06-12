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
        <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton } from '@ionic/vue';
import { ref } from 'vue';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { initializeApp, getApps } from 'firebase/app';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_DATABASEURL,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENTID,
};

// Initialize Firebase if it hasn't been initialized already
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}
const auth = getAuth(app);

const email = ref('');
const password = ref('');
const isLogin = ref(true);
const errorMessage = ref('');

const handleAuth = async () => {
  try {
    errorMessage.value = '';
    if (isLogin.value) {
      await signInWithEmailAndPassword(auth, email.value, password.value);
      alert('Login successful');
    } else {
      await createUserWithEmailAndPassword(auth, email.value, password.value);
      alert('Registration successful');
    }
  } catch (error) {
    errorMessage.value = (error as Error).message;
  }
};

const handleGoogleAuth = async () => {
  try {
    errorMessage.value = '';
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    alert('Google sign-in successful');
  } catch (error) {
    errorMessage.value = (error as Error).message;
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
