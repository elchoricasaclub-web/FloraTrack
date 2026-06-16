"use client";

import { useEffect, useMemo, useState } from "react";

type DocumentoRecord = {
  id: string;
  codigoDocumento: string;
  tituloDocumento: string;
  tipoDocumento: string;
  proceso: string;
  version: string;
  fechaEmision: string;
  fechaVigencia: string;
  fechaRevision: string;
  empresa: string;
  sede: string;
  propietarioProceso: string;
  elaboradoPor: string;
  revisadoPor: string;
  aprobadoPor: string;
  estadoDocumento: string;
  clasificacion: string;
  nivelRiesgo: string;
  entrenamientoRequerido: string;
  grupoEntrenamiento: string;
  evidenciaAprobacion: string;
  ubicacionDocumento: string;
  cambioVersion: string;
  observaciones: string;
  creadoEn: string;
  actualizadoEn: string;
};

type FieldConfig = {
  key: keyof DocumentoRecord;
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

const STORAGE_KEY = "floratrack_documentos_controlados_records_v5";

const emptyForm: DocumentoRecord = {
  id: "",
  codigoDocumento: "",
  tituloDocumento: "",
  tipoDocumento: "",
  proceso: "",
  version: "",
  fechaEmision: "",
  fechaVigencia: "",
  fechaRevision: "",
  empresa: "",
  sede: "",
  propietarioProceso: "",
  elaboradoPor: "",
  revisadoPor: "",
  aprobadoPor: "",
  estadoDocumento: "",
  clasificacion: "",
  nivelRiesgo: "",
  entrenamientoRequerido: "",
  grupoEntrenamiento: "",
  evidenciaAprobacion: "",
  ubicacionDocumento: "",
  cambioVersion: "",
  observaciones: "",
  creadoEn: "",
  actualizadoEn: "",
};

const requiredFields: Array<keyof DocumentoRecord> = [
  "codigoDocumento",
  "tituloDocumento",
  "tipoDocumento",
  "proceso",
  "version",
  "fechaEmision",
  "fechaVigencia",
  "empresa",
  "sede",
  "propietarioProceso",
  "elaboradoPor",
  "revisadoPor",
  "aprobadoPor",
  "estadoDocumento",
  "clasificacion",
  "nivelRiesgo",
  "entrenamientoRequerido",
  "ubicacionDocumento",
];

const fieldLabels: Record<keyof DocumentoRecord, string> = {
  id: "ID",
  codigoDocumento: "Código de documento",
  tituloDocumento: "Título del documento",
  tipoDocumento: "Tipo de documento",
  proceso: "Proceso",
  version: "Versión",
  fechaEmision: "Fecha de emisión",
  fechaVigencia: "Fecha de vigencia",
  fechaRevision: "Próxima revisión",
  empresa: "Empresa",
  sede: "Sede / predio",
  propietarioProceso: "Propietario del proceso",
  elaboradoPor: "Elaborado por",
  revisadoPor: "Revisado por",
  aprobadoPor: "Aprobado por QA",
  estadoDocumento: "Estado documental",
  clasificacion: "Clasificación",
  nivelRiesgo: "Nivel de riesgo",
  entrenamientoRequerido: "Entrenamiento requerido",
  grupoEntrenamiento: "Grupo de entrenamiento",
  evidenciaAprobacion: "Evidencia de aprobación",
  ubicacionDocumento: "Ubicación documental",
  cambioVersion: "Cambio / justificación",
  observaciones: "Observaciones",
  creadoEn: "Creado en",
  actualizadoEn: "Actualizado en",
};

const fields: FieldConfig[] = [
  { key: "codigoDocumento", label: "Código de documento *", placeholder: "SOP-QA-001" },
  { key: "tituloDocumento", label: "Título del documento *", placeholder: "Procedimiento de control documental" },
  {
    key: "tipoDocumento",
    label: "Tipo de documento *",
    kind: "select",
    options: ["SOP / Procedimiento", "Formato", "Instructivo", "Manual", "Política", "Plan maestro", "Especificación", "Protocolo", "Registro maestro", "Checklist", "Anexo"],
  },
  {
    key: "proceso",
    label: "Proceso *",
    kind: "select",
    options: ["QA", "QC", "Documentación", "Entrenamiento", "Recepción", "Inventario", "Propagación", "Cultivo", "Cosecha", "Secado", "Postcosecha", "Micropropagación", "Extracción BHO", "Bubble Hash", "Live Rosin", "Limpieza y saneamiento", "Mantenimiento", "Regulatorio", "Auditorías", "CAPA"],
  },
  { key: "version", label: "Versión *", placeholder: "1.0" },
  { key: "fechaEmision", label: "Fecha de emisión *", type: "date" },
  { key: "fechaVigencia", label: "Fecha de vigencia *", type: "date" },
  { key: "fechaRevision", label: "Próxima revisión", type: "date" },
  { key: "empresa", label: "Empresa *", placeholder: "Growlifecol S.A.S." },
  { key: "sede", label: "Sede / predio *", placeholder: "Sede principal" },
  { key: "propietarioProceso", label: "Propietario del proceso *", placeholder: "QA / Dirección técnica" },
  { key: "elaboradoPor", label: "Elaborado por *", placeholder: "Autor del documento" },
  { key: "revisadoPor", label: "Revisado por *", placeholder: "Revisor técnico / QA" },
  { key: "aprobadoPor", label: "Aprobado por QA *", placeholder: "Dirección QA" },
  {
    key: "estadoDocumento",
    label: "Estado documental *",
    kind: "select",
    options: ["Borrador", "En revisión", "Aprobado", "Vigente", "En entrenamiento", "Suspendido", "Obsoleto", "Rechazado", "Pendiente QA"],
  },
  {
    key: "clasificacion",
    label: "Clasificación *",
    kind: "select",
    options: ["Controlado", "No controlado", "Confidencial", "Uso interno", "Regulatorio", "Crítico GMP", "Crítico GACP", "Registro electrónico"],
  },
  {
    key: "nivelRiesgo",
    label: "Nivel de riesgo *",
    kind: "select",
    options: ["Bajo", "Medio", "Alto", "Crítico"],
  },
  {
    key: "entrenamientoRequerido",
    label: "Entrenamiento requerido *",
    kind: "select",
    options: ["Sí", "No"],
  },
  { key: "grupoEntrenamiento", label: "Grupo de entrenamiento", placeholder: "QA, Producción, Cultivo, Almacén..." },
  { key: "evidenciaAprobacion", label: "Evidencia de aprobación", placeholder: "Acta, firma QA, enlace, código documental..." },
  { key: "ubicacionDocumento", label: "Ubicación documental *", placeholder: "Repositorio documental FloraTrack" },
  {
    key: "cambioVersion",
    label: "Cambio / justificación",
    kind: "textarea",
    placeholder: "Describe cambios, justificación de versión u obsolescencia.",
  },
  {
    key: "observaciones",
    label: "Observaciones",
    kind: "textarea",
    placeholder: "Notas de control documental, distribución, restricciones, trazabilidad o impacto regulatorio.",
  },
];

function clean(value: unknown): string {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function isInvalid(value: unknown): boolean {
  return ["", "seleccione", "seleccionar", "sin definir", "n/a", "na", "no aplica", "ninguno", "null", "undefined"].includes(clean(value).toLowerCase());
}

function safeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `DOC-${Date.now()}-${Math.random().toString(16).slice(2)}`;
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

function loadRecords(): DocumentoRecord[] {
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

function saveRecords(records: DocumentoRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export default function DocumentosPage() {
  const [records, setRecords] = useState<DocumentoRecord[]>([]);
  const [form, setForm] = useState<DocumentoRecord>(emptyForm);
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

  function updateField(field: keyof DocumentoRecord, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function validateForm(): string[] {
    const errors = requiredFields
      .filter((field) => isInvalid(form[field]))
      .map((field) => fieldLabels[field]);

    const versionNumber = Number(form.version);

    if (!Number.isFinite(versionNumber) || versionNumber <= 0) errors.push("La versión debe ser numérica y mayor a cero");
    if (isDateBefore(form.fechaVigencia, form.fechaEmision)) errors.push("La fecha de vigencia no puede ser anterior a la fecha de emisión");
    if (form.fechaRevision && isDateBefore(form.fechaRevision, form.fechaEmision)) errors.push("La próxima revisión no puede ser anterior a la fecha de emisión");

    if (["Aprobado", "Vigente", "En entrenamiento"].includes(form.estadoDocumento) && isInvalid(form.evidenciaAprobacion)) {
      errors.push("La evidencia de aprobación es obligatoria para documentos aprobados, vigentes o en entrenamiento");
    }

    if (form.estadoDocumento === "Obsoleto" && isInvalid(form.cambioVersion)) {
      errors.push("La justificación de cambio u obsolescencia es obligatoria para documentos obsoletos");
    }

    if (form.entrenamientoRequerido === "Sí" && isInvalid(form.grupoEntrenamiento)) {
      errors.push("El grupo de entrenamiento es obligatorio cuando el documento requiere entrenamiento");
    }

    if (["Alto", "Crítico"].includes(form.nivelRiesgo) && isInvalid(form.fechaRevision)) {
      errors.push("La próxima revisión es obligatoria para documentos de riesgo Alto o Crítico");
    }

    return Array.from(new Set(errors));
  }

  function fieldHasError(field: keyof DocumentoRecord): boolean {
    if (!submitAttempted) return false;

    if (requiredFields.includes(field) && isInvalid(form[field])) return true;

    if (field === "version") {
      const versionNumber = Number(form.version);
      return !Number.isFinite(versionNumber) || versionNumber <= 0;
    }

    if (field === "fechaVigencia" && isDateBefore(form.fechaVigencia, form.fechaEmision)) return true;

    if (field === "fechaRevision") {
      if (form.fechaRevision && isDateBefore(form.fechaRevision, form.fechaEmision)) return true;
      if (["Alto", "Crítico"].includes(form.nivelRiesgo) && isInvalid(form.fechaRevision)) return true;
    }

    if (field === "evidenciaAprobacion" && ["Aprobado", "Vigente", "En entrenamiento"].includes(form.estadoDocumento) && isInvalid(form.evidenciaAprobacion)) return true;
    if (field === "grupoEntrenamiento" && form.entrenamientoRequerido === "Sí" && isInvalid(form.grupoEntrenamiento)) return true;
    if (field === "cambioVersion" && form.estadoDocumento === "Obsoleto" && isInvalid(form.cambioVersion)) return true;

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
      showCloud("No se guardó el documento. Completa la información obligatoria.", errors, "warning");
      return;
    }

    const timestamp = nowIso();

    const payload: DocumentoRecord = {
      ...form,
      codigoDocumento: clean(form.codigoDocumento),
      tituloDocumento: clean(form.tituloDocumento),
      tipoDocumento: clean(form.tipoDocumento),
      proceso: clean(form.proceso),
      version: clean(form.version),
      fechaEmision: clean(form.fechaEmision),
      fechaVigencia: clean(form.fechaVigencia),
      fechaRevision: clean(form.fechaRevision),
      empresa: clean(form.empresa),
      sede: clean(form.sede),
      propietarioProceso: clean(form.propietarioProceso),
      elaboradoPor: clean(form.elaboradoPor),
      revisadoPor: clean(form.revisadoPor),
      aprobadoPor: clean(form.aprobadoPor),
      estadoDocumento: clean(form.estadoDocumento),
      clasificacion: clean(form.clasificacion),
      nivelRiesgo: clean(form.nivelRiesgo),
      entrenamientoRequerido: clean(form.entrenamientoRequerido),
      grupoEntrenamiento: clean(form.grupoEntrenamiento),
      evidenciaAprobacion: clean(form.evidenciaAprobacion),
      ubicacionDocumento: clean(form.ubicacionDocumento),
      cambioVersion: clean(form.cambioVersion),
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
      editingId ? "Documento controlado actualizado correctamente." : "Documento controlado registrado correctamente con trazabilidad GACP/GMP.",
      [],
      "success"
    );
  }

  function handleEdit(record: DocumentoRecord) {
    setForm(record);
    setEditingId(record.id);
    setSubmitAttempted(false);
    showCloud("Documento cargado para edición. Verifica antes de actualizar.", [], "success");
  }

  function handleDelete(id: string) {
    const confirmed = window.confirm("¿Confirmas eliminar este documento? En ambiente GMP real debería gestionarse como obsolescencia o anulación auditada.");
    if (!confirmed) return;

    const nextRecords = records.filter((record) => record.id !== id);
    setRecords(nextRecords);
    saveRecords(nextRecords);
    showCloud("Documento eliminado del almacenamiento local.", [], "success");
  }

  function exportJson() {
    if (records.length === 0) {
      showCloud("No hay documentos para exportar.", [], "warning");
      return;
    }

    const blob = new Blob([JSON.stringify(records, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `floratrack-documentos-controlados-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);

    showCloud("Archivo JSON de documentos controlados exportado correctamente.", [], "success");
  }

  const filteredRecords = useMemo(() => {
    const term = clean(search).toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        !term ||
        [
          record.codigoDocumento,
          record.tituloDocumento,
          record.tipoDocumento,
          record.proceso,
          record.version,
          record.empresa,
          record.sede,
          record.propietarioProceso,
          record.estadoDocumento,
          record.clasificacion,
          record.nivelRiesgo,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

      const matchesEstado = filterEstado === "Todos" || record.estadoDocumento === filterEstado;

      return matchesSearch && matchesEstado;
    });
  }, [records, search, filterEstado]);

  const dashboard = useMemo(() => {
    return {
      total: records.length,
      vigentes: records.filter((record) => record.estadoDocumento === "Vigente").length,
      revision: records.filter((record) => ["Borrador", "En revisión", "Pendiente QA"].includes(record.estadoDocumento)).length,
      obsoletos: records.filter((record) => record.estadoDocumento === "Obsoleto").length,
      criticos: records.filter((record) => ["Alto", "Crítico"].includes(record.nivelRiesgo)).length,
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
        <header className="rounded-3xl border border-indigo-400/20 bg-slate-900/80 p-6 shadow-2xl shadow-indigo-950/30">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-indigo-300">
            FloraTrack Enterprise Compliance Platform
          </p>

          <h1 className="mt-3 text-3xl font-black text-white md:text-5xl">
            Documentos controlados / SOP GMP
          </h1>

          <p className="mt-3 max-w-5xl text-sm leading-6 text-slate-300 md:text-base">
            Control documental de SOP, formatos, instructivos, versiones, vigencia,
            aprobación QA, obsolescencia, entrenamiento, evidencia y trazabilidad regulatoria.
          </p>
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
          <Metric title="Documentos" value={dashboard.total} />
          <Metric title="Vigentes" value={dashboard.vigentes} tone="emerald" />
          <Metric title="En revisión" value={dashboard.revision} tone="amber" />
          <Metric title="Obsoletos" value={dashboard.obsoletos} tone="red" />
          <Metric title="Alto / crítico" value={dashboard.criticos} tone="sky" />
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
                <h2 className="text-2xl font-black text-white">
                  {editingId ? "Editar documento" : "Nuevo documento controlado"}
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Ningún documento puede guardarse vacío o incompleto.
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
                  : "border-slate-700 bg-slate-950 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/40";

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
                      {hasError && <p className="mt-1 text-xs font-bold text-red-300">Campo obligatorio o condición documental requerida.</p>}
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
                          <option key={option} value={option}>
                            {option}
                          </option>
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
              <button
                type="button"
                onClick={handleSave}
                className="rounded-2xl bg-indigo-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-indigo-950/50 transition hover:bg-indigo-400"
              >
                {editingId ? "Actualizar documento" : "Guardar documento"}
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
                <h2 className="text-2xl font-black text-white">Registro maestro documental</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Consulta, filtra, edita y exporta documentos controlados.
                </p>
              </div>

              <button
                type="button"
                onClick={exportJson}
                className="rounded-2xl border border-indigo-400/50 px-5 py-3 text-sm font-bold text-indigo-200 transition hover:bg-indigo-500/10"
              >
                Exportar JSON
              </button>
            </div>

            <div className="mb-5 grid gap-3 md:grid-cols-[1fr_230px]">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-indigo-400/40 transition placeholder:text-slate-600 focus:border-indigo-400 focus:ring-4"
                placeholder="Buscar por código, título, proceso, versión, propietario..."
              />

              <select
                value={filterEstado}
                onChange={(event) => setFilterEstado(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-indigo-400/40 transition focus:border-indigo-400 focus:ring-4"
              >
                <option>Todos</option>
                <option>Borrador</option>
                <option>En revisión</option>
                <option>Aprobado</option>
                <option>Vigente</option>
                <option>En entrenamiento</option>
                <option>Suspendido</option>
                <option>Obsoleto</option>
                <option>Rechazado</option>
                <option>Pendiente QA</option>
              </select>
            </div>

            <div className="max-h-[780px] space-y-4 overflow-auto pr-2">
              {filteredRecords.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center text-sm text-slate-400">
                  No hay documentos registrados. Crea el primer documento con datos completos.
                </div>
              ) : (
                filteredRecords.map((record) => (
                  <article key={record.id} className="rounded-2xl border border-slate-700 bg-slate-950 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-white">
                            {record.codigoDocumento} · v{record.version}
                          </h3>
                          <StatusPill value={record.estadoDocumento} />
                          <span className="rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-200">
                            {record.tipoDocumento}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-400">
                          {record.tituloDocumento} · {record.proceso}
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
                      <Data label="Propietario" value={record.propietarioProceso} />
                      <Data label="Clasificación" value={record.clasificacion} />
                      <Data label="Riesgo" value={record.nivelRiesgo} />
                      <Data label="Fecha emisión" value={record.fechaEmision} />
                      <Data label="Fecha vigencia" value={record.fechaVigencia} />
                      <Data label="Próxima revisión" value={record.fechaRevision || "Sin registro"} />
                      <Data label="Elaborado por" value={record.elaboradoPor} />
                      <Data label="Revisado por" value={record.revisadoPor} />
                      <Data label="Aprobado por" value={record.aprobadoPor} />
                      <Data label="Entrenamiento" value={record.entrenamientoRequerido} />
                      <Data label="Grupo entrenamiento" value={record.grupoEntrenamiento || "Sin registro"} />
                      <Data label="Ubicación" value={record.ubicacionDocumento} />
                    </div>

                    {(record.cambioVersion || record.evidenciaAprobacion || record.observaciones) && (
                      <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300">
                        {record.cambioVersion && <p><span className="font-bold text-slate-100">Cambio / justificación: </span>{record.cambioVersion}</p>}
                        {record.evidenciaAprobacion && <p className="mt-2"><span className="font-bold text-slate-100">Evidencia aprobación: </span>{record.evidenciaAprobacion}</p>}
                        {record.observaciones && <p className="mt-2"><span className="font-bold text-slate-100">Observaciones: </span>{record.observaciones}</p>}
                      </div>
                    )}

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
      <div className="relative pt-8">
        <span className={`absolute left-8 top-3 h-16 w-16 rounded-full border-2 shadow-2xl ${isSuccess ? "border-emerald-300 bg-emerald-400" : "border-amber-300 bg-amber-400"}`} />
        <span className={`absolute left-24 top-0 h-24 w-24 rounded-full border-2 shadow-2xl ${isSuccess ? "border-emerald-300 bg-emerald-400" : "border-amber-300 bg-amber-400"}`} />
        <span className={`absolute left-48 top-4 h-16 w-16 rounded-full border-2 shadow-2xl ${isSuccess ? "border-emerald-300 bg-emerald-400" : "border-amber-300 bg-amber-400"}`} />

        <section className={`relative overflow-hidden rounded-[2rem] border-2 bg-slate-950 p-6 text-white shadow-2xl ${
          isSuccess ? "border-emerald-300 shadow-emerald-950/60" : "border-amber-300 shadow-amber-950/60"
        }`}>
          <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-30 ${isSuccess ? "bg-emerald-400" : "bg-amber-400"}`} />
          <div className={`absolute -bottom-12 left-10 h-28 w-28 rounded-full opacity-20 ${isSuccess ? "bg-emerald-300" : "bg-amber-300"}`} />

          <div className="relative flex items-start justify-between gap-5">
            <div className="min-w-0 flex-1">
              <div className="flex items-start gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl font-black text-slate-950 shadow-lg ${
                  isSuccess ? "bg-emerald-300" : "bg-amber-300"
                }`}>
                  {isSuccess ? "✓" : "!"}
                </div>

                <div>
                  <p className={`text-xs font-black uppercase tracking-[0.28em] ${
                    isSuccess ? "text-emerald-200" : "text-amber-200"
                  }`}>
                    FloraTrack Cloud Notice
                  </p>
                  <p className="mt-2 text-lg font-black leading-snug text-white md:text-xl">
                    {message}
                  </p>
                </div>
              </div>

              {errors.length > 0 && (
                <div className="mt-5 rounded-3xl border border-white/20 bg-white p-5 text-slate-950 shadow-xl">
                  <p className="text-sm font-black uppercase tracking-wide text-slate-700">
                    Información pendiente antes de guardar
                  </p>

                  <ul className="mt-3 max-h-64 list-disc space-y-2 overflow-auto pl-5 text-sm font-bold leading-relaxed text-slate-950">
                    {errors.map((error) => (
                      <li key={error}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-2xl border border-white/30 bg-white px-4 py-2 text-xs font-black uppercase tracking-wide text-slate-950 shadow-lg transition hover:bg-slate-200"
            >
              Cerrar
            </button>
          </div>
        </section>
      </div>
    </div>
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
    value === "Vigente" || value === "Aprobado"
      ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
      : value === "Obsoleto" || value === "Rechazado"
      ? "border-red-400/40 bg-red-500/10 text-red-200"
      : value === "En revisión" || value === "Pendiente QA" || value === "Borrador"
      ? "border-amber-400/40 bg-amber-500/10 text-amber-200"
      : "border-indigo-400/40 bg-indigo-500/10 text-indigo-200";

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-bold ${className}`}>
      {value || "Sin estado"}
    </span>
  );
}
