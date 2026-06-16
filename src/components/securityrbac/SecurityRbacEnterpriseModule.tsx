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
    model: "roles",
    title: "Roles",
    description: "Plantillas de roles GxP: QA, laboratorio, GACP, GMP, auditor, admin SaaS y operario.",
    fields: ["code", "roleName", "roleCategory", "description", "defaultScope", "riskLevel", "status"],
  },
  {
    model: "permissions",
    title: "Matriz permisos",
    description: "Permisos por rol, módulo, nivel de acceso, firma requerida y riesgo de segregación.",
    fields: ["code", "roleCode", "moduleName", "permissionSet", "accessLevel", "requiresSignature", "segregationRisk", "status"],
  },
  {
    model: "assignments",
    title: "Asignación usuarios",
    description: "Asignación de usuarios a roles por tenant, sede, módulo y verificación de entrenamiento.",
    fields: ["code", "tenantCode", "userEmail", "roleCode", "siteScope", "moduleScope", "assignedBy", "assignmentDate", "trainingVerified", "status"],
  },
  {
    model: "reviews",
    title: "Revisión accesos",
    description: "Revisión periódica de accesos, hallazgos, acciones y cierre.",
    fields: ["code", "tenantCode", "reviewName", "reviewPeriod", "reviewer", "findings", "actionsRequired", "reviewStatus", "status"],
  },
  {
    model: "signatures",
    title: "Firma electrónica",
    description: "Políticas de firma por módulo, razón, rol requerido, significado y segundo factor.",
    fields: ["code", "policyName", "applicableModule", "signatureReason", "requiredRole", "meaningOfSignature", "secondFactorRequired", "status"],
  },
  {
    model: "mfa",
    title: "MFA",
    description: "Políticas de autenticación multifactor por tenant y roles críticos.",
    fields: ["code", "tenantCode", "policyName", "requiredForRoles", "enforcementMode", "exceptionAllowed", "status"],
  },
  {
    model: "sessions",
    title: "Sesiones",
    description: "Timeout, restricción IP, dispositivos autorizados y política de sesión.",
    fields: ["code", "tenantCode", "sessionPolicy", "timeoutMinutes", "ipRestriction", "deviceRestriction", "status"],
  },
  {
    model: "segregation",
    title: "Segregación funciones",
    description: "Reglas para evitar conflictos entre creación, aprobación, liberación, auditoría y administración.",
    fields: ["code", "ruleName", "conflictingRoles", "conflictingActions", "riskDescription", "mitigationControl", "status"],
  },
  {
    model: "exceptions",
    title: "Excepciones",
    description: "Solicitudes temporales de acceso, justificación, aprobación, vencimiento y cierre.",
    fields: ["code", "tenantCode", "userEmail", "requestedAccess", "justification", "approvedBy", "expiryDate", "exceptionStatus", "status"],
  },
  {
    model: "control-tests",
    title: "Pruebas control",
    description: "Pruebas de controles de seguridad, evidencia, resultado y responsable.",
    fields: ["code", "controlName", "testObjective", "testResult", "evidence", "testedBy", "testDate", "status"],
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
    roleName: "Nombre rol",
    roleCategory: "Categoría rol",
    description: "Descripción",
    defaultScope: "Alcance por defecto",
    riskLevel: "Riesgo",
    status: "Estado",
    roleCode: "Código rol",
    moduleName: "Módulo",
    permissionSet: "Permisos",
    accessLevel: "Nivel acceso",
    requiresSignature: "Requiere firma",
    segregationRisk: "Riesgo segregación",
    tenantCode: "Tenant",
    userEmail: "Email usuario",
    siteScope: "Alcance sede",
    moduleScope: "Alcance módulo",
    assignedBy: "Asignado por",
    assignmentDate: "Fecha asignación",
    trainingVerified: "Entrenamiento verificado",
    reviewName: "Revisión",
    reviewPeriod: "Periodo",
    reviewer: "Revisor",
    findings: "Hallazgos",
    actionsRequired: "Acciones requeridas",
    reviewStatus: "Estado revisión",
    policyName: "Política",
    applicableModule: "Módulo aplicable",
    signatureReason: "Razón firma",
    requiredRole: "Rol requerido",
    meaningOfSignature: "Significado firma",
    secondFactorRequired: "Segundo factor",
    requiredForRoles: "Roles requeridos",
    enforcementMode: "Modo exigencia",
    exceptionAllowed: "Permite excepción",
    sessionPolicy: "Política sesión",
    timeoutMinutes: "Timeout minutos",
    ipRestriction: "Restricción IP",
    deviceRestriction: "Restricción dispositivo",
    ruleName: "Regla",
    conflictingRoles: "Roles conflictivos",
    conflictingActions: "Acciones conflictivas",
    riskDescription: "Descripción riesgo",
    mitigationControl: "Control mitigante",
    requestedAccess: "Acceso solicitado",
    justification: "Justificación",
    approvedBy: "Aprobado por",
    expiryDate: "Vencimiento",
    exceptionStatus: "Estado excepción",
    controlName: "Control",
    testObjective: "Objetivo prueba",
    testResult: "Resultado prueba",
    evidence: "Evidencia",
    testedBy: "Probado por",
    testDate: "Fecha prueba",
  };

  return labels[field] || field;
}

function scoreColor(score: number) {
  if (score >= 90) return "text-green-600";
  if (score >= 75) return "text-amber-600";
  return "text-red-600";
}

export default function SecurityRbacEnterpriseModule() {
  const [activeModel, setActiveModel] = useState("roles");
  const [records, setRecords] = useState<any[]>([]);
  const [dashboard, setDashboard] = useState<any | null>(null);
  const [message, setMessage] = useState("Cargando Seguridad RBAC...");
  const activeTab = useMemo(
    () => tabs.find((item) => item.model === activeModel) || tabs[0],
    [activeModel]
  );
  const [form, setForm] = useState<Record<string, string>>(emptyForm(activeTab.fields));

  async function loadDashboard() {
    try {
      const response = await fetch("/api/enterprise/security-rbac", {
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
      const response = await fetch(`/api/enterprise/security-rbac/${model}`, {
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
      setMessage("No se pudo conectar Seguridad RBAC.");
      setRecords([]);
    }
  }

  async function createRecord() {
    try {
      const response = await fetch(`/api/enterprise/security-rbac/${activeModel}`, {
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
            Seguridad, Roles y Permisos
          </h2>

          <p className="text-slate-500 mt-3 max-w-5xl leading-relaxed">
            Capa enterprise para RBAC, permisos por módulo, asignación de
            usuarios, revisión periódica de accesos, MFA, firma electrónica,
            segregación de funciones, excepciones y pruebas de control.
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
        <div className="grid grid-cols-6 gap-4 mb-8">
          <div className="border rounded-xl p-5">
            <div className="text-sm text-slate-500">Security readiness</div>
            <div className={`text-5xl font-black mt-2 ${scoreColor(dashboard.readiness)}`}>
              {dashboard.readiness}%
            </div>
          </div>

          <div className="border rounded-xl p-5">
            <div className="text-sm text-slate-500">Roles</div>
            <div className="text-5xl font-black text-slate-800 mt-2">
              {dashboard.counters.roles}
            </div>
          </div>

          <div className="border rounded-xl p-5">
            <div className="text-sm text-slate-500">Permisos</div>
            <div className="text-5xl font-black text-slate-800 mt-2">
              {dashboard.counters.permissions}
            </div>
          </div>

          <div className="border rounded-xl p-5">
            <div className="text-sm text-slate-500">Entrenamiento pend.</div>
            <div className="text-5xl font-black text-amber-600 mt-2">
              {dashboard.alerts.trainingPending}
            </div>
          </div>

          <div className="border rounded-xl p-5">
            <div className="text-sm text-slate-500">Revisión accesos</div>
            <div className="text-5xl font-black text-red-600 mt-2">
              {dashboard.alerts.accessReviewsPending}
            </div>
          </div>

          <div className="border rounded-xl p-5">
            <div className="text-sm text-slate-500">MFA pendiente</div>
            <div className="text-5xl font-black text-red-600 mt-2">
              {dashboard.alerts.mfaPending}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3 border rounded-2xl p-4 bg-slate-50">
          <h3 className="text-xl font-black text-slate-800 mb-4">
            Seguridad GxP
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
                        {record.roleName ||
                          record.moduleName ||
                          record.userEmail ||
                          record.reviewName ||
                          record.policyName ||
                          record.ruleName ||
                          record.requestedAccess ||
                          record.controlName ||
                          "Registro seguridad"}
                      </h4>

                      <p className="text-sm text-slate-500 mt-2">
                        {record.description ||
                          record.permissionSet ||
                          record.accessScope ||
                          record.signatureReason ||
                          record.riskDescription ||
                          ""}
                      </p>
                    </div>

                    <span className="text-xs h-fit px-3 py-2 rounded-full bg-green-100 text-green-700 font-black">
                      {record.status || record.reviewStatus || record.exceptionStatus || "Activo"}
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
                Recomendaciones RBAC / Data Integrity
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
