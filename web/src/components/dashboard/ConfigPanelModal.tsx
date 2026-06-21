import React, { useState } from 'react';

interface ConfigPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConfigPanelModal: React.FC<ConfigPanelModalProps> = ({ isOpen, onClose }) => {
  const [alertThresholds, setAlertThresholds] = useState<number[]>([3, 7, 15]);
  const [selectedThreshold, setSelectedThreshold] = useState<number>(7);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-[#0A1128] border border-[#1A2642] p-8 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Configuración</h3>
            <p className="text-xs text-slate-400">Alertas GACP</p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm text-slate-300 font-bold mb-3">
            Notificar vencimiento documental antes de:
          </label>
          <div className="flex gap-3">
            {alertThresholds.map((days) => (
              <button
                key={days}
                onClick={() => setSelectedThreshold(days)}
                className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors border ${
                  selectedThreshold === days 
                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' 
                    : 'bg-[#111A3A] border-[#1A2642] text-slate-400 hover:text-white'
                }`}
              >
                {days} días
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-3">
            Se enviará una notificación a todos los responsables técnicos y auditores {selectedThreshold} días antes de que cualquier certificación caduque.
          </p>
        </div>

        <div className="flex gap-3">
          <button 
            className="flex-1 py-2.5 rounded-xl bg-[#1A2642] hover:bg-[#2A3B5C] text-white font-bold text-sm transition-colors"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button 
            className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-colors shadow-lg shadow-blue-500/20"
            onClick={() => {
              alert(`Configuración guardada: Alertas a los ${selectedThreshold} días.`);
              onClose();
            }}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};
