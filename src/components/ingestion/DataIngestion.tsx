import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Layers, 
  Database, 
  MapPin, 
  CheckCircle2, 
  Trash2, 
  Play, 
  FileCode, 
  AlertCircle
} from 'lucide-react';
import { IngestionDataset, WardDataset } from '../../types';

interface DataIngestionProps {
  ward: WardDataset;
  onStartPipeline: () => void;
  onLoadRanchiPreset: () => void;
  onLoadPunePreset: () => void;
}

export const DataIngestion: React.FC<DataIngestionProps> = ({
  ward,
  onStartPipeline,
  onLoadRanchiPreset,
  onLoadPunePreset
}) => {
  const [datasets, setDatasets] = useState<IngestionDataset[]>(ward.datasets);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newDataset: IngestionDataset = {
        id: `custom-${Date.now()}`,
        name: file.name,
        type: file.name.endsWith('.tif') ? 'DRONE_GEOTIFF' : file.name.endsWith('.csv') ? 'ROR_CSV' : 'CADASTRAL_MAP',
        format: file.type || 'Custom Ingested Layer',
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        sourceDepartment: 'District Land Revenue Office / User Upload',
        coordinateRefSystem: 'Auto-detecting EPSG:4326',
        status: 'LOADED',
        uploadDate: new Date().toLocaleTimeString('en-IN') + ' IST'
      };
      setDatasets([newDataset, ...datasets]);
      setUploadSuccess(`Successfully uploaded ${file.name}`);
      setTimeout(() => setUploadSuccess(null), 4000);
    }
  };

  const removeDataset = (id: string) => {
    setDatasets(datasets.filter(d => d.id !== id));
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-lg bg-white border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-900 border border-blue-200">
              Departmental Data Ingestion
            </span>
            <span className="text-xs text-slate-500 font-medium">Jurisdiction: {ward.wardName}</span>
          </div>
          <h1 className="text-xl font-bold text-[#0F2942] mt-1">
            Upload Land Record Datasets
          </h1>
          <p className="text-xs text-slate-600">
            Upload spatial map files and attribute registers for automated conflation and boundary validation.
          </p>
        </div>

        {/* Demo Preset Selectors */}
        <div className="flex items-center gap-2">
          <button
            onClick={onLoadRanchiPreset}
            className="px-3 py-1.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-semibold transition cursor-pointer"
          >
            Load Ranchi Ward 14
          </button>

          <button
            onClick={onLoadPunePreset}
            className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-medium transition cursor-pointer"
          >
            Load Pune Ward 08
          </button>
        </div>
      </div>

      {uploadSuccess && (
        <div className="p-3 rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{uploadSuccess}</span>
        </div>
      )}

      {/* Two Column Ingestion Layout: Spatial on Left, Attribute on Right */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Section 1: Upload Spatial Data */}
        <div className="p-5 rounded-lg bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Layers className="w-4 h-4 text-blue-700" />
            <h2 className="text-sm font-bold text-[#0F2942]">1. Upload Spatial Data</h2>
          </div>
          <p className="text-xs text-slate-600">
            High-resolution drone orthomosaics, scanned legacy paper maps, and municipal subsurface GIS vectors.
          </p>

          <div 
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                const file = e.dataTransfer.files[0];
                const newDataset: IngestionDataset = {
                  id: `custom-${Date.now()}`,
                  name: file.name,
                  type: 'DRONE_GEOTIFF',
                  format: 'GeoTIFF / Raster',
                  fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                  sourceDepartment: 'District Collectorate',
                  coordinateRefSystem: 'WGS-84 / EPSG:4326',
                  status: 'LOADED',
                  uploadDate: new Date().toLocaleTimeString('en-IN') + ' IST'
                };
                setDatasets([newDataset, ...datasets]);
                setUploadSuccess(`Uploaded spatial layer ${file.name}`);
                setTimeout(() => setUploadSuccess(null), 4000);
              }
            }}
            className="border-2 border-dashed border-slate-300 hover:border-blue-600 rounded p-6 text-center bg-slate-50 transition cursor-pointer"
          >
            <input 
              type="file" 
              id="spatial-upload" 
              onChange={handleCustomUpload} 
              className="hidden" 
              accept=".tif,.tiff,.shp,.geojson,.dxf,.pdf"
            />
            <label htmlFor="spatial-upload" className="cursor-pointer flex flex-col items-center">
              <UploadCloud className="w-8 h-8 text-blue-700 mb-2" />
              <span className="text-xs font-bold text-slate-800">
                Choose Drone GeoTIFF (.tif) or Scanned Map (.pdf)
              </span>
              <span className="text-[11px] text-slate-500 mt-1">
                Drag and drop files here or browse files
              </span>
            </label>
          </div>
        </div>

        {/* Section 2: Upload Attribute Data */}
        <div className="p-5 rounded-lg bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <FileText className="w-4 h-4 text-emerald-700" />
            <h2 className="text-sm font-bold text-[#0F2942]">2. Upload Attribute Data</h2>
          </div>
          <p className="text-xs text-slate-600">
            Record of Rights (RoR) ledger tables, landholder registries, and municipal property tax registers.
          </p>

          <div 
            className="border-2 border-dashed border-slate-300 hover:border-emerald-600 rounded p-6 text-center bg-slate-50 transition cursor-pointer"
          >
            <input 
              type="file" 
              id="attribute-upload" 
              onChange={handleCustomUpload} 
              className="hidden" 
              accept=".csv,.xlsx,.json"
            />
            <label htmlFor="attribute-upload" className="cursor-pointer flex flex-col items-center">
              <Database className="w-8 h-8 text-emerald-700 mb-2" />
              <span className="text-xs font-bold text-slate-800">
                Choose Record of Rights (.csv) or Tax Register (.csv)
              </span>
              <span className="text-[11px] text-slate-500 mt-1">
                Drag and drop files here or browse files
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Active Datasets Stack Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-xs font-bold text-[#0F2942] uppercase tracking-wide">
            Active Datasets Stack ({datasets.length} Layers Loaded)
          </h2>
          <span className="text-[11px] font-mono text-slate-500">Ready for Harmonization</span>
        </div>

        <div className="divide-y divide-slate-100">
          {datasets.map((item) => (
            <div 
              key={item.id}
              className="p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50 transition"
            >
              <div className="flex items-start sm:items-center gap-3">
                <div className="p-2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {item.type === 'DRONE_GEOTIFF' ? <Layers className="w-4 h-4 text-blue-700" /> :
                   item.type === 'CADASTRAL_MAP' ? <MapPin className="w-4 h-4 text-amber-700" /> :
                   item.type === 'ROR_CSV' ? <FileText className="w-4 h-4 text-emerald-700" /> :
                   <Database className="w-4 h-4 text-purple-700" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono text-slate-900">{item.name}</span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      {item.format}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-[11px] text-slate-500">
                    <span>Department: <strong className="text-slate-700">{item.sourceDepartment}</strong></span>
                    <span>CRS: <strong className="text-slate-700 font-mono">{item.coordinateRefSystem}</strong></span>
                    <span>Size: <strong className="text-slate-700">{item.fileSize}</strong></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" />
                  Loaded
                </span>
                <button 
                  onClick={() => removeDataset(item.id)}
                  className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-slate-100 transition"
                  title="Remove dataset"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Start Harmonization Action Bar */}
      <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-[#0F2942]">
            Ready to Start Harmonization Processing
          </h3>
          <p className="text-xs text-slate-600">
            Executes coordinate re-projection, feature segmentation, topology validation, and attribute matching.
          </p>
        </div>

        <button
          onClick={onStartPipeline}
          className="flex items-center gap-2 px-6 py-2.5 rounded bg-[#15803D] hover:bg-[#166534] text-white font-bold text-xs shadow-xs transition cursor-pointer"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>START HARMONIZATION</span>
        </button>
      </div>
    </div>
  );
};
;
