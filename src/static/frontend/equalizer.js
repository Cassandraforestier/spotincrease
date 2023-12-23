class Equalizer extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    this.bassControl = null;
    this.midControl = null;
    this.trebleControl = null;
    this.panningControl = null;
    this.panningValue = null;
    this.bassValue = null;
    this.midValue = null;
    this.trebleValue = null;
  }

  connectedCallback() {
    // Appelé lorsque l'élément est ajouté au DOM
    this.render();

    // Récupérer les éléments du shadow DOM
    this.bassControl = this.shadow.querySelector("#bass-control");
    this.midControl = this.shadow.querySelector("#mid-control");
    this.trebleControl = this.shadow.querySelector("#treble-control");
    this.preampControl = this.shadow.querySelector("#preamp-control");
    this.panningControl = this.shadow.querySelector("#panning-control");
    this.panningValue = this.shadow.querySelector("#panning-value");
    this.bassValue = this.shadow.querySelector("#bass-value");
    this.midValue = this.shadow.querySelector("#mid-value");
    this.trebleValue = this.shadow.querySelector("#treble-value");

    // Ajouter des écouteurs d'événements
    this.panningControl.addEventListener("input", this.handleBalanceChange.bind(this));
    this.bassControl.addEventListener("input", this.handleEqualizerChange.bind(this, this.bassValue));
    this.midControl.addEventListener("input", this.handleEqualizerChange.bind(this, this.midValue));
    this.trebleControl.addEventListener("input", this.handleEqualizerChange.bind(this, this.trebleValue));
    this.preampControl.addEventListener("input", this.handlePreampChange.bind(this));
  }

  resetPanValues() {
    // Méthode pour réinitialiser les valeurs de la balance
    this.panningControl.value = 0;
    this.panningValue.textContent = 0;
  }

  handleBalanceChange(event) {
    // Gestionnaire d'événements pour le changement de balance
    this.panningValue.textContent = event.target.value;
    this.dispatchEvent(new CustomEvent("balanceChange", {
      detail: {
        balance: event.target.value,
      },
      bubbles: true,
    }));
  }

  handleEqualizerChange(valueElement, event) {
    // Gestionnaire d'événements pour le changement d'égaliseur
    const value = parseFloat(event.target.value);
    valueElement.textContent = value;
    this.dispatchEvent(new CustomEvent("equalizerChange", {
      detail: {
        [valueElement.id]: value,
      },
      bubbles: true,
    }));
  }

  render() {
    this.shadow.innerHTML = `
      <style>
        @import "equalizer.css";
      </style>
      <div id="equalizer">
        <span>Egaliseur de fréquence</span>
        <div class="controls">
          <div class="control-container">
            <label>Bass</label>
            <input id="bass-control" class="vVertical" type="range" min="-40" max="40" step="1" value="0" />
            <span id="bass-value">0</span>
          </div>
          <div class="control-container">
            <label>Mid</label>
            <input id="mid-control" class="vVertical" type="range" min="-40" max="40" step="1" value="0" />
            <span id="mid-value">0</span>
          </div>
          <div class="control-container">
            <label>Treble</label>
            <input id="treble-control" class="vVertical" type="range" min="-40" max="40" step="1" value="0" />
            <span id="treble-value">0</span>
          </div>
        </div>
      </div>
      <div id="balance-container">
        <span>Balance</span>
        <input id="panning-control" type="range" min="-1" max="1" step="0.1" value="0" />
        <span id="panning-value">0</span>
      </div>
    `;
  }
}

customElements.define("app-equalizer", Equalizer);
