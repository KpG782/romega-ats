import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpRight,
  Award,
  Mail,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

type InternalTool = {
  id: string;
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
  accent: string;
};

const INTERNAL_TOOLS: InternalTool[] = [
  {
    id: "email-signature-generator",
    name: "Email Signature Generator",
    description: "Generate standardized Romega email signatures for internal and client-facing teams.",
    href: "https://romega-email-signature.vercel.app/",
    icon: Mail,
    accent: "#0ea5e9",
  },
  {
    id: "certificate-generator",
    name: "Certificate Generator",
    description: "Create branded completion and recognition certificates using Romega templates.",
    href: "https://romega-certificate-creator-71vj.vercel.app/",
    icon: Award,
    accent: "#f59e0b",
  },
];

export default function InternalToolsPage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header
        title="Internal Tools"
        subtitle="Quick access to Romega utility apps"
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-0.75 bg-primary" />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-foreground">Romega Internal App Hub</h2>
              <p className="text-sm text-foreground-subtle">
                Use this page as a single launcher for approved internal tools.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="success">
                <ShieldCheck className="h-3 w-3" />
                Internal Only
              </Badge>
              <Badge variant="info">
                <Sparkles className="h-3 w-3" />
                {INTERNAL_TOOLS.length} tools live
              </Badge>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {INTERNAL_TOOLS.map((tool) => {
            const Icon = tool.icon;

            return (
              <Card
                key={tool.id}
                hover
                className="relative overflow-hidden"
                style={{
                  background: `linear-gradient(145deg, hsl(var(--card)) 0%, color-mix(in srgb, ${tool.accent} 10%, hsl(var(--card))) 100%)`,
                }}
              >
                <div className="absolute inset-x-0 top-0 h-0.75" style={{ backgroundColor: tool.accent }} />
                <div
                  className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-20 blur-2xl"
                  style={{ backgroundColor: tool.accent }}
                />

                <div className="relative flex h-full flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-xl border"
                      style={{
                        borderColor: `color-mix(in srgb, ${tool.accent} 35%, transparent)`,
                        backgroundColor: `color-mix(in srgb, ${tool.accent} 12%, transparent)`,
                      }}
                    >
                      <Icon className="h-5 w-5" style={{ color: tool.accent }} />
                    </div>
                    <Badge variant="outline">Utility App</Badge>
                  </div>

                  <h3 className="mt-4 text-lg font-semibold text-foreground">{tool.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-foreground-subtle">{tool.description}</p>

                  <div className="mt-5 flex items-center justify-end">
                    <Link
                      href={tool.href}
                      target="_blank"
                      rel="noreferrer"
                      className="button button--secondary button--sm"
                    >
                      Open Tool
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}