"use client";

import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate } from "@/lib/router-compat";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
export function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) {
        return (_jsx("div", { className: "flex min-h-screen items-center justify-center bg-background", children: _jsx(Loader2, { className: "h-8 w-8 animate-spin text-primary" }) }));
    }
    if (!user)
        return _jsx(Navigate, { to: "/auth", replace: true });
    return _jsx(_Fragment, { children: children });
}
