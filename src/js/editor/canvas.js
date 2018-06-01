import {Control} from './control.js';
import {SelectionController} from './selection-controller.js';
import {HtmlUtils} from './html-utils.js';
import {CanvasCommandProxy} from './canvas-command-proxy.js';

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

	initHandlers() {
		this.setHandlers({
			'document': this.doEdit.bind(this)
		});
	}

	initSelectionController() {
		this.selectionController = new SelectionController(this.doc);
		this.selectionController.setSelectionHandler((range, hasRange = false) => {
			if (hasRange) {
				this.updateEditingContext();
				this.placeToolbar(range.getBoundingClientRect());
			} else {
				this.clearToolbar();
			}
		});
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

		this.initSelectionController();
	}

	initViewContainer() {} // no view container needed

	loadDoc(html) {
		this.doc.body.innerHTML = html;
		this.initRegions();
	}

	backFillEmptyEditRegion(el) {
		let p = this.doc.createElement(this.config.paragraphTag || "p");
		p.appendChild(this.doc.createTextNode('\u200B')); // unicode zero-width space
		el.innerHTML = '';
		el.appendChild(p);

		return p;
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
		this.doc.querySelectorAll('[data-editable]').forEach( e => {
			e.contentEditable = true;

			if (!e.innerHTML) {
				this.backFillEmptyEditRegion(e);
			}

			e.addEventListener('mouseup', e => {
				this.doc.querySelectorAll('[data-editable].editing').forEach( e => e.classList.remove('editing') );
				e.currentTarget.classList.add('editing');
				this.currentEditTarget = e.currentTarget;
			});
		});

		// canvas elements can be drop targets...
		this.doc.addEventListener('dragover', e => {
			if ([...e.dataTransfer.types].includes('text/x-image-url')) {
				this.insertGhostImageForDrag(e);
			} else {
				this.insertCaretForDrag(e);
			}
			e.preventDefault();
		});

		this.doc.addEventListener('dragend', e => {
			this.clearCaret();
		});

		this.doc.addEventListener('dragenter', e => {
			if ([...e.dataTransfer.types].includes('text/x-image-url')) {
				if ( e.target.dataset['drop-target'] != undefined ) {
					e.target.classList.add('s--highlight');
				}
			} else {
				e.target.classList.add('s--not-permitted');
			}
		});

		this.doc.addEventListener('dragleave', e => {
			if ( e.target.dataset['drop-target'] != undefined ) {
				e.target.classList.remove('s--highlight');
				e.target.classList.remove('s--not-permitted');
			}
		});

		this.doc.addEventListener('drop', e => {
			if ([...e.dataTransfer.types].includes('text/x-image-url')) {
				let url = e.dataTransfer.getData("text/x-image-url");
				this.insertDroppedImage(url, e);
				e.dataTransfer.clearData("text/x-image-url");
				e.preventDefault();
			}
			this.clearCaret();
		});

		// ensure content is wrapped/nested properly
		this.doc.addEventListener('input', e => {
			switch (e.inputType) {
				case 'inputFromPaste' :

					break;
				case 'deleteContentBackward' :
					if (!e.target.childNodes.length) {
						e.target.blur();
						this.backFillEmptyEditRegion(e.target);
						e.target.focus();
					}

					break;
				case 'insertText' :

					break;
			}
		});
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
		if (this.selectionController.containsFullNodeContents(this.selectionController.getRangeForCurrentSelection())) {
			const n = this.selectionController.getWorkNodeForCurrentSelection(true);
			n.classList.toggle(styleClass);
			if (!n.classList.length) {
				this.spliceNodesIfBare(n, true);
			}
		} else {
			this.wrapCurrentSelection(element);
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
			if (HtmlUtils.allowedContent(node, target)) {

			}
		}
	}

	splitNodeForEdit(target, node, preserveSelection = false) {
		const range = this.selectionController.getRangeForCurrentSelection();
		let nodes = HtmlUtils.splitNode(target, range.endOffset);

		target.parentElement.insertBefore(node, nodes[1]);
		nodes = HtmlUtils.splitNode(nodes[0], range.startOffset);
		node.appendChild(nodes[1]);

		if (preserveSelection) {
			this.selectionController.resetSelectionByNode(nodes[1]);
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

	clearCaret() {
		this.doc.querySelectorAll('.caret').forEach( el => {
			this.doc.contains(el) && el.parentNode.removeChild(el);
		});
	}

	insertCaretForDrag(e) {
		this.clearCaret();

		let rng = this.doc.caretRangeFromPoint(e.clientX, e.clientY);

		if ( rng ) {
			let textNode = rng.startContainer;
			let offset = rng.startOffset;

			if ( textNode && textNode.nodeType === 3) {
				let repl = textNode.splitText(offset);
				let caret = this.doc.createElement('i');
				caret.classList.add('caret');
				textNode.parentNode.insertBefore(caret, repl);
			}
		}
	}

	insertGhostImageForDrag(e) {
		this.clearCaret();

		let rng = this.doc.caretRangeFromPoint(e.clientX, e.clientY);

		if ( rng ) {
			let textNode = rng.startContainer;
			let offset = rng.startOffset;

			if ( textNode && textNode.nodeType === 3) {
				let repl = textNode.splitText(offset);
				let caret = this.doc.createElement('img');
				caret.src = 'https://html5up.net/uploads/demos/big-picture/images/thumbs/01.jpg';
				caret.classList.add('ghost-image');
				caret.classList.add('caret');
				textNode.parentNode.insertBefore(caret, repl);
			}
		}
	}

	insertDroppedImage(url, e) {
		this.clearCaret();

		let rng = this.doc.caretRangeFromPoint(e.clientX, e.clientY);
		let textNode = rng.startContainer;
		let offset = rng.startOffset;
		let img = this.doc.createElement('img');

		img.src = url;
		img.dataset.editable = 'media;image/png';

		if ( textNode && textNode.nodeType === 3) {
			let repl = textNode.splitText(offset);
			textNode.parentNode.insertBefore(img, repl);
		} else {
			e.target.appendChild(img);
		}
	}
};
