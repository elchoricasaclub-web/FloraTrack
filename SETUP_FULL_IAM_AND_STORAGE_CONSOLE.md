# Guía Completa Paso a Paso: Configuración de Roles IAM y Políticas de Bucket en Google Cloud Console

Esta guía detalla cómo configurar visualmente, desde Google Cloud Console, los permisos exactos que necesita la cuenta de servicio de Firebase (o App Engine) para poder iniciar backups automáticos desde Firestore y guardarlos de forma segura en Google Cloud Storage.

## Resumen de Roles Necesarios
1. **Cloud Datastore Import Export Admin**: Permite a la función *iniciar* la orden de exportación de la base de datos (nivel Proyecto).
2. **Storage Object Admin (Administrador de objetos de Storage)**: Permite al servicio escribir los archivos de backup en el bucket destino (nivel Bucket).

---

## Parte 1: Identificar la Cuenta de Servicio

Las Cloud Functions de Firebase utilizan por defecto la **Cuenta de servicio predeterminada de App Engine**.
Su formato de correo es:
`[ID_DE_TU_PROYECTO]@appspot.gserviceaccount.com`

*Nota: Puedes encontrar tu ID de proyecto haciendo clic en el menú desplegable superior izquierdo de la consola.*

---

## Parte 2: Otorgar 'Cloud Datastore Import Export Admin'

Este rol se debe asignar a nivel de proyecto para que el sistema reconozca que la cuenta tiene autoridad sobre Firestore.

1. Inicia sesión en [Google Cloud Console](https://console.cloud.google.com/).
2. Abre el **Menú de navegación** (icono de hamburguesa arriba a la izquierda).
3. Navega a **IAM y administración** > **IAM**.
4. En la tabla de *Principales* (Principals), busca la cuenta `[ID_DE_TU_PROYECTO]@appspot.gserviceaccount.com` (suele etiquetarse como "Autoridad de la cuenta de servicio de App Engine").
5. Haz clic en el icono del **Lápiz (Editar principal)** a la derecha de la fila de esa cuenta.
6. En el panel lateral, haz clic en **+ AÑADIR OTRO ROL** (Add another role).
7. Haz clic en el filtro "Seleccionar un rol", escribe **"Import Export"** o **"Datastore"**.
8. Selecciona el rol: **Administrador de importación y exportación de Cloud Datastore** (Cloud Datastore Import Export Admin).
9. Haz clic en el botón azul **GUARDAR** (Save).

---

## Parte 3: Configurar Políticas de Acceso para el Bucket de Backups

Para mantener la seguridad, en lugar de dar permisos de escritura sobre *todos* los buckets del proyecto, otorgaremos el rol de **Storage Object Admin** exclusivamente en el bucket específico donde se guardarán los backups.

### A. Crear el Bucket (Si aún no existe)
1. En el **Menú de navegación**, baja hasta **Cloud Storage** > **Buckets**.
2. Haz clic en **+ CREAR** (Create).
3. Asigna un nombre globalmente único (ej. `mi-app-backups-firestore`).
4. Selecciona la Región (preferiblemente la misma donde está alojado tu proyecto de Firestore, ej. `us-central1`) para evitar costos de transferencia de red.
5. Usa la configuración de control de acceso **Uniforme** (Uniform) recomendada.
6. Haz clic en **CREAR**.

### B. Otorgar 'Storage Object Admin' en el Bucket
1. En la lista de tus Buckets de Cloud Storage, haz clic sobre el **nombre de tu bucket de backups** para abrir sus detalles.
2. Navega a la pestaña secundaria llamada **PERMISOS** (Permissions).
3. Asegúrate de que estás viendo la vista por roles o principales, y haz clic en el botón **+ OTORGAR ACCESO** (Grant Access) debajo de los títulos de las pestañas.
4. En el campo **Nuevas principales** (New principals), pega exactamente el correo de tu cuenta de servicio:
   `[ID_DE_TU_PROYECTO]@appspot.gserviceaccount.com`
5. En el cajón inferior **Seleccionar un rol** (Select a role), busca y selecciona:
   **Cloud Storage** > **Administrador de objetos de Storage** (Storage Object Admin).
   *(Nota: Este rol permite crear, reemplazar y borrar registros dentro del bucket, esencial para respaldos diarios)*.
6. Haz clic en **GUARDAR** (Save).

---

## Parte 4: Comprobación Final

Para validar que la infraestructura está lista y segura:
1. En **IAM**, tu cuenta `@appspot.gserviceaccount.com` tiene el rol `Administrador de importación y exportación de Cloud Datastore`.
2. En **Cloud Storage > Buckets > [Tu Bucket] > Permisos**, tu cuenta `@appspot.gserviceaccount.com` tiene el rol `Administrador de objetos de Storage`.
3. En las variables de entorno de tu Cloud Function (o archivo `.env`), el valor de `BACKUP_BUCKET_NAME` coincide exactamente con el bucket configurado: `gs://[TU_BUCKET]`.

✅ Una vez completados estos pasos, el Job de Cloud Scheduler funcionará correctamente sin retornar errores `403 Permission Denied` durante el proceso de exportación de la base de datos.
