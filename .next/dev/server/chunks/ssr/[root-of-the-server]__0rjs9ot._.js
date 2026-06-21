module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/gacp-growlifecol/src/components/floratrack/HideNextDevIndicator.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HideNextDevIndicator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/gacp-growlifecol/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
function isElement(value) {
    return value instanceof HTMLElement;
}
function textOf(element) {
    return [
        element.textContent || "",
        element.getAttribute("aria-label") || "",
        element.getAttribute("title") || "",
        element.id || "",
        element.className ? String(element.className) : ""
    ].join(" ").toLowerCase();
}
function isSmallBottomLeftFixed(element) {
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
function looksLikeNextDevIndicator(element) {
    const content = textOf(element);
    const hasNextText = content.includes("estado app") || content.includes("next.js") || content.includes("nextjs") || content.includes("dev tools") || content.includes("devtools") || content.includes("open next") || content.includes("route indicator");
    return hasNextText && isSmallBottomLeftFixed(element);
}
function hideElement(element) {
    if (!isElement(element)) return;
    element.style.setProperty("display", "none", "important");
    element.style.setProperty("visibility", "hidden", "important");
    element.style.setProperty("opacity", "0", "important");
    element.style.setProperty("pointer-events", "none", "important");
    element.setAttribute("aria-hidden", "true");
    element.setAttribute("data-floratrack-hidden-dev-indicator", "true");
}
function scanRoot(root) {
    const elements = Array.from(root.querySelectorAll("*"));
    for (const element of elements){
        if (looksLikeNextDevIndicator(element)) {
            hideElement(element);
        }
        const possibleShadowHost = element;
        if (possibleShadowHost.shadowRoot) {
            scanRoot(possibleShadowHost.shadowRoot);
            const shadowText = possibleShadowHost.shadowRoot.textContent?.toLowerCase() || "";
            if (isSmallBottomLeftFixed(possibleShadowHost) && (shadowText.includes("estado app") || shadowText.includes("next.js") || shadowText.includes("dev tools") || shadowText.includes("nextjs"))) {
                hideElement(possibleShadowHost);
            }
        }
    }
}
function hideNextIndicator() {
    scanRoot(document);
    const bodyChildren = Array.from(document.body.children);
    for (const child of bodyChildren){
        if (looksLikeNextDevIndicator(child)) {
            hideElement(child);
        }
    }
}
function HideNextDevIndicator() {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        hideNextIndicator();
        const observer = new MutationObserver(()=>{
            hideNextIndicator();
        });
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true
        });
        const interval = window.setInterval(hideNextIndicator, 700);
        const timeout = window.setTimeout(()=>{
            window.clearInterval(interval);
        }, 60000);
        window.addEventListener("resize", hideNextIndicator);
        return ()=>{
            observer.disconnect();
            window.clearInterval(interval);
            window.clearTimeout(timeout);
            window.removeEventListener("resize", hideNextIndicator);
        };
    }, []);
    return null;
}
}),
"[project]/gacp-growlifecol/src/components/ui/AppStatusDock.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AppStatusDock
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/gacp-growlifecol/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/gacp-growlifecol/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const links = [
    {
        label: "Dashboard",
        href: "/"
    },
    {
        label: "Nuevo Registro",
        href: "/new-record"
    },
    {
        label: "Audit Trail",
        href: "/audit-trail"
    },
    {
        label: "Registros",
        href: "/progress-records"
    },
    {
        label: "Cultivos",
        href: "/cultivos"
    },
    {
        label: "Propagación",
        href: "/propagacion"
    },
    {
        label: "Cosecha",
        href: "/cosecha"
    },
    {
        label: "Genéticas",
        href: "/geneticas"
    },
    {
        label: "Predios",
        href: "/predios"
    }
];
function AppStatusDock() {
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: ()=>setOpen(true),
                className: "fixed bottom-5 left-5 z-40 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-2xl",
                children: "Estado App"
            }, void 0, false, {
                fileName: "[project]/gacp-growlifecol/src/components/ui/AppStatusDock.tsx",
                lineNumber: 22,
                columnNumber: 7
            }, this),
            open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "fixed bottom-5 left-5 z-50 w-[360px] rounded-[2rem] border bg-white p-6 text-slate-950 shadow-2xl",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start justify-between gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs font-black uppercase tracking-widest text-green-600",
                                        children: "FloraTrack System"
                                    }, void 0, false, {
                                        fileName: "[project]/gacp-growlifecol/src/components/ui/AppStatusDock.tsx",
                                        lineNumber: 34,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "mt-2 text-3xl font-black",
                                        children: "Estado App"
                                    }, void 0, false, {
                                        fileName: "[project]/gacp-growlifecol/src/components/ui/AppStatusDock.tsx",
                                        lineNumber: 37,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-2 text-sm font-semibold text-slate-500",
                                        children: "Ventana informativa. No guarda datos. No duplica acciones."
                                    }, void 0, false, {
                                        fileName: "[project]/gacp-growlifecol/src/components/ui/AppStatusDock.tsx",
                                        lineNumber: 38,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/gacp-growlifecol/src/components/ui/AppStatusDock.tsx",
                                lineNumber: 33,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setOpen(false),
                                className: "rounded-xl border px-4 py-2 text-sm font-black",
                                children: "Cerrar"
                            }, void 0, false, {
                                fileName: "[project]/gacp-growlifecol/src/components/ui/AppStatusDock.tsx",
                                lineNumber: 43,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/gacp-growlifecol/src/components/ui/AppStatusDock.tsx",
                        lineNumber: 32,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-5 grid grid-cols-2 gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-2xl bg-green-50 p-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs font-black text-green-700",
                                        children: "Servidor"
                                    }, void 0, false, {
                                        fileName: "[project]/gacp-growlifecol/src/components/ui/AppStatusDock.tsx",
                                        lineNumber: 54,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-1 text-xl font-black text-green-700",
                                        children: "Activo"
                                    }, void 0, false, {
                                        fileName: "[project]/gacp-growlifecol/src/components/ui/AppStatusDock.tsx",
                                        lineNumber: 55,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/gacp-growlifecol/src/components/ui/AppStatusDock.tsx",
                                lineNumber: 53,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-2xl bg-green-50 p-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs font-black text-green-700",
                                        children: "Validación"
                                    }, void 0, false, {
                                        fileName: "[project]/gacp-growlifecol/src/components/ui/AppStatusDock.tsx",
                                        lineNumber: 59,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-1 text-xl font-black text-green-700",
                                        children: "ON"
                                    }, void 0, false, {
                                        fileName: "[project]/gacp-growlifecol/src/components/ui/AppStatusDock.tsx",
                                        lineNumber: 60,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/gacp-growlifecol/src/components/ui/AppStatusDock.tsx",
                                lineNumber: 58,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-2xl bg-slate-100 p-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs font-black text-slate-500",
                                        children: "Modo"
                                    }, void 0, false, {
                                        fileName: "[project]/gacp-growlifecol/src/components/ui/AppStatusDock.tsx",
                                        lineNumber: 64,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-1 text-xl font-black",
                                        children: "MVP"
                                    }, void 0, false, {
                                        fileName: "[project]/gacp-growlifecol/src/components/ui/AppStatusDock.tsx",
                                        lineNumber: 65,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/gacp-growlifecol/src/components/ui/AppStatusDock.tsx",
                                lineNumber: 63,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-2xl bg-slate-100 p-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs font-black text-slate-500",
                                        children: "App"
                                    }, void 0, false, {
                                        fileName: "[project]/gacp-growlifecol/src/components/ui/AppStatusDock.tsx",
                                        lineNumber: 69,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-1 text-xl font-black",
                                        children: "FloraTrack"
                                    }, void 0, false, {
                                        fileName: "[project]/gacp-growlifecol/src/components/ui/AppStatusDock.tsx",
                                        lineNumber: 70,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/gacp-growlifecol/src/components/ui/AppStatusDock.tsx",
                                lineNumber: 68,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/gacp-growlifecol/src/components/ui/AppStatusDock.tsx",
                        lineNumber: 52,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-5 grid grid-cols-2 gap-3",
                        children: links.map((link)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: link.href,
                                className: "rounded-2xl border px-4 py-3 text-center text-sm font-black hover:bg-slate-950 hover:text-white",
                                children: link.label
                            }, link.href, false, {
                                fileName: "[project]/gacp-growlifecol/src/components/ui/AppStatusDock.tsx",
                                lineNumber: 76,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/gacp-growlifecol/src/components/ui/AppStatusDock.tsx",
                        lineNumber: 74,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/gacp-growlifecol/src/components/ui/AppStatusDock.tsx",
                lineNumber: 31,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true);
}
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/gacp-growlifecol/src/components/NavigationCloud.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>NavigationCloud
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/gacp-growlifecol/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/gacp-growlifecol/node_modules/next/navigation.js [app-ssr] (ecmascript)");
"use client";
;
;
const labels = {
    "dian": "DIAN / Comercio Exterior",
    "fne": "FNE / Fondo Nacional de Estupefacientes",
    "estado-app": "Estado de la App",
    "minjusticia": "Ministerio de Justicia",
    "dashboard-clasico": "Dashboard clásico",
    "command-center": "Command Center",
    "reportes-programados": "Automatización de Reportes",
    "regulatoria-api": "API Regulatoria Avanzada",
    "post-extraccion": "Post-Extracción GMP",
    "bho": "Extracción BHO",
    "live-rosin": "Live Rosin",
    "bubble-hash": "Bubble Hash",
    "ica": "ICA",
    "invima": "INVIMA",
    "peas": "PEAS",
    "documentos": "Documentos Controlados",
    "firmas": "Firmas Electrónicas",
    "part11": "Validación 21 CFR Part 11",
    "backups": "Backups y Restauración",
    "integraciones": "Conectores e Integraciones",
    "workflows": "Workflows QA",
    "automatizaciones": "Automatizaciones QA",
    "cambios": "Control de Cambios",
    "riesgos": "Gestión de Riesgos GxP",
    "entrenamiento": "Entrenamiento y Competencia",
    "equipos": "Equipos GMP",
    "proveedores": "Proveedores",
    "auditorias": "Auditorías Internas",
    "recepcion": "Recepción",
    "inventario": "Inventario",
    "calidad": "Calidad QA",
    "desviaciones": "Desviaciones / CAPA",
    "cultivos": "Cultivos",
    "propagacion": "Propagación",
    "cosecha": "Cosecha",
    "geneticas": "Genéticas",
    "predios": "Predios",
    "empresas": "Empresas y Licencias",
    "gis": "GIS / Mapa Operacional",
    "reportes": "Reportes y KPIs",
    "usuarios": "Usuarios y Accesos",
    "notificaciones": "Notificaciones y Alertas",
    "csv": "CSV / DataOps",
    "regulatorio": "Regulatorio",
    "residuos": "Residuos y Disposición",
    "recall": "Recall / Retiro",
    "retencion": "Retención y Estabilidad",
    "saneamiento": "Limpieza y Saneamiento",
    "plagas": "Manejo Integrado de Plagas"
};
function formatModuleName(pathname) {
    if (!pathname || pathname === "/") return "Command Center";
    const firstSegment = pathname.split("/").filter(Boolean)[0] ?? "módulo";
    return labels[firstSegment] ?? firstSegment.charAt(0).toUpperCase() + firstSegment.slice(1);
}
function NavigationCloud() {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const isDashboard = pathname === "/";
    const isSystemPath = pathname?.startsWith("/_next") || pathname?.startsWith("/api") || pathname?.startsWith("/favicon");
    if (isDashboard || isSystemPath) {
        return null;
    }
    function goBack() {
        if (("TURBOPACK compile-time value", "undefined") !== "undefined" && window.history.length > 1) //TURBOPACK unreachable
        ;
        router.push("/");
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
        className: "bg-slate-950 px-6 pb-8 pt-5 text-white print:hidden",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
            className: "mx-auto flex max-w-7xl flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/[0.04] px-5 py-4 shadow-2xl backdrop-blur md:flex-row md:items-center md:justify-between",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-400 to-cyan-300 text-base font-black text-slate-950",
                            children: "F"
                        }, void 0, false, {
                            fileName: "[project]/gacp-growlifecol/src/components/NavigationCloud.tsx",
                            lineNumber: 92,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[11px] font-black uppercase tracking-[0.28em] text-emerald-300",
                                    children: "FloraTrack Navigation"
                                }, void 0, false, {
                                    fileName: "[project]/gacp-growlifecol/src/components/NavigationCloud.tsx",
                                    lineNumber: 97,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm font-bold text-slate-200",
                                    children: formatModuleName(pathname)
                                }, void 0, false, {
                                    fileName: "[project]/gacp-growlifecol/src/components/NavigationCloud.tsx",
                                    lineNumber: 100,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/gacp-growlifecol/src/components/NavigationCloud.tsx",
                            lineNumber: 96,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/gacp-growlifecol/src/components/NavigationCloud.tsx",
                    lineNumber: 91,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-wrap gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: goBack,
                            className: "rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-xs font-black text-slate-100 transition hover:bg-white hover:text-slate-950",
                            children: "← Atrás"
                        }, void 0, false, {
                            fileName: "[project]/gacp-growlifecol/src/components/NavigationCloud.tsx",
                            lineNumber: 107,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$gacp$2d$growlifecol$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>router.push("/"),
                            className: "rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-300 px-5 py-3 text-xs font-black text-slate-950 shadow-lg shadow-emerald-950/20 transition hover:-translate-y-0.5",
                            children: "Inicio / Command Center"
                        }, void 0, false, {
                            fileName: "[project]/gacp-growlifecol/src/components/NavigationCloud.tsx",
                            lineNumber: 115,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/gacp-growlifecol/src/components/NavigationCloud.tsx",
                    lineNumber: 106,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/gacp-growlifecol/src/components/NavigationCloud.tsx",
            lineNumber: 90,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/gacp-growlifecol/src/components/NavigationCloud.tsx",
        lineNumber: 89,
        columnNumber: 5
    }, this);
}
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/dynamic-access-async-storage.external.js [external] (next/dist/server/app-render/dynamic-access-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/dynamic-access-async-storage.external.js", () => require("next/dist/server/app-render/dynamic-access-async-storage.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0rjs9ot._.js.map