import controlMixin from './control.js';
import emitterMixin from './emitter.js';
import configurableMixin from './configurable.js';
import {SelectionController} from './selection-controller.js';
import {HtmlUtils} from './html-utils.js';
import {CanvasCommandProxy} from './canvas-command-proxy.js';
import {RegionManager} from './region-manager.js';

class Canvas extends configurableMixin(emitterMixin(controlMixin(Object))) {
	get commandProxy() {
		if (!this.proxy) {
			this.proxy = new CanvasCommandProxy(this);
		}

		return this.proxy;
	}

	get regionManager() {
		if (!this._regionManager) {
			this._regionManager = new RegionManager(this.doc);
		}

		return this._regionManager;
	}

	get selectionController() {
		if (!this._selectionController) {
			this._selectionController = new SelectionController(this.doc);
		}

		return this._selectionController;
	}

	initHandlers() {
		this.setHandlers({
			'document': this.doEdit.bind(this),
			'pluginRegistered': this.onPluginRegistered.bind(this)
		});
	}

	onPluginRegistered(evt) {
		// const plugin = evt.data.plugin;
		// const aspects = plugin.aspects;
		//
		// if (aspects && aspects.dragDrop) {
		// 	aspects.dragDrop.forEach(i => {
		//
		// 	});
		// }
	}

	doEdit(evt) {
		switch (evt.data.command) {
			case 'insertLink' :
				break;
			case 'insertAnchor' :
				this.wrapCurrentSelection(evt.data.el);
				break;
			default :
				evt.data.command('edit', this.commandProxy);
		}
	}

	initControl(el) {
		this.initHandlers();
		super.initControl(el);
		this.el.className = 'edit-canvas';
		this.doc = this.el.contentWindow.document;

		this.doc.execCommand("defaultParagraphSeparator", false, this.config.paragraphTag || "p");
		//this.doc.execCommand("enableObjectResizing", true);
		this.doc.execCommand("styleWithCSS", true);

		this.selectionController.setSelectionHandler((range, hasRange = false) => {
			if (hasRange) {
				this.updateEditingContext();
				this.placeToolbar(range.getBoundingClientRect());
			} else {
				this.clearToolbar();
			}
		});
	}

	initViewContainer() {} // no view container needed

	loadDoc(html) {
		this.doc.body.innerHTML = html;
		this.initRegions();
	}

	// #### TOOLBAR
	placeToolbar(rect) {
		this.emit({
			type: 'placeToolbar',
			data: rect
		});
	}

	clearToolbar() {
		this.emit({
			type: 'clearToolbar'
		});
	}
	// #### /TOOLBAR

	initRegions() {
		this.regionManager.initRegions();
	}

	updateEditingContext() {
		this.emit({
			type: 'contextChanged',
			data: {
				selectedNode: this.selectionController.getWorkNodeForCurrentSelection(true)
			}
		});
	}

	wrapNode(nodeToWrap, wrapperNode) {
		wrapperNode.appendChild(nodeToWrap);
		return wrapperNode;
	}

	styleSelection(styleClass, element) {
		const range = this.selectionController.getRangeForCurrentSelection();
		let workNode = this.selectionController.getWorkNodeForCurrentSelection(true);
		let nodes = [];

		if (this.selectionController.isMultiNodeSelection()) {
			this.selectionController.getSelectedNodes().forEach((n, i, arr) => {
				if (range.startContainer === n) {
					nodes = HtmlUtils.splitNode(n.cloneNode(true), range.startOffset);
					if (nodes && nodes.length > 0) {
						nodes[1] = this.wrapNode(nodes[1].cloneNode(true), element.cloneNode(true));
						HtmlUtils.replace(n, ...nodes);
						arr[i] = nodes[1];
					}
				} else if (range.endContainer === n) {
					nodes = HtmlUtils.splitNode(n.cloneNode(true), range.endOffset);
					if (nodes && nodes.length > 0) {
						nodes[0] = this.wrapNode(nodes[0].cloneNode(true), element.cloneNode(true));
						HtmlUtils.replace(n, ...nodes);
						arr[i] = nodes[0];
					}
				} else {
					workNode = n;
					if (n.nodeType === 3) {
						workNode = this.wrapNode(n.cloneNode(true), element.cloneNode(true))
						HtmlUtils.replace(n, workNode);
					} else {
						workNode.classList.toggle(styleClass);
					}

					if (!workNode.classList.length) {
						this.spliceNodesIfBare(workNode);
					}
					arr[i] = workNode;
				}

				if (i === arr.length-1) {
					this.selectionController.selectNodes(...arr);
				}
			});
		} else {
			if (this.selectionController.containsFullNodeContents(range)) {
				workNode.classList.toggle(styleClass);
				if (!workNode.classList.length) {
					this.spliceNodesIfBare(workNode);
					this.selectionController.selectNodes(workNode);
				}
			} else {
				this.wrapCurrentSelection(element);
			}
		}
	}

	wrapCurrentSelection(el, n) {
		n = n || this.selectionController.getWorkNodeForCurrentSelection();

		if (n) {
			this.replaceSingleNodeForEdit(n, el);
			const r = this.selectionController.getRangeForCurrentSelection();
			this.placeToolbar(r.getBoundingClientRect());
		}
	}

	replaceSingleNodeForEdit(target, node, preserveSelection = (n) => this.selectionController.resetSelectionByNode(n)) {
		if (target.nodeType === 3) {
			this.splitSingleNodeForEdit(target, node, preserveSelection);
			return;
		}
	}

	splitSingleNodeForEdit(target, node, preserveSelection = (n) => this.selectionController.resetSelectionByNode(n)) {
		const range = this.selectionController.getRangeForCurrentSelection();
		let nodes = HtmlUtils.splitNodeByRange(target, range);

		node.appendChild(nodes[1]);
		target.parentElement.insertBefore(node, nodes[2]);

		preserveSelection(node);
	}

	spliceNodesIfBare(target) {
		const range = this.selectionController.getRangeForCurrentSelection();
		let newNode, nodes = [];

		if (target.previousSibling && target.previousSibling.nodeType === 3) {
			nodes.push(target.previousSibling);
		}

		nodes.push(target);

		if (target.nextSibling && target.nextSibling.nodeType === 3) {
			nodes.push(target.nextSibling);
		}

		newNode = HtmlUtils.concatNodes(...nodes, true);

		return newNode;
	}
};

export default {
	create(el, config) {
		const canvas = new Canvas();
		canvas.mergeConfig(config);
		canvas.initControl(el);
		return canvas;
	}
}
