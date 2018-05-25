export class CanvasCommandProxy {
	constructor(contextObject) {
		this.contextObject = contextObject;
	}

	wrapCurrentSelection(el) {
		this.contextObject.wrapCurrentSelection(el);
	}
}
