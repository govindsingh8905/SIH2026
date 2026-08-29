import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Layers, 
  MapPin, 
  Compass, 
  Maximize2, 
  ZoomIn, 
  ZoomOut, 
  LocateFixed, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Waves, 
  Eye, 
  SlidersHorizontal,
  Navigation,
  Globe,
  Radio,
  Ruler
} from 'lucide-react';
import { LandParcel, WardDataset } from '../../types';
import { MapLayerState } from './MapControls';

interface RealGeospatialMapProps {
  ward: WardDataset;
  selectedParcel: LandParcel | null;
  onSelectParcel: (parcel: LandParcel) => void;
  layers: MapLayerState;
  viewMode: 'HARMONIZED' | 'SWIPE_SLIDER' | 'HEATMAP';
  isSubsurfaceXRay?: boolean;
}

type TileProvider = 'satellite' | 'streets' | 'hybrid' | 'dark';

export const RealGeospatialMap: React.FC<RealGeospatialMapProps> = ({
  ward,
  selectedParcel,
  onSelectParcel,
  layers,
  viewMode,
  isSubsurfaceXRay = false
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);
  const polygonLayersMapRef = useRef<Map<string, L.Polygon>>(new Map());

  const [activeTile, setActiveTile] = useState<TileProvider>('satellite');
  const [cursorCoords, setCursorCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [currentZoom, setCurrentZoom] = useState<number>(18);
  const [isMeasuring, setIsMeasuring] = useState<boolean>(false);
  const [measurePoints, setMeasurePoints] = useState<L.LatLng[]>([]);
  const measureLayerRef = useRef<L.LayerGroup | null>(null);

  // Default coordinate center based on ward
  const defaultCenter: [number, number] = ward.wardId === 'MH-PUN-W08'
    ? [18.5074, 73.8095]
    : [23.3441, 85.3095];

  // Tile Providers Configuration
  const tileProviders: Record<TileProvider, { name: string; url: string; attribution: string; maxZoom: number }> = {
    satellite: {
      name: 'Satellite (उपग्रह)',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      maxZoom: 19
    },
    streets: {
      name: 'Streets (सड़क)',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    },
    hybrid: {
      name: 'Hybrid / Light (हाइब्रिड)',
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
      maxZoom: 20
    },
    dark: {
      name: 'Cadastral Dark (डार्क)',
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
      maxZoom: 20
    }
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Create map instance
    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: 18,
      zoomControl: false,
      attributionControl: true
    });

    mapInstanceRef.current = map;

    // Base Tile Layer
    const tile = L.tileLayer(tileProviders[activeTile].url, {
      attribution: tileProviders[activeTile].attribution,
      maxZoom: tileProviders[activeTile].maxZoom
    }).addTo(map);

    tileLayerRef.current = tile;

    // Layer Group for cadastral features
    const group = L.layerGroup().addTo(map);
    layersGroupRef.current = group;

    // Layer Group for measurements
    const measureGroup = L.layerGroup().addTo(map);
    measureLayerRef.current = measureGroup;

    // Track Cursor Coordinates
    map.on('mousemove', (e: L.LeafletMouseEvent) => {
      setCursorCoords({
        lat: parseFloat(e.latlng.lat.toFixed(5)),
        lng: parseFloat(e.latlng.lng.toFixed(5))
      });
    });

    map.on('zoomend', () => {
      setCurrentZoom(map.getZoom());
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [ward.wardId]);

  // Update Base Tile Layer when activeTile changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }
    const tile = L.tileLayer(tileProviders[activeTile].url, {
      attribution: tileProviders[activeTile].attribution,
      maxZoom: tileProviders[activeTile].maxZoom
    }).addTo(mapInstanceRef.current);
    tileLayerRef.current = tile;
  }, [activeTile]);

  // Render Geospatial Layers on Map
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = layersGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();
    polygonLayersMapRef.current.clear();

    const bounds = L.latLngBounds([]);

    // 1. Render Cadastral Land Parcels
    ward.parcels.forEach((parcel) => {
      const isSelected = selectedParcel?.id === parcel.id;
      const isConflict = parcel.status === 'CONFLICT';
      const isReview = parcel.status === 'REVIEW_REQUIRED';

      // Status Colors
      const fillColor = viewMode === 'HEATMAP'
        ? (parcel.confidence.overallScore >= 90 ? '#16A34A' : parcel.confidence.overallScore >= 75 ? '#D97706' : '#DC2626')
        : (isConflict ? '#DC2626' : isReview ? '#D97706' : '#16A34A');

      const strokeColor = isSelected ? '#2563EB' : fillColor;

      // Extract GPS Polygon Coordinates
      const latLngs: [number, number][] = parcel.gpsCoordinates.vertices.map(v => [v.lat, v.lng]);
      if (latLngs.length > 0) {
        bounds.extend(latLngs);
      }

      // Main Harmonized / Current Cadastral Polygon
      if (layers.showHarmonizedCadastre) {
        const poly = L.polygon(latLngs, {
          color: strokeColor,
          weight: isSelected ? 3.5 : 2,
          opacity: 1,
          fillColor: fillColor,
          fillOpacity: isSelected ? 0.65 : isSubsurfaceXRay ? 0.25 : 0.45,
          dashArray: isSelected ? '4, 2' : undefined
        });

        // Hover Tooltip
        poly.bindTooltip(`
          <div style="font-family: sans-serif; padding: 4px; font-size: 11px;">
            <div style="font-weight: bold; color: #0F2942;">Plot ${parcel.plotNumber} · Khasra ${parcel.khasraNo}</div>
            <div style="color: #475569;">Owner: <strong>${parcel.ownerName}</strong></div>
            <div style="margin-top: 2px;">
              <span style="display: inline-block; padding: 1px 4px; border-radius: 2px; font-size: 10px; font-weight: 600; background: ${isConflict ? '#FEE2E2; color: #DC2626' : isReview ? '#FEF3C7; color: #B45309' : '#DCFCE7; color: #15803D'};">
                ${parcel.status} (${parcel.confidence.overallScore}%)
              </span>
            </div>
          </div>
        `, {
          sticky: true,
          direction: 'top',
          opacity: 0.95
        });

        // Click Handler: Select Parcel
        poly.on('click', (e) => {
          L.DomEvent.stopPropagation(e);
          onSelectParcel(parcel);
        });

        poly.addTo(group);
        polygonLayersMapRef.current.set(parcel.id, poly);

        // Center Label Marker
        const centerIcon = L.divIcon({
          className: 'cadastral-label-icon',
          html: `
            <div style="
              background: ${isSelected ? '#1E3A8A' : 'rgba(15, 23, 42, 0.85)'};
              color: #FFFFFF;
              font-size: 10px;
              font-weight: bold;
              padding: 2px 5px;
              border-radius: 3px;
              border: 1px solid ${isSelected ? '#60A5FA' : '#CBD5E1'};
              text-align: center;
              white-space: nowrap;
              transform: translate(-50%, -50%);
              box-shadow: 0 1px 3px rgba(0,0,0,0.3);
            ">
              ${parcel.plotNumber}
            </div>
          `,
          iconSize: [0, 0]
        });

        L.marker([parcel.gpsCoordinates.centroid.lat, parcel.gpsCoordinates.centroid.lng], {
          icon: centerIcon,
          interactive: false
        }).addTo(group);
      }

      // 2. 1978 Legacy Paper Map Boundary Overlay (Amber dashed)
      if (layers.showLegacyMap) {
        // Shift slightly for realistic historical divergence
        const legacyLatLngs: [number, number][] = parcel.gpsCoordinates.vertices.map((v, i) => [
          v.lat + (parcel.status === 'CONFLICT' ? (i === 1 || i === 2 ? -0.00008 : 0) : 0),
          v.lng + (parcel.status === 'CONFLICT' ? (i === 1 || i === 2 ? -0.00015 : 0) : 0)
        ]);

        L.polygon(legacyLatLngs, {
          color: '#F59E0B',
          weight: 1.8,
          opacity: 0.9,
          fillColor: '#D97706',
          fillOpacity: 0.15,
          dashArray: '5, 5',
          interactive: false
        }).addTo(group);
      }

      // 3. Drone Building Footprint Outline (Cyan/Blue)
      if (layers.showBuildingFootprints && parcel.tax.detectedFloorCount > 0) {
        const buildingLatLngs: [number, number][] = parcel.gpsCoordinates.vertices.map((v, i) => [
          v.lat - 0.00003 * (i === 0 || i === 1 ? 1 : -1),
          v.lng - 0.00003 * (i === 1 || i === 2 ? 1 : -1)
        ]);

        L.polygon(buildingLatLngs, {
          color: '#38BDF8',
          weight: 1.5,
          opacity: 0.9,
          fillColor: '#0284C7',
          fillOpacity: 0.35,
          interactive: false
        }).addTo(group);
      }
    });

    // 4. Road Setback Line (Statutory 4.5m Corridor along MG Road)
    if (layers.showRoadSetbacks) {
      const roadLineLatLngs: [number, number][] = [
        [23.3446, 85.3101],
        [23.3436, 85.3101],
        [23.3426, 85.3101]
      ];

      L.polyline(roadLineLatLngs, {
        color: '#FBBF24',
        weight: 3,
        dashArray: '8, 4',
        opacity: 0.9
      }).bindTooltip('Statutory Road Setback Reservation Line (4.5m ROW)', {
        sticky: true
      }).addTo(group);
    }

    // 5. Underground Subsurface Utilities (Water Main & Power Line)
    if (layers.showSubsurfaceUtilities) {
      // 600mm Municipal Trunk Water Main
      const waterLineLatLngs: [number, number][] = [
        [23.3446, 85.30985],
        [23.3436, 85.30985],
        [23.3426, 85.30985]
      ];

      L.polyline(waterLineLatLngs, {
        color: '#06B6D4',
        weight: isSubsurfaceXRay ? 5 : 3.5,
        opacity: 0.95
      }).bindTooltip('Underground 600mm Municipal Drinking Water Main (Depth: 1.8m)', {
        sticky: true
      }).addTo(group);

      // 33kV Power Cable
      const powerLineLatLngs: [number, number][] = [
        [23.3446, 85.3093],
        [23.3436, 85.3093],
        [23.3426, 85.3093]
      ];

      L.polyline(powerLineLatLngs, {
        color: '#F59E0B',
        weight: isSubsurfaceXRay ? 4 : 2.5,
        dashArray: '4, 4',
        opacity: 0.9
      }).bindTooltip('Underground 33kV High-Voltage Power Conduit (Depth: 1.4m)', {
        sticky: true
      }).addTo(group);
    }

    // 6. Survey of India CORS GNSS Station Pin
    const corsIcon = L.divIcon({
      className: 'cors-marker-icon',
      html: `
        <div style="
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #10B981;
          border: 2px solid #FFFFFF;
          box-shadow: 0 0 8px rgba(16, 185, 129, 0.8);
          animation: pulse 2s infinite;
        "></div>
      `,
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    });

    L.marker([23.3445, 85.3088], { icon: corsIcon })
      .bindTooltip('Survey of India CORS GNSS RTK Station (JH-RAN-01)', { sticky: true })
      .addTo(group);

  }, [ward, selectedParcel, layers, viewMode, isSubsurfaceXRay]);

  // Zoom & Pan to selected parcel when changed
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedParcel) return;

    map.flyTo(
      [selectedParcel.gpsCoordinates.centroid.lat, selectedParcel.gpsCoordinates.centroid.lng],
      19,
      { duration: 0.8 }
    );
  }, [selectedParcel]);

  // Handle Zoom In
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  // Handle Zoom Out
  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  // Fit all parcels to view
  const handleFitWard = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const points: [number, number][] = ward.parcels.flatMap(p => 
      p.gpsCoordinates.vertices.map(v => [v.lat, v.lng] as [number, number])
    );
    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 19 });
      }
    }
  };


  return (
    <div className="relative w-full h-full bg-[#0F172A] overflow-hidden select-none">
      {/* Real Leaflet Map Container */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-full z-0 cursor-crosshair"
      />

      {/* Top-Right: Basemap Switcher (Google Map Style) */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-xs p-1 rounded-lg border border-slate-300 shadow-lg flex items-center gap-1 text-xs">
          {(Object.keys(tileProviders) as TileProvider[]).map((key) => {
            const isActive = activeTile === key;
            return (
              <button
                key={key}
                onClick={() => setActiveTile(key)}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                  isActive
                    ? 'bg-[#0F2942] text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {tileProviders[key].name}
              </button>
            );
          })}
        </div>

        {/* Real-World Geographic Indicator Tag */}
        <div className="bg-[#0F2942]/90 backdrop-blur-xs text-white px-3 py-1.5 rounded-lg border border-slate-700 shadow-md text-[11px] font-mono flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-bold text-slate-200">Real Earth GIS Map</span>
          </div>
          <span className="text-emerald-400 text-[10px] font-bold">WGS-84 / EPSG:4326</span>
        </div>
      </div>

      {/* Bottom-Right Map Controls: Zoom, Fit Bounds, Locate */}
      <div className="absolute bottom-6 right-3 z-10 flex flex-col gap-1.5 pointer-events-auto">
        <button
          onClick={handleZoomIn}
          className="w-8 h-8 rounded bg-white text-slate-800 border border-slate-300 shadow-md flex items-center justify-center hover:bg-slate-50 transition cursor-pointer"
          title="Zoom In (+)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          onClick={handleZoomOut}
          className="w-8 h-8 rounded bg-white text-slate-800 border border-slate-300 shadow-md flex items-center justify-center hover:bg-slate-50 transition cursor-pointer"
          title="Zoom Out (-)"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <button
          onClick={handleFitWard}
          className="w-8 h-8 rounded bg-white text-slate-800 border border-slate-300 shadow-md flex items-center justify-center hover:bg-slate-50 transition cursor-pointer"
          title="Fit Ward Extent (पूरा वार्ड देखें)"
        >
          <Maximize2 className="w-4 h-4 text-blue-900" />
        </button>
      </div>

      {/* Bottom-Left: Live Geographic Telemetry & Coordinate Strip */}
      <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2 pointer-events-auto">
        <div className="bg-[#0F2942]/90 backdrop-blur-xs text-white px-3 py-1.5 rounded-lg border border-slate-700 shadow-lg text-xs font-mono flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span className="text-slate-300">Live GPS:</span>
            <strong className="text-emerald-300">
              {cursorCoords ? `${cursorCoords.lat}°N, ${cursorCoords.lng}°E` : `${defaultCenter[0]}°N, ${defaultCenter[1]}°E`}
            </strong>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-slate-300">
            <span>Zoom:</span>
            <strong className="text-white">{currentZoom}x</strong>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-slate-300">
            <span>MSL Elevation:</span>
            <strong className="text-white">652 m</strong>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 text-slate-300">
            <span>CORS RTK:</span>
            <strong className="text-emerald-400">±0.002m FIXED</strong>
          </div>
        </div>
      </div>

      {/* Subsurface X-Ray Indicator Banner when Active */}
      {isSubsurfaceXRay && (
        <div className="absolute top-16 right-3 z-10 px-3 py-1.5 rounded-lg bg-cyan-900/90 text-cyan-200 border border-cyan-500 shadow-lg text-xs font-medium flex items-center gap-1.5 pointer-events-none">
          <Waves className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Subsurface Utility Mode Active (Transparency 60%)</span>
        </div>
      )}
    </div>
  );
};
