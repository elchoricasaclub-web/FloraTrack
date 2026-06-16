"use client";

import { useEffect, useMemo, useState } from "react";

type RecepcionRecord = {
  id: string;
  codigoRecepcion: string;
  fechaRecepcion: string;
  horaRecepcion: string;
  empresa: string;
  sede: string;
  responsableRecepcion: string;
  proveedorOrigen: string;
  tipoOrigen: string;
  tipoMaterial: string;
  codigoLote: string;
  cantidadRecibida: string;
  unidadMedida: string;
  condicionEmpaque: string;
  estadoSanitario: string;
  decisionCalidad: string;
  destinoInterno: string;
  temperaturaRecepcion: string;
  humedadRecepcion: string;
  documentoSoporte: string;
  evidencia: string;
  observaciones: string;
  accionCorrectiva: string;
  creadoEn: string;
  actualizadoEn: string;
};

type FieldConfig = {
  key: keyof RecepcionRecord;
  label: string;
  type?: string;
  placeholder?: string;
  kind?: "input" | "select" | "textarea";
  options?: string[];
};

const STORAGE_KEY = "floratrack_recepcion_records_v1";

const emptyForm: RecepcionRecord = {
  id: "",
  codigoRecepcion: "",
  fechaRecepcion: "",
  horaRecepcion: "",
  empresa: "",
  sede: "",
  responsableRecepcion: "",
  proveedorOrigen: "",
  tipoOrigen: "",
  tipoMaterial: "",
  codigoLote: "",
  cantidadRecibida: "",
  unidadMedida: "",
  condicionEmpaque: "",
  estadoSanitario: "",
  decisionCalidad: "",
  destinoInterno: "",
  temperaturaRecepcion: "",
  humedadRecepcion: "",
  documentoSoporte: "",
  evidencia: "",
  observaciones: "",
  accionCorrectiva: "",
  creadoEn: "",
  actualizadoEn: "",
};

const requiredFields: Array<keyof RecepcionRecord> = [
  "codigoRecepcion",
  "fechaRecepcion",
  "horaRecepcion",
  "empresa",
  "sede",
  "responsableRecepcion",
  "proveedorOrigen",
  "tipoOrigen",
  "tipoMaterial",
  "codigoLote",
  "cantidadRecibida",
  "unidadMedida",
  "condicionEmpaque",
  "estadoSanitario",
  "decisionCalidad",
  "destinoInterno",
];

const fieldLabels: Record<keyof RecepcionRecord, string> = {
  id: "ID",
  codigoRecepcion: "Código de recepción",
  fechaRecepcion: "Fecha de recepción",
  horaRecepcion: "Hora de recepción",
  empresa: "Empresa",
  sede: "Sede / predio",
  responsableRecepcion: "Responsable de recepción",
  proveedorOrigen: "Proveedor / origen",
  tipoOrigen: "Tipo de origen",
  tipoMaterial: "Tipo de material",
  codigoLote: "Código de lote",
  cantidadRecibida: "Cantidad recibida",
  unidadMedida: "Unidad de medida",
  condicionEmpaque: "Condición del empaque",
  estadoSanitario: "Estado sanitario",
  decisionCalidad: "Decisión de calidad",
  destinoInterno: "Destino interno",
  temperaturaRecepcion: "Temperatura de recepción",
  humedadRecepcion: "Humedad de recepción",
  documentoSoporte: "Documento soporte",
  evidencia: "Evidencia",
  observaciones: "Observaciones",
  accionCorrectiva: "Acción correctiva",
  creadoEn: "Creado en",
  actualizadoEn: "Actualizado en",
};

const fields: FieldConfig[] = [
  { key: "codigoRecepcion", label: "Código de recepción *", placeholder: "REC-2026-001" },
  { key: "fechaRecepcion", label: "Fecha de recepción *", type: "date" },
  { key: "horaRecepcion", label: "Hora de recepción *", type: "time" },
  { key: "empresa", label: "Empresa *", placeholder: "Growlifecol S.A.S." },
  { key: "sede", label: "Sede / predio *", placeholder: "Sede principal" },
  { key: "responsableRecepcion", label: "Responsable de recepción *", placeholder: "Nombre del responsable" },
  { key: "proveedorOrigen", label: "Proveedor / origen *", placeholder: "Propagación interna, proveedor, laboratorio..." },
  {
    key: "tipoOrigen",
    label: "Tipo de origen *",
    kind: "select",
    options: [
      "Interno - cultivo",
      "Interno - propagación",
      "Interno - cosecha",
      "Interno - laboratorio",
      "Proveedor externo",
      "Cliente",
      "Muestra regulatoria",
      "Devolución",
    ],
  },
  {
    key: "tipoMaterial",
    label: "Tipo de material *",
    kind: "select",
    options: [
      "Semillas",
      "Clones",
      "Explantes",
      "Plántulas",
      "Flor fresca",
      "Flor seca",
      "Biomasa",
      "Trim",
      "Bubble Hash",
      "Live Rosin",
      "Extracto BHO",
      "Insumo crítico",
      "Muestra para análisis",
    ],
  },
  { key: "codigoLote", label: "Código de lote *", placeholder: "PROP-2026-001" },
  { key: "cantidadRecibida", label: "Cantidad recibida *", type: "number", placeholder: "100" },
  {
    key: "unidadMedida",
    label: "Unidad de medida *",
    kind: "select",
    options: ["unidades", "g", "kg", "ml", "L", "bandejas", "frascos", "bolsas", "cajas"],
  },
  {
    key: "condicionEmpaque",
    label: "Condición del empaque *",
    kind: "select",
    options: ["Íntegro", "Íntegro con observación", "Dañado", "Contaminado", "Sin identificación", "Sello alterado"],
  },
  {
    key: "estadoSanitario",
    label: "Estado sanitario *",
    kind: "select",
    options: [
      "Conforme",
      "Con observaciones",
      "Presencia de plaga",
      "Presencia de hongo",
      "Contaminación visible",
      "Material deteriorado",
      "Pendiente análisis",
    ],
  },
  {
    key: "decisionCalidad",
    label: "Decisión de calidad *",
    kind: "select",
    options: ["Aceptado", "Cuarentena", "Rechazado", "Pendiente liberación QA", "Pendiente análisis laboratorio"],
  },
  {
    key: "destinoInterno",
    label: "Destino interno *",
    kind: "select",
    options: [
      "Propagación",
      "Cultivo",
      "Cosecha",
      "Secado",
      "Postcosecha",
      "Micropropagación",
      "Extracción BHO",
      "Bubble Hash",
      "Live Rosin",
      "Laboratorio de calidad",
      "Cuarentena",
      "Rechazo / disposición",
      "Almacén",
    ],
  },
  { key: "temperaturaRecepcion", label: "Temperatura de recepción", placeholder: "Ej: 18 °C" },
  { key: "humedadRecepcion", label: "Humedad de recepción", placeholder: "Ej: 55% HR" },
  { key: "documentoSoporte", label: "Documento soporte", placeholder: "Remisión, factura, acta, COA..." },
  { key: "evidencia", label: "Evidencia / soporte", placeholder: "Foto, QR, enlace, código documental..." },
  {
    key: "observaciones",
    label: "Observaciones técnicas",
    kind: "textarea",
    placeholder: "Condiciones de recepción, desviaciones, integridad, identificación, riesgos y criterios de aceptación.",
  },
  {
    key: "accionCorrectiva",
    label: "Acción correctiva / disposición",
    kind: "textarea",
    placeholder: "Obligatoria si el material se rechaza. Ej: cuarentena, devolución, destrucción o investigación.",
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

  return `REC-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function loadRecords(): RecepcionRecord[] {
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

function saveRecords(records: RecepcionRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export default function RecepcionPage() {
  const [records, setRecords] = useState<RecepcionRecord[]>([]);
  const [form, setForm] = useState<RecepcionRecord>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [search, setSearch] = useState("");
  const [filterDecision, setFilterDecision] = useState("Todos");

  useEffect(() => {
    setRecords(loadRecords());
  }, []);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 5000);
  }

  function updateField(field: keyof RecepcionRecord, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function validateForm(): string[] {
    const errors = requiredFields
      .filter((field) => isInvalid(form[field]))
      .map((field) => fieldLabels[field]);

    const quantity = Number(form.cantidadRecibida);

    if (!Number.isFinite(quantity) || quantity <= 0) {
      errors.push("La cantidad recibida debe ser mayor a cero");
    }

    if (form.decisionCalidad === "Rechazado" && isInvalid(form.accionCorrectiva)) {
      errors.push("La acción correctiva es obligatoria cuando el material es rechazado");
    }

    if (form.decisionCalidad === "Cuarentena" && isInvalid(form.observaciones)) {
      errors.push("Las observaciones son obligatorias cuando el material queda en cuarentena");
    }

    return errors;
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function handleSubmit() {
    const errors = validateForm();

    if (errors.length > 0) {
      showToast(`Completa la información obligatoria antes de guardar: ${errors.join(", ")}.`);
      return;
    }

    const timestamp = nowIso();

    const payload: RecepcionRecord = {
      ...form,
      codigoRecepcion: clean(form.codigoRecepcion),
      fechaRecepcion: clean(form.fechaRecepcion),
      horaRecepcion: clean(form.horaRecepcion),
      empresa: clean(form.empresa),
      sede: clean(form.sede),
      responsableRecepcion: clean(form.responsableRecepcion),
      proveedorOrigen: clean(form.proveedorOrigen),
      tipoOrigen: clean(form.tipoOrigen),
      tipoMaterial: clean(form.tipoMaterial),
      codigoLote: clean(form.codigoLote),
      cantidadRecibida: clean(form.cantidadRecibida),
      unidadMedida: clean(form.unidadMedida),
      condicionEmpaque: clean(form.condicionEmpaque),
      estadoSanitario: clean(form.estadoSanitario),
      decisionCalidad: clean(form.decisionCalidad),
      destinoInterno: clean(form.destinoInterno),
      temperaturaRecepcion: clean(form.temperaturaRecepcion),
      humedadRecepcion: clean(form.humedadRecepcion),
      documentoSoporte: clean(form.documentoSoporte),
      evidencia: clean(form.evidencia),
      observaciones: clean(form.observaciones),
      accionCorrectiva: clean(form.accionCorrectiva),
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
        ? "Recepción actualizada correctamente con trazabilidad."
        : "Recepción registrada correctamente con control GACP/GMP."
    );
  }

  function handleEdit(record: RecepcionRecord) {
    setForm(record);
    setEditingId(record.id);
    showToast("Registro cargado para edición. Verifica los datos antes de actualizar.");
  }

  function handleDelete(id: string) {
    const confirmed = window.confirm(
      "¿Confirmas eliminar esta recepción? En ambiente GMP real esto debería manejarse como anulación auditada."
    );

    if (!confirmed) return;

    const nextRecords = records.filter((record) => record.id !== id);
    setRecords(nextRecords);
    saveRecords(nextRecords);
    showToast("Registro eliminado del almacenamiento local.");
  }

  function exportJson() {
    if (records.length === 0) {
      showToast("No hay registros para exportar.");
      return;
    }

    const blob = new Blob([JSON.stringify(records, null, 2)], {
      type: "application/json;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `floratrack-recepcion-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);

    showToast("Archivo JSON de recepción exportado correctamente.");
  }

  const filteredRecords = useMemo(() => {
    const term = clean(search).toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        !term ||
        [
          record.codigoRecepcion,
          record.empresa,
          record.sede,
          record.responsableRecepcion,
          record.proveedorOrigen,
          record.tipoOrigen,
          record.tipoMaterial,
          record.codigoLote,
          record.destinoInterno,
          record.decisionCalidad,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

      const matchesDecision =
        filterDecision === "Todos" || record.decisionCalidad === filterDecision;

      return matchesSearch && matchesDecision;
    });
  }, [records, search, filterDecision]);

  const dashboard = useMemo(() => {
    return {
      total: records.length,
      aceptados: records.filter((record) => record.decisionCalidad === "Aceptado").length,
      cuarentena: records.filter((record) => record.decisionCalidad === "Cuarentena").length,
      rechazados: records.filter((record) => record.decisionCalidad === "Rechazado").length,
    };
  }, [records]);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-slate-100">
      <section className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-3xl border border-cyan-400/20 bg-slate-900/80 p-6 shadow-2xl shadow-cyan-950/30">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">
            FloraTrack Enterprise Compliance Platform
          </p>

          <h1 className="mt-3 text-3xl font-black text-white md:text-5xl">
            Recepción y liberación inicial
          </h1>

          <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-300 md:text-base">
            Control de ingreso de material vegetal, lotes, insumos críticos, biomasa,
            flor, material de propagación, muestras y soportes documentales bajo criterios GACP/GMP.
          </p>
        </header>

        {toast && (
          <div className="rounded-2xl border border-amber-300/40 bg-amber-500/15 px-5 py-4 text-sm font-semibold text-amber-100 shadow-xl">
            {toast}
          </div>
        )}

        <section className="grid gap-4 md:grid-cols-4">
          <Metric title="Recepciones" value={dashboard.total} />
          <Metric title="Aceptados" value={dashboard.aceptados} tone="emerald" />
          <Metric title="Cuarentena" value={dashboard.cuarentena} tone="amber" />
          <Metric title="Rechazados" value={dashboard.rechazados} tone="red" />
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <form
            className="rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-xl"
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmit();
            }}
          >
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">
                  {editingId ? "Editar recepción" : "Nueva recepción"}
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Ningún registro puede guardarse vacío o incompleto.
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
                        className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-cyan-400/40 transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-4"
                      />
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
                        className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-cyan-400/40 transition focus:border-cyan-400 focus:ring-4"
                      >
                        <option value="">Seleccione</option>
                        {(field.options ?? []).map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
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
                      className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-cyan-400/40 transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-4"
                    />
                  </label>
                );
              })}
            </div>

            <div className="mt-6 flex flex-col gap-3 md:flex-row">
              <button
                type="submit"
                className="rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-black text-slate-950 shadow-lg shadow-cyan-950/50 transition hover:bg-cyan-400"
              >
                {editingId ? "Actualizar recepción" : "Guardar recepción"}
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
                  Registro maestro de recepción
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Consulta, filtra, edita y exporta la trazabilidad de ingreso.
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
                placeholder="Buscar por código, lote, proveedor, material, destino..."
              />

              <select
                value={filterDecision}
                onChange={(event) => setFilterDecision(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-cyan-400/40 transition focus:border-cyan-400 focus:ring-4"
              >
                <option>Todos</option>
                <option>Aceptado</option>
                <option>Cuarentena</option>
                <option>Rechazado</option>
                <option>Pendiente liberación QA</option>
                <option>Pendiente análisis laboratorio</option>
              </select>
            </div>

            <div className="max-h-[760px] space-y-4 overflow-auto pr-2">
              {filteredRecords.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center text-sm text-slate-400">
                  No hay recepciones para mostrar. Crea el primer registro con datos completos.
                </div>
              ) : (
                filteredRecords.map((record) => (
                  <article key={record.id} className="rounded-2xl border border-slate-700 bg-slate-950 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-white">
                            {record.codigoRecepcion}
                          </h3>
                          <StatusPill value={record.decisionCalidad} />
                          <span className="rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs font-bold text-sky-200">
                            {record.tipoMaterial}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-400">
                          {record.fechaRecepcion} · {record.horaRecepcion} · Lote {record.codigoLote}
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
                      <Data label="Responsable" value={record.responsableRecepcion} />
                      <Data label="Proveedor / origen" value={record.proveedorOrigen} />
                      <Data label="Tipo de origen" value={record.tipoOrigen} />
                      <Data label="Cantidad" value={`${record.cantidadRecibida} ${record.unidadMedida}`} />
                      <Data label="Empaque" value={record.condicionEmpaque} />
                      <Data label="Estado sanitario" value={record.estadoSanitario} />
                      <Data label="Destino" value={record.destinoInterno} />
                      <Data label="Temperatura" value={record.temperaturaRecepcion || "Sin registro"} />
                      <Data label="Humedad" value={record.humedadRecepcion || "Sin registro"} />
                      <Data label="Documento" value={record.documentoSoporte || "Sin registro"} />
                    </div>

                    {(record.evidencia || record.observaciones || record.accionCorrectiva) && (
                      <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300">
                        {record.evidencia && (
                          <p>
                            <span className="font-bold text-slate-100">Evidencia: </span>
                            {record.evidencia}
                          </p>
                        )}

                        {record.observaciones && (
                          <p className="mt-2">
                            <span className="font-bold text-slate-100">Observaciones: </span>
                            {record.observaciones}
                          </p>
                        )}

                        {record.accionCorrectiva && (
                          <p className="mt-2">
                            <span className="font-bold text-slate-100">Acción correctiva: </span>
                            {record.accionCorrectiva}
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

function Metric({
  title,
  value,
  tone = "slate",
}: {
  title: string;
  value: number;
  tone?: "slate" | "emerald" | "amber" | "red";
}) {
  const toneClass =
    tone === "emerald"
      ? "text-emerald-300"
      : tone === "amber"
      ? "text-amber-300"
      : tone === "red"
      ? "text-red-300"
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
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 font-semibold text-slate-200">{value}</p>
    </div>
  );
}

function StatusPill({ value }: { value: string }) {
  const className =
    value === "Aceptado"
      ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
      : value === "Rechazado"
      ? "border-red-400/30 bg-red-500/10 text-red-200"
      : value === "Cuarentena"
      ? "border-amber-400/30 bg-amber-500/10 text-amber-200"
      : "border-cyan-400/30 bg-cyan-500/10 text-cyan-200";

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-bold ${className}`}>
      {value}
    </span>
  );
}
