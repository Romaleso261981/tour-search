import { useEffect, useId, useRef, useState } from 'react';
import styles from './dropdown.module.css';

interface Option<T = string> {
  label: string;
  value: T;
}

interface DropdownProps<T = string> {
  label?: string;
  placeholder?: string;
  options: Array<Option<T>>;
  value: T | null;
  onChange: (value: T | null) => void;
  clearable?: boolean;
}

export function Dropdown<T = string>({ label, placeholder = 'Оберіть...', options, value, onChange, clearable = true }: DropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (open) {
        const target = e.target as Node;
        if (!btnRef.current?.contains(target) && !menuRef.current?.contains(target)) {
          setOpen(false);
        }
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  const selected = options.find((o) => o.value === value) ?? null;

  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={id} className={styles.label}>{label}</label>
      )}
      <button
        id={id}
        className={styles.control}
        onClick={() => setOpen((v) => !v)}
        ref={btnRef}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={selected ? undefined : styles.placeholder}>
          {selected ? selected.label : placeholder}
        </span>
        <span className={styles.chevron} aria-hidden>▾</span>
      </button>
      {open && (
        <div className={styles.menu} role="listbox" ref={menuRef}>
          {clearable && (
            <div className={styles.item}
              role="option"
              aria-selected={value == null}
              onClick={() => { onChange(null); setOpen(false); }}>
              — Без фільтру —
            </div>
          )}
          {options.map((opt) => (
            <div
              key={String(opt.value)}
              className={styles.item}
              role="option"
              aria-selected={opt.value === value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


