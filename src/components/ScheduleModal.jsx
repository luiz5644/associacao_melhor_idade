import React from 'react';
import { X, Clock, Calendar, MapPin, User, Info } from 'lucide-react';

export default function ScheduleModal({ activity, onClose }) {
  if (!activity) return null;
  const weekdayLabels = {
    domingo: 'Domingo', segunda: 'Segunda-feira', terca: 'Terça-feira', quarta: 'Quarta-feira',
    quinta: 'Quinta-feira', sexta: 'Sexta-feira', sabado: 'Sábado',
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Fechar modal">
          <X size={20} />
        </button>

        <div className="modal-header">
                  <h3 className="modal-title">{activity.title}</h3>
                  {activity.description && <p className="modal-subtitle">{activity.description}</p>}
                </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', margin: '20px 0' }}>
          {activity.schedule.days && <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#F7F9FB', padding: '12px 16px', borderRadius: '10px' }}>
            <Calendar size={20} color="#0F2A66" />
            <div>
              <strong style={{ display: 'block', fontSize: '0.85rem', color: '#475569' }}>Dia da semana</strong>
              <span style={{ fontWeight: 600, color: '#0B192C' }}>{weekdayLabels[activity.schedule.days] || activity.schedule.days}</span>
            </div>
          </div>}

          {activity.schedule.time && <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#F7F9FB', padding: '12px 16px', borderRadius: '10px' }}>
            <Clock size={20} color="#0F2A66" />
            <div>
              <strong style={{ display: 'block', fontSize: '0.85rem', color: '#475569' }}>Horário</strong>
              <span style={{ fontWeight: 600, color: '#0B192C' }}>{activity.schedule.time}</span>
            </div>
          </div>}

          {activity.schedule.location && <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#F7F9FB', padding: '12px 16px', borderRadius: '10px' }}>
            <MapPin size={20} color="#0F2A66" />
            <div>
              <strong style={{ display: 'block', fontSize: '0.85rem', color: '#475569' }}>Local</strong>
              <span style={{ fontWeight: 600, color: '#0B192C' }}>{activity.schedule.location}</span>
            </div>
          </div>}

          {activity.schedule.instructor && <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#F7F9FB', padding: '12px 16px', borderRadius: '10px' }}>
            <User size={20} color="#0F2A66" />
            <div>
              <strong style={{ display: 'block', fontSize: '0.85rem', color: '#475569' }}>Instrutor / Responsável</strong>
              <span style={{ fontWeight: 600, color: '#0B192C' }}>{activity.schedule.instructor}</span>
            </div>
          </div>}

          {activity.schedule.details && <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', background: '#EBF3FC', padding: '14px 16px', borderRadius: '10px', borderLeft: '4px solid #0F2A66' }}>
            <Info size={20} color="#0F2A66" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong style={{ display: 'block', fontSize: '0.85rem', color: '#0F2A66' }}>Orientações e Participação</strong>
              <span style={{ fontSize: '0.92rem', color: '#475569' }}>{activity.schedule.details}</span>
            </div>
          </div>}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
          <button className="btn btn-primary" onClick={onClose} style={{ width: '100%' }}>
            Entendido!
          </button>
        </div>
      </div>
    </div>
  );
}
