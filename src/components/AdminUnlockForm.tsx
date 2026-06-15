"use client";

import { useState } from "react";

export function AdminUnlockForm() {
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
    <form onSubmit={handleSubmit} className="mx-auto max-w-sm space-y-3">
      <label htmlFor="admin-token" className="field-label">
        Admin token
      </label>
      <input
        id="admin-token"
        type="password"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        className="field-input"
        placeholder="Paste your ADMIN_TOKEN"
        autoComplete="off"
      />
      <button type="submit" className="btn-primary w-full" disabled={!token || status === "loading"}>
        {status === "loading" ? "Unlocking…" : "Unlock photos"}
      </button>
      {status === "error" && (
        <p className="text-center text-sm text-terracotta-dark">Invalid token</p>
      )}
    </form>
  );
}
