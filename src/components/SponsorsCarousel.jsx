import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, HeartHandshake, Building2 } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function SponsorsCarousel({ onOpenSponsorModal, onOpenDonation }) {
  const { sponsors } = useData();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

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

  // Auto-avanço a cada 3.5 segundos quando não pausado pelo mouse
  useEffect(() => {
    if (activeSponsors.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activeSponsors.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [activeSponsors.length, isPaused]);

  if (!activeSponsors || activeSponsors.length === 0) {
    return null;
  }

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + activeSponsors.length) % activeSponsors.length);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % activeSponsors.length);
  };

  // Suporte a swipe em telas touch
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  // Calcular itens visíveis para renderização circular suave
  // Mostramos uma vitrine em carrossel e também a fila contínua
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

        {/* Trilho do Carrossel */}
        <div 
          className="sponsors-carousel-wrapper"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            className="sponsors-track"
            style={{
              transform: `translateX(calc(-${currentIndex} * (280px + 20px)))`,
              transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
            }}
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

            {/* Card Convite para Novas Empresas */}
            <div className="sponsor-card sponsor-card-invite" onClick={handleOpenSponsor}>
              <div className="sponsor-invite-content">
                <div className="sponsor-invite-icon">
                  <Building2 size={28} />
                </div>
                <h3 className="sponsor-invite-title">Sua Empresa Aqui</h3>
                <p className="sponsor-invite-desc">
                  Seja uma marca parceira e apoie nossos projetos sociais.
                </p>
                <button className="btn btn-primary sponsor-invite-btn" onClick={handleOpenSponsor}>
                  Quero Patrocinar
                </button>
              </div>
            </div>
          </div>
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
