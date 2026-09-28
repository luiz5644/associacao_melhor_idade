import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { ChevronDown } from 'lucide-react';

const ITEMS_PER_PAGE = 6;

export default function TestimonialsPage() {
  const { testimonials, brandInfo } = useData();
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const allItems = testimonials || [];
  const visibleItems = allItems.slice(0, visibleCount);
  const hasMore = visibleCount < allItems.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => Math.min(prev + ITEMS_PER_PAGE, allItems.length));
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  return (
    <div className="testimonials-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <span className="section-tag">O QUE DIZEM NOSSOS IDOSOS</span>
          <h1 className="page-title">Vidas Transformadas pelo Carinho</h1>
          <p className="page-subtitle">
            Conheça histórias reais de quem encontrou uma nova família na {brandInfo?.name || 'Associação Melhor Idade'}.
          </p>
        </div>

        {/* Depoimentos Grid */}
        <div className="testimonials-grid">
          {visibleItems.map((testimonial) => (
            <article key={testimonial.id} className="testimonial-card">
              <div className="testimonial-avatar-wrap">
                <img
                  src={testimonial.avatar}
                  alt={`Foto de ${testimonial.name}`}
                  className="testimonial-avatar"
                  loading="lazy"
                />
              </div>
              <div className="testimonial-content">
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <strong className="testimonial-name">{testimonial.name}</strong>
                  <span className="testimonial-role">{testimonial.role}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Carregar mais */}
        {hasMore && (
          <div className="testimonials-load-more">
            <button className="btn btn-primary" onClick={handleLoadMore}>
              Carregar mais depoimentos
              <ChevronDown size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
