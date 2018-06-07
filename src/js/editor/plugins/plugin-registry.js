import Composer from '../composer.js';
import {ImagePlugin} from './image/plugin.js';
import {AnchorPlugin} from './anchor/plugin.js';
import {BoldPlugin} from './bold/plugin.js';
import {ItalicPlugin} from './italic/plugin.js';
import {UnderlinePlugin} from './underline/plugin.js';
import {StrikeThroughPlugin} from './strikethrough/plugin.js';
import {HeadingPlugin} from './heading/plugin.js';

export class PluginRegistry extends Composer.compose('emitter') {
	constructor() {
		super();
	}

	loadPlugins() {
		this.aspects = {};

		this.pluginInstances = [
			new BoldPlugin(),
			new ImagePlugin(),
			new AnchorPlugin(),
			new ItalicPlugin(),
			new UnderlinePlugin(),
			new StrikeThroughPlugin()
		];

		this.pluginInstances.forEach(p => this.registerAspects(p))
	}

	registerAspects(plugin) {
		const aspects = plugin.aspects;

		for (let k in aspects) {
			if (aspects.hasOwnProperty(k)) {
				if (this.aspects[k]) {
					this.aspects[k] = Object.assign({}, this.aspects[k], aspects[k]);
				} else {
					this.aspects[k] = aspects[k];
				}
			}
		}

		this.emit({
			type: 'pluginRegistered',
			data: {
				plugin: plugin
			}
		});
	}

	getAspects(category) {
		return category ? this.aspects[category] : this.aspects;
	}
}
