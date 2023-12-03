class Equalizer extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.render();

        // partie égaliseur de fréquences
        this.equalizerRef = this.shadow.querySelector("#equalizer");

        this.equalizerRef.addEventListener("click", (e) => {
            this.equalizerRef.classList.toggle("animate");
        }
        );

        // partie balance
        this.panningControl = this.shadow.querySelector("#panning-control");
        this.panningValue = this.shadow.querySelector("#panning-value");

        this.panningControl.addEventListener(
            "change",
            this.handleBalanceChange.bind(this)
        );
    }

    resetPanValues() {
        this.panningControl.value = 0;
        this.panningValue.textContent = 0;
    }

    handleBalanceChange(event) {
        this.panningValue.textContent = event.target.value;
        this.dispatchEvent(new CustomEvent("balanceChange", {
            detail: {
                balance: event.target.value,
            },
            bubbles: true,
        }));
    }

    // handleEqualizerChange(event) {
    //     this.dispatchEvent(new CustomEvent("equalizerChange", {
    //         detail: {
    //             balance: event.target.value,
    //         },
    //         bubbles: true,
    //     }));
    // }

    render() {
        this.shadow.innerHTML = `
        <style>
          @import "equalizer.css";
        </style>
        <div id="equalizer">
        Equalizer
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
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
