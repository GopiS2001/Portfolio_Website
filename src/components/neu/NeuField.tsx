import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

const field =
  "neu-in w-full rounded-[var(--r-md)] border border-transparent bg-transparent px-5 py-3.5 text-fg outline-none transition placeholder:text-subtle focus-visible:border-accent focus-visible:outline-none aria-invalid:border-red-500/70";

type Base = { name: string; label: string; error?: string };

function Label({ name, label }: { name: string; label: string }) {
  return (
    <label htmlFor={`field-${name}`} className="mb-2 block text-sm font-medium text-muted">
      {label}
    </label>
  );
}

function FieldError({ name, error }: { name: string; error?: string }) {
  if (!error) return null;
  return (
    <p id={`field-${name}-error`} className="mt-2 text-sm text-red-600 dark:text-red-400">
      {error}
    </p>
  );
}

/** Pressed text input with a real label and an error message wired up via aria-describedby. */
export function NeuInput({ name, label, error, className = "", ...rest }: Base & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={className}>
      <Label name={name} label={label} />
      <input
        id={`field-${name}`}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `field-${name}-error` : undefined}
        className={field}
        {...rest}
      />
      <FieldError name={name} error={error} />
    </div>
  );
}

export function NeuTextarea({
  name,
  label,
  error,
  className = "",
  ...rest
}: Base & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div className={className}>
      <Label name={name} label={label} />
      <textarea
        id={`field-${name}`}
        name={name}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `field-${name}-error` : undefined}
        className={`${field} resize-none`}
        {...rest}
      />
      <FieldError name={name} error={error} />
    </div>
  );
}
