class Visualizer extends HTMLElement {
  constructor() {
    super();

    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadow.innerHTML = `
        <style>
          @import "visualizer.css";
        </style>
        <div id="visualizer-container">
        <h2>Visualizer</h2>
        </div>        
    `;
  }
}

customElements.define("app-visualizer", Visualizer);
