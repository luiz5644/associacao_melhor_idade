import React from 'react';
import { siteData } from '../data/mockData';

export default function ActivitiesPage({ onOpenSchedule }) {
  const { activities } = siteData;

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
          {activities.items.map((act) => (
            <div key={act.id} className="activity-card">
              <img src={act.image} alt={act.title} className="activity-img" />
              <div className="activity-body">
                <span className="activity-tag">{act.categoryTag}</span>
                <h2 className="activity-title">{act.title}</h2>
                <p className="activity-desc">{act.description}</p>
                <button 
                  className="activity-btn"
                  onClick={() => onOpenSchedule(act)}
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
