interface JournalEntryProps {
  title: string;
  text: string;
}

export function JournalEntry({ title, text }: JournalEntryProps) {
  return (
    <section className="edit-section">
      <h2 className="section-title mb-4">{title}</h2>
      <div className="journal-entry py-2">
        <p className="journal-text whitespace-pre-wrap text-xl leading-relaxed text-ink/85 dark:text-dark-text/85">
          {text}
        </p>
      </div>
    </section>
  );
}
