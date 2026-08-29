import React from 'react';
import { 
  Map as MapIcon, 
  Cpu, 
  AlertTriangle, 
  Coins, 
  CheckCircle2, 
  FileCheck2,
  ArrowRight,
  ShieldCheck,
  Building,
  UploadCloud,
  FileText
} from 'lucide-react';
import { LandParcel, WardDataset } from '../../types';

interface CommandCenterProps {
  ward: WardDataset;
  onOpenWebGIS: () => void;
  onOpenPipeline: () => void;
  onOpenConflicts: () => void;
  onOpenTax: () => void;
  onSelectParcel: (parcel: LandParcel) => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  ward,
  onOpenWebGIS,
  onOpenPipeline,
  onOpenConflicts,
  onOpenTax,
  onSelectParcel
}) => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto select-none">
      {/* Top Administrative Header Banner */}
      <div className="p-5 rounded-lg bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
              Administrative Cadastre Dashboard
            </span>
            <span className="text-xs text-slate-500 font-medium">
              National Cadastral Harmonization Mission
            </span>
          </div>

          <h1 className="text-xl font-bold text-[#0F2942]">
            {ward.wardName} — Cadastral Overview
          </h1>

          <p className="text-xs text-slate-600 max-w-2xl">
            Integrated cadastral dataset reconciling historical village maps, modern high-resolution drone orthomosaics, and Record of Rights (RoR).
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenPipeline}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Run Harmonization</span>
          </button>

          <button
            onClick={onOpenWebGIS}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded bg-[#0F2942] hover:bg-[#1B365D] text-white text-xs font-semibold transition shadow-xs cursor-pointer"
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Open Land Map</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Jurisdiction Parcels Table on Left, Mini Map & Issues on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Parcel Register Table */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-700" />
                <h2 className="text-xs font-bold text-[#0F2942] uppercase tracking-wide">
                  Cadastral Parcels Register ({ward.parcels.length} Plots)
                </h2>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                WGS-84 / EPSG:4326
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-[11px] font-semibold">
                  <tr>
                    <th className="px-3 py-2">Plot ID</th>
                    <th className="px-3 py-2">Owner (RoR)</th>
                    <th className="px-3 py-2">Area (1978 / Drone)</th>
                    <th className="px-3 py-2">Confidence</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-normal text-slate-700">
                  {ward.parcels.map((p) => {
                    const isVerified = p.status === 'VERIFIED';
                    const isReview = p.status === 'REVIEW_REQUIRED';
                    const isConflict = p.status === 'CONFLICT';

                    return (
                      <tr 
                        key={p.id} 
                        className="hover:bg-slate-50 transition cursor-pointer"
                        onClick={() => onSelectParcel(p)}
                      >
                        <td className="px-3 py-2.5 font-bold font-mono text-[#0F2942]">
                          Plot {p.plotNumber}
                        </td>
                        <td className="px-3 py-2.5">
                          <div className="font-medium text-slate-900">{p.ownerName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">Khasra {p.khasraNo}</div>
                        </td>
                        <td className="px-3 py-2.5 font-mono text-[11px]">
                          <span>{p.registeredAreaSqM} m²</span>
                          <span className="text-slate-400 mx-1">/</span>
                          <span className="font-semibold text-slate-900">{p.detectedAreaSqM} m²</span>
                        </td>
                        <td className="px-3 py-2.5 font-mono font-bold">
                          <span className={isVerified ? 'text-emerald-700' : isReview ? 'text-amber-700' : 'text-red-700'}>
                            {p.confidence.overallScore}%
                          </span>
                        </td>
                        <td className="px-3 py-2.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${
                            isVerified ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            isReview ? 'bg-amber-50 text-amber-800 border-amber-200' :
                            'bg-red-50 text-red-700 border-red-200'
                          }`}>
                            {p.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectParcel(p);
                            }}
                            className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Discrepancy Summary Card */}
          <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0F2942] uppercase tracking-wide flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                Active Discrepancies Requiring Action
              </span>
              <button 
                onClick={onOpenConflicts}
                className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1"
              >
                <span>View Full Register</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded bg-red-50 border border-red-200 space-y-1">
                <div className="font-bold text-red-800 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-600" />
                  Boundary Encroachment (Plot 412/B)
                </div>
                <p className="text-[11px] text-slate-600">
                  2.5m structural shift into road setback corridor.
                </p>
              </div>

              <div className="p-2.5 rounded bg-amber-50 border border-amber-200 space-y-1">
                <div className="font-bold text-amber-800 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-600" />
                  Municipal Tax Under-Assessment
                </div>
                <p className="text-[11px] text-slate-600">
                  ₹3.5 Lakhs unassessed commercial floors identified.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Mini GIS Map Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase">Interactive Preview</div>
                <h2 className="text-sm font-bold text-[#0F2942]">Cadastral Map Viewport</h2>
              </div>

              <button
                onClick={onOpenWebGIS}
                className="px-2.5 py-1 rounded bg-[#0F2942] hover:bg-[#1B365D] text-white text-xs font-medium flex items-center gap-1"
              >
                <span>Full Map</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Mini Map Canvas */}
            <div 
              onClick={onOpenWebGIS}
              className="relative h-64 rounded bg-slate-900 border border-slate-300 overflow-hidden cursor-pointer group bg-cad-grid"
            >
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Road Corridor */}
                <rect x="88" y="0" width="12" height="100" fill="#334155" opacity="0.7" />
                <line x1="60" y1="0" x2="60" y2="100" stroke="#60A5FA" strokeWidth="0.6" strokeDasharray="1.5,1" />

                {/* Subsurface Water Main */}
                <line x1="56" y1="0" x2="56" y2="100" stroke="#38BDF8" strokeWidth="1.0" opacity="0.8" />

                {/* Parcels */}
                {ward.parcels.map((p) => {
                  const isConflict = p.status === 'CONFLICT';
                  const isReview = p.status === 'REVIEW_REQUIRED';
                  const points = p.dronePolygon.map(pt => `${pt.x},${pt.y}`).join(' ');

                  return (
                    <g key={p.id}>
                      <polygon
                        points={points}
                        fill={isConflict ? "rgba(220, 38, 38, 0.45)" : isReview ? "rgba(217, 119, 6, 0.4)" : "rgba(22, 163, 74, 0.4)"}
                        stroke={isConflict ? "#DC2626" : isReview ? "#D97706" : "#16A34A"}
                        strokeWidth="0.6"
                      />
                      <text
                        x={(p.dronePolygon[0].x + p.dronePolygon[1].x) / 2}
                        y={(p.dronePolygon[0].y + p.dronePolygon[2].y) / 2}
                        fill="#FFFFFF"
                        fontSize="2.8"
                        fontFamily="sans-serif"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {p.plotNumber}
                      </text>
                    </g>
                  );
                })}
              </svg>

              <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/20 transition flex items-center justify-center">
                <span className="px-3 py-1.5 rounded bg-white text-slate-900 font-semibold text-xs shadow-md group-hover:scale-105 transition flex items-center gap-1.5">
                  <MapIcon className="w-3.5 h-3.5 text-blue-700" />
                  <span>Click to Inspect in WebGIS</span>
                </span>
              </div>
            </div>

            {/* Mini Legend */}
            <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium pt-1 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> Verified (&gt;90%)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Review (70-90%)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600" /> Conflict (&lt;70%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

