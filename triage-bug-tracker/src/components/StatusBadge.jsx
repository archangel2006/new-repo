"use client";

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "@/lib/utils";
const statusConfig = {
    new: { label: "New", dotClass: "bg-info" },
    assigned: { label: "Assigned", dotClass: "bg-primary" },
    in_progress: { label: "In Progress", dotClass: "bg-warning" },
    testing: { label: "Testing", dotClass: "bg-[hsl(280,60%,55%)]" },
    resolved: { label: "Resolved", dotClass: "bg-success" },
    closed: { label: "Closed", dotClass: "bg-muted-foreground" },
};
export function StatusBadge({ status }) {
    const config = statusConfig[status];
    return (_jsxs("span", { className: "inline-flex items-center gap-1.5 text-[12px] text-muted-foreground", children: [_jsx("span", { className: cn("h-2 w-2 rounded-full shrink-0", config.dotClass) }), config.label] }));
}
