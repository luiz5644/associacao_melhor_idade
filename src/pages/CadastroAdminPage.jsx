import React, { useState } from 'react';
import {
  Shield, UserPlus, User, Lock, CreditCard, Eye, EyeOff,
  CheckCircle, AlertTriangle, ArrowLeft, ChevronRight
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

// ── Campo de Formulário ─────────────────────────────────────────────────
function FormField({ label, id, error, children, hint }) {
  return (
    <div className="form-group" style={{ marginBottom: 20 }}>
      <label
        htmlFor={id}
        className="form-label"
        style={{ display: 'block', marginBottom: 6, fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-main)' }}
      >
        {label}
      </label>
      {children}
      {hint && !error && (
        <p style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', marginTop: 5, margin: '5px 0 0' }}>{hint}</p>
      )}
      {error && (
        <p style={{ fontSize: '0.78rem', color: '#DC2626', marginTop: 5, display: 'flex', alignItems: 'center', gap: 4, margin: '5px 0 0' }}>
          <AlertTriangle size={12} /> {error}
        </p>
      )}
    </div>
  );
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
      <div style={styles.pageWrapper}>
        <div style={{ ...styles.card, maxWidth: 500 }}>
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <div style={styles.successIcon}>
              <CheckCircle size={36} color="#fff" />
            </div>
            <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-main)', marginTop: 24, marginBottom: 8 }}>
              Cadastro Realizado!
            </h2>
            <p style={{ color: 'var(--text-subtle)', fontSize: '0.9rem', marginBottom: 0 }}>
              O novo administrador foi cadastrado com sucesso no sistema e já pode acessar o painel.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32, flexWrap: 'wrap' }}>
              <button className="btn btn-primary" style={styles.btnPrimary} onClick={handleNovoCadastro}>
                <UserPlus size={16} /> Cadastrar Outro
              </button>
              {onVoltar && (
                <button className="btn btn-pill" style={styles.btnSecondary} onClick={onVoltar}>
                  <ArrowLeft size={16} /> Voltar ao Painel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
      <div className="admin-register-page-wrapper" style={styles.pageWrapper}>
        {/* Cabeçalho da página - padrão igual às outras páginas */}
        <div className="page-header" style={styles.pageHeader}>
          <h1 className="page-title" style={styles.pageTitle}>Cadastro de Administrador</h1>
          <p className="page-subtitle" style={styles.pageSubtitle}>Crie uma nova conta com acesso ao painel administrativo</p>
        </div>

        {/* Status badge */}
        <div className="admin-register-status-badge" style={{
          ...styles.statusBadge,
          background: backendConnected ? '#ECFDF5' : '#FFFBEB',
          color: backendConnected ? '#065F46' : '#92400E',
          border: `1px solid ${backendConnected ? '#A7F3D0' : '#FDE68A'}`,
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: backendConnected ? '#10B981' : '#F59E0B',
            display: 'inline-block',
          }} />
          {backendConnected ? 'Backend Conectado' : 'Backend Offline'}
        </div>

        {/* Alerta se backend offline */}
        {!backendConnected && (
          <div className="admin-register-alert-warning" style={styles.alertWarning}>
            <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <strong>Backend offline.</strong> O cadastro de administradores requer conexão com o servidor.
              Inicie o backend na porta 3000 e tente novamente.
            </div>
          </div>
        )}

        {/* Card do formulário */}
        <div className="admin-register-card" style={styles.card}>
          <div className="admin-register-card-header" style={styles.cardHeader}>
            <div className="admin-register-card-icon-wrap" style={styles.cardIconWrap}>
              <UserPlus size={20} color="var(--primary)" />
            </div>
            <div>
              <h2 className="admin-register-card-title" style={styles.cardTitle}>Novo Administrador</h2>
              <p className="admin-register-card-subtitle" style={styles.cardSubtitle}>Preencha os dados abaixo para criar a conta</p>
            </div>
          </div>

          {status === 'error' && (
            <div className="admin-register-alert-error" style={styles.alertError}>
              <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>

            {/* Nome de Usuário */}
            <FormField
              label="Nome de Usuário / Login *"
              id="cadastro-username"
              error={errors.username}
              hint="Será usado para entrar no painel. Ex: coord.maria, joao.silva"
            >
              <div className="admin-register-input-wrapper" style={styles.inputWrapper}>
                <User size={16} className="admin-register-input-icon" style={styles.inputIcon} />
                <input
                  id="cadastro-username"
                  type="text"
                  className="form-input admin-register-input"
                  style={{ paddingLeft: 40, width: '100%', boxSizing: 'border-box' }}
                  placeholder="Ex: coord.maria"
                  value={form.username}
                  onChange={handleChange('username')}
                  autoComplete="username"
                  autoFocus
                  disabled={!backendConnected || status === 'loading'}
                />
              </div>
            </FormField>

            {/* CPF */}
            <FormField
              label="CPF *"
              id="cadastro-cpf"
              error={errors.cpf}
              hint="Se nenhuma senha for definida, os 8 primeiros dígitos do CPF serão a senha padrão."
            >
              <div className="admin-register-input-wrapper" style={styles.inputWrapper}>
                <CreditCard size={16} className="admin-register-input-icon" style={styles.inputIcon} />
                <input
                  id="cadastro-cpf"
                  type="text"
                  className="form-input admin-register-input"
                  style={{ paddingLeft: 40, width: '100%', boxSizing: 'border-box' }}
                  placeholder="000.000.000-00"
                  value={form.cpf}
                  onChange={handleChangeCPF}
                  inputMode="numeric"
                  maxLength={14}
                  autoComplete="off"
                  disabled={!backendConnected || status === 'loading'}
                />
              </div>
            </FormField>

            {/* Divisor */}
            <div style={{ textAlign: 'center', margin: '8px 0 20px', position: 'relative' }}>
              <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: 0 }} />
              <span style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                background: '#fff', padding: '0 12px',
                fontSize: '0.75rem', color: 'var(--text-subtle)',
                fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase',
              }}>
                Senha (opcional)
              </span>
            </div>

            {/* Senha */}
            <FormField
              label="Senha de Acesso"
              id="cadastro-senha"
              error={errors.senha}
              hint="Mínimo 6 caracteres. Se deixar em branco, os 8 primeiros dígitos do CPF serão usados."
            >
              <div className="admin-register-input-wrapper" style={styles.inputWrapper}>
                <Lock size={16} className="admin-register-input-icon" style={styles.inputIcon} />
                <input
                  id="cadastro-senha"
                  type={showSenha ? 'text' : 'password'}
                  className="form-input admin-register-input"
                  style={{ paddingLeft: 40, paddingRight: 44, width: '100%', boxSizing: 'border-box' }}
                  placeholder="Mínimo 6 caracteres"
                  value={form.senha}
                  onChange={handleChange('senha')}
                  autoComplete="new-password"
                  disabled={!backendConnected || status === 'loading'}
                />
                <button
                  type="button"
                  onClick={() => setShowSenha(p => !p)}
                  className="admin-register-eye-btn"
                  style={styles.eyeBtn}
                  tabIndex={-1}
                  title={showSenha ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showSenha ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </FormField>

            {/* Confirmar Senha */}
            <FormField
              label="Confirmar Senha"
              id="cadastro-confirmar-senha"
              error={errors.confirmarSenha}
            >
              <div className="admin-register-input-wrapper" style={styles.inputWrapper}>
                <Lock size={16} className="admin-register-input-icon" style={styles.inputIcon} />
                <input
                  id="cadastro-confirmar-senha"
                  type={showConfirmar ? 'text' : 'password'}
                  className="form-input admin-register-input"
                  style={{
                    paddingLeft: 40, paddingRight: 44,
                    width: '100%', boxSizing: 'border-box',
                    borderColor: form.confirmarSenha && form.senha !== form.confirmarSenha ? '#DC2626' : undefined,
                  }}
                  placeholder="Repita a senha"
                  value={form.confirmarSenha}
                  onChange={handleChange('confirmarSenha')}
                  autoComplete="new-password"
                  disabled={!backendConnected || status === 'loading'}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmar(p => !p)}
                  className="admin-register-eye-btn"
                  style={styles.eyeBtn}
                  tabIndex={-1}
                  title={showConfirmar ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showConfirmar ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </FormField>

            {/* Caixa de informações */}
            <div className="admin-register-info-box" style={styles.infoBox}>
              <div className="admin-register-info-row" style={styles.infoRow}>
                <ChevronRight size={14} color="var(--primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>O administrador terá acesso a <strong>todas as funcionalidades</strong> do painel.</span>
              </div>
              <div className="admin-register-info-row" style={styles.infoRow}>
                <ChevronRight size={14} color="var(--primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>O login é feito com <strong>usuário + senha</strong> na tela do painel administrativo.</span>
              </div>
              <div className="admin-register-info-row" style={styles.infoRow}>
                <ChevronRight size={14} color="var(--primary)" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>A autenticação utiliza <strong>JWT</strong> com expiração gerenciada pelo servidor.</span>
              </div>
            </div>

            {/* Botões */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 28, flexWrap: 'wrap' }}>
              {onVoltar && (
                <button
                  type="button"
                  className="btn btn-pill"
                  style={styles.btnSecondary}
                  onClick={onVoltar}
                  disabled={status === 'loading'}
                >
                  <ArrowLeft size={15} /> Cancelar
                </button>
              )}
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  ...styles.btnPrimary,
                  opacity: !backendConnected || status === 'loading' ? 0.65 : 1,
                  cursor: !backendConnected || status === 'loading' ? 'not-allowed' : 'pointer',
                }}
                disabled={!backendConnected || status === 'loading'}
              >
                {status === 'loading' ? 'Cadastrando...' : (
                  <><UserPlus size={16} /> Cadastrar Administrador</>
                )}
              </button>
            </div>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: 'var(--text-subtle)', fontSize: '0.8rem', marginTop: 20 }}>
          Associação Melhor Idade · Área Restrita · Apenas pessoal autorizado
        </p>
      </div>
    );
}

// ── Estilos ─────────────────────────────────────────────────────────────
const styles = {
  pageWrapper: {
    minHeight: '100vh',
    background: 'var(--bg-page)',
    padding: '32px 16px 48px',
    fontFamily: 'var(--font-sans)',
  },
  pageHeader: {
    maxWidth: 640,
    margin: '0 auto 24px',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    background: '#fff',
    border: '1px solid var(--border-light)',
    borderRadius: 8,
    padding: '7px 14px',
    fontSize: '0.85rem',
    color: 'var(--text-body)',
    cursor: 'pointer',
    fontFamily: 'var(--font-sans)',
    flexShrink: 0,
  },
  headerCenter: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    flex: 1,
    minWidth: 200,
  },
  headerIcon: {
    width: 52,
    height: 52,
    background: 'linear-gradient(135deg, #2A5C66, #3D8A9A)',
    borderRadius: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 6px 18px rgba(42,92,102,0.22)',
    flexShrink: 0,
  },
  pageTitle: {
    fontFamily: 'var(--font-sans)',
    fontSize: '1.3rem',
    fontWeight: 700,
    color: 'var(--text-main)',
    margin: 0,
  },
  pageSubtitle: {
    fontSize: '0.82rem',
    color: 'var(--text-subtle)',
    margin: '2px 0 0',
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 7,
    fontSize: '0.75rem',
    fontWeight: 600,
    padding: '5px 12px',
    borderRadius: 99,
    flexShrink: 0,
  },
  alertWarning: {
    maxWidth: 640,
    margin: '0 auto 20px',
    background: '#FFFBEB',
    border: '1px solid #FDE68A',
    color: '#92400E',
    borderRadius: 10,
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    fontSize: '0.87rem',
    lineHeight: 1.5,
  },
  alertError: {
    background: '#FEF2F2',
    border: '1px solid #FCA5A5',
    color: '#DC2626',
    borderRadius: 10,
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    fontSize: '0.87rem',
    marginBottom: 20,
    lineHeight: 1.5,
  },
  card: {
    maxWidth: 640,
    margin: '0 auto',
    background: '#fff',
    borderRadius: 18,
    border: '1px solid var(--border-light)',
    boxShadow: '0 4px 24px rgba(27,37,39,0.06)',
    padding: '32px',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    marginBottom: 28,
    paddingBottom: 20,
    borderBottom: '1px solid var(--border-light)',
  },
  cardIconWrap: {
    width: 44,
    height: 44,
    background: 'var(--primary-light)',
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardTitle: {
    fontFamily: 'var(--font-sans)',
    fontSize: '1.1rem',
    fontWeight: 700,
    color: 'var(--text-main)',
    margin: 0,
  },
  cardSubtitle: {
    fontSize: '0.83rem',
    color: 'var(--text-subtle)',
    margin: '2px 0 0',
  },
  inputWrapper: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 13,
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-subtle)',
    pointerEvents: 'none',
  },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--text-subtle)',
    display: 'flex',
    alignItems: 'center',
    padding: 2,
  },
  infoBox: {
    background: 'var(--primary-light)',
    border: '1px solid var(--primary-subtle)',
    borderRadius: 12,
    padding: '14px 16px',
    marginTop: 24,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  infoRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 8,
    fontSize: '0.83rem',
    color: 'var(--text-body)',
    lineHeight: 1.5,
  },
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 24px',
    fontSize: '0.95rem',
    fontWeight: 600,
  },
  btnSecondary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 20px',
    fontSize: '0.9rem',
  },
  successIcon: {
    width: 72,
    height: 72,
    background: 'linear-gradient(135deg, #10B981, #059669)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    boxShadow: '0 8px 24px rgba(16,185,129,0.3)',
  },
};
