"use client";

import { useEffect, useState } from "react";

type CalendarEvent = {
  id: string;
  module: string;
  title: string;
  date: string;
  status: string;
  type: string;
};

export default function CalendarioModule() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [message, setMessage] = useState("Cargando calendario...");
  const [filter, setFilter] = useState("Todos");

  async function loadCalendar() {
    try {
      const response = await fetch("/api/enterprise/calendar", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!result.ok) {
        setMessage(result.error || "Error cargando calendario.");
        return;
      }

      setEvents(result.data);
      setMessage("Calendario cargado desde Prisma.");
    } catch {
      setMessage("Error conectando API de calendario.");
    }
  }

  useEffect(() => {
    loadCalendar();
  }, []);

  const filtered =
    filter === "Todos"
      ? events
      : events.filter((event) => event.type === filter);

  const overdue = events.filter(
    (event) =>
      new Date(event.date).getTime() < new Date().getTime() &&
      !["Cumplido", "Aprobado"].includes(event.status)
  ).length;

  const next30 = events.filter((event) => {
    const now = new Date().getTime();
    const future = new Date();
    future.setDate(new Date().getDate() + 30);

    const eventTime = new Date(event.date).getTime();

    return eventTime >= now && eventTime <= future.getTime();
  }).length;

  return (
    <section className="bg-white rounded-2xl shadow p-8">
      <div className="flex justify-between items-start gap-6 mb-8">
        <div>
          <h2 className="text-4xl font-bold text-slate-800">Calendario</h2>
          <p className="text-slate-500 mt-2 max-w-3xl leading-relaxed">
            Calendario enterprise generado desde base de datos: licencias,
            vencimientos, calibraciones, mantenimientos, capacitaciones y SOP.
          </p>
        </div>

        <button
          onClick={loadCalendar}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl shadow text-lg font-bold"
        >
          Actualizar
        </button>
      </div>

      <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-8 font-semibold">
        {message}
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">Eventos</div>
          <div className="text-3xl font-bold text-slate-800">{events.length}</div>
        </div>

        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">Vencidos</div>
          <div className="text-3xl font-bold text-red-600">{overdue}</div>
        </div>

        <div className="border rounded-xl p-4">
          <div className="text-sm text-slate-500">Próximos 30 días</div>
          <div className="text-3xl font-bold text-yellow-600">{next30}</div>
        </div>

        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="border rounded-xl px-4 py-3 bg-white text-slate-700 font-bold"
        >
          <option value="Todos">Todos</option>
          <option value="Regulatorio">Regulatorio</option>
          <option value="Facility">Facility</option>
          <option value="Capacitación">Capacitación</option>
          <option value="Documental">Documental</option>
        </select>
      </div>

      <div className="border rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-3 text-sm text-slate-600">Fecha</th>
              <th className="px-4 py-3 text-sm text-slate-600">Tipo</th>
              <th className="px-4 py-3 text-sm text-slate-600">Módulo</th>
              <th className="px-4 py-3 text-sm text-slate-600">Evento</th>
              <th className="px-4 py-3 text-sm text-slate-600">Estado</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((event) => {
              const isOverdue =
                new Date(event.date).getTime() < new Date().getTime() &&
                !["Cumplido", "Aprobado"].includes(event.status);

              return (
                <tr key={`${event.module}-${event.id}`} className="border-t">
                  <td className={`px-4 py-3 font-bold ${isOverdue ? "text-red-600" : "text-slate-700"}`}>
                    {new Date(event.date).toLocaleDateString("es-CO")}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{event.type}</td>
                  <td className="px-4 py-3 text-slate-700">{event.module}</td>
                  <td className="px-4 py-3 font-semibold text-slate-800">
                    {event.title}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{event.status}</td>
                </tr>
              );
            })}

            {filtered.length === 0 && (
              <tr>
                <td className="px-4 py-8 text-center text-slate-500" colSpan={5}>
                  No existen eventos para este filtro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
