/**
 * Municipal Property Tax Intelligence Engine (MoHUA Compliance)
 * Detects unassessed commercial floors, FAR violations, and revenue leakage
 */

export interface TaxCalculationResult {
  declaredTax: number;
  assessedFairTax: number;
  unpaidAnnualLeakage: number;
  backTaxDemand3Years: number;
  detectedMultiplier: number;
  riskCategory: 'CRITICAL_LEAKAGE' | 'MODERATE_GAP' | 'COMPLIANT';
  assessmentSummary: string;
}

export function computeTaxAssessment(
  registeredAreaSqM: number,
  detectedAreaSqM: number,
  registeredFloors: number,
  detectedFloors: number,
  registeredType: string,
  detectedType: string
): TaxCalculationResult {
  // Base rates per sq.meter in urban wards (INR)
  const RESIDENTIAL_RATE_PER_SQM = 15; // e.g. base tax factor
  const COMMERCIAL_RATE_PER_SQM = 45;

  const regRate = registeredType === 'Commercial' ? COMMERCIAL_RATE_PER_SQM : RESIDENTIAL_RATE_PER_SQM;
  const detRate = detectedType === 'Commercial' ? COMMERCIAL_RATE_PER_SQM : RESIDENTIAL_RATE_PER_SQM;

  const declaredBuiltUp = registeredAreaSqM * Math.max(1, registeredFloors);
  const detectedBuiltUp = detectedAreaSqM * Math.max(1, detectedFloors);

  const declaredTax = Math.round(declaredBuiltUp * regRate * 0.25);
  const assessedFairTax = Math.round(detectedBuiltUp * detRate * 0.25);
  const unpaidAnnualLeakage = Math.max(0, assessedFairTax - declaredTax);
  
  // 3-Year retroactive assessment + 18% statutory penalty
  const backTaxDemand3Years = Math.round((unpaidAnnualLeakage * 3) * 1.18);

  let riskCategory: 'CRITICAL_LEAKAGE' | 'MODERATE_GAP' | 'COMPLIANT' = 'COMPLIANT';
  if (unpaidAnnualLeakage > 30000 || detectedFloors > registeredFloors + 1) {
    riskCategory = 'CRITICAL_LEAKAGE';
  } else if (unpaidAnnualLeakage > 0) {
    riskCategory = 'MODERATE_GAP';
  }

  let summary = 'Property tax records match physical structure parameters.';
  if (detectedFloors > registeredFloors) {
    summary = `Drone DSM detected +${detectedFloors - registeredFloors} undeclared upper floor(s). Converted to ${detectedType} use without ULB trade license.`;
  }

  return {
    declaredTax,
    assessedFairTax,
    unpaidAnnualLeakage,
    backTaxDemand3Years,
    detectedMultiplier: parseFloat((detectedBuiltUp / Math.max(1, declaredBuiltUp)).toFixed(2)),
    riskCategory,
    assessmentSummary: summary
  };
}
