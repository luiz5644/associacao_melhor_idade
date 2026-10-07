import React, { useState } from 'react';
import {
  Shield, Eye, EyeOff, CheckCircle, AlertTriangle, ArrowLeft, Plus, Lock
} from 'lucide-react';
import { useData } from '../context/DataContext';

// ── Máscara de CPF ──────────────────────────────────────────────────────
function formatCPF(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function validateCPF(cpf) {
  const digits = cpf.replace(/\D/g, '');
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i);
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(digits[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  return remainder === parseInt(digits[10]);
}

// ── Componente principal ────────────────────────────────────────────────
export default function CadastroAdminPage({ onVoltar }) {
  const { addAdmin, backendConnected } = useData();

  const [form, setForm] = useState({ username: '', cpf: '', senha: '', confirmarSenha: '' });
  const [errors, setErrors] = useState({});
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);
  const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('');

  const handleChangeCPF = (e) => {
    setForm(prev => ({ ...prev, cpf: formatCPF(e.target.value) }));
    if (errors.cpf) setErrors(prev => ({ ...prev, cpf: '' }));
  };

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.username.trim()) {
      newErrors.username = 'Nome de usuário é obrigatório.';
    } else if (form.username.trim().length < 3) {
      newErrors.username = 'Nome de usuário deve ter pelo menos 3 caracteres.';
    } else if (/\s/.test(form.username)) {
      newErrors.username = 'Nome de usuário não pode conter espaços.';
    }

    if (!form.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório.';
    } else if (!validateCPF(form.cpf)) {
      newErrors.cpf = 'CPF inválido. Verifique os dígitos.';
    }

    if (form.senha && form.senha.length < 6) {
      newErrors.senha = 'A senha deve ter pelo menos 6 caracteres.';
    }

    if (form.senha && form.confirmarSenha && form.senha !== form.confirmarSenha) {
      newErrors.confirmarSenha = 'As senhas não coincidem.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      await addAdmin({
        username: form.username.trim(),
        cpf: form.cpf.replace(/\D/g, ''),
        senha: form.senha.trim() || undefined,
      });
      setStatus('success');
      setForm({ username: '', cpf: '', senha: '', confirmarSenha: '' });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err?.message || 'Não foi possível cadastrar o administrador. Tente novamente.');
    }
  };

  const handleNovoCadastro = () => {
    setStatus(null);
    setErrorMsg('');
    setErrors({});
    setForm({ username: '', cpf: '', senha: '', confirmarSenha: '' });
  };

  // ── Tela de Sucesso ─────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 className="admin-section-title">Novo Administrador</h2>
            <p style={{ color: 'var(--text-subtle)', fontSize: '0.9rem' }}>
              Cadastre uma nova conta com permissão de acesso à área administrativa (via rota /admin).
            </p>
          </div>
          {onVoltar && (
            <button className="btn btn-pill" onClick={onVoltar} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              <ArrowLeft size={15} /> Voltar aos Administradores
            </button>
          )}
        </div>

        <div style={{ background: '#fff', border: '1px solid #DCE7E5', borderRadius: 16, padding: '40px 24px', maxWidth: 680, textAlign: 'center', boxShadow: '0 1px 4px rgba(27,37,39,0.04)' }}>
          <div style={{ width: 64, height: 64, background: 'linear-gradient(135deg, #2A5C66, #3D8A9A)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#fff', boxShadow: '0 8px 24px rgba(42,92,102,0.2)' }}>
            <CheckCircle size={32} />
          </div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', color: 'var(--text-main)', marginBottom: 8 }}>
            Administrador Cadastrado com Sucesso!
          </h3>
          <p style={{ color: 'var(--text-subtle)', fontSize: '0.9rem', maxWidth: 460, margin: '0 auto 24px' }}>
            O novo administrador já está ativo no sistema e pode fazer login com as credenciais cadastradas.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={handleNovoCadastro}>
              <Plus size={15} /> Cadastrar Outro
            </button>
            {onVoltar && (
              <button className="btn btn-pill" onClick={onVoltar}>
                <ArrowLeft size={15} /> Voltar aos Administradores
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Cabeçalho da Seção no Padrão do Painel Admin */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 className="admin-section-title">Novo Administrador</h2>
          <p style={{ color: 'var(--text-subtle)', fontSize: '0.9rem' }}>
            Preencha as informações para cadastrar uma nova conta com permissão de acesso à área administrativa.
          </p>
        </div>
        {onVoltar && (
          <button className="btn btn-pill" onClick={onVoltar} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            <ArrowLeft size={15} /> Voltar aos Administradores
          </button>
        )}
      </div>

      {/* Faixa de Status de Conexão com o Backend (Padrão do Painel Admin) */}
      <div style={{
        background: backendConnected ? '#F0FDF4' : '#FEF3C7',
        border: `1px solid ${backendConnected ? '#BBF7D0' : '#FDE68A'}`,
        borderRadius: 12,
        padding: '12px 16px',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        maxWidth: 680
      }}>
        <span style={{ fontSize: '1.1rem' }}>{backendConnected ? '🟢' : '🟠'}</span>
        <div style={{ fontSize: '0.85rem', color: backendConnected ? '#166534' : '#92400E' }}>
          <strong>{backendConnected ? 'Backend Conectado' : 'Atenção: Backend Offline'}</strong> — {backendConnected ? 'Contas de administrador são validadas com token JWT e senhas criptografadas no MySQL.' : 'Inicie o servidor backend (porta 3000) e o MySQL para cadastrar novos administradores.'}
        </div>
      </div>

      {/* Card Principal do Formulário */}
      <div style={{ background: '#fff', border: '1px solid #DCE7E5', borderRadius: 16, padding: 28, maxWidth: 680, boxShadow: '0 1px 4px rgba(27,37,39,0.04)' }}>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--text-main)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Shield size={18} color="#2A5C66" /> Dados de Acesso do Administrador
        </h3>

        {status === 'error' && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', borderRadius: 8, padding: '10px 14px', fontSize: '0.85rem', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={15} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Nome de Usuário */}
          <div className="form-group" style={{ marginBottom: 18 }}>
            <label className="form-label" htmlFor="cadastro-username">
              Nome de Usuário / Login <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input
              id="cadastro-username"
              type="text"
              className="form-input"
              placeholder="Ex: coord.maria"
              value={form.username}
              onChange={handleChange('username')}
              autoComplete="username"
              autoFocus
              disabled={!backendConnected || status === 'loading'}
            />
            {errors.username ? (
              <p style={{ fontSize: '0.78rem', color: '#DC2626', marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
                <AlertTriangle size={12} /> {errors.username}
              </p>
            ) : (
              <p style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', marginTop: 5 }}>
                Será usado para entrar no painel. Ex: coord.maria, joao.silva
              </p>
            )}
          </div>

          {/* CPF */}
          <div className="form-group" style={{ marginBottom: 20 }}>
            <label className="form-label" htmlFor="cadastro-cpf">
              CPF <span style={{ color: '#DC2626' }}>*</span>
            </label>
            <input
              id="cadastro-cpf"
              type="text"
              className="form-input"
              placeholder="000.000.000-00"
              value={form.cpf}
              onChange={handleChangeCPF}
              inputMode="numeric"
              maxLength={14}
              autoComplete="off"
              disabled={!backendConnected || status === 'loading'}
            />
            {errors.cpf ? (
              <p style={{ fontSize: '0.78rem', color: '#DC2626', marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
                <AlertTriangle size={12} /> {errors.cpf}
              </p>
            ) : (
              <p style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', marginTop: 5 }}>
                Se nenhuma senha for definida, os 8 primeiros dígitos do CPF serão a senha padrão.
              </p>
            )}
          </div>

          {/* Bloco de Senha */}
          <div style={{ borderTop: '1px solid #F0F4F3', margin: '22px 0 18px', paddingTop: 18 }}>
            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: 'var(--text-main)', marginBottom: 4 }}>
              Senha de Acesso (Opcional)
            </h4>
            <p style={{ color: 'var(--text-subtle)', fontSize: '0.82rem', marginBottom: 16 }}>
              Caso deixe os campos abaixo em branco, os 8 primeiros dígitos do CPF funcionarão como senha provisória.
            </p>

            {/* Senha */}
            <div className="form-group" style={{ marginBottom: 18 }}>
              <label className="form-label" htmlFor="cadastro-senha">Nova Senha</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="cadastro-senha"
                  type={showSenha ? 'text' : 'password'}
                  className="form-input"
                  style={{ paddingRight: 40 }}
                  placeholder="Mínimo 6 caracteres"
                  value={form.senha}
                  onChange={handleChange('senha')}
                  autoComplete="new-password"
                  disabled={!backendConnected || status === 'loading'}
                />
                <button
                  type="button"
                  onClick={() => setShowSenha(p => !p)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', padding: 2 }}
                  tabIndex={-1}
                  title={showSenha ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.senha && (
                <p style={{ fontSize: '0.78rem', color: '#DC2626', marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <AlertTriangle size={12} /> {errors.senha}
                </p>
              )}
            </div>

            {/* Confirmar Senha */}
            <div className="form-group" style={{ marginBottom: 18 }}>
              <label className="form-label" htmlFor="cadastro-confirmar-senha">Confirmar Senha</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="cadastro-confirmar-senha"
                  type={showConfirmar ? 'text' : 'password'}
                  className="form-input"
                  style={{
                    paddingRight: 40,
                    borderColor: form.confirmarSenha && form.senha !== form.confirmarSenha ? '#DC2626' : undefined
                  }}
                  placeholder="Repita a senha digitada"
                  value={form.confirmarSenha}
                  onChange={handleChange('confirmarSenha')}
                  autoComplete="new-password"
                  disabled={!backendConnected || status === 'loading'}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmar(p => !p)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-subtle)', display: 'flex', alignItems: 'center', padding: 2 }}
                  tabIndex={-1}
                  title={showConfirmar ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showConfirmar ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmarSenha && (
                <p style={{ fontSize: '0.78rem', color: '#DC2626', marginTop: 5, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <AlertTriangle size={12} /> {errors.confirmarSenha}
                </p>
              )}
            </div>
          </div>

          {/* Dica do Sistema */}
          <div style={{ background: '#F5F9F8', border: '1px solid #DCE7E5', borderRadius: 12, padding: '14px 16px', marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.83rem', color: 'var(--text-body)' }}>
              <Shield size={14} color="#2A5C66" />
              <span>O administrador terá acesso a <strong>todas as funcionalidades</strong> do painel administrativo.</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.83rem', color: 'var(--text-body)' }}>
              <Lock size={14} color="#2A5C66" />
              <span>A autenticação utiliza <strong>JWT</strong> com senhas criptografadas no MySQL.</span>
            </div>
          </div>

          {/* Ações do Formulário */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24, flexWrap: 'wrap' }}>
            {onVoltar && (
              <button
                type="button"
                className="btn btn-pill"
                onClick={onVoltar}
                disabled={status === 'loading'}
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!backendConnected || status === 'loading'}
            >
              <CheckCircle size={15} /> {status === 'loading' ? 'Salvando...' : 'Cadastrar Administrador'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
