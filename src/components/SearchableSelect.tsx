"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

export interface SearchableSelectOption {
  value: string;
  label: string;
  prefix?: string;
}

interface SearchableSelectProps {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string, option: SearchableSelectOption | null) => void;
  options: SearchableSelectOption[];
  placeholder: string;
  disabled?: boolean;
  emptyMessage: string;
}

export function SearchableSelect({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  emptyMessage,
}: SearchableSelectProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const listboxId = `${inputId}-listbox`;
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) ?? null,
    [options, value]
  );

  const filteredOptions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return options.slice(0, 120);

    return options
      .filter((option) => option.label.toLowerCase().includes(normalized))
      .slice(0, 120);
  }, [options, query]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  function handleSelect(option: SearchableSelectOption) {
    onChange(option.value, option);
    setOpen(false);
    setQuery("");
  }

  const displayValue = open ? query : selectedOption?.label ?? "";

  return (
    <div ref={containerRef} className="relative">
      <label htmlFor={inputId} className="field-label">
        {label}
      </label>
      <div className="relative">
        {selectedOption?.prefix && !open && (
          <span
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg leading-none"
            aria-hidden="true"
          >
            {selectedOption.prefix}
          </span>
        )}
        <input
          id={inputId}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          disabled={disabled}
          value={displayValue}
          placeholder={placeholder}
          onChange={(event) => {
            setQuery(event.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={() => {
            setOpen(true);
            setQuery(selectedOption?.label ?? "");
          }}
          className={[
            "field-input",
            selectedOption?.prefix && !open ? "pl-10" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        />
      </div>

      {open && !disabled && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto border border-ink/10 bg-cream py-1 shadow-[0_4px_20px_rgba(44,33,22,0.06)] dark:border-dark-border dark:bg-surface dark:shadow-[0_4px_20px_rgba(0,0,0,0.35)]"
        >
          {filteredOptions.length === 0 ? (
            <li className="px-4 py-3 text-sm text-ink/45 dark:text-dark-muted">{emptyMessage}</li>
          ) : (
            filteredOptions.map((option) => (
              <li key={option.value} role="option" aria-selected={option.value === value}>
                <button
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={[
                    "flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors hover:bg-paper-dark dark:hover:bg-dark-border/60",
                    option.value === value
                      ? "bg-paper-dark/70 text-ink dark:bg-dark-border/70 dark:text-dark-text"
                      : "text-ink/80 dark:text-dark-text/80",
                  ].join(" ")}
                >
                  {option.prefix && (
                    <span className="text-lg leading-none" aria-hidden="true">
                      {option.prefix}
                    </span>
                  )}
                  <span>{option.label}</span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
