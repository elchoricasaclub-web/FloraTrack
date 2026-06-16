"use client";

import { useEffect, useState } from "react";

type Company = {
  id: string;
  name: string;
  nit: string | null;
  city: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    users: number;
    farms: number;
  };
};

const emptyForm = {
  id: "",
  name: "",
  nit: "",
  city: "",
  status: "Activa",
};

export default function CompaniesModule() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  async function loadCompanies() {
    try {
      const response = await fetch("/api/companies", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!result.ok) {
        setMessage(result.error || "Error cargando empresas");
        return;
      }

      setCompanies(result.data);
      setMessage("Empresas cargadas desde base de datos.");
    } catch {
      setMessage("Error conectando con API de empresas.");
    }
  }

  useEffect(() => {
    loadCompanies();
  }, []);

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

  async function saveCompany() {
    const method = form.id ? "PUT" : "POST";

    const response = await fetch("/api/companies", {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const result = await response.json();

    if (!result.ok) {
      setMessage(result.error || "Error guardando empresa");
      return;
    }

    setMessage(form.id ? "Empresa actualizada." : "Empresa creada.");
    resetForm();
    loadCompanies();
  }

  function editCompany(company: Company) {
    setForm({
      id: company.id,
      name: company.name || "",
      nit: company.nit || "",
      city: company.city || "",
      status: company.status || "Activa",
    });

    setShowForm(true);
  }

  async function deleteCompany(company: Company) {
    const confirmed = confirm("¿Eliminar empresa? Si tiene usuarios o predios relacionados puede fallar.");

    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/companies?id=${company.id}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (!result.ok) {
      setMessage(result.error || "No fue posible eliminar la empresa.");
      return;
    }

    setMessage("Empresa eliminada.");
    loadCompanies();
  }

  const filteredCompanies = companies.filter((company) =>
    Object.values(company).join(" ").toLowerCase().includes(search.toLowerCase())
  );

  const activeCompanies = companies.filter((company) => company.status === "Activa").length;
  const reviewCompanies = companies.filter((company) => company.status === "En revisión").length;
  const inactiveCompanies = companies.filter((company) => company.status === "Inactiva").length;

  return (
    <section className="bg-white rounded-2xl shadow p-8">
      <div className="flex justify-between items-start gap-6 mb-8">
        <div>
          <h2 className="text-4xl font-bold text-slate-800">
            Empresas
          </h2>
          <p className="text-slate-500 mt-2 max-w-2xl leading-relaxed">
            Módulo conectado a base de datos real con Prisma. Permite crear,
            editar, consultar y eliminar empresas desde SQLite local.
          </p>
        </div>

        <button
          onClick={() => {
            setShowForm(true);
            setForm(emptyForm);
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl shadow text-lg font-bold"
        >
          + Nueva Empresa
        </button>
      </div>

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-8 font-semibold">
          {message}
        </div>
      )}

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">Empresas</div>
          <div className="text-3xl font-bold text-slate-800">
            {companies.length}
          </div>
        </div>

        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">Activas</div>
          <div className="text-3xl font-bold text-green-600">
            {activeCompanies}
          </div>
        </div>

        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">En revisión</div>
          <div className="text-3xl font-bold text-yellow-600">
            {reviewCompanies}
          </div>
        </div>

        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">Inactivas</div>
          <div className="text-3xl font-bold text-red-600">
            {inactiveCompanies}
          </div>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar empresa, NIT, ciudad..."
          className="flex-1 border rounded-xl px-4 py-3 text-slate-700"
        />

        <button
          onClick={loadCompanies}
          className="px-5 py-3 rounded-xl border bg-white text-slate-700 font-semibold"
        >
          Actualizar
        </button>
      </div>

      {showForm && (
        <div className="border rounded-2xl p-6 mb-8 bg-slate-50">
          <h3 className="text-2xl font-bold text-slate-800 mb-5">
            {form.id ? "Editar empresa" : "Nueva empresa"}
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">
                Nombre empresa *
              </label>
              <input
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                className="w-full border rounded-xl px-4 py-3 bg-white text-slate-700"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">
                NIT
              </label>
              <input
                value={form.nit}
                onChange={(event) => updateField("nit", event.target.value)}
                className="w-full border rounded-xl px-4 py-3 bg-white text-slate-700"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">
                Ciudad
              </label>
              <input
                value={form.city}
                onChange={(event) => updateField("city", event.target.value)}
                className="w-full border rounded-xl px-4 py-3 bg-white text-slate-700"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">
                Estado
              </label>
              <select
                value={form.status}
                onChange={(event) => updateField("status", event.target.value)}
                className="w-full border rounded-xl px-4 py-3 bg-white text-slate-700"
              >
                <option value="Activa">Activa</option>
                <option value="En revisión">En revisión</option>
                <option value="Inactiva">Inactiva</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={resetForm}
              className="px-5 py-3 rounded-xl border text-slate-600 bg-white"
            >
              Cancelar
            </button>

            <button
              onClick={saveCompany}
              className="px-5 py-3 rounded-xl bg-green-600 text-white font-semibold"
            >
              Guardar empresa
            </button>
          </div>
        </div>
      )}

      <div className="border rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-3 text-sm text-slate-600">Empresa</th>
              <th className="px-4 py-3 text-sm text-slate-600">NIT</th>
              <th className="px-4 py-3 text-sm text-slate-600">Ciudad</th>
              <th className="px-4 py-3 text-sm text-slate-600">Estado</th>
              <th className="px-4 py-3 text-sm text-slate-600">Usuarios</th>
              <th className="px-4 py-3 text-sm text-slate-600">Predios</th>
              <th className="px-4 py-3 text-sm text-slate-600">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {filteredCompanies.map((company) => (
              <tr key={company.id} className="border-t">
                <td className="px-4 py-3 font-semibold text-slate-800">
                  {company.name}
                </td>
                <td className="px-4 py-3 text-slate-700">{company.nit || "-"}</td>
                <td className="px-4 py-3 text-slate-700">{company.city || "-"}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-bold">
                    {company.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {company._count?.users ?? 0}
                </td>
                <td className="px-4 py-3 text-slate-700">
                  {company._count?.farms ?? 0}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => editCompany(company)}
                      className="text-blue-600 font-semibold text-left"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => deleteCompany(company)}
                      className="text-red-600 font-semibold text-left"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredCompanies.length === 0 && (
              <tr>
                <td className="px-4 py-8 text-center text-slate-500" colSpan={7}>
                  No existen empresas registradas en base de datos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
