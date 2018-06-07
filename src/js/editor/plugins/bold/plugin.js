import {HtmlUtils} from '../../html-utils.js';
import Composer from '../../composer.js';

export class BoldPlugin extends Composer.compose('pluggable') {

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

	get aspects() {
		return {
			toolbar: [
				{key: this.key, command: this.key, controller: this}
			]
		}
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

	checkValidNode(node) {
		let hasStyle = false;

		if (node) {
			HtmlUtils.iterateNodes([node], n => {
				if (!hasStyle) {
					if (n.nodeType === 1) {
						hasStyle = n.classList.contains(this.styleClass);
					} else if (n.nodeType === 3) {
						hasStyle = n.parentElement.classList.contains(this.styleClass);
					}
				}
			}, true);
		}

		return hasStyle;
	}
}
