"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type CosechaRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  harvestCode: string;
  cultivo: string;
  genetica: string;
  area: string;
  cantidad: string;
  estado: string;
  responsable: string;
  evidencia: string;
  nota: string;
};

const emptyForm = {
  id: "",
  harvestCode: "",
  cultivo: "",
  genetica: "",
  area: "",
  cantidad: "",
  estado: "",
  responsable: "",
  evidencia: "",
  nota: ""
};

function clean(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function invalid(value: string) {
  const valueClean = clean(value);
  const normalized = valueClean.toLowerCase();
  const blocked = ["", "seleccione", "responsable", "responsable gacp", "n/a", "na", "sin definir"];
  return blocked.includes(normalized) || valueClean.length < 3;
}

export default function CosechaPage() {
  const [records, setRecords] = useState<CosechaRecord[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [query, setQuery] = useState("");
  const [missing, setMissing] = useState<string[]>([]);
  const [success, setSuccess] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  async function loadRecords() {
    const response = await fetch("/api/cosecha", { cache: "no-store" });
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
      `${record.harvestCode} ${record.cultivo} ${record.genetica} ${record.area} ${record.cantidad} ${record.estado} ${record.responsable} ${record.evidencia} ${record.nota}`
        .toLowerCase()
        .includes(search)
    );
  }, [query, records]);

  function validate() {
    const errors: string[] = [];

    if (invalid(form.harvestCode)) errors.push("Código de cosecha");
    if (invalid(form.cultivo)) errors.push("Cultivo asociado");
    if (invalid(form.genetica)) errors.push("Genética");
    if (invalid(form.area)) errors.push("Área o zona");
    if (invalid(form.cantidad)) errors.push("Cantidad cosechada");
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
      document.getElementById("cosecha-validation")?.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }, 100);

    window.alert("Falta información requerida. Complete todos los campos antes de guardar.");
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

    const response = await fetch("/api/cosecha", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: editing ? "update" : "create",
        id: form.id,
        harvestCode: clean(form.harvestCode),
        cultivo: clean(form.cultivo),
        genetica: clean(form.genetica),
        area: clean(form.area),
        cantidad: clean(form.cantidad),
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
    setSuccess(editing ? "Cosecha actualizada correctamente." : "Cosecha guardada correctamente.");
    await loadRecords();

    window.alert(editing ? "Cosecha actualizada correctamente." : "Cosecha guardada correctamente.");
  }

  function loadExample() {
    setForm({
      id: "",
      harvestCode: "COS-TIKUNA-001",
      cultivo: "Cultivo medicinal lote A",
      genetica: "TIKUNA registro interno",
      area: "Invernadero 1 zona norte",
      cantidad: "18.5 kg flor fresca",
      estado: "Cosecha ejecutada",
      responsable: "Edgar Rubén Gutierrez Rozo",
      evidencia: "Acta de cosecha, fotos, pesaje inicial y código de lote COS-TIKUNA-001",
      nota: "Cosecha registrada con trazabilidad de cultivo, genética, área, responsable, cantidad, evidencia y soporte GACP."
    });

    setMissing([]);
    setSuccess("");
    setEditing(false);
  }

  function editRecord(record: CosechaRecord) {
    setForm({
      id: record.id,
      harvestCode: record.harvestCode,
      cultivo: record.cultivo,
      genetica: record.genetica,
      area: record.area,
      cantidad: record.cantidad,
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
    const confirmed = window.confirm("¿Eliminar este registro de cosecha?");

    if (!confirmed) return;

    await fetch("/api/cosecha", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "delete",
        id
      })
    });

    setSuccess("Registro de cosecha eliminado correctamente.");
    await loadRecords();
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8 text-slate-950">
      <section className="rounded-[2rem] bg-slate-950 p-10 text-white shadow-2xl">
        <div className="text-xs font-black uppercase tracking-widest text-green-400">
          FloraTrack · GACP · Cosecha
        </div>

        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <h1 className="mt-4 text-7xl font-black">Cosecha</h1>

            <p className="mt-4 max-w-4xl text-slate-200">
              Registro real de cosecha con cultivo asociado, genética, área, cantidad,
              responsable, evidencia y trazabilidad GACP.
            </p>
          </div>

          <div className="flex gap-3">
            <a href="/" className="rounded-2xl border border-white/20 px-6 py-4 font-black text-white">Dashboard</a>
            <a href="/cultivos" className="rounded-2xl border border-white/20 px-6 py-4 font-black text-white">Cultivos</a>
            <a href="/propagacion" className="rounded-2xl border border-white/20 px-6 py-4 font-black text-white">Propagación</a>
            <a href="/audit-trail" className="rounded-2xl bg-green-600 px-6 py-4 font-black text-white">Audit Trail</a>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border bg-white p-8 shadow-sm">
        <div className="flex items-start justify-between gap-5">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-green-600">
              {editing ? "Editar cosecha" : "Nueva cosecha"}
            </div>

            <h2 className="mt-2 text-4xl font-black">
              {editing ? "Actualizar cosecha" : "Crear cosecha validada"}
            </h2>
          </div>

          <button type="button" onClick={loadExample} className="rounded-2xl border px-5 py-3 font-black">
            Cargar ejemplo
          </button>
        </div>

        {success && (
          <div className="mt-6 rounded-3xl border border-green-200 bg-green-50 p-6">
            <div className="text-xs font-black uppercase tracking-widest text-green-700">Operación correcta</div>
            <h3 className="mt-2 text-3xl font-black text-green-800">{success}</h3>
          </div>
        )}

        <form onSubmit={saveRecord} className="mt-8 grid grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-black text-slate-500">Código de cosecha</label>
            <input value={form.harvestCode} onChange={(event) => setForm({ ...form, harvestCode: event.target.value })} placeholder="Ejemplo: COS-TIKUNA-001" className="mt-2 w-full rounded-2xl border px-5 py-4 font-semibold" />
          </div>

          <div>
            <label className="text-sm font-black text-slate-500">Cultivo asociado</label>
            <input value={form.cultivo} onChange={(event) => setForm({ ...form, cultivo: event.target.value })} placeholder="Ejemplo: Cultivo medicinal lote A" className="mt-2 w-full rounded-2xl border px-5 py-4 font-semibold" />
          </div>

          <div>
            <label className="text-sm font-black text-slate-500">Genética</label>
            <input value={form.genetica} onChange={(event) => setForm({ ...form, genetica: event.target.value })} placeholder="Ejemplo: TIKUNA" className="mt-2 w-full rounded-2xl border px-5 py-4 font-semibold" />
          </div>

          <div>
            <label className="text-sm font-black text-slate-500">Área o zona</label>
            <input value={form.area} onChange={(event) => setForm({ ...form, area: event.target.value })} placeholder="Ejemplo: Invernadero 1 zona norte" className="mt-2 w-full rounded-2xl border px-5 py-4 font-semibold" />
          </div>

          <div>
            <label className="text-sm font-black text-slate-500">Cantidad cosechada</label>
            <input value={form.cantidad} onChange={(event) => setForm({ ...form, cantidad: event.target.value })} placeholder="Ejemplo: 18.5 kg flor fresca" className="mt-2 w-full rounded-2xl border px-5 py-4 font-semibold" />
          </div>

          <div>
            <label className="text-sm font-black text-slate-500">Estado</label>
            <select value={form.estado} onChange={(event) => setForm({ ...form, estado: event.target.value })} className="mt-2 w-full rounded-2xl border px-5 py-4 font-semibold">
              <option value="">Seleccione estado</option>
              <option>Programada</option>
              <option>Cosecha ejecutada</option>
              <option>En pesaje</option>
              <option>En secado</option>
              <option>En cuarentena calidad</option>
              <option>Liberada</option>
              <option>Cerrada</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="text-sm font-black text-slate-500">Responsable</label>
            <input value={form.responsable} onChange={(event) => setForm({ ...form, responsable: event.target.value })} placeholder="Nombre del responsable real" className="mt-2 w-full rounded-2xl border px-5 py-4 font-semibold" />
          </div>

          <div className="col-span-2">
            <label className="text-sm font-black text-slate-500">Evidencia</label>
            <input value={form.evidencia} onChange={(event) => setForm({ ...form, evidencia: event.target.value })} placeholder="Ejemplo: acta, foto, pesaje, código lote" className="mt-2 w-full rounded-2xl border px-5 py-4 font-semibold" />
          </div>

          <div className="col-span-2">
            <label className="text-sm font-black text-slate-500">Nota técnica</label>
            <textarea value={form.nota} onChange={(event) => setForm({ ...form, nota: event.target.value })} placeholder="Describa trazabilidad, peso, cultivo, condiciones, responsable y soporte GACP." className="mt-2 min-h-[150px] w-full rounded-2xl border px-5 py-4 font-semibold" />
          </div>

          {missing.length > 0 && (
            <div id="cosecha-validation" className="col-span-2 rounded-3xl border border-red-200 bg-red-50 p-6">
              <div className="text-xs font-black uppercase tracking-widest text-red-600">Validación obligatoria</div>
              <h3 className="mt-2 text-3xl font-black text-red-700">Falta información requerida</h3>
              <ul className="mt-4 font-bold text-red-700">
                {missing.map((item) => <li key={item}>• {item}</li>)}
              </ul>
            </div>
          )}

          <div className="col-span-2">
            <button disabled={saving} className="rounded-2xl bg-green-600 px-8 py-5 font-black text-white disabled:opacity-60">
              {saving ? "Guardando..." : editing ? "Guardar cambios" : "Guardar cosecha"}
            </button>
          </div>
        </form>
      </section>

      <section className="mt-8 rounded-3xl border bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-green-600">Base local validada</div>
            <h2 className="mt-2 text-4xl font-black">Registros de cosecha</h2>
          </div>

          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar cosecha..." className="w-full max-w-md rounded-2xl border px-5 py-4 font-semibold" />
        </div>

        <div className="mt-8 grid grid-cols-2 gap-6">
          {filtered.map((record) => (
            <article key={record.id} className="rounded-3xl border bg-slate-50 p-6">
              <div className="text-xs font-black uppercase tracking-widest text-green-600">{record.id}</div>
              <h3 className="mt-2 text-3xl font-black">{record.harvestCode}</h3>
              <p className="mt-3 text-slate-500">{record.nota}</p>

              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div><div className="font-black text-slate-400">Cultivo</div><div className="font-bold">{record.cultivo}</div></div>
                <div><div className="font-black text-slate-400">Genética</div><div className="font-bold">{record.genetica}</div></div>
                <div><div className="font-black text-slate-400">Área</div><div className="font-bold">{record.area}</div></div>
                <div><div className="font-black text-slate-400">Cantidad</div><div className="font-bold">{record.cantidad}</div></div>
                <div><div className="font-black text-slate-400">Estado</div><div className="font-bold">{record.estado}</div></div>
                <div><div className="font-black text-slate-400">Responsable</div><div className="font-bold">{record.responsable}</div></div>
              </div>

              <div className="mt-6 flex gap-3">
                <button type="button" onClick={() => editRecord(record)} className="rounded-2xl bg-green-600 px-5 py-3 font-black text-white">Editar</button>
                <button type="button" onClick={() => deleteRecord(record.id)} className="rounded-2xl border border-red-200 px-5 py-3 font-black text-red-700">Eliminar</button>
              </div>
            </article>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-2 rounded-3xl border bg-slate-50 p-10 text-center">
              <h3 className="text-3xl font-black">No hay registros de cosecha</h3>
              <p className="mt-3 text-slate-500">Cree el primer registro completando todos los campos obligatorios.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
