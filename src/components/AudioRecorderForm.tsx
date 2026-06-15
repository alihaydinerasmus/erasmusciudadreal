"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface AudioRecorderFormProps {
  hasExistingAudio?: boolean;
  audioFile: File | null;
  onAudioChange: (file: File | null) => void;
}

type RecorderState = "idle" | "recording" | "recorded";

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

function blobToFile(blob: Blob, filename: string): File {
  return new File([blob], filename, { type: blob.type });
}

export function AudioRecorderForm({
  hasExistingAudio = false,
  audioFile,
  onAudioChange,
}: AudioRecorderFormProps) {
  const { t } = useLanguage();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [state, setState] = useState<RecorderState>(
    audioFile ? "recorded" : "idle"
  );
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!audioFile) {
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      setState((prev) => (prev === "recording" ? prev : "idle"));
      return;
    }

    const url = URL.createObjectURL(audioFile);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
    setState("recorded");

    return () => URL.revokeObjectURL(url);
  }, [audioFile]);

  async function startRecording() {
    setError(null);

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
        const ext = blob.type.includes("ogg")
          ? "ogg"
          : blob.type.includes("mp4")
            ? "m4a"
            : "webm";
        onAudioChange(blobToFile(blob, `recording.${ext}`));
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

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    onAudioChange(file);
    e.target.value = "";
  }

  function handleDiscard() {
    onAudioChange(null);
    setState("idle");
  }

  return (
    <div className="edit-section space-y-4">
      <h2 className="section-title">{t.edit.audioMessage}</h2>
      <p className="muted-text">{t.edit.audioMessageDesc}</p>

      {hasExistingAudio && !audioFile && state === "idle" && (
        <p className="body-text">{t.edit.audioReplaceWarning}</p>
      )}

      {state === "recorded" && previewUrl && (
        <audio controls src={previewUrl} className="w-full" />
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
          <button
            type="button"
            onClick={handleDiscard}
            className="muted-text hover:text-ink/70"
          >
            {t.edit.discard}
          </button>
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
          disabled={state === "recording"}
          onChange={handleFileUpload}
          className="block w-full text-[13px] text-ink/50 file:mr-4 file:border-0 file:bg-transparent file:font-serif file:text-sm file:text-terracotta hover:file:text-terracotta-dark"
        />
      </div>

      {error && <p className="muted-text text-terracotta-dark">{error}</p>}
    </div>
  );
}
