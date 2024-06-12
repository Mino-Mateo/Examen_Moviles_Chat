<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>MIAU</ion-title>
      </ion-toolbar>
    </ion-header>
  </ion-page>
</template>

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
