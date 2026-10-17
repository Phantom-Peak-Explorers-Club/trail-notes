const seasons = [
  { id: '2022-launch', year: 2022, season: 'Launch', title: 'Pilot Season', pdf: 'pdfs/2022/Season 0 Write Up.pdf' },
  { id: '2022-autumn', year: 2022, season: 'Autumn', title: 'Hallowed Peak', pdf: 'pdfs/2022/Hallowed Peak 22 Write Up.pdf' },
  { id: '2022-winter', year: 2022, season: 'Winter', title: 'Wintermas', pdf: 'pdfs/2022/Wintermas Phantom Peak 22 Write Up.pdf' },
  { id: '2023-spring', year: 2023, season: 'Spring', title: 'Platypus Parade', pdf: 'pdfs/2023/Platypus Parade Write Up.pdf' },
  { id: '2023-summer', year: 2023, season: 'Summer', title: "Summer's Peak", pdf: "pdfs/2023/Summer's Peak Write Up.pdf" },
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

const list = document.querySelector('#season-list');
const search = document.querySelector('#search');
const filters = {
  year: document.querySelector('#year-filter'),
  season: document.querySelector('#season-filter'),
  main: document.querySelector('#main-filter'),
  other: document.querySelector('#other-filter'),
  theme: document.querySelector('#theme-filter')
};
const count = document.querySelector('#results-count');
const noResults = document.querySelector('#no-results');
let trails = [];

function addOptions(select, values) {
  [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b)).forEach(value => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    select.append(option);
  });
}

function pdfLink(pdf) {
  return new URL(pdf, document.baseURI).href;
}

function trailCard(trail) {
  const card = document.createElement('article');
  card.className = 'trail-card';
  const imageBox = document.createElement('div');
  imageBox.className = 'trail-image';
  if (trail.image) {
    const image = document.createElement('img');
    image.src = trail.image;
    image.alt = `Artwork for ${trail.title}`;
    image.loading = 'lazy';
    imageBox.append(image);
  } else {
    imageBox.classList.add('empty');
    imageBox.innerHTML = '<span aria-hidden="true">✦</span><small>TRAIL IMAGE TO FOLLOW</small>';
  }

  const body = document.createElement('div');
  body.className = 'trail-card-body';
  const number = document.createElement('p');
  number.className = 'trail-number';
  number.textContent = `TRAIL ${String(trail.number).padStart(2, '0')}${trail.secret ? ' · SECRET TRAIL' : ''}`;
  const title = document.createElement('h4');
  title.textContent = trail.title;
  const summary = document.createElement('p');
  summary.className = 'trail-summary';
  summary.textContent = trail.summary;
  body.append(number, title, summary);

  const meta = document.createElement('dl');
  meta.className = 'trail-meta';
  const rows = [
    ['Main character', trail.mainCharacter || 'To be confirmed'],
    ['Other characters', trail.otherCharacters.length ? trail.otherCharacters.slice(0, 5).join(', ') + (trail.otherCharacters.length > 5 ? ` +${trail.otherCharacters.length - 5}` : '') : '—'],
    ['Themes', trail.themes.length ? trail.themes.join(', ') : '—']
  ];
  rows.forEach(([label, value]) => {
    const dt = document.createElement('dt');
    dt.textContent = label;
    const dd = document.createElement('dd');
    dd.textContent = value;
    meta.append(dt, dd);
  });
  body.append(meta);

  const details = document.createElement('details');
  details.className = 'trail-details';
  const toggle = document.createElement('summary');
  toggle.textContent = 'Read trail recap';
  const full = document.createElement('p');
  full.textContent = trail.searchText;
  details.append(toggle, full);
  body.append(details);
  card.append(imageBox, body);
  return card;
}

function seasonSection(season, matches, filtered) {
  const section = document.createElement('section');
  section.className = `season-section ${season.season.toLowerCase()}`;
  section.id = season.id;
  const header = document.createElement('div');
  header.className = 'season-section-header';
  const identity = document.createElement('div');
  const eyebrow = document.createElement('p');
  eyebrow.className = 'eyebrow';
  eyebrow.textContent = `${season.number ? `SEASON ${season.number} · ` : ''}${season.season.toUpperCase()} / ${season.year}`;
  const title = document.createElement('h3');
  title.textContent = season.title;
  const total = document.createElement('p');
  total.className = 'season-total';
  total.textContent = season.pending ? 'Write-up in progress' : `${matches.length} trail${matches.length === 1 ? '' : 's'}${filtered ? ' found' : ''}`;
  identity.append(eyebrow, title, total);
  header.append(identity);
  if (season.pdf) {
    const actions = document.createElement('div');
    actions.className = 'season-pdf-actions';
    const open = document.createElement('a');
    open.href = pdfLink(season.pdf);
    open.target = '_blank';
    open.rel = 'noopener';
    open.textContent = 'Open season PDF ↗';
    const download = document.createElement('a');
    download.href = pdfLink(season.pdf);
    download.download = `${season.title} ${season.year}.pdf`;
    download.textContent = 'Download season PDF ↓';
    actions.append(open, download);
    header.append(actions);
  }
  section.append(header);
  if (season.pending) {
    const note = document.createElement('p');
    note.className = 'pending-season';
    note.textContent = 'The trail notes for this season will be added here when its write-up is ready.';
    section.append(note);
  } else {
    const cards = document.createElement('div');
    cards.className = 'trail-grid';
    cards.append(...matches.map(trailCard));
    section.append(cards);
  }
  return section;
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

function render() {
  const matches = trails.filter(matchesFilters);
  const filtered = Boolean(search.value.trim() || Object.values(filters).some(select => select.value));
  const sections = seasons.filter(season => {
    if (season.pending) return !filtered;
    return matches.some(trail => trail.id.startsWith(`${season.id}-`));
  }).map(season => seasonSection(season, matches.filter(trail => trail.id.startsWith(`${season.id}-`)), filtered));
  list.replaceChildren(...sections);
  count.textContent = `${matches.length} trail${matches.length === 1 ? '' : 's'} ${filtered ? 'found' : 'indexed'} across ${sections.filter(section => !section.querySelector('.pending-season')).length} season write-ups`;
  noResults.hidden = matches.length !== 0;
}

async function initialise() {
  try {
    const response = await fetch('trails.json?v=2');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    trails = await response.json();
    addOptions(filters.main, trails.map(trail => trail.mainCharacter));
    addOptions(filters.other, trails.flatMap(trail => trail.otherCharacters));
    addOptions(filters.theme, trails.flatMap(trail => trail.themes));
    search.addEventListener('input', render);
    Object.values(filters).forEach(select => select.addEventListener('change', render));
    document.querySelector('#clear-filters').addEventListener('click', () => {
      search.value = '';
      Object.values(filters).forEach(select => { select.value = ''; });
      render();
      search.focus();
    });
    render();
  } catch {
    count.textContent = 'The trail index could not load. Please refresh the page.';
  }
}

initialise();
