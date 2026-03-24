"use client";

import { useEffect, useState } from "react";
import { MaintenanceGate } from "@/components/maintenance-gate";
import { MAINTENANCE_COOKIE_NAME, MAINTENANCE_COOKIE_VALUE } from "@/lib/site-lock";

type MaintenanceOverlayProps = {
  initiallyUnlocked: boolean;
};

function hasAccessCookie() {
  if (typeof document === "undefined") {
    return false;
  }

  return document.cookie
    .split(";")
    .map((part) => part.trim())
    .some((part) => part === `${MAINTENANCE_COOKIE_NAME}=${MAINTENANCE_COOKIE_VALUE}`);
}

export function MaintenanceOverlay({ initiallyUnlocked }: MaintenanceOverlayProps) {
  const [isUnlocked, setIsUnlocked] = useState(initiallyUnlocked);

  useEffect(() => {
    setIsUnlocked(hasAccessCookie());
  }, []);

  useEffect(() => {
    if (isUnlocked) {
      return;
    }

    function handleFocus() {
      if (hasAccessCookie()) {
        setIsUnlocked(true);
      }
    }

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [isUnlocked]);

  if (isUnlocked) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[200] bg-ink">
      <MaintenanceGate />
    </div>
  );
}
