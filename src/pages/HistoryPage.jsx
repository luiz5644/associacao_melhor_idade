import React, { useEffect, useRef, useState } from 'react';
import SponsorsCarousel from '../components/SponsorsCarousel';
import { foundingPhoto, historyHighlights, historyMilestones } from '../data/historyContent';

const originStory = 'A Associação Qualidade de Vida Projeto Melhor Idade foi idealizada pela Sra. Maria Saraiva de Santiago, com o apoio de seu marido, Sr. Arnóbio Santiago de Freitas (in memoriam), e de um grupo de idosas que já participava de atividades de lazer e interação social. Nasceu da vontade de ampliar ações de bem-estar, socialização e valorização da pessoa idosa, com momentos de convivência, alegria e participação.';
const foundingStory = 'A Sra. Maria Saraiva de Santiago, Presidente da Associação, e seu marido, Sr. Arnóbio Santiago de Freitas (in memoriam), elaboraram o projeto de criação da entidade e o seu Estatuto Social. Participaram também a Sra. Maria Estácio, Tesoureira, a Sra. Maria de Lourdes Nogueira e demais integrantes do grupo de idosas que ajudaram a consolidar a iniciativa.';

function Reveal({ children, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    if (!('IntersectionObserver' in window)) {
      element.classList.add('is-visible');
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }, { threshold: 0.12 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className={`history-reveal ${className}`}>{children}</div>;
}

function MilestoneDetails({ details }) {
  if (typeof details === 'string') return <p>{details}</p>;
  if (details.some(item => typeof item !== 'string')) {
    return details.map(item => (
      <p key={item.heading}>
        <strong>{item.heading}: </strong>{item.text}
      </p>
    ));
  }
  return <ul>{details.map(item => <li key={item}>{item}</li>)}</ul>;
}

function TimelineItem({ item }) {
  const [expanded, setExpanded] = useState(false);
  const itemLabel = `${item.year} — ${item.title}`;

  return (
    <Reveal className="history-timeline-reveal">
      <article className="history-timeline-item">
        <div className="history-timeline-year">{item.year}</div>
        <div className="history-timeline-marker" aria-hidden="true" />
        <div className="history-timeline-card">
          <h3>{item.title}</h3>
          <p>{item.summary}</p>
          {expanded && (
            <div className="history-timeline-details">
              <MilestoneDetails details={item.details} />
              {item.image && (
                <img className="history-milestone-image" src={item.image} alt={item.imageAlt || itemLabel} loading="lazy" />
              )}
            </div>
          )}
          <button
            className="history-more-btn"
            type="button"
            onClick={() => setExpanded(value => !value)}
            aria-expanded={expanded}
            aria-label={`${expanded ? 'Ver menos' : 'Ver mais'}: ${itemLabel}`}
          >
            {expanded ? 'Ver menos' : 'Ver mais'}
          </button>
        </div>
      </article>
    </Reveal>
  );
}

export default function HistoryPage({ onOpenSponsorModal }) {
  return (
    <div className="history-page">
      <div className="container history-content">
        <Reveal>
          <section className="history-intro" aria-labelledby="history-intro-title">
            <span className="section-tag">NOSSA TRAJETÓRIA</span>
            <h1 id="history-intro-title" className="page-title">Como começou o Projeto Melhor Idade?</h1>
            <p>{originStory}</p>
          </section>
        </Reveal>

        <Reveal>
          <section className="history-highlights" aria-label="Destaques em números">
            {historyHighlights.map(item => (
              <article className="history-highlight-card" key={item.value}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </article>
            ))}
          </section>
        </Reveal>

        <Reveal>
          <section className={`history-founders${foundingPhoto ? ' has-photo' : ''}`} aria-labelledby="history-founders-title">
            <div className="history-founders-copy">
              <span className="section-tag">QUEM FEZ PARTE</span>
              <h2 id="history-founders-title" className="page-title">Quem participou da criação do projeto?</h2>
              <p>{foundingStory}</p>
            </div>
            {foundingPhoto && (
              <img className="history-founders-image" src={foundingPhoto} alt="Integrantes que participaram da criação do projeto" loading="lazy" />
            )}
          </section>
        </Reveal>

        <section className="history-timeline-section" aria-labelledby="history-timeline-title">
          <Reveal>
            <div className="page-header history-timeline-header">
              <span className="section-tag">NOSSA CAMINHADA</span>
              <h2 id="history-timeline-title" className="page-title">Principais acontecimentos ao longo da história</h2>
            </div>
          </Reveal>
          <div className="history-timeline">
            {historyMilestones.map(item => <TimelineItem key={`${item.year}-${item.title}`} item={item} />)}
          </div>
        </section>
      </div>

      <SponsorsCarousel onOpenSponsorModal={onOpenSponsorModal} />
    </div>
  );
}
