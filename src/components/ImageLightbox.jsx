import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImageLightbox({ photo, photosList, onClose, onSelectPhoto }) {
  if (!photo) return null;

  const currentIndex = photosList.findIndex((p) => p.id === photo.id);

  const handlePrev = (e) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      onSelectPhoto(photosList[currentIndex - 1]);
    } else {
      onSelectPhoto(photosList[photosList.length - 1]);
    }
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (currentIndex < photosList.length - 1) {
      onSelectPhoto(photosList[currentIndex + 1]);
    } else {
      onSelectPhoto(photosList[0]);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev(e);
      if (e.key === 'ArrowRight') handleNext(e);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, photosList]);

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="lightbox-card" onClick={(e) => e.stopPropagation()}>
        <button 
          className="modal-close-btn" 
          onClick={onClose} 
          style={{ top: '-40px', right: 0, background: 'rgba(255,255,255,0.2)', color: '#FFFFFF' }}
          aria-label="Fechar ampliação"
        >
          <X size={24} />
        </button>

        {/* Prev / Next buttons */}
        {photosList.length > 1 && (
          <>
            <button 
              onClick={handlePrev}
              style={{
                position: 'absolute',
                left: '-20px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.85)',
                border: 'none',
                borderRadius: '50%',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                zIndex: 10
              }}
              aria-label="Foto anterior"
            >
              <ChevronLeft size={24} color="#221E1C" />
            </button>

            <button 
              onClick={handleNext}
              style={{
                position: 'absolute',
                right: '-20px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.85)',
                border: 'none',
                borderRadius: '50%',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                zIndex: 10
              }}
              aria-label="Próxima foto"
            >
              <ChevronRight size={24} color="#221E1C" />
            </button>
          </>
        )}

        <img src={photo.image} alt={photo.title} className="lightbox-img" />

        <div className="lightbox-caption">
          <h4 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', marginBottom: '4px' }}>{photo.title}</h4>
          <p style={{ fontSize: '0.9rem', color: '#DFD8D3' }}>{photo.subtitle || photo.description}</p>
        </div>
      </div>
    </div>
  );
}
