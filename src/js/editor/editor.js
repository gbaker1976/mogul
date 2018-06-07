import ToolbarFactory from './toolbar.js';
import CanvasFactory from './canvas.js';
import {EdgarElement} from './edgar-element.js';
import {Dispatcher} from './dispatcher.js';
import {PluginRegistry} from './plugins/plugin-registry.js';

export class Editor extends EdgarElement {
	constructor() {
		super();
		this.initDispatcher();
		this.initStyles();
		this.initToolbar();
		this.initCanvas();
		this.initPlugins();
		this.loadDoc();
	}

	initDispatcher() {
		this.dispatcher = new Dispatcher();

		this.dispatcher.registerHandlers({
			'placeToolbar': this.placeToolbar.bind(this),
			'clearToolbar': this.clearToolbar.bind(this)
		}, this);
	}

	initStyles() {
		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.type = 'text/css';
		link.href = 'css/main.css';
		this.shadow.appendChild(link);
	}

	initPlugins() {
		this.pluginRegistry = new PluginRegistry();
		this.dispatcher.register(this.pluginRegistry);
		this.pluginRegistry.loadPlugins();
	}

	initToolbar() {
		const toolbarConfig = {
			items: [
				'cut',
				'copy',
				'paste',
				'bold',
				'italic',
				'underline',
				'strikethrough',
				'superscript',
				'subscript',
				'list-ol',
				'list-ul',
				'outdent',
				'indent',
				'align-left',
				'align-center',
				'align-justify',
				'align-right',
				'link',
				'hashtag'
			]
		};

		const toolbarEl = document.createElement('div');
		this.toolbar = ToolbarFactory.create(toolbarEl, toolbarConfig);
		this.dispatcher.register(this.toolbar);

		this.shadow.appendChild(toolbarEl);
	}

	placeToolbar(evt) {
		if (evt && evt.data) {
			this.toolbar.setPosition(evt.data);
			this.toolbar.show();
		}
	}

	clearToolbar() {
		this.toolbar.setPosition(new DOMRect(0, -5000, 0, 0));
		this.toolbar.hide();
	}

	initCanvas() {
		const canvasEl = document.createElement('iframe');
		// must add to the DOM first
		this.shadow.appendChild(canvasEl);
		this.canvas = CanvasFactory.create(canvasEl);
		this.dispatcher.register(this.canvas);

		//// to be moved to palette panel once created...
		// this.registerDomEventHandler('dragstart', e => {
		// 	e.dataTransfer.setData('text/x-image-url', 'https://html5up.net/uploads/demos/big-picture/images/thumbs/01.jpg');
		// });
	}

	loadDoc() {
		const doc = this.getAttribute('src');
		const req = new Request(doc);
		const canvas = this.canvas;

		fetch(req).then(function(res) {
			return res.text();
		}).then(function(txt) {
			if (txt){
				canvas.loadDoc(txt);
			}
		});
	}

	static registerComponents() {
		window.customElements.define('edgar-editor', this.prototype.constructor);
	}
};
