import { Coordinate, ConfidenceBreakdown, ParcelStatus } from '../types';

/**
 * Calculates polygon area using the standard Shoelace formula
 */
export function calculatePolygonArea(vertices: Coordinate[]): number {
  if (vertices.length < 3) return 0;
  let area = 0;
  for (let i = 0; i < vertices.length; i++) {
    const j = (i + 1) % vertices.length;
    area += vertices[i].x * vertices[j].y;
    area -= vertices[j].x * vertices[i].y;
  }
  return Math.abs(area) / 2;
}

/**
 * Calculates Euclidean distance between two points
 */
export function pointDistance(p1: Coordinate, p2: Coordinate): number {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
}

/**
 * Calculates directed Hausdorff Distance between two point sets
 */
export function directedHausdorff(polyA: Coordinate[], polyB: Coordinate[]): number {
  let maxDist = 0;
  for (const pA of polyA) {
    let minDist = Infinity;
    for (const pB of polyB) {
      const d = pointDistance(pA, pB);
      if (d < minDist) minDist = d;
    }
    if (minDist > maxDist) maxDist = minDist;
  }
  return maxDist;
}

/**
 * Calculates Bidirectional Hausdorff Distance between two polygons
 */
export function calculateHausdorffDistance(polyA: Coordinate[], polyB: Coordinate[]): number {
  const d1 = directedHausdorff(polyA, polyB);
  const d2 = directedHausdorff(polyB, polyA);
  return Math.max(d1, d2);
}

/**
 * Computes the Multi-Criteria Mathematical Confidence Score
 * Formula:
 * CS = w1 * IoU(P_legacy, P_drone) + w2 * (1 - Dist_Hausdorff / Dist_max) + w3 * Sim_NLP(RoR, Municipal)
 * Where w1 = 0.40, w2 = 0.30, w3 = 0.30
 */
export function calculateConfidenceScore(
  iouScore: number,          // 0 to 100
  hausdorffDist: number,     // in meters / units
  maxAllowedDist: number,    // maximum allowable deviation (e.g. 5.0m)
  nlpSimilarity: number      // 0 to 100
): ConfidenceBreakdown {
  const w1 = 0.40;
  const w2 = 0.30;
  const w3 = 0.30;

  // Normalized Hausdorff score (1 - Dist_Hausdorff / Dist_max)
  const normalizedHausdorff = Math.max(0, Math.min(100, (1 - hausdorffDist / maxAllowedDist) * 100));
  
  // Overall weighted score
  const overall = (w1 * iouScore) + (w2 * normalizedHausdorff) + (w3 * nlpSimilarity);

  return {
    iouScore: parseFloat(iouScore.toFixed(1)),
    hausdorffScore: parseFloat(normalizedHausdorff.toFixed(1)),
    nlpScore: parseFloat(nlpSimilarity.toFixed(1)),
    overallScore: parseFloat(overall.toFixed(1))
  };
}

/**
 * Determine parcel status according to traffic-light criteria:
 * Green (>90% CS) = Auto-validated / Verified
 * Amber (70-90% CS) = Minor spatial shift / Review required
 * Red (<70% CS) = Encroachment / Tax mismatch flagged
 */
export function getStatusFromConfidence(overallScore: number): ParcelStatus {
  if (overallScore >= 90) return 'VERIFIED';
  if (overallScore >= 70) return 'REVIEW_REQUIRED';
  return 'CONFLICT';
}

/**
 * Simulates PostGIS ST_Snap operation:
 * Snaps vertices of dronePolygon onto legacy boundary within tolerance epsilon
 */
export function simulatePostGISSnap(
  sourcePoly: Coordinate[],
  targetPoly: Coordinate[],
  tolerance: number = 2.0
): Coordinate[] {
  return sourcePoly.map(p => {
    let closest = p;
    let minD = Infinity;
    for (const tp of targetPoly) {
      const d = pointDistance(p, tp);
      if (d < minD && d <= tolerance) {
        minD = d;
        closest = { ...tp };
      }
    }
    return closest;
  });
}
