"use client";

import { useEffect } from "react";

function clean(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function normalize(value: string) {
  return clean(value).toLowerCase();
}

async function registerAuditTrailClick(sourceText: string) {
  try {
    await fetch("/api/button-actions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        label: sourceText || "Audit Trail",
        moduleName: "Dashboard",
        actionType: "navigation",
        route: "/audit-trail",
        note: "Botón Audit Trail conectado por puente directo"
      })
    });
  } catch {
    // No bloquea la navegación si el log falla.
  }
}

function goAuditTrail(sourceText: string) {
  registerAuditTrailClick(sourceText);
  window.location.assign("/audit-trail");
}

function isAuditTrailElement(element: Element | null) {
  if (!element) return false;

  const text = normalize(element.textContent || "");
  const aria = normalize(element.getAttribute("aria-label") || "");
  const title = normalize(element.getAttribute("title") || "");

  return (
    text.includes("audit trail") ||
    aria.includes("audit trail") ||
    title.includes("audit trail")
  );
}

function wireExistingAuditTrailElements() {
  const elements = Array.from(
    document.querySelectorAll("button, a, [role='button'], div, span")
  ) as HTMLElement[];

  for (const element of elements) {
    if (!isAuditTrailElement(element)) continue;

    element.style.cursor = "pointer";
    element.setAttribute("data-audit-trail-wired", "true");

    if (element instanceof HTMLAnchorElement) {
      element.href = "/audit-trail";
    }
  }
}

export default function AuditTrailButtonBridge() {
  useEffect(() => {
    wireExistingAuditTrailElements();

    const interval = window.setInterval(() => {
      wireExistingAuditTrailElements();
    }, 1000);

    function handleClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const clickable = target.closest("button, a, [role='button'], div, span");

      if (!isAuditTrailElement(clickable)) return;

      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      goAuditTrail(clean(clickable?.textContent || "Audit Trail"));
    }

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
      window.clearInterval(interval);
    };
  }, []);

  return null;
}
