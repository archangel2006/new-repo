"use client";

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    return (_jsxs(Button, { variant: "ghost", size: "sm", onClick: () => setTheme(theme === "dark" ? "light" : "dark"), className: "text-sidebar-foreground hover:bg-sidebar-accent h-7 w-full justify-start gap-2 px-2 text-[12px]", children: [_jsx(Sun, { className: "h-3.5 w-3.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" }), _jsx(Moon, { className: "absolute h-3.5 w-3.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 ml-0" }), _jsx("span", { className: "dark:ml-5", children: "Theme" })] }));
}
