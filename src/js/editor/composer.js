import EmitterMixin from './emitter.js';
import ControlMixin from './control.js';
import ConfigurableMixin from './configurable.js';
import ProxyableMixin from './proxyable.js';

const registry = {
	'emitter': EmitterMixin,
	'control': ControlMixin,
	'configurable': ConfigurableMixin,
	'proxyable': ProxyableMixin
};

export default {
	compose(...args) {
		let cls = Object;

		args.forEach(c => {
			if (registry[c]) {
				cls = registry[c](cls);
			} else {
				throw new Error(`Composition failure: unable to locate component ${c}`);
			}
		});

		return cls;
	}
}
