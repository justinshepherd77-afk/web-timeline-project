document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById("yearSlider");
  const label = document.getElementById("yearLabel");
  const eventsDiv = document.getElementById("events");

  function loadEvents(year) {
    fetch("timeline.csv")
      .then(response => response.text())
      .then(text => {
        const rows = text.trim().split("\n").slice(1);
        const events = rows.map(row => {
          const [y, title, category, description] = row.split(",");
          return { year: parseInt(y), title, category, description };
        });
        const filtered = events.filter(e => e.year <= year && e.year >= year - 5);
        eventsDiv.innerHTML = filtered.map(e => `<p><b>${e.year} - ${e.title}</b> (${e.category}): ${e.description}</p>`).join("");
      });
  }

  slider.addEventListener("input", () => {
    label.textContent = slider.value;
    loadEvents(parseInt(slider.value));
  });

  loadEvents(parseInt(slider.value));
});