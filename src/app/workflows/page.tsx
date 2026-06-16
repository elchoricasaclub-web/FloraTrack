"use client";

import { useEffect, useMemo, useState } from "react";

type WorkflowRecord = {
  id: string;
  codigoWorkflow: string;
  fechaCreacion: string;
  horaCreacion: string;
  empresa: string;
  sede: string;
  moduloOrigen: string;
  registroAsociado: string;
  tipoWorkflow: string;
  etapaActual: string;
  prioridad: string;
  responsableAsignado: string;
  areaResponsable: string;
  aprobadorQA: string;
  responsableTecnico: string;
  fechaLimite: string;
  slaHoras: string;
  estadoWorkflow: string;
  requiereFirmaElectronica: string;
  firmaAsociada: string;
  requiereEscalamiento: string;
  escaladoA: string;
  motivoWorkflow: string;
  decisionQA: string;
  auditTrailReferencia: string;
  evidencia: string;
  desviacionAsociada: string;
  capa: string;
  observaciones: string;
  creadoEn: string;
  actualizadoEn: string;
};

type FieldConfig = {
  key: keyof WorkflowRecord;
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

const STORAGE_KEY = "floratrack_workflows_qa_v1";
const WORKFLOW_DRAFT_KEY = "floratrack_bridge_riesgos_to_workflows_v1";

const emptyForm: WorkflowRecord = {
  id: "",
  codigoWorkflow: "",
  fechaCreacion: "",
  horaCreacion: "",
  empresa: "",
  sede: "",
  moduloOrigen: "",
  registroAsociado: "",
  tipoWorkflow: "",
  etapaActual: "",
  prioridad: "",
  responsableAsignado: "",
  areaResponsable: "",
  aprobadorQA: "",
  responsableTecnico: "",
  fechaLimite: "",
  slaHoras: "",
  estadoWorkflow: "",
  requiereFirmaElectronica: "",
  firmaAsociada: "",
  requiereEscalamiento: "",
  escaladoA: "",
  motivoWorkflow: "",
  decisionQA: "",
  auditTrailReferencia: "",
  evidencia: "",
  desviacionAsociada: "",
  capa: "",
  observaciones: "",
  creadoEn: "",
  actualizadoEn: "",
};

const requiredFields: Array<keyof WorkflowRecord> = [
  "codigoWorkflow",
  "fechaCreacion",
  "horaCreacion",
  "empresa",
  "sede",
  "moduloOrigen",
  "registroAsociado",
  "tipoWorkflow",
  "etapaActual",
  "prioridad",
  "responsableAsignado",
  "areaResponsable",
  "aprobadorQA",
  "responsableTecnico",
  "fechaLimite",
  "slaHoras",
  "estadoWorkflow",
  "requiereFirmaElectronica",
  "requiereEscalamiento",
  "motivoWorkflow",
  "decisionQA",
  "auditTrailReferencia",
];

const fieldLabels: Record<keyof WorkflowRecord, string> = {
  id: "ID",
  codigoWorkflow: "Código de workflow",
  fechaCreacion: "Fecha de creación",
  horaCreacion: "Hora de creación",
  empresa: "Empresa",
  sede: "Sede / predio",
  moduloOrigen: "Módulo de origen",
  registroAsociado: "Registro asociado",
  tipoWorkflow: "Tipo de workflow",
  etapaActual: "Etapa actual",
  prioridad: "Prioridad",
  responsableAsignado: "Responsable asignado",
  areaResponsable: "Área responsable",
  aprobadorQA: "Aprobador QA",
  responsableTecnico: "Responsable técnico",
  fechaLimite: "Fecha límite",
  slaHoras: "SLA en horas",
  estadoWorkflow: "Estado del workflow",
  requiereFirmaElectronica: "Requiere firma electrónica",
  firmaAsociada: "Firma asociada",
  requiereEscalamiento: "Requiere escalamiento",
  escaladoA: "Escalado a",
  motivoWorkflow: "Motivo del workflow",
  decisionQA: "Decisión QA",
  auditTrailReferencia: "Referencia audit trail",
  evidencia: "Evidencia",
  desviacionAsociada: "Desviación asociada",
  capa: "CAPA",
  observaciones: "Observaciones",
  creadoEn: "Creado en",
  actualizadoEn: "Actualizado en",
};

const fields: FieldConfig[] = [
  { key: "codigoWorkflow", label: "Código de workflow *", placeholder: "WF-2026-001" },
  { key: "fechaCreacion", label: "Fecha de creación *", type: "date" },
  { key: "horaCreacion", label: "Hora de creación *", type: "time" },
  { key: "empresa", label: "Empresa *", placeholder: "Growlifecol S.A.S." },
  { key: "sede", label: "Sede / predio *", placeholder: "Sede principal" },
  {
    key: "moduloOrigen",
    label: "Módulo de origen *",
    kind: "select",
    options: [
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
      "Entrenamiento",
      "Equipos",
      "Proveedores",
      "Saneamiento",
      "Plagas / MIP",
      "Residuos",
      "Recall",
      "Retención",
      "Usuarios",
      "Empresas",
      "GIS",
      "Reportes",
      "Notificaciones",
      "CSV / DataOps",
      "Regulatorio",
      "Otro",
    ],
  },
  { key: "registroAsociado", label: "Registro asociado *", placeholder: "DOC-2026-001 / CAPA-001 / QA-001 / REG-001" },
  {
    key: "tipoWorkflow",
    label: "Tipo de workflow *",
    kind: "select",
    options: [
      "Revisión QA",
      "Aprobación QA",
      "Liberación QA",
      "Cierre CAPA",
      "Cierre desviación",
      "Aprobación documental",
      "Aprobación entrenamiento",
      "Liberación de lote",
      "Revisión regulatoria",
      "Aprobación de proveedor",
      "Aprobación de cambio",
      "Escalamiento crítico",
      "Anulación controlada",
      "Otro",
    ],
  },
  {
    key: "etapaActual",
    label: "Etapa actual *",
    kind: "select",
    options: [
      "Creado",
      "Asignado",
      "En revisión",
      "Pendiente información",
      "Pendiente firma",
      "Pendiente QA",
      "Escalado",
      "Aprobado",
      "Rechazado",
      "Cerrado",
      "Vencido",
      "Cancelado por QA",
    ],
  },
  {
    key: "prioridad",
    label: "Prioridad *",
    kind: "select",
    options: ["Baja", "Media", "Alta", "Crítica"],
  },
  { key: "responsableAsignado", label: "Responsable asignado *", placeholder: "Usuario responsable de ejecutar la acción" },
  {
    key: "areaResponsable",
    label: "Área responsable *",
    kind: "select",
    options: [
      "Dirección técnica",
      "QA",
      "QC",
      "Regulatorio",
      "Recepción",
      "Inventario",
      "Cultivo",
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
      "Administración",
    ],
  },
  { key: "aprobadorQA", label: "Aprobador QA *", placeholder: "Nombre del aprobador QA" },
  { key: "responsableTecnico", label: "Responsable técnico *", placeholder: "Director técnico / responsable de proceso" },
  { key: "fechaLimite", label: "Fecha límite *", type: "date" },
  { key: "slaHoras", label: "SLA en horas *", type: "number", placeholder: "48" },
  {
    key: "estadoWorkflow",
    label: "Estado del workflow *",
    kind: "select",
    options: [
      "Abierto",
      "En progreso",
      "Pendiente QA",
      "Pendiente firma",
      "Escalado",
      "Aprobado",
      "Rechazado",
      "Cerrado",
      "Vencido",
      "Cancelado",
    ],
  },
  {
    key: "requiereFirmaElectronica",
    label: "Requiere firma electrónica *",
    kind: "select",
    options: ["Sí", "No"],
  },
  { key: "firmaAsociada", label: "Firma asociada", placeholder: "SIG-2026-001 / pendiente" },
  {
    key: "requiereEscalamiento",
    label: "Requiere escalamiento *",
    kind: "select",
    options: ["Sí", "No"],
  },
  { key: "escaladoA", label: "Escalado a", placeholder: "Dirección Técnica / QA Manager / Gerencia / Regulatorio" },
  {
    key: "motivoWorkflow",
    label: "Motivo del workflow *",
    kind: "textarea",
    placeholder: "Describe por qué se requiere este flujo, impacto GMP/GACP, decisión esperada y registro involucrado.",
  },
  {
    key: "decisionQA",
    label: "Decisión QA *",
    kind: "select",
    options: [
      "Pendiente QA",
      "Aprobado QA",
      "Aprobado con observación QA",
      "Rechazado QA",
      "Requiere información",
      "Requiere CAPA",
      "Requiere escalamiento",
      "Cierre aprobado QA",
      "No aplica",
    ],
  },
  { key: "auditTrailReferencia", label: "Referencia audit trail *", placeholder: "AUDIT-WF-2026-001 / log / evento" },
  { key: "evidencia", label: "Evidencia / soporte", placeholder: "Acta, firma, captura, reporte, log, evidencia QA, documento asociado..." },
  { key: "desviacionAsociada", label: "Desviación asociada", placeholder: "DEV-2026-001 / CAPA-001" },
  {
    key: "capa",
    label: "CAPA",
    kind: "textarea",
    placeholder: "Obligatoria si el workflow está vencido, rechazado, escalado crítico o requiere CAPA.",
  },
  {
    key: "observaciones",
    label: "Observaciones",
    kind: "textarea",
    placeholder: "Notas QA, seguimiento, restricciones, motivo de escalamiento, próximos pasos o cierre.",
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
  return `WF-${Date.now()}-${Math.random().toString(16).slice(2)}`;
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

function isPastDate(dateValue: string): boolean {
  if (!dateValue) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const date = new Date(dateValue);
  date.setHours(0, 0, 0, 0);

  return Number.isFinite(date.getTime()) && date.getTime() < today.getTime();
}

function loadRecords(): WorkflowRecord[] {
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

function saveRecords(records: WorkflowRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}


function loadWorkflowDraftFromRisk(): Partial<WorkflowRecord> | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(WORKFLOW_DRAFT_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;

    const source = parsed as Record<string, unknown>;
    const draft: Partial<WorkflowRecord> = {};

    (Object.keys(emptyForm) as Array<keyof WorkflowRecord>).forEach((field) => {
      const value = source[field];
      if (typeof value === "string") draft[field] = value;
    });

    return Object.keys(draft).length > 0 ? draft : null;
  } catch {
    return null;
  }
}

export default function WorkflowsPage() {
  const [records, setRecords] = useState<WorkflowRecord[]>([]);
  const [form, setForm] = useState<WorkflowRecord>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [cloud, setCloud] = useState<CloudState | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("Todos");

  useEffect(() => {
    setRecords(loadRecords());

    const draft = loadWorkflowDraftFromRisk();
    if (!draft) return;

    setForm((current) => ({
      ...current,
      ...draft,
      id: "",
      creadoEn: "",
      actualizadoEn: "",
    }));

    window.localStorage.removeItem(WORKFLOW_DRAFT_KEY);
    showCloud(
      "Borrador importado desde Gestión de Riesgos.",
      ["Revisa responsables, SLA, firma, escalamiento, evidencia y decisión QA antes de guardar."],
      "success"
    );
  }, []);

  function showCloud(message: string, errors: string[] = [], tone: CloudTone = "warning") {
    setCloud({ message, errors, tone });
    setValidationErrors(errors);

    window.setTimeout(() => {
      setCloud(null);
      if (errors.length === 0) setValidationErrors([]);
    }, errors.length > 0 ? 12000 : 6000);
  }

  function updateField(field: keyof WorkflowRecord, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function needsCapa(): boolean {
    return (
      ["Alta", "Crítica"].includes(form.prioridad) ||
      ["Vencido", "Escalado", "Rechazado"].includes(form.estadoWorkflow) ||
      ["Rechazado QA", "Requiere CAPA", "Requiere escalamiento"].includes(form.decisionQA)
    );
  }

  function validateForm(): string[] {
    const errors = requiredFields
      .filter((field) => isInvalid(form[field]))
      .map((field) => fieldLabels[field]);

    const sla = toNumber(form.slaHoras);

    if (!Number.isFinite(sla) || sla <= 0) {
      errors.push("El SLA en horas debe ser mayor a cero");
    }

    if (form.fechaLimite && form.fechaCreacion && isDateBefore(form.fechaLimite, form.fechaCreacion)) {
      errors.push("La fecha límite no puede ser anterior a la fecha de creación");
    }

    if (form.requiereFirmaElectronica === "Sí" && isInvalid(form.firmaAsociada)) {
      errors.push("La firma asociada es obligatoria cuando el workflow requiere firma electrónica");
    }

    if (form.requiereEscalamiento === "Sí" && isInvalid(form.escaladoA)) {
      errors.push("El campo Escalado a es obligatorio cuando requiere escalamiento");
    }

    if (["Aprobado QA", "Aprobado con observación QA", "Rechazado QA", "Cierre aprobado QA"].includes(form.decisionQA) && isInvalid(form.evidencia)) {
      errors.push("La evidencia es obligatoria para decisiones QA formales");
    }

    if (["Aprobado", "Cerrado"].includes(form.estadoWorkflow) && isInvalid(form.evidencia)) {
      errors.push("La evidencia es obligatoria para aprobar o cerrar un workflow");
    }

    if (needsCapa() && isInvalid(form.desviacionAsociada)) {
      errors.push("La desviación asociada es obligatoria cuando el workflow es crítico, vencido, rechazado, escalado o requiere CAPA");
    }

    if (needsCapa() && isInvalid(form.capa)) {
      errors.push("La CAPA es obligatoria cuando el workflow es crítico, vencido, rechazado, escalado o requiere CAPA");
    }

    return Array.from(new Set(errors));
  }

  function fieldHasError(field: keyof WorkflowRecord): boolean {
    if (!submitAttempted) return false;

    if (requiredFields.includes(field) && isInvalid(form[field])) return true;

    if (field === "slaHoras") {
      const sla = toNumber(form.slaHoras);
      return !Number.isFinite(sla) || sla <= 0;
    }

    if (field === "fechaLimite" && form.fechaLimite && form.fechaCreacion && isDateBefore(form.fechaLimite, form.fechaCreacion)) return true;
    if (field === "firmaAsociada" && form.requiereFirmaElectronica === "Sí" && isInvalid(form.firmaAsociada)) return true;
    if (field === "escaladoA" && form.requiereEscalamiento === "Sí" && isInvalid(form.escaladoA)) return true;
    if (field === "evidencia" && ["Aprobado QA", "Aprobado con observación QA", "Rechazado QA", "Cierre aprobado QA"].includes(form.decisionQA) && isInvalid(form.evidencia)) return true;
    if (field === "evidencia" && ["Aprobado", "Cerrado"].includes(form.estadoWorkflow) && isInvalid(form.evidencia)) return true;
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
      showCloud("No se guardó el workflow. Completa la información obligatoria.", errors, "warning");
      return;
    }

    const timestamp = nowIso();

    const payload: WorkflowRecord = {
      ...form,
      codigoWorkflow: clean(form.codigoWorkflow),
      fechaCreacion: clean(form.fechaCreacion),
      horaCreacion: clean(form.horaCreacion),
      empresa: clean(form.empresa),
      sede: clean(form.sede),
      moduloOrigen: clean(form.moduloOrigen),
      registroAsociado: clean(form.registroAsociado),
      tipoWorkflow: clean(form.tipoWorkflow),
      etapaActual: clean(form.etapaActual),
      prioridad: clean(form.prioridad),
      responsableAsignado: clean(form.responsableAsignado),
      areaResponsable: clean(form.areaResponsable),
      aprobadorQA: clean(form.aprobadorQA),
      responsableTecnico: clean(form.responsableTecnico),
      fechaLimite: clean(form.fechaLimite),
      slaHoras: clean(form.slaHoras),
      estadoWorkflow: clean(form.estadoWorkflow),
      requiereFirmaElectronica: clean(form.requiereFirmaElectronica),
      firmaAsociada: clean(form.firmaAsociada),
      requiereEscalamiento: clean(form.requiereEscalamiento),
      escaladoA: clean(form.escaladoA),
      motivoWorkflow: clean(form.motivoWorkflow),
      decisionQA: clean(form.decisionQA),
      auditTrailReferencia: clean(form.auditTrailReferencia),
      evidencia: clean(form.evidencia),
      desviacionAsociada: clean(form.desviacionAsociada),
      capa: clean(form.capa),
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
      editingId ? "Workflow actualizado correctamente." : "Workflow QA registrado correctamente con trazabilidad.",
      [],
      "success"
    );
  }

  function handleEdit(record: WorkflowRecord) {
    setForm(record);
    setEditingId(record.id);
    setSubmitAttempted(false);
    showCloud("Workflow cargado para edición. Verifica antes de actualizar.", [], "success");
  }

  function handleDelete(id: string) {
    const confirmed = window.confirm("¿Confirmas eliminar este workflow? En ambiente GMP real debería manejarse como anulación auditada.");
    if (!confirmed) return;

    const nextRecords = records.filter((record) => record.id !== id);
    setRecords(nextRecords);
    saveRecords(nextRecords);
    showCloud("Workflow eliminado del almacenamiento local.", [], "success");
  }

  function exportJson() {
    if (records.length === 0) {
      showCloud("No hay workflows para exportar.", [], "warning");
      return;
    }

    const blob = new Blob([JSON.stringify(records, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `floratrack-workflows-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);

    showCloud("Archivo JSON de workflows exportado correctamente.", [], "success");
  }

  const filteredRecords = useMemo(() => {
    const term = clean(search).toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        !term ||
        [
          record.codigoWorkflow,
          record.moduloOrigen,
          record.registroAsociado,
          record.tipoWorkflow,
          record.etapaActual,
          record.responsableAsignado,
          record.aprobadorQA,
          record.estadoWorkflow,
          record.decisionQA,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

      const matchesEstado = filterEstado === "Todos" || record.estadoWorkflow === filterEstado;

      return matchesSearch && matchesEstado;
    });
  }, [records, search, filterEstado]);

  const dashboard = useMemo(() => {
    return {
      total: records.length,
      abiertos: records.filter((record) => ["Abierto", "En progreso", "Pendiente QA", "Pendiente firma"].includes(record.estadoWorkflow)).length,
      vencidos: records.filter((record) => isPastDate(record.fechaLimite) && !["Cerrado", "Aprobado", "Cancelado"].includes(record.estadoWorkflow)).length,
      escalados: records.filter((record) => record.requiereEscalamiento === "Sí").length,
      aprobados: records.filter((record) => ["Aprobado", "Cerrado"].includes(record.estadoWorkflow)).length,
    };
  }, [records]);

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
        <header className="rounded-3xl border border-pink-400/20 bg-slate-900/80 p-6 shadow-2xl shadow-pink-950/30">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-pink-300">
                FloraTrack Enterprise Compliance Platform
              </p>

              <h1 className="mt-3 text-3xl font-black text-white md:text-5xl">
                Workflows QA, aprobaciones y escalamiento
              </h1>

              <p className="mt-3 max-w-5xl text-sm leading-6 text-slate-300 md:text-base">
                Control de flujos QA, aprobaciones, liberaciones, firmas electrónicas,
                SLA, escalamiento, audit trail, evidencia, desviaciones, CAPA y cierre.
              </p>
            </div>

            <div className="rounded-2xl border border-pink-400/20 bg-pink-500/10 px-5 py-4 text-sm text-pink-100">
              <p className="font-bold">Workflow QA activo</p>
              <p className="mt-1 text-pink-200">SLA · Firma · Escalamiento · QA · CAPA</p>
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
          <Metric title="Workflows" value={dashboard.total} />
          <Metric title="Abiertos" value={dashboard.abiertos} tone="amber" />
          <Metric title="Vencidos" value={dashboard.vencidos} tone="red" />
          <Metric title="Escalados" value={dashboard.escalados} tone="sky" />
          <Metric title="Aprobados" value={dashboard.aprobados} tone="emerald" />
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
                <h2 className="text-2xl font-black text-white">{editingId ? "Editar workflow" : "Nuevo workflow QA"}</h2>
                <p className="mt-1 text-sm text-slate-400">Ningún workflow puede guardarse vacío o incompleto.</p>
              </div>

              {editingId && (
                <button type="button" onClick={resetForm} className="rounded-xl border border-slate-600 px-4 py-2 text-sm font-bold text-slate-200 hover:bg-slate-800">
                  Cancelar edición
                </button>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {fields.map((field) => {
                const hasError = fieldHasError(field.key);
                const controlClass = hasError
                  ? "border-red-400 bg-red-950/30 ring-4 ring-red-400/20"
                  : "border-slate-700 bg-slate-950 focus:border-pink-400 focus:ring-4 focus:ring-pink-400/40";

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

                      {hasError && <p className="mt-1 text-xs font-bold text-red-300">Campo obligatorio o condición de workflow requerida.</p>}
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
              <button type="button" onClick={handleSave} className="rounded-2xl bg-pink-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-pink-950/50 transition hover:bg-pink-400">
                {editingId ? "Actualizar workflow" : "Guardar workflow"}
              </button>

              <button type="button" onClick={resetForm} className="rounded-2xl border border-slate-600 px-6 py-3 text-sm font-bold text-slate-200 transition hover:bg-slate-800">
                Limpiar formulario
              </button>
            </div>
          </form>

          <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">Registro maestro de workflows</h2>
                <p className="mt-1 text-sm text-slate-400">Consulta, filtra, edita y exporta workflows QA.</p>
              </div>

              <button type="button" onClick={exportJson} className="rounded-2xl border border-pink-400/50 px-5 py-3 text-sm font-bold text-pink-200 transition hover:bg-pink-500/10">
                Exportar JSON
              </button>
            </div>

            <div className="mb-5 grid gap-3 md:grid-cols-[1fr_250px]">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-pink-400/40 transition placeholder:text-slate-600 focus:border-pink-400 focus:ring-4"
                placeholder="Buscar por workflow, registro, módulo, responsable, QA..."
              />

              <select
                value={filterEstado}
                onChange={(event) => setFilterEstado(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-pink-400/40 transition focus:border-pink-400 focus:ring-4"
              >
                <option>Todos</option>
                <option>Abierto</option>
                <option>En progreso</option>
                <option>Pendiente QA</option>
                <option>Pendiente firma</option>
                <option>Escalado</option>
                <option>Aprobado</option>
                <option>Rechazado</option>
                <option>Cerrado</option>
                <option>Vencido</option>
                <option>Cancelado</option>
              </select>
            </div>

            <div className="max-h-[780px] space-y-4 overflow-auto pr-2">
              {filteredRecords.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center text-sm text-slate-400">
                  No hay workflows registrados. Crea el primer workflow con datos completos.
                </div>
              ) : (
                filteredRecords.map((record) => (
                  <article key={record.id} className="rounded-2xl border border-slate-700 bg-slate-950 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-white">{record.codigoWorkflow} · {record.tipoWorkflow}</h3>
                          <StatusPill value={record.estadoWorkflow} />
                          <span className="rounded-full border border-pink-400/30 bg-pink-500/10 px-3 py-1 text-xs font-bold text-pink-200">
                            {record.prioridad}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-400">
                          {record.moduloOrigen} · {record.registroAsociado} · límite {record.fechaLimite}
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
                      <Data label="Etapa actual" value={record.etapaActual} />
                      <Data label="Responsable" value={record.responsableAsignado} />
                      <Data label="Área" value={record.areaResponsable} />
                      <Data label="Aprobador QA" value={record.aprobadorQA} />
                      <Data label="Técnico" value={record.responsableTecnico} />
                      <Data label="SLA horas" value={record.slaHoras} />
                      <Data label="Firma requerida" value={record.requiereFirmaElectronica} />
                      <Data label="Firma asociada" value={record.firmaAsociada || "Sin registro"} />
                      <Data label="Escalamiento" value={record.requiereEscalamiento} />
                      <Data label="Escalado a" value={record.escaladoA || "Sin registro"} />
                      <Data label="Decisión QA" value={record.decisionQA} />
                      <Data label="Audit trail" value={record.auditTrailReferencia} />
                      <Data label="Evidencia" value={record.evidencia || "Sin registro"} />
                    </div>

                    <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300">
                      <p><span className="font-bold text-slate-100">Motivo: </span>{record.motivoWorkflow}</p>

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
    value === "Aprobado" || value === "Cerrado"
      ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
      : value === "Abierto" || value === "En progreso" || value === "Pendiente QA" || value === "Pendiente firma"
      ? "border-amber-400/40 bg-amber-500/10 text-amber-200"
      : "border-red-400/40 bg-red-500/10 text-red-200";

  return <span className={`rounded-full border px-3 py-1 text-xs font-bold ${className}`}>{value || "Sin estado"}</span>;
}
