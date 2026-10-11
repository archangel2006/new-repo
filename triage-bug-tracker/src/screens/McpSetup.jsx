"use client";

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Check, Copy, MessageSquare, Plug, Search, Pencil } from "lucide-react";
const MCP_URL = "https://lrgmfqitxacgebmytumk.supabase.co/functions/v1/mcp";
const steps = [
    {
        title: "Copy the server URL",
        body: "This is the address of Triage's MCP server. You'll paste it into Claude in the next step.",
    },
    {
        title: "Add it in Claude",
        body: "In Claude (web or desktop), go to Settings → Connectors → Add custom connector. Give it a name like “Triage” and paste the server URL.",
    },
    {
        title: "Sign in",
        body: "Claude will ask you to approve access. Sign in with your Triage account and approve — this connects Claude to your team's bugs with your own permissions.",
    },
    {
        title: "Start chatting",
        body: "Once connected, just ask Claude about bugs in plain language. It can file, read, and update bugs for you.",
    },
];
const examples = [
    {
        icon: MessageSquare,
        label: "File a bug",
        prompt: "File a bug: the export button on the analytics page does nothing in Safari. Severity high.",
    },
    {
        icon: Search,
        label: "Read bugs",
        prompt: "Show me all critical bugs that are still open.",
    },
    {
        icon: Pencil,
        label: "Update a bug",
        prompt: "Mark BUG-1042 as resolved and add a comment saying the fix shipped in v2.3.",
    },
];
export default function McpSetup() {
    const [copied, setCopied] = useState(false);
    const copyUrl = async () => {
        try {
            await navigator.clipboard.writeText(MCP_URL);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
        catch {
            // clipboard unavailable — user can select the text manually
        }
    };
    return (_jsx(AppLayout, { children: _jsxs("div", { className: "max-w-2xl mx-auto px-6 py-10", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx(Plug, { className: "h-4 w-4 text-muted-foreground" }), _jsx("h1", { className: "text-lg font-semibold text-foreground", children: "Connect to Claude" })] }), _jsx("p", { className: "text-sm text-muted-foreground mb-8", children: "Triage has a built-in MCP server, so you can file, read, and update bugs straight from a Claude conversation \u2014 without opening the app." }), _jsxs("div", { className: "rounded-md border border-border bg-card p-4 mb-8", children: [_jsx("p", { className: "text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2", children: "Server URL" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("code", { className: "flex-1 text-xs text-foreground bg-muted rounded px-3 py-2 overflow-x-auto whitespace-nowrap", children: MCP_URL }), _jsxs(Button, { variant: "outline", size: "sm", onClick: copyUrl, className: "shrink-0", children: [copied ? _jsx(Check, { className: "h-3.5 w-3.5" }) : _jsx(Copy, { className: "h-3.5 w-3.5" }), _jsx("span", { className: "ml-1.5", children: copied ? "Copied" : "Copy" })] })] })] }), _jsx("h2", { className: "text-sm font-semibold text-foreground mb-3", children: "Setup" }), _jsx("ol", { className: "space-y-3 mb-10", children: steps.map((step, i) => (_jsxs("li", { className: "flex gap-3 rounded-md border border-border bg-card p-4", children: [_jsx("span", { className: "flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-foreground", children: i + 1 }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-foreground", children: step.title }), _jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: step.body })] })] }, step.title))) }), _jsx("h2", { className: "text-sm font-semibold text-foreground mb-3", children: "What you can ask" }), _jsx("div", { className: "space-y-3", children: examples.map((ex) => (_jsxs("div", { className: "rounded-md border border-border bg-card p-4", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1.5", children: [_jsx(ex.icon, { className: "h-3.5 w-3.5 text-muted-foreground" }), _jsx("span", { className: "text-xs font-medium uppercase tracking-wide text-muted-foreground", children: ex.label })] }), _jsxs("p", { className: "text-sm text-foreground italic", children: ["\u201C", ex.prompt, "\u201D"] })] }, ex.label))) }), _jsx("p", { className: "text-xs text-muted-foreground mt-8", children: "Claude acts as you \u2014 it can only see and change what your Triage account can. You can disconnect anytime from Claude's connector settings." })] }) }));
}
