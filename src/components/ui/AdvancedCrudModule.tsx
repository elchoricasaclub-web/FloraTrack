"use client";

import { useEffect, useMemo, useState } from "react";

type Field = {
  name: string;
  label: string;
  type?: "text" | "number" | "date" | "select" | "textarea";
  options?: string[];
  required?: boolean;
};

type Metric = {
  label: string;
  value: string;
};

type RecordItem = Record<string, string>;

type AuditEvent = {
  id: string;
  module: string;
  action: string;
  recordId: string;
  recordLabel: string;
  responsible: string;
  status: string;
  timestamp: string;
  snapshot: RecordItem;
};

type AdvancedCrudModuleProps = {
  storageKey: string;
  auditKey?: string;
  moduleName: string;
  title: string;
  description: string;
  buttonLabel: string;
  icon: string;
  emptyTitle: string;
  emptyText: string;
  metrics: Metric[];
  fields: Field[];
  tableHeaders: string[];
};

function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function getTimestamp() {
  return new Date().toLocaleString("es-CO");
}

function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const element = document.createElement("a");

  element.href = url;
  element.download = filename;
  element.click();

  URL.revokeObjectURL(url);
}

function toCsv(records: RecordItem[]) {
  if (records.length === 0) {
    return "";
  }

  const headers = Array.from(
    records.reduce<Set<string>>((acc, record) => {
      Object.keys(record).forEach((key) => acc.add(key));
      return acc;
    }, new Set<string>())
  );

  const escapeCell = (value: string) => {
    const safeValue = String(value ?? "");
    return `"${safeValue.replaceAll('"', '""')}"`;
  };

  const rows = records.map((record) =>
    headers.map((header) => escapeCell(record[header] ?? "")).join(",")
  );

  return [headers.join(","), ...rows].join("\n");
}

export default function AdvancedCrudModule({
  storageKey,
  auditKey = "floratrack_audit_trail",
  moduleName,
  title,
  description,
  buttonLabel,
  icon,
  emptyTitle,
  emptyText,
  metrics,
  fields,
  tableHeaders,
}: AdvancedCrudModuleProps) {
  const systemFields: Field[] = [
    {
      name: "estado",
      label: "Estado",
      type: "select",
      required: true,
      options: ["Borrador", "Pendiente", "En revisión", "Aprobado", "Rechazado", "Cerrado", "Bloqueado"],
    },
    {
      name: "responsable",
      label: "Responsable",
      required: true,
    },
    {
      name: "fecha",
      label: "Fecha",
      type: "date",
      required: true,
    },
  ];

  const allFields = useMemo(() => {
    const existingNames = new Set(fields.map((field) => field.name));
    const merged = [...fields];

    systemFields.forEach((field) => {
      if (!existingNames.has(field.name)) {
        merged.push(field);
      }
    });

    return merged;
  }, [fields]);

  const initialForm = useMemo(() => {
    return allFields.reduce<RecordItem>((acc, field) => {
      acc[field.name] = field.name === "fecha" ? getToday() : "";
      return acc;
    }, {});
  }, [allFields]);

  const [records, setRecords] = useState<RecordItem[]>([]);
  const [form, setForm] = useState<RecordItem>(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [search, setSearch] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<RecordItem | null>(null);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);

  useEffect(() => {
    try {
      const savedRecords = localStorage.getItem(storageKey);
      const savedAudit = localStorage.getItem(auditKey);

      if (savedRecords) {
        setRecords(JSON.parse(savedRecords));
      }

      if (savedAudit) {
        setAuditEvents(JSON.parse(savedAudit));
      }
    } catch {
      setRecords([]);
      setAuditEvents([]);
    } finally {
      setLoaded(true);
    }
  }, [storageKey, auditKey]);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(storageKey, JSON.stringify(records));
    }
  }, [records, loaded, storageKey]);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(auditKey, JSON.stringify(auditEvents));
    }
  }, [auditEvents, loaded, auditKey]);

  function addAudit(action: string, record: RecordItem) {
    const event: AuditEvent = {
      id: createId(),
      module: moduleName,
      action,
      recordId: record.id || "",
      recordLabel:
        record.codigo ||
        record.nombre ||
        record.lote ||
        record.titulo ||
        record.producto ||
        record.id ||
        "Registro",
      responsible: record.responsable || "Sin responsable",
      status: record.estado || "Sin estado",
      timestamp: getTimestamp(),
      snapshot: record,
    };

    setAuditEvents((current) => [event, ...current]);
  }

  function updateField(name: string, value: string) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function resetForm() {
    setForm(initialForm);
    setEditingId("");
    setShowForm(false);
  }

  function saveRecord() {
    const requiredFields = allFields.filter((field) => field.required);
    const missingRequired = requiredFields.some(
      (field) => !String(form[field.name] || "").trim()
    );

    if (missingRequired) {
      alert("Complete los campos obligatorios: Estado, Responsable y Fecha.");
      return;
    }

    const hasContent = Object.values(form).some((value) => value.trim() !== "");

    if (!hasContent) {
      return;
    }

    if (editingId) {
      const updatedRecord = {
        ...form,
        id: editingId,
        updatedAt: getTimestamp(),
      };

      setRecords((current) =>
        current.map((record) => (record.id === editingId ? updatedRecord : record))
      );

      addAudit("EDITADO", updatedRecord);
      resetForm();
      return;
    }

    const newRecord = {
      ...form,
      id: createId(),
      createdAt: getTimestamp(),
      updatedAt: getTimestamp(),
    };

    setRecords((current) => [newRecord, ...current]);
    addAudit("CREADO", newRecord);
    resetForm();
  }

  function editRecord(record: RecordItem) {
    setForm({
      ...initialForm,
      ...record,
    });
    setEditingId(record.id);
    setShowForm(true);
  }

  function duplicateRecord(record: RecordItem) {
    const duplicated = {
      ...record,
      id: createId(),
      codigo: record.codigo ? `${record.codigo}-COPIA` : record.codigo,
      estado: "Borrador",
      createdAt: getTimestamp(),
      updatedAt: getTimestamp(),
    };

    setRecords((current) => [duplicated, ...current]);
    addAudit("DUPLICADO", duplicated);
  }

  function deleteRecord(record: RecordItem) {
    const confirmed = confirm("¿Eliminar este registro? Esta acción quedará en auditoría.");

    if (!confirmed) {
      return;
    }

    setRecords((current) => current.filter((item) => item.id !== record.id));
    addAudit("ELIMINADO", record);
  }

  function changeRecordStatus(record: RecordItem, nextStatus: string) {
    const updated = {
      ...record,
      estado: nextStatus,
      updatedAt: getTimestamp(),
    };

    setRecords((current) =>
      current.map((item) => (item.id === record.id ? updated : item))
    );

    addAudit(`CAMBIO DE ESTADO A ${nextStatus.toUpperCase()}`, updated);
  }

  function exportJson() {
    downloadFile(
      `${storageKey}.json`,
      JSON.stringify(records, null, 2),
      "application/json"
    );
  }

  function exportCsv() {
    downloadFile(`${storageKey}.csv`, toCsv(records), "text/csv;charset=utf-8");
  }

  function exportAudit() {
    const moduleAudit = auditEvents.filter((event) => event.module === moduleName);

    downloadFile(
      `${storageKey}_auditoria.json`,
      JSON.stringify(moduleAudit, null, 2),
      "application/json"
    );
  }

  const filteredRecords = records.filter((record) => {
    const content = Object.values(record).join(" ").toLowerCase();
    return content.includes(search.toLowerCase());
  });

  const moduleAudit = auditEvents.filter((event) => event.module === moduleName);

  const dynamicMetrics = metrics.map((metric, index) => {
    if (index === 0) {
      return {
        ...metric,
        value: String(records.length),
      };
    }

    if (metric.label.toLowerCase().includes("pend")) {
      return {
        ...metric,
        value: String(records.filter((record) => record.estado === "Pendiente").length),
      };
    }

    if (metric.label.toLowerCase().includes("aprob")) {
      return {
        ...metric,
        value: String(records.filter((record) => record.estado === "Aprobado").length),
      };
    }

    if (metric.label.toLowerCase().includes("crít") || metric.label.toLowerCase().includes("critic")) {
      return {
        ...metric,
        value: String(records.filter((record) => record.estado === "Bloqueado").length),
      };
    }

    return metric;
  });

  return (
    <section className="bg-white rounded-2xl shadow p-8">
      <div className="flex justify-between items-start gap-6 mb-8">
        <div>
          <h2 className="text-4xl font-bold text-slate-800">{title}</h2>
          <p className="text-slate-500 mt-2 max-w-2xl leading-relaxed">
            {description}
          </p>
        </div>

        <button
          onClick={() => {
            setShowForm((value) => !value);
            setEditingId("");
            setForm(initialForm);
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl shadow text-lg"
        >
          + {buttonLabel}
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {dynamicMetrics.map((item) => (
          <div key={item.label} className="border rounded-xl p-4 bg-white">
            <div className="text-sm text-slate-500">{item.label}</div>
            <div className="text-3xl font-bold text-slate-800">
              {item.value}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por código, lote, responsable, estado..."
          className="flex-1 min-w-[280px] border rounded-xl px-4 py-3 text-slate-700"
        />

        <button
          onClick={exportJson}
          className="px-5 py-3 rounded-xl border bg-white text-slate-700 font-semibold"
        >
          Exportar JSON
        </button>

        <button
          onClick={exportCsv}
          className="px-5 py-3 rounded-xl border bg-white text-slate-700 font-semibold"
        >
          Exportar CSV
        </button>

        <button
          onClick={exportAudit}
          className="px-5 py-3 rounded-xl border bg-white text-slate-700 font-semibold"
        >
          Auditoría
        </button>
      </div>

      {showForm && (
        <div className="border rounded-2xl p-6 mb-8 bg-slate-50">
          <h3 className="text-2xl font-bold text-slate-800 mb-5">
            {editingId ? "Editar registro" : "Nuevo registro"}
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {allFields.map((field) => (
              <div
                key={field.name}
                className={field.type === "textarea" ? "col-span-2" : ""}
              >
                <label className="block text-sm font-semibold text-slate-600 mb-2">
                  {field.label}
                  {field.required ? <span className="text-red-500"> *</span> : null}
                </label>

                {field.type === "select" ? (
                  <select
                    value={form[field.name] || ""}
                    onChange={(event) =>
                      updateField(field.name, event.target.value)
                    }
                    className="w-full border rounded-xl px-4 py-3 bg-white text-slate-700"
                  >
                    <option value="">Seleccione...</option>
                    {field.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : field.type === "textarea" ? (
                  <textarea
                    value={form[field.name] || ""}
                    onChange={(event) =>
                      updateField(field.name, event.target.value)
                    }
                    className="w-full border rounded-xl px-4 py-3 bg-white text-slate-700 min-h-[120px]"
                  />
                ) : (
                  <input
                    type={field.type ?? "text"}
                    value={form[field.name] || ""}
                    onChange={(event) =>
                      updateField(field.name, event.target.value)
                    }
                    className="w-full border rounded-xl px-4 py-3 bg-white text-slate-700"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={resetForm}
              className="px-5 py-3 rounded-xl border text-slate-600 bg-white"
            >
              Cancelar
            </button>

            <button
              onClick={saveRecord}
              className="px-5 py-3 rounded-xl bg-green-600 text-white font-semibold"
            >
              {editingId ? "Guardar cambios" : "Guardar registro"}
            </button>
          </div>
        </div>
      )}

      {records.length === 0 ? (
        <div className="border rounded-2xl p-12 text-center">
          <div className="text-6xl mb-4">{icon}</div>

          <h3 className="text-2xl font-bold text-slate-700">
            {emptyTitle}
          </h3>

          <p className="text-slate-500 mt-3 max-w-md mx-auto">
            {emptyText}
          </p>
        </div>
      ) : (
        <div className="border rounded-2xl overflow-hidden mb-8">
          <table className="w-full text-left">
            <thead className="bg-slate-100">
              <tr>
                {tableHeaders.map((header) => (
                  <th key={header} className="px-4 py-3 text-sm text-slate-600">
                    {header}
                  </th>
                ))}
                <th className="px-4 py-3 text-sm text-slate-600">Estado</th>
                <th className="px-4 py-3 text-sm text-slate-600">Responsable</th>
                <th className="px-4 py-3 text-sm text-slate-600">Fecha</th>
                <th className="px-4 py-3 text-sm text-slate-600">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id} className="border-t align-top">
                  {tableHeaders.map((header, index) => {
                    const field = fields[index];

                    return (
                      <td key={header} className="px-4 py-3 text-slate-700">
                        {field ? record[field.name] || "-" : "-"}
                      </td>
                    );
                  })}

                  <td className="px-4 py-3">
                    <select
                      value={record.estado || "Borrador"}
                      onChange={(event) =>
                        changeRecordStatus(record, event.target.value)
                      }
                      className="border rounded-lg px-2 py-1 text-sm"
                    >
                      {["Borrador", "Pendiente", "En revisión", "Aprobado", "Rechazado", "Cerrado", "Bloqueado"].map(
                        (status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        )
                      )}
                    </select>
                  </td>

                  <td className="px-4 py-3 text-slate-700">
                    {record.responsable || "-"}
                  </td>

                  <td className="px-4 py-3 text-slate-500">
                    {record.fecha || record.createdAt || "-"}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => setSelectedRecord(record)}
                        className="text-slate-700 font-semibold text-left"
                      >
                        Trazabilidad
                      </button>

                      <button
                        onClick={() => editRecord(record)}
                        className="text-blue-600 font-semibold text-left"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => duplicateRecord(record)}
                        className="text-green-600 font-semibold text-left"
                      >
                        Duplicar
                      </button>

                      <button
                        onClick={() => deleteRecord(record)}
                        className="text-red-600 font-semibold text-left"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="border rounded-2xl p-6 bg-slate-50">
        <h3 className="text-2xl font-bold text-slate-800 mb-4">
          Auditoría del módulo
        </h3>

        {moduleAudit.length === 0 ? (
          <p className="text-slate-500">
            Aún no existen eventos de auditoría para este módulo.
          </p>
        ) : (
          <div className="space-y-3 max-h-[280px] overflow-y-auto">
            {moduleAudit.slice(0, 20).map((event) => (
              <div key={event.id} className="bg-white border rounded-xl p-4">
                <div className="font-bold text-slate-700">
                  {event.action} · {event.recordLabel}
                </div>
                <div className="text-sm text-slate-500 mt-1">
                  {event.timestamp} · Responsable: {event.responsible} · Estado: {event.status}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedRecord && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-3xl font-bold text-slate-800">
                  Trazabilidad del registro
                </h3>
                <p className="text-slate-500 mt-1">
                  ID: {selectedRecord.id}
                </p>
              </div>

              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 rounded-xl border"
              >
                Cerrar
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {Object.entries(selectedRecord).map(([key, value]) => (
                <div key={key} className="border rounded-xl p-3">
                  <div className="text-xs uppercase text-slate-400">{key}</div>
                  <div className="text-slate-700 font-semibold break-words">
                    {value || "-"}
                  </div>
                </div>
              ))}
            </div>

            <h4 className="text-xl font-bold text-slate-800 mb-3">
              Historial de auditoría asociado
            </h4>

            <div className="space-y-3">
              {moduleAudit
                .filter((event) => event.recordId === selectedRecord.id)
                .map((event) => (
                  <div key={event.id} className="border rounded-xl p-4">
                    <div className="font-bold text-slate-700">{event.action}</div>
                    <div className="text-sm text-slate-500">
                      {event.timestamp} · {event.responsible} · {event.status}
                    </div>
                  </div>
                ))}

              {moduleAudit.filter((event) => event.recordId === selectedRecord.id).length === 0 && (
                <div className="text-slate-500">
                  No hay eventos asociados todavía.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
