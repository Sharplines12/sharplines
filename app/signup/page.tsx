import type { Metadata } from "next";
import { SignupForm } from "@/components/signup-form";
import { siteConfig } from "@/lib/data";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Sign Up`,
  description: `Create a free account to follow ${siteConfig.name}, save content, and upgrade to premium later.`
};

export default function SignupPage() {
  return (
    <div className="site-container pb-16 pt-10 sm:pt-14">
      <div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="panel-strong p-8">
          <span className="eyebrow">Free account</span>
          <h1 className="mt-5 text-5xl uppercase text-white">Create a free account and enter the content side first.</h1>
          <p className="mt-4 text-sm leading-7">
            Free accounts give users a cleaner path into the site, saved content placeholders, and a clear upgrade
            route into premium picks without making the site feel like a one-page affiliate shell.
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
