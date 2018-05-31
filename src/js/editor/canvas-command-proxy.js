export class CanvasCommandProxy {
	constructor(contextObject) {
		this.contextObject = contextObject;
	}

	wrapCurrentSelection(el) {
		this.contextObject.wrapCurrentSelection(el);
	}

	styleSelection(styleClass, element) {
		this.contextObject.styleSelection(styleClass, element);
	}

	resetEditingContext() {
		this.contextObject.updateEditingContext();
	}
}
