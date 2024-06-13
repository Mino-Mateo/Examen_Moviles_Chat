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

<!--Scripts -->
<script setup>
// Importaciones
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonInput, IonButton } from '@ionic/vue';
import { auth } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';

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
    const { user } = await signInWithPopup(auth, provider);

    if (user) {
      // Verificar si es la primera vez que el usuario inicia sesión con Google
      if (user.providerData.length === 1 && user.providerData[0].providerId === 'google.com') {
        await registerUser(user);
      }

      router.push('/chat');
    }
  } catch (error) {
    console.error('Error al iniciar sesión con Google:', error);
    alert('Error al iniciar sesión con Google. Intenta nuevamente.');
  }
};

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
