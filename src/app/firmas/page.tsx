"use client";

import { useEffect, useMemo, useState } from "react";

type SignatureRecord = {
  id: string;
  codigoFirma: string;
  fechaFirma: string;
  horaFirma: string;
  empresa: string;
  sede: string;
  moduloOrigen: string;
  registroAsociado: string;
  firmante: string;
  correoFirmante: string;
  cargoFirmante: string;
  area: string;
  tipoFirma: string;
  razonFirma: string;
  significadoFirma: string;
  identidadVerificada: string;
  mfaVerificado: string;
  politicaFirma: string;
  hashRegistro: string;
  estadoFirma: string;
  requiereQA: string;
  decisionQA: string;
  evidencia: string;
  desviacionAsociada: string;
  capa: string;
  observaciones: string;
  creadoEn: string;
  actualizadoEn: string;
};

type FieldConfig = {
  key: keyof SignatureRecord;
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

const STORAGE_KEY = "floratrack_firmas_electronicas_v1";

const emptyForm: SignatureRecord = {
  id: "",
  codigoFirma: "",
  fechaFirma: "",
  horaFirma: "",
  empresa: "",
  sede: "",
  moduloOrigen: "",
  registroAsociado: "",
  firmante: "",
  correoFirmante: "",
  cargoFirmante: "",
  area: "",
  tipoFirma: "",
  razonFirma: "",
  significadoFirma: "",
  identidadVerificada: "",
  mfaVerificado: "",
  politicaFirma: "",
  hashRegistro: "",
  estadoFirma: "",
  requiereQA: "",
  decisionQA: "",
  evidencia: "",
  desviacionAsociada: "",
  capa: "",
  observaciones: "",
  creadoEn: "",
  actualizadoEn: "",
};

const requiredFields: Array<keyof SignatureRecord> = [
  "codigoFirma",
  "fechaFirma",
  "horaFirma",
  "empresa",
  "sede",
  "moduloOrigen",
  "registroAsociado",
  "firmante",
  "correoFirmante",
  "cargoFirmante",
  "area",
  "tipoFirma",
  "razonFirma",
  "significadoFirma",
  "identidadVerificada",
  "mfaVerificado",
  "politicaFirma",
  "hashRegistro",
  "estadoFirma",
  "requiereQA",
  "decisionQA",
];

const fieldLabels: Record<keyof SignatureRecord, string> = {
  id: "ID",
  codigoFirma: "Código de firma",
  fechaFirma: "Fecha de firma",
  horaFirma: "Hora de firma",
  empresa: "Empresa",
  sede: "Sede / predio",
  moduloOrigen: "Módulo de origen",
  registroAsociado: "Registro asociado",
  firmante: "Firmante",
  correoFirmante: "Correo del firmante",
  cargoFirmante: "Cargo del firmante",
  area: "Área",
  tipoFirma: "Tipo de firma",
  razonFirma: "Razón de firma",
  significadoFirma: "Significado de firma",
  identidadVerificada: "Identidad verificada",
  mfaVerificado: "MFA verificado",
  politicaFirma: "Política de firma",
  hashRegistro: "Hash del registro",
  estadoFirma: "Estado de firma",
  requiereQA: "Requiere QA",
  decisionQA: "Decisión QA",
  evidencia: "Evidencia",
  desviacionAsociada: "Desviación asociada",
  capa: "CAPA",
  observaciones: "Observaciones",
  creadoEn: "Creado en",
  actualizadoEn: "Actualizado en",
};

const fields: FieldConfig[] = [
  { key: "codigoFirma", label: "Código de firma *", placeholder: "SIG-2026-001" },
  { key: "fechaFirma", label: "Fecha de firma *", type: "date" },
  { key: "horaFirma", label: "Hora de firma *", type: "time" },
  { key: "empresa", label: "Empresa *", placeholder: "Growlifecol S.A.S." },
  { key: "sede", label: "Sede / predio *", placeholder: "Sede principal" },
  {
    key: "moduloOrigen",
    label: "Módulo de origen *",
    kind: "select",
    options: [
      "Recepción",
      "Inventario",
      "Calidad QA",
      "Desviaciones / CAPA",
      "Auditorías",
      "Documentos",
      "Entrenamiento",
      "Equipos",
      "Proveedores",
      "Saneamiento",
      "Plagas / MIP",
      "Residuos",
      "Recall",
      "Retención",
      "Usuarios",
      "Empresas",
      "GIS",
      "Reportes",
      "Notificaciones",
      "CSV / DataOps",
      "Regulatorio",
      "Otro",
    ],
  },
  { key: "registroAsociado", label: "Registro asociado *", placeholder: "DOC-2026-001 / CAPA-001 / QA-001 / REG-001" },
  { key: "firmante", label: "Firmante *", placeholder: "Nombre completo del usuario que firma" },
  { key: "correoFirmante", label: "Correo del firmante *", type: "email", placeholder: "usuario@empresa.com" },
  { key: "cargoFirmante", label: "Cargo del firmante *", placeholder: "Responsable QA / Director técnico / Auditor" },
  {
    key: "area",
    label: "Área *",
    kind: "select",
    options: [
      "Dirección técnica",
      "QA",
      "QC",
      "Regulatorio",
      "Recepción",
      "Inventario",
      "Cultivo",
      "Cosecha",
      "Postcosecha",
      "Extracción",
      "Mantenimiento",
      "Saneamiento",
      "Almacén",
      "Documentación",
      "Entrenamiento",
      "Administración",
    ],
  },
  {
    key: "tipoFirma",
    label: "Tipo de firma *",
    kind: "select",
    options: [
      "Revisión",
      "Aprobación QA",
      "Liberación QA",
      "Cierre QA",
      "Autorización",
      "Rechazo",
      "Anulación",
      "Verificación",
      "Firma de entrenamiento",
      "Firma documental",
      "Firma regulatoria",
      "Firma de auditoría",
    ],
  },
  {
    key: "razonFirma",
    label: "Razón de firma *",
    kind: "textarea",
    placeholder: "Describe por qué se firma este registro, decisión, revisión, liberación, cierre o rechazo.",
  },
  {
    key: "significadoFirma",
    label: "Significado de firma *",
    kind: "select",
    options: [
      "He revisado y apruebo",
      "He revisado con observaciones",
      "Autorizo liberación",
      "Autorizo cierre",
      "Rechazo el registro",
      "Anulo el registro",
      "Confirmo capacitación",
      "Confirmo ejecución",
      "Confirmo revisión QA",
      "Confirmo envío regulatorio",
    ],
  },
  {
    key: "identidadVerificada",
    label: "Identidad verificada *",
    kind: "select",
    options: ["Sí", "No"],
  },
  {
    key: "mfaVerificado",
    label: "MFA verificado *",
    kind: "select",
    options: ["Sí", "No"],
  },
  {
    key: "politicaFirma",
    label: "Política de firma *",
    kind: "select",
    options: [
      "Firma electrónica simple",
      "Firma electrónica avanzada",
      "Firma QA obligatoria",
      "Firma crítica GMP",
      "Firma regulatoria",
      "Firma de auditoría",
      "Firma de cierre CAPA",
      "Firma documental controlada",
    ],
  },
  { key: "hashRegistro", label: "Hash del registro *", placeholder: "SHA256-REGISTRO-SIMULADO-2026-001" },
  {
    key: "estadoFirma",
    label: "Estado de firma *",
    kind: "select",
    options: [
      "Pendiente",
      "Firmado",
      "Aprobado",
      "Aprobado con observación",
      "Rechazado",
      "Anulado",
      "Fallido",
      "Expirado",
      "Cierre firmado",
    ],
  },
  {
    key: "requiereQA",
    label: "Requiere QA *",
    kind: "select",
    options: ["Sí", "No"],
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
      "Requiere corrección",
      "Requiere CAPA",
      "Cierre aprobado QA",
      "No aplica",
    ],
  },
  { key: "evidencia", label: "Evidencia / soporte", placeholder: "Log, captura, token, acta, PDF, registro audit trail, QR..." },
  { key: "desviacionAsociada", label: "Desviación asociada", placeholder: "DEV-2026-001 / CAPA-001" },
  {
    key: "capa",
    label: "CAPA",
    kind: "textarea",
    placeholder: "Obligatoria si la firma es rechazada, anulada, fallida, expirada o requiere corrección.",
  },
  {
    key: "observaciones",
    label: "Observaciones",
    kind: "textarea",
    placeholder: "Notas QA, contexto de firma, restricciones, evidencia, auditoría o validación.",
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
  return `SIG-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function loadRecords(): SignatureRecord[] {
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

function saveRecords(records: SignatureRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export default function FirmasPage() {
  const [records, setRecords] = useState<SignatureRecord[]>([]);
  const [form, setForm] = useState<SignatureRecord>(emptyForm);
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

  function updateField(field: keyof SignatureRecord, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function isCriticalSignature(): boolean {
    return (
      ["Aprobación QA", "Liberación QA", "Cierre QA", "Autorización", "Firma regulatoria", "Firma de cierre CAPA"].includes(form.tipoFirma) ||
      ["Firma electrónica avanzada", "Firma QA obligatoria", "Firma crítica GMP", "Firma regulatoria"].includes(form.politicaFirma)
    );
  }

  function needsCapa(): boolean {
    return (
      ["Rechazado", "Anulado", "Fallido", "Expirado"].includes(form.estadoFirma) ||
      ["Rechazado QA", "Requiere corrección", "Requiere CAPA"].includes(form.decisionQA)
    );
  }

  function validateForm(): string[] {
    const errors = requiredFields
      .filter((field) => isInvalid(form[field]))
      .map((field) => fieldLabels[field]);

    if (!isInvalid(form.correoFirmante) && !isValidEmail(form.correoFirmante)) {
      errors.push("El correo del firmante debe tener un formato válido");
    }

    if (form.identidadVerificada !== "Sí") {
      errors.push("La identidad debe estar verificada para registrar una firma electrónica");
    }

    if (isCriticalSignature() && form.mfaVerificado !== "Sí") {
      errors.push("Las firmas críticas GMP, QA o regulatorias requieren MFA verificado");
    }

    if (form.requiereQA === "Sí" && form.decisionQA === "No aplica") {
      errors.push("Si requiere QA, la decisión QA no puede ser No aplica");
    }

    if (["Firmado", "Aprobado", "Aprobado con observación", "Cierre firmado"].includes(form.estadoFirma) && isInvalid(form.evidencia)) {
      errors.push("La evidencia es obligatoria para firmas completadas o aprobadas");
    }

    if (["Aprobado QA", "Aprobado con observación QA", "Rechazado QA", "Cierre aprobado QA"].includes(form.decisionQA) && isInvalid(form.evidencia)) {
      errors.push("La evidencia es obligatoria para decisiones QA formales");
    }

    if (needsCapa() && isInvalid(form.desviacionAsociada)) {
      errors.push("La desviación asociada es obligatoria para firmas rechazadas, anuladas, fallidas, expiradas o con corrección requerida");
    }

    if (needsCapa() && isInvalid(form.capa)) {
      errors.push("La CAPA es obligatoria para firmas rechazadas, anuladas, fallidas, expiradas o con corrección requerida");
    }

    return Array.from(new Set(errors));
  }

  function fieldHasError(field: keyof SignatureRecord): boolean {
    if (!submitAttempted) return false;

    if (requiredFields.includes(field) && isInvalid(form[field])) return true;
    if (field === "correoFirmante" && !isInvalid(form.correoFirmante) && !isValidEmail(form.correoFirmante)) return true;
    if (field === "identidadVerificada" && form.identidadVerificada !== "Sí") return true;
    if (field === "mfaVerificado" && isCriticalSignature() && form.mfaVerificado !== "Sí") return true;
    if (field === "decisionQA" && form.requiereQA === "Sí" && form.decisionQA === "No aplica") return true;
    if (field === "evidencia" && ["Firmado", "Aprobado", "Aprobado con observación", "Cierre firmado"].includes(form.estadoFirma) && isInvalid(form.evidencia)) return true;
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
      showCloud("No se guardó la firma electrónica. Completa la información obligatoria.", errors, "warning");
      return;
    }

    const timestamp = nowIso();

    const payload: SignatureRecord = {
      ...form,
      codigoFirma: clean(form.codigoFirma),
      fechaFirma: clean(form.fechaFirma),
      horaFirma: clean(form.horaFirma),
      empresa: clean(form.empresa),
      sede: clean(form.sede),
      moduloOrigen: clean(form.moduloOrigen),
      registroAsociado: clean(form.registroAsociado),
      firmante: clean(form.firmante),
      correoFirmante: clean(form.correoFirmante).toLowerCase(),
      cargoFirmante: clean(form.cargoFirmante),
      area: clean(form.area),
      tipoFirma: clean(form.tipoFirma),
      razonFirma: clean(form.razonFirma),
      significadoFirma: clean(form.significadoFirma),
      identidadVerificada: clean(form.identidadVerificada),
      mfaVerificado: clean(form.mfaVerificado),
      politicaFirma: clean(form.politicaFirma),
      hashRegistro: clean(form.hashRegistro),
      estadoFirma: clean(form.estadoFirma),
      requiereQA: clean(form.requiereQA),
      decisionQA: clean(form.decisionQA),
      evidencia: clean(form.evidencia),
      desviacionAsociada: clean(form.desviacionAsociada),
      capa: clean(form.capa),
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
      editingId ? "Firma electrónica actualizada correctamente." : "Firma electrónica registrada correctamente con control GMP.",
      [],
      "success"
    );
  }

  function handleEdit(record: SignatureRecord) {
    setForm(record);
    setEditingId(record.id);
    setSubmitAttempted(false);
    showCloud("Firma cargada para edición. Verifica antes de actualizar.", [], "success");
  }

  function handleDelete(id: string) {
    const confirmed = window.confirm("¿Confirmas eliminar esta firma? En ambiente GMP real debería manejarse como anulación auditada.");
    if (!confirmed) return;

    const nextRecords = records.filter((record) => record.id !== id);
    setRecords(nextRecords);
    saveRecords(nextRecords);
    showCloud("Firma eliminada del almacenamiento local.", [], "success");
  }

  function exportJson() {
    if (records.length === 0) {
      showCloud("No hay firmas para exportar.", [], "warning");
      return;
    }

    const blob = new Blob([JSON.stringify(records, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `floratrack-firmas-electronicas-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);

    showCloud("Archivo JSON de firmas electrónicas exportado correctamente.", [], "success");
  }

  const filteredRecords = useMemo(() => {
    const term = clean(search).toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        !term ||
        [
          record.codigoFirma,
          record.moduloOrigen,
          record.registroAsociado,
          record.firmante,
          record.correoFirmante,
          record.tipoFirma,
          record.estadoFirma,
          record.decisionQA,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

      const matchesEstado = filterEstado === "Todos" || record.estadoFirma === filterEstado;

      return matchesSearch && matchesEstado;
    });
  }, [records, search, filterEstado]);

  const dashboard = useMemo(() => {
    return {
      total: records.length,
      firmadas: records.filter((record) => ["Firmado", "Aprobado", "Cierre firmado"].includes(record.estadoFirma)).length,
      pendientes: records.filter((record) => record.estadoFirma === "Pendiente").length,
      rechazadas: records.filter((record) => ["Rechazado", "Anulado", "Fallido", "Expirado"].includes(record.estadoFirma)).length,
      qa: records.filter((record) => record.requiereQA === "Sí").length,
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
        <header className="rounded-3xl border border-indigo-400/20 bg-slate-900/80 p-6 shadow-2xl shadow-indigo-950/30">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-indigo-300">
                FloraTrack Enterprise Compliance Platform
              </p>

              <h1 className="mt-3 text-3xl font-black text-white md:text-5xl">
                Firmas electrónicas y registros electrónicos
              </h1>

              <p className="mt-3 max-w-5xl text-sm leading-6 text-slate-300 md:text-base">
                Control de firmas electrónicas, registro asociado, firmante, razón,
                significado, identidad, MFA, hash, política de firma, decisión QA,
                evidencia, desviaciones y CAPA.
              </p>
            </div>

            <div className="rounded-2xl border border-indigo-400/20 bg-indigo-500/10 px-5 py-4 text-sm text-indigo-100">
              <p className="font-bold">Firma electrónica activa</p>
              <p className="mt-1 text-indigo-200">Identidad · MFA · Hash · QA · Audit Trail</p>
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
          <Metric title="Firmas" value={dashboard.total} />
          <Metric title="Firmadas" value={dashboard.firmadas} tone="emerald" />
          <Metric title="Pendientes" value={dashboard.pendientes} tone="amber" />
          <Metric title="Rechazadas" value={dashboard.rechazadas} tone="red" />
          <Metric title="Requieren QA" value={dashboard.qa} tone="sky" />
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
                <h2 className="text-2xl font-black text-white">{editingId ? "Editar firma" : "Nueva firma electrónica"}</h2>
                <p className="mt-1 text-sm text-slate-400">Ninguna firma puede guardarse vacía o incompleta.</p>
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
                  : "border-slate-700 bg-slate-950 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/40";

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

                      {hasError && <p className="mt-1 text-xs font-bold text-red-300">Campo obligatorio o condición de firma requerida.</p>}
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
              <button type="button" onClick={handleSave} className="rounded-2xl bg-indigo-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-indigo-950/50 transition hover:bg-indigo-400">
                {editingId ? "Actualizar firma" : "Guardar firma"}
              </button>

              <button type="button" onClick={resetForm} className="rounded-2xl border border-slate-600 px-6 py-3 text-sm font-bold text-slate-200 transition hover:bg-slate-800">
                Limpiar formulario
              </button>
            </div>
          </form>

          <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">Registro maestro de firmas</h2>
                <p className="mt-1 text-sm text-slate-400">Consulta, filtra, edita y exporta firmas electrónicas.</p>
              </div>

              <button type="button" onClick={exportJson} className="rounded-2xl border border-indigo-400/50 px-5 py-3 text-sm font-bold text-indigo-200 transition hover:bg-indigo-500/10">
                Exportar JSON
              </button>
            </div>

            <div className="mb-5 grid gap-3 md:grid-cols-[1fr_250px]">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-indigo-400/40 transition placeholder:text-slate-600 focus:border-indigo-400 focus:ring-4"
                placeholder="Buscar por firma, módulo, registro, firmante, estado..."
              />

              <select
                value={filterEstado}
                onChange={(event) => setFilterEstado(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-indigo-400/40 transition focus:border-indigo-400 focus:ring-4"
              >
                <option>Todos</option>
                <option>Pendiente</option>
                <option>Firmado</option>
                <option>Aprobado</option>
                <option>Aprobado con observación</option>
                <option>Rechazado</option>
                <option>Anulado</option>
                <option>Fallido</option>
                <option>Expirado</option>
                <option>Cierre firmado</option>
              </select>
            </div>

            <div className="max-h-[780px] space-y-4 overflow-auto pr-2">
              {filteredRecords.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center text-sm text-slate-400">
                  No hay firmas registradas. Crea la primera firma con datos completos.
                </div>
              ) : (
                filteredRecords.map((record) => (
                  <article key={record.id} className="rounded-2xl border border-slate-700 bg-slate-950 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-white">{record.codigoFirma} · {record.firmante}</h3>
                          <StatusPill value={record.estadoFirma} />
                          <span className="rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-200">
                            {record.tipoFirma}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-400">
                          {record.moduloOrigen} · {record.registroAsociado} · {record.correoFirmante}
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
                      <Data label="Cargo" value={record.cargoFirmante} />
                      <Data label="Área" value={record.area} />
                      <Data label="Significado" value={record.significadoFirma} />
                      <Data label="Identidad" value={record.identidadVerificada} />
                      <Data label="MFA" value={record.mfaVerificado} />
                      <Data label="Política" value={record.politicaFirma} />
                      <Data label="Hash" value={record.hashRegistro} />
                      <Data label="Requiere QA" value={record.requiereQA} />
                      <Data label="Decisión QA" value={record.decisionQA} />
                      <Data label="Evidencia" value={record.evidencia || "Sin registro"} />
                    </div>

                    <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300">
                      <p><span className="font-bold text-slate-100">Razón de firma: </span>{record.razonFirma}</p>

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
    value === "Firmado" || value === "Aprobado" || value === "Cierre firmado"
      ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
      : value === "Pendiente" || value === "Aprobado con observación"
      ? "border-amber-400/40 bg-amber-500/10 text-amber-200"
      : "border-red-400/40 bg-red-500/10 text-red-200";

  return <span className={`rounded-full border px-3 py-1 text-xs font-bold ${className}`}>{value || "Sin estado"}</span>;
}
