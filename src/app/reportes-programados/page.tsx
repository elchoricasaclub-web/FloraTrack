"use client";

import { useEffect, useMemo, useState } from "react";

type ReporteProgramado = {
  id: string;
  codigo: string;
  fechaConfiguracion: string;
  horaConfiguracion: string;
  empresa: string;
  sede: string;
  nombreReporte: string;
  tipoReporte: string;
  moduloOrigen: string;
  alcanceDatos: string;
  frecuencia: string;
  expresionCron: string;
  zonaHoraria: string;
  formatoSalida: string;
  destinoEntrega: string;
  destinatarios: string;
  responsableTecnico: string;
  responsableQA: string;
  criticidadGxP: string;
  requiereRevisionQA: string;
  requiereFirmaElectronica: string;
  firmaAsociada: string;
  reglasGeneracion: string;
  validacionesDatos: string;
  proximaGeneracion: string;
  estadoProgramacion: string;
  resultadoUltimaGeneracion: string;
  registrosIncluidos: string;
  erroresDetectados: string;
  auditTrailGenerado: string;
  requiereEscalamiento: string;
  escaladoA: string;
  decisionQA: string;
  desviacionAsociada: string;
  capa: string;
  evidencia: string;
  observaciones: string;
  creadoEn: string;
  actualizadoEn: string;
};

type CloudNotice = {
  type: "success" | "warning";
  title: string;
  items: string[];
};

const STORAGE_KEY = "floratrack_reportes_programados_v1";

const emptyForm: ReporteProgramado = {
  id: "",
  codigo: "",
  fechaConfiguracion: "",
  horaConfiguracion: "",
  empresa: "",
  sede: "",
  nombreReporte: "",
  tipoReporte: "",
  moduloOrigen: "",
  alcanceDatos: "",
  frecuencia: "",
  expresionCron: "",
  zonaHoraria: "America/Bogota",
  formatoSalida: "",
  destinoEntrega: "",
  destinatarios: "",
  responsableTecnico: "",
  responsableQA: "",
  criticidadGxP: "",
  requiereRevisionQA: "",
  requiereFirmaElectronica: "",
  firmaAsociada: "",
  reglasGeneracion: "",
  validacionesDatos: "",
  proximaGeneracion: "",
  estadoProgramacion: "",
  resultadoUltimaGeneracion: "",
  registrosIncluidos: "",
  erroresDetectados: "",
  auditTrailGenerado: "",
  requiereEscalamiento: "",
  escaladoA: "",
  decisionQA: "",
  desviacionAsociada: "",
  capa: "",
  evidencia: "",
  observaciones: "",
  creadoEn: "",
  actualizadoEn: "",
};

const requiredFields: Array<keyof ReporteProgramado> = [
  "codigo",
  "fechaConfiguracion",
  "horaConfiguracion",
  "empresa",
  "sede",
  "nombreReporte",
  "tipoReporte",
  "moduloOrigen",
  "alcanceDatos",
  "frecuencia",
  "expresionCron",
  "zonaHoraria",
  "formatoSalida",
  "destinoEntrega",
  "destinatarios",
  "responsableTecnico",
  "responsableQA",
  "criticidadGxP",
  "requiereRevisionQA",
  "requiereFirmaElectronica",
  "reglasGeneracion",
  "validacionesDatos",
  "proximaGeneracion",
  "estadoProgramacion",
  "resultadoUltimaGeneracion",
  "registrosIncluidos",
  "erroresDetectados",
  "auditTrailGenerado",
  "requiereEscalamiento",
  "decisionQA",
];

const labels: Record<keyof ReporteProgramado, string> = {
  id: "ID",
  codigo: "Código de programación",
  fechaConfiguracion: "Fecha de configuración",
  horaConfiguracion: "Hora de configuración",
  empresa: "Empresa",
  sede: "Sede / predio",
  nombreReporte: "Nombre del reporte",
  tipoReporte: "Tipo de reporte",
  moduloOrigen: "Módulo origen",
  alcanceDatos: "Alcance de datos",
  frecuencia: "Frecuencia",
  expresionCron: "Expresion CRON",
  zonaHoraria: "Zona horaria",
  formatoSalida: "Formato de salida",
  destinoEntrega: "Destino de entrega",
  destinatarios: "Destinatarios",
  responsableTecnico: "Responsable técnico",
  responsableQA: "Responsable QA",
  criticidadGxP: "Criticidad GxP",
  requiereRevisionQA: "Requiere revisión QA",
  requiereFirmaElectronica: "Requiere firma electrónica",
  firmaAsociada: "Firma asociada",
  reglasGeneracion: "Reglas de generación",
  validacionesDatos: "Validaciones de datos",
  proximaGeneracion: "Próxima generación",
  estadoProgramacion: "Estado de programación",
  resultadoUltimaGeneracion: "Resultado última generación",
  registrosIncluidos: "Registros incluidos",
  erroresDetectados: "Errores detectados",
  auditTrailGenerado: "Audit trail generado",
  requiereEscalamiento: "Requiere escalamiento",
  escaladoA: "Escalado a",
  decisionQA: "Decisión QA",
  desviacionAsociada: "Desviación asociada",
  capa: "CAPA",
  evidencia: "Evidencia",
  observaciones: "Observaciones",
  creadoEn: "Creado en",
  actualizadoEn: "Actualizado en",
};

const moduleOptions = [
  "Múltiples módulos",
  "Reportes",
  "Calidad QA",
  "Desviaciones / CAPA",
  "Auditorías",
  "Documentos",
  "Entrenamiento",
  "Equipos",
  "Proveedores",
  "Riesgos GxP",
  "Control de Cambios",
  "Workflows QA",
  "Inventario",
  "Recepción",
  "Regulatorio",
  "Part 11",
  "Backups",
  "Integraciones",
];

function clean(value: unknown): string {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function isBlank(value: unknown): boolean {
  const text = clean(value).toLowerCase();
  return ["", "seleccione", "seleccionar", "null", "undefined", "n/a", "na"].includes(text);
}

function numberValue(value: string): number {
  return Number(clean(value));
}

function nowIso(): string {
  return new Date().toISOString();
}

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `RPA-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function loadRecords(): ReporteProgramado[] {
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

function saveRecords(records: ReporteProgramado[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export default function ReportesProgramadosPage() {
  const [records, setRecords] = useState<ReporteProgramado[]>([]);
  const [form, setForm] = useState<ReporteProgramado>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<CloudNotice | null>(null);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("Todos");
  const [submitAttempted, setSubmitAttempted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setRecords(loadRecords()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  function updateField(field: keyof ReporteProgramado, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function showNotice(type: CloudNotice["type"], title: string, items: string[] = []) {
    setNotice({ type, title, items });

    window.setTimeout(() => {
      setNotice(null);
    }, items.length > 0 ? 12000 : 6000);
  }

  function isHighGxP(): boolean {
    return ["GxP alto", "GxP crítico"].includes(form.criticidadGxP);
  }

  function needsCapa(): boolean {
    const errores = numberValue(form.erroresDetectados);

    return (
      errores > 0 ||
      ["Fallida", "Suspendida", "Retirada"].includes(form.estadoProgramacion) ||
      ["Fallida", "Con observación"].includes(form.resultadoUltimaGeneracion) ||
      ["Rechazado QA", "Requiere CAPA", "Requiere remediación"].includes(form.decisionQA)
    );
  }

  function validate(): string[] {
    const errors = requiredFields
      .filter((field) => isBlank(form[field]))
      .map((field) => labels[field]);

    const registros = numberValue(form.registrosIncluidos);
    const errores = numberValue(form.erroresDetectados);

    if (!Number.isFinite(registros) || registros < 0) {
      errors.push("Registros incluidos debe ser un número igual o mayor a cero");
    }

    if (!Number.isFinite(errores) || errores < 0) {
      errors.push("Errores detectados debe ser un número igual o mayor a cero");
    }

    if (isHighGxP() && form.requiereRevisionQA !== "Sí") {
      errors.push("Los reportes GxP alto o crítico deben requerir revisión QA");
    }

    if (isHighGxP() && form.auditTrailGenerado !== "Sí") {
      errors.push("Los reportes GxP alto o crítico deben generar audit trail");
    }

    if (isHighGxP() && form.requiereFirmaElectronica !== "Sí") {
      errors.push("Los reportes GxP alto o crítico deben requerir firma electrónica");
    }

    if (form.requiereFirmaElectronica === "Sí" && isBlank(form.firmaAsociada)) {
      errors.push("Firma asociada es obligatoria cuando requiere firma electrónica");
    }

    if (form.requiereEscalamiento === "Sí" && isBlank(form.escaladoA)) {
      errors.push("Escalado a es obligatorio cuando requiere escalamiento");
    }

    if (["Aprobado QA", "Aprobado con observación QA", "Rechazado QA", "Cierre aprobado QA"].includes(form.decisionQA) && isBlank(form.evidencia)) {
      errors.push("Evidencia es obligatoria para decisiones QA formales");
    }

    if (needsCapa() && isBlank(form.desviacionAsociada)) {
      errors.push("Desviación asociada es obligatoria cuando hay fallos, errores o rechazo QA");
    }

    if (needsCapa() && isBlank(form.capa)) {
      errors.push("CAPA es obligatoria cuando hay fallos, errores o rechazo QA");
    }

    return Array.from(new Set(errors));
  }

  function fieldHasError(field: keyof ReporteProgramado): boolean {
    if (!submitAttempted) return false;
    if (requiredFields.includes(field) && isBlank(form[field])) return true;

    if (field === "registrosIncluidos") {
      const value = numberValue(form.registrosIncluidos);
      return !Number.isFinite(value) || value < 0;
    }

    if (field === "erroresDetectados") {
      const value = numberValue(form.erroresDetectados);
      return !Number.isFinite(value) || value < 0;
    }

    if (field === "requiereRevisionQA" && isHighGxP() && form.requiereRevisionQA !== "Sí") return true;
    if (field === "auditTrailGenerado" && isHighGxP() && form.auditTrailGenerado !== "Sí") return true;
    if (field === "requiereFirmaElectronica" && isHighGxP() && form.requiereFirmaElectronica !== "Sí") return true;
    if (field === "firmaAsociada" && form.requiereFirmaElectronica === "Sí" && isBlank(form.firmaAsociada)) return true;
    if (field === "escaladoA" && form.requiereEscalamiento === "Sí" && isBlank(form.escaladoA)) return true;
    if (field === "evidencia" && ["Aprobado QA", "Aprobado con observación QA", "Rechazado QA", "Cierre aprobado QA"].includes(form.decisionQA) && isBlank(form.evidencia)) return true;
    if (field === "desviacionAsociada" && needsCapa() && isBlank(form.desviacionAsociada)) return true;
    if (field === "capa" && needsCapa() && isBlank(form.capa)) return true;

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
      showNotice("warning", "No se guardó el reporte programado. Completa la información obligatoria.", errors);
      return;
    }

    const timestamp = nowIso();

    const payload: ReporteProgramado = {
      ...form,
      id: editingId ?? createId(),
      codigo: clean(form.codigo),
      fechaConfiguracion: clean(form.fechaConfiguracion),
      horaConfiguracion: clean(form.horaConfiguracion),
      empresa: clean(form.empresa),
      sede: clean(form.sede),
      nombreReporte: clean(form.nombreReporte),
      tipoReporte: clean(form.tipoReporte),
      moduloOrigen: clean(form.moduloOrigen),
      alcanceDatos: clean(form.alcanceDatos),
      frecuencia: clean(form.frecuencia),
      expresionCron: clean(form.expresionCron),
      zonaHoraria: clean(form.zonaHoraria),
      formatoSalida: clean(form.formatoSalida),
      destinoEntrega: clean(form.destinoEntrega),
      destinatarios: clean(form.destinatarios),
      responsableTecnico: clean(form.responsableTecnico),
      responsableQA: clean(form.responsableQA),
      criticidadGxP: clean(form.criticidadGxP),
      requiereRevisionQA: clean(form.requiereRevisionQA),
      requiereFirmaElectronica: clean(form.requiereFirmaElectronica),
      firmaAsociada: clean(form.firmaAsociada),
      reglasGeneracion: clean(form.reglasGeneracion),
      validacionesDatos: clean(form.validacionesDatos),
      proximaGeneracion: clean(form.proximaGeneracion),
      estadoProgramacion: clean(form.estadoProgramacion),
      resultadoUltimaGeneracion: clean(form.resultadoUltimaGeneracion),
      registrosIncluidos: clean(form.registrosIncluidos),
      erroresDetectados: clean(form.erroresDetectados),
      auditTrailGenerado: clean(form.auditTrailGenerado),
      requiereEscalamiento: clean(form.requiereEscalamiento),
      escaladoA: clean(form.escaladoA),
      decisionQA: clean(form.decisionQA),
      desviacionAsociada: clean(form.desviacionAsociada),
      capa: clean(form.capa),
      evidencia: clean(form.evidencia),
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

    showNotice("success", editingId ? "Reporte programado actualizado correctamente." : "Reporte programado registrado correctamente con control QA.");
  }

  function handleEdit(record: ReporteProgramado) {
    setForm(record);
    setEditingId(record.id);
    setSubmitAttempted(false);
    showNotice("success", "Reporte programado cargado para edición.");
  }

  function handleDelete(id: string) {
    const confirmed = window.confirm("¿Confirmas eliminar este reporte programado? En GMP real debería manejarse como anulación auditada.");
    if (!confirmed) return;

    const nextRecords = records.filter((record) => record.id !== id);
    setRecords(nextRecords);
    saveRecords(nextRecords);
    showNotice("success", "Reporte programado eliminado del almacenamiento local.");
  }

  function exportJson() {
    if (records.length === 0) {
      showNotice("warning", "No hay reportes programados para exportar.");
      return;
    }

    const blob = new Blob([JSON.stringify(records, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `floratrack-reportes-programados-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();

    URL.revokeObjectURL(url);
    showNotice("success", "Archivo JSON exportado correctamente.");
  }

  const filteredRecords = useMemo(() => {
    const term = clean(search).toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        !term ||
        [
          record.codigo,
          record.nombreReporte,
          record.tipoReporte,
          record.moduloOrigen,
          record.frecuencia,
          record.formatoSalida,
          record.criticidadGxP,
          record.estadoProgramacion,
          record.decisionQA,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

      const matchesEstado = filterEstado === "Todos" || record.estadoProgramacion === filterEstado;

      return matchesSearch && matchesEstado;
    });
  }, [records, search, filterEstado]);

  const metrics = useMemo(() => {
    return {
      total: records.length,
      activos: records.filter((record) => ["Activa", "Activa con observación"].includes(record.estadoProgramacion)).length,
      criticos: records.filter((record) => ["GxP alto", "GxP crítico"].includes(record.criticidadGxP)).length,
      fallidos: records.filter((record) => ["Fallida", "Suspendida"].includes(record.estadoProgramacion)).length,
      qa: records.filter((record) => record.requiereRevisionQA === "Sí").length,
    };
  }, [records]);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-slate-100">
      {notice && (
        <CloudNoticeBox
          notice={notice}
          onClose={() => setNotice(null)}
        />
      )}

      <section className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-3xl border border-blue-400/20 bg-slate-900/80 p-6 shadow-2xl shadow-blue-950/30">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-300">
            FloraTrack Enterprise Compliance Platform
          </p>

          <h1 className="mt-3 text-3xl font-black text-white md:text-5xl">
            Automatización de reportes programados
          </h1>

          <p className="mt-3 max-w-5xl text-sm leading-6 text-slate-300 md:text-base">
            Control especializado de reportes programados, frecuencias, origen de datos,
            formato de salida, destinatarios, ejecución, audit trail, errores, firma electrónica,
            CAPA y aprobación QA.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-5">
          <Metric title="Reportes" value={metrics.total} />
          <Metric title="Activos" value={metrics.activos} tone="emerald" />
          <Metric title="GxP alto" value={metrics.criticos} tone="red" />
          <Metric title="Fallidos" value={metrics.fallidos} tone="amber" />
          <Metric title="Revisión QA" value={metrics.qa} tone="sky" />
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
            <div className="mb-5">
              <h2 className="text-2xl font-black text-white">
                {editingId ? "Editar reporte programado" : "Nuevo reporte programado"}
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Ningún reporte programado puede guardarse vacío o incompleto.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <TextField label="Código de programación *" field="codigo" form={form} updateField={updateField} error={fieldHasError("codigo")} placeholder="RPA-2026-001" />
              <TextField label="Fecha de configuración *" field="fechaConfiguracion" form={form} updateField={updateField} error={fieldHasError("fechaConfiguracion")} type="date" />
              <TextField label="Hora de configuración *" field="horaConfiguracion" form={form} updateField={updateField} error={fieldHasError("horaConfiguracion")} type="time" />
              <TextField label="Empresa *" field="empresa" form={form} updateField={updateField} error={fieldHasError("empresa")} placeholder="Growlifecol S.A.S." />
              <TextField label="Sede / predio *" field="sede" form={form} updateField={updateField} error={fieldHasError("sede")} placeholder="Sede principal" />
              <TextField label="Nombre del reporte *" field="nombreReporte" form={form} updateField={updateField} error={fieldHasError("nombreReporte")} placeholder="Reporte ejecutivo semanal QA" />

              <SelectField label="Tipo de reporte *" field="tipoReporte" form={form} updateField={updateField} error={fieldHasError("tipoReporte")} options={["Reporte ejecutivo", "Reporte QA", "Reporte GMP", "Reporte GACP", "Reporte regulatorio", "Reporte CAPA", "Reporte auditoría", "Reporte inventario", "Reporte trazabilidad", "Reporte vencimientos", "Reporte riesgos", "Reporte control de cambios"]} />
              <SelectField label="Módulo origen *" field="moduloOrigen" form={form} updateField={updateField} error={fieldHasError("moduloOrigen")} options={moduleOptions} />
              <SelectField label="Frecuencia *" field="frecuencia" form={form} updateField={updateField} error={fieldHasError("frecuencia")} options={["Diaria", "Semanal", "Mensual", "Trimestral", "Anual", "Antes de auditoría", "Antes de release", "Bajo demanda"]} />
              <TextField label="Expresion CRON *" field="expresionCron" form={form} updateField={updateField} error={fieldHasError("expresionCron")} placeholder="0 8 * * 1 / No aplica" />
              <SelectField label="Formato de salida *" field="formatoSalida" form={form} updateField={updateField} error={fieldHasError("formatoSalida")} options={["PDF", "JSON", "CSV", "XLSX", "Dashboard interno", "Correo HTML", "Paquete ZIP", "Múltiples formatos"]} />
              <SelectField label="Destino de entrega *" field="destinoEntrega" form={form} updateField={updateField} error={fieldHasError("destinoEntrega")} options={["Dashboard FloraTrack", "Correo QA", "Carpeta controlada", "Backup validado", "Autoridad regulatoria", "Cliente", "Repositorio documental", "Webhook / API", "No enviar, solo generar"]} />
              <SelectField label="Zona horaria *" field="zonaHoraria" form={form} updateField={updateField} error={fieldHasError("zonaHoraria")} options={["America/Bogota", "UTC", "America/Mexico_City", "America/Lima", "America/Santiago"]} />
              <TextField label="Responsable técnico *" field="responsableTecnico" form={form} updateField={updateField} error={fieldHasError("responsableTecnico")} placeholder="Equipo técnico FloraTrack" />
              <TextField label="Responsable QA *" field="responsableQA" form={form} updateField={updateField} error={fieldHasError("responsableQA")} placeholder="QA" />
              <SelectField label="Criticidad GxP *" field="criticidadGxP" form={form} updateField={updateField} error={fieldHasError("criticidadGxP")} options={["No GxP", "GxP bajo", "GxP medio", "GxP alto", "GxP crítico"]} />
              <SelectField label="Requiere revisión QA *" field="requiereRevisionQA" form={form} updateField={updateField} error={fieldHasError("requiereRevisionQA")} options={["Sí", "No"]} />
              <SelectField label="Requiere firma electrónica *" field="requiereFirmaElectronica" form={form} updateField={updateField} error={fieldHasError("requiereFirmaElectronica")} options={["Sí", "No"]} />
              <TextField label="Firma asociada" field="firmaAsociada" form={form} updateField={updateField} error={fieldHasError("firmaAsociada")} placeholder="SIG-2026-001 / No aplica" />
              <TextField label="Próxima generación *" field="proximaGeneracion" form={form} updateField={updateField} error={fieldHasError("proximaGeneracion")} type="date" />
              <SelectField label="Estado de programación *" field="estadoProgramacion" form={form} updateField={updateField} error={fieldHasError("estadoProgramacion")} options={["Diseño", "En pruebas", "Activa", "Activa con observación", "Pausada", "Fallida", "Suspendida", "Retirada", "Cerrada"]} />
              <SelectField label="Resultado última generación *" field="resultadoUltimaGeneracion" form={form} updateField={updateField} error={fieldHasError("resultadoUltimaGeneracion")} options={["Conforme", "Con observación", "Fallida", "Pendiente primera generación", "No aplica"]} />
              <TextField label="Registros incluidos *" field="registrosIncluidos" form={form} updateField={updateField} error={fieldHasError("registrosIncluidos")} type="number" placeholder="100" />
              <TextField label="Errores detectados *" field="erroresDetectados" form={form} updateField={updateField} error={fieldHasError("erroresDetectados")} type="number" placeholder="0" />
              <SelectField label="Audit trail generado *" field="auditTrailGenerado" form={form} updateField={updateField} error={fieldHasError("auditTrailGenerado")} options={["Sí", "No"]} />
              <SelectField label="Requiere escalamiento *" field="requiereEscalamiento" form={form} updateField={updateField} error={fieldHasError("requiereEscalamiento")} options={["Sí", "No"]} />
              <TextField label="Escalado a" field="escaladoA" form={form} updateField={updateField} error={fieldHasError("escaladoA")} placeholder="QA Manager / Dirección Técnica" />
              <SelectField label="Decisión QA *" field="decisionQA" form={form} updateField={updateField} error={fieldHasError("decisionQA")} options={["Pendiente QA", "Aprobado QA", "Aprobado con observación QA", "Rechazado QA", "Requiere CAPA", "Requiere remediación", "Requiere validación", "Cierre aprobado QA", "No aplica"]} />
              <TextField label="Desviación asociada" field="desviacionAsociada" form={form} updateField={updateField} error={fieldHasError("desviacionAsociada")} placeholder="DEV-2026-001 / CAPA-001" />
              <TextField label="Evidencia / soporte" field="evidencia" form={form} updateField={updateField} error={fieldHasError("evidencia")} placeholder="Log, captura, reporte generado, aprobación QA..." />

              <TextAreaField label="Alcance de datos *" field="alcanceDatos" form={form} updateField={updateField} error={fieldHasError("alcanceDatos")} placeholder="Define módulos, registros, estados, periodos y criterios incluidos." />
              <TextAreaField label="Destinatarios *" field="destinatarios" form={form} updateField={updateField} error={fieldHasError("destinatarios")} placeholder="QA, Dirección Técnica, Gerencia..." />
              <TextAreaField label="Reglas de generación *" field="reglasGeneracion" form={form} updateField={updateField} error={fieldHasError("reglasGeneracion")} placeholder="Reglas de cálculo, filtros, KPIs, vencimientos y alertas." />
              <TextAreaField label="Validaciones de datos *" field="validacionesDatos" form={form} updateField={updateField} error={fieldHasError("validacionesDatos")} placeholder="Campos obligatorios, duplicados, fechas, estados QA y trazabilidad." />
              <TextAreaField label="CAPA" field="capa" form={form} updateField={updateField} error={fieldHasError("capa")} placeholder="Obligatoria si hay fallos, errores detectados o rechazo QA." />
              <TextAreaField label="Observaciones" field="observaciones" form={form} updateField={updateField} error={false} placeholder="Notas QA, restricciones o próximos pasos." />
            </div>

            <div className="mt-6 flex flex-col gap-3 md:flex-row">
              <button type="button" onClick={handleSave} className="rounded-2xl bg-blue-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-blue-950/50 transition hover:bg-blue-400">
                {editingId ? "Actualizar reporte" : "Guardar reporte"}
              </button>

              <button type="button" onClick={resetForm} className="rounded-2xl border border-slate-600 px-6 py-3 text-sm font-bold text-slate-200 transition hover:bg-slate-800">
                Limpiar formulario
              </button>
            </div>
          </form>

          <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">Registro maestro</h2>
                <p className="mt-1 text-sm text-slate-400">Consulta, filtra, edita y exporta reportes programados.</p>
              </div>

              <button type="button" onClick={exportJson} className="rounded-2xl border border-blue-400/50 px-5 py-3 text-sm font-bold text-blue-200 transition hover:bg-blue-500/10">
                Exportar JSON
              </button>
            </div>

            <div className="mb-5 grid gap-3 md:grid-cols-[1fr_250px]">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-blue-400/40 transition placeholder:text-slate-600 focus:border-blue-400 focus:ring-4"
                placeholder="Buscar por reporte, módulo, frecuencia, estado..."
              />

              <select
                value={filterEstado}
                onChange={(event) => setFilterEstado(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-blue-400/40 transition focus:border-blue-400 focus:ring-4"
              >
                <option>Todos</option>
                <option>Diseño</option>
                <option>En pruebas</option>
                <option>Activa</option>
                <option>Activa con observación</option>
                <option>Pausada</option>
                <option>Fallida</option>
                <option>Suspendida</option>
                <option>Retirada</option>
                <option>Cerrada</option>
              </select>
            </div>

            <div className="max-h-[780px] space-y-4 overflow-auto pr-2">
              {filteredRecords.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center text-sm text-slate-400">
                  No hay reportes programados registrados. Crea el primer reporte con datos completos.
                </div>
              ) : (
                filteredRecords.map((record) => (
                  <article key={record.id} className="rounded-2xl border border-slate-700 bg-slate-950 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-white">{record.codigo} · {record.nombreReporte}</h3>
                          <StatusPill value={record.estadoProgramacion} />
                          <span className="rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-200">
                            {record.criticidadGxP}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-400">
                          {record.tipoReporte} · {record.frecuencia} · próxima {record.proximaGeneracion}
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
                      <Data label="Módulo origen" value={record.moduloOrigen} />
                      <Data label="Formato" value={record.formatoSalida} />
                      <Data label="CRON / zona" value={`${record.expresionCron} · ${record.zonaHoraria}`} />
                      <Data label="Destino" value={record.destinoEntrega} />
                      <Data label="QA" value={record.responsableQA} />
                      <Data label="Audit trail" value={record.auditTrailGenerado} />
                      <Data label="Revisión QA" value={record.requiereRevisionQA} />
                      <Data label="Firma" value={record.requiereFirmaElectronica} />
                      <Data label="Resultado" value={record.resultadoUltimaGeneracion} />
                      <Data label="Registros / errores" value={`${record.registrosIncluidos} / ${record.erroresDetectados}`} />
                      <Data label="Decisión QA" value={record.decisionQA} />
                      <Data label="Evidencia" value={record.evidencia || "Sin registro"} />
                    </div>

                    <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300">
                      <p><span className="font-bold text-slate-100">Alcance: </span>{record.alcanceDatos}</p>
                      <p className="mt-2"><span className="font-bold text-slate-100">Destinatarios: </span>{record.destinatarios}</p>
                      <p className="mt-2"><span className="font-bold text-slate-100">Reglas: </span>{record.reglasGeneracion}</p>
                      <p className="mt-2"><span className="font-bold text-slate-100">Validaciones: </span>{record.validacionesDatos}</p>

                      {record.desviacionAsociada && <p className="mt-2"><span className="font-bold text-slate-100">Desviación: </span>{record.desviacionAsociada}</p>}
                      {record.capa && <p className="mt-2"><span className="font-bold text-slate-100">CAPA: </span>{record.capa}</p>}
                      {record.observaciones && <p className="mt-2"><span className="font-bold text-slate-100">Observaciones: </span>{record.observaciones}</p>}
                    </div>
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

function CloudNoticeBox({ notice, onClose }: { notice: CloudNotice; onClose: () => void }) {
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
  field: keyof ReporteProgramado;
  form: ReporteProgramado;
  updateField: (field: keyof ReporteProgramado, value: string) => void;
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
          error ? "border-red-400 bg-red-950/30 ring-4 ring-red-400/20" : "border-slate-700 bg-slate-950 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/40"
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
  field: keyof ReporteProgramado;
  form: ReporteProgramado;
  updateField: (field: keyof ReporteProgramado, value: string) => void;
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
          error ? "border-red-400 bg-red-950/30 ring-4 ring-red-400/20" : "border-slate-700 bg-slate-950 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/40"
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
  field: keyof ReporteProgramado;
  form: ReporteProgramado;
  updateField: (field: keyof ReporteProgramado, value: string) => void;
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
          error ? "border-red-400 bg-red-950/30 ring-4 ring-red-400/20" : "border-slate-700 bg-slate-950 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/40"
        }`}
      />

      {error && <p className="mt-1 text-xs font-bold text-red-300">Completa o corrige este campo.</p>}
    </label>
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
    value === "Activa" || value === "Cerrada"
      ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
      : value === "Diseño" || value === "En pruebas" || value === "Activa con observación" || value === "Pausada"
      ? "border-amber-400/40 bg-amber-500/10 text-amber-200"
      : "border-red-400/40 bg-red-500/10 text-red-200";

  return <span className={`rounded-full border px-3 py-1 text-xs font-bold ${className}`}>{value || "Sin estado"}</span>;
}
