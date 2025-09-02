document.addEventListener("DOMContentLoaded", function () {
  const songs = [
    {
      title: "Sweet Child O' Mine",
      duration: "5:03",
      thumbnail:
        "https://upload.wikimedia.org/wikipedia/en/1/15/Guns_N%27_Roses_-_Sweet_Child_o%27_Mine.png",
      src: "./data/sweet-child-o-mine.mp3",
      artist: "Guns N' Roses",
      year: 1987,
    },
    {
      title: "Sounds of Someday",
      duration: "4:09",
      thumbnail:
        "https://i.scdn.co/image/ab67616d0000b273d322f73e0d23621cdc9c9aee",
      src: "./data/sounds-of-someday.mp3",
      artist: "Radio Company",
      year: 2019,
    },
    {
      title: "Summer of 69",
      duration: "3:23",
      thumbnail:
        "https://upload.wikimedia.org/wikipedia/en/2/2b/Bryan_Adams_-_Summer_of_%2769.jpg",
      src: "./data/summer-of-69.mp3",
      artist: "Bryan Adams",
      year: 1984,
    },
    {
      title: "Nothing Else Matters",
      duration: "6:26",
      thumbnail:
        "https://cdn-images.dzcdn.net/images/cover/a8460833a62b575f18d35355a3314850/500x500-000000-80-0-0.jpg",
      src: "./data/nothing-else-matters.mp3",
      artist: "Metallica",
      year: 1991,
    },
    {
      title: "Africa",
      duration: "4:32",
      thumbnail:
        "https://upload.wikimedia.org/wikipedia/en/b/bd/Toto_Toto_IV.jpg",
      src: "./data/africa.mp3",
      artist: "Toto",
      year: 1982,
    },
    {
      title: "Carry On Wayward Son",
      duration: "5:24",
      thumbnail:
        "https://cdn-images.dzcdn.net/images/cover/3d01ed3162eb6f05659971155eec7336/500x500.jpg",
      src: "./data/carry-on-wayward-son.mp3",
      artist: "Kansas",
      year: 1976,
    },
  ];

  // DOM references
  const songList = document.getElementById("song-list");
  const thumbnail = document.getElementById("thumbnail");
  const shuffleBtn = document.getElementById("shuffle");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const repeatBtn = document.getElementById("repeat");
  const playPauseBtn = document.getElementById("play-pause");
  const progress = document.getElementById("progress");
  const currTime = document.getElementById("current-time");
  const leftTime = document.getElementById("time-left");
  const volumeControl = document.getElementById("volume");
  const trackTitle = document.getElementById("player-title");
  const trackDescription = document.getElementById("player-description");
  const modal = document.getElementById("popup-modal");
  const closeModal = document.getElementById("close-modal");

  let currentSongIndex = 0;
  let audio = new Audio();
  let isRepeat = false;

  //  Shuffle state
  let isShuffle = false;
  let shuffledSongs = [...songs]; // spread operator to copy from original list

  // Shuffle button event listener
  shuffleBtn.addEventListener("click", () => {
    isShuffle = !isShuffle;

    if (isShuffle) {
      // 🔹 Turn OFF repeat if shuffle is enabled
      isRepeat = false;
      audio.loop = false;
      repeatBtn.innerHTML =
        '<img src="./assets/icons/loop.svg" alt="Repeat Off">';

      // Create shuffled copy
      shuffledSongs = [...songs];
      for (let i = shuffledSongs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledSongs[i], shuffledSongs[j]] = [
          shuffledSongs[j],
          shuffledSongs[i],
        ];
      }

      shuffleBtn.innerHTML =
        '<img src="./assets/icons/shuffle-highlighted.svg" alt="Shuffle On">';

      // Map current song index to shuffled list
      const currentSong = songs[currentSongIndex];
      currentSongIndex = shuffledSongs.findIndex(
        (song) => song.src === currentSong.src
      );
    } else {
      shuffleBtn.innerHTML =
        '<img src="./assets/icons/shuffle.svg" alt="Shuffle Off">';

      // Map back to original list
      const currentSong = shuffledSongs[currentSongIndex];
      currentSongIndex = songs.findIndex(
        (song) => song.src === currentSong.src
      );
    }
  });

  // ------------------------------------------- //
  // Playback Speed Dropdown
  const speedBtn = document.getElementById("speed-btn");
  const caret = speedBtn.querySelector(".caret");
  const speedOptions = document.getElementById("speed-options");

  speedBtn.addEventListener("click", () => {
    const isOpen = speedOptions.style.display === "block";
    speedOptions.style.display = isOpen ? "none" : "block";
    caret.textContent = isOpen ? "▲" : "▼";
  });

  document.addEventListener("click", (e) => {
    if (!speedBtn.contains(e.target) && !speedOptions.contains(e.target)) {
      speedOptions.style.display = "none";
      caret.textContent = "▲";
    }
  });

  speedOptions.querySelectorAll("li").forEach((li) => {
    li.addEventListener("click", () => {
      audio.playbackRate = parseFloat(li.dataset.speed);

      speedOptions
        .querySelectorAll("li")
        .forEach((item) => item.classList.remove("active"));
      li.classList.add("active");

      speedOptions.style.display = "none";
      caret.textContent = "▼";
    });
  });

  // ------------------------------------------- //

  // Time Formatting
  function formatTime(seconds) {
    if (isNaN(seconds)) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  // Update Play/Pause button
  const updatePlayPauseButton = (isPlaying) => {
    playPauseBtn.innerHTML = isPlaying
      ? '<img src="./assets/icons/play-button.svg" alt="Play">'
      : '<img src="./assets/icons/pause-button.svg" alt="Pause">';
  };

  // Play or Pause song
  function playPause() {
    if (audio.paused) {
      audio.play();
      updatePlayPauseButton(true);
    } else {
      audio.pause();
      updatePlayPauseButton(false);
    }
  }

  // Highlight the currently playing song
  function highlightCurrentSong() {
    const allItems = document.querySelectorAll(".item-container");

    allItems.forEach((item, index) => {
      const title = item.querySelector(".track-title");
      const artist = item.querySelector(".track-artist");
      const duration = item.querySelector(".track-duration");

      // Determine which song should be highlighted in the displayed list
      let highlightedIndex;

      if (isShuffle) {
        // Map shuffled song to its index in the original displayed list
        const currentSong = shuffledSongs[currentSongIndex];
        highlightedIndex = songs.findIndex(
          (song) => song.src === currentSong.src
        );
      } else {
        // When shuffle OFF, displayed list matches original array
        highlightedIndex = currentSongIndex;
      }

      if (index === highlightedIndex) {
        title.classList.add("current-song");
        artist.classList.add("current-song");
        duration.classList.add("current-song");
      } else {
        title.classList.remove("current-song");
        artist.classList.remove("current-song");
        duration.classList.remove("current-song");
      }
    });
  }

  function renderSongList() {
    songList.innerHTML = "";

    songs.forEach((song, index) => {
      const itemContainer = document.createElement("div");
      itemContainer.classList.add("item-container");
      itemContainer.setAttribute("data-index", index);

      const itemImg = document.createElement("div");
      itemImg.classList.add("item-img");
      const imgElement = document.createElement("img");
      imgElement.src = song.thumbnail;
      imgElement.alt = song.title;
      itemImg.appendChild(imgElement);

      const trackDataContainer = document.createElement("div");
      trackDataContainer.classList.add("track-data-container");

      const title = document.createElement("p");
      title.classList.add("track-title");
      title.textContent = song.title;

      const artist = document.createElement("p");
      artist.classList.add("track-artist");
      artist.textContent = song.artist;

      trackDataContainer.appendChild(title);
      trackDataContainer.appendChild(artist);

      const trackDurationContainer = document.createElement("div");
      trackDurationContainer.classList.add("track-duration-container");

      const duration = document.createElement("p");
      duration.classList.add("track-duration");
      duration.textContent = song.duration;

      const year = document.createElement("p");
      year.classList.add("track-year");
      year.textContent = song.year;

      trackDurationContainer.appendChild(duration);
      trackDurationContainer.appendChild(year);

      itemContainer.appendChild(itemImg);
      itemContainer.appendChild(trackDataContainer);
      itemContainer.appendChild(trackDurationContainer);

      //Song clicks
      itemContainer.addEventListener("click", () => {
        const list = isShuffle ? shuffledSongs : songs;

        // If shuffle is ON, find index in shuffled list
        if (isShuffle) {
          const clickedSong = songs[index]; // index from original rendering
          currentSongIndex = shuffledSongs.findIndex(
            (song) => song.src === clickedSong.src
          );
        } else {
          currentSongIndex = index; // original list index
        }

        loadSong(currentSongIndex);
        audio.play();
        updatePlayPauseButton(true);
        highlightCurrentSong();
      });

      songList.appendChild(itemContainer);
    });
  }

  // Update progress BAR
  function updateProgress() {
    if (audio.duration) {
      progress.value = audio.currentTime;
      progress.max = audio.duration;
      currTime.textContent = formatTime(audio.currentTime);
      leftTime.textContent = formatTime(audio.duration - audio.currentTime);
    }
  }

  //Load song function
  function loadSong(index) {
    const list = isShuffle ? shuffledSongs : songs;
    const currentSong = list[index];

    audio.src = currentSong.src;
    thumbnail.src = currentSong.thumbnail;
    trackTitle.innerText = currentSong.title;
    trackDescription.innerText = currentSong.artist;

    audio.onloadedmetadata = function () {
      progress.max = audio.duration;
      leftTime.textContent = formatTime(audio.duration);
      currTime.textContent = "00:00";
    };
  }

  progress.addEventListener("input", function () {
    audio.currentTime = progress.value;
  });

  volumeControl.addEventListener("input", function () {
    audio.volume = volumeControl.value;
  });

  audio.addEventListener("timeupdate", updateProgress);
  audio.addEventListener("ended", () => {
    updatePlayPauseButton(false);
    highlightCurrentSong();
  });
  audio.addEventListener("play", () => {
    updatePlayPauseButton(true);
    highlightCurrentSong();
  });
  audio.addEventListener("pause", () => {
    updatePlayPauseButton(false);
    highlightCurrentSong();
  });

  // Init
  renderSongList();
  loadSong(0);

  // Controls
  playPauseBtn.addEventListener("click", playPause);

  // Next button logic with shuffle support
  nextBtn.addEventListener("click", () => {
    const list = isShuffle ? shuffledSongs : songs;
    currentSongIndex = (currentSongIndex + 1) % list.length;
    loadSong(currentSongIndex);
    audio.play();
    updatePlayPauseButton(true);
    highlightCurrentSong();
  });

  // Previous button logic with shuffle support
  prevBtn.addEventListener("click", () => {
    const list = isShuffle ? shuffledSongs : songs;
    currentSongIndex = (currentSongIndex - 1 + list.length) % list.length;
    loadSong(currentSongIndex);
    audio.play();
    updatePlayPauseButton(true);
    highlightCurrentSong();
  });

  // Repeat Button
  repeatBtn.addEventListener("click", () => {
    isRepeat = !isRepeat;

    if (isRepeat) {
      // 🔹 Turn OFF shuffle if repeat is enabled
      isShuffle = false;
      shuffleBtn.innerHTML =
        '<img src="./assets/icons/shuffle.svg" alt="Shuffle Off">';
    }

    audio.loop = isRepeat;
    repeatBtn.innerHTML = isRepeat
      ? '<img src="./assets/icons/loop-highlighted.svg" alt="Repeat On">'
      : '<img src="./assets/icons/loop.svg" alt="Repeat Off">';
  });

  // ===== Popup Modal Functionality =====

  // Open modal when thumbnail clicked
  thumbnail.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  // Close modal when close button clicked
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Close modal if user clicks outside modal-content
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
  // End of Popup Modal Section
});
