import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Contrast,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Square,
  Type,
  Volume2,
  X,
} from 'lucide-react';

// Símbolo universal de acessibilidade: pessoa com os braços abertos.
function UniversalAccessIcon({ size = 24, ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <circle cx="12" cy="4.4" r="2.1" />
      <path d="M12 7.1v6" />
      <path d="M4.7 10.6 12 8.5l7.3 2.1" />
      <path d="m12 13.1-3.4 7.6" />
      <path d="m12 13.1 3.4 7.6" />
    </svg>
  );
}

const STORAGE_KEY = 'ami_accessibility_prefs_v1';
const FONT_LEVELS = ['normal', 'large', 'xlarge'];
const FONT_LABELS = {
  normal: 'Padrão',
  large: 'Grande',
  xlarge: 'Extragrande',
};

function loadPrefs() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) || {} : {};
  } catch {
    return {};
  }
}

export default function AccessibilityWidget() {
  const [initialPrefs] = useState(loadPrefs);
  const [fontSize, setFontSize] = useState(
    FONT_LEVELS.includes(initialPrefs.fontSize) ? initialPrefs.fontSize : 'normal'
  );
  const [highContrast, setHighContrast] = useState(
    typeof initialPrefs.highContrast === 'boolean' ? initialPrefs.highContrast : false
  );

  const [isOpen, setIsOpen] = useState(false);
  const [speechSupported] = useState(
    () => typeof window !== 'undefined' && 'speechSynthesis' in window
  );
  const [speechState, setSpeechState] = useState('idle'); // idle | speaking | paused

  const fabRef = useRef(null);
  const panelRef = useRef(null);
  const titleRef = useRef(null);

  // Foca o título assim que o painel entra no DOM.
  const focusTitleOnMount = useCallback((node) => {
    titleRef.current = node;
    if (node) node.focus({ preventScroll: true });
  }, []);

  // Aplica as preferências no <html> e persiste, como na barra antiga.
  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove('font-normal', 'font-large', 'font-xlarge');
    root.classList.add(`font-${fontSize}`);

    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ fontSize, highContrast }));
    } catch (error) {
      console.warn('Não foi possível salvar as preferências de acessibilidade:', error);
    }
  }, [fontSize, highContrast]);

  // Cancela a síntese de voz ao desmontar.
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const changeFontSize = (direction) => {
    const currentIndex = FONT_LEVELS.indexOf(fontSize);
    const nextIndex = Math.min(
      FONT_LEVELS.length - 1,
      Math.max(0, currentIndex + direction)
    );
    setFontSize(FONT_LEVELS[nextIndex]);
  };

  const handleStartSpeaking = useCallback(() => {
    if (!speechSupported) return;

    window.speechSynthesis.cancel();

    const selection = window.getSelection()?.toString().trim();
    let textToRead = selection;

    if (!textToRead) {
      const mainContent = document.getElementById('main-content') || document.querySelector('main');
      textToRead = mainContent?.innerText?.trim();
    }

    if (!textToRead) {
      setSpeechState('idle');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const ptVoice =
      voices.find((voice) => voice.lang === 'pt-BR') ||
      voices.find((voice) => voice.lang.startsWith('pt'));
    if (ptVoice) utterance.voice = ptVoice;

    utterance.onstart = () => setSpeechState('speaking');
    utterance.onpause = () => setSpeechState('paused');
    utterance.onresume = () => setSpeechState('speaking');
    utterance.onend = () => setSpeechState('idle');
    utterance.onerror = () => setSpeechState('idle');

    setSpeechState('speaking');
    window.speechSynthesis.speak(utterance);
  }, [speechSupported]);

  const handlePauseResume = useCallback(() => {
    if (!speechSupported) return;

    if (speechState === 'paused') {
      window.speechSynthesis.resume();
      setSpeechState('speaking');
    } else if (speechState === 'speaking') {
      window.speechSynthesis.pause();
      setSpeechState('paused');
    }
  }, [speechState, speechSupported]);

  const handleStopSpeaking = useCallback(() => {
    if (!speechSupported) return;
    window.speechSynthesis.cancel();
    setSpeechState('idle');
  }, [speechSupported]);

  const handleReset = () => {
    setFontSize('normal');
    setHighContrast(false);
    handleStopSpeaking();
  };

  const closePanel = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Devolve o foco ao botão flutuante sempre que o painel fecha.
  const hasOpenedRef = useRef(false);
  useEffect(() => {
    if (isOpen) {
      hasOpenedRef.current = true;
      return;
    }
    if (hasOpenedRef.current) {
      fabRef.current?.focus({ preventScroll: true });
    }
  }, [isOpen]);

  // Esc fecha e Tab fica preso dentro do painel.
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closePanel();
        return;
      }

      if (event.key !== 'Tab') return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusables = Array.from(
        panel.querySelectorAll('button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
      ).filter((element) => element.getClientRects().length > 0);

      if (!focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (event.shiftKey) {
        if (active === first || active === titleRef.current || !panel.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last || !panel.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [closePanel, isOpen]);

  const speechStatusLabel =
    speechState === 'speaking'
      ? 'Lendo a página em voz alta'
      : speechState === 'paused'
        ? 'Leitura pausada'
        : 'Leitura parada';

  return (
    <div className="a11y-widget">
      {isOpen && (
        <>
          <div className="a11y-backdrop" onClick={closePanel} aria-hidden="true" />

          <div
            id="a11y-panel"
            className="a11y-panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="a11y-panel-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="a11y-panel-header">
              <div className="a11y-panel-heading">
                <span className="a11y-panel-icon">
                  <UniversalAccessIcon size={22} />
                </span>
                <h2
                  id="a11y-panel-title"
                  className="a11y-panel-title"
                  tabIndex={-1}
                  ref={focusTitleOnMount}
                >
                  Acessibilidade
                </h2>
              </div>
              <button
                type="button"
                className="a11y-close"
                onClick={closePanel}
                aria-label="Fechar opções de acessibilidade"
              >
                <X size={22} aria-hidden="true" />
              </button>
            </div>

            <div className="a11y-panel-body">
              <section className="a11y-section" aria-labelledby="a11y-texto-title">
                <h3 id="a11y-texto-title" className="a11y-section-title">
                  <Type size={16} aria-hidden="true" />
                  Texto
                </h3>

                <div className="a11y-options">
                  <button
                    type="button"
                    className="a11y-option"
                    onClick={() => changeFontSize(-1)}
                    disabled={fontSize === 'normal'}
                    aria-label="Diminuir tamanho do texto"
                  >
                    <Minus size={22} aria-hidden="true" />
                    <span>Diminuir</span>
                  </button>

                  <button
                    type="button"
                    className="a11y-option"
                    onClick={() => setFontSize('normal')}
                    aria-label="Restaurar tamanho padrão do texto"
                  >
                    <RotateCcw size={22} aria-hidden="true" />
                    <span>Restaurar</span>
                  </button>

                  <button
                    type="button"
                    className="a11y-option"
                    onClick={() => changeFontSize(1)}
                    disabled={fontSize === 'xlarge'}
                    aria-label="Aumentar tamanho do texto"
                  >
                    <Plus size={22} aria-hidden="true" />
                    <span>Aumentar</span>
                  </button>
                </div>

                <p className="a11y-status" role="status">
                  Tamanho do texto: <strong>{FONT_LABELS[fontSize]}</strong>
                </p>
              </section>

              <section className="a11y-section" aria-labelledby="a11y-visual-title">
                <h3 id="a11y-visual-title" className="a11y-section-title">
                  <Contrast size={16} aria-hidden="true" />
                  Visual
                </h3>

                <button
                  type="button"
                  className="a11y-toggle-row"
                  onClick={() => setHighContrast((previous) => !previous)}
                  aria-pressed={highContrast}
                >
                  <Contrast size={22} aria-hidden="true" />
                  <span className="a11y-toggle-label">Alto contraste</span>
                  <span className="a11y-toggle-state">
                    {highContrast ? 'Ativado' : 'Desativado'}
                  </span>
                </button>
              </section>

              <section className="a11y-section" aria-labelledby="a11y-leitura-title">
                <h3 id="a11y-leitura-title" className="a11y-section-title">
                  <Volume2 size={16} aria-hidden="true" />
                  Leitura em voz alta
                </h3>

                {speechSupported ? (
                  <>
                    <p className="a11y-help">
                      Lê o texto selecionado ou o conteúdo principal da página.
                    </p>

                    <div className="a11y-options">
                      <button
                        type="button"
                        className="a11y-option"
                        onClick={handleStartSpeaking}
                        disabled={speechState !== 'idle'}
                      >
                        <Play size={22} aria-hidden="true" />
                        <span>Iniciar</span>
                      </button>

                      <button
                        type="button"
                        className="a11y-option"
                        onClick={handlePauseResume}
                        disabled={speechState === 'idle'}
                      >
                        {speechState === 'paused' ? (
                          <Play size={22} aria-hidden="true" />
                        ) : (
                          <Pause size={22} aria-hidden="true" />
                        )}
                        <span>{speechState === 'paused' ? 'Retomar' : 'Pausar'}</span>
                      </button>

                      <button
                        type="button"
                        className="a11y-option"
                        onClick={handleStopSpeaking}
                        disabled={speechState === 'idle'}
                      >
                        <Square size={20} aria-hidden="true" />
                        <span>Parar</span>
                      </button>
                    </div>

                    <p className="a11y-status" role="status">
                      {speechStatusLabel}
                    </p>
                  </>
                ) : (
                  <p className="a11y-help">
                    A leitura em voz alta não está disponível neste navegador.
                  </p>
                )}
              </section>

              <button type="button" className="a11y-reset" onClick={handleReset}>
                <RotateCcw size={20} aria-hidden="true" />
                Restaurar padrão
              </button>
            </div>
          </div>
        </>
      )}

      <div className="a11y-fab-wrap">
        <span className="a11y-fab-label" aria-hidden="true">
          Acessibilidade
        </span>
        <button
          type="button"
          className="a11y-fab"
          ref={fabRef}
          onClick={() => setIsOpen((previous) => !previous)}
          aria-label="Abrir opções de acessibilidade"
          aria-expanded={isOpen}
          aria-controls="a11y-panel"
          aria-haspopup="dialog"
        >
          <UniversalAccessIcon size={32} />
        </button>
      </div>
    </div>
  );
}
