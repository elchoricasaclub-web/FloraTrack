#!/bin/bash
# ==============================================================================
# Script de Despliegue Automatizado - Cloud Scheduler para Backup de Firestore
# ==============================================================================
# Este script inicializa el entorno y despliega la Firebase Function que
# contiene el trigger de Cloud Scheduler para generar Snapshots de la base
# de datos según la frecuencia (CRON / Schedule) indicada en .env / .env.example
# ==============================================================================

set -e

# Validar ubicación y buscar los archivos de ambiente en /functions
BASE_DIR="$(pwd)"
ENV_FILE="$BASE_DIR/functions/.env"
EXAMPLE_ENV="$BASE_DIR/functions/.env.example"

if [ -f "$ENV_FILE" ]; then
  echo "[INFO] Cargando variables de entorno desde: $ENV_FILE"
  # Exportar variables leyendo línea por línea e ignorando comentarios
  export $(grep -v '^#' "$ENV_FILE" | xargs)
elif [ -f "$EXAMPLE_ENV" ]; then
  echo "[INFO] No se encontró el archivo .env."
  echo "[INFO] Utilizando configuración por defecto desde: $EXAMPLE_ENV"
  export $(grep -v '^#' "$EXAMPLE_ENV" | xargs)
else
  echo "[ERROR] No se encontró configuración de entorno en functions/"
  exit 1
fi

PROJECT_ID=$(gcloud config get-value project 2>/dev/null || echo "")

if [ -z "$PROJECT_ID" ]; then
  echo "⚠️ Advertencia: No se detectó un proyecto GCP configurado en gcloud."
  echo "Asegúrese de correr: gcloud auth login && gcloud config set project [SU_PROYECTO]"
else
  echo "Proyecto Activo: $PROJECT_ID"
fi

echo "=========================================================="
echo " Iniciando Aprovisionamiento de Backup (GACP / EU-GMP)"
echo " Frecuencia configurada  : $BACKUP_FREQUENCY"
echo " Bucket Destino          : $BACKUP_BUCKET_NAME"
echo "=========================================================="

# Habilitar servicios (requiere gcloud y permisos de IAM Owner/Editor)
echo "[1/3] Verificando habilitación de APIs de GCP (Cloud Scheduler, Functions)..."
gcloud services enable cloudscheduler.googleapis.com cloudfunctions.googleapis.com firestore.googleapis.com 2>/dev/null || echo "Habilitación omitida o requiere más permisos..."

echo "[2/3] Resolviendo dependencias de la Cloud Function..."
cd functions
# Comprobamos que exista package.json
if ! [ -f "package.json" ]; then
  echo "[ERROR] No se encontró package.json en el directorio functions."
  exit 1
fi

# Instalar y compilar el código TypeScript de firebase functions
npm install
npm run build

echo "[3/3] Desplegando en Google Cloud Scheduler (via Firebase)..."
echo "ℹ️ Firebase automáticamente creará el trabajo de Cloud Scheduler basado en pubsub.schedule()..."

# Desplegar la función "scheduledFirestoreBackup"
npx firebase deploy --only functions:scheduledFirestoreBackup --non-interactive -m "Deploy automatizado de backup scheduler"

echo ""
echo "=========================================================="
echo "✅ ¡Despliegue de automatización de respaldos Completado!"
echo "Los snapshots automáticos de Firestore han sido registrados."
echo ""
echo "Cloud Scheduler enviará la señal Pub/Sub '$BACKUP_FREQUENCY'"
echo "haciendo que los datos de FloraTrack se copien de manera"
echo "segura hacia:"
echo "➡️  $BACKUP_BUCKET_NAME"
echo "=========================================================="
exit 0
