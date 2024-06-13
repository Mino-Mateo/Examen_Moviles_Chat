<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button defaultHref="/login"></ion-back-button>
                </ion-buttons>
                <ion-title>Registro</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
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

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonInput, IonButton, IonButtons, IonBackButton } from '@ionic/vue';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase';

const router = useRouter();
const username = ref('');
const email = ref('');
const password = ref('');

const register = async () => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
        const user = userCredential.user;

        // Update user profile
        await updateProfile(user, {
            displayName: username.value
        });

        // Save user info to Firestore
        await setDoc(doc(db, 'users', user.uid), {
            username: username.value,
            email: email.value
        });

        alert('Usuario registrado exitosamente');
        router.push('/login');
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        let errorMessage = 'Error al registrar usuario.';

        // Manejo de errores específicos de Firebase
        if (error.code === 'auth/invalid-email') {
            errorMessage = 'El formato del correo electrónico es inválido.';
        } else if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'El correo electrónico ya está en uso.';
        } // Puedes agregar más casos según tus necesidades

        alert(errorMessage);
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
