async function loadJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error loading JSON from ${url}:`, error);
        return null;
    }
}

async function getCategories() {
    const data = await loadJSON('content/categories.json');
    return data ? data.categories : [];
}

async function getEventsByCategory(slug) {
    const data = await loadJSON(`content/events/${slug}.json`);
    return data ? data.events : [];
}

async function getAllEvents() {
    const categories = await getCategories();
    const eventPromises = categories.map(cat => getEventsByCategory(cat.slug));
    const eventArrays = await Promise.all(eventPromises);
    return eventArrays.flat();
}

async function getEventById(eventId) {
    const allEvents = await getAllEvents();
    return allEvents.find(event => event.id === eventId);
}
