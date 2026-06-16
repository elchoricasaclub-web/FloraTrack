"use client";

import { useEffect, useMemo, useState } from "react";

type NotificationRecord = {
  id: string;
  codigoNotificacion: string;
  fechaCreacion: string;
  horaCreacion: string;
  empresa: string;
  sede: string;
  moduloOrigen: string;
  tipoAlerta: string;
  prioridad: string;
  titulo: string;
  descripcion: string;
  eventoReferencia: string;
  fechaObjetivo: string;
  responsable: string;
  areaResponsable: string;
  canalNotificacion: string;
  requiereEscalamiento: string;
  escaladoA: string;
  estadoNotificacion: string;
  decisionQA: string;
  requiereCAPA: string;
  desviacionAsociada: string;
  accionCorrectiva: string;
  evidencia: string;
  observaciones: string;
  creadoEn: string;
  actualizadoEn: string;
};

type FieldConfig = {
  key: keyof NotificationRecord;
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

const STORAGE_KEY = "floratrack_notificaciones_alertas_v1";

const emptyForm: NotificationRecord = {
  id: "",
  codigoNotificacion: "",
  fechaCreacion: "",
  horaCreacion: "",
  empresa: "",
  sede: "",
  moduloOrigen: "",
  tipoAlerta: "",
  prioridad: "",
  titulo: "",
  descripcion: "",
  eventoReferencia: "",
  fechaObjetivo: "",
  responsable: "",
  areaResponsable: "",
  canalNotificacion: "",
  requiereEscalamiento: "",
  escaladoA: "",
  estadoNotificacion: "",
  decisionQA: "",
  requiereCAPA: "",
  desviacionAsociada: "",
  accionCorrectiva: "",
  evidencia: "",
  observaciones: "",
  creadoEn: "",
  actualizadoEn: "",
};

const requiredFields: Array<keyof NotificationRecord> = [
  "codigoNotificacion",
  "fechaCreacion",
  "horaCreacion",
  "empresa",
  "sede",
  "moduloOrigen",
  "tipoAlerta",
  "prioridad",
  "titulo",
  "descripcion",
  "eventoReferencia",
  "fechaObjetivo",
  "responsable",
  "areaResponsable",
  "canalNotificacion",
  "requiereEscalamiento",
  "estadoNotificacion",
  "decisionQA",
  "requiereCAPA",
];

const fieldLabels: Record<keyof NotificationRecord, string> = {
  id: "ID",
  codigoNotificacion: "Código de notificación",
  fechaCreacion: "Fecha de creación",
  horaCreacion: "Hora de creación",
  empresa: "Empresa",
  sede: "Sede / predio",
  moduloOrigen: "Módulo de origen",
  tipoAlerta: "Tipo de alerta",
  prioridad: "Prioridad",
  titulo: "Título",
  descripcion: "Descripción",
  eventoReferencia: "Evento / referencia",
  fechaObjetivo: "Fecha objetivo",
  responsable: "Responsable",
  areaResponsable: "Área responsable",
  canalNotificacion: "Canal de notificación",
  requiereEscalamiento: "Requiere escalamiento",
  escaladoA: "Escalado a",
  estadoNotificacion: "Estado de notificación",
  decisionQA: "Decisión QA",
  requiereCAPA: "Requiere CAPA",
  desviacionAsociada: "Desviación asociada",
  accionCorrectiva: "Acción correctiva / CAPA",
  evidencia: "Evidencia",
  observaciones: "Observaciones",
  creadoEn: "Creado en",
  actualizadoEn: "Actualizado en",
};

const fields: FieldConfig[] = [
  { key: "codigoNotificacion", label: "Código de notificación *", placeholder: "NOT-2026-001" },
  { key: "fechaCreacion", label: "Fecha de creación *", type: "date" },
  { key: "horaCreacion", label: "Hora de creación *", type: "time" },
  { key: "empresa", label: "Empresa *", placeholder: "Growlifecol S.A.S." },
  { key: "sede", label: "Sede / predio *", placeholder: "Sede principal" },
  {
    key: "moduloOrigen",
    label: "Módulo de origen *",
    kind: "select",
    options: [
      "Dashboard",
      "Empresas",
      "GIS",
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
      "Usuarios / Accesos",
      "Reportes",
      "Regulatorio",
    ],
  },
  {
    key: "tipoAlerta",
    label: "Tipo de alerta *",
    kind: "select",
    options: [
      "Vencimiento próximo",
      "Vencimiento vencido",
      "CAPA pendiente",
      "CAPA vencida",
      "Auditoría programada",
      "Auditoría vencida",
      "Documento por revisar",
      "Documento vencido",
      "Calibración próxima",
      "Calibración vencida",
      "Entrenamiento pendiente",
      "Licencia próxima a vencer",
      "Proveedor pendiente",
      "Recall crítico",
      "Desviación crítica",
      "Revisión de acceso",
      "Reporte pendiente QA",
      "Alerta informativa",
    ],
  },
  {
    key: "prioridad",
    label: "Prioridad *",
    kind: "select",
    options: ["Baja", "Media", "Alta", "Crítica"],
  },
  { key: "titulo", label: "Título *", placeholder: "Calibración próxima a vencer / CAPA vencida / Documento por revisar" },
  {
    key: "descripcion",
    label: "Descripción *",
    kind: "textarea",
    placeholder: "Describe la alerta, impacto, requisito, módulo afectado y acción esperada.",
  },
  { key: "eventoReferencia", label: "Evento / referencia *", placeholder: "EQ-2026-001 / CAPA-001 / SOP-QA-001 / AUD-2026-001" },
  { key: "fechaObjetivo", label: "Fecha objetivo *", type: "date" },
  { key: "responsable", label: "Responsable *", placeholder: "Responsable asignado para atender la alerta" },
  {
    key: "areaResponsable",
    label: "Área responsable *",
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
      "Proveedores",
      "Administración",
    ],
  },
  {
    key: "canalNotificacion",
    label: "Canal de notificación *",
    kind: "select",
    options: ["Sistema FloraTrack", "Correo", "WhatsApp", "Reunión QA", "Acta", "Llamada", "Tablero ejecutivo", "Otro"],
  },
  {
    key: "requiereEscalamiento",
    label: "Requiere escalamiento *",
    kind: "select",
    options: ["Sí", "No"],
  },
  { key: "escaladoA", label: "Escalado a", placeholder: "Dirección técnica / QA Manager / Gerencia / Regulatorio" },
  {
    key: "estadoNotificacion",
    label: "Estado de notificación *",
    kind: "select",
    options: [
      "Abierta",
      "Asignada",
      "En gestión",
      "Pendiente QA",
      "Atendida",
      "Cerrada",
      "Vencida",
      "Escalada",
      "Cancelada por QA",
    ],
  },
  {
    key: "decisionQA",
    label: "Decisión QA *",
    kind: "select",
    options: [
      "Pendiente QA",
      "Aceptada QA",
      "Cerrada QA",
      "Rechazada QA",
      "Requiere CAPA",
      "Requiere desviación",
      "Requiere auditoría",
      "No aplica",
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
    key: "accionCorrectiva",
    label: "Acción correctiva / CAPA",
    kind: "textarea",
    placeholder: "Obligatoria si es prioridad alta/crítica, alerta vencida, CAPA, desviación o rechazo QA.",
  },
  { key: "evidencia", label: "Evidencia / soporte", placeholder: "Captura, correo, acta, PDF, registro actualizado, evidencia de cierre..." },
  {
    key: "observaciones",
    label: "Observaciones",
    kind: "textarea",
    placeholder: "Notas QA, seguimiento, restricciones, decisiones, escalamiento o cierre.",
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
  return `NOT-${Date.now()}-${Math.random().toString(16).slice(2)}`;
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

function loadRecords(): NotificationRecord[] {
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

function saveRecords(records: NotificationRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export default function NotificacionesPage() {
  const [records, setRecords] = useState<NotificationRecord[]>([]);
  const [form, setForm] = useState<NotificationRecord>(emptyForm);
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

  function updateField(field: keyof NotificationRecord, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function needsCapa(): boolean {
    return (
      form.requiereCAPA === "Sí" ||
      ["Alta", "Crítica"].includes(form.prioridad) ||
      ["Vencimiento vencido", "CAPA vencida", "Auditoría vencida", "Documento vencido", "Calibración vencida", "Recall crítico", "Desviación crítica"].includes(form.tipoAlerta) ||
      ["Vencida", "Escalada"].includes(form.estadoNotificacion) ||
      ["Rechazada QA", "Requiere CAPA", "Requiere desviación", "Requiere auditoría"].includes(form.decisionQA)
    );
  }

  function validateForm(): string[] {
    const errors = requiredFields
      .filter((field) => isInvalid(form[field]))
      .map((field) => fieldLabels[field]);

    if (form.fechaObjetivo && form.fechaCreacion && isDateBefore(form.fechaObjetivo, form.fechaCreacion)) {
      errors.push("La fecha objetivo no puede ser anterior a la fecha de creación");
    }

    if (form.requiereEscalamiento === "Sí" && isInvalid(form.escaladoA)) {
      errors.push("El campo Escalado a es obligatorio cuando requiere escalamiento");
    }

    if (["Atendida", "Cerrada", "Cancelada por QA", "Cerrada QA", "Aceptada QA"].includes(form.estadoNotificacion) && isInvalid(form.evidencia)) {
      errors.push("La evidencia es obligatoria para cerrar, atender o cancelar una notificación");
    }

    if (["Aceptada QA", "Cerrada QA", "Rechazada QA"].includes(form.decisionQA) && isInvalid(form.evidencia)) {
      errors.push("La evidencia es obligatoria para decisiones QA formales");
    }

    if (needsCapa() && isInvalid(form.desviacionAsociada)) {
      errors.push("La desviación asociada es obligatoria para prioridad alta/crítica, alerta vencida, escalamiento, CAPA o rechazo QA");
    }

    if (needsCapa() && isInvalid(form.accionCorrectiva)) {
      errors.push("La acción correctiva / CAPA es obligatoria para prioridad alta/crítica, alerta vencida, escalamiento, CAPA o rechazo QA");
    }

    return Array.from(new Set(errors));
  }

  function fieldHasError(field: keyof NotificationRecord): boolean {
    if (!submitAttempted) return false;

    if (requiredFields.includes(field) && isInvalid(form[field])) return true;
    if (field === "fechaObjetivo" && form.fechaObjetivo && form.fechaCreacion && isDateBefore(form.fechaObjetivo, form.fechaCreacion)) return true;
    if (field === "escaladoA" && form.requiereEscalamiento === "Sí" && isInvalid(form.escaladoA)) return true;
    if (field === "evidencia" && ["Atendida", "Cerrada", "Cancelada por QA", "Aceptada QA", "Cerrada QA", "Rechazada QA"].includes(form.estadoNotificacion) && isInvalid(form.evidencia)) return true;
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
      showCloud("No se guardó la notificación. Completa la información obligatoria.", errors, "warning");
      return;
    }

    const timestamp = nowIso();

    const payload: NotificationRecord = {
      ...form,
      codigoNotificacion: clean(form.codigoNotificacion),
      fechaCreacion: clean(form.fechaCreacion),
      horaCreacion: clean(form.horaCreacion),
      empresa: clean(form.empresa),
      sede: clean(form.sede),
      moduloOrigen: clean(form.moduloOrigen),
      tipoAlerta: clean(form.tipoAlerta),
      prioridad: clean(form.prioridad),
      titulo: clean(form.titulo),
      descripcion: clean(form.descripcion),
      eventoReferencia: clean(form.eventoReferencia),
      fechaObjetivo: clean(form.fechaObjetivo),
      responsable: clean(form.responsable),
      areaResponsable: clean(form.areaResponsable),
      canalNotificacion: clean(form.canalNotificacion),
      requiereEscalamiento: clean(form.requiereEscalamiento),
      escaladoA: clean(form.escaladoA),
      estadoNotificacion: clean(form.estadoNotificacion),
      decisionQA: clean(form.decisionQA),
      requiereCAPA: clean(form.requiereCAPA),
      desviacionAsociada: clean(form.desviacionAsociada),
      accionCorrectiva: clean(form.accionCorrectiva),
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
      editingId ? "Notificación actualizada correctamente." : "Notificación registrada correctamente con control GACP/GMP.",
      [],
      "success"
    );
  }

  function handleEdit(record: NotificationRecord) {
    setForm(record);
    setEditingId(record.id);
    setSubmitAttempted(false);
    showCloud("Notificación cargada para edición. Verifica antes de actualizar.", [], "success");
  }

  function handleDelete(id: string) {
    const confirmed = window.confirm("¿Confirmas eliminar esta notificación? En ambiente GMP real debería manejarse como cierre o anulación auditada.");
    if (!confirmed) return;

    const nextRecords = records.filter((record) => record.id !== id);
    setRecords(nextRecords);
    saveRecords(nextRecords);
    showCloud("Notificación eliminada del almacenamiento local.", [], "success");
  }

  function exportJson() {
    if (records.length === 0) {
      showCloud("No hay notificaciones para exportar.", [], "warning");
      return;
    }

    const blob = new Blob([JSON.stringify(records, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `floratrack-notificaciones-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);

    showCloud("Archivo JSON de notificaciones exportado correctamente.", [], "success");
  }

  const filteredRecords = useMemo(() => {
    const term = clean(search).toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        !term ||
        [
          record.codigoNotificacion,
          record.moduloOrigen,
          record.tipoAlerta,
          record.prioridad,
          record.titulo,
          record.eventoReferencia,
          record.responsable,
          record.areaResponsable,
          record.estadoNotificacion,
          record.decisionQA,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

      const matchesEstado = filterEstado === "Todos" || record.estadoNotificacion === filterEstado;

      return matchesSearch && matchesEstado;
    });
  }, [records, search, filterEstado]);

  const dashboard = useMemo(() => {
    return {
      total: records.length,
      abiertas: records.filter((record) => ["Abierta", "Asignada", "En gestión", "Pendiente QA"].includes(record.estadoNotificacion)).length,
      vencidas: records.filter((record) => isPastDate(record.fechaObjetivo) && !["Cerrada", "Cancelada por QA"].includes(record.estadoNotificacion)).length,
      criticas: records.filter((record) => record.prioridad === "Crítica").length,
      capa: records.filter((record) => record.requiereCAPA === "Sí").length,
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
        <header className="rounded-3xl border border-amber-400/20 bg-slate-900/80 p-6 shadow-2xl shadow-amber-950/30">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-300">
                FloraTrack Enterprise Compliance Platform
              </p>

              <h1 className="mt-3 text-3xl font-black text-white md:text-5xl">
                Notificaciones, alertas y vencimientos
              </h1>

              <p className="mt-3 max-w-5xl text-sm leading-6 text-slate-300 md:text-base">
                Gestión de alertas, vencimientos, CAPA pendientes, auditorías,
                calibraciones, documentos, licencias, responsables, escalamiento,
                evidencia, desviaciones y cierre QA.
              </p>
            </div>

            <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 px-5 py-4 text-sm text-amber-100">
              <p className="font-bold">Alertas activas</p>
              <p className="mt-1 text-amber-200">Vencimientos · CAPA · QA · Escalamiento</p>
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
          <Metric title="Alertas" value={dashboard.total} />
          <Metric title="Abiertas" value={dashboard.abiertas} tone="amber" />
          <Metric title="Vencidas" value={dashboard.vencidas} tone="red" />
          <Metric title="Críticas" value={dashboard.criticas} tone="red" />
          <Metric title="CAPA" value={dashboard.capa} tone="sky" />
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
                <h2 className="text-2xl font-black text-white">{editingId ? "Editar notificación" : "Nueva notificación"}</h2>
                <p className="mt-1 text-sm text-slate-400">Ninguna notificación puede guardarse vacía o incompleta.</p>
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
                  : "border-slate-700 bg-slate-950 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/40";

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

                      {hasError && <p className="mt-1 text-xs font-bold text-red-300">Campo obligatorio o condición de alerta requerida.</p>}
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
              <button type="button" onClick={handleSave} className="rounded-2xl bg-amber-500 px-6 py-3 text-sm font-black text-slate-950 shadow-lg shadow-amber-950/50 transition hover:bg-amber-400">
                {editingId ? "Actualizar notificación" : "Guardar notificación"}
              </button>

              <button type="button" onClick={resetForm} className="rounded-2xl border border-slate-600 px-6 py-3 text-sm font-bold text-slate-200 transition hover:bg-slate-800">
                Limpiar formulario
              </button>
            </div>
          </form>

          <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">Centro de notificaciones</h2>
                <p className="mt-1 text-sm text-slate-400">Consulta, filtra, edita y exporta alertas y vencimientos.</p>
              </div>

              <button type="button" onClick={exportJson} className="rounded-2xl border border-amber-400/50 px-5 py-3 text-sm font-bold text-amber-200 transition hover:bg-amber-500/10">
                Exportar JSON
              </button>
            </div>

            <div className="mb-5 grid gap-3 md:grid-cols-[1fr_250px]">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-amber-400/40 transition placeholder:text-slate-600 focus:border-amber-400 focus:ring-4"
                placeholder="Buscar por alerta, módulo, responsable, referencia..."
              />

              <select
                value={filterEstado}
                onChange={(event) => setFilterEstado(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-amber-400/40 transition focus:border-amber-400 focus:ring-4"
              >
                <option>Todos</option>
                <option>Abierta</option>
                <option>Asignada</option>
                <option>En gestión</option>
                <option>Pendiente QA</option>
                <option>Atendida</option>
                <option>Cerrada</option>
                <option>Vencida</option>
                <option>Escalada</option>
                <option>Cancelada por QA</option>
              </select>
            </div>

            <div className="max-h-[780px] space-y-4 overflow-auto pr-2">
              {filteredRecords.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center text-sm text-slate-400">
                  No hay notificaciones registradas. Crea la primera alerta con datos completos.
                </div>
              ) : (
                filteredRecords.map((record) => (
                  <article key={record.id} className="rounded-2xl border border-slate-700 bg-slate-950 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-white">{record.codigoNotificacion} · {record.titulo}</h3>
                          <StatusPill value={record.estadoNotificacion} />
                          <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-200">
                            {record.prioridad}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-400">
                          {record.moduloOrigen} · {record.tipoAlerta} · Objetivo {record.fechaObjetivo}
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
                      <Data label="Referencia" value={record.eventoReferencia} />
                      <Data label="Responsable" value={record.responsable} />
                      <Data label="Área" value={record.areaResponsable} />
                      <Data label="Canal" value={record.canalNotificacion} />
                      <Data label="Escalamiento" value={record.requiereEscalamiento} />
                      <Data label="Escalado a" value={record.escaladoA || "Sin registro"} />
                      <Data label="Decisión QA" value={record.decisionQA} />
                      <Data label="Requiere CAPA" value={record.requiereCAPA} />
                      <Data label="Evidencia" value={record.evidencia || "Sin registro"} />
                    </div>

                    <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300">
                      <p><span className="font-bold text-slate-100">Descripción: </span>{record.descripcion}</p>

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
    value === "Cerrada" || value === "Atendida"
      ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
      : value === "Abierta" || value === "Asignada" || value === "Pendiente QA"
      ? "border-amber-400/40 bg-amber-500/10 text-amber-200"
      : "border-red-400/40 bg-red-500/10 text-red-200";

  return <span className={`rounded-full border px-3 py-1 text-xs font-bold ${className}`}>{value || "Sin estado"}</span>;
}
