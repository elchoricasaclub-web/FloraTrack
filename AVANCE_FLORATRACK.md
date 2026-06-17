# AVANCE FLORATRACK

Fecha actualización: 2026-06-16

Proyecto: `gacp-growlifecol`

## Estado actual

- Plataforma FloraTrack creada en Next.js App Router / React / TypeScript / Tailwind.
- Navegación enterprise completa con Command Center premium.
- Dashboard ejecutivo y dashboard clásico conservados.
- Módulos GACP, GMP, Calidad, Laboratorio, Inventario, Regulatorio, Documentos, IA y Sistema.
- Módulos de extracción: BHO, Live Rosin, Bubble Hash y Post Extracción.
- Módulos regulatorios: ICA, INVIMA, PEAS, MinJusticia, FNE, DIAN y Regulatoria API.
- Módulos QA: desviaciones, CAPA, riesgos, cambios, workflows, auditorías, audit trail, Part 11, documentos y firmas.
- CRUD avanzado con edición, estados, responsable, fecha, exportación JSON/CSV, auditoría y trazabilidad.
- Login local con usuarios de prueba.
- Roles y permisos RBAC.
- Auditoría del sistema y datos maestros.
- Prisma integrado con carga perezosa para no romper build cuando el cliente aún no está generado.

## Usuarios de prueba

- `admin@floratrack.com` / `admin123`
- `calidad@growlifecol.com` / `gacp123`
- `operador@growlifecol.com` / `gacp123`

## Validación reciente

- `npm run typecheck`: OK.
- `npm run lint`: OK, 0 errores y 19 warnings legacy.
- `npm run check:routes`: OK, 48 rutas verificadas en modo estático.
- `npm run functional-check:static`: OK, 48 rutas verificadas en modo estático.
- `NEXT_TELEMETRY_DISABLED=1 npm run build`: OK.
- `npm run prisma:generate`: requiere internet; en sandbox falló por DNS hacia `binaries.prisma.sh`.

## Siguiente fase recomendada

1. Ejecutar `npm install` y `npx prisma generate` en entorno local con internet.
2. Probar manualmente Command Center y rutas críticas.
3. Conectar módulos locales con APIs Prisma/Supabase/PostgreSQL.
4. Completar autenticación real y RBAC persistente.
5. Agregar exportación PDF/Excel validada para reportes, cambios, CAPA, riesgos y auditoría.
6. Fortalecer trazabilidad cruzada entre `/cambios`, `/workflows`, `/riesgos`, `/desviaciones` y `/audit-trail`.
7. Reducir warnings legacy de ESLint.

---

## Continuación ChatGPT 2026-06-16

- Se agregó `CHATGPT_HANDOFF_FLORATRACK.md` para futuros traspasos.
- Se creó el módulo `/cambios` como Control de Cambios GACP/GMP con CRUD local, validaciones QA/GxP, impacto regulatorio, riesgo, CAPA, evidencia, eficacia, métricas y exportación JSON/CSV.
- Se corrigió `/reportes-programados` agregando `expresionCron` y `zonaHoraria` al tipo/formulario.
- Se corrigió `/new-record` con `Suspense` para `useSearchParams()`.
- Se ajustó API de alertas enterprise para fechas/títulos opcionales.
- Se agregó check funcional estático y scripts npm `typecheck`, `check:routes` y `functional-check:static`.
- Se validó `npm run check:routes`, `npm run typecheck`, `npm run lint` y `NEXT_TELEMETRY_DISABLED=1 npm run build`.

## Puente Cambios -> Riesgos QRM

Se agrego conexion local entre `/cambios` y `/riesgos`:
- `/cambios` genera un borrador de riesgo QRM desde el formulario o desde una tarjeta guardada.
- El borrador se guarda en `localStorage` con clave `floratrack_bridge_cambios_to_riesgos_v1`.
- `/riesgos` importa automaticamente el borrador, precarga el formulario, elimina la clave puente y solicita revision QA antes de guardar.
- No reemplaza decision QA ni matriz QRM formal; acelera trazabilidad entre Control de Cambios y Gestion de Riesgos.


## Puente Riesgos -> Workflows QA

Se agregó conexión local entre `/riesgos` y `/workflows`:
- `/riesgos` genera un borrador de workflow QA desde el formulario de riesgo.
- El borrador se guarda en `localStorage` con la clave `floratrack_bridge_riesgos_to_workflows_v1`.
- `/workflows` importa automáticamente el borrador, precarga el formulario y elimina la clave puente.
- El flujo sugiere prioridad, SLA, responsable, módulo origen, firma electrónica, escalamiento, CAPA y audit trail.
- No reemplaza la decisión QA formal: acelera la trazabilidad desde QRM hacia ejecución operativa.


## Puente Workflows -> Audit Trail

Se agrego conexion local entre `/workflows` y `/audit-trail`:
- `/workflows` genera un borrador de evento audit trail desde el formulario o desde una tarjeta guardada.
- El borrador se guarda en `localStorage` con clave `floratrack_bridge_workflows_to_audit_trail_v1`.
- `/audit-trail` fue ampliado a modulo CRUD local con metricas, filtros, validaciones GxP, exportacion JSON e importacion automatica del borrador.
- El evento audit trail captura workflow, usuario, modulo, accion, estados, decision QA, evidencia, hash, criticidad y resultado.


## Puente Audit Trail -> Reportes Programados

Se agrego conexion local entre `/audit-trail` y `/reportes-programados`:
- `/audit-trail` genera un borrador de reporte programado desde un evento audit trail.
- El borrador se guarda en `localStorage` con clave `floratrack_bridge_audit_trail_to_reportes_v1`.
- `/reportes-programados` fue ampliado a modulo CRUD local con metricas, filtros, validaciones GxP, expresion cron, zona horaria y exportacion JSON/CSV.
- El reporte captura modulo fuente, registro, frecuencia, cron, responsables, aprobador QA, destinatarios, prioridad, firma, evidencias y referencias GxP.
