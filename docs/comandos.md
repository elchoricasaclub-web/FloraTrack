# Comandos Más Usados para la Plataforma

Esta carpeta contiene los comandos esenciales para ejecutar, compilar y probar los proyectos de la plataforma (Web y Android).

## Plataforma Web (React/Vite)

La plataforma web se encuentra en el directorio `/web`.

- **Instalar dependencias:**
  ```bash
  cd web
  npm install
  ```

- **Ejecutar servidor de desarrollo:**
  ```bash
  cd web
  npm run dev
  ```
  *(El servidor se ejecuta normalmente en el puerto 5173 o 3000)*

- **Compilar para producción:**
  ```bash
  cd web
  npm run build
  ```

- **Previsualizar compilación de producción:**
  ```bash
  cd web
  npm run preview
  ```

## Plataforma Android (Kotlin/Compose)

La aplicación Android se encuentra en la raíz / en el directorio `/app`. Utilizamos Gradle para gestionar y compilar la aplicación.

- **Compilar el Applet / Proyecto:**
  Ejecutado internamente por el sistema (compila y verifica):
  ```bash
  gradle assembleDebug
  ```

- **Ejecutar pruebas unitarias locales (Robolectric):**
  ```bash
  gradle :app:testDebugUnitTest
  ```

- **Verificar pruebas visuales (Roborazzi):**
  ```bash
  gradle :app:verifyRoborazziDebug
  ```

- **Grabar nuevas capturas para pruebas visuales:**
  ```bash
  gradle :app:recordRoborazziDebug
  ```

- **Limpiar el proyecto (Usar solo si hay problemas de compilación):**
  ```bash
  gradle clean
  ```

## Otros Comandos del Sistema

Estos comandos son utilizados por el entorno de Google AI Studio para operar la infraestructura:

- **Linting de Android:**
  ```bash
  gradle lint
  ```

- **Búsqueda de código cruzado (Grep):**
  ```bash
  grep -rI "Término de búsqueda" .
  ```
