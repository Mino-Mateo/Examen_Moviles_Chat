<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <!-- Inicio de sesion -->
      <ion-list>
        <ion-item>
          <ion-label position="floating">Correo Electrónico</ion-label>
          <ion-input v-model="email" type="email" required></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position="floating">Contraseña</ion-label>
          <ion-input v-model="password" type="password" required></ion-input>
        </ion-item>
      </ion-list>
      <ion-button expand="full" @click="login">Iniciar Sesión</ion-button>

      <!-- Google -->
      <ion-button expand="full" color="danger" @click="signInWithGoogle">
        <ion-icon slot="start"></ion-icon>
        Iniciar Sesión con Google
      </ion-button>

      <!-- Registro -->
      <ion-button expand="full" color="secondary" @click="goToRegisterPage">
        Ir a Registro
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup>
// Importaciones
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { signInWithEmailAndPassword, signInWithRedirect, getRedirectResult, GoogleAuthProvider } from 'firebase/auth';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonInput, IonButton } from '@ionic/vue';
import { auth } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Capacitor } from '@capacitor/core';

const router = useRouter();
const email = ref('');
const password = ref('');

// Iniciar sesion
const login = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;

    // Verificar si esta registrado
    if (user && !user.emailVerified) {
      await sendEmailVerification(user);

      // Redirigir al la pagina de verificacion del email
      router.push('/verify-email');
    } else {
      router.push('/chat');
    }
  } catch (error) {
    console.error('Error al iniciar sesión:', error.message);
  }
};

// Autenticacion cambio de pantalla
onAuthStateChanged(auth, (user) => {
  if (user && user.emailVerified) {
    router.push('/chat');
  }
});

// Inicar con google
const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    if (Capacitor.isNativePlatform()) {
      await signInWithRedirect(auth, provider);
    } else {
      await signInWithPopup(auth, provider);
    }
  } catch (error) {
    console.error('Error al iniciar sesión con Google:', error);
    alert('Error al iniciar sesión con Google. Intenta nuevamente.');
  }
};

// Manejar el resultado de la redirección
onMounted(async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      const user = result.user;
      console.log('User:', user);
      router.push('/chat');
    }
  } catch (error) {
    console.error('Error during Google login:', error);
    alert('Error during Google login: ' + error.message);
  }
});

//Cambiar a la pagian del registro
const goToRegisterPage = () => {
  router.push('/register');
};
</script>

<style scoped>
ion-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

ion-content {
  width: 100%;
  padding: 16px;
}

ion-list {
  width: 100%;
}
</style>
