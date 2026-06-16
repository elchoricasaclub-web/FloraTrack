from pathlib import Path
from datetime import datetime
import shutil
import re

ROOT = Path.cwd()
STAMP = datetime.now().strftime("%Y%m%d-%H%M%S")
BACKUP_DIR = Path("/home/usergrowlifecol/floratrack_backups") / f"patch-riesgos-workflows-{STAMP}"

RIESGOS = ROOT / "src/app/riesgos/page.tsx"
WORKFLOWS = ROOT / "src/app/workflows/page.tsx"
AVANCE = ROOT / "AVANCE_FLORATRACK.md"
HANDOFF = ROOT / "CHATGPT_HANDOFF_FLORATRACK.md"

def backup(path: Path) -> None:
    BACKUP_DIR.mkdir(parents=True, exist_ok=True)
    if path.exists():
        shutil.copy2(path, BACKUP_DIR / path.name)

def insert_after_button_label(source: str, label: str, insertion: str) -> str:
    index = source.find(label)
    if index == -1:
        raise SystemExit(f"ERROR: no encontre el boton con texto: {label}")

    end = source.find("</button>", index)
    if end == -1:
        raise SystemExit(f"ERROR: no encontre cierre de boton para: {label}")

    end += len("</button>")
    return source[:end] + "\n" + insertion + source[end:]

def replace_first(source: str, old: str, new: str, label: str) -> str:
    if old not in source:
        raise SystemExit(f"ERROR: no encontre bloque para {label}")
    return source.replace(old, new, 1)

for path in [RIESGOS, WORKFLOWS, AVANCE, HANDOFF]:
    backup(path)

riesgos = RIESGOS.read_text()
workflows = WORKFLOWS.read_text()

# ---------------------------------------------------------------------
# 1) /riesgos: constante puente hacia workflows
# ---------------------------------------------------------------------

if "floratrack_bridge_riesgos_to_workflows_v1" not in riesgos:
    if 'const RISK_DRAFT_KEY = "floratrack_bridge_cambios_to_riesgos_v1";' in riesgos:
        riesgos = riesgos.replace(
            'const RISK_DRAFT_KEY = "floratrack_bridge_cambios_to_riesgos_v1";\n',
            'const RISK_DRAFT_KEY = "floratrack_bridge_cambios_to_riesgos_v1";\nconst WORKFLOW_DRAFT_KEY = "floratrack_bridge_riesgos_to_workflows_v1";\n',
            1,
        )
    else:
        riesgos = riesgos.replace(
            'const STORAGE_KEY = "floratrack_gestion_riesgos_gxp_v1";\n',
            'const STORAGE_KEY = "floratrack_gestion_riesgos_gxp_v1";\nconst WORKFLOW_DRAFT_KEY = "floratrack_bridge_riesgos_to_workflows_v1";\n',
            1,
        )

# ---------------------------------------------------------------------
# 2) /riesgos: helpers completos para construir workflow desde riesgo
# ---------------------------------------------------------------------

riesgos_helpers = r'''
function bridgeRiskClean(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function bridgeRiskNumber(value: unknown): number {
  const parsed = Number(bridgeRiskClean(value));
  return Number.isFinite(parsed) ? parsed : 0;
}

function workflowPriorityFromRisk(record: RiskRecord): string {
  const level = bridgeRiskClean(record.nivelRiesgo).toLowerCase();
  const rpn = bridgeRiskNumber(record.rpnCalculado);

  if (level.includes("crit") || rpn >= 75) return "Crítica";
  if (level.includes("alto") || rpn >= 40) return "Alta";
  if (level.includes("medio") || rpn >= 15) return "Media";
  return "Baja";
}

function workflowTypeFromRisk(record: RiskRecord): string {
  const level = bridgeRiskClean(record.nivelRiesgo).toLowerCase();
  const decision = bridgeRiskClean(record.decisionQA).toLowerCase();
  const capa = bridgeRiskClean(record.requiereCAPA).toLowerCase();

  if (level.includes("crit") || decision.includes("escalamiento")) return "Escalamiento crítico";
  if (capa === "sí" || capa === "si" || decision.includes("capa")) return "Cierre CAPA";
  return "Revisión QA";
}

function workflowSlaFromRisk(record: RiskRecord): string {
  const priority = workflowPriorityFromRisk(record);

  if (priority === "Crítica") return "24";
  if (priority === "Alta") return "48";
  if (priority === "Media") return "120";
  return "240";
}

function workflowDeadlineFromRisk(record: RiskRecord): string {
  const explicitDate = bridgeRiskClean(record.fechaObjetivo);
  if (explicitDate) return explicitDate;

  const date = new Date();
  const priority = workflowPriorityFromRisk(record);
  date.setDate(date.getDate() + (priority === "Crítica" ? 1 : priority === "Alta" ? 2 : 7));

  return date.toISOString().slice(0, 10);
}

function workflowModuleFromRisk(record: RiskRecord): string {
  const text = `${bridgeRiskClean(record.tipoRiesgo)} ${bridgeRiskClean(record.moduloRelacionado)} ${bridgeRiskClean(record.areaProceso)}`.toLowerCase();

  if (text.includes("regulatorio") || text.includes("ica") || text.includes("invima") || text.includes("dian")) return "Regulatorio";
  if (text.includes("proveedor")) return "Proveedores";
  if (text.includes("entrenamiento")) return "Entrenamiento";
  if (text.includes("document")) return "Documentos";
  if (text.includes("part 11")) return "Part 11";
  if (text.includes("backup")) return "Backups";
  if (text.includes("integracion") || text.includes("integración") || text.includes("api")) return "Integraciones";
  if (text.includes("capa") || text.includes("desviacion") || text.includes("desviación")) return "Desviaciones / CAPA";

  return "Calidad QA";
}

function workflowAreaFromRisk(record: RiskRecord): string {
  const area = bridgeRiskClean(record.areaProceso);
  const normalized = area.toLowerCase();

  if (normalized.includes("regulatorio")) return "Regulatorio";
  if (normalized.includes("qc")) return "QC";
  if (normalized.includes("ti") || normalized.includes("valid")) return "TI / Validación";
  if (normalized.includes("proveedor")) return "Proveedores";
  if (normalized.includes("cultivo")) return "Cultivo";
  if (normalized.includes("cosecha")) return "Cosecha";
  if (normalized.includes("extraccion") || normalized.includes("extracción")) return "Extracción";
  if (normalized.includes("document")) return "Documentación";

  return "QA";
}

function buildWorkflowDraftFromRisk(record: RiskRecord): Record<string, string> {
  const sourceCode = bridgeRiskClean(record.codigoRiesgo) || `RISK-${new Date().toISOString().slice(0, 10)}`;
  const now = new Date();
  const priority = workflowPriorityFromRisk(record);
  const decision = bridgeRiskClean(record.decisionQA).toLowerCase();
  const capa = bridgeRiskClean(record.requiereCAPA).toLowerCase();
  const requiresEscalation = priority === "Crítica" || priority === "Alta" || decision.includes("escalamiento");
  const requiresSignature =
    priority === "Crítica" ||
    priority === "Alta" ||
    decision.includes("aprobado") ||
    decision.includes("aceptado") ||
    decision.includes("cierre");
  const capaRequired = capa === "sí" || capa === "si" || decision.includes("capa");

  return {
    codigoWorkflow: `WF-${sourceCode}`,
    fechaCreacion: now.toISOString().slice(0, 10),
    horaCreacion: now.toISOString().slice(11, 16),
    empresa: bridgeRiskClean(record.empresa),
    sede: bridgeRiskClean(record.sede),
    moduloOrigen: workflowModuleFromRisk(record),
    registroAsociado: sourceCode,
    tipoWorkflow: workflowTypeFromRisk(record),
    etapaActual: "Creado",
    prioridad: priority,
    responsableAsignado: bridgeRiskClean(record.responsableMitigacion) || "Responsable pendiente",
    areaResponsable: workflowAreaFromRisk(record),
    aprobadorQA: "QA pendiente",
    responsableTecnico: bridgeRiskClean(record.responsableMitigacion) || bridgeRiskClean(record.areaProceso) || "Responsable técnico pendiente",
    fechaLimite: workflowDeadlineFromRisk(record),
    slaHoras: workflowSlaFromRisk(record),
    estadoWorkflow: "Abierto",
    requiereFirmaElectronica: requiresSignature ? "Sí" : "No",
    firmaAsociada: requiresSignature ? `SIG-${sourceCode}` : "",
    requiereEscalamiento: requiresEscalation ? "Sí" : "No",
    escaladoA: requiresEscalation ? "QA Manager / Dirección técnica" : "",
    motivoWorkflow: `Workflow QA generado desde riesgo ${sourceCode}. Mitigación: ${bridgeRiskClean(record.planMitigacion) || "pendiente"}. Consecuencia: ${bridgeRiskClean(record.consecuenciaPotencial) || "pendiente"}.`,
    decisionQA: "Pendiente QA",
    auditTrailReferencia: `AUDIT-WF-${sourceCode}`,
    evidencia: bridgeRiskClean(record.evidencia),
    desviacionAsociada: bridgeRiskClean(record.desviacionAsociada),
    capa: bridgeRiskClean(record.capa) || (capaRequired ? "Definir CAPA asociada a mitigación del riesgo antes del cierre." : ""),
    observaciones: `Borrador importado desde Gestión de Riesgos. RPN ${bridgeRiskClean(record.rpnCalculado) || "pendiente"}; nivel ${bridgeRiskClean(record.nivelRiesgo) || "pendiente"}. Revisar responsables, SLA, firma, escalamiento y evidencia antes de guardar.`,
  };
}
'''

if "function buildWorkflowDraftFromRisk" not in riesgos:
    if "function loadRiskDraftFromChange" in riesgos:
        riesgos = riesgos.replace("function loadRiskDraftFromChange", riesgos_helpers + "\nfunction loadRiskDraftFromChange", 1)
    else:
        riesgos = riesgos.replace("export default function RiesgosPage()", riesgos_helpers + "\nexport default function RiesgosPage()", 1)

# ---------------------------------------------------------------------
# 3) /riesgos: handler para mandar borrador a /workflows
# ---------------------------------------------------------------------

riesgos_handler = r'''
  function handleCreateWorkflowDraft(record: RiskRecord, redirect = false) {
    if (typeof window === "undefined") return;

    if (!bridgeRiskClean(record.codigoRiesgo) && !bridgeRiskClean(record.descripcionRiesgo)) {
      showCloud("No se creó workflow. Registra al menos código o descripción del riesgo.", [], "warning");
      return;
    }

    const draft = buildWorkflowDraftFromRisk(record);
    window.localStorage.setItem(WORKFLOW_DRAFT_KEY, JSON.stringify(draft));

    if (redirect) {
      window.location.href = "/workflows";
      return;
    }

    showCloud(
      "Borrador de workflow QA creado para /workflows.",
      [`Workflow sugerido: ${draft.codigoWorkflow}`, `Prioridad sugerida: ${draft.prioridad}`, "Abre /workflows para revisar y guardar."],
      "success"
    );
  }
'''

if "function handleCreateWorkflowDraft" not in riesgos:
    if "  function exportJson()" in riesgos:
        riesgos = riesgos.replace("  function exportJson()", riesgos_handler + "\n  function exportJson()", 1)
    else:
        riesgos = riesgos.replace("  function resetForm()", riesgos_handler + "\n  function resetForm()", 1)

# ---------------------------------------------------------------------
# 4) /riesgos: botón completo en formulario
# ---------------------------------------------------------------------

risk_button = '''              <button type="button" onClick={() => handleCreateWorkflowDraft(form, true)} className="rounded-2xl border border-violet-300/50 px-6 py-3 text-sm font-black text-violet-100 transition hover:bg-violet-950/60">
                Enviar a Workflow QA
              </button>'''

if "Enviar a Workflow QA" not in riesgos:
    riesgos = insert_after_button_label(riesgos, "Limpiar formulario", risk_button)

# ---------------------------------------------------------------------
# 5) /workflows: constante puente
# ---------------------------------------------------------------------

if "floratrack_bridge_riesgos_to_workflows_v1" not in workflows:
    workflows = workflows.replace(
        'const STORAGE_KEY = "floratrack_workflows_qa_v1";\n',
        'const STORAGE_KEY = "floratrack_workflows_qa_v1";\nconst WORKFLOW_DRAFT_KEY = "floratrack_bridge_riesgos_to_workflows_v1";\n',
        1,
    )

# ---------------------------------------------------------------------
# 6) /workflows: loader del borrador importado desde riesgos
# ---------------------------------------------------------------------

workflow_loader = r'''
function loadWorkflowDraftFromRisk(): Partial<WorkflowRecord> | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(WORKFLOW_DRAFT_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;

    const source = parsed as Record<string, unknown>;
    const draft: Partial<WorkflowRecord> = {};

    (Object.keys(emptyForm) as Array<keyof WorkflowRecord>).forEach((field) => {
      const value = source[field];
      if (typeof value === "string") draft[field] = value;
    });

    return Object.keys(draft).length > 0 ? draft : null;
  } catch {
    return null;
  }
}
'''

if "function loadWorkflowDraftFromRisk" not in workflows:
    workflows = workflows.replace("export default function WorkflowsPage()", workflow_loader + "\nexport default function WorkflowsPage()", 1)

# ---------------------------------------------------------------------
# 7) /workflows: importar borrador al cargar
# ---------------------------------------------------------------------

old_effect = '''  useEffect(() => {
    setRecords(loadRecords());
  }, []);'''

new_effect = '''  useEffect(() => {
    setRecords(loadRecords());

    const draft = loadWorkflowDraftFromRisk();
    if (!draft) return;

    setForm((current) => ({
      ...current,
      ...draft,
      id: "",
      creadoEn: "",
      actualizadoEn: "",
    }));

    window.localStorage.removeItem(WORKFLOW_DRAFT_KEY);
    showCloud(
      "Borrador importado desde Gestión de Riesgos.",
      ["Revisa responsables, SLA, firma, escalamiento, evidencia y decisión QA antes de guardar."],
      "success"
    );
  }, []);'''

if "Borrador importado desde Gestión de Riesgos" not in workflows:
    if old_effect in workflows:
        workflows = workflows.replace(old_effect, new_effect, 1)
    else:
        pattern = re.compile(r"  useEffect\(\(\) => \{\n\s*setRecords\(loadRecords\(\)\);\n\s*\}, \[\]\);")
        workflows, count = pattern.subn(new_effect, workflows, count=1)
        if count != 1:
            raise SystemExit("ERROR: no pude actualizar useEffect inicial en workflows")

# ---------------------------------------------------------------------
# 8) documentación
# ---------------------------------------------------------------------

avance_append = '''

## Puente Riesgos -> Workflows QA

Se agregó conexión local entre `/riesgos` y `/workflows`:
- `/riesgos` genera un borrador de workflow QA desde el formulario de riesgo.
- El borrador se guarda en `localStorage` con la clave `floratrack_bridge_riesgos_to_workflows_v1`.
- `/workflows` importa automáticamente el borrador, precarga el formulario y elimina la clave puente.
- El flujo sugiere prioridad, SLA, responsable, módulo origen, firma electrónica, escalamiento, CAPA y audit trail.
- No reemplaza la decisión QA formal: acelera la trazabilidad desde QRM hacia ejecución operativa.
'''

handoff_append = '''

## Puente Riesgos -> Workflows QA

En esta fase se conectó `/riesgos` con `/workflows` mediante borrador local:
- Emisor: `src/app/riesgos/page.tsx`.
- Receptor: `src/app/workflows/page.tsx`.
- Clave localStorage: `floratrack_bridge_riesgos_to_workflows_v1`.
- Botón agregado en `/riesgos`: `Enviar a Workflow QA`.
- `/workflows` importa el borrador y solicita revisión QA antes de guardar.
'''

if AVANCE.exists():
    avance = AVANCE.read_text()
    if "Puente Riesgos -> Workflows QA" not in avance:
        AVANCE.write_text(avance + avance_append)

if HANDOFF.exists():
    handoff = HANDOFF.read_text()
    if "Puente Riesgos -> Workflows QA" not in handoff:
        HANDOFF.write_text(handoff + handoff_append)

RIESGOS.write_text(riesgos)
WORKFLOWS.write_text(workflows)

print("PATCH COMPLETADO OK")
print(f"Backup creado en: {BACKUP_DIR}")
print("Archivos modificados:")
print("- src/app/riesgos/page.tsx")
print("- src/app/workflows/page.tsx")
print("- AVANCE_FLORATRACK.md")
print("- CHATGPT_HANDOFF_FLORATRACK.md")
