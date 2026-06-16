"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

type PostExtractionRecord = {
  id: string;
  codigoProceso: string;
  fechaProceso: string;
  horaProceso: string;
  empresa: string;
  sede: string;
  responsableProceso: string;
  responsableQA: string;
  etapaProceso: string;
  productoIntermedio: string;
  loteEntrada: string;
  loteSalida: string;
  materialEntrada: string;
  masaEntrada: string;
  masaSalida: string;
  equipo: string;
  sala: string;
  insumoCritico: string;
  loteInsumo: string;
  certificadoInsumo: string;
  parametroCriticoUno: string;
  parametroCriticoDos: string;
  limpiezaEquipo: string;
  estadoEquipo: string;
  controlAmbiental: string;
  estadoSanitario: string;
  controlesCriticos: string;
  estadoQA: string;
  decisionQA: string;
  evidencia: string;
  desviacionAsociada: string;
  capa: string;
  observaciones: string;
  creadoEn: string;
  actualizadoEn: string;
};

type Notice = {
  type: "success" | "warning";
  title: string;
  items: string[];
};

const STORAGE_KEY = "floratrack_post_extraccion_gmp_v1";

const emptyForm: PostExtractionRecord = {
  id: "",
  codigoProceso: "",
  fechaProceso: "",
  horaProceso: "",
  empresa: "",
  sede: "",
  responsableProceso: "",
  responsableQA: "",
  etapaProceso: "",
  productoIntermedio: "",
  loteEntrada: "",
  loteSalida: "",
  materialEntrada: "",
  masaEntrada: "",
  masaSalida: "",
  equipo: "",
  sala: "",
  insumoCritico: "",
  loteInsumo: "",
  certificadoInsumo: "",
  parametroCriticoUno: "",
  parametroCriticoDos: "",
  limpiezaEquipo: "",
  estadoEquipo: "",
  controlAmbiental: "",
  estadoSanitario: "",
  controlesCriticos: "",
  estadoQA: "",
  decisionQA: "",
  evidencia: "",
  desviacionAsociada: "",
  capa: "",
  observaciones: "",
  creadoEn: "",
  actualizadoEn: "",
};

const requiredFields: Array<keyof PostExtractionRecord> = [
  "codigoProceso",
  "fechaProceso",
  "horaProceso",
  "empresa",
  "sede",
  "responsableProceso",
  "responsableQA",
  "etapaProceso",
  "productoIntermedio",
  "loteEntrada",
  "materialEntrada",
  "masaEntrada",
  "masaSalida",
  "equipo",
  "sala",
  "insumoCritico",
  "loteInsumo",
  "certificadoInsumo",
  "parametroCriticoUno",
  "parametroCriticoDos",
  "limpiezaEquipo",
  "estadoEquipo",
  "controlAmbiental",
  "estadoSanitario",
  "controlesCriticos",
  "estadoQA",
  "decisionQA",
];

const labels: Record<keyof PostExtractionRecord, string> = {
  id: "ID",
  codigoProceso: "Código de proceso",
  fechaProceso: "Fecha de proceso",
  horaProceso: "Hora de proceso",
  empresa: "Empresa",
  sede: "Sede / planta",
  responsableProceso: "Responsable de proceso",
  responsableQA: "Responsable QA",
  etapaProceso: "Etapa de post-extracción",
  productoIntermedio: "Producto intermedio",
  loteEntrada: "Lote de entrada",
  loteSalida: "Lote de salida",
  materialEntrada: "Material de entrada",
  masaEntrada: "Masa de entrada",
  masaSalida: "Masa de salida",
  equipo: "Equipo",
  sala: "Sala / área",
  insumoCritico: "Insumo crítico",
  loteInsumo: "Lote de insumo",
  certificadoInsumo: "Certificado de insumo",
  parametroCriticoUno: "Parámetro crítico 1",
  parametroCriticoDos: "Parámetro crítico 2",
  limpiezaEquipo: "Limpieza de equipo",
  estadoEquipo: "Estado del equipo",
  controlAmbiental: "Control ambiental",
  estadoSanitario: "Estado sanitario",
  controlesCriticos: "Controles críticos",
  estadoQA: "Estado QA",
  decisionQA: "Decisión QA",
  evidencia: "Evidencia",
  desviacionAsociada: "Desviación asociada",
  capa: "CAPA",
  observaciones: "Observaciones",
  creadoEn: "Creado en",
  actualizadoEn: "Actualizado en",
};

const etapaOptions = [
  "Recepción de extracto crudo",
  "Winterización documentada",
  "Filtración documentada",
  "Decarboxilación documentada",
  "Destilación documentada",
  "Homogeneización",
  "Fraccionamiento",
  "Remediación aprobada por QA",
  "Formulación intermedia",
  "Cuarentena QA",
  "Muestreo QC",
  "Liberación QA",
];

const materialOptions = [
  "Crude extract BHO",
  "Crude extract CO2",
  "Crude extract etanol",
  "Live resin",
  "Live rosin",
  "Bubble hash",
  "Destilado intermedio",
  "Fracción aprobada QA",
  "Material de reproceso aprobado QA",
];

const statusOptions = [
  "Pendiente QA",
  "Cuarentena",
  "Retenido",
  "Liberado",
  "Aprobado",
  "Aprobado con observación",
  "Rechazado",
  "Bloqueado",
];

const decisionOptions = [
  "Pendiente QA",
  "Aprobado QA",
  "Aprobado con observación QA",
  "Rechazado QA",
  "Requiere CAPA",
  "Requiere investigación",
  "Requiere reproceso",
  "Cierre aprobado QA",
];

function clean(value: unknown): string {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function isBlank(value: unknown): boolean {
  const text = clean(value).toLowerCase();
  return ["", "seleccione", "seleccionar", "null", "undefined", "n/a", "na"].includes(text);
}

function toNumber(value: string): number {
  return Number(clean(value));
}

function nowIso(): string {
  return new Date().toISOString();
}

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `POST-EXT-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function loadRecords(): PostExtractionRecord[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveRecords(records: PostExtractionRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function calculateYield(form: PostExtractionRecord): number {
  const input = toNumber(form.masaEntrada);
  const output = toNumber(form.masaSalida);

  if (!Number.isFinite(input) || !Number.isFinite(output) || input <= 0) {
    return 0;
  }

  return Math.round((output / input) * 10000) / 100;
}

function needsCapa(form: PostExtractionRecord): boolean {
  return (
    ["Rechazado QA", "Requiere CAPA", "Requiere investigación", "Requiere reproceso"].includes(form.decisionQA) ||
    ["Rechazado", "Retenido", "Cuarentena", "Bloqueado"].includes(form.estadoQA) ||
    ["No conforme"].includes(form.limpiezaEquipo) ||
    ["No conforme"].includes(form.estadoEquipo) ||
    ["No conforme"].includes(form.controlAmbiental) ||
    ["No conforme"].includes(form.estadoSanitario)
  );
}

export default function PostExtraccionPage() {
  const [records, setRecords] = useState<PostExtractionRecord[]>([]);
  const [form, setForm] = useState<PostExtractionRecord>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("Todos");

  useEffect(() => {
    setRecords(loadRecords());
  }, []);

  function updateField(field: keyof PostExtractionRecord, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function showNotice(type: Notice["type"], title: string, items: string[] = []) {
    setNotice({ type, title, items });

    window.setTimeout(() => {
      setNotice(null);
    }, items.length > 0 ? 12000 : 6000);
  }

  function validate(): string[] {
    const errors = requiredFields
      .filter((field) => isBlank(form[field]))
      .map((field) => labels[field]);

    const inputMass = toNumber(form.masaEntrada);
    const outputMass = toNumber(form.masaSalida);

    if (!Number.isFinite(inputMass) || inputMass <= 0) {
      errors.push("La masa de entrada debe ser mayor a cero");
    }

    if (!Number.isFinite(outputMass) || outputMass < 0) {
      errors.push("La masa de salida debe ser un número igual o mayor a cero");
    }

    if (Number.isFinite(inputMass) && Number.isFinite(outputMass) && outputMass > inputMass) {
      errors.push("La masa de salida no puede superar la masa de entrada sin justificación de formulación documentada");
    }

    if (["Liberado", "Aprobado", "Aprobado con observación"].includes(form.estadoQA) && isBlank(form.evidencia)) {
      errors.push("La evidencia es obligatoria para liberación o aprobación QA");
    }

    if (["Aprobado QA", "Aprobado con observación QA", "Rechazado QA"].includes(form.decisionQA) && isBlank(form.evidencia)) {
      errors.push("La evidencia es obligatoria para decisiones QA formales");
    }

    if (needsCapa(form) && isBlank(form.desviacionAsociada)) {
      errors.push("La desviación asociada es obligatoria si hay retención, rechazo, cuarentena, no conformidad, investigación o CAPA");
    }

    if (needsCapa(form) && isBlank(form.capa)) {
      errors.push("La CAPA es obligatoria si hay retención, rechazo, cuarentena, no conformidad, investigación o CAPA");
    }

    return Array.from(new Set(errors));
  }

  function fieldHasError(field: keyof PostExtractionRecord): boolean {
    if (!submitAttempted) return false;

    if (requiredFields.includes(field) && isBlank(form[field])) return true;

    if (field === "masaEntrada") {
      const value = toNumber(form.masaEntrada);
      return !Number.isFinite(value) || value <= 0;
    }

    if (field === "masaSalida") {
      const input = toNumber(form.masaEntrada);
      const output = toNumber(form.masaSalida);
      return !Number.isFinite(output) || output < 0 || (Number.isFinite(input) && output > input);
    }

    if (field === "evidencia" && ["Liberado", "Aprobado", "Aprobado con observación"].includes(form.estadoQA) && isBlank(form.evidencia)) return true;
    if (field === "evidencia" && ["Aprobado QA", "Aprobado con observación QA", "Rechazado QA"].includes(form.decisionQA) && isBlank(form.evidencia)) return true;
    if (field === "desviacionAsociada" && needsCapa(form) && isBlank(form.desviacionAsociada)) return true;
    if (field === "capa" && needsCapa(form) && isBlank(form.capa)) return true;

    return false;
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setSubmitAttempted(false);
  }

  function handleSave() {
    setSubmitAttempted(true);

    const errors = validate();

    if (errors.length > 0) {
      showNotice("warning", "No se guardó el proceso post-extracción. Completa la información obligatoria.", errors);
      return;
    }

    const timestamp = nowIso();

    const payload: PostExtractionRecord = {
      ...form,
      id: editingId ?? createId(),
      codigoProceso: clean(form.codigoProceso),
      fechaProceso: clean(form.fechaProceso),
      horaProceso: clean(form.horaProceso),
      empresa: clean(form.empresa),
      sede: clean(form.sede),
      responsableProceso: clean(form.responsableProceso),
      responsableQA: clean(form.responsableQA),
      etapaProceso: clean(form.etapaProceso),
      productoIntermedio: clean(form.productoIntermedio),
      loteEntrada: clean(form.loteEntrada),
      loteSalida: clean(form.loteSalida),
      materialEntrada: clean(form.materialEntrada),
      masaEntrada: clean(form.masaEntrada),
      masaSalida: clean(form.masaSalida),
      equipo: clean(form.equipo),
      sala: clean(form.sala),
      insumoCritico: clean(form.insumoCritico),
      loteInsumo: clean(form.loteInsumo),
      certificadoInsumo: clean(form.certificadoInsumo),
      parametroCriticoUno: clean(form.parametroCriticoUno),
      parametroCriticoDos: clean(form.parametroCriticoDos),
      limpiezaEquipo: clean(form.limpiezaEquipo),
      estadoEquipo: clean(form.estadoEquipo),
      controlAmbiental: clean(form.controlAmbiental),
      estadoSanitario: clean(form.estadoSanitario),
      controlesCriticos: clean(form.controlesCriticos),
      estadoQA: clean(form.estadoQA),
      decisionQA: clean(form.decisionQA),
      evidencia: clean(form.evidencia),
      desviacionAsociada: clean(form.desviacionAsociada),
      capa: clean(form.capa),
      observaciones: clean(form.observaciones),
      creadoEn: editingId ? form.creadoEn : timestamp,
      actualizadoEn: timestamp,
    };

    const nextRecords = editingId
      ? records.map((record) => (record.id === editingId ? payload : record))
      : [payload, ...records];

    setRecords(nextRecords);
    saveRecords(nextRecords);
    resetForm();

    showNotice(
      "success",
      editingId
        ? "Proceso post-extracción actualizado correctamente."
        : "Proceso post-extracción registrado correctamente con trazabilidad QA."
    );
  }

  function handleEdit(record: PostExtractionRecord) {
    setForm(record);
    setEditingId(record.id);
    setSubmitAttempted(false);
    showNotice("success", "Registro cargado para edición.");
  }

  function handleDelete(id: string) {
    const confirmed = window.confirm("¿Confirmas eliminar este registro? En ambiente GMP real debería manejarse como anulación auditada.");
    if (!confirmed) return;

    const nextRecords = records.filter((record) => record.id !== id);
    setRecords(nextRecords);
    saveRecords(nextRecords);
    showNotice("success", "Registro eliminado del almacenamiento local.");
  }

  function exportJson() {
    if (records.length === 0) {
      showNotice("warning", "No hay registros para exportar.");
      return;
    }

    const blob = new Blob([JSON.stringify(records, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `floratrack-post-extraccion-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();

    URL.revokeObjectURL(url);
    showNotice("success", "Archivo JSON exportado correctamente.");
  }

  const filteredRecords = useMemo(() => {
    const term = clean(search).toLowerCase();

    return records.filter((record) => {
      const text = [
        record.codigoProceso,
        record.productoIntermedio,
        record.loteEntrada,
        record.loteSalida,
        record.materialEntrada,
        record.etapaProceso,
        record.estadoQA,
        record.decisionQA,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !term || text.includes(term);
      const matchesEstado = filterEstado === "Todos" || record.estadoQA === filterEstado;

      return matchesSearch && matchesEstado;
    });
  }, [records, search, filterEstado]);

  const metrics = useMemo(() => {
    return {
      total: records.length,
      liberados: records.filter((record) => ["Liberado", "Aprobado"].includes(record.estadoQA)).length,
      cuarentena: records.filter((record) => ["Cuarentena", "Retenido", "Bloqueado"].includes(record.estadoQA)).length,
      rechazados: records.filter((record) => ["Rechazado"].includes(record.estadoQA)).length,
      qa: records.filter((record) => record.decisionQA !== "Pendiente QA").length,
    };
  }, [records]);

  const yieldValue = calculateYield(form);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-slate-100">
      {notice && (
        <CloudNoticeBox notice={notice} onClose={() => setNotice(null)} />
      )}

      <section className="mx-auto max-w-7xl space-y-6">
        <header className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-fuchsia-700 via-indigo-700 to-slate-950 p-7 text-white shadow-2xl">
          <div className="absolute right-0 top-0 h-48 w-48 translate-x-16 -translate-y-16 rounded-full bg-white/15 blur-2xl" />
          <div className="absolute bottom-0 left-10 h-32 w-32 rounded-full bg-cyan-400/20 blur-2xl" />

          <div className="relative">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-white/70">
              FloraTrack GMP Manufacturing Suite
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
              Post-Extracción GMP
            </h1>

            <p className="mt-3 max-w-5xl text-base font-semibold leading-8 text-white/85">
              Trazabilidad premium de etapas posteriores a extracción: winterización, filtración,
              decarboxilación, destilación, fraccionamiento, remediación aprobada por QA,
              formulación intermedia, cuarentena, evidencia, desviaciones, CAPA y liberación QA.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <Badge>GMP</Badge>
              <Badge>QA</Badge>
              <Badge>Post-Extracción</Badge>
              <Badge>Batch Record</Badge>
              <Badge>Sin receta operacional</Badge>
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-5">
          <Metric title="Registros" value={metrics.total} />
          <Metric title="Liberados" value={metrics.liberados} tone="emerald" />
          <Metric title="Cuarentena" value={metrics.cuarentena} tone="amber" />
          <Metric title="Rechazados" value={metrics.rechazados} tone="red" />
          <Metric title="Con decisión QA" value={metrics.qa} tone="sky" />
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <form
            noValidate
            className="rounded-[2rem] border border-slate-700 bg-slate-900 p-6 shadow-xl"
            onSubmit={(event) => {
              event.preventDefault();
              handleSave();
            }}
          >
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">
                  {editingId ? "Editar proceso" : "Nuevo proceso post-extracción"}
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Ningún proceso puede guardarse vacío o incompleto.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-xs font-black uppercase tracking-wide text-slate-400">Rendimiento calculado</p>
                <p className="text-2xl font-black text-white">{yieldValue}%</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <TextField label="Código de proceso *" field="codigoProceso" form={form} updateField={updateField} error={fieldHasError("codigoProceso")} placeholder="POST-EXT-2026-001" />
              <TextField label="Fecha de proceso *" field="fechaProceso" form={form} updateField={updateField} error={fieldHasError("fechaProceso")} type="date" />
              <TextField label="Hora de proceso *" field="horaProceso" form={form} updateField={updateField} error={fieldHasError("horaProceso")} type="time" />
              <TextField label="Empresa *" field="empresa" form={form} updateField={updateField} error={fieldHasError("empresa")} placeholder="Growlifecol S.A.S." />
              <TextField label="Sede / planta *" field="sede" form={form} updateField={updateField} error={fieldHasError("sede")} placeholder="Planta de manufactura" />
              <TextField label="Responsable de proceso *" field="responsableProceso" form={form} updateField={updateField} error={fieldHasError("responsableProceso")} placeholder="Responsable técnico" />
              <TextField label="Responsable QA *" field="responsableQA" form={form} updateField={updateField} error={fieldHasError("responsableQA")} placeholder="QA" />

              <SelectField label="Etapa de post-extracción *" field="etapaProceso" form={form} updateField={updateField} error={fieldHasError("etapaProceso")} options={etapaOptions} />
              <SelectField label="Material de entrada *" field="materialEntrada" form={form} updateField={updateField} error={fieldHasError("materialEntrada")} options={materialOptions} />

              <TextField label="Producto intermedio *" field="productoIntermedio" form={form} updateField={updateField} error={fieldHasError("productoIntermedio")} placeholder="Crude winterizado / destilado / fracción" />
              <TextField label="Lote de entrada *" field="loteEntrada" form={form} updateField={updateField} error={fieldHasError("loteEntrada")} placeholder="EXT-2026-001" />
              <TextField label="Lote de salida" field="loteSalida" form={form} updateField={updateField} error={false} placeholder="POST-2026-001" />

              <TextField label="Masa de entrada g *" field="masaEntrada" form={form} updateField={updateField} error={fieldHasError("masaEntrada")} type="number" placeholder="1000" />
              <TextField label="Masa de salida g *" field="masaSalida" form={form} updateField={updateField} error={fieldHasError("masaSalida")} type="number" placeholder="850" />

              <TextField label="Equipo *" field="equipo" form={form} updateField={updateField} error={fieldHasError("equipo")} placeholder="Código de equipo" />
              <TextField label="Sala / área *" field="sala" form={form} updateField={updateField} error={fieldHasError("sala")} placeholder="Sala GMP" />

              <TextField label="Insumo crítico *" field="insumoCritico" form={form} updateField={updateField} error={fieldHasError("insumoCritico")} placeholder="Insumo crítico o No aplica documentado" />
              <TextField label="Lote de insumo *" field="loteInsumo" form={form} updateField={updateField} error={fieldHasError("loteInsumo")} placeholder="Lote / No aplica documentado" />
              <TextField label="Certificado de insumo *" field="certificadoInsumo" form={form} updateField={updateField} error={fieldHasError("certificadoInsumo")} placeholder="COA / certificado / referencia" />

              <TextField label="Parámetro crítico 1 *" field="parametroCriticoUno" form={form} updateField={updateField} error={fieldHasError("parametroCriticoUno")} placeholder="Registro documentado aprobado por SOP" />
              <TextField label="Parámetro crítico 2 *" field="parametroCriticoDos" form={form} updateField={updateField} error={fieldHasError("parametroCriticoDos")} placeholder="Registro documentado aprobado por SOP" />

              <SelectField label="Limpieza de equipo *" field="limpiezaEquipo" form={form} updateField={updateField} error={fieldHasError("limpiezaEquipo")} options={["Conforme", "Con observación", "No conforme", "Pendiente QA"]} />
              <SelectField label="Estado del equipo *" field="estadoEquipo" form={form} updateField={updateField} error={fieldHasError("estadoEquipo")} options={["Conforme", "Con observación", "No conforme", "Mantenimiento requerido", "Pendiente QA"]} />
              <SelectField label="Control ambiental *" field="controlAmbiental" form={form} updateField={updateField} error={fieldHasError("controlAmbiental")} options={["Conforme", "Con observación", "No conforme", "No aplica documentado"]} />
              <SelectField label="Estado sanitario *" field="estadoSanitario" form={form} updateField={updateField} error={fieldHasError("estadoSanitario")} options={["Conforme", "Con observación", "No conforme", "Pendiente QA"]} />

              <SelectField label="Estado QA *" field="estadoQA" form={form} updateField={updateField} error={fieldHasError("estadoQA")} options={statusOptions} />
              <SelectField label="Decisión QA *" field="decisionQA" form={form} updateField={updateField} error={fieldHasError("decisionQA")} options={decisionOptions} />

              <TextField label="Evidencia / soporte" field="evidencia" form={form} updateField={updateField} error={fieldHasError("evidencia")} placeholder="Batch record, limpieza, equipo, COA, firma, log..." />
              <TextField label="Desviación asociada" field="desviacionAsociada" form={form} updateField={updateField} error={fieldHasError("desviacionAsociada")} placeholder="DEV-2026-001 / CAPA-001" />

              <TextAreaField label="Controles críticos *" field="controlesCriticos" form={form} updateField={updateField} error={fieldHasError("controlesCriticos")} placeholder="Controles de limpieza, equipo, insumos, ambiente, trazabilidad, QA, evidencia y liberación." />
              <TextAreaField label="CAPA" field="capa" form={form} updateField={updateField} error={fieldHasError("capa")} placeholder="Obligatoria si hay rechazo, retención, no conformidad, investigación o CAPA." />
              <TextAreaField label="Observaciones" field="observaciones" form={form} updateField={updateField} error={false} placeholder="Notas QA, restricciones, seguimiento o justificación técnica." />
            </div>

            <div className="mt-6 flex flex-col gap-3 md:flex-row">
              <button type="button" onClick={handleSave} className="rounded-2xl bg-gradient-to-r from-fuchsia-600 to-indigo-500 px-6 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5">
                {editingId ? "Actualizar proceso" : "Guardar proceso"}
              </button>

              <button type="button" onClick={resetForm} className="rounded-2xl border border-slate-600 px-6 py-3 text-sm font-bold text-slate-200 transition hover:bg-slate-800">
                Limpiar formulario
              </button>
            </div>
          </form>

          <section className="rounded-[2rem] border border-slate-700 bg-slate-900 p-6 shadow-xl">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">Registro maestro</h2>
                <p className="mt-1 text-sm text-slate-400">Consulta, filtra, edita y exporta trazabilidad post-extracción.</p>
              </div>

              <button type="button" onClick={exportJson} className="rounded-2xl border border-white/20 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10">
                Exportar JSON
              </button>
            </div>

            <div className="mb-5 grid gap-3 md:grid-cols-[1fr_230px]">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-white/20 transition placeholder:text-slate-600 focus:border-white/40 focus:ring-4"
                placeholder="Buscar por código, lote, etapa, producto, estado..."
              />

              <select
                value={filterEstado}
                onChange={(event) => setFilterEstado(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-white/20 transition focus:border-white/40 focus:ring-4"
              >
                <option>Todos</option>
                {statusOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="max-h-[780px] space-y-4 overflow-auto pr-2">
              {filteredRecords.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center text-sm text-slate-400">
                  No hay registros post-extracción. Crea el primer registro con datos completos.
                </div>
              ) : (
                filteredRecords.map((record) => (
                  <article key={record.id} className="rounded-2xl border border-slate-700 bg-slate-950 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-white">{record.codigoProceso} · {record.productoIntermedio}</h3>
                          <StatusPill value={record.estadoQA} />
                          <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-bold text-slate-200">
                            {record.etapaProceso}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-400">
                          Entrada {record.loteEntrada} · Salida {record.loteSalida || "sin asignar"} · Rendimiento {calculateYield(record)}%
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
                      <Data label="Material" value={record.materialEntrada} />
                      <Data label="Masa entrada / salida" value={`${record.masaEntrada} g / ${record.masaSalida} g`} />
                      <Data label="Equipo" value={record.equipo} />
                      <Data label="Sala" value={record.sala} />
                      <Data label="Insumo crítico" value={record.insumoCritico} />
                      <Data label="Certificado" value={record.certificadoInsumo} />
                      <Data label="Limpieza" value={record.limpiezaEquipo} />
                      <Data label="Equipo estado" value={record.estadoEquipo} />
                      <Data label="Ambiental" value={record.controlAmbiental} />
                      <Data label="Sanitario" value={record.estadoSanitario} />
                      <Data label="Decisión QA" value={record.decisionQA} />
                      <Data label="Evidencia" value={record.evidencia || "Sin registro"} />
                    </div>

                    <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300">
                      <p><span className="font-bold text-slate-100">Controles críticos: </span>{record.controlesCriticos}</p>

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

function CloudNoticeBox({ notice, onClose }: { notice: Notice; onClose: () => void }) {
  const success = notice.type === "success";

  return (
    <div role="alert" aria-live="assertive" className="fixed right-5 top-5 z-[9999] w-[min(94vw,620px)]">
      <section className={`rounded-[2rem] border-2 bg-slate-950 p-6 text-white shadow-2xl ${success ? "border-emerald-300" : "border-amber-300"}`}>
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className={`text-xs font-black uppercase tracking-[0.28em] ${success ? "text-emerald-200" : "text-amber-200"}`}>
              FloraTrack Cloud Notice
            </p>

            <p className="mt-2 text-lg font-black leading-snug text-white md:text-xl">{notice.title}</p>

            {notice.items.length > 0 && (
              <div className="mt-5 rounded-3xl border border-white/20 bg-white p-5 text-slate-950 shadow-xl">
                <p className="text-sm font-black uppercase tracking-wide text-slate-700">Información pendiente antes de guardar</p>

                <ul className="mt-3 max-h-64 list-disc space-y-2 overflow-auto pl-5 text-sm font-bold leading-relaxed text-slate-950">
                  {notice.items.map((item) => <li key={item}>{item}</li>)}
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

function TextField({
  label,
  field,
  form,
  updateField,
  error,
  placeholder,
  type = "text",
}: {
  label: string;
  field: keyof PostExtractionRecord;
  form: PostExtractionRecord;
  updateField: (field: keyof PostExtractionRecord, value: string) => void;
  error: boolean;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label>
      <span className="mb-2 block text-sm font-bold text-slate-200">{label}</span>

      <input
        type={type}
        value={form[field]}
        onChange={(event) => updateField(field, event.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-2xl border px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 ${
          error ? "border-red-400 bg-red-950/30 ring-4 ring-red-400/20" : "border-slate-700 bg-slate-950 focus:border-white/40 focus:ring-4 focus:ring-white/10"
        }`}
      />

      {error && <p className="mt-1 text-xs font-bold text-red-300">Completa o corrige este campo.</p>}
    </label>
  );
}

function SelectField({
  label,
  field,
  form,
  updateField,
  error,
  options,
}: {
  label: string;
  field: keyof PostExtractionRecord;
  form: PostExtractionRecord;
  updateField: (field: keyof PostExtractionRecord, value: string) => void;
  error: boolean;
  options: string[];
}) {
  return (
    <label>
      <span className="mb-2 block text-sm font-bold text-slate-200">{label}</span>

      <select
        value={form[field]}
        onChange={(event) => updateField(field, event.target.value)}
        className={`w-full rounded-2xl border px-4 py-3 text-sm text-white outline-none transition ${
          error ? "border-red-400 bg-red-950/30 ring-4 ring-red-400/20" : "border-slate-700 bg-slate-950 focus:border-white/40 focus:ring-4 focus:ring-white/10"
        }`}
      >
        <option value="">Seleccione</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>

      {error && <p className="mt-1 text-xs font-bold text-red-300">Selecciona una opción válida.</p>}
    </label>
  );
}

function TextAreaField({
  label,
  field,
  form,
  updateField,
  error,
  placeholder,
}: {
  label: string;
  field: keyof PostExtractionRecord;
  form: PostExtractionRecord;
  updateField: (field: keyof PostExtractionRecord, value: string) => void;
  error: boolean;
  placeholder?: string;
}) {
  return (
    <label className="md:col-span-2">
      <span className="mb-2 block text-sm font-bold text-slate-200">{label}</span>

      <textarea
        value={form[field]}
        onChange={(event) => updateField(field, event.target.value)}
        rows={4}
        placeholder={placeholder}
        className={`w-full rounded-2xl border px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 ${
          error ? "border-red-400 bg-red-950/30 ring-4 ring-red-400/20" : "border-slate-700 bg-slate-950 focus:border-white/40 focus:ring-4 focus:ring-white/10"
        }`}
      />

      {error && <p className="mt-1 text-xs font-bold text-red-300">Completa o corrige este campo.</p>}
    </label>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-black text-white">
      {children}
    </span>
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
    value === "Liberado" || value === "Aprobado"
      ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
      : value === "Pendiente QA" || value === "Cuarentena" || value === "Retenido" || value === "Aprobado con observación"
      ? "border-amber-400/40 bg-amber-500/10 text-amber-200"
      : "border-red-400/40 bg-red-500/10 text-red-200";

  return <span className={`rounded-full border px-3 py-1 text-xs font-bold ${className}`}>{value || "Sin estado"}</span>;
}
