"use client";

import { useEffect, useMemo, useState } from "react";

type RetentionRecord = {
  id: string;
  codigoRetencion: string;
  fechaIngreso: string;
  horaIngreso: string;
  empresa: string;
  sede: string;
  areaOrigen: string;
  tipoMuestra: string;
  codigoMuestra: string;
  codigoLote: string;
  productoMaterial: string;
  cantidad: string;
  unidad: string;
  condicionAlmacenamiento: string;
  ubicacion: string;
  responsableCustodia: string;
  programaEstabilidad: string;
  intervaloEstabilidad: string;
  fechaProximaRevision: string;
  fechaVencimientoRetencion: string;
  criterioAceptacion: string;
  resultadoRevision: string;
  estadoMuestra: string;
  decisionQA: string;
  fechaDisposicion: string;
  metodoDisposicion: string;
  desviacionAsociada: string;
  capa: string;
  evidencia: string;
  observaciones: string;
  creadoEn: string;
  actualizadoEn: string;
};

type FieldConfig = {
  key: keyof RetentionRecord;
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

const STORAGE_KEY = "floratrack_retencion_estabilidad_v1";

const emptyForm: RetentionRecord = {
  id: "",
  codigoRetencion: "",
  fechaIngreso: "",
  horaIngreso: "",
  empresa: "",
  sede: "",
  areaOrigen: "",
  tipoMuestra: "",
  codigoMuestra: "",
  codigoLote: "",
  productoMaterial: "",
  cantidad: "",
  unidad: "",
  condicionAlmacenamiento: "",
  ubicacion: "",
  responsableCustodia: "",
  programaEstabilidad: "",
  intervaloEstabilidad: "",
  fechaProximaRevision: "",
  fechaVencimientoRetencion: "",
  criterioAceptacion: "",
  resultadoRevision: "",
  estadoMuestra: "",
  decisionQA: "",
  fechaDisposicion: "",
  metodoDisposicion: "",
  desviacionAsociada: "",
  capa: "",
  evidencia: "",
  observaciones: "",
  creadoEn: "",
  actualizadoEn: "",
};

const requiredFields: Array<keyof RetentionRecord> = [
  "codigoRetencion",
  "fechaIngreso",
  "horaIngreso",
  "empresa",
  "sede",
  "areaOrigen",
  "tipoMuestra",
  "codigoMuestra",
  "codigoLote",
  "productoMaterial",
  "cantidad",
  "unidad",
  "condicionAlmacenamiento",
  "ubicacion",
  "responsableCustodia",
  "programaEstabilidad",
  "intervaloEstabilidad",
  "fechaVencimientoRetencion",
  "resultadoRevision",
  "estadoMuestra",
  "decisionQA",
];

const fieldLabels: Record<keyof RetentionRecord, string> = {
  id: "ID",
  codigoRetencion: "Código de retención",
  fechaIngreso: "Fecha de ingreso",
  horaIngreso: "Hora de ingreso",
  empresa: "Empresa",
  sede: "Sede / predio",
  areaOrigen: "Área de origen",
  tipoMuestra: "Tipo de muestra",
  codigoMuestra: "Código de muestra",
  codigoLote: "Código de lote",
  productoMaterial: "Producto / material",
  cantidad: "Cantidad",
  unidad: "Unidad",
  condicionAlmacenamiento: "Condición de almacenamiento",
  ubicacion: "Ubicación",
  responsableCustodia: "Responsable de custodia",
  programaEstabilidad: "Programa de estabilidad",
  intervaloEstabilidad: "Intervalo de estabilidad",
  fechaProximaRevision: "Próxima revisión",
  fechaVencimientoRetencion: "Vencimiento / retesteo",
  criterioAceptacion: "Criterio de aceptación",
  resultadoRevision: "Resultado de revisión",
  estadoMuestra: "Estado de muestra",
  decisionQA: "Decisión QA",
  fechaDisposicion: "Fecha de disposición",
  metodoDisposicion: "Método de disposición",
  desviacionAsociada: "Desviación asociada",
  capa: "CAPA",
  evidencia: "Evidencia",
  observaciones: "Observaciones",
  creadoEn: "Creado en",
  actualizadoEn: "Actualizado en",
};

const fields: FieldConfig[] = [
  { key: "codigoRetencion", label: "Código de retención *", placeholder: "RET-2026-001" },
  { key: "fechaIngreso", label: "Fecha de ingreso *", type: "date" },
  { key: "horaIngreso", label: "Hora de ingreso *", type: "time" },
  { key: "empresa", label: "Empresa *", placeholder: "Growlifecol S.A.S." },
  { key: "sede", label: "Sede / predio *", placeholder: "Sede principal" },
  {
    key: "areaOrigen",
    label: "Área de origen *",
    kind: "select",
    options: [
      "QA",
      "QC",
      "Recepción",
      "Inventario",
      "Cultivo",
      "Cosecha",
      "Secado",
      "Postcosecha",
      "Extracción BHO",
      "Bubble Hash",
      "Live Rosin",
      "Producto terminado",
      "Estabilidad",
      "Retención",
    ],
  },
  {
    key: "tipoMuestra",
    label: "Tipo de muestra *",
    kind: "select",
    options: [
      "Muestra de retención",
      "Contramuestra",
      "Muestra de estabilidad",
      "Muestra QC",
      "Producto terminado",
      "Producto en proceso",
      "Flor seca",
      "Biomasa",
      "Extracto BHO",
      "Bubble Hash",
      "Live Rosin",
      "Insumo crítico",
      "Material de empaque",
    ],
  },
  { key: "codigoMuestra", label: "Código de muestra *", placeholder: "QC-2026-001 / RET-2026-001" },
  { key: "codigoLote", label: "Código de lote *", placeholder: "LOT-2026-001" },
  { key: "productoMaterial", label: "Producto / material *", placeholder: "Flor seca medicinal, extracto, biomasa, insumo..." },
  { key: "cantidad", label: "Cantidad *", type: "number", placeholder: "10" },
  {
    key: "unidad",
    label: "Unidad *",
    kind: "select",
    options: ["g", "kg", "mg", "mL", "L", "unidades", "frascos", "bolsas"],
  },
  {
    key: "condicionAlmacenamiento",
    label: "Condición de almacenamiento *",
    kind: "select",
    options: [
      "Ambiente controlado",
      "Refrigerado",
      "Congelado",
      "Protegido de luz",
      "Seco y ventilado",
      "Cuarto de estabilidad",
      "Cámara climática",
      "Cuarentena QA",
      "Retención segregada",
    ],
  },
  { key: "ubicacion", label: "Ubicación *", placeholder: "Estante, cámara, nevera, caja, posición, QR..." },
  { key: "responsableCustodia", label: "Responsable de custodia *", placeholder: "Responsable QA / QC / almacén" },
  {
    key: "programaEstabilidad",
    label: "Programa de estabilidad *",
    kind: "select",
    options: ["Sí", "No"],
  },
  {
    key: "intervaloEstabilidad",
    label: "Intervalo de estabilidad *",
    kind: "select",
    options: [
      "Inicial",
      "1 mes",
      "3 meses",
      "6 meses",
      "9 meses",
      "12 meses",
      "18 meses",
      "24 meses",
      "36 meses",
      "Retención anual",
      "No aplica",
    ],
  },
  { key: "fechaProximaRevision", label: "Próxima revisión", type: "date" },
  { key: "fechaVencimientoRetencion", label: "Vencimiento / retesteo *", type: "date" },
  {
    key: "criterioAceptacion",
    label: "Criterio de aceptación",
    kind: "textarea",
    placeholder: "Especificación, apariencia, potencia, microbiología, humedad, empaque, integridad o condición esperada.",
  },
  {
    key: "resultadoRevision",
    label: "Resultado de revisión *",
    kind: "select",
    options: [
      "Pendiente revisión",
      "Conforme",
      "Con observación",
      "No conforme",
      "Fuera de especificación",
      "Muestra deteriorada",
      "Muestra agotada",
      "No aplica",
    ],
  },
  {
    key: "estadoMuestra",
    label: "Estado de muestra *",
    kind: "select",
    options: [
      "Almacenada",
      "En revisión",
      "Retenida",
      "Liberada para análisis",
      "Agotada",
      "Vencida",
      "Deteriorada",
      "Destrucción pendiente",
      "Destruida",
    ],
  },
  {
    key: "decisionQA",
    label: "Decisión QA *",
    kind: "select",
    options: [
      "Pendiente QA",
      "Aprobado QA",
      "Retenido QA",
      "Rechazado QA",
      "Liberado para análisis",
      "Requiere desviación",
      "Requiere CAPA",
      "Destrucción aprobada",
      "Cierre aprobado QA",
    ],
  },
  { key: "fechaDisposicion", label: "Fecha de disposición", type: "date" },
  {
    key: "metodoDisposicion",
    label: "Método de disposición",
    kind: "select",
    options: [
      "No aplica",
      "Retención continua",
      "Destrucción controlada",
      "Entrega a gestor",
      "Análisis destructivo",
      "Agotamiento por análisis",
      "Cuarentena",
    ],
  },
  { key: "desviacionAsociada", label: "Desviación asociada", placeholder: "DEV-2026-001 / CAPA-001" },
  {
    key: "capa",
    label: "CAPA",
    kind: "textarea",
    placeholder: "Acción correctiva y preventiva cuando hay no conformidad, deterioro, vencimiento, OOS u observación crítica.",
  },
  { key: "evidencia", label: "Evidencia / soporte", placeholder: "Foto, etiqueta, registro de cámara, COA, informe de estabilidad, acta..." },
  {
    key: "observaciones",
    label: "Observaciones",
    kind: "textarea",
    placeholder: "Notas QA, estado del empaque, integridad, condiciones de almacenamiento, seguimiento.",
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
  return `RET-${Date.now()}-${Math.random().toString(16).slice(2)}`;
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

function loadRecords(): RetentionRecord[] {
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

function saveRecords(records: RetentionRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export default function RetencionPage() {
  const [records, setRecords] = useState<RetentionRecord[]>([]);
  const [form, setForm] = useState<RetentionRecord>(emptyForm);
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

  function updateField(field: keyof RetentionRecord, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function needsCapa(): boolean {
    return (
      ["No conforme", "Fuera de especificación", "Muestra deteriorada"].includes(form.resultadoRevision) ||
      ["Vencida", "Deteriorada"].includes(form.estadoMuestra) ||
      ["Retenido QA", "Rechazado QA", "Requiere desviación", "Requiere CAPA"].includes(form.decisionQA)
    );
  }

  function validateForm(): string[] {
    const errors = requiredFields
      .filter((field) => isInvalid(form[field]))
      .map((field) => fieldLabels[field]);

    const amount = Number(form.cantidad);

    if (!Number.isFinite(amount) || amount <= 0) {
      errors.push("La cantidad debe ser mayor a cero");
    }

    if (isDateBefore(form.fechaVencimientoRetencion, form.fechaIngreso)) {
      errors.push("La fecha de vencimiento / retesteo no puede ser anterior a la fecha de ingreso");
    }

    if (form.fechaProximaRevision && isDateBefore(form.fechaProximaRevision, form.fechaIngreso)) {
      errors.push("La próxima revisión no puede ser anterior a la fecha de ingreso");
    }

    if (form.programaEstabilidad === "Sí" && isInvalid(form.fechaProximaRevision)) {
      errors.push("La próxima revisión es obligatoria cuando la muestra está en programa de estabilidad");
    }

    if (form.programaEstabilidad === "Sí" && isInvalid(form.criterioAceptacion)) {
      errors.push("El criterio de aceptación es obligatorio para programa de estabilidad");
    }

    if (["Aprobado QA", "Liberado para análisis", "Destrucción aprobada", "Cierre aprobado QA", "Rechazado QA"].includes(form.decisionQA) && isInvalid(form.evidencia)) {
      errors.push("La evidencia es obligatoria para decisiones QA formales");
    }

    if (["Destrucción aprobada", "Cierre aprobado QA"].includes(form.decisionQA) && isInvalid(form.fechaDisposicion)) {
      errors.push("La fecha de disposición es obligatoria para destrucción o cierre aprobado QA");
    }

    if (["Destrucción aprobada", "Cierre aprobado QA"].includes(form.decisionQA) && isInvalid(form.metodoDisposicion)) {
      errors.push("El método de disposición es obligatorio para destrucción o cierre aprobado QA");
    }

    if (needsCapa() && isInvalid(form.desviacionAsociada)) {
      errors.push("La desviación asociada es obligatoria cuando hay no conformidad, deterioro, vencimiento, retención o rechazo QA");
    }

    if (needsCapa() && isInvalid(form.capa)) {
      errors.push("La CAPA es obligatoria cuando hay no conformidad, deterioro, vencimiento, retención o rechazo QA");
    }

    return Array.from(new Set(errors));
  }

  function fieldHasError(field: keyof RetentionRecord): boolean {
    if (!submitAttempted) return false;

    if (requiredFields.includes(field) && isInvalid(form[field])) return true;

    if (field === "cantidad") {
      const amount = Number(form.cantidad);
      return !Number.isFinite(amount) || amount <= 0;
    }

    if (field === "fechaVencimientoRetencion" && isDateBefore(form.fechaVencimientoRetencion, form.fechaIngreso)) return true;
    if (field === "fechaProximaRevision" && form.fechaProximaRevision && isDateBefore(form.fechaProximaRevision, form.fechaIngreso)) return true;
    if (field === "fechaProximaRevision" && form.programaEstabilidad === "Sí" && isInvalid(form.fechaProximaRevision)) return true;
    if (field === "criterioAceptacion" && form.programaEstabilidad === "Sí" && isInvalid(form.criterioAceptacion)) return true;
    if (field === "evidencia" && ["Aprobado QA", "Liberado para análisis", "Destrucción aprobada", "Cierre aprobado QA", "Rechazado QA"].includes(form.decisionQA) && isInvalid(form.evidencia)) return true;
    if (field === "fechaDisposicion" && ["Destrucción aprobada", "Cierre aprobado QA"].includes(form.decisionQA) && isInvalid(form.fechaDisposicion)) return true;
    if (field === "metodoDisposicion" && ["Destrucción aprobada", "Cierre aprobado QA"].includes(form.decisionQA) && isInvalid(form.metodoDisposicion)) return true;
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
      showCloud("No se guardó la muestra de retención. Completa la información obligatoria.", errors, "warning");
      return;
    }

    const timestamp = nowIso();

    const payload: RetentionRecord = {
      ...form,
      codigoRetencion: clean(form.codigoRetencion),
      fechaIngreso: clean(form.fechaIngreso),
      horaIngreso: clean(form.horaIngreso),
      empresa: clean(form.empresa),
      sede: clean(form.sede),
      areaOrigen: clean(form.areaOrigen),
      tipoMuestra: clean(form.tipoMuestra),
      codigoMuestra: clean(form.codigoMuestra),
      codigoLote: clean(form.codigoLote),
      productoMaterial: clean(form.productoMaterial),
      cantidad: clean(form.cantidad),
      unidad: clean(form.unidad),
      condicionAlmacenamiento: clean(form.condicionAlmacenamiento),
      ubicacion: clean(form.ubicacion),
      responsableCustodia: clean(form.responsableCustodia),
      programaEstabilidad: clean(form.programaEstabilidad),
      intervaloEstabilidad: clean(form.intervaloEstabilidad),
      fechaProximaRevision: clean(form.fechaProximaRevision),
      fechaVencimientoRetencion: clean(form.fechaVencimientoRetencion),
      criterioAceptacion: clean(form.criterioAceptacion),
      resultadoRevision: clean(form.resultadoRevision),
      estadoMuestra: clean(form.estadoMuestra),
      decisionQA: clean(form.decisionQA),
      fechaDisposicion: clean(form.fechaDisposicion),
      metodoDisposicion: clean(form.metodoDisposicion),
      desviacionAsociada: clean(form.desviacionAsociada),
      capa: clean(form.capa),
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
      editingId ? "Muestra de retención actualizada correctamente." : "Muestra de retención registrada correctamente con control GMP.",
      [],
      "success"
    );
  }

  function handleEdit(record: RetentionRecord) {
    setForm(record);
    setEditingId(record.id);
    setSubmitAttempted(false);
    showCloud("Registro cargado para edición. Verifica antes de actualizar.", [], "success");
  }

  function handleDelete(id: string) {
    const confirmed = window.confirm("¿Confirmas eliminar este registro? En ambiente GMP real debería manejarse como anulación auditada.");
    if (!confirmed) return;

    const nextRecords = records.filter((record) => record.id !== id);
    setRecords(nextRecords);
    saveRecords(nextRecords);
    showCloud("Registro eliminado del almacenamiento local.", [], "success");
  }

  function exportJson() {
    if (records.length === 0) {
      showCloud("No hay registros de retención para exportar.", [], "warning");
      return;
    }

    const blob = new Blob([JSON.stringify(records, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `floratrack-retencion-estabilidad-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);

    showCloud("Archivo JSON de retención exportado correctamente.", [], "success");
  }

  const filteredRecords = useMemo(() => {
    const term = clean(search).toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        !term ||
        [
          record.codigoRetencion,
          record.codigoMuestra,
          record.codigoLote,
          record.productoMaterial,
          record.tipoMuestra,
          record.areaOrigen,
          record.ubicacion,
          record.estadoMuestra,
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
      estabilidad: records.filter((record) => record.programaEstabilidad === "Sí").length,
      vencidas: records.filter((record) => isPastDate(record.fechaVencimientoRetencion)).length,
      noConformes: records.filter((record) =>
        ["No conforme", "Fuera de especificación", "Muestra deteriorada"].includes(record.resultadoRevision)
      ).length,
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
        <header className="rounded-3xl border border-fuchsia-400/20 bg-slate-900/80 p-6 shadow-2xl shadow-fuchsia-950/30">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-fuchsia-300">
                FloraTrack Enterprise Compliance Platform
              </p>

              <h1 className="mt-3 text-3xl font-black text-white md:text-5xl">
                Retención de muestras y estabilidad
              </h1>

              <p className="mt-3 max-w-5xl text-sm leading-6 text-slate-300 md:text-base">
                Control de muestras de retención, contramuestras, estabilidad, custodia,
                almacenamiento, vencimiento, revisión, evidencia, desviaciones, CAPA y decisión QA.
              </p>
            </div>

            <div className="rounded-2xl border border-fuchsia-400/20 bg-fuchsia-500/10 px-5 py-4 text-sm text-fuchsia-100">
              <p className="font-bold">Retención GMP activa</p>
              <p className="mt-1 text-fuchsia-200">Muestras · Estabilidad · Custodia · QA · CAPA</p>
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
          <Metric title="Muestras" value={dashboard.total} />
          <Metric title="Estabilidad" value={dashboard.estabilidad} tone="sky" />
          <Metric title="Vencidas" value={dashboard.vencidas} tone="red" />
          <Metric title="No conformes" value={dashboard.noConformes} tone="amber" />
          <Metric title="Pendiente QA" value={dashboard.pendienteQA} tone="emerald" />
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
                <h2 className="text-2xl font-black text-white">{editingId ? "Editar retención" : "Nueva muestra de retención"}</h2>
                <p className="mt-1 text-sm text-slate-400">Ninguna muestra puede guardarse vacía o incompleta.</p>
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
                  : "border-slate-700 bg-slate-950 focus:border-fuchsia-400 focus:ring-4 focus:ring-fuchsia-400/40";

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

                      {hasError && <p className="mt-1 text-xs font-bold text-red-300">Campo obligatorio o condición GMP requerida.</p>}
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
              <button type="button" onClick={handleSave} className="rounded-2xl bg-fuchsia-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-fuchsia-950/50 transition hover:bg-fuchsia-400">
                {editingId ? "Actualizar retención" : "Guardar retención"}
              </button>

              <button type="button" onClick={resetForm} className="rounded-2xl border border-slate-600 px-6 py-3 text-sm font-bold text-slate-200 transition hover:bg-slate-800">
                Limpiar formulario
              </button>
            </div>
          </form>

          <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">Registro maestro de retención</h2>
                <p className="mt-1 text-sm text-slate-400">Consulta, filtra, edita y exporta muestras de retención y estabilidad.</p>
              </div>

              <button type="button" onClick={exportJson} className="rounded-2xl border border-fuchsia-400/50 px-5 py-3 text-sm font-bold text-fuchsia-200 transition hover:bg-fuchsia-500/10">
                Exportar JSON
              </button>
            </div>

            <div className="mb-5 grid gap-3 md:grid-cols-[1fr_250px]">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-fuchsia-400/40 transition placeholder:text-slate-600 focus:border-fuchsia-400 focus:ring-4"
                placeholder="Buscar por muestra, lote, material, ubicación, QA..."
              />

              <select
                value={filterQA}
                onChange={(event) => setFilterQA(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-fuchsia-400/40 transition focus:border-fuchsia-400 focus:ring-4"
              >
                <option>Todos</option>
                <option>Pendiente QA</option>
                <option>Aprobado QA</option>
                <option>Retenido QA</option>
                <option>Rechazado QA</option>
                <option>Liberado para análisis</option>
                <option>Requiere desviación</option>
                <option>Requiere CAPA</option>
                <option>Destrucción aprobada</option>
                <option>Cierre aprobado QA</option>
              </select>
            </div>

            <div className="max-h-[780px] space-y-4 overflow-auto pr-2">
              {filteredRecords.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center text-sm text-slate-400">
                  No hay muestras registradas. Crea el primer registro con datos completos.
                </div>
              ) : (
                filteredRecords.map((record) => (
                  <article key={record.id} className="rounded-2xl border border-slate-700 bg-slate-950 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-white">{record.codigoRetencion} · {record.codigoMuestra}</h3>
                          <StatusPill value={record.decisionQA} />
                          <span className="rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 px-3 py-1 text-xs font-bold text-fuchsia-200">
                            {record.tipoMuestra}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-400">
                          Lote {record.codigoLote} · {record.productoMaterial} · {record.cantidad} {record.unidad}
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
                      <Data label="Área origen" value={record.areaOrigen} />
                      <Data label="Condición" value={record.condicionAlmacenamiento} />
                      <Data label="Ubicación" value={record.ubicacion} />
                      <Data label="Custodia" value={record.responsableCustodia} />
                      <Data label="Estabilidad" value={record.programaEstabilidad} />
                      <Data label="Intervalo" value={record.intervaloEstabilidad} />
                      <Data label="Próxima revisión" value={record.fechaProximaRevision || "Sin registro"} />
                      <Data label="Vencimiento / retesteo" value={record.fechaVencimientoRetencion} />
                      <Data label="Resultado" value={record.resultadoRevision} />
                      <Data label="Estado muestra" value={record.estadoMuestra} />
                      <Data label="Disposición" value={record.metodoDisposicion || "Sin registro"} />
                      <Data label="Evidencia" value={record.evidencia || "Sin registro"} />
                    </div>

                    {(record.criterioAceptacion || record.desviacionAsociada || record.capa || record.observaciones) && (
                      <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300">
                        {record.criterioAceptacion && <p><span className="font-bold text-slate-100">Criterio: </span>{record.criterioAceptacion}</p>}
                        {record.desviacionAsociada && <p className="mt-2"><span className="font-bold text-slate-100">Desviación: </span>{record.desviacionAsociada}</p>}
                        {record.capa && <p className="mt-2"><span className="font-bold text-slate-100">CAPA: </span>{record.capa}</p>}
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
    value === "Aprobado QA" || value === "Cierre aprobado QA" || value === "Liberado para análisis"
      ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
      : value === "Pendiente QA"
      ? "border-amber-400/40 bg-amber-500/10 text-amber-200"
      : "border-red-400/40 bg-red-500/10 text-red-200";

  return <span className={`rounded-full border px-3 py-1 text-xs font-bold ${className}`}>{value || "Sin QA"}</span>;
}
