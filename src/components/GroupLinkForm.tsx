"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function GroupLinkForm() {
  const router = useRouter();
  const [slug, setSlug] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = slug.trim().replace(/^\/+|\/+$/g, "");
    if (!trimmed) return;

    const path = trimmed.startsWith("group/")
      ? `/${trimmed}`
      : `/group/${trimmed}`;

    router.push(path);
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-md space-y-4">
      <label htmlFor="group-slug" className="sr-only">
        Group link or slug
      </label>
      <input
        id="group-slug"
        type="text"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        placeholder="Paste your group link or slug…"
        className="field-input text-center"
      />
      <button type="submit" className="btn-primary w-full">
        Enter the album
      </button>
    </form>
  );
}
