const trackListEl = document.getElementById('track-list');
const audio = document.getElementById('audio');
const playBtn = document.getElementById('play');
const playIcon = document.getElementById('play-icon');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const trackTitle = document.getElementById('track-title');
const trackArtist = document.getElementById('track-artist');
const coverImg = document.getElementById('cover');
const progressBar = document.getElementById('progress-bar');
const progressSvg = document.getElementById('progress-svg');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');

let tracks = [
    { title: "Не хочу", artist: "dontlose X kurokov", file: "tracks/track1.mp3", cover: "images/track1.jpg" },
    { title: "Любила", artist: "dontlose", file: "tracks/track2.mp3", cover: "images/track2.jpg" },
    { title: "Руки", artist: "dontlose", file: "tracks/track3.mp3", cover: "images/track3.jpg" },
    { title: "Типаж", artist: "dontlose", file: "tracks/track4.mp3", cover: "images/track4.jpg" },
    { title: "Сломал", artist: "dontlose", file: "tracks/track5.mp3", cover: "images/track5.jpg" },
    { title: "Шрамы", artist: "dontlose", file: "tracks/track6.mp3", cover: "images/track6.jpg" }
];

let currentIndex = 0;

// Рендер списка треков
function renderTrackList() {
    trackListEl.innerHTML = '';
    tracks.forEach((track, i) => {
        const li = document.createElement('li');
        li.innerHTML = `<img src="${track.cover}" alt="Cover"><span>${track.title} — ${track.artist}</span>`;
        li.addEventListener('click', () => {
            loadTrack(i);
            playAudio();
        });
        trackListEl.appendChild(li);
    });
    highlightActive();
}

// Загрузка трека
function loadTrack(index) {
    currentIndex = index;
    audio.src = tracks[index].file;
    trackTitle.textContent = tracks[index].title;
    trackArtist.textContent = tracks[index].artist;
    coverImg.src = tracks[index].cover || '';
    highlightActive();
    audio.addEventListener('loadedmetadata', () => {
        durationEl.textContent = formatTime(audio.duration);
    });
}

function highlightActive() {
    Array.from(trackListEl.children).forEach((li, i) => {
        li.classList.toggle('active', i === currentIndex);
    });
}

// Формат времени
function formatTime(sec) {
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
}

// SVG Play/Pause
function setPlaySVG() {
    playIcon.innerHTML = `
        <polygon points="5 3 19 12 5 21 5 3" fill="none" stroke="url(#grad)" stroke-width="2"/>
        <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#E63946"/>
                <stop offset="100%" stop-color="#F1FAEE"/>
            </linearGradient>
        </defs>
    `;
}

function setPauseSVG() {
    playIcon.innerHTML = `
        <rect x="6" y="4" width="4" height="16" fill="url(#grad)"/>
        <rect x="14" y="4" width="4" height="16" fill="url(#grad)"/>
        <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#E63946"/>
                <stop offset="100%" stop-color="#F1FAEE"/>
            </linearGradient>
        </defs>
    `;
}

// Управление воспроизведением
function playAudio() {
    audio.play();
    setPauseSVG();
}

function pauseAudio() {
    audio.pause();
    setPlaySVG();
}

playBtn.addEventListener('click', () => {
    if(audio.paused) playAudio();
    else pauseAudio();
});

prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    loadTrack(currentIndex);
    playAudio();
});

nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % tracks.length;
    loadTrack(currentIndex);
    playAudio();
});

// Обновление прогресса
audio.addEventListener('timeupdate', () => {
    const percent = (audio.currentTime / audio.duration) * 300;
    progressBar.setAttribute('width', percent);
    currentTimeEl.textContent = formatTime(audio.currentTime);
});

// Клик по прогресс-бару
const progressContainer = document.getElementById('progress-svg');
progressContainer.addEventListener('click', e => {
    const rect = progressContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    audio.currentTime = (clickX / width) * audio.duration;
});

renderTrackList();
loadTrack(0);
setPlaySVG();
