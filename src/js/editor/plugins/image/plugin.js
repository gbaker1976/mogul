import Composer from '../../composer.js';

export class ImagePlugin extends Composer.compose('pluggable') {

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
