"use client";

import { useEffect, useMemo, useState } from "react";

type ValidationRecord = {
  id: string;
  codigoValidacion: string;
  fechaValidacion: string;
  horaValidacion: string;
  empresa: string;
  sede: string;
  sistemaModulo: string;
  versionSistema: string;
  tipoValidacion: string;
  categoriaSistema: string;
  ambiente: string;
  proveedorDesarrollo: string;
  responsableValidacion: string;
  responsableQA: string;
  alcanceValidacion: string;
  documentoURS: string;
  matrizRiesgo: string;
  protocolosEjecutados: string;
  requerimientosProbados: string;
  casosAprobados: string;
  casosFallidos: string;
  hallazgosCriticos: string;
  auditTrailVerificado: string;
  firmasElectronicasVerificadas: string;
  controlesAccesoVerificados: string;
  integridadDatosVerificada: string;
  backupRestoreVerificado: string;
  estadoValidacion: string;
  releaseAutorizado: string;
  fechaRelease: string;
  decisionQA: string;
  desviacionAsociada: string;
  capa: string;
  evidencia: string;
  observaciones: string;
  creadoEn: string;
  actualizadoEn: string;
};

type FieldConfig = {
  key: keyof ValidationRecord;
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

const STORAGE_KEY = "floratrack_part11_validacion_sistema_v1";

const emptyForm: ValidationRecord = {
  id: "",
  codigoValidacion: "",
  fechaValidacion: "",
  horaValidacion: "",
  empresa: "",
  sede: "",
  sistemaModulo: "",
  versionSistema: "",
  tipoValidacion: "",
  categoriaSistema: "",
  ambiente: "",
  proveedorDesarrollo: "",
  responsableValidacion: "",
  responsableQA: "",
  alcanceValidacion: "",
  documentoURS: "",
  matrizRiesgo: "",
  protocolosEjecutados: "",
  requerimientosProbados: "",
  casosAprobados: "",
  casosFallidos: "",
  hallazgosCriticos: "",
  auditTrailVerificado: "",
  firmasElectronicasVerificadas: "",
  controlesAccesoVerificados: "",
  integridadDatosVerificada: "",
  backupRestoreVerificado: "",
  estadoValidacion: "",
  releaseAutorizado: "",
  fechaRelease: "",
  decisionQA: "",
  desviacionAsociada: "",
  capa: "",
  evidencia: "",
  observaciones: "",
  creadoEn: "",
  actualizadoEn: "",
};

const requiredFields: Array<keyof ValidationRecord> = [
  "codigoValidacion",
  "fechaValidacion",
  "horaValidacion",
  "empresa",
  "sede",
  "sistemaModulo",
  "versionSistema",
  "tipoValidacion",
  "categoriaSistema",
  "ambiente",
  "responsableValidacion",
  "responsableQA",
  "alcanceValidacion",
  "documentoURS",
  "matrizRiesgo",
  "protocolosEjecutados",
  "requerimientosProbados",
  "casosAprobados",
  "casosFallidos",
  "hallazgosCriticos",
  "auditTrailVerificado",
  "firmasElectronicasVerificadas",
  "controlesAccesoVerificados",
  "integridadDatosVerificada",
  "backupRestoreVerificado",
  "estadoValidacion",
  "releaseAutorizado",
  "decisionQA",
];

const fieldLabels: Record<keyof ValidationRecord, string> = {
  id: "ID",
  codigoValidacion: "Código de validación",
  fechaValidacion: "Fecha de validación",
  horaValidacion: "Hora de validación",
  empresa: "Empresa",
  sede: "Sede / predio",
  sistemaModulo: "Sistema / módulo",
  versionSistema: "Versión del sistema",
  tipoValidacion: "Tipo de validación",
  categoriaSistema: "Categoría del sistema",
  ambiente: "Ambiente",
  proveedorDesarrollo: "Proveedor / desarrollo",
  responsableValidacion: "Responsable de validación",
  responsableQA: "Responsable QA",
  alcanceValidacion: "Alcance de validación",
  documentoURS: "URS / requerimientos",
  matrizRiesgo: "Matriz de riesgo",
  protocolosEjecutados: "Protocolos ejecutados",
  requerimientosProbados: "Requerimientos probados",
  casosAprobados: "Casos aprobados",
  casosFallidos: "Casos fallidos",
  hallazgosCriticos: "Hallazgos críticos",
  auditTrailVerificado: "Audit trail verificado",
  firmasElectronicasVerificadas: "Firmas electrónicas verificadas",
  controlesAccesoVerificados: "Controles de acceso verificados",
  integridadDatosVerificada: "Integridad de datos verificada",
  backupRestoreVerificado: "Backup / restore verificado",
  estadoValidacion: "Estado de validación",
  releaseAutorizado: "Release autorizado",
  fechaRelease: "Fecha de release",
  decisionQA: "Decisión QA",
  desviacionAsociada: "Desviación asociada",
  capa: "CAPA",
  evidencia: "Evidencia",
  observaciones: "Observaciones",
  creadoEn: "Creado en",
  actualizadoEn: "Actualizado en",
};

const fields: FieldConfig[] = [
  { key: "codigoValidacion", label: "Código de validación *", placeholder: "VAL-2026-001" },
  { key: "fechaValidacion", label: "Fecha de validación *", type: "date" },
  { key: "horaValidacion", label: "Hora de validación *", type: "time" },
  { key: "empresa", label: "Empresa *", placeholder: "Growlifecol S.A.S." },
  { key: "sede", label: "Sede / predio *", placeholder: "Sede principal" },
  {
    key: "sistemaModulo",
    label: "Sistema / módulo *",
    kind: "select",
    options: [
      "FloraTrack completo",
      "Dashboard",
      "Documentos",
      "Firmas electrónicas",
      "Audit Trail",
      "Usuarios / accesos",
      "CSV / DataOps",
      "Reportes",
      "Calidad QA",
      "Desviaciones / CAPA",
      "Inventario",
      "Regulatorio",
      "Módulo nuevo",
      "Integración externa",
    ],
  },
  { key: "versionSistema", label: "Versión del sistema *", placeholder: "v1.0.0 / build interno" },
  {
    key: "tipoValidacion",
    label: "Tipo de validación *",
    kind: "select",
    options: [
      "Validación inicial",
      "Revalidación",
      "Validación por cambio",
      "Validación de módulo",
      "Validación de integración",
      "Validación de migración",
      "Validación de firma electrónica",
      "Validación de audit trail",
      "Validación de backup / restore",
      "Validación de release",
    ],
  },
  {
    key: "categoriaSistema",
    label: "Categoría del sistema *",
    kind: "select",
    options: [
      "GxP crítico",
      "GxP relevante",
      "Soporte GMP",
      "Soporte GACP",
      "Administrativo",
      "Experimental",
    ],
  },
  {
    key: "ambiente",
    label: "Ambiente *",
    kind: "select",
    options: ["Desarrollo", "Pruebas", "Validación", "Producción", "Sandbox controlado"],
  },
  { key: "proveedorDesarrollo", label: "Proveedor / desarrollo", placeholder: "Equipo interno / proveedor / desarrollador responsable" },
  { key: "responsableValidacion", label: "Responsable de validación *", placeholder: "Responsable CSV / validación" },
  { key: "responsableQA", label: "Responsable QA *", placeholder: "QA aprobador" },
  {
    key: "alcanceValidacion",
    label: "Alcance de validación *",
    kind: "textarea",
    placeholder: "Describe módulos, funciones, flujos críticos, registros electrónicos, reportes, roles, firmas y datos incluidos.",
  },
  {
    key: "documentoURS",
    label: "URS / requerimientos *",
    kind: "textarea",
    placeholder: "Lista de URS, requisitos funcionales, regulatorios, trazabilidad y criterios de aceptación.",
  },
  {
    key: "matrizRiesgo",
    label: "Matriz de riesgo *",
    kind: "textarea",
    placeholder: "Resumen de riesgos, criticidad, impacto GxP, controles, mitigaciones y clasificación.",
  },
  {
    key: "protocolosEjecutados",
    label: "Protocolos ejecutados *",
    kind: "textarea",
    placeholder: "IQ, OQ, PQ, UAT, pruebas de acceso, firmas, audit trail, backup, integridad de datos.",
  },
  { key: "requerimientosProbados", label: "Requerimientos probados *", type: "number", placeholder: "50" },
  { key: "casosAprobados", label: "Casos aprobados *", type: "number", placeholder: "50" },
  { key: "casosFallidos", label: "Casos fallidos *", type: "number", placeholder: "0" },
  { key: "hallazgosCriticos", label: "Hallazgos críticos *", type: "number", placeholder: "0" },
  {
    key: "auditTrailVerificado",
    label: "Audit trail verificado *",
    kind: "select",
    options: ["Sí", "No", "No aplica"],
  },
  {
    key: "firmasElectronicasVerificadas",
    label: "Firmas electrónicas verificadas *",
    kind: "select",
    options: ["Sí", "No", "No aplica"],
  },
  {
    key: "controlesAccesoVerificados",
    label: "Controles de acceso verificados *",
    kind: "select",
    options: ["Sí", "No", "No aplica"],
  },
  {
    key: "integridadDatosVerificada",
    label: "Integridad de datos verificada *",
    kind: "select",
    options: ["Sí", "No", "No aplica"],
  },
  {
    key: "backupRestoreVerificado",
    label: "Backup / restore verificado *",
    kind: "select",
    options: ["Sí", "No", "No aplica"],
  },
  {
    key: "estadoValidacion",
    label: "Estado de validación *",
    kind: "select",
    options: [
      "Pendiente",
      "En ejecución",
      "Validado",
      "Validado con restricciones",
      "No validado",
      "Requiere remediación",
      "Suspendido",
      "Cerrado",
    ],
  },
  {
    key: "releaseAutorizado",
    label: "Release autorizado *",
    kind: "select",
    options: ["Sí", "No"],
  },
  { key: "fechaRelease", label: "Fecha de release", type: "date" },
  {
    key: "decisionQA",
    label: "Decisión QA *",
    kind: "select",
    options: [
      "Pendiente QA",
      "Aprobado QA",
      "Aprobado con restricciones QA",
      "Rechazado QA",
      "Requiere CAPA",
      "Requiere revalidación",
      "Cierre aprobado QA",
    ],
  },
  { key: "desviacionAsociada", label: "Desviación asociada", placeholder: "DEV-2026-001 / CAPA-001" },
  {
    key: "capa",
    label: "CAPA",
    kind: "textarea",
    placeholder: "Obligatoria si hay fallos, hallazgos críticos, rechazo QA, remediación o controles críticos no verificados.",
  },
  { key: "evidencia", label: "Evidencia / soporte", placeholder: "URS, matriz de riesgo, protocolos, reportes IQ/OQ/PQ, capturas, logs, aprobaciones QA..." },
  {
    key: "observaciones",
    label: "Observaciones",
    kind: "textarea",
    placeholder: "Notas QA, limitaciones, restricciones de release, pendientes, justificación regulatoria o seguimiento.",
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
  return `VAL-${Date.now()}-${Math.random().toString(16).slice(2)}`;
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

function loadRecords(): ValidationRecord[] {
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

function saveRecords(records: ValidationRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export default function Part11Page() {
  const [records, setRecords] = useState<ValidationRecord[]>([]);
  const [form, setForm] = useState<ValidationRecord>(emptyForm);
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

  function updateField(field: keyof ValidationRecord, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function numericSummary() {
    return {
      total: toNumber(form.requerimientosProbados),
      passed: toNumber(form.casosAprobados),
      failed: toNumber(form.casosFallidos),
      critical: toNumber(form.hallazgosCriticos),
    };
  }

  function isCriticalSystem(): boolean {
    return ["GxP crítico", "GxP relevante"].includes(form.categoriaSistema);
  }

  function needsCapa(): boolean {
    const summary = numericSummary();

    return (
      summary.failed > 0 ||
      summary.critical > 0 ||
      ["No validado", "Requiere remediación", "Suspendido"].includes(form.estadoValidacion) ||
      ["Rechazado QA", "Requiere CAPA", "Requiere revalidación"].includes(form.decisionQA) ||
      (isCriticalSystem() &&
        [
          form.auditTrailVerificado,
          form.controlesAccesoVerificados,
          form.integridadDatosVerificada,
          form.backupRestoreVerificado,
        ].includes("No"))
    );
  }

  function validateForm(): string[] {
    const errors = requiredFields
      .filter((field) => isInvalid(form[field]))
      .map((field) => fieldLabels[field]);

    const summary = numericSummary();

    if (!Number.isFinite(summary.total) || summary.total <= 0) {
      errors.push("Los requerimientos probados deben ser mayores a cero");
    }

    if (!Number.isFinite(summary.passed) || summary.passed < 0) {
      errors.push("Los casos aprobados deben ser un número igual o mayor a cero");
    }

    if (!Number.isFinite(summary.failed) || summary.failed < 0) {
      errors.push("Los casos fallidos deben ser un número igual o mayor a cero");
    }

    if (!Number.isFinite(summary.critical) || summary.critical < 0) {
      errors.push("Los hallazgos críticos deben ser un número igual o mayor a cero");
    }

    if (
      Number.isFinite(summary.total) &&
      Number.isFinite(summary.passed) &&
      Number.isFinite(summary.failed) &&
      summary.passed + summary.failed !== summary.total
    ) {
      errors.push("La suma de casos aprobados y fallidos debe coincidir con los requerimientos probados");
    }

    if (isCriticalSystem() && form.auditTrailVerificado !== "Sí") {
      errors.push("Los sistemas GxP críticos o relevantes deben tener audit trail verificado");
    }

    if (isCriticalSystem() && form.controlesAccesoVerificados !== "Sí") {
      errors.push("Los sistemas GxP críticos o relevantes deben tener controles de acceso verificados");
    }

    if (isCriticalSystem() && form.integridadDatosVerificada !== "Sí") {
      errors.push("Los sistemas GxP críticos o relevantes deben tener integridad de datos verificada");
    }

    if (isCriticalSystem() && form.backupRestoreVerificado !== "Sí") {
      errors.push("Los sistemas GxP críticos o relevantes deben tener backup / restore verificado");
    }

    if (["Firmas electrónicas", "Validación de firma electrónica", "FloraTrack completo"].includes(form.sistemaModulo) && form.firmasElectronicasVerificadas !== "Sí") {
      errors.push("Las firmas electrónicas deben estar verificadas cuando el alcance incluye firma electrónica");
    }

    if (form.releaseAutorizado === "Sí" && isInvalid(form.fechaRelease)) {
      errors.push("La fecha de release es obligatoria cuando el release está autorizado");
    }

    if (form.releaseAutorizado === "Sí" && !["Validado", "Validado con restricciones", "Cerrado"].includes(form.estadoValidacion)) {
      errors.push("No se puede autorizar release si el sistema no está validado, validado con restricciones o cerrado");
    }

    if (form.releaseAutorizado === "Sí" && !["Aprobado QA", "Aprobado con restricciones QA", "Cierre aprobado QA"].includes(form.decisionQA)) {
      errors.push("No se puede autorizar release sin aprobación QA");
    }

    if (form.fechaRelease && form.fechaValidacion && isDateBefore(form.fechaRelease, form.fechaValidacion)) {
      errors.push("La fecha de release no puede ser anterior a la fecha de validación");
    }

    if (["Aprobado QA", "Aprobado con restricciones QA", "Rechazado QA", "Cierre aprobado QA"].includes(form.decisionQA) && isInvalid(form.evidencia)) {
      errors.push("La evidencia es obligatoria para decisiones QA formales");
    }

    if (needsCapa() && isInvalid(form.desviacionAsociada)) {
      errors.push("La desviación asociada es obligatoria cuando hay fallos, hallazgos críticos, controles no verificados o rechazo QA");
    }

    if (needsCapa() && isInvalid(form.capa)) {
      errors.push("La CAPA es obligatoria cuando hay fallos, hallazgos críticos, controles no verificados o rechazo QA");
    }

    return Array.from(new Set(errors));
  }

  function fieldHasError(field: keyof ValidationRecord): boolean {
    if (!submitAttempted) return false;

    const summary = numericSummary();

    if (requiredFields.includes(field) && isInvalid(form[field])) return true;

    if (field === "requerimientosProbados") return !Number.isFinite(summary.total) || summary.total <= 0;
    if (field === "casosAprobados") return !Number.isFinite(summary.passed) || summary.passed < 0;
    if (field === "casosFallidos") return !Number.isFinite(summary.failed) || summary.failed < 0;
    if (field === "hallazgosCriticos") return !Number.isFinite(summary.critical) || summary.critical < 0;

    if (
      ["requerimientosProbados", "casosAprobados", "casosFallidos"].includes(field) &&
      Number.isFinite(summary.total) &&
      Number.isFinite(summary.passed) &&
      Number.isFinite(summary.failed) &&
      summary.passed + summary.failed !== summary.total
    ) {
      return true;
    }

    if (field === "auditTrailVerificado" && isCriticalSystem() && form.auditTrailVerificado !== "Sí") return true;
    if (field === "controlesAccesoVerificados" && isCriticalSystem() && form.controlesAccesoVerificados !== "Sí") return true;
    if (field === "integridadDatosVerificada" && isCriticalSystem() && form.integridadDatosVerificada !== "Sí") return true;
    if (field === "backupRestoreVerificado" && isCriticalSystem() && form.backupRestoreVerificado !== "Sí") return true;
    if (field === "firmasElectronicasVerificadas" && ["Firmas electrónicas", "Validación de firma electrónica", "FloraTrack completo"].includes(form.sistemaModulo) && form.firmasElectronicasVerificadas !== "Sí") return true;
    if (field === "fechaRelease" && form.releaseAutorizado === "Sí" && isInvalid(form.fechaRelease)) return true;
    if (field === "fechaRelease" && form.fechaRelease && form.fechaValidacion && isDateBefore(form.fechaRelease, form.fechaValidacion)) return true;
    if (field === "evidencia" && ["Aprobado QA", "Aprobado con restricciones QA", "Rechazado QA", "Cierre aprobado QA"].includes(form.decisionQA) && isInvalid(form.evidencia)) return true;
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
      showCloud("No se guardó la validación. Completa la información obligatoria.", errors, "warning");
      return;
    }

    const timestamp = nowIso();

    const payload: ValidationRecord = {
      ...form,
      codigoValidacion: clean(form.codigoValidacion),
      fechaValidacion: clean(form.fechaValidacion),
      horaValidacion: clean(form.horaValidacion),
      empresa: clean(form.empresa),
      sede: clean(form.sede),
      sistemaModulo: clean(form.sistemaModulo),
      versionSistema: clean(form.versionSistema),
      tipoValidacion: clean(form.tipoValidacion),
      categoriaSistema: clean(form.categoriaSistema),
      ambiente: clean(form.ambiente),
      proveedorDesarrollo: clean(form.proveedorDesarrollo),
      responsableValidacion: clean(form.responsableValidacion),
      responsableQA: clean(form.responsableQA),
      alcanceValidacion: clean(form.alcanceValidacion),
      documentoURS: clean(form.documentoURS),
      matrizRiesgo: clean(form.matrizRiesgo),
      protocolosEjecutados: clean(form.protocolosEjecutados),
      requerimientosProbados: clean(form.requerimientosProbados),
      casosAprobados: clean(form.casosAprobados),
      casosFallidos: clean(form.casosFallidos),
      hallazgosCriticos: clean(form.hallazgosCriticos),
      auditTrailVerificado: clean(form.auditTrailVerificado),
      firmasElectronicasVerificadas: clean(form.firmasElectronicasVerificadas),
      controlesAccesoVerificados: clean(form.controlesAccesoVerificados),
      integridadDatosVerificada: clean(form.integridadDatosVerificada),
      backupRestoreVerificado: clean(form.backupRestoreVerificado),
      estadoValidacion: clean(form.estadoValidacion),
      releaseAutorizado: clean(form.releaseAutorizado),
      fechaRelease: clean(form.fechaRelease),
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
      editingId ? "Validación actualizada correctamente." : "Validación 21 CFR Part 11 registrada correctamente.",
      [],
      "success"
    );
  }

  function handleEdit(record: ValidationRecord) {
    setForm(record);
    setEditingId(record.id);
    setSubmitAttempted(false);
    showCloud("Validación cargada para edición. Verifica antes de actualizar.", [], "success");
  }

  function handleDelete(id: string) {
    const confirmed = window.confirm("¿Confirmas eliminar esta validación? En ambiente GMP real debería manejarse como anulación auditada.");
    if (!confirmed) return;

    const nextRecords = records.filter((record) => record.id !== id);
    setRecords(nextRecords);
    saveRecords(nextRecords);
    showCloud("Validación eliminada del almacenamiento local.", [], "success");
  }

  function exportJson() {
    if (records.length === 0) {
      showCloud("No hay validaciones para exportar.", [], "warning");
      return;
    }

    const blob = new Blob([JSON.stringify(records, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `floratrack-part11-validacion-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);

    showCloud("Archivo JSON de validación exportado correctamente.", [], "success");
  }

  const filteredRecords = useMemo(() => {
    const term = clean(search).toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        !term ||
        [
          record.codigoValidacion,
          record.sistemaModulo,
          record.versionSistema,
          record.tipoValidacion,
          record.categoriaSistema,
          record.estadoValidacion,
          record.decisionQA,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

      const matchesEstado = filterEstado === "Todos" || record.estadoValidacion === filterEstado;

      return matchesSearch && matchesEstado;
    });
  }, [records, search, filterEstado]);

  const dashboard = useMemo(() => {
    return {
      total: records.length,
      validadas: records.filter((record) => ["Validado", "Validado con restricciones", "Cerrado"].includes(record.estadoValidacion)).length,
      releases: records.filter((record) => record.releaseAutorizado === "Sí").length,
      fallidas: records.filter((record) => Number(record.casosFallidos) > 0 || ["No validado", "Requiere remediación"].includes(record.estadoValidacion)).length,
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
        <header className="rounded-3xl border border-violet-400/20 bg-slate-900/80 p-6 shadow-2xl shadow-violet-950/30">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-violet-300">
                FloraTrack Enterprise Compliance Platform
              </p>

              <h1 className="mt-3 text-3xl font-black text-white md:text-5xl">
                Validación 21 CFR Part 11
              </h1>

              <p className="mt-3 max-w-5xl text-sm leading-6 text-slate-300 md:text-base">
                Control de URS, matriz de riesgo, protocolos IQ/OQ/PQ, pruebas,
                audit trail, firmas electrónicas, integridad de datos, backup / restore,
                release, evidencia, desviaciones, CAPA y aprobación QA.
              </p>
            </div>

            <div className="rounded-2xl border border-violet-400/20 bg-violet-500/10 px-5 py-4 text-sm text-violet-100">
              <p className="font-bold">CSV / Part 11 activo</p>
              <p className="mt-1 text-violet-200">URS · IQ/OQ/PQ · Audit Trail · eSign · QA</p>
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
          <Metric title="Validaciones" value={dashboard.total} />
          <Metric title="Validadas" value={dashboard.validadas} tone="emerald" />
          <Metric title="Releases" value={dashboard.releases} tone="sky" />
          <Metric title="Fallidas" value={dashboard.fallidas} tone="red" />
          <Metric title="Pendiente QA" value={dashboard.pendienteQA} tone="amber" />
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
                <h2 className="text-2xl font-black text-white">{editingId ? "Editar validación" : "Nueva validación"}</h2>
                <p className="mt-1 text-sm text-slate-400">Ninguna validación puede guardarse vacía o incompleta.</p>
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
                  : "border-slate-700 bg-slate-950 focus:border-violet-400 focus:ring-4 focus:ring-violet-400/40";

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

                      {hasError && <p className="mt-1 text-xs font-bold text-red-300">Campo obligatorio o condición de validación requerida.</p>}
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
              <button type="button" onClick={handleSave} className="rounded-2xl bg-violet-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-violet-950/50 transition hover:bg-violet-400">
                {editingId ? "Actualizar validación" : "Guardar validación"}
              </button>

              <button type="button" onClick={resetForm} className="rounded-2xl border border-slate-600 px-6 py-3 text-sm font-bold text-slate-200 transition hover:bg-slate-800">
                Limpiar formulario
              </button>
            </div>
          </form>

          <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">Registro maestro de validación</h2>
                <p className="mt-1 text-sm text-slate-400">Consulta, filtra, edita y exporta validaciones del sistema.</p>
              </div>

              <button type="button" onClick={exportJson} className="rounded-2xl border border-violet-400/50 px-5 py-3 text-sm font-bold text-violet-200 transition hover:bg-violet-500/10">
                Exportar JSON
              </button>
            </div>

            <div className="mb-5 grid gap-3 md:grid-cols-[1fr_250px]">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-violet-400/40 transition placeholder:text-slate-600 focus:border-violet-400 focus:ring-4"
                placeholder="Buscar por validación, sistema, versión, estado, QA..."
              />

              <select
                value={filterEstado}
                onChange={(event) => setFilterEstado(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-violet-400/40 transition focus:border-violet-400 focus:ring-4"
              >
                <option>Todos</option>
                <option>Pendiente</option>
                <option>En ejecución</option>
                <option>Validado</option>
                <option>Validado con restricciones</option>
                <option>No validado</option>
                <option>Requiere remediación</option>
                <option>Suspendido</option>
                <option>Cerrado</option>
              </select>
            </div>

            <div className="max-h-[780px] space-y-4 overflow-auto pr-2">
              {filteredRecords.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center text-sm text-slate-400">
                  No hay validaciones registradas. Crea la primera validación con datos completos.
                </div>
              ) : (
                filteredRecords.map((record) => (
                  <article key={record.id} className="rounded-2xl border border-slate-700 bg-slate-950 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-white">{record.codigoValidacion} · {record.sistemaModulo}</h3>
                          <StatusPill value={record.estadoValidacion} />
                          <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-xs font-bold text-violet-200">
                            {record.categoriaSistema}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-400">
                          Versión {record.versionSistema} · {record.tipoValidacion} · Release {record.releaseAutorizado}
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
                      <Data label="Ambiente" value={record.ambiente} />
                      <Data label="Proveedor" value={record.proveedorDesarrollo || "Sin registro"} />
                      <Data label="Responsable validación" value={record.responsableValidacion} />
                      <Data label="Responsable QA" value={record.responsableQA} />
                      <Data label="Requerimientos" value={record.requerimientosProbados} />
                      <Data label="Aprobados / fallidos" value={`${record.casosAprobados} / ${record.casosFallidos}`} />
                      <Data label="Hallazgos críticos" value={record.hallazgosCriticos} />
                      <Data label="Audit trail" value={record.auditTrailVerificado} />
                      <Data label="Firmas electrónicas" value={record.firmasElectronicasVerificadas} />
                      <Data label="Accesos" value={record.controlesAccesoVerificados} />
                      <Data label="Integridad datos" value={record.integridadDatosVerificada} />
                      <Data label="Backup / restore" value={record.backupRestoreVerificado} />
                      <Data label="Fecha release" value={record.fechaRelease || "Sin registro"} />
                      <Data label="Decisión QA" value={record.decisionQA} />
                      <Data label="Evidencia" value={record.evidencia || "Sin registro"} />
                    </div>

                    <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300">
                      <p><span className="font-bold text-slate-100">Alcance: </span>{record.alcanceValidacion}</p>
                      <p className="mt-2"><span className="font-bold text-slate-100">URS: </span>{record.documentoURS}</p>
                      <p className="mt-2"><span className="font-bold text-slate-100">Matriz de riesgo: </span>{record.matrizRiesgo}</p>
                      <p className="mt-2"><span className="font-bold text-slate-100">Protocolos: </span>{record.protocolosEjecutados}</p>

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
    value === "Validado" || value === "Cerrado"
      ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
      : value === "Pendiente" || value === "En ejecución" || value === "Validado con restricciones"
      ? "border-amber-400/40 bg-amber-500/10 text-amber-200"
      : "border-red-400/40 bg-red-500/10 text-red-200";

  return <span className={`rounded-full border px-3 py-1 text-xs font-bold ${className}`}>{value || "Sin estado"}</span>;
}
