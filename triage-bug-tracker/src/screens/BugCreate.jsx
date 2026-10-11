"use client";

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "@/lib/router-compat";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Constants } from "@/integrations/supabase/types";
export default function BugCreate() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        title: "", description: "", steps_to_reproduce: "",
        expected_behavior: "", actual_behavior: "",
        severity: "medium", environment: "",
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user)
            return;
        const trimmed = {
            title: form.title.trim(), description: form.description.trim(),
            steps_to_reproduce: form.steps_to_reproduce.trim(),
            expected_behavior: form.expected_behavior.trim(),
            actual_behavior: form.actual_behavior.trim(),
            severity: form.severity, environment: form.environment.trim(),
        };
        if (!trimmed.title || !trimmed.description) {
            toast({ title: "Missing fields", description: "Title and description are required.", variant: "destructive" });
            return;
        }
        setSubmitting(true);
        try {
            const { data, error } = await supabase
                .from("bugs").insert({ ...trimmed, reporter_id: user.id }).select("tracking_id").single();
            if (error)
                throw error;
            toast({ title: "Bug reported!", description: `Tracking ID: ${data.tracking_id}` });
            navigate("/");
        }
        catch (error) {
            toast({ title: "Failed to create bug", description: error.message, variant: "destructive" });
        }
        finally {
            setSubmitting(false);
        }
    };
    const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));
    return (_jsx(AppLayout, { children: _jsxs("div", { className: "flex flex-col h-full", children: [_jsxs("div", { className: "flex items-center gap-2 px-4 md:px-6 h-11 border-b border-border shrink-0", children: [_jsx(Button, { variant: "ghost", size: "icon", onClick: () => navigate(-1), className: "h-7 w-7", children: _jsx(ArrowLeft, { className: "h-3.5 w-3.5" }) }), _jsx("h1", { className: "text-[13px] font-medium", children: "Report a Bug" })] }), _jsx("div", { className: "flex-1 overflow-auto", children: _jsxs("form", { onSubmit: handleSubmit, className: "max-w-2xl", children: [_jsxs("div", { className: "px-4 md:px-6 py-4 border-b border-border space-y-1", children: [_jsx(Label, { className: "text-[12px] text-muted-foreground", children: "Title *" }), _jsx(Input, { placeholder: "Brief summary of the bug", value: form.title, onChange: (e) => update("title", e.target.value), required: true, maxLength: 200, className: "h-8 text-[13px] border-none shadow-none px-0 focus-visible:ring-0 font-medium text-base" })] }), _jsxs("div", { className: "px-4 md:px-6 py-4 border-b border-border space-y-1", children: [_jsx(Label, { className: "text-[12px] text-muted-foreground", children: "Description *" }), _jsx(Textarea, { placeholder: "Detailed description of the issue", value: form.description, onChange: (e) => update("description", e.target.value), required: true, rows: 4, maxLength: 5000, className: "text-[13px] border-none shadow-none px-0 focus-visible:ring-0 resize-none" })] }), _jsxs("div", { className: "px-4 md:px-6 py-4 border-b border-border space-y-1", children: [_jsx(Label, { className: "text-[12px] text-muted-foreground", children: "Steps to Reproduce" }), _jsx(Textarea, { placeholder: "1. Go to...\n2. Click on...\n3. Observe...", value: form.steps_to_reproduce, onChange: (e) => update("steps_to_reproduce", e.target.value), rows: 3, maxLength: 5000, className: "text-[13px] border-none shadow-none px-0 focus-visible:ring-0 resize-none" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2", children: [_jsxs("div", { className: "px-4 md:px-6 py-4 border-b border-border md:border-r space-y-1", children: [_jsx(Label, { className: "text-[12px] text-muted-foreground", children: "Expected Behavior" }), _jsx(Textarea, { placeholder: "What should happen?", value: form.expected_behavior, onChange: (e) => update("expected_behavior", e.target.value), rows: 2, maxLength: 2000, className: "text-[13px] border-none shadow-none px-0 focus-visible:ring-0 resize-none" })] }), _jsxs("div", { className: "px-4 md:px-6 py-4 border-b border-border space-y-1", children: [_jsx(Label, { className: "text-[12px] text-muted-foreground", children: "Actual Behavior" }), _jsx(Textarea, { placeholder: "What happened instead?", value: form.actual_behavior, onChange: (e) => update("actual_behavior", e.target.value), rows: 2, maxLength: 2000, className: "text-[13px] border-none shadow-none px-0 focus-visible:ring-0 resize-none" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2", children: [_jsxs("div", { className: "px-4 md:px-6 py-4 border-b border-border md:border-r space-y-1", children: [_jsx(Label, { className: "text-[12px] text-muted-foreground", children: "Severity *" }), _jsxs(Select, { value: form.severity, onValueChange: (v) => update("severity", v), children: [_jsx(SelectTrigger, { className: "h-8 text-[13px] border-none shadow-none px-0", children: _jsx(SelectValue, {}) }), _jsx(SelectContent, { children: Constants.public.Enums.bug_severity.map((s) => (_jsx(SelectItem, { value: s, children: s.charAt(0).toUpperCase() + s.slice(1) }, s))) })] })] }), _jsxs("div", { className: "px-4 md:px-6 py-4 border-b border-border space-y-1", children: [_jsx(Label, { className: "text-[12px] text-muted-foreground", children: "Environment" }), _jsx(Input, { placeholder: "e.g. Chrome 120, macOS 14", value: form.environment, onChange: (e) => update("environment", e.target.value), maxLength: 200, className: "h-8 text-[13px] border-none shadow-none px-0 focus-visible:ring-0" })] })] }), _jsxs("div", { className: "px-4 md:px-6 py-4 flex gap-2", children: [_jsx(Button, { type: "button", variant: "ghost", onClick: () => navigate(-1), size: "sm", className: "h-8 text-[13px]", children: "Cancel" }), _jsxs(Button, { type: "submit", disabled: submitting, size: "sm", className: "h-8 text-[13px]", children: [submitting && _jsx(Loader2, { className: "mr-1.5 h-3.5 w-3.5 animate-spin" }), "Submit Bug Report"] })] })] }) })] }) }));
}
