export class PluginBase {
	constructor() {}

	invoke(eventData, commandProxy) {
		throw new Error('You must override this method');
	}

	getAspects() {
		throw new Error('you must override this method');
	}
}
