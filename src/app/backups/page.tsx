"use client";

import { useEffect, useMemo, useState } from "react";

type BackupRecord = {
  id: string;
  codigoBackup: string;
  fechaOperacion: string;
  horaOperacion: string;
  empresa: string;
  sede: string;
  ambiente: string;
  tipoOperacion: string;
  alcanceDatos: string;
  origenDatos: string;
  destinoRespaldo: string;
  ubicacionRespaldo: string;
  responsableEjecucion: string;
  responsableValidacion: string;
  frecuenciaBackup: string;
  tamanoArchivoMb: string;
  hashChecksum: string;
  cifradoActivo: string;
  retencionDias: string;
  integridadVerificada: string;
  restoreProbado: string;
  resultadoRestore: string;
  fechaProximaPrueba: string;
  estadoProceso: string;
  decisionQA: string;
  desviacionAsociada: string;
  capa: string;
  evidencia: string;
  observaciones: string;
  creadoEn: string;
  actualizadoEn: string;
};

type FieldConfig = {
  key: keyof BackupRecord;
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

const STORAGE_KEY = "floratrack_backups_restore_integridad_v1";

const emptyForm: BackupRecord = {
  id: "",
  codigoBackup: "",
  fechaOperacion: "",
  horaOperacion: "",
  empresa: "",
  sede: "",
  ambiente: "",
  tipoOperacion: "",
  alcanceDatos: "",
  origenDatos: "",
  destinoRespaldo: "",
  ubicacionRespaldo: "",
  responsableEjecucion: "",
  responsableValidacion: "",
  frecuenciaBackup: "",
  tamanoArchivoMb: "",
  hashChecksum: "",
  cifradoActivo: "",
  retencionDias: "",
  integridadVerificada: "",
  restoreProbado: "",
  resultadoRestore: "",
  fechaProximaPrueba: "",
  estadoProceso: "",
  decisionQA: "",
  desviacionAsociada: "",
  capa: "",
  evidencia: "",
  observaciones: "",
  creadoEn: "",
  actualizadoEn: "",
};

const requiredFields: Array<keyof BackupRecord> = [
  "codigoBackup",
  "fechaOperacion",
  "horaOperacion",
  "empresa",
  "sede",
  "ambiente",
  "tipoOperacion",
  "alcanceDatos",
  "origenDatos",
  "destinoRespaldo",
  "ubicacionRespaldo",
  "responsableEjecucion",
  "responsableValidacion",
  "frecuenciaBackup",
  "hashChecksum",
  "cifradoActivo",
  "retencionDias",
  "integridadVerificada",
  "restoreProbado",
  "estadoProceso",
  "decisionQA",
];

const fieldLabels: Record<keyof BackupRecord, string> = {
  id: "ID",
  codigoBackup: "Código de backup",
  fechaOperacion: "Fecha de operación",
  horaOperacion: "Hora de operación",
  empresa: "Empresa",
  sede: "Sede / predio",
  ambiente: "Ambiente",
  tipoOperacion: "Tipo de operación",
  alcanceDatos: "Alcance de datos",
  origenDatos: "Origen de datos",
  destinoRespaldo: "Destino de respaldo",
  ubicacionRespaldo: "Ubicación de respaldo",
  responsableEjecucion: "Responsable de ejecución",
  responsableValidacion: "Responsable de validación",
  frecuenciaBackup: "Frecuencia de backup",
  tamanoArchivoMb: "Tamaño archivo MB",
  hashChecksum: "Hash / checksum",
  cifradoActivo: "Cifrado activo",
  retencionDias: "Retención en días",
  integridadVerificada: "Integridad verificada",
  restoreProbado: "Restore probado",
  resultadoRestore: "Resultado restore",
  fechaProximaPrueba: "Próxima prueba restore",
  estadoProceso: "Estado del proceso",
  decisionQA: "Decisión QA",
  desviacionAsociada: "Desviación asociada",
  capa: "CAPA",
  evidencia: "Evidencia",
  observaciones: "Observaciones",
  creadoEn: "Creado en",
  actualizadoEn: "Actualizado en",
};

const fields: FieldConfig[] = [
  { key: "codigoBackup", label: "Código de backup *", placeholder: "BKP-2026-001" },
  { key: "fechaOperacion", label: "Fecha de operación *", type: "date" },
  { key: "horaOperacion", label: "Hora de operación *", type: "time" },
  { key: "empresa", label: "Empresa *", placeholder: "Growlifecol S.A.S." },
  { key: "sede", label: "Sede / predio *", placeholder: "Sede principal" },
  {
    key: "ambiente",
    label: "Ambiente *",
    kind: "select",
    options: ["Desarrollo", "Pruebas", "Validación", "Producción", "Contingencia"],
  },
  {
    key: "tipoOperacion",
    label: "Tipo de operación *",
    kind: "select",
    options: [
      "Backup completo",
      "Backup incremental",
      "Snapshot",
      "Exportación JSON",
      "Exportación CSV",
      "Restauración controlada",
      "Prueba de restore",
      "Migración de datos",
      "Retención de datos",
      "Eliminación controlada",
    ],
  },
  {
    key: "alcanceDatos",
    label: "Alcance de datos *",
    kind: "textarea",
    placeholder: "Describe módulos, registros, tablas, archivos, evidencias, adjuntos o periodo cubierto.",
  },
  {
    key: "origenDatos",
    label: "Origen de datos *",
    kind: "textarea",
    placeholder: "Describe origen: localStorage, base de datos, exportación JSON, servidor, repositorio, archivo validado, etc.",
  },
  {
    key: "destinoRespaldo",
    label: "Destino de respaldo *",
    kind: "select",
    options: [
      "Repositorio local controlado",
      "Servidor interno",
      "Almacenamiento cloud",
      "Disco externo controlado",
      "ZIP validado",
      "Exportación JSON",
      "Snapshot de base de datos",
      "Ambiente de validación",
      "Otro",
    ],
  },
  { key: "ubicacionRespaldo", label: "Ubicación de respaldo *", placeholder: "Ruta, bucket, servidor, carpeta, referencia documental..." },
  { key: "responsableEjecucion", label: "Responsable de ejecución *", placeholder: "Usuario que ejecuta backup / restore" },
  { key: "responsableValidacion", label: "Responsable de validación *", placeholder: "QA / TI / Validación" },
  {
    key: "frecuenciaBackup",
    label: "Frecuencia de backup *",
    kind: "select",
    options: ["Diario", "Semanal", "Mensual", "Antes de release", "Antes de migración", "Bajo demanda", "No aplica"],
  },
  { key: "tamanoArchivoMb", label: "Tamaño archivo MB", type: "number", placeholder: "125" },
  { key: "hashChecksum", label: "Hash / checksum *", placeholder: "SHA256-BKP-2026-001-SIMULADO" },
  {
    key: "cifradoActivo",
    label: "Cifrado activo *",
    kind: "select",
    options: ["Sí", "No"],
  },
  { key: "retencionDias", label: "Retención en días *", type: "number", placeholder: "365" },
  {
    key: "integridadVerificada",
    label: "Integridad verificada *",
    kind: "select",
    options: ["Sí", "No"],
  },
  {
    key: "restoreProbado",
    label: "Restore probado *",
    kind: "select",
    options: ["Sí", "No", "No aplica"],
  },
  {
    key: "resultadoRestore",
    label: "Resultado restore",
    kind: "select",
    options: ["Conforme", "Con observación", "Fallido", "Pendiente", "No aplica"],
  },
  { key: "fechaProximaPrueba", label: "Próxima prueba restore", type: "date" },
  {
    key: "estadoProceso",
    label: "Estado del proceso *",
    kind: "select",
    options: [
      "Programado",
      "Ejecutado",
      "Validado",
      "Validado con observación",
      "Fallido",
      "Repetir",
      "Cerrado",
      "Suspendido",
    ],
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
      "Requiere repetición",
      "Cierre aprobado QA",
    ],
  },
  { key: "desviacionAsociada", label: "Desviación asociada", placeholder: "DEV-2026-001 / CAPA-001" },
  {
    key: "capa",
    label: "CAPA",
    kind: "textarea",
    placeholder: "Obligatoria si hay fallo, restore fallido, integridad no verificada, ausencia de cifrado crítico o rechazo QA.",
  },
  { key: "evidencia", label: "Evidencia / soporte", placeholder: "Log, hash, captura, archivo, ruta backup, acta, prueba restore, aprobación QA..." },
  {
    key: "observaciones",
    label: "Observaciones",
    kind: "textarea",
    placeholder: "Notas QA, restricciones, alcance, limitaciones, próximos pasos, retención o contingencia.",
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
  return `BKP-${Date.now()}-${Math.random().toString(16).slice(2)}`;
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

function loadRecords(): BackupRecord[] {
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

function saveRecords(records: BackupRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export default function BackupsPage() {
  const [records, setRecords] = useState<BackupRecord[]>([]);
  const [form, setForm] = useState<BackupRecord>(emptyForm);
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

  function updateField(field: keyof BackupRecord, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function isRestoreOperation(): boolean {
    return ["Restauración controlada", "Prueba de restore", "Migración de datos"].includes(form.tipoOperacion);
  }

  function isBackupOperation(): boolean {
    return ["Backup completo", "Backup incremental", "Snapshot", "Exportación JSON", "Exportación CSV"].includes(form.tipoOperacion);
  }

  function needsCapa(): boolean {
    return (
      form.integridadVerificada === "No" ||
      form.resultadoRestore === "Fallido" ||
      ["Fallido", "Repetir", "Suspendido"].includes(form.estadoProceso) ||
      ["Rechazado QA", "Requiere CAPA", "Requiere repetición"].includes(form.decisionQA) ||
      (form.ambiente === "Producción" && form.cifradoActivo === "No")
    );
  }

  function validateForm(): string[] {
    const errors = requiredFields
      .filter((field) => isInvalid(form[field]))
      .map((field) => fieldLabels[field]);

    const retention = toNumber(form.retencionDias);

    if (!Number.isFinite(retention) || retention <= 0) {
      errors.push("La retención en días debe ser mayor a cero");
    }

    if (!isInvalid(form.tamanoArchivoMb)) {
      const size = toNumber(form.tamanoArchivoMb);

      if (!Number.isFinite(size) || size <= 0) {
        errors.push("El tamaño del archivo debe ser mayor a cero");
      }
    }

    if (form.ambiente === "Producción" && form.cifradoActivo !== "Sí") {
      errors.push("Los backups de producción deben tener cifrado activo");
    }

    if ((isBackupOperation() || isRestoreOperation()) && isInvalid(form.hashChecksum)) {
      errors.push("El hash / checksum es obligatorio para backup, exportación, migración o restore");
    }

    if (isRestoreOperation() && form.restoreProbado !== "Sí") {
      errors.push("Las operaciones de restauración, prueba de restore o migración deben tener restore probado");
    }

    if (form.restoreProbado === "Sí" && isInvalid(form.resultadoRestore)) {
      errors.push("El resultado de restore es obligatorio cuando el restore fue probado");
    }

    if (form.restoreProbado === "Sí" && form.resultadoRestore === "No aplica") {
      errors.push("El resultado de restore no puede ser No aplica si el restore fue probado");
    }

    if (form.integridadVerificada !== "Sí") {
      errors.push("La integridad debe estar verificada para aceptar el proceso");
    }

    if (form.fechaProximaPrueba && form.fechaOperacion && isDateBefore(form.fechaProximaPrueba, form.fechaOperacion)) {
      errors.push("La próxima prueba restore no puede ser anterior a la fecha de operación");
    }

    if (["Aprobado QA", "Aprobado con observación QA", "Rechazado QA", "Cierre aprobado QA"].includes(form.decisionQA) && isInvalid(form.evidencia)) {
      errors.push("La evidencia es obligatoria para decisiones QA formales");
    }

    if (needsCapa() && isInvalid(form.desviacionAsociada)) {
      errors.push("La desviación asociada es obligatoria para fallos, integridad no verificada, ausencia de cifrado en producción o rechazo QA");
    }

    if (needsCapa() && isInvalid(form.capa)) {
      errors.push("La CAPA es obligatoria para fallos, integridad no verificada, ausencia de cifrado en producción o rechazo QA");
    }

    return Array.from(new Set(errors));
  }

  function fieldHasError(field: keyof BackupRecord): boolean {
    if (!submitAttempted) return false;

    if (requiredFields.includes(field) && isInvalid(form[field])) return true;

    if (field === "retencionDias") {
      const retention = toNumber(form.retencionDias);
      return !Number.isFinite(retention) || retention <= 0;
    }

    if (field === "tamanoArchivoMb" && !isInvalid(form.tamanoArchivoMb)) {
      const size = toNumber(form.tamanoArchivoMb);
      return !Number.isFinite(size) || size <= 0;
    }

    if (field === "cifradoActivo" && form.ambiente === "Producción" && form.cifradoActivo !== "Sí") return true;
    if (field === "hashChecksum" && (isBackupOperation() || isRestoreOperation()) && isInvalid(form.hashChecksum)) return true;
    if (field === "restoreProbado" && isRestoreOperation() && form.restoreProbado !== "Sí") return true;
    if (field === "resultadoRestore" && form.restoreProbado === "Sí" && (isInvalid(form.resultadoRestore) || form.resultadoRestore === "No aplica")) return true;
    if (field === "integridadVerificada" && form.integridadVerificada !== "Sí") return true;
    if (field === "fechaProximaPrueba" && form.fechaProximaPrueba && form.fechaOperacion && isDateBefore(form.fechaProximaPrueba, form.fechaOperacion)) return true;
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
      showCloud("No se guardó el backup. Completa la información obligatoria.", errors, "warning");
      return;
    }

    const timestamp = nowIso();

    const payload: BackupRecord = {
      ...form,
      codigoBackup: clean(form.codigoBackup),
      fechaOperacion: clean(form.fechaOperacion),
      horaOperacion: clean(form.horaOperacion),
      empresa: clean(form.empresa),
      sede: clean(form.sede),
      ambiente: clean(form.ambiente),
      tipoOperacion: clean(form.tipoOperacion),
      alcanceDatos: clean(form.alcanceDatos),
      origenDatos: clean(form.origenDatos),
      destinoRespaldo: clean(form.destinoRespaldo),
      ubicacionRespaldo: clean(form.ubicacionRespaldo),
      responsableEjecucion: clean(form.responsableEjecucion),
      responsableValidacion: clean(form.responsableValidacion),
      frecuenciaBackup: clean(form.frecuenciaBackup),
      tamanoArchivoMb: clean(form.tamanoArchivoMb),
      hashChecksum: clean(form.hashChecksum),
      cifradoActivo: clean(form.cifradoActivo),
      retencionDias: clean(form.retencionDias),
      integridadVerificada: clean(form.integridadVerificada),
      restoreProbado: clean(form.restoreProbado),
      resultadoRestore: clean(form.resultadoRestore),
      fechaProximaPrueba: clean(form.fechaProximaPrueba),
      estadoProceso: clean(form.estadoProceso),
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
      editingId ? "Backup actualizado correctamente." : "Backup registrado correctamente con control de integridad.",
      [],
      "success"
    );
  }

  function handleEdit(record: BackupRecord) {
    setForm(record);
    setEditingId(record.id);
    setSubmitAttempted(false);
    showCloud("Backup cargado para edición. Verifica antes de actualizar.", [], "success");
  }

  function handleDelete(id: string) {
    const confirmed = window.confirm("¿Confirmas eliminar este backup? En ambiente GMP real debería manejarse como anulación auditada.");
    if (!confirmed) return;

    const nextRecords = records.filter((record) => record.id !== id);
    setRecords(nextRecords);
    saveRecords(nextRecords);
    showCloud("Backup eliminado del almacenamiento local.", [], "success");
  }

  function exportJson() {
    if (records.length === 0) {
      showCloud("No hay backups para exportar.", [], "warning");
      return;
    }

    const blob = new Blob([JSON.stringify(records, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `floratrack-backups-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);

    showCloud("Archivo JSON de backups exportado correctamente.", [], "success");
  }

  const filteredRecords = useMemo(() => {
    const term = clean(search).toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        !term ||
        [
          record.codigoBackup,
          record.ambiente,
          record.tipoOperacion,
          record.alcanceDatos,
          record.destinoRespaldo,
          record.responsableEjecucion,
          record.estadoProceso,
          record.decisionQA,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

      const matchesEstado = filterEstado === "Todos" || record.estadoProceso === filterEstado;

      return matchesSearch && matchesEstado;
    });
  }, [records, search, filterEstado]);

  const dashboard = useMemo(() => {
    return {
      total: records.length,
      validados: records.filter((record) => ["Validado", "Cerrado"].includes(record.estadoProceso)).length,
      restore: records.filter((record) => record.restoreProbado === "Sí").length,
      fallidos: records.filter((record) => ["Fallido", "Repetir", "Suspendido"].includes(record.estadoProceso)).length,
      produccion: records.filter((record) => record.ambiente === "Producción").length,
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
        <header className="rounded-3xl border border-rose-400/20 bg-slate-900/80 p-6 shadow-2xl shadow-rose-950/30">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-rose-300">
                FloraTrack Enterprise Compliance Platform
              </p>

              <h1 className="mt-3 text-3xl font-black text-white md:text-5xl">
                Backups, restauración e integridad de datos
              </h1>

              <p className="mt-3 max-w-5xl text-sm leading-6 text-slate-300 md:text-base">
                Control de backups, restauración, snapshots, retención de datos,
                cifrado, hash, pruebas de restore, evidencia, desviaciones, CAPA y decisión QA.
              </p>
            </div>

            <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-5 py-4 text-sm text-rose-100">
              <p className="font-bold">Continuidad GMP activa</p>
              <p className="mt-1 text-rose-200">Backup · Restore · Integridad · Hash · QA</p>
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
          <Metric title="Backups" value={dashboard.total} />
          <Metric title="Validados" value={dashboard.validados} tone="emerald" />
          <Metric title="Restore probado" value={dashboard.restore} tone="sky" />
          <Metric title="Fallidos" value={dashboard.fallidos} tone="red" />
          <Metric title="Producción" value={dashboard.produccion} tone="amber" />
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
                <h2 className="text-2xl font-black text-white">{editingId ? "Editar backup" : "Nuevo backup / restore"}</h2>
                <p className="mt-1 text-sm text-slate-400">Ningún backup puede guardarse vacío o incompleto.</p>
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
                  : "border-slate-700 bg-slate-950 focus:border-rose-400 focus:ring-4 focus:ring-rose-400/40";

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

                      {hasError && <p className="mt-1 text-xs font-bold text-red-300">Campo obligatorio o condición de backup requerida.</p>}
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
              <button type="button" onClick={handleSave} className="rounded-2xl bg-rose-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-rose-950/50 transition hover:bg-rose-400">
                {editingId ? "Actualizar backup" : "Guardar backup"}
              </button>

              <button type="button" onClick={resetForm} className="rounded-2xl border border-slate-600 px-6 py-3 text-sm font-bold text-slate-200 transition hover:bg-slate-800">
                Limpiar formulario
              </button>
            </div>
          </form>

          <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">Registro maestro de backups</h2>
                <p className="mt-1 text-sm text-slate-400">Consulta, filtra, edita y exporta backups, restore y evidencias.</p>
              </div>

              <button type="button" onClick={exportJson} className="rounded-2xl border border-rose-400/50 px-5 py-3 text-sm font-bold text-rose-200 transition hover:bg-rose-500/10">
                Exportar JSON
              </button>
            </div>

            <div className="mb-5 grid gap-3 md:grid-cols-[1fr_250px]">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-rose-400/40 transition placeholder:text-slate-600 focus:border-rose-400 focus:ring-4"
                placeholder="Buscar por código, ambiente, tipo, destino, estado..."
              />

              <select
                value={filterEstado}
                onChange={(event) => setFilterEstado(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-rose-400/40 transition focus:border-rose-400 focus:ring-4"
              >
                <option>Todos</option>
                <option>Programado</option>
                <option>Ejecutado</option>
                <option>Validado</option>
                <option>Validado con observación</option>
                <option>Fallido</option>
                <option>Repetir</option>
                <option>Cerrado</option>
                <option>Suspendido</option>
              </select>
            </div>

            <div className="max-h-[780px] space-y-4 overflow-auto pr-2">
              {filteredRecords.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center text-sm text-slate-400">
                  No hay backups registrados. Crea el primer registro con datos completos.
                </div>
              ) : (
                filteredRecords.map((record) => (
                  <article key={record.id} className="rounded-2xl border border-slate-700 bg-slate-950 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-white">{record.codigoBackup} · {record.tipoOperacion}</h3>
                          <StatusPill value={record.estadoProceso} />
                          <span className="rounded-full border border-rose-400/30 bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-200">
                            {record.ambiente}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-400">
                          {record.fechaOperacion} · {record.destinoRespaldo} · Restore {record.restoreProbado}
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
                      <Data label="Ubicación respaldo" value={record.ubicacionRespaldo} />
                      <Data label="Ejecutó" value={record.responsableEjecucion} />
                      <Data label="Validó" value={record.responsableValidacion} />
                      <Data label="Frecuencia" value={record.frecuenciaBackup} />
                      <Data label="Tamaño MB" value={record.tamanoArchivoMb || "Sin registro"} />
                      <Data label="Hash" value={record.hashChecksum} />
                      <Data label="Cifrado" value={record.cifradoActivo} />
                      <Data label="Retención días" value={record.retencionDias} />
                      <Data label="Integridad" value={record.integridadVerificada} />
                      <Data label="Resultado restore" value={record.resultadoRestore || "Sin registro"} />
                      <Data label="Próxima prueba" value={record.fechaProximaPrueba || "Sin registro"} />
                      <Data label="Decisión QA" value={record.decisionQA} />
                      <Data label="Evidencia" value={record.evidencia || "Sin registro"} />
                    </div>

                    <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300">
                      <p><span className="font-bold text-slate-100">Alcance: </span>{record.alcanceDatos}</p>
                      <p className="mt-2"><span className="font-bold text-slate-100">Origen: </span>{record.origenDatos}</p>

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
      : value === "Programado" || value === "Ejecutado" || value === "Validado con observación"
      ? "border-amber-400/40 bg-amber-500/10 text-amber-200"
      : "border-red-400/40 bg-red-500/10 text-red-200";

  return <span className={`rounded-full border px-3 py-1 text-xs font-bold ${className}`}>{value || "Sin estado"}</span>;
}
