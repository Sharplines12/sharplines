"use client";

import type { ReactNode } from "react";
import { useTransition } from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type CheckoutButtonProps = {
  children: ReactNode;
  className?: string;
  plan?: "monthly" | "yearly";
};

export function CheckoutButton({ children, className, plan = "monthly" }: CheckoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className={cn(className, isPending ? "opacity-75" : "")}
      onClick={() => {
        startTransition(async () => {
          const response = await fetch(`/api/checkout?plan=${plan}`, {
            method: "POST"
          });
          const data = (await response.json()) as { url?: string };

          if (data.url) {
            window.location.href = data.url;
          }
        });
      }}
      disabled={isPending}
    >
      {isPending ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  );
}
