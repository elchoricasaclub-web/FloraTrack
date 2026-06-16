"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type PropagacionRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  batchCode: string;
  genetica: string;
  plantaMadre: string;
  cantidad: string;
  etapa: string;
  responsable: string;
  ambiente: string;
  evidencia: string;
  nota: string;
};

const emptyForm = {
  id: "",
  batchCode: "",
  genetica: "",
  plantaMadre: "",
  cantidad: "",
  etapa: "",
  responsable: "",
  ambiente: "",
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

export default function PropagacionPage() {
  const [records, setRecords] = useState<PropagacionRecord[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [query, setQuery] = useState("");
  const [missing, setMissing] = useState<string[]>([]);
  const [success, setSuccess] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  async function loadRecords() {
    const response = await fetch("/api/propagacion", { cache: "no-store" });
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
      `${record.batchCode} ${record.genetica} ${record.plantaMadre} ${record.cantidad} ${record.etapa} ${record.responsable} ${record.ambiente} ${record.evidencia} ${record.nota}`
        .toLowerCase()
        .includes(search)
    );
  }, [query, records]);

  function validate() {
    const errors: string[] = [];

    if (invalid(form.batchCode)) errors.push("Código o lote");
    if (invalid(form.genetica)) errors.push("Genética");
    if (invalid(form.plantaMadre)) errors.push("Planta madre");
    if (invalid(form.cantidad)) errors.push("Cantidad");
    if (invalid(form.etapa)) errors.push("Etapa");
    if (invalid(form.responsable)) errors.push("Responsable");
    if (invalid(form.ambiente)) errors.push("Ambiente o zona");
    if (invalid(form.evidencia)) errors.push("Evidencia");
    if (invalid(form.nota)) errors.push("Nota técnica");

    return errors;
  }

  function showErrors(errors: string[]) {
    setSuccess("");
    setMissing(errors);

    setTimeout(() => {
      document.getElementById("prop-validation")?.scrollIntoView({
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

    const response = await fetch("/api/propagacion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: editing ? "update" : "create",
        id: form.id,
        batchCode: clean(form.batchCode),
        genetica: clean(form.genetica),
        plantaMadre: clean(form.plantaMadre),
        cantidad: clean(form.cantidad),
        etapa: clean(form.etapa),
        responsable: clean(form.responsable),
        ambiente: clean(form.ambiente),
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
    setSuccess(editing ? "Registro actualizado correctamente." : "Registro guardado correctamente.");
    await loadRecords();

    window.alert(editing ? "Registro actualizado correctamente." : "Registro guardado correctamente.");
  }

  function loadExample() {
    setForm({
      id: "",
      batchCode: "PROP-TIKUNA-001",
      genetica: "TIKUNA registro interno",
      plantaMadre: "Madre TIKUNA M-01",
      cantidad: "120 esquejes",
      etapa: "Enraizamiento",
      responsable: "Edgar Rubén Gutierrez Rozo",
      ambiente: "Sala propagación bandeja A zona limpia",
      evidencia: "Bitácora de corte, foto y código lote PROP-TIKUNA-001",
      nota: "Registro de propagación con trazabilidad de genética, planta madre, responsable, ambiente y evidencia GACP."
    });

    setMissing([]);
    setSuccess("");
    setEditing(false);
  }

  function editRecord(record: PropagacionRecord) {
    setForm({
      id: record.id,
      batchCode: record.batchCode,
      genetica: record.genetica,
      plantaMadre: record.plantaMadre,
      cantidad: record.cantidad,
      etapa: record.etapa,
      responsable: record.responsable,
      ambiente: record.ambiente,
      evidencia: record.evidencia,
      nota: record.nota
    });

    setEditing(true);
    setMissing([]);
    setSuccess("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteRecord(id: string) {
    const confirmed = window.confirm("¿Eliminar este registro de propagación?");

    if (!confirmed) return;

    await fetch("/api/propagacion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        action: "delete",
        id
      })
    });

    setSuccess("Registro eliminado correctamente.");
    await loadRecords();
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8 text-slate-950">
      <section className="rounded-[2rem] bg-slate-950 p-10 text-white shadow-2xl">
        <div className="text-xs font-black uppercase tracking-widest text-green-400">
          FloraTrack · GACP
        </div>

        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <h1 className="mt-4 text-7xl font-black">Propagación</h1>

            <p className="mt-4 max-w-4xl text-slate-200">
              Gestión real de madres, esquejes, clones, genética, ambiente, responsable,
              evidencia y trazabilidad GACP.
            </p>
          </div>

          <div className="flex gap-3">
            <a href="/" className="rounded-2xl border border-white/20 px-6 py-4 font-black text-white">
              Dashboard
            </a>

            <a href="/cultivos" className="rounded-2xl border border-white/20 px-6 py-4 font-black text-white">
              Cultivos
            </a>

            <a href="/audit-trail" className="rounded-2xl bg-green-600 px-6 py-4 font-black text-white">
              Audit Trail
            </a>
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
              {editing ? "Editar registro" : "Nuevo registro"}
            </div>

            <h2 className="mt-2 text-4xl font-black">
              {editing ? "Actualizar propagación" : "Crear propagación validada"}
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
                  setEditing(false);
                  setForm(emptyForm);
                  setMissing([]);
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

        <form onSubmit={saveRecord} className="mt-8 grid grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-black text-slate-500">Código o lote</label>
            <input
              value={form.batchCode}
              onChange={(event) => setForm({ ...form, batchCode: event.target.value })}
              placeholder="Ejemplo: PROP-TIKUNA-001"
              className="mt-2 w-full rounded-2xl border px-5 py-4 font-semibold"
            />
          </div>

          <div>
            <label className="text-sm font-black text-slate-500">Genética</label>
            <input
              value={form.genetica}
              onChange={(event) => setForm({ ...form, genetica: event.target.value })}
              placeholder="Ejemplo: TIKUNA"
              className="mt-2 w-full rounded-2xl border px-5 py-4 font-semibold"
            />
          </div>

          <div>
            <label className="text-sm font-black text-slate-500">Planta madre</label>
            <input
              value={form.plantaMadre}
              onChange={(event) => setForm({ ...form, plantaMadre: event.target.value })}
              placeholder="Ejemplo: Madre M-01"
              className="mt-2 w-full rounded-2xl border px-5 py-4 font-semibold"
            />
          </div>

          <div>
            <label className="text-sm font-black text-slate-500">Cantidad</label>
            <input
              value={form.cantidad}
              onChange={(event) => setForm({ ...form, cantidad: event.target.value })}
              placeholder="Ejemplo: 120 esquejes"
              className="mt-2 w-full rounded-2xl border px-5 py-4 font-semibold"
            />
          </div>

          <div>
            <label className="text-sm font-black text-slate-500">Etapa</label>
            <select
              value={form.etapa}
              onChange={(event) => setForm({ ...form, etapa: event.target.value })}
              className="mt-2 w-full rounded-2xl border px-5 py-4 font-semibold"
            >
              <option value="">Seleccione etapa</option>
              <option>Corte de esquejes</option>
              <option>Enraizamiento</option>
              <option>Adaptación</option>
              <option>Trasplante</option>
              <option>Revisión fitosanitaria</option>
              <option>Cerrado</option>
            </select>
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

          <div className="col-span-2">
            <label className="text-sm font-black text-slate-500">Ambiente o zona</label>
            <input
              value={form.ambiente}
              onChange={(event) => setForm({ ...form, ambiente: event.target.value })}
              placeholder="Ejemplo: Sala propagación bandeja A"
              className="mt-2 w-full rounded-2xl border px-5 py-4 font-semibold"
            />
          </div>

          <div className="col-span-2">
            <label className="text-sm font-black text-slate-500">Evidencia</label>
            <input
              value={form.evidencia}
              onChange={(event) => setForm({ ...form, evidencia: event.target.value })}
              placeholder="Ejemplo: foto, bitácora, código lote"
              className="mt-2 w-full rounded-2xl border px-5 py-4 font-semibold"
            />
          </div>

          <div className="col-span-2">
            <label className="text-sm font-black text-slate-500">Nota técnica</label>
            <textarea
              value={form.nota}
              onChange={(event) => setForm({ ...form, nota: event.target.value })}
              placeholder="Describa trazabilidad, genética, madre, control sanitario y soporte GACP."
              className="mt-2 min-h-[150px] w-full rounded-2xl border px-5 py-4 font-semibold"
            />
          </div>

          {missing.length > 0 && (
            <div id="prop-validation" className="col-span-2 rounded-3xl border border-red-200 bg-red-50 p-6">
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
              {saving ? "Guardando..." : editing ? "Guardar cambios" : "Guardar propagación"}
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
              Registros de propagación
            </h2>
          </div>

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar propagación..."
            className="w-full max-w-md rounded-2xl border px-5 py-4 font-semibold"
          />
        </div>

        <div className="mt-8 grid grid-cols-2 gap-6">
          {filtered.map((record) => (
            <article key={record.id} className="rounded-3xl border bg-slate-50 p-6">
              <div className="text-xs font-black uppercase tracking-widest text-green-600">
                {record.id}
              </div>

              <h3 className="mt-2 text-3xl font-black">{record.batchCode}</h3>

              <p className="mt-3 text-slate-500">{record.nota}</p>

              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-black text-slate-400">Genética</div>
                  <div className="font-bold">{record.genetica}</div>
                </div>

                <div>
                  <div className="font-black text-slate-400">Planta madre</div>
                  <div className="font-bold">{record.plantaMadre}</div>
                </div>

                <div>
                  <div className="font-black text-slate-400">Cantidad</div>
                  <div className="font-bold">{record.cantidad}</div>
                </div>

                <div>
                  <div className="font-black text-slate-400">Etapa</div>
                  <div className="font-bold">{record.etapa}</div>
                </div>

                <div>
                  <div className="font-black text-slate-400">Responsable</div>
                  <div className="font-bold">{record.responsable}</div>
                </div>

                <div>
                  <div className="font-black text-slate-400">Ambiente</div>
                  <div className="font-bold">{record.ambiente}</div>
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
              <h3 className="text-3xl font-black">No hay registros de propagación</h3>
              <p className="mt-3 text-slate-500">Cree el primer registro completando todos los campos obligatorios.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
