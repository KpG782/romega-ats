"use client";

import { createContext, useContext } from "react";
import { useAuth } from "@/lib/auth-context";

interface WorkspaceContextValue {
  workspaceId: string | null;
}

const WorkspaceContext = createContext<WorkspaceContextValue>({
  workspaceId: null,
});

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <WorkspaceContext.Provider value={{ workspaceId: user?.workspaceId ?? null }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  return useContext(WorkspaceContext);
}
