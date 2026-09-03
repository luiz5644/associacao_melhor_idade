import React, { useState, useRef } from 'react';
import {
  Shield, LogOut, LayoutDashboard, Images, CalendarDays, Settings,
  Plus, Pencil, Trash2, X, CheckCircle, Users, CalendarCheck,
  HeartHandshake, Camera, Upload, Link, Clock, MapPin, Star,
  ChevronRight, Search, AlertTriangle, RotateCcw, ChevronDown
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { siteData } from '../data/mockData';

const CATEGORIES_GALLERY = ['Celebracoes', 'Forro', 'Coral', 'Viagens', 'Artes'];
const CATEGORIES_CALENDAR = ['Música', 'Coral', 'Lazer', 'Artes', 'Saúde', 'Dança', 'Festas'];
const CAT_LABEL = {
  Celebracoes: 'Celebrações', Forro: 'Forró', Coral: 'Coral',
  Viagens: 'Viagens e Passeios', Artes: 'Artes e Trabalhos Manuais'
};
const MONTHS = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

// ── Componente auxiliar: Badge de categoria ──────────────────────────────────
function CategoryBadge({ category }) {
  const colors = {
    Música: { bg: '#FDF6F0', text: '#B8621A', border: '#F8DFC2' },
    Coral: { bg: '#EAF4F6', text: '#2A5C66', border: '#D2ECF0' },
    Lazer: { bg: '#F0F9F5', text: '#3D6058', border: '#CBE8DF' },
    Artes: { bg: '#F5F0FB', text: '#7B5EA7', border: '#E2D4F5' },
    Saúde: { bg: '#EDFAF3', text: '#2D7A50', border: '#C8EDD8' },
    Dança: { bg: '#FDF5E6', text: '#B07812', border: '#F5DFA3' },
    Festas: { bg: '#FEF0F4', text: '#A0285A', border: '#F9C8D9' },
    Celebracoes: { bg: '#FEF0F4', text: '#A0285A', border: '#F9C8D9' },
    Forro: { bg: '#FDF6F0', text: '#B8621A', border: '#F8DFC2' },
    Viagens: { bg: '#EAF4F6', text: '#2A5C66', border: '#D2ECF0' },
  };
  const c = colors[category] || { bg: '#F5F9F8', text: '#4D4D4D', border: '#DCE7E5' };
  return (
    <span style={{ display:'inline-flex', alignItems:'center', fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.05em',
      background: c.bg, color: c.text, border: `1px solid ${c.border}`, borderRadius: 999, padding: '2px 10px', textTransform:'uppercase' }}>
      {CAT_LABEL[category] || category}
    </span>
  );
}

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
    category: item?.category || 'Celebracoes',
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
      category: form.category,
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

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            <div className="form-group">
              <label className="form-label">Data do Evento</label>
              <input className="form-input" type="date" value={form.date} onChange={e => setField('date', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Categoria</label>
              <select className="form-select" value={form.category} onChange={e => setField('category', e.target.value)}>
                {CATEGORIES_GALLERY.map(cat => <option key={cat} value={cat}>{CAT_LABEL[cat] || cat}</option>)}
              </select>
            </div>
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


// ── Formulário de Atividade (Calendário) ──────────────────────────────────────
function CalendarFormModal({ isOpen, item, onSave, onClose }) {
  const [form, setForm] = useState({
    title: item?.title || '',
    desc: item?.desc || '',
    day: item?.day || 1,
    month: item?.month !== undefined ? item.month : 9,
    year: item?.year || 2026,
    time: item?.time || '14:00',
    category: item?.category || 'Lazer',
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
      category: form.category,
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
            <CalendarDays size={18} /><span style={{ fontWeight:700, fontSize:'0.82rem', textTransform:'uppercase', letterSpacing:'0.08em' }}>Calendário de Atividades</span>
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
              <label className="form-label">Categoria</label>
              <select className="form-select" value={form.category} onChange={e => setField('category', e.target.value)}>
                {CATEGORIES_CALENDAR.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label"><MapPin size={13} style={{ verticalAlign:'middle', marginRight:4 }} />Local da Atividade</label>
            <input className="form-input" type="text" placeholder="Ex: Salão Nobre, Sala de Música, Pátio Externo..."
              value={form.location} onChange={e => setField('location', e.target.value)} />
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

// ── PAINEL: VISÃO GERAL ──────────────────────────────────────────────────────
function TabOverview({ setActiveTab }) {
  const { galleryItems, calendarEvents } = useData();
  const stats = [
    { icon: <Users size={22} color="#2A5C66" />, value: 248, label: 'Associados Ativos', bg: '#EAF4F6', border: '#D2ECF0' },
    { icon: <CalendarCheck size={22} color="#3D6058" />, value: calendarEvents.length, label: 'Atividades Agendadas', bg: '#F0F9F5', border: '#CBE8DF' },
    { icon: <Images size={22} color="#7B5EA7" />, value: galleryItems.length, label: 'Lembranças no Álbum', bg: '#F5F0FB', border: '#E2D4F5' },
    { icon: <HeartHandshake size={22} color="#E8A87C" />, value: 34, label: 'Voluntários', bg: '#FDF6F0', border: '#F8DFC2' }
  ];

  const upcomingEvents = [...calendarEvents]
    .sort((a, b) => { const da = a.year*10000+a.month*100+a.day, db = b.year*10000+b.month*100+b.day; return da-db; })
    .slice(0, 4);

  return (
    <div>
      <h2 className="admin-section-title">Visão Geral</h2>
      <p style={{ color:'var(--text-subtle)', marginBottom:28, fontSize:'0.95rem' }}>Resumo da atividade da Associação Melhor Idade.</p>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:16, marginBottom:32 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius:14, padding:'20px 18px' }}>
            <div style={{ marginBottom:10 }}>{s.icon}</div>
            <div style={{ fontSize:'2rem', fontWeight:800, color:'var(--text-main)', lineHeight:1 }}>{s.value}</div>
            <div style={{ fontSize:'0.8rem', color:'var(--text-subtle)', marginTop:6, fontWeight:600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Atalhos rápidos */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:32 }}>
        <div style={{ background:'#fff', border:'1px solid #DCE7E5', borderRadius:16, padding:24 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
            <div style={{ width:38, height:38, background:'#F5F0FB', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Images size={20} color="#7B5EA7" />
            </div>
            <h3 style={{ fontSize:'1rem', fontWeight:700 }}>Álbum de Lembranças</h3>
          </div>
          <p style={{ fontSize:'0.88rem', color:'var(--text-subtle)', marginBottom:16 }}>
            {galleryItems.length} lembranças cadastradas no álbum público.
          </p>
          <button className="btn btn-primary" style={{ fontSize:'0.85rem', padding:'8px 18px' }} onClick={() => setActiveTab('gallery')}>
            <Plus size={14} /> Adicionar Lembrança
          </button>
        </div>

        <div style={{ background:'#fff', border:'1px solid #DCE7E5', borderRadius:16, padding:24 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
            <div style={{ width:38, height:38, background:'#EAF4F6', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <CalendarDays size={20} color="#2A5C66" />
            </div>
            <h3 style={{ fontSize:'1rem', fontWeight:700 }}>Calendário de Atividades</h3>
          </div>
          <p style={{ fontSize:'0.88rem', color:'var(--text-subtle)', marginBottom:16 }}>
            {calendarEvents.length} atividades agendadas no calendário.
          </p>
          <button className="btn btn-primary" style={{ fontSize:'0.85rem', padding:'8px 18px' }} onClick={() => setActiveTab('calendar')}>
            <Plus size={14} /> Agendar Atividade
          </button>
        </div>
      </div>

      {/* Próximas atividades */}
      {upcomingEvents.length > 0 && (
        <div style={{ background:'#fff', border:'1px solid #DCE7E5', borderRadius:16, padding:24 }}>
          <h3 style={{ fontFamily:'var(--font-serif)', fontSize:'1.1rem', marginBottom:16 }}>Próximas Atividades Cadastradas</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {upcomingEvents.map(ev => (
              <div key={ev.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'10px 14px', background:'#F5F9F8', borderRadius:10 }}>
                <div style={{ textAlign:'center', minWidth:44, background:'#2A5C66', borderRadius:8, padding:'6px 4px', color:'#fff' }}>
                  <div style={{ fontSize:'1.1rem', fontWeight:800, lineHeight:1 }}>{ev.day}</div>
                  <div style={{ fontSize:'0.65rem', textTransform:'uppercase', letterSpacing:'0.05em' }}>{MONTHS[ev.month]?.slice(0,3)}</div>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:'0.92rem' }}>{ev.title}</div>
                  <div style={{ fontSize:'0.78rem', color:'var(--text-subtle)' }}>{ev.time} • {ev.location}</div>
                </div>
                <CategoryBadge category={ev.category} />
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
  const [filterCat, setFilterCat] = useState('Todos');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = galleryItems.filter(item => {
    const matchCat = filterCat === 'Todos' || item.category === filterCat;
    const matchSearch = !search || item.title.toLowerCase().includes(search.toLowerCase()) || item.description?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
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

      {/* Busca & Filtros */}
      <div style={{ display:'flex', gap:12, marginBottom:22, flexWrap:'wrap' }}>
        <div style={{ position:'relative', flex:'1 1 220px' }}>
          <Search size={15} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#8E9696' }} />
          <input className="form-input" style={{ paddingLeft:36 }} type="text"
            placeholder="Buscar por título ou descrição..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-select" style={{ flex:'0 0 auto' }} value={filterCat} onChange={e => setFilterCat(e.target.value)}>
          <option value="Todos">Todas as Categorias</option>
          {CATEGORIES_GALLERY.map(c => <option key={c} value={c}>{CAT_LABEL[c] || c}</option>)}
        </select>
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
                <div style={{ position:'absolute', top:8, right:8 }}>
                  <CategoryBadge category={item.category} />
                </div>
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
  const [filterCat, setFilterCat] = useState('Todas');
  const [filterMonth, setFilterMonth] = useState('Todos');
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = calendarEvents.filter(ev => {
    const matchCat = filterCat === 'Todas' || ev.category === filterCat;
    const matchMonth = filterMonth === 'Todos' || String(ev.month) === filterMonth;
    const matchSearch = !search || ev.title.toLowerCase().includes(search.toLowerCase()) || ev.desc?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchMonth && matchSearch;
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
          <h2 className="admin-section-title">Calendário de Atividades</h2>
          <p style={{ color:'var(--text-subtle)', fontSize:'0.9rem' }}>{calendarEvents.length} atividades cadastradas</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingEvent(null); setShowForm(true); }}>
          <Plus size={16} /> Nova Atividade
        </button>
      </div>

      {/* Busca & Filtros */}
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
        <select className="form-select" style={{ flex:'0 0 auto' }} value={filterCat} onChange={e => setFilterCat(e.target.value)}>
          <option value="Todas">Todas as Categorias</option>
          {CATEGORIES_CALENDAR.map(c => <option key={c} value={c}>{c}</option>)}
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
                  <CategoryBadge category={ev.category} />
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

// ── PAINEL: CONFIGURAÇÕES ─────────────────────────────────────────────────────
function TabSettings() {
  const { brandInfo, updateBrandInfo, resetToDefaultData } = useData();
  const [form, setForm] = useState({ ...brandInfo });
  const [confirmReset, setConfirmReset] = useState(false);
  const setField = (key, val) => setForm(p => ({ ...p, [key]: val }));

  return (
    <div>
      <h2 className="admin-section-title">Configurações</h2>
      <p style={{ color:'var(--text-subtle)', marginBottom:28, fontSize:'0.95rem' }}>Informações da Associação e dados do sistema.</p>

      <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:24 }}>
        {/* Informações da Associação */}
        <div style={{ background:'#fff', border:'1px solid #DCE7E5', borderRadius:16, padding:28 }}>
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

        {/* Info de Backend & Backup */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div style={{ background:'#EAF4F6', border:'1px solid #D2ECF0', borderRadius:16, padding:22 }}>
            <h4 style={{ fontSize:'0.95rem', fontWeight:700, marginBottom:10, display:'flex', alignItems:'center', gap:8 }}>
              <Shield size={16} color="#2A5C66" /> Preparado para Backend
            </h4>
            <p style={{ fontSize:'0.82rem', color:'#3A6570', lineHeight:1.65 }}>
              Os dados estão salvos no <strong>LocalStorage</strong> do navegador e serão mantidos entre sessões.
              Quando o backend estiver pronto, as funções <code>addCalendarEvent</code>, <code>addGalleryItem</code> e demais CRUD precisarão apenas substituir o <code>localStorage</code> por chamadas <code>fetch('/api/...')</code>.
            </p>
            <div style={{ marginTop:12, background:'rgba(42,92,102,0.08)', borderRadius:8, padding:'10px 12px', fontFamily:'monospace', fontSize:'0.75rem', color:'#2A5C66', lineHeight:1.8 }}>
              POST /api/memories → addGalleryItem()<br/>
              PUT /api/memories/:id → updateGalleryItem()<br/>
              DELETE /api/memories/:id → deleteGalleryItem()<br/>
              POST /api/events → addCalendarEvent()<br/>
              PUT /api/events/:id → updateCalendarEvent()
            </div>
          </div>

          <div style={{ background:'#FEF9ED', border:'1px solid #FDE68A', borderRadius:16, padding:22 }}>
            <h4 style={{ fontSize:'0.95rem', fontWeight:700, marginBottom:10, display:'flex', alignItems:'center', gap:8 }}>
              <RotateCcw size={16} color="#92660A" /> Restaurar Dados Padrão
            </h4>
            <p style={{ fontSize:'0.82rem', color:'#92660A', lineHeight:1.65, marginBottom:14 }}>
              Apaga todos os cadastros feitos e restaura os dados originais de fábrica do sistema.
              <strong> Esta ação não pode ser desfeita.</strong>
            </p>
            <button className="btn" style={{ background:'#FBBF24', color:'#451A03', fontSize:'0.82rem', padding:'8px 14px' }}
              onClick={() => setConfirmReset(true)}>
              <RotateCcw size={13} /> Restaurar Tudo
            </button>
          </div>
        </div>
      </div>

      <ConfirmDeleteModal isOpen={confirmReset}
        title="Restaurar dados padrão?"
        subtitle="Todos os cadastros de lembranças e atividades serão removidos e os dados originais serão restaurados."
        onConfirm={() => { resetToDefaultData(); setConfirmReset(false); }}
        onCancel={() => setConfirmReset(false)} />
    </div>
  );
}

// ── PÁGINA PRINCIPAL DO ADMIN ─────────────────────────────────────────────────
export default function AdminPage({ onClose }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview',  label: 'Visão Geral',            icon: <LayoutDashboard size={17} /> },
    { id: 'gallery',   label: 'Álbum de Lembranças',    icon: <Images size={17} /> },
    { id: 'calendar',  label: 'Calendário & Atividades', icon: <CalendarDays size={17} /> },
    { id: 'settings',  label: 'Configurações',           icon: <Settings size={17} /> },
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    // Demo: qualquer usuário/senha funciona (lógica real no backend)
    setLoginError('');
    setIsLoggedIn(true);
  };

  // ── Tela de Login ──────────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="admin-page admin-login-page">
        <div className="admin-login-card">
          <div style={{ textAlign:'center', marginBottom:32 }}>
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

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Usuário</label>
              <input className="form-input" type="text" placeholder="admin@associacaomelhoridade.org"
                value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" />
            </div>
            <div className="form-group">
              <label className="form-label">Senha</label>
              <input className="form-input" type="password" placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
            </div>
            {loginError && (
              <div style={{ background:'#FEF2F2', border:'1px solid #FCA5A5', color:'#DC2626', borderRadius:8, padding:'10px 14px', fontSize:'0.85rem', marginBottom:14, display:'flex', alignItems:'center', gap:8 }}>
                <AlertTriangle size={15} /> {loginError}
              </div>
            )}
            <p style={{ fontSize:'0.82rem', color:'var(--text-subtle)', marginBottom:16, background:'#F5F9F8', padding:'10px 14px', borderRadius:8 }}>
              💡 <strong>Demonstração:</strong> Clique em <em>Entrar</em> diretamente para acessar o painel.
            </p>
            <button type="submit" className="btn btn-primary" style={{ width:'100%', padding:'13px 20px', fontSize:'1rem' }}>
              Entrar no Painel
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
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ width:40, height:40, background:'linear-gradient(135deg, #2A5C66, #3D8A9A)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <Shield size={20} color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight:800, fontSize:'0.97rem', color:'var(--text-main)' }}>Painel Administrativo</div>
            <div style={{ fontSize:'0.73rem', color:'var(--text-subtle)' }}>Associação Melhor Idade</div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ fontSize:'0.82rem', color:'var(--text-subtle)', padding:'6px 14px', background:'#F5F9F8', borderRadius:99, border:'1px solid #DCE7E5' }}>
            👤 Coordenação — {siteData.brand.name}
          </div>
          <button className="btn btn-pill" style={{ fontSize:'0.82rem' }} onClick={onClose}>
            <ChevronRight size={14} /> Ver Site
          </button>
          <button className="btn" style={{ background:'#FEF2F2', color:'#DC2626', border:'1px solid #FCA5A5', fontSize:'0.82rem', padding:'8px 14px' }}
            onClick={() => setIsLoggedIn(false)}>
            <LogOut size={13} /> Sair
          </button>
        </div>
      </header>

      <div className="admin-layout">
        {/* Sidebar de Navegação */}
        <aside className="admin-sidebar">
          <nav>
            {tabs.map(tab => (
              <button key={tab.id} className={`admin-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}>
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
          <div style={{ marginTop:'auto', padding:'20px 16px', borderTop:'1px solid #DCE7E5' }}>
            <div style={{ fontSize:'0.73rem', color:'var(--text-subtle)', lineHeight:1.6 }}>
              <strong style={{ display:'block', marginBottom:4 }}>Dados salvos em:</strong>
              LocalStorage do navegador<br/>
              Pronto para integrar com backend
            </div>
          </div>
        </aside>

        {/* Conteúdo Principal */}
        <main className="admin-content">
          {activeTab === 'overview' && <TabOverview setActiveTab={setActiveTab} />}
          {activeTab === 'gallery' && <TabGallery />}
          {activeTab === 'calendar' && <TabCalendar />}
          {activeTab === 'settings' && <TabSettings />}
        </main>
      </div>
    </div>
  );
}
