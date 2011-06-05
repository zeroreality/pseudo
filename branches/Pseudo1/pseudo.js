/* ---------------------------------------------------------------------------
 *  Pseudo JavaScript framework, version 1.2
 *  (c) 2009 Alex Lein
 *
 *  Pseudo is based heavily on the awesome
 *  Prototype JavaScript framework (c) 2005-2009 Sam Stephenson
 *
 *  Pseudo is freely distributable under the terms of an MIT-style license.
 *  For details, see http://www.opensource.org/licenses/mit-license.php
 *--------------------------------------------------------------------------*/
var Pseudo = (function(){
	var	VERSION = "1.2",
		DOCUMENT_HEAD,
		DOCUMENT_WRITE = true,
		prefix,
		incremental = 1,
		uniq = 0,
		seed = String(new Date().valueOf());
	
	try { prefix = document.location.toString().match(/[a-z0-9]/gim) }
	catch(x) { prefix = String(Math.random()).substring(2).split("") };
	for (var i=0,l=prefix.length,v=0; i<l; i++) if (v=parseInt(prefix[i],36)) uniq += v;
	uniq = uniq.toString(36);
	seed = parseInt(seed.substring(seed.length-3));
	
	// utility methods
	function addScript(source,callback) {
	//	if (!DOCUMENT_WRITE) {
			if (!DOCUMENT_HEAD) DOCUMENT_HEAD = document.getElementsByTagName("head")[0];
			if (!DOCUMENT_HEAD) DOCUMENT_HEAD = document.documentElement.insertBefore(document.createElement("head"),document.documentElement.firstChild);
			var file = document.createElement("script");
			file.type = "text/javascript";
		//	file.async = false;
		//	file.defer = false;
			if (callback) {
				if (!Pseudo.Browser.IE || Pseudo.BrowserVersionNumber > 8) file.onload = callback;
				else file.onreadystatechange = function() {
					if (this.readyState === "loaded" || this.readyState === "complete") {
						this.onreadystatechange = null;
						callback.call(this);
					};
				};
			};
			file.setAttribute("src",source);
			DOCUMENT_HEAD.appendChild(file);
	/*	} else {
			var length = document.getElementsByTagName("script").length;
			document.write([
				"<","script ",
				"src=\"",source,"\"",
				"type=\"text/javascript\" ",
				"></","script",">"
			].join(""));
			if (callback) callback.call(document.getElementsByTagName("script")[length]);
		};
	*/
	};
	function addStyleSheet(source,media,unique) {
		if (!DOCUMENT_HEAD) DOCUMENT_HEAD = document.getElementsByTagName("head")[0];
		if (unique) {
			var sheet = $A(document.getElementsByTagName("link")).find(function(file) {
				return file.getAttribute("href").startsWith(source);
			});
			sheet.amputate();
		};
		if (DOCUMENT_HEAD) {
			var file = DOCUMENT_HEAD.appendChild(document.createElement("link"));
			file.setAttribute("rel","stylesheet");
			file.setAttribute("type","text/css");
			if (media) file.setAttribute("media",media);
			file.setAttribute("href",source);
		} else {
			var length = document.getElementsByTagName("link").length;
			document.write([
				"<","link ",
				"href=\"",source,"\" ",
				!media ? "" : "media=\"",media,"\" ",
				"rel=\"stylesheet\" ",
				"type=\"text/css\" ",
				"/>"
			].join(""));
		};
	};
	function unmolested(x) { return x };
	function unique() { return incremental++ };
	function guid() {
		var	incr = (incremental++).toString(36),
			rand = Math.random().toString(36).substring(2),
			date = new Date().valueOf().toString(36);
		if (uniq.length < 4) uniq = (uniq + date).left(4);
		if (incr.length < 6) incr = (incr + rand).left(6);
		if (rand.length < 12) rand = (rand + date).left(12);
		
		return [
			uniq,
			date.reverse(),
			incr,
			rand
		].join("").left(30).divide(6).join("-");
	};
	function obfuscate(string) {
		var result = [], encodable = escape(string).split(/[^a-z0-9]/gim).join("").divide(10);
		for (var i=0,l=encodable.length; i<l; i++) result.push(parseFloat("0."+parseInt(encodable[i],36)+seed).toString(36).substring(2));
		return result.join("");
	};
	
	return {
		"INCLUDED_MODULES": [],
		"DOCUMENT_WRITE": DOCUMENT_WRITE,
		"Version": VERSION,
		"VersionNumber": parseFloat(VERSION),
		
		"um": unmolested,
		"obfuscate": obfuscate,
		"unique": unique,
		"guid": guid,
		"addScript": addScript,
		"addStyleSheet": addStyleSheet
	};
})();

/*****************************************************************************
*** Browser ******************************************************************
*****************************************************************************/
(function(){
	var	isIE = /*@cc_on!@*/!1,
		isO = isIE ? false : Object.prototype.toString.call(window.opera) === "[object Opera]",
		VERSION_STRIPPER = /[^a-z0-9]/gi,
		VERSION_PARSER = function(version) {
			if (version.indexOf(".") < 0) return parseFloat(version);
			else return parseFloat(version.substring(0,version.indexOf(".")+1) + version.substring(version.indexOf(".")+1).replace(VERSION_STRIPPER,""));
		};
	
	this.BrowserPatterns = {
		"Trident": /^Mozilla.+(?:MSIE\s([0-9\.a-z]+)).*?(?:Trident.([0-9\.a-z]+))?/i,
		"Presto": /^Opera\/9\.80\s*\(.*Presto\/([0-9\.a-z]+).*Version\/([0-9\.a-z]+)|^Mozilla.+Opera\s([0-9\.a-z]+)$|^Opera\/([0-9\.a-z]+)/i,
		"Gecko": /^Mozilla\/5\.0\s*\(.*?rv\:([0-9\.a-z]+).*Gecko\/([0-9\.a-z]+)\s([a-z]+)\/([0-9\.a-z]+)/i,
		"Webkit": /^Mozilla\/5\.0\s*\((?:(PlayBook|iPad|iPhone|iPod);)*.*AppleWebKit\/([0-9a-z\.\+]+).*?(?:([a-z0-9\-]+)\/([0-9\.a-z]+)\s)*?(?:(Mobile)\s)?Safari\/([0-9\.a-z]+)/i,
		"KHTML": /^Mozilla\/5\.0\s*\(.*Konqueror\/([0-9\.a-z]+).*KHTML\/([0-9\.a-z]+).*like/i
	};
	this.Browser = {
		"Firefox": false,
		"Mozilla": false,
		"Konqueror": false,
		"Opera": false,
		"IE": false,
		"Chrome": false,
		"Mobile": false,
		"Safari": false
	};
	this.BrowserName = "";
	this.BrowserVersion = "";
	this.BrowserVersionNumber = 0;
	
	this.Engine = {};
	this.EngineName = "";
	this.EngineVersion = "";
	this.EngineVersionNumber = 0;
	
	this.detect = function() {
		// reset
		delete this.Browser["Mobile"];
		for (var each in this.Browser) this.Browser[each] = false;
		for (var each in this.BrowserPatterns) this.Engine[each] = false;
		for (var each in this.Engine) this.Engine[each] = false;
		
		var matches, ua = navigator.userAgent;
		if (isIE) {
			this.BrowserName = "IE";
			this.EngineName = "Trident";
			
			matches = ua.match(this.BrowserPatterns[this.EngineName]);
			this.BrowserVersion = matches[1];
			this.EngineVersion = matches[2] || "4.0";
		//	ev = [ScriptEngineMajorVersion(),ScriptEngineMinorVersion(),ScriptEngineBuildVersion()].join(".");
		} else if (isO) {
			this.BrowserName = "Opera";
			this.EngineName = "Presto";
			
			matches = ua.match(this.BrowserPatterns[this.EngineName]);
			this.BrowserVersion = opera.version() || matches[2] || matches[3] || matches[4] || "";
			this.EngineVersion = matches[1] || "";
		} else {
			for (var each in this.BrowserPatterns) {
				this.Engine[each] = false;
				if (each === "Trident" || each === "Presto") continue;
				matches = ua.match(this.BrowserPatterns[each]);
				if (matches && matches[0]) {
					this.EngineName = each;
					if (each === "Gecko") {
						this.BrowserName = matches[3];
						this.BrowserVersion = matches[4];
						this.EngineVersion = matches[1];	//matches[2];
					} else if (each === "Webkit") {
						this.BrowserName = matches[1] || matches[5] || matches[3];
						this.BrowserVersion = matches[4] || matches[6] || matches[2];
						this.EngineVersion = matches[2] || matches[6];
						if (this.BrowserName === "Version") this.BrowserName = "Safari"
					//	if (matches[1]) this.Browser[matches[1]] = true;	// iPad/iPhone/iPod browsers are special
					} else if (each === "KHTML") {
						this.BrowserName = "Konqueror";
						this.BrowserVersion = matches[1];
						this.EngineVersion = matches[2];
					};
				};
			};
		};
		this.Browser[this.BrowserName] = this.Engine[this.EngineName] = true;
		this.BrowserVersionNumber = VERSION_PARSER(this.BrowserVersion);
		this.EngineVersionNumber = VERSION_PARSER(this.EngineVersion);
		switch (this.BrowserName) {
			case "iPad":
			case "iPod":
			case "iPhone":
			case "PlayBook": this.Browser["Mobile"] = true;
		};
	};
	this.detect();
}).call(Pseudo);

/*****************************************************************************
*** Object *******************************************************************
*****************************************************************************/
(function(){
	var	slice = Array.prototype.slice,
//		ARRAY_NATIVE = /function\sNativeArray\(/,
		CLASS_GETTER = Object.prototype.toString,
		CLASS_FILTER = /^\[object\s(.*)\]$/,
		FUNCTION_ANON = /function\s*(?:anonymous)*\s*\(/m,
		FUNCTION_NATIVE = /function.*\{[\n\r\f\t\s]+\[native\scode\]/m,
		PROTO_NATIVE = typeof "native __proto__ reference".__proto__ === "object";
	
	function extend(destination/*,sources*/) {
		var sources = slice.call(arguments,1);
		for (var i=0,l=sources.length; i<l; i++) {
			if (!sources[i]) continue;
			for (var property in sources[i]) destination[property] = sources[i][property];
		};
		return destination;
	};
	function expand(destination/*,sources*/) {
		var sources = slice.call(arguments,1);
		for (var i=0,l=sources.length; i<l; i++) {
			if (!sources[i]) continue;
			for (var property in sources[i]) if (!(property in destination)) destination[property] = sources[i][property];
		};
		return destination;
	};
	function each(object,iterator,scope) {
		if (!scope) scope = object;
		var index = 0;
		for (var name in object) iterator.call(scope,object[name],name,object,index++);
		return object;
	};
	function keys(object) {
		var results = [];
		for (var each in object) results.push(each);
		return results;
	};
	function values(object) {
		var results = [];
		for (var each in object) results.push(object[each]);
		return results;
	};
	
	function getClass(object) {
		var type = CLASS_GETTER.call(object).match(CLASS_FILTER)[1];
		if (type === "Window") {
			if (object === undefined) type = "undefined";
			else if (object === null) type = "null";
		};
		return type;
	};
	function getPrototypeOf(object) {
		if (PROTO_NATIVE) return object.__proto__;
		else return object.constructor && object.constructor.prototype || null;
	};
	function clone(object) { return extend({},object) };
	function recursive(object,property,levels) {
		var result = [];
		levels = String(levels).toNumber() || 20;
		while (object = object[property]) {
			result.push(object);
			if (--levels < 0) break;
		};
		return result;
	};
	function prototypeChain(object) {
		var chain = [], prev, proto = isNullOrUndefined(object) ? null : Object.getPrototypeOf(object);
		while (proto) {
			chain.push(proto);
			prev = proto;
			proto = Object.getPrototypeOf(proto);
			if (prev === proto) break;
		};
		return chain;
	};
	function inspect(object,maximum,depth,trunc) {
		maximum = String(maximum).toNumber() || 10;
		depth = String(depth).toNumber() || 5;
		trunc = String(trunc).toNumber() || 30;
		
		if (isUndefined(object)) return "undefined";
		else if (isNull(object)) return "null";
		else if (isWindow(object)) return "{Window name=\""+ object.name +"\"}";
		else if (isDocument(object)) return "{Document href=\""+ object.location.toString() +"\"}";
		else if (isElement(object)) return "<"+ object.tagName.toLowerCase() +" id=\""+ object.id +"\" />";
		else if (isString(object)) return "\""+ object.truncate(trunc,"...",true) +"\"";
		else if (isRegExp(object)) return object.toSource();
		else if (isFunction(object)) {
			var name = object.toString();
			if (object.isNative()) return name.substring(0,name.indexOf("{")) +"{ [native code] }";
			if (object.isAnonymous()) name = "function anonymous"+ name.substring(name.indexOf("("));
			return name.substring(0,name.indexOf("{")) +"{ [foreign code] }";
		} else if (isArray(object) || isArguments(object)) {
			if (depth <= 0) return " !too deep! ";
			var i = 0, inspected = ["["];
			if (isArguments(object)) {
				inspected.push("\u00abcallee ");
				inspected.push(inspect(object.callee,maximum,depth-1,trunc).substring(9));
				inspected.push("\u00bb ");
			};
			for (i=0,l=object.length>maximum ? maximum : object.length; i<l; i++) {
				inspected.push(inspect(object[i],maximum,depth-1,trunc));
				inspected.push(", ");
			};
			if (i > 0) inspected.pop();
			if (object.length > i) {
				inspected.push(", \u00ab");
				inspected.push(object.length - i);
				inspected.push(" more...\u00bb");
			};
			inspected.push("]");
			return inspected.join("");
		} else if (typeof object === "object") {
			if (depth <= 0) return " !too deep! ";
			var i = 0, count = 0, inspected = ["{"];
			for (var each in object) {
				if (maximum <= i++) {
					count++;
				} else {
					inspected.push("\"");
					inspected.push(each);
					inspected.push("\": ");
					try { inspected.push(inspect(object[each],maximum,depth-1,trunc)) }
					catch(x) { inspected.push("ERROR: "+ x.message) };
					inspected.push(",\n");
				};
			};
			if (i > 0) inspected.pop();
			if (maximum < i) {
				inspected.push(",\u00ab");
				inspected.push(count);
				inspected.push(" more...\u00bb");
			};
			inspected.push("}");
			return inspected.join("");
		} else {
			// isNumber(object) isDate(object)
			return String(object);
		};
	};
	
	function isUndefined(object) { return typeof object === "undefined" };
	function isNull(object) { return object === null };
	function isNullOrUndefined(object) { return isNull(object) || isUndefined(object) };
	function isWindow(object) { return !!object && CLASS_GETTER.call(object) === "[object Window]" };
	function isDocument(object) { return !!(object && (object.nodeType === 9 || object.nodeType === 11)) };
	function isElement(object) { return !!(object && object.nodeType === 1 && object.nodeName !== "!") };
	function isTextNode(object) { return !!(object && object.nodeType === 3) };
	function isObject(object) { return !!object && CLASS_GETTER.call(object) === "[object Object]" };
	function isBoolean(object) { return CLASS_GETTER.call(object) === "[object Boolean]" };
	function isFunction(object) { return typeof object === "function" || CLASS_GETTER.call(object) === "[object Function]" };
	function isArguments(object) { return isObject(object) && !isNaN(object.length) && isFunction(object.callee) };
	function isString(object) { return CLASS_GETTER.call(object) === "[object String]" };
	function isNumber(object) { return CLASS_GETTER.call(object) === "[object Number]" };
	function isDate(object) { return CLASS_GETTER.call(object) === "[object Date]" };
	function isArray(object) { return !!object && (object instanceof Array) || CLASS_GETTER.call(object) === "[object Array]" };	// secondary check for NativeArray from Class.create(Array,...)
	function isRegExp(object) { return CLASS_GETTER.call(object) === "[object RegExp]" };
	
	expand(Object,this.Object = {
//		"ARRAY_NATIVE": ARRAY_NATIVE,
		"CLASS_GETTER": CLASS_GETTER,
		"CLASS_FILTER": CLASS_FILTER,
		"FUNCTION_ANON": FUNCTION_ANON,
		"FUNCTION_NATIVE": FUNCTION_NATIVE,
		"PROTO_NATIVE": PROTO_NATIVE,
		
		"expand": expand,
		"extend": extend,
		"keys": keys,
		"values": values,
		"each": each,
		
		"clone": clone,
		"inspect": inspect,
		"recursive": recursive,
		"prototypeChain": prototypeChain,
		
		"getClass": getClass,
		"getPrototypeOf": getPrototypeOf,
		"isArguments": isArguments,
		"isArray": isArray,
		"isBoolean": isBoolean,
		"isDate": isDate,
		"isDocument": isDocument,
		"isElement": isElement,
		"isTextNode": isTextNode,
		"isText": isTextNode,
		"isFunction": isFunction,
		"isNull": isNull,
		"isNullOrUndefined": isNullOrUndefined,
		"isNothing": isNullOrUndefined,
		"isNumber": isNumber,
		"isObject": isObject,
		"isRegExp": isRegExp,
		"isString": isString,
		"isUndefined": isUndefined,
		"isWindow": isWindow
	});
}).call(Pseudo);

/*****************************************************************************
*** Function *****************************************************************
*****************************************************************************/
Object.expand(Function,(function(){
	function overload(object,methodName,replacement) {
		var original = object[methodName];
		return object[methodName] = replacement.bundle(original);
	};
	
	return this.Function = {
		"overload": overload
	};
}).call(Pseudo));
Object.expand(Function.prototype,(function(){
	var	slice = Array.prototype.slice,
		ANONYMOUS_FILTER = this.ANONYMOUS_FILTER = /^function\s*\(/,
		NATIVE_FILTER = this.NATIVE_FILTER = /^function[^\{]*\{\s*\[native\scode\]\s*\}$/m,
		ARGUMENTS_SPLITTER = this.ARGUMENTS_SPLITTER = /\s*,\s*/gm;
	
	function argumentNames() {
		var method = this.toString();
		method = method.substring(method.indexOf("(")+1,method.indexOf(")")).replace(ARGUMENTS_SPLITTER,",");
		return method.length ? method.split(",") : [];
	};
	function scopeChain() {
		return Object.recursive(arguments,"caller");
	};
	function isNative() {
		return NATIVE_FILTER.test(this.toString());
	};
	function isAnonymous() {
		return ANONYMOUS_FILTER.test(this.toString());
	};
	
	function delay(options/*,arg1,arg2,argN*/) {
		var method = this, args = slice.call(arguments,1), context = { "scope": window, "timeout": 1 };
		if (Object.isNumber(options)) context.timeout = options;
		else if (options) Object.extend(context,options);
		return window.setTimeout(function() { return method.apply(context.scope,args) },context.timeout);
	};
	function defer(scope/*,arg1,arg2,argN*/) {
		return this.delay.apply(this,[{ "scope": scope }].inject(slice.call(arguments,1)));
	};
	
	function wrap(scope) {
		var method = this;
		function wrapped() { return scope.apply(this,[method.bind(this)].concat(slice.call(arguments,0))) };
		wrapped.__method = method;
		wrapped.__scope = scope;
		return wrapped;
	};
	function bind(scope/*,arg1,arg2,argN*/) {
		if (!arguments.length) return this;
		var method = this, args = slice.call(arguments,1);
		function bound() { return method.apply(scope,args.concat(slice.call(arguments,0))) };
		bound.__method = method;
		bound.__scope = scope;
		return bound;
	};
	function bundle(/*arg1,arg2,argN*/) {
		if (!arguments.length) return this;
		var method = this, args = slice.call(arguments,0);
		function bundled() { return method.apply(this,args.concat(slice.call(arguments,0))) };
		bundled.__method = method;
		return bundled;
	};
	function methodize() {
		if (this.__methodized) return this.__methodized;
		var method = this;
		function methodized() { return method.apply(null,[this].concat(slice.call(arguments,0))) };
		methodized.__method = method;
		return this.__methodized = methodized;
	};
	
	return this.Prototypes = {
		"argumentNames": argumentNames,
		"scopeChain": scopeChain,
		"isAnonymous": isAnonymous,
		"isNative": isNative,
		
		"defer": defer,
		"delay": delay,
		
		"bind": bind,
		"bundle": bundle,
		"methodize": methodize,
		"wrap": wrap
	};
}).call(Pseudo.Function));

/*****************************************************************************
*** Array ********************************************************************
*****************************************************************************/
Object.expand(Array,(function(){
	var	slice = Array.prototype.slice,
		concat = Array.prototype.concat,
		SPLIT_WHITESPACE = /\s+/g,
		SORT_FUZZY = /[a-z]+|-?[.0-9]+/gim,
		SORT_IS_NUMERIC = /[.0-9]/,
		SORT_IS_ALPHABETIC = /[a-z]/i;
	
	var SLICES_AND_DICES = (function(){
		var isBuggy = false,col1,col2;
		try {
			col1 = document.getElementsByTagName(document.documentElement.tagName);
			col2 = slice.call(col1,0);
			if (col1 === col2 || col1.length !== col2.length) isBuggy = true;
		} catch(x) {
			isBuggy = true;
		} finally {
			col1 = col2 = null;
		};
		return !isBuggy;
	})();
	
	function concatenate(object) {
		return concat.call(this,Object.isArguments(object) ? slice.call(object,0) : object);
	};
	
	// cloning
	function from(object) {
		if (!object) return [];
	//	if (Object.isArray(object)) return object;
		if ("toArray" in Object(object)) return object.toArray();
		if (SLICES_AND_DICES) return slice.call(object);
		var length = object.length || 0, results = new Array(length);
		while (length--) results[length] = object[length];
		return results;
	};
	function fromWhitespace(string) {
		if (!string) return [];
		return String(string).split(SPLIT_WHITESPACE);
	};
	
	// sorting
	function fuzzy(a,b) {
		a = String(a).toLowerCase();
		b = String(b).toLowerCase();
		
		if (a === b) return 0;	// in the case of equal strings
		var aString = a.separate(SORT_FUZZY);
		if (!aString.length) return !b.length ? 0 : -1;
		var bString = b.separate(SORT_FUZZY);
		if (!bString.length) return 1;
		
		for (var i=0,l=aString.length; i<l; i++) {
			if (bString[i] === undefined) return 1;
			
			var aIsNum = SORT_IS_NUMERIC.test(aString[i]), aIsAlpha = SORT_IS_ALPHABETIC.test(aString[i]);
			var bIsNum = SORT_IS_NUMERIC.test(bString[i]), bIsAlpha = SORT_IS_ALPHABETIC.test(bString[i]);
			
			if (!aIsNum && !bIsNum && !aIsAlpha && !bIsAlpha) {
				if (aString[i] > bString[i]) return 1;
				else if (aString[i] < bString[i]) return -1;
			} else if (aIsNum && !bIsNum) {
				return 1;
			} else if (!aIsNum && bIsNum) {
				return -1;
			} else if (aIsNum && bIsNum) {
				var aNumber = aString[i].toNumber();
				var bNumber = bString[i].toNumber();
				if (aNumber > bNumber) return 1;
				else if (aNumber < bNumber) return -1;
			} else if (aIsAlpha && !bIsAlpha) {
				return -1;
			} else if (!aIsAlpha && bIsAlpha) {
				return 1;
			} else if (aIsAlpha && bIsAlpha) {
				if (aString[i] > bString[i]) return 1;
				else if (aString[i] < bString[i]) return -1;
			};
		};
		return 0;	// catch-all
	};
	function randomize() {
		var variation = this.length || 5;
		return Math.random().betweenRange(variation,-variation).round();
	};
	
	return this.Array = {
		"SLICES_AND_DICES": SLICES_AND_DICES,
		
		"concat": concatenate,
		"from": from,
		"fromWhitespace": fromWhitespace,
		"fuzzy": fuzzy,
		"randomize": randomize
	};
}).call(Pseudo));
Object.expand(Array.prototype,(function(){
	var	slice = Array.prototype.slice,
		TRIM_DEFAULT = function(item) { return !item },
		TRIM_ITERATOR = function(object) {
			if (Object.isUndefined(object)) return TRIM_DEFAULT;
			else if (Object.isFunction(object)) return object;
			else return function(item) { return object === item };
		};
	
	// fill-ins
	function PUSH(object) {
		this[this.length] = object;
	};
	function FOREACH(iterator,scope) {
		for (var i=0,l=this.length; i<l; i++) iterator.call(scope,this[i],i);
	};
	function INDEXOF(object,from) {
		if (isNaN(from)) from = 0;
		for (var l=this.length; from<l; from++) if (from in this && object === this[from]) return from;
		return -1;
	};
	function LASTINDEXOF(object,from) {
		if (isNaN(from)) from = this.length;
		else if (from < 0) from  = 0;
		do { if (from in this && object === this[from]) return from } while (from--);
		return -1;
	};
	
	// iteration
	function each(iterator,scope) {
		if (Object.isNothing(scope)) scope = this;
		this.forEach(function(item,index) { iterator.call(scope,item,index,this) },this);
		return this;
	};
	function gather(propertyName) {
		var result = [];
		for (var i=0,l=this.length; i<l; i++) result.push(this[i][propertyName]);
		return result;
	};
	function plant(propertyName,value) {
		for (var i=0,l=this.length; i<l; i++) this[i][propertyName] = value;
		return this;
	};
	function invoke(methodName/*,arg1,arg2,argN*/) {
		var result = [], args = slice.call(arguments,1);
		if (Object.isFunction(methodName)) {
			for (var i=0,l=this.length; i<l; i++) result.push(methodName.apply(this[i],args));
		} else {
			for (var i=0,l=this.length; i<l; i++) result.push(this[i][methodName].apply(this[i],args));
		};
		return result;
	};
	function examine(method/*,arg1,arg2,argN*/) {
		var result = [], args = [null,-1,this].concat(slice.call(arguments,1));
		for (var i=0,l=this.length; i<l; i++) {
			args.splice(0,2,this[i],i);
			result.push(method.apply(this,args));
		};
		return result;
	};
	
	// comparison
/*
	function contains(/*item1,item2,...,itemN*) {
		if (!this.length) return false;
		var items = slice.call(arguments,0);
		if (items.length) {
			for (var i=0,l=this.length; i<l; i++) {
				for (var j=0,c=this.length; j<c; j++) {
					if (this[i] === items[j]) return true;
				};
			};
		};
		return false;
	};
*/
	function contains(item) {
		for (var i=0,l=this.length; i<l; i++) if (this[i] === item) return true;
		return false;
	};
	function max(iterator,scope) {
		if (!iterator) iterator = Pseudo.um;
		if (!scope) scope = this;
		var	item,
			index = 0,
			maximum = iterator.call(scope,this[0],0,this);
		for (var i=1,l=this.length; i<l; i++) {
			item = iterator.call(scope,this[i],i,this);
			if (item > maximum) {
				maximum = item;
				index = i;
			};
		};
		return this[index];
	};
	function min(iterator,scope) {
		if (!iterator) iterator = Pseudo.um;
		if (!scope) scope = this;
		var	item,
			index = 0,
			minimum = iterator.call(scope,this[0],0,this);
		for (var i=1,l=this.length; i<l; i++) {
			item = iterator.call(scope,this[i],i,this);
			if (item < minimum) {
				minimum = item;
				index = i;
			};
		};
		return this[index];
	};
	function any(iterator,scope) {
		if (!scope) scope = this;
		for (var i=0,l=this.length; i<l; i++) {
			if (iterator.call(scope,this[i],i,this)) return true;
		};
		return false;
	};
	function none(iterator,scope) {
		return !this.any(iterator,scope);
	};
	function every(iterator,scope) {
		if (!scope) scope = this;
		for (var i=0,l=this.length; i<l; i++) {
			if (!iterator.call(scope,this[i],i,this)) return false;
		};
		return true;
	};
	function find(iterator,scope) {
		if (!scope) scope = this;
		for (var i=0,l=this.length; i<l; i++) {
			if (iterator.call(scope,this[i],i,this)) return this[i];
		};
	};
	function findAll(iterator,scope) {
		if (!scope) scope = this;
		var result = [];
		for (var i=0,l=this.length; i<l; i++) {
			if (iterator.call(scope,this[i],i,this)) result.push(this[i]);
		};
		return result;
	};
	function findIndex(iterator,scope) {
		if (!scope) scope = this;
		for (var i=0,l=this.length; i<l; i++) {
			if (iterator.call(scope,this[i],i,this)) return i;
		};
	};
	function findAllIndex(iterator,scope) {
		if (!scope) scope = this;
		var result = [];
		for (var i=0,l=this.length; i<l; i++) {
			if (iterator.call(scope,this[i],i,this)) result.push(i);
		};
		return result;
	};
	function groupCount(iterator,scope) {
		if (!scope) scope = this;
		if (!iterator) iterator = String;
		var result = {};
		for (var i=0,l=this.length; i<l; i++) {
			var value = iterator.call(scope,this[i],i,this);
			if (!result[value]) result[value] = 0;
			result[value]++;
		};
		return result;
	};
	function left(length/*,opposite*/) {
		var results = new Array(length > this.length ? this.length : length);
		for (var i=0,l=results.length; i<l; i++) results[i] = this[i];
		return results;
	};
	function right(length/*,opposite*/) {
		var results = new Array(length > this.length ? this.length : length), offset = this.length - results.length;
		for (var i=0,l=results.length; i<l; i++) results[i] = this[i+offset];
		return results;
	};

	// getters
	function first() { return this[0] };
	function last() { return this[this.length-1] };
	
	// modifiers: self-inflicted
	function sum() {
		var result = 0;
		for (var i=0,l=this.length; i<l; i++) {
			result += this[i] && this[i].toNumber ? this[i].toNumber() : String(this[i]).toNumber();
		};
		return result;
	};
	function unique() {
		var found, result = [];
		for (var i=0,l=this.length; i<l; i++) {
			found = false;
			for (var j=i+1,n=this.length; j<n; j++) if (found = this[i] === this[j]) break;
			if (!found) result.push(this[i]);
		};
		return result;
	};
	function duplicates() {
		var found, result = [];
		for (var i=0,l=this.length; i<l; i++) {
			found = false;
			for (var j=i+1,n=this.length; j<n; j++) if (found = this[i] === this[j]) break;
			if (found) result.push(this[i]);
		};
		return result;
	};
	function flatten() {
		var result = [];
		for (var i=0,l=this.length; i<l; i++) {
			if (!Object.isArray(this[i],true)) result.push(this[i]);
			else result.inject(this[i].flatten());
		};
		return result;
	};
	function reverse() {
		var i = this.length, reverse = new Array(i);
		while (--i) { reverse[i] = this[i] };
		return reverse;
	};
	function randomize() {
		if (!this.__randomizer) this.__randomizer = Array.randomize.bind(this);
		this.sort(this.__randomizer);
		return this;
	};
	function order() {
		var result = [];
	//	non-bubble sort based dragons!
		return result;
	};
	
	
	// modifiers: assaults
	function select(startIndex,endIndex) {
		var result = [], last = this.length - 1;
		if (isNaN(endIndex) || endIndex > last) endIndex = last;
		for (var i=startIndex,l=endIndex+1; i<l; i++) result.push(this[i]);
		return result;
	};
	function divide(length) {
		if (length > this.length) return this.copy();
		var result = new Array(Math.ceil(this.length/length));
		for (var i=0,l=result.length; i<l; i++) result.push(this.select(i,length));
		return result;
	};
	
	// cloning
	function copy() {
		var result = new Array(this.length);
		for (var i=0,l=this.length; i<l; i++) result[i] = this[i];
		return result;
	};
	
	// inserting
	function insert(item,index) {
		this.splice(!isNaN(index) ? index : this.length,0,item);
		return this;
	};
	function insertBefore(item,before) {
		var index = this.indexOf(before) || this.length;
		return this.insert(item,index);
	};
	function inject(array) {
		var length = this.length;
		this.length += array.length;
		for (var i=0,l=array.length; i<l; i++) this[i+length] = array[i];
		return this;
	};
	
	// removing
	function clear() {
		this.length = 0;
		return this;
	};
	function remove(item) {
		for (var i=0; i<this.length; i++) {
			if (this[i] === item) {
				this.splice(i--,1);
				break;
			};
		};
		return this;
	};
	function removeAll(item) {
		for (var i=0; i<this.length; i++) if (this[i] === item) this.splice(i--,1);
		return this;
	};
	function removeAtIndex(index,number) {
		if (isNaN(number) || number < 1) number = 1;
		this.splice(index,number);
		return this;
	};
	function trim(item,scope) {
		var iterator = TRIM_ITERATOR(item);
		if (!scope) scope = this;
		return this.trimEnd(iterator,scope).trimStart(iterator,scope);
	};
	function trimStart(item,scope) {
		var iterator = TRIM_ITERATOR(item);
		if (!scope) scope = this;
		while (iterator.call(scope,this[0],0,this)) this.shift();
		return this;
	};
	function trimEnd(item,scope) {
		var iterator = TRIM_ITERATOR(item);
		if (!scope) scope = this;
		while (iterator.call(scope,this.last(),this.length-1,this)) this.pop();
		return this;
	};
	
	// replacing
	function replace(item,replacement) {
		for (var i=0,l=this.length; i<l; i++) {
			if (this[i] === item) {
				this[i] = replacement;
				break;
			};
		};
		return this;
	};
	function replaceAtIndex(index,replacement) {
		this.splice(index,1,replacement);
		return this;
	};
	function replaceAll(item,replacement) {
		for (var i=0,l=this.length; i<l; i++) {
			if (this[i] === item) this[i] = replacement;
		};
		return this;
	};
	
	
	return this.Prototypes = {
		"push": PUSH,		// IE5-
		"forEach": FOREACH,	// IE7-
		"indexOf": INDEXOF,
		"lastIndexOf": LASTINDEXOF,
		
		"each": each,
		"examine": examine,
		"gather": gather,
		"pluck": gather,
		"plant": plant,
		"spread": plant,
		"invoke": invoke,
		
		"first": first,
		"last": last,
		
		// comparison
		"any": any,
		"contains": contains,
		"every": every,
		"find": find,
		"findIndex": findIndex,
		"findAll": findAll,
		"findAllIndex": findAllIndex,
		"groupCount": groupCount,
		"left": left,
		"right": right,
		"max": max,
		"min": min,
		"none": none,
		
		// modifiers: self-inflicted
		"randomize": randomize,
		"reverse": reverse,
		"sum": sum,
		"unique": unique,
		"duplicates": duplicates,
	//	"order": order,
		
		// modifiers: assaults
		"divide": divide,
		"select": select,
		
		// cloning
		"clone": copy,
		"copy": copy,
		"flatten": flatten,
		
		// inserting
		"inject": inject,
		"insert": insert,
		"insertBefore": insertBefore,
		
		// removing
		"clear": clear,
		"remove": remove,
		"removeAll": removeAll,
		"removeAt": removeAtIndex,
		"removeAtIndex": removeAtIndex,
		"trim": trim,
		"trimEnd": trimEnd,
		"trimStart": trimStart,
		
		// replacing
		"replace": replace,
		"replaceAll": replaceAll,
		"replaceAt": replaceAtIndex,
		"replaceAtIndex": replaceAtIndex
	};
}).call(Pseudo.Array));

/*****************************************************************************
*** Math *********************************************************************
*****************************************************************************/
Object.expand(Math,(function(){
	return this.Math = {
		"EquatorialRadius": 6378137,
		"RadiansToDegrees": 180/Math.PI,
		"DegreesToRadians": Math.PI/180
	};
}).call(Pseudo));

/*****************************************************************************
*** Number *******************************************************************
*****************************************************************************/
Object.expand(Number,(function(){
	function range(start, end, exclusive) {
		var results = [];
		if (!exclusive) results.push(start);
		if (start !== end) {
			var inc = start < end ? 1 : -1;
			while (start + inc !== end) results.push(start = start + inc);
			if (!exclusive) results.push(start + inc);
		} else {
			if (exclusive) results.clear();
		};
		return results;
	};
	function from(input) { return String(input).toNumber() };
	
	function esnDecimalToHex(esn) {
		esn = String(esn).padLeft("0",11);
		return esn.left(3).toNumber().zeroPadded(2,0,16) + esn.right(8).toNumber().zeroPadded(6,0,16);
	};
	function esnHexToDecimal(esn) {
		esn = String(esn).padLeft("0",8);
		return parseInt(esn.left(2),16).zeroPadded(3) + parseInt(esn.right(6),16).zeroPadded(8);
	};
	
	return this.Number = {
		"from": from,
		"range": range,
		
		"esnDecimalToHex": esnDecimalToHex,
		"esnDecToHex": esnDecimalToHex,
		"esnHexToDecimal": esnHexToDecimal,
		"esnHexToDec": esnHexToDecimal
	};
}).call(Pseudo));
Object.expand(Number.prototype,(function(){
	var FORMAT_FLAGS = /\\?(\\|[0]|[#])/gim;
	
	// math
	function abs() { return Math.abs(this) };
	function acos() { return Math.acos(this) };
	function asin() { return Math.asin(this) };
	function atan() { return Math.atan(this) };
	function ceil() { return Math.ceil(this) };
	function cos() { return Math.cos(this) };
	function exp() { return Math.exp(this) };
	function floor() { return Math.floor(this) };
	function log() { return Math.log(this) };
	function max(other) { return Math.max(this,other) };
	function min(other) { return Math.min(this,other) };
	function pow(power) { return Math.pow(this,power) };
	function round(places) {
		if (!places) return Math.round(this);
		var x = Math.pow(10,places);
		return Math.round(this * x) / x;
	};
	function sin() { return Math.sin(this) };
	function sqrt() { return Math.sqrt(this) };
	function tan() { return Math.tan(this) };
	function percent() { return this/100 };
	
	// modifiers: self-inflicted
	function hex() { return this.toString(16) };
	function colour() {
		var col = this.toString(16);
		if (col.length < 2) col = "0"+ col;
		return col;
	};
	
	// modifiers: assaults
	function repeat(number) { return this.toString().repeat(number) };
	function zeroPadded(length,decimals,radix) {
		var strings = this.toString(radix || 10).split(".");
		if (decimals && strings.length === 1) strings.push("0");
		if (strings[0].length < length) strings[0] = "0".repeat(length - strings[0].length) + strings[0];
		if (strings[1] && strings[1].length < decimals) strings[1] = "0".repeat(decimals - strings[1].length) + strings[1];
		return strings.join(".");
	};
	function groupDigits(separator,groupSize,decimalPlaces) {
		if (!separator) separator = ",";
		if (!groupSize || groupSize < 1) groupSize = 3;
		if (!decimalPlaces || decimalPlaces < 0) decimalPlaces = 0;
		
		var splitter = new RegExp("\\d{1,"+ groupSize +"}","g"), output = this < 0 ? "-" : "";
		var self = this.abs().toString().split("."), integer = self[0], decimal = self[1] || "";
		if (decimalPlaces > decimal.length) decimal += "0".repeat(decimalPlaces - decimal.length);
		
		output += integer.reverse().match(splitter).join(separator).reverse();
		if (decimal) output += "."+ decimal.match(splitter).join(separator);
		
		return output;
	};
	function toFormat(format) {
		if (!format || !format.length) return this.toString();
		var me = Math.abs(this).zeroPadded(format.count("#")), neg = (this<0);
		var i = format.length, n = me.length, formatted = [];
		while (i) {
			var chr = format.charAt(--i);
			if (chr != "#") { formatted.push(chr) }
			else { formatted.push(me.charAt(--n)) };
		};
		while (n) { formatted.push(me.charAt(--n)) };
		if (neg) { formatted.push("-") };
		return formatted.reverse().join("");
	};
	
	function isBetween(upper,lower) {
		var high = upper > lower ? upper : lower, low = upper < lower ? upper : lower;
		return this <= high && this >= low;
	};
	// returns a percentage
	function rangeBetween(upper,lower) {
		if (isNaN(lower)) lower = 0;
		if (upper === lower) return this;
		return (this - lower) / (upper - lower);
	};
	// returns a value for this percentage
	function betweenRange(upper,lower) {
		if (isNaN(lower)) lower = 0;
		if (upper === lower) return this;
		return (this * (upper - lower)) + lower;
	};
	
	// exposed
	return this.Prototypes = {
		"abs": abs,
		"acos": acos,
		"asin": asin,
		"atan": atan,
		"ceil": ceil,
		"cos": cos,
		"exp": exp,
		"floor": floor,
		"log": log,
		"max": max,
		"min": min,
		"pow": pow,
		"round": round,
		"sin": sin,
		"sqrt": sqrt,
		"tan": tan,
		"percent": percent,
		
		"hex": hex,
		"color": colour,
		"colour": colour,
		
		"betweenRange": betweenRange,
		"rangeBetween": rangeBetween,
		
		"groupDigits": groupDigits,
		"repeat": repeat,
		"toFormat": toFormat,
		"zeroPadded": zeroPadded
	};
}).call(Pseudo.Number));

/*****************************************************************************
*** String *******************************************************************
*****************************************************************************/
Object.expand(String,(function(){
	var FROMCHARCODE = function(number) { return String.fromCharCode(number) };

	function range(start, end, exclusive) {
		var results = [];
		if (!exclusive) results.push(start);
		if (start !== end && start.length === end.length) {
			var begin = start.split(""), finish = end.split(""), ranges = new Array(begin.length);
			for (var i = 0, l = ranges.length; i < l; i++) {
				ranges[i] = Number.range(
					begin[i].charCodeAt(0),
					finish[i].charCodeAt(0),
					exclusive
				).examine(FROMCHARCODE);
			};
			results.clear();
			results.inject(ranges.shift());
			while (ranges.length) {
				var suffix = ranges.shift(), combine = [];
				for (var i = 0, l = results.length; i < l; i++) {
					var prefix = results[i];
					for (var j = 0, s = suffix.length; j < s; j++) {
						combine.push(prefix + suffix[j]);
					};
				};
				results = combine;
			};
		} else {
			results.clear();
		};
		return results;
	};
	
	return this.String = {
		"EMAIL_FILTER": /(?:mailto\:)?[a-z0-9]+[a-z0-9_\.\-\+]*@[a-z0-9]+(?:[a-z0-9\-\.]*[a-z0-9]+)*\.[a-z]{2,4}/gim,
		"WEBSITE_FILTER": /(?:https?\:\/\/)?[a-z0-9]+(?:[a-z0-9\-\.]*[a-z0-9]+)*\.[a-z]{2,4}(?:[^\s])*/gim,
		"SCRIPT_FILTER": /<script[^>]*>(?:\s|\S)*<\/script>/gim,
		
		"range": range
	};
}).call(Pseudo));
Object.expand(String.prototype,(function(){
	var	slice = Array.prototype.slice,
		TRIMLEFT_FILTER = /^\s+/m,
		TRIMRIGHT_FILTER = /\s+$/gm,
		NUMBER_FILTER = /^[\s$\(#%]*(-*(?:\(*\d*\.)?[\d]+)/m,
		INTEGER_FILTER = /^[\s$\(#%]*(-*[a-z0-9]+)/m,
		DASHERIZE_MATCHER = /[A-Z]/g;
	
	
	// fill-ins
	function TRIM() {
		var self = this.toString();
		if (!self.length) return self;
		return this.trimLeft().trimRight();
	};
	function TRIM_LEFT() {
		var self = this.toString();
		if (!self.length) return self;
		var space = (self.match(TRIMLEFT_FILTER) || [""])[0];
		return !space ? self : self.substring(space.length);
	};
	function TRIM_RIGHT() {
		var self = this.toString();
		if (!self.length) return self;
		var space = (self.match(TRIMRIGHT_FILTER) || [""]).last();
		return !length ? self : self.substring(0,self.length-space.length);
	};
	
	// comparison
	function startsWith(string) { return this.indexOf(string) === 0 };	// needs RegExp variant
	function endsWith(string) {	// needs RegExp variant
		var last = this.lastIndexOf(string);
		return last > -1 && last === this.length - string.length;
	};
	function contains(string) { return this.indexOf(string) > -1 };	// needs RegExp variant
	function excludes(string) { return !this.indexOf(string) === -1 };	// needs RegExp variant
	function count(string) { return this.split(string).length - 1 };
	function isBlank() { return !/[^\s\n\r\f]/m.test(this) };
	function isUpperCase() { return this === this.toUpperCase() };
	function isLowerCase() { return this === this.toLowerCase() };
	
	// modifiers: self-inflicted
	function capitalize() { return this.charAt(0).toUpperCase() + this.substring(1) };
	function obfuscate() { return Pseudo.obfuscate(this) };
	function reverse() {
		var me = [], i = this.length;
		while (i) { me.push(this.charAt(--i)) };
		return me.join("");
	};
	function camelize() {
		var sections = this.split("-"), camel = [sections[0]];
		for (var i=1,l=sections.length; i<l; i++) {
			if (sections[i]) camel.push(sections[i].capitalize());
		};
		return camel.join("");
	};
	function dasherize() {
		var dashing = [], lastIndex = 0, matches;
		DASHERIZE_MATCHER.reset();
		while (matches = DASHERIZE_MATCHER.exec(this)) {
			dashing.push(this.substring(lastIndex,DASHERIZE_MATCHER.lastIndex - matches[0].length));
			dashing.push("-");
			dashing.push(matches[0].toLowerCase());
			lastIndex = DASHERIZE_MATCHER.lastIndex;
		};
		dashing.push(this.substring(lastIndex));
		return dashing.join("").toLowerCase();
	};
	function toNumber() {
		var parse = parseFloat(this);
		if (!isNaN(parse)) return parse;
		parse = this.match(NUMBER_FILTER);
		return !parse || !parse[1] ? NaN : parseFloat(parse[1]);
	};
	function toInteger(radix) {
		if (!radix) return Math.round(this.toNumber());
		var parse = this.match(INTEGER_FILTER);
		return !parse || !parse[1] ? NaN : parseInt(parse[1],radix);
	};
	function charArray() {
		var chars = [];
		for (var i=0,l=this.length; i<l; i++) chars.push(this.charCodeAt(i));
		return chars;
	};
	function linkify() {
		return this.webifty().emailify();
	};
	function emailify() {
		var results = this.separate(String.EMAIL_FILTER);
		for (var i=0,l=results.length; i<l; i++) {
			if (String.EMAIL_FILTER.reset().test(results[i])) {
				var email = results[i], address = email;
				if (email.startsWith("mailto:")) {
					email = email.trimLeft("mailto:");
				} else {
					address = "mailto:"+ email;
				};
				results[i] = ["<a href=\"",address,"\">",email,"</a>"].join("");
			};
		};
		return results.join("");
	};
	function webify() {
		var results = this.separate(String.WEBSITE_FILTER);
		for (var i=0,l=results.length; i<l; i++) {
			if (String.WEBSITE_FILTER.reset().test(results[i])) {
				var website = results[i], address = website;
				if (website.startsWith("http:")) {
					website = website.trimLeft("http://");
				} else if (website.startsWith("https:")) {
					website = website.trimLeft("https://");
				} else {
					address = "http://"+ website;
				};
				results[i] = ["<a href=\"",address,"\">",website,"</a>"].join("");
			};
		};
		return results.join("");
	};
	function stripScripts() {
		return this.remove(String.SCRIPT_FILTER);
	};
	function separateScripts() {
		var text = [], scripts = [], results = this.separate(String.SCRIPT_FILTER);
		for (var i=0,l=results.length; i<l; i++) {
			if (String.SCRIPT_FILTER.reset().test(results[i])) {
				scripts.push(results[i]);
			} else {
				text.push(results[i]);
			};
		};
		return {
			"text": text.join(""),
			"scripts": scripts.join("")
		};
	};
	
	// modifiers: assaults
	function left(length) {
		if (!length) return this.toString();
		return length > 0 ? this.substring(0,length) : this.slice(-length);
	};
	function right(length) {
		if (!length) return this.toString();
		return length > 0 ? this.slice(-length) : this.substring(0,length+this.length);
	};
	function replaceAll(find,replacement) {
		if (!find) return this.toString();
		if (!replacement) replacement = "";
		return this.split(find).join(replacement);
	};
	function remove() {
		var removed = this.toString(), args = slice.call(arguments,0);
		for (var i=0,l=args.length; i<l; i++) removed = removed.replaceAll(args[i]);
		return removed;
	};
	function repeat(number) {
		var me = new Array(number);
		for (var i=0; i<number; i++) me[i] = this;
		return me.join("");
	};
	function divide(length) {
		var chunks = [];
		for (var i=0,l=this.length; i<l; i=i+length) chunks.push(this.substring(i,i+length));
		return chunks;
	};
	function separate(search) {
		var chunks = [];
		if (Object.isRegExp(search)) {
			var self = this.toString();
			if (search.reset().global) {
				var match, prevIndex = 0;
				while (match = search.exec(self)) {
					if (search.lastIndex - match[0].length > 0) chunks.push(self.substring(prevIndex,search.lastIndex - match[0].length));
					chunks.push(match[0]);
					prevIndex = search.lastIndex;
				};
				if (self.length - prevIndex > 0) chunks.push(self.substring(prevIndex));
			} else {
				var globalSearch = new RegExp(search.source,"g"+ search.flags()), match = globalSearch.exec(self);
				if (match) {
					if (match && globalSearch.lastIndex - match[0].length > 0) chunks.push(self.substring(0,globalSearch.lastIndex - match[0].length));
					chunks.push(match[0]);
				};
				if (self.length - globalSearch.lastIndex > 0) chunks.push(self.substring(prevIndex));
			};
		} else {
			var splits = this.split(search);
			for (var i=0,l=splits.length-1; i<l; i++) {
				chunks.push(splits[i]);
				chunks.push(search);
			};
			chunks.push(splits.last());
		};
		return chunks;
	};
	function crop(item) {
		var self = this.toString();
		if (!this.length) return self;
		if (item && !Object.isRegExp(item)) item = String(item);
		return this.cropLeft(item).cropRight(item);
	};
	function cropLeft(item) {
		var self = this.toString();
		if (!this.length) return self;
		if (item === "" || Object.isNothing(item)) item = TRIMLEFT_FILTER;
		else if (!Object.isRegExp(item)) item = String(item);
		if (Object.isRegExp(item)) {
			while (self.search(item) === 0) {
				self = self.substring(self.match(item)[0].length,self.length);
			};
		} else {
			while (self.indexOf(item) === 0) {
				self = self.substring(item.length,self.length);
			};
		};
		return self;
	};
	function cropRight(item) {
		var self = this.toString();
		if (!this.length) return self;
		if (item === "" || Object.isNothing(item)) item = TRIMRIGHT_FILTER;
		else if (!Object.isRegExp(item)) item = String(item);
		if (Object.isRegExp(item)) {
			var match = (self.match(item) || []).last(), lastIndex = !match ? null : self.lastIndexOf(match);
			while (match && lastIndex === self.length-match.length) {
				self = self.substring(0,lastIndex);
				match = (self.match(item) || []).last();
				lastIndex = !match ? null : self.lastIndexOf(match);
			};
		} else {
			var lastIndex = self.lastIndexOf(item);
			while (lastIndex === self.length-item.length) {
				self = self.substring(0,lastIndex);
				lastIndex = self.lastIndexOf(item);
			};
		};
		return self;
	};
	function truncate(length,truncation,bothEnds) {
		length = length || 30;
		truncation = Object.isUndefined(truncation) ? "..." : String(truncation);
		if (this.length < length+truncation.length) return this.toString();
		if (bothEnds) length /= 2;
		return !bothEnds ? this.left(length) + truncation : this.left(length) + truncation + this.right(length);
	};
	function pad(string,right,left) {
		return this.padRight(string,right || 0).padLeft(string,left || 0);
	};
	function padLeft(string,width) {
		return string.repeat(width - this.length) + this;
	};
	function padRight(string,width) {
		return this + string.repeat(width - this.length);
	};
	
	// exposed methods
	return this.Prototypes = {
		"trim": TRIM,
		"trimLeft": TRIM_LEFT,
		"trimRight": TRIM_RIGHT,
		
		"startsWith": startsWith,
		"endsWith": endsWith,
		"contains": contains,
		"excludes": excludes,
		"count": count,
		"isBlank": isBlank,
		"isUpperCase": isUpperCase,
		"isLowerCase": isLowerCase,
		
		"capitalize": capitalize,
		"obfuscate": obfuscate,
		"reverse": reverse,
		"camelize": camelize,
		"dasherize": dasherize,
		"charArray": charArray,
		"toNumber": toNumber,
		"toInteger": toInteger,
		
		"emailify": emailify,
		"linkify": linkify,
		"webify": webify,
		"stripScripts": stripScripts,
		"separateScripts": separateScripts,
		
		"left": left,
		"start": left,
		"right": right,
		"end": right,
		"remove": remove,
		"repeat": repeat,
		"replaceAll": replaceAll,
		"divide": divide,
		"separate": separate,
		"crop": crop,
		"cropLeft": cropLeft,
		"cropStart": cropLeft,
		"cropRight": cropRight,
		"cropEnd": cropRight,
		"truncate": truncate,
		
		"pad": pad,
		"padLeft": padLeft,
		"padRight": padRight
	};
}).call(Pseudo.String));

/*****************************************************************************
*** Date *********************************************************************
*****************************************************************************/
Object.expand(Date,(function(){
	var INVALID = new Date("invalid");
	var dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
	var monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
	var milliseconds = {
		"yyyy":	365 * 24 * 3600 * 1000,
		"MM":	31 * 24 * 3600 * 1000,
		"ww":	7 * 24 * 3600 * 1000,
		"dd":	24 * 3600 * 1000,
		"hh":	3600 * 1000,
		"mm":	60 * 1000,
		"ss":	1000,
		"fff":	1
	};
	function getTimezoneOffset() { return -new Date().getTimezoneOffset() };
	function getDayName(index) { return Date.DayNames[index] };
	function getMonthName(index) { return Date.MonthNames[index] };
	
	function toSql(date,local) {
		var prefix = !local ? "getUTC" : "get";
		return [
			date[prefix +"FullYear"](),"-",
			(date[prefix +"Month"]()+1).zeroPadded(2),"-",
			date[prefix +"Date"]().zeroPadded(2)," ",
			date[prefix +"Hours"]().zeroPadded(2),":",
			date[prefix +"Minutes"]().zeroPadded(2),":",
			date[prefix +"Seconds"]().zeroPadded(2),".",
			date[prefix +"Milliseconds"]()
		].join("");
	};
	function fromSql(sql,local) {
		if (!sql) return INVALID.copy();
		var date, values = sql.split(/\s|T/);
		var ymd = values[0].split("-"), hmsf = values.length==2 ? values[1].split(/:|\./) : [];
		if (ymd.length === 3) {
			date = new Date();
			date.setFullYear(
				ymd[0].toNumber() || 0,
				(ymd[1].toNumber() || 1)-1,
				ymd[2].toNumber() || 0
			);
		};
		if (hmsf.length >= 3) {
			if (!date) date = new Date();
			date.setHours(
				hmsf[0].toNumber() || 0,
				hmsf[1].toNumber() || 0,
				hmsf[2].toNumber() || 0,
				hmsf.length > 3 ? hmsf[3].toNumber() || 0 : 0
			);
			if (!local) date.add(Date.Minute,-date.getTimezoneOffset());
		} else {
			if (date) date.setHours(0,0,0,0);
		};
		return date;
	};
	function today() {
		var date = new Date();
		date.setHours(0,0,0,0);
		return date;
	};
	function tomorrow() { return today().add(Date.Day,1) };
	function yesterday() { return today().add(Date.Day,-1) };
	
	return this.Date = {
		"INVALID":	INVALID,
		"Year":		"yyyy",
		"Month":		"MM",
		"Day":		"dd",
		"Hour":		"hh",
		"Minute":		"mm",
		"Second":		"ss",
		"Millisecond":	"fff",
		
		"DayNames": dayNames,
		"MonthNames": monthNames,
		"MillisecondsPer": milliseconds,
		
		"getTimezoneOffset": getTimezoneOffset,
		"getDayName": getDayName,
		"getMonthName": getMonthName,
		"toSql": toSql,
		"fromSql": fromSql,
		"today": today,
		"tomorrow": tomorrow,
		"yesterday": yesterday
	};
}).call(Pseudo));
Object.expand(Date.prototype,(function(){
	var	INVALID_MESSAGE = "Invalid Date",
		SQL_FILTER = /(?:(\d{2,4})-(\d{1,2})-(\d{1,2}).*)?(?:(\d{1,2}):(\d{1,2}):(\d{1,2})(?:\D(\d*))?)?/,
		FORMAT_FLAGS = /\\?(\\|y{1,4}|d{1,4}|M{1,4}|h{1,2}|H{1,2}|m{1,2}|s{1,2}|f{1,6}|t{1,3}|T{1,3})/gm,
		COMPARE_CRITERIA = [
		{ "name": "years", "value": Date.MillisecondsPer.yyyy },
		{ "name": "months", "value": Date.MillisecondsPer.MM },
		{ "name": "weeks", "value": Date.MillisecondsPer.ww },
		{ "name": "days", "value": Date.MillisecondsPer.dd },
		{ "name": "hours", "value": Date.MillisecondsPer.hh },
		{ "name": "minutes", "value": Date.MillisecondsPer.mm },
		{ "name": "seconds", "value": Date.MillisecondsPer.ss },
		{ "name": "milliseconds", "value": Date.MillisecondsPer.fff }
	];
	
	// formatting
	function fromSql(sql,local) {
		var date = Date.fromSql(sql,local);
		if (date) {
			this.setUTCFullYear(
				date.getUTCFullYear(),
				date.getUTCMonth(),
				date.getUTCDate()
			);
			this.setUTCHours(
				date.getUTCHours(),
				date.getUTCMinutes(),
				date.getUTCSeconds(),
				date.getUTCMilliseconds()
			);
		};
		return this;
	};
	function toSql(local) { return Date.toSql(this,local) };
	function toFormat(format,invalid) {
		if (isNaN(this.valueOf())) return invalid || INVALID_MESSAGE;
		
		var pieces = String(format).separate(FORMAT_FLAGS);
		pieces.each(function(piece,index) {
			if (!piece) return;
			if (piece.startsWith("\\")) return pieces[index] = piece.substring(1);
		//	if (isNaN(this.valueOf())) return formatted.push("NaN");	need better solution
			switch (piece) {
				case "yyyy":
				case "yyy":	pieces[index] = this.getFullYear();break;
				case "yy":	pieces[index] = this.getFullYear().toString().right(2);break;
				case "y":		pieces[index] = this.getFullYear().toString().right(1);break;
				case "MMMM":	pieces[index] = this.getMonthName();break;
				case "MMM":	pieces[index] = this.getMonthName().left(3);break;
				case "MM":	pieces[index] = (this.getMonth()+1).zeroPadded(2);break;
				case "M":		pieces[index] = this.getMonth()+1;break;
				case "dddd":	pieces[index] = this.getDayName();break;
				case "ddd":	pieces[index] = this.getDayName().left(3);break;
				case "dd":	pieces[index] = this.getDate().zeroPadded(2);break;
				case "d":		pieces[index] = this.getDate();break;
				case "HH":	pieces[index] = this.getHours().zeroPadded(2);break;
				case "H":		pieces[index] = this.getHours();break;
				case "hh":	pieces[index] = this.getHoursBase12().zeroPadded(2);break;
				case "h":		pieces[index] = this.getHoursBase12();break;
				case "mm":	pieces[index] = this.getMinutes().zeroPadded(2);break;
				case "m":		pieces[index] = this.getMinutes();break;
				case "sss":	pieces[index] = this.getSeconds().zeroPadded(3);break;
				case "ss":	pieces[index] = this.getSeconds().zeroPadded(2);break;
				case "s":		pieces[index] = this.getSeconds();break;
				case "ffffff":	pieces[index] = this.getPaddedMilliseconds(6);break;
				case "fffff":	pieces[index] = this.getPaddedMilliseconds(5);break;
				case "ffff":	pieces[index] = this.getPaddedMilliseconds(4);break;
				case "fff":	pieces[index] = this.getPaddedMilliseconds(3);break;
				case "ff":	pieces[index] = this.getPaddedMilliseconds(2);break;
				case "f":		pieces[index] = this.getPaddedMilliseconds(1);break;
				case "TTT":	pieces[index] = this.getHours() > 11 ? "P.M." : "A.M.";break;
				case "ttt":	pieces[index] = this.getHours() > 11 ? "p.m." : "a.m.";break;
				case "TT":	pieces[index] = this.getHours() > 11 ? "PM" : "AM";break;
				case "tt":	pieces[index] = this.getHours() > 11 ? "pm" : "am";break;
				case "T":		pieces[index] = this.getHours() > 11 ? "P" : "A";break;
				case "t":		pieces[index] = this.getHours() > 11 ? "p" : "a";break;
				default:		pieces[index] = piece;
			};
		},this);
		return pieces.join("");
	};
	function context(levels,describer,comparer) {
		if (!levels || levels <= 0) levels = 2;
		describer = Object.expand(describer || {},{
			"before": "ago",
			"now": "just now",
			"after": "until"
		});
		if (!comparer || !(comparer instanceof Date)) comparer = new Date();
		
		var	context = [],
			success = 0,
			calc = levels-success === 1 ? "round" : "floor",
			diff = comparer.valueOf() - this.valueOf(),
			abs = diff.abs();
		
		if (abs >= 1000) {
			for (var i=0,c; c=COMPARE_CRITERIA[i]; i++) {
				if (abs >= c.value) {
					var value = (abs/c.value)[calc]();
					context.push(value);
					context.push(" ");
					context.push(value !== 1 ? c.name : c.name.right(-1));
					context.push(", ");
					abs -= value * c.value;
					success++;
				};
				if (levels <= success || abs < 1000) break;
				else if (levels-success === 1) calc = "round";
			};
			context.pop();
		};
		
		if (!context.length) {
			return describer.now;
		} else {
			return context.join("") +" "+ (diff < 0 ? describer.after : describer.before);
		};
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
/*
console.warn(
	type,
	this.valueOf(),
	compare.valueOf(),
	Date.MillisecondsPer[type],
	this.valueOf() - compare.valueOf(),
	(this.valueOf() - compare.valueOf()) / Date.MillisecondsPer[type]
);
*/
			return Math.round((compare.valueOf() - this.valueOf()) / Date.MillisecondsPer[type]);
		};
	};
	function isToday() {
		return this.isSameDay(new Date());
	};
	function isAfter(compare) {
		return this.valueOf() > compare.valueOf();
	};
	function isBefore(compare) {
		return this.valueOf() < compare.valueOf();
	};
	function isSameYear(compare) {
		return this.getFullYear() === compare.getFullYear();
	};
	function isSameMonth(compare) {
		return this.isSameYear(compare) && this.getMonth() === compare.getMonth();
	};
	function isSameDay(compare) {
		return this.isSameMonth(compare) && this.getDate() === compare.getDate();
	};
	
	// value getters
	function getHoursBase12() {
		var hours = this.getHours();
		if (hours === 0) hours = 12;
		else if (hours > 12) hours %= 12;
		return hours;
	};
	function getMonthName() { return Date.MonthNames[this.getMonth()] || ""  };
	function getDayName() { return Date.DayNames[this.getDay()] || "" };
	function getWeek() {
		var copy = this.copy();
		copy.setMonth(0,1);
		copy.add(Date.Day,-copy.getFirstDay() - 1);
		return (copy.diff(Date.Day,test) / 7).ceil();
	};
	function getFirstDay() {
		var day = new Date(this.valueOf());
		day.setDate(1);
		return day.getDay();
	};
	function getLastDate() {
		var last = new Date(this.valueOf());
		last.setDate(1);
		last.add(Date.Month,1);
		last.setDate(0);
		return last.getDate();
	};
	function getLastDay() { return this.getLastDate().getDay() };
	
	
	// value setters
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
	function adder(type,value) {
		value = String(value).toNumber();
		if (value) {
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
		};
		return this;
	};
	function subtract(type,value) { return this.add(type,-value) };
	function copy() { return new Date(this.valueOf()) };
	function setWeek(value) {
		var copy = this.copy(), day = this.getDay();
		copy.setMonth(0,1);
		copy.setDate(copy.getDate()+(value*7));
		this.setMonth(copy.getMonth(),copy.getDate());
	};
	
	// exposed
	return this.Prototypes = {
		"toSql": toSql,
		"toFormat": toFormat,
		"fromSql": fromSql,
		"context": context,
		
		"diff": diff,
		"isToday": isToday,
		"isAfter": isAfter,
		"isBefore": isBefore,
		"isSameDay": isSameDay,
		"isSameMonth": isSameMonth,
		"isSameYear": isSameYear,
		
		"getHoursBase12": getHoursBase12,
		"getMonthName": getMonthName,
		"getMonthDays": getLastDate,
		"getDayName": getDayName,
		"getFirstDay": getFirstDay,
		"getLastDate": getLastDate,
		"getLastDay": getLastDay,
		"getWeek": getWeek,
		"setWeek": setWeek,
		
		"get": getter,
		"set": setter,
		"add": adder,
		"sub": subtract,
		"subtract": subtract,
		"copy": copy
	};
}).call(Pseudo.Date));

/*****************************************************************************
*** RegExp *******************************************************************
*****************************************************************************/
Object.expand(RegExp,(function(){
	var ESCAPE_FILTER = /([.*+?^=!:${}()|[\]\/\\])/g;
	function escape(source) {
		return String(source).replace(ESCAPE_FILTER, "\\$1");
	};
	return this.RegExp = {
		"escape": escape
	};
}).call(Pseudo));
Object.expand(RegExp.prototype,(function(){
	function reset() {
		this.lastIndex = 0;
		return this;
	};
	function toSource() {
		return this.source + this.flags();
	};
	function flags() {
		return [
			this.global ? "g" : "",
			this.ignoreCase ? "i" : "",
			this.multiline ? "m" : "",
			this.sticky ? "y" : ""
		].join("");
	};
	
	// exposed
	return this.Prototypes = {
		"reset": reset,
		"toSource": toSource,
		"flags": flags
	};
}).call(Pseudo.RegExp));

/*****************************************************************************
*** Try (helper utility) *****************************************************
******************************************************************************
	Try.every(functions), or Try.every.call(scope,functions);
	Try.these(functions), or Try.these.call(scope,functions);
*****************************************************************************/
var Try = Pseudo.Try = (function(){
	function every() {
		var functions = $A(arguments).flatten(), values = [], prevException, prevFunction;
		for (var i=0,f; f=functions[i]; i++) {
			var result = {};
			try { result.value = f.call(this,i,prevException,prevFunction) }
			catch (exception) { result.error = exception };
			values.push(result);
			prevException = result.error;
			prevFunction = f;
		};
		return values;
	};
	function these() {
		var functions = $A(arguments).flatten(), value, prevException, prevFunction;
		for (var i=0,f; f=functions[i]; i++) {
			try {
				value = f.call(this,i,prevException,prevFunction);
				break;
			} catch (exception) {
				prevException = exception;
			};
			prevFunction = f;
		};
		return value;
	};
	
	return {
		"every": every,
		"these": these
	};
})();


/*****************************************************************************
*** Utilities ****************************************************************
*****************************************************************************/
var $w = Array.fromWhitespace, $A = Array.from, $N = Number.from;
var $R = Number.range, $S = String.range;


/*****************************************************************************
*** Include other requested modules ******************************************
*****************************************************************************/
(function(){
	var MODULE_FILTER = /[\?&]modules?=([^&]*)/i;
	var DEFAULTS = ["classing","elements","ajax","controls","drawing"];//,"animation"];
	$A(document.getElementsByTagName("script")).each(function(script) {
		var source = script.getAttribute("src") || "";
		if (source.contains("pseudo.js")) {
			var path = source.substring(0,source.indexOf("pseudo.js")), modules = source.match(MODULE_FILTER);
			this.INCLUDED_MODULES.inject(!modules ? DEFAULTS : modules[1].split(",")).each(function(module) {
				if (!module) return;
			//	if (module) this.addScript(path +"pseudo_"+ module +".js");
				document.write([
					"<","script type=\"text/javascript\" ",
					"src=\"",path,"pseudo_",module,".js\"",
					"></","script",">"
				].join(""));
			},this);
		};
	},Pseudo);
})();