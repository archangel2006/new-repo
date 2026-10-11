import { useState } from "react";
import { ArrowRight, Check, CircleDot, Inbox, Layers, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const issues = [
  { id: "TRG-142", title: "Checkout fails on mobile Safari", status: "In progress" },
  { id: "TRG-139", title: "Session expires during upload", status: "In review" },
  { id: "TRG-138", title: "Search results load twice", status: "Open" },
  { id: "TRG-135", title: "Notification badge won't clear", status: "Resolved" },
];

export function ProductPreview() {
  const [selected, setSelected] = useState(0);
  const issue = issues[selected] ?? issues[0];
  return <div className="landing-refined product-preview" aria-label="Example issue workspace">
    <div className="preview-top"><Layers size={15} /><strong>Triage</strong><span>/ Engineering</span></div>
    <div className="preview-body">
      <aside className="preview-sidebar">
        <div className="preview-nav-item"><Inbox size={14} /> Inbox</div>
        <div className="preview-nav-item"><CircleDot size={14} /> My issues</div>
        <div className="preview-nav-item active"><Layers size={14} /> All issues</div>
      </aside>
      <div className="preview-issues">
        <div className="issue-toolbar">All issues</div>
        {issues.map((row, i) => <Button variant="ghost" key={row.id} onClick={() => setSelected(i)} aria-pressed={selected === i} className={`preview-issue ${selected === i ? "selected" : ""}`}><span className="issue-id">{row.id}</span><span className="issue-title">{row.title}</span><span className="issue-state">{row.status === "Resolved" ? <Check size={13} /> : <CircleDot size={13} />}</span></Button>)}
      </div>
      <aside className="preview-detail"><span className="issue-id">{issue.id}</span><h3>{issue.title}</h3><div className="detail-status"><span>Status</span><span>{issue.status}</span></div></aside>
    </div>
  </div>;
}

export function FeatureSections() {
  return <section className="landing-refined feature-section relative z-10 px-6"><div className="mx-auto max-w-[1200px]">
    <div className="feature-heading"><p>Built for speed</p><h2>Less process.<br />More progress.</h2></div>
    <div className="feature-grid">
      <article className="feature-item"><div className="feature-visual priority-visual" aria-hidden="true"><span /><span /><span /><span /></div><h3>Priority triage</h3><p>Know what to fix first.</p></article>
      <article className="feature-item"><div className="feature-visual workflow-visual" aria-hidden="true"><span className="workflow-node"><CircleDot size={18} /></span><ArrowRight size={15} /><span className="workflow-node"><MessageSquare size={17} /></span><ArrowRight size={15} /><span className="workflow-node"><Check size={19} /></span></div><h3>Team workflows</h3><p>From assigned to resolved, together.</p></article>
      <article className="feature-item"><div className="feature-visual analytics-visual" aria-hidden="true">{["one","two","three","four","five","six"].map(bar=><span className={`chart-bar ${bar}`} key={bar} />)}</div><h3>Real-time analytics</h3><p>A clear view of your team's progress.</p></article>
    </div>
  </div></section>;
}
