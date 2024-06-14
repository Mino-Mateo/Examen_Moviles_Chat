<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Verificación de Correo Electrónico</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <p>Se ha enviado un correo electrónico de verificación a tu cuenta. Por favor verifica tu correo electrónico
                antes de continuar.</p>
            <ion-button expand="full" @click="logout">Cerrar Sesión</ion-button>
        </ion-content>
    </ion-page>
</template>

<script setup>
// Importaciones
import { useRouter } from 'vue-router';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase';

const router = useRouter();

// Cerrar sesion
const logout = async () => {
    try {
        await signOut(auth);
        router.push('/login');
    } catch (error) {
        console.error('Error al cerrar sesión:', error.message);
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
    text-align: center;
}
</style>
