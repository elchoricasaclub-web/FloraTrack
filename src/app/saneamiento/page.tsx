"use client";

import { useEffect, useMemo, useState } from "react";

type CleaningRecord = {
  id: string;
  codigoLimpieza: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  empresa: string;
  sede: string;
  area: string;
  ubicacion: string;
  equipoArea: string;
  tipoLimpieza: string;
  procedimientoSOP: string;
  versionSOP: string;
  productoLimpieza: string;
  loteProducto: string;
  concentracion: string;
  responsableEjecucion: string;
  responsableVerificacion: string;
  estadoPreoperacional: string;
  resultadoInspeccion: string;
  requiereHisopado: string;
  codigoMuestra: string;
  liberacionQA: string;
  desviacionAsociada: string;
  accionCorrectiva: string;
  evidencia: string;
  observaciones: string;
  creadoEn: string;
  actualizadoEn: string;
};

type FieldConfig = {
  key: keyof CleaningRecord;
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

const STORAGE_KEY = "floratrack_limpieza_saneamiento_records_v1";

const emptyForm: CleaningRecord = {
  id: "",
  codigoLimpieza: "",
  fecha: "",
  horaInicio: "",
  horaFin: "",
  empresa: "",
  sede: "",
  area: "",
  ubicacion: "",
  equipoArea: "",
  tipoLimpieza: "",
  procedimientoSOP: "",
  versionSOP: "",
  productoLimpieza: "",
  loteProducto: "",
  concentracion: "",
  responsableEjecucion: "",
  responsableVerificacion: "",
  estadoPreoperacional: "",
  resultadoInspeccion: "",
  requiereHisopado: "",
  codigoMuestra: "",
  liberacionQA: "",
  desviacionAsociada: "",
  accionCorrectiva: "",
  evidencia: "",
  observaciones: "",
  creadoEn: "",
  actualizadoEn: "",
};

const requiredFields: Array<keyof CleaningRecord> = [
  "codigoLimpieza",
  "fecha",
  "horaInicio",
  "horaFin",
  "empresa",
  "sede",
  "area",
  "ubicacion",
  "equipoArea",
  "tipoLimpieza",
  "procedimientoSOP",
  "versionSOP",
  "productoLimpieza",
  "loteProducto",
  "concentracion",
  "responsableEjecucion",
  "responsableVerificacion",
  "estadoPreoperacional",
  "resultadoInspeccion",
  "requiereHisopado",
  "liberacionQA",
];

const fieldLabels: Record<keyof CleaningRecord, string> = {
  id: "ID",
  codigoLimpieza: "Código de limpieza",
  fecha: "Fecha",
  horaInicio: "Hora de inicio",
  horaFin: "Hora de finalización",
  empresa: "Empresa",
  sede: "Sede / predio",
  area: "Área",
  ubicacion: "Ubicación",
  equipoArea: "Equipo / área limpiada",
  tipoLimpieza: "Tipo de limpieza",
  procedimientoSOP: "SOP aplicado",
  versionSOP: "Versión SOP",
  productoLimpieza: "Producto de limpieza",
  loteProducto: "Lote del producto",
  concentracion: "Concentración",
  responsableEjecucion: "Responsable de ejecución",
  responsableVerificacion: "Responsable de verificación",
  estadoPreoperacional: "Estado preoperacional",
  resultadoInspeccion: "Resultado de inspección",
  requiereHisopado: "Requiere hisopado / muestra",
  codigoMuestra: "Código de muestra",
  liberacionQA: "Liberación QA",
  desviacionAsociada: "Desviación asociada",
  accionCorrectiva: "Acción correctiva / CAPA",
  evidencia: "Evidencia",
  observaciones: "Observaciones",
  creadoEn: "Creado en",
  actualizadoEn: "Actualizado en",
};

const fields: FieldConfig[] = [
  { key: "codigoLimpieza", label: "Código de limpieza *", placeholder: "SAN-2026-001" },
  { key: "fecha", label: "Fecha *", type: "date" },
  { key: "horaInicio", label: "Hora de inicio *", type: "time" },
  { key: "horaFin", label: "Hora de finalización *", type: "time" },
  { key: "empresa", label: "Empresa *", placeholder: "Growlifecol S.A.S." },
  { key: "sede", label: "Sede / predio *", placeholder: "Sede principal" },
  {
    key: "area",
    label: "Área *",
    kind: "select",
    options: [
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
      "Almacén",
      "Vestieres",
      "Áreas comunes",
    ],
  },
  { key: "ubicacion", label: "Ubicación *", placeholder: "Sala, cuarto, línea, invernadero, laboratorio..." },
  { key: "equipoArea", label: "Equipo / área limpiada *", placeholder: "Mesa inox, extractor, cuarto frío, cabina, piso, pared..." },
  {
    key: "tipoLimpieza",
    label: "Tipo de limpieza *",
    kind: "select",
    options: [
      "Rutinaria",
      "Preoperacional",
      "Postoperacional",
      "Profunda",
      "Cambio de lote",
      "Cambio de producto",
      "Correctiva",
      "Validación de limpieza",
      "Limpieza de equipo",
      "Limpieza de área",
      "Desinfección",
    ],
  },
  { key: "procedimientoSOP", label: "SOP aplicado *", placeholder: "SOP-SAN-001" },
  { key: "versionSOP", label: "Versión SOP *", placeholder: "1.0" },
  { key: "productoLimpieza", label: "Producto de limpieza *", placeholder: "Alcohol 70%, amonio cuaternario, detergente neutro..." },
  { key: "loteProducto", label: "Lote del producto *", placeholder: "LOT-SAN-001" },
  { key: "concentracion", label: "Concentración *", placeholder: "70%, 200 ppm, 1:100..." },
  { key: "responsableEjecucion", label: "Responsable de ejecución *", placeholder: "Operario / técnico responsable" },
  { key: "responsableVerificacion", label: "Responsable de verificación *", placeholder: "QA / supervisor / responsable de área" },
  {
    key: "estadoPreoperacional",
    label: "Estado preoperacional *",
    kind: "select",
    options: [
      "Pendiente verificación",
      "Apto para uso",
      "No apto para uso",
      "Requiere recleaning",
      "Retenido QA",
      "Liberado QA",
    ],
  },
  {
    key: "resultadoInspeccion",
    label: "Resultado de inspección *",
    kind: "select",
    options: [
      "Conforme",
      "Con observación",
      "No conforme",
      "Pendiente resultado",
      "Requiere hisopado",
      "Requiere repetición",
    ],
  },
  {
    key: "requiereHisopado",
    label: "Requiere hisopado / muestra *",
    kind: "select",
    options: ["Sí", "No"],
  },
  { key: "codigoMuestra", label: "Código de muestra", placeholder: "QC-SAN-2026-001" },
  {
    key: "liberacionQA",
    label: "Liberación QA *",
    kind: "select",
    options: [
      "Pendiente QA",
      "Liberado QA",
      "Retenido QA",
      "Rechazado QA",
      "Requiere desviación",
      "Requiere CAPA",
    ],
  },
  { key: "desviacionAsociada", label: "Desviación asociada", placeholder: "DEV-2026-001 / CAPA-001" },
  {
    key: "accionCorrectiva",
    label: "Acción correctiva / CAPA",
    kind: "textarea",
    placeholder: "Obligatoria si hay no conformidad, retención QA, rechazo, recleaning o CAPA.",
  },
  { key: "evidencia", label: "Evidencia / soporte", placeholder: "Foto, checklist, QR, registro, hisopado, COA, acta..." },
  {
    key: "observaciones",
    label: "Observaciones",
    kind: "textarea",
    placeholder: "Notas QA, condiciones, restricciones, hallazgos, seguimiento o liberación.",
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
    "ninguno",
    "null",
    "undefined",
  ].includes(clean(value).toLowerCase());
}

function safeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `SAN-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function timeToMinutes(value: string): number | null {
  if (!value || !value.includes(":")) return null;

  const [hoursRaw, minutesRaw] = value.split(":");
  const hours = Number(hoursRaw);
  const minutes = Number(minutesRaw);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;

  return hours * 60 + minutes;
}

function loadRecords(): CleaningRecord[] {
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

function saveRecords(records: CleaningRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export default function SaneamientoPage() {
  const [records, setRecords] = useState<CleaningRecord[]>([]);
  const [form, setForm] = useState<CleaningRecord>(emptyForm);
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

  function updateField(field: keyof CleaningRecord, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function needsCapa(): boolean {
    return (
      ["No apto para uso", "Requiere recleaning", "Retenido QA"].includes(form.estadoPreoperacional) ||
      ["Con observación", "No conforme", "Requiere hisopado", "Requiere repetición"].includes(form.resultadoInspeccion) ||
      ["Retenido QA", "Rechazado QA", "Requiere desviación", "Requiere CAPA"].includes(form.liberacionQA)
    );
  }

  function validateForm(): string[] {
    const errors = requiredFields
      .filter((field) => isInvalid(form[field]))
      .map((field) => fieldLabels[field]);

    const start = timeToMinutes(form.horaInicio);
    const end = timeToMinutes(form.horaFin);

    if (start !== null && end !== null && end <= start) {
      errors.push("La hora de finalización debe ser posterior a la hora de inicio");
    }

    if (form.requiereHisopado === "Sí" && isInvalid(form.codigoMuestra)) {
      errors.push("El código de muestra es obligatorio cuando se requiere hisopado o muestra");
    }

    if (
      ["Liberado QA", "Retenido QA", "Rechazado QA"].includes(form.liberacionQA) &&
      isInvalid(form.evidencia)
    ) {
      errors.push("La evidencia es obligatoria cuando QA libera, retiene o rechaza");
    }

    if (needsCapa() && isInvalid(form.desviacionAsociada)) {
      errors.push("La desviación asociada es obligatoria cuando existe condición no conforme o CAPA");
    }

    if (needsCapa() && isInvalid(form.accionCorrectiva)) {
      errors.push("La acción correctiva / CAPA es obligatoria cuando existe condición no conforme o retención QA");
    }

    if (["Validación de limpieza", "Cambio de lote", "Cambio de producto"].includes(form.tipoLimpieza) && form.requiereHisopado === "No") {
      errors.push("Validación de limpieza, cambio de lote o cambio de producto deben requerir hisopado o muestra");
    }

    return Array.from(new Set(errors));
  }

  function fieldHasError(field: keyof CleaningRecord): boolean {
    if (!submitAttempted) return false;

    if (requiredFields.includes(field) && isInvalid(form[field])) return true;

    const start = timeToMinutes(form.horaInicio);
    const end = timeToMinutes(form.horaFin);

    if (field === "horaFin" && start !== null && end !== null && end <= start) return true;

    if (field === "codigoMuestra" && form.requiereHisopado === "Sí" && isInvalid(form.codigoMuestra)) return true;

    if (field === "evidencia" && ["Liberado QA", "Retenido QA", "Rechazado QA"].includes(form.liberacionQA) && isInvalid(form.evidencia)) return true;

    if (field === "desviacionAsociada" && needsCapa() && isInvalid(form.desviacionAsociada)) return true;

    if (field === "accionCorrectiva" && needsCapa() && isInvalid(form.accionCorrectiva)) return true;

    if (field === "requiereHisopado" && ["Validación de limpieza", "Cambio de lote", "Cambio de producto"].includes(form.tipoLimpieza) && form.requiereHisopado === "No") return true;

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
      showCloud("No se guardó la limpieza. Completa la información obligatoria.", errors, "warning");
      return;
    }

    const timestamp = nowIso();

    const payload: CleaningRecord = {
      ...form,
      codigoLimpieza: clean(form.codigoLimpieza),
      fecha: clean(form.fecha),
      horaInicio: clean(form.horaInicio),
      horaFin: clean(form.horaFin),
      empresa: clean(form.empresa),
      sede: clean(form.sede),
      area: clean(form.area),
      ubicacion: clean(form.ubicacion),
      equipoArea: clean(form.equipoArea),
      tipoLimpieza: clean(form.tipoLimpieza),
      procedimientoSOP: clean(form.procedimientoSOP),
      versionSOP: clean(form.versionSOP),
      productoLimpieza: clean(form.productoLimpieza),
      loteProducto: clean(form.loteProducto),
      concentracion: clean(form.concentracion),
      responsableEjecucion: clean(form.responsableEjecucion),
      responsableVerificacion: clean(form.responsableVerificacion),
      estadoPreoperacional: clean(form.estadoPreoperacional),
      resultadoInspeccion: clean(form.resultadoInspeccion),
      requiereHisopado: clean(form.requiereHisopado),
      codigoMuestra: clean(form.codigoMuestra),
      liberacionQA: clean(form.liberacionQA),
      desviacionAsociada: clean(form.desviacionAsociada),
      accionCorrectiva: clean(form.accionCorrectiva),
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
      editingId
        ? "Registro de limpieza actualizado correctamente."
        : "Limpieza registrada correctamente con control GMP.",
      [],
      "success"
    );
  }

  function handleEdit(record: CleaningRecord) {
    setForm(record);
    setEditingId(record.id);
    setSubmitAttempted(false);
    showCloud("Registro cargado para edición. Verifica antes de actualizar.", [], "success");
  }

  function handleDelete(id: string) {
    const confirmed = window.confirm(
      "¿Confirmas eliminar este registro? En ambiente GMP real debería manejarse como anulación auditada."
    );

    if (!confirmed) return;

    const nextRecords = records.filter((record) => record.id !== id);
    setRecords(nextRecords);
    saveRecords(nextRecords);
    showCloud("Registro eliminado del almacenamiento local.", [], "success");
  }

  function exportJson() {
    if (records.length === 0) {
      showCloud("No hay registros de limpieza para exportar.", [], "warning");
      return;
    }

    const blob = new Blob([JSON.stringify(records, null, 2)], {
      type: "application/json;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `floratrack-limpieza-saneamiento-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);

    showCloud("Archivo JSON de limpieza exportado correctamente.", [], "success");
  }

  const filteredRecords = useMemo(() => {
    const term = clean(search).toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        !term ||
        [
          record.codigoLimpieza,
          record.empresa,
          record.sede,
          record.area,
          record.ubicacion,
          record.equipoArea,
          record.tipoLimpieza,
          record.procedimientoSOP,
          record.productoLimpieza,
          record.responsableEjecucion,
          record.responsableVerificacion,
          record.resultadoInspeccion,
          record.liberacionQA,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

      const matchesQA = filterQA === "Todos" || record.liberacionQA === filterQA;

      return matchesSearch && matchesQA;
    });
  }, [records, search, filterQA]);

  const dashboard = useMemo(() => {
    return {
      total: records.length,
      liberadas: records.filter((record) => record.liberacionQA === "Liberado QA").length,
      pendientes: records.filter((record) => record.liberacionQA === "Pendiente QA").length,
      noConformes: records.filter((record) =>
        ["No conforme", "Requiere repetición"].includes(record.resultadoInspeccion) ||
        ["Retenido QA", "Rechazado QA", "Requiere desviación", "Requiere CAPA"].includes(record.liberacionQA)
      ).length,
      hisopado: records.filter((record) => record.requiereHisopado === "Sí").length,
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
        <header className="rounded-3xl border border-teal-400/20 bg-slate-900/80 p-6 shadow-2xl shadow-teal-950/30">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-teal-300">
                FloraTrack Enterprise Compliance Platform
              </p>

              <h1 className="mt-3 text-3xl font-black text-white md:text-5xl">
                Limpieza y saneamiento GMP
              </h1>

              <p className="mt-3 max-w-5xl text-sm leading-6 text-slate-300 md:text-base">
                Registro electrónico de limpieza, desinfección, SOP, productos,
                concentración, inspección preoperacional, hisopado, evidencia,
                desviaciones, CAPA y liberación QA.
              </p>
            </div>

            <div className="rounded-2xl border border-teal-400/20 bg-teal-500/10 px-5 py-4 text-sm text-teal-100">
              <p className="font-bold">Saneamiento GMP activo</p>
              <p className="mt-1 text-teal-200">
                SOP · Limpieza · Hisopado · QA · CAPA
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
          <Metric title="Registros" value={dashboard.total} />
          <Metric title="Liberadas QA" value={dashboard.liberadas} tone="emerald" />
          <Metric title="Pendientes QA" value={dashboard.pendientes} tone="amber" />
          <Metric title="No conformes" value={dashboard.noConformes} tone="red" />
          <Metric title="Hisopado" value={dashboard.hisopado} tone="sky" />
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
                  {editingId ? "Editar limpieza" : "Nueva limpieza"}
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Ningún registro de limpieza puede guardarse vacío o incompleto.
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
                  : "border-slate-700 bg-slate-950 focus:border-teal-400 focus:ring-4 focus:ring-teal-400/40";

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
                          Campo obligatorio o condición GMP requerida.
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
                className="rounded-2xl bg-teal-500 px-6 py-3 text-sm font-black text-slate-950 shadow-lg shadow-teal-950/50 transition hover:bg-teal-400"
              >
                {editingId ? "Actualizar limpieza" : "Guardar limpieza"}
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
                  Registro maestro de limpieza
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Consulta, filtra, edita y exporta registros de saneamiento.
                </p>
              </div>

              <button
                type="button"
                onClick={exportJson}
                className="rounded-2xl border border-teal-400/50 px-5 py-3 text-sm font-bold text-teal-200 transition hover:bg-teal-500/10"
              >
                Exportar JSON
              </button>
            </div>

            <div className="mb-5 grid gap-3 md:grid-cols-[1fr_250px]">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-teal-400/40 transition placeholder:text-slate-600 focus:border-teal-400 focus:ring-4"
                placeholder="Buscar por código, área, equipo, SOP, QA..."
              />

              <select
                value={filterQA}
                onChange={(event) => setFilterQA(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-teal-400/40 transition focus:border-teal-400 focus:ring-4"
              >
                <option>Todos</option>
                <option>Pendiente QA</option>
                <option>Liberado QA</option>
                <option>Retenido QA</option>
                <option>Rechazado QA</option>
                <option>Requiere desviación</option>
                <option>Requiere CAPA</option>
              </select>
            </div>

            <div className="max-h-[780px] space-y-4 overflow-auto pr-2">
              {filteredRecords.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center text-sm text-slate-400">
                  No hay limpiezas registradas. Crea el primer registro con datos completos.
                </div>
              ) : (
                filteredRecords.map((record) => (
                  <article key={record.id} className="rounded-2xl border border-slate-700 bg-slate-950 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-white">
                            {record.codigoLimpieza} · {record.equipoArea}
                          </h3>
                          <StatusPill value={record.liberacionQA} />
                          <span className="rounded-full border border-teal-400/30 bg-teal-500/10 px-3 py-1 text-xs font-bold text-teal-200">
                            {record.tipoLimpieza}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-400">
                          {record.fecha} · {record.horaInicio}-{record.horaFin} · {record.area}
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
                      <Data label="Ubicación" value={record.ubicacion} />
                      <Data label="SOP" value={`${record.procedimientoSOP} v${record.versionSOP}`} />
                      <Data label="Producto" value={record.productoLimpieza} />
                      <Data label="Lote producto" value={record.loteProducto} />
                      <Data label="Concentración" value={record.concentracion} />
                      <Data label="Ejecutó" value={record.responsableEjecucion} />
                      <Data label="Verificó" value={record.responsableVerificacion} />
                      <Data label="Preoperacional" value={record.estadoPreoperacional} />
                      <Data label="Inspección" value={record.resultadoInspeccion} />
                      <Data label="Hisopado" value={record.requiereHisopado} />
                      <Data label="Código muestra" value={record.codigoMuestra || "Sin registro"} />
                      <Data label="Evidencia" value={record.evidencia || "Sin registro"} />
                    </div>

                    {(record.desviacionAsociada || record.accionCorrectiva || record.observaciones) && (
                      <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300">
                        {record.desviacionAsociada && (
                          <p>
                            <span className="font-bold text-slate-100">Desviación: </span>
                            {record.desviacionAsociada}
                          </p>
                        )}

                        {record.accionCorrectiva && (
                          <p className="mt-2">
                            <span className="font-bold text-slate-100">CAPA: </span>
                            {record.accionCorrectiva}
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
    value === "Liberado QA"
      ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
      : value === "Pendiente QA"
      ? "border-amber-400/40 bg-amber-500/10 text-amber-200"
      : value === "Retenido QA" || value === "Rechazado QA" || value === "Requiere desviación" || value === "Requiere CAPA"
      ? "border-red-400/40 bg-red-500/10 text-red-200"
      : "border-teal-400/40 bg-teal-500/10 text-teal-200";

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-bold ${className}`}>
      {value || "Sin QA"}
    </span>
  );
}
