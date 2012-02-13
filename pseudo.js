/* ---------------------------------------------------------------------------
 *	Pseudo JavaScript framework, v2.0 (c) 2012 Alex Lein
 *	
 *	Pseudo is freely distributable under the terms of an MIT-style license.
 *	For details, see http://www.opensource.org/licenses/mit-license.php
 *--------------------------------------------------------------------------*/
"use strict";
var Pseudo = (function(){
	var	x = 0,
		SEED = document.location.toString(),
		VERSION = 2,
		BROWSER = { "IE": /*@cc_on!@*/!1, "Opera": false, "Gecko": false, "Webkit": false, "Mobile": false },
		BROWSER_VERSION = NaN,
		FILTER_OVERLOAD = /^function[^\(]*\(\$.+/im,
		SLICE = Array.prototype.slice,
		VALUEOF = Function.prototype.valueOf,
		TOSTRING = Function.prototype.toString,
		PROPERTY = { "configurable": true, "enumerable": true };
	
	// seed for guid & increment
	for (var i = 0, l = SEED.length; i < l; i++) x += SEED.charCodeAt(i);
	SEED = x.toString(16);
	
	// browser/engine
	BROWSER.Mobile = /(?:Mobile.+Safari|Opera\s(?:Mobi|Mini)|IEMobile)\/[0-9\.]+/.test(navigator.userAgent);
	if (BROWSER.IE) {
	//	BROWSER_VERSION = ScriptEngineMajorVersion() +"."+ ScriptEngineMinorVersion() +"."+ ScriptEngineBuildVersion();
		BROWSER_VERSION = navigator.userAgent.match(/\s*MSIE\s*(\d+\.?\d*)/i)[1];
		BROWSER["IE"+ parseInt(BROWSER_VERSION)] = true;
	} else if (BROWSER.Opera = (Object.prototype.toString.call(window.opera||Object) === "[object Opera]")) {
		BROWSER_VERSION = window.opera.version();
		BROWSER["Opera"+ parseInt(BROWSER_VERSION)] = true;
	} else if (BROWSER.Gecko = (/\sGecko\/\d{8}\s/.test(navigator.userAgent))) {
		BROWSER_VERSION = navigator.userAgent.match(/\s*rv\:([\d\.]+)/i)[1];
		BROWSER["Gecko"+ parseInt(BROWSER_VERSION)] = true;
	} else if (BROWSER.Webkit = (/\s(?:Apple)?WebKit\/\d{3}\.\d+/.test(navigator.userAgent))) {
	//	BROWSER_VERSION = navigator.userAgent.match(/\)\s[A-Z][a-z]+\/([^\s]+)/)[1];
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
	function OVERLOADABLE(method) {
		return !!(method instanceof Function && FILTER_OVERLOAD.test(method.toString()));
	};
	function OVERLOAD(ancestor,func) {
		return extend(
			function() {
			//	if (func.valueOf() === ancestor.valueOf()) console.warn("recurrsion?",ancestor,func);
				return func.apply(this,[ancestor.bind(this)].inject(SLICE.call(arguments,0)));
			},
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
			var id = new Date().valueOf().toString(16) + SEED;
			while (id.length < 32) id += Math.random().toString(16).substring(2);
			id = id.substring(0,32);
			return [
				id.substring(0,8),
				id.substring(8,12),
				id.substring(12,16),
				id.substring(16,20),
				id.substring(20)
			].join("-");
		},
		"tryThese": function tryThese(func1,func2,funcN) {
			var i = 0, prevEx, prevFunc, func, funcs = SLICE.call(arguments,0);
			for (;func=functions[i];i++) {
				try { return func.call(this,i,prevEx,prevFunc) }
				catch (exception) { prevEx = exception };
				prevFunc = func;
			};
		},
		"um": function unmolested(object) { return object },
		"unique": function unique() { return x++ },
		
		// classing/prototype
		"augment": function augment(object,methods) {
			var	name,
				method,
				$super = Object.getPrototypeOf(object);
			if (methods.constructor && !Function.isNative(methods.constructor)) methods.__constructor = methods.constructor;
			for (name in methods) {
				if (name === "constructor") continue;
				if (!OVERLOADABLE(methods[name])) object[name] = methods[name];
				else object[name] = OVERLOAD($super && $super[name] || object[name],methods[name]);
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
				if (current = Object.getOwnPropertyDescriptor(object,name)) Pseudo.expand(property,current);
				if (ancestor = Object.getOwnPropertyDescriptor($super,name)) Pseudo.expand(property,ancestor);
				Pseudo.expand(property,PROPERTY);
				
				if (OVERLOADABLE(property["get"])) property["get"] = OVERLOAD(
					current && current["get"] || ancestor && ancestor["get"],
					property["get"]
				);
				if (OVERLOADABLE(property["set"])) property["set"] = OVERLOAD(
					current && current["set"] || ancestor && ancestor["set"],
					property["set"]
				);
				Object.defineProperty(object,name,Pseudo.expand(property,current,ancestor));
			};
			return object;
		}
	};
})();

/***********************
*** Object *************
***********************/
(function(){
	var	FILTER_CLASS = /^\[object\s(.*)\]$/,
		TOSTRING = Object.prototype.toString,
		NATIVE_CONSTRUCTOR = !!(TOSTRING.constructor ? TOSTRING.constructor.prototype : null),
		NATIVE_PROTO = typeof TOSTRING.__proto__ === "object";
	
	// extensions
	function className(object) {
		if (object === undefined) return "undefined";
		else if (object === null) return "null";
		else return TOSTRING.call(object).match(FILTER_CLASS)[1];
	};
	
	this.expand(Object,this.Object = {
		// compatibility
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
			// stuff?
			return object;
		},
		"getOwnPropertyDescriptor": function getOwnPropertyDescriptor(object,propertyName) {
			return {};
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
				proto = window[className(object)];
				if (proto) proto = proto.prototype;
			};
			return proto || null;
		},
		
		// extensions
		"className": className,
		"clone": function clone(object) { return Pseudo.extend({},object) },
		"isArguments": function isArguments(object) {
			var cn = className(object);
			return cn === "Arguments" || cn === "Object" && !isNaN(object.length) && "callee" in object;
		},
		"isNothing": function isNothing(object) { return object === null || object === undefined },
		"prototypeChain": function prototypeChain(object) {
			var	chain = [],
				prev,
				proto = isNothing(object) ? null : Object.getPrototypeOf(object);
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
	//	FILTER_NATURAL = /[a-z]+|\d+(?:\.\d+)*/gim,
		FILTER_NATURAL =/[a-z]+|[0-9]+/gim,
		FILTER_WHITESPACE = /\s+/g,
		HELPER_MAX = function(prev,next) { return prev > next ? prev : next },
		HELPER_MIN = function(prev,next) { return prev < next ? prev : next },
		HELPER_SUM = function(prev,next) { return prev+next };
	
	// extended functions
	/*-- DEPRECIATED version
	function natural(a,b) {
		a = String(a).toLowerCase().trim();
		b = String(b).toLowerCase().trim();
		if (a === b) return 0;	// in the case of equal strings
		
		var	sa, na, sb, nb,
			aa = a.match(FILTER_NATURAL), ab = b.match(FILTER_NATURAL),
			i = 0, l = Math.max(aa.length,ab.length);
		for (;i<l;i++) {
			sa = aa[i];
			sb = ab[i];
			if (sa === sb) continue;
			else if (!sa) return -1;
			else if (!sb) return 1;
			na = parseFloat(sa);
			nb = parseFloat(sb);
			
			if (isNaN(na) && isNaN(nb)) {
				if (sa > sb) return 1;
				else if (sa < sb) return -1;
			} else if (!isNaN(na) && !isNaN(nb)) {
				if (na > nb) return 1;
				else if (na < nb) return -1;
			} else if (!isNaN(na) && isNaN(nb)) {
				return 1;
			} else if (isNaN(na) && !isNaN(nb)) {
				return -1;
			};
		};
		return 0;
	};
	*/
	
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
			catch(x) { /* IE throws error for live DOM queries; getElementsByTagName */ };
			var length = object.length || 0, results = new Array(length);
			while (length--) results[length] = object[length];
			return results;
		},
		"fromWhitespace": function fromWhitespace(string) {
			if (Object.isNothing(string) || string === "") return [];
			return String(string).split(FILTER_WHITESPACE);
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
		"examine": function examine(callback,arg1,arg2,argN) {
			var i = 0, l = this.length, results = new Array(l), args = [null,-1,this].concat(SLICE.call(arguments,1));
			for (;i<l;i++) {
				args[0] = this[i];
				args[1] = i;
				results[i] = callback.apply(this,args);
			};
			return this;
		},
		"invoke": function invoke(methodName,arg1,arg2,argN) {
			var i = 0, l = this.length, results = new Array(l), args = SLICE.call(arguments,1);
			for (;i<l;i++) results[i] = this[i][methodName].apply(this[i],args);
			return this;
		},
		"gather": function gather(propertyName) {
			var i = 0, l = this.length, result = new Array(l);
			for (;i<l;i++) result[i] = this[i][propertyName];
			return this;
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
		PROTOTYPE = Date.prototype,
		NATIVE_DATE = Date,
		NATIVE_CONSTRUCTOR = PROTOTYPE.constructor || NATIVE_DATE,
		INVALID = new Date("invalid"),
		INVALID_MESSAGE = "Invalid Date",
		FILTER_ISO = /^(\\d{4}|[\+\-]\\d{6})(?:-(\\d{2})(?:-(\\d{2})(?:T(\\d{2}):(\\d{2})(?::(\\d{2})(?:\\.(\\d{3}))?)?(?:Z|(?:([-+])(\\d{2}):(\\d{2})))?)?)?)?$/,
		FILTER_FORMAT = /\\?(\\|y{1,4}|d{1,4}|M{1,4}|h{1,2}|H{1,2}|m{1,2}|s{1,2}|f{1,6}|t{1,3}|T{1,3})/gm,
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
		HELPER_FORMAT_MILLI = function(milliseconds,length) {
			return parseFloat("0." + milliseconds).zeroPad(0,length).substring(2);
		},
		HELPER_FORMAT = function(piece,index,pieces) {
			if (!piece) return;
			if (piece.startsWith("\\")) return pieces[index] = piece.substring(1);
			switch (piece) {
				case "yyyy":
				case "yyy":	pieces[index] = this.getFullYear();break;
				case "yy":	pieces[index] = this.getFullYear().toString().right(2);break;
				case "y":		pieces[index] = this.getFullYear().toString().right(1);break;
				case "MMMM":	pieces[index] = this.getMonthName();break;
				case "MMM":	pieces[index] = this.getMonthName().left(3);break;
				case "MM":
				case "M":		pieces[index] = (this.getMonth()+1).zeroPad(piece.length);break;
				case "dddd":	pieces[index] = this.getDayName();break;
				case "ddd":	pieces[index] = this.getDayName().left(3);break;
				case "dd":
				case "d":		pieces[index] = this.getDate().zeroPad(piece.length);break;
				case "HH":
				case "H":		pieces[index] = this.getHours().zeroPad(piece.length);break;
				case "hh":
				case "h":		pieces[index] = this.getHoursBase12().zeroPad(piece.length);break;
				case "mm":
				case "m":		pieces[index] = this.getMinutes().zeroPad(piece.length);break;
				case "ssss":
				case "sss":
				case "ss":
				case "s":		pieces[index] = this.getSeconds().zeroPad(piece.length);break;
				case "ffffff":
				case "fffff":
				case "ffff":
				case "fff":
				case "ff":
				case "f":		pieces[index] = parseFloat("0."+ this.getMilliseconds()).zeroPad(0,piece.length).substring(2);break;
				case "TTTT":
				case "TTT":	pieces[index] = this.getHours() > 11 ? "P.M." : "A.M.";break;
				case "tttt":
				case "ttt":	pieces[index] = this.getHours() > 11 ? "p.m." : "a.m.";break;
				case "TT":	pieces[index] = this.getHours() > 11 ? "PM" : "AM";break;
				case "tt":	pieces[index] = this.getHours() > 11 ? "pm" : "am";break;
				case "T":		pieces[index] = this.getHours() > 11 ? "P" : "A";break;
				case "t":		pieces[index] = this.getHours() > 11 ? "p" : "a";break;
				default:		pieces[index] = piece;
			};
		};
	
	// extension functions
	function getTimezoneOffset() { return -new Date().getTimezoneOffset() };
	function now() { return new Date().getTime() };
	function today() {
		var date = new Date();
		date.setHours(0,0,0,0);
		return date;
	};
	function tomorrow() {
		var date = today();
		date.setDate(date.getDate()+1);
		return date;
	};
	function yesterday() {
		var date = today();
		date.setDate(date.getDate()-1);
		return date;
	};
	
	// compatibility methods
	function DateTime(year,month,date,hour,minute,second,fraction) {
		/*
		
		
		extended parsing for ISO strings
		this is not yet implemented
		
		
		*/
		NATIVE_CONSTRUCTOR.apply(this,SLICE.call(arguments,0));
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
				return NATIVE_DATE.UTC.apply(this,matches) + offset - 12622780800000;
			};
			return NATIVE_DATE.UTC.apply(this,matches) + offset;
		};
		return PROTOTYPE.parse.apply(this,SLICE(arguments,0));
	};
	function toISOString() {
		var result = "", year = this.getUTCFullYear(), absy = Math.abs(year).toString();
		if (year > 9999) result = "+";
		else if (year < 0) result = "-";
		return result + ("00000"+ absy).slice(absy.length === 4 ? -4 : -6) +"-"+
			(this.getUTCMonth()+1).zeroPad(2) +"-"+ this.getUTCDate().zeroPad(2) +"T"+
			this.getUTCHours().zeroPad(2) +":"+ this.getUTCMinutes().zeroPad(2) +":"+
			this.getUTCSeconds().zeroPad(2) +"."+ this.getUTCMilliseconds().zeroPad(0,3) +"Z";
	};
	function toJSON() { return this.toISOString() };
	
	// extension methods
	function copy() { return new Date(this.valueOf()) };
	function context(comparer,levels) {
		if (!(comparer instanceof Date) || isNaN(comparer.valueOf())) comparer = new Date();
		if (isNaN(levels)) levels = 2;
		
		var	i = 0, s = 0, criteria, next,
			descriptor = [],
			method = levels-s === 1 ? "round" : "floor",
			difference = this.valueOf() - comparer.valueOf(),
			before = difference < 0,
			absolute = Math.abs(difference);
		
		for (;criteria=HELPER_COMPARE[i];i++) {
			if (absolute >= criteria.value) {
				var value = Math[method](absolute/criteria.value);
				descriptor.push({
					"value": before ? -value : value,
					"type": criteria.type,
					"name": criteria.name
				});
				absolute -= value * criteria.value;
				s++;
			};
			if (levels <= s || absolute < 1000) break;
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
	};
	function contextString(comparer,levels) {
		var array = this.context(comparer,levels), i = array.length, results = new Array(i);
		while (i--) {
			results[i] = [
				Math.abs(array[i].value),
				Math.abs(array[i].value) > 1 ? array[i].name : array[i].name.toUpperCase()
			].join(" ");
		};
		return results.join(", ");
	};
	function getDayName() { return NAMES_DAY[this.getDay()] };
	function getMonthName() { return NAMES_MONTH[this.getMonth()] };
	function toFormat(string,invalid) {
		if (isNaN(this.valueOf())) return arguments.length > 1 ? invalid : INVALID_MESSAGE;
		return String(string).separate(FILTER_FORMAT).forEach(HELPER_FORMAT,this).join("");
	};
	
	// comparers
	function diff(type,compare) {
		if (type === Date.Month || type === Date.Week) {
			var value = 0, comparer = compare.copy(), incrementer = this > compare ? 1 : -1;
			while (incrementer > 0 && this > comparer || incrementer < 0 && this < comparer) {
				comparer.add(type,incrementer);
				value++;
			};
			return value * -incrementer;
		} else {
			return Math.round((compare.valueOf() - this.valueOf()) / Date.MillisecondsPer[type]);
		};
	};
	function isToday() { return this.isSameDay(new Date()) };
	function isAfter(compare) { return this.valueOf() > compare.valueOf() };
	function isBefore(compare) { return this.valueOf() < compare.valueOf() };
	function isSameYear(compare) { return this.getFullYear() === compare.getFullYear() };
	function isSameMonth(compare) { return this.isSameYear(compare) && this.getMonth() === compare.getMonth() };
	function isSameDay(compare) { return this.isSameMonth(compare) && this.getDate() === compare.getDate() };
	
	// value getters
	function getHoursBase12() {
		var hours = this.getHours();
		return hours === 0 ? 12 : hours % 12;
	};
	function getFirstDay() {
		var day = new Date(this.valueOf());
		day.setDate(1);
		return day.getDay();
	};
	function getLastDay() { return this.getLastDate().getDay() };
	function getLastDate() {
		var last = new Date(this.valueOf());
		last.setDate(1);
		last.setMonth(1+last.getMonth());
		last.setDate(0);
		return last.getDate();
	};
	
	// value setters
	function adder(type,value) {
		value = String(value).toNumber();
		if (!value) return this;
		switch (type) {
			case Date.Year:		this.setYear(this.getFullYear()+value);				break;
			case Date.Month:		this.setMonth(this.getMonth()+value);				break;
			case Date.Week:		this.setDate(this.getDate()+(value*7));				break;
			case Date.Day:			this.setDate(this.getDate()+value);				break;
			case Date.Hour:		this.setHours(this.getHours()+value);				break;
			case Date.Minute:		this.setMinutes(this.getMinutes()+value);			break;
			case Date.Second:		this.setSeconds(this.getSeconds()+value);			break;
			case Date.Millisecond:	this.setMilliseconds(this.getMilliseconds()+value);	break;
		};
		return this;
	};
	function copy() { return new Date(this.valueOf()) };
	function getter(type) {
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
	};
	function setter(type,value) {
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
	};
	function setWeek(value) {
		var copy = this.copy(), day = copy.getDay();
		copy.setMonth(0,1);
		copy.setDate(copy.getDate()+(value*7));
		this.setMonth(copy.getMonth(),copy.getDate());
	};
	
	this.expand(Date,this.Date = {
		"Year":		"yyyy",
		"Month":		"MM",
		"Day":		"dd",
		"Hour":		"hh",
		"Minute":		"mm",
		"Second":		"ss",
		"Millisecond":	"fff",
		
		// extensions
		"getTimezoneOffset": getTimezoneOffset,
		"now": now,
		"today": today,
		"tomorrow": tomorrow,
		"yesterday": yesterday
	});
	this.expand(Date.prototype,this.Date.Prototypes = {
		// compatibility
		"constructor": DateTime,
		"parse": parse,
		"toISOString": toISOString,
		"toJSON": toJSON,
		
		// extensions
		"copy": copy,
		"context": context,
		"contextString": contextString,
		"getDayName": getDayName,
		"getMonthName": getMonthName,
		"toFormat": toFormat,
		
		// comparers
		"diff": diff,
		"isAfter": isAfter,
		"isBefore": isBefore,
		"isSameDay": isSameDay,
		"isSameMonth": isSameMonth,
		"isSameYear": isSameYear,
		"isToday": isToday,
			
		// value getters/setters
		"getFirstDay": getFirstDay,
		"getHoursBase12": getHoursBase12,
		"getLastDate": getLastDate,
		"getLastDay": getLastDay,
		"add": adder,
		"get": getter,
		"set": setter,
		"setWeek": setWeek
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
			else if (options) Object.extend(context,options);
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
		D2R = Math.PI/180;
	
	this.expand(Math,this.Math = {
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
			if (strings[1] && strings[1].length < decimals) strings[1] = "0".repeat(decimals - strings[1].length) + strings[1];
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
		"slice": function slice(start,end) {return SLICE.call(this.split(""),start,end) },
		"substr": function substr(start,length) { return this.substring(start,start+length) },
		"trim": function trim() { return !this.length ? "" : this.replace(FILTER_TRIM_BOTH) },
		
		// extentions
		"contains": function contains(string) { return this.indexOf(string) > -1 },	// needs RegExp variant,
		"count": function count(string) { return this.split(string).length - 1 },
		"reverse": function reverse() { return this.split("").reverse().join("") },
		"startsWith": function startsWith(object) {
			if (object instanceof RegExp) {
				return new RegExp("^(?:"+ object.source +")").test(this);
			} else {
				return this.indexOf(object) === 0;
			};
		},
		"endsWith": function endsWith(object) {
			if (object instanceof RegExp) {
				return new RegExp("(?:"+ object.source +")$").test(this);
			} else {
				var last = this.lastIndexOf(object);
				return last > -1 && last === this.length - object.toString().length;
			};
		},
		
		// modifiers
		"camelize": function camelize() {
			var sections = this.split("-"), camel = [sections[0]], i = 0, l = sections.length;
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
			FILTER_DASHERIZE.reset();
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
			else return this.left(Math.round(length/2)) + truncation + this.right(Math.floor(length/2));
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
		"left": function left(length) {
			if (!length) return this.toString();
			return length > 0 ? this.substring(0,length) : this.slice(-length);
		},
		"right": function right(length) {
			if (!length) return this.toString();
			return length > 0 ? this.slice(-length) : this.substring(0,length+this.length);
		},
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
					if (compare.lastIndex - match[0].length > 0)
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
			this.exec("");
			return this;
		}
	});
}).call(Pseudo);

/***********************
*** Classing ***********
***********************/
var Class = (function(){
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
		TRIGGER = document.addEventListener ? TRIGGER_DOM : TRIGGER_MSIE,
		FACTORY = {},
		PROTOTYPES = {},
		PROPERTIES = {};
	
	// events
	function KlassEvent(scope,type,extras) {
		this.target = scope;
		this.type = type;
		this.fired = false;
		if (extras) Pseudo.expand(this,extras);
	};
	function HANDLER_FIND(pair) { return pair.handler === this };
	function HANDLER_WRAP(scope,handler) { return function wrapped(e) { return handler.call(scope,e.event) } };
	function TRIGGER_DOM(event,meta,handlers) {
		var i = 0, p, e = document.createEvent("Event");
		for (;p=handlers[i];i++) meta.addEventListener("dataavailable",p.wrapped,false);
		e.initEvent("dataavailable",false,true);
		e.event = event;
		meta.dispatchEvent(e);
		for (i=0;p=handlers[i];i++) meta.removeEventListener("dataavailable",p.wrapped,false);
	};
	function TRIGGER_MSIE(event,meta,handlers) {
		var i = handlers.length - 1, p, e = document.createEventObject();
		document.head.appendChild(meta);
		for (;p=handlers[i];i--) meta.attachEvent("ondataavailable",p.wrapped);
		e.event = event;
		meta.fireEvent("ondataavailable",e);
		for (;p=handlers[i];i++) meta.detachEvent("ondataavailable",p.wrapped);
		document.head.removeChild(meta);
	};
	Pseudo.extend(PROTOTYPES,{
		"on": function on(type,handler) {
			if (handler instanceof Array) {
				for (var i=0,l=handler.length; i<l; i++) this.on(type,handler[i]);
			} else if (handler instanceof Function) {
				if (!this.__handlers) this.__handlers = {};
				if (!this.__handlers[type]) this.__handlers[type] = [];
				if (!this.has(type,handler)) this.__handlers[type].push({
					"handler": handler,
					"wrapped": HANDLER_WRAP(this,handler)
				});
			} else {
				throw new TypeError();
			};
			return this;
		},
		"off": function off(type,handler) {
			if (!arguments.length) {
				if (this.__handlers) for (type in this.__handlers) this.off(type);
			} else if (arguments.length === 1) {
				if (this.__handlers && this.__handlers[type] instanceof Array) this.off(type,this.__handlers[type].copy());
			} else if (handler instanceof Array) {
				for (var i=0,l=handler.length; i<l; i++) this.off(type,handler[i].handler);
			} else if (handler instanceof Function) {
				var	index = -1,
					handlers = this.__handlers && this.__handlers[type],
					machine = this.__machine && this.__machine[type];
				if (handlers) index = handlers.filterIndex(HANDLER_FIND,handler);
				if (index > -1) {
					if (machine) machine.removeEventListener(type,handlers[index].wrapped,false);
					handlers.removeAt(index);
				};
				if (handlers.length < 1) delete this.__handlers[type];
			} else {
				throw new TypeError();
			};
			return this;
		},
		"has": function has(type,handler) {
			if (this.__handlers && this.__handlers[type]) {
				var handlers = this.__handlers[type], i = 0, h;
				for (;h=handlers[i];i++) if (h.handler === handler) return true;
			};
			return false;
		},
		"fire": function fire(type,extras) {
			var event = new KlassEvent(this,type,extras);
			if (this.__handlers && this.__handlers[type]) {
				if (!this.__machine) this.__machine = {};
				if (this.__machine[type]) throw new Error("Recursion");
				this.__machine[type] = document.createElement("meta");
				TRIGGER(event,this.__machine[type],this.__handlers[type]);
				event.fired = delete this.__machine[type];
			};
			return event;
		},
		"dispose": function dispose(name) {
			this.off();
			return this;
		}
	});
	
	// properties
	Pseudo.extend(PROTOTYPES,{
		"getValue": DOM_PROPS ? function getValueNative(name) {
			return this[name];
		} : function getValue(name) {
			var property = this.constructor.__properties[name];
			return !property || !property["get"] ? this[name] : property["get"].call(this,this[name]);
		},
		"setValue": DOM_PROPS ? function setValueNative(name,value) {
			return this[name] = value;
		} : function setValue(name,value) {
			var property = this.constructor.__properties[name];
			return this[name] = !property || !property["set"] ? value : property["set"].call(this,value);
		},
		"setValues": function setValue(values) {
			for (var name in values) this.setValue(name,values[name]);
		}
	});
	
	// methods
	Pseudo.extend(FACTORY,{
		"addMethods": function(methods) {
			return Pseudo.augment(this.prototype,methods);
		},
		"addProperties": DOM_PROPS ? function addPropertiesNative(properties) {
			var name, props = {};
			for (name in properties) {
			//	props[name] = properties[name] instanceof Function ? properties[name]() : Object.clone(properties[name]);
				props[name] = Object.clone(properties[name]);
				if (!("enumerable" in props[name]) && name.startsWith("__")) props[name].enumerable = false;
			};
			return Pseudo.define(this.prototype,props);
		} : function addProperties(properties) {
			var name, props;
			if (!this.__properties) this.__properties = {};
			for (name in properties) {
				this.__properties[name] = Object.clone(properties[name]);
				// TODO: augment getter/setter
			};
			return this;
		}
	});
	
	// classing
	function createKlass($super) {
		function Klass() {
		//	this.__trace = true;
			this.__pseudo = Pseudo.unique();
			var name, props = this.constructor.__properties;
			if (DOM_PROPS) Object.defineProperty(this,"__pseudo",{ "enumerable": false })
			else if (props) for (name in props) if ("value" in props[name]) this[name] = props[name].value;
			this.__constructor.apply(this,SLICE.call(arguments,0));
		};
		Klass.prototype.__constructor = Pseudo.um;
		if ($super) {
			var Quasi = function() {};
			Quasi.prototype = $super && $super.prototype;
			Klass.prototype = new Quasi();
			if (!DOM_PROPS && $super.__properties) Klass.__properties = Object.clone($super.__properties);
		};
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
	
	return this.Class = {
		"Factory": FACTORY,
		"Prototypes": PROTOTYPES,
		"Properties": PROPERTIES,
		
		"klass": createKlass,
		"create": create,
		"singleton": function singleton($super,properties,methods,factory,aliases) {
			return Pseudo.extend(new create($super,properties,methods,factory,aliases)(),factory || {});
		}
	};
}).call(Pseudo);

/***********************
*** DOM ****************
***********************/
var DOM = (function(){
	var	WIN = window.DOMWindow || window.Window || window.constructor,
		DOC = window.HTMLDocument || window.Document || document.constructor,
		ELEM = window.HTMLElement || window.Element,
		CUSTOM = {};
	
	return this.DOM = {
		"CUSTOM_EVENTS": CUSTOM,
		"Document": DOC,
		"Element": ELEM,
		"Window": WIN,
		"querySelector": (function(){
			var i = 0, name, names = ["querySelector","mozQuerySelector","webkitQuerySelector","msQuerySelector","oQuerySelector"];
			for (;name=names[i];i++) if (ELEM.prototype[name]) return name;
		})() || "",
		"querySelectorAll": (function(){
			var i = 0, name, names = ["querySelectorAll","mozQuerySelectorAll","webkitQuerySelectorAll","msQuerySelectorAll","oQuerySelectorAll"];
			for (;name=names[i];i++) if (ELEM.prototype[name]) return name;
		})() || "",
		"matchesSelector": (function(){
			var i = 0, name, names = ["matchesSelector","mozMatchesSelector","webkitMatchesSelector","msMatchesSelector","oMatchesSelector"];
			for (;name=names[i];i++) if (ELEM.prototype[name]) return name;
		})() || "",
		"addEvent": function addEvent(nodeName,type) {
			if (!nodeName) nodeName = "*";
			if (!CUSTOM[nodeName]) CUSTOM[nodeName] = [type];
			else CUSTOM[nodeName].push(type);
			return CUSTOM[nodeName];
		},
		"addMethods": function addMethods(nodeName,methods) {
			var proto;
			if (!nodeName || nodeName === "*") proto = ELEM;
			else if (nodeName === "#document") proto = DOC;
			else if (nodeName === "#window") proto = WIN;
			else if (nodeName.contains(",")) {
				var nodeNames = nodeName.split(","), i = 0, l = nodeNames.length;
				for (;i<l;i++) addMethods(nodeNames[i],methods);
				return;
			} else proto = document.createElement(nodeName).constructor;
			return Pseudo.augment(proto,methods);
		},
		"addProperties": function addProperties(nodeName,properties) {
			// augment getters/setters?
		}
	};	
}).call(Pseudo);
Pseudo.DOM.addMethods("#document",{
	"element": function element(nodeName,attributes,handlers) {
		var name, elem = this.createElement(nodeName);
		elem.__pseudo = Pseudo.unique();
		if (attributes) for (name in attributes) elem.write(name,attributes[name]);
		if (handlers) for (name in handlers) elem.on(name,handlers[name]);
		return elem;
	}
});
Pseudo.DOM.addMethods("*",(function(){
	var	NOTBLANK = /[^\s]+/m,
		SLICE = Array.prototype.slice,
		READERS = this.HELPERS_READ_ATTRIBUTE = {
			"for": function() { return this.htmlFor },
			"class": function() { return this.className }
		},
		WRITERS = this.HELPERS_WRITE_ATTRIBUTE = {
			"for": function(value) { this.htmlFor = value },
			"class": function(value) { this.className = value },
			"innerHTML": function(value) { this.update(value) }
		},
		INNERHTML = this.HELPERS_INNERHTML = Pseudo.extend({},(function(){
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
		"amputate": function() { return this.parentNode.removeChild(this) },
		"append": function(value) {
			if (value instanceof Element || value instanceof DocumentFragment) {
				this.appendChild(value);
			} else if (value instanceof Array) {
				for (var i=0,l=value.length; i<l; i++) this.append(value[i]);
			} else {
				var	name = this.nodeName.toLowerCase(),
					nodes = [],
					helper = INNERHTML[name],
					container = document.createElement("div");
				if (helper) {
					container.innerHTML = helper[0] + value + helper[1];
					nodes.inject(container.getElementsByTagName(name)[0].childNodes);
				} else {
					container.innerHTML = value;
					nodes.inject(container.childNodes);
				};
				container.innerHTML = "";
				container = null;
				while (nodes.length) this.appendChild(nodes.shift());
			};
		},
		"clean": function(deep) {
			var i = this.childNodes.length, kid, type;
			while (i--) {
				kid = this.childNodes[i];
				if (kid.nodeType === 3 && !NOTBLANK.test(kid.textContent)) this.removeChild(kid);
				else if (kid.nodeType === 1 && deep) kid.clean(true);
			};
		},
		"clear": function() { while(this.lastChild) this.removeChild(this.lastChild) },
		"contains": document.compareDocumentPosition ? function(element) {
			return !!(this.compareDocumentPosition(element) & 16);
		} : function(element) {
			return this.query(element.nodeName).contains(element);
		},
		"copy": function(deep) {
			var element = this.cloneNode(false);
			element.__pseudo = Pseudo.unique();
			if (deep) element.append(this.innerHTML);
			return element;
		},
		"query": function(selector1,selector2,selectorN) {
			var selectors = SLICE.call(arguments,0).flatten().join(",");
			return Array.from(this[Pseudo.DOM.querySelectorAll](selectors));
		},
		"transplant": function(parent,before) { return parent.insertBefore(this.amputate(),before || null) },
		"up": Pseudo.DOM.matchesSelector ? function(selector1,selector2,selectorN) {
			var element = this.parentNode, selectors = SLICE.call(arguments,0).join(",");
			while (element instanceof Pseudo.DOM.Element) {
				if (!element.matchesSelector(selectors)) element = element.parentNode;
			};
			return element || undefined;
		} : function(selector1,selector2,selectorN) {
			var element = this.parentNode, parents = document.query(SLICE.call(arguments,0));
			while (element instanceof Pseudo.DOM.Element) {
				if (!parents.contains(element)) element = element.parentNode;
			};
			return element || undefined;
		},
		"update": function(value) {
			this.clear();
			this.append(value);
		},
		
		// attributes
		"coords": function(parent) {
			var top = 0, left = 0, element = this;
			if (!parent) parent = document.documentElement;
			while (element instanceof Pseudo.DOM.Element) {
				top += element.offsetTop;
				left += element.offsetLeft;
				element = element.offsetParent;
				if (element === parent) break;
			};
			return { "top": top, "left": left, "width": this.offsetWidth, "height": this.offsetHeight };
		},
		"isHidden": function() { return this.getStyle("display") === "none" },
		"read": function(name) { return READERS[name] ? READERS[name].call(this) : this.getAttribute(name) },
		"write": function(name,value) { return WRITERS[name] ? WRITERS[name].call(this,value) : this.setAttribute(name,value) },
		
		// style	;	hack in element.classList
		"hide": function() { this.style.display = "none" },
		"show": function() { this.style.display = "" },
		
		// clean-up
		"dispose": function() {
			this.off();
		//	delete this.__handlers;
			for (var prop in this) {
				if (prop === "__pseudo") continue;
				else if (prop.startsWith("__") || Object.className(prop) !== "String") delete this[prop];
			};
		}
	};
}).call(Pseudo.DOM));
Pseudo.DOM.addMethods("*",(function(){
	var	FILTER_STYLES = /\s*;\s*/gim,
		GETSTYLE = window.getComputedStyle ? GETSTYLE_COMPUTED : GETSTYLE_CURRENT,
		READERS = this.HELPERS_READ_STYLE = {},
		WRITERS = this.HELPERS_WRITER_STYLE = {};
	
	function GETSTYLE_COMPUTED(element,propertyName) {
		var style = window.getComputedStyle(element,null);
		return !style ? "" : style.getPropertyValue(propertyName.dasherize()) || "";
	};
	function GETSTYLE_CURRENT(element,propertyName) {
		var style = element.currentStyle;
		return !style ? "" : style[propertyName.camelize()] || "";
	};
	function STYLES_OBJECT(cssText) {
		var styles = {};
		cssText.split(PARSE_STYLE_FILTER).each(function(pair) {
			var	key = pair.substring(0,pair.indexOf(":")).trim(),
				value = pair.substring(key.length+1).trim();
			if (key) styles[key] = value;
		});
		return styles;
	};
	
	return {
		// returns array or object containing styles applied
		"getStyle": this.HELPERS_READ_ATTRIBUTE["style"] = function getStyle(property) {
			if (arguments.length > 1) property = Array.from(arguments);
			if (property instanceof Array) {
				var i = 0, l = property.length, results = new Array(property.length);
				for (;i<l; i++) results[i] = this.getStyle(arguments[i]);
				return results.flatten();
			} else if (Object.className(property) === "Object") {
				for (var name in property) property[name] = this.getStyle(name);
				return property;
			} else {
				
				
			};
		},
		// returns object containing styles applied
		"setStyle": this.HELPERS_WRITE_ATTRIBUTE["style"] = function setStyle(property,object) {
			if (Object.className(property) === "Object") {
				var results = {};
				for (var name in property) Pseudo.extend(results,this.setStyle(name,property[name]));
				return results;
			} else if (property.contains(";")) {
				return this.setStyle(STYLES_OBJECT(property));
			} else {
				var name = property.camelize(), value = String(object), results = {};
				if (!WRITERS[each]) results[name] = this.style[name] = value;
				else Pseudo.extend(results,WRITERS[name](this,object));
				return results;
			};
		}
	};
}).call(Pseudo.DOM));
Pseudo.DOM.addMethods("*,#document,#window",(function(){
	var	CUSTOM = this.CUSTOM_EVENTS,
		DOM = document.addEventListener ? true : false,
		EVENT_ON = DOM ? DOM_ON : MSIE_ON,
		EVENT_OFF = DOM ? DOM_OFF : MSIE_OFF,
		CLICK_WHICH = { "1": "left", "3": "right", "2": "middle" },
		CLICK_BUTTON = { "0": "left", "2": "right", "4": "middle" };
	
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
	function DOM_ON(element,type,handler,capture) {
		var pair = { "handler": handler, "capture": capture };
		element.__handlers[type].push(pair);
		element.addEventListener(type,pair.handler,pair.capture);
	};
	function DOM_OFF(element,type,handler,capture) {
		var	pair = { "handler": handler, "capture": capture },
			index = element.__handlers[type].filterIndex(HANDLER_FIND,pair);
		element.__handlers[type].removeAt(index);
		element.removeEventListener(type,pair.handler,pair.capture);
	};
	function MSIE_ON(element,type,handler) {
		var	handlers = element.__handlers[type],
			i = 0, l = handlers.length,
			pair = { "handler": handler, "capture": false, "wrapped": HANDLER_WRAP(element,type,handler) };
		if (CUSTOM[element.nodeName] && CUSTOM[element.nodeName].contains(type)) type = "dataavailable";
		for (;i<l;i++) element.detachEvent("on"+ type,handlers[i].wrapped);
		handlers.push(pair);
		for (;i>-1;i--) element.attachEvent("on"+ type,handlers[i].wrapped);
	};
	function MSIE_OFF(element,type,handler) {
		var	handlers = element.__handlers[type],
			pair = { "handler": handler, "capture": false },
			index = handlers.filterIndex(HANDLER_FIND,pair);
		if (CUSTOM[element.nodeName] && CUSTOM[element.nodeName].contains(type)) type = "dataavailable";
		pair = handlers[index];
		handlers.removeAt(index);
		element.detachEvent("on"+ type,pair.wrapped);
	};
	
	// extend the Event
	Pseudo.expand(window.Event.prototype,{
		"cancel": function cancel() {
			if (this.stopPropagation) this.stopPropagation();
			this.cancelBubble = true;
			this.__cancelled = true;
		},
		"click": function click() {
			var button = CLICK_WHICH[this.which] || CLICK_BUTTON[this.button];
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
		},
		"prevent": function prevent() {
			if (this.preventDefault) this.preventDefault();
			this.returnValue = false;
			this.__preventted = true;
		},
		"stop": function stop() {
			this.cancel();
			this.prevent();
		}
	});
	
	return {
		"on": function on(type,handler,capture) {
			if (handler instanceof Array) {
				for (var i=0,l=handler.length; i<l; i++) this.on(type,handler[i]);
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
			if (!arguments.length) {
				if (this.__handlers) for (type in this.__handlers) this.off(type);
			} else if (arguments.length === 1) {
				if (this.__handlers && this.__handlers[type] instanceof Array) this.off(type,this.__handlers[type].copy());
			} else if (handler instanceof Array) {
				for (var i=0,l=handler.length; i<l; i++) this.off(type,handler[i].handler);
			} else if (handler instanceof Function) {
				EVENT_OFF(this,type,handler,!!capture);
			} else {
				throw new TypeError();
			};
			return this;
		},
		"fire": DOM ? function DOM_FIRE(type,bubbles,cancelable) {
			var e = document.createEvent("Event");
			e.initEvent(type,!!bubbles,!!cancelable);
			this.dispatchEvent(e);
			return e;
		} : function MSIE_FIRE(type,bubbles) {
			var e = document.createEventObject();
			e.__type = type;
			e.bubbles = !!bubbles;
			this.fireEvent(CUSTOM[this.nodeName] && CUSTOM[this.nodeName].contains(type) ? "ondataavailable" : type,e);
			return e;
		},
		"has": function has(type,handler,capture) {
			return this.__handlers[type].filterIndex(HANDLER_FIND,{
				"handler": handler,
				"capture": !!capture && DOM
			}) > -1;
		}
	};
}).call(Pseudo.DOM));
if (Pseudo.Browser.IE && Pseudo.BrowserVersion < 9) {
	Pseudo.DOM.addEvent("#document","DOMContentLoaded");
	(function IEDOMContentLoaded(){
		try {
			document.documentElement.doScroll("left");
			document.fire("DOMContentLoaded");
		} catch(e) { setTimeout(IEDOMContentLoaded,1) };
	})();
};

/***********************
*** Ajax ***************
***********************/
var Ajax = (function(){
	var	DOM_XHR = XMLHttpRequest ? true : false,
		DOM_DOC = document.implementation && window.DOMParser && window.XMLSerializer ? true : false,
		XMLHTTP = DOM_XHR ? XMLHTTP_DOM : XMLHTTP_MSIE,
		DOCUMENT = DOM_DOC ? DOCUMENT_DOM : DOCUMENT_MSIE,
		MSIE_XHR = "",
		MSIE_XHRS = ["MSXML4.XMLHTTP","MSXML3.XMLHTTP","MSXML2.XMLHTTP","MSXML.XMLHTTP","Microsoft.XMLHTTP"],
		MSIE_DOC = "",
		MSIE_DOCS = ["MSXML4.DOMDocument","MSXML3.DOMDocument","MSXML2.DOMDocument","MSXML.DOMDocument","Microsoft.XMLDOM"],
		XML_PARSER = !DOM_DOC ? null : new DOMParser(),
		XML_SERIALIZER = !DOM_DOC ? null : new XMLSerializer();
	
	// ajax
	function XMLHTTP_DOM(ns,name) {
		return new XMLHttpRequest();
	};
	function XMLHTTP_MSIE(ns,name) {
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
	};
	
	// xml
	function DOCUMENT_DOM(ns,name) {
		return document.implementation.createDocument(ns, name, null);
	};
	function GETINNER_DOM(element) {
		var i = 0, c, childs = element.childNodes, inner = new Array(childs.length);
		for (; c=childs[i]; i++) inner[i] = XML_SERIALIZER.serializeToString(c);
		return inner.join("");
	};
	function SETINNER_DOM(element,innerXml) {
		while (element.hasChildNodes()) element.removeChild(element.lastChild);
		if (innerXml && innerXml.length) {
			var i = 0, n, nodes = XML_PARSER.parseFromString(innerXml,"text/xml");
			for (; n=nodes.childNodes[i]; i++) element.appendChild(element.ownerDocument.importNode(n,true));
		};
		return element;
	};
	
	function DOCUMENT_MSIE(ns,name) {
		var doc;
		if (MSXML_TYPE) {
			doc = new ActiveXObject(MSXML_TYPE);
		} else {
			for (var i=0; MSXML_TYPE=MSXML_TYPES[i]; i++) {
				try { doc = new ActiveXObject(x) } catch(e) {};
				if (doc) break;
			};
		};
		doc.async = false;
		if (name) doc.loadXML(!ns ? "<"+ name +" />" : "<a0:"+ name +" xmlns:a0=\""+ ns +"\" />");
		return doc;
	};
	function GETINNER_MSIE(element) {
		return element.xml;
	};
	function SETINNER_MSIE(element,innerXml) {
		element.loadXML(innerXml || "");
		return element;
	};
	
	// extendered
	function getStatus(xhr) {
		var status = { "code": 0, "text": "", "body": "" };
		try {
			status.code = xhr.status;
			status.text = xhr.statusText;
			status.body = xhr.responseText;
		} catch(x) {};
		return status;
	};
	function getResponseSize(xhr) {
		var content = "";
		try { content = xhr.getResponseHeader("Content-Length") } catch(x) {};
		return parseInt(content);
	};
	
	return this.Ajax = {
		"Headers": {
		//	"Accept": "text/javascript, text/html, application/xml, text/xml, */*",
			"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
			"X-Requested-With": "XMLHttpRequest", "X-Pseudo-Version": Pseudo.version
		},
		"transport": XMLHTTP,
		"doc": function doc(namespaceURI,documentElementName,contents) {
			var xml = DOCUMENT(ns || "", name || "", null);
			if (contents) {
				if (contents instanceof Element) {
					
				} else {
					
				};
			};
			return xml;
		},
		
		"getStatus": getStatus,
		"getResponseSize": getResponseSize,
		"getProgress": function getProgress(xhr) {
			if (xhr.readyState === 4) return 1;
			var percent = 0, size = getResponseSize(xhr) || 0;
			if (size > 0) percent = (getStatus(xhr).body.length / size) * 0.85;
			return percent + (0.05 * xhr.readyState);
		},
		"isResponseOK": function isResponseOK(xhr) {
			var code = getStatus(xhr).code;
			return !!(code >= 200 && code <= 206 || code === 304);
		}
	};	
}).call(Pseudo);
Pseudo.Ajax.Request = Class.create(null,{
	// properties go here
},{
	"constructor": function(url,data,options,callbacks,headers) {
		this.__xhr = Ajax.transport();
		this.__doc = Ajax.doc();
		this.__callback = this.constructor.callback.bind(this);
		options = Object.extend(options||{},this.constructor.defaults);
		
		this.url = String(url);
		this.data = String(data);
		this.sync = !!options.sync;
		this.method = !options.method ? "AUTO" : String(options.method).toUpperCase();
		this.headers = Pseudo.expand(headers||{},Pseudo.Ajax.Headers);
		
		if (callbacks) for (var each in callbacks) this.on(each,callbacks[each]);
		if (options.autofire) this.load();
	},
	"dispose": function($super) {
		this.cancel();
		return $super();
	},
	"cancel": function() {
		// Firefox raises readystatechange event when the transport is aborted
		try { this.__xhr.onreadystatechange = Pseudo.um } catch(x) {};
		try { this.__xhr.abort() } catch(x) {};	// can be null when leaving page
	},
	"load": function(force) {
		var loaded = !force ? Ajax.getProgress(this.__xhr) : 1;
		if (loaded !== 1 && loaded !== 0) {
			this.cancel();
			loaded = 1;
		};
		if (loaded === 1 || loaded === 0) {
			var event = this.fire("before",{ "transport": this.__xhr });
			if (event.stopped) return;
			
			this.__runSyncAfter = !!this.sync;
			for (var each in this.headers) this.__xhr.setRequestHeader(each,this.headers[each]);
			this.__xhr.onreadystatechange = this.__callback;
			this.__xhr.open(this.method,this.url,!this.sync);
			try { this.__xhr.send(this.data) }
			catch(x) { /* IE require the .send() for sync requests, Chrome/Safari throw error */ };
			if (this.__runSyncAfter) this.__callback();
			
			return true;
		};
		return false;
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
		if (this.__xhr.readyState >= 3) {
			this.fire("loading",{
				"progress": Ajax.getProgress(this.__xhr),
				"status": Ajax.getStatus(this.__xhr)
			});
		} else if (this.__xhr.readyState === 4) {
			this.__runSyncAfter = false;
			var ok = Ajax.isResponseOK(this.__xhr);
			Ajax.setInnerXml(this.__doc,ok ? this.__xhr.responseText : "");
			this.fire("loaded",{
				"xml": this.__doc.documentElement || null,
				"text": this.__xhr.responseText,
				"status": Ajax.getStatus(this.__xhr)
			});
		//	if (Pseudo.Ajax.METHOD === "MS") Ajax.Request.cancel(this.__xhr);	// IE6 memleak
			this.fire.defer(this,"ready");
		};
	}
});