import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { siteData } from '../data/mockData';
import { useData } from '../context/DataContext';
import { X, ChevronLeft, ChevronRight, Images, Calendar, Search } from 'lucide-react';
import {
  filterAlbums,
  findOtherYearAlbums,
  formatPhotoCount,
  getAlbumCover,
  getAlbumYearLabel,
  getYearGroups,
  groupAlbumsByYear,
} from '../utils/gallery';

function readYearFromUrl() {
  try {
    const raw = new URLSearchParams(window.location.search).get('ano');
    if (!raw) return 'all';
    if (raw === 'sem-data') return 'sem-data';
    return /^\d{4}$/.test(raw) ? raw : 'all';
  } catch {
    return 'all';
  }
}

function countLabel(count) {
  return `${count} ${count === 1 ? 'lembrança' : 'lembranças'}`;
}

// ── Modal de Detalhes da Lembrança com Carrossel ──────────────────────────────
function MemoryDetailModal({ memory, onClose, otherYearAlbums = [], onSelectMemory }) {
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
                loading="eager"
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
                    onError={e => { e.target.style.background = '#E2E8F0'; }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ─── Informações da Lembrança ──────────────────── */}
        <div className="memory-info-panel">
          <div>
            <h2 id="memory-detail-title" className="memory-detail-title">{memory.title}</h2>

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

            {otherYearAlbums.length > 0 && (
              <div className="memory-other-years">
                <h3 className="memory-other-years-title">Outros anos deste evento</h3>
                <div className="memory-other-years-list">
                  {otherYearAlbums.map((album) => {
                    const yearLabel = getAlbumYearLabel(album);
                    return (
                      <button
                        key={album.id || album.apiId}
                        type="button"
                        className="memory-year-chip"
                        onClick={() => onSelectMemory?.(album)}
                        aria-label={`Abrir lembrança ${album.title}, ${yearLabel}`}
                      >
                        {yearLabel}
                      </button>
                    );
                  })}
                </div>
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
export default function GalleryPage() {
  const { gallery } = siteData;
  const { galleryItems, galleryLoading, galleryError, reloadGallery } = useData();
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [selectedYear, setSelectedYear] = useState(readYearFromUrl);
  const [searchInput, setSearchInput] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');

  // Mantém a URL explícita (?pagina=galeria) mesmo quando o link chega só com ?ano=.
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.get('pagina') !== 'galeria') {
        url.searchParams.set('pagina', 'galeria');
        window.history.replaceState({}, '', url);
      }
    } catch {
      // Ambiente sem History API: o filtro continua funcionando por estado.
    }
  }, []);

  // Botão "voltar" do navegador: relê o ano da URL.
  useEffect(() => {
    const handlePopState = () => setSelectedYear(readYearFromUrl());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const publicGalleryItems = useMemo(
    () => galleryItems.filter(item => item.photos?.length > 0),
    [galleryItems]
  );

  const yearGroups = useMemo(() => getYearGroups(publicGalleryItems), [publicGalleryItems]);
  const filteredItems = useMemo(
    () => filterAlbums(publicGalleryItems, { year: selectedYear, query: appliedSearch }),
    [publicGalleryItems, selectedYear, appliedSearch]
  );
  const groupedItems = useMemo(() => groupAlbumsByYear(filteredItems), [filteredItems]);
  const otherYearAlbums = useMemo(
    () => findOtherYearAlbums(publicGalleryItems, selectedMemory),
    [publicGalleryItems, selectedMemory]
  );

  const handleSelectYear = (value) => {
    if (value === selectedYear) return;
    setSelectedYear(value);

    try {
      const url = new URL(window.location.href);
      url.searchParams.set('pagina', 'galeria');
      if (value === 'all') {
        url.searchParams.delete('ano');
      } else {
        url.searchParams.set('ano', value);
      }
      window.history.pushState({}, '', url);
    } catch {
      // A filtragem por estado continua funcionando.
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setAppliedSearch(searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setAppliedSearch('');
  };

  const handleRetry = () => {
    reloadGallery().catch(() => {});
  };

  const emptyMessage = (() => {
    const query = appliedSearch.trim();
    if (query) {
      return selectedYear === 'all'
        ? `Nenhuma lembrança encontrada para “${query}”.`
        : `Nenhuma lembrança encontrada para “${query}”${selectedYear === 'sem-data' ? ' em Sem data' : ` em ${selectedYear}`}.`;
    }
    if (selectedYear === 'sem-data') return 'Nenhuma lembrança sem data.';
    if (selectedYear === 'all') return 'Nenhuma lembrança cadastrada ainda.';
    return 'Nenhuma lembrança neste ano ainda.';
  })();

  return (
    <div className="gallery-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <span className="section-tag">{gallery.tag}</span>
          <h1 className="page-title">{gallery.title}</h1>
          <p className="page-subtitle">{gallery.subtitle}</p>
        </div>

        <section className="gallery-filter-bar" aria-label="Filtrar e buscar lembranças">
          <div className="gallery-year-filter" role="group" aria-label="Filtrar lembranças por ano">
            <button
              type="button"
              className={`gallery-year-btn ${selectedYear === 'all' ? 'is-selected' : ''}`}
              aria-pressed={selectedYear === 'all'}
              onClick={() => handleSelectYear('all')}
            >
              {selectedYear === 'all' && <span className="gallery-filter-check" aria-hidden="true">✓</span>}
              <span>Todos</span>
              <span className="gallery-filter-count">{yearGroups.total}</span>
            </button>

            {yearGroups.years.map(({ value, label, count }) => (
              <button
                key={value}
                type="button"
                className={`gallery-year-btn ${selectedYear === value ? 'is-selected' : ''}`}
                aria-pressed={selectedYear === value}
                aria-label={`${label}, ${countLabel(count)}`}
                onClick={() => handleSelectYear(value)}
              >
                {selectedYear === value && <span className="gallery-filter-check" aria-hidden="true">✓</span>}
                <span>{label}</span>
                <span className="gallery-filter-count">{count}</span>
              </button>
            ))}

            {yearGroups.undatedCount > 0 && (
              <button
                type="button"
                className={`gallery-year-btn ${selectedYear === 'sem-data' ? 'is-selected' : ''}`}
                aria-pressed={selectedYear === 'sem-data'}
                aria-label={`Sem data, ${countLabel(yearGroups.undatedCount)}`}
                onClick={() => handleSelectYear('sem-data')}
              >
                {selectedYear === 'sem-data' && <span className="gallery-filter-check" aria-hidden="true">✓</span>}
                <span>Sem data</span>
                <span className="gallery-filter-count">{yearGroups.undatedCount}</span>
              </button>
            )}
          </div>

          <form className="gallery-search" role="search" onSubmit={handleSearch}>
            <label className="gallery-search-label" htmlFor="gallery-search-input">
              Buscar lembrança pelo título
            </label>
            <div className="gallery-search-row">
              <input
                id="gallery-search-input"
                className="form-input gallery-search-input"
                type="search"
                autoComplete="off"
                placeholder="Ex.: Natal"
                value={searchInput}
                onChange={event => setSearchInput(event.target.value)}
              />
              <button type="submit" className="btn btn-primary gallery-search-btn">
                <Search size={18} aria-hidden="true" /> Buscar
              </button>
              <button type="button" className="btn btn-pill gallery-search-btn" onClick={handleClearSearch}>
                <X size={18} aria-hidden="true" /> Limpar
              </button>
            </div>
          </form>
        </section>

        {galleryLoading ? (
          <>
            <p className="gallery-loading-text" role="status">Carregando lembranças...</p>
            <div className="gallery-grid" aria-hidden="true">
              {[0, 1, 2, 3, 4, 5].map((item) => (
                <div className="gallery-skeleton-card" key={item}>
                  <div className="gallery-skeleton-img" />
                  <div className="gallery-skeleton-info">
                    <span className="gallery-skeleton-line gallery-skeleton-line-short" />
                    <span className="gallery-skeleton-line" />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : galleryError ? (
          <div className="gallery-feedback" role="alert">
            <Images size={40} aria-hidden="true" />
            <h2 className="gallery-feedback-title">Não foi possível carregar as lembranças</h2>
            <p>{galleryError}</p>
            <button type="button" className="btn btn-primary gallery-retry-btn" onClick={handleRetry}>
              Tentar novamente
            </button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="gallery-feedback gallery-empty" role="status">
            <Images size={40} aria-hidden="true" />
            <h2 className="gallery-feedback-title">{emptyMessage}</h2>
            {(appliedSearch || selectedYear !== 'all') && (
              <button
                type="button"
                className="btn btn-pill gallery-retry-btn"
                onClick={() => { handleClearSearch(); handleSelectYear('all'); }}
              >
                Ver todas as lembranças
              </button>
            )}
          </div>
        ) : (
          <>
            <p className="gallery-results-summary" role="status" aria-live="polite">
              Mostrando {countLabel(filteredItems.length)}
              {selectedYear === 'sem-data' ? ' sem data' : selectedYear === 'all' ? '' : ` de ${selectedYear}`}
              {appliedSearch.trim() ? ` para “${appliedSearch.trim()}”` : ''}.
            </p>

            {groupedItems.map((group) => (
              <section
                key={group.key}
                className="gallery-year-section"
                aria-labelledby={`gallery-year-${group.key}`}
              >
                <h2 className="gallery-year-heading" id={`gallery-year-${group.key}`}>
                  <span>{group.label}</span>
                  <span className="gallery-year-heading-count">{countLabel(group.albums.length)}</span>
                </h2>

                <ul className="gallery-grid gallery-list">
                  {group.albums.map((album) => {
                    const photoCount = album.photos?.length || (album.image ? 1 : 0);
                    const yearLabel = getAlbumYearLabel(album);
                    const cover = getAlbumCover(album);

                    return (
                      <li key={album.id || album.apiId} className="gallery-list-item">
                        <button
                          type="button"
                          className="gallery-card gallery-card-button"
                          onClick={() => setSelectedMemory(album)}
                          aria-label={`Abrir lembrança ${album.title}, ${yearLabel}, ${formatPhotoCount(photoCount)}`}
                        >
                          <span className="gallery-img-wrap">
                            <img
                              src={cover}
                              alt={`${album.title} — ${yearLabel}`}
                              className="gallery-img"
                              width="400"
                              height="300"
                              loading="lazy"
                              decoding="async"
                              onError={e => { e.currentTarget.style.visibility = 'hidden'; }}
                            />
                            <span className="gallery-year-badge">{yearLabel}</span>
                            {photoCount > 1 && (
                              <span className="gallery-photo-badge">
                                <Images size={14} aria-hidden="true" /> {photoCount} fotos
                              </span>
                            )}
                          </span>

                          <span className="gallery-info">
                            <span className="gallery-title">{album.title}</span>
                            {album.subtitle && <span className="gallery-date">{album.subtitle}</span>}
                            <span className="gallery-count">{formatPhotoCount(photoCount)}</span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </>
        )}
      </div>

      {/* Modal de Detalhes da Lembrança */}
      {selectedMemory && (
        <MemoryDetailModal
          memory={selectedMemory}
          otherYearAlbums={otherYearAlbums}
          onSelectMemory={setSelectedMemory}
          onClose={() => setSelectedMemory(null)}
        />
      )}
    </div>
  );
}
