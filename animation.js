/*
* Animation.js v1.0.0 Copyright (c) 2013
* License: MIT
* Author: Roll
* http://github.com/rollRoll/Animation.js
*/
;(function($, window, document, undefined) { "use strict"; 
	var 
		Animation,
		_ieVersion,
		_isIEBrowser,
		_hasRnBFramework = !! ( window.R && window.RnB && R.Util );

	Animation = {
		
		/**
		 * Get the major version of IE
		 * @return [integer]
		 * @reference James Padolsey <https://gist.github.com/527683>
		 */
		isIE: ( _hasRnBFramework )? R.Util.isIE : function() {
			var self = Animation.isIE;
			self.version = ( self.version !== undefined )? self.version
				: (function(){
					var 
						v = 3, div, all,
						isIE10 = /Mozilla\/5.0 \(compatible\; MSIE 10(.+)/.test( window.navigator.userAgent );
					
					if ( isIE10 ) return 10;

					div = document.createElement('div'),
					all = div.getElementsByTagName('i');

					while (
						div.innerHTML = '<!--[if gt IE ' + ( ++v ) + ']><i></i><![endif]-->',
						all[0]
					){;}

					return ( v > 4 )? v : false;
					
				}());
			return self.version;
		},

		getVendorPrefix:  function( cssName ) {
			cssName = cssName || 'Animation';
			
			var 
				self = Animation.getVendorPrefix,
				defaults = cssName.toLowerCase();

			self.prefix = ( self.prefix !== undefined )? self.prefix
				: (function(){
					var 
						prefixes = [defaults, "Moz" + cssName, "Webkit" + cssName, "ms" + cssName, "O" + cssName],
						reg  = new RegExp('(.+)' + defaults, 'i'),
						tmp = document.createElement("div"),
						i = 0, len = prefixes.length,
						matchs, defaultPrefix = "";
					
	 			    for ( ; i < len; i++ ) {
						if ( tmp.style[ prefixes[ i ] ] !== undefined ) {
							matchs = prefixes[ i ].match( reg );
							return ( matchs )? matchs[1].toLowerCase() : defaultPrefix;
						}
					}
					return false;
				}());
			return self.prefix;
		},
		
		prefixed: function( cssName ) {
			var vendorPrefix = Animation.getVendorPrefix();	
			return ( vendorPrefix )? vendorPrefix + cssName : cssName.toLowerCase();
		},

		onCss3Event: function($dom, eventName, eventFn) {
			var vendorEventName = Animation.prefixed( eventName );
			$dom.one(vendorEventName, eventFn);
			( _isIEBrowser ) && $dom.trigger( vendorEventName );
		},

		offCss3Event: function($dom, eventName, stop) {
			var vendorEventName = Animation.prefixed( eventName );
			( stop ) && $dom.trigger( vendorEventName );
			$dom.off( vendorEventName );
		},

		animateIn: function($dom, animateCls, callback, speedCls, removeClass) {
			var 
				event = 'AnimationEnd',
				cls = ( speedCls === null? '' : speedCls || 'animated07' ) + ' ' + animateCls;
			
			Animation.offCss3Event($dom, event, true);
			$dom.show().addClass( cls );
			Animation.onCss3Event($dom, event, function() {
				( removeClass !== false ) && $dom.removeClass( cls );
				( callback ) && callback();
			});
			return $dom;
		},

		animateOut: function($dom, animateCls, callback, speedCls) {
			var cls = ( speedCls === null? '' : speedCls || 'animated07' ) + ' ' + animateCls;
			$dom.addClass( cls );
			Animation.onCss3Event($dom, 'AnimationEnd', function() {
				$dom.hide().removeClass( cls );
				( callback ) && callback();
			});
			return $dom;
		},

		animate: function(action, $dom, animateCls, args) {
			var animateArgs = [$dom, animateCls].concat( Array.prototype.slice.call( args ) );
			return this[ ( action === 'in' )? 'animateIn' : 'animateOut' ].apply(this, animateArgs);
		}
	};

	_ieVersion = Animation.isIE(),
	_isIEBrowser = ( _ieVersion && _ieVersion < 10 );

	// Expose Animation to the global object
	window.Animation = Animation;

	// Expose Animation as an AMD module
	if ( $.isFunction( window.define ) && define.amd ) {
		define("Animation", [], function() {
			return Animation;
		});
	}

})($, this, this.document);