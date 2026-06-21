import React from 'react';
import { useComplianceStore } from '../store';

export const SemaforoCumplimiento: React.FC = () => {
  const { batches, complianceStandard } = useComplianceStore();

  const getSemaforoStatus = (batch: any) => {
    const totalReqs = batch.activeAudits?.length || 0;
    const verifiedReqs = batch.activeAudits?.filter((a: any) => a.verified)?.length || 0;
    const percentage = totalReqs > 0 ? (verifiedReqs / totalReqs) * 100 : 100;

    if (percentage === 100) return { color: 'bg-emerald-500', label: 'Conforme', tailwindText: 'text-emerald-500', shadow: 'shadow-emerald-500/50' };
    if (percentage >= 80) return { color: 'bg-amber-500', label: 'Atención', tailwindText: 'text-amber-500', shadow: 'shadow-amber-500/50' };
    return { color: 'bg-rose-500', label: 'Crítico', tailwindText: 'text-rose-500', shadow: 'shadow-rose-500/50' };
  };

  if (batches.length === 0) return null;

  return (
    <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden">
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest block mb-1">
            Módulo QA/QC
          </span>
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            Semáforo de Cumplimiento ALCOA+
          </h3>
          <p className="text-xs text-slate-400 font-medium">Estado regulatorio en tiempo real ({complianceStandard})</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        {batches.map((batch) => {
          const status = getSemaforoStatus(batch);
          const pending = batch.activeAudits?.filter((a: any) => !a.verified) || [];

          return (
            <div key={batch.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="text-sm font-black text-slate-200">{batch.batchCode}</h4>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">ID: {batch.id}</p>
                  </div>
                  {/* Luz principal del semáforo */}
                  <div className="flex flex-col gap-1.5 p-2 bg-slate-900 rounded-full border border-slate-800">
                    <div className={`w-4 h-4 rounded-full border border-slate-800 ${status.color === 'bg-emerald-500' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-slate-800 opacity-30'}`} />
                    <div className={`w-4 h-4 rounded-full border border-slate-800 ${status.color === 'bg-amber-500' ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'bg-slate-800 opacity-30'}`} />
                    <div className={`w-4 h-4 rounded-full border border-slate-800 ${status.color === 'bg-rose-500' ? 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]' : 'bg-slate-800 opacity-30'}`} />
                  </div>
                </div>

                {pending.length > 0 ? (
                  <div className="space-y-2 mt-4">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-slate-500">Brechas Detectadas</span>
                    {pending.slice(0, 2).map((alert: any) => (
                      <div key={alert.id} className="bg-slate-900 p-2 rounded-lg border border-slate-800/50">
                        <span className={`text-[10px] font-black ${status.tailwindText}`}>{alert.code}</span>
                        <p className="text-[10px] text-slate-400 mt-0.5 truncate">{alert.description}</p>
                      </div>
                    ))}
                    {pending.length > 2 && (
                      <div className="text-[10px] text-slate-500 font-bold text-center mt-2">+ {pending.length - 2} alertas adicionales</div>
                    )}
                  </div>
                ) : (
                  <div className="mt-4 flex items-center justify-center p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <span className="text-xs font-black text-emerald-400">Todo en regla ✓</span>
                  </div>
                )}
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800 flex justify-between items-center">
                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md bg-slate-900 ${status.tailwindText}`}>
                  {status.label}
                </span>
                <button className="text-[10px] font-black text-slate-300 hover:text-white transition-colors uppercase">
                  Ver Detalles →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
