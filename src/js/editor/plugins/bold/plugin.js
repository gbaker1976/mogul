import {PluginBase} from '../plugin-base.js';

export class BoldPlugin extends PluginBase {

	get key() {
		return 'bold';
	}

	get styleClass() {
		return 's--editor-bold';
	}

	get element() {
		let el = document.createElement('span');
		el.classList.add(this.styleClass);
		return el;
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
				opts[0].el = this.element;
				break;
			case 'edit' :
				this.doEdit(opts[0]);
				break;
		}
	}

	// proxy is the canvas command proxy
	doEdit(proxy) {
		proxy.styleSelection(this.styleClass, this.element);
		proxy.resetEditingContext();
	}

	getAspects() {
		return {
			toolbar: [
				{key: this.key, command: this.key, controller: this}
			]
		}
	}

	checkValidNode(node) {
		return node.classList && node.classList.contains(this.styleClass);
	}
}
