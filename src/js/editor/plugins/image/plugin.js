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

	getAspects() {
		return {
			toolbar: [
				{key: 'image', command: 'loadImage', controller: this}
			]
		}
	}

	checkValidNode(node) {
		return node.nodeName === 'img';
	}
}
