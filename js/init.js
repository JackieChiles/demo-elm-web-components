class NumericStepper extends HTMLElement {
    static get observedAttributes() {
        return ['value'];
    }

    get value() {
  	return this.getAttribute('value');
    }
    
    set value(val) {
  	this.setAttribute('value', val);
        this.elm.ports.set.send(parseInt(this.value, 10));
    }
    
    constructor() {
  	super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        this.elm = Elm.NumericStepper.embed(shadowRoot);
        this.elm.ports.valueChanged.subscribe(val => this.setAttribute('value', val));
    }
}

window.customElements.define('numeric-stepper', NumericStepper);
