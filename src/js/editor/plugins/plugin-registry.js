import {Emitter} from '../emitter.js';
import {ImagePlugin} from './image/plugin.js';
import {AnchorPlugin} from './anchor/plugin.js';

export class PluginRegistry extends Emitter {
	constructor() {
		super();
	}

	loadPlugins() {
		this.aspects = {};

		this.pluginInstances = [
			new ImagePlugin(),
			new AnchorPlugin()
		];

		this.pluginInstances.forEach(p => this.registerAspects(p))
	}

	registerAspects(plugin) {
		const aspects = plugin.getAspects();

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
				aspects: aspects
			}
		});
	}

	getAspects(category) {
		return category ? this.aspects[category] : this.aspects;
	}
}
