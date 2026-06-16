"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type GeneticaRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  codigo: string;
  nombre: string;
  tipo: string;
  origen: string;
  estado: string;
  responsable: string;
  evidencia: string;
  nota: string;
};

const emptyForm = {
  id: "",
  codigo: "",
  nombre: "",
  tipo: "",
  origen: "",
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

export default function GeneticasPage() {
  const [records, setRecords] = useState<GeneticaRecord[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [query, setQuery] = useState("");
  const [missing, setMissing] = useState<string[]>([]);
  const [success, setSuccess] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  async function loadRecords() {
    const response = await fetch("/api/geneticas", { cache: "no-store" });
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
      `${record.codigo} ${record.nombre} ${record.tipo} ${record.origen} ${record.estado} ${record.responsable} ${record.evidencia} ${record.nota}`
        .toLowerCase()
        .includes(search)
    );
  }, [query, records]);

  function validate() {
    const errors: string[] = [];

    if (invalid(form.codigo)) errors.push("Código interno");
    if (invalid(form.nombre)) errors.push("Nombre de genética");
    if (invalid(form.tipo)) errors.push("Tipo");
    if (invalid(form.origen)) errors.push("Origen");
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
      document.getElementById("geneticas-validation")?.scrollIntoView({
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

    const response = await fetch("/api/geneticas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: editing ? "update" : "create",
        id: form.id,
        codigo: clean(form.codigo),
        nombre: clean(form.nombre),
        tipo: clean(form.tipo),
        origen: clean(form.origen),
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
    setSuccess(editing ? "Genética actualizada correctamente." : "Genética guardada correctamente.");
    await loadRecords();

    window.alert(editing ? "Genética actualizada correctamente." : "Genética guardada correctamente.");
  }

  function loadExample() {
    setForm({
      id: "",
      codigo: "GEN-TIKUNA-001",
      nombre: "TIKUNA",
      tipo: "Cannabis medicinal",
      origen: "Banco interno Growlifecol / material vegetal documentado",
      estado: "Activa",
      responsable: "Edgar Rubén Gutierrez Rozo",
      evidencia: "Ficha genética, fotos, trazabilidad de madre y código interno GEN-TIKUNA-001",
      nota: "Genética registrada con trazabilidad para propagación, cultivo, cosecha y auditoría GACP."
    });

    setMissing([]);
    setSuccess("");
    setEditing(false);
  }

  function editRecord(record: GeneticaRecord) {
    setForm({
      id: record.id,
      codigo: record.codigo,
      nombre: record.nombre,
      tipo: record.tipo,
      origen: record.origen,
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
    const confirmed = window.confirm("¿Eliminar esta genética?");

    if (!confirmed) return;

    await fetch("/api/geneticas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "delete",
        id
      })
    });

    setSuccess("Genética eliminada correctamente.");
    await loadRecords();
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8 text-slate-950">
      <section className="rounded-[2rem] bg-slate-950 p-10 text-white shadow-2xl">
        <div className="text-xs font-black uppercase tracking-widest text-green-400">
          FloraTrack · GACP · Genéticas
        </div>

        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <h1 className="mt-4 text-7xl font-black">Genéticas</h1>

            <p className="mt-4 max-w-4xl text-slate-200">
              Registro maestro de genéticas para propagación, cultivos, cosecha,
              trazabilidad agrícola y control documental GACP.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a href="/" className="rounded-2xl border border-white/20 px-6 py-4 font-black text-white">Dashboard</a>
            <a href="/cultivos" className="rounded-2xl border border-white/20 px-6 py-4 font-black text-white">Cultivos</a>
            <a href="/propagacion" className="rounded-2xl border border-white/20 px-6 py-4 font-black text-white">Propagación</a>
            <a href="/cosecha" className="rounded-2xl border border-white/20 px-6 py-4 font-black text-white">Cosecha</a>
            <a href="/audit-trail" className="rounded-2xl bg-green-600 px-6 py-4 font-black text-white">Audit Trail</a>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-4 gap-4">
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

      <section className="mt-8 rounded-3xl border bg-white p-8 shadow-sm">
        <div className="flex items-start justify-between gap-5">
          <div>
            <div className="text-xs font-black uppercase tracking-widest text-green-600">
              {editing ? "Editar genética" : "Nueva genética"}
            </div>

            <h2 className="mt-2 text-4xl font-black">
              {editing ? "Actualizar genética" : "Crear genética validada"}
            </h2>
          </div>

          <button type="button" onClick={loadExample} className="rounded-2xl border px-5 py-3 font-black">
            Cargar ejemplo
          </button>
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

        <form onSubmit={saveRecord} className="mt-8 grid grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-black text-slate-500">Código interno</label>
            <input
              value={form.codigo}
              onChange={(event) => setForm({ ...form, codigo: event.target.value })}
              placeholder="Ejemplo: GEN-TIKUNA-001"
              className="mt-2 w-full rounded-2xl border px-5 py-4 font-semibold"
            />
          </div>

          <div>
            <label className="text-sm font-black text-slate-500">Nombre de genética</label>
            <input
              value={form.nombre}
              onChange={(event) => setForm({ ...form, nombre: event.target.value })}
              placeholder="Ejemplo: TIKUNA"
              className="mt-2 w-full rounded-2xl border px-5 py-4 font-semibold"
            />
          </div>

          <div>
            <label className="text-sm font-black text-slate-500">Tipo</label>
            <select
              value={form.tipo}
              onChange={(event) => setForm({ ...form, tipo: event.target.value })}
              className="mt-2 w-full rounded-2xl border px-5 py-4 font-semibold"
            >
              <option value="">Seleccione tipo</option>
              <option>Cannabis medicinal</option>
              <option>Flor farmacéutica</option>
              <option>Planta madre</option>
              <option>Clon</option>
              <option>Variedad interna</option>
              <option>Material experimental</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-black text-slate-500">Estado</label>
            <select
              value={form.estado}
              onChange={(event) => setForm({ ...form, estado: event.target.value })}
              className="mt-2 w-full rounded-2xl border px-5 py-4 font-semibold"
            >
              <option value="">Seleccione estado</option>
              <option>Activa</option>
              <option>En evaluación</option>
              <option>En cuarentena</option>
              <option>Aprobada para propagación</option>
              <option>Retirada</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="text-sm font-black text-slate-500">Origen</label>
            <input
              value={form.origen}
              onChange={(event) => setForm({ ...form, origen: event.target.value })}
              placeholder="Ejemplo: banco interno, proveedor, contrato, registro documental"
              className="mt-2 w-full rounded-2xl border px-5 py-4 font-semibold"
            />
          </div>

          <div className="col-span-2">
            <label className="text-sm font-black text-slate-500">Responsable</label>
            <input
              value={form.responsable}
              onChange={(event) => setForm({ ...form, responsable: event.target.value })}
              placeholder="Nombre del responsable real"
              className="mt-2 w-full rounded-2xl border px-5 py-4 font-semibold"
            />
          </div>

          <div className="col-span-2">
            <label className="text-sm font-black text-slate-500">Evidencia</label>
            <input
              value={form.evidencia}
              onChange={(event) => setForm({ ...form, evidencia: event.target.value })}
              placeholder="Ejemplo: ficha genética, contrato, foto, acta, código lote"
              className="mt-2 w-full rounded-2xl border px-5 py-4 font-semibold"
            />
          </div>

          <div className="col-span-2">
            <label className="text-sm font-black text-slate-500">Nota técnica</label>
            <textarea
              value={form.nota}
              onChange={(event) => setForm({ ...form, nota: event.target.value })}
              placeholder="Describa trazabilidad, uso, estado sanitario, origen documental y soporte GACP."
              className="mt-2 min-h-[150px] w-full rounded-2xl border px-5 py-4 font-semibold"
            />
          </div>

          {missing.length > 0 && (
            <div id="geneticas-validation" className="col-span-2 rounded-3xl border border-red-200 bg-red-50 p-6">
              <div className="text-xs font-black uppercase tracking-widest text-red-600">
                Validación obligatoria
              </div>

              <h3 className="mt-2 text-3xl font-black text-red-700">
                Falta información requerida
              </h3>

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
              {saving ? "Guardando..." : editing ? "Guardar cambios" : "Guardar genética"}
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
              Genéticas registradas
            </h2>
          </div>

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar genética..."
            className="w-full max-w-md rounded-2xl border px-5 py-4 font-semibold"
          />
        </div>

        <div className="mt-8 grid grid-cols-2 gap-6">
          {filtered.map((record) => (
            <article key={record.id} className="rounded-3xl border bg-slate-50 p-6">
              <div className="text-xs font-black uppercase tracking-widest text-green-600">
                {record.id}
              </div>

              <h3 className="mt-2 text-3xl font-black">{record.nombre}</h3>

              <p className="mt-3 text-slate-500">{record.nota}</p>

              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-black text-slate-400">Código</div>
                  <div className="font-bold">{record.codigo}</div>
                </div>

                <div>
                  <div className="font-black text-slate-400">Tipo</div>
                  <div className="font-bold">{record.tipo}</div>
                </div>

                <div>
                  <div className="font-black text-slate-400">Estado</div>
                  <div className="font-bold">{record.estado}</div>
                </div>

                <div>
                  <div className="font-black text-slate-400">Responsable</div>
                  <div className="font-bold">{record.responsable}</div>
                </div>

                <div className="col-span-2">
                  <div className="font-black text-slate-400">Origen</div>
                  <div className="font-bold">{record.origen}</div>
                </div>

                <div className="col-span-2">
                  <div className="font-black text-slate-400">Evidencia</div>
                  <div className="font-bold">{record.evidencia}</div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => editRecord(record)}
                  className="rounded-2xl bg-green-600 px-5 py-3 font-black text-white"
                >
                  Editar
                </button>

                <button
                  type="button"
                  onClick={() => deleteRecord(record.id)}
                  className="rounded-2xl border border-red-200 px-5 py-3 font-black text-red-700"
                >
                  Eliminar
                </button>
              </div>
            </article>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-2 rounded-3xl border bg-slate-50 p-10 text-center">
              <h3 className="text-3xl font-black">No hay genéticas registradas</h3>
              <p className="mt-3 text-slate-500">
                Cree la primera genética completando todos los campos obligatorios.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
