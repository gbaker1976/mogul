var markup = '<div data-placeholder data-target style="width:200px;height:200px;"><span data-popover><a href="#">remove</a></span><img src="artifacts/image/icon.svg" /></div>';

self.addEventListener( 'message', function( e ) {

	if ( e.data.event ) {
		switch ( e.data.event ) {
			case 'CONTENT_ADDED' :
				self.postMessage({
					event: 'SHOW_UI',
					path: 'artifacts/image/main-view.js'
				});
				break;
			case 'START' :
				self.postMessage({
					event: 'CONTENT',
					content: markup
				}); // drop initial placeholder
				break;
		}
	}

}, false );
