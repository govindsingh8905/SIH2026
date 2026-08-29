import React from 'react';
import { 
  LayoutDashboard, 
  UploadCloud, 
  Cpu, 
  Map as MapIcon, 
  AlertTriangle, 
  Coins, 
  Languages, 
  FileCheck2,
  ShieldCheck,
  HelpCircle,
  Database,
  BookOpen
} from 'lucide-react';

export type ActiveTab = 
  | 'overview' 
  | 'ingestion' 
  | 'pipeline' 
  | 'webgis' 
  | 'conflicts' 
  | 'tax' 
  | 'bhashini'
  | 'certificates'
  | 'guide';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  conflictCount: number;
  unassessedTaxCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  conflictCount,
  unassessedTaxCount
}) => {
  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'ingestion', label: 'Data Upload', icon: UploadCloud, badge: '5 Layers' },
    { id: 'pipeline', label: 'Harmonization', icon: Cpu, badge: '10 Stages' },
    { id: 'webgis', label: 'Cadastral Map', icon: MapIcon, badge: 'Real Map', badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200' },

    { id: 'conflicts', label: 'Discrepancy Registry', icon: AlertTriangle, badge: conflictCount > 0 ? `${conflictCount}` : null, badgeClass: 'bg-red-100 text-red-700 border-red-200' },
    { id: 'tax', label: 'Tax Assessment', icon: Coins, badge: unassessedTaxCount > 0 ? `₹3.5L Gap` : null, badgeClass: 'bg-amber-100 text-amber-800 border-amber-200' },
    { id: 'bhashini', label: 'Record of Rights', icon: Languages, badge: 'Bhashini' },
    { id: 'certificates', label: 'Cadastral Certificates', icon: FileCheck2, badge: 'ULPIN' },
    { id: 'guide', label: 'सिस्टम गाइड (How It Works)', icon: BookOpen, badge: 'Hinglish', badgeClass: 'bg-blue-100 text-blue-800 border-blue-200 font-bold' }
  ];


  return (
    <aside className="w-60 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 select-none z-20 shadow-xs">
      <div className="p-3 space-y-1">
        <div className="px-3 py-1.5 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
          Portal Modules
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id as ActiveTab)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition cursor-pointer ${
                isActive
                  ? 'bg-[#1B365D] text-white font-semibold shadow-xs'
                  : 'text-slate-700 hover:text-[#0F2942] hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 transition ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                  isActive ? 'bg-white/20 text-white border-white/30' : (item.badgeClass || 'bg-slate-100 text-slate-600 border-slate-200')
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* System Status Panel */}
      <div className="p-3 m-3 rounded bg-slate-50 border border-slate-200 text-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-[#0F2942] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            System Status
          </span>
          <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
            ONLINE
          </span>
        </div>
        <div className="space-y-1 text-[11px] text-slate-600">
          <div className="flex justify-between">
            <span>Spatial Engine:</span>
            <strong className="text-slate-800">PostGIS 3.4</strong>
          </div>
          <div className="flex justify-between">
            <span>Feature Extraction:</span>
            <strong className="text-slate-800">SAM-Geo</strong>
          </div>
          <div className="flex justify-between">
            <span>NLP Translation:</span>
            <strong className="text-slate-800">Bhashini</strong>
          </div>
        </div>
      </div>
    </aside>
  );
};

