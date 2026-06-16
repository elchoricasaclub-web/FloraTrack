# FloraTrack

FloraTrack es una app Next.js App Router con TypeScript para operación y cumplimiento GACP/GMP. El proyecto incluye Command Center premium, módulos regulatorios, extracción, QA, riesgos, CAPA, workflows, reportes, audit trail y trazabilidad.

## Rutas principales

- `/`
- `/command-center`
- `/dashboard-clasico`
- `/estado-app`
- `/bho`
- `/live-rosin`
- `/bubble-hash`
- `/post-extraccion`
- `/ica`
- `/invima`
- `/peas`
- `/minjusticia`
- `/fne`
- `/dian`
- `/reportes-programados`
- `/riesgos`
- `/cambios`
- `/workflows`
- `/regulatoria-api`

## Instalación

```bash
npm install
npx prisma generate
```

En entornos sin acceso a internet puede usarse `npm ci --ignore-scripts` solo para revisar TypeScript/lint/build estático, pero las rutas que consultan base de datos necesitan Prisma Client generado.

## Desarrollo

```bash
npm run dev
```

Abrir `http://localhost:3000`.

## Validación

```bash
npm run typecheck
npm run lint
npm run check:routes
NEXT_TELEMETRY_DISABLED=1 npm run build
```

PowerShell:

```powershell
npm run typecheck
npm run lint
npm run check:routes
$env:NEXT_TELEMETRY_DISABLED="1"; npm run build; Remove-Item Env:\NEXT_TELEMETRY_DISABLED
```

## Chequeo funcional

Chequeo estático de rutas sin servidor:

```bash
npm run functional-check:static
```

Chequeo HTTP con servidor corriendo:

```bash
npm run dev
# otra terminal
FLORATRACK_BASE_URL=http://localhost:3000 npm run functional-check
```

PowerShell para chequeo HTTP:

```powershell
$env:FLORATRACK_BASE_URL="http://localhost:3000"
npm run functional-check
Remove-Item Env:\FLORATRACK_BASE_URL
```

## Prisma

El archivo `src/lib/prisma.ts` carga Prisma de forma perezosa para permitir build estático aunque el cliente generado no exista todavía. Para usar APIs de base de datos en runtime real, ejecutar:

```bash
npx prisma generate
```

## Handoff

Leer `CHATGPT_HANDOFF_FLORATRACK.md` antes de continuar el desarrollo. Incluye cambios recientes, validaciones, comandos recomendados y pendientes técnicos.
