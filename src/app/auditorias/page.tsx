"use client";

import { useEffect, useMemo, useState } from "react";

type AuditoriaRecord = {
  id: string;
  codigoAuditoria: string;
  fechaAuditoria: string;
  horaAuditoria: string;
  empresa: string;
  sede: string;
  auditorLider: string;
  equipoAuditor: string;
  tipoAuditoria: string;
  areaAuditada: string;
  responsableArea: string;
  alcance: string;
  normaReferencia: string;
  criterioAuditado: string;
  resultadoEvaluacion: string;
  clasificacionHallazgo: string;
  descripcionHallazgo: string;
  evidencia: string;
  accionRequerida: string;
  responsableCierre: string;
  fechaCompromiso: string;
  estadoCierre: string;
  verificacionEficacia: string;
  decisionQA: string;
  observaciones: string;
  creadoEn: string;
  actualizadoEn: string;
};

type FieldConfig = {
  key: keyof AuditoriaRecord;
  label: string;
  type?: string;
  placeholder?: string;
  kind?: "input" | "select" | "textarea";
  options?: string[];
};

const STORAGE_KEY = "floratrack_auditorias_internas_records_v1";

const emptyForm: AuditoriaRecord = {
  id: "",
  codigoAuditoria: "",
  fechaAuditoria: "",
  horaAuditoria: "",
  empresa: "",
  sede: "",
  auditorLider: "",
  equipoAuditor: "",
  tipoAuditoria: "",
  areaAuditada: "",
  responsableArea: "",
  alcance: "",
  normaReferencia: "",
  criterioAuditado: "",
  resultadoEvaluacion: "",
  clasificacionHallazgo: "",
  descripcionHallazgo: "",
  evidencia: "",
  accionRequerida: "",
  responsableCierre: "",
  fechaCompromiso: "",
  estadoCierre: "",
  verificacionEficacia: "",
  decisionQA: "",
  observaciones: "",
  creadoEn: "",
  actualizadoEn: "",
};

const requiredFields: Array<keyof AuditoriaRecord> = [
  "codigoAuditoria",
  "fechaAuditoria",
  "horaAuditoria",
  "empresa",
  "sede",
  "auditorLider",
  "tipoAuditoria",
  "areaAuditada",
  "responsableArea",
  "alcance",
  "normaReferencia",
  "criterioAuditado",
  "resultadoEvaluacion",
  "clasificacionHallazgo",
  "estadoCierre",
  "decisionQA",
];

const fieldLabels: Record<keyof AuditoriaRecord, string> = {
  id: "ID",
  codigoAuditoria: "Código de auditoría",
  fechaAuditoria: "Fecha de auditoría",
  horaAuditoria: "Hora de auditoría",
  empresa: "Empresa",
  sede: "Sede / predio",
  auditorLider: "Auditor líder",
  equipoAuditor: "Equipo auditor",
  tipoAuditoria: "Tipo de auditoría",
  areaAuditada: "Área auditada",
  responsableArea: "Responsable del área",
  alcance: "Alcance",
  normaReferencia: "Norma / referencia",
  criterioAuditado: "Criterio auditado",
  resultadoEvaluacion: "Resultado de evaluación",
  clasificacionHallazgo: "Clasificación del hallazgo",
  descripcionHallazgo: "Descripción del hallazgo",
  evidencia: "Evidencia",
  accionRequerida: "Acción requerida",
  responsableCierre: "Responsable de cierre",
  fechaCompromiso: "Fecha compromiso",
  estadoCierre: "Estado de cierre",
  verificacionEficacia: "Verificación de eficacia",
  decisionQA: "Decisión QA",
  observaciones: "Observaciones",
  creadoEn: "Creado en",
  actualizadoEn: "Actualizado en",
};

const fields: FieldConfig[] = [
  { key: "codigoAuditoria", label: "Código de auditoría *", placeholder: "AUD-2026-001" },
  { key: "fechaAuditoria", label: "Fecha de auditoría *", type: "date" },
  { key: "horaAuditoria", label: "Hora de auditoría *", type: "time" },
  { key: "empresa", label: "Empresa *", placeholder: "Growlifecol S.A.S." },
  { key: "sede", label: "Sede / predio *", placeholder: "Sede principal / laboratorio / cultivo" },
  { key: "auditorLider", label: "Auditor líder *", placeholder: "Nombre del auditor responsable" },
  { key: "equipoAuditor", label: "Equipo auditor", placeholder: "Auditores acompañantes / observadores" },
  {
    key: "tipoAuditoria",
    label: "Tipo de auditoría *",
    kind: "select",
    options: [
      "Auditoría interna GACP",
      "Auditoría interna GMP",
      "Autoinspección",
      "Auditoría a proveedor",
      "Auditoría documental",
      "Auditoría de proceso",
      "Auditoría de limpieza",
      "Auditoría de trazabilidad",
      "Auditoría regulatoria simulada",
      "Seguimiento CAPA",
    ],
  },
  {
    key: "areaAuditada",
    label: "Área auditada *",
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
      "Almacén",
      "Mantenimiento",
      "Limpieza y saneamiento",
      "Regulatorio",
      "Proveedores",
      "Trazabilidad",
    ],
  },
  { key: "responsableArea", label: "Responsable del área *", placeholder: "Responsable auditado" },
  {
    key: "alcance",
    label: "Alcance de la auditoría *",
    kind: "textarea",
    placeholder: "Define procesos, áreas, lotes, documentos, registros y periodo auditado.",
  },
  {
    key: "normaReferencia",
    label: "Norma / referencia *",
    kind: "select",
    options: [
      "GACP",
      "GMP",
      "GACP/GMP",
      "ISO 9001",
      "ISO 17025",
      "BPM",
      "Procedimiento interno",
      "Plan maestro de calidad",
      "Requisito regulatorio",
      "Buenas prácticas documentales",
    ],
  },
  {
    key: "criterioAuditado",
    label: "Criterio auditado *",
    kind: "textarea",
    placeholder: "Describe el requisito, SOP, procedimiento, registro, norma o punto de control evaluado.",
  },
  {
    key: "resultadoEvaluacion",
    label: "Resultado de evaluación *",
    kind: "select",
    options: [
      "Cumple",
      "Cumple con observación",
      "No cumple",
      "No evaluado",
      "No aplica",
      "Requiere seguimiento",
    ],
  },
  {
    key: "clasificacionHallazgo",
    label: "Clasificación del hallazgo *",
    kind: "select",
    options: [
      "Conforme",
      "Observación",
      "Oportunidad de mejora",
      "No conformidad menor",
      "No conformidad mayor",
      "Hallazgo crítico",
      "Reincidencia",
    ],
  },
  {
    key: "descripcionHallazgo",
    label: "Descripción del hallazgo",
    kind: "textarea",
    placeholder: "Obligatoria si el resultado no es Conforme. Describe evidencia objetiva, requisito incumplido y condición observada.",
  },
  { key: "evidencia", label: "Evidencia / soporte", placeholder: "Foto, acta, registro, SOP, lote, QR, enlace documental..." },
  {
    key: "accionRequerida",
    label: "Acción requerida",
    kind: "textarea",
    placeholder: "Obligatoria para no conformidades mayores, críticas o reincidencias. Puede generar CAPA.",
  },
  { key: "responsableCierre", label: "Responsable de cierre", placeholder: "Responsable de ejecutar corrección / CAPA" },
  { key: "fechaCompromiso", label: "Fecha compromiso", type: "date" },
  {
    key: "estadoCierre",
    label: "Estado de cierre *",
    kind: "select",
    options: [
      "Abierta",
      "En análisis",
      "Acción definida",
      "En ejecución",
      "Pendiente verificación",
      "Cerrada eficaz",
      "Cerrada no eficaz",
      "Vencida",
      "Cancelada por QA",
    ],
  },
  {
    key: "verificacionEficacia",
    label: "Verificación de eficacia",
    kind: "textarea",
    placeholder: "Obligatoria para cerrar. Describe evidencia de cierre eficaz, revisión de tendencia o verificación en sitio.",
  },
  {
    key: "decisionQA",
    label: "Decisión QA *",
    kind: "select",
    options: [
      "Pendiente QA",
      "Aceptado sin CAPA",
      "Requiere corrección",
      "Requiere CAPA",
      "Requiere investigación",
      "Requiere reauditoría",
      "Cierre aprobado",
      "Cierre rechazado",
      "Escalado a dirección técnica",
    ],
  },
  {
    key: "observaciones",
    label: "Observaciones",
    kind: "textarea",
    placeholder: "Notas adicionales, contexto regulatorio, seguimiento, impacto, conclusiones del auditor.",
  },
];

function clean(value: unknown): string {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function isInvalid(value: unknown): boolean {
  const normalized = clean(value).toLowerCase();

  return [
    "",
    "seleccione",
    "seleccionar",
    "sin definir",
    "n/a",
    "na",
    "no aplica",
    "ninguno",
    "null",
    "undefined",
  ].includes(normalized);
}

function safeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `AUD-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function loadRecords(): AuditoriaRecord[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(Boolean);
  } catch {
    return [];
  }
}

function saveRecords(records: AuditoriaRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export default function AuditoriasPage() {
  const [records, setRecords] = useState<AuditoriaRecord[]>([]);
  const [form, setForm] = useState<AuditoriaRecord>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [search, setSearch] = useState("");
  const [filterEstado, setFilterEstado] = useState("Todos");

  useEffect(() => {
    setRecords(loadRecords());
  }, []);

  function showToast(message: string, errors: string[] = []) {
    setToast(message);
    setValidationErrors(errors);

    window.setTimeout(() => {
      setToast("");
      setValidationErrors([]);
    }, 9000);
  }

  function updateField(field: keyof AuditoriaRecord, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function validateForm(): string[] {
    const errors = requiredFields
      .filter((field) => isInvalid(form[field]))
      .map((field) => fieldLabels[field]);

    const nonConformingFindings = [
      "Observación",
      "Oportunidad de mejora",
      "No conformidad menor",
      "No conformidad mayor",
      "Hallazgo crítico",
      "Reincidencia",
    ];

    const seriousFindings = [
      "No conformidad mayor",
      "Hallazgo crítico",
      "Reincidencia",
    ];

    if (
      nonConformingFindings.includes(form.clasificacionHallazgo) &&
      isInvalid(form.descripcionHallazgo)
    ) {
      errors.push("La descripción del hallazgo es obligatoria cuando no es Conforme");
    }

    if (
      seriousFindings.includes(form.clasificacionHallazgo) &&
      isInvalid(form.accionRequerida)
    ) {
      errors.push("La acción requerida es obligatoria para hallazgos mayores, críticos o reincidentes");
    }

    if (
      seriousFindings.includes(form.clasificacionHallazgo) &&
      isInvalid(form.responsableCierre)
    ) {
      errors.push("El responsable de cierre es obligatorio para hallazgos mayores, críticos o reincidentes");
    }

    if (
      seriousFindings.includes(form.clasificacionHallazgo) &&
      isInvalid(form.fechaCompromiso)
    ) {
      errors.push("La fecha compromiso es obligatoria para hallazgos mayores, críticos o reincidentes");
    }

    if (
      ["Cerrada eficaz", "Cerrada no eficaz", "Cierre aprobado", "Cierre rechazado"].includes(form.estadoCierre) &&
      isInvalid(form.verificacionEficacia)
    ) {
      errors.push("La verificación de eficacia es obligatoria para cerrar una auditoría o hallazgo");
    }

    if (
      ["Requiere CAPA", "Requiere investigación", "Requiere reauditoría"].includes(form.decisionQA) &&
      isInvalid(form.accionRequerida)
    ) {
      errors.push("La acción requerida es obligatoria cuando QA exige CAPA, investigación o reauditoría");
    }

    return Array.from(new Set(errors));
  }

  function fieldHasError(field: keyof AuditoriaRecord): boolean {
    if (!submitAttempted) return false;

    const nonConformingFindings = [
      "Observación",
      "Oportunidad de mejora",
      "No conformidad menor",
      "No conformidad mayor",
      "Hallazgo crítico",
      "Reincidencia",
    ];

    const seriousFindings = [
      "No conformidad mayor",
      "Hallazgo crítico",
      "Reincidencia",
    ];

    if (requiredFields.includes(field) && isInvalid(form[field])) return true;

    if (
      field === "descripcionHallazgo" &&
      nonConformingFindings.includes(form.clasificacionHallazgo) &&
      isInvalid(form.descripcionHallazgo)
    ) {
      return true;
    }

    if (
      field === "accionRequerida" &&
      (
        seriousFindings.includes(form.clasificacionHallazgo) ||
        ["Requiere CAPA", "Requiere investigación", "Requiere reauditoría"].includes(form.decisionQA)
      ) &&
      isInvalid(form.accionRequerida)
    ) {
      return true;
    }

    if (
      field === "responsableCierre" &&
      seriousFindings.includes(form.clasificacionHallazgo) &&
      isInvalid(form.responsableCierre)
    ) {
      return true;
    }

    if (
      field === "fechaCompromiso" &&
      seriousFindings.includes(form.clasificacionHallazgo) &&
      isInvalid(form.fechaCompromiso)
    ) {
      return true;
    }

    if (
      field === "verificacionEficacia" &&
      ["Cerrada eficaz", "Cerrada no eficaz", "Cierre aprobado", "Cierre rechazado"].includes(form.estadoCierre) &&
      isInvalid(form.verificacionEficacia)
    ) {
      return true;
    }

    return false;
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setSubmitAttempted(false);
    setValidationErrors([]);
    setToast("");
  }

  function handleSubmit() {
    setSubmitAttempted(true);

    const errors = validateForm();

    if (errors.length > 0) {
      showToast("No se guardó la auditoría. Completa los campos obligatorios.", errors);
      return;
    }

    const timestamp = nowIso();

    const payload: AuditoriaRecord = {
      ...form,
      codigoAuditoria: clean(form.codigoAuditoria),
      fechaAuditoria: clean(form.fechaAuditoria),
      horaAuditoria: clean(form.horaAuditoria),
      empresa: clean(form.empresa),
      sede: clean(form.sede),
      auditorLider: clean(form.auditorLider),
      equipoAuditor: clean(form.equipoAuditor),
      tipoAuditoria: clean(form.tipoAuditoria),
      areaAuditada: clean(form.areaAuditada),
      responsableArea: clean(form.responsableArea),
      alcance: clean(form.alcance),
      normaReferencia: clean(form.normaReferencia),
      criterioAuditado: clean(form.criterioAuditado),
      resultadoEvaluacion: clean(form.resultadoEvaluacion),
      clasificacionHallazgo: clean(form.clasificacionHallazgo),
      descripcionHallazgo: clean(form.descripcionHallazgo),
      evidencia: clean(form.evidencia),
      accionRequerida: clean(form.accionRequerida),
      responsableCierre: clean(form.responsableCierre),
      fechaCompromiso: clean(form.fechaCompromiso),
      estadoCierre: clean(form.estadoCierre),
      verificacionEficacia: clean(form.verificacionEficacia),
      decisionQA: clean(form.decisionQA),
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

    showToast(
      editingId
        ? "Auditoría actualizada correctamente con trazabilidad."
        : "Auditoría interna registrada correctamente con control GACP/GMP."
    );
  }

  function handleEdit(record: AuditoriaRecord) {
    setForm(record);
    setEditingId(record.id);
    setSubmitAttempted(false);
    showToast("Auditoría cargada para edición. Verifica antes de actualizar.");
  }

  function handleDelete(id: string) {
    const confirmed = window.confirm(
      "¿Confirmas eliminar esta auditoría? En ambiente GMP real esto debería manejarse como anulación auditada."
    );

    if (!confirmed) return;

    const nextRecords = records.filter((record) => record.id !== id);
    setRecords(nextRecords);
    saveRecords(nextRecords);
    showToast("Auditoría eliminada del almacenamiento local.");
  }

  function exportJson() {
    if (records.length === 0) {
      showToast("No hay auditorías para exportar.");
      return;
    }

    const blob = new Blob([JSON.stringify(records, null, 2)], {
      type: "application/json;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `floratrack-auditorias-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);

    showToast("Archivo JSON de auditorías exportado correctamente.");
  }

  const filteredRecords = useMemo(() => {
    const term = clean(search).toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        !term ||
        [
          record.codigoAuditoria,
          record.empresa,
          record.sede,
          record.auditorLider,
          record.tipoAuditoria,
          record.areaAuditada,
          record.responsableArea,
          record.normaReferencia,
          record.resultadoEvaluacion,
          record.clasificacionHallazgo,
          record.estadoCierre,
          record.decisionQA,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

      const matchesEstado = filterEstado === "Todos" || record.estadoCierre === filterEstado;

      return matchesSearch && matchesEstado;
    });
  }, [records, search, filterEstado]);

  const dashboard = useMemo(() => {
    return {
      total: records.length,
      conformes: records.filter((record) => record.clasificacionHallazgo === "Conforme").length,
      noConformes: records.filter((record) =>
        ["No conformidad menor", "No conformidad mayor", "Hallazgo crítico", "Reincidencia"].includes(record.clasificacionHallazgo)
      ).length,
      abiertas: records.filter((record) =>
        ["Abierta", "En análisis", "Acción definida", "En ejecución", "Pendiente verificación"].includes(record.estadoCierre)
      ).length,
      cerradas: records.filter((record) =>
        ["Cerrada eficaz", "Cierre aprobado"].includes(record.estadoCierre)
      ).length,
    };
  }, [records]);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-slate-100">
      {toast && (
        <div
          role="alert"
          className="fixed right-5 top-5 z-[9999] max-w-xl rounded-3xl border border-amber-300/60 bg-slate-950 px-5 py-4 text-sm text-amber-100 shadow-2xl shadow-black/60"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-base font-black text-amber-200">{toast}</p>

              {validationErrors.length > 0 && (
                <ul className="mt-3 max-h-56 list-disc space-y-1 overflow-auto pl-5 text-amber-100">
                  {validationErrors.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setToast("");
                setValidationErrors([]);
              }}
              className="rounded-xl border border-amber-300/40 px-3 py-1 text-xs font-black text-amber-100 hover:bg-amber-500/10"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      <section className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-3xl border border-sky-400/20 bg-slate-900/80 p-6 shadow-2xl shadow-sky-950/30">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-300">
                FloraTrack Enterprise Compliance Platform
              </p>

              <h1 className="mt-3 text-3xl font-black text-white md:text-5xl">
                Auditorías internas GACP/GMP
              </h1>

              <p className="mt-3 max-w-5xl text-sm leading-6 text-slate-300 md:text-base">
                Registro electrónico de auditorías internas, autoinspecciones,
                criterios normativos, hallazgos, evidencias, acciones requeridas,
                cierre QA y verificación de eficacia.
              </p>
            </div>

            <div className="rounded-2xl border border-sky-400/20 bg-sky-500/10 px-5 py-4 text-sm text-sky-100">
              <p className="font-bold">Auditoría activa</p>
              <p className="mt-1 text-sky-200">
                GACP/GMP · Hallazgos · Evidencias · Cierre QA · Reauditoría
              </p>
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
          <Metric title="Auditorías" value={dashboard.total} />
          <Metric title="Conformes" value={dashboard.conformes} tone="emerald" />
          <Metric title="No conformes" value={dashboard.noConformes} tone="red" />
          <Metric title="Abiertas" value={dashboard.abiertas} tone="amber" />
          <Metric title="Cerradas" value={dashboard.cerradas} tone="sky" />
        </section>

        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <form
            noValidate
            className="rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-xl"
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmit();
            }}
          >
            <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">
                  {editingId ? "Editar auditoría" : "Nueva auditoría"}
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Ninguna auditoría puede guardarse vacía o incompleta.
                </p>
              </div>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-slate-600 px-4 py-2 text-sm font-bold text-slate-200 hover:bg-slate-800"
                >
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
                      <span className="mb-2 block text-sm font-bold text-slate-200">
                        {field.label}
                      </span>

                      <textarea
                        value={form[field.key]}
                        onChange={(event) => updateField(field.key, event.target.value)}
                        rows={4}
                        placeholder={field.placeholder}
                        className={`w-full rounded-2xl border px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 ${controlClass}`}
                      />

                      {hasError && (
                        <p className="mt-1 text-xs font-bold text-red-300">
                          Campo obligatorio o condición de auditoría requerida.
                        </p>
                      )}
                    </label>
                  );
                }

                if (field.kind === "select") {
                  return (
                    <label key={field.key}>
                      <span className="mb-2 block text-sm font-bold text-slate-200">
                        {field.label}
                      </span>

                      <select
                        value={form[field.key]}
                        onChange={(event) => updateField(field.key, event.target.value)}
                        className={`w-full rounded-2xl border px-4 py-3 text-sm text-white outline-none transition ${controlClass}`}
                      >
                        <option value="">Seleccione</option>
                        {(field.options ?? []).map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>

                      {hasError && (
                        <p className="mt-1 text-xs font-bold text-red-300">
                          Selecciona una opción válida.
                        </p>
                      )}
                    </label>
                  );
                }

                return (
                  <label key={field.key}>
                    <span className="mb-2 block text-sm font-bold text-slate-200">
                      {field.label}
                    </span>

                    <input
                      type={field.type ?? "text"}
                      value={form[field.key]}
                      onChange={(event) => updateField(field.key, event.target.value)}
                      placeholder={field.placeholder}
                      className={`w-full rounded-2xl border px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 ${controlClass}`}
                    />

                    {hasError && (
                      <p className="mt-1 text-xs font-bold text-red-300">
                        Completa este campo antes de guardar.
                      </p>
                    )}
                  </label>
                );
              })}
            </div>

            <div className="mt-6 flex flex-col gap-3 md:flex-row">
              <button
                type="submit"
                className="rounded-2xl bg-sky-500 px-6 py-3 text-sm font-black text-slate-950 shadow-lg shadow-sky-950/50 transition hover:bg-sky-400"
              >
                {editingId ? "Actualizar auditoría" : "Guardar auditoría"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="rounded-2xl border border-slate-600 px-6 py-3 text-sm font-bold text-slate-200 transition hover:bg-slate-800"
              >
                Limpiar formulario
              </button>
            </div>
          </form>

          <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">
                  Registro maestro de auditorías
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Consulta, filtra, edita y exporta auditorías internas.
                </p>
              </div>

              <button
                type="button"
                onClick={exportJson}
                className="rounded-2xl border border-sky-400/50 px-5 py-3 text-sm font-bold text-sky-200 transition hover:bg-sky-500/10"
              >
                Exportar JSON
              </button>
            </div>

            <div className="mb-5 grid gap-3 md:grid-cols-[1fr_240px]">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-sky-400/40 transition placeholder:text-slate-600 focus:border-sky-400 focus:ring-4"
                placeholder="Buscar por código, área, auditor, norma, hallazgo..."
              />

              <select
                value={filterEstado}
                onChange={(event) => setFilterEstado(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-sky-400/40 transition focus:border-sky-400 focus:ring-4"
              >
                <option>Todos</option>
                <option>Abierta</option>
                <option>En análisis</option>
                <option>Acción definida</option>
                <option>En ejecución</option>
                <option>Pendiente verificación</option>
                <option>Cerrada eficaz</option>
                <option>Cerrada no eficaz</option>
                <option>Vencida</option>
                <option>Cancelada por QA</option>
              </select>
            </div>

            <div className="max-h-[780px] space-y-4 overflow-auto pr-2">
              {filteredRecords.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center text-sm text-slate-400">
                  No hay auditorías registradas. Crea el primer registro con datos completos.
                </div>
              ) : (
                filteredRecords.map((record) => (
                  <article key={record.id} className="rounded-2xl border border-slate-700 bg-slate-950 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-white">{record.codigoAuditoria}</h3>
                          <StatusPill value={record.clasificacionHallazgo} />
                          <span className="rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs font-bold text-sky-200">
                            {record.estadoCierre}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-400">
                          {record.fechaAuditoria} · {record.horaAuditoria} · {record.areaAuditada}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(record)}
                          className="rounded-xl border border-slate-600 px-3 py-2 text-xs font-bold text-slate-200 hover:bg-slate-800"
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(record.id)}
                          className="rounded-xl border border-red-400/40 px-3 py-2 text-xs font-bold text-red-200 hover:bg-red-500/10"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                      <Data label="Empresa" value={record.empresa} />
                      <Data label="Sede" value={record.sede} />
                      <Data label="Auditor líder" value={record.auditorLider} />
                      <Data label="Tipo auditoría" value={record.tipoAuditoria} />
                      <Data label="Responsable área" value={record.responsableArea} />
                      <Data label="Norma" value={record.normaReferencia} />
                      <Data label="Resultado" value={record.resultadoEvaluacion} />
                      <Data label="Decisión QA" value={record.decisionQA} />
                      <Data label="Responsable cierre" value={record.responsableCierre || "Sin registro"} />
                      <Data label="Fecha compromiso" value={record.fechaCompromiso || "Sin registro"} />
                      <Data label="Evidencia" value={record.evidencia || "Sin registro"} />
                      <Data label="Equipo auditor" value={record.equipoAuditor || "Sin registro"} />
                    </div>

                    <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300">
                      <p>
                        <span className="font-bold text-slate-100">Alcance: </span>
                        {record.alcance}
                      </p>

                      <p className="mt-2">
                        <span className="font-bold text-slate-100">Criterio auditado: </span>
                        {record.criterioAuditado}
                      </p>

                      {record.descripcionHallazgo && (
                        <p className="mt-2">
                          <span className="font-bold text-slate-100">Hallazgo: </span>
                          {record.descripcionHallazgo}
                        </p>
                      )}

                      {record.accionRequerida && (
                        <p className="mt-2">
                          <span className="font-bold text-slate-100">Acción requerida: </span>
                          {record.accionRequerida}
                        </p>
                      )}

                      {record.verificacionEficacia && (
                        <p className="mt-2">
                          <span className="font-bold text-slate-100">Verificación: </span>
                          {record.verificacionEficacia}
                        </p>
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

function Metric({
  title,
  value,
  tone = "slate",
}: {
  title: string;
  value: number;
  tone?: "slate" | "emerald" | "amber" | "red" | "sky";
}) {
  const toneClass =
    tone === "emerald"
      ? "text-emerald-300"
      : tone === "amber"
      ? "text-amber-300"
      : tone === "red"
      ? "text-red-300"
      : tone === "sky"
      ? "text-sky-300"
      : "text-white";

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
    value === "Conforme"
      ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
      : value === "Hallazgo crítico" || value === "Reincidencia"
      ? "border-red-400/40 bg-red-500/10 text-red-200"
      : value === "No conformidad mayor"
      ? "border-orange-400/40 bg-orange-500/10 text-orange-200"
      : value === "No conformidad menor"
      ? "border-amber-400/40 bg-amber-500/10 text-amber-200"
      : "border-sky-400/40 bg-sky-500/10 text-sky-200";

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-bold ${className}`}>
      {value || "Sin clasificación"}
    </span>
  );
}
