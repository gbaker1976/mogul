
(function( doc, win ){

	var themeDoc = doc.currentScript.ownerDocument;
	var svg = doc.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
	var use = doc.createElementNS( 'http://www.w3.org/2000/svg', 'use' );

	svg.setAttribute( 'class', 'icon' );
	svg.appendChild( use );

	// append our SVG sprite in the importing doc
	doc.body.insertBefore( themeDoc.querySelector( '.savage-sprite' ).cloneNode( true ), doc.body.firstChild );

	// replace images
	[].forEach.call( doc.querySelectorAll( '[data-savage-icon]' ), function( el ){
		use.setAttributeNS(
			'http://www.w3.org/1999/xlink',
			'href',
			'#savage-' + el.getAttribute( 'data-savage-icon'
		));
		el.parentNode.replaceChild( svg.cloneNode( true ), el );
	});

})( document, window );
