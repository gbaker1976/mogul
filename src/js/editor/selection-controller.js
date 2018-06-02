import {HtmlUtils} from './html-utils.js';

export class SelectionController {
	constructor(doc) {
		this.doc = doc;
		this.initHandlers();
	}

	initHandlers() {
		this.doc.addEventListener('mousedown', e => {
			if (!e.shiftKey) {
				this.doc.getSelection().removeAllRanges();
				this.selectionHandler();
			}
		});

		// ### selecting text and processing ranges
		this.doc.addEventListener('mouseup', e => {
			const rng = this.ensureSelectedRange();
			if (rng) {
				this.selectionHandler(rng, true);
			} else {
				this.selectionHandler(rng, false)
			}
		});
	}

	setSelectionHandler(handler) {
		this.selectionHandler = handler;
	}

	getRangeForCurrentSelection() {
		const range = this.ensureSelectedRange();
		return range && range.cloneRange();
	}

	ensureSelectedRange(allowZeroLength = false) {
		const sel = this.doc.getSelection();

		if(sel.type == 'Range' && sel.rangeCount){
			const rng = sel.getRangeAt(0);

			if (allowZeroLength) return rng;

			// ensure we have a selection length > 0
			if (rng.startOffset !== rng.endOffset) {
				return rng;
			}
		}
	}

	getSelectedNodes() {
		const sel = this.doc.getSelection();
		const rng = this.ensureSelectedRange();
		const nodes = [];

		if (rng) {
			const parent = this.getWorkNode(rng);
			HtmlUtils.iterateNodes([parent], n => {
				if (sel.containsNode(n)) {
					nodes.push(n);
				}
			}, true);
		}

		return nodes;
	}

	getWorkNodeForCurrentSelection(expandTextSelection = false) {
		const rng = this.ensureSelectedRange();
		return rng && this.getWorkNode(rng, expandTextSelection);
	}

	getWorkNode(range, expandTextSelection = false) {
		let n;

		if (range.startContainer === range.endContainer) {
			if (range.startContainer.nodeType === 3 && expandTextSelection) {
				if (this.containsFullNodeContents(range)) {
					n = range.startContainer.parentElement;
				} else {
					n = range.startContainer;
				}
			} else {
				n = range.startContainer;
			}
		} else {
			n = range.commonAncestorContainer;
		}

		return n;
	}

	isMultiNodeSelection() {
		const range = this.ensureSelectedRange();
		return range.startContainer !== range.endContainer;
	}

	containsFullNodeContents(range) {
		let p1;

		if (range.startOffset > 0) return false;

		if (range.startContainer === range.endContainer) { // single container selection
			p1 = range.startContainer;
			switch (p1.nodeType) {
				case 3: // text
					return p1.parentElement.childNodes.length === 1 &&
						range.endOffset === p1.nodeValue.length;
					break;
				case 1: // element
					debugger;
					break;
			}
		}

		return false;
	}

	duplicateRangeForNodes(range, ...nodes) {
		let rng = range.cloneRange();

		if (nodes && nodes.length) {
			rng.setStart(nodes[0], rng.startOffset);
			rng.setEnd(nodes[nodes.length-1], rng.endOffset);
		}

		return rng;
	}

	resetSelectionByNode(node) {
		const rng = this.ensureSelectedRange(true);
		rng.selectNodeContents(node);
		this.resetSelectionByRange(rng);
	}

	resetSelectionByRange(range) {
		const sel = this.doc.getSelection();
		sel.removeAllRanges();
		sel.addRange(range);
	}

	debounce(handler, millis) {
		let intID;
		return (e) => {
			let f = () => handler.call(e)

			if (intID) window.clearInterval(intID);
			intID = window.setInterval(f, millis);
		}
	}
}
