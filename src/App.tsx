import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar, ActiveTab } from './components/layout/Sidebar';
import { TelemetryHUD } from './components/layout/TelemetryHUD';
import { CommandCenter } from './components/overview/CommandCenter';
import { DataIngestion } from './components/ingestion/DataIngestion';
import { HarmonizationPipeline } from './components/pipeline/HarmonizationPipeline';
import { WebGISViewer } from './components/map/WebGISViewer';
import { PlotDetailsDrawer } from './components/inspection/PlotDetailsDrawer';
import { ConflictTable } from './components/conflicts/ConflictTable';
import { TaxIntelligence } from './components/tax/TaxIntelligence';
import { BhashiniViewer } from './components/bhashini/BhashiniViewer';
import { CertificateModal } from './components/certificate/CertificateModal';
import { SystemGuide } from './components/guide/SystemGuide';

import { ranchiWard14Data } from './data/ranchiWard14';

import { puneWard08Data } from './data/puneWard08';
import { LandParcel, WardDataset } from './types';

export function App() {
  const [ward, setWard] = useState<WardDataset>(ranchiWard14Data);
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [selectedParcel, setSelectedParcel] = useState<LandParcel | null>(null);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState<boolean>(false);
  const [certificateParcel, setCertificateParcel] = useState<LandParcel | null>(null);
  const [isHarmonizing, setIsHarmonizing] = useState<boolean>(false);

  // Ward Switcher
  const handleSelectWard = (wardId: string) => {
    if (wardId === 'MH-PUN-W08') {
      setWard(puneWard08Data);
      setSelectedParcel(puneWard08Data.parcels[0]);
    } else {
      setWard(ranchiWard14Data);
      setSelectedParcel(ranchiWard14Data.parcels[0]);
    }
  };

  // 1-Click Auto-Heal & Snapping simulation
  const handleAutoHealParcel = (parcelId: string) => {
    const updatedParcels = ward.parcels.map(p => {
      if (p.id === parcelId) {
        const resolved: LandParcel = {
          ...p,
          status: 'VERIFIED',
          isResolved: true,
          confidence: {
            iouScore: 96.8,
            hausdorffScore: 95.5,
            nlpScore: 97.0,
            overallScore: 96.5
          },
          detectedAreaSqM: p.registeredAreaSqM,
          postgisAuditHash: `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}ae89`,
          encroachmentDetails: p.encroachmentDetails ? {
            ...p.encroachmentDetails,
            isEncroaching: false
          } : undefined
        };
        if (selectedParcel?.id === parcelId) {
          setSelectedParcel(resolved);
        }
        return resolved;
      }
      return p;
    });

    const updatedConflicts = ward.conflicts.map(c => {
      if (c.plotId === parcelId) {
        return { ...c, status: 'RESOLVED' as const };
      }
      return c;
    });

    setWard({
      ...ward,
      parcels: updatedParcels,
      conflicts: updatedConflicts,
      verifiedCount: ward.verifiedCount + 1,
      conflictCount: Math.max(0, ward.conflictCount - 1)
    });
  };

  // Trigger quick harmonization
  const handleTriggerHarmonization = () => {
    setActiveTab('pipeline');
  };

  // Open certificate modal
  const handleOpenCertificate = (parcel?: LandParcel) => {
    const target = parcel || selectedParcel || ward.parcels[0];
    setCertificateParcel(target);
    setIsCertificateModalOpen(true);
  };

  const avgConfidence = parseFloat(
    (ward.parcels.reduce((acc, p) => acc + p.confidence.overallScore, 0) / ward.parcels.length).toFixed(1)
  );

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-100 text-slate-900 overflow-hidden font-sans">
      {/* Top Government Navigation Header */}
      <Header
        currentWard={ward}
        onSelectWard={handleSelectWard}
        onOpenCertificateModal={() => handleOpenCertificate()}
        selectedPlotId={selectedParcel?.id || null}
        onTriggerHarmonization={handleTriggerHarmonization}
        isHarmonizing={isHarmonizing}
        onOpenGuide={() => setActiveTab('guide')}
      />


      {/* Live Administrative Metric Strip */}
      <TelemetryHUD
        ward={ward}
        averageConfidence={avgConfidence}
      />

      {/* Main Workspace: Sidebar + Central Viewport + Inspection Drawer */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            if (tab === 'certificates') {
              handleOpenCertificate();
            } else {
              setActiveTab(tab);
            }
          }}
          conflictCount={ward.conflicts.filter(c => c.status === 'PENDING').length}
          unassessedTaxCount={ward.parcels.filter(p => p.tax.taxGapAmount > 0).length}
        />

        {/* Central Dynamic Viewport */}
        <main className="flex-1 overflow-y-auto relative bg-slate-50">
          {activeTab === 'overview' && (
            <CommandCenter
              ward={ward}
              onOpenWebGIS={() => setActiveTab('webgis')}
              onOpenPipeline={() => setActiveTab('pipeline')}
              onOpenConflicts={() => setActiveTab('conflicts')}
              onOpenTax={() => setActiveTab('tax')}
              onSelectParcel={(p) => {
                setSelectedParcel(p);
                setActiveTab('webgis');
              }}
            />
          )}

          {activeTab === 'webgis' && (
            <WebGISViewer
              ward={ward}
              selectedParcel={selectedParcel}
              onSelectParcel={(p) => setSelectedParcel(p)}
              onAutoHealParcel={handleAutoHealParcel}
            />
          )}

          {activeTab === 'ingestion' && (
            <DataIngestion
              ward={ward}
              onStartPipeline={() => setActiveTab('pipeline')}
              onLoadRanchiPreset={() => handleSelectWard('JH-RAN-W14')}
              onLoadPunePreset={() => handleSelectWard('MH-PUN-W08')}
            />
          )}

          {activeTab === 'pipeline' && (
            <HarmonizationPipeline
              ward={ward}
              onPipelineComplete={() => setActiveTab('webgis')}
              autoRun={true}
            />
          )}

          {activeTab === 'conflicts' && (
            <ConflictTable
              ward={ward}
              onSelectParcel={(p) => {
                setSelectedParcel(p);
                setActiveTab('webgis');
              }}
              onAutoHealParcel={handleAutoHealParcel}
            />
          )}

          {activeTab === 'tax' && (
            <TaxIntelligence
              ward={ward}
              onSelectParcel={(p) => {
                setSelectedParcel(p);
                setActiveTab('webgis');
              }}
            />
          )}

          {activeTab === 'bhashini' && (
            <BhashiniViewer ward={ward} />
          )}

          {activeTab === 'guide' && (
            <SystemGuide />
          )}
        </main>


        {/* Right Deep Plot Inspection Drawer (Available when parcel is selected) */}
        {selectedParcel && (
          <PlotDetailsDrawer
            parcel={selectedParcel}
            onClose={() => setSelectedParcel(null)}
            onGenerateCertificate={(p) => handleOpenCertificate(p)}
            onAutoHeal={handleAutoHealParcel}
          />
        )}
      </div>

      {/* Official Cadastral Verification Certificate Modal */}
      {certificateParcel && (
        <CertificateModal
          parcel={certificateParcel}
          isOpen={isCertificateModalOpen}
          onClose={() => setIsCertificateModalOpen(false)}
        />
      )}
    </div>
  );
}

export default App;

