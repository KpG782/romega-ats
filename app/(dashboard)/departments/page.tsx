import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Users, BriefcaseBusiness } from "lucide-react";

const DEPARTMENTS = [
  { id: "1", name: "Engineering", openRoles: 5, members: 43, hiringManager: "Ken Garcia" },
  { id: "2", name: "Design", openRoles: 1, members: 11, hiringManager: "Anna Cruz" },
  { id: "3", name: "Marketing", openRoles: 2, members: 16, hiringManager: "Lia Santos" },
  { id: "4", name: "Operations", openRoles: 1, members: 24, hiringManager: "Mark Dizon" },
];

export default function DepartmentsPage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header
        title="Departments"
        subtitle="Hiring demand by business unit"
        actions={
          <Button size="sm">
            <Plus className="h-4 w-4" />
            New Department
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {DEPARTMENTS.map((department) => (
            <Card key={department.id}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[var(--color-foreground)]">{department.name}</h3>
                <Badge variant={department.openRoles > 0 ? "warning" : "success"}>
                  {department.openRoles > 0 ? `${department.openRoles} open` : "Fully staffed"}
                </Badge>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <p className="flex items-center gap-2 text-[var(--color-foreground-subtle)]">
                  <BriefcaseBusiness className="h-4 w-4" />
                  Hiring manager: {department.hiringManager}
                </p>
                <p className="flex items-center gap-2 text-[var(--color-foreground-subtle)]">
                  <Users className="h-4 w-4" />
                  Team size: {department.members}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

