// Archivo: web/src/components/store.ts
import { create } from 'zustand';

export interface Batch {
  id: string;
  name: string;
  status: 'compliant' | 'non-compliant' | 'warning';
  score: number;
}

interface ComplianceStore {
  batches: Batch[];
  complianceStandard: number;
  setBatches: (batches: Batch[]) => void;
  setComplianceStandard: (standard: number) => void;
}

export const useComplianceStore = create<ComplianceStore>((set) => ({
  // Datos de prueba para que puedas ver el semáforo funcionar
  batches: [
    { id: '1', name: 'Lote 001 - Semilla', status: 'compliant', score: 98 },
    { id: '2', name: 'Lote 002 - Clones', status: 'warning', score: 90 },
    { id: '3', name: 'Lote 003 - Floración', status: 'non-compliant', score: 75 },
  ],
  complianceStandard: 95, // Estándar mínimo dictado por tu lógica
  setBatches: (batches) => set({ batches }),
  setComplianceStandard: (complianceStandard) => set({ complianceStandard }),
}));