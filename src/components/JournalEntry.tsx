interface JournalEntryProps {
  title: string;
  text: string;
}

export function JournalEntry({ title, text }: JournalEntryProps) {
  return (
    <section className="border-t border-ink/10 pt-8">
      <h2 className="mb-4 font-serif text-lg text-ink">{title}</h2>
      <div className="journal-entry rounded-sm border border-ink/10 bg-paper-dark/60 px-6 py-5 shadow-soft">
        <p className="journal-text whitespace-pre-wrap text-xl leading-relaxed text-ink/85">
          {text}
        </p>
      </div>
    </section>
  );
}
