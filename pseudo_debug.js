/* ---------------------------------------------------------------------------
 *  Pseudo JavaScript framework, version 0.1b
 *  (c) 2009 Alex Lein
 *
 *  Pseudo is based heavily on the awesome
 *  Prototype JavaScript framework (c) 2005-2009 Sam Stephenson
 *
 *  Pseudo is freely distributable under the terms of an MIT-style license.
 *  For details, see the Prototype web site: http://www.prototypejs.org/
 *
 *--------------------------------------------------------------------------*/
/*
if (Pseudo.Browser.IE && console) {(function(){
	for (var each in console) {
		var property = console[each];
		if (String(property).contains("[native code]")) {
			console[each] = (function(method){
				return function() {
					var messages = [];
					for (var i=0,l=arguments.length; i<l; i++)
						messages.push(Object.inspect(arguments[i]));
					method(messages.join(","));
				};
			})(property);
		};
	};
})()};
*/
Object.extend(Pseudo.Debug = {},(function(){
	var	active = false,
		timer = new Date().valueOf(),
		console = window.console,
		slice = Array.prototype.slice;
	
	function reset() {
		active = true;
		timer = new Date().valueOf();
	};
	function activate() { active = true };
	function deactivate() { active = false };
	function write(type/*,arg1,arg2,argN*/) {
		var time = new Date().valueOf() - timer, args = slice.call(arguments,1);
		console[type || "log"].apply(console,[time].inject(args));
	};
	function threshold(milliseconds/*,arg1,arg2,argN*/) {
		if (!active) return;
		var time = new Date().valueOf() - timer, args = slice.call(arguments,1);
		if (time > milliseconds) write("info",[time +">"+ milliseconds].inject(args));
	};
	
	return {
		"timer": timer,
		"reset": reset,
		"activate": activate,
		"deactivate": deactivate,
		"write": write,
		"log": function() { write.apply(null,["log"].inject(arguments)) },
		"info": function() { write.apply(null,["info"].inject(arguments)) },
		"warn": function() { write.apply(null,["warn"].inject(arguments)) },
		"error": function() { write.apply(null,["error"].inject(arguments)) },
		"threshold": threshold
	};
})());
if (!window.Debug) window.Debug = Pseudo.Debug;
/*
* object.watch v0.0.1: Cross-browser object.watch
*
* By Elijah Grey, http://eligrey.com
*
* A shim that partially implements object.watch and object.unwatch
* in browsers that have accessor support.
*
* Public Domain.
* NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
*
// object.watch
if (!Object.prototype.watch) {
	Object.prototype.watch = function(propertyName,handler) {
		var oldval = this[propertyName], newval = oldval;
		function getter() { return newval };
		function setter(val) {
			oldval = newval;
			return newval = handler.call(this, propertyName, oldval, val);
		};
		
		if (delete this[propertyName]) { // can't watch constants
			this[propertyName] = oldval;
			// ECMAScript 5
			if (Object.defineProperty) {
				Object.defineProperty(this,propertyName,{ "get": getter, "set": setter });
			
			// legacy
			} else if (Object.prototype.__defineGetter__) {
				Object.prototype.__defineGetter__.call(this,propertyName,getter);
				Object.prototype.__defineSetter__.call(this,propertyName,setter);
			}; 
		};
	};
};
// object.unwatch
if (!Object.prototype.unwatch) {
    Object.prototype.unwatch = function(propertyName) {
        var val = this[propertyName];
        delete this[propertyName]; // remove accessors
        this[propertyName] = val;
    };
};
/**/