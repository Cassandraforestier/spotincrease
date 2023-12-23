class Container extends HTMLElement {
  currentTrack;
  containerRef;
  playerRef;
  equalizerRef;
  playlistRef;

  constructor() {
    super();

    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.containerRef = this.shadow.querySelector("#container");
    this.playerRef = this.shadow.querySelector("app-player");
    this.playlistRef = this.shadow.querySelector("app-playlist");

    this.setupListeners();
  }

  setupListeners() {
    this.containerRef.addEventListener("loadTrack", (e) => {
      this.playerRef.setTrack(e.detail.track);
    });
    this.containerRef.addEventListener("playNextTrack", (e) => {
      this.playlistRef.playNextTrack();
    });
  }

  render() {
    this.shadow.innerHTML = `
        <style>
          @import "container.css";
        </style>
        <div id="container">
            <app-playlist></app-playlist>
            <app-player></app-player>
        </div>
    `;
  }
}

customElements.define("app-container", Container);
