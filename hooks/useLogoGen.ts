
import { useState, useCallback } from 'react';

export type LogoGenParams = {
  appName: string;
  colorScheme: string;
  style?: string;
};

export type LogoGenResult = {
  url: string;
  path: string;
  width: number;
  height: number;
  duration_ms: number;
};

type State =
  | { status: 'idle'; data: null; error: null }
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: LogoGenResult; error: null }
  | { status: 'error'; data: null; error: string };

export function useLogoGen() {
  const [state, setState] = useState<State>({ status: 'idle', data: null, error: null });

  const reset = useCallback(() => {
    setState({ status: 'idle', data: null, error: null });
  }, []);

  const generate = useCallback(
    async (params: LogoGenParams): Promise<LogoGenResult | null> => {
      const appName = (params.appName ?? '').trim();
      if (appName.length < 2) {
        setState({ status: 'error', data: null, error: 'App name must be at least 2 characters.' });
        return null;
      }

      setState({ status: 'loading', data: null, error: null });

      try {
        // TODO: Backend Integration - Call the logo generation API endpoint
        // This will use OpenAI's image-gen-1 model to generate a professional app logo
        // Endpoint: POST /api/generate-logo
        // Body: { appName, colorScheme, style }
        // The backend will:
        // 1. Create a detailed prompt for logo generation based on app name and color scheme
        // 2. Call OpenAI image-gen-1 API with the prompt
        // 3. Save the generated logo to storage
        // 4. Return the public URL and metadata
        
        const prompt = `Create a modern, elegant app logo for "${appName}", a fashion and body measurement app. Use a blue color scheme with colors ${params.colorScheme}. The logo should be minimalist, professional, and suitable for both iOS and Android app icons. Include subtle fashion or measurement-related design elements. Square format, clean design, no text.`;
        
        console.log('Logo generation prompt:', prompt);
        console.log('Params:', params);

        // Simulated response for now - backend will replace this
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock successful response
        const mockResult: LogoGenResult = {
          url: 'https://placeholder.com/logo.png',
          path: 'logos/ervenista-logo.png',
          width: 1024,
          height: 1024,
          duration_ms: 2000,
        };

        setState({ status: 'success', data: mockResult, error: null });
        return mockResult;
      } catch (err: any) {
        const message = err?.message ?? 'Unknown error';
        setState({ status: 'error', data: null, error: message });
        return null;
      }
    },
    []
  );

  const loading = state.status === 'loading';
  const error = state.status === 'error' ? state.error : null;
  const data = state.status === 'success' ? state.data : null;

  return { generate, loading, error, data, reset };
}
