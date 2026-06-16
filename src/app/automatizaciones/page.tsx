"use client";

import { useEffect, useMemo, useState } from "react";

type AutomationRecord = {
  id: string;
  codigoAutomatizacion: string;
  fechaRegistro: string;
  horaRegistro: string;
  empresa: string;
  sede: string;
  nombreAutomatizacion: string;
  tipoAutomatizacion: string;
  moduloOrigen: string;
  moduloDestino: string;
  frecuencia: string;
  expresionCron: string;
  zonaHoraria: string;
  responsableTecnico: string;
  responsableQA: string;
  criticidadGxP: string;
  estadoAutomatizacion: string;
  origenDatos: string;
  destinoSalida: string;
  reglasEjecucion: string;
  ultimaEjecucion: string;
  proximaEjecucion: string;
  resultadoUltimaEjecucion: string;
  registrosProcesados: string;
  registrosFallidos: string;
  auditTrailGenerado: string;
  requiereFirmaElectronica: string;
  firmaAsociada: string;
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

type FieldConfig = {
  key: keyof AutomationRecord;
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

const STORAGE_KEY = "floratrack_automatizaciones_jobs_qa_v1";

const emptyForm: AutomationRecord = {
  id: "",
  codigoAutomatizacion: "",
  fechaRegistro: "",
  horaRegistro: "",
  empresa: "",
  sede: "",
  nombreAutomatizacion: "",
  tipoAutomatizacion: "",
  moduloOrigen: "",
  moduloDestino: "",
  frecuencia: "",
  expresionCron: "",
  zonaHoraria: "",
  responsableTecnico: "",
  responsableQA: "",
  criticidadGxP: "",
  estadoAutomatizacion: "",
  origenDatos: "",
  destinoSalida: "",
  reglasEjecucion: "",
  ultimaEjecucion: "",
  proximaEjecucion: "",
  resultadoUltimaEjecucion: "",
  registrosProcesados: "",
  registrosFallidos: "",
  auditTrailGenerado: "",
  requiereFirmaElectronica: "",
  firmaAsociada: "",
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

const requiredFields: Array<keyof AutomationRecord> = [
  "codigoAutomatizacion",
  "fechaRegistro",
  "horaRegistro",
  "empresa",
  "sede",
  "nombreAutomatizacion",
  "tipoAutomatizacion",
  "moduloOrigen",
  "moduloDestino",
  "frecuencia",
  "zonaHoraria",
  "responsableTecnico",
  "responsableQA",
  "criticidadGxP",
  "estadoAutomatizacion",
  "origenDatos",
  "destinoSalida",
  "reglasEjecucion",
  "proximaEjecucion",
  "resultadoUltimaEjecucion",
  "registrosProcesados",
  "registrosFallidos",
  "auditTrailGenerado",
  "requiereFirmaElectronica",
  "requiereEscalamiento",
  "decisionQA",
];

const fieldLabels: Record<keyof AutomationRecord, string> = {
  id: "ID",
  codigoAutomatizacion: "Código de automatización",
  fechaRegistro: "Fecha de registro",
  horaRegistro: "Hora de registro",
  empresa: "Empresa",
  sede: "Sede / predio",
  nombreAutomatizacion: "Nombre de automatización",
  tipoAutomatizacion: "Tipo de automatización",
  moduloOrigen: "Módulo origen",
  moduloDestino: "Módulo destino",
  frecuencia: "Frecuencia",
  expresionCron: "Expresión cron",
  zonaHoraria: "Zona horaria",
  responsableTecnico: "Responsable técnico",
  responsableQA: "Responsable QA",
  criticidadGxP: "Criticidad GxP",
  estadoAutomatizacion: "Estado de automatización",
  origenDatos: "Origen de datos",
  destinoSalida: "Destino de salida",
  reglasEjecucion: "Reglas de ejecución",
  ultimaEjecucion: "Última ejecución",
  proximaEjecucion: "Próxima ejecución",
  resultadoUltimaEjecucion: "Resultado última ejecución",
  registrosProcesados: "Registros procesados",
  registrosFallidos: "Registros fallidos",
  auditTrailGenerado: "Audit trail generado",
  requiereFirmaElectronica: "Requiere firma electrónica",
  firmaAsociada: "Firma asociada",
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
  "Dashboard",
  "Empresas",
  "GIS",
  "Cultivos",
  "Propagación",
  "Cosecha",
  "Recepción",
  "Inventario",
  "Calidad QA",
  "Desviaciones / CAPA",
  "Auditorías",
  "Documentos",
  "Firmas electrónicas",
  "Part 11",
  "Backups",
  "Integraciones",
  "Entrenamiento",
  "Equipos",
  "Proveedores",
  "Saneamiento",
  "Plagas / MIP",
  "Residuos",
  "Recall",
  "Retención",
  "Usuarios",
  "Reportes",
  "Notificaciones",
  "CSV / DataOps",
  "Regulatorio",
  "Workflows QA",
  "Múltiples módulos",
];

const fields: FieldConfig[] = [
  { key: "codigoAutomatizacion", label: "Código de automatización *", placeholder: "AUTO-2026-001" },
  { key: "fechaRegistro", label: "Fecha de registro *", type: "date" },
  { key: "horaRegistro", label: "Hora de registro *", type: "time" },
  { key: "empresa", label: "Empresa *", placeholder: "Growlifecol S.A.S." },
  { key: "sede", label: "Sede / predio *", placeholder: "Sede principal" },
  { key: "nombreAutomatizacion", label: "Nombre de automatización *", placeholder: "Reporte ejecutivo mensual QA" },
  {
    key: "tipoAutomatizacion",
    label: "Tipo de automatización *",
    kind: "select",
    options: [
      "Reporte programado",
      "Notificación programada",
      "Exportación automática",
      "Backup programado",
      "Verificación de vencimientos",
      "Escalamiento QA",
      "Conciliación de datos",
      "Sincronización con API",
      "Generación de KPI",
      "Workflow automático",
      "Recordatorio regulatorio",
      "Otro",
    ],
  },
  {
    key: "moduloOrigen",
    label: "Módulo origen *",
    kind: "select",
    options: moduleOptions,
  },
  {
    key: "moduloDestino",
    label: "Módulo destino *",
    kind: "select",
    options: moduleOptions,
  },
  {
    key: "frecuencia",
    label: "Frecuencia *",
    kind: "select",
    options: ["Cada hora", "Diaria", "Semanal", "Mensual", "Trimestral", "Anual", "Antes de release", "Bajo demanda", "Cron personalizado"],
  },
  { key: "expresionCron", label: "Expresión cron", placeholder: "0 8 * * 1 / opcional según frecuencia" },
  {
    key: "zonaHoraria",
    label: "Zona horaria *",
    kind: "select",
    options: ["America/Bogota", "UTC", "America/Mexico_City", "America/Lima", "America/Santiago", "Otra documentada"],
  },
  { key: "responsableTecnico", label: "Responsable técnico *", placeholder: "TI / QA sistemas / responsable de automatización" },
  { key: "responsableQA", label: "Responsable QA *", placeholder: "QA que aprueba o valida la automatización" },
  {
    key: "criticidadGxP",
    label: "Criticidad GxP *",
    kind: "select",
    options: ["No GxP", "GxP bajo", "GxP medio", "GxP alto", "GxP crítico"],
  },
  {
    key: "estadoAutomatizacion",
    label: "Estado de automatización *",
    kind: "select",
    options: ["Diseño", "En pruebas", "Activa", "Activa con observación", "Pausada", "Fallida", "Suspendida", "Retirada", "Cerrada"],
  },
  {
    key: "origenDatos",
    label: "Origen de datos *",
    kind: "textarea",
    placeholder: "Describe módulos, registros, tablas, fuentes externas, API, CSV, reportes o consultas usadas.",
  },
  {
    key: "destinoSalida",
    label: "Destino de salida *",
    kind: "textarea",
    placeholder: "Describe destino: reporte, correo, alerta, dashboard, backup, JSON, CSV, integración, workflow.",
  },
  {
    key: "reglasEjecucion",
    label: "Reglas de ejecución *",
    kind: "textarea",
    placeholder: "Describe reglas, filtros, criterios QA, validaciones, condiciones de disparo y controles de errores.",
  },
  { key: "ultimaEjecucion", label: "Última ejecución", type: "date" },
  { key: "proximaEjecucion", label: "Próxima ejecución *", type: "date" },
  {
    key: "resultadoUltimaEjecucion",
    label: "Resultado última ejecución *",
    kind: "select",
    options: ["Conforme", "Con observación", "Fallida", "Pendiente primera ejecución", "No aplica"],
  },
  { key: "registrosProcesados", label: "Registros procesados *", type: "number", placeholder: "100" },
  { key: "registrosFallidos", label: "Registros fallidos *", type: "number", placeholder: "0" },
  {
    key: "auditTrailGenerado",
    label: "Audit trail generado *",
    kind: "select",
    options: ["Sí", "No"],
  },
  {
    key: "requiereFirmaElectronica",
    label: "Requiere firma electrónica *",
    kind: "select",
    options: ["Sí", "No"],
  },
  { key: "firmaAsociada", label: "Firma asociada", placeholder: "SIG-2026-001 / pendiente" },
  {
    key: "requiereEscalamiento",
    label: "Requiere escalamiento *",
    kind: "select",
    options: ["Sí", "No"],
  },
  { key: "escaladoA", label: "Escalado a", placeholder: "QA Manager / Dirección Técnica / Gerencia / Regulatorio" },
  {
    key: "decisionQA",
    label: "Decisión QA *",
    kind: "select",
    options: [
      "Pendiente QA",
      "Aprobado QA",
      "Aprobado con observación QA",
      "Rechazado QA",
      "Requiere CAPA",
      "Requiere validación",
      "Requiere remediación",
      "Cierre aprobado QA",
      "No aplica",
    ],
  },
  { key: "desviacionAsociada", label: "Desviación asociada", placeholder: "DEV-2026-001 / CAPA-001" },
  {
    key: "capa",
    label: "CAPA",
    kind: "textarea",
    placeholder: "Obligatoria si falla la ejecución, hay registros fallidos, automatización suspendida o rechazo QA.",
  },
  { key: "evidencia", label: "Evidencia / soporte", placeholder: "Log, captura, reporte generado, audit trail, prueba, aprobación QA..." },
  {
    key: "observaciones",
    label: "Observaciones",
    kind: "textarea",
    placeholder: "Notas QA, restricciones, condiciones, errores conocidos, seguimiento o mejoras futuras.",
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

function toNumber(value: string): number {
  return Number(clean(value));
}

function safeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `AUTO-${Date.now()}-${Math.random().toString(16).slice(2)}`;
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

function loadRecords(): AutomationRecord[] {
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

function saveRecords(records: AutomationRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export default function AutomatizacionesPage() {
  const [records, setRecords] = useState<AutomationRecord[]>([]);
  const [form, setForm] = useState<AutomationRecord>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [cloud, setCloud] = useState<CloudState | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("Todos");

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

  function updateField(field: keyof AutomationRecord, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function hasCriticalGxP(): boolean {
    return ["GxP alto", "GxP crítico"].includes(form.criticidadGxP);
  }

  function needsCapa(): boolean {
    const failed = toNumber(form.registrosFallidos);

    return (
      failed > 0 ||
      ["Fallida", "Suspendida", "Retirada"].includes(form.estadoAutomatizacion) ||
      ["Fallida", "Con observación"].includes(form.resultadoUltimaEjecucion) ||
      ["Rechazado QA", "Requiere CAPA", "Requiere remediación"].includes(form.decisionQA)
    );
  }

  function validateForm(): string[] {
    const errors = requiredFields
      .filter((field) => isInvalid(form[field]))
      .map((field) => fieldLabels[field]);

    const processed = toNumber(form.registrosProcesados);
    const failed = toNumber(form.registrosFallidos);

    if (!Number.isFinite(processed) || processed < 0) {
      errors.push("Los registros procesados deben ser un número igual o mayor a cero");
    }

    if (!Number.isFinite(failed) || failed < 0) {
      errors.push("Los registros fallidos deben ser un número igual o mayor a cero");
    }

    if (form.frecuencia === "Cron personalizado" && isInvalid(form.expresionCron)) {
      errors.push("La expresión cron es obligatoria cuando la frecuencia es Cron personalizado");
    }

    if (form.estadoAutomatizacion === "Activa" && isInvalid(form.ultimaEjecucion) && form.resultadoUltimaEjecucion !== "Pendiente primera ejecución") {
      errors.push("La última ejecución es obligatoria para automatizaciones activas que ya tienen resultado");
    }

    if (form.proximaEjecucion && form.fechaRegistro && isDateBefore(form.proximaEjecucion, form.fechaRegistro)) {
      errors.push("La próxima ejecución no puede ser anterior a la fecha de registro");
    }

    if (form.ultimaEjecucion && form.fechaRegistro && isDateBefore(form.ultimaEjecucion, form.fechaRegistro)) {
      errors.push("La última ejecución no puede ser anterior a la fecha de registro");
    }

    if (hasCriticalGxP() && form.auditTrailGenerado !== "Sí") {
      errors.push("Las automatizaciones GxP alto o crítico deben generar audit trail");
    }

    if (hasCriticalGxP() && form.requiereFirmaElectronica !== "Sí") {
      errors.push("Las automatizaciones GxP alto o crítico deben requerir firma electrónica");
    }

    if (form.requiereFirmaElectronica === "Sí" && isInvalid(form.firmaAsociada)) {
      errors.push("La firma asociada es obligatoria cuando requiere firma electrónica");
    }

    if (form.requiereEscalamiento === "Sí" && isInvalid(form.escaladoA)) {
      errors.push("El campo Escalado a es obligatorio cuando requiere escalamiento");
    }

    if (["Activa", "Activa con observación", "Cerrada"].includes(form.estadoAutomatizacion) && isInvalid(form.evidencia)) {
      errors.push("La evidencia es obligatoria para automatizaciones activas, activas con observación o cerradas");
    }

    if (["Aprobado QA", "Aprobado con observación QA", "Rechazado QA", "Cierre aprobado QA"].includes(form.decisionQA) && isInvalid(form.evidencia)) {
      errors.push("La evidencia es obligatoria para decisiones QA formales");
    }

    if (needsCapa() && isInvalid(form.desviacionAsociada)) {
      errors.push("La desviación asociada es obligatoria cuando hay fallos, suspensión, registros fallidos o rechazo QA");
    }

    if (needsCapa() && isInvalid(form.capa)) {
      errors.push("La CAPA es obligatoria cuando hay fallos, suspensión, registros fallidos o rechazo QA");
    }

    return Array.from(new Set(errors));
  }

  function fieldHasError(field: keyof AutomationRecord): boolean {
    if (!submitAttempted) return false;

    if (requiredFields.includes(field) && isInvalid(form[field])) return true;

    if (field === "registrosProcesados") {
      const processed = toNumber(form.registrosProcesados);
      return !Number.isFinite(processed) || processed < 0;
    }

    if (field === "registrosFallidos") {
      const failed = toNumber(form.registrosFallidos);
      return !Number.isFinite(failed) || failed < 0;
    }

    if (field === "expresionCron" && form.frecuencia === "Cron personalizado" && isInvalid(form.expresionCron)) return true;
    if (field === "proximaEjecucion" && form.proximaEjecucion && form.fechaRegistro && isDateBefore(form.proximaEjecucion, form.fechaRegistro)) return true;
    if (field === "ultimaEjecucion" && form.ultimaEjecucion && form.fechaRegistro && isDateBefore(form.ultimaEjecucion, form.fechaRegistro)) return true;
    if (field === "auditTrailGenerado" && hasCriticalGxP() && form.auditTrailGenerado !== "Sí") return true;
    if (field === "requiereFirmaElectronica" && hasCriticalGxP() && form.requiereFirmaElectronica !== "Sí") return true;
    if (field === "firmaAsociada" && form.requiereFirmaElectronica === "Sí" && isInvalid(form.firmaAsociada)) return true;
    if (field === "escaladoA" && form.requiereEscalamiento === "Sí" && isInvalid(form.escaladoA)) return true;
    if (field === "evidencia" && ["Activa", "Activa con observación", "Cerrada"].includes(form.estadoAutomatizacion) && isInvalid(form.evidencia)) return true;
    if (field === "evidencia" && ["Aprobado QA", "Aprobado con observación QA", "Rechazado QA", "Cierre aprobado QA"].includes(form.decisionQA) && isInvalid(form.evidencia)) return true;
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
      showCloud("No se guardó la automatización. Completa la información obligatoria.", errors, "warning");
      return;
    }

    const timestamp = nowIso();

    const payload: AutomationRecord = {
      ...form,
      codigoAutomatizacion: clean(form.codigoAutomatizacion),
      fechaRegistro: clean(form.fechaRegistro),
      horaRegistro: clean(form.horaRegistro),
      empresa: clean(form.empresa),
      sede: clean(form.sede),
      nombreAutomatizacion: clean(form.nombreAutomatizacion),
      tipoAutomatizacion: clean(form.tipoAutomatizacion),
      moduloOrigen: clean(form.moduloOrigen),
      moduloDestino: clean(form.moduloDestino),
      frecuencia: clean(form.frecuencia),
      expresionCron: clean(form.expresionCron),
      zonaHoraria: clean(form.zonaHoraria),
      responsableTecnico: clean(form.responsableTecnico),
      responsableQA: clean(form.responsableQA),
      criticidadGxP: clean(form.criticidadGxP),
      estadoAutomatizacion: clean(form.estadoAutomatizacion),
      origenDatos: clean(form.origenDatos),
      destinoSalida: clean(form.destinoSalida),
      reglasEjecucion: clean(form.reglasEjecucion),
      ultimaEjecucion: clean(form.ultimaEjecucion),
      proximaEjecucion: clean(form.proximaEjecucion),
      resultadoUltimaEjecucion: clean(form.resultadoUltimaEjecucion),
      registrosProcesados: clean(form.registrosProcesados),
      registrosFallidos: clean(form.registrosFallidos),
      auditTrailGenerado: clean(form.auditTrailGenerado),
      requiereFirmaElectronica: clean(form.requiereFirmaElectronica),
      firmaAsociada: clean(form.firmaAsociada),
      requiereEscalamiento: clean(form.requiereEscalamiento),
      escaladoA: clean(form.escaladoA),
      decisionQA: clean(form.decisionQA),
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
      editingId ? "Automatización actualizada correctamente." : "Automatización registrada correctamente con control QA.",
      [],
      "success"
    );
  }

  function handleEdit(record: AutomationRecord) {
    setForm(record);
    setEditingId(record.id);
    setSubmitAttempted(false);
    showCloud("Automatización cargada para edición. Verifica antes de actualizar.", [], "success");
  }

  function handleDelete(id: string) {
    const confirmed = window.confirm("¿Confirmas eliminar esta automatización? En ambiente GMP real debería manejarse como inactivación o anulación auditada.");
    if (!confirmed) return;

    const nextRecords = records.filter((record) => record.id !== id);
    setRecords(nextRecords);
    saveRecords(nextRecords);
    showCloud("Automatización eliminada del almacenamiento local.", [], "success");
  }

  function exportJson() {
    if (records.length === 0) {
      showCloud("No hay automatizaciones para exportar.", [], "warning");
      return;
    }

    const blob = new Blob([JSON.stringify(records, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `floratrack-automatizaciones-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);

    showCloud("Archivo JSON de automatizaciones exportado correctamente.", [], "success");
  }

  const filteredRecords = useMemo(() => {
    const term = clean(search).toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        !term ||
        [
          record.codigoAutomatizacion,
          record.nombreAutomatizacion,
          record.tipoAutomatizacion,
          record.moduloOrigen,
          record.moduloDestino,
          record.criticidadGxP,
          record.estadoAutomatizacion,
          record.decisionQA,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

      const matchesEstado = filterEstado === "Todos" || record.estadoAutomatizacion === filterEstado;

      return matchesSearch && matchesEstado;
    });
  }, [records, search, filterEstado]);

  const dashboard = useMemo(() => {
    return {
      total: records.length,
      activas: records.filter((record) => ["Activa", "Activa con observación"].includes(record.estadoAutomatizacion)).length,
      criticas: records.filter((record) => ["GxP alto", "GxP crítico"].includes(record.criticidadGxP)).length,
      fallidas: records.filter((record) => ["Fallida", "Suspendida"].includes(record.estadoAutomatizacion)).length,
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
        <header className="rounded-3xl border border-teal-400/20 bg-slate-900/80 p-6 shadow-2xl shadow-teal-950/30">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-teal-300">
                FloraTrack Enterprise Compliance Platform
              </p>

              <h1 className="mt-3 text-3xl font-black text-white md:text-5xl">
                Automatización de reportes, tareas y jobs QA
              </h1>

              <p className="mt-3 max-w-5xl text-sm leading-6 text-slate-300 md:text-base">
                Control de reportes programados, jobs automáticos, frecuencias,
                cron, reglas de ejecución, audit trail, firmas electrónicas,
                escalamiento, evidencia, desviaciones, CAPA y decisión QA.
              </p>
            </div>

            <div className="rounded-2xl border border-teal-400/20 bg-teal-500/10 px-5 py-4 text-sm text-teal-100">
              <p className="font-bold">Automatización QA activa</p>
              <p className="mt-1 text-teal-200">Jobs · Cron · Reportes · Audit Trail · QA</p>
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
          <Metric title="Automatizaciones" value={dashboard.total} />
          <Metric title="Activas" value={dashboard.activas} tone="emerald" />
          <Metric title="GxP alto" value={dashboard.criticas} tone="red" />
          <Metric title="Fallidas" value={dashboard.fallidas} tone="amber" />
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
                <h2 className="text-2xl font-black text-white">{editingId ? "Editar automatización" : "Nueva automatización"}</h2>
                <p className="mt-1 text-sm text-slate-400">Ninguna automatización puede guardarse vacía o incompleta.</p>
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
                  : "border-slate-700 bg-slate-950 focus:border-teal-400 focus:ring-4 focus:ring-teal-400/40";

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

                      {hasError && <p className="mt-1 text-xs font-bold text-red-300">Campo obligatorio o condición de automatización requerida.</p>}
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
              <button type="button" onClick={handleSave} className="rounded-2xl bg-teal-500 px-6 py-3 text-sm font-black text-slate-950 shadow-lg shadow-teal-950/50 transition hover:bg-teal-400">
                {editingId ? "Actualizar automatización" : "Guardar automatización"}
              </button>

              <button type="button" onClick={resetForm} className="rounded-2xl border border-slate-600 px-6 py-3 text-sm font-bold text-slate-200 transition hover:bg-slate-800">
                Limpiar formulario
              </button>
            </div>
          </form>

          <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">Registro maestro de automatizaciones</h2>
                <p className="mt-1 text-sm text-slate-400">Consulta, filtra, edita y exporta jobs QA.</p>
              </div>

              <button type="button" onClick={exportJson} className="rounded-2xl border border-teal-400/50 px-5 py-3 text-sm font-bold text-teal-200 transition hover:bg-teal-500/10">
                Exportar JSON
              </button>
            </div>

            <div className="mb-5 grid gap-3 md:grid-cols-[1fr_250px]">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-teal-400/40 transition placeholder:text-slate-600 focus:border-teal-400 focus:ring-4"
                placeholder="Buscar por job, módulo, frecuencia, estado, QA..."
              />

              <select
                value={filterEstado}
                onChange={(event) => setFilterEstado(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-teal-400/40 transition focus:border-teal-400 focus:ring-4"
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
                  No hay automatizaciones registradas. Crea la primera automatización con datos completos.
                </div>
              ) : (
                filteredRecords.map((record) => (
                  <article key={record.id} className="rounded-2xl border border-slate-700 bg-slate-950 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-white">{record.codigoAutomatizacion} · {record.nombreAutomatizacion}</h3>
                          <StatusPill value={record.estadoAutomatizacion} />
                          <span className="rounded-full border border-teal-400/30 bg-teal-500/10 px-3 py-1 text-xs font-bold text-teal-200">
                            {record.criticidadGxP}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-400">
                          {record.tipoAutomatizacion} · {record.frecuencia} · próxima {record.proximaEjecucion}
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
                      <Data label="Origen" value={record.moduloOrigen} />
                      <Data label="Destino" value={record.moduloDestino} />
                      <Data label="Cron" value={record.expresionCron || "Sin registro"} />
                      <Data label="Zona horaria" value={record.zonaHoraria} />
                      <Data label="Técnico" value={record.responsableTecnico} />
                      <Data label="QA" value={record.responsableQA} />
                      <Data label="Última ejecución" value={record.ultimaEjecucion || "Sin registro"} />
                      <Data label="Resultado" value={record.resultadoUltimaEjecucion} />
                      <Data label="Procesados" value={record.registrosProcesados} />
                      <Data label="Fallidos" value={record.registrosFallidos} />
                      <Data label="Audit trail" value={record.auditTrailGenerado} />
                      <Data label="Firma" value={record.requiereFirmaElectronica} />
                      <Data label="Firma asociada" value={record.firmaAsociada || "Sin registro"} />
                      <Data label="Escalamiento" value={record.requiereEscalamiento} />
                      <Data label="Decisión QA" value={record.decisionQA} />
                      <Data label="Evidencia" value={record.evidencia || "Sin registro"} />
                    </div>

                    <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300">
                      <p><span className="font-bold text-slate-100">Origen de datos: </span>{record.origenDatos}</p>
                      <p className="mt-2"><span className="font-bold text-slate-100">Destino: </span>{record.destinoSalida}</p>
                      <p className="mt-2"><span className="font-bold text-slate-100">Reglas: </span>{record.reglasEjecucion}</p>

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
    value === "Activa" || value === "Cerrada"
      ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
      : value === "Diseño" || value === "En pruebas" || value === "Activa con observación" || value === "Pausada"
      ? "border-amber-400/40 bg-amber-500/10 text-amber-200"
      : "border-red-400/40 bg-red-500/10 text-red-200";

  return <span className={`rounded-full border px-3 py-1 text-xs font-bold ${className}`}>{value || "Sin estado"}</span>;
}
