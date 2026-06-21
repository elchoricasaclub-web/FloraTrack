# Guía de Configuración IAM (Google Cloud Console)
## Asignación del rol 'Cloud Datastore Import Export Admin'

Para que la Cloud Function de Firebase pueda solicitar y ejecutar la exportación total de la base de datos Firestore sin errores de acceso (`403 Permission Denied`), es obligatorio otorgar a su cuenta de servicio el rol especializado **Cloud Datastore Import Export Admin**. 

A continuación, encontrará los pasos exactos para configurar esto utilizando la interfaz visual de Google Cloud Console.

### Paso 1: Acceder al Proyecto en Google Cloud Console
1. Abra el navegador e ingrese a [Google Cloud Console](https://console.cloud.google.com/).
2. Inicie sesión con una cuenta de Google que tenga permisos de propietario (`Owner`) o administrador de IAM (`IAM Admin`) en el proyecto.
3. En la barra superior, haga clic en el **menú desplegable de proyectos** y seleccione el proyecto de Google Cloud que corresponde a su instancia de Firebase.

### Paso 2: Ir a la página de Configuración de IAM
1. Haga clic en el **Menú de navegación** (el ícono de hamburguesa en la esquina superior izquierda).
2. Desplácese hacia abajo o busque la sección **IAM y administración** (IAM & Admin).
3. Seleccione **IAM**. 

### Paso 3: Identificar la Cuenta de Servicio Pertinente
Las Firebase Functions (de 1ra y 2da generación típicamente) utilizan la **cuenta de servicio predeterminada de App Engine** para acceder a los recursos del proyecto, a menos que especifique otra.
El correo de esta cuenta sigue el formato:
> `[ID_DEL_PROYECTO]@appspot.gserviceaccount.com`

*Nota: Busque su `ID_DEL_PROYECTO` en la página principal o desplegable de proyectos de la consola (ej. `mi-app-12345` => `mi-app-12345@appspot.gserviceaccount.com`).*

### Paso 4: Modificar o Agregar Permisos
Revise la lista de cuentas (Principales) en la tabla inferior:

**Si la cuenta ya existe en la lista (Recomendado):**
1. Encuentre la fila correspondiente a `...autoridad de la cuenta de servicio de App Engine...` o el correo con formato `@appspot.gserviceaccount.com`.
2. Haga clic en el ícono de **Lápiz** (Editar principal) en el lado derecho de esa misma fila.
3. En el panel que se abre a la derecha, haga clic en el botón **+ AÑADIR OTRO ROL** (Add another role).

**Si la cuenta NO aparece en la lista:**
1. En la parte superior de la página, haga clic en el botón **+ OTORGAR ACCESO** (Grant Access).
2. En el campo emergente **Nuevas principales**, escriba o pegue el correo electrónico de la cuenta de servicio (`[ID_DEL_PROYECTO]@appspot.gserviceaccount.com`).

### Paso 5: Asignar el Rol de Exportación
1. Haga clic en el cuadro que dice **Seleccionar un rol** (Select a role).
2. Aparecerá un filtro tipo buscador, escriba la palabra clave: **Datastore** o **Import Export**.
3. En los resultados, busque y seleccione la opción:
   👉 **Administrador de importación y exportación de Cloud Datastore** 
   *(Si su consola está en inglés, aparecerá como: `Cloud Datastore Import Export Admin`)*.

### Paso 6: Guardar su Configuración
1. Una vez añadido y confirmado el rol en la lista, haga clic en el botón azul de **GUARDAR** (Save).
2. La pantalla cargará unos segundos y le mostrará un mensaje indicando que las políticas se han actualizado correctamente.

### Paso 7: (Opcional) Verificación de Storage
El rol añadido le da permiso a la Cloud Function para "iniciar el trabajo de backup", pero para que el trabajo logre guardar el snapshot, Datastore necesita **permisos para escribir en el Storage**.

Cerciórese que al editar la misma cuenta también posea el rol de **Creador de objetos de Storage** o **Administrador de Cloud Storage**, caso contrario, repita el *Paso 4 y 5*, agregando dicho rol sobre el Bucket de `GCS` destino utilizando la pestaña de Storage directamente (o global en IAM).

---
✅ **¡Listo!** Una vez implementados estos cambios en la Consola, los siguientes triggers programados de `Cloud Scheduler` o `Firebase Functions` invocarán exitosamente el Snapshot de Firestore evitando el denegado de permisos.
