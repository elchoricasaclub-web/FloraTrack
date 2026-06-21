import React from 'react';
import { useTelemetry } from '../../hooks/useTelemetry';

interface TelemetryGridProps {
  greenhouseId: string;
}

export const TelemetryGrid: React.FC<TelemetryGridProps> = ({ greenhouseId }) => {
  const { telemetry, alerts, safeRanges, hasCriticalSensorsAlert } = useTelemetry(greenhouseId);

  if (!telemetry) {
    return (
      <div className="flex items-center justify-center h-48 border border-slate-100 rounded-2xl bg-slate-50/50">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-semibold text-slate-400">CONNECTING IoT CORE SENSORS...</span>
        </div>
      </div>
    );
  }

  // Helper card component to keep code DRY and maintainable
  const SensorCard = ({
    title,
    value,
    unit,
    limits,
    isWarning,
    colorClass
  }: {
    title: string;
    value: number;
    unit: string;
    limits: { min: number; max: number };
    isWarning: boolean;
    colorClass: string;
  }) => (
    <div
      className={`relative p-5 border rounded-2xl transition-all duration-300 overflow-hidden ${
        isWarning
          ? 'bg-rose-950/40 border-rose-500/50 shadow-rose-900/30 shadow-md animate-pulse'
          : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60 hover:border-slate-600/60'
      }`}
    >
      <div className="flex justify-between items-start relative z-10">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</span>
        <span
          className={`px-2 py-0.5 rounded-md text-[9px] font-black tracking-wider ${
            isWarning ? 'bg-rose-500 text-rose-50' : 'bg-emerald-500/20 text-emerald-400'
          }`}
        >
          {isWarning ? 'OUT OF LIMITS' : 'GACP OK'}
        </span>
      </div>

      <div className="mt-4 flex items-baseline gap-1.5 relative z-10">
        <span className={`text-3xl font-black tracking-tighter ${isWarning ? 'text-rose-400' : 'text-slate-100'}`}>
          {value}
        </span>
        <span className="text-sm font-bold text-slate-500">{unit}</span>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-700/50 text-[10px] font-bold tracking-wider text-slate-500 relative z-10">
        SAFE WINDOW: {limits.min} - {limits.max} {unit}
      </div>

      {isWarning && (
        <div className="absolute inset-0 bg-rose-500/10 z-0 pointer-events-none" />
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Alarming / Warnings banner */}
      {hasCriticalSensorsAlert && (
        <div className="bg-rose-500/10 border border-rose-200 p-4 rounded-2xl flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            <span className="text-xs font-black text-rose-900 tracking-wider">
              CRITICAL ENVIRONMENTAL COMPLIANCE DEVIATIONS DETECTED:
            </span>
          </div>
          <ul className="list-disc pl-5">
            {alerts.map((alert, index) => (
              <li key={index} className="text-xs font-medium text-rose-700 leading-relaxed">
                {alert}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Grid of IoT modules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Ambient Temperature */}
        <SensorCard
          title="Ambient Temp"
          value={telemetry.ambientTemp}
          unit="°C"
          limits={safeRanges.temp}
          isWarning={telemetry.ambientTemp < safeRanges.temp.min || telemetry.ambientTemp > safeRanges.temp.max}
          colorClass="emerald"
        />

        {/* Soil Moisture */}
        <SensorCard
          title="Soil Moisture"
          value={telemetry.soilMoisture}
          unit="%"
          limits={safeRanges.moisture}
          isWarning={telemetry.soilMoisture < safeRanges.moisture.min || telemetry.soilMoisture > safeRanges.moisture.max}
          colorClass="blue"
        />

        {/* Relative Humidity */}
        <SensorCard
          title="Relative Humid."
          value={telemetry.relativeHumidity}
          unit="%"
          limits={safeRanges.humidity}
          isWarning={telemetry.relativeHumidity < safeRanges.humidity.min || telemetry.relativeHumidity > safeRanges.humidity.max}
          colorClass="indigo"
        />

        {/* IRRIGATION PH */}
        <SensorCard
          title="Irrigation pH"
          value={telemetry.irrigationPh}
          unit="pH"
          limits={safeRanges.ph}
          isWarning={telemetry.irrigationPh < safeRanges.ph.min || telemetry.irrigationPh > safeRanges.ph.max}
          colorClass="orange"
        />

        {/* IRRIGATION CONDUCTIVITY */}
        <SensorCard
          title="Soil EC"
          value={telemetry.electricalConductivity}
          unit="mS/cm"
          limits={safeRanges.ec}
          isWarning={telemetry.electricalConductivity < safeRanges.ec.min || telemetry.electricalConductivity > safeRanges.ec.max}
          colorClass="amber"
        />

        {/* AIR CO2 COUNTS */}
        <SensorCard
          title="Enclosed Carbon CO₂"
          value={telemetry.co2Levels}
          unit="ppm"
          limits={safeRanges.co2}
          isWarning={telemetry.co2Levels < safeRanges.co2.min || telemetry.co2Levels > safeRanges.co2.max}
          colorClass="violet"
        />
      </div>
    </div>
  );
};
