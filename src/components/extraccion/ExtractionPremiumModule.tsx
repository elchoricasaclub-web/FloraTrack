"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

export type ExtractionModuleConfig = {
  moduleTitle: string;
  moduleSubtitle: string;
  moduleDescription: string;
  storageKey: string;
  accent: string;
  processType: "bho" | "live-rosin" | "bubble-hash";
  tag: string;
  mediumLabel: string;
  criticalInputLabel: string;
  techniqueOptions: string[];
  materialOptions: string[];
  stageOptions: string[];
  defaultCriticalControl: string;
};

type ExtractionRecord = {
  id: string;
  codigoProceso: string;
  fechaProceso: string;
  horaProceso: string;
  empresa: string;
  sede: string;
  responsable: string;
  supervisorQA: string;
  producto: string;
  loteOrigen: string;
  loteSalida: string;
  materialOrigen: string;
  pesoEntrada: string;
  pesoSalida: string;
  tecnica: string;
  etapaProceso: string;
  medioProceso: string;
  loteInsumoCritico: string;
  certificadoInsumo: string;
  parametroTemperatura: string;
  parametroPresion: string;
  parametroTiempo: string;
  equipo: string;
  sala: string;
  limpiezaEquipo: string;
  seguridadOperacional: string;
  controlesCriticos: string;
  estadoSanitario: string;
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

const emptyForm: ExtractionRecord = {
  id: "",
  codigoProceso: "",
  fechaProceso: "",
  horaProceso: "",
  empresa: "",
  sede: "",
  responsable: "",
  supervisorQA: "",
  producto: "",
  loteOrigen: "",
  loteSalida: "",
  materialOrigen: "",
  pesoEntrada: "",
  pesoSalida: "",
  tecnica: "",
  etapaProceso: "",
  medioProceso: "",
  loteInsumoCritico: "",
  certificadoInsumo: "",
  parametroTemperatura: "",
  parametroPresion: "",
  parametroTiempo: "",
  equipo: "",
  sala: "",
  limpiezaEquipo: "",
  seguridadOperacional: "",
  controlesCriticos: "",
  estadoSanitario: "",
  estadoQA: "",
  decisionQA: "",
  evidencia: "",
  desviacionAsociada: "",
  capa: "",
  observaciones: "",
  creadoEn: "",
  actualizadoEn: "",
};

const requiredFields: Array<keyof ExtractionRecord> = [
  "codigoProceso",
  "fechaProceso",
  "horaProceso",
  "empresa",
  "sede",
  "responsable",
  "supervisorQA",
  "producto",
  "loteOrigen",
  "materialOrigen",
  "pesoEntrada",
  "pesoSalida",
  "tecnica",
  "etapaProceso",
  "medioProceso",
  "loteInsumoCritico",
  "certificadoInsumo",
  "parametroTemperatura",
  "parametroTiempo",
  "equipo",
  "sala",
  "limpiezaEquipo",
  "seguridadOperacional",
  "controlesCriticos",
  "estadoSanitario",
  "estadoQA",
  "decisionQA",
];

const labels: Record<keyof ExtractionRecord, string> = {
  id: "ID",
  codigoProceso: "Código de proceso",
  fechaProceso: "Fecha de proceso",
  horaProceso: "Hora de proceso",
  empresa: "Empresa",
  sede: "Sede / planta",
  responsable: "Responsable de proceso",
  supervisorQA: "Supervisor QA",
  producto: "Producto / presentación",
  loteOrigen: "Lote de origen",
  loteSalida: "Lote de salida",
  materialOrigen: "Material de origen",
  pesoEntrada: "Peso de entrada",
  pesoSalida: "Peso de salida",
  tecnica: "Técnica",
  etapaProceso: "Etapa del proceso",
  medioProceso: "Medio de proceso",
  loteInsumoCritico: "Lote de insumo crítico",
  certificadoInsumo: "Certificado de insumo",
  parametroTemperatura: "Parámetro de temperatura",
  parametroPresion: "Parámetro de presión",
  parametroTiempo: "Parámetro de tiempo",
  equipo: "Equipo",
  sala: "Sala / área",
  limpiezaEquipo: "Limpieza del equipo",
  seguridadOperacional: "Seguridad operacional",
  controlesCriticos: "Controles críticos",
  estadoSanitario: "Estado sanitario",
  estadoQA: "Estado QA",
  decisionQA: "Decisión QA",
  evidencia: "Evidencia",
  desviacionAsociada: "Desviación asociada",
  capa: "CAPA",
  observaciones: "Observaciones",
  creadoEn: "Creado en",
  actualizadoEn: "Actualizado en",
};

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

function createId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function loadRecords(storageKey: string): ExtractionRecord[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveRecords(storageKey: string, records: ExtractionRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey, JSON.stringify(records));
}

function needsCapa(form: ExtractionRecord): boolean {
  return (
    ["Rechazado QA", "Requiere CAPA", "Requiere investigación", "Requiere reproceso"].includes(form.decisionQA) ||
    ["Rechazado", "Retenido", "Cuarentena", "Bloqueado"].includes(form.estadoQA) ||
    form.estadoSanitario === "No conforme"
  );
}

function calculateYield(form: ExtractionRecord): number {
  const input = toNumber(form.pesoEntrada);
  const output = toNumber(form.pesoSalida);

  if (!Number.isFinite(input) || !Number.isFinite(output) || input <= 0) {
    return 0;
  }

  return Math.round((output / input) * 10000) / 100;
}

export default function ExtractionPremiumModule({ config }: { config: ExtractionModuleConfig }) {
  const [records, setRecords] = useState<ExtractionRecord[]>([]);
  const [form, setForm] = useState<ExtractionRecord>({
    ...emptyForm,
    controlesCriticos: config.defaultCriticalControl,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("Todos");

  useEffect(() => {
    setRecords(loadRecords(config.storageKey));
  }, [config.storageKey]);

  function showNotice(type: Notice["type"], title: string, items: string[] = []) {
    setNotice({ type, title, items });

    window.setTimeout(() => {
      setNotice(null);
    }, items.length > 0 ? 12000 : 6000);
  }

  function updateField(field: keyof ExtractionRecord, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function validate(): string[] {
    const errors = requiredFields
      .filter((field) => isBlank(form[field]))
      .map((field) => labels[field]);

    const inputWeight = toNumber(form.pesoEntrada);
    const outputWeight = toNumber(form.pesoSalida);

    if (!Number.isFinite(inputWeight) || inputWeight <= 0) {
      errors.push("El peso de entrada debe ser mayor a cero");
    }

    if (!Number.isFinite(outputWeight) || outputWeight < 0) {
      errors.push("El peso de salida debe ser un número igual o mayor a cero");
    }

    if (Number.isFinite(inputWeight) && Number.isFinite(outputWeight) && outputWeight > inputWeight) {
      errors.push("El peso de salida no puede ser mayor que el peso de entrada");
    }

    if (["Liberado", "Aprobado", "Aprobado con observación"].includes(form.estadoQA) && isBlank(form.evidencia)) {
      errors.push("La evidencia es obligatoria para liberación o aprobación QA");
    }

    if (["Aprobado QA", "Aprobado con observación QA", "Rechazado QA"].includes(form.decisionQA) && isBlank(form.evidencia)) {
      errors.push("La evidencia es obligatoria para decisiones QA formales");
    }

    if (config.processType === "bho" && isBlank(form.parametroPresion)) {
      errors.push("El parámetro de presión es obligatorio para el módulo BHO");
    }

    if (needsCapa(form) && isBlank(form.desviacionAsociada)) {
      errors.push("La desviación asociada es obligatoria si hay retención, rechazo, cuarentena, investigación o CAPA");
    }

    if (needsCapa(form) && isBlank(form.capa)) {
      errors.push("La CAPA es obligatoria si hay retención, rechazo, cuarentena, investigación o CAPA");
    }

    return Array.from(new Set(errors));
  }

  function fieldHasError(field: keyof ExtractionRecord): boolean {
    if (!submitAttempted) return false;

    if (requiredFields.includes(field) && isBlank(form[field])) return true;

    if (field === "pesoEntrada") {
      const value = toNumber(form.pesoEntrada);
      return !Number.isFinite(value) || value <= 0;
    }

    if (field === "pesoSalida") {
      const input = toNumber(form.pesoEntrada);
      const output = toNumber(form.pesoSalida);
      return !Number.isFinite(output) || output < 0 || (Number.isFinite(input) && output > input);
    }

    if (field === "evidencia" && ["Liberado", "Aprobado", "Aprobado con observación"].includes(form.estadoQA) && isBlank(form.evidencia)) return true;
    if (field === "evidencia" && ["Aprobado QA", "Aprobado con observación QA", "Rechazado QA"].includes(form.decisionQA) && isBlank(form.evidencia)) return true;
    if (field === "parametroPresion" && config.processType === "bho" && isBlank(form.parametroPresion)) return true;
    if (field === "desviacionAsociada" && needsCapa(form) && isBlank(form.desviacionAsociada)) return true;
    if (field === "capa" && needsCapa(form) && isBlank(form.capa)) return true;

    return false;
  }

  function resetForm() {
    setForm({
      ...emptyForm,
      controlesCriticos: config.defaultCriticalControl,
    });
    setEditingId(null);
    setSubmitAttempted(false);
  }

  function handleSave() {
    setSubmitAttempted(true);

    const errors = validate();

    if (errors.length > 0) {
      showNotice("warning", `No se guardó ${config.moduleTitle}. Completa la información obligatoria.`, errors);
      return;
    }

    const timestamp = nowIso();
    const prefix =
      config.processType === "bho"
        ? "BHO"
        : config.processType === "live-rosin"
          ? "ROSIN"
          : "HASH";

    const payload: ExtractionRecord = {
      ...form,
      id: editingId ?? createId(prefix),
      codigoProceso: clean(form.codigoProceso),
      fechaProceso: clean(form.fechaProceso),
      horaProceso: clean(form.horaProceso),
      empresa: clean(form.empresa),
      sede: clean(form.sede),
      responsable: clean(form.responsable),
      supervisorQA: clean(form.supervisorQA),
      producto: clean(form.producto),
      loteOrigen: clean(form.loteOrigen),
      loteSalida: clean(form.loteSalida),
      materialOrigen: clean(form.materialOrigen),
      pesoEntrada: clean(form.pesoEntrada),
      pesoSalida: clean(form.pesoSalida),
      tecnica: clean(form.tecnica),
      etapaProceso: clean(form.etapaProceso),
      medioProceso: clean(form.medioProceso),
      loteInsumoCritico: clean(form.loteInsumoCritico),
      certificadoInsumo: clean(form.certificadoInsumo),
      parametroTemperatura: clean(form.parametroTemperatura),
      parametroPresion: clean(form.parametroPresion),
      parametroTiempo: clean(form.parametroTiempo),
      equipo: clean(form.equipo),
      sala: clean(form.sala),
      limpiezaEquipo: clean(form.limpiezaEquipo),
      seguridadOperacional: clean(form.seguridadOperacional),
      controlesCriticos: clean(form.controlesCriticos),
      estadoSanitario: clean(form.estadoSanitario),
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
    saveRecords(config.storageKey, nextRecords);
    resetForm();

    showNotice(
      "success",
      editingId
        ? `${config.moduleTitle} actualizado correctamente.`
        : `${config.moduleTitle} registrado correctamente con trazabilidad QA.`
    );
  }

  function handleEdit(record: ExtractionRecord) {
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
    saveRecords(config.storageKey, nextRecords);
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
    link.download = `floratrack-${config.processType}-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();

    URL.revokeObjectURL(url);
    showNotice("success", "Archivo JSON exportado correctamente.");
  }

  const filteredRecords = useMemo(() => {
    const term = clean(search).toLowerCase();

    return records.filter((record) => {
      const text = [
        record.codigoProceso,
        record.producto,
        record.loteOrigen,
        record.loteSalida,
        record.materialOrigen,
        record.tecnica,
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
        <header className={`relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br ${config.accent} p-7 text-white shadow-2xl`}>
          <div className="absolute right-0 top-0 h-48 w-48 translate-x-16 -translate-y-16 rounded-full bg-white/15 blur-2xl" />
          <div className="absolute bottom-0 left-10 h-32 w-32 rounded-full bg-slate-950/20 blur-2xl" />

          <div className="relative">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-white/70">
              FloraTrack Extraction Suite
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
              {config.moduleTitle}
            </h1>

            <p className="mt-3 max-w-5xl text-base font-semibold leading-8 text-white/85">
              {config.moduleDescription}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <Badge>GMP</Badge>
              <Badge>QA</Badge>
              <Badge>Trazabilidad</Badge>
              <Badge>{config.tag}</Badge>
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
                  {editingId ? "Editar registro" : "Nuevo registro"}
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Ningún registro puede guardarse vacío o incompleto.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-xs font-black uppercase tracking-wide text-slate-400">Rendimiento calculado</p>
                <p className="text-2xl font-black text-white">{yieldValue}%</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <TextField label="Código de proceso *" field="codigoProceso" form={form} updateField={updateField} error={fieldHasError("codigoProceso")} placeholder="BHO-2026-001 / ROSIN-2026-001" />
              <TextField label="Fecha de proceso *" field="fechaProceso" form={form} updateField={updateField} error={fieldHasError("fechaProceso")} type="date" />
              <TextField label="Hora de proceso *" field="horaProceso" form={form} updateField={updateField} error={fieldHasError("horaProceso")} type="time" />
              <TextField label="Empresa *" field="empresa" form={form} updateField={updateField} error={fieldHasError("empresa")} placeholder="Growlifecol S.A.S." />
              <TextField label="Sede / planta *" field="sede" form={form} updateField={updateField} error={fieldHasError("sede")} placeholder="Planta de extracción" />
              <TextField label="Responsable de proceso *" field="responsable" form={form} updateField={updateField} error={fieldHasError("responsable")} placeholder="Operador responsable" />
              <TextField label="Supervisor QA *" field="supervisorQA" form={form} updateField={updateField} error={fieldHasError("supervisorQA")} placeholder="QA" />
              <TextField label="Producto / presentación *" field="producto" form={form} updateField={updateField} error={fieldHasError("producto")} placeholder="Crude extract / Live Rosin / Bubble Hash" />
              <TextField label="Lote de origen *" field="loteOrigen" form={form} updateField={updateField} error={fieldHasError("loteOrigen")} placeholder="LOT-2026-001" />
              <TextField label="Lote de salida" field="loteSalida" form={form} updateField={updateField} error={false} placeholder="EXT-2026-001" />

              <SelectField label="Material de origen *" field="materialOrigen" form={form} updateField={updateField} error={fieldHasError("materialOrigen")} options={config.materialOptions} />
              <SelectField label="Técnica *" field="tecnica" form={form} updateField={updateField} error={fieldHasError("tecnica")} options={config.techniqueOptions} />
              <SelectField label="Etapa del proceso *" field="etapaProceso" form={form} updateField={updateField} error={fieldHasError("etapaProceso")} options={config.stageOptions} />

              <TextField label="Peso de entrada g *" field="pesoEntrada" form={form} updateField={updateField} error={fieldHasError("pesoEntrada")} type="number" placeholder="1000" />
              <TextField label="Peso de salida g *" field="pesoSalida" form={form} updateField={updateField} error={fieldHasError("pesoSalida")} type="number" placeholder="120" />

              <TextField label={config.mediumLabel} field="medioProceso" form={form} updateField={updateField} error={fieldHasError("medioProceso")} placeholder="Medio, solvente o insumo crítico documentado" />
              <TextField label={config.criticalInputLabel} field="loteInsumoCritico" form={form} updateField={updateField} error={fieldHasError("loteInsumoCritico")} placeholder="Lote de insumo crítico" />
              <TextField label="Certificado de insumo *" field="certificadoInsumo" form={form} updateField={updateField} error={fieldHasError("certificadoInsumo")} placeholder="COA / certificado / referencia documental" />

              <TextField label="Parámetro de temperatura *" field="parametroTemperatura" form={form} updateField={updateField} error={fieldHasError("parametroTemperatura")} placeholder="Registro controlado, no receta operacional" />
              <TextField label="Parámetro de presión" field="parametroPresion" form={form} updateField={updateField} error={fieldHasError("parametroPresion")} placeholder="Obligatorio en BHO" />
              <TextField label="Parámetro de tiempo *" field="parametroTiempo" form={form} updateField={updateField} error={fieldHasError("parametroTiempo")} placeholder="Registro controlado" />

              <TextField label="Equipo *" field="equipo" form={form} updateField={updateField} error={fieldHasError("equipo")} placeholder="Código de equipo" />
              <TextField label="Sala / área *" field="sala" form={form} updateField={updateField} error={fieldHasError("sala")} placeholder="Sala extracción / sala solventless" />

              <SelectField label="Limpieza del equipo *" field="limpiezaEquipo" form={form} updateField={updateField} error={fieldHasError("limpiezaEquipo")} options={["Conforme", "Con observación", "No conforme", "Pendiente QA"]} />
              <SelectField label="Seguridad operacional *" field="seguridadOperacional" form={form} updateField={updateField} error={fieldHasError("seguridadOperacional")} options={["Conforme", "Con observación", "No conforme", "No aplica documentado"]} />
              <SelectField label="Estado sanitario *" field="estadoSanitario" form={form} updateField={updateField} error={fieldHasError("estadoSanitario")} options={["Conforme", "Con observación", "No conforme", "Pendiente QA"]} />
              <SelectField label="Estado QA *" field="estadoQA" form={form} updateField={updateField} error={fieldHasError("estadoQA")} options={["Pendiente QA", "Cuarentena", "Retenido", "Liberado", "Aprobado", "Aprobado con observación", "Rechazado", "Bloqueado"]} />
              <SelectField label="Decisión QA *" field="decisionQA" form={form} updateField={updateField} error={fieldHasError("decisionQA")} options={["Pendiente QA", "Aprobado QA", "Aprobado con observación QA", "Rechazado QA", "Requiere CAPA", "Requiere investigación", "Requiere reproceso", "Cierre aprobado QA"]} />

              <TextField label="Evidencia / soporte" field="evidencia" form={form} updateField={updateField} error={fieldHasError("evidencia")} placeholder="Batch record, log, limpieza, COA, captura, firma..." />
              <TextField label="Desviación asociada" field="desviacionAsociada" form={form} updateField={updateField} error={fieldHasError("desviacionAsociada")} placeholder="DEV-2026-001 / CAPA-001" />

              <TextAreaField label="Controles críticos *" field="controlesCriticos" form={form} updateField={updateField} error={fieldHasError("controlesCriticos")} placeholder="Controles de seguridad, limpieza, trazabilidad, QA, evidencia y liberación." />
              <TextAreaField label="CAPA" field="capa" form={form} updateField={updateField} error={fieldHasError("capa")} placeholder="Obligatoria si hay rechazo, retención, investigación o CAPA." />
              <TextAreaField label="Observaciones" field="observaciones" form={form} updateField={updateField} error={false} placeholder="Notas QA, restricciones, seguimiento o justificación." />
            </div>

            <div className="mt-6 flex flex-col gap-3 md:flex-row">
              <button type="button" onClick={handleSave} className={`rounded-2xl bg-gradient-to-r ${config.accent} px-6 py-3 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5`}>
                {editingId ? "Actualizar registro" : "Guardar registro"}
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
                <p className="mt-1 text-sm text-slate-400">Consulta, filtra, edita y exporta trazabilidad de proceso.</p>
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
                placeholder="Buscar por código, lote, producto, estado..."
              />

              <select
                value={filterEstado}
                onChange={(event) => setFilterEstado(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-white/20 transition focus:border-white/40 focus:ring-4"
              >
                <option>Todos</option>
                <option>Pendiente QA</option>
                <option>Cuarentena</option>
                <option>Retenido</option>
                <option>Liberado</option>
                <option>Aprobado</option>
                <option>Aprobado con observación</option>
                <option>Rechazado</option>
                <option>Bloqueado</option>
              </select>
            </div>

            <div className="max-h-[780px] space-y-4 overflow-auto pr-2">
              {filteredRecords.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center text-sm text-slate-400">
                  No hay registros. Crea el primer registro con datos completos.
                </div>
              ) : (
                filteredRecords.map((record) => (
                  <article key={record.id} className="rounded-2xl border border-slate-700 bg-slate-950 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-white">{record.codigoProceso} · {record.producto}</h3>
                          <StatusPill value={record.estadoQA} />
                          <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-bold text-slate-200">
                            {record.tecnica}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-400">
                          Origen {record.loteOrigen} · Salida {record.loteSalida || "sin asignar"} · Rendimiento {calculateYield(record)}%
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
                      <Data label="Material" value={record.materialOrigen} />
                      <Data label="Entrada / salida" value={`${record.pesoEntrada} g / ${record.pesoSalida} g`} />
                      <Data label="Etapa" value={record.etapaProceso} />
                      <Data label="Medio" value={record.medioProceso} />
                      <Data label="Insumo crítico" value={record.loteInsumoCritico} />
                      <Data label="Certificado" value={record.certificadoInsumo} />
                      <Data label="Limpieza" value={record.limpiezaEquipo} />
                      <Data label="Seguridad" value={record.seguridadOperacional} />
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
  field: keyof ExtractionRecord;
  form: ExtractionRecord;
  updateField: (field: keyof ExtractionRecord, value: string) => void;
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
  field: keyof ExtractionRecord;
  form: ExtractionRecord;
  updateField: (field: keyof ExtractionRecord, value: string) => void;
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
  field: keyof ExtractionRecord;
  form: ExtractionRecord;
  updateField: (field: keyof ExtractionRecord, value: string) => void;
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
