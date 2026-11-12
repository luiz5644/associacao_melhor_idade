import React from 'react';
import { siteData } from '../data/mockData';

export default function DonationBanner({ title, description, onOpenDonation }) {
  const { cta } = siteData.home;

  return (
    <section className="cta-banner">
      <div className="container">
        <div className="cta-grid">
          <div className="cta-content">
            <h2 className="cta-title">{title}</h2>
            <p className="cta-desc">{description}</p>
          </div>
          <button className="cta-btn" onClick={onOpenDonation}>
            {cta.buttonText}
          </button>
        </div>
      </div>
    </section>
  );
}
