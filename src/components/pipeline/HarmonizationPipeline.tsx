import React, { useState, useEffect } from 'react';
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Terminal, 
  MapPin, 
  Cpu, 
  Clock, 
  ArrowRight
} from 'lucide-react';
import { PipelineStage, WardDataset } from '../../types';

interface HarmonizationPipelineProps {
  ward: WardDataset;
  onPipelineComplete: () => void;
  autoRun?: boolean;
}

const INITIAL_STAGES: PipelineStage[] = [
  {
    id: 1,
    name: "Data Ingestion & Layer Normalization",
    code: "STAGE_01_INGEST",
    description: "Ingests scanned cadastral raster, 10cm drone GeoTIFF, and textual RoR tables into memory buffers.",
    status: "PENDING",
    durationMs: 140,
    progressPercent: 0,
    outputSummary: "5 data layers ingested; CRS headers inspected.",
    logs: [
      "[INFO] Ingesting cadastral map and drone GeoTIFF layers",
      "[INFO] Parsing CSV Record of Rights & Municipal Tax Ledger",
      "[SUCCESS] Ingestion buffer allocated: 5/5 layers ready."
    ]
  },
  {
    id: 2,
    name: "Coordinate Reprojection (WGS-84 / EPSG:4326)",
    code: "STAGE_02_REPROJECT",
    description: "Transforms local non-projected survey chain coordinates to WGS-84 / UTM Zone 45N.",
    status: "PENDING",
    durationMs: 220,
    progressPercent: 0,
    outputSummary: "Reprojected 8 cadastral polygons to EPSG:4326 with CORS GNSS tie-points.",
    logs: [
      "[INFO] Transforming local survey datum to WGS-84 standard (EPSG:4326)",
      "[INFO] Aligning bounding coordinates to CORS GNSS base station",
      "[SUCCESS] Reprojection completed with 0.002m mathematical precision."
    ]
  },
  {
    id: 3,
    name: "Keypoint Matching & Georeferencing Alignment",
    code: "STAGE_03_ALIGN",
    description: "Extracts feature tie-points to accurately align distorted historical paper maps over drone imagery.",
    status: "PENDING",
    durationMs: 280,
    progressPercent: 0,
    outputSummary: "1,248 feature tie-points matched; paper stretch distortion corrected.",
    logs: [
      "[INFO] Matching homologous road and boundary control points",
      "[INFO] Applying coordinate transformation matrix to remove paper stretch",
      "[SUCCESS] Boundary georeferencing alignment complete."
    ]
  },
  {
    id: 4,
    name: "Feature Extraction & 3D Footprint Segmentation",
    code: "STAGE_04_SEGMENT",
    description: "Segments physical building footprints, parcel fence lines, and extracts 3D floor heights from drone elevation data.",
    status: "PENDING",
    durationMs: 380,
    progressPercent: 0,
    outputSummary: "Extracted 14 building polygons & DSM elevation height vectors.",
    logs: [
      "[INFO] Extracting physical rooftop boundaries and property walls from drone survey",
      "[INFO] Calculating DSM elevation height: Plot 412/B height = 11.2m (3 commercial floors)",
      "[SUCCESS] Vectorized physical footprints loaded to staging database."
    ]
  },
  {
    id: 5,
    name: "Spatial Conflation & Legal-Physical Boundary Matching",
    code: "STAGE_05_CONFLATE",
    description: "Aligns legacy cadastral boundary edges with drone-detected physical parcel fences.",
    status: "PENDING",
    durationMs: 210,
    progressPercent: 0,
    outputSummary: "Sub-pixel edge matching completed across 8 parcels.",
    logs: [
      "[INFO] Computing edge variance between registered boundaries and physical drone footprints",
      "[INFO] Average edge variance: 0.18m across ward",
      "[SUCCESS] Spatial vector edges aligned."
    ]
  },
  {
    id: 6,
    name: "Topology Validation & Automatic Snapping (PostGIS ST_Snap)",
    code: "STAGE_06_TOPOLOGY",
    description: "Auto-heals sliver gaps and validates topological polygon continuity.",
    status: "PENDING",
    durationMs: 260,
    progressPercent: 0,
    outputSummary: "Auto-healed sliver gaps (tolerance 0.05m); detected 1 structural overlap.",
    logs: [
      "[INFO] Running PostGIS ST_Snap validation with 0.05m tolerance",
      "[INFO] Resolved 0.05m sliver gap on Plot 402",
      "[INFO] Flagged non-snappable 2.5m structural overlap on Plot 412/B",
      "[SUCCESS] Topology graph validated."
    ]
  },
  {
    id: 7,
    name: "Discrepancy & Encroachment Detection",
    code: "STAGE_07_DISCREPANCY",
    description: "Flags road setback encroachments, boundary disputes, and subsurface utility collisions.",
    status: "PENDING",
    durationMs: 190,
    progressPercent: 0,
    outputSummary: "Flagged Plot 412/B (28.4 m² road setback encroachment + utility hazard).",
    logs: [
      "[FLAG] Plot 412/B extends 2.5m into East Main Road setback (Area: 28.4 sq.m)",
      "[FLAG] Neighbor boundary collision with Plot 412/A identified",
      "[ALERT] Subsurface overlay: Plot 412/B pillar intersects 600mm trunk water main",
      "[SUCCESS] Discrepancies registered into audit database."
    ]
  },
  {
    id: 8,
    name: "Bhashini Regional Language Record of Rights Linking",
    code: "STAGE_08_BHASHINI",
    description: "Translates Hindi/Regional Record of Rights (Khasra/Khata) and links landholder ownership records to spatial parcels.",
    status: "PENDING",
    durationMs: 180,
    progressPercent: 0,
    outputSummary: "8/8 landholders matched with 98.2% average NLP similarity.",
    logs: [
      "[INFO] Linking 'श्री राजेश वर्मा' -> 'Rajesh Verma' (Khata: 104, Khasra: 412/B)",
      "[INFO] Linking 'श्रीमती सुनीता शर्मा' -> 'Sunita Sharma' (Khata: 103, Khasra: 412/A)",
      "[SUCCESS] Ownership-spatial mapping verified."
    ]
  },
  {
    id: 9,
    name: "Confidence Scoring (IoU + Hausdorff + RoR Match)",
    code: "STAGE_09_SCORING",
    description: "Calculates deterministic confidence scores for all parcels to categorize into Verified, Review, or Conflict.",
    status: "PENDING",
    durationMs: 150,
    progressPercent: 0,
    outputSummary: "Confidence scores computed: 5 Verified (>90%), 2 Review (70-90%), 1 Conflict (68.2%).",
    logs: [
      "[INFO] Plot 401: Confidence = 94.8% (VERIFIED)",
      "[INFO] Plot 403: Confidence = 96.2% (VERIFIED)",
      "[INFO] Plot 412/A: Confidence = 75.4% (REVIEW REQUIRED)",
      "[INFO] Plot 412/B: Confidence = 68.2% (DISCREPANCY FLAGGED)",
      "[SUCCESS] Confidence scoring finalized."
    ]
  },
  {
    id: 10,
    name: "Digital Cadastre Harmonization & ULPIN Generation",
    code: "STAGE_10_ULPIN",
    description: "Generates standardized 14-digit Unique Land Parcel Identification Numbers (ULPIN) with database commit.",
    status: "PENDING",
    durationMs: 120,
    progressPercent: 0,
    outputSummary: "Harmonized digital cadastre ready with verifiable ULPIN codes.",
    logs: [
      "[INFO] Generated ULPIN 26-JH-RAN-0042-2026 for Plot 412/B",
      "[INFO] Generated ULPIN 26-JH-RAN-0041-2026 for Plot 412/A",
      "[INFO] Generated ULPIN 26-JH-RAN-0035-2026 for Plot 401",
      "[SUCCESS] Harmonized cadastre committed with immutable audit hash."
    ]
  }
];

export const HarmonizationPipeline: React.FC<HarmonizationPipelineProps> = ({
  ward,
  onPipelineComplete,
  autoRun = false
}) => {
  const [stages, setStages] = useState<PipelineStage[]>(INITIAL_STAGES);
  const [currentStageIdx, setCurrentStageIdx] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTimeMs, setElapsedTimeMs] = useState(0);
  const [activeLogStage, setActiveLogStage] = useState<number>(0);

  const startPipeline = () => {
    setIsRunning(true);
    setCurrentStageIdx(0);
    setElapsedTimeMs(0);
    setStages(stages.map(s => ({ ...s, status: 'PENDING', progressPercent: 0 })));
  };

  const resetPipeline = () => {
    setIsRunning(false);
    setCurrentStageIdx(-1);
    setElapsedTimeMs(0);
    setStages(INITIAL_STAGES);
  };

  useEffect(() => {
    if (autoRun && currentStageIdx === -1) {
      startPipeline();
    }
  }, [autoRun]);

  useEffect(() => {
    if (!isRunning || currentStageIdx < 0 || currentStageIdx >= stages.length) return;

    const currentStage = stages[currentStageIdx];
    setActiveLogStage(currentStageIdx);

    setStages(prev => prev.map((s, idx) => idx === currentStageIdx ? { ...s, status: 'RUNNING', progressPercent: 50 } : s));

    const timeout = setTimeout(() => {
      setStages(prev => prev.map((s, idx) => idx === currentStageIdx ? { ...s, status: 'COMPLETED', progressPercent: 100 } : s));
      setElapsedTimeMs(prev => prev + currentStage.durationMs);

      if (currentStageIdx + 1 < stages.length) {
        setCurrentStageIdx(currentStageIdx + 1);
      } else {
        setIsRunning(false);
        onPipelineComplete();
      }
    }, currentStage.durationMs);

    return () => clearTimeout(timeout);
  }, [isRunning, currentStageIdx]);

  const allCompleted = stages.every(s => s.status === 'COMPLETED');
  const totalDurationSeconds = (elapsedTimeMs / 1000).toFixed(2);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto select-none">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-lg bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
              Harmonization Pipeline
            </span>
            <span className="text-xs text-slate-500 font-medium">Jurisdiction: {ward.wardName}</span>
          </div>
          <h1 className="text-xl font-bold text-[#0F2942] mt-1">
            Automated Cadastral Processing
          </h1>
          <p className="text-xs text-slate-600">
            10-stage automated workflow: coordinate reprojection, keypoint matching, feature segmentation, topology validation, and ULPIN assignment.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="px-3 py-1.5 rounded bg-slate-50 border border-slate-200 text-xs font-mono flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-700" />
            <span className="text-slate-600">Time:</span>
            <strong className="text-slate-900">{totalDurationSeconds}s</strong>
          </div>

          {!allCompleted ? (
            <button
              onClick={startPipeline}
              disabled={isRunning}
              className={`flex items-center gap-1.5 px-4 py-2 rounded text-xs font-bold transition shadow-xs cursor-pointer ${
                isRunning 
                  ? 'bg-amber-100 text-amber-800 border border-amber-300 cursor-wait'
                  : 'bg-[#15803D] hover:bg-[#166534] text-white'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isRunning ? 'Processing Stages...' : 'Run Pipeline'}</span>
            </button>
          ) : (
            <button
              onClick={onPipelineComplete}
              className="flex items-center gap-1.5 px-4 py-2 rounded bg-[#0F2942] hover:bg-[#1B365D] text-white font-bold text-xs shadow-xs transition cursor-pointer"
            >
              <span>View Cadastral Map</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={resetPipeline}
            className="p-2 rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-600 transition"
            title="Reset Pipeline"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Stages on Left, Execution Console on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 10 Stages Status Checklist (7 cols) */}
        <div className="lg:col-span-7 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-[#0F2942] px-1 uppercase tracking-wide">
            <span>Workflow Stages</span>
            <span className="font-mono text-slate-500 font-normal">{stages.filter(s => s.status === 'COMPLETED').length} / {stages.length} Completed</span>
          </div>

          <div className="space-y-2">
            {stages.map((stage, idx) => {
              const isRunningStage = stage.status === 'RUNNING';
              const isCompleted = stage.status === 'COMPLETED';

              return (
                <div
                  key={stage.id}
                  onClick={() => setActiveLogStage(idx)}
                  className={`p-3 rounded-lg border transition cursor-pointer ${
                    isRunningStage
                      ? 'bg-blue-50 border-blue-400 ring-1 ring-blue-300 shadow-xs'
                      : isCompleted
                      ? 'bg-white border-slate-200 hover:border-emerald-300 shadow-xs'
                      : 'bg-slate-50 border-slate-200 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs border ${
                        isRunningStage ? 'bg-blue-100 text-blue-800 border-blue-300 animate-pulse' :
                        isCompleted ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                        'bg-slate-100 text-slate-600 border-slate-300'
                      }`}>
                        {isCompleted ? <CheckCircle2 className="w-4 h-4 text-emerald-700" /> : stage.id}
                      </div>

                      <div>
                        <div className="text-xs font-bold text-[#0F2942]">{stage.name}</div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {stage.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        isRunningStage ? 'bg-blue-100 text-blue-800 border-blue-300 animate-pulse' :
                        isCompleted ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {isCompleted ? 'COMPLETED' : isRunningStage ? 'PROCESSING' : 'PENDING'}
                      </span>
                      <div className="text-[10px] font-mono text-slate-400 mt-1">
                        {stage.durationMs}ms
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {(isRunningStage || isCompleted) && (
                    <div className="w-full bg-slate-100 h-1 rounded mt-2 overflow-hidden border border-slate-200">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          isCompleted ? 'bg-emerald-600' : 'bg-blue-600'
                        }`}
                        style={{ width: `${stage.progressPercent}%` }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Execution Console & Logs (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-lg bg-slate-900 border border-slate-800 overflow-hidden flex flex-col h-[540px] shadow-xs">
            {/* Console Header */}
            <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-200 font-semibold font-mono">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>Processing Execution Console</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Stage {activeLogStage + 1}
              </span>
            </div>

            {/* Console Output */}
            <div className="p-4 font-mono text-xs text-slate-300 flex-1 overflow-y-auto space-y-2 bg-slate-900">
              <div className="text-slate-500 text-[11px] pb-2 border-b border-slate-800">
                // Harmonization Stream: {ward.wardName}
                <br />// Active Module: [{stages[activeLogStage]?.id}] {stages[activeLogStage]?.name}
              </div>

              {stages.slice(0, isRunning ? currentStageIdx + 1 : stages.length).flatMap(s => s.logs).map((log, idx) => {
                const isFlag = log.includes('[FLAG]') || log.includes('[ALERT]');
                const isSuccess = log.includes('[SUCCESS]');

                return (
                  <div 
                    key={idx} 
                    className={`leading-relaxed ${
                      isFlag ? 'text-red-400 font-semibold' :
                      isSuccess ? 'text-emerald-400' :
                      'text-slate-300'
                    }`}
                  >
                    <span className="text-slate-500 mr-2 text-[10px]">{`> `}</span>
                    {log}
                  </div>
                );
              })}

              {isRunning && (
                <div className="flex items-center gap-2 text-blue-400 animate-pulse pt-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  <span>Executing spatial computations...</span>
                </div>
              )}
            </div>

            {/* Console Footer */}
            <div className="p-2.5 bg-slate-950 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>Database Status:</span>
              <span className="text-emerald-400 font-semibold">PostGIS ST_Snap Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

