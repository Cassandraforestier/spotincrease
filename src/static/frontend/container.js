class Container extends HTMLElement {
  currentTrack;
  containerRef;
  playerRef;
  equalizerRef;

  constructor() {
    super();

    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.containerRef = this.shadow.querySelector("#container");
    this.playerRef = this.shadow.querySelector("app-player");

    this.setupListeners();
  }

  setupListeners() {
    this.containerRef.addEventListener("loadTrack", (e) => {
      // appelle le setter de player qui va mettre à jour le titre et lancer la lecture
      this.playerRef.setTrack(e.detail.track);
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
