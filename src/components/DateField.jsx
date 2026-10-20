import React, { useMemo } from 'react';

export const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export function getDaysInMonth(month, year) {
  if (month === '' || month === undefined || month === null) return 31;
  const m = Number(month);
  const y = Number(year) || new Date().getFullYear();
  return new Date(y, m + 1, 0).getDate();
}

export function validateDateValue(val, required = false) {
  if (!val) {
    return required ? 'Informe uma data válida.' : null;
  }
  const day = typeof val === 'object' ? Number(val.day) : Number(String(val).split('-')[2]);
  const month = typeof val === 'object' ? Number(val.month) : Number(String(val).split('-')[1]) - 1;
  const year = typeof val === 'object' ? Number(val.year) : Number(String(val).split('-')[0]);

  if (!day || month === undefined || isNaN(month) || month < 0 || month > 11 || !year) {
    return required ? 'Informe uma data válida.' : null;
  }

  const d = new Date(year, month, day);
  if (d.getFullYear() !== year || d.getMonth() !== month || d.getDate() !== day) {
    return 'Informe uma data válida.';
  }
  return null;
}

export default function DateField({
  label = 'Data do Evento',
  required = false,
  value,
  onChange,
  error,
  dataField = 'date',
  idPrefix = 'date-field',
  minYear = 2020,
  maxYear = 2030,
}) {
  // Converte valor de entrada (objeto {day, month, year} ou string 'YYYY-MM-DD')
  const { day, month, year } = useMemo(() => {
    if (!value) return { day: '', month: '', year: '' };
    if (typeof value === 'object') {
      return {
        day: value.day ?? '',
        month: value.month !== undefined && value.month !== null && value.month !== '' ? String(value.month) : '',
        year: value.year ?? '',
      };
    }
    if (typeof value === 'string' && value.includes('-')) {
      const parts = value.split('-');
      if (parts.length === 3) {
        return {
          year: parts[0] ? Number(parts[0]) : '',
          month: parts[1] ? String(Number(parts[1]) - 1) : '',
          day: parts[2] ? Number(parts[2]) : '',
        };
      }
    }
    return { day: '', month: '', year: '' };
  }, [value]);

  const numDays = useMemo(() => {
    return getDaysInMonth(month, year);
  }, [month, year]);

  const yearsList = useMemo(() => {
    const list = [];
    for (let y = minYear; y <= maxYear; y++) {
      list.push(y);
    }
    return list;
  }, [minYear, maxYear]);

  const emitChange = (newDay, newMonth, newYear) => {
    // Se o dia selecionado for maior que o número de dias do novo mês, ajusta
    let adjustedDay = newDay;
    if (newMonth !== '' && newDay !== '') {
      const maxDays = getDaysInMonth(newMonth, newYear);
      if (Number(newDay) > maxDays) {
        adjustedDay = '';
      }
    }

    const payload = {
      day: adjustedDay !== '' ? Number(adjustedDay) : '',
      month: newMonth !== '' ? Number(newMonth) : '',
      year: newYear !== '' ? Number(newYear) : '',
    };

    let isoString = '';
    if (payload.day && payload.month !== '' && payload.year) {
      const mStr = String(payload.month + 1).padStart(2, '0');
      const dStr = String(payload.day).padStart(2, '0');
      isoString = `${payload.year}-${mStr}-${dStr}`;
    }

    onChange({
      ...payload,
      isoString,
      formatted: payload.day && payload.month !== '' && payload.year
        ? `${String(payload.day).padStart(2, '0')}/${String(payload.month + 1).padStart(2, '0')}/${payload.year}`
        : ''
    });
  };

  return (
    <div className="form-group" style={{ marginBottom: 16 }}>
      {label && (
        <label className="form-label">
          {label} {required && <span style={{ color: '#DC2626' }}>*</span>}
        </label>
      )}

      {/* Grid no formato dd/mm/aaaa: Dia, Mês, Ano */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        <div className="form-group" style={{ margin: 0 }}>
          <label htmlFor={`${idPrefix}-day`} className="form-label" style={{ fontSize: '0.78rem', marginBottom: 4, color: 'var(--text-subtle)' }}>
            Dia
          </label>
          <select
            id={`${idPrefix}-day`}
            data-field={dataField}
            className="form-select"
            value={day}
            onChange={(e) => emitChange(e.target.value, month, year)}
          >
            <option value="">Selecione</option>
            {Array.from({ length: numDays }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>
                {String(d).padStart(2, '0')}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label htmlFor={`${idPrefix}-month`} className="form-label" style={{ fontSize: '0.78rem', marginBottom: 4, color: 'var(--text-subtle)' }}>
            Mês
          </label>
          <select
            id={`${idPrefix}-month`}
            className="form-select"
            value={month}
            onChange={(e) => emitChange(day, e.target.value, year)}
          >
            <option value="">Selecione</option>
            {MONTHS.map((m, i) => (
              <option key={i} value={i}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group" style={{ margin: 0 }}>
          <label htmlFor={`${idPrefix}-year`} className="form-label" style={{ fontSize: '0.78rem', marginBottom: 4, color: 'var(--text-subtle)' }}>
            Ano
          </label>
          <select
            id={`${idPrefix}-year`}
            className="form-select"
            value={year}
            onChange={(e) => emitChange(day, month, e.target.value)}
          >
            <option value="">Selecione</option>
            {yearsList.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <p style={{ color: '#DC2626', fontSize: '0.78rem', marginTop: 5 }}>
          {error}
        </p>
      )}
    </div>
  );
}
