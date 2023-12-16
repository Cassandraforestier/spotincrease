class Visualizer extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();

    this.placeholderImage = this.shadow.querySelector("img");
    this.canvas = this.shadow.querySelector("#canvas");
    this.canvas.style.display = "none";
  }

  playVisualizer(audioContext, panNode) {
    this.placeholderImage.style.display = "none";
    this.canvas.style.display = "block";
    this.visualizer = butterchurn.default.createVisualizer(
      audioContext,
      this.canvas,
      {
        width: 800,
        height: 600,
      }
    );
    const presets = butterchurnPresets.getPresets();
    const preset =
      presets["Flexi, martin + geiss - dedicated to the sherwin maxawow"];

    this.visualizer.loadPreset(preset, 0.0);
    this.visualizer.connectAudio(panNode);
    this.startRenderer();
  }

  startRenderer() {
    requestAnimationFrame(() => {
      this.startRenderer();
    });
    this.visualizer.render();
  }
  render() {
    this.shadow.innerHTML = `
        <style>
          @import "visualizer.css";
        </style>
        <div id="visualizer-container">
            <img src="images/music-150x150.png"width='400' height='300' alt="Music Image" />
            <canvas id="canvas"  width='400' height='300'></canvas>
        </div>        
    `;
  }
}

customElements.define("app-visualizer", Visualizer);
