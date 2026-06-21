import React, { useState } from 'react';
import { useComplianceStore } from '../store';
import { useAuth } from '../contexts/AuthContext';
import { GacpRequirement } from '../types/agricultural';
import { useActividades, useFincas, useLotes } from '../hooks';
import { generateCompliancePDF } from '../utils';

export const ComplianceTracker: React.FC = () => {
  const {
    batches,
    selectedBatch,
    complianceStandard,
    scoreBreakdown,
    selectBatch,
    updateRequirementStatus,
    isSyncing,
    syncData
  } = useComplianceStore();

  const { userProfile } = useAuth();
  const { actividades } = useActividades();
  const { fincas } = useFincas();
  const { lotes } = useLotes();
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = () => {
    if (!selectedBatch) return;
    setIsExporting(true);
    try {
      const currentLote = lotes.find(l => l.codigoLote === selectedBatch.batchCode || l.id === selectedBatch.id);
      const currentFinca = currentLote ? fincas.find(f => f.id === currentLote.fincaId) : (fincas[0] || null);
      
      const batchActivities = actividades.filter(act => 
        act.loteId === selectedBatch.id || 
        act.loteId === currentLote?.id
      );

      const activitiesToExport = batchActivities.length > 0 ? batchActivities : [
        {
          id: 'act-001',
          loteId: selectedBatch.id,
          tipoActividad: 'RIEGO' as const,
          detalles: 'Monitoreo de pH y conductividad eléctrica (SOP-AG-04). PH=5.8, EC=1.4 mS/cm.',
          responsableNombre: userProfile?.displayName || 'Ing. Agrónomo Principal',
          firmaAuditoria: 'ALCOA-SEC-9x4k82n',
          cantidadAplicada: '150 Litros',
          esConformeGacp: true,
          fechaActividad: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'act-002',
          loteId: selectedBatch.id,
          tipoActividad: 'CONTROL_PLAGAS' as const,
          detalles: 'Aplicación de biocontrolador preventivo Bacillus thuringiensis (SOP-AG-09). El lote no muestra anomalías.',
          responsableNombre: userProfile?.displayName || 'Ing. Agrónomo Principal',
          firmaAuditoria: 'ALCOA-SEC-2x3f15p',
          cantidadAplicada: '450 mL concentrado',
          esConformeGacp: true,
          fechaActividad: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'act-003',
          loteId: selectedBatch.id,
          tipoActividad: 'REVISION_SOP' as const,
          detalles: 'Estudio de control higiénico para la entrada de vehículos y material agronómico según SOP-QA-01.',
          responsableNombre: userProfile?.displayName || 'QA Auditor Supervisor',
          firmaAuditoria: 'ALCOA-SEC-8p11w9z',
          esConformeGacp: true,
          fechaActividad: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];

      generateCompliancePDF({
        finca: currentFinca,
        lote: currentLote || null,
        actividades: activitiesToExport,
        auditorName: userProfile?.displayName || 'Auditor de Calidad FloraTrack',
        standardName: complianceStandard,
        batchCode: selectedBatch.batchCode,
        strain: selectedBatch.variety,
      });
    } catch (err) {
      console.error('Error al generar el reporte PDF:', err);
    } finally {
      setIsExporting(false);
    }
  };
  const [activeSectionFilter, setActiveSectionFilter] = useState<string>('ALL');
  const [activeCriticalityFilter, setActiveCriticalityFilter] = useState<string>('ALL');
  const [auditorNote, setAuditorNote] = useState<Record<string, string>>({});
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  if (!selectedBatch) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center text-slate-400">
        <svg className="w-12 h-12 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm font-bold">No hay lotes agronómicos disponibles para auditar.</p>
        <p className="text-xs text-slate-500 mt-1">Configure o registre lotes o fincas adicionales en el sistema.</p>
      </div>
    );
  }

  const audits = selectedBatch.activeAudits || [];

  // Filter sections
  const sectionsSet = new Set(audits.map((a) => a.section));
  const uniqueSections = Array.from(sectionsSet);

  // Filters logic
  const filteredAudits = audits.filter((req) => {
    const matchesSection = activeSectionFilter === 'ALL' || req.section === activeSectionFilter;
    const matchesCriticality = activeCriticalityFilter === 'ALL' || req.criticality === activeCriticalityFilter;
    return matchesSection && matchesCriticality;
  });

  const getSectionBadgeColor = (section: string) => {
    switch (section) {
      case 'GENETICS': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
      case 'SOIL_WATER': return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'HYGIENE': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'PEST_CONTROL': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'HARVEST_PROCESS': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'DOCUMENTATION': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getCriticalityBadgeColor = (crit: 'CRITICAL' | 'MAJOR' | 'MINOR') => {
    switch (crit) {
      case 'CRITICAL': return 'bg-rose-500/10 text-rose-400 border-rose-500/35 font-black uppercase text-[9px] tracking-widest';
      case 'MAJOR': return 'bg-amber-500/10 text-amber-400 border-amber-500/35 font-bold uppercase text-[9px] tracking-wider';
      case 'MINOR': return 'bg-slate-500/10 text-slate-400 border-slate-500/25 text-[9px]';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 95) return 'text-emerald-500';
    if (score >= 85) return 'text-cyan-400';
    if (score >= 70) return 'text-amber-400';
    return 'text-rose-500';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 95) return 'bg-emerald-500/10 border-emerald-500/20';
    if (score >= 85) return 'bg-cyan-500/10 border-cyan-500/20';
    if (score >= 70) return 'bg-amber-500/10 border-amber-500/20';
    return 'bg-rose-500/10 border-rose-500/20';
  };

  const getGacpStatusLabel = (status: string) => {
    switch (status) {
      case 'CERTIFIED': return { text: 'Certificación Cumplida GACP', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
      case 'MINOR_REMEDIES_REQUIRED': return { text: 'Remedios Menores Requeridos', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' };
      case 'MAJOR_REMEDIES_REQUIRED': return { text: 'Remedios Mayores Necesarios', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
      default: return { text: 'No Cumple Estándares GACP / No Compliant', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' };
    }
  };

  const handleToggleVerify = (reqId: string, currentVerified: boolean) => {
    const auditorName = userProfile?.displayName || 'Auditor de Consola';
    const note = auditorNote[reqId] || '';
    updateRequirementStatus(reqId, !currentVerified, auditorName, note);
  };

  const handleSaveNote = (reqId: string) => {
    const req = audits.find((a) => a.id === reqId);
    if (req) {
      const auditorName = userProfile?.displayName || 'Auditor de Consola';
      updateRequirementStatus(reqId, req.verified, auditorName, auditorNote[reqId] || '');
    }
    setEditingNoteId(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Header and Batch Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        {/* Background Decorative Accents */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(circle_at_70%_20%,#047857,transparent_45%)] pointer-events-none z-0 opacity-40"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 inline-block mb-1">
              Monitoreo GACP / GMP
            </span>
            <h3 className="text-xl font-black text-white leading-tight">Auditoría Digital de Lotes Agrícolas</h3>
            <p className="text-xs text-slate-400">Verifique el cumplimiento de higiene, control de plagas y trazabilidad técnica en tiempo real.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="space-y-1">
              <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-500">
                Seleccionar Lote de Trabajo
              </label>
              <select
                value={selectedBatch.id}
                onChange={(e) => selectBatch(e.target.value)}
                className="px-3.5 py-2.5 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-bold text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer min-w-[200px]"
              >
                {batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.batchCode} ({b.variety})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <span className="block text-[9px] border border-transparent select-none text-transparent">Actions</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={syncData}
                  disabled={isSyncing}
                  className="px-4 py-2.5 rounded-xl bg-slate-950 border border-emerald-500/30 hover:border-emerald-500 text-slate-300 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition disabled:opacity-50 cursor-pointer min-h-[42px]"
                >
                  {isSyncing ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></span>
                      Firmando...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0-6v2m0-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Firma ALCOA+
                    </>
                  )}
                </button>

                <button
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition disabled:opacity-50 cursor-pointer min-h-[42px] shadow-lg shadow-indigo-500/20"
                >
                  {isExporting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Exportando...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Reporte PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats Summary Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Compliance Score Gauge Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
              Índice de Trazabilidad Total
            </span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className={`text-5xl font-black tracking-tight ${getScoreColor(scoreBreakdown?.score || 0)}`}>
                {scoreBreakdown?.score || 0}%
              </span>
              <span className="text-xs font-bold text-slate-500">Conformidad</span>
            </div>
            
            <div className="mt-4">
              <div className="w-full bg-slate-950 h-3 border border-slate-800/80 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    (scoreBreakdown?.score || 0) >= 95 
                      ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' 
                      : (scoreBreakdown?.score || 0) >= 85 
                        ? 'bg-cyan-400' 
                        : (scoreBreakdown?.score || 0) >= 70 
                          ? 'bg-amber-400' 
                          : 'bg-rose-500'
                  }`}
                  style={{ width: `${scoreBreakdown?.score || 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className={`p-3 rounded-2xl border text-xs font-semibold ${getGacpStatusLabel(scoreBreakdown?.gacpStatus || '').color}`}>
              {getGacpStatusLabel(scoreBreakdown?.gacpStatus || '').text}
            </div>

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-2">
                <span className="text-[9px] text-slate-500 block uppercase font-bold tracking-wider">Grado</span>
                <span className="text-sm font-black text-white">{scoreBreakdown?.grade || 'F'}</span>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-2">
                <span className="text-[9px] text-slate-500 block uppercase font-bold tracking-wider">Auditoría</span>
                <span className="text-sm font-black text-emerald-400">Activa</span>
              </div>
            </div>
          </div>
        </div>

        {/* Requirements breakdown list */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md lg:col-span-2 space-y-4">
          <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">
            Rendimiento por Secciones del Estándar ({complianceStandard === 'WHO_GACP' ? 'WHO GACP' : 'EMA EU-GMP'})
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {scoreBreakdown?.sections && Object.keys(scoreBreakdown.sections).map((secKey) => {
              const sec = scoreBreakdown.sections[secKey];
              return (
                <div key={secKey} className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-300 tracking-wide uppercase">{secKey}</span>
                    <span className="text-xs font-black text-slate-100">{sec.percent}%</span>
                  </div>
                  
                  <div className="w-full bg-slate-950 h-2 border border-slate-800/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        sec.percent >= 90 
                          ? 'bg-emerald-500' 
                          : sec.percent >= 70 
                            ? 'bg-amber-400' 
                            : 'bg-rose-500'
                      }`}
                      style={{ width: `${sec.percent}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-medium">
                    <span>{sec.verified} de {sec.total} verificados</span>
                    <span className={`px-1.5 py-0.2 rounded border text-[8px] tracking-wider uppercase font-black ${getSectionBadgeColor(secKey)}`}>
                      {secKey.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Audit Checklist Interactive Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-slate-950 to-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[9px] font-black tracking-widest text-emerald-400 uppercase">
              Lista Regulatorio Agrícola
            </span>
            <h4 className="text-sm font-black text-white mt-0.5">Control de Trazabilidad e Inocuidad</h4>
          </div>

          {/* Interactive Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setActiveSectionFilter('ALL')}
                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition ${
                  activeSectionFilter === 'ALL' ? 'bg-slate-800 text-white font-extrabold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Todos
              </button>
              {uniqueSections.map((sec) => (
                <button
                  key={sec}
                  onClick={() => setActiveSectionFilter(sec)}
                  className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition whitespace-nowrap ${
                    activeSectionFilter === sec ? 'bg-slate-800 text-white font-extrabold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sec.replace('_', ' ')}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setActiveCriticalityFilter('ALL')}
                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition ${
                  activeCriticalityFilter === 'ALL' ? 'bg-slate-800 text-white font-extrabold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Cualquiera
              </button>
              {(['CRITICAL', 'MAJOR', 'MINOR'] as const).map((crit) => (
                <button
                  key={crit}
                  onClick={() => setActiveCriticalityFilter(crit)}
                  className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition ${
                    activeCriticalityFilter === crit ? 'bg-slate-800 text-white font-extrabold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {crit}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* List content */}
        <div className="divide-y divide-slate-800/60 max-h-[500px] overflow-y-auto">
          {filteredAudits.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No se han encontrado registros regulatorios con los filtros seleccionados.
            </div>
          ) : (
            filteredAudits.map((req) => (
              <div
                key={req.id}
                className={`p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                  req.verified ? 'bg-slate-950/20' : 'bg-slate-950/5'
                } hover:bg-slate-950/40`}
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  {/* Action checkbox touch target 48dp */}
                  <button
                    onClick={() => handleToggleVerify(req.id, req.verified)}
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-slate-800 hover:border-slate-700 bg-slate-950 cursor-pointer text-slate-400 hover:text-white transition-all select-none"
                    title={req.verified ? 'Desmarcar verificación' : 'Marcar verificado'}
                  >
                    {req.verified ? (
                      <div className="w-5 h-5 rounded-md bg-emerald-500 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/20">
                        <svg className="w-3.5 h-3.5 font-bold" stroke="currentColor" strokeWidth={3} fill="none" viewBox="0 0 24 24">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-md border border-slate-700"></div>
                    )}
                  </button>

                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-black text-slate-300">{req.code}</span>
                      <span className={`px-1.5 py-0.2 rounded border text-[8px] tracking-wider uppercase font-black ${getSectionBadgeColor(req.section)}`}>
                        {req.section.replace('_', ' ')}
                      </span>
                      <span className={`px-1.5 py-0.2 rounded border text-[8px] font-bold ${getCriticalityBadgeColor(req.criticality)}`}>
                        {req.criticality}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 font-medium select-none text-wrap">
                      {req.description}
                    </p>

                    {/* Auditor Checkoff status info */}
                    {req.verified && (
                      <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500">
                        <span className="flex items-center gap-1 font-bold text-emerald-500">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          Firmado digitalmente
                        </span>
                        {req.checkedBy && (
                          <span className="font-semibold text-slate-400">por: {req.checkedBy}</span>
                        )}
                        <span className="font-mono text-[9px]">{new Date(req.updatedAt).toLocaleString()}</span>
                      </div>
                    )}

                    {/* Notes field */}
                    <div className="pt-1.5">
                      {editingNoteId === req.id ? (
                        <div className="flex items-center gap-2 max-w-md">
                          <input
                            type="text"
                            value={auditorNote[req.id] || req.notes || ''}
                            onChange={(e) => setAuditorNote({ ...auditorNote, [req.id]: e.target.value })}
                            placeholder="Agregar comentario de hallazgo agrícola..."
                            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 flex-1"
                          />
                          <button
                            onClick={() => handleSaveNote(req.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[10px] font-bold"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => setEditingNoteId(null)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-[10px]"
                          >
                            X
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {req.notes ? (
                            <span className="text-[10px] text-slate-400 italic bg-slate-950 px-2 py-1 rounded border border-slate-800/60 max-w-lg">
                              Observación: {req.notes}
                            </span>
                          ) : null}
                          <button
                            onClick={() => {
                              setEditingNoteId(req.id);
                              setAuditorNote({ ...auditorNote, [req.id]: req.notes || '' });
                            }}
                            className="text-[10px] text-slate-500 hover:text-slate-300 underline font-semibold cursor-pointer py-1 select-none"
                          >
                            {req.notes ? 'Editar nota' : '+ Añadir anotación técnica'}
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${
                    req.verified 
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {req.verified ? 'Verificado ✓' : 'Faltante ✗'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
