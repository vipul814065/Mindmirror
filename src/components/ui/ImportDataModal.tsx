"use client";

import { useState } from "react";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassTextarea } from "@/components/ui/GlassTextarea";

const MAX_IMPORT_BYTES = 512 * 1024;

interface ImportDataModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (json: string) => void;
}

export function ImportDataModal({ open, onClose, onImport }: ImportDataModalProps) {
  const [json, setJson] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleImport = () => {
    if (new TextEncoder().encode(json).length > MAX_IMPORT_BYTES) {
      setError("Import data exceeds 512KB limit.");
      return;
    }
    if (!json.trim()) {
      setError("Please paste backup JSON.");
      return;
    }
    onImport(json);
    setJson("");
    setError(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="import-dialog-title"
    >
      <div className="glass-strong w-full max-w-lg space-y-4 rounded-2xl p-6">
        <h2 id="import-dialog-title" className="text-lg font-semibold text-foreground">
          Import Backup Data
        </h2>
        <p className="text-sm text-muted">
          Paste your exported JSON backup below. Maximum size is 512KB.
        </p>
        <GlassTextarea
          label="Backup JSON"
          value={json}
          onChange={(e) => {
            setJson(e.target.value);
            setError(null);
          }}
          rows={8}
          error={error ?? undefined}
        />
        <div className="flex justify-end gap-2">
          <GlassButton variant="ghost" onClick={onClose}>
            Cancel
          </GlassButton>
          <GlassButton onClick={handleImport}>Import</GlassButton>
        </div>
      </div>
    </div>
  );
}
