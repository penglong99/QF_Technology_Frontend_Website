import { useEffect, useId, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { classNames } from '@/lib/classNames';
import { IconButton } from '../IconButton/IconButton';
import styles from './Modal.module.css';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: ReactNode;
  /** Optional illustration shown above the title (Figma success / delete dialogs). */
  icon?: ReactNode;
  iconTone?: 'success' | 'danger' | 'info';
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  align?: 'center' | 'start';
  children?: ReactNode;
}

/**
 * Dialog built on the native <dialog> element, which provides the focus trap, Escape-to-close
 * and inert background for free.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  icon,
  iconTone = 'info',
  footer,
  size = 'sm',
  align = 'center',
  children,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className={classNames(styles.dialog, styles[size])}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        // A click on the backdrop targets the <dialog> element itself.
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {open && (
        <div className={classNames(styles.content, styles[align])}>
          <IconButton
            label="Close dialog"
            icon={<X />}
            variant="ghost"
            size="sm"
            className={styles.close}
            onClick={onClose}
          />
          {icon && (
            <div className={classNames(styles.icon, styles[iconTone])} aria-hidden="true">
              {icon}
            </div>
          )}
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          {description && (
            <div id={descriptionId} className={styles.description}>
              {description}
            </div>
          )}
          {children && <div className={styles.body}>{children}</div>}
          {footer && <div className={styles.footer}>{footer}</div>}
        </div>
      )}
    </dialog>
  );
}
