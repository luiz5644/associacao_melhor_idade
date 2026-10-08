import React, { useState, useRef, useEffect } from 'react';
import {
  Shield, LogOut, LayoutDashboard, Images, CalendarDays, Settings,
  Plus, Pencil, Trash2, X, CheckCircle, Users, CalendarCheck,
  HeartHandshake, Camera, Upload, Link, Clock, MapPin, Star,
  ChevronRight, Search, AlertTriangle,
  Building2, ExternalLink, Globe, UserCheck, RefreshCw,
  Menu, LayoutGrid, Image, Calendar, Heart
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { adminApi } from '../services/api';
import CadastroAdminPage from './CadastroAdminPage';

const MONTHS = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

// ── Modal de Confirmação de Exclusão ─────────────────────────────────────────
function ConfirmDeleteModal({ isOpen, onConfirm, onCancel, title, subtitle }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onCancel} role="dialog" aria-modal="true">
      <div className="modal-card" style={{ maxWidth: 420, textAlign:'center' }} onClick={e => e.stopPropagation()}>
        <div style={{ width:56, height:56, background:'#FEF2F2', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
          <AlertTriangle size={28} color="#DC2626" />
        </div>
        <h3 style={{ fontFamily:'var(--font-serif)', fontSize:'1.35rem', marginBottom:8 }}>Confirmar Exclusão</h3>
        <p style={{ color:'var(--text-subtle)', marginBottom:6, fontSize:'0.95rem' }}><strong>{title}</strong></p>
        {subtitle && <p style={{ color:'var(--text-subtle)', marginBottom:24, fontSize:'0.87rem' }}>{subtitle}</p>}
        <div style={{ display:'flex', gap:12, justifyContent:'center' }}>
          <button className="btn btn-pill" onClick={onCancel}>Cancelar</button>
          <button className="btn" style={{ background:'#DC2626', color:'#fff' }} onClick={onConfirm}>Sim, Excluir</button>
        </div>
      </div>
    </div>
  );
}

// ── Formulário de Lembrança (Álbum) — suporte a múltiplas fotos ──────────────
function GalleryFormModal({ isOpen, item, onSave, onClose }) {
  const fileRef = useRef(null);
  const [form, setForm] = useState({
    title: item?.title || '',
    description: item?.description || '',
    date: item?.date || '',
    photos: item?.photos?.length > 0 ? [...item.photos] : (item?.image ? [item.image] : []),
  });
  const [urlInput, setUrlInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState('url'); // 'url' | 'file'

  const setField = (key, val) => setForm(p => ({ ...p, [key]: val }));

  // Adiciona foto por URL
  const handleAddUrl = () => {
    const url = urlInput.trim();
    if (!url) return;
    setField('photos', [...form.photos, url]);
    setUrlInput('');
  };

  // Adiciona uma ou várias fotos por upload de arquivo(s)
  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    let loaded = 0;
    const newPhotos = [];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        newPhotos.push(ev.target.result);
        loaded++;
        if (loaded === files.length) {
          setField('photos', [...form.photos, ...newPhotos]);
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    });
    // reset input para permitir reenvio do mesmo arquivo
    e.target.value = '';
  };

  // Remove foto pelo índice
  const handleRemovePhoto = (idx) => {
    setField('photos', form.photos.filter((_, i) => i !== idx));
  };

  // Promove foto para capa (índice 0)
  const handleSetCover = (idx) => {
    if (idx === 0) return;
    const reordered = [form.photos[idx], ...form.photos.filter((_, i) => i !== idx)];
    setField('photos', reordered);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave({
      title: form.title.trim(),
      description: form.description,
      date: form.date,
      image: form.photos[0] || '',
      photos: form.photos,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" style={{ maxWidth: 680, maxHeight: '92vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Fechar">
          <X size={20} />
        </button>
        <div className="modal-header">
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, color:'#2A5C66', marginBottom:6 }}>
            <Images size={18} /><span style={{ fontWeight:700, fontSize:'0.82rem', textTransform:'uppercase', letterSpacing:'0.08em' }}>Álbum de Lembranças</span>
          </div>
          <h3 className="modal-title">{item ? 'Editar Lembrança' : 'Nova Lembrança'}</h3>
          <p className="modal-subtitle">Adicione quantas fotos quiser — a primeira é a capa da lembrança.</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Dados da Lembrança */}
          <div className="form-group">
                      <label className="form-label">Título <span style={{ color:'#DC2626' }}>*</span></label>
                      <input className="form-input" type="text" placeholder="Ex: Festa de São João 2026" required
                        value={form.title} onChange={e => setField('title', e.target.value)} />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Data do Evento</label>
                      <input className="form-input" type="date" value={form.date} onChange={e => setField('date', e.target.value)} />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Sobre / Descrição</label>
                      <textarea className="form-input" rows={3} placeholder="Conte sobre o momento especial capturado nesta lembrança..."
                        value={form.description} onChange={e => setField('description', e.target.value)}
                        style={{ resize:'vertical', lineHeight:1.6 }} />
                    </div>

          {/* ─── Seção de Fotos ──────────────────────────────── */}
          <div style={{ background:'#F5F9F8', borderRadius:14, padding:'20px', border:'1px solid #DCE7E5', marginBottom:18 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
              <label className="form-label" style={{ margin:0 }}>
                <Camera size={14} style={{ verticalAlign:'middle', marginRight:5 }} />
                Fotos da Lembrança
                <span style={{ marginLeft:8, fontWeight:400, color:'var(--text-subtle)', fontSize:'0.78rem' }}>
                  ({form.photos.length} {form.photos.length === 1 ? 'foto' : 'fotos'} • primeira = capa)
                </span>
              </label>
              <div style={{ display:'flex', gap:6 }}>
                <button type="button"
                  className={`btn ${uploadMode === 'url' ? 'btn-primary' : 'btn-pill'}`}
                  style={{ padding:'5px 12px', fontSize:'0.78rem' }}
                  onClick={() => setUploadMode('url')}>
                  <Link size={12} /> URL
                </button>
                <button type="button"
                  className={`btn ${uploadMode === 'file' ? 'btn-primary' : 'btn-pill'}`}
                  style={{ padding:'5px 12px', fontSize:'0.78rem' }}
                  onClick={() => setUploadMode('file')}>
                  <Upload size={12} /> Arquivo
                </button>
              </div>
            </div>

            {/* Input de URL */}
            {uploadMode === 'url' && (
              <div style={{ display:'flex', gap:8, marginBottom:14 }}>
                <input className="form-input" type="url" placeholder="https://exemplo.com/foto.jpg"
                  value={urlInput} onChange={e => setUrlInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddUrl(); } }}
                  style={{ flex:1 }} />
                <button type="button" className="btn btn-primary" style={{ padding:'10px 16px', whiteSpace:'nowrap' }}
                  onClick={handleAddUrl} disabled={!urlInput.trim()}>
                  <Plus size={14} /> Adicionar
                </button>
              </div>
            )}

            {/* Área de Upload de Arquivos (múltiplos) */}
            {uploadMode === 'file' && (
              <div onClick={() => fileRef.current?.click()} style={{
                border:'2px dashed #B0CDD6', borderRadius:10, padding:'20px', textAlign:'center',
                cursor:'pointer', background:'#EAF4F6', transition:'border-color 0.2s', marginBottom:14 }}
                onMouseEnter={e => e.currentTarget.style.borderColor='#2A5C66'}
                onMouseLeave={e => e.currentTarget.style.borderColor='#B0CDD6'}>
                <input ref={fileRef} type="file" accept="image/*" multiple style={{ display:'none' }} onChange={handleFilesChange} />
                <Upload size={24} color="#2A5C66" style={{ marginBottom:6 }} />
                <p style={{ fontSize:'0.88rem', color:'#2A5C66', fontWeight:700 }}>
                  {uploading ? 'Carregando fotos...' : 'Clique para selecionar fotos'}
                </p>
                <p style={{ fontSize:'0.76rem', color:'#6E6E6E', marginTop:3 }}>
                  PNG, JPG, WEBP até 5MB cada • Você pode selecionar várias de uma vez
                </p>
              </div>
            )}

            {/* Grade de Miniaturas das Fotos Adicionadas */}
            {form.photos.length > 0 ? (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(110px, 1fr))', gap:10 }}>
                {form.photos.map((photoSrc, idx) => (
                  <div key={idx} style={{ position:'relative', borderRadius:10, overflow:'hidden', aspectRatio:'1',
                    border: idx === 0 ? '3px solid #2A5C66' : '2px solid #DCE7E5',
                    boxShadow: idx === 0 ? '0 0 0 2px #EAF4F6' : 'none' }}>
                    <img src={photoSrc} alt={`Foto ${idx + 1}`}
                      style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
                      onError={e => { e.target.style.background='#EEE'; e.target.style.display='none'; }} />

                    {/* Badge de Capa */}
                    {idx === 0 && (
                      <div style={{ position:'absolute', bottom:0, left:0, right:0,
                        background:'rgba(42,92,102,0.85)', color:'#fff', fontSize:'0.62rem',
                        fontWeight:800, textAlign:'center', padding:'3px 4px', letterSpacing:'0.04em' }}>
                        ★ CAPA
                      </div>
                    )}

                    {/* Botões de ação */}
                    <div style={{ position:'absolute', top:4, right:4, display:'flex', flexDirection:'column', gap:3 }}>
                      {/* Remover */}
                      <button type="button"
                        style={{ width:22, height:22, background:'rgba(220,38,38,0.85)', border:'none', borderRadius:'50%',
                          display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#fff' }}
                        onClick={() => handleRemovePhoto(idx)} title="Remover foto">
                        <X size={12} />
                      </button>
                      {/* Definir como capa (apenas se não for o índice 0) */}
                      {idx > 0 && (
                        <button type="button"
                          style={{ width:22, height:22, background:'rgba(42,92,102,0.85)', border:'none', borderRadius:'50%',
                            display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#fff', fontSize:'10px', fontWeight:700 }}
                          onClick={() => handleSetCover(idx)} title="Definir como capa">
                          ★
                        </button>
                      )}
                    </div>

                    {/* Número */}
                    <div style={{ position:'absolute', top:4, left:4, background:'rgba(0,0,0,0.5)', color:'#fff',
                      fontSize:'0.62rem', fontWeight:700, borderRadius:4, padding:'1px 5px' }}>
                      {idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign:'center', padding:'18px', color:'var(--text-subtle)', fontSize:'0.85rem' }}>
                <Camera size={28} style={{ opacity:0.3, display:'block', margin:'0 auto 8px' }} />
                Nenhuma foto adicionada ainda. Use os botões acima para inserir fotos.
              </div>
            )}
          </div>

          <div style={{ display:'flex', gap:12, justifyContent:'flex-end' }}>
            <button type="button" className="btn btn-pill" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">
              <CheckCircle size={15} /> {item ? 'Salvar Alterações' : 'Adicionar ao Álbum'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


function CalendarFormModal({ isOpen, item, onSave, onClose }) {
  const [form, setForm] = useState({
    title: item?.title || '',
    desc: item?.desc || '',
    day: item?.day || 1,
    month: item?.month !== undefined ? item.month : 9,
    year: item?.year || 2026,
    time: item?.time || '14:00',
    location: item?.location || 'Sede da Associação',
    isHighlight: item?.isHighlight || false
  });

  const setField = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const numDays = daysInMonth(parseInt(form.month), parseInt(form.year));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave({
      title: form.title.trim(),
      desc: form.desc,
      day: parseInt(form.day, 10),
      month: parseInt(form.month, 10),
      year: parseInt(form.year, 10),
      time: form.time,
      location: form.location,
      isHighlight: form.isHighlight
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" style={{ maxWidth: 620, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Fechar">
          <X size={20} />
        </button>
        <div className="modal-header">
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, color:'#2A5C66', marginBottom:6 }}>
            <CalendarDays size={18} /><span style={{ fontWeight:700, fontSize:'0.82rem', textTransform:'uppercase', letterSpacing:'0.08em' }}>Calendário de Ações</span>
          </div>
          <h3 className="modal-title">{item ? 'Editar Atividade' : 'Nova Atividade'}</h3>
          <p className="modal-subtitle">Cadastre um encontro ou evento para o calendário público.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Título da Atividade <span style={{ color:'#DC2626' }}>*</span></label>
            <input className="form-input" type="text" placeholder="Ex: Tarde de Bingo Beneficente"
              required value={form.title} onChange={e => setField('title', e.target.value)} />
          </div>

          {/* Data e Horário */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
            <div className="form-group">
              <label className="form-label">Mês</label>
              <select className="form-select" value={form.month} onChange={e => { setField('month', e.target.value); setField('day', 1); }}>
                {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Dia</label>
              <select className="form-select" value={form.day} onChange={e => setField('day', e.target.value)}>
                {Array.from({ length: numDays }, (_, i) => i + 1).map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Ano</label>
              <select className="form-select" value={form.year} onChange={e => setField('year', e.target.value)}>
                {[2026, 2027, 2028].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div className="form-group">
              <label className="form-label"><Clock size={13} style={{ verticalAlign:'middle', marginRight:4 }} />Horário</label>
              <input className="form-input" type="time" value={form.time} onChange={e => setField('time', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label"><MapPin size={13} style={{ verticalAlign:'middle', marginRight:4 }} />Local da Atividade</label>
              <input className="form-input" type="text" placeholder="Ex: Salão Nobre, Sala de Música, Pátio Externo..."
                value={form.location} onChange={e => setField('location', e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Sobre a Atividade</label>
            <textarea className="form-input" rows={3} placeholder="Descreva detalhes do encontro para os associados..."
              value={form.desc} onChange={e => setField('desc', e.target.value)}
              style={{ resize:'vertical', lineHeight:1.6 }} />
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20, padding:'12px 16px', background:'#F5F9F8', borderRadius:10, border:'1px solid #DCE7E5', cursor:'pointer' }}
            onClick={() => setField('isHighlight', !form.isHighlight)}>
            <div style={{ width:20, height:20, borderRadius:4, border:`2px solid ${form.isHighlight ? '#2A5C66' : '#B0BEB8'}`,
              background: form.isHighlight ? '#2A5C66' : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }}>
              {form.isHighlight && <CheckCircle size={13} color="#fff" />}
            </div>
            <Star size={15} color={form.isHighlight ? '#E8A87C' : '#B0BEB8'} fill={form.isHighlight ? '#E8A87C' : 'none'} />
            <span style={{ fontSize:'0.9rem', fontWeight:600, color: form.isHighlight ? '#1B2527' : '#6E6E6E' }}>
              Marcar como Destaque do Mês
            </span>
            <span style={{ fontSize:'0.78rem', color:'#8E9696', marginLeft:'auto' }}>Aparece na sidebar do calendário</span>
          </div>

          <div style={{ display:'flex', gap:12, justifyContent:'flex-end' }}>
            <button type="button" className="btn btn-pill" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">
              <CheckCircle size={15} /> {item ? 'Salvar Alterações' : 'Agendar no Calendário'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Formulário de Patrocinador (Modal) ──────────────────────────────────────
function SponsorFormModal({ isOpen, item, onSave, onClose }) {
  const fileRef = useRef(null);
  const [form, setForm] = useState({
    name: '',
    logo: '',
    websiteUrl: '',
    description: '',
    active: true
  });
  const [uploadMode, setUploadMode] = useState('file');
  const [urlInput, setUrlInput] = useState('');

  useEffect(() => {
    if (item) {
      setForm({
        name: item.name || '',
        logo: item.logo || '',
        websiteUrl: item.websiteUrl || '',
        description: item.description || '',
        active: item.active !== undefined ? item.active : true
      });
      setUrlInput(item.logo || '');
    } else {
      setForm({
        name: '',
        logo: '',
        websiteUrl: '',
        description: '',
        active: true
      });
      setUrlInput('');
    }
  }, [item, isOpen]);

  if (!isOpen) return null;

  const setField = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setField('logo', ev.target.result);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      setField('logo', urlInput.trim());
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave({
      ...form,
      logo: form.logo.trim() || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=400&auto=format&fit=crop'
    });
  };

  return (
      <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
        <div className="modal-card" style={{ maxWidth: 540 }} onClick={e => e.stopPropagation()}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:38, height:38, background:'#FDF6F0', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <Building2 size={20} color="#B8621A" />
              </div>
              <div>
                <h3 style={{ fontFamily:'var(--font-serif)', fontSize:'1.25rem' }}>
                  {item ? 'Editar Patrocinador' : 'Novo Patrocinador'}
                </h3>
                <p style={{ fontSize:'0.82rem', color:'var(--text-subtle)' }}>
                  Empresa parceira com logo no carrossel da página inicial
                </p>
              </div>
            </div>
            <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-subtle)' }}>
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Nome da Empresa ou Comércio *</label>
              <input 
                className="form-input" 
                type="text" 
                required 
                placeholder="Ex: Farmácia São Lucas, Padaria Central..."
                value={form.name} 
                onChange={e => setField('name', e.target.value)} 
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Globe size={13} style={{ verticalAlign:'middle', marginRight:4 }} />
                Website ou Rede Social
              </label>
              <input 
                className="form-input" 
                type="text" 
                placeholder="Ex: https://instagram.com/empresa"
                value={form.websiteUrl} 
                onChange={e => setField('websiteUrl', e.target.value)} 
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <Camera size={14} style={{ verticalAlign:'middle', marginRight:5 }} />
                Logo da Empresa / Patrocinador
              </label>

              {/* Alternar modo Arquivo / URL */}
                            <div style={{ display:'flex', gap:8, marginBottom:10 }}>
                              <button 
                                type="button"
                                className={`btn btn-pill ${uploadMode === 'file' ? 'active' : ''}`}
                                style={{ fontSize:'0.8rem', padding:'5px 12px' }}
                                onClick={() => setUploadMode('file')}
                              >
                                <Upload size={13} /> Enviar do Computador
                              </button>
                              <button
                type="button"
                className={`btn btn-pill ${uploadMode === 'url' ? 'active' : ''}`}
                style={{ fontSize:'0.8rem', padding:'5px 12px' }}
                onClick={() => setUploadMode('url')}
              >
                <Link size={13} /> Inserir Link (URL)
              </button>
            </div>

            {uploadMode === 'file' ? (
              <div>
                <input 
                  type="file" 
                  ref={fileRef} 
                  accept="image/*" 
                  style={{ display:'none' }}
                  onChange={handleFileUpload} 
                />
                <button 
                  type="button" 
                  className="btn"
                  style={{ width:'100%', background:'#F5F9F8', border:'2px dashed #BED8D3', color:'#2A5C66', padding:'14px', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', gap:8, cursor:'pointer' }}
                  onClick={() => fileRef.current?.click()}
                >
                  <Upload size={18} />
                  <span>Escolher arquivo de imagem do computador</span>
                </button>
              </div>
            ) : (
              <div style={{ display:'flex', gap:8 }}>
                <input 
                  className="form-input" 
                  type="url" 
                  placeholder="https://exemplo.com/logo.png"
                  value={urlInput} 
                  onChange={e => setUrlInput(e.target.value)} 
                />
                <button 
                  type="button" 
                  className="btn btn-pill" 
                  style={{ whiteSpace:'nowrap' }} 
                  onClick={handleApplyUrl}
                >
                  Aplicar
                </button>
              </div>
            )}

            {/* Preview do Logo */}
            {form.logo && (
              <div style={{ marginTop:12, padding:14, background:'#FAF7F5', border:'1px solid #DCE7E5', borderRadius:10, display:'flex', alignItems:'center', gap:14 }}>
                <div style={{ width:70, height:70, background:'#fff', borderRadius:8, border:'1px solid #E5E7EB', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', padding:6 }}>
                  <img 
                    src={form.logo} 
                    alt="Pré-visualização do logo" 
                    style={{ maxWidth:'100%', maxHeight:'100%', objectFit:'contain' }}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=400&auto=format&fit=crop';
                    }}
                  />
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:'0.82rem', fontWeight:700, color:'var(--text-main)' }}>Prévia do Logo</div>
                  <div style={{ fontSize:'0.75rem', color:'var(--text-subtle)' }}>Esta imagem será exibida no carrossel da página inicial.</div>
                  <button 
                    type="button" 
                    onClick={() => setField('logo', '')}
                    style={{ background:'none', border:'none', color:'#DC2626', fontSize:'0.75rem', cursor:'pointer', marginTop:4, padding:0, textDecoration:'underline' }}
                  >
                    Remover logo
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Breve Descrição ou Contrapartida (Opcional)</label>
            <textarea 
              className="form-input" 
              rows={2} 
              placeholder="Ex: Apoia nossos cafés comunitários e festividades do forró..."
              value={form.description} 
              onChange={e => setField('description', e.target.value)}
              style={{ resize:'vertical', lineHeight:1.5 }} 
            />
          </div>

          <div 
            style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20, padding:'10px 14px', background:'#F5F9F8', borderRadius:10, border:'1px solid #DCE7E5', cursor:'pointer' }}
            onClick={() => setField('active', !form.active)}
          >
            <div style={{ width:20, height:20, borderRadius:4, border:`2px solid ${form.active ? '#2A5C66' : '#B0BEB8'}`,
              background: form.active ? '#2A5C66' : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }}>
              {form.active && <CheckCircle size={13} color="#fff" />}
            </div>
            <span style={{ fontSize:'0.88rem', fontWeight:600, color: form.active ? '#1B2527' : '#6E6E6E' }}>
              Ativo (visível no carrossel da página inicial)
            </span>
          </div>

          <div style={{ display:'flex', gap:12, justifyContent:'flex-end' }}>
            <button type="button" className="btn btn-pill" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">
              <CheckCircle size={15} /> {item ? 'Salvar Alterações' : 'Cadastrar Patrocinador'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── PAINEL: VISÃO GERAL ──────────────────────────────────────────────────────
function TabOverview({ setActiveTab }) {
  const { galleryItems, calendarEvents, sponsors } = useData();
  const stats = [
    { icon: <Users size={22} color="#2A5C66" />, value: 248, label: 'Associados Ativos', bg: '#EAF4F6', border: '#D2ECF0' },
    { icon: <CalendarCheck size={22} color="#3D6058" />, value: calendarEvents.length, label: 'Ações Agendadas', bg: '#F0F9F5', border: '#CBE8DF' },
    { icon: <Images size={22} color="#7B5EA7" />, value: galleryItems.length, label: 'Lembranças no Álbum', bg: '#F5F0FB', border: '#E2D4F5' },
    { icon: <Building2 size={22} color="#B8621A" />, value: (sponsors || []).length, label: 'Patrocinadores & Parceiros', bg: '#FDF6F0', border: '#F8DFC2' }
  ];

  const upcomingEvents = [...calendarEvents]
    .sort((a, b) => { const da = a.year*10000+a.month*100+a.day, db = b.year*10000+b.month*100+b.day; return da-db; })
    .slice(0, 4);

  return (
    <div>
      <h2 className="admin-section-title">Visão Geral</h2>
      <p style={{ color:'var(--text-subtle)', marginBottom:28, fontSize:'0.95rem' }}>Resumo da atividade da Associação Melhor Idade.</p>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:16, marginBottom:32, width:'100%' }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius:14, padding:'20px 18px', minWidth:0 }}>
            <div style={{ marginBottom:10 }}>{s.icon}</div>
            <div style={{ fontSize:'2rem', fontWeight:800, color:'var(--text-main)', lineHeight:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.value}</div>
            <div style={{ fontSize:'0.8rem', color:'var(--text-subtle)', marginTop:6, fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Atalhos rápidos */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:20, marginBottom:32, width:'100%' }}>
        <div style={{ background:'#fff', border:'1px solid #DCE7E5', borderRadius:16, padding:24, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
            <div style={{ width:38, height:38, background:'#F5F0FB', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <Images size={20} color="#7B5EA7" />
            </div>
            <h3 style={{ fontSize:'1rem', fontWeight:700, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>Álbum de Lembranças</h3>
          </div>
          <p style={{ fontSize:'0.88rem', color:'var(--text-subtle)', marginBottom:16 }}>
            {galleryItems.length} lembranças cadastradas no álbum público.
          </p>
          <button className="btn btn-primary" style={{ fontSize:'0.85rem', padding:'8px 18px', width:'100%' }} onClick={() => setActiveTab('gallery')}>
            <Plus size={14} /> Adicionar Lembrança
          </button>
        </div>

        <div style={{ background:'#fff', border:'1px solid #DCE7E5', borderRadius:16, padding:24, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
            <div style={{ width:38, height:38, background:'#EAF4F6', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <CalendarDays size={20} color="#2A5C66" />
            </div>
            <h3 style={{ fontSize:'1rem', fontWeight:700, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>Calendário de Ações</h3>
          </div>
          <p style={{ fontSize:'0.88rem', color:'var(--text-subtle)', marginBottom:16 }}>
            {calendarEvents.length} ações agendadas no calendário.
          </p>
          <button className="btn btn-primary" style={{ fontSize:'0.85rem', padding:'8px 18px', width:'100%' }} onClick={() => setActiveTab('calendar')}>
            <Plus size={14} /> Agendar Ação
          </button>
        </div>

        <div style={{ background:'#fff', border:'1px solid #DCE7E5', borderRadius:16, padding:24, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
            <div style={{ width:38, height:38, background:'#FDF6F0', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <Building2 size={20} color="#B8621A" />
            </div>
            <h3 style={{ fontSize:'1rem', fontWeight:700, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>Patrocinadores & Apoio</h3>
          </div>
          <p style={{ fontSize:'0.88rem', color:'var(--text-subtle)', marginBottom:16 }}>
            {(sponsors || []).length} empresas parceiras cadastradas no carrossel.
          </p>
          <button className="btn btn-primary" style={{ fontSize:'0.85rem', padding:'8px 18px', width:'100%' }} onClick={() => setActiveTab('sponsors')}>
            <Plus size={14} /> Gerenciar Patrocinadores
          </button>
        </div>
      </div>

      {/* Próximas ações */}
      {upcomingEvents.length > 0 && (
        <div style={{ background:'#fff', border:'1px solid #DCE7E5', borderRadius:16, padding:24, width:'100%' }}>
          <h3 style={{ fontFamily:'var(--font-sans)', fontSize:'1.1rem', marginBottom:16 }}>Próximas Ações Cadastradas</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {upcomingEvents.map(ev => (
              <div key={ev.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'10px 14px', background:'#F5F9F8', borderRadius:10, flexWrap:'wrap' }}>
                              <div style={{ textAlign:'center', minWidth:44, background:'#2A5C66', borderRadius:8, padding:'6px 4px', color:'#fff', flexShrink:0 }}>
                                <div style={{ fontSize:'1.1rem', fontWeight:800, lineHeight:1 }}>{ev.day}</div>
                                <div style={{ fontSize:'0.65rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>{MONTHS[ev.month]?.slice(0,3)}</div>
                              </div>
                              <div style={{ flex:1, minWidth:0 }}>
                                <div style={{ fontWeight:700, fontSize:'0.92rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{ev.title}</div>
                                <div style={{ fontSize:'0.78rem', color:'var(--text-subtle)' }}>{ev.time} • {ev.location}</div>
                              </div>
                            </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── PAINEL: ÁLBUM DE LEMBRANÇAS ──────────────────────────────────────────────
function TabGallery() {
  const { galleryItems, addGalleryItem, updateGalleryItem, deleteGalleryItem } = useData();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = galleryItems.filter(item => {
    const matchSearch = !search || item.title.toLowerCase().includes(search.toLowerCase()) || item.description?.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const handleSave = (data) => {
    if (editingItem) {
      updateGalleryItem(editingItem.id, data);
    } else {
      addGalleryItem(data);
    }
    setEditingItem(null);
    setShowForm(false);
  };

  return (
      <div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
          <div>
            <h2 className="admin-section-title">Álbum de Lembranças</h2>
            <p style={{ color:'var(--text-subtle)', fontSize:'0.9rem' }}>{galleryItems.length} lembranças cadastradas</p>
          </div>
          <button className="btn btn-primary" onClick={() => { setEditingItem(null); setShowForm(true); }}>
            <Plus size={16} /> Nova Lembrança
          </button>
        </div>

        {/* Busca */}
        <div style={{ display:'flex', gap:12, marginBottom:22, flexWrap:'wrap' }}>
          <div style={{ position:'relative', flex:'1 1 220px' }}>
            <Search size={15} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#8E9696' }} />
            <input className="form-input" style={{ paddingLeft:36 }} type="text"
              placeholder="Buscar por título ou descrição..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'48px 20px', color:'var(--text-subtle)' }}>
          <Images size={40} style={{ opacity:0.3, marginBottom:12, display:'block', margin:'0 auto 12px' }} />
          <p style={{ fontWeight:600 }}>Nenhuma lembrança encontrada.</p>
          <p style={{ fontSize:'0.85rem', marginTop:4 }}>Clique em "Nova Lembrança" para adicionar.</p>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:18 }}>
          {filtered.map(item => (
            <div key={item.id} style={{ background:'#fff', border:'1px solid #DCE7E5', borderRadius:14, overflow:'hidden', boxShadow:'0 2px 8px rgba(27,37,39,0.04)', transition:'box-shadow 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow='0 8px 24px rgba(27,37,39,0.10)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow='0 2px 8px rgba(27,37,39,0.04)'}>
              <div style={{ height:160, overflow:'hidden', background:'#EEE', position:'relative' }}>
                <img src={item.image} alt={item.title}
                  style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.4s' }}
                  onMouseEnter={e => e.currentTarget.style.transform='scale(1.05)'}
                  onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
                                    onError={e => { e.target.style.display='none'; }} />
                                </div>
                                <div style={{ padding:'14px 16px' }}>
                <h4 style={{ fontFamily:'var(--font-serif)', fontSize:'1rem', marginBottom:4, lineHeight:1.3 }}>{item.title}</h4>
                {item.subtitle && <p style={{ fontSize:'0.78rem', color:'var(--text-subtle)', marginBottom:8 }}>{item.subtitle}</p>}
                {item.description && (
                  <p style={{ fontSize:'0.82rem', color:'var(--text-body)', lineHeight:1.55,
                    overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>
                    {item.description}
                  </p>
                )}
                <div style={{ display:'flex', gap:8, marginTop:12, justifyContent:'flex-end' }}>
                  <button className="btn btn-pill" style={{ padding:'5px 14px', fontSize:'0.8rem' }}
                    onClick={() => { setEditingItem(item); setShowForm(true); }}>
                    <Pencil size={12} /> Editar
                  </button>
                  <button className="btn" style={{ padding:'5px 14px', fontSize:'0.8rem', background:'#FEF2F2', color:'#DC2626', border:'1px solid #FCA5A5' }}
                    onClick={() => setDeleteTarget(item)}>
                    <Trash2 size={12} /> Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <GalleryFormModal isOpen={showForm} item={editingItem}
        onSave={handleSave} onClose={() => { setShowForm(false); setEditingItem(null); }} />

      <ConfirmDeleteModal isOpen={!!deleteTarget}
        title={deleteTarget?.title}
        subtitle="Esta lembrança será removida permanentemente do álbum público."
        onConfirm={() => { deleteGalleryItem(deleteTarget.id); setDeleteTarget(null); }}
        onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}

// ── PAINEL: CALENDÁRIO DE ATIVIDADES ─────────────────────────────────────────
function TabCalendar() {
  const { calendarEvents, addCalendarEvent, updateCalendarEvent, deleteCalendarEvent } = useData();
  const [search, setSearch] = useState('');
  const [filterMonth, setFilterMonth] = useState('Todos');
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = calendarEvents.filter(ev => {
    const matchMonth = filterMonth === 'Todos' || String(ev.month) === filterMonth;
    const matchSearch = !search || ev.title.toLowerCase().includes(search.toLowerCase()) || ev.desc?.toLowerCase().includes(search.toLowerCase());
    return matchMonth && matchSearch;
  }).sort((a, b) => {
    const da = a.year*10000+a.month*100+a.day;
    const db = b.year*10000+b.month*100+b.day;
    return da - db;
  });

  const handleSave = (data) => {
    if (editingEvent) {
      updateCalendarEvent(editingEvent.id, data);
    } else {
      addCalendarEvent(data);
    }
    setEditingEvent(null);
    setShowForm(false);
  };

  return (
      <div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
          <div>
            <h2 className="admin-section-title">Calendário de Ações</h2>
                      <p style={{ color:'var(--text-subtle)', fontSize:'0.9rem' }}>{calendarEvents.length} ações cadastradas</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => { setEditingEvent(null); setShowForm(true); }}>
                      <Plus size={16} /> Nova Ação
          </button>
        </div>

        {/* Busca & Filtro de Mês */}
        <div style={{ display:'flex', gap:12, marginBottom:22, flexWrap:'wrap' }}>
          <div style={{ position:'relative', flex:'1 1 200px' }}>
            <Search size={15} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#8E9696' }} />
            <input className="form-input" style={{ paddingLeft:36 }} type="text"
              placeholder="Buscar atividade..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="form-select" style={{ flex:'0 0 auto' }} value={filterMonth} onChange={e => setFilterMonth(e.target.value)}>
            <option value="Todos">Todos os Meses</option>
            {MONTHS.map((m, i) => <option key={i} value={String(i)}>{m}</option>)}
          </select>
        </div>

        {filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'48px 20px', color:'var(--text-subtle)' }}>
          <CalendarDays size={40} style={{ opacity:0.3, marginBottom:12, display:'block', margin:'0 auto 12px' }} />
          <p style={{ fontWeight:600 }}>Nenhuma atividade encontrada.</p>
          <p style={{ fontSize:'0.85rem', marginTop:4 }}>Clique em "Nova Atividade" para agendar.</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {filtered.map(ev => (
            <div key={ev.id} style={{ background:'#fff', border:'1px solid #DCE7E5', borderRadius:14, padding:'16px 20px',
              display:'flex', gap:16, alignItems:'flex-start', boxShadow:'0 1px 4px rgba(27,37,39,0.04)', transition:'box-shadow 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow='0 4px 16px rgba(27,37,39,0.08)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow='0 1px 4px rgba(27,37,39,0.04)'}>
              {/* Data */}
              <div style={{ minWidth:52, textAlign:'center', background:'var(--primary)', color:'#fff', borderRadius:10, padding:'8px 6px' }}>
                <div style={{ fontSize:'1.4rem', fontWeight:800, lineHeight:1 }}>{ev.day}</div>
                <div style={{ fontSize:'0.62rem', textTransform:'uppercase', letterSpacing:'0.08em', opacity:0.85 }}>
                  {MONTHS[ev.month]?.slice(0,3)}
                </div>
                <div style={{ fontSize:'0.62rem', opacity:0.7, marginTop:2 }}>{ev.year}</div>
              </div>
                            {/* Conteúdo */}
                            <div style={{ flex:1, minWidth:0 }}>
                              <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center', marginBottom:4 }}>
                                {ev.isHighlight && (
                                  <span style={{ display:'inline-flex', alignItems:'center', gap:3, fontSize:'0.7rem', fontWeight:700,
                                    color:'#92660A', background:'#FEF3C7', border:'1px solid #FDE68A', borderRadius:999, padding:'2px 9px' }}>
                                    <Star size={10} fill="#92660A" /> Destaque
                                  </span>
                                )}
                              </div>
                              <h4 style={{ fontWeight:700, fontSize:'0.97rem', marginBottom:4 }}>{ev.title}</h4>
                <div style={{ fontSize:'0.8rem', color:'var(--text-subtle)', display:'flex', gap:14, flexWrap:'wrap' }}>
                  <span style={{ display:'inline-flex', alignItems:'center', gap:3 }}><Clock size={11} /> {ev.time}</span>
                  {ev.location && <span style={{ display:'inline-flex', alignItems:'center', gap:3 }}><MapPin size={11} /> {ev.location}</span>}
                </div>
                {ev.desc && <p style={{ fontSize:'0.83rem', color:'var(--text-body)', marginTop:6, lineHeight:1.55 }}>{ev.desc}</p>}
              </div>
              {/* Ações */}
              <div style={{ display:'flex', flexDirection:'column', gap:6, alignSelf:'center' }}>
                <button className="btn btn-pill" style={{ padding:'6px 14px', fontSize:'0.8rem', whiteSpace:'nowrap' }}
                  onClick={() => { setEditingEvent(ev); setShowForm(true); }}>
                  <Pencil size={12} /> Editar
                </button>
                <button className="btn" style={{ padding:'6px 14px', fontSize:'0.8rem', background:'#FEF2F2', color:'#DC2626', border:'1px solid #FCA5A5', whiteSpace:'nowrap' }}
                  onClick={() => setDeleteTarget(ev)}>
                  <Trash2 size={12} /> Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <CalendarFormModal isOpen={showForm} item={editingEvent}
        onSave={handleSave} onClose={() => { setShowForm(false); setEditingEvent(null); }} />

      <ConfirmDeleteModal isOpen={!!deleteTarget}
        title={deleteTarget?.title}
        subtitle="Esta atividade será removida do calendário público."
        onConfirm={() => { deleteCalendarEvent(deleteTarget.id); setDeleteTarget(null); }}
        onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}

// ── PAINEL: PATROCINADORES & PARCEIROS ───────────────────────────────────────
function TabSponsors() {
  const { sponsors, addSponsor, updateSponsor, deleteSponsor } = useData();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const sponsorList = sponsors || [];

  const filtered = sponsorList.filter(sp => {
    const matchSearch = !search || sp.name?.toLowerCase().includes(search.toLowerCase()) || sp.description?.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const handleSave = (data) => {
    if (editingSponsor) {
      updateSponsor(editingSponsor.id, data);
    } else {
      addSponsor(data);
    }
    setShowForm(false);
    setEditingSponsor(null);
  };

  return (
    <div>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:16 }}>
        <div>
          <h2 className="admin-section-title">Patrocinadores & Parceiros</h2>
          <p style={{ color:'var(--text-subtle)', fontSize:'0.95rem' }}>
            Cadastre as empresas que apoiam a Associação. Os logos e nomes aparecerão no carrossel da página inicial.
          </p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => { setEditingSponsor(null); setShowForm(true); }}
          style={{ display:'flex', alignItems:'center', gap:8 }}
        >
          <Plus size={16} /> Novo Patrocinador
        </button>
      </div>

      {/* Filtros e Busca */}
            <div style={{ display:'flex', gap:12, marginBottom:24, flexWrap:'wrap', alignItems:'center' }}>
              <div style={{ position:'relative', flex:1, minWidth:220 }}>
                <Search size={16} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--text-subtle)' }} />
                <input 
                  className="form-input" 
                  type="text" 
                  placeholder="Buscar por nome da empresa ou descrição..."
                  value={search} 
                  onChange={e => setSearch(e.target.value)} 
                  style={{ paddingLeft:38 }} 
                />
              </div>
            </div>

            {/* Grid de Patrocinadores */}
            {filtered.length === 0 ? (
              <div style={{ background:'#fff', border:'1px solid #DCE7E5', borderRadius:16, padding:48, textAlign:'center' }}>
                <Building2 size={40} style={{ opacity:0.25, display:'block', margin:'0 auto 12px' }} />
                <h3 style={{ fontSize:'1.1rem', marginBottom:6 }}>Nenhum patrocinador encontrado</h3>
                <p style={{ color:'var(--text-subtle)', fontSize:'0.88rem', marginBottom:20 }}>
                  {search ? 'Tente alterar os termos da busca.' : 'Cadastre sua primeira empresa parceira.'}
                </p>
                <button className="btn btn-primary" onClick={() => { setEditingSponsor(null); setShowForm(true); }}>
                  <Plus size={15} /> Cadastrar Patrocinador
                </button>
              </div>
            ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:20 }}>
          {filtered.map(sponsor => (
            <div 
              key={sponsor.id} 
              style={{
                background: '#fff',
                border: '1px solid #DCE7E5',
                borderRadius: 16,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'all 0.2s ease'
              }}
            >
              <div>
                              {/* Header com Badge e Status */}
                              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
                                <span style={{
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  padding: '2px 8px',
                                  borderRadius: 99,
                                  background: sponsor.active !== false ? '#EDFAF3' : '#FEF2F2',
                                  color: sponsor.active !== false ? '#2D7A50' : '#DC2626',
                                  border: `1px solid ${sponsor.active !== false ? '#C8EDD8' : '#FCA5A5'}`
                                }}>
                                  {sponsor.active !== false ? 'No Carrossel' : 'Oculto'}
                                </span>
                              </div>

                              {/* Logo Frame */}
                <div style={{
                  height: 100,
                  background: '#FAF7F5',
                  borderRadius: 10,
                  border: '1px solid #EAE5E1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 12,
                  marginBottom: 16
                }}>
                  <img 
                    src={sponsor.logo} 
                    alt={sponsor.name}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=400&auto=format&fit=crop';
                    }}
                  />
                </div>

                {/* Nome e Dados */}
                <h4 style={{ fontFamily:'var(--font-serif)', fontSize:'1.15rem', marginBottom:6, color:'var(--text-main)' }}>
                  {sponsor.name}
                </h4>

                {sponsor.description && (
                  <p style={{ fontSize:'0.83rem', color:'var(--text-subtle)', lineHeight:1.5, marginBottom:10 }}>
                    {sponsor.description}
                  </p>
                )}

                {sponsor.websiteUrl && (
                  <a 
                    href={sponsor.websiteUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: '0.78rem',
                      color: 'var(--primary)',
                      fontWeight: 600,
                      marginBottom: 14,
                      textDecoration: 'none'
                    }}
                  >
                    <span>Visitar site</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>

              {/* Ações */}
              <div style={{ display:'flex', gap:8, borderTop:'1px solid #F0ECE8', paddingTop:14, marginTop:8, justifyContent:'flex-end' }}>
                <button 
                  className="btn btn-pill" 
                  style={{ padding:'6px 14px', fontSize:'0.8rem' }}
                  onClick={() => { setEditingSponsor(sponsor); setShowForm(true); }}
                >
                  <Pencil size={12} /> Editar
                </button>
                <button 
                  className="btn" 
                  style={{ padding:'6px 14px', fontSize:'0.8rem', background:'#FEF2F2', color:'#DC2626', border:'1px solid #FCA5A5' }}
                  onClick={() => setDeleteTarget(sponsor)}
                >
                  <Trash2 size={12} /> Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modais */}
      <SponsorFormModal 
        isOpen={showForm} 
        item={editingSponsor}
        onSave={handleSave} 
        onClose={() => { setShowForm(false); setEditingSponsor(null); }} 
      />

      <ConfirmDeleteModal 
        isOpen={!!deleteTarget}
        title={deleteTarget?.name}
        subtitle="Esta empresa parceira será removida e deixará de aparecer no carrossel da página inicial."
        onConfirm={() => { deleteSponsor(deleteTarget.id); setDeleteTarget(null); }}
        onCancel={() => setDeleteTarget(null)} 
      />
    </div>
  );
}

// ── PAINEL: DEPOIMENTOS ───────────────────────────────────────────────────────
function TabTestimonials() {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleSave = (data) => {
    if (editingItem) {
      updateTestimonial(editingItem.id, data);
    } else {
      addTestimonial(data);
    }
    setEditingItem(null);
    setShowForm(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h2 className="admin-section-title">Depoimentos</h2>
          <p style={{ color: 'var(--text-subtle)', fontSize: '0.9rem' }}>{testimonials.length} depoimentos cadastrados</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingItem(null); setShowForm(true); }}>
          <Plus size={16} /> Novo Depoimento
        </button>
      </div>

      {testimonials.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-subtle)' }}>
          <HeartHandshake size={40} style={{ opacity: 0.3, marginBottom: 12, display: 'block', margin: '0 auto 12px' }} />
          <p style={{ fontWeight: 600 }}>Nenhum depoimento encontrado.</p>
          <p style={{ fontSize: '0.85rem', marginTop: 4 }}>Clique em "Novo Depoimento" para adicionar.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 }}>
          {testimonials.map((t) => (
            <div
              key={t.id}
              style={{ background: '#fff', border: '1px solid #DCE7E5', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 8px rgba(27,37,39,0.04)' }}
            >
              <div style={{ height: 150, overflow: 'hidden', background: '#EEE' }}>
                <img
                  src={t.avatar}
                  alt={`Foto de ${t.name}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => { e.target.style.display = 'none'; }}
                />
              </div>
              <div style={{ padding: '14px 16px' }}>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', marginBottom: 4, lineHeight: 1.3 }}>{t.name}</h4>
                {t.role && <p style={{ fontSize: '0.78rem', color: 'var(--text-subtle)', marginBottom: 8 }}>{t.role}</p>}
                {t.text && (
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-body)', lineHeight: 1.55,
                    overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                    {t.text}
                  </p>
                )}
                <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'flex-end' }}>
                  <button
                    className="btn btn-pill"
                    style={{ padding: '5px 14px', fontSize: '0.8rem' }}
                    onClick={() => { setEditingItem(t); setShowForm(true); }}
                  >
                    <Pencil size={12} /> Editar
                  </button>
                  <button
                    className="btn"
                    style={{ padding: '5px 14px', fontSize: '0.8rem', background: '#FEF2F2', color: '#DC2626', border: '1px solid #FCA5A5' }}
                    onClick={() => setDeleteTarget(t)}
                  >
                    <Trash2 size={12} /> Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modais */}
      <TestimonialFormModal
        isOpen={showForm}
        item={editingItem}
        onSave={handleSave}
        onClose={() => { setShowForm(false); setEditingItem(null); }}
      />

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title={deleteTarget?.name}
        subtitle="Este depoimento será removido permanentemente da página de Depoimentos."
        onConfirm={() => { deleteTestimonial(deleteTarget.id); setDeleteTarget(null); }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

// ── Modal de Depoimento ───────────────────────────────────────────────────────
function TestimonialFormModal({ isOpen, item, onSave, onClose }) {
  const [form, setForm] = useState({ name: '', role: '', avatar: '', text: '' });
  const setField = (key, val) => setForm(p => ({ ...p, [key]: val }));

  useEffect(() => {
    setForm({
      name: item?.name || '',
      role: item?.role || '',
      avatar: item?.avatar || '',
      text: item?.text || ''
    });
  }, [item, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.text.trim()) return;
    onSave({
      name: form.name.trim(),
      role: form.role.trim(),
      avatar: form.avatar.trim(),
      text: form.text.trim()
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, background: '#FDF6F0', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HeartHandshake size={20} color="#2A5C66" />
            </div>
            <div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem' }}>
                {item ? 'Editar Depoimento' : 'Novo Depoimento'}
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-subtle)' }}>
                Depoimento exibido na página pública de Depoimentos
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-subtle)' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nome <span style={{ color: '#DC2626' }}>*</span></label>
            <input
              className="form-input"
              type="text"
              placeholder="Ex: Dona Alzira, 78 anos"
              required
              value={form.name}
              onChange={e => setField('name', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Papel / Ocupação</label>
            <input
              className="form-input"
              type="text"
              placeholder="Ex: Associada há 10 anos, Voluntária..."
              value={form.role}
              onChange={e => setField('role', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Foto (URL)</label>
            <input
              className="form-input"
              type="url"
              placeholder="https://exemplo.com/foto.jpg"
              value={form.avatar}
              onChange={e => setField('avatar', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Depoimento <span style={{ color: '#DC2626' }}>*</span></label>
            <textarea
              className="form-input"
              rows={5}
              placeholder="Conte como a associação impactou a vida desta pessoa..."
              required
              value={form.text}
              onChange={e => setField('text', e.target.value)}
              style={{ resize: 'vertical', lineHeight: 1.6 }}
            />
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-pill" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary">
              <CheckCircle size={15} /> {item ? 'Salvar Alterações' : 'Adicionar Depoimento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── PAINEL: CONFIGURAÇÕES ─────────────────────────────────────────────────────
function TabSettings() {
  const { brandInfo, updateBrandInfo } = useData();
  const [form, setForm] = useState({ ...brandInfo });
  const setField = (key, val) => setForm(p => ({ ...p, [key]: val }));

  return (
    <div>
      <h2 className="admin-section-title">Configurações</h2>
      <p style={{ color:'var(--text-subtle)', marginBottom:28, fontSize:'0.95rem' }}>Informações da Associação.</p>

      <div style={{ background:'#fff', border:'1px solid #DCE7E5', borderRadius:16, padding:28, maxWidth: 640 }}>
        <h3 style={{ fontFamily:'var(--font-serif)', fontSize:'1.1rem', marginBottom:20, display:'flex', alignItems:'center', gap:8 }}>
          <Settings size={18} color="#2A5C66" /> Informações da Associação
        </h3>
        <div className="form-group">
          <label className="form-label">E-mail de Contato</label>
          <input className="form-input" type="email" value={form.email || ''} onChange={e => setField('email', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Telefone</label>
          <input className="form-input" type="tel" value={form.phone || ''} onChange={e => setField('phone', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Endereço</label>
          <input className="form-input" type="text" value={form.address || ''} onChange={e => setField('address', e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Chave PIX para Doações</label>
          <input className="form-input" type="text" value={form.pixKey || ''} onChange={e => setField('pixKey', e.target.value)} />
        </div>
        <button className="btn btn-primary" onClick={() => updateBrandInfo(form)}>
          <CheckCircle size={15} /> Salvar Informações
        </button>
      </div>
    </div>
  );
}

// ── PAINEL: ADMINISTRADORES (INTEGRADO AO BACKEND) ─────────────────────────────
function TabAdmins({ onNavigateToCreate }) {
  const { admins, fetchAdmins, addAdmin, updateAdmin, deleteAdmin, backendConnected } = useData();
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [form, setForm] = useState({ username: '', cpf: '', senha: '' });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (backendConnected) {
      fetchAdmins();
    }
  }, [backendConnected]);

  const handleOpenCreate = () => {
    if (onNavigateToCreate) {
      onNavigateToCreate();
    } else {
      setEditingAdmin(null);
      setForm({ username: '', cpf: '', senha: '' });
      setShowModal(true);
    }
  };

  const handleOpenEdit = (admin) => {
    setEditingAdmin(admin);
    setForm({ username: admin.username, cpf: admin.cpf || '', senha: '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username.trim()) return;
    setLoading(true);
    try {
      if (editingAdmin) {
        await updateAdmin(editingAdmin.id, {
          username: form.username.trim(),
          senha: form.senha.trim() || undefined
        });
      } else {
        await addAdmin({
          username: form.username.trim(),
          cpf: form.cpf.trim(),
          senha: form.senha.trim() || undefined
        });
      }
      setShowModal(false);
      setEditingAdmin(null);
      setForm({ username: '', cpf: '', senha: '' });
    } catch (_) {}
    finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <div>
          <h2 className="admin-section-title">Administradores do Sistema</h2>
          <p style={{ color:'var(--text-subtle)', fontSize:'0.9rem' }}>
            Gerenciamento de contas com permissão de acesso à área administrativa (via rota /admin).
          </p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenCreate}>
          <Plus size={16} /> Novo Administrador
        </button>
      </div>

      <div style={{ background: backendConnected ? '#F0FDF4' : '#FEF3C7', border: `1px solid ${backendConnected ? '#BBF7D0' : '#FDE68A'}`, borderRadius: 12, padding: '12px 16px', marginBottom: 24, display:'flex', alignItems:'center', gap:10 }}>
        <span style={{ fontSize:'1.1rem' }}>{backendConnected ? '🟢' : '🟠'}</span>
        <div style={{ fontSize:'0.85rem', color: backendConnected ? '#166534' : '#92400E' }}>
          <strong>{backendConnected ? 'Backend Conectado' : 'Atenção: Backend Offline'}</strong> — {backendConnected ? 'Contas de administrador são validadas com token JWT e senhas criptografadas no MySQL.' : 'Inicie o servidor backend (porta 3000) e o MySQL para gerenciar e autenticar administradores reais.'}
        </div>
      </div>

      {admins.length === 0 ? (
        <div style={{ textAlign:'center', padding:'48px 20px', background:'#fff', border:'1px solid #DCE7E5', borderRadius:14 }}>
          <UserCheck size={36} color="#8E9696" style={{ margin:'0 auto 12px', display:'block' }} />
          <h4 style={{ fontWeight:700, fontSize:'1rem', marginBottom:6 }}>Nenhum administrador listado no momento</h4>
          <p style={{ fontSize:'0.85rem', color:'var(--text-subtle)', marginBottom:0 }}>
            {backendConnected ? 'Você pode cadastrar o primeiro administrador da associação clicando no botão acima.' : 'Conecte o backend para carregar os administradores do banco de dados.'}
          </p>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:14 }}>
          {admins.map(adm => (
            <div key={adm.id} style={{ background:'#fff', border:'1px solid #DCE7E5', borderRadius:14, padding:'18px 20px', boxShadow:'0 1px 4px rgba(27,37,39,0.04)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
                <div style={{ width:40, height:40, background:'linear-gradient(135deg, #2A5C66, #3D8A9A)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700 }}>
                  {adm.username.slice(0, 2).toUpperCase()}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:700, fontSize:'0.98rem', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{adm.username}</div>
                  <div style={{ fontSize:'0.75rem', color:'var(--text-subtle)' }}>CPF: {adm.cpf || 'Não informado'}</div>
                </div>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', borderTop:'1px solid #F0F4F3', paddingTop:12 }}>
                <span style={{ fontSize:'0.72rem', background:'#F5F9F8', padding:'3px 8px', borderRadius:6, color:'var(--text-subtle)' }}>ID #{adm.id}</span>
                <div style={{ display:'flex', gap:6 }}>
                  <button className="btn btn-pill" style={{ padding:'5px 12px', fontSize:'0.75rem' }} onClick={() => handleOpenEdit(adm)}>
                    <Pencil size={12} /> Editar
                  </button>
                  <button className="btn" style={{ padding:'5px 12px', fontSize:'0.75rem', background:'#FEF2F2', color:'#DC2626', border:'1px solid #FCA5A5' }} onClick={() => setDeleteTarget(adm)}>
                    <Trash2 size={12} /> Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)} role="dialog" aria-modal="true">
          <div className="modal-card" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <h3 style={{ fontFamily:'var(--font-serif)', fontSize:'1.2rem' }}>
                {editingAdmin ? 'Editar Administrador' : 'Novo Administrador'}
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background:'none', border:'none', cursor:'pointer' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Nome de Usuário / Login *</label>
                <input className="form-input" type="text" placeholder="Ex: coord.maria" required value={form.username} onChange={e => setForm(p => ({ ...p, username: e.target.value }))} autoFocus />
              </div>
              {!editingAdmin && (
                <div className="form-group">
                  <label className="form-label">CPF (com ou sem pontuação) *</label>
                  <input className="form-input" type="text" placeholder="Ex: 123.456.789-00" required value={form.cpf} onChange={e => setForm(p => ({ ...p, cpf: e.target.value }))} />
                </div>
              )}
              <div className="form-group">
                <label className="form-label">{editingAdmin ? 'Nova Senha (deixe em branco para manter a atual)' : 'Senha de Acesso (opcional - padrão: 8 primeiros dígitos do CPF)'}</label>
                <input className="form-input" type="password" placeholder="Mínimo 6 caracteres" minLength={6} value={form.senha} onChange={e => setForm(p => ({ ...p, senha: e.target.value }))} />
              </div>
              <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:20 }}>
                <button type="button" className="btn btn-pill" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  <CheckCircle size={14} /> {loading ? 'Salvando...' : (editingAdmin ? 'Salvar Alterações' : 'Cadastrar Administrador')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDeleteModal isOpen={!!deleteTarget} title={deleteTarget?.username} subtitle="Esta conta de administrador será excluída do banco de dados." onConfirm={async () => { await deleteAdmin(deleteTarget.id); setDeleteTarget(null); }} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}

// ── PÁGINA PRINCIPAL DO ADMIN ─────────────────────────────────────────────────
export default function AdminPage({ onClose }) {
  const { backendConnected, backendLoading, checkBackendConnection, fetchAdmins } = useData();
  const [isLoggedIn, setIsLoggedIn] = useState(() => adminApi.isAuthenticated());
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [submittingLogin, setSubmittingLogin] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

    // Lock body scroll when drawer is open
    useEffect(() => {
      if (mobileDrawerOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
      return () => { document.body.style.overflow = ''; };
    }, [mobileDrawerOpen]);

    // Close drawer on ESC key
    useEffect(() => {
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') setMobileDrawerOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const navItems = [
          { id: 'overview',        label: 'Visão Geral',         icon: LayoutGrid,    badge: null },
          { id: 'gallery',         label: 'Álbum de Lembranças', icon: Image,         badge: { text: '5 fotos', type: 'purple' } },
          { id: 'calendar',        label: 'Calendário & Ações',  icon: Calendar,      badge: { text: '10', type: 'gray' } },
          { id: 'admins',          label: 'Administradores',     icon: Users,         badge: null },
          { id: 'sponsors',        label: 'Patrocinadores & Apoio', icon: Building2,   badge: { text: '6', type: 'gray' } },
          { id: 'testimonials',    label: 'Depoimentos',         icon: Heart,         badge: null },
          { id: 'settings',        label: 'Configurações',       icon: Settings,      badge: null },
        ];

    const tabs = [
        { id: 'overview',        label: 'Visão Geral',              icon: <LayoutDashboard size={17} /> },
        { id: 'gallery',         label: 'Álbum de Lembranças',      icon: <Images size={17} /> },
        { id: 'calendar',        label: 'Calendário & Ações',       icon: <CalendarDays size={17} /> },
        { id: 'admins',          label: 'Administradores',          icon: <UserCheck size={17} /> },
        { id: 'sponsors',        label: 'Patrocinadores & Apoio',   icon: <Building2 size={17} /> },
        { id: 'testimonials',    label: 'Depoimentos',              icon: <HeartHandshake size={17} /> },
        { id: 'settings',        label: 'Configurações',            icon: <Settings size={17} /> },
      ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setSubmittingLogin(true);

    try {
      if (backendConnected) {
        await adminApi.login(username, password);
        await fetchAdmins();
        setIsLoggedIn(true);
      } else {
        // Modo demonstração quando offline
        setIsLoggedIn(true);
      }
    } catch (err) {
      setLoginError(err.message || 'Usuário ou senha inválidos no backend.');
    } finally {
      setSubmittingLogin(false);
    }
  };

  const handleLogout = () => {
    adminApi.logout();
    setIsLoggedIn(false);
  };

  // ── Tela de Login ──────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="admin-page admin-login-page">
        <div className="admin-login-card">
          <div style={{ textAlign:'center', marginBottom:28 }}>
            <div style={{ width:64, height:64, background:'linear-gradient(135deg, #2A5C66, #3D8A9A)', borderRadius:18, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 18px', boxShadow:'0 8px 24px rgba(42,92,102,0.25)' }}>
              <Shield size={30} color="#fff" />
            </div>
            <h1 style={{ fontFamily:'var(--font-serif)', fontSize:'1.8rem', color:'var(--text-main)', marginBottom:6 }}>
              Área do Administrador
            </h1>
            <p style={{ color:'var(--text-subtle)', fontSize:'0.92rem' }}>
              Acesso restrito à diretoria e equipe de coordenação.
            </p>
          </div>

          <div style={{
            display:'flex', alignItems:'center', justifyContent:'space-between',
            padding:'8px 14px', borderRadius:10, marginBottom:20,
            background: backendConnected ? '#ECFDF5' : '#FFFBEB',
            border: `1px solid ${backendConnected ? '#A7F3D0' : '#FDE68A'}`,
            fontSize:'0.82rem',
            color: backendConnected ? '#065F46' : '#92400E'
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ width:8, height:8, borderRadius:'50%', background: backendConnected ? '#10B981' : '#F59E0B' }} />
              <span>{backendConnected ? 'Backend Conectado (Porta 3000)' : 'Backend Offline (Modo Local)'}</span>
            </div>
            <button 
              onClick={() => checkBackendConnection(false)}
              style={{ background:'none', border:'none', cursor:'pointer', padding:2, color:'inherit', display:'flex', alignItems:'center', gap:4, textDecoration:'underline' }}
              title="Testar conexão com backend"
            >
              <RefreshCw size={12} className={backendLoading ? 'spin' : ''} />
              <span>Verificar</span>
            </button>
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Usuário / CPF</label>
              <input className="form-input" type="text" placeholder="Nome de usuário ou CPF"
                value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" required />
            </div>
            <div className="form-group">
              <label className="form-label">Senha</label>
              <input className="form-input" type="password" placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required />
            </div>
            {loginError && (
              <div style={{ background:'#FEF2F2', border:'1px solid #FCA5A5', color:'#DC2626', borderRadius:8, padding:'10px 14px', fontSize:'0.85rem', marginBottom:14, display:'flex', alignItems:'center', gap:8 }}>
                <AlertTriangle size={15} /> {loginError}
              </div>
            )}

            {!backendConnected && (
              <p style={{ fontSize:'0.82rem', color:'var(--text-subtle)', marginBottom:16, background:'#F5F9F8', padding:'10px 14px', borderRadius:8 }}>
                💡 <strong>Demonstração Local:</strong> Como o backend não foi detectado na porta 3000, você pode clicar em <em>Entrar no Painel</em> para acessar o modo local.
              </p>
            )}

            <button type="submit" className="btn btn-primary" disabled={submittingLogin} style={{ width:'100%', padding:'13px 20px', fontSize:'1rem' }}>
              {submittingLogin ? 'Autenticando...' : 'Entrar no Painel'}
            </button>
          </form>

          <button onClick={onClose} style={{ display:'block', textAlign:'center', margin:'16px auto 0', background:'none', border:'none', cursor:'pointer', color:'var(--text-subtle)', fontSize:'0.88rem', textDecoration:'underline' }}>
            ← Voltar ao site
          </button>
        </div>
      </div>
    );
  }

  // ── Dashboard ──────────────────────────────────────────────────────
  return (
    <div className="admin-page">
      {/* Topbar */}
      <header className="admin-topbar">
              <div style={{ display:'flex', alignItems:'center', gap:12, flex:1, minWidth:0 }}>
                <div style={{ width:36, height:36, background:'linear-gradient(135deg, #2A5C66, #3D8A9A)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <Shield size={18} color="#fff" />
                </div>
                <div style={{ minWidth:0 }}>
                  <div style={{ fontWeight:700, fontSize:'0.9rem', color:'var(--text-main)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>Painel Administrativo</div>
                  <div style={{ fontSize:'0.7rem', color:'var(--text-subtle)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>Associação Melhor Idade</div>
                </div>
              </div>

              <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap', justifyContent:'flex-end' }}>
                {/* Badge de status do backend */}
                          <div style={{
                            display:'inline-flex', alignItems:'center', gap:6, fontSize:'0.75rem', fontWeight:600,
                            padding:'4px 10px', borderRadius:99,
                            background: backendConnected ? '#ECFDF5' : '#FFFBEB',
                            color: backendConnected ? '#065F46' : '#92400E',
                            border: `1px solid ${backendConnected ? '#A7F3D0' : '#FDE68A'}`
                          }}>
                            <span style={{ width:8, height:8, borderRadius:'50%', background: backendConnected ? '#10B981' : '#F59E0B' }} />
                            <span>{backendConnected ? 'Backend Conectado' : 'Modo Local'}</span>
                            <button
                              onClick={() => checkBackendConnection(false)}
                              style={{ background:'none', border:'none', cursor:'pointer', padding:0, display:'flex', alignItems:'center', color:'inherit' }}
                              title="Recarregar status de conexão com backend"
                            >
                              <RefreshCw size={11} className={backendLoading ? 'spin' : ''} />
                            </button>
                          </div>

                          {/* Mobile menu button - hamburger */}
                          <button
                            className="admin-mobile-menu-btn"
                            onClick={() => setMobileDrawerOpen(true)}
                            style={{ display:'none', background:'none', border:'none', cursor:'pointer', padding:8, color:'var(--text-main)' }}
                            aria-label="Abrir menu de navegação"
                          >
                            <Menu size={22} />
                          </button>

                          {/* Desktop only: Ver Site and Sair buttons */}
                          <div className="admin-topbar-desktop-actions">
                            <button className="btn btn-pill" style={{ fontSize:'0.78rem', padding:'6px 12px' }} onClick={onClose}>
                              <ChevronRight size={12} /> Ver Site
                            </button>
                            <button className="btn" style={{ background:'#FEF2F2', color:'#DC2626', border:'1px solid #FCA5A5', fontSize:'0.78rem', padding:'6px 12px' }}
                              onClick={handleLogout}>
                              <LogOut size={12} /> Sair
                            </button>
                          </div>
              </div>
            </header>

      <div className="admin-layout">
        {/* Sidebar de Navegação */}
        <aside className="admin-sidebar" role="navigation" aria-label="Painel administrativo">
          <nav style={{ display:'flex', flexDirection:'column', gap:6, flex:1 }}>
            {tabs.map(tab => (
              <button key={tab.id} className={`admin-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                style={{ textAlign: 'left', padding: '12px 16px', fontSize: '0.9rem', gap: 12, justifyContent: 'flex-start', borderRadius: 10 }}>
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
          <div style={{ marginTop:'auto', padding:'16px 12px', borderTop:'1px solid #DCE7E5', width:'100%' }}>
            <div style={{ fontSize:'0.7rem', color:'var(--text-subtle)', lineHeight:1.6, textAlign:'center' }}>
              <strong style={{ display:'block', marginBottom:4 }}>Status da Integração:</strong>
              {backendConnected ? '🟢 Rotas do Backend Ativas (porta 3000)' : '🟠 Modo Armazenamento Local Ativo'}
            </div>
          </div>
        </aside>

        {/* Conteúdo Principal */}
                <main className="admin-content">
                  {activeTab === 'overview' && <TabOverview setActiveTab={setActiveTab} />}
                  {activeTab === 'gallery' && <TabGallery />}
                  {activeTab === 'calendar' && <TabCalendar />}
                  {activeTab === 'admins' && <TabAdmins onNavigateToCreate={() => setActiveTab('cadastrar-admin')} />}
                  {activeTab === 'cadastrar-admin' && (
                    <CadastroAdminPage onVoltar={() => setActiveTab('admins')} />
                  )}
                  {activeTab === 'sponsors' && <TabSponsors />}
                  {activeTab === 'testimonials' && <TabTestimonials />}
                  {activeTab === 'settings' && <TabSettings />}
                                  </main>
                        </div>

                        {/* Mobile Drawer Navigation */}
                                                {mobileDrawerOpen && (
                                                  <div className="admin-mobile-drawer-overlay" onClick={() => setMobileDrawerOpen(false)} aria-hidden="true">
                                                    <div className="admin-mobile-drawer" role="dialog" aria-modal="true" aria-label="Menu de navegação">
                                                      {/* Header do Drawer */}
                                                      <div className="admin-mobile-drawer-header">
                                                        <div className="admin-mobile-drawer-brand">
                                                          <div className="admin-mobile-drawer-brand-badge">M</div>
                                                          <div className="admin-mobile-drawer-brand-text">
                                                            <span className="admin-mobile-drawer-brand-title">Melhor Idade</span>
                                                            <span className="admin-mobile-drawer-brand-subtitle">PAINEL ADMINISTRATIVO</span>
                                                          </div>
                                                        </div>
                                                        <button className="admin-mobile-drawer-close" onClick={() => setMobileDrawerOpen(false)} aria-label="Fechar menu">
                                                          <X size={24} />
                                                        </button>
                                                      </div>

                                                      {/* Navegação */}
                                                      <nav className="admin-mobile-drawer-nav" role="navigation" aria-label="Menu administrativo">
                                                        {navItems.map(item => {
                                                          const Icon = item.icon;
                                                          const isActive = activeTab === item.id;
                                                          return (
                                                            <button
                                                              key={item.id}
                                                              className={`admin-mobile-nav-item ${isActive ? 'active' : ''}`}
                                                              onClick={() => { setActiveTab(item.id); setMobileDrawerOpen(false); }}
                                                            >
                                                              <Icon className="nav-icon" size={20} />
                                                              <span>{item.label}</span>
                                                              {item.badge && (
                                                                <span className={`nav-badge ${item.badge.type}`}>{item.badge.text}</span>
                                                              )}
                                                            </button>
                                                          );
                                                        })}
                                                      </nav>

                                                      <hr className="admin-mobile-drawer-divider" />

                                                      <div className="admin-mobile-drawer-footer">
                                                        <button 
                                                          className="admin-mobile-drawer-view-site"
                                                          onClick={() => { setMobileDrawerOpen(false); onClose(); }}
                                                        >
                                                          <ExternalLink size={18} /> Ver Site Público
                                                        </button>
                                                        <div className="admin-mobile-drawer-status-row">
                                                          <div className="admin-mobile-drawer-status">
                                                            <span className="admin-mobile-drawer-status-dot" aria-hidden="true"></span>
                                                            <span>Modo Local Ativo</span>
                                                          </div>
                                                          <button 
                                                            className="admin-mobile-drawer-logout"
                                                            onClick={handleLogout}
                                                          >
                                                            <LogOut size={18} /> Sair
                                                          </button>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                )}
                      </div>
                    );
                  }
