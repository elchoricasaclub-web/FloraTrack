import React from 'react';
import { useComplianceStore } from '../../store';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line 
} from 'recharts';

export const RechartsDashboard: React.FC = () => {
  const { batches } = useComplianceStore();

  // Preparar datos para "Tasa de Cumplimiento Documental por Lote"
  const complianceData = batches.map(batch => ({
    name: batch.batchCode,
    score: Math.floor(Math.random() * 40) + 60, // Score simulado de 60-100 para demo visual
    // Si queremos datos reales de documentationComplete
    documentacion: batch.documentationComplete ? 100 : 50
  }));

  // Preparar datos para "Fechas de cosecha y rendimiento estimado"
  const harvestData = batches.map(batch => ({
    name: batch.batchCode,
    rendimientoKg: batch.expectedYield,
    fecha: new Date(batch.estimatedHarvestDate).toLocaleDateString('es-ES', { month: 'short', day: 'numeric'})
  })).sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div className="bg-[#111A3A] border border-[#1A2642] p-4 rounded-xl">
        <h4 className="text-sm font-bold text-white mb-4">Tasa de Cumplimiento Documental</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={complianceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1A2642" vertical={false} />
              <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#060B19', border: '1px solid #1A2642', borderRadius: '8px' }}
                itemStyle={{ color: '#E2E8F0' }}
              />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              <Bar dataKey="score" name="Score GACP (%)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-[#111A3A] border border-[#1A2642] p-4 rounded-xl">
        <h4 className="text-sm font-bold text-white mb-4">Proyección de Cosecha (Kg) por Fecha</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={harvestData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1A2642" vertical={false} />
              <XAxis dataKey="fecha" stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#060B19', border: '1px solid #1A2642', borderRadius: '8px' }}
                itemStyle={{ color: '#E2E8F0' }}
              />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              <Line type="monotone" dataKey="rendimientoKg" name="Rendimiento Esperado" stroke="#10B981" strokeWidth={3} dot={{ r: 4, fill: '#10B981' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
