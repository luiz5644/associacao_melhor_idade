import React, { useMemo } from 'react';
import { ArrowRight, Clock, MapPin } from 'lucide-react';
import { siteData } from '../data/mockData';
import { useData } from '../context/DataContext';

const HIDDEN_EVENT_STATUSES = new Set(['cancelado', 'cancelada', 'inativo', 'inativa', 'rascunho']);
const MONTHS_SHORT = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
const MONTHS_LONG = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const WEEKDAYS_LONG = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function pad2(value) {
  return String(value).padStart(2, '0');
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function parseEventDate(event) {
  const year = Number(event.year);
  const month = Number(event.month);
  const day = Number(event.day);
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return null;
  if (month < 0 || month > 11 || day < 1 || day > 31) return null;

  const [hoursPart, minutesPart] = String(event.time || '00:00').split(':');
  const hours = Number.parseInt(hoursPart, 10);
  const minutes = Number.parseInt(minutesPart, 10);
  const date = new Date(
    year,
    month,
    day,
    Number.isFinite(hours) ? hours : 0,
    Number.isFinite(minutes) ? minutes : 0,
    0,
    0
  );

  const isValid = !Number.isNaN(date.getTime())
    && date.getFullYear() === year
    && date.getMonth() === month
    && date.getDate() === day;
  return isValid ? date : null;
}

function getProximityLabel(dayDiff) {
  if (dayDiff === 0) return 'Hoje';
  if (dayDiff === 1) return 'Amanhã';
  return `Em ${dayDiff} dias`;
}

export default function HomePage({ onNavigate, onSelectPhoto }) {
  const { home } = siteData;
  const {
    calendarEvents,
    calendarEventsLoading,
    calendarEventsError,
    galleryItems,
    backendConnected,
    backendLoading,
    checkBackendConnection
  } = useData();
  const upcomingEvents = useMemo(() => {
    const now = new Date();
    const todayStart = startOfDay(now);

    return calendarEvents
      .filter(event => {
        if (event.apiId == null) return false;
        const status = String(event.status || 'ativo').toLowerCase();
        return !HIDDEN_EVENT_STATUSES.has(status);
      })
      .map(event => ({ event, date: parseEventDate(event) }))
      .filter(({ date }) => date && date >= now)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 3)
      .map(({ event, date }) => {
        const dayDiff = Math.round((startOfDay(date) - todayStart) / MS_PER_DAY);
        const proximityLabel = getProximityLabel(dayDiff);
        const timeValue = String(event.time || '00:00').substring(0, 5);
        const timeLabel = timeValue.replace(':', 'h');
        const isoDate = `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
        const weekday = WEEKDAYS_LONG[date.getDay()];
        const location = event.hasLocation === false ? '' : event.location?.trim();
        const title = event.title?.trim() || 'Encontro da associação';
        const description = event.desc?.trim();
        const ariaLabel = `Ver "${title}" no calendário, ${weekday.toLowerCase()}, ${date.getDate()} de ${MONTHS_LONG[date.getMonth()]}, ${timeLabel}, ${proximityLabel.toLowerCase()}${location ? `, ${location}` : ''}`;

        return {
          id: event.id ?? event.apiId,
          title,
          description,
          location,
          dayNumber: date.getDate(),
          monthShort: MONTHS_SHORT[date.getMonth()],
          weekday,
          timeLabel,
          isoDate,
          dateTime: `${isoDate}T${timeValue}`,
          proximityLabel,
          ariaLabel
        };
      });
  }, [calendarEvents]);

  const eventsLoading = backendLoading || calendarEventsLoading;
  const eventsError = calendarEventsError;

  const handleCalendarClick = (event) => {
    event.preventDefault();
    onNavigate('calendar');
  };

  const handleEventClick = (event, isoDate) => {
    event.preventDefault();
    onNavigate('calendar', { date: isoDate });
  };
  const recentMomentItems = useMemo(() => {
    if (!backendConnected || backendLoading) return [];

    return galleryItems
      .filter(item => item.image && item.photos?.length > 0)
      .sort((a, b) => b.date.localeCompare(a.date) || Number(b.apiId) - Number(a.apiId))
      .slice(0, 3);
  }, [galleryItems, backendConnected, backendLoading]);

  return (
    <div className="home-page">
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-content">
              <span className="section-tag">{home.hero.tag}</span>
              <h1 className="hero-title">{home.hero.title}</h1>
              <p className="hero-desc">{home.hero.description}</p>
            </div>
            <div className="hero-image-wrapper">
              <img 
                src={home.hero.image} 
                alt="Idosos da comunidade celebrando com alegria e pétalas ao sol" 
                className="hero-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. PRÓXIMOS ENCONTROS */}
      <section className="upcoming-section" aria-labelledby="upcoming-title" aria-busy={eventsLoading}>
        <div className="container">
          <div className="page-header" style={{ padding: '0 0 28px' }}>
            <span className="section-tag">{home.upcoming.tag}</span>
            <h2 id="upcoming-title" className="page-title">{home.upcoming.title}</h2>
            <p className="page-subtitle">{home.upcoming.subtitle}</p>
          </div>

          {eventsLoading && (
            <div className="upcoming-feedback" role="status" aria-live="polite">
              <p className="upcoming-feedback-title">Carregando encontros...</p>
              <p>Aguarde um instante enquanto buscamos a programação.</p>
            </div>
          )}

          {!eventsLoading && eventsError && (
            <div className="upcoming-feedback upcoming-feedback-error" role="alert">
              <p className="upcoming-feedback-title">Erro ao buscar encontros</p>
              <p>{eventsError}</p>
              <button
                type="button"
                className="upcoming-retry"
                onClick={() => checkBackendConnection(false)}
              >
                Tentar novamente
              </button>
            </div>
          )}

          {!eventsLoading && !eventsError && upcomingEvents.length === 0 && (
            <div className="upcoming-feedback">
              <p className="upcoming-feedback-title">Nenhuma ação programada no momento.</p>
              <p>Quando a associação cadastrar um novo encontro, ele aparecerá aqui.</p>
              <a className="upcoming-all-link" href="#calendario" onClick={handleCalendarClick}>
                Ver calendário completo
                <ArrowRight size={20} aria-hidden="true" />
              </a>
            </div>
          )}

          {!eventsLoading && !eventsError && upcomingEvents.length > 0 && (
            <>
              <ul className="upcoming-grid">
                {upcomingEvents.map((item) => (
                  <li key={item.id} className="upcoming-item">
                    <a
                      className="upcoming-card"
                      href={`#calendario?data=${item.isoDate}`}
                      onClick={(event) => handleEventClick(event, item.isoDate)}
                      aria-label={item.ariaLabel}
                    >
                      <header className="upcoming-card-top">
                        <time className="upcoming-date" dateTime={item.isoDate}>
                          <span className="upcoming-date-day">{item.dayNumber}</span>
                          <span className="upcoming-date-month">{item.monthShort}</span>
                        </time>
                        <div className="upcoming-date-meta">
                          <span className="upcoming-weekday">{item.weekday}</span>
                          <span className="upcoming-proximity">{item.proximityLabel}</span>
                        </div>
                      </header>

                      <p className="upcoming-time">
                        <Clock size={20} aria-hidden="true" />
                        <time dateTime={item.dateTime}>{item.timeLabel}</time>
                      </p>

                      <h3 className="upcoming-title">{item.title}</h3>

                      {item.location && (
                        <p className="upcoming-location">
                          <MapPin size={20} aria-hidden="true" />
                          <span>{item.location}</span>
                        </p>
                      )}

                      {item.description && <p className="upcoming-desc">{item.description}</p>}

                      <span className="upcoming-card-footer">
                        Ver no calendário
                        <ArrowRight size={20} aria-hidden="true" />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>

              <div className="upcoming-actions">
                <a className="upcoming-all-link" href="#calendario" onClick={handleCalendarClick}>
                  Ver calendário completo
                  <ArrowRight size={20} aria-hidden="true" />
                </a>
              </div>
            </>
          )}
        </div>
      </section>

      {/* 3. NOSSA CAMINHADA (HISTÓRIA TEASER) */}
      <section className="history-teaser-section">
        <div className="container">
          <div className="history-teaser-grid">
            <div className="history-teaser-img-wrap">
              <img 
                src={home.historyTeaser.image} 
                alt="Pessoas idosas reunidas em um momento de convivência" 
                className="history-teaser-img" 
              />
            </div>
            <div className="history-teaser-content">
              <span className="section-tag">{home.historyTeaser.tag}</span>
              <h2 className="history-teaser-title">{home.historyTeaser.title}</h2>
              {home.historyTeaser.paragraphs.map((p, idx) => (
                <p key={idx} className="history-teaser-text">{p}</p>
              ))}
              <button 
                className="link-arrow" 
                onClick={() => onNavigate('history')}
              >
                <span>{home.historyTeaser.ctaText}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MOMENTOS RECENTES */}
      <section className="recent-moments-section">
        <div className="container">
          <div className="page-header" style={{ padding: '0 0 28px' }}>
            <span className="section-tag">{home.recentMoments.tag}</span>
            <h2 className="page-title">{home.recentMoments.title}</h2>
            <p className="page-subtitle">{home.recentMoments.subtitle}</p>
          </div>

          <div className="cards-grid-3">
            {recentMomentItems.length === 0 ? (
              <p>Nenhum momento cadastrado ainda.</p>
            ) : recentMomentItems.map((item) => (
              <div 
                key={item.id} 
                className="moment-card"
                onClick={() => onSelectPhoto(item)}
              >
                <img src={item.image} alt={item.title} className="moment-img" />
                <div className="moment-info">
                  <h3 className="moment-title">{item.title}</h3>
                  <p className="moment-subtitle">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}


