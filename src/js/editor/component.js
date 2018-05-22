export class Component extends HTMLElement {
	constructor(config) {
		super();
		this.config = config;

		this.shadow = this.attachShadow({mode: 'open'});
	}
}
