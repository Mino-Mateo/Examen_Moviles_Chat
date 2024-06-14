<template>
  <ion-app>
    <ion-router-outlet></ion-router-outlet>
  </ion-app>
</template>

<script setup>
import { defineComponent } from 'vue';
import { IonApp, IonRouterOutlet } from '@ionic/vue';

defineComponent({
  components: {
    IonApp,
    IonRouterOutlet
  }
});
</script>
