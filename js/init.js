class ElmWebComponent extends HTMLElement {
    static get observedAttributes() {
        // TODO find a way to build this static property from port names
        return [];
    }

    constructor() {
        super();

        if (!Elm || !Elm.Genesys) {
            return;
        }

        const shadowRoot = this.attachShadow({ mode: 'open' });
        const module = Elm.Genesys[this.moduleName];

        if (!module) {
            return;
        }

        this.elm = module.embed(shadowRoot);

        Object.keys(this.elm.ports).forEach(port => {
            const segments = port.split('_');

            if (segments.length !== 2) {
                return;
            }

            if (segments[1] === 'subscribe') {
                this.elm.ports[port].subscribe(value => this.setAttribute(segments[0], value));
            }
        });
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (!this.elm || !this.elm.ports) {
            return;
        }

        const port = this.elm.ports[`${attrName}_send`];

        if (!port) {
            return;
        }

        port.send(newVal);
    }
}

Object.keys(Elm.Genesys).forEach(module => {
    window.customElements.define(`genesys-${module.toLowerCase()}`, class extends ElmWebComponent {
        get moduleName() {
            return module;
        }
    }); 
});
