interface ImportMetaEnv {
  readonly APP_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Define la estructura de un item de navegación (ejemplo)
interface Item {
  title: string;
  subtitle: string
  image: string;
}

// Extiende la interfaz `Locals` de Astro
declare namespace App {
  interface Locals {
    api: AxiosInstance;
    global: {
      design: DesignSettingsResponse;
    };
  }
}
