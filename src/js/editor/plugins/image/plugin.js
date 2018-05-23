import {PluginBase} from '../plugin-base.js';

export class ImagePlugin extends PluginBase {

	invoke(state, proxy) {}

	getAspects() {
		return {
			toolbar: [
				{key: 'image', command: 'loadImage', controller: this}
			]
		}
	}
}
