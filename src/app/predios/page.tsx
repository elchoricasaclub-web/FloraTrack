"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type PredioRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  codigo: string;
  nombre: string;
  departamento: string;
  municipio: string;
  direccion: string;
  area: string;
  uso: string;
  estado: string;
  responsable: string;
  evidencia: string;
  nota: string;
};

const emptyForm = {
  id: "",
  codigo: "",
  nombre: "",
  departamento: "",
  municipio: "",
  direccion: "",
  area: "",
  uso: "",
  estado: "",
  responsable: "",
  evidencia: "",
  nota: ""
};

function clean(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function invalid(value: string) {
  const cleaned = clean(value);
  const normalized = cleaned.toLowerCase();
  const blocked = ["", "seleccione", "seleccione uso", "seleccione estado", "responsable", "responsable gacp", "n/a", "na", "sin definir"];

  return blocked.includes(normalized) || cleaned.length < 3;
}

export default function PrediosPage() {
  const [records, setRecords] = useState<PredioRecord[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [query, setQuery] = useState("");
  const [missing, setMissing] = useState<string[]>([]);
  const [success, setSuccess] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  async function loadRecords() {
    const response = await fetch("/api/predios", { cache: "no-store" });
    const data = await response.json();

    if (data.ok) {
      setRecords(data.records || []);
    }
  }

  useEffect(() => {
    loadRecords();
  }, []);

  const filtered = useMemo(() => {
    const search = query.toLowerCase();

    return records.filter((record) =>
      `${record.codigo} ${record.nombre} ${record.departamento} ${record.municipio} ${record.direccion} ${record.area} ${record.uso} ${record.estado} ${record.responsable} ${record.evidencia} ${record.nota}`
        .toLowerCase()
        .includes(search)
    );
  }, [query, records]);

  function validate() {
    const errors: string[] = [];

    if (invalid(form.codigo)) errors.push("Código del predio");
    if (invalid(form.nombre)) errors.push("Nombre del predio");
    if (invalid(form.departamento)) errors.push("Departamento");
    if (invalid(form.municipio)) errors.push("Municipio");
    if (invalid(form.direccion)) errors.push("Dirección o ubicación");
    if (invalid(form.area)) errors.push("Área");
    if (invalid(form.uso)) errors.push("Uso del predio");
    if (invalid(form.estado)) errors.push("Estado");
    if (invalid(form.responsable)) errors.push("Responsable");
    if (invalid(form.evidencia)) errors.push("Evidencia");
    if (invalid(form.nota)) errors.push("Nota técnica");

    return errors;
  }

  function showErrors(errors: string[]) {
    setSuccess("");
    setMissing(errors);

    setTimeout(() => {
      document.getElementById("predios-validation")?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }, 100);

    window.alert("Falta información requerida. Complete todos los campos obligatorios antes de guardar.");
  }

  async function saveRecord(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const errors = validate();

    if (errors.length > 0) {
      showErrors(errors);
      return;
    }

    setSaving(true);
    setMissing([]);
    setSuccess("");

    const response = await fetch("/api/predios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: editing ? "update" : "create",
        id: form.id,
        codigo: clean(form.codigo),
        nombre: clean(form.nombre),
        departamento: clean(form.departamento),
        municipio: clean(form.municipio),
        direccion: clean(form.direccion),
        area: clean(form.area),
        uso: clean(form.uso),
        estado: clean(form.estado),
        responsable: clean(form.responsable),
        evidencia: clean(form.evidencia),
        nota: clean(form.nota)
      })
    });

    const data = await response.json();
    setSaving(false);

    if (!response.ok || !data.ok) {
      showErrors(data.fields || ["Información obligatoria"]);
      return;
    }

    setForm(emptyForm);
    setEditing(false);
    setMissing([]);
    setSuccess(editing ? "Predio actualizado correctamente." : "Predio guardado correctamente.");
    await loadRecords();

    window.alert(editing ? "Predio actualizado correctamente." : "Predio guardado correctamente.");
  }

  function loadExample() {
    setForm({
      id: "",
      codigo: "PRE-SUTAMARCHAN-001",
      nombre: "Predio principal Sutamarchán",
      departamento: "Boyacá",
      municipio: "Sutamarchán",
      direccion: "Zona rural Sutamarchán / área productiva principal",
      area: "5.09 hectáreas",
      uso: "Cultivo agrícola GACP",
      estado: "Activo",
      responsable: "Edgar Rubén Gutierrez Rozo",
      evidencia: "Plano, fotos, coordenadas, documento predial y soporte técnico",
      nota: "Predio registrado para trazabilidad agrícola, cultivos, propagación, cosecha, GIS y cumplimiento GACP."
    });

    setMissing([]);
    setSuccess("");
    setEditing(false);
  }

  function editRecord(record: PredioRecord) {
    setForm({
      id: record.id,
      codigo: record.codigo,
      nombre: record.nombre,
      departamento: record.departamento,
      municipio: record.municipio,
      direccion: record.direccion,
      area: record.area,
      uso: record.uso,
      estado: record.estado,
      responsable: record.responsable,
      evidencia: record.evidencia,
      nota: record.nota
    });

    setEditing(true);
    setMissing([]);
    setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteRecord(id: string) {
    const confirmed = window.confirm("¿Eliminar este predio?");

    if (!confirmed) return;

    await fetch("/api/predios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "delete",
        id
      })
    });

    setSuccess("Predio eliminado correctamente.");
    await loadRecords();
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8 text-slate-950">
      <section className="rounded-[2rem] bg-slate-950 p-10 text-white shadow-2xl">
        <div className="text-xs font-black uppercase tracking-widest text-green-400">
          FloraTrack · GACP · Predios
        </div>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-8">
          <div>
            <h1 className="text-7xl font-black">Predios</h1>
            <p className="mt-4 max-w-4xl text-slate-200">
              Registro maestro de predios, fincas, sedes, áreas productivas, ubicación,
              uso, responsable, evidencia y soporte técnico para cumplimiento GACP.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a href="/" className="rounded-2xl border border-white/20 px-5 py-3 font-black text-white">Dashboard</a>
            <a href="/cultivos" className="rounded-2xl border border-white/20 px-5 py-3 font-black text-white">Cultivos</a>
            <a href="/propagacion" className="rounded-2xl border border-white/20 px-5 py-3 font-black text-white">Propagación</a>
            <a href="/cosecha" className="rounded-2xl border border-white/20 px-5 py-3 font-black text-white">Cosecha</a>
            <a href="/audit-trail" className="rounded-2xl bg-green-600 px-5 py-3 font-black text-white">Audit Trail</a>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-3xl bg-white/10 p-6">
            <div className="text-sm font-black">Registros</div>
            <div className="mt-2 text-4xl font-black">{records.length}</div>
          </div>

          <div className="rounded-3xl bg-white/10 p-6">
            <div className="text-sm font-black">Validación</div>
            <div className="mt-2 text-4xl font-black text-green-300">ON</div>
          </div>

          <div className="rounded-3xl bg-white/10 p-6">
            <div className="text-sm font-black">API</div>
            <div className="mt-2 text-4xl font-black text-green-300">OK</div>
          </div>

          <div className="rounded-3xl bg-white/10 p-6">
            <div className="text-sm font-black">Persistencia</div>
            <div className="mt-2 text-4xl font-black text-green-300">JSON</div>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-[2rem] border bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-green-600">
              {editing ? "Editar predio" : "Nuevo predio"}
            </div>
            <h2 className="mt-2 text-4xl font-black">
              {editing ? "Actualizar predio validado" : "Crear predio validado"}
            </h2>
          </div>

          <button type="button" onClick={loadExample} className="rounded-2xl border px-5 py-3 font-black">
            Cargar ejemplo
          </button>
        </div>

        {success && (
          <div className="mt-6 rounded-3xl border border-green-200 bg-green-50 p-6">
            <div className="text-xs font-black uppercase tracking-widest text-green-700">Operación correcta</div>
            <h3 className="mt-2 text-2xl font-black text-green-800">{success}</h3>
          </div>
        )}

        <form onSubmit={saveRecord} className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="text-sm font-black text-slate-500">Código del predio</label>
            <input value={form.codigo} onChange={(event) => setForm({ ...form, codigo: event.target.value })} placeholder="Ejemplo: PRE-SUTAMARCHAN-001" className="mt-2 w-full rounded-2xl border px-5 py-4 font-semibold" />
          </div>

          <div>
            <label className="text-sm font-black text-slate-500">Nombre del predio</label>
            <input value={form.nombre} onChange={(event) => setForm({ ...form, nombre: event.target.value })} placeholder="Ejemplo: Predio principal Sutamarchán" className="mt-2 w-full rounded-2xl border px-5 py-4 font-semibold" />
          </div>

          <div>
            <label className="text-sm font-black text-slate-500">Departamento</label>
            <input value={form.departamento} onChange={(event) => setForm({ ...form, departamento: event.target.value })} placeholder="Ejemplo: Boyacá" className="mt-2 w-full rounded-2xl border px-5 py-4 font-semibold" />
          </div>

          <div>
            <label className="text-sm font-black text-slate-500">Municipio</label>
            <input value={form.municipio} onChange={(event) => setForm({ ...form, municipio: event.target.value })} placeholder="Ejemplo: Sutamarchán" className="mt-2 w-full rounded-2xl border px-5 py-4 font-semibold" />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-black text-slate-500">Dirección o ubicación</label>
            <input value={form.direccion} onChange={(event) => setForm({ ...form, direccion: event.target.value })} placeholder="Ejemplo: vereda, coordenadas, zona rural o dirección operativa" className="mt-2 w-full rounded-2xl border px-5 py-4 font-semibold" />
          </div>

          <div>
            <label className="text-sm font-black text-slate-500">Área</label>
            <input value={form.area} onChange={(event) => setForm({ ...form, area: event.target.value })} placeholder="Ejemplo: 5.09 hectáreas" className="mt-2 w-full rounded-2xl border px-5 py-4 font-semibold" />
          </div>

          <div>
            <label className="text-sm font-black text-slate-500">Uso del predio</label>
            <select value={form.uso} onChange={(event) => setForm({ ...form, uso: event.target.value })} className="mt-2 w-full rounded-2xl border px-5 py-4 font-semibold">
              <option value="">Seleccione uso</option>
              <option>Cultivo agrícola GACP</option>
              <option>Propagación</option>
              <option>Cosecha</option>
              <option>Investigación</option>
              <option>Almacenamiento</option>
              <option>Administrativo</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-black text-slate-500">Estado</label>
            <select value={form.estado} onChange={(event) => setForm({ ...form, estado: event.target.value })} className="mt-2 w-full rounded-2xl border px-5 py-4 font-semibold">
              <option value="">Seleccione estado</option>
              <option>Activo</option>
              <option>En evaluación</option>
              <option>En adecuación</option>
              <option>En auditoría</option>
              <option>Inactivo</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-black text-slate-500">Responsable</label>
            <input value={form.responsable} onChange={(event) => setForm({ ...form, responsable: event.target.value })} placeholder="Nombre del responsable real" className="mt-2 w-full rounded-2xl border px-5 py-4 font-semibold" />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-black text-slate-500">Evidencia</label>
            <input value={form.evidencia} onChange={(event) => setForm({ ...form, evidencia: event.target.value })} placeholder="Ejemplo: plano, foto, coordenadas, acta, documento predial" className="mt-2 w-full rounded-2xl border px-5 py-4 font-semibold" />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-black text-slate-500">Nota técnica</label>
            <textarea value={form.nota} onChange={(event) => setForm({ ...form, nota: event.target.value })} placeholder="Describa condiciones, uso, riesgos, áreas, soporte técnico y cumplimiento GACP." className="mt-2 min-h-[150px] w-full rounded-2xl border px-5 py-4 font-semibold" />
          </div>

          {missing.length > 0 && (
            <div id="predios-validation" className="md:col-span-2 rounded-3xl border border-red-200 bg-red-50 p-6">
              <div className="text-xs font-black uppercase tracking-widest text-red-600">Validación obligatoria</div>
              <h3 className="mt-2 text-3xl font-black text-red-700">Falta información requerida</h3>
              <p className="mt-2 font-semibold text-red-700">No se puede guardar un predio con campos vacíos o genéricos.</p>
              <ul className="mt-4 font-bold text-red-700">
                {missing.map((item) => <li key={item}>• {item}</li>)}
              </ul>
            </div>
          )}

          <div className="md:col-span-2">
            <button disabled={saving} className="rounded-2xl bg-green-600 px-8 py-5 font-black text-white disabled:opacity-60">
              {saving ? "Guardando..." : editing ? "Guardar cambios" : "Guardar predio"}
            </button>
          </div>
        </form>
      </section>

      <section className="mt-8 rounded-[2rem] border bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-green-600">Base local validada</div>
            <h2 className="mt-2 text-4xl font-black">Predios registrados</h2>
          </div>

          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar predio..." className="w-full max-w-md rounded-2xl border px-5 py-4 font-semibold" />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
          {filtered.map((record) => (
            <article key={record.id} className="rounded-3xl border bg-slate-50 p-6">
              <div className="text-xs font-black uppercase tracking-widest text-green-600">{record.id}</div>
              <h3 className="mt-2 text-3xl font-black">{record.nombre}</h3>
              <p className="mt-3 text-slate-500">{record.nota}</p>

              <div className="mt-6 grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                <div><div className="font-black text-slate-400">Código</div><div className="font-bold">{record.codigo}</div></div>
                <div><div className="font-black text-slate-400">Estado</div><div className="font-bold">{record.estado}</div></div>
                <div><div className="font-black text-slate-400">Departamento</div><div className="font-bold">{record.departamento}</div></div>
                <div><div className="font-black text-slate-400">Municipio</div><div className="font-bold">{record.municipio}</div></div>
                <div><div className="font-black text-slate-400">Área</div><div className="font-bold">{record.area}</div></div>
                <div><div className="font-black text-slate-400">Uso</div><div className="font-bold">{record.uso}</div></div>
                <div className="md:col-span-2"><div className="font-black text-slate-400">Dirección</div><div className="font-bold">{record.direccion}</div></div>
                <div className="md:col-span-2"><div className="font-black text-slate-400">Responsable</div><div className="font-bold">{record.responsable}</div></div>
                <div className="md:col-span-2"><div className="font-black text-slate-400">Evidencia</div><div className="font-bold">{record.evidencia}</div></div>
              </div>

              <div className="mt-6 flex gap-3">
                <button type="button" onClick={() => editRecord(record)} className="rounded-2xl bg-green-600 px-5 py-3 font-black text-white">Editar</button>
                <button type="button" onClick={() => deleteRecord(record.id)} className="rounded-2xl border border-red-200 px-5 py-3 font-black text-red-700">Eliminar</button>
              </div>
            </article>
          ))}

          {filtered.length === 0 && (
            <div className="rounded-3xl border bg-slate-50 p-10 text-center xl:col-span-2">
              <h3 className="text-3xl font-black">No hay predios registrados</h3>
              <p className="mt-3 text-slate-500">Cree el primer predio completando todos los campos obligatorios.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
