export class AnchorController {
	constructor(proxy) {
		this.proxy = proxy;
	}

	invoke() {
		this.proxy.switchView(this.buildView());
	}

	buildView() {
		const el = document.createElement('div');

		el.innerHTML = '<input type="text" placeholder="Enter anchor ID" />';

		return el;
	}

	newElement() {
		return document.createElement('a');
	}
}
