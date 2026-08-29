import React, { useState } from 'react';
import { 
  Languages, 
  CheckCircle2, 
  FileText, 
  RefreshCw
} from 'lucide-react';
import { WardDataset } from '../../types';
import { processBhashiniNLP } from '../../utils/bhashiniNLP';

interface BhashiniViewerProps {
  ward: WardDataset;
}

export const BhashiniViewer: React.FC<BhashiniViewerProps> = ({ ward }) => {
  const [customText, setCustomText] = useState<string>("श्रीमती कावेरी देवी, पति- श्याम सुंदर, खाता संख्या 108, खेसरा 414, मेन रोड रांची");
  const [transliterationResult, setTransliterationResult] = useState(processBhashiniNLP(customText));

  const handleTransliterate = () => {
    setTransliterationResult(processBhashiniNLP(customText));
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-lg bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
              Record of Rights (RoR)
            </span>
            <span className="text-xs text-slate-500 font-medium">Jurisdiction: {ward.wardName}</span>
          </div>
          <h1 className="text-xl font-bold text-[#0F2942] mt-1">
            Vernacular Land Records & Ownership Linking
          </h1>
          <p className="text-xs text-slate-600">
            Translates vernacular Hindi/Regional Record of Rights (Khasra/Khata) into standardized cadastral records with entity linking.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-slate-50 border border-slate-200 text-slate-700 text-xs">
          <Languages className="w-4 h-4 text-blue-700" />
          <span>Indic Language Translation (98.4% Precision)</span>
        </div>
      </div>

      {/* Interactive Transliteration Test Studio */}
      <div className="p-5 rounded-lg bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <span className="font-bold text-[#0F2942] text-sm flex items-center gap-2">
            <Languages className="w-4 h-4 text-blue-700" />
            Bhashini Translation Sandbox
          </span>
          <span className="text-xs font-mono text-slate-500">Devanagari / Regional Text</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-700 block mb-1 font-medium">Vernacular Revenue Text (Devanagari):</label>
            <textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              rows={3}
              className="w-full bg-slate-50 text-slate-900 text-sm p-3 rounded border border-slate-300 focus:border-blue-700 focus:outline-none"
            />
            <button
              onClick={handleTransliterate}
              className="mt-2 flex items-center gap-1.5 px-4 py-2 rounded bg-[#0F2942] hover:bg-[#1B365D] text-white font-semibold text-xs transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Translate & Link Record</span>
            </button>
          </div>

          <div className="p-3.5 rounded bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <span className="text-slate-500 font-bold text-[10px] uppercase block">Standardized English Record:</span>
            <div className="text-slate-900 font-medium">{transliterationResult.translatedEnglish}</div>
            
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-[11px]">
              <div>
                <span className="text-slate-500 text-[10px] block">Landholder Name:</span>
                <span className="text-slate-900 font-bold">{transliterationResult.normalizedOwnerName}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Khata Number:</span>
                <span className="text-blue-900 font-bold">{transliterationResult.extractedKhata}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">Khasra Number:</span>
                <span className="text-blue-900 font-bold">{transliterationResult.extractedKhasra}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RoR Master Catalog */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-[#0F2942] px-1 uppercase tracking-wide">
          Registered Landholders Register ({ward.parcels.length} Records)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ward.parcels.map((p) => (
            <div
              key={p.id}
              className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs hover:border-blue-300 transition space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">Plot {p.plotNumber}</span>
                  <span className="text-xs text-blue-900 font-semibold">Khasra {p.khasraNo}</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {p.bhashini.matchConfidence}% Match
                </span>
              </div>

              <div className="p-2.5 rounded bg-slate-50 border border-slate-200 space-y-1 text-xs">
                <div className="text-slate-500 text-[10px]">Original Regional RoR Extract:</div>
                <div className="text-slate-800 font-medium">{p.bhashini.rawRegionalText}</div>
              </div>

              <div className="space-y-1 text-xs">
                <div className="text-slate-500 text-[10px]">Harmonized English Record:</div>
                <div className="text-slate-900 font-medium">{p.bhashini.translatedEnglishText}</div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                <span>Co-Owners: <strong className="text-slate-700">{p.bhashini.coOwners.join(', ') || 'None'}</strong></span>
                <span className="text-emerald-700 font-medium">Digital Cadastre Linked</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

