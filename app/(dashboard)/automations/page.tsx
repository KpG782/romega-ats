import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, PlayCircle, PauseCircle, Clock } from "lucide-react";

const FLOWS = [
  { id: "1", name: "Auto-send screening email", trigger: "Candidate moved to Screening", status: "Active", runs: 128 },
  { id: "2", name: "Nudge interviewer after 24h", trigger: "Interview completed, no feedback", status: "Active", runs: 74 },
  { id: "3", name: "Weekly hiring digest", trigger: "Every Monday 8:00 AM", status: "Paused", runs: 22 },
];

export default function AutomationsPage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header
        title="Automations"
        subtitle="Workflow rules for repetitive hiring operations"
        actions={
          <Button size="sm">
            <Plus className="h-4 w-4" />
            New Automation
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
          <Badge variant="success">2 active</Badge>
          <Badge variant="warning">1 paused</Badge>
          <span className="text-xs text-[var(--color-foreground-subtle)]">Queue latency: 1.2s</span>
        </div>

        <Card padding="none">
          <div className="border-b border-[var(--color-border)] px-6 py-4">
            <h2 className="text-lg font-semibold text-[var(--color-foreground)]">Automation Library</h2>
          </div>
          <div className="divide-y divide-[var(--color-border)]">
            {FLOWS.map((flow) => (
              <div key={flow.id} className="flex flex-wrap items-center gap-3 px-6 py-4">
                <div className="min-w-0 flex-1">
                  <p className="text-base font-semibold text-[var(--color-foreground)]">{flow.name}</p>
                  <p className="text-sm text-[var(--color-foreground-subtle)]">Trigger: {flow.trigger}</p>
                </div>
                <span className="text-sm text-[var(--color-foreground-subtle)]">{flow.runs} runs</span>
                <Badge variant={flow.status === "Active" ? "success" : "warning"}>{flow.status}</Badge>
                <Button variant="secondary" size="sm">
                  {flow.status === "Active" ? <PauseCircle className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
                  {flow.status === "Active" ? "Pause" : "Resume"}
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2 text-sm text-[var(--color-foreground-subtle)]">
            <Clock className="h-4 w-4" />
            Last failed run: 2 days ago (Interview reminder timeout)
          </div>
        </Card>
      </div>
    </div>
  );
}

