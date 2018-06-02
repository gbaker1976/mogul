import {Control} from './control.js';
import {SelectionController} from './selection-controller.js';
import {HtmlUtils} from './html-utils.js';
import {CanvasCommandProxy} from './canvas-command-proxy.js';
import {RegionManager} from './region-manager.js';

export class Canvas extends Control {
	constructor(el, config = {}) {
		super(el, config);

		this.initHandlers();
	}

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
		// const aspects = plugin.getAspects();
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

	initControl() {
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

	styleSelection(styleClass, element) {
		const range = this.selectionController.getRangeForCurrentSelection();
		const workNode = this.selectionController.getWorkNodeForCurrentSelection(true);

		if (this.selectionController.isMultiNodeSelection()) {
			this.selectionController.getSelectedNodes().forEach(n => {
				workNode.classList.toggle(styleClass);
			});
		} else {
			if (this.selectionController.containsFullNodeContents(range)) {
				workNode.classList.toggle(styleClass);
				if (!workNode.classList.length) {
					this.spliceNodesIfBare(workNode, true);
				}
			} else {
				this.wrapCurrentSelection(element);
			}
		}
	}

	wrapCurrentSelection(el, n) {
		n = n || this.selectionController.getWorkNodeForCurrentSelection();

		if (n) {
			this.replaceNodeForEdit(n, el, true);
			const r = this.selectionController.getRangeForCurrentSelection();
			this.placeToolbar(r.getBoundingClientRect());
		}
	}

	replaceNodeForEdit(target, node, preserveSelection = false) {
		if (target.nodeType === 3) {
			this.splitNodeForEdit(target, node, preserveSelection);
			return;
		} else if (target.nodeType === 1) { // element
			// 1. Iterate over each node

			// 2. Is current node fully selected?
			// 2.a Yes? Apply styling at node level
			// 2.b No? Split node and apply styling at selected node

		}
	}

	splitNodeForEdit(target, node, preserveSelection = false) {
		const range = this.selectionController.getRangeForCurrentSelection();
		let nodes = HtmlUtils.splitNodeByRange(target, range);

		node.appendChild(nodes[1]);
		target.parentElement.insertBefore(node, nodes[2]);

		if (preserveSelection) {
			this.selectionController.resetSelectionByNode(node);
		}
	}

	spliceNodesIfBare(target, preserveSelection = false) {
		const range = this.selectionController.getRangeForCurrentSelection();
		let newNode, newRange;
		const parent = target.parentElement;

		if (target.previousSibling.nodeType === 3 && target.nextSibling.nodeType === 3) {
			newNode = HtmlUtils.concatNodes(target.previousSibling, target, target.nextSibling, true);

			parent.insertBefore(newNode, target.previousSibling);

			if (preserveSelection) {
				newRange = range.cloneRange();
				newRange.setStart(newNode, target.previousSibling.nodeValue.length);
				newRange.setEnd(newNode, newRange.startOffset + range.endOffset);
				this.selectionController.resetSelectionByRange(newRange);
			}

			parent.removeChild(target.previousSibling);
			parent.removeChild(target.nextSibling);
			parent.removeChild(target);
		}
	}
};
