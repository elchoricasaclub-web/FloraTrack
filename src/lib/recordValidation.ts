export type RequiredRule = {
  key: string;
  label: string;
  minNumber?: number;
  disallow?: string[];
};

const genericValues = [
  "nuevo registro",
  "nuevo registro floratrack",
  "responsable gacp",
  "usuario actual",
  "registro creado desde nuevo registro",
  "registro creado desde nuevo registro.",
  "registro creado desde el botón nuevo registro del dashboard.",
  "registro creado desde el boton nuevo registro del dashboard.",
  "registro creado desde el módulo cultivos.",
  "registro creado desde el modulo cultivos.",
  "registro creado desde el módulo propagación.",
  "registro creado desde el modulo propagacion.",
  "registro creado desde el módulo cosecha.",
  "registro creado desde el modulo cosecha.",
  "evidencia pendiente",
  "sin genética asignada",
  "sin genetica asignada",
  "cultivo sin asignar"
];

export function cleanValue(value: unknown) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

export function normalizeValue(value: unknown) {
  return cleanValue(value).toLowerCase();
}

export function validateRecord(source: Record<string, unknown>, rules: RequiredRule[]) {
  const missing: string[] = [];

  for (const rule of rules) {
    const rawValue = source[rule.key];
    const value = cleanValue(rawValue);
    const normalized = normalizeValue(rawValue);
    const disallowed = (rule.disallow ?? []).map((item) => item.toLowerCase());

    if (!value) {
      missing.push(rule.label);
      continue;
    }

    if (genericValues.includes(normalized) || disallowed.includes(normalized)) {
      missing.push(rule.label);
      continue;
    }

    if (typeof rule.minNumber === "number") {
      const numericValue = Number(rawValue);

      if (Number.isNaN(numericValue) || numericValue < rule.minNumber) {
        missing.push(rule.label);
      }
    }
  }

  return Array.from(new Set(missing));
}
