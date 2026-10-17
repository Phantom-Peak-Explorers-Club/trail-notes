const writeups = [
  { year: 2022, season: 'Launch', title: 'Season 0', file: 'Season 0 Write Up.pdf', kind: 'special', symbol: '✦' },
  { year: 2022, season: 'Autumn', title: 'Hallowed Peak', file: 'Hallowed Peak 22 Write Up.pdf', kind: 'autumn', symbol: '☾' },
  { year: 2022, season: 'Winter', title: 'Wintermas', file: 'Wintermas Phantom Peak 22 Write Up.pdf', kind: 'winter', symbol: '✳' },
  { year: 2023, season: 'Spring', title: 'Platypus Parade', file: 'Platypus Parade Write Up.pdf', kind: 'spring', symbol: '✿' },
  { year: 2023, season: 'Summer', title: "Summer's Peak", file: "Summer's Peak Write Up.pdf", kind: 'summer', symbol: '☼' },
  { year: 2023, season: 'Autumn', title: 'Hallowed Peak', file: '2023 Hallowed Peak Write Up.pdf', kind: 'autumn', symbol: '☾' },
  { year: 2023, season: 'Winter', title: 'Christmas at the Peak', file: '2023 Christmas At The Peak Write Up.pdf', kind: 'winter', symbol: '✳' },
  { year: 2023, season: 'Special events', title: 'Special Event Trails', file: '2023 Special Event Trail Write Ups.pdf', kind: 'special', symbol: '✦' },
  { year: 2024, season: 'Spring', title: 'Festival of Innovation', file: '2024 Spring At The Peak Write Up.pdf', kind: 'spring', symbol: '✿' },
  { year: 2024, season: 'Summer', title: 'Summer at the Peak', file: '2024 Summer At The Peak Write Up.pdf', kind: 'summer', symbol: '☼' },
  { year: 2024, season: 'Autumn', title: 'Hallowed Peak', file: '2024 Hallowed Peak Write Up.pdf', kind: 'autumn', symbol: '☾' },
  { year: 2024, season: 'Winter', title: 'Wintermas', file: '2024 Wintermas Write Up.pdf', kind: 'winter', symbol: '✳' },
  { year: 2025, season: 'Spring', title: 'JONACON', file: '2025 Spring - Jonacon Write Up.pdf', kind: 'spring', symbol: '✿' },
  { year: 2025, season: 'Summer', title: 'Burning Blimp', file: '2025 Summer - Burning Blimp Write Up.pdf', kind: 'summer', symbol: '☼' },
  { year: 2025, season: 'Autumn', title: 'Autumn 2025', kind: 'autumn', symbol: '☾', pending: true },
  { year: 2025, season: 'Winter', title: 'Winter 2025', kind: 'winter', symbol: '✳', pending: true }
];

const grid = document.querySelector('#season-grid');
const search = document.querySelector('#search');
const count = document.querySelector('#results-count');
const noResults = document.querySelector('#no-results');
const filters = [...document.querySelectorAll('.year-filter')];
const dialog = document.querySelector('#reader');
const frame = document.querySelector('#reader-frame');
const readerTitle = document.querySelector('#reader-title');
const readerOpen = document.querySelector('#reader-open');
const readerDownload = document.querySelector('#reader-download');
let selectedYear = 'all';

function pdfUrl(item) {
  return `pdfs/${item.year}/${encodeURIComponent(item.file)}`;
}

function openReader(item) {
  const url = pdfUrl(item);
  readerTitle.textContent = `${item.title} · ${item.year}`;
  readerOpen.href = url;
  readerDownload.href = url;
  frame.src = `${url}#view=FitH`;
  frame.title = `${item.title} ${item.year} PDF`;
  dialog.showModal();
  document.querySelector('#reader-close').focus();
}

function renderCard(item) {
  const card = document.createElement('article');
  card.className = `season-card ${item.kind}${item.pending ? ' pending' : ''}`;
  const top = document.createElement('div');
  top.className = 'season-top';
  const tag = document.createElement('span');
  tag.className = 'season-tag';
  tag.textContent = `${item.season} / ${item.year}`;
  const symbol = document.createElement('span');
  symbol.className = 'season-symbol';
  symbol.setAttribute('aria-hidden', 'true');
  symbol.textContent = item.symbol;
  top.append(tag, symbol);
  const middle = document.createElement('div');
  const title = document.createElement('h3');
  title.textContent = item.title;
  const description = document.createElement('p');
  description.textContent = item.pending ? 'Write-up to be added from the season notes.' : 'Original trail write-up · PDF';
  middle.append(title, description);
  card.append(top, middle);
  if (item.pending) {
    const pending = document.createElement('span');
    pending.className = 'pending-label';
    pending.textContent = 'WRITE-UP IN PROGRESS';
    card.append(pending);
  } else {
    const action = document.createElement('button');
    action.type = 'button';
    action.className = 'season-action';
    action.textContent = 'Read write-up ↗';
    action.setAttribute('aria-label', `Read ${item.title}, ${item.year} PDF`);
    action.addEventListener('click', () => openReader(item));
    card.append(action);
  }
  return card;
}

function render() {
  const query = search.value.trim().toLocaleLowerCase();
  const items = writeups.filter(item => {
    const yearMatches = selectedYear === 'all' || String(item.year) === selectedYear;
    const queryMatches = `${item.title} ${item.season} ${item.year}`.toLocaleLowerCase().includes(query);
    return yearMatches && queryMatches;
  });
  grid.replaceChildren(...items.map(renderCard));
  const available = items.filter(item => !item.pending).length;
  count.textContent = `${available} write-up${available === 1 ? '' : 's'} available${items.some(item => item.pending) ? ` · ${items.length - available} in progress` : ''}`;
  noResults.hidden = items.length !== 0;
}

filters.forEach(filter => filter.addEventListener('click', () => {
  selectedYear = filter.dataset.year;
  filters.forEach(button => {
    const active = button === filter;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  render();
}));
search.addEventListener('input', render);
document.querySelector('#reader-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
dialog.addEventListener('close', () => { frame.removeAttribute('src'); });
render();
