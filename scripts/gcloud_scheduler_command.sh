#!/bin/bash
# ==============================================================================
# Comando alternativo gcloud CLI para Cloud Scheduler (Autenticación OIDC)
# ==============================================================================
# En caso de no utilizar el trigger nativo pubsub.schedule() de Firebase,
# y utilizar en su lugar una función HTTP (functions.https.onRequest),
# este es el comando gcloud para crear el cron job garantizando la 
# autenticación de servicio requerida por Google Cloud.
# ==============================================================================

# Reemplace [PROJECT_ID] con el ID de su proyecto de Google Cloud.
PROJECT_ID="su-proyecto-gcp-id"
REGION="us-central1"
SERVICE_ACCOUNT="firestore-backup-sa@${PROJECT_ID}.iam.gserviceaccount.com"
FUNCTIONS_URL="https://${REGION}-${PROJECT_ID}.cloudfunctions.net/scheduledFirestoreBackup"

echo "Creando Job de Cloud Scheduler para Backup (Cada 24 horas)..."

gcloud scheduler jobs create http firestore-backup-job-daily \
  --schedule="0 0 * * *" \
  --uri="${FUNCTIONS_URL}" \
  --http-method=POST \
  --location="${REGION}" \
  --description="Backup automatizado de Firestore ejecutado cada 24 horas" \
  --time-zone="America/Bogota" \
  --oidc-service-account-email="${SERVICE_ACCOUNT}" \
  --oidc-token-audience="${FUNCTIONS_URL}"

echo "Job de Cloud Scheduler creado exitosamente."
