class Player extends HTMLElement {
  constructor() {
    super();

    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();

    this.audio = this.shadow.querySelector("#audioElement");
    this.currentTrack = this.shadow.querySelector("#currentTrack");
    this.equalizerRef = this.shadow.querySelector("app-equalizer");
    this.playerRef = this.shadow.querySelector("#player");
    this.visualizer = this.shadow.querySelector("app-visualizer");
    console.log("canvas", this.visualizer);
  }

  setTrack(track) {
    console.log("setTrack", track);
    // Créez l'élément img avec le chemin de l'image
    const imgElement = document.createElement("img");
    imgElement.src = "images/music-150x150.png";
    imgElement.alt = "Music Image";

    const trackName = track
      .replace(/^musics\//, "") // Supprimer "musics/"
      .replace(/\.mp3$/, "") // Supprimer ".mp3"
      .replace(/-/g, " ") // Remplacer les tirets par des espaces
      .toLowerCase(); // Convertir en minuscules

    this.currentTrack.innerHTML = imgElement.outerHTML + trackName;
    this.audio.src = track;
    this.equalizerRef.resetPanValues();

    if (this.panNode) {
      this.panNode.pan.value = 0;
      this.audio.balance = 0;
    }

    this.play();
  }

  get track() {
    return this.currentTrack;
  }

  play() {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
      this.audioElement = this.audioContext.createMediaElementSource(
        this.audio
      );
    }

    // Create a stereo panner
    this.panNode = new StereoPannerNode(this.audioContext);

    this.audioElement.connect(this.panNode);
    this.panNode.connect(this.audioContext.destination);

    this.visualizer.playVisualizer(this.audioContext, this.panNode);
    this.audio.play();
  }

  stop() {
    this.audio.pause();
  }

  handleBalanceChange(event) {
    this.panNode.pan.value = event.detail.balance;
    this.audio.balance = event.detail.balance;
  }

  render() {
    this.shadow.innerHTML = `
        <style>
          @import "player.css";
        </style>
        <div id="player">
          <audio type="audio/mpeg" controls id="audioElement"></audio>
          <div id="currentTrack">Aucune musique sélectionnée</div>
        </div>
        <div id="visualizer">
          <app-visualizer></app-visualizer>
          <app-equalizer></app-equalizer>
        </div>
    `;
  }
}

customElements.define("app-player", Player);
