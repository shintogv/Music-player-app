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
      isVerified: true,
      followers: "12M",
      monthlyListeners: "1.5M",
      description:
        "'Sweet Child O’ Mine' by Guns N’ Roses is a classic rock anthem from the late 1980s, known for its iconic opening guitar riff and heartfelt lyrics. The song blends raw energy with emotional depth, capturing themes of love, nostalgia, and admiration. It remains one of the band's most beloved and instantly recognizable tracks.",
    },
    {
      title: "Sounds of Someday",
      duration: "4:09",
      thumbnail:
        "https://i.scdn.co/image/ab67616d0000b273d322f73e0d23621cdc9c9aee",
      src: "./data/sounds-of-someday.mp3",
      artist: "Radio Company",
      year: 2019,
      isVerified: true,
      followers: "8M",
      monthlyListeners: "57K",
      description:
        "'Sounds of Someday' by Radio Company is a heartfelt ballad that explores the themes of hope and longing. With its soothing melodies and poignant lyrics, the song captures the essence of looking forward to a brighter future while reflecting on the past.",
    },
    {
      title: "Summer of 69",
      duration: "3:23",
      thumbnail:
        "https://upload.wikimedia.org/wikipedia/en/2/2b/Bryan_Adams_-_Summer_of_%2769.jpg",
      src: "./data/summer-of-69.mp3",
      artist: "Bryan Adams",
      year: 1984,
      isVerified: true,
      followers: "20M",
      monthlyListeners: "3.5M",
      description:
        "'Summer of 69' by Bryan Adams is a nostalgic rock anthem that captures the spirit of youthful adventure and the passage of time. With its catchy guitar riffs and heartfelt lyrics, the song reminisces about the carefree days of summer and the memories that last a lifetime.",
    },
    {
      title: "Nothing Else Matters",
      duration: "6:26",
      thumbnail:
        "https://cdn-images.dzcdn.net/images/cover/a8460833a62b575f18d35355a3314850/500x500-000000-80-0-0.jpg",
      src: "./data/nothing-else-matters.mp3",
      artist: "Metallica",
      year: 1991,
      isVerified: true,
      followers: "12M",
      monthlyListeners: "2M",
      description:
        "\"Nothing Else Matters\" by Metallica is a powerful ballad that showcases the band's softer, emotional side. With its haunting melody and introspective lyrics, the song speaks about trust, love, and staying true to oneself. It's one of Metallica's most iconic tracks, resonating with both rock fans and broader audiences worldwide.",
    },
    {
      title: "Africa",
      duration: "4:32",
      thumbnail:
        "https://upload.wikimedia.org/wikipedia/en/b/bd/Toto_Toto_IV.jpg",
      src: "./data/africa.mp3",
      artist: "Toto",
      year: 1982,
      isVerified: true,
      followers: "15M",
      monthlyListeners: "2.5M",
      description:
        '"Africa" by Toto is a timeless pop-rock classic, loved for its uplifting melody, rich harmonies, and unforgettable chorus. The song blends rock with world music influences, creating a sound that feels both nostalgic and universally appealing.',
    },
    {
      title: "Science Documentary",
      duration: "2:07",
      thumbnail: "./data/preview-img-3.jpg",
      src: "./data/track3.mp3",
      artist: "Lexin_Music",
      year: 1976,
      isVerified: false,
      followers: "12K",
      monthlyListeners: "1.5K",
      description:
        '"Science Documentary" by Lexin_Music is an intriguing audio experience that takes listeners on a journey through the wonders of science. With its captivating narration and immersive sound design, the documentary explores various scientific topics, making complex ideas accessible and engaging for all.',
    },
  ];

  //------------------ DOM references --------------------
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

  //-------------------- Popup modal -------------------------------
  const previewModal = document.getElementById("preview-modal");
  const previewDescription = document.getElementById("preview-description");
  const previewImg = document.getElementById("preview-image");
  const previewArtist = document.getElementById("preview-artist");
  const followerCount = document.getElementById("follow-count");
  const listenerCount = document.getElementById("listner-count");
  const closeModal = document.getElementById("close-modal");

  //-------------------- Dropdown -------------------------------
  const dropdownContainer = document.getElementById("custom-dropdown");
  const dropdownArrow = document.getElementById("dropdown-arrow");
  const dropdownItems = document.getElementById("dropdown-list-items");
  const selectedValue = document.getElementById("selectedValue");

  //----------------------------------------------------------------------------

  let currentSongIndex = 0;
  let audio = new Audio();
  let isRepeat = false;
  let isShuffle = false; //  shuffle OFF by default
  let shuffledSongs = [...songs];

  // ------------------ Shuffle button ----------------
  shuffleBtn.addEventListener("click", () => {
    isShuffle = !isShuffle;

    if (isShuffle) {
      //  Turn OFF repeat if shuffle is enabled
      isRepeat = false;
      audio.loop = false;
      repeatBtn.innerHTML =
        '<img src="./assets/icons/loop.svg" alt="Repeat Off">';

      // Shuffle array
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

      // Map current song index
      const currentSong = songs[currentSongIndex];
      currentSongIndex = shuffledSongs.findIndex(
        (song) => song.src === currentSong.src
      );
    } else {
      shuffleBtn.innerHTML =
        '<img src="./assets/icons/shuffle.svg" alt="Shuffle Off">';
      const currentSong = shuffledSongs[currentSongIndex];
      currentSongIndex = songs.findIndex(
        (song) => song.src === currentSong.src
      );
    }
  });

  // --------------------- Repeat Button ---------------------
  repeatBtn.addEventListener("click", () => {
    isRepeat = !isRepeat;

    if (isRepeat) {
      //  Turn OFF shuffle if repeat is enabled
      isShuffle = false;
      shuffleBtn.innerHTML =
        '<img src="./assets/icons/shuffle.svg" alt="Shuffle Off">';
    }

    audio.loop = isRepeat;
    repeatBtn.innerHTML = isRepeat
      ? '<img src="./assets/icons/loop-highlighted.svg" alt="Repeat On">'
      : '<img src="./assets/icons/loop.svg" alt="Repeat Off">';
  });

  // ------------------ Playback Speed Dropdown ------------------
  selectedValue.addEventListener("click", () => {
    const isOpen = dropdownItems.style.display === "block";
    dropdownItems.style.display = isOpen ? "none" : "block";
    dropdownArrow.classList.toggle("rotate-270", !isOpen);
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!dropdownContainer.contains(e.target)) {
      dropdownItems.style.display = "none";
      dropdownArrow.classList.remove("rotate-270");
    }
  });

  // Apply speed when user clicks
  dropdownItems.querySelectorAll(".custom-dropdown-item").forEach((item) => {
    item.addEventListener("click", () => {
      audio.playbackRate = parseFloat(item.dataset.value);

      dropdownItems
        .querySelectorAll(".custom-dropdown-item")
        .forEach((el) => el.classList.remove("selected-speed"));
      item.classList.add("selected-speed");

      dropdownItems.style.display = "none";
      dropdownArrow.classList.remove("rotate-270");
    });
  });

  // ------------------- Time Formatting -------------------
  function formatTime(seconds) {
    if (isNaN(seconds)) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  // ------------------- Update Play/Pause button -------------------
  const updatePlayPauseButton = (isPlaying) => {
    playPauseBtn.innerHTML = isPlaying
      ? '<img src="./assets/icons/pause-button.svg" alt="Pause">'
      : '<img src="./assets/icons/play-button.svg" alt="Play">';
  };

  // -------------------- Play or Pause song --------------------
  function playPause() {
    if (audio.paused) {
      audio.play();
      updatePlayPauseButton(true);
    } else {
      audio.pause();
      updatePlayPauseButton(false);
    }
  }

  // --------------------- Highlight current song ---------------------
  function highlightCurrentSong() {
    const allItems = document.querySelectorAll(".item-container");

    allItems.forEach((item, index) => {
      const title = item.querySelector(".track-title");
      const artist = item.querySelector(".track-artist");
      const duration = item.querySelector(".track-duration");

      let highlightedIndex;
      if (isShuffle) {
        const currentSong = shuffledSongs[currentSongIndex];
        highlightedIndex = songs.findIndex(
          (song) => song.src === currentSong.src
        );
      } else {
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

  // --------------------- Render Song List ---------------------
  function renderSongList() {
    songList.innerHTML = "";

    songs.forEach((song, index) => {
      const itemContainer = document.createElement("div");
      itemContainer.classList.add("item-container");
      itemContainer.setAttribute("data-index", index);

      const imgElement = document.createElement("img");
      imgElement.src = song.thumbnail;
      imgElement.alt = song.title;
      imgElement.classList.add("list-thumbnail");

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

      const duration = document.createElement("p");
      duration.classList.add("track-duration");
      duration.textContent = song.duration;

      itemContainer.appendChild(imgElement);
      itemContainer.appendChild(trackDataContainer);
      itemContainer.appendChild(duration);

      itemContainer.addEventListener("click", () => {
        if (isShuffle) {
          const clickedSong = songs[index];
          currentSongIndex = shuffledSongs.findIndex(
            (song) => song.src === clickedSong.src
          );
        } else {
          currentSongIndex = index;
        }
        loadSong(currentSongIndex);
        audio.play();
        updatePlayPauseButton(true);
        highlightCurrentSong();
      });

      songList.appendChild(itemContainer);
    });
  }

  // ---------------- Load song function ----------------
  function loadSong(index) {
    const list = isShuffle ? shuffledSongs : songs;
    const currentSong = list[index];

    audio.src = currentSong.src;
    thumbnail.src = currentSong.thumbnail;
    trackTitle.innerText = currentSong.title;
    trackDescription.innerText = currentSong.artist;

    // 🔹 Reset progress bar immediately
    progress.value = 0;
    currTime.textContent = "00:00";
    leftTime.textContent = "00:00";

    audio.onloadedmetadata = function () {
      progress.max = audio.duration;
      leftTime.textContent = formatTime(audio.duration);
    };
  }

  // --------------- Progress / Volume ---------------
  progress.addEventListener(
    "input",
    () => (audio.currentTime = progress.value)
  );
  volumeControl.addEventListener(
    "input",
    () => (audio.volume = volumeControl.value)
  );
  audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
      progress.value = audio.currentTime;
      progress.max = audio.duration;
      currTime.textContent = formatTime(audio.currentTime);
      leftTime.textContent = formatTime(audio.duration - audio.currentTime);
    }
  });

  // --------------- Autoplay Next Song ---------------
  audio.addEventListener("ended", () => {
    if (!isRepeat) {
      const list = isShuffle ? shuffledSongs : songs;
      currentSongIndex = (currentSongIndex + 1) % list.length;
      loadSong(currentSongIndex);
      audio.play();
      highlightCurrentSong();
    }
  });

  // Initialization
  renderSongList();
  loadSong(0);

  // Controls
  playPauseBtn.addEventListener("click", playPause);
  nextBtn.addEventListener("click", () => {
    const list = isShuffle ? shuffledSongs : songs;
    currentSongIndex = (currentSongIndex + 1) % list.length;
    loadSong(currentSongIndex);
    audio.play();
    highlightCurrentSong();
  });
  prevBtn.addEventListener("click", () => {
    const list = isShuffle ? shuffledSongs : songs;
    currentSongIndex = (currentSongIndex - 1 + list.length) % list.length;
    loadSong(currentSongIndex);
    audio.play();
    highlightCurrentSong();
  });

  // --------------------- Popup Modal ---------------------
  function openModalWindow() {
    previewModal.style.display = "flex";
    const currentSong = songs[currentSongIndex];
    previewArtist.textContent = currentSong.artist;
    followerCount.textContent = currentSong.followers;
    listenerCount.innerText = currentSong.monthlyListeners;
    previewDescription.innerText = currentSong.description;
    previewImg.src = currentSong.thumbnail;
    document.getElementById("verified").style.display = currentSong.isVerified
      ? "flex"
      : "none";
  }
  thumbnail.addEventListener("click", openModalWindow);
  closeModal.addEventListener(
    "click",
    () => (previewModal.style.display = "none")
  );
  window.addEventListener("click", (e) => {
    if (e.target === previewModal) previewModal.style.display = "none";
  });
});
