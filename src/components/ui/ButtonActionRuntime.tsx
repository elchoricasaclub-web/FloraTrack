"use client";

import { useEffect } from "react";

function clean(value: string) {
  return value.replace(/\s+/g, " ").trim().toLowerCase();
}

export default function ButtonActionRuntime() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      if (target.closest("[data-runtime-ignore='true']")) return;
      if (target.closest("[data-system-dock-root='true']")) return;

      const element = target.closest("button, a, [role='button']") as HTMLElement | null;
      if (!element) return;

      const label = clean(
        element.textContent ||
        element.getAttribute("aria-label") ||
        element.getAttribute("title") ||
        ""
      );

      if (label === "nuevo registro" || label === "+ nuevo registro") {
        event.preventDefault();
        event.stopPropagation();
        window.location.href = "/new-record";
        return;
      }

      if (label.includes("audit trail")) {
        event.preventDefault();
        event.stopPropagation();
        window.location.href = "/audit-trail";
        return;
      }

      if (label.includes("ver registros") || label.includes("ver avances")) {
        event.preventDefault();
        event.stopPropagation();
        window.location.href = "/progress-records";
        return;
      }

      if (label.includes("ver detalle") || label.includes("ver riesgos") || label.includes("ver operaciones")) {
        event.preventDefault();
        event.stopPropagation();
        window.location.href = "/action-center";
        return;
      }

      if (label.includes("actualizar")) {
        event.preventDefault();
        event.stopPropagation();
        window.location.reload();
      }
    }

    document.addEventListener("click", onClick, true);

    return () => {
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  return null;
}
