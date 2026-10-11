"use client";

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { AppSidebar, SidebarContent } from "./AppSidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { StackedLogo } from "./StackedLogo";
export function AppLayout({ children }) {
    const [open, setOpen] = useState(false);
    return (_jsxs("div", { className: "flex min-h-screen", children: [_jsx(AppSidebar, {}), _jsxs("div", { className: "flex-1 flex flex-col min-w-0", children: [_jsxs("header", { className: "sticky top-0 z-40 flex md:hidden items-center justify-between h-11 border-b border-border bg-background px-3", children: [_jsxs(Sheet, { open: open, onOpenChange: setOpen, children: [_jsx(SheetTrigger, { asChild: true, children: _jsx(Button, { variant: "ghost", size: "icon", className: "h-7 w-7", children: _jsx(Menu, { className: "h-4 w-4" }) }) }), _jsx(SheetContent, { side: "left", className: "p-0 w-52 bg-sidebar", children: _jsx("div", { className: "flex flex-col h-full", children: _jsx(SidebarContent, { onNavigate: () => setOpen(false) }) }) })] }), _jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(StackedLogo, { size: 16 }), _jsx("span", { className: "font-bold uppercase tracking-[0.08em] text-[14px] text-foreground", children: "Triage" })] }), _jsx("div", { className: "w-7" })] }), _jsx("main", { className: "flex-1 overflow-auto", children: children })] })] }));
}
