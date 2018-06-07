export default Base => class extends Base {
	get proxyInstance() {
		if (!this._generatedProxy) {
			throw new Error('Proxy instance not initialized');
		}

		return this._generatedProxy;
	}

	initProxy(config = {}) {
		const exclude = ['initProxy', 'proxyInstance'];
		this._generatedProxy = {};

		if (config.wrap) {
			config.wrap.forEach(m => {
				if (!exclude.includes(m)) {
					this._generatedProxy[m] = this[m].bind(this);
				}
		 	});
		}

		if (config.create) {
			for(const p in config.create) {
				this._generatedProxy[p] = config.create[p].bind(this);
			}
		}

		return this._generatedProxy;
	}
}
