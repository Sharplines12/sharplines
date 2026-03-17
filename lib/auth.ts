import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac, timingSafeEqual } from "node:crypto";
import type { User } from "@supabase/supabase-js";
import { createSupabaseServerClient, createSupabaseServiceClient, isSupabaseConfigured } from "@/lib/supabase";

export type MembershipState = "public" | "authenticated" | "active-paid-member";

export type SessionUser = {
  id?: string;
  email: string;
  role: "free" | "paid" | "admin";
  membershipState: MembershipState;
  fullName?: string | null;
};

type AuthResult =
  | { status: "success"; user: SessionUser }
  | { status: "verify_email" }
  | { status: "error"; message: string };

const COOKIE_NAME = "premium_picks_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;

function getSecret() {
  return process.env.AUTH_SECRET || "dev-only-secret-change-me";
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("hex");
}

function encodeSession(user: SessionUser) {
  const payload = Buffer.from(JSON.stringify(user)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function decodeSession(token: string): SessionUser | null {
  const [payload, signature] = token.split(".");

  if (!payload || !signature) {
    return null;
  }

  const expected = sign(payload);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (
    actualBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(actualBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as SessionUser;
  } catch {
    return null;
  }
}

function getDemoCredentials() {
  const freeEmail = process.env.FREE_LOGIN_EMAIL || "free@sharplines.com";
  const freePassword = process.env.FREE_LOGIN_PASSWORD || "free-member";
  const memberEmail = process.env.MEMBER_LOGIN_EMAIL || "member@example.com";
  const memberPassword = process.env.MEMBER_LOGIN_PASSWORD || "premium-member";
  const adminEmail = process.env.DEMO_ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.DEMO_ADMIN_PASSWORD || "premium-admin";

  return {
    free: {
      email: freeEmail,
      password: freePassword,
      role: "free" as const,
      membershipState: "authenticated" as const
    },
    member: {
      email: memberEmail,
      password: memberPassword,
      role: "paid" as const,
      membershipState: "active-paid-member" as const
    },
    admin: {
      email: adminEmail,
      password: adminPassword,
      role: "admin" as const,
      membershipState: "active-paid-member" as const
    }
  };
}

async function getFallbackSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return token ? decodeSession(token) : null;
}

async function getProfileForUser(user: User) {
  const supabase = await createSupabaseServerClient();
  const fullName = typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name : null;

  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        full_name: fullName,
        membership_tier: "free"
      },
      { onConflict: "id" }
    )
    .select("id, full_name, membership_tier, membership_plan, subscription_status")
    .single();

  if (error || !data) {
    return {
      id: user.id,
      full_name: fullName,
      membership_tier: "free" as const,
      membership_plan: "monthly" as const,
      subscription_status: "inactive"
    };
  }

  return data;
}

async function autoConfirmSupabaseUserByEmail(email: string) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return false;
  }

  const serviceClient = createSupabaseServiceClient();
  const { data } = await serviceClient.auth.admin.listUsers();
  const user = data.users.find((item) => item.email?.toLowerCase() === email.toLowerCase());

  if (!user) {
    return false;
  }

  const result = await serviceClient.auth.admin.updateUserById(user.id, {
    email_confirm: true
  });

  return !result.error;
}

async function createOrConfirmSupabaseUser(params: { email: string; password: string; name: string }) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }

  const serviceClient = createSupabaseServiceClient();
  const { data } = await serviceClient.auth.admin.listUsers();
  const existingUser = data.users.find((item) => item.email?.toLowerCase() === params.email.toLowerCase());

  if (existingUser) {
    const updateResult = await serviceClient.auth.admin.updateUserById(existingUser.id, {
      password: params.password,
      email_confirm: true,
      user_metadata: {
        ...(existingUser.user_metadata || {}),
        full_name: params.name
      }
    });

    if (updateResult.error) {
      throw updateResult.error;
    }

    return updateResult.data.user;
  }

  const createResult = await serviceClient.auth.admin.createUser({
    email: params.email,
    password: params.password,
    email_confirm: true,
    user_metadata: {
      full_name: params.name
    }
  });

  if (createResult.error) {
    throw createResult.error;
  }

  return createResult.data.user;
}

function mapSupabaseUserToSession(user: User, profile: { membership_tier: string; full_name?: string | null }): SessionUser {
  const role = profile.membership_tier === "admin" ? "admin" : profile.membership_tier === "premium" ? "paid" : "free";
  const membershipState = role === "paid" || role === "admin" ? "active-paid-member" : "authenticated";

  return {
    id: user.id,
    email: user.email || "",
    role,
    membershipState,
    fullName: profile.full_name || null
  };
}

export async function getSession() {
  if (!isSupabaseConfigured()) {
    return getFallbackSession();
  }

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user?.email) {
      return null;
    }

    const profile = await getProfileForUser(user);
    return mapSupabaseUserToSession(user, profile);
  } catch {
    return null;
  }
}

export async function createSession(user: SessionUser) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, encodeSession(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS
  });
}

export async function destroySession() {
  if (!isSupabaseConfigured()) {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
    return;
  }

  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
}

export async function authenticate(formData: FormData): Promise<AuthResult> {
  if (!isSupabaseConfigured()) {
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "");
    const credentials = getDemoCredentials();

    if (email === credentials.member.email && password === credentials.member.password) {
      return {
        status: "success",
        user: {
          email: credentials.member.email,
          role: credentials.member.role,
          membershipState: credentials.member.membershipState
        }
      };
    }

    if (email === credentials.free.email && password === credentials.free.password) {
      return {
        status: "success",
        user: {
          email: credentials.free.email,
          role: credentials.free.role,
          membershipState: credentials.free.membershipState
        }
      };
    }

    if (email === credentials.admin.email && password === credentials.admin.password) {
      return {
        status: "success",
        user: {
          email: credentials.admin.email,
          role: credentials.admin.role,
          membershipState: credentials.admin.membershipState
        }
      };
    }

    return {
      status: "error",
      message: "Login failed. Use your configured member credentials from the environment variables."
    };
  }

  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error?.message?.toLowerCase().includes("email not confirmed")) {
    const confirmed = await autoConfirmSupabaseUserByEmail(email);

    if (confirmed) {
      const retry = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (!retry.error && retry.data.user?.email) {
        const profile = await getProfileForUser(retry.data.user);

        return {
          status: "success",
          user: mapSupabaseUserToSession(retry.data.user, profile)
        };
      }
    }

    return {
      status: "verify_email"
    };
  }

  if (error || !data.user?.email) {
    return {
      status: "error",
      message: "Login failed. Check your email and password, then try again."
    };
  }

  const profile = await getProfileForUser(data.user);

  return {
    status: "success",
    user: mapSupabaseUserToSession(data.user, profile)
  };
}

export async function registerUser(formData: FormData): Promise<AuthResult> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const name = String(formData.get("name") || "").trim();

  if (!email || !password || !name) {
    return {
      status: "error",
      message: "Add your name, email, and password to create the account."
    };
  }

  if (!isSupabaseConfigured()) {
    const user: SessionUser = {
      email,
      role: "free",
      membershipState: "authenticated",
      fullName: name
    };

    await createSession(user);

    return {
      status: "success",
      user
    };
  }

  const supabase = await createSupabaseServerClient();

  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    await createOrConfirmSupabaseUser({
      email,
      password,
      name
    });

    const signIn = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (signIn.error || !signIn.data.user?.email) {
      return {
        status: "error",
        message: "Account was created, but the automatic login did not complete. Try logging in once more."
      };
    }

    const profile = await getProfileForUser(signIn.data.user);

    return {
      status: "success",
      user: mapSupabaseUserToSession(signIn.data.user, profile)
    };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name
      }
    }
  });

  if (error) {
    return {
      status: "error",
      message: error.message
    };
  }

  if (!data.user) {
    return {
      status: "error",
      message: "Signup did not complete. Please try again."
    };
  }

  const profile = await getProfileForUser(data.user);

  if (!data.session) {
    return {
      status: "verify_email"
    };
  }

  return {
    status: "success",
    user: mapSupabaseUserToSession(data.user, profile)
  };
}

export async function requirePaidMember() {
  const session = await getSession();

  if (!session || session.membershipState !== "active-paid-member") {
    redirect("/login?next=/members");
  }

  return session;
}

export async function requireAuthenticatedUser(nextPath = "/dashboard") {
  const session = await getSession();

  if (!session) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }

  return session;
}

export function isPaidAccess(role: SessionUser["role"]) {
  return role === "paid" || role === "admin";
}

export async function requireAdminUser(nextPath = "/dashboard/audience") {
  const session = await requireAuthenticatedUser(nextPath);

  if (session.role !== "admin") {
    redirect("/dashboard");
  }

  return session;
}
