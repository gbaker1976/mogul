import {PluginBase} from '../plugin-base.js';

export class AnchorPlugin extends PluginBase {
	invoke(state, proxy) {
		state.el = this.newElement();
		proxy.switchView(this.buildView());
	}

	buildView() {
		const el = document.createElement('div');

		el.innerHTML = '<input type="text" placeholder="Enter anchor name" />';

		return el;
	}

	newElement() {
		return document.createElement('a');
	}

	getAspects() {
		return {
			toolbar: [
				{key: 'hashtag', command: 'insertAnchor', controller: this}
			]
		}
	}
}
