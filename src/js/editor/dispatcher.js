export class Dispatcher {
	constructor() {}

	dispatch(evt) {
		if (evt && this.handlers && this.handlers[evt.type]) {
			this.handlers[evt.type].forEach(h => h(evt));
		}
	}

	register(emitter) {
		emitter.register(this.dispatch.bind(this));

		if (!this.handlers) this.handlers = {};

		let handlers = emitter.getHandlers();
		this.registerHandlers(handlers, emitter);
	}

	registerHandlers(handlers, emitter) {
		if (handlers) {
			for (let h in handlers) {
				this.registerHandler(h, handlers[h], emitter);
			}
		}
	}

	registerHandler(evt, handler, emitter) {
		if (!this.handlers) this.handlers = {};

		if (!this.handlers[evt]) {
			this.handlers[evt] = new Map();
		}

		this.handlers[evt].set(emitter, handler);
	}

	unregister(emitter) {
		emitter.unregister(this);

		let handlers = emitter.getHandlers();
		if (handlers && this.handlers) {
			for (let h in handlers) {
				this.handlers[h].delete(emitter);
			}
		}
	}

	unregisterHandler(evt, emitter) {
		if (this.handlers[evt]) {
			this.handlers[evt].delete(emitter);
		}
	}
}
