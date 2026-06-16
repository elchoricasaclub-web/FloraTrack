"use client";

import { useEffect, useMemo, useState } from "react";

type RegulatoryRecord = {
  id: string;
  codigoRadicacion: string;
  fechaRadicacion: string;
  horaRadicacion: string;
  empresa: string;
  sede: string;
  autoridad: string;
  tipoTramite: string;
  numeroExpediente: string;
  productoProceso: string;
  loteRelacionado: string;
  normaAplicable: string;
  alcanceSolicitud: string;
  responsableRegulatorio: string;
  responsableQA: string;
  fechaCompromiso: string;
  estadoTramite: string;
  prioridadRegulatoria: string;
  requiereRespuestaAutoridad: string;
  fechaRespuestaAutoridad: string;
  decisionAutoridad: string;
  decisionQA: string;
  documentosSoporte: string;
  evidenciaRadicacion: string;
  desviacionAsociada: string;
  capa: string;
  observaciones: string;
  creadoEn: string;
  actualizadoEn: string;
};

type FieldConfig = {
  key: keyof RegulatoryRecord;
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

const STORAGE_KEY = "floratrack_regulatorio_radicaciones_v1";

const emptyForm: RegulatoryRecord = {
  id: "",
  codigoRadicacion: "",
  fechaRadicacion: "",
  horaRadicacion: "",
  empresa: "",
  sede: "",
  autoridad: "",
  tipoTramite: "",
  numeroExpediente: "",
  productoProceso: "",
  loteRelacionado: "",
  normaAplicable: "",
  alcanceSolicitud: "",
  responsableRegulatorio: "",
  responsableQA: "",
  fechaCompromiso: "",
  estadoTramite: "",
  prioridadRegulatoria: "",
  requiereRespuestaAutoridad: "",
  fechaRespuestaAutoridad: "",
  decisionAutoridad: "",
  decisionQA: "",
  documentosSoporte: "",
  evidenciaRadicacion: "",
  desviacionAsociada: "",
  capa: "",
  observaciones: "",
  creadoEn: "",
  actualizadoEn: "",
};

const requiredFields: Array<keyof RegulatoryRecord> = [
  "codigoRadicacion",
  "fechaRadicacion",
  "horaRadicacion",
  "empresa",
  "sede",
  "autoridad",
  "tipoTramite",
  "numeroExpediente",
  "productoProceso",
  "normaAplicable",
  "alcanceSolicitud",
  "responsableRegulatorio",
  "responsableQA",
  "fechaCompromiso",
  "estadoTramite",
  "prioridadRegulatoria",
  "requiereRespuestaAutoridad",
  "decisionAutoridad",
  "decisionQA",
  "documentosSoporte",
];

const fieldLabels: Record<keyof RegulatoryRecord, string> = {
  id: "ID",
  codigoRadicacion: "Código de radicación",
  fechaRadicacion: "Fecha de radicación",
  horaRadicacion: "Hora de radicación",
  empresa: "Empresa",
  sede: "Sede / predio",
  autoridad: "Autoridad competente",
  tipoTramite: "Tipo de trámite",
  numeroExpediente: "Número de expediente",
  productoProceso: "Producto / proceso",
  loteRelacionado: "Lote relacionado",
  normaAplicable: "Norma aplicable",
  alcanceSolicitud: "Alcance de la solicitud",
  responsableRegulatorio: "Responsable regulatorio",
  responsableQA: "Responsable QA",
  fechaCompromiso: "Fecha compromiso",
  estadoTramite: "Estado del trámite",
  prioridadRegulatoria: "Prioridad regulatoria",
  requiereRespuestaAutoridad: "Requiere respuesta a autoridad",
  fechaRespuestaAutoridad: "Fecha de respuesta a autoridad",
  decisionAutoridad: "Decisión de autoridad",
  decisionQA: "Decisión QA",
  documentosSoporte: "Documentos soporte",
  evidenciaRadicacion: "Evidencia de radicación",
  desviacionAsociada: "Desviación asociada",
  capa: "CAPA",
  observaciones: "Observaciones",
  creadoEn: "Creado en",
  actualizadoEn: "Actualizado en",
};

const fields: FieldConfig[] = [
  { key: "codigoRadicacion", label: "Código de radicación *", placeholder: "REG-2026-001" },
  { key: "fechaRadicacion", label: "Fecha de radicación *", type: "date" },
  { key: "horaRadicacion", label: "Hora de radicación *", type: "time" },
  { key: "empresa", label: "Empresa *", placeholder: "Growlifecol S.A.S." },
  { key: "sede", label: "Sede / predio *", placeholder: "Sede principal" },
  {
    key: "autoridad",
    label: "Autoridad competente *",
    kind: "select",
    options: [
      "INVIMA",
      "ICA",
      "Ministerio de Justicia",
      "FNE",
      "Secretaría de Salud",
      "Autoridad ambiental",
      "DIAN",
      "Alcaldía / municipio",
      "Organismo certificador",
      "Cliente regulado",
      "Autoridad internacional",
      "Otra autoridad",
    ],
  },
  {
    key: "tipoTramite",
    label: "Tipo de trámite *",
    kind: "select",
    options: [
      "Radicación inicial",
      "Renovación de licencia",
      "Modificación de licencia",
      "Respuesta a requerimiento",
      "Solicitud de certificado",
      "Registro sanitario",
      "Permiso de cultivo",
      "Permiso de fabricación",
      "Reporte periódico",
      "Notificación regulatoria",
      "Solicitud de visita",
      "Cierre de hallazgo",
      "Actualización documental",
      "Otro",
    ],
  },
  { key: "numeroExpediente", label: "Número de expediente *", placeholder: "EXP-2026-001 / Radicado / Resolución" },
  { key: "productoProceso", label: "Producto / proceso *", placeholder: "Cultivo, fabricación, extracto, flor seca, lote, sede..." },
  { key: "loteRelacionado", label: "Lote relacionado", placeholder: "LOT-2026-001 / No aplica documentado" },
  {
    key: "normaAplicable",
    label: "Norma aplicable *",
    kind: "textarea",
    placeholder: "Norma, resolución, decreto, guía GACP/GMP, licencia o requisito regulatorio aplicable.",
  },
  {
    key: "alcanceSolicitud",
    label: "Alcance de la solicitud *",
    kind: "textarea",
    placeholder: "Describe alcance, proceso, sede, producto, licencia, lote, actividad o respuesta requerida.",
  },
  { key: "responsableRegulatorio", label: "Responsable regulatorio *", placeholder: "Responsable del trámite" },
  { key: "responsableQA", label: "Responsable QA *", placeholder: "QA que revisa o aprueba" },
  { key: "fechaCompromiso", label: "Fecha compromiso *", type: "date" },
  {
    key: "estadoTramite",
    label: "Estado del trámite *",
    kind: "select",
    options: [
      "Borrador",
      "Radicado",
      "En revisión interna",
      "En revisión por autoridad",
      "Requerimiento recibido",
      "Respuesta preparada",
      "Respuesta enviada",
      "Aprobado",
      "Observado",
      "Rechazado",
      "Cerrado",
      "Vencido",
      "Suspendido",
    ],
  },
  {
    key: "prioridadRegulatoria",
    label: "Prioridad regulatoria *",
    kind: "select",
    options: ["Baja", "Media", "Alta", "Crítica"],
  },
  {
    key: "requiereRespuestaAutoridad",
    label: "Requiere respuesta a autoridad *",
    kind: "select",
    options: ["Sí", "No"],
  },
  { key: "fechaRespuestaAutoridad", label: "Fecha de respuesta a autoridad", type: "date" },
  {
    key: "decisionAutoridad",
    label: "Decisión de autoridad *",
    kind: "select",
    options: [
      "Pendiente",
      "Radicado recibido",
      "Aprobado",
      "Aprobado con observaciones",
      "Requerimiento",
      "Observado",
      "Rechazado",
      "Suspendido",
      "Cerrado",
      "No aplica",
    ],
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
      "Requiere CAPA",
      "Requiere auditoría",
      "Requiere respuesta",
      "Cierre aprobado QA",
    ],
  },
  {
    key: "documentosSoporte",
    label: "Documentos soporte *",
    kind: "textarea",
    placeholder: "Lista documentos: formularios, licencias, certificados, SOP, actas, anexos, planos, COA, evidencias.",
  },
  { key: "evidenciaRadicacion", label: "Evidencia de radicación", placeholder: "Número radicado, PDF, captura, correo, acta, enlace documental..." },
  { key: "desviacionAsociada", label: "Desviación asociada", placeholder: "DEV-2026-001 / CAPA-001" },
  {
    key: "capa",
    label: "CAPA",
    kind: "textarea",
    placeholder: "Obligatoria si hay vencimiento, rechazo, requerimiento crítico, observación o CAPA.",
  },
  {
    key: "observaciones",
    label: "Observaciones",
    kind: "textarea",
    placeholder: "Notas regulatorias, contexto, restricciones, próximos pasos, comunicaciones o impacto en operación.",
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

function safeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `REG-${Date.now()}-${Math.random().toString(16).slice(2)}`;
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

function loadRecords(): RegulatoryRecord[] {
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

function saveRecords(records: RegulatoryRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export default function RegulatorioPage() {
  const [records, setRecords] = useState<RegulatoryRecord[]>([]);
  const [form, setForm] = useState<RegulatoryRecord>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [cloud, setCloud] = useState<CloudState | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("Todos");

  useEffect(() => {
    setRecords(loadRecords());
  }, []);

  function showCloud(message: string, errors: string[] = [], tone: CloudTone = "warning") {
    setCloud({ message, errors, tone });
    setValidationErrors(errors);

    window.setTimeout(() => {
      setCloud(null);
      if (errors.length === 0) setValidationErrors([]);
    }, errors.length > 0 ? 12000 : 6000);
  }

  function updateField(field: keyof RegulatoryRecord, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function needsCapa(): boolean {
    return (
      ["Alta", "Crítica"].includes(form.prioridadRegulatoria) ||
      ["Requerimiento recibido", "Observado", "Rechazado", "Vencido", "Suspendido"].includes(form.estadoTramite) ||
      ["Requerimiento", "Observado", "Rechazado", "Suspendido"].includes(form.decisionAutoridad) ||
      ["Rechazado QA", "Requiere CAPA", "Requiere auditoría", "Requiere respuesta"].includes(form.decisionQA)
    );
  }

  function validateForm(): string[] {
    const errors = requiredFields
      .filter((field) => isInvalid(form[field]))
      .map((field) => fieldLabels[field]);

    if (form.fechaCompromiso && form.fechaRadicacion && isDateBefore(form.fechaCompromiso, form.fechaRadicacion)) {
      errors.push("La fecha compromiso no puede ser anterior a la fecha de radicación");
    }

    if (form.fechaRespuestaAutoridad && form.fechaRadicacion && isDateBefore(form.fechaRespuestaAutoridad, form.fechaRadicacion)) {
      errors.push("La fecha de respuesta a autoridad no puede ser anterior a la fecha de radicación");
    }

    if (["Respuesta enviada", "Aprobado", "Observado", "Rechazado", "Cerrado"].includes(form.estadoTramite) && isInvalid(form.fechaRespuestaAutoridad)) {
      errors.push("La fecha de respuesta a autoridad es obligatoria cuando el trámite fue respondido, aprobado, observado, rechazado o cerrado");
    }

    if (form.requiereRespuestaAutoridad === "Sí" && ["Vencido", "Requerimiento recibido"].includes(form.estadoTramite) && isInvalid(form.evidenciaRadicacion)) {
      errors.push("La evidencia de radicación o gestión es obligatoria para requerimientos o trámites vencidos");
    }

    if (["Aprobado QA", "Aprobado con observación QA", "Rechazado QA", "Cierre aprobado QA"].includes(form.decisionQA) && isInvalid(form.evidenciaRadicacion)) {
      errors.push("La evidencia de radicación es obligatoria para decisiones QA formales");
    }

    if (needsCapa() && isInvalid(form.desviacionAsociada)) {
      errors.push("La desviación asociada es obligatoria cuando hay prioridad alta/crítica, vencimiento, requerimiento, rechazo o CAPA");
    }

    if (needsCapa() && isInvalid(form.capa)) {
      errors.push("La CAPA es obligatoria cuando hay prioridad alta/crítica, vencimiento, requerimiento, rechazo o CAPA");
    }

    return Array.from(new Set(errors));
  }

  function fieldHasError(field: keyof RegulatoryRecord): boolean {
    if (!submitAttempted) return false;

    if (requiredFields.includes(field) && isInvalid(form[field])) return true;
    if (field === "fechaCompromiso" && form.fechaCompromiso && form.fechaRadicacion && isDateBefore(form.fechaCompromiso, form.fechaRadicacion)) return true;
    if (field === "fechaRespuestaAutoridad" && form.fechaRespuestaAutoridad && form.fechaRadicacion && isDateBefore(form.fechaRespuestaAutoridad, form.fechaRadicacion)) return true;
    if (field === "fechaRespuestaAutoridad" && ["Respuesta enviada", "Aprobado", "Observado", "Rechazado", "Cerrado"].includes(form.estadoTramite) && isInvalid(form.fechaRespuestaAutoridad)) return true;
    if (field === "evidenciaRadicacion" && ["Aprobado QA", "Aprobado con observación QA", "Rechazado QA", "Cierre aprobado QA"].includes(form.decisionQA) && isInvalid(form.evidenciaRadicacion)) return true;
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
      showCloud("No se guardó la radicación. Completa la información obligatoria.", errors, "warning");
      return;
    }

    const timestamp = nowIso();

    const payload: RegulatoryRecord = {
      ...form,
      codigoRadicacion: clean(form.codigoRadicacion),
      fechaRadicacion: clean(form.fechaRadicacion),
      horaRadicacion: clean(form.horaRadicacion),
      empresa: clean(form.empresa),
      sede: clean(form.sede),
      autoridad: clean(form.autoridad),
      tipoTramite: clean(form.tipoTramite),
      numeroExpediente: clean(form.numeroExpediente),
      productoProceso: clean(form.productoProceso),
      loteRelacionado: clean(form.loteRelacionado),
      normaAplicable: clean(form.normaAplicable),
      alcanceSolicitud: clean(form.alcanceSolicitud),
      responsableRegulatorio: clean(form.responsableRegulatorio),
      responsableQA: clean(form.responsableQA),
      fechaCompromiso: clean(form.fechaCompromiso),
      estadoTramite: clean(form.estadoTramite),
      prioridadRegulatoria: clean(form.prioridadRegulatoria),
      requiereRespuestaAutoridad: clean(form.requiereRespuestaAutoridad),
      fechaRespuestaAutoridad: clean(form.fechaRespuestaAutoridad),
      decisionAutoridad: clean(form.decisionAutoridad),
      decisionQA: clean(form.decisionQA),
      documentosSoporte: clean(form.documentosSoporte),
      evidenciaRadicacion: clean(form.evidenciaRadicacion),
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
      editingId ? "Radicación regulatoria actualizada correctamente." : "Radicación regulatoria registrada correctamente.",
      [],
      "success"
    );
  }

  function handleEdit(record: RegulatoryRecord) {
    setForm(record);
    setEditingId(record.id);
    setSubmitAttempted(false);
    showCloud("Radicación cargada para edición. Verifica antes de actualizar.", [], "success");
  }

  function handleDelete(id: string) {
    const confirmed = window.confirm("¿Confirmas eliminar esta radicación? En ambiente GMP real debería manejarse como anulación auditada.");
    if (!confirmed) return;

    const nextRecords = records.filter((record) => record.id !== id);
    setRecords(nextRecords);
    saveRecords(nextRecords);
    showCloud("Radicación eliminada del almacenamiento local.", [], "success");
  }

  function exportJson() {
    if (records.length === 0) {
      showCloud("No hay radicaciones para exportar.", [], "warning");
      return;
    }

    const blob = new Blob([JSON.stringify(records, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `floratrack-regulatorio-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);

    showCloud("Archivo JSON regulatorio exportado correctamente.", [], "success");
  }

  const filteredRecords = useMemo(() => {
    const term = clean(search).toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        !term ||
        [
          record.codigoRadicacion,
          record.empresa,
          record.sede,
          record.autoridad,
          record.tipoTramite,
          record.numeroExpediente,
          record.productoProceso,
          record.estadoTramite,
          record.decisionQA,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

      const matchesEstado = filterEstado === "Todos" || record.estadoTramite === filterEstado;

      return matchesSearch && matchesEstado;
    });
  }, [records, search, filterEstado]);

  const dashboard = useMemo(() => {
    return {
      total: records.length,
      abiertos: records.filter((record) => ["Radicado", "En revisión interna", "En revisión por autoridad", "Requerimiento recibido"].includes(record.estadoTramite)).length,
      vencidos: records.filter((record) => isPastDate(record.fechaCompromiso) && !["Cerrado", "Aprobado"].includes(record.estadoTramite)).length,
      criticos: records.filter((record) => record.prioridadRegulatoria === "Crítica").length,
      aprobados: records.filter((record) => ["Aprobado", "Cerrado"].includes(record.estadoTramite)).length,
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
        <header className="rounded-3xl border border-purple-400/20 bg-slate-900/80 p-6 shadow-2xl shadow-purple-950/30">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-purple-300">
                FloraTrack Enterprise Compliance Platform
              </p>

              <h1 className="mt-3 text-3xl font-black text-white md:text-5xl">
                Regulatorio, radicaciones y autoridades
              </h1>

              <p className="mt-3 max-w-5xl text-sm leading-6 text-slate-300 md:text-base">
                Control de radicaciones regulatorias, expedientes, licencias, requerimientos,
                respuestas a autoridad, evidencia documental, vencimientos, QA, desviaciones y CAPA.
              </p>
            </div>

            <div className="rounded-2xl border border-purple-400/20 bg-purple-500/10 px-5 py-4 text-sm text-purple-100">
              <p className="font-bold">Regulatorio activo</p>
              <p className="mt-1 text-purple-200">Autoridad · Licencia · Radicación · QA · CAPA</p>
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
          <Metric title="Radicaciones" value={dashboard.total} />
          <Metric title="Abiertas" value={dashboard.abiertos} tone="amber" />
          <Metric title="Vencidas" value={dashboard.vencidos} tone="red" />
          <Metric title="Críticas" value={dashboard.criticos} tone="red" />
          <Metric title="Aprobadas" value={dashboard.aprobados} tone="emerald" />
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
                <h2 className="text-2xl font-black text-white">{editingId ? "Editar radicación" : "Nueva radicación"}</h2>
                <p className="mt-1 text-sm text-slate-400">Ninguna radicación puede guardarse vacía o incompleta.</p>
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
                  : "border-slate-700 bg-slate-950 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/40";

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

                      {hasError && <p className="mt-1 text-xs font-bold text-red-300">Campo obligatorio o condición regulatoria requerida.</p>}
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
              <button type="button" onClick={handleSave} className="rounded-2xl bg-purple-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-purple-950/50 transition hover:bg-purple-400">
                {editingId ? "Actualizar radicación" : "Guardar radicación"}
              </button>

              <button type="button" onClick={resetForm} className="rounded-2xl border border-slate-600 px-6 py-3 text-sm font-bold text-slate-200 transition hover:bg-slate-800">
                Limpiar formulario
              </button>
            </div>
          </form>

          <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">Registro maestro regulatorio</h2>
                <p className="mt-1 text-sm text-slate-400">Consulta, filtra, edita y exporta radicaciones regulatorias.</p>
              </div>

              <button type="button" onClick={exportJson} className="rounded-2xl border border-purple-400/50 px-5 py-3 text-sm font-bold text-purple-200 transition hover:bg-purple-500/10">
                Exportar JSON
              </button>
            </div>

            <div className="mb-5 grid gap-3 md:grid-cols-[1fr_250px]">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-purple-400/40 transition placeholder:text-slate-600 focus:border-purple-400 focus:ring-4"
                placeholder="Buscar por radicado, autoridad, expediente, estado..."
              />

              <select
                value={filterEstado}
                onChange={(event) => setFilterEstado(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-purple-400/40 transition focus:border-purple-400 focus:ring-4"
              >
                <option>Todos</option>
                <option>Borrador</option>
                <option>Radicado</option>
                <option>En revisión interna</option>
                <option>En revisión por autoridad</option>
                <option>Requerimiento recibido</option>
                <option>Respuesta preparada</option>
                <option>Respuesta enviada</option>
                <option>Aprobado</option>
                <option>Observado</option>
                <option>Rechazado</option>
                <option>Cerrado</option>
                <option>Vencido</option>
                <option>Suspendido</option>
              </select>
            </div>

            <div className="max-h-[780px] space-y-4 overflow-auto pr-2">
              {filteredRecords.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center text-sm text-slate-400">
                  No hay radicaciones registradas. Crea la primera radicación con datos completos.
                </div>
              ) : (
                filteredRecords.map((record) => (
                  <article key={record.id} className="rounded-2xl border border-slate-700 bg-slate-950 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-white">{record.codigoRadicacion} · {record.autoridad}</h3>
                          <StatusPill value={record.estadoTramite} />
                          <span className="rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-200">
                            {record.prioridadRegulatoria}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-400">
                          {record.tipoTramite} · Expediente {record.numeroExpediente} · Compromiso {record.fechaCompromiso}
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
                      <Data label="Producto / proceso" value={record.productoProceso} />
                      <Data label="Lote relacionado" value={record.loteRelacionado || "Sin registro"} />
                      <Data label="Responsable regulatorio" value={record.responsableRegulatorio} />
                      <Data label="Responsable QA" value={record.responsableQA} />
                      <Data label="Respuesta autoridad" value={record.fechaRespuestaAutoridad || "Sin registro"} />
                      <Data label="Decisión autoridad" value={record.decisionAutoridad} />
                      <Data label="Decisión QA" value={record.decisionQA} />
                      <Data label="Evidencia" value={record.evidenciaRadicacion || "Sin registro"} />
                    </div>

                    <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300">
                      <p><span className="font-bold text-slate-100">Norma aplicable: </span>{record.normaAplicable}</p>
                      <p className="mt-2"><span className="font-bold text-slate-100">Alcance: </span>{record.alcanceSolicitud}</p>
                      <p className="mt-2"><span className="font-bold text-slate-100">Documentos soporte: </span>{record.documentosSoporte}</p>

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
      : value === "Radicado" || value === "En revisión interna" || value === "En revisión por autoridad" || value === "Respuesta preparada"
      ? "border-amber-400/40 bg-amber-500/10 text-amber-200"
      : "border-red-400/40 bg-red-500/10 text-red-200";

  return <span className={`rounded-full border px-3 py-1 text-xs font-bold ${className}`}>{value || "Sin estado"}</span>;
}
