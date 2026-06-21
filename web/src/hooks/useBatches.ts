/**
 * useBatches React Hook
 * Fetches, filters, and manages crop batches within the AgTech client application.
 * Incorporates GACP audit states, compliance score mutations, and REST endpoints querying.
 */

import { useState, useEffect, useCallback } from 'react';
import { CropBatch, CultivationPhase } from '../types/agricultural';

export function useBatches() {
  const [batches, setBatches] = useState<CropBatch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [phaseFilter, setPhaseFilter] = useState<CultivationPhase | 'ALL'>('ALL');
  const [certifiedOnly, setCertifiedOnly] = useState(false);

  const fetchBatches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Calls the configured Next.js local API route
      const response = await fetch('/api/batches');
      if (!response.ok) {
        throw new Error(`Failed to fetch batches from network: ${response.statusText}`);
      }
      const data = await response.json();
      setBatches(data);
    } catch (err: any) {
      console.error('[Ag-SaaS] Error pulling batches:', err);
      setError(err.message || 'An error occurred during retrieval.');
    } finally {
      setLoading(false);
    }
  }, []);

  const createBatch = async (batchInput: Partial<CropBatch>) => {
    try {
      const response = await fetch('/api/batches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batchInput)
      });
      if (!response.ok) throw new Error('API failed to persist batch.');
      const newBatch = await response.json();
      setBatches((prev) => [newBatch, ...prev]);
      return { success: true, batch: newBatch };
    } catch (err: any) {
      console.error('Error creating batch:', err);
      return { success: false, error: err.message };
    }
  };

  const updateBatchPhase = async (id: string, stage: CultivationPhase) => {
    try {
      // Metaphorically patch batch stage
      const response = await fetch(`/api/batches/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage })
      });
      if (!response.ok) throw new Error('Failed to update batch phase.');
      const updated = await response.json();

      setBatches((prev) => prev.map((item) => (item.id === id ? updated : item)));
      return { success: true };
    } catch (err: any) {
      console.error('Error patching phase:', err);
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchBatches();
  }, [fetchBatches]);

  // Compute filtered items
  const filteredBatches = batches.filter((b) => {
    const matchesSearch =
      b.batchCode.toLowerCase().includes(search.toLowerCase()) ||
      b.variety.toLowerCase().includes(search.toLowerCase());
    const matchesPhase = phaseFilter === 'ALL' || b.stage === phaseFilter;
    const matchesCertification = !certifiedOnly || b.gacpCertified;

    return matchesSearch && matchesPhase && matchesCertification;
  });

  return {
    batches: filteredBatches,
    allBatches: batches,
    loading,
    error,
    search,
    setSearch,
    phaseFilter,
    setPhaseFilter,
    certifiedOnly,
    setCertifiedOnly,
    refresh: fetchBatches,
    createBatch,
    updateBatchPhase
  };
}
