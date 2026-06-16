"use client";

import { useEffect, useMemo, useState } from "react";

type CalidadRecord = {
  id: string;
  codigoMuestra: string;
  fecha: string;
  hora: string;
  empresa: string;
  sede: string;
  responsable: string;
  codigoLote: string;
  etapaOrigen: string;
  tipoMuestra: string;
  material: string;
  cantidadMuestra: string;
  unidad: string;
  laboratorio: string;
  tipoAnalisis: string;
  especificacion: string;
  resultado: string;
  veredictoQA: string;
  estadoMuestra: string;
  evidencia: string;
  desviacion: string;
  accionCorrectiva: string;
  observaciones: string;
  creadoEn: string;
  actualizadoEn: string;
};

type FieldConfig = {
  key: keyof CalidadRecord;
  label: string;
  type?: string;
  placeholder?: string;
  kind?: "input" | "select" | "textarea";
  options?: string[];
};

const STORAGE_KEY = "floratrack_calidad_records_v2";

const emptyForm: CalidadRecord = {
  id: "",
  codigoMuestra: "",
  fecha: "",
  hora: "",
  empresa: "",
  sede: "",
  responsable: "",
  codigoLote: "",
  etapaOrigen: "",
  tipoMuestra: "",
  material: "",
  cantidadMuestra: "",
  unidad: "",
  laboratorio: "",
  tipoAnalisis: "",
  especificacion: "",
  resultado: "",
  veredictoQA: "",
  estadoMuestra: "",
  evidencia: "",
  desviacion: "",
  accionCorrectiva: "",
  observaciones: "",
  creadoEn: "",
  actualizadoEn: "",
};

const requiredFields: Array<keyof CalidadRecord> = [
  "codigoMuestra",
  "fecha",
  "hora",
  "empresa",
  "sede",
  "responsable",
  "codigoLote",
  "etapaOrigen",
  "tipoMuestra",
  "material",
  "cantidadMuestra",
  "unidad",
  "laboratorio",
  "tipoAnalisis",
  "veredictoQA",
  "estadoMuestra",
];

const fieldLabels: Record<keyof CalidadRecord, string> = {
  id: "ID",
  codigoMuestra: "Código de muestra",
  fecha: "Fecha",
  hora: "Hora",
  empresa: "Empresa",
  sede: "Sede / predio",
  responsable: "Responsable",
  codigoLote: "Código de lote",
  etapaOrigen: "Etapa de origen",
  tipoMuestra: "Tipo de muestra",
  material: "Material",
  cantidadMuestra: "Cantidad de muestra",
  unidad: "Unidad",
  laboratorio: "Laboratorio",
  tipoAnalisis: "Tipo de análisis",
  especificacion: "Especificación",
  resultado: "Resultado",
  veredictoQA: "Veredicto QA",
  estadoMuestra: "Estado de muestra",
  evidencia: "Evidencia",
  desviacion: "Desviación",
  accionCorrectiva: "Acción correctiva / CAPA",
  observaciones: "Observaciones",
  creadoEn: "Creado en",
  actualizadoEn: "Actualizado en",
};

const fields: FieldConfig[] = [
  { key: "codigoMuestra", label: "Código de muestra *", placeholder: "QC-2026-001" },
  { key: "fecha", label: "Fecha *", type: "date" },
  { key: "hora", label: "Hora *", type: "time" },
  { key: "empresa", label: "Empresa *", placeholder: "Growlifecol S.A.S." },
  { key: "sede", label: "Sede / predio *", placeholder: "Sede principal" },
  { key: "responsable", label: "Responsable QA *", placeholder: "Responsable de calidad" },
  { key: "codigoLote", label: "Código de lote *", placeholder: "INV-2026-001 / REC-2026-001" },
  {
    key: "etapaOrigen",
    label: "Etapa de origen *",
    kind: "select",
    options: [
      "Recepción",
      "Inventario",
      "Propagación",
      "Cultivo",
      "Cosecha",
      "Secado",
      "Postcosecha",
      "Extracción BHO",
      "Bubble Hash",
      "Live Rosin",
      "Producto terminado",
      "Ambiente / superficie",
      "Agua",
      "Insumo crítico",
    ],
  },
  {
    key: "tipoMuestra",
    label: "Tipo de muestra *",
    kind: "select",
    options: [
      "Material vegetal",
      "Flor fresca",
      "Flor seca",
      "Biomasa",
      "Trim",
      "Extracto BHO",
      "Bubble Hash",
      "Live Rosin",
      "Agua",
      "Superficie",
      "Ambiente",
      "Insumo",
      "Producto terminado",
      "Retención",
      "Contramuestra",
    ],
  },
  { key: "material", label: "Material / descripción *", placeholder: "Flor seca, biomasa, clon, extracto, agua..." },
  { key: "cantidadMuestra", label: "Cantidad de muestra *", type: "number", placeholder: "10" },
  {
    key: "unidad",
    label: "Unidad *",
    kind: "select",
    options: ["g", "kg", "mg", "ml", "L", "unidades", "hisopo", "placa", "frasco", "bolsa"],
  },
  { key: "laboratorio", label: "Laboratorio *", placeholder: "Laboratorio interno QA / tercero autorizado" },
  {
    key: "tipoAnalisis",
    label: "Tipo de análisis *",
    kind: "select",
    options: [
      "Potencia cannabinoides",
      "Terpenos",
      "Microbiológico",
      "Metales pesados",
      "Pesticidas",
      "Solventes residuales",
      "Micotoxinas",
      "Humedad",
      "Actividad de agua",
      "Materia extraña",
      "pH",
      "Ambiental",
      "Superficies",
      "Identidad botánica",
      "Estabilidad",
    ],
  },
  { key: "especificacion", label: "Especificación / criterio", placeholder: "Rango, límite o criterio de aceptación" },
  { key: "resultado", label: "Resultado", placeholder: "Pendiente, valor obtenido, cumple/no cumple..." },
  {
    key: "veredictoQA",
    label: "Veredicto QA *",
    kind: "select",
    options: [
      "Pendiente resultado",
      "Cumple",
      "No cumple",
      "Aprobado",
      "Rechazado",
      "Requiere investigación",
      "Requiere remuestreo",
      "Liberado QA",
      "Retenido",
    ],
  },
  {
    key: "estadoMuestra",
    label: "Estado de muestra *",
    kind: "select",
    options: [
      "Tomada",
      "En tránsito",
      "Recibida por laboratorio",
      "En análisis",
      "Analizada",
      "Retenida",
      "Contramuestra almacenada",
      "Rechazada",
      "Destruida",
    ],
  },
  { key: "evidencia", label: "Evidencia / soporte", placeholder: "COA, foto, QR, acta, cadena de custodia..." },
  {
    key: "desviacion",
    label: "Desviación / hallazgo",
    kind: "textarea",
    placeholder: "Describe desviaciones, resultados fuera de especificación o problemas de custodia.",
  },
  {
    key: "accionCorrectiva",
    label: "Acción correctiva / CAPA",
    kind: "textarea",
    placeholder: "Obligatoria si el veredicto no libera el lote.",
  },
  {
    key: "observaciones",
    label: "Observaciones QA",
    kind: "textarea",
    placeholder: "Conclusiones, criterios técnicos, notas de muestreo y trazabilidad.",
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

  return `QC-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function loadRecords(): CalidadRecord[] {
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

function saveRecords(records: CalidadRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export default function CalidadPage() {
  const [records, setRecords] = useState<CalidadRecord[]>([]);
  const [form, setForm] = useState<CalidadRecord>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [search, setSearch] = useState("");
  const [filterQA, setFilterQA] = useState("Todos");

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

  function updateField(field: keyof CalidadRecord, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function validateForm(): string[] {
    const errors = requiredFields
      .filter((field) => isInvalid(form[field]))
      .map((field) => fieldLabels[field]);

    const quantity = Number(form.cantidadMuestra);

    if (!Number.isFinite(quantity) || quantity <= 0) {
      errors.push("La cantidad de muestra debe ser mayor a cero");
    }

    if (
      ["No cumple", "Rechazado", "Retenido", "Requiere investigación", "Requiere remuestreo"].includes(form.veredictoQA) &&
      isInvalid(form.desviacion)
    ) {
      errors.push("La desviación es obligatoria cuando el veredicto QA no libera el lote");
    }

    if (
      ["No cumple", "Rechazado", "Retenido", "Requiere investigación", "Requiere remuestreo"].includes(form.veredictoQA) &&
      isInvalid(form.accionCorrectiva)
    ) {
      errors.push("La acción correctiva / CAPA es obligatoria cuando el veredicto QA no libera el lote");
    }

    return Array.from(new Set(errors));
  }

  function fieldHasError(field: keyof CalidadRecord): boolean {
    if (!submitAttempted) return false;

    if (requiredFields.includes(field) && isInvalid(form[field])) return true;

    if (field === "cantidadMuestra") {
      const quantity = Number(form.cantidadMuestra);
      return !Number.isFinite(quantity) || quantity <= 0;
    }

    if (
      field === "desviacion" &&
      ["No cumple", "Rechazado", "Retenido", "Requiere investigación", "Requiere remuestreo"].includes(form.veredictoQA) &&
      isInvalid(form.desviacion)
    ) {
      return true;
    }

    if (
      field === "accionCorrectiva" &&
      ["No cumple", "Rechazado", "Retenido", "Requiere investigación", "Requiere remuestreo"].includes(form.veredictoQA) &&
      isInvalid(form.accionCorrectiva)
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
      showToast("No se guardó la muestra. Completa los campos obligatorios.", errors);
      return;
    }

    const timestamp = nowIso();

    const payload: CalidadRecord = {
      ...form,
      codigoMuestra: clean(form.codigoMuestra),
      fecha: clean(form.fecha),
      hora: clean(form.hora),
      empresa: clean(form.empresa),
      sede: clean(form.sede),
      responsable: clean(form.responsable),
      codigoLote: clean(form.codigoLote),
      etapaOrigen: clean(form.etapaOrigen),
      tipoMuestra: clean(form.tipoMuestra),
      material: clean(form.material),
      cantidadMuestra: clean(form.cantidadMuestra),
      unidad: clean(form.unidad),
      laboratorio: clean(form.laboratorio),
      tipoAnalisis: clean(form.tipoAnalisis),
      especificacion: clean(form.especificacion),
      resultado: clean(form.resultado),
      veredictoQA: clean(form.veredictoQA),
      estadoMuestra: clean(form.estadoMuestra),
      evidencia: clean(form.evidencia),
      desviacion: clean(form.desviacion),
      accionCorrectiva: clean(form.accionCorrectiva),
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
        ? "Registro QA actualizado correctamente."
        : "Muestra QA registrada correctamente con trazabilidad GACP/GMP."
    );
  }

  function handleEdit(record: CalidadRecord) {
    setForm(record);
    setEditingId(record.id);
    setSubmitAttempted(false);
    showToast("Registro cargado para edición.");
  }

  function handleDelete(id: string) {
    const confirmed = window.confirm(
      "¿Confirmas eliminar este registro? En ambiente GMP real esto debería manejarse como anulación auditada."
    );

    if (!confirmed) return;

    const nextRecords = records.filter((record) => record.id !== id);
    setRecords(nextRecords);
    saveRecords(nextRecords);
    showToast("Registro eliminado del almacenamiento local.");
  }

  function exportJson() {
    if (records.length === 0) {
      showToast("No hay registros QA para exportar.");
      return;
    }

    const blob = new Blob([JSON.stringify(records, null, 2)], {
      type: "application/json;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `floratrack-calidad-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);

    showToast("Archivo JSON de calidad exportado correctamente.");
  }

  const filteredRecords = useMemo(() => {
    const term = clean(search).toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        !term ||
        [
          record.codigoMuestra,
          record.codigoLote,
          record.empresa,
          record.sede,
          record.responsable,
          record.etapaOrigen,
          record.tipoMuestra,
          record.material,
          record.laboratorio,
          record.tipoAnalisis,
          record.veredictoQA,
          record.estadoMuestra,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

      const matchesQA = filterQA === "Todos" || record.veredictoQA === filterQA;

      return matchesSearch && matchesQA;
    });
  }, [records, search, filterQA]);

  const dashboard = useMemo(() => {
    return {
      total: records.length,
      cumple: records.filter((record) =>
        ["Cumple", "Aprobado", "Liberado QA"].includes(record.veredictoQA)
      ).length,
      pendientes: records.filter((record) =>
        ["Pendiente resultado", "Requiere remuestreo"].includes(record.veredictoQA)
      ).length,
      investigacion: records.filter((record) =>
        ["No cumple", "Rechazado", "Retenido", "Requiere investigación"].includes(record.veredictoQA)
      ).length,
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
        <header className="rounded-3xl border border-violet-400/20 bg-slate-900/80 p-6 shadow-2xl shadow-violet-950/30">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-violet-300">
            FloraTrack Enterprise Compliance Platform
          </p>

          <h1 className="mt-3 text-3xl font-black text-white md:text-5xl">
            Control de calidad y muestreo QA
          </h1>

          <p className="mt-3 max-w-5xl text-sm leading-6 text-slate-300 md:text-base">
            Registro electrónico de muestras, análisis, laboratorio, especificaciones,
            resultados, veredicto QA, desviaciones, CAPA, evidencia y trazabilidad integral.
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

        <section className="grid gap-4 md:grid-cols-4">
          <Metric title="Muestras" value={dashboard.total} />
          <Metric title="Cumplen / liberadas" value={dashboard.cumple} tone="emerald" />
          <Metric title="Pendientes" value={dashboard.pendientes} tone="amber" />
          <Metric title="Investigación / rechazo" value={dashboard.investigacion} tone="red" />
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
                  {editingId ? "Editar muestra" : "Nueva muestra QA"}
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Ningún registro de calidad puede guardarse vacío o incompleto.
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
                  : "border-slate-700 bg-slate-950 focus:border-violet-400 focus:ring-4 focus:ring-violet-400/40";

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
                      {hasError && <p className="mt-1 text-xs font-bold text-red-300">Campo obligatorio o condición QA requerida.</p>}
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
              <button
                type="submit"
                className="rounded-2xl bg-violet-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-violet-950/50 transition hover:bg-violet-400"
              >
                {editingId ? "Actualizar muestra" : "Guardar muestra QA"}
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
                <h2 className="text-2xl font-black text-white">Registro maestro QA</h2>
                <p className="mt-1 text-sm text-slate-400">
                  Consulta, filtra, edita y exporta la trazabilidad de calidad.
                </p>
              </div>

              <button
                type="button"
                onClick={exportJson}
                className="rounded-2xl border border-violet-400/50 px-5 py-3 text-sm font-bold text-violet-200 transition hover:bg-violet-500/10"
              >
                Exportar JSON
              </button>
            </div>

            <div className="mb-5 grid gap-3 md:grid-cols-[1fr_230px]">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-violet-400/40 transition placeholder:text-slate-600 focus:border-violet-400 focus:ring-4"
                placeholder="Buscar por muestra, lote, análisis, laboratorio..."
              />

              <select
                value={filterQA}
                onChange={(event) => setFilterQA(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-violet-400/40 transition focus:border-violet-400 focus:ring-4"
              >
                <option>Todos</option>
                <option>Pendiente resultado</option>
                <option>Cumple</option>
                <option>No cumple</option>
                <option>Aprobado</option>
                <option>Rechazado</option>
                <option>Requiere investigación</option>
                <option>Requiere remuestreo</option>
                <option>Liberado QA</option>
                <option>Retenido</option>
              </select>
            </div>

            <div className="max-h-[780px] space-y-4 overflow-auto pr-2">
              {filteredRecords.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center text-sm text-slate-400">
                  No hay registros QA para mostrar. Crea la primera muestra con datos completos.
                </div>
              ) : (
                filteredRecords.map((record) => (
                  <article key={record.id} className="rounded-2xl border border-slate-700 bg-slate-950 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-white">{record.codigoMuestra}</h3>
                          <StatusPill value={record.veredictoQA} />
                          <span className="rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs font-bold text-sky-200">
                            {record.tipoAnalisis}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-400">
                          {record.fecha} · {record.hora} · Lote {record.codigoLote}
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
                      <Data label="Responsable" value={record.responsable} />
                      <Data label="Origen" value={record.etapaOrigen} />
                      <Data label="Tipo muestra" value={record.tipoMuestra} />
                      <Data label="Material" value={record.material} />
                      <Data label="Cantidad" value={`${record.cantidadMuestra} ${record.unidad}`} />
                      <Data label="Laboratorio" value={record.laboratorio} />
                      <Data label="Especificación" value={record.especificacion || "Sin registro"} />
                      <Data label="Resultado" value={record.resultado || "Pendiente"} />
                      <Data label="Estado muestra" value={record.estadoMuestra} />
                      <Data label="Evidencia" value={record.evidencia || "Sin registro"} />
                    </div>

                    {(record.desviacion || record.accionCorrectiva || record.observaciones) && (
                      <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300">
                        {record.desviacion && <p><span className="font-bold text-slate-100">Desviación: </span>{record.desviacion}</p>}
                        {record.accionCorrectiva && <p className="mt-2"><span className="font-bold text-slate-100">CAPA: </span>{record.accionCorrectiva}</p>}
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
    value === "Cumple" || value === "Aprobado" || value === "Liberado QA"
      ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
      : value === "No cumple" || value === "Rechazado"
      ? "border-red-400/30 bg-red-500/10 text-red-200"
      : value === "Retenido" || value === "Requiere investigación" || value === "Requiere remuestreo"
      ? "border-amber-400/30 bg-amber-500/10 text-amber-200"
      : "border-violet-400/30 bg-violet-500/10 text-violet-200";

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-bold ${className}`}>
      {value || "Sin veredicto"}
    </span>
  );
}
