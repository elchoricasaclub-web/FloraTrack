import React, { ReactNode, useState } from 'react';
import { useAuth, ProtectedRoute } from '../contexts/AuthContext';
import { NotificationProvider } from '../contexts/NotificationContext';
import { RolUsuario, Finca, Lote, RegistroActividad } from '../types';
import { CultivationPhase } from '../types/agricultural';
import { DashboardSummary, GacpEvidenceCapture, ToastContainer, FarmDesigner } from '../components';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ComplianceStoreProvider, useComplianceStore } from '../store';

// ==========================================
// Subcomponente 1: Vista de Fincas (Fermas)
// ==========================================
const FincasView: React.FC = () => {
  const [fincas, setFincas] = useState<Finca[]>(() => {
    try {
      const saved = localStorage.getItem('flora_fincas');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'f-1',
        nombre: 'Finca Valle Esmeralda',
        ubicacion: 'Antioquia, COL (6.244° N, -75.589° W)',
        areaHectareas: 14.5,
        productorResponsable: 'Ing. Carlos Mendoza',
        registroCertificacion: 'GACP-COL-102',
        activo: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'f-2',
        nombre: 'Invernaderos Monte Verde',
        ubicacion: 'Cundinamarca, COL (4.609° N, -74.081° W)',
        areaHectareas: 8.2,
        productorResponsable: 'Dra. Sofía Restrepo',
        registroCertificacion: 'GACP-COL-105',
        activo: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'f-3',
        nombre: 'Hacienda El Dorado',
        ubicacion: 'Tolima, COL (4.438° N, -75.232° W)',
        areaHectareas: 22.0,
        productorResponsable: 'Ing. Mateo Gómez',
        registroCertificacion: 'GACP-COL-112',
        activo: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  });

  React.useEffect(() => {
    localStorage.setItem('flora_fincas', JSON.stringify(fincas));
  }, [fincas]);

  const [showForm, setShowForm] = useState(false);
  const [nombre, setNombre] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [area, setArea] = useState('');
  const [responsable, setResponsable] = useState('');
  const [cert, setCert] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const submitFinca = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!nombre.trim()) {
      setFormError('El nombre de la finca es obligatorio.');
      return;
    }
    if (!responsable.trim()) {
      setFormError('Debe asignar un Responsable Agrónomo o Productor.');
      return;
    }
    if (!area || Number(area) <= 0) {
      setFormError('Debe ingresar un área válida mayor a 0 hectáreas.');
      return;
    }

    const nueva: Finca = {
      id: `f-${Date.now()}`,
      nombre,
      ubicacion: ubicacion || 'Coordenadas No Asignadas',
      areaHectareas: Number(area) || 5,
      productorResponsable: responsable,
      registroCertificacion: cert || `GACP-SAAS-${Math.floor(Math.random() * 900) + 100}`,
      activo: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setFincas([...fincas, nueva]);
    setFormSuccess('¡Finca registrada exitosamente en el sistema!');
    setTimeout(() => {
      setFormSuccess('');
      setShowForm(false);
      setNombre('');
      setUbicacion('');
      setArea('');
      setResponsable('');
      setCert('');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Directorio de Fincas</h2>
          <p className="text-xs text-slate-500 mt-1">
            Administración centralizada de propiedades y registros de certificación bajo estándar internacional.
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setFormError('');
          }}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md shadow-emerald-500/10 flex items-center gap-1.5"
        >
          {showForm ? 'Regresar al Listado' : 'Registrar Nueva Finca'}
        </button>
      </div>

      {showForm ? (
        <form onSubmit={submitFinca} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 max-w-xl">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Detalles de Nueva Finca</h3>
          
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block mb-1">Nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                placeholder="Finca Valle Azul"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block mb-1">Ubicación / Georreferenciación</label>
              <input
                type="text"
                value={ubicacion}
                onChange={e => setUbicacion(e.target.value)}
                placeholder="Meta, COL (3.984° N, -73.081° W)"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block mb-1">Área (Hectáreas)</label>
                <input
                  type="number"
                  value={area}
                  onChange={e => setArea(e.target.value)}
                  placeholder="12.5"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block mb-1">Código Certificación GACP / GMP</label>
                <input
                  type="text"
                  value={cert}
                  onChange={e => setCert(e.target.value)}
                  placeholder="GACP/GMP-COL-890"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block mb-1">Agrónomo Productor Responsable</label>
              <input
                type="text"
                value={responsable}
                onChange={e => setResponsable(e.target.value)}
                placeholder="Ing. Laura Pinzón"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition-all"
          >
            Guardar Finca en Sistema SAASTrac
          </button>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fincas.map(finca => (
            <div key={finca.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <span className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </span>
                  <span className="px-2 py-0.5 rounded text-[8px] font-black tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">
                    {finca.registroCertificacion || 'SIN REGISTRO'}
                  </span>
                </div>
                <h4 className="text-sm font-black text-slate-950 mt-4 tracking-tight leading-snug">{finca.nombre}</h4>
                <p className="text-[11px] text-slate-400 font-mono mt-1">{finca.ubicacion}</p>
                
                <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-4 text-xs font-semibold text-slate-500">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-slate-400 font-extrabold uppercase block leading-none">Área Útil</span>
                    <span className="text-slate-800 font-bold">{finca.areaHectareas} Has</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-slate-400 font-extrabold uppercase block leading-none">Responsable</span>
                    <span className="text-slate-700 truncate block max-w-[150px]">{finca.productorResponsable}</span>
                  </div>
                </div>
              </div>
              <div className="mt-5 pt-3 flex items-center justify-between border-t border-slate-50 text-[10px] font-bold text-slate-400">
                <span>Estado: <strong className="text-emerald-500 uppercase">Activo</strong></span>
                <span className="text-slate-300">ID: {finca.id}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ==========================================
// Subcomponente 2: Vista de Lotes
// ==========================================
const LotesView: React.FC = () => {
  const [lotes, setLotes] = useState<Lote[]>(() => {
    try {
      const saved = localStorage.getItem('flora_lotes');
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return [
      {
        id: 'l-1',
        codigoLote: 'LT-CAN-26-Y4',
        fincaId: 'f-1',
        nombreLote: 'Invernadero Alfa - Bloque 2',
        areaMetrosCuadrados: 1200,
        estadoActual: 'FLOWERING',
        cultivoId: 'c-1',
        sueloTipo: 'Fibra de Coco Premium',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'l-2',
        codigoLote: 'LT-CAN-26-X8',
        fincaId: 'f-1',
        nombreLote: 'Invernadero Beta - Módulo de Cosecha',
        areaMetrosCuadrados: 850,
        estadoActual: 'HARVESTING',
        cultivoId: 'c-2',
        sueloTipo: 'Turba Rubia Mezcla',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'l-3',
        codigoLote: 'LT-CAN-25-A1',
        fincaId: 'f-2',
        nombreLote: 'Bloque Exterior Terraza Sur',
        areaMetrosCuadrados: 3400,
        estadoActual: 'VEGETATIVE',
        cultivoId: 'c-3',
        sueloTipo: 'Suelo Vivo Orgánico',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'l-4',
        codigoLote: 'LT-CAN-26-Z2',
        fincaId: 'f-3',
        nombreLote: 'Pabellón Central Hidropónico',
        areaMetrosCuadrados: 1500,
        estadoActual: 'SOWING',
        cultivoId: 'c-4',
        sueloTipo: 'Lana de Roca (Rockwool)',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  });

  React.useEffect(() => {
    localStorage.setItem('flora_lotes', JSON.stringify(lotes));
  }, [lotes]);

  const [showForm, setShowForm] = useState(false);
  const [codigoLote, setCodigoLote] = useState('');
  const [nombreLote, setNombreLote] = useState('');
  const [area, setArea] = useState('');
  const [estado, setEstado] = useState<CultivationPhase>('SOWING');
  const [suelo, setSuelo] = useState('Fibra de Coco');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Sincronizar la creación de lotes con el Dashboard (ComplianceStore)
  const { batches, setBatches } = useComplianceStore();

  // QR modal states
  const [activeQrLote, setActiveQrLote] = useState<Lote | null>(null);

  const submitLote = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!codigoLote.trim()) {
      setFormError('El Código Oficial del Lote es obligatorio.');
      return;
    }
    if (!nombreLote.trim()) {
      setFormError('El Nombre del Lote / Módulo es obligatorio.');
      return;
    }
    if (!area || Number(area) <= 0) {
      setFormError('El Área debe ser un número válido mayor a 0 m².');
      return;
    }
    if (!suelo.trim()) {
      setFormError('El Sustrato o Tipo de Suelo es obligatorio.');
      return;
    }

    const nuevo: Lote = {
      id: `l-${Date.now()}`,
      codigoLote,
      fincaId: 'f-1',
      nombreLote,
      areaMetrosCuadrados: Number(area) || 500,
      estadoActual: estado,
      cultivoId: 'c-gen',
      sueloTipo: suelo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Convert to Dashboard format (CropBatch)
    const newCropBatch: any = { // using partial or any to bridge the demo domains
      id: nuevo.id,
      batchCode: nuevo.codigoLote,
      variety: `Genética: ${nuevo.nombreLote}`,
      greenhouseId: nuevo.fincaId,
      stage: nuevo.estadoActual,
      complianceScore: 100,
      gacpCertified: true,
      gmpCertified: false,
      hash: `sha-` + nuevo.id,
      createdAt: nuevo.createdAt,
      updatedAt: nuevo.updatedAt,
      activeAudits: []
    };

    setLotes([...lotes, nuevo]);
    // Sincronizando con el estado global para Trazabilidad
    setBatches([...batches, newCropBatch]);

    setFormSuccess('¡Lote creado exitosamente y sincronizado!');
    setTimeout(() => {
      setFormSuccess('');
      setShowForm(false);
      setCodigoLote('');
      setNombreLote('');
      setArea('');
      setEstado('SOWING');
      setSuelo('Fibra de Coco');
    }, 1500);
  };

  const getStageBadge = (stage: CultivationPhase) => {
    switch (stage) {
      case 'SOWING':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'VEGETATIVE':
        return 'bg-sky-50 text-sky-700 border-sky-100';
      case 'FLOWERING':
        return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'HARVESTING':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100 animate-pulse';
      case 'CURING':
      default:
        return 'bg-amber-50 text-amber-700 border-amber-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Lotes de Cultivo Activos</h2>
          <p className="text-xs text-slate-500 mt-1">
            Gestión y monitoreo en tiempo real de lotes agrícolas segregados y sus fases de desarrollo vegetativo.
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setFormError('');
          }}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md shadow-emerald-500/10 flex items-center gap-1.5"
        >
          {showForm ? 'Regresar del Formulario' : 'Registrar Nuevo Lote'}
        </button>
      </div>

      {showForm ? (
        <form onSubmit={submitLote} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 max-w-xl">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Detalles del Nuevo Lote de Cultivo</h3>
          
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              {formError}
            </div>
          )}

          {formSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 animate-pulse">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              {formSuccess}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block mb-1">Código Oficial Lote</label>
                <input
                  type="text"
                  value={codigoLote}
                  onChange={e => setCodigoLote(e.target.value)}
                  placeholder="LT-CAN-26-Y4"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block mb-1">Nombre Lote / Módulo</label>
                <input
                  type="text"
                  value={nombreLote}
                  onChange={e => setNombreLote(e.target.value)}
                  placeholder="Invernadero Alfa - Bloque 4"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block mb-1">Área (Metros Cuadrados)</label>
                <input
                  type="number"
                  value={area}
                  onChange={e => setArea(e.target.value)}
                  placeholder="1000"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block mb-1">Sustrato / Tipo Suelo</label>
                <input
                  type="text"
                  value={suelo}
                  onChange={e => setSuelo(e.target.value)}
                  placeholder="Fibra de Coco Orgánica"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block mb-1">Fase Inicial del Cultivo</label>
              <select
                value={estado}
                onChange={e => setEstado(e.target.value as CultivationPhase)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none font-semibold text-slate-700"
              >
                <option value="SOWING">Siembra / Semillero (Sowing)</option>
                <option value="VEGETATIVE">Crecimiento / Vegetativo (Vegetative)</option>
                <option value="FLOWERING">Floración (Flowering)</option>
                <option value="HARVESTING">Cosecha Activa (Harvesting)</option>
                <option value="CURING">Secado y Curado (Curing)</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition-all"
          >
            Habilitar Lote de Cultivo
          </button>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lotes.map(lote => (
            <div key={lote.id} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-purple-600 font-extrabold uppercase bg-purple-50 px-2 py-0.5 rounded-md">
                    {lote.codigoLote}
                  </span>
                  <h4 className="text-sm font-black text-slate-900 tracking-tight leading-snug">{lote.nombreLote}</h4>
                </div>
                <span className={`px-2.5 py-1 rounded-xl text-[9px] font-black tracking-wider border uppercase ${getStageBadge(lote.estadoActual)}`}>
                  {lote.estadoActual}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-semibold pt-2 border-t border-slate-50 text-slate-500">
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase block leading-none">Área Útil</span>
                  <span className="text-slate-800 font-bold">{lote.areaMetrosCuadrados} m²</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase block leading-none">Sustrato / Suelo</span>
                  <span className="text-slate-700 font-bold max-w-[130px] truncate block">{lote.sueloTipo || 'Suelo Común'}</span>
                </div>
              </div>

              {/* Registro telemétrico IoT Integrado */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-[10px] space-y-2">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Sensores IoT de Substrato</span>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white p-1.5 rounded-lg border border-slate-100">
                    <span className="block text-slate-450 text-[8px] uppercase font-bold">Humedad</span>
                    <span className="block font-black text-slate-800 font-mono mt-0.5">42.5%</span>
                  </div>
                  <div className="bg-white p-1.5 rounded-lg border border-slate-100">
                    <span className="block text-slate-450 text-[8px] uppercase font-bold">pH</span>
                    <span className="block font-black text-slate-800 font-mono mt-0.5">6.2 pH</span>
                  </div>
                  <div className="bg-white p-1.5 rounded-lg border border-slate-100">
                    <span className="block text-slate-450 text-[8px] uppercase font-bold">CE</span>
                    <span className="block font-black text-slate-800 font-mono mt-0.5">1.6 mS</span>
                  </div>
                </div>
              </div>

              {/* Botón de Acceso Rápido QR de Campo */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setActiveQrLote(lote)}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[10px] tracking-wider uppercase rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                  title="Mostrar e Imprimir Código QR del Lote para Marcaje de Campo"
                >
                  <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v1m0 11v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h4v4H4zm12 0h4v4h-4zM4 16h4v4H4z" />
                  </svg>
                  Generar QR de Campo
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Modal de Código QR para Lote Web */}
      {activeQrLote && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 text-slate-900 max-w-sm w-full relative shadow-2xl overflow-hidden animate-fade-in text-center">
            <button
              type="button"
              onClick={() => setActiveQrLote(null)}
              className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition text-slate-500 font-bold text-center leading-none text-sm animate-pulse"
            >
              ×
            </button>
            <div className="space-y-4">
              <span className="text-[10px] text-purple-600 font-extrabold uppercase tracking-widest block">
                FLORATRACK REGULATORY FIELD LABEL
              </span>
              <div>
                <h3 className="text-sm font-black text-slate-900 leading-none">{activeQrLote.nombreLote}</h3>
                <p className="text-[10px] text-slate-500 font-mono mt-1 pt-1 bg-slate-100 rounded">Código Lote: {activeQrLote.codigoLote}</p>
              </div>
              
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl inline-block max-w-[210px] aspect-square mx-auto shadow-inner">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`${window.location.origin}${window.location.pathname}?lote=${activeQrLote.codigoLote}`)}&color=0f172a&bgcolor=ffffff&margin=1`}
                  alt="QR Code"
                  className="w-full h-full object-contain rounded-xl"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[10px] text-slate-500 font-semibold leading-relaxed text-left">
                Colega de campo: puede imprimir esta etiqueta QR de identificación y adherirla en columnas, pilares o bandejas de cultivo del invernadero. Su escaneo en campo muestra el registro de actividades en tiempo real.
              </div>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(`${window.location.origin}${window.location.pathname}?lote=${activeQrLote.codigoLote}`)}&color=0f172a&bgcolor=ffffff&margin=1`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl transition text-center shadow-md shadow-emerald-500/10"
                >
                  Imprimir / QR Alta Res
                </a>
                <button
                  type="button"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(`${window.location.origin}${window.location.pathname}?lote=${activeQrLote.codigoLote}`)}&color=0f172a&bgcolor=ffffff&margin=1`;
                    link.download = `QR_${activeQrLote.codigoLote}.png`;
                    link.target = '_blank';
                    link.click();
                  }}
                  className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition text-center border border-slate-200"
                >
                  Exportar PNG
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// Subcomponente 3: Vista de Actividades
// ==========================================
const ActividadesView: React.FC = () => {
  const [actividades, setActividades] = useState<RegistroActividad[]>(() => {
    try {
      const saved = localStorage.getItem('flora_actividades');
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return [
      {
        id: 'act-1',
        loteId: 'LT-CAN-26-Y4',
        tipoActividad: 'RIEGO',
        detalles: 'Riego con solución nutritiva pH: 5.8, EC: 1.8 mS/cm. Temperatura y humedad relativas del aire controladas óptimamente.',
        responsableNombre: 'Carlos Mendoza',
        firmaAuditoria: 'sha256-a6fc7e57c8d9d4893bc44efde',
        cantidadAplicada: '450 Litros de Solución Nutriente',
        esConformeGacp: true,
        evidenciaUrl: '#',
        fechaActividad: new Date(Date.now() - 3600000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'act-2',
        loteId: 'LT-CAN-26-X8',
        tipoActividad: 'COSECHA',
        detalles: 'Corte de flores apicales del lote en fase madura. Registro microbiológico de lote y tamiz conforme a SOP-harvest.',
        responsableNombre: 'Marta Delgado',
        firmaAuditoria: 'sha256-bd4e7a61d03ab012dc4c45aa4',
        cantidadAplicada: '142 Kg Flor Cruda Húmeda',
        esConformeGacp: true,
        evidenciaUrl: '#',
        fechaActividad: new Date(Date.now() - 864 * 100000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'act-3',
        loteId: 'LT-CAN-25-A1',
        tipoActividad: 'FERTILIZACION',
        detalles: 'Abono foliar nitrogenado con extractos de algas marinas autorizadas por GACP-SOP12. No residual.',
        responsableNombre: 'Sofía Restrepo',
        firmaAuditoria: 'sha256-cfde56a12ffefea458b990390',
        cantidadAplicada: '12 Litros Dilución Orgánica',
        esConformeGacp: true,
        evidenciaUrl: '#',
        fechaActividad: new Date(Date.now() - 1728 * 100000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'act-4',
        loteId: 'LT-CAN-26-Z2',
        tipoActividad: 'CONTROL_PLAGAS',
        detalles: 'Aplicación preventiva de aceite de Neem puro en solución acuosa para control biológico preventivo de ácaros.',
        responsableNombre: 'Mateo Gómez',
        firmaAuditoria: 'sha256-78ab3cd12eb04cc89e812d8a1',
        cantidadAplicada: '500 mL Concentrado Puro',
        esConformeGacp: true,
        evidenciaUrl: '#',
        fechaActividad: new Date(Date.now() - 2592 * 100000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  });

  React.useEffect(() => {
    localStorage.setItem('flora_actividades', JSON.stringify(actividades));
  }, [actividades]);

  const [showForm, setShowForm] = useState(false);
  const [loteId, setLoteId] = useState('');
  const [tipo, setTipo] = useState<any>('RIEGO');
  const [detalles, setDetalles] = useState('');
  const [responsable, setResponsable] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [conforme, setConforme] = useState(true);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Estados adicionales para la funcionalidad de captura de fotos y evidencias GACP
  const [activeEvidenceCaptureActId, setActiveEvidenceCaptureActId] = useState<string | null>(null);
  const [tempEvidenciaUrl, setTempEvidenciaUrl] = useState<string>('#');
  const [showRegisterCamera, setShowRegisterCamera] = useState(false);
  const [fullscreenPhotoUrl, setFullscreenPhotoUrl] = useState<string | null>(null);

  const updateActivityPhotoInState = (id: string, base64: string) => {
    setActividades(prev => prev.map(act => act.id === id ? { ...act, evidenciaUrl: base64 } : act));
  };

  const submitActividad = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!loteId.trim()) {
      setFormError('Debe especificar el Target Lote / Módulo para esta actividad.');
      return;
    }
    if (!detalles.trim()) {
      setFormError('Los detalles de la actividad no pueden estar en blanco.');
      return;
    }
    if (!responsable.trim()) {
      setFormError('Debe proveer el nombre del responsable para la firma de auditoría.');
      return;
    }
    
    const pseudoSeal = `sha256-${Math.random().toString(36).substring(2, 14)}${Math.random().toString(36).substring(2, 12)}`;

    const nueva: RegistroActividad = {
      id: `act-${Date.now()}`,
      loteId,
      tipoActividad: tipo,
      detalles,
      responsableNombre: responsable,
      firmaAuditoria: pseudoSeal,
      cantidadAplicada: cantidad || 'Sin Registros De Dosificación',
      esConformeGacp: conforme,
      evidenciaUrl: tempEvidenciaUrl,
      fechaActividad: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setActividades([nueva, ...actividades]);
    setFormSuccess('¡Actividad ALCOA+ firmada y registrada exitosamente!');
    setTimeout(() => {
      setFormSuccess('');
      setShowForm(false);
      setLoteId('');
      setTipo('RIEGO');
      setDetalles('');
      setResponsable('');
      setCantidad('');
      setConforme(true);
      setTempEvidenciaUrl('#');
      setShowRegisterCamera(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Registro de Actividades Agrícolas</h2>
          <p className="text-xs text-slate-500 mt-1">
            Bitácora de trazabilidad inmutable bajo el modelo <strong className="text-slate-800">ALCOA+</strong> de firmas electrónicas para fitomedicamentos.
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setFormError('');
          }}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md shadow-emerald-500/10 flex items-center gap-1.5"
        >
          {showForm ? 'Regresar a la Bitácora' : 'Registrar Actividad Diaria'}
        </button>
      </div>

      {showForm ? (
        <form onSubmit={submitActividad} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 max-w-xl">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Registrar Datos en Bitácora ALCOA+</h3>
          
          {formError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              {formError}
            </div>
          )}

          {formSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 animate-pulse">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              {formSuccess}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block mb-1">Target Lote / Módulo</label>
                <input
                  type="text"
                  value={loteId}
                  onChange={e => setLoteId(e.target.value)}
                  placeholder="LT-CAN-26-Y4"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block mb-1">Tipo de Actividad</label>
                <select
                  value={tipo}
                  onChange={e => setTipo(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none text-slate-700 font-bold"
                >
                  <option value="SIEMBRA">Siembra / Trasplante</option>
                  <option value="RIEGO">Riego de Sustratos</option>
                  <option value="FERTILIZACION">Fertilización foliar / Radicular</option>
                  <option value="CONTROL_PLAGAS">Control de Plagas Agrícolas</option>
                  <option value="PODA">Poda de Foliación</option>
                  <option value="COSECHA">Cosecha Activa de Invernaderos</option>
                  <option value="MONITOREO">Monitoreo Fitosanitario</option>
                  <option value="REVISION_SOP">Revisión de Normas GACP/GMP/SOP</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block mb-1">Dosificación / Cantidad Usada</label>
                <input
                  type="text"
                  value={cantidad}
                  onChange={e => setCantidad(e.target.value)}
                  placeholder="350 Litros / 2 Kg"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block mb-1">Auditor Responsable / Firma</label>
                <input
                  type="text"
                  value={responsable}
                  onChange={e => setResponsable(e.target.value)}
                  placeholder="Ing. Carlos Mendoza"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block mb-1">¿Satisface Directrices GACP/GMP/SOP?</label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
                  <input
                    type="radio"
                    checked={conforme === true}
                    onChange={() => setConforme(true)}
                    className="accent-emerald-500"
                  />
                  Cumplimiento Conforme (GACP/GMP Compliant)
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
                  <input
                    type="radio"
                    checked={conforme === false}
                    onChange={() => setConforme(false)}
                    className="accent-rose-500"
                  />
                  Con Novedad / Desviación (Deviation logged)
                </label>
              </div>
            </div>
            <div>
              <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block mb-1">Detalles de Operación y Dosimetría</label>
              <textarea
                value={detalles}
                onChange={e => setDetalles(e.target.value)}
                placeholder="Escribe aquí los datos precisos de pH, CE, aditivos orgánicos, S.O.P. aplicado..."
                rows={3}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>
            
            {/* Foto Evidencia GACP/GMP/EU-GMP */}
            <div>
              <label className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block mb-1">Evidencia Visual GACP/GMP (Opcional)</label>
              
              {tempEvidenciaUrl !== '#' ? (
                <div className="relative w-40 aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-200 mt-1 shadow-sm">
                  <img src={tempEvidenciaUrl} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setTempEvidenciaUrl('#')}
                    className="absolute top-1 right-1 p-1 bg-rose-500/90 text-white rounded-lg text-[9px] font-bold hover:bg-rose-600 transition"
                  >
                    Borrar
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowRegisterCamera(!showRegisterCamera)}
                  className="mt-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center gap-1.5 border border-slate-200"
                >
                  <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  </svg>
                  {showRegisterCamera ? 'Ocultar Capturador' : 'Capturar/Subir Foto de Evidencia'}
                </button>
              )}

              {showRegisterCamera && tempEvidenciaUrl === '#' && (
                <div className="mt-3">
                  <GacpEvidenceCapture
                    onPhotoCaptured={(base64) => {
                      setTempEvidenciaUrl(base64);
                      setShowRegisterCamera(false);
                    }}
                    onClose={() => setShowRegisterCamera(false)}
                    label="Registrar Evidencia Visual"
                  />
                </div>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition-all"
          >
            Sellar Actividad Inmutablemente
          </button>
        </form>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
            <span>Listado de Trazabilidad Agroindustrial</span>
            <span>ALCOA+ Digital Signatures Active</span>
          </div>
          <div className="divide-y divide-slate-100">
            {actividades.map(act => (
              <div key={act.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/40 transition-colors">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-black tracking-widest px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 uppercase border border-emerald-100">
                      {act.tipoActividad}
                    </span>
                    <span className="text-xs font-black text-slate-800">Lote: {act.loteId}</span>
                    <span className="text-[10px] text-slate-400 font-bold">• {new Date(act.fechaActividad).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                    {act.detalles}
                  </p>
                  
                  {/* Ledger block */}
                  <div className="flex flex-wrap items-center gap-4 text-[10px] font-extrabold text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-slate-450" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Registrado por: <strong className="text-slate-600 select-none">{act.responsableNombre}</strong>
                    </span>
                    <span>•</span>
                    <span>Cantidad: <strong className="text-slate-600 font-mono">{act.cantidadAplicada}</strong></span>
                  </div>

                  {/* Visual Evidence (GACP Proof) */}
                  {act.evidenciaUrl && act.evidenciaUrl !== '#' ? (
                    <div className="mt-3 flex items-center gap-3">
                      <div className="relative group cursor-pointer w-20 aspect-video rounded-lg overflow-hidden border border-slate-200 shadow-sm"
                           onClick={() => setFullscreenPhotoUrl(act.evidenciaUrl || null)}>
                        <img src={act.evidenciaUrl} alt="Evidencia GACP" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] text-emerald-600 font-extrabold block">✓ Evidencia Fotográfica Oficial</span>
                        <button
                          onClick={() => {
                            setActiveEvidenceCaptureActId(act.id);
                          }}
                          className="text-[9px] text-slate-500 hover:text-slate-800 font-bold underline cursor-pointer"
                        >
                          Actualizar fotografía
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3">
                      <button
                        onClick={() => {
                          setActiveEvidenceCaptureActId(act.id);
                        }}
                        className="px-3 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-lg text-[10px] font-extrabold text-slate-600 hover:text-slate-800 transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Agregar Evidencia de Foto
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0 self-start md:self-center">
                  <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[9px] font-black uppercase border ${
                    act.esConformeGacp 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${act.esConformeGacp ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    {act.esConformeGacp ? 'GACP/GMP OK' : 'SOP DEVIATION'}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 select-all max-w-[150px] truncate" title={act.firmaAuditoria}>
                    🔒 {act.firmaAuditoria}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal para Captura de Evidencia Fotográfica en Tareas Existentes */}
      {activeEvidenceCaptureActId && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <GacpEvidenceCapture
            actividadId={activeEvidenceCaptureActId}
            currentEvidenciaUrl={actividades.find(a => a.id === activeEvidenceCaptureActId)?.evidenciaUrl}
            onPhotoCaptured={(base64) => {
              updateActivityPhotoInState(activeEvidenceCaptureActId, base64);
            }}
            onClose={() => setActiveEvidenceCaptureActId(null)}
            label="Sellar Evidencia GACP/GMP"
          />
        </div>
      )}

      {/* Modal para visualizar foto en pantalla completa */}
      {fullscreenPhotoUrl && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex flex-col justify-center items-center p-4 cursor-zoom-out"
          onClick={() => setFullscreenPhotoUrl(null)}
        >
          <div className="absolute top-4 right-4 text-white font-bold text-sm bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
            Cerrar Vista ×
          </div>
          <img 
            src={fullscreenPhotoUrl} 
            alt="Evidencia Fullscreen" 
            className="max-h-[85vh] max-w-full rounded-2xl border border-slate-800 shadow-2xl object-contain animate-fade-in" 
          />
          <p className="text-xs text-slate-450 mt-4 tracking-wider uppercase font-extrabold select-none">
            Visor de Evidencia de Cumplimiento GACP/GMP • FloraTrack
          </p>
        </div>
      )}
    </div>
  );
};

// ==========================================
// Subcomponente 4: Settings & Backups View
// ==========================================
import { generateCompliancePDF } from '../utils/pdfGenerator';

const SettingsBackupView: React.FC = () => {
  const { batches } = useComplianceStore();
  const { user } = useAuth();
  const [successMsg, setSuccessMsg] = useState('');
  const [isSyncing, setIsSyncing] = useState<string | null>(null);

  const handleExportBackup = () => {
    try {
      const data = {
        fincas: JSON.parse(localStorage.getItem('flora_fincas') || '[]'),
        lotes: JSON.parse(localStorage.getItem('flora_lotes') || '[]'),
        actividades: JSON.parse(localStorage.getItem('flora_actividades') || '[]'),
        batches: batches
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `FloraTrack_Full_Snapshot_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      setSuccessMsg('Respaldo descargado exitosamente de forma local.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (e) {
      console.error('Error al exportar datos:', e);
    }
  };

  const handleGenerateCompliancePDF = () => {
    try {
      const actividades = JSON.parse(localStorage.getItem('flora_actividades') || '[]');
      const firstLote = batches.length > 0 ? batches[0] : null;
      
      generateCompliancePDF({
        actividades: actividades,
        auditorName: user?.nombre || 'SysAdmin',
        standardName: 'WHO_GACP',
        batchCode: firstLote ? firstLote.batchCode : undefined,
        strain: firstLote ? firstLote.variety : undefined,
      });
      setSuccessMsg('Reporte PDF generado y descargado exitosamente.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (e) {
      console.error('Error al generar PDF:', e);
    }
  };

  const simulateCloudSync = (provider: string) => {
    setIsSyncing(provider);
    setTimeout(() => {
      setIsSyncing(null);
      setSuccessMsg(`Respaldo sincronizado exitosamente con ${provider}.`);
      setTimeout(() => setSuccessMsg(''), 4000);
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Settings: Export & Backup Module
        </h2>
        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">
          Configuración Global y Respaldo de Datos (GACP / GMP)
        </p>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2 animate-pulse">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          {successMsg}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 max-w-2xl">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight mb-2 border-b border-slate-100 pb-2">
          Data Export & Snapshots
        </h3>
        <p className="text-xs text-slate-500 font-semibold mb-6">
          Descargue un snapshot completo de su base de datos local incluyendo fincas, lotes, actividades de trazabilidad, rúbricas de cumplimiento e información encriptada para auditorías de autoridades, o genere el reporte PDF unificado requerido por agencias regulatorias.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleExportBackup}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all text-xs font-black shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Full JSON Snapshot
          </button>
          <button
            onClick={handleGenerateCompliancePDF}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-emerald-500 bg-emerald-50 text-emerald-700 hover:bg-emerald-500 hover:text-white transition-all text-xs font-black shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar Auditoría PDF
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 max-w-2xl">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight mb-2 border-b border-slate-100 pb-2">
          Cloud Storage Sync Providers
        </h3>
        <p className="text-xs text-slate-500 font-semibold mb-6">
          Sincronice la base de datos de auditoría de forma segura usando conectores en la nube end-to-end con certificados (TLS). Requerido para cumplimiento de respaldo redundante.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => simulateCloudSync('Google Drive Enterprise')}
            disabled={isSyncing !== null}
            className={`flex items-center gap-3 p-4 rounded-xl border ${isSyncing === 'Google Drive Enterprise' ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-slate-50'} hover:border-slate-300 transition-all text-left group`}
          >
            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-slate-700" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 19L6 21H18L22 19L12 2M12 5.5L18.5 17.5H5.5L12 5.5Z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-black text-slate-800">Google Drive</p>
              <p className="text-[9px] text-slate-400 font-bold tracking-wider uppercase">Enterprise Wallet</p>
            </div>
            {isSyncing === 'Google Drive Enterprise' && (
              <svg className="w-4 h-4 text-emerald-500 ml-auto animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
          </button>
          
          <button
            onClick={() => simulateCloudSync('AWS S3 (Glacier)')}
            disabled={isSyncing !== null}
            className={`flex items-center gap-3 p-4 rounded-xl border ${isSyncing === 'AWS S3 (Glacier)' ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-slate-50'} hover:border-slate-300 transition-all text-left group`}
          >
            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-slate-700" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6ZM6 6V18H18V6H6Z" />
                <path d="M8 12H16V14H8V12Z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-black text-slate-800">AWS S3</p>
              <p className="text-[9px] text-slate-400 font-bold tracking-wider uppercase">Cold Storage Archive</p>
            </div>
            {isSyncing === 'AWS S3 (Glacier)' && (
              <svg className="w-4 h-4 text-emerald-500 ml-auto animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
          </button>

          <button
            onClick={() => simulateCloudSync('Microsoft Azure Blob')}
            disabled={isSyncing !== null}
            className={`flex items-center gap-3 p-4 rounded-xl border ${isSyncing === 'Microsoft Azure Blob' ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-slate-50'} hover:border-slate-300 transition-all text-left group`}
          >
             <div className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                <rect x="2" y="2" width="9" height="9" />
                <rect x="13" y="2" width="9" height="9" />
                <rect x="2" y="13" width="9" height="9" />
                <rect x="13" y="13" width="9" height="9" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-black text-slate-800">Azure Blob</p>
              <p className="text-[9px] text-slate-400 font-bold tracking-wider uppercase">Secure Cloud Volume</p>
            </div>
            {isSyncing === 'Microsoft Azure Blob' && (
              <svg className="w-4 h-4 text-emerald-500 ml-auto animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 max-w-2xl">
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight mb-2 border-b border-slate-100 pb-2">
          Backup Recovery & Restore
        </h3>
        <p className="text-xs text-slate-500 font-semibold mb-6">
          Restaure datos desde los snapshots archivados en sus buckets de Cloud Storage. Esta acción sobrescribirá la base de datos actual.
        </p>

        <div className="space-y-3">
          {[
            { id: 'snapshot-2026-06-20', date: '20 Jun 2026, 00:00 UTC', size: '2.4 MB', provider: 'Google Cloud Storage' },
            { id: 'snapshot-2026-06-19', date: '19 Jun 2026, 00:00 UTC', size: '2.3 MB', provider: 'Google Cloud Storage' },
            { id: 'snapshot-2026-06-12', date: '12 Jun 2026, 00:00 UTC', size: '2.1 MB', provider: 'Google Cloud Storage' },
          ].map((backup) => (
            <div key={backup.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50 hover:border-emerald-300 hover:bg-emerald-50 transition-all group">
              <div>
                <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <svg className="w-4 h-4 text-slate-400 group-hover:text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  {backup.date}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider bg-slate-200/50 px-2 py-0.5 rounded-md">
                    {backup.size}
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    {backup.provider}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  if (window.confirm(`¿Está seguro de restaurar el snapshot de ${backup.date}? Esta acción no se puede deshacer.`)) {
                    setIsSyncing(`Restoring ${backup.id}`);
                    setTimeout(() => {
                      setIsSyncing(null);
                      setSuccessMsg(`Datos restaurados exitosamente desde el snapshot ${backup.date}.`);
                      setTimeout(() => setSuccessMsg(''), 4000);
                    }, 2500);
                  }
                }}
                disabled={isSyncing !== null}
                className="shrink-0 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:border-emerald-500 hover:text-emerald-600 shadow-sm transition-all disabled:opacity-50"
              >
                {isSyncing === `Restoring ${backup.id}` ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Restaurando...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Restaurar Datos
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// Componente Layout Core
// ==========================================
interface MainLayoutProps {
  children?: ReactNode;
  activeSection?: 'dashboard' | 'fincas' | 'lotes' | 'actividades' | 'settings';
  onSectionChange?: (section: 'dashboard' | 'fincas' | 'lotes' | 'actividades' | 'settings') => void;
}

const MainLayoutInner: React.FC<MainLayoutProps> = ({
  children,
  activeSection: propActiveSection,
  onSectionChange
}) => {
  const { userProfile, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { selectBatch, batches } = useComplianceStore();

  // Sincronizar selección de lote al escanear QR pasándole parámetros por la URL
  React.useEffect(() => {
    const params = new URLSearchParams(location.search || window.location.hash.split('?')[1] || '');
    const loteParam = params.get('lote') || params.get('search');
    if (loteParam && batches && batches.length > 0) {
      const foundMatch = batches.find(
        (b) => b.batchCode.toLowerCase() === loteParam.toLowerCase() || b.id.toLowerCase() === loteParam.toLowerCase()
      );
      if (foundMatch) {
        selectBatch(foundMatch.id);
        console.log(`[FloraTrack] QR Auto-Selection: Cambiado lote activo a ${foundMatch.batchCode}`);
      }
    }
  }, [location, batches, selectBatch]);

  // Mapear la ruta de React Router a nuestro activeSection para estilizado de sidebar
  const getActiveSectionFromPath = (): 'dashboard' | 'fincas' | 'lotes' | 'actividades' | 'settings' | 'designer' => {
    const path = location.pathname;
    if (path === '/fincas') return 'fincas';
    if (path === '/lotes') return 'lotes';
    if (path === '/actividades') return 'actividades';
    if (path === '/settings') return 'settings';
    if (path === '/designer') return 'designer';
    return 'dashboard';
  };

  const activeSection = getActiveSectionFromPath();

  const navigationItems = [
    {
      id: 'dashboard' as const,
      label: 'Panel de Control',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
        </svg>
      ),
      path: '/'
    },
    {
      id: 'fincas' as const,
      label: 'Fincas',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      path: '/fincas'
    },
    {
      id: 'lotes' as const,
      label: 'Lotes de Cultivo',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.75 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      path: '/lotes'
    },
    {
      id: 'actividades' as const,
      label: 'Actividades Agrícolas',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      path: '/actividades'
    },
    {
      id: 'settings' as const,
      label: 'Backup & Configuración',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      path: '/settings'
    },
    {
      id: 'designer' as const,
      label: 'Diseñador Visual',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      ),
      path: '/designer'
    }
  ];

  const handleNavClick = (itemId: 'dashboard' | 'fincas' | 'lotes' | 'actividades' | 'settings' | 'designer') => {
    if (onSectionChange) {
      onSectionChange(itemId as any);
    }
    setIsMobileMenuOpen(false);
  };

  const getRoleBadgeColor = (rol?: RolUsuario) => {
    switch (rol) {
      case 'ADMINISTRATIVO':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'AUDITOR_EXTERNO':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
      case 'OPERATIVO':
      default:
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col md:flex-row">
      
      {/* Barra superior de navegación móvil */}
      <header className="md:hidden flex items-center justify-between bg-slate-900 px-6 py-4 text-white shadow-md border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-black text-slate-950 text-sm shadow-md shadow-emerald-500/10">
            FT
          </span>
          <div>
            <h1 className="text-xs font-black tracking-tight uppercase leading-none">FloraTrack</h1>
            <span className="text-[8px] text-emerald-400 font-bold tracking-wider uppercase">GACP/GMP SaaS</span>
          </div>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          aria-label="Abrir menú"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </header>

      {/* 1. Barra de Navegación Lateral Persistente y Drawer para Escritorio */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-slate-900 text-white border-r border-slate-800 flex flex-col shrink-0 transition-transform duration-300 transform
        md:translate-x-0 md:static
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Cabecera del Drawer */}
        <div className="p-6 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center font-black text-slate-950 text-lg shadow-lg shadow-emerald-500/20">
              FT
            </span>
            <div>
              <h2 className="text-sm font-black tracking-tight leading-none uppercase">FloraTrack ERP</h2>
              <span className="text-[10px] text-emerald-400 font-extrabold tracking-wider uppercase">Gestión GACP/EU-GMP</span>
            </div>
          </div>

          <div className="mt-5 p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-1.5 text-[11px] font-semibold text-slate-400">
            <div className="flex justify-between">
              <span>Módulo de Control:</span>
              <span className="text-emerald-400 uppercase font-black">Activo</span>
            </div>
          </div>
        </div>

        {/* Listado de Menús de Operación */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
            CONSOLA OPERATIVA
          </span>

          {navigationItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-3.5 px-3 py-3 rounded-xl text-xs transition-all duration-200 outline-none ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 font-bold border-l-2 border-emerald-400 shadow-sm'
                    : 'text-slate-400 font-medium hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <span className={isActive ? 'text-emerald-400' : 'text-slate-500'}>
                  {item.icon}
                </span>
                <span className="tracking-wide">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Información y Perfil del Usuario Autenticado en la base */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 shrink-0">
          <div className="flex items-center gap-3.5 p-1">
            <div className="w-9 h-9 rounded-full bg-emerald-400/90 text-slate-950 font-black flex items-center justify-center text-sm shadow-md shadow-emerald-400/10 shrink-0">
              {userProfile?.displayName ? userProfile.displayName.substring(0, 2).toUpperCase() : 'FT'}
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold block truncate text-slate-200">
                {userProfile?.displayName || 'Usuario FloraTrack'}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`px-1.5 py-0.2 rounded text-[8px] font-black tracking-widest border uppercase ${getRoleBadgeColor(userProfile?.rol)}`}>
                  {userProfile?.rol || 'OPERATIVO'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-3">
            <button
              onClick={() => logout().catch(console.error)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-slate-800 hover:border-slate-700/80 bg-slate-950/20 hover:bg-slate-950/50 text-slate-400 hover:text-rose-400 transition-all text-xs font-semibold outline-none"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Salir del Sistema
            </button>
          </div>
        </div>
      </aside>

      {/* Fondo velado para móvil cuando el menú está visible */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
        />
      )}

      {/* 2. Área Central de Contenido del Consola Principal */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Encabezado Superior con Acciones de Escritorio */}
        <header className="hidden md:flex h-16 bg-white border-b border-slate-100 px-8 justify-between items-center shadow-sm shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2.5 py-1 rounded-lg">
              FloraTrack SaaS
            </span>
          </div>

          {/* Estado de conexión de indicadores de regulación de estándares */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3.5 py-1.5 rounded-full border border-emerald-100 text-[10px] font-extrabold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              SOP GACP/GMP VIGENTE
            </div>
            <div className="flex items-center gap-2 bg-slate-50 text-slate-600 px-3.5 py-1.5 rounded-full border border-slate-200 text-[10px] font-extrabold uppercase tracking-wider">
              CONEXIÓN PROTEGIDA
            </div>
          </div>
        </header>

        {/* Sección de Contenido Principal Dinámico con Router Switcher */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto space-y-8 animate-fade-in">
          <Routes>
            <Route path="/" element={<ProtectedRoute><DashboardSummary /></ProtectedRoute>} />
            <Route path="/fincas" element={<ProtectedRoute><FincasView /></ProtectedRoute>} />
            <Route path="/designer" element={<ProtectedRoute><FarmDesigner /></ProtectedRoute>} />
            <Route path="/lotes" element={<ProtectedRoute><LotesView /></ProtectedRoute>} />
            <Route path="/actividades" element={<ProtectedRoute><ActividadesView /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsBackupView /></ProtectedRoute>} />
          </Routes>
          {children}
        </main>
      </div>

    </div>
  );
};

export const MainLayout: React.FC<MainLayoutProps> = (props) => {
  return (
    <HashRouter>
      <NotificationProvider>
        <ComplianceStoreProvider>
          <MainLayoutInner {...props} />
          <ToastContainer />
        </ComplianceStoreProvider>
      </NotificationProvider>
    </HashRouter>
  );
};
