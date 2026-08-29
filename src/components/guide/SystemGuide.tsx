import React, { useState } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  ArrowRight, 
  Layers, 
  Cpu, 
  UploadCloud, 
  Compass, 
  Scan, 
  GitMerge, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Languages, 
  Coins, 
  Map as MapIcon, 
  FileCheck2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ExternalLink,
  Info
} from 'lucide-react';


interface GuideSection {
  id: string;
  stepNumber: number;
  titleEn: string;
  titleHi: string;
  category: string;
  icon: any;
  whatIsIt: string;
  whyNeeded: string;
  inputs: string[];
  insideProcess: string[];
  output: string;
  govBenefit: string;
  exampleScenario?: string;
}

export const SystemGuide: React.FC = () => {
  const [activeStepId, setActiveStepId] = useState<string>('sec-01');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'sec-01': true,
    'sec-02': true,
    'sec-03': true,
    'sec-04': true,
    'sec-05': true,
    'sec-06': true,
    'sec-07': true,
    'sec-08': true,
    'sec-09': true,
    'sec-10': true,
    'sec-11': true,
    'sec-12': true
  });

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const workflowSteps = [
    { id: 'sec-01', shortTitle: '1. Ingestion', code: 'DATA INGESTION' },
    { id: 'sec-02', shortTitle: '2. Normalization', code: 'COORD NORMALIZATION' },
    { id: 'sec-03', shortTitle: '3. Georeferencing', code: 'GEOREFERENCING' },
    { id: 'sec-04', shortTitle: '4. Feature Extraction', code: 'GEOAI EXTRACTION' },
    { id: 'sec-05', shortTitle: '5. Harmonization', code: 'SPATIAL CONFLATION' },
    { id: 'sec-06', shortTitle: '6. Topology', code: 'TOPOLOGY VALIDATION' },
    { id: 'sec-07', shortTitle: '7. Conflicts', code: 'CONFLICT DETECTION' },
    { id: 'sec-08', shortTitle: '8. Confidence', code: 'CONFIDENCE SCORING' },
    { id: 'sec-09', shortTitle: '9. RoR Matching', code: 'BHASHINI NLP' },
    { id: 'sec-10', shortTitle: '10. Tax Audit', code: 'TAX INTELLIGENCE' },
    { id: 'sec-11', shortTitle: '11. Real Map', code: 'REAL EARTH GIS' },
    { id: 'sec-12', shortTitle: '12. Certificate', code: 'ULPIN CERTIFICATE' }

  ];

  const guideSections: GuideSection[] = [
    {
      id: 'sec-01',
      stepNumber: 1,
      titleEn: 'Multi-Source Data Ingestion',
      titleHi: 'डेटा इनजेशन (Data Ingestion)',
      category: 'Data Input & Standardizing',
      icon: UploadCloud,
      whatIsIt: 'Alag-alag government departments ke physical aur digital land data ko platform ke andar ek standardized pipeline mein laane ka pehla step hai.',
      whyNeeded: 'Land records, high-resolution drone photos, tax records aur underground utility maps alag-alag formats (PDF, GeoTIFF, SHP, CSV, DXF) mein bikhre hote hain. Agar inko pehle normalize na kiya jaye toh aapas mein compare karna impossible ho jaata hai.',
      inputs: [
        'Drone Orthomosaic (GeoTIFF, 10cm Ground Resolution)',
        '1978 Scanned Paper Cadastral Maps (PDF / Raster SHP)',
        'Record of Rights / RoR Register (Hindi/Marathi/Regional CSV)',
        'Underground Utility Layers (Water mains, power cables CAD/DXF)',
        'Municipal Property Tax Ledgers (Declared floor & property type CSV)'
      ],
      insideProcess: [
        'Files ko read karke metadata, schema aur projection header detect karta hai.',
        'Raster layers (GeoTIFF) aur Vector layers (SHP/GeoJSON) ko validate karke memory mein load karta hai.',
        'Missing columns ya corrupted records ko quarantine karke execution-ready format prepare karta hai.'
      ],
      output: 'Ek unified, clean aur indexed Multi-Departmental Data Stack jo agle steps ke liye ready hota hai.',
      govBenefit: 'Surveyors aur revenue officers ko 5 alag departments ke chakkar nahi kaatne padte; sara data ek hi screen par available ho jaata hai.'
    },
    {
      id: 'sec-02',
      stepNumber: 2,
      titleEn: 'Coordinate Normalization (PyProj)',
      titleHi: 'कोऑर्डिनेट नॉर्मलाइज़ेशन (Coordinate Normalization)',
      category: 'Geodetic CRS Alignment',
      icon: Compass,
      whatIsIt: 'Alag-alag projection systems aur local chain survey datums ko ek common standard geographic coordinate system (WGS-84 / EPSG:4326) mein convert karne ka process.',
      whyNeeded: 'Agar coordinate systems alag honge toh 1978 ka paper map aur 2026 ka drone map ek doosre ke upar perfectly overlap nahi karenge, chahe boundary sahi bhi ho.',
      inputs: [
        'Legacy Local Chain Coordinates (Old Survey of India datum)',
        'Drone UTM Grid (EPSG:32645 / UTM Zone 45N)',
        'Municipal Local Cadastral Grid'
      ],
      insideProcess: [
        'PyProj library use karke 7-parameter Helmert transformation aur ellipsoid projection matrix calculate ki jaati hai.',
        'Har coordinate vertex ko mathematically reproject karke standard WGS-84 (EPSG:4326) latitude-longitude grid par lock kiya jaata hai.'
      ],
      output: '100% spatially aligned coordinate grid jismein har layer ka datum aur scale 1:1 match karta hai.',
      govBenefit: 'Geographic coordinate mismatch ki wajah se aane wale false errors khatam ho jaate hain aur state-level ya national-level interoperability milti hai.'
    },
    {
      id: 'sec-03',
      stepNumber: 3,
      titleEn: 'Georeferencing & Rubbersheeting (SIFT / ORB)',
      titleHi: 'जियो-रेफरेंसिंग (Georeferencing & Rubbersheeting)',
      category: 'Computer Vision Alignment',
      icon: Scan,
      whatIsIt: '50 saal purane distorted paper cadastral map ko real-world ground features ke saath align aur warp karne ka process.',
      whyNeeded: 'Purane paper maps waqt ke saath shrink ya stretch ho jaate hain. System known Ground Control Points (GCPs) aur road junctions ki madad se map ki stretching ko mathematically theek karta hai.',
      inputs: [
        'Scanned Paper Cadastral Map Raster',
        '2026 Drone Orthomosaic Baseline',
        'CORS GNSS Network Reference Points'
      ],
      insideProcess: [
        'OpenCV SIFT aur ORB algorithms use karke dono maps ke beech 1,200+ homologous keypoints detect kiye jaate hain.',
        'Thin Plate Spline (TPS) transformation se paper map ke non-linear stretches aur local distortions ko warp/rubbersheet kiya jaata hai.'
      ],
      output: 'Geographically accurately warped cadastral layer jo real-world drone imagery par 0.05m tolerance ke saath baithti hai.',
      govBenefit: 'Manual GIS tracing aur mahino ka rubbersheeting kaam sirf 280 milliseconds mein autonomously complete ho jaata hai.'
    },
    {
      id: 'sec-04',
      stepNumber: 4,
      titleEn: 'GeoAI & Automated Feature Extraction',
      titleHi: 'जियो-एआई फीचर एक्सट्रैक्शन (GeoAI Feature Extraction)',
      category: 'Deep Learning & Computer Vision',
      icon: Cpu,
      whatIsIt: 'High-resolution drone imagery se computer vision ke zariye buildings, rooftops, roads aur boundaries ko automatically extract karne ka step.',
      whyNeeded: 'Manually har building ka polygon draw karna bohot slow aur error-prone hota hai. GeoAI model seconds mein pure ward ki built-up footprints aur 3D floor heights detect kar leta hai.',
      inputs: [
        '10cm Ground Sampling Distance (GSD) Drone Orthomosaic',
        'Drone Digital Surface Model (DSM) & DTM Height Matrix'
      ],
      insideProcess: [
        'Meta SAM-Geo (Segment Anything Model for Geospatial) rooftop boundaries ke exact sub-pixel polygon coordinates extract karta hai.',
        'DSM height model se ground elevation minus karke har building ki exact 3D height aur number of floors compute kiye jaate hain.'
      ],
      output: 'Clean Vector GeoJSON Polygons with exact building dimensions and detected vertical floor heights.',
      govBenefit: 'Ground surveyor ko manually field par jaakar feeta (tape) lagane ki zaroorat nahi padti; direct high-precision digital footprints mil jaate hain.'
    },
    {
      id: 'sec-05',
      stepNumber: 5,
      titleEn: 'Spatial Harmonization (Conflation)',
      titleHi: 'स्पेशियल हार्मोनाइज़ेशन (Spatial Harmonization / Conflation)',
      category: 'Core Spatial Synthesis',
      icon: GitMerge,
      whatIsIt: 'Ye poore platform ka core engine hai. Iska kaam alag-alag sources (1978 paper map + 2026 drone survey + RoR text) ko ek common spatial reference mein laakar compare karna hai.',
      whyNeeded: 'Ek hi plot ki information alag sources mein slightly different ho sakti hai. Harmonization dono data sources ko seamlessly fuse karke ground reality aur legal record ke beech ka exact relation nikaalta hai.',
      inputs: [
        'Aligned 1978 Legal Cadastral Boundaries',
        '2026 Drone Extracted Building Footprints',
        'Ground Survey Reference Matrix'
      ],
      insideProcess: [
        'Dono polygons ka spatial overlap, geometric centroid shift aur boundary intersection compute kiya jaata hai.',
        'Sub-pixel edge alignment se shared parcel boundary edges ko standardize kiya jaata hai.'
      ],
      output: 'Unified Harmonized Digital Land Cadastre jismein har plot ka historical baseline aur current reality simultaneously mapped hoti hai.',
      govBenefit: 'Government ko ek single authoritative digital map milta hai jismein purane revenue records aur modern drone data ka complete correlation hota hai.'
    },
    {
      id: 'sec-06',
      stepNumber: 6,
      titleEn: 'Topology Validation (PostGIS ST_Snap)',
      titleHi: 'टोपोलॉजी वैलिडेशन (Topology Validation & Snapping)',
      category: 'Geometrical Quality Assurance',
      icon: ShieldCheck,
      whatIsIt: 'Map geometries ko check karke aapas mein hone wale gaps, overlaps, slivers aur invalid spatial relationships ko mathematically detect aur correct karna.',
      whyNeeded: 'Agar do plots ke beech 0.05m ka unnecessary gap (sliver) ya slight overlap ho, toh future mein property boundary disputes create ho sakte hain.',
      inputs: [
        'Harmonized Cadastral Polygons',
        'Spatial Adjacency Matrix & Road Setback Buffers'
      ],
      insideProcess: [
        'PostGIS spatial queries run hoti hain: `ST_Overlaps`, `ST_Touches`, `ST_Intersects`.',
        'Agar gap 0.05m se kam hai, toh PostGIS `ST_Snap` aur `ST_SnapToGrid` vertices ko automatically theek kar deta hai.',
        'Har correction ka immutable SHA-256 cryptographic audit hash generate hota hai.'
      ],
      output: 'Topologically clean, watertight parcel network jismein zero gap aur zero invalid overlap hota hai.',
      govBenefit: 'Land registry mein technical boundary errors khatam ho jaate hain aur future litigation ka risk drastically kam ho jaata hai.'
    },
    {
      id: 'sec-07',
      stepNumber: 7,
      titleEn: 'Discrepancy & Conflict Detection',
      titleHi: 'डिसक्रेपेंसी और कनफ्लिक्ट डिटेक्शन (Conflict Detection)',
      category: 'Rule-Based Anomaly Flagging',
      icon: AlertTriangle,
      whatIsIt: 'System different datasets ko cross-check karke 4 major types ke mismatches aur violations ko automatically flag karta hai.',
      whyNeeded: 'Manual inspection mein illegal road encroachments, tax evasion aur underground pipeline ke upar bani buildings identify karna bohot mushkil hota hai.',
      inputs: [
        'Extracted Drone Footprints',
        'Legal 1978 Boundary Polygons',
        'PWD/NHAI Road Setback Reservation Line',
        'Municipal Tax Ledgers & Subsurface Utility GIS Layers'
      ],
      insideProcess: [
        '1. Boundary Mismatch: Drone area aur registered RoR area mein tolerance se zyada delta check karta hai.',
        '2. Road Setback Encroachment: Check karta hai ki kya structure statutory road line ke andar extend kar rahi hai (e.g. Plot 412/B 2.5m shift).',
        '3. Municipal Tax Gap: Registered 1-floor vs detected 3-floor building mismatch identify karta hai.',
        '4. Utility Hazard: Check karta hai ki kya building foundation underground 600mm water main ya 33kV cable ke safety buffer mein overlap kar rahi hai.'
      ],
      output: 'Categorized Discrepancy Register with severity levels (Critical / High / Moderate) and recommended administrative actions.',
      govBenefit: 'Encroachment aur unauthorized construction hone par turant notice issue kiya ja sakta hai bina saalo tak dispute court mein pending rahe.'
    },
    {
      id: 'sec-08',
      stepNumber: 8,
      titleEn: 'Multi-Criteria Confidence Scoring',
      titleHi: 'कॉन्फिडेंस स्कोर फॉर्मूलेशन (Confidence Score Calculation)',
      category: 'Decision-Support Formulation',
      icon: CheckCircle2,
      whatIsIt: 'Har plot ko 0 se 100% ke scale par ek deterministic mathematical confidence score assign kiya jaata hai jo data agreement level reflect karta hai.',
      whyNeeded: 'Har plot ko manually inspect karne ki zaroorat nahi honi chahiye. High-confidence plots ko direct auto-approve kiya ja sakta hai aur low-confidence plots ko review ke liye mark kiya ja sakta hai.',
      inputs: [
        'Intersection over Union (IoU) between Legacy & Drone Polygons (Weight = 40%)',
        'Hausdorff Boundary Edge Fit Distance (Weight = 30%)',
        'Bhashini NLP RoR vs Municipal Text Similarity (Weight = 30%)'
      ],
      insideProcess: [
        'Formula: CS = 0.40 * IoU + 0.30 * (1 - Dist_Hausdorff / 5.0m) * 100 + 0.30 * NLP_Similarity',
        'Traffic-Light Classification:',
        '🟢 Green (>=90%): High Confidence Verified (Auto-approvable)',
        '🟡 Amber (70% - 89%): Review Required (Minor sliver or name spelling variation)',
        '🔴 Red (<70%): Critical Discrepancy / Conflict Flagged (Requires Tehsildar inspection)'
      ],
      output: 'Objective Confidence Metric with complete sub-score breakdown for every single parcel.',
      govBenefit: '85% plots ko direct auto-verify karke clearance mil jaati hai; revenue officers ka 90% time sirf problematic red/amber cases par focus hota hai.'
    },
    {
      id: 'sec-09',
      stepNumber: 9,
      titleEn: 'Owner & Record of Rights (RoR) Matching (Bhashini)',
      titleHi: 'ओनर और खसरा मैचिंग (Bhashini Indic NLP Matching)',
      category: 'Vernacular Indic NLP & Title Linking',
      icon: Languages,
      whatIsIt: 'Spatial geographic plot ko regional language (Hindi, Marathi, etc.) ke textual land records aur owner particulars ke saath accurately connect karna.',
      whyNeeded: 'Purane land records Hindi/Marathi mein hote hain aur municipal tax records English mein. Spelling variations (e.g. "राजेश वर्मा" vs "Rajesh Verma") ki wajah se matching fail na ho.',
      inputs: [
        'Regional Language RoR Text (Khasra, Khata, Father Name, Co-owners)',
        'Municipal Tax Identification Data',
        'Aadhaar / e-Pramaan Seed Status'
      ],
      insideProcess: [
        'Bhashini Indic NLP transliteration model Hindi text ko phonetically standard English format mein convert karta hai.',
        'Levenshtein & Semantic similarity algorithm se name, khata number aur co-owners ko cross-verify karke match percentage compute kiya jaata hai.'
      ],
      output: 'Verified Landholder Identity with Aadhaar link status and Bhashini validation badge.',
      govBenefit: 'Benami transactions aur farzi land registry ka fraud band hota hai; genuine land owners ko instant digital title clarity milti hai.'
    },
    {
      id: 'sec-10',
      stepNumber: 10,
      titleEn: 'Tax Intelligence & 3D Floor Audit',
      titleHi: 'प्रॉपर्टी टैक्स इंटेलिजेंस (Tax Intelligence & Floor Audit)',
      category: 'Municipal Revenue Audit',
      icon: Coins,
      whatIsIt: 'Drone ke 3D height data (DSM) ko municipal property tax register ke saath compare karke undeclared commercial floors aur tax leakage identify karna.',
      whyNeeded: 'Log aksar 1-manzil residential house register karwate hain lekin ground par 3-4 manzil commercial complex bana kar tax chori karte hain.',
      inputs: [
        'Drone 3D Digital Surface Model (DSM) Floor Heights',
        'Municipal Declared Property Category & Annual Tax Ledger'
      ],
      insideProcess: [
        'Drone DSM se building height measure ki jaati hai (e.g. 10.5m = 3 active commercial floors).',
        'Tax formula run hota hai: Fair Tax = BuiltUp Area * Unit Rate * Floor Count.',
        'Declared tax (₹2,000) vs Assessed fair tax (₹52,400) ka gap calculate hota hai (₹3,50,000 retroactive 3-year back-tax).'
      ],
      output: 'Detailed Tax Discrepancy Ledger with auto-drafted Municipal Demand Notice.',
      govBenefit: 'Urban Local Bodies (ULBs) aur Municipal Corporations ka property tax revenue 300% to 400% tak multiply ho sakta hai.'
    },
    {
      id: 'sec-11',
      stepNumber: 11,
      titleEn: 'Interactive Real-World GIS Map Workspace',
      titleHi: 'रियल-वर्ल्ड जीआईएस मैप (Interactive Real Earth GIS Map)',
      category: 'Real Earth Satellite & Geospatial Inspection',
      icon: MapIcon,
      whatIsIt: 'Ye main GIS spatial workspace hai jo Google Maps aur Leaflet jaise real Earth satellite imagery aur OpenStreetMap tiles par live cadastral boundaries ko render karta hai.',
      whyNeeded: 'Tabular data se ground reality samajhna mushkil hota hai. Real satellite photos, actual roads aur high-precision GPS coordinates par live boundaries dekh kar koi bhi revenue officer ya citizen instant visual verification kar sakta hai.',
      inputs: [
        'Real-World Satellite Imagery (High-Res Esri World Imagery / Google style)',
        'Standard Street Basemaps (OpenStreetMap / CartoDB Voyager)',
        'Real-world GPS Coordinates (WGS-84 / EPSG:4326 Lat-Lng)',
        '1978 Historical Cadastral Boundaries & 2026 Drone Vectors',
        'Underground 600mm Water Main & 33kV Power Cable Layers'
      ],
      insideProcess: [
        'Leaflet GIS engine high-speed satellite aur street tiles load karta hai.',
        'Real GPS coordinates par color-coded polygons (Green Verified, Amber Review, Red Conflict) render hote hain.',
        'Live cursor tracking se real latitude, longitude, zoom level aur elevation monitor hota hai.',
        'Real-map split swipe comparator se 1978 paper map aur 2026 satellite survey ka 1:1 visual comparison hota hai.'
      ],
      output: 'Full-featured Real Earth WebGIS Workspace with Pan, Zoom, Layer Toggles, and Search to Jump to any plot.',
      govBenefit: 'Officers ko real geographic context milta hai jisse unauthorized encroachments aur boundary disputes bina field dispute ke clear ho jaate hain.'
    },

    {
      id: 'sec-12',
      stepNumber: 12,
      titleEn: 'Cadastral Verification Certificate & ULPIN Generation',
      titleHi: 'कैडस्ट्रल सर्टिफिकेट और ULPIN (Cadastral Certificate & ULPIN)',
      category: 'Official Output & Legal Verification',
      icon: FileCheck2,
      whatIsIt: 'Harmonization complete hone ke baad selected plot ka official, digitally signed aur QR-verifiable Cadastral Certificate generate karna.',
      whyNeeded: 'Land owners ko bank loan, property sale ya building permit ke liye ek tamper-proof, court-admissible digital certificate chahiye hota hai.',
      inputs: [
        '14-digit Unique Land Parcel Identification Number (ULPIN: `26-JH-RAN-0042-2026`)',
        'Spatial Area Reconciliation Matrix (1978 RoR vs Drone vs Harmonized Legal Area)',
        'Deterministic Confidence Score Breakdown',
        'PostGIS Transaction SHA-256 Hash & e-Pramaan Digital Signature'
      ],
      insideProcess: [
        'Client-side `jspdf` engine Government of India (MoRD / DoLR) official layout mein certificate render karta hai.',
        'Tamper-proof QR code embed hota hai jise scan karke national land portal par PostGIS audit trail verify ki ja sakti hai.'
      ],
      output: 'Downloadable & Printable Official Cadastral Verification Certificate (PDF).',
      govBenefit: 'Property transfer time 6 mahine se kam hokar instant ho jaata hai aur fake paper document registry ka fraud hamesha ke liye band hota hai.'
    }
  ];

  const handleStepClick = (stepId: string) => {
    setActiveStepId(stepId);
    const el = document.getElementById(stepId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto select-none">
      {/* Header Banner */}
      <div className="p-6 rounded-lg bg-white border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
            सिस्टम गाइड · SYSTEM ARCHITECTURE GUIDE
          </span>
          <span className="text-xs text-slate-500 font-medium">Simple Hinglish Explanation</span>
        </div>
        <h1 className="text-2xl font-bold text-[#0F2942]">
          GeoSync NAKSHA: How It Works & Architecture Guide
        </h1>
        <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">
          Agar aapse koi pooche ki <strong className="text-slate-900">"Ye module kya karta hai?"</strong> ya <strong className="text-slate-900">"Ye technology yahan kyun use ho rahi hai?"</strong>, 
          toh ye guide platform ke har single step ko aasan Hinglish mein explain karti hai — from Raw Data Ingestion to Official ULPIN Cadastral Certificate.
        </p>
      </div>

      {/* Interactive Visual Workflow Pipeline (Clickable Graph) */}
      <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#0F2942] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-700" />
            End-to-End Autonomous Workflow (Click any stage to view explanation)
          </span>
          <span className="text-[11px] text-slate-500 font-mono">12 Connected Processing Nodes</span>
        </div>

        {/* Workflow Node Chain */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 pt-1">
          {workflowSteps.map((s, idx) => {
            const isSelected = activeStepId === s.id;
            return (
              <button
                key={s.id}
                onClick={() => handleStepClick(s.id)}
                className={`p-2.5 rounded text-left transition border cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#0F2942] text-white border-[#0F2942] shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <div className="text-[10px] font-mono opacity-80">{s.code}</div>
                <div className="text-xs font-bold mt-1 truncate">{s.shortTitle}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 12 Detailed Hinglish Module Cards */}
      <div className="space-y-4">
        {guideSections.map((sec) => {
          const Icon = sec.icon;
          const isExpanded = expandedSections[sec.id] !== false;
          const isActive = activeStepId === sec.id;

          return (
            <div
              key={sec.id}
              id={sec.id}
              className={`rounded-lg bg-white border transition shadow-xs overflow-hidden ${
                isActive ? 'border-blue-600 ring-1 ring-blue-600/30' : 'border-slate-200'
              }`}
            >
              {/* Card Header Accordion Toggle */}
              <div
                onClick={() => toggleSection(sec.id)}
                className="p-4 bg-slate-50/80 hover:bg-slate-100/80 border-b border-slate-200 flex items-center justify-between cursor-pointer transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-[#0F2942] text-white flex items-center justify-center font-bold text-xs">
                    {sec.stepNumber}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold text-[#0F2942]">
                        {sec.titleHi}
                      </h2>
                      <span className="text-xs text-slate-500 font-mono">({sec.titleEn})</span>
                    </div>
                    <span className="text-[11px] text-blue-800 font-semibold">{sec.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200 hidden sm:inline-block">
                    Stage 0{sec.stepNumber}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  )}
                </div>
              </div>

              {/* Card Body with 6 Mandatory Hinglish Questions */}
              {isExpanded && (
                <div className="p-5 space-y-4 text-xs text-slate-700 bg-white">
                  {/* Grid: 1. Ye kya hai? & 2. Ye kyun chahiye? */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Q1 */}
                    <div className="p-3.5 rounded bg-slate-50 border border-slate-200 space-y-1">
                      <div className="font-bold text-[#0F2942] text-xs flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-700" />
                        1. Ye kya hai? (What is it?)
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {sec.whatIsIt}
                      </p>
                    </div>

                    {/* Q2 */}
                    <div className="p-3.5 rounded bg-slate-50 border border-slate-200 space-y-1">
                      <div className="font-bold text-[#0F2942] text-xs flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-700" />
                        2. Ye kyun chahiye? (Why is it needed?)
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {sec.whyNeeded}
                      </p>
                    </div>
                  </div>

                  {/* Q3: Input Data */}
                  <div className="p-3.5 rounded bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="font-bold text-[#0F2942] text-xs flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                      3. Ye input kya leta hai? (Input Data Sources)
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                      {sec.inputs.map((inp, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-slate-700 text-[11px]">
                          <span className="text-blue-800 font-bold shrink-0">•</span>
                          <span>{inp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Q4: Andar kya hota hai? */}
                  <div className="p-3.5 rounded bg-blue-50/40 border border-blue-100 space-y-1.5">
                    <div className="font-bold text-blue-900 text-xs flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-700" />
                      4. Andar kya hota hai? (Internal Processing Pipeline)
                    </div>
                    <div className="space-y-1 text-slate-700 text-xs leading-relaxed">
                      {sec.insideProcess.map((proc, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="font-mono font-bold text-blue-900 text-[11px] shrink-0">
                            [{idx + 1}]
                          </span>
                          <span>{proc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Grid: 5. Output kya milta hai? & 6. Government ko benefit */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Q5 */}
                    <div className="p-3.5 rounded bg-emerald-50/50 border border-emerald-200 space-y-1">
                      <div className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        5. Output kya milta hai? (Deliverable)
                      </div>
                      <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                        {sec.output}
                      </p>
                    </div>

                    {/* Q6 */}
                    <div className="p-3.5 rounded bg-slate-50 border border-slate-200 space-y-1">
                      <div className="font-bold text-[#0F2942] text-xs flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                        6. Government ko iska kya benefit hai? (Real-World Impact)
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {sec.govBenefit}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Decision Support Disclaimer Note */}
      <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
        <div className="font-bold flex items-center gap-1.5 text-amber-950">
          <Info className="w-4 h-4 text-amber-700" />
          <span>Important Administrative Note: Decision-Support Tool</span>
        </div>
        <p className="text-[11px] leading-relaxed text-amber-900">
          GeoSync NAKSHA revenue officers aur municipal surveyors ke liye ek <strong>Decision-Support System</strong> hai. 
          Ye system potential spatial conflicts, 3D vertical tax mismatches aur boundary shifts identify karta hai, jisse field verification fast ho sake. 
          Final legal demarcations authorized Revenue Officers / Tehsildars dwara e-Pramaan verification ke baad hi complete hoti hain.
        </p>
      </div>
    </div>
  );
};
