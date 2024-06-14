<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Registro</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <!-- Registro de usuario -->
            <ion-list>
                <ion-item>
                    <ion-label position="floating">Nombre de Usuario</ion-label>
                    <ion-input v-model="username" required></ion-input>
                </ion-item>
                <ion-item>
                    <ion-label position="floating">Correo Electrónico</ion-label>
                    <ion-input v-model="email" type="email" required></ion-input>
                </ion-item>
                <ion-item>
                    <ion-label position="floating">Contraseña</ion-label>
                    <ion-input v-model="password" type="password" required></ion-input>
                </ion-item>
            </ion-list>
            <ion-button expand="full" @click="register">Registrarse</ion-button>
        </ion-content>
    </ion-page>
</template>
<!--Scripts -->
<script setup>
// Importaciones
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonInput, IonButton } from '@ionic/vue';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase';

const router = useRouter();
const username = ref('');
const email = ref('');
const password = ref('');

// Registro de usuario
const register = async () => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
        const user = userCredential.user;

        // Actualizar nombre en Firebase
        await updateProfile(user, {
            displayName: username.value
        });

        // Correo de verificacion
        await sendEmailVerification(user);

        // Guardar en Firebase
        await setDoc(doc(db, 'users', user.uid), {
            username: username.value,
            email: email.value
        });

        alert('Usuario registrado exitosamente. Se ha enviado un correo de verificación.');
        router.push('/login');
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        alert(`Error al registrar usuario: ${error.message}`);
    }
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
