import React from 'react';
import { X, Clock, Calendar, MapPin, User, Info } from 'lucide-react';

export default function ScheduleModal({ activity, onClose }) {
  if (!activity) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Fechar modal">
          <X size={20} />
        </button>

        <div className="modal-header">
          <span className="section-tag" style={{ marginBottom: '8px' }}>{activity.categoryTag}</span>
          <h3 className="modal-title">{activity.title}</h3>
          <p className="modal-subtitle">{activity.description}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', margin: '20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#F5F9F8', padding: '12px 16px', borderRadius: '10px' }}>
            <Calendar size={20} color="#2A5C66" />
            <div>
              <strong style={{ display: 'block', fontSize: '0.85rem', color: '#6E6E6E' }}>Dias de Encontro</strong>
              <span style={{ fontWeight: 600, color: '#1B2527' }}>{activity.schedule.days}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#F5F9F8', padding: '12px 16px', borderRadius: '10px' }}>
            <Clock size={20} color="#2A5C66" />
            <div>
              <strong style={{ display: 'block', fontSize: '0.85rem', color: '#6E6E6E' }}>Horário</strong>
              <span style={{ fontWeight: 600, color: '#1B2527' }}>{activity.schedule.time}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#F5F9F8', padding: '12px 16px', borderRadius: '10px' }}>
            <MapPin size={20} color="#2A5C66" />
            <div>
              <strong style={{ display: 'block', fontSize: '0.85rem', color: '#6E6E6E' }}>Local</strong>
              <span style={{ fontWeight: 600, color: '#1B2527' }}>{activity.schedule.location}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#F5F9F8', padding: '12px 16px', borderRadius: '10px' }}>
            <User size={20} color="#2A5C66" />
            <div>
              <strong style={{ display: 'block', fontSize: '0.85rem', color: '#6E6E6E' }}>Instrutor / Responsável</strong>
              <span style={{ fontWeight: 600, color: '#1B2527' }}>{activity.schedule.instructor}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', background: '#EAF5F2', padding: '14px 16px', borderRadius: '10px', borderLeft: '4px solid #2A5C66' }}>
            <Info size={20} color="#2A5C66" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ display: 'block', fontSize: '0.85rem', color: '#2A5C66' }}>Orientações e Participação</strong>
              <span style={{ fontSize: '0.92rem', color: '#4D4D4D' }}>{activity.schedule.details}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
          <button className="btn btn-primary" onClick={onClose} style={{ width: '100%' }}>
            Entendido, quero participar!
          </button>
        </div>
      </div>
    </div>
  );
}
