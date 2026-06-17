"use client";

import { useEffect, useMemo, useState } from "react";

type AuditRecord = {
  id: string;
  codigoEvento: string;
  fechaEvento: string;
  horaEvento: string;
  empresa: string;
  usuario: string;
  moduloOrigen: string;
  registroAsociado: string;
  tipoEvento: string;
  accionEjecutada: string;
  estadoAnterior: string;
  estadoNuevo: string;
  criticidadGxp: string;
  motivo: string;
  decisionQA: string;
  referenciaWorkflow: string;
  referenciaRiesgo: string;
  referenciaCambio: string;
  evidencia: string;
  hashReferencia: string;
  ipEquipo: string;
  resultado: string;
  observaciones: string;
  creadoEn: string;
  actualizadoEn: string;
};

type FieldConfig = {
  key: keyof AuditRecord;
  label: string;
  type?: string;
  placeholder?: string;
  kind?: "input" | "select" | "textarea";
  options?: string[];
};

type NoticeTone = "success" | "warning";

type NoticeState = {
  message: string;
  errors: string[];
  tone: NoticeTone;
};

const STORAGE_KEY = "floratrack_audit_trail_gxp_v1";
const AUDIT_DRAFT_KEY = "floratrack_bridge_workflows_to_audit_trail_v1";
const REPORT_DRAFT_KEY = "floratrack_bridge_audit_trail_to_reportes_v1";

const emptyForm: AuditRecord = {
  id: "",
  codigoEvento: "",
  fechaEvento: "",
  horaEvento: "",
  empresa: "",
  usuario: "",
  moduloOrigen: "",
  registroAsociado: "",
  tipoEvento: "",
  accionEjecutada: "",
  estadoAnterior: "",
  estadoNuevo: "",
  criticidadGxp: "",
  motivo: "",
  decisionQA: "",
  referenciaWorkflow: "",
  referenciaRiesgo: "",
  referenciaCambio: "",
  evidencia: "",
  hashReferencia: "",
  ipEquipo: "",
  resultado: "",
  observaciones: "",
  creadoEn: "",
  actualizadoEn: "",
};

const requiredFields: Array<keyof AuditRecord> = [
  "codigoEvento",
  "fechaEvento",
  "horaEvento",
  "empresa",
  "usuario",
  "moduloOrigen",
  "registroAsociado",
  "tipoEvento",
  "accionEjecutada",
  "criticidadGxp",
  "motivo",
  "decisionQA",
  "hashReferencia",
  "resultado",
];

const fieldLabels: Record<keyof AuditRecord, string> = {
  id: "ID",
  codigoEvento: "Codigo de evento",
  fechaEvento: "Fecha de evento",
  horaEvento: "Hora de evento",
  empresa: "Empresa",
  usuario: "Usuario / responsable",
  moduloOrigen: "Modulo de origen",
  registroAsociado: "Registro asociado",
  tipoEvento: "Tipo de evento",
  accionEjecutada: "Accion ejecutada",
  estadoAnterior: "Estado anterior",
  estadoNuevo: "Estado nuevo",
  criticidadGxp: "Criticidad GxP",
  motivo: "Motivo",
  decisionQA: "Decision QA",
  referenciaWorkflow: "Referencia workflow",
  referenciaRiesgo: "Referencia riesgo",
  referenciaCambio: "Referencia cambio",
  evidencia: "Evidencia",
  hashReferencia: "Hash / referencia tecnica",
  ipEquipo: "IP / equipo",
  resultado: "Resultado",
  observaciones: "Observaciones",
  creadoEn: "Creado en",
  actualizadoEn: "Actualizado en",
};

const fields: FieldConfig[] = [
  { key: "codigoEvento", label: "Codigo de evento *", placeholder: "AUD-WF-2026-001" },
  { key: "fechaEvento", label: "Fecha de evento *", type: "date" },
  { key: "horaEvento", label: "Hora de evento *", type: "time" },
  { key: "empresa", label: "Empresa *", placeholder: "Growlifecol S.A.S." },
  { key: "usuario", label: "Usuario / responsable *", placeholder: "QA Manager / Responsable asignado" },
  {
    key: "moduloOrigen",
    label: "Modulo de origen *",
    kind: "select",
    options: [
      "Workflows QA",
      "Control de Cambios",
      "Gestion de Riesgos",
      "CAPA",
      "Desviaciones",
      "Documentos",
      "Firmas electronicas",
      "Reportes",
      "Regulatorio",
      "Integraciones",
      "Backups",
      "Part 11",
      "Otro",
    ],
  },
  { key: "registroAsociado", label: "Registro asociado *", placeholder: "WF-2026-001 / RISK-001 / CC-001" },
  {
    key: "tipoEvento",
    label: "Tipo de evento *",
    kind: "select",
    options: [
      "Workflow QA",
      "Aprobacion QA",
      "Rechazo QA",
      "Firma electronica",
      "Cierre controlado",
      "Escalamiento",
      "CAPA / desviacion",
      "Revision documental",
      "Exportacion",
      "Eliminacion controlada",
      "Otro",
    ],
  },
  { key: "accionEjecutada", label: "Accion ejecutada *", kind: "textarea", placeholder: "Describe que accion fue ejecutada y por quien." },
  { key: "estadoAnterior", label: "Estado anterior", placeholder: "Pendiente QA" },
  { key: "estadoNuevo", label: "Estado nuevo", placeholder: "Aprobado / Cerrado / Escalado" },
  {
    key: "criticidadGxp",
    label: "Criticidad GxP *",
    kind: "select",
    options: ["Baja", "Media", "Alta", "Critica"],
  },
  { key: "motivo", label: "Motivo *", kind: "textarea", placeholder: "Justificacion de la accion registrada." },
  {
    key: "decisionQA",
    label: "Decision QA *",
    kind: "select",
    options: ["Pendiente QA", "Aprobado QA", "Rechazado QA", "Cierre aprobado QA", "Escalamiento QA", "No aplica"],
  },
  { key: "referenciaWorkflow", label: "Referencia workflow", placeholder: "WF-2026-001" },
  { key: "referenciaRiesgo", label: "Referencia riesgo", placeholder: "RISK-2026-001" },
  { key: "referenciaCambio", label: "Referencia cambio", placeholder: "CC-2026-001" },
  { key: "evidencia", label: "Evidencia", kind: "textarea", placeholder: "URL, archivo, hash, captura, acta o soporte." },
  { key: "hashReferencia", label: "Hash / referencia tecnica *", placeholder: "HASH-WF-2026-001" },
  { key: "ipEquipo", label: "IP / equipo", placeholder: "localhost / navegador / dispositivo" },
  { key: "resultado", label: "Resultado *", kind: "textarea", placeholder: "Resultado observable y verificable del evento." },
  { key: "observaciones", label: "Observaciones", kind: "textarea", placeholder: "Notas QA, limitaciones, pendientes o trazabilidad complementaria." },
];

function clean(value: string): string {
  return value.trim();
}

function uid(): string {
  return `audit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function loadRecords(): AuditRecord[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as AuditRecord[]) : [];
  } catch {
    return [];
  }
}

function saveRecords(records: AuditRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function loadAuditDraftFromWorkflow(): Partial<AuditRecord> | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(AUDIT_DRAFT_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;

    const source = parsed as Record<string, unknown>;
    const draft: Partial<AuditRecord> = {};

    (Object.keys(emptyForm) as Array<keyof AuditRecord>).forEach((field) => {
      const value = source[field];
      if (typeof value === "string") draft[field] = value;
    });

    return Object.keys(draft).length > 0 ? draft : null;
  } catch {
    return null;
  }
}

function validateRecord(record: AuditRecord): string[] {
  const errors: string[] = [];

  requiredFields.forEach((field) => {
    if (!clean(record[field])) errors.push(`${fieldLabels[field]} es obligatorio.`);
  });

  if (["Alta", "Critica"].includes(record.criticidadGxp) && !clean(record.evidencia)) {
    errors.push("Eventos de criticidad alta o critica requieren evidencia.");
  }

  if (record.tipoEvento === "Firma electronica" && !clean(record.hashReferencia)) {
    errors.push("Eventos de firma electronica requieren hash o referencia tecnica.");
  }

  if (record.decisionQA.includes("Aprobado") && !clean(record.usuario)) {
    errors.push("La aprobacion QA requiere usuario responsable.");
  }

  return errors;
}


function bridgeAuditClean(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function reportTypeFromAudit(record: AuditRecord): string {
  const text = [
    record.tipoEvento,
    record.moduloOrigen,
    record.criticidadGxp,
    record.decisionQA,
    record.resultado,
  ].join(" ").toLowerCase();

  if (text.includes("firma")) return "Firmas electronicas";
  if (text.includes("regulatorio")) return "Regulatorio";
  if (text.includes("capa") || text.includes("desviacion") || text.includes("desviación")) return "CAPA / desviaciones";
  if (text.includes("riesgo")) return "Riesgos QRM";
  if (text.includes("workflow")) return "Workflows QA";
  if (text.includes("crit") || text.includes("alta") || text.includes("escal")) return "Eventos criticos GxP";
  if (text.includes("aprob")) return "Aprobaciones QA";

  return "Audit Trail GxP";
}

function reportFrequencyFromAudit(record: AuditRecord): string {
  const criticality = bridgeAuditClean(record.criticidadGxp).toLowerCase();
  const eventType = bridgeAuditClean(record.tipoEvento).toLowerCase();

  if (criticality.includes("crit") || criticality.includes("alta")) return "Diario";
  if (eventType.includes("firma") || eventType.includes("cierre")) return "Semanal";
  return "Mensual";
}

function reportCronFromFrequency(frequency: string): string {
  if (frequency === "Diario") return "0 7 * * *";
  if (frequency === "Semanal") return "0 7 * * 1";
  if (frequency === "Mensual") return "0 7 1 * *";
  if (frequency === "Trimestral") return "0 7 1 */3 *";
  return "0 7 * * *";
}

function reportPriorityFromAudit(record: AuditRecord): string {
  const text = [record.criticidadGxp, record.tipoEvento, record.decisionQA].join(" ").toLowerCase();

  if (text.includes("crit") || text.includes("alta") || text.includes("rechaz") || text.includes("escal")) return "Alta";
  if (text.includes("media") || text.includes("firma")) return "Media";
  return "Baja";
}

function buildReportDraftFromAudit(record: AuditRecord): Record<string, string> {
  const today = new Date().toISOString().slice(0, 10);
  const sourceCode = bridgeAuditClean(record.codigoEvento) || `AUD-${today}`;
  const reportType = reportTypeFromAudit(record);
  const frequency = reportFrequencyFromAudit(record);
  const priority = reportPriorityFromAudit(record);

  return {
    codigoReporte: `REP-${sourceCode}`,
    nombreReporte: `${reportType} desde ${sourceCode}`,
    tipoReporte: reportType,
    moduloFuente: bridgeAuditClean(record.moduloOrigen) || "Audit Trail",
    registroFuente: sourceCode,
    frecuencia: frequency,
    expresionCron: reportCronFromFrequency(frequency),
    zonaHoraria: "America/Bogota",
    responsable: bridgeAuditClean(record.usuario) || "Responsable QA pendiente",
    aprobadorQA: bridgeAuditClean(record.usuario) || "QA pendiente",
    destinatarios: "qa@growlifecol.local; cumplimiento@growlifecol.local",
    fechaInicio: today,
    horaEjecucion: "07:00",
    formatoSalida: "JSON + CSV",
    estadoReporte: "Borrador",
    prioridadGxP: priority,
    requiereFirma: priority === "Alta" || bridgeAuditClean(record.tipoEvento).toLowerCase().includes("firma") ? "Sí" : "No",
    referenciaAuditTrail: sourceCode,
    referenciaWorkflow: bridgeAuditClean(record.referenciaWorkflow),
    referenciaRiesgo: bridgeAuditClean(record.referenciaRiesgo),
    referenciaCambio: bridgeAuditClean(record.referenciaCambio),
    filtroDatos: `modulo=${bridgeAuditClean(record.moduloOrigen) || "Audit Trail"}; evento=${bridgeAuditClean(record.tipoEvento) || "GxP"}; criticidad=${bridgeAuditClean(record.criticidadGxp) || "No definida"}`,
    contenidoReporte: [
      `Evento audit trail: ${sourceCode}`,
      `Tipo: ${bridgeAuditClean(record.tipoEvento) || "No definido"}`,
      `Accion: ${bridgeAuditClean(record.accionEjecutada) || "No definida"}`,
      `Decision QA: ${bridgeAuditClean(record.decisionQA) || "Pendiente QA"}`,
      `Resultado: ${bridgeAuditClean(record.resultado) || "Pendiente"}`,
      `Hash: ${bridgeAuditClean(record.hashReferencia) || "Pendiente"}`,
    ].join("\\n"),
    evidencia: bridgeAuditClean(record.evidencia),
    observaciones: `Borrador importado desde Audit Trail. Revisar alcance, frecuencia, cron, destinatarios, aprobador QA y evidencia antes de activar.`,
  };
}

function toneFor(value: string): "success" | "warning" | "danger" | "neutral" {
  const normalized = value.toLowerCase();

  if (normalized.includes("aprob") || normalized.includes("cierre") || normalized.includes("registrado")) return "success";
  if (normalized.includes("pendiente") || normalized.includes("media")) return "warning";
  if (normalized.includes("rechaz") || normalized.includes("crit") || normalized.includes("alta") || normalized.includes("escal")) return "danger";
  return "neutral";
}

export default function AuditTrailPage() {
  const [records, setRecords] = useState<AuditRecord[]>([]);
  const [form, setForm] = useState<AuditRecord>(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [search, setSearch] = useState("");
  const [filterModule, setFilterModule] = useState("Todos");
  const [notice, setNotice] = useState<NoticeState | null>(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    setRecords(loadRecords());

    const draft = loadAuditDraftFromWorkflow();
    if (!draft) return;

    setForm((current) => ({
      ...current,
      ...draft,
      id: "",
      creadoEn: "",
      actualizadoEn: "",
    }));

    window.localStorage.removeItem(AUDIT_DRAFT_KEY);
    setNotice({
      message: "Borrador importado desde Workflows QA.",
      errors: ["Revisa usuario, decision QA, evidencia, hash y resultado antes de guardar el evento audit trail."],
      tone: "success",
    });
  }, []);

  const metrics = useMemo(() => {
    return {
      total: records.length,
      alta: records.filter((record) => ["Alta", "Critica"].includes(record.criticidadGxp)).length,
      firmas: records.filter((record) => record.tipoEvento === "Firma electronica").length,
      aprobados: records.filter((record) => record.decisionQA.includes("Aprobado")).length,
      pendientes: records.filter((record) => record.decisionQA.includes("Pendiente")).length,
    };
  }, [records]);

  const filteredRecords = useMemo(() => {
    const term = clean(search).toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        !term ||
        [
          record.codigoEvento,
          record.usuario,
          record.moduloOrigen,
          record.registroAsociado,
          record.tipoEvento,
          record.decisionQA,
          record.hashReferencia,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

      const matchesModule = filterModule === "Todos" || record.moduloOrigen === filterModule;

      return matchesSearch && matchesModule;
    });
  }, [records, search, filterModule]);

  function showNotice(message: string, errors: string[] = [], tone: NoticeTone = "warning") {
    setNotice({ message, errors, tone });
  }

  function updateField(field: keyof AuditRecord, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId("");
    setSubmitAttempted(false);
  }

  function handleSave() {
    setSubmitAttempted(true);

    const candidate: AuditRecord = {
      ...form,
      codigoEvento: clean(form.codigoEvento),
      fechaEvento: clean(form.fechaEvento),
      horaEvento: clean(form.horaEvento),
      empresa: clean(form.empresa),
      usuario: clean(form.usuario),
      moduloOrigen: clean(form.moduloOrigen),
      registroAsociado: clean(form.registroAsociado),
      tipoEvento: clean(form.tipoEvento),
      accionEjecutada: clean(form.accionEjecutada),
      estadoAnterior: clean(form.estadoAnterior),
      estadoNuevo: clean(form.estadoNuevo),
      criticidadGxp: clean(form.criticidadGxp),
      motivo: clean(form.motivo),
      decisionQA: clean(form.decisionQA),
      referenciaWorkflow: clean(form.referenciaWorkflow),
      referenciaRiesgo: clean(form.referenciaRiesgo),
      referenciaCambio: clean(form.referenciaCambio),
      evidencia: clean(form.evidencia),
      hashReferencia: clean(form.hashReferencia),
      ipEquipo: clean(form.ipEquipo),
      resultado: clean(form.resultado),
      observaciones: clean(form.observaciones),
    };

    const errors = validateRecord(candidate);
    if (errors.length > 0) {
      showNotice("No se puede guardar el evento audit trail.", errors);
      return;
    }

    const timestamp = nowIso();

    if (editingId) {
      const updated = records.map((record) =>
        record.id === editingId
          ? {
              ...candidate,
              id: editingId,
              creadoEn: record.creadoEn,
              actualizadoEn: timestamp,
            }
          : record
      );

      setRecords(updated);
      saveRecords(updated);
      showNotice("Evento audit trail actualizado correctamente.", [], "success");
      resetForm();
      return;
    }

    const created: AuditRecord = {
      ...candidate,
      id: uid(),
      creadoEn: timestamp,
      actualizadoEn: timestamp,
    };

    const nextRecords = [created, ...records];
    setRecords(nextRecords);
    saveRecords(nextRecords);
    showNotice("Evento audit trail guardado correctamente.", [], "success");
    resetForm();
  }

  function handleEdit(record: AuditRecord) {
    setForm(record);
    setEditingId(record.id);
    setSubmitAttempted(false);
    showNotice("Evento cargado para edicion. Verifica antes de actualizar.", [], "success");
  }

  function handleDelete(id: string) {
    const confirmed = window.confirm("Confirmas eliminar este evento local? En GMP real deberia manejarse como anulacion auditada.");
    if (!confirmed) return;

    const nextRecords = records.filter((record) => record.id !== id);
    setRecords(nextRecords);
    saveRecords(nextRecords);
    showNotice("Evento audit trail eliminado del almacenamiento local.", [], "success");
  }


  function handleCreateReportDraft(record: AuditRecord, redirect = false) {
    if (typeof window === "undefined") return;

    if (!bridgeAuditClean(record.codigoEvento) && !bridgeAuditClean(record.accionEjecutada)) {
      showNotice("No se creo reporte programado. Registra al menos codigo o accion auditada.");
      return;
    }

    const draft = buildReportDraftFromAudit(record);
    window.localStorage.setItem(REPORT_DRAFT_KEY, JSON.stringify(draft));

    if (redirect) {
      window.location.href = "/reportes-programados";
      return;
    }

    showNotice(
      "Borrador de reporte programado creado.",
      [`Reporte sugerido: ${draft.codigoReporte}`, `Frecuencia: ${draft.frecuencia}`, "Abre /reportes-programados para revisar y guardar."],
      "success"
    );
  }

  function exportJson() {
    if (records.length === 0) {
      showNotice("No hay eventos audit trail para exportar.");
      return;
    }

    const blob = new Blob([JSON.stringify(records, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `floratrack-audit-trail-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);

    showNotice("Archivo JSON de audit trail exportado correctamente.", [], "success");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-slate-100">
      {notice && <Notice message={notice.message} errors={notice.errors} tone={notice.tone} onClose={() => setNotice(null)} />}

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="rounded-[2rem] border border-emerald-300/20 bg-slate-900 p-8 shadow-2xl shadow-emerald-950/20">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-emerald-300">FloraTrack · Audit Trail GxP</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-white md:text-6xl">Audit Trail</h1>
          <p className="mt-4 max-w-5xl text-base leading-7 text-slate-300">
            Trazabilidad de acciones, decisiones QA, workflows, firmas, evidencias, cambios de estado y referencias tecnicas para cumplimiento GACP/GMP, Part 11 y auditorias internas.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a href="/" className="rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-emerald-300">
              Volver al Command Center
            </a>
            <a href="/workflows" className="rounded-2xl border border-emerald-300/50 px-5 py-3 text-sm font-black text-emerald-100 transition hover:bg-emerald-950/60">
              Workflows QA
            </a>
            <a href="/riesgos" className="rounded-2xl border border-slate-600 px-5 py-3 text-sm font-bold text-slate-200 transition hover:bg-slate-800">
              Riesgos GxP
            </a>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-5">
          <StatCard label="Eventos" value={metrics.total} />
          <StatCard label="Alta / critica" value={metrics.alta} />
          <StatCard label="Firmas" value={metrics.firmas} />
          <StatCard label="Aprobados" value={metrics.aprobados} />
          <StatCard label="Pendientes QA" value={metrics.pendientes} />
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <form className="rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-xl" onSubmit={(event) => event.preventDefault()}>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-300">Nuevo evento audit trail</p>
              <h2 className="mt-2 text-2xl font-black text-white">{editingId ? "Editar evento" : "Registrar evento"}</h2>
              <p className="mt-2 text-sm text-slate-400">Los campos marcados con * son obligatorios para trazabilidad GxP.</p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {fields.map((field) => {
                const hasError = submitAttempted && requiredFields.includes(field.key) && !clean(form[field.key]);

                return (
                  <FieldRenderer key={field.key} field={field} value={form[field.key]} hasError={hasError} onChange={(value) => updateField(field.key, value)} />
                );
              })}
            </div>

            <div className="mt-6 flex flex-col gap-3 md:flex-row">
              <button type="button" onClick={handleSave} className="rounded-2xl bg-emerald-400 px-6 py-3 text-sm font-black text-slate-950 shadow-lg shadow-emerald-950/40 transition hover:bg-emerald-300">
                {editingId ? "Actualizar evento" : "Guardar evento"}
              </button>

              <button type="button" onClick={resetForm} className="rounded-2xl border border-slate-600 px-6 py-3 text-sm font-bold text-slate-200 transition hover:bg-slate-800">
                Limpiar formulario
              </button>
              <button type="button" onClick={() => handleCreateReportDraft(form, true)} className="rounded-2xl border border-cyan-300/50 px-6 py-3 text-sm font-black text-cyan-100 transition hover:bg-cyan-950/60">
                Enviar a Reporte Programado
              </button>
            </div>
          </form>

          <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-300">Registro maestro</p>
                <h2 className="mt-2 text-2xl font-black text-white">Eventos registrados</h2>
                <p className="mt-1 text-sm text-slate-400">Consulta, filtra, edita y exporta trazabilidad audit trail.</p>
              </div>

              <button type="button" onClick={exportJson} className="rounded-2xl border border-emerald-300/50 px-5 py-3 text-sm font-bold text-emerald-100 transition hover:bg-emerald-500/10">
                Exportar JSON
              </button>
            </div>

            <div className="mb-5 grid gap-3 md:grid-cols-[1fr_240px]">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-emerald-400/40 transition placeholder:text-slate-600 focus:border-emerald-400 focus:ring-4"
                placeholder="Buscar por evento, usuario, registro, modulo, hash..."
              />

              <select
                value={filterModule}
                onChange={(event) => setFilterModule(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-emerald-400/40 transition focus:border-emerald-400 focus:ring-4"
              >
                <option>Todos</option>
                <option>Workflows QA</option>
                <option>Control de Cambios</option>
                <option>Gestion de Riesgos</option>
                <option>CAPA</option>
                <option>Desviaciones</option>
                <option>Documentos</option>
                <option>Firmas electronicas</option>
                <option>Reportes</option>
                <option>Regulatorio</option>
                <option>Integraciones</option>
                <option>Backups</option>
                <option>Part 11</option>
                <option>Otro</option>
              </select>
            </div>

            <div className="max-h-[780px] space-y-4 overflow-auto pr-2">
              {filteredRecords.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center text-sm text-slate-400">
                  No hay eventos audit trail registrados. Importa desde Workflows QA o registra el primer evento.
                </div>
              ) : (
                filteredRecords.map((record) => (
                  <article key={record.id} className="rounded-2xl border border-slate-700 bg-slate-950 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-white">{record.codigoEvento} · {record.tipoEvento}</h3>
                          <StatusPill value={record.criticidadGxp} />
                          <StatusPill value={record.decisionQA} />
                        </div>

                        <p className="mt-2 text-sm text-slate-400">
                          {record.moduloOrigen} · {record.registroAsociado} · {record.fechaEvento} {record.horaEvento}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button type="button" onClick={() => handleEdit(record)} className="rounded-xl border border-slate-600 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-800">
                          Editar
                        </button>
                        <button type="button" onClick={() => handleCreateReportDraft(record, true)} className="rounded-xl border border-cyan-300/50 px-3 py-2 text-xs font-bold text-cyan-100 hover:bg-cyan-500/10">
                          Reporte
                        </button>

                        <button type="button" onClick={() => handleDelete(record.id)} className="rounded-xl border border-red-400/40 px-3 py-2 text-xs font-bold text-red-200 hover:bg-red-500/10">
                          Eliminar
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                      <Data label="Empresa" value={record.empresa} />
                      <Data label="Usuario" value={record.usuario} />
                      <Data label="Estado anterior" value={record.estadoAnterior || "Sin registro"} />
                      <Data label="Estado nuevo" value={record.estadoNuevo || "Sin registro"} />
                      <Data label="Workflow" value={record.referenciaWorkflow || "Sin registro"} />
                      <Data label="Riesgo" value={record.referenciaRiesgo || "Sin registro"} />
                      <Data label="Cambio" value={record.referenciaCambio || "Sin registro"} />
                      <Data label="Hash" value={record.hashReferencia} />
                      <Data label="IP / equipo" value={record.ipEquipo || "Sin registro"} />
                      <Data label="Resultado" value={record.resultado} />
                    </div>

                    <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300">
                      <p><span className="font-bold text-slate-100">Accion: </span>{record.accionEjecutada}</p>
                      <p className="mt-2"><span className="font-bold text-slate-100">Motivo: </span>{record.motivo}</p>

                      {record.evidencia && (
                        <p className="mt-2"><span className="font-bold text-slate-100">Evidencia: </span>{record.evidencia}</p>
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

function FieldRenderer({
  field,
  value,
  hasError,
  onChange,
}: {
  field: FieldConfig;
  value: string;
  hasError: boolean;
  onChange: (value: string) => void;
}) {
  const controlClass = hasError
    ? "border-red-400 bg-red-950/30 ring-4 ring-red-400/20"
    : "border-slate-700 bg-slate-950 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/30";

  return (
    <label className={field.kind === "textarea" ? "md:col-span-2" : ""}>
      <span className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-400">{field.label}</span>

      {field.kind === "textarea" ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={4}
          placeholder={field.placeholder}
          className={`w-full rounded-2xl border px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 ${controlClass}`}
        />
      ) : field.kind === "select" ? (
        <select value={value} onChange={(event) => onChange(event.target.value)} className={`w-full rounded-2xl border px-4 py-3 text-sm text-white outline-none transition ${controlClass}`}>
          <option value="">Seleccionar...</option>
          {field.options?.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      ) : (
        <input
          value={value}
          type={field.type || "text"}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder}
          className={`w-full rounded-2xl border px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 ${controlClass}`}
        />
      )}

      {hasError && <p className="mt-1 text-xs font-bold text-red-300">Completa este campo antes de guardar.</p>}
    </label>
  );
}

function Notice({
  message,
  errors,
  tone,
  onClose,
}: {
  message: string;
  errors: string[];
  tone: NoticeTone;
  onClose: () => void;
}) {
  const isSuccess = tone === "success";

  return (
    <div role="alert" aria-live="assertive" className="fixed right-5 top-5 z-[9999] w-[min(94vw,620px)]">
      <section className={`rounded-[2rem] border-2 bg-slate-950 p-6 text-white shadow-2xl ${isSuccess ? "border-emerald-300" : "border-amber-300"}`}>
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className={`text-xs font-black uppercase tracking-[0.28em] ${isSuccess ? "text-emerald-200" : "text-amber-200"}`}>
              FloraTrack Audit Trail
            </p>
            <p className="mt-2 text-lg font-black leading-snug text-white md:text-xl">{message}</p>

            {errors.length > 0 && (
              <ul className="mt-4 list-disc space-y-2 rounded-3xl border border-white/20 bg-white p-5 pl-8 text-sm font-bold text-slate-950">
                {errors.map((error) => <li key={error}>{error}</li>)}
              </ul>
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

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <article className="rounded-3xl border border-slate-700 bg-slate-900 p-5 shadow-xl">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-3 text-4xl font-black text-white">{value}</p>
    </article>
  );
}

function Data({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-3">
      <p className="text-[0.68rem] font-black uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-bold text-slate-200">{value || "Sin registro"}</p>
    </div>
  );
}

function StatusPill({ value }: { value: string }) {
  const tone = toneFor(value);
  const className =
    tone === "success"
      ? "border-emerald-300/40 bg-emerald-500/10 text-emerald-200"
      : tone === "danger"
        ? "border-red-300/40 bg-red-500/10 text-red-200"
        : tone === "warning"
          ? "border-amber-300/40 bg-amber-500/10 text-amber-200"
          : "border-slate-600 bg-slate-800 text-slate-200";

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-black ${className}`}>
      {value || "Sin estado"}
    </span>
  );
}
