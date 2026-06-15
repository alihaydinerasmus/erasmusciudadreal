"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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
        stream.getTracks().forEach((t) => t.stop());
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
      setError("Microphone access denied or unavailable.");
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
        throw new Error(data.error ?? "Upload failed");
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
      setError(err instanceof Error ? err.message : "Upload failed");
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
    <div className="space-y-4 border-t border-ink/10 pt-8">
      <h2 className="font-serif text-lg text-ink">Audio message</h2>
      <p className="text-sm text-ink/50">
        Record a voice message or upload an audio file. Only Ali can listen.
      </p>

      {hasExistingAudio && state === "idle" && (
        <p className="text-sm text-ink/60">
          You already have an audio message. Recording or uploading will replace
          it.
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        {state === "idle" && (
          <button type="button" onClick={startRecording} className="btn-primary">
            Start recording
          </button>
        )}

        {state === "recording" && (
          <button
            type="button"
            onClick={stopRecording}
            className="btn-primary bg-terracotta-dark"
          >
            Stop recording
          </button>
        )}

        {state === "recorded" && previewUrl && (
          <>
            <audio controls src={previewUrl} className="w-full" />
            <div className="flex w-full flex-wrap gap-3">
              <button
                type="button"
                onClick={handleUploadRecording}
                className="btn-primary"
              >
                Upload recording
              </button>
              <button
                type="button"
                onClick={() => {
                  setRecordedBlob(null);
                  if (previewUrl) URL.revokeObjectURL(previewUrl);
                  setPreviewUrl(null);
                  setState("idle");
                }}
                className="text-sm text-ink/50 hover:text-ink"
              >
                Discard
              </button>
            </div>
          </>
        )}

        {state === "uploading" && (
          <p className="text-sm text-ink/60">Uploading…</p>
        )}
      </div>

      <div>
        <label htmlFor="audio-file" className="field-label">
          Or upload a file
        </label>
        <input
          id="audio-file"
          type="file"
          accept="audio/*"
          disabled={state === "recording" || state === "uploading"}
          onChange={handleFileUpload}
          className="block w-full text-sm text-ink/70 file:mr-4 file:rounded-sm file:border-0 file:bg-terracotta file:px-4 file:py-2 file:font-serif file:text-sm file:text-paper hover:file:bg-terracotta-dark"
        />
      </div>

      {error && (
        <p className="rounded-sm border border-terracotta/30 bg-terracotta/10 px-4 py-3 text-sm text-terracotta-dark">
          {error}
        </p>
      )}

      {success && (
        <p className="rounded-sm border border-ink/10 bg-paper-dark px-4 py-3 text-sm text-ink/70">
          Audio message saved.
        </p>
      )}
    </div>
  );
}
