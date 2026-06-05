"use client";

import { useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, CheckCircle2, Clock, Download, Eye, FileSearch, ShieldCheck } from "lucide-react";
import { useClaimWorkflow, type SharedWorkflowStatus } from "@/hooks/useClaimWorkflow";

const documents = ["Prescription.pdf", "Reports.pdf", "Cost_Estimate.pdf", "Policy.pdf"];
const checks = ["Policy active", "Identity matched", "Documents complete", "No duplicate claim"];
const stateLabel: Record<SharedWorkflowStatus, string> = {
  draft: "Waiting for submission",
  ai_validated: "Ready to receive",
  submitted: "Received",
  insurer_verified: "Verified",
  initial_approved: "Initial approval",
  query_raised: "Clarification raised",
  hospital_responded: "Hospital responded",
  final_approved: "Final approved",
  rejected: "Rejected",
  discharged: "Discharged",
};

export default function InsurerCommandCenter({ claimId }: { claimId?: string }) {
  const { workflow, updateWorkflow, addAudit, resetWorkflow } = useClaimWorkflow();
  const displayClaimId = claimId ?? workflow.claimId;
  const state = workflow.status;

  const runAi = () => {
    if (state !== "submitted") {
      toast.error("Wait for the hospital to submit the claim");
      return;
    }

    addAudit("Insurer AI verification completed", { status: "insurer_verified" });
    toast.success("AI checks completed");
  };

  const approveInitial = () => {
    addAudit("Initial approval issued", { status: "initial_approved" });
    toast.success("Initial approval issued");
  };

  const raiseQuery = () => {
    addAudit(`Query raised: ${workflow.clarificationType}`, { status: "query_raised" });
    toast.warning("Clarification sent to hospital");
  };

  const receiveResponse = () => {
    toast.info(state === "hospital_responded" ? "Hospital response is already synced" : "Waiting for hospital response");
  };

  const approveFinal = () => {
    addAudit("Final approval issued", { status: "final_approved", finalApprovalAmount: workflow.revisedAmount });
    toast.success("Final approval issued");
  };

  const rejectClaim = () => {
    addAudit("Claim rejected", { status: "rejected" });
    toast.error("Claim rejected");
  };

  return (
    <div className="mx-auto max-w-[1440px] space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-purple-700">NoLoop Insurance</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-900">Review Workspace</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Status tone={state === "final_approved" || state === "discharged" ? "green" : state === "rejected" ? "red" : state === "query_raised" ? "amber" : "purple"}>{stateLabel[state]}</Status>
            <button type="button" onClick={resetWorkflow} className="h-8 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50">
              Reset demo
            </button>
          </div>
        </div>
      </section>

      <section id="dashboard" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric icon={FileSearch} label="Waiting" value={state === "submitted" ? "19" : "18"} />
        <Metric icon={ShieldCheck} label="Decisions" value="4" />
        <Metric icon={AlertTriangle} label="SLA Risk" value={state === "query_raised" ? "3" : "2"} tone="amber" />
        <Metric icon={Clock} label="Avg Time" value="1.4h" />
      </section>

      <div className="grid gap-5 xl:grid-cols-[320px_1fr_360px]">
        <aside id="review-queue" className="space-y-5">
          <Panel title="Queue">
            <button type="button" className="w-full rounded-2xl border border-purple-200 bg-purple-50 p-4 text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-purple-700">{displayClaimId}</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{workflow.patient}</p>
              <p className="mt-1 text-sm text-slate-600">{workflow.treatment}</p>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-900">Rs {workflow.requestedAmount.toLocaleString("en-IN")}</span>
                <Status tone="purple">Medium</Status>
              </div>
            </button>
          </Panel>

          <Panel title="Audit">
            <div className="space-y-2">
              {workflow.audit.map((item, index) => (
                <div key={`${item}-${index}`} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">{item}</div>
              ))}
            </div>
          </Panel>
        </aside>

        <main id="claim-workspace" className="space-y-5">
          <Panel title="Claim">
            <div className="grid gap-3 md:grid-cols-5">
              <Summary label="Patient" value={workflow.patient} />
              <Summary label="Age" value="42" />
              <Summary label="Hospital" value={workflow.hospital} />
              <Summary label="Treatment" value={workflow.treatment} />
              <Summary label="Policy" value="Active" />
            </div>
          </Panel>

          <Panel title="Documents">
            <div className="grid gap-3 md:grid-cols-2">
              {documents.map((document) => (
                <div key={document} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <p className="truncate text-sm font-medium text-slate-800">{document}</p>
                  <div className="flex gap-2">
                    <IconButton label="View" icon={Eye} onClick={() => toast.info(`Viewing ${document}`)} />
                    <IconButton label="Download" icon={Download} onClick={() => toast.success(`${document} downloaded`)} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="AI Verification">
            <div className="grid gap-3 md:grid-cols-2">
              {checks.map((check) => (
                <div key={check} className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm font-semibold text-green-700">
                  <CheckCircle2 className="h-4 w-4" />
                  {check}
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <Summary label="Risk" value="Low" />
              <Summary label="Confidence" value={state === "submitted" || state === "draft" || state === "ai_validated" ? "Pending" : "94%"} />
              <Summary label="Suggested" value={`Rs ${workflow.initialApprovalAmount.toLocaleString("en-IN")}`} />
            </div>
          </Panel>
        </main>

        <aside id="decision-center" className="space-y-5">
          <Panel title="Actions">
            <div className="grid gap-2">
              <button type="button" onClick={runAi} disabled={state !== "submitted"} className="h-10 rounded-xl border border-purple-200 bg-purple-50 px-4 text-sm font-semibold text-purple-700 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400">
                Run AI Check
              </button>
              <button type="button" onClick={approveInitial} disabled={state !== "insurer_verified"} className="h-10 rounded-xl bg-purple-700 px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300">
                Approve Rs {workflow.initialApprovalAmount.toLocaleString("en-IN")}
              </button>
            </div>
          </Panel>

          <Panel title="Clarification">
            <label className="block">
              <span className="text-xs font-medium text-slate-500">Type</span>
              <select value={workflow.clarificationType} onChange={(event) => updateWorkflow((current) => ({ ...current, clarificationType: event.target.value }))} className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-purple-500">
                <option>Billing Mismatch</option>
                <option>Missing Report</option>
                <option>Policy Verification</option>
                <option>Medical Clarification</option>
              </select>
            </label>
            <label className="mt-3 block">
              <span className="text-xs font-medium text-slate-500">Note</span>
              <textarea value={workflow.clarificationNote} onChange={(event) => updateWorkflow((current) => ({ ...current, clarificationNote: event.target.value }))} className="mt-1 min-h-24 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-500" />
            </label>
            <button type="button" onClick={raiseQuery} disabled={state !== "initial_approved"} className="mt-3 h-10 w-full rounded-xl border border-orange-200 bg-orange-50 px-4 text-sm font-semibold text-orange-700 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400">
              Raise Query
            </button>
            <button type="button" onClick={receiveResponse} disabled={state !== "hospital_responded"} className="mt-2 h-10 w-full rounded-xl border border-green-200 bg-green-50 px-4 text-sm font-semibold text-green-700 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400">
              Response Synced
            </button>
          </Panel>

          <Panel title="Final Decision">
            <div className="grid gap-3">
              <Summary label="Initial" value={`Rs ${workflow.requestedAmount.toLocaleString("en-IN")}`} />
              <Summary label="Revised" value={`Rs ${workflow.revisedAmount.toLocaleString("en-IN")}`} />
            </div>
            <div className="mt-3 grid gap-2">
              <button type="button" onClick={approveFinal} disabled={state !== "hospital_responded"} className="h-10 rounded-xl bg-green-600 px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300">
                Approve Rs {workflow.revisedAmount.toLocaleString("en-IN")}
              </button>
              <button type="button" onClick={rejectClaim} disabled={state !== "hospital_responded"} className="h-10 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300">
                Reject
              </button>
            </div>
          </Panel>
        </aside>
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-slate-900">{title}</h2>
      {children}
    </section>
  );
}

function Metric({ icon: Icon, label, value, tone = "purple" }: { icon: typeof FileSearch; label: string; value: string; tone?: "purple" | "amber" }) {
  const colors = {
    purple: "bg-purple-50 text-purple-700",
    amber: "bg-orange-50 text-orange-700",
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${colors[tone]}`}><Icon className="h-4 w-4" /></span>
      </div>
      <p className="mt-4 text-2xl font-semibold text-slate-900">{value}</p>
    </article>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2">
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}

function IconButton({ label, icon: Icon, onClick }: { label: string; icon: typeof Eye; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100" title={label} aria-label={label}>
      <Icon className="h-4 w-4" />
    </button>
  );
}

function Status({ children, tone }: { children: React.ReactNode; tone: "green" | "amber" | "purple" | "red" }) {
  const classes = {
    green: "border-green-200 bg-green-50 text-green-700",
    amber: "border-orange-200 bg-orange-50 text-orange-700",
    purple: "border-purple-200 bg-purple-50 text-purple-700",
    red: "border-red-200 bg-red-50 text-red-700",
  };

  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${classes[tone]}`}>{children}</span>;
}
