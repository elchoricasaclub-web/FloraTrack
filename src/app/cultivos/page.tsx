"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Cultivo = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  predio: string;
  genetica: string;
  area: string;
  responsable: string;
  estado: string;
  evidencia: string;
  nota: string;
};

const emptyForm = {
  id: "",
  name: "",
  predio: "",
  genetica: "",
  area: "",
  responsable: "",
  estado: "",
  evidencia: "",
  nota: ""
};

const blockedValues = [
  "",
  "seleccione",
  "sin definir",
  "n/a",
  "na",
  "responsable",
  "responsable gacp",
  "nuevo cultivo",
  "cultivo"
];

function clean(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function invalid(value: string) {
  const normalized = clean(value).toLowerCase();
  return blockedValues.includes(normalized) || clean(value).length < 3;
}

export default function CultivosPage() {
  const [records, setRecords] = useState<Cultivo[]>([]);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(false);
  const [missing, setMissing] = useState<string[]>([]);
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadCultivos() {
    try {
      const response = await fetch("/api/cultivos", { cache: "no-store" });
      const data = await response.json();

      if (data.ok) {
        setRecords(data.records || []);
      }
    } catch {
      setMissing(["No se pudo leer la base local de cultivos"]);
    }
  }

  useEffect(() => {
    loadCultivos();
  }, []);

  const filtered = useMemo(() => {
    const value = query.toLowerCase();

    return records.filter((item) =>
      `${item.name} ${item.predio} ${item.genetica} ${item.area} ${item.responsable} ${item.estado} ${item.evidencia} ${item.nota}`
        .toLowerCase()
        .includes(value)
    );
  }, [query, records]);

  function validateForm() {
    const errors: string[] = [];

    if (invalid(form.name)) errors.push("Nombre del cultivo");
    if (invalid(form.predio)) errors.push("Predio");
    if (invalid(form.genetica)) errors.push("Genética");
    if (invalid(form.area)) errors.push("Área o zona");
    if (invalid(form.responsable)) errors.push("Responsable");
    if (invalid(form.estado)) errors.push("Estado");
    if (invalid(form.evidencia)) errors.push("Evidencia");
    if (invalid(form.nota)) errors.push("Nota técnica");

    return errors;
  }

  function showValidation(errors: string[]) {
    setSuccess("");
    setMissing(errors);

    setTimeout(() => {
      const alertBox = document.getElementById("cultivos-validation-alert");
      alertBox?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);

    window.alert("Falta información requerida. Complete todos los campos obligatorios antes de guardar.");
  }

  async function saveCultivo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const errors = validateForm();

    if (errors.length > 0) {
      showValidation(errors);
      return;
    }

    setSaving(true);
    setMissing([]);
    setSuccess("");

    try {
      const response = await fetch("/api/cultivos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          action: editing ? "update" : "create",
          id: form.id,
          name: clean(form.name),
          predio: clean(form.predio),
          genetica: clean(form.genetica),
          area: clean(form.area),
          responsable: clean(form.responsable),
          estado: clean(form.estado),
          evidencia: clean(form.evidencia),
          nota: clean(form.nota)
        })
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        showValidation(data.fields || ["Información obligatoria"]);
        setSaving(false);
        return;
      }

      setForm(emptyForm);
      setEditing(false);
      setMissing([]);
      setSuccess(editing ? "Cultivo actualizado correctamente." : "Cultivo guardado correctamente.");
      await loadCultivos();

      window.alert(editing ? "Cultivo actualizado correctamente." : "Cultivo guardado correctamente.");
    } catch {
      setMissing(["Error de conexión con /api/cultivos"]);
      window.alert("Error: no se pudo guardar. Revise la terminal donde corre la app.");
    } finally {
      setSaving(false);
    }
  }

  function loadExample() {
    setMissing([]);
    setSuccess("");
    setEditing(false);
    setForm({
      id: "",
      name: "Cultivo medicinal lote A",
      predio: "Predio principal Growlifecol",
      genetica: "TIKUNA registro interno",
      area: "Invernadero 1 zona norte",
      responsable: "Edgar Rubén Gutierrez Rozo",
      estado: "Activo",
      evidencia: "Registro de siembra lote A con trazabilidad GACP",
      nota: "Cultivo creado como prueba validada con predio, genética, responsable, evidencia y soporte técnico."
    });

    setTimeout(() => {
      document.getElementById("cultivos-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  function editCultivo(item: Cultivo) {
    setForm({
      id: item.id,
      name: item.name,
      predio: item.predio,
      genetica: item.genetica,
      area: item.area,
      responsable: item.responsable,
      estado: item.estado,
      evidencia: item.evidencia,
      nota: item.nota
    });

    setEditing(true);
    setMissing([]);
    setSuccess("");

    setTimeout(() => {
      document.getElementById("cultivos-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  async function deleteCultivo(id: string) {
    const confirmed = window.confirm("¿Eliminar este cultivo?");

    if (!confirmed) return;

    await fetch("/api/cultivos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "delete",
        id
      })
    });

    setSuccess("Cultivo eliminado correctamente.");
    await loadCultivos();
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8 text-slate-950">
      <section className="rounded-[2rem] bg-slate-950 p-10 text-white shadow-2xl">
        <div className="text-xs font-black uppercase tracking-widest text-green-400">
          FloraTrack · GACP
        </div>

        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <h1 className="mt-4 text-7xl font-black">Cultivos</h1>

            <p className="mt-4 max-w-4xl text-slate-200">
              Gestión real de cultivos con predio, genética, área, responsable, estado,
              evidencia y nota técnica. No permite guardar campos vacíos.
            </p>
          </div>

          <div className="flex gap-3">
            <a href="/" className="rounded-2xl border border-white/20 px-6 py-4 font-black text-white">
              Dashboard
            </a>

            <a href="/audit-trail" className="rounded-2xl bg-green-600 px-6 py-4 font-black text-white">
              Audit Trail
            </a>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-4 gap-4">
          <div className="rounded-3xl bg-white/10 p-6">
            <div className="text-sm font-black">Cultivos</div>
            <div className="mt-2 text-4xl font-black">{records.length}</div>
          </div>

          <div className="rounded-3xl bg-white/10 p-6">
            <div className="text-sm font-black">Activos</div>
            <div className="mt-2 text-4xl font-black">
              {records.filter((item) => item.estado.toLowerCase().includes("activo")).length}
            </div>
          </div>

          <div className="rounded-3xl bg-white/10 p-6">
            <div className="text-sm font-black">Validación</div>
            <div className="mt-2 text-4xl font-black text-green-300">ON</div>
          </div>

          <div className="rounded-3xl bg-white/10 p-6">
            <div className="text-sm font-black">Estado</div>
            <div className="mt-2 text-4xl font-black text-green-300">OK</div>
          </div>
        </div>
      </section>

      <section id="cultivos-form" className="mt-8 rounded-3xl border bg-white p-8 shadow-sm">
        <div className="flex items-start justify-between gap-5">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-green-600">
              {editing ? "Editar cultivo" : "Nuevo cultivo"}
            </div>

            <h2 className="mt-2 text-4xl font-black">
              {editing ? "Actualizar cultivo" : "Crear cultivo validado"}
            </h2>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={loadExample}
              className="rounded-2xl border px-5 py-3 font-black"
            >
              Cargar ejemplo
            </button>

            {editing && (
              <button
                type="button"
                onClick={() => {
                  setForm(emptyForm);
                  setEditing(false);
                  setMissing([]);
                  setSuccess("");
                }}
                className="rounded-2xl border px-5 py-3 font-black"
              >
                Cancelar edición
              </button>
            )}
          </div>
        </div>

        {success && (
          <div className="mt-6 rounded-3xl border border-green-200 bg-green-50 p-6">
            <div className="text-xs font-black uppercase tracking-widest text-green-700">
              Operación correcta
            </div>

            <h3 className="mt-2 text-3xl font-black text-green-800">
              {success}
            </h3>
          </div>
        )}

        <form onSubmit={saveCultivo} className="mt-8 grid grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-black text-slate-500">Nombre del cultivo</label>
            <input
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              placeholder="Ejemplo: Cultivo madre lote A"
              className="mt-2 w-full rounded-2xl border px-5 py-4 font-semibold"
            />
          </div>

          <div>
            <label className="text-sm font-black text-slate-500">Predio</label>
            <input
              value={form.predio}
              onChange={(event) => setForm({ ...form, predio: event.target.value })}
              placeholder="Ejemplo: Predio principal Sutamarchán"
              className="mt-2 w-full rounded-2xl border px-5 py-4 font-semibold"
            />
          </div>

          <div>
            <label className="text-sm font-black text-slate-500">Genética</label>
            <input
              value={form.genetica}
              onChange={(event) => setForm({ ...form, genetica: event.target.value })}
              placeholder="Ejemplo: TIKUNA / Blueberry / genética interna"
              className="mt-2 w-full rounded-2xl border px-5 py-4 font-semibold"
            />
          </div>

          <div>
            <label className="text-sm font-black text-slate-500">Área o zona</label>
            <input
              value={form.area}
              onChange={(event) => setForm({ ...form, area: event.target.value })}
              placeholder="Ejemplo: Invernadero 1 / Terraza 2"
              className="mt-2 w-full rounded-2xl border px-5 py-4 font-semibold"
            />
          </div>

          <div>
            <label className="text-sm font-black text-slate-500">Responsable</label>
            <input
              value={form.responsable}
              onChange={(event) => setForm({ ...form, responsable: event.target.value })}
              placeholder="Nombre del responsable real"
              className="mt-2 w-full rounded-2xl border px-5 py-4 font-semibold"
            />
          </div>

          <div>
            <label className="text-sm font-black text-slate-500">Estado</label>
            <select
              value={form.estado}
              onChange={(event) => setForm({ ...form, estado: event.target.value })}
              className="mt-2 w-full rounded-2xl border px-5 py-4 font-semibold"
            >
              <option value="">Seleccione estado</option>
              <option>Activo</option>
              <option>En propagación</option>
              <option>En floración</option>
              <option>En monitoreo</option>
              <option>Bloqueado por calidad</option>
              <option>Cerrado</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="text-sm font-black text-slate-500">Evidencia</label>
            <input
              value={form.evidencia}
              onChange={(event) => setForm({ ...form, evidencia: event.target.value })}
              placeholder="Ejemplo: Foto, acta, código lote, registro de siembra"
              className="mt-2 w-full rounded-2xl border px-5 py-4 font-semibold"
            />
          </div>

          <div className="col-span-2">
            <label className="text-sm font-black text-slate-500">Nota técnica</label>
            <textarea
              value={form.nota}
              onChange={(event) => setForm({ ...form, nota: event.target.value })}
              placeholder="Describa el estado del cultivo, trazabilidad, observaciones GACP y soporte."
              className="mt-2 min-h-[150px] w-full rounded-2xl border px-5 py-4 font-semibold"
            />
          </div>

          {missing.length > 0 && (
            <div id="cultivos-validation-alert" className="col-span-2 rounded-3xl border border-red-200 bg-red-50 p-6">
              <div className="text-xs font-black uppercase tracking-widest text-red-600">
                Validación obligatoria
              </div>

              <h3 className="mt-2 text-3xl font-black text-red-700">
                Falta información requerida
              </h3>

              <p className="mt-2 text-sm font-semibold text-red-700">
                No se puede guardar un cultivo con campos vacíos o genéricos.
              </p>

              <ul className="mt-4 font-bold text-red-700">
                {missing.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="col-span-2">
            <button
              disabled={saving}
              className="rounded-2xl bg-green-600 px-8 py-5 font-black text-white disabled:opacity-60"
            >
              {saving ? "Guardando..." : editing ? "Guardar cambios del cultivo" : "Guardar cultivo"}
            </button>
          </div>
        </form>
      </section>

      <section className="mt-8 rounded-3xl border bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-green-600">
              Base local validada
            </div>

            <h2 className="mt-2 text-4xl font-black">
              Cultivos registrados
            </h2>
          </div>

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar cultivo..."
            className="w-full max-w-md rounded-2xl border px-5 py-4 font-semibold"
          />
        </div>

        <div className="mt-8 grid grid-cols-2 gap-6">
          {filtered.map((item) => (
            <article key={item.id} className="rounded-3xl border bg-slate-50 p-6">
              <div className="text-xs font-black uppercase tracking-widest text-green-600">
                {item.id}
              </div>

              <h3 className="mt-2 text-3xl font-black">
                {item.name}
              </h3>

              <p className="mt-3 text-slate-500">
                {item.nota}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-black text-slate-400">Predio</div>
                  <div className="font-bold">{item.predio}</div>
                </div>

                <div>
                  <div className="font-black text-slate-400">Genética</div>
                  <div className="font-bold">{item.genetica}</div>
                </div>

                <div>
                  <div className="font-black text-slate-400">Área</div>
                  <div className="font-bold">{item.area}</div>
                </div>

                <div>
                  <div className="font-black text-slate-400">Responsable</div>
                  <div className="font-bold">{item.responsable}</div>
                </div>

                <div>
                  <div className="font-black text-slate-400">Estado</div>
                  <div className="font-bold">{item.estado}</div>
                </div>

                <div>
                  <div className="font-black text-slate-400">Evidencia</div>
                  <div className="font-bold">{item.evidencia}</div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => editCultivo(item)}
                  className="rounded-2xl bg-green-600 px-5 py-3 font-black text-white"
                >
                  Editar
                </button>

                <button
                  type="button"
                  onClick={() => deleteCultivo(item.id)}
                  className="rounded-2xl border border-red-200 px-5 py-3 font-black text-red-700"
                >
                  Eliminar
                </button>
              </div>
            </article>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-2 rounded-3xl border bg-slate-50 p-10 text-center">
              <h3 className="text-3xl font-black">
                No hay cultivos registrados
              </h3>

              <p className="mt-3 text-slate-500">
                Cree el primer cultivo completando todos los campos obligatorios.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
