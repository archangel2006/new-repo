"use client";

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { User, Building2, Users, Bell, Settings as SettingsIcon, Mail, Trash2, Shield, Send, AlertTriangle, Loader2, Camera } from "lucide-react";
// ─── Profile Tab ────────────────────────────────────────────────────────────────
function ProfileTab() {
    const { user, profile, refreshProfile } = useAuth();
    const [fullName, setFullName] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [saving, setSaving] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [changingPassword, setChangingPassword] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const handleAvatarUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file || !user)
            return;
        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        if (!allowedTypes.includes(file.type)) {
            toast({ title: "Invalid file type", description: "Please upload a JPG, PNG, WebP, or GIF image.", variant: "destructive" });
            return;
        }
        const maxSize = 5 * 1024 * 1024; // 5 MB
        if (file.size > maxSize) {
            toast({ title: "File too large", description: "Avatar must be under 5 MB.", variant: "destructive" });
            return;
        }
        const allowedExts = ["jpg", "jpeg", "png", "webp", "gif"];
        const fileExt = (file.name.split(".").pop() || "").toLowerCase();
        if (!allowedExts.includes(fileExt)) {
            toast({ title: "Invalid file extension", description: "Please upload a JPG, PNG, WebP, or GIF image.", variant: "destructive" });
            return;
        }
        setUploadingAvatar(true);
        const filePath = `${user.id}/avatar.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file, { upsert: true });
        if (uploadError) {
            toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
            setUploadingAvatar(false);
            return;
        }
        const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(filePath);
        const avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`;
        const { error: updateError } = await supabase.from("profiles").update({ avatar_url: avatarUrl }).eq("user_id", user.id);
        setUploadingAvatar(false);
        if (updateError)
            toast({ title: "Error", description: updateError.message, variant: "destructive" });
        else {
            toast({ title: "Avatar updated" });
            await refreshProfile();
        }
    };
    useEffect(() => {
        if (profile) {
            setFullName(profile.full_name || "");
            setJobTitle(profile.job_title || "");
        }
    }, [profile]);
    const initials = fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    const handleSaveProfile = async () => {
        if (!user)
            return;
        setSaving(true);
        const { error } = await supabase.from("profiles").update({ full_name: fullName, job_title: jobTitle }).eq("user_id", user.id);
        setSaving(false);
        if (error)
            toast({ title: "Error", description: error.message, variant: "destructive" });
        else {
            toast({ title: "Profile updated" });
            await refreshProfile();
        }
    };
    const handleChangePassword = async () => {
        if (!newPassword || newPassword.length < 6) {
            toast({ title: "Error", description: "Password must be at least 6 characters.", variant: "destructive" });
            return;
        }
        setChangingPassword(true);
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        setChangingPassword(false);
        if (error)
            toast({ title: "Error", description: error.message, variant: "destructive" });
        else {
            toast({ title: "Password updated" });
            setNewPassword("");
        }
    };
    return (_jsxs("div", { className: "divide-y divide-border", children: [_jsxs("div", { className: "px-4 md:px-6 py-4", children: [_jsx("p", { className: "text-[12px] text-muted-foreground font-medium mb-3", children: "Profile Information" }), _jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsxs("div", { className: "relative group", children: [_jsxs(Avatar, { className: "h-10 w-10", children: [_jsx(AvatarImage, { src: profile?.avatar_url || "", className: "object-contain" }), _jsx(AvatarFallback, { className: "text-[12px]", children: initials || "?" })] }), _jsx("label", { htmlFor: "avatar-upload", className: "absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer", children: uploadingAvatar ? _jsx(Loader2, { className: "h-3.5 w-3.5 animate-spin text-white" }) : _jsx(Camera, { className: "h-3.5 w-3.5 text-white" }) }), _jsx("input", { id: "avatar-upload", type: "file", accept: "image/*", className: "hidden", onChange: handleAvatarUpload, disabled: uploadingAvatar })] }), _jsxs("div", { children: [_jsx("p", { className: "text-[13px] font-medium", children: fullName || "Your Name" }), _jsx("p", { className: "text-[12px] text-muted-foreground", children: user?.email })] })] }), _jsxs("div", { className: "grid gap-3 sm:grid-cols-2 max-w-lg", children: [_jsxs("div", { className: "space-y-1", children: [_jsx(Label, { className: "text-[12px]", children: "Full Name" }), _jsx(Input, { value: fullName, onChange: (e) => setFullName(e.target.value), placeholder: "John Doe", className: "h-8 text-[13px]" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx(Label, { className: "text-[12px]", children: "Job Title" }), _jsx(Input, { value: jobTitle, onChange: (e) => setJobTitle(e.target.value), placeholder: "Software Engineer", className: "h-8 text-[13px]" })] })] }), _jsxs(Button, { onClick: handleSaveProfile, disabled: saving, size: "sm", className: "h-7 text-[12px] mt-3", children: [saving && _jsx(Loader2, { className: "mr-1.5 h-3 w-3 animate-spin" }), " Save"] })] }), _jsxs("div", { className: "px-4 md:px-6 py-4", children: [_jsx("p", { className: "text-[12px] text-muted-foreground font-medium mb-3", children: "Change Password" }), _jsxs("div", { className: "max-w-xs space-y-1", children: [_jsx(Label, { className: "text-[12px]", children: "New Password" }), _jsx(Input, { type: "password", value: newPassword, onChange: (e) => setNewPassword(e.target.value), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", className: "h-8 text-[13px]" })] }), _jsxs(Button, { onClick: handleChangePassword, disabled: changingPassword, variant: "outline", size: "sm", className: "h-7 text-[12px] mt-3", children: [changingPassword && _jsx(Loader2, { className: "mr-1.5 h-3 w-3 animate-spin" }), " Update Password"] })] })] }));
}
// ─── Company Tab ────────────────────────────────────────────────────────────────
function CompanyTab() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ company_name: "", company_website: "", industry: "", company_size: "", address: "", phone: "" });
    const [existingId, setExistingId] = useState(null);
    useEffect(() => {
        if (!user)
            return;
        supabase.from("company_settings").select("*").eq("user_id", user.id).maybeSingle().then(({ data }) => {
            if (data) {
                setForm({ company_name: data.company_name || "", company_website: data.company_website || "", industry: data.industry || "", company_size: data.company_size || "", address: data.address || "", phone: data.phone || "" });
                setExistingId(data.id);
            }
            setLoading(false);
        });
    }, [user]);
    const handleSave = async () => {
        if (!user)
            return;
        setSaving(true);
        if (existingId) {
            const { error } = await supabase.from("company_settings").update(form).eq("id", existingId);
            if (error)
                toast({ title: "Error", description: error.message, variant: "destructive" });
            else
                toast({ title: "Company settings saved" });
        }
        else {
            const { data, error } = await supabase.from("company_settings").insert({ ...form, user_id: user.id }).select().single();
            if (error)
                toast({ title: "Error", description: error.message, variant: "destructive" });
            else {
                setExistingId(data.id);
                toast({ title: "Company settings created" });
            }
        }
        setSaving(false);
    };
    const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
    if (loading)
        return _jsx("div", { className: "flex justify-center py-12", children: _jsx(Loader2, { className: "h-4 w-4 animate-spin text-muted-foreground" }) });
    return (_jsxs("div", { className: "px-4 md:px-6 py-4", children: [_jsx("p", { className: "text-[12px] text-muted-foreground font-medium mb-3", children: "Company Information" }), _jsxs("div", { className: "grid gap-3 sm:grid-cols-2 max-w-lg", children: [_jsxs("div", { className: "space-y-1", children: [_jsx(Label, { className: "text-[12px]", children: "Company Name" }), _jsx(Input, { value: form.company_name, onChange: (e) => update("company_name", e.target.value), placeholder: "Acme Inc.", className: "h-8 text-[13px]" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx(Label, { className: "text-[12px]", children: "Website" }), _jsx(Input, { value: form.company_website, onChange: (e) => update("company_website", e.target.value), placeholder: "https://acme.com", className: "h-8 text-[13px]" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx(Label, { className: "text-[12px]", children: "Industry" }), _jsxs(Select, { value: form.industry, onValueChange: (v) => update("industry", v), children: [_jsx(SelectTrigger, { className: "h-8 text-[13px]", children: _jsx(SelectValue, { placeholder: "Select" }) }), _jsx(SelectContent, { children: ["Technology", "Healthcare", "Finance", "Education", "Retail", "Manufacturing", "Other"].map(i => _jsx(SelectItem, { value: i.toLowerCase(), children: i }, i)) })] })] }), _jsxs("div", { className: "space-y-1", children: [_jsx(Label, { className: "text-[12px]", children: "Company Size" }), _jsxs(Select, { value: form.company_size, onValueChange: (v) => update("company_size", v), children: [_jsx(SelectTrigger, { className: "h-8 text-[13px]", children: _jsx(SelectValue, { placeholder: "Select" }) }), _jsx(SelectContent, { children: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"].map(s => _jsx(SelectItem, { value: s, children: s }, s)) })] })] }), _jsxs("div", { className: "space-y-1 sm:col-span-2", children: [_jsx(Label, { className: "text-[12px]", children: "Address" }), _jsx(Input, { value: form.address, onChange: (e) => update("address", e.target.value), placeholder: "123 Main St", className: "h-8 text-[13px]" })] }), _jsxs("div", { className: "space-y-1", children: [_jsx(Label, { className: "text-[12px]", children: "Phone" }), _jsx(Input, { value: form.phone, onChange: (e) => update("phone", e.target.value), placeholder: "+1 (555) 000-0000", className: "h-8 text-[13px]" })] })] }), _jsxs(Button, { onClick: handleSave, disabled: saving, size: "sm", className: "h-7 text-[12px] mt-3", children: [saving && _jsx(Loader2, { className: "mr-1.5 h-3 w-3 animate-spin" }), " Save"] })] }));
}
// ─── Team Tab ───────────────────────────────────────────────────────────────────
function TeamTab() {
    const { user } = useAuth();
    const [members, setMembers] = useState([]);
    const [invitations, setInvitations] = useState([]);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState("user");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const fetchData = async () => {
        const [teamRes, invitationsRes] = await Promise.all([
            supabase.rpc("get_team_members"),
            supabase.from("invitations").select("*").eq("status", "pending"),
        ]);
        setMembers(teamRes.data || []);
        setInvitations(invitationsRes.data || []);
        setLoading(false);
    };
    useEffect(() => { fetchData(); }, []);
    const handleInvite = async () => {
        if (!user || !inviteEmail)
            return;
        setSending(true);
        const { error } = await supabase.from("invitations").insert({ email: inviteEmail, role: inviteRole, invited_by: user.id });
        setSending(false);
        if (error)
            toast({ title: "Error", description: error.message, variant: "destructive" });
        else {
            toast({ title: "Invitation sent", description: `Invited ${inviteEmail}` });
            setInviteEmail("");
            fetchData();
        }
    };
    const handleRevoke = async (id) => {
        const { error } = await supabase.from("invitations").delete().eq("id", id);
        if (error)
            toast({ title: "Error", description: error.message, variant: "destructive" });
        else {
            toast({ title: "Invitation revoked" });
            fetchData();
        }
    };
    if (loading)
        return _jsx("div", { className: "flex justify-center py-12", children: _jsx(Loader2, { className: "h-4 w-4 animate-spin text-muted-foreground" }) });
    return (_jsxs("div", { className: "divide-y divide-border", children: [_jsxs("div", { className: "px-4 md:px-6 py-4", children: [_jsx("p", { className: "text-[12px] text-muted-foreground font-medium mb-3", children: "Invite Team Member" }), _jsxs("div", { className: "flex gap-2 max-w-lg", children: [_jsx(Input, { placeholder: "colleague@company.com", value: inviteEmail, onChange: (e) => setInviteEmail(e.target.value), className: "h-8 text-[13px] flex-1" }), _jsxs(Select, { value: inviteRole, onValueChange: setInviteRole, children: [_jsx(SelectTrigger, { className: "w-[100px] h-8 text-[12px]", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "user", children: "User" }), _jsx(SelectItem, { value: "moderator", children: "Moderator" }), _jsx(SelectItem, { value: "admin", children: "Admin" })] })] }), _jsxs(Button, { onClick: handleInvite, disabled: sending || !inviteEmail, size: "sm", className: "h-8 text-[12px] gap-1", children: [sending ? _jsx(Loader2, { className: "h-3 w-3 animate-spin" }) : _jsx(Send, { className: "h-3 w-3" }), " Invite"] })] })] }), invitations.length > 0 && (_jsxs("div", { className: "px-4 md:px-6 py-4", children: [_jsx("p", { className: "text-[12px] text-muted-foreground font-medium mb-3", children: "Pending Invitations" }), _jsx("div", { className: "space-y-1", children: invitations.map((inv) => (_jsxs("div", { className: "flex items-center justify-between py-1.5 px-2 rounded hover:bg-muted/30", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Mail, { className: "h-3.5 w-3.5 text-muted-foreground" }), _jsx("span", { className: "text-[13px]", children: inv.email }), _jsx(Badge, { variant: "outline", className: "text-[10px] h-4 px-1", children: inv.role })] }), _jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleRevoke(inv.id), className: "h-6 w-6 p-0", children: _jsx(Trash2, { className: "h-3 w-3" }) })] }, inv.id))) })] })), _jsxs("div", { className: "px-4 md:px-6 py-4", children: [_jsxs("p", { className: "text-[12px] text-muted-foreground font-medium mb-3", children: ["Team Members \u00B7 ", members.length] }), _jsx("div", { className: "space-y-1", children: members.map((m) => (_jsxs("div", { className: "flex items-center justify-between py-1.5 px-2 rounded hover:bg-muted/30", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs(Avatar, { className: "h-5 w-5", children: [_jsx(AvatarImage, { src: m.avatar_url || "" }), _jsx(AvatarFallback, { className: "text-2xs", children: (m.full_name || "?").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) })] }), _jsx("span", { className: "text-[13px] font-medium", children: m.full_name || "Unnamed" }), _jsx("span", { className: "text-[12px] text-muted-foreground", children: m.job_title || "" })] }), _jsxs("div", { className: "flex items-center gap-1.5", children: [_jsxs(Badge, { variant: "outline", className: "text-[10px] h-4 px-1 gap-0.5", children: [_jsx(Shield, { className: "h-2.5 w-2.5" }), m.role] }), m.user_id === user?.id && _jsx(Badge, { variant: "secondary", className: "text-[10px] h-4 px-1", children: "You" })] })] }, m.user_id))) })] })] }));
}
// ─── Email Tab ──────────────────────────────────────────────────────────────────
function EmailTab() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [prefs, setPrefs] = useState({ email_on_new_bug: true, email_on_assignment: true, email_on_status_change: true, email_on_comment: true, email_on_sla_breach: true, daily_digest: false });
    const [existingId, setExistingId] = useState(null);
    useEffect(() => {
        if (!user)
            return;
        supabase.from("notification_preferences").select("*").eq("user_id", user.id).maybeSingle().then(({ data }) => {
            if (data) {
                setPrefs({ email_on_new_bug: data.email_on_new_bug, email_on_assignment: data.email_on_assignment, email_on_status_change: data.email_on_status_change, email_on_comment: data.email_on_comment, email_on_sla_breach: data.email_on_sla_breach, daily_digest: data.daily_digest });
                setExistingId(data.id);
            }
            setLoading(false);
        });
    }, [user]);
    const handleSave = async () => {
        if (!user)
            return;
        setSaving(true);
        if (existingId) {
            const { error } = await supabase.from("notification_preferences").update(prefs).eq("id", existingId);
            if (error)
                toast({ title: "Error", description: error.message, variant: "destructive" });
            else
                toast({ title: "Preferences saved" });
        }
        else {
            const { data, error } = await supabase.from("notification_preferences").insert({ ...prefs, user_id: user.id }).select().single();
            if (error)
                toast({ title: "Error", description: error.message, variant: "destructive" });
            else {
                setExistingId(data.id);
                toast({ title: "Preferences saved" });
            }
        }
        setSaving(false);
    };
    const togglePref = (key) => setPrefs(p => ({ ...p, [key]: !p[key] }));
    const items = [
        { key: "email_on_new_bug", label: "New Bug Reported" },
        { key: "email_on_assignment", label: "Bug Assigned to You" },
        { key: "email_on_status_change", label: "Status Changes" },
        { key: "email_on_comment", label: "New Comments" },
        { key: "email_on_sla_breach", label: "SLA Breach Warning" },
        { key: "daily_digest", label: "Daily Digest" },
    ];
    if (loading)
        return _jsx("div", { className: "flex justify-center py-12", children: _jsx(Loader2, { className: "h-4 w-4 animate-spin text-muted-foreground" }) });
    return (_jsxs("div", { className: "divide-y divide-border", children: [_jsxs("div", { className: "px-4 md:px-6 py-3 flex items-start gap-2 bg-muted/30", children: [_jsx(AlertTriangle, { className: "h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" }), _jsx("p", { className: "text-[12px] text-muted-foreground", children: "Email delivery not yet connected. Preferences will take effect once an email provider is configured." })] }), _jsxs("div", { className: "px-4 md:px-6 py-4", children: [_jsx("p", { className: "text-[12px] text-muted-foreground font-medium mb-3", children: "Email Notifications" }), _jsx("div", { className: "space-y-1", children: items.map(item => (_jsxs("div", { className: "flex items-center justify-between py-2 px-2 rounded hover:bg-muted/30", children: [_jsx("span", { className: "text-[13px]", children: item.label }), _jsx(Switch, { checked: prefs[item.key], onCheckedChange: () => togglePref(item.key), className: "scale-90" })] }, item.key))) }), _jsxs(Button, { onClick: handleSave, disabled: saving, size: "sm", className: "h-7 text-[12px] mt-3", children: [saving && _jsx(Loader2, { className: "mr-1.5 h-3 w-3 animate-spin" }), " Save Preferences"] })] })] }));
}
// ─── General Tab ────────────────────────────────────────────────────────────────
function GeneralTab() {
    const [theme, setThemeState] = useState(() => {
        if (typeof window !== "undefined")
            return document.documentElement.classList.contains("dark") ? "dark" : "light";
        return "dark";
    });
    const toggleTheme = (value) => {
        setThemeState(value);
        if (value === "dark") {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        }
        else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    };
    return (_jsxs("div", { className: "divide-y divide-border", children: [_jsxs("div", { className: "px-4 md:px-6 py-4", children: [_jsx("p", { className: "text-[12px] text-muted-foreground font-medium mb-3", children: "Appearance" }), _jsxs("div", { className: "flex items-center justify-between max-w-lg", children: [_jsx("span", { className: "text-[13px]", children: "Theme" }), _jsxs(Select, { value: theme, onValueChange: toggleTheme, children: [_jsx(SelectTrigger, { className: "w-[100px] h-7 text-[12px]", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "light", children: "Light" }), _jsx(SelectItem, { value: "dark", children: "Dark" })] })] })] })] }), _jsxs("div", { className: "px-4 md:px-6 py-4", children: [_jsx("p", { className: "text-[12px] text-muted-foreground font-medium mb-3", children: "Defaults" }), _jsxs("div", { className: "grid gap-3 sm:grid-cols-2 max-w-lg", children: [_jsxs("div", { className: "space-y-1", children: [_jsx(Label, { className: "text-[12px]", children: "Default Severity" }), _jsxs(Select, { defaultValue: "medium", children: [_jsx(SelectTrigger, { className: "h-8 text-[13px]", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "low", children: "Low" }), _jsx(SelectItem, { value: "medium", children: "Medium" }), _jsx(SelectItem, { value: "high", children: "High" }), _jsx(SelectItem, { value: "critical", children: "Critical" })] })] })] }), _jsxs("div", { className: "space-y-1", children: [_jsx(Label, { className: "text-[12px]", children: "Default Environment" }), _jsxs(Select, { defaultValue: "production", children: [_jsx(SelectTrigger, { className: "h-8 text-[13px]", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "production", children: "Production" }), _jsx(SelectItem, { value: "staging", children: "Staging" }), _jsx(SelectItem, { value: "development", children: "Development" }), _jsx(SelectItem, { value: "qa", children: "QA" })] })] })] })] })] }), _jsxs("div", { className: "px-4 md:px-6 py-4", children: [_jsx("p", { className: "text-[12px] text-destructive font-medium mb-3", children: "Danger Zone" }), _jsxs("div", { className: "flex items-center justify-between max-w-lg border border-destructive/20 rounded-md p-3", children: [_jsxs("div", { children: [_jsx("p", { className: "text-[13px] font-medium", children: "Delete Account" }), _jsx("p", { className: "text-[12px] text-muted-foreground", children: "Permanently delete your account and all data." })] }), _jsx(Button, { variant: "destructive", size: "sm", disabled: true, className: "h-7 text-[12px]", children: "Coming Soon" })] })] })] }));
}
// ─── Main Settings Page ─────────────────────────────────────────────────────────
export default function Settings() {
    return (_jsx(AppLayout, { children: _jsxs("div", { className: "flex flex-col h-full", children: [_jsx("div", { className: "px-4 md:px-6 h-11 border-b border-border flex items-center shrink-0", children: _jsx("h1", { className: "text-[13px] font-medium", children: "Settings" }) }), _jsx("div", { className: "flex-1 overflow-auto", children: _jsxs(Tabs, { defaultValue: "profile", className: "flex flex-col md:flex-row h-full", children: [_jsx("div", { className: "md:w-44 shrink-0 border-b md:border-b-0 md:border-r border-border", children: _jsxs(TabsList, { className: "flex md:flex-col items-stretch w-full bg-transparent h-auto p-1.5 gap-px", children: [_jsxs(TabsTrigger, { value: "profile", className: "justify-start gap-1.5 text-[12px] h-7 px-2 data-[state=active]:bg-muted w-full", children: [_jsx(User, { className: "h-3.5 w-3.5" }), " Profile"] }), _jsxs(TabsTrigger, { value: "company", className: "justify-start gap-1.5 text-[12px] h-7 px-2 data-[state=active]:bg-muted w-full", children: [_jsx(Building2, { className: "h-3.5 w-3.5" }), " Company"] }), _jsxs(TabsTrigger, { value: "team", className: "justify-start gap-1.5 text-[12px] h-7 px-2 data-[state=active]:bg-muted w-full", children: [_jsx(Users, { className: "h-3.5 w-3.5" }), " Team"] }), _jsxs(TabsTrigger, { value: "email", className: "justify-start gap-1.5 text-[12px] h-7 px-2 data-[state=active]:bg-muted w-full", children: [_jsx(Bell, { className: "h-3.5 w-3.5" }), " Notifications"] }), _jsxs(TabsTrigger, { value: "general", className: "justify-start gap-1.5 text-[12px] h-7 px-2 data-[state=active]:bg-muted w-full", children: [_jsx(SettingsIcon, { className: "h-3.5 w-3.5" }), " General"] })] }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx(TabsContent, { value: "profile", className: "m-0", children: _jsx(ProfileTab, {}) }), _jsx(TabsContent, { value: "company", className: "m-0", children: _jsx(CompanyTab, {}) }), _jsx(TabsContent, { value: "team", className: "m-0", children: _jsx(TeamTab, {}) }), _jsx(TabsContent, { value: "email", className: "m-0", children: _jsx(EmailTab, {}) }), _jsx(TabsContent, { value: "general", className: "m-0", children: _jsx(GeneralTab, {}) })] })] }) })] }) }));
}
