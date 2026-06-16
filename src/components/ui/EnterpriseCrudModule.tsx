"use client";

import { useEffect, useMemo, useState } from "react";

type Field = {
  name: string;
  label: string;
  type?: "text" | "number" | "date" | "select" | "textarea";
  options?: string[];
};

type Metric = {
  label: string;
  value: string;
};

type RecordItem = Record<string, string>;

type EnterpriseCrudModuleProps = {
  storageKey: string;
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

export default function EnterpriseCrudModule({
  storageKey,
  title,
  description,
  buttonLabel,
  icon,
  emptyTitle,
  emptyText,
  metrics,
  fields,
  tableHeaders,
}: EnterpriseCrudModuleProps) {
  const initialForm = useMemo(() => {
    return fields.reduce<RecordItem>((acc, field) => {
      acc[field.name] = "";
      return acc;
    }, {});
  }, [fields]);

  const [records, setRecords] = useState<RecordItem[]>([]);
  const [form, setForm] = useState<RecordItem>(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setRecords(JSON.parse(saved));
      }
    } catch {
      setRecords([]);
    } finally {
      setLoaded(true);
    }
  }, [storageKey]);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(storageKey, JSON.stringify(records));
    }
  }, [records, loaded, storageKey]);

  function updateField(name: string, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function saveRecord() {
    const hasContent = Object.values(form).some((value) => value.trim() !== "");
    if (!hasContent) return;

    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}`;

    setRecords((current) => [
      ...current,
      {
        ...form,
        id,
        createdAt: new Date().toLocaleDateString("es-CO"),
      },
    ]);

    setForm(initialForm);
    setShowForm(false);
  }

  function deleteRecord(id: string) {
    setRecords((current) => current.filter((record) => record.id !== id));
  }

  function exportJson() {
    const payload = JSON.stringify(records, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const element = document.createElement("a");
    element.href = url;
    element.download = `${storageKey}.json`;
    element.click();
    URL.revokeObjectURL(url);
  }

  const filteredRecords = records.filter((record) => {
    const content = Object.values(record).join(" ").toLowerCase();
    return content.includes(search.toLowerCase());
  });

  const dynamicMetrics = metrics.map((metric, index) => {
    if (index === 0) {
      return { ...metric, value: String(records.length) };
    }

    return metric;
  });

  return (
    <section className="bg-white rounded-2xl shadow p-8">
      <div className="flex justify-between items-start gap-6 mb-8">
        <div>
          <h2 className="text-4xl font-bold text-slate-800">{title}</h2>
          <p className="text-slate-500 mt-2 max-w-3xl leading-relaxed">
            {description}
          </p>
        </div>

        <button
          onClick={() => setShowForm((value) => !value)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl shadow text-lg"
        >
          + {buttonLabel}
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {dynamicMetrics.map((item) => (
          <div key={item.label} className="border rounded-xl p-4 bg-white">
            <div className="text-sm text-slate-500">{item.label}</div>
            <div className="text-3xl font-bold text-slate-800">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 mb-6">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar registros..."
          className="flex-1 border rounded-xl px-4 py-3 text-slate-700"
        />

        <button
          onClick={exportJson}
          className="px-5 py-3 rounded-xl border bg-white text-slate-700 font-semibold"
        >
          Exportar JSON
        </button>
      </div>

      {showForm && (
        <div className="border rounded-2xl p-6 mb-8 bg-slate-50">
          <h3 className="text-2xl font-bold text-slate-800 mb-5">
            Nuevo registro
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {fields.map((field) => (
              <div
                key={field.name}
                className={field.type === "textarea" ? "col-span-2" : ""}
              >
                <label className="block text-sm font-semibold text-slate-600 mb-2">
                  {field.label}
                </label>

                {field.type === "select" ? (
                  <select
                    value={form[field.name]}
                    onChange={(event) => updateField(field.name, event.target.value)}
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
                    value={form[field.name]}
                    onChange={(event) => updateField(field.name, event.target.value)}
                    className="w-full border rounded-xl px-4 py-3 bg-white text-slate-700 min-h-[110px]"
                  />
                ) : (
                  <input
                    type={field.type ?? "text"}
                    value={form[field.name]}
                    onChange={(event) => updateField(field.name, event.target.value)}
                    className="w-full border rounded-xl px-4 py-3 bg-white text-slate-700"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setShowForm(false)}
              className="px-5 py-3 rounded-xl border text-slate-600 bg-white"
            >
              Cancelar
            </button>

            <button
              onClick={saveRecord}
              className="px-5 py-3 rounded-xl bg-green-600 text-white font-semibold"
            >
              Guardar registro
            </button>
          </div>
        </div>
      )}

      {records.length === 0 ? (
        <div className="border rounded-2xl p-12 text-center">
          <div className="text-6xl mb-4">{icon}</div>

          <h3 className="text-2xl font-bold text-slate-700">{emptyTitle}</h3>

          <p className="text-slate-500 mt-3 max-w-md mx-auto">{emptyText}</p>
        </div>
      ) : (
        <div className="border rounded-2xl overflow-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-100">
              <tr>
                {tableHeaders.map((header) => (
                  <th key={header} className="px-4 py-3 text-sm text-slate-600">
                    {header}
                  </th>
                ))}
                <th className="px-4 py-3 text-sm text-slate-600">Fecha</th>
                <th className="px-4 py-3 text-sm text-slate-600">Acción</th>
              </tr>
            </thead>

            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id} className="border-t">
                  {tableHeaders.map((header, index) => {
                    const field = fields[index];

                    return (
                      <td key={header} className="px-4 py-3 text-slate-700">
                        {field ? record[field.name] || "-" : "-"}
                      </td>
                    );
                  })}

                  <td className="px-4 py-3 text-slate-500">{record.createdAt}</td>

                  <td className="px-4 py-3">
                    <button
                      onClick={() => deleteRecord(record.id)}
                      className="text-red-600 font-semibold"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
