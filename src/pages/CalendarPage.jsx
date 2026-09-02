import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import { siteData } from '../data/mockData';

export default function CalendarPage({ dynamicEvents = [] }) {
  const { calendar } = siteData;
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedDay, setSelectedDay] = useState(1);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(9); // 9 = Outubro (0-indexed)
  const currentYear = 2026;

  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  // Combina eventos mock com eventos adicionados pelo admin
  const allEvents = [...calendar.eventsOctober2026, ...dynamicEvents];

  // Filtra por categoria
  const filteredEvents = selectedCategory === 'Todas' 
    ? allEvents 
    : allEvents.filter(e => e.category === selectedCategory);

  // Calendário de Outubro 2026: 1 de Outubro de 2026 é Quinta-feira (4 dias em branco: Dom, Seg, Ter, Qua)
  // Dom=0, Seg=1, Ter=2, Qua=3, Qui=4, Sex=5, Sáb=6
  const startDayOffset = 4; // Quinta-feira
  const totalDays = 31;

  const handlePrevMonth = () => {
    setCurrentMonthIndex(prev => (prev > 0 ? prev - 1 : 11));
  };

  const handleNextMonth = () => {
    setCurrentMonthIndex(prev => (prev < 11 ? prev + 1 : 0));
  };

  const eventsForSelectedDay = filteredEvents.filter(e => e.day === selectedDay);

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
                {months[currentMonthIndex]} {currentYear}
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
              <span>Dom</span>
              <span>Seg</span>
              <span>Ter</span>
              <span>Qua</span>
              <span>Qui</span>
              <span>Sex</span>
              <span>Sáb</span>
            </div>

            {/* Grid de Dias */}
            <div className="cal-grid">
              {/* Células vazias antes do dia 1 */}
              {Array.from({ length: startDayOffset }).map((_, i) => (
                <div key={`empty-${i}`} className="cal-day-cell empty" />
              ))}

              {/* Dias do Mês */}
              {Array.from({ length: totalDays }, (_, i) => {
                const dayNum = i + 1;
                const hasEvent = filteredEvents.some(e => e.day === dayNum);
                const isSelected = selectedDay === dayNum;

                return (
                  <button
                    key={dayNum}
                    className={`cal-day-cell ${hasEvent ? 'has-event' : ''} ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedDay(dayNum)}
                    aria-label={`Dia ${dayNum} de Outubro de 2026`}
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
                <span>Atividades no Dia {selectedDay} de {months[currentMonthIndex]}</span>
              </h3>

              {eventsForSelectedDay.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {eventsForSelectedDay.map((ev, idx) => (
                    <div key={idx} className="day-event-item">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#2A5C66' }}>
                          {ev.time} • Categoria: {ev.category}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1B2527', marginBottom: '4px' }}>{ev.title}</h4>
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

          {/* Right Sidebar: Filtros & Destaques */}
          <div className="calendar-sidebar">
            {/* Box: Filtrar por Categoria */}
            <div className="sidebar-box">
              <h3 className="sidebar-heading">Filtrar por Categoria</h3>
              <div className="filter-pills-row">
                {calendar.categories.map((cat) => (
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
              <div className="highlight-list">
                {calendar.highlights.map((item, idx) => (
                  <div key={idx} className="highlight-item">
                    <div className="highlight-date" style={{ color: item.color || '#2A5C66' }}>
                      {item.dateLabel}
                    </div>
                    <h4 className="highlight-title">{item.title}</h4>
                    <p className="highlight-desc">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
