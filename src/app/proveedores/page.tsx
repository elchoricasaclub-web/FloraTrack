"use client";

import { useEffect, useMemo, useState } from "react";

type SupplierRecord = {
  id: string;
  codigoProveedor: string;
  nombreProveedor: string;
  identificacionFiscal: string;
  fechaCalificacion: string;
  empresa: string;
  sede: string;
  paisCiudad: string;
  contacto: string;
  correo: string;
  telefono: string;
  tipoProveedor: string;
  categoriaMaterial: string;
  servicioProducto: string;
  criticidad: string;
  riesgoCalidad: string;
  estadoProveedor: string;
  alcanceAprobado: string;
  documentosEvaluados: string;
  certificaciones: string;
  fechaVencimientoDocumental: string;
  fechaProximaReevaluacion: string;
  resultadoEvaluacion: string;
  puntaje: string;
  decisionQA: string;
  requiereAuditoria: string;
  fechaAuditoria: string;
  desviacionAsociada: string;
  planAccion: string;
  evidencia: string;
  observaciones: string;
  creadoEn: string;
  actualizadoEn: string;
};

type FieldConfig = {
  key: keyof SupplierRecord;
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

const STORAGE_KEY = "floratrack_proveedores_calificacion_v1";

const emptyForm: SupplierRecord = {
  id: "",
  codigoProveedor: "",
  nombreProveedor: "",
  identificacionFiscal: "",
  fechaCalificacion: "",
  empresa: "",
  sede: "",
  paisCiudad: "",
  contacto: "",
  correo: "",
  telefono: "",
  tipoProveedor: "",
  categoriaMaterial: "",
  servicioProducto: "",
  criticidad: "",
  riesgoCalidad: "",
  estadoProveedor: "",
  alcanceAprobado: "",
  documentosEvaluados: "",
  certificaciones: "",
  fechaVencimientoDocumental: "",
  fechaProximaReevaluacion: "",
  resultadoEvaluacion: "",
  puntaje: "",
  decisionQA: "",
  requiereAuditoria: "",
  fechaAuditoria: "",
  desviacionAsociada: "",
  planAccion: "",
  evidencia: "",
  observaciones: "",
  creadoEn: "",
  actualizadoEn: "",
};

const requiredFields: Array<keyof SupplierRecord> = [
  "codigoProveedor",
  "nombreProveedor",
  "identificacionFiscal",
  "fechaCalificacion",
  "empresa",
  "sede",
  "paisCiudad",
  "contacto",
  "tipoProveedor",
  "categoriaMaterial",
  "servicioProducto",
  "criticidad",
  "riesgoCalidad",
  "estadoProveedor",
  "alcanceAprobado",
  "documentosEvaluados",
  "fechaProximaReevaluacion",
  "resultadoEvaluacion",
  "decisionQA",
  "requiereAuditoria",
];

const fieldLabels: Record<keyof SupplierRecord, string> = {
  id: "ID",
  codigoProveedor: "Código de proveedor",
  nombreProveedor: "Nombre del proveedor",
  identificacionFiscal: "NIT / identificación fiscal",
  fechaCalificacion: "Fecha de calificación",
  empresa: "Empresa",
  sede: "Sede / predio",
  paisCiudad: "País / ciudad",
  contacto: "Contacto",
  correo: "Correo",
  telefono: "Teléfono",
  tipoProveedor: "Tipo de proveedor",
  categoriaMaterial: "Categoría de material / servicio",
  servicioProducto: "Servicio o producto suministrado",
  criticidad: "Criticidad",
  riesgoCalidad: "Riesgo de calidad",
  estadoProveedor: "Estado del proveedor",
  alcanceAprobado: "Alcance aprobado",
  documentosEvaluados: "Documentos evaluados",
  certificaciones: "Certificaciones",
  fechaVencimientoDocumental: "Vencimiento documental",
  fechaProximaReevaluacion: "Próxima reevaluación",
  resultadoEvaluacion: "Resultado de evaluación",
  puntaje: "Puntaje",
  decisionQA: "Decisión QA",
  requiereAuditoria: "Requiere auditoría",
  fechaAuditoria: "Fecha de auditoría",
  desviacionAsociada: "Desviación asociada",
  planAccion: "Plan de acción",
  evidencia: "Evidencia",
  observaciones: "Observaciones",
  creadoEn: "Creado en",
  actualizadoEn: "Actualizado en",
};

const fields: FieldConfig[] = [
  { key: "codigoProveedor", label: "Código de proveedor *", placeholder: "PROV-2026-001" },
  { key: "nombreProveedor", label: "Nombre del proveedor *", placeholder: "Proveedor certificado S.A.S." },
  { key: "identificacionFiscal", label: "NIT / identificación fiscal *", placeholder: "900000000-1" },
  { key: "fechaCalificacion", label: "Fecha de calificación *", type: "date" },
  { key: "empresa", label: "Empresa *", placeholder: "Growlifecol S.A.S." },
  { key: "sede", label: "Sede / predio *", placeholder: "Sede principal" },
  { key: "paisCiudad", label: "País / ciudad *", placeholder: "Colombia / Bogotá" },
  { key: "contacto", label: "Contacto *", placeholder: "Nombre del contacto comercial o técnico" },
  { key: "correo", label: "Correo", type: "email", placeholder: "calidad@proveedor.com" },
  { key: "telefono", label: "Teléfono", placeholder: "+57 300 000 0000" },
  {
    key: "tipoProveedor",
    label: "Tipo de proveedor *",
    kind: "select",
    options: [
      "Insumos agrícolas",
      "Material vegetal",
      "Material de empaque",
      "Laboratorio externo",
      "Calibración",
      "Mantenimiento",
      "Limpieza y saneamiento",
      "Transporte",
      "Almacenamiento",
      "Servicios regulatorios",
      "Consultoría técnica",
      "Equipos",
      "Reactivos / estándares",
      "Servicios críticos GMP",
      "Otro",
    ],
  },
  {
    key: "categoriaMaterial",
    label: "Categoría de material / servicio *",
    kind: "select",
    options: [
      "Crítico GMP",
      "Crítico GACP",
      "No crítico",
      "Material directo",
      "Material indirecto",
      "Servicio tercerizado crítico",
      "Servicio tercerizado no crítico",
      "Laboratorio contratado",
      "Proveedor documental",
      "Proveedor logístico",
    ],
  },
  {
    key: "servicioProducto",
    label: "Servicio o producto suministrado *",
    kind: "textarea",
    placeholder: "Describe insumo, servicio, material, equipo o proceso tercerizado suministrado.",
  },
  {
    key: "criticidad",
    label: "Criticidad *",
    kind: "select",
    options: ["Baja", "Media", "Alta", "Crítica"],
  },
  {
    key: "riesgoCalidad",
    label: "Riesgo de calidad *",
    kind: "select",
    options: ["Bajo", "Medio", "Alto", "Crítico"],
  },
  {
    key: "estadoProveedor",
    label: "Estado del proveedor *",
    kind: "select",
    options: [
      "En evaluación",
      "Aprobado",
      "Aprobado condicional",
      "Suspendido",
      "Rechazado",
      "Bloqueado QA",
      "Vencido documentalmente",
      "Pendiente reevaluación",
    ],
  },
  {
    key: "alcanceAprobado",
    label: "Alcance aprobado *",
    kind: "textarea",
    placeholder: "Define para qué productos, servicios, materiales, lotes o procesos está aprobado.",
  },
  {
    key: "documentosEvaluados",
    label: "Documentos evaluados *",
    kind: "textarea",
    placeholder: "Cámara de comercio, RUT, certificaciones, fichas técnicas, COA, SDS, acuerdos de calidad, licencias, etc.",
  },
  { key: "certificaciones", label: "Certificaciones", placeholder: "GMP, ISO 9001, ISO 17025, GACP, INVIMA, ICA..." },
  { key: "fechaVencimientoDocumental", label: "Vencimiento documental", type: "date" },
  { key: "fechaProximaReevaluacion", label: "Próxima reevaluación *", type: "date" },
  {
    key: "resultadoEvaluacion",
    label: "Resultado de evaluación *",
    kind: "select",
    options: ["Conforme", "Con observaciones", "No conforme", "Pendiente información", "Requiere auditoría"],
  },
  { key: "puntaje", label: "Puntaje", type: "number", placeholder: "85" },
  {
    key: "decisionQA",
    label: "Decisión QA *",
    kind: "select",
    options: [
      "Pendiente QA",
      "Aprobado QA",
      "Aprobado condicional QA",
      "Rechazado QA",
      "Suspendido QA",
      "Requiere CAPA",
      "Requiere auditoría",
    ],
  },
  {
    key: "requiereAuditoria",
    label: "Requiere auditoría *",
    kind: "select",
    options: ["Sí", "No"],
  },
  { key: "fechaAuditoria", label: "Fecha de auditoría", type: "date" },
  { key: "desviacionAsociada", label: "Desviación asociada", placeholder: "DEV-2026-001 / CAPA-001" },
  {
    key: "planAccion",
    label: "Plan de acción / CAPA",
    kind: "textarea",
    placeholder: "Obligatorio si hay no conformidad, aprobación condicional, suspensión o CAPA.",
  },
  { key: "evidencia", label: "Evidencia / soporte", placeholder: "Checklist, acta, contrato, certificado, PDF, enlace documental..." },
  {
    key: "observaciones",
    label: "Observaciones",
    kind: "textarea",
    placeholder: "Notas QA, restricciones, condiciones de uso, seguimiento, impacto regulatorio.",
  },
];

function clean(value: unknown): string {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function isInvalid(value: unknown): boolean {
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
  ].includes(clean(value).toLowerCase());
}

function safeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `PROV-${Date.now()}-${Math.random().toString(16).slice(2)}`;
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

function loadRecords(): SupplierRecord[] {
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

function saveRecords(records: SupplierRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export default function ProveedoresPage() {
  const [records, setRecords] = useState<SupplierRecord[]>([]);
  const [form, setForm] = useState<SupplierRecord>(emptyForm);
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

  function updateField(field: keyof SupplierRecord, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function validateForm(): string[] {
    const errors = requiredFields
      .filter((field) => isInvalid(form[field]))
      .map((field) => fieldLabels[field]);

    if (form.puntaje) {
      const score = Number(form.puntaje);

      if (!Number.isFinite(score) || score < 0 || score > 100) {
        errors.push("El puntaje debe estar entre 0 y 100");
      }
    }

    if (
      ["Alta", "Crítica"].includes(form.criticidad) &&
      isInvalid(form.fechaVencimientoDocumental)
    ) {
      errors.push("El vencimiento documental es obligatorio para proveedores de criticidad Alta o Crítica");
    }

    if (
      ["Alto", "Crítico"].includes(form.riesgoCalidad) &&
      form.requiereAuditoria === "No"
    ) {
      errors.push("Un proveedor de riesgo Alto o Crítico debe requerir auditoría o justificación QA");
    }

    if (
      form.requiereAuditoria === "Sí" &&
      isInvalid(form.fechaAuditoria)
    ) {
      errors.push("La fecha de auditoría es obligatoria cuando el proveedor requiere auditoría");
    }

    if (
      ["Aprobado QA", "Aprobado condicional QA", "Rechazado QA", "Suspendido QA"].includes(form.decisionQA) &&
      isInvalid(form.evidencia)
    ) {
      errors.push("La evidencia es obligatoria cuando QA toma una decisión formal");
    }

    const needsCapa =
      ["No conforme", "Con observaciones", "Requiere auditoría"].includes(form.resultadoEvaluacion) ||
      ["Aprobado condicional", "Suspendido", "Rechazado", "Bloqueado QA", "Vencido documentalmente"].includes(form.estadoProveedor) ||
      ["Aprobado condicional QA", "Rechazado QA", "Suspendido QA", "Requiere CAPA", "Requiere auditoría"].includes(form.decisionQA);

    if (needsCapa && isInvalid(form.planAccion)) {
      errors.push("El plan de acción / CAPA es obligatorio por condición de riesgo, no conformidad o decisión QA");
    }

    if (needsCapa && isInvalid(form.desviacionAsociada)) {
      errors.push("La desviación asociada es obligatoria cuando se requiere CAPA o existe condición crítica");
    }

    if (
      form.fechaVencimientoDocumental &&
      form.fechaCalificacion &&
      isDateBefore(form.fechaVencimientoDocumental, form.fechaCalificacion)
    ) {
      errors.push("El vencimiento documental no puede ser anterior a la fecha de calificación");
    }

    if (
      form.fechaProximaReevaluacion &&
      form.fechaCalificacion &&
      isDateBefore(form.fechaProximaReevaluacion, form.fechaCalificacion)
    ) {
      errors.push("La próxima reevaluación no puede ser anterior a la fecha de calificación");
    }

    return Array.from(new Set(errors));
  }

  function fieldHasError(field: keyof SupplierRecord): boolean {
    if (!submitAttempted) return false;

    const needsCapa =
      ["No conforme", "Con observaciones", "Requiere auditoría"].includes(form.resultadoEvaluacion) ||
      ["Aprobado condicional", "Suspendido", "Rechazado", "Bloqueado QA", "Vencido documentalmente"].includes(form.estadoProveedor) ||
      ["Aprobado condicional QA", "Rechazado QA", "Suspendido QA", "Requiere CAPA", "Requiere auditoría"].includes(form.decisionQA);

    if (requiredFields.includes(field) && isInvalid(form[field])) return true;

    if (field === "puntaje" && form.puntaje) {
      const score = Number(form.puntaje);
      return !Number.isFinite(score) || score < 0 || score > 100;
    }

    if (field === "fechaVencimientoDocumental" && ["Alta", "Crítica"].includes(form.criticidad) && isInvalid(form.fechaVencimientoDocumental)) return true;
    if (field === "fechaAuditoria" && form.requiereAuditoria === "Sí" && isInvalid(form.fechaAuditoria)) return true;
    if (field === "evidencia" && ["Aprobado QA", "Aprobado condicional QA", "Rechazado QA", "Suspendido QA"].includes(form.decisionQA) && isInvalid(form.evidencia)) return true;
    if (field === "planAccion" && needsCapa && isInvalid(form.planAccion)) return true;
    if (field === "desviacionAsociada" && needsCapa && isInvalid(form.desviacionAsociada)) return true;
    if (field === "fechaVencimientoDocumental" && form.fechaVencimientoDocumental && form.fechaCalificacion && isDateBefore(form.fechaVencimientoDocumental, form.fechaCalificacion)) return true;
    if (field === "fechaProximaReevaluacion" && form.fechaProximaReevaluacion && form.fechaCalificacion && isDateBefore(form.fechaProximaReevaluacion, form.fechaCalificacion)) return true;

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
      showCloud("No se guardó el proveedor. Completa la información obligatoria.", errors, "warning");
      return;
    }

    const timestamp = nowIso();

    const payload: SupplierRecord = {
      ...form,
      codigoProveedor: clean(form.codigoProveedor),
      nombreProveedor: clean(form.nombreProveedor),
      identificacionFiscal: clean(form.identificacionFiscal),
      fechaCalificacion: clean(form.fechaCalificacion),
      empresa: clean(form.empresa),
      sede: clean(form.sede),
      paisCiudad: clean(form.paisCiudad),
      contacto: clean(form.contacto),
      correo: clean(form.correo),
      telefono: clean(form.telefono),
      tipoProveedor: clean(form.tipoProveedor),
      categoriaMaterial: clean(form.categoriaMaterial),
      servicioProducto: clean(form.servicioProducto),
      criticidad: clean(form.criticidad),
      riesgoCalidad: clean(form.riesgoCalidad),
      estadoProveedor: clean(form.estadoProveedor),
      alcanceAprobado: clean(form.alcanceAprobado),
      documentosEvaluados: clean(form.documentosEvaluados),
      certificaciones: clean(form.certificaciones),
      fechaVencimientoDocumental: clean(form.fechaVencimientoDocumental),
      fechaProximaReevaluacion: clean(form.fechaProximaReevaluacion),
      resultadoEvaluacion: clean(form.resultadoEvaluacion),
      puntaje: clean(form.puntaje),
      decisionQA: clean(form.decisionQA),
      requiereAuditoria: clean(form.requiereAuditoria),
      fechaAuditoria: clean(form.fechaAuditoria),
      desviacionAsociada: clean(form.desviacionAsociada),
      planAccion: clean(form.planAccion),
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
      editingId
        ? "Proveedor actualizado correctamente con trazabilidad."
        : "Proveedor calificado correctamente con control GMP/GACP.",
      [],
      "success"
    );
  }

  function handleEdit(record: SupplierRecord) {
    setForm(record);
    setEditingId(record.id);
    setSubmitAttempted(false);
    showCloud("Proveedor cargado para edición. Verifica antes de actualizar.", [], "success");
  }

  function handleDelete(id: string) {
    const confirmed = window.confirm(
      "¿Confirmas eliminar este proveedor? En ambiente GMP real debería manejarse como inactivación o anulación auditada."
    );

    if (!confirmed) return;

    const nextRecords = records.filter((record) => record.id !== id);
    setRecords(nextRecords);
    saveRecords(nextRecords);
    showCloud("Proveedor eliminado del almacenamiento local.", [], "success");
  }

  function exportJson() {
    if (records.length === 0) {
      showCloud("No hay proveedores para exportar.", [], "warning");
      return;
    }

    const blob = new Blob([JSON.stringify(records, null, 2)], {
      type: "application/json;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `floratrack-proveedores-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);

    showCloud("Archivo JSON de proveedores exportado correctamente.", [], "success");
  }

  const filteredRecords = useMemo(() => {
    const term = clean(search).toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        !term ||
        [
          record.codigoProveedor,
          record.nombreProveedor,
          record.identificacionFiscal,
          record.tipoProveedor,
          record.categoriaMaterial,
          record.criticidad,
          record.riesgoCalidad,
          record.estadoProveedor,
          record.resultadoEvaluacion,
          record.decisionQA,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

      const matchesEstado =
        filterEstado === "Todos" || record.estadoProveedor === filterEstado;

      return matchesSearch && matchesEstado;
    });
  }, [records, search, filterEstado]);

  const dashboard = useMemo(() => {
    return {
      total: records.length,
      aprobados: records.filter((record) => ["Aprobado", "Aprobado condicional"].includes(record.estadoProveedor)).length,
      altoRiesgo: records.filter((record) => ["Alto", "Crítico"].includes(record.riesgoCalidad)).length,
      auditoria: records.filter((record) => record.requiereAuditoria === "Sí").length,
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
        <header className="rounded-3xl border border-violet-400/20 bg-slate-900/80 p-6 shadow-2xl shadow-violet-950/30">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-violet-300">
                FloraTrack Enterprise Compliance Platform
              </p>

              <h1 className="mt-3 text-3xl font-black text-white md:text-5xl">
                Proveedores y calificación GMP/GACP
              </h1>

              <p className="mt-3 max-w-5xl text-sm leading-6 text-slate-300 md:text-base">
                Evaluación, calificación, criticidad, riesgo, documentación,
                auditoría, CAPA, evidencia y decisión QA para proveedores críticos.
              </p>
            </div>

            <div className="rounded-2xl border border-violet-400/20 bg-violet-500/10 px-5 py-4 text-sm text-violet-100">
              <p className="font-bold">Supplier Quality activo</p>
              <p className="mt-1 text-violet-200">
                Proveedores · Riesgo · Auditoría · QA · CAPA
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
          <Metric title="Proveedores" value={dashboard.total} />
          <Metric title="Aprobados" value={dashboard.aprobados} tone="emerald" />
          <Metric title="Alto riesgo" value={dashboard.altoRiesgo} tone="red" />
          <Metric title="Auditoría" value={dashboard.auditoria} tone="amber" />
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
                <h2 className="text-2xl font-black text-white">
                  {editingId ? "Editar proveedor" : "Nuevo proveedor"}
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Ningún proveedor puede guardarse vacío o incompleto.
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
                  : "border-slate-700 bg-slate-950 focus:border-violet-400 focus:ring-4 focus:ring-violet-400/40";

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
                          Campo obligatorio o condición de proveedor requerida.
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
                type="button"
                onClick={handleSave}
                className="rounded-2xl bg-violet-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-violet-950/50 transition hover:bg-violet-400"
              >
                {editingId ? "Actualizar proveedor" : "Guardar proveedor"}
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
                  Registro maestro de proveedores
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Consulta, filtra, edita y exporta proveedores calificados.
                </p>
              </div>

              <button
                type="button"
                onClick={exportJson}
                className="rounded-2xl border border-violet-400/50 px-5 py-3 text-sm font-bold text-violet-200 transition hover:bg-violet-500/10"
              >
                Exportar JSON
              </button>
            </div>

            <div className="mb-5 grid gap-3 md:grid-cols-[1fr_250px]">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-violet-400/40 transition placeholder:text-slate-600 focus:border-violet-400 focus:ring-4"
                placeholder="Buscar por proveedor, tipo, riesgo, QA, estado..."
              />

              <select
                value={filterEstado}
                onChange={(event) => setFilterEstado(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-violet-400/40 transition focus:border-violet-400 focus:ring-4"
              >
                <option>Todos</option>
                <option>En evaluación</option>
                <option>Aprobado</option>
                <option>Aprobado condicional</option>
                <option>Suspendido</option>
                <option>Rechazado</option>
                <option>Bloqueado QA</option>
                <option>Vencido documentalmente</option>
                <option>Pendiente reevaluación</option>
              </select>
            </div>

            <div className="max-h-[780px] space-y-4 overflow-auto pr-2">
              {filteredRecords.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center text-sm text-slate-400">
                  No hay proveedores registrados. Crea el primer proveedor con datos completos.
                </div>
              ) : (
                filteredRecords.map((record) => (
                  <article key={record.id} className="rounded-2xl border border-slate-700 bg-slate-950 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-white">
                            {record.codigoProveedor} · {record.nombreProveedor}
                          </h3>
                          <StatusPill value={record.estadoProveedor} />
                          <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-xs font-bold text-violet-200">
                            Riesgo {record.riesgoCalidad}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-400">
                          {record.tipoProveedor} · {record.categoriaMaterial} · {record.paisCiudad}
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
                      <Data label="Identificación" value={record.identificacionFiscal} />
                      <Data label="Empresa" value={record.empresa} />
                      <Data label="Sede" value={record.sede} />
                      <Data label="Contacto" value={record.contacto} />
                      <Data label="Correo" value={record.correo || "Sin registro"} />
                      <Data label="Teléfono" value={record.telefono || "Sin registro"} />
                      <Data label="Criticidad" value={record.criticidad} />
                      <Data label="Resultado evaluación" value={record.resultadoEvaluacion} />
                      <Data label="Puntaje" value={record.puntaje || "Sin registro"} />
                      <Data label="Decisión QA" value={record.decisionQA} />
                      <Data label="Requiere auditoría" value={record.requiereAuditoria} />
                      <Data label="Fecha auditoría" value={record.fechaAuditoria || "Sin registro"} />
                      <Data label="Vencimiento documental" value={record.fechaVencimientoDocumental || "Sin registro"} />
                      <Data label="Próxima reevaluación" value={record.fechaProximaReevaluacion} />
                      <Data label="Certificaciones" value={record.certificaciones || "Sin registro"} />
                      <Data label="Evidencia" value={record.evidencia || "Sin registro"} />
                    </div>

                    <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300">
                      <p>
                        <span className="font-bold text-slate-100">Servicio / producto: </span>
                        {record.servicioProducto}
                      </p>

                      <p className="mt-2">
                        <span className="font-bold text-slate-100">Alcance aprobado: </span>
                        {record.alcanceAprobado}
                      </p>

                      <p className="mt-2">
                        <span className="font-bold text-slate-100">Documentos evaluados: </span>
                        {record.documentosEvaluados}
                      </p>

                      {record.desviacionAsociada && (
                        <p className="mt-2">
                          <span className="font-bold text-slate-100">Desviación: </span>
                          {record.desviacionAsociada}
                        </p>
                      )}

                      {record.planAccion && (
                        <p className="mt-2">
                          <span className="font-bold text-slate-100">Plan de acción / CAPA: </span>
                          {record.planAccion}
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
      <div className="relative pt-8">
        <span className={`absolute left-8 top-3 h-16 w-16 rounded-full border-2 shadow-2xl ${isSuccess ? "border-emerald-300 bg-emerald-400" : "border-amber-300 bg-amber-400"}`} />
        <span className={`absolute left-24 top-0 h-24 w-24 rounded-full border-2 shadow-2xl ${isSuccess ? "border-emerald-300 bg-emerald-400" : "border-amber-300 bg-amber-400"}`} />
        <span className={`absolute left-48 top-4 h-16 w-16 rounded-full border-2 shadow-2xl ${isSuccess ? "border-emerald-300 bg-emerald-400" : "border-amber-300 bg-amber-400"}`} />

        <section className={`relative overflow-hidden rounded-[2rem] border-2 bg-slate-950 p-6 text-white shadow-2xl ${
          isSuccess ? "border-emerald-300 shadow-emerald-950/60" : "border-amber-300 shadow-amber-950/60"
        }`}>
          <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-30 ${isSuccess ? "bg-emerald-400" : "bg-amber-400"}`} />
          <div className={`absolute -bottom-12 left-10 h-28 w-28 rounded-full opacity-20 ${isSuccess ? "bg-emerald-300" : "bg-amber-300"}`} />

          <div className="relative flex items-start justify-between gap-5">
            <div className="min-w-0 flex-1">
              <div className="flex items-start gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl font-black text-slate-950 shadow-lg ${
                  isSuccess ? "bg-emerald-300" : "bg-amber-300"
                }`}>
                  {isSuccess ? "✓" : "!"}
                </div>

                <div>
                  <p className={`text-xs font-black uppercase tracking-[0.28em] ${
                    isSuccess ? "text-emerald-200" : "text-amber-200"
                  }`}>
                    FloraTrack Cloud Notice
                  </p>

                  <p className="mt-2 text-lg font-black leading-snug text-white md:text-xl">
                    {message}
                  </p>
                </div>
              </div>

              {errors.length > 0 && (
                <div className="mt-5 rounded-3xl border border-white/20 bg-white p-5 text-slate-950 shadow-xl">
                  <p className="text-sm font-black uppercase tracking-wide text-slate-700">
                    Información pendiente antes de guardar
                  </p>

                  <ul className="mt-3 max-h-64 list-disc space-y-2 overflow-auto pl-5 text-sm font-bold leading-relaxed text-slate-950">
                    {errors.map((error) => (
                      <li key={error}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-2xl border border-white/30 bg-white px-4 py-2 text-xs font-black uppercase tracking-wide text-slate-950 shadow-lg transition hover:bg-slate-200"
            >
              Cerrar
            </button>
          </div>
        </section>
      </div>
    </div>
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
    value === "Aprobado"
      ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
      : value === "Aprobado condicional" || value === "Pendiente reevaluación" || value === "En evaluación"
      ? "border-amber-400/40 bg-amber-500/10 text-amber-200"
      : value === "Suspendido" || value === "Rechazado" || value === "Bloqueado QA" || value === "Vencido documentalmente"
      ? "border-red-400/40 bg-red-500/10 text-red-200"
      : "border-violet-400/40 bg-violet-500/10 text-violet-200";

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-bold ${className}`}>
      {value || "Sin estado"}
    </span>
  );
}
