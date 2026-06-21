/**
 * Audit Service Handler - FloraTrack AgTech SaaS Client
 * Manages electronic checklist scoring, handoff signature validations,
 * and standard regulatory reports compliant with WHO/EMA guidelines.
 */

import { api } from './api';
import { GacpRequirement, AuditRecord } from '../types/agricultural';

export const auditService = {
  /**
   * Retrieves active requirements applicable for a batch's current stage
   */
  getChecklistForBatch: async (batchId: string): Promise<GacpRequirement[]> => {
    return api.get<GacpRequirement[]>(`/batches/${batchId}/gacp-checklist`);
  },

  /**
   * Updates an individual checklist requirement's inspection status
   */
  verifyRequirement: async (
    batchId: string,
    requirementId: string,
    verificationData: {
      verified: boolean;
      notes?: string;
      auditorName: string;
    }
  ): Promise<GacpRequirement> => {
    return api.patch<GacpRequirement>(
      `/batches/${batchId}/gacp-checklist/${requirementId}`,
      verificationData
    );
  },

  /**
   * Sign off on an entire GACP section to commit a permanent electronic registry record
   */
  finalizeAuditSection: async (
    batchId: string,
    auditPayload: {
      auditorId: string;
      auditorName: string;
      electronicSignature: string; // Attributed signed code e.g. "ESIG-9812-JSMITH"
      sectionsAudited: string[];
      recommendations: string[];
    }
  ): Promise<AuditRecord> => {
    return api.post<AuditRecord>(`/batches/${batchId}/finalize-audit`, auditPayload);
  }
};
