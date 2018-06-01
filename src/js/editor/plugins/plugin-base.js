export class PluginBase {
	constructor() {}

	get command() {
		throw new Error('You must override this getter');
	}

	invoke(command, ...opts) {
		throw new Error('You must override this method');
	}

	getAspects() {
		throw new Error('you must override this method');
	}

	checkStateForNode(node) {
		if (node) {
			if (this.checkValidNode(node)) {
				this.proxy.activateToolbarItem(this.key);
			} else {
				this.proxy.deactivateToolbarItem(this.key);
			}
		}
	}

	checkValidNode(node) {
		throw new Error('You must override this method');
	}
}
