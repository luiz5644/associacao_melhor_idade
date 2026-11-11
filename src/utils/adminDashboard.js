// Utilitários da Visão Geral do painel administrativo.

/** "1 lembrança cadastrada" / "2 lembranças cadastradas" */
export function pluralize(count, singular, plural) {
  const total = Number(count) || 0;
  return `${total} ${total === 1 ? singular : plural}`;
}

export function capitalize(text) {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : '';
}

export function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Converte o evento do front (day, month 0-11, year, time "HH:MM") em Date local. */
export function parseEventDate(event) {
  const year = Number(event?.year) || 0;
  const month = Number(event?.month) || 0;
  const day = Number(event?.day) || 1;
  const [hours, minutes] = String(event?.time || '00:00').split(':').map(Number);
  return new Date(year, month, day, hours || 0, minutes || 0);
}

export function isActiveEvent(event) {
  return String(event?.status || 'ativo').toLowerCase() !== 'cancelado';
}

/** Dias inteiros entre hoje e a data do evento (0 = hoje, 1 = amanhã). */
export function daysUntil(event, now = new Date()) {
  const eventDay = startOfDay(parseEventDate(event));
  const today = startOfDay(now);
  return Math.round((eventDay - today) / 86400000);
}

export function sortEventsByDate(events) {
  return [...(events || [])].sort((a, b) => parseEventDate(a) - parseEventDate(b));
}

/** Eventos ativos de hoje em diante, ordenados por data/hora. */
export function getUpcomingEvents(events, now = new Date()) {
  return sortEventsByDate(events).filter(
    (event) => isActiveEvent(event) && daysUntil(event, now) >= 0
  );
}

export function relativeDayLabel(event, now = new Date()) {
  const diff = daysUntil(event, now);
  if (diff === 0) return 'Hoje';
  if (diff === 1) return 'Amanhã';
  if (diff > 1) return `Em ${diff} dias`;
  if (diff === -1) return 'Ontem';
  return `Há ${Math.abs(diff)} dias`;
}

export function toISODate(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function formatDateBR(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${day}/${month}/${date.getFullYear()}`;
}

export function formatLongDate(date = new Date()) {
  const text = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function greetingFor(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

/**
 * Pendências reais calculadas com os dados atuais de eventos.
 * Retorna uma lista de itens prontos para exibição.
 */
export function getAttentionItems(events, now = new Date()) {
  const upcoming = getUpcomingEvents(events, now);
  const items = [];

  if (upcoming.length === 0) return items;

  const today = upcoming.filter((event) => daysUntil(event, now) === 0);
  if (today.length) {
    items.push({
      id: 'today',
      tone: 'info',
      text: pluralize(today.length, 'evento acontece hoje', 'eventos acontecem hoje'),
      hint: 'Confira horário e local antes de receber o público.',
      event: today[0],
      target: 'calendar',
    });
  }

  const tomorrow = upcoming.filter((event) => daysUntil(event, now) === 1);
  if (tomorrow.length) {
    items.push({
      id: 'tomorrow',
      tone: 'info',
      text: pluralize(tomorrow.length, 'evento acontece amanhã', 'eventos acontecem amanhã'),
      hint: 'Última conferência de local e descrição.',
      event: tomorrow[0],
      target: 'calendar',
    });
  }

  const withoutLocation = upcoming.filter((event) => !event.hasLocation);
  if (withoutLocation.length) {
    items.push({
      id: 'no-location',
      tone: 'warning',
      text: pluralize(withoutLocation.length, 'evento sem local definido', 'eventos sem local definido'),
      hint: 'Informe onde o encontro vai acontecer.',
      event: withoutLocation[0],
      target: 'calendar',
    });
  }

  const withoutDescription = upcoming.filter((event) => !String(event.desc || '').trim());
  if (withoutDescription.length) {
    items.push({
      id: 'no-description',
      tone: 'warning',
      text: pluralize(withoutDescription.length, 'evento sem descrição', 'eventos sem descrição'),
      hint: 'Uma descrição curta ajuda os participantes.',
      event: withoutDescription[0],
      target: 'calendar',
    });
  }

  return items;
}
