const seasons = [
  { id: '2022-launch', year: 2022, season: 'Launch', title: 'Pilot Season', pdf: 'pdfs/2022/Season 0 Write Up.pdf' },
  { id: '2022-autumn', year: 2022, season: 'Autumn', title: 'Hallowed Peak', pdf: 'pdfs/2022/Hallowed Peak 22 Write Up.pdf' },
  { id: '2022-winter', year: 2022, season: 'Winter', title: 'Wintermas', pdf: 'pdfs/2022/Wintermas Phantom Peak 22 Write Up.pdf' },
  { id: '2023-spring', year: 2023, season: 'Spring', title: 'Platypus Parade', pdf: 'pdfs/2023/Platypus Parade Write Up.pdf' },
  { id: '2023-summer', year: 2023, season: 'Summer', title: 'Summer’s Peak', pdf: "pdfs/2023/Summer's Peak Write Up.pdf" },
  { id: '2023-autumn', year: 2023, season: 'Autumn', title: 'Hallowed Peak', pdf: 'pdfs/2023/2023 Hallowed Peak Write Up.pdf' },
  { id: '2023-winter', year: 2023, season: 'Winter', title: 'Christmas at the Peak', pdf: 'pdfs/2023/2023 Christmas At The Peak Write Up.pdf' },
  { id: '2023-special', year: 2023, season: 'Special', title: 'Special Event Trails', pdf: 'pdfs/2023/2023 Special Event Trail Write Ups.pdf' },
  { id: '2024-spring', year: 2024, season: 'Spring', title: 'Festival of Innovation', pdf: 'pdfs/2024/2024 Spring At The Peak Write Up.pdf' },
  { id: '2024-summer', year: 2024, season: 'Summer', title: 'Starlit Summer', pdf: 'pdfs/2024/2024 Summer At The Peak Write Up.pdf' },
  { id: '2024-autumn', year: 2024, season: 'Autumn', title: 'Hallowed Peak', pdf: 'pdfs/2024/2024 Hallowed Peak Write Up.pdf' },
  { id: '2024-winter', year: 2024, season: 'Winter', title: 'Wintermas', pdf: 'pdfs/2024/2024 Wintermas Write Up.pdf' },
  { id: '2025-spring', year: 2025, season: 'Spring', title: 'JONACON', pdf: 'pdfs/2025/2025 Spring - Jonacon Write Up.pdf' },
  { id: '2025-summer', year: 2025, season: 'Summer', title: 'Burning Blimp', pdf: 'pdfs/2025/2025 Summer - Burning Blimp Write Up.pdf' },
  { id: '2025-autumn', year: 2025, season: 'Autumn', title: 'Hallowed Peak', pdf: 'pdfs/2025/Hallowed Peak 2025 Write Up.pdf', number: 14 },
  { id: '2025-winter', year: 2025, season: 'Winter', title: 'Wintermas', pdf: 'pdfs/2025/Wintermas 2025 Write Up.pdf', number: 15 },
  { id: '2026-finale', year: 2026, season: 'Finale', title: 'The Great Undoing', pdf: 'pdfs/2026/The Great Undoing Write Up.pdf', number: 16 }
];

const view = document.querySelector('#archive-view');
const search = document.querySelector('#search');
const intro = document.querySelector('.archive-intro');
const filters = {
  year: document.querySelector('#year-filter'),
  season: document.querySelector('#season-filter'),
  main: document.querySelector('#main-filter'),
  other: document.querySelector('#other-filter'),
  theme: document.querySelector('#theme-filter')
};
let trails = [];

function element(tag, className, content) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (content !== undefined) node.textContent = content;
  return node;
}

function link(text, href, className) {
  const node = element('a', className, text);
  node.href = href;
  return node;
}

function addOptions(select, values) {
  [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b)).forEach(value => {
    select.add(new Option(value, value));
  });
}

function seasonFor(trail) {
  return seasons.find(season => trail.id.startsWith(`${season.id}-`));
}

function seasonTrails(season) {
  return trails.filter(trail => trail.id.startsWith(`${season.id}-`));
}

function seasonArtwork(season, headingTag = 'h4') {
  const artwork = element('div', 'season-art');
  const image = document.createElement('img');
  image.src = `assets/season-art/${season.id}.webp`;
  image.alt = `Jonabot and Jonabot Jr exploring ${season.title} (${season.year})`;
  image.loading = 'lazy';
  image.decoding = 'async';
  const overlay = element('div', 'season-art-overlay');
  overlay.append(
    element(headingTag, 'season-art-title', season.title),
    element('span', 'season-art-place', `${season.year} · Canada Water`)
  );
  artwork.append(image, overlay);
  return artwork;
}

function pdfActions(season) {
  const actions = element('div', 'season-pdf-actions');
  const url = new URL(season.pdf, document.baseURI).href;
  const open = link('Open season PDF ↗', url);
  open.target = '_blank';
  open.rel = 'noopener';
  const download = link('Download season PDF ↓', url);
  download.download = `${season.title} ${season.year}.pdf`;
  actions.append(open, download);
  return actions;
}

function trailImage(trail) {
  const box = element('div', `trail-image${trail.image ? '' : ' empty'}`);
  if (trail.image) {
    const image = document.createElement('img');
    image.src = trail.image;
    image.alt = `Illustrated card for ${trail.title}`;
    image.loading = 'lazy';
    box.append(image);
  } else {
    box.append(element('span', '', '✦'), element('small', '', 'PORTRAIT IMAGE TO FOLLOW'));
    box.querySelector('span').setAttribute('aria-hidden', 'true');
  }
  return box;
}

function trailMeta(trail, compact = false) {
  const list = element('dl', 'trail-meta');
  const rows = compact
    ? [['Main character', trail.mainCharacter || 'To be confirmed'], ['Themes', trail.themes.join(', ') || '—']]
    : [['Main character', trail.mainCharacter || 'To be confirmed'], ['Other characters', trail.otherCharacters.join(', ') || '—'], ['Themes', trail.themes.join(', ') || '—']];
  rows.forEach(([label, value]) => list.append(element('dt', '', label), element('dd', '', value)));
  return list;
}

function trailCard(trail, showSeason = false) {
  const card = link('', `#trail/${trail.id}`, 'trail-card trail-card-link');
  const body = element('div', 'trail-card-body');
  body.append(
    element('p', 'trail-number', `TRAIL ${String(trail.number).padStart(2, '0')}${trail.secret ? ' · SECRET TRAIL' : ''}`),
    ...(showSeason ? [element('p', 'trail-card-season', `${trail.seasonTitle} · ${trail.year}`)] : []),
    element('h4', '', trail.title),
    trailMeta(trail, true),
    element('span', 'trail-open', 'Read trail →')
  );
  card.append(trailImage(trail), body);
  return card;
}

function heading(eyebrow, title, description) {
  const wrapper = element('div', 'library-heading');
  const copy = element('div');
  copy.append(element('p', 'eyebrow', eyebrow), element('h2', '', title));
  if (description) copy.append(element('p', 'library-description', description));
  wrapper.append(copy);
  return wrapper;
}

function renderSeasons() {
  intro.hidden = false;
  document.title = 'Canada Water Trails · Phantom Peak Trail Archive';
  view.replaceChildren(heading('THE COLLECTION', 'All seasons', 'Choose a season to see every trail in it.'));
  for (const year of [...new Set(seasons.map(season => season.year))]) {
    const group = element('section', 'season-year-group');
    group.append(element('h3', 'season-year', String(year)));
    const list = element('div', 'season-index');
    seasons.filter(season => season.year === year).forEach(season => {
      const row = link('', `#season/${season.id}`, 'season-index-row');
      const details = element('div', 'season-index-details');
      details.append(
        element('span', 'season-index-count', `${seasonTrails(season).length} trails`),
        element('span', 'season-index-arrow', 'Explore season ↗')
      );
      row.append(seasonArtwork(season), details);
      list.append(row);
    });
    group.append(list);
    view.append(group);
  }
}

function renderSeason(season) {
  intro.hidden = true;
  document.title = `${season.title} ${season.year} · Phantom Peak Trail Archive`;
  const section = element('section', 'season-page');
  section.append(link('← All seasons', '#seasons', 'breadcrumb'));
  section.append(seasonArtwork(season, 'h2'));
  const header = element('div', 'season-section-header');
  const copy = element('div');
  copy.append(
    element('p', 'season-total', `${seasonTrails(season).length} trails`)
  );
  header.append(copy, pdfActions(season));
  section.append(header);
  const grid = element('div', 'trail-grid');
  grid.append(...seasonTrails(season).map(trail => trailCard(trail)));
  section.append(grid);
  view.replaceChildren(section);
}

function renderTrail(trail) {
  const season = seasonFor(trail);
  intro.hidden = true;
  document.title = `${trail.title} · Phantom Peak Trail Archive`;
  const section = element('section', 'trail-page');
  const breadcrumbs = element('nav', 'breadcrumbs');
  breadcrumbs.setAttribute('aria-label', 'Breadcrumb');
  breadcrumbs.append(link('All seasons', '#seasons'), element('span', '', ' / '), link(`${season.title} ${season.year}`, `#season/${season.id}`));
  section.append(breadcrumbs);
  const header = heading(`${season.season.toUpperCase()} / ${season.year} · TRAIL ${String(trail.number).padStart(2, '0')}${trail.secret ? ' · SECRET TRAIL' : ''}`, trail.title);
  section.append(header);
  const detail = element('article', 'trail-detail');
  const copy = element('div', 'trail-detail-copy');
  copy.append(element('h3', '', 'Trail recap'), element('p', 'trail-description', trail.searchText), trailMeta(trail), pdfActions(season));
  detail.append(trailImage(trail), copy);
  section.append(detail);
  view.replaceChildren(section);
}

function matchesFilters(trail) {
  const query = search.value.trim().toLocaleLowerCase();
  const text = [trail.title, trail.seasonTitle, trail.season, trail.year, trail.mainCharacter, ...trail.otherCharacters, ...trail.themes, trail.searchText].join(' ').toLocaleLowerCase();
  return (!query || text.includes(query))
    && (!filters.year.value || String(trail.year) === filters.year.value)
    && (!filters.season.value || trail.season === filters.season.value)
    && (!filters.main.value || trail.mainCharacter === filters.main.value)
    && (!filters.other.value || trail.otherCharacters.includes(filters.other.value))
    && (!filters.theme.value || trail.themes.includes(filters.theme.value));
}

function hasSearch() {
  return Boolean(search.value.trim() || Object.values(filters).some(select => select.value));
}

function renderSearch() {
  intro.hidden = true;
  document.title = 'Search trails · Phantom Peak Trail Archive';
  const matches = hasSearch() ? trails.filter(matchesFilters) : [];
  const section = element('section', 'search-page');
  section.append(heading('SEARCH THE ARCHIVE', 'Search results', `${matches.length} trail${matches.length === 1 ? '' : 's'} found`));
  const clear = element('button', 'clear-filters', 'Clear search and filters');
  clear.type = 'button';
  clear.addEventListener('click', () => {
    search.value = '';
    Object.values(filters).forEach(select => { select.value = ''; });
    location.hash = 'seasons';
    search.focus();
  });
  section.append(clear);
  if (matches.length) {
    const grid = element('div', 'trail-grid');
    grid.append(...matches.map(trail => trailCard(trail, true)));
    section.append(grid);
  } else {
    section.append(element('p', 'no-results', hasSearch() ? 'No trails match that search. Try another name, character, theme or season.' : 'Enter a trail, character, season or theme above to search the archive.'));
  }
  view.replaceChildren(section);
}

function route() {
  const [kind, id] = decodeURIComponent(location.hash.slice(1)).split('/');
  return { kind, id };
}

function render() {
  const { kind, id } = route();
  if (kind !== 'search') {
    search.value = '';
    Object.values(filters).forEach(select => { select.value = ''; });
  }
  if (kind === 'season') {
    const season = seasons.find(item => item.id === id);
    if (season) return renderSeason(season);
  }
  if (kind === 'trail') {
    const trail = trails.find(item => item.id === id);
    if (trail) return renderTrail(trail);
  }
  if (kind === 'search') return renderSearch();
  renderSeasons();
}

async function initialise() {
  try {
    const response = await fetch('trails.json?v=5');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    trails = await response.json();
    addOptions(filters.main, trails.map(trail => trail.mainCharacter));
    addOptions(filters.other, trails.flatMap(trail => trail.otherCharacters));
    addOptions(filters.theme, trails.flatMap(trail => trail.themes));
    function searchChanged() {
      if (hasSearch()) {
        if (location.hash !== '#search') location.hash = 'search';
        else renderSearch();
      } else if (location.hash === '#search') {
        location.hash = 'seasons';
      }
    }
    search.addEventListener('input', searchChanged);
    Object.values(filters).forEach(select => select.addEventListener('change', searchChanged));
    window.addEventListener('hashchange', () => {
      render();
      window.scrollTo(0, 0);
    });
    render();
  } catch {
    view.replaceChildren(element('p', 'no-results', 'The trail index could not load. Please refresh the page.'));
  }
}

initialise();
