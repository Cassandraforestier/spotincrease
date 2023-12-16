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
        <h2>Playlist</h2>
        <ul id="playlist"></ul>
        </div>        
    `;
  }
}

customElements.define("app-playlist", Playlist);
