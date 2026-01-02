
import { BodyMeasurements, SizeGuide, FitPrediction } from '@/types/bodyMeasurements';

// Mock size guides for popular brands
export const mockSizeGuides: Record<string, SizeGuide> = {
  'zara': {
    brand: 'Zara',
    category: 'tops',
    measurements: [
      { size: 'XS', bust: 80, waist: 62, hip: 88 },
      { size: 'S', bust: 84, waist: 66, hip: 92 },
      { size: 'M', bust: 88, waist: 70, hip: 96 },
      { size: 'L', bust: 92, waist: 74, hip: 100 },
      { size: 'XL', bust: 96, waist: 78, hip: 104 },
    ],
  },
  'h&m': {
    brand: 'H&M',
    category: 'tops',
    measurements: [
      { size: 'XS', bust: 82, waist: 64, hip: 90 },
      { size: 'S', bust: 86, waist: 68, hip: 94 },
      { size: 'M', bust: 90, waist: 72, hip: 98 },
      { size: 'L', bust: 94, waist: 76, hip: 102 },
      { size: 'XL', bust: 98, waist: 80, hip: 106 },
    ],
  },
  'nike': {
    brand: 'Nike',
    category: 'tops',
    measurements: [
      { size: 'XS', bust: 81, waist: 63, hip: 89 },
      { size: 'S', bust: 86, waist: 68, hip: 94 },
      { size: 'M', bust: 91, waist: 73, hip: 99 },
      { size: 'L', bust: 96, waist: 78, hip: 104 },
      { size: 'XL', bust: 101, waist: 83, hip: 109 },
    ],
  },
};

export const predictFit = (
  userMeasurements: BodyMeasurements,
  sizeGuide: SizeGuide
): FitPrediction[] => {
  const predictions: FitPrediction[] = [];

  for (const size of sizeGuide.measurements) {
    let fitScore = 100;
    const recommendations: string[] = [];
    let tooSmall = false;
    let tooLarge = false;

    // Compare bust
    if (size.bust) {
      const bustDiff = Math.abs(userMeasurements.bust - size.bust);
      if (userMeasurements.bust > size.bust + 5) {
        fitScore -= 30;
        tooSmall = true;
        recommendations.push('Bust may be tight');
      } else if (userMeasurements.bust < size.bust - 5) {
        fitScore -= 20;
        tooLarge = true;
        recommendations.push('Bust may be loose');
      } else if (bustDiff <= 2) {
        recommendations.push('Perfect bust fit');
      }
    }

    // Compare waist
    if (size.waist) {
      const waistDiff = Math.abs(userMeasurements.waist - size.waist);
      if (userMeasurements.waist > size.waist + 5) {
        fitScore -= 30;
        tooSmall = true;
        recommendations.push('Waist may be tight');
      } else if (userMeasurements.waist < size.waist - 5) {
        fitScore -= 20;
        tooLarge = true;
        recommendations.push('Waist may be loose');
      } else if (waistDiff <= 2) {
        recommendations.push('Perfect waist fit');
      }
    }

    // Compare hip
    if (size.hip) {
      const hipDiff = Math.abs(userMeasurements.hip - size.hip);
      if (userMeasurements.hip > size.hip + 5) {
        fitScore -= 30;
        tooSmall = true;
        recommendations.push('Hip may be tight');
      } else if (userMeasurements.hip < size.hip - 5) {
        fitScore -= 20;
        tooLarge = true;
        recommendations.push('Hip may be loose');
      } else if (hipDiff <= 2) {
        recommendations.push('Perfect hip fit');
      }
    }

    const perfectFit = fitScore >= 85 && !tooSmall && !tooLarge;

    predictions.push({
      size: size.size,
      fitScore: Math.max(0, fitScore),
      tooSmall,
      tooLarge,
      perfectFit,
      recommendations: recommendations.length > 0 ? recommendations : ['Good fit'],
    });
  }

  return predictions.sort((a, b) => b.fitScore - a.fitScore);
};

export const getBestFitSize = (predictions: FitPrediction[]): FitPrediction | null => {
  return predictions.find(p => p.perfectFit) || predictions[0] || null;
};
