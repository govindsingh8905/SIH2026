import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  MapPin, 
  Waves, 
  Building, 
  ArrowRight,
  Filter,
  Check
} from 'lucide-react';
import { LandParcel, WardDataset } from '../../types';

interface ConflictTableProps {
  ward: WardDataset;
  onSelectParcel: (parcel: LandParcel) => void;
  onAutoHealParcel: (parcelId: string) => void;
}

export const ConflictTable: React.FC<ConflictTableProps> = ({
  ward,
  onSelectParcel,
  onAutoHealParcel
}) => {
  const [filterType, setFilterType] = useState<string>('ALL');

  const conflictingParcels = ward.parcels.filter(p => p.status === 'CONFLICT' || p.status === 'REVIEW_REQUIRED');

  const filteredList = conflictingParcels.filter(p => {
    if (filterType === 'ENCROACHMENT') return p.encroachmentDetails?.isEncroaching;
    if (filterType === 'UTILITY') return p.utility?.isColliding;
    if (filterType === 'BOUNDARY') return p.status === 'REVIEW_REQUIRED';
    return true;
  });


  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-lg bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-red-50 text-red-800 border border-red-200">
              Discrepancy Registry
            </span>
            <span className="text-xs text-slate-500 font-medium">Jurisdiction: {ward.wardName}</span>
          </div>
          <h1 className="text-xl font-bold text-[#0F2942] mt-1">
            Cadastral Discrepancy & Conflict Register
          </h1>
          <p className="text-xs text-slate-600">
            Detected spatial overlaps, statutory road setback violations, and subsurface utility collisions requiring administrative review.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded border border-slate-300 text-xs">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1 rounded font-medium transition cursor-pointer ${
              filterType === 'ALL' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({conflictingParcels.length})
          </button>
          <button
            onClick={() => setFilterType('ENCROACHMENT')}
            className={`px-3 py-1 rounded font-medium transition cursor-pointer ${
              filterType === 'ENCROACHMENT' ? 'bg-white text-red-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-red-700'
            }`}
          >
            Road Setback
          </button>
          <button
            onClick={() => setFilterType('UTILITY')}
            className={`px-3 py-1 rounded font-medium transition cursor-pointer ${
              filterType === 'UTILITY' ? 'bg-white text-blue-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-blue-700'
            }`}
          >
            Utility Collisions
          </button>
          <button
            onClick={() => setFilterType('BOUNDARY')}
            className={`px-3 py-1 rounded font-medium transition cursor-pointer ${
              filterType === 'BOUNDARY' ? 'bg-white text-amber-700 shadow-2xs font-bold' : 'text-slate-600 hover:text-amber-700'
            }`}
          >
            Boundary Review
          </button>
        </div>
      </div>

      {/* Discrepancies Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[#0F2942] border-b border-slate-200 font-bold uppercase text-[11px] tracking-wider">
                <th className="p-3.5">Plot & Owner</th>
                <th className="p-3.5">Discrepancy Category</th>
                <th className="p-3.5">Affected Area</th>
                <th className="p-3.5">Severity</th>
                <th className="p-3.5">Confidence Score</th>
                <th className="p-3.5 text-right">Administrative Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredList.map((parcel) => {
                const isConflict = parcel.status === 'CONFLICT';
                const isResolved = parcel.isResolved;

                return (
                  <tr key={parcel.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 text-sm">Plot {parcel.plotNumber}</div>
                      <div className="text-[11px] text-slate-500">{parcel.ownerName} · Khasra {parcel.khasraNo}</div>
                      <div className="text-[10px] font-mono text-blue-700 mt-0.5">{parcel.ulpin}</div>
                    </td>

                    <td className="p-3.5">
                      <div className="space-y-1">
                        {parcel.encroachmentDetails?.isEncroaching ? (
                          <div className="flex items-center gap-1.5 text-red-700 font-semibold">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                            <span>Road Setback Encroachment (2.5m shift)</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-amber-700 font-semibold">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                            <span>Boundary Edge Deviation with Plot 412/A</span>
                          </div>
                        )}

                        {parcel.utility?.isColliding && (
                          <div className="flex items-center gap-1.5 text-blue-700 text-[11px]">
                            <Waves className="w-3.5 h-3.5 shrink-0" />
                            <span>Intersects {parcel.utility.utilityType} ({parcel.utility.depthMeters}m depth)</span>
                          </div>
                        )}
                      </div>
                    </td>


                    <td className="p-3.5">
                      <div className="font-semibold text-slate-900">
                        {parcel.encroachmentDetails?.encroachmentAreaSqM || 18.0} m²
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Total: {parcel.detectedAreaSqM} m² (RoR: {parcel.registeredAreaSqM} m²)
                      </div>
                    </td>

                    <td className="p-3.5">
                      {isResolved ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">
                          <Check className="w-3 h-3" />
                          RESOLVED
                        </span>
                      ) : isConflict ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 font-bold text-[10px]">
                          <AlertTriangle className="w-3 h-3" />
                          HIGH SEVERITY
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-bold text-[10px]">
                          MODERATE
                        </span>
                      )}
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 h-2 rounded overflow-hidden border border-slate-200">
                          <div
                            className={`h-full ${
                              parcel.confidence.overallScore >= 90 ? 'bg-emerald-600' :
                              parcel.confidence.overallScore >= 70 ? 'bg-amber-500' : 'bg-red-600'
                            }`}
                            style={{ width: `${parcel.confidence.overallScore}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold text-slate-800 text-xs">
                          {parcel.confidence.overallScore}%
                        </span>
                      </div>
                    </td>

                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => onSelectParcel(parcel)}
                        className="px-2.5 py-1.5 rounded bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium text-xs transition cursor-pointer"
                      >
                        Inspect on Map
                      </button>

                      {!isResolved && (
                        <button
                          onClick={() => onAutoHealParcel(parcel.id)}
                          className="px-2.5 py-1.5 rounded bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs shadow-xs transition cursor-pointer"
                        >
                          Auto-Heal (ST_Snap)
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

