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

    this.equalizerRef.addEventListener("equalizerChange", this.handleEqualizerChange.bind(this));
    this.equalizerRef.addEventListener("balanceChange", this.handleBalanceChange.bind(this));

    this.audio.addEventListener("ended", () => {
      this.dispatchEvent(
        new CustomEvent("playNextTrack", {
          bubbles: true,
        })
      );
    });
  }


  setTrack(track) {
    // création de l'élément img avec le chemin de l'image
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

      // Créer des filtres d'égalisation
      this.bassFilter = this.audioContext.createBiquadFilter();
      this.bassFilter.type = "lowshelf";
      this.bassFilter.frequency.value = 200;

      this.midFilter = this.audioContext.createBiquadFilter();
      this.midFilter.type = "peaking";
      this.midFilter.frequency.value = 1300;
      this.trebleFilter = this.audioContext.createBiquadFilter();
      this.trebleFilter.type = "highshelf";
      this.trebleFilter.frequency.value = 2600;

      // Créer un noeud pan
      this.panNode = this.audioContext.createStereoPanner();

      // Connecter les nœuds audio
      this.audioElement.connect(this.panNode);
      this.panNode.connect(this.audioContext.destination);
      // Connecter les filtres d'égalisation à la destination audio
      this.bassFilter.connect(this.audioContext.destination);
      this.midFilter.connect(this.audioContext.destination);
      this.trebleFilter.connect(this.audioContext.destination);

      // Connecter les filtres aux médias audio
      this.audioElement.connect(this.bassFilter);
      this.bassFilter.connect(this.midFilter);
      this.midFilter.connect(this.trebleFilter);
      this.trebleFilter.connect(this.audioContext.destination);

      this.visualizer.playVisualizer(this.audioContext, this.trebleFilter);
    }

    this.audio.play();
  }

  stop() {
    this.audio.pause();
    this.visualizer.stopVisualizer();
  }

  handleBalanceChange(event) {
    this.panNode.pan.value = event.detail.balance;
    this.audio.balance = event.detail.balance;
  }

  handleEqualizerChange(event) {
    if (event.detail) {
      const { "bass-value": bass, "mid-value": mid, "treble-value": treble } = event.detail;
      if (bass !== undefined) {
        this.bassFilter.gain.value = bass;
      } else if (mid !== undefined) {
        this.midFilter.gain.value = mid;
      } else if (treble !== undefined) {
        this.trebleFilter.gain.value = treble;
      }
    }
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
          <app-equalizer id="equalizer"></app-equalizer>
        </div>
    `;
  }
}

customElements.define("app-player", Player);
