import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { siteData } from '../data/mockData';
import { useData } from '../context/DataContext';

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getStartDayOffset(year, month) {
  // 0=Dom, 1=Seg, ..., 6=Sáb
  return new Date(year, month, 1).getDay();
}

export default function CalendarPage() {
  const { calendar } = siteData;
  const { calendarEvents, calendarHighlights } = useData();

  const today = new Date();
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(9); // Outubro

  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonthIndex(m => m - 1);
    }
    setSelectedDay(1);
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonthIndex(m => m + 1);
    }
    setSelectedDay(1);
  };

  // Filtra eventos pelo mês/ano/categoria atual
  const allCategories = [
    { id: 'Todas', label: 'Todas' },
    ...Array.from(new Set(calendarEvents.map(e => e.category))).map(c => ({ id: c, label: c }))
  ];

  const filteredEvents = calendarEvents.filter(ev => {
    const matchMonth = ev.year === currentYear && ev.month === currentMonthIndex;
    const matchCat = selectedCategory === 'Todas' || ev.category === selectedCategory;
    return matchMonth && matchCat;
  });

  const eventsForSelectedDay = filteredEvents.filter(e => e.day === selectedDay);

  const startDayOffset = getStartDayOffset(currentYear, currentMonthIndex);
  const totalDays = getDaysInMonth(currentYear, currentMonthIndex);

  // Destaques dinâmicos: máx. 3 mostrados
  const highlights = calendarHighlights.slice(0, 3);

  return (
    <div className="calendar-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <span className="section-tag">{calendar.tag}</span>
          <h1 className="page-title">{calendar.title}</h1>
          <p className="page-subtitle">{calendar.subtitle}</p>
        </div>

        {/* Calendar Layout */}
        <div className="calendar-layout">
          {/* Main Interactive Calendar Box */}
          <div className="calendar-main-box">
            <div className="calendar-header-nav">
              <button 
                className="cal-nav-btn" 
                onClick={handlePrevMonth}
                aria-label="Mês anterior"
              >
                <ChevronLeft size={20} />
              </button>

              <h2 className="calendar-month-title">
                {MONTHS[currentMonthIndex]} {currentYear}
              </h2>

              <button 
                className="cal-nav-btn" 
                onClick={handleNextMonth}
                aria-label="Próximo mês"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Dias da Semana */}
            <div className="cal-weekdays">
              <span>Dom</span><span>Seg</span><span>Ter</span>
              <span>Qua</span><span>Qui</span><span>Sex</span><span>Sáb</span>
            </div>

            {/* Grid de Dias */}
            <div className="cal-grid">
              {Array.from({ length: startDayOffset }).map((_, i) => (
                <div key={`empty-${i}`} className="cal-day-cell empty" />
              ))}

              {Array.from({ length: totalDays }, (_, i) => {
                const dayNum = i + 1;
                const hasEvent = filteredEvents.some(e => e.day === dayNum);
                const isSelected = selectedDay === dayNum;

                return (
                  <button
                    key={dayNum}
                    className={`cal-day-cell ${hasEvent ? 'has-event' : ''} ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedDay(dayNum)}
                    aria-label={`Dia ${dayNum} de ${MONTHS[currentMonthIndex]} de ${currentYear}`}
                  >
                    <span>{dayNum}</span>
                  </button>
                );
              })}
            </div>

            {/* Detalhes do Dia Selecionado */}
            <div className="selected-day-events">
              <h3 className="selected-day-title">
                <CalendarIcon size={18} color="#2A5C66" />
                <span>Atividades no Dia {selectedDay} de {MONTHS[currentMonthIndex]}</span>
              </h3>

              {eventsForSelectedDay.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {eventsForSelectedDay.map((ev, idx) => (
                    <div key={idx} className="day-event-item">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#2A5C66' }}>
                          {ev.time} • {ev.category}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1B2527', marginBottom: '4px' }}>{ev.title}</h4>
                      {ev.location && (
                        <p style={{ fontSize: '0.78rem', color: '#6E6E6E', marginBottom: '4px' }}>📍 {ev.location}</p>
                      )}
                      <p style={{ fontSize: '0.88rem', color: '#4D4D4D' }}>{ev.desc}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '0.9rem', color: '#6E6E6E', fontStyle: 'italic', padding: '10px 0' }}>
                  Nenhum encontro especial cadastrado para este dia. Nossa sede está aberta para convivência livre e jogos de tabuleiro!
                </p>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="calendar-sidebar">
            {/* Box: Filtrar por Categoria */}
            <div className="sidebar-box">
              <h3 className="sidebar-heading">Filtrar por Categoria</h3>
              <div className="filter-pills-row">
                {allCategories.map((cat) => (
                  <button
                    key={cat.id}
                    className={`filter-pill ${selectedCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Box: Destaques do Mês */}
            <div className="sidebar-box">
              <h3 className="sidebar-heading">Destaques do Mês</h3>
              {highlights.length > 0 ? (
                <div className="highlight-list">
                  {highlights.map((item, idx) => (
                    <div key={idx} className="highlight-item">
                      <div className="highlight-date" style={{ color: item.color || '#2A5C66' }}>
                        {item.dateLabel}
                      </div>
                      <h4 className="highlight-title">{item.title}</h4>
                      <p className="highlight-desc">{item.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize:'0.85rem', color:'var(--text-subtle)', fontStyle:'italic' }}>
                  Nenhum destaque cadastrado ainda.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
