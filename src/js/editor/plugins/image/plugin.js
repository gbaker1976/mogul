import {PluginBase} from '../plugin-base.js';

export class ImagePlugin extends PluginBase {

	constructor() {
		super();
		this.key = 'image';
	}

	get command() {
		return this.invoke.bind(this);
	}

	invoke(command, ...opts) {
		switch (command) {
			case 'init' :
				this.proxy = opts[0];
				break;
		}
	}

	get aspects() {
		return {
			toolbar: [
				{key: 'image', command: 'loadImage', controller: this}
			]
		}
	}

	checkValidNode(node) {
		return node.nodeName.toLowerCase() === 'img';
	}
}
