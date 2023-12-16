class Equalizer extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
        this.bassControl = null;
        this.midControl = null;
        this.trebleControl = null;
        this.panningControl = null;
        this.panningValue = null;
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

        // Ajouter des écouteurs d'événements
        this.panningControl.addEventListener("input", this.handleBalanceChange.bind(this));
        this.bassControl.addEventListener("input", this.handleEqualizerChange.bind(this));
        this.midControl.addEventListener("input", this.handleEqualizerChange.bind(this));
        this.trebleControl.addEventListener("input", this.handleEqualizerChange.bind(this));
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

    handleEqualizerChange() {
        // Gestionnaire d'événements pour le changement d'égaliseur
        const bass = parseFloat(this.bassControl.value);
        const mid = parseFloat(this.midControl.value);
        const treble = parseFloat(this.trebleControl.value);

        this.dispatchEvent(new CustomEvent("equalizerChange", {
            detail: {
                bass: bass,
                mid: mid,
                treble: treble,
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
        <span>Equalizer</span>
        <div class="control-container">
          <label>Bass</label>
          <input id="bass-control" type="range" min="-40" max="40" step="1" value="0" />
        </div>
        <div class="control-container">
          <label>Mid</label>
          <input id="mid-control" type="range" min="-40" max="40" step="1" value="0" />
        </div>
        <div class="control-container">
          <label>Treble</label>
          <input id="treble-control" type="range" min="-40" max="40" step="1" value="0" />
        </div>
      </div>
      <div>
        <span>Balance</span>
        <input id="panning-control" type="range" min="-1" max="1" step="0.1" value="0" />
        <span id="panning-value">0</span>
      </div>
    `;
    }
}

customElements.define("app-equalizer", Equalizer);
