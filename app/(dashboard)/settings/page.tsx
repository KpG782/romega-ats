import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Bell, Globe, Save } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header
        title="Settings"
        subtitle="Workspace configuration and account defaults"
        actions={
          <Button size="sm">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <Card padding="none">
          <div className="border-b border-[var(--color-border)] px-6 py-4">
            <h2 className="text-lg font-semibold text-[var(--color-foreground)]">General</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 px-6 py-5 md:grid-cols-2">
            <label className="space-y-1 text-sm">
              <span className="text-[var(--color-foreground-subtle)]">Workspace name</span>
              <Input value="Romega ATS" readOnly />
            </label>
            <label className="space-y-1 text-sm">
              <span className="text-[var(--color-foreground-subtle)]">Timezone</span>
              <Input value="Asia/Manila (GMT+8)" readOnly />
            </label>
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <Card>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-[var(--color-primary)]" />
              <h3 className="text-base font-semibold text-[var(--color-foreground)]">Permissions</h3>
            </div>
            <p className="mt-2 text-sm text-[var(--color-foreground-subtle)]">Role-based permissions are enforced.</p>
            <Badge className="mt-3" variant="success">Healthy</Badge>
          </Card>

          <Card>
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-[var(--color-primary)]" />
              <h3 className="text-base font-semibold text-[var(--color-foreground)]">Notifications</h3>
            </div>
            <p className="mt-2 text-sm text-[var(--color-foreground-subtle)]">Email digests enabled for hiring managers.</p>
            <Badge className="mt-3" variant="info">Configured</Badge>
          </Card>

          <Card>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-[var(--color-primary)]" />
              <h3 className="text-base font-semibold text-[var(--color-foreground)]">Integrations</h3>
            </div>
            <p className="mt-2 text-sm text-[var(--color-foreground-subtle)]">Calendar and email provider connected.</p>
            <Badge className="mt-3" variant="default">2 connected</Badge>
          </Card>
        </div>
      </div>
    </div>
  );
}

