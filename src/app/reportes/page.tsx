"use client";

import { useEffect, useMemo, useState } from "react";

type ReportRecord = {
  id: string;
  codigoReporte: string;
  fechaEmision: string;
  horaEmision: string;
  empresa: string;
  sede: string;
  periodoInicio: string;
  periodoFin: string;
  tipoReporte: string;
  alcanceReporte: string;
  modulosIncluidos: string;
  responsableEmision: string;
  responsableRevision: string;
  indicadorPrincipal: string;
  valorIndicador: string;
  estadoCumplimiento: string;
  nivelRiesgo: string;
  hallazgosResumen: string;
  accionesRequeridas: string;
  requiereCAPA: string;
  desviacionAsociada: string;
  capa: string;
  decisionQA: string;
  fechaAprobacionQA: string;
  evidencia: string;
  observaciones: string;
  creadoEn: string;
  actualizadoEn: string;
};

type FieldConfig = {
  key: keyof ReportRecord;
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

const STORAGE_KEY = "floratrack_reportes_kpi_cumplimiento_v1";

const emptyForm: ReportRecord = {
  id: "",
  codigoReporte: "",
  fechaEmision: "",
  horaEmision: "",
  empresa: "",
  sede: "",
  periodoInicio: "",
  periodoFin: "",
  tipoReporte: "",
  alcanceReporte: "",
  modulosIncluidos: "",
  responsableEmision: "",
  responsableRevision: "",
  indicadorPrincipal: "",
  valorIndicador: "",
  estadoCumplimiento: "",
  nivelRiesgo: "",
  hallazgosResumen: "",
  accionesRequeridas: "",
  requiereCAPA: "",
  desviacionAsociada: "",
  capa: "",
  decisionQA: "",
  fechaAprobacionQA: "",
  evidencia: "",
  observaciones: "",
  creadoEn: "",
  actualizadoEn: "",
};

const requiredFields: Array<keyof ReportRecord> = [
  "codigoReporte",
  "fechaEmision",
  "horaEmision",
  "empresa",
  "sede",
  "periodoInicio",
  "periodoFin",
  "tipoReporte",
  "alcanceReporte",
  "modulosIncluidos",
  "responsableEmision",
  "responsableRevision",
  "indicadorPrincipal",
  "valorIndicador",
  "estadoCumplimiento",
  "nivelRiesgo",
  "hallazgosResumen",
  "accionesRequeridas",
  "requiereCAPA",
  "decisionQA",
];

const fieldLabels: Record<keyof ReportRecord, string> = {
  id: "ID",
  codigoReporte: "Código de reporte",
  fechaEmision: "Fecha de emisión",
  horaEmision: "Hora de emisión",
  empresa: "Empresa",
  sede: "Sede / predio",
  periodoInicio: "Periodo inicio",
  periodoFin: "Periodo fin",
  tipoReporte: "Tipo de reporte",
  alcanceReporte: "Alcance del reporte",
  modulosIncluidos: "Módulos incluidos",
  responsableEmision: "Responsable de emisión",
  responsableRevision: "Responsable de revisión",
  indicadorPrincipal: "Indicador principal",
  valorIndicador: "Valor del indicador",
  estadoCumplimiento: "Estado de cumplimiento",
  nivelRiesgo: "Nivel de riesgo",
  hallazgosResumen: "Resumen de hallazgos",
  accionesRequeridas: "Acciones requeridas",
  requiereCAPA: "Requiere CAPA",
  desviacionAsociada: "Desviación asociada",
  capa: "CAPA",
  decisionQA: "Decisión QA",
  fechaAprobacionQA: "Fecha aprobación QA",
  evidencia: "Evidencia",
  observaciones: "Observaciones",
  creadoEn: "Creado en",
  actualizadoEn: "Actualizado en",
};

const fields: FieldConfig[] = [
  { key: "codigoReporte", label: "Código de reporte *", placeholder: "REP-2026-001" },
  { key: "fechaEmision", label: "Fecha de emisión *", type: "date" },
  { key: "horaEmision", label: "Hora de emisión *", type: "time" },
  { key: "empresa", label: "Empresa *", placeholder: "Growlifecol S.A.S." },
  { key: "sede", label: "Sede / predio *", placeholder: "Sede principal" },
  { key: "periodoInicio", label: "Periodo inicio *", type: "date" },
  { key: "periodoFin", label: "Periodo fin *", type: "date" },
  {
    key: "tipoReporte",
    label: "Tipo de reporte *",
    kind: "select",
    options: [
      "Reporte ejecutivo",
      "Reporte GACP",
      "Reporte GMP",
      "Reporte QA",
      "Reporte QC",
      "Reporte CAPA",
      "Reporte auditoría",
      "Reporte inventario",
      "Reporte trazabilidad",
      "Reporte regulatorio",
      "Reporte mensual",
      "Reporte trimestral",
      "Reporte anual",
      "Reporte de desviaciones",
      "Reporte de proveedores",
    ],
  },
  {
    key: "alcanceReporte",
    label: "Alcance del reporte *",
    kind: "textarea",
    placeholder: "Define periodo, empresa, sede, procesos, módulos, lotes, registros y criterios incluidos.",
  },
  {
    key: "modulosIncluidos",
    label: "Módulos incluidos *",
    kind: "textarea",
    placeholder: "Ej: Recepción, Inventario, Calidad QA, Desviaciones, Auditorías, Documentos, Entrenamiento, Proveedores...",
  },
  { key: "responsableEmision", label: "Responsable de emisión *", placeholder: "Responsable que genera el reporte" },
  { key: "responsableRevision", label: "Responsable de revisión *", placeholder: "QA / Dirección técnica / Auditor" },
  {
    key: "indicadorPrincipal",
    label: "Indicador principal *",
    kind: "select",
    options: [
      "Score de cumplimiento",
      "Registros completos",
      "Desviaciones abiertas",
      "CAPA vencidas",
      "Lotes liberados",
      "Lotes retenidos",
      "Auditorías cerradas",
      "Documentos vigentes",
      "Entrenamientos aprobados",
      "Proveedores aprobados",
      "Equipos calibrados",
      "Residuos dispuestos",
      "Recall completados",
      "Revisión de accesos",
    ],
  },
  { key: "valorIndicador", label: "Valor del indicador *", placeholder: "95%, 12 registros, 0 vencidos, etc." },
  {
    key: "estadoCumplimiento",
    label: "Estado de cumplimiento *",
    kind: "select",
    options: [
      "Conforme",
      "Con observaciones",
      "No conforme",
      "Pendiente revisión",
      "Requiere acción",
      "Requiere CAPA",
      "Requiere auditoría",
    ],
  },
  {
    key: "nivelRiesgo",
    label: "Nivel de riesgo *",
    kind: "select",
    options: ["Bajo", "Medio", "Alto", "Crítico"],
  },
  {
    key: "hallazgosResumen",
    label: "Resumen de hallazgos *",
    kind: "textarea",
    placeholder: "Resume hallazgos, tendencias, desviaciones, puntos críticos, cumplimiento y riesgos.",
  },
  {
    key: "accionesRequeridas",
    label: "Acciones requeridas *",
    kind: "textarea",
    placeholder: "Describe acciones, responsables, fechas objetivo o justifica si no aplica.",
  },
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
    placeholder: "Obligatoria si el reporte requiere CAPA, riesgo alto/crítico o estado no conforme.",
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
      "Cierre aprobado QA",
    ],
  },
  { key: "fechaAprobacionQA", label: "Fecha aprobación QA", type: "date" },
  { key: "evidencia", label: "Evidencia / soporte", placeholder: "PDF, acta, captura, exportación, gráfico, archivo, firma, enlace documental..." },
  {
    key: "observaciones",
    label: "Observaciones",
    kind: "textarea",
    placeholder: "Notas QA, contexto regulatorio, comentarios de dirección técnica, seguimiento o decisiones.",
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
  return `REP-${Date.now()}-${Math.random().toString(16).slice(2)}`;
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

function loadRecords(): ReportRecord[] {
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

function saveRecords(records: ReportRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export default function ReportesPage() {
  const [records, setRecords] = useState<ReportRecord[]>([]);
  const [form, setForm] = useState<ReportRecord>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [cloud, setCloud] = useState<CloudState | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [search, setSearch] = useState("");
  const [filterQA, setFilterQA] = useState("Todos");

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

  function updateField(field: keyof ReportRecord, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function needsCapa(): boolean {
    return (
      form.requiereCAPA === "Sí" ||
      ["No conforme", "Requiere acción", "Requiere CAPA", "Requiere auditoría"].includes(form.estadoCumplimiento) ||
      ["Alto", "Crítico"].includes(form.nivelRiesgo) ||
      ["Rechazado QA", "Requiere CAPA", "Requiere auditoría"].includes(form.decisionQA)
    );
  }

  function validateForm(): string[] {
    const errors = requiredFields
      .filter((field) => isInvalid(form[field]))
      .map((field) => fieldLabels[field]);

    if (isDateBefore(form.periodoFin, form.periodoInicio)) {
      errors.push("El periodo fin no puede ser anterior al periodo inicio");
    }

    if (["Aprobado QA", "Aprobado con observación QA", "Rechazado QA", "Cierre aprobado QA"].includes(form.decisionQA) && isInvalid(form.evidencia)) {
      errors.push("La evidencia es obligatoria para decisiones QA formales");
    }

    if (["Aprobado QA", "Aprobado con observación QA", "Rechazado QA", "Cierre aprobado QA"].includes(form.decisionQA) && isInvalid(form.fechaAprobacionQA)) {
      errors.push("La fecha de aprobación QA es obligatoria para decisiones QA formales");
    }

    if (needsCapa() && isInvalid(form.desviacionAsociada)) {
      errors.push("La desviación asociada es obligatoria cuando existe riesgo, no conformidad, CAPA o rechazo QA");
    }

    if (needsCapa() && isInvalid(form.capa)) {
      errors.push("La CAPA es obligatoria cuando existe riesgo, no conformidad, CAPA o rechazo QA");
    }

    return Array.from(new Set(errors));
  }

  function fieldHasError(field: keyof ReportRecord): boolean {
    if (!submitAttempted) return false;

    if (requiredFields.includes(field) && isInvalid(form[field])) return true;

    if (field === "periodoFin" && isDateBefore(form.periodoFin, form.periodoInicio)) return true;
    if (field === "evidencia" && ["Aprobado QA", "Aprobado con observación QA", "Rechazado QA", "Cierre aprobado QA"].includes(form.decisionQA) && isInvalid(form.evidencia)) return true;
    if (field === "fechaAprobacionQA" && ["Aprobado QA", "Aprobado con observación QA", "Rechazado QA", "Cierre aprobado QA"].includes(form.decisionQA) && isInvalid(form.fechaAprobacionQA)) return true;
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
      showCloud("No se guardó el reporte. Completa la información obligatoria.", errors, "warning");
      return;
    }

    const timestamp = nowIso();

    const payload: ReportRecord = {
      ...form,
      codigoReporte: clean(form.codigoReporte),
      fechaEmision: clean(form.fechaEmision),
      horaEmision: clean(form.horaEmision),
      empresa: clean(form.empresa),
      sede: clean(form.sede),
      periodoInicio: clean(form.periodoInicio),
      periodoFin: clean(form.periodoFin),
      tipoReporte: clean(form.tipoReporte),
      alcanceReporte: clean(form.alcanceReporte),
      modulosIncluidos: clean(form.modulosIncluidos),
      responsableEmision: clean(form.responsableEmision),
      responsableRevision: clean(form.responsableRevision),
      indicadorPrincipal: clean(form.indicadorPrincipal),
      valorIndicador: clean(form.valorIndicador),
      estadoCumplimiento: clean(form.estadoCumplimiento),
      nivelRiesgo: clean(form.nivelRiesgo),
      hallazgosResumen: clean(form.hallazgosResumen),
      accionesRequeridas: clean(form.accionesRequeridas),
      requiereCAPA: clean(form.requiereCAPA),
      desviacionAsociada: clean(form.desviacionAsociada),
      capa: clean(form.capa),
      decisionQA: clean(form.decisionQA),
      fechaAprobacionQA: clean(form.fechaAprobacionQA),
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
      editingId ? "Reporte actualizado correctamente." : "Reporte registrado correctamente con control ejecutivo GACP/GMP.",
      [],
      "success"
    );
  }

  function handleEdit(record: ReportRecord) {
    setForm(record);
    setEditingId(record.id);
    setSubmitAttempted(false);
    showCloud("Reporte cargado para edición. Verifica antes de actualizar.", [], "success");
  }

  function handleDelete(id: string) {
    const confirmed = window.confirm("¿Confirmas eliminar este reporte? En ambiente GMP real debería manejarse como anulación auditada.");
    if (!confirmed) return;

    const nextRecords = records.filter((record) => record.id !== id);
    setRecords(nextRecords);
    saveRecords(nextRecords);
    showCloud("Reporte eliminado del almacenamiento local.", [], "success");
  }

  function exportJson() {
    if (records.length === 0) {
      showCloud("No hay reportes para exportar.", [], "warning");
      return;
    }

    const blob = new Blob([JSON.stringify(records, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `floratrack-reportes-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);

    showCloud("Archivo JSON de reportes exportado correctamente.", [], "success");
  }

  const filteredRecords = useMemo(() => {
    const term = clean(search).toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        !term ||
        [
          record.codigoReporte,
          record.tipoReporte,
          record.empresa,
          record.sede,
          record.modulosIncluidos,
          record.indicadorPrincipal,
          record.estadoCumplimiento,
          record.nivelRiesgo,
          record.decisionQA,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

      const matchesQA = filterQA === "Todos" || record.decisionQA === filterQA;

      return matchesSearch && matchesQA;
    });
  }, [records, search, filterQA]);

  const dashboard = useMemo(() => {
    return {
      total: records.length,
      aprobados: records.filter((record) => ["Aprobado QA", "Cierre aprobado QA"].includes(record.decisionQA)).length,
      riesgoAlto: records.filter((record) => ["Alto", "Crítico"].includes(record.nivelRiesgo)).length,
      capa: records.filter((record) => record.requiereCAPA === "Sí").length,
      pendienteQA: records.filter((record) => record.decisionQA === "Pendiente QA").length,
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
        <header className="rounded-3xl border border-blue-400/20 bg-slate-900/80 p-6 shadow-2xl shadow-blue-950/30">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-300">
                FloraTrack Enterprise Compliance Platform
              </p>

              <h1 className="mt-3 text-3xl font-black text-white md:text-5xl">
                Reportes ejecutivos, KPIs y cumplimiento
              </h1>

              <p className="mt-3 max-w-5xl text-sm leading-6 text-slate-300 md:text-base">
                Registro de reportes GACP/GMP, KPIs, periodos, módulos incluidos,
                hallazgos, riesgos, acciones requeridas, evidencia, CAPA y decisión QA.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-400/20 bg-blue-500/10 px-5 py-4 text-sm text-blue-100">
              <p className="font-bold">Reporting activo</p>
              <p className="mt-1 text-blue-200">KPIs · Cumplimiento · QA · CAPA · Dirección</p>
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
          <Metric title="Reportes" value={dashboard.total} />
          <Metric title="Aprobados QA" value={dashboard.aprobados} tone="emerald" />
          <Metric title="Riesgo alto" value={dashboard.riesgoAlto} tone="red" />
          <Metric title="CAPA" value={dashboard.capa} tone="amber" />
          <Metric title="Pendiente QA" value={dashboard.pendienteQA} tone="sky" />
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
                <h2 className="text-2xl font-black text-white">{editingId ? "Editar reporte" : "Nuevo reporte"}</h2>
                <p className="mt-1 text-sm text-slate-400">Ningún reporte puede guardarse vacío o incompleto.</p>
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
                  : "border-slate-700 bg-slate-950 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/40";

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

                      {hasError && <p className="mt-1 text-xs font-bold text-red-300">Campo obligatorio o condición de reporte requerida.</p>}
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
              <button type="button" onClick={handleSave} className="rounded-2xl bg-blue-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-blue-950/50 transition hover:bg-blue-400">
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
                <h2 className="text-2xl font-black text-white">Registro maestro de reportes</h2>
                <p className="mt-1 text-sm text-slate-400">Consulta, filtra, edita y exporta reportes ejecutivos.</p>
              </div>

              <button type="button" onClick={exportJson} className="rounded-2xl border border-blue-400/50 px-5 py-3 text-sm font-bold text-blue-200 transition hover:bg-blue-500/10">
                Exportar JSON
              </button>
            </div>

            <div className="mb-5 grid gap-3 md:grid-cols-[1fr_250px]">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-blue-400/40 transition placeholder:text-slate-600 focus:border-blue-400 focus:ring-4"
                placeholder="Buscar por reporte, módulo, KPI, riesgo, QA..."
              />

              <select
                value={filterQA}
                onChange={(event) => setFilterQA(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-blue-400/40 transition focus:border-blue-400 focus:ring-4"
              >
                <option>Todos</option>
                <option>Pendiente QA</option>
                <option>Aprobado QA</option>
                <option>Aprobado con observación QA</option>
                <option>Rechazado QA</option>
                <option>Requiere CAPA</option>
                <option>Requiere auditoría</option>
                <option>Cierre aprobado QA</option>
              </select>
            </div>

            <div className="max-h-[780px] space-y-4 overflow-auto pr-2">
              {filteredRecords.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center text-sm text-slate-400">
                  No hay reportes registrados. Crea el primer reporte con datos completos.
                </div>
              ) : (
                filteredRecords.map((record) => (
                  <article key={record.id} className="rounded-2xl border border-slate-700 bg-slate-950 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-white">{record.codigoReporte} · {record.tipoReporte}</h3>
                          <StatusPill value={record.decisionQA} />
                          <span className="rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-200">
                            Riesgo {record.nivelRiesgo}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-400">
                          {record.periodoInicio} a {record.periodoFin} · {record.indicadorPrincipal}: {record.valorIndicador}
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
                      <Data label="Emitido por" value={record.responsableEmision} />
                      <Data label="Revisado por" value={record.responsableRevision} />
                      <Data label="Cumplimiento" value={record.estadoCumplimiento} />
                      <Data label="Requiere CAPA" value={record.requiereCAPA} />
                      <Data label="Fecha aprobación QA" value={record.fechaAprobacionQA || "Sin registro"} />
                      <Data label="Evidencia" value={record.evidencia || "Sin registro"} />
                    </div>

                    <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300">
                      <p><span className="font-bold text-slate-100">Alcance: </span>{record.alcanceReporte}</p>
                      <p className="mt-2"><span className="font-bold text-slate-100">Módulos: </span>{record.modulosIncluidos}</p>
                      <p className="mt-2"><span className="font-bold text-slate-100">Hallazgos: </span>{record.hallazgosResumen}</p>
                      <p className="mt-2"><span className="font-bold text-slate-100">Acciones requeridas: </span>{record.accionesRequeridas}</p>

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
    value === "Aprobado QA" || value === "Cierre aprobado QA"
      ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
      : value === "Pendiente QA" || value === "Aprobado con observación QA"
      ? "border-amber-400/40 bg-amber-500/10 text-amber-200"
      : "border-red-400/40 bg-red-500/10 text-red-200";

  return <span className={`rounded-full border px-3 py-1 text-xs font-bold ${className}`}>{value || "Sin QA"}</span>;
}
