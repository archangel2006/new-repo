"use client";

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Navigate, Link, useSearchParams } from "@/lib/router-compat";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { StackedLogo } from "@/components/StackedLogo";
import { useToast } from "@/hooks/use-toast";
import { lovable } from "@/integrations/lovable/index";
export default function Auth() {
    const { user, loading, signIn, signUp } = useAuth();
    const [searchParams] = useSearchParams();
    const rawNext = searchParams.get("next") ?? "";
    const nextPath = /^\/(?!\/)/.test(rawNext) ? rawNext : "/";
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [signupName, setSignupName] = useState("");
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    if (loading) {
        return (_jsx("div", { className: "flex min-h-screen items-center justify-center bg-background", children: _jsx(Loader2, { className: "h-5 w-5 animate-spin text-muted-foreground" }) }));
    }
    if (user)
        return _jsx(Navigate, { to: nextPath, replace: true });
    const handleGoogleSignIn = async () => {
        setIsGoogleLoading(true);
        try {
            const { error } = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}/auth?next=${encodeURIComponent(nextPath)}` });
            if (error)
                toast({ title: "Google sign-in failed", description: error.message, variant: "destructive" });
        }
        catch (error) {
            toast({ title: "Google sign-in failed", description: error.message, variant: "destructive" });
        }
        finally {
            setIsGoogleLoading(false);
        }
    };
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await signIn(loginEmail, loginPassword);
            toast({ title: "Welcome back!" });
        }
        catch (error) {
            toast({ title: "Login failed", description: error.message, variant: "destructive" });
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleSignup = async (e) => {
        e.preventDefault();
        if (signupPassword.length < 6) {
            toast({ title: "Password too short", description: "Minimum 6 characters", variant: "destructive" });
            return;
        }
        setIsSubmitting(true);
        try {
            await signUp(signupEmail, signupPassword, signupName, `${window.location.origin}/auth?next=${encodeURIComponent(nextPath)}`);
            toast({ title: "Account created!", description: "Check your email to confirm your account." });
        }
        catch (error) {
            toast({ title: "Signup failed", description: error.message, variant: "destructive" });
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsx("div", { className: "flex min-h-screen items-center justify-center bg-background p-4", children: _jsxs("div", { className: "w-full max-w-[420px] border border-border rounded-md p-8 space-y-6", children: [_jsxs("div", { className: "flex flex-col items-start gap-3", children: [_jsxs(Link, { to: "/", className: "flex items-center gap-2 hover:opacity-80 transition-opacity", children: [_jsx(StackedLogo, { size: 16 }), _jsx("span", { className: "text-[14px] font-bold text-foreground tracking-[0.08em] uppercase", children: "Triage" })] }), _jsx("p", { className: "text-[13px] text-muted-foreground", children: "Track, prioritize, and resolve bugs" })] }), _jsxs(Button, { variant: "outline", className: "w-full h-9 gap-2 text-[13px]", onClick: handleGoogleSignIn, disabled: isGoogleLoading, children: [isGoogleLoading ? (_jsx(Loader2, { className: "h-3.5 w-3.5 animate-spin" })) : (_jsxs("svg", { className: "h-3.5 w-3.5", viewBox: "0 0 24 24", children: [_jsx("path", { d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z", fill: "#4285F4" }), _jsx("path", { d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z", fill: "#34A853" }), _jsx("path", { d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z", fill: "#FBBC05" }), _jsx("path", { d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z", fill: "#EA4335" })] })), "Continue with Google"] }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-0 flex items-center", children: _jsx("span", { className: "w-full border-t border-border" }) }), _jsx("div", { className: "relative flex justify-center text-[11px] uppercase", children: _jsx("span", { className: "bg-background px-2 text-muted-foreground", children: "or" }) })] }), _jsxs(Tabs, { defaultValue: "login", children: [_jsxs(TabsList, { className: "grid w-full grid-cols-2 h-9 p-0.5", children: [_jsx(TabsTrigger, { value: "login", className: "text-[12px]", children: "Sign in" }), _jsx(TabsTrigger, { value: "signup", className: "text-[12px]", children: "Sign up" })] }), _jsx(TabsContent, { value: "login", className: "mt-4", children: _jsxs("form", { onSubmit: handleLogin, className: "space-y-3", children: [_jsxs("div", { className: "space-y-1", children: [_jsx(Label, { className: "text-[12px]", children: "Email" }), _jsx(Input, { type: "email", placeholder: "you@example.com", value: loginEmail, onChange: (e) => setLoginEmail(e.target.value), required: true, className: "h-8 text-[13px]" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx(Label, { className: "text-[12px]", children: "Password" }), _jsx(Input, { type: "password", placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", value: loginPassword, onChange: (e) => setLoginPassword(e.target.value), required: true, className: "h-8 text-[13px]" })] }), _jsxs(Button, { type: "submit", className: "w-full h-8 text-[13px]", disabled: isSubmitting, children: [isSubmitting && _jsx(Loader2, { className: "mr-1.5 h-3.5 w-3.5 animate-spin" }), "Sign In"] })] }) }), _jsx(TabsContent, { value: "signup", className: "mt-4", children: _jsxs("form", { onSubmit: handleSignup, className: "space-y-3", children: [_jsxs("div", { className: "space-y-1", children: [_jsx(Label, { className: "text-[12px]", children: "Full Name" }), _jsx(Input, { type: "text", placeholder: "Jane Doe", value: signupName, onChange: (e) => setSignupName(e.target.value), required: true, className: "h-8 text-[13px]" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx(Label, { className: "text-[12px]", children: "Email" }), _jsx(Input, { type: "email", placeholder: "you@example.com", value: signupEmail, onChange: (e) => setSignupEmail(e.target.value), required: true, className: "h-8 text-[13px]" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx(Label, { className: "text-[12px]", children: "Password" }), _jsx(Input, { type: "password", placeholder: "Min 6 characters", value: signupPassword, onChange: (e) => setSignupPassword(e.target.value), required: true, minLength: 6, className: "h-8 text-[13px]" })] }), _jsxs(Button, { type: "submit", className: "w-full h-8 text-[13px]", disabled: isSubmitting, children: [isSubmitting && _jsx(Loader2, { className: "mr-1.5 h-3.5 w-3.5 animate-spin" }), "Create Account"] })] }) })] }), _jsxs("p", { className: "text-left text-[11px] text-muted-foreground pt-2", children: ["\u00A9 ", new Date().getFullYear(), " Triage"] })] }) }));
}
