(function( root, doc ){

	var Engineer = function(){};
	var proto = Engineer.prototype;
	var _includeContexts = {};
	var _eventHandlers = {};
	var _defaultEventContext = {};
	var _modulePaths = {};
	var _engineer = void 0;
	var mainEl = void 0;
	var mainModule = void 0;
	var ctx = void 0;
	var n = void 0;

	var _excludes = [ 'constructor', 'prototype', 'init', 'render', 'close', 'destroy', 'bind', 'attributes' ];

	var _loadDeps = function( context, deps ) {
		if ( !context || !deps ) return;

		var l = deps.length;
		var i = 0;

		context.status = 'loading';

		// invoke promise resolve handlers when we have no deps
		if ( !l ) {
			context.promise.resolve();
			return;
		}

		// process all deps
		deps.forEach( function( dep ){
			if ( !_includeContexts[ dep ] ) {
				// add script tags for all deps
				_load( dep, function(){
					i++;
					// when all deps have been loaded, invoke all promise resolve handlers
					if ( i === l ) context.promise.resolve();
				});
			} else {
				// if the dep is present in the contexts array, move along...
				i++;
			}
		});
	};
	var _load = function( name, callback ){
		var body = doc.querySelector( 'body' );
		var tag = doc.createElement( 'script' );
		var path = ( _modulePaths[ name ] || name ) + '.js';

		tag.setAttribute( 'data-module', name );
		tag.src = path;

		// add load event handler for dep script tag
		tag.addEventListener( 'load', function( e ){
			tag.removeEventListener( 'load' );
			tag.removeEventListener( 'error' );
			// when script is loaded, add promise resolve handler
			// this handler will invoke the callback parameter
			_includeContexts[ name ].promise.resolve(function(){
				callback && callback.call( {}, tag, e );
			});
		}, false);

         tag.addEventListener( 'error', function(){
         	alert( 'error' );
         }, false);

		body.appendChild( tag );
	};

	var _parseForDeps = function( src ) {
		if ( !src ) return;

		var deps = [];

		src.replace( /\/\*.*?\*\//gi, '' )
			.replace( /\/\/.*?$/gi, '' )
				.replace( /include\([\s]*['"]([a-zA-Z0-9_\-.\/]+)['"][\s]*\)/gi, function(){
					deps.push( arguments[1] );
				});

		return deps;
	};

	var _generateUUID = function(){
	    var d = Date.now();
	    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g, function(c) {
	        var r = ( d + Math.random() * 16 ) % 16 | 0;
	        d = Math.floor( d / 16);
	        return ( 'x' === c ? r : ( r & 0x7 | 0x8 ) ).toString( 16 );
	    });
	    return uuid;
	};

	var _sanitizeString = function( str ){
		if ( !str ) return;
		return str.replace( /\<[^>]+?\>.*?\<\/[^>]+?\>/, '' );
	};

	// register custom elements
	var _createCustomElement = function( name, options ){
		options || ( options = {} );
		options.basePrototype || ( options.basePrototype = HTMLElement.prototype );
		options.createdCallback || ( options.createdCallback = function(){} );

		if ( !name ) {
			throw TypeError( 'name paramerter must be a string' );
		}

		if ( options.basePrototype && typeof options.basePrototype !== 'object' ) {
			throw TypeError( 'basePrototype option must be an object' );
		}

		if ( options.createdCallback && typeof options.createdCallback !== 'function' ) {
			throw TypeError( 'createdCallback option must be a function' );
		}

		var Prototype = Object.create( options.basePrototype );

		Prototype.createdCallback = options.createdCallback;
		Prototype.attachedCallback = options.attachedCallback;
		Prototype.attributeChangedCallback = options.attributeChangedCallback;

		return doc.registerElement( name, {
		  prototype: Prototype
		});
	};

	var _attributeBuilder = {
		'style' : function( props ) {
			var pVals = [],
				p;

			for ( p in props ) {
				if ( props.hasOwnProperty( p ) ) {
					pVals.push( p + ':' + props[ p ] );
				}
			}

			return pVals.join( ';' );
		},
		'class' : function( val ){
			return val;
		}
	}

	var _assignAttributes = function( attributes ){
		var attr;

		for ( attr in attributes ) {
			if ( attributes.hasOwnProperty( attr ) ) {
				this.setAttribute( attr, _attributeBuilder[ attr ]( attributes[ attr ] ) );
			}
		}
	};

	proto.Util = {
		augment: function(){
			var o = {};
			var args = Array.prototype.slice.call( arguments );
			var p;

			args.forEach(function( obj ){
				for( p in obj ) {
					if ( obj.hasOwnProperty( p ) ) {
						o[ p ] = obj[ p ];
					}
				}
			});

		    return o;
		},

		request: function( options ){
			var xhr = new XMLHttpRequest();
			var promise = new proto.Util.promise();

			xhr.onreadystatechange = function(){
				if ( 4 === xhr.readyState ) {
					if ( xhr.status < 300 ) {
						promise.resolve( xhr.response );
					}
					if ( xhr.status >= 400 ) {
						promise.error( xhr.response );
					}
					promise.done( xhr.response );
				}
			};

			xhr.open( options );

			return promise;
		},

		promise: function(){
			if ( !(this instanceof proto.Util.promise) ) {
				throw 'You must instantiate a promise to use it!';
			}

			var callbacks = {
				resolve: [],
				error: [],
				done: []
			};
			var callbackHandler = function( mode, callback ){
				if ( !mode || !~('resolve error done'.indexOf( mode )) ) return;

				var handlers = callbacks[ mode ];
				var i = 0;
				var l;
				var handler;

				if ( !callback ) {
					if ( !handlers || !handlers.length ) return;
					l = handlers.length;
					this.status = mode;
					for(; i < l; i++) {
						handlers[ i ]();
					}
					return;
				}

				if ( mode === this.status || 'done' === this.status && mode !== 'error' ) {
					callback();
				} else {
					handlers.push( callback );
				}
			};

			this.status = 'unresolved';

			this.resolve = function( callback ){
				callbackHandler.call( this, 'resolve', callback );
				this.done();
				return this;
			};
			this.error = function( callback ){
				callbackHandler.call( this, 'error', callback );
				return this;
			};
			this.done = function( callback ){
				callbackHandler.call( this, 'done', callback );
				return this;
			};
		},
		Event: function(){}
	};

	proto.Util.Event.fire = proto.Util.Event.prototype.fire = function( event, data, context ){
		if ( !event ) return;

		context || ( context = {} );

		var handlers = ( _eventHandlers[ event ] || (_eventHandlers[ event ] = []) );
		var i = 0;
		var l = handlers.length;

		for (; i < l; i++ ) {
			handlers[ i ].call( context, data );
		}
	};

	proto.Util.Event.listen = proto.Util.Event.prototype.listen = function( event, handler, context ){
		if ( !event || !handler ) return;
		context || ( context = _defaultEventContext );
		( _eventHandlers[ event ] || ( _eventHandlers[ event ] = [])).push( {
			handler: function(){
				handler.call( context );
			},
			context: context
		});
	};

	proto.Util.Event.forget = proto.Util.Event.prototype.forget = function( event, context ){
		if ( !event ) return;
		var handlers = _eventHandlers[ event ];
		var l = handlers.length;
		var handler;

		if ( !l ) return;

		do {
			handler = handlers[ i ];
			if ( handler && ( !context || (context && handler.context === context )) ) {
				handler = null;
			}
		} while ( l-- );
	};

	proto.Element = function( elementName ){

		var self = this;

		this.init = function(){
			debugger;
		};

		this.render = function(){
			debugger;
		};

		_createCustomElement( elementName, {
			basePrototype: this.prototype,
			createdCallback: function(){
				self.init.call( this );
			},
			attachedCallback: function(){
				self.render.call( this );
			},
			attributeChangedCallback: function(){

			}
		});

	};

	proto.Region = function(){
		proto.Element.prototype.constructor.apply( this, arguments );
	};
	proto.Region.prototype = proto.Util.augment( {}, proto.Element.prototype, proto.Region.prototype, {
		init: function(){
			debugger;
		},

		render: function(){
			debugger;
		}
	});

	proto.Surface = function(){
		proto.Element.prototype.constructor.apply( this, arguments );
	};
	proto.Surface.prototype = proto.Util.augment( {}, proto.Element.prototype, proto.Surface.prototype );


	/// startup

	_engineer = new Engineer();

	_engineer.Region( 'region-element' );
	_engineer.Surface( 'surface-element' );

	root.include = function( name ){
		if ( !name ) return;

		var context = _includeContexts[ name ];

		if ( context ) {
			// The 'main' module marks the UI entrypoint; it won't return a ref.
			if ( 'main' === name ) {
				return context;
			} else {
				return context.ref;
			}
		}
	};

	root.module = function( name, callback ){
		if ( !name || !callback || _includeContexts[ name ] ) return;

		var deps = [];
		var ctx;

		deps = _parseForDeps( callback.toString() );

		ctx = _includeContexts[ name ] = {
			name: name,
			callback: callback,
			promise: new proto.Util.promise(),
			status: 'not loaded'
		};

		ctx.promise.resolve(function(){
				ctx.status = 'loaded';
				ctx.ref = ctx.callback( _engineer );
			})
			.error(function(){
				alert( 'One or more dependencies failed to load!' );
			});

		_loadDeps( ctx, deps );

	};


	mainEl = doc.querySelector( '[data-load]' );

	if ( mainEl ) {
		mainModule = mainEl.getAttribute( 'data-load' );

		_load( mainModule );
	}

})( window, document );
