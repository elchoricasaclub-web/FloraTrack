"use client";

import { useEffect, useMemo, useState } from "react";

type RecallRecord = {
  id: string;
  codigoRecall: string;
  fecha: string;
  hora: string;
  empresa: string;
  sede: string;
  tipoEvento: string;
  origenAlerta: string;
  producto: string;
  loteAfectado: string;
  cantidadAfectada: string;
  unidad: string;
  etapaDetectada: string;
  clasificacionRiesgo: string;
  causaProbable: string;
  alcanceDistribucion: string;
  clientesAfectados: string;
  requiereBloqueo: string;
  accionInmediata: string;
  comunicacionAutoridad: string;
  responsableQA: string;
  responsableTecnico: string;
  estadoInvestigacion: string;
  porcentajeRecuperado: string;
  decisionQA: string;
  desviacionAsociada: string;
  capa: string;
  evidencia: string;
  fechaCierre: string;
  observaciones: string;
  creadoEn: string;
  actualizadoEn: string;
};

type FieldConfig = {
  key: keyof RecallRecord;
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

const STORAGE_KEY = "floratrack_recall_retiro_producto_v1";

const emptyForm: RecallRecord = {
  id: "",
  codigoRecall: "",
  fecha: "",
  hora: "",
  empresa: "",
  sede: "",
  tipoEvento: "",
  origenAlerta: "",
  producto: "",
  loteAfectado: "",
  cantidadAfectada: "",
  unidad: "",
  etapaDetectada: "",
  clasificacionRiesgo: "",
  causaProbable: "",
  alcanceDistribucion: "",
  clientesAfectados: "",
  requiereBloqueo: "",
  accionInmediata: "",
  comunicacionAutoridad: "",
  responsableQA: "",
  responsableTecnico: "",
  estadoInvestigacion: "",
  porcentajeRecuperado: "",
  decisionQA: "",
  desviacionAsociada: "",
  capa: "",
  evidencia: "",
  fechaCierre: "",
  observaciones: "",
  creadoEn: "",
  actualizadoEn: "",
};

const requiredFields: Array<keyof RecallRecord> = [
  "codigoRecall",
  "fecha",
  "hora",
  "empresa",
  "sede",
  "tipoEvento",
  "origenAlerta",
  "producto",
  "loteAfectado",
  "cantidadAfectada",
  "unidad",
  "etapaDetectada",
  "clasificacionRiesgo",
  "causaProbable",
  "alcanceDistribucion",
  "requiereBloqueo",
  "accionInmediata",
  "comunicacionAutoridad",
  "responsableQA",
  "responsableTecnico",
  "estadoInvestigacion",
  "decisionQA",
];

const fieldLabels: Record<keyof RecallRecord, string> = {
  id: "ID",
  codigoRecall: "Código de recall",
  fecha: "Fecha",
  hora: "Hora",
  empresa: "Empresa",
  sede: "Sede / predio",
  tipoEvento: "Tipo de evento",
  origenAlerta: "Origen de la alerta",
  producto: "Producto / material afectado",
  loteAfectado: "Lote afectado",
  cantidadAfectada: "Cantidad afectada",
  unidad: "Unidad",
  etapaDetectada: "Etapa donde se detectó",
  clasificacionRiesgo: "Clasificación de riesgo",
  causaProbable: "Causa probable",
  alcanceDistribucion: "Alcance de distribución",
  clientesAfectados: "Clientes / destinos afectados",
  requiereBloqueo: "Requiere bloqueo",
  accionInmediata: "Acción inmediata",
  comunicacionAutoridad: "Comunicación a autoridad",
  responsableQA: "Responsable QA",
  responsableTecnico: "Responsable técnico",
  estadoInvestigacion: "Estado de investigación",
  porcentajeRecuperado: "Porcentaje recuperado",
  decisionQA: "Decisión QA",
  desviacionAsociada: "Desviación asociada",
  capa: "CAPA",
  evidencia: "Evidencia",
  fechaCierre: "Fecha de cierre",
  observaciones: "Observaciones",
  creadoEn: "Creado en",
  actualizadoEn: "Actualizado en",
};

const fields: FieldConfig[] = [
  { key: "codigoRecall", label: "Código de recall *", placeholder: "RCL-2026-001" },
  { key: "fecha", label: "Fecha *", type: "date" },
  { key: "hora", label: "Hora *", type: "time" },
  { key: "empresa", label: "Empresa *", placeholder: "Growlifecol S.A.S." },
  { key: "sede", label: "Sede / predio *", placeholder: "Sede principal" },
  {
    key: "tipoEvento",
    label: "Tipo de evento *",
    kind: "select",
    options: [
      "Alerta interna",
      "Retiro preventivo",
      "Retiro obligatorio",
      "Bloqueo de lote",
      "Retención comercial",
      "Reclamo crítico",
      "Resultado fuera de especificación",
      "Contaminación potencial",
      "Error de etiquetado",
      "Simulacro de recall",
    ],
  },
  {
    key: "origenAlerta",
    label: "Origen de la alerta *",
    kind: "select",
    options: [
      "QA",
      "QC",
      "Producción",
      "Inventario",
      "Cliente",
      "Proveedor",
      "Autoridad sanitaria",
      "Auditoría",
      "Desviación",
      "Estabilidad",
      "Farmacovigilancia / seguimiento",
    ],
  },
  { key: "producto", label: "Producto / material afectado *", placeholder: "Flor seca, extracto, biomasa, insumo, muestra, lote intermedio..." },
  { key: "loteAfectado", label: "Lote afectado *", placeholder: "LOT-2026-001" },
  { key: "cantidadAfectada", label: "Cantidad afectada *", type: "number", placeholder: "25" },
  {
    key: "unidad",
    label: "Unidad *",
    kind: "select",
    options: ["kg", "g", "L", "mL", "unidades", "cajas", "bolsas", "frascos"],
  },
  {
    key: "etapaDetectada",
    label: "Etapa donde se detectó *",
    kind: "select",
    options: [
      "Cultivo",
      "Cosecha",
      "Secado",
      "Postcosecha",
      "Inventario",
      "Recepción",
      "Calidad QC",
      "Liberación QA",
      "Distribución",
      "Cliente",
      "Postcomercialización",
    ],
  },
  {
    key: "clasificacionRiesgo",
    label: "Clasificación de riesgo *",
    kind: "select",
    options: ["Bajo", "Medio", "Alto", "Crítico"],
  },
  {
    key: "causaProbable",
    label: "Causa probable *",
    kind: "textarea",
    placeholder: "Describe causa probable, defecto, contaminación, desviación, error documental, resultado analítico o motivo del retiro.",
  },
  {
    key: "alcanceDistribucion",
    label: "Alcance de distribución *",
    kind: "select",
    options: [
      "No distribuido",
      "Distribución interna",
      "Un cliente",
      "Múltiples clientes",
      "Distribución nacional",
      "Exportación",
      "Pendiente confirmación",
    ],
  },
  {
    key: "clientesAfectados",
    label: "Clientes / destinos afectados",
    kind: "textarea",
    placeholder: "Lista de clientes, destinos, órdenes, guías, facturas o ubicaciones afectadas.",
  },
  {
    key: "requiereBloqueo",
    label: "Requiere bloqueo *",
    kind: "select",
    options: ["Sí", "No"],
  },
  {
    key: "accionInmediata",
    label: "Acción inmediata *",
    kind: "textarea",
    placeholder: "Bloqueo, cuarentena, comunicación interna, segregación, revisión de inventario, suspensión de despacho.",
  },
  {
    key: "comunicacionAutoridad",
    label: "Comunicación a autoridad *",
    kind: "select",
    options: ["Sí", "No", "Pendiente evaluación QA"],
  },
  { key: "responsableQA", label: "Responsable QA *", placeholder: "Nombre del responsable QA" },
  { key: "responsableTecnico", label: "Responsable técnico *", placeholder: "Director técnico / responsable del proceso" },
  {
    key: "estadoInvestigacion",
    label: "Estado de investigación *",
    kind: "select",
    options: [
      "Abierta",
      "En investigación",
      "En recuperación",
      "Pendiente CAPA",
      "Pendiente autoridad",
      "Cerrada",
      "Cancelada por QA",
    ],
  },
  { key: "porcentajeRecuperado", label: "Porcentaje recuperado", type: "number", placeholder: "80" },
  {
    key: "decisionQA",
    label: "Decisión QA *",
    kind: "select",
    options: [
      "Pendiente QA",
      "Bloqueado QA",
      "Retiro iniciado",
      "Retiro completado",
      "Liberado QA",
      "Rechazado QA",
      "Requiere CAPA",
      "Cierre aprobado QA",
    ],
  },
  { key: "desviacionAsociada", label: "Desviación asociada", placeholder: "DEV-2026-001" },
  {
    key: "capa",
    label: "CAPA",
    kind: "textarea",
    placeholder: "Acciones correctivas y preventivas, responsables, fechas, verificación de eficacia.",
  },
  { key: "evidencia", label: "Evidencia / soporte", placeholder: "Acta, inventario bloqueado, comunicaciones, certificado, fotos, trazabilidad, reporte final..." },
  { key: "fechaCierre", label: "Fecha de cierre", type: "date" },
  {
    key: "observaciones",
    label: "Observaciones",
    kind: "textarea",
    placeholder: "Notas QA, impacto sobre pacientes/clientes, autoridad, recuperación, seguimiento.",
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
  return `RCL-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function loadRecords(): RecallRecord[] {
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

function saveRecords(records: RecallRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export default function RecallPage() {
  const [records, setRecords] = useState<RecallRecord[]>([]);
  const [form, setForm] = useState<RecallRecord>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [cloud, setCloud] = useState<CloudState | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [search, setSearch] = useState("");
  const [filterDecision, setFilterDecision] = useState("Todos");

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

  function updateField(field: keyof RecallRecord, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function needsCapa(): boolean {
    return (
      ["Alto", "Crítico"].includes(form.clasificacionRiesgo) ||
      ["Retiro obligatorio", "Reclamo crítico", "Resultado fuera de especificación", "Contaminación potencial"].includes(form.tipoEvento) ||
      ["Bloqueado QA", "Retiro iniciado", "Retiro completado", "Rechazado QA", "Requiere CAPA"].includes(form.decisionQA)
    );
  }

  function validateForm(): string[] {
    const errors = requiredFields
      .filter((field) => isInvalid(form[field]))
      .map((field) => fieldLabels[field]);

    const quantity = Number(form.cantidadAfectada);

    if (!Number.isFinite(quantity) || quantity <= 0) {
      errors.push("La cantidad afectada debe ser mayor a cero");
    }

    if (form.porcentajeRecuperado) {
      const percent = Number(form.porcentajeRecuperado);

      if (!Number.isFinite(percent) || percent < 0 || percent > 100) {
        errors.push("El porcentaje recuperado debe estar entre 0 y 100");
      }
    }

    if (form.requiereBloqueo === "Sí" && isInvalid(form.evidencia)) {
      errors.push("La evidencia es obligatoria cuando se requiere bloqueo del lote");
    }

    if (["Un cliente", "Múltiples clientes", "Distribución nacional", "Exportación"].includes(form.alcanceDistribucion) && isInvalid(form.clientesAfectados)) {
      errors.push("Los clientes o destinos afectados son obligatorios cuando el lote fue distribuido");
    }

    if (["Alto", "Crítico"].includes(form.clasificacionRiesgo) && form.comunicacionAutoridad === "No") {
      errors.push("Un recall de riesgo Alto o Crítico debe requerir comunicación a autoridad o evaluación QA documentada");
    }

    if (["Retiro completado", "Cierre aprobado QA"].includes(form.decisionQA) && isInvalid(form.fechaCierre)) {
      errors.push("La fecha de cierre es obligatoria cuando el retiro se completa o QA aprueba cierre");
    }

    if (["Retiro completado", "Cierre aprobado QA", "Liberado QA", "Rechazado QA"].includes(form.decisionQA) && isInvalid(form.evidencia)) {
      errors.push("La evidencia es obligatoria para decisiones QA formales");
    }

    if (needsCapa() && isInvalid(form.desviacionAsociada)) {
      errors.push("La desviación asociada es obligatoria para recall de riesgo, retiro, rechazo o CAPA");
    }

    if (needsCapa() && isInvalid(form.capa)) {
      errors.push("La CAPA es obligatoria para recall de riesgo, retiro, rechazo o CAPA");
    }

    return Array.from(new Set(errors));
  }

  function fieldHasError(field: keyof RecallRecord): boolean {
    if (!submitAttempted) return false;

    if (requiredFields.includes(field) && isInvalid(form[field])) return true;

    if (field === "cantidadAfectada") {
      const quantity = Number(form.cantidadAfectada);
      return !Number.isFinite(quantity) || quantity <= 0;
    }

    if (field === "porcentajeRecuperado" && form.porcentajeRecuperado) {
      const percent = Number(form.porcentajeRecuperado);
      return !Number.isFinite(percent) || percent < 0 || percent > 100;
    }

    if (field === "clientesAfectados" && ["Un cliente", "Múltiples clientes", "Distribución nacional", "Exportación"].includes(form.alcanceDistribucion) && isInvalid(form.clientesAfectados)) return true;
    if (field === "evidencia" && form.requiereBloqueo === "Sí" && isInvalid(form.evidencia)) return true;
    if (field === "fechaCierre" && ["Retiro completado", "Cierre aprobado QA"].includes(form.decisionQA) && isInvalid(form.fechaCierre)) return true;
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
      showCloud("No se guardó el recall. Completa la información obligatoria.", errors, "warning");
      return;
    }

    const timestamp = nowIso();

    const payload: RecallRecord = {
      ...form,
      codigoRecall: clean(form.codigoRecall),
      fecha: clean(form.fecha),
      hora: clean(form.hora),
      empresa: clean(form.empresa),
      sede: clean(form.sede),
      tipoEvento: clean(form.tipoEvento),
      origenAlerta: clean(form.origenAlerta),
      producto: clean(form.producto),
      loteAfectado: clean(form.loteAfectado),
      cantidadAfectada: clean(form.cantidadAfectada),
      unidad: clean(form.unidad),
      etapaDetectada: clean(form.etapaDetectada),
      clasificacionRiesgo: clean(form.clasificacionRiesgo),
      causaProbable: clean(form.causaProbable),
      alcanceDistribucion: clean(form.alcanceDistribucion),
      clientesAfectados: clean(form.clientesAfectados),
      requiereBloqueo: clean(form.requiereBloqueo),
      accionInmediata: clean(form.accionInmediata),
      comunicacionAutoridad: clean(form.comunicacionAutoridad),
      responsableQA: clean(form.responsableQA),
      responsableTecnico: clean(form.responsableTecnico),
      estadoInvestigacion: clean(form.estadoInvestigacion),
      porcentajeRecuperado: clean(form.porcentajeRecuperado),
      decisionQA: clean(form.decisionQA),
      desviacionAsociada: clean(form.desviacionAsociada),
      capa: clean(form.capa),
      evidencia: clean(form.evidencia),
      fechaCierre: clean(form.fechaCierre),
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
      editingId ? "Recall actualizado correctamente." : "Recall registrado correctamente con control GMP.",
      [],
      "success"
    );
  }

  function handleEdit(record: RecallRecord) {
    setForm(record);
    setEditingId(record.id);
    setSubmitAttempted(false);
    showCloud("Registro cargado para edición. Verifica antes de actualizar.", [], "success");
  }

  function handleDelete(id: string) {
    const confirmed = window.confirm("¿Confirmas eliminar este recall? En ambiente GMP real debería manejarse como anulación auditada.");
    if (!confirmed) return;

    const nextRecords = records.filter((record) => record.id !== id);
    setRecords(nextRecords);
    saveRecords(nextRecords);
    showCloud("Recall eliminado del almacenamiento local.", [], "success");
  }

  function exportJson() {
    if (records.length === 0) {
      showCloud("No hay registros de recall para exportar.", [], "warning");
      return;
    }

    const blob = new Blob([JSON.stringify(records, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `floratrack-recall-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);

    showCloud("Archivo JSON de recall exportado correctamente.", [], "success");
  }

  const filteredRecords = useMemo(() => {
    const term = clean(search).toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        !term ||
        [
          record.codigoRecall,
          record.empresa,
          record.sede,
          record.tipoEvento,
          record.producto,
          record.loteAfectado,
          record.clasificacionRiesgo,
          record.estadoInvestigacion,
          record.decisionQA,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

      const matchesDecision = filterDecision === "Todos" || record.decisionQA === filterDecision;

      return matchesSearch && matchesDecision;
    });
  }, [records, search, filterDecision]);

  const dashboard = useMemo(() => {
    return {
      total: records.length,
      abiertos: records.filter((record) => ["Abierta", "En investigación", "En recuperación"].includes(record.estadoInvestigacion)).length,
      altoRiesgo: records.filter((record) => ["Alto", "Crítico"].includes(record.clasificacionRiesgo)).length,
      completados: records.filter((record) => ["Retiro completado", "Cierre aprobado QA"].includes(record.decisionQA)).length,
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
        <header className="rounded-3xl border border-red-400/20 bg-slate-900/80 p-6 shadow-2xl shadow-red-950/30">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-red-300">
                FloraTrack Enterprise Compliance Platform
              </p>

              <h1 className="mt-3 text-3xl font-black text-white md:text-5xl">
                Recall y retiro de producto GMP
              </h1>

              <p className="mt-3 max-w-5xl text-sm leading-6 text-slate-300 md:text-base">
                Gestión de alertas, bloqueo de lote, retiro preventivo u obligatorio,
                comunicación a autoridad, recuperación de producto, desviación, CAPA,
                evidencia y cierre QA.
              </p>
            </div>

            <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-5 py-4 text-sm text-red-100">
              <p className="font-bold">Recall GMP activo</p>
              <p className="mt-1 text-red-200">Alerta · Bloqueo · Retiro · Autoridad · QA</p>
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
          <Metric title="Recall" value={dashboard.total} />
          <Metric title="Abiertos" value={dashboard.abiertos} tone="amber" />
          <Metric title="Alto / crítico" value={dashboard.altoRiesgo} tone="red" />
          <Metric title="Completados" value={dashboard.completados} tone="emerald" />
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
                <h2 className="text-2xl font-black text-white">{editingId ? "Editar recall" : "Nuevo recall"}</h2>
                <p className="mt-1 text-sm text-slate-400">Ningún recall puede guardarse vacío o incompleto.</p>
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
                  : "border-slate-700 bg-slate-950 focus:border-red-400 focus:ring-4 focus:ring-red-400/40";

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

                      {hasError && <p className="mt-1 text-xs font-bold text-red-300">Campo obligatorio o condición de recall requerida.</p>}
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
              <button type="button" onClick={handleSave} className="rounded-2xl bg-red-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-red-950/50 transition hover:bg-red-400">
                {editingId ? "Actualizar recall" : "Guardar recall"}
              </button>

              <button type="button" onClick={resetForm} className="rounded-2xl border border-slate-600 px-6 py-3 text-sm font-bold text-slate-200 transition hover:bg-slate-800">
                Limpiar formulario
              </button>
            </div>
          </form>

          <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">Registro maestro de recall</h2>
                <p className="mt-1 text-sm text-slate-400">Consulta, filtra, edita y exporta alertas y retiros.</p>
              </div>

              <button type="button" onClick={exportJson} className="rounded-2xl border border-red-400/50 px-5 py-3 text-sm font-bold text-red-200 transition hover:bg-red-500/10">
                Exportar JSON
              </button>
            </div>

            <div className="mb-5 grid gap-3 md:grid-cols-[1fr_250px]">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-red-400/40 transition placeholder:text-slate-600 focus:border-red-400 focus:ring-4"
                placeholder="Buscar por código, producto, lote, riesgo, QA..."
              />

              <select
                value={filterDecision}
                onChange={(event) => setFilterDecision(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-red-400/40 transition focus:border-red-400 focus:ring-4"
              >
                <option>Todos</option>
                <option>Pendiente QA</option>
                <option>Bloqueado QA</option>
                <option>Retiro iniciado</option>
                <option>Retiro completado</option>
                <option>Liberado QA</option>
                <option>Rechazado QA</option>
                <option>Requiere CAPA</option>
                <option>Cierre aprobado QA</option>
              </select>
            </div>

            <div className="max-h-[780px] space-y-4 overflow-auto pr-2">
              {filteredRecords.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center text-sm text-slate-400">
                  No hay recall registrados. Crea el primer registro con datos completos.
                </div>
              ) : (
                filteredRecords.map((record) => (
                  <article key={record.id} className="rounded-2xl border border-slate-700 bg-slate-950 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-white">{record.codigoRecall} · {record.producto}</h3>
                          <StatusPill value={record.decisionQA} />
                          <span className="rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1 text-xs font-bold text-red-200">
                            Riesgo {record.clasificacionRiesgo}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-400">
                          {record.fecha} · {record.hora} · Lote {record.loteAfectado} · {record.cantidadAfectada} {record.unidad}
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
                      <Data label="Tipo evento" value={record.tipoEvento} />
                      <Data label="Origen alerta" value={record.origenAlerta} />
                      <Data label="Etapa detectada" value={record.etapaDetectada} />
                      <Data label="Alcance distribución" value={record.alcanceDistribucion} />
                      <Data label="Bloqueo" value={record.requiereBloqueo} />
                      <Data label="Autoridad" value={record.comunicacionAutoridad} />
                      <Data label="QA" value={record.responsableQA} />
                      <Data label="Técnico" value={record.responsableTecnico} />
                      <Data label="Investigación" value={record.estadoInvestigacion} />
                      <Data label="Recuperado" value={record.porcentajeRecuperado ? `${record.porcentajeRecuperado}%` : "Sin registro"} />
                      <Data label="Desviación" value={record.desviacionAsociada || "Sin registro"} />
                      <Data label="Fecha cierre" value={record.fechaCierre || "Sin registro"} />
                      <Data label="Evidencia" value={record.evidencia || "Sin registro"} />
                    </div>

                    <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300">
                      <p><span className="font-bold text-slate-100">Causa probable: </span>{record.causaProbable}</p>
                      <p className="mt-2"><span className="font-bold text-slate-100">Acción inmediata: </span>{record.accionInmediata}</p>

                      {record.clientesAfectados && (
                        <p className="mt-2"><span className="font-bold text-slate-100">Clientes / destinos: </span>{record.clientesAfectados}</p>
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
    value === "Cierre aprobado QA" || value === "Liberado QA" || value === "Retiro completado"
      ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
      : value === "Pendiente QA"
      ? "border-amber-400/40 bg-amber-500/10 text-amber-200"
      : "border-red-400/40 bg-red-500/10 text-red-200";

  return <span className={`rounded-full border px-3 py-1 text-xs font-bold ${className}`}>{value || "Sin QA"}</span>;
}
