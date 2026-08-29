import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Layers, 
  Coins, 
  Languages, 
  Waves, 
  AlertTriangle,
  FileCheck2,
  Check,
  CheckCircle2,
  Calculator
} from 'lucide-react';
import { LandParcel } from '../../types';

interface PlotDetailsDrawerProps {
  parcel: LandParcel | null;
  onClose: () => void;
  onGenerateCertificate: (parcel: LandParcel) => void;
  onAutoHeal: (parcelId: string) => void;
}

export const PlotDetailsDrawer: React.FC<PlotDetailsDrawerProps> = ({
  parcel,
  onClose,
  onGenerateCertificate,
  onAutoHeal
}) => {
  const [isHealing, setIsHealing] = useState(false);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'TAX' | 'TOPOLOGY' | 'BHASHINI'>('OVERVIEW');

  if (!parcel) return null;

  const isConflict = parcel.status === 'CONFLICT';
  const isReview = parcel.status === 'REVIEW_REQUIRED';
  const isVerified = parcel.status === 'VERIFIED';

  const handleTriggerAutoHeal = () => {
    setIsHealing(true);
    setTimeout(() => {
      onAutoHeal(parcel.id);
      setIsHealing(false);
    }, 800);
  };

  return (
    <div className="w-96 md:w-[420px] bg-white border-l border-slate-200 flex flex-col h-full overflow-hidden shadow-xl z-30 shrink-0 select-none">
      {/* Drawer Header */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded border ${
            isConflict ? 'bg-red-50 text-red-700 border-red-200' :
            isReview ? 'bg-amber-50 text-amber-800 border-amber-200' :
            'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}>
            <MapPin className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#0F2942]">Plot {parcel.plotNumber}</h2>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                isConflict ? 'bg-red-50 text-red-700 border-red-200' :
                isReview ? 'bg-amber-50 text-amber-800 border-amber-200' :
                'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                {parcel.status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-[11px] font-mono text-blue-800">ULPIN: {parcel.ulpin}</p>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="p-1.5 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition cursor-pointer"
          title="Close drawer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50 p-1 text-xs">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`flex-1 py-1.5 rounded font-medium transition cursor-pointer ${
            activeTab === 'OVERVIEW' ? 'bg-white text-blue-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('TAX')}
          className={`flex-1 py-1.5 rounded font-medium transition flex items-center justify-center gap-1 cursor-pointer ${
            activeTab === 'TAX' ? 'bg-white text-blue-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Coins className="w-3.5 h-3.5 text-blue-700" />
          Tax Audit
        </button>
        <button
          onClick={() => setActiveTab('TOPOLOGY')}
          className={`flex-1 py-1.5 rounded font-medium transition cursor-pointer ${
            activeTab === 'TOPOLOGY' ? 'bg-white text-blue-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Topology
        </button>
        <button
          onClick={() => setActiveTab('BHASHINI')}
          className={`flex-1 py-1.5 rounded font-medium transition cursor-pointer ${
            activeTab === 'BHASHINI' ? 'bg-white text-blue-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Land Record
        </button>
      </div>

      {/* Drawer Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {activeTab === 'OVERVIEW' && (
          <>
            {/* Confidence Score Card */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#0F2942]">
                  Verification Confidence Score
                </span>
                <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded border ${
                  parcel.confidence.overallScore >= 90 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  parcel.confidence.overallScore >= 70 ? 'bg-amber-50 text-amber-800 border-amber-200' :
                  'bg-red-50 text-red-700 border-red-200'
                }`}>
                  {parcel.confidence.overallScore}%
                </span>
              </div>

              <div className="space-y-2 text-slate-600">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span>Spatial Boundary Overlap (IoU)</span>
                    <span className="font-mono text-slate-900 font-bold">{parcel.confidence.iouScore}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded overflow-hidden">
                    <div className="bg-emerald-600 h-full" style={{ width: `${parcel.confidence.iouScore}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span>Edge Fit Precision (Hausdorff)</span>
                    <span className="font-mono text-slate-900 font-bold">{parcel.confidence.hausdorffScore}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded overflow-hidden">
                    <div className="bg-blue-600 h-full" style={{ width: `${parcel.confidence.hausdorffScore}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span>Record of Rights Match (Bhashini)</span>
                    <span className="font-mono text-slate-900 font-bold">{parcel.confidence.nlpScore}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded overflow-hidden">
                    <div className="bg-purple-600 h-full" style={{ width: `${parcel.confidence.nlpScore}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Encroachment Alert if present */}
            {parcel.encroachmentDetails?.isEncroaching && !parcel.isResolved && (
              <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 space-y-1.5">
                <div className="flex items-center gap-2 text-red-800 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span>Road Setback Encroachment Detected</span>
                </div>
                <p className="text-slate-700 text-[11px] leading-relaxed">
                  Physical structure extends beyond registered boundary by <strong>{parcel.encroachmentDetails.linearShiftMeters} meters</strong> (<strong>{parcel.encroachmentDetails.encroachmentAreaSqM} m² overlap</strong> into statutory road setback).
                </p>
              </div>
            )}

            {/* Subsurface Water Pipeline Hazard Alert */}
            {parcel.utility.isColliding && (
              <div className="p-3.5 rounded-lg bg-blue-50 border border-blue-200 space-y-1.5">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
                  <Waves className="w-4 h-4 text-blue-700" />
                  <span>Subsurface Utility Collision</span>
                </div>
                <p className="text-slate-700 text-[11px] leading-relaxed">
                  {parcel.utility.description}
                </p>
                <div className="text-[10px] font-mono text-blue-900">
                  Layer: {parcel.utility.utilityType} (Depth: {parcel.utility.depthMeters}m)
                </div>
              </div>
            )}

            {/* Area Reconciliation */}
            <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-2xs space-y-2.5">
              <span className="font-bold text-[#0F2942] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-700" />
                Area Reconciliation (m²)
              </span>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-500 font-medium">1978 RoR</div>
                  <div className="text-xs font-bold font-mono text-amber-800">{parcel.registeredAreaSqM} m²</div>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-500 font-medium">Drone Survey</div>
                  <div className="text-xs font-bold font-mono text-blue-900">{parcel.detectedAreaSqM} m²</div>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-500 font-medium">Harmonized</div>
                  <div className="text-xs font-bold font-mono text-emerald-800">{parcel.harmonizedAreaSqM} m²</div>
                </div>
              </div>
            </div>

            {/* Land Ownership Details */}
            <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-2xs space-y-2">
              <span className="font-bold text-[#0F2942]">Ownership Details</span>
              <div className="space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>Owner Name:</span>
                  <strong className="text-slate-900">{parcel.ownerName}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Khasra / Khata:</span>
                  <span className="font-mono text-slate-900 font-semibold">{parcel.khasraNo} / {parcel.khataNo}</span>
                </div>
                <div className="flex justify-between">
                  <span>Jurisdiction:</span>
                  <span>{parcel.ward}, {parcel.district}</span>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'TAX' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bold text-[#0F2942] text-xs flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-blue-700" />
                  Property Tax Assessment
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300">
                  {parcel.tax.taxStatus}
                </span>
              </div>

              <div className="space-y-2 text-slate-700 text-xs">
                <div className="flex justify-between pb-1 border-b border-slate-100">
                  <span className="text-slate-500">Declared in Tax Register:</span>
                  <strong>{parcel.tax.registeredFloorCount} Floor ({parcel.tax.registeredPropertyType})</strong>
                </div>
                <div className="flex justify-between pb-1 border-b border-slate-100">
                  <span className="text-slate-500">Drone Survey Detected:</span>
                  <strong className="text-blue-900 font-bold">{parcel.tax.detectedFloorCount} Floors ({parcel.tax.detectedPropertyType})</strong>
                </div>
                <div className="flex justify-between pb-1 border-b border-slate-100">
                  <span className="text-slate-500">Declared Tax:</span>
                  <span className="font-mono">₹{parcel.tax.declaredAnnualTax.toLocaleString('en-IN')}/yr</span>
                </div>
                <div className="flex justify-between pb-1 border-b border-slate-100">
                  <span className="text-slate-500">Assessed Fair Tax:</span>
                  <span className="font-mono text-emerald-800 font-bold">₹{parcel.tax.assessedFairTax.toLocaleString('en-IN')}/yr</span>
                </div>
                <div className="flex justify-between pt-1 text-sm font-bold text-red-800">
                  <span>Tax Dues:</span>
                  <span className="font-mono">₹{parcel.tax.taxGapAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'TOPOLOGY' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-2xs space-y-2">
              <span className="font-bold text-[#0F2942]">Topology Snapping Engine</span>
              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">PostGIS ST_Snap Tolerance:</span>
                  <span className="font-mono font-bold text-slate-900">0.05 meters</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Self-Intersections:</span>
                  <span className="text-emerald-700 font-semibold">0 (Clean)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Topological Status:</span>
                  <span>{parcel.status === 'CONFLICT' ? 'Overlap Flagged' : 'Valid Surface'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'BHASHINI' && (
          <div className="space-y-3">
            <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bold text-[#0F2942] text-xs flex items-center gap-1.5">
                  <Languages className="w-4 h-4 text-blue-700" />
                  Regional Land Record Extract
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {parcel.bhashini.matchConfidence}% Match
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2 rounded bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-500 mb-0.5">Original Regional Text:</div>
                  <div className="font-medium text-slate-900">{parcel.bhashini.rawRegionalText}</div>
                </div>

                <div className="p-2 rounded bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-500 mb-0.5">Standardized English Translation:</div>
                  <div className="text-slate-900 font-medium">{parcel.bhashini.translatedEnglishText}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Drawer Action Footer */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-2">
        {parcel.status !== 'VERIFIED' && (
          <button
            onClick={handleTriggerAutoHeal}
            disabled={isHealing}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded text-xs font-bold transition shadow-xs cursor-pointer ${
              isHealing
                ? 'bg-amber-100 text-amber-900 border border-amber-300 cursor-wait'
                : 'bg-[#15803D] hover:bg-[#166534] text-white'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>{isHealing ? 'Applying PostGIS ST_Snap...' : 'Auto-Heal & Validate (ST_Snap)'}</span>
          </button>
        )}

        <button
          onClick={() => onGenerateCertificate(parcel)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded bg-[#0F2942] hover:bg-[#1B365D] text-white text-xs font-bold transition shadow-xs cursor-pointer"
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Generate Cadastral Certificate</span>
        </button>
      </div>
    </div>
  );
};

