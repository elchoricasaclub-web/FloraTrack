import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CropBatch, GacpRequirement, CultivationPhase, AuditSystemLog, AuditSystemLogAction } from '../types/agricultural';
import { calculateGacpIndex, ScoreBreakdown } from '../utils/gacpCalculator';

interface ComplianceStoreState {
  batches: CropBatch[];
  selectedBatch: CropBatch | null;
  complianceStandard: 'WHO_GACP' | 'EU_GMP';
  activeFilterPhase: CultivationPhase | 'ALL';
  isSyncing: boolean;
  scoreBreakdown: ScoreBreakdown | null;
  auditLogs: AuditSystemLog[];
  
  // Actions
  setBatches: (batches: CropBatch[]) => void;
  selectBatch: (batchId: string) => void;
  setComplianceStandard: (standard: 'WHO_GACP' | 'EU_GMP') => void;
  setFilterPhase: (phase: CultivationPhase | 'ALL') => void;
  updateRequirementStatus: (reqId: string, verified: boolean, auditorName: string, notes?: string) => void;
  syncData: () => Promise<void>;
  addAuditLog: (action: AuditSystemLogAction, details: string, performedBy: string, batchId?: string) => Promise<void>;
}

const ComplianceStoreContext = createContext<ComplianceStoreState | undefined>(undefined);

export const ComplianceStoreProvider: React.FC<{ children: ReactNode; initialBatches?: CropBatch[] }> = ({
  children,
  initialBatches = []
}) => {
  const [batches, setBatchesState] = useState<CropBatch[]>(initialBatches);
  const [selectedBatch, setSelectedBatch] = useState<CropBatch | null>(null);
  const [complianceStandard, setComplianceStandard] = useState<'WHO_GACP' | 'EU_GMP'>('WHO_GACP');
  const [activeFilterPhase, setFilterPhase] = useState<CultivationPhase | 'ALL'>('ALL');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [scoreBreakdown, setScoreBreakdown] = useState<ScoreBreakdown | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditSystemLog[]>([]);

  const addAuditLog = async (action: AuditSystemLogAction, details: string, performedBy: string, batchId?: string) => {
    const timestamp = new Date().toISOString();
    const encoder = new TextEncoder();
    const data = encoder.encode(action + details + performedBy + timestamp + (batchId || ''));
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    const newLog: AuditSystemLog = {
      id: Math.random().toString(36).substr(2, 9),
      action,
      details,
      performedBy,
      timestamp,
      batchId,
      hash: hashHex
    };

    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Automatically recalculate compliance score index when active audits or standard changes
  useEffect(() => {
    if (selectedBatch && selectedBatch.activeAudits) {
      const breakdown = calculateGacpIndex(selectedBatch.activeAudits);
      setScoreBreakdown(breakdown);
    } else {
      setScoreBreakdown(null);
    }
  }, [selectedBatch, complianceStandard]);

  const setBatches = (newBatches: CropBatch[]) => {
    setBatchesState(newBatches);
    if (newBatches.length > 0 && !selectedBatch) {
      setSelectedBatch(newBatches[0]);
    }
  };

  const selectBatch = (batchId: string) => {
    const found = batches.find((b) => b.id === batchId);
    if (found) {
      setSelectedBatch(found);
    }
  };

  const updateRequirementStatus = (
    reqId: string,
    verified: boolean,
    auditorName: string,
    notes?: string
  ) => {
    if (!selectedBatch || !selectedBatch.activeAudits) return;

    // Map modified GACP requirements
    const updatedAudits = selectedBatch.activeAudits.map((req) => {
      if (req.id === reqId) {
        return {
          ...req,
          verified,
          checkedBy: auditorName,
          notes,
          updatedAt: new Date().toISOString()
        };
      }
      return req;
    });

    const updatedBatch: CropBatch = {
      ...selectedBatch,
      activeAudits: updatedAudits,
      updatedAt: new Date().toISOString()
    };

    // Recalculate inner conformity scores
    const results = calculateGacpIndex(updatedAudits);
    updatedBatch.complianceScore = results.score;
    updatedBatch.gacpCertified = results.gacpStatus === 'CERTIFIED';

    // Set updated batch to list
    setSelectedBatch(updatedBatch);
    setBatchesState((prev) => prev.map((b) => (b.id === selectedBatch.id ? updatedBatch : b)));
  };

  const syncData = async () => {
    setIsSyncing(true);
    try {
      // Simulate cryptographic hash seal synchronization with ERP
      await new Promise((resolve) => setTimeout(resolve, 1500));
      if (selectedBatch) {
        const encoder = new TextEncoder();
        const data = encoder.encode(JSON.stringify(selectedBatch) + Date.now().toString());
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

        const synchronizedBatch = {
          ...selectedBatch,
          hash: hashHex,
          updatedAt: new Date().toISOString()
        };

        setSelectedBatch(synchronizedBatch);
        setBatchesState((prev) =>
          prev.map((b) => (b.id === selectedBatch.id ? synchronizedBatch : b))
        );
      }
    } catch (e) {
      console.error('Data Integrity Sync failure:', e);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <ComplianceStoreContext.Provider
      value={{
        batches,
        selectedBatch,
        complianceStandard,
        activeFilterPhase,
        isSyncing,
        scoreBreakdown,
        setBatches,
        selectBatch,
        setComplianceStandard,
        setFilterPhase,
        updateRequirementStatus,
        syncData,
        auditLogs,
        addAuditLog
      }}
    >
      {children}
    </ComplianceStoreContext.Provider>
  );
};

export const useComplianceStore = () => {
  const context = useContext(ComplianceStoreContext);
  if (context === undefined) {
    throw new Error('useComplianceStore must be used inside a ComplianceStoreProvider context.');
  }
  return context;
};
