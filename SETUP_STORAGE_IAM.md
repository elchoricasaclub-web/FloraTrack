# Instructivo: Configuración de Bucket GCS y Permisos IAM para Backups de Firestore

Para que el cron job de Firebase Functions o Cloud Scheduler pueda ejecutar la exportación programada y depositar los backups de la base de datos de Firestore en un bucket de Google Cloud Storage (GCS), debe configurar los siguientes recursos e identificar las cuentas de servicio adecuadas.

## 1. Crear el Bucket de Google Cloud Storage (GCS)

La función de exportación requiere un bucket donde los datos van a ser archivados.

1.  **Crear el bucket vía línea de comandos (gcloud CLI)**:
    Reemplace `[TU_ID_DE_PROYECTO]` con su ID del proyecto de GCP y `[NOMBRE_DEL_BUCKET]` con un nombre globalmente único.

    ```bash
    gsutil mb -p [TU_ID_DE_PROYECTO] -l us-central1 -b on gs://[NOMBRE_DEL_BUCKET]
    ```

    *Nota: `us-central1` es solo un ejemplo. Idealmente, el bucket debe ubicarse en la misma región multizona o zona donde se encuentra su instancia de Firestore para evitar costos de red inter-regionales.*

2.  *(Opcional pero Recomendado)* **Desplegar políticas de retención (Lifecycle)**:
    Si desea rotar automáticamente y borrar backups con más de 30 días, configure una política Lifecycle. 
    ```bash
    gsutil lifecycle set lifecycle.json gs://[NOMBRE_DEL_BUCKET]
    ```
    *Contenido ejemplo `lifecycle.json`:*
    ```json
    {
      "rule":
      [
        {
          "action": {"type": "Delete"},
          "condition": {"age": 30}
        }
      ]
    }
    ```

## 2. Configurar los Permisos IAM Esenciales

En el ecosistema de GCP, hay **dos cuentas de servicio** involucradas en este flujo:
A) La **cuenta de servicio que ejecuta la Cloud Function** (usualmente la cuenta por defecto de App Engine o una Custom Service Account).
B) El **agente de servicio administrado por Firestore** o la **cuenta por defecto de App Engine** (que Google invoca internamente para escribir al Storage).

### A. Permisos para la Cuenta de Servicio de la Cloud Function

La función que invoca la exportación necesita poder decirle a Firestore "Inicia un export". 
Asumiendo que utilizamos la cuenta de servicio por defecto (o cuenta del sistema para App Engine) `[TU_ID_DE_PROYECTO]@appspot.gserviceaccount.com`:

```bash
# Asigne el rol de Import/Export Admin (Datastore) para iniciar operaciones de exportación.
gcloud projects add-iam-policy-binding [TU_ID_DE_PROYECTO] \
    --member="serviceAccount:[TU_ID_DE_PROYECTO]@appspot.gserviceaccount.com" \
    --role="roles/datastore.importExportAdmin"
```

### B. Permisos de Escritura del Bucket (Storage Object Admin)

El servicio subyacente que extrae la base de datos de Firestore y la sube físicamente a su Bucket GCS (a menudo enlazado a la misma cuenta de App Engine `[TU_ID_DE_PROYECTO]@appspot.gserviceaccount.com` o una cuenta nativa de Datastore) **debe tener permisos para escribir (crear objetos) en el directorio del Storage.**

```bash
# Otorgar Storage Object Admin sobre el Bucket de Backup a la cuenta de servicio de escritura
gsutil iam ch serviceAccount:[TU_ID_DE_PROYECTO]@appspot.gserviceaccount.com:objectAdmin gs://[NOMBRE_DEL_BUCKET]
```

*Si usas la Cloud Function bajo una identidad distinta, reemplaza `[TU_ID_DE_PROYECTO]@appspot.gserviceaccount.com` en los comandos anteriores por el email en cuestión, como `firestore-backup-job@[TU_ID_DE_PROYECTO].iam.gserviceaccount.com`.*

## 3. Resumen y Flujo de Verificación

1. **Variables de entorno:** Su archivo `functions/.env` debe tener asignada la constante de bucket que coincida exactamente con la URL de protocolo Storage, ej: `BACKUP_BUCKET_NAME="gs://[NOMBRE_DEL_BUCKET]"`.
2. Verifique la política de IAM a nivel de proyecto:
   ```bash
   gcloud projects get-iam-policy [TU_ID_DE_PROYECTO]  \
    --flatten="bindings[].members" \
    --format='table(bindings.role)' \
    --filter="bindings.members:[TU_ID_DE_PROYECTO]@appspot.gserviceaccount.com"
   ```
   *Debe de incluir: `roles/datastore.importExportAdmin`.*
3. Verifique el permiso local del bucket específico:
   ```bash
   gsutil iam get gs://[NOMBRE_DEL_BUCKET]
   ```
   *Debe validar a `objectAdmin` sobre el actor de servicio.*

Una vez configurada esta infraestructura, el cron job automatizado de Cloud Scheduler a través de **Firebase Functions o gcloud cli** invocado por la sintaxis implementada, contará con todos los privilegios requeridos para descargar el Full Database Snapshot sin lanzar excepciones por denegación de permisos (`403 Forbidden`).
