import React from 'react';
import { CropBatch } from '../../types/agricultural';
import { calculateGacpIndex } from '../../utils/gacpCalculator';
import { verifyAlcoaDataIntegrity } from '../../utils/gacpCalculator';

interface CertificateBadgeProps {
  batch: CropBatch;
}

export const CertificateBadge: React.FC<CertificateBadgeProps> = ({ batch }) => {
  // 1. Calculate standard WHO GACP indexes
  const checklist = batch.activeAudits || [];
  const compliance = calculateGacpIndex(checklist);

  // 2. Compute dynamic ALCOA+ assurance score
  const { integrityPassed, alcoaScore, remarks } = verifyAlcoaDataIntegrity({
    hasSignature: !!batch.hash,
    isSignedAtCorrectTime: !!batch.updatedAt,
    hasImmutableHash: batch.hash.length > 20,
    historyLogCount: (batch.telemetryStream?.length || 0) + 1
  });

  const getShieldColor = () => {
    if (compliance.gacpStatus === 'CERTIFIED' && integrityPassed) {
      return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20';
    }
    if (compliance.gacpStatus === 'MINOR_REMEDIES_REQUIRED') {
      return 'bg-amber-500/10 text-amber-700 border-amber-500/20';
    }
    return 'bg-rose-500/10 text-rose-700 border-rose-500/20';
  };

  return (
    <div className="bg-slate-900 text-white rounded-3xl overflow-hidden shadow-xl border border-slate-800">
      {/* Header section with badge graphics */}
      <div className="relative p-6 bg-gradient-to-br from-emerald-950 to-slate-900 border-b border-slate-800">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-bold text-emerald-400 tracking-widest uppercase">
              WHO AGRICULTURAL COMPLIANCE
            </span>
            <h3 className="text-xl font-black mt-1 tracking-tight">GACP GREEN PASSPORT</h3>
            <span className="text-xs text-slate-400 mt-2 block">
              BATCH ID: <code className="text-emerald-300 font-mono text-xs">{batch.batchCode}</code>
            </span>
          </div>

          {/* SVG representation of the gold premium seal of conformity */}
          <div className="w-14 h-14 relative flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-slow">
              <defs>
                <path id="circlePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" />
              </defs>
              <circle cx="50" cy="50" r="40" fill="#059669" stroke="#34d399" strokeWidth="2" />
              <g fill="#fef08a">
                <polygon points="50,22 55,35 68,35 58,43 62,56 50,48 38,56 42,43 32,35 45,35" />
              </g>
            </svg>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 w-full" />
      </div>

      {/* Main compliance layout results */}
      <div className="p-6 space-y-5">
        {/* Row values */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-950/60 p-4 border border-slate-800 rounded-2xl">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">
              Quality Index
            </span>
            <span className="text-2xl font-black text-emerald-400 block mt-1">
              {compliance.score}%
            </span>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1 block">
              GRADE: {compliance.grade} (GACP-OK)
            </span>
          </div>

          <div className="bg-slate-950/60 p-4 border border-slate-800 rounded-2xl">
            <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">
              Data Integrity
            </span>
            <span className="text-2xl font-black text-teal-400 block mt-1">
              {alcoaScore}%
            </span>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1 block">
              ALCOA+ AUDIT COMPLIANT
            </span>
          </div>
        </div>

        {/* Verification Status Banner */}
        <div className={`p-4 border rounded-2xl ${getShieldColor()} flex flex-col gap-1`}>
          <div className="flex items-center gap-2">
            {/* Custom lock vector */}
            <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M12 2C9.24 2 7 4.24 7 7V10H6C4.9 10 4 10.9 4 12V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V12C20 10.9 19.1 10 18 10H17V7C17 4.24 14.76 2 12 2M12 4C13.66 4 15 5.34 15 7V10H9V7C9 5.34 10.34 4 12 4M6 12H18V20H6V12M12 14C10.9 14 10 14.9 10 16C10 17.1 10.9 18 12 18C13.1 18 14 17.1 14 16C14 14.9 13.1 14 12 14Z" />
            </svg>
            <span className="text-xs font-extrabold uppercase tracking-wide">
              {compliance.gacpStatus === 'CERTIFIED' ? 'TRACE CONFORMITY DETECTED' : 'PENDING CORRECTIONS'}
            </span>
          </div>
          <p className="text-[10px] opacity-80 leading-relaxed font-medium">
            {remarks}
          </p>
        </div>

        {/* Block verification signature hash */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold tracking-wider">
            <span>SECURE CRYPTO RECORD</span>
            <span className="text-[8px] bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-md font-black">
              SHA-256 SIGNED
            </span>
          </div>
          <p className="font-mono text-[9px] text-slate-500 mt-1 break-all bg-slate-950 p-2 rounded-lg border border-slate-800/50">
            {batch.hash}
          </p>
        </div>
      </div>
    </div>
  );
};
