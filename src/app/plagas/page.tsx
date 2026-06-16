"use client";

import { useEffect, useMemo, useState } from "react";

type PestRecord = {
  id: string;
  codigoControl: string;
  fecha: string;
  hora: string;
  empresa: string;
  sede: string;
  area: string;
  ubicacion: string;
  tipoRegistro: string;
  plagaObjetivo: string;
  metodoControl: string;
  dispositivoTrampa: string;
  codigoTrampa: string;
  proveedorServicio: string;
  productoAplicado: string;
  loteProducto: string;
  concentracion: string;
  responsableInspeccion: string;
  responsableVerificacion: string;
  hallazgo: string;
  nivelActividad: string;
  cantidadEvidencia: string;
  accionTomada: string;
  requiereCierreArea: string;
  requiereProductoQuimico: string;
  periodoReingreso: string;
  resultadoVerificacion: string;
  liberacionQA: string;
  desviacionAsociada: string;
  accionCorrectiva: string;
  evidencia: string;
  observaciones: string;
  creadoEn: string;
  actualizadoEn: string;
};

type FieldConfig = {
  key: keyof PestRecord;
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

const STORAGE_KEY = "floratrack_manejo_integrado_plagas_v1";

const emptyForm: PestRecord = {
  id: "",
  codigoControl: "",
  fecha: "",
  hora: "",
  empresa: "",
  sede: "",
  area: "",
  ubicacion: "",
  tipoRegistro: "",
  plagaObjetivo: "",
  metodoControl: "",
  dispositivoTrampa: "",
  codigoTrampa: "",
  proveedorServicio: "",
  productoAplicado: "",
  loteProducto: "",
  concentracion: "",
  responsableInspeccion: "",
  responsableVerificacion: "",
  hallazgo: "",
  nivelActividad: "",
  cantidadEvidencia: "",
  accionTomada: "",
  requiereCierreArea: "",
  requiereProductoQuimico: "",
  periodoReingreso: "",
  resultadoVerificacion: "",
  liberacionQA: "",
  desviacionAsociada: "",
  accionCorrectiva: "",
  evidencia: "",
  observaciones: "",
  creadoEn: "",
  actualizadoEn: "",
};

const requiredFields: Array<keyof PestRecord> = [
  "codigoControl",
  "fecha",
  "hora",
  "empresa",
  "sede",
  "area",
  "ubicacion",
  "tipoRegistro",
  "plagaObjetivo",
  "metodoControl",
  "responsableInspeccion",
  "responsableVerificacion",
  "hallazgo",
  "nivelActividad",
  "accionTomada",
  "requiereCierreArea",
  "requiereProductoQuimico",
  "resultadoVerificacion",
  "liberacionQA",
];

const fieldLabels: Record<keyof PestRecord, string> = {
  id: "ID",
  codigoControl: "Código de control",
  fecha: "Fecha",
  hora: "Hora",
  empresa: "Empresa",
  sede: "Sede / predio",
  area: "Área",
  ubicacion: "Ubicación",
  tipoRegistro: "Tipo de registro",
  plagaObjetivo: "Plaga objetivo",
  metodoControl: "Método de control",
  dispositivoTrampa: "Dispositivo / trampa",
  codigoTrampa: "Código de trampa",
  proveedorServicio: "Proveedor del servicio",
  productoAplicado: "Producto aplicado",
  loteProducto: "Lote del producto",
  concentracion: "Concentración",
  responsableInspeccion: "Responsable de inspección",
  responsableVerificacion: "Responsable de verificación",
  hallazgo: "Hallazgo",
  nivelActividad: "Nivel de actividad",
  cantidadEvidencia: "Cantidad / evidencia observada",
  accionTomada: "Acción tomada",
  requiereCierreArea: "Requiere cierre de área",
  requiereProductoQuimico: "Requiere producto químico",
  periodoReingreso: "Periodo de reingreso",
  resultadoVerificacion: "Resultado de verificación",
  liberacionQA: "Liberación QA",
  desviacionAsociada: "Desviación asociada",
  accionCorrectiva: "Acción correctiva / CAPA",
  evidencia: "Evidencia",
  observaciones: "Observaciones",
  creadoEn: "Creado en",
  actualizadoEn: "Actualizado en",
};

const fields: FieldConfig[] = [
  { key: "codigoControl", label: "Código de control *", placeholder: "MIP-2026-001" },
  { key: "fecha", label: "Fecha *", type: "date" },
  { key: "hora", label: "Hora *", type: "time" },
  { key: "empresa", label: "Empresa *", placeholder: "Growlifecol S.A.S." },
  { key: "sede", label: "Sede / predio *", placeholder: "Sede principal" },
  {
    key: "area",
    label: "Área *",
    kind: "select",
    options: [
      "Cultivo",
      "Propagación",
      "Cosecha",
      "Secado",
      "Postcosecha",
      "Inventario",
      "Recepción",
      "Almacén",
      "Micropropagación",
      "Extracción",
      "QA",
      "QC",
      "Perímetro",
      "Áreas comunes",
      "Residuos",
      "Vestieres",
    ],
  },
  { key: "ubicacion", label: "Ubicación *", placeholder: "Invernadero 1, bodega, trampa T-01, perímetro norte..." },
  {
    key: "tipoRegistro",
    label: "Tipo de registro *",
    kind: "select",
    options: [
      "Inspección rutinaria",
      "Monitoreo de trampa",
      "Hallazgo puntual",
      "Aplicación correctiva",
      "Aplicación preventiva",
      "Revisión de proveedor",
      "Seguimiento CAPA",
      "Liberación de área",
    ],
  },
  {
    key: "plagaObjetivo",
    label: "Plaga objetivo *",
    kind: "select",
    options: [
      "Sin plaga observada",
      "Mosca blanca",
      "Trips",
      "Ácaros",
      "Pulgón",
      "Lepidóptero",
      "Hongos asociados",
      "Roedores",
      "Hormigas",
      "Cucarachas",
      "Moscas",
      "Aves",
      "Otro",
    ],
  },
  {
    key: "metodoControl",
    label: "Método de control *",
    kind: "select",
    options: [
      "Inspección visual",
      "Trampa adhesiva",
      "Trampa mecánica",
      "Control biológico",
      "Control físico",
      "Control cultural",
      "Producto permitido",
      "Limpieza correctiva",
      "Cierre de ingreso",
      "Servicio externo",
    ],
  },
  { key: "dispositivoTrampa", label: "Dispositivo / trampa", placeholder: "Trampa amarilla / estación roedor / barrera física" },
  { key: "codigoTrampa", label: "Código de trampa", placeholder: "TR-MIP-001" },
  { key: "proveedorServicio", label: "Proveedor del servicio", placeholder: "Proveedor MIP autorizado / interno" },
  { key: "productoAplicado", label: "Producto aplicado", placeholder: "Producto autorizado, biocontrol, desinfectante..." },
  { key: "loteProducto", label: "Lote del producto", placeholder: "LOT-MIP-001" },
  { key: "concentracion", label: "Concentración", placeholder: "Según etiqueta / 1:100 / dosis autorizada" },
  { key: "responsableInspeccion", label: "Responsable de inspección *", placeholder: "Técnico / supervisor / proveedor" },
  { key: "responsableVerificacion", label: "Responsable de verificación *", placeholder: "QA / responsable técnico" },
  {
    key: "hallazgo",
    label: "Hallazgo *",
    kind: "select",
    options: [
      "Sin hallazgo",
      "Actividad ausente",
      "Actividad leve",
      "Actividad moderada",
      "Actividad alta",
      "Evidencia de ingreso",
      "Daño en cultivo",
      "Contaminación potencial",
      "Producto afectado",
      "Requiere investigación",
    ],
  },
  {
    key: "nivelActividad",
    label: "Nivel de actividad *",
    kind: "select",
    options: ["Ninguna", "Baja", "Media", "Alta", "Crítica"],
  },
  { key: "cantidadEvidencia", label: "Cantidad / evidencia observada", placeholder: "0 individuos, 2 capturas, daño foliar leve..." },
  {
    key: "accionTomada",
    label: "Acción tomada *",
    kind: "textarea",
    placeholder: "Acción inmediata, limpieza, retiro de trampa, cierre físico, aplicación, bloqueo, seguimiento.",
  },
  {
    key: "requiereCierreArea",
    label: "Requiere cierre de área *",
    kind: "select",
    options: ["Sí", "No"],
  },
  {
    key: "requiereProductoQuimico",
    label: "Requiere producto químico *",
    kind: "select",
    options: ["Sí", "No"],
  },
  { key: "periodoReingreso", label: "Periodo de reingreso", placeholder: "4 horas / 24 horas / No aplica" },
  {
    key: "resultadoVerificacion",
    label: "Resultado de verificación *",
    kind: "select",
    options: ["Conforme", "Con observación", "No conforme", "Pendiente seguimiento", "Requiere nueva inspección"],
  },
  {
    key: "liberacionQA",
    label: "Liberación QA *",
    kind: "select",
    options: ["Pendiente QA", "Liberado QA", "Retenido QA", "Rechazado QA", "Requiere desviación", "Requiere CAPA"],
  },
  { key: "desviacionAsociada", label: "Desviación asociada", placeholder: "DEV-2026-001 / CAPA-001" },
  {
    key: "accionCorrectiva",
    label: "Acción correctiva / CAPA",
    kind: "textarea",
    placeholder: "Obligatoria cuando exista actividad alta, crítica, no conformidad, cierre de área o retención QA.",
  },
  { key: "evidencia", label: "Evidencia / soporte", placeholder: "Foto, mapa de trampa, acta, QR, informe proveedor, checklist..." },
  {
    key: "observaciones",
    label: "Observaciones",
    kind: "textarea",
    placeholder: "Notas QA, restricciones, seguimiento, lotes impactados, próximos controles.",
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
  return `MIP-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function loadRecords(): PestRecord[] {
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

function saveRecords(records: PestRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export default function PlagasPage() {
  const [records, setRecords] = useState<PestRecord[]>([]);
  const [form, setForm] = useState<PestRecord>(emptyForm);
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

  function updateField(field: keyof PestRecord, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function needsCapa(): boolean {
    return (
      ["Alta", "Crítica"].includes(form.nivelActividad) ||
      ["Actividad alta", "Contaminación potencial", "Producto afectado", "Requiere investigación"].includes(form.hallazgo) ||
      ["No conforme", "Requiere nueva inspección"].includes(form.resultadoVerificacion) ||
      ["Retenido QA", "Rechazado QA", "Requiere desviación", "Requiere CAPA"].includes(form.liberacionQA) ||
      form.requiereCierreArea === "Sí"
    );
  }

  function validateForm(): string[] {
    const errors = requiredFields
      .filter((field) => isInvalid(form[field]))
      .map((field) => fieldLabels[field]);

    if (["Trampa adhesiva", "Trampa mecánica"].includes(form.metodoControl) && isInvalid(form.codigoTrampa)) {
      errors.push("El código de trampa es obligatorio cuando el método usa trampa");
    }

    if (form.requiereProductoQuimico === "Sí") {
      if (isInvalid(form.productoAplicado)) errors.push("El producto aplicado es obligatorio cuando se usa producto químico");
      if (isInvalid(form.loteProducto)) errors.push("El lote del producto es obligatorio cuando se usa producto químico");
      if (isInvalid(form.concentracion)) errors.push("La concentración es obligatoria cuando se usa producto químico");
      if (isInvalid(form.periodoReingreso)) errors.push("El periodo de reingreso es obligatorio cuando se usa producto químico");
    }

    if (form.hallazgo !== "Sin hallazgo" && form.hallazgo !== "Actividad ausente" && isInvalid(form.evidencia)) {
      errors.push("La evidencia es obligatoria cuando existe hallazgo o actividad de plagas");
    }

    if (["Liberado QA", "Retenido QA", "Rechazado QA"].includes(form.liberacionQA) && isInvalid(form.evidencia)) {
      errors.push("La evidencia es obligatoria cuando QA libera, retiene o rechaza");
    }

    if (needsCapa() && isInvalid(form.desviacionAsociada)) {
      errors.push("La desviación asociada es obligatoria para actividad crítica, no conformidad, cierre de área o retención QA");
    }

    if (needsCapa() && isInvalid(form.accionCorrectiva)) {
      errors.push("La acción correctiva / CAPA es obligatoria para actividad crítica, no conformidad, cierre de área o retención QA");
    }

    return Array.from(new Set(errors));
  }

  function fieldHasError(field: keyof PestRecord): boolean {
    if (!submitAttempted) return false;

    if (requiredFields.includes(field) && isInvalid(form[field])) return true;
    if (field === "codigoTrampa" && ["Trampa adhesiva", "Trampa mecánica"].includes(form.metodoControl) && isInvalid(form.codigoTrampa)) return true;
    if (field === "productoAplicado" && form.requiereProductoQuimico === "Sí" && isInvalid(form.productoAplicado)) return true;
    if (field === "loteProducto" && form.requiereProductoQuimico === "Sí" && isInvalid(form.loteProducto)) return true;
    if (field === "concentracion" && form.requiereProductoQuimico === "Sí" && isInvalid(form.concentracion)) return true;
    if (field === "periodoReingreso" && form.requiereProductoQuimico === "Sí" && isInvalid(form.periodoReingreso)) return true;
    if (field === "evidencia" && form.hallazgo !== "Sin hallazgo" && form.hallazgo !== "Actividad ausente" && isInvalid(form.evidencia)) return true;
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
      showCloud("No se guardó el control de plagas. Completa la información obligatoria.", errors, "warning");
      return;
    }

    const timestamp = nowIso();

    const payload: PestRecord = {
      ...form,
      codigoControl: clean(form.codigoControl),
      fecha: clean(form.fecha),
      hora: clean(form.hora),
      empresa: clean(form.empresa),
      sede: clean(form.sede),
      area: clean(form.area),
      ubicacion: clean(form.ubicacion),
      tipoRegistro: clean(form.tipoRegistro),
      plagaObjetivo: clean(form.plagaObjetivo),
      metodoControl: clean(form.metodoControl),
      dispositivoTrampa: clean(form.dispositivoTrampa),
      codigoTrampa: clean(form.codigoTrampa),
      proveedorServicio: clean(form.proveedorServicio),
      productoAplicado: clean(form.productoAplicado),
      loteProducto: clean(form.loteProducto),
      concentracion: clean(form.concentracion),
      responsableInspeccion: clean(form.responsableInspeccion),
      responsableVerificacion: clean(form.responsableVerificacion),
      hallazgo: clean(form.hallazgo),
      nivelActividad: clean(form.nivelActividad),
      cantidadEvidencia: clean(form.cantidadEvidencia),
      accionTomada: clean(form.accionTomada),
      requiereCierreArea: clean(form.requiereCierreArea),
      requiereProductoQuimico: clean(form.requiereProductoQuimico),
      periodoReingreso: clean(form.periodoReingreso),
      resultadoVerificacion: clean(form.resultadoVerificacion),
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
      editingId ? "Control de plagas actualizado correctamente." : "Control de plagas registrado correctamente con control GMP/GACP.",
      [],
      "success"
    );
  }

  function handleEdit(record: PestRecord) {
    setForm(record);
    setEditingId(record.id);
    setSubmitAttempted(false);
    showCloud("Registro cargado para edición. Verifica antes de actualizar.", [], "success");
  }

  function handleDelete(id: string) {
    const confirmed = window.confirm("¿Confirmas eliminar este registro? En ambiente GMP real debería manejarse como anulación auditada.");
    if (!confirmed) return;

    const nextRecords = records.filter((record) => record.id !== id);
    setRecords(nextRecords);
    saveRecords(nextRecords);
    showCloud("Registro eliminado del almacenamiento local.", [], "success");
  }

  function exportJson() {
    if (records.length === 0) {
      showCloud("No hay controles de plagas para exportar.", [], "warning");
      return;
    }

    const blob = new Blob([JSON.stringify(records, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `floratrack-plagas-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);

    showCloud("Archivo JSON de control de plagas exportado correctamente.", [], "success");
  }

  const filteredRecords = useMemo(() => {
    const term = clean(search).toLowerCase();

    return records.filter((record) => {
      const matchesSearch =
        !term ||
        [
          record.codigoControl,
          record.empresa,
          record.sede,
          record.area,
          record.ubicacion,
          record.tipoRegistro,
          record.plagaObjetivo,
          record.metodoControl,
          record.hallazgo,
          record.nivelActividad,
          record.liberacionQA,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

      const matchesQA = filterQA === "Todos" || record.liberacionQA === filterQA;

      return matchesSearch && matchesQA;
    });
  }, [records, search, filterQA]);

  const dashboard = useMemo(() => {
    return {
      total: records.length,
      sinActividad: records.filter((record) => ["Sin hallazgo", "Actividad ausente"].includes(record.hallazgo)).length,
      actividadAlta: records.filter((record) => ["Alta", "Crítica"].includes(record.nivelActividad)).length,
      pendienteQA: records.filter((record) => record.liberacionQA === "Pendiente QA").length,
      capa: records.filter((record) => record.liberacionQA === "Requiere CAPA" || record.accionCorrectiva).length,
    };
  }, [records]);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-slate-100">
      {cloud && <CloudNotice message={cloud.message} errors={cloud.errors} tone={cloud.tone} onClose={() => setCloud(null)} />}

      <section className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-3xl border border-lime-400/20 bg-slate-900/80 p-6 shadow-2xl shadow-lime-950/30">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-lime-300">
                FloraTrack Enterprise Compliance Platform
              </p>

              <h1 className="mt-3 text-3xl font-black text-white md:text-5xl">
                Manejo integrado de plagas GMP/GACP
              </h1>

              <p className="mt-3 max-w-5xl text-sm leading-6 text-slate-300 md:text-base">
                Control de inspecciones, trampas, hallazgos, actividad, acciones correctivas,
                productos aplicados, evidencia, proveedor, CAPA y liberación QA.
              </p>
            </div>

            <div className="rounded-2xl border border-lime-400/20 bg-lime-500/10 px-5 py-4 text-sm text-lime-100">
              <p className="font-bold">MIP activo</p>
              <p className="mt-1 text-lime-200">Inspección · Trampas · Hallazgos · QA · CAPA</p>
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
          <Metric title="Registros" value={dashboard.total} />
          <Metric title="Sin actividad" value={dashboard.sinActividad} tone="emerald" />
          <Metric title="Alta / crítica" value={dashboard.actividadAlta} tone="red" />
          <Metric title="Pendiente QA" value={dashboard.pendienteQA} tone="amber" />
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
                <h2 className="text-2xl font-black text-white">{editingId ? "Editar control MIP" : "Nuevo control MIP"}</h2>
                <p className="mt-1 text-sm text-slate-400">Ningún control de plagas puede guardarse vacío o incompleto.</p>
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

                      {hasError && <p className="mt-1 text-xs font-bold text-red-300">Campo obligatorio o condición MIP requerida.</p>}
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
                {editingId ? "Actualizar control MIP" : "Guardar control MIP"}
              </button>

              <button type="button" onClick={resetForm} className="rounded-2xl border border-slate-600 px-6 py-3 text-sm font-bold text-slate-200 transition hover:bg-slate-800">
                Limpiar formulario
              </button>
            </div>
          </form>

          <section className="rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-xl">
            <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="text-2xl font-black text-white">Registro maestro MIP</h2>
                <p className="mt-1 text-sm text-slate-400">Consulta, filtra, edita y exporta controles de plagas.</p>
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
                placeholder="Buscar por código, área, plaga, trampa, QA..."
              />

              <select
                value={filterQA}
                onChange={(event) => setFilterQA(event.target.value)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none ring-lime-400/40 transition focus:border-lime-400 focus:ring-4"
              >
                <option>Todos</option>
                <option>Pendiente QA</option>
                <option>Liberado QA</option>
                <option>Retenido QA</option>
                <option>Rechazado QA</option>
                <option>Requiere desviación</option>
                <option>Requiere CAPA</option>
              </select>
            </div>

            <div className="max-h-[780px] space-y-4 overflow-auto pr-2">
              {filteredRecords.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center text-sm text-slate-400">
                  No hay controles MIP registrados. Crea el primer registro con datos completos.
                </div>
              ) : (
                filteredRecords.map((record) => (
                  <article key={record.id} className="rounded-2xl border border-slate-700 bg-slate-950 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-white">{record.codigoControl} · {record.plagaObjetivo}</h3>
                          <StatusPill value={record.liberacionQA} />
                          <span className="rounded-full border border-lime-400/30 bg-lime-500/10 px-3 py-1 text-xs font-bold text-lime-200">
                            Actividad {record.nivelActividad}
                          </span>
                        </div>

                        <p className="mt-2 text-sm text-slate-400">{record.fecha} · {record.hora} · {record.area} · {record.ubicacion}</p>
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
                      <Data label="Tipo" value={record.tipoRegistro} />
                      <Data label="Método" value={record.metodoControl} />
                      <Data label="Trampa" value={record.codigoTrampa || "Sin registro"} />
                      <Data label="Proveedor" value={record.proveedorServicio || "Sin registro"} />
                      <Data label="Hallazgo" value={record.hallazgo} />
                      <Data label="Cantidad / evidencia" value={record.cantidadEvidencia || "Sin registro"} />
                      <Data label="Producto" value={record.productoAplicado || "Sin registro"} />
                      <Data label="Lote producto" value={record.loteProducto || "Sin registro"} />
                      <Data label="Cierre área" value={record.requiereCierreArea} />
                      <Data label="Verificación" value={record.resultadoVerificacion} />
                      <Data label="Inspeccionó" value={record.responsableInspeccion} />
                      <Data label="Verificó" value={record.responsableVerificacion} />
                      <Data label="Evidencia" value={record.evidencia || "Sin registro"} />
                    </div>

                    <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300">
                      <p><span className="font-bold text-slate-100">Acción tomada: </span>{record.accionTomada}</p>

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

function CloudNotice({ message, errors, tone, onClose }: { message: string; errors: string[]; tone: CloudTone; onClose: () => void }) {
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
    value === "Liberado QA"
      ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
      : value === "Pendiente QA"
      ? "border-amber-400/40 bg-amber-500/10 text-amber-200"
      : "border-red-400/40 bg-red-500/10 text-red-200";

  return <span className={`rounded-full border px-3 py-1 text-xs font-bold ${className}`}>{value || "Sin QA"}</span>;
}
