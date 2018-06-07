export default Base => class extends Base {
	mergeConfig(config = {}) {
		this.config = Object.assign({}, this.defaultConfig || {}, config);
	}
};
