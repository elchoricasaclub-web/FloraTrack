#!/bin/bash

# ==============================================================================
# Script de Configuración de Lifecycle Management para GCS
# Propósito: Optimizar costos moviendo backups a Nearline y Coldline
# Proyecto: FloraTrack
# ==============================================================================

# Detener la ejecución si ocurre un error
set -e

# Asegúrate de configurar el nombre de tu bucket de backups aquí (SIN gs://)
PROJECT_ID=$(gcloud config get-value project)
DEFAULT_BUCKET="${PROJECT_ID}-firestore-backups"
BUCKET_NAME=${1:-$DEFAULT_BUCKET}

if [ -z "$BUCKET_NAME" ]; then
    echo "Error: No se ha podido determinar el nombre del bucket."
    echo "Uso: ./apply_lifecycle.sh [NOMBRE_DEL_BUCKET]"
    exit 1
fi

echo "============================================================"
echo " Aplicando Lifecycle Policy al bucket: gs://$BUCKET_NAME"
echo "============================================================"
echo " - A los 30 días: Mover a Nearline"
echo " - A los 90 días: Mover a Coldline"
echo " - A los 365 días: Eliminar (Opcional, según retención GACP)"
echo "------------------------------------------------------------"

# Aplicar la configuración de ciclo de vida usando gsutil o gcloud storage
# Se utiliza el nuevo comando 'gcloud storage' recomendado sobre gsutil
if gcloud storage buckets describe "gs://$BUCKET_NAME" &>/dev/null; then
    gcloud storage buckets update "gs://$BUCKET_NAME" --lifecycle-file=lifecycle_policy.json
    echo ""
    echo "✅ Política de ciclo de vida aplicada exitosamente."
    echo "Puedes verificar la configuración actual con:"
    echo "gcloud storage buckets describe gs://$BUCKET_NAME --format='default(lifecycle)'"
else
    echo "❌ Error: El bucket gs://$BUCKET_NAME no existe o no tienes permisos."
    echo "Por favor, crea el bucket primero."
    exit 1
fi
