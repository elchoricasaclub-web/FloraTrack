import React, { useState, useEffect } from 'react';
import { validateRequired } from '../../utils/validators';

export interface TareaAgricola {
  id: string;
  cultivoId: string;
  loteId: string;
  tipo: 'Riego' | 'Fertilización' | 'Poda' | 'Cosecha' | 'Control de Plagas' | 'Inspección ALCOA+';
  fechaProgramada: string;
  estado: 'Pendiente' | 'En Progreso' | 'Completada' | 'Atrasada';
  asignadoA: string;
  notas: string;
}

export const ActividadesModule: React.FC = () => {
  const [tareas, setTareas] = useState<TareaAgricola[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<TareaAgricola>>({
    tipo: 'Inspección ALCOA+',
    estado: 'Pendiente'
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleValidationAndSave = () => {
    setErrorMsg(null);

    const tipoErr = validateRequired(formData.tipo, 'Tipo de Labor');
    const loteErr = validateRequired(formData.loteId, 'Lote Destino');
    const fechaErr = validateRequired(formData.fechaProgramada, 'Fecha Programada');
    const asigErr = validateRequired(formData.asignadoA, 'Responsable Asignado');

    if (tipoErr) return setErrorMsg(tipoErr);
    if (loteErr) return setErrorMsg(loteErr);
    if (fechaErr) return setErrorMsg(fechaErr);
    if (asigErr) return setErrorMsg(asigErr);

    const fechaProg = new Date(formData.fechaProgramada!);
    if (isNaN(fechaProg.getTime())) {
      return setErrorMsg("Formato de fecha inválido.");
    }

    const newTarea: TareaAgricola = {
      id: `TASK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      cultivoId: formData.cultivoId || 'N/A',
      loteId: formData.loteId!,
      tipo: formData.tipo as any,
      fechaProgramada: formData.fechaProgramada!,
      estado: formData.estado as any,
      asignadoA: formData.asignadoA!,
      notas: formData.notas || '',
    };

    setTareas(prev => [...prev, newTarea]);
    setShowForm(false);
    setFormData({ tipo: 'Inspección ALCOA+', estado: 'Pendiente' });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl w-full mt-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-widest block mb-1">
            Operaciones de Campo
          </span>
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            Calendario de Labores Agrícolas
          </h3>
          <p className="text-xs text-slate-400 font-medium">Asignación de tareas operativas y monitoreo de ejecución referenciada</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl transition shadow-lg shadow-cyan-500/20 active:scale-95"
        >
          {showForm ? '× Cerrar Panel' : 'Programar Labor'}
        </button>
      </div>

      {showForm && (
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 mb-6">
          {errorMsg && (
            <div className="mb-4 p-3 bg-rose-950/40 border border-rose-900/50 rounded-xl text-[11px] font-bold text-rose-400 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              No se pudo programar. {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Tipo de Labor *</label>
              <select 
                value={formData.tipo}
                onChange={e => setFormData({...formData, tipo: e.target.value as any})}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-medium focus:ring-cyan-500 focus:border-cyan-500"
              >
                <option value="Riego">Riego</option>
                <option value="Fertilización">Fertilización</option>
                <option value="Poda">Poda</option>
                <option value="Cosecha">Cosecha</option>
                <option value="Control de Plagas">Control de Plagas</option>
                <option value="Inspección ALCOA+">Inspección GACP / ALCOA+</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Responsable *</label>
              <input 
                type="text" 
                value={formData.asignadoA || ''}
                onChange={e => setFormData({...formData, asignadoA: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="Nombre o ID Operario"
              />
            </div>
            
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Fecha Programada *</label>
              <input 
                type="date" 
                value={formData.fechaProgramada || ''}
                onChange={e => setFormData({...formData, fechaProgramada: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white [color-scheme:dark] focus:ring-cyan-500 focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Lote / Ubicación *</label>
              <input 
                type="text" 
                value={formData.loteId || ''}
                onChange={e => setFormData({...formData, loteId: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="Ej. Lote 02 - Invernadero Norte"
              />
            </div>
            <div className="md:col-span-2">
               <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Notas / Instrucciones</label>
               <textarea
                  value={formData.notas || ''}
                  onChange={e => setFormData({...formData, notas: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:ring-cyan-500 focus:border-cyan-500 min-h-[80px]"
                  placeholder="Detalles sobre las dosis, elementos extra..."
               />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button 
              onClick={handleValidationAndSave}
              className="py-2.5 px-6 bg-white hover:bg-slate-200 text-slate-900 border border-transparent font-black text-xs rounded-xl transition flex items-center justify-center gap-2"
            >
              Agregar al Calendario
            </button>
          </div>
        </div>
      )}

      {tareas.length === 0 ? (
        <div className="border border-slate-800 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-slate-950 text-cyan-400 rounded-full flex items-center justify-center mb-4 border border-slate-800">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h4 className="text-white font-bold mb-1">Sin Labores Programadas</h4>
          <p className="text-slate-400 text-sm max-w-sm mb-4">El equipo no tiene operaciones programadas. Agrega una tarea para delegar responsabilidades al personal de campo o supervisores.</p>
          <button 
            onClick={() => setShowForm(true)}
            className="text-xs text-cyan-400 font-bold hover:text-cyan-300 underline underline-offset-4"
          >
            Programar Tarea
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-950 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">Labor / Tarea</th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">Lote Destino</th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">Responsable</th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">Estado</th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">Fecha Ejecución</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 relative text-slate-300 font-medium">
              {tareas.map(tarea => (
                <tr key={tarea.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-100">{tarea.tipo}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{tarea.id}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {tarea.loteId}
                  </td>
                  <td className="px-4 py-3 text-cyan-200">
                    {tarea.asignadoA}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${tarea.estado === 'Pendiente' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                      {tarea.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">
                    {tarea.fechaProgramada}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
