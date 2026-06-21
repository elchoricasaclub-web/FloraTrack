/**
 * useTelemetry React Hook
 * Simulates real-time agricultural telemetry from IoT soil, climate, and water sensors inside the greenhouse.
 * Alerts if any environmental variable breaches WHO GACP limits.
 */

import { useState, useEffect } from 'react';
import { IoTTelemetry } from '../types/agricultural';

// Recommended growth ranges according to expert botanical guides (WHO/EMA)
const ENVIRONMENT_ENVELOPES = {
  temp: { min: 20.0, max: 28.0, unit: '°C' },
  humidity: { min: 45.0, max: 70.0, unit: '%' },
  moisture: { min: 50.0, max: 75.0, unit: '%' },
  ph: { min: 5.8, max: 6.5, unit: 'pH' },
  ec: { min: 1.2, max: 2.2, unit: 'mS/cm' },
  co2: { min: 400, max: 1200, unit: 'ppm' }
};

export function useTelemetry(greenhouseId: string, isStreaming = true) {
  const [telemetry, setTelemetry] = useState<IoTTelemetry | null>(null);
  const [alerts, setAlerts] = useState<string[]>([]);

  // Simulation generator
  const generateReading = (): IoTTelemetry => {
    // Generate pseudo-random numbers around realistic botanical ideals
    const ambientTemp = parseFloat((23.5 + (Math.random() - 0.5) * 3).toFixed(1));
    const relativeHumidity = parseFloat((58.0 + (Math.random() - 0.5) * 10).toFixed(1));
    const soilMoisture = parseFloat((62.0 + (Math.random() - 0.5) * 8).toFixed(1));
    const irrigationPh = parseFloat((6.1 + (Math.random() - 0.5) * 0.4).toFixed(2));
    const electricalConductivity = parseFloat((1.7 + (Math.random() - 0.5) * 0.3).toFixed(2));
    const co2Levels = Math.round(750 + (Math.random() - 0.5) * 150);
    const dli = parseFloat((22.4 + (Math.random() - 0.5) * 2).toFixed(1));

    return {
      timestamp: new Date().toISOString(),
      ambientTemp,
      relativeHumidity,
      soilMoisture,
      irrigationPh,
      electricalConductivity,
      co2Levels,
      dli
    };
  };

  useEffect(() => {
    // Seed initial reading
    if (!telemetry) {
      const initial = generateReading();
      setTelemetry(initial);
      checkEnvelopes(initial);
    }

    if (!isStreaming) return;

    // Real-time sensor interval stream simulation
    const interval = setInterval(() => {
      const reading = generateReading();
      setTelemetry(reading);
      checkEnvelopes(reading);
    }, 4500); // UI updates every 4.5 seconds

    return () => clearInterval(interval);
  }, [greenhouseId, isStreaming]);

  const checkEnvelopes = (reading: IoTTelemetry) => {
    const activeAlerts: string[] = [];

    if (reading.ambientTemp < ENVIRONMENT_ENVELOPES.temp.min || reading.ambientTemp > ENVIRONMENT_ENVELOPES.temp.max) {
      activeAlerts.push(`Critical Air Temp Alert: ${reading.ambientTemp}°C is outside the safe pharmaceutical window!`);
    }
    if (reading.irrigationPh < ENVIRONMENT_ENVELOPES.ph.min || reading.irrigationPh > ENVIRONMENT_ENVELOPES.ph.max) {
      activeAlerts.push(`Irrigation System pH Alert: Water pH is at ${reading.irrigationPh}. Nutrient lockout hazard!`);
    }
    if (reading.soilMoisture < ENVIRONMENT_ENVELOPES.moisture.min || reading.soilMoisture > ENVIRONMENT_ENVELOPES.moisture.max) {
      activeAlerts.push(`Substrate Humidity Hazard: Soil moisture registered at ${reading.soilMoisture}%. Root hygiene vulnerable.`);
    }

    setAlerts(activeAlerts);
  };

  return {
    telemetry,
    alerts,
    safeRanges: ENVIRONMENT_ENVELOPES,
    hasCriticalSensorsAlert: alerts.length > 0
  };
}
