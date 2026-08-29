import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Layers, 
  Clock, 
  IndianRupee 
} from 'lucide-react';
import { WardDataset } from '../../types';

interface TelemetryHUDProps {
  ward: WardDataset;
  averageConfidence: number;
}

export const TelemetryHUD: React.FC<TelemetryHUDProps> = ({ ward, averageConfidence }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 p-3 bg-slate-100 border-b border-slate-200 select-none">
      {/* 1. Total Plots */}
      <div className="p-2.5 rounded bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-600 text-[11px] font-medium">
          <span>Total Parcels</span>
          <span className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.2 rounded text-slate-700 font-bold">
            {ward.parcels.length}
          </span>
        </div>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-xl font-bold font-mono text-[#0F2942]">{ward.parcels.length}</span>
          <span className="text-[11px] text-slate-500">plots</span>
        </div>
      </div>

      {/* 2. Auto-Harmonized / Verified (>90% CS) */}
      <div className="p-2.5 rounded bg-white border border-emerald-200 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-emerald-800 text-[11px] font-medium">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Verified (&gt;90%)
          </span>
          <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded font-bold">
            {Math.round((ward.verifiedCount / ward.parcels.length) * 100)}%
          </span>
        </div>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-xl font-bold font-mono text-emerald-700">{ward.verifiedCount}</span>
          <span className="text-[11px] text-slate-500">auto-validated</span>
        </div>
      </div>

      {/* 3. Review Required (70-90% CS) */}
      <div className="p-2.5 rounded bg-white border border-amber-200 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-amber-800 text-[11px] font-medium">
          <span className="flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            Requires Review
          </span>
          <span className="text-[10px] font-mono bg-amber-50 text-amber-800 px-1.5 py-0.2 rounded font-bold">
            70-90%
          </span>
        </div>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-xl font-bold font-mono text-amber-700">{ward.reviewRequiredCount}</span>
          <span className="text-[11px] text-slate-500">minor slivers</span>
        </div>
      </div>

      {/* 4. Critical Conflicts (<70% CS) */}
      <div className="p-2.5 rounded bg-white border border-red-200 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-red-800 text-[11px] font-medium">
          <span className="flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
            Discrepancies
          </span>
          <span className="text-[10px] font-mono bg-red-50 text-red-700 px-1.5 py-0.2 rounded font-bold">
            Flagged
          </span>
        </div>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-xl font-bold font-mono text-red-700">{ward.conflictCount}</span>
          <span className="text-[11px] text-slate-500">critical</span>
        </div>
      </div>

      {/* 5. Municipal Tax Leakage Identified */}
      <div className="p-2.5 rounded bg-white border border-blue-200 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-blue-800 text-[11px] font-medium">
          <span className="flex items-center gap-1">
            <IndianRupee className="w-3.5 h-3.5 text-blue-600" />
            Unassessed Tax
          </span>
          <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded font-bold">
            ULB
          </span>
        </div>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-xl font-bold font-mono text-blue-800">
            ₹{(ward.totalTaxLeakageINR / 100000).toFixed(1)}L
          </span>
          <span className="text-[11px] text-slate-500">recoverable</span>
        </div>
      </div>

      {/* 6. Processing Speed Gain */}
      <div className="p-2.5 rounded bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-600 text-[11px] font-medium">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            Throughput
          </span>
          <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-bold">
            2.1s
          </span>
        </div>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-lg font-bold font-mono text-[#0F2942]">2.1s / ward</span>
          <span className="text-[11px] text-slate-500">automated</span>
        </div>
      </div>
    </div>
  );
};
