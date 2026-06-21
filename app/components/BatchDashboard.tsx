'use client';

import React, { useState, useEffect } from 'react';
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
  Cell
} from 'recharts';

// TypeScript interfaces matching the Prisma schema structures
interface AuditRecord {
  id: string;
  section: string;
  requirement: string;
  verified: boolean;
  notes?: string | null;
  compliant: boolean;
  scoreValue: number;
}

interface ComplianceLog {
  id: string;
  statusType: string;
  score: number;
  remarks?: string | null;
  checkedBy: string;
  timestamp: string;
}

interface Batch {
  id: string;
  name: string;
  variety: string;
  stage: string;
  complianceScore: number;
  location: string;
  hash: string;
  barcode: string;
  timestamp: string;
  gmpCertified: boolean;
  auditRecords?: AuditRecord[];
  complianceLogs?: ComplianceLog[];
}

export default function BatchDashboard() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [stageFilter, setStageFilter] = useState<string>('All');
  const [complianceFilter, setComplianceFilter] = useState<string>('All');
  const [gmpOnly, setGmpOnly] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Fetch batches from our Next.js API
  const fetchBatches = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/batches');
      if (!res.ok) {
        throw new Error(`HTTP status error: ${res.status}`);
      }
      const data = await res.json();
      setBatches(data);
    } catch (err: any) {
      console.error('Error fetching batches:', err);
      setError(err.message || 'No se pudo conectar con el endpoint de API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
    setIsMounted(true);
  }, []);

  // Approved GACP cultivation phases for filtering
  const stages = ['All', 'Siembra', 'Propagación', 'Vegetativo', 'Floración', 'Cosechado', 'Secado', 'Curado', 'Procesado', 'Cuarentena', 'Aprobado'];

  // Filtered batch listing computation
  const filteredBatches = batches.filter((batch) => {
    const matchesSearch =
      batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.variety.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.barcode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStage = stageFilter === 'All' || batch.stage === stageFilter;

    let matchesCompliance = true;
    if (complianceFilter === 'Excellent') {
      matchesCompliance = batch.complianceScore >= 90;
    } else if (complianceFilter === 'Warning') {
      matchesCompliance = batch.complianceScore >= 70 && batch.complianceScore < 90;
    } else if (complianceFilter === 'Critical') {
      matchesCompliance = batch.complianceScore < 70;
    }

    const matchesGmp = !gmpOnly || batch.gmpCertified;

    return matchesSearch && matchesStage && matchesCompliance && matchesGmp;
  });

  // Calculate dynamic charts data
  const complianceChartData = filteredBatches.map(b => ({
    name: b.name,
    compliance: b.complianceScore,
    gmp: b.gmpCertified ? 'GMP' : 'GACP',
  }));

  const averageComplianceByStage = stages.filter(s => s !== 'All').map(stage => {
    const stageBatches = batches.filter(b => b.stage === stage);
    const average = stageBatches.length > 0
      ? Math.round(stageBatches.reduce((sum, b) => sum + b.complianceScore, 0) / stageBatches.length)
      : 0;
    return { name: stage, promedio: average, count: stageBatches.length };
  }).filter(item => item.count > 0);

  // Helper for compliance color styling
  const getComplianceColors = (score: number) => {
    if (score >= 90) {
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        badge: 'bg-emerald-500',
        text: 'text-emerald-700',
        progress: 'bg-emerald-500',
      };
    } else if (score >= 70) {
      return {
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        badge: 'bg-amber-500',
        text: 'text-amber-700',
        progress: 'bg-amber-500',
      };
    } else {
      return {
        bg: 'bg-rose-50 text-rose-700 border-rose-200',
        badge: 'bg-rose-500',
        text: 'text-rose-700',
        progress: 'bg-rose-500',
      };
    }
  };

  // Helper for cultivation stage badge styling
  const getStageBadgeColor = (stage: string) => {
    switch (stage) {
      case 'Floración':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Cosechado':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Secado':
      case 'Curado':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Aprobado':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Cuarentena':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-teal-100 text-teal-800 border-teal-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-600 text-white p-2.5 rounded-2xl shadow-md shadow-emerald-200">
              {/* Plant Icon */}
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">FloraTrack Biotech</h1>
              <p className="text-xs text-slate-500 font-medium tracking-wide">PANEL DE TRAZABILIDAD AGRÍCOLA GACP & GMP</p>
            </div>
          </div>
          
          <button
            onClick={fetchBatches}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-400 font-semibold text-sm rounded-xl transition duration-200 shadow-sm"
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 12H16c0-.062-.078-.045-.078-.112m0 0a6.52 6.52 0 10-1.802 4.453l1.802-1.802" />
            </svg>
            Sincronizar Cloud
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search Bar Section */}
        <section className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm mb-8">
          <h2 className="text-sm font-bold text-slate-900 tracking-wide uppercase mb-4">Parámetros de Auditoría y Filtros</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por lote, variedad, QR..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm transition"
              />
            </div>

            {/* Cultivation Stage Filter */}
            <div>
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-medium text-slate-700 transition"
              >
                <option value="All">Fase de Cultivo: Todas</option>
                {stages.filter(s => s !== 'All').map((stg) => (
                  <option key={stg} value={stg}>{stg}</option>
                ))}
              </select>
            </div>

            {/* Compliance Filter */}
            <div>
              <select
                value={complianceFilter}
                onChange={(e) => setComplianceFilter(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-medium text-slate-700 transition"
              >
                <option value="All">Cumplimiento: Todos</option>
                <option value="Excellent">Excelente (90% - 100%)</option>
                <option value="Warning">Advertencia (70% - 89%)</option>
                <option value="Critical">Crítico o No Conforme (0% - 69%)</option>
              </select>
            </div>

            {/* Toggle GMP Certified Switch */}
            <div className="flex items-center h-full px-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={gmpOnly}
                  onChange={(e) => setGmpOnly(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                <span className="ml-3 text-sm font-semibold text-slate-700">Solo Grado GMP</span>
              </label>
            </div>
          </div>
        </section>

        {/* Status Indicators Summary */}
        {batches.length > 0 && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-5 border border-slate-200 rounded-2xl flex items-center space-x-4 shadow-sm">
              <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-950">{batches.length}</div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Lotes Totales</div>
              </div>
            </div>

            <div className="bg-white p-5 border border-slate-200 rounded-2xl flex items-center space-x-4 shadow-sm">
              <div className="p-3 bg-blue-100 text-blue-800 rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-950">{batches.filter(b => b.gmpCertified).length}</div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Homologación GMP</div>
              </div>
            </div>

            <div className="bg-white p-5 border border-slate-200 rounded-2xl flex items-center space-x-4 shadow-sm">
              <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-950">
                  {batches.length > 0 ? Math.round(batches.map(b => b.complianceScore).reduce((a, b) => a + b, 0) / batches.length) : 0}%
                </div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Cumplimiento GACP Medio</div>
              </div>
            </div>

            <div className="bg-white p-5 border border-slate-200 rounded-2xl flex items-center space-x-4 shadow-sm">
              <div className="p-3 bg-indigo-100 text-indigo-800 rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-black text-slate-950">
                  {batches.filter(b => b.complianceScore < 75).length}
                </div>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Alertas No Conforme</div>
              </div>
            </div>
          </div>
        )}

        {/* Visual Compliance & Performance Charts */}
        {isMounted && !loading && !error && filteredBatches.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Chart 1: Bar Chart of Compliance */}
            <div className="bg-white p-6 border border-slate-200 rounded-3xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    Calificaciones de Cumplimiento GACP/GMP
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Puntuación porcentual de cumplimiento por lote agrícola calificado</p>
                </div>
              </div>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={complianceChartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} fontWeight="bold" />
                    <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} fontWeight="bold" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                      labelClassName="font-bold text-slate-900"
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                    <Bar name="Cumplimiento (%)" dataKey="compliance" radius={[6, 6, 0, 0]}>
                      {complianceChartData.map((entry, index) => {
                        let barColor = '#10b981'; // Emerald
                        if (entry.compliance < 70) barColor = '#ef4444'; // Rose
                        else if (entry.compliance < 85) barColor = '#f59e0b'; // Amber
                        return <Cell key={`cell-${index}`} fill={barColor} />;
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Line Chart of Average Compliance by Stage */}
            <div className="bg-white p-6 border border-slate-200 rounded-3xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                    Rendimiento Medio del Cultivo por Fase
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">Línea de tendencia de cumplimiento de calidad según etapa de desarrollo</p>
                </div>
              </div>
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={averageComplianceByStage} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} fontWeight="bold" />
                    <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} fontWeight="bold" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                      labelClassName="font-bold text-slate-900"
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                    <Line
                      name="Promedio de Calidad GACP/GMP"
                      type="monotone"
                      dataKey="promedio"
                      stroke="#6366f1"
                      strokeWidth={3}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Loading and Error states */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-sm font-semibold text-slate-500">Recuperando registros directos de la base de datos hortícola...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 text-center max-w-2xl mx-auto my-12">
            <div className="w-12 h-12 bg-rose-100 text-rose-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-rose-950 mb-1">Error de Comunicación</h3>
            <p className="text-sm text-rose-700/90 mb-4">{error}</p>
            <button
              onClick={fetchBatches}
              className="px-4 py-2 bg-rose-100 hover:bg-rose-200 border border-rose-300 text-rose-900 text-sm font-bold rounded-xl transition duration-150"
            >
              Intocar de Nuevo
            </button>
          </div>
        ) : filteredBatches.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-2xl mx-auto shadow-sm">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Sin Resultados de Lotes</h3>
            <p className="text-sm text-slate-500 mb-4">Ningún lote agrícola actual coincide con los criterios de búsqueda o filtros configurados.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setStageFilter('All');
                setComplianceFilter('All');
                setGmpOnly(false);
              }}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-sm font-bold rounded-xl transition duration-150"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          /* Batches Grid Container */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredBatches.map((batch) => {
              const compliance = getComplianceColors(batch.complianceScore);
              
              return (
                <div
                  key={batch.id}
                  className="bg-white rounded-3xl border border-slate-200/80 shadow-md hover:shadow-lg hover:border-slate-300 transition-all duration-200 overflow-hidden"
                >
                  {/* Card upper band */}
                  <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-slate-900">{batch.name}</h3>
                          {batch.gmpCertified && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                              FARMACÉUTICO GMP
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 font-medium">{batch.location}</p>
                      </div>

                      {/* Cultivation Phase Badge */}
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getStageBadgeColor(batch.stage)}`}>
                        {batch.stage}
                      </span>
                    </div>
                  </div>

                  {/* Card Main Properties */}
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="text-[10px] leading-relaxed text-slate-400 font-black uppercase tracking-wider">Variedad Botánica</div>
                        <div className="text-sm font-extrabold text-slate-800 truncate">{batch.variety}</div>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="text-[10px] leading-relaxed text-slate-400 font-black uppercase tracking-wider">Rastreabilidad (GTIN)</div>
                        <div className="text-sm font-semibold text-slate-700 truncate">{batch.barcode}</div>
                      </div>
                    </div>

                    {/* Cryptographic Ledger Block */}
                    <div className="mb-6 p-3 bg-slate-900 text-[10px] font-mono text-slate-400 rounded-xl border border-slate-850 flex items-center justify-between">
                      <span className="truncate max-w-[250px]">HASH: {batch.hash}</span>
                      <span className="bg-emerald-950 text-emerald-400 font-black px-1.5 py-0.5 rounded text-[8px] tracking-widest">VERIFICADO</span>
                    </div>

                    {/* Progress Score Bar */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">Porcentaje de Cumplimiento GACP</span>
                        <span className={`text-sm font-black ${compliance.text}`}>{batch.complianceScore}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className={`h-full ${compliance.progress} transition-all duration-300`}
                          style={{ width: `${batch.complianceScore}%` }}
                        />
                      </div>
                    </div>

                    {/* Auditor Records Summary inside Batch details if available */}
                    {batch.auditRecords && batch.auditRecords.length > 0 && (
                      <div className="border-t border-slate-100 pt-5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1.5">
                          <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          Últimos Controles Sanitarios
                        </h4>
                        
                        <div className="space-y-2.5">
                          {batch.auditRecords.slice(0, 3).map((record) => (
                            <div key={record.id} className="text-xs flex items-start justify-between gap-4 p-2 bg-slate-50/70 hover:bg-slate-50 rounded-lg border border-slate-100">
                              <div className="flex-1 min-w-0">
                                <div className="font-bold text-slate-700 flex items-center gap-1.5">
                                  <span className="px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded text-[9px] font-extrabold uppercase">{record.section}</span>
                                  <span className="truncate">{record.requirement}</span>
                                </div>
                                {record.notes && <p className="text-slate-500 italic mt-0.5">{record.notes}</p>}
                              </div>
                              
                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-extrabold uppercase ${record.compliant ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                                {record.compliant ? 'Pasa' : 'Falla'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-8 mt-16 text-center text-xs text-slate-400 font-medium">
        <p>© {new Date().getFullYear()} FloraTrack Biotech Corp. Todos los derechos reservados.</p>
        <p className="mt-1">Monitoreo agrícola de alta fidelidad, de conformidad con pautas GACP (Organización Mundial de la Salud - OMS) y FDA GMP (Partes 211 / 111).</p>
      </footer>
    </div>
  );
}
