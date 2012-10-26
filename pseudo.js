/* ---------------------------------------------------------------------------
 *	Pseudo JavaScript framework, v2.0 (c) 2012 Alex Lein
 *	Pseudo is freely distributable under the terms of The MIT License.
 *	For source code and licence, see http://code.google.com/p/pseudo/
 *--------------------------------------------------------------------------*/
"use strict";
var Pseudo = (function(){
	var	x = 0,
		VERSION = 2,
		BROWSER = { "IE": false, "Opera": false, "Gecko": false, "Webkit": false, "Mobile": false },
		BROWSER_VERSION = NaN,
		FILTER_OVERLOAD = /^function[^\(]*\(\$.+/im,
		SLICE = Array.prototype.slice,
		VALUEOF = Function.prototype.valueOf,
		TOSTRING = Function.prototype.toString,
		PROPERTY = { "configurable": true, "enumerable": true };
	
	// browser/engine
	BROWSER["Mobile"] = /\bAndroid\s+[\d.]+;|\b(?:iP[ao]d|iPhone);|IEMobile.[\d\.]+|\bPlayBook;|Opera\s(?:Mini|Mobi)\/[\d\.]+/.test(navigator.userAgent);
	if (BROWSER.IE = /*@cc_on!@*/!1) {
		BROWSER_VERSION = navigator.userAgent.match(/\s*MSIE\s*(\d+\.?\d*)/i)[1];
		BROWSER["IE"+ parseInt(BROWSER_VERSION)] = true;
		BROWSER["IEcompat"] = parseInt(BROWSER_VERSION) < 9 && ScriptEngineMajorVersion() > 5;
	} else if (BROWSER.Opera = (Object.prototype.toString.call(window.opera||Object) === "[object Opera]")) {
		BROWSER_VERSION = window.opera.version();
		BROWSER["Opera"+ parseInt(BROWSER_VERSION)] = true;
	} else if (BROWSER.Gecko = (/\sGecko\/\d{8}\s/.test(navigator.userAgent))) {
		BROWSER_VERSION = navigator.userAgent.match(/\s*rv\:([\d\.]+)/i)[1];
		BROWSER["Gecko"+ parseInt(BROWSER_VERSION)] = true;
	} else if (BROWSER.Webkit = (/\s(?:Apple)?WebKit\/([\d\.]+)/.test(navigator.userAgent))) {
		BROWSER_VERSION = navigator.userAgent.match(/\s(?:Apple)?WebKit\/([\d\.]+)/)[1];
		BROWSER["Webkit"+ parseInt(BROWSER_VERSION)] = true;
	};
	
	// add scripts or stylesheet
	if (!document.head) document.head = document.getElementsByTagName("head")[0];
	function RELOAD(tag,attr,source) {
		var i = 0, node, nodes = document.getElementsByTagName(tag);
		for (; node=nodes[i]; i++) if (node.getAttribute(attr) === source) return node.parentNode.removeChild(node);
	};
	
	// classing/prototype
	function isOverloadable(method) {
		return !!(method instanceof Function && FILTER_OVERLOAD.test(method.toString()));
	};
	function overload(ancestor,func) {
		return extend(
			function() { return func.apply(this,[ancestor.bind(this)].inject(SLICE.call(arguments,0))) },
			{ "valueOf": VALUEOF.bind(func), "toString": TOSTRING.bind(func) }
		);
	};
	
	// utility
	function expand(object,source1,source2,sourceN) {
		var sources = SLICE.call(arguments,1), prop, i = 0, l = sources.length;
		for (;i<l;i++) if (sources[i]) for (prop in sources[i]) if (!(prop in object)) object[prop] = sources[i][prop];
		return object;
	};
	function extend(object,source1,source2,sourceN) {
		var sources = SLICE.call(arguments,1), prop, i = 0, l = sources.length;
		for (;i<l;i++) if (sources[i]) for (prop in sources[i]) object[prop] = sources[i][prop];
		return object;
	};
	
	return {
		"version": VERSION,
		"Browser": BROWSER,
		"BrowserVersion": BROWSER_VERSION,
		
		// utility
		"addScript": function addScript(source,callback,reload) {
			if (reload) RELOAD("script","src",source);
			
			var file = document.createElement("script");
			file.async = false;	// html5/IE10
			file.type = "text/javascript";
			file.setAttribute("src",source);
			if (callback) {
				if (!BROWSER.IE8) file.onload = callback;
				else file.onreadystatechange = function() {
					if (!(/loaded|complete/i).test(this.readyState)) return;
					this.onreadystatechange = null;
					callback.call(this);
				};
			};
			return document.head.appendChild(file);
		},
		"addSheet": function addSheet(source,media,reload) {
			if (reload) RELOAD("link","href",source);
			
			var file = document.createElement("link");
			file.setAttribute("rel","stylesheet");
			file.setAttribute("type","text/css");
			file.setAttribute("href",source);
			if (media) file.setAttribute("media",media);
			return document.head.appendChild(file);
		},
		"expand": expand,
		"extend": extend,
		"guid": function guid() {
			var i = 0, l = 36, r = i, id = [,,,,,,,,"-",,,,,"-","4",,,,"-",,,,,"-",,,,,,,,,,,,,];
			for(; i<l; i++) if (i === 8 || i === 13 || i === 14 || i === 18 || i === 23) { continue } else {
				r = Math.random() * 16 | 0;
				id[i] = (i !== 19 ? r : r & 0x3 | 0x8).toString(16);
			};
			return id.join("");
		},
		"tryThese": function tryThese(func1,func2,funcN) {
			var i = 0, prevEx, prevFunc, func, funcs = SLICE.call(arguments,0);
			for (;func=funcs[i];i++) {
				try { return func.call(this,i,prevEx,prevFunc) }
				catch (exception) { prevEx = exception };
				prevFunc = func;
			};
		},
		"um": function unmolested(object) { return object },
		"unique": function unique() { return x++ },
		
		// classing/prototype
		"augment": function augment(object,methods) {
			var name, method, $super = Object.getPrototypeOf(object);
			if (methods.constructor && !Function.isNative(methods.constructor)) methods.__constructor = methods.constructor;
			for (name in methods) if (name !== "constructor") {
				object[name] = !isOverloadable(methods[name]) ? methods[name] : overload($super && $super[name] || object[name],methods[name]);
			};
			return object;
		},
		"define": function define(object,source1,source2,sourceN) {
			var	sources = SLICE.call(arguments,1),
				i = 0, l = sources.length,
				name, property, current, ancestor,
				$super = Object.getPrototypeOf(object);
			for (;i<l;i++) for (name in sources[i]) {
				property = Object.clone(sources[i][name]);
				if (current = Object.getOwnPropertyDescriptor(object,name)) expand(property,current);
				if (ancestor = Object.getOwnPropertyDescriptor($super,name)) expand(property,ancestor);
				expand(property,PROPERTY);
				
				if (isOverloadable(property["get"])) property["get"] = overload(
					current && current["get"] || ancestor && ancestor["get"],
					property["get"]
				);
				if (isOverloadable(property["set"])) property["set"] = overload(
					current && current["set"] || ancestor && ancestor["set"],
					property["set"]
				);
				Object.defineProperty(object,name,expand(property,current,ancestor));
			};
			return object;
		},
		"isOverloadable": isOverloadable,
		"overload": overload
	};
})();

/***********************
*** Object *************
***********************/
(function(){
	var	FILTER_CLASS = /^\[object\s(.*)\]$/,
		TOSTRING = Object.prototype.toString,
		NATIVE_CONSTRUCTOR = !!(TOSTRING.constructor ? TOSTRING.constructor.prototype : null),
		NATIVE_PROTO = typeof TOSTRING.__proto__ === "object",
		KEYS_BUG = !({ "toString": null }).propertyIsEnumerable("toString"),
		KEYS_DONT = ["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"];
	
	// extensions
	function className(object) {
		if (object === undefined) return "undefined";
		else if (object === null) return "null";
		else return TOSTRING.call(object).match(FILTER_CLASS)[1];
	};
	function pairs(object) {
		if (typeof object !== "object" && typeof object !== "function" || object === null) throw new TypeError("Object.pairs called on non-object");
		var results = [], each, i = 0;
		for (each in object) if (object.hasOwnProperty(each)) results.push({ "name": each, "value": object[each] });
		if (KEYS_BUG) for (;each=KEYS_DONT[i];i++) if (object.hasOwnProperty(each)) results.push({ "name": each, "value": object[each] });
		return results;
	};
	
	this.expand(Object,this.Object = {
		// compatibility
		"keys": function keys(object) {
			if (typeof object !== "object" && typeof object !== "function" || object === null) throw new TypeError("Object.keys called on non-object");
			var result = [], each, i = 0;
			for (each in object) if (object.hasOwnProperty(each)) result.push(each);
			if (KEYS_BUG) for (;each=KEYS_DONT[i];i++) if (object.hasOwnProperty(each)) result.push(each);
			return result;
		},
		"create": function create(prototype,descriptor) {
			var klass = function(properties) {
				if (properties) Pseudo.define(this,properties);
			};
			klass.prototype = prototype;
			return new klass(descriptor);
		},
		"freeze": function freeze(object) { return object },
		"isFrozen": function isFrozen() { return false },
		"seal": function seal(object) { return object },
		"isSealed": function isSealed() { return false },
		"preventExtensions": function preventExtensions(object) { return object },
		"isExtensible": function isExtensible() { return false },
		"defineProperties": function defineProperties(object,descriptors) {
			for (var each in descriptors) Object.defineProperty(object,each,descriptors[each]);
			return object;
		},
		"defineProperty": function defineProperty(object,propertyName,descriptor) {
			return object;
		},
		"getOwnPropertyDescriptor": function getOwnPropertyDescriptor(object,propertyName) {
			return undefined;
		},
		"getOwnPropertyNames": function getOwnPropertyNames(object) {
			var each, names = [], proto = this.getPrototypeOf(object);
			for (each in object) if (!(each in proto)) names.push(each);
			return names;
		},
		"getPrototypeOf": function getPrototypeOf(object) {
			var proto;
			if (NATIVE_CONSTRUCTOR) proto = object.constructor && object.constructor.prototype;
			else if (PROTO_NATIVE) proto = object.__proto__;
			if (!proto) {
				var klass = window[className(object)];
				if (klass) proto = klass.prototype;
			};
			return proto || null;
		},
		
		// extensions
		"className": className,
		"clone": function clone(object) { return Pseudo.extend({},object) },
		"each": function each(object,callback,scope) {
			var values = pairs(object), i = 0, pair, results = new Array(values.length);
			if (arguments.length < 3) scope = object;
			for (;pair=values[i];i++) results[i] = callback.call(scope,pair.value,pair.name,object);
			return results;
		},
		"isArguments": function isArguments(object) {
			var cn = className(object);
			return cn === "Arguments" || cn === "Object" && !isNaN(object.length) && "callee" in object;
		},
		"isNothing": function isNothing(object) { return object === null || object === undefined },
		"pairs": pairs,
		"prototypeChain": function prototypeChain(object) {
			var chain = [], prev, proto = isNothing(object) ? null : Object.getPrototypeOf(object);
			while (proto) {
				chain.push(proto);
				prev = proto;
				proto = Object.getPrototypeOf(proto);
				if (prev === proto) break;
			};
			return chain;
		}
	});
}).call(Pseudo);

/***********************
*** Array **************
***********************/
(function(){
	var	SLICE = Array.prototype.slice,
		FILTER_NATURAL = /[a-z]+|[0-9]+/gim,
		HELPER_MAX = function(prev,next) { return prev > next ? prev : next },
		HELPER_MIN = function(prev,next) { return prev < next ? prev : next },
		HELPER_SUM = function(prev,next) { return prev + next };
	
	this.expand(Array,this.Array = {
		// compatibility
		"isArray": function isArray(object) {
			if (!object) return false;
			else if (object instanceof Array) return true;
			return Object.prototypeChain(object).contains(Array.prototype);
		},
		
		// extension
		"from": function from(object) {
			if (!object) return [];
			if ("toArray" in Object(object)) return object.toArray();
			try { return SLICE.call(object,0) }
			catch(x) { /* IE errors sometimes */ };
			var length = object.length || 0, results = new Array(length);
			while (length--) results[length] = object[length];
			return results;
		},
		"natural": function natural(a,b) {
			if (!a && !b) return 0;
			var first = a.match(FILTER_NATURAL), second = b.match(FILTER_NATURAL);
			if (!first) return -1;
			else if (!second) return 1;
			var one, two, i = 0, l = Math.max(first.length,second.length);
			for (;i<l;i++) {
				if (!first[i]) return -1;
				else if (!second[i]) return 1;
				one = parseInt(first[i],36);
				two = parseInt(second[i],36);
				if (one < two) return -1;
				else if (two < one) return 1;
			};
			if (a < b) return -1;
			else if (b < a) return 1;
			else return 0;
		},
		"random": function random() {
			var variation = this.length || 5;
			return Math.random().betweenRange(variation,-variation).round();
		}
	});
	this.expand(Array.prototype,this.Array.Prototypes = {
		// compatibility
		"every": function every(callback,scope) {
			var i = 0, l = this.length;
			for (;i<l;i++) if (!callback.call(scope,this[i],i,this)) return false;
			return true;
		},
		"filter": function filter(callback,scope) {
			var i = 0, l = this.length, result = [];
			for (;i<l;i++) if (callback.call(scope,this[i],i,this)) result.push(this[i]);
			return result;
		},
		"forEach": function forEach(callback,scope) {
			for (var i=0,l=this.length; i<l; i++) callback.call(scope,this[i],i,this);
		},
		"indexOf": function indexOf(object,fromIndex) {
			if (isNaN(fromIndex)) fromIndex = 0;
			for (var l=this.length; fromIndex<l; fromIndex++) if (fromIndex in this && object === this[fromIndex]) return fromIndex;
			return -1;
		},
		"lastIndexOf": function lastIndexOf(object,fromIndex) {
			if (isNaN(fromIndex)) fromIndex = this.length;
			else if (fromIndex < 0) fromIndex  = 0;
			do { if (fromIndex in this && object === this[fromIndex]) return fromIndex } while (fromIndex--);
			return -1;
		},
		"map": function map(callback,scope) {
			var i = 0, l = this.length, result = new Array(l);
			for (;i<l;i++) result[i] = callback.call(scope,this[i],i,this);
			return result;
		},
		"push": function push(object) { this[this.length] = object },	// IE5 compatibility?
		"reduce": function reduce(callback,initialValue) {
			if (!this.length) return initialValue;
			var i = 0, l = this.length, prev = initialValue;
			if (arguments.length < 2) prev = this[i++];
			for (;i<l;i++) prev = callback(prev,this[i],i,this);
			return prev;
		},
		"reduceRight": function reduceRight(callback,initialValue) {
			if (!this.length) return initialValue;
			var i = this.length-1, prev = initialValue;
			if (arguments.length < 2) prev = this[i--];
			while (i--) prev = callback(prev,this[i],i,this);
			return prev;
		},
		"reverse": function reverse() {
			var i = 0, l = this.length - 1, result = new Array(i);
			for (; i<=l; i++) result[i] = this[l-i];
			return result;
		},
		"some": function some(callback,scope) {
			var i = 0, l = this.length;
			for (;i<l;i++) if (!callback.call(scope,this[i],i,this)) return true;
			return false;
		},
		
		// extension
		"copy": function copy() {
			var i = 0, l = this.length, result = new Array(l);
			for (;i<l;i++) result[i] = this[i];
			return result;
		},
		"each": function each(callback,scope) {
			if (arguments.length < 2) scope = this;
			this.forEach(callback,scope);
			return this;
		},
		"filterFirst": function filterFirst(callback,scope) {
			var i = 0, l = this.length;
			if (arguments.length < 2) scope = this;
			for (;i<l;i++) if (callback.call(scope,this[i],i,this)) return this[i];
		},
		"filterIndex": function filterIndex(callback,scope) {
			var i = 0, l = this.length;
			if (arguments.length < 2) scope = this;
			for (;i<l;i++) if (callback.call(scope,this[i],i,this)) return i;
			return -1;
		},
		"filterIndexes": function filterIndexes(callback,scope) {
			var i = 0, l = this.length, result = [];
			if (arguments.length < 2) scope = this;
			for (;i<l;i++) if (callback.call(scope,this[i],i,this)) result.push(i);
			return result;
		},
		"inject": function inject(array) {
			var i = 0, c = this.length, l = array.length;
			this.length += l;
			for (;i<l;i++) this[c+i] = array[i];
			return this;
		},
		"insert": function insert(object,index) {
			this.splice(!isNaN(index) ? index : this.length,0,object);
			return this;
		},
		"insertBefore": function insertBefore(object,before) {
			var index = this.indexOf(before);
			return this.insert(object,index > -1 ? index : 0);
		},
		"none": function none() { return !this.every() },
		"last": function last() { return this[this.length-1] },
		"remove": function remove(object) {
			for (var i=0; i<this.length; i++) if (this[i] === object) this.splice(i--,1);
			return this;
		},
		
		// comparison
		"contains": function contains(object) { return this.indexOf(object) > -1 },
		"equals": function equals(other,notDeep) {
			var i = 0, l = this.length, same = other instanceof this.constructor && other.length === l;
			for (; same && i<l; i++) same = !notDeep && this[i] instanceof this.constructor ? this[i].equals(other[i]) : this[i] === other[i];
			return same;
		},
		"left": function left(length) {
			var i = 0, l = Math.max(length,this.length), results = new Array(l);
			for (;i<l;i++) results[i] = this[i];
			return results;
		},
		"right": function right(length) {
			var i = Math.max(length,this.length), results = new Array(i);
			while (i--) results[i] = this[i];
			return results;
		},
		
		// examine
		"examine": function examine(callback,scope,arg1,arg2,argN) {
			var i = 0, l = this.length, results = new Array(l), args = SLICE.call(arguments,2);
			if (arguments.length < 2) scope = this;
			for (;i<l;i++) results[i] = callback.apply(scope,[this[i],i,this].concat(args));
			return results;
		},
		"invoke": function invoke(methodName,arg1,arg2,argN) {
			var i = 0, l = this.length, results = new Array(l), args = SLICE.call(arguments,1);
			for (;i<l;i++) results[i] = this[i][methodName].apply(this[i],args);
			return results;
		},
		"gather": function gather(propertyName) {
			var i = 0, l = this.length, result = new Array(l);
			for (;i<l;i++) result[i] = this[i][propertyName];
			return result;
		},
		"plant": function plant(propertyName,value) {
			var i = 0, l = this.length;
			for (;i<l;i++) this[i][propertyName] = value;
			return this;
		},
		"max": function max(callback,initialValue) { return this.reduce(callback instanceof Function ? callback : HELPER_MAX, initialValue) },
		"min": function min(callback,initialValue) { return this.reduce(callback instanceof Function ? callback : HELPER_MIN, initialValue) },
		"sum": function sum(initialValue) { return this.reduce(HELPER_SUM,initialValue) },
		
		// modifiers
		"duplicates": function duplicates() {
			var i = 0, j = 0, l = this.length, found = false, result = [];
			for (;i<l;i++) {
				for (j=i+1; j<l; j++) if (found = (this[i] === this[j])) break;
				if (found) result.push(this[i]);
			};
			return result;
		},
		"flatten": function flatten() {
			var i = 0, l = this.length, result = [];
			for (;i<l;i++) {
				if (!Array.isArray(this[i])) result.push(this[i]);
				else result.inject(this[i].flatten());
			};
			return result;
		},
		"order": function order(callback,scope) {
			if (arguments.length < 1) scope = this;
			return this.sort(callback.bind(scope));
		},
		"randomize": function randomize(scope) {
			if (arguments.length < 1) scope = this;
			return this.sort(Array.random.bind(scope));
		},
		"removeAt": function removeAt(index,number) {
			if (isNaN(number)) number = 1;
			this.splice(index,number);
			return this;
		},
		"replace": function replace(object,replacement) {
			var i = this.length;
			while (i--) if (this[i] === object) this[i] = replacement;
			return this;
		},
		"trim": function trim() {
			while (this.length && !this[this.length-1]) this.pop();
			while (this.length && !this[0]) this.shift();
			return this;
		},
		"unique": function unique() {
			var i = 0, j = 0, l = this.length, found = true, result = [];
			for (;i<l;i++) {
				for (j=i+1; j<l; j++) if (found = (this[i] === this[j])) break;
				if (!found) result.push(this[i]);
			};
			return result;
		}
	});
}).call(Pseudo);

/***********************
*** Date ***************
***********************/
(function(){
	var	SLICE = Array.prototype.slice,
		NATIVE = window.Date,
		INVALID = new Date("invalid"),
		INVALID_MESSAGE = "Invalid Date",
		FILTER_ISO = /^(\\d{4}|[\+\-]\\d{6})(?:-(\\d{2})(?:-(\\d{2})(?:T(\\d{2}):(\\d{2})(?::(\\d{2})(?:\\.(\\d{3}))?)?(?:Z|(?:([-+])(\\d{2}):(\\d{2})))?)?)?)?$/,
		FILTER_FORMAT = /\\.|y{1,4}|d{1,4}|M{1,4}|h{1,2}|H{1,2}|m{1,2}|s{1,2}|f{1,6}|t{1,3}|T{1,3}/gm,
		NAMES_DAY = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
		NAMES_MONTH = ["January","February","March","April","May","June","July","August","September","October","November","December"],
		MILLI_PER = {
			"yyyy":	365 * 24 * 3600 * 1000,
			"MM":	31 * 24 * 3600 * 1000,
			"ww":	7 * 24 * 3600 * 1000,
			"dd":	24 * 3600 * 1000,
			"hh":	3600 * 1000,
			"mm":	60 * 1000,
			"ss":	1000,
			"fff":	1
		},
		HELPER_COMPARE = [
			{ "type": "yyyy", "name": "years", "value": MILLI_PER.yyyy },
			{ "type": "MM",  "name": "months", "value": MILLI_PER.MM },
			{ "type": "ww",  "name": "weeks", "value": MILLI_PER.ww },
			{ "type": "dd",  "name": "days", "value": MILLI_PER.dd },
			{ "type": "hh",  "name": "hours", "value": MILLI_PER.hh },
			{ "type": "mm",  "name": "minutes", "value": MILLI_PER.mm },
			{ "type": "ss",  "name": "seconds", "value": MILLI_PER.ss },
			{ "type": "fff",  "name": "milliseconds", "value": MILLI_PER.fff }
		],
		HELPER_COMPARE_PREFIX = { "before": "", "after": "", "now": "" },
		HELPER_COMPARE_SUFFIX = { "before": "until", "after": "ago", "now": "now" },
		HELPER_FORMAT = function(piece) {
			if (!piece) return;
			if (piece.startsWith("\\")) return piece.substring(1);
			switch (piece) {
				case "yyyy":
				case "yyy":	return this.getFullYear();
				case "yy":
				case "y":		return this.getFullYear().toString().right(piece.length);
				case "MMMM":	return this.getMonthName();
				case "MMM":	return this.getMonthName().left(3);
				case "MM":
				case "M":		return (this.getMonth()+1).zeroPad(piece.length);
				case "dddd":	return this.getDayName();
				case "ddd":	return this.getDayName().left(3);
				case "dd":
				case "d":		return this.getDate().zeroPad(piece.length);
				case "ww":
				case "w":		return this.getWeek().zeroPad(piece.length);
				case "HH":
				case "H":		return this.getHours().zeroPad(piece.length);
				case "hh":
				case "h":		return this.getHoursBase12().zeroPad(piece.length);
				case "mm":
				case "m":		return this.getMinutes().zeroPad(piece.length);
				case "ssss":
				case "sss":
				case "ss":
				case "s":		return this.getSeconds().zeroPad(piece.length);
				case "ffffff":
				case "fffff":
				case "ffff":
				case "fff":
				case "ff":
				case "f":		return parseFloat("0."+ this.getMilliseconds()).zeroPad(0,piece.length).substring(2);
				case "TTTT":
				case "TTT":	return this.getHours() > 11 ? "P.M." : "A.M.";
				case "tttt":
				case "ttt":	return this.getHours() > 11 ? "p.m." : "a.m.";
				case "TT":	return this.getHours() > 11 ? "PM" : "AM";
				case "tt":	return this.getHours() > 11 ? "pm" : "am";
				case "T":		return this.getHours() > 11 ? "P" : "A";
				case "t":		return this.getHours() > 11 ? "p" : "a";
				default:		return piece;
			};
		};
	
	// compatibility methods
	function DateTime(year,month,date,hour,minute,second,fraction) {
		var args = SLICE.call(arguments,0), date = this;
		if (this instanceof NATIVE) {
			if (args.length === 1 && typeof year === "string") {
				return new NATIVE(Date.parse(Y));
			} else switch (args.length) {
				case 7: return new NATIVE(year,month,date,hour,minute,second,fraction);
				case 6: return new NATIVE(year,month,date,hour,minute,second);
				case 5: return new NATIVE(year,month,date,hour,minute);
				case 4: return new NATIVE(year,month,date,hour);
				case 3: return new NATIVE(year,month,date);
				case 2: return new NATIVE(year,month);
				case 1: return new NATIVE(year);
				case 0: return new NATIVE();
			};
		};
		return NATIVE.apply(this,SLICE.call(arguments,0));
	};
	function parse(string) {
		var matches = FILTER_ISO.exec(string);
		if (matches && matches.length) {
			var i = 1, minutes = 0, hours = 0, sign = "", offset = 0, year = 0;
			for (;i<7;i++) matches[i] = +(matches[i] || (i < 3 ? 1 : 0));
			matches[1]--;
			minutes = +matches.pop();
			hours = +matches.pop();
			sign = matches.pop();
			if (sign) {
				if (hours > 23 || minutes > 59) return INVALID;
				offset = (hours * 60 + minutes) * 6e4;
				if (sign === "+") offset *= -1;
			};
			year = +matches[0];
			if (year >= 0 && year <= 99) {
				matches[0] = year + 400;
				return NATIVE.UTC.apply(this,matches) + offset - 12622780800000;
			};
			return NATIVE.UTC.apply(this,matches) + offset;
		};
		return NATIVE.prototype.parse.apply(this,SLICE(arguments,0));
	};
	if (!Date.parse || Date.parse("+275760-09-13T00:00:00.000Z") !== 8.64e15) {
		DateTime.prototype = NATIVE.prototype;
		DateTime.prototype.constructor = NATIVE && NATIVE.constructor || NATIVE;
		window.Date = DateTime;
	};
	
	// extensions
	function today() {
		var date = new Date();
		date.setHours(0,0,0,0);
		return date;
	};
	
	this.expand(Date,this.Date = {
		"Days": NAMES_DAY,
		"Months": NAMES_MONTH,
		
		"Year":		"yyyy",
		"Month":		"MM",
		"Week":		"ww",
		"Day":		"dd",
		"Hour":		"hh",
		"Minute":		"mm",
		"Second":		"ss",
		"Millisecond":	"fff",
		
		// extensions
		"now": function now() { return new Date().getTime() },
		"today": today,
		"tomorrow": function tomorrow() {
			var date = today();
			date.setDate(date.getDate()+1);
			return date;
		},
		"yesterday": function yesterday() {
			var date = today();
			date.setDate(date.getDate()-1);
			return date;
		}
	});
	this.Date.Native = NATIVE;
	this.expand(NATIVE.prototype,this.Date.Prototypes = {
		// compatibility
		"parse": parse,
		"toISOString": function toISOString() {
			var result = "", year = this.getUTCFullYear(), absy = Math.abs(year).toString();
			if (year > 9999) result = "+";
			else if (year < 0) result = "-";
			return result + ("00000"+ absy).slice(absy.length === 4 ? -4 : -6) +"-"+
				(this.getUTCMonth()+1).zeroPad(2) +"-"+ this.getUTCDate().zeroPad(2) +"T"+
				this.getUTCHours().zeroPad(2) +":"+ this.getUTCMinutes().zeroPad(2) +":"+
				this.getUTCSeconds().zeroPad(2) +"."+ this.getUTCMilliseconds().zeroPad(0,3) +"Z";
		},
		"toJSON": function toJSON() { return this.toISOString() },
		
		// extensions
		"copy": function copy() { return new Date(this.valueOf()) },
		"context": function context(comparer,levels) {
			if (!(comparer instanceof Date) || isNaN(comparer.valueOf())) comparer = new Date();
			if (isNaN(levels)) levels = 2;
			
			var	i = 0, s = 0, value, criteria, next,
				descriptor = [],
				method = levels-s === 1 ? "round" : "floor",
				difference = this.valueOf() - comparer.valueOf(),
				before = difference < 0,
				absolute = Math.abs(difference);
			
			for (;criteria=HELPER_COMPARE[i];i++) {
				if (absolute >= criteria.value) {
					value = Math[method](absolute/criteria.value);
					descriptor.push({
						"value": before ? -value : value,
						"type": criteria.type,
						"name": criteria.name
					});
					absolute -= value * criteria.value;
					s++;
				};
				if (levels <= s || absolute < 1) break;
				else if (levels-s === 1) method = "round";
			};
			
			i = descriptor.length;
			while (i-- > 1) {
				criteria = descriptor[i];
				next = descriptor[i-1];
				if (criteria.value * MILLI_PER[criteria.type] === MILLI_PER[next.type]) {
					next.value++;
					descriptor.pop();
				} else { break };
			};
			return descriptor;
		},
		"contextString": function contextString(comparer,levels,suffix,prefix) {
			if (!prefix) prefix = HELPER_COMPARE_PREFIX;
			if (!suffix) suffix = HELPER_COMPARE_SUFFIX;
			var	array = this.context(comparer,levels),
				i = array.length,
				results = new Array(i),
				context = i === 0 ? "now" : array[0].value > 0 ? "after" : "before";
			while (i--) results[i] = Math.abs(array[i].value) +" "+ array[i].name;
			return (prefix[context] +" "+ results.join(", ") +" "+ suffix[context]).trim();
		},
		"getDayName": function getDayName() { return NAMES_DAY[this.getDay()] },
		"getMonthName": function getMonthName() { return NAMES_MONTH[this.getMonth()] },
		"toFormat": function toFormat(string,invalid) {
			if (isNaN(this.valueOf())) return arguments.length > 1 ? invalid : INVALID_MESSAGE;
			return String(string).separate(FILTER_FORMAT).map(HELPER_FORMAT,this).join("");
		},
		
		// comparers
		"diff": function diff(type,compare) {
			if (type === Date.Month || type === Date.Week) {
				var value = 0, comparer = compare.copy(), incrementer = this > compare ? 1 : -1;
				while (incrementer > 0 && this > comparer || incrementer < 0 && this < comparer) {
					comparer.add(type,incrementer);
					value++;
				};
				return value * -incrementer;
			} else {
				return Math.round((compare.valueOf() - this.valueOf()) / MILLI_PER[type]);
			};
		},
		"isAfter": function isAfter(compare) { return this.valueOf() > compare.valueOf() },
		"isBefore": function isBefore(compare) { return this.valueOf() < compare.valueOf() },
		"isSameDay": function isSameDay(compare) { return this.isSameMonth(compare) && this.getDate() === compare.getDate() },
		"isSameMonth": function isSameMonth(compare) { return this.isSameYear(compare) && this.getMonth() === compare.getMonth() },
		"isSameYear": function isSameYear(compare) { return this.getFullYear() === compare.getFullYear() },
		"isToday": function isToday() { return this.isSameDay(new Date()) },
			
		// value getters/setters
		"getFirstDay": function getFirstDay() {
			var day = new Date(this.valueOf());
			day.setDate(1);
			return day.getDay();
		},
		"getHoursBase12": function getHoursBase12() {
			var hours = this.getHours();
			return hours === 0 ? 12 : hours % 12;
		},
		"getLastDate": function getLastDate() {
			var last = new Date(this.valueOf());
			last.setDate(1);
			last.setMonth(1+last.getMonth());
			last.setDate(0);
			return last.getDate();
		},
		"getLastDay": function getLastDay() { return this.getLastDate().getDay() },
		"getWeek": function getWeek() {
			var copy = new Date(this.valueOf());
			copy.setMonth(0,0);
			return (copy.diff(Date.Day,this) / 7).ceil();
		},
		"add": function adder(type,value) {
			value = String(value).toNumber();
			if (!value) return this;
			switch (type) {
				case Date.Year:		this.setYear(this.getFullYear()+value);				break;
				case Date.Month:		this.setMonth(this.getMonth()+value);				break;
				case Date.Week:		this.setWeek(this.getWeek()+value);				break;
				case Date.Day:			this.setDate(this.getDate()+value);				break;
				case Date.Hour:		this.setHours(this.getHours()+value);				break;
				case Date.Minute:		this.setMinutes(this.getMinutes()+value);			break;
				case Date.Second:		this.setSeconds(this.getSeconds()+value);			break;
				case Date.Millisecond:	this.setMilliseconds(this.getMilliseconds()+value);	break;
			};
			return this;
		},
		"get": function getter(type) {
			switch (type) {
				case Date.Year:		return this.getYear();
				case Date.Month:		return this.getMonth();
				case Date.Week:		return this.getWeek();
				case Date.Day:			return this.getDate();
				case Date.Hour:		return this.getHours();
				case Date.Minute:		return this.getMinutes();
				case Date.Second:		return this.getSeconds();
				case Date.Millisecond:	return this.getMilliseconds();
			};
		},
		"set": function setter(type,value) {
			value = String(value).toNumber();
			if (!value) return this;
			switch (type) {
				case Date.Year:		this.setYear(value);		break;
				case Date.Month:		this.setMonth(value);		break;
				case Date.Week:		this.setWeek(value);		break;
				case Date.Day:			this.setDate(value);		break;
				case Date.Hour:		this.setHours(value);		break;
				case Date.Minute:		this.setMinutes(value);		break;
				case Date.Second:		this.setSeconds(value);		break;
				case Date.Millisecond:	this.setMilliseconds(value);	break;
			};
			return this;
		},
		"setWeek": function setWeek(value) {
			var copy = new Date(this.valueOf()), day;
			copy.setMonth(0,1);
			copy.setDate(value * 7);
			day = copy.getDay() - this.getDay();
			console.log(day);
			this.setMonth(copy.getMonth(),copy.getDate() + day);
			return this.valueOf();
		}
	});
}).call(Pseudo);

/***********************
*** Function ***********
***********************/
(function(){
	var	SLICE = Array.prototype.slice,
		FILTER_NAME = /^\s*function([^\(]+)\(/m,
		FILTER_ANONYMOUS = /^\s*function\s*\(/m,
		FILTER_ARGUMENTS = /\s*,\s*/i,
		FILTER_NATIVE = /^\s*function[^\{]*\{\s*\[native\scode\]\s*\}$/m;
	
	this.expand(Function,this.Function = {
		"isAnonymous": function isAnonymous(method) { return FILTER_ANONYMOUS.test(method.toString()) },
		"isNative": function isNative(method) { return FILTER_NATIVE.test(method.toString()) }
	});
	this.expand(Function.prototype,this.Function.Prototypes = {
		// compatibility
		"bind": function bind(scope,arg1,arg2,argN) {
			if (!arguments.length) return this;
			var	method = this,
				args = SLICE.call(arguments,1),
				bound = function() { return method.apply(scope,args.concat(SLICE.call(arguments,0))) };
		//	bound.name = "[bound]"+ method.name;
			return bound;
		},
		
		// extention
		"argumentNames": function argumentNames() {
			var method = this.toString();
			method = method.substring(method.indexOf("(")+1,method.indexOf(")")).trim();
			return method.length ? method.split(FILTER_ARGUMENTS) : [];
		},
		"methodName": function methodName() {
			var matches = this.toString().match(FILTER_NAME);
			return matches && matches.length > 1 ? matches[1].trim() : "";
		},
		"bundle": function bundle(arg1,arg2,argN) {
			var	method = this,
				args = SLICE.call(arguments,0),
				bundled = function() { return method.apply(this,args.concat(SLICE.call(arguments,0))) };
			bundled.name = "[bundled]"+ method.name;
			return bundled;
		},
		"delay": function delay(options,arg1,arg2,argN) {
			var method = this, args = SLICE.call(arguments,1), context = { "scope": window, "timeout": 16 };	// intel+ie limit: 15.6ms
			if (typeof options === "number") context.timeout = options;
			else if (options) Pseudo.extend(context,options);
			return window.setTimeout(function() { return method.apply(context.scope,args) },context.timeout);
		},
		"defer": window.setImmediate ? function immediate(scope,arg1,arg2,argN) {
			var method = this, args = SLICE.call(arguments,1);
			return window.setImmediate(function() { return method.apply(scope,args) });
		} : function defer(scope,arg1,arg2,argN) {
			return this.delay.apply(this,[{ "scope": scope }].inject(SLICE.call(arguments,1)));
		},
		"wrap": function wrap(scope) {
			var	method = this,
				wrapped = function() { return scope.apply(this,[method.bind(this)].concat(SLICE.call(arguments,0))) };
		//	wrapped.name = "[wrapped]"+ method.name;
			return wrapped;
		}
	});
}).call(Pseudo);

/***********************
*** Math ***************
***********************/
(function(){
	var	R2D = 180/Math.PI,
		G2R = Math.PI/200,
		D2R = Math.PI/180;
	
	this.expand(Math,this.Math = {
		"GradiansToRadians": G2R,
		"DegreesToRadians": D2R,
		"RadiansToDegrees": R2D,
		"roundTo": function roundTo(number,places) {
			if (!places) return Math.round(number);
			var x = Math.pow(10,places);
			return Math.round(number * x) / x;
		}
	});
}).call(Pseudo);

/***********************
*** Number *************
***********************/
(function(){
	var	EARTH = 6378137;	// in meters
	/*
	function hex() { return this.toString(16) };
	function colour() {
		var col = this.toString(16);
		if (col.length < 2) col = "0"+ col;
		return col;
	};
	*/
	this.expand(Number,this.Number = {
		"EquatorialRadius": EARTH
	})
	this.expand(Number.prototype,this.Number.Prototypes = {
		"toExponential": function toExponential() {},
		"toFixed": function toFixed() {},
		"toPrecision": function toPrecision() {},
		
		"round": function round(places) { return Math.roundTo(this,places) },
		"zeroPad": function zeroPad(length,decimals,radix) {
			var strings = this.toString(radix || 10).split(".");
			if (decimals && strings.length === 1) strings.push("0");
			if (strings[0].length < length) strings[0] = "0".repeat(length - strings[0].length) + strings[0];
			if (strings[1] && strings[1].length < decimals) strings[1] += "0".repeat(decimals - strings[1].length);
			return strings.join(".");
		}
	});
}).call(Pseudo);

/***********************
*** String *************
***********************/
(function(){
	var	SLICE = Array.prototype.slice,
		FILTER_DASHERIZE = /[A-Z]/g,
		FILTER_INTEGER = /^[\s$\(#%\-\[]*(-?[a-z0-9]+)/m,
		FILTER_NUMBER = /^[\s$\(#%\-\[]*(-?(?:\(*\d*\.)?[\d]+)/m,
		FILTER_TRIM_BOTH = /^\s+|\s+$/gm,
		FILTER_TRIM_LEFT = /^\s+/gm,
		FILTER_TRIM_RIGHT = /\s+$/gm;
	
	this.expand(String,this.String = {
		
	});
	this.expand(String.prototype,this.String.Prototypes = {
		// compatibility
		"concat": function concat(arg1,arg2,argN) { return this + SLICE.call(arguments,0).join("") },
		"slice": function slice(start,end) { return SLICE.call(this.split(""),start,end) },
		"substr": function substr(start,length) { return this.substring(start,start+length) },
		"trim": function trim() { return !this.length ? "" : this.replace(FILTER_TRIM_BOTH,"") },
		
		// extentions
		"contains": function contains(object) { return (object instanceof RegExp ? this.search(object) : this.indexOf(object)) > -1 },
		"count": function count(string) { return this.split(string).length - 1 },
		"reverse": function reverse() { return this.split("").reverse().join("") },
		"startsWith": function startsWith(object) { return (object instanceof RegExp ? this.search(object) : this.indexOf(object)) === 0 },
		"endsWith": function endsWith(object) {
			if (object instanceof RegExp) {
				if (object.source[object.source.length-1] !== "$") object = new RegExp("(?:"+ object.source +")$");
				return object.test(this);
			} else {
				var last = this.lastIndexOf(object);
				return last > -1 && last === this.length - object.toString().length;
			};
		},
		
		// modifiers
		"camelize": function camelize() {
			var sections = this.split("-"), camel = [sections[0]], i = 1, l = sections.length;
			for (;i<l;i++) if (sections[i]) camel.push(sections[i].capitalize());
			return camel.join("");
		},
		"capitalize": function capitalize() { return this.charAt(0).toUpperCase() + this.substring(1) },
		"dasherize": function dasherize() {
			var dashing = [], lastIndex = 0, matches;
			while (matches = FILTER_DASHERIZE.exec(this)) {
				dashing.push(this.substring(lastIndex,FILTER_DASHERIZE.lastIndex - matches[0].length));
				dashing.push("-");
				dashing.push(matches[0].toLowerCase());
				lastIndex = FILTER_DASHERIZE.lastIndex;
			};
		//	FILTER_DASHERIZE.reset();
			FILTER_DASHERIZE.lastIndex = 0;
			dashing.push(this.substring(lastIndex));
			return dashing.join("").toLowerCase();
		},
		"pad": function pad(string,right,left) { return this.padRight(string,right || 0).padLeft(string,left || 0) },
		"padLeft": function padLeft(string,width) { return string.repeat(width - this.length) + this },
		"padRight": function padRight(string,width) { return this + string.repeat(width - this.length) },
		"prune": function prune(object) { return !this.length ? "" : this.pruneRight(object).pruneLeft(object) },
		"pruneLeft": function pruneLeft(object) {
			var pruned = this;
			if (!pruned) return "";
			else if (arguments.length < 1) object = FILTER_TRIM_LEFT;
			if (object instanceof RegExp) {
				while (pruned.search(object) === 0) pruned = pruned.substring(pruned.match(object)[0].length,pruned.length);
			} else {
				var string = String(object);
				while (pruned.indexOf(object) === 0) pruned = pruned.substring(string.length,pruned.length);
			};
			return pruned;
		},
		"pruneRight": function pruneRight(object) {
			var pruned = this;
			if (!pruned) return "";
			else if (arguments.length < 1) object = FILTER_TRIM_RIGHT;
			if (object instanceof RegExp) {
				var match = (pruned.match(object) || []).last(), last = !match ? null : pruned.lastIndexOf(match);
				while (match && last === pruned.length-match.length) {
					pruned = pruned.substring(0,last);
					match = (pruned.match(object) || []).last();
					last = !match ? null : pruned.lastIndexOf(match);
				};
			} else {
				var string = String(object), last = pruned.lastIndexOf(object);
				while (last > -1 && last === pruned.length-string.length) {
					pruned = pruned.substring(0,last);
					last = pruned.lastIndexOf(string);
				};
			};
			return pruned;
		},
		"replaceAll": function replaceAll(find,replacement) {
			if (!find) return this.toString();
			if (!replacement) replacement = "";
			return this.split(find).join(replacement);
		},
		"truncate": function truncate(length,truncation,bothEnds) {
			if (isNaN(length)) length = this.length / 2;
			truncation = Object.isNothing(truncation) ? "&hellip;" : String(truncation);
			if (!bothEnds) return this.left(length) + truncation;
			else return this.left(Math.round(length/2)) + truncation + this.right(length-Math.round(length/2));
		},
		
		// comparison
		"isBlank": function isBlank() { return !/[^\s\n\r\f]/m.test(this) },
	//	"isLowerCase": function isUpperCase() { return this === this.toUpperCase() },
	//	"isUpperCase": function isLowerCase() { return this === this.toLowerCase() },
		
		// examiners
		"charArray": function charArray() {
			var i = 0, l = this.length, result = new Array(l);
			for (;i<l;i++) result[i] = this.charCodeAt(i);
			return result;
		},
		"left": function left(length) { return length < 0 ? this.slice(-length) : this.substring(0,length) },
		"right": function left(length) { return length < 0 ? this.substring(0,length+this.length) : this.slice(-length) },
		"repeat": function repeat(number) {
			var i = 0, self = new Array(number);
			for (;i<number;i++) self[i] = this;
			return self.join("");
		},
		"separate": function separate(search) {
			var results = [];
			if (search instanceof RegExp) {
				var	match,
					prevIndex = 0,
					compare = new RegExp(search.source,(!search.global ? "g" : "") + search.flags());
				while (match = compare.exec(this)) {
					if (compare.lastIndex - match[0].length > prevIndex) 
						results.push(this.substring(prevIndex,compare.lastIndex - match[0].length));
					results.push(match[0]);
					prevIndex = compare.lastIndex;
					if (!search.global) break;
				};
				if (this.length - prevIndex > 0) results.push(this.substring(prevIndex));
			} else {
				var splits = this.split(search), i = 0, l = splits.length;
				for (;i<l;i++) {
					results.push(splits[i])
					if (i+1<l) results.push(search);
				};
			};
			return results;
		},
		"toInteger": function toInteger(radix) {
			var parsed = Math.round(this.toNumber());
			if (!radix) return parsed;
			return parseInt(String(parsed),radix);
		},
		"toNumber": function toNumber() {
			var parsed = parseFloat(this);
			if (!isNaN(parsed)) return parsed;
			parsed = this.match(NUMBER_FILTER);
			return !parsed || !parsed[1] ? NaN : parseFloat(parsed[1]);
		}
	});
}).call(Pseudo);

/***********************
*** RegExp *************
***********************/
(function() {
	var	ESCAPE_FILTER = /([.*+?^=!:${}()|[\]\/\\])/g;
	
	this.expand(RegExp,this.RegExp = {
		"escape": function escape(source) { return String(source).replace(ESCAPE_FILTER, "\\$1") }
	});
	this.expand(RegExp.prototype,this.RegExp.Prototypes = {
		"copy": function copy() { return new RegExp(this.source,this.flags()) },
		"flags": function flags() {
			return [
				this.global ? "g" : "",
				this.ignoreCase ? "i" : "",
				this.multiline ? "m" : "",
				this.sticky ? "y" : ""	// firefox extension
			].join("");
		},
		"reset": function reset() {
		//	this.exec("");
			this.lastIndex = 0;
			return this;
		}
	});
}).call(Pseudo);

/***********************
*** Classing ***********
***********************/
(function(){
	var	SLICE = Array.prototype.slice,
		DOM_PROPS = (function(){
			var success = false, klass, instance;
			try {
				klass = function() {};
				Object.defineProperty(klass.prototype,"test",{ "value": "success" });
				instance = new klass();
				success = instance.test === "success";
				klass = instance = null;
			} catch(x) {
				success = false;
			};
			return success;
		})(),
		TRIGGER = document.addEventListener ? HANDLER_TRIGGER_DOM : HANDLER_TRIGGER_MSIE,
		REMOVE = document.addEventListener ? HANDLER_REMOVE_DOM : HANDLER_REMOVE_MSIE,
		FACTORY = {},
		PROTOTYPES = {},
		PROPERTIES = {};
	
	// events
	function PseudoEvent(scope,type,extras) {
		this.target = scope;
		this.type = type;
		this.stopped = this.fired = false;
		if (extras) Pseudo.expand(this,extras);
	};
	function Listener(target,type,handler) {
		this.target = target;
		this.active = false;
		this.__handlers = {};
		if (!!type) this.on(type,handler);
	};
	Listener.prototype = {
		"dispose": function dispose() {
			this.stop();
			this.__handlers = null;
		},
		"on": function on(type,handler) {
			if (typeof type === "object") {
				for (var each in type) this.on(each,type[each]);
			} else if (handler instanceof Array) {
				for (var i=0,l=handler.length; i<l; i++) this.on(type,handler[i]);
			} else if (handler instanceof Function) {
				if (!this.__handlers[type]) this.__handlers[type] = [];
				if (!this.__handlers[type].contains(handler)) {
					this.__handlers[type].push(handler);
					if (this.active) this.target.on(type,handler);
				};
			} else {
				throw new TypeError("handler not an instance of a Object, Array, or Function");
			};
		},
		"off": function off(type,handler) {
			if (!this.__handlers) {
				// do nothing I guess
			} else if (!arguments.length) {
				for (var each in this.__handlers) this.off(each);
			} else if (!handler) {
				if (this.__handlers[type] instanceof Array) this.off(type,this.__handlers[type].copy());
				else if (typeof type === "object") for (var each in type) this.off(each,type[each].copy());
			} else if (handler instanceof Array) {
				for (var i=0,l=handler.length; i<l; i++) this.off(type,handler[i]);
			} else if (handler instanceof Function) {
				this.__handlers[type].remove(handler);
				if (this.active) this.target.off(type,handler);
			} else {
				throw new TypeError("handler not an instance of a Object, Array, or Function");
			};
		},
		"start": function start() {
			if (this.active) return false;
			for (var type in this.__handlers) this.target.on(type,this.__handlers[type]);
			return this.active = true;
		},
		"stop": function stop() {
			if (!this.active) return false;
			for (var type in this.__handlers) this.target.off(type,this.__handlers[type]);
			return !(this.active = false);
		}
	};
	
	// events utility
	function HANDLER_FIND(pair) { return pair.handler === this };
	function HANDLER_WRAP(scope,handler) { return function wrapped(e) { return handler.call(scope,e.event) } };
	function HANDLER_TRIGGER_DOM(event,meta,handlers) {
		var i = 0, p, e = document.createEvent("Event");
		for (;p=handlers[i];i++) meta.addEventListener("dataavailable",p.wrapped,false);
		e.initEvent("dataavailable",false,true);
		e.event = event;
		meta.dispatchEvent(e);
		for (i=0;p=handlers[i];i++) meta.removeEventListener("dataavailable",p.wrapped,false);
	};
	function HANDLER_TRIGGER_MSIE(event,meta,handlers) {
		var i = handlers.length - 1, p, e = document.createEventObject();
		document.head.appendChild(meta);
		for (;p=handlers[i];i--) meta.attachEvent("ondataavailable",p.wrapped);
		e.event = event;
		meta.fireEvent("ondataavailable",e);
		for (;p=handlers[i];i++) meta.detachEvent("ondataavailable",p.wrapped);
		document.head.removeChild(meta);
	};
	function HANDLER_REMOVE_DOM(meta,wrapped) { meta.removeEventListener("dataavailable",wrapped,false) };
	function HANDLER_REMOVE_MSIE(meta,wrapped) { meta.detachEvent("ondataavailable",wrapped) };
	this.extend(PROTOTYPES,{
		"dispose": function dispose() {
			this.off();
			return this;
		},
		"fire": function fire(type,extras) {
			var event = new PseudoEvent(this,type,extras);
			if (this.__handlers && this.__handlers[type]) {
				if (!this.__machine) this.__machine = {};
				if (this.__machine[type]) throw new Error("Recursion");
				this.__machine[type] = document.createElement("meta");
				TRIGGER(event,this.__machine[type],this.__handlers[type]);
				event.fired = delete this.__machine[type];
			};
			return event;
		},
		"on": function on(type,handler) {
			if (typeof type === "object") {
				for (var each in type) this.on(each,type[each]);
			} else if (handler instanceof Array) {
				for (var i=0,l=handler.length; i<l; i++) this.on(type,handler[i]);
			} else if (handler instanceof Function) {
				if (!this.__handlers) this.__handlers = {};
				if (!this.__handlers[type]) this.__handlers[type] = [];
				if (!this.uses(type,handler)) this.__handlers[type].push({
					"handler": handler,
					"wrapped": HANDLER_WRAP(this,handler)
				});
			} else {
				throw new TypeError("handler not an instance of a Object, Array, or Function");
			};
			return this;
		},
		"off": function off(type,handler) {
			if (!this.__handlers) {
				// do nothing I guess
			} else if (!arguments.length) {
				for (var each in this.__handlers) this.off(each);
			} else if (!handler) {
				if (this.__handlers[type] instanceof Array) this.off(type,this.__handlers[type].gather("handler"));
				else if (typeof type === "object") for (var each in type) this.off(each,type[each]);
			} else if (handler instanceof Array) {
				for (var i=0,l=handler.length; i<l; i++) this.off(type,handler[i]);
			} else if (handler instanceof Function) {
				var	index = -1,
					handlers = this.__handlers && this.__handlers[type],
					machine = this.__machine && this.__machine[type];
				if (handlers) index = handlers.filterIndex(HANDLER_FIND,handler);
				if (index > -1) {
					if (machine) HANDLER_REMOVE(machine,handlers[index].wrapped);
					handlers.removeAt(index);
				};
				if (handlers.length < 1) delete this.__handlers[type];
			} else {
				throw new TypeError("handler not an instance of a Object, Array, or Function");
			};
			return this;
		},
		"uses": function uses(type,handler) {
			var i = 0, h, handlers = null;
			if (this.__handlers && (handlers=this.__handlers[type])) {
				for (;h=handlers[i];i++) if (h.handler === handler) return true;
			};
			return false;
		}
	});
	
	// properties
	this.extend(PROTOTYPES,{
		"getValue": DOM_PROPS ? function getValueNative(name) {
			return this[name];
		} : function getValueProto(name) {
			return !this["__get_"+ name] ? this[name] : this["__get_"+ name]();
		},
		"setValue": DOM_PROPS ? function setValueNative(name,value) {
			return this[name] = value;
		} : function setValueProto(name,value) {
			return this[name] = !this["__set_"+ name] ? value : this["__set_"+ name](value);
		},
		"setValues": function setValue(values) {
			for (var name in values) this.setValue(name,values[name]);
		}
	});
	
	// methods
	this.extend(FACTORY,{
		"addMethods": function(methods) {
			Pseudo.augment(this.prototype,methods);
			return this;
		},
		"addProperties": DOM_PROPS ? function addPropertiesNative(properties) {
			var name, props = {};
			for (name in properties) {
			//	props[name] = properties[name] instanceof Function ? properties[name]() : Object.clone(properties[name]);
				props[name] = Object.clone(properties[name]);
				if (!("enumerable" in props[name]) && name.startsWith("__")) props[name].enumerable = false;
			};
			Pseudo.define(this.prototype,props);
			return this;
		} : function addPropertiesProto(properties) {
			var name, props = {}, property;
			for (name in properties) {
				property = properties[name];
				if (typeof property["get"] === "function") props["__get_"+ name] = property["get"];
				if (typeof property["set"] === "function") props["__set_"+ name] = property["set"];
				if ("value" in property) props[name] = property["value"];
			};
			Pseudo.augment(this.prototype,props);
			return this;
		}
	});
	
	// classing
	function createKlass($super) {
		function Klass() {
		//	this.__trace = true;
			this.__pseudo = Pseudo.unique();
			if (DOM_PROPS) Object.defineProperty(this,"__pseudo",{ "enumerable": false })
			this.__constructor.apply(this,SLICE.call(arguments,0));
		};
		if ($super) {
			var Quasi = function() {};
			Quasi.prototype = $super && $super.prototype;
			Klass.prototype = new Quasi();
			if (!DOM_PROPS && $super.__properties) Klass.__properties = Object.clone($super.__properties);
		};
		if (!Klass.prototype.__constructor) Klass.prototype.__constructor = Pseudo.um;
		return Klass.prototype.constructor = Klass;
	};
	function create($super,properties,methods,factory,aliases) {
		var Klass = Pseudo.expand(createKlass($super),FACTORY);
		if (!$super) {
			Klass.addProperties(PROPERTIES);
			Klass.addMethods(PROTOTYPES);
		};
		if (properties) Klass.addProperties(properties);
		if (methods) Klass.addMethods(methods);
		if (factory) Pseudo.extend(Klass,factory);
		if (aliases) Klass.aliasMethods(aliases);
		return Klass;
	};
	
	this.Class = {
		"Event": PseudoEvent,
		"Listener": Listener,
		
		"Factory": FACTORY,
		"Prototypes": PROTOTYPES,
		"Properties": PROPERTIES,
		
		"create": create,
		"klass": createKlass,
		"listen": function listen(target,type,handler,justOnce,notAuto) {
			var listener = new Listener(target,type,handler);
			if (!!justOnce) {
				var each, onetime = listener.dispose.bind(listener);
				for (each in listener.__handlers) listener.__handlers[each].push(onetime);
			};
			if (!notAuto) listener.start();
			return listener;
		},
		"singleton": function singleton($super,properties,methods,factory,aliases) {
			return Pseudo.extend(new create($super,properties,methods,factory,aliases)(),factory || {});
		}
	};
}).call(Pseudo);

/***********************
*** DOM ****************
***********************/
(function(){
	var	WIN = Object.getPrototypeOf(window),
		DOC = Object.getPrototypeOf(document),
		ELEM = (window.HTMLElement || window.Element).prototype,
		FRAG = Object.getPrototypeOf(document.createDocumentFragment()),
		DESC = { "enumerable": !!this.Browser.IE8, "configurable": true },
		CUSTOM_EVENTS = {},
		CUSTOM_PROPERTIES = {};
	if (WIN === Object.prototype) WIN = window;	// opera
	if (DOC === Object.prototype) DOC = document;
	
	function findPrefixedSelector(name) {
		if (ELEM[name]) return name;
		var base = name.capitalize(), prefix = ["moz","webkit","ms","o"], i = 0, l = prefix.length;
		for (;i<l&&(name=prefix[i]+base);i++) if (ELEM[name]) return name;
	};
	function getNodeProto(nodeName) {
		var proto = null;
		if (!nodeName || nodeName === "*") proto = ELEM;
		else if (nodeName === "#document") proto = DOC;
		else if (nodeName === "#window") proto = WIN;
		else proto = Object.getPrototypeOf(document.createElement(nodeName));
		return proto;
	};
	this.DOM = {
		"CUSTOM_EVENTS": CUSTOM_EVENTS,
		"CUSTOM_PROPERTIES": CUSTOM_PROPERTIES,
		"Document": window.HTMLDocument || window.Document || DOC.constructor,
		"Element": window.HTMLElement || window.Element || ELEM.constructor,
		"Fragment": window.DocumentFragment || FRAG.constructor,
		"Window": window.DOMWindow || window.Window || WIN.constructor,
		"querySelector": findPrefixedSelector("querySelector") || "",
		"querySelectorAll": findPrefixedSelector("querySelectorAll") || "",
		"matchesSelector": findPrefixedSelector("matchesSelector") || "",
		
		// methods
		"addEventType": function addEventType(nodeName,type) {
			if (!nodeName) nodeName = "*";
			else nodeName = nodeName.toLowerCase();
			if (!CUSTOM_EVENTS[nodeName]) CUSTOM_EVENTS[nodeName] = [type];
			else CUSTOM_EVENTS[nodeName].push(type);
			return CUSTOM_EVENTS[nodeName];
		},
		"addMethods": function addMethods(nodeName,methods) {
			if (typeof nodeName === "string" && nodeName.contains(",")) {
				var nodeNames = nodeName.split(","), i = 0, l = nodeNames.length, protos = new Array(l);
				for (;i<l;i++) protos[i] = addMethods(nodeNames[i],methods);
				return protos;
			} else {
				return [Pseudo.augment(getNodeProto(nodeName),methods)];
			};
		},
		"addProperties": function addProperties(nodeName,properties) {
			if (typeof nodeName === "string" && nodeName.contains(",")) {
				var nodeNames = nodeName.split(","), i = 0, l = nodeNames.length, protos = new Array(l);
				for (;i<l;i++) protos[i] = addProperties(nodeNames[i],properties);
				return protos;
			} else {
				if (!nodeName) nodeName = "*";
				else nodeName = nodeName.toLowerCase();
				if (!CUSTOM_PROPERTIES[nodeName]) CUSTOM_PROPERTIES[nodeName] = [];
				var proto = getNodeProto(nodeName);
				Object.each(properties,function(value,name) {
					Pseudo.tryThese(
						function() { Object.defineProperty(proto,name,Pseudo.expand(value,DESC)) },
						function() { value.enumerable = false; Object.defineProperty(proto,name,value) },
						function() { proto.__defineGetter__(name,value["get"]) }
					);
					CUSTOM_PROPERTIES[nodeName].push(name);
				});
				return [proto];
			};
		}
	};
}).call(Pseudo);
(function(){	// HTML5 shim stuff
	var	DIV = document.createElement("div"),
		GETTERS = {
			"classList": { "get": function() { return new DOMTokenList(this) } },
			"firstElementChild": { "get": function() { return nextElement(this.firstChild) } },
			"nextElementSibling": { "get": function() { return nextElement(this.nextSibling) } },
			"previousElementSibling": { "get": function() { return previousElement(this.previousSibling) } },
			"lastElementChild": { "get": function() { return previousElement(this.lastChild) } }
		};
	
	// Element|classList
	function DOMTokenList(element) {
		var classes = element.className.trim();
		this.__element = element;
		if (classes.length > 0) {
			var names = classes.split(/\s/gm), i = 0, l = names.length;
			this.length = l;
			for (; i<l; i++) this[i] = names[i];
		};
	};
	DOMTokenList.prototype = Pseudo.augment([],{
		"add": function add(className) {
			if (!this.contains(className)) this.push(className);
			this.__element.className = this.join(" ");
		},
		"item": function item(index) { return this[index] || null },
		"remove": function remove($super,className) {
			$super.call(this,className);
			this.__element.className = this.join(" ");
		},
		"toggle": function toggle(className) {
			this[this.contains(className) ? "remove" : "push"](className);
			this.__element.className = this.join(" ");
		},
		"toString": function toString() { return this.join(" ") }
	});
	
	// Element|*ElementChild/*ElementSibling
	function nextElement(element) {
		while (element && element.nodeType !== 1) element = element.nextSibling;
		return element || null;
	};
	function previousElement(element) {
		while (element && element.nodeType !== 1) element = element.previousSibling;
		return element || null;
	};
	
	// check if available and add if not
	Object.pairs(GETTERS).each(function(pair) { if (pair.name in DIV) delete GETTERS[pair.name] });
	Pseudo.DOM.addProperties("*",GETTERS);
	DIV = null;
}).call(Pseudo.DOM);
(function(){	// DOM event extension and DOM/Class event listener
	var	FIX_EVENT = ["load","error","click"],
		FIX_CLICK_WHICH = { "1": "left", "3": "right", "2": "middle" },
		FIX_CLICK_BUTTON = { "0": "left", "2": "right", "4": "middle" },
		KEY_CODES = {
			"BACK": 8, "BACKSPACE": 8, "TAB": 9, "ENTER": 13, "SHIFT": 16, "CTRL": 17, "ALT": 18, "PAUSE": 19,
			"BREAK": 19, "ESCAPE": 27, "PAGEUP": 33, "PAGEDOWN": 34, "END": 35, "HOME": 36, "LEFT": 37,
			"UP": 38, "RIGHT": 39, "DOWN": 40, "INSERT": 45, "DELETE": 46,
			// not standard
			"LEFT_WINDOWS": 91, "RIGHT_WINDOWS": 92, "CONTEXT": 93, "NUMLOCK": 144, "SCROLLLOCK": 145
		};
	
	this.expand(Event,this.Event = {
		"Keys": KEY_CODES
	});
	this.expand(Event.prototype,this.Event.Prototypes = {
		"cancel": Event.prototype.stopPropagation || function cancel() { this.cancelBubble = true },
		"prevent": Event.prototype.preventDefault || function prevent() { this.returnValue = false },
		"stop": function stop() {
			this.cancel();
			this.prevent();
		},
		"element": function element() {
			var target = this.target || this.srcElement, current = this.currentTarget;
			if (current && current.nodeName === "INPUT" && current.type === "radio" && FIX_EVENT.contains(this.type)) target = current;
			return target;
		},
		"click": function click() {
			var button = FIX_CLICK_WHICH[this.which] || FIX_CLICK_BUTTON[this.button];
			if (button === "left") {
				if (this.type === "contextmenu") button = "right";
				else if (this.metaKey === true) button = "middle";
			};
			return button || "";
		},
		"pointer": function pointer() {
			return {
				"x": this.pageX || this.clientX + document.body.scrollLeft - (document.body.clientLeft || 0),
				"y": this.pageY || this.clientY + document.body.scrollTop - (document.body.clientTop || 0)
			};
		}
	});
}).call(Pseudo);
Pseudo.DOM.addMethods("*,#document,#window",(function(){	// DOM event helpers
	var	CUSTOM = this.CUSTOM_EVENTS,
		W3C = document.addEventListener ? true : false,
		EVENT_ON = W3C ? W3C_ON : MSIE_ON,
		EVENT_OFF = W3C ? W3C_OFF : MSIE_OFF;
	
	// Listener
	this.listen = Pseudo.Class.listen;
	this.Listener = Pseudo.Class.Listener;
	
	// events
	function HANDLER_FIND(pair) { return pair.handler === this.handler && pair.capture === this.capture };
	function HANDLER_WRAP(element,type,handler) {
		return function wrapped(e) {
			if (!e) e = window.event;
			if (!!e.__type && e.__type !== type) return;
			else if (!e.target !== element) e.target = element;
			return handler.call(element,e);
		};
	};
	function W3C_ON(element,type,handler,capture) {
		var pair = { "handler": handler, "capture": capture };
		element.__handlers[type].push(pair);
		element.addEventListener(type,pair.handler,pair.capture);
	};
	function W3C_OFF(element,type,handler,capture) {
		var	pair = { "handler": handler, "capture": capture },
			index = element.__handlers[type].filterIndex(HANDLER_FIND,pair);
		element.__handlers[type].removeAt(index);
		element.removeEventListener(type,pair.handler,pair.capture);
	};
	function MSIE_ON(element,type,handler) {
		var	name = element.nodeName.toLowerCase(),
			handlers = element.__handlers[type], i = 0, l = handlers.length,
			pair = { "handler": handler, "capture": false, "wrapped": HANDLER_WRAP(element,type,handler) };
		if (CUSTOM[name] && CUSTOM[name].contains(type)) type = "dataavailable";
		for (;i<l;i++) element.detachEvent("on"+ type,handlers[i].wrapped);
		handlers.push(pair);
		for (;i>-1;i--) element.attachEvent("on"+ type,handlers[i].wrapped);
	};
	function MSIE_OFF(element,type,handler) {
		var	name = element.nodeName.toLowerCase(),
			handlers = element.__handlers[type],
			pair = { "handler": handler, "capture": false },
			index = handlers.filterIndex(HANDLER_FIND,pair);
		if (CUSTOM[name] && CUSTOM[name].contains(type)) type = "dataavailable";
		pair = handlers[index];
		handlers.removeAt(index);
		element.detachEvent("on"+ type,pair.wrapped);
	};
	
	return {
		"on": function on(type,handler,capture) {
			if (typeof type === "object") {
				for (var each in type) this.on(each,type[each],capture);
			} else if (handler instanceof Array) {
				for (var i=0,l=handler.length; i<l; i++) this.on(type,handler[i],capture);
			} else if (handler instanceof Function) {
				if (!this.__handlers) this.__handlers = {};
				if (!this.__handlers[type]) this.__handlers[type] = [];
				EVENT_ON(this,type,handler,!!capture);
			} else {
				throw new TypeError();
			};
			return this;
		},
		"off": function off(type,handler,capture) {
			if (!this.__handlers) {
				// do nothing I guess
			} else if (!arguments.length) {
				for (type in this.__handlers) this.off(type);
			} else if (!handler) {
				if (this.__handlers[type] instanceof Array) this.off(type,this.__handlers[type].copy(),capture);
				else if (typeof type === "object") for (var each in type) this.off(each,type[each],capture);
			} else if (handler instanceof Array) {
				for (var i=0,l=handler.length; i<l; i++) this.off(type,handler[i].handler || handler[i],typeof capture === "boolean" ? capture : handler[i].capture);
			} else if (handler instanceof Function) {
				EVENT_OFF(this,type,handler,!!capture);
			} else {
				throw new TypeError();
			};
			return this;
		},
		"fire": W3C ? function fireDom(type,bubbles,cancelable) {
			var e = document.createEvent("Event");
			e.initEvent(type,!!bubbles,!!cancelable);
			this.dispatchEvent(e);
			return e;
		} : function fireMsie(type,bubbles) {
			var e = document.createEventObject(), name = this.nodeName.toLowerCase();
			e.__type = type;
			e.bubbles = !!bubbles;
			this.fireEvent(CUSTOM[name] && CUSTOM[name].contains(type) ? "ondataavailable" : type,e);
			return e;
		},
		"uses": function uses(type,handler,capture) {
			return this.__handlers[type].filterIndex(HANDLER_FIND,{
				"handler": handler,
				"capture": !!capture && W3C
			}) > -1;
		}
	};
}).call(Pseudo.DOM));
Pseudo.DOM.addMethods("*",(function(){	// helpers for walking the DOM tree
	var	SLICE = Array.prototype.slice,
		ELEM = this.Element,
		QUERY = this.querySelectorAll,
		MATCH = this.matchesSelector,
		SELECTORS = function(args) {
			var selectors = SLICE.call(args,0).invoke("trim").join(",");
			if (selectors.indexOf(",,") > -1) throw new Error("Blank selector is invalid");
			return selectors || "*";
		};
	return {
		"contains": document.compareDocumentPosition ? function containsCompare(element) {
			return !!(this.compareDocumentPosition(element) & 16);
		} : function containsQueryAll(element) {
			return this.query(element.nodeName).contains(element);
		},
		"descendantOf": function descendantOf(element) { return element.contains(this) },
		"matches": MATCH ? function matchesSelector(selector1,selector2,selectorN) {
			return this[MATCH](SELECTORS(arguments));
		} : function matchesQueryAll(selector1,selector2,selectorN) {
			return this.root().query(SELECTORS(arguments)).contains(this);
		},
		"query": function query(selector1,selector2,selectorN) {
			var selectors = SLICE.call(arguments,0).flatten().join(",");
			return Array.from(this[QUERY](selectors));
		},
		"root": function root() {
			var parent = this;
			while (parent.parentNode instanceof ELEM) parent = parent.parentNode;
			return parent || this;
		},
		"up": MATCH ? function upMatches(selector1,selector2,selectorN) {
			var elem = this.parentNode, selectors = SELECTORS(arguments);
			while (elem instanceof ELEM) if (!elem[MATCH](selectors)) elem = elem.parentNode;
			return elem || undefined;
		} : function upQueryAll(selector1,selector2,selectorN) {
			var elem = this.parentNode, selectors = SELECTORS(arguments), parents;
			if (selectors === "*") parents = [elem];
			else parents = this.root().query(selectors);
			while (element instanceof ELEM) {
				if (parents.contains(element)) break;
				else element = element.parentNode;
			};
			return element || undefined;
		}
	};
}).call(Pseudo.DOM));
Pseudo.DOM.addMethods("*",(function(){	// child and attribute helpers
	var	NOTBLANK = /[^\s]+/m,
		SLICE = Array.prototype.slice,
		ELEM = this.Element,
		FRAG = this.Fragment,
		READERS = this.HELPERS_READ_ATTRIBUTE = {
			"for": function() { return this.htmlFor },
			"class": function() { return this.className }
		},
		WRITERS = this.HELPERS_WRITE_ATTRIBUTE = {
			"for": function(value) { this.htmlFor = value },
			"class": function(value) { this.className = value },
			"innerHTML": function(value) { this.update(value) }
		},
		CLASS_ADDER = function(className) { if (!this.contains(className)) this.push(className) },
		CLASS_REMOVER = function(className) { this.remove(className) },
		INNERHTML = this.HELPERS_INNERHTML = Pseudo.extend((function(){
			var isBuggy = true, element = document.createElement("tr");
			element.innerHTML = "<td>test</td>";
			isBuggy = element.getElementsByTagName("td").length !== 1;
			if (!isBuggy) {
				element = document.createElement("table");
				try {
					element.innerHTML = "<tr><td>test</td></tr>";
					isBuggy = Object.isNothing(element.tBodies[0]);
				} catch (e) {
					isBuggy = true;
				};
			};
			element = null;
			return !isBuggy ? {} : {
				"table":	["<table>","</table>"],
				"caption":["<table><caption>","</caption><tbody></tbody></table>"],
				"thead":	["<table><thead>","</thead><tbody></tbody></table>"],
				"tfoot":	["<table><tfoot>","</tfoot><tbody></tbody></table>"],
				"tbody":	["<table><tbody>","</tbody></table>"],
				"tr":	["<table><tbody><tr>","</tr></tbody></table>"],
				"th":	["<table><tbody><tr><th>","</th></tr></tbody></table>"],
				"td":	["<table><tbody><tr><td>","</td></tr></tbody></table>"]
			};
		})(),(function(){
			var isBuggy = true, element = document.createElement("select");
			element.innerHTML = "<option value=\"test\">test</option>";
			try { isBuggy = element.options[0].nodeName.toLowerCase() !== "option" } catch(x) {};
			element = null;
			return !isBuggy ? {} : {
				"select":	["<select>","</select>"]
			};
		})());
	return {
		// html
		"amputate": function amputate() { return this.parentNode.removeChild(this) },
		"append": function append(value) {
			if (value instanceof ELEM || FRAG && value instanceof FRAG) {
				this.appendChild(value);
			} else if (value instanceof Array) {
				for (var i=0,l=value.length; i<l; i++) this.append(value[i]);
			} else {
				var	name = this.nodeName.toLowerCase(),
					helper = INNERHTML[name],
					container,
					nodes,
					i = 0, l;
				if (helper) {
					container = document.createElement("div");
					container.innerHTML = helper[0] + value + helper[1];
					nodes = Array.from(container.getElementsByTagName(name)[0].childNodes);
				} else {
					container = document.createElement(name);
					container.innerHTML = value;
					nodes = Array.from(container.childNodes);
				};
				container.clear();
				for (l=nodes.length; i<l; i++) this.appendChild(nodes[i]);
				container = null;
			};
			return this;
		},
		"clean": function clean(deep) {
			var i = this.childNodes.length, kid, type;
			while (i--) {
				kid = this.childNodes[i];
				if (kid.nodeType === 3 && !NOTBLANK.test(kid.textContent)) this.removeChild(kid);
				else if (deep && kid.nodeType === 1) kid.clean(true);
			};
		},
		"clear": function clear() { while(this.lastChild) this.removeChild(this.lastChild) },
		"copy": function copy(deep) {
			var element = this.cloneNode(false);
			element.__pseudo = Pseudo.unique();
			if (deep) element.append(this.innerHTML);
			return element;
		},
		"insertAfter": function insertAfter(parent,element) { return this.insertBefore(parent,element && element.nextSibling || null) },
		"supplant": function supplant(element) { this.parentNode.replaceChild(this,element) },
		"transplant": function transplant(parent,before) { return parent.insertBefore(this.amputate(),before || null) },
		"update": function update(value) {
			this.clear();
			this.append(value);
		},
		
		// attributes
		"coords": function coords(ancestor) {
			var	element = this, parent = element,
				xyTop = 0, xyLeft = 0, scTop = 0, scLeft = 0,
				w = element.offsetWidth, h = element.offsetHeight;
			if (!(ancestor instanceof ELEM)) ancestor = document.documentElement;
			while (element instanceof ELEM) {
				xyTop += element.offsetTop || 0;
				xyLeft += element.offsetLeft || 0;
				parent = element;
				while (parent instanceof ELEM && parent !== ancestor && parent !== element.offsetParent) {
					parent = parent.parentNode;
					scTop += parent.scrollTop || 0;
					scLeft += parent.scrollLeft || 0;
				};
				element = parent;
				if (element === ancestor) break;
			};
			return {
				"top": xyTop, "left": xyLeft, "width": w, "height": h,
				"scrollTop": scTop, "scrollLeft": scLeft
			};
		},
		"isHidden": function isHidden() { return this.getStyle("display") === "none" },
		"read": function read(name) { return READERS[name] ? READERS[name].call(this) : this.getAttribute(name) },
		"write": function write(name,value) { return WRITERS[name] ? WRITERS[name].call(this,value) : this.setAttribute(name,value) },
		
		// style
		"hide": function hide() { this.style.display = "none" },
		"show": function show() { this.style.display = "" },
		"hasClass": function hasClass(className) { return this.className.split(/\s+/gm).contains(className) },
		"addClass": function addClass(className1,className2,classNameN) {
			var classNames = !this.className ? [] : this.className.trim().split(/\s+/gm);
			SLICE.call(arguments,0).flatten().each(CLASS_ADDER,classNames);
			this.className = classNames.join(" ");
		},
		"removeClass": function removeClass(className1,className2,classNameN) {
			var classNames = !this.className ? [] : this.className.trim().split(/\s+/gm);
			SLICE.call(arguments,0).flatten().each(CLASS_REMOVER,classNames);
			this.className = classNames.join(" ");
		},
		
		// clean-up
		"dispose": function dispose() {
			this.off();
			for (var prop in this) {
				if (prop === "__pseudo") continue;
				else if (prop.startsWith("__")) delete this[prop];
			};
		}
	};
}).call(Pseudo.DOM));
Pseudo.DOM.addMethods("*",(function(){	// CSS helpers
	var	DIV = document.createElement("div"),
		FILTER_STYLES = /\s*;\s*/gim,
		GETSTYLE = window.getComputedStyle ? GETSTYLE_COMPUTED : GETSTYLE_CURRENT,
		READERS = this.HELPERS_READ_STYLE = {},
		WRITERS = this.HELPERS_WRITER_STYLE = {};
	
	function GETSTYLE_COMPUTED(element,propertyName) {
		var style = window.getComputedStyle(element,null);
		return !style ? "" : style.getPropertyValue(propertyName) || "";
	};
	function GETSTYLE_CURRENT(element,propertyName) {
		var style = element.currentStyle;
		return !style ? "" : style[propertyName.camelize()] || "";
	};
	function STYLES_OBJECT(cssText) {
		var styles = {};
		cssText.split(FILTER_STYLES).each(function(pair) {
			var	key = pair.substring(0,pair.indexOf(":")).trim(),
				value = pair.substring(key.length+1).trim();
			if (key) styles[key] = value;
		});
		return styles;
	};
	
	if (Pseudo.Browser.IE8) (function(){
		var	FILTER_TRANSFORMS = /\b[a-z]+\([^\)]+\)/gi,
			FILTER_FILTERS = /\s*progid\:DXImageTransform\.Microsoft\./gim,
			FILTER_FILTERS_PARAMS = /[^=\(,]+=[^,\)]+/gim,
			
			MATRIX_MULTIPLY = function(orig,mod) {
				var i = 0, j, k, result = [[0,0,0],[0,0,0],[0,0,0]];
				for (; i<3; i++) for (j=0; j<3; j++) for (k=0; k<3; k++) result[i][j] += orig[i][k] * mod[k][j];
				return result;
			},
			VALUE_RADIANS = function(n) {
				var r = 0;
				if (n.indexOf("deg") > -1) r = parseFloat(n) * Math.DegreesToRadians;
				else if (n.indexOf("grad") > -1) r = parseFloat(n) * Math.GradiansToRadians;
				else if (n.indexOf("turn") > -1) r = (parseFloat(n) * 360) * Math.DegreesToRadians;
				else r = parseFloat(n);
				return r || 0;
			},
			VALUE_COORD = function(value,size) {
				if (value === "left" || value === "top") return 0;
				else if (value === "center") return size / 2;
				else if (value === "right" || value === "bottom") return size;
				else if (value.contains("%")) return size * (parseFloat(value) / 100);
				else return !isNaN(value=parseFloat(value)) ? value : size / 2;
			},
			ORDERED_TRANSFORMS = ["matrix","translate","translateX","translateY","scale","scaleX","scaleY","rotate","skew","skewX","skewY"],
			GET_FILTER = function(filter) { return filter.substring(0,this.length) === this.toString() },
			GET_FILTER_VALUES = function(element,name) {
				var	filter = GETSTYLE(element,"filter").split(FILTER_FILTERS).filterFirst(GET_FILTER,name),
					args = filter && filter.match(FILTER_FILTERS_PARAMS) || [],
					i = 0,
					l = args.length,
					arg = [],
					parms = {};
				if (filter) for (; i<l; i++) {
					arg = args[i].toLowerCase().split("=");
					parms[arg[0]] = arg.slice(1).join("");
				};
				return parms;
			};
		
		READERS["opacity"] = function(element) {
			var filter = GET_FILTER_VALUES(element,"Alpha"), value = "";
			if (!("enabled" in filter) || filter.enabled === "true") value = filter.opacity || "100";
			return (parseFloat(value) / 100).toString();
		};
		WRITERS["opacity"] = function(element,value) {
			var	filters = element.style.filter.split(FILTER_FILTERS),
				alpha = filters.filterFirst(GET_FILTER,"Alpha"),
				percent = Math.round(parseFloat(value) * 100);
			if (alpha) filters.remove(alpha);
			if (percent < 0) percent = 0;
			else if (isNaN(percent) || percent > 100) percent = 100;
			filters.push(alpha = "progid:DXImageTransform.Microsoft.Alpha(opacity="+ percent +",enabled="+ (percent === 100 ? "false" : "true") +",style=0)");
			element.style.filter = filters.join(" ");
			return { "filter": alpha };
		};
		
	//	http://lists.w3.org/Archives/Public/www-style/2010Jun/0602.html
		READERS["transform"] = function(element) {
			var filter = GET_FILTER_VALUES(element,"Matrix"), css = "none";
			if (!("enabled" in filter) || filter.enabled === "true") {
				var	a = parseFloat(filter.m11) || 0, c = parseFloat(filter.m12) || 0, e = parseFloat(filter.dx) || 0,
					b = parseFloat(filter.m21) || 0, d = parseFloat(filter.m22) || 0, f = parseFloat(filter.dy) || 0;
				if ((a * d) - (b * c) === 0) {
					css = "matrix("+ a +","+ b +","+ c +","+ d +","+ e +","+ f +")";
				} else {
					var scaleX, scaleY, shear, negate, rotate;
					scaleX = Math.sqrt((a*a) + (b*b));
					a /= scaleX;
					b /= scaleX;
					shear = (a*c) + (b*d);
					c -= a * shear;
					d -= b * shear;
					scaleY = Math.sqrt((c*c) + (d*d));
					c /= scaleY;
					d /= scaleY;
					shear /= scaleY;
					negate = (a * d) - (b * c);
					scaleY *= negate;
					shear *= negate;
					rotate = Math.atan2(b,a);
					
					scaleX = Math.roundTo(scaleX,3);
					scaleY = Math.roundTo(scaleY,3);
					shear = Math.roundTo(shear * Math.RadiansToDegrees,3);
					rotate = Math.roundTo(rotate * Math.RadiansToDegrees,3);
					
					css = "";
					if (e !== 0 && f !== 0) css += "translate("+ e +"px,"+ f +"px) ";
					else if (e !== 0) css += "translate("+ e +"px) ";
					else if (f !== 0) css += "translateY("+ f +"px) ";
					if (scaleX !== 1 && scaleY !== 1) css += "scale("+ scaleX +"px,"+ scaleY +"px) ";
					else if (scaleX !== 1) css += "scaleX("+ scaleX +"px) ";
					else if (scaleY !== 1) css += "scaleY("+ scaleY +"px) ";
					if (shear !== 0) css += "skewX("+ shear +"deg) ";
					if (rotate !== 0) css += "rotate("+ rotate +"deg) ";
				};
			};
			return css.trim();
		};
		WRITERS["transform"] = function(element,value) {
			var	filters = element.style.filter.split(FILTER_FILTERS),
				matrix = filters.filterFirst(GET_FILTER,"Matrix"),
				matches = value.match(FILTER_TRANSFORMS),
				transform, values = [],
				j = 0, c = matches ? matches.length : 0,
				i = 0, l = ORDERED_TRANSFORMS.length,
				result = [[1,0,0],[0,1,0],[0,0,1]],
				results = {};
			if (matrix) filters.remove(matrix);
			if (c) for (; i<l; i++) {
				values = [];
				transform = ORDERED_TRANSFORMS[i];
				for (j=0; j<c; j++) if (matches[j].indexOf(transform +"(") === 0) {
					values = matches[j].substring(matches[j].indexOf("(")+1,matches[j].indexOf(")")).split(/\s*,\s*/);
					break;
				};
				if (!values.length) { /* nope */ }
				else if (transform === "matrix") result = MATRIX_MULTIPLY(result,[[parseFloat(values[0]) || 1,parseFloat(values[2]) || 0,parseFloat(values[4]) || 0],[parseFloat(values[1]) || 0,parseFloat(values[3]) || 1,parseFloat(values[5]) || 0],[0,0,1]]);
				else if (transform === "translate") result = MATRIX_MULTIPLY(result,[[1,0,parseFloat(values[0]) || 0],[0,1,parseFloat(values[1]) || parseFloat(values[0]) || 0],[0,0,1]]);
				else if (transform === "translateX") result = MATRIX_MULTIPLY(result,[[1,0,parseFloat(values[0]) || 0],[0,1,0],[0,0,1]]);
				else if (transform === "translateY") result = MATRIX_MULTIPLY(result,[[1,0,0],[0,1,parseFloat(values[0]) || 0],[0,0,1]]);
				else if (transform === "scale") result = MATRIX_MULTIPLY(result,[[parseFloat(values[0]) || 1,0,0],[0,parseFloat(values[1]) || parseFloat(values[0]) || 1,0],[0,0,1]]);
				else if (transform === "scaleX") result = MATRIX_MULTIPLY(result,[[parseFloat(values[0]) || 1,0,0],[0,1,0],[0,0,1]]);
				else if (transform === "scaleY") result = MATRIX_MULTIPLY(result,[[1,0,0],[0,parseFloat(values[0]) || 1,0],[0,0,1]]);
				else if (transform === "skew") result = MATRIX_MULTIPLY(result,[[1,VALUE_RADIANS(values[0]),0],[VALUE_RADIANS(values[1] || values[0]),1,0],[0,0,1]]);
				else if (transform === "skewX") result = MATRIX_MULTIPLY(result,[[1,VALUE_RADIANS(values[0]),0],[0,1,0],[0,0,1]]);
				else if (transform === "skewY") result = MATRIX_MULTIPLY(result,[[1,0,0],[VALUE_RADIANS(values[0]),1,0],[0,0,1]]);
				else if (transform === "rotate") {
					var rad = VALUE_RADIANS(values[0]);
					result = MATRIX_MULTIPLY(result,[[Math.cos(rad),-Math.sin(rad),0],[Math.sin(rad),Math.cos(rad),0],[0,0,1]]);
				};
			};
			// DX,DY do not work with "SizingMethod = auto expand"
			// we store them here for the transform-origin helper
			filters.push(results.filter = ["progid:DXImageTransform.Microsoft.Matrix(M11=",result[0][0],",M12=",result[0][1],",DX=",result[0][2],",M21=",result[1][0],",M22=",result[1][1],",DY=",result[1][2],",Enabled=",result[0][0] === 1 && result[1][1] === 1 && result[0][1] === 0 && result[1][0] === 0 ? "false" : "true",",SizingMethod='auto expand')"].join(""));
			element.style.filter = filters.join(" ");
			// proper page flow requires the position to be not static
			// this can (and should) be set by the you, the programmer (might remove this line)
			if (GETSTYLE(element,"position") === "static") element.style.position = results.position = "relative";
			return Pseudo.extend(results,WRITERS["transform-origin"](element,element.style.PseudoTransformOrigin || "50% 50%"));
		};
		READERS["transform-origin"] = function(element) {
			return element.style.PseudoTransformOrigin || "50% 50%";
		};
		// http://someguynameddylan.com/lab/transform-origin-in-internet-explorer.php
		WRITERS["transform-origin"] = function(element,value) {
			var	control = element.filters["DXImageTransform.Microsoft.Matrix"],
				filter = GET_FILTER_VALUES(element,"Matrix"),
				enabled = !("enabled" in filter) || filter.enabled === "true",
				values = value.trim().toLowerCase().split(/\s+/g), 
				results = {};
			if (values.length < 2) values.push(values[0]);
			results.PseudoTransformOrigin = values.join(" ");
			if (control) {
				control.enabled = false;
				var	left = parseFloat(GETSTYLE(element,"left")) || 0,
					top = parseFloat(GETSTYLE(element,"top")) || 0,
					border = GETSTYLE(element,"border-width").split(/\s+/g).map(parseFloat);
				border.length = 4;
				if (isNaN(border[0])) border[0] = 0;
				if (isNaN(border[1])) border[1] = border[0] || 0;
				if (isNaN(border[2])) border[2] = border[0] || 0;
				if (isNaN(border[3])) border[3] = border[1] || border[0] || 0;
				var	a = filter.m11, c = filter.m12,
					b = filter.m21, d = filter.m22,
					x = (element.offsetWidth - border[1] - border[3]) / 2,
					y = (element.offsetHeight - border[0] - border[2]) / 2,
					e = VALUE_COORD(values[0],x * 2),
					f = VALUE_COORD(values[1],y * 2);
				x -= e;	// translated center
				y -= f;
				e += (a * x) + (c * y) + filter.dx;	// apply matrix + origin + translation
				f += (b * x) + (d * y) + filter.dy;
				control.enabled = true;	// enabled to subtract transformed coords/dimensions
				e -= (element.offsetWidth - (border[1] || 0) - (border[3] || 0)) / 2;
				f -= (element.offsetHeight - (border[0] || 0) - (border[2] || 0)) / 2;
				
				element.style.left = e + left +"px";
				element.style.top = f + top +"px";
				control.enabled = enabled;	// set original status
				results.PseudoTransformCoords = e +" "+ f;
				
				// proper page flow requires the position to be not static
				// this can (and should) be set by the you, the programmer (might remove this line)
				if (GETSTYLE(element,"position") === "static") element.style.position = results.position = "relative";
			};
			element.style.PseudoTransformOrigin = results.PseudoTransformOrigin;
			element.style.PseudoTransformCoords = results.PseudoTransformCoords;
			return results;
		};
		READERS["left"] = function(element) {
			var	coords = element.style.PseudoTransformCoords,
				x = coords ? parseFloat(coords.split(" ")[0]) : 0,
				left = GETSTYLE(element,"left");
			return !x ? left : (parseFloat(left) || 0) - x +"px";
		};
		WRITERS["left"] = function(element,value) {
			var	coords = element.style.PseudoTransformCoords,
				x = coords ? parseFloat(coords.split(" ")[0]) : 0;
			if (value === "auto") value = x +"px";
			else if (x) value = x + (parseFloat(value) || 0) +"px";
			element.style.left = value;
			return { "left": element.style.left };
		};
		READERS["top"] = function(element) {
			var	coords = element.style.PseudoTransformCoords,
				y = coords ? parseFloat(coords.split(" ")[1]) : 0,
				top = GETSTYLE(element,"top");
			return !y ? top : (parseFloat(top) || 0) - y +"px";
		};
		WRITERS["top"] = function(element,value) {
			var	coords = element.style.PseudoTransformCoords,
				y = coords ? parseFloat(coords.split(" ")[1]) : 0;
			if (value === "auto") value = y +"px";
			else if (y) value = y + (parseFloat(value) || 0) +"px";
			element.style.top = value;
			return { "top": element.style.top };
		};
	})(); else (function(){
		var PREFIX_FUNCS, PREFIX = Pseudo.Browser.IE ? ["-ms-","ms"] :
			Pseudo.Browser.Gecko ? ["-moz-","Moz"] : 
			Pseudo.Browser.Webkit ? ["-webkit-","webkit"] : 
			Pseudo.Browser.Opera ? ["-o-","O"] : null;
		if (PREFIX) {
			PREFIX_FUNCS = function(name) {
				READERS[name] = function(element) { return GETSTYLE(element,PREFIX[0] + name.dasherize()) };
				WRITERS[name] = function(element,value) {
					var result = {}, prop = PREFIX[1] + name.camelize().capitalize();
					element.style[prop] = value;
					result[prop] = element.style[prop];
					return result;
				};
			};
		//	for (var each in DIV.style) if (each.startsWith(PREFIX[1])) PREFIXER(each.capitalize().dasherize().pruneLeft(PREFIX[0]));
			[	"animation","animation-delay","animation-direction","animation-duration","animation-fill-mode",
				"animation-iteration-count","animation-name","animation-play-state","animation-timing-function",
				"background-size","border-radius","border-bottom-left-radius","border-bottom-right-radius",
				"border-top-left-radius","border-top-right-radius","box-align","box-direction","box-flex",
				"box-ordinal-group","box-orient","box-pack","box-sizing","box-shadow","column-count",
				"column-gap","column-rule","column-rule-color","column-rule-width","column-width","columns",
				"font-size-adjust","font-stretch","marker-offset","text-decoration-color","hyphens","opacity",
				"outline","perspective","perspective-origin","text-align-last","text-autospace","text-overflow",
				"text-size-adjust","transform","transform-origin","transform-origin-x","transform-origin-y",
				"transform-style","transition","transition-property","transition-duration",
				"transition-timing-function","transition-delay","user-select"	].each(function(name) {
					if (typeof DIV.style[name] !== "string" && typeof DIV.style[PREFIX[1] + name.camelize().capitalize()] === "string") PREFIX_FUNCS(name);
				});
		};
	})();
	if (typeof DIV.style["float"] !== "string") {
		READERS["float"] = function(element) { return this.style["cssFloat"] || GETSTYLE(this,"cssFloat") };
		WRITERS["float"] = function(element,value) {
			element.style["cssFloat"] = value;
			return { "cssFloat": element.style["cssFloat"] };
		};
	};
	DIV = null;
	return {
		// returns array or object containing styles applied
		"getStyle": this.HELPERS_READ_ATTRIBUTE["style"] = function getStyle(property) {
			if (arguments.length > 1) {
				var props = Array.from(arguments).flatten(), i = 0, l = props.length, results = new Array(l);
				for (;i<l; i++) results[i] = this.getStyle(props[i]);
				return results;
			} else if (Object.className(property) === "Object") {
				for (var name in property) property[name] = this.getStyle(name);
				return property;
			} else {
				property = property.dasherize();
				return READERS[property] ? READERS[property](this) : this.style[property.camelize()] || GETSTYLE(this,property);
			};
		},
		// returns object containing styles applied
		"setStyle": this.HELPERS_WRITE_ATTRIBUTE["style"] = function setStyle(property,object) {
			var results = {};
			if (Object.className(property) === "Object") {
				for (var name in property) Pseudo.extend(results,this.setStyle(name,property[name]));
			} else if (property.contains(":") || property.contains(";")) {
				Pseudo.extend(results,this.setStyle(STYLES_OBJECT(property)));
			} else {
				var name = property.camelize(), value = String(object);
				if (!(property in WRITERS)) results[property] = this.style[name] = value;
				else Pseudo.extend(results,WRITERS[property](this,object));
			};
			return results;
		}
	};
}).call(Pseudo.DOM));
Pseudo.DOM.addMethods("#document",(function(){	// document specific helpers
	var ELEM = this.Element.prototype;
	return {
		"element": function element(nodeName,attributes,handlers) {
			var name, elem = this.createElement(nodeName);
			elem.__pseudo = Pseudo.unique();
			if (attributes) for (name in attributes) elem.write(name,attributes[name]);
			if (handlers) for (name in handlers) elem.on(name,handlers[name]);
			return elem;
		},
		// copy from Element.prototype
		"contains": ELEM.contains,
		"query": ELEM.query
	};
}).call(Pseudo.DOM));
Pseudo.DOM.addMethods("form",(function(){	// form specific helpers
	var	TOGGLE_STATE = function(input) { input.__enabled = !input.disabled },
		TOGGLE_OFF = function(input) { input.disabled = true },
		TOGGLE_ON = function(input) { input.disabled = false },
		TOGGLE_REVERT = function(input) { input.disabled = "__enabled" in input ? !input.__enabled : false },
		DATA_SELECT_MULTI = function(option) { return option.selected },
		DATA_SELECT_VALUE = function(option) { return !option ? undefined : (option.value || option.text || option.innerHTML) },
		DATA_REDUCE = function(returned,input,index,array) {
			var name = input.name, value, type = input.nodeName;
			if (!name || type === "FIELDSET" || input.disabled) {
				value = undefined;
			} else if (type === "TEXTAREA") {
				value = input.value;
			} else if (type === "SELECT") {
				if (!input.multiple) value = DATA_SELECT_VALUE(input.options[input.selectedIndex]);
				else value = $A(input.options).filter(DATA_SELECT_MULTI).map(DATA_SELECT_VALUE);
			} else if (type === "BUTTON") {
				value = undefined;	//input.getAttribute("value") || input.textContent;
			} else if (type === "INPUT") {
				type = input.getAttribute("type");
				// html4
				if (type === "submit" || type === "button" || type === "reset") value = undefined;
				else if (type === "text" || type === "password") value = input.value;
				else if (type === "radio" || type === "checkbox") value = input.checked ? input.value : undefined;
				// html5
				else if (type === "color") value = input.value;
				else if (type === "date") value = input.value;
				else if (type === "datetime") value = input.value;
				else if (type === "datetime-local") value = input.value;
				else if (type === "email") value = input.value;
				else if (type === "month") value = input.value;
				else if (type === "number" || type === "range") value = parseFoat(input.value);
				else if (type === "search") value = input.value;
				else if (type === "tel") value = input.value;
				else if (type === "time") value = input.value;
				else if (type === "url") value = input.value;
				else if (type === "week") value = parseFoat(input.value);
				// catch-all
				else value = input.value;
			};
			if (!Object.isNothing(value)) {
				if (!returned[name]) returned[name] = value;
				else if (Array.isArray(returned[name])) returned[name].push(value);
				else returned[name] = [returned[name],value];
			};
			return returned;
		},
		DATA_JOINED = function(data,key,index,array) {
			var value = data[key];
			if (!Array.isArray(value)) data[key] = String(value);
			else data[key] = value.flatten().join(",");
			return data;
		},
		DATA_QUERY = function(key,index,array) {
			var value = this[key];
			if (!Array.isArray(value)) return key +"="+ value;		//escape(value);
			else return key +"="+ value.flatten().join("&"+ key +"=");	//.map(escape).join("&"+ key +"=");
		};
	return {
		"disable": function disable(noState) {
			var elements = Array.from(this.elements);
			if (!noState) elements.each(TOGGLE_STATE);
			elements.each(TOGGLE_OFF);
		},
		"enable": function enable(noState) { Array.from(this.elements).each(!!noState ? TOGGLE_ON : TOGGLE_REVERT) },
		"state": function state() { Array.from(this.elements).each(TOGGLE_STATE) },
		"data": function data(format) {
			var data = Array.from(this.elements).reduce(DATA_REDUCE,{}), keys;
			if (format === "joined" || format === "query") keys = Object.keys(data);
			if (format === "joined") keys.reduce(DATA_JOINED,data);
			return format === "query" ? keys.map(DATA_QUERY,data).join("&") : data;
		}
	};
}).call(Pseudo.DOM));

/***********************
*** Ajax ***************
***********************/
(function(){
	var	ELEM = this.DOM.Element,
		FRAG = this.DOM.Fragment,
		DOM_XHR = window.XMLHttpRequest ? true : false,
		DOM_DOC = document.implementation && window.DOMParser && window.XMLSerializer ? true : false,
		DOCUMENT = DOM_DOC ? DOCUMENT_DOM : DOCUMENT_MSIE,
		MSIE_XHR = "",
		MSIE_XHRS = ["MSXML4.XMLHTTP","MSXML3.XMLHTTP","MSXML2.XMLHTTP","MSXML.XMLHTTP","Microsoft.XMLHTTP"],
		MSIE_DOC = "",
		MSIE_DOCS = ["MSXML4.DOMDocument","MSXML3.DOMDocument","MSXML2.DOMDocument","MSXML.DOMDocument","Microsoft.XMLDOM"],
		XML_PARSER = !DOM_DOC ? null : new DOMParser(),
		XML_SERIALIZER = !DOM_DOC ? null : new XMLSerializer();
	
	// xml
	function DOCUMENT_DOM(ns,name) {
		return document.implementation.createDocument(ns,name,null);
	};
	function DOCUMENT_MSIE(ns,name) {
		var doc;
		if (MSIE_DOC) {
			doc = new ActiveXObject(MSIE_DOC);
		} else {
			for (var i=0; MSIE_DOC=MSIE_DOCS[i]; i++) {
				try { doc = new ActiveXObject(MSIE_DOC) } catch(e) {};
				if (doc) break;
			};
		};
		doc.async = false;
		if (name) doc.loadXML(!ns ? "<"+ name +" />" : "<a0:"+ name +" xmlns:a0=\""+ ns +"\" />");
		return doc;
	};
	
	// ajax
	function getStatus(xhr) {
		var status = { "code": 0, "text": "" };
		try {
			status.code = xhr.status;
			status.text = xhr.statusText;
		} catch(x) {};
		return status;
	};
	function getResponseSize(xhr) {
		var content = "";
		try { content = xhr.getResponseHeader("Content-Length") } catch(x) {};
		return parseInt(content);
	};
	
	this.Ajax = {
		"Headers": {
		//	"Accept": "text/javascript, text/html, application/xml, text/xml, */*",
			"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
			"X-Requested-With": "XMLHttpRequest", "X-Pseudo-Version": this.version
		},
		"transport": DOM_XHR ? function transportNative() {
			return new XMLHttpRequest();
		} : function transportActiveX() {
			var xhr;
			if (MSIE_XHR) {
				xhr = new ActiveXObject(MSIE_XHR);
			} else {
				for (var i=0; MSIE_XHR=MSXHR_TYPES[i]; i++) {
					try { xhr = new ActiveXObject(x) } catch(e) {};
					if (xhr) break;
				};
			};
			return xhr;
		},
		"doc": function doc(namespaceURI,documentElementName,contents) {
			var xml = DOCUMENT(namespaceURI || "", documentElementName || "", null);
			if (contents) {
				if (!(contents instanceof ELEM)) this.setInnerXml(xml,contents);
				else xml.appendChild(xml.importNode(n,true));
			};
			return xml;
		},
		"getInnerXml": DOM_DOC ? function getInnerDom(element) {
			var i = 0, c, childs = element.childNodes, inner = new Array(childs.length);
			for (; c=childs[i]; i++) inner[i] = XML_SERIALIZER.serializeToString(c);
			return inner.join("");
		} : function getInnerMsie(element) {
			var i = 0, c, childs = element.childNodes, inner = new Array(childs.length);
			for (; c=childs[i]; i++) inner[i] = c.xml;
			return inner.join("");
		},
		"setInnerXml": DOM_DOC ? function setInnerDom(element,innerXml) {
			while (element.hasChildNodes()) element.removeChild(element.lastChild);
			innerXml = String(innerXml);
			if (innerXml.length) {
				var	i = 0, n, doc = element.ownerDocument || element,
					nodes = XML_PARSER.parseFromString(innerXml,"text/xml").childNodes;
				for (; n=nodes[i]; i++) element.appendChild(doc.importNode(n,true));
			};
		} : function setInnerMsie(element,innerXml) {
			if (Object.isNothing(innerXml)) innerXml = "";
			else innerXml = String(innerXml);
			element.loadXML(innerXml);
		},
		
		"getStatus": getStatus,
		"getResponseSize": getResponseSize,
		"getProgress": function getProgress(xhr) {
			if (xhr.readyState === 4) return 1;
			var percent = 0, size = getResponseSize(xhr) || 0;
			if (size > 0) percent = (xhr.responseText.length / size) * 0.85;
			return percent + (0.05 * xhr.readyState);
		},
		"isResponseOK": function isResponseOK(xhr,status) {
			var code = status && status.code || getStatus(xhr).code;
			return !!(code >= 200 && code <= 206 || code === 304);
		}
	};	
}).call(Pseudo);
Pseudo.Ajax.Request = Pseudo.Class.create(null,{
	// properties go here
},{
	"constructor": function(url,data,options,callbacks,headers) {
		this.__xhr = Ajax.transport();
		this.__doc = Ajax.doc();
		this.__callback = this.constructor.callback.bind(this);
		options = Pseudo.expand(options||{},this.constructor.defaults);
		
		this.url = String(url);
		this.data = Object.isNothing(data) ? null : String(data);
		this.sync = !!options.sync;
		this.method = !options.method ? "auto" : String(options.method).toLowerCase();
		this.headers = Pseudo.expand(headers||{},Pseudo.Ajax.Headers);
		
		if (callbacks) for (var each in callbacks) this.on(each,callbacks[each]);
		if (options.autofire) this.load();
	},
	"dispose": function($super) {
		this.cancel();
		return $super();
	},
	"cancel": function() {
		var status = Ajax.getStatus(this.__xhr), progress = Ajax.getProgress(this.__xhr), progress = NaN;
		if (progress < 1 && progress > 0) {
			this.__xhr.onreadystatechange = Pseudo.um;	// FX readystatechange when abort
			this.__xhr.abort();
			this.fire("aborted",{ "status": status, "progress": progress, "text": this.__xhr.responseText });
			return true;
		} else {
			return false;
		};
	},
	"load": function(force) {
		var loaded = !force ? Ajax.getProgress(this.__xhr) : 1;
		if (loaded !== 1 && loaded !== 0 && this.cancel()) loaded = 0;
		if (loaded === 1 || loaded === 0) {
			var	each,
				event = this.fire("before",{ "transport": this.__xhr }),
				method = this.method.toLowerCase();
			if (event.stopped) return false;
			if (method === "auto") method = this.data ? "post" : "get";
			
			this.__xhr.onreadystatechange = this.__callback;
			this.__xhr.open(method,this.url,!this.sync);
			for (each in this.headers) this.__xhr.setRequestHeader(each,this.headers[each]);
			this.__xhr.send(this.data);
			
			return true;
		} else {
			return false;
		};
	},
	"isBusy": function() {
		var loaded = Ajax.getProgress(this.__xhr);
		return loaded > 0 && loaded < 1;
	}
},{
	"defaults": {
		"method": "auto",
		"sync": false,
		"autofire": false
	},
	"callback": function() {
		var status = Ajax.getStatus(this.__xhr), xml, progress = Ajax.getProgress(this.__xhr);
		this.fire("loading",{ "status": status, "progress": progress, "text": this.__xhr.responseText });
		if (this.__xhr.readyState === 4) {
			xml = this.__xhr.responseXML;
			Ajax.setInnerXml(this.__doc,xml && xml.documentElement ? this.__xhr.responseText : "");
			this.fire("loaded",{
				"xml": this.__doc.documentElement || null,
				"text": this.__xhr.responseText,
				"status": status,
				"errored": !Ajax.isResponseOK(this.__xhr,status),
				"progress": progress,
				"transport": this.__xhr
			});
			this.fire.defer(this,"ready");
		};
	}
});

/***********************
*** Globals ************
***********************/
var	Ajax = Pseudo.Ajax,
	Class = Pseudo.Class,
	$ = document.getElementById,
	$$ = document.query.bind(document),
	$A = Pseudo.Array.from;
if (Pseudo.Browser.IE && Pseudo.BrowserVersion < 9) {
	Pseudo.DOM.addEventType("#document","DOMContentLoaded");
	(function IEDOMContentLoaded(){
		try {
			document.documentElement.doScroll("left");
			document.fire("DOMContentLoaded");
		} catch(e) { setTimeout(IEDOMContentLoaded,1) };
	})();
};