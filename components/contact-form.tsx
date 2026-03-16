"use client";

import { useActionState } from "react";
import { submitContactAction } from "@/app/contact/actions";

const initialState = {
  success: false,
  message: ""
};

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactAction, initialState);

  return (
    <div className="panel-strong p-8">
      <h2 className="text-3xl uppercase text-white">Send a message</h2>
      <p className="mt-3 text-sm">
        This action currently confirms the form locally. Connect it to Resend, your inbox, or a CRM next.
      </p>
      <form action={formAction} className="mt-6 space-y-4">
        <input name="name" type="text" placeholder="Your name" className="glass-input" />
        <input name="email" type="email" placeholder="you@example.com" className="glass-input" />
        <textarea
          name="message"
          rows={6}
          placeholder="Tell us what you want to discuss."
          className="glass-input resize-none"
        />
        <button type="submit" className="cta-primary" disabled={isPending}>
          {isPending ? "Sending..." : "Send message"}
        </button>
        {state.message ? (
          <p className={`text-sm ${state.success ? "text-neon" : "text-amber-200"}`}>{state.message}</p>
        ) : null}
      </form>
    </div>
  );
}
