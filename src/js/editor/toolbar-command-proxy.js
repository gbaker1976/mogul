export class ToolbarCommandProxy {
	constructor(contextObject) {
		this.contextObject = contextObject;
	}

	switchView(el) {
		if (el) {
			this.contextObject.switchView(el);
		}
	}

	resetView() {
		this.contextObject.resetView();
	}

	emit(cmd) {
		if (cmd) {
			this.contextObject.emit(cmd);
		}
	}
}
