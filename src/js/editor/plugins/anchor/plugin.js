import Composer from '../../composer.js';

export class AnchorPlugin extends Composer.compose('pluggable') {

	get key() {
		return 'hashtag';
	}

	get command() {
		return this.invoke.bind(this);
	}

	invoke(command, ...opts) {
		switch (command) {
			case 'init' :
				this.proxy = opts[0];
				break;
			case 'click' :
				opts[0].el = this.newElement();
				this.proxy.switchView(this.buildView());
				break;
		}
	}

	buildView() {
		const el = document.createElement('div');

		el.innerHTML = '<input type="text" placeholder="Enter anchor name" />';

		return el;
	}

	newElement() {
		return document.createElement('a');
	}

	get aspects() {
		return {
			toolbar: [
				{key: this.key, command: 'insertAnchor', controller: this}
			]
		}
	}

	checkValidNode(node) {
		return node.nodeName.toLowerCase() === 'a';
	}
}
