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
  helperText?: string;
}

function ChevronDownIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={[
        "h-4 w-4 text-ink/35 transition-transform duration-200 dark:text-dark-muted",
        open ? "rotate-180" : "",
      ].join(" ")}
    >
      <path
        fillRule="evenodd"
        d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4 text-ink/30 dark:text-dark-muted/80"
    >
      <path
        fillRule="evenodd"
        d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
        clipRule="evenodd"
      />
    </svg>
  );
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
  helperText,
}: SearchableSelectProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const listboxId = `${inputId}-listbox`;
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
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

  function openDropdown() {
    if (disabled) return;
    setOpen(true);
    setQuery(selectedOption?.label ?? "");
  }

  const displayValue = open ? query : selectedOption?.label ?? "";
  const showPrefix = selectedOption?.prefix && !open;
  const showSearchIcon = !showPrefix;

  return (
    <div ref={containerRef} className="relative">
      <label htmlFor={inputId} className="field-label">
        {label}
      </label>

      <div
        className={[
          "overflow-hidden rounded-sm border bg-cream transition-colors dark:bg-dark-surface",
          open
            ? "border-terracotta/35 shadow-[0_4px_16px_rgba(192,96,48,0.08)] dark:border-terracotta-light/35"
            : "border-ink/15 dark:border-dark-border",
          disabled
            ? "cursor-not-allowed bg-ink/[0.03] opacity-55 dark:bg-dark-bg/60"
            : "hover:border-ink/25 dark:hover:border-dark-muted/40",
        ].join(" ")}
      >
        <div
          className={[
            "relative flex min-h-[48px] items-center",
            disabled ? "cursor-not-allowed" : "",
          ].join(" ")}
          onClick={() => {
            if (disabled) return;
            inputRef.current?.focus();
            openDropdown();
          }}
        >
          <span
            className={[
              "pointer-events-none absolute left-3.5 flex items-center",
              showPrefix ? "text-lg leading-none" : "",
            ].join(" ")}
            aria-hidden="true"
          >
            {showPrefix ? selectedOption?.prefix : <SearchIcon />}
          </span>

          <input
            ref={inputRef}
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
            onFocus={openDropdown}
            className={[
              "min-h-[48px] w-full border-0 bg-transparent py-3 pr-11 text-[15px] text-ink/80 outline-none placeholder:text-ink/35 dark:text-dark-text/90 dark:placeholder:text-dark-muted/80",
              showPrefix || showSearchIcon ? "pl-11" : "pl-4",
              disabled ? "cursor-not-allowed" : "cursor-text",
            ].join(" ")}
          />

          <span className="pointer-events-none absolute right-3.5 flex items-center">
            <ChevronDownIcon open={open} />
          </span>
        </div>

        {open && !disabled && (
          <ul
            id={listboxId}
            role="listbox"
            className="max-h-56 overflow-y-auto border-t border-ink/10 dark:border-dark-border"
          >
            {filteredOptions.length === 0 ? (
              <li className="px-4 py-3 text-sm text-ink/45 dark:text-dark-muted">
                {emptyMessage}
              </li>
            ) : (
              filteredOptions.map((option) => (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={option.value === value}
                >
                  <button
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={[
                      "flex min-h-[48px] w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm transition-colors",
                      option.value === value
                        ? "bg-terracotta/10 text-ink dark:bg-terracotta/15 dark:text-dark-text"
                        : "text-ink/80 hover:bg-terracotta/8 dark:text-dark-text/85 dark:hover:bg-terracotta/12",
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

      {helperText && (
        <p className="mt-1.5 text-[12px] leading-snug text-ink/40 dark:text-dark-muted">
          {helperText}
        </p>
      )}
    </div>
  );
}
