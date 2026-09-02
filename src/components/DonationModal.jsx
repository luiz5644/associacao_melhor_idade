import React, { useState } from 'react';
import { X, Heart, Copy, Check, QrCode, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { siteData } from '../data/mockData';

export default function DonationModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('pix'); // 'pix' | 'volunteer'
  const [volunteerName, setVolunteerName] = useState('');
  const [volunteerPhone, setVolunteerPhone] = useState('');
  const [volunteerArea, setVolunteerArea] = useState('Geral');
  const [volunteerSubmitted, setVolunteerSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleCopyPix = () => {
    navigator.clipboard.writeText(siteData.brand.pixKey);
    setCopied(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
    setTimeout(() => setCopied(false), 3000);
  };

  const handleVolunteerSubmit = (e) => {
    e.preventDefault();
    if (!volunteerName || !volunteerPhone) return;
    setVolunteerSubmitted(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Fechar">
          <X size={20} />
        </button>

        <div className="modal-header">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#2A5C66', marginBottom: '8px' }}>
            <Heart size={20} fill="#E8A87C" color="#E8A87C" />
            <span style={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', color: '#2A5C66' }}>Apoie a Associação</span>
          </div>
          <h3 className="modal-title">Faça parte desta transformação</h3>
          <p className="modal-subtitle">
            Cada gesto de apoio ajuda a manter nossas oficinas gratuitas, lanches saudáveis e passeios para os nossos idosos.
          </p>
        </div>

        {/* Modal Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          <button 
            className={`btn-pill ${activeTab === 'pix' ? 'active' : ''}`}
            onClick={() => setActiveTab('pix')}
          >
            Doação via PIX
          </button>
          <button 
            className={`btn-pill ${activeTab === 'volunteer' ? 'active' : ''}`}
            onClick={() => setActiveTab('volunteer')}
          >
            Seja um Voluntário
          </button>
        </div>

        {activeTab === 'pix' ? (
          <div>
            <div className="pix-box">
              <QrCode size={48} color="#2A5C66" style={{ margin: '0 auto 10px' }} />
              <h4 style={{ fontSize: '1.1rem', marginBottom: '6px' }}>Chave PIX (E-mail)</h4>
              <p style={{ fontSize: '0.85rem', color: '#5C534E' }}>
                Abra o aplicativo do seu banco e transfira qualquer valor com amor:
              </p>
              
              <div className="pix-key-display">
                <span>{siteData.brand.pixKey}</span>
                <button 
                  onClick={handleCopyPix}
                  style={{
                    background: copied ? '#3D6058' : '#2A5C66',
                    color: '#FFF',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.2s'
                  }}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copiado!' : 'Copiar Chave'}
                </button>
              </div>
            </div>

            <div style={{ background: '#FAF7F5', padding: '14px', borderRadius: '10px', fontSize: '0.85rem', color: '#6A5F59' }}>
              <strong>Associação Comunitária Melhor Idade</strong><br />
              CNPJ: 12.345.678/0001-90<br />
              Banco Comunitário (001) | Agência: 1234 | C/C: 56789-0
            </div>
          </div>
        ) : (
          <div>
            {volunteerSubmitted ? (
              <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                <div style={{ width: '60px', height: '60px', background: '#EAF5EF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Sparkles size={30} color="#3E7257" />
                </div>
                <h4 style={{ fontSize: '1.3rem', marginBottom: '8px', color: '#221E1C' }}>Gratidão pelo seu carinho!</h4>
                <p style={{ color: '#5C534E', fontSize: '0.95rem', marginBottom: '20px' }}>
                  Recebemos seu cadastro, <strong>{volunteerName}</strong>. Nossa coordenadora entrará em contato em breve pelo telefone fornecido.
                </p>
                <button className="btn btn-primary" onClick={onClose}>
                  Fechar
                </button>
              </div>
            ) : (
              <form onSubmit={handleVolunteerSubmit}>
                <div className="form-group">
                  <label className="form-label">Seu Nome Completo</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Ex: Maria Clara Santos"
                    required
                    value={volunteerName}
                    onChange={(e) => setVolunteerName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Telefone / WhatsApp</label>
                  <input 
                    type="tel" 
                    className="form-input" 
                    placeholder="(11) 98765-4321"
                    required
                    value={volunteerPhone}
                    onChange={(e) => setVolunteerPhone(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Área de Interesse em Ajudar</label>
                  <select 
                    className="form-select"
                    value={volunteerArea}
                    onChange={(e) => setVolunteerArea(e.target.value)}
                  >
                    <option value="Geral">Apoio Geral nos Encontros</option>
                    <option value="Oficinas">Instrutor(a) de Artesanato ou Pintura</option>
                    <option value="Musica">Música, Canto ou Dança</option>
                    <option value="Saude">Fisioterapia / Enfermagem / Caminhadas</option>
                    <option value="Cozinha">Café da Tarde e Lanches Comunitários</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }}>
                  Enviar Inscrição de Voluntário
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
