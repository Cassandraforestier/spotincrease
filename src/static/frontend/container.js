class Container extends HTMLElement {
  currentTrack;
  containerRef;
  playerRef;

  constructor() {
    super();

    this.shadow = this.attachShadow(
      { mode: "open" } // Set mode to "open", to have access to
    );
  }

  connectedCallback() {
    this.render();
    this.containerRef = this.shadow.querySelector('#container');
    this.playerRef = this.shadow.querySelector('app-player');
    this.setupListeners()
  }

  setupListeners() {
    this.containerRef.addEventListener("loadTrack", (e) => {
      this.playerRef.track = e.detail.track;
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
