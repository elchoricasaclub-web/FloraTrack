"use client";

import dynamic from "next/dynamic";

const CommandCenterPage = dynamic(
  () => import("../../components/floratrack/CommandCenterPage"),
  {
    ssr: false,
    loading: () => <CommandCenterLoading />,
  }
);

export default function CommandCenterRoutePage() {
  return <CommandCenterPage />;
}

function CommandCenterLoading() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.22),transparent_32rem),radial-gradient(circle_at_top_right,rgba(56,189,248,0.18),transparent_30rem),linear-gradient(180deg,#020617_0%,#07111f_100%)] p-6">
        <div className="mx-auto flex min-h-[80vh] max-w-7xl flex-col justify-center">
          <div className="inline-flex w-fit rounded-full border border-emerald-300/30 bg-emerald-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-emerald-200">
            FloraTrack
          </div>

          <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-tight md:text-7xl">
            Cargando Command Center
          </h1>

          <p className="mt-5 max-w-2xl text-base font-semibold leading-8 text-slate-300">
            Preparando módulos GACP/GMP, BHO, Live Rosin, Bubble Hash, QA, riesgos,
            reportes, auditoría y trazabilidad.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </section>
    </main>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
      <div className="h-12 w-12 animate-pulse rounded-3xl bg-white/10" />
      <div className="mt-6 h-7 w-2/3 animate-pulse rounded-xl bg-white/10" />
      <div className="mt-3 h-4 w-full animate-pulse rounded-xl bg-white/10" />
      <div className="mt-2 h-4 w-5/6 animate-pulse rounded-xl bg-white/10" />
    </div>
  );
}
