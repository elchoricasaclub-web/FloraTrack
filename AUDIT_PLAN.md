# FloraTrack - Auditoría General y Plan de Intervención

## 1. Equipo Evaluador
- Arquitecto Full-Stack
- Product Manager (SaaS Agrícola / GACP / BPA)
- UX/UI Designer
- Especialista en Seguridad y Rendimiento
- Growth / Product Strategist

## 2. Fase 1: Auditoría y Diagnóstico Crítico
Tras revisar el código fuente (`MainLayout.tsx`, `types/`, `store/`, `components/`), se ha detectado lo siguiente:

### Riesgos y Problemas Críticos
1. **Estado Desconectado y Duplicidad de Modelos**: La aplicación maneja `Lote` (dentro de MainLayout) y `CropBatch` (dentro de ComplianceStore) como entidades separadas. El Dashboard usa `CropBatch`, pero el usuario crea `Lote` en la vista de Lotes. Están desconectados.
2. **Falta de Persistencia Real**: Los registros de Fincas, Lotes y Actividades viven en un `useState` local del `MainLayout.tsx`. Al recargar la página, se pierden. No se guardan ni en un Store global, ni en LocalStorage, ni en Firebase (a pesar de existir constantes de Firestore).
3. **Validación de Formularios Deficiente**: Las vistas permiten envíos casi vacíos o, si fallan (ej. `if (!nombre) return;`), el usuario no recibe ninguna alerta o feedback visual indicando qué campo falta.
4. **Acoplamiento UI (MainLayout Monolítico)**: `MainLayout.tsx` tiene más de 1200 líneas. Mezcla el menú lateral (Sidebar), el layout y las vistas complejas CRUD (Fincas, Lotes, Actividades). Es muy difícil de mantener y escalar.

### Oportunidades UX/UI y Growth
- **Trazabilidad Incompleta Visulamente**: Falta enlazar directamente la creación de un lote con la recolección de evidencias (SOP) desde un flujo UI continuo.
- **Validaciones Rigurosas**: Todo registro de lote, finca o actividad debe ser inmutable y estar firmado digitalmente o tener un log de auditoría (ALCOA+). Hoy en día la "firma" se autogenera sin interacción de seguridad real.
- **Dashboard SaaS Leader**: Faltan KPIs más visuales de estado de tareas u operaciones por hacer (Calendario).

## 3. Fase 2: Plan de Intervención (Priorizado)

### Nivel 1: Crítico (Correcciones Estructurales y Validaciones)
1. **Mejorar Validaciones en MainLayout**: Modificar los formularios de Fincas, Lotes y Actividades para no permitir registros incompletos, mostrando mensajes de error en la UI.
2. **Conectar Lotes con Batches del Dashboard**: Adaptar la creación de Lotes para que impacte el listado de `CropBatches` del módulo de cumplimiento (ComplianceStore) para tener trazabilidad end-to-end.

### Nivel 2: Alto Impacto (UX/UI y Arquitectura)
1. **Refactorización de Layout**: Separar `FincasView`, `LotesView` y `ActividadesView` si el volumen de código interfiere con la confiabilidad.
2. **Notificaciones (Feedback UI)**: Integrar componentes de error y éxito visual claro. Garantizar que cada "Guardar" tenga feedback.

### Nivel 3: Estratégico (SaaS readiness)
1. **Estructura para multi-tenant**: Reforzar el uso del modelo Finca -> Lote -> Cultivo -> Actividad.
2. **Dashboard de Alta Dirección**: Incluir gráficos/tarjetas que hablen de cumplimiento normativo (GACP/GMP). (Ya iniciado, pero mejorable).

## 4. Próximos pasos inmediatos (Fase 3: Intervención del Código)
A continuación, procederé a aplicar estas mejoras en el proyecto, atacando primero las validaciones (para cumplir estrictamente con "Ningún módulo debe permitir guardar registros vacíos"), limpieza de la UI para estados vacíos/errores, y la integración de la creación de lotes al estado global.
