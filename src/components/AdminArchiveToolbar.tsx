"use client";

interface AdminArchiveToolbarProps {
  profileCount: number;
}

export function AdminArchiveToolbar({ profileCount }: AdminArchiveToolbarProps) {
  return (
    <div className="archive-toolbar no-print">
      <div>
        <a
          href="/admin"
          className="text-[13px] text-ink/40 hover:text-ink/70 dark:text-dark-muted dark:hover:text-dark-text/80"
        >
          ← Admin
        </a>
        <p className="mt-1 text-[13px] text-ink/40 dark:text-dark-muted">
          {profileCount} kişi · Cmd+P ile yazdır
        </p>
      </div>
      <button
        type="button"
        onClick={() => window.print()}
        className="btn-primary shrink-0"
      >
        🖨️ Yazdır / PDF olarak kaydet
      </button>
    </div>
  );
}
