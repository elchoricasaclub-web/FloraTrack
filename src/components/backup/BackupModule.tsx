"use client";

import { useEffect, useState } from "react";

type HealthCheck = {
  label: string;
  ok: boolean;
  count: number;
  error: string | null;
};

type HealthResponse = {
  ok: boolean;
  healthScore: number;
  totalModules: number;
  modulesOk: number;
  modulesFailed: number;
  totalRecords: number;
  checks: HealthCheck[];
  failed: HealthCheck[];
};

type BackupSummary = {
  app: string;
  version: string;
  generatedAt: string;
  engine: string;
  counts: Record<string, number>;
  totalRecords: number;
};

function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const element = document.createElement("a");

  element.href = url;
  element.download = filename;
  element.click();

  URL.revokeObjectURL(url);
}

export default function BackupModule() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [backupSummary, setBackupSummary] = useState<BackupSummary | null>(null);
  const [message, setMessage] = useState("Cargando estado del sistema...");

  async function loadHealth() {
    try {
      const response = await fetch("/api/enterprise/health", {
        cache: "no-store",
      });

      const result = await response.json();

      setHealth(result);
      setMessage(
        result.ok
          ? "Sistema verificado correctamente."
          : "Existen módulos con error. Revisar detalle."
      );
    } catch {
      setMessage("Error conectando API de salud del sistema.");
    }
  }

  async function createBackup() {
    try {
      setMessage("Generando backup enterprise...");

      const response = await fetch("/api/enterprise/backup", {
        method: "POST",
      });

      const result = await response.json();

      if (!result.ok) {
        setMessage(result.error || "Error generando backup.");
        return;
      }

      const filename = `floratrack_backup_${new Date()
        .toISOString()
        .replaceAll(":", "-")
        .slice(0, 19)}.json`;

      downloadFile(
        filename,
        JSON.stringify(result.backup, null, 2),
        "application/json"
      );

      setBackupSummary({
        app: result.backup.app,
        version: result.backup.version,
        generatedAt: result.backup.generatedAt,
        engine: result.backup.engine,
        counts: result.backup.counts,
        totalRecords: result.backup.totalRecords,
      });

      setMessage("Backup enterprise generado, descargado y auditado.");
      loadHealth();
    } catch {
      setMessage("Error generando backup enterprise.");
    }
  }

  async function previewBackup() {
    try {
      setMessage("Preparando vista previa del backup...");

      const response = await fetch("/api/enterprise/backup", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!result.ok) {
        setMessage(result.error || "Error obteniendo backup.");
        return;
      }

      setBackupSummary({
        app: result.backup.app,
        version: result.backup.version,
        generatedAt: result.backup.generatedAt,
        engine: result.backup.engine,
        counts: result.backup.counts,
        totalRecords: result.backup.totalRecords,
      });

      setMessage("Vista previa del backup cargada.");
    } catch {
      setMessage("Error obteniendo vista previa.");
    }
  }

  useEffect(() => {
    loadHealth();
    previewBackup();
  }, []);

  const score = health?.healthScore || 0;

  const scoreColor =
    score >= 90
      ? "text-green-600"
      : score >= 70
      ? "text-yellow-600"
      : "text-red-600";

  return (
    <section className="bg-white rounded-2xl shadow p-8">
      <div className="flex justify-between items-start gap-6 mb-8">
        <div>
          <h2 className="text-4xl font-bold text-slate-800">
            Backup Enterprise
          </h2>
          <p className="text-slate-500 mt-2 max-w-3xl leading-relaxed">
            Respaldo completo en JSON de FloraTrack: operación, regulación,
            documentos, inventario, facility, calidad, seguridad, datos
            maestros y auditoría.
          </p>
        </div>

        <button
          onClick={createBackup}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl shadow text-lg font-bold"
        >
          Generar Backup
        </button>
      </div>

      <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-8 font-semibold">
        {message}
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="border rounded-xl p-5">
          <div className="text-sm text-slate-500">Salud del sistema</div>
          <div className={`text-5xl font-bold mt-2 ${scoreColor}`}>
            {score}%
          </div>
        </div>

        <div className="border rounded-xl p-5">
          <div className="text-sm text-slate-500">Módulos OK</div>
          <div className="text-4xl font-bold text-green-600 mt-2">
            {health?.modulesOk || 0}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            de {health?.totalModules || 0}
          </div>
        </div>

        <div className="border rounded-xl p-5">
          <div className="text-sm text-slate-500">Errores</div>
          <div className="text-4xl font-bold text-red-600 mt-2">
            {health?.modulesFailed || 0}
          </div>
        </div>

        <div className="border rounded-xl p-5">
          <div className="text-sm text-slate-500">Registros totales</div>
          <div className="text-4xl font-bold text-slate-800 mt-2">
            {health?.totalRecords || 0}
          </div>
        </div>
      </div>

      {backupSummary && (
        <div className="border rounded-2xl p-6 mb-8 bg-slate-50">
          <h3 className="text-2xl font-bold text-slate-800 mb-5">
            Resumen del backup
          </h3>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="border rounded-xl p-4 bg-white">
              <div className="text-sm text-slate-500">App</div>
              <div className="font-bold text-slate-800 mt-1">
                {backupSummary.app}
              </div>
            </div>

            <div className="border rounded-xl p-4 bg-white">
              <div className="text-sm text-slate-500">Motor</div>
              <div className="font-bold text-slate-800 mt-1">
                {backupSummary.engine}
              </div>
            </div>

            <div className="border rounded-xl p-4 bg-white">
              <div className="text-sm text-slate-500">Total registros</div>
              <div className="font-bold text-slate-800 mt-1">
                {backupSummary.totalRecords}
              </div>
            </div>

            <div className="border rounded-xl p-4 bg-white">
              <div className="text-sm text-slate-500">Generado</div>
              <div className="font-bold text-slate-800 mt-1">
                {new Date(backupSummary.generatedAt).toLocaleString("es-CO")}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {Object.entries(backupSummary.counts).map(([key, value]) => (
              <div key={key} className="border rounded-xl p-4 bg-white">
                <div className="text-sm text-slate-500 capitalize">{key}</div>
                <div className="text-3xl font-bold text-slate-800 mt-1">
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-4 py-3 text-sm text-slate-600">Módulo</th>
              <th className="px-4 py-3 text-sm text-slate-600">Estado</th>
              <th className="px-4 py-3 text-sm text-slate-600">Registros</th>
              <th className="px-4 py-3 text-sm text-slate-600">Error</th>
            </tr>
          </thead>

          <tbody>
            {health?.checks.map((check) => (
              <tr key={check.label} className="border-t">
                <td className="px-4 py-3 font-semibold text-slate-800">
                  {check.label}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-sm font-bold ${
                      check.ok
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {check.ok ? "OK" : "ERROR"}
                  </span>
                </td>

                <td className="px-4 py-3 text-slate-700">{check.count}</td>

                <td className="px-4 py-3 text-red-600">
                  {check.error || "-"}
                </td>
              </tr>
            ))}

            {!health && (
              <tr>
                <td className="px-4 py-8 text-center text-slate-500" colSpan={4}>
                  Cargando verificación...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
