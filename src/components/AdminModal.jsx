import React, { useState } from 'react';
import { X, Shield, Lock, User, PlusCircle, Users, CalendarCheck, HeartHandshake, CheckCircle } from 'lucide-react';

export default function AdminModal({ isOpen, onClose, onAddEvent }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  
  // Novo evento
  const [newTitle, setNewTitle] = useState('');
  const [newDay, setNewDay] = useState('15');
  const [newTime, setNewTime] = useState('14:00');
  const [newCategory, setNewCategory] = useState('Música');
  const [newDesc, setNewDesc] = useState('');
  const [eventAddedSuccess, setEventAddedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!newTitle) return;

    onAddEvent({
      day: parseInt(newDay, 10),
      title: newTitle,
      time: newTime,
      category: newCategory,
      desc: newDesc || "Atividade especial da comunidade."
    });

    setEventAddedSuccess(true);
    setNewTitle('');
    setNewDesc('');
    setTimeout(() => setEventAddedSuccess(false), 3000);
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Fechar">
          <X size={20} />
        </button>

        <div className="modal-header">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#2A5C66', marginBottom: '8px' }}>
            <Shield size={20} />
            <span style={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>Painel de Gestão</span>
          </div>
          <h3 className="modal-title">Área do Administrador</h3>
          <p className="modal-subtitle">
            {isLoggedIn ? 'Bem-vindo(a) à central de coordenação da Associação Melhor Idade.' : 'Acesso restrito para a diretoria e equipe de coordenação.'}
          </p>
        </div>

        {!isLoggedIn ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Usuário de Acesso</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin@associacaomelhoridade.org"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Senha</label>
              <input 
                type="password" 
                className="form-input" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <p style={{ fontSize: '0.82rem', color: '#6E6E6E', marginBottom: '16px' }}>
              💡 Dica de demonstração: Você pode clicar diretamente em <strong>Entrar no Painel</strong>.
            </p>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Entrar no Painel
            </button>
          </form>
        ) : (
          <div>
            {/* Stats Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
              <div style={{ background: '#F5F9F8', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                <Users size={20} color="#2A5C66" style={{ margin: '0 auto 4px' }} />
                <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>248</div>
                <div style={{ fontSize: '0.75rem', color: '#6E6E6E' }}>Associados</div>
              </div>

              <div style={{ background: '#F5F9F8', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                <CalendarCheck size={20} color="#3D6058" style={{ margin: '0 auto 4px' }} />
                <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>18</div>
                <div style={{ fontSize: '0.75rem', color: '#6E6E6E' }}>Encontros no Mês</div>
              </div>

              <div style={{ background: '#F5F9F8', padding: '12px', borderRadius: '10px', textAlign: 'center' }}>
                <HeartHandshake size={20} color="#E8A87C" style={{ margin: '0 auto 4px' }} />
                <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>34</div>
                <div style={{ fontSize: '0.75rem', color: '#6E6E6E' }}>Voluntários</div>
              </div>
            </div>

            {/* Adicionar Evento ao Calendário */}
            <div style={{ background: '#F5F9F8', padding: '20px', borderRadius: '12px', border: '1px solid #DCE7E5' }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PlusCircle size={18} color="#2A5C66" />
                Agendar Novo Encontro no Calendário
              </h4>

              {eventAddedSuccess && (
                <div style={{ background: '#EAF5F2', color: '#2A5C66', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle size={16} />
                  <span>Evento agendado com sucesso no calendário de Outubro 2026!</span>
                </div>
              )}

              <form onSubmit={handleCreateEvent}>
                <div className="form-group">
                  <label className="form-label">Nome da Atividade / Encontro</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Ex: Tarde de Bingo Beneficente" 
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Dia (Outubro)</label>
                    <select 
                      className="form-select" 
                      value={newDay} 
                      onChange={(e) => setNewDay(e.target.value)}
                    >
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                        <option key={d} value={d}>Dia {d}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Horário</label>
                    <input 
                      type="time" 
                      className="form-input" 
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Categoria</label>
                    <select 
                      className="form-select" 
                      value={newCategory} 
                      onChange={(e) => setNewCategory(e.target.value)}
                    >
                      <option value="Música">Música</option>
                      <option value="Coral">Coral</option>
                      <option value="Lazer">Lazer</option>
                      <option value="Artes">Artes</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Descrição Breve</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Ex: Encontro com prêmios de artesanato e lanche comunitário."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                  <button 
                    type="button" 
                    className="btn btn-pill"
                    onClick={() => setIsLoggedIn(false)}
                  >
                    Sair da Conta
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Salvar no Calendário
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
