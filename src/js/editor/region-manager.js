import {Region} from './region.js';

export class RegionManager {
	constructor(doc) {
		this.doc = doc;
	}

	get regions() {
		if (!this._regions) {
			this._regions = [];
		}

		return this._regions;
	}

	initRegions() {
		this.doc.querySelectorAll('[data-editable]').forEach(e => this.initRegionForNode(e));

		this.doc.addEventListener('mouseup', e => {
			if (e.target.dataset && e.target.dataset.editable) {
				this.doc.querySelectorAll('[data-editable].editing').forEach( e => e.classList.remove('editing') );
				e.target.classList.add('editing');
			}
		});

		this.initBackspaceShim();
	}

	initRegionForNode(n) {
		this.regions[
			this.regions.push(new Region(n)) - 1
		].init();

		if (!n.innerHTML) {
			this.backFillEmptyEditRegion(n);
		}
	}

	initBackspaceShim() {
		// ensure content is wrapped/nested properly
		this.doc.addEventListener('input', e => {
			switch (e.inputType) {
				case 'inputFromPaste' :
					throw new Error('not implemented!');
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

	backFillEmptyEditRegion(el) {
		let p = this.doc.createElement('p');
		p.appendChild(this.doc.createTextNode('\u200B')); // unicode zero-width space
		el.innerHTML = '';
		el.appendChild(p);

		return p;
	}
}
