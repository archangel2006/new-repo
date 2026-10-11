"use client";

import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { LayoutDashboard, Plus, Bug, BarChart3, Settings, LogOut, Plug } from "lucide-react";
import { StackedLogo } from "./StackedLogo";
import { Link, useLocation } from "@/lib/router-compat";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
export const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Plus, label: "Report Bug", path: "/bugs/new" },
    { icon: Bug, label: "All Bugs", path: "/bugs" },
    { icon: BarChart3, label: "Analytics", path: "/analytics" },
    { icon: Plug, label: "Connect to Claude", path: "/mcp-setup" },
    { icon: Settings, label: "Settings", path: "/settings" },
];
export function SidebarContent({ collapsed = false, onNavigate }) {
    const location = useLocation();
    const { profile, signOut } = useAuth();
    const initials = profile?.full_name
        ? profile.full_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
        : "U";
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-center gap-2 px-3 h-11 border-b border-sidebar-border", children: [_jsx(StackedLogo, { size: 16, color: "currentColor" }), !collapsed && (_jsx("span", { className: "font-bold uppercase tracking-[0.08em] text-[14px] text-sidebar-accent-foreground", children: "Triage" }))] }), _jsx("nav", { className: "flex-1 py-1.5 px-1.5 space-y-px", children: navItems.map((item) => {
                    const isActive = location.pathname === item.path ||
                        (item.path !== "/" && location.pathname.startsWith(item.path));
                    return (_jsxs(Link, { to: item.path, onClick: onNavigate, className: cn("flex items-center gap-2 px-2 py-1.5 rounded text-[13px] transition-colors", isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"), children: [_jsx(item.icon, { className: "h-4 w-4 shrink-0" }), !collapsed && _jsx("span", { children: item.label })] }, item.path));
                }) }), _jsx("div", { className: "border-t border-sidebar-border p-2", children: _jsxs("div", { className: "flex items-center gap-2 px-1", children: [_jsx(Avatar, { className: "h-5 w-5", children: _jsx(AvatarFallback, { className: "bg-sidebar-primary text-sidebar-primary-foreground text-[9px] leading-none", children: initials }) }), !collapsed && (_jsx("span", { className: "text-[12px] text-sidebar-foreground truncate flex-1", children: profile?.full_name || "User" })), !collapsed && (_jsx(Button, { variant: "ghost", size: "icon", onClick: signOut, className: "text-sidebar-foreground hover:bg-sidebar-accent h-6 w-6", children: _jsx(LogOut, { className: "h-3 w-3" }) }))] }) })] }));
}
export function AppSidebar() {
    return (_jsx("aside", { className: "hidden md:flex flex-col bg-sidebar border-r border-sidebar-border h-screen sticky top-0 w-52", children: _jsx("div", { className: "flex flex-col flex-1 overflow-hidden", children: _jsx(SidebarContent, {}) }) }));
}
