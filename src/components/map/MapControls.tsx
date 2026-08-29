import React from 'react';
import { 
  Layers, 
  Eye, 
  MapPin, 
  Waves, 
  Building, 
  ShieldCheck, 
  SlidersHorizontal,
  Compass
} from 'lucide-react';

export interface MapLayerState {
  showLegacyMap: boolean;
  showDroneImagery: boolean;
  showBuildingFootprints: boolean;
  showHarmonizedCadastre: boolean;
  showSubsurfaceUtilities: boolean;
  showRoadSetbacks: boolean;
  showConfidenceHeatmap: boolean;
}

interface MapControlsProps {
  layers: MapLayerState;
  onToggleLayer: (layerName: keyof MapLayerState) => void;
  activeViewMode: 'HARMONIZED' | 'SWIPE_SLIDER' | 'HEATMAP';
  onChangeViewMode: (mode: 'HARMONIZED' | 'SWIPE_SLIDER' | 'HEATMAP') => void;
}

export const MapControls: React.FC<MapControlsProps> = ({
  layers,
  onToggleLayer,
  activeViewMode,
  onChangeViewMode
}) => {
  return (
    <div className="absolute top-3 left-3 z-20 flex flex-col gap-2 pointer-events-auto select-none">
      {/* View Mode Switcher */}
      <div className="p-1 bg-white rounded border border-slate-300 shadow-md flex items-center gap-1">
        <button
          onClick={() => onChangeViewMode('HARMONIZED')}
          className={`px-3 py-1.5 rounded text-xs font-semibold transition cursor-pointer ${
            activeViewMode === 'HARMONIZED'
              ? 'bg-[#1B365D] text-white'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          Cadastral View
        </button>

        <button
          onClick={() => onChangeViewMode('SWIPE_SLIDER')}
          className={`px-3 py-1.5 rounded text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
            activeViewMode === 'SWIPE_SLIDER'
              ? 'bg-[#1B365D] text-white'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Swipe Comparison</span>
        </button>

        <button
          onClick={() => onChangeViewMode('HEATMAP')}
          className={`px-3 py-1.5 rounded text-xs font-semibold transition cursor-pointer ${
            activeViewMode === 'HEATMAP'
              ? 'bg-[#1B365D] text-white'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          Confidence Heatmap
        </button>
      </div>

      {/* Layer Toggles Panel */}
      <div className="p-3 bg-white rounded border border-slate-300 shadow-md w-56 space-y-2 text-xs">
        <div className="text-[11px] font-bold text-[#0F2942] uppercase tracking-wider flex items-center justify-between pb-1 border-b border-slate-200">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-700" />
            GIS Layers
          </span>
          <Compass className="w-3.5 h-3.5 text-slate-400" />
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center justify-between p-1 rounded hover:bg-slate-50 cursor-pointer transition">
            <span className="flex items-center gap-1.5 text-slate-800 text-[11px]">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
              1978 Scanned Paper Map
            </span>
            <input
              type="checkbox"
              checked={layers.showLegacyMap}
              onChange={() => onToggleLayer('showLegacyMap')}
              className="accent-blue-900 w-3.5 h-3.5 rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-1 rounded hover:bg-slate-50 cursor-pointer transition">
            <span className="flex items-center gap-1.5 text-slate-800 text-[11px]">
              <span className="w-2.5 h-2.5 rounded-sm bg-sky-500" />
              2026 Drone Orthomosaic
            </span>
            <input
              type="checkbox"
              checked={layers.showDroneImagery}
              onChange={() => onToggleLayer('showDroneImagery')}
              className="accent-blue-900 w-3.5 h-3.5 rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-1 rounded hover:bg-slate-50 cursor-pointer transition">
            <span className="flex items-center gap-1.5 text-slate-800 text-[11px]">
              <Building className="w-3 h-3 text-purple-600" />
              3D Building Footprints
            </span>
            <input
              type="checkbox"
              checked={layers.showBuildingFootprints}
              onChange={() => onToggleLayer('showBuildingFootprints')}
              className="accent-blue-900 w-3.5 h-3.5 rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-1 rounded hover:bg-slate-50 cursor-pointer transition">
            <span className="flex items-center gap-1.5 text-slate-800 text-[11px]">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Harmonized Cadastre
            </span>
            <input
              type="checkbox"
              checked={layers.showHarmonizedCadastre}
              onChange={() => onToggleLayer('showHarmonizedCadastre')}
              className="accent-blue-900 w-3.5 h-3.5 rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-1 rounded hover:bg-slate-50 cursor-pointer transition">
            <span className="flex items-center gap-1.5 text-slate-800 text-[11px]">
              <Waves className="w-3 h-3 text-cyan-600" />
              Subsurface Utilities
            </span>
            <input
              type="checkbox"
              checked={layers.showSubsurfaceUtilities}
              onChange={() => onToggleLayer('showSubsurfaceUtilities')}
              className="accent-blue-900 w-3.5 h-3.5 rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-1 rounded hover:bg-slate-50 cursor-pointer transition">
            <span className="flex items-center gap-1.5 text-slate-800 text-[11px]">
              <span className="w-2.5 h-0.5 bg-blue-600" />
              Road Setback Line
            </span>
            <input
              type="checkbox"
              checked={layers.showRoadSetbacks}
              onChange={() => onToggleLayer('showRoadSetbacks')}
              className="accent-blue-900 w-3.5 h-3.5 rounded cursor-pointer"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

