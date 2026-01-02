
export interface BodyMeasurements {
  height: number; // in cm
  weight: number; // in kg
  chest: number; // in cm
  waist: number; // in cm
  hips: number; // in cm
  shoulders: number; // in cm
  inseam: number; // in cm
  neck: number; // in cm
  sleeve: number; // in cm
}

export interface BodyScan {
  id: string;
  userId: string;
  imageUri: string;
  measurements: BodyMeasurements;
  createdAt: string;
  updatedAt: string;
}

export interface BodyAnalysisResult {
  measurements: Partial<BodyMeasurements>;
  confidence: number;
  suggestions: string[];
}
