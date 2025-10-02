const WINDOW_SIZE = 25;

let allEvents = [];
let allCategories = [];
let activeFilters = new Set();

async function initTimeSlider() {
    allCategories = await getCategories();
    allEvents = await getAllEvents();

    renderFilterChips();
    updateTimelineEvents(1775);

    const slider = document.getElementById('time-slider');
    const currentYearDisplay = document.getElementById('current-year');

    const debouncedUpdate = debounce((year) => {
        updateTimelineEvents(parseInt(year));
    }, 16);

    slider.addEventListener('input', (e) => {
        const year = parseInt(e.target.value);
        currentYearDisplay.textContent = year < 0 ? `${Math.abs(year)} BCE` : year;
        debouncedUpdate(year);
    });

    slider.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            const currentValue = parseInt(slider.value);
            const step = e.shiftKey ? 10 : 1;
            const newValue = e.key === 'ArrowLeft' ? currentValue - step : currentValue + step;
            slider.value = Math.max(slider.min, Math.min(slider.max, newValue));
            slider.dispatchEvent(new Event('input'));
        }
    });
}

function renderFilterChips() {
    const container = document.getElementById('filter-chips');
    if (!container) return;

    container.innerHTML = allCategories.map(cat => `
        <button
            class="filter-chip"
            data-category="${cat.slug}"
            data-track="filter-toggle"
            aria-pressed="false"
        >
            ${cat.title}
        </button>
    `).join('');

    container.querySelectorAll('.filter-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            toggleFilter(chip.dataset.category, chip);
        });
    });
}

function toggleFilter(category, chipElement) {
    if (activeFilters.has(category)) {
        activeFilters.delete(category);
        chipElement.classList.remove('active');
        chipElement.setAttribute('aria-pressed', 'false');
    } else {
        activeFilters.add(category);
        chipElement.classList.add('active');
        chipElement.setAttribute('aria-pressed', 'true');
    }

    const slider = document.getElementById('time-slider');
    updateTimelineEvents(parseInt(slider.value));
}

function updateTimelineEvents(centerYear) {
    let filteredEvents = allEvents.filter(event => {
        const yearDiff = Math.abs(event.year - centerYear);
        const inWindow = yearDiff <= WINDOW_SIZE;

        if (activeFilters.size === 0) {
            return inWindow;
        }

        return inWindow && activeFilters.has(event.category);
    });

    filteredEvents.sort((a, b) => Math.abs(a.year - centerYear) - Math.abs(b.year - centerYear));

    renderEvents(filteredEvents);
    updateResultsInfo(filteredEvents.length, centerYear);
}

function renderEvents(events) {
    const container = document.getElementById('timeline-events');
    if (!container) return;

    if (events.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--color-text-light);">No events found in this time period</p>';
        return;
    }

    container.innerHTML = events.map(event => {
        const category = allCategories.find(c => c.slug === event.category);
        return `
            <div class="event-card" data-event-id="${event.id}" style="--category-color: ${category?.color || 'var(--color-primary)'}" tabindex="0" role="button">
                <h4>${event.title}</h4>
                <p class="event-year">${event.year < 0 ? `${Math.abs(event.year)} BCE` : event.year}</p>
                <p class="event-summary">${event.summary}</p>
            </div>
        `;
    }).join('');

    container.querySelectorAll('.event-card').forEach(card => {
        applyStreak(card);
        fadeInUp(card);

        card.addEventListener('click', () => showEventModal(card.dataset.eventId));
        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showEventModal(card.dataset.eventId);
            }
        });
    });
}

function showEventModal(eventId) {
    const event = allEvents.find(e => e.id === eventId);
    if (!event) return;

    const details = `
        <h3 id="event-modal-title">${event.title}</h3>
        <p class="event-date"><strong>Date:</strong> ${event.date || event.year}</p>
        ${event.location ? `<p class="event-location"><strong>Location:</strong> ${event.location}</p>` : ''}
        <p class="event-summary-full">${event.summary}</p>
        ${event.links && event.links.length > 0 ? `
            <div class="event-links">
                <h4>Learn More:</h4>
                ${event.links.map(link => `<a href="${link.url}" target="_blank" rel="noopener">${link.label}</a>`).join('')}
            </div>
        ` : ''}
        <a href="/library.html?event=${event.id}" class="btn btn-secondary" style="margin-top: 16px; display: inline-block;">Open in Library</a>
    `;

    document.getElementById('event-details').innerHTML = details;
    openModal('event-modal');
}

function updateResultsInfo(count, year) {
    const info = document.getElementById('results-info');
    if (!info) return;

    const yearDisplay = year < 0 ? `${Math.abs(year)} BCE` : year;
    const filterText = activeFilters.size > 0 ? ` (filtered)` : '';
    info.textContent = `Showing ${count} event${count !== 1 ? 's' : ''} near ${yearDisplay}${filterText}`;
}

if (document.getElementById('time-slider')) {
    initTimeSlider();
}
