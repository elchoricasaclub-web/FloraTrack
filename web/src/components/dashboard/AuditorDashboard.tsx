import React, { useState } from 'react';
import { useComplianceStore } from '../../store';

import { AuditDetailView } from './AuditDetailView';
import { RechartsDashboard } from './RechartsDashboard';
import { ConfigPanelModal } from './ConfigPanelModal';
import { AuditLogsPanel } from './AuditLogsPanel';

export const AuditorDashboard: React.FC = () => {
  const { batches, complianceStandard } = useComplianceStore();
  
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDateRange, setFilterDateRange] = useState<string>('all');
  const [selectedBatchForAudit, setSelectedBatchForAudit] = useState<any | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  const notifications = [
    { id: 1, type: 'urgent', message: 'Lote L-2023-A requiere firma digital urgente.', time: 'Hace 5 min' },
    { id: 2, type: 'warning', message: 'Documento "Certificación de Semillas" próximo a vencer.', time: 'Hace 2 horas' }
  ];

  // Mock data for applied inputs compliance checking
  const [batchComplianceData, setBatchComplianceData] = useState(() => 
    batches.map(batch => ({
      ...batch,
      complianceStandard: complianceStandard,
      appliedInputs: [
        { name: 'NeemXtract 500', isGacpCompliant: true, appliedAt: '2025-10-10' },
        { name: 'Sinthetic-Fert-X', isGacpCompliant: Math.random() > 0.5, appliedAt: '2025-10-15' },
      ],
      documentationComplete: Math.random() > 0.3,
      labTestsPassed: Math.random() > 0.2
    }))
  );

  const getComplianceStatus = (batch: any) => {
    // Check if any applied input is non-compliant
    const hasNonCompliantInputs = batch.appliedInputs.some((input: any) => !input.isGacpCompliant);
    
    if (hasNonCompliantInputs) {
      return { 
        flag: 'red', 
        color: 'bg-rose-500', 
        text: 'text-rose-500',
        bg: 'bg-rose-500/10',
        label: 'Crítico: Insumos No Conformes' 
      };
    }
    
    if (!batch.documentationComplete || !batch.labTestsPassed) {
      return { 
        flag: 'yellow', 
        color: 'bg-amber-500', 
        text: 'text-amber-500',
        bg: 'bg-amber-500/10',
        label: 'Advertencia: Doc/Lab Pendiente' 
      };
    }
    
    return { 
      flag: 'green', 
      color: 'bg-emerald-500', 
      text: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      label: 'Conforme Total' 
    };
  };

  const filteredBatches = batchComplianceData.filter((batch) => {
    const status = getComplianceStatus(batch);
    let statusMatch = true;
    if (filterStatus === 'pending') statusMatch = status.flag === 'yellow';
    if (filterStatus === 'approved') statusMatch = status.flag === 'green';
    if (filterStatus === 'rejected') statusMatch = status.flag === 'red';

    let dateMatch = true;
    // Mock date filtering logic
    if (filterDateRange === 'last7') dateMatch = Math.random() > 0.2;
    if (filterDateRange === 'last30') dateMatch = Math.random() > 0.1;

    return statusMatch && dateMatch;
  });

  return (
    <div className="relative">
      <div className="bg-[#0A1128] border border-[#1A2642] rounded-3xl p-6 shadow-2xl w-full">
        <div className="flex justify-between items-start mb-6">
        <div>
          <span className="text-[10px] text-blue-400 font-extrabold uppercase tracking-widest block mb-1">
            Panel de Auditoría
          </span>
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            Inspección GACP/GMP y Trazabilidad
          </h3>
          <p className="text-xs text-slate-400 font-medium">Control de lotes y validación regulatoria de insumos aplicados</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              const headers = ['Lote/Cepa', 'Score', 'Fase', 'Documentacion', 'Analisis Lab', 'Estado'];
              const csvContent = "data:text/csv;charset=utf-8," 
                + headers.join(',') + "\n"
                + filteredBatches.map(batch => {
                  const status = getComplianceStatus(batch);
                  const score = status.flag === 'green' ? '100' : status.flag === 'yellow' ? '85' : '45';
                  return `${batch.batchCode} - ${batch.variety},${score},${batch.stage},${batch.documentationComplete ? 'Si' : 'No'},${batch.labTestsPassed ? 'Si' : 'No'},${status.label}`;
                }).join('\n');
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", `auditoria_gcp_${new Date().toISOString().split('T')[0]}.csv`);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="px-3 py-1.5 rounded-lg bg-[#111A3A] border border-[#1A2642] text-slate-300 hover:text-white transition-colors text-xs font-bold flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Exportar CSV
          </button>
          <div className="relative">
            <button 
              onClick={() => setShowConfig(!showConfig)}
              className="p-2 rounded-lg bg-[#111A3A] border border-[#1A2642] text-slate-400 hover:text-white transition-colors mr-2 relative"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg bg-[#111A3A] border border-[#1A2642] text-slate-400 hover:text-white transition-colors relative"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-[#111A3A] animate-pulse"></span>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-[#0A1128] border border-[#1A2642] rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="p-3 border-b border-[#1A2642] bg-[#060B19]">
                  <h4 className="text-sm font-bold text-white">Notificaciones GACP</h4>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map(notif => (
                    <div key={notif.id} className="p-3 border-b border-[#1A2642] hover:bg-[#111A3A] transition-colors cursor-pointer flex gap-3">
                      <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${notif.type === 'urgent' ? 'bg-rose-500' : 'bg-amber-500'}`}></div>
                      <div>
                        <p className="text-xs text-slate-300 font-medium">{notif.message}</p>
                        <p className="text-[10px] text-slate-500 mt-1">{notif.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-bold">
            Modo Auditor
          </div>
        </div>
      </div>

      <RechartsDashboard />

      <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 rounded-xl bg-[#111A3A] border border-[#1A2642]">
        <div className="flex-1">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Estado de Certificación</label>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full bg-[#060B19] border border-[#1A2642] text-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="all">Todos los Estados</option>
            <option value="pending">Pendiente de Aprobación</option>
            <option value="approved">Aprobado / Conforme</option>
            <option value="rejected">Rechazado / Crítico</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Rango de Fecha de Cosecha</label>
          <select 
            value={filterDateRange}
            onChange={(e) => setFilterDateRange(e.target.value)}
            className="w-full bg-[#060B19] border border-[#1A2642] text-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="all">Cualquier Fecha</option>
            <option value="last7">Últimos 7 días</option>
            <option value="last30">Últimos 30 días</option>
            <option value="thisYear">Este año</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-[#060B19] border-b border-[#1A2642]">
            <tr>
              <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">Lote / Cepa</th>
              <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center">Score</th>
              <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">Fase Actual</th>
              <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">Insumos Aplicados</th>
              <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center">Documentación</th>
              <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center">Análisis Lab</th>
              <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider">Estado de Cumplimiento</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1A2642] relative text-slate-300 font-medium">
            {filteredBatches.map((batch) => {
              const status = getComplianceStatus(batch);
              return (
                <tr 
                  key={batch.id} 
                  className="hover:bg-[#111A3A] transition-colors cursor-pointer"
                  onClick={() => setSelectedBatchForAudit({ ...batch, status })}
                >
                  <td className="px-4 py-4">
                    <div className="font-bold text-white">{batch.batchCode}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{batch.variety}</div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded bg-[#1A2642] border border-[#2A3B5C]`}>
                       <svg className={`w-3.5 h-3.5 ${status.flag === 'green' ? 'text-emerald-400' : status.flag === 'yellow' ? 'text-amber-400' : 'text-rose-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {status.flag === 'green' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
                        {status.flag === 'yellow' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
                        {status.flag === 'red' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />}
                       </svg>
                       <span className="text-xs font-bold text-slate-300">
                         {status.flag === 'green' ? '100' : status.flag === 'yellow' ? '85' : '45'}
                       </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1A2642] text-slate-300 border border-[#2A3B5C]">
                      {batch.stage}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-1">
                      {batch.appliedInputs.map((input: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${input.isGacpCompliant ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                          <span className="text-[11px] text-slate-300">{input.name}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    {batch.documentationComplete ? (
                      <span className="text-emerald-400">✓</span>
                    ) : (
                      <span className="text-amber-400">Pendiente</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {batch.labTestsPassed ? (
                      <span className="text-emerald-400">Aprobado</span>
                    ) : (
                      <span className="text-amber-400">N/A</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${status.bg} border-${status.color}/30`}>
                      <span className={`w-2 h-2 rounded-full ${status.color} animate-pulse`}></span>
                      <span className={`text-[10px] font-black uppercase ${status.text}`}>{status.label}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredBatches.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500 text-sm">
                  No hay lotes disponibles para auditoría.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </div>

      <AuditLogsPanel />

      {/* Auditor Modal / Side Panel */}
      {selectedBatchForAudit && (
        <AuditDetailView 
          batch={selectedBatchForAudit} 
          onClose={() => setSelectedBatchForAudit(null)} 
        />
      )}

      {/* Config Panel Modal */}
      <ConfigPanelModal 
        isOpen={showConfig}
        onClose={() => setShowConfig(false)}
      />
    </div>
  );
};
