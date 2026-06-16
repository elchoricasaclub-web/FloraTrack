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
    model: "service-lines",
    title: "Líneas de servicio",
    description: "Catálogo maestro de servicios SaaS que FloraTrack puede ofrecer.",
    fields: ["code", "name", "category", "description", "targetIndustries", "maturityLevel", "status"],
  },
  {
    model: "capabilities",
    title: "Capacidades",
    description: "Capacidades funcionales que componen cada línea de servicio.",
    fields: ["serviceCode", "capabilityName", "moduleName", "processArea", "description", "priority", "status"],
  },
  {
    model: "regulatory-profiles",
    title: "Perfil regulatorio empresa",
    description: "Define qué puede hacer cada empresa según país, operación, licencia y producto.",
    fields: ["companyName", "country", "operationTypes", "licenseScope", "productScope", "riskLevel", "status"],
  },
  {
    model: "operation-scopes",
    title: "Alcances operativos",
    description: "Mapa de requisitos por tipo de operación, país, autoridad y estándar.",
    fields: ["operationType", "country", "requiredLicenses", "requiredCertifications", "requiredAuthorities", "applicableStandards", "status"],
  },
  {
    model: "standards",
    title: "Normas y certificaciones",
    description: "Catálogo internacional y nacional de normas, certificaciones, acreditaciones y guías.",
    fields: ["code", "name", "issuer", "jurisdiction", "standardType", "applicability", "mandatoryLevel", "status"],
  },
  {
    model: "requirements",
    title: "Matriz de requisitos",
    description: "Cláusulas y requisitos convertidos en evidencia auditable.",
    fields: ["standardCode", "clauseCode", "requirementText", "evidenceRequired", "sopRequired", "riskLevel", "responsibleRole", "status"],
  },
  {
    model: "evidence-vault",
    title: "Bóveda de evidencias",
    description: "Repositorio lógico de evidencias por empresa, requisito, responsable y aprobación.",
    fields: ["companyName", "requirementRef", "evidenceTitle", "evidenceType", "ownerRole", "approvalStatus", "storageRef", "status"],
  },
  {
    model: "checklist-templates",
    title: "Plantillas checklist",
    description: "Plantillas de auditoría por norma, operación, país y certificación.",
    fields: ["code", "name", "scope", "standardCode", "operationType", "status"],
  },
  {
    model: "checklist-questions",
    title: "Preguntas checklist",
    description: "Preguntas auditables conectadas a requisitos, evidencias y riesgos.",
    fields: ["templateCode", "questionText", "requirementRef", "evidenceExpected", "riskLevel", "orderNumber", "status"],
  },
  {
    model: "certification-plans",
    title: "Planes de certificación",
    description: "Roadmap de certificación por empresa, estándar, alcance, etapa y responsable.",
    fields: ["companyName", "certificationCode", "targetScope", "stage", "targetDate", "responsibleRole", "status"],
  },
  {
    model: "subscriptions",
    title: "Servicios por empresa",
    description: "Módulos y servicios habilitados por cliente SaaS.",
    fields: ["companyName", "serviceCode", "modulesEnabled", "countryScope", "status"],
  },
  {
    model: "jurisdiction-rules",
    title: "Reglas por jurisdicción",
    description: "Reglas normativas por país, autoridad, operación y nivel de obligatoriedad.",
    fields: ["country", "authority", "ruleCode", "ruleTitle", "operationType", "mandatoryLevel", "summary", "status"],
  },
];

function emptyForm(fields: string[]) {
  return fields.reduce((acc: Record<string, string>, field) => {
    acc[field] = "";
    return acc;
  }, {});
}

function fieldLabel(field: string) {
  const labels: Record<string, string> = {
    code: "Código",
    name: "Nombre",
    category: "Categoría",
    description: "Descripción",
    targetIndustries: "Industrias objetivo",
    maturityLevel: "Nivel de madurez",
    status: "Estado",
    serviceCode: "Código servicio",
    capabilityName: "Capacidad",
    moduleName: "Módulo",
    processArea: "Área de proceso",
    priority: "Prioridad",
    companyName: "Empresa",
    country: "País",
    operationTypes: "Tipos de operación",
    licenseScope: "Alcance licencia",
    productScope: "Alcance producto",
    riskLevel: "Nivel de riesgo",
    operationType: "Tipo de operación",
    requiredLicenses: "Licencias requeridas",
    requiredCertifications: "Certificaciones requeridas",
    requiredAuthorities: "Autoridades",
    applicableStandards: "Normas aplicables",
    issuer: "Emisor",
    jurisdiction: "Jurisdicción",
    standardType: "Tipo de estándar",
    applicability: "Aplicabilidad",
    mandatoryLevel: "Nivel obligatoriedad",
    standardCode: "Código norma",
    clauseCode: "Cláusula",
    requirementText: "Requisito",
    evidenceRequired: "Evidencia requerida",
    sopRequired: "SOP requerido",
    responsibleRole: "Rol responsable",
    requirementRef: "Referencia requisito",
    evidenceTitle: "Título evidencia",
    evidenceType: "Tipo evidencia",
    ownerRole: "Rol dueño",
    approvalStatus: "Estado aprobación",
    storageRef: "Referencia archivo",
    scope: "Alcance",
    questionText: "Pregunta",
    evidenceExpected: "Evidencia esperada",
    orderNumber: "Orden",
    certificationCode: "Código certificación",
    targetScope: "Alcance objetivo",
    stage: "Etapa",
    targetDate: "Fecha objetivo",
    modulesEnabled: "Módulos habilitados",
    countryScope: "Países",
    authority: "Autoridad",
    ruleCode: "Código regla",
    ruleTitle: "Título regla",
    summary: "Resumen",
  };

  return labels[field] || field;
}

function downloadJson(data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `floratrack_expansion_servicios_${new Date().toISOString().slice(0, 10)}.json`;
  link.click();

  URL.revokeObjectURL(url);
}

export default function ServiceExpansionModule() {
  const [activeModel, setActiveModel] = useState("service-lines");
  const [records, setRecords] = useState<any[]>([]);
  const [message, setMessage] = useState("Cargando expansión de servicios...");
  const activeTab = useMemo(
    () => tabs.find((item) => item.model === activeModel) || tabs[0],
    [activeModel]
  );
  const [form, setForm] = useState<Record<string, string>>(emptyForm(activeTab.fields));

  async function loadData(model = activeModel) {
    try {
      const response = await fetch(`/api/enterprise/service-expansion/${model}`, {
        cache: "no-store",
      });

      const result = await response.json();

      if (!result.ok) {
        setMessage(result.error || "Error cargando registros.");
        setRecords([]);
        return;
      }

      setRecords(result.data || []);
      setMessage("Datos cargados correctamente.");
    } catch {
      setMessage("No se pudo conectar la API de expansión.");
      setRecords([]);
    }
  }

  async function createRecord() {
    try {
      const response = await fetch(`/api/enterprise/service-expansion/${activeModel}`, {
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

  const totalRecords = records.length;

  return (
    <section className="bg-white rounded-2xl shadow p-8">
      <div className="flex justify-between items-start gap-6 mb-8">
        <div>
          <div className="text-sm font-black text-green-600 mb-2">
            FloraTrack Enterprise
          </div>

          <h2 className="text-5xl font-black text-slate-800">
            Expansión de Servicios
          </h2>

          <p className="text-slate-500 mt-3 max-w-5xl leading-relaxed">
            Núcleo SaaS para ampliar FloraTrack: líneas de servicio, perfiles
            regulatorios, normas, certificaciones, matriz de requisitos,
            evidencias, checklists, planes de certificación y reglas por país.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => downloadJson({ activeModel, records })}
            className="bg-white border px-6 py-4 rounded-xl font-bold text-slate-700"
          >
            Exportar JSON
          </button>

          <button
            onClick={() => loadData(activeModel)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl shadow text-lg font-bold"
          >
            Actualizar
          </button>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-8 font-semibold">
        {message}
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="border rounded-xl p-5">
          <div className="text-sm text-slate-500">Submódulos</div>
          <div className="text-5xl font-black text-slate-800 mt-2">
            {tabs.length}
          </div>
        </div>

        <div className="border rounded-xl p-5">
          <div className="text-sm text-slate-500">Registros actuales</div>
          <div className="text-5xl font-black text-green-600 mt-2">
            {totalRecords}
          </div>
        </div>

        <div className="border rounded-xl p-5">
          <div className="text-sm text-slate-500">Módulo activo</div>
          <div className="text-xl font-black text-slate-800 mt-4">
            {activeTab.title}
          </div>
        </div>

        <div className="border rounded-xl p-5">
          <div className="text-sm text-slate-500">Estado</div>
          <div className="text-3xl font-black text-green-600 mt-3">
            Enterprise Ready
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3 border rounded-2xl p-4 bg-slate-50">
          <h3 className="text-xl font-black text-slate-800 mb-4">
            Componentes
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
                    {fieldLabel(field)}
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
                    placeholder={fieldLabel(field)}
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
                        {record.code || record.companyName || record.serviceCode || record.standardCode || record.ruleCode || record.id}
                      </div>

                      <h4 className="text-xl font-black text-slate-800 mt-1">
                        {record.name ||
                          record.capabilityName ||
                          record.evidenceTitle ||
                          record.ruleTitle ||
                          record.questionText ||
                          record.requirementText ||
                          record.operationType ||
                          record.certificationCode ||
                          record.companyName ||
                          "Registro"}
                      </h4>

                      <p className="text-sm text-slate-500 mt-2">
                        {record.description ||
                          record.summary ||
                          record.applicability ||
                          record.productScope ||
                          record.licenseScope ||
                          record.evidenceRequired ||
                          ""}
                      </p>
                    </div>

                    <span className="text-xs h-fit px-3 py-2 rounded-full bg-green-100 text-green-700 font-black">
                      {record.status || record.approvalStatus || record.stage || "Activo"}
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
        </div>
      </div>
    </section>
  );
}
