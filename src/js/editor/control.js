import {Emitter} from './emitter.js';

export class Control extends Emitter {
	constructor(el, config) {
		super();
		this.el = el;
		this.initViewContainer();
		this.config = this.mergeConfig(config);
		this.initControl();
	}

	initControl() {}

	initViewContainer() {
		const viewNode = document.createElement('div');
		this.viewEl = this.el.appendChild(viewNode);
	}

	setPosition(rect) {
		this.el.style.top = `${rect.y}px`;
		this.el.style.left = `${rect.x}px`;
	}

	mergeConfig(config = {}) {
		return Object.assign({}, this.defaultConfig, config);
	}

	show() {
		this.el.classList.add('s--visible');
	}

	hide() {
		this.el.classList.remove('s--visible');
	}

	registerDomEventHandler(evtName, handler, captureBubl) {
		this.el.addEventListener( evtName, handler );
	}

	unregisterDomEventHandler(evtName, handler) {
		this.el.removeEventListener( evtName, handler );
	}
}
