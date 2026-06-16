"use client";

import { useEffect, useMemo, useState } from "react";

type CsvRecord = {
  id: string;
  codigoOperacion: string;
  fechaOperacion: string;
  horaOperacion: string;
  empresa: string;
  sede: string;
  tipoOperacion: string;
  moduloDestino: string;
  nombreArchivo: string;
  formatoArchivo: string;
  delimitador: string;
  origenDatos: string;
  responsableCarga: string;
  responsableValidacion: string;
  totalRegistros: string;
  registrosValidos: string;
  registrosRechazados: string;
  reglaValidacion: string;
  resultadoValidacion: string;
  estadoProceso: string;
  decisionQA: string;
  requiereBackup: string;
  referenciaBackup: string;
  hashArchivo: string;
  desviacionAsociada: string;
  capa: string;
  evidencia: string;
  observaciones: string;
  creadoEn: string;
  actualizadoEn: string;
};

type FieldConfig = {
  key: keyof CsvRecord;
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

const STORAGE_KEY = "floratrack_csv_importacion_exportacion_v1";

const emptyForm: CsvRecord = {
  id: "",
  codigoOperacion: "",
  fechaOperacion: "",
  horaOperacion: "",
  empresa: "",
  sede: "",
  tipoOperacion: "",
  moduloDestino: "",
  nombreArchivo: "",
  formatoArchivo: "",
  delimitador: "",
  origenDatos: "",
  responsableCarga: "",
  responsableValidacion: "",
  totalRegistros: "",
  registrosValidos: "",
  registrosRechazados: "",
  reglaValidacion: "",
  resultadoValidacion: "",
  estadoProceso: "",
  decisionQA: "",
  requiereBackup: "",
  referenciaBackup: "",
  hashArchivo: "",
  desviacionAsociada: "",
  capa: "",
  evidencia: "",
  observaciones: "",
  creadoEn: "",
  actualizadoEn: "",
};

const requiredFields: Array<keyof CsvRecord> = [
  "codigoOperacion",
  "fechaOperacion",
  "horaOperacion",
  "empresa",
  "sede",
  "tipoOperacion",
  "moduloDestino",
  "nombreArchivo",
  "formatoArchivo",
  "delimitador",
  "origenDatos",
  "responsableCarga",
  "responsableValidacion",
  "totalRegistros",
  "registrosValidos",
  "registrosRechazados",
  "reglaValidacion",
  "resultadoValidacion",
  "estadoProceso",
  "decisionQA",
  "requiereBackup",
];

const fieldLabels: Record<keyof CsvRecord, string> = {
  id: "ID",
  codigoOperacion: "Código de operación",
  fechaOperacion: "Fecha de operación",
  horaOperacion: "Hora de operación",
  empresa: "Empresa",
  sede: "Sede / predio",
  tipoOperacion: "Tipo de operación",
  moduloDestino: "Módulo destino",
  nombreArchivo: "Nombre de archivo",
  formatoArchivo: "Formato de archivo",
  delimitador: "Delimitador",
  origenDatos: "Origen de datos",
  responsableCarga: "Responsable de carga",
  responsableValidacion: "Responsable de validación",
  totalRegistros: "Total de registros",
  registrosValidos: "Registros válidos",
  registrosRechazados: "Registros rechazados",
  reglaValidacion: "Regla de validación",
  resultadoValidacion: "Resultado de validación",
  estadoProceso: "Estado del proceso",
  decisionQA: "Decisión QA",
  requiereBackup: "Requiere backup",
  referenciaBackup: "Referencia de backup",
  hashArchivo: "Hash / checksum",
  desviacionAsociada: "Desviación asociada",
  capa: "CAPA",
  evidencia: "Evidencia",
  observaciones: "Observaciones",
  creadoEn: "Creado en",
  actualizadoEn: "Actualizado en",
};

const fields: FieldConfig[] = [
  { key: "codigoOperacion", label: "Código de operación *", placeholder: "CSV-2026-001" },
  { key: "fechaOperacion", label: "Fecha de operación *", type: "date" },
  { key: "horaOperacion", label: "Hora de operación *", type: "time" },
  { key: "empresa", label: "Empresa *", placeholder: "Growlifecol S.A.S." },
  { key: "sede", label: "Sede / predio *", placeholder: "Sede principal" },
  {
    key: "tipoOperacion",
    label: "Tipo de operación *",
    kind: "select",
    options: [
      "Importación CSV",
      "Exportación CSV",
      "Exportación JSON",
      "Migración de datos",
      "Conciliación de registros",
      "Carga masiva",
      "Validación de archivo",
      "Respaldo de datos",
      "Restauración controlada",
    ],
  },
  {
    key: "moduloDestino",
    label: "Módulo destino *",
    kind: "select",
    options: [
      "Empresas",
      "GIS",
      "Cultivos",
      "Propagación",
      "Cosecha",
      "Genéticas",
      "Predios",
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
      "Reportes",
      "Notificaciones",
      "Múltiples módulos",
    ],
  },
  { key: "nombreArchivo", label: "Nombre de archivo *", placeholder: "inventario-2026-001.csv" },
  {
    key: "formatoArchivo",
    label: "Formato de archivo *",
    kind: "select",
    options: ["CSV", "JSON", "XLSX", "TXT delimitado", "ZIP backup", "Otro"],
  },
  {
    key: "delimitador",
    label: "Delimitador *",
    kind: "select",
    options: ["Coma (,)", "Punto y coma (;)", "Tabulación", "Pipe (|)", "No aplica"],
  },
  {
    key: "origenDatos",
    label: "Origen de datos *",
    kind: "textarea",
    placeholder: "Describe origen: archivo manual, exportación previa, sistema externo, laboratorio, proveedor, inventario físico, etc.",
  },
  { key: "responsableCarga", label: "Responsable de carga *", placeholder: "Usuario que ejecuta la carga o exportación" },
  { key: "responsableValidacion", label: "Responsable de validación *", placeholder: "QA / Data steward / responsable técnico" },
  { key: "totalRegistros", label: "Total de registros *", type: "number", placeholder: "100" },
  { key: "registrosValidos", label: "Registros válidos *", type: "number", placeholder: "98" },
  { key: "registrosRechazados", label: "Registros rechazados *", type: "number", placeholder: "2" },
  {
    key: "reglaValidacion",
    label: "Regla de validación *",
    kind: "textarea",
    placeholder: "Describe validaciones: campos obligatorios, lote único, fechas válidas, cantidades positivas, estado QA, duplicados, etc.",
  },
  {
    key: "resultadoValidacion",
    label: "Resultado de validación *",
    kind: "select",
    options: [
      "Validado sin errores",
      "Validado con observaciones",
      "Con errores rechazados",
      "Fallido",
      "Pendiente validación",
      "Requiere corrección",
    ],
  },
  {
    key: "estadoProceso",
    label: "Estado del proceso *",
    kind: "select",
    options: [
      "Pendiente",
      "En validación",
      "Procesado",
      "Procesado parcialmente",
      "Rechazado",
      "Fallido",
      "Revertido",
      "Cerrado",
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
      "Requiere corrección",
      "Requiere CAPA",
      "Requiere reversión",
      "Cierre aprobado QA",
    ],
  },
  {
    key: "requiereBackup",
    label: "Requiere backup *",
    kind: "select",
    options: ["Sí", "No"],
  },
  { key: "referenciaBackup", label: "Referencia de backup", placeholder: "BACKUP-2026-001 / ruta / zip / snapshot" },
  { key: "hashArchivo", label: "Hash / checksum", placeholder: "SHA256 / checksum / control de integridad" },
  { key: "desviacionAsociada", label: "Desviación asociada", placeholder: "DEV-2026-001 / CAPA-001" },
  {
    key: "capa",
    label: "CAPA",
    kind: "textarea",
    placeholder: "Obligatoria si hay registros rechazados, error, proceso fallido, reversión o rechazo QA.",
  },
  { key: "evidencia", label: "Evidencia / soporte", placeholder: "Archivo, captura, log, reporte de validación, acta QA, backup, hash..." },
  {
    key: "observaciones",
    label: "Observaciones",
    kind: "textarea",
    placeholder: "Notas QA, explicación de errores, registros rechazados, trazabilidad, recomendaciones.",
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
  return `CSV-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function loadRecords(): CsvRecord[] {
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

function saveRecords(records: CsvRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export default function CsvPage() {
  const [records, setRecords] = useState<CsvRecord[]>([]);
  const [form, setForm] = useState<CsvRecord>(emptyForm);
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

  function updateField(field: keyof CsvRecord, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function numericSummary() {
    return {
      total: toNumber(form.totalRegistros),
      valid: toNumber(form.registrosValidos),
      rejected: toNumber(form.registrosRechazados),
    };
  }

  function needsCapa(): boolean {
    const summary = numericSummary();

    return (
      summary.rejected > 0 ||
      ["Con errores rechazados", "Fallido", "Requiere corrección"].includes(form.resultadoValidacion) ||
      ["Procesado parcialmente", "Rechazado", "Fallido", "Revertido"].includes(form.estadoProceso) ||
      ["Rechazado QA", "Requiere corrección", "Requiere CAPA", "Requiere reversión"].includes(form.decisionQA)
    );
  }

  function validateForm(): string[] {
    const errors = requiredFields
      .filter((field) => isInvalid(form[field]))
      .map((field) => fieldLabels[field]);

    const summary = numericSummary();

    if (!Number.isFinite(summary.total) || summary.total <= 0) {
      errors.push("El total de registros debe ser mayor a cero");
    }

    if (!Number.isFinite(summary.valid) || summary.valid < 0) {
      errors.push("Los registros válidos deben ser un número igual o mayor a cero");
    }

    if (!Number.isFinite(summary.rejected) || summary.rejected < 0) {
      errors.push("Los registros rechazados deben ser un número igual o mayor a cero");
    }

    if (
      Number.isFinite(summary.total) &&
      Number.isFinite(summary.valid) &&
      Number.isFinite(summary.rejected) &&
      summary.valid + summary.rejected !== summary.total
    ) {
      errors.push("La suma de registros válidos y rechazados debe coincidir con el total de registros");
    }

    if (form.requiereBackup === "Sí" && isInvalid(form.referenciaBackup)) {
      errors.push("La referencia de backup es obligatoria cuando la operación requiere backup");
    }

    if (form.requiereBackup === "Sí" && isInvalid(form.evidencia)) {
      errors.push("La evidencia es obligatoria cuando la operación requiere backup");
    }

    if (["Aprobado QA", "Aprobado con observación QA", "Rechazado QA", "Cierre aprobado QA"].includes(form.decisionQA) && isInvalid(form.evidencia)) {
      errors.push("La evidencia es obligatoria para decisiones QA formales");
    }

    if (["Importación CSV", "Carga masiva", "Migración de datos", "Restauración controlada"].includes(form.tipoOperacion) && isInvalid(form.hashArchivo)) {
      errors.push("El hash o checksum es obligatorio para importación, carga masiva, migración o restauración controlada");
    }

    if (needsCapa() && isInvalid(form.desviacionAsociada)) {
      errors.push("La desviación asociada es obligatoria cuando hay rechazo, error, reversión, registros rechazados o CAPA");
    }

    if (needsCapa() && isInvalid(form.capa)) {
      errors.push("La CAPA es obligatoria cuando hay rechazo, error, reversión, registros rechazados o CAPA");
    }

    return Array.from(new Set(errors));
  }

  function fieldHasError(field: keyof CsvRecord): boolean {
    if (!submitAttempted) return false;

    const summary = numericSummary();

    if (requiredFields.includes(field) && isInvalid(form[field])) return true;

    if (field === "totalRegistros") return !Number.isFinite(summary.total) || summary.total <= 0;
    if (field === "registrosValidos") return !Number.isFinite(summary.valid) || summary.valid < 0;
    if (field === "registrosRechazados") return !Number.isFinite(summary.rejected) || summary.rejected < 0;

    if (
      ["totalRegistros", "registrosValidos", "registrosRechazados"].includes(field) &&
      Number.isFinite(summary.total) &&
      Number.isFinite(summary.valid) &&
      Number.isFinite(summary.rejected) &&
      summary.valid + summary.rejected !== summary.total
    ) {
      return true;
    }

    if (field === "referenciaBackup" && form.requiereBackup === "Sí" && isInvalid(form.referenciaBackup)) return true;
    if (field === "evidencia" && form.requiereBackup === "Sí" && isInvalid(form.evidencia)) return true;
    if (field === "evidencia" && ["Aprobado QA", "Aprobado con observación QA", "Rechazado QA", "Cierre aprobado QA"].includes(form.decisionQA) && isInvalid(form.evidencia)) return true;
    if (field === "hashArchivo" && ["Importación CSV", "Carga masiva", "Migración de datos", "Restauración controlada"].includes(form.tipoOperacion) && isInvalid(form.hashArchivo)) return true;
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
      showCloud("No se guardó la operación CSV. Completa la información obligatoria.", errors, "warning");
      return;
    }

    const timestamp = nowIso();

    const payload: CsvRecord = {
      ...form,
      codigoOperacion: clean(form.codigoOperacion),
      fechaOperacion: clean(form.fechaOperacion),
      horaOperacion: clean(form.horaOperacion),
      empresa: clean(form.empresa),
      sede: clean(form.sede),
      tipoOperacion: clean(form.tipoOperacion),
      moduloDestino: clean(form.moduloDestino),
      nombreArchivo: clean(form.nombreArchivo),
      formatoArchivo: clean(form.formatoArchivo),
      delimitador: clean(form.delimitador),
      origenDatos: clean(form.origenDatos),
      responsableCarga: clean(form.responsableCarga),
      responsableValidacion: clean(form.responsableValidacion),
      totalRegistros: clean(form.totalRegistros),
      registrosValidos: clean(form.registrosValidos),
      registrosRechazados: clean(form.registrosRechazados),
      reglaValidacion: clean(form.reglaValidacion),
      resultadoValidacion: clean(form.resultadoValidacion),
      estadoProceso: clean(form.estadoProceso),
      decisionQA: clean(form.decisionQA),
      requiereBackup: clean(form.requiereBackup),
      referenciaBackup: clean(form.referenciaBackup),
      hashArchivo: clean(form.hashArchivo),
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
      editingId ? "Operación CSV actualizada correctamente." : "Operación CSV registrada correctamente con control de datos GMP.",
      [],
      "success"
    );
  }

  function handleEdit(record: CsvRecord) {
    setForm(record);
    setEditingId(record.id);
    setSubmitAttempted(false);
    showCloud("Operación CSV cargada para edición. Verifica antes de actualizar.", [], "success");
  }

  function handleDelete(id: string) {
    const confirmed = window.confirm("¿Confirmas eliminar esta operación CSV? En ambiente GMP real debería manejarse como anulación auditada.");
    if (!confirmed) return;

    const nextRecords = records.filter((record) => record.id !== id);
    setRecords(nextRecords);
    saveRecords(nextRecords);
    showCloud("Operación CSV eliminada del almacenamiento local.", [], "success");
  }

  function exportJson() {
    if (records.length === 0) {
      showCloud("No hay operaciones CSV para exportar.", [], "warning");
      return;
    }

    const blob = new Blob([JSON.stringify(records, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `floratrack-csv-operaciones-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);

    showCloud("Archivo JSON de operaciones CSV exportado correctamente.", [], "success");
  }

  const filteredRecords = useMemo(() => {
    const term = clean(search).toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        !term ||
        [
          record.codigoOperacion,
          record.tipoOperacion,
          record.moduloDestino,
          record.nombreArchivo,
          record.responsableCarga,
          record.responsableValidacion,
          record.resultadoValidacion,
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
      procesadas: records.filter((record) => ["Procesado", "Cerrado"].includes(record.estadoProceso)).length,
      parciales: records.filter((record) => record.estadoProceso === "Procesado parcialmente").length,
      rechazadas: records.filter((record) => ["Rechazado", "Fallido", "Revertido"].includes(record.estadoProceso)).length,
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
        <header className="rounded-3xl border border-cyan-400/20 bg-slate-900/80 p-6 shadow-2xl shadow-cyan-950/30">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">
                FloraTrack Enterprise Compliance Platform
              </p>

              <h1 className="mt-3 text-3xl font-black text-white md:text-5xl">
                CSV / Importación y exportación validada
              </h1>

              <p className="mt-3 max-w-5xl text-sm leading-6 text-slate-300 md:text-base">
                Control de importaciones, exportaciones, migraciones, conciliaciones,
                registros válidos, rechazados, hash, backup, evidencia, desviaciones, CAPA y decisión QA.
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-5 py-4 text-sm text-cyan-100">
              <p className="font-bold">DataOps GMP activo</p>
              <p className="mt-1 text-cyan-200">CSV · Validación · Backup · Hash · QA</p>
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
          <Metric title="Operaciones" value={dashboard.total} />
          <Metric title="Procesadas" value={dashboard.procesadas} tone="emerald" />
          <Metric title="Parciales" value={dashboard.parciales} tone="amber" />
          <Metric title="Rechazadas" value={dashboard.rechazadas} tone="red" />
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
                <h2 className="text-2xl font-black text-white">{editingId ? "Editar operación CSV" : "Nueva operación CSV"}</h2>
                <p className="mt-1 text-sm text-slate-400">Ninguna operación puede guardarse vacía o incompleta.</p>
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
                  : "border-slate-700 bg-slate-950 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/40";

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

                      {hasError && <p className="mt-1 text-xs font-bold text-red-300">Campo obligatorio o condición de datos requerida.</p>}
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
              <button type="button" onClick={handleSave} className="rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-black text-slate-950 shadow-lg shadow-cyan-950/50 transition hover:bg-cyan-400">
                {editingId ? "Actualizar operación" : "Guardar operación"}
              </button>

              <button type="button" onClick={resetForm} className="rounded-2xl border border-slate-600 px-6 py-3 text-sm font-bold text-slate-200 transition hover:bg-slate-800">
                Limpiar formulario
              </button>
            </div>
          </form>

          <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">Registro maestro CSV / DataOps</h2>
                <p className="mt-1 text-sm text-slate-400">Consulta, filtra, edita y exporta operaciones de datos.</p>
              </div>

              <button type="button" onClick={exportJson} className="rounded-2xl border border-cyan-400/50 px-5 py-3 text-sm font-bold text-cyan-200 transition hover:bg-cyan-500/10">
                Exportar JSON
              </button>
            </div>

            <div className="mb-5 grid gap-3 md:grid-cols-[1fr_250px]">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-cyan-400/40 transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-4"
                placeholder="Buscar por archivo, operación, módulo, estado, QA..."
              />

              <select
                value={filterEstado}
                onChange={(event) => setFilterEstado(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-cyan-400/40 transition focus:border-cyan-400 focus:ring-4"
              >
                <option>Todos</option>
                <option>Pendiente</option>
                <option>En validación</option>
                <option>Procesado</option>
                <option>Procesado parcialmente</option>
                <option>Rechazado</option>
                <option>Fallido</option>
                <option>Revertido</option>
                <option>Cerrado</option>
              </select>
            </div>

            <div className="max-h-[780px] space-y-4 overflow-auto pr-2">
              {filteredRecords.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center text-sm text-slate-400">
                  No hay operaciones CSV registradas. Crea la primera operación con datos completos.
                </div>
              ) : (
                filteredRecords.map((record) => (
                  <article key={record.id} className="rounded-2xl border border-slate-700 bg-slate-950 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-white">{record.codigoOperacion} · {record.nombreArchivo}</h3>
                          <StatusPill value={record.estadoProceso} />
                          <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-200">
                            {record.tipoOperacion}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-400">
                          {record.moduloDestino} · Total {record.totalRegistros} · Válidos {record.registrosValidos} · Rechazados {record.registrosRechazados}
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
                      <Data label="Formato" value={record.formatoArchivo} />
                      <Data label="Delimitador" value={record.delimitador} />
                      <Data label="Carga" value={record.responsableCarga} />
                      <Data label="Validación" value={record.responsableValidacion} />
                      <Data label="Resultado" value={record.resultadoValidacion} />
                      <Data label="Decisión QA" value={record.decisionQA} />
                      <Data label="Backup" value={record.requiereBackup} />
                      <Data label="Referencia backup" value={record.referenciaBackup || "Sin registro"} />
                      <Data label="Hash" value={record.hashArchivo || "Sin registro"} />
                      <Data label="Evidencia" value={record.evidencia || "Sin registro"} />
                    </div>

                    <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300">
                      <p><span className="font-bold text-slate-100">Origen: </span>{record.origenDatos}</p>
                      <p className="mt-2"><span className="font-bold text-slate-100">Regla validación: </span>{record.reglaValidacion}</p>

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
    value === "Procesado" || value === "Cerrado"
      ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
      : value === "Pendiente" || value === "En validación" || value === "Procesado parcialmente"
      ? "border-amber-400/40 bg-amber-500/10 text-amber-200"
      : "border-red-400/40 bg-red-500/10 text-red-200";

  return <span className={`rounded-full border px-3 py-1 text-xs font-bold ${className}`}>{value || "Sin estado"}</span>;
}
