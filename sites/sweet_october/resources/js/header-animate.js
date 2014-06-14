$( document ).ready( function(){
	var $header = $( '#billboard' );
	var images = [
		'../images/bg1.jpg',
		'../images/bg2.jpg',
		'../images/bg3.jpg',
		'../images/bg4.jpg'
	];
	var l = images.length - 1;
	var cnt = 0;

	var headerAnimate = function(){
		$header.animate(
			{
				opacity: 0
			},{
				duration: 1000,
				complete: function(){
					cnt = cnt++ && cnt > l ? 0 : cnt;
					$header.css( 'background-image', 'url("' + images[ cnt ] + '")' );
					$header.animate({
						opacity: 1
					},{
						duration: 1000,
						complete: function(){
							setTimeout( headerAnimate, 4000 );
						}
					});
				}
			}
		);
	};

	setTimeout( headerAnimate, 4000 );
});