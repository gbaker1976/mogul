export class View {
	constructor( config ){
		this.config = config || {};
	}

    render(){
        if ( this.config.node ) {
            this.config.node.appendChild( document.createElement( 'div' ) ).innerHTML = this.config.template || '';
        }
    }
};
