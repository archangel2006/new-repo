"use client";

import { jsx as _jsx } from "react/jsx-runtime";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "@/lib/router-compat";
import Landing from "./Landing";
const Index = () => {
    const { user, loading } = useAuth();
    if (loading)
        return null;
    if (user)
        return _jsx(Navigate, { to: "/dashboard", replace: true });
    return _jsx(Landing, {});
};
export default Index;
