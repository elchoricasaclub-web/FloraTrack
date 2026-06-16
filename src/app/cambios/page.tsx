"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

type ChangeRecord = {
  id: string;
  codigoCambio: string;
  fechaSolicitud: string;
  horaSolicitud: string;
  empresa: string;
  sede: string;
  areaSolicitante: string;
  solicitante: string;
  moduloAfectado: string;
  tipoCambio: string;
  criticidadGxP: string;
  estadoCambio: string;
  descripcionCambio: string;
  justificacion: string;
  impactoGacpGmp: string;
  impactoRegulatorio: string;
  impactoValidacion: string;
  impactoDocumental: string;
  impactoEntrenamiento: string;
  impactoProveedores: string;
  impactoDatos: string;
  riesgoAsociado: string;
  requiereCAPA: string;
  desviacionAsociada: string;
  capa: string;
  planImplementacion: string;
  responsableImplementacion: string;
  fechaObjetivo: string;
  fechaImplementacion: string;
  planVerificacion: string;
  verificacionEficacia: string;
  aprobadorQA: string;
  decisionQA: string;
  evidencia: string;
  auditTrailReferencia: string;
  observaciones: string;
  creadoEn: string;
  actualizadoEn: string;
};

type ChangeField = keyof ChangeRecord;

type FieldConfig = {
  key: ChangeField;
  label: string;
  kind?: "input" | "select" | "textarea";
  type?: string;
  placeholder?: string;
  options?: string[];
};

type Notice = {
  tone: "success" | "warning";
  title: string;
  items: string[];
};

const STORAGE_KEY = "floratrack_control_cambios_gxp_v1";

const emptyForm: ChangeRecord = {
  id: "",
  codigoCambio: "",
  fechaSolicitud: "",
  horaSolicitud: "",
  empresa: "",
  sede: "",
  areaSolicitante: "",
  solicitante: "",
  moduloAfectado: "",
  tipoCambio: "",
  criticidadGxP: "",
  estadoCambio: "",
  descripcionCambio: "",
  justificacion: "",
  impactoGacpGmp: "",
  impactoRegulatorio: "",
  impactoValidacion: "",
  impactoDocumental: "",
  impactoEntrenamiento: "",
  impactoProveedores: "",
  impactoDatos: "",
  riesgoAsociado: "",
  requiereCAPA: "",
  desviacionAsociada: "",
  capa: "",
  planImplementacion: "",
  responsableImplementacion: "",
  fechaObjetivo: "",
  fechaImplementacion: "",
  planVerificacion: "",
  verificacionEficacia: "",
  aprobadorQA: "",
  decisionQA: "",
  evidencia: "",
  auditTrailReferencia: "",
  observaciones: "",
  creadoEn: "",
  actualizadoEn: "",
};

const labels: Record<ChangeField, string> = {
  id: "ID",
  codigoCambio: "Codigo de cambio",
  fechaSolicitud: "Fecha de solicitud",
  horaSolicitud: "Hora de solicitud",
  empresa: "Empresa",
  sede: "Sede / predio",
  areaSolicitante: "Area solicitante",
  solicitante: "Solicitante",
  moduloAfectado: "Modulo afectado",
  tipoCambio: "Tipo de cambio",
  criticidadGxP: "Criticidad GxP",
  estadoCambio: "Estado del cambio",
  descripcionCambio: "Descripcion del cambio",
  justificacion: "Justificacion",
  impactoGacpGmp: "Impacto GACP/GMP",
  impactoRegulatorio: "Impacto regulatorio",
  impactoValidacion: "Impacto en validacion",
  impactoDocumental: "Impacto documental",
  impactoEntrenamiento: "Impacto entrenamiento",
  impactoProveedores: "Impacto proveedores",
  impactoDatos: "Impacto datos",
  riesgoAsociado: "Riesgo asociado",
  requiereCAPA: "Requiere CAPA",
  desviacionAsociada: "Desviacion asociada",
  capa: "CAPA",
  planImplementacion: "Plan de implementacion",
  responsableImplementacion: "Responsable implementacion",
  fechaObjetivo: "Fecha objetivo",
  fechaImplementacion: "Fecha implementacion",
  planVerificacion: "Plan de verificacion",
  verificacionEficacia: "Verificacion de eficacia",
  aprobadorQA: "Aprobador QA",
  decisionQA: "Decision QA",
  evidencia: "Evidencia",
  auditTrailReferencia: "Referencia audit trail",
  observaciones: "Observaciones",
  creadoEn: "Creado en",
  actualizadoEn: "Actualizado en",
};

const requiredFields: ChangeField[] = [
  "codigoCambio",
  "fechaSolicitud",
  "horaSolicitud",
  "empresa",
  "sede",
  "areaSolicitante",
  "solicitante",
  "moduloAfectado",
  "tipoCambio",
  "criticidadGxP",
  "estadoCambio",
  "descripcionCambio",
  "justificacion",
  "impactoGacpGmp",
  "impactoRegulatorio",
  "impactoValidacion",
  "impactoDocumental",
  "impactoEntrenamiento",
  "impactoDatos",
  "requiereCAPA",
  "planImplementacion",
  "responsableImplementacion",
  "fechaObjetivo",
  "planVerificacion",
  "verificacionEficacia",
  "aprobadorQA",
  "decisionQA",
  "auditTrailReferencia",
];

const moduleOptions = [
  "Command Center",
  "Dashboard clasico",
  "Cultivos",
  "Propagacion",
  "Cosecha",
  "Recepcion",
  "Inventario",
  "BHO",
  "Live Rosin",
  "Bubble Hash",
  "Post-extraccion",
  "Calidad QA",
  "Desviaciones / CAPA",
  "Riesgos GxP",
  "Workflows QA",
  "Documentos",
  "Firmas electronicas",
  "Part 11",
  "Backups",
  "Integraciones",
  "Regulatorio",
  "ICA",
  "INVIMA",
  "PEAS",
  "Minjusticia",
  "FNE",
  "DIAN",
  "Reportes programados",
  "Usuarios y accesos",
  "Proveedor / tercero",
  "Multiples modulos",
];

const fields: FieldConfig[] = [
  { key: "codigoCambio", label: "Codigo de cambio *", placeholder: "CC-2026-001" },
  { key: "fechaSolicitud", label: "Fecha de solicitud *", type: "date" },
  { key: "horaSolicitud", label: "Hora de solicitud *", type: "time" },
  { key: "empresa", label: "Empresa *", placeholder: "Growlifecol S.A.S." },
  { key: "sede", label: "Sede / predio *", placeholder: "Sede principal" },
  {
    key: "areaSolicitante",
    label: "Area solicitante *",
    kind: "select",
    options: ["Direccion tecnica", "QA", "QC", "Regulatorio", "Produccion", "Cultivo", "Extraccion", "TI / Validacion", "Mantenimiento", "Compras", "Almacen", "Comercial", "Tercero"],
  },
  { key: "solicitante", label: "Solicitante *", placeholder: "Nombre / rol" },
  { key: "moduloAfectado", label: "Modulo afectado *", kind: "select", options: moduleOptions },
  {
    key: "tipoCambio",
    label: "Tipo de cambio *",
    kind: "select",
    options: ["Proceso", "Documento", "Equipo", "Software", "Validacion", "Proveedor", "Materia prima", "Metodo analitico", "Regulatorio", "Layout / instalacion", "Entrenamiento", "Integracion API", "Reporte programado", "Emergente"],
  },
  {
    key: "criticidadGxP",
    label: "Criticidad GxP *",
    kind: "select",
    options: ["No GxP", "GxP bajo", "GxP medio", "GxP alto", "GxP critico"],
  },
  {
    key: "estadoCambio",
    label: "Estado del cambio *",
    kind: "select",
    options: ["Borrador", "Solicitado", "En evaluacion QA", "Pendiente aprobacion", "Aprobado para implementar", "En implementacion", "Implementado", "En verificacion de eficacia", "Cerrado", "Rechazado", "Cancelado"],
  },
  { key: "descripcionCambio", label: "Descripcion del cambio *", kind: "textarea", placeholder: "Describe que se cambia, donde aplica y que registros o lotes quedan impactados." },
  { key: "justificacion", label: "Justificacion *", kind: "textarea", placeholder: "Motivo tecnico, QA, regulatorio, CAPA, mejora o hallazgo que origina el cambio." },
  {
    key: "impactoGacpGmp",
    label: "Impacto GACP/GMP *",
    kind: "select",
    options: ["Sin impacto", "Impacto bajo", "Impacto medio", "Impacto alto", "Impacto critico"],
  },
  { key: "impactoRegulatorio", label: "Impacto regulatorio *", kind: "select", options: ["No", "Si - informar autoridad", "Si - actualizar expediente", "Si - nueva radicacion", "Pendiente concepto regulatorio"] },
  { key: "impactoValidacion", label: "Impacto en validacion *", kind: "select", options: ["No", "Si - evaluacion", "Si - IQ/OQ/PQ", "Si - CSV/Part 11", "Pendiente QA"] },
  { key: "impactoDocumental", label: "Impacto documental *", kind: "select", options: ["No", "SOP", "Formato", "Especificacion", "Dossier", "Registro maestro", "Multiples documentos"] },
  { key: "impactoEntrenamiento", label: "Impacto entrenamiento *", kind: "select", options: ["No", "Si - previo a implementar", "Si - posterior controlado", "Reentrenamiento critico", "Pendiente definir"] },
  { key: "impactoProveedores", label: "Impacto proveedores", kind: "select", options: ["No", "Proveedor critico", "Proveedor no critico", "Cambio de fabricante", "Pendiente evaluacion"] },
  { key: "impactoDatos", label: "Impacto datos *", kind: "select", options: ["No", "Datos GxP", "Audit trail", "Migracion", "Integracion API", "Reporte", "Backup / restore", "Pendiente CSV"] },
  { key: "riesgoAsociado", label: "Riesgo asociado", placeholder: "RISK-2026-001 / Matriz QRM" },
  { key: "requiereCAPA", label: "Requiere CAPA *", kind: "select", options: ["Si", "No"] },
  { key: "desviacionAsociada", label: "Desviacion asociada", placeholder: "DEV-2026-001 / No aplica" },
  { key: "capa", label: "CAPA", kind: "textarea", placeholder: "Accion correctiva/preventiva, responsable, fecha y evidencia esperada." },
  { key: "planImplementacion", label: "Plan de implementacion *", kind: "textarea", placeholder: "Pasos, controles previos, rollback, ventanas, responsables y evidencia requerida." },
  { key: "responsableImplementacion", label: "Responsable implementacion *", placeholder: "Responsable tecnico / area dueña" },
  { key: "fechaObjetivo", label: "Fecha objetivo *", type: "date" },
  { key: "fechaImplementacion", label: "Fecha implementacion", type: "date" },
  { key: "planVerificacion", label: "Plan de verificacion *", kind: "textarea", placeholder: "Criterios de eficacia, muestreo, revision QA, pruebas, KPI o confirmacion documental." },
  { key: "verificacionEficacia", label: "Verificacion de eficacia *", kind: "select", options: ["Pendiente", "Conforme", "Con observacion", "No conforme", "No aplica"] },
  { key: "aprobadorQA", label: "Aprobador QA *", placeholder: "QA Manager / Direccion tecnica" },
  { key: "decisionQA", label: "Decision QA *", kind: "select", options: ["Pendiente QA", "Aprobado QA", "Aprobado con condicion", "Rechazado QA", "Requiere CAPA", "Requiere validacion", "Requiere concepto regulatorio", "Cierre aprobado QA"] },
  { key: "evidencia", label: "Evidencia / soporte", placeholder: "Acta, version documental, protocolo, captura, reporte, firma, ticket..." },
  { key: "auditTrailReferencia", label: "Referencia audit trail *", placeholder: "AUD-2026-001 / evento / ticket" },
  { key: "observaciones", label: "Observaciones", kind: "textarea", placeholder: "Notas QA, restricciones, lotes afectados, condicion de aprobacion o acciones futuras." },
];

const csvFields: ChangeField[] = [
  "codigoCambio",
  "fechaSolicitud",
  "horaSolicitud",
  "empresa",
  "sede",
  "areaSolicitante",
  "solicitante",
  "moduloAfectado",
  "tipoCambio",
  "criticidadGxP",
  "estadoCambio",
  "impactoGacpGmp",
  "impactoRegulatorio",
  "impactoValidacion",
  "impactoDocumental",
  "impactoEntrenamiento",
  "impactoDatos",
  "requiereCAPA",
  "decisionQA",
  "verificacionEficacia",
  "responsableImplementacion",
  "fechaObjetivo",
  "fechaImplementacion",
  "actualizadoEn",
];

function clean(value: unknown): string {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function isBlank(value: unknown): boolean {
  const normalized = clean(value).toLowerCase();
  return ["", "seleccione", "seleccionar", "n/a", "na", "ninguno", "null", "undefined"].includes(normalized);
}

function nowIso(): string {
  return new Date().toISOString();
}

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `CC-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function isDateBefore(dateA: string, dateB: string): boolean {
  if (!dateA || !dateB) return false;
  const first = new Date(dateA).getTime();
  const second = new Date(dateB).getTime();
  return Number.isFinite(first) && Number.isFinite(second) && first < second;
}

function loadRecords(): ChangeRecord[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ChangeRecord[]).filter(Boolean) : [];
  } catch {
    return [];
  }
}

function saveRecords(records: ChangeRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function downloadText(filename: string, text: string, type: string) {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function escapeCsv(value: string): string {
  const safeValue = /^[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${safeValue.replace(/"/g, '""')}"`;
}

function recordsToCsv(records: ChangeRecord[]): string {
  const header = csvFields.map((field) => escapeCsv(labels[field])).join(",");
  const rows = records.map((record) => csvFields.map((field) => escapeCsv(clean(record[field]))).join(","));
  return [header, ...rows].join("\n");
}

function isHighImpact(record: ChangeRecord): boolean {
  const values = [record.criticidadGxP, record.impactoGacpGmp];
  return values.some((value) => {
    const normalized = clean(value).toLowerCase();
    return normalized.includes("alto") || normalized.includes("critico");
  });
}

function needsCapa(record: ChangeRecord): boolean {
  return (
    record.requiereCAPA === "Si" ||
    isHighImpact(record) ||
    record.decisionQA.includes("CAPA") ||
    record.verificacionEficacia === "No conforme" ||
    record.estadoCambio === "Rechazado"
  );
}

function statusTone(value: string): "success" | "warning" | "danger" | "neutral" {
  const normalized = value.toLowerCase();
  if (normalized.includes("cerrado") || normalized.includes("aprobado") || normalized.includes("implementado")) return "success";
  if (normalized.includes("rechazado") || normalized.includes("cancelado") || normalized.includes("critico")) return "danger";
  if (normalized.includes("pendiente") || normalized.includes("evaluacion") || normalized.includes("verificacion")) return "warning";
  return "neutral";
}

export default function CambiosPage() {
  const [records, setRecords] = useState<ChangeRecord[]>([]);
  const [form, setForm] = useState<ChangeRecord>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("Todos");

  useEffect(() => {
    const timer = window.setTimeout(() => setRecords(loadRecords()), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const estados = useMemo(() => {
    return ["Todos", ...Array.from(new Set(records.map((record) => record.estadoCambio).filter(Boolean)))];
  }, [records]);

  const filteredRecords = useMemo(() => {
    const term = clean(search).toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        !term ||
        [
          record.codigoCambio,
          record.empresa,
          record.sede,
          record.areaSolicitante,
          record.solicitante,
          record.moduloAfectado,
          record.tipoCambio,
          record.estadoCambio,
          record.decisionQA,
          record.descripcionCambio,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

      const matchesEstado = filterEstado === "Todos" || record.estadoCambio === filterEstado;

      return matchesSearch && matchesEstado;
    });
  }, [records, search, filterEstado]);

  const metrics = useMemo(() => {
    const high = records.filter(isHighImpact).length;
    const pendingQA = records.filter((record) => record.decisionQA === "Pendiente QA" || record.estadoCambio.includes("Pendiente")).length;
    const capa = records.filter(needsCapa).length;
    const closed = records.filter((record) => record.estadoCambio === "Cerrado" || record.decisionQA === "Cierre aprobado QA").length;

    return {
      total: records.length,
      high,
      pendingQA,
      capa,
      closed,
    };
  }, [records]);

  function showNotice(tone: Notice["tone"], title: string, items: string[] = []) {
    setNotice({ tone, title, items });
    window.setTimeout(() => setNotice(null), 6500);
  }

  function updateField(field: ChangeField, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function validate(): string[] {
    const errors: string[] = [];

    for (const field of requiredFields) {
      if (isBlank(form[field])) {
        errors.push(`${labels[field]} es obligatorio`);
      }
    }

    if (form.fechaObjetivo && form.fechaSolicitud && isDateBefore(form.fechaObjetivo, form.fechaSolicitud)) {
      errors.push("La fecha objetivo no puede ser anterior a la fecha de solicitud");
    }

    if (form.fechaImplementacion && form.fechaSolicitud && isDateBefore(form.fechaImplementacion, form.fechaSolicitud)) {
      errors.push("La fecha de implementacion no puede ser anterior a la fecha de solicitud");
    }

    if (isHighImpact(form) && isBlank(form.riesgoAsociado)) {
      errors.push("Los cambios de impacto alto o critico deben vincular un riesgo QRM");
    }

    if (needsCapa(form) && form.requiereCAPA !== "Si") {
      errors.push("Los cambios de alto impacto, rechazados o con eficacia no conforme deben marcar Requiere CAPA = Si");
    }

    if (needsCapa(form) && isBlank(form.capa)) {
      errors.push("La CAPA es obligatoria para cambios de alto impacto, rechazo QA o eficacia no conforme");
    }

    if (needsCapa(form) && isBlank(form.desviacionAsociada)) {
      errors.push("La desviacion asociada es obligatoria cuando el cambio requiere CAPA");
    }

    if (form.impactoValidacion !== "No" && isBlank(form.planVerificacion)) {
      errors.push("El impacto en validacion requiere plan de verificacion documentado");
    }

    if (["Implementado", "En verificacion de eficacia", "Cerrado"].includes(form.estadoCambio) && isBlank(form.fechaImplementacion)) {
      errors.push("La fecha de implementacion es obligatoria cuando el cambio ya fue implementado");
    }

    if (["Implementado", "En verificacion de eficacia", "Cerrado"].includes(form.estadoCambio) && isBlank(form.evidencia)) {
      errors.push("La evidencia es obligatoria para cambios implementados o cerrados");
    }

    if (form.estadoCambio === "Cerrado" && !["Conforme", "No aplica"].includes(form.verificacionEficacia)) {
      errors.push("Un cambio cerrado debe tener eficacia conforme o no aplica");
    }

    if (["Aprobado QA", "Aprobado con condicion", "Cierre aprobado QA"].includes(form.decisionQA) && isBlank(form.evidencia)) {
      errors.push("La evidencia es obligatoria para decisiones QA formales");
    }

    return Array.from(new Set(errors));
  }

  function fieldHasError(field: ChangeField): boolean {
    if (!submitAttempted) return false;

    if (requiredFields.includes(field) && isBlank(form[field])) return true;
    if (field === "fechaObjetivo" && form.fechaObjetivo && form.fechaSolicitud && isDateBefore(form.fechaObjetivo, form.fechaSolicitud)) return true;
    if (field === "fechaImplementacion" && form.fechaImplementacion && form.fechaSolicitud && isDateBefore(form.fechaImplementacion, form.fechaSolicitud)) return true;
    if (field === "riesgoAsociado" && isHighImpact(form) && isBlank(form.riesgoAsociado)) return true;
    if (field === "requiereCAPA" && needsCapa(form) && form.requiereCAPA !== "Si") return true;
    if (field === "capa" && needsCapa(form) && isBlank(form.capa)) return true;
    if (field === "desviacionAsociada" && needsCapa(form) && isBlank(form.desviacionAsociada)) return true;
    if (field === "fechaImplementacion" && ["Implementado", "En verificacion de eficacia", "Cerrado"].includes(form.estadoCambio) && isBlank(form.fechaImplementacion)) return true;
    if (field === "evidencia" && ["Implementado", "En verificacion de eficacia", "Cerrado"].includes(form.estadoCambio) && isBlank(form.evidencia)) return true;
    if (field === "verificacionEficacia" && form.estadoCambio === "Cerrado" && !["Conforme", "No aplica"].includes(form.verificacionEficacia)) return true;
    if (field === "evidencia" && ["Aprobado QA", "Aprobado con condicion", "Cierre aprobado QA"].includes(form.decisionQA) && isBlank(form.evidencia)) return true;

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
      showNotice("warning", "No se guardo el control de cambios. Completa la informacion obligatoria.", errors);
      return;
    }

    const timestamp = nowIso();
    const payload: ChangeRecord = {
      ...form,
      id: editingId ?? createId(),
      codigoCambio: clean(form.codigoCambio),
      fechaSolicitud: clean(form.fechaSolicitud),
      horaSolicitud: clean(form.horaSolicitud),
      empresa: clean(form.empresa),
      sede: clean(form.sede),
      areaSolicitante: clean(form.areaSolicitante),
      solicitante: clean(form.solicitante),
      moduloAfectado: clean(form.moduloAfectado),
      tipoCambio: clean(form.tipoCambio),
      criticidadGxP: clean(form.criticidadGxP),
      estadoCambio: clean(form.estadoCambio),
      descripcionCambio: clean(form.descripcionCambio),
      justificacion: clean(form.justificacion),
      impactoGacpGmp: clean(form.impactoGacpGmp),
      impactoRegulatorio: clean(form.impactoRegulatorio),
      impactoValidacion: clean(form.impactoValidacion),
      impactoDocumental: clean(form.impactoDocumental),
      impactoEntrenamiento: clean(form.impactoEntrenamiento),
      impactoProveedores: clean(form.impactoProveedores),
      impactoDatos: clean(form.impactoDatos),
      riesgoAsociado: clean(form.riesgoAsociado),
      requiereCAPA: clean(form.requiereCAPA),
      desviacionAsociada: clean(form.desviacionAsociada),
      capa: clean(form.capa),
      planImplementacion: clean(form.planImplementacion),
      responsableImplementacion: clean(form.responsableImplementacion),
      fechaObjetivo: clean(form.fechaObjetivo),
      fechaImplementacion: clean(form.fechaImplementacion),
      planVerificacion: clean(form.planVerificacion),
      verificacionEficacia: clean(form.verificacionEficacia),
      aprobadorQA: clean(form.aprobadorQA),
      decisionQA: clean(form.decisionQA),
      evidencia: clean(form.evidencia),
      auditTrailReferencia: clean(form.auditTrailReferencia),
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
    showNotice("success", editingId ? "Cambio actualizado correctamente." : "Cambio registrado correctamente con control QA.");
  }

  function handleEdit(record: ChangeRecord) {
    setForm(record);
    setEditingId(record.id);
    setSubmitAttempted(false);
    showNotice("success", "Cambio cargado para edicion. Revisa la informacion antes de actualizar.");
  }

  function handleDelete(id: string) {
    const confirmed = window.confirm("Confirma eliminar este cambio? En ambiente GMP real deberia manejarse como anulacion auditada.");
    if (!confirmed) return;

    const nextRecords = records.filter((record) => record.id !== id);
    setRecords(nextRecords);
    saveRecords(nextRecords);
    showNotice("success", "Cambio eliminado del almacenamiento local.");
  }

  function exportJson() {
    if (records.length === 0) {
      showNotice("warning", "No hay cambios para exportar.");
      return;
    }

    downloadText(
      `floratrack-control-cambios-${new Date().toISOString().slice(0, 10)}.json`,
      JSON.stringify(records, null, 2),
      "application/json;charset=utf-8"
    );
    showNotice("success", "Archivo JSON de control de cambios exportado correctamente.");
  }

  function exportCsv() {
    if (records.length === 0) {
      showNotice("warning", "No hay cambios para exportar.");
      return;
    }

    downloadText(
      `floratrack-control-cambios-${new Date().toISOString().slice(0, 10)}.csv`,
      recordsToCsv(records),
      "text/csv;charset=utf-8"
    );
    showNotice("success", "Archivo CSV de control de cambios exportado correctamente.");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-slate-100">
      {notice && <NoticePanel notice={notice} onClose={() => setNotice(null)} />}

      <section className="mx-auto max-w-7xl space-y-7">
        <header className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-950 via-cyan-950 to-emerald-950 p-7 shadow-2xl">
          <div className="absolute right-0 top-0 h-64 w-64 translate-x-20 -translate-y-20 rounded-full bg-cyan-300/20 blur-3xl" />
          <div className="absolute bottom-0 left-10 h-48 w-48 rounded-full bg-emerald-300/20 blur-3xl" />

          <div className="relative">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-cyan-200">
              FloraTrack QA / Change Control
            </p>
            <h1 className="mt-4 text-4xl font-black tracking-tight md:text-6xl">
              Control de Cambios GMP/GACP
            </h1>
            <p className="mt-4 max-w-5xl text-base font-semibold leading-8 text-slate-200">
              Gestion formal de cambios con evaluacion de impacto GxP, riesgo QRM,
              validacion, documentacion, entrenamiento, CAPA, decision QA, evidencia,
              audit trail y verificacion de eficacia.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <Badge>Impacto GxP</Badge>
              <Badge>QRM</Badge>
              <Badge>CAPA</Badge>
              <Badge>Validacion</Badge>
              <Badge>Audit trail</Badge>
              <Badge>Eficacia</Badge>
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-5">
          <Metric title="Cambios" value={metrics.total} tone="slate" />
          <Metric title="Alto impacto" value={metrics.high} tone="red" />
          <Metric title="Pendientes QA" value={metrics.pendingQA} tone="amber" />
          <Metric title="CAPA" value={metrics.capa} tone="sky" />
          <Metric title="Cerrados" value={metrics.closed} tone="emerald" />
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
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">
                  {editingId ? "Editar cambio" : "Nuevo cambio"}
                </h2>
                <p className="mt-1 text-sm font-semibold text-slate-400">
                  Ningun cambio puede cerrarse sin impacto, evidencia y decision QA trazable.
                </p>
              </div>
              <StatusPill value={editingId ? "Editando" : "Borrador"} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {fields.map((field) => (
                <FieldRenderer
                  key={field.key}
                  field={field}
                  form={form}
                  updateField={updateField}
                  error={fieldHasError(field.key)}
                />
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3 md:flex-row">
              <button type="button" onClick={handleSave} className="rounded-2xl bg-cyan-400 px-6 py-3 text-sm font-black text-slate-950 shadow-lg shadow-cyan-950/40 transition hover:-translate-y-0.5 hover:bg-cyan-300">
                {editingId ? "Actualizar cambio" : "Guardar cambio"}
              </button>
              <button type="button" onClick={resetForm} className="rounded-2xl border border-slate-600 px-6 py-3 text-sm font-bold text-slate-200 transition hover:bg-slate-800">
                Limpiar formulario
              </button>
              <button type="button" onClick={exportJson} className="rounded-2xl border border-slate-600 px-6 py-3 text-sm font-bold text-slate-200 transition hover:bg-slate-800">
                Exportar JSON
              </button>
              <button type="button" onClick={exportCsv} className="rounded-2xl border border-slate-600 px-6 py-3 text-sm font-bold text-slate-200 transition hover:bg-slate-800">
                Exportar CSV
              </button>
            </div>
          </form>

          <section className="space-y-5">
            <div className="rounded-[2rem] border border-slate-700 bg-slate-900 p-6 shadow-xl">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-2xl font-black text-white">Bandeja QA</h2>
                  <p className="mt-1 text-sm font-semibold text-slate-400">
                    Busqueda, filtro, evidencia y acciones sobre cambios guardados localmente.
                  </p>
                </div>
                <div className="flex flex-col gap-3 md:flex-row">
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Buscar codigo, modulo, QA, estado..."
                    className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-cyan-300"
                  />
                  <select
                    value={filterEstado}
                    onChange={(event) => setFilterEstado(event.target.value)}
                    className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-cyan-300"
                  >
                    {estados.map((estado) => (
                      <option key={estado}>{estado}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="max-h-[960px] space-y-4 overflow-auto pr-2">
              {filteredRecords.length === 0 ? (
                <EmptyState />
              ) : (
                filteredRecords.map((record) => (
                  <ChangeCard key={record.id} record={record} onEdit={handleEdit} onDelete={handleDelete} />
                ))
              )}
            </div>
          </section>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <ActionLink href="/riesgos">Riesgos GxP</ActionLink>
          <ActionLink href="/workflows">Workflows QA</ActionLink>
          <ActionLink href="/audit-trail">Audit trail</ActionLink>
          <ActionLink href="/reportes-programados">Reportes programados</ActionLink>
        </section>
      </section>
    </main>
  );
}

function FieldRenderer({
  field,
  form,
  updateField,
  error,
}: {
  field: FieldConfig;
  form: ChangeRecord;
  updateField: (field: ChangeField, value: string) => void;
  error: boolean;
}) {
  if (field.kind === "textarea") {
    return <TextAreaField field={field} form={form} updateField={updateField} error={error} />;
  }

  if (field.kind === "select") {
    return <SelectField field={field} form={form} updateField={updateField} error={error} />;
  }

  return <TextField field={field} form={form} updateField={updateField} error={error} />;
}

function TextField({
  field,
  form,
  updateField,
  error,
}: {
  field: FieldConfig;
  form: ChangeRecord;
  updateField: (field: ChangeField, value: string) => void;
  error: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-wide text-slate-400">{field.label}</span>
      <input
        type={field.type ?? "text"}
        value={form[field.key]}
        onChange={(event) => updateField(field.key, event.target.value)}
        placeholder={field.placeholder}
        className={`mt-2 w-full rounded-2xl border bg-slate-950 px-4 py-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300 ${error ? "border-red-400" : "border-slate-700"}`}
      />
      {error && <FieldError />}
    </label>
  );
}

function SelectField({
  field,
  form,
  updateField,
  error,
}: {
  field: FieldConfig;
  form: ChangeRecord;
  updateField: (field: ChangeField, value: string) => void;
  error: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-black uppercase tracking-wide text-slate-400">{field.label}</span>
      <select
        value={form[field.key]}
        onChange={(event) => updateField(field.key, event.target.value)}
        className={`mt-2 w-full rounded-2xl border bg-slate-950 px-4 py-3 text-sm font-semibold text-white outline-none transition focus:border-cyan-300 ${error ? "border-red-400" : "border-slate-700"}`}
      >
        <option value="">Seleccione</option>
        {(field.options ?? []).map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && <FieldError />}
    </label>
  );
}

function TextAreaField({
  field,
  form,
  updateField,
  error,
}: {
  field: FieldConfig;
  form: ChangeRecord;
  updateField: (field: ChangeField, value: string) => void;
  error: boolean;
}) {
  return (
    <label className="block md:col-span-2">
      <span className="text-xs font-black uppercase tracking-wide text-slate-400">{field.label}</span>
      <textarea
        value={form[field.key]}
        onChange={(event) => updateField(field.key, event.target.value)}
        placeholder={field.placeholder}
        rows={4}
        className={`mt-2 w-full rounded-2xl border bg-slate-950 px-4 py-3 text-sm font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300 ${error ? "border-red-400" : "border-slate-700"}`}
      />
      {error && <FieldError />}
    </label>
  );
}

function FieldError() {
  return <span className="mt-1 block text-xs font-bold text-red-300">Campo requerido o inconsistente.</span>;
}

function ChangeCard({
  record,
  onEdit,
  onDelete,
}: {
  record: ChangeRecord;
  onEdit: (record: ChangeRecord) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <article className="rounded-[2rem] border border-slate-700 bg-slate-900 p-5 shadow-xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">
            {record.codigoCambio || "Sin codigo"} / {record.moduloAfectado || "Modulo pendiente"}
          </p>
          <h3 className="mt-2 text-2xl font-black text-white">{record.tipoCambio || "Cambio sin clasificar"}</h3>
          <p className="mt-2 line-clamp-3 text-sm font-semibold leading-6 text-slate-400">
            {record.descripcionCambio || "Sin descripcion registrada."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 md:justify-end">
          <StatusPill value={record.estadoCambio || "Sin estado"} />
          <StatusPill value={record.criticidadGxP || "Sin criticidad"} />
          {needsCapa(record) && <StatusPill value="CAPA" />}
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <Data label="Solicitante" value={record.solicitante || "Pendiente"} />
        <Data label="QA" value={record.aprobadorQA || "Pendiente"} />
        <Data label="Decision" value={record.decisionQA || "Pendiente QA"} />
        <Data label="Objetivo" value={record.fechaObjetivo || "Sin fecha"} />
        <Data label="Eficacia" value={record.verificacionEficacia || "Pendiente"} />
        <Data label="Audit trail" value={record.auditTrailReferencia || "Pendiente"} />
      </div>

      <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950 p-4">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-slate-500">Flujo auditado</p>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <FlowStep index={1} title="Solicitud" value={record.fechaSolicitud || "Pendiente"} />
          <FlowStep index={2} title="Impacto" value={record.impactoGacpGmp || "Pendiente"} />
          <FlowStep index={3} title="QA" value={record.decisionQA || "Pendiente"} />
          <FlowStep index={4} title="Eficacia" value={record.verificacionEficacia || "Pendiente"} />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button type="button" onClick={() => onEdit(record)} className="rounded-2xl bg-cyan-400 px-4 py-2 text-xs font-black text-slate-950 transition hover:bg-cyan-300">
          Editar
        </button>
        <button type="button" onClick={() => onDelete(record.id)} className="rounded-2xl border border-slate-700 px-4 py-2 text-xs font-black text-slate-200 transition hover:bg-slate-800">
          Eliminar
        </button>
      </div>
    </article>
  );
}

function NoticePanel({ notice, onClose }: { notice: Notice; onClose: () => void }) {
  const toneClass = notice.tone === "success" ? "border-emerald-300 bg-emerald-950" : "border-amber-300 bg-slate-950";

  return (
    <div className={`fixed right-5 top-5 z-[9999] max-w-xl rounded-[2rem] border px-6 py-4 text-white shadow-2xl ${toneClass}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-black">{notice.title}</p>
          {notice.items.length > 0 && (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-xs font-bold text-slate-200">
              {notice.items.slice(0, 8).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </div>
        <button type="button" onClick={onClose} className="rounded-full border border-white/20 px-3 py-1 text-xs font-black">
          Cerrar
        </button>
      </div>
    </div>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-black text-white">{children}</span>;
}

function Metric({ title, value, tone }: { title: string; value: string | number; tone: "slate" | "emerald" | "amber" | "red" | "sky" }) {
  const toneClass =
    tone === "emerald"
      ? "text-emerald-300"
      : tone === "amber"
        ? "text-amber-300"
        : tone === "red"
          ? "text-red-300"
          : tone === "sky"
            ? "text-cyan-300"
            : "text-white";

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-5 shadow-xl">
      <p className="text-sm font-bold text-slate-400">{title}</p>
      <p className={`mt-2 text-3xl font-black ${toneClass}`}>{value}</p>
    </div>
  );
}

function StatusPill({ value }: { value: string }) {
  const tone = statusTone(value);
  const className =
    tone === "success"
      ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
      : tone === "danger"
        ? "border-red-400/40 bg-red-500/10 text-red-200"
        : tone === "warning"
          ? "border-amber-400/40 bg-amber-500/10 text-amber-200"
          : "border-slate-500 bg-slate-800 text-slate-200";

  return <span className={`rounded-full border px-3 py-1 text-xs font-black ${className}`}>{value}</span>;
}

function Data({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-black text-slate-200">{value}</p>
    </div>
  );
}

function FlowStep({ index, title, value }: { index: number; title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
      <p className="text-xs font-black text-cyan-300">Paso {index}</p>
      <p className="mt-1 text-sm font-black text-white">{title}</p>
      <p className="mt-1 text-xs font-semibold text-slate-400">{value}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-[2rem] border border-dashed border-slate-700 bg-slate-900 p-10 text-center">
      <h3 className="text-2xl font-black text-white">No hay cambios guardados</h3>
      <p className="mt-2 text-sm font-semibold text-slate-400">
        Registra el primer cambio para activar metricas, exportaciones y bandeja QA.
      </p>
    </div>
  );
}

function ActionLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="rounded-[2rem] border border-slate-700 bg-slate-900 p-5 text-center text-sm font-black text-white shadow-xl transition hover:-translate-y-1 hover:border-cyan-300 hover:bg-slate-800">
      {children}
    </a>
  );
}
