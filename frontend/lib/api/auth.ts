"use client";

import { getDemoUserForRole } from "@/lib/demoWorkflow";
import { readStorage, writeStorage } from "@/lib/api/storage";
import type { AppUser, UserRole } from "@/types";

const CURRENT_USER_KEY = "noloop.currentUser";
const ROLE_KEY = "noloop.role";
const LOCAL_USERS_KEY = "noloop.demo.users";
const SESSION_EVENT = "noloop-auth-change";

export const DEMO_PASSWORD = "demo1234";

export const DEMO_CREDENTIALS: Record<UserRole, { email: string; password: string; user: AppUser }> = {
  patient: {
    email: "arjun.demo@noloop.ai",
    password: DEMO_PASSWORD,
    user: getDemoUserForRole("patient"),
  },
  hospital: {
    email: "citycare.demo@noloop.ai",
    password: DEMO_PASSWORD,
    user: getDemoUserForRole("hospital"),
  },
  insurer: {
    email: "insurer.demo@noloop.ai",
    password: DEMO_PASSWORD,
    user: getDemoUserForRole("insurer"),
  },
};

export type SignupPayload = {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: UserRole;
  state?: string;
  patientId?: string;
  dob?: string;
  policyNumber?: string;
  insuranceCompany?: string;
  sumInsured?: number;
  doctorName?: string;
  hospitalRegNo?: string;
  city?: string;
  department?: string;
  employeeId?: string;
  website?: string;
  organizationType?: string;
  organizationCode?: string;
  taxId?: string;
  npi?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  registrationCertificateName?: string;
  policyDocumentName?: string;
};

type SocialSignupPayload = Omit<SignupPayload, "password">;
type StoredUserRecord = {
  user: AppUser;
  password: string;
};

const toOptionalString = (value?: string | null) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

const toOptionalNumber = (value?: number) => (typeof value === "number" && Number.isFinite(value) ? value : undefined);
const normalizeEmail = (email: string) => email.trim().toLowerCase();
const deriveRoleId = (role: UserRole, uid: string) => `${role[0].toUpperCase()}-${uid.slice(0, 8).toUpperCase()}`;

const deriveDisplayName = (email: string, name?: string | null) => {
  const trimmedName = name?.trim();
  return trimmedName || email.split("@")[0] || "NoLoop User";
};

const dispatchSessionChange = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(SESSION_EVENT));
};

const cacheCurrentUser = (user: AppUser | null) => {
  if (typeof window === "undefined") {
    return;
  }

  if (!user) {
    window.localStorage.removeItem("user");
    window.localStorage.removeItem("role");
    window.localStorage.removeItem(CURRENT_USER_KEY);
    window.localStorage.removeItem(ROLE_KEY);
    dispatchSessionChange();
    return;
  }

  writeStorage(CURRENT_USER_KEY, user);
  writeStorage(ROLE_KEY, user.role);
  window.localStorage.setItem("role", user.role);
  window.localStorage.setItem("user", JSON.stringify(user));
  dispatchSessionChange();
};

const readStoredUsers = () => readStorage<StoredUserRecord[]>(LOCAL_USERS_KEY, []);
const writeStoredUsers = (records: StoredUserRecord[]) => writeStorage(LOCAL_USERS_KEY, records);

const getDemoCredentialForRole = (role: UserRole) => DEMO_CREDENTIALS[role];

const buildUserProfile = ({
  uid,
  email,
  role,
  authProvider,
  name,
  phone,
  state,
  patientId,
  dob,
  policyNumber,
  insuranceCompany,
  sumInsured,
  doctorName,
  hospitalRegNo,
  city,
  department,
  employeeId,
  website,
  organizationType,
  organizationCode,
  taxId,
  npi,
  contactName,
  contactEmail,
  contactPhone,
  registrationCertificateName,
  policyDocumentName,
}: Omit<SocialSignupPayload, "email"> & {
  uid: string;
  email: string;
  authProvider: NonNullable<AppUser["authProvider"]>;
}) => ({
  uid,
  id: deriveRoleId(role, uid),
  name: deriveDisplayName(email, name),
  email: normalizeEmail(email),
  role,
  authProvider,
  phone: toOptionalString(phone),
  state: toOptionalString(state),
  patientId: role === "patient" ? toOptionalString(patientId) ?? deriveRoleId("patient", uid) : undefined,
  dob: toOptionalString(dob),
  policyNumber: toOptionalString(policyNumber),
  insuranceCompany: toOptionalString(insuranceCompany),
  sumInsured: toOptionalNumber(sumInsured),
  doctorName: toOptionalString(doctorName),
  hospitalRegNo: toOptionalString(hospitalRegNo),
  city: toOptionalString(city),
  department: toOptionalString(department),
  employeeId: toOptionalString(employeeId),
  website: toOptionalString(website),
  organizationType: toOptionalString(organizationType),
  organizationCode: toOptionalString(organizationCode),
  taxId: toOptionalString(taxId),
  npi: toOptionalString(npi),
  contactName: toOptionalString(contactName),
  contactEmail: toOptionalString(contactEmail),
  contactPhone: toOptionalString(contactPhone),
  registrationCertificateName: toOptionalString(registrationCertificateName),
  policyDocumentName: toOptionalString(policyDocumentName),
}) satisfies AppUser;

const enforceRole = (user: AppUser, role: UserRole) => {
  if (user.role !== role) {
    throw new Error(`This account is registered for the ${user.role} workspace. Please sign in there instead.`);
  }

  cacheCurrentUser(user);
  return user;
};

export const getCurrentUser = async (): Promise<AppUser | null> => {
  return readStorage<AppUser | null>(CURRENT_USER_KEY, null);
};

export const getRole = async (): Promise<UserRole | null> => {
  const user = await getCurrentUser();
  return user?.role ?? readStorage<UserRole | null>(ROLE_KEY, null);
};

export const getDashboardPath = (role: UserRole | null) => {
  if (role === "patient") {
    return "/dashboard/patient";
  }

  if (role === "hospital") {
    return "/dashboard/hospital";
  }

  if (role === "insurer") {
    return "/dashboard/insurer";
  }

  return "/auth/login";
};

export const loginUser = async (email: string, password: string, role: UserRole) => {
  const normalizedEmail = normalizeEmail(email);
  const demo = getDemoCredentialForRole(role);

  if (normalizedEmail === demo.email && password === demo.password) {
    return enforceRole(demo.user, role);
  }

  const storedRecord = readStoredUsers().find((record) => record.user.email === normalizedEmail);
  if (storedRecord && storedRecord.password === password) {
    return enforceRole(storedRecord.user, role);
  }

  throw new Error("Use the demo credentials shown for the selected workspace.");
};

export const signupUser = async (payload: SignupPayload) => {
  const normalizedEmail = normalizeEmail(payload.email);
  const demoEmailTaken = Object.values(DEMO_CREDENTIALS).some((credential) => credential.email === normalizedEmail);
  const storedUsers = readStoredUsers();

  if (demoEmailTaken || storedUsers.some((record) => record.user.email === normalizedEmail)) {
    throw new Error("An account with this email already exists in this demo.");
  }

  const uid = `demo-${payload.role}-${Date.now().toString(36)}`;
  const profile = buildUserProfile({
    ...payload,
    uid,
    email: normalizedEmail,
    authProvider: "password",
  });

  writeStoredUsers([...storedUsers, { user: profile, password: payload.password }]);
  cacheCurrentUser(profile);
  return profile;
};

export const subscribeToAuthState = (listener: (user: AppUser | null) => void) => {
  if (typeof window === "undefined") {
    listener(null);
    return () => {};
  }

  const emitCurrentUser = () => {
    listener(readStorage<AppUser | null>(CURRENT_USER_KEY, null));
  };

  const handleStorage = (event: StorageEvent) => {
    if (!event.key || event.key === CURRENT_USER_KEY || event.key === ROLE_KEY || event.key === "user" || event.key === "role") {
      emitCurrentUser();
    }
  };

  window.addEventListener(SESSION_EVENT, emitCurrentUser);
  window.addEventListener("storage", handleStorage);
  window.setTimeout(emitCurrentUser, 0);

  return () => {
    window.removeEventListener(SESSION_EVENT, emitCurrentUser);
    window.removeEventListener("storage", handleStorage);
  };
};

export const logout = async (withConfirmation: boolean = true) => {
  if (typeof window === "undefined") {
    return;
  }

  if (withConfirmation && !window.confirm("Are you sure you want to logout?")) {
    return;
  }

  cacheCurrentUser(null);
  window.location.href = "/auth/login";
};
