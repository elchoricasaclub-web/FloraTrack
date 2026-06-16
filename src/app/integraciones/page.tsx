"use client";

import { useEffect, useMemo, useState } from "react";

type IntegrationRecord = {
  id: string;
  codigoIntegracion: string;
  fechaRegistro: string;
  horaRegistro: string;
  empresa: string;
  sede: string;
  nombreSistema: string;
  tipoIntegracion: string;
  proveedorSistema: string;
  ambiente: string;
  direccionFlujo: string;
  frecuenciaSincronizacion: string;
  tipoDatos: string;
  clasificacionDatos: string;
  metodoAutenticacion: string;
  referenciaCredencial: string;
  endpointReferencia: string;
  mapeoDatos: string;
  validacionesAplicadas: string;
  auditTrailDisponible: string;
  integridadDatos: string;
  cifradoTransito: string;
  responsableTecnico: string;
  responsableQA: string;
  estadoIntegracion: string;
  nivelRiesgo: string;
  fechaUltimaPrueba: string;
  resultadoUltimaPrueba: string;
  fechaProximaRevision: string;
  decisionQA: string;
  desviacionAsociada: string;
  capa: string;
  evidencia: string;
  observaciones: string;
  creadoEn: string;
  actualizadoEn: string;
};

type FieldConfig = {
  key: keyof IntegrationRecord;
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

const STORAGE_KEY = "floratrack_integraciones_api_v1";

const emptyForm: IntegrationRecord = {
  id: "",
  codigoIntegracion: "",
  fechaRegistro: "",
  horaRegistro: "",
  empresa: "",
  sede: "",
  nombreSistema: "",
  tipoIntegracion: "",
  proveedorSistema: "",
  ambiente: "",
  direccionFlujo: "",
  frecuenciaSincronizacion: "",
  tipoDatos: "",
  clasificacionDatos: "",
  metodoAutenticacion: "",
  referenciaCredencial: "",
  endpointReferencia: "",
  mapeoDatos: "",
  validacionesAplicadas: "",
  auditTrailDisponible: "",
  integridadDatos: "",
  cifradoTransito: "",
  responsableTecnico: "",
  responsableQA: "",
  estadoIntegracion: "",
  nivelRiesgo: "",
  fechaUltimaPrueba: "",
  resultadoUltimaPrueba: "",
  fechaProximaRevision: "",
  decisionQA: "",
  desviacionAsociada: "",
  capa: "",
  evidencia: "",
  observaciones: "",
  creadoEn: "",
  actualizadoEn: "",
};

const requiredFields: Array<keyof IntegrationRecord> = [
  "codigoIntegracion",
  "fechaRegistro",
  "horaRegistro",
  "empresa",
  "sede",
  "nombreSistema",
  "tipoIntegracion",
  "ambiente",
  "direccionFlujo",
  "frecuenciaSincronizacion",
  "tipoDatos",
  "clasificacionDatos",
  "metodoAutenticacion",
  "mapeoDatos",
  "validacionesAplicadas",
  "auditTrailDisponible",
  "integridadDatos",
  "cifradoTransito",
  "responsableTecnico",
  "responsableQA",
  "estadoIntegracion",
  "nivelRiesgo",
  "fechaUltimaPrueba",
  "resultadoUltimaPrueba",
  "fechaProximaRevision",
  "decisionQA",
];

const fieldLabels: Record<keyof IntegrationRecord, string> = {
  id: "ID",
  codigoIntegracion: "Código de integración",
  fechaRegistro: "Fecha de registro",
  horaRegistro: "Hora de registro",
  empresa: "Empresa",
  sede: "Sede / predio",
  nombreSistema: "Nombre del sistema externo",
  tipoIntegracion: "Tipo de integración",
  proveedorSistema: "Proveedor / sistema",
  ambiente: "Ambiente",
  direccionFlujo: "Dirección del flujo",
  frecuenciaSincronizacion: "Frecuencia de sincronización",
  tipoDatos: "Tipo de datos",
  clasificacionDatos: "Clasificación de datos",
  metodoAutenticacion: "Método de autenticación",
  referenciaCredencial: "Referencia de credencial",
  endpointReferencia: "Endpoint / referencia técnica",
  mapeoDatos: "Mapeo de datos",
  validacionesAplicadas: "Validaciones aplicadas",
  auditTrailDisponible: "Audit trail disponible",
  integridadDatos: "Integridad de datos",
  cifradoTransito: "Cifrado en tránsito",
  responsableTecnico: "Responsable técnico",
  responsableQA: "Responsable QA",
  estadoIntegracion: "Estado de integración",
  nivelRiesgo: "Nivel de riesgo",
  fechaUltimaPrueba: "Fecha última prueba",
  resultadoUltimaPrueba: "Resultado última prueba",
  fechaProximaRevision: "Próxima revisión",
  decisionQA: "Decisión QA",
  desviacionAsociada: "Desviación asociada",
  capa: "CAPA",
  evidencia: "Evidencia",
  observaciones: "Observaciones",
  creadoEn: "Creado en",
  actualizadoEn: "Actualizado en",
};

const fields: FieldConfig[] = [
  { key: "codigoIntegracion", label: "Código de integración *", placeholder: "INT-2026-001" },
  { key: "fechaRegistro", label: "Fecha de registro *", type: "date" },
  { key: "horaRegistro", label: "Hora de registro *", type: "time" },
  { key: "empresa", label: "Empresa *", placeholder: "Growlifecol S.A.S." },
  { key: "sede", label: "Sede / predio *", placeholder: "Sede principal" },
  { key: "nombreSistema", label: "Nombre del sistema externo *", placeholder: "LIMS externo / ERP / API laboratorio / autoridad" },
  {
    key: "tipoIntegracion",
    label: "Tipo de integración *",
    kind: "select",
    options: [
      "REST API",
      "GraphQL",
      "Webhook",
      "SFTP",
      "Carga CSV",
      "Exportación JSON",
      "ERP",
      "LIMS",
      "Laboratorio externo",
      "IoT / sensores",
      "Correo automatizado",
      "Conector manual controlado",
      "Otro",
    ],
  },
  { key: "proveedorSistema", label: "Proveedor / sistema", placeholder: "Nombre del proveedor, laboratorio, autoridad, sistema o servicio" },
  {
    key: "ambiente",
    label: "Ambiente *",
    kind: "select",
    options: ["Desarrollo", "Pruebas", "Validación", "Producción", "Sandbox externo"],
  },
  {
    key: "direccionFlujo",
    label: "Dirección del flujo *",
    kind: "select",
    options: ["Entrada a FloraTrack", "Salida desde FloraTrack", "Bidireccional", "Consulta solamente", "Sincronización programada"],
  },
  {
    key: "frecuenciaSincronizacion",
    label: "Frecuencia de sincronización *",
    kind: "select",
    options: ["Tiempo real", "Cada hora", "Diaria", "Semanal", "Mensual", "Bajo demanda", "Manual controlada"],
  },
  {
    key: "tipoDatos",
    label: "Tipo de datos *",
    kind: "select",
    options: [
      "Datos de lote",
      "Resultados QC",
      "Inventario",
      "Documentos",
      "Firmas electrónicas",
      "Audit trail",
      "Usuarios / accesos",
      "Reportes",
      "Radicaciones regulatorias",
      "Datos ambientales",
      "Datos de sensores",
      "Datos maestros",
      "Múltiples tipos",
    ],
  },
  {
    key: "clasificacionDatos",
    label: "Clasificación de datos *",
    kind: "select",
    options: [
      "Datos GxP críticos",
      "Datos QA/QC",
      "Datos regulatorios",
      "Datos personales",
      "Datos de firma electrónica",
      "Datos maestros",
      "Datos operativos",
      "Datos no críticos",
    ],
  },
  {
    key: "metodoAutenticacion",
    label: "Método de autenticación *",
    kind: "select",
    options: [
      "API Key",
      "OAuth 2.0",
      "Bearer token",
      "Basic Auth",
      "Certificado / mTLS",
      "SFTP key",
      "Usuario y contraseña",
      "Sin autenticación documentada",
      "No aplica",
    ],
  },
  { key: "referenciaCredencial", label: "Referencia de credencial", placeholder: "Vault / secreto / ticket / referencia controlada, nunca pegar claves reales" },
  { key: "endpointReferencia", label: "Endpoint / referencia técnica", placeholder: "URL, ruta SFTP, webhook, recurso API, identificador de conector" },
  {
    key: "mapeoDatos",
    label: "Mapeo de datos *",
    kind: "textarea",
    placeholder: "Describe campos, equivalencias, transformaciones, reglas, unidades, estados QA y trazabilidad entre sistemas.",
  },
  {
    key: "validacionesAplicadas",
    label: "Validaciones aplicadas *",
    kind: "textarea",
    placeholder: "Describe validaciones: campos obligatorios, hash, duplicados, fechas, cantidades, estado QA, lote único, integridad.",
  },
  {
    key: "auditTrailDisponible",
    label: "Audit trail disponible *",
    kind: "select",
    options: ["Sí", "No", "No aplica"],
  },
  {
    key: "integridadDatos",
    label: "Integridad de datos *",
    kind: "select",
    options: ["Verificada", "Pendiente verificación", "No verificada"],
  },
  {
    key: "cifradoTransito",
    label: "Cifrado en tránsito *",
    kind: "select",
    options: ["Sí", "No", "No aplica"],
  },
  { key: "responsableTecnico", label: "Responsable técnico *", placeholder: "TI / desarrollador / proveedor / responsable de integración" },
  { key: "responsableQA", label: "Responsable QA *", placeholder: "QA que aprueba o valida la integración" },
  {
    key: "estadoIntegracion",
    label: "Estado de integración *",
    kind: "select",
    options: ["Diseño", "En desarrollo", "En pruebas", "Validada", "Activa", "Activa con observaciones", "Suspendida", "Fallida", "Retirada"],
  },
  {
    key: "nivelRiesgo",
    label: "Nivel de riesgo *",
    kind: "select",
    options: ["Bajo", "Medio", "Alto", "Crítico"],
  },
  { key: "fechaUltimaPrueba", label: "Fecha última prueba *", type: "date" },
  {
    key: "resultadoUltimaPrueba",
    label: "Resultado última prueba *",
    kind: "select",
    options: ["Conforme", "Con observaciones", "No conforme", "Fallida", "Pendiente prueba"],
  },
  { key: "fechaProximaRevision", label: "Próxima revisión *", type: "date" },
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
      "Requiere remediación",
      "Cierre aprobado QA",
    ],
  },
  { key: "desviacionAsociada", label: "Desviación asociada", placeholder: "DEV-2026-001 / CAPA-001" },
  {
    key: "capa",
    label: "CAPA",
    kind: "textarea",
    placeholder: "Obligatoria si hay integración fallida, datos no conformes, rechazo QA, suspensión o remediación.",
  },
  { key: "evidencia", label: "Evidencia / soporte", placeholder: "Prueba API, captura, log, contrato, matriz de mapeo, validación QA, protocolo..." },
  {
    key: "observaciones",
    label: "Observaciones",
    kind: "textarea",
    placeholder: "Notas QA, limitaciones, restricciones, cambios pendientes, riesgos residuales o seguimiento.",
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
  return `INT-${Date.now()}-${Math.random().toString(16).slice(2)}`;
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

function loadRecords(): IntegrationRecord[] {
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

function saveRecords(records: IntegrationRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export default function IntegracionesPage() {
  const [records, setRecords] = useState<IntegrationRecord[]>([]);
  const [form, setForm] = useState<IntegrationRecord>(emptyForm);
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

  function updateField(field: keyof IntegrationRecord, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function isApiBased(): boolean {
    return ["REST API", "GraphQL", "Webhook", "SFTP", "IoT / sensores"].includes(form.tipoIntegracion);
  }

  function needsCredentialReference(): boolean {
    return !["Sin autenticación documentada", "No aplica", ""].includes(form.metodoAutenticacion);
  }

  function hasCriticalData(): boolean {
    return ["Datos GxP críticos", "Datos QA/QC", "Datos regulatorios", "Datos personales", "Datos de firma electrónica"].includes(form.clasificacionDatos);
  }

  function needsCapa(): boolean {
    return (
      ["Fallida", "Suspendida", "Retirada"].includes(form.estadoIntegracion) ||
      ["No conforme", "Fallida"].includes(form.resultadoUltimaPrueba) ||
      ["Rechazado QA", "Requiere CAPA", "Requiere remediación"].includes(form.decisionQA)
    );
  }

  function validateForm(): string[] {
    const errors = requiredFields
      .filter((field) => isInvalid(form[field]))
      .map((field) => fieldLabels[field]);

    if (isApiBased() && isInvalid(form.endpointReferencia)) {
      errors.push("El endpoint o referencia técnica es obligatorio para APIs, webhooks, SFTP o sensores");
    }

    if (needsCredentialReference() && isInvalid(form.referenciaCredencial)) {
      errors.push("La referencia de credencial es obligatoria cuando existe autenticación");
    }

    if (form.ambiente === "Producción" && form.cifradoTransito !== "Sí") {
      errors.push("Las integraciones en producción deben tener cifrado en tránsito");
    }

    if (hasCriticalData() && form.auditTrailDisponible !== "Sí") {
      errors.push("Los datos críticos GxP, QA/QC, regulatorios, personales o de firma requieren audit trail disponible");
    }

    if (hasCriticalData() && form.integridadDatos !== "Verificada") {
      errors.push("Los datos críticos deben tener integridad de datos verificada");
    }

    if (["Activa", "Activa con observaciones", "Validada"].includes(form.estadoIntegracion) && isInvalid(form.evidencia)) {
      errors.push("La evidencia es obligatoria para integraciones activas o validadas");
    }

    if (["Activa", "Validada"].includes(form.estadoIntegracion) && form.resultadoUltimaPrueba !== "Conforme") {
      errors.push("Una integración activa o validada debe tener última prueba conforme");
    }

    if (form.fechaProximaRevision && form.fechaRegistro && isDateBefore(form.fechaProximaRevision, form.fechaRegistro)) {
      errors.push("La próxima revisión no puede ser anterior a la fecha de registro");
    }

    if (form.fechaUltimaPrueba && form.fechaRegistro && isDateBefore(form.fechaUltimaPrueba, form.fechaRegistro)) {
      errors.push("La fecha de última prueba no puede ser anterior a la fecha de registro");
    }

    if (["Aprobado QA", "Aprobado con observación QA", "Rechazado QA", "Cierre aprobado QA"].includes(form.decisionQA) && isInvalid(form.evidencia)) {
      errors.push("La evidencia es obligatoria para decisiones QA formales");
    }

    if (needsCapa() && isInvalid(form.desviacionAsociada)) {
      errors.push("La desviación asociada es obligatoria cuando hay fallo, suspensión, rechazo QA o remediación");
    }

    if (needsCapa() && isInvalid(form.capa)) {
      errors.push("La CAPA es obligatoria cuando hay fallo, suspensión, rechazo QA o remediación");
    }

    return Array.from(new Set(errors));
  }

  function fieldHasError(field: keyof IntegrationRecord): boolean {
    if (!submitAttempted) return false;

    if (requiredFields.includes(field) && isInvalid(form[field])) return true;
    if (field === "endpointReferencia" && isApiBased() && isInvalid(form.endpointReferencia)) return true;
    if (field === "referenciaCredencial" && needsCredentialReference() && isInvalid(form.referenciaCredencial)) return true;
    if (field === "cifradoTransito" && form.ambiente === "Producción" && form.cifradoTransito !== "Sí") return true;
    if (field === "auditTrailDisponible" && hasCriticalData() && form.auditTrailDisponible !== "Sí") return true;
    if (field === "integridadDatos" && hasCriticalData() && form.integridadDatos !== "Verificada") return true;
    if (field === "evidencia" && ["Activa", "Activa con observaciones", "Validada"].includes(form.estadoIntegracion) && isInvalid(form.evidencia)) return true;
    if (field === "resultadoUltimaPrueba" && ["Activa", "Validada"].includes(form.estadoIntegracion) && form.resultadoUltimaPrueba !== "Conforme") return true;
    if (field === "fechaProximaRevision" && form.fechaProximaRevision && form.fechaRegistro && isDateBefore(form.fechaProximaRevision, form.fechaRegistro)) return true;
    if (field === "fechaUltimaPrueba" && form.fechaUltimaPrueba && form.fechaRegistro && isDateBefore(form.fechaUltimaPrueba, form.fechaRegistro)) return true;
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
      showCloud("No se guardó la integración. Completa la información obligatoria.", errors, "warning");
      return;
    }

    const timestamp = nowIso();

    const payload: IntegrationRecord = {
      ...form,
      codigoIntegracion: clean(form.codigoIntegracion),
      fechaRegistro: clean(form.fechaRegistro),
      horaRegistro: clean(form.horaRegistro),
      empresa: clean(form.empresa),
      sede: clean(form.sede),
      nombreSistema: clean(form.nombreSistema),
      tipoIntegracion: clean(form.tipoIntegracion),
      proveedorSistema: clean(form.proveedorSistema),
      ambiente: clean(form.ambiente),
      direccionFlujo: clean(form.direccionFlujo),
      frecuenciaSincronizacion: clean(form.frecuenciaSincronizacion),
      tipoDatos: clean(form.tipoDatos),
      clasificacionDatos: clean(form.clasificacionDatos),
      metodoAutenticacion: clean(form.metodoAutenticacion),
      referenciaCredencial: clean(form.referenciaCredencial),
      endpointReferencia: clean(form.endpointReferencia),
      mapeoDatos: clean(form.mapeoDatos),
      validacionesAplicadas: clean(form.validacionesAplicadas),
      auditTrailDisponible: clean(form.auditTrailDisponible),
      integridadDatos: clean(form.integridadDatos),
      cifradoTransito: clean(form.cifradoTransito),
      responsableTecnico: clean(form.responsableTecnico),
      responsableQA: clean(form.responsableQA),
      estadoIntegracion: clean(form.estadoIntegracion),
      nivelRiesgo: clean(form.nivelRiesgo),
      fechaUltimaPrueba: clean(form.fechaUltimaPrueba),
      resultadoUltimaPrueba: clean(form.resultadoUltimaPrueba),
      fechaProximaRevision: clean(form.fechaProximaRevision),
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
      editingId ? "Integración actualizada correctamente." : "Integración registrada correctamente con control GACP/GMP.",
      [],
      "success"
    );
  }

  function handleEdit(record: IntegrationRecord) {
    setForm(record);
    setEditingId(record.id);
    setSubmitAttempted(false);
    showCloud("Integración cargada para edición. Verifica antes de actualizar.", [], "success");
  }

  function handleDelete(id: string) {
    const confirmed = window.confirm("¿Confirmas eliminar esta integración? En ambiente GMP real debería manejarse como inactivación o anulación auditada.");
    if (!confirmed) return;

    const nextRecords = records.filter((record) => record.id !== id);
    setRecords(nextRecords);
    saveRecords(nextRecords);
    showCloud("Integración eliminada del almacenamiento local.", [], "success");
  }

  function exportJson() {
    if (records.length === 0) {
      showCloud("No hay integraciones para exportar.", [], "warning");
      return;
    }

    const blob = new Blob([JSON.stringify(records, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `floratrack-integraciones-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);

    showCloud("Archivo JSON de integraciones exportado correctamente.", [], "success");
  }

  const filteredRecords = useMemo(() => {
    const term = clean(search).toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        !term ||
        [
          record.codigoIntegracion,
          record.nombreSistema,
          record.tipoIntegracion,
          record.proveedorSistema,
          record.ambiente,
          record.tipoDatos,
          record.clasificacionDatos,
          record.estadoIntegracion,
          record.decisionQA,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

      const matchesEstado = filterEstado === "Todos" || record.estadoIntegracion === filterEstado;

      return matchesSearch && matchesEstado;
    });
  }, [records, search, filterEstado]);

  const dashboard = useMemo(() => {
    return {
      total: records.length,
      activas: records.filter((record) => ["Activa", "Activa con observaciones", "Validada"].includes(record.estadoIntegracion)).length,
      criticas: records.filter((record) => ["Alto", "Crítico"].includes(record.nivelRiesgo)).length,
      fallidas: records.filter((record) => ["Fallida", "Suspendida"].includes(record.estadoIntegracion)).length,
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
        <header className="rounded-3xl border border-orange-400/20 bg-slate-900/80 p-6 shadow-2xl shadow-orange-950/30">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-300">
                FloraTrack Enterprise Compliance Platform
              </p>

              <h1 className="mt-3 text-3xl font-black text-white md:text-5xl">
                Conectores, integraciones y API
              </h1>

              <p className="mt-3 max-w-5xl text-sm leading-6 text-slate-300 md:text-base">
                Control de APIs, webhooks, LIMS, ERP, laboratorio externo, autenticación,
                credenciales referenciadas, cifrado, audit trail, integridad de datos,
                validación, evidencia, desviaciones, CAPA y decisión QA.
              </p>
            </div>

            <div className="rounded-2xl border border-orange-400/20 bg-orange-500/10 px-5 py-4 text-sm text-orange-100">
              <p className="font-bold">Integraciones activas</p>
              <p className="mt-1 text-orange-200">API · Webhooks · LIMS · ERP · QA</p>
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
          <Metric title="Integraciones" value={dashboard.total} />
          <Metric title="Activas" value={dashboard.activas} tone="emerald" />
          <Metric title="Alto riesgo" value={dashboard.criticas} tone="red" />
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
                <h2 className="text-2xl font-black text-white">{editingId ? "Editar integración" : "Nueva integración"}</h2>
                <p className="mt-1 text-sm text-slate-400">Ninguna integración puede guardarse vacía o incompleta.</p>
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
                  : "border-slate-700 bg-slate-950 focus:border-orange-400 focus:ring-4 focus:ring-orange-400/40";

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

                      {hasError && <p className="mt-1 text-xs font-bold text-red-300">Campo obligatorio o condición de integración requerida.</p>}
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
              <button type="button" onClick={handleSave} className="rounded-2xl bg-orange-500 px-6 py-3 text-sm font-black text-slate-950 shadow-lg shadow-orange-950/50 transition hover:bg-orange-400">
                {editingId ? "Actualizar integración" : "Guardar integración"}
              </button>

              <button type="button" onClick={resetForm} className="rounded-2xl border border-slate-600 px-6 py-3 text-sm font-bold text-slate-200 transition hover:bg-slate-800">
                Limpiar formulario
              </button>
            </div>
          </form>

          <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">Registro maestro de integraciones</h2>
                <p className="mt-1 text-sm text-slate-400">Consulta, filtra, edita y exporta integraciones externas.</p>
              </div>

              <button type="button" onClick={exportJson} className="rounded-2xl border border-orange-400/50 px-5 py-3 text-sm font-bold text-orange-200 transition hover:bg-orange-500/10">
                Exportar JSON
              </button>
            </div>

            <div className="mb-5 grid gap-3 md:grid-cols-[1fr_250px]">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-orange-400/40 transition placeholder:text-slate-600 focus:border-orange-400 focus:ring-4"
                placeholder="Buscar por sistema, API, tipo, datos, estado..."
              />

              <select
                value={filterEstado}
                onChange={(event) => setFilterEstado(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-orange-400/40 transition focus:border-orange-400 focus:ring-4"
              >
                <option>Todos</option>
                <option>Diseño</option>
                <option>En desarrollo</option>
                <option>En pruebas</option>
                <option>Validada</option>
                <option>Activa</option>
                <option>Activa con observaciones</option>
                <option>Suspendida</option>
                <option>Fallida</option>
                <option>Retirada</option>
              </select>
            </div>

            <div className="max-h-[780px] space-y-4 overflow-auto pr-2">
              {filteredRecords.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center text-sm text-slate-400">
                  No hay integraciones registradas. Crea la primera integración con datos completos.
                </div>
              ) : (
                filteredRecords.map((record) => (
                  <article key={record.id} className="rounded-2xl border border-slate-700 bg-slate-950 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-white">{record.codigoIntegracion} · {record.nombreSistema}</h3>
                          <StatusPill value={record.estadoIntegracion} />
                          <span className="rounded-full border border-orange-400/30 bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-200">
                            {record.tipoIntegracion}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-400">
                          {record.ambiente} · {record.direccionFlujo} · Riesgo {record.nivelRiesgo}
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
                      <Data label="Proveedor" value={record.proveedorSistema || "Sin registro"} />
                      <Data label="Frecuencia" value={record.frecuenciaSincronizacion} />
                      <Data label="Tipo datos" value={record.tipoDatos} />
                      <Data label="Clasificación" value={record.clasificacionDatos} />
                      <Data label="Autenticación" value={record.metodoAutenticacion} />
                      <Data label="Credencial" value={record.referenciaCredencial || "Sin registro"} />
                      <Data label="Endpoint" value={record.endpointReferencia || "Sin registro"} />
                      <Data label="Audit trail" value={record.auditTrailDisponible} />
                      <Data label="Integridad" value={record.integridadDatos} />
                      <Data label="Cifrado" value={record.cifradoTransito} />
                      <Data label="Técnico" value={record.responsableTecnico} />
                      <Data label="QA" value={record.responsableQA} />
                      <Data label="Última prueba" value={record.fechaUltimaPrueba} />
                      <Data label="Resultado" value={record.resultadoUltimaPrueba} />
                      <Data label="Próxima revisión" value={record.fechaProximaRevision} />
                      <Data label="Decisión QA" value={record.decisionQA} />
                    </div>

                    <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300">
                      <p><span className="font-bold text-slate-100">Mapeo de datos: </span>{record.mapeoDatos}</p>
                      <p className="mt-2"><span className="font-bold text-slate-100">Validaciones: </span>{record.validacionesAplicadas}</p>

                      {record.desviacionAsociada && (
                        <p className="mt-2"><span className="font-bold text-slate-100">Desviación: </span>{record.desviacionAsociada}</p>
                      )}

                      {record.capa && (
                        <p className="mt-2"><span className="font-bold text-slate-100">CAPA: </span>{record.capa}</p>
                      )}

                      {record.evidencia && (
                        <p className="mt-2"><span className="font-bold text-slate-100">Evidencia: </span>{record.evidencia}</p>
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
    value === "Activa" || value === "Validada"
      ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
      : value === "Diseño" || value === "En desarrollo" || value === "En pruebas" || value === "Activa con observaciones"
      ? "border-amber-400/40 bg-amber-500/10 text-amber-200"
      : "border-red-400/40 bg-red-500/10 text-red-200";

  return <span className={`rounded-full border px-3 py-1 text-xs font-bold ${className}`}>{value || "Sin estado"}</span>;
}
