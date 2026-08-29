import { WardDataset } from '../types';

export const puneWard08Data: WardDataset = {
  wardId: "MH-PUN-W08",
  wardName: "Ward 08 (Kothrud IT Corridor, Pune)",
  district: "Pune",
  state: "Maharashtra",
  totalParcelsCount: 6,
  verifiedCount: 4,
  reviewRequiredCount: 1,
  conflictCount: 1,
  totalRegisteredAreaSqM: 6420,
  totalDetectedAreaSqM: 6510,
  totalTaxLeakageINR: 580000,
  litigationRiskAvoidedPercentage: 92.0,
  datasets: [
    {
      id: "ds-p01",
      name: "pune_kothrud_ctsd_1982.shp",
      type: "CADASTRAL_MAP",
      format: "Cadastral Survey Map (SHP)",
      fileSize: "14.2 MB",
      sourceDepartment: "Settlement Commissioner & Land Records (Maharashtra)",
      coordinateRefSystem: "Local CTS Sheet (WGS-84 Reprojected)",
      status: "LOADED",
      recordCount: 6,
      uploadDate: "2026-08-28 09:30 IST"
    },
    {
      id: "ds-p02",
      name: "pune_drone_kothrud_10cm_dsm.tif",
      type: "DRONE_GEOTIFF",
      format: "GeoTIFF Orthomosaic (ORI + 3D DSM)",
      fileSize: "512.6 MB",
      sourceDepartment: "Survey of India / NAKSHA",
      coordinateRefSystem: "WGS-84 / UTM Zone 43N (EPSG:32643)",
      status: "LOADED",
      resolution: "8 cm GSD Ground Resolution",
      uploadDate: "2026-08-28 09:32 IST"
    },
    {
      id: "ds-p03",
      name: "pune_7_12_saatbara_extracts.csv",
      type: "ROR_CSV",
      format: "7/12 (Saatbara) Land Register (Marathi)",
      fileSize: "3.8 MB",
      sourceDepartment: "Mahabhulekh / Tehsildar Pune",
      coordinateRefSystem: "Saatbara Gut Number Index",
      status: "LOADED",
      recordCount: 6,
      uploadDate: "2026-08-28 09:33 IST"
    }
  ],
  parcels: [
    {
      id: "PLOT-P-201",
      plotNumber: "201/A",
      khasraNo: "Gut 201/A",
      khataNo: "302",
      ulpin: "27-MH-PUN-0104-2026",
      ward: "Ward 08, Kothrud",
      district: "Pune, Maharashtra",
      registeredAreaSqM: 850,
      detectedAreaSqM: 920,
      harmonizedAreaSqM: 850,
      status: "CONFLICT",
      confidence: {
        iouScore: 65.0,
        hausdorffScore: 72.0,
        nlpScore: 74.0,
        overallScore: 69.8
      },
      ownerName: "Sachin Kulkarni & Builders",
      bhashini: {
        rawRegionalText: "सचिन विनायक कुलकर्णी, गट क्रमांक २०१/अ, कोथरूड, पुणे ७/१२ उतारा",
        translatedEnglishText: "Sachin Vinayak Kulkarni, Gut No. 201/A, Kothrud, Pune 7/12 Record",
        khataNumber: "302",
        khasraNumber: "201/A",
        ownerNameEn: "Sachin Vinayak Kulkarni",
        coOwners: ["Manoj Kulkarni"],
        matchConfidence: 97.6,
        aadhaarLinked: true
      },
      tax: {
        registeredFloorCount: 2,
        detectedFloorCount: 4,
        registeredPropertyType: "Residential",
        detectedPropertyType: "Commercial",
        declaredAnnualTax: 12000,
        assessedFairTax: 95000,
        taxGapAmount: 480000,
        taxStatus: "UNDER_ASSESSED"
      },
      utility: {
        utilityType: "High Voltage Cable (33kV)",
        depthMeters: 1.4,
        isColliding: true,
        description: "Extended commercial awning intersects 33kV high tension underground supply corridor.",
        riskLevel: "CRITICAL"
      },
      encroachmentDetails: {
        isEncroaching: true,
        encroachmentAreaSqM: 35.0,
        encroachmentDirection: "DP Road Reservation Encroachment",
        linearShiftMeters: 3.2
      },
      legacyPolygon: [
        { x: 20, y: 20 },
        { x: 50, y: 20 },
        { x: 50, y: 55 },
        { x: 20, y: 55 }
      ],
      dronePolygon: [
        { x: 20, y: 20 },
        { x: 55, y: 20 },
        { x: 55, y: 58 },
        { x: 20, y: 58 }
      ],
      harmonizedPolygon: [
        { x: 20, y: 20 },
        { x: 50, y: 20 },
        { x: 50, y: 55 },
        { x: 20, y: 55 }
      ],
      gpsCoordinates: {
        centroid: { lat: 18.5074, lng: 73.8077 },
        vertices: [
          { lat: 18.5078, lng: 73.8072 },
          { lat: 18.5078, lng: 73.8082 },
          { lat: 18.5070, lng: 73.8082 },
          { lat: 18.5070, lng: 73.8072 }
        ]
      },
      postgisAuditHash: "0xaa9481b01c3e41289190da5124b891823f9901ad",
      lastUpdated: "2026-08-28 09:40:12 IST"
    },
    {
      id: "PLOT-P-202",
      plotNumber: "202",
      khasraNo: "Gut 202",
      khataNo: "305",
      ulpin: "27-MH-PUN-0105-2026",
      ward: "Ward 08, Kothrud",
      district: "Pune, Maharashtra",
      registeredAreaSqM: 1200,
      detectedAreaSqM: 1200,
      harmonizedAreaSqM: 1200,
      status: "VERIFIED",
      confidence: {
        iouScore: 97.0,
        hausdorffScore: 96.0,
        nlpScore: 98.0,
        overallScore: 97.0
      },
      ownerName: "TechPark Infoway Towers",
      bhashini: {
        rawRegionalText: "टेकपार्क इन्फोवे टॉवर्स प्रा. लि., गट २०२",
        translatedEnglishText: "TechPark Infoway Towers Pvt Ltd, Gut 202",
        khataNumber: "305",
        khasraNumber: "202",
        ownerNameEn: "TechPark Infoway Towers Pvt Ltd",
        coOwners: ["PMC Industrial Zone"],
        matchConfidence: 99.2,
        aadhaarLinked: true
      },
      tax: {
        registeredFloorCount: 6,
        detectedFloorCount: 6,
        registeredPropertyType: "Commercial",
        detectedPropertyType: "Commercial",
        declaredAnnualTax: 210000,
        assessedFairTax: 210000,
        taxGapAmount: 0,
        taxStatus: "COMPLIANT"
      },
      utility: {
        utilityType: "Optical Fiber Backbone",
        depthMeters: 2.0,
        isColliding: false,
        description: "Zero utility interference verified.",
        riskLevel: "NONE"
      },
      legacyPolygon: [
        { x: 55, y: 20 },
        { x: 88, y: 20 },
        { x: 88, y: 55 },
        { x: 55, y: 55 }
      ],
      dronePolygon: [
        { x: 55, y: 20 },
        { x: 88, y: 20 },
        { x: 88, y: 55 },
        { x: 55, y: 55 }
      ],
      harmonizedPolygon: [
        { x: 55, y: 20 },
        { x: 88, y: 20 },
        { x: 88, y: 55 },
        { x: 55, y: 55 }
      ],
      gpsCoordinates: {
        centroid: { lat: 18.5074, lng: 73.8095 },
        vertices: [
          { lat: 18.5078, lng: 73.8090 },
          { lat: 18.5078, lng: 73.8100 },
          { lat: 18.5070, lng: 73.8100 },
          { lat: 18.5070, lng: 73.8090 }
        ]
      },
      postgisAuditHash: "0xbb1234c901928374e5091da823419cbb8709121a",
      lastUpdated: "2026-08-28 09:40:12 IST"
    }
  ],
  conflicts: [
    {
      id: "CONF-P01",
      plotId: "PLOT-P-201",
      plotNumber: "201/A",
      title: "Commercial DP Road Setback Encroachment & 4-Story Height Mismatch",
      type: "ROAD_ENCROACHMENT",
      severity: "CRITICAL",
      confidenceScore: 69.8,
      description: "Drone DSM reveals 4-story commercial building with 3.2m encroachment on municipal DP road reservation line.",
      affectedParties: ["Mr. Sachin Kulkarni", "Pune Municipal Corporation (Town Planning)"],
      recommendedAction: "Apply ST_Snap; freeze title until commercial penalty and road setback clearance is resolved.",
      autoHealAvailable: true,
      status: "PENDING",
      timestamp: "2026-08-28 09:40:12 IST"
    }
  ]
};
