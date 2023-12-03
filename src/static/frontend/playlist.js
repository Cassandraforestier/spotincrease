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
    // Fetch the list of music files from the "musics" folder
    // Modify this part to dynamically fetch the music files from your server or folder
    // For simplicity, hardcoding a list here
    this.playlist = [
      "musics/song1.mp3",
      "musics/song2.mp3",
      "musics/song3.mp3",
    ];

    this.playlist.forEach((track, index) => {
      const listItem = document.createElement("li");
      listItem.textContent = `Song ${index + 1}`;
      listItem.addEventListener("click", () => {
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
        <ul id="playlist"></ul>
    `;
  }
}

customElements.define("app-playlist", Playlist);
