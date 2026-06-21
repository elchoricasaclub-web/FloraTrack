import React, { useState } from 'react';
import { validateRequired } from '../../utils/validators';

export interface Bioinsumo {
  id: string;
  name: string;
  activeIngredient: string;
  category: 'Fertilizante' | 'Pesticida Biológico' | 'Fungicida Orgánico' | 'Sustrato';
  quantity: number;
  unit: 'kg' | 'L' | 'g' | 'mL';
  gacpApproved: boolean;
  expirationDate: string;
}

export const BioinsumosModule: React.FC = () => {
  const [bioinsumos, setBioinsumos] = useState<Bioinsumo[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Bioinsumo>>({
    category: 'Fertilizante',
    unit: 'L',
    gacpApproved: true,
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleValidationAndSave = () => {
    // Phase 7: Validaciones Obligatorias
    setErrorMsg(null);

    const nameErr = validateRequired(formData.name, 'Nombre Comercial');
    const ingErr = validateRequired(formData.activeIngredient, 'Ingrediente Activo');
    const qtyErr = validateRequired(formData.quantity, 'Cantidad en Inventario');
    const expErr = validateRequired(formData.expirationDate, 'Fecha de Expiración');

    if (nameErr) return setErrorMsg(nameErr);
    if (ingErr) return setErrorMsg(ingErr);
    if (qtyErr) return setErrorMsg(qtyErr);
    if (expErr) return setErrorMsg(expErr);

    if (Number(formData.quantity) < 0) {
      return setErrorMsg("La cantidad en inventario no puede ser negativa.");
    }

    const expDate = new Date(formData.expirationDate!);
    if (isNaN(expDate.getTime())) {
      return setErrorMsg("Formato de fecha de caducidad no válido.");
    }

    const newBio: Bioinsumo = {
      id: `BIO-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      name: formData.name!,
      activeIngredient: formData.activeIngredient!,
      category: formData.category as any,
      quantity: Number(formData.quantity),
      unit: formData.unit as any,
      gacpApproved: formData.gacpApproved ?? false,
      expirationDate: formData.expirationDate!,
    };

    setBioinsumos((prev) => [...prev, newBio]);
    setShowForm(false);
    setFormData({ category: 'Fertilizante', unit: 'L', gacpApproved: true });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest block mb-1">
            Gestión Integrada
          </span>
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            Catálogo de Bioinsumos
          </h3>
          <p className="text-xs text-slate-400 font-medium">Control de inventario orgánico con requerimientos ALCOA+</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl transition shadow-lg shadow-emerald-500/20 active:scale-95"
        >
          {showForm ? '× Cerrar Panel' : 'Crear Bioinsumo'}
        </button>
      </div>

      {showForm && (
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 mb-6">
          <h4 className="text-sm font-bold text-white mb-4">Registro Estricto GACP</h4>
          
          {errorMsg && (
            <div className="mb-4 p-3 bg-rose-950/40 border border-rose-900/50 rounded-xl text-[11px] font-bold text-rose-400 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              No se puede guardar. {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Nombre Comercial *</label>
              <input 
                type="text" 
                value={formData.name || ''}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Ej. NeemXtract 500"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Ingrediente Activo *</label>
              <input 
                type="text" 
                value={formData.activeIngredient || ''}
                onChange={e => setFormData({...formData, activeIngredient: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Extracto de Neem 40%"
              />
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Cant. Total *</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={formData.quantity || ''}
                  onChange={e => setFormData({...formData, quantity: Number(e.target.value)})}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="0.0"
                />
              </div>
              <div className="w-1/3">
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Unidad</label>
                <select 
                  value={formData.unit || 'L'}
                  onChange={e => setFormData({...formData, unit: e.target.value as any})}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-medium focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="L">Litros (L)</option>
                  <option value="mL">Mililitros (mL)</option>
                  <option value="kg">Kilos (kg)</option>
                  <option value="g">Gramos (g)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Categoría</label>
              <select 
                value={formData.category || 'Fertilizante'}
                onChange={e => setFormData({...formData, category: e.target.value as any})}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-medium focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="Fertilizante">Fertilizante Orgánico</option>
                <option value="Pesticida Biológico">Pesticida Biológico (Biocontrol)</option>
                <option value="Fungicida Orgánico">Fungicida Orgánico</option>
                <option value="Sustrato">Mejorador de Suelo / Sustrato</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Fecha de Expiración *</label>
              <input 
                type="date" 
                value={formData.expirationDate || ''}
                onChange={e => setFormData({...formData, expirationDate: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-white [color-scheme:dark] focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            
            <div className="flex items-center pt-5">
              <label className="flex items-center cursor-pointer gap-3">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    className="sr-only"
                    checked={formData.gacpApproved}
                    onChange={e => setFormData({...formData, gacpApproved: e.target.checked})}
                  />
                  <div className={`w-10 h-6 rounded-full transition-colors ${formData.gacpApproved ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
                  <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.gacpApproved ? 'translate-x-4' : ''}`}></div>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-200">Aprobado para Protocolos GACP</span>
                  <p className="text-[9px] text-slate-500 mt-0.5 max-w-[200px]">Confirmar si el insumo carece de metales pesados o ingredientes sintéticos restringidos.</p>
                </div>
              </label>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button 
              onClick={handleValidationAndSave}
              className="py-2.5 px-6 bg-white hover:bg-slate-200 text-slate-900 border border-transparent font-black text-xs rounded-xl transition flex items-center justify-center gap-2"
            >
              Confirmar Ingreso en Inventario
            </button>
          </div>
        </div>
      )}

      {/* List / Empty State */}
      {bioinsumos.length === 0 ? (
        <div className="border border-slate-800 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-slate-950 text-emerald-400 rounded-full flex items-center justify-center mb-4 border border-slate-800">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h4 className="text-white font-bold mb-1">Sin Registros en Inventario</h4>
          <p className="text-slate-400 text-sm max-w-sm mb-4">Módulo de Bioinsumos y Agroquímicos orgánicos se encuentra vacío. Registra el primer Insumo para controlar lotes y aplicaciones.</p>
          <button 
            onClick={() => setShowForm(true)}
            className="text-xs text-emerald-400 font-bold hover:text-emerald-300 underline underline-offset-4"
          >
            Comenzar Captura
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-950 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">Código Interno</th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">Producto / Activo</th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">Categoría</th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider text-right">Existencias</th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider text-center">Cumple GACP</th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-wider">Vencimiento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 relative text-slate-300 font-medium">
              {bioinsumos.map(bio => (
                <tr key={bio.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="px-4 py-3 font-mono text-[11px] text-slate-500">{bio.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-100">{bio.name}</div>
                    <div className="text-[10px] text-slate-500">{bio.activeIngredient}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-emerald-400 border border-slate-700">
                      {bio.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-black text-white">{bio.quantity}</span> <span className="text-slate-500 font-normal">{bio.unit}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {bio.gacpApproved ? (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400">
                        ✓
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-rose-500/20 text-rose-400">
                        ×
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(bio.expirationDate) < new Date() ? (
                      <span className="text-rose-400 text-xs font-bold">VENCIDO ({bio.expirationDate})</span>
                    ) : (
                      <span className="text-slate-400">{bio.expirationDate}</span>
                    )}
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
