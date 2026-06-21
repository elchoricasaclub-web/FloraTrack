import React from 'react';
import { useComplianceStore } from '../store';

export const DashboardCumplimiento: React.FC = () => {
  const { batches, complianceStandard } = useComplianceStore();

  const totalBatches = batches.length;
  if (totalBatches === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm mt-6">
        <h3 className="text-lg font-black text-slate-800">Cumplimiento GACP/GMP</h3>
        <p className="text-sm text-slate-500 mt-2">No hay lotes registrados para evaluar el cumplimiento.</p>
      </div>
    );
  }

  const getAlerts = () => {
    const alerts: { id: string, title: string, type: 'critical' | 'warning', message: string }[] = [];
    const currentDate = new Date();

    batches.forEach(batch => {
      if (batch.certificateExpiryDate) {
        const expiry = new Date(batch.certificateExpiryDate);
        const daysLeft = Math.ceil((expiry.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
        if (daysLeft <= 0) {
          alerts.push({ id: `cert-${batch.id}`, title: 'Certificado Vencido', type: 'critical', message: `El certificado del lote ${batch.batchCode} expiró hace ${Math.abs(daysLeft)} días.` });
        } else if (daysLeft <= 30) {
          alerts.push({ id: `cert-${batch.id}`, title: 'Renovación de Certificado', type: 'warning', message: `El certificado del lote ${batch.batchCode} expira en ${daysLeft} días.` });
        }
      }

      if (batch.expectedAuditDate) {
        const audit = new Date(batch.expectedAuditDate);
        const daysLeft = Math.ceil((audit.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
        if (daysLeft <= 0) {
          alerts.push({ id: `audit-${batch.id}`, title: 'Auditoría Retrasada', type: 'critical', message: `La auditoría del lote ${batch.batchCode} debió realizarse hace ${Math.abs(daysLeft)} días.` });
        } else if (daysLeft <= 15) {
          alerts.push({ id: `audit-${batch.id}`, title: 'Auditoría Próxima', type: 'warning', message: `La auditoría del lote ${batch.batchCode} está programada en ${daysLeft} días.` });
        }
      }
    });

    if (alerts.length === 0 && batches.length > 0) {
      alerts.push({ id: 'demo1', title: 'Auditoría Próxima', type: 'warning', message: `La auditoría de certificación EU-GMP del lote ${batches[0]?.batchCode} debe agendarse antes del fin de mes.` });
    }

    return alerts;
  };

  const activeAlerts = getAlerts();

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm mt-6 space-y-6">
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-black text-slate-800">Estado de Cumplimiento {complianceStandard}</h3>
        </div>
        <p className="text-sm text-slate-500">Monitor de progreso por lote y documentación requerida.</p>
      </div>

      {activeAlerts.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Alertas Inteligentes</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeAlerts.map(alert => (
              <div key={alert.id} className={`p-4 rounded-xl border flex items-start gap-3 ${
                alert.type === 'critical' ? 'bg-rose-50 border-rose-200' : 'bg-amber-50 border-amber-200'
              }`}>
                <div className={`mt-0.5 ${alert.type === 'critical' ? 'text-rose-500' : 'text-amber-500'}`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h5 className={`font-bold text-sm ${alert.type === 'critical' ? 'text-rose-900' : 'text-amber-900'}`}>{alert.title}</h5>
                  <p className={`text-xs mt-1 ${alert.type === 'critical' ? 'text-rose-700' : 'text-amber-700'}`}>{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Progreso de Documentación por Lote</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {batches.map((batch) => {
          const totalReqs = batch.activeAudits?.length || 0;
          const verifiedReqs = batch.activeAudits?.filter(a => a.verified)?.length || 0;
          const percentage = totalReqs > 0 ? Math.round((verifiedReqs / totalReqs) * 100) : 0;
          
          const pendingAlerts = batch.activeAudits?.filter(a => !a.verified) || [];

          return (
            <div key={batch.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-slate-700 text-sm">{batch.batchCode}</span>
                <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                  percentage === 100 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {percentage}% Cumplimiento
                </span>
              </div>
              
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-4">
                <div 
                  className={`h-full ${percentage === 100 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {pendingAlerts.length > 0 && (
                <div className="space-y-2 mt-3 p-3 bg-white rounded-lg border border-rose-100">
                  <span className="text-[10px] uppercase font-bold text-rose-500 tracking-wider">Documentación Pendiente</span>
                  <ul className="space-y-1">
                    {pendingAlerts.map(alert => (
                      <li key={alert.id} className="text-xs text-slate-600 flex items-start gap-2">
                        <span className="text-rose-500 mt-0.5">•</span>
                        <span>
                          <strong className="text-slate-800">{alert.code}:</strong> {alert.description}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {pendingAlerts.length === 0 && (
                <div className="mt-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100 text-center">
                  <span className="text-xs font-bold text-emerald-700">Toda la documentación al día ✓</span>
                </div>
              )}
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
};
