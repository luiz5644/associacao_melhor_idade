import React from 'react';
import { ArrowRight } from 'lucide-react';
import { siteData } from '../data/mockData';

export default function HomePage({ onNavigate, onOpenDonation, onSelectPhoto }) {
  const { home } = siteData;

  return (
    <div className="home-page">
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <span className="section-tag">{home.hero.tag}</span>
              <h1 className="hero-title">{home.hero.title}</h1>
              <p className="hero-desc">{home.hero.description}</p>
            </div>
            <div className="hero-image-wrapper">
              <img 
                src={home.hero.image} 
                alt="Idosos da comunidade celebrando com alegria e pétalas ao sol" 
                className="hero-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. PRÓXIMOS ENCONTROS */}
      <section className="upcoming-section">
        <div className="container">
          <div className="page-header" style={{ padding: '0 0 28px' }}>
            <span className="section-tag">{home.upcoming.tag}</span>
            <h2 className="page-title">{home.upcoming.title}</h2>
            <p className="page-subtitle">{home.upcoming.subtitle}</p>
          </div>

          <div className="cards-grid-3">
            {home.upcoming.items.map((item) => (
              <div 
                key={item.id} 
                className="upcoming-card"
                onClick={() => onNavigate('calendar')}
                style={{ cursor: 'pointer' }}
                title="Ver no calendário"
              >
                <div className="upcoming-header">
                  <span className="upcoming-day">{item.day}</span>
                  <span className="upcoming-tag">{item.category}</span>
                </div>
                <h3 className="upcoming-title">{item.title}</h3>
                <p className="upcoming-desc">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. NOSSA CAMINHADA (HISTÓRIA TEASER) */}
      <section className="history-teaser-section">
        <div className="container">
          <div className="history-teaser-grid">
            <div className="history-teaser-img-wrap">
              <img 
                src={home.historyTeaser.image} 
                alt="Fotografia histórica da fundação da Associação Melhor Idade em 2005" 
                className="history-teaser-img" 
              />
            </div>
            <div className="history-teaser-content">
              <span className="section-tag">{home.historyTeaser.tag}</span>
              <h2 className="history-teaser-title">{home.historyTeaser.title}</h2>
              {home.historyTeaser.paragraphs.map((p, idx) => (
                <p key={idx} className="history-teaser-text">{p}</p>
              ))}
              <button 
                className="link-arrow" 
                onClick={() => onNavigate('history')}
              >
                <span>{home.historyTeaser.ctaText}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MOMENTOS RECENTES */}
      <section className="recent-moments-section">
        <div className="container">
          <div className="page-header" style={{ padding: '0 0 28px' }}>
            <span className="section-tag">{home.recentMoments.tag}</span>
            <h2 className="page-title">{home.recentMoments.title}</h2>
            <p className="page-subtitle">{home.recentMoments.subtitle}</p>
          </div>

          <div className="cards-grid-3">
            {home.recentMoments.items.map((item) => (
              <div 
                key={item.id} 
                className="moment-card"
                onClick={() => onSelectPhoto(item)}
              >
                <img src={item.image} alt={item.title} className="moment-img" />
                <div className="moment-info">
                  <h3 className="moment-title">{item.title}</h3>
                  <p className="moment-subtitle">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA BANNER / DOAÇÃO */}
      <section className="cta-banner">
        <div className="container">
          <div className="cta-grid">
            <div className="cta-content">
              <h2 className="cta-title">{home.cta.title}</h2>
              <p className="cta-desc">{home.cta.description}</p>
            </div>
            <button className="cta-btn" onClick={onOpenDonation}>
              {home.cta.buttonText}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
