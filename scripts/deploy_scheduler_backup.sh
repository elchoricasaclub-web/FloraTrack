#!/bin/bash
# ==============================================================================
# Script de Despliegue: Google Cloud Scheduler para Backup de Firestore
# ==============================================================================
# Este script configura un trabajo programado en Cloud Scheduler que invoca
# una Cloud Function HTTP (encargada de exportar Firestore a Cloud Storage)
# cada 24 horas, asegurando la autenticación mediante OIDC con una Service Account.
# ==============================================================================

# 1. Variables de Configuración (Editar según su entorno)
PROJECT_ID="mi-proyecto-firebase-id"
REGION="us-central1"

# La Service Account que tiene permisos para invocar la función (ej. cloud function invoker)
SERVICE_ACCOUNT="firestore-backup-job@${PROJECT_ID}.iam.gserviceaccount.com"

# URL de la Cloud Function que ejecuta el backup (Ajustar nombre si es necesario)
FUNCTIONS_URL="https://${REGION}-${PROJECT_ID}.cloudfunctions.net/scheduledFirestoreBackup"

# Nombre del trabajo en Cloud Scheduler
JOB_NAME="firestore-backup-daily"

echo "==================================================================="
echo "Iniciando configuración de Cloud Scheduler para $PROJECT_ID"
echo "==================================================================="

# 2. Habilitar la API de Cloud Scheduler (si no está habilitada)
echo "[1/3] Verificando/Habilitando Cloud Scheduler API..."
gcloud services enable cloudscheduler.googleapis.com --project="${PROJECT_ID}"

# 3. Validar si el trabajo ya existe para actualizarlo o crearlo
echo "[2/3] Configurando el cron job: $JOB_NAME..."

# El patrón "0 2 * * *" ejecuta el backup todos los días a las 02:00 AM.
gcloud scheduler jobs create http "${JOB_NAME}" \
  --project="${PROJECT_ID}" \
  --location="${REGION}" \
  --schedule="0 2 * * *" \
  --time-zone="America/Bogota" \
  --uri="${FUNCTIONS_URL}" \
  --http-method=POST \
  --description="Backup automatizado diario de la base de datos Firestore" \
  --oidc-service-account-email="${SERVICE_ACCOUNT}" \
  --oidc-token-audience="${FUNCTIONS_URL}"

# Nota: Si el job ya existe, el comando anterior puede fallar. En ese caso, se puede usar 'update'.
if [ $? -ne 0 ]; then
  echo "El job ya existe o hubo un error al crearlo. Intentando actualizar..."
  gcloud scheduler jobs update http "${JOB_NAME}" \
    --project="${PROJECT_ID}" \
    --location="${REGION}" \
    --schedule="0 2 * * *" \
    --time-zone="America/Bogota" \
    --uri="${FUNCTIONS_URL}" \
    --http-method=POST \
    --description="Backup automatizado diario de la base de datos Firestore" \
    --oidc-service-account-email="${SERVICE_ACCOUNT}" \
    --oidc-token-audience="${FUNCTIONS_URL}"
fi

echo "[3/3] Despliegue completado."
echo "==================================================================="
echo "El trabajo de Cloud Scheduler '$JOB_NAME' ha sido configurado."
echo "Se ejecutará de acuerdo a la expresión CRON: 0 2 * * * (Diariamente a las 2 AM)"
echo "Autenticado vía OIDC usando: $SERVICE_ACCOUNT"
echo "==================================================================="
