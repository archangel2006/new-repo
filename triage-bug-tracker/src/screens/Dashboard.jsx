"use client";

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "@/lib/router-compat";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SeverityBadge } from "@/components/SeverityBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { Plus, Search, LayoutGrid, List, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { NeonPatternDefs } from "@/components/NeonPatternDefs";
import { useNeonCharts } from "@/hooks/use-neon-charts";
const STATUS_COLORS = {
    new: "hsl(var(--info))",
    assigned: "hsl(var(--primary))",
    in_progress: "hsl(var(--warning))",
    testing: "hsl(280, 60%, 55%)",
    resolved: "hsl(var(--success))",
    closed: "hsl(var(--muted-foreground))",
};
const STATUS_LABELS = {
    new: "New", assigned: "Assigned", in_progress: "In Progress",
    testing: "Testing", resolved: "Resolved", closed: "Closed",
};
const SEVERITY_COLORS = {
    critical: "hsl(var(--severity-critical))", high: "hsl(var(--severity-high))",
    medium: "hsl(var(--severity-medium))", low: "hsl(var(--severity-low))",
};
const SEVERITY_LABELS = {
    critical: "Critical", high: "High", medium: "Medium", low: "Low",
};
const statusColumns = ["new", "assigned", "in_progress", "testing", "resolved", "closed"];
export default function Dashboard() {
    const { profile } = useAuth();
    const navigate = useNavigate();
    const [bugs, setBugs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [view, setView] = useState("table");
    const { getFill } = useNeonCharts();
    useEffect(() => {
        const fetchBugs = async () => {
            const { data } = await supabase.from("bugs").select("*").order("created_at", { ascending: false });
            setBugs(data || []);
            setLoading(false);
        };
        fetchBugs();
        const channel = supabase
            .channel("bugs-realtime")
            .on("postgres_changes", { event: "*", schema: "public", table: "bugs" }, () => fetchBugs())
            .subscribe();
        return () => { supabase.removeChannel(channel); };
    }, []);
    const filtered = bugs.filter(b => b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.tracking_id.toLowerCase().includes(search.toLowerCase()));
    const counts = {
        total: bugs.length,
        critical: bugs.filter(b => b.severity === "critical").length,
        open: bugs.filter(b => !["resolved", "closed"].includes(b.status)).length,
        resolved: bugs.filter(b => b.status === "resolved" || b.status === "closed").length,
    };
    const statusData = useMemo(() => {
        const c = {};
        bugs.forEach(b => { c[b.status] = (c[b.status] || 0) + 1; });
        return Object.entries(STATUS_LABELS).map(([key, label]) => ({
            status: label, count: c[key] || 0, fill: STATUS_COLORS[key],
        }));
    }, [bugs]);
    const statusChartConfig = Object.fromEntries(Object.entries(STATUS_LABELS).map(([k, label]) => [k, { label, color: STATUS_COLORS[k] }]));
    const severityData = useMemo(() => {
        const c = {};
        bugs.forEach(b => { c[b.severity] = (c[b.severity] || 0) + 1; });
        return Object.entries(SEVERITY_LABELS).map(([key, label]) => ({
            name: label, value: c[key] || 0, fill: SEVERITY_COLORS[key],
        }));
    }, [bugs]);
    const severityChartConfig = Object.fromEntries(Object.entries(SEVERITY_LABELS).map(([k, label]) => [k, { label, color: SEVERITY_COLORS[k] }]));
    if (loading) {
        return (_jsx(AppLayout, { children: _jsx("div", { className: "flex items-center justify-center h-full", children: _jsx(Loader2, { className: "h-5 w-5 animate-spin text-muted-foreground" }) }) }));
    }
    return (_jsx(AppLayout, { children: _jsxs("div", { className: "flex flex-col h-full", children: [_jsxs("div", { className: "flex items-center justify-between px-4 md:px-6 h-11 border-b border-border shrink-0", children: [_jsx("h1", { className: "text-[13px] font-medium", children: "Dashboard" }), _jsx("div", { className: "flex items-center gap-2", children: _jsx(Button, { asChild: true, size: "sm", className: "h-7 text-[12px] gap-1.5", children: _jsxs(Link, { to: "/bugs/new", children: [_jsx(Plus, { className: "h-3.5 w-3.5" }), " Report bug"] }) }) })] }), _jsx("div", { className: "flex-1 overflow-auto", children: _jsxs("div", { className: "p-4 md:p-6 space-y-6 max-w-[1400px]", children: [_jsx(NeonPatternDefs, { colors: [...Object.values(STATUS_COLORS), ...Object.values(SEVERITY_COLORS)] }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-md overflow-hidden", children: [
                                    { label: "Total bugs", value: counts.total },
                                    { label: "Critical", value: counts.critical },
                                    { label: "Open", value: counts.open },
                                    { label: "Resolved", value: counts.resolved },
                                ].map((stat) => (_jsxs("div", { className: "bg-background p-4", children: [_jsx("p", { className: "text-[12px] text-muted-foreground", children: stat.label }), _jsx("p", { className: "text-2xl font-medium mt-1", children: stat.value })] }, stat.label))) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-px bg-border rounded-md overflow-hidden", children: [_jsxs("div", { className: "bg-background p-4", children: [_jsx("p", { className: "text-[13px] font-medium mb-1", children: "Bugs by status" }), _jsx("p", { className: "text-[12px] text-muted-foreground mb-4", children: "Distribution across workflow stages" }), _jsx(ChartContainer, { config: statusChartConfig, className: "h-[200px] w-full", children: _jsxs(BarChart, { data: statusData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "hsl(var(--border))" }), _jsx(XAxis, { dataKey: "status", tick: { fontSize: 11 }, stroke: "hsl(var(--muted-foreground))" }), _jsx(YAxis, { allowDecimals: false, tick: { fontSize: 11 }, stroke: "hsl(var(--muted-foreground))" }), _jsx(ChartTooltip, { content: _jsx(ChartTooltipContent, {}) }), _jsx(Bar, { dataKey: "count", radius: 0, children: statusData.map((entry, i) => _jsx(Cell, { ...getFill(entry.fill) }, i)) })] }) })] }), _jsxs("div", { className: "bg-background p-4", children: [_jsx("p", { className: "text-[13px] font-medium mb-1", children: "Severity distribution" }), _jsx("p", { className: "text-[12px] text-muted-foreground mb-4", children: "Breakdown by severity level" }), _jsx(ChartContainer, { config: severityChartConfig, className: "h-[200px] w-full", children: _jsxs(PieChart, { children: [_jsx(ChartTooltip, { content: _jsx(ChartTooltipContent, {}) }), _jsx(Pie, { data: severityData, dataKey: "value", nameKey: "name", cx: "50%", cy: "50%", innerRadius: 45, outerRadius: 75, paddingAngle: 2, children: severityData.map((entry, i) => _jsx(Cell, { ...getFill(entry.fill) }, i)) })] }) })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("div", { className: "relative flex-1 max-w-sm", children: [_jsx(Search, { className: "absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" }), _jsx(Input, { placeholder: "Search bugs...", value: search, onChange: (e) => setSearch(e.target.value), className: "pl-8 h-8 text-[13px] bg-transparent" })] }), _jsxs("div", { className: "flex items-center border rounded-md", children: [_jsx(Button, { variant: view === "table" ? "secondary" : "ghost", size: "sm", onClick: () => setView("table"), className: "h-8 w-8 p-0", children: _jsx(List, { className: "h-3.5 w-3.5" }) }), _jsx(Button, { variant: view === "kanban" ? "secondary" : "ghost", size: "sm", onClick: () => setView("kanban"), className: "h-8 w-8 p-0", children: _jsx(LayoutGrid, { className: "h-3.5 w-3.5" }) })] })] }), view === "table" && (_jsx("div", { className: "border border-border rounded-md overflow-hidden", children: _jsxs("table", { className: "w-full text-[13px]", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-border bg-muted/30", children: [_jsx("th", { className: "text-left font-medium text-muted-foreground px-3 py-2", children: "ID" }), _jsx("th", { className: "text-left font-medium text-muted-foreground px-3 py-2", children: "Title" }), _jsx("th", { className: "text-left font-medium text-muted-foreground px-3 py-2", children: "Status" }), _jsx("th", { className: "text-left font-medium text-muted-foreground px-3 py-2", children: "Priority" }), _jsx("th", { className: "text-left font-medium text-muted-foreground px-3 py-2", children: "Created" })] }) }), _jsx("tbody", { children: filtered.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "text-center py-8 text-muted-foreground text-[13px]", children: "No bugs found" }) })) : (filtered.map((bug) => (_jsxs("tr", { className: "border-b border-border last:border-0 hover:bg-muted/30 cursor-pointer transition-colors", onClick: () => navigate(`/bugs/${bug.id}`), children: [_jsx("td", { className: "px-3 py-2 text-muted-foreground font-mono text-[12px]", children: bug.tracking_id }), _jsx("td", { className: "px-3 py-2 font-medium", children: bug.title }), _jsx("td", { className: "px-3 py-2", children: _jsx(StatusBadge, { status: bug.status }) }), _jsx("td", { className: "px-3 py-2", children: _jsx(SeverityBadge, { severity: bug.severity }) }), _jsx("td", { className: "px-3 py-2 text-muted-foreground text-[12px] whitespace-nowrap", children: formatDistanceToNow(new Date(bug.created_at), { addSuffix: true }) })] }, bug.id)))) })] }) })), view === "kanban" && (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4", children: statusColumns.map((status) => {
                                    const columnBugs = filtered.filter(b => b.status === status);
                                    return (_jsxs("div", { className: "space-y-1.5", children: [_jsxs("div", { className: "flex items-center justify-between px-1", children: [_jsx(StatusBadge, { status: status }), _jsx("span", { className: "text-[11px] text-muted-foreground", children: columnBugs.length })] }), _jsxs("div", { className: "space-y-1", children: [columnBugs.map((bug) => (_jsx(Link, { to: `/bugs/${bug.id}`, children: _jsxs("div", { className: "border border-border rounded-md p-2.5 hover:bg-muted/30 transition-colors cursor-pointer space-y-1.5", children: [_jsx("p", { className: "text-[11px] text-muted-foreground font-mono", children: bug.tracking_id }), _jsx("p", { className: "text-[13px] font-medium leading-snug line-clamp-2", children: bug.title }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx(SeverityBadge, { severity: bug.severity }), _jsx("span", { className: "text-[10px] text-muted-foreground", children: formatDistanceToNow(new Date(bug.created_at), { addSuffix: true }) })] })] }) }, bug.id))), columnBugs.length === 0 && (_jsx("div", { className: "border border-dashed border-border rounded-md p-3 text-center", children: _jsx("p", { className: "text-[11px] text-muted-foreground", children: "No bugs" }) }))] })] }, status));
                                }) }))] }) })] }) }));
}
