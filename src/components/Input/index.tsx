import type { InputHTMLAttributes } from 'react';
import styles from './input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({ className, ...rest }: InputProps) {
  const cls = [styles.input, className].filter(Boolean).join(' ');
  return <input className={cls} {...rest} />;
}


