"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Option = {
  label: string;
  value: string;
};

type Field = {
  name: string;
  label: string;
  type?: "text" | "number" | "date" | "select";
  options?: Option[];
  required?: boolean;
};

type Column = {
  label: string;
  accessor: string;
};

type DbRecord = Record<string, unknown> & {
  id?: string;
  status?: string;
};

type DbCrudModuleProps = {
  title: string;
  description: string;
  apiPath: string;
  buttonLabel: string;
  fields: Field[];
  columns: Column[];
  emptyForm: Record<string, string>;
  icon: string;
};

function getValue(record: DbRecord, accessor: string): unknown {
  return accessor.split(".").reduce<unknown>((value, key) => {
    if (value === null || value === undefined || typeof value !== "object") {
      return undefined;
    }

    return (value as Record<string, unknown>)[key];
  }, record);
}

function formatValue(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  if (typeof value === "string" && value.includes("T") && value.includes(":")) {
    const date = new Date(value);

    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString("es-CO");
    }
  }

  return String(value);
}

export default function DbCrudModule({
  title,
  description,
  apiPath,
  buttonLabel,
  fields,
  columns,
  emptyForm,
  icon,
}: DbCrudModuleProps) {
  const [records, setRecords] = useState<DbRecord[]>([]);
  const [form, setForm] = useState<Record<string, string>>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  const approved = useMemo(
    () =>
      records.filter(
        (record) =>
          record.status === "Aprobado" ||
          record.status === "Activo" ||
          record.status === "Autorizada" ||
          record.status === "Vigente"
      ).length,
    [records]
  );

  const pending = useMemo(
    () =>
      records.filter(
        (record) =>
          record.status === "Pendiente" ||
          record.status === "Planeación" ||
          record.status === "Borrador" ||
          record.status === "Solicitado"
      ).length,
    [records]
  );

  const blocked = useMemo(
    () =>
      records.filter(
        (record) =>
          record.status === "Bloqueado" ||
          record.status === "Rechazado" ||
          record.status === "Vencida"
      ).length,
    [records]
  );

  const loadRecords = useCallback(async function loadRecords() {
    try {
      const response = await fetch(apiPath, {
        cache: "no-store",
      });

      const result = await response.json();

      if (!result.ok) {
        setMessage(result.error || "Error cargando registros");
        return;
      }

      setRecords(Array.isArray(result.data) ? (result.data as DbRecord[]) : []);
      setMessage("Registros cargados desde base de datos.");
    } catch {
      setMessage("Error conectando con API.");
    }
  }, [apiPath]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadRecords();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadRecords]);

  function updateField(name: string, value: string) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function resetForm() {
    setForm(emptyForm);
    setShowForm(false);
  }

  async function saveRecord() {
    const missingRequired = fields
      .filter((field) => field.required)
      .some((field) => !String(form[field.name] || "").trim());

    if (missingRequired) {
      setMessage("Complete los campos obligatorios.");
      return;
    }

    const response = await fetch(apiPath, {
      method: form.id ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const result = await response.json();

    if (!result.ok) {
      setMessage(result.error || "Error guardando registro");
      return;
    }

    setMessage(form.id ? "Registro actualizado." : "Registro creado.");
    resetForm();
    loadRecords();
  }

  function editRecord(record: DbRecord) {
    const nextForm: Record<string, string> = {
      ...emptyForm,
      id: typeof record.id === "string" ? record.id : "",
    };

    fields.forEach((field) => {
      const value = record[field.name];

      if (field.type === "date" && value) {
        nextForm[field.name] = String(value).slice(0, 10);
      } else {
        nextForm[field.name] =
          value !== null && value !== undefined ? String(value) : "";
      }
    });

    setForm(nextForm);
    setShowForm(true);
  }

  async function deleteRecord(record: DbRecord) {
    const confirmed = confirm(
      "¿Eliminar este registro? Si tiene registros relacionados puede fallar."
    );

    if (!confirmed) {
      return;
    }

    const recordId = typeof record.id === "string" ? record.id : "";

    if (!recordId) {
      setMessage("Registro sin ID valido para eliminar.");
      return;
    }

    const response = await fetch(`${apiPath}?id=${recordId}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (!result.ok) {
      setMessage(result.error || "No fue posible eliminar el registro.");
      return;
    }

    setMessage("Registro eliminado.");
    loadRecords();
  }

  const filteredRecords = records.filter((record) =>
    JSON.stringify(record).toLowerCase().includes(search.toLowerCase())
  );

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
          onClick={() => {
            setShowForm(true);
            setForm(emptyForm);
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl shadow text-lg font-bold"
        >
          + {buttonLabel}
        </button>
      </div>

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-8 font-semibold">
          {message}
        </div>
      )}

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">Registros</div>
          <div className="text-3xl font-bold text-slate-800">{records.length}</div>
        </div>

        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">Aprobados / vigentes</div>
          <div className="text-3xl font-bold text-green-600">{approved}</div>
        </div>

        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">Pendientes</div>
          <div className="text-3xl font-bold text-yellow-600">{pending}</div>
        </div>

        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">Críticos</div>
          <div className="text-3xl font-bold text-red-600">{blocked}</div>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar registros..."
          className="flex-1 border rounded-xl px-4 py-3 text-slate-700"
        />

        <button
          onClick={loadRecords}
          className="px-5 py-3 rounded-xl border bg-white text-slate-700 font-semibold"
        >
          Actualizar
        </button>
      </div>

      {showForm && (
        <div className="border rounded-2xl p-6 mb-8 bg-slate-50">
          <h3 className="text-2xl font-bold text-slate-800 mb-5">
            {form.id ? "Editar registro" : "Nuevo registro"}
          </h3>

          <div className="grid grid-cols-2 gap-4">
            {fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-semibold text-slate-600 mb-2">
                  {field.label}
                  {field.required ? <span className="text-red-500"> *</span> : null}
                </label>

                {field.type === "select" ? (
                  <select
                    value={form[field.name] || ""}
                    onChange={(event) => updateField(field.name, event.target.value)}
                    className="w-full border rounded-xl px-4 py-3 bg-white text-slate-700"
                  >
                    <option value="">Seleccione...</option>
                    {field.options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type || "text"}
                    value={form[field.name] || ""}
                    onChange={(event) => updateField(field.name, event.target.value)}
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
              Guardar
            </button>
          </div>
        </div>
      )}

      {records.length === 0 ? (
        <div className="border rounded-2xl p-12 text-center">
          <div className="text-6xl mb-4">{icon}</div>
          <h3 className="text-2xl font-bold text-slate-700">
            No existen registros
          </h3>
          <p className="text-slate-500 mt-3">
            Cree el primer registro para iniciar operación regulatoria con base de datos.
          </p>
        </div>
      ) : (
        <div className="border rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-100">
              <tr>
                {columns.map((column) => (
                  <th key={column.label} className="px-4 py-3 text-sm text-slate-600">
                    {column.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-sm text-slate-600">Estado</th>
                <th className="px-4 py-3 text-sm text-slate-600">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id} className="border-t">
                  {columns.map((column) => (
                    <td key={column.label} className="px-4 py-3 text-slate-700">
                      {formatValue(getValue(record, column.accessor))}
                    </td>
                  ))}

                  <td className="px-4 py-3 text-slate-700">
                    {record.status || "-"}
                  </td>

                  <td className="px-4 py-3">
                    <button
                      onClick={() => editRecord(record)}
                      className="text-blue-600 font-semibold mr-4"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => deleteRecord(record)}
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
