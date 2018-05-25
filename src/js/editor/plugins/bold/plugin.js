import {PluginBase} from '../plugin-base.js';

export class BoldPlugin extends PluginBase {

	get key() {
		return 'bold';
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
				break;
			case 'edit' :
				this.doEdit(opts[0]);
				break;
		}
	}

	doEdit(proxy) {
		proxy.wrapCurrentSelection(this.newElement());
	}

	newElement() {
		const el = document.createElement('span');

		el.style.fontWeight = 'bold';
		el.classList.add('s--editor-bold');

		return el;
	}

	getAspects() {
		return {
			toolbar: [
				{key: this.key, command: this.key, controller: this}
			]
		}
	}

	checkValidNode(node) {
		return node.nodeName === 'span' && node.classList.contains('s--editor-bold');
	}
}
