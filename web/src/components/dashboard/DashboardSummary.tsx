import React, { useEffect, useRef } from 'react';
import { SemaforoCumplimiento } from '../dashboard/SemaforoCumplimiento';
import { ComplianceTracker } from '../ComplianceTracker';
import { TelemetryGrid } from '../dashboard/TelemetryGrid';
import { BioinsumosModule } from '../dashboard/BioinsumosModule';
import { ActividadesModule } from '../dashboard/ActividadesModule';
import { AuditorDashboard } from '../dashboard/AuditorDashboard';
import { useComplianceSummary } from '../../hooks/useComplianceSummary';
import { useNotification } from '../../contexts/NotificationContext';
import { generateCompliancePDF } from '../../utils/pdfGenerator';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from 'recharts';

export const DashboardSummary: React.FC = () => {
  const {
    complianceStandard,
    batches,
    loading,
    displayFincas,
    totalHectareas,
    fincasActivasCount,
    displayLotesCount,
    displayAlerts,
    criticalAlertsCount,
    chartData
  } = useComplianceSummary();

  const { addToast } = useNotification();
  const toastsEmitted = useRef(false);

  useEffect(() => {
    // Solo emitir validando una vez al cargar el dashboard base
    if (toastsEmitted.current || batches.length === 0) return;
    
    toastsEmitted.current = true;
    const currentDate = new Date();

    batches.forEach(batch => {
      if (batch.certificateExpiryDate) {
        const expiry = new Date(batch.certificateExpiryDate);
        const daysLeft = Math.ceil((expiry.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
        if (daysLeft <= 0) {
          addToast({ id: `exp-${batch.id}`, title: 'Certificado Vencido', type: 'critical', message: `Certificado del lote ${batch.batchCode} está vencido.` });
        } else if (daysLeft <= 30) {
          addToast({ id: `warn-${batch.id}`, title: 'Vencimiento Próximo', type: 'warning', message: `Certificado del lote ${batch.batchCode} vence en ${daysLeft} días.` });
        }
      }

      if (batch.expectedAuditDate) {
        const audit = new Date(batch.expectedAuditDate);
        const daysLeft = Math.ceil((audit.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
        if (daysLeft <= 0) {
          addToast({ id: `aud-crit-${batch.id}`, title: 'Auditoría Retrasada', type: 'critical', message: `La auditoría del lote ${batch.batchCode} está retrasada.` });
        } else if (daysLeft <= 15) {
          addToast({ id: `aud-warn-${batch.id}`, title: 'Auditoría Próxima', type: 'warning', message: `Auditoría programada para el lote ${batch.batchCode} en ${daysLeft} días.` });
        }
      }
    });

    if (batches.length > 0 && criticalAlertsCount === 0) {
      addToast({ id: 'demo-1', title: 'Renovación EU-GMP', type: 'warning', message: `Agendar renovación para ${batches[0]?.batchCode} pronto.` });
    }
  }, [batches, addToast, criticalAlertsCount]);

  const expiringCertificates = batches.filter(batch => {
    if (batch.certificateExpiryDate) {
      const expiry = new Date(batch.certificateExpiryDate);
      const daysLeft = Math.ceil((expiry.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
      return daysLeft <= 30;
    }
    return false;
  });

  const handleDownloadReport = () => {
    addToast({ id: 'pdf-start', title: 'Generando Reporte', type: 'success', message: 'Iniciando generación de PDF ALCOA+...' });
    generateCompliancePDF({
      auditorName: 'Administrador SaaS',
      standardName: complianceStandard,
      actividades: [],
      batchCode: batches[0]?.batchCode || 'GENERAL',
      strain: batches[0]?.variety || 'MULTI-CEPA'
    });
  };

  return (
    <div className="space-y-4 md:space-y-8 animate-fade-in">
      {/* Saludo inicial y selector de estándar actual */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Consola de Trazabilidad y Cumplimiento</h2>
          <p className="text-xs text-slate-500 mt-1">
            Supervisión integral de estándares <strong className="text-slate-800">WHO GACP</strong> y <strong className="text-slate-800">EMA EU-GMP Vol. 4</strong> para cultivo agrícola farmacéutico.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleDownloadReport}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-md"
          >
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar GACP PDF
          </button>
          
          <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
          
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest hidden sm:inline">Estándar Activo:</span>
            <span className={`px-3 py-1.5 rounded-xl text-xs font-black tracking-wide border uppercase ${
              complianceStandard === 'WHO_GACP' 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                : 'bg-indigo-50 text-indigo-700 border-indigo-100'
            }`}>
              {complianceStandard === 'WHO_GACP' ? '✓ WHO GACP Guidelines' : '★ EMA EU-GMP Vol. 4'}
            </span>
          </div>
        </div>
      </div>

      {/* Grid Principal de KPIs Clave */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI 1: Fincas Activas */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">
                Fincas del Proyecto
              </span>
              <span className="text-4xl font-black text-slate-900 block mt-2">
                {fincasActivasCount}
              </span>
              <span className="text-[10px] bg-sky-50 text-sky-700 font-bold px-2 py-0.5 rounded-md inline-block mt-3">
                {totalHectareas.toFixed(1)} Hectáreas Totales
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 transition-colors group-hover:bg-sky-500 group-hover:text-white shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-50 space-y-2 text-xs">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Últimos Registros del Proyecto</span>
            <div className="space-y-1.5">
              {displayFincas.slice(0, 2).map((f) => (
                <div key={f.id} className="flex justify-between items-center text-slate-600">
                  <span className="font-semibold truncate max-w-[150px]">{f.nombre}</span>
                  <span className="font-mono text-[10px] text-slate-400">{f.ubicacion}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* KPI 2: Lotes en Cultivos */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">
                Lotes en Cultivo
              </span>
              <span className="text-4xl font-black text-slate-900 block mt-2">
                {displayLotesCount}
              </span>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-md inline-block mt-3">
                {batches.length > 0 ? `${batches.length} Lotes Trazados` : 'Invernaderos Operativos'}
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 transition-colors group-hover:bg-emerald-500 group-hover:text-white shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.75 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-50 text-xs">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">Fases Operacionales Activas</span>
            
            {/* Barra de Distribución Agrícola */}
            <div className="w-full h-2 bg-slate-100 rounded-full flex overflow-hidden">
              <div style={{ width: '30%' }} className="bg-emerald-500 h-full" title="Sowing" />
              <div style={{ width: '40%' }} className="bg-indigo-500 h-full" title="Flowering" />
              <div style={{ width: '30%' }} className="bg-amber-500 h-full" title="Curing" />
            </div>
            <div className="flex justify-between text-[9px] text-slate-400 font-bold mt-1.5 uppercase">
              <span>Siembra (30%)</span>
              <span>Floración (40%)</span>
              <span>Post Cosecha (30%)</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Alertas de Cumplimiento Pendientes */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">
                Cumplimiento GACP/GMP
              </span>
              <span className={`text-4xl font-black block mt-2 ${displayAlerts.length > 0 ? 'text-amber-500' : 'text-slate-900'}`}>
                {displayAlerts.length}
              </span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-md inline-block mt-3 ${
                criticalAlertsCount > 0 ? 'bg-rose-50 text-rose-700 animate-pulse' : 'bg-amber-50 text-amber-700'
              }`}>
                {criticalAlertsCount} Alertas Críticas Críticas
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 transition-colors group-hover:bg-amber-500 group-hover:text-white shrink-0">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-50 text-xs text-slate-500">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Aseguramiento de Calidad ALCOA+</span>
            <div className="flex justify-between items-center mt-2 text-[10px] font-bold">
              <span>Habilitado por Firmas Digitales: En Línea</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
          </div>
        </div>

        {/* KPI 4: Alertas de Vencimiento de Certificados */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">
                Alertas de Vencimiento
              </span>
              <span className={`text-4xl font-black block mt-2 ${expiringCertificates.length > 0 ? 'text-rose-500' : 'text-slate-900'}`}>
                {expiringCertificates.length}
              </span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-md inline-block mt-3 ${
                expiringCertificates.length > 0 ? 'bg-rose-50 text-rose-700 animate-pulse' : 'bg-emerald-50 text-emerald-700'
              }`}>
                {expiringCertificates.length > 0 ? 'Certificados < 30 Días' : 'Certificados Vigentes'}
              </span>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              expiringCertificates.length > 0
                ? 'bg-rose-50 text-rose-600 group-hover:bg-rose-500 group-hover:text-white'
                : 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white'
            }`}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-50 text-xs text-slate-500">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Renovación Documental GACP</span>
            <div className="space-y-1.5 mt-2">
              {expiringCertificates.length > 0 ? (
                expiringCertificates.slice(0, 2).map(b => (
                  <div key={b.id} className="flex justify-between items-center text-[10px] font-bold text-slate-600">
                    <span className="truncate max-w-[120px]">Lote: {b.batchCode}</span>
                    <span className="text-rose-600">
                      Vence: {new Date(b.certificateExpiryDate!).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-600 mt-2">
                  <span>Estado Documental:</span>
                  <span className="text-emerald-600 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Conforme
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Sección Gráfica de Rendimiento y Actividades GACP */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Gráfico 1: Actividades Completadas por Mes (Bars) */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest block mb-1">
                Volumen Técnico Agrario
              </span>
              <h3 className="text-base font-black text-slate-100 flex items-center gap-2">
                Tareas Verificadas por Mes
              </h3>
              <p className="text-xs text-slate-400 font-medium">Volumen acumulado de actividades agronómicas auditadas bajo GACP</p>
            </div>
            <span className="text-[9px] bg-slate-800/80 border border-slate-700/60 text-slate-300 font-mono font-bold px-2 py-1 rounded-lg">
              Checklists
            </span>
          </div>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 15, right: 5, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="mes" stroke="#94a3b8" fontSize={11} fontWeight="bold" />
                <YAxis stroke="#94a3b8" fontSize={11} fontWeight="bold" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '14px', border: '1px solid #334155', fontSize: '12px', color: '#f8fafc' }}
                  labelStyle={{ fontWeight: 'bold', color: '#10b981' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8' }} />
                <Bar name="Tareas Conformes" dataKey="conforme" fill="#10b981" radius={[5, 5, 0, 0]} />
                <Bar name="Total Actividades" dataKey="completadas" fill="#38bdf8" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico 2: Rendimiento y Cumplimiento de Calidad (Line) */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <span className="text-[10px] text-indigo-400 font-extrabold uppercase tracking-widest block mb-1">
                Estándares Farmacéuticos
              </span>
              <h3 className="text-base font-black text-slate-100 flex items-center gap-2">
                Conformidad GACP / GMP (%)
              </h3>
              <p className="text-xs text-slate-400 font-medium">Línea de tendencia del índice de cumplimiento técnico de calidad</p>
            </div>
            <span className="text-[9px] bg-slate-800/80 border border-slate-700/60 text-slate-300 font-mono font-bold px-2 py-1 rounded-lg">
              QA Index
            </span>
          </div>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 15, right: 5, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="mes" stroke="#94a3b8" fontSize={11} fontWeight="bold" />
                <YAxis domain={[70, 100]} stroke="#94a3b8" fontSize={11} fontWeight="bold" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '14px', border: '1px solid #334155', fontSize: '12px', color: '#f8fafc' }}
                  labelStyle={{ fontWeight: 'bold', color: '#6366f1' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8' }} />
                <Line
                  name="Calificación Promedio (%)"
                  type="monotone"
                  dataKey="rendimiento"
                  stroke="#6366f1"
                  strokeWidth={3}
                  activeDot={{ r: 8 }}
                  dot={{ r: 4, stroke: '#6366f1', strokeWidth: 2, fill: '#0f172a' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Historial Detallado de Alertas GACP de Cumplimiento Pendientes */}
      <div className="bg-slate-900 text-white rounded-3xl overflow-hidden shadow-xl border border-slate-800">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-gradient-to-r from-slate-950 to-slate-900">
          <div>
            <span className="text-[9px] font-black tracking-widest text-emerald-400 uppercase">
              CONSOLA DE CONTROL DE CALIDAD
            </span>
            <h3 className="text-base font-black tracking-tight mt-1">Alertas Regulatorias Pendientes</h3>
          </div>
          <span className="text-xs bg-slate-800 text-slate-100 rounded-lg px-3 py-1 font-mono font-bold">
            Auditadas Hoy
          </span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {displayAlerts.map((alert) => (
            <div key={alert.id} className="p-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between hover:bg-slate-950/40 transition-colors">
              <div className="flex items-start gap-3.5">
                <span className={`px-2 py-0.5 rounded-md font-black text-[9px] tracking-widest mt-1 uppercase text-center min-w-[75px] shrink-0 ${
                  alert.criticality === 'CRITICAL' 
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {alert.criticality}
                </span>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-black text-slate-200 uppercase tracking-wide">{alert.code}</span>
                    <span className="text-[10px] text-slate-500 font-bold">• Lote: {alert.batchCode}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">
                    {alert.desc}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto self-end md:self-center justify-end">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">ALCOA+ Log</span>
                <button className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] transition-all tracking-wide">
                  Sanar Alerta
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Módulo de Integración IoT Robusto */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(circle_at_80%_20%,#0f766e,transparent_50%)] pointer-events-none z-0 opacity-20"></div>
        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[9px] font-black tracking-widest text-emerald-400 uppercase">
                IoT CORE INTEGRATION
              </span>
              <h3 className="text-xl font-black tracking-tight mt-1">Telemetría en Tiempo Real</h3>
              <p className="text-xs text-slate-400 mt-1">Sensores desplegados en red mesh para monitoreo crítico GACP.</p>
            </div>
            {batches.length > 0 && (
              <div className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-300">
                  Lote Activo: {batches[0].batchCode}
                </span>
              </div>
            )}
          </div>
          <div className="-mx-6 px-6 overflow-x-auto pb-4">
            <div className="min-w-[800px]">
              <TelemetryGrid greenhouseId={batches.length > 0 ? batches[0].id : 'demo-greenhouse'} />
            </div>
          </div>
        </div>
      </div>

      {/* Componente de Semáforo de Cumplimiento GACP/GMP */}
      <SemaforoCumplimiento />

      {/* Módulo de Inventario Orgánico / Bioinsumos */}
      <BioinsumosModule />

      {/* Visualización Detallada y Gestión del Tracker de Cumplimiento GACP/GMP */}
      <div className="pt-4">
        <ComplianceTracker />
      </div>

      {/* Módulo de Calendario Operativo y Labores */}
      <ActividadesModule />
      
      {/* Panel de Auditoría Especialista GACP/GMP */}
      <div className="pt-4" id="audits">
        <AuditorDashboard />
      </div>
    </div>
  );
};
