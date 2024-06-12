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
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton } from '@ionic/vue';
import { ref } from 'vue';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { initializeApp } from 'firebase/app';

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

const handleAuth = async () => {
  try {
    if (isLogin.value) {
      await signInWithEmailAndPassword(auth, email.value, password.value);
      alert('Login successful');
    } else {
      await createUserWithEmailAndPassword(auth, email.value, password.value);
      alert('Registration successful');
    }
  } catch (error) { /* empty */ }
};

const handleGoogleAuth = async () => {
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    alert('Google sign-in successful');
  } catch (err) { /* empty */ }
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
