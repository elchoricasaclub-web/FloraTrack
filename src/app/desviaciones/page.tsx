"use client";

import { useEffect, useMemo, useState } from "react";

type DesviacionRecord = {
  id: string;
  codigoDesviacion: string;
  fechaDeteccion: string;
  horaDeteccion: string;
  empresa: string;
  sede: string;
  reportadoPor: string;
  areaProceso: string;
  moduloOrigen: string;
  codigoLote: string;
  tipoDesviacion: string;
  criticidad: string;
  descripcion: string;
  impactoPotencial: string;
  causaRaiz: string;
  metodoInvestigacion: string;
  accionInmediata: string;
  capaPropuesta: string;
  responsableCAPA: string;
  fechaCompromiso: string;
  estadoCAPA: string;
  verificacionEficacia: string;
  decisionQA: string;
  evidencia: string;
  observaciones: string;
  creadoEn: string;
  actualizadoEn: string;
};

type FieldConfig = {
  key: keyof DesviacionRecord;
  label: string;
  type?: string;
  placeholder?: string;
  kind?: "input" | "select" | "textarea";
  options?: string[];
};

const STORAGE_KEY = "floratrack_desviaciones_capa_records_v1";

const emptyForm: DesviacionRecord = {
  id: "",
  codigoDesviacion: "",
  fechaDeteccion: "",
  horaDeteccion: "",
  empresa: "",
  sede: "",
  reportadoPor: "",
  areaProceso: "",
  moduloOrigen: "",
  codigoLote: "",
  tipoDesviacion: "",
  criticidad: "",
  descripcion: "",
  impactoPotencial: "",
  causaRaiz: "",
  metodoInvestigacion: "",
  accionInmediata: "",
  capaPropuesta: "",
  responsableCAPA: "",
  fechaCompromiso: "",
  estadoCAPA: "",
  verificacionEficacia: "",
  decisionQA: "",
  evidencia: "",
  observaciones: "",
  creadoEn: "",
  actualizadoEn: "",
};

const requiredFields: Array<keyof DesviacionRecord> = [
  "codigoDesviacion",
  "fechaDeteccion",
  "horaDeteccion",
  "empresa",
  "sede",
  "reportadoPor",
  "areaProceso",
  "moduloOrigen",
  "tipoDesviacion",
  "criticidad",
  "descripcion",
  "impactoPotencial",
  "accionInmediata",
  "responsableCAPA",
  "fechaCompromiso",
  "estadoCAPA",
  "decisionQA",
];

const fieldLabels: Record<keyof DesviacionRecord, string> = {
  id: "ID",
  codigoDesviacion: "Código de desviación",
  fechaDeteccion: "Fecha de detección",
  horaDeteccion: "Hora de detección",
  empresa: "Empresa",
  sede: "Sede / predio",
  reportadoPor: "Reportado por",
  areaProceso: "Área / proceso",
  moduloOrigen: "Módulo de origen",
  codigoLote: "Código de lote",
  tipoDesviacion: "Tipo de desviación",
  criticidad: "Criticidad",
  descripcion: "Descripción de la desviación",
  impactoPotencial: "Impacto potencial",
  causaRaiz: "Causa raíz",
  metodoInvestigacion: "Método de investigación",
  accionInmediata: "Acción inmediata",
  capaPropuesta: "CAPA propuesta",
  responsableCAPA: "Responsable CAPA",
  fechaCompromiso: "Fecha compromiso",
  estadoCAPA: "Estado CAPA",
  verificacionEficacia: "Verificación de eficacia",
  decisionQA: "Decisión QA",
  evidencia: "Evidencia",
  observaciones: "Observaciones",
  creadoEn: "Creado en",
  actualizadoEn: "Actualizado en",
};

const fields: FieldConfig[] = [
  { key: "codigoDesviacion", label: "Código de desviación *", placeholder: "DEV-2026-001" },
  { key: "fechaDeteccion", label: "Fecha de detección *", type: "date" },
  { key: "horaDeteccion", label: "Hora de detección *", type: "time" },
  { key: "empresa", label: "Empresa *", placeholder: "Growlifecol S.A.S." },
  { key: "sede", label: "Sede / predio *", placeholder: "Sede principal / laboratorio / cultivo" },
  { key: "reportadoPor", label: "Reportado por *", placeholder: "Nombre del responsable que reporta" },
  {
    key: "areaProceso",
    label: "Área / proceso *",
    kind: "select",
    options: [
      "Dirección técnica",
      "QA",
      "QC",
      "Recepción",
      "Inventario",
      "Propagación",
      "Cultivo",
      "Cosecha",
      "Secado",
      "Postcosecha",
      "Micropropagación",
      "Extracción BHO",
      "Bubble Hash",
      "Live Rosin",
      "Almacén",
      "Mantenimiento",
      "Saneamiento",
      "Regulatorio",
      "Auditoría",
    ],
  },
  {
    key: "moduloOrigen",
    label: "Módulo de origen *",
    kind: "select",
    options: [
      "Recepción",
      "Inventario",
      "Calidad QA",
      "Propagación",
      "Cultivo",
      "Cosecha",
      "Extracción",
      "Limpieza y saneamiento",
      "Mantenimiento",
      "Personal",
      "Proveedor",
      "Cliente / queja",
      "Auditoría interna",
      "Auditoría externa",
      "Regulatorio",
    ],
  },
  { key: "codigoLote", label: "Código de lote relacionado", placeholder: "INV-2026-001 / QC-2026-001 / COSECHA-001" },
  {
    key: "tipoDesviacion",
    label: "Tipo de desviación *",
    kind: "select",
    options: [
      "Desviación de proceso",
      "No conformidad",
      "Resultado fuera de especificación",
      "Resultado fuera de tendencia",
      "Error documental",
      "Falla de equipo",
      "Falla ambiental",
      "Falla de limpieza",
      "Falla de almacenamiento",
      "Contaminación",
      "Pérdida de trazabilidad",
      "Incumplimiento GACP",
      "Incumplimiento GMP",
      "Queja",
      "Hallazgo de auditoría",
    ],
  },
  {
    key: "criticidad",
    label: "Criticidad *",
    kind: "select",
    options: ["Baja", "Media", "Alta", "Crítica"],
  },
  {
    key: "descripcion",
    label: "Descripción de la desviación *",
    kind: "textarea",
    placeholder: "Describe qué ocurrió, cuándo, dónde, quién lo detectó, lote afectado y condición observada.",
  },
  {
    key: "impactoPotencial",
    label: "Impacto potencial *",
    kind: "textarea",
    placeholder: "Describe impacto en calidad, seguridad, trazabilidad, lote, producto, cumplimiento o paciente.",
  },
  {
    key: "causaRaiz",
    label: "Causa raíz",
    kind: "textarea",
    placeholder: "Obligatoria para criticidad Alta o Crítica. Ej: 5 Why, Ishikawa, falla humana, método, equipo, ambiente.",
  },
  {
    key: "metodoInvestigacion",
    label: "Método de investigación",
    kind: "select",
    options: [
      "Pendiente",
      "5 Why",
      "Ishikawa",
      "Revisión documental",
      "Revisión de lote",
      "Entrevista a personal",
      "Inspección en sitio",
      "Análisis de tendencia",
      "Investigación combinada",
      "No aplica",
    ],
  },
  {
    key: "accionInmediata",
    label: "Acción inmediata / contención *",
    kind: "textarea",
    placeholder: "Ej: cuarentena de lote, bloqueo de material, segregación, limpieza, retención, notificación QA.",
  },
  {
    key: "capaPropuesta",
    label: "CAPA propuesta",
    kind: "textarea",
    placeholder: "Obligatoria para criticidad Alta o Crítica. Define acción correctiva y preventiva.",
  },
  { key: "responsableCAPA", label: "Responsable CAPA *", placeholder: "Responsable de ejecutar seguimiento y cierre" },
  { key: "fechaCompromiso", label: "Fecha compromiso *", type: "date" },
  {
    key: "estadoCAPA",
    label: "Estado CAPA *",
    kind: "select",
    options: [
      "Abierta",
      "En investigación",
      "Acción inmediata ejecutada",
      "CAPA definida",
      "En ejecución",
      "Pendiente verificación",
      "Cerrada eficaz",
      "Cerrada no eficaz",
      "Vencida",
      "Cancelada por QA",
    ],
  },
  {
    key: "verificacionEficacia",
    label: "Verificación de eficacia",
    kind: "textarea",
    placeholder: "Evidencia de que la acción funcionó: revisión de tendencia, inspección, reentrenamiento, auditoría.",
  },
  {
    key: "decisionQA",
    label: "Decisión QA *",
    kind: "select",
    options: [
      "Pendiente QA",
      "Lote liberado",
      "Lote retenido",
      "Lote rechazado",
      "Reproceso autorizado",
      "Requiere investigación ampliada",
      "Requiere notificación regulatoria",
      "CAPA aprobada",
      "CAPA rechazada",
      "Cierre aprobado",
    ],
  },
  { key: "evidencia", label: "Evidencia / soporte", placeholder: "Foto, acta, QR, COA, registro, informe, enlace documental..." },
  {
    key: "observaciones",
    label: "Observaciones",
    kind: "textarea",
    placeholder: "Notas adicionales de QA, auditoría, seguimiento, impacto regulatorio o conclusiones.",
  },
];

function clean(value: unknown): string {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function isInvalid(value: unknown): boolean {
  const normalized = clean(value).toLowerCase();

  return [
    "",
    "seleccione",
    "seleccionar",
    "sin definir",
    "n/a",
    "na",
    "no aplica",
    "ninguno",
    "null",
    "undefined",
  ].includes(normalized);
}

function safeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `DEV-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function loadRecords(): DesviacionRecord[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(Boolean);
  } catch {
    return [];
  }
}

function saveRecords(records: DesviacionRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export default function DesviacionesPage() {
  const [records, setRecords] = useState<DesviacionRecord[]>([]);
  const [form, setForm] = useState<DesviacionRecord>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("Todos");

  useEffect(() => {
    setRecords(loadRecords());
  }, []);

  function showToast(message: string, errors: string[] = []) {
    setToast(message);
    setValidationErrors(errors);

    window.setTimeout(() => {
      setToast("");
      setValidationErrors([]);
    }, 9000);
  }

  function updateField(field: keyof DesviacionRecord, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function validateForm(): string[] {
    const errors = requiredFields
      .filter((field) => isInvalid(form[field]))
      .map((field) => fieldLabels[field]);

    if (["Alta", "Crítica"].includes(form.criticidad) && isInvalid(form.causaRaiz)) {
      errors.push("La causa raíz es obligatoria para criticidad Alta o Crítica");
    }

    if (["Alta", "Crítica"].includes(form.criticidad) && isInvalid(form.capaPropuesta)) {
      errors.push("La CAPA propuesta es obligatoria para criticidad Alta o Crítica");
    }

    if (
      ["Cerrada eficaz", "Cerrada no eficaz", "Cierre aprobado"].includes(form.estadoCAPA) &&
      isInvalid(form.verificacionEficacia)
    ) {
      errors.push("La verificación de eficacia es obligatoria para cerrar una CAPA");
    }

    if (
      ["Lote liberado", "Lote retenido", "Lote rechazado", "Reproceso autorizado"].includes(form.decisionQA) &&
      isInvalid(form.codigoLote)
    ) {
      errors.push("El código de lote es obligatorio cuando la decisión QA afecta un lote");
    }

    return Array.from(new Set(errors));
  }

  function fieldHasError(field: keyof DesviacionRecord): boolean {
    if (!submitAttempted) return false;

    if (requiredFields.includes(field) && isInvalid(form[field])) return true;

    if (field === "causaRaiz" && ["Alta", "Crítica"].includes(form.criticidad) && isInvalid(form.causaRaiz)) {
      return true;
    }

    if (field === "capaPropuesta" && ["Alta", "Crítica"].includes(form.criticidad) && isInvalid(form.capaPropuesta)) {
      return true;
    }

    if (
      field === "verificacionEficacia" &&
      ["Cerrada eficaz", "Cerrada no eficaz", "Cierre aprobado"].includes(form.estadoCAPA) &&
      isInvalid(form.verificacionEficacia)
    ) {
      return true;
    }

    if (
      field === "codigoLote" &&
      ["Lote liberado", "Lote retenido", "Lote rechazado", "Reproceso autorizado"].includes(form.decisionQA) &&
      isInvalid(form.codigoLote)
    ) {
      return true;
    }

    return false;
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setSubmitAttempted(false);
    setValidationErrors([]);
    setToast("");
  }

  function handleSubmit() {
    setSubmitAttempted(true);

    const errors = validateForm();

    if (errors.length > 0) {
      showToast("No se guardó la desviación. Completa los campos obligatorios.", errors);
      return;
    }

    const timestamp = nowIso();

    const payload: DesviacionRecord = {
      ...form,
      codigoDesviacion: clean(form.codigoDesviacion),
      fechaDeteccion: clean(form.fechaDeteccion),
      horaDeteccion: clean(form.horaDeteccion),
      empresa: clean(form.empresa),
      sede: clean(form.sede),
      reportadoPor: clean(form.reportadoPor),
      areaProceso: clean(form.areaProceso),
      moduloOrigen: clean(form.moduloOrigen),
      codigoLote: clean(form.codigoLote),
      tipoDesviacion: clean(form.tipoDesviacion),
      criticidad: clean(form.criticidad),
      descripcion: clean(form.descripcion),
      impactoPotencial: clean(form.impactoPotencial),
      causaRaiz: clean(form.causaRaiz),
      metodoInvestigacion: clean(form.metodoInvestigacion),
      accionInmediata: clean(form.accionInmediata),
      capaPropuesta: clean(form.capaPropuesta),
      responsableCAPA: clean(form.responsableCAPA),
      fechaCompromiso: clean(form.fechaCompromiso),
      estadoCAPA: clean(form.estadoCAPA),
      verificacionEficacia: clean(form.verificacionEficacia),
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

    showToast(
      editingId
        ? "Desviación actualizada correctamente con trazabilidad."
        : "Desviación / CAPA registrada correctamente con control GACP/GMP."
    );
  }

  function handleEdit(record: DesviacionRecord) {
    setForm(record);
    setEditingId(record.id);
    setSubmitAttempted(false);
    showToast("Registro cargado para edición. Verifica antes de actualizar.");
  }

  function handleDelete(id: string) {
    const confirmed = window.confirm(
      "¿Confirmas eliminar esta desviación? En ambiente GMP real esto debería manejarse como anulación auditada."
    );

    if (!confirmed) return;

    const nextRecords = records.filter((record) => record.id !== id);
    setRecords(nextRecords);
    saveRecords(nextRecords);
    showToast("Registro eliminado del almacenamiento local.");
  }

  function exportJson() {
    if (records.length === 0) {
      showToast("No hay desviaciones para exportar.");
      return;
    }

    const blob = new Blob([JSON.stringify(records, null, 2)], {
      type: "application/json;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `floratrack-desviaciones-capa-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);

    showToast("Archivo JSON de desviaciones y CAPA exportado correctamente.");
  }

  const filteredRecords = useMemo(() => {
    const term = clean(search).toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        !term ||
        [
          record.codigoDesviacion,
          record.empresa,
          record.sede,
          record.reportadoPor,
          record.areaProceso,
          record.moduloOrigen,
          record.codigoLote,
          record.tipoDesviacion,
          record.criticidad,
          record.estadoCAPA,
          record.decisionQA,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

      const matchesEstado = filterEstado === "Todos" || record.estadoCAPA === filterEstado;

      return matchesSearch && matchesEstado;
    });
  }, [records, search, filterEstado]);

  const dashboard = useMemo(() => {
    return {
      total: records.length,
      abiertas: records.filter((record) =>
        ["Abierta", "En investigación", "CAPA definida", "En ejecución", "Pendiente verificación"].includes(record.estadoCAPA)
      ).length,
      criticas: records.filter((record) => ["Alta", "Crítica"].includes(record.criticidad)).length,
      cerradas: records.filter((record) =>
        ["Cerrada eficaz", "Cierre aprobado"].includes(record.estadoCAPA)
      ).length,
      vencidas: records.filter((record) => record.estadoCAPA === "Vencida").length,
    };
  }, [records]);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-slate-100">
      {toast && (
        <div
          role="alert"
          className="fixed right-5 top-5 z-[9999] max-w-xl rounded-3xl border border-amber-300/60 bg-slate-950 px-5 py-4 text-sm text-amber-100 shadow-2xl shadow-black/60"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-base font-black text-amber-200">{toast}</p>

              {validationErrors.length > 0 && (
                <ul className="mt-3 max-h-56 list-disc space-y-1 overflow-auto pl-5 text-amber-100">
                  {validationErrors.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setToast("");
                setValidationErrors([]);
              }}
              className="rounded-xl border border-amber-300/40 px-3 py-1 text-xs font-black text-amber-100 hover:bg-amber-500/10"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      <section className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-3xl border border-red-400/20 bg-slate-900/80 p-6 shadow-2xl shadow-red-950/30">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-300">
                FloraTrack Enterprise Compliance Platform
              </p>

              <h1 className="mt-3 text-3xl font-black text-white md:text-5xl">
                Desviaciones, no conformidades y CAPA
              </h1>

              <p className="mt-3 max-w-5xl text-sm leading-6 text-slate-300 md:text-base">
                Investigación, causa raíz, acciones inmediatas, CAPA, seguimiento,
                verificación de eficacia, decisión QA, impacto sobre lote y trazabilidad
                para auditorías GACP/GMP.
              </p>
            </div>

            <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-5 py-4 text-sm text-red-100">
              <p className="font-bold">Sistema CAPA activo</p>
              <p className="mt-1 text-red-200">
                Validación obligatoria · No conformidades · Causa raíz · Cierre QA
              </p>
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
          <Metric title="Total" value={dashboard.total} />
          <Metric title="Abiertas" value={dashboard.abiertas} tone="amber" />
          <Metric title="Alta / Crítica" value={dashboard.criticas} tone="red" />
          <Metric title="Cerradas eficaces" value={dashboard.cerradas} tone="emerald" />
          <Metric title="Vencidas" value={dashboard.vencidas} tone="red" />
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <form
            noValidate
            className="rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-xl"
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmit();
            }}
          >
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">
                  {editingId ? "Editar desviación" : "Nueva desviación / CAPA"}
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Ninguna desviación puede guardarse vacía o incompleta.
                </p>
              </div>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-slate-600 px-4 py-2 text-sm font-bold text-slate-200 hover:bg-slate-800"
                >
                  Cancelar edición
                </button>
              )}
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
                      <span className="mb-2 block text-sm font-bold text-slate-200">
                        {field.label}
                      </span>

                      <textarea
                        value={form[field.key]}
                        onChange={(event) => updateField(field.key, event.target.value)}
                        rows={4}
                        placeholder={field.placeholder}
                        className={`w-full rounded-2xl border px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 ${controlClass}`}
                      />

                      {hasError && (
                        <p className="mt-1 text-xs font-bold text-red-300">
                          Campo obligatorio o condición CAPA requerida.
                        </p>
                      )}
                    </label>
                  );
                }

                if (field.kind === "select") {
                  return (
                    <label key={field.key}>
                      <span className="mb-2 block text-sm font-bold text-slate-200">
                        {field.label}
                      </span>

                      <select
                        value={form[field.key]}
                        onChange={(event) => updateField(field.key, event.target.value)}
                        className={`w-full rounded-2xl border px-4 py-3 text-sm text-white outline-none transition ${controlClass}`}
                      >
                        <option value="">Seleccione</option>
                        {(field.options ?? []).map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>

                      {hasError && (
                        <p className="mt-1 text-xs font-bold text-red-300">
                          Selecciona una opción válida.
                        </p>
                      )}
                    </label>
                  );
                }

                return (
                  <label key={field.key}>
                    <span className="mb-2 block text-sm font-bold text-slate-200">
                      {field.label}
                    </span>

                    <input
                      type={field.type ?? "text"}
                      value={form[field.key]}
                      onChange={(event) => updateField(field.key, event.target.value)}
                      placeholder={field.placeholder}
                      className={`w-full rounded-2xl border px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 ${controlClass}`}
                    />

                    {hasError && (
                      <p className="mt-1 text-xs font-bold text-red-300">
                        Completa este campo antes de guardar.
                      </p>
                    )}
                  </label>
                );
              })}
            </div>

            <div className="mt-6 flex flex-col gap-3 md:flex-row">
              <button
                type="submit"
                className="rounded-2xl bg-red-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-red-950/50 transition hover:bg-red-400"
              >
                {editingId ? "Actualizar desviación" : "Guardar desviación / CAPA"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="rounded-2xl border border-slate-600 px-6 py-3 text-sm font-bold text-slate-200 transition hover:bg-slate-800"
              >
                Limpiar formulario
              </button>
            </div>
          </form>

          <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">
                  Registro maestro de desviaciones
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Consulta, filtra, edita y exporta desviaciones, no conformidades y CAPA.
                </p>
              </div>

              <button
                type="button"
                onClick={exportJson}
                className="rounded-2xl border border-red-400/50 px-5 py-3 text-sm font-bold text-red-200 transition hover:bg-red-500/10"
              >
                Exportar JSON
              </button>
            </div>

            <div className="mb-5 grid gap-3 md:grid-cols-[1fr_240px]">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-red-400/40 transition placeholder:text-slate-600 focus:border-red-400 focus:ring-4"
                placeholder="Buscar por código, lote, proceso, criticidad, responsable..."
              />

              <select
                value={filterEstado}
                onChange={(event) => setFilterEstado(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-red-400/40 transition focus:border-red-400 focus:ring-4"
              >
                <option>Todos</option>
                <option>Abierta</option>
                <option>En investigación</option>
                <option>Acción inmediata ejecutada</option>
                <option>CAPA definida</option>
                <option>En ejecución</option>
                <option>Pendiente verificación</option>
                <option>Cerrada eficaz</option>
                <option>Cerrada no eficaz</option>
                <option>Vencida</option>
                <option>Cancelada por QA</option>
              </select>
            </div>

            <div className="max-h-[780px] space-y-4 overflow-auto pr-2">
              {filteredRecords.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center text-sm text-slate-400">
                  No hay desviaciones registradas. Crea el primer registro con datos completos.
                </div>
              ) : (
                filteredRecords.map((record) => (
                  <article key={record.id} className="rounded-2xl border border-slate-700 bg-slate-950 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-white">{record.codigoDesviacion}</h3>
                          <StatusPill value={record.criticidad} />
                          <span className="rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs font-bold text-sky-200">
                            {record.estadoCAPA}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-400">
                          {record.fechaDeteccion} · {record.horaDeteccion} · {record.areaProceso}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(record)}
                          className="rounded-xl border border-slate-600 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-800"
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(record.id)}
                          className="rounded-xl border border-red-400/40 px-3 py-2 text-xs font-bold text-red-200 hover:bg-red-500/10"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                      <Data label="Empresa" value={record.empresa} />
                      <Data label="Sede" value={record.sede} />
                      <Data label="Reportado por" value={record.reportadoPor} />
                      <Data label="Módulo origen" value={record.moduloOrigen} />
                      <Data label="Tipo" value={record.tipoDesviacion} />
                      <Data label="Lote" value={record.codigoLote || "Sin lote asociado"} />
                      <Data label="Responsable CAPA" value={record.responsableCAPA} />
                      <Data label="Fecha compromiso" value={record.fechaCompromiso} />
                      <Data label="Decisión QA" value={record.decisionQA} />
                      <Data label="Evidencia" value={record.evidencia || "Sin registro"} />
                    </div>

                    <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300">
                      <p>
                        <span className="font-bold text-slate-100">Descripción: </span>
                        {record.descripcion}
                      </p>

                      <p className="mt-2">
                        <span className="font-bold text-slate-100">Impacto potencial: </span>
                        {record.impactoPotencial}
                      </p>

                      {record.accionInmediata && (
                        <p className="mt-2">
                          <span className="font-bold text-slate-100">Acción inmediata: </span>
                          {record.accionInmediata}
                        </p>
                      )}

                      {record.causaRaiz && (
                        <p className="mt-2">
                          <span className="font-bold text-slate-100">Causa raíz: </span>
                          {record.causaRaiz}
                        </p>
                      )}

                      {record.capaPropuesta && (
                        <p className="mt-2">
                          <span className="font-bold text-slate-100">CAPA: </span>
                          {record.capaPropuesta}
                        </p>
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

function Metric({
  title,
  value,
  tone = "slate",
}: {
  title: string;
  value: number;
  tone?: "slate" | "emerald" | "amber" | "red" | "sky";
}) {
  const toneClass =
    tone === "emerald"
      ? "text-emerald-300"
      : tone === "amber"
      ? "text-amber-300"
      : tone === "red"
      ? "text-red-300"
      : tone === "sky"
      ? "text-sky-300"
      : "text-white";

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
    value === "Crítica"
      ? "border-red-400/40 bg-red-500/10 text-red-200"
      : value === "Alta"
      ? "border-orange-400/40 bg-orange-500/10 text-orange-200"
      : value === "Media"
      ? "border-amber-400/40 bg-amber-500/10 text-amber-200"
      : "border-emerald-400/40 bg-emerald-500/10 text-emerald-200";

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-bold ${className}`}>
      {value || "Sin criticidad"}
    </span>
  );
}
