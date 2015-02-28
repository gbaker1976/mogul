var markup = '<div data-artifact-content data-target contenteditable="true"><span data-popover>Edit text.</span>Your text here...</div>';

self.addEventListener( 'message', function( e ) {

	if ( e.data.event ) {
		switch ( e.data.event ) {
			case 'CONTENT_ADDED' :
				self.postMessage({
					event: 'SHOW_UI',
					path: 'artifacts/text/main-view.js'
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
