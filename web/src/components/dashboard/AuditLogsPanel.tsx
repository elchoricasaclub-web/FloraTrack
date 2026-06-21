import React from 'react';
import { useComplianceStore } from '../../store';
import { AuditSystemLogAction } from '../../types/agricultural';

const getActionColor = (action: AuditSystemLogAction) => {
  switch (action) {
    case 'CREATION': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    case 'EDITION': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    case 'SIGNATURE': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
    case 'VALIDATION': return 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20';
    case 'SYSTEM_SYNC': return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
  }
};

const getActionLabel = (action: AuditSystemLogAction) => {
  switch (action) {
    case 'CREATION': return 'CREACIÓN';
    case 'EDITION': return 'EDICIÓN';
    case 'SIGNATURE': return 'FIRMA DIGITAL';
    case 'VALIDATION': return 'VALIDACIÓN';
    case 'SYSTEM_SYNC': return 'SINCRONIZACIÓN';
    default: return action;
  }
};

export const AuditLogsPanel: React.FC = () => {
  const { auditLogs } = useComplianceStore();

  return (
    <div className="bg-[#111A3A] border border-[#1A2642] p-4 rounded-xl mt-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-white">Registro de Auditoría Inmutable (GACP)</h4>
          <p className="text-xs text-slate-400 mt-1">Historial criptográfico de acciones del sistema</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
          <span className="text-xs font-bold text-emerald-400">LEDGER ACTIVO</span>
        </div>
      </div>
      
      <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
        {auditLogs.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">No hay registros de auditoría recientes.</div>
        ) : (
          auditLogs.map((log) => (
            <div key={log.id} className="bg-[#0A1128] border border-[#1A2642] p-3 rounded-lg hover:border-[#2A3B5C] transition-colors relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1A2642]"></div>
              <div className="flex items-start justify-between pl-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-[9px] font-black tracking-wider px-2 py-0.5 rounded border ${getActionColor(log.action)}`}>
                      {getActionLabel(log.action)}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {new Date(log.timestamp).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'medium' })}
                    </span>
                    {log.batchId && (
                      <span className="text-[10px] text-slate-500 font-mono">
                        Lote: {log.batchId}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-300 font-medium">{log.details}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-white flex items-center justify-end gap-1.5">
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {log.performedBy}
                  </div>
                  <div className="text-[8px] text-slate-500 font-mono mt-1 break-all flex items-center justify-end gap-1" title="Firma Criptográfica SHA-256">
                    <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    {log.hash.substring(0, 16)}...
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
