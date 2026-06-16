"use client";

import { useEffect, useMemo, useState } from "react";

export type AuthorityModuleConfig = {
  title: string;
  subtitle: string;
  description: string;
  storageKey: string;
  accent: string;
  tag: string;
  authorityName: string;
  processOptions: string[];
  documentOptions: string[];
  defaultScope: string;
};

type AuthorityRecord = {
  id: string;
  codigoRegistro: string;
  fechaRegistro: string;
  horaRegistro: string;
  empresa: string;
  sede: string;
  autoridad: string;
  procesoRegulatorio: string;
  documentoSoporte: string;
  numeroRadicado: string;
  licenciaPermiso: string;
  fechaVencimiento: string;
  responsableRegulatorio: string;
  responsableQA: string;
  alcance: string;
  requerimientoAutoridad: string;
  estadoTramite: string;
  nivelRiesgo: string;
  decisionQA: string;
  requiereCAPA: string;
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

const emptyForm: AuthorityRecord = {
  id: "",
  codigoRegistro: "",
  fechaRegistro: "",
  horaRegistro: "",
  empresa: "",
  sede: "",
  autoridad: "",
  procesoRegulatorio: "",
  documentoSoporte: "",
  numeroRadicado: "",
  licenciaPermiso: "",
  fechaVencimiento: "",
  responsableRegulatorio: "",
  responsableQA: "",
  alcance: "",
  requerimientoAutoridad: "",
  estadoTramite: "",
  nivelRiesgo: "",
  decisionQA: "",
  requiereCAPA: "",
  evidencia: "",
  desviacionAsociada: "",
  capa: "",
  observaciones: "",
  creadoEn: "",
  actualizadoEn: "",
};

const requiredFields: Array<keyof AuthorityRecord> = [
  "codigoRegistro",
  "fechaRegistro",
  "horaRegistro",
  "empresa",
  "sede",
  "autoridad",
  "procesoRegulatorio",
  "documentoSoporte",
  "responsableRegulatorio",
  "responsableQA",
  "alcance",
  "requerimientoAutoridad",
  "estadoTramite",
  "nivelRiesgo",
  "decisionQA",
  "requiereCAPA",
];

const labels: Record<keyof AuthorityRecord, string> = {
  id: "ID",
  codigoRegistro: "Código de registro",
  fechaRegistro: "Fecha de registro",
  horaRegistro: "Hora de registro",
  empresa: "Empresa",
  sede: "Sede / predio",
  autoridad: "Autoridad",
  procesoRegulatorio: "Proceso regulatorio",
  documentoSoporte: "Documento soporte",
  numeroRadicado: "Número de radicado",
  licenciaPermiso: "Licencia / permiso",
  fechaVencimiento: "Fecha de vencimiento",
  responsableRegulatorio: "Responsable regulatorio",
  responsableQA: "Responsable QA",
  alcance: "Alcance",
  requerimientoAutoridad: "Requerimiento de autoridad",
  estadoTramite: "Estado del trámite",
  nivelRiesgo: "Nivel de riesgo",
  decisionQA: "Decisión QA",
  requiereCAPA: "Requiere CAPA",
  evidencia: "Evidencia",
  desviacionAsociada: "Desviación asociada",
  capa: "CAPA",
  observaciones: "Observaciones",
  creadoEn: "Creado en",
  actualizadoEn: "Actualizado en",
};

const statusOptions = [
  "Borrador",
  "En preparación",
  "Radicado",
  "En revisión autoridad",
  "Requerimiento recibido",
  "Respuesta enviada",
  "Aprobado",
  "Aprobado con condición",
  "Rechazado",
  "Vencido",
  "Cerrado",
];

const riskOptions = ["Bajo", "Medio", "Alto", "Crítico"];

const decisionOptions = [
  "Pendiente QA",
  "Aprobado QA",
  "Aprobado con observación QA",
  "Rechazado QA",
  "Requiere CAPA",
  "Requiere respuesta a autoridad",
  "Requiere actualización documental",
  "Cierre aprobado QA",
];

function clean(value: unknown): string {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function isBlank(value: unknown): boolean {
  const text = clean(value).toLowerCase();
  return ["", "seleccione", "seleccionar", "null", "undefined", "n/a", "na"].includes(text);
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

function isDateBefore(dateA: string, dateB: string): boolean {
  if (!dateA || !dateB) return false;

  const first = new Date(dateA).getTime();
  const second = new Date(dateB).getTime();

  return Number.isFinite(first) && Number.isFinite(second) && first < second;
}

function loadRecords(storageKey: string): AuthorityRecord[] {
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

function saveRecords(storageKey: string, records: AuthorityRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey, JSON.stringify(records));
}

function needsCapa(form: AuthorityRecord): boolean {
  return (
    form.requiereCAPA === "Sí" ||
    ["Alto", "Crítico"].includes(form.nivelRiesgo) ||
    ["Rechazado", "Vencido"].includes(form.estadoTramite) ||
    ["Rechazado QA", "Requiere CAPA", "Requiere respuesta a autoridad"].includes(form.decisionQA)
  );
}

export default function AuthorityRegulatoryModule({ config }: { config: AuthorityModuleConfig }) {
  const [records, setRecords] = useState<AuthorityRecord[]>([]);
  const [form, setForm] = useState<AuthorityRecord>({
    ...emptyForm,
    autoridad: config.authorityName,
    alcance: config.defaultScope,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("Todos");

  useEffect(() => {
    setRecords(loadRecords(config.storageKey));
  }, [config.storageKey]);

  function updateField(field: keyof AuthorityRecord, value: string) {
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

    if (form.fechaVencimiento && form.fechaRegistro && isDateBefore(form.fechaVencimiento, form.fechaRegistro)) {
      errors.push("La fecha de vencimiento no puede ser anterior a la fecha de registro");
    }

    if (["Radicado", "En revisión autoridad", "Respuesta enviada", "Aprobado", "Cerrado"].includes(form.estadoTramite) && isBlank(form.numeroRadicado)) {
      errors.push("El número de radicado es obligatorio cuando el trámite ya fue radicado o cerrado");
    }

    if (["Aprobado QA", "Aprobado con observación QA", "Rechazado QA", "Cierre aprobado QA"].includes(form.decisionQA) && isBlank(form.evidencia)) {
      errors.push("La evidencia es obligatoria para decisiones QA formales");
    }

    if (needsCapa(form) && isBlank(form.desviacionAsociada)) {
      errors.push("La desviación asociada es obligatoria para riesgo alto/crítico, rechazo, vencimiento, requerimiento crítico o CAPA");
    }

    if (needsCapa(form) && isBlank(form.capa)) {
      errors.push("La CAPA es obligatoria para riesgo alto/crítico, rechazo, vencimiento, requerimiento crítico o CAPA");
    }

    return Array.from(new Set(errors));
  }

  function fieldHasError(field: keyof AuthorityRecord): boolean {
    if (!submitAttempted) return false;

    if (requiredFields.includes(field) && isBlank(form[field])) return true;
    if (field === "fechaVencimiento" && form.fechaVencimiento && form.fechaRegistro && isDateBefore(form.fechaVencimiento, form.fechaRegistro)) return true;
    if (field === "numeroRadicado" && ["Radicado", "En revisión autoridad", "Respuesta enviada", "Aprobado", "Cerrado"].includes(form.estadoTramite) && isBlank(form.numeroRadicado)) return true;
    if (field === "evidencia" && ["Aprobado QA", "Aprobado con observación QA", "Rechazado QA", "Cierre aprobado QA"].includes(form.decisionQA) && isBlank(form.evidencia)) return true;
    if (field === "desviacionAsociada" && needsCapa(form) && isBlank(form.desviacionAsociada)) return true;
    if (field === "capa" && needsCapa(form) && isBlank(form.capa)) return true;

    return false;
  }

  function resetForm() {
    setForm({
      ...emptyForm,
      autoridad: config.authorityName,
      alcance: config.defaultScope,
    });
    setEditingId(null);
    setSubmitAttempted(false);
  }

  function handleSave() {
    setSubmitAttempted(true);

    const errors = validate();

    if (errors.length > 0) {
      showNotice("warning", `No se guardó ${config.title}. Completa la información obligatoria.`, errors);
      return;
    }

    const timestamp = nowIso();

    const payload: AuthorityRecord = {
      ...form,
      id: editingId ?? createId(config.tag),
      codigoRegistro: clean(form.codigoRegistro),
      fechaRegistro: clean(form.fechaRegistro),
      horaRegistro: clean(form.horaRegistro),
      empresa: clean(form.empresa),
      sede: clean(form.sede),
      autoridad: clean(form.autoridad),
      procesoRegulatorio: clean(form.procesoRegulatorio),
      documentoSoporte: clean(form.documentoSoporte),
      numeroRadicado: clean(form.numeroRadicado),
      licenciaPermiso: clean(form.licenciaPermiso),
      fechaVencimiento: clean(form.fechaVencimiento),
      responsableRegulatorio: clean(form.responsableRegulatorio),
      responsableQA: clean(form.responsableQA),
      alcance: clean(form.alcance),
      requerimientoAutoridad: clean(form.requerimientoAutoridad),
      estadoTramite: clean(form.estadoTramite),
      nivelRiesgo: clean(form.nivelRiesgo),
      decisionQA: clean(form.decisionQA),
      requiereCAPA: clean(form.requiereCAPA),
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
        ? `${config.title} actualizado correctamente.`
        : `${config.title} registrado correctamente con trazabilidad QA.`
    );
  }

  function handleEdit(record: AuthorityRecord) {
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
    link.download = `floratrack-${config.tag.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();

    URL.revokeObjectURL(url);
    showNotice("success", "Archivo JSON exportado correctamente.");
  }

  const filteredRecords = useMemo(() => {
    const term = clean(search).toLowerCase();

    return records.filter((record) => {
      const text = [
        record.codigoRegistro,
        record.autoridad,
        record.procesoRegulatorio,
        record.documentoSoporte,
        record.numeroRadicado,
        record.licenciaPermiso,
        record.estadoTramite,
        record.decisionQA,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = !term || text.includes(term);
      const matchesEstado = filterEstado === "Todos" || record.estadoTramite === filterEstado;

      return matchesSearch && matchesEstado;
    });
  }, [records, search, filterEstado]);

  const metrics = useMemo(() => {
    return {
      total: records.length,
      radicados: records.filter((record) => ["Radicado", "En revisión autoridad", "Respuesta enviada"].includes(record.estadoTramite)).length,
      aprobados: records.filter((record) => ["Aprobado", "Cerrado"].includes(record.estadoTramite)).length,
      requerimientos: records.filter((record) => record.estadoTramite === "Requerimiento recibido").length,
      altoRiesgo: records.filter((record) => ["Alto", "Crítico"].includes(record.nivelRiesgo)).length,
    };
  }, [records]);

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
              FloraTrack Regulatory Suite
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
              {config.title}
            </h1>

            <p className="mt-3 max-w-5xl text-base font-semibold leading-8 text-white/85">
              {config.description}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <Badge>Regulatorio</Badge>
              <Badge>QA</Badge>
              <Badge>{config.tag}</Badge>
              <Badge>Audit Trail</Badge>
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-5">
          <Metric title="Registros" value={metrics.total} />
          <Metric title="Radicados" value={metrics.radicados} tone="sky" />
          <Metric title="Aprobados" value={metrics.aprobados} tone="emerald" />
          <Metric title="Requerimientos" value={metrics.requerimientos} tone="amber" />
          <Metric title="Alto riesgo" value={metrics.altoRiesgo} tone="red" />
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
            <div className="mb-5">
              <h2 className="text-2xl font-black text-white">
                {editingId ? "Editar registro" : "Nuevo registro regulatorio"}
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Ningún registro puede guardarse vacío o incompleto.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <TextField label="Código de registro *" field="codigoRegistro" form={form} updateField={updateField} error={fieldHasError("codigoRegistro")} placeholder={`${config.tag}-2026-001`} />
              <TextField label="Fecha de registro *" field="fechaRegistro" form={form} updateField={updateField} error={fieldHasError("fechaRegistro")} type="date" />
              <TextField label="Hora de registro *" field="horaRegistro" form={form} updateField={updateField} error={fieldHasError("horaRegistro")} type="time" />
              <TextField label="Empresa *" field="empresa" form={form} updateField={updateField} error={fieldHasError("empresa")} placeholder="Growlifecol S.A.S." />
              <TextField label="Sede / predio *" field="sede" form={form} updateField={updateField} error={fieldHasError("sede")} placeholder="Sede principal" />
              <TextField label="Autoridad *" field="autoridad" form={form} updateField={updateField} error={fieldHasError("autoridad")} placeholder={config.authorityName} />

              <SelectField label="Proceso regulatorio *" field="procesoRegulatorio" form={form} updateField={updateField} error={fieldHasError("procesoRegulatorio")} options={config.processOptions} />
              <SelectField label="Documento soporte *" field="documentoSoporte" form={form} updateField={updateField} error={fieldHasError("documentoSoporte")} options={config.documentOptions} />

              <TextField label="Número de radicado" field="numeroRadicado" form={form} updateField={updateField} error={fieldHasError("numeroRadicado")} placeholder="RAD-2026-001" />
              <TextField label="Licencia / permiso" field="licenciaPermiso" form={form} updateField={updateField} error={false} placeholder="LIC-2026-001 / permiso / concepto" />
              <TextField label="Fecha de vencimiento" field="fechaVencimiento" form={form} updateField={updateField} error={fieldHasError("fechaVencimiento")} type="date" />

              <TextField label="Responsable regulatorio *" field="responsableRegulatorio" form={form} updateField={updateField} error={fieldHasError("responsableRegulatorio")} placeholder="Responsable regulatorio" />
              <TextField label="Responsable QA *" field="responsableQA" form={form} updateField={updateField} error={fieldHasError("responsableQA")} placeholder="QA" />

              <SelectField label="Estado del trámite *" field="estadoTramite" form={form} updateField={updateField} error={fieldHasError("estadoTramite")} options={statusOptions} />
              <SelectField label="Nivel de riesgo *" field="nivelRiesgo" form={form} updateField={updateField} error={fieldHasError("nivelRiesgo")} options={riskOptions} />
              <SelectField label="Decisión QA *" field="decisionQA" form={form} updateField={updateField} error={fieldHasError("decisionQA")} options={decisionOptions} />
              <SelectField label="Requiere CAPA *" field="requiereCAPA" form={form} updateField={updateField} error={fieldHasError("requiereCAPA")} options={["Sí", "No"]} />

              <TextField label="Evidencia / soporte" field="evidencia" form={form} updateField={updateField} error={fieldHasError("evidencia")} placeholder="Radicado, acta, certificado, respuesta autoridad, soporte..." />
              <TextField label="Desviación asociada" field="desviacionAsociada" form={form} updateField={updateField} error={fieldHasError("desviacionAsociada")} placeholder="DEV-2026-001 / CAPA-001" />

              <TextAreaField label="Alcance *" field="alcance" form={form} updateField={updateField} error={fieldHasError("alcance")} placeholder="Describe alcance regulatorio, licencia, predio, producto, actividad o autoridad." />
              <TextAreaField label="Requerimiento de autoridad *" field="requerimientoAutoridad" form={form} updateField={updateField} error={fieldHasError("requerimientoAutoridad")} placeholder="Describe requerimiento, respuesta requerida, plazo, soporte y responsable." />
              <TextAreaField label="CAPA" field="capa" form={form} updateField={updateField} error={fieldHasError("capa")} placeholder="Obligatoria si hay riesgo alto/crítico, rechazo, vencimiento, requerimiento crítico o decisión QA." />
              <TextAreaField label="Observaciones" field="observaciones" form={form} updateField={updateField} error={false} placeholder="Notas regulatorias, seguimiento o justificación QA." />
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
                <p className="mt-1 text-sm text-slate-400">Consulta, filtra, edita y exporta registros regulatorios.</p>
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
                placeholder="Buscar por código, autoridad, radicado, estado..."
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
                  No hay registros. Crea el primer registro con datos completos.
                </div>
              ) : (
                filteredRecords.map((record) => (
                  <article key={record.id} className="rounded-2xl border border-slate-700 bg-slate-950 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-white">{record.codigoRegistro} · {record.procesoRegulatorio}</h3>
                          <StatusPill value={record.estadoTramite} />
                          <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-bold text-slate-200">
                            Riesgo {record.nivelRiesgo}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-400">
                          {record.autoridad} · Radicado {record.numeroRadicado || "sin radicar"} · {record.decisionQA}
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
                      <Data label="Documento soporte" value={record.documentoSoporte} />
                      <Data label="Licencia / permiso" value={record.licenciaPermiso || "Sin registro"} />
                      <Data label="Vencimiento" value={record.fechaVencimiento || "Sin vencimiento"} />
                      <Data label="Regulatorio" value={record.responsableRegulatorio} />
                      <Data label="QA" value={record.responsableQA} />
                      <Data label="CAPA" value={record.requiereCAPA} />
                      <Data label="Evidencia" value={record.evidencia || "Sin registro"} />
                    </div>

                    <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300">
                      <p><span className="font-bold text-slate-100">Alcance: </span>{record.alcance}</p>
                      <p className="mt-2"><span className="font-bold text-slate-100">Requerimiento: </span>{record.requerimientoAutoridad}</p>

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
  field: keyof AuthorityRecord;
  form: AuthorityRecord;
  updateField: (field: keyof AuthorityRecord, value: string) => void;
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
  field: keyof AuthorityRecord;
  form: AuthorityRecord;
  updateField: (field: keyof AuthorityRecord, value: string) => void;
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
  field: keyof AuthorityRecord;
  form: AuthorityRecord;
  updateField: (field: keyof AuthorityRecord, value: string) => void;
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

function Badge({ children }: { children: React.ReactNode }) {
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
    value === "Aprobado" || value === "Cerrado"
      ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
      : value === "Radicado" || value === "En revisión autoridad" || value === "Requerimiento recibido" || value === "Respuesta enviada" || value === "Aprobado con condición"
      ? "border-amber-400/40 bg-amber-500/10 text-amber-200"
      : value === "Rechazado" || value === "Vencido"
      ? "border-red-400/40 bg-red-500/10 text-red-200"
      : "border-slate-400/40 bg-slate-500/10 text-slate-200";

  return <span className={`rounded-full border px-3 py-1 text-xs font-bold ${className}`}>{value || "Sin estado"}</span>;
}
