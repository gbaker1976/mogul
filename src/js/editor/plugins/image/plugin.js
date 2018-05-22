import {PluginBase} from '../plugin-base.js';

export class ImagePlugin extends PluginBase {
	
	getAspects() {
		return {
			toolbar: [
				{key: 'image', command: 'loadImage'}
			]
		}
	}
}
