import {
  AlertTriangle,
  BarChart2,
  CheckCircle2,
  Clock3,
  Eye,
  FileCheck2,
  FileText,
  MessageSquare,
  Search,
  Shield,
  TrendingUp,
  WalletCards,
  Workflow,
} from "lucide-react";

export const stats = [
  { value: 58, prefix: "", suffix: "%+", label: "Claims Are Cashless", sub: "The fastest-growing claim route depends on hospital-insurer coordination.", tone: "text-[var(--ch-blue)]" },
  { value: 92, prefix: "", suffix: "%", label: "Instant Decisions Target", sub: "Rule-clean claims can clear without manual back-and-forth.", tone: "text-[var(--ch-green)]" },
  { value: 3, prefix: "", suffix: "x", label: "Reviewer Throughput", sub: "Doctors review structured summaries instead of reading every PDF line by line.", tone: "text-[var(--ch-amber)]" },
  { value: 10, prefix: "Rs", suffix: "k Cr", label: "Annual Fraud Exposure", sub: "Explainable risk signals help insurers catch leakage earlier.", tone: "text-[var(--ch-red)]" },
];

export const problems = [
  {
    icon: FileText,
    stat: "11-12.5%",
    label: "Claims Denied",
    desc: "Many patients never receive a clear reason, creating anxiety, escalation, and delayed discharge.",
    tone: "text-[var(--ch-red)]",
    bg: "bg-[color:rgba(239,68,68,0.08)]",
  },
  {
    icon: BarChart2,
    stat: "3 files",
    label: "One Claim, Three Versions",
    desc: "Hospitals, TPAs, and insurers maintain separate records, so every query creates another round of reconciliation.",
    tone: "text-[var(--ch-amber)]",
    bg: "bg-[color:rgba(245,158,11,0.08)]",
  },
  {
    icon: AlertTriangle,
    stat: "15%",
    label: "Fraud Signal Load",
    desc: "Unstructured bills, prescriptions, and history make upcoding and suspicious patterns hard to catch in time.",
    tone: "text-[var(--ch-red)]",
    bg: "bg-[color:rgba(239,68,68,0.08)]",
  },
  {
    icon: MessageSquare,
    stat: "Days",
    label: "Blocked Beds",
    desc: "Patients stay admitted after medical clearance while families wait for a claim status nobody can confidently explain.",
    tone: "text-[var(--ch-subtle)]",
    bg: "bg-slate-50",
  },
];

export const agents = [
  {
    icon: FileCheck2,
    name: "Query-Proofing Agent",
    tag: "Hospital Console",
    desc: "Checks bills, reports, prescriptions, and policy fit before submission so preventable queries are stopped at intake.",
    card: "bg-[var(--ch-blue-light)] border-[var(--ch-blue-border)]",
    iconWrap: "bg-[color:rgba(74,142,219,0.14)]",
    tone: "text-[var(--ch-blue)]",
  },
  {
    icon: Search,
    name: "Case Review Agent",
    tag: "Insurer Doctor Assist",
    desc: "Reads messy medical files, extracts the case facts, and gives the reviewer a plain-English summary with evidence links.",
    card: "bg-green-50 border-green-200",
    iconWrap: "bg-green-100/80",
    tone: "text-green-600",
  },
  {
    icon: AlertTriangle,
    name: "Fraud Detection Agent",
    tag: "Explainable Risk",
    desc: "Analyzes billing patterns, claim history, and benchmarks to produce a risk score with auditable reasons.",
    card: "bg-red-50 border-red-200",
    iconWrap: "bg-red-100/80",
    tone: "text-red-500",
  },
  {
    icon: MessageSquare,
    name: "Communication Agent",
    tag: "Patient WhatsApp",
    desc: "Keeps patients updated on WhatsApp and answers policy questions with clause-level citations and co-pay clarity.",
    card: "bg-amber-50 border-amber-200",
    iconWrap: "bg-amber-100/80",
    tone: "text-amber-500",
  },
];

export const steps = [
  { step: "01", title: "Capture", desc: "The hospital submits a structured pre-auth package with bills, reports, prescriptions, and policy context.", icon: FileText },
  { step: "02", title: "Query-Proof", desc: "NoLoop flags missing fields, mismatched items, and policy gaps before the claim reaches the TPA or insurer.", icon: Workflow },
  { step: "03", title: "Decide", desc: "Policy rules, coverage limits, exclusions, clinical context, and fraud signals are checked in one shared record.", icon: Search },
  { step: "04", title: "Human Review", desc: "Clean claims move instantly; complex claims go to an insurer doctor with summaries, citations, and audit context.", icon: Shield },
  { step: "05", title: "Settle", desc: "The insurer pays the hospital directly, the patient pays only the co-pay, and discharge no longer waits on confusion.", icon: WalletCards },
];

export const differentiators = [
  { icon: Eye, title: "One Shared Record", desc: "Patient, hospital, TPA, and insurer see the same claim status instead of chasing separate files." },
  { icon: AlertTriangle, title: "Query Prevention", desc: "Missing documents and policy mismatches are caught before they become another email loop." },
  { icon: FileText, title: "Clause-Level Clarity", desc: "Coverage checks cite exact policy clauses so patients and reviewers understand the reason." },
  { icon: CheckCircle2, title: "Human-in-the-loop", desc: "AI reads, checks, and summarizes. Final sensitive approvals stay with insurer doctors." },
];

export const impacts = [
  {
    icon: Clock3,
    value: "8 min",
    label: "Pre-auth Approval Goal",
    sub: "Fast decisions for complete, rule-clean cashless claims",
    card: "bg-[var(--ch-blue-light)] border-[var(--ch-blue-border)]",
    tone: "text-[var(--ch-blue)]",
  },
  {
    icon: Shield,
    value: "150/day",
    label: "Doctor Review Capacity",
    sub: "Structured summaries help reviewers handle more cases with less document fatigue",
    card: "bg-green-50 border-green-200",
    tone: "text-green-600",
  },
  {
    icon: TrendingUp,
    value: "40 min",
    label: "Ready-to-Discharge Target",
    sub: "Patients leave after co-pay instead of waiting days for claim closure",
    card: "bg-amber-50 border-amber-200",
    tone: "text-amber-500",
  },
];

export const trustedBy = ["Hospitals", "TPAs", "Insurers", "Patients", "NHCX-aligned workflows"];

export const testimonials = [
  {
    name: "Sachin Manral",
    role: "Hospital Billing Lead",
    company: "Cashless Desk Operations",
    text: "NoLoop turns the billing desk from a call center into a control room. The team can file once, see the same status as the insurer, and discharge faster.",
    avatar: "SM",
    avatarBg: "bg-[var(--ch-blue)]",
  },
  {
    name: "Sandeep Parjapati",
    role: "Insurance Workflow Manager",
    company: "Digital Adjudication Team",
    text: "The case summaries are the difference. Reviewers still decide, but they stop losing time searching through duplicate PDFs and repeated queries.",
    avatar: "SP",
    avatarBg: "bg-green-500",
  },
  {
    name: "Vaibhav Yadav",
    role: "TPA Operations Head",
    company: "Provider Network Desk",
    text: "One shared record changes the coordination problem. Hospitals, TPAs, and insurers stop arguing over which version of the claim is current.",
    avatar: "VY",
    avatarBg: "bg-amber-500",
  },
  {
    name: "Simran Kukreja",
    role: "Patient Experience Architect",
    company: "Care Operations Program",
    text: "Patients do not need another app during a hospital stay. WhatsApp updates with claim stage and co-pay clarity solve the anxiety directly.",
    avatar: "UG",
    avatarBg: "bg-rose-500",
  },
  {
    name: "Vyakhya Namdev",
    role: "Claims Compliance Reviewer",
    company: "Audit and Governance",
    text: "The explainable fraud score and clause citations make the AI usable. It supports compliance instead of asking teams to trust a black box.",
    avatar: "VN",
    avatarBg: "bg-violet-500",
  },
];

export const pricingPlans = [
  {
    name: "Starter",
    price: "Rs2,999",
    period: "/month",
    desc: "Perfect for small TPAs processing up to 500 claims/month.",
    features: ["Up to 500 claims/month", "Extractor + Policy agents", "Email support", "Basic audit trail", "Standard SLA"],
    cta: "Start Free Trial",
    highlight: false,
    ctaClass: "bg-slate-800 text-white hover:bg-slate-700",
    borderClass: "border-slate-200",
  },
  {
    name: "Professional",
    price: "Rs9,999",
    period: "/month",
    desc: "For growing insurers with full fraud detection capabilities.",
    features: ["Up to 5,000 claims/month", "All 4 AI agents", "Priority support", "Full audit trail + export", "Fraud dashboard", "Custom policy upload"],
    cta: "Get Started",
    highlight: true,
    ctaClass: "bg-white text-[var(--ch-blue-dark)] hover:bg-white/90",
    borderClass: "border-transparent",
    badge: "Most Popular",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For large insurers and hospital networks at scale.",
    features: ["Unlimited claims", "Dedicated AI infrastructure", "24/7 SLA + CSM", "Custom workflow design", "Custom integrations", "Compliance-ready reporting"],
    cta: "Contact Sales",
    highlight: false,
    ctaClass: "bg-violet-600 text-white hover:bg-violet-700",
    borderClass: "border-violet-200",
  },
];

export const faqs = [
  {
    q: "Is the AI making the final claim decision?",
    a: "No. NoLoop reads documents, checks rules, flags risk, and prepares summaries. Human insurer doctors keep final approval control for sensitive or complex cases.",
  },
  {
    q: "What happens if a hospital does not want another third-party tool?",
    a: "NoLoop can be white-labelled on a hospital subdomain, giving billing teams a native-feeling console while reducing manual follow-ups and discharge delays.",
  },
  {
    q: "How is patient data protected?",
    a: "The platform is designed around encryption, consent capture, role-based access, audit trails, and NHCX-aligned claim exchange practices.",
  },
  {
    q: "How does NoLoop make money?",
    a: "The business model combines SaaS subscriptions for hospitals and insurers with a transaction fee per claim processed.",
  },
  {
    q: "How is this different from existing claim systems?",
    a: "Existing tools are usually separated by stakeholder. NoLoop gives hospitals, TPAs, insurers, and patients one shared claim record so the claim is not copied and re-entered at every step.",
  },
];

export const footerLinks = {
  Product: ["Capture", "Decide", "Settle", "Agent Console", "Patient Updates"],
  Stakeholders: ["Hospitals", "Insurers", "TPAs", "Patients", "Provider Networks"],
  Resources: ["NHCX Alignment", "Security", "Implementation Guide", "Claims Playbook", "Support Center"],
  Legal: ["Privacy Policy", "Terms of Service", "Consent", "Audit Trail"],
};

