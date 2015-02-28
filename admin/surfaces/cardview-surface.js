module( 'surfaces/cardview-surface', function( sys ){

	var BaseSurface = include( 'surfaces/spring-surface' );

	return BaseSurface.extend( 'cardview-surface', {
		attributes: {
			style: {
				'position': 'absolute',
				'top': '20px',
				'left': '20px',
				'bottom': '20px',
				'right': '20px',
				'border-radius': '7px',
				'box-shadow': '0 0 5px rgba(0,0,0,0.3) inset, 2px 2px 0 rgba(255,255,255,1)',
				'background-color': '#eee',
				'padding':'1em'
			}
		}
	});

});
