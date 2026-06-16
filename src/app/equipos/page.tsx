"use client";

import { useEffect, useMemo, useState } from "react";

type EquipmentRecord = {
  id: string;
  codigoEquipo: string;
  nombreEquipo: string;
  codigoActivo: string;
  fechaRegistro: string;
  empresa: string;
  sede: string;
  area: string;
  ubicacion: string;
  responsable: string;
  tipoEquipo: string;
  marca: string;
  modelo: string;
  serie: string;
  proveedorServicio: string;
  criticidadGMP: string;
  estadoEquipo: string;
  requiereCalibracion: string;
  frecuenciaCalibracion: string;
  fechaUltimaCalibracion: string;
  fechaProximaCalibracion: string;
  estadoCalibracion: string;
  certificadoCalibracion: string;
  tipoMantenimiento: string;
  fechaMantenimiento: string;
  fechaProximoMantenimiento: string;
  estadoMantenimiento: string;
  resultadoIntervencion: string;
  liberacionQA: string;
  desviacionAsociada: string;
  accionCorrectiva: string;
  evidencia: string;
  observaciones: string;
  creadoEn: string;
  actualizadoEn: string;
};

type FieldConfig = {
  key: keyof EquipmentRecord;
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

const STORAGE_KEY = "floratrack_equipos_calibracion_mantenimiento_v1";

const emptyForm: EquipmentRecord = {
  id: "",
  codigoEquipo: "",
  nombreEquipo: "",
  codigoActivo: "",
  fechaRegistro: "",
  empresa: "",
  sede: "",
  area: "",
  ubicacion: "",
  responsable: "",
  tipoEquipo: "",
  marca: "",
  modelo: "",
  serie: "",
  proveedorServicio: "",
  criticidadGMP: "",
  estadoEquipo: "",
  requiereCalibracion: "",
  frecuenciaCalibracion: "",
  fechaUltimaCalibracion: "",
  fechaProximaCalibracion: "",
  estadoCalibracion: "",
  certificadoCalibracion: "",
  tipoMantenimiento: "",
  fechaMantenimiento: "",
  fechaProximoMantenimiento: "",
  estadoMantenimiento: "",
  resultadoIntervencion: "",
  liberacionQA: "",
  desviacionAsociada: "",
  accionCorrectiva: "",
  evidencia: "",
  observaciones: "",
  creadoEn: "",
  actualizadoEn: "",
};

const requiredFields: Array<keyof EquipmentRecord> = [
  "codigoEquipo",
  "nombreEquipo",
  "codigoActivo",
  "fechaRegistro",
  "empresa",
  "sede",
  "area",
  "ubicacion",
  "responsable",
  "tipoEquipo",
  "criticidadGMP",
  "estadoEquipo",
  "requiereCalibracion",
  "tipoMantenimiento",
  "estadoMantenimiento",
  "resultadoIntervencion",
  "liberacionQA",
];

const fieldLabels: Record<keyof EquipmentRecord, string> = {
  id: "ID",
  codigoEquipo: "Código de equipo",
  nombreEquipo: "Nombre del equipo",
  codigoActivo: "Código de activo",
  fechaRegistro: "Fecha de registro",
  empresa: "Empresa",
  sede: "Sede / predio",
  area: "Área",
  ubicacion: "Ubicación",
  responsable: "Responsable",
  tipoEquipo: "Tipo de equipo",
  marca: "Marca",
  modelo: "Modelo",
  serie: "Serie",
  proveedorServicio: "Proveedor de servicio",
  criticidadGMP: "Criticidad GMP",
  estadoEquipo: "Estado del equipo",
  requiereCalibracion: "Requiere calibración",
  frecuenciaCalibracion: "Frecuencia de calibración",
  fechaUltimaCalibracion: "Última calibración",
  fechaProximaCalibracion: "Próxima calibración",
  estadoCalibracion: "Estado de calibración",
  certificadoCalibracion: "Certificado de calibración",
  tipoMantenimiento: "Tipo de mantenimiento",
  fechaMantenimiento: "Fecha de mantenimiento",
  fechaProximoMantenimiento: "Próximo mantenimiento",
  estadoMantenimiento: "Estado de mantenimiento",
  resultadoIntervencion: "Resultado de intervención",
  liberacionQA: "Liberación QA",
  desviacionAsociada: "Desviación asociada",
  accionCorrectiva: "Acción correctiva / CAPA",
  evidencia: "Evidencia",
  observaciones: "Observaciones",
  creadoEn: "Creado en",
  actualizadoEn: "Actualizado en",
};

const fields: FieldConfig[] = [
  { key: "codigoEquipo", label: "Código de equipo *", placeholder: "EQ-2026-001" },
  { key: "nombreEquipo", label: "Nombre del equipo *", placeholder: "Balanza analítica / freezer / extractor / HPLC..." },
  { key: "codigoActivo", label: "Código de activo *", placeholder: "ACT-QA-001 / INV-EQ-001" },
  { key: "fechaRegistro", label: "Fecha de registro *", type: "date" },
  { key: "empresa", label: "Empresa *", placeholder: "Growlifecol S.A.S." },
  { key: "sede", label: "Sede / predio *", placeholder: "Sede principal / laboratorio / cultivo" },
  {
    key: "area",
    label: "Área *",
    kind: "select",
    options: [
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
      "Almacén",
      "Regulatorio",
    ],
  },
  { key: "ubicacion", label: "Ubicación *", placeholder: "Cuarto frío, laboratorio QC, sala de extracción, invernadero..." },
  { key: "responsable", label: "Responsable *", placeholder: "Responsable del equipo / custodio" },
  {
    key: "tipoEquipo",
    label: "Tipo de equipo *",
    kind: "select",
    options: [
      "Balanza",
      "Termohigrómetro",
      "Nevera / refrigerador",
      "Freezer",
      "HPLC",
      "GC-MS",
      "pH metro",
      "Conductímetro",
      "Autoclave",
      "Cabina de flujo laminar",
      "Microscopio",
      "Extractor BHO",
      "Prensa rosin",
      "Lavadora Bubble Hash",
      "Tamiz / malla",
      "Bomba de vacío",
      "Compresor",
      "Sistema HVAC",
      "Sistema de riego",
      "Sensor ambiental",
      "Equipo de limpieza",
      "Otro",
    ],
  },
  { key: "marca", label: "Marca", placeholder: "Marca del equipo" },
  { key: "modelo", label: "Modelo", placeholder: "Modelo / referencia" },
  { key: "serie", label: "Serie", placeholder: "Número de serie" },
  { key: "proveedorServicio", label: "Proveedor de servicio", placeholder: "Proveedor de calibración / mantenimiento" },
  {
    key: "criticidadGMP",
    label: "Criticidad GMP *",
    kind: "select",
    options: ["Baja", "Media", "Alta", "Crítica"],
  },
  {
    key: "estadoEquipo",
    label: "Estado del equipo *",
    kind: "select",
    options: [
      "Disponible",
      "En uso",
      "Cuarentena",
      "Fuera de servicio",
      "En mantenimiento",
      "Pendiente calibración",
      "Pendiente liberación QA",
      "Retirado",
    ],
  },
  {
    key: "requiereCalibracion",
    label: "Requiere calibración *",
    kind: "select",
    options: ["Sí", "No"],
  },
  {
    key: "frecuenciaCalibracion",
    label: "Frecuencia de calibración",
    kind: "select",
    options: ["Mensual", "Trimestral", "Semestral", "Anual", "Cada uso", "Según evento", "No aplica"],
  },
  { key: "fechaUltimaCalibracion", label: "Última calibración", type: "date" },
  { key: "fechaProximaCalibracion", label: "Próxima calibración", type: "date" },
  {
    key: "estadoCalibracion",
    label: "Estado de calibración",
    kind: "select",
    options: [
      "Vigente",
      "Vencida",
      "No aplica",
      "Pendiente certificado",
      "Fuera de tolerancia",
      "En verificación",
      "Requiere recalibración",
    ],
  },
  { key: "certificadoCalibracion", label: "Certificado de calibración", placeholder: "CERT-CAL-001 / enlace / PDF / acta" },
  {
    key: "tipoMantenimiento",
    label: "Tipo de mantenimiento *",
    kind: "select",
    options: [
      "Preventivo",
      "Correctivo",
      "Predictivo",
      "Limpieza técnica",
      "Verificación operativa",
      "Instalación / calificación",
      "No aplica",
    ],
  },
  { key: "fechaMantenimiento", label: "Fecha de mantenimiento", type: "date" },
  { key: "fechaProximoMantenimiento", label: "Próximo mantenimiento", type: "date" },
  {
    key: "estadoMantenimiento",
    label: "Estado de mantenimiento *",
    kind: "select",
    options: [
      "Al día",
      "Programado",
      "Ejecutado",
      "Vencido",
      "Pendiente proveedor",
      "Requiere correctivo",
      "No aplica",
    ],
  },
  {
    key: "resultadoIntervencion",
    label: "Resultado de intervención *",
    kind: "select",
    options: [
      "Conforme",
      "Con observación",
      "No conforme",
      "Pendiente ejecución",
      "Equipo liberado",
      "Equipo retenido",
      "Equipo fuera de servicio",
    ],
  },
  {
    key: "liberacionQA",
    label: "Liberación QA *",
    kind: "select",
    options: [
      "Pendiente QA",
      "Liberado QA",
      "Retenido QA",
      "Rechazado QA",
      "Requiere desviación",
      "No aplica",
    ],
  },
  { key: "desviacionAsociada", label: "Desviación asociada", placeholder: "DEV-2026-001 / CAPA-001" },
  {
    key: "accionCorrectiva",
    label: "Acción correctiva / CAPA",
    kind: "textarea",
    placeholder: "Obligatoria si el equipo está fuera de servicio, fuera de tolerancia, vencido o no conforme.",
  },
  { key: "evidencia", label: "Evidencia / soporte", placeholder: "Certificado, foto, orden de trabajo, acta, QR, informe técnico..." },
  {
    key: "observaciones",
    label: "Observaciones",
    kind: "textarea",
    placeholder: "Notas de uso, restricciones, impacto sobre lotes, condiciones, seguimiento QA.",
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

  return `EQ-${Date.now()}-${Math.random().toString(16).slice(2)}`;
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

function loadRecords(): EquipmentRecord[] {
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

function saveRecords(records: EquipmentRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export default function EquiposPage() {
  const [records, setRecords] = useState<EquipmentRecord[]>([]);
  const [form, setForm] = useState<EquipmentRecord>(emptyForm);
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

  function updateField(field: keyof EquipmentRecord, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function validateForm(): string[] {
    const errors = requiredFields
      .filter((field) => isInvalid(form[field]))
      .map((field) => fieldLabels[field]);

    if (form.requiereCalibracion === "Sí" && isInvalid(form.frecuenciaCalibracion)) {
      errors.push("La frecuencia de calibración es obligatoria cuando el equipo requiere calibración");
    }

    if (form.requiereCalibracion === "Sí" && isInvalid(form.estadoCalibracion)) {
      errors.push("El estado de calibración es obligatorio cuando el equipo requiere calibración");
    }

    if (form.requiereCalibracion === "Sí" && isInvalid(form.fechaProximaCalibracion)) {
      errors.push("La próxima calibración es obligatoria cuando el equipo requiere calibración");
    }

    if (
      ["Vigente", "Pendiente certificado", "Fuera de tolerancia", "Requiere recalibración"].includes(form.estadoCalibracion) &&
      isInvalid(form.certificadoCalibracion)
    ) {
      errors.push("El certificado o soporte de calibración es obligatorio para estados críticos de calibración");
    }

    if (
      form.fechaUltimaCalibracion &&
      form.fechaProximaCalibracion &&
      isDateBefore(form.fechaProximaCalibracion, form.fechaUltimaCalibracion)
    ) {
      errors.push("La próxima calibración no puede ser anterior a la última calibración");
    }

    if (
      form.fechaMantenimiento &&
      form.fechaProximoMantenimiento &&
      isDateBefore(form.fechaProximoMantenimiento, form.fechaMantenimiento)
    ) {
      errors.push("El próximo mantenimiento no puede ser anterior al mantenimiento ejecutado");
    }

    const needsCapa =
      ["Fuera de servicio", "Cuarentena", "Pendiente liberación QA"].includes(form.estadoEquipo) ||
      ["Vencida", "Fuera de tolerancia", "Requiere recalibración"].includes(form.estadoCalibracion) ||
      ["Vencido", "Requiere correctivo"].includes(form.estadoMantenimiento) ||
      ["No conforme", "Equipo retenido", "Equipo fuera de servicio"].includes(form.resultadoIntervencion) ||
      ["Retenido QA", "Rechazado QA", "Requiere desviación"].includes(form.liberacionQA);

    if (needsCapa && isInvalid(form.accionCorrectiva)) {
      errors.push("La acción correctiva / CAPA es obligatoria cuando existe condición crítica del equipo");
    }

    if (needsCapa && isInvalid(form.desviacionAsociada)) {
      errors.push("La desviación asociada es obligatoria cuando el equipo requiere CAPA o retención QA");
    }

    if (
      ["Liberado QA", "Retenido QA", "Rechazado QA"].includes(form.liberacionQA) &&
      isInvalid(form.evidencia)
    ) {
      errors.push("La evidencia es obligatoria cuando QA libera, retiene o rechaza el equipo");
    }

    if (["Alta", "Crítica"].includes(form.criticidadGMP) && isInvalid(form.fechaProximoMantenimiento)) {
      errors.push("El próximo mantenimiento es obligatorio para equipos de criticidad Alta o Crítica");
    }

    return Array.from(new Set(errors));
  }

  function fieldHasError(field: keyof EquipmentRecord): boolean {
    if (!submitAttempted) return false;

    const needsCapa =
      ["Fuera de servicio", "Cuarentena", "Pendiente liberación QA"].includes(form.estadoEquipo) ||
      ["Vencida", "Fuera de tolerancia", "Requiere recalibración"].includes(form.estadoCalibracion) ||
      ["Vencido", "Requiere correctivo"].includes(form.estadoMantenimiento) ||
      ["No conforme", "Equipo retenido", "Equipo fuera de servicio"].includes(form.resultadoIntervencion) ||
      ["Retenido QA", "Rechazado QA", "Requiere desviación"].includes(form.liberacionQA);

    if (requiredFields.includes(field) && isInvalid(form[field])) return true;

    if (field === "frecuenciaCalibracion" && form.requiereCalibracion === "Sí" && isInvalid(form.frecuenciaCalibracion)) return true;
    if (field === "estadoCalibracion" && form.requiereCalibracion === "Sí" && isInvalid(form.estadoCalibracion)) return true;
    if (field === "fechaProximaCalibracion" && form.requiereCalibracion === "Sí" && isInvalid(form.fechaProximaCalibracion)) return true;
    if (field === "certificadoCalibracion" && ["Vigente", "Pendiente certificado", "Fuera de tolerancia", "Requiere recalibración"].includes(form.estadoCalibracion) && isInvalid(form.certificadoCalibracion)) return true;
    if (field === "fechaProximaCalibracion" && form.fechaUltimaCalibracion && form.fechaProximaCalibracion && isDateBefore(form.fechaProximaCalibracion, form.fechaUltimaCalibracion)) return true;
    if (field === "fechaProximoMantenimiento" && form.fechaMantenimiento && form.fechaProximoMantenimiento && isDateBefore(form.fechaProximoMantenimiento, form.fechaMantenimiento)) return true;
    if (field === "fechaProximoMantenimiento" && ["Alta", "Crítica"].includes(form.criticidadGMP) && isInvalid(form.fechaProximoMantenimiento)) return true;
    if (field === "accionCorrectiva" && needsCapa && isInvalid(form.accionCorrectiva)) return true;
    if (field === "desviacionAsociada" && needsCapa && isInvalid(form.desviacionAsociada)) return true;
    if (field === "evidencia" && ["Liberado QA", "Retenido QA", "Rechazado QA"].includes(form.liberacionQA) && isInvalid(form.evidencia)) return true;

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
      showCloud("No se guardó el equipo. Completa la información obligatoria.", errors, "warning");
      return;
    }

    const timestamp = nowIso();

    const payload: EquipmentRecord = {
      ...form,
      codigoEquipo: clean(form.codigoEquipo),
      nombreEquipo: clean(form.nombreEquipo),
      codigoActivo: clean(form.codigoActivo),
      fechaRegistro: clean(form.fechaRegistro),
      empresa: clean(form.empresa),
      sede: clean(form.sede),
      area: clean(form.area),
      ubicacion: clean(form.ubicacion),
      responsable: clean(form.responsable),
      tipoEquipo: clean(form.tipoEquipo),
      marca: clean(form.marca),
      modelo: clean(form.modelo),
      serie: clean(form.serie),
      proveedorServicio: clean(form.proveedorServicio),
      criticidadGMP: clean(form.criticidadGMP),
      estadoEquipo: clean(form.estadoEquipo),
      requiereCalibracion: clean(form.requiereCalibracion),
      frecuenciaCalibracion: clean(form.frecuenciaCalibracion),
      fechaUltimaCalibracion: clean(form.fechaUltimaCalibracion),
      fechaProximaCalibracion: clean(form.fechaProximaCalibracion),
      estadoCalibracion: clean(form.estadoCalibracion),
      certificadoCalibracion: clean(form.certificadoCalibracion),
      tipoMantenimiento: clean(form.tipoMantenimiento),
      fechaMantenimiento: clean(form.fechaMantenimiento),
      fechaProximoMantenimiento: clean(form.fechaProximoMantenimiento),
      estadoMantenimiento: clean(form.estadoMantenimiento),
      resultadoIntervencion: clean(form.resultadoIntervencion),
      liberacionQA: clean(form.liberacionQA),
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
      editingId
        ? "Equipo actualizado correctamente con trazabilidad."
        : "Equipo registrado correctamente con control GMP.",
      [],
      "success"
    );
  }

  function handleEdit(record: EquipmentRecord) {
    setForm(record);
    setEditingId(record.id);
    setSubmitAttempted(false);
    showCloud("Equipo cargado para edición. Verifica antes de actualizar.", [], "success");
  }

  function handleDelete(id: string) {
    const confirmed = window.confirm(
      "¿Confirmas eliminar este equipo? En ambiente GMP real debería manejarse como retiro o anulación auditada."
    );

    if (!confirmed) return;

    const nextRecords = records.filter((record) => record.id !== id);
    setRecords(nextRecords);
    saveRecords(nextRecords);
    showCloud("Equipo eliminado del almacenamiento local.", [], "success");
  }

  function exportJson() {
    if (records.length === 0) {
      showCloud("No hay equipos para exportar.", [], "warning");
      return;
    }

    const blob = new Blob([JSON.stringify(records, null, 2)], {
      type: "application/json;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `floratrack-equipos-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);

    showCloud("Archivo JSON de equipos exportado correctamente.", [], "success");
  }

  const filteredRecords = useMemo(() => {
    const term = clean(search).toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        !term ||
        [
          record.codigoEquipo,
          record.nombreEquipo,
          record.codigoActivo,
          record.area,
          record.ubicacion,
          record.responsable,
          record.tipoEquipo,
          record.criticidadGMP,
          record.estadoEquipo,
          record.estadoCalibracion,
          record.estadoMantenimiento,
          record.liberacionQA,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

      const matchesEstado =
        filterEstado === "Todos" || record.estadoEquipo === filterEstado;

      return matchesSearch && matchesEstado;
    });
  }, [records, search, filterEstado]);

  const dashboard = useMemo(() => {
    return {
      total: records.length,
      disponibles: records.filter((record) => ["Disponible", "En uso"].includes(record.estadoEquipo)).length,
      criticos: records.filter((record) => ["Alta", "Crítica"].includes(record.criticidadGMP)).length,
      vencidos: records.filter((record) =>
        ["Vencida", "Fuera de tolerancia"].includes(record.estadoCalibracion) ||
        record.estadoMantenimiento === "Vencido"
      ).length,
      pendienteQA: records.filter((record) => record.liberacionQA === "Pendiente QA").length,
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
                Equipos, calibración y mantenimiento GMP
              </h1>

              <p className="mt-3 max-w-5xl text-sm leading-6 text-slate-300 md:text-base">
                Control de equipos críticos, códigos de activo, calibración,
                mantenimiento, certificados, estado GMP, desviaciones, CAPA,
                evidencia y liberación QA.
              </p>
            </div>

            <div className="rounded-2xl border border-orange-400/20 bg-orange-500/10 px-5 py-4 text-sm text-orange-100">
              <p className="font-bold">Estado GMP activo</p>
              <p className="mt-1 text-orange-200">
                Equipos · Calibración · Mantenimiento · QA · CAPA
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
          <Metric title="Equipos" value={dashboard.total} />
          <Metric title="Disponibles / uso" value={dashboard.disponibles} tone="emerald" />
          <Metric title="Alta / crítica" value={dashboard.criticos} tone="amber" />
          <Metric title="Vencidos / OOT" value={dashboard.vencidos} tone="red" />
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
                  {editingId ? "Editar equipo" : "Nuevo equipo"}
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Ningún equipo puede guardarse vacío o incompleto.
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
                  : "border-slate-700 bg-slate-950 focus:border-orange-400 focus:ring-4 focus:ring-orange-400/40";

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
                          Campo obligatorio o condición GMP requerida.
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
                className="rounded-2xl bg-orange-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-orange-950/50 transition hover:bg-orange-400"
              >
                {editingId ? "Actualizar equipo" : "Guardar equipo"}
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
                  Registro maestro de equipos
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Consulta, filtra, edita y exporta equipos, calibraciones y mantenimientos.
                </p>
              </div>

              <button
                type="button"
                onClick={exportJson}
                className="rounded-2xl border border-orange-400/50 px-5 py-3 text-sm font-bold text-orange-200 transition hover:bg-orange-500/10"
              >
                Exportar JSON
              </button>
            </div>

            <div className="mb-5 grid gap-3 md:grid-cols-[1fr_230px]">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-orange-400/40 transition placeholder:text-slate-600 focus:border-orange-400 focus:ring-4"
                placeholder="Buscar por equipo, activo, área, estado, QA..."
              />

              <select
                value={filterEstado}
                onChange={(event) => setFilterEstado(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-orange-400/40 transition focus:border-orange-400 focus:ring-4"
              >
                <option>Todos</option>
                <option>Disponible</option>
                <option>En uso</option>
                <option>Cuarentena</option>
                <option>Fuera de servicio</option>
                <option>En mantenimiento</option>
                <option>Pendiente calibración</option>
                <option>Pendiente liberación QA</option>
                <option>Retirado</option>
              </select>
            </div>

            <div className="max-h-[780px] space-y-4 overflow-auto pr-2">
              {filteredRecords.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center text-sm text-slate-400">
                  No hay equipos registrados. Crea el primer equipo con datos completos.
                </div>
              ) : (
                filteredRecords.map((record) => (
                  <article key={record.id} className="rounded-2xl border border-slate-700 bg-slate-950 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-white">
                            {record.codigoEquipo} · {record.nombreEquipo}
                          </h3>
                          <StatusPill value={record.estadoEquipo} />
                          <span className="rounded-full border border-orange-400/30 bg-orange-500/10 px-3 py-1 text-xs font-bold text-orange-200">
                            {record.criticidadGMP}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-400">
                          {record.codigoActivo} · {record.area} · {record.ubicacion}
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
                      <Data label="Responsable" value={record.responsable} />
                      <Data label="Tipo equipo" value={record.tipoEquipo} />
                      <Data label="Marca / modelo" value={`${record.marca || "Sin marca"} / ${record.modelo || "Sin modelo"}`} />
                      <Data label="Serie" value={record.serie || "Sin registro"} />
                      <Data label="Requiere calibración" value={record.requiereCalibracion} />
                      <Data label="Estado calibración" value={record.estadoCalibracion || "Sin registro"} />
                      <Data label="Última calibración" value={record.fechaUltimaCalibracion || "Sin registro"} />
                      <Data label="Próxima calibración" value={record.fechaProximaCalibracion || "Sin registro"} />
                      <Data label="Estado mantenimiento" value={record.estadoMantenimiento} />
                      <Data label="Próximo mantenimiento" value={record.fechaProximoMantenimiento || "Sin registro"} />
                      <Data label="Resultado" value={record.resultadoIntervencion} />
                      <Data label="Liberación QA" value={record.liberacionQA} />
                      <Data label="Certificado" value={record.certificadoCalibracion || "Sin registro"} />
                      <Data label="Evidencia" value={record.evidencia || "Sin registro"} />
                    </div>

                    {(record.desviacionAsociada || record.accionCorrectiva || record.observaciones) && (
                      <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300">
                        {record.desviacionAsociada && (
                          <p>
                            <span className="font-bold text-slate-100">Desviación: </span>
                            {record.desviacionAsociada}
                          </p>
                        )}

                        {record.accionCorrectiva && (
                          <p className="mt-2">
                            <span className="font-bold text-slate-100">CAPA: </span>
                            {record.accionCorrectiva}
                          </p>
                        )}

                        {record.observaciones && (
                          <p className="mt-2">
                            <span className="font-bold text-slate-100">Observaciones: </span>
                            {record.observaciones}
                          </p>
                        )}
                      </div>
                    )}

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
    value === "Disponible" || value === "En uso"
      ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
      : value === "Fuera de servicio" || value === "Retirado"
      ? "border-red-400/40 bg-red-500/10 text-red-200"
      : value === "Cuarentena" || value === "Pendiente calibración" || value === "Pendiente liberación QA"
      ? "border-amber-400/40 bg-amber-500/10 text-amber-200"
      : "border-orange-400/40 bg-orange-500/10 text-orange-200";

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-bold ${className}`}>
      {value || "Sin estado"}
    </span>
  );
}
