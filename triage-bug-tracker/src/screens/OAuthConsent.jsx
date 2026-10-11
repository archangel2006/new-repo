"use client";

import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "@/lib/router-compat";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { StackedLogo } from "@/components/StackedLogo";
import { Loader2 } from "lucide-react";
const oauth = () => supabase.auth.oauth;
export default function OAuthConsent() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const authorizationId = params.get("authorization_id") ?? "";
    const [details, setDetails] = useState(null);
    const [error, setError] = useState(null);
    const [busy, setBusy] = useState(false);
    useEffect(() => {
        let active = true;
        (async () => {
            if (!authorizationId)
                return setError("Missing authorization_id");
            const { data: sess } = await supabase.auth.getSession();
            if (!sess.session) {
                const next = window.location.pathname + window.location.search;
                navigate("/auth?next=" + encodeURIComponent(next), { replace: true });
                return;
            }
            const { data, error } = await oauth().getAuthorizationDetails(authorizationId);
            if (!active)
                return;
            if (error)
                return setError(error.message);
            const immediate = data?.redirect_url ?? data?.redirect_to;
            if (immediate && !data?.client) {
                window.location.href = immediate;
                return;
            }
            setDetails(data);
        })();
        return () => {
            active = false;
        };
    }, [authorizationId, navigate]);
    async function decide(approve) {
        setBusy(true);
        const { data, error } = approve
            ? await oauth().approveAuthorization(authorizationId)
            : await oauth().denyAuthorization(authorizationId);
        if (error) {
            setBusy(false);
            return setError(error.message);
        }
        const target = data?.redirect_url ?? data?.redirect_to;
        if (!target) {
            setBusy(false);
            return setError("No redirect returned by the authorization server.");
        }
        window.location.href = target;
    }
    return (_jsx("div", { className: "flex min-h-screen items-center justify-center bg-background p-4", children: _jsxs("div", { className: "w-full max-w-[420px] border border-border rounded-md p-8 space-y-5", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(StackedLogo, { size: 16 }), _jsx("span", { className: "text-[14px] font-bold text-foreground tracking-[0.08em] uppercase", children: "Triage" })] }), error ? (_jsxs("p", { className: "text-[13px] text-destructive", children: ["Could not load this authorization request: ", error] })) : !details ? (_jsxs("div", { className: "flex items-center gap-2 text-[13px] text-muted-foreground", children: [_jsx(Loader2, { className: "h-3.5 w-3.5 animate-spin" }), " Loading\u2026"] })) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "space-y-1", children: [_jsxs("h1", { className: "text-[15px] font-medium text-foreground", children: ["Connect ", details.client?.name ?? "an app", " to your account"] }), _jsxs("p", { className: "text-[13px] text-muted-foreground", children: ["This lets ", details.client?.name ?? "the client", " read and manage bugs in Triage as you."] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs(Button, { size: "sm", className: "h-8 text-[13px]", disabled: busy, onClick: () => decide(true), children: [busy && _jsx(Loader2, { className: "mr-1.5 h-3.5 w-3.5 animate-spin" }), "Approve"] }), _jsx(Button, { size: "sm", variant: "ghost", className: "h-8 text-[13px]", disabled: busy, onClick: () => decide(false), children: "Deny" })] })] }))] }) }));
}
