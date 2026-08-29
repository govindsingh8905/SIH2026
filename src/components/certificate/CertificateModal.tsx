import React from 'react';
import { 
  X, 
  Download, 
  CheckCircle2, 
  Printer, 
  ShieldCheck, 
  QrCode, 
  Building2,
  Calendar,
  Layers
} from 'lucide-react';
import { LandParcel } from '../../types';
import { generateCadastralCertificatePDF } from '../../utils/certificatePdf';

interface CertificateModalProps {
  parcel: LandParcel;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  parcel,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const handleDownloadPDF = () => {
    const doc = generateCadastralCertificatePDF(parcel);
    doc.save(`Cadastral_Certificate_${parcel.plotNumber.replace('/', '_')}_${parcel.ulpin}.pdf`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
      <div className="bg-white border border-slate-300 rounded-lg max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#0F2942] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-white/10 text-white">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold">
                Cadastral Verification Certificate
              </h3>
              <p className="text-xs text-slate-300">
                ULPIN: {parcel.ulpin} · Department of Land Resources
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Paper Preview */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100">
          <div className="p-6 rounded bg-white border-2 border-slate-300 shadow-sm space-y-5 text-slate-800">
            {/* Top National Emblem Header */}
            <div className="text-center pb-4 border-b border-slate-200 space-y-1">
              <div className="text-xs font-bold tracking-widest text-slate-600">
                भारत सरकार | GOVERNMENT OF INDIA
              </div>
              <div className="text-sm font-bold text-[#0F2942] uppercase">
                Ministry of Rural Development · Department of Land Resources
              </div>
              <div className="text-xs font-semibold text-blue-900">
                NAKSHA & DILRMP — Harmonized Cadastral Land Record
              </div>
            </div>

            {/* Certificate Meta & Badge */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 rounded bg-slate-50 border border-slate-200">
              <div>
                <div className="text-xs text-slate-500">Unique Land Parcel Identification Number (ULPIN):</div>
                <div className="text-base font-bold font-mono text-blue-900">{parcel.ulpin}</div>
                <div className="text-[11px] text-slate-600 mt-0.5">{parcel.ward}, {parcel.district}</div>
              </div>

              <div className={`px-3 py-1.5 rounded text-xs font-bold border ${
                parcel.status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                parcel.status === 'REVIEW_REQUIRED' ? 'bg-amber-50 text-amber-900 border-amber-200' :
                'bg-red-50 text-red-800 border-red-200'
              }`}>
                STATUS: {parcel.status.replace('_', ' ')}
              </div>
            </div>

            {/* 1. Cadastral Details */}
            <div className="space-y-2 text-xs">
              <div className="font-bold text-[#0F2942] uppercase tracking-wider">
                1. Cadastral & Record of Rights (RoR) Particulars
              </div>
              <div className="grid grid-cols-2 gap-3 p-3 rounded bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-500 block">Khasra / Plot No:</span>
                  <span className="text-slate-900 font-bold">{parcel.khasraNo}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Khata / Holding No:</span>
                  <span className="text-slate-900 font-bold">{parcel.khataNo}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Owner Name (RoR):</span>
                  <span className="text-slate-900 font-bold">{parcel.ownerName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Bhashini Match:</span>
                  <span className="text-emerald-800 font-bold">{parcel.bhashini.matchConfidence}% Verified</span>
                </div>
              </div>
            </div>

            {/* 2. Spatial Conflation Matrix */}
            <div className="space-y-2 text-xs">
              <div className="font-bold text-[#0F2942] uppercase tracking-wider">
                2. Spatial Geometry & Area Reconciliation (m²)
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-500 font-medium">1978 Paper RoR</div>
                  <div className="text-sm font-bold text-amber-900">{parcel.registeredAreaSqM} m²</div>
                </div>
                <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-500 font-medium">2026 Drone Survey</div>
                  <div className="text-sm font-bold text-blue-900">{parcel.detectedAreaSqM} m²</div>
                </div>
                <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-500 font-medium">Harmonized Area</div>
                  <div className="text-sm font-bold text-emerald-800">{parcel.harmonizedAreaSqM} m²</div>
                </div>
              </div>
            </div>

            {/* 3. Mathematical Confidence Breakdown */}
            <div className="space-y-2 text-xs">
              <div className="font-bold text-[#0F2942] uppercase tracking-wider">
                3. Verification Confidence Scoring
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="p-2 rounded bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-500">IoU (40%)</div>
                  <div className="font-bold text-slate-900">{parcel.confidence.iouScore}%</div>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-500">Hausdorff (30%)</div>
                  <div className="font-bold text-slate-900">{parcel.confidence.hausdorffScore}%</div>
                </div>
                <div className="p-2 rounded bg-slate-50 border border-slate-200">
                  <div className="text-[10px] text-slate-500">NLP Sim (30%)</div>
                  <div className="font-bold text-slate-900">{parcel.confidence.nlpScore}%</div>
                </div>
                <div className="p-2 rounded bg-emerald-50 border border-emerald-200">
                  <div className="text-[10px] text-emerald-800 font-medium">Total Score</div>
                  <div className="font-bold text-emerald-900">{parcel.confidence.overallScore}%</div>
                </div>
              </div>
            </div>

            {/* 4. Digital Signature & QR Stamp */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded bg-slate-100 border border-slate-300 flex flex-col items-center justify-center text-[9px] text-slate-600">
                  <QrCode className="w-7 h-7 text-slate-800" />
                  <span>Scan QR</span>
                </div>
                <div className="text-[10px] text-slate-600 space-y-0.5">
                  <div>Audit Hash: <span className="font-mono text-slate-800">{parcel.postgisAuditHash?.substring(0, 16)}...</span></div>
                  <div>CORS GNSS Sync: <span className="text-emerald-700 font-medium">EPSG:4326 (WGS-84)</span></div>
                </div>
              </div>

              <div className="text-right text-xs">
                <div className="text-slate-500 text-[10px]">Digitally Authorized:</div>
                <div className="font-bold text-slate-900">Revenue Officer / Tehsildar</div>
                <div className="text-emerald-700 text-[11px] font-medium">√ Validated on Land Portal</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

