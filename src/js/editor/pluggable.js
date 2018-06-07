export default Base => class extends Base {
	get command() {
		throw new Error('You must override this getter');
	}

	get aspects() {
		throw new Error('you must override this method');
	}

	invoke(command, ...opts) {
		throw new Error('You must override this method');
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
};
