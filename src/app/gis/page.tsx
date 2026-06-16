"use client";

import { useEffect, useMemo, useState } from "react";

type GisRecord = {
  id: string;
  codigoElemento: string;
  fechaRegistro: string;
  horaRegistro: string;
  empresa: string;
  sede: string;
  predio: string;
  responsableLevantamiento: string;
  responsableQA: string;
  tipoElemento: string;
  nombreElemento: string;
  descripcion: string;
  latitud: string;
  longitud: string;
  areaHectareas: string;
  altitud: string;
  sistemaCoordenadas: string;
  zonaOperativa: string;
  usoArea: string;
  estadoGacpGmp: string;
  nivelRiesgo: string;
  fuenteDato: string;
  precisionDato: string;
  restriccionAcceso: string;
  requiereMonitoreo: string;
  fechaProximaRevision: string;
  decisionQA: string;
  desviacionAsociada: string;
  capa: string;
  evidencia: string;
  geojson: string;
  observaciones: string;
  creadoEn: string;
  actualizadoEn: string;
};

type FieldConfig = {
  key: keyof GisRecord;
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

const STORAGE_KEY = "floratrack_gis_operacional_v1";

const emptyForm: GisRecord = {
  id: "",
  codigoElemento: "",
  fechaRegistro: "",
  horaRegistro: "",
  empresa: "",
  sede: "",
  predio: "",
  responsableLevantamiento: "",
  responsableQA: "",
  tipoElemento: "",
  nombreElemento: "",
  descripcion: "",
  latitud: "",
  longitud: "",
  areaHectareas: "",
  altitud: "",
  sistemaCoordenadas: "",
  zonaOperativa: "",
  usoArea: "",
  estadoGacpGmp: "",
  nivelRiesgo: "",
  fuenteDato: "",
  precisionDato: "",
  restriccionAcceso: "",
  requiereMonitoreo: "",
  fechaProximaRevision: "",
  decisionQA: "",
  desviacionAsociada: "",
  capa: "",
  evidencia: "",
  geojson: "",
  observaciones: "",
  creadoEn: "",
  actualizadoEn: "",
};

const requiredFields: Array<keyof GisRecord> = [
  "codigoElemento",
  "fechaRegistro",
  "horaRegistro",
  "empresa",
  "sede",
  "predio",
  "responsableLevantamiento",
  "responsableQA",
  "tipoElemento",
  "nombreElemento",
  "descripcion",
  "latitud",
  "longitud",
  "sistemaCoordenadas",
  "zonaOperativa",
  "usoArea",
  "estadoGacpGmp",
  "nivelRiesgo",
  "fuenteDato",
  "precisionDato",
  "restriccionAcceso",
  "requiereMonitoreo",
  "fechaProximaRevision",
  "decisionQA",
];

const fieldLabels: Record<keyof GisRecord, string> = {
  id: "ID",
  codigoElemento: "Código GIS",
  fechaRegistro: "Fecha de registro",
  horaRegistro: "Hora de registro",
  empresa: "Empresa",
  sede: "Sede / predio",
  predio: "Predio / área",
  responsableLevantamiento: "Responsable de levantamiento",
  responsableQA: "Responsable QA",
  tipoElemento: "Tipo de elemento GIS",
  nombreElemento: "Nombre del elemento",
  descripcion: "Descripción",
  latitud: "Latitud",
  longitud: "Longitud",
  areaHectareas: "Área en hectáreas",
  altitud: "Altitud",
  sistemaCoordenadas: "Sistema de coordenadas",
  zonaOperativa: "Zona operativa",
  usoArea: "Uso del área",
  estadoGacpGmp: "Estado GACP/GMP",
  nivelRiesgo: "Nivel de riesgo",
  fuenteDato: "Fuente del dato",
  precisionDato: "Precisión del dato",
  restriccionAcceso: "Restricción de acceso",
  requiereMonitoreo: "Requiere monitoreo",
  fechaProximaRevision: "Próxima revisión",
  decisionQA: "Decisión QA",
  desviacionAsociada: "Desviación asociada",
  capa: "CAPA",
  evidencia: "Evidencia",
  geojson: "GeoJSON / coordenadas extendidas",
  observaciones: "Observaciones",
  creadoEn: "Creado en",
  actualizadoEn: "Actualizado en",
};

const fields: FieldConfig[] = [
  { key: "codigoElemento", label: "Código GIS *", placeholder: "GIS-2026-001" },
  { key: "fechaRegistro", label: "Fecha de registro *", type: "date" },
  { key: "horaRegistro", label: "Hora de registro *", type: "time" },
  { key: "empresa", label: "Empresa *", placeholder: "Growlifecol S.A.S." },
  { key: "sede", label: "Sede / predio *", placeholder: "Sede principal" },
  { key: "predio", label: "Predio / área *", placeholder: "PRED-2026-001 / Invernadero 1 / Laboratorio QA" },
  { key: "responsableLevantamiento", label: "Responsable de levantamiento *", placeholder: "Responsable GIS / técnico / QA" },
  { key: "responsableQA", label: "Responsable QA *", placeholder: "Responsable QA que verifica" },
  {
    key: "tipoElemento",
    label: "Tipo de elemento GIS *",
    kind: "select",
    options: [
      "Predio",
      "Lote agrícola",
      "Invernadero",
      "Área de cultivo",
      "Área de propagación",
      "Área de cosecha",
      "Área de secado",
      "Área de postcosecha",
      "Laboratorio",
      "Almacén",
      "Cuarto frío",
      "Zona de cuarentena",
      "Zona de residuos",
      "Punto de agua",
      "Punto de energía",
      "Trampa MIP",
      "Ruta interna",
      "Zona restringida",
      "Punto crítico GMP",
      "Otro",
    ],
  },
  { key: "nombreElemento", label: "Nombre del elemento *", placeholder: "Invernadero 1 / Cuarto frío QA / Trampa TR-01" },
  {
    key: "descripcion",
    label: "Descripción *",
    kind: "textarea",
    placeholder: "Describe el elemento, su función, proceso asociado, límites físicos, uso y relevancia GACP/GMP.",
  },
  { key: "latitud", label: "Latitud *", type: "number", placeholder: "4.7110" },
  { key: "longitud", label: "Longitud *", type: "number", placeholder: "-74.0721" },
  { key: "areaHectareas", label: "Área en hectáreas", type: "number", placeholder: "0.25" },
  { key: "altitud", label: "Altitud", type: "number", placeholder: "2600" },
  {
    key: "sistemaCoordenadas",
    label: "Sistema de coordenadas *",
    kind: "select",
    options: ["WGS84", "MAGNA-SIRGAS", "UTM", "Coordenada local validada", "Otro"],
  },
  {
    key: "zonaOperativa",
    label: "Zona operativa *",
    kind: "select",
    options: [
      "Producción GACP",
      "Producción GMP",
      "QA",
      "QC",
      "Almacenamiento",
      "Cuarentena",
      "Residuos",
      "Servicios",
      "Perímetro",
      "Seguridad",
      "Administrativa",
      "Proveedor externo",
    ],
  },
  {
    key: "usoArea",
    label: "Uso del área *",
    kind: "select",
    options: [
      "Cultivo",
      "Propagación",
      "Cosecha",
      "Secado",
      "Postcosecha",
      "Micropropagación",
      "Extracción",
      "Inventario",
      "Calidad",
      "Residuos",
      "Mantenimiento",
      "Tránsito",
      "Seguridad",
      "No productiva",
    ],
  },
  {
    key: "estadoGacpGmp",
    label: "Estado GACP/GMP *",
    kind: "select",
    options: [
      "Conforme",
      "Con observaciones",
      "No conforme",
      "Pendiente verificación QA",
      "Pendiente adecuación",
      "Fuera de uso",
      "Restringido",
      "Requiere auditoría",
    ],
  },
  {
    key: "nivelRiesgo",
    label: "Nivel de riesgo *",
    kind: "select",
    options: ["Bajo", "Medio", "Alto", "Crítico"],
  },
  {
    key: "fuenteDato",
    label: "Fuente del dato *",
    kind: "select",
    options: [
      "GPS móvil",
      "GPS topográfico",
      "Plano aprobado",
      "Levantamiento interno",
      "Proveedor GIS",
      "Auditoría",
      "Documento regulatorio",
      "Validación QA",
    ],
  },
  {
    key: "precisionDato",
    label: "Precisión del dato *",
    kind: "select",
    options: [
      "Alta",
      "Media",
      "Baja",
      "Pendiente validación",
      "Plano de referencia",
    ],
  },
  {
    key: "restriccionAcceso",
    label: "Restricción de acceso *",
    kind: "select",
    options: ["Libre interno", "Personal autorizado", "QA/QC", "GMP restringido", "Cuarentena", "No ingresar", "Proveedor autorizado"],
  },
  {
    key: "requiereMonitoreo",
    label: "Requiere monitoreo *",
    kind: "select",
    options: ["Sí", "No"],
  },
  { key: "fechaProximaRevision", label: "Próxima revisión *", type: "date" },
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
      "Requiere auditoría",
      "Cierre aprobado QA",
    ],
  },
  { key: "desviacionAsociada", label: "Desviación asociada", placeholder: "DEV-2026-001 / CAPA-001" },
  {
    key: "capa",
    label: "CAPA",
    kind: "textarea",
    placeholder: "Obligatoria si el área está en riesgo alto/crítico, no conforme, restringida o rechazada por QA.",
  },
  { key: "evidencia", label: "Evidencia / soporte", placeholder: "Foto, plano, coordenadas, QR, captura GIS, acta, verificación QA..." },
  {
    key: "geojson",
    label: "GeoJSON / coordenadas extendidas",
    kind: "textarea",
    placeholder: "Opcional: pega GeoJSON, polígono, coordenadas múltiples o notas cartográficas.",
  },
  {
    key: "observaciones",
    label: "Observaciones",
    kind: "textarea",
    placeholder: "Notas QA, límites, cambios, accesos, riesgos, pendientes de verificación, relación con licencias.",
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
  return `GIS-${Date.now()}-${Math.random().toString(16).slice(2)}`;
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

function loadRecords(): GisRecord[] {
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

function saveRecords(records: GisRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export default function GisPage() {
  const [records, setRecords] = useState<GisRecord[]>([]);
  const [form, setForm] = useState<GisRecord>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [cloud, setCloud] = useState<CloudState | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [search, setSearch] = useState("");
  const [filterQA, setFilterQA] = useState("Todos");

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

  function updateField(field: keyof GisRecord, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function needsCapa(): boolean {
    return (
      ["Alto", "Crítico"].includes(form.nivelRiesgo) ||
      ["No conforme", "Fuera de uso", "Restringido", "Requiere auditoría"].includes(form.estadoGacpGmp) ||
      ["Rechazado QA", "Requiere CAPA", "Requiere auditoría"].includes(form.decisionQA) ||
      ["No ingresar", "Cuarentena"].includes(form.restriccionAcceso)
    );
  }

  function validateForm(): string[] {
    const errors = requiredFields
      .filter((field) => isInvalid(form[field]))
      .map((field) => fieldLabels[field]);

    const lat = toNumber(form.latitud);
    const lng = toNumber(form.longitud);

    if (!Number.isFinite(lat) || lat < -90 || lat > 90) {
      errors.push("La latitud debe ser numérica y estar entre -90 y 90");
    }

    if (!Number.isFinite(lng) || lng < -180 || lng > 180) {
      errors.push("La longitud debe ser numérica y estar entre -180 y 180");
    }

    if (!isInvalid(form.areaHectareas)) {
      const area = toNumber(form.areaHectareas);

      if (!Number.isFinite(area) || area <= 0) {
        errors.push("El área en hectáreas debe ser mayor a cero");
      }
    }

    if (!isInvalid(form.altitud)) {
      const altitude = toNumber(form.altitud);

      if (!Number.isFinite(altitude)) {
        errors.push("La altitud debe ser numérica");
      }
    }

    if (
      ["Predio", "Lote agrícola", "Invernadero", "Área de cultivo", "Área de propagación", "Área de cosecha"].includes(form.tipoElemento) &&
      isInvalid(form.areaHectareas)
    ) {
      errors.push("El área en hectáreas es obligatoria para predios, lotes e invernaderos");
    }

    if (form.fechaProximaRevision && form.fechaRegistro && isDateBefore(form.fechaProximaRevision, form.fechaRegistro)) {
      errors.push("La próxima revisión no puede ser anterior a la fecha de registro");
    }

    if (form.requiereMonitoreo === "Sí" && isInvalid(form.evidencia)) {
      errors.push("La evidencia es obligatoria cuando el elemento requiere monitoreo");
    }

    if (["Aprobado QA", "Aprobado con observación QA", "Rechazado QA", "Cierre aprobado QA"].includes(form.decisionQA) && isInvalid(form.evidencia)) {
      errors.push("La evidencia es obligatoria para decisiones QA formales");
    }

    if (needsCapa() && isInvalid(form.desviacionAsociada)) {
      errors.push("La desviación asociada es obligatoria para riesgo, restricción, no conformidad o CAPA");
    }

    if (needsCapa() && isInvalid(form.capa)) {
      errors.push("La CAPA es obligatoria para riesgo, restricción, no conformidad o CAPA");
    }

    return Array.from(new Set(errors));
  }

  function fieldHasError(field: keyof GisRecord): boolean {
    if (!submitAttempted) return false;

    if (requiredFields.includes(field) && isInvalid(form[field])) return true;

    if (field === "latitud") {
      const lat = toNumber(form.latitud);
      return !Number.isFinite(lat) || lat < -90 || lat > 90;
    }

    if (field === "longitud") {
      const lng = toNumber(form.longitud);
      return !Number.isFinite(lng) || lng < -180 || lng > 180;
    }

    if (field === "areaHectareas") {
      if (["Predio", "Lote agrícola", "Invernadero", "Área de cultivo", "Área de propagación", "Área de cosecha"].includes(form.tipoElemento) && isInvalid(form.areaHectareas)) return true;

      if (!isInvalid(form.areaHectareas)) {
        const area = toNumber(form.areaHectareas);
        return !Number.isFinite(area) || area <= 0;
      }
    }

    if (field === "altitud" && !isInvalid(form.altitud)) {
      const altitude = toNumber(form.altitud);
      return !Number.isFinite(altitude);
    }

    if (field === "fechaProximaRevision" && form.fechaProximaRevision && form.fechaRegistro && isDateBefore(form.fechaProximaRevision, form.fechaRegistro)) return true;
    if (field === "evidencia" && form.requiereMonitoreo === "Sí" && isInvalid(form.evidencia)) return true;
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
      showCloud("No se guardó el registro GIS. Completa la información obligatoria.", errors, "warning");
      return;
    }

    const timestamp = nowIso();

    const payload: GisRecord = {
      ...form,
      codigoElemento: clean(form.codigoElemento),
      fechaRegistro: clean(form.fechaRegistro),
      horaRegistro: clean(form.horaRegistro),
      empresa: clean(form.empresa),
      sede: clean(form.sede),
      predio: clean(form.predio),
      responsableLevantamiento: clean(form.responsableLevantamiento),
      responsableQA: clean(form.responsableQA),
      tipoElemento: clean(form.tipoElemento),
      nombreElemento: clean(form.nombreElemento),
      descripcion: clean(form.descripcion),
      latitud: clean(form.latitud),
      longitud: clean(form.longitud),
      areaHectareas: clean(form.areaHectareas),
      altitud: clean(form.altitud),
      sistemaCoordenadas: clean(form.sistemaCoordenadas),
      zonaOperativa: clean(form.zonaOperativa),
      usoArea: clean(form.usoArea),
      estadoGacpGmp: clean(form.estadoGacpGmp),
      nivelRiesgo: clean(form.nivelRiesgo),
      fuenteDato: clean(form.fuenteDato),
      precisionDato: clean(form.precisionDato),
      restriccionAcceso: clean(form.restriccionAcceso),
      requiereMonitoreo: clean(form.requiereMonitoreo),
      fechaProximaRevision: clean(form.fechaProximaRevision),
      decisionQA: clean(form.decisionQA),
      desviacionAsociada: clean(form.desviacionAsociada),
      capa: clean(form.capa),
      evidencia: clean(form.evidencia),
      geojson: clean(form.geojson),
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
      editingId ? "Registro GIS actualizado correctamente." : "Registro GIS creado correctamente con trazabilidad GACP/GMP.",
      [],
      "success"
    );
  }

  function handleEdit(record: GisRecord) {
    setForm(record);
    setEditingId(record.id);
    setSubmitAttempted(false);
    showCloud("Registro GIS cargado para edición. Verifica antes de actualizar.", [], "success");
  }

  function handleDelete(id: string) {
    const confirmed = window.confirm("¿Confirmas eliminar este registro GIS? En ambiente GMP real debería manejarse como anulación auditada.");
    if (!confirmed) return;

    const nextRecords = records.filter((record) => record.id !== id);
    setRecords(nextRecords);
    saveRecords(nextRecords);
    showCloud("Registro GIS eliminado del almacenamiento local.", [], "success");
  }

  function exportJson() {
    if (records.length === 0) {
      showCloud("No hay registros GIS para exportar.", [], "warning");
      return;
    }

    const blob = new Blob([JSON.stringify(records, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `floratrack-gis-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);

    showCloud("Archivo JSON GIS exportado correctamente.", [], "success");
  }

  const filteredRecords = useMemo(() => {
    const term = clean(search).toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        !term ||
        [
          record.codigoElemento,
          record.empresa,
          record.sede,
          record.predio,
          record.tipoElemento,
          record.nombreElemento,
          record.zonaOperativa,
          record.usoArea,
          record.estadoGacpGmp,
          record.nivelRiesgo,
          record.decisionQA,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

      const matchesQA = filterQA === "Todos" || record.decisionQA === filterQA;

      return matchesSearch && matchesQA;
    });
  }, [records, search, filterQA]);

  const dashboard = useMemo(() => {
    const totalArea = records.reduce((acc, record) => {
      const area = Number(record.areaHectareas);
      return Number.isFinite(area) ? acc + area : acc;
    }, 0);

    return {
      total: records.length,
      areaTotal: totalArea.toFixed(2),
      conformes: records.filter((record) => record.estadoGacpGmp === "Conforme").length,
      altoRiesgo: records.filter((record) => ["Alto", "Crítico"].includes(record.nivelRiesgo)).length,
      monitoreo: records.filter((record) => record.requiereMonitoreo === "Sí").length,
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
        <header className="rounded-3xl border border-lime-400/20 bg-slate-900/80 p-6 shadow-2xl shadow-lime-950/30">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-lime-300">
                FloraTrack Enterprise Compliance Platform
              </p>

              <h1 className="mt-3 text-3xl font-black text-white md:text-5xl">
                GIS / Mapa operacional GACP/GMP
              </h1>

              <p className="mt-3 max-w-5xl text-sm leading-6 text-slate-300 md:text-base">
                Control georreferenciado de empresas, predios, áreas, zonas críticas,
                coordenadas, uso operativo, estado GACP/GMP, riesgo, evidencia,
                desviaciones, CAPA y decisión QA.
              </p>
            </div>

            <div className="rounded-2xl border border-lime-400/20 bg-lime-500/10 px-5 py-4 text-sm text-lime-100">
              <p className="font-bold">GIS operativo activo</p>
              <p className="mt-1 text-lime-200">Mapa · Predios · Coordenadas · Riesgo · QA</p>
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
          <Metric title="Elementos GIS" value={dashboard.total} />
          <Metric title="Área total ha" value={dashboard.areaTotal} tone="sky" />
          <Metric title="Conformes" value={dashboard.conformes} tone="emerald" />
          <Metric title="Alto riesgo" value={dashboard.altoRiesgo} tone="red" />
          <Metric title="Monitoreo" value={dashboard.monitoreo} tone="amber" />
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
                <h2 className="text-2xl font-black text-white">{editingId ? "Editar GIS" : "Nuevo elemento GIS"}</h2>
                <p className="mt-1 text-sm text-slate-400">Ningún elemento GIS puede guardarse vacío o incompleto.</p>
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
                  : "border-slate-700 bg-slate-950 focus:border-lime-400 focus:ring-4 focus:ring-lime-400/40";

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

                      {hasError && <p className="mt-1 text-xs font-bold text-red-300">Campo obligatorio o condición GIS requerida.</p>}
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
              <button type="button" onClick={handleSave} className="rounded-2xl bg-lime-500 px-6 py-3 text-sm font-black text-slate-950 shadow-lg shadow-lime-950/50 transition hover:bg-lime-400">
                {editingId ? "Actualizar GIS" : "Guardar GIS"}
              </button>

              <button type="button" onClick={resetForm} className="rounded-2xl border border-slate-600 px-6 py-3 text-sm font-bold text-slate-200 transition hover:bg-slate-800">
                Limpiar formulario
              </button>
            </div>
          </form>

          <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">Registro maestro GIS</h2>
                <p className="mt-1 text-sm text-slate-400">Consulta, filtra, edita y exporta elementos georreferenciados.</p>
              </div>

              <button type="button" onClick={exportJson} className="rounded-2xl border border-lime-400/50 px-5 py-3 text-sm font-bold text-lime-200 transition hover:bg-lime-500/10">
                Exportar JSON
              </button>
            </div>

            <div className="mb-5 grid gap-3 md:grid-cols-[1fr_250px]">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-lime-400/40 transition placeholder:text-slate-600 focus:border-lime-400 focus:ring-4"
                placeholder="Buscar por código, predio, área, uso, riesgo, QA..."
              />

              <select
                value={filterQA}
                onChange={(event) => setFilterQA(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-lime-400/40 transition focus:border-lime-400 focus:ring-4"
              >
                <option>Todos</option>
                <option>Pendiente QA</option>
                <option>Aprobado QA</option>
                <option>Aprobado con observación QA</option>
                <option>Rechazado QA</option>
                <option>Requiere CAPA</option>
                <option>Requiere auditoría</option>
                <option>Cierre aprobado QA</option>
              </select>
            </div>

            <div className="max-h-[780px] space-y-4 overflow-auto pr-2">
              {filteredRecords.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center text-sm text-slate-400">
                  No hay elementos GIS registrados. Crea el primer registro con datos completos.
                </div>
              ) : (
                filteredRecords.map((record) => (
                  <article key={record.id} className="rounded-2xl border border-slate-700 bg-slate-950 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-white">{record.codigoElemento} · {record.nombreElemento}</h3>
                          <StatusPill value={record.decisionQA} />
                          <span className="rounded-full border border-lime-400/30 bg-lime-500/10 px-3 py-1 text-xs font-bold text-lime-200">
                            {record.tipoElemento}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-400">
                          {record.predio} · {record.latitud}, {record.longitud} · Riesgo {record.nivelRiesgo}
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
                      <Data label="Responsable levantamiento" value={record.responsableLevantamiento} />
                      <Data label="Responsable QA" value={record.responsableQA} />
                      <Data label="Área ha" value={record.areaHectareas || "Sin registro"} />
                      <Data label="Altitud" value={record.altitud || "Sin registro"} />
                      <Data label="Sistema coordenadas" value={record.sistemaCoordenadas} />
                      <Data label="Zona operativa" value={record.zonaOperativa} />
                      <Data label="Uso área" value={record.usoArea} />
                      <Data label="Estado GACP/GMP" value={record.estadoGacpGmp} />
                      <Data label="Fuente dato" value={record.fuenteDato} />
                      <Data label="Precisión" value={record.precisionDato} />
                      <Data label="Acceso" value={record.restriccionAcceso} />
                      <Data label="Monitoreo" value={record.requiereMonitoreo} />
                      <Data label="Próxima revisión" value={record.fechaProximaRevision} />
                      <Data label="Evidencia" value={record.evidencia || "Sin registro"} />
                    </div>

                    <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300">
                      <p><span className="font-bold text-slate-100">Descripción: </span>{record.descripcion}</p>

                      {record.geojson && (
                        <p className="mt-2"><span className="font-bold text-slate-100">GeoJSON / coordenadas extendidas: </span>{record.geojson}</p>
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

function Metric({ title, value, tone = "slate" }: { title: string; value: string | number; tone?: "slate" | "emerald" | "amber" | "red" | "sky" }) {
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
    value === "Aprobado QA" || value === "Cierre aprobado QA"
      ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
      : value === "Pendiente QA" || value === "Aprobado con observación QA"
      ? "border-amber-400/40 bg-amber-500/10 text-amber-200"
      : "border-red-400/40 bg-red-500/10 text-red-200";

  return <span className={`rounded-full border px-3 py-1 text-xs font-bold ${className}`}>{value || "Sin QA"}</span>;
}
