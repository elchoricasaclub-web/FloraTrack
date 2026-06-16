"use client";

import { useEffect, useMemo, useState } from "react";

type InventarioRecord = {
  id: string;
  codigoMovimiento: string;
  fecha: string;
  hora: string;
  empresa: string;
  sede: string;
  responsable: string;
  tipoMovimiento: string;
  codigoLote: string;
  categoria: string;
  material: string;
  cantidad: string;
  unidad: string;
  ubicacionOrigen: string;
  ubicacionDestino: string;
  estadoQA: string;
  condicionAlmacenamiento: string;
  fechaVencimiento: string;
  temperatura: string;
  humedad: string;
  motivo: string;
  documentoSoporte: string;
  evidencia: string;
  observaciones: string;
  accionCorrectiva: string;
  creadoEn: string;
  actualizadoEn: string;
};

type FieldConfig = {
  key: keyof InventarioRecord;
  label: string;
  type?: string;
  placeholder?: string;
  kind?: "input" | "select" | "textarea";
  options?: string[];
};

const STORAGE_KEY = "floratrack_inventario_records_v2";

const emptyForm: InventarioRecord = {
  id: "",
  codigoMovimiento: "",
  fecha: "",
  hora: "",
  empresa: "",
  sede: "",
  responsable: "",
  tipoMovimiento: "",
  codigoLote: "",
  categoria: "",
  material: "",
  cantidad: "",
  unidad: "",
  ubicacionOrigen: "",
  ubicacionDestino: "",
  estadoQA: "",
  condicionAlmacenamiento: "",
  fechaVencimiento: "",
  temperatura: "",
  humedad: "",
  motivo: "",
  documentoSoporte: "",
  evidencia: "",
  observaciones: "",
  accionCorrectiva: "",
  creadoEn: "",
  actualizadoEn: "",
};

const requiredFields: Array<keyof InventarioRecord> = [
  "codigoMovimiento",
  "fecha",
  "hora",
  "empresa",
  "sede",
  "responsable",
  "tipoMovimiento",
  "codigoLote",
  "categoria",
  "material",
  "cantidad",
  "unidad",
  "ubicacionDestino",
  "estadoQA",
  "condicionAlmacenamiento",
];

const fieldLabels: Record<keyof InventarioRecord, string> = {
  id: "ID",
  codigoMovimiento: "Código de movimiento",
  fecha: "Fecha",
  hora: "Hora",
  empresa: "Empresa",
  sede: "Sede / predio",
  responsable: "Responsable",
  tipoMovimiento: "Tipo de movimiento",
  codigoLote: "Código de lote",
  categoria: "Categoría",
  material: "Material / descripción",
  cantidad: "Cantidad",
  unidad: "Unidad",
  ubicacionOrigen: "Ubicación origen",
  ubicacionDestino: "Ubicación destino",
  estadoQA: "Estado QA",
  condicionAlmacenamiento: "Condición de almacenamiento",
  fechaVencimiento: "Fecha de vencimiento / retesteo",
  temperatura: "Temperatura",
  humedad: "Humedad",
  motivo: "Motivo",
  documentoSoporte: "Documento soporte",
  evidencia: "Evidencia",
  observaciones: "Observaciones",
  accionCorrectiva: "Acción correctiva",
  creadoEn: "Creado en",
  actualizadoEn: "Actualizado en",
};

const fields: FieldConfig[] = [
  { key: "codigoMovimiento", label: "Código de movimiento *", placeholder: "INV-2026-001" },
  { key: "fecha", label: "Fecha *", type: "date" },
  { key: "hora", label: "Hora *", type: "time" },
  { key: "empresa", label: "Empresa *", placeholder: "Growlifecol S.A.S." },
  { key: "sede", label: "Sede / predio *", placeholder: "Sede principal / laboratorio / cultivo" },
  { key: "responsable", label: "Responsable *", placeholder: "Responsable de almacén / QA / producción" },
  {
    key: "tipoMovimiento",
    label: "Tipo de movimiento *",
    kind: "select",
    options: [
      "Ingreso",
      "Salida",
      "Transferencia interna",
      "Ajuste positivo",
      "Ajuste negativo",
      "Cuarentena",
      "Liberación QA",
      "Consumo interno",
      "Muestreo",
      "Rechazo / disposición",
      "Merma / pérdida",
    ],
  },
  { key: "codigoLote", label: "Código de lote *", placeholder: "REC-2026-001 / PROP-2026-001" },
  {
    key: "categoria",
    label: "Categoría *",
    kind: "select",
    options: [
      "Material vegetal",
      "Semillas",
      "Clones",
      "Explantes",
      "Flor fresca",
      "Flor seca",
      "Biomasa",
      "Trim",
      "Bubble Hash",
      "Live Rosin",
      "Extracto BHO",
      "Insumo crítico",
      "Material de empaque",
      "Muestra laboratorio",
      "Producto en proceso",
      "Producto terminado",
      "Residuo controlado",
    ],
  },
  { key: "material", label: "Material / descripción *", placeholder: "Clones, biomasa, flor seca, frascos..." },
  { key: "cantidad", label: "Cantidad *", type: "number", placeholder: "100" },
  {
    key: "unidad",
    label: "Unidad *",
    kind: "select",
    options: ["unidades", "g", "kg", "mg", "ml", "L", "bandejas", "frascos", "bolsas", "cajas"],
  },
  { key: "ubicacionOrigen", label: "Ubicación origen", placeholder: "Recepción, cuarentena, almacén A..." },
  { key: "ubicacionDestino", label: "Ubicación destino *", placeholder: "Almacén principal, cuarto frío, cuarentena..." },
  {
    key: "estadoQA",
    label: "Estado QA *",
    kind: "select",
    options: [
      "Pendiente inspección",
      "Cuarentena",
      "Liberado QA",
      "Aprobado para uso",
      "No conforme",
      "Rechazado",
      "Vencido",
      "Retenido",
      "En investigación",
    ],
  },
  {
    key: "condicionAlmacenamiento",
    label: "Condición de almacenamiento *",
    kind: "select",
    options: [
      "Ambiente controlado",
      "Cuarto frío",
      "Congelado",
      "Protegido de luz",
      "Seco y ventilado",
      "Inflamables",
      "Cuarentena segregada",
      "Material rechazado segregado",
      "Área limpia",
      "Área controlada GMP",
    ],
  },
  { key: "fechaVencimiento", label: "Fecha de vencimiento / retesteo", type: "date" },
  { key: "temperatura", label: "Temperatura", placeholder: "Ej: 18 °C" },
  { key: "humedad", label: "Humedad relativa", placeholder: "Ej: 55% HR" },
  { key: "motivo", label: "Motivo del movimiento", placeholder: "Ingreso desde recepción, liberación QA..." },
  { key: "documentoSoporte", label: "Documento soporte", placeholder: "Acta, remisión, COA, orden de producción..." },
  { key: "evidencia", label: "Evidencia / soporte", placeholder: "Foto, QR, enlace, código documental..." },
  {
    key: "observaciones",
    label: "Observaciones técnicas",
    kind: "textarea",
    placeholder: "Condiciones, hallazgos, desviaciones, segregación, trazabilidad.",
  },
  {
    key: "accionCorrectiva",
    label: "Acción correctiva / disposición",
    kind: "textarea",
    placeholder: "Obligatoria si hay rechazo, no conformidad, vencimiento, merma o pérdida.",
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

  return `INV-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function loadRecords(): InventarioRecord[] {
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

function saveRecords(records: InventarioRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function signedQuantity(record: InventarioRecord): number {
  const quantity = Number(record.cantidad);

  if (!Number.isFinite(quantity)) return 0;

  const negativeMovements = [
    "Salida",
    "Ajuste negativo",
    "Consumo interno",
    "Muestreo",
    "Rechazo / disposición",
    "Merma / pérdida",
  ];

  const neutralMovements = ["Transferencia interna", "Cuarentena", "Liberación QA"];

  if (negativeMovements.includes(record.tipoMovimiento)) return quantity * -1;
  if (neutralMovements.includes(record.tipoMovimiento)) return 0;

  return quantity;
}

export default function InventarioPage() {
  const [records, setRecords] = useState<InventarioRecord[]>([]);
  const [form, setForm] = useState<InventarioRecord>(emptyForm);
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

  function updateField(field: keyof InventarioRecord, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function validateForm(): string[] {
    const errors = requiredFields
      .filter((field) => isInvalid(form[field]))
      .map((field) => fieldLabels[field]);

    const quantity = Number(form.cantidad);

    if (!Number.isFinite(quantity) || quantity <= 0) {
      errors.push("La cantidad debe ser mayor a cero");
    }

    if (
      ["Salida", "Transferencia interna", "Consumo interno", "Muestreo"].includes(form.tipoMovimiento) &&
      isInvalid(form.ubicacionOrigen)
    ) {
      errors.push("La ubicación origen es obligatoria para salidas, transferencias, consumos y muestreos");
    }

    if (
      ["No conforme", "Rechazado", "Vencido"].includes(form.estadoQA) &&
      isInvalid(form.accionCorrectiva)
    ) {
      errors.push("La acción correctiva es obligatoria cuando el estado QA es no conforme, rechazado o vencido");
    }

    if (form.estadoQA === "Cuarentena" && isInvalid(form.observaciones)) {
      errors.push("Las observaciones son obligatorias cuando el material queda en cuarentena");
    }

    if (
      ["Rechazo / disposición", "Merma / pérdida", "Ajuste negativo"].includes(form.tipoMovimiento) &&
      isInvalid(form.motivo)
    ) {
      errors.push("El motivo es obligatorio para rechazo, merma, pérdida o ajuste negativo");
    }

    return Array.from(new Set(errors));
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
      showToast("No se guardó el movimiento. Completa los campos obligatorios marcados.", errors);
      return;
    }

    const timestamp = nowIso();

    const payload: InventarioRecord = {
      ...form,
      codigoMovimiento: clean(form.codigoMovimiento),
      fecha: clean(form.fecha),
      hora: clean(form.hora),
      empresa: clean(form.empresa),
      sede: clean(form.sede),
      responsable: clean(form.responsable),
      tipoMovimiento: clean(form.tipoMovimiento),
      codigoLote: clean(form.codigoLote),
      categoria: clean(form.categoria),
      material: clean(form.material),
      cantidad: clean(form.cantidad),
      unidad: clean(form.unidad),
      ubicacionOrigen: clean(form.ubicacionOrigen),
      ubicacionDestino: clean(form.ubicacionDestino),
      estadoQA: clean(form.estadoQA),
      condicionAlmacenamiento: clean(form.condicionAlmacenamiento),
      fechaVencimiento: clean(form.fechaVencimiento),
      temperatura: clean(form.temperatura),
      humedad: clean(form.humedad),
      motivo: clean(form.motivo),
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
        ? "Movimiento actualizado correctamente con trazabilidad."
        : "Movimiento guardado correctamente con control GACP/GMP."
    );
  }

  function handleEdit(record: InventarioRecord) {
    setForm(record);
    setEditingId(record.id);
    setSubmitAttempted(false);
    showToast("Movimiento cargado para edición. Verifica los datos antes de actualizar.");
  }

  function handleDelete(id: string) {
    const confirmed = window.confirm(
      "¿Confirmas eliminar este movimiento? En ambiente GMP real esto debería manejarse como anulación auditada."
    );

    if (!confirmed) return;

    const nextRecords = records.filter((record) => record.id !== id);
    setRecords(nextRecords);
    saveRecords(nextRecords);
    showToast("Movimiento eliminado del almacenamiento local.");
  }

  function exportJson() {
    if (records.length === 0) {
      showToast("No hay movimientos para exportar.");
      return;
    }

    const blob = new Blob([JSON.stringify(records, null, 2)], {
      type: "application/json;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `floratrack-inventario-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);

    showToast("Archivo JSON de inventario exportado correctamente.");
  }

  function fieldHasError(field: keyof InventarioRecord): boolean {
    if (!submitAttempted) return false;

    if (requiredFields.includes(field) && isInvalid(form[field])) {
      return true;
    }

    if (field === "cantidad") {
      const quantity = Number(form.cantidad);
      return !Number.isFinite(quantity) || quantity <= 0;
    }

    if (
      field === "ubicacionOrigen" &&
      ["Salida", "Transferencia interna", "Consumo interno", "Muestreo"].includes(form.tipoMovimiento) &&
      isInvalid(form.ubicacionOrigen)
    ) {
      return true;
    }

    if (
      field === "accionCorrectiva" &&
      ["No conforme", "Rechazado", "Vencido"].includes(form.estadoQA) &&
      isInvalid(form.accionCorrectiva)
    ) {
      return true;
    }

    if (
      field === "observaciones" &&
      form.estadoQA === "Cuarentena" &&
      isInvalid(form.observaciones)
    ) {
      return true;
    }

    if (
      field === "motivo" &&
      ["Rechazo / disposición", "Merma / pérdida", "Ajuste negativo"].includes(form.tipoMovimiento) &&
      isInvalid(form.motivo)
    ) {
      return true;
    }

    return false;
  }

  const filteredRecords = useMemo(() => {
    const term = clean(search).toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        !term ||
        [
          record.codigoMovimiento,
          record.codigoLote,
          record.empresa,
          record.sede,
          record.responsable,
          record.tipoMovimiento,
          record.categoria,
          record.material,
          record.ubicacionOrigen,
          record.ubicacionDestino,
          record.estadoQA,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

      const matchesQA = filterQA === "Todos" || record.estadoQA === filterQA;

      return matchesSearch && matchesQA;
    });
  }, [records, search, filterQA]);

  const dashboard = useMemo(() => {
    const balance = records.reduce((acc, record) => acc + signedQuantity(record), 0);

    return {
      total: records.length,
      balance,
      liberados: records.filter((record) => record.estadoQA === "Liberado QA").length,
      cuarentena: records.filter((record) => record.estadoQA === "Cuarentena").length,
      alertas: records.filter((record) =>
        ["No conforme", "Rechazado", "Vencido", "Retenido", "En investigación"].includes(record.estadoQA)
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
        <header className="rounded-3xl border border-emerald-400/20 bg-slate-900/80 p-6 shadow-2xl shadow-emerald-950/30">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-300">
            FloraTrack Enterprise Compliance Platform
          </p>

          <h1 className="mt-3 text-3xl font-black text-white md:text-5xl">
            Inventario, almacén y control QA
          </h1>

          <p className="mt-3 max-w-5xl text-sm leading-6 text-slate-300 md:text-base">
            Control de stock por lote, ubicación, estado QA, cuarentena, liberación,
            vencimiento, condiciones de almacenamiento, evidencia documental y trazabilidad
            para operaciones GACP/GMP.
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
          <Metric title="Movimientos" value={dashboard.total} />
          <Metric title="Balance técnico" value={dashboard.balance} tone="sky" />
          <Metric title="Liberados QA" value={dashboard.liberados} tone="emerald" />
          <Metric title="Cuarentena" value={dashboard.cuarentena} tone="amber" />
          <Metric title="Alertas QA" value={dashboard.alertas} tone="red" />
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
                  {editingId ? "Editar movimiento" : "Nuevo movimiento"}
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Ningún movimiento puede guardarse vacío o incompleto.
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
                  : "border-slate-700 bg-slate-950 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/40";

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
                          Campo obligatorio o condición requerida.
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
                className="rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-black text-slate-950 shadow-lg shadow-emerald-950/50 transition hover:bg-emerald-400"
              >
                {editingId ? "Actualizar movimiento" : "Guardar movimiento"}
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
                  Registro maestro de inventario
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Consulta, filtra, edita y exporta la trazabilidad de almacén.
                </p>
              </div>

              <button
                type="button"
                onClick={exportJson}
                className="rounded-2xl border border-emerald-400/50 px-5 py-3 text-sm font-bold text-emerald-200 transition hover:bg-emerald-500/10"
              >
                Exportar JSON
              </button>
            </div>

            <div className="mb-5 grid gap-3 md:grid-cols-[1fr_230px]">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-emerald-400/40 transition placeholder:text-slate-600 focus:border-emerald-400 focus:ring-4"
                placeholder="Buscar por código, lote, material, ubicación, responsable..."
              />

              <select
                value={filterQA}
                onChange={(event) => setFilterQA(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-emerald-400/40 transition focus:border-emerald-400 focus:ring-4"
              >
                <option>Todos</option>
                <option>Pendiente inspección</option>
                <option>Cuarentena</option>
                <option>Liberado QA</option>
                <option>Aprobado para uso</option>
                <option>No conforme</option>
                <option>Rechazado</option>
                <option>Vencido</option>
                <option>Retenido</option>
                <option>En investigación</option>
              </select>
            </div>

            <div className="max-h-[780px] space-y-4 overflow-auto pr-2">
              {filteredRecords.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center text-sm text-slate-400">
                  No hay movimientos para mostrar. Crea el primer movimiento con datos completos.
                </div>
              ) : (
                filteredRecords.map((record) => (
                  <article
                    key={record.id}
                    className="rounded-2xl border border-slate-700 bg-slate-950 p-5"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-white">
                            {record.codigoMovimiento}
                          </h3>
                          <StatusPill value={record.estadoQA} />
                          <span className="rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs font-bold text-sky-200">
                            {record.tipoMovimiento}
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
                      <Data label="Categoría" value={record.categoria} />
                      <Data label="Material" value={record.material} />
                      <Data label="Cantidad" value={`${record.cantidad} ${record.unidad}`} />
                      <Data label="Origen" value={record.ubicacionOrigen || "Sin registro"} />
                      <Data label="Destino" value={record.ubicacionDestino} />
                      <Data label="Almacenamiento" value={record.condicionAlmacenamiento} />
                      <Data label="Vencimiento / retesteo" value={record.fechaVencimiento || "Sin registro"} />
                      <Data label="Temperatura" value={record.temperatura || "Sin registro"} />
                      <Data label="Humedad" value={record.humedad || "Sin registro"} />
                      <Data label="Documento" value={record.documentoSoporte || "Sin registro"} />
                      <Data label="Motivo" value={record.motivo || "Sin registro"} />
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
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 font-semibold text-slate-200">{value}</p>
    </div>
  );
}

function StatusPill({ value }: { value: string }) {
  const className =
    value === "Liberado QA" || value === "Aprobado para uso"
      ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
      : value === "Rechazado" || value === "No conforme" || value === "Vencido"
      ? "border-red-400/30 bg-red-500/10 text-red-200"
      : value === "Cuarentena" || value === "Retenido" || value === "En investigación"
      ? "border-amber-400/30 bg-amber-500/10 text-amber-200"
      : "border-sky-400/30 bg-sky-500/10 text-sky-200";

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-bold ${className}`}>
      {value || "Sin estado"}
    </span>
  );
}
