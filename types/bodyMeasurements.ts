
export interface BodyMeasurements {
  bust: number;        // in cm
  waist: number;       // in cm
  hip: number;         // in cm
  shoulders: number;   // in cm
  armLength: number;   // in cm
  legsLength: number;  // in cm
  feetSize: number;    // in cm or shoe size
}

export interface BodyScan {
  height: number;      // in cm
  weight: number;      // in kg
  image: string | null;
}

export interface BodyAnalysisResult {
  measurements: BodyMeasurements;
  confidence: number;
}
