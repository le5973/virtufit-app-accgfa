
import { useCallback, useRef, useState } from "react";

export type BodyAnalysisParams = {
  imageUri: string;
  manualMeasurements?: {
    height?: number;
    weight?: number;
  };
};

export type BodyAnalysisResult = {
  measurements: {
    height?: number;
    weight?: number;
    chest?: number;
    waist?: number;
    hips?: number;
    shoulders?: number;
    inseam?: number;
    neck?: number;
    sleeve?: number;
  };
  confidence: number;
  suggestions: string[];
};

type State =
  | { status: "idle"; data: null; error: null }
  | { status: "loading"; data: null; error: null }
  | { status: "success"; data: BodyAnalysisResult; error: null }
  | { status: "error"; data: null; error: string };

export function useBodyAnalysis() {
  const [state, setState] = useState<State>({ status: "idle", data: null, error: null });
  const abortRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => setState({ status: "idle", data: null, error: null }), []);
  const abort = useCallback(() => { 
    abortRef.current?.abort(); 
    abortRef.current = null; 
  }, []);

  const analyzeBody = useCallback(async (params: BodyAnalysisParams): Promise<BodyAnalysisResult | null> => {
    if (!params.imageUri) {
      setState({ status: "error", data: null, error: "Image is required for body analysis." });
      return null;
    }

    setState({ status: "loading", data: null, error: null });
    
    try {
      const controller = new AbortController();
      abortRef.current = controller;

      console.log("Starting body analysis with image:", params.imageUri);

      // For now, return mock data since Supabase needs to be enabled
      // In production, this would call a Supabase Edge Function that uses OpenAI Vision API
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

      const mockResult: BodyAnalysisResult = {
        measurements: {
          height: params.manualMeasurements?.height || 175,
          weight: params.manualMeasurements?.weight || 70,
          chest: 95,
          waist: 80,
          hips: 95,
          shoulders: 45,
          inseam: 80,
          neck: 38,
          sleeve: 60,
        },
        confidence: 0.85,
        suggestions: [
          "For best results, take photos in good lighting",
          "Stand straight with arms slightly away from body",
          "Wear form-fitting clothing for accurate measurements"
        ]
      };

      setState({ status: "success", data: mockResult, error: null });
      return mockResult;
    } catch (e: any) {
      if (e?.name === "AbortError") {
        console.log("Body analysis aborted");
        return null;
      }
      const errorMessage = e?.message ?? "Failed to analyze body measurements";
      console.error("Body analysis error:", errorMessage);
      setState({ status: "error", data: null, error: errorMessage });
      return null;
    } finally {
      abortRef.current = null;
    }
  }, []);

  const loading = state.status === "loading";
  const error = state.status === "error" ? state.error : null;
  const data = state.status === "success" ? state.data : null;

  return { analyzeBody, loading, error, data, reset, abort };
}
