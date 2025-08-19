document.addEventListener("DOMContentLoaded", async () => {
  const playlist = document.querySelector(".playlist");
  const audio = document.getElementById("audio");
  const songTitle = document.querySelector(".song-title");
  const artistName = document.getElementById("artist-name");
  const albumCover = document.getElementById("album-cover");
  const playButton = document.getElementById("play");
  const prevButton = document.getElementById("prev");
  const nextButton = document.getElementById("next");
  const progress = document.getElementById("progress");
  const progressContainer = document.getElementById("progress-container");

  let songs = [];
  let currentIndex = 0;

  try {
    const response = await fetch("/api/songs"); // API serverless
    songs = await response.json();

    playlist.innerHTML = "";
    songs.forEach((song, index) => {
      const li = document.createElement("li");
      li.textContent = song.name;
      li.dataset.index = index;
      li.addEventListener("click", () => {
        currentIndex = index;
        playSong();
      });
      playlist.appendChild(li);
    });

    if (songs.length > 0) setSong(0);

  } catch (error) {
    console.error("Erreur récupération chansons :", error);
  }

  async function setSong(index) {
    if (!songs.length) return;
    currentIndex = index;
    const song = songs[currentIndex];
    audio.src = song.filename; // Le chemin est déjà complet depuis l'API
    songTitle.textContent = song.name;
    artistName.textContent = song.artist;
    albumCover.src = song.cover; // Le chemin est déjà complet depuis l'API
    updateActiveSong();
  }

  function playSong() {
    if (!songs.length) return;
    setSong(currentIndex);
    audio.play();
    playButton.innerHTML = '<i class="fas fa-pause"></i>';
  }

  function updateActiveSong() {
    document.querySelectorAll(".playlist li").forEach(li => li.classList.remove("active"));
    const activeLi = document.querySelector(`.playlist li:nth-child(${currentIndex + 1})`);
    if (activeLi) activeLi.classList.add("active");
  }

  playButton.addEventListener("click", () => {
    if (!songs.length) return;
    if (audio.paused) {
      audio.play();
      playButton.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
      audio.pause();
      playButton.innerHTML = '<i class="fas fa-play"></i>';
    }
  });

  nextButton.addEventListener("click", () => {
    if (!songs.length) return;
    currentIndex = (currentIndex + 1) % songs.length;
    playSong();
  });

  prevButton.addEventListener("click", () => {
    if (!songs.length) return;
    currentIndex = (currentIndex - 1 + songs.length) % songs.length;
    playSong();
  });

  audio.addEventListener("ended", () => {
    if (!songs.length) return;
    currentIndex = (currentIndex + 1) % songs.length;
    playSong();
  });

  // Barre de progression
  audio.addEventListener("timeupdate", () => {
    if (audio.duration) progress.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
  });

  progressContainer.addEventListener("click", (e) => {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    audio.currentTime = (clickX / width) * audio.duration;
  });
});