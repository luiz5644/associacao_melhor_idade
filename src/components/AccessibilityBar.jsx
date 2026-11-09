import React, { useState, useEffect, useCallback } from 'react';
import { Volume2, Square, Contrast, Type } from 'lucide-react';

const STORAGE_KEY = 'ami_accessibility_prefs_v1';

export default function AccessibilityBar() {
  const [fontSize, setFontSize] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.fontSize) return parsed.fontSize;
      }
    } catch (_) {}
    return 'normal';
  });

  const [highContrast, setHighContrast] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.highContrast === 'boolean') return parsed.highContrast;
      }
    } catch (_) {}
    return false;
  });

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported] = useState(
    () => typeof window !== 'undefined' && 'speechSynthesis' in window
  );

  // Aplica classes no elemento <html> e persiste
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
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ fontSize, highContrast })
      );
    } catch (e) {
      console.warn('Não foi possível salvar as preferências de acessibilidade:', e);
    }
  }, [fontSize, highContrast]);

  // Cancela síntese de voz ao desmontar
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleStopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  const handleStartSpeaking = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    // Prioriza seleção de texto feita pelo usuário
    const selection = window.getSelection()?.toString().trim();
    let textToRead = selection;

    if (!textToRead) {
      // Sem seleção, lê o conteúdo principal da página
      const mainContent = document.getElementById('main-content') || document.querySelector('main');
      if (mainContent) {
        textToRead = mainContent.innerText?.trim();
      }
    }

    if (!textToRead) {
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.95; // Leitura ligeiramente mais pausada para idosos

    const voices = window.speechSynthesis.getVoices();
    const ptVoice =
      voices.find((v) => v.lang === 'pt-BR') ||
      voices.find((v) => v.lang.startsWith('pt'));
    if (ptVoice) {
      utterance.voice = ptVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  return (
    <aside
      className="accessibility-bar"
      role="region"
      aria-label="Barra de acessibilidade e leitura"
    >
      <div className="container accessibility-bar-container">
        {/* Controle de Fonte */}
        <div className="accessibility-group" role="group" aria-label="Tamanho do texto">
          <span className="accessibility-label">
            <Type size={16} aria-hidden="true" />
            <span>Texto:</span>
          </span>
          <button
            type="button"
            className={`accessibility-btn ${fontSize === 'normal' ? 'active' : ''}`}
            onClick={() => setFontSize('normal')}
            aria-pressed={fontSize === 'normal'}
            aria-label="Texto tamanho padrão"
          >
            A
          </button>
          <button
            type="button"
            className={`accessibility-btn ${fontSize === 'large' ? 'active' : ''}`}
            onClick={() => setFontSize('large')}
            aria-pressed={fontSize === 'large'}
            aria-label="Texto tamanho grande"
          >
            A+
          </button>
          <button
            type="button"
            className={`accessibility-btn ${fontSize === 'xlarge' ? 'active' : ''}`}
            onClick={() => setFontSize('xlarge')}
            aria-pressed={fontSize === 'xlarge'}
            aria-label="Texto tamanho extragrande"
          >
            A++
          </button>
        </div>

        {/* Alto Contraste */}
        <div className="accessibility-group">
          <button
            type="button"
            className={`accessibility-btn accessibility-contrast-btn ${highContrast ? 'active' : ''}`}
            onClick={() => setHighContrast((prev) => !prev)}
            aria-pressed={highContrast}
            aria-label={highContrast ? 'Desativar alto contraste' : 'Ativar alto contraste'}
          >
            <Contrast size={16} aria-hidden="true" />
            <span>{highContrast ? 'Contraste Normal' : 'Alto Contraste'}</span>
          </button>
        </div>

        {/* Leitor de Voz (Web Speech API) */}
        {speechSupported && (
          <div className="accessibility-group" role="group" aria-label="Leitor de texto em voz">
            {!isSpeaking ? (
              <button
                type="button"
                className="accessibility-btn accessibility-speech-btn"
                onClick={handleStartSpeaking}
                aria-label="Ouvir conteúdo da página ou texto selecionado"
                title="Lê o texto selecionado ou todo o conteúdo da página"
              >
                <Volume2 size={16} aria-hidden="true" />
                <span>Ouvir Página</span>
              </button>
            ) : (
              <button
                type="button"
                className="accessibility-btn accessibility-speech-btn active-speaking"
                onClick={handleStopSpeaking}
                aria-label="Parar leitura em voz alta"
              >
                <Square size={14} aria-hidden="true" />
                <span>Parar Leitura</span>
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
