# CHATGPT_HANDOFF_FLORATRACK

Fecha de actualización: 2026-06-16

## Contexto

Continuar el desarrollo de FloraTrack sin reiniciar desde cero. El proyecto es una app Next.js App Router con TypeScript, Tailwind y módulos GACP/GMP, QA, regulatorio, extracción, reportes, CAPA, riesgos, workflows, audit trail y trazabilidad.

En el ZIP recibido no venía un `CHATGPT_HANDOFF_FLORATRACK.md` original en la raíz del paquete; el archivo inicial disponible fue `LEER_PRIMERO_NUEVO_CHAT.txt`, junto con `AVANCE_FLORATRACK.md`. Este archivo se crea ahora para que el siguiente traspaso sí tenga handoff explícito.

## Archivos y rutas clave

- Fuente principal: `src/app`, `src/components`, `src/lib`.
- Módulos Command Center: `src/lib/floratrackCommandModules.ts`.
- Chequeo funcional: `scripts/floratrack-functional-check.mjs`.
- Nueva ruta agregada: `src/app/cambios/page.tsx`.
- Backup interno de esta continuación: `backups/pre-continuacion-chatgpt-20260616-154442`.

## Trabajo realizado en esta continuación

1. Se inspeccionó el ZIP recibido y se confirmó que el proyecto existente debía continuarse, no reiniciarse.
2. Se revisaron rutas, navegación y módulos declarados. Se detectó que `/cambios` estaba referenciada por Command Center/navegación/check funcional, pero faltaba su página App Router.
3. Se creó el módulo `/cambios` como Control de Cambios GACP/GMP con enfoque QA/GxP:
   - CRUD local con `localStorage`.
   - Campos de solicitud, clasificación, criticidad GxP, estado, descripción, justificación, plan, aprobación QA y cierre.
   - Evaluación de impactos GACP/GMP, regulatorio, validación, documental, entrenamiento, proveedores y data integrity.
   - Reglas de validación para cambios críticos/altos, CAPA, desviaciones, evidencia, implementación, cierre y eficacia.
   - Métricas ejecutivas, búsqueda, filtros por estado y exportación JSON/CSV.
   - Enlaces operativos hacia `/riesgos`, `/workflows`, `/audit-trail` y `/reportes-programados`.
4. Se corrigió `src/app/reportes-programados/page.tsx` agregando al tipo/formulario los campos usados por UI:
   - `expresionCron`
   - `zonaHoraria`
5. Se actualizó `src/app/estado-app/page.tsx` para incluir acceso rápido a `/cambios`, `/riesgos` y `/workflows`.
6. Se endureció `src/app/api/enterprise/alerts/route.ts` para aceptar fechas opcionales y evitar títulos `undefined`.
7. Se corrigió `src/app/new-record/page.tsx` envolviendo el uso de `useSearchParams()` en `Suspense`, requerido por Next para prerender.
8. Se actualizó `scripts/floratrack-functional-check.mjs` para soportar modo estático/source-only:
   - `node scripts/floratrack-functional-check.mjs --static`
   - `node scripts/floratrack-functional-check.mjs --source-only`
   - `FLORATRACK_STATIC_ONLY=1 node scripts/floratrack-functional-check.mjs`
9. Se agregaron scripts npm útiles:
   - `npm run typecheck`
   - `npm run check:routes`
   - `npm run functional-check:static`
10. Se ajustaron exclusiones de `tsconfig.json` y `eslint.config.mjs` para no procesar backups, `.next`, `node_modules`, `dist`, `coverage`, duplicados internos ni archivos backup.
11. Se ajustó `next.config.ts` para limitar workers/concurrencia de generación estática en ambientes pequeños de VS Code/Ubuntu. Esto evitó bloqueos del build en el sandbox.

## Validaciones ejecutadas

Comandos ejecutados dentro del proyecto:

```bash
cd /mnt/data/floratrack_work/gacp-growlifecol
npm ci --ignore-scripts --no-audit --no-fund --progress=false --loglevel=error
npm run check:routes
npm run typecheck
npm run lint
NEXT_TELEMETRY_DISABLED=1 npm run build
```

Resultados:

- `npm run check:routes`: OK. Verificó 48 rutas en modo estático.
- `npm run typecheck`: OK.
- `npm run lint`: OK sin errores; quedan 19 warnings legacy de variables no usadas y dependencias de hooks.
- `npm run build`: OK. Next.js 16.2.9 compiló, ejecutó TypeScript, colectó datos con 1 worker y generó 93 páginas estáticas.
- La tabla del build incluye `/cambios` como ruta estática.

Advertencia conocida del build:

- Turbopack reporta una advertencia NFT en `src/app/api/enterprise/app-doctor/route.ts` por operaciones dinámicas de filesystem/import trace hacia `next.config.ts`. No bloquea el build. Conviene revisar ese endpoint antes de producción si se quiere eliminar el warning.

## Rutas importantes verificadas por presencia/check estático

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

## Comandos recomendados para Ubuntu / WSL

```bash
cd ~/gacp-growlifecol
npm install
npm run check:routes
npm run typecheck
npm run lint
npm run dev
```

Build de producción:

```bash
cd ~/gacp-growlifecol
NEXT_TELEMETRY_DISABLED=1 npm run build
npm start
```

Limpieza si hay caché corrupta:

```bash
cd ~/gacp-growlifecol
rm -rf .next
npm run check:routes
npm run typecheck
npm run dev
```

## Comandos recomendados para PowerShell de VS Code

```powershell
cd $HOME\gacp-growlifecol
npm install
npm run check:routes
npm run typecheck
npm run lint
npm run dev
```

Build de producción:

```powershell
cd $HOME\gacp-growlifecol
$env:NEXT_TELEMETRY_DISABLED="1"
npm run build
npm start
Remove-Item Env:\NEXT_TELEMETRY_DISABLED
```

Backup rápido antes de cambios grandes en PowerShell:

```powershell
$Stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$ProjectRoot = "$HOME\gacp-growlifecol"
$BackupRoot = "$HOME\Desktop\FloraTrack_Backups"
$BackupPath = Join-Path $BackupRoot "FloraTrack_CODE_$Stamp"
New-Item -ItemType Directory -Force -Path $BackupRoot | Out-Null
robocopy $ProjectRoot $BackupPath /E /XJ /R:2 /W:2 /XD node_modules .next .git dist out .turbo coverage /XF .env .env.local *.log
Compress-Archive -Path (Join-Path $BackupPath "*") -DestinationPath "$BackupPath.zip" -CompressionLevel Optimal
```

## Siguiente trabajo sugerido

1. Probar manualmente `/cambios` desde `/command-center` y desde navegación lateral.
2. Conectar Control de Cambios con `/workflows`, `/riesgos`, `/desviaciones`, `/capa` si se agrega, y `/audit-trail` para trazabilidad cruzada.
3. Migrar el almacenamiento local de `/cambios` a Prisma/API cuando se formalice backend.
4. Agregar exportaciones PDF/XLSX validadas para control de cambios.
5. Revisar el warning NFT del endpoint `app-doctor`.
6. Reducir los 19 warnings de lint legacy cuando se quiera dejar el repositorio sin advertencias.
