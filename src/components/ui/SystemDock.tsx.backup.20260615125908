"use client";

import { FormEvent, useEffect, useState } from "react";

type PanelMode = "save" | "status" | null;

const blockedValues = [
  "",
  "usuario actual",
  "responsable gacp",
  "guardado global seguro",
  "guardar avance actual",
  "evidencia pendiente",
  "sin evidencia",
  "n/a",
  "na"
];

function clean(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function isInvalid(value: string) {
  const normalized = clean(value).toLowerCase();
  return blockedValues.includes(normalized) || clean(value).length < 3;
}

function getPageModule() {
  if (typeof document === "undefined") return "FloraTrack";

  return (
    document.querySelector("header h1")?.textContent?.trim() ||
    document.querySelector("main h1")?.textContent?.trim() ||
    document.querySelector("main h2")?.textContent?.trim() ||
    document.querySelector("section h1")?.textContent?.trim() ||
    document.querySelector("section h2")?.textContent?.trim() ||
    "FloraTrack"
  );
}

function hideLegacySaveDocks() {
  const currentDock = document.querySelector("[data-system-dock-root='true']");
  const elements = Array.from(document.querySelectorAll("div, section, aside, article")) as HTMLElement[];

  for (const element of elements) {
    if (currentDock && currentDock.contains(element)) continue;

    const text = (element.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();

    const hasSaveButton =
      text.includes("guardar avance actual") &&
      (
        text.includes("guardado seguro") ||
        text.includes("guardado seguro validado") ||
        text.includes("guardado validado")
      );

    if (!hasSaveButton) continue;

    const style = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();

    const looksFloating =
      style.position === "fixed" ||
      style.position === "sticky" ||
      Number(style.zIndex || 0) > 1000 ||
      rect.right > window.innerWidth - 420 ||
      rect.bottom > window.innerHeight - 260;

    if (looksFloating) {
      element.style.setProperty("display", "none", "important");
      element.style.setProperty("visibility", "hidden", "important");
      element.setAttribute("data-hidden-legacy-save-dock", "true");
    }
  }
}

export default function SystemDock() {
  const [open, setOpen] = useState<PanelMode>(null);
  const [missing, setMissing] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    itemTitle: "",
    owner: "",
    evidence: "",
    note: ""
  });

  useEffect(() => {
    hideLegacySaveDocks();

    const interval = window.setInterval(() => {
      hideLegacySaveDocks();
    }, 500);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  function validate() {
    const errors: string[] = [];

    if (isInvalid(form.itemTitle)) errors.push("Título del avance");
    if (isInvalid(form.owner)) errors.push("Responsable real");
    if (isInvalid(form.evidence)) errors.push("Evidencia real");
    if (isInvalid(form.note)) errors.push("Nota técnica");

    return errors;
  }

  async function saveProgress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const errors = validate();

    if (errors.length > 0) {
      setMissing(errors);

      window.setTimeout(() => {
        setMissing([]);
      }, 7000);

      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/progress-records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          moduleName: getPageModule(),
          itemTitle: clean(form.itemTitle),
          actionType: "validated-progress-save",
          owner: clean(form.owner),
          status: "Guardado",
          evidence: clean(form.evidence),
          note: clean(form.note)
        })
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        setMissing(data.fields || ["Información obligatoria"]);

        window.setTimeout(() => {
          setMissing([]);
        }, 7000);

        return;
      }

      setForm({
        itemTitle: "",
        owner: "",
        evidence: "",
        note: ""
      });

      setOpen(null);
      window.location.href = "/progress-records";
    } finally {
      setSaving(false);
    }
  }

  return (
    <div data-system-dock-root="true">
      <button
        type="button"
        data-runtime-ignore="true"
        onClick={() => setOpen("status")}
        className="fixed bottom-6 left-6 z-[99980] rounded-3xl bg-slate-950 px-5 py-4 text-sm font-black text-white shadow-2xl"
      >
        Estado App
      </button>

      <div className="fixed bottom-6 right-6 z-[99990] w-[330px] rounded-3xl border bg-white p-5 shadow-2xl">
        <div className="text-xs font-black uppercase tracking-widest text-green-600">
          Guardado seguro validado
        </div>

        <button
          type="button"
          data-runtime-ignore="true"
          onClick={() => setOpen("save")}
          className="mt-3 w-full rounded-2xl bg-green-600 px-5 py-4 text-sm font-black text-white"
        >
          Guardar avance actual
        </button>

        <a
          data-runtime-ignore="true"
          href="/progress-records"
          className="mt-3 block rounded-2xl border px-4 py-3 text-center text-xs font-black text-slate-700"
        >
          Ver registros
        </a>
      </div>

      {missing.length > 0 && (
        <div className="fixed right-6 top-24 z-[100000] w-[440px] rounded-3xl border border-red-200 bg-white p-6 shadow-2xl">
          <div className="text-xs font-black uppercase tracking-widest text-red-600">
            Validación obligatoria
          </div>

          <h3 className="mt-2 text-2xl font-black text-slate-900">
            Falta información requerida
          </h3>

          <p className="mt-2 text-sm font-semibold text-slate-600">
            No se puede guardar con campos vacíos o genéricos.
          </p>

          <ul className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-700">
            {missing.map((field) => (
              <li key={field}>• {field}</li>
            ))}
          </ul>
        </div>
      )}

      {open === "save" && (
        <div className="fixed inset-0 z-[99998] flex justify-end bg-slate-950/50">
          <aside className="h-full w-full max-w-2xl overflow-y-auto bg-white p-8 shadow-2xl">
            <div className="flex items-start justify-between gap-5">
              <div>
                <div className="text-xs font-black uppercase tracking-widest text-green-600">
                  Guardado validado
                </div>

                <h2 className="mt-2 text-4xl font-black text-slate-900">
                  Guardar avance actual
                </h2>

                <p className="mt-3 text-slate-500">
                  Completa información real. No se aceptan campos vacíos.
                </p>
              </div>

              <button
                type="button"
                data-runtime-ignore="true"
                onClick={() => setOpen(null)}
                className="rounded-2xl border px-4 py-3 font-black text-slate-700"
              >
                Cerrar
              </button>
            </div>

            <form onSubmit={saveProgress} className="mt-8 space-y-5">
              <div>
                <label className="text-sm font-black text-slate-500">
                  Título del avance
                </label>

                <input
                  name="itemTitle"
                  value={form.itemTitle}
                  onChange={(event) => setForm({ ...form, itemTitle: event.target.value })}
                  placeholder="Ejemplo: Revisión documental del módulo Cultivos"
                  className="mt-2 w-full rounded-2xl border px-5 py-4 font-semibold"
                />
              </div>

              <div>
                <label className="text-sm font-black text-slate-500">
                  Responsable real
                </label>

                <input
                  name="owner"
                  value={form.owner}
                  onChange={(event) => setForm({ ...form, owner: event.target.value })}
                  placeholder="Ejemplo: Edgar Rubén Gutierrez Rozo"
                  className="mt-2 w-full rounded-2xl border px-5 py-4 font-semibold"
                />
              </div>

              <div>
                <label className="text-sm font-black text-slate-500">
                  Evidencia real
                </label>

                <input
                  name="evidence"
                  value={form.evidence}
                  onChange={(event) => setForm({ ...form, evidence: event.target.value })}
                  placeholder="Ejemplo: Captura, acta, registro, lote, código o documento"
                  className="mt-2 w-full rounded-2xl border px-5 py-4 font-semibold"
                />
              </div>

              <div>
                <label className="text-sm font-black text-slate-500">
                  Nota técnica
                </label>

                <textarea
                  name="note"
                  value={form.note}
                  onChange={(event) => setForm({ ...form, note: event.target.value })}
                  placeholder="Describe el avance realizado y su soporte."
                  className="mt-2 min-h-[150px] w-full rounded-2xl border px-5 py-4 font-semibold"
                />
              </div>

              <button
                type="submit"
                data-runtime-ignore="true"
                disabled={saving}
                className="rounded-2xl bg-green-600 px-7 py-4 font-black text-white disabled:opacity-60"
              >
                {saving ? "Guardando..." : "Guardar avance validado"}
              </button>
            </form>
          </aside>
        </div>
      )}

      {open === "status" && (
        <div className="fixed inset-0 z-[99997] flex items-center justify-center bg-slate-950/50 p-6">
          <section className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl">
            <div className="flex items-start justify-between gap-5">
              <div>
                <div className="text-xs font-black uppercase tracking-widest text-green-600">
                  FloraTrack · Estado del sistema
                </div>

                <h2 className="mt-2 text-5xl font-black text-slate-900">
                  Estado de la App
                </h2>

                <p className="mt-3 max-w-4xl text-slate-500">
                  App activa en modo desarrollo local. Panel separado para estado técnico.
                </p>
              </div>

              <button
                type="button"
                data-runtime-ignore="true"
                onClick={() => setOpen(null)}
                className="rounded-2xl border px-5 py-3 font-black text-slate-700"
              >
                Cerrar
              </button>
            </div>

            <div className="mt-8 grid grid-cols-4 gap-4">
              <div className="rounded-3xl border bg-slate-50 p-6">
                <div className="text-xs font-black uppercase text-slate-400">Servidor</div>
                <div className="mt-2 text-3xl font-black text-green-600">Activo</div>
              </div>

              <div className="rounded-3xl border bg-slate-50 p-6">
                <div className="text-xs font-black uppercase text-slate-400">Guardado</div>
                <div className="mt-2 text-3xl font-black text-green-600">Validado</div>
              </div>

              <div className="rounded-3xl border bg-slate-50 p-6">
                <div className="text-xs font-black uppercase text-slate-400">Registros</div>
                <div className="mt-2 text-3xl font-black text-green-600">Protegidos</div>
              </div>

              <div className="rounded-3xl border bg-slate-50 p-6">
                <div className="text-xs font-black uppercase text-slate-400">Versión</div>
                <div className="mt-2 text-3xl font-black text-slate-900">MVP</div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
