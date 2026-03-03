"use client";

import { PhoneInput as RiphoneInput } from "react-international-phone";
import "react-international-phone/style.css";

export interface PhoneInputProps {
  value: string;
  onChange: (phone: string) => void;
  error?: string;
  disabled?: boolean;
  label?: string;
  id?: string;
}

/**
 * PhoneInput — выбор страны + маска, E.164 на выходе.
 * Вариант A: react-international-phone (~45kb gzip). Бандл <500kb — выбран.
 */
export function PhoneInput({
  value,
  onChange,
  error,
  disabled,
  label = "Телефон",
  id = "phone-input",
}: PhoneInputProps) {
  return (
    <div className="w-full phone-input-wrap">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-[var(--text-secondary)]">
          {label}
        </label>
      )}
      <div
        className={`mt-1 ${error ? "phone-input-error" : ""}`}
        style={
          {
            "--riph-height": "48px",
            "--riph-bg": "var(--bg-surface)",
            "--riph-text": "var(--text-primary)",
            "--riph-border": "rgba(255,255,255,0.1)",
          } as React.CSSProperties
        }
      >
        <RiphoneInput
          defaultCountry="ru"
          value={value}
          onChange={(phone) => onChange(phone)}
          disabled={disabled}
          inputProps={{
            id,
            inputMode: "tel",
            autoComplete: "tel",
            "aria-invalid": !!error,
            "aria-describedby": error ? `${id}-error` : undefined,
            style: { fontSize: "16px" },
          }}
        />
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-[#f08c7a]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
