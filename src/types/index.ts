export type ParcelStatus = 'VERIFIED' | 'REVIEW_REQUIRED' | 'CONFLICT';

export interface Coordinate {
  x: number; // local SVG/canvas percentage or pixel
  y: number;
  lat?: number;
  lng?: number;
}

export interface ConfidenceBreakdown {
  iouScore: number;          // w1 = 0.40 Spatial Overlap (IoU)
  hausdorffScore: number;    // w2 = 0.30 Boundary Edge Fit (1 - Dist_Hausdorff/Dist_max)
  nlpScore: number;          // w3 = 0.30 Semantic Record Match (Bhashini NLP RoR vs Municipal)
  overallScore: number;      // Weighted sum 0 - 100%
}

export interface TaxAssessment {
  registeredFloorCount: number;
  detectedFloorCount: number; // from drone DSM height
  registeredPropertyType: 'Residential' | 'Commercial' | 'Mixed' | 'Institutional';
  detectedPropertyType: 'Residential' | 'Commercial' | 'Mixed' | 'Institutional';
  declaredAnnualTax: number; // INR (e.g. 2000)
  assessedFairTax: number;   // INR (e.g. 52400)
  taxGapAmount: number;      // Discrepancy (e.g. 50400/yr or 350000 back-tax)
  taxStatus: 'COMPLIANT' | 'UNDER_ASSESSED' | 'UNREGISTERED_COMMERCIAL';
}

export interface UtilityCollision {
  utilityType: 'Drinking Water Main (600mm)' | 'High Voltage Cable (33kV)' | 'Gas Pipeline' | 'Optical Fiber Backbone';
  depthMeters: number;
  isColliding: boolean;
  description: string;
  riskLevel: 'CRITICAL' | 'MODERATE' | 'LOW' | 'NONE';
}

export interface BhashiniRecord {
  rawRegionalText: string;     // Hindi or Marathi name/address
  translatedEnglishText: string;
  khataNumber: string;
  khasraNumber: string;
  ownerNameEn: string;
  coOwners: string[];
  matchConfidence: number;     // e.g. 98.4%
  aadhaarLinked: boolean;
}

export interface LandParcel {
  id: string;                 // e.g. "PLOT-412-B"
  plotNumber: string;         // e.g. "412/B"
  khasraNo: string;           // e.g. "412/B"
  khataNo: string;            // e.g. "104"
  ulpin: string;              // e.g. "26-JH-RAN-0042-2026"
  ward: string;               // e.g. "Ward 14 (Main Road, Ranchi)"
  district: string;           // e.g. "Ranchi, Jharkhand"
  registeredAreaSqM: number;  // e.g. 520
  detectedAreaSqM: number;    // e.g. 585
  harmonizedAreaSqM: number;  // e.g. 520
  status: ParcelStatus;
  confidence: ConfidenceBreakdown;
  ownerName: string;
  bhashini: BhashiniRecord;
  tax: TaxAssessment;
  utility: UtilityCollision;
  encroachmentDetails?: {
    isEncroaching: boolean;
    encroachmentAreaSqM: number; // e.g. 28.4
    encroachmentDirection: string; // e.g. "East road setback & Plot 412/A boundary"
    linearShiftMeters: number;   // e.g. 2.5m
  };
  // Geometry polygons for 1978 legacy paper map, 2026 drone footprint, and final harmonized boundary
  legacyPolygon: Coordinate[];
  dronePolygon: Coordinate[];
  harmonizedPolygon: Coordinate[];
  // GPS Bounding Box
  gpsCoordinates: {
    centroid: { lat: number; lng: number };
    vertices: { lat: number; lng: number }[];
  };
  postgisAuditHash?: string;
  lastUpdated: string;
  isResolved?: boolean;
}

export interface ConflictItem {
  id: string;
  plotId: string;
  plotNumber: string;
  title: string;
  type: 'BOUNDARY_OVERLAP' | 'ROAD_ENCROACHMENT' | 'TAX_UNDER_ASSESSMENT' | 'UTILITY_COLLISION' | 'SLIVER_GAP' | 'ROR_NAME_MISMATCH';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  confidenceScore: number;
  description: string;
  affectedParties: string[];
  recommendedAction: string;
  autoHealAvailable: boolean;
  status: 'PENDING' | 'RESOLVED' | 'UNDER_INSPECTION';
  timestamp: string;
}

export interface IngestionDataset {
  id: string;
  name: string;
  type: 'DRONE_GEOTIFF' | 'CADASTRAL_MAP' | 'ROR_CSV' | 'TAX_CSV' | 'UTILITY_CAD';
  format: string;
  fileSize: string;
  sourceDepartment: string;
  coordinateRefSystem: string;
  status: 'READY' | 'PARSING' | 'LOADED' | 'ERROR';
  recordCount?: number;
  resolution?: string;
  uploadDate: string;
}

export interface PipelineStage {
  id: number;
  name: string;
  code: string;
  description: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'ERROR';
  durationMs: number;
  progressPercent: number;
  outputSummary: string;
  logs: string[];
}

export interface WardDataset {
  wardId: string;
  wardName: string;
  district: string;
  state: string;
  totalParcelsCount: number;
  verifiedCount: number;
  reviewRequiredCount: number;
  conflictCount: number;
  totalRegisteredAreaSqM: number;
  totalDetectedAreaSqM: number;
  totalTaxLeakageINR: number;
  litigationRiskAvoidedPercentage: number;
  parcels: LandParcel[];
  conflicts: ConflictItem[];
  datasets: IngestionDataset[];
}
