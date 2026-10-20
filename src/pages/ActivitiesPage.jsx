import React from 'react';
import { siteData } from '../data/mockData';
import { useData } from '../context/DataContext';

export default function ActivitiesPage({ onOpenSchedule }) {
  const { activities } = siteData;
  const {
    activities: actionItems,
    backendLoading,
    activitiesLoading,
    activitiesError,
    checkBackendConnection,
  } = useData();

  return (
    <div className="activities-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <span className="section-tag">{activities.tag}</span>
          <h1 className="page-title">{activities.title}</h1>
          <p className="page-subtitle">{activities.subtitle}</p>
        </div>

        {/* 6 Cards Grid */}
        <div className="activities-grid">
          {(backendLoading || activitiesLoading) && (
            <p role="status" style={{ gridColumn:'1 / -1', textAlign:'center', color:'var(--text-subtle)' }}>
              Carregando ações...
            </p>
          )}
          {!backendLoading && !activitiesLoading && activitiesError && (
            <div role="alert" style={{ gridColumn:'1 / -1', textAlign:'center', color:'var(--text-subtle)' }}>
              <p>Não foi possível carregar as ações.</p>
              <button className="activity-btn" onClick={() => checkBackendConnection(true)} style={{ marginTop:12 }}>
                Tentar novamente
              </button>
            </div>
          )}
          {!backendLoading && !activitiesLoading && !activitiesError && actionItems.length === 0 && (
            <p style={{ gridColumn:'1 / -1', textAlign:'center', color:'var(--text-subtle)' }}>
              Nenhuma ação cadastrada no momento.
            </p>
          )}
          {!backendLoading && !activitiesLoading && !activitiesError && actionItems.map((act) => (
            <div
              key={act.id}
              className="activity-card"
              style={{ cursor:'pointer' }}
              onClick={() => onOpenSchedule(act)}
              onKeyDown={event => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onOpenSchedule(act);
                }
              }}
              role="button"
              tabIndex={0}
            >
              {act.image && <img src={act.image} alt={act.title} className="activity-img" />}
              <div className="activity-body">
                <h2 className="activity-title">{act.title}</h2>
                {act.description && <p className="activity-desc">{act.description}</p>}
                <button 
                  className="activity-btn"
                  onClick={event => {
                    event.stopPropagation();
                    onOpenSchedule(act);
                  }}
                >
                  Saiba Horários
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
