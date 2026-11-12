import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Shield } from 'lucide-react';
import { useData } from '../context/DataContext';

export default function Header({ activePage, setActivePage, onOpenAdmin }) {
  const { brandInfo } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const drawerRef = useRef(null);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const drawer = drawerRef.current;
    const focusables = drawer
      ? Array.from(
          drawer.querySelectorAll(
            'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => el.getClientRects().length > 0)
      : [];
    (focusables[0] || drawer)?.focus?.({ preventScroll: true });

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus?.();
        return;
      }
      if (event.key !== 'Tab' || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const navItems = [
      { id: 'home', label: 'Início' },
      { id: 'history', label: 'Nossa História' },
      { id: 'activities', label: 'Ações' },
      { id: 'calendar', label: 'Calendário' },
      { id: 'gallery', label: 'Galeria de Fotos' },
      { id: 'testimonials', label: 'Depoimentos' },
    ];

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
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
          <img
            src="/imgagens/logo.png"
            alt=""
            className="brand-badge"
            width="44"
            height="44"
          />
          <div className="brand-text-wrap">
            <span className="brand-title">{brandInfo.name}</span>
            <span className="brand-subtitle">{brandInfo.subtitle}</span>
          </div>
        </a>

        {/* Desktop Nav Links */}
                <nav className="nav-links" aria-label="Menu Principal">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      className={`nav-link-btn ${activePage === item.id ? 'active' : ''}`}
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
          ref={menuButtonRef}
          className="mobile-menu-btn" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav-drawer"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>
    </header>

    {/* Mobile Drawer — fora do header, para o position: fixed
        cobrir a tela inteira (header tem backdrop-filter, que
        "trava" elementos fixed dentro dele) */}
    {mobileMenuOpen && (
      <div
        id="mobile-nav-drawer"
        ref={drawerRef}
        className="mobile-nav-drawer"
        onClick={() => setMobileMenuOpen(false)}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
      >
        <div className="mobile-nav-content" onClick={(e) => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div className="brand-link">
              <img
                src="/imgagens/logo.png"
                alt=""
                className="brand-badge"
                style={{ width: '36px', height: '36px' }}
              />
              <span className="brand-title" style={{ fontSize: '1.1rem' }}>{brandInfo.name}</span>
            </div>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Fechar menu"
              style={{ background: 'none', border: 'none', cursor: 'pointer', minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={24} />
            </button>
          </div>

          {navItems.map((item) => (
                      <button
                        key={item.id}
                        className={`nav-link-btn ${activePage === item.id ? 'active' : ''}`}
                        style={{ textAlign: 'center', width: '100%', padding: '12px 16px', fontSize: '0.95rem' }}
                        onClick={() => handleNavClick(item.id)}
                      >
                        {item.label}
                      </button>
                    ))}

          <hr style={{ border: 'none', borderTop: '1px solid #E2E8F0', margin: '6px 0' }} />

          <button 
                      className="admin-link-btn"
                      style={{ width: '100%', justifyContent: 'center', padding: '10px', textAlign: 'center' }}
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
