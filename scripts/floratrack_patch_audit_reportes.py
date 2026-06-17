from pathlib import Path
from datetime import datetime
import shutil

ROOT = Path.cwd()
STAMP = datetime.now().strftime("%Y%m%d-%H%M%S")
BACKUP_DIR = Path("/home/usergrowlifecol/floratrack_backups") / f"patch-audit-reportes-{STAMP}"

AUDIT = ROOT / "src/app/audit-trail/page.tsx"
REPORTES = ROOT / "src/app/reportes-programados/page.tsx"
AVANCE = ROOT / "AVANCE_FLORATRACK.md"
HANDOFF = ROOT / "CHATGPT_HANDOFF_FLORATRACK.md"

def backup(path: Path) -> None:
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    if path.exists():
        shutil.copy2(path, BACKUP_DIR / path.name)

def insert_after_button_label(source: str, label: str, insertion: str) -> str:
    index = source.find(label)
    if index == -1:
        print(f"AVISO: no encontre boton con texto: {label}")
        return source

    end = source.find("</button>", index)
    if end == -1:
        print(f"AVISO: no encontre cierre de boton para: {label}")
        return source

    end += len("</button>")
    return source[:end] + "\n" + insertion + source[end:]

for path in [AUDIT, REPORTES, AVANCE, HANDOFF]:
    backup(path)

audit = AUDIT.read_text()

# ---------------------------------------------------------------------
# 1) /audit-trail: constante puente hacia reportes programados
# ---------------------------------------------------------------------

if "floratrack_bridge_audit_trail_to_reportes_v1" not in audit:
    if 'const AUDIT_DRAFT_KEY = "floratrack_bridge_workflows_to_audit_trail_v1";' in audit:
        audit = audit.replace(
            'const AUDIT_DRAFT_KEY = "floratrack_bridge_workflows_to_audit_trail_v1";\n',
            'const AUDIT_DRAFT_KEY = "floratrack_bridge_workflows_to_audit_trail_v1";\nconst REPORT_DRAFT_KEY = "floratrack_bridge_audit_trail_to_reportes_v1";\n',
            1,
        )
    else:
        audit = audit.replace(
            'const STORAGE_KEY = "floratrack_audit_trail_gxp_v1";\n',
            'const STORAGE_KEY = "floratrack_audit_trail_gxp_v1";\nconst REPORT_DRAFT_KEY = "floratrack_bridge_audit_trail_to_reportes_v1";\n',
            1,
        )

# ---------------------------------------------------------------------
# 2) /audit-trail: helpers para construir borrador de reporte
# ---------------------------------------------------------------------

audit_helpers = r'''
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
'''

if "function buildReportDraftFromAudit" not in audit:
    if "function toneFor" in audit:
        audit = audit.replace("function toneFor", audit_helpers + "\nfunction toneFor", 1)
    else:
        audit = audit.replace("export default function AuditTrailPage()", audit_helpers + "\nexport default function AuditTrailPage()", 1)

# ---------------------------------------------------------------------
# 3) /audit-trail: handler de envio hacia reportes programados
# ---------------------------------------------------------------------

audit_handler = r'''
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
'''

if "function handleCreateReportDraft" not in audit:
    if "  function exportJson()" in audit:
        audit = audit.replace("  function exportJson()", audit_handler + "\n  function exportJson()", 1)
    else:
        audit = audit.replace("  function handleEdit" , audit_handler + "\n  function handleEdit", 1)

# ---------------------------------------------------------------------
# 4) /audit-trail: botones en formulario y tarjetas
# ---------------------------------------------------------------------

form_button = '''              <button type="button" onClick={() => handleCreateReportDraft(form, true)} className="rounded-2xl border border-cyan-300/50 px-6 py-3 text-sm font-black text-cyan-100 transition hover:bg-cyan-950/60">
                Enviar a Reporte Programado
              </button>'''

if "Enviar a Reporte Programado" not in audit:
    audit = insert_after_button_label(audit, "Limpiar formulario", form_button)

card_button = '''\n                        <button type="button" onClick={() => handleCreateReportDraft(record, true)} className="rounded-xl border border-cyan-300/50 px-3 py-2 text-xs font-bold text-cyan-100 hover:bg-cyan-500/10">
                          Reporte
                        </button>'''

if "handleCreateReportDraft(record, true)" not in audit:
    exact_edit = '''                        <button type="button" onClick={() => handleEdit(record)} className="rounded-xl border border-slate-600 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-800">
                          Editar
                        </button>'''
    if exact_edit in audit:
        audit = audit.replace(exact_edit, exact_edit + card_button, 1)
    else:
        print("AVISO: no pude insertar boton Reporte en tarjeta; el boton de formulario si quedara disponible.")

AUDIT.write_text(audit)

# ---------------------------------------------------------------------
# 5) /reportes-programados: modulo completo
# ---------------------------------------------------------------------

reportes_page = r'''"use client";

import { useEffect, useMemo, useState } from "react";

type ScheduledReportRecord = {
  id: string;
  codigoReporte: string;
  nombreReporte: string;
  tipoReporte: string;
  moduloFuente: string;
  registroFuente: string;
  frecuencia: string;
  expresionCron: string;
  zonaHoraria: string;
  responsable: string;
  aprobadorQA: string;
  destinatarios: string;
  fechaInicio: string;
  horaEjecucion: string;
  formatoSalida: string;
  estadoReporte: string;
  prioridadGxP: string;
  requiereFirma: string;
  referenciaAuditTrail: string;
  referenciaWorkflow: string;
  referenciaRiesgo: string;
  referenciaCambio: string;
  filtroDatos: string;
  contenidoReporte: string;
  evidencia: string;
  observaciones: string;
  creadoEn: string;
  actualizadoEn: string;
};

type FieldConfig = {
  key: keyof ScheduledReportRecord;
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

const STORAGE_KEY = "floratrack_reportes_programados_gxp_v1";
const REPORT_DRAFT_KEY = "floratrack_bridge_audit_trail_to_reportes_v1";

const emptyForm: ScheduledReportRecord = {
  id: "",
  codigoReporte: "",
  nombreReporte: "",
  tipoReporte: "",
  moduloFuente: "",
  registroFuente: "",
  frecuencia: "",
  expresionCron: "",
  zonaHoraria: "America/Bogota",
  responsable: "",
  aprobadorQA: "",
  destinatarios: "",
  fechaInicio: "",
  horaEjecucion: "",
  formatoSalida: "",
  estadoReporte: "",
  prioridadGxP: "",
  requiereFirma: "",
  referenciaAuditTrail: "",
  referenciaWorkflow: "",
  referenciaRiesgo: "",
  referenciaCambio: "",
  filtroDatos: "",
  contenidoReporte: "",
  evidencia: "",
  observaciones: "",
  creadoEn: "",
  actualizadoEn: "",
};

const requiredFields: Array<keyof ScheduledReportRecord> = [
  "codigoReporte",
  "nombreReporte",
  "tipoReporte",
  "moduloFuente",
  "registroFuente",
  "frecuencia",
  "expresionCron",
  "zonaHoraria",
  "responsable",
  "aprobadorQA",
  "destinatarios",
  "fechaInicio",
  "horaEjecucion",
  "formatoSalida",
  "estadoReporte",
  "prioridadGxP",
  "requiereFirma",
  "contenidoReporte",
];

const fieldLabels: Record<keyof ScheduledReportRecord, string> = {
  id: "ID",
  codigoReporte: "Codigo de reporte",
  nombreReporte: "Nombre del reporte",
  tipoReporte: "Tipo de reporte",
  moduloFuente: "Modulo fuente",
  registroFuente: "Registro fuente",
  frecuencia: "Frecuencia",
  expresionCron: "Expresion cron",
  zonaHoraria: "Zona horaria",
  responsable: "Responsable",
  aprobadorQA: "Aprobador QA",
  destinatarios: "Destinatarios",
  fechaInicio: "Fecha de inicio",
  horaEjecucion: "Hora de ejecucion",
  formatoSalida: "Formato de salida",
  estadoReporte: "Estado del reporte",
  prioridadGxP: "Prioridad GxP",
  requiereFirma: "Requiere firma",
  referenciaAuditTrail: "Referencia audit trail",
  referenciaWorkflow: "Referencia workflow",
  referenciaRiesgo: "Referencia riesgo",
  referenciaCambio: "Referencia cambio",
  filtroDatos: "Filtro de datos",
  contenidoReporte: "Contenido del reporte",
  evidencia: "Evidencia",
  observaciones: "Observaciones",
  creadoEn: "Creado en",
  actualizadoEn: "Actualizado en",
};

const fields: FieldConfig[] = [
  { key: "codigoReporte", label: "Codigo de reporte *", placeholder: "REP-AUD-WF-2026-001" },
  { key: "nombreReporte", label: "Nombre del reporte *", placeholder: "Eventos audit trail críticos" },
  {
    key: "tipoReporte",
    label: "Tipo de reporte *",
    kind: "select",
    options: [
      "Audit Trail GxP",
      "Eventos criticos GxP",
      "Firmas electronicas",
      "Aprobaciones QA",
      "Workflows QA",
      "Riesgos QRM",
      "Control de Cambios",
      "CAPA / desviaciones",
      "Regulatorio",
      "Indicadores KPI",
      "Otro",
    ],
  },
  {
    key: "moduloFuente",
    label: "Modulo fuente *",
    kind: "select",
    options: [
      "Audit Trail",
      "Workflows QA",
      "Gestion de Riesgos",
      "Control de Cambios",
      "Reportes",
      "CAPA",
      "Desviaciones",
      "Firmas electronicas",
      "Regulatorio",
      "Part 11",
      "Otro",
    ],
  },
  { key: "registroFuente", label: "Registro fuente *", placeholder: "AUD-WF-2026-001" },
  {
    key: "frecuencia",
    label: "Frecuencia *",
    kind: "select",
    options: ["Diario", "Semanal", "Mensual", "Trimestral", "Evento critico", "Cron personalizado"],
  },
  { key: "expresionCron", label: "Expresion cron *", placeholder: "0 7 * * *" },
  {
    key: "zonaHoraria",
    label: "Zona horaria *",
    kind: "select",
    options: ["America/Bogota", "UTC", "America/Lima", "America/Mexico_City", "America/Santiago", "America/New_York"],
  },
  { key: "responsable", label: "Responsable *", placeholder: "QA Manager" },
  { key: "aprobadorQA", label: "Aprobador QA *", placeholder: "Director QA" },
  { key: "destinatarios", label: "Destinatarios *", placeholder: "qa@growlifecol.local; cumplimiento@growlifecol.local" },
  { key: "fechaInicio", label: "Fecha de inicio *", type: "date" },
  { key: "horaEjecucion", label: "Hora de ejecucion *", type: "time" },
  {
    key: "formatoSalida",
    label: "Formato de salida *",
    kind: "select",
    options: ["JSON", "CSV", "PDF", "JSON + CSV", "PDF + CSV", "Dashboard"],
  },
  {
    key: "estadoReporte",
    label: "Estado del reporte *",
    kind: "select",
    options: ["Borrador", "Activo", "Pausado", "Pendiente QA", "Aprobado QA", "Rechazado QA", "Archivado"],
  },
  {
    key: "prioridadGxP",
    label: "Prioridad GxP *",
    kind: "select",
    options: ["Baja", "Media", "Alta", "Critica"],
  },
  {
    key: "requiereFirma",
    label: "Requiere firma *",
    kind: "select",
    options: ["No", "Sí"],
  },
  { key: "referenciaAuditTrail", label: "Referencia audit trail", placeholder: "AUD-WF-2026-001" },
  { key: "referenciaWorkflow", label: "Referencia workflow", placeholder: "WF-2026-001" },
  { key: "referenciaRiesgo", label: "Referencia riesgo", placeholder: "RISK-2026-001" },
  { key: "referenciaCambio", label: "Referencia cambio", placeholder: "CC-2026-001" },
  { key: "filtroDatos", label: "Filtro de datos", kind: "textarea", placeholder: "modulo=Audit Trail; criticidad=Alta; decisionQA=Aprobado" },
  { key: "contenidoReporte", label: "Contenido del reporte *", kind: "textarea", placeholder: "Define el contenido, alcance y columnas del reporte." },
  { key: "evidencia", label: "Evidencia", kind: "textarea", placeholder: "Hash, archivo, URL, acta o soporte." },
  { key: "observaciones", label: "Observaciones", kind: "textarea", placeholder: "Notas QA, alcance, limitaciones o pendientes." },
];

function clean(value: string): string {
  return value.trim();
}

function uid(): string {
  return `report-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function loadRecords(): ScheduledReportRecord[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ScheduledReportRecord[]) : [];
  } catch {
    return [];
  }
}

function saveRecords(records: ScheduledReportRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function loadReportDraftFromAuditTrail(): Partial<ScheduledReportRecord> | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(REPORT_DRAFT_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;

    const source = parsed as Record<string, unknown>;
    const draft: Partial<ScheduledReportRecord> = {};

    (Object.keys(emptyForm) as Array<keyof ScheduledReportRecord>).forEach((field) => {
      const value = source[field];
      if (typeof value === "string") draft[field] = value;
    });

    return Object.keys(draft).length > 0 ? draft : null;
  } catch {
    return null;
  }
}

function cronHint(frequency: string): string {
  if (frequency === "Diario") return "0 7 * * *";
  if (frequency === "Semanal") return "0 7 * * 1";
  if (frequency === "Mensual") return "0 7 1 * *";
  if (frequency === "Trimestral") return "0 7 1 */3 *";
  return "";
}

function validateRecord(record: ScheduledReportRecord): string[] {
  const errors: string[] = [];

  requiredFields.forEach((field) => {
    if (!clean(record[field])) errors.push(`${fieldLabels[field]} es obligatorio.`);
  });

  if (!record.expresionCron.includes(" ") || record.expresionCron.split(" ").length < 5) {
    errors.push("La expresion cron debe tener al menos 5 segmentos.");
  }

  if (record.prioridadGxP === "Alta" || record.prioridadGxP === "Critica") {
    if (!clean(record.aprobadorQA)) errors.push("Reportes de prioridad alta o critica requieren aprobador QA.");
    if (record.requiereFirma !== "Sí") errors.push("Reportes de prioridad alta o critica deben requerir firma.");
  }

  if (!record.destinatarios.includes("@") && !record.destinatarios.includes(";")) {
    errors.push("Destinatarios debe incluir al menos un correo o lista separada por punto y coma.");
  }

  return errors;
}

function csvEscape(value: string): string {
  const escaped = value.replaceAll('"', '""');
  return `"${escaped}"`;
}

function toneFor(value: string): "success" | "warning" | "danger" | "neutral" {
  const normalized = value.toLowerCase();

  if (normalized.includes("activo") || normalized.includes("aprob") || normalized.includes("baja")) return "success";
  if (normalized.includes("borrador") || normalized.includes("pendiente") || normalized.includes("media")) return "warning";
  if (normalized.includes("rechaz") || normalized.includes("crit") || normalized.includes("alta")) return "danger";
  return "neutral";
}

export default function ReportesProgramadosPage() {
  const [records, setRecords] = useState<ScheduledReportRecord[]>([]);
  const [form, setForm] = useState<ScheduledReportRecord>(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [notice, setNotice] = useState<NoticeState | null>(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    setRecords(loadRecords());

    const draft = loadReportDraftFromAuditTrail();
    if (!draft) return;

    setForm((current) => ({
      ...current,
      ...draft,
      id: "",
      creadoEn: "",
      actualizadoEn: "",
    }));

    window.localStorage.removeItem(REPORT_DRAFT_KEY);
    setNotice({
      message: "Borrador importado desde Audit Trail.",
      errors: ["Revisa cron, zona horaria, destinatarios, aprobador QA, firma y alcance antes de activar."],
      tone: "success",
    });
  }, []);

  const metrics = useMemo(() => {
    return {
      total: records.length,
      activos: records.filter((record) => record.estadoReporte === "Activo").length,
      pendientes: records.filter((record) => record.estadoReporte.includes("Pendiente") || record.estadoReporte === "Borrador").length,
      alta: records.filter((record) => ["Alta", "Critica"].includes(record.prioridadGxP)).length,
      firma: records.filter((record) => record.requiereFirma === "Sí").length,
    };
  }, [records]);

  const filteredRecords = useMemo(() => {
    const term = clean(search).toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        !term ||
        [
          record.codigoReporte,
          record.nombreReporte,
          record.tipoReporte,
          record.moduloFuente,
          record.registroFuente,
          record.responsable,
          record.aprobadorQA,
          record.estadoReporte,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

      const matchesStatus = filterStatus === "Todos" || record.estadoReporte === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [records, search, filterStatus]);

  function showNotice(message: string, errors: string[] = [], tone: NoticeTone = "warning") {
    setNotice({ message, errors, tone });
  }

  function updateField(field: keyof ScheduledReportRecord, value: string) {
    setForm((current) => {
      if (field === "frecuencia") {
        const suggestedCron = cronHint(value);
        return {
          ...current,
          frecuencia: value,
          expresionCron: suggestedCron || current.expresionCron,
        };
      }

      if (field === "prioridadGxP" && (value === "Alta" || value === "Critica")) {
        return {
          ...current,
          prioridadGxP: value,
          requiereFirma: "Sí",
        };
      }

      return { ...current, [field]: value };
    });
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId("");
    setSubmitAttempted(false);
  }

  function handleSave() {
    setSubmitAttempted(true);

    const candidate: ScheduledReportRecord = {
      ...form,
      codigoReporte: clean(form.codigoReporte),
      nombreReporte: clean(form.nombreReporte),
      tipoReporte: clean(form.tipoReporte),
      moduloFuente: clean(form.moduloFuente),
      registroFuente: clean(form.registroFuente),
      frecuencia: clean(form.frecuencia),
      expresionCron: clean(form.expresionCron),
      zonaHoraria: clean(form.zonaHoraria),
      responsable: clean(form.responsable),
      aprobadorQA: clean(form.aprobadorQA),
      destinatarios: clean(form.destinatarios),
      fechaInicio: clean(form.fechaInicio),
      horaEjecucion: clean(form.horaEjecucion),
      formatoSalida: clean(form.formatoSalida),
      estadoReporte: clean(form.estadoReporte),
      prioridadGxP: clean(form.prioridadGxP),
      requiereFirma: clean(form.requiereFirma),
      referenciaAuditTrail: clean(form.referenciaAuditTrail),
      referenciaWorkflow: clean(form.referenciaWorkflow),
      referenciaRiesgo: clean(form.referenciaRiesgo),
      referenciaCambio: clean(form.referenciaCambio),
      filtroDatos: clean(form.filtroDatos),
      contenidoReporte: clean(form.contenidoReporte),
      evidencia: clean(form.evidencia),
      observaciones: clean(form.observaciones),
    };

    const errors = validateRecord(candidate);
    if (errors.length > 0) {
      showNotice("No se puede guardar el reporte programado.", errors);
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
      showNotice("Reporte programado actualizado correctamente.", [], "success");
      resetForm();
      return;
    }

    const created: ScheduledReportRecord = {
      ...candidate,
      id: uid(),
      creadoEn: timestamp,
      actualizadoEn: timestamp,
    };

    const nextRecords = [created, ...records];
    setRecords(nextRecords);
    saveRecords(nextRecords);
    showNotice("Reporte programado guardado correctamente.", [], "success");
    resetForm();
  }

  function handleEdit(record: ScheduledReportRecord) {
    setForm(record);
    setEditingId(record.id);
    setSubmitAttempted(false);
    showNotice("Reporte cargado para edicion. Revisa antes de actualizar.", [], "success");
  }

  function handleDelete(id: string) {
    const confirmed = window.confirm("Confirmas eliminar este reporte local? En GMP real deberia manejarse como anulacion auditada.");
    if (!confirmed) return;

    const nextRecords = records.filter((record) => record.id !== id);
    setRecords(nextRecords);
    saveRecords(nextRecords);
    showNotice("Reporte programado eliminado del almacenamiento local.", [], "success");
  }

  function exportJson() {
    if (records.length === 0) {
      showNotice("No hay reportes programados para exportar.");
      return;
    }

    const blob = new Blob([JSON.stringify(records, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `floratrack-reportes-programados-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);

    showNotice("Archivo JSON de reportes programados exportado correctamente.", [], "success");
  }

  function exportCsv() {
    if (records.length === 0) {
      showNotice("No hay reportes programados para exportar.");
      return;
    }

    const keys = Object.keys(emptyForm) as Array<keyof ScheduledReportRecord>;
    const header = keys.join(",");
    const rows = records.map((record) => keys.map((key) => csvEscape(record[key])).join(","));
    const blob = new Blob([[header, ...rows].join("\\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `floratrack-reportes-programados-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    showNotice("Archivo CSV de reportes programados exportado correctamente.", [], "success");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-slate-100">
      {notice && <Notice message={notice.message} errors={notice.errors} tone={notice.tone} onClose={() => setNotice(null)} />}

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="rounded-[2rem] border border-cyan-300/20 bg-slate-900 p-8 shadow-2xl shadow-cyan-950/20">
          <p className="text-xs font-black uppercase tracking-[0.32em] text-cyan-300">FloraTrack · Reportes Programados GxP</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-white md:text-6xl">Reportes programados</h1>
          <p className="mt-4 max-w-5xl text-base leading-7 text-slate-300">
            Programacion, revision QA, frecuencia, cron, zona horaria, evidencia y exportacion de reportes GACP/GMP derivados de audit trail, workflows, riesgos y control de cambios.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a href="/" className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-300">
              Volver al Command Center
            </a>
            <a href="/audit-trail" className="rounded-2xl border border-cyan-300/50 px-5 py-3 text-sm font-black text-cyan-100 transition hover:bg-cyan-950/60">
              Audit Trail
            </a>
            <a href="/workflows" className="rounded-2xl border border-slate-600 px-5 py-3 text-sm font-bold text-slate-200 transition hover:bg-slate-800">
              Workflows QA
            </a>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-5">
          <StatCard label="Reportes" value={metrics.total} />
          <StatCard label="Activos" value={metrics.activos} />
          <StatCard label="Pendientes QA" value={metrics.pendientes} />
          <StatCard label="Alta / critica" value={metrics.alta} />
          <StatCard label="Con firma" value={metrics.firma} />
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <form className="rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-xl" onSubmit={(event) => event.preventDefault()}>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">Nuevo reporte programado</p>
              <h2 className="mt-2 text-2xl font-black text-white">{editingId ? "Editar reporte" : "Registrar reporte"}</h2>
              <p className="mt-2 text-sm text-slate-400">Define frecuencia, cron, destinatarios, aprobador QA y evidencia antes de activar.</p>
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
              <button type="button" onClick={handleSave} className="rounded-2xl bg-cyan-400 px-6 py-3 text-sm font-black text-slate-950 shadow-lg shadow-cyan-950/40 transition hover:bg-cyan-300">
                {editingId ? "Actualizar reporte" : "Guardar reporte"}
              </button>

              <button type="button" onClick={resetForm} className="rounded-2xl border border-slate-600 px-6 py-3 text-sm font-bold text-slate-200 transition hover:bg-slate-800">
                Limpiar formulario
              </button>
            </div>
          </form>

          <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">Registro maestro</p>
                <h2 className="mt-2 text-2xl font-black text-white">Reportes registrados</h2>
                <p className="mt-1 text-sm text-slate-400">Consulta, filtra, edita y exporta reportes programados.</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={exportJson} className="rounded-2xl border border-cyan-300/50 px-5 py-3 text-sm font-bold text-cyan-100 transition hover:bg-cyan-500/10">
                  Exportar JSON
                </button>
                <button type="button" onClick={exportCsv} className="rounded-2xl border border-slate-600 px-5 py-3 text-sm font-bold text-slate-200 transition hover:bg-slate-800">
                  Exportar CSV
                </button>
              </div>
            </div>

            <div className="mb-5 grid gap-3 md:grid-cols-[1fr_240px]">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-cyan-400/40 transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-4"
                placeholder="Buscar por reporte, modulo, responsable, registro..."
              />

              <select
                value={filterStatus}
                onChange={(event) => setFilterStatus(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-cyan-400/40 transition focus:border-cyan-400 focus:ring-4"
              >
                <option>Todos</option>
                <option>Borrador</option>
                <option>Activo</option>
                <option>Pausado</option>
                <option>Pendiente QA</option>
                <option>Aprobado QA</option>
                <option>Rechazado QA</option>
                <option>Archivado</option>
              </select>
            </div>

            <div className="max-h-[780px] space-y-4 overflow-auto pr-2">
              {filteredRecords.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center text-sm text-slate-400">
                  No hay reportes programados. Importa desde Audit Trail o registra el primer reporte.
                </div>
              ) : (
                filteredRecords.map((record) => (
                  <article key={record.id} className="rounded-2xl border border-slate-700 bg-slate-950 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-white">{record.codigoReporte} · {record.nombreReporte}</h3>
                          <StatusPill value={record.estadoReporte} />
                          <StatusPill value={record.prioridadGxP} />
                        </div>

                        <p className="mt-2 text-sm text-slate-400">
                          {record.tipoReporte} · {record.moduloFuente} · {record.frecuencia} · {record.expresionCron}
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
                      <Data label="Responsable" value={record.responsable} />
                      <Data label="Aprobador QA" value={record.aprobadorQA} />
                      <Data label="Destinatarios" value={record.destinatarios} />
                      <Data label="Fecha inicio" value={record.fechaInicio} />
                      <Data label="Hora ejecucion" value={record.horaEjecucion} />
                      <Data label="Zona horaria" value={record.zonaHoraria} />
                      <Data label="Formato" value={record.formatoSalida} />
                      <Data label="Firma" value={record.requiereFirma} />
                      <Data label="Audit trail" value={record.referenciaAuditTrail || "Sin registro"} />
                      <Data label="Workflow" value={record.referenciaWorkflow || "Sin registro"} />
                    </div>

                    <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300">
                      <p><span className="font-bold text-slate-100">Filtro: </span>{record.filtroDatos || "Sin filtro"}</p>
                      <p className="mt-2 whitespace-pre-wrap"><span className="font-bold text-slate-100">Contenido: </span>{record.contenidoReporte}</p>

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
    : "border-slate-700 bg-slate-950 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/30";

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
      <section className={`rounded-[2rem] border-2 bg-slate-950 p-6 text-white shadow-2xl ${isSuccess ? "border-cyan-300" : "border-amber-300"}`}>
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className={`text-xs font-black uppercase tracking-[0.28em] ${isSuccess ? "text-cyan-200" : "text-amber-200"}`}>
              FloraTrack Reportes
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
      ? "border-cyan-300/40 bg-cyan-500/10 text-cyan-200"
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
'''

REPORTES.write_text(reportes_page)

# ---------------------------------------------------------------------
# 6) documentacion
# ---------------------------------------------------------------------

avance_append = '''

## Puente Audit Trail -> Reportes Programados

Se agrego conexion local entre `/audit-trail` y `/reportes-programados`:
- `/audit-trail` genera un borrador de reporte programado desde un evento audit trail.
- El borrador se guarda en `localStorage` con clave `floratrack_bridge_audit_trail_to_reportes_v1`.
- `/reportes-programados` fue ampliado a modulo CRUD local con metricas, filtros, validaciones GxP, expresion cron, zona horaria y exportacion JSON/CSV.
- El reporte captura modulo fuente, registro, frecuencia, cron, responsables, aprobador QA, destinatarios, prioridad, firma, evidencias y referencias GxP.
'''

handoff_append = '''

## Puente Audit Trail -> Reportes Programados

En esta fase se conecto `/audit-trail` con `/reportes-programados` mediante borrador local:
- Emisor: `src/app/audit-trail/page.tsx`.
- Receptor: `src/app/reportes-programados/page.tsx`.
- Clave localStorage: `floratrack_bridge_audit_trail_to_reportes_v1`.
- Botones agregados en `/audit-trail`: `Enviar a Reporte Programado` y `Reporte`.
- `/reportes-programados` ahora es un modulo CRUD local completo con validacion GxP, cron, zona horaria y exportaciones JSON/CSV.
'''

if AVANCE.exists():
    avance = AVANCE.read_text()
    if "Puente Audit Trail -> Reportes Programados" not in avance:
        AVANCE.write_text(avance + avance_append)

if HANDOFF.exists():
    handoff = HANDOFF.read_text()
    if "Puente Audit Trail -> Reportes Programados" not in handoff:
        HANDOFF.write_text(handoff + handoff_append)

print("PATCH COMPLETADO OK")
print(f"Backup creado en: {BACKUP_DIR}")
print("Archivos modificados:")
print("- src/app/audit-trail/page.tsx")
print("- src/app/reportes-programados/page.tsx")
print("- AVANCE_FLORATRACK.md")
print("- CHATGPT_HANDOFF_FLORATRACK.md")
