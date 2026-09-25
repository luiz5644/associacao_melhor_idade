import React, { useState } from 'react';
import { Menu, X, Shield } from 'lucide-react';
import { siteData } from '../data/mockData';

export default function Header({ activePage, setActivePage, onOpenAdmin }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Início' },
    { id: 'history', label: 'Nossa História' },
    { id: 'activities', label: 'Atividades' },
    { id: 'calendar', label: 'Calendário' },
    { id: 'gallery', label: 'Galeria de Fotos' },
  ];

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <>
    <header className="site-header">
      <div className="container">
        {/* Brand / Logo */}
        <a 
          href="#home" 
          className="brand-link" 
          onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}
        >
          <div className="brand-badge">M</div>
          <div className="brand-text-wrap">
            <span className="brand-title">{siteData.brand.name}</span>
            <span className="brand-subtitle">{siteData.brand.subtitle}</span>
          </div>
        </a>

        {/* Desktop Nav Pills */}
        <nav className="nav-pills" aria-label="Menu Principal">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-pill-btn ${activePage === item.id ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right Action: Área do Administrador */}
        <div className="header-actions">
          <button 
            className="admin-link-btn"
            onClick={onOpenAdmin}
            title="Acessar painel administrativo"
          >
            <Shield size={14} />
            <span>área do administrador</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Abrir menu de navegação"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>
    </header>

    {/* Mobile Drawer — fora do header, para o position: fixed
        cobrir a tela inteira (header tem backdrop-filter, que
        "trava" elementos fixed dentro dele) */}
    {mobileMenuOpen && (
      <div className="mobile-nav-drawer" onClick={() => setMobileMenuOpen(false)}>
        <div className="mobile-nav-content" onClick={(e) => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div className="brand-link">
              <div className="brand-badge" style={{ width: '36px', height: '36px', fontSize: '1.2rem' }}>M</div>
              <span className="brand-title" style={{ fontSize: '1.1rem' }}>{siteData.brand.name}</span>
            </div>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>
          </div>

          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-pill-btn ${activePage === item.id ? 'active' : ''}`}
              style={{ textAlign: 'left', width: '100%', padding: '10px 16px', fontSize: '0.92rem' }}
              onClick={() => handleNavClick(item.id)}
            >
              {item.label}
            </button>
          ))}

          <hr style={{ border: 'none', borderTop: '1px solid #EBE1D8', margin: '6px 0' }} />

          <button 
            className="admin-link-btn"
            style={{ width: '100%', justifyContent: 'center', padding: '10px' }}
            onClick={() => { setMobileMenuOpen(false); onOpenAdmin(); }}
          >
            <Shield size={16} />
            <span>área do administrador</span>
          </button>
        </div>
      </div>
    )}
    </>
  );
}
