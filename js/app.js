/**
 * ============================================================
 *  SPOTIFY CLONE — app.js
 *  Pure Vanilla JavaScript · No frameworks · No dependencies
 *
 *  Architecture:
 *  1.  Song Data
 *  2.  State Management
 *  3.  DOM Reference Cache
 *  4.  Audio Engine
 *  5.  Playback Controls (play, pause, next, prev)
 *  6.  Seek Bar Logic
 *  7.  Volume Logic
 *  8.  Shuffle & Repeat
 *  9.  Render: Tracklist
 *  10. Render: Sidebar Playlists
 *  11. Render: Queue
 *  12. Render: Hero Section
 *  13. Render: Player Bar
 *  14. Render: Now Playing Panel
 *  15. Search & Filter
 *  16. Toast Notifications
 *  17. Local Storage
 *  18. Keyboard Shortcuts
 *  19. Mobile / Sidebar Drawer
 *  20. Now Playing Panel Toggle
 *  21. Like (Favourite) Toggle
 *  22. Filter Pills (decorative)
 *  23. Hero Play Button
 *  24. Fullscreen Toggle
 *  25. Loading Overlay
 *  26. Initialise
 * ============================================================
 */

'use strict';

/* ─────────────────────────────────────────────
   1. SONG DATA
   Real songs use royalty-free public-domain
   tracks. Images use reliable placeholder URLs.
───────────────────────────────────────────── */
const SONGS = [
  {
    id: 1,
    title: 'Chill Lofi Vibes',
    artist: 'LoFi Dreams',
    album: 'Study Session Vol.1',
    duration: 187,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/song1/300/300',
    color: '#1a5276',
  },
  {
    id: 2,
    title: 'Electric Midnight',
    artist: 'NeonPulse',
    album: 'Synthwave Nights',
    duration: 215,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/song2/300/300',
    color: '#6c3483',
  },
  {
    id: 3,
    title: 'Ocean Breeze',
    artist: 'Coastal Tones',
    album: 'Natural Sounds',
    duration: 243,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/song3/300/300',
    color: '#117a65',
  },
  {
    id: 4,
    title: 'Urban Jungle',
    artist: 'City Beats',
    album: 'Metro Collection',
    duration: 198,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    cover: 'https://picsum.photos/seed/song4/300/300',
    color: '#b7950b',
  },
  {
    id: 5,
    title: 'Midnight Jazz',
    artist: 'Blue Note Ensemble',
    album: 'Late Night Sessions',
    duration: 312,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    cover: 'https://picsum.photos/seed/song5/300/300',
    color: '#1a237e',
  },
  {
    id: 6,
    title: 'Desert Wind',
    artist: 'Nomad Soul',
    album: 'Horizons',
    duration: 267,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    cover: 'https://picsum.photos/seed/song6/300/300',
    color: '#7e5109',
  },
  {
    id: 7,
    title: 'Digital Rain',
    artist: 'ByteWave',
    album: 'Code & Sound',
    duration: 223,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    cover: 'https://picsum.photos/seed/song7/300/300',
    color: '#145a32',
  },
  {
    id: 8,
    title: 'Rooftop Sunset',
    artist: 'Golden Hour',
    album: 'Skyline Views',
    duration: 278,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    cover: 'https://picsum.photos/seed/song8/300/300',
    color: '#922b21',
  },
  {
    id: 9,
    title: 'Forest Path',
    artist: 'Ambient Walk',
    album: 'Nature Walks',
    duration: 302,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    cover: 'https://picsum.photos/seed/song9/300/300',
    color: '#1d4a1d',
  },
  {
    id: 10,
    title: 'Starfall',
    artist: 'Cosmic Drift',
    album: 'Interstellar EP',
    duration: 255,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    cover: 'https://picsum.photos/seed/song10/300/300',
    color: '#0d3349',
  },
  {
    id: 11,
    title: 'Retro Funk',
    artist: 'Groove Machine',
    album: 'Funk Factory',
    duration: 231,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
    cover: 'https://picsum.photos/seed/song11/300/300',
    color: '#6e2f1a',
  },
  {
    id: 12,
    title: 'Morning Coffee',
    artist: 'Acoustic Sunrise',
    album: 'Quiet Mornings',
    duration: 194,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
    cover: 'https://picsum.photos/seed/song12/300/300',
    color: '#4a235a',
  },
];

/* ─────────────────────────────────────────────
   2. STATE MANAGEMENT
───────────────────────────────────────────── */
const state = {
  currentIndex:    0,      // Index in filteredSongs
  isPlaying:       false,
  isShuffle:       false,
  repeatMode:      'none', // 'none' | 'all' | 'one'
  volume:          0.8,
  isMuted:         false,
  previousVolume:  0.8,
  filteredSongs:   [...SONGS],
  searchQuery:     '',
  likedSongs:      new Set(),
  isPanelOpen:     false,
  shuffleOrder:    [],     // Shuffled index list
  shufflePosition: 0,      // Current position in shuffleOrder
};

/* ─────────────────────────────────────────────
   3. DOM REFERENCE CACHE
   Cache all DOM queries once at startup
───────────────────────────────────────────── */
const dom = {};

function cacheDom() {
  const ids = [
    'app', 'sidebar', 'hamburger', 'sidebar-backdrop',
    'sidebar-playlists', 'hero', 'hero-bg', 'hero-cover',
    'hero-title', 'hero-desc', 'hero-stats', 'hero-play-btn',
    'tracklist', 'empty-state', 'search-input', 'search-clear',
    'player-cover', 'player-title', 'player-artist',
    'player-like-btn', 'play-pause-btn', 'play-icon',
    'prev-btn', 'next-btn', 'shuffle-btn', 'repeat-btn',
    'seek-bar', 'seek-fill', 'seek-thumb', 'current-time', 'total-time',
    'volume-bar', 'volume-fill', 'volume-thumb', 'volume-icon',
    'mute-btn', 'now-playing-panel', 'close-panel',
    'open-panel-btn', 'now-playing-toggle',
    'panel-cover', 'panel-title', 'panel-artist', 'panel-like-btn',
    'panel-seek-bar', 'panel-fill', 'panel-thumb',
    'panel-current', 'panel-duration',
    'queue-list', 'toast-container', 'loading-overlay',
    'fullscreen-btn', 'btn-back', 'btn-forward',
  ];

  ids.forEach(id => {
    // Convert kebab-case to camelCase for the dom object key
    const key = id.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    dom[key] = document.getElementById(id);
  });
}

/* ─────────────────────────────────────────────
   4. AUDIO ENGINE
───────────────────────────────────────────── */
const audio = new Audio();
audio.preload = 'metadata';

/** Load song at given index into the audio element */
function loadSong(index) {
  if (index < 0 || index >= state.filteredSongs.length) return;

  const song = state.filteredSongs[index];
  state.currentIndex = index;

  // Pause before switching source
  audio.pause();
  audio.src = song.src;
  audio.volume = state.isMuted ? 0 : state.volume;
  audio.load();

  updateAllUI();
  updateHero(song);
  renderQueue();
  updateSidebarActiveItem(song);
  saveToLocalStorage();
}

/** Audio event: time update → sync all seek bars */
audio.addEventListener('timeupdate', () => {
  const { currentTime, duration } = audio;
  if (!duration || isNaN(duration)) return;

  const pct = (currentTime / duration) * 100;

  setBarProgress(dom.seekFill, dom.seekThumb, pct);
  setBarProgress(dom.panelFill, dom.panelThumb, pct);

  dom.currentTime.textContent = formatTime(currentTime);
  dom.totalTime.textContent   = formatTime(duration);
  dom.panelCurrent.textContent = formatTime(currentTime);
  dom.panelDuration.textContent = formatTime(duration);

  // Update ARIA value
  dom.seekBar.setAttribute('aria-valuenow', Math.round(pct));
  dom.panelSeekBar.setAttribute('aria-valuenow', Math.round(pct));

  // Auto-save position every 5 seconds
  if (Math.round(currentTime) % 5 === 0) saveToLocalStorage();
});

/** Audio event: song ended */
audio.addEventListener('ended', onSongEnded);

/** Audio event: metadata loaded → update duration display */
audio.addEventListener('loadedmetadata', () => {
  dom.totalTime.textContent    = formatTime(audio.duration);
  dom.panelDuration.textContent = formatTime(audio.duration);
  dom.seekBar.setAttribute('aria-valuemax', Math.round(audio.duration));
});

/** Audio event: error */
audio.addEventListener('error', () => {
  showToast('Could not load audio. Trying next track…', 'ri-error-warning-line');
  setTimeout(playNext, 1500);
});

/** Called when a song finishes naturally */
function onSongEnded() {
  if (state.repeatMode === 'one') {
    audio.currentTime = 0;
    audio.play().catch(() => {});
    return;
  }

  if (state.repeatMode === 'all' || hasNextSong()) {
    playNext();
  } else {
    // Reached end of playlist
    state.isPlaying = false;
    updatePlayPauseUI();
    updateTrackRowsUI();
    showToast('End of playlist', 'ri-check-line');
  }
}

/** Returns true if there is a next song available */
function hasNextSong() {
  if (state.isShuffle) return true;
  return state.currentIndex < state.filteredSongs.length - 1;
}

/* ─────────────────────────────────────────────
   5. PLAYBACK CONTROLS
───────────────────────────────────────────── */
function togglePlayPause() {
  if (!state.filteredSongs.length) return;

  if (!audio.src || audio.src === window.location.href) {
    loadSong(state.currentIndex);
  }

  if (state.isPlaying) {
    audio.pause();
    state.isPlaying = false;
  } else {
    audio.play().then(() => {
      state.isPlaying = true;
    }).catch(err => {
      console.warn('Playback error:', err);
      showToast('Tap again to start playback', 'ri-music-line');
    });
  }

  updatePlayPauseUI();
  updateTrackRowsUI();
  updateCoverSpin();
}

function playSongAtIndex(index) {
  loadSong(index);
  audio.play().then(() => {
    state.isPlaying = true;
    updatePlayPauseUI();
    updateTrackRowsUI();
    updateCoverSpin();
    showToast(`Now playing: ${state.filteredSongs[index].title}`, 'ri-music-2-line');
  }).catch(err => {
    console.warn('Playback error:', err);
    state.isPlaying = false;
    updatePlayPauseUI();
  });
}

function playNext() {
  let nextIndex;

  if (state.isShuffle) {
    state.shufflePosition = (state.shufflePosition + 1) % state.shuffleOrder.length;
    nextIndex = state.shuffleOrder[state.shufflePosition];
  } else {
    nextIndex = state.currentIndex + 1;
    if (nextIndex >= state.filteredSongs.length) {
      if (state.repeatMode === 'all') nextIndex = 0;
      else return;
    }
  }

  playSongAtIndex(nextIndex);
}

function playPrev() {
  // If more than 3 seconds in, restart current song
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }

  let prevIndex;

  if (state.isShuffle) {
    state.shufflePosition = (state.shufflePosition - 1 + state.shuffleOrder.length) % state.shuffleOrder.length;
    prevIndex = state.shuffleOrder[state.shufflePosition];
  } else {
    prevIndex = state.currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = state.repeatMode === 'all' ? state.filteredSongs.length - 1 : 0;
    }
  }

  playSongAtIndex(prevIndex);
}

/* ─────────────────────────────────────────────
   6. SEEK BAR LOGIC
───────────────────────────────────────────── */
/** Generalised seek bar interaction — works for both main and panel bars */
function initSeekBar(barEl) {
  let isDragging = false;

  function seek(e) {
    const rect = barEl.querySelector('.progress-bar__track').getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    if (audio.duration) {
      audio.currentTime = pct * audio.duration;
    }
  }

  barEl.addEventListener('mousedown', e => { isDragging = true; seek(e); });
  barEl.addEventListener('touchstart', e => { isDragging = true; seek(e); }, { passive: true });

  document.addEventListener('mousemove', e => { if (isDragging) seek(e); });
  document.addEventListener('touchmove', e => { if (isDragging) seek(e); }, { passive: true });

  document.addEventListener('mouseup',  () => { isDragging = false; });
  document.addEventListener('touchend', () => { isDragging = false; });

  // Keyboard seek (←/→ when focused)
  barEl.addEventListener('keydown', e => {
    if (!audio.duration) return;
    if (e.key === 'ArrowRight') audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
    if (e.key === 'ArrowLeft')  audio.currentTime = Math.max(0, audio.currentTime - 5);
  });
}

/** Update the visual fill and thumb position of a progress bar */
function setBarProgress(fillEl, thumbEl, pct) {
  if (!fillEl || !thumbEl) return;
  fillEl.style.width   = `${pct}%`;
  thumbEl.style.left   = `${pct}%`;
}

/* ─────────────────────────────────────────────
   7. VOLUME LOGIC
───────────────────────────────────────────── */
function initVolumeBar() {
  let isDragging = false;

  function setVol(e) {
    const rect = dom.volumeBar.querySelector('.progress-bar__track').getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));

    state.volume = pct;
    state.previousVolume = pct;
    state.isMuted = pct === 0;
    applyVolume();
    saveToLocalStorage();
  }

  dom.volumeBar.addEventListener('mousedown', e => { isDragging = true; setVol(e); });
  dom.volumeBar.addEventListener('touchstart', e => { isDragging = true; setVol(e); }, { passive: true });

  document.addEventListener('mousemove', e => { if (isDragging) setVol(e); });
  document.addEventListener('touchmove', e => { if (isDragging) setVol(e); }, { passive: true });

  document.addEventListener('mouseup',  () => { isDragging = false; });
  document.addEventListener('touchend', () => { isDragging = false; });

  dom.volumeBar.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { state.volume = Math.min(1, state.volume + 0.05); applyVolume(); }
    if (e.key === 'ArrowLeft')  { state.volume = Math.max(0, state.volume - 0.05); applyVolume(); }
  });
}

function applyVolume() {
  audio.volume = state.isMuted ? 0 : state.volume;
  const pct = state.isMuted ? 0 : state.volume * 100;
  setBarProgress(dom.volumeFill, dom.volumeThumb, pct);
  dom.volumeBar.setAttribute('aria-valuenow', Math.round(pct));
  updateVolumeIcon();
}

function toggleMute() {
  if (state.isMuted) {
    state.isMuted = false;
    state.volume  = state.previousVolume || 0.5;
  } else {
    state.previousVolume = state.volume;
    state.isMuted = true;
  }
  applyVolume();
  dom.muteBtn.setAttribute('aria-pressed', state.isMuted);
}

function updateVolumeIcon() {
  const v = state.isMuted ? 0 : state.volume;
  const icon = dom.volumeIcon;
  icon.className = v === 0   ? 'ri-volume-mute-line'
                 : v < 0.35  ? 'ri-volume-down-line'
                 : v < 0.7   ? 'ri-volume-up-line'
                              : 'ri-volume-up-fill';
}

/* ─────────────────────────────────────────────
   8. SHUFFLE & REPEAT
───────────────────────────────────────────── */
function toggleShuffle() {
  state.isShuffle = !state.isShuffle;

  if (state.isShuffle) {
    generateShuffleOrder();
    showToast('Shuffle on', 'ri-shuffle-line');
  } else {
    showToast('Shuffle off', 'ri-shuffle-line');
  }

  dom.shuffleBtn.classList.toggle('ctrl-btn--active', state.isShuffle);
  dom.shuffleBtn.setAttribute('aria-pressed', state.isShuffle);
  saveToLocalStorage();
}

function generateShuffleOrder() {
  const indices = state.filteredSongs.map((_, i) => i);
  // Fisher-Yates shuffle
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  state.shuffleOrder    = indices;
  state.shufflePosition = indices.indexOf(state.currentIndex);
}

function cycleRepeat() {
  const modes = ['none', 'all', 'one'];
  const idx = modes.indexOf(state.repeatMode);
  state.repeatMode = modes[(idx + 1) % modes.length];

  const labels  = { none: 'Repeat off', all: 'Repeat all', one: 'Repeat one' };
  const icons   = { none: 'ri-repeat-line', all: 'ri-repeat-2-line', one: 'ri-repeat-one-line' };
  const toasts  = { none: 'Repeat off', all: 'Repeat all', one: 'Repeat one' };

  dom.repeatBtn.querySelector('i').className = icons[state.repeatMode];
  dom.repeatBtn.setAttribute('aria-label', labels[state.repeatMode]);
  dom.repeatBtn.classList.toggle('ctrl-btn--active', state.repeatMode !== 'none');

  showToast(toasts[state.repeatMode], icons[state.repeatMode]);
  saveToLocalStorage();
}

/* ─────────────────────────────────────────────
   9. RENDER: TRACKLIST
───────────────────────────────────────────── */
function renderTracklist(songs = state.filteredSongs) {
  const list = dom.tracklist;
  list.innerHTML = '';

  if (!songs.length) {
    dom.emptyState.hidden = false;
    return;
  }

  dom.emptyState.hidden = true;
  const currentSong = state.filteredSongs[state.currentIndex];

  const fragment = document.createDocumentFragment();

  songs.forEach((song, idx) => {
    const isActive  = currentSong && song.id === currentSong.id;
    const isPlaying = isActive && state.isPlaying;
    const isLiked   = state.likedSongs.has(song.id);

    const li = document.createElement('li');
    li.className = `track-row${isActive ? ' is-playing' : ''}${isActive && !isPlaying ? ' is-paused' : ''}`;
    li.setAttribute('role', 'listitem');
    li.setAttribute('tabindex', '0');
    li.setAttribute('aria-label', `${song.title} by ${song.artist}`);
    li.dataset.songId = song.id;

    li.innerHTML = `
      <div class="track-row__num">
        <span class="track-row__number">${idx + 1}</span>
        <i class="track-row__play-icon ${isActive && isPlaying ? 'ri-pause-fill' : 'ri-play-fill'}" aria-hidden="true"></i>
      </div>
      <div class="track-row__info">
        <img src="${song.cover}" alt="${song.title} cover"
             class="track-row__img" loading="lazy"
             onerror="this.src='https://picsum.photos/seed/fallback/300/300'" />
        <div class="track-row__text">
          <span class="track-row__title">${escapeHtml(song.title)}</span>
          <span class="track-row__artist">${escapeHtml(song.artist)}</span>
        </div>
      </div>
      <span class="track-row__album">${escapeHtml(song.album)}</span>
      <div class="track-row__duration-wrap">
        <button class="icon-btn track-row__like${isLiked ? ' is-liked' : ''}"
                aria-label="${isLiked ? 'Unlike' : 'Like'} ${escapeHtml(song.title)}"
                aria-pressed="${isLiked}"
                data-song-id="${song.id}">
          <i class="${isLiked ? 'ri-heart-fill' : 'ri-heart-line'}" aria-hidden="true"></i>
        </button>
        <span class="track-row__duration">${formatTime(song.duration)}</span>
      </div>
    `;

    // Click row → play song
    li.addEventListener('click', e => {
      if (e.target.closest('.track-row__like')) return; // handled separately
      const realIndex = state.filteredSongs.indexOf(song);
      if (isActive) {
        togglePlayPause();
      } else {
        playSongAtIndex(realIndex);
      }
    });

    // Keyboard: Enter/Space → play
    li.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        li.click();
      }
    });

    // Like button on row
    li.querySelector('.track-row__like').addEventListener('click', e => {
      e.stopPropagation();
      toggleLike(song.id);
    });

    fragment.appendChild(li);
  });

  list.appendChild(fragment);
}

/** Refresh just the active/playing classes without full re-render */
function updateTrackRowsUI() {
  const currentSong = state.filteredSongs[state.currentIndex];
  document.querySelectorAll('.track-row').forEach(row => {
    const rowId  = parseInt(row.dataset.songId, 10);
    const isActive  = currentSong && rowId === currentSong.id;
    const isPlaying = isActive && state.isPlaying;

    row.classList.toggle('is-playing', isActive);
    row.classList.toggle('is-paused',  isActive && !isPlaying);

    const icon = row.querySelector('.track-row__play-icon');
    if (icon) {
      icon.className = `track-row__play-icon ${isActive && isPlaying ? 'ri-pause-fill' : 'ri-play-fill'}`;
    }
  });
}

/* ─────────────────────────────────────────────
   10. RENDER: SIDEBAR PLAYLISTS
───────────────────────────────────────────── */
function renderSidebarPlaylists() {
  const list = dom.sidebarPlaylists;
  list.innerHTML = '';

  SONGS.forEach(song => {
    const isActive = state.filteredSongs[state.currentIndex]?.id === song.id;
    const li = document.createElement('li');
    li.className = `sidebar__playlist-item${isActive ? ' is-active' : ''}`;
    li.setAttribute('role', 'listitem');
    li.setAttribute('tabindex', '0');
    li.setAttribute('aria-label', `${song.title} by ${song.artist}`);
    li.dataset.songId = song.id;

    li.innerHTML = `
      <img src="${song.cover}" alt="" class="sidebar__playlist-img" loading="lazy"
           onerror="this.src='https://picsum.photos/seed/fallback/300/300'" />
      <div class="sidebar__playlist-meta">
        <span class="sidebar__playlist-name">${escapeHtml(song.title)}</span>
        <span class="sidebar__playlist-type">${escapeHtml(song.artist)}</span>
      </div>
      ${isActive ? '<div class="sidebar__eq"><span></span><span></span><span></span></div>' : ''}
    `;

    li.addEventListener('click', () => {
      const idx = state.filteredSongs.findIndex(s => s.id === song.id);
      if (idx !== -1) playSongAtIndex(idx);
    });

    li.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); li.click(); }
    });

    list.appendChild(li);
  });
}

function updateSidebarActiveItem(song) {
  document.querySelectorAll('.sidebar__playlist-item').forEach(item => {
    const isActive = parseInt(item.dataset.songId, 10) === song.id;
    item.classList.toggle('is-active', isActive);
    const existingEq = item.querySelector('.sidebar__eq');
    if (isActive && !existingEq) {
      const eq = document.createElement('div');
      eq.className = 'sidebar__eq';
      eq.innerHTML = '<span></span><span></span><span></span>';
      item.appendChild(eq);
    } else if (!isActive && existingEq) {
      existingEq.remove();
    }
  });
}

/* ─────────────────────────────────────────────
   11. RENDER: QUEUE
───────────────────────────────────────────── */
function renderQueue() {
  const list = dom.queueList;
  list.innerHTML = '';

  const total  = state.filteredSongs.length;
  const start  = (state.currentIndex + 1) % total;
  const count  = Math.min(5, total - 1);
  const queue  = [];

  for (let i = 0; i < count; i++) {
    queue.push(state.filteredSongs[(start + i) % total]);
  }

  if (!queue.length) {
    list.innerHTML = '<li style="color:var(--text-muted);font-size:13px;padding:8px">Queue is empty</li>';
    return;
  }

  queue.forEach(song => {
    const li = document.createElement('li');
    li.className = 'queue__item';
    li.setAttribute('role', 'listitem');
    li.setAttribute('tabindex', '0');

    li.innerHTML = `
      <img src="${song.cover}" alt="" class="queue__item-img" loading="lazy"
           onerror="this.src='https://picsum.photos/seed/fallback/300/300'" />
      <div class="queue__item-meta">
        <span class="queue__item-title">${escapeHtml(song.title)}</span>
        <span class="queue__item-artist">${escapeHtml(song.artist)}</span>
      </div>
    `;

    li.addEventListener('click', () => {
      const idx = state.filteredSongs.indexOf(song);
      if (idx !== -1) playSongAtIndex(idx);
    });

    list.appendChild(li);
  });
}

/* ─────────────────────────────────────────────
   12. RENDER: HERO SECTION
───────────────────────────────────────────── */
function updateHero(song) {
  if (!song) return;

  dom.heroTitle.textContent   = song.title;
  dom.heroDesc.textContent    = `${song.artist} · ${song.album}`;
  dom.heroStats.textContent   = `${SONGS.length} songs · ${formatTime(SONGS.reduce((a, s) => a + s.duration, 0))}`;
  dom.heroCover.src           = song.cover;
  dom.heroCover.alt           = `${song.title} album cover`;

  // Animate the gradient background
  dom.heroBg.style.setProperty('--hero-color', song.color || '#1a5276');

  // Pulse play button if playing
  dom.heroPlayBtn.classList.toggle('is-playing', state.isPlaying);
  const icon = dom.heroPlayBtn.querySelector('i');
  icon.className = state.isPlaying ? 'ri-pause-fill' : 'ri-play-fill';
}

/* ─────────────────────────────────────────────
   13. RENDER: PLAYER BAR
───────────────────────────────────────────── */
function updatePlayerBar(song) {
  if (!song) return;

  dom.playerCover.src    = song.cover;
  dom.playerCover.alt    = `${song.title} cover`;
  dom.playerTitle.textContent  = song.title;
  dom.playerArtist.textContent = song.artist;

  // Sync like button
  const liked = state.likedSongs.has(song.id);
  syncLikeButton(dom.playerLikeBtn, liked);
}

function updatePlayPauseUI() {
  const playing = state.isPlaying;
  dom.playIcon.className = playing ? 'ri-pause-fill' : 'ri-play-fill';
  dom.playPauseBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play');
  dom.playPauseBtn.setAttribute('aria-pressed', playing);

  // Hero button
  const song = state.filteredSongs[state.currentIndex];
  if (song) {
    const heroIcon = dom.heroPlayBtn.querySelector('i');
    heroIcon.className = playing ? 'ri-pause-fill' : 'ri-play-fill';
    dom.heroPlayBtn.classList.toggle('is-playing', playing);
  }
}

/* ─────────────────────────────────────────────
   14. RENDER: NOW PLAYING PANEL
───────────────────────────────────────────── */
function updateNowPlayingPanel(song) {
  if (!song) return;

  dom.panelCover.src    = song.cover;
  dom.panelCover.alt    = `${song.title} cover`;
  dom.panelTitle.textContent  = song.title;
  dom.panelArtist.textContent = song.artist;

  // Like sync
  const liked = state.likedSongs.has(song.id);
  syncLikeButton(dom.panelLikeBtn, liked);
}

function updateCoverSpin() {
  dom.panelCover.classList.toggle('is-spinning', state.isPlaying);
  dom.panelCover.classList.toggle('is-paused',   !state.isPlaying);
}

/** Master UI update — called after loading a new song */
function updateAllUI() {
  const song = state.filteredSongs[state.currentIndex];
  if (!song) return;

  updatePlayerBar(song);
  updateNowPlayingPanel(song);
  updatePlayPauseUI();
  updateTrackRowsUI();
  updateCoverSpin();

  // Reset times
  dom.currentTime.textContent   = '0:00';
  dom.totalTime.textContent     = formatTime(song.duration);
  dom.panelCurrent.textContent  = '0:00';
  dom.panelDuration.textContent = formatTime(song.duration);

  setBarProgress(dom.seekFill, dom.seekThumb, 0);
  setBarProgress(dom.panelFill, dom.panelThumb, 0);
}

/* ─────────────────────────────────────────────
   15. SEARCH & FILTER
───────────────────────────────────────────── */
function handleSearch(query) {
  state.searchQuery = query.trim().toLowerCase();

  if (!state.searchQuery) {
    state.filteredSongs = [...SONGS];
    dom.searchClear.hidden = true;
  } else {
    state.filteredSongs = SONGS.filter(s =>
      s.title.toLowerCase().includes(state.searchQuery) ||
      s.artist.toLowerCase().includes(state.searchQuery) ||
      s.album.toLowerCase().includes(state.searchQuery)
    );
    dom.searchClear.hidden = false;
  }

  // Adjust currentIndex to new filtered array
  const currentSong = SONGS[state.currentIndex] || SONGS[0];
  const newIdx = state.filteredSongs.findIndex(s => s.id === currentSong.id);
  state.currentIndex = newIdx !== -1 ? newIdx : 0;

  renderTracklist();
}

/* ─────────────────────────────────────────────
   16. TOAST NOTIFICATIONS
───────────────────────────────────────────── */
function showToast(message, iconClass = 'ri-music-line') {
  const container = dom.toastContainer;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<i class="${iconClass}" aria-hidden="true"></i><span>${escapeHtml(message)}</span>`;

  container.appendChild(toast);

  // Auto-remove after 2.5s
  setTimeout(() => {
    toast.classList.add('toast--out');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  }, 2500);
}

/* ─────────────────────────────────────────────
   17. LOCAL STORAGE
───────────────────────────────────────────── */
const LS_KEY = 'spotifyClone_v1';

function saveToLocalStorage() {
  try {
    const currentSong = state.filteredSongs[state.currentIndex];
    const data = {
      songId:       currentSong?.id,
      position:     audio.currentTime || 0,
      volume:       state.volume,
      isMuted:      state.isMuted,
      isShuffle:    state.isShuffle,
      repeatMode:   state.repeatMode,
      likedSongs:   [...state.likedSongs],
    };
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  } catch (e) {
    // localStorage may be unavailable (incognito, quota exceeded)
    console.warn('LocalStorage save failed:', e);
  }
}

function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return;

    const data = JSON.parse(raw);

    // Restore liked songs
    if (Array.isArray(data.likedSongs)) {
      state.likedSongs = new Set(data.likedSongs);
    }

    // Restore volume
    if (typeof data.volume === 'number') {
      state.volume = data.volume;
      state.isMuted = !!data.isMuted;
    }

    // Restore shuffle / repeat
    if (data.isShuffle) {
      state.isShuffle = true;
      dom.shuffleBtn.classList.add('ctrl-btn--active');
      dom.shuffleBtn.setAttribute('aria-pressed', 'true');
    }

    if (data.repeatMode) {
      state.repeatMode = data.repeatMode;
      const icons = { none: 'ri-repeat-line', all: 'ri-repeat-2-line', one: 'ri-repeat-one-line' };
      dom.repeatBtn.querySelector('i').className = icons[state.repeatMode];
      dom.repeatBtn.classList.toggle('ctrl-btn--active', state.repeatMode !== 'none');
    }

    // Restore last played song
    if (data.songId) {
      const idx = SONGS.findIndex(s => s.id === data.songId);
      if (idx !== -1) {
        state.currentIndex = idx;
        const song = SONGS[idx];
        audio.src = song.src;
        audio.volume = state.isMuted ? 0 : state.volume;

        // Restore position (don't autoplay — require user gesture)
        if (data.position && data.position > 0) {
          audio.addEventListener('loadedmetadata', () => {
            audio.currentTime = data.position;
          }, { once: true });
          audio.load();
        }
      }
    }

    applyVolume();
  } catch (e) {
    console.warn('LocalStorage load failed:', e);
  }
}

/* ─────────────────────────────────────────────
   18. KEYBOARD SHORTCUTS
───────────────────────────────────────────── */
function initKeyboardShortcuts() {
  document.addEventListener('keydown', e => {
    // Don't intercept when typing in the search box
    if (document.activeElement === dom.searchInput) return;
    // Don't intercept when focus is on a progress bar (handled there)
    if (e.target.classList.contains('progress-bar')) return;

    switch (e.code) {
      case 'Space':
        e.preventDefault();
        togglePlayPause();
        break;
      case 'ArrowRight':
        if (e.shiftKey) {
          playNext();
        } else {
          e.preventDefault();
          if (audio.duration) audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
        }
        break;
      case 'ArrowLeft':
        if (e.shiftKey) {
          playPrev();
        } else {
          e.preventDefault();
          if (audio.duration) audio.currentTime = Math.max(0, audio.currentTime - 5);
        }
        break;
      case 'ArrowUp':
        state.volume = Math.min(1, state.volume + 0.1);
        state.isMuted = false;
        applyVolume();
        break;
      case 'ArrowDown':
        state.volume = Math.max(0, state.volume - 0.1);
        applyVolume();
        break;
      case 'KeyM':
        toggleMute();
        break;
      case 'KeyS':
        if (e.ctrlKey || e.metaKey) break; // don't block Ctrl+S
        toggleShuffle();
        break;
      case 'KeyR':
        cycleRepeat();
        break;
    }
  });
}

/* ─────────────────────────────────────────────
   19. MOBILE SIDEBAR DRAWER
───────────────────────────────────────────── */
function initMobileSidebar() {
  dom.hamburger.addEventListener('click', () => {
    const isOpen = dom.sidebar.classList.toggle('is-open');
    dom.hamburger.setAttribute('aria-expanded', isOpen);
    dom.sidebarBackdrop.classList.toggle('is-visible', isOpen);
    dom.sidebarBackdrop.removeAttribute('aria-hidden');
    dom.sidebarBackdrop.setAttribute('aria-hidden', !isOpen);
    // Update icon
    dom.hamburger.querySelector('i').className = isOpen ? 'ri-close-line' : 'ri-menu-line';
  });

  dom.sidebarBackdrop.addEventListener('click', closeSidebar);

  // Close sidebar on nav link click (mobile)
  dom.sidebar.querySelectorAll('.sidebar__nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) closeSidebar();
    });
  });
}

function closeSidebar() {
  dom.sidebar.classList.remove('is-open');
  dom.hamburger.setAttribute('aria-expanded', 'false');
  dom.sidebarBackdrop.classList.remove('is-visible');
  dom.sidebarBackdrop.setAttribute('aria-hidden', 'true');
  dom.hamburger.querySelector('i').className = 'ri-menu-line';
}

/* ─────────────────────────────────────────────
   20. NOW PLAYING PANEL TOGGLE
───────────────────────────────────────────── */
function openPanel() {
  state.isPanelOpen = true;
  dom.app.classList.add('panel-open');
  dom.nowPlayingPanel.removeAttribute('aria-hidden');
  dom.nowPlayingToggle.classList.add('ctrl-btn--active');
  dom.openPanelBtn.querySelector('i').className = 'ri-arrow-down-line';
  updateNowPlayingPanel(state.filteredSongs[state.currentIndex]);
  updateCoverSpin();
}

function closePanel() {
  state.isPanelOpen = false;
  dom.app.classList.remove('panel-open');
  dom.nowPlayingPanel.setAttribute('aria-hidden', 'true');
  dom.nowPlayingToggle.classList.remove('ctrl-btn--active');
  dom.openPanelBtn.querySelector('i').className = 'ri-arrow-up-line';
}

function togglePanel() {
  state.isPanelOpen ? closePanel() : openPanel();
}

function initPanelToggle() {
  dom.nowPlayingToggle.addEventListener('click', togglePanel);
  dom.openPanelBtn.addEventListener('click', togglePanel);
  dom.closePanel.addEventListener('click', closePanel);
}

/* ─────────────────────────────────────────────
   21. LIKE (FAVOURITE) TOGGLE
───────────────────────────────────────────── */
function toggleLike(songId) {
  if (state.likedSongs.has(songId)) {
    state.likedSongs.delete(songId);
    showToast('Removed from Liked Songs', 'ri-heart-line');
  } else {
    state.likedSongs.add(songId);
    showToast('Added to Liked Songs', 'ri-heart-fill');
  }

  const liked = state.likedSongs.has(songId);
  const song  = state.filteredSongs[state.currentIndex];

  // Sync all like buttons for this song
  if (song?.id === songId) {
    syncLikeButton(dom.playerLikeBtn, liked);
    syncLikeButton(dom.panelLikeBtn,  liked);
  }

  // Update the row like button
  const rowLikeBtn = document.querySelector(`.track-row[data-song-id="${songId}"] .track-row__like`);
  if (rowLikeBtn) {
    syncLikeButton(rowLikeBtn, liked);
  }

  saveToLocalStorage();
}

function syncLikeButton(btn, liked) {
  if (!btn) return;
  btn.classList.toggle('is-liked', liked);
  btn.setAttribute('aria-pressed', liked);
  btn.setAttribute('aria-label',   liked ? 'Unlike' : 'Like');
  btn.querySelector('i').className = liked ? 'ri-heart-fill' : 'ri-heart-line';
  btn.querySelector('i').style.color = liked ? 'var(--clr-green)' : '';
}

/* ─────────────────────────────────────────────
   22. FILTER PILLS (DECORATIVE)
───────────────────────────────────────────── */
function initFilterPills() {
  document.querySelectorAll('.sidebar__filter .filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.sidebar__filter .filter-pill').forEach(p => {
        p.classList.remove('filter-pill--active');
        p.setAttribute('aria-pressed', 'false');
      });
      pill.classList.add('filter-pill--active');
      pill.setAttribute('aria-pressed', 'true');
    });
  });
}

/* ─────────────────────────────────────────────
   23. HERO PLAY BUTTON
───────────────────────────────────────────── */
function initHeroPlay() {
  dom.heroPlayBtn.addEventListener('click', () => {
    if (!state.isPlaying && (!audio.src || audio.src === window.location.href)) {
      playSongAtIndex(state.currentIndex);
    } else {
      togglePlayPause();
    }
  });
}

/* ─────────────────────────────────────────────
   24. FULLSCREEN TOGGLE
───────────────────────────────────────────── */
function initFullscreen() {
  dom.fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      dom.fullscreenBtn.querySelector('i').className = 'ri-fullscreen-exit-line';
    } else {
      document.exitFullscreen().catch(() => {});
      dom.fullscreenBtn.querySelector('i').className = 'ri-fullscreen-line';
    }
  });
}

/* ─────────────────────────────────────────────
   25. LOADING OVERLAY
───────────────────────────────────────────── */
function hideLoadingOverlay() {
  const overlay = dom.loadingOverlay;
  overlay.classList.add('fade-out');
  overlay.addEventListener('transitionend', () => {
    overlay.setAttribute('aria-hidden', 'true');
    overlay.style.display = 'none';
  }, { once: true });
}

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
/** Format seconds → M:SS */
function formatTime(secs) {
  if (!secs || isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/** Sanitise user-visible strings to prevent XSS */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ─────────────────────────────────────────────
   26. INITIALISE
───────────────────────────────────────────── */
function init() {
  cacheDom();
  loadFromLocalStorage();

  // Render everything
  renderTracklist();
  renderSidebarPlaylists();
  renderQueue();

  // Load the initial song (no autoplay — respects browser policies)
  const song = state.filteredSongs[state.currentIndex] || SONGS[0];
  updateHero(song);
  updatePlayerBar(song);
  updateNowPlayingPanel(song);
  applyVolume();

  // Seek bars
  initSeekBar(dom.seekBar);
  initSeekBar(dom.panelSeekBar);
  initVolumeBar();

  // Control buttons
  dom.playPauseBtn.addEventListener('click', togglePlayPause);
  dom.prevBtn.addEventListener('click', playPrev);
  dom.nextBtn.addEventListener('click', playNext);
  dom.shuffleBtn.addEventListener('click', toggleShuffle);
  dom.repeatBtn.addEventListener('click', cycleRepeat);
  dom.muteBtn.addEventListener('click', toggleMute);

  // Player like
  dom.playerLikeBtn.addEventListener('click', () => {
    const song = state.filteredSongs[state.currentIndex];
    if (song) toggleLike(song.id);
  });

  // Panel like
  dom.panelLikeBtn.addEventListener('click', () => {
    const song = state.filteredSongs[state.currentIndex];
    if (song) toggleLike(song.id);
  });

  // Search
  dom.searchInput.addEventListener('input', e => handleSearch(e.target.value));
  dom.searchClear.addEventListener('click', () => {
    dom.searchInput.value = '';
    handleSearch('');
    dom.searchInput.focus();
  });

  // Mobile sidebar
  initMobileSidebar();

  // Panel
  initPanelToggle();

  // Hero
  initHeroPlay();

  // Filter pills
  initFilterPills();

  // Fullscreen
  initFullscreen();

  // Keyboard
  initKeyboardShortcuts();

  // History nav buttons (decorative in this demo)
  dom.btnBack.addEventListener('click', () => showToast('Back', 'ri-arrow-left-line'));
  dom.btnForward.addEventListener('click', () => showToast('Forward', 'ri-arrow-right-line'));

  // Hide loading overlay once fonts + images are ready
  if (document.readyState === 'complete') {
    hideLoadingOverlay();
  } else {
    window.addEventListener('load', hideLoadingOverlay, { once: true });
  }
}

// Boot the app
document.addEventListener('DOMContentLoaded', init);
