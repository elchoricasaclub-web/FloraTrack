"use client";

import { useEffect, useState } from "react";

type Company = {
  id: string;
  name: string;
};

type Farm = {
  id: string;
  name: string;
  city: string | null;
  areaHa: number | null;
  status: string;
  companyId: string | null;
  company?: Company | null;
  _count?: {
    crops: number;
  };
};

const emptyForm = {
  id: "",
  name: "",
  city: "",
  areaHa: "",
  status: "Activo",
  companyId: "",
};

export default function PrediosModule() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");

  async function loadCompanies() {
    const response = await fetch("/api/companies", { cache: "no-store" });
    const result = await response.json();

    if (result.ok) {
      setCompanies(result.data);
    }
  }

  async function loadFarms() {
    const response = await fetch("/api/farms", { cache: "no-store" });
    const result = await response.json();

    if (!result.ok) {
      setMessage(result.error || "Error cargando predios");
      return;
    }

    setFarms(result.data);
    setMessage("Predios cargados desde base de datos.");
  }

  useEffect(() => {
    loadCompanies();
    loadFarms();
  }, []);

  function updateField(name: string, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setShowForm(false);
  }

  async function saveFarm() {
    const response = await fetch("/api/farms", {
      method: form.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const result = await response.json();

    if (!result.ok) {
      setMessage(result.error || "Error guardando predio");
      return;
    }

    setMessage(form.id ? "Predio actualizado." : "Predio creado.");
    resetForm();
    loadFarms();
  }

  function editFarm(farm: Farm) {
    setForm({
      id: farm.id,
      name: farm.name || "",
      city: farm.city || "",
      areaHa: farm.areaHa !== null && farm.areaHa !== undefined ? String(farm.areaHa) : "",
      status: farm.status || "Activo",
      companyId: farm.companyId || "",
    });

    setShowForm(true);
  }

  async function deleteFarm(farm: Farm) {
    const confirmed = confirm("¿Eliminar predio? Si tiene cultivos relacionados puede fallar.");

    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/farms?id=${farm.id}`, { method: "DELETE" });
    const result = await response.json();

    if (!result.ok) {
      setMessage(result.error || "No fue posible eliminar el predio.");
      return;
    }

    setMessage("Predio eliminado.");
    loadFarms();
  }

  const filteredFarms = farms.filter((farm) =>
    Object.values(farm).join(" ").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="bg-white rounded-2xl shadow p-8">
      <div className="flex justify-between items-start gap-6 mb-8">
        <div>
          <h2 className="text-4xl font-bold text-slate-800">Predios</h2>
          <p className="text-slate-500 mt-2 max-w-2xl leading-relaxed">
            Predios conectados a base de datos real con empresa, área, ciudad, estado y cultivos asociados.
          </p>
        </div>

        <button
          onClick={() => {
            setShowForm(true);
            setForm(emptyForm);
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl shadow text-lg font-bold"
        >
          + Nuevo Predio
        </button>
      </div>

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-8 font-semibold">
          {message}
        </div>
      )}

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">Predios</div>
          <div className="text-3xl font-bold text-slate-800">{farms.length}</div>
        </div>
        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">Activos</div>
          <div className="text-3xl font-bold text-green-600">{farms.filter((farm) => farm.status === "Activo").length}</div>
        </div>
        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">Área total ha</div>
          <div className="text-3xl font-bold text-slate-800">{farms.reduce((sum, farm) => sum + Number(farm.areaHa || 0), 0)}</div>
        </div>
        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">Cultivos</div>
          <div className="text-3xl font-bold text-slate-800">{farms.reduce((sum, farm) => sum + Number(farm._count?.crops || 0), 0)}</div>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar predio..." className="flex-1 border rounded-xl px-4 py-3 text-slate-700" />
        <button onClick={loadFarms} className="px-5 py-3 rounded-xl border bg-white text-slate-700 font-semibold">Actualizar</button>
      </div>

      {showForm && (
        <div className="border rounded-2xl p-6 mb-8 bg-slate-50">
          <h3 className="text-2xl font-bold text-slate-800 mb-5">{form.id ? "Editar predio" : "Nuevo predio"}</h3>

          <div className="grid grid-cols-2 gap-4">
            <input className="border rounded-xl px-4 py-3" placeholder="Nombre predio" value={form.name} onChange={(e) => updateField("name", e.target.value)} />
            <input className="border rounded-xl px-4 py-3" placeholder="Ciudad" value={form.city} onChange={(e) => updateField("city", e.target.value)} />
            <input className="border rounded-xl px-4 py-3" placeholder="Área ha" type="number" value={form.areaHa} onChange={(e) => updateField("areaHa", e.target.value)} />

            <select className="border rounded-xl px-4 py-3" value={form.status} onChange={(e) => updateField("status", e.target.value)}>
              <option value="Activo">Activo</option>
              <option value="En adecuación">En adecuación</option>
              <option value="Inactivo">Inactivo</option>
            </select>

            <select className="border rounded-xl px-4 py-3 col-span-2" value={form.companyId} onChange={(e) => updateField("companyId", e.target.value)}>
              <option value="">Sin empresa</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>{company.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button onClick={resetForm} className="px-5 py-3 rounded-xl border text-slate-600 bg-white">Cancelar</button>
            <button onClick={saveFarm} className="px-5 py-3 rounded-xl bg-green-600 text-white font-semibold">Guardar predio</button>
          </div>
        </div>
      )}

      <div className="border rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-3 text-sm text-slate-600">Predio</th>
              <th className="px-4 py-3 text-sm text-slate-600">Ciudad</th>
              <th className="px-4 py-3 text-sm text-slate-600">Área ha</th>
              <th className="px-4 py-3 text-sm text-slate-600">Empresa</th>
              <th className="px-4 py-3 text-sm text-slate-600">Cultivos</th>
              <th className="px-4 py-3 text-sm text-slate-600">Estado</th>
              <th className="px-4 py-3 text-sm text-slate-600">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredFarms.map((farm) => (
              <tr key={farm.id} className="border-t">
                <td className="px-4 py-3 font-semibold">{farm.name}</td>
                <td className="px-4 py-3">{farm.city || "-"}</td>
                <td className="px-4 py-3">{farm.areaHa || 0}</td>
                <td className="px-4 py-3">{farm.company?.name || "-"}</td>
                <td className="px-4 py-3">{farm._count?.crops || 0}</td>
                <td className="px-4 py-3">{farm.status}</td>
                <td className="px-4 py-3">
                  <button onClick={() => editFarm(farm)} className="text-blue-600 font-semibold mr-4">Editar</button>
                  <button onClick={() => deleteFarm(farm)} className="text-red-600 font-semibold">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
