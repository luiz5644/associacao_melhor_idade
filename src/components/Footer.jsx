import React from 'react';
import { useData } from '../context/DataContext';

export default function Footer({ onNavigatePage, onSelectActivity }) {
  const { brandInfo } = useData();
  const currentYear = 2026;

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Col 1: Brand & Mission */}
          <div className="footer-brand">
            <div className="footer-brand-header">
              <div className="brand-badge" style={{ width: '38px', height: '38px', fontSize: '1.3rem' }}>M</div>
              <span className="footer-brand-title">{brandInfo.name}</span>
            </div>
            <p className="footer-desc">
              {brandInfo.mission}
            </p>
          </div>

          {/* Col 2: Ações Links */}
          <div className="footer-col">
            <h4 className="footer-col-title">Ações</h4>
            <ul className="footer-links">
              <li>
                <button 
                  className="footer-link-btn"
                  onClick={() => { onNavigatePage('activities'); onSelectActivity('act-forro'); }}
                >
                  Forró da Melhor Idade
                </button>
              </li>
              <li>
                <button 
                  className="footer-link-btn"
                  onClick={() => { onNavigatePage('activities'); onSelectActivity('act-coral'); }}
                >
                  Coral Comunitário
                </button>
              </li>
              <li>
                <button 
                  className="footer-link-btn"
                  onClick={() => { onNavigatePage('activities'); onSelectActivity('act-viagens'); }}
                >
                  Viagens e Turismo
                </button>
              </li>
              <li>
                <button 
                  className="footer-link-btn"
                  onClick={() => { onNavigatePage('activities'); onSelectActivity('act-artesanato'); }}
                >
                  Oficinas e Artesanato
                </button>
              </li>
              <li>
                <button 
                  className="footer-link-btn"
                  onClick={() => onNavigatePage('testimonials')}
                >
                  Depoimentos
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Onde Estamos */}
          <div className="footer-col">
            <h4 className="footer-col-title">Onde Estamos</h4>
            {brandInfo.address || brandInfo.email ? (
              <>
                {brandInfo.address && <p className="footer-address">{brandInfo.address}</p>}
                {brandInfo.email && <a href={`mailto:${brandInfo.email}`} className="footer-email-link">{brandInfo.email}</a>}
              </>
            ) : <p className="footer-address">Informações de contato em breve.</p>}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <span>© {currentYear} Associação Melhor Idade. Todos os direitos reservados.</span>
          <div className="footer-badge-flag">
            <span>Feito com afeto no Brasil 🇧🇷</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
