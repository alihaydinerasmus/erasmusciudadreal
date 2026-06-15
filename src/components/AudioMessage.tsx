interface AudioMessageProps {
  signedUrl: string;
  profileName: string;
}

export function AudioMessage({ signedUrl, profileName }: AudioMessageProps) {
  return (
    <section className="border-t border-ink/10 pt-8">
      <h2 className="mb-4 font-serif text-lg text-ink">Audio message</h2>
      <div className="rounded-sm border border-ink/10 bg-paper-dark/60 px-6 py-5">
        <audio
          controls
          preload="metadata"
          className="w-full"
          aria-label={`Audio message from ${profileName}`}
        >
          <source src={signedUrl} />
          Your browser does not support audio playback.
        </audio>
      </div>
    </section>
  );
}
