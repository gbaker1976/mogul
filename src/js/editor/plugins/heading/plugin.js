import {PluginBase} from '../plugin-base.js';

export class HeadingPlugin extends PluginBase {

	get key() {
		return 'heading-level';
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
		el.classList.add('s--editor-heading');
		return el;
	}

	get aspects() {
		return {
			toolbar: [
				{key: this.key, command: 'h1', controller: this},
				{key: this.key, command: 'h2', controller: this},
				{key: this.key, command: 'h3', controller: this},
				{key: this.key, command: 'h4', controller: this},
				{key: this.key, command: 'h5', controller: this},
				{key: this.key, command: 'h6', controller: this}
			]
		}
	}

	checkValidNode(node) {
		return !!this.aspects.toolbar.map(i => {i.command === node.nodeName.toLowerCase()}).length;
	}
}
