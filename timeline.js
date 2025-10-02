document.addEventListener("DOMContentLoaded", () => {
  const slider = document.getElementById("yearSlider");
  const label = document.getElementById("yearLabel");
  const eventsDiv = document.getElementById("events");

  function loadEvents(year) {
    fetch("timeline.csv")
      .then(response => {
        if (!response.ok) {
          throw new Error("CSV file not found");
        }
        return response.text();
      })
      .then(text => {
        const rows = text.trim().split("\n").slice(1);
        const events = rows.map(row => {
          const parts = row.split(",");
          const y = parseInt(parts[0]);
          const title = parts[1];
          const category = parts[2];
          const description = parts.slice(3).join(",");
          return { year: y, title, category, description };
        });
        const filtered = events.filter(e => e.year <= year && e.year >= year - 5);
        eventsDiv.innerHTML = filtered.map(e =>
          `<p><b>${e.year} - ${e.title}</b> (${e.category}): ${e.description}</p>`
        ).join("");
      })
      .catch(err => {
        eventsDiv.innerHTML = `<p style="color:red;">Error loading events: ${err.message}</p>`;
      });
  }

  slider.addEventListener("input", () => {
    label.textContent = slider.value;
    label.classList.add("active"); 
    loadEvents(parseInt(slider.value));

    clearTimeout(slider._timeout);
    slider._timeout = setTimeout(() => {
      label.classList.remove("active");
    }, 500);
  });

  loadEvents(parseInt(slider.value));
});