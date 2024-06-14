# 💻🔥🌎 Chat Global en tiempo real Firebase

Un Chat Global en tiempo real realizado en Ionic-Vue-Firebase, con un aplicativo móvil.

![Logo](./Assets/Logo.png)

## 📒 Funciones

- Iniciar con credenciales de correo y Google
- Enviar fotos
- Enviar PDF´s
- Enviar Ubicación
- Deploy en Android
- Deploy en Web
- El tamaño limite de los archivos es 5 MB y solo puden cargarse archivos de tipo pdf o jpeg

## 💻 Tecnologías

**😀 Cliente:**
Ionic - Android - ReadME - Html - CSS - Javascript - Typescript

[![Tecnologías](https://simpleskill.icons.workers.dev/svg?i=ionic,android,readme,html5,CSS3,javascript,typescript)](https://skillicons.dev)

**🖥️ Servidor:**
Vue - Firebase - NPM - Javascript - Typescript - Git - Capacitor

[![Tecnologías](https://simpleskill.icons.workers.dev/svg?i=vuedotjs,firebase,npm,javascript,typescript,git,capacitor)](https://skillicons.dev)

## ⏬ Instalacion

Clona el proyecto

```bash
  git clone https://github.com/Mino-Mateo/Examen_Moviles_Chat.git
```

Ve a la carpeta del proyecto

```bash
  cd Chat_Examen
```

Instala las dependencias

```bash
  npm install
```

## 🛑 ADVERTENCIA

Si no tienes ionic puedes instalarlo con el siguiente comando:

```bash
  npm install -g @ionic/cli
```

Recuerda la aplicacion se despliega en con el comando

```bash
  ionic serve
```

Si quieres que se despliegue en tu servicio de Firebase recuerda crear en la carpeta del proyecto un archivo .env

```bash
 New-Item .env
```

Todo esto es necesario para que pueda funcionar correctamente

## 🍃 Variables de Entorno

Para ejecutar este proyecto necesitaras dirijirte a archivo .env y colocar tus variables de entorno de la siguiente manera:

```js
VITE_API_KEY: "API_KEY";
VITE_AUTH_DOMAIN: "DOMINIO";
VITE_PROJECT_ID: "ID";
VITE_STORAGE_BUCKET: "Storage";
VITE_MESSAGING_SENDER_ID: "ID_Mensaje";
VITE_APP_ID: "APP_ID";
VITE_MEASUREMENTID: "ID_Medida";
```

Si no sabes donde se encuentran tus variables de entorno dirigete:

```bash
  https://firebase.google.com/?hl=es-419
```

Inicia sesion y selecciona tu proyecto

```bash
 Descripción Genreal > Configuración del proyecto > [Selecciona tu proyecto web]
```

Y podras ver tus variables de entorno lista para usarse
![App Screenshot](./Assets/entorno.PNG)

## 🧩 Uso/Ejemplos

### 😀 Login

![App Screenshot](./Assets/LoginMovil.jpg)
![App Screenshot](./Assets/LoginWeb.PNG)

### ✍️ Registro

![App Screenshot](./Assets/RegistroMovil.jpg)
![App Screenshot](./Assets/RegistroWeb.PNG)

### 📲 Chat

![App Screenshot](./Assets/ChatMovil.jpg)
![App Screenshot](./Assets/ChatWeb.PNG)

## 🌎 Demo

Si quieres probar la aplicación puedes hacerlo desde el siguiente enlace:

```link
 https://epn-chat.web.app/
```

O si quieres probar el proyecto en Moviles puedes hacerlo desde aqui para descargar la APK

```link
 https://github.com/Mino-Mateo/Examen_Moviles_Chat/releases/tag/APK
```

## 🎥 Video Demostrativo

![Video](./Assets/video_demostrativo.mp4)
