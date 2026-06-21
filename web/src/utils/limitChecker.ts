/**
 * Limit Checker for Herbaceous and Pharmaceutical Crops GACP/GMP Compliance
 * Contains regulatory verification functions matching WHO and European Pharmacopoeia (EP) maximum limits.
 */

import { HeavyMetalMRL, LabAnalysisCertificate } from '../types/agricultural';

// Default international limits according to WHO guidelines for herbal medicines (GACP)
export const REGULATORY_LIMITS_WHO: HeavyMetalMRL = {
  cadmium: 0.3, // mg/kg (ppm)
  lead: 5.0,    // mg/kg (ppm)
  mercury: 0.1, // mg/kg (ppm)
  arsenic: 1.0  // mg/kg (ppm)
};

// Strict EU-GMP regulations for pharmaceutical dried flower materials
export const REGULATORY_LIMITS_EUGMP: HeavyMetalMRL = {
  cadmium: 0.2, // mg/kg (ppm)
  lead: 2.0,    // mg/kg (ppm)
  mercury: 0.1, // mg/kg (ppm)
  arsenic: 0.8  // mg/kg (ppm)
};

/**
 * Checks if a sample's heavy metals values comply with GACP or EU-GMP standards
 */
export function verifyHeavyMetals(
  cadmium: number,
  lead: number,
  mercury: number,
  arsenic: number,
  standard: 'WHO_GACP' | 'EU_GMP' = 'WHO_GACP'
): {
  compliant: boolean;
  metals: {
    cadmium: { value: number; limit: number; status: 'PASS' | 'FAIL' };
    lead: { value: number; limit: number; status: 'PASS' | 'FAIL' };
    mercury: { value: number; limit: number; status: 'PASS' | 'FAIL' };
    arsenic: { value: number; limit: number; status: 'PASS' | 'FAIL' };
  };
} {
  const limits = standard === 'EU_GMP' ? REGULATORY_LIMITS_EUGMP : REGULATORY_LIMITS_WHO;

  const results = {
    cadmium: { value: cadmium, limit: limits.cadmium, status: cadmium <= limits.cadmium ? 'PASS' as const : 'FAIL' as const },
    lead: { value: lead, limit: limits.lead, status: lead <= limits.lead ? 'PASS' as const : 'FAIL' as const },
    mercury: { value: mercury, limit: limits.mercury, status: mercury <= limits.mercury ? 'PASS' as const : 'FAIL' as const },
    arsenic: { value: arsenic, limit: limits.arsenic, status: arsenic <= limits.arsenic ? 'PASS' as const : 'FAIL' as const }
  };

  const compliant =
    results.cadmium.status === 'PASS' &&
    results.lead.status === 'PASS' &&
    results.mercury.status === 'PASS' &&
    results.arsenic.status === 'PASS';

  return { compliant, metals: results };
}

/**
 * Evaluates floral moisture percentage to guarantee inhibition of microbiological pathogens (Aspergillus/Salmonella).
 * Optimal moisture window for pharmaceutical grade storage is between 8% and 12%.
 */
export function verifyMoistureContent(value: number): {
  status: 'PASS' | 'HYDRATED_RISK' | 'CRITICAL_MOLD_RISK' | 'OVER_DRY_TERPENE_LOSS';
  message: string;
} {
  if (value < 6) {
    return {
      status: 'OVER_DRY_TERPENE_LOSS',
      message: 'Dryness too high. High risk of severe terpene degradation and flower brittleness.'
    };
  }
  if (value >= 6 && value < 8) {
    return {
      status: 'PASS',
      message: 'Acceptable range for long-term secure extraction feedstock.'
    };
  }
  if (value >= 8 && value <= 12) {
    return {
      status: 'PASS',
      message: 'Optimal premium standard for pharmaceutical floral presentation (GACP ideal).'
    };
  }
  if (value > 12 && value <= 15) {
    return {
      status: 'HYDRATED_RISK',
      message: 'Water activity elevated. Accelerated degradation risk. Requires monitoring.'
    };
  }
  return {
    status: 'CRITICAL_MOLD_RISK',
    message: 'CRITICAL WARNING: Moisture exceeds 15%. Strict mold/mycotoxin colonization hazard. GACP non-compliant.'
  };
}

/**
 * Compiles and seals laboratory certificate of analysis outcomes
 */
export function evaluateLabAnalysis(
  moisture: number,
  metals: { cadmium: number; lead: number; mercury: number; arsenic: number },
  pesticidesPass: boolean,
  microbiologyPass: boolean,
  standard: 'WHO_GACP' | 'EU_GMP' = 'WHO_GACP'
): Partial<LabAnalysisCertificate> {
  const metalChecks = verifyHeavyMetals(metals.cadmium, metals.lead, metals.mercury, metals.arsenic, standard);
  const moistureCheck = verifyMoistureContent(moisture);

  const overallPass =
    metalChecks.compliant &&
    pesticidesPass &&
    microbiologyPass &&
    (moistureCheck.status === 'PASS');

  return {
    moistureContent: moisture,
    microbialPurity: microbiologyPass ? 'PASS' : 'FAIL',
    pesticideResidues: pesticidesPass ? 'PASS' : 'FAIL',
    heavyMetals: {
      cadmiumValue: metals.cadmium,
      leadValue: metals.lead,
      mercuryValue: metals.mercury,
      arsenicValue: metals.arsenic,
      status: metalChecks.compliant ? 'PASS' : 'FAIL'
    }
  };
}
