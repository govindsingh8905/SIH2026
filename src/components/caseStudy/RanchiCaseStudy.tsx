import React from 'react';
import { 
  Sparkles, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Coins, 
  Waves, 
  FileText,
  Clock
} from 'lucide-react';
import { LandParcel } from '../../types';

interface RanchiCaseStudyProps {
  onInspectPlot412B: () => void;
  onOpenWebGIS: () => void;
}

export const RanchiCaseStudy: React.FC<RanchiCaseStudyProps> = ({
  onInspectPlot412B,
  onOpenWebGIS
}) => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
              FIELD IMPLEMENTATION BENCHMARK
            </span>
            <span className="text-xs text-slate-400">Ranchi Ward 14 Real-World Case Study</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-white mt-1">
            Ground Reality Walkthrough: Plot 412/B
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Real-world field test case in Ranchi Ward 14 showing boundary shift, municipal tax leakage, and subsurface water line risk.
          </p>
        </div>

        <button
          onClick={onInspectPlot412B}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 transition cursor-pointer"
        >
          <Sparkles className="w-4 h-4 fill-slate-950" />
          <span>Inspect Plot 412/B on Live Map</span>
        </button>
      </div>

      {/* Before vs After Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: The Ground Chaos (Without GeoSync) */}
        <div className="p-5 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-rose-400 px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/30">
              BEFORE GEOSYNC (MANUAL CHAOS)
            </span>
            <span className="text-xs font-mono text-rose-300">Stuck for 7+ Years</span>
          </div>

          <h2 className="text-base font-bold text-white">
            4 Departments · 4 Isolated Files · Zero Truth
          </h2>

          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <strong className="text-amber-400 block mb-0.5">1. Revenue Department:</strong>
              Pulls out a 1978 hand-drawn paper map measured using physical chains. Map has stretched 4% due to paper aging.
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <strong className="text-cyan-400 block mb-0.5">2. Municipal Corporation:</strong>
              Captures a 2026 NAKSHA drone survey photo showing Mr. Verma's new 3-story commercial complex.
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <strong className="text-purple-400 block mb-0.5">3. Municipal Tax Department:</strong>
              Holds a 2012 record showing Mr. Verma pays property tax for a small 1-story house (₹2,000/yr). Municipal Corp loses ₹3.5 Lakhs annually.
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <strong className="text-blue-400 block mb-0.5">4. Water & Utility Board:</strong>
              Has an underground CAD map showing a 600mm drinking water main running right under Mr. Verma's illegal pillar.
            </div>
          </div>

          <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-xs text-rose-200">
            <strong>The Result:</strong> Surveyors take 14 months inspecting, clerks demand bribes, court injunction freezes road widening for 7 years!
          </div>
        </div>

        {/* Right: How GeoSync Solves It in 2.1 Seconds */}
        <div className="p-5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-emerald-400 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30">
              WITH GEOSYNC (AUTONOMOUS GEOAI)
            </span>
            <span className="text-xs font-mono text-emerald-300">Resolved in 2.1s</span>
          </div>

          <h2 className="text-base font-bold text-white">
            Single Ingestion → PostGIS & SAM-Geo Auto-Conflation
          </h2>

          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <strong className="text-emerald-400 block mb-0.5">Step 1: Automated Reprojection & SIFT Alignment</strong>
              PyProj transforms 1978 survey coordinates to WGS-84 (EPSG:4326). OpenCV SIFT matches paper map to drone photo in 2.1s.
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <strong className="text-emerald-400 block mb-0.5">Step 2: SAM-Geo 3D Building Footprint Extraction</strong>
              Meta SAM-Geo detects 3D roof vectors and calculates ground footprint = 585 m² (vs 520 m² registered).
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <strong className="text-emerald-400 block mb-0.5">Step 3: PostGIS Topology Conflict Detection</strong>
              PostGIS ST_Intersection flags Plot 412/B in RED (68.2% CS): 2.5m road setback encroachment + unassessed 3rd floor.
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <strong className="text-emerald-400 block mb-0.5">Step 4: 1-Click Auto-Heal & Cadastral Certificate</strong>
              Tehsildar inspects red alert on 2.5D swipe slider, clicks 'Auto-Heal & Snap', and auto-issues official signed PDF with ULPIN 26-JH-RAN-0042-2026.
            </div>
          </div>

          <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-200">
            <strong>The Result:</strong> 100% indisputable mathematically validated cadastre, ₹3.5L tax recovered, road widening unblocked immediately!
          </div>
        </div>
      </div>
    </div>
  );
};
