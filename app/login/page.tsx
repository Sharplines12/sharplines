import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/login-form";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Login`,
  description: `Log in to access premium picks, the dashboard, and gated member content on ${siteConfig.name}.`
};

type LoginPageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = params.next || "/members";

  return (
    <div className="site-container pb-16 pt-10 sm:pt-14">
      <div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="panel-strong p-8">
          <span className="eyebrow">Member Login</span>
          <h1 className="mt-5 text-5xl uppercase text-white">Return to the premium side of {siteConfig.name}.</h1>
          <p className="mt-4 text-sm leading-7">
            This launch login flow supports a free tier and a premium tier. Premium members can access the protected
            picks dashboard, the full daily card, and the archive once authenticated.
          </p>
          <p className="mt-5 text-sm text-mist/65">
            Need an account first?{" "}
            <Link href="/signup" className="text-white hover:text-aqua">
              Create a free account
            </Link>
          </p>
          <div className="mt-8 space-y-4 rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
            <p className="muted-label">Environment-backed credentials</p>
            <p className="text-sm">
              Set <code className="rounded bg-white/10 px-2 py-1">MEMBER_LOGIN_EMAIL</code> and{" "}
              <code className="rounded bg-white/10 px-2 py-1">MEMBER_LOGIN_PASSWORD</code> to control the live member
              login.
            </p>
          </div>
        </div>

        <LoginForm nextPath={nextPath} />
      </div>
    </div>
  );
}
