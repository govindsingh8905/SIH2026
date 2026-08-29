import { WardDataset } from '../types';

export const ranchiWard14Data: WardDataset = {
  wardId: "JH-RAN-W14",
  wardName: "Ward 14 (Main Road, Ranchi)",
  district: "Ranchi",
  state: "Jharkhand",
  totalParcelsCount: 8,
  verifiedCount: 5,
  reviewRequiredCount: 2,
  conflictCount: 1,
  totalRegisteredAreaSqM: 5170,
  totalDetectedAreaSqM: 5297,
  totalTaxLeakageINR: 425000,
  litigationRiskAvoidedPercentage: 87.5,
  datasets: [
    {
      id: "ds-01",
      name: "ranchi_ward14_cadastral_1978.pdf",
      type: "CADASTRAL_MAP",
      format: "Scanned Paper Map (PDF/SHP)",
      fileSize: "18.4 MB",
      sourceDepartment: "Revenue & Land Reforms Dept (DoLR)",
      coordinateRefSystem: "Local 1978 Survey Chain (Non-projected)",
      status: "LOADED",
      recordCount: 8,
      uploadDate: "2026-08-28 10:14 IST"
    },
    {
      id: "ds-02",
      name: "naksha_drone_ranchi_w14_10cm.tif",
      type: "DRONE_GEOTIFF",
      format: "GeoTIFF Orthomosaic (ORI + DSM)",
      fileSize: "442.8 MB",
      sourceDepartment: "Survey of India / NAKSHA Programme",
      coordinateRefSystem: "WGS-84 / UTM Zone 45N (EPSG:32645)",
      status: "LOADED",
      resolution: "10 cm GSD Ground Resolution",
      uploadDate: "2026-08-28 10:15 IST"
    },
    {
      id: "ds-03",
      name: "ranchi_municipal_ror_khasra.csv",
      type: "ROR_CSV",
      format: "Record of Rights (RoR CSV/Bhashini Text)",
      fileSize: "2.1 MB",
      sourceDepartment: "District Land Revenue Office (Tehsildar)",
      coordinateRefSystem: "Tabular Khasra/Khata Matrix",
      status: "LOADED",
      recordCount: 8,
      uploadDate: "2026-08-28 10:15 IST"
    },
    {
      id: "ds-04",
      name: "ranchi_ward14_utilities_subsurface.dxf",
      type: "UTILITY_CAD",
      format: "Underground Infrastructure (CAD/GIS)",
      fileSize: "8.6 MB",
      sourceDepartment: "Ranchi Municipal Water & Sewerage Board",
      coordinateRefSystem: "WGS-84 (EPSG:4326)",
      status: "LOADED",
      recordCount: 14,
      uploadDate: "2026-08-28 10:16 IST"
    },
    {
      id: "ds-05",
      name: "municipal_property_tax_ledger_2026.csv",
      type: "TAX_CSV",
      format: "Property Tax Assessment Register",
      fileSize: "3.4 MB",
      sourceDepartment: "Ranchi Municipal Corporation (RMC)",
      coordinateRefSystem: "Tabular Tax Assessment",
      status: "LOADED",
      recordCount: 8,
      uploadDate: "2026-08-28 10:16 IST"
    }
  ],
  parcels: [
    {
      id: "PLOT-412-B",
      plotNumber: "412/B",
      khasraNo: "412/B",
      khataNo: "104",
      ulpin: "26-JH-RAN-0042-2026",
      ward: "Ward 14, Main Road",
      district: "Ranchi, Jharkhand",
      registeredAreaSqM: 520,
      detectedAreaSqM: 585,
      harmonizedAreaSqM: 520,
      status: "CONFLICT",
      confidence: {
        iouScore: 62.4,
        hausdorffScore: 71.0,
        nlpScore: 73.2,
        overallScore: 68.2
      },
      ownerName: "Rajesh Verma",
      bhashini: {
        rawRegionalText: "श्री राजेश वर्मा, पिता- रामअवतार वर्मा, खाता संख्या 104, खेसरा 412/ख, मुख्य मार्ग रांची",
        translatedEnglishText: "Shri Rajesh Verma, S/o Ramavatar Verma, Khata No. 104, Khasra 412/B, Main Road Ranchi",
        khataNumber: "104",
        khasraNumber: "412/B",
        ownerNameEn: "Rajesh Verma",
        coOwners: ["Sunita Verma (Spouse)", "Alok Verma (Son)"],
        matchConfidence: 98.4,
        aadhaarLinked: true
      },
      tax: {
        registeredFloorCount: 1,
        detectedFloorCount: 3,
        registeredPropertyType: "Residential",
        detectedPropertyType: "Commercial",
        declaredAnnualTax: 2000,
        assessedFairTax: 52400,
        taxGapAmount: 350000,
        taxStatus: "UNDER_ASSESSED"
      },
      utility: {
        utilityType: "Drinking Water Main (600mm)",
        depthMeters: 1.8,
        isColliding: true,
        description: "Commercial building foundation pillar erected directly above 600mm underground municipal trunk water pipeline.",
        riskLevel: "CRITICAL"
      },
      encroachmentDetails: {
        isEncroaching: true,
        encroachmentAreaSqM: 28.4,
        encroachmentDirection: "East Road Setback & West Boundary of Plot 412/A",
        linearShiftMeters: 2.5
      },
      legacyPolygon: [
        { x: 38, y: 35 },
        { x: 58, y: 35 },
        { x: 58, y: 60 },
        { x: 38, y: 60 }
      ],
      dronePolygon: [
        { x: 36, y: 33 },
        { x: 62, y: 33 }, // 2.5m shift right towards road setback
        { x: 62, y: 63 },
        { x: 36, y: 63 }
      ],
      harmonizedPolygon: [
        { x: 38, y: 35 },
        { x: 58, y: 35 },
        { x: 58, y: 60 },
        { x: 38, y: 60 }
      ],
      gpsCoordinates: {
        centroid: { lat: 23.3441, lng: 85.3095 },
        vertices: [
          { lat: 23.3443, lng: 85.3091 },
          { lat: 23.3443, lng: 85.3099 },
          { lat: 23.3439, lng: 85.3099 },
          { lat: 23.3439, lng: 85.3091 }
        ]
      },
      postgisAuditHash: "0x8f2a174c93be4e9102cba372d8a569b04c8f1e29",
      lastUpdated: "2026-08-28 10:18:42 IST"
    },
    {
      id: "PLOT-412-A",
      plotNumber: "412/A",
      khasraNo: "412/A",
      khataNo: "103",
      ulpin: "26-JH-RAN-0041-2026",
      ward: "Ward 14, Main Road",
      district: "Ranchi, Jharkhand",
      registeredAreaSqM: 480,
      detectedAreaSqM: 462,
      harmonizedAreaSqM: 480,
      status: "REVIEW_REQUIRED",
      confidence: {
        iouScore: 72.8,
        hausdorffScore: 76.5,
        nlpScore: 78.0,
        overallScore: 75.4
      },
      ownerName: "Sunita Sharma",
      bhashini: {
        rawRegionalText: "श्रीमती सुनीता शर्मा, पति- स्वर्गीय आलोक शर्मा, खाता 103, खेसरा 412/क",
        translatedEnglishText: "Smt. Sunita Sharma, W/o Late Alok Sharma, Khata 103, Khasra 412/A",
        khataNumber: "103",
        khasraNumber: "412/A",
        ownerNameEn: "Sunita Sharma",
        coOwners: ["Rohit Sharma (Son)"],
        matchConfidence: 97.8,
        aadhaarLinked: true
      },
      tax: {
        registeredFloorCount: 2,
        detectedFloorCount: 2,
        registeredPropertyType: "Residential",
        detectedPropertyType: "Residential",
        declaredAnnualTax: 6200,
        assessedFairTax: 6200,
        taxGapAmount: 0,
        taxStatus: "COMPLIANT"
      },
      utility: {
        utilityType: "Drinking Water Main (600mm)",
        depthMeters: 2.1,
        isColliding: false,
        description: "Municipal utility buffer maintained with 1.2m clearance.",
        riskLevel: "NONE"
      },
      encroachmentDetails: {
        isEncroaching: false,
        encroachmentAreaSqM: 18.0,
        encroachmentDirection: "Encroached upon by neighbor Plot 412/B",
        linearShiftMeters: 1.8
      },
      legacyPolygon: [
        { x: 16, y: 35 },
        { x: 38, y: 35 },
        { x: 38, y: 60 },
        { x: 16, y: 60 }
      ],
      dronePolygon: [
        { x: 16, y: 35 },
        { x: 36, y: 35 },
        { x: 36, y: 60 },
        { x: 16, y: 60 }
      ],
      harmonizedPolygon: [
        { x: 16, y: 35 },
        { x: 38, y: 35 },
        { x: 38, y: 60 },
        { x: 16, y: 60 }
      ],
      gpsCoordinates: {
        centroid: { lat: 23.3441, lng: 85.3082 },
        vertices: [
          { lat: 23.3443, lng: 85.3078 },
          { lat: 23.3443, lng: 85.3086 },
          { lat: 23.3439, lng: 85.3086 },
          { lat: 23.3439, lng: 85.3078 }
        ]
      },
      postgisAuditHash: "0x3e1d994a2b1c8f74e6a0d258b3c94178f0b7c122",
      lastUpdated: "2026-08-28 10:18:42 IST"
    },
    {
      id: "PLOT-401",
      plotNumber: "401",
      khasraNo: "401",
      khataNo: "91",
      ulpin: "26-JH-RAN-0035-2026",
      ward: "Ward 14, Main Road",
      district: "Ranchi, Jharkhand",
      registeredAreaSqM: 650,
      detectedAreaSqM: 652,
      harmonizedAreaSqM: 650,
      status: "VERIFIED",
      confidence: {
        iouScore: 96.2,
        hausdorffScore: 94.5,
        nlpScore: 93.8,
        overallScore: 94.8
      },
      ownerName: "Ranchi Municipal Supermarket Ltd",
      bhashini: {
        rawRegionalText: "रांची म्यूनिसिपल सुपरमार्केट लिमिटेड, खाता संख्या 91, खेसरा 401",
        translatedEnglishText: "Ranchi Municipal Supermarket Ltd, Khata 91, Khasra 401",
        khataNumber: "91",
        khasraNumber: "401",
        ownerNameEn: "RMC Commercial Entity",
        coOwners: ["RMC Joint Directorate"],
        matchConfidence: 99.1,
        aadhaarLinked: true
      },
      tax: {
        registeredFloorCount: 3,
        detectedFloorCount: 3,
        registeredPropertyType: "Commercial",
        detectedPropertyType: "Commercial",
        declaredAnnualTax: 78000,
        assessedFairTax: 78000,
        taxGapAmount: 0,
        taxStatus: "COMPLIANT"
      },
      utility: {
        utilityType: "Gas Pipeline",
        depthMeters: 2.4,
        isColliding: false,
        description: "Gas pipeline passes 3.5m away from foundation footing.",
        riskLevel: "NONE"
      },
      legacyPolygon: [
        { x: 62, y: 35 },
        { x: 86, y: 35 },
        { x: 86, y: 60 },
        { x: 62, y: 60 }
      ],
      dronePolygon: [
        { x: 62, y: 35 },
        { x: 86, y: 35 },
        { x: 86, y: 60 },
        { x: 62, y: 60 }
      ],
      harmonizedPolygon: [
        { x: 62, y: 35 },
        { x: 86, y: 35 },
        { x: 86, y: 60 },
        { x: 62, y: 60 }
      ],
      gpsCoordinates: {
        centroid: { lat: 23.3441, lng: 85.3110 },
        vertices: [
          { lat: 23.3443, lng: 85.3105 },
          { lat: 23.3443, lng: 85.3115 },
          { lat: 23.3439, lng: 85.3115 },
          { lat: 23.3439, lng: 85.3105 }
        ]
      },
      postgisAuditHash: "0x77c4e321aa90b6ef512d7c4890a82b9914f6d338",
      lastUpdated: "2026-08-28 10:18:42 IST"
    },
    {
      id: "PLOT-402",
      plotNumber: "402",
      khasraNo: "402",
      khataNo: "92",
      ulpin: "26-JH-RAN-0036-2026",
      ward: "Ward 14, Main Road",
      district: "Ranchi, Jharkhand",
      registeredAreaSqM: 410,
      detectedAreaSqM: 416,
      harmonizedAreaSqM: 410,
      status: "REVIEW_REQUIRED",
      confidence: {
        iouScore: 84.0,
        hausdorffScore: 91.2,
        nlpScore: 92.0,
        overallScore: 88.6
      },
      ownerName: "Dr. Arvind Prasad Clinic",
      bhashini: {
        rawRegionalText: "डॉक्टर अरविन्द प्रसाद, पिता- महादेव प्रसाद, खाता 92, खेसरा 402",
        translatedEnglishText: "Dr. Arvind Prasad, S/o Mahadev Prasad, Khata 92, Khasra 402",
        khataNumber: "92",
        khasraNumber: "402",
        ownerNameEn: "Dr. Arvind Prasad",
        coOwners: ["Dr. Rashmi Prasad"],
        matchConfidence: 96.5,
        aadhaarLinked: true
      },
      tax: {
        registeredFloorCount: 2,
        detectedFloorCount: 2,
        registeredPropertyType: "Mixed",
        detectedPropertyType: "Mixed",
        declaredAnnualTax: 24000,
        assessedFairTax: 26500,
        taxGapAmount: 2500,
        taxStatus: "UNDER_ASSESSED"
      },
      utility: {
        utilityType: "High Voltage Cable (33kV)",
        depthMeters: 1.5,
        isColliding: false,
        description: "Underground cable line safely 2m north of property line.",
        riskLevel: "LOW"
      },
      encroachmentDetails: {
        isEncroaching: false,
        encroachmentAreaSqM: 6.0,
        encroachmentDirection: "Sliver gap with boundary edge",
        linearShiftMeters: 0.12
      },
      legacyPolygon: [
        { x: 16, y: 10 },
        { x: 38, y: 10 },
        { x: 38, y: 32 },
        { x: 16, y: 32 }
      ],
      dronePolygon: [
        { x: 16.5, y: 10 },
        { x: 38.3, y: 10 },
        { x: 38.3, y: 32.5 },
        { x: 16.5, y: 32.5 }
      ],
      harmonizedPolygon: [
        { x: 16, y: 10 },
        { x: 38, y: 10 },
        { x: 38, y: 32 },
        { x: 16, y: 32 }
      ],
      gpsCoordinates: {
        centroid: { lat: 23.3452, lng: 85.3082 },
        vertices: [
          { lat: 23.3455, lng: 85.3078 },
          { lat: 23.3455, lng: 85.3086 },
          { lat: 23.3449, lng: 85.3086 },
          { lat: 23.3449, lng: 85.3078 }
        ]
      },
      postgisAuditHash: "0x11b5820de469823f9091da824c18f3a55cd291a4",
      lastUpdated: "2026-08-28 10:18:42 IST"
    },
    {
      id: "PLOT-403",
      plotNumber: "403",
      khasraNo: "403",
      khataNo: "95",
      ulpin: "26-JH-RAN-0037-2026",
      ward: "Ward 14, Main Road",
      district: "Ranchi, Jharkhand",
      registeredAreaSqM: 340,
      detectedAreaSqM: 341,
      harmonizedAreaSqM: 340,
      status: "VERIFIED",
      confidence: {
        iouScore: 97.4,
        hausdorffScore: 95.8,
        nlpScore: 95.0,
        overallScore: 96.2
      },
      ownerName: "Sunil Kujur & Family",
      bhashini: {
        rawRegionalText: "सुनील कुजूर, पिता- बिरसा कुजूर, खाता 95, खेसरा 403",
        translatedEnglishText: "Sunil Kujur, S/o Birsa Kujur, Khata 95, Khasra 403",
        khataNumber: "95",
        khasraNumber: "403",
        ownerNameEn: "Sunil Kujur",
        coOwners: ["Anita Kujur"],
        matchConfidence: 98.9,
        aadhaarLinked: true
      },
      tax: {
        registeredFloorCount: 1,
        detectedFloorCount: 1,
        registeredPropertyType: "Residential",
        detectedPropertyType: "Residential",
        declaredAnnualTax: 2800,
        assessedFairTax: 2800,
        taxGapAmount: 0,
        taxStatus: "COMPLIANT"
      },
      utility: {
        utilityType: "Optical Fiber Backbone",
        depthMeters: 1.2,
        isColliding: false,
        description: "Telecom fiber route verified with zero encroachment.",
        riskLevel: "NONE"
      },
      legacyPolygon: [
        { x: 38, y: 10 },
        { x: 58, y: 10 },
        { x: 58, y: 32 },
        { x: 38, y: 32 }
      ],
      dronePolygon: [
        { x: 38, y: 10 },
        { x: 58, y: 10 },
        { x: 58, y: 32 },
        { x: 38, y: 32 }
      ],
      harmonizedPolygon: [
        { x: 38, y: 10 },
        { x: 58, y: 10 },
        { x: 58, y: 32 },
        { x: 38, y: 32 }
      ],
      gpsCoordinates: {
        centroid: { lat: 23.3452, lng: 85.3095 },
        vertices: [
          { lat: 23.3455, lng: 85.3091 },
          { lat: 23.3455, lng: 85.3099 },
          { lat: 23.3449, lng: 85.3099 },
          { lat: 23.3449, lng: 85.3091 }
        ]
      },
      postgisAuditHash: "0x44d82b090a218f77341c28b50a3ef7181c0029b3",
      lastUpdated: "2026-08-28 10:18:42 IST"
    },
    {
      id: "PLOT-404",
      plotNumber: "404",
      khasraNo: "404",
      khataNo: "97",
      ulpin: "26-JH-RAN-0038-2026",
      ward: "Ward 14, Main Road",
      district: "Ranchi, Jharkhand",
      registeredAreaSqM: 490,
      detectedAreaSqM: 494,
      harmonizedAreaSqM: 490,
      status: "VERIFIED",
      confidence: {
        iouScore: 93.0,
        hausdorffScore: 92.5,
        nlpScore: 91.8,
        overallScore: 92.5
      },
      ownerName: "State Bank of India (Ranchi Main)",
      bhashini: {
        rawRegionalText: "भारतीय स्टेट बैंक, मुख्य शाखा रांची, खाता 97, खेसरा 404",
        translatedEnglishText: "State Bank of India, Main Branch Ranchi, Khata 97, Khasra 404",
        khataNumber: "97",
        khasraNumber: "404",
        ownerNameEn: "State Bank of India",
        coOwners: ["SBI Infrastructure Dept"],
        matchConfidence: 99.4,
        aadhaarLinked: true
      },
      tax: {
        registeredFloorCount: 3,
        detectedFloorCount: 3,
        registeredPropertyType: "Commercial",
        detectedPropertyType: "Commercial",
        declaredAnnualTax: 64000,
        assessedFairTax: 64000,
        taxGapAmount: 0,
        taxStatus: "COMPLIANT"
      },
      utility: {
        utilityType: "Drinking Water Main (600mm)",
        depthMeters: 2.2,
        isColliding: false,
        description: "Municipal setback standard compliant.",
        riskLevel: "NONE"
      },
      legacyPolygon: [
        { x: 62, y: 10 },
        { x: 86, y: 10 },
        { x: 86, y: 32 },
        { x: 62, y: 32 }
      ],
      dronePolygon: [
        { x: 62, y: 10 },
        { x: 86, y: 10 },
        { x: 86, y: 32 },
        { x: 62, y: 32 }
      ],
      harmonizedPolygon: [
        { x: 62, y: 10 },
        { x: 86, y: 10 },
        { x: 86, y: 32 },
        { x: 62, y: 32 }
      ],
      gpsCoordinates: {
        centroid: { lat: 23.3452, lng: 85.3110 },
        vertices: [
          { lat: 23.3455, lng: 85.3105 },
          { lat: 23.3455, lng: 85.3115 },
          { lat: 23.3449, lng: 85.3115 },
          { lat: 23.3449, lng: 85.3105 }
        ]
      },
      postgisAuditHash: "0x89e24fa82c0021b654032d1847afc2098b14e912",
      lastUpdated: "2026-08-28 10:18:42 IST"
    },
    {
      id: "PLOT-405",
      plotNumber: "405",
      khasraNo: "405",
      khataNo: "112",
      ulpin: "26-JH-RAN-0043-2026",
      ward: "Ward 14, Main Road",
      district: "Ranchi, Jharkhand",
      registeredAreaSqM: 1120,
      detectedAreaSqM: 1120,
      harmonizedAreaSqM: 1120,
      status: "VERIFIED",
      confidence: {
        iouScore: 98.8,
        hausdorffScore: 97.5,
        nlpScore: 98.0,
        overallScore: 98.1
      },
      ownerName: "Ranchi Municipal Park & Recharge Borewell",
      bhashini: {
        rawRegionalText: "रांची नगर निगम सार्वजनिक पार्क एवं जल संचयन केंद्र, खाता 112, खेसरा 405",
        translatedEnglishText: "Ranchi Municipal Public Park & Water Harvesting Centre, Khata 112, Khasra 405",
        khataNumber: "112",
        khasraNumber: "405",
        ownerNameEn: "Ranchi Municipal Corporation (Public Facility)",
        coOwners: ["DoLR Urban Greens"],
        matchConfidence: 99.8,
        aadhaarLinked: true
      },
      tax: {
        registeredFloorCount: 0,
        detectedFloorCount: 0,
        registeredPropertyType: "Institutional",
        detectedPropertyType: "Institutional",
        declaredAnnualTax: 0,
        assessedFairTax: 0,
        taxGapAmount: 0,
        taxStatus: "COMPLIANT"
      },
      utility: {
        utilityType: "Drinking Water Main (600mm)",
        depthMeters: 2.5,
        isColliding: false,
        description: "Public green belt serves as dedicated utility corridor.",
        riskLevel: "NONE"
      },
      legacyPolygon: [
        { x: 16, y: 64 },
        { x: 50, y: 64 },
        { x: 50, y: 92 },
        { x: 16, y: 92 }
      ],
      dronePolygon: [
        { x: 16, y: 64 },
        { x: 50, y: 64 },
        { x: 50, y: 92 },
        { x: 16, y: 92 }
      ],
      harmonizedPolygon: [
        { x: 16, y: 64 },
        { x: 50, y: 64 },
        { x: 50, y: 92 },
        { x: 16, y: 92 }
      ],
      gpsCoordinates: {
        centroid: { lat: 23.3428, lng: 85.3088 },
        vertices: [
          { lat: 23.3432, lng: 85.3078 },
          { lat: 23.3432, lng: 85.3098 },
          { lat: 23.3424, lng: 85.3098 },
          { lat: 23.3424, lng: 85.3078 }
        ]
      },
      postgisAuditHash: "0x23a1bc09e82c6114fa99b128509ef617a201b87a",
      lastUpdated: "2026-08-28 10:18:42 IST"
    },
    {
      id: "PLOT-406",
      plotNumber: "406",
      khasraNo: "406",
      khataNo: "115",
      ulpin: "26-JH-RAN-0044-2026",
      ward: "Ward 14, Main Road",
      district: "Ranchi, Jharkhand",
      registeredAreaSqM: 1160,
      detectedAreaSqM: 1228,
      harmonizedAreaSqM: 1160,
      status: "VERIFIED",
      confidence: {
        iouScore: 91.5,
        hausdorffScore: 90.0,
        nlpScore: 92.4,
        overallScore: 91.3
      },
      ownerName: "Mahalaxmi Logistics & Godown Hub",
      bhashini: {
        rawRegionalText: "महालक्ष्मी लॉजिस्टिक्स एवं गोदाम हब, प्रोपराइटर- अमित अग्रवाल, खाता 115, खेसरा 406",
        translatedEnglishText: "Mahalaxmi Logistics & Godown Hub, Prop. Amit Agarwal, Khata 115, Khasra 406",
        khataNumber: "115",
        khasraNumber: "406",
        ownerNameEn: "Amit Agarwal (Mahalaxmi Logistics)",
        coOwners: ["Sanjay Agarwal"],
        matchConfidence: 98.2,
        aadhaarLinked: true
      },
      tax: {
        registeredFloorCount: 1,
        detectedFloorCount: 2,
        registeredPropertyType: "Commercial",
        detectedPropertyType: "Commercial",
        declaredAnnualTax: 28000,
        assessedFairTax: 44000,
        taxGapAmount: 72500,
        taxStatus: "UNDER_ASSESSED"
      },
      utility: {
        utilityType: "Optical Fiber Backbone",
        depthMeters: 1.6,
        isColliding: false,
        description: "Backbone route clear of loading bays.",
        riskLevel: "NONE"
      },
      legacyPolygon: [
        { x: 52, y: 64 },
        { x: 86, y: 64 },
        { x: 86, y: 92 },
        { x: 52, y: 92 }
      ],
      dronePolygon: [
        { x: 52, y: 64 },
        { x: 86, y: 64 },
        { x: 86, y: 92 },
        { x: 52, y: 92 }
      ],
      harmonizedPolygon: [
        { x: 52, y: 64 },
        { x: 86, y: 64 },
        { x: 86, y: 92 },
        { x: 52, y: 92 }
      ],
      gpsCoordinates: {
        centroid: { lat: 23.3428, lng: 85.3110 },
        vertices: [
          { lat: 23.3432, lng: 85.3100 },
          { lat: 23.3432, lng: 85.3120 },
          { lat: 23.3424, lng: 85.3120 },
          { lat: 23.3424, lng: 85.3100 }
        ]
      },
      postgisAuditHash: "0x67fa9180c2198be1288aa09b82141ca88710fa93",
      lastUpdated: "2026-08-28 10:18:42 IST"
    }
  ],
  conflicts: [
    {
      id: "CONF-001",
      plotId: "PLOT-412-B",
      plotNumber: "412/B",
      title: "Boundary Overlap & Road Setback Encroachment",
      type: "ROAD_ENCROACHMENT",
      severity: "CRITICAL",
      confidenceScore: 68.2,
      description: "Drone SAM-Geo building footprint extends 2.5 meters beyond registered Khasra boundary onto East Main Road setback and overlaps 28.4 sq.m with neighbor Plot 412/A.",
      affectedParties: ["Mr. Rajesh Verma (Plot 412/B)", "Mrs. Sunita Sharma (Plot 412/A)", "Ranchi Municipal Corporation (NHAI/PWD)"],
      recommendedAction: "Execute PostGIS ST_Snap with 0.05m tolerance; auto-generate demarcation order and rollback encroached road footprint.",
      autoHealAvailable: true,
      status: "PENDING",
      timestamp: "2026-08-28 10:18:42 IST"
    },
    {
      id: "CONF-002",
      plotId: "PLOT-412-B",
      plotNumber: "412/B",
      title: "Municipal Tax Evasion & Undeclared Commercial Floors",
      type: "TAX_UNDER_ASSESSMENT",
      severity: "HIGH",
      confidenceScore: 68.2,
      description: "Property registered in 2012 tax register as 1-story residential house (₹2,000/yr). Drone DSM height model confirms 3-story active commercial establishment (actual dues: ₹52,400/yr).",
      affectedParties: ["RMC Revenue Assessment Wing", "Mr. Rajesh Verma"],
      recommendedAction: "Auto-issue revised tax demand notice with retroactive 3-year assessment (₹3.5 Lakhs back-tax + penalty).",
      autoHealAvailable: true,
      status: "PENDING",
      timestamp: "2026-08-28 10:18:42 IST"
    },
    {
      id: "CONF-003",
      plotId: "PLOT-412-B",
      plotNumber: "412/B",
      title: "Critical Underground Utility Pipeline Hazard",
      type: "UTILITY_COLLISION",
      severity: "CRITICAL",
      confidenceScore: 68.2,
      description: "Subsurface GIS overlay reveals Mr. Verma's eastern commercial pillar foundation is placed directly over the 600mm municipal trunk water supply pipeline.",
      affectedParties: ["RMC Water & Sewerage Board", "Disaster Management Cell"],
      recommendedAction: "Flag in Dig-Once safety framework; enforce foundation setback relocation before issuing harmonized title.",
      autoHealAvailable: false,
      status: "PENDING",
      timestamp: "2026-08-28 10:18:42 IST"
    },
    {
      id: "CONF-004",
      plotId: "PLOT-402",
      plotNumber: "402",
      title: "Cadastral Edge Sliver Gap (0.05m)",
      type: "SLIVER_GAP",
      severity: "LOW",
      confidenceScore: 88.6,
      description: "Minor 0.05m topological sliver between historical paper sheet scan and 10cm drone ORI.",
      affectedParties: ["Dr. Arvind Prasad"],
      recommendedAction: "Auto-snap boundary vertices using PostGIS ST_SnapToGrid.",
      autoHealAvailable: true,
      status: "PENDING",
      timestamp: "2026-08-28 10:18:42 IST"
    }
  ]
};
