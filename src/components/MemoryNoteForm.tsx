"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface MemoryNoteFormProps {
  profileId: string;
  token: string;
  initialMemory?: string;
  initialNote?: string;
}

export function MemoryNoteForm({
  profileId,
  token,
  initialMemory = "",
  initialNote = "",
}: MemoryNoteFormProps) {
  const router = useRouter();
  const [memory, setMemory] = useState(initialMemory);
  const [note, setNote] = useState(initialNote);
  const [saving, setSaving] = useState<"memory" | "note" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<"memory" | "note" | null>(null);

  async function saveContent(type: "memory" | "note", content_text: string) {
    setSaving(type);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch(
        `/api/content?profileId=${encodeURIComponent(profileId)}&token=${encodeURIComponent(token)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, content_text }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to save");
      }

      setSuccess(type);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="space-y-8 border-t border-ink/10 pt-8">
      <div className="space-y-4">
        <h2 className="font-serif text-lg text-ink">Favorite memory</h2>
        <p className="text-sm text-ink/50">
          A moment from Erasmus you want to remember — everyone can read this.
        </p>
        <textarea
          id="memory"
          rows={5}
          value={memory}
          onChange={(e) => setMemory(e.target.value)}
          className="field-input journal-text resize-y text-lg"
          placeholder="That night on the rooftop when…"
        />
        <button
          type="button"
          disabled={saving !== null}
          onClick={() => saveContent("memory", memory)}
          className="btn-primary"
        >
          {saving === "memory" ? "Saving…" : "Save memory"}
        </button>
        {success === "memory" && (
          <p className="text-sm text-ink/60">Memory saved.</p>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="font-serif text-lg text-ink">Note to Ali</h2>
        <p className="text-sm text-ink/50">
          A private note — only Ali will read this.
        </p>
        <textarea
          id="note"
          rows={5}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="field-input journal-text resize-y text-lg"
          placeholder="Dear Ali…"
        />
        <button
          type="button"
          disabled={saving !== null}
          onClick={() => saveContent("note", note)}
          className="btn-primary"
        >
          {saving === "note" ? "Saving…" : "Save note"}
        </button>
        {success === "note" && (
          <p className="text-sm text-ink/60">Note saved.</p>
        )}
      </div>

      {error && (
        <p className="rounded-sm border border-terracotta/30 bg-terracotta/10 px-4 py-3 text-sm text-terracotta-dark">
          {error}
        </p>
      )}
    </div>
  );
}
