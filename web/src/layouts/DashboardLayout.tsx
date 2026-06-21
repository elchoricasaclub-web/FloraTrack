import React, { ReactNode, useState } from 'react';
import { useComplianceStore } from '../store';

interface DashboardLayoutProps {
  children: ReactNode;
  userEmail?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  userEmail = 'elchoricasaclub@gmail.com'
}) => {
  const { complianceStandard, setComplianceStandard, isSyncing, selectedBatch } = useComplianceStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* 1. Left Professional Traceability Nav Drawer */}
      <aside className={`fixed lg:static inset-y-0 left-0 bg-slate-900 text-white border-r border-slate-800 flex flex-col shrink-0 w-80 transform transition-transform duration-300 ease-in-out z-50 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center font-black text-slate-950 text-base shadow-lg shadow-emerald-500/20">
              FT
            </span>
            <div>
              <h1 className="text-sm font-black tracking-tight leading-none uppercase">FloraTrack Pro</h1>
              <span className="text-[10px] text-emerald-400 font-extrabold tracking-wider uppercase">GACP / EU-GMP SaaS</span>
            </div>
          </div>
          <button 
            className="lg:hidden text-slate-400 hover:text-white"
            onClick={() => setMobileMenuOpen(false)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-1.5 text-[11px] font-semibold text-slate-400">
            <div className="flex justify-between items-center">
              <span>Standard Scheme:</span>
              <span className="text-emerald-400 uppercase font-black">{complianceStandard}</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span>Active Batch:</span>
              <span className="text-purple-400 font-mono font-bold truncate max-w-[120px]">
                {selectedBatch ? selectedBatch.batchCode : 'LT-NONE'}
              </span>
            </div>
          </div>
        </div>

        {/* Standard Menu list */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
            Operations Console
          </span>

          <a
            href="#dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 font-bold text-xs"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Live Batch Dashboard
          </a>

          <a
            href="#sops"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-colors font-semibold text-xs"
          >
            <span className="w-2 h-2 rounded-full bg-slate-600" />
            SOPs & GACP Library
          </a>

          <a
            href="#audits"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-colors font-semibold text-xs"
          >
            <span className="w-2 h-2 rounded-full bg-slate-600" />
            Certifications & Audits
          </a>

          <a
            href="#telemetry"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-colors font-semibold text-xs"
          >
            <span className="w-2 h-2 rounded-full bg-slate-600" />
            IoT Substrate Sensors
          </a>

          <span className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest block mt-6 mb-2">
            Compliance Schemes
          </span>

          <button
            onClick={() => { setComplianceStandard('WHO_GACP'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all ${
              complianceStandard === 'WHO_GACP'
                ? 'bg-slate-800 text-white font-bold border-l-2 border-emerald-400'
                : 'text-slate-400 font-medium hover:bg-slate-800/50'
            }`}
          >
            <span>WHO GACP Guidelines</span>
            <span className="text-[8px] px-1.5 py-0.5 rounded font-black bg-emerald-400/20 text-emerald-400">
              GLOBAL
            </span>
          </button>

          <button
            onClick={() => { setComplianceStandard('EU_GMP'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all ${
              complianceStandard === 'EU_GMP'
                ? 'bg-slate-800 text-white font-bold border-l-2 border-emerald-400'
                : 'text-slate-400 font-medium hover:bg-slate-800/50'
            }`}
          >
            <span>EMA EU-GMP Vol. 4</span>
            <span className="text-[8px] px-1.5 py-0.5 rounded font-black bg-purple-400/20 text-purple-400">
              EU
            </span>
          </button>
        </nav>

        {/* Bottom Profile Information */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-400 text-slate-950 font-black flex items-center justify-center text-xs shrink-0">
              AG
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold block truncate text-slate-200">GACP Supervisor</span>
              <span className="text-[10px] text-slate-500 block truncate">{userEmail}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. Right Main Working Console Area */}
      <main className="flex-1 flex flex-col min-w-0 w-full lg:w-[calc(100%-20rem)] lg:ml-0">
        {/* Top Control Header */}
        <header className="h-16 bg-white border-b border-slate-100 flex justify-between items-center shadow-sm px-4 lg:px-8">
          <div className="flex items-center gap-3 shrink-0">
            <button 
              className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-800 rounded-lg"
              onClick={() => setMobileMenuOpen(true)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="hidden sm:inline-block text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2.5 py-1 rounded-lg">
              SaaS Console
            </span>
            {isSyncing && (
              <div className="flex items-center gap-2 max-w-xs shrink-0">
                <div className="w-3.5 h-3.5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin shrink-0" />
                <span className="text-[9px] font-bold text-slate-400 hidden sm:inline">ALCOA+ CRYPTO SYNCING...</span>
              </div>
            )}
          </div>

          {/* Rapid verification stats */}
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-4 shrink-0">
            <div className="flex items-center justify-center gap-1.5 bg-emerald-50 text-emerald-700 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-emerald-100 text-[8px] sm:text-[10px] font-black uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              GACP CERTIFIED
            </div>
            <div className="hidden min-[400px]:flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-indigo-100 text-[8px] sm:text-[10px] font-black uppercase tracking-wider">
              GMP COMPLIANT
            </div>
          </div>
        </header>

        {/* Main Body */}
        <div className="flex-1 p-4 lg:p-8 overflow-x-hidden overflow-y-auto max-w-7xl w-full mx-auto relative">
          {children}
        </div>
      </main>
    </div>
  );
};

