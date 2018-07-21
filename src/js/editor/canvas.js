import Composer from './composer.js';
import SelectionController from './selection-controller.js';
import {HtmlUtils} from './html-utils.js';
import RegionManager from './region-manager.js';

class Canvas extends Composer.compose('emitter', 'configurable', 'control', 'proxyable') {
	get selectionController() {
		if (!this._selectionController) {
			this._selectionController = SelectionController.create(this.doc);
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
				evt.data.command('edit', this.proxyInstance);
		}
	}

	initControl(el) {
		this.initProxy({
			wrap: [
				'wrapCurrentSelection',
				'styleSelection'
			],
			create: {
				'resetEditingContext': () => this.updateEditingContext()
			}
		});
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
		RegionManager.instance.initRegions(this.doc);
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

		if (this.selectionController.isMultiNodeSelection()) {

			this.selectionController.selectNodes(
				...this.selectionController.getSelectedNodes(true)
					.map(node => {
						let nodes = [];

						if (range.startContainer === node) {
							if (range.startOffset > 0) {
								nodes = HtmlUtils.splitNode(node.cloneNode(true), range.startOffset);
								HtmlUtils.replace(node, ...nodes);
								return nodes[1];
							}
						} else if (range.endContainer === node) {
							if (range.endOffset < node.nodeValue.length-1) {
								nodes = HtmlUtils.splitNode(node.cloneNode(true), range.endOffset);
								HtmlUtils.replace(node, ...nodes);
								return nodes[0];
							}
						}

						return node;
					})
					.map(node => {
						let newNode;
						if (node.nodeType === 3) {
							if (node.parentElement.dataset && node.parentElement.dataset.styling === 'combine') {
								node.parentElement.classList.toggle(styleClass);
							} else {
								newNode = this.wrapNode(node.cloneNode(true), element.cloneNode(true));
								HtmlUtils.replace(node, newNode);
								newNode.classList.toggle(styleClass);
								return newNode;
							}
						}
						return node;
					})
					.map(node => {
						if (node.nodeType === 1 && !node.classList.length) {
							this.spliceNodesIfBare(node);
						}
						return node;
					})
			);
		} else {
			if (this.selectionController.containsFullNodeContents(range)) {
				workNode.classList.toggle(styleClass);
				if (!workNode.classList.length) {
					this.spliceNodesIfBare(workNode);
					this.selectionController.selectNodes(workNode);
				}
			} else {
				this.wrapCurrentSelection(element);
				workNode = this.selectionController.getWorkNodeForCurrentSelection(true);
				workNode.classList.toggle(styleClass);
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
