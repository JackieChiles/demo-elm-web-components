class ElmWebComponent extends HTMLElement {
    /*
    static get observedAttributes() {
        console.log('In observedAttributes');
        if (this.moduleName) {
            const module = Elm[this.moduleName];
            const ports = module.ports;

            if (ports) {
                return Object.keys(ports).reduce((attributes, port) => {
                    const attribute = port.split('_')[0];

                    if (attribute && !attributes.indexOf(attribute) > -1) {
                        attributes.push(attribute);
                    }

                    return attributes;
                }, []);
            }                      
        }

        return [];
    }
*/

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
}

Object.keys(Elm.Genesys).forEach(module => {
    window.customElements.define(`genesys-${module.toLowerCase()}`, class extends ElmWebComponent {
        get moduleName() {
            return module;
        }
    }); 
});
