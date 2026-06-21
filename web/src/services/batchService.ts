/**
 * Batch Service Handler - FloraTrack AgTech SaaS Client
 * Direct API mapping for crop growth units, locations, and lab COA certificates.
 */

import { api } from './api';
import { CropBatch, LabAnalysisCertificate, CultivationPhase } from '../types/agricultural';

export const batchService = {
  /**
   * Fetch all active cultivation batches
   */
  getAllBatches: async (): Promise<CropBatch[]> => {
    return api.get<CropBatch[]>('/batches');
  },

  /**
   * Fetch a specific batch with nested checklists and COA analytical results
   */
  getBatchDetails: async (batchId: string): Promise<CropBatch> => {
    return api.get<CropBatch>(`/batches/${batchId}`);
  },

  /**
   * Launch a brand new crop batch into cultivation
   */
  registerNewBatch: async (batchData: {
    batchCode: string;
    variety: string;
    greenhouseId: string;
    stage: CultivationPhase;
  }): Promise<CropBatch> => {
    return api.post<CropBatch>('/batches', batchData);
  },

  /**
   * Commit laboratory evaluation metrics to seal regulatory GACP compliance status
   */
  uploadLabCertificate: async (
    batchId: string,
    certificate: LabAnalysisCertificate
  ): Promise<CropBatch> => {
    return api.post<CropBatch>(`/batches/${batchId}/lab-certificate`, certificate);
  },

  /**
   * Perform an immutable phase transition e.g., move a batch from FLOWERING to HARVEST
   */
  transitionPhase: async (batchId: string, targetPhase: CultivationPhase): Promise<CropBatch> => {
    return api.patch<CropBatch>(`/batches/${batchId}/phase`, { stage: targetPhase });
  }
};
