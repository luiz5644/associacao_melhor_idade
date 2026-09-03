import React, { useState, useEffect, useCallback } from 'react';
import { siteData } from '../data/mockData';
import { useData } from '../context/DataContext';
import { X, ChevronLeft, ChevronRight, Images, Calendar, Tag } from 'lucide-react';

const CAT_LABEL = {
  Celebracoes: 'Celebrações', Forro: 'Forró', Coral: 'Coral',
  Viagens: 'Viagens e Passeios', Artes: 'Artes e Trabalhos Manuais', Todos: 'Todos os Momentos'
};

// ── Modal de Detalhes da Lembrança com Carrossel ──────────────────────────────
function MemoryDetailModal({ memory, onClose }) {
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);

  const photos = memory?.photos?.length > 0
    ? memory.photos
    : memory?.image ? [memory.image] : [];

  const hasPrev = currentPhotoIdx > 0;
  const hasNext = currentPhotoIdx < photos.length - 1;

  const goPrev = useCallback(() => {
    if (hasPrev) setCurrentPhotoIdx(i => i - 1);
  }, [hasPrev]);

  const goNext = useCallback(() => {
    if (hasNext) setCurrentPhotoIdx(i => i + 1);
  }, [hasNext]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goPrev, goNext, onClose]);

  // Reset ao trocar de lembrança
  useEffect(() => {
    setCurrentPhotoIdx(0);
  }, [memory?.id]);

  if (!memory) return null;

  // Formata data
  const formattedDate = memory.date
    ? new Date(memory.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    : memory.subtitle || '';

  return (
    <div className="modal-overlay memory-detail-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={memory.title}>
      <div className="memory-detail-modal" onClick={e => e.stopPropagation()}>
        {/* Botão fechar */}
        <button
          className="memory-detail-close"
          onClick={onClose}
          aria-label="Fechar"
        >
          <X size={22} />
        </button>

        {/* ─── Área de Fotos ─────────────────────────────── */}
        <div className="memory-photo-area">
          {/* Foto Principal */}
          <div className="memory-main-photo">
            {photos.length > 0 ? (
              <img
                key={currentPhotoIdx}
                src={photos[currentPhotoIdx]}
                alt={`${memory.title} — foto ${currentPhotoIdx + 1} de ${photos.length}`}
                className="memory-main-img"
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1516307365426-bea591f05011?q=80&w=900'; }}
              />
            ) : (
              <div className="memory-no-photo">
                <Images size={48} style={{ opacity: 0.3, display: 'block', margin: '0 auto 8px' }} />
                <p>Sem fotos cadastradas</p>
              </div>
            )}

            {/* Contador de fotos */}
            {photos.length > 1 && (
              <div className="memory-photo-counter">
                {currentPhotoIdx + 1} / {photos.length}
              </div>
            )}

            {/* Setas de navegação */}
            {photos.length > 1 && (
              <>
                <button
                  className={`memory-nav-btn memory-nav-prev ${!hasPrev ? 'disabled' : ''}`}
                  onClick={goPrev}
                  disabled={!hasPrev}
                  aria-label="Foto anterior"
                >
                  <ChevronLeft size={26} />
                </button>
                <button
                  className={`memory-nav-btn memory-nav-next ${!hasNext ? 'disabled' : ''}`}
                  onClick={goNext}
                  disabled={!hasNext}
                  aria-label="Próxima foto"
                >
                  <ChevronRight size={26} />
                </button>
              </>
            )}
          </div>

          {/* Miniaturas */}
          {photos.length > 1 && (
            <div className="memory-thumbnails">
              {photos.map((src, idx) => (
                <button
                  key={idx}
                  className={`memory-thumb ${idx === currentPhotoIdx ? 'active' : ''}`}
                  onClick={() => setCurrentPhotoIdx(idx)}
                  aria-label={`Ver foto ${idx + 1}`}
                >
                  <img
                    src={src}
                    alt={`Miniatura ${idx + 1}`}
                    onError={e => { e.target.style.background = '#DDD'; }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ─── Informações da Lembrança ──────────────────── */}
        <div className="memory-info-panel">
          <div>
            {/* Tag de categoria */}
            <span className="memory-category-tag">
              <Tag size={11} />
              {CAT_LABEL[memory.category] || memory.category || 'Lembrança'}
            </span>

            <h2 className="memory-detail-title">{memory.title}</h2>

            {formattedDate && (
              <div className="memory-detail-date">
                <Calendar size={14} />
                <span>{formattedDate}</span>
              </div>
            )}

            {memory.description && (
              <p className="memory-detail-desc">{memory.description}</p>
            )}

            {photos.length > 1 && (
              <div className="memory-photo-count-info">
                <Images size={14} />
                <span>{photos.length} fotos nesta lembrança</span>
              </div>
            )}
          </div>

          <button className="btn btn-pill memory-close-btn" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Página de Galeria ─────────────────────────────────────────────────────────
export default function GalleryPage({ onSelectPhoto }) {
  const { gallery } = siteData;
  const { galleryItems } = useData();
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [selectedMemory, setSelectedMemory] = useState(null);

  const filteredPhotos = activeCategory === 'Todos'
    ? galleryItems
    : galleryItems.filter(item => item.category === activeCategory);

  // Monta categorias únicas a partir dos itens reais
  const allCategories = ['Todos', ...new Set(galleryItems.map(item => item.category))];

  return (
    <div className="gallery-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <span className="section-tag">{gallery.tag}</span>
          <h1 className="page-title">{gallery.title}</h1>
          <p className="page-subtitle">{gallery.subtitle}</p>
        </div>

        {/* Filter Pills Bar */}
        <div className="gallery-filter-bar">
          <div className="filter-pills-row">
            {allCategories.map((catId) => (
              <button
                key={catId}
                className={`filter-pill ${activeCategory === catId ? 'active' : ''}`}
                onClick={() => setActiveCategory(catId)}
              >
                {CAT_LABEL[catId] || catId}
              </button>
            ))}
          </div>
        </div>

        {/* Contador */}
        <p style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', marginBottom: 20 }}>
          {filteredPhotos.length} {filteredPhotos.length === 1 ? 'lembrança' : 'lembranças'}
        </p>

        {/* Photos Grid */}
        {filteredPhotos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-subtle)' }}>
            <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Nenhuma lembrança nesta categoria ainda.</p>
            <p style={{ fontSize: '0.9rem', marginTop: 8 }}>O administrador pode adicionar fotos no painel de gestão.</p>
          </div>
        ) : (
          <div className="gallery-grid">
            {filteredPhotos.map((photo) => {
              const photoCount = photo.photos?.length || (photo.image ? 1 : 0);
              return (
                <div
                  key={photo.id}
                  className="gallery-card"
                  onClick={() => setSelectedMemory(photo)}
                  title="Clique para ver as fotos desta lembrança"
                  style={{ cursor: 'pointer' }}
                >
                  <div className="gallery-img-wrap">
                    <img src={photo.image} alt={photo.title} className="gallery-img" />
                    {/* Badge de múltiplas fotos */}
                    {photoCount > 1 && (
                      <div style={{
                        position: 'absolute', top: 10, right: 10,
                        background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
                        color: '#fff', borderRadius: 999,
                        padding: '3px 10px', fontSize: '0.72rem', fontWeight: 700,
                        display: 'flex', alignItems: 'center', gap: 4
                      }}>
                        <Images size={11} /> {photoCount} fotos
                      </div>
                    )}
                  </div>
                  <div className="gallery-info">
                    <h3 className="gallery-title">{photo.title}</h3>
                    <p className="gallery-date">{photo.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de Detalhes da Lembrança */}
      {selectedMemory && (
        <MemoryDetailModal
          memory={selectedMemory}
          onClose={() => setSelectedMemory(null)}
        />
      )}
    </div>
  );
}
