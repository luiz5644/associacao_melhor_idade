import React from 'react';
import { siteData } from '../data/mockData';

export default function HistoryPage({ onSelectPhoto, onOpenDonation }) {
  const { history, home } = siteData;

  return (
    <div className="history-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <span className="section-tag">{history.tag}</span>
          <h1 className="page-title">{history.title}</h1>
          <p className="page-subtitle">{history.subtitle}</p>
        </div>

        {/* Timeline Items */}
        <div className="timeline-wrap" style={{ paddingBottom: '36px' }}>
          {history.timeline.map((item) => (
            <div 
              key={item.year} 
              className={`timeline-item ${item.imagePosition === 'left' ? 'reverse' : ''}`}
            >
              <div className="timeline-content">
                <div 
                  className="timeline-year" 
                  style={{ color: item.yearColor }}
                >
                  {item.year}
                </div>
                <h2 className="timeline-title">{item.title}</h2>
                <p className="timeline-text">{item.text}</p>
              </div>

              <div 
                className="timeline-image-wrap"
                onClick={() => onSelectPhoto({ image: item.image, title: `${item.year} — ${item.title}`, subtitle: item.text })}
                style={{ cursor: 'pointer' }}
                title="Clique para ampliar"
              >
                <img 
                  src={item.image} 
                  alt={`${item.title} (${item.year})`} 
                  className="timeline-image" 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA BANNER / DOAÇÃO VIA PIX (Faixa de largura total antes do rodapé) */}
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
