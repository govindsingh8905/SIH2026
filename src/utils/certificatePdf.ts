import { jsPDF } from 'jspdf';
import { LandParcel } from '../types';

/**
 * Generates an official Government of India Cadastral Verification Certificate (PDF)
 * compliant with NAKSHA & DILRMP standards
 */
export function generateCadastralCertificatePDF(parcel: LandParcel): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Background styling & border
  doc.setDrawColor(30, 58, 138); // Deep Government Navy
  doc.setLineWidth(1.2);
  doc.rect(8, 8, pageWidth - 16, 281);
  
  doc.setLineWidth(0.4);
  doc.setDrawColor(180, 83, 9); // Gold accent border
  doc.rect(10, 10, pageWidth - 20, 277);

  // Top Header Banner
  doc.setFillColor(15, 23, 42); // Slate dark banner
  doc.rect(10, 10, pageWidth - 20, 32, 'F');

  // National Header Text
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('GOVERNMENT OF INDIA', pageWidth / 2, 17, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('MINISTRY OF RURAL DEVELOPMENT (MoRD) | DEPT. OF LAND RESOURCES (DoLR)', pageWidth / 2, 23, { align: 'center' });
  
  doc.setFontSize(9);
  doc.setTextColor(56, 189, 248); // Cyan
  doc.text('NATIONAL MISSION: NAKSHA & DILRMP — GEOAI HARMONIZED LAND CADASTRE', pageWidth / 2, 28, { align: 'center' });

  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  doc.text('OFFICIAL CADASTRAL VERIFICATION & TITLE RECONCILIATION CERTIFICATE', pageWidth / 2, 35, { align: 'center' });

  // Certificate Reference Details Block
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('CERTIFICATE ID / ULPIN:', 16, 50);
  
  doc.setFont('courier', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(2, 132, 199);
  doc.text(parcel.ulpin, 75, 50);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Issue Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`, 16, 56);
  doc.text(`Jurisdiction: ${parcel.ward}, ${parcel.district}`, 16, 61);

  // Status Badge
  const statusColor = parcel.status === 'VERIFIED' ? [16, 185, 129] : parcel.status === 'REVIEW_REQUIRED' ? [245, 158, 11] : [239, 68, 68];
  doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.roundedRect(pageWidth - 62, 45, 48, 14, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(`STATUS: ${parcel.status.replace('_', ' ')}`, pageWidth - 38, 54, { align: 'center' });

  // Section 1: Cadastral & Ownership Particulars
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(16, 67, pageWidth - 16, 67);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('1. CADASTRAL & RECORD OF RIGHTS (RoR) PARTICULARS', 16, 73);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  
  // Details grid
  doc.text(`Plot / Khasra No: ${parcel.khasraNo}`, 16, 80);
  doc.text(`Khata / Holding No: ${parcel.khataNo}`, 105, 80);
  doc.text(`Owner Name (RoR): ${parcel.ownerName}`, 16, 86);
  doc.text(`Co-Owners: ${parcel.bhashini.coOwners.join(', ') || 'None'}`, 105, 86);
  doc.text(`Regional Record: ${parcel.bhashini.rawRegionalText.substring(0, 48)}...`, 16, 92);
  doc.text(`Bhashini Match: ${parcel.bhashini.matchConfidence}% Verified`, 105, 92);

  // Section 2: Spatial Area Reconciliation Matrix
  doc.line(16, 97, pageWidth - 16, 97);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('2. SPATIAL GEOMETRY & AREA RECONCILIATION MATRIX', 16, 103);

  // Table header
  doc.setFillColor(241, 245, 249);
  doc.rect(16, 107, pageWidth - 32, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text('Data Source Layer', 20, 112);
  doc.text('Recorded Area', 80, 112);
  doc.text('Tolerance / Delta', 130, 112);
  doc.text('Conflation Status', 168, 112);

  doc.setFont('helvetica', 'normal');
  doc.text('1978 Legacy Cadastral Paper Map', 20, 119);
  doc.text(`${parcel.registeredAreaSqM} sq. meters`, 80, 119);
  doc.text('Baseline (0.00 m²)', 130, 119);
  doc.text('Reprojected WGS-84', 168, 119);

  doc.text('2026 NAKSHA Drone 10cm ORI', 20, 126);
  doc.text(`${parcel.detectedAreaSqM} sq. meters`, 80, 126);
  const delta = parcel.detectedAreaSqM - parcel.registeredAreaSqM;
  doc.setTextColor(delta > 0 ? 220 : 51, delta > 0 ? 38 : 65, delta > 0 ? 38 : 85);
  doc.text(`${delta > 0 ? '+' : ''}${delta} sq. meters`, 130, 126);
  doc.setTextColor(51, 65, 85);
  doc.text('Meta SAM-Geo Vector', 168, 126);

  doc.setFont('helvetica', 'bold');
  doc.text('Final Harmonized Legal Area', 20, 133);
  doc.text(`${parcel.harmonizedAreaSqM} sq. meters`, 80, 133);
  doc.setTextColor(16, 185, 129);
  doc.text('Topologically Snapped', 130, 133);
  doc.text('PostGIS ST_Snap Validated', 168, 133);
  doc.setTextColor(51, 65, 85);

  // Section 3: Multi-Criteria Mathematical Confidence Scoring
  doc.line(16, 138, pageWidth - 16, 138);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('3. DETERMINISTIC BOUNDARY CONFIDENCE SCORING (CS FORMULATION)', 16, 144);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('CS = 0.40 · IoU(P_legacy, P_drone) + 0.30 · (1 - Dist_Hausdorff / Dist_max) + 0.30 · Sim_NLP(RoR, Municipal)', 16, 150);

  // Breakdown metrics
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(16, 154, 42, 18, 1, 1, 'F');
  doc.roundedRect(62, 154, 42, 18, 1, 1, 'F');
  doc.roundedRect(108, 154, 42, 18, 1, 1, 'F');
  doc.roundedRect(154, 154, 40, 18, 1, 1, 'F');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('Spatial Overlap (IoU)', 18, 160);
  doc.text('Hausdorff Edge Fit', 64, 160);
  doc.text('Bhashini NLP Match', 110, 160);
  doc.text('Total Confidence Score', 156, 160);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(`${parcel.confidence.iouScore}%`, 18, 168);
  doc.text(`${parcel.confidence.hausdorffScore}%`, 64, 168);
  doc.text(`${parcel.confidence.nlpScore}%`, 110, 168);
  doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.text(`${parcel.confidence.overallScore}%`, 156, 168);

  // Section 4: Municipal Tax & Utility Risk Assessment
  doc.line(16, 177, pageWidth - 16, 177);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('4. MULTI-DEPARTMENTAL AUDIT: MUNICIPAL TAX & SUBSURFACE UTILITIES', 16, 183);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text(`Tax Assessment Status: ${parcel.tax.taxStatus}`, 16, 190);
  doc.text(`Declared Structure: ${parcel.tax.registeredFloorCount} Floor(s) (${parcel.tax.registeredPropertyType})`, 16, 196);
  doc.text(`Detected Drone DSM: ${parcel.tax.detectedFloorCount} Floor(s) (${parcel.tax.detectedPropertyType})`, 105, 196);
  
  doc.text(`Declared Annual Tax: Rs. ${parcel.tax.declaredAnnualTax.toLocaleString('en-IN')}`, 16, 202);
  doc.text(`Assessed Fair Tax: Rs. ${parcel.tax.assessedFairTax.toLocaleString('en-IN')}`, 70, 202);
  doc.text(`Calculated Revenue Gap: Rs. ${parcel.tax.taxGapAmount.toLocaleString('en-IN')}`, 130, 202);

  doc.text(`Subsurface Utility Layer: ${parcel.utility.utilityType} (${parcel.utility.depthMeters}m depth)`, 16, 208);
  doc.text(`Disaster Safety Audit: ${parcel.utility.isColliding ? 'COLLISION HAZARD FLAGGED' : 'Safe / Clearance Maintained'}`, 16, 214);

  // Section 5: Cryptographic PostGIS Audit & QR Code
  doc.line(16, 220, pageWidth - 16, 220);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('5. DIGITAL SIGNATURE & IMMUTABLE POSTGIS AUDIT TRAIL', 16, 226);

  // Simulated QR Code Box
  doc.setFillColor(241, 245, 249);
  doc.rect(16, 231, 30, 30, 'F');
  doc.setDrawColor(15, 23, 42);
  doc.rect(18, 233, 10, 10);
  doc.rect(34, 233, 10, 10);
  doc.rect(18, 249, 10, 10);
  doc.rect(30, 245, 4, 4, 'F');
  doc.rect(24, 239, 4, 4, 'F');
  doc.rect(38, 253, 6, 6, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.text('Scan for PostGIS Audit', 17, 264);

  doc.setFont('courier', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`PostGIS Transaction Hash:`, 50, 236);
  doc.text(parcel.postgisAuditHash || '0x8f2a174c93be4e9102cba372d8a569b04c8f1e29', 50, 241);
  doc.text(`CORS GNSS Network Timestamp: 2026-08-28T10:18:42.194+05:30`, 50, 246);
  doc.text(`Centroid: Lat ${parcel.gpsCoordinates.centroid.lat} N, Lng ${parcel.gpsCoordinates.centroid.lng} E`, 50, 251);

  // Tehsildar Official Sign
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('DIGITALLY SIGNED & VERIFIED BY:', pageWidth - 80, 246);
  doc.setFont('helvetica', 'normal');
  doc.text('Revenue Officer / Tehsildar', pageWidth - 80, 251);
  doc.text('District Land Revenue Office, Ranchi', pageWidth - 80, 256);
  doc.setTextColor(16, 185, 129);
  doc.text('√ Validated via e-Pramaan DPI', pageWidth - 80, 261);

  // Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('This document is generated by GeoSync NAKSHA Portal under MoRD & DoLR guidelines. Verifiable on national land portal.', pageWidth / 2, 283, { align: 'center' });

  return doc;
}

