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
            const [name, action] = port.split('_');

            if (!name || !action) {
                return;
            }

            if (action === 'subscribe') {
                this.elm.ports[port].subscribe(value => this.setAttribute(name, value));
            } else if (action === 'send') {
                Object.defineProperty(this, name, {
                    set: value => this.setAttribute(name, value)
                });
            }
        });
    }

    attributeChangedCallback(attrName, oldVal, newVal) {
        if (!this.elm || !this.elm.ports) {
            return;
        }

        const port = this.elm.ports[`${attrName}_send`];

        if (!port || oldVal === newVal) {
            return;
        }

        port.send(newVal);
    }
}

Object.keys(Elm.Genesys).forEach(moduleName => {
    if (!Elm || !Elm.Genesys) {
        return;
    }

    // Embed Elm module in temporary element to get port names and build observedAttributes
    const observedAttributes = [];
    const module = Elm.Genesys[moduleName];
    const tempDiv = document.createElement('div');
    const tempElmEmbed = module.embed(tempDiv);

    Object.keys(tempElmEmbed.ports).forEach(port => {
        const [name, action] = port.split('_');

        if (!name || !action) {
            return;
        }

        if (action === 'send') {
            observedAttributes.push(name);
        }
    });

    window.customElements.define(`genesys-${moduleName.toLowerCase()}`, class extends ElmWebComponent {
        static get observedAttributes() {
            return observedAttributes;
        }

        get moduleName() {
            return moduleName;
        }
    }); 
});
