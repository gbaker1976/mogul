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

	enableToolbarItem(key) {}
	disableToolbarItem(key) {}

	activateToolbarItem(key) {
		if (key) {
			const el = this.contextObject.getItemNodeByKey(key);
			if (el) {
				el.classList.add('s--active');
			}
		}
	}

	deactivateToolbarItem(key) {
		if (key) {
			const el = this.contextObject.getItemNodeByKey(key);
			if (el) {
				el.classList.remove('s--active');
			}
		}
	}

	emit(cmd) {
		if (cmd) {
			this.contextObject.emit(cmd);
		}
	}
}
