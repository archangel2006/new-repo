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
    } catch {
      // clipboard unavailable — user can select the text manually
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="flex items-center gap-2 mb-1">
          <Plug className="h-4 w-4 text-muted-foreground" />
          <h1 className="text-lg font-semibold text-foreground">Connect to Claude</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-8">
          Triage has a built-in MCP server, so you can file, read, and update bugs straight from a
          Claude conversation — without opening the app.
        </p>

        {/* Server URL */}
        <div className="rounded-md border border-border bg-card p-4 mb-8">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">
            Server URL
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs text-foreground bg-muted rounded px-3 py-2 overflow-x-auto whitespace-nowrap">
              {MCP_URL}
            </code>
            <Button variant="outline" size="sm" onClick={copyUrl} className="shrink-0">
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span className="ml-1.5">{copied ? "Copied" : "Copy"}</span>
            </Button>
          </div>
        </div>

        {/* Steps */}
        <h2 className="text-sm font-semibold text-foreground mb-3">Setup</h2>
        <ol className="space-y-3 mb-10">
          {steps.map((step, i) => (
            <li key={step.title} className="flex gap-3 rounded-md border border-border bg-card p-4">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-foreground">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">{step.title}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* Examples */}
        <h2 className="text-sm font-semibold text-foreground mb-3">What you can ask</h2>
        <div className="space-y-3">
          {examples.map((ex) => (
            <div key={ex.label} className="rounded-md border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <ex.icon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {ex.label}
                </span>
              </div>
              <p className="text-sm text-foreground italic">“{ex.prompt}”</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mt-8">
          Claude acts as you — it can only see and change what your Triage account can. You can
          disconnect anytime from Claude's connector settings.
        </p>
      </div>
    </AppLayout>
  );
}
