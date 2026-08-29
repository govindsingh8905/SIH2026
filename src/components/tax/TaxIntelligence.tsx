import React, { useState } from 'react';
import { 
  Building, 
  CheckCircle2, 
  Send, 
  Calculator,
  Coins,
  ArrowRight
} from 'lucide-react';
import { LandParcel, WardDataset } from '../../types';

interface TaxIntelligenceProps {
  ward: WardDataset;
  onSelectParcel: (parcel: LandParcel) => void;
}

export const TaxIntelligence: React.FC<TaxIntelligenceProps> = ({ ward, onSelectParcel }) => {
  const [issuedNotices, setIssuedNotices] = useState<string[]>([]);
  const [calcFloors, setCalcFloors] = useState<number>(3);
  const [calcArea, setCalcArea] = useState<number>(585);
  const [calcType, setCalcType] = useState<'Commercial' | 'Residential'>('Commercial');

  const handleIssueDemandNotice = (plotId: string) => {
    setIssuedNotices([...issuedNotices, plotId]);
  };

  const calculatedTax = Math.round(calcArea * calcFloors * (calcType === 'Commercial' ? 45 : 15) * 0.25);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto select-none">
      {/* Header & Metric */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-lg bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
              Municipal Property Tax Audit
            </span>
            <span className="text-xs text-slate-500 font-medium">Jurisdiction: {ward.wardName}</span>
          </div>
          <h1 className="text-xl font-bold text-[#0F2942] mt-1">
            Property Tax Assessment Ledger
          </h1>
          <p className="text-xs text-slate-600">
            Cross-referencing drone elevation models (DSM) against municipal registers to verify declared built-up floors and assess tax dues.
          </p>
        </div>

        {/* Total Recoverable Revenue Metric Card */}
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-3">
          <div className="p-2 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-emerald-800 font-medium">Total Recoverable Tax Dues</div>
            <div className="text-xl font-bold font-mono text-emerald-950">
              ₹{(ward.totalTaxLeakageINR).toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Comparison Table on Left, Live Simulator on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Comparison Table (8 cols) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="text-xs font-bold text-[#0F2942] uppercase tracking-wide px-1">
            Municipal Property Tax Reconciliation
          </div>

          <div className="space-y-3">
            {ward.parcels.map((p) => {
              const hasGap = p.tax.taxGapAmount > 0;
              const isNoticeSent = issuedNotices.includes(p.id);

              return (
                <div
                  key={p.id}
                  className={`p-4 rounded-lg border transition ${
                    hasGap
                      ? 'bg-amber-50/50 border-amber-300 shadow-xs'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded border shrink-0 ${
                        hasGap ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        <Building className="w-4 h-4" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">Plot {p.plotNumber}</span>
                          <span className="text-xs text-slate-600 font-medium">— {p.ownerName}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.2 rounded border ${
                            hasGap ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}>
                            {p.tax.taxStatus}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 text-[11px] text-slate-700">
                          <div>
                            <span className="text-slate-500 text-[10px] block">Declared:</span>
                            <span className="font-medium">{p.tax.registeredFloorCount} Flr ({p.tax.registeredPropertyType})</span>
                          </div>
                          <div>
                            <span className="text-slate-500 text-[10px] block">Drone Survey:</span>
                            <span className="text-blue-900 font-bold">{p.tax.detectedFloorCount} Flrs ({p.tax.detectedPropertyType})</span>
                          </div>
                          <div>
                            <span className="text-slate-500 text-[10px] block">Declared Tax:</span>
                            <span className="font-mono">₹{p.tax.declaredAnnualTax.toLocaleString('en-IN')}/yr</span>
                          </div>
                          <div>
                            <span className="text-slate-500 text-[10px] block">Assessed Tax:</span>
                            <span className="text-emerald-800 font-bold font-mono">₹{p.tax.assessedFairTax.toLocaleString('en-IN')}/yr</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {hasGap && (
                        <button
                          onClick={() => handleIssueDemandNotice(p.id)}
                          disabled={isNoticeSent}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition shadow-xs cursor-pointer ${
                            isNoticeSent
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                              : 'bg-[#B45309] hover:bg-[#92400E] text-white'
                          }`}
                        >
                          {isNoticeSent ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> : <Send className="w-3.5 h-3.5" />}
                          <span>{isNoticeSent ? 'Notice Issued' : 'Issue Demand Notice'}</span>
                        </button>
                      )}

                      <button
                        onClick={() => onSelectParcel(p)}
                        className="px-2.5 py-1.5 rounded bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-medium transition cursor-pointer"
                        title="View Plot on Map"
                      >
                        Inspect
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Tax Multiplier Simulator (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-[#0F2942] font-bold text-sm pb-2 border-b border-slate-100">
              <Calculator className="w-4 h-4 text-blue-700" />
              <span>Tax Assessment Calculator</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-700 font-medium block mb-1">Ground Footprint (m²):</label>
                <input
                  type="number"
                  value={calcArea}
                  onChange={(e) => setCalcArea(Number(e.target.value))}
                  className="w-full bg-slate-50 text-slate-900 font-mono p-2 rounded border border-slate-300 focus:border-blue-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-700 font-medium block mb-1">Detected Vertical Floors:</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((fl) => (
                    <button
                      key={fl}
                      onClick={() => setCalcFloors(fl)}
                      className={`flex-1 py-1.5 rounded font-mono font-bold transition cursor-pointer ${
                        calcFloors === fl 
                          ? 'bg-[#0F2942] text-white' 
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      {fl}F
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-700 font-medium block mb-1">Property Classification:</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCalcType('Residential')}
                    className={`flex-1 py-1.5 rounded font-medium transition cursor-pointer ${
                      calcType === 'Residential' 
                        ? 'bg-[#0F2942] text-white font-bold' 
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    Residential
                  </button>
                  <button
                    onClick={() => setCalcType('Commercial')}
                    className={`flex-1 py-1.5 rounded font-medium transition cursor-pointer ${
                      calcType === 'Commercial' 
                        ? 'bg-[#0F2942] text-white font-bold' 
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    Commercial
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Computed Built-Up Area:</span>
                  <span className="font-mono font-bold text-slate-900">{calcArea * calcFloors} m²</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Municipal Rate:</span>
                  <span className="font-mono font-bold text-slate-900">₹{calcType === 'Commercial' ? '45' : '15'}/m²</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-emerald-800 pt-2 border-t border-slate-200">
                  <span>Assessed Annual Tax:</span>
                  <span className="font-mono">₹{calculatedTax.toLocaleString('en-IN')}/yr</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

