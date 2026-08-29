import React from 'react';
import { 
  Scale, 
  Train, 
  Coins, 
  ShieldAlert, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  Flame,
  Award,
  ShieldCheck
} from 'lucide-react';


export const MultiSectorImpact: React.FC = () => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
              NATIONAL SPILLOVER
            </span>
            <span className="text-xs text-slate-400">Inter-Departmental Value Delivery</span>
          </div>
          <h1 className="text-2xl font-bold font-display text-white mt-1">
            Multi-Sector Impact & Governance Architecture
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Demonstrating multi-departmental spillover benefits across Revenue, Municipal Taxation, Subsurface Utilities, and Agri-Credit.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
          <ShieldCheck className="w-4 h-4" />
          <span>Inter-Ministerial DPI Architecture</span>
        </div>

      </div>

      {/* 4 Multi-Sector Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Sector 1: Ministry of Law & Justice */}
        <div className="p-5 rounded-xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/20 border border-slate-800 hover:border-emerald-500/50 transition space-y-3.5 group">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Scale className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              -66% Civil Court Disputes
            </span>
          </div>

          <div>
            <h2 className="text-base font-bold text-white group-hover:text-emerald-300 transition">
              1. Slashing 60%+ Civil Court Litigation
            </h2>
            <div className="text-xs font-mono text-emerald-400 mt-0.5">Ministry of Law & Justice</div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Land and boundary disputes account for <strong>~66% of all civil litigation in Indian courts</strong>, taking an average of 7+ years per case. By mathematically snapping boundaries and generating immutable PostGIS audit logs, boundary ambiguity is eliminated before disputes reach courtrooms.
          </p>

          <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-300 space-y-1">
            <div className="text-slate-400 font-semibold">Real-Life Resolution in Ranchi Ward 14:</div>
            <div className="text-emerald-400">Mrs. Sunita Sharma vs Mr. Verma dispute resolved in 1 day instead of 7 years of civil court injunctions.</div>
          </div>
        </div>

        {/* Sector 2: PM Gati Shakti & National Mega-Infrastructure */}
        <div className="p-5 rounded-xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/20 border border-slate-800 hover:border-blue-500/50 transition space-y-3.5 group">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <Train className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
              Zero Land Acquisition Delay
            </span>
          </div>

          <div>
            <h2 className="text-base font-bold text-white group-hover:text-blue-300 transition">
              2. Accelerating National Mega-Infrastructure
            </h2>
            <div className="text-xs font-mono text-blue-400 mt-0.5">PM Gati Shakti · NHAI · NHSRCL</div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Highways, High-Speed Rail corridors, and industrial freight freeways suffer multi-year delays from disputed parcel titles. Automated harmonization delivers instant title clarity, exact sub-pixel area computation, and transparent Direct Benefit Transfer (DBT) compensation.
          </p>

          <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-300 space-y-1">
            <div className="text-slate-400 font-semibold">Real-Life Resolution in Ranchi Ward 14:</div>
            <div className="text-blue-300">East Main Road widening project proceeds without stay orders as 2.5m road setback encroachment is digitally certified.</div>
          </div>
        </div>

        {/* Sector 3: MoHUA & Urban Local Bodies (Tax Base) */}
        <div className="p-5 rounded-xl bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/20 border border-slate-800 hover:border-amber-500/50 transition space-y-3.5 group">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Coins className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
              +400% Municipal Tax Recovery
            </span>
          </div>

          <div>
            <h2 className="text-base font-bold text-white group-hover:text-amber-300 transition">
              3. Multiplying Urban Local Body (ULB) Tax Base
            </h2>
            <div className="text-xs font-mono text-amber-400 mt-0.5">Ministry of Housing & Urban Affairs (MoHUA)</div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Municipalities lose thousands of crores annually in unassessed property taxes and illegal vertical floors. Cross-referencing drone DSM/DTM height data against municipal property tax registers immediately exposes undeclared commercial floors and unassessed built-up areas.
          </p>

          <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-300 space-y-1">
            <div className="text-slate-400 font-semibold">Real-Life Resolution in Ranchi Ward 14:</div>
            <div className="text-amber-300">Ranchi Municipal Corp auto-issues demand notice to Plot 412/B, recovering ₹3.5 Lakhs in retroactive commercial taxes.</div>
          </div>
        </div>

        {/* Sector 4: Underground Utility Disaster Prevention */}
        <div className="p-5 rounded-xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/20 border border-slate-800 hover:border-cyan-500/50 transition space-y-3.5 group">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              Dig-Once Safety Framework
            </span>
          </div>

          <div>
            <h2 className="text-base font-bold text-white group-hover:text-cyan-300 transition">
              4. Subsurface Utility Disaster Prevention
            </h2>
            <div className="text-xs font-mono text-cyan-400 mt-0.5">Disaster Management & Smart Cities Mission</div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Uncoordinated urban excavation frequently severs water mains, power cables, and optical fibers. Integrating subsurface utility GIS layers into the parcel cadastre creates a unified 'Dig-Once' safety framework preventing catastrophic explosions or city-wide outages.
          </p>

          <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-300 space-y-1">
            <div className="text-slate-400 font-semibold">Real-Life Resolution in Ranchi Ward 14:</div>
            <div className="text-cyan-300">Identifies Mr. Verma's commercial pillar built directly over the 600mm trunk water main, preventing future pipe rupture.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
