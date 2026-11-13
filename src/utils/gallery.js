// Utilitários da galeria — todos os cálculos são derivados de título e data.
// Nada aqui depende de campos novos no banco.

const YEAR_IN_TEXT = /\b(?:19|20)\d{2}\b/g;

/**
 * Lê uma data no formato retornado pela API ("YYYY-MM-DD", eventualmente com
 * hora) sem passar por `new Date("YYYY-MM-DD")`, que interpreta a string como
 * UTC e pode voltar um dia em fusos negativos.
 * Retorna { year, month, day, iso } ou null quando a data é ausente/inválida.
 */
export function parseAlbumDate(value) {
  if (value === null || value === undefined) return null;

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) return null;
    const year = value.getFullYear();
    const month = value.getMonth() + 1;
    const day = value.getDate();
    return { year, month, day, iso: toIso(year, month, day) };
  }

  const raw = String(value).trim();
  if (!raw) return null;

  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(raw);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (!isRealDate(year, month, day)) return null;
  return { year, month, day, iso: toIso(year, month, day) };
}

function toIso(year, month, day) {
  return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function isRealDate(year, month, day) {
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return false;
  if (year < 1900 || year > 2200 || month < 1 || month > 12 || day < 1) return false;
  // Date.UTC evita qualquer deslocamento de fuso ao validar o calendário.
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
}

/** Ano da lembrança, ou null quando não há data válida. */
export function getAlbumYear(album) {
  return parseAlbumDate(album?.date)?.year ?? null;
}

export function getAlbumYearLabel(album) {
  return getAlbumYear(album) ?? 'Sem data';
}

/** Minúsculas, sem acentos, sem pontuação e com espaços normalizados. */
export function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/** Remove anos (1900–2099) do título; usado só para agrupar e sugerir. */
export function stripYearFromTitle(value) {
  return String(value ?? '')
    .replace(YEAR_IN_TEXT, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Chave interna do evento: "Festa de Natal 2025" e "Festa de Natal 2024"
 * geram "festa de natal". O título original nunca é alterado na tela.
 */
export function getEventKey(title) {
  return normalizeText(stripYearFromTitle(title));
}

/** Busca por título, ignorando acentos e maiúsculas. */
export function matchesAlbumQuery(album, query) {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return true;
  return normalizeText(album?.title).includes(normalizedQuery);
}

/** Mais recente primeiro; sem data vai para o fim. */
export function sortAlbumsByDateDesc(albums = []) {
  return [...albums].sort((a, b) => {
    const dateA = parseAlbumDate(a?.date);
    const dateB = parseAlbumDate(b?.date);

    if (dateA && dateB) {
      const byDate = dateB.iso.localeCompare(dateA.iso);
      if (byDate !== 0) return byDate;
    } else if (dateA) {
      return -1;
    } else if (dateB) {
      return 1;
    }

    const idA = Number(a?.apiId ?? 0) || 0;
    const idB = Number(b?.apiId ?? 0) || 0;
    return idB - idA;
  });
}

/** Anos disponíveis (decrescentes) com contagem; "Sem data" separado. */
export function getYearGroups(albums = []) {
  const counts = new Map();
  let undatedCount = 0;

  albums.forEach((album) => {
    const year = getAlbumYear(album);
    if (year === null) {
      undatedCount += 1;
    } else {
      counts.set(year, (counts.get(year) || 0) + 1);
    }
  });

  const years = [...counts.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, count]) => ({ year, value: String(year), label: String(year), count }));

  return { years, undatedCount, total: albums.length };
}

/**
 * Filtra por ano e por busca. `year` aceita "all", "sem-data" ou "2025".
 */
export function filterAlbums(albums = [], { year = 'all', query = '' } = {}) {
  return albums.filter((album) => {
    const albumYear = getAlbumYear(album);
    if (year === 'sem-data') {
      if (albumYear !== null) return false;
    } else if (year !== 'all' && String(albumYear) !== String(year)) {
      return false;
    }
    return matchesAlbumQuery(album, query);
  });
}

/** Agrupa para os cabeçalhos "2025", "2024" e "Sem data". */
export function groupAlbumsByYear(albums = []) {
  const groups = new Map();

  sortAlbumsByDateDesc(albums).forEach((album) => {
    const year = getAlbumYear(album);
    const key = year === null ? 'sem-data' : String(year);
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        year,
        label: year === null ? 'Sem data' : String(year),
        albums: [],
      });
    }
    groups.get(key).albums.push(album);
  });

  return [...groups.values()].sort((a, b) => {
    if (a.year === null) return 1;
    if (b.year === null) return -1;
    return b.year - a.year;
  });
}

function albumIdentity(album) {
  return String(album?.apiId ?? album?.id ?? '');
}

function dedupeByYear(albums) {
  const seen = new Set();
  return albums.filter((album) => {
    const key = getAlbumYear(album) ?? 'sem-data';
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Outras lembranças do mesmo evento em anos diferentes.
 * Retorna no máximo uma por ano, da mais recente para a mais antiga.
 */
export function findOtherYearAlbums(albums = [], currentAlbum) {
  if (!currentAlbum) return [];

  const key = getEventKey(currentAlbum.title);
  if (!key) return [];

  const currentId = albumIdentity(currentAlbum);
  const currentYear = getAlbumYear(currentAlbum);

  const others = albums.filter((album) => {
    if (albumIdentity(album) === currentId) return false;
    if (getEventKey(album.title) !== key) return false;
    return getAlbumYear(album) !== currentYear;
  });

  return dedupeByYear(sortAlbumsByDateDesc(others));
}

/** Todas as lembranças do mesmo evento (usado no aviso do admin). */
export function getSameEventAlbums(albums = [], title, excludeApiId) {
  const key = getEventKey(title);
  if (!key) return [];
  const excludedId = excludeApiId === undefined || excludeApiId === null ? '' : String(excludeApiId);

  return sortAlbumsByDateDesc(
    albums.filter((album) => getEventKey(album.title) === key && albumIdentity(album) !== excludedId)
  );
}

/** Lista legível de anos, ex.: "2024 e 2023". */
export function formatYearList(albums = []) {
  const labels = [...new Set(albums.map((album) => getAlbumYearLabel(album)))];
  labels.sort((a, b) => {
    if (a === 'Sem data') return 1;
    if (b === 'Sem data') return -1;
    return Number(b) - Number(a);
  });

  if (labels.length <= 1) return labels[0] || '';
  return `${labels.slice(0, -1).join(', ')} e ${labels[labels.length - 1]}`;
}

/**
 * Sugestões de títulos já usados, sem o ano, para padronizar o cadastro.
 * Retorna [{ key, title, years: ['2024', '2023'] }].
 */
export function getTitleSuggestions(albums = [], query, excludeApiId, limit = 5) {
  const normalizedQuery = normalizeText(stripYearFromTitle(query));
  if (normalizedQuery.length < 2) return [];

  const excludedId = excludeApiId === undefined || excludeApiId === null ? '' : String(excludeApiId);
  const suggestions = new Map();

  sortAlbumsByDateDesc(albums).forEach((album) => {
    if (albumIdentity(album) === excludedId) return;

    const key = getEventKey(album.title);
    if (!key || !key.includes(normalizedQuery)) return;

    const yearLabel = getAlbumYearLabel(album);
    if (!suggestions.has(key)) {
      suggestions.set(key, {
        key,
        title: stripYearFromTitle(album.title) || String(album.title || '').trim(),
        years: [yearLabel],
      });
    } else {
      const suggestion = suggestions.get(key);
      if (!suggestion.years.includes(yearLabel)) suggestion.years.push(yearLabel);
    }
  });

  return [...suggestions.values()].slice(0, limit);
}

export function formatPhotoCount(count) {
  const total = Number(count) || 0;
  return `${total} ${total === 1 ? 'foto' : 'fotos'}`;
}

export function getAlbumCover(album) {
  return album?.image || album?.photos?.[0] || '';
}
