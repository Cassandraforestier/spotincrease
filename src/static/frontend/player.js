class Player extends HTMLElement {

  constructor() {
    super();

    this.shadow = this.attachShadow(
      { mode: "open" } // Set mode to "open", to have access to
    );
  }

  connectedCallback() {
    this.render();

    this.audio = this.shadow.querySelector("#audioElement");
    this.currentTrack = this.shadow.querySelector("#currentTrack");
    this.equalizerRef = this.shadow.querySelector('app-equalizer');
    this.playerRef = this.shadow.querySelector('#player');
    this.canvas = this.shadow.querySelector('#canvas');
    this.playerRef.addEventListener("balanceChange", (e) => {
      this.handleBalanceChange(e);
    });
  }

  setTrack(track) {
    this.currentTrack.innerHTML = "<p>" + track + "</p>";
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
      this.audioElement = this.audioContext
        .createMediaElementSource(this.audio);
    }
    this.visualizer = butterchurn.default.createVisualizer(this.audioContext, this.canvas, {
      width: 800,
      height: 600
    });


    const presets = butterchurnPresets.getPresets();
    const preset = presets['Flexi, martin + geiss - dedicated to the sherwin maxawow'];

    this.visualizer.loadPreset(preset, 0.0);

    this.startRenderer();

    // Create a stereo panner
    this.panNode = new StereoPannerNode(this.audioContext);

    this.audioElement.connect(this.panNode);
    this.panNode.connect(this.audioContext.destination);
    this.visualizer.connectAudio(this.panNode);
    this.audio.play();

  }
  startRenderer() {
    requestAnimationFrame(() => { this.startRenderer() });
    this.visualizer.render();
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
          <canvas id="canvas"  width='800' height='600'></canvas>
          <app-equalizer></app-equalizer>
        </div>
    `;
  }
}

customElements.define("app-player", Player);
