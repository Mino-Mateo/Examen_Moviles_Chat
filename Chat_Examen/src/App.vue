<template>
  <ion-app>
    <ion-router-outlet></ion-router-outlet>
  </ion-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IonApp, IonRouterOutlet } from '@ionic/vue';

export default defineComponent({
  components: {
    IonApp,
    IonRouterOutlet,
  }
});
</script>
