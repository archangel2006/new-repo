"use client";

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "@/lib/router-compat";
import { supabase } from "@/integrations/supabase/client";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SeverityBadge } from "@/components/SeverityBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Loader2 } from "lucide-react";
import { Constants } from "@/integrations/supabase/types";
import { formatDistanceToNow } from "date-fns";
export default function BugList() {
    const navigate = useNavigate();
    const [bugs, setBugs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [severityFilter, setSeverityFilter] = useState("all");
    useEffect(() => {
        const fetchBugs = async () => {
            const { data } = await supabase.from("bugs").select("*").order("created_at", { ascending: false });
            setBugs(data || []);
            setLoading(false);
        };
        fetchBugs();
        const channel = supabase
            .channel("buglist-realtime")
            .on("postgres_changes", { event: "*", schema: "public", table: "bugs" }, () => fetchBugs())
            .subscribe();
        return () => { supabase.removeChannel(channel); };
    }, []);
    const filtered = bugs.filter(b => {
        const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase()) ||
            b.tracking_id.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "all" || b.status === statusFilter;
        const matchesSeverity = severityFilter === "all" || b.severity === severityFilter;
        return matchesSearch && matchesStatus && matchesSeverity;
    });
    if (loading) {
        return (_jsx(AppLayout, { children: _jsx("div", { className: "flex items-center justify-center h-full", children: _jsx(Loader2, { className: "h-5 w-5 animate-spin text-muted-foreground" }) }) }));
    }
    return (_jsx(AppLayout, { children: _jsxs("div", { className: "flex flex-col h-full", children: [_jsxs("div", { className: "flex items-center justify-between px-4 md:px-6 h-11 border-b border-border shrink-0", children: [_jsx("h1", { className: "text-[13px] font-medium", children: "All Bugs" }), _jsx(Button, { asChild: true, size: "sm", className: "h-7 text-[12px] gap-1.5", children: _jsxs(Link, { to: "/bugs/new", children: [_jsx(Plus, { className: "h-3.5 w-3.5" }), " Report Bug"] }) })] }), _jsxs("div", { className: "flex items-center gap-2 px-4 md:px-6 h-10 border-b border-border shrink-0", children: [_jsxs("div", { className: "relative flex-1 max-w-sm", children: [_jsx(Search, { className: "absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" }), _jsx(Input, { placeholder: "Search bugs...", value: search, onChange: (e) => setSearch(e.target.value), className: "pl-8 h-7 text-[13px] bg-transparent border-none shadow-none focus-visible:ring-0" })] }), _jsxs(Select, { value: statusFilter, onValueChange: setStatusFilter, children: [_jsx(SelectTrigger, { className: "w-[120px] h-7 text-[12px] border-none bg-transparent", children: _jsx(SelectValue, { placeholder: "Status" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "All Statuses" }), Constants.public.Enums.bug_status.map((s) => (_jsx(SelectItem, { value: s, children: s.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase()) }, s)))] })] }), _jsxs(Select, { value: severityFilter, onValueChange: setSeverityFilter, children: [_jsx(SelectTrigger, { className: "w-[120px] h-7 text-[12px] border-none bg-transparent", children: _jsx(SelectValue, { placeholder: "Severity" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "All Severities" }), Constants.public.Enums.bug_severity.map((s) => (_jsx(SelectItem, { value: s, children: s.charAt(0).toUpperCase() + s.slice(1) }, s)))] })] })] }), _jsx("div", { className: "flex-1 overflow-auto", children: _jsxs("table", { className: "w-full text-[13px]", children: [_jsx("thead", { className: "sticky top-0 bg-background z-10", children: _jsxs("tr", { className: "border-b border-border", children: [_jsx("th", { className: "text-left font-medium text-muted-foreground px-4 md:px-6 py-2", children: "ID" }), _jsx("th", { className: "text-left font-medium text-muted-foreground px-3 py-2", children: "Title" }), _jsx("th", { className: "text-left font-medium text-muted-foreground px-3 py-2", children: "Status" }), _jsx("th", { className: "text-left font-medium text-muted-foreground px-3 py-2", children: "Priority" }), _jsx("th", { className: "text-left font-medium text-muted-foreground px-3 py-2", children: "Created" })] }) }), _jsx("tbody", { children: filtered.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "text-center py-12 text-muted-foreground", children: "No bugs found" }) })) : (filtered.map((bug) => (_jsxs("tr", { className: "border-b border-border hover:bg-muted/30 cursor-pointer transition-colors", onClick: () => navigate(`/bugs/${bug.id}`), children: [_jsx("td", { className: "px-4 md:px-6 py-2 text-muted-foreground font-mono text-[12px]", children: bug.tracking_id }), _jsx("td", { className: "px-3 py-2 font-medium", children: bug.title }), _jsx("td", { className: "px-3 py-2", children: _jsx(StatusBadge, { status: bug.status }) }), _jsx("td", { className: "px-3 py-2", children: _jsx(SeverityBadge, { severity: bug.severity }) }), _jsx("td", { className: "px-3 py-2 text-muted-foreground text-[12px] whitespace-nowrap", children: formatDistanceToNow(new Date(bug.created_at), { addSuffix: true }) })] }, bug.id)))) })] }) })] }) }));
}
