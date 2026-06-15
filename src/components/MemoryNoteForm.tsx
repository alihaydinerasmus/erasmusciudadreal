"use client";

import { useLanguage } from "@/contexts/LanguageContext";

interface MemoryNoteFormProps {
  memory: string;
  note: string;
  onMemoryChange: (value: string) => void;
  onNoteChange: (value: string) => void;
}

export function MemoryNoteForm({
  memory,
  note,
  onMemoryChange,
  onNoteChange,
}: MemoryNoteFormProps) {
  const { t } = useLanguage();

  return (
    <div className="edit-section space-y-10">
      <div className="space-y-4">
        <h2 className="section-title">{t.edit.favoriteMemory}</h2>
        <p className="muted-text">{t.edit.favoriteMemoryDesc}</p>
        <textarea
          id="memory"
          rows={5}
          value={memory}
          onChange={(e) => onMemoryChange(e.target.value)}
          className="paper-textarea journal-text text-xl"
          placeholder={t.edit.favoriteMemoryPlaceholder}
        />
      </div>

      <div className="space-y-4">
        <h2 className="section-title">{t.edit.noteToAli}</h2>
        <p className="muted-text">{t.edit.noteToAliDesc}</p>
        <textarea
          id="note"
          rows={5}
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          className="paper-textarea journal-text text-xl"
          placeholder={t.edit.notePlaceholder}
        />
      </div>
    </div>
  );
}
