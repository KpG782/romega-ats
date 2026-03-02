import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Calendar, TrendingUp, Users, Clock } from "lucide-react";

const METRICS = [
  { label: "Applications", value: "1,284", delta: "+12.4%" },
  { label: "Qualified Rate", value: "38%", delta: "+3.1%" },
  { label: "Avg Time To Hire", value: "17d", delta: "-2d" },
  { label: "Offer Accept Rate", value: "82%", delta: "+4.0%" },
];

export default function AnalyticsPage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header
        title="Analytics"
        subtitle="Hiring funnel and team performance insights"
        actions={
          <>
            <Button variant="secondary" size="sm">
              <Calendar className="h-4 w-4" />
              Last 30 days
            </Button>
            <Button size="sm">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </>
        }
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {METRICS.map((m) => (
            <Card key={m.label}>
              <p className="text-sm text-[var(--color-foreground-subtle)]">{m.label}</p>
              <p className="mt-2 text-3xl font-bold text-[var(--color-foreground)]">{m.value}</p>
              <p className="mt-2 text-sm text-emerald-400">{m.delta}</p>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <Card className="xl:col-span-8" padding="none">
            <div className="border-b border-[var(--color-border)] px-6 py-4">
              <h2 className="text-lg font-semibold text-[var(--color-foreground)]">Funnel Conversion</h2>
              <p className="text-sm text-[var(--color-foreground-subtle)]">Stage-by-stage dropoff overview</p>
            </div>
            <div className="space-y-4 px-6 py-5">
              {[
                ["Applied", 100],
                ["Screening", 62],
                ["Technical", 34],
                ["Final", 18],
                ["Offer", 9],
              ].map(([label, value]) => (
                <div key={label as string}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-[var(--color-foreground-subtle)]">{label}</span>
                    <span className="text-[var(--color-foreground)]">{value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[var(--color-surface-elevated)]">
                    <div className="h-2 rounded-full bg-[var(--color-primary)]" style={{ width: `${value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="xl:col-span-4">
            <h3 className="text-lg font-semibold text-[var(--color-foreground)]">Quick Stats</h3>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[var(--color-foreground-subtle)]"><Users className="h-4 w-4" /> Active interviewers</span>
                <span className="text-[var(--color-foreground)]">27</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[var(--color-foreground-subtle)]"><Clock className="h-4 w-4" /> Avg feedback delay</span>
                <span className="text-[var(--color-foreground)]">18h</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[var(--color-foreground-subtle)]"><TrendingUp className="h-4 w-4" /> Week-over-week</span>
                <Badge variant="success">Improving</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

