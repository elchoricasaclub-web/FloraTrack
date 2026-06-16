"use client";

import { useEffect, useState } from "react";

type SummaryItem = {
  label: string;
  value: number;
};

export default function DataIntegrityDashboardModule() {
  const [summary, setSummary] = useState<SummaryItem[]>([]);
  const [message, setMessage] = useState("Cargando Data Integrity...");

  async function loadData() {
    try {
      const [alcoaRes, auditRes, accessRes, auditTrailRes] = await Promise.all([
        fetch("/api/dataintegrity/reviews", { cache: "no-store" }),
        fetch("/api/dataintegrity/audit-trail", { cache: "no-store" }),
        fetch("/api/dataintegrity/access", { cache: "no-store" }),
        fetch("/api/enterprise/audit-system", { cache: "no-store" }),
      ]);

      const [alcoa, audit, access, auditTrail] = await Promise.all([
        alcoaRes.json(),
        auditRes.json(),
        accessRes.json(),
        auditTrailRes.json(),
      ]);

      setSummary([
        { label: "Controles ALCOA+", value: alcoa.data?.length || 0 },
        { label: "Revisiones audit trail", value: audit.data?.length || 0 },
        { label: "Revisiones acceso", value: access.data?.length || 0 },
        { label: "Eventos audit trail", value: auditTrail.total || 0 },
      ]);

      setMessage("Data Integrity conectado correctamente.");
    } catch {
      setMessage("Error cargando Data Integrity.");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <section className="bg-white rounded-2xl shadow p-8">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-slate-800">Data Integrity</h2>
        <p className="text-slate-500 mt-2 max-w-3xl leading-relaxed">
          Centro ejecutivo de integridad de datos para ALCOA+, revisión de audit trail, revisión de accesos, trazabilidad, firmas electrónicas, Part 11 y Annex 11.
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-8 font-semibold">
        {message}
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {summary.map((item) => (
          <div key={item.label} className="border rounded-xl p-5">
            <div className="text-sm text-slate-500">{item.label}</div>
            <div className="text-4xl font-black text-slate-800 mt-2">
              {item.value}
            </div>
          </div>
        ))}
      </div>

      <div className="border rounded-2xl p-6 bg-slate-50">
        <h3 className="text-2xl font-bold text-slate-800 mb-4">
          Principios críticos ALCOA+
        </h3>

        <div className="grid grid-cols-3 gap-4">
          {[
            "Attributable",
            "Legible",
            "Contemporaneous",
            "Original",
            "Accurate",
            "Complete",
            "Consistent",
            "Enduring",
            "Available",
          ].map((item) => (
            <div key={item} className="bg-white border rounded-xl p-4">
              <div className="font-bold text-slate-800">{item}</div>
              <div className="text-sm text-slate-500 mt-1">
                Control requerido para registros electrónicos GxP.
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
