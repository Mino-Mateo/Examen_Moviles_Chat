<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <ion-item>
          <ion-label position="floating">Email</ion-label>
          <ion-input v-model="email" type="email" />
        </ion-item>
        <ion-item>
          <ion-label position="floating">Password</ion-label>
          <ion-input v-model="password" type="password" />
        </ion-item>
      </ion-list>
      <ion-button expand="full" @click="login">Login</ion-button>
      <ion-button expand="full" @click="goToRegister">Register</ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonInput, IonButton } from '@ionic/vue';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const email = ref("");
const password = ref("");
const router = useRouter();

const login = async () => {
  const auth = getAuth();
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push("/chat");
  } catch (error) {
    console.error("Login error:", error);
    alert("Failed to login. Please check your credentials and try again.");
  }
};

const goToRegister = () => {
  router.push("/register");
};
</script>

<style scoped></style>
