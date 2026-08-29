import React, { useState } from 'react';
import { 
  Building2, 
  Play, 
  FileCheck2, 
  MapPin, 
  ChevronDown,
  Globe,
  UserCheck,
  ShieldCheck,
  Radio
} from 'lucide-react';
import { WardDataset } from '../../types';

interface HeaderProps {
  currentWard: WardDataset;
  onSelectWard: (wardId: string) => void;
  onOpenCertificateModal: () => void;
  selectedPlotId: string | null;
  onTriggerHarmonization: () => void;
  isHarmonizing: boolean;
  onOpenGuide?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentWard,
  onSelectWard,
  onOpenCertificateModal,
  selectedPlotId,
  onTriggerHarmonization,
  isHarmonizing,
  onOpenGuide
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<'EN' | 'HI'>('EN');

  return (
    <header className="bg-white border-b border-slate-200 z-30 sticky top-0 shadow-xs select-none">
      {/* Top National Identity Bar */}
      <div className="bg-[#0F2942] text-white px-4 py-1.5 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-2">
          {/* Government of India Identity */}
          <div className="flex items-center gap-2 font-medium tracking-wide">
            <span className="text-amber-400 font-bold">भारत सरकार</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-200">Government of India</span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline text-slate-300">Ministry of Rural Development (MoRD) · Department of Land Resources (DoLR)</span>
          </div>
        </div>

        {/* Top Utility Links */}
        <div className="flex items-center gap-3">
          {/* Quick Guide Trigger */}
          {onOpenGuide && (
            <button
              onClick={onOpenGuide}
              className="text-amber-300 hover:text-amber-200 font-bold text-[10px] flex items-center gap-1 cursor-pointer"
            >
              <span>📖 सिस्टम गाइड (How It Works)</span>
            </button>
          )}

          <span className="hidden sm:inline text-slate-500">|</span>

          {/* CORS RTK Status */}
          <div className="hidden lg:flex items-center gap-1.5 text-[10px] text-slate-300 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            <span>CORS GNSS: <strong>JH-RAN-01 (RTK Locked)</strong></span>
          </div>

          <span className="hidden sm:inline text-slate-500">|</span>

          {/* Language Selector */}
          <div className="flex items-center gap-1 text-[11px]">
            <Globe className="w-3 h-3 text-slate-300" />
            <button 
              onClick={() => setSelectedLanguage('EN')}
              className={`px-1.5 py-0.5 rounded transition ${selectedLanguage === 'EN' ? 'bg-blue-800 text-white font-bold' : 'text-slate-300 hover:text-white'}`}
            >
              English
            </button>
            <span>/</span>
            <button 
              onClick={() => setSelectedLanguage('HI')}
              className={`px-1.5 py-0.5 rounded transition ${selectedLanguage === 'HI' ? 'bg-blue-800 text-white font-bold' : 'text-slate-300 hover:text-white'}`}
            >
              हिन्दी
            </button>
          </div>

          <span className="hidden sm:inline text-slate-500">|</span>

          {/* Officer Session Badge */}
          <div className="flex items-center gap-1.5 text-slate-200">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Officer ID: <strong>REV-RAN-4021</strong></span>
          </div>
        </div>
      </div>

      {/* Main Departmental Navigation Banner */}
      <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Portal Name */}
        <div className="flex items-center gap-3">
          {/* Emblem Motif */}
          <div className="w-10 h-10 rounded bg-[#0F2942] text-amber-400 flex flex-col items-center justify-center font-bold text-xs border border-slate-300 shrink-0">
            <span className="text-[10px] tracking-tighter leading-none">सत्यमेव</span>
            <span className="text-[8px] tracking-tighter leading-none">जयते</span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-[#0F2942]">
                GeoSync <span className="text-[#1B365D]">NAKSHA</span>
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                National Cadastral Portal
              </span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium">
              National Cadastral Integration & Intelligent Harmonization Platform (DILRMP)
            </p>
          </div>
        </div>

        {/* Functional Actions: Ward Switcher, Harmonize, Certificate */}
        <div className="flex items-center gap-2.5">
          {/* Jurisdiction / Ward Selector */}
          <div className="relative flex items-center">
            <select 
              value={currentWard.wardId} 
              onChange={(e) => onSelectWard(e.target.value)}
              aria-label="Select Ward Jurisdiction"
              className="appearance-none bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-semibold pl-3 pr-8 py-2 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-800 transition cursor-pointer"
            >
              <option value="JH-RAN-W14">📍 Ward 14, Main Road, Ranchi (Jharkhand)</option>
              <option value="MH-PUN-W08">📍 Ward 08, Kothrud Corridor, Pune (Maharashtra)</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 pointer-events-none" />
          </div>

          {/* Start Harmonization Action */}
          <button
            onClick={onTriggerHarmonization}
            disabled={isHarmonizing}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded text-xs font-bold transition shadow-xs cursor-pointer ${
              isHarmonizing
                ? 'bg-amber-100 text-amber-800 border border-amber-300 cursor-wait'
                : 'bg-[#15803D] hover:bg-[#166534] text-white'
            }`}
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isHarmonizing ? 'animate-spin' : ''}`} />
            <span>{isHarmonizing ? 'Processing Pipeline...' : 'Start Harmonization'}</span>
          </button>

          {/* Generate Cadastral Certificate */}
          <button
            onClick={onOpenCertificateModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded bg-[#0F2942] hover:bg-[#1B365D] text-white text-xs font-semibold transition shadow-xs cursor-pointer"
            title="Generate Official Cadastral Verification Certificate (PDF)"
          >
            <FileCheck2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Export Certificate</span>
          </button>
        </div>
      </div>
    </header>
  );
};


