import {ImagePlugin} from './image/plugin.js';

export class PluginRegistry {
	constructor(bus) {
		this.messageBus = bus;
		this.loadPlugins();
	}

	loadPlugins() {
		this.aspects = {};
		this.aspects = Object.assign({}, this.aspects, (new ImagePlugin(this.messageBus)).getAspects());
	}

	getAspects(category) {
		return category ? this.aspects[category] : this.aspects;
	}
}
