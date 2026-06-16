"use client";

import { useEffect } from "react";

function isElement(value: unknown): value is HTMLElement {
  return value instanceof HTMLElement;
}

function textOf(element: Element): string {
  return [
    element.textContent || "",
    element.getAttribute("aria-label") || "",
    element.getAttribute("title") || "",
    element.id || "",
    element.className ? String(element.className) : "",
  ]
    .join(" ")
    .toLowerCase();
}

function isSmallBottomLeftFixed(element: Element): boolean {
  if (!isElement(element)) return false;

  const rect = element.getBoundingClientRect();

  if (rect.width <= 0 || rect.height <= 0) return false;
  if (rect.width > 280 || rect.height > 140) return false;

  const style = window.getComputedStyle(element);
  const isFixed = style.position === "fixed";
  const nearLeft = rect.left <= 160;
  const nearBottom = window.innerHeight - rect.bottom <= 160;

  return isFixed && nearLeft && nearBottom;
}

function looksLikeNextDevIndicator(element: Element): boolean {
  const content = textOf(element);

  const hasNextText =
    content.includes("estado app") ||
    content.includes("next.js") ||
    content.includes("nextjs") ||
    content.includes("dev tools") ||
    content.includes("devtools") ||
    content.includes("open next") ||
    content.includes("route indicator");

  return hasNextText && isSmallBottomLeftFixed(element);
}

function hideElement(element: Element) {
  if (!isElement(element)) return;

  element.style.setProperty("display", "none", "important");
  element.style.setProperty("visibility", "hidden", "important");
  element.style.setProperty("opacity", "0", "important");
  element.style.setProperty("pointer-events", "none", "important");
  element.setAttribute("aria-hidden", "true");
  element.setAttribute("data-floratrack-hidden-dev-indicator", "true");
}

function scanRoot(root: Document | ShadowRoot) {
  const elements = Array.from(root.querySelectorAll("*"));

  for (const element of elements) {
    if (looksLikeNextDevIndicator(element)) {
      hideElement(element);
    }

    const possibleShadowHost = element as HTMLElement & { shadowRoot?: ShadowRoot | null };

    if (possibleShadowHost.shadowRoot) {
      scanRoot(possibleShadowHost.shadowRoot);

      const shadowText = possibleShadowHost.shadowRoot.textContent?.toLowerCase() || "";

      if (
        isSmallBottomLeftFixed(possibleShadowHost) &&
        (
          shadowText.includes("estado app") ||
          shadowText.includes("next.js") ||
          shadowText.includes("dev tools") ||
          shadowText.includes("nextjs")
        )
      ) {
        hideElement(possibleShadowHost);
      }
    }
  }
}

function hideNextIndicator() {
  scanRoot(document);

  const bodyChildren = Array.from(document.body.children);

  for (const child of bodyChildren) {
    if (looksLikeNextDevIndicator(child)) {
      hideElement(child);
    }
  }
}

export default function HideNextDevIndicator() {
  useEffect(() => {
    hideNextIndicator();

    const observer = new MutationObserver(() => {
      hideNextIndicator();
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    const interval = window.setInterval(hideNextIndicator, 700);

    const timeout = window.setTimeout(() => {
      window.clearInterval(interval);
    }, 60000);

    window.addEventListener("resize", hideNextIndicator);

    return () => {
      observer.disconnect();
      window.clearInterval(interval);
      window.clearTimeout(timeout);
      window.removeEventListener("resize", hideNextIndicator);
    };
  }, []);

  return null;
}
