# Guía de Configuración de Google Cloud Storage para Backups de FloraTrack

Esta guía detalla los pasos para crear un bucket en Google Cloud Storage optimizado para almacenar los backups diarios de Firestore de FloraTrack. Se incluye la configuración de reglas de ciclo de vida (Lifecycle Rules) para reducir costos y políticas de retención (Retention Policies) para proteger los datos contra modificaciones o eliminaciones accidentales.

---

## 1. Crear el Bucket de Almacenamiento

El primer paso es crear el bucket donde se exportarán los datos de Firestore.

### Usando la Consola de Google Cloud:
1. Ve a la consola de Google Cloud y selecciona tu proyecto.
2. En el menú de navegación, ve a **Almacenamiento (Storage) > Buckets**.
3. Haz clic en **CREAR BUCKET**.
4. **Nombre:** Ingresa un nombre globalmente único, por ejemplo `gs://[TU_PROYECTO_ID]-firestore-backups`.
5. **Ubicación:** Selecciona el `Region` adecuado (por ejemplo, `us-central1`). Debe coincidir con la ubicación de tu base de datos Firestore para evitar costos de transferencia de red.
6. **Clase de almacenamiento predeterminada:** Selecciona **Standard**.
7. **Control de acceso:** Selecciona **Uniforme** (recomendado) para gestionar el acceso exclusivamente a través de políticas IAM.
8. **Protección de datos:** Déjalo en la configuración predeterminada por ahora.
9. Haz clic en **CREAR**.

### Usando CLI (gcloud):
```bash
# Definir variables
export PROJECT_ID="tu-project-id"
export REGION="us-central1"
export BUCKET_NAME="${PROJECT_ID}-firestore-backups"

# Crear el bucket con clase de almacenamiento Standard
gcloud storage buckets create gs://$BUCKET_NAME \
    --project=$PROJECT_ID \
    --location=$REGION \
    --default-storage-class=STANDARD \
    --uniform-bucket-level-access
```

---

## 2. Configurar Reglas de Ciclo de Vida (Lifecycle Management)

Para optimizar los costos de almacenamiento a largo plazo de FloraTrack, configuraremos reglas que muevan automáticamente los backups antiguos a clases de almacenamiento más económicas (Nearline o Coldline) y los eliminen después de su vida útil.

### Estrategia recomendada para FloraTrack:
* **Mover a Nearline** después de 30 días (ideal para copias de seguridad a las que se accede menos de una vez al mes).
* **Mover a Coldline** después de 90 días.
* **Eliminar permanentemente** después de 365 días (si lo requiere la regulación).

### Usando la Consola de Google Cloud:
1. En la lista de Buckets, haz clic en el nombre de tu bucket de backups.
2. Selecciona la pestaña **CICLO DE VIDA (LIFECYCLE)**.
3. Haz clic en **AGREGAR UNA REGLA**.
4. **Condición:**
   * Edad: `30` días.
   * **Acción:** Cambiar la clase de almacenamiento (Set storage class) a **Nearline**.
5. Repite para Coldline (Edad: `90`, Acción: clase **Coldline**).
6. Repite para eliminación (Edad: `365`, Acción: **Eliminar objeto**).

### Usando CLI (JSON):
Crea un archivo llamado `lifecycle_policy.json`:

```json
{
  "rule": [
    {
      "action": { "type": "SetStorageClass", "storageClass": "NEARLINE" },
      "condition": { "age": 30 }
    },
    {
      "action": { "type": "SetStorageClass", "storageClass": "COLDLINE" },
      "condition": { "age": 90 }
    },
    {
      "action": { "type": "Delete" },
      "condition": { "age": 365 }
    }
  ]
}
```

Aplica la política al bucket:
```bash
gcloud storage buckets update gs://$BUCKET_NAME --lifecycle-file=lifecycle_policy.json
```

---

## 3. Configurar Políticas de Retención (Retention Policy)

Si los requerimientos regulatorios (GACP/GMP) de FloraTrack exigen que los backups sean inmutables (WORM - Write Once, Read Many) y no puedan ser borrados accidentalmente ni siquiera por administradores.

### Estrategia: Bloquear los backups durante los primeros 30 días.

### Usando la Consola de Google Cloud:
1. En los detalles del bucket, ve a la pestaña **PROTECCIÓN DE DATOS (DATA PROTECTION)**.
2. En la sección **Política de retención**, haz clic en **ESTABLECER POLÍTICA DE RETENCIÓN**.
3. Ingresa un período de retención: `30 días`.
4. Haz clic en **GUARDAR**.
5. (Opcional pero recomendado para cumplimiento) **Bloquear política (Lock):** Una vez bloqueada, la política de retención no se puede reducir ni eliminar.

### Usando CLI:
```bash
# Establecer la retención en 30 días (2,592,000 segundos)
gcloud storage buckets update gs://$BUCKET_NAME --retention-period=30d

# IMPORTANTE: Bloquear la política permanentemente (esta acción es irreversible)
# gcloud storage buckets update gs://$BUCKET_NAME --lock-retention-policy
```

---

## Resumen de la Estructura Implementada
1. Los nuevos backups de Firestore diarios entran en el bucket con clase **Standard**.
2. Estarán completamente **bloqueados y protegidos** contra eliminación o sobreescritura durante **30 días** garantizando cumplimiento para auditorías (GACP/GMP).
3. Pasados **30 días**, los backups migrarán automáticamente a **Nearline** bajando el costo.
4. Pasados **90 días**, migrarán a **Coldline** (costo mínimo).
5. A los **365 días**, se destruirán automáticamente.
