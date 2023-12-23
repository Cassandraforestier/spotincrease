class Playlist extends HTMLElement {
  constructor() {
    super();

    this.playlist = [];
    this.currentTrackIndex = 0;

    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();

    this.playlistElement = this.shadow.getElementById("playlist");

    this.loadPlaylist();

    // événement pour le bouton de lecture aléatoire
    const randomButton = this.shadow.getElementById("randomButton");
    randomButton.addEventListener("click", this.playRandomTrack.bind(this));

    // Ajoutez des événements pour les boutons "previous" et "next"
    const previousButton = this.shadow.getElementById("previousButton");
    previousButton.addEventListener("click", this.playPreviousTrack.bind(this));

    const nextButton = this.shadow.getElementById("nextButton");
    nextButton.addEventListener("click", this.playNextTrack.bind(this));
  }

  playPreviousTrack() {
    this.currentTrackIndex = (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
    this.playTrackAtIndex();
  }

  playNextTrack() {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
    this.playTrackAtIndex();
  }

  playTrackAtIndex() {
    const selectedListItem = this.playlistElement.children[this.currentTrackIndex];

    this.playlistElement.querySelectorAll('li').forEach((item) => {
      item.classList.remove('active');
    });

    selectedListItem.classList.add('active');

    const selectedTrack = this.playlist[this.currentTrackIndex];

    this.dispatchEvent(
      new CustomEvent("loadTrack", {
        detail: {
          track: selectedTrack,
        },
        bubbles: true,
      })
    );
  }

  playRandomTrack() {
    const randomIndex = Math.floor(Math.random() * this.playlist.length);
    this.currentTrackIndex = randomIndex;
    const randomTrack = this.playlist[this.currentTrackIndex];

    this.playlistElement.querySelectorAll('li').forEach((item) => {
      item.classList.remove('active');
    });

    const randomListItem = this.playlistElement.children[randomIndex];
    randomListItem.classList.add('active');

    // événement pour charger et jouer la piste aléatoire
    this.dispatchEvent(
      new CustomEvent("loadTrack", {
        detail: {
          track: randomTrack,
        },
        bubbles: true,
      })
    );
  }


  loadPlaylist() {
    this.playlist = [
      "musics/Ultimate-Metal.mp3",
      "musics/Giga-metal.mp3",
      "musics/In-Dreams-Of-Darkness.mp3",
      "musics/metal-dark-matter.mp3",
      "musics/deadite-ash-vs-evil-dead-song.mp3",
      "musics/aggressive-metal-sinister.mp3",
      "musics/frantic.mp3",
      "musics/might-amp-magic.mp3",
      "musics/rammstein-style-metal.mp3",
      "musics/woods-of-imagination.mp3",
      "musics/workout-metal-sport.mp3",
    ];
    let activeListItem = null;
    this.playlist.forEach((track, index) => {
      const listItem = document.createElement("li");
      // Création élément img avec le chemin de l'image
      const imgElement = document.createElement("img");
      imgElement.src = "images/music-150x150.png";
      imgElement.alt = "Music Image";

      // Utilisez une regex pour extraire le nom de la piste et formatez-le
      const trackName = track
        .replace(/^musics\//, "") // Supprimer "musics/"
        .replace(/\.mp3$/, "") // Supprimer ".mp3"
        .replace(/-/g, " ") // Remplacer les tirets par des espaces
        .toLowerCase(); // Convertir en minuscules

      listItem.textContent = trackName;
      listItem.appendChild(imgElement); // Ajoutez l'élément img à li
      listItem.addEventListener("click", () => {
        if (activeListItem) {
          // Si un élément est déjà actif, supprimez la classe 'active'
          activeListItem.classList.remove("active");
        }

        // Ajoute la classe 'active' à l'élément cliqué
        listItem.classList.add("active");

        // Mettre à jour la référence de l'élément actif
        activeListItem = listItem;

        this.dispatchEvent(
          new CustomEvent("loadTrack", {
            detail: {
              track,
            },
            bubbles: true,
          })
        );
      });
      this.playlistElement.appendChild(listItem);
    });
  }

  render() {
    this.shadow.innerHTML = `
        <style>
          @import "playlist.css";
        </style>
        <div id="playlist-container">
          <div id="playlist-header">
            <h2>Playlist</h2>
            <div id="playlist-header-buttons">
              <img  id="previousButton" src="images/previous.png">
              <img id="randomButton" src="images/random.png">
              <img id="nextButton" src="images/next.png">
            </div>
          </div>
          <ul id="playlist"></ul>
        </div>        
    `;
  }
}

customElements.define("app-playlist", Playlist);
