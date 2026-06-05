"use client";

import { useCallback, useEffect, useState } from "react";
import { readStorage, writeStorage } from "@/lib/api/storage";

export type SharedDocKey = "prescription" | "reports" | "bill" | "id" | "policy";
export type SharedWorkflowStatus =
  | "draft"
  | "ai_validated"
  | "submitted"
  | "insurer_verified"
  | "initial_approved"
  | "query_raised"
  | "hospital_responded"
  | "final_approved"
  | "rejected"
  | "discharged";

export type SharedWorkflow = {
  claimId: string;
  patient: string;
  hospital: string;
  treatment: string;
  requestedAmount: number;
  initialApprovalAmount: number;
  revisedAmount: number;
  finalApprovalAmount: number;
  status: SharedWorkflowStatus;
  documents: Record<SharedDocKey, boolean>;
  clarificationType: string;
  clarificationNote: string;
  hospitalResponse: string;
  audit: string[];
  updatedAt: string;
};

const WORKFLOW_KEY = "noloop.workflow.claim";
const WORKFLOW_EVENT = "noloop-workflow-change";

const nowTime = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export const defaultWorkflow = (): SharedWorkflow => ({
  claimId: "NPL-1048",
  patient: "Aarav Mehta",
  hospital: "Max Healthcare",
  treatment: "Orthopedic implant",
  requestedAmount: 100000,
  initialApprovalAmount: 50000,
  revisedAmount: 95000,
  finalApprovalAmount: 95000,
  status: "draft",
  documents: {
    prescription: true,
    reports: true,
    bill: false,
    id: true,
    policy: false,
  },
  clarificationType: "Billing Mismatch",
  clarificationNote: "Please share revised implant cost details.",
  hospitalResponse: "Updated bill and cost justification attached.",
  audit: [`${nowTime()} - Draft claim opened`],
  updatedAt: new Date().toISOString(),
});

const readWorkflow = () => readStorage<SharedWorkflow>(WORKFLOW_KEY, defaultWorkflow());

const persistWorkflow = (workflow: SharedWorkflow) => {
  writeStorage(WORKFLOW_KEY, workflow);
  window.dispatchEvent(new Event(WORKFLOW_EVENT));
};

export function useClaimWorkflow() {
  const [workflow, setWorkflow] = useState<SharedWorkflow>(() => readWorkflow());

  useEffect(() => {
    const sync = () => setWorkflow(readWorkflow());
    const handleStorage = (event: StorageEvent) => {
      if (event.key === WORKFLOW_KEY) {
        sync();
      }
    };

    window.addEventListener(WORKFLOW_EVENT, sync);
    window.addEventListener("storage", handleStorage);
    sync();

    return () => {
      window.removeEventListener(WORKFLOW_EVENT, sync);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const updateWorkflow = useCallback((updater: (current: SharedWorkflow) => SharedWorkflow) => {
    const current = readWorkflow();
    const next = {
      ...updater(current),
      updatedAt: new Date().toISOString(),
    };
    persistWorkflow(next);
    setWorkflow(next);
    return next;
  }, []);

  const addAudit = useCallback(
    (entry: string, updates: Partial<SharedWorkflow> = {}) =>
      updateWorkflow((current) => ({
        ...current,
        ...updates,
        audit: [`${nowTime()} - ${entry}`, ...current.audit].slice(0, 8),
      })),
    [updateWorkflow],
  );

  const resetWorkflow = useCallback(() => {
    const next = defaultWorkflow();
    persistWorkflow(next);
    setWorkflow(next);
  }, []);

  return { workflow, updateWorkflow, addAudit, resetWorkflow };
}
