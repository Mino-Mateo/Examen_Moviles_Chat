import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.epn.chat",
  appName: "Chat_examen",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
};

export default config;
