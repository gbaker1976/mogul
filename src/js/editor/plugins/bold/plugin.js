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

	// proxy is the canvas command proxy
	doEdit(proxy) {
		proxy.wrapCurrentSelection(this.newElement());
		proxy.resetEditingContext();
	}

	newElement() {
		const el = document.createElement('span');
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
		return node.nodeName.toLowerCase() === 'span' && node.classList.contains('s--editor-bold');
	}
}
