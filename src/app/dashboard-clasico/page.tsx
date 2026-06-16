"use client";

const classicLinks = [
  { title: "Command Center Premium", href: "/", tag: "Premium" },
  { title: "BHO", href: "/bho", tag: "Extraction" },
  { title: "Live Rosin", href: "/live-rosin", tag: "Solventless" },
  { title: "Bubble Hash", href: "/bubble-hash", tag: "Solventless" },
  { title: "Reportes Programados", href: "/reportes-programados", tag: "Reports" },
  { title: "Riesgos GxP", href: "/riesgos", tag: "Risk" },
  { title: "Control de Cambios", href: "/cambios", tag: "Change" },
  { title: "Workflows QA", href: "/workflows", tag: "QA" },
  { title: "API Regulatoria", href: "/regulatoria-api", tag: "Reg API" },
];

export default function DashboardClasicoSeguroPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-950">
      <section className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-black uppercase tracking-[0.28em] text-emerald-700">
            FloraTrack
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight">
            Dashboard clásico seguro
          </h1>

          <p className="mt-3 max-w-4xl text-base font-semibold leading-7 text-slate-600">
            Esta vista fue corregida para eliminar el error de importación de PremiumUI.
            Usa el Command Center como dashboard principal y conserva esta pantalla como acceso seguro.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {classicLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800">
                {item.tag}
              </span>

              <h2 className="mt-5 text-2xl font-black text-slate-950">
                {item.title}
              </h2>

              <p className="mt-2 text-sm font-semibold text-slate-500">
                Abrir módulo →
              </p>
            </a>
          ))}
        </section>
      </section>
    </main>
  );
}
