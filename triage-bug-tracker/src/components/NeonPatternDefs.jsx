"use client";

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function neonPatternId(color) {
    return `neon-${color.replace(/[^a-zA-Z0-9]/g, "")}`;
}
/**
 * Renders a hidden SVG element containing diagonal-line pattern definitions.
 * Place this anywhere in the component tree — pattern IDs are globally
 * accessible across all SVGs in the same document.
 */
export function NeonPatternDefs({ colors }) {
    const unique = [...new Set(colors)];
    return (_jsx("svg", { width: "0", height: "0", style: { position: "absolute" }, children: _jsx("defs", { children: unique.map((color) => (_jsxs("pattern", { id: neonPatternId(color), patternUnits: "userSpaceOnUse", width: "6", height: "6", patternTransform: "rotate(-45)", children: [_jsx("rect", { width: "6", height: "6", fill: color, opacity: "0.10" }), _jsx("line", { x1: "0", y1: "0", x2: "0", y2: "6", stroke: color, strokeWidth: "1.2", opacity: "0.6" })] }, color))) }) }));
}
