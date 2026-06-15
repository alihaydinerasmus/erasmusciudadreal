"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { t } = useLanguage();
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
        throw new Error(data.error ?? t.common.failedToSave);
      }

      setSuccess(type);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t.common.somethingWentWrong
      );
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="edit-section space-y-10">
      <div className="space-y-4">
        <h2 className="section-title">{t.edit.favoriteMemory}</h2>
        <p className="muted-text">{t.edit.favoriteMemoryDesc}</p>
        <textarea
          id="memory"
          rows={5}
          value={memory}
          onChange={(e) => setMemory(e.target.value)}
          className="paper-textarea journal-text text-xl"
          placeholder={t.edit.favoriteMemoryPlaceholder}
        />
        <div className="flex items-center justify-end gap-4">
          {success === "memory" && (
            <p className="muted-text">{t.edit.memorySaved}</p>
          )}
          <button
            type="button"
            disabled={saving !== null}
            onClick={() => saveContent("memory", memory)}
            className="btn-action"
          >
            {saving === "memory" ? t.common.saving : t.edit.saveMemory}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="section-title">{t.edit.noteToAli}</h2>
        <p className="muted-text">{t.edit.noteToAliDesc}</p>
        <textarea
          id="note"
          rows={5}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="paper-textarea journal-text text-xl"
          placeholder={t.edit.notePlaceholder}
        />
        <div className="flex items-center justify-end gap-4">
          {success === "note" && (
            <p className="muted-text">{t.edit.noteSaved}</p>
          )}
          <button
            type="button"
            disabled={saving !== null}
            onClick={() => saveContent("note", note)}
            className="btn-action"
          >
            {saving === "note" ? t.common.saving : t.edit.saveNote}
          </button>
        </div>
      </div>

      {error && <p className="muted-text text-terracotta-dark">{error}</p>}
    </div>
  );
}
