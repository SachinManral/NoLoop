"use client";

import { useMemo } from "react";
import { toast } from "sonner";
import { AlertCircle, Bed, CheckCircle2, Clock, FileText, Upload } from "lucide-react";
import { useClaimWorkflow, type SharedDocKey, type SharedWorkflowStatus } from "@/hooks/useClaimWorkflow";

const documents: Array<{ key: SharedDocKey; label: string; file: string }> = [
  { key: "prescription", label: "Prescription", file: "prescription.pdf" },
  { key: "reports", label: "Reports", file: "medical-reports.pdf" },
  { key: "bill", label: "Estimate", file: "cost-estimate.pdf" },
  { key: "id", label: "ID Proof", file: "aadhaar.pdf" },
  { key: "policy", label: "Policy", file: "policy-card.pdf" },
];

const stageLabel: Record<SharedWorkflowStatus, string> = {
  draft: "Draft",
  ai_validated: "AI validated",
  submitted: "Under insurer review",
  insurer_verified: "Insurer verified",
  initial_approved: "Initial approved",
  query_raised: "Query raised",
  hospital_responded: "Response sent",
  final_approved: "Discharge ready",
  rejected: "Rejected",
  discharged: "Discharged",
};

const journey = [
  "Admission",
  "Documents",
  "AI validation",
  "Insurer review",
  "Query",
  "Response",
  "Final approval",
  "Discharge",
];

export default function HospitalDashboardPage() {
  const { workflow, updateWorkflow, addAudit, resetWorkflow } = useClaimWorkflow();
  const { status, documents: uploaded } = workflow;
  const uploadedCount = useMemo(() => Object.values(uploaded).filter(Boolean).length, [uploaded]);
  const allUploaded = uploadedCount === documents.length;
  const activeStep =
    status === "draft"
      ? 1
      : status === "ai_validated"
        ? 2
        : status === "submitted" || status === "insurer_verified" || status === "initial_approved"
          ? 3
          : status === "query_raised"
            ? 4
            : status === "hospital_responded"
              ? 5
              : status === "final_approved" || status === "rejected"
                ? 6
                : 7;

  const uploadDocument = (key: SharedDocKey) => {
    updateWorkflow((current) => ({
      ...current,
      documents: { ...current.documents, [key]: true },
      audit: [`${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${documents.find((item) => item.key === key)?.label} uploaded`, ...current.audit].slice(0, 8),
    }));
    toast.success("Document added");
  };

  const runValidation = () => {
    if (!allUploaded) {
      toast.error("Complete the document pack first");
      return;
    }

    addAudit("Hospital AI validation completed", { status: "ai_validated" });
    toast.success("AI validation complete");
  };

  const submitClaim = () => {
    if (status !== "ai_validated") {
      toast.error("Run AI validation before submission");
      return;
    }

    addAudit("Claim submitted to insurance", { status: "submitted" });
    toast.success("Claim sent to insurer");
  };

  const submitResponse = () => {
    if (status !== "query_raised") {
      toast.error("No insurer query is open");
      return;
    }

    addAudit("Hospital response submitted", { status: "hospital_responded" });
    toast.success("Response sent to insurer");
  };

  return (
    <div className="mx-auto max-w-[1440px] space-y-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">NoLoop Hospital</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-900">Cashless Claim Desk</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Status tone={status === "final_approved" || status === "discharged" ? "green" : status === "query_raised" || status === "rejected" ? "amber" : "blue"}>{stageLabel[status]}</Status>
            <button type="button" onClick={resetWorkflow} className="h-8 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50">
              Reset demo
            </button>
          </div>
        </div>
      </section>

      <section id="dashboard" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric icon={FileText} label="In Progress" value="26" />
        <Metric icon={AlertCircle} label="Needs Action" value={status === "query_raised" ? "1" : "0"} tone="amber" />
        <Metric icon={Bed} label="Discharge Ready" value={status === "final_approved" || status === "discharged" ? "8" : "7"} tone="green" />
        <Metric icon={Clock} label="Avg Approval" value="1.8h" />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-2 md:grid-cols-4 xl:grid-cols-8">
          {journey.map((item, index) => {
            const done = index < activeStep;
            const current = index === activeStep;
            return (
              <div key={item} className={`rounded-xl border px-3 py-2 text-sm ${done ? "border-green-200 bg-green-50 text-green-700" : current ? "border-blue-200 bg-blue-50 text-blue-700" : "border-slate-200 bg-slate-50 text-slate-500"}`}>
                <p className="font-semibold">{item}</p>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <main className="space-y-5">
          <Panel id="create-claim" title="Claim Intake">
            <div className="grid gap-4 md:grid-cols-3">
              <Input label="Patient" value={workflow.patient} />
              <Input label="Policy" value="HDFC-2026-1048" />
              <Input label="Procedure" value={workflow.treatment} />
              <Input label="Estimated cost" value={`Rs ${workflow.requestedAmount.toLocaleString("en-IN")}`} />
              <Input label="Doctor" value="Dr. Rakesh Iyer" />
              <Input label="Admission" value="02 Jun 2026" />
            </div>
          </Panel>

          <Panel title="Documents">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              {documents.map((document) => (
                <article key={document.key} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">{document.label}</p>
                  <p className="mt-2 h-5 text-xs text-slate-500">{uploaded[document.key] ? document.file : "Required"}</p>
                  <button type="button" onClick={() => uploadDocument(document.key)} className="mt-4 inline-flex h-9 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 text-sm font-semibold text-white hover:bg-blue-700">
                    <Upload className="h-4 w-4" />
                    {uploaded[document.key] ? "Replace" : "Upload"}
                  </button>
                </article>
              ))}
            </div>
          </Panel>

          <Panel id="active-claims" title="Active Claim">
            <div className="grid gap-3 md:grid-cols-3">
              <Summary label="Claim ID" value={workflow.claimId} />
              <Summary label="Patient" value={workflow.patient} />
              <Summary label="Amount" value={`Rs ${workflow.requestedAmount.toLocaleString("en-IN")}`} />
              <Summary label="Stage" value={stageLabel[status]} />
              <Summary label="Initial approval" value={["initial_approved", "query_raised", "hospital_responded", "final_approved", "discharged"].includes(status) ? `Rs ${workflow.initialApprovalAmount.toLocaleString("en-IN")}` : "Pending"} />
              <Summary label="Final approval" value={status === "final_approved" || status === "discharged" ? `Rs ${workflow.finalApprovalAmount.toLocaleString("en-IN")}` : "Pending"} />
            </div>
          </Panel>

          {status === "query_raised" || status === "hospital_responded" || status === "final_approved" || status === "discharged" ? (
            <Panel id="pending-actions" title="Insurer Query">
              <div className="grid gap-4 md:grid-cols-[1fr_220px]">
                <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">Billing variance clarification</p>
                  <p className="mt-2 text-sm text-slate-600">Implant charges need revised cost details before final approval.</p>
                </div>
                <div>
                  <Input label="Revised bill" value={String(workflow.revisedAmount)} onChange={(value) => updateWorkflow((current) => ({ ...current, revisedAmount: Number(value) || 0 }))} />
                  <button type="button" onClick={submitResponse} disabled={status !== "query_raised"} className="mt-3 h-10 w-full rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300">
                    Submit Response
                  </button>
                </div>
              </div>
            </Panel>
          ) : null}
        </main>

        <aside className="space-y-5">
          <Panel title="Readiness">
            <div className="space-y-3">
              <Summary label="Documents" value={`${uploadedCount}/5`} />
              <Summary label="Policy" value={uploaded.policy ? "Verified" : "Pending"} />
              <Summary label="Coverage" value={allUploaded ? "Eligible" : "Checking"} />
            </div>
            <div className="mt-4 grid gap-2">
              <button type="button" onClick={runValidation} className="h-10 rounded-xl border border-blue-200 bg-blue-50 px-4 text-sm font-semibold text-blue-700 hover:bg-blue-100">
                Run AI Check
              </button>
              <button type="button" onClick={submitClaim} className="h-10 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700">
                Submit Claim
              </button>
            </div>
          </Panel>

          <Panel id="discharge-desk" title="Discharge">
            <div className="space-y-3">
              <Summary label="Patient" value={workflow.patient} />
              <Summary label="Status" value={status === "final_approved" || status === "discharged" ? "Ready" : "Waiting"} />
              <Summary label="Approved" value={status === "final_approved" || status === "discharged" ? `Rs ${workflow.finalApprovalAmount.toLocaleString("en-IN")}` : "-"} />
            </div>
            <button type="button" disabled={status !== "final_approved"} onClick={() => { addAudit("Discharge clearance issued", { status: "discharged" }); toast.success("Discharge clearance issued"); }} className="mt-4 h-10 w-full rounded-xl bg-green-600 px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300">
              Clear Discharge
            </button>
          </Panel>
        </aside>
      </div>
    </div>
  );
}

function Panel({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-slate-900">{title}</h2>
      {children}
    </section>
  );
}

function Metric({ icon: Icon, label, value, tone = "blue" }: { icon: typeof FileText; label: string; value: string; tone?: "blue" | "amber" | "green" }) {
  const colors = {
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-orange-50 text-orange-700",
    green: "bg-green-50 text-green-700",
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

function Input({ label, value, onChange }: { label: string; value: string; onChange?: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      <input value={value} readOnly={!onChange} onChange={(event) => onChange?.(event.target.value)} className="mt-1 h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-blue-500" />
    </label>
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

function Status({ children, tone }: { children: React.ReactNode; tone: "green" | "amber" | "blue" }) {
  const classes = {
    green: "border-green-200 bg-green-50 text-green-700",
    amber: "border-orange-200 bg-orange-50 text-orange-700",
    blue: "border-blue-200 bg-blue-50 text-blue-700",
  };

  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${classes[tone]}`}>{children}</span>;
}
