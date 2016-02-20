export class View extends HTMLElement {
	constructor(){
        super();
	}

    attachedCallback(){
        this.innerHTML = "<h1>Hello, World!</h1>";
    }
};

document.registerElement( 'mogul-view', View );
