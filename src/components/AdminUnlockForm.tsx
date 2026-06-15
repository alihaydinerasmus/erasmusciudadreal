"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export function AdminUnlockForm() {
  const { t } = useLanguage();
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
        credentials: "include",
      });

      if (!res.ok) {
        setStatus("error");
        return;
      }

      setStatus("success");
      window.location.reload();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <label htmlFor="admin-token" className="field-label">
        {t.profile.adminToken}
      </label>
      <input
        id="admin-token"
        type="password"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        className="field-input"
        placeholder={t.profile.adminTokenPlaceholder}
        autoComplete="off"
      />
      <div className="flex justify-end">
        <button
          type="submit"
          className="btn-action"
          disabled={!token || status === "loading"}
        >
          {status === "loading" ? t.profile.unlocking : t.profile.unlockPhotos}
        </button>
      </div>
      {status === "error" && (
        <p className="muted-text text-terracotta-dark">{t.profile.invalidToken}</p>
      )}
    </form>
  );
}
