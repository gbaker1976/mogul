import Composer from './composer.js';
import {HtmlUtils} from './html-utils.js';

class Toolbar extends Composer.compose('emitter', 'configurable', 'control', 'proxyable') {
	get availableToolbarItems() {
		if (!this._availableToolbarItems) {
			this._availableToolbarItems = [
				// {key: 'cut', command: 'cut', allowedContexts: 'any'},
				// {key: 'copy', command: 'copy', allowedContexts: 'any'},
				// {key: 'paste', command: 'paste', allowedContexts: 'any'},
				// {key: 'bold', command: 'bold', allowedContexts: 'flow'},
				// {key: 'italic', command: 'italic', allowedContexts: 'flow'},
				// {key: 'underline', command: 'underline', allowedContexts: 'flow'},
				// {key: 'strikethrough', command: 'strikethrough', allowedContexts: 'flow'},
				// {key: 'superscript', command: 'superscript', allowedContexts: 'flow'},
				// {key: 'subscript', command: 'subscript', allowedContexts: 'flow'},
				// {key: 'list-ol', command: 'insertOrderedList', allowedContexts: 'flow'},
				// {key: 'list-ul', command: 'insertUnorderedList', allowedContexts: 'flow'},
				// {key: 'outdent', command: 'outdent', allowedContexts: 'block'},
				// {key: 'indent', command: 'indent', allowedContexts: 'block'},
				// {key: 'align-left', command: 'justifyLeft', allowedContexts: 'flow'},
				// {key: 'align-center', command: 'justifyCenter', allowedContexts: 'flow'},
				// {key: 'align-justify', command: 'justifyFull', allowedContexts: 'flow'},
				// {key: 'align-right', command: 'justifyRight', allowedContexts: 'flow'},
				// {key: 'link', command: 'insertLink', allowedContexts: 'flow'},
				{key: 'separator'}
			];
		}
		return this._availableToolbarItems;
	}
	get defaultConfig() {
		const defaultConfig = {
			className: 'toolbar',
			items: this.availableToolbarItems.map(i => i.key)
		};

		return defaultConfig;
	}

	initControl(el) {
		super.initControl(el);
		this.initProxy({
			wrap: [
				'switchView',
				'resetView',
				'activateToolbarItem',
				'emit',
				'activateToolbarItem',
				'deactivateToolbarItem'
			]
		});
		this.initFontAwesome();
		this.el.className = this.config.className;
		this.buildMenu();
		this.registerDomEventHandler( 'click', this.handleClick.bind(this) );

		this.setHandlers({
			'contextChanged': this.onContextChanged.bind(this),
			'pluginRegistered': this.onPluginRegistered.bind(this)
		});
	}

	onPluginRegistered(evt) {
		const plugin = evt.data.plugin;
		const aspects = plugin.aspects;

		if (aspects && aspects.toolbar) {
			aspects.toolbar.forEach(i => {
				this._availableToolbarItems.push(i);
				this.viewEl.appendChild(this.buildItem(i));
			});
			plugin.invoke('init', this.proxyInstance);
		}
	}

	onContextChanged(evt) {
		// get context key for selected nodes
		let el = evt.data.selectedNode;

		this._availableToolbarItems.forEach(i => {
			if (i.controller) {
				i.controller.checkStateForNode(el);
			}
		});
	}

	setPosition(rect) {
		rect.y -= this.el.clientHeight + 5;
		rect.x -= (this.el.clientWidth - rect.width) / 2;
		super.setPosition(rect);
	}

	initFontAwesome() {
		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.type = 'text/css';
		link.href = 'https://use.fontawesome.com/releases/v5.0.13/css/all.css';
		link.integrity = 'sha384-DNOHZ68U8hZfKXOrtjWvjxusGo9WQnrNx2sqG0tfsghAvtVlRW3tvkXWZh58N9jp';
		link.crossOrigin = 'anonymous';
		this.el.appendChild(link);
	}

	getItemByKey(key) {
		if (key) {
			return this.availableToolbarItems.find(i => i.key === key);
		}
	}

	getItemNodeByKey(key) {
		if (key && key !== 'separator') {
			return this.viewEl.querySelector(`[data-key="${key}"]`);
		}
	}

	getItemForClick(e) {
		const key = e.target.attributes['data-key'];

		if (key) {
			return this.getItemByKey(key.nodeValue);
		}
	}

	shouldVetoClick(e) {
		return e.target.classList.contains('s--disabled');
	}

	handleClick(e) {
		const item = this.getItemForClick(e);

		if (item) {
			let evt = {
				data: {
					command: item.controller.command
				},
				type: 'document'
			};

			if (item.controller) {
				item.controller.invoke('click', evt.data);
			}

			this.emit(evt);
		}
	}

	buildMenu() {
		let item;
		this.config.items.forEach(i => {
			item = this.availableToolbarItems.find(j => j.key === i);
			if (item) {
				this.viewEl.appendChild( this.buildItem(item) );
			}
		});
	}

	buildItem(config) {
		const el = document.createElement('div');

		if (config.key === 'separator') {
			el.className = 'edit-item-sep';
		} else {
			el.className = 'edit-item';
			el.innerHTML = `<i class="fas fa-${config.key}" data-key="${config.key}" data-allowed-contexts="${config.allowedContexts}">`;
		}

		return el;
	}

	activateToolbarItem(key) {
		if (key) {
			const el = this.getItemNodeByKey(key);
			if (el) {
				el.classList.add('s--active');
			}
		}
	}

	deactivateToolbarItem(key) {
		if (key) {
			const el = this.getItemNodeByKey(key);
			if (el) {
				el.classList.remove('s--active');
			}
		}
	}

	switchView(el) {
		if (el) {
			if (!this.savedViewEl) {
				this.savedViewEl = this.el.removeChild(this.viewEl);
			}

			this.viewEl = this.el.appendChild(el);
		}
	}

	resetView() {
		if (this.savedViewEl && this.viewEl !== this.savedViewEl) {
			this.el.replaceChild(this.savedViewEl, this.viewEl);
			this.viewEl = this.savedViewEl;
			delete this.savedViewEl;
		}
	}

	hide() {
		super.hide();
		this.resetView();
	}
};

export default {
	create(el, config) {
		const toolbar = new Toolbar();
		toolbar.mergeConfig(config);
		toolbar.initControl(el);
		return toolbar;
	}
}
