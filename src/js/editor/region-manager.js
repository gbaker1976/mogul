import {Region} from './region.js';

class RegionManager {
	set document(doc) {
		this._doc = doc;
	}

	get document() {
		if (!this._doc) throw new Error('Document not set');

		return this._doc;
	}

	get regions() {
		if (!this._regions) {
			this._regions = [];
		}

		return this._regions;
	}

	initRegions(doc) {
		this.document = doc;
		this.document.querySelectorAll('[data-editable]').forEach(e => this.initRegionForNode(e));

		this.document.addEventListener('mouseup', e => {
			if (e.target.dataset && e.target.dataset.editable) {
				this.document.querySelectorAll('[data-editable].editing').forEach( e => e.classList.remove('editing') );
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
		this.document.addEventListener('input', e => {
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
		let p = this.document.createElement('p');
		p.appendChild(this.document.createTextNode('\u200B')); // unicode zero-width space
		el.innerHTML = '';
		el.appendChild(p);

		return p;
	}
}

export default {
	get instance() {
		if (!this._instance) {
			this._instance = new RegionManager();
		}

		return this._instance;
	}
}
