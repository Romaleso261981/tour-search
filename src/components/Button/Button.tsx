import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import type { ButtonVariant } from '../../types/types';
import styles from './button.module.scss';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({ variant = 'primary', className, children, ...rest }: PropsWithChildren<ButtonProps>) {
  const cls = [styles.button, styles[variant], className].filter(Boolean).join(' ');
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}


