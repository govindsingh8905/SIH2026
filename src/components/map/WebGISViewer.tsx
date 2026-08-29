import React, { useState } from 'react';
import { 
  RotateCcw, 
  Search,
  CheckCircle,
  AlertTriangle,
  SlidersHorizontal,
  Waves,
  Box,
  Layers,
  MapPin,
  Globe
} from 'lucide-react';
import { LandParcel, WardDataset } from '../../types';
import { MapControls, MapLayerState } from './MapControls';
import { SwipeSlider } from './SwipeSlider';
import { RealGeospatialMap } from './RealGeospatialMap';

interface WebGISViewerProps {
  ward: WardDataset;
  selectedParcel: LandParcel | null;
  onSelectParcel: (parcel: LandParcel) => void;
  onAutoHealParcel?: (parcelId: string) => void;
}

export const WebGISViewer: React.FC<WebGISViewerProps> = ({
  ward,
  selectedParcel,
  onSelectParcel,
  onAutoHealParcel
}) => {
  const [viewMode, setViewMode] = useState<'HARMONIZED' | 'SWIPE_SLIDER' | 'HEATMAP'>('HARMONIZED');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSubsurfaceXRay, setIsSubsurfaceXRay] = useState<boolean>(false);

  const [layers, setLayers] = useState<MapLayerState>({
    showLegacyMap: true,
    showDroneImagery: true,
    showBuildingFootprints: true,
    showHarmonizedCadastre: true,
    showSubsurfaceUtilities: true,
    showRoadSetbacks: true,
    showConfidenceHeatmap: false
  });

  const toggleLayer = (layerName: keyof MapLayerState) => {
    setLayers(prev => ({ ...prev, [layerName]: !prev[layerName] }));
  };

  const filteredParcels = ward.parcels.filter(p => {
    if (filterStatus === 'VERIFIED' && p.status !== 'VERIFIED') return false;
    if (filterStatus === 'REVIEW' && p.status !== 'REVIEW_REQUIRED') return false;
    if (filterStatus === 'CONFLICT' && p.status !== 'CONFLICT') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.plotNumber.toLowerCase().includes(q) ||
             p.ownerName.toLowerCase().includes(q) ||
             p.khasraNo.toLowerCase().includes(q) ||
             p.ulpin.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-slate-100 relative overflow-hidden select-none">
      {/* Top Map Sub-Header */}
      <div className="h-12 bg-white border-b border-slate-200 px-4 flex items-center justify-between z-10 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200 flex items-center gap-1">
              <Globe className="w-3 h-3 text-blue-700" />
              Real GIS Map
            </span>
            <span className="text-xs font-bold text-[#0F2942]">
              {ward.wardName}
            </span>
          </div>

          {/* Filter Pills */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-0.5 rounded border border-slate-200 text-xs">
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`px-2 py-0.5 rounded font-medium transition cursor-pointer ${
                filterStatus === 'ALL' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({ward.parcels.length})
            </button>
            <button
              onClick={() => setFilterStatus('VERIFIED')}
              className={`px-2 py-0.5 rounded font-medium transition flex items-center gap-1 cursor-pointer ${
                filterStatus === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800 font-semibold' : 'text-slate-600 hover:text-emerald-800'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              Verified ({ward.verifiedCount})
            </button>
            <button
              onClick={() => setFilterStatus('REVIEW')}
              className={`px-2 py-0.5 rounded font-medium transition flex items-center gap-1 cursor-pointer ${
                filterStatus === 'REVIEW' ? 'bg-amber-100 text-amber-900 font-semibold' : 'text-slate-600 hover:text-amber-900'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
              Review ({ward.reviewRequiredCount})
            </button>
            <button
              onClick={() => setFilterStatus('CONFLICT')}
              className={`px-2 py-0.5 rounded font-medium transition flex items-center gap-1 cursor-pointer ${
                filterStatus === 'CONFLICT' ? 'bg-red-100 text-red-800 font-semibold' : 'text-slate-600 hover:text-red-800'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
              Conflicts ({ward.conflictCount})
            </button>
          </div>
        </div>

        {/* Subsurface X-Ray Mode Toggle & Search */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSubsurfaceXRay(prev => !prev)}
            className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1.5 border transition cursor-pointer ${
              isSubsurfaceXRay
                ? 'bg-cyan-600 text-white border-cyan-700 shadow-xs'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
            title="Subsurface Utilities X-Ray Inspection"
          >
            <Waves className="w-3.5 h-3.5 text-cyan-500" />
            <span>Subsurface Utilities</span>
          </button>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search Plot, Khasra, Owner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-50 text-slate-800 text-xs pl-8 pr-3 py-1.5 rounded border border-slate-300 focus:outline-none focus:border-blue-700 w-40 md:w-52"
            />
          </div>
        </div>
      </div>

      {/* Main Map Viewport */}
      <div className="relative flex-1 bg-slate-900 overflow-hidden">
        {/* Layer Controls & View Switcher Floating Overlay */}
        <MapControls
          layers={layers}
          onToggleLayer={toggleLayer}
          activeViewMode={viewMode}
          onChangeViewMode={setViewMode}
        />

        {/* View Mode 1: Split-Screen Swipe Slider */}
        {viewMode === 'SWIPE_SLIDER' ? (
          <div className="h-full p-3 bg-slate-100">
            <SwipeSlider
              ward={ward}
              selectedParcel={selectedParcel}
              onSelectParcel={onSelectParcel}
            />
          </div>
        ) : (
          /* View Mode 2 & 3: Real Earth GIS Map with Satellite / Street Tiles */
          <RealGeospatialMap
            ward={ward}
            selectedParcel={selectedParcel}
            onSelectParcel={onSelectParcel}
            layers={layers}
            viewMode={viewMode}
            isSubsurfaceXRay={isSubsurfaceXRay}
          />
        )}
      </div>
    </div>
  );
};

