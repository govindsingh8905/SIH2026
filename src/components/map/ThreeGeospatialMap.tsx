import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { LandParcel, WardDataset } from '../../types';
import { MapLayerState } from './MapControls';
import { 
  Eye, 
  Layers, 
  RotateCcw, 
  Maximize2, 
  Box, 
  Compass, 
  Info, 
  Waves, 
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  MapPin
} from 'lucide-react';

interface ThreeGeospatialMapProps {
  ward: WardDataset;
  selectedParcel: LandParcel | null;
  onSelectParcel: (parcel: LandParcel) => void;
  layers: MapLayerState;
  viewMode: 'HARMONIZED' | 'SWIPE_SLIDER' | 'HEATMAP';
  isSubsurfaceXRay?: boolean;
}

export const ThreeGeospatialMap: React.FC<ThreeGeospatialMapProps> = ({
  ward,
  selectedParcel,
  onSelectParcel,
  layers,
  viewMode,
  isSubsurfaceXRay = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Three.js scene refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const meshesGroupRef = useRef<THREE.Group | null>(null);
  const buildingsGroupRef = useRef<THREE.Group | null>(null);
  const legacyGroupRef = useRef<THREE.Group | null>(null);
  const utilitiesGroupRef = useRef<THREE.Group | null>(null);
  const roadGroupRef = useRef<THREE.Group | null>(null);
  const groundMeshRef = useRef<THREE.Mesh | null>(null);
  const reqAnimRef = useRef<number | null>(null);

  // Mouse interaction & Camera controls state
  const isDraggingRef = useRef<boolean>(false);
  const isRightDraggingRef = useRef<boolean>(false);
  const previousMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const cameraTargetRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const cameraAngleRef = useRef<{ theta: number; phi: number; radius: number }>({
    theta: Math.PI / 4,
    phi: Math.PI / 3.2,
    radius: 115
  });

  const [hoveredParcel, setHoveredParcel] = useState<LandParcel | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [cameraPreset, setCameraPreset] = useState<'2.5D' | '2D' | '3D'>('2.5D');
  const [cursorCoords, setCursorCoords] = useState<{ lat: string; lng: string }>({
    lat: '23.3441',
    lng: '85.3095'
  });

  // Convert percentage coordinates (0-100) to Three.js spatial coordinates (-50 to +50)
  const mapCoordsTo3D = useCallback((x: number, y: number, zElevation = 0): THREE.Vector3 => {
    // x: 0..100 -> -50..50 (East-West)
    // y: 0..100 -> -50..50 (North-South)
    return new THREE.Vector3(x - 50, zElevation, y - 50);
  }, []);

  // Generate high-resolution realistic geographic urban basemap canvas texture
  const createGeographicBasemapTexture = useCallback((): THREE.CanvasTexture => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    // 1. Background Urban Terrain / Land parcel zone
    ctx.fillStyle = '#1A222D';
    ctx.fillRect(0, 0, 2048, 2048);

    // Subtle grass/park lots
    ctx.fillStyle = '#162822';
    ctx.fillRect(320, 1300, 700, 600); // Municipal park area (Plot 405)

    // 2. Secondary Streets & Pavements
    ctx.fillStyle = '#242F3E';
    // Cross street top
    ctx.fillRect(0, 650, 1800, 110);
    // Cross street bottom
    ctx.fillRect(0, 1260, 1800, 90);
    // Left lane
    ctx.fillRect(280, 0, 90, 2048);

    // 3. Main Road Corridor (Mahatma Gandhi Main Road on East, X=88% to 100%)
    ctx.fillStyle = '#1E2530';
    ctx.fillRect(1780, 0, 268, 2048);

    // Pavement curb
    ctx.fillStyle = '#334155';
    ctx.fillRect(1760, 0, 20, 2048);

    // Dual-carriageway road markings
    ctx.strokeStyle = '#FACC15'; // Yellow central divider
    ctx.lineWidth = 6;
    ctx.setLineDash([40, 30]);
    ctx.beginPath();
    ctx.moveTo(1914, 0);
    ctx.lineTo(1914, 2048);
    ctx.stroke();

    // White lane dividers
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 4;
    ctx.setLineDash([30, 40]);
    ctx.beginPath();
    ctx.moveTo(1840, 0);
    ctx.lineTo(1840, 2048);
    ctx.moveTo(1988, 0);
    ctx.lineTo(1988, 2048);
    ctx.stroke();
    ctx.setLineDash([]);

    // 4. Statutory Road Setback Buffer Zone (X=58% to 62%)
    ctx.fillStyle = 'rgba(59, 130, 246, 0.08)';
    ctx.fillRect(1160, 0, 80, 2048);
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.35)';
    ctx.lineWidth = 3;
    ctx.setLineDash([12, 12]);
    ctx.strokeRect(1160, 0, 80, 2048);
    ctx.setLineDash([]);

    // 5. Geographic Cadastral Grid Ticks & Labels
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.12)';
    ctx.lineWidth = 2;
    for (let i = 200; i < 2048; i += 300) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 2048);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(2048, i);
      ctx.stroke();
    }

    // Street Names & Departmental annotations
    ctx.save();
    ctx.font = 'bold 28px "Inter", sans-serif';
    ctx.fillStyle = 'rgba(226, 232, 240, 0.75)';
    ctx.translate(1930, 1100);
    ctx.rotate(Math.PI / 2);
    ctx.fillText('MAHATMA GANDHI MAIN ROAD (45m ROW)', 0, 0);
    ctx.restore();

    ctx.font = 'bold 22px "Inter", sans-serif';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
    ctx.fillText('STATION LINK ROAD', 500, 715);
    ctx.fillText('LINE TANK FEEDER ROAD', 500, 1315);
    ctx.fillText('STATUTORY ROAD SETBACK (4.5m)', 1060, 120);

    // North Indicator & EPSG Datum Label
    ctx.font = '18px "Roboto Mono", monospace';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
    ctx.fillText('DATUM: WGS-84 / EPSG:4326', 60, 80);
    ctx.fillText('SURVEY OF INDIA CORS GRID · JH-RAN-01', 60, 115);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.anisotropy = 8;
    return texture;
  }, []);

  // Update Camera Orbit based on spherical coordinates
  const updateCameraPosition = useCallback(() => {
    if (!cameraRef.current) return;
    const { theta, phi, radius } = cameraAngleRef.current;
    const target = cameraTargetRef.current;

    const x = target.x + radius * Math.sin(phi) * Math.sin(theta);
    const y = target.y + radius * Math.cos(phi);
    const z = target.z + radius * Math.sin(phi) * Math.cos(theta);

    cameraRef.current.position.set(x, y, z);
    cameraRef.current.lookAt(target);
  }, []);

  // Set Camera View Presets
  const setCameraView = (preset: '2.5D' | '2D' | '3D') => {
    setCameraPreset(preset);
    if (preset === '2D') {
      cameraAngleRef.current = { theta: 0, phi: 0.05, radius: 110 };
      cameraTargetRef.current.set(0, 0, 0);
    } else if (preset === '3D') {
      cameraAngleRef.current = { theta: Math.PI / 4.5, phi: Math.PI / 2.3, radius: 85 };
      cameraTargetRef.current.set(5, 0, 5);
    } else {
      // 2.5D Isometric Default
      cameraAngleRef.current = { theta: Math.PI / 4, phi: Math.PI / 3.2, radius: 115 };
      cameraTargetRef.current.set(0, 0, 0);
    }
    updateCameraPosition();
  };

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0F172A');
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    cameraRef.current = camera;
    updateCameraPosition();

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // 4. Lighting (Sunlight + Ambient for realistic GIS shadows)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 0.9);
    sunLight.position.set(60, 100, 40);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 250;
    sunLight.shadow.camera.left = -70;
    sunLight.shadow.camera.right = 70;
    sunLight.shadow.camera.top = 70;
    sunLight.shadow.camera.bottom = -70;
    sunLight.shadow.bias = -0.001;
    scene.add(sunLight);

    const blueFillLight = new THREE.DirectionalLight(0x38bdf8, 0.25);
    blueFillLight.position.set(-50, 40, -50);
    scene.add(blueFillLight);

    // 5. Geographic Ground Plane with Basemap Texture
    const basemapTexture = createGeographicBasemapTexture();
    const groundGeo = new THREE.PlaneGeometry(100, 100, 32, 32);
    const groundMat = new THREE.MeshStandardMaterial({
      map: basemapTexture,
      roughness: 0.85,
      metalness: 0.1,
      transparent: true,
      opacity: isSubsurfaceXRay ? 0.45 : 1.0
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.receiveShadow = true;
    groundMeshRef.current = groundMesh;
    scene.add(groundMesh);

    // Ground Grid Wireframe Accent
    const gridHelper = new THREE.GridHelper(100, 20, 0x3b82f6, 0x1e293b);
    gridHelper.position.y = 0.02;
    scene.add(gridHelper);

    // 6. Layer Groups
    const meshesGroup = new THREE.Group();
    const buildingsGroup = new THREE.Group();
    const legacyGroup = new THREE.Group();
    const utilitiesGroup = new THREE.Group();
    const roadGroup = new THREE.Group();

    scene.add(meshesGroup);
    scene.add(buildingsGroup);
    scene.add(legacyGroup);
    scene.add(utilitiesGroup);
    scene.add(roadGroup);

    meshesGroupRef.current = meshesGroup;
    buildingsGroupRef.current = buildingsGroup;
    legacyGroupRef.current = legacyGroup;
    utilitiesGroupRef.current = utilitiesGroup;
    roadGroupRef.current = roadGroup;

    // 7. Animation Loop
    const animate = () => {
      reqAnimRef.current = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (reqAnimRef.current) cancelAnimationFrame(reqAnimRef.current);
      renderer.dispose();
    };
  }, [createGeographicBasemapTexture, updateCameraPosition, isSubsurfaceXRay]);

  // Update Ground Opacity when Subsurface X-Ray Mode changes
  useEffect(() => {
    if (groundMeshRef.current) {
      const mat = groundMeshRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = isSubsurfaceXRay ? 0.35 : 1.0;
      mat.needsUpdate = true;
    }
  }, [isSubsurfaceXRay]);

  // Re-build 3D Spatial Geometry when Ward, Layers, Selection, or ViewMode changes
  useEffect(() => {
    if (
      !sceneRef.current || 
      !meshesGroupRef.current || 
      !buildingsGroupRef.current || 
      !legacyGroupRef.current || 
      !utilitiesGroupRef.current ||
      !roadGroupRef.current
    ) return;

    const meshesGroup = meshesGroupRef.current;
    const buildingsGroup = buildingsGroupRef.current;
    const legacyGroup = legacyGroupRef.current;
    const utilitiesGroup = utilitiesGroupRef.current;
    const roadGroup = roadGroupRef.current;

    // Clear previous children
    while (meshesGroup.children.length > 0) meshesGroup.remove(meshesGroup.children[0]);
    while (buildingsGroup.children.length > 0) buildingsGroup.remove(buildingsGroup.children[0]);
    while (legacyGroup.children.length > 0) legacyGroup.remove(legacyGroup.children[0]);
    while (utilitiesGroup.children.length > 0) utilitiesGroup.remove(utilitiesGroup.children[0]);
    while (roadGroup.children.length > 0) roadGroup.remove(roadGroup.children[0]);

    // -------------------------------------------------------------
    // LAYER 1: 1978 Legacy Paper Cadastral Boundaries (Amber dashed ground outlines)
    // -------------------------------------------------------------
    if (layers.showLegacyMap) {
      ward.parcels.forEach((p) => {
        const shapePoints = p.legacyPolygon.map(pt => mapCoordsTo3D(pt.x, pt.y, 0.08));
        const lineGeo = new THREE.BufferGeometry().setFromPoints([...shapePoints, shapePoints[0]]);
        const lineMat = new THREE.LineDashedMaterial({
          color: 0xf59e0b, // Amber
          dashSize: 1.5,
          gapSize: 0.8,
          linewidth: 2
        });
        const lineMesh = new THREE.Line(lineGeo, lineMat);
        lineMesh.computeLineDistances();
        legacyGroup.add(lineMesh);
      });
    }

    // -------------------------------------------------------------
    // LAYER 2: Road Setback Corridor & Encroachment Bounding Boxes
    // -------------------------------------------------------------
    if (layers.showRoadSetbacks) {
      // Statutory setback plane (X=8 to 12 in 3D world space)
      const setbackGeo = new THREE.PlaneGeometry(4, 100);
      const setbackMat = new THREE.MeshBasicMaterial({
        color: 0x3b82f6,
        transparent: true,
        opacity: 0.18,
        side: THREE.DoubleSide
      });
      const setbackMesh = new THREE.Mesh(setbackGeo, setbackMat);
      setbackMesh.rotation.x = -Math.PI / 2;
      setbackMesh.position.set(10, 0.05, 0);
      roadGroup.add(setbackMesh);

      // East Main Road corridor overlay
      const roadCorridorGeo = new THREE.PlaneGeometry(12, 100);
      const roadCorridorMat = new THREE.MeshBasicMaterial({
        color: 0x1e293b,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide
      });
      const roadCorridorMesh = new THREE.Mesh(roadCorridorGeo, roadCorridorMat);
      roadCorridorMesh.rotation.x = -Math.PI / 2;
      roadCorridorMesh.position.set(44, 0.04, 0);
      roadGroup.add(roadCorridorMesh);
    }

    // -------------------------------------------------------------
    // LAYER 3: Subsurface 3D Utilities (Water Mains & High-Voltage Cables)
    // -------------------------------------------------------------
    if (layers.showSubsurfaceUtilities || isSubsurfaceXRay) {
      // 600mm Trunk Drinking Water Main (Cylinder along Z-axis at X=6, Y=-2.0m)
      const pipeGeo = new THREE.CylinderGeometry(0.6, 0.6, 100, 16);
      const pipeMat = new THREE.MeshStandardMaterial({
        color: 0x06b6d4, // Cyan
        roughness: 0.3,
        metalness: 0.7,
        emissive: 0x083344,
        emissiveIntensity: isSubsurfaceXRay ? 0.8 : 0.2
      });
      const pipeMesh = new THREE.Mesh(pipeGeo, pipeMat);
      pipeMesh.rotation.x = Math.PI / 2;
      pipeMesh.position.set(6, -2.0, 0);
      utilitiesGroup.add(pipeMesh);

      // 33kV Underground Power Cable (Cylinder along X-axis at Z=-16.5, Y=-1.4m)
      const cableGeo = new THREE.CylinderGeometry(0.35, 0.35, 100, 16);
      const cableMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b, // Amber Gold
        roughness: 0.4,
        metalness: 0.6,
        emissive: 0x78350f,
        emissiveIntensity: isSubsurfaceXRay ? 0.8 : 0.2
      });
      const cableMesh = new THREE.Mesh(cableGeo, cableMat);
      cableMesh.rotation.z = Math.PI / 2;
      cableMesh.position.set(0, -1.4, -16.5);
      utilitiesGroup.add(cableMesh);
    }

    // -------------------------------------------------------------
    // LAYER 4: 2.5D / 3D Buildings & Cadastral Parcel Polygons
    // -------------------------------------------------------------
    ward.parcels.forEach((p) => {
      const isSelected = selectedParcel?.id === p.id;
      const isConflict = p.status === 'CONFLICT';
      const isReview = p.status === 'REVIEW_REQUIRED';

      const activePoly = p.isResolved ? p.harmonizedPolygon : p.dronePolygon;
      const points3D = activePoly.map(pt => mapCoordsTo3D(pt.x, pt.y, 0.1));

      // 1. Plot Base Boundary Polygon on Ground
      const shape = new THREE.Shape();
      activePoly.forEach((pt, idx) => {
        const v = mapCoordsTo3D(pt.x, pt.y, 0);
        if (idx === 0) shape.moveTo(v.x, v.z);
        else shape.lineTo(v.x, v.z);
      });
      shape.closePath();

      // Parcel Status Color
      let colorHex = 0x16a34a; // Green (Verified)
      if (viewMode === 'HEATMAP') {
        if (p.confidence.overallScore < 70) colorHex = 0xdc2626;
        else if (p.confidence.overallScore < 90) colorHex = 0xd97706;
      } else {
        if (isConflict) colorHex = 0xdc2626;
        else if (isReview) colorHex = 0xd97706;
      }

      if (isSelected) colorHex = 0x0284c7; // Vibrant Blue when selected

      // Ground Polygon Fill
      const parcelPolyGeo = new THREE.ShapeGeometry(shape);
      const parcelPolyMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: isSelected ? 0.45 : isConflict ? 0.35 : 0.22,
        side: THREE.DoubleSide
      });
      const parcelPolyMesh = new THREE.Mesh(parcelPolyGeo, parcelPolyMat);
      parcelPolyMesh.rotation.x = Math.PI / 2;
      parcelPolyMesh.position.y = 0.08;
      parcelPolyMesh.userData = { parcel: p };
      meshesGroup.add(parcelPolyMesh);

      // Plot Boundary Line Outline
      const lineGeo = new THREE.BufferGeometry().setFromPoints([...points3D, points3D[0]]);
      const lineMat = new THREE.LineBasicMaterial({
        color: isSelected ? 0x38bdf8 : colorHex,
        linewidth: isSelected ? 3 : 1.5
      });
      const lineMesh = new THREE.Line(lineGeo, lineMat);
      lineMesh.userData = { parcel: p };
      meshesGroup.add(lineMesh);

      // 2. 2.5D / 3D Extruded Building Structure (Based on DSM Floor Count)
      if (layers.showBuildingFootprints && p.tax.detectedFloorCount > 0) {
        // Compute building footprint slightly inset from plot boundary (80% scale)
        const buildingShape = new THREE.Shape();
        const center = activePoly.reduce((acc, pt) => ({ x: acc.x + pt.x, y: acc.y + pt.y }), { x: 0, y: 0 });
        center.x /= activePoly.length;
        center.y /= activePoly.length;

        activePoly.forEach((pt, idx) => {
          const insetX = center.x + (pt.x - center.x) * 0.78;
          const insetY = center.y + (pt.y - center.y) * 0.78;
          const v = mapCoordsTo3D(insetX, insetY, 0);
          if (idx === 0) buildingShape.moveTo(v.x, v.z);
          else buildingShape.lineTo(v.x, v.z);
        });
        buildingShape.closePath();

        // Building height: ~3.2m per floor
        const floorHeight = 3.2;
        const totalHeight = Math.max(2.5, p.tax.detectedFloorCount * floorHeight);

        const extrudeSettings: THREE.ExtrudeGeometryOptions = {
          depth: totalHeight,
          bevelEnabled: true,
          bevelSegments: 2,
          steps: 1,
          bevelSize: 0.2,
          bevelThickness: 0.2
        };

        const buildingGeo = new THREE.ExtrudeGeometry(buildingShape, extrudeSettings);
        
        // Building Facade & Roof styling
        let buildingColor = 0x334155; // Slate building
        if (p.tax.detectedPropertyType === 'Commercial') buildingColor = 0x1e3a5f;
        if (isConflict) buildingColor = 0x451a1a; // Red tinted if encroachment
        if (isSelected) buildingColor = 0x0f3b60;

        const buildingMat = new THREE.MeshStandardMaterial({
          color: isSelected ? 0x1d4ed8 : buildingColor,
          roughness: 0.65,
          metalness: 0.25
        });

        const buildingMesh = new THREE.Mesh(buildingGeo, buildingMat);
        buildingMesh.rotation.x = Math.PI / 2;
        buildingMesh.position.y = totalHeight;
        buildingMesh.castShadow = true;
        buildingMesh.receiveShadow = true;
        buildingMesh.userData = { parcel: p, isBuilding: true };
        buildingsGroup.add(buildingMesh);

        // Building Roof Accent Edge Wireframe
        const edgesGeo = new THREE.EdgesGeometry(buildingGeo);
        const edgesMat = new THREE.LineBasicMaterial({
          color: isSelected ? 0x38bdf8 : isConflict ? 0xef4444 : 0x64748b,
          linewidth: 1
        });
        const edgesMesh = new THREE.LineSegments(edgesGeo, edgesMat);
        edgesMesh.rotation.x = Math.PI / 2;
        edgesMesh.position.y = totalHeight;
        buildingsGroup.add(edgesMesh);

        // Encroachment Hazard Flash Volume (For Plot 412/B if unresolved)
        if (p.id === 'PLOT-412-B' && !p.isResolved) {
          const hazardGeo = new THREE.BoxGeometry(4, totalHeight + 1, 24);
          const hazardMat = new THREE.MeshStandardMaterial({
            color: 0xdc2626,
            transparent: true,
            opacity: 0.45,
            emissive: 0x991b1b,
            emissiveIntensity: 0.6
          });
          const hazardMesh = new THREE.Mesh(hazardGeo, hazardMat);
          hazardMesh.position.set(10, (totalHeight + 1) / 2, -3);
          buildingsGroup.add(hazardMesh);
        }
      }
    });
  }, [ward, layers, selectedParcel, viewMode, isSubsurfaceXRay, mapCoordsTo3D]);

  // Raycasting for Mouse Hover & Click Interaction
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.button === 0) isDraggingRef.current = true;
    if (e.button === 2) isRightDraggingRef.current = true;
    previousMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
    isRightDraggingRef.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!containerRef.current || !canvasRef.current || !cameraRef.current || !sceneRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    // 1. Camera Orbit Dragging
    if (isDraggingRef.current) {
      const deltaX = e.clientX - previousMousePosRef.current.x;
      const deltaY = e.clientY - previousMousePosRef.current.y;

      cameraAngleRef.current.theta -= deltaX * 0.008;
      cameraAngleRef.current.phi = Math.max(
        0.05,
        Math.min(Math.PI / 2 - 0.05, cameraAngleRef.current.phi - deltaY * 0.008)
      );

      updateCameraPosition();
      previousMousePosRef.current = { x: e.clientX, y: e.clientY };
      return;
    }

    if (isRightDraggingRef.current) {
      // Pan camera target
      const deltaX = e.clientX - previousMousePosRef.current.x;
      const deltaY = e.clientY - previousMousePosRef.current.y;

      const panSpeed = 0.15;
      cameraTargetRef.current.x -= deltaX * panSpeed;
      cameraTargetRef.current.z -= deltaY * panSpeed;

      updateCameraPosition();
      previousMousePosRef.current = { x: e.clientX, y: e.clientY };
      return;
    }

    // 2. Real Coordinate readout calculation
    const normX = (e.clientX - rect.left) / rect.width;
    const normY = (e.clientY - rect.top) / rect.height;
    const baseLat = 23.3441;
    const baseLng = 85.3095;
    const curLat = (baseLat + (0.5 - normY) * 0.004).toFixed(4);
    const curLng = (baseLng + (normX - 0.5) * 0.004).toFixed(4);
    setCursorCoords({ lat: curLat, lng: curLng });

    // 3. Raycast to find hovered parcel
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), cameraRef.current);

    const checkObjects: THREE.Object3D[] = [];
    if (meshesGroupRef.current) checkObjects.push(...meshesGroupRef.current.children);
    if (buildingsGroupRef.current) checkObjects.push(...buildingsGroupRef.current.children);

    const intersects = raycaster.intersectObjects(checkObjects, true);

    if (intersects.length > 0) {
      const hit = intersects.find(i => i.object.userData?.parcel);
      if (hit && hit.object.userData.parcel) {
        setHoveredParcel(hit.object.userData.parcel);
        setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        canvasRef.current.style.cursor = 'pointer';
        return;
      }
    }

    setHoveredParcel(null);
    canvasRef.current.style.cursor = 'grab';
  };

  const handlePointerClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !cameraRef.current || !sceneRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), cameraRef.current);

    const checkObjects: THREE.Object3D[] = [];
    if (meshesGroupRef.current) checkObjects.push(...meshesGroupRef.current.children);
    if (buildingsGroupRef.current) checkObjects.push(...buildingsGroupRef.current.children);

    const intersects = raycaster.intersectObjects(checkObjects, true);
    if (intersects.length > 0) {
      const hit = intersects.find(i => i.object.userData?.parcel);
      if (hit && hit.object.userData.parcel) {
        onSelectParcel(hit.object.userData.parcel);
      }
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY * 0.08;
    cameraAngleRef.current.radius = Math.max(30, Math.min(220, cameraAngleRef.current.radius + zoomFactor));
    updateCameraPosition();
  };

  const handleZoomBtn = (direction: 'in' | 'out') => {
    const delta = direction === 'in' ? -15 : 15;
    cameraAngleRef.current.radius = Math.max(30, Math.min(220, cameraAngleRef.current.radius + delta));
    updateCameraPosition();
  };

  const handleResetView = () => {
    setCameraView('2.5D');
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full bg-[#0F172A] overflow-hidden select-none"
    >
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerMove={handlePointerMove}
        onClick={handlePointerClick}
        onWheel={handleWheel}
        onContextMenu={(e) => e.preventDefault()}
        className="w-full h-full block touch-none"
      />

      {/* Camera View Angle Buttons (Top Right) */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-white/95 backdrop-blur-xs p-1 rounded-lg border border-slate-300 shadow-md text-xs font-semibold">
        <button
          onClick={() => setCameraView('2.5D')}
          className={`px-2.5 py-1 rounded transition cursor-pointer flex items-center gap-1 ${
            cameraPreset === '2.5D' ? 'bg-[#0F2942] text-white' : 'text-slate-700 hover:bg-slate-100'
          }`}
          title="2.5D Isometric Angle"
        >
          <Box className="w-3.5 h-3.5" />
          <span>2.5D View</span>
        </button>

        <button
          onClick={() => setCameraView('2D')}
          className={`px-2.5 py-1 rounded transition cursor-pointer flex items-center gap-1 ${
            cameraPreset === '2D' ? 'bg-[#0F2942] text-white' : 'text-slate-700 hover:bg-slate-100'
          }`}
          title="2D Top-Down Nadir Survey"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>2D Nadir</span>
        </button>

        <button
          onClick={() => setCameraView('3D')}
          className={`px-2.5 py-1 rounded transition cursor-pointer flex items-center gap-1 ${
            cameraPreset === '3D' ? 'bg-[#0F2942] text-white' : 'text-slate-700 hover:bg-slate-100'
          }`}
          title="3D Street Perspective"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>3D Oblique</span>
        </button>

        <button
          onClick={handleResetView}
          className="p-1 rounded text-slate-600 hover:bg-slate-100 border-l border-slate-200 ml-1 transition cursor-pointer"
          title="Reset Camera Extent"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Floating Hover Parcel Tooltip HUD */}
      {hoveredParcel && (
        <div
          className="absolute pointer-events-none p-3 rounded-lg bg-white/95 text-slate-900 border border-slate-300 shadow-xl text-xs space-y-1 z-30 min-w-[200px]"
          style={{
            left: `${Math.min(window.innerWidth - 260, tooltipPos.x + 15)}px`,
            top: `${Math.min(window.innerHeight - 200, tooltipPos.y + 15)}px`
          }}
        >
          <div className="flex items-center justify-between gap-2 pb-1 border-b border-slate-200">
            <span className="font-bold text-[#0F2942] text-sm">Plot {hoveredParcel.plotNumber}</span>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
              hoveredParcel.status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
              hoveredParcel.status === 'REVIEW_REQUIRED' ? 'bg-amber-50 text-amber-900 border-amber-200' :
              'bg-red-50 text-red-800 border-red-200'
            }`}>
              {hoveredParcel.status.replace('_', ' ')}
            </span>
          </div>

          <div className="text-[11px] text-slate-600">
            <div>Owner: <strong className="text-slate-900">{hoveredParcel.ownerName}</strong></div>
            <div>ULPIN: <strong className="font-mono text-blue-800 text-[10px]">{hoveredParcel.ulpin}</strong></div>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100 font-mono">
            <span>Confidence: <strong className="text-emerald-700">{hoveredParcel.confidence.overallScore}%</strong></span>
            <span>Floors: <strong className="text-slate-800">{hoveredParcel.tax.detectedFloorCount} DSM</strong></span>
          </div>

          {hoveredParcel.encroachmentDetails?.isEncroaching && (
            <div className="text-[10px] text-red-700 font-semibold bg-red-50 px-2 py-1 rounded border border-red-200 flex items-center gap-1 mt-1">
              <AlertTriangle className="w-3 h-3 shrink-0" />
              <span>{hoveredParcel.encroachmentDetails.encroachmentAreaSqM} m² Encroachment</span>
            </div>
          )}
        </div>
      )}

      {/* Real Geographic Map Attribution & Coordinates Readout (Bottom Bar) */}
      <div className="absolute bottom-3 left-3 z-20 flex flex-wrap items-center gap-2 pointer-events-auto">
        {/* Navigation Instructions */}
        <div className="bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded border border-slate-300 text-[11px] text-slate-700 shadow-xs hidden md:flex items-center gap-2">
          <span>🖱️ Left Drag: <strong>Orbit</strong></span>
          <span>·</span>
          <span>Right Drag: <strong>Pan</strong></span>
          <span>·</span>
          <span>Scroll: <strong>Zoom</strong></span>
        </div>

        {/* Real Coordinates HUD */}
        <div className="bg-[#0F2942] text-white px-3 py-1 rounded border border-slate-700 text-[11px] font-mono shadow-md flex items-center gap-2">
          <MapPin className="w-3 h-3 text-cyan-400" />
          <span>Lat: <strong>{cursorCoords.lat}°N</strong></span>
          <span>Lng: <strong>{cursorCoords.lng}°E</strong></span>
          <span className="text-slate-400 text-[10px]">WGS-84 (EPSG:4326)</span>
        </div>
      </div>

      {/* Zoom Buttons (Bottom Right) */}
      <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1 bg-white p-1 rounded border border-slate-300 shadow-md">
        <button
          onClick={() => handleZoomBtn('in')}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoomBtn('out')}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-700 transition cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
