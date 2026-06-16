"use client";

import { useEffect, useMemo, useState } from "react";

type AccessRecord = {
  id: string;
  codigoUsuario: string;
  fechaAlta: string;
  horaAlta: string;
  empresa: string;
  sede: string;
  nombreCompleto: string;
  identificacion: string;
  correo: string;
  cargo: string;
  area: string;
  rolSistema: string;
  nivelAcceso: string;
  modulosAutorizados: string;
  estadoUsuario: string;
  mfaActivo: string;
  requiereFirmaElectronica: string;
  aprobadoPor: string;
  fechaAprobacion: string;
  fechaProximaRevision: string;
  ultimaRevision: string;
  revisionAcceso: string;
  conflictoSegregacion: string;
  motivoAcceso: string;
  evidencia: string;
  desviacionAsociada: string;
  accionCorrectiva: string;
  observaciones: string;
  creadoEn: string;
  actualizadoEn: string;
};

type FieldConfig = {
  key: keyof AccessRecord;
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

const STORAGE_KEY = "floratrack_usuarios_roles_accesos_v1";

const emptyForm: AccessRecord = {
  id: "",
  codigoUsuario: "",
  fechaAlta: "",
  horaAlta: "",
  empresa: "",
  sede: "",
  nombreCompleto: "",
  identificacion: "",
  correo: "",
  cargo: "",
  area: "",
  rolSistema: "",
  nivelAcceso: "",
  modulosAutorizados: "",
  estadoUsuario: "",
  mfaActivo: "",
  requiereFirmaElectronica: "",
  aprobadoPor: "",
  fechaAprobacion: "",
  fechaProximaRevision: "",
  ultimaRevision: "",
  revisionAcceso: "",
  conflictoSegregacion: "",
  motivoAcceso: "",
  evidencia: "",
  desviacionAsociada: "",
  accionCorrectiva: "",
  observaciones: "",
  creadoEn: "",
  actualizadoEn: "",
};

const requiredFields: Array<keyof AccessRecord> = [
  "codigoUsuario",
  "fechaAlta",
  "horaAlta",
  "empresa",
  "sede",
  "nombreCompleto",
  "correo",
  "cargo",
  "area",
  "rolSistema",
  "nivelAcceso",
  "modulosAutorizados",
  "estadoUsuario",
  "mfaActivo",
  "requiereFirmaElectronica",
  "aprobadoPor",
  "fechaProximaRevision",
  "revisionAcceso",
  "conflictoSegregacion",
  "motivoAcceso",
];

const fieldLabels: Record<keyof AccessRecord, string> = {
  id: "ID",
  codigoUsuario: "Código de usuario",
  fechaAlta: "Fecha de alta",
  horaAlta: "Hora de alta",
  empresa: "Empresa",
  sede: "Sede / predio",
  nombreCompleto: "Nombre completo",
  identificacion: "Identificación",
  correo: "Correo",
  cargo: "Cargo",
  area: "Área",
  rolSistema: "Rol del sistema",
  nivelAcceso: "Nivel de acceso",
  modulosAutorizados: "Módulos autorizados",
  estadoUsuario: "Estado del usuario",
  mfaActivo: "MFA activo",
  requiereFirmaElectronica: "Requiere firma electrónica",
  aprobadoPor: "Aprobado por",
  fechaAprobacion: "Fecha de aprobación",
  fechaProximaRevision: "Próxima revisión de acceso",
  ultimaRevision: "Última revisión",
  revisionAcceso: "Resultado de revisión",
  conflictoSegregacion: "Conflicto de segregación",
  motivoAcceso: "Motivo / justificación del acceso",
  evidencia: "Evidencia",
  desviacionAsociada: "Desviación asociada",
  accionCorrectiva: "Acción correctiva / CAPA",
  observaciones: "Observaciones",
  creadoEn: "Creado en",
  actualizadoEn: "Actualizado en",
};

const fields: FieldConfig[] = [
  { key: "codigoUsuario", label: "Código de usuario *", placeholder: "USR-2026-001" },
  { key: "fechaAlta", label: "Fecha de alta *", type: "date" },
  { key: "horaAlta", label: "Hora de alta *", type: "time" },
  { key: "empresa", label: "Empresa *", placeholder: "Growlifecol S.A.S." },
  { key: "sede", label: "Sede / predio *", placeholder: "Sede principal" },
  { key: "nombreCompleto", label: "Nombre completo *", placeholder: "Nombre del colaborador / usuario" },
  { key: "identificacion", label: "Identificación", placeholder: "CC / ID interno / código empleado" },
  { key: "correo", label: "Correo *", type: "email", placeholder: "usuario@empresa.com" },
  { key: "cargo", label: "Cargo *", placeholder: "Responsable QA, técnico cultivo, analista QC..." },
  {
    key: "area",
    label: "Área *",
    kind: "select",
    options: [
      "Dirección técnica",
      "QA",
      "QC",
      "Recepción",
      "Inventario",
      "Propagación",
      "Cultivo",
      "Cosecha",
      "Secado",
      "Postcosecha",
      "Micropropagación",
      "Extracción BHO",
      "Bubble Hash",
      "Live Rosin",
      "Limpieza y saneamiento",
      "Mantenimiento",
      "Regulatorio",
      "Auditorías",
      "CAPA",
      "Documentación",
      "Entrenamiento",
      "Almacén",
      "Administración",
    ],
  },
  {
    key: "rolSistema",
    label: "Rol del sistema *",
    kind: "select",
    options: [
      "Consulta",
      "Operador",
      "Supervisor",
      "QA Revisor",
      "QA Liberador",
      "QC Analista",
      "Auditor",
      "Dirección Técnica",
      "Administrador",
      "Super Admin",
      "Regulatorio",
      "Proveedor externo",
    ],
  },
  {
    key: "nivelAcceso",
    label: "Nivel de acceso *",
    kind: "select",
    options: [
      "Lectura",
      "Registro",
      "Edición controlada",
      "Aprobación QA",
      "Liberación QA",
      "Auditoría",
      "Administrador",
      "Crítico",
    ],
  },
  {
    key: "modulosAutorizados",
    label: "Módulos autorizados *",
    kind: "textarea",
    placeholder: "Ej: Recepción, Inventario, Calidad QA, Documentos, CAPA, Auditorías...",
  },
  {
    key: "estadoUsuario",
    label: "Estado del usuario *",
    kind: "select",
    options: [
      "Pendiente aprobación",
      "Activo",
      "Activo temporal",
      "Inactivo",
      "Bloqueado",
      "Revocado",
      "Rechazado",
      "Pendiente revisión QA",
    ],
  },
  {
    key: "mfaActivo",
    label: "MFA activo *",
    kind: "select",
    options: ["Sí", "No"],
  },
  {
    key: "requiereFirmaElectronica",
    label: "Requiere firma electrónica *",
    kind: "select",
    options: ["Sí", "No"],
  },
  { key: "aprobadoPor", label: "Aprobado por *", placeholder: "QA / Dirección técnica / Administrador autorizado" },
  { key: "fechaAprobacion", label: "Fecha de aprobación", type: "date" },
  { key: "fechaProximaRevision", label: "Próxima revisión de acceso *", type: "date" },
  { key: "ultimaRevision", label: "Última revisión", type: "date" },
  {
    key: "revisionAcceso",
    label: "Resultado de revisión *",
    kind: "select",
    options: [
      "Pendiente revisión",
      "Aprobado",
      "Aprobado con observación",
      "Requiere ajuste",
      "Bloqueo recomendado",
      "Revocar acceso",
      "Rechazado",
    ],
  },
  {
    key: "conflictoSegregacion",
    label: "Conflicto de segregación *",
    kind: "select",
    options: ["Sí", "No"],
  },
  {
    key: "motivoAcceso",
    label: "Motivo / justificación del acceso *",
    kind: "textarea",
    placeholder: "Justifica el acceso según cargo, proceso, responsabilidades GMP/GACP y necesidad operativa.",
  },
  { key: "evidencia", label: "Evidencia / soporte", placeholder: "Solicitud, aprobación QA, ticket, acta, firma, correo, matriz de roles..." },
  { key: "desviacionAsociada", label: "Desviación asociada", placeholder: "DEV-2026-001 / CAPA-001" },
  {
    key: "accionCorrectiva",
    label: "Acción correctiva / CAPA",
    kind: "textarea",
    placeholder: "Obligatoria si hay conflicto de segregación, bloqueo, revocación, rechazo o acceso crítico sin controles.",
  },
  {
    key: "observaciones",
    label: "Observaciones",
    kind: "textarea",
    placeholder: "Restricciones, comentarios de QA, alcance, temporalidad, condiciones de uso o revisión.",
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
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean(value));
}

function safeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `USR-${Date.now()}-${Math.random().toString(16).slice(2)}`;
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

function loadRecords(): AccessRecord[] {
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

function saveRecords(records: AccessRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export default function UsuariosPage() {
  const [records, setRecords] = useState<AccessRecord[]>([]);
  const [form, setForm] = useState<AccessRecord>(emptyForm);
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

  function updateField(field: keyof AccessRecord, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function isHighPrivilege(): boolean {
    return (
      ["QA Liberador", "Dirección Técnica", "Administrador", "Super Admin", "Regulatorio"].includes(form.rolSistema) ||
      ["Aprobación QA", "Liberación QA", "Administrador", "Crítico"].includes(form.nivelAcceso)
    );
  }

  function needsCapa(): boolean {
    return (
      form.conflictoSegregacion === "Sí" ||
      ["Bloqueado", "Revocado", "Rechazado"].includes(form.estadoUsuario) ||
      ["Bloqueo recomendado", "Revocar acceso", "Rechazado"].includes(form.revisionAcceso)
    );
  }

  function validateForm(): string[] {
    const errors = requiredFields
      .filter((field) => isInvalid(form[field]))
      .map((field) => fieldLabels[field]);

    if (!isInvalid(form.correo) && !isValidEmail(form.correo)) {
      errors.push("El correo debe tener un formato válido");
    }

    if (["Activo", "Activo temporal"].includes(form.estadoUsuario) && isInvalid(form.fechaAprobacion)) {
      errors.push("La fecha de aprobación es obligatoria para usuarios activos o activos temporales");
    }

    if (["Activo", "Activo temporal"].includes(form.estadoUsuario) && isInvalid(form.evidencia)) {
      errors.push("La evidencia es obligatoria para usuarios activos o activos temporales");
    }

    if (isHighPrivilege() && form.mfaActivo !== "Sí") {
      errors.push("Los roles o accesos críticos deben tener MFA activo");
    }

    if (isHighPrivilege() && form.requiereFirmaElectronica !== "Sí") {
      errors.push("Los roles o accesos críticos deben requerir firma electrónica");
    }

    if (isHighPrivilege() && isInvalid(form.evidencia)) {
      errors.push("La evidencia es obligatoria para accesos críticos o privilegiados");
    }

    if (form.fechaProximaRevision && form.fechaAlta && isDateBefore(form.fechaProximaRevision, form.fechaAlta)) {
      errors.push("La próxima revisión no puede ser anterior a la fecha de alta");
    }

    if (form.ultimaRevision && form.fechaAlta && isDateBefore(form.ultimaRevision, form.fechaAlta)) {
      errors.push("La última revisión no puede ser anterior a la fecha de alta");
    }

    if (needsCapa() && isInvalid(form.desviacionAsociada)) {
      errors.push("La desviación asociada es obligatoria para conflicto, bloqueo, revocación o rechazo de acceso");
    }

    if (needsCapa() && isInvalid(form.accionCorrectiva)) {
      errors.push("La acción correctiva / CAPA es obligatoria para conflicto, bloqueo, revocación o rechazo de acceso");
    }

    return Array.from(new Set(errors));
  }

  function fieldHasError(field: keyof AccessRecord): boolean {
    if (!submitAttempted) return false;

    if (requiredFields.includes(field) && isInvalid(form[field])) return true;

    if (field === "correo" && !isInvalid(form.correo) && !isValidEmail(form.correo)) return true;
    if (field === "fechaAprobacion" && ["Activo", "Activo temporal"].includes(form.estadoUsuario) && isInvalid(form.fechaAprobacion)) return true;
    if (field === "evidencia" && ["Activo", "Activo temporal"].includes(form.estadoUsuario) && isInvalid(form.evidencia)) return true;
    if (field === "evidencia" && isHighPrivilege() && isInvalid(form.evidencia)) return true;
    if (field === "mfaActivo" && isHighPrivilege() && form.mfaActivo !== "Sí") return true;
    if (field === "requiereFirmaElectronica" && isHighPrivilege() && form.requiereFirmaElectronica !== "Sí") return true;
    if (field === "fechaProximaRevision" && form.fechaProximaRevision && form.fechaAlta && isDateBefore(form.fechaProximaRevision, form.fechaAlta)) return true;
    if (field === "ultimaRevision" && form.ultimaRevision && form.fechaAlta && isDateBefore(form.ultimaRevision, form.fechaAlta)) return true;
    if (field === "desviacionAsociada" && needsCapa() && isInvalid(form.desviacionAsociada)) return true;
    if (field === "accionCorrectiva" && needsCapa() && isInvalid(form.accionCorrectiva)) return true;

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
      showCloud("No se guardó el usuario. Completa la información obligatoria.", errors, "warning");
      return;
    }

    const timestamp = nowIso();

    const payload: AccessRecord = {
      ...form,
      codigoUsuario: clean(form.codigoUsuario),
      fechaAlta: clean(form.fechaAlta),
      horaAlta: clean(form.horaAlta),
      empresa: clean(form.empresa),
      sede: clean(form.sede),
      nombreCompleto: clean(form.nombreCompleto),
      identificacion: clean(form.identificacion),
      correo: clean(form.correo).toLowerCase(),
      cargo: clean(form.cargo),
      area: clean(form.area),
      rolSistema: clean(form.rolSistema),
      nivelAcceso: clean(form.nivelAcceso),
      modulosAutorizados: clean(form.modulosAutorizados),
      estadoUsuario: clean(form.estadoUsuario),
      mfaActivo: clean(form.mfaActivo),
      requiereFirmaElectronica: clean(form.requiereFirmaElectronica),
      aprobadoPor: clean(form.aprobadoPor),
      fechaAprobacion: clean(form.fechaAprobacion),
      fechaProximaRevision: clean(form.fechaProximaRevision),
      ultimaRevision: clean(form.ultimaRevision),
      revisionAcceso: clean(form.revisionAcceso),
      conflictoSegregacion: clean(form.conflictoSegregacion),
      motivoAcceso: clean(form.motivoAcceso),
      evidencia: clean(form.evidencia),
      desviacionAsociada: clean(form.desviacionAsociada),
      accionCorrectiva: clean(form.accionCorrectiva),
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
      editingId ? "Usuario actualizado correctamente." : "Usuario y acceso registrado correctamente con control GMP.",
      [],
      "success"
    );
  }

  function handleEdit(record: AccessRecord) {
    setForm(record);
    setEditingId(record.id);
    setSubmitAttempted(false);
    showCloud("Usuario cargado para edición. Verifica antes de actualizar.", [], "success");
  }

  function handleDelete(id: string) {
    const confirmed = window.confirm("¿Confirmas eliminar este usuario? En ambiente GMP real debería manejarse como revocación o anulación auditada.");
    if (!confirmed) return;

    const nextRecords = records.filter((record) => record.id !== id);
    setRecords(nextRecords);
    saveRecords(nextRecords);
    showCloud("Usuario eliminado del almacenamiento local.", [], "success");
  }

  function exportJson() {
    if (records.length === 0) {
      showCloud("No hay usuarios para exportar.", [], "warning");
      return;
    }

    const blob = new Blob([JSON.stringify(records, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `floratrack-usuarios-accesos-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);

    showCloud("Archivo JSON de usuarios y accesos exportado correctamente.", [], "success");
  }

  const filteredRecords = useMemo(() => {
    const term = clean(search).toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        !term ||
        [
          record.codigoUsuario,
          record.nombreCompleto,
          record.correo,
          record.cargo,
          record.area,
          record.rolSistema,
          record.nivelAcceso,
          record.modulosAutorizados,
          record.estadoUsuario,
          record.revisionAcceso,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

      const matchesEstado = filterEstado === "Todos" || record.estadoUsuario === filterEstado;

      return matchesSearch && matchesEstado;
    });
  }, [records, search, filterEstado]);

  const dashboard = useMemo(() => {
    return {
      total: records.length,
      activos: records.filter((record) => ["Activo", "Activo temporal"].includes(record.estadoUsuario)).length,
      privilegiados: records.filter((record) =>
        ["QA Liberador", "Dirección Técnica", "Administrador", "Super Admin", "Regulatorio"].includes(record.rolSistema) ||
        ["Aprobación QA", "Liberación QA", "Administrador", "Crítico"].includes(record.nivelAcceso)
      ).length,
      revisionVencida: records.filter((record) => isPastDate(record.fechaProximaRevision)).length,
      conflictos: records.filter((record) => record.conflictoSegregacion === "Sí").length,
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
        <header className="rounded-3xl border border-sky-400/20 bg-slate-900/80 p-6 shadow-2xl shadow-sky-950/30">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-300">
                FloraTrack Enterprise Compliance Platform
              </p>

              <h1 className="mt-3 text-3xl font-black text-white md:text-5xl">
                Usuarios, roles y control de accesos
              </h1>

              <p className="mt-3 max-w-5xl text-sm leading-6 text-slate-300 md:text-base">
                Control GMP de usuarios, roles, permisos, MFA, firma electrónica,
                aprobación QA, revisión periódica de accesos, segregación de funciones,
                evidencia, desviaciones y CAPA.
              </p>
            </div>

            <div className="rounded-2xl border border-sky-400/20 bg-sky-500/10 px-5 py-4 text-sm text-sky-100">
              <p className="font-bold">Seguridad activa</p>
              <p className="mt-1 text-sky-200">Usuarios · Roles · MFA · Firma · QA · CAPA</p>
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
          <Metric title="Usuarios" value={dashboard.total} />
          <Metric title="Activos" value={dashboard.activos} tone="emerald" />
          <Metric title="Privilegiados" value={dashboard.privilegiados} tone="amber" />
          <Metric title="Revisión vencida" value={dashboard.revisionVencida} tone="red" />
          <Metric title="Conflictos" value={dashboard.conflictos} tone="sky" />
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
                <h2 className="text-2xl font-black text-white">{editingId ? "Editar usuario" : "Nuevo usuario / acceso"}</h2>
                <p className="mt-1 text-sm text-slate-400">Ningún acceso puede guardarse vacío o incompleto.</p>
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
                  : "border-slate-700 bg-slate-950 focus:border-sky-400 focus:ring-4 focus:ring-sky-400/40";

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

                      {hasError && <p className="mt-1 text-xs font-bold text-red-300">Campo obligatorio o condición de seguridad requerida.</p>}
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
              <button type="button" onClick={handleSave} className="rounded-2xl bg-sky-500 px-6 py-3 text-sm font-black text-slate-950 shadow-lg shadow-sky-950/50 transition hover:bg-sky-400">
                {editingId ? "Actualizar usuario" : "Guardar usuario"}
              </button>

              <button type="button" onClick={resetForm} className="rounded-2xl border border-slate-600 px-6 py-3 text-sm font-bold text-slate-200 transition hover:bg-slate-800">
                Limpiar formulario
              </button>
            </div>
          </form>

          <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">Matriz de usuarios y accesos</h2>
                <p className="mt-1 text-sm text-slate-400">Consulta, filtra, edita y exporta usuarios, roles y permisos.</p>
              </div>

              <button type="button" onClick={exportJson} className="rounded-2xl border border-sky-400/50 px-5 py-3 text-sm font-bold text-sky-200 transition hover:bg-sky-500/10">
                Exportar JSON
              </button>
            </div>

            <div className="mb-5 grid gap-3 md:grid-cols-[1fr_250px]">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-sky-400/40 transition placeholder:text-slate-600 focus:border-sky-400 focus:ring-4"
                placeholder="Buscar por usuario, rol, módulo, correo, estado..."
              />

              <select
                value={filterEstado}
                onChange={(event) => setFilterEstado(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-sky-400/40 transition focus:border-sky-400 focus:ring-4"
              >
                <option>Todos</option>
                <option>Pendiente aprobación</option>
                <option>Activo</option>
                <option>Activo temporal</option>
                <option>Inactivo</option>
                <option>Bloqueado</option>
                <option>Revocado</option>
                <option>Rechazado</option>
                <option>Pendiente revisión QA</option>
              </select>
            </div>

            <div className="max-h-[780px] space-y-4 overflow-auto pr-2">
              {filteredRecords.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center text-sm text-slate-400">
                  No hay usuarios registrados. Crea el primer usuario con datos completos.
                </div>
              ) : (
                filteredRecords.map((record) => (
                  <article key={record.id} className="rounded-2xl border border-slate-700 bg-slate-950 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-white">{record.codigoUsuario} · {record.nombreCompleto}</h3>
                          <StatusPill value={record.estadoUsuario} />
                          <span className="rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs font-bold text-sky-200">
                            {record.rolSistema}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-400">
                          {record.correo} · {record.area} · {record.nivelAcceso}
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
                      <Data label="Cargo" value={record.cargo} />
                      <Data label="Identificación" value={record.identificacion || "Sin registro"} />
                      <Data label="MFA" value={record.mfaActivo} />
                      <Data label="Firma electrónica" value={record.requiereFirmaElectronica} />
                      <Data label="Aprobado por" value={record.aprobadoPor} />
                      <Data label="Fecha aprobación" value={record.fechaAprobacion || "Sin registro"} />
                      <Data label="Próxima revisión" value={record.fechaProximaRevision} />
                      <Data label="Última revisión" value={record.ultimaRevision || "Sin registro"} />
                      <Data label="Resultado revisión" value={record.revisionAcceso} />
                      <Data label="Conflicto segregación" value={record.conflictoSegregacion} />
                      <Data label="Evidencia" value={record.evidencia || "Sin registro"} />
                    </div>

                    <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300">
                      <p><span className="font-bold text-slate-100">Módulos autorizados: </span>{record.modulosAutorizados}</p>
                      <p className="mt-2"><span className="font-bold text-slate-100">Justificación: </span>{record.motivoAcceso}</p>

                      {record.desviacionAsociada && (
                        <p className="mt-2"><span className="font-bold text-slate-100">Desviación: </span>{record.desviacionAsociada}</p>
                      )}

                      {record.accionCorrectiva && (
                        <p className="mt-2"><span className="font-bold text-slate-100">CAPA: </span>{record.accionCorrectiva}</p>
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
    value === "Activo" || value === "Activo temporal"
      ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
      : value === "Pendiente aprobación" || value === "Pendiente revisión QA"
      ? "border-amber-400/40 bg-amber-500/10 text-amber-200"
      : "border-red-400/40 bg-red-500/10 text-red-200";

  return <span className={`rounded-full border px-3 py-1 text-xs font-bold ${className}`}>{value || "Sin estado"}</span>;
}
