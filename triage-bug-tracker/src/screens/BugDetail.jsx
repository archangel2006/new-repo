"use client";

import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "@/lib/router-compat";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SeverityBadge } from "@/components/SeverityBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
const statusFlow = ["new", "assigned", "in_progress", "testing", "resolved", "closed"];
export default function BugDetail() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [bug, setBug] = useState(null);
    const [comments, setComments] = useState([]);
    const [profiles, setProfiles] = useState({});
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [submittingComment, setSubmittingComment] = useState(false);
    const fetchBug = useCallback(async () => {
        if (!id)
            return;
        const { data } = await supabase.from("bugs").select("*").eq("id", id).single();
        setBug(data);
        setLoading(false);
    }, [id]);
    const fetchComments = useCallback(async () => {
        if (!id)
            return;
        const { data } = await supabase
            .from("comments").select("*").eq("bug_id", id).order("created_at", { ascending: true });
        setComments(data || []);
        const userIds = [...new Set((data || []).map(c => c.user_id))];
        if (userIds.length > 0) {
            const { data: profileData } = await supabase.from("profiles").select("user_id, full_name").in("user_id", userIds);
            const map = {};
            (profileData || []).forEach(p => { map[p.user_id] = p.full_name; });
            setProfiles(prev => ({ ...prev, ...map }));
        }
    }, [id]);
    useEffect(() => {
        fetchBug();
        fetchComments();
        const channel = supabase
            .channel(`bug-${id}`)
            .on("postgres_changes", { event: "*", schema: "public", table: "comments", filter: `bug_id=eq.${id}` }, () => fetchComments())
            .on("postgres_changes", { event: "UPDATE", schema: "public", table: "bugs", filter: `id=eq.${id}` }, () => fetchBug())
            .subscribe();
        return () => { supabase.removeChannel(channel); };
    }, [fetchBug, fetchComments, id]);
    const updateStatus = async (newStatus) => {
        if (!bug || !user)
            return;
        const { error } = await supabase.from("bugs").update({ status: newStatus }).eq("id", bug.id);
        if (error) {
            toast({ title: "Failed to update status", description: error.message, variant: "destructive" });
        }
        else {
            await supabase.from("activity_log").insert({
                bug_id: bug.id, user_id: user.id, action: "status_change",
                old_value: bug.status, new_value: newStatus,
            });
            toast({ title: `Status updated to ${newStatus.replace("_", " ")}` });
        }
    };
    const addComment = async () => {
        if (!newComment.trim() || !user || !bug)
            return;
        setSubmittingComment(true);
        const { error } = await supabase.from("comments").insert({
            bug_id: bug.id, user_id: user.id, content: newComment.trim(),
        });
        if (error)
            toast({ title: "Failed to add comment", description: error.message, variant: "destructive" });
        else
            setNewComment("");
        setSubmittingComment(false);
    };
    if (loading) {
        return (_jsx(AppLayout, { children: _jsx("div", { className: "flex items-center justify-center h-full", children: _jsx(Loader2, { className: "h-5 w-5 animate-spin text-muted-foreground" }) }) }));
    }
    if (!bug) {
        return (_jsx(AppLayout, { children: _jsxs("div", { className: "flex flex-col items-center justify-center h-full gap-3", children: [_jsx("p", { className: "text-[13px] text-muted-foreground", children: "Bug not found" }), _jsx(Button, { variant: "outline", size: "sm", onClick: () => navigate("/"), className: "h-7 text-[12px]", children: "Back to Dashboard" })] }) }));
    }
    return (_jsx(AppLayout, { children: _jsxs("div", { className: "flex flex-col h-full", children: [_jsxs("div", { className: "flex items-center gap-2 px-4 md:px-6 h-11 border-b border-border shrink-0", children: [_jsx(Button, { variant: "ghost", size: "icon", onClick: () => navigate(-1), className: "h-7 w-7", children: _jsx(ArrowLeft, { className: "h-3.5 w-3.5" }) }), _jsx("span", { className: "font-mono text-[12px] text-muted-foreground", children: bug.tracking_id }), _jsx(StatusBadge, { status: bug.status }), _jsx(SeverityBadge, { severity: bug.severity })] }), _jsx("div", { className: "flex-1 overflow-auto", children: _jsxs("div", { className: "flex flex-col lg:flex-row", children: [_jsxs("div", { className: "flex-1 min-w-0 border-r border-border", children: [_jsx("div", { className: "px-4 md:px-6 py-4 border-b border-border", children: _jsx("h1", { className: "text-base font-medium", children: bug.title }) }), _jsxs("div", { className: "px-4 md:px-6 py-4 border-b border-border", children: [_jsx("p", { className: "text-[12px] text-muted-foreground mb-2 font-medium", children: "Description" }), _jsx("p", { className: "text-[13px] whitespace-pre-wrap leading-relaxed", children: bug.description || "No description" })] }), bug.steps_to_reproduce && (_jsxs("div", { className: "px-4 md:px-6 py-4 border-b border-border", children: [_jsx("p", { className: "text-[12px] text-muted-foreground mb-2 font-medium", children: "Steps to Reproduce" }), _jsx("p", { className: "text-[13px] whitespace-pre-wrap leading-relaxed", children: bug.steps_to_reproduce })] })), (bug.expected_behavior || bug.actual_behavior) && (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 border-b border-border", children: [bug.expected_behavior && (_jsxs("div", { className: "px-4 md:px-6 py-4 md:border-r border-border", children: [_jsx("p", { className: "text-[12px] text-muted-foreground mb-2 font-medium", children: "Expected" }), _jsx("p", { className: "text-[13px]", children: bug.expected_behavior })] })), bug.actual_behavior && (_jsxs("div", { className: "px-4 md:px-6 py-4", children: [_jsx("p", { className: "text-[12px] text-muted-foreground mb-2 font-medium", children: "Actual" }), _jsx("p", { className: "text-[13px]", children: bug.actual_behavior })] }))] })), _jsxs("div", { className: "px-4 md:px-6 py-4", children: [_jsxs("p", { className: "text-[12px] text-muted-foreground mb-3 font-medium", children: ["Activity \u00B7 ", comments.length] }), _jsx("div", { className: "space-y-3", children: comments.map((c) => (_jsxs("div", { className: "flex gap-3", children: [_jsx("div", { className: "w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5", children: _jsx("span", { className: "text-2xs font-medium text-muted-foreground", children: (profiles[c.user_id] || "U").charAt(0).toUpperCase() }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-[13px] font-medium", children: profiles[c.user_id] || "User" }), _jsx("span", { className: "text-[11px] text-muted-foreground", children: formatDistanceToNow(new Date(c.created_at), { addSuffix: true }) })] }), _jsx("p", { className: "text-[13px] mt-0.5 leading-relaxed", children: c.content })] })] }, c.id))) }), _jsxs("div", { className: "mt-4 flex gap-2", children: [_jsx(Textarea, { placeholder: "Leave a comment...", value: newComment, onChange: (e) => setNewComment(e.target.value), rows: 2, maxLength: 2000, className: "text-[13px] min-h-[60px] resize-none" }), _jsx(Button, { onClick: addComment, disabled: !newComment.trim() || submittingComment, size: "sm", className: "shrink-0 self-end h-8", children: submittingComment ? _jsx(Loader2, { className: "h-3.5 w-3.5 animate-spin" }) : _jsx(Send, { className: "h-3.5 w-3.5" }) })] })] })] }), _jsxs("div", { className: "w-full lg:w-64 shrink-0", children: [_jsxs("div", { className: "px-4 py-3 border-b border-border", children: [_jsx("p", { className: "text-[12px] text-muted-foreground mb-2 font-medium", children: "Status" }), _jsx("div", { className: "flex flex-wrap gap-1", children: statusFlow.map((status) => (_jsx(Button, { variant: bug.status === status ? "secondary" : "ghost", size: "sm", disabled: bug.status === status, onClick: () => updateStatus(status), className: "h-6 text-[11px] px-2", children: status.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase()) }, status))) })] }), _jsxs("div", { className: "px-4 py-3 space-y-3 text-[13px]", children: [_jsxs("div", { children: [_jsx("p", { className: "text-[12px] text-muted-foreground mb-0.5", children: "Environment" }), _jsx("p", { children: bug.environment || "—" })] }), _jsxs("div", { children: [_jsx("p", { className: "text-[12px] text-muted-foreground mb-0.5", children: "Created" }), _jsx("p", { children: formatDistanceToNow(new Date(bug.created_at), { addSuffix: true }) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-[12px] text-muted-foreground mb-0.5", children: "Updated" }), _jsx("p", { children: formatDistanceToNow(new Date(bug.updated_at), { addSuffix: true }) })] })] })] })] }) })] }) }));
}
