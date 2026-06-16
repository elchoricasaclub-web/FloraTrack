"use client";

import { useEffect, useMemo, useState } from "react";

type RiskRecord = {
  id: string;
  codigoRiesgo: string;
  fechaIdentificacion: string;
  horaIdentificacion: string;
  empresa: string;
  sede: string;
  areaProceso: string;
  moduloRelacionado: string;
  procesoActividad: string;
  tipoRiesgo: string;
  fuenteRiesgo: string;
  descripcionRiesgo: string;
  causaPotencial: string;
  consecuenciaPotencial: string;
  severidad: string;
  probabilidad: string;
  detectabilidad: string;
  rpnCalculado: string;
  nivelRiesgo: string;
  controlesExistentes: string;
  planMitigacion: string;
  responsableMitigacion: string;
  fechaObjetivo: string;
  requiereCAPA: string;
  desviacionAsociada: string;
  capa: string;
  estadoRiesgo: string;
  verificacionEficacia: string;
  fechaCierre: string;
  decisionQA: string;
  evidencia: string;
  observaciones: string;
  creadoEn: string;
  actualizadoEn: string;
};

type FieldConfig = {
  key: keyof RiskRecord;
  label: string;
  type?: string;
  placeholder?: string;
  kind?: "input" | "select" | "textarea";
  options?: string[];
};

type CloudTone = "success" | "warning";

type CloudState = {
  message: string;
  errors: string[];
  tone: CloudTone;
};

const STORAGE_KEY = "floratrack_gestion_riesgos_gxp_v1";
const RISK_DRAFT_KEY = "floratrack_bridge_cambios_to_riesgos_v1";
const WORKFLOW_DRAFT_KEY = "floratrack_bridge_riesgos_to_workflows_v1";

const emptyForm: RiskRecord = {
  id: "",
  codigoRiesgo: "",
  fechaIdentificacion: "",
  horaIdentificacion: "",
  empresa: "",
  sede: "",
  areaProceso: "",
  moduloRelacionado: "",
  procesoActividad: "",
  tipoRiesgo: "",
  fuenteRiesgo: "",
  descripcionRiesgo: "",
  causaPotencial: "",
  consecuenciaPotencial: "",
  severidad: "",
  probabilidad: "",
  detectabilidad: "",
  rpnCalculado: "",
  nivelRiesgo: "",
  controlesExistentes: "",
  planMitigacion: "",
  responsableMitigacion: "",
  fechaObjetivo: "",
  requiereCAPA: "",
  desviacionAsociada: "",
  capa: "",
  estadoRiesgo: "",
  verificacionEficacia: "",
  fechaCierre: "",
  decisionQA: "",
  evidencia: "",
  observaciones: "",
  creadoEn: "",
  actualizadoEn: "",
};

const requiredFields: Array<keyof RiskRecord> = [
  "codigoRiesgo",
  "fechaIdentificacion",
  "horaIdentificacion",
  "empresa",
  "sede",
  "areaProceso",
  "moduloRelacionado",
  "procesoActividad",
  "tipoRiesgo",
  "fuenteRiesgo",
  "descripcionRiesgo",
  "causaPotencial",
  "consecuenciaPotencial",
  "severidad",
  "probabilidad",
  "detectabilidad",
  "nivelRiesgo",
  "controlesExistentes",
  "planMitigacion",
  "responsableMitigacion",
  "fechaObjetivo",
  "requiereCAPA",
  "estadoRiesgo",
  "verificacionEficacia",
  "decisionQA",
];

const fieldLabels: Record<keyof RiskRecord, string> = {
  id: "ID",
  codigoRiesgo: "Código de riesgo",
  fechaIdentificacion: "Fecha de identificación",
  horaIdentificacion: "Hora de identificación",
  empresa: "Empresa",
  sede: "Sede / predio",
  areaProceso: "Área / proceso",
  moduloRelacionado: "Módulo relacionado",
  procesoActividad: "Proceso / actividad",
  tipoRiesgo: "Tipo de riesgo",
  fuenteRiesgo: "Fuente del riesgo",
  descripcionRiesgo: "Descripción del riesgo",
  causaPotencial: "Causa potencial",
  consecuenciaPotencial: "Consecuencia potencial",
  severidad: "Severidad",
  probabilidad: "Probabilidad",
  detectabilidad: "Detectabilidad",
  rpnCalculado: "RPN calculado",
  nivelRiesgo: "Nivel de riesgo",
  controlesExistentes: "Controles existentes",
  planMitigacion: "Plan de mitigación",
  responsableMitigacion: "Responsable de mitigación",
  fechaObjetivo: "Fecha objetivo",
  requiereCAPA: "Requiere CAPA",
  desviacionAsociada: "Desviación asociada",
  capa: "CAPA",
  estadoRiesgo: "Estado del riesgo",
  verificacionEficacia: "Verificación de eficacia",
  fechaCierre: "Fecha de cierre",
  decisionQA: "Decisión QA",
  evidencia: "Evidencia",
  observaciones: "Observaciones",
  creadoEn: "Creado en",
  actualizadoEn: "Actualizado en",
};

const moduleOptions = [
  "Empresas",
  "GIS",
  "Cultivos",
  "Propagación",
  "Cosecha",
  "Recepción",
  "Inventario",
  "Calidad QA",
  "Desviaciones / CAPA",
  "Auditorías",
  "Documentos",
  "Firmas electrónicas",
  "Part 11",
  "Backups",
  "Integraciones",
  "Workflows QA",
  "Automatizaciones QA",
  "Control de Cambios",
  "Entrenamiento",
  "Equipos",
  "Proveedores",
  "Saneamiento",
  "Plagas / MIP",
  "Residuos",
  "Recall",
  "Retención",
  "Usuarios",
  "Reportes",
  "Notificaciones",
  "CSV / DataOps",
  "Regulatorio",
  "Múltiples módulos",
];

const scoreOptions = [
  "1",
  "2",
  "3",
  "4",
  "5",
];

const fields: FieldConfig[] = [
  { key: "codigoRiesgo", label: "Código de riesgo *", placeholder: "RISK-2026-001" },
  { key: "fechaIdentificacion", label: "Fecha de identificación *", type: "date" },
  { key: "horaIdentificacion", label: "Hora de identificación *", type: "time" },
  { key: "empresa", label: "Empresa *", placeholder: "Growlifecol S.A.S." },
  { key: "sede", label: "Sede / predio *", placeholder: "Sede principal" },
  {
    key: "areaProceso",
    label: "Área / proceso *",
    kind: "select",
    options: [
      "Dirección técnica",
      "QA",
      "QC",
      "Regulatorio",
      "Recepción",
      "Inventario",
      "Cultivo",
      "Propagación",
      "Cosecha",
      "Postcosecha",
      "Extracción",
      "Mantenimiento",
      "Saneamiento",
      "Almacén",
      "Documentación",
      "Entrenamiento",
      "TI / Validación",
      "Proveedores",
      "Distribución",
      "Administración",
    ],
  },
  {
    key: "moduloRelacionado",
    label: "Módulo relacionado *",
    kind: "select",
    options: moduleOptions,
  },
  { key: "procesoActividad", label: "Proceso / actividad *", placeholder: "Ej: liberación QA, trazabilidad de lote, firma electrónica, backup..." },
  {
    key: "tipoRiesgo",
    label: "Tipo de riesgo *",
    kind: "select",
    options: [
      "GACP",
      "GMP",
      "QA/QC",
      "Regulatorio",
      "Integridad de datos",
      "Seguridad de acceso",
      "Proveedor",
      "Equipo / calibración",
      "Documental",
      "Entrenamiento",
      "Ambiental",
      "Microbiológico",
      "Recall",
      "Software / Part 11",
      "Continuidad / backup",
      "Integración externa",
      "Otro",
    ],
  },
  {
    key: "fuenteRiesgo",
    label: "Fuente del riesgo *",
    kind: "select",
    options: [
      "Auditoría",
      "Desviación",
      "CAPA",
      "Control de cambios",
      "Revisión QA",
      "Reporte KPI",
      "Hallazgo operativo",
      "Proveedor",
      "Queja / reclamo",
      "Regulatorio",
      "Validación",
      "Análisis preventivo",
      "Incidente",
      "Otro",
    ],
  },
  {
    key: "descripcionRiesgo",
    label: "Descripción del riesgo *",
    kind: "textarea",
    placeholder: "Describe claramente el riesgo, qué puede fallar, dónde, cuándo y cómo impacta GACP/GMP.",
  },
  {
    key: "causaPotencial",
    label: "Causa potencial *",
    kind: "textarea",
    placeholder: "Describe causa raíz potencial, deficiencia, condición, brecha de control o exposición.",
  },
  {
    key: "consecuenciaPotencial",
    label: "Consecuencia potencial *",
    kind: "textarea",
    placeholder: "Describe impacto potencial en producto, paciente, datos, lote, cumplimiento, autoridad o operación.",
  },
  {
    key: "severidad",
    label: "Severidad 1-5 *",
    kind: "select",
    options: scoreOptions,
  },
  {
    key: "probabilidad",
    label: "Probabilidad 1-5 *",
    kind: "select",
    options: scoreOptions,
  },
  {
    key: "detectabilidad",
    label: "Detectabilidad 1-5 *",
    kind: "select",
    options: scoreOptions,
  },
  {
    key: "nivelRiesgo",
    label: "Nivel de riesgo *",
    kind: "select",
    options: ["Bajo", "Medio", "Alto", "Crítico"],
  },
  {
    key: "controlesExistentes",
    label: "Controles existentes *",
    kind: "textarea",
    placeholder: "SOP, entrenamiento, QA review, validación, monitoreo, alarma, doble verificación, audit trail, etc.",
  },
  {
    key: "planMitigacion",
    label: "Plan de mitigación *",
    kind: "textarea",
    placeholder: "Acciones preventivas o correctivas, controles adicionales, responsables, fechas y criterios de eficacia.",
  },
  { key: "responsableMitigacion", label: "Responsable de mitigación *", placeholder: "Responsable QA / técnico / área dueña del riesgo" },
  { key: "fechaObjetivo", label: "Fecha objetivo *", type: "date" },
  {
    key: "requiereCAPA",
    label: "Requiere CAPA *",
    kind: "select",
    options: ["Sí", "No"],
  },
  { key: "desviacionAsociada", label: "Desviación asociada", placeholder: "DEV-2026-001 / CAPA-001" },
  {
    key: "capa",
    label: "CAPA",
    kind: "textarea",
    placeholder: "Obligatoria si riesgo es alto/crítico, RPN elevado, eficacia no conforme o decisión QA requiere CAPA.",
  },
  {
    key: "estadoRiesgo",
    label: "Estado del riesgo *",
    kind: "select",
    options: [
      "Identificado",
      "En evaluación",
      "Mitigación planificada",
      "En mitigación",
      "Mitigado",
      "Aceptado por QA",
      "Cerrado",
      "Reabierto",
      "Escalado",
    ],
  },
  {
    key: "verificacionEficacia",
    label: "Verificación de eficacia *",
    kind: "select",
    options: ["Pendiente", "Conforme", "Con observación", "No conforme", "No aplica"],
  },
  { key: "fechaCierre", label: "Fecha de cierre", type: "date" },
  {
    key: "decisionQA",
    label: "Decisión QA *",
    kind: "select",
    options: [
      "Pendiente QA",
      "Aprobado QA",
      "Aceptado con justificación QA",
      "Rechazado QA",
      "Requiere CAPA",
      "Requiere escalamiento",
      "Requiere monitoreo",
      "Cierre aprobado QA",
    ],
  },
  { key: "evidencia", label: "Evidencia / soporte", placeholder: "Matriz de riesgo, acta, análisis, reporte, CAPA, evidencia de eficacia, auditoría..." },
  {
    key: "observaciones",
    label: "Observaciones",
    kind: "textarea",
    placeholder: "Notas QA, restricciones, justificación de aceptación, monitoreo, próximas revisiones o riesgo residual.",
  },
];

function clean(value: unknown): string {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function isInvalid(value: unknown): boolean {
  return ["", "seleccione", "seleccionar", "sin definir", "n/a", "na", "ninguno", "null", "undefined"].includes(
    clean(value).toLowerCase()
  );
}

function toNumber(value: string): number {
  return Number(clean(value));
}

function safeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `RISK-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function isDateBefore(dateA: string, dateB: string): boolean {
  if (!dateA || !dateB) return false;

  const first = new Date(dateA).getTime();
  const second = new Date(dateB).getTime();

  return Number.isFinite(first) && Number.isFinite(second) && first < second;
}

function loadRecords(): RiskRecord[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
}

function saveRecords(records: RiskRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}



function bridgeRiskClean(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function bridgeRiskNumber(value: unknown): number {
  const parsed = Number(bridgeRiskClean(value));
  return Number.isFinite(parsed) ? parsed : 0;
}

function workflowPriorityFromRisk(record: RiskRecord): string {
  const level = bridgeRiskClean(record.nivelRiesgo).toLowerCase();
  const rpn = bridgeRiskNumber(record.rpnCalculado);

  if (level.includes("crit") || rpn >= 75) return "Crítica";
  if (level.includes("alto") || rpn >= 40) return "Alta";
  if (level.includes("medio") || rpn >= 15) return "Media";
  return "Baja";
}

function workflowTypeFromRisk(record: RiskRecord): string {
  const level = bridgeRiskClean(record.nivelRiesgo).toLowerCase();
  const decision = bridgeRiskClean(record.decisionQA).toLowerCase();
  const capa = bridgeRiskClean(record.requiereCAPA).toLowerCase();

  if (level.includes("crit") || decision.includes("escalamiento")) return "Escalamiento crítico";
  if (capa === "sí" || capa === "si" || decision.includes("capa")) return "Cierre CAPA";
  return "Revisión QA";
}

function workflowSlaFromRisk(record: RiskRecord): string {
  const priority = workflowPriorityFromRisk(record);

  if (priority === "Crítica") return "24";
  if (priority === "Alta") return "48";
  if (priority === "Media") return "120";
  return "240";
}

function workflowDeadlineFromRisk(record: RiskRecord): string {
  const explicitDate = bridgeRiskClean(record.fechaObjetivo);
  if (explicitDate) return explicitDate;

  const date = new Date();
  const priority = workflowPriorityFromRisk(record);
  date.setDate(date.getDate() + (priority === "Crítica" ? 1 : priority === "Alta" ? 2 : 7));

  return date.toISOString().slice(0, 10);
}

function workflowModuleFromRisk(record: RiskRecord): string {
  const text = `${bridgeRiskClean(record.tipoRiesgo)} ${bridgeRiskClean(record.moduloRelacionado)} ${bridgeRiskClean(record.areaProceso)}`.toLowerCase();

  if (text.includes("regulatorio") || text.includes("ica") || text.includes("invima") || text.includes("dian")) return "Regulatorio";
  if (text.includes("proveedor")) return "Proveedores";
  if (text.includes("entrenamiento")) return "Entrenamiento";
  if (text.includes("document")) return "Documentos";
  if (text.includes("part 11")) return "Part 11";
  if (text.includes("backup")) return "Backups";
  if (text.includes("integracion") || text.includes("integración") || text.includes("api")) return "Integraciones";
  if (text.includes("capa") || text.includes("desviacion") || text.includes("desviación")) return "Desviaciones / CAPA";

  return "Calidad QA";
}

function workflowAreaFromRisk(record: RiskRecord): string {
  const area = bridgeRiskClean(record.areaProceso);
  const normalized = area.toLowerCase();

  if (normalized.includes("regulatorio")) return "Regulatorio";
  if (normalized.includes("qc")) return "QC";
  if (normalized.includes("ti") || normalized.includes("valid")) return "TI / Validación";
  if (normalized.includes("proveedor")) return "Proveedores";
  if (normalized.includes("cultivo")) return "Cultivo";
  if (normalized.includes("cosecha")) return "Cosecha";
  if (normalized.includes("extraccion") || normalized.includes("extracción")) return "Extracción";
  if (normalized.includes("document")) return "Documentación";

  return "QA";
}

function buildWorkflowDraftFromRisk(record: RiskRecord): Record<string, string> {
  const sourceCode = bridgeRiskClean(record.codigoRiesgo) || `RISK-${new Date().toISOString().slice(0, 10)}`;
  const now = new Date();
  const priority = workflowPriorityFromRisk(record);
  const decision = bridgeRiskClean(record.decisionQA).toLowerCase();
  const capa = bridgeRiskClean(record.requiereCAPA).toLowerCase();
  const requiresEscalation = priority === "Crítica" || priority === "Alta" || decision.includes("escalamiento");
  const requiresSignature =
    priority === "Crítica" ||
    priority === "Alta" ||
    decision.includes("aprobado") ||
    decision.includes("aceptado") ||
    decision.includes("cierre");
  const capaRequired = capa === "sí" || capa === "si" || decision.includes("capa");

  return {
    codigoWorkflow: `WF-${sourceCode}`,
    fechaCreacion: now.toISOString().slice(0, 10),
    horaCreacion: now.toISOString().slice(11, 16),
    empresa: bridgeRiskClean(record.empresa),
    sede: bridgeRiskClean(record.sede),
    moduloOrigen: workflowModuleFromRisk(record),
    registroAsociado: sourceCode,
    tipoWorkflow: workflowTypeFromRisk(record),
    etapaActual: "Creado",
    prioridad: priority,
    responsableAsignado: bridgeRiskClean(record.responsableMitigacion) || "Responsable pendiente",
    areaResponsable: workflowAreaFromRisk(record),
    aprobadorQA: "QA pendiente",
    responsableTecnico: bridgeRiskClean(record.responsableMitigacion) || bridgeRiskClean(record.areaProceso) || "Responsable técnico pendiente",
    fechaLimite: workflowDeadlineFromRisk(record),
    slaHoras: workflowSlaFromRisk(record),
    estadoWorkflow: "Abierto",
    requiereFirmaElectronica: requiresSignature ? "Sí" : "No",
    firmaAsociada: requiresSignature ? `SIG-${sourceCode}` : "",
    requiereEscalamiento: requiresEscalation ? "Sí" : "No",
    escaladoA: requiresEscalation ? "QA Manager / Dirección técnica" : "",
    motivoWorkflow: `Workflow QA generado desde riesgo ${sourceCode}. Mitigación: ${bridgeRiskClean(record.planMitigacion) || "pendiente"}. Consecuencia: ${bridgeRiskClean(record.consecuenciaPotencial) || "pendiente"}.`,
    decisionQA: "Pendiente QA",
    auditTrailReferencia: `AUDIT-WF-${sourceCode}`,
    evidencia: bridgeRiskClean(record.evidencia),
    desviacionAsociada: bridgeRiskClean(record.desviacionAsociada),
    capa: bridgeRiskClean(record.capa) || (capaRequired ? "Definir CAPA asociada a mitigación del riesgo antes del cierre." : ""),
    observaciones: `Borrador importado desde Gestión de Riesgos. RPN ${bridgeRiskClean(record.rpnCalculado) || "pendiente"}; nivel ${bridgeRiskClean(record.nivelRiesgo) || "pendiente"}. Revisar responsables, SLA, firma, escalamiento y evidencia antes de guardar.`,
  };
}

function loadRiskDraftFromChange(): Partial<RiskRecord> | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(RISK_DRAFT_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;

    const source = parsed as Record<string, unknown>;
    const draft: Partial<RiskRecord> = {};

    (Object.keys(emptyForm) as Array<keyof RiskRecord>).forEach((field) => {
      const value = source[field];
      if (typeof value === "string") draft[field] = value;
    });

    return Object.keys(draft).length > 0 ? draft : null;
  } catch {
    return null;
  }
}

export default function RiesgosPage() {
  const [records, setRecords] = useState<RiskRecord[]>([]);
  const [form, setForm] = useState<RiskRecord>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [cloud, setCloud] = useState<CloudState | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("Todos");

  useEffect(() => {
    setRecords(loadRecords());

    const draft = loadRiskDraftFromChange();
    if (!draft) return;

    setForm((current) => ({
      ...current,
      ...draft,
      id: "",
      creadoEn: "",
      actualizadoEn: "",
    }));
    window.localStorage.removeItem(RISK_DRAFT_KEY);
    setCloud({
      message: "Borrador importado desde Control de Cambios.",
      errors: ["Revisa RPN, controles, mitigacion, evidencia y decision QA antes de guardar."],
      tone: "success",
    });

    const timer = window.setTimeout(() => setCloud(null), 9000);
    return () => window.clearTimeout(timer);
  }, []);

  function showCloud(message: string, errors: string[] = [], tone: CloudTone = "warning") {
    setCloud({ message, errors, tone });
    setValidationErrors(errors);

    window.setTimeout(() => {
      setCloud(null);
      if (errors.length === 0) setValidationErrors([]);
    }, errors.length > 0 ? 12000 : 6000);
  }

  function updateField(field: keyof RiskRecord, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function calculatedRpn(): number {
    const severity = toNumber(form.severidad);
    const probability = toNumber(form.probabilidad);
    const detectability = toNumber(form.detectabilidad);

    if (!Number.isFinite(severity) || !Number.isFinite(probability) || !Number.isFinite(detectability)) {
      return 0;
    }

    return severity * probability * detectability;
  }

  function expectedRiskLevel(): "Bajo" | "Medio" | "Alto" | "Crítico" {
    const rpn = calculatedRpn();

    if (rpn >= 75) return "Crítico";
    if (rpn >= 40) return "Alto";
    if (rpn >= 15) return "Medio";
    return "Bajo";
  }

  function isHighRisk(): boolean {
    return ["Alto", "Crítico"].includes(form.nivelRiesgo) || calculatedRpn() >= 40;
  }

  function needsCapa(): boolean {
    return (
      form.requiereCAPA === "Sí" ||
      isHighRisk() ||
      form.verificacionEficacia === "No conforme" ||
      ["Rechazado QA", "Requiere CAPA", "Requiere escalamiento"].includes(form.decisionQA) ||
      ["Reabierto", "Escalado"].includes(form.estadoRiesgo)
    );
  }

  function validateForm(): string[] {
    const errors = requiredFields
      .filter((field) => isInvalid(form[field]))
      .map((field) => fieldLabels[field]);

    const severity = toNumber(form.severidad);
    const probability = toNumber(form.probabilidad);
    const detectability = toNumber(form.detectabilidad);
    const rpn = calculatedRpn();

    if (!Number.isFinite(severity) || severity < 1 || severity > 5) {
      errors.push("La severidad debe estar entre 1 y 5");
    }

    if (!Number.isFinite(probability) || probability < 1 || probability > 5) {
      errors.push("La probabilidad debe estar entre 1 y 5");
    }

    if (!Number.isFinite(detectability) || detectability < 1 || detectability > 5) {
      errors.push("La detectabilidad debe estar entre 1 y 5");
    }

    if (rpn >= 40 && !["Alto", "Crítico"].includes(form.nivelRiesgo)) {
      errors.push("Un RPN igual o superior a 40 debe clasificarse como riesgo Alto o Crítico");
    }

    if (rpn >= 75 && form.nivelRiesgo !== "Crítico") {
      errors.push("Un RPN igual o superior a 75 debe clasificarse como riesgo Crítico");
    }

    if (form.fechaObjetivo && form.fechaIdentificacion && isDateBefore(form.fechaObjetivo, form.fechaIdentificacion)) {
      errors.push("La fecha objetivo no puede ser anterior a la fecha de identificación");
    }

    if (form.fechaCierre && form.fechaIdentificacion && isDateBefore(form.fechaCierre, form.fechaIdentificacion)) {
      errors.push("La fecha de cierre no puede ser anterior a la fecha de identificación");
    }

    if (isHighRisk() && form.requiereCAPA !== "Sí") {
      errors.push("Los riesgos Alto, Crítico o con RPN elevado deben requerir CAPA");
    }

    if (["Aceptado por QA", "Cerrado"].includes(form.estadoRiesgo) && !["Conforme", "No aplica"].includes(form.verificacionEficacia)) {
      errors.push("Un riesgo aceptado o cerrado debe tener eficacia conforme o no aplica documentado");
    }

    if (form.estadoRiesgo === "Cerrado" && isInvalid(form.fechaCierre)) {
      errors.push("La fecha de cierre es obligatoria cuando el riesgo está cerrado");
    }

    if (["Aprobado QA", "Aceptado con justificación QA", "Rechazado QA", "Cierre aprobado QA"].includes(form.decisionQA) && isInvalid(form.evidencia)) {
      errors.push("La evidencia es obligatoria para decisiones QA formales");
    }

    if (needsCapa() && isInvalid(form.desviacionAsociada)) {
      errors.push("La desviación asociada es obligatoria para riesgos altos/críticos, RPN elevado, eficacia no conforme o CAPA");
    }

    if (needsCapa() && isInvalid(form.capa)) {
      errors.push("La CAPA es obligatoria para riesgos altos/críticos, RPN elevado, eficacia no conforme o CAPA");
    }

    return Array.from(new Set(errors));
  }

  function fieldHasError(field: keyof RiskRecord): boolean {
    if (!submitAttempted) return false;

    const rpn = calculatedRpn();

    if (requiredFields.includes(field) && isInvalid(form[field])) return true;

    if (field === "severidad") {
      const value = toNumber(form.severidad);
      return !Number.isFinite(value) || value < 1 || value > 5;
    }

    if (field === "probabilidad") {
      const value = toNumber(form.probabilidad);
      return !Number.isFinite(value) || value < 1 || value > 5;
    }

    if (field === "detectabilidad") {
      const value = toNumber(form.detectabilidad);
      return !Number.isFinite(value) || value < 1 || value > 5;
    }

    if (field === "nivelRiesgo" && rpn >= 40 && !["Alto", "Crítico"].includes(form.nivelRiesgo)) return true;
    if (field === "nivelRiesgo" && rpn >= 75 && form.nivelRiesgo !== "Crítico") return true;
    if (field === "fechaObjetivo" && form.fechaObjetivo && form.fechaIdentificacion && isDateBefore(form.fechaObjetivo, form.fechaIdentificacion)) return true;
    if (field === "fechaCierre" && form.fechaCierre && form.fechaIdentificacion && isDateBefore(form.fechaCierre, form.fechaIdentificacion)) return true;
    if (field === "requiereCAPA" && isHighRisk() && form.requiereCAPA !== "Sí") return true;
    if (field === "verificacionEficacia" && ["Aceptado por QA", "Cerrado"].includes(form.estadoRiesgo) && !["Conforme", "No aplica"].includes(form.verificacionEficacia)) return true;
    if (field === "fechaCierre" && form.estadoRiesgo === "Cerrado" && isInvalid(form.fechaCierre)) return true;
    if (field === "evidencia" && ["Aprobado QA", "Aceptado con justificación QA", "Rechazado QA", "Cierre aprobado QA"].includes(form.decisionQA) && isInvalid(form.evidencia)) return true;
    if (field === "desviacionAsociada" && needsCapa() && isInvalid(form.desviacionAsociada)) return true;
    if (field === "capa" && needsCapa() && isInvalid(form.capa)) return true;

    return false;
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setSubmitAttempted(false);
    setValidationErrors([]);
    setCloud(null);
  }

  function handleSave() {
    setSubmitAttempted(true);

    const errors = validateForm();

    if (errors.length > 0) {
      showCloud("No se guardó el riesgo. Completa la información obligatoria.", errors, "warning");
      return;
    }

    const timestamp = nowIso();
    const rpn = calculatedRpn();

    const payload: RiskRecord = {
      ...form,
      codigoRiesgo: clean(form.codigoRiesgo),
      fechaIdentificacion: clean(form.fechaIdentificacion),
      horaIdentificacion: clean(form.horaIdentificacion),
      empresa: clean(form.empresa),
      sede: clean(form.sede),
      areaProceso: clean(form.areaProceso),
      moduloRelacionado: clean(form.moduloRelacionado),
      procesoActividad: clean(form.procesoActividad),
      tipoRiesgo: clean(form.tipoRiesgo),
      fuenteRiesgo: clean(form.fuenteRiesgo),
      descripcionRiesgo: clean(form.descripcionRiesgo),
      causaPotencial: clean(form.causaPotencial),
      consecuenciaPotencial: clean(form.consecuenciaPotencial),
      severidad: clean(form.severidad),
      probabilidad: clean(form.probabilidad),
      detectabilidad: clean(form.detectabilidad),
      rpnCalculado: String(rpn),
      nivelRiesgo: clean(form.nivelRiesgo),
      controlesExistentes: clean(form.controlesExistentes),
      planMitigacion: clean(form.planMitigacion),
      responsableMitigacion: clean(form.responsableMitigacion),
      fechaObjetivo: clean(form.fechaObjetivo),
      requiereCAPA: clean(form.requiereCAPA),
      desviacionAsociada: clean(form.desviacionAsociada),
      capa: clean(form.capa),
      estadoRiesgo: clean(form.estadoRiesgo),
      verificacionEficacia: clean(form.verificacionEficacia),
      fechaCierre: clean(form.fechaCierre),
      decisionQA: clean(form.decisionQA),
      evidencia: clean(form.evidencia),
      observaciones: clean(form.observaciones),
      id: editingId ?? safeId(),
      creadoEn: editingId ? form.creadoEn : timestamp,
      actualizadoEn: timestamp,
    };

    const nextRecords = editingId
      ? records.map((record) => (record.id === editingId ? payload : record))
      : [payload, ...records];

    setRecords(nextRecords);
    saveRecords(nextRecords);
    resetForm();

    showCloud(
      editingId ? "Riesgo actualizado correctamente." : "Riesgo GxP registrado correctamente con control QA.",
      [],
      "success"
    );
  }

  function handleEdit(record: RiskRecord) {
    setForm(record);
    setEditingId(record.id);
    setSubmitAttempted(false);
    showCloud("Riesgo cargado para edición. Verifica antes de actualizar.", [], "success");
  }

  function handleDelete(id: string) {
    const confirmed = window.confirm("¿Confirmas eliminar este riesgo? En ambiente GMP real debería manejarse como anulación auditada.");
    if (!confirmed) return;

    const nextRecords = records.filter((record) => record.id !== id);
    setRecords(nextRecords);
    saveRecords(nextRecords);
    showCloud("Riesgo eliminado del almacenamiento local.", [], "success");
  }


  function handleCreateWorkflowDraft(record: RiskRecord, redirect = false) {
    if (typeof window === "undefined") return;

    if (!bridgeRiskClean(record.codigoRiesgo) && !bridgeRiskClean(record.descripcionRiesgo)) {
      showCloud("No se creó workflow. Registra al menos código o descripción del riesgo.", [], "warning");
      return;
    }

    const draft = buildWorkflowDraftFromRisk(record);
    window.localStorage.setItem(WORKFLOW_DRAFT_KEY, JSON.stringify(draft));

    if (redirect) {
      window.location.href = "/workflows";
      return;
    }

    showCloud(
      "Borrador de workflow QA creado para /workflows.",
      [`Workflow sugerido: ${draft.codigoWorkflow}`, `Prioridad sugerida: ${draft.prioridad}`, "Abre /workflows para revisar y guardar."],
      "success"
    );
  }

  function exportJson() {
    if (records.length === 0) {
      showCloud("No hay riesgos para exportar.", [], "warning");
      return;
    }

    const blob = new Blob([JSON.stringify(records, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `floratrack-riesgos-gxp-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);

    showCloud("Archivo JSON de riesgos exportado correctamente.", [], "success");
  }

  const filteredRecords = useMemo(() => {
    const term = clean(search).toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        !term ||
        [
          record.codigoRiesgo,
          record.areaProceso,
          record.moduloRelacionado,
          record.procesoActividad,
          record.tipoRiesgo,
          record.fuenteRiesgo,
          record.nivelRiesgo,
          record.estadoRiesgo,
          record.decisionQA,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

      const matchesEstado = filterEstado === "Todos" || record.estadoRiesgo === filterEstado;

      return matchesSearch && matchesEstado;
    });
  }, [records, search, filterEstado]);

  const dashboard = useMemo(() => {
    return {
      total: records.length,
      altoCritico: records.filter((record) => ["Alto", "Crítico"].includes(record.nivelRiesgo)).length,
      capa: records.filter((record) => record.requiereCAPA === "Sí").length,
      abiertos: records.filter((record) => ["Identificado", "En evaluación", "Mitigación planificada", "En mitigación", "Reabierto", "Escalado"].includes(record.estadoRiesgo)).length,
      cerrados: records.filter((record) => ["Cerrado", "Aceptado por QA"].includes(record.estadoRiesgo)).length,
    };
  }, [records]);

  const currentRpn = calculatedRpn();
  const suggestedLevel = expectedRiskLevel();

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-slate-100">
      {cloud && (
        <CloudNotice
          message={cloud.message}
          errors={cloud.errors}
          tone={cloud.tone}
          onClose={() => {
            setCloud(null);
            if (cloud.errors.length === 0) setValidationErrors([]);
          }}
        />
      )}

      <section className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-3xl border border-red-400/20 bg-slate-900/80 p-6 shadow-2xl shadow-red-950/30">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-300">
                FloraTrack Enterprise Compliance Platform
              </p>

              <h1 className="mt-3 text-3xl font-black text-white md:text-5xl">
                Gestión de riesgos GxP
              </h1>

              <p className="mt-3 max-w-5xl text-sm leading-6 text-slate-300 md:text-base">
                Control de riesgos GACP/GMP, QA/QC, regulatorios, integridad de datos,
                proveedores, software, Part 11, severidad, probabilidad, detectabilidad,
                RPN, mitigación, CAPA, eficacia y decisión QA.
              </p>
            </div>

            <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-5 py-4 text-sm text-red-100">
              <p className="font-bold">Risk Management activo</p>
              <p className="mt-1 text-red-200">RPN · Mitigación · CAPA · QA · Eficacia</p>
            </div>
          </div>
        </header>

        {submitAttempted && validationErrors.length > 0 && (
          <section className="rounded-3xl border border-red-400/40 bg-red-500/10 p-5 text-red-100">
            <h2 className="text-lg font-black">No se puede guardar todavía</h2>
            <p className="mt-1 text-sm text-red-100/90">
              Completa la información obligatoria antes de crear el registro electrónico.
            </p>

            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {validationErrors.map((error) => (
                <div key={error} className="rounded-xl border border-red-400/30 bg-red-950/40 px-4 py-2 text-sm">
                  {error}
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="grid gap-4 md:grid-cols-5">
          <Metric title="Riesgos" value={dashboard.total} />
          <Metric title="Alto / crítico" value={dashboard.altoCritico} tone="red" />
          <Metric title="CAPA" value={dashboard.capa} tone="amber" />
          <Metric title="Abiertos" value={dashboard.abiertos} tone="sky" />
          <Metric title="Cerrados" value={dashboard.cerrados} tone="emerald" />
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <form
            noValidate
            className="rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-xl"
            onSubmit={(event) => {
              event.preventDefault();
              handleSave();
            }}
          >
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">{editingId ? "Editar riesgo" : "Nuevo riesgo GxP"}</h2>
                <p className="mt-1 text-sm text-slate-400">Ningún riesgo puede guardarse vacío o incompleto.</p>
              </div>

              {editingId && (
                <button type="button" onClick={resetForm} className="rounded-xl border border-slate-600 px-4 py-2 text-sm font-bold text-slate-200 hover:bg-slate-800">
                  Cancelar edición
                </button>
              )}
            </div>

            <div className="mb-5 rounded-3xl border border-red-400/30 bg-red-500/10 p-5">
              <p className="text-sm font-black uppercase tracking-wide text-red-200">RPN calculado</p>
              <div className="mt-2 flex flex-wrap items-end gap-4">
                <p className="text-5xl font-black text-white">{currentRpn}</p>
                <div>
                  <p className="text-sm text-slate-300">Nivel sugerido por RPN</p>
                  <p className="text-xl font-black text-red-200">{suggestedLevel}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {fields.map((field) => {
                const hasError = fieldHasError(field.key);
                const controlClass = hasError
                  ? "border-red-400 bg-red-950/30 ring-4 ring-red-400/20"
                  : "border-slate-700 bg-slate-950 focus:border-red-400 focus:ring-4 focus:ring-red-400/40";

                if (field.kind === "textarea") {
                  return (
                    <label key={field.key} className="md:col-span-2">
                      <span className="mb-2 block text-sm font-bold text-slate-200">{field.label}</span>

                      <textarea
                        value={form[field.key]}
                        onChange={(event) => updateField(field.key, event.target.value)}
                        rows={4}
                        placeholder={field.placeholder}
                        className={`w-full rounded-2xl border px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 ${controlClass}`}
                      />

                      {hasError && <p className="mt-1 text-xs font-bold text-red-300">Campo obligatorio o condición de riesgo requerida.</p>}
                    </label>
                  );
                }

                if (field.kind === "select") {
                  return (
                    <label key={field.key}>
                      <span className="mb-2 block text-sm font-bold text-slate-200">{field.label}</span>

                      <select
                        value={form[field.key]}
                        onChange={(event) => updateField(field.key, event.target.value)}
                        className={`w-full rounded-2xl border px-4 py-3 text-sm text-white outline-none transition ${controlClass}`}
                      >
                        <option value="">Seleccione</option>
                        {(field.options ?? []).map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>

                      {hasError && <p className="mt-1 text-xs font-bold text-red-300">Selecciona una opción válida.</p>}
                    </label>
                  );
                }

                return (
                  <label key={field.key}>
                    <span className="mb-2 block text-sm font-bold text-slate-200">{field.label}</span>

                    <input
                      type={field.type ?? "text"}
                      value={form[field.key]}
                      onChange={(event) => updateField(field.key, event.target.value)}
                      placeholder={field.placeholder}
                      className={`w-full rounded-2xl border px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 ${controlClass}`}
                    />

                    {hasError && <p className="mt-1 text-xs font-bold text-red-300">Completa este campo antes de guardar.</p>}
                  </label>
                );
              })}
            </div>

            <div className="mt-6 flex flex-col gap-3 md:flex-row">
              <button type="button" onClick={handleSave} className="rounded-2xl bg-red-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-red-950/50 transition hover:bg-red-400">
                {editingId ? "Actualizar riesgo" : "Guardar riesgo"}
              </button>

              <button type="button" onClick={resetForm} className="rounded-2xl border border-slate-600 px-6 py-3 text-sm font-bold text-slate-200 transition hover:bg-slate-800">
                Limpiar formulario
              </button>
              <button type="button" onClick={() => handleCreateWorkflowDraft(form, true)} className="rounded-2xl border border-violet-300/50 px-6 py-3 text-sm font-black text-violet-100 transition hover:bg-violet-950/60">
                Enviar a Workflow QA
              </button>
            </div>
          </form>

          <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">Registro maestro de riesgos</h2>
                <p className="mt-1 text-sm text-slate-400">Consulta, filtra, edita y exporta riesgos GxP.</p>
              </div>

              <button type="button" onClick={exportJson} className="rounded-2xl border border-red-400/50 px-5 py-3 text-sm font-bold text-red-200 transition hover:bg-red-500/10">
                Exportar JSON
              </button>
            </div>

            <div className="mb-5 grid gap-3 md:grid-cols-[1fr_250px]">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-red-400/40 transition placeholder:text-slate-600 focus:border-red-400 focus:ring-4"
                placeholder="Buscar por riesgo, módulo, proceso, fuente, estado..."
              />

              <select
                value={filterEstado}
                onChange={(event) => setFilterEstado(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-red-400/40 transition focus:border-red-400 focus:ring-4"
              >
                <option>Todos</option>
                <option>Identificado</option>
                <option>En evaluación</option>
                <option>Mitigación planificada</option>
                <option>En mitigación</option>
                <option>Mitigado</option>
                <option>Aceptado por QA</option>
                <option>Cerrado</option>
                <option>Reabierto</option>
                <option>Escalado</option>
              </select>
            </div>

            <div className="max-h-[780px] space-y-4 overflow-auto pr-2">
              {filteredRecords.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center text-sm text-slate-400">
                  No hay riesgos registrados. Crea el primer riesgo con datos completos.
                </div>
              ) : (
                filteredRecords.map((record) => (
                  <article key={record.id} className="rounded-2xl border border-slate-700 bg-slate-950 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-white">{record.codigoRiesgo} · {record.tipoRiesgo}</h3>
                          <StatusPill value={record.estadoRiesgo} />
                          <span className="rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1 text-xs font-bold text-red-200">
                            RPN {record.rpnCalculado}
                          </span>
                          <span className="rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1 text-xs font-bold text-red-200">
                            {record.nivelRiesgo}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-400">
                          {record.moduloRelacionado} · {record.procesoActividad} · {record.fuenteRiesgo}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button type="button" onClick={() => handleEdit(record)} className="rounded-xl border border-slate-600 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-800">
                          Editar
                        </button>

                        <button type="button" onClick={() => handleDelete(record.id)} className="rounded-xl border border-red-400/40 px-3 py-2 text-xs font-bold text-red-200 hover:bg-red-500/10">
                          Eliminar
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                      <Data label="Empresa" value={record.empresa} />
                      <Data label="Sede" value={record.sede} />
                      <Data label="Área / proceso" value={record.areaProceso} />
                      <Data label="Severidad" value={record.severidad} />
                      <Data label="Probabilidad" value={record.probabilidad} />
                      <Data label="Detectabilidad" value={record.detectabilidad} />
                      <Data label="Responsable mitigación" value={record.responsableMitigacion} />
                      <Data label="Fecha objetivo" value={record.fechaObjetivo} />
                      <Data label="Requiere CAPA" value={record.requiereCAPA} />
                      <Data label="Verificación eficacia" value={record.verificacionEficacia} />
                      <Data label="Fecha cierre" value={record.fechaCierre || "Sin registro"} />
                      <Data label="Decisión QA" value={record.decisionQA} />
                      <Data label="Evidencia" value={record.evidencia || "Sin registro"} />
                    </div>

                    <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300">
                      <p><span className="font-bold text-slate-100">Descripción: </span>{record.descripcionRiesgo}</p>
                      <p className="mt-2"><span className="font-bold text-slate-100">Causa potencial: </span>{record.causaPotencial}</p>
                      <p className="mt-2"><span className="font-bold text-slate-100">Consecuencia potencial: </span>{record.consecuenciaPotencial}</p>
                      <p className="mt-2"><span className="font-bold text-slate-100">Controles existentes: </span>{record.controlesExistentes}</p>
                      <p className="mt-2"><span className="font-bold text-slate-100">Plan mitigación: </span>{record.planMitigacion}</p>

                      {record.desviacionAsociada && (
                        <p className="mt-2"><span className="font-bold text-slate-100">Desviación: </span>{record.desviacionAsociada}</p>
                      )}

                      {record.capa && (
                        <p className="mt-2"><span className="font-bold text-slate-100">CAPA: </span>{record.capa}</p>
                      )}

                      {record.observaciones && (
                        <p className="mt-2"><span className="font-bold text-slate-100">Observaciones: </span>{record.observaciones}</p>
                      )}
                    </div>

                    <p className="mt-4 text-xs text-slate-500">
                      Creado: {record.creadoEn || "Sin dato"} · Actualizado: {record.actualizadoEn || "Sin dato"}
                    </p>
                  </article>
                ))
              )}
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}

function CloudNotice({
  message,
  errors,
  tone,
  onClose,
}: {
  message: string;
  errors: string[];
  tone: CloudTone;
  onClose: () => void;
}) {
  const isSuccess = tone === "success";

  return (
    <div role="alert" aria-live="assertive" className="fixed right-5 top-5 z-[9999] w-[min(94vw,620px)]">
      <section className={`rounded-[2rem] border-2 bg-slate-950 p-6 text-white shadow-2xl ${isSuccess ? "border-emerald-300" : "border-amber-300"}`}>
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className={`text-xs font-black uppercase tracking-[0.28em] ${isSuccess ? "text-emerald-200" : "text-amber-200"}`}>
              FloraTrack Cloud Notice
            </p>

            <p className="mt-2 text-lg font-black leading-snug text-white md:text-xl">{message}</p>

            {errors.length > 0 && (
              <div className="mt-5 rounded-3xl border border-white/20 bg-white p-5 text-slate-950 shadow-xl">
                <p className="text-sm font-black uppercase tracking-wide text-slate-700">Información pendiente antes de guardar</p>

                <ul className="mt-3 max-h-64 list-disc space-y-2 overflow-auto pl-5 text-sm font-bold leading-relaxed text-slate-950">
                  {errors.map((error) => <li key={error}>{error}</li>)}
                </ul>
              </div>
            )}
          </div>

          <button type="button" onClick={onClose} className="shrink-0 rounded-2xl border border-white/30 bg-white px-4 py-2 text-xs font-black uppercase tracking-wide text-slate-950 shadow-lg transition hover:bg-slate-200">
            Cerrar
          </button>
        </div>
      </section>
    </div>
  );
}

function Metric({ title, value, tone = "slate" }: { title: string; value: number; tone?: "slate" | "emerald" | "amber" | "red" | "sky" }) {
  const toneClass =
    tone === "emerald" ? "text-emerald-300" :
    tone === "amber" ? "text-amber-300" :
    tone === "red" ? "text-red-300" :
    tone === "sky" ? "text-sky-300" :
    "text-white";

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5">
      <p className="text-sm text-slate-400">{title}</p>
      <p className={`mt-2 text-3xl font-black ${toneClass}`}>{value}</p>
    </div>
  );
}

function Data({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-slate-200">{value}</p>
    </div>
  );
}

function StatusPill({ value }: { value: string }) {
  const className =
    value === "Cerrado" || value === "Aceptado por QA" || value === "Mitigado"
      ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
      : value === "Identificado" || value === "En evaluación" || value === "Mitigación planificada" || value === "En mitigación"
      ? "border-amber-400/40 bg-amber-500/10 text-amber-200"
      : "border-red-400/40 bg-red-500/10 text-red-200";

  return <span className={`rounded-full border px-3 py-1 text-xs font-bold ${className}`}>{value || "Sin estado"}</span>;
}
