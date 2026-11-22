"use client";

import { X } from "lucide-react";
import {
  forwardRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type LabelHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`button button--${variant} ${className}`}
      {...props}
    />
  );
}

export function IconButton({
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`icon-button ${className}`} {...props} />;
}

export function Heading({
  level = 2,
  className = "",
  ...props
}: HTMLAttributes<HTMLHeadingElement> & { level?: 1 | 2 | 3 | 4 }) {
  const Tag = `h${level}` as const;
  return <Tag className={className} {...props} />;
}

export function Text({
  as: Tag = "p",
  className = "",
  ...props
}: HTMLAttributes<HTMLElement> & { as?: "p" | "span" | "strong" }) {
  return <Tag className={className} {...props} />;
}

export function FieldLabel({
  className = "",
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={`field-label ${className}`} {...props} />;
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className = "", ...props }, ref) {
    return <input ref={ref} className={`input ${className}`} {...props} />;
  },
);

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement>
>(function Select({ className = "", children, ...props }, ref) {
  return (
    <select ref={ref} className={`input select ${className}`} {...props}>
      {children}
    </select>
  );
});

export function Sheet({
  open,
  title,
  eyebrow,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  eyebrow?: string;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="sheet-layer" role="presentation" onMouseDown={onClose}>
      <section
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="sheet__grab" aria-hidden="true" />
        <header className="sheet__header">
          <div>
            {eyebrow ? <Text className="eyebrow">{eyebrow}</Text> : null}
            <Heading level={2}>{title}</Heading>
          </div>
          <IconButton onClick={onClose} aria-label="Fechar">
            <X size={20} />
          </IconButton>
        </header>
        <div className="sheet__content">{children}</div>
      </section>
    </div>
  );
}
