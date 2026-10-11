"use client";

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
export function NeonToggle({ active, onToggle }) {
    return (_jsxs(Button, { variant: active ? "secondary" : "ghost", size: "sm", onClick: onToggle, className: "h-7 gap-1.5 text-[12px]", title: "Toggle neon chart style", children: [_jsx(Sparkles, { className: "h-3 w-3" }), "Neon"] }));
}
