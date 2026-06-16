"use client";

import { useEffect, useState } from "react";

type Company = {
  id: string;
  name: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  companyId: string | null;
  company?: Company | null;
};

const emptyForm = {
  id: "",
  name: "",
  email: "",
  role: "Operador GACP",
  status: "Activo",
  companyId: "",
};

export default function UsersModule() {
  const [users, setUsers] = useState<User[]>([]);
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

  async function loadUsers() {
    try {
      const response = await fetch("/api/users", { cache: "no-store" });
      const result = await response.json();

      if (!result.ok) {
        setMessage(result.error || "Error cargando usuarios");
        return;
      }

      setUsers(result.data);
      setMessage("Usuarios cargados desde base de datos.");
    } catch {
      setMessage("Error conectando con API de usuarios.");
    }
  }

  useEffect(() => {
    loadCompanies();
    loadUsers();
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

  async function saveUser() {
    const method = form.id ? "PUT" : "POST";

    const response = await fetch("/api/users", {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const result = await response.json();

    if (!result.ok) {
      setMessage(result.error || "Error guardando usuario");
      return;
    }

    setMessage(form.id ? "Usuario actualizado." : "Usuario creado.");
    resetForm();
    loadUsers();
  }

  function editUser(user: User) {
    setForm({
      id: user.id,
      name: user.name || "",
      email: user.email || "",
      role: user.role || "Operador GACP",
      status: user.status || "Activo",
      companyId: user.companyId || "",
    });

    setShowForm(true);
  }

  async function deleteUser(user: User) {
    const confirmed = confirm("¿Eliminar usuario?");

    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/users?id=${user.id}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (!result.ok) {
      setMessage(result.error || "No fue posible eliminar el usuario.");
      return;
    }

    setMessage("Usuario eliminado.");
    loadUsers();
  }

  const filteredUsers = users.filter((user) =>
    Object.values(user).join(" ").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="bg-white rounded-2xl shadow p-8">
      <div className="flex justify-between items-start gap-6 mb-8">
        <div>
          <h2 className="text-4xl font-bold text-slate-800">Usuarios</h2>
          <p className="text-slate-500 mt-2 max-w-2xl leading-relaxed">
            Usuarios conectados a base de datos real con empresa, rol, estado y auditoría persistente.
          </p>
        </div>

        <button
          onClick={() => {
            setShowForm(true);
            setForm(emptyForm);
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl shadow text-lg font-bold"
        >
          + Nuevo Usuario
        </button>
      </div>

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-8 font-semibold">
          {message}
        </div>
      )}

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">Usuarios</div>
          <div className="text-3xl font-bold text-slate-800">{users.length}</div>
        </div>
        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">Activos</div>
          <div className="text-3xl font-bold text-green-600">
            {users.filter((user) => user.status === "Activo").length}
          </div>
        </div>
        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">Directores</div>
          <div className="text-3xl font-bold text-slate-800">
            {users.filter((user) => user.role === "Director Calidad").length}
          </div>
        </div>
        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">Operadores</div>
          <div className="text-3xl font-bold text-slate-800">
            {users.filter((user) => user.role === "Operador GACP").length}
          </div>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar usuario, correo, rol..."
          className="flex-1 border rounded-xl px-4 py-3 text-slate-700"
        />

        <button
          onClick={loadUsers}
          className="px-5 py-3 rounded-xl border bg-white text-slate-700 font-semibold"
        >
          Actualizar
        </button>
      </div>

      {showForm && (
        <div className="border rounded-2xl p-6 mb-8 bg-slate-50">
          <h3 className="text-2xl font-bold text-slate-800 mb-5">
            {form.id ? "Editar usuario" : "Nuevo usuario"}
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <input className="border rounded-xl px-4 py-3" placeholder="Nombre" value={form.name} onChange={(e) => updateField("name", e.target.value)} />
            <input className="border rounded-xl px-4 py-3" placeholder="Correo" value={form.email} onChange={(e) => updateField("email", e.target.value)} />

            <select className="border rounded-xl px-4 py-3" value={form.role} onChange={(e) => updateField("role", e.target.value)}>
              <option value="Super Admin">Super Admin</option>
              <option value="Director Calidad">Director Calidad</option>
              <option value="Operador GACP">Operador GACP</option>
            </select>

            <select className="border rounded-xl px-4 py-3" value={form.status} onChange={(e) => updateField("status", e.target.value)}>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
              <option value="Suspendido">Suspendido</option>
            </select>

            <select className="border rounded-xl px-4 py-3 col-span-2" value={form.companyId} onChange={(e) => updateField("companyId", e.target.value)}>
              <option value="">Sin empresa</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>{company.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button onClick={resetForm} className="px-5 py-3 rounded-xl border text-slate-600 bg-white">
              Cancelar
            </button>
            <button onClick={saveUser} className="px-5 py-3 rounded-xl bg-green-600 text-white font-semibold">
              Guardar usuario
            </button>
          </div>
        </div>
      )}

      <div className="border rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-3 text-sm text-slate-600">Nombre</th>
              <th className="px-4 py-3 text-sm text-slate-600">Correo</th>
              <th className="px-4 py-3 text-sm text-slate-600">Rol</th>
              <th className="px-4 py-3 text-sm text-slate-600">Empresa</th>
              <th className="px-4 py-3 text-sm text-slate-600">Estado</th>
              <th className="px-4 py-3 text-sm text-slate-600">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="px-4 py-3 font-semibold">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.role}</td>
                <td className="px-4 py-3">{user.company?.name || "-"}</td>
                <td className="px-4 py-3">{user.status}</td>
                <td className="px-4 py-3">
                  <button onClick={() => editUser(user)} className="text-blue-600 font-semibold mr-4">Editar</button>
                  <button onClick={() => deleteUser(user)} className="text-red-600 font-semibold">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
