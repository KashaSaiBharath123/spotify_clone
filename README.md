# 🎵 Spotify Clone — Responsive Music Player

A fully responsive, Spotify-inspired music player built with pure **HTML5**, **CSS3**, and **Vanilla JavaScript**. Zero frameworks. Zero dependencies (beyond icon fonts).

---

## ✨ Features

### Core Playback
- ▶️ Play / Pause / Next / Previous
- 🔀 Shuffle (Fisher-Yates algorithm)
- 🔁 Repeat: Off → All → One
- 🔊 Volume control + Mute/Unmute
- ⏩ Seek bar — drag or click to any position
- ⌛ Live current time + total duration display

### Playlist & UI
- Dynamic playlist rendered from a JavaScript array
- Highlighted active track with animated EQ bars
- Click any song to instantly play
- Real-time search (filters by title, artist, album)
- Now Playing panel with album art rotation
- Queue preview (up to 5 upcoming tracks)
- Hero section with dynamic background color per song

### Advanced
- 💾 **LocalStorage** — saves last played song, position, volume, shuffle, repeat, liked songs
- 🔔 **Toast notifications** for all state changes
- ♿ Full **accessibility**: ARIA roles, labels, keyboard navigation
- ⌨️ **Keyboard shortcuts** (see below)
- 📱 **Fully responsive**: Mobile → Tablet → Desktop

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play / Pause |
| `→` | Seek forward 5 seconds |
| `←` | Seek backward 5 seconds |
| `Shift + →` | Next song |
| `Shift + ←` | Previous song |
| `↑` | Volume up |
| `↓` | Volume down |
| `M` | Toggle mute |
| `S` | Toggle shuffle |
| `R` | Cycle repeat mode |

---

## 📁 Folder Structure

```
spotify-clone/
├── index.html          ← App shell, semantic HTML5
├── css/
│   └── style.css       ← All styles, CSS variables, responsive
├── js/
│   └── app.js          ← All logic, state, audio engine
├── assets/
│   ├── images/         ← Place custom album art here
│   └── songs/          ← Place MP3 files here
└── README.md
```

---

## 🏗️ Architecture

### State Management
A single `state` object holds all runtime data (current index, isPlaying, shuffle, repeat, volume, liked songs, filtered songs). Every UI function reads from this object and writes back through dedicated setter functions — a flux-like pattern without a framework.

### Audio Engine
The native `<audio>` element handles all playback. Event listeners (`timeupdate`, `ended`, `error`, `loadedmetadata`) keep the UI perfectly in sync.

### Modular JavaScript
Each concern lives in its own clearly-commented section:
- **Playback Controls** — play, pause, next, prev with edge-case handling
- **Seek Logic** — pointer + touch events, ARIA slider values
- **Volume Logic** — drag + keyboard, mute toggle, icon state
- **Render Functions** — each render function is pure (takes state, writes DOM)
- **LocalStorage** — serialise/deserialise with graceful fallback

### CSS Architecture
- CSS Custom Properties (design tokens) for every color, spacing, and breakpoint
- BEM-inspired naming (`.block__element--modifier`)
- No inline styles in JS — only class toggles and CSS variable overrides
- Three responsive breakpoints: 480px, 768px, 1024px

---

## 🚀 GitHub Pages Deployment

1. **Create a repository** on GitHub (e.g. `spotify-clone`)

2. **Push the project**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Spotify Clone"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/spotify-clone.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - Go to your repo → **Settings** → **Pages**
   - Source: **Deploy from a branch**
   - Branch: `main` / `root`
   - Click **Save**

4. Your site is live at:
   ```
   https://YOUR_USERNAME.github.io/spotify-clone/
   ```

> ℹ️ The project uses only relative paths, so it works without any build step.

---

## 🎵 Adding Real Songs

Replace the `SONGS` array entries in `js/app.js`:

```js
{
  id: 1,
  title: 'Your Song Title',
  artist: 'Artist Name',
  album: 'Album Name',
  duration: 210,                          // seconds
  src: 'assets/songs/your-song.mp3',      // local or CDN URL
  cover: 'assets/images/your-cover.jpg',  // local or CDN URL
  color: '#1a5276',                       // hero background color
}
```

---

## 🛠️ Tech Stack

| Technology | Usage |
|-----------|-------|
| HTML5 `<audio>` | Native audio engine |
| CSS Custom Properties | Design token system |
| CSS Grid + Flexbox | All layouts |
| Vanilla JS ES6+ | State, events, DOM |
| RemixIcon | Icon font (CDN) |
| Google Fonts (Inter) | Typography |
| Web Storage API | Persistence |

---

## 📝 License

MIT — free to use, modify, and deploy.
