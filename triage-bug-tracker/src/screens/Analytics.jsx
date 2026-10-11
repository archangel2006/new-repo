"use client";

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays, parseISO, startOfDay } from "date-fns";
import { useNeonCharts } from "@/hooks/use-neon-charts";
import { NeonPatternDefs, neonPatternId } from "@/components/NeonPatternDefs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, } from "recharts";
const STATUS_COLORS = {
    new: "hsl(199, 89%, 48%)", assigned: "hsl(234, 55%, 60%)",
    in_progress: "hsl(38, 92%, 50%)", testing: "hsl(280, 60%, 55%)",
    resolved: "hsl(142, 70%, 40%)", closed: "hsl(0, 0%, 50%)",
};
const STATUS_LABELS = {
    new: "New", assigned: "Assigned", in_progress: "In Progress",
    testing: "Testing", resolved: "Resolved", closed: "Closed",
};
const SEVERITY_COLORS = {
    critical: "hsl(0, 72%, 51%)", high: "hsl(25, 95%, 53%)",
    medium: "hsl(38, 92%, 50%)", low: "hsl(142, 70%, 40%)",
};
const SEVERITY_LABELS = {
    critical: "Critical", high: "High", medium: "Medium", low: "Low",
};
export default function Analytics() {
    const [bugs, setBugs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { getFill } = useNeonCharts();
    useEffect(() => {
        supabase.from("bugs").select("*").then(({ data }) => {
            setBugs(data ?? []);
            setLoading(false);
        });
    }, []);
    const stats = useMemo(() => {
        const total = bugs.length;
        const resolved = bugs.filter(b => b.status === "resolved" || b.status === "closed").length;
        const critical = bugs.filter(b => b.severity === "critical").length;
        const thirtyDaysAgo = subDays(new Date(), 30);
        const recent = bugs.filter(b => parseISO(b.created_at) >= thirtyDaysAgo).length;
        return { total, resolutionRate: total ? Math.round((resolved / total) * 100) : 0, avgPerDay: Math.round((recent / 30) * 10) / 10, critical };
    }, [bugs]);
    const statusData = useMemo(() => {
        const counts = {};
        bugs.forEach(b => { counts[b.status] = (counts[b.status] || 0) + 1; });
        return Object.entries(STATUS_LABELS).map(([key, label]) => ({ status: label, count: counts[key] || 0, fill: STATUS_COLORS[key] }));
    }, [bugs]);
    const statusChartConfig = Object.fromEntries(Object.entries(STATUS_LABELS).map(([k, label]) => [k, { label, color: STATUS_COLORS[k] }]));
    const severityData = useMemo(() => {
        const counts = {};
        bugs.forEach(b => { counts[b.severity] = (counts[b.severity] || 0) + 1; });
        return Object.entries(SEVERITY_LABELS).map(([key, label]) => ({ name: label, value: counts[key] || 0, fill: SEVERITY_COLORS[key] }));
    }, [bugs]);
    const severityChartConfig = Object.fromEntries(Object.entries(SEVERITY_LABELS).map(([k, label]) => [k, { label, color: SEVERITY_COLORS[k] }]));
    const trendData = useMemo(() => {
        const days = {};
        for (let i = 29; i >= 0; i--)
            days[format(subDays(new Date(), i), "MMM dd")] = 0;
        bugs.forEach(b => { const key = format(parseISO(b.created_at), "MMM dd"); if (key in days)
            days[key]++; });
        return Object.entries(days).map(([date, count]) => ({ date, count }));
    }, [bugs]);
    const trendChartConfig = { count: { label: "Bugs Created", color: "hsl(234, 55%, 60%)" } };
    const areaData = useMemo(() => {
        const resolvedStatuses = new Set(["resolved", "closed"]);
        const result = [];
        for (let i = 29; i >= 0; i--) {
            const day = startOfDay(subDays(new Date(), i));
            let open = 0, resolved = 0;
            bugs.forEach(b => { if (parseISO(b.created_at) <= day) {
                if (resolvedStatuses.has(b.status))
                    resolved++;
                else
                    open++;
            } });
            result.push({ date: format(day, "MMM dd"), open, resolved });
        }
        return result;
    }, [bugs]);
    const areaChartConfig = { open: { label: "Open", color: "hsl(38, 92%, 50%)" }, resolved: { label: "Resolved", color: "hsl(142, 70%, 40%)" } };
    const stackedData = useMemo(() => {
        return Object.entries(STATUS_LABELS).map(([statusKey, statusLabel]) => {
            const row = { status: statusLabel };
            Object.keys(SEVERITY_LABELS).forEach(sev => { row[sev] = bugs.filter(b => b.status === statusKey && b.severity === sev).length; });
            return row;
        });
    }, [bugs]);
    const stackedChartConfig = Object.fromEntries(Object.entries(SEVERITY_LABELS).map(([k, label]) => [k, { label, color: SEVERITY_COLORS[k] }]));
    if (loading) {
        return (_jsx(AppLayout, { children: _jsxs("div", { className: "flex flex-col h-full", children: [_jsx("div", { className: "px-4 md:px-6 h-11 border-b border-border flex items-center", children: _jsx(Skeleton, { className: "h-4 w-20" }) }), _jsx("div", { className: "p-4 md:p-6 space-y-4", children: _jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-md overflow-hidden", children: Array.from({ length: 4 }).map((_, i) => _jsx(Skeleton, { className: "h-20" }, i)) }) })] }) }));
    }
    return (_jsx(AppLayout, { children: _jsxs("div", { className: "flex flex-col h-full", children: [_jsx("div", { className: "px-4 md:px-6 h-11 border-b border-border flex items-center shrink-0", children: _jsx("h1", { className: "text-[13px] font-medium", children: "Analytics" }) }), _jsxs("div", { className: "flex-1 overflow-auto", children: [_jsx(NeonPatternDefs, { colors: [...Object.values(STATUS_COLORS), ...Object.values(SEVERITY_COLORS), "hsl(38, 92%, 50%)", "hsl(142, 70%, 40%)"] }), _jsxs("div", { className: "p-4 md:p-6 space-y-6 max-w-[1400px]", children: [_jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-md overflow-hidden", children: [
                                        { label: "Total bugs", value: stats.total },
                                        { label: "Resolution rate", value: `${stats.resolutionRate}%` },
                                        { label: "Avg bugs/day", value: stats.avgPerDay },
                                        { label: "Critical bugs", value: stats.critical },
                                    ].map((stat) => (_jsxs("div", { className: "bg-background p-4", children: [_jsx("p", { className: "text-[12px] text-muted-foreground", children: stat.label }), _jsx("p", { className: "text-2xl font-medium mt-1", children: stat.value })] }, stat.label))) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-px bg-border rounded-md overflow-hidden", children: [_jsxs("div", { className: "bg-background p-4", children: [_jsx("p", { className: "text-[13px] font-medium mb-1", children: "Bugs by status" }), _jsx("p", { className: "text-[12px] text-muted-foreground mb-4", children: "Distribution across workflow stages" }), _jsx(ChartContainer, { config: statusChartConfig, className: "h-[220px] w-full", children: _jsxs(BarChart, { data: statusData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "hsl(var(--border))" }), _jsx(XAxis, { dataKey: "status", tick: { fontSize: 11 }, stroke: "hsl(var(--muted-foreground))" }), _jsx(YAxis, { allowDecimals: false, tick: { fontSize: 11 }, stroke: "hsl(var(--muted-foreground))" }), _jsx(ChartTooltip, { content: _jsx(ChartTooltipContent, {}) }), _jsx(Bar, { dataKey: "count", radius: 0, children: statusData.map((e, i) => _jsx(Cell, { ...getFill(e.fill) }, i)) })] }) })] }), _jsxs("div", { className: "bg-background p-4", children: [_jsx("p", { className: "text-[13px] font-medium mb-1", children: "Severity distribution" }), _jsx("p", { className: "text-[12px] text-muted-foreground mb-4", children: "Breakdown by severity level" }), _jsx(ChartContainer, { config: severityChartConfig, className: "h-[220px] w-full", children: _jsxs(PieChart, { children: [_jsx(ChartTooltip, { content: _jsx(ChartTooltipContent, {}) }), _jsx(Pie, { data: severityData, dataKey: "value", nameKey: "name", cx: "50%", cy: "50%", innerRadius: 50, outerRadius: 80, paddingAngle: 2, children: severityData.map((e, i) => _jsx(Cell, { ...getFill(e.fill) }, i)) })] }) })] }), _jsxs("div", { className: "bg-background p-4", children: [_jsx("p", { className: "text-[13px] font-medium mb-1", children: "Bug creation trend" }), _jsx("p", { className: "text-[12px] text-muted-foreground mb-4", children: "New bugs reported per day (last 30 days)" }), _jsx(ChartContainer, { config: trendChartConfig, className: "h-[220px] w-full", children: _jsxs(LineChart, { data: trendData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "hsl(var(--border))" }), _jsx(XAxis, { dataKey: "date", tick: { fontSize: 10 }, interval: 4, stroke: "hsl(var(--muted-foreground))" }), _jsx(YAxis, { allowDecimals: false, tick: { fontSize: 11 }, stroke: "hsl(var(--muted-foreground))" }), _jsx(ChartTooltip, { content: _jsx(ChartTooltipContent, {}) }), _jsx(Line, { type: "monotone", dataKey: "count", stroke: "hsl(234, 55%, 60%)", strokeWidth: 1.5, dot: { r: 2 } })] }) })] }), _jsxs("div", { className: "bg-background p-4", children: [_jsx("p", { className: "text-[13px] font-medium mb-1", children: "Open vs resolved" }), _jsx("p", { className: "text-[12px] text-muted-foreground mb-4", children: "Cumulative counts over the last 30 days" }), _jsx(ChartContainer, { config: areaChartConfig, className: "h-[220px] w-full", children: _jsxs(AreaChart, { data: areaData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "hsl(var(--border))" }), _jsx(XAxis, { dataKey: "date", tick: { fontSize: 10 }, interval: 4, stroke: "hsl(var(--muted-foreground))" }), _jsx(YAxis, { allowDecimals: false, tick: { fontSize: 11 }, stroke: "hsl(var(--muted-foreground))" }), _jsx(ChartTooltip, { content: _jsx(ChartTooltipContent, {}) }), _jsx(Area, { type: "monotone", dataKey: "open", stackId: "1", stroke: "hsl(38, 92%, 50%)", fill: `url(#${neonPatternId("hsl(38, 92%, 50%)")})`, fillOpacity: 1, strokeWidth: 1.5 }), _jsx(Area, { type: "monotone", dataKey: "resolved", stackId: "1", stroke: "hsl(142, 70%, 40%)", fill: `url(#${neonPatternId("hsl(142, 70%, 40%)")})`, fillOpacity: 1, strokeWidth: 1.5 })] }) })] }), _jsxs("div", { className: "bg-background p-4 lg:col-span-2", children: [_jsx("p", { className: "text-[13px] font-medium mb-1", children: "Severity by status" }), _jsx("p", { className: "text-[12px] text-muted-foreground mb-4", children: "How severity levels distribute across each status" }), _jsx(ChartContainer, { config: stackedChartConfig, className: "h-[220px] w-full", children: _jsxs(BarChart, { data: stackedData, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "hsl(var(--border))" }), _jsx(XAxis, { dataKey: "status", tick: { fontSize: 10 }, stroke: "hsl(var(--muted-foreground))" }), _jsx(YAxis, { allowDecimals: false, tick: { fontSize: 11 }, stroke: "hsl(var(--muted-foreground))" }), _jsx(ChartTooltip, { content: _jsx(ChartTooltipContent, {}) }), _jsx(Bar, { dataKey: "critical", stackId: "a", fill: `url(#${neonPatternId(SEVERITY_COLORS.critical)})`, stroke: SEVERITY_COLORS.critical, strokeWidth: 1.5, shape: (props) => {
                                                                    const { x, y, width, height, fill, stroke } = props;
                                                                    return (_jsxs("g", { children: [_jsx("rect", { x: x, y: y, width: width, height: height, fill: fill, stroke: "none" }), _jsx("line", { x1: x, y1: y + height, x2: x + width, y2: y + height, stroke: stroke, strokeWidth: 1.5 }), _jsx("line", { x1: x, y1: y, x2: x, y2: y + height, stroke: stroke, strokeWidth: 1.5 }), _jsx("line", { x1: x + width, y1: y, x2: x + width, y2: y + height, stroke: stroke, strokeWidth: 1.5 }), _jsx("line", { x1: x, y1: y, x2: x + width, y2: y, stroke: stroke, strokeWidth: 0.5 })] }));
                                                                } }), _jsx(Bar, { dataKey: "high", stackId: "a", fill: `url(#${neonPatternId(SEVERITY_COLORS.high)})`, stroke: SEVERITY_COLORS.high, strokeWidth: 1.5, shape: (props) => {
                                                                    const { x, y, width, height, fill, stroke } = props;
                                                                    return (_jsxs("g", { children: [_jsx("rect", { x: x, y: y, width: width, height: height, fill: fill, stroke: "none" }), _jsx("line", { x1: x, y1: y + height, x2: x + width, y2: y + height, stroke: stroke, strokeWidth: 0.5 }), _jsx("line", { x1: x, y1: y, x2: x, y2: y + height, stroke: stroke, strokeWidth: 1.5 }), _jsx("line", { x1: x + width, y1: y, x2: x + width, y2: y + height, stroke: stroke, strokeWidth: 1.5 }), _jsx("line", { x1: x, y1: y, x2: x + width, y2: y, stroke: stroke, strokeWidth: 0.5 })] }));
                                                                } }), _jsx(Bar, { dataKey: "medium", stackId: "a", fill: `url(#${neonPatternId(SEVERITY_COLORS.medium)})`, stroke: SEVERITY_COLORS.medium, strokeWidth: 1.5, shape: (props) => {
                                                                    const { x, y, width, height, fill, stroke } = props;
                                                                    return (_jsxs("g", { children: [_jsx("rect", { x: x, y: y, width: width, height: height, fill: fill, stroke: "none" }), _jsx("line", { x1: x, y1: y + height, x2: x + width, y2: y + height, stroke: stroke, strokeWidth: 0.5 }), _jsx("line", { x1: x, y1: y, x2: x, y2: y + height, stroke: stroke, strokeWidth: 1.5 }), _jsx("line", { x1: x + width, y1: y, x2: x + width, y2: y + height, stroke: stroke, strokeWidth: 1.5 }), _jsx("line", { x1: x, y1: y, x2: x + width, y2: y, stroke: stroke, strokeWidth: 0.5 })] }));
                                                                } }), _jsx(Bar, { dataKey: "low", stackId: "a", fill: `url(#${neonPatternId(SEVERITY_COLORS.low)})`, stroke: SEVERITY_COLORS.low, strokeWidth: 1.5, shape: (props) => {
                                                                    const { x, y, width, height, fill, stroke } = props;
                                                                    return (_jsxs("g", { children: [_jsx("rect", { x: x, y: y, width: width, height: height, fill: fill, stroke: "none" }), _jsx("line", { x1: x, y1: y + height, x2: x + width, y2: y + height, stroke: stroke, strokeWidth: 0.5 }), _jsx("line", { x1: x, y1: y, x2: x, y2: y + height, stroke: stroke, strokeWidth: 1.5 }), _jsx("line", { x1: x + width, y1: y, x2: x + width, y2: y + height, stroke: stroke, strokeWidth: 1.5 }), _jsx("line", { x1: x, y1: y, x2: x + width, y2: y, stroke: stroke, strokeWidth: 1.5 })] }));
                                                                } })] }) })] })] })] })] })] }) }));
}
