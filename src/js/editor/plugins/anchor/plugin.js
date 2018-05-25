import {PluginBase} from '../plugin-base.js';

export class AnchorPlugin extends PluginBase {

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

	getAspects() {
		return {
			toolbar: [
				{key: this.key, command: 'insertAnchor', controller: this}
			]
		}
	}

	checkValidNode(node) {
		return node.nodeName === 'a';
	}
}
