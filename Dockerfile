# ===============================================
# ETAPA 1: BUILDER (Compilación y Generación del Servidor)
# Utilizamos una imagen Node.js completa para el proceso de build.
# ===============================================
FROM node:20 as builder
WORKDIR /app

# Copiar archivos de manifiesto para instalar dependencias primero
# Esto optimiza el uso de la caché de Docker
COPY package*.json .
# Instalar dependencias
RUN npm install

# Copiar el código fuente restante
COPY . .

# Comando de Build de Astro (generará los archivos estáticos en dist/
# y el servidor Node.js/Node Adapter en entry.mjs o similar)
RUN npm run build

# ===============================================
# ETAPA 2: PRODUCCIÓN (Servidor de Ejecución Final)
# Usamos una imagen Node.js mínima (slim) para reducir el tamaño final
# y minimizar la superficie de ataque.
# ===============================================
FROM node:20-slim
WORKDIR /app

# Establecer las variables de entorno
# HOST=0.0.0.0 permite que el servidor escuche en todas las interfaces (necesario para Docker)
# PORT puede ser sobrescrito por Dokploy, por defecto 3000
ENV HOST=0.0.0.0
ENV PORT=3000

# Exponer el puerto de escucha de la aplicación
EXPOSE ${PORT}

# Copiar SÓLO los archivos necesarios de la etapa 'builder'
# 1. Copiar los archivos de manifiesto para la ejecución
COPY package*.json .
# 2. Copiar solo las dependencias de producción (más seguro y pequeño)
RUN npm install --omit=dev

# 3. Copiar la salida del build de Astro desde la etapa builder
# El adaptador de Node.js de Astro genera la carpeta 'dist' con el servidor SSR
COPY --from=builder /app/dist ./dist


# Comando de inicio: Ejecuta el servidor Node.js generado por Astro
# El comando exacto puede variar, pero generalmente es node [entry file]
# Asume que el punto de entrada es el archivo principal generado por el adaptador.
CMD ["node", "./dist/server/entry.mjs"]
# Si el adaptador Node.js de Astro es 'standalone', el entry file es ./entry.mjs:
# CMD ["node", "./entry.mjs"]
