import React, { useState } from 'react';
import { useComplianceStore } from '../../store';

interface AuditDetailViewProps {
  batch: any;
  onClose: () => void;
}

export const AuditDetailView: React.FC<AuditDetailViewProps> = ({ batch, onClose }) => {
  const [isSigned, setIsSigned] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const { addAuditLog } = useComplianceStore();

  if (!batch) return null;

  const handleSign = () => {
    if (pin.length === 4) {
      setIsSigned(true);
      setShowPinModal(false);
      setPin('');
      addAuditLog('SIGNATURE', 'Certificación validada digitalmente', 'TÉC-048-AG', batch.batchCode);
    } else {
      alert('Por favor, introduzca un PIN de 4 dígitos.');
    }
  };

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setPhotos(prev => [...prev, url]);
      addAuditLog('CREATION', 'Fotografía de evidencia capturada', 'Auditor de Sistema', batch.batchCode);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-[#0A1128] h-full border-l border-[#1A2642] shadow-2xl flex flex-col animate-slide-in-right overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-[#1A2642] flex justify-between items-start bg-[#060B19] sticky top-0 z-10">
          <div>
            <span className="text-[10px] text-blue-400 font-extrabold uppercase tracking-widest block mb-1">
              Desglose de Auditoría
            </span>
            <h3 className="text-xl font-black text-white">{batch.batchCode}</h3>
            <p className="text-sm text-slate-400 font-medium">{batch.variety}</p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#1A2642] text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            title="Cerrar panel"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 flex-1 flex flex-col gap-8">
          {/* Status Header */}
          <div className={`p-4 rounded-xl border ${batch.status.bg} border-${batch.status.color}/30 flex items-center gap-3`}>
            <span className={`w-3 h-3 rounded-full ${batch.status.color} animate-pulse shadow-[0_0_8px_currentColor]`}></span>
            <div>
              <div className={`text-sm font-black uppercase ${batch.status.text}`}>
                {batch.status.label}
              </div>
              <div className="text-xs text-slate-400 mt-1">Dictamen automatizado del sistema</div>
            </div>
          </div>

          {/* Insumos */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 border-b border-[#1A2642] pb-2">Historial de Insumos</h4>
            <div className="flex flex-col gap-3">
              {batch.appliedInputs.map((input: any, idx: number) => (
                <div key={idx} className="bg-[#111A3A] border border-[#1A2642] p-3 rounded-lg flex justify-between items-center">
                  <div>
                    <div className="text-xs text-white font-semibold flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${input.isGacpCompliant ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                      {input.name}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">Aplicado el: {input.appliedAt}</div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${input.isGacpCompliant ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                      {input.isGacpCompliant ? 'CONFORME' : 'RIESGO'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Documentos */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 border-b border-[#1A2642] pb-2">Documentos de Cumplimiento</h4>
            <div className="flex flex-col gap-3">
              <div className="bg-[#111A3A] border border-[#1A2642] p-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-white font-medium">BPA / GACP Checklist</div>
                    <div className="text-[10px] text-slate-500">
                      {batch.documentationComplete ? 'Anexo completo y firmado' : 'Pendiente de cierre'}
                    </div>
                  </div>
                </div>
                {batch.documentationComplete ? (
                  <span className="text-emerald-400 font-bold text-xs">✓</span>
                ) : (
                  <span className="text-amber-400 font-bold text-[10px]">PENDIENTE</span>
                )}
              </div>

              <div className="bg-[#111A3A] border border-[#1A2642] p-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-purple-500/10 text-purple-400 flex items-center justify-center">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs text-white font-medium">COA Laboratorio Analítico</div>
                    <div className="text-[10px] text-slate-500">
                      {batch.labTestsPassed ? 'Resultados sin trazas' : 'En espera de resultados'}
                    </div>
                  </div>
                </div>
                {batch.labTestsPassed ? (
                  <span className="text-emerald-400 font-bold text-xs">Aprobado</span>
                ) : (
                  <span className="text-slate-500 font-bold text-[10px]">N/A</span>
                )}
              </div>
            </div>
          </div>

          {/* Fotografías del Cultivo */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 border-b border-[#1A2642] pb-2">Fotografías del Cultivo</h4>
            <div className="flex flex-col gap-3">
              <input 
                type="file" 
                accept="image/*" 
                capture="environment" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handlePhotoCapture} 
              />
              <button 
                className="w-full py-3 rounded-xl bg-[#111A3A] border border-dashed border-[#1A2642] hover:border-blue-500 hover:bg-[#1A2642] text-slate-300 font-bold text-sm transition-all flex items-center justify-center gap-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Capturar Fotografía
              </button>
              {photos.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {photos.map((photo, idx) => (
                    <div key={idx} className="aspect-square rounded-lg bg-[#111A3A] border border-[#1A2642] overflow-hidden relative">
                      <img src={photo} alt="Cultivo" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Firma técnico */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4 border-b border-[#1A2642] pb-2">Responsable Técnico</h4>
            {isSigned ? (
              <div className="bg-[#060B19] p-4 rounded-xl border border-emerald-500/30 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Firmado digitalmente
                  </div>
                  <div className="text-xs font-mono text-blue-400 tracking-wider">TÉC-048-AG</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white text-sm">JS</div>
                  <div>
                    <div className="text-sm font-bold text-white">Javier Santos</div>
                    <div className="text-[10px] text-slate-500">Agrónomo Jefe de Cultivo</div>
                  </div>
                </div>
                <div className="mt-2 text-[10px] text-slate-500 italic">
                  Declaración jurada de cumplimiento de buenas prácticas bajo la normativa estándar {batch.complianceStandard}.
                </div>
              </div>
            ) : (
              <div className="bg-[#111A3A] p-6 rounded-xl border border-dashed border-[#1A2642] flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <p className="text-xs text-slate-400 text-center">Requiere firma digital para certificar cumplimiento GACP</p>
                <button 
                  className="px-4 py-2 mt-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition-colors shadow-lg shadow-blue-500/20"
                  onClick={() => setShowPinModal(true)}
                >
                  Firmar Electrónicamente
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-6 border-t border-[#1A2642] bg-[#060B19] flex flex-col gap-3">
          <button 
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            onClick={() => alert('Generando informe PDF...')}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Generar Reporte PDF
          </button>
          <button 
            className="w-full py-3 rounded-xl bg-[#0A1128] border border-blue-500/30 hover:border-blue-400 text-blue-400 font-bold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            onClick={() => alert('Generando Código QR de Trazabilidad...')}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zm12 3h4v4h-4z" />
            </svg>
            Generar Código QR
          </button>
          <button 
            className="w-full py-3 rounded-xl bg-[#1A2642] hover:bg-[#2A3B5C] text-white font-bold text-sm transition-all active:scale-[0.98]"
            onClick={onClose}
          >
            Cerrar Expediente
          </button>
        </div>
      </div>

      {/* PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm" onClick={() => setShowPinModal(false)}>
          <div className="bg-[#0A1128] border border-[#1A2642] p-8 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col items-center animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Firma Digital</h3>
            <p className="text-sm text-slate-400 text-center mb-6">Ingrese su PIN de 4 dígitos para certificar el lote según el estándar GACP.</p>
            
            <input 
              type="password" 
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
              className="w-full bg-[#111A3A] border border-[#1A2642] rounded-xl px-4 py-3 text-center text-2xl font-mono text-white tracking-[1em] focus:outline-none focus:border-blue-500 transition-colors mb-6"
              placeholder="••••"
              autoFocus
            />

            <div className="flex gap-3 w-full">
              <button 
                className="flex-1 py-3 rounded-xl bg-[#1A2642] hover:bg-[#2A3B5C] text-white font-bold text-sm transition-colors"
                onClick={() => setShowPinModal(false)}
              >
                Cancelar
              </button>
              <button 
                className={`flex-1 py-3 rounded-xl font-bold text-sm transition-colors shadow-lg ${pin.length === 4 ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20' : 'bg-[#1A2642] text-slate-500 cursor-not-allowed'}`}
                onClick={handleSign}
                disabled={pin.length !== 4}
              >
                Autorizar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
