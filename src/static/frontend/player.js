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
    this.panningControl = this.shadow.querySelector("#panning-control");
    this.panningValue = this.shadow.querySelector(".panning-value");

    this.panningControl.addEventListener(
      "change",
      this.handleBalanceChange.bind(this)
    );
  }

  set track(track) {
    this.currentTrack.innerHTML = "<p>" + track + "</p>";
    this.audio.src = track;

    this.panningValue.textContent = 0;
    this.panningControl.value = 0;

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

    // Create a stereo panner
    let panNode = new StereoPannerNode(this.audioContext);

    this.audioElement.connect(panNode);

    this.panningControl.oninput = () => {
      panNode.pan.value = this.panningControl.value;
      this.panningValue.textContent = this.panningControl.value;
    };
  
    panNode.connect(this.audioContext.destination);
    this.audio.play();

  }

  stop() {
    this.audio.pause();
  }

  handleBalanceChange(event) {
    console.log(event.target.value);
    this.audio.balance = event.target.value;
  }

  render() {
    this.shadow.innerHTML = `
        <style>
          @import "player.css";
        </style>
        <audio type="audio/mpeg" controls id="audioElement"></audio>
        <div id="currentTrack">Aucune musique sélectionnée</div>
        <div>
          <span>Balance</span>
          <input id="panning-control" type="range" min="-1" max="1" step="0.1" value="0" />
          <span class="panning-value">0</span>
        </div>
    `;
  }
}

customElements.define("app-player", Player);
