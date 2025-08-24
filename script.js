const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const repeatBtn = document.getElementById("repeatBtn");
const seekBar = document.getElementById("seekBar");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const volumeControl = document.getElementById("volumeControl");
const songTitle = document.getElementById("songTitle");
const songArtist = document.getElementById("songArtist");
const playlist = document.querySelectorAll(".trackrow");

let isPlaying = false;
let currentTrackIndex = 0;
let isShuffle = false;
let isRepeat = false;

// Initialize volume to slider value
audio.volume = volumeControl.value / 100;

// Format time mm:ss
function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

// Highlight active track
function highlightTrack(index) {
  playlist.forEach(track => track.classList.remove("active"));
  playlist[index].classList.add("active");
}

// Load track
function loadTrack(index) {
  const track = playlist[index];
  const src = track.getAttribute("src");
  const title = track.getAttribute("title");
  const artist = track.getAttribute("artist");

  audio.src = src;
  songTitle.textContent = title;
  songArtist.textContent = artist;
  audio.load();
  highlightTrack(index);
}

// Play / Pause
function playTrack() {
  audio.play();
  playBtn.textContent = "⏸";
  isPlaying = true;
}
function pauseTrack() {
  audio.pause();
  playBtn.textContent = "▶";
  isPlaying = false;
}

playBtn.addEventListener("click", () => {
  isPlaying ? pauseTrack() : playTrack();
});

// Seek bar update
audio.addEventListener("timeupdate", () => {
  if (!isNaN(audio.duration)) {
    seekBar.value = (audio.currentTime / audio.duration) * 100;
    currentTimeEl.textContent = formatTime(audio.currentTime);
  }
});

// Show duration when metadata loads
audio.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audio.duration);
});

seekBar.addEventListener("input", () => {
  audio.currentTime = (seekBar.value / 100) * audio.duration;
});

// Volume
volumeControl.addEventListener("input", () => {
  audio.volume = volumeControl.value / 100;
});

// Playlist click
playlist.forEach((track, index) => {
  track.addEventListener("click", () => {
    currentTrackIndex = index;
    loadTrack(currentTrackIndex);
    playTrack();
  });
});

// Next / Prev
nextBtn.addEventListener("click", () => {
  if (isShuffle) {
    currentTrackIndex = Math.floor(Math.random() * playlist.length);
  } else {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
  }
  loadTrack(currentTrackIndex);
  playTrack();
});

prevBtn.addEventListener("click", () => {
  currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
  loadTrack(currentTrackIndex);
  playTrack();
});

// Shuffle toggle
shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle("active", isShuffle);
});

// Repeat toggle
repeatBtn.addEventListener("click", () => {
  isRepeat = !isRepeat;
  repeatBtn.classList.toggle("active", isRepeat);
  audio.loop = isRepeat;
});

// Auto play next or repeat
audio.addEventListener("ended", () => {
  if (!isRepeat) {
    if (isShuffle) {
      currentTrackIndex = Math.floor(Math.random() * playlist.length);
    } else {
      currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    }
    loadTrack(currentTrackIndex);
    playTrack();
  }
});

// Load first track and autoplay
loadTrack(currentTrackIndex);
playTrack(); // May require user gesture depending on browser
