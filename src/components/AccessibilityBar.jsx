import React from 'react';
import { Type, Eye, Volume2 } from 'lucide-react';

export default function AccessibilityBar({ 
  fontSizeLevel, 
  setFontSizeLevel, 
  highContrast, 
  setHighContrast 
}) {
  const toggleFontSize = () => {
    if (fontSizeLevel === 'normal') setFontSizeLevel('lg');
    else if (fontSizeLevel === 'lg') setFontSizeLevel('xl');
    else setFontSizeLevel('normal');
  };

  const speakWelcome = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        "Bem-vindo à Associação Comunitária Melhor Idade. Um espaço acolhedor e vibrante em nossa comunidade."
      );
      utterance.lang = 'pt-BR';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Seu navegador não suporta leitura de áudio.");
    }
  };

  return (
    <div className="accessibility-bar" aria-label="Controles de Acessibilidade">
      <div className="container">
        <span>✨ Espaço Comunitário dedicado à Terceira Idade</span>
        <div className="accessibility-actions">
          <button 
            className="access-btn" 
            onClick={toggleFontSize} 
            title="Ajustar tamanho da letra"
            aria-label="Ajustar tamanho da letra"
          >
            <Type size={14} />
            <span>Fonte: {fontSizeLevel === 'normal' ? 'Padrão' : fontSizeLevel === 'lg' ? 'Grande (A+)' : 'Muito Grande (A++)'}</span>
          </button>

          <button 
            className={`access-btn ${highContrast ? 'active' : ''}`} 
            onClick={() => setHighContrast(!highContrast)} 
            title="Alternar modo de alto contraste"
            aria-label="Alternar modo de alto contraste"
          >
            <Eye size={14} />
            <span>Contraste</span>
          </button>

          <button 
            className="access-btn" 
            onClick={speakWelcome} 
            title="Ouvir apresentação da Associação"
            aria-label="Ouvir apresentação da Associação"
          >
            <Volume2 size={14} />
            <span>Ouvir Página</span>
          </button>
        </div>
      </div>
    </div>
  );
}
