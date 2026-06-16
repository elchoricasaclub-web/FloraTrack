"use client";

import { useEffect, useMemo, useState } from "react";

type TrainingRecord = {
  id: string;
  codigoEntrenamiento: string;
  fecha: string;
  hora: string;
  empresa: string;
  sede: string;
  colaborador: string;
  identificacion: string;
  cargo: string;
  area: string;
  tipoEntrenamiento: string;
  documentoRelacionado: string;
  versionDocumento: string;
  tema: string;
  instructor: string;
  modalidad: string;
  duracionHoras: string;
  metodoEvaluacion: string;
  resultadoEvaluacion: string;
  puntaje: string;
  competencia: string;
  requiereReentrenamiento: string;
  fechaReentrenamiento: string;
  aprobacionQA: string;
  evidencia: string;
  planAccion: string;
  observaciones: string;
  creadoEn: string;
  actualizadoEn: string;
};

type FieldConfig = {
  key: keyof TrainingRecord;
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

const STORAGE_KEY = "floratrack_entrenamiento_records_v1";

const emptyForm: TrainingRecord = {
  id: "",
  codigoEntrenamiento: "",
  fecha: "",
  hora: "",
  empresa: "",
  sede: "",
  colaborador: "",
  identificacion: "",
  cargo: "",
  area: "",
  tipoEntrenamiento: "",
  documentoRelacionado: "",
  versionDocumento: "",
  tema: "",
  instructor: "",
  modalidad: "",
  duracionHoras: "",
  metodoEvaluacion: "",
  resultadoEvaluacion: "",
  puntaje: "",
  competencia: "",
  requiereReentrenamiento: "",
  fechaReentrenamiento: "",
  aprobacionQA: "",
  evidencia: "",
  planAccion: "",
  observaciones: "",
  creadoEn: "",
  actualizadoEn: "",
};

const requiredFields: Array<keyof TrainingRecord> = [
  "codigoEntrenamiento",
  "fecha",
  "hora",
  "empresa",
  "sede",
  "colaborador",
  "cargo",
  "area",
  "tipoEntrenamiento",
  "documentoRelacionado",
  "versionDocumento",
  "tema",
  "instructor",
  "modalidad",
  "duracionHoras",
  "metodoEvaluacion",
  "resultadoEvaluacion",
  "competencia",
  "requiereReentrenamiento",
  "aprobacionQA",
];

const fieldLabels: Record<keyof TrainingRecord, string> = {
  id: "ID",
  codigoEntrenamiento: "Código de entrenamiento",
  fecha: "Fecha",
  hora: "Hora",
  empresa: "Empresa",
  sede: "Sede / predio",
  colaborador: "Colaborador",
  identificacion: "Identificación",
  cargo: "Cargo",
  area: "Área",
  tipoEntrenamiento: "Tipo de entrenamiento",
  documentoRelacionado: "Documento / SOP relacionado",
  versionDocumento: "Versión documental",
  tema: "Tema",
  instructor: "Instructor",
  modalidad: "Modalidad",
  duracionHoras: "Duración en horas",
  metodoEvaluacion: "Método de evaluación",
  resultadoEvaluacion: "Resultado de evaluación",
  puntaje: "Puntaje",
  competencia: "Competencia",
  requiereReentrenamiento: "Requiere reentrenamiento",
  fechaReentrenamiento: "Fecha de reentrenamiento",
  aprobacionQA: "Aprobación QA",
  evidencia: "Evidencia",
  planAccion: "Plan de acción",
  observaciones: "Observaciones",
  creadoEn: "Creado en",
  actualizadoEn: "Actualizado en",
};

const fields: FieldConfig[] = [
  { key: "codigoEntrenamiento", label: "Código de entrenamiento *", placeholder: "TRN-2026-001" },
  { key: "fecha", label: "Fecha *", type: "date" },
  { key: "hora", label: "Hora *", type: "time" },
  { key: "empresa", label: "Empresa *", placeholder: "Growlifecol S.A.S." },
  { key: "sede", label: "Sede / predio *", placeholder: "Sede principal / laboratorio / cultivo" },
  { key: "colaborador", label: "Colaborador *", placeholder: "Nombre completo del colaborador" },
  { key: "identificacion", label: "Identificación", placeholder: "CC / ID interno / código empleado" },
  { key: "cargo", label: "Cargo *", placeholder: "Auxiliar QA, técnico de cultivo, analista QC..." },
  {
    key: "area",
    label: "Área *",
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
      "Limpieza y saneamiento",
      "Mantenimiento",
      "Regulatorio",
      "Auditorías",
      "CAPA",
      "Documentación",
      "Almacén",
    ],
  },
  {
    key: "tipoEntrenamiento",
    label: "Tipo de entrenamiento *",
    kind: "select",
    options: [
      "Inducción",
      "Entrenamiento inicial SOP",
      "Reentrenamiento",
      "Actualización documental",
      "Entrenamiento GMP",
      "Entrenamiento GACP",
      "Seguridad y salud",
      "Limpieza y saneamiento",
      "Trazabilidad",
      "Desviaciones / CAPA",
      "Auditoría interna",
      "Operación de equipo",
      "Extracción",
      "Micropropagación",
      "Buenas prácticas documentales",
    ],
  },
  { key: "documentoRelacionado", label: "Documento / SOP relacionado *", placeholder: "SOP-QA-001 / FRM-QA-001" },
  { key: "versionDocumento", label: "Versión documental *", placeholder: "1.0" },
  { key: "tema", label: "Tema *", placeholder: "Control documental, limpieza, trazabilidad, inventario..." },
  { key: "instructor", label: "Instructor *", placeholder: "Nombre del instructor / responsable técnico" },
  {
    key: "modalidad",
    label: "Modalidad *",
    kind: "select",
    options: ["Presencial", "Virtual", "Mixta", "Práctica supervisada", "Lectura controlada", "Evaluación en puesto"],
  },
  { key: "duracionHoras", label: "Duración en horas *", type: "number", placeholder: "2" },
  {
    key: "metodoEvaluacion",
    label: "Método de evaluación *",
    kind: "select",
    options: [
      "Cuestionario",
      "Evaluación práctica",
      "Observación directa",
      "Lectura y comprensión",
      "Firma de asistencia",
      "Evaluación oral",
      "No aplica por inducción",
    ],
  },
  {
    key: "resultadoEvaluacion",
    label: "Resultado de evaluación *",
    kind: "select",
    options: ["Aprobado", "Reprobado", "Pendiente evaluación", "Requiere refuerzo", "No aplica"],
  },
  { key: "puntaje", label: "Puntaje", type: "number", placeholder: "85" },
  {
    key: "competencia",
    label: "Competencia *",
    kind: "select",
    options: ["Competente", "Competente con supervisión", "No competente", "Pendiente verificación"],
  },
  {
    key: "requiereReentrenamiento",
    label: "Requiere reentrenamiento *",
    kind: "select",
    options: ["Sí", "No"],
  },
  { key: "fechaReentrenamiento", label: "Fecha de reentrenamiento", type: "date" },
  {
    key: "aprobacionQA",
    label: "Aprobación QA *",
    kind: "select",
    options: ["Pendiente QA", "Aprobado QA", "Rechazado QA", "Requiere evidencia adicional"],
  },
  { key: "evidencia", label: "Evidencia / soporte", placeholder: "Lista de asistencia, evaluación, firma, acta, QR, enlace documental..." },
  {
    key: "planAccion",
    label: "Plan de acción",
    kind: "textarea",
    placeholder: "Obligatorio si reprobó, no es competente o requiere reentrenamiento.",
  },
  {
    key: "observaciones",
    label: "Observaciones",
    kind: "textarea",
    placeholder: "Notas del instructor, seguimiento, restricciones operativas, liberación para ejecutar proceso.",
  },
];

function clean(value: unknown): string {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function isInvalid(value: unknown): boolean {
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
  ].includes(clean(value).toLowerCase());
}

function safeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `TRN-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function loadRecords(): TrainingRecord[] {
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

function saveRecords(records: TrainingRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export default function EntrenamientoPage() {
  const [records, setRecords] = useState<TrainingRecord[]>([]);
  const [form, setForm] = useState<TrainingRecord>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [cloud, setCloud] = useState<CloudState | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [search, setSearch] = useState("");
  const [filterResultado, setFilterResultado] = useState("Todos");

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

  function updateField(field: keyof TrainingRecord, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function validateForm(): string[] {
    const errors = requiredFields
      .filter((field) => isInvalid(form[field]))
      .map((field) => fieldLabels[field]);

    const duration = Number(form.duracionHoras);

    if (!Number.isFinite(duration) || duration <= 0) {
      errors.push("La duración debe ser mayor a cero");
    }

    if (form.puntaje) {
      const score = Number(form.puntaje);

      if (!Number.isFinite(score) || score < 0 || score > 100) {
        errors.push("El puntaje debe estar entre 0 y 100");
      }
    }

    if (
      ["Aprobado", "Reprobado", "Requiere refuerzo"].includes(form.resultadoEvaluacion) &&
      isInvalid(form.puntaje)
    ) {
      errors.push("El puntaje es obligatorio cuando existe resultado de evaluación");
    }

    if (
      ["Aprobado QA", "Rechazado QA"].includes(form.aprobacionQA) &&
      isInvalid(form.evidencia)
    ) {
      errors.push("La evidencia es obligatoria cuando QA aprueba o rechaza el entrenamiento");
    }

    if (
      form.requiereReentrenamiento === "Sí" &&
      isInvalid(form.fechaReentrenamiento)
    ) {
      errors.push("La fecha de reentrenamiento es obligatoria cuando se requiere reentrenamiento");
    }

    if (
      form.requiereReentrenamiento === "Sí" &&
      isInvalid(form.planAccion)
    ) {
      errors.push("El plan de acción es obligatorio cuando se requiere reentrenamiento");
    }

    if (
      ["Reprobado", "Requiere refuerzo"].includes(form.resultadoEvaluacion) &&
      isInvalid(form.planAccion)
    ) {
      errors.push("El plan de acción es obligatorio si el resultado no es satisfactorio");
    }

    if (
      ["No competente", "Competente con supervisión", "Pendiente verificación"].includes(form.competencia) &&
      isInvalid(form.planAccion)
    ) {
      errors.push("El plan de acción es obligatorio cuando la competencia no queda completamente liberada");
    }

    return Array.from(new Set(errors));
  }

  function fieldHasError(field: keyof TrainingRecord): boolean {
    if (!submitAttempted) return false;

    if (requiredFields.includes(field) && isInvalid(form[field])) return true;

    if (field === "duracionHoras") {
      const duration = Number(form.duracionHoras);
      return !Number.isFinite(duration) || duration <= 0;
    }

    if (field === "puntaje") {
      if (["Aprobado", "Reprobado", "Requiere refuerzo"].includes(form.resultadoEvaluacion) && isInvalid(form.puntaje)) return true;

      if (form.puntaje) {
        const score = Number(form.puntaje);
        return !Number.isFinite(score) || score < 0 || score > 100;
      }
    }

    if (
      field === "evidencia" &&
      ["Aprobado QA", "Rechazado QA"].includes(form.aprobacionQA) &&
      isInvalid(form.evidencia)
    ) {
      return true;
    }

    if (
      field === "fechaReentrenamiento" &&
      form.requiereReentrenamiento === "Sí" &&
      isInvalid(form.fechaReentrenamiento)
    ) {
      return true;
    }

    if (
      field === "planAccion" &&
      (
        form.requiereReentrenamiento === "Sí" ||
        ["Reprobado", "Requiere refuerzo"].includes(form.resultadoEvaluacion) ||
        ["No competente", "Competente con supervisión", "Pendiente verificación"].includes(form.competencia)
      ) &&
      isInvalid(form.planAccion)
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
    setCloud(null);
  }

  function handleSave() {
    setSubmitAttempted(true);

    const errors = validateForm();

    if (errors.length > 0) {
      showCloud("No se guardó el entrenamiento. Completa la información obligatoria.", errors, "warning");
      return;
    }

    const timestamp = nowIso();

    const payload: TrainingRecord = {
      ...form,
      codigoEntrenamiento: clean(form.codigoEntrenamiento),
      fecha: clean(form.fecha),
      hora: clean(form.hora),
      empresa: clean(form.empresa),
      sede: clean(form.sede),
      colaborador: clean(form.colaborador),
      identificacion: clean(form.identificacion),
      cargo: clean(form.cargo),
      area: clean(form.area),
      tipoEntrenamiento: clean(form.tipoEntrenamiento),
      documentoRelacionado: clean(form.documentoRelacionado),
      versionDocumento: clean(form.versionDocumento),
      tema: clean(form.tema),
      instructor: clean(form.instructor),
      modalidad: clean(form.modalidad),
      duracionHoras: clean(form.duracionHoras),
      metodoEvaluacion: clean(form.metodoEvaluacion),
      resultadoEvaluacion: clean(form.resultadoEvaluacion),
      puntaje: clean(form.puntaje),
      competencia: clean(form.competencia),
      requiereReentrenamiento: clean(form.requiereReentrenamiento),
      fechaReentrenamiento: clean(form.fechaReentrenamiento),
      aprobacionQA: clean(form.aprobacionQA),
      evidencia: clean(form.evidencia),
      planAccion: clean(form.planAccion),
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
      editingId
        ? "Entrenamiento actualizado correctamente con trazabilidad."
        : "Entrenamiento registrado correctamente con control GMP/GACP.",
      [],
      "success"
    );
  }

  function handleEdit(record: TrainingRecord) {
    setForm(record);
    setEditingId(record.id);
    setSubmitAttempted(false);
    showCloud("Entrenamiento cargado para edición. Verifica antes de actualizar.", [], "success");
  }

  function handleDelete(id: string) {
    const confirmed = window.confirm(
      "¿Confirmas eliminar este entrenamiento? En ambiente GMP real debería manejarse como anulación auditada."
    );

    if (!confirmed) return;

    const nextRecords = records.filter((record) => record.id !== id);
    setRecords(nextRecords);
    saveRecords(nextRecords);
    showCloud("Entrenamiento eliminado del almacenamiento local.", [], "success");
  }

  function exportJson() {
    if (records.length === 0) {
      showCloud("No hay entrenamientos para exportar.", [], "warning");
      return;
    }

    const blob = new Blob([JSON.stringify(records, null, 2)], {
      type: "application/json;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `floratrack-entrenamiento-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);

    showCloud("Archivo JSON de entrenamiento exportado correctamente.", [], "success");
  }

  const filteredRecords = useMemo(() => {
    const term = clean(search).toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        !term ||
        [
          record.codigoEntrenamiento,
          record.colaborador,
          record.cargo,
          record.area,
          record.tipoEntrenamiento,
          record.documentoRelacionado,
          record.tema,
          record.instructor,
          record.resultadoEvaluacion,
          record.competencia,
          record.aprobacionQA,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

      const matchesResultado =
        filterResultado === "Todos" || record.resultadoEvaluacion === filterResultado;

      return matchesSearch && matchesResultado;
    });
  }, [records, search, filterResultado]);

  const dashboard = useMemo(() => {
    return {
      total: records.length,
      aprobados: records.filter((record) => record.resultadoEvaluacion === "Aprobado").length,
      competentes: records.filter((record) => record.competencia === "Competente").length,
      reentrenamiento: records.filter((record) => record.requiereReentrenamiento === "Sí").length,
      pendienteQA: records.filter((record) => record.aprobacionQA === "Pendiente QA").length,
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
        <header className="rounded-3xl border border-cyan-400/20 bg-slate-900/80 p-6 shadow-2xl shadow-cyan-950/30">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">
                FloraTrack Enterprise Compliance Platform
              </p>

              <h1 className="mt-3 text-3xl font-black text-white md:text-5xl">
                Entrenamiento y competencia GMP/GACP
              </h1>

              <p className="mt-3 max-w-5xl text-sm leading-6 text-slate-300 md:text-base">
                Control de entrenamiento por colaborador, SOP, versión documental,
                instructor, evaluación, competencia, evidencia, aprobación QA y reentrenamiento.
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-5 py-4 text-sm text-cyan-100">
              <p className="font-bold">Competencia activa</p>
              <p className="mt-1 text-cyan-200">
                SOP · Personal · Evaluación · Reentrenamiento · QA
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
          <Metric title="Entrenamientos" value={dashboard.total} />
          <Metric title="Aprobados" value={dashboard.aprobados} tone="emerald" />
          <Metric title="Competentes" value={dashboard.competentes} tone="sky" />
          <Metric title="Reentrenamiento" value={dashboard.reentrenamiento} tone="amber" />
          <Metric title="Pendiente QA" value={dashboard.pendienteQA} tone="red" />
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
                  {editingId ? "Editar entrenamiento" : "Nuevo entrenamiento"}
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Ningún entrenamiento puede guardarse vacío o incompleto.
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
                  : "border-slate-700 bg-slate-950 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/40";

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
                          Campo obligatorio o condición de competencia requerida.
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
                type="button"
                onClick={handleSave}
                className="rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-black text-slate-950 shadow-lg shadow-cyan-950/50 transition hover:bg-cyan-400"
              >
                {editingId ? "Actualizar entrenamiento" : "Guardar entrenamiento"}
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
                  Matriz de entrenamiento
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Consulta, filtra, edita y exporta entrenamientos y competencia.
                </p>
              </div>

              <button
                type="button"
                onClick={exportJson}
                className="rounded-2xl border border-cyan-400/50 px-5 py-3 text-sm font-bold text-cyan-200 transition hover:bg-cyan-500/10"
              >
                Exportar JSON
              </button>
            </div>

            <div className="mb-5 grid gap-3 md:grid-cols-[1fr_230px]">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-cyan-400/40 transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-4"
                placeholder="Buscar por colaborador, SOP, cargo, área, instructor..."
              />

              <select
                value={filterResultado}
                onChange={(event) => setFilterResultado(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-cyan-400/40 transition focus:border-cyan-400 focus:ring-4"
              >
                <option>Todos</option>
                <option>Aprobado</option>
                <option>Reprobado</option>
                <option>Pendiente evaluación</option>
                <option>Requiere refuerzo</option>
                <option>No aplica</option>
              </select>
            </div>

            <div className="max-h-[780px] space-y-4 overflow-auto pr-2">
              {filteredRecords.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center text-sm text-slate-400">
                  No hay entrenamientos registrados. Crea el primer registro con datos completos.
                </div>
              ) : (
                filteredRecords.map((record) => (
                  <article key={record.id} className="rounded-2xl border border-slate-700 bg-slate-950 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-white">
                            {record.codigoEntrenamiento}
                          </h3>
                          <StatusPill value={record.resultadoEvaluacion} />
                          <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-200">
                            {record.competencia}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-400">
                          {record.fecha} · {record.hora} · {record.colaborador}
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
                      <Data label="Cargo" value={record.cargo} />
                      <Data label="Área" value={record.area} />
                      <Data label="Tipo" value={record.tipoEntrenamiento} />
                      <Data label="Documento" value={`${record.documentoRelacionado} v${record.versionDocumento}`} />
                      <Data label="Tema" value={record.tema} />
                      <Data label="Instructor" value={record.instructor} />
                      <Data label="Modalidad" value={record.modalidad} />
                      <Data label="Duración" value={`${record.duracionHoras} horas`} />
                      <Data label="Evaluación" value={record.metodoEvaluacion} />
                      <Data label="Puntaje" value={record.puntaje || "Sin registro"} />
                      <Data label="Reentrenamiento" value={record.requiereReentrenamiento} />
                      <Data label="Aprobación QA" value={record.aprobacionQA} />
                      <Data label="Fecha reentrenamiento" value={record.fechaReentrenamiento || "Sin registro"} />
                      <Data label="Evidencia" value={record.evidencia || "Sin registro"} />
                    </div>

                    {(record.planAccion || record.observaciones) && (
                      <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300">
                        {record.planAccion && (
                          <p>
                            <span className="font-bold text-slate-100">Plan de acción: </span>
                            {record.planAccion}
                          </p>
                        )}

                        {record.observaciones && (
                          <p className="mt-2">
                            <span className="font-bold text-slate-100">Observaciones: </span>
                            {record.observaciones}
                          </p>
                        )}
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
    value === "Aprobado"
      ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
      : value === "Reprobado"
      ? "border-red-400/40 bg-red-500/10 text-red-200"
      : value === "Requiere refuerzo"
      ? "border-amber-400/40 bg-amber-500/10 text-amber-200"
      : "border-cyan-400/40 bg-cyan-500/10 text-cyan-200";

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-bold ${className}`}>
      {value || "Sin resultado"}
    </span>
  );
}
