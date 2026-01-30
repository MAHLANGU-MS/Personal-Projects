import { useEffect, useState, useCallback } from 'react';

declare global {
  interface Window {
    webgazer: any;
  }
}

export interface GazePoint {
  x: number;
  y: number;
  timestamp: number;
}

export const useEyeTracking = (enabled: boolean) => {
  const [gazeData, setGazeData] = useState<GazePoint[]>([]);
  const [isCalibrated, setIsCalibrated] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const initWebGazer = async () => {
      if (window.webgazer) {
        window.webgazer
          .setGazeListener((data: any) => {
            if (data) {
              const point: GazePoint = {
                x: data.x,
                y: data.y,
                timestamp: Date.now(),
              };
              setGazeData((prev) => [...prev, point]);
            }
          })
          .begin();

        setTimeout(() => setIsCalibrated(true), 3000);
      }
    };

    initWebGazer();

    return () => {
      if (window.webgazer) {
        window.webgazer.end();
      }
    };
  }, [enabled]);

  const clearGazeData = useCallback(() => {
    setGazeData([]);
  }, []);

  return { gazeData, isCalibrated, clearGazeData };
};
