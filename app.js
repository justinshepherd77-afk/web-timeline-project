let MAP, EVENTS = [], CURRENT_YEAR = 1500, CURRENT_COUNTRY = null;

const yearSlider = document.getElementById('yearSlider');
const yearLabel = document.getElementById('yearLabel');
const countryList = document.getElementById('countryList');
const summaryPanel = document.getElementById('summaryPanel');
const summaryBody = document.getElementById('summaryBody');
const toCategoriesBtn = document.getElementById('toCategories');
const categoriesPanel = document.getElementById('categoriesPanel');
const categoryButtons = document.getElementById('categoryButtons');
const resultsList = document.getElementById('resultsList');

function initMap() {
  MAP = L.map('map', { zoomControl: true, attributionControl: false }).setView([20, 0], 2);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 6 }).addTo(MAP);
}

function loadData() {
  Papa.parse('data/events.csv', {
    download: true,
    header: true,
    dynamicTyping: true,
    complete: (res) => {
      EVENTS = res.data.filter(r => r && r.title);
      buildCountryButtons();
      refresh();
    }
  });
}

function buildCountryButtons() {
  const countries = [...new Set(EVENTS.map(e => (e.country || '').trim()).filter(Boolean))].sort();
  countryList.innerHTML = '';
  countries.forEach(cty => {
    const btn = document.createElement('button');
    btn.className = 'country-btn';
    btn.textContent = cty;
    btn.addEventListener('click', () => onSelectCountry(cty));
    countryList.appendChild(btn);
  });
}

function onSelectCountry(cty) {
  CURRENT_COUNTRY = cty;
  const pts = EVENTS.filter(e => (e.country||'') === cty && isYearInWindow(e.year));
  if (pts.length) {
    const meanLat = pts.reduce((a,b)=>a+(+b.lat||0),0) / pts.length;
    const meanLng = pts.reduce((a,b)=>a+(+b.lng||0),0) / pts.length;
    MAP.setView([meanLat, meanLng], 5, { animate: true });
  }
  showSummary(cty);
}

function isYearInWindow(y) {
  if (typeof y !== 'number') return false;
  return Math.abs(y - CURRENT_YEAR) <= 2;
}

function refresh() {
  yearLabel.textContent = CURRENT_YEAR >= 0 ? CURRENT_YEAR : `${Math.abs(CURRENT_YEAR)} BCE`;
  if (window.__markers) { window.__markers.forEach(m => MAP.removeLayer(m)); }
  window.__markers = [];

  const visible = EVENTS.filter(e => isYearInWindow(e.year));
  visible.forEach(e => {
    if (e.lat && e.lng) {
      const m = L.marker([e.lat, e.lng]).addTo(MAP);
      m.bindPopup(`<strong>${e.title}</strong><br/>${e.category} • ${e.year}`);
      window.__markers.push(m);
    }
  });
}

function showSummary(cty) {
  summaryPanel.classList.remove('hidden');
  categoriesPanel.classList.add('hidden');
  resultsList.innerHTML = '';
  const local = EVENTS.filter(e => (e.country||'') === cty && isYearInWindow(e.year));
  const count = local.length;
  const sampleTitles = local.slice(0, 3).map(e => e.title).join('; ');
  summaryBody.innerHTML = `<p><strong>${cty}</strong> • ${count} event(s) near ${yearLabel.textContent}.</p>` +
    (count ? `<p>Examples: ${sampleTitles}</p>` : `<p>No entries in this window. Try a nearby year.</p>`);
}

toCategoriesBtn.addEventListener('click', () => {
  categoriesPanel.classList.remove('hidden');
  const local = EVENTS.filter(e => (e.country||'') === CURRENT_COUNTRY && isYearInWindow(e.year));
  const categories = [...new Set(local.map(e => e.category))].filter(Boolean).sort();
  categoryButtons.innerHTML = '';
  categories.forEach(cat => {
    const chip = document.createElement('span');
    chip.className = 'category-chip';
    chip.textContent = cat;
    chip.addEventListener('click', () => showCategory(cat));
    categoryButtons.appendChild(chip);
  });
  if (categories[0]) showCategory(categories[0]);
});

function showCategory(cat) {
  const local = EVENTS.filter(e => (e.country||'') === CURRENT_COUNTRY && isYearInWindow(e.year) && e.category === cat);
  resultsList.innerHTML = '';
  local.forEach(e => {
    const card = document.createElement('div');
    card.className = 'result-card';
    card.innerHTML = `<h4>${e.title}</h4>
      <div>${e.region}</div>
      <div><em>${e.category}</em> • ${e.year}</div>
      <p>${e.summary || ''}</p>`;
    resultsList.appendChild(card);
  });
}

yearSlider.addEventListener('input', (e) => {
  CURRENT_YEAR = parseInt(e.target.value, 10);
  refresh();
});

initMap();
loadData();
