"use client";

import { useEffect, useMemo, useState } from "react";

type RegulatoryApiRecord = {
  id: string;
  codigoConexion: string;
  fechaRegistro: string;
  horaRegistro: string;
  empresa: string;
  sede: string;
  autoridad: string;
  paisAutoridad: string;
  tipoServicio: string;
  endpointReferencia: string;
  ambiente: string;
  metodoAutenticacion: string;
  referenciaCredencial: string;
  tipoDatos: string;
  direccionFlujo: string;
  frecuenciaIntercambio: string;
  formatoDatos: string;
  responsableTecnico: string;
  responsableRegulatorio: string;
  responsableQA: string;
  propositoConexion: string;
  mapeoDatos: string;
  reglasValidacion: string;
  auditTrailGenerado: string;
  cifradoTransito: string;
  integridadDatos: string;
  ultimaPrueba: string;
  resultadoUltimaPrueba: string;
  proximaRevision: string;
  estadoConexion: string;
  nivelRiesgo: string;
  decisionQA: string;
  requiereCAPA: string;
  desviacionAsociada: string;
  capa: string;
  evidencia: string;
  observaciones: string;
  creadoEn: string;
  actualizadoEn: string;
};

type FieldConfig = {
  key: keyof RegulatoryApiRecord;
  label: string;
  type?: string;
  placeholder?: string;
  kind?: "input" | "select" | "textarea";
  options?: string[];
};

type CloudNotice = {
  type: "success" | "warning";
  title: string;
  items: string[];
};

const STORAGE_KEY = "floratrack_api_regulatoria_avanzada_v1";

const emptyForm: RegulatoryApiRecord = {
  id: "",
  codigoConexion: "",
  fechaRegistro: "",
  horaRegistro: "",
  empresa: "",
  sede: "",
  autoridad: "",
  paisAutoridad: "",
  tipoServicio: "",
  endpointReferencia: "",
  ambiente: "",
  metodoAutenticacion: "",
  referenciaCredencial: "",
  tipoDatos: "",
  direccionFlujo: "",
  frecuenciaIntercambio: "",
  formatoDatos: "",
  responsableTecnico: "",
  responsableRegulatorio: "",
  responsableQA: "",
  propositoConexion: "",
  mapeoDatos: "",
  reglasValidacion: "",
  auditTrailGenerado: "",
  cifradoTransito: "",
  integridadDatos: "",
  ultimaPrueba: "",
  resultadoUltimaPrueba: "",
  proximaRevision: "",
  estadoConexion: "",
  nivelRiesgo: "",
  decisionQA: "",
  requiereCAPA: "",
  desviacionAsociada: "",
  capa: "",
  evidencia: "",
  observaciones: "",
  creadoEn: "",
  actualizadoEn: "",
};

const requiredFields: Array<keyof RegulatoryApiRecord> = [
  "codigoConexion",
  "fechaRegistro",
  "horaRegistro",
  "empresa",
  "sede",
  "autoridad",
  "paisAutoridad",
  "tipoServicio",
  "ambiente",
  "metodoAutenticacion",
  "tipoDatos",
  "direccionFlujo",
  "frecuenciaIntercambio",
  "formatoDatos",
  "responsableTecnico",
  "responsableRegulatorio",
  "responsableQA",
  "propositoConexion",
  "mapeoDatos",
  "reglasValidacion",
  "auditTrailGenerado",
  "cifradoTransito",
  "integridadDatos",
  "ultimaPrueba",
  "resultadoUltimaPrueba",
  "proximaRevision",
  "estadoConexion",
  "nivelRiesgo",
  "decisionQA",
  "requiereCAPA",
];

const labels: Record<keyof RegulatoryApiRecord, string> = {
  id: "ID",
  codigoConexion: "Código de conexión",
  fechaRegistro: "Fecha de registro",
  horaRegistro: "Hora de registro",
  empresa: "Empresa",
  sede: "Sede / predio",
  autoridad: "Autoridad / entidad",
  paisAutoridad: "País de autoridad",
  tipoServicio: "Tipo de servicio",
  endpointReferencia: "Endpoint / referencia técnica",
  ambiente: "Ambiente",
  metodoAutenticacion: "Método de autenticación",
  referenciaCredencial: "Referencia de credencial",
  tipoDatos: "Tipo de datos",
  direccionFlujo: "Dirección del flujo",
  frecuenciaIntercambio: "Frecuencia de intercambio",
  formatoDatos: "Formato de datos",
  responsableTecnico: "Responsable técnico",
  responsableRegulatorio: "Responsable regulatorio",
  responsableQA: "Responsable QA",
  propositoConexion: "Propósito de la conexión",
  mapeoDatos: "Mapeo de datos",
  reglasValidacion: "Reglas de validación",
  auditTrailGenerado: "Audit trail generado",
  cifradoTransito: "Cifrado en tránsito",
  integridadDatos: "Integridad de datos",
  ultimaPrueba: "Última prueba",
  resultadoUltimaPrueba: "Resultado última prueba",
  proximaRevision: "Próxima revisión",
  estadoConexion: "Estado de conexión",
  nivelRiesgo: "Nivel de riesgo",
  decisionQA: "Decisión QA",
  requiereCAPA: "Requiere CAPA",
  desviacionAsociada: "Desviación asociada",
  capa: "CAPA",
  evidencia: "Evidencia",
  observaciones: "Observaciones",
  creadoEn: "Creado en",
  actualizadoEn: "Actualizado en",
};

const fields: FieldConfig[] = [
  { key: "codigoConexion", label: "Código de conexión *", placeholder: "API-REG-2026-001" },
  { key: "fechaRegistro", label: "Fecha de registro *", type: "date" },
  { key: "horaRegistro", label: "Hora de registro *", type: "time" },
  { key: "empresa", label: "Empresa *", placeholder: "Growlifecol S.A.S." },
  { key: "sede", label: "Sede / predio *", placeholder: "Sede principal" },
  {
    key: "autoridad",
    label: "Autoridad / entidad *",
    kind: "select",
    options: [
      "INVIMA",
      "ICA",
      "Ministerio de Justicia",
      "FNE",
      "DIAN",
      "Autoridad ambiental",
      "Secretaría de Salud",
      "Organismo certificador",
      "Autoridad internacional",
      "Cliente regulado",
      "Laboratorio autorizado",
      "Otra autoridad",
    ],
  },
  { key: "paisAutoridad", label: "País de autoridad *", placeholder: "Colombia" },
  {
    key: "tipoServicio",
    label: "Tipo de servicio *",
    kind: "select",
    options: [
      "REST API",
      "SOAP",
      "Webhook",
      "SFTP",
      "Portal regulatorio",
      "Carga CSV",
      "Exportación JSON",
      "Consulta de estado",
      "Envío de reporte",
      "Radicación electrónica",
      "Descarga de certificado",
      "Otro",
    ],
  },
  { key: "endpointReferencia", label: "Endpoint / referencia técnica", placeholder: "URL, recurso, ruta SFTP, portal o código de servicio" },
  {
    key: "ambiente",
    label: "Ambiente *",
    kind: "select",
    options: ["Desarrollo", "Pruebas", "Validación", "Producción", "Sandbox autoridad"],
  },
  {
    key: "metodoAutenticacion",
    label: "Método de autenticación *",
    kind: "select",
    options: [
      "OAuth 2.0",
      "API Key",
      "Bearer token",
      "Certificado digital",
      "mTLS",
      "Usuario y contraseña",
      "SFTP key",
      "Firma electrónica",
      "No aplica",
    ],
  },
  { key: "referenciaCredencial", label: "Referencia de credencial", placeholder: "Vault / secreto / certificado / ticket. Nunca pegar claves reales." },
  {
    key: "tipoDatos",
    label: "Tipo de datos *",
    kind: "select",
    options: [
      "Radicaciones",
      "Licencias",
      "Permisos",
      "Reportes regulatorios",
      "Certificados",
      "Estados de trámite",
      "Datos de lote",
      "Resultados QC",
      "Inventario regulado",
      "Documentos soporte",
      "Firma electrónica",
      "Múltiples tipos",
    ],
  },
  {
    key: "direccionFlujo",
    label: "Dirección del flujo *",
    kind: "select",
    options: ["Salida hacia autoridad", "Entrada desde autoridad", "Bidireccional", "Consulta solamente", "Carga manual controlada"],
  },
  {
    key: "frecuenciaIntercambio",
    label: "Frecuencia de intercambio *",
    kind: "select",
    options: ["Tiempo real", "Diaria", "Semanal", "Mensual", "Trimestral", "Bajo demanda", "Por evento regulatorio", "Manual controlada"],
  },
  {
    key: "formatoDatos",
    label: "Formato de datos *",
    kind: "select",
    options: ["JSON", "XML", "CSV", "XLSX", "PDF", "ZIP", "Formulario web", "Múltiples formatos"],
  },
  { key: "responsableTecnico", label: "Responsable técnico *", placeholder: "TI / desarrollador / responsable de integración" },
  { key: "responsableRegulatorio", label: "Responsable regulatorio *", placeholder: "Responsable regulatorio" },
  { key: "responsableQA", label: "Responsable QA *", placeholder: "QA aprobador" },
  {
    key: "propositoConexion",
    label: "Propósito de la conexión *",
    kind: "textarea",
    placeholder: "Describe finalidad regulatoria, alcance, autoridad, trámite, reporte o consulta.",
  },
  {
    key: "mapeoDatos",
    label: "Mapeo de datos *",
    kind: "textarea",
    placeholder: "Describe equivalencias entre FloraTrack y autoridad: campos, unidades, códigos, estados y documentos.",
  },
  {
    key: "reglasValidacion",
    label: "Reglas de validación *",
    kind: "textarea",
    placeholder: "Campos obligatorios, integridad, duplicados, estados QA, firma electrónica, formato, rechazo y reintento.",
  },
  {
    key: "auditTrailGenerado",
    label: "Audit trail generado *",
    kind: "select",
    options: ["Sí", "No"],
  },
  {
    key: "cifradoTransito",
    label: "Cifrado en tránsito *",
    kind: "select",
    options: ["Sí", "No"],
  },
  {
    key: "integridadDatos",
    label: "Integridad de datos *",
    kind: "select",
    options: ["Verificada", "Pendiente verificación", "No verificada"],
  },
  { key: "ultimaPrueba", label: "Última prueba *", type: "date" },
  {
    key: "resultadoUltimaPrueba",
    label: "Resultado última prueba *",
    kind: "select",
    options: ["Conforme", "Con observación", "No conforme", "Fallida", "Pendiente prueba"],
  },
  { key: "proximaRevision", label: "Próxima revisión *", type: "date" },
  {
    key: "estadoConexion",
    label: "Estado de conexión *",
    kind: "select",
    options: ["Diseño", "En pruebas", "Validada", "Activa", "Activa con observación", "Suspendida", "Fallida", "Retirada", "Cerrada"],
  },
  {
    key: "nivelRiesgo",
    label: "Nivel de riesgo *",
    kind: "select",
    options: ["Bajo", "Medio", "Alto", "Crítico"],
  },
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
      "Requiere revisión regulatoria",
      "Cierre aprobado QA",
    ],
  },
  {
    key: "requiereCAPA",
    label: "Requiere CAPA *",
    kind: "select",
    options: ["Sí", "No"],
  },
  { key: "desviacionAsociada", label: "Desviación asociada", placeholder: "DEV-2026-001 / CAPA-001" },
  {
    key: "capa",
    label: "CAPA",
    kind: "textarea",
    placeholder: "Obligatoria si hay fallo, riesgo alto/crítico, integridad no verificada o rechazo QA.",
  },
  { key: "evidencia", label: "Evidencia / soporte", placeholder: "Prueba API, log, captura, acta QA, certificado, respuesta de autoridad..." },
  {
    key: "observaciones",
    label: "Observaciones",
    kind: "textarea",
    placeholder: "Notas regulatorias, limitaciones, pendientes, controles manuales, riesgos residuales.",
  },
];

function clean(value: unknown): string {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function isBlank(value: unknown): boolean {
  const text = clean(value).toLowerCase();
  return ["", "seleccione", "seleccionar", "null", "undefined", "n/a", "na"].includes(text);
}

function createId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `API-REG-${Date.now()}-${Math.random().toString(16).slice(2)}`;
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

function loadRecords(): RegulatoryApiRecord[] {
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

function saveRecords(records: RegulatoryApiRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export default function RegulatoriaApiPage() {
  const [records, setRecords] = useState<RegulatoryApiRecord[]>([]);
  const [form, setForm] = useState<RegulatoryApiRecord>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<CloudNotice | null>(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("Todos");

  useEffect(() => {
    setRecords(loadRecords());
  }, []);

  function updateField(field: keyof RegulatoryApiRecord, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function showNotice(type: CloudNotice["type"], title: string, items: string[] = []) {
    setNotice({ type, title, items });
    window.setTimeout(() => setNotice(null), items.length > 0 ? 12000 : 6000);
  }

  function isEndpointRequired(): boolean {
    return ["REST API", "SOAP", "Webhook", "SFTP", "Radicación electrónica", "Consulta de estado", "Envío de reporte"].includes(form.tipoServicio);
  }

  function credentialRequired(): boolean {
    return !["No aplica", ""].includes(form.metodoAutenticacion);
  }

  function highRisk(): boolean {
    return ["Alto", "Crítico"].includes(form.nivelRiesgo);
  }

  function needsCapa(): boolean {
    return (
      form.requiereCAPA === "Sí" ||
      highRisk() ||
      ["Fallida", "No conforme"].includes(form.resultadoUltimaPrueba) ||
      ["Fallida", "Suspendida", "Retirada"].includes(form.estadoConexion) ||
      ["No verificada"].includes(form.integridadDatos) ||
      ["Rechazado QA", "Requiere CAPA", "Requiere validación"].includes(form.decisionQA)
    );
  }

  function validate(): string[] {
    const errors = requiredFields
      .filter((field) => isBlank(form[field]))
      .map((field) => labels[field]);

    if (isEndpointRequired() && isBlank(form.endpointReferencia)) {
      errors.push("Endpoint / referencia técnica es obligatorio para servicios API, SFTP, webhook, consulta o radicación electrónica");
    }

    if (credentialRequired() && isBlank(form.referenciaCredencial)) {
      errors.push("Referencia de credencial es obligatoria cuando existe método de autenticación");
    }

    if (form.ambiente === "Producción" && form.cifradoTransito !== "Sí") {
      errors.push("Las conexiones regulatorias en producción deben tener cifrado en tránsito");
    }

    if (form.auditTrailGenerado !== "Sí") {
      errors.push("La API regulatoria debe generar audit trail");
    }

    if (form.integridadDatos !== "Verificada") {
      errors.push("La integridad de datos debe estar verificada para aceptar la conexión");
    }

    if (form.ultimaPrueba && form.fechaRegistro && isDateBefore(form.ultimaPrueba, form.fechaRegistro)) {
      errors.push("La última prueba no puede ser anterior a la fecha de registro");
    }

    if (form.proximaRevision && form.fechaRegistro && isDateBefore(form.proximaRevision, form.fechaRegistro)) {
      errors.push("La próxima revisión no puede ser anterior a la fecha de registro");
    }

    if (["Activa", "Validada"].includes(form.estadoConexion) && form.resultadoUltimaPrueba !== "Conforme") {
      errors.push("Una conexión activa o validada debe tener última prueba conforme");
    }

    if (highRisk() && form.requiereCAPA !== "Sí") {
      errors.push("Las conexiones de riesgo alto o crítico deben requerir CAPA o mitigación documentada");
    }

    if (["Aprobado QA", "Aprobado con observación QA", "Rechazado QA", "Cierre aprobado QA"].includes(form.decisionQA) && isBlank(form.evidencia)) {
      errors.push("Evidencia es obligatoria para decisiones QA formales");
    }

    if (needsCapa() && isBlank(form.desviacionAsociada)) {
      errors.push("Desviación asociada es obligatoria para fallos, riesgo alto/crítico, integridad no verificada o rechazo QA");
    }

    if (needsCapa() && isBlank(form.capa)) {
      errors.push("CAPA es obligatoria para fallos, riesgo alto/crítico, integridad no verificada o rechazo QA");
    }

    return Array.from(new Set(errors));
  }

  function fieldHasError(field: keyof RegulatoryApiRecord): boolean {
    if (!submitAttempted) return false;

    if (requiredFields.includes(field) && isBlank(form[field])) return true;
    if (field === "endpointReferencia" && isEndpointRequired() && isBlank(form.endpointReferencia)) return true;
    if (field === "referenciaCredencial" && credentialRequired() && isBlank(form.referenciaCredencial)) return true;
    if (field === "cifradoTransito" && form.ambiente === "Producción" && form.cifradoTransito !== "Sí") return true;
    if (field === "auditTrailGenerado" && form.auditTrailGenerado !== "Sí") return true;
    if (field === "integridadDatos" && form.integridadDatos !== "Verificada") return true;
    if (field === "resultadoUltimaPrueba" && ["Activa", "Validada"].includes(form.estadoConexion) && form.resultadoUltimaPrueba !== "Conforme") return true;
    if (field === "requiereCAPA" && highRisk() && form.requiereCAPA !== "Sí") return true;
    if (field === "evidencia" && ["Aprobado QA", "Aprobado con observación QA", "Rechazado QA", "Cierre aprobado QA"].includes(form.decisionQA) && isBlank(form.evidencia)) return true;
    if (field === "desviacionAsociada" && needsCapa() && isBlank(form.desviacionAsociada)) return true;
    if (field === "capa" && needsCapa() && isBlank(form.capa)) return true;
    if (field === "ultimaPrueba" && form.ultimaPrueba && form.fechaRegistro && isDateBefore(form.ultimaPrueba, form.fechaRegistro)) return true;
    if (field === "proximaRevision" && form.proximaRevision && form.fechaRegistro && isDateBefore(form.proximaRevision, form.fechaRegistro)) return true;

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
      showNotice("warning", "No se guardó la conexión regulatoria. Completa la información obligatoria.", errors);
      return;
    }

    const timestamp = nowIso();

    const payload: RegulatoryApiRecord = {
      ...form,
      id: editingId ?? createId(),
      codigoConexion: clean(form.codigoConexion),
      fechaRegistro: clean(form.fechaRegistro),
      horaRegistro: clean(form.horaRegistro),
      empresa: clean(form.empresa),
      sede: clean(form.sede),
      autoridad: clean(form.autoridad),
      paisAutoridad: clean(form.paisAutoridad),
      tipoServicio: clean(form.tipoServicio),
      endpointReferencia: clean(form.endpointReferencia),
      ambiente: clean(form.ambiente),
      metodoAutenticacion: clean(form.metodoAutenticacion),
      referenciaCredencial: clean(form.referenciaCredencial),
      tipoDatos: clean(form.tipoDatos),
      direccionFlujo: clean(form.direccionFlujo),
      frecuenciaIntercambio: clean(form.frecuenciaIntercambio),
      formatoDatos: clean(form.formatoDatos),
      responsableTecnico: clean(form.responsableTecnico),
      responsableRegulatorio: clean(form.responsableRegulatorio),
      responsableQA: clean(form.responsableQA),
      propositoConexion: clean(form.propositoConexion),
      mapeoDatos: clean(form.mapeoDatos),
      reglasValidacion: clean(form.reglasValidacion),
      auditTrailGenerado: clean(form.auditTrailGenerado),
      cifradoTransito: clean(form.cifradoTransito),
      integridadDatos: clean(form.integridadDatos),
      ultimaPrueba: clean(form.ultimaPrueba),
      resultadoUltimaPrueba: clean(form.resultadoUltimaPrueba),
      proximaRevision: clean(form.proximaRevision),
      estadoConexion: clean(form.estadoConexion),
      nivelRiesgo: clean(form.nivelRiesgo),
      decisionQA: clean(form.decisionQA),
      requiereCAPA: clean(form.requiereCAPA),
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

    showNotice(
      "success",
      editingId ? "Conexión regulatoria actualizada correctamente." : "Conexión regulatoria registrada correctamente con control QA."
    );
  }

  function handleEdit(record: RegulatoryApiRecord) {
    setForm(record);
    setEditingId(record.id);
    setSubmitAttempted(false);
    showNotice("success", "Conexión regulatoria cargada para edición.");
  }

  function handleDelete(id: string) {
    const confirmed = window.confirm("¿Confirmas eliminar esta conexión? En GMP real debería manejarse como retiro o anulación auditada.");
    if (!confirmed) return;

    const nextRecords = records.filter((record) => record.id !== id);
    setRecords(nextRecords);
    saveRecords(nextRecords);
    showNotice("success", "Conexión regulatoria eliminada del almacenamiento local.");
  }

  function exportJson() {
    if (records.length === 0) {
      showNotice("warning", "No hay conexiones regulatorias para exportar.");
      return;
    }

    const blob = new Blob([JSON.stringify(records, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `floratrack-api-regulatoria-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();

    URL.revokeObjectURL(url);
    showNotice("success", "Archivo JSON de API regulatoria exportado correctamente.");
  }

  const filteredRecords = useMemo(() => {
    const term = clean(search).toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        !term ||
        [
          record.codigoConexion,
          record.autoridad,
          record.paisAutoridad,
          record.tipoServicio,
          record.tipoDatos,
          record.estadoConexion,
          record.nivelRiesgo,
          record.decisionQA,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

      const matchesEstado = filterEstado === "Todos" || record.estadoConexion === filterEstado;

      return matchesSearch && matchesEstado;
    });
  }, [records, search, filterEstado]);

  const metrics = useMemo(() => {
    return {
      total: records.length,
      activas: records.filter((record) => ["Activa", "Activa con observación", "Validada"].includes(record.estadoConexion)).length,
      altoRiesgo: records.filter((record) => ["Alto", "Crítico"].includes(record.nivelRiesgo)).length,
      fallidas: records.filter((record) => ["Fallida", "Suspendida"].includes(record.estadoConexion)).length,
      pendienteQA: records.filter((record) => record.decisionQA === "Pendiente QA").length,
    };
  }, [records]);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-slate-100">
      {notice && (
        <CloudNoticeBox notice={notice} onClose={() => setNotice(null)} />
      )}

      <section className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-3xl border border-purple-400/20 bg-slate-900/80 p-6 shadow-2xl shadow-purple-950/30">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-purple-300">
            FloraTrack Enterprise Compliance Platform
          </p>

          <h1 className="mt-3 text-3xl font-black text-white md:text-5xl">
            API Regulatoria Avanzada
          </h1>

          <p className="mt-3 max-w-5xl text-sm leading-6 text-slate-300 md:text-base">
            Control de conexiones con autoridades, APIs regulatorias, radicaciones externas,
            consulta de estados, envío de reportes, credenciales referenciadas, cifrado,
            audit trail, integridad de datos, desviaciones, CAPA y decisión QA.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-5">
          <Metric title="Conexiones" value={metrics.total} />
          <Metric title="Activas" value={metrics.activas} tone="emerald" />
          <Metric title="Alto riesgo" value={metrics.altoRiesgo} tone="red" />
          <Metric title="Fallidas" value={metrics.fallidas} tone="amber" />
          <Metric title="Pendiente QA" value={metrics.pendienteQA} tone="sky" />
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
                {editingId ? "Editar conexión regulatoria" : "Nueva conexión regulatoria"}
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Ninguna conexión puede guardarse vacía o incompleta.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {fields.map((field) => {
                const error = fieldHasError(field.key);

                if (field.kind === "textarea") {
                  return (
                    <label key={field.key} className="md:col-span-2">
                      <span className="mb-2 block text-sm font-bold text-slate-200">{field.label}</span>

                      <textarea
                        value={form[field.key]}
                        onChange={(event) => updateField(field.key, event.target.value)}
                        rows={4}
                        placeholder={field.placeholder}
                        className={`w-full rounded-2xl border px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 ${
                          error ? "border-red-400 bg-red-950/30 ring-4 ring-red-400/20" : "border-slate-700 bg-slate-950 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/40"
                        }`}
                      />

                      {error && <p className="mt-1 text-xs font-bold text-red-300">Completa o corrige este campo.</p>}
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
                        className={`w-full rounded-2xl border px-4 py-3 text-sm text-white outline-none transition ${
                          error ? "border-red-400 bg-red-950/30 ring-4 ring-red-400/20" : "border-slate-700 bg-slate-950 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/40"
                        }`}
                      >
                        <option value="">Seleccione</option>
                        {(field.options ?? []).map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>

                      {error && <p className="mt-1 text-xs font-bold text-red-300">Selecciona una opción válida.</p>}
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
                      className={`w-full rounded-2xl border px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 ${
                        error ? "border-red-400 bg-red-950/30 ring-4 ring-red-400/20" : "border-slate-700 bg-slate-950 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/40"
                      }`}
                    />

                    {error && <p className="mt-1 text-xs font-bold text-red-300">Completa o corrige este campo.</p>}
                  </label>
                );
              })}
            </div>

            <div className="mt-6 flex flex-col gap-3 md:flex-row">
              <button type="button" onClick={handleSave} className="rounded-2xl bg-purple-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-purple-950/50 transition hover:bg-purple-400">
                {editingId ? "Actualizar conexión" : "Guardar conexión"}
              </button>

              <button type="button" onClick={resetForm} className="rounded-2xl border border-slate-600 px-6 py-3 text-sm font-bold text-slate-200 transition hover:bg-slate-800">
                Limpiar formulario
              </button>
            </div>
          </form>

          <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">Registro maestro API regulatoria</h2>
                <p className="mt-1 text-sm text-slate-400">Consulta, filtra, edita y exporta conexiones regulatorias.</p>
              </div>

              <button type="button" onClick={exportJson} className="rounded-2xl border border-purple-400/50 px-5 py-3 text-sm font-bold text-purple-200 transition hover:bg-purple-500/10">
                Exportar JSON
              </button>
            </div>

            <div className="mb-5 grid gap-3 md:grid-cols-[1fr_250px]">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-purple-400/40 transition placeholder:text-slate-600 focus:border-purple-400 focus:ring-4"
                placeholder="Buscar por autoridad, API, estado, riesgo, QA..."
              />

              <select
                value={filterEstado}
                onChange={(event) => setFilterEstado(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-purple-400/40 transition focus:border-purple-400 focus:ring-4"
              >
                <option>Todos</option>
                <option>Diseño</option>
                <option>En pruebas</option>
                <option>Validada</option>
                <option>Activa</option>
                <option>Activa con observación</option>
                <option>Suspendida</option>
                <option>Fallida</option>
                <option>Retirada</option>
                <option>Cerrada</option>
              </select>
            </div>

            <div className="max-h-[780px] space-y-4 overflow-auto pr-2">
              {filteredRecords.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center text-sm text-slate-400">
                  No hay conexiones regulatorias registradas. Crea la primera conexión con datos completos.
                </div>
              ) : (
                filteredRecords.map((record) => (
                  <article key={record.id} className="rounded-2xl border border-slate-700 bg-slate-950 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-white">{record.codigoConexion} · {record.autoridad}</h3>
                          <StatusPill value={record.estadoConexion} />
                          <span className="rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-200">
                            Riesgo {record.nivelRiesgo}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-400">
                          {record.tipoServicio} · {record.tipoDatos} · {record.paisAutoridad}
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
                      <Data label="Flujo" value={record.direccionFlujo} />
                      <Data label="Frecuencia" value={record.frecuenciaIntercambio} />
                      <Data label="Formato" value={record.formatoDatos} />
                      <Data label="Autenticación" value={record.metodoAutenticacion} />
                      <Data label="Credencial" value={record.referenciaCredencial || "Sin registro"} />
                      <Data label="Cifrado" value={record.cifradoTransito} />
                      <Data label="Integridad" value={record.integridadDatos} />
                      <Data label="Audit trail" value={record.auditTrailGenerado} />
                      <Data label="Resultado prueba" value={record.resultadoUltimaPrueba} />
                      <Data label="Próxima revisión" value={record.proximaRevision} />
                      <Data label="Decisión QA" value={record.decisionQA} />
                      <Data label="Evidencia" value={record.evidencia || "Sin registro"} />
                    </div>

                    <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300">
                      <p><span className="font-bold text-slate-100">Propósito: </span>{record.propositoConexion}</p>
                      <p className="mt-2"><span className="font-bold text-slate-100">Mapeo: </span>{record.mapeoDatos}</p>
                      <p className="mt-2"><span className="font-bold text-slate-100">Validaciones: </span>{record.reglasValidacion}</p>

                      {record.endpointReferencia && (
                        <p className="mt-2"><span className="font-bold text-slate-100">Endpoint: </span>{record.endpointReferencia}</p>
                      )}

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
    value === "Activa" || value === "Validada" || value === "Cerrada"
      ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
      : value === "Diseño" || value === "En pruebas" || value === "Activa con observación"
      ? "border-amber-400/40 bg-amber-500/10 text-amber-200"
      : "border-red-400/40 bg-red-500/10 text-red-200";

  return <span className={`rounded-full border px-3 py-1 text-xs font-bold ${className}`}>{value || "Sin estado"}</span>;
}
