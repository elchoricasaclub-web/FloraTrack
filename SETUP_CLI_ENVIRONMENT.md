# Guía de Configuración CLI para el Sistema de Backup de Firestore

Esta guía proporciona los comandos exactos de Google Cloud CLI (`gcloud`) necesarios para configurar el proyecto, habilitar las APIs esenciales y preparar el entorno local para el despliegue del sistema de backup automatizado.

---

## 1. Configuración Inicial del Proyecto

Asegúrate de estar autenticado en tu cuenta de Google Cloud y establecer el proyecto correcto.

```bash
# Iniciar sesión en tu cuenta de Google Cloud
gcloud auth login

# Definir variables de entorno locales (Reemplaza con tus valores)
export PROJECT_ID="tu-project-id"
export REGION="us-central1"

# Establecer el proyecto activo en gcloud
gcloud config set project $PROJECT_ID

# (Opcional) Establecer la región por defecto
gcloud config set functions/region $REGION
```

---

## 2. Habilitación de APIs Necesarias

El sistema de backup requiere habilitar las APIs de Cloud Functions (para ejecutar la lógica), Cloud Scheduler (para el cron job) y Firestore (para interactuar con la base de datos).

```bash
# Habilitar la API de Cloud Functions (necesaria para Cloud Functions v2)
gcloud services enable cloudfunctions.googleapis.com

# Habilitar la API de Cloud Run (requerida internamente por Cloud Functions v2)
gcloud services enable run.googleapis.com

# Habilitar la API de Cloud Scheduler
gcloud services enable cloudscheduler.googleapis.com

# Habilitar la API de Cloud Build (requerida para compilar la función)
gcloud services enable cloudbuild.googleapis.com

# Habilitar la API de Firestore (si no está habilitada)
gcloud services enable firestore.googleapis.com
```

---

## 3. Preparación de Variables de Entorno Locales (.env)

Para el despliegue local de Firebase y Cloud Functions, necesitas configurar las variables de entorno. 
En el directorio `functions/`, crea o edita tu archivo `.env`.

```bash
# Dirígete al directorio de funciones
cd functions

# Crear un archivo de configuración .env
cat <<EOF > .env
# Configuración del Backup
BACKUP_FREQUENCY="every 24 hours"
BACKUP_BUCKET_NAME="gs://${PROJECT_ID}-firestore-backups"
GCP_PROJECT="${PROJECT_ID}"
EOF
```

---

## 4. Obtención de Credenciales Locales para Desarrollo (Opcional)

Si deseas probar localmente con credenciales de aplicación:

```bash
# Configurar credenciales locales de aplicación para el SDK de Google Cloud
gcloud auth application-default login
```

---

## 5. Preparación Final para Despliegue

Asegúrate de tener instalado `firebase-tools` para el despliegue de las funciones.

```bash
# Instalar Firebase CLI si no lo tienes
npm install -g firebase-tools

# Hacer login en Firebase
firebase login

# Activar tu proyecto en Firebase
firebase use $PROJECT_ID
```

¡Has completado la configuración del entorno para el despliegue! Puedes continuar con el script de Cloud Scheduler o desplegar la Cloud Function directamente usando Firebase.
