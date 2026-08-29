import React, { useState, useRef, useEffect } from 'react';
import L from 'leaflet';
import { 
  Sliders, 
  Layers, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2,
  Calendar,
  Camera,
  Info,
  Globe
} from 'lucide-react';
import { LandParcel, WardDataset } from '../../types';

interface SwipeSliderProps {
  ward: WardDataset;
  selectedParcel: LandParcel | null;
  onSelectParcel: (parcel: LandParcel) => void;
}

export const SwipeSlider: React.FC<SwipeSliderProps> = ({
  ward,
  selectedParcel,
  onSelectParcel
}) => {
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const leftMapContainerRef = useRef<HTMLDivElement>(null);
  const rightMapContainerRef = useRef<HTMLDivElement>(null);
  const leftMapInstanceRef = useRef<L.Map | null>(null);
  const rightMapInstanceRef = useRef<L.Map | null>(null);

  const defaultCenter: [number, number] = ward.wardId === 'MH-PUN-W08'
    ? [18.5074, 73.8095]
    : [23.3441, 85.3095];

  // Initialize Dual Synchronized Leaflet Maps
  useEffect(() => {
    if (!leftMapContainerRef.current || !rightMapContainerRef.current) return;

    // 1. Right Map (2026 Real Satellite Imagery)
    const rightMap = L.map(rightMapContainerRef.current, {
      center: defaultCenter,
      zoom: 18,
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19
    }).addTo(rightMap);

    // 2026 Drone Polygons on Right Map
    const rightGroup = L.layerGroup().addTo(rightMap);
    ward.parcels.forEach((p) => {
      const isConflict = p.status === 'CONFLICT';
      const isReview = p.status === 'REVIEW_REQUIRED';
      const color = isConflict ? '#DC2626' : isReview ? '#D97706' : '#16A34A';
      
      const poly = L.polygon(p.gpsCoordinates.vertices.map(v => [v.lat, v.lng] as [number, number]), {
        color: color,
        weight: 2.5,
        fillColor: color,
        fillOpacity: 0.45
      }).addTo(rightGroup);

      poly.on('click', () => onSelectParcel(p));
    });

    rightMapInstanceRef.current = rightMap;

    // 2. Left Map (1978 Historical Paper Cadastre over Street Map)
    const leftMap = L.map(leftMapContainerRef.current, {
      center: defaultCenter,
      zoom: 18,
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(leftMap);

    // 1978 Legacy Paper Polygons on Left Map
    const leftGroup = L.layerGroup().addTo(leftMap);
    ward.parcels.forEach((p) => {
      const legacyLatLngs: [number, number][] = p.gpsCoordinates.vertices.map((v, i) => [
        v.lat + (p.status === 'CONFLICT' ? (i === 1 || i === 2 ? -0.00008 : 0) : 0),
        v.lng + (p.status === 'CONFLICT' ? (i === 1 || i === 2 ? -0.00015 : 0) : 0)
      ]);

      const poly = L.polygon(legacyLatLngs, {
        color: '#D97706',
        weight: 2.5,
        dashArray: '6, 4',
        fillColor: '#F59E0B',
        fillOpacity: 0.4
      }).addTo(leftGroup);

      poly.on('click', () => onSelectParcel(p));
    });

    leftMapInstanceRef.current = leftMap;

    // Synchronize Pan and Zoom between both maps
    let isSyncing = false;

    const syncRightToLeft = () => {
      if (isSyncing) return;
      isSyncing = true;
      leftMap.setView(rightMap.getCenter(), rightMap.getZoom(), { animate: false });
      isSyncing = false;
    };

    const syncLeftToRight = () => {
      if (isSyncing) return;
      isSyncing = true;
      rightMap.setView(leftMap.getCenter(), leftMap.getZoom(), { animate: false });
      isSyncing = false;
    };

    rightMap.on('move', syncRightToLeft);
    leftMap.on('move', syncLeftToRight);

    return () => {
      rightMap.remove();
      leftMap.remove();
      rightMapInstanceRef.current = null;
      leftMapInstanceRef.current = null;
    };
  }, [ward.wardId]);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent | MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newPos = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(newPos);
  };

  const handleTouchMove = (e: React.TouchEvent | TouchEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const newPos = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(newPos);
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => handleMouseMove(e);
    const onEnd = () => handleMouseUp();
    const onTouchMove = (e: TouchEvent) => handleTouchMove(e);
    const onTouchEnd = () => handleMouseUp();

    if (isDragging) {
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onEnd);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('touchend', onTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isDragging]);

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-slate-300 overflow-hidden select-none shadow-sm">
      {/* Top Banner / Comparison Legend */}
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 z-10">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-[#0F2942] flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-blue-700" />
            Real-World Cadastral Swipe Comparison
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-300">
            Split Divider: {Math.round(sliderPos)}%
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-amber-100 border-2 border-dashed border-amber-500 inline-block" />
            <span className="text-amber-900 font-bold">1978 Scanned Paper Map (Left)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-blue-100 border-2 border-blue-600 inline-block" />
            <span className="text-blue-900 font-bold">2026 Real Satellite / Drone (Right)</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Split Container */}
      <div 
        ref={containerRef}
        className="relative flex-1 bg-[#0F172A] overflow-hidden cursor-ew-resize min-h-[480px]"
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        {/* Right Map: 2026 Drone Satellite Tiles */}
        <div 
          ref={rightMapContainerRef}
          className="absolute inset-0 w-full h-full z-0"
        />

        {/* Right Floating Badge */}
        <div className="absolute top-3 right-3 px-3 py-1.5 rounded bg-slate-900/90 text-white border border-blue-500/40 text-xs font-semibold shadow-md pointer-events-none z-10 flex items-center gap-1.5">
          <Camera className="w-3.5 h-3.5 text-blue-400" />
          <span>2026 High-Res Satellite / Drone Survey</span>
        </div>

        {/* Left Map: 1978 Historical Paper Map Layer */}
        <div 
          className="absolute inset-y-0 left-0 overflow-hidden border-r-2 border-white shadow-2xl z-10"
          style={{ width: `${sliderPos}%` }}
        >
          <div 
            ref={leftMapContainerRef}
            className="absolute inset-0 h-full" 
            style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100vw' }}
          />

          {/* Left Floating Badge */}
          <div className="absolute top-3 left-3 px-3 py-1.5 rounded bg-amber-950/90 text-amber-200 border border-amber-500/50 text-xs font-semibold shadow-md pointer-events-none z-20 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>1978 Recorded Cadastre Boundary</span>
          </div>
        </div>

        {/* Center Draggable Slider Handle */}
        <div 
          className="absolute inset-y-0 flex items-center justify-center pointer-events-none z-20"
          style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
        >
          <div className="w-8 h-8 rounded-full bg-white text-slate-800 flex items-center justify-center shadow-2xl border-2 border-[#0F2942] pointer-events-auto cursor-ew-resize hover:scale-110 transition">
            <Sliders className="w-4 h-4 rotate-90 text-[#0F2942]" />
          </div>
        </div>

        {/* Explanatory Callout on Plot 412/B */}
        {sliderPos > 30 && sliderPos < 70 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 p-3 rounded-lg bg-white/95 text-slate-900 border border-slate-300 shadow-2xl text-xs max-w-sm z-30 pointer-events-none">
            <div className="flex items-center gap-1.5 text-red-700 font-bold">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Plot 412/B Real Map Discrepancy</span>
            </div>
            <p className="text-[11px] text-slate-700 mt-1 leading-relaxed">
              <strong>1978 Map:</strong> Shows 520 m² registered legal footprint.<br />
              <strong>2026 Satellite/Drone:</strong> Shows 585 m² with a 2.5m eastern shift encroaching on MG Main Road setback.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Telemetry Strip */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
        <span>↔ Drag the divider horizontally to visually compare recorded legacy paper boundaries against current drone-detected footprints on real earth tiles.</span>

        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span>Spatial Precision: <strong className="text-emerald-700">±0.002m</strong></span>
          <span>Datum: <strong className="text-slate-900">WGS-84 (EPSG:4326)</strong></span>
        </div>
      </div>
    </div>
  );
};


