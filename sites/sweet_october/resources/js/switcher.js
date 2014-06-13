(function(){

	$( '[data-switcher]' ).each(function(){
		var $switcher = $( this );
		var $switcherItems = $switcher.find( '[data-switcher-item]' );
		var $nav = null;

		// remove items from DOM
		$switcherItems.hide();
		
		// init vars and switcher styles
		$switcher.addClass( 'switcher' );
		$nav = $( '#' + $switcher.attr( 'data-nav' ) );
		$nav.addClass( 'switcher-nav' );
		$switcherItems.addClass( 'switcher-item' );

		// init each switcher nav item
		$nav.find( '[data-switcher-item]' ).each(function(){
			var $item = $( this );

			$item.off( 'click' ).on( 'click', function(){
				var $ctx = $( this );

				$nav.find( '[data-switcher-item]' ).removeClass( 'active' );
				$ctx.addClass( 'active' );

				$switcherItems.hide();
				$( $ctx.attr( 'href' ) ).show();
				
				return false;
			});
		});

		$nav.find( '[data-switcher-item]' ).first().click();
	});

})();