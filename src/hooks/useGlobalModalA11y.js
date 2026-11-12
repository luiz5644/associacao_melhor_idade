import { useEffect } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusables(dialog) {
  return Array.from(dialog.querySelectorAll(FOCUSABLE)).filter(
    (el) => el.getClientRects().length > 0 && !el.hasAttribute('disabled')
  );
}

function labelDialog(dialog, counterRef) {
  if (dialog.getAttribute('aria-label') || dialog.getAttribute('aria-labelledby')) return;
  const heading = dialog.querySelector('.modal-title, h1, h2, h3, h4');
  if (!heading) return;
  if (!heading.id) {
    counterRef.current += 1;
    heading.id = `modal-title-${counterRef.current}`;
  }
  dialog.setAttribute('aria-labelledby', heading.id);
}

function findCloseButton(dialog) {
  const explicit = dialog.querySelector(
    '.modal-close-btn, .memory-detail-close, button[aria-label*="Fechar" i]'
  );
  if (explicit) return explicit;
  const labelled = Array.from(dialog.querySelectorAll('button, a')).find((el) =>
    /^(cancelar|fechar|voltar|entendido)\b/i.test((el.textContent || '').trim())
  );
  return labelled || null;
}

/**
 * Comportamento comum a todos os modais do site (público e admin):
 * - nome acessível a partir do título quando não informado;
 * - foco inicial dentro do diálogo;
 * - Tab/Shift+Tab presos ao diálogo;
 * - Esc fecha pelo botão de fechar/cancelar;
 * - rolagem do fundo bloqueada;
 * - foco devolvido ao elemento de origem ao fechar.
 */
export default function useGlobalModalA11y() {
  useEffect(() => {
    const counterRef = { current: 0 };
    let activeDialog = null;
    let restoreFocus = null;

    const deactivate = (dialog, restore = true) => {
      if (!dialog) return;
      dialog.removeAttribute('data-a11y-active');
      activeDialog = null;
      document.body.classList.remove('has-open-modal');
      if (restore) {
        const target = restoreFocus;
        restoreFocus = null;
        if (target && typeof target.focus === 'function' && document.contains(target)) {
          target.focus({ preventScroll: true });
        }
      }
    };

    const activate = (dialog) => {
      if (activeDialog === dialog) return;
      if (activeDialog && document.contains(activeDialog)) deactivate(activeDialog, false);
      activeDialog = dialog;
      restoreFocus = document.activeElement;
      dialog.setAttribute('data-a11y-active', 'true');
      if (!dialog.hasAttribute('tabindex')) dialog.setAttribute('tabindex', '-1');
      labelDialog(dialog, counterRef);
      document.body.classList.add('has-open-modal');
      const target = getFocusables(dialog)[0] || dialog;
      requestAnimationFrame(() => {
        if (document.contains(target)) target.focus({ preventScroll: true });
      });
    };

    const sync = () => {
      const dialog = document.querySelector('.modal-overlay[role="dialog"]');
      if (dialog && !dialog.closest('[aria-hidden="true"]')) {
        activate(dialog);
      } else if (activeDialog && !document.contains(activeDialog)) {
        deactivate(activeDialog);
      }
    };

    const observer = new MutationObserver(sync);
    observer.observe(document.body, { childList: true, subtree: true });

    const onKeyDown = (event) => {
      if (!activeDialog || !document.contains(activeDialog)) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        const closeButton = findCloseButton(activeDialog);
        if (closeButton) closeButton.click();
        return;
      }

      if (event.key !== 'Tab') return;
      const items = getFocusables(activeDialog);
      if (items.length === 0) {
        event.preventDefault();
        activeDialog.focus({ preventScroll: true });
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === activeDialog)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown, true);
    sync();

    return () => {
      observer.disconnect();
      document.removeEventListener('keydown', onKeyDown, true);
      document.body.classList.remove('has-open-modal');
      if (activeDialog) activeDialog.removeAttribute('data-a11y-active');
      activeDialog = null;
    };
  }, []);
}
