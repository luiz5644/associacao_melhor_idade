import React, { useState } from 'react';
import { siteData } from '../data/mockData';

export default function GalleryPage({ onSelectPhoto }) {
  const { gallery } = siteData;
  const [activeCategory, setActiveCategory] = useState('Todos');

  const filteredPhotos = activeCategory === 'Todos'
    ? gallery.items
    : gallery.items.filter(item => {
        if (activeCategory === 'Forro') return item.category === 'Forro';
        if (activeCategory === 'Coral') return item.category === 'Coral';
        if (activeCategory === 'Viagens') return item.category === 'Viagens';
        if (activeCategory === 'Celebracoes') return item.category === 'Celebracoes';
        return true;
      });

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
            {gallery.categories.map((cat) => (
              <button
                key={cat.id}
                className={`filter-pill ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Photos Grid */}
        <div className="gallery-grid">
          {filteredPhotos.map((photo) => (
            <div 
              key={photo.id} 
              className="gallery-card"
              onClick={() => onSelectPhoto(photo)}
              title="Clique para ver em tela cheia"
            >
              <div className="gallery-img-wrap">
                <img src={photo.image} alt={photo.title} className="gallery-img" />
              </div>
              <div className="gallery-info">
                <h3 className="gallery-title">{photo.title}</h3>
                <p className="gallery-date">{photo.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
