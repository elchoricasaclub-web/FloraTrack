"use client";

import { useEffect, useMemo, useState } from "react";

type CompanyRecord = {
  id: string;
  codigoEmpresa: string;
  razonSocial: string;
  nombreComercial: string;
  identificacionFiscal: string;
  fechaRegistro: string;
  tipoEntidad: string;
  paisCiudad: string;
  direccion: string;
  sedePrincipal: string;
  predioAsociado: string;
  representanteLegal: string;
  directorTecnico: string;
  responsableQA: string;
  contactoRegulatorio: string;
  correoContacto: string;
  telefonoContacto: string;
  licenciaRegulatoria: string;
  numeroLicencia: string;
  fechaVencimientoLicencia: string;
  estadoCumplimiento: string;
  certificacionPrincipal: string;
  alcanceOperacion: string;
  actividadesAutorizadas: string;
  modulosHabilitados: string;
  nivelRiesgo: string;
  requiereAuditoria: string;
  fechaProximaRevision: string;
  estadoEmpresa: string;
  decisionQA: string;
  desviacionAsociada: string;
  capa: string;
  evidencia: string;
  observaciones: string;
  creadoEn: string;
  actualizadoEn: string;
};

type FieldConfig = {
  key: keyof CompanyRecord;
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

const STORAGE_KEY = "floratrack_empresas_sedes_licencias_v1";

const emptyForm: CompanyRecord = {
  id: "",
  codigoEmpresa: "",
  razonSocial: "",
  nombreComercial: "",
  identificacionFiscal: "",
  fechaRegistro: "",
  tipoEntidad: "",
  paisCiudad: "",
  direccion: "",
  sedePrincipal: "",
  predioAsociado: "",
  representanteLegal: "",
  directorTecnico: "",
  responsableQA: "",
  contactoRegulatorio: "",
  correoContacto: "",
  telefonoContacto: "",
  licenciaRegulatoria: "",
  numeroLicencia: "",
  fechaVencimientoLicencia: "",
  estadoCumplimiento: "",
  certificacionPrincipal: "",
  alcanceOperacion: "",
  actividadesAutorizadas: "",
  modulosHabilitados: "",
  nivelRiesgo: "",
  requiereAuditoria: "",
  fechaProximaRevision: "",
  estadoEmpresa: "",
  decisionQA: "",
  desviacionAsociada: "",
  capa: "",
  evidencia: "",
  observaciones: "",
  creadoEn: "",
  actualizadoEn: "",
};

const requiredFields: Array<keyof CompanyRecord> = [
  "codigoEmpresa",
  "razonSocial",
  "identificacionFiscal",
  "fechaRegistro",
  "tipoEntidad",
  "paisCiudad",
  "direccion",
  "sedePrincipal",
  "representanteLegal",
  "directorTecnico",
  "responsableQA",
  "contactoRegulatorio",
  "licenciaRegulatoria",
  "estadoCumplimiento",
  "alcanceOperacion",
  "actividadesAutorizadas",
  "modulosHabilitados",
  "nivelRiesgo",
  "requiereAuditoria",
  "fechaProximaRevision",
  "estadoEmpresa",
  "decisionQA",
];

const fieldLabels: Record<keyof CompanyRecord, string> = {
  id: "ID",
  codigoEmpresa: "Código de empresa",
  razonSocial: "Razón social",
  nombreComercial: "Nombre comercial",
  identificacionFiscal: "NIT / identificación fiscal",
  fechaRegistro: "Fecha de registro",
  tipoEntidad: "Tipo de entidad",
  paisCiudad: "País / ciudad",
  direccion: "Dirección",
  sedePrincipal: "Sede principal",
  predioAsociado: "Predio asociado",
  representanteLegal: "Representante legal",
  directorTecnico: "Director técnico",
  responsableQA: "Responsable QA",
  contactoRegulatorio: "Contacto regulatorio",
  correoContacto: "Correo de contacto",
  telefonoContacto: "Teléfono de contacto",
  licenciaRegulatoria: "Licencia regulatoria",
  numeroLicencia: "Número de licencia",
  fechaVencimientoLicencia: "Vencimiento de licencia",
  estadoCumplimiento: "Estado GACP/GMP",
  certificacionPrincipal: "Certificación principal",
  alcanceOperacion: "Alcance de operación",
  actividadesAutorizadas: "Actividades autorizadas",
  modulosHabilitados: "Módulos habilitados",
  nivelRiesgo: "Nivel de riesgo",
  requiereAuditoria: "Requiere auditoría",
  fechaProximaRevision: "Próxima revisión",
  estadoEmpresa: "Estado de empresa",
  decisionQA: "Decisión QA",
  desviacionAsociada: "Desviación asociada",
  capa: "CAPA",
  evidencia: "Evidencia",
  observaciones: "Observaciones",
  creadoEn: "Creado en",
  actualizadoEn: "Actualizado en",
};

const fields: FieldConfig[] = [
  { key: "codigoEmpresa", label: "Código de empresa *", placeholder: "EMP-2026-001" },
  { key: "razonSocial", label: "Razón social *", placeholder: "Growlifecol S.A.S." },
  { key: "nombreComercial", label: "Nombre comercial", placeholder: "Growlifecol" },
  { key: "identificacionFiscal", label: "NIT / identificación fiscal *", placeholder: "900000000-1" },
  { key: "fechaRegistro", label: "Fecha de registro *", type: "date" },
  {
    key: "tipoEntidad",
    label: "Tipo de entidad *",
    kind: "select",
    options: [
      "Empresa cultivadora",
      "Empresa fabricante",
      "Laboratorio",
      "Operador GACP",
      "Operador GMP",
      "Proveedor crítico",
      "Cliente",
      "Aliado estratégico",
      "Entidad regulatoria",
      "Consultor autorizado",
    ],
  },
  { key: "paisCiudad", label: "País / ciudad *", placeholder: "Colombia / Bogotá" },
  { key: "direccion", label: "Dirección *", placeholder: "Dirección legal o sede operativa" },
  { key: "sedePrincipal", label: "Sede principal *", placeholder: "Sede principal / laboratorio / cultivo" },
  { key: "predioAsociado", label: "Predio asociado", placeholder: "PRED-2026-001 / finca / laboratorio" },
  { key: "representanteLegal", label: "Representante legal *", placeholder: "Nombre del representante legal" },
  { key: "directorTecnico", label: "Director técnico *", placeholder: "Director técnico autorizado" },
  { key: "responsableQA", label: "Responsable QA *", placeholder: "Responsable de calidad" },
  { key: "contactoRegulatorio", label: "Contacto regulatorio *", placeholder: "Responsable regulatorio / cumplimiento" },
  { key: "correoContacto", label: "Correo de contacto", type: "email", placeholder: "calidad@empresa.com" },
  { key: "telefonoContacto", label: "Teléfono de contacto", placeholder: "+57 300 000 0000" },
  {
    key: "licenciaRegulatoria",
    label: "Licencia regulatoria *",
    kind: "select",
    options: [
      "Licencia de cultivo",
      "Licencia de fabricación",
      "Licencia de investigación",
      "Permiso sanitario",
      "Registro ICA",
      "Registro INVIMA",
      "Certificación GACP",
      "Certificación GMP",
      "No aplica documentado",
      "Pendiente radicación",
    ],
  },
  { key: "numeroLicencia", label: "Número de licencia", placeholder: "LIC-001 / Resolución / Registro" },
  { key: "fechaVencimientoLicencia", label: "Vencimiento de licencia", type: "date" },
  {
    key: "estadoCumplimiento",
    label: "Estado GACP/GMP *",
    kind: "select",
    options: [
      "Pendiente evaluación",
      "GACP conforme",
      "GMP conforme",
      "GACP/GMP conforme",
      "Con observaciones",
      "No conforme",
      "Suspendido",
      "En implementación",
      "Requiere auditoría",
    ],
  },
  { key: "certificacionPrincipal", label: "Certificación principal", placeholder: "GACP, GMP, ISO 9001, ISO 17025..." },
  {
    key: "alcanceOperacion",
    label: "Alcance de operación *",
    kind: "textarea",
    placeholder: "Describe alcance operativo, sedes, procesos, líneas, productos, lotes, áreas o servicios autorizados.",
  },
  {
    key: "actividadesAutorizadas",
    label: "Actividades autorizadas *",
    kind: "textarea",
    placeholder: "Cultivo, propagación, cosecha, extracción, almacenamiento, análisis QC, distribución, etc.",
  },
  {
    key: "modulosHabilitados",
    label: "Módulos habilitados *",
    kind: "textarea",
    placeholder: "Ej: Cultivos, Recepción, Inventario, Calidad QA, Documentos, CAPA, Auditorías...",
  },
  {
    key: "nivelRiesgo",
    label: "Nivel de riesgo *",
    kind: "select",
    options: ["Bajo", "Medio", "Alto", "Crítico"],
  },
  {
    key: "requiereAuditoria",
    label: "Requiere auditoría *",
    kind: "select",
    options: ["Sí", "No"],
  },
  { key: "fechaProximaRevision", label: "Próxima revisión *", type: "date" },
  {
    key: "estadoEmpresa",
    label: "Estado de empresa *",
    kind: "select",
    options: [
      "Activa",
      "Activa condicional",
      "En evaluación",
      "Suspendida",
      "Inactiva",
      "Bloqueada QA",
      "Rechazada",
      "Pendiente actualización documental",
    ],
  },
  {
    key: "decisionQA",
    label: "Decisión QA *",
    kind: "select",
    options: [
      "Pendiente QA",
      "Aprobada QA",
      "Aprobada condicional QA",
      "Rechazada QA",
      "Suspendida QA",
      "Requiere CAPA",
      "Requiere auditoría",
      "Cierre aprobado QA",
    ],
  },
  { key: "desviacionAsociada", label: "Desviación asociada", placeholder: "DEV-2026-001 / CAPA-001" },
  {
    key: "capa",
    label: "CAPA",
    kind: "textarea",
    placeholder: "Obligatoria si existe suspensión, no conformidad, aprobación condicional, riesgo crítico o rechazo QA.",
  },
  { key: "evidencia", label: "Evidencia / soporte", placeholder: "Licencia, certificado, acta, RUT, cámara de comercio, auditoría, enlace documental..." },
  {
    key: "observaciones",
    label: "Observaciones",
    kind: "textarea",
    placeholder: "Notas QA, restricciones, alcance, condiciones regulatorias, seguimiento o cambios pendientes.",
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

function isValidEmail(value: string): boolean {
  if (isInvalid(value)) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean(value));
}

function safeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `EMP-${Date.now()}-${Math.random().toString(16).slice(2)}`;
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

function isPastDate(dateValue: string): boolean {
  if (!dateValue) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const date = new Date(dateValue);
  date.setHours(0, 0, 0, 0);

  return Number.isFinite(date.getTime()) && date.getTime() < today.getTime();
}

function loadRecords(): CompanyRecord[] {
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

function saveRecords(records: CompanyRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export default function EmpresasPage() {
  const [records, setRecords] = useState<CompanyRecord[]>([]);
  const [form, setForm] = useState<CompanyRecord>(emptyForm);
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

  function updateField(field: keyof CompanyRecord, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function needsCapa(): boolean {
    return (
      ["No conforme", "Suspendido", "Requiere auditoría"].includes(form.estadoCumplimiento) ||
      ["Suspendida", "Bloqueada QA", "Rechazada", "Activa condicional"].includes(form.estadoEmpresa) ||
      ["Aprobada condicional QA", "Rechazada QA", "Suspendida QA", "Requiere CAPA", "Requiere auditoría"].includes(form.decisionQA) ||
      ["Alto", "Crítico"].includes(form.nivelRiesgo)
    );
  }

  function validateForm(): string[] {
    const errors = requiredFields
      .filter((field) => isInvalid(form[field]))
      .map((field) => fieldLabels[field]);

    if (!isValidEmail(form.correoContacto)) {
      errors.push("El correo de contacto debe tener un formato válido");
    }

    if (
      !["No aplica documentado", "Pendiente radicación"].includes(form.licenciaRegulatoria) &&
      isInvalid(form.numeroLicencia)
    ) {
      errors.push("El número de licencia es obligatorio cuando existe licencia regulatoria");
    }

    if (
      !["No aplica documentado", "Pendiente radicación"].includes(form.licenciaRegulatoria) &&
      isInvalid(form.fechaVencimientoLicencia)
    ) {
      errors.push("El vencimiento de licencia es obligatorio cuando existe licencia regulatoria");
    }

    if (
      form.fechaVencimientoLicencia &&
      form.fechaRegistro &&
      isDateBefore(form.fechaVencimientoLicencia, form.fechaRegistro)
    ) {
      errors.push("El vencimiento de licencia no puede ser anterior a la fecha de registro");
    }

    if (
      form.fechaProximaRevision &&
      form.fechaRegistro &&
      isDateBefore(form.fechaProximaRevision, form.fechaRegistro)
    ) {
      errors.push("La próxima revisión no puede ser anterior a la fecha de registro");
    }

    if (form.requiereAuditoria === "Sí" && isInvalid(form.evidencia)) {
      errors.push("La evidencia es obligatoria cuando la empresa requiere auditoría");
    }

    if (["Aprobada QA", "Aprobada condicional QA", "Rechazada QA", "Suspendida QA", "Cierre aprobado QA"].includes(form.decisionQA) && isInvalid(form.evidencia)) {
      errors.push("La evidencia es obligatoria para decisiones QA formales");
    }

    if (needsCapa() && isInvalid(form.desviacionAsociada)) {
      errors.push("La desviación asociada es obligatoria cuando existe riesgo, suspensión, no conformidad o CAPA");
    }

    if (needsCapa() && isInvalid(form.capa)) {
      errors.push("La CAPA es obligatoria cuando existe riesgo, suspensión, no conformidad o aprobación condicional");
    }

    return Array.from(new Set(errors));
  }

  function fieldHasError(field: keyof CompanyRecord): boolean {
    if (!submitAttempted) return false;

    if (requiredFields.includes(field) && isInvalid(form[field])) return true;

    if (field === "correoContacto" && !isValidEmail(form.correoContacto)) return true;

    if (
      field === "numeroLicencia" &&
      !["No aplica documentado", "Pendiente radicación"].includes(form.licenciaRegulatoria) &&
      isInvalid(form.numeroLicencia)
    ) return true;

    if (
      field === "fechaVencimientoLicencia" &&
      !["No aplica documentado", "Pendiente radicación"].includes(form.licenciaRegulatoria) &&
      isInvalid(form.fechaVencimientoLicencia)
    ) return true;

    if (field === "fechaVencimientoLicencia" && form.fechaVencimientoLicencia && form.fechaRegistro && isDateBefore(form.fechaVencimientoLicencia, form.fechaRegistro)) return true;
    if (field === "fechaProximaRevision" && form.fechaProximaRevision && form.fechaRegistro && isDateBefore(form.fechaProximaRevision, form.fechaRegistro)) return true;
    if (field === "evidencia" && form.requiereAuditoria === "Sí" && isInvalid(form.evidencia)) return true;
    if (field === "evidencia" && ["Aprobada QA", "Aprobada condicional QA", "Rechazada QA", "Suspendida QA", "Cierre aprobado QA"].includes(form.decisionQA) && isInvalid(form.evidencia)) return true;
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
      showCloud("No se guardó la empresa. Completa la información obligatoria.", errors, "warning");
      return;
    }

    const timestamp = nowIso();

    const payload: CompanyRecord = {
      ...form,
      codigoEmpresa: clean(form.codigoEmpresa),
      razonSocial: clean(form.razonSocial),
      nombreComercial: clean(form.nombreComercial),
      identificacionFiscal: clean(form.identificacionFiscal),
      fechaRegistro: clean(form.fechaRegistro),
      tipoEntidad: clean(form.tipoEntidad),
      paisCiudad: clean(form.paisCiudad),
      direccion: clean(form.direccion),
      sedePrincipal: clean(form.sedePrincipal),
      predioAsociado: clean(form.predioAsociado),
      representanteLegal: clean(form.representanteLegal),
      directorTecnico: clean(form.directorTecnico),
      responsableQA: clean(form.responsableQA),
      contactoRegulatorio: clean(form.contactoRegulatorio),
      correoContacto: clean(form.correoContacto).toLowerCase(),
      telefonoContacto: clean(form.telefonoContacto),
      licenciaRegulatoria: clean(form.licenciaRegulatoria),
      numeroLicencia: clean(form.numeroLicencia),
      fechaVencimientoLicencia: clean(form.fechaVencimientoLicencia),
      estadoCumplimiento: clean(form.estadoCumplimiento),
      certificacionPrincipal: clean(form.certificacionPrincipal),
      alcanceOperacion: clean(form.alcanceOperacion),
      actividadesAutorizadas: clean(form.actividadesAutorizadas),
      modulosHabilitados: clean(form.modulosHabilitados),
      nivelRiesgo: clean(form.nivelRiesgo),
      requiereAuditoria: clean(form.requiereAuditoria),
      fechaProximaRevision: clean(form.fechaProximaRevision),
      estadoEmpresa: clean(form.estadoEmpresa),
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
      editingId ? "Empresa actualizada correctamente." : "Empresa registrada correctamente con control multiempresa.",
      [],
      "success"
    );
  }

  function handleEdit(record: CompanyRecord) {
    setForm(record);
    setEditingId(record.id);
    setSubmitAttempted(false);
    showCloud("Empresa cargada para edición. Verifica antes de actualizar.", [], "success");
  }

  function handleDelete(id: string) {
    const confirmed = window.confirm("¿Confirmas eliminar esta empresa? En ambiente GMP real debería manejarse como inactivación o anulación auditada.");
    if (!confirmed) return;

    const nextRecords = records.filter((record) => record.id !== id);
    setRecords(nextRecords);
    saveRecords(nextRecords);
    showCloud("Empresa eliminada del almacenamiento local.", [], "success");
  }

  function exportJson() {
    if (records.length === 0) {
      showCloud("No hay empresas para exportar.", [], "warning");
      return;
    }

    const blob = new Blob([JSON.stringify(records, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `floratrack-empresas-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);

    showCloud("Archivo JSON de empresas exportado correctamente.", [], "success");
  }

  const filteredRecords = useMemo(() => {
    const term = clean(search).toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        !term ||
        [
          record.codigoEmpresa,
          record.razonSocial,
          record.nombreComercial,
          record.identificacionFiscal,
          record.tipoEntidad,
          record.sedePrincipal,
          record.estadoCumplimiento,
          record.estadoEmpresa,
          record.decisionQA,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

      const matchesEstado = filterEstado === "Todos" || record.estadoEmpresa === filterEstado;

      return matchesSearch && matchesEstado;
    });
  }, [records, search, filterEstado]);

  const dashboard = useMemo(() => {
    return {
      total: records.length,
      activas: records.filter((record) => ["Activa", "Activa condicional"].includes(record.estadoEmpresa)).length,
      conformes: records.filter((record) => ["GACP conforme", "GMP conforme", "GACP/GMP conforme"].includes(record.estadoCumplimiento)).length,
      vencidas: records.filter((record) => isPastDate(record.fechaVencimientoLicencia)).length,
      altoRiesgo: records.filter((record) => ["Alto", "Crítico"].includes(record.nivelRiesgo)).length,
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
        <header className="rounded-3xl border border-emerald-400/20 bg-slate-900/80 p-6 shadow-2xl shadow-emerald-950/30">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-300">
                FloraTrack Enterprise Compliance Platform
              </p>

              <h1 className="mt-3 text-3xl font-black text-white md:text-5xl">
                Empresas, sedes y licencias
              </h1>

              <p className="mt-3 max-w-5xl text-sm leading-6 text-slate-300 md:text-base">
                Control multiempresa de razón social, sedes, licencias, responsables,
                alcance autorizado, estado GACP/GMP, auditoría, evidencia, QA y CAPA.
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-5 py-4 text-sm text-emerald-100">
              <p className="font-bold">Multiempresa activo</p>
              <p className="mt-1 text-emerald-200">Empresas · Licencias · QA · Alcance · Auditoría</p>
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
          <Metric title="Empresas" value={dashboard.total} />
          <Metric title="Activas" value={dashboard.activas} tone="emerald" />
          <Metric title="Conformes" value={dashboard.conformes} tone="sky" />
          <Metric title="Licencias vencidas" value={dashboard.vencidas} tone="red" />
          <Metric title="Alto riesgo" value={dashboard.altoRiesgo} tone="amber" />
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
                <h2 className="text-2xl font-black text-white">{editingId ? "Editar empresa" : "Nueva empresa"}</h2>
                <p className="mt-1 text-sm text-slate-400">Ninguna empresa puede guardarse vacía o incompleta.</p>
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
                  : "border-slate-700 bg-slate-950 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/40";

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

                      {hasError && <p className="mt-1 text-xs font-bold text-red-300">Campo obligatorio o condición regulatoria requerida.</p>}
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
              <button type="button" onClick={handleSave} className="rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-black text-slate-950 shadow-lg shadow-emerald-950/50 transition hover:bg-emerald-400">
                {editingId ? "Actualizar empresa" : "Guardar empresa"}
              </button>

              <button type="button" onClick={resetForm} className="rounded-2xl border border-slate-600 px-6 py-3 text-sm font-bold text-slate-200 transition hover:bg-slate-800">
                Limpiar formulario
              </button>
            </div>
          </form>

          <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">Registro maestro de empresas</h2>
                <p className="mt-1 text-sm text-slate-400">Consulta, filtra, edita y exporta empresas, sedes y licencias.</p>
              </div>

              <button type="button" onClick={exportJson} className="rounded-2xl border border-emerald-400/50 px-5 py-3 text-sm font-bold text-emerald-200 transition hover:bg-emerald-500/10">
                Exportar JSON
              </button>
            </div>

            <div className="mb-5 grid gap-3 md:grid-cols-[1fr_250px]">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-emerald-400/40 transition placeholder:text-slate-600 focus:border-emerald-400 focus:ring-4"
                placeholder="Buscar por empresa, NIT, sede, licencia, estado..."
              />

              <select
                value={filterEstado}
                onChange={(event) => setFilterEstado(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-emerald-400/40 transition focus:border-emerald-400 focus:ring-4"
              >
                <option>Todos</option>
                <option>Activa</option>
                <option>Activa condicional</option>
                <option>En evaluación</option>
                <option>Suspendida</option>
                <option>Inactiva</option>
                <option>Bloqueada QA</option>
                <option>Rechazada</option>
                <option>Pendiente actualización documental</option>
              </select>
            </div>

            <div className="max-h-[780px] space-y-4 overflow-auto pr-2">
              {filteredRecords.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center text-sm text-slate-400">
                  No hay empresas registradas. Crea el primer registro con datos completos.
                </div>
              ) : (
                filteredRecords.map((record) => (
                  <article key={record.id} className="rounded-2xl border border-slate-700 bg-slate-950 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-white">{record.codigoEmpresa} · {record.razonSocial}</h3>
                          <StatusPill value={record.estadoEmpresa} />
                          <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-200">
                            Riesgo {record.nivelRiesgo}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-400">
                          {record.identificacionFiscal} · {record.sedePrincipal} · {record.estadoCumplimiento}
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
                      <Data label="Nombre comercial" value={record.nombreComercial || "Sin registro"} />
                      <Data label="Tipo entidad" value={record.tipoEntidad} />
                      <Data label="País / ciudad" value={record.paisCiudad} />
                      <Data label="Dirección" value={record.direccion} />
                      <Data label="Predio asociado" value={record.predioAsociado || "Sin registro"} />
                      <Data label="Representante legal" value={record.representanteLegal} />
                      <Data label="Director técnico" value={record.directorTecnico} />
                      <Data label="Responsable QA" value={record.responsableQA} />
                      <Data label="Contacto regulatorio" value={record.contactoRegulatorio} />
                      <Data label="Correo" value={record.correoContacto || "Sin registro"} />
                      <Data label="Licencia" value={record.licenciaRegulatoria} />
                      <Data label="Número licencia" value={record.numeroLicencia || "Sin registro"} />
                      <Data label="Vencimiento licencia" value={record.fechaVencimientoLicencia || "Sin registro"} />
                      <Data label="Certificación" value={record.certificacionPrincipal || "Sin registro"} />
                      <Data label="Requiere auditoría" value={record.requiereAuditoria} />
                      <Data label="Próxima revisión" value={record.fechaProximaRevision} />
                      <Data label="Decisión QA" value={record.decisionQA} />
                      <Data label="Evidencia" value={record.evidencia || "Sin registro"} />
                    </div>

                    <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300">
                      <p><span className="font-bold text-slate-100">Alcance: </span>{record.alcanceOperacion}</p>
                      <p className="mt-2"><span className="font-bold text-slate-100">Actividades: </span>{record.actividadesAutorizadas}</p>
                      <p className="mt-2"><span className="font-bold text-slate-100">Módulos habilitados: </span>{record.modulosHabilitados}</p>

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
    value === "Activa"
      ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
      : value === "Activa condicional" || value === "En evaluación" || value === "Pendiente actualización documental"
      ? "border-amber-400/40 bg-amber-500/10 text-amber-200"
      : "border-red-400/40 bg-red-500/10 text-red-200";

  return <span className={`rounded-full border px-3 py-1 text-xs font-bold ${className}`}>{value || "Sin estado"}</span>;
}
