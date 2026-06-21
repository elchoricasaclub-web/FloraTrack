# Diagnóstico Normativo, Arquitectura y Estrategia Legal - Colombia (Cannabis Medicinal)

## FASE 1: Diagnóstico Normativo (Marco Colombiano)
La operación de un centro médico especializado en cannabis en Colombia está regida estrictamente por varias normativas. Al desarrollar la plataforma, debemos diferenciar y proteger los siguientes componentes:

*   **Decreto 613 de 2017 / Decreto 811 de 2021**: Regulan el acceso seguro e informado al uso médico y científico del cannabis.
*   **Resolución 2892 de 2017**: Reglamenta técnica y operativamente el uso médico y científico del cannabis, particularmente frente a preparaciones magistrales y dispensación.
*   **Resolución 1403 de 2007 (Modelo de Gestión del Servicio Farmacéutico)**: Establece las normas para dispensación y preparaciones magistrales, y prohíbe taxativamente la venta recreativa bajo fachadas médicas.
*   **Ley 1581 de 2012 y Decreto 1377 de 2013 (Habeas Data)**: Exige un nivel alto de seguridad para datos de historia clínica por considerarse **Datos Sensibles**.

### Diferenciación Clave para el Software
1.  **Producto Terminado vs. Preparación Magistral:** El software debe distinguir si el médico formula un *Fitoterapéutico* con Registro INVIMA (Producto Terminado) o una *Preparación Magistral* (que requiere orden médica individualizada, y dispensación en farmacia con Central de Mezclas/Adecuación habilitada y certificación en BPE - Buenas Prácticas de Elaboración).
2.  **Flor vs. Extracto:** La formulación de flor seca para combustión no está contemplada como uso médico estricto en la normatividad farmacéutica corriente (sujeto a continuas actualizaciones del FNE e INVIMA). La vaporización o uso de extractos/derivados (aceites) son regulados y permitidos siempre bajo fórmula médica de control especial según concentración (THC > 1%).
3.  **Medicamentos de Control Especial (MCE):** Si el derivado de cannabis contiene una cantidad de THC superior al límite fijado (usualmente > 1%), la receta debe cumplir con los requisitos de recetarios del **Fondo Nacional de Estupefacientes (FNE)**. El software debe tener trazabilidad estricta.

## FASE 2: Diseño del Modelo de Negocio Seguro
1.  **Educativo, no Promocional:** La interfaz pública no muestra productos como "Añadir al carrito", lo cual sería incurrir en venta libre ilegal. Muestra *Servicios Médicos*.
2.  **Ruta del Paciente:** Ingresa -> Acepta términos (Firma Digital) -> Paga Cita/Agenda -> Médico Evalúa por Telemedicina (según Res. 2654/2019) -> Historia Clínica -> Formulación Cifrada -> Envío a Dispensario Habilitado.
3.  **Trazabilidad Continua:** `Lote -> Concentración -> Paciente -> Médico Prescriptor`.

## FASE 3 y 4: Módulos y Roles Arquitectónicos
El sistema operará bajo **RBAC** (Role-Based Access Control).

*   **SuperAdministrador:** Configura clínicas, médicos y permisos. No tiene acceso irrestricto a HC (Historia Clínica).
*   **Médico Prescriptor:** Validado con Registro Médico. Puede abrir HC, evaluar Riesgos/Beneficios y formular.
*   **Químico Farmacéutico (Dispensador):** Recibe la fórmula, verifica vigencia (15-30 días dependiendo el tipo), descuenta inventario de estupefacientes/cannabis, expide certificado de dispensación.
*   **Paciente:** Acceso a su HC y recetas desde el *Portal Nativo*.

## FASE 8: Estructura Óptima de Base de Datos (Relacional - PostgreSQL recomendado)
*   `users` (Id, Name, Email, PasswordHash, 2FA_Enabled)
*   `roles_and_permissions` (UserId, RoleId)
*   `medical_records` (Id, PatientId, DoctorId, ConsultationDate, EncryptedNotes)
*   `prescriptions` (Id, RecordId, FNE_FormulaNumber, IsControlled, Status[Draft, Active, Dispensed, Expired])
*   `prescription_items` (Id, PrescriptionId, ProductType[Magistral, Finished], THC_Mg, CBD_Mg, Dosage, TotalVolume)
*   `inventory.batches` (Id, Provider, CertificateOfAnalysis, THC_percentage, CBD_percentage, ExpiryDate)
*   `audit_logs` (Id, UserId, Action, Timestamp, IP, DiffState)

## FASE 9-13: UI/UX, Wireframes Automáticos y Despliegue de Código
Al construir la suite para Cannamedic, diseñamos la plataforma en **Kotlin y Jetpack Compose** para constituir la interfaz premium en Tablet o Móvil, lo que funciona de manera asombrosa en el entorno clínico y frente al paciente, sincronizándose vía API Rest (Next.js/Node.js) documentado en los repositorios externos.

### Wireframes Nativos y Flujo (Implementados en el Código):
1. **RolesLoginScreen**: Ingreso dividido por `Panel Médico` y `Portal Paciente`. Protege el acceso desde el primer momento.
2. **DoctorDashboardScreen**: 
   - Notificación CUMPLIMIENTO ACTIVO (Res. 2892)
   - Acceso Rápido a Nueva Fórmula.
   - Lista de Pacientes Cifrada.
3. **PrescriptionFormScreen**:
   - Bloqueos legales obligatorios: Validaciones en tiempo real para dosis, tipo de producto (Magistral vs Terminado) y confirmación de consentimiento.
   - Alerta visual del Decreto 613 de 2017 antes de emitir la fórmula.
4. **PatientPortalScreen**:
   - Advertencia destacada contra la automedicación.
   - Detalle de la fórmula y vía para **"Enviar a Dispensario Autorizado"**, evitando así la venta directa ilegal en el sitio web.

### Riesgos y Recomendaciones (Fase 13):
*   **Venta en Línea:** Queda estrictamente prohibida la pasarela de pagos estilo E-commerce "añadir carrito" para fórmulas magistrales, ya que requiere orden médica previa e individualizada (Res. 1403 de 2007). Nuestro software remite al *Dispensario* una vez avalada la fórmula.
*   **Historias Clínicas:** Obligatoriedad de encriptación de bases de datos *at rest* y *in transit* para cumplir Ley 1581 (Habeas Data de Datos Sensibles).

*(Todo el código nativo Android ha sido desplegado e inyectado en el workspace actual para su revisión interactivamente en el emulador).*
