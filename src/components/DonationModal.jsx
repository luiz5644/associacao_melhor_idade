import React, { useState } from 'react';
import { X, Heart, Copy, Check, QrCode, Building2, MessageCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { siteData } from '../data/mockData';

const DONATION_TIERS = [
  { value: 25, label: 'R$ 25', impact: 'Café comunitário com bolo e frutas para 2 idosos' },
  { value: 50, label: 'R$ 50', impact: 'Kit de tintas e material de artesanato por 1 mês' },
  { value: 100, label: 'R$ 100', impact: 'Apoio em excursões, música ao vivo e transporte seguro' },
];

export default function DonationModal({ isOpen, onClose, mode = 'pix' }) {
  const [copied, setCopied] = useState(false);
  const [selectedTier, setSelectedTier] = useState(50);

  // Patrocínio PJ
  const [companyName, setCompanyName] = useState('');
  const [companyContact, setCompanyContact] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [companyTier, setCompanyTier] = useState('Patrocinador Prata');
  const [companySubmitted, setCompanySubmitted] = useState(false);

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

  const handleCompanySubmit = (e) => {
    e.preventDefault();
    if (!companyName || !companyPhone) return;
    setCompanySubmitted(true);
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 }
    });
  };

  const cleanPhone = (siteData.brand.phone || '').replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(
    mode === 'sponsor'
      ? `Olá! Tenho interesse em patrocinar a Associação Melhor Idade com a empresa ${companyName || ''}.`
      : `Olá! Acabei de fazer uma doação via PIX para a Associação Melhor Idade e gostaria de enviar o comprovante.`
  )}`;

  const isSponsorMode = mode === 'sponsor';

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" style={{ maxWidth: 560 }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Fechar">
          <X size={20} />
        </button>

        {/* Cabeçalho dinâmico conforme o modo */}
        <div className="modal-header">
          {isSponsorMode ? (
            <>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#B8621A', marginBottom: '8px' }}>
                <Building2 size={20} color="#B8621A" />
                <span style={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', color: '#B8621A' }}>Parceria & Patrocínio</span>
              </div>
              <h3 className="modal-title">Sua Empresa Apoiando a Melhor Idade</h3>
              <p className="modal-subtitle">
                Faça sua marca aparecer com destaque no carrossel da página inicial e apoie diretamente as oficinas, refeições e passeios dos idosos.
              </p>
            </>
          ) : (
            <>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#2A5C66', marginBottom: '8px' }}>
                <Heart size={20} fill="#E8A87C" color="#E8A87C" />
                <span style={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', color: '#2A5C66' }}>Doação Comunitária</span>
              </div>
              <h3 className="modal-title">Ajude-nos a Manter essa Chama Acesa</h3>
              <p className="modal-subtitle">
                Cada gesto de apoio mantém nossas oficinas gratuitas, lanches saudáveis, bailes e passeios para os nossos idosos.
              </p>
            </>
          )}
        </div>

        {/* 1. CONTEÚDO EXCLUSIVO DE DOAÇÃO VIA PIX */}
        {!isSponsorMode && (
          <div>
            {/* Sugestões de Impacto */}
            <div style={{ marginBottom: 18 }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>
                Escolha uma sugestão de impacto:
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {DONATION_TIERS.map(tier => (
                  <button
                    key={tier.value}
                    type="button"
                    onClick={() => setSelectedTier(tier.value)}
                    style={{
                      background: selectedTier === tier.value ? 'var(--primary)' : '#FAF7F5',
                      color: selectedTier === tier.value ? '#FFFFFF' : 'var(--text-main)',
                      border: `2px solid ${selectedTier === tier.value ? 'var(--primary)' : '#EAE5E1'}`,
                      borderRadius: 12,
                      padding: '12px 8px',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ fontSize: '1.15rem', fontWeight: 800 }}>{tier.label}</div>
                    <div style={{ fontSize: '0.72rem', opacity: selectedTier === tier.value ? 0.92 : 0.7, marginTop: 4, lineHeight: 1.3 }}>
                      {tier.impact}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Box PIX */}
            <div className="pix-box">
              <QrCode size={44} color="#2A5C66" style={{ margin: '0 auto 8px' }} />
              <h4 style={{ fontSize: '1.05rem', marginBottom: '4px' }}>Chave PIX Oficial (E-mail)</h4>
              <p style={{ fontSize: '0.83rem', color: '#5C534E', marginBottom: 12 }}>
                Abra o aplicativo do seu banco, escolha PIX e transfira qualquer valor com amor:
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

            <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, background: '#FAF7F5', padding: '12px 14px', borderRadius: '10px', fontSize: '0.8rem', color: '#6A5F59', border: '1px solid #EAE5E1' }}>
                <strong>Associação Comunitária Melhor Idade</strong><br />
                CNPJ: 12.345.678/0001-90<br />
                Banco Comunitário (001) | Agência: 1234 | C/C: 56789-0
              </div>
              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  background: '#25D366',
                  color: '#fff',
                  textDecoration: 'none',
                  padding: '12px 16px',
                  borderRadius: 10,
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  alignSelf: 'center',
                  whiteSpace: 'nowrap'
                }}
              >
                <MessageCircle size={16} />
                <span>Enviar Comprovante</span>
              </a>
            </div>
          </div>
        )}

        {/* 2. CONTEÚDO EXCLUSIVO DE PATROCÍNIO (EMPRESAS NO CARROSSEL) */}
        {isSponsorMode && (
          <div>
            {companySubmitted ? (
              <div style={{ textAlign: 'center', padding: '24px 10px' }}>
                <div style={{ width: '60px', height: '60px', background: '#EAF5EF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Building2 size={30} color="#2D7A50" />
                </div>
                <h4 style={{ fontSize: '1.25rem', marginBottom: '8px', color: '#221E1C' }}>Proposta enviada com sucesso!</h4>
                <p style={{ color: '#5C534E', fontSize: '0.92rem', marginBottom: '20px', lineHeight: 1.6 }}>
                  Agradecemos o interesse da <strong>{companyName}</strong>. Nossa equipe de parcerias entrará em contato para alinhar a inserção do logo no carrossel da página inicial e os benefícios aos idosos.
                </p>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                  <button className="btn btn-pill" onClick={onClose}>Fechar</button>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <MessageCircle size={15} /> Conversar pelo WhatsApp
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCompanySubmit}>
                <div style={{ background: '#FDF6F0', border: '1px solid #F8DFC2', borderRadius: 10, padding: '12px 14px', marginBottom: 16, fontSize: '0.85rem', color: '#7C4A1E', lineHeight: 1.5 }}>
                  ✨ <strong>Sua marca no carrossel:</strong> Empresas e comércios amigos ganham destaque contínuo na página inicial do site, com logo, nome e link!
                </div>

                <div className="form-group">
                  <label className="form-label">Nome da Empresa / Comércio *</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Ex: Farmácia Popular, Padaria Central..."
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Nome do Responsável</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="Ex: Roberto Mendes"
                      value={companyContact}
                      onChange={(e) => setCompanyContact(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Telefone / WhatsApp Comercial *</label>
                    <input 
                      type="tel" 
                      className="form-input" 
                      placeholder="(11) 98765-4321"
                      required
                      value={companyPhone}
                      onChange={(e) => setCompanyPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Categoria de Apoio Desejada</label>
                  <select 
                    className="form-select"
                    value={companyTier}
                    onChange={(e) => setCompanyTier(e.target.value)}
                  >
                    <option value="Patrocinador Ouro">Patrocinador Ouro (Apoio Master)</option>
                    <option value="Patrocinador Prata">Patrocinador Prata (Apoio Mensal)</option>
                    <option value="Apoiador Comunitário">Apoiador Comunitário (Lanches & Quitutes)</option>
                    <option value="Parceiro Saúde">Parceiro Saúde / Atividades Físicas</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                  <button type="button" className="btn btn-pill" onClick={onClose}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    Enviar Interesse de Patrocínio
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
