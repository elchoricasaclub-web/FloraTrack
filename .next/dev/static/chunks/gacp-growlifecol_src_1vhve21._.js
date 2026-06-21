(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/gacp-growlifecol/src/lib/floratrackCommandModules.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "commandModules",
    ()=>commandModules
]);
const commandModules = [
    {
        title: "Reportes Programados",
        subtitle: "Automatización ejecutiva QA",
        description: "Reportes automáticos con frecuencia, destinatarios, evidencia, audit trail, errores, CAPA y decisión QA.",
        href: "/reportes-programados",
        tag: "Reports Auto",
        group: "Automatización",
        status: "Destacado",
        risk: "Alto",
        progress: 92,
        accent: "from-blue-600 to-cyan-400",
        items: [
            "Frecuencia",
            "Formato",
            "Destinatarios",
            "Audit trail",
            "QA"
        ],
        highlights: [
            "PDF / JSON / CSV",
            "Revisión QA",
            "Próxima generación"
        ]
    },
    {
        title: "Gestión de Riesgos GxP",
        subtitle: "QRM, RPN y mitigación",
        description: "Matriz de riesgos con severidad, probabilidad, detectabilidad, RPN, CAPA, eficacia y decisión QA.",
        href: "/riesgos",
        tag: "Risk",
        group: "QA",
        status: "Activo",
        risk: "Alto",
        progress: 88,
        accent: "from-red-600 to-rose-500",
        items: [
            "RPN",
            "Mitigación",
            "CAPA",
            "Eficacia",
            "QA"
        ],
        highlights: [
            "Riesgo alto",
            "Matriz QRM",
            "Eficacia"
        ]
    },
    {
        title: "Control de Cambios",
        subtitle: "Change control GMP/GACP",
        description: "Gestión formal de cambios sobre procesos, documentos, software, validaciones, entrenamiento y regulación.",
        href: "/cambios",
        tag: "Change",
        group: "QA",
        status: "Activo",
        risk: "Alto",
        progress: 86,
        accent: "from-cyan-500 to-emerald-500",
        items: [
            "Impacto GxP",
            "Validación",
            "Entrenamiento",
            "Regulatorio",
            "QA"
        ],
        highlights: [
            "Evaluación QA",
            "Eficacia",
            "Documentos"
        ]
    },
    {
        title: "Workflows QA",
        subtitle: "Aprobaciones y escalamiento",
        description: "Flujos QA con SLA, responsable, aprobador, firma electrónica, escalamiento, evidencia, CAPA y cierre.",
        href: "/workflows",
        tag: "Workflow",
        group: "QA",
        status: "Activo",
        risk: "Alto",
        progress: 84,
        accent: "from-pink-500 to-fuchsia-500",
        items: [
            "SLA",
            "Aprobador QA",
            "Firma",
            "Escalamiento",
            "Cierre"
        ],
        highlights: [
            "Pendientes QA",
            "SLA",
            "Firma electrónica"
        ]
    },
    {
        title: "API Regulatoria Avanzada",
        subtitle: "Autoridades y datos regulatorios",
        description: "Conexiones con autoridades, APIs regulatorias, radicaciones externas, cifrado, integridad, audit trail y CAPA.",
        href: "/regulatoria-api",
        tag: "Reg API",
        group: "Regulatorio",
        status: "Activo",
        risk: "Alto",
        progress: 80,
        accent: "from-purple-600 to-violet-500",
        items: [
            "Autoridad",
            "Endpoint",
            "Credencial",
            "Cifrado",
            "QA"
        ],
        highlights: [
            "Integridad",
            "Audit trail",
            "Credenciales"
        ]
    },
    {
        title: "Regulatorio",
        subtitle: "Radicaciones y autoridades",
        description: "Radicaciones regulatorias, expedientes, licencias, requerimientos, evidencia documental, vencimientos y CAPA.",
        href: "/regulatorio",
        tag: "Reg",
        group: "Regulatorio",
        status: "Activo",
        risk: "Crítico",
        progress: 90,
        accent: "from-violet-600 to-purple-400",
        items: [
            "Radicación",
            "Autoridad",
            "Expediente",
            "Licencia",
            "QA"
        ],
        highlights: [
            "Trámites",
            "Vencimientos",
            "Evidencia"
        ]
    },
    {
        title: "Firmas Electrónicas",
        subtitle: "eSign y registros electrónicos",
        description: "Firmas electrónicas con identidad, MFA, hash, política de firma, evidencia, desviaciones y aprobación QA.",
        href: "/firmas",
        tag: "eSign",
        group: "Part 11",
        status: "Activo",
        risk: "Crítico",
        progress: 94,
        accent: "from-indigo-600 to-blue-500",
        items: [
            "Firmante",
            "MFA",
            "Hash",
            "Significado",
            "QA"
        ],
        highlights: [
            "Part 11",
            "Hash",
            "Identidad"
        ]
    },
    {
        title: "Validación 21 CFR Part 11",
        subtitle: "CSV, IQ/OQ/PQ y release",
        description: "Validación del sistema con URS, matriz de riesgo, protocolos, pruebas, audit trail, firmas e integridad de datos.",
        href: "/part11",
        tag: "Part 11",
        group: "Validación",
        status: "Activo",
        risk: "Crítico",
        progress: 89,
        accent: "from-violet-700 to-indigo-500",
        items: [
            "URS",
            "IQ/OQ/PQ",
            "Audit trail",
            "Release",
            "QA"
        ],
        highlights: [
            "Validación",
            "Release",
            "Integridad"
        ]
    },
    {
        title: "Backups y Restauración",
        subtitle: "Continuidad e integridad",
        description: "Backups, restauración, snapshots, retención, cifrado, hash, pruebas de restore, evidencia y decisión QA.",
        href: "/backups",
        tag: "Backup",
        group: "DataOps",
        status: "Activo",
        risk: "Crítico",
        progress: 87,
        accent: "from-rose-600 to-orange-500",
        items: [
            "Backup",
            "Restore",
            "Hash",
            "Cifrado",
            "Retención"
        ],
        highlights: [
            "Restore probado",
            "Hash",
            "Cifrado"
        ]
    },
    {
        title: "Conectores e Integraciones",
        subtitle: "API, webhooks, LIMS y ERP",
        description: "Integraciones externas con autenticación, cifrado, mapeo, validaciones, audit trail, evidencia y CAPA.",
        href: "/integraciones",
        tag: "API",
        group: "Sistema",
        status: "Activo",
        risk: "Alto",
        progress: 82,
        accent: "from-orange-500 to-amber-400",
        items: [
            "API",
            "Webhook",
            "LIMS",
            "ERP",
            "QA"
        ],
        highlights: [
            "Mapeo",
            "Validación",
            "Cifrado"
        ]
    },
    {
        title: "Calidad QA",
        subtitle: "Muestreo y control analítico",
        description: "Muestras, análisis, laboratorio, resultados, veredicto QA, evidencia y trazabilidad completa.",
        href: "/calidad",
        tag: "QA",
        group: "QA",
        status: "Activo",
        risk: "Alto",
        progress: 91,
        accent: "from-emerald-600 to-teal-400",
        items: [
            "Muestra",
            "COA",
            "Resultado",
            "Liberación",
            "QA"
        ],
        highlights: [
            "Muestreo",
            "Veredicto",
            "COA"
        ]
    },
    {
        title: "Desviaciones / CAPA",
        subtitle: "No conformidades y causa raíz",
        description: "Investigación de desviaciones, impacto, causa raíz, acciones inmediatas, CAPA, eficacia y cierre QA.",
        href: "/desviaciones",
        tag: "CAPA",
        group: "QA",
        status: "Activo",
        risk: "Crítico",
        progress: 85,
        accent: "from-rose-600 to-red-500",
        items: [
            "Desviación",
            "Causa raíz",
            "CAPA",
            "Eficacia",
            "Cierre"
        ],
        highlights: [
            "Causa raíz",
            "CAPA",
            "Eficacia"
        ]
    },
    {
        title: "Documentos Controlados",
        subtitle: "SOP, versiones y vigencia",
        description: "Control documental de SOP, formatos, versiones, vigencia, obsolescencia, entrenamiento y evidencia.",
        href: "/documentos",
        tag: "GMP",
        group: "Documental",
        status: "Activo",
        risk: "Alto",
        progress: 84,
        accent: "from-slate-800 to-slate-500",
        items: [
            "SOP",
            "Versión",
            "Vigencia",
            "Entrenamiento",
            "QA"
        ],
        highlights: [
            "SOP",
            "Versiones",
            "Obsolescencia"
        ]
    },
    {
        title: "Entrenamiento y Competencia",
        subtitle: "Personal, SOP y liberación",
        description: "Entrenamiento por colaborador, SOP, versión documental, instructor, evaluación, competencia y reentrenamiento.",
        href: "/entrenamiento",
        tag: "GMP",
        group: "GMP",
        status: "Activo",
        risk: "Alto",
        progress: 83,
        accent: "from-teal-600 to-green-400",
        items: [
            "Colaborador",
            "SOP",
            "Evaluación",
            "Competencia",
            "QA"
        ],
        highlights: [
            "Competencia",
            "Reentrenamiento",
            "SOP"
        ]
    },
    {
        title: "Equipos GMP",
        subtitle: "Calibración y mantenimiento",
        description: "Equipos críticos, códigos de activo, calibración, mantenimiento, certificados, CAPA y liberación QA.",
        href: "/equipos",
        tag: "GMP",
        group: "GMP",
        status: "Activo",
        risk: "Alto",
        progress: 78,
        accent: "from-cyan-600 to-blue-400",
        items: [
            "Equipo",
            "Calibración",
            "Mantenimiento",
            "Certificado",
            "QA"
        ],
        highlights: [
            "Calibración",
            "Activo",
            "Mantenimiento"
        ]
    },
    {
        title: "Proveedores",
        subtitle: "Calificación GMP/GACP",
        description: "Evaluación, calificación, criticidad, riesgo, documentación, auditoría, evidencia y reevaluación de proveedores.",
        href: "/proveedores",
        tag: "Supplier",
        group: "Proveedor",
        status: "Activo",
        risk: "Alto",
        progress: 77,
        accent: "from-purple-500 to-pink-400",
        items: [
            "Proveedor",
            "Criticidad",
            "Auditoría",
            "Documentos",
            "QA"
        ],
        highlights: [
            "Calificación",
            "Criticidad",
            "Auditoría"
        ]
    },
    {
        title: "Inventario",
        subtitle: "Stock, cuarentena y liberación",
        description: "Movimientos de inventario, ubicación, cantidad, cuarentena, liberación QA y condiciones de almacenamiento.",
        href: "/inventario",
        tag: "GMP",
        group: "Operación",
        status: "Activo",
        risk: "Alto",
        progress: 86,
        accent: "from-blue-600 to-sky-400",
        items: [
            "Stock",
            "Ubicación",
            "Cuarentena",
            "Liberación",
            "QA"
        ],
        highlights: [
            "Stock",
            "Cuarentena",
            "Movimientos"
        ]
    },
    {
        title: "Recepción",
        subtitle: "Ingreso y liberación inicial",
        description: "Control de ingreso de material vegetal, lotes, insumos, empaque, estado sanitario y decisión QA.",
        href: "/recepcion",
        tag: "GACP/GMP",
        group: "Operación",
        status: "Activo",
        risk: "Alto",
        progress: 81,
        accent: "from-emerald-600 to-lime-400",
        items: [
            "Ingreso",
            "Lote",
            "Proveedor",
            "Cuarentena",
            "QA"
        ],
        highlights: [
            "Ingreso",
            "Lote",
            "Liberación"
        ]
    },
    {
        title: "Cultivos",
        subtitle: "Producción agrícola GACP",
        description: "Registro validado de cultivos, predio, genética, área, responsable, evidencia y trazabilidad.",
        href: "/cultivos",
        tag: "GACP",
        group: "GACP",
        status: "Activo",
        risk: "Medio",
        progress: 74,
        accent: "from-green-600 to-emerald-400",
        items: [
            "Predio",
            "Genética",
            "Área",
            "Responsable",
            "Evidencia"
        ],
        highlights: [
            "GACP",
            "Trazabilidad",
            "Predio"
        ]
    },
    {
        title: "Propagación",
        subtitle: "Clones, madres y trazabilidad",
        description: "Control de propagación, genética, etapa, ambiente, evidencia, responsable y soporte técnico.",
        href: "/propagacion",
        tag: "GACP",
        group: "GACP",
        status: "Activo",
        risk: "Medio",
        progress: 76,
        accent: "from-lime-600 to-emerald-400",
        items: [
            "Madres",
            "Clones",
            "Genética",
            "Etapa",
            "Evidencia"
        ],
        highlights: [
            "Clones",
            "Madres",
            "Genética"
        ]
    },
    {
        title: "Cosecha",
        subtitle: "Corte, lote y rendimiento",
        description: "Trazabilidad de cosecha, lote, biomasa, responsables, rendimientos y control documental.",
        href: "/cosecha",
        tag: "GACP",
        group: "GACP",
        status: "Activo",
        risk: "Medio",
        progress: 73,
        accent: "from-yellow-600 to-lime-400",
        items: [
            "Corte",
            "Lote",
            "Biomasa",
            "Rendimiento",
            "QA"
        ],
        highlights: [
            "Corte",
            "Rendimiento",
            "Lote"
        ]
    },
    {
        title: "Genéticas",
        subtitle: "Banco genético y variedades",
        description: "Control de variedades, madres, códigos, características, estado y trazabilidad genética.",
        href: "/geneticas",
        tag: "GACP",
        group: "GACP",
        status: "Activo",
        risk: "Medio",
        progress: 72,
        accent: "from-green-700 to-teal-400",
        items: [
            "Variedad",
            "Madre",
            "Código",
            "Estado",
            "Trazabilidad"
        ],
        highlights: [
            "Variedades",
            "Madres",
            "Códigos"
        ]
    },
    {
        title: "Empresas y Licencias",
        subtitle: "Multiempresa, sedes y alcance",
        description: "Razón social, sedes, licencias, responsables, alcance autorizado, estado GACP/GMP, evidencia y CAPA.",
        href: "/empresas",
        tag: "Company",
        group: "Empresa",
        status: "Activo",
        risk: "Alto",
        progress: 79,
        accent: "from-emerald-700 to-cyan-500",
        items: [
            "Empresa",
            "Licencia",
            "Sede",
            "Alcance",
            "QA"
        ],
        highlights: [
            "Licencias",
            "Multiempresa",
            "Sedes"
        ]
    },
    {
        title: "GIS / Mapa Operacional",
        subtitle: "Predios y zonas críticas",
        description: "Control georreferenciado de empresas, predios, áreas, zonas críticas, coordenadas, evidencia y decisión QA.",
        href: "/gis",
        tag: "GIS",
        group: "GIS",
        status: "Activo",
        risk: "Medio",
        progress: 70,
        accent: "from-cyan-700 to-lime-400",
        items: [
            "Coordenadas",
            "Predio",
            "Zona",
            "Riesgo",
            "QA"
        ],
        highlights: [
            "Mapa",
            "Coordenadas",
            "Zonas"
        ]
    },
    {
        title: "Reportes y KPIs",
        subtitle: "Cumplimiento ejecutivo",
        description: "Reportes ejecutivos, KPIs, periodos, módulos incluidos, hallazgos, riesgos, acciones requeridas y QA.",
        href: "/reportes",
        tag: "Reports",
        group: "Reportes",
        status: "Activo",
        risk: "Medio",
        progress: 84,
        accent: "from-blue-700 to-indigo-400",
        items: [
            "KPI",
            "Periodo",
            "Hallazgos",
            "Riesgos",
            "QA"
        ],
        highlights: [
            "KPIs",
            "Ejecutivo",
            "Riesgos"
        ]
    },
    {
        title: "Notificaciones y Alertas",
        subtitle: "Vencimientos y escalamiento",
        description: "Alertas, vencimientos, CAPA pendientes, auditorías, calibraciones, documentos, licencias y responsables.",
        href: "/notificaciones",
        tag: "Alertas",
        group: "Alertas",
        status: "Activo",
        risk: "Alto",
        progress: 83,
        accent: "from-amber-600 to-orange-400",
        items: [
            "Alerta",
            "Vencimiento",
            "CAPA",
            "Escalamiento",
            "QA"
        ],
        highlights: [
            "Vencimientos",
            "CAPA",
            "Escalamiento"
        ]
    },
    {
        title: "CSV / DataOps",
        subtitle: "Importación y validación",
        description: "Importaciones, exportaciones, migraciones, conciliaciones, hash, backup, evidencia, CAPA y decisión QA.",
        href: "/csv",
        tag: "CSV",
        group: "DataOps",
        status: "Activo",
        risk: "Alto",
        progress: 81,
        accent: "from-sky-600 to-cyan-400",
        items: [
            "Importación",
            "Exportación",
            "Hash",
            "Backup",
            "QA"
        ],
        highlights: [
            "DataOps",
            "Hash",
            "Migración"
        ]
    },
    {
        title: "Usuarios y Accesos",
        subtitle: "Roles, MFA y seguridad",
        description: "Usuarios, roles, permisos, MFA, firma electrónica, revisión periódica, segregación de funciones y CAPA.",
        href: "/usuarios",
        tag: "Security",
        group: "Seguridad",
        status: "Activo",
        risk: "Crítico",
        progress: 88,
        accent: "from-slate-900 to-blue-600",
        items: [
            "Usuario",
            "Rol",
            "MFA",
            "Firma",
            "QA"
        ],
        highlights: [
            "MFA",
            "Roles",
            "Segregación"
        ]
    },
    {
        title: "Recall / Retiro",
        subtitle: "Retiro de producto GMP",
        description: "Alertas, bloqueo de lote, retiro preventivo u obligatorio, autoridad, recuperación, CAPA y cierre QA.",
        href: "/recall",
        tag: "Recall",
        group: "GMP",
        status: "Activo",
        risk: "Crítico",
        progress: 82,
        accent: "from-red-700 to-orange-500",
        items: [
            "Lote",
            "Bloqueo",
            "Autoridad",
            "Recuperación",
            "QA"
        ],
        highlights: [
            "Bloqueo",
            "Autoridad",
            "Cierre"
        ]
    },
    {
        title: "Retención y Estabilidad",
        subtitle: "Muestras y estabilidad",
        description: "Muestras de retención, contramuestras, estabilidad, custodia, almacenamiento, vencimiento y decisión QA.",
        href: "/retencion",
        tag: "GMP",
        group: "GMP",
        status: "Activo",
        risk: "Alto",
        progress: 80,
        accent: "from-indigo-700 to-sky-500",
        items: [
            "Muestra",
            "Custodia",
            "Estabilidad",
            "Vencimiento",
            "QA"
        ],
        highlights: [
            "Retención",
            "Custodia",
            "Estabilidad"
        ]
    },
    {
        title: "Residuos y Disposición",
        subtitle: "Gestión ambiental GMP/GACP",
        description: "Residuos por área, lote, riesgo, cantidad, tratamiento, gestor autorizado, disposición final y QA.",
        href: "/residuos",
        tag: "Waste",
        group: "Ambiental",
        status: "Activo",
        risk: "Alto",
        progress: 71,
        accent: "from-lime-700 to-green-400",
        items: [
            "Residuo",
            "Gestor",
            "Tratamiento",
            "Certificado",
            "QA"
        ],
        highlights: [
            "Gestor",
            "Disposición",
            "Certificado"
        ]
    },
    {
        title: "Limpieza y Saneamiento",
        subtitle: "Higiene, SOP y liberación",
        description: "Limpieza, desinfección, SOP, productos, concentraciones, inspección preoperacional, hisopado y QA.",
        href: "/saneamiento",
        tag: "GMP",
        group: "GMP",
        status: "Activo",
        risk: "Alto",
        progress: 78,
        accent: "from-teal-700 to-cyan-400",
        items: [
            "Limpieza",
            "SOP",
            "Producto",
            "Hisopado",
            "QA"
        ],
        highlights: [
            "Saneamiento",
            "Hisopado",
            "Liberación"
        ]
    },
    {
        title: "Manejo Integrado de Plagas",
        subtitle: "MIP, trampas y control",
        description: "Inspecciones, trampas, hallazgos, actividad de plagas, productos aplicados, proveedor, evidencia y CAPA.",
        href: "/plagas",
        tag: "MIP",
        group: "GACP",
        status: "Activo",
        risk: "Alto",
        progress: 69,
        accent: "from-amber-700 to-lime-500",
        items: [
            "Trampas",
            "Hallazgos",
            "Actividad",
            "Proveedor",
            "CAPA"
        ],
        highlights: [
            "MIP",
            "Trampas",
            "Hallazgos"
        ]
    },
    {
        title: "Predios",
        subtitle: "Infraestructura agrícola base",
        description: "Predios, áreas, ubicación, capacidad productiva y condiciones de cumplimiento.",
        href: "/predios",
        tag: "Base",
        group: "Base",
        status: "Activo",
        risk: "Bajo",
        progress: 70,
        accent: "from-slate-600 to-emerald-400",
        items: [
            "Predio",
            "Área",
            "Ubicación",
            "Capacidad",
            "Cumplimiento"
        ],
        highlights: [
            "Predio",
            "Área",
            "Base"
        ]
    },
    {
        title: "Extracción BHO",
        subtitle: "Closed-loop, solvente y QA",
        description: "Trazabilidad de extracción BHO con lote de origen, solvente documentado, sistema cerrado, purge, limpieza, seguridad, evidencia, desviaciones, CAPA y decisión QA.",
        href: "/bho",
        tag: "BHO",
        group: "Extracción",
        status: "Activo",
        risk: "Crítico",
        progress: 82,
        accent: "from-orange-600 to-amber-400",
        items: [
            "Closed-loop",
            "Solvente",
            "Purge",
            "Cuarentena",
            "QA"
        ],
        highlights: [
            "Solvente documentado",
            "Sistema cerrado",
            "Purge QA"
        ]
    },
    {
        title: "Live Rosin",
        subtitle: "Solventless premium y QA",
        description: "Trazabilidad Live Rosin con fresh frozen, bubble hash, micronaje, press, curado, limpieza, evidencia, cuarentena, desviaciones, CAPA y decisión QA.",
        href: "/live-rosin",
        tag: "Rosin",
        group: "Extracción",
        status: "Activo",
        risk: "Alto",
        progress: 84,
        accent: "from-lime-600 to-emerald-400",
        items: [
            "Fresh frozen",
            "Bubble hash",
            "Press",
            "Curado",
            "QA"
        ],
        highlights: [
            "Solventless",
            "Micronaje",
            "Premium"
        ]
    },
    {
        title: "Bubble Hash",
        subtitle: "Ice water hash y micronaje",
        description: "Trazabilidad Bubble Hash con material congelado, agua/hielo o consumibles críticos, bolsas micron, secado, limpieza, evidencia, cuarentena y liberación QA.",
        href: "/bubble-hash",
        tag: "Hash",
        group: "Extracción",
        status: "Activo",
        risk: "Alto",
        progress: 80,
        accent: "from-cyan-600 to-sky-400",
        items: [
            "WPFF",
            "Micronaje",
            "Secado",
            "Solventless",
            "QA"
        ],
        highlights: [
            "Ice water",
            "Micron select",
            "Hash para rosin"
        ]
    },
    {
        title: "Post-Extracción GMP",
        subtitle: "Purificación, fraccionamiento y QA",
        description: "Trazabilidad post-extracción para winterización, filtración, decarboxilación, destilación, fraccionamiento, remediación aprobada por QA, formulación intermedia, evidencia, desviaciones y CAPA.",
        href: "/post-extraccion",
        tag: "Post",
        group: "Extracción",
        status: "Activo",
        risk: "Alto",
        progress: 83,
        accent: "from-fuchsia-600 to-indigo-500",
        items: [
            "Winterización",
            "Filtración",
            "Destilación",
            "Cuarentena",
            "QA"
        ],
        highlights: [
            "Batch record",
            "Liberación QA",
            "Post-extracción"
        ]
    },
    {
        title: "ICA",
        subtitle: "Control fitosanitario y agrícola",
        description: "Seguimiento de trámites, radicaciones, conceptos, predios, soportes, requerimientos y evidencias ante ICA bajo control QA.",
        href: "/ica",
        tag: "ICA",
        group: "Regulatorio",
        status: "Activo",
        risk: "Alto",
        progress: 78,
        accent: "from-emerald-700 to-lime-500",
        items: [
            "Predios",
            "Conceptos",
            "Radicados",
            "Soportes",
            "QA"
        ],
        highlights: [
            "ICA",
            "Fitosanitario",
            "Predios"
        ]
    },
    {
        title: "INVIMA",
        subtitle: "Soportes sanitarios y GMP",
        description: "Seguimiento de trámites, soportes sanitarios, certificaciones, expedientes, requerimientos y evidencias ante INVIMA bajo control QA.",
        href: "/invima",
        tag: "INVIMA",
        group: "Regulatorio",
        status: "Activo",
        risk: "Crítico",
        progress: 82,
        accent: "from-purple-700 to-fuchsia-500",
        items: [
            "Expediente",
            "GMP",
            "Radicado",
            "Requerimiento",
            "QA"
        ],
        highlights: [
            "INVIMA",
            "GMP",
            "Sanitario"
        ]
    },
    {
        title: "PEAS",
        subtitle: "Planes, permisos y anexos",
        description: "Control PEAS de planes, permisos, anexos, soportes, requerimientos, seguimiento documental, evidencia, desviaciones, CAPA y decisión QA.",
        href: "/peas",
        tag: "PEAS",
        group: "Regulatorio",
        status: "Activo",
        risk: "Alto",
        progress: 76,
        accent: "from-cyan-700 to-blue-500",
        items: [
            "Plan",
            "Permiso",
            "Anexo",
            "Seguimiento",
            "QA"
        ],
        highlights: [
            "PEAS",
            "Permisos",
            "Anexos"
        ]
    },
    {
        title: "Ministerio de Justicia",
        subtitle: "Licencias, cupos y seguimiento",
        description: "Seguimiento regulatorio de licencias de cannabis, modificaciones, renovaciones, cupos, informes periódicos, requerimientos, radicados, resoluciones, evidencia, desviaciones, CAPA y decisión QA.",
        href: "/minjusticia",
        tag: "MinJus",
        group: "Regulatorio",
        status: "Activo",
        risk: "Crítico",
        progress: 84,
        accent: "from-green-800 to-emerald-500",
        items: [
            "Licencias",
            "Cupos",
            "Informes",
            "Radicados",
            "QA"
        ],
        highlights: [
            "Ministerio de Justicia",
            "Cupos",
            "Licencias"
        ]
    },
    {
        title: "Estado de la App",
        subtitle: "Salud del sistema y diagnóstico",
        description: "Módulo centralizado para revisar salud del sistema, almacenamiento local, módulos activos, entorno de ejecución, conectividad, diagnósticos y exportación de estado sin interferir con la pantalla.",
        href: "/estado-app",
        tag: "Status",
        group: "Sistema",
        status: "Activo",
        risk: "Medio",
        progress: 93,
        accent: "from-slate-900 to-emerald-500",
        items: [
            "Servidor",
            "LocalStorage",
            "Módulos",
            "Diagnóstico",
            "Export"
        ],
        highlights: [
            "Sin overlay",
            "Dev indicator oculto",
            "Diagnóstico"
        ]
    },
    {
        title: "FNE / Fondo Nacional de Estupefacientes",
        subtitle: "Sustancias, cupos y reportes",
        description: "Seguimiento interno de trámites, reportes, soportes, requerimientos, cupos, controles de sustancias fiscalizadas, evidencias, desviaciones, CAPA y decisión QA relacionados con FNE.",
        href: "/fne",
        tag: "FNE",
        group: "Regulatorio",
        status: "Activo",
        risk: "Crítico",
        progress: 82,
        accent: "from-rose-800 to-orange-500",
        items: [
            "Reportes",
            "Cupos",
            "Movimientos",
            "Soportes",
            "QA"
        ],
        highlights: [
            "FNE",
            "Sustancias fiscalizadas",
            "Conciliación"
        ]
    },
    {
        title: "DIAN / Comercio Exterior",
        subtitle: "Aduanas, importaciones y exportaciones",
        description: "Seguimiento regulatorio de importaciones, exportaciones, soportes aduaneros, documentos tributarios, certificados, declaraciones, radicados, requerimientos DIAN, conciliación documental, evidencia, desviaciones, CAPA y decisión QA.",
        href: "/dian",
        tag: "DIAN",
        group: "Regulatorio",
        status: "Activo",
        risk: "Alto",
        progress: 79,
        accent: "from-yellow-700 to-orange-500",
        items: [
            "Importación",
            "Exportación",
            "Aduanas",
            "Soportes",
            "QA"
        ],
        highlights: [
            "DIAN",
            "Comercio exterior",
            "Conciliación"
        ]
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CommandCenterPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/gacp-growlifecol/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/gacp-growlifecol/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$src$2f$lib$2f$floratrackCommandModules$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/gacp-growlifecol/src/lib/floratrackCommandModules.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const filters = [
    "Todos",
    "Críticos",
    "QA",
    "Regulatorio",
    "Operación",
    "Sistema",
    "Automatización"
];
const statusStyles = {
    Activo: "border-emerald-200 bg-emerald-50 text-emerald-700",
    Pendiente: "border-amber-200 bg-amber-50 text-amber-700",
    Completado: "border-blue-200 bg-blue-50 text-blue-700",
    Bloqueado: "border-slate-300 bg-slate-100 text-slate-700",
    Destacado: "border-cyan-200 bg-cyan-50 text-cyan-700",
    Vacío: "border-slate-200 bg-white text-slate-500",
    Error: "border-red-200 bg-red-50 text-red-700"
};
const riskStyles = {
    Bajo: "border-emerald-200 bg-emerald-50 text-emerald-700",
    Medio: "border-sky-200 bg-sky-50 text-sky-700",
    Alto: "border-amber-200 bg-amber-50 text-amber-700",
    Crítico: "border-red-200 bg-red-50 text-red-700"
};
function matchesFilter(module, filter) {
    if (filter === "Todos") return true;
    if (filter === "Críticos") return [
        "Alto",
        "Crítico"
    ].includes(module.risk);
    if (filter === "QA") return [
        "QA",
        "GMP",
        "Validación",
        "Part 11",
        "Documental"
    ].includes(module.group);
    if (filter === "Regulatorio") return [
        "Regulatorio",
        "Empresa",
        "GIS"
    ].includes(module.group);
    if (filter === "Operación") return [
        "GACP",
        "Operación",
        "Ambiental",
        "Proveedor",
        "Extracción"
    ].includes(module.group);
    if (filter === "Sistema") return [
        "Sistema",
        "DataOps",
        "Seguridad"
    ].includes(module.group);
    if (filter === "Automatización") return [
        "Automatización",
        "Reportes",
        "Alertas"
    ].includes(module.group);
    return true;
}
function CommandCenterPage() {
    _s();
    const [search, setSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [filter, setFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("Todos");
    const [selected, setSelected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CommandCenterPage.useEffect": ()=>{
            setLoading(true);
            const timer = window.setTimeout({
                "CommandCenterPage.useEffect.timer": ()=>setLoading(false)
            }["CommandCenterPage.useEffect.timer"], 180);
            return ({
                "CommandCenterPage.useEffect": ()=>window.clearTimeout(timer)
            })["CommandCenterPage.useEffect"];
        }
    }["CommandCenterPage.useEffect"], [
        search,
        filter
    ]);
    const filteredModules = (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CommandCenterPage.useMemo[filteredModules]": ()=>{
            const term = search.trim().toLowerCase();
            return __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$src$2f$lib$2f$floratrackCommandModules$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandModules"].filter({
                "CommandCenterPage.useMemo[filteredModules]": (module)=>{
                    const text = [
                        module.title,
                        module.subtitle,
                        module.description,
                        module.tag,
                        module.group,
                        module.status,
                        module.risk,
                        ...module.items,
                        ...module.highlights
                    ].join(" ").toLowerCase();
                    return text.includes(term) && matchesFilter(module, filter);
                }
            }["CommandCenterPage.useMemo[filteredModules]"]);
        }
    }["CommandCenterPage.useMemo[filteredModules]"], [
        search,
        filter
    ]);
    const metrics = (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CommandCenterPage.useMemo[metrics]": ()=>{
            const critical = __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$src$2f$lib$2f$floratrackCommandModules$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandModules"].filter({
                "CommandCenterPage.useMemo[metrics]": (module)=>module.risk === "Crítico"
            }["CommandCenterPage.useMemo[metrics]"]).length;
            const high = __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$src$2f$lib$2f$floratrackCommandModules$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandModules"].filter({
                "CommandCenterPage.useMemo[metrics]": (module)=>module.risk === "Alto"
            }["CommandCenterPage.useMemo[metrics]"]).length;
            const avgProgress = Math.round(__TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$src$2f$lib$2f$floratrackCommandModules$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandModules"].reduce({
                "CommandCenterPage.useMemo[metrics].avgProgress": (sum, module)=>sum + module.progress
            }["CommandCenterPage.useMemo[metrics].avgProgress"], 0) / __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$src$2f$lib$2f$floratrackCommandModules$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandModules"].length);
            const automation = __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$src$2f$lib$2f$floratrackCommandModules$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandModules"].filter({
                "CommandCenterPage.useMemo[metrics]": (module)=>[
                        "Automatización",
                        "Reportes",
                        "Alertas"
                    ].includes(module.group)
            }["CommandCenterPage.useMemo[metrics]"]).length;
            return {
                modules: __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$src$2f$lib$2f$floratrackCommandModules$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandModules"].length,
                critical,
                high,
                avgProgress,
                automation
            };
        }
    }["CommandCenterPage.useMemo[metrics]"], []);
    const priorityModules = __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$src$2f$lib$2f$floratrackCommandModules$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandModules"].filter((module)=>[
            "Crítico",
            "Alto"
        ].includes(module.risk)).slice(0, 5);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "min-h-screen bg-slate-950 text-slate-950",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.22),transparent_32rem),radial-gradient(circle_at_top_right,rgba(56,189,248,0.18),transparent_30rem),linear-gradient(180deg,#f8fafc_0%,#eef6f5_45%,#f8fafc_100%)]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid min-h-screen lg:grid-cols-[310px_1fr]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                            className: "hidden border-r border-white/70 bg-white/75 backdrop-blur-2xl lg:block",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "sticky top-0 flex h-screen flex-col",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                                        className: "border-b border-slate-200/70 p-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "relative grid h-14 w-14 place-items-center rounded-3xl bg-gradient-to-br from-emerald-500 to-cyan-400 text-2xl font-black text-white shadow-xl shadow-emerald-200",
                                                        children: [
                                                            "F",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "absolute -right-1 -top-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-400"
                                                            }, void 0, false, {
                                                                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                                lineNumber: 100,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                        lineNumber: 98,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                                className: "text-2xl font-black tracking-tight",
                                                                children: "FloraTrack"
                                                            }, void 0, false, {
                                                                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                                lineNumber: 104,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs font-black uppercase tracking-[0.25em] text-emerald-700",
                                                                children: "Command OS"
                                                            }, void 0, false, {
                                                                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                                lineNumber: 105,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                        lineNumber: 103,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                lineNumber: 97,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-6 rounded-3xl border border-slate-200 bg-white p-2 shadow-sm",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-slate-400",
                                                            children: "⌕"
                                                        }, void 0, false, {
                                                            fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                            lineNumber: 111,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            value: search,
                                                            onChange: (event)=>setSearch(event.target.value),
                                                            placeholder: "Buscar módulo...",
                                                            className: "w-full bg-transparent text-sm font-bold outline-none placeholder:text-slate-400"
                                                        }, void 0, false, {
                                                            fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                            lineNumber: 112,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                    lineNumber: 110,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                lineNumber: 109,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                        lineNumber: 96,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                        className: "flex-1 overflow-auto p-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: "/dashboard-clasico",
                                                className: "mb-3 flex items-center justify-between rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-xl",
                                                children: [
                                                    "Dashboard clasico",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "rounded-full bg-white/15 px-3 py-1 text-xs",
                                                        children: "Volver"
                                                    }, void 0, false, {
                                                        fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                        lineNumber: 125,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                lineNumber: 123,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: "/",
                                                className: "mb-5 flex items-center justify-between rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-400 px-4 py-3 text-sm font-black text-white shadow-xl shadow-emerald-200",
                                                children: [
                                                    "Command Center",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "rounded-full bg-white/20 px-3 py-1 text-xs",
                                                        children: "Nuevo"
                                                    }, void 0, false, {
                                                        fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                        lineNumber: 130,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                lineNumber: 128,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "mb-3 px-3 text-xs font-black uppercase tracking-[0.22em] text-slate-400",
                                                children: "Módulos"
                                            }, void 0, false, {
                                                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                lineNumber: 133,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-1",
                                                children: __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$src$2f$lib$2f$floratrackCommandModules$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["commandModules"].map((module)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                        href: module.href,
                                                        className: "group flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-white hover:text-slate-950 hover:shadow-sm",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "line-clamp-2",
                                                                children: module.title
                                                            }, void 0, false, {
                                                                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                                lineNumber: 142,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-black text-emerald-800 group-hover:bg-slate-950 group-hover:text-white",
                                                                children: module.tag
                                                            }, void 0, false, {
                                                                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                                lineNumber: 143,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, module.href, true, {
                                                        fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                        lineNumber: 137,
                                                        columnNumber: 21
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                lineNumber: 135,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                        lineNumber: 122,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                lineNumber: 95,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                            lineNumber: 94,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                            className: "max-h-screen overflow-auto",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                                    className: "sticky top-0 z-40 border-b border-white/70 bg-white/75 px-5 py-4 backdrop-blur-2xl md:px-8",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs font-black uppercase tracking-[0.28em] text-emerald-700",
                                                        children: "FloraTrack 2026"
                                                    }, void 0, false, {
                                                        fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                        lineNumber: 157,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                        className: "text-3xl font-black tracking-tight md:text-5xl",
                                                        children: "Command Center"
                                                    }, void 0, false, {
                                                        fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                        lineNumber: 158,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                lineNumber: 156,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex gap-2 overflow-x-auto pb-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(QuickAction, {
                                                        href: "/reportes-programados",
                                                        label: "Reportes Auto",
                                                        gradient: "from-blue-600 to-cyan-400"
                                                    }, void 0, false, {
                                                        fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                        lineNumber: 162,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(QuickAction, {
                                                        href: "/riesgos",
                                                        label: "Riesgos",
                                                        gradient: "from-red-600 to-rose-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                        lineNumber: 163,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(QuickAction, {
                                                        href: "/cambios",
                                                        label: "Cambios",
                                                        gradient: "from-cyan-500 to-emerald-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                        lineNumber: 164,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(QuickAction, {
                                                        href: "/workflows",
                                                        label: "Workflows",
                                                        gradient: "from-pink-500 to-fuchsia-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                        lineNumber: 165,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                lineNumber: 161,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                        lineNumber: 155,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                    lineNumber: 154,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-8 p-5 md:p-8",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                            className: "relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-slate-950 p-7 text-white shadow-2xl md:p-10",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute left-12 top-10 h-40 w-40 rounded-full bg-emerald-400/20 blur-3xl"
                                                }, void 0, false, {
                                                    fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                    lineNumber: 172,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute bottom-6 right-24 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl"
                                                }, void 0, false, {
                                                    fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                    lineNumber: 173,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute right-0 top-0 h-72 w-72 translate-x-20 -translate-y-20 rounded-full bg-white/5"
                                                }, void 0, false, {
                                                    fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                    lineNumber: 174,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative grid gap-8 xl:grid-cols-[1fr_340px] xl:items-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "inline-flex rounded-full border border-emerald-300/30 bg-emerald-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-emerald-200",
                                                                    children: "Premium Compliance OS"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                                    lineNumber: 178,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                                    className: "mt-6 max-w-5xl text-5xl font-black tracking-tight md:text-7xl",
                                                                    children: "Cumplimiento GACP/GMP visual, rápido y auditable."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                                    lineNumber: 182,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "mt-5 max-w-4xl text-base font-semibold leading-8 text-slate-300 md:text-lg",
                                                                    children: "Una experiencia moderna para operar trazabilidad farmacéutica, QA, riesgos, CAPA, firmas electrónicas, reportes programados, cambios, APIs regulatorias y evidencia GMP desde un solo centro."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                                    lineNumber: 186,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "mt-8 flex flex-wrap gap-3",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                            href: "/reportes-programados",
                                                                            className: "rounded-2xl bg-white px-6 py-4 text-sm font-black text-slate-950 shadow-xl transition hover:-translate-y-1 hover:bg-emerald-100",
                                                                            children: "Automatizar reportes"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                                            lineNumber: 193,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                            href: "/riesgos",
                                                                            className: "rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-sm font-black text-white transition hover:-translate-y-1 hover:bg-white/10",
                                                                            children: "Ver riesgos GxP"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                                            lineNumber: 196,
                                                                            columnNumber: 23
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                                    lineNumber: 192,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                            lineNumber: 177,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-4 rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(HeroMetric, {
                                                                    label: "Score operativo",
                                                                    value: "99%",
                                                                    progress: 99
                                                                }, void 0, false, {
                                                                    fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                                    lineNumber: 203,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(HeroMetric, {
                                                                    label: "Módulos vivos",
                                                                    value: metrics.modules,
                                                                    progress: 100
                                                                }, void 0, false, {
                                                                    fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                                    lineNumber: 204,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(HeroMetric, {
                                                                    label: "Automatización",
                                                                    value: metrics.automation,
                                                                    progress: 82
                                                                }, void 0, false, {
                                                                    fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                                    lineNumber: 205,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                            lineNumber: 202,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                    lineNumber: 176,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                            lineNumber: 171,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                            className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MetricCard, {
                                                    title: "Módulos activos",
                                                    value: metrics.modules,
                                                    caption: "Arquitectura total",
                                                    tone: "emerald"
                                                }, void 0, false, {
                                                    fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                    lineNumber: 211,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MetricCard, {
                                                    title: "Riesgo crítico",
                                                    value: metrics.critical,
                                                    caption: "Máxima prioridad QA",
                                                    tone: "red"
                                                }, void 0, false, {
                                                    fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                    lineNumber: 212,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MetricCard, {
                                                    title: "Riesgo alto",
                                                    value: metrics.high,
                                                    caption: "Seguimiento activo",
                                                    tone: "amber"
                                                }, void 0, false, {
                                                    fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                    lineNumber: 213,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MetricCard, {
                                                    title: "Madurez visual",
                                                    value: `${metrics.avgProgress}%`,
                                                    caption: "Sistema en progreso",
                                                    tone: "blue"
                                                }, void 0, false, {
                                                    fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                    lineNumber: 214,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                            lineNumber: 210,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                            className: "grid gap-6 xl:grid-cols-[1fr_380px]",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-xs font-black uppercase tracking-[0.25em] text-slate-400",
                                                                            children: "Sistema modular"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                                            lineNumber: 221,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                            className: "mt-2 text-3xl font-black tracking-tight md:text-4xl",
                                                                            children: "Módulos premium"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                                            lineNumber: 222,
                                                                            columnNumber: 23
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                                    lineNumber: 220,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm font-black text-slate-500",
                                                                    children: [
                                                                        filteredModules.length,
                                                                        " módulos visibles"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                                    lineNumber: 225,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                            lineNumber: 219,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "rounded-[2rem] border border-white/70 bg-white/75 p-4 shadow-sm backdrop-blur-xl",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex gap-2 overflow-x-auto pb-1",
                                                                    children: filters.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            type: "button",
                                                                            onClick: ()=>setFilter(item),
                                                                            className: `shrink-0 rounded-full border px-4 py-2 text-xs font-black transition ${filter === item ? "border-slate-950 bg-slate-950 text-white shadow-lg" : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"}`,
                                                                            children: item
                                                                        }, item, false, {
                                                                            fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                                            lineNumber: 231,
                                                                            columnNumber: 25
                                                                        }, this))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                                    lineNumber: 229,
                                                                    columnNumber: 21
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "mt-4 flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-3",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-slate-400",
                                                                            children: "⌕"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                                            lineNumber: 247,
                                                                            columnNumber: 23
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            value: search,
                                                                            onChange: (event)=>setSearch(event.target.value),
                                                                            placeholder: "Buscar por módulo, estado, riesgo o proceso...",
                                                                            className: "w-full bg-transparent text-sm font-bold outline-none placeholder:text-slate-400"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                                            lineNumber: 248,
                                                                            columnNumber: 23
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                                    lineNumber: 246,
                                                                    columnNumber: 21
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                            lineNumber: 228,
                                                            columnNumber: 19
                                                        }, this),
                                                        loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "grid gap-5 xl:grid-cols-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SkeletonCard, {}, void 0, false, {
                                                                    fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                                    lineNumber: 259,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SkeletonCard, {}, void 0, false, {
                                                                    fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                                    lineNumber: 260,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SkeletonCard, {}, void 0, false, {
                                                                    fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                                    lineNumber: 261,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SkeletonCard, {}, void 0, false, {
                                                                    fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                                    lineNumber: 262,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                            lineNumber: 258,
                                                            columnNumber: 21
                                                        }, this) : filteredModules.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EmptyState, {
                                                            title: "No encontramos módulos",
                                                            description: "Limpia la búsqueda o cambia de filtro para ver nuevamente el ecosistema FloraTrack.",
                                                            onReset: ()=>{
                                                                setSearch("");
                                                                setFilter("Todos");
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                            lineNumber: 265,
                                                            columnNumber: 21
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "grid gap-5 xl:grid-cols-2",
                                                            children: filteredModules.map((module, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ModuleCard, {
                                                                    module: module,
                                                                    index: index,
                                                                    onInspect: ()=>setSelected(module)
                                                                }, module.href, false, {
                                                                    fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                                    lineNumber: 276,
                                                                    columnNumber: 25
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                            lineNumber: 274,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                    lineNumber: 218,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                                                    className: "space-y-5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Panel, {
                                                            title: "Actividad prioritaria",
                                                            subtitle: "Qué revisar primero",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "space-y-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NotificationCard, {
                                                                        title: "Reportes programados",
                                                                        description: "Automatiza salida ejecutiva con evidencia y decisión QA.",
                                                                        tone: "blue"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                                        lineNumber: 290,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NotificationCard, {
                                                                        title: "Riesgos GxP",
                                                                        description: "RPN, mitigación y CAPA con seguimiento visual.",
                                                                        tone: "red"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                                        lineNumber: 291,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NotificationCard, {
                                                                        title: "Control de cambios",
                                                                        description: "Impacto documental, validación y entrenamiento.",
                                                                        tone: "cyan"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                                        lineNumber: 292,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                                lineNumber: 289,
                                                                columnNumber: 21
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                            lineNumber: 288,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Panel, {
                                                            title: "Módulos destacados",
                                                            subtitle: "Alto impacto GMP",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "space-y-3",
                                                                children: priorityModules.map((module)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MiniModule, {
                                                                        module: module,
                                                                        onClick: ()=>setSelected(module)
                                                                    }, module.href, false, {
                                                                        fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                                        lineNumber: 299,
                                                                        columnNumber: 25
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                                lineNumber: 297,
                                                                columnNumber: 21
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                            lineNumber: 296,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                    lineNumber: 287,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                            lineNumber: 217,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                    lineNumber: 170,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                            lineNumber: 153,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                    lineNumber: 93,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                lineNumber: 92,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MobileNav, {}, void 0, false, {
                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                lineNumber: 310,
                columnNumber: 7
            }, this),
            selected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DetailDrawer, {
                module: selected,
                onClose: ()=>setSelected(null)
            }, void 0, false, {
                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                lineNumber: 313,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
        lineNumber: 91,
        columnNumber: 5
    }, this);
}
_s(CommandCenterPage, "OoVuUM73h0Uw1juKlftMg3BuWmw=");
_c = CommandCenterPage;
function QuickAction({ href, label, gradient }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
        href: href,
        className: `shrink-0 rounded-2xl bg-gradient-to-r ${gradient} px-5 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5`,
        children: label
    }, void 0, false, {
        fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
        lineNumber: 321,
        columnNumber: 5
    }, this);
}
_c1 = QuickAction;
function HeroMetric({ label, value, progress }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-[1.5rem] border border-white/10 bg-white/5 p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-end justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs font-black uppercase tracking-[0.2em] text-slate-400",
                                children: label
                            }, void 0, false, {
                                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                lineNumber: 332,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-2 text-3xl font-black text-white",
                                children: value
                            }, void 0, false, {
                                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                lineNumber: 333,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                        lineNumber: 331,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs font-black text-emerald-200",
                        children: "Live"
                    }, void 0, false, {
                        fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                        lineNumber: 335,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                lineNumber: 330,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-4 h-2 overflow-hidden rounded-full bg-white/10",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-300 transition-all",
                    style: {
                        width: `${progress}%`
                    }
                }, void 0, false, {
                    fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                    lineNumber: 339,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                lineNumber: 338,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
        lineNumber: 329,
        columnNumber: 5
    }, this);
}
_c2 = HeroMetric;
function MetricCard({ title, value, caption, tone }) {
    const color = tone === "emerald" ? "from-emerald-500 to-cyan-400" : tone === "red" ? "from-red-600 to-rose-500" : tone === "amber" ? "from-amber-500 to-orange-400" : "from-blue-600 to-cyan-400";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
        className: "group rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-sm backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-2xl",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `mb-5 h-2 w-16 rounded-full bg-gradient-to-r ${color}`
            }, void 0, false, {
                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                lineNumber: 367,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs font-black uppercase tracking-[0.22em] text-slate-400",
                children: title
            }, void 0, false, {
                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                lineNumber: 368,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-3 text-4xl font-black tracking-tight text-slate-950",
                children: value
            }, void 0, false, {
                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                lineNumber: 369,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-2 text-sm font-semibold text-slate-500",
                children: caption
            }, void 0, false, {
                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                lineNumber: 370,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
        lineNumber: 366,
        columnNumber: 5
    }, this);
}
_c3 = MetricCard;
function ModuleCard({ module, index, onInspect }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
        className: "group relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-sm backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl",
        style: {
            animation: "fadeInUp 0.35s ease both",
            animationDelay: `${Math.min(index * 24, 280)}ms`
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br ${module.accent} opacity-15 blur-xl transition group-hover:scale-125`
            }, void 0, false, {
                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                lineNumber: 381,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative flex items-start justify-between gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `grid h-14 w-14 place-items-center rounded-3xl bg-gradient-to-br ${module.accent} text-xl font-black text-white shadow-xl`,
                        children: module.tag.slice(0, 2)
                    }, void 0, false, {
                        fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                        lineNumber: 384,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Badge, {
                                className: statusStyles[module.status],
                                children: module.status
                            }, void 0, false, {
                                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                lineNumber: 389,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Badge, {
                                className: riskStyles[module.risk],
                                children: module.risk
                            }, void 0, false, {
                                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                lineNumber: 390,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                        lineNumber: 388,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                lineNumber: 383,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative mt-5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs font-black uppercase tracking-[0.22em] text-emerald-700",
                        children: module.subtitle
                    }, void 0, false, {
                        fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                        lineNumber: 395,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "mt-2 text-2xl font-black tracking-tight text-slate-950",
                        children: module.title
                    }, void 0, false, {
                        fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                        lineNumber: 396,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-3 min-h-20 text-sm font-semibold leading-7 text-slate-600",
                        children: module.description
                    }, void 0, false, {
                        fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                        lineNumber: 397,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                lineNumber: 394,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative mt-5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-2 flex items-center justify-between text-xs font-black text-slate-500",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Progreso del módulo"
                            }, void 0, false, {
                                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                lineNumber: 402,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: [
                                    module.progress,
                                    "%"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                lineNumber: 403,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                        lineNumber: 401,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-2 overflow-hidden rounded-full bg-slate-100",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `h-full rounded-full bg-gradient-to-r ${module.accent}`,
                            style: {
                                width: `${module.progress}%`
                            }
                        }, void 0, false, {
                            fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                            lineNumber: 407,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                        lineNumber: 406,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                lineNumber: 400,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative mt-5 flex flex-wrap gap-2",
                children: module.items.slice(0, 5).map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600",
                        children: item
                    }, item, false, {
                        fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                        lineNumber: 413,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                lineNumber: 411,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative mt-6 flex flex-wrap gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: module.href,
                        className: "rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-600",
                        children: "Abrir módulo"
                    }, void 0, false, {
                        fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                        lineNumber: 420,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onInspect,
                        className: "rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-slate-100",
                        children: "Vista rápida"
                    }, void 0, false, {
                        fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                        lineNumber: 424,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                lineNumber: 419,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
        lineNumber: 377,
        columnNumber: 5
    }, this);
}
_c4 = ModuleCard;
function Badge({ children, className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `inline-flex items-center rounded-full border px-3 py-1 text-xs font-black ${className}`,
        children: children
    }, void 0, false, {
        fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
        lineNumber: 434,
        columnNumber: 5
    }, this);
}
_c5 = Badge;
function Panel({ title, subtitle, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-sm backdrop-blur-xl",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs font-black uppercase tracking-[0.22em] text-slate-400",
                children: subtitle
            }, void 0, false, {
                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                lineNumber: 443,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "mt-1 text-2xl font-black text-slate-950",
                children: title
            }, void 0, false, {
                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                lineNumber: 444,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-5",
                children: children
            }, void 0, false, {
                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                lineNumber: 445,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
        lineNumber: 442,
        columnNumber: 5
    }, this);
}
_c6 = Panel;
function NotificationCard({ title, description, tone }) {
    const className = tone === "blue" ? "border-blue-200 bg-blue-50 text-blue-800" : tone === "red" ? "border-red-200 bg-red-50 text-red-800" : "border-cyan-200 bg-cyan-50 text-cyan-800";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `rounded-[1.5rem] border p-4 ${className}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm font-black",
                children: title
            }, void 0, false, {
                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                lineNumber: 460,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-1 text-sm font-semibold opacity-80",
                children: description
            }, void 0, false, {
                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                lineNumber: 461,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
        lineNumber: 459,
        columnNumber: 5
    }, this);
}
_c7 = NotificationCard;
function MiniModule({ module, onClick }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        onClick: onClick,
        className: "w-full rounded-[1.5rem] border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-between gap-3",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm font-black text-slate-950",
                            children: module.title
                        }, void 0, false, {
                            fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                            lineNumber: 471,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-1 text-xs font-bold text-slate-500",
                            children: module.subtitle
                        }, void 0, false, {
                            fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                            lineNumber: 472,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                    lineNumber: 470,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Badge, {
                    className: riskStyles[module.risk],
                    children: module.risk
                }, void 0, false, {
                    fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                    lineNumber: 474,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
            lineNumber: 469,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
        lineNumber: 468,
        columnNumber: 5
    }, this);
}
_c8 = MiniModule;
function SkeletonCard() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-sm",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-12 w-12 animate-pulse rounded-3xl bg-slate-100"
            }, void 0, false, {
                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                lineNumber: 483,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-6 h-7 w-2/3 animate-pulse rounded-xl bg-slate-100"
            }, void 0, false, {
                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                lineNumber: 484,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-3 h-4 w-full animate-pulse rounded-xl bg-slate-100"
            }, void 0, false, {
                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                lineNumber: 485,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-2 h-4 w-5/6 animate-pulse rounded-xl bg-slate-100"
            }, void 0, false, {
                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                lineNumber: 486,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-6 h-11 w-36 animate-pulse rounded-2xl bg-slate-100"
            }, void 0, false, {
                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                lineNumber: 487,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
        lineNumber: 482,
        columnNumber: 5
    }, this);
}
_c9 = SkeletonCard;
function EmptyState({ title, description, onReset }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-[2rem] border border-dashed border-slate-300 bg-white/80 p-10 text-center shadow-sm",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-slate-950 text-2xl text-white",
                children: "◇"
            }, void 0, false, {
                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                lineNumber: 495,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "mt-5 text-2xl font-black text-slate-950",
                children: title
            }, void 0, false, {
                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                lineNumber: 496,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mx-auto mt-2 max-w-xl text-sm font-semibold leading-6 text-slate-500",
                children: description
            }, void 0, false, {
                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                lineNumber: 497,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: onReset,
                className: "mt-6 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-500",
                children: "Limpiar filtros"
            }, void 0, false, {
                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                lineNumber: 498,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
        lineNumber: 494,
        columnNumber: 5
    }, this);
}
_c10 = EmptyState;
function DetailDrawer({ module, onClose }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-[9999] bg-slate-950/40 p-4 backdrop-blur-sm",
        onClick: onClose,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
            className: "ml-auto flex h-full w-full max-w-xl flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl",
            onClick: (event)=>event.stopPropagation(),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                    className: `bg-gradient-to-br ${module.accent} p-6 text-white`,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start justify-between gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs font-black uppercase tracking-[0.25em] text-white/70",
                                        children: module.tag
                                    }, void 0, false, {
                                        fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                        lineNumber: 512,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "mt-3 text-4xl font-black tracking-tight",
                                        children: module.title
                                    }, void 0, false, {
                                        fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                        lineNumber: 513,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-2 text-sm font-semibold text-white/80",
                                        children: module.subtitle
                                    }, void 0, false, {
                                        fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                        lineNumber: 514,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                lineNumber: 511,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: onClose,
                                className: "rounded-2xl bg-white/15 px-4 py-2 text-xs font-black text-white transition hover:bg-white/25",
                                children: "Cerrar"
                            }, void 0, false, {
                                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                lineNumber: 517,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                        lineNumber: 510,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                    lineNumber: 509,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1 space-y-5 overflow-auto p-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Badge, {
                                    className: statusStyles[module.status],
                                    children: module.status
                                }, void 0, false, {
                                    fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                    lineNumber: 525,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Badge, {
                                    className: riskStyles[module.risk],
                                    children: [
                                        "Riesgo ",
                                        module.risk
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                    lineNumber: 526,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Badge, {
                                    className: "border-slate-200 bg-slate-50 text-slate-700",
                                    children: module.group
                                }, void 0, false, {
                                    fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                    lineNumber: 527,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                            lineNumber: 524,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-base font-semibold leading-8 text-slate-600",
                            children: module.description
                        }, void 0, false, {
                            fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                            lineNumber: 530,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-[1.5rem] bg-slate-50 p-5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs font-black uppercase tracking-[0.2em] text-slate-400",
                                    children: "Items internos"
                                }, void 0, false, {
                                    fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                    lineNumber: 533,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-4 grid gap-3",
                                    children: module.items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: item
                                                }, void 0, false, {
                                                    fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                    lineNumber: 537,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-emerald-600",
                                                    children: "Activo"
                                                }, void 0, false, {
                                                    fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                                    lineNumber: 538,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, item, true, {
                                            fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                            lineNumber: 536,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                    lineNumber: 534,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                            lineNumber: 532,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-[1.5rem] bg-slate-950 p-5 text-white",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs font-black uppercase tracking-[0.2em] text-slate-400",
                                    children: "Highlights"
                                }, void 0, false, {
                                    fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                    lineNumber: 545,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-4 flex flex-wrap gap-2",
                                    children: module.highlights.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "rounded-full bg-white/10 px-3 py-2 text-xs font-black text-white",
                                            children: item
                                        }, item, false, {
                                            fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                            lineNumber: 548,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                                    lineNumber: 546,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                            lineNumber: 544,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                    lineNumber: 523,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                    className: "border-t border-slate-200 p-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: module.href,
                        className: "block rounded-2xl bg-slate-950 px-5 py-4 text-center text-sm font-black text-white transition hover:bg-emerald-600",
                        children: "Abrir módulo completo"
                    }, void 0, false, {
                        fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                        lineNumber: 557,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                    lineNumber: 556,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
            lineNumber: 508,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
        lineNumber: 507,
        columnNumber: 5
    }, this);
}
_c11 = DetailDrawer;
function MobileNav() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: "fixed bottom-3 left-3 right-3 z-50 grid grid-cols-4 gap-2 rounded-[1.5rem] border border-white/70 bg-white/90 p-2 shadow-2xl backdrop-blur-xl lg:hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                href: "/",
                className: "rounded-2xl bg-slate-950 px-3 py-3 text-center text-xs font-black text-white",
                children: "Inicio"
            }, void 0, false, {
                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                lineNumber: 569,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                href: "/riesgos",
                className: "rounded-2xl px-3 py-3 text-center text-xs font-black text-slate-700",
                children: "Riesgos"
            }, void 0, false, {
                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                lineNumber: 570,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                href: "/reportes-programados",
                className: "rounded-2xl px-3 py-3 text-center text-xs font-black text-slate-700",
                children: "Reportes"
            }, void 0, false, {
                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                lineNumber: 571,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                href: "/workflows",
                className: "rounded-2xl px-3 py-3 text-center text-xs font-black text-slate-700",
                children: "QA"
            }, void 0, false, {
                fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
                lineNumber: 572,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx",
        lineNumber: 568,
        columnNumber: 5
    }, this);
}
_c12 = MobileNav;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11, _c12;
__turbopack_context__.k.register(_c, "CommandCenterPage");
__turbopack_context__.k.register(_c1, "QuickAction");
__turbopack_context__.k.register(_c2, "HeroMetric");
__turbopack_context__.k.register(_c3, "MetricCard");
__turbopack_context__.k.register(_c4, "ModuleCard");
__turbopack_context__.k.register(_c5, "Badge");
__turbopack_context__.k.register(_c6, "Panel");
__turbopack_context__.k.register(_c7, "NotificationCard");
__turbopack_context__.k.register(_c8, "MiniModule");
__turbopack_context__.k.register(_c9, "SkeletonCard");
__turbopack_context__.k.register(_c10, "EmptyState");
__turbopack_context__.k.register(_c11, "DetailDrawer");
__turbopack_context__.k.register(_c12, "MobileNav");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/gacp-growlifecol/src/components/floratrack/CommandCenterPage.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=gacp-growlifecol_src_1vhve21._.js.map