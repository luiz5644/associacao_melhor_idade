import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, HeartHandshake } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function SponsorsCarousel({ onOpenSponsorModal, onOpenDonation }) {
  const { sponsors } = useData();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Ref do contêiner de rolagem nativa
  const scrollRef = useRef(null);
  // Guarda: true enquanto uma rolagem programática (auto-play/setas/dots)
  // está em andamento, para não brigar com o swipe do usuário
  const isProgrammatic = useRef(false);
  const releaseTimer = useRef(null);
  const settleTimer = useRef(null);

  const handleOpenSponsor = (e) => {
    if (e) e.stopPropagation();
    if (onOpenSponsorModal) {
      onOpenSponsorModal();
    } else if (onOpenDonation) {
      onOpenDonation('sponsor');
    }
  };

  // Filtrar apenas patrocinadores ativos (ou todos se active não for false)
  const activeSponsors = (sponsors || []).filter(s => s.active !== false);

  // Rola o contêiner até o card indicado (baseado em posição visual,
  // funciona em qualquer largura de tela/card)
  const scrollToCard = (index, instant = false) => {
    const container = scrollRef.current;
    if (!container) return;
    const card = container.children[index];
    if (!card) return;

    const containerRect = container.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const paddingLeft = parseFloat(getComputedStyle(container).paddingLeft) || 0;

    // Posição de rolagem em que a borda esquerda do card encosta
    // na borda esquerda do contêiner (respeitando o padding)
    const delta = cardRect.left - containerRect.left - paddingLeft + container.scrollLeft;
    if (Math.abs(delta - container.scrollLeft) < 1) return; // já está no lugar

    isProgrammatic.current = true;
    container.scrollTo({ left: delta, behavior: instant ? 'auto' : 'smooth' });

    // Libera a guarda após a animação terminar
    clearTimeout(releaseTimer.current);
    releaseTimer.current = setTimeout(() => {
      isProgrammatic.current = false;
    }, 700);
  };

  // Sincroniza currentIndex quando o usuário rola manualmente (swipe/trackpad),
  // mas só depois que a rolagem assenta, para não interferir no snap
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const syncFromScroll = () => {
      const cards = container.children;
      const containerRect = container.getBoundingClientRect();
      const paddingLeft = parseFloat(getComputedStyle(container).paddingLeft) || 0;
      const targetX = containerRect.left + paddingLeft;

      // Card cuja borda esquerda está mais próxima do início do contêiner
      let best = 0;
      let bestDist = Infinity;
      for (let i = 0; i < cards.length; i++) {
        const r = cards[i].getBoundingClientRect();
        const d = Math.abs(r.left - targetX);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      }
      setCurrentIndex(prev => (prev === best ? prev : best));
    };

    const onScroll = () => {
      if (isProgrammatic.current) return; // rolagem nossa, não sincroniza
      clearTimeout(settleTimer.current);
      settleTimer.current = setTimeout(syncFromScroll, 120);
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', onScroll);
      clearTimeout(settleTimer.current);
    };
  }, [activeSponsors.length]);

  // Auto-avanço a cada 3.5 segundos quando não pausado pelo mouse
  useEffect(() => {
    if (activeSponsors.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activeSponsors.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [activeSponsors.length, isPaused]);

  // Quando currentIndex muda (auto-play, dots ou setas), rola até o card
  useEffect(() => {
    scrollToCard(currentIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  // Usuário tocando retoma o controle imediato da rolagem
  const handleUserGrab = () => {
    isProgrammatic.current = false;
    clearTimeout(releaseTimer.current);
  };

  if (!activeSponsors || activeSponsors.length === 0) {
    return null;
  }

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + activeSponsors.length) % activeSponsors.length);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % activeSponsors.length);
  };

  return (
    <section 
      className="sponsors-section" 
      aria-label="Patrocinadores e Parceiros"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container">
        {/* Cabeçalho da Seção */}
        <div className="sponsors-header">
          <div className="sponsors-header-text">
            <span className="section-tag">
              <HeartHandshake size={15} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
              Apoio & Parcerias
            </span>
            <h2 className="page-title">Empresas que Abraçam a Nossa Causa</h2>
            <p className="page-subtitle">
              Agradecemos de coração às empresas e comércios amigos que investem no bem-estar, 
              alimentação e atividades culturais dos nossos idosos.
            </p>
          </div>

          <div className="sponsors-nav-controls">
            <button 
              className="carousel-btn prev-btn" 
              onClick={handlePrev} 
              aria-label="Patrocinador anterior"
              title="Anterior"
            >
              <ChevronLeft size={22} />
            </button>
            <button 
              className="carousel-btn next-btn" 
              onClick={handleNext} 
              aria-label="Próximo patrocinador"
              title="Próximo"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>

        {/* Trilho do Carrossel — rolagem nativa com snap */}
        <div 
          className="sponsors-carousel-wrapper"
          ref={scrollRef}
          onPointerDown={handleUserGrab}
          onTouchStart={handleUserGrab}
        >
          {activeSponsors.map((sponsor, index) => (
            <div 
              key={sponsor.id || index}
              className={`sponsor-card ${index === currentIndex ? 'sponsor-card-focused' : ''}`}
            >
              <div className="sponsor-logo-container">
                <img 
                  src={sponsor.logo} 
                  alt={`Logo da empresa ${sponsor.name}`} 
                  className="sponsor-logo-img"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback elegante caso a imagem expire ou não carregue
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=400&auto=format&fit=crop';
                  }}
                />
                {sponsor.category && (
                  <span className="sponsor-badge">{sponsor.category}</span>
                )}
              </div>

              <div className="sponsor-body">
                <h3 className="sponsor-name">{sponsor.name}</h3>
                {sponsor.description && (
                  <p className="sponsor-desc">{sponsor.description}</p>
                )}
                {sponsor.websiteUrl && (
                  <a 
                    href={sponsor.websiteUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="sponsor-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>Conhecer Empresa</span>
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA fora do carrossel */}
        <div className="sponsors-cta">
          <button className="btn btn-primary sponsors-cta-btn" onClick={handleOpenSponsor}>
            Quero Patrocinar
          </button>
        </div>

        {/* Indicadores / Pontos de Navegação */}
        <div className="sponsors-dots" role="tablist" aria-label="Navegação de patrocinadores">
          {activeSponsors.map((_, idx) => (
            <button
              key={idx}
              className={`sponsor-dot ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Ir para patrocinador ${idx + 1}`}
              role="tab"
              aria-selected={idx === currentIndex}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
