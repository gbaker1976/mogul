export default Base => class extends Base {
	constructor(...args) {
		super(...args);
		this.handlers = {};
	}

	emit(evt) {
		this.dispatcher(evt);
	}

	register(dispatcher) {
		this.dispatcher = dispatcher;
	}

	unregister(dispatcher) {
		delete this.dispatcher;
	}

	setHandlers(handlers) {
		this.handlers = handlers;
	}

	getHandlers() {
		return this.handlers;
	}
}
