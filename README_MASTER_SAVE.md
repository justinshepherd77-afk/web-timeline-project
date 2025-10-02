# World Timeline - Master Documentation

Version 1.0 - October 2025

## Project Summary

World Timeline is an interactive educational website that blends a "Grand Library" UI with an engaging timeline/globe experience. Built as a fast, accessible MVP, it allows users to explore historical events through multiple interfaces: a categorized library view, an interactive timeline with a DeLorean-style slider, and teacher tools for classroom use.

## Key Features

### Pages & Routes

1. **Landing (/)** - Hero section with navigation to main features
2. **Library (/library.html)** - Categorized grid view of historical events
3. **Timeline (/timeline.html)** - Interactive timeline with year slider and filtering
4. **Teacher Mode (/teacher.html)** - Classroom tools (code generator, quiz builder, filters)
5. **Feedback (/feedback.html)** - User feedback form with Netlify Forms integration

### Animations & Effects

- **Fire Trail Streak**: Brief animation when timeline events appear (250ms)
- **Fade In Up**: Smooth entrance animation for cards (200-250ms)
- **Parallax Background**: Subtle movement on scroll
- **Globe Rotation**: Slow 90-second rotation animation
- **Card Hover Effects**: Scale transforms and shadow depth changes

## Data Schema

### Categories (content/categories.json)

```json
{
  "categories": [
    {
      "slug": "art",
      "title": "Art",
      "color": "#7A5CFA",
      "icon": "assets/icons/art.svg"
    }
  ]
}
```

### Events (content/events/{category}.json)

```json
{
  "events": [
    {
      "id": "unique-event-id",
      "category": "war",
      "title": "Event Title",
      "year": 1775,
      "date": "1775-04-19",
      "summary": "Brief description of the event",
      "location": "Location name",
      "coords": [latitude, longitude],
      "links": [
        {"label": "Link Text", "url": "https://example.com"}
      ],
      "media": {"thumb": "assets/img/thumbnail.jpg"},
      "tags": ["tag1", "tag2", "tag3"]
    }
  ]
}
```

## How to Add New Events

1. Determine the appropriate category for your event (art, war, politics, culture, science, funny)
2. Open the corresponding file in `content/events/{category}.json`
3. Add a new event object with all required fields:
   - **id**: Unique identifier (use kebab-case: "category-name-year")
   - **category**: Must match the category slug
   - **title**: Clear, descriptive title
   - **year**: Numeric year (negative for BCE)
   - **date**: ISO format date if known (YYYY-MM-DD)
   - **summary**: 1-2 sentence description
   - **location**: Geographic location
   - **coords**: [latitude, longitude] for future map features
   - **links**: Array of related resources
   - **tags**: Keywords for search functionality

### Example Addition

```json
{
  "id": "moon-landing-1969",
  "category": "science",
  "title": "Apollo 11 Moon Landing",
  "year": 1969,
  "date": "1969-07-20",
  "summary": "First crewed mission to land on the Moon, with astronauts Neil Armstrong and Buzz Aldrin.",
  "location": "Moon",
  "coords": [0, 0],
  "links": [
    {"label": "NASA Archive", "url": "https://www.nasa.gov/mission_pages/apollo/apollo11.html"}
  ],
  "media": {"thumb": "assets/img/apollo11.jpg"},
  "tags": ["space", "nasa", "moon", "apollo"]
}
```

## How to Add New Categories

1. Open `content/categories.json`
2. Add a new category object with:
   - **slug**: URL-friendly identifier (lowercase, no spaces)
   - **title**: Display name
   - **color**: Hex color code for theming
   - **icon**: Path to SVG icon (create in `assets/icons/`)
3. Create a new file: `content/events/{slug}.json`
4. Add your events to the new category file

## Timeline Configuration

### Adjusting the Time Window

The timeline shows events within ±25 years of the selected year by default. To modify:

1. Open `scripts/timeslider.js`
2. Find the constant: `const WINDOW_SIZE = 25;`
3. Change the value (larger = more events shown, smaller = more focused view)

### Modifying the Year Range

Current range: 3000 BCE to 2025 CE

To adjust:
1. Open `timeline.html`
2. Find the slider input: `<input type="range" id="time-slider">`
3. Modify `min` and `max` attributes
4. Update slider marks in the HTML

## Animation Customization

### Adjusting Animation Speed

In `assets/css/styles.css`:

```css
/* Streak animation duration */
@keyframes streak {
  /* Change animation: duration from 0.25s */
}

/* Fade in up duration */
.fade-in-up {
  animation: fadeInUp 0.4s ease forwards;
  /* Change 0.4s to desired duration */
}

/* Globe rotation speed */
@keyframes globeRotate {
  /* Currently 90s for one rotation */
  /* Increase for slower, decrease for faster */
}
```

### Hover Effect Intensity

Modify scale and shadow in `assets/css/styles.css`:

```css
.category-card:hover {
  transform: scale(1.03); /* Increase for more dramatic effect */
  box-shadow: var(--shadow-lg);
}
```

## Running Locally

This is a static site with no build process:

1. Use any local server (Python, Node http-server, VS Code Live Server)
2. Example with Python:
   ```bash
   python -m http.server 8000
   ```
3. Open browser to `http://localhost:8000`

## Deploying to Netlify

### Option 1: Drag & Drop
1. Zip the project folder
2. Go to Netlify dashboard
3. Drag and drop the zip file

### Option 2: Git Integration
1. Push code to GitHub repository
2. Connect repository in Netlify dashboard
3. Deploy settings:
   - Build command: (leave empty)
   - Publish directory: `/`
4. Enable Netlify Forms in site settings

### Netlify Forms Setup

The feedback form uses Netlify Forms. Ensure:
- Forms have `data-netlify="true"` attribute
- Hidden input with `name="form-name"` value matches form name
- Deploy to Netlify for forms to function (won't work locally)

## File Organization

```
/
├── index.html              # Landing page
├── library.html            # Library browser
├── timeline.html           # Interactive timeline
├── teacher.html            # Teacher tools
├── feedback.html           # Feedback form
├── netlify.toml           # Netlify configuration
├── package.json           # Project metadata
├── README_MASTER_SAVE.md  # This file
├── assets/
│   ├── css/
│   │   └── styles.css     # All styles with CSS variables
│   ├── icons/             # Category SVG icons
│   └── img/               # Event thumbnails (add as needed)
├── scripts/
│   ├── app.js             # Core utilities & modal management
│   ├── data.js            # JSON loading functions
│   ├── animations.js      # Animation helpers
│   ├── timeslider.js      # Timeline slider logic
│   └── teacher.js         # Teacher mode functionality
└── content/
    ├── categories.json    # Category definitions
    ├── events/            # Event data by category
    │   ├── art.json
    │   ├── war.json
    │   ├── politics.json
    │   ├── culture.json
    │   ├── science.json
    │   └── funny.json
    ├── teacher/           # Saved quizzes (user-generated)
    └── feedback/          # Feedback submissions (Netlify)
```

## Performance Notes

- Target: Lighthouse 90+ on mobile
- No heavy frameworks (vanilla JS only)
- Images use `loading="lazy"` attribute
- CSS animations use GPU-accelerated properties
- Debounced slider input (16ms) for smooth performance

## Accessibility Features

- Keyboard navigation support (Tab, Enter, Space, Arrow keys)
- ARIA labels and roles on interactive elements
- Live region for timeline results announcement
- Focus management in modals
- Minimum 44px touch targets for mobile
- Color contrast ratios meet WCAG AA standards

## Browser Support

Tested and supported:
- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile Safari iOS 13+
- Chrome Android (latest)

## Future Roadmap

### v1.1 - Interactive Globe
- Clickable 3D globe with event markers
- City-level zoom functionality
- Geographic filtering

### v1.2 - Teacher Authentication
- User accounts for teachers
- Save and share classroom codes
- Student progress tracking
- Quiz analytics

### v1.3 - Enhanced Search
- Server-side full-text search
- Advanced filters (date ranges, keywords)
- Related events suggestions
- Bookmarking system

### v1.4 - Content Expansion
- User-submitted events (moderated)
- Multimedia support (videos, audio)
- Primary source documents
- Interactive timelines by theme

## Development Decisions

### Why Vanilla JavaScript?
- Faster load times (no framework overhead)
- Easier for contributors to understand
- Sufficient for MVP feature set
- Better performance on mobile devices

### Why Static Site?
- Simple deployment (no server required)
- Fast page loads
- Easy to host anywhere
- Lower costs for scaling

### Why Netlify Forms?
- No backend code needed
- Built-in spam protection
- Easy to implement
- Scalable solution

## Troubleshooting

### Events not appearing on timeline
- Check that event year is within slider range (-3000 to 2025)
- Verify event category matches a defined category slug
- Ensure JSON syntax is valid (no trailing commas)

### Animations not working
- Check browser console for JavaScript errors
- Verify CSS class names match between HTML and CSS
- Clear browser cache and reload

### Forms not submitting
- Netlify Forms only work when deployed to Netlify
- Verify `data-netlify="true"` attribute is present
- Check Netlify dashboard for form submissions

### Search not finding events
- Search looks at title, summary, and tags fields
- Ensure events have relevant tags
- Search is case-insensitive

## Contributing Guidelines

When adding content:
1. Verify historical accuracy with reputable sources
2. Include at least one reference link
3. Write neutral, educational descriptions
4. Use consistent formatting and style
5. Test locally before deploying

## Credits

- Built with the help of ChatGPT
- Icons: Custom SVG illustrations
- Design inspiration: Modern library and museum websites
- Historical data: Various public domain and educational sources

## License

MIT License - Free to use and modify for educational purposes.

---

For questions or issues, please use the feedback form on the website or contact the project maintainers.
