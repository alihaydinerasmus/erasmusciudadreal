"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface AudioRecorderFormProps {
  profileId: string;
  token: string;
  hasExistingAudio?: boolean;
}

type RecorderState = "idle" | "recording" | "recorded" | "uploading";

function getSupportedMimeType(): string {
  const types = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/ogg;codecs=opus",
    "audio/mp4",
  ];
  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) return type;
  }
  return "";
}

export function AudioRecorderForm({
  profileId,
  token,
  hasExistingAudio = false,
}: AudioRecorderFormProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [state, setState] = useState<RecorderState>("idle");
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  async function startRecording() {
    setError(null);
    setSuccess(false);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getSupportedMimeType();
      const recorder = new MediaRecorder(
        stream,
        mimeType ? { mimeType } : undefined
      );

      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(chunksRef.current, {
          type: mimeType || "audio/webm",
        });
        setRecordedBlob(blob);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(URL.createObjectURL(blob));
        setState("recorded");
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setState("recording");
    } catch {
      setError(t.edit.micDenied);
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current = null;
  }

  async function uploadBlob(blob: Blob, filename: string) {
    setState("uploading");
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append("file", blob, filename);

    try {
      const res = await fetch(
        `/api/upload?profileId=${encodeURIComponent(profileId)}&token=${encodeURIComponent(token)}&type=audio`,
        { method: "POST", body: formData }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? t.common.uploadFailed);
      }

      setSuccess(true);
      setRecordedBlob(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      setState("idle");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.common.uploadFailed);
      setState(recordedBlob ? "recorded" : "idle");
    }
  }

  async function handleUploadRecording() {
    if (!recordedBlob) return;
    const ext = recordedBlob.type.includes("ogg")
      ? "ogg"
      : recordedBlob.type.includes("mp4")
        ? "m4a"
        : "webm";
    await uploadBlob(recordedBlob, `recording.${ext}`);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadBlob(file, file.name);
    e.target.value = "";
  }

  return (
    <div className="edit-section space-y-4">
      <h2 className="section-title">{t.edit.audioMessage}</h2>
      <p className="muted-text">{t.edit.audioMessageDesc}</p>

      {hasExistingAudio && state === "idle" && (
        <p className="body-text">{t.edit.audioReplaceWarning}</p>
      )}

      {state === "recorded" && previewUrl && (
        <audio controls src={previewUrl} className="w-full" />
      )}

      {state === "uploading" && (
        <p className="body-text">{t.common.uploading}</p>
      )}

      <div className="flex flex-wrap items-center justify-end gap-3">
        {state === "idle" && (
          <button type="button" onClick={startRecording} className="btn-action">
            {t.edit.startRecording}
          </button>
        )}

        {state === "recording" && (
          <button
            type="button"
            onClick={stopRecording}
            className="btn-action bg-terracotta-dark"
          >
            {t.edit.stopRecording}
          </button>
        )}

        {state === "recorded" && previewUrl && (
          <>
            <button
              type="button"
              onClick={() => {
                setRecordedBlob(null);
                if (previewUrl) URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
                setState("idle");
              }}
              className="muted-text hover:text-ink/70"
            >
              {t.edit.discard}
            </button>
            <button
              type="button"
              onClick={handleUploadRecording}
              className="btn-action"
            >
              {t.edit.uploadRecording}
            </button>
          </>
        )}
      </div>

      <div>
        <label htmlFor="audio-file" className="field-label">
          {t.edit.orUploadFile}
        </label>
        <input
          id="audio-file"
          type="file"
          accept="audio/*"
          disabled={state === "recording" || state === "uploading"}
          onChange={handleFileUpload}
          className="block w-full text-[13px] text-ink/50 file:mr-4 file:border-0 file:bg-transparent file:font-serif file:text-sm file:text-terracotta hover:file:text-terracotta-dark"
        />
      </div>

      {error && <p className="muted-text text-terracotta-dark">{error}</p>}
      {success && <p className="body-text">{t.edit.audioSaved}</p>}
    </div>
  );
}
