export class Region {
	constructor(el) {
		this.el = el;
	}

	init() {
		this.el.contentEditable = true;
	}

	initDragHandlers() {
		this.el.addEventListener('dragover', e => {
			if ([...e.dataTransfer.types].includes('text/x-image-url')) {
				//this.insertGhostImageForDrag(e);
			} else {
				//this.insertCaretForDrag(e);
			}
			e.preventDefault();
		});

		this.el.addEventListener('dragend', e => {
			//this.clearCaret();
		});

		this.el.addEventListener('dragenter', e => {
			if ([...e.dataTransfer.types].includes('text/x-image-url')) {
				if ( e.target.dataset['drop-target'] != undefined ) {
					e.target.classList.add('s--highlight');
				}
			} else {
				e.target.classList.add('s--not-permitted');
			}
		});

		this.el.addEventListener('dragleave', e => {
			if ( e.target.dataset['drop-target'] != undefined ) {
				e.target.classList.remove('s--highlight');
				e.target.classList.remove('s--not-permitted');
			}
		});

		this.el.addEventListener('drop', e => {
			if ([...e.dataTransfer.types].includes('text/x-image-url')) {
				let url = e.dataTransfer.getData("text/x-image-url");
				//this.insertDroppedImage(url, e);
				e.dataTransfer.clearData("text/x-image-url");
				e.preventDefault();
			}
			//this.clearCaret();
		});
	}

	// clearCaret() {
	// 	this.doc.querySelectorAll('.caret').forEach( el => {
	// 		this.doc.contains(el) && el.parentNode.removeChild(el);
	// 	});
	// }

	// insertCaretForDrag(e) {
	// 	this.clearCaret();
	//
	// 	let rng = this.doc.caretRangeFromPoint(e.clientX, e.clientY);
	//
	// 	if ( rng ) {
	// 		let textNode = rng.startContainer;
	// 		let offset = rng.startOffset;
	//
	// 		if ( textNode && textNode.nodeType === 3) {
	// 			let repl = textNode.splitText(offset);
	// 			let caret = this.doc.createElement('i');
	// 			caret.classList.add('caret');
	// 			textNode.parentNode.insertBefore(caret, repl);
	// 		}
	// 	}
	// }

	// insertGhostImageForDrag(e) {
	// 	this.clearCaret();
	//
	// 	let rng = this.doc.caretRangeFromPoint(e.clientX, e.clientY);
	//
	// 	if ( rng ) {
	// 		let textNode = rng.startContainer;
	// 		let offset = rng.startOffset;
	//
	// 		if ( textNode && textNode.nodeType === 3) {
	// 			let repl = textNode.splitText(offset);
	// 			let caret = this.doc.createElement('img');
	// 			caret.src = 'https://html5up.net/uploads/demos/big-picture/images/thumbs/01.jpg';
	// 			caret.classList.add('ghost-image');
	// 			caret.classList.add('caret');
	// 			textNode.parentNode.insertBefore(caret, repl);
	// 		}
	// 	}
	// }
	//
	// insertDroppedImage(url, e) {
	// 	this.clearCaret();
	//
	// 	let rng = this.doc.caretRangeFromPoint(e.clientX, e.clientY);
	// 	let textNode = rng.startContainer;
	// 	let offset = rng.startOffset;
	// 	let img = this.doc.createElement('img');
	//
	// 	img.src = url;
	// 	img.dataset.editable = 'media;image/png';
	//
	// 	if ( textNode && textNode.nodeType === 3) {
	// 		let repl = textNode.splitText(offset);
	// 		textNode.parentNode.insertBefore(img, repl);
	// 	} else {
	// 		e.target.appendChild(img);
	// 	}
	// }
}
