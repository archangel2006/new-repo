"use client";

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "@/lib/router-compat";
import { ArrowRight, Moon, Sun } from "lucide-react";
import dynamic from "next/dynamic";
import testimonialAvatarAsset from "@/assets/testimonial-avatar.jpg.asset.json";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { StackedLogo } from "@/components/StackedLogo";
import { ProductPreview, FeatureSections } from "@/components/landing/LandingSections";
const Logo3D = dynamic(
    () => import("@/components/Logo3D").then((module) => module.Logo3D),
    { ssr: false },
);
/** Apply slate accent on mount */
const SLATE_HSL = "215 16% 47%";
const SLATE_DARK = "215 14% 55%";
const LOGO_VARIANT = 1;
const CUBE_SIZE = 840;
const CUBE_OFFSET_X = -140;
const CUBE_OFFSET_Y = -80;
const Landing = () => {
    const { theme, setTheme } = useTheme();
    const [cubeZoom, setCubeZoom] = useState(() => {
        const w = typeof window === "undefined" ? 1280 : window.innerWidth;
        return w < 1024 ? 270 : 360;
    });
    useEffect(() => {
        const handleResize = () => {
            setCubeZoom(window.innerWidth < 1024 ? 270 : 360);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const isDark = theme === "dark";
    const diagonalLineColor = isDark ? "hsl(240 4% 26%" : "hsl(240 4% 80%";
    useEffect(() => {
        const root = document.documentElement;
        const isDark = theme === "dark";
        const hsl = isDark ? SLATE_DARK : SLATE_HSL;
        root.style.setProperty("--primary", hsl);
        root.style.setProperty("--ring", hsl);
        root.style.setProperty("--sidebar-primary", hsl);
        root.style.setProperty("--sidebar-ring", hsl);
    }, [theme]);
    return (_jsxs("div", { className: "min-h-screen bg-background text-foreground overflow-x-hidden", children: [_jsx("nav", { className: "fixed top-0 z-50 w-full bg-background border-b border-border px-6", children: _jsxs("div", { className: "mx-auto flex h-[56px] max-w-[1200px] items-center justify-between", children: [_jsxs(Link, { to: "/", className: "flex items-center gap-2 -ml-0.5", children: [_jsx(StackedLogo, { size: 16 }), _jsx("span", { className: "text-[14px] font-bold text-foreground tracking-[0.08em] uppercase", children: "Triage" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("button", { onClick: () => setTheme(theme === "dark" ? "light" : "dark"), className: "h-8 w-8 flex items-center justify-center text-foreground/70 hover:text-foreground transition-colors", title: "Toggle theme", children: [_jsx(Sun, { className: "h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" }), _jsx(Moon, { className: "absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" })] }), _jsx(Link, { to: "/auth", children: _jsx("button", { className: "text-[13px] text-foreground/70 hover:text-foreground transition-colors h-8 px-3", children: "Log in" }) }), _jsx(Link, { to: "/auth", children: _jsx("button", { className: "text-[13px] h-8 px-3 border border-foreground/40 text-foreground hover:bg-foreground hover:text-background transition-colors", children: "Sign up" }) })] })] }) }), _jsx("section", { className: "relative z-10 pt-16 pb-0 px-6 overflow-hidden", children: _jsxs("div", { className: "mx-auto max-w-[1200px] relative", children: [_jsxs("div", { className: "pt-[52px] pb-16 relative flex", children: [_jsxs("div", { className: "relative z-[3] flex-1 min-w-0 max-w-[540px]", children: [_jsx("h1", { className: "text-[clamp(2rem,4vw,3.2rem)] font-[500] leading-[1.08] tracking-[-0.04em] text-foreground max-w-[540px]", children: "Bug tracking for teams that ship fast" }), _jsx("p", { className: "mt-6 text-base leading-relaxed text-muted-foreground max-w-[420px]", children: "Purpose-built for engineering teams. Triage, track, and resolve issues without slowing down." }), _jsx("div", { className: "mt-10 flex items-center gap-4", children: _jsx(Link, { to: "/auth", children: _jsxs("button", { className: "group relative inline-flex items-center gap-2 px-6 py-3 text-[14px] font-medium bg-foreground text-background transition-all duration-200 hover:bg-foreground/90", children: ["Get started free", _jsx(ArrowRight, { className: "h-4 w-4 transition-transform group-hover:translate-x-0.5" })] }) }) })] }), _jsx("div", { className: "hidden md:block flex-1 relative z-[1] pointer-events-none", style: { minWidth: 0 }, children: _jsx("div", { className: "absolute top-1/2 right-0 -translate-y-1/2", style: { width: CUBE_SIZE, height: CUBE_SIZE, transform: `translate(${-CUBE_OFFSET_X}px, calc(-50% + ${CUBE_OFFSET_Y}px))` }, children: _jsx(Logo3D, { variant: LOGO_VARIANT, size: CUBE_SIZE, zoom: cubeZoom, bgHex: theme === "dark" ? "#0e0e10" : "#ffffff", lineHex: theme === "dark" ? "#58585e" : "#c0c0c8" }) }) })] }), _jsx(ProductPreview, {})] }) }), _jsx("div", { className: "relative z-10 w-full border-t border-border" }), _jsx(FeatureSections, {}), _jsx("div", { className: "relative z-10 w-full border-t border-border" }), _jsxs("section", { className: "relative z-10 py-24 px-6 overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 pointer-events-none", style: {
                            backgroundImage: `repeating-linear-gradient(
              -45deg,
              ${diagonalLineColor} / 0.55) 0px,
              ${diagonalLineColor} / 0.55) 1px,
              transparent 1px,
              transparent 8px
            )`,
                            backgroundSize: "100% 100%",
                        } }), _jsx("div", { className: "mx-auto max-w-[1200px] relative", children: _jsxs("div", { className: "border border-border bg-background p-10 max-w-[720px] mx-auto", children: [_jsx("blockquote", { className: "text-[20px] font-[400] leading-[1.5] tracking-[-0.01em] text-foreground/85", children: "\"We replaced three tools with one. Mean time to resolution dropped 40% in the first month. The team actually uses it \u2014 that's the real win.\"" }), _jsxs("div", { className: "mt-6 flex items-center gap-3", children: [_jsx("img", { src: testimonialAvatarAsset.url, alt: "Jamie Kim", className: "h-8 w-8 rounded-full object-cover" }), _jsxs("div", { children: [_jsx("span", { className: "text-[13px] font-medium text-foreground", children: "Jamie Kim" }), _jsx("span", { className: "text-[13px] text-muted-foreground ml-2", children: "Engineering Lead, Acme Corp" })] })] })] }) })] }), _jsx("div", { className: "relative z-10 w-full border-t border-border" }), _jsx("section", { className: "relative z-10 pt-32 pb-40 px-6 overflow-hidden", children: _jsxs("div", { className: "mx-auto max-w-[1200px] text-center relative", children: [_jsx("h2", { className: "text-[clamp(2rem,4vw,3.2rem)] font-[500] tracking-[-0.035em] text-foreground leading-[1.1] mx-auto max-w-[560px]", children: "Your bugs aren't going to track themselves." }), _jsxs("p", { className: "mt-5 text-[15px] text-muted-foreground max-w-[400px] mx-auto", children: ["Two minutes to set up. No credit card. No sales call.", _jsx("br", {}), "Just fewer bugs, starting now."] }), _jsx("div", { className: "mt-10 flex justify-center", children: _jsx(Link, { to: "/auth", children: _jsxs("button", { className: "group relative inline-flex items-center gap-2.5 px-8 py-3.5 text-[15px] font-medium transition-all duration-200 border border-foreground/40 text-foreground hover:bg-foreground hover:text-background hover:border-foreground", children: ["Start tracking now", _jsx(ArrowRight, { className: "h-4 w-4 transition-transform group-hover:translate-x-1" })] }) }) })] }) }), _jsx("div", { className: "relative z-10 border-t border-border", children: _jsxs("div", { className: "mx-auto max-w-[1200px] px-6 py-6 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2 -ml-0.5", children: [_jsx(StackedLogo, { size: 16 }), _jsx("span", { className: "text-[12px] font-bold text-foreground uppercase tracking-[0.08em]", children: "Triage" })] }), _jsxs("span", { className: "text-[12px] text-muted-foreground", children: ["\u00A9 ", new Date().getFullYear()] })] }) })] }));
};
export default Landing;
