// playlist-player.js
class PlaylistPlayer extends HTMLElement {
  constructor() {
    super();

    this.playlist = [];
    this.currentTrackIndex = 0;

    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
      <style>
        /* Include your CSS styles here */
        :host {
          display: block;
          background-color: #20115b ;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
          color: #fff; 
          font-family: 'Roboto', sans-serif;
          padding: 20px;
          box-sizing: border-box;
          border-radius: 8px;
          max-width: 50%;
        }

        ul {
          list-style: none;
          padding: 0;
          margin-top: 20px;
        }

        li {
          cursor: pointer;
          padding: 10px;
          border-bottom: 1px solid #ddd;
          transition: background-color 0.3s ease;
        }

        li:hover {
          background-color: #530e8c; 
        }

        li.active {
          background-color: #be8fe8; 
        }
      </style>
      <ul id="playlist"></ul>
    `;
  }

  connectedCallback() {
    this.audioPlayerElement = this.shadowRoot.getElementById("audioPlayer");
    this.playlistElement = this.shadowRoot.getElementById("playlist");

    this.loadPlaylist();
    this.setupEventListeners();
    this.loadTrack(this.currentTrackIndex);

    // Ajout du composant audio-balancer
    const audioBalancer = document.createElement("audio-balancer");
    this.shadowRoot.appendChild(audioBalancer);

    audioBalancer.addEventListener("balancechange", (event) => {
      const balanceValue = event.detail;
      this.audioPlayerElement.setPan(balanceValue);
    });
  }

  loadTrack(index) {
    if (index >= 0 && index < this.playlist.length) {
      this.currentTrackIndex = index;
      const trackSource = this.playlist[index];
      this.audioPlayerElement.src = trackSource;
      this.audioPlayerElement.play();

      // Highlight the selected track in the playlist
      const playlistItems = this.playlistElement.getElementsByTagName("li");
      Array.from(playlistItems).forEach((item, i) => {
        item.classList.toggle("active", i === index);
      });
    }
  }

  setupEventListeners() {
    this.audioPlayerElement.addEventListener("ended", () => {
      // Play the next track when the current one ends
      this.currentTrackIndex =
        (this.currentTrackIndex + 1) % this.playlist.length;
      this.loadTrack(this.currentTrackIndex);
    });
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
      listItem.addEventListener("click", () => this.loadTrack(index));
      this.playlistElement.appendChild(listItem);
    });
  }
}

customElements.define("playlist-player", PlaylistPlayer);
