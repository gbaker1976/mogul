module( 'surfaces/card-surface', function( sys ){

	var BaseSurface = include( 'surfaces/spring-surface' );

	return BaseSurface.extend( 'card-surface', {
			attributes: {
				style: {
					'float':'left',
					'display': 'block',
					'height': '200px',
					'width': '200px',
					'border-radius': '3px',
					'box-shadow': '0 0 4px rgba( 0,0,0,0.3 )',
					'background-color': '#fff',
					'padding':'.4em',
					'margin': '0 3em 1em 0'
				}
			}
		}
	);

});
