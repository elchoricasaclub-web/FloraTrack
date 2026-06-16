"use client";

import { useEffect, useState } from "react";

type Company = {
  id: string;
  name: string;
  nit: string | null;
  city: string | null;
  status: string;
};

export default function EmpresaModule() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [message, setMessage] = useState("Cargando empresa activa...");

  async function loadCompanies() {
    try {
      const response = await fetch("/api/companies", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!result.ok) {
        setMessage(result.error || "Error cargando empresa.");
        return;
      }

      setCompanies(result.data);
      setMessage("Empresa activa cargada desde Prisma.");
    } catch {
      setMessage("Error conectando API de empresa.");
    }
  }

  useEffect(() => {
    loadCompanies();
  }, []);

  const activeCompany = companies[0];

  return (
    <section className="bg-white rounded-2xl shadow p-8">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-slate-800">Empresa</h2>
        <p className="text-slate-500 mt-2 max-w-3xl leading-relaxed">
          Vista ejecutiva de empresa activa conectada a Prisma. La gestión CRUD completa está en el módulo Empresas.
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-8 font-semibold">
        {message}
      </div>

      {activeCompany ? (
        <div className="border rounded-2xl p-8">
          <h3 className="text-3xl font-bold text-slate-800">
            {activeCompany.name}
          </h3>

          <div className="grid grid-cols-4 gap-4 mt-8">
            <div className="border rounded-xl p-4">
              <div className="text-sm text-slate-500">NIT</div>
              <div className="text-xl font-bold text-slate-800">
                {activeCompany.nit || "Pendiente"}
              </div>
            </div>

            <div className="border rounded-xl p-4">
              <div className="text-sm text-slate-500">Ciudad</div>
              <div className="text-xl font-bold text-slate-800">
                {activeCompany.city || "Pendiente"}
              </div>
            </div>

            <div className="border rounded-xl p-4">
              <div className="text-sm text-slate-500">Estado</div>
              <div className="text-xl font-bold text-green-600">
                {activeCompany.status}
              </div>
            </div>

            <div className="border rounded-xl p-4">
              <div className="text-sm text-slate-500">Empresas registradas</div>
              <div className="text-xl font-bold text-slate-800">
                {companies.length}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="border rounded-2xl p-12 text-center">
          <div className="text-6xl mb-4">🏢</div>
          <h3 className="text-2xl font-bold text-slate-700">
            No existe empresa activa
          </h3>
        </div>
      )}
    </section>
  );
}
