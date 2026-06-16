"use client";

import { useEffect, useMemo, useState } from "react";

type TabConfig = {
  model: string;
  title: string;
  description: string;
  fields: string[];
};

const tabs: TabConfig[] = [
  {
    model: "runtimes",
    title: "Runtime local",
    description: "Motores locales o privados: Ollama, LM Studio, servidor GPU, CPU local o endpoint interno.",
    fields: ["code", "runtimeName", "runtimeType", "deploymentMode", "endpointRef", "hardwareProfile", "dataBoundary", "operationalStatus", "status"],
  },
  {
    model: "models",
    title: "Modelos locales",
    description: "Modelos instalados localmente, familia, tamaño, caso de uso, privacidad y validación.",
    fields: ["code", "runtimeCode", "modelName", "modelFamily", "modelSize", "useCase", "privacyRating", "validationStatus", "status"],
  },
  {
    model: "corpus",
    title: "Corpus documental",
    description: "Documentos aprobados por tenant para RAG privado: SOP, normas, expedientes, COA y auditorías.",
    fields: ["code", "corpusName", "tenantCode", "domainArea", "documentTypes", "sensitivityLevel", "approvalStatus", "status"],
  },
  {
    model: "indexes",
    title: "Índices vectoriales",
    description: "Índices locales por corpus, modelo de embeddings, almacenamiento y política de actualización.",
    fields: ["code", "corpusCode", "indexName", "embeddingModel", "storageMode", "refreshPolicy", "indexingStatus", "status"],
  },
  {
    model: "embedding-jobs",
    title: "Jobs embeddings",
    description: "Trabajos de indexación, chunking, escaneo PII, alcance de fuente y estado.",
    fields: ["code", "corpusCode", "jobName", "sourceScope", "chunkingPolicy", "piiScanStatus", "jobStatus", "status"],
  },
  {
    model: "rag-pipelines",
    title: "Pipelines RAG",
    description: "Pipelines de consulta con recuperación, política de respuesta y revisión humana.",
    fields: ["code", "pipelineName", "runtimeCode", "indexCode", "retrievalPolicy", "answerPolicy", "humanReviewRequired", "validationStatus", "status"],
  },
  {
    model: "privacy-controls",
    title: "Controles privacidad",
    description: "Reglas que impiden fuga de datos, uso indebido, indexación no aprobada o respuestas no autorizadas.",
    fields: ["code", "controlName", "controlArea", "ruleText", "enforcementMode", "evidenceRequired", "ownerRole", "status"],
  },
  {
    model: "inference-tests",
    title: "Pruebas inferencia",
    description: "Pruebas para verificar comportamiento esperado, riesgos, hallazgos y aprobación.",
    fields: ["code", "pipelineCode", "testQuestion", "expectedBehavior", "actualBehavior", "riskFinding", "passFail", "reviewedBy", "status"],
  },
  {
    model: "deployment-plans",
    title: "Plan despliegue",
    description: "Infraestructura, seguridad, validación y fases para desplegar IA privada.",
    fields: ["code", "planName", "deploymentTarget", "infrastructureNeeds", "securityNeeds", "validationNeeds", "estimatedPhase", "ownerRole", "status"],
  },
  {
    model: "model-validation",
    title: "Validación modelo",
    description: "Validación del modelo/pipeline, dataset de prueba, criterios, limitaciones y aprobación.",
    fields: ["code", "modelCode", "validationScope", "testDataset", "acceptanceCriteria", "limitations", "approvalDecision", "approvedBy", "status"],
  },
];

function emptyForm(fields: string[]) {
  return fields.reduce((acc: Record<string, string>, field) => {
    acc[field] = "";
    return acc;
  }, {});
}

function label(field: string) {
  const labels: Record<string, string> = {
    code: "Código",
    runtimeName: "Runtime",
    runtimeType: "Tipo runtime",
    deploymentMode: "Modo despliegue",
    endpointRef: "Referencia endpoint",
    hardwareProfile: "Hardware",
    dataBoundary: "Límite de datos",
    operationalStatus: "Estado operación",
    status: "Estado",
    runtimeCode: "Runtime",
    modelName: "Modelo",
    modelFamily: "Familia",
    modelSize: "Tamaño",
    useCase: "Caso de uso",
    privacyRating: "Privacidad",
    validationStatus: "Validación",
    corpusName: "Corpus",
    tenantCode: "Tenant",
    domainArea: "Dominio",
    documentTypes: "Tipos documento",
    sensitivityLevel: "Sensibilidad",
    approvalStatus: "Aprobación",
    corpusCode: "Corpus",
    indexName: "Índice",
    embeddingModel: "Modelo embeddings",
    storageMode: "Almacenamiento",
    refreshPolicy: "Actualización",
    indexingStatus: "Indexación",
    jobName: "Job",
    sourceScope: "Alcance fuente",
    chunkingPolicy: "Chunking",
    piiScanStatus: "Escaneo PII",
    jobStatus: "Estado job",
    pipelineName: "Pipeline",
    indexCode: "Índice",
    retrievalPolicy: "Política recuperación",
    answerPolicy: "Política respuesta",
    humanReviewRequired: "Revisión humana",
    controlName: "Control",
    controlArea: "Área control",
    ruleText: "Regla",
    enforcementMode: "Modo exigencia",
    evidenceRequired: "Evidencia requerida",
    ownerRole: "Rol dueño",
    pipelineCode: "Pipeline",
    testQuestion: "Pregunta prueba",
    expectedBehavior: "Comportamiento esperado",
    actualBehavior: "Comportamiento real",
    riskFinding: "Hallazgo riesgo",
    passFail: "Pass/Fail",
    reviewedBy: "Revisado por",
    planName: "Plan",
    deploymentTarget: "Objetivo despliegue",
    infrastructureNeeds: "Infraestructura",
    securityNeeds: "Seguridad",
    validationNeeds: "Validación",
    estimatedPhase: "Fase estimada",
    modelCode: "Modelo",
    validationScope: "Alcance validación",
    testDataset: "Dataset prueba",
    acceptanceCriteria: "Criterios aceptación",
    limitations: "Limitaciones",
    approvalDecision: "Decisión aprobación",
    approvedBy: "Aprobado por",
  };

  return labels[field] || field;
}

function scoreColor(score: number) {
  if (score >= 90) return "text-green-600";
  if (score >= 75) return "text-amber-600";
  return "text-red-600";
}

export default function PrivateAiEnterpriseModule() {
  const [activeModel, setActiveModel] = useState("runtimes");
  const [records, setRecords] = useState<any[]>([]);
  const [dashboard, setDashboard] = useState<any | null>(null);
  const [message, setMessage] = useState("Cargando IA Privada Local...");
  const activeTab = useMemo(
    () => tabs.find((item) => item.model === activeModel) || tabs[0],
    [activeModel]
  );
  const [form, setForm] = useState<Record<string, string>>(emptyForm(activeTab.fields));

  async function loadDashboard() {
    try {
      const response = await fetch("/api/enterprise/private-ai", {
        cache: "no-store",
      });

      const result = await response.json();

      if (result.ok) {
        setDashboard(result);
      }
    } catch {}
  }

  async function loadData(model = activeModel) {
    try {
      const response = await fetch(`/api/enterprise/private-ai/${model}`, {
        cache: "no-store",
      });

      const result = await response.json();

      if (!result.ok) {
        setMessage(result.error || "Error cargando registros.");
        setRecords([]);
        return;
      }

      setRecords(result.data || []);
      setMessage("Registros cargados correctamente.");
      loadDashboard();
    } catch {
      setMessage("No se pudo conectar IA Privada Local.");
      setRecords([]);
    }
  }

  async function createRecord() {
    try {
      const response = await fetch(`/api/enterprise/private-ai/${activeModel}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!result.ok) {
        setMessage(result.error || "Error creando registro.");
        return;
      }

      setForm(emptyForm(activeTab.fields));
      setMessage("Registro creado correctamente.");
      loadData(activeModel);
    } catch {
      setMessage("No se pudo crear el registro.");
    }
  }

  useEffect(() => {
    const tab = tabs.find((item) => item.model === activeModel) || tabs[0];
    setForm(emptyForm(tab.fields));
    loadData(activeModel);
  }, [activeModel]);

  return (
    <section className="bg-white rounded-2xl shadow p-8">
      <div className="flex justify-between items-start gap-6 mb-8">
        <div>
          <div className="text-sm font-black text-green-600 mb-2">
            FloraTrack Enterprise
          </div>

          <h2 className="text-5xl font-black text-slate-800">
            IA Privada Local
          </h2>

          <p className="text-slate-500 mt-3 max-w-5xl leading-relaxed">
            Arquitectura para operar IA sin enviar datos sensibles a terceros:
            runtime local, modelos privados, corpus documental por tenant,
            índices vectoriales, RAG privado, controles de privacidad, pruebas
            de inferencia, plan de despliegue y validación del modelo.
          </p>
        </div>

        <button
          onClick={() => {
            loadDashboard();
            loadData(activeModel);
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl shadow text-lg font-bold"
        >
          Actualizar
        </button>
      </div>

      <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-8 font-semibold">
        {message}
      </div>

      {dashboard && (
        <>
          <div className="grid grid-cols-6 gap-4 mb-8">
            <div className="border rounded-xl p-5">
              <div className="text-sm text-slate-500">Private AI</div>
              <div className={`text-5xl font-black mt-2 ${scoreColor(dashboard.readiness)}`}>
                {dashboard.readiness}%
              </div>
            </div>

            <div className="border rounded-xl p-5">
              <div className="text-sm text-slate-500">Runtimes</div>
              <div className="text-5xl font-black text-slate-800 mt-2">
                {dashboard.counters.runtimes}
              </div>
            </div>

            <div className="border rounded-xl p-5">
              <div className="text-sm text-slate-500">Modelos</div>
              <div className="text-5xl font-black text-slate-800 mt-2">
                {dashboard.counters.models}
              </div>
            </div>

            <div className="border rounded-xl p-5">
              <div className="text-sm text-slate-500">Corpus</div>
              <div className="text-5xl font-black text-slate-800 mt-2">
                {dashboard.counters.corpus}
              </div>
            </div>

            <div className="border rounded-xl p-5">
              <div className="text-sm text-slate-500">RAG pendiente</div>
              <div className="text-5xl font-black text-amber-600 mt-2">
                {dashboard.alerts.pipelinePending}
              </div>
            </div>

            <div className="border rounded-xl p-5">
              <div className="text-sm text-slate-500">Validación</div>
              <div className="text-5xl font-black text-red-600 mt-2">
                {dashboard.alerts.validationPending}
              </div>
            </div>
          </div>

          <div className="border rounded-2xl p-6 mb-8 bg-slate-50">
            <h3 className="text-2xl font-black text-slate-800 mb-5">
              Decisión de arquitectura privada
            </h3>

            <div className="grid grid-cols-1 gap-3">
              {dashboard.architectureDecision.map((item: string) => (
                <div key={item} className="bg-white border rounded-xl p-4 text-slate-600">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3 border rounded-2xl p-4 bg-slate-50">
          <h3 className="text-xl font-black text-slate-800 mb-4">
            Private AI Stack
          </h3>

          <div className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.model}
                onClick={() => setActiveModel(tab.model)}
                className={`w-full text-left rounded-xl border p-4 ${
                  activeModel === tab.model
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-slate-700"
                }`}
              >
                <div className="font-black">{tab.title}</div>
                <div className={`text-xs mt-1 leading-relaxed ${
                  activeModel === tab.model ? "text-green-50" : "text-slate-500"
                }`}>
                  {tab.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="col-span-9 space-y-6">
          <div className="border rounded-2xl p-6">
            <h3 className="text-2xl font-black text-slate-800">
              Crear registro — {activeTab.title}
            </h3>

            <p className="text-slate-500 mt-2">
              {activeTab.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mt-6">
              {activeTab.fields.map((field) => (
                <div key={field}>
                  <label className="block text-sm font-bold text-slate-600 mb-2">
                    {label(field)}
                  </label>

                  <textarea
                    value={form[field] || ""}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        [field]: event.target.value,
                      }))
                    }
                    className="w-full border rounded-xl px-4 py-3 min-h-[48px]"
                    placeholder={label(field)}
                  />
                </div>
              ))}
            </div>

            <button
              onClick={createRecord}
              className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl shadow font-black"
            >
              Crear registro
            </button>
          </div>

          <div className="border rounded-2xl p-6">
            <h3 className="text-2xl font-black text-slate-800 mb-5">
              Registros — {activeTab.title}
            </h3>

            {records.length === 0 && (
              <div className="bg-slate-50 border rounded-xl p-8 text-slate-500">
                No hay registros todavía en este submódulo.
              </div>
            )}

            <div className="space-y-4">
              {records.map((record) => (
                <div key={record.id} className="border rounded-xl p-5">
                  <div className="flex justify-between gap-4">
                    <div>
                      <div className="text-sm font-black text-green-600">
                        {record.code}
                      </div>

                      <h4 className="text-xl font-black text-slate-800 mt-1">
                        {record.runtimeName ||
                          record.modelName ||
                          record.corpusName ||
                          record.indexName ||
                          record.jobName ||
                          record.pipelineName ||
                          record.controlName ||
                          record.planName ||
                          "Registro IA privada"}
                      </h4>

                      <p className="text-sm text-slate-500 mt-2">
                        {record.dataBoundary ||
                          record.useCase ||
                          record.domainArea ||
                          record.ruleText ||
                          record.infrastructureNeeds ||
                          ""}
                      </p>
                    </div>

                    <span className="text-xs h-fit px-3 py-2 rounded-full bg-green-100 text-green-700 font-black">
                      {record.status || record.validationStatus || "Activo"}
                    </span>
                  </div>

                  <details className="mt-4">
                    <summary className="cursor-pointer font-bold text-slate-700">
                      Ver datos completos
                    </summary>

                    <pre className="bg-slate-950 text-green-100 rounded-xl p-4 mt-3 text-xs overflow-auto">
                      {JSON.stringify(record, null, 2)}
                    </pre>
                  </details>
                </div>
              ))}
            </div>
          </div>

          {dashboard && (
            <div className="border rounded-2xl p-6 bg-slate-50">
              <h3 className="text-2xl font-black text-slate-800 mb-5">
                Recomendaciones IA Privada
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {dashboard.recommendations.map((item: string) => (
                  <div key={item} className="bg-white border rounded-xl p-4 text-slate-600">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
