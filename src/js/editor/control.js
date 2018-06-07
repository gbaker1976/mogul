export default Base => class extends Base {
	initControl(el) {
		this.el = el;
		this.initViewContainer();
	}

	initViewContainer() {
		const viewNode = document.createElement('div');
		this.viewEl = this.el.appendChild(viewNode);
	}

	setPosition(rect) {
		this.el.style.top = `${rect.y}px`;
		this.el.style.left = `${rect.x}px`;
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
