/**
 * GACP Compliance Calculator and Score Engine for Agricultural SaaS
 * Implements weighted scoring based on World Health Organization guidelines,
 * penalizing major infractions while highlighting verified procedural integrity (ALCOA+ standard).
 */

import { GacpRequirement } from '../types/agricultural';

export interface ScoreBreakdown {
  score: number;
  grade: 'A' | 'B' | 'C' | 'FAIL';
  gacpStatus: 'CERTIFIED' | 'MINOR_REMEDIES_REQUIRED' | 'MAJOR_REMEDIES_REQUIRED' | 'NON_COMPLIANT';
  sections: Record<string, { total: number; verified: number; percent: number }>;
}

/**
 * Calculates current compliance index based on live checklist items
 */
export function calculateGacpIndex(requirements: GacpRequirement[]): ScoreBreakdown {
  if (requirements.length === 0) {
    return {
      score: 100,
      grade: 'A',
      gacpStatus: 'CERTIFIED',
      sections: {}
    };
  }

  // Section details
  const sections: Record<string, { total: number; verified: number; percent: number }> = {};

  let totalWeight = 0;
  let earnedWeight = 0;
  let criticalFailure = false;

  requirements.forEach((req) => {
    // 1. Group statistics by standard section
    if (!sections[req.section]) {
      sections[req.section] = { total: 0, verified: 0, percent: 0 };
    }
    sections[req.section].total += 1;
    if (req.verified) {
      sections[req.section].verified += 1;
    }

    // 2. Weight by criticality:
    // CRITICAL: Must be perfect. A fail reduces status directly to non-compliant.
    // MAJOR: Weighted heavily.
    // MINOR: Small weight.
    let weight = 10;
    if (req.criticality === 'CRITICAL') {
      weight = 50;
      if (!req.verified) {
        criticalFailure = true;
      }
    } else if (req.criticality === 'MAJOR') {
      weight = 25;
    }

    totalWeight += weight;
    if (req.verified) {
      earnedWeight += weight;
    }
  });

  // Calculate percentages per section
  Object.keys(sections).forEach((key) => {
    const s = sections[key];
    s.percent = Math.round((s.verified / s.total) * 100);
  });

  // Base raw math score percentage
  let rawScore = Math.round((earnedWeight / totalWeight) * 100);

  // Apply penalty rules based on WHO directives
  if (criticalFailure) {
    // Maximum allowable score with secondary critical loophole failures is capped
    rawScore = Math.min(rawScore, 50);
  }

  let grade: 'A' | 'B' | 'C' | 'FAIL' = 'FAIL';
  let gacpStatus: ScoreBreakdown['gacpStatus'] = 'NON_COMPLIANT';

  if (rawScore >= 95 && !criticalFailure) {
    grade = 'A';
    gacpStatus = 'CERTIFIED';
  } else if (rawScore >= 85 && !criticalFailure) {
    grade = 'B';
    gacpStatus = 'MINOR_REMEDIES_REQUIRED';
  } else if (rawScore >= 70 && !criticalFailure) {
    grade = 'C';
    gacpStatus = 'MAJOR_REMEDIES_REQUIRED';
  } else {
    grade = 'FAIL';
    gacpStatus = 'NON_COMPLIANT';
  }

  return {
    score: rawScore,
    grade,
    gacpStatus,
    sections
  };
}

/**
 * Validates data records according to the ALCOA+ data integrity model
 * (Attributable, Legible, Contemporaneous, Original, Accurate, Complete, Consistent, Enduring, Available)
 */
export function verifyAlcoaDataIntegrity(data: {
  hasSignature: boolean;
  isSignedAtCorrectTime: boolean;
  hasImmutableHash: boolean;
  historyLogCount: number;
}): {
  integrityPassed: boolean;
  alcoaScore: number;
  remarks: string;
} {
  let score = 0;
  if (data.hasSignature) score += 30; // Attributable
  if (data.isSignedAtCorrectTime) score += 20; // Contemporaneous
  if (data.hasImmutableHash) score += 30; // Original & Accurate (hash sealed)
  if (data.historyLogCount > 0) score += 20; // Consistent & Complete

  let remarks = 'Critically deficient record integrity. Fails baseline pharma compliance auditing.';
  if (score >= 90) {
    remarks = 'SECURED DATA RECORD: Complies fully with ALCOA+ dynamic pharma documentation standards.';
  } else if (score >= 70) {
    remarks = 'PARTIALLY AGREEABLE INTEGRITY: Rectification recommended for electronic signatures.';
  }

  return {
    integrityPassed: score >= 90,
    alcoaScore: score,
    remarks
  };
}
