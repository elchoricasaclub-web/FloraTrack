# Aplicar Política de Ciclo de Vida al Bucket

Para aplicar las reglas definidas en el archivo `lifecycle.json` y comenzar a mover automáticamente tus backups de Firestore a clases de almacenamiento más económicas (Nearline a los 30 días y Coldline a los 90 días), ejecuta el siguiente comando en tu terminal.

Asegúrate de reemplazar `[TU_BUCKET_ID]` con el nombre real de tu bucket (por ejemplo, `mi-proyecto-firestore-backups`).

```bash
gcloud storage buckets update gs://[TU_BUCKET_ID] --lifecycle-file=lifecycle.json
```

## Verificar la Configuración
Para confirmar que la política se aplicó correctamente, puedes ejecutar:
```bash
gcloud storage buckets describe gs://[TU_BUCKET_ID] --format="default(lifecycle)"
```
