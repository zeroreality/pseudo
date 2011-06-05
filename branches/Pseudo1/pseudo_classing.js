/* ---------------------------------------------------------------------------
 *  Pseudo JavaScript framework, version 1.1b
 *  (c) 2009 Alex Lein
 *
 *  Pseudo is based heavily on the awesome
 *  Prototype JavaScript framework (c) 2005-2009 Sam Stephenson
 *
 *  Pseudo is freely distributable under the terms of an MIT-style license.
 *  For details, see http://www.opensource.org/licenses/mit-license.php
 *--------------------------------------------------------------------------*/
if (!window["Class"]) window["Class"] = Pseudo.Class = {};
Object.extend(Class,function(){
	var	slice = Array.prototype.slice,
		VALUEOF = Function.prototype.valueOf,
		TOSTRING = Function.prototype.toString,
		KLASS_HEAD_ELEMENT = document.getElementsByTagName("head")[0],
		KLASS_ARRAY_NATIVE = (function(){
			var supported = false, array = function(){};
			array.prototype = [];
			array.prototype.__adder = function(item) { this.push(item) };
			
			var maybe = new array();
			maybe.__adder("native");
			maybe.__adder("array");
			
			supported = maybe.length === 2 && maybe[1] === "array";
			if (supported) supported = !Array.prototype.__adder;
			if (!supported) delete Array.prototype.__adder;
			
			array.prototype = null;
			array = null;
			return supported;
		})(),
		KLASS_ARRAY_CODE = [
			"<","script"," type=\"text/javascript\">",
			"parent.Class.ARRAY_SANDBOX = Array;",
			"parent.Class.ARRAY_SANDBOX.prototype.constructor = Array;",
			"</","script",">"
		].join(""),
		KLASS_METHODS = {
			"addMethods": addMethods,
			"addProperties": addProperties,
			"aliasMethods": aliasMethods
		},
		KLASS_PROTOTYPES = {
			"addHandler": addHandler,
			"removeHandler": removeHandler,
			"isHandled": isHandled,
			"raise": raise,
			"handle": addHandler,
			"fumble": removeHandler,
			"dispose": dispose
		},
		KLASS_PROPERTIES = {
			"Generic": { "getter": getterGeneric, "setter": setterGeneric },
			"Boolean": { "getter": getterBoolean, "setter": setterBoolean, "default": false },
			"Number": { "getter": getterNumber, "setter": setterNumber, "default": NaN },
			"Integer": { "getter": getterNumber, "setter": setterInteger, "default": NaN },
			"String": { "getter": getterString, "setter": setterString, "default": "" },
			"Char": { "getter": getterString, "setter": setterChar, "default": "" },
			"Object": { "getter": getterObject, "setter": setterObject },
			"Date": { "getter": getterDate, "setter": setterDate },
			"Array": { "getter": getterArray, "setter": setterArray },
			"RegExp": { "getter": getterGeneric, "setter": setterRegExp },
			"Element": { "getter": getterGeneric, "setter": setterElement }
		},
		KLASS_EVENT = create(null,null,{
			"constructor": function(eventName,target) {
				this.type = eventName;
				this.target = target;
			},
			"__stop": false,
			"stop": function() { this.__stop = true },
			"isStopped": function() { return this.__stop }
		}),
		ARRAY_NATIVE_JOINER = ["",""].toString();
	
	// klass inheritance
	function KLASS_PROTO_COPY() {};
	
	// array inheritance
	function ARRAY_NATIVE() {
		function NativeArray() {
		//	this.__trace = true;
			if (!isNaN(arguments[0]) && arguments.length === 1) this.length = arguments[0];
			else if (arguments.length > 0) this.inject(slice.call(arguments,0));
		};
		NativeArray.prototype = [];
		Object.extend(NativeArray.prototype,{
			"toString": function toString() { return this.join(ARRAY_NATIVE_JOINER) }
		});
		return NativeArray;
	};
	function ARRAY_POPUP() {	// holy SHIT does this cause odd bugs in IE7 mode
		Class.ARRAY_SANDBOX = null;
		var popdoc = window.createPopup().document;
		popdoc.write(KLASS_ARRAY_CODE);
		popdoc.close();
		
		return Class.ARRAY_SANDBOX;
	};
	function ARRAY_IFRAME() {
		Class.ARRAY_SANDBOX = null;
		var sanddoc, parent, iframe = document.createElement("iframe");
		iframe.style.display = "none";
		
		// append to document (do not remove, causes problems)
		if (!KLASS_HEAD_ELEMENT) KLASS_HEAD_ELEMENT = document.getElementsByTagName("head")[0];
		parent = document.body || KLASS_HEAD_ELEMENT || document.documentElement;
		parent.appendChild(iframe);
		
		// reference the sandbox document
		if (window.frames) sanddoc = window.frames[window.frames.length-1].document;
		if (!sanddoc && iframe.contentDocument) sanddoc = iframe.contentDocument;
		if (!sanddoc && iframe.contentWindow) sanddoc = iframe.contentWindow.document;
		if (!sanddoc) sanddoc = iframe.document;
		sanddoc.write(KLASS_ARRAY_CODE);
		sanddoc.close();
		
		return Class.ARRAY_SANDBOX;
	};
	function ARRAY_DESCENDANT(klass) {
		var $super = klass.__super;
		while ($super) {
			if ($super === Array) return true;
			else $super = $super === $super.__super ? null : $super.__super;
		};
		return false;
	};
	
	var PROPERTY_GETTER = Object.prototype.__defineGetter__, PROPERTY_SETTER = Object.prototype.__defineSetter__;
	
	// adding properties, methods, and such
	function addProperties(properties) {
	/*
		// ECMAScript 5
		if (Object.defineProperty) {
			Object.defineProperty(this,propertyName,{ "get": getter, "set": setter });
		
		// legacy
		} else if (Object.prototype.__defineGetter__) {
			Object.prototype.__defineGetter__.call(this,propertyName,getter);
			Object.prototype.__defineSetter__.call(this,propertyName,setter);
		}; 
	*/
		for (var name in properties) {
			var	property = properties[name],
				storage = property["storage"] || "__"+ Pseudo.obfuscate(name);
			
			if ("default" in Object(property))
				this.prototype[storage] = property["default"];
			if (Object.isFunction(property["getter"]))
				this.prototype["get"+ name] = property["getter"].bundle(storage);
			if (Object.isFunction(property["setter"]))
				this.prototype["set"+ name] = property["setter"].bundle(name,storage);
		};
		return this;
	};
	function addMethods(methods) {
		var $super = this.__super && this.__super.prototype;
		if (Object.isFunction(methods.constructor) && !methods.constructor.isNative()) methods.__constructor = methods.constructor;

		for (var property in methods) {
			if (property === "constructor") continue;
			var value = methods[property];
/*
			if ($super && Object.isFunction(value) && value.argumentNames()[0] === "$super") {
				this.prototype[property] = (function(name,method){
					return function() {
						return method.apply(this,[$super[name].bind(this)].inject(arguments));
					};
				}).call(this,property,value);
*/
			if (Object.isFunction(value) && value.argumentNames()[0] === "$super") {
				this.prototype[property] = (function(proto,name,method){
					var ancestor = $super && $super[name] || proto[name];
				//	if (method.valueOf() === ancestor.valueOf()) ancestor = Pseudo.um;	// recurrsion trap
					return function() {
						return method.apply(this,[ancestor.bind(this)].inject(slice.call(arguments,0)));
					};
				})(this.prototype,property,value);
				this.prototype[property].valueOf = VALUEOF.bind(value);
				this.prototype[property].toString = TOSTRING.bind(value);
			} else {
				this.prototype[property] = value;
			};
		};
		return this;
	};
	function aliasMethods(names) {
		for (var each in names) {
			var name = names[each], method = this.prototype[name];
			if (Object.isFunction(method)) this.prototype[each] = method;
		};
		return this;
	};
	
	// Klass factory
	function getKlass() {
		function Klass() {
		//	this.__trace = true;
			this.__pseudoID = Pseudo.unique();
			if (!this.__proto__) this.__proto__ = Klass.prototype;
			this.__constructor.apply(this,slice.call(arguments,0));
		};
		return Klass;
	};
	function getArrayKlass() {
		if (KLASS_ARRAY_NATIVE) return ARRAY_NATIVE();
	//	else if (window.createPopup) return ARRAY_POPUP();	// weird bugs
		else return ARRAY_IFRAME();
	};
	
	function create($super,properties,methods,factory,aliases) {
		var isArray = !!($super && ($super === Array || ARRAY_DESCENDANT($super)));
		var Klass = !isArray ? getKlass() : getArrayKlass();
		
		Object.extend(Klass,KLASS_METHODS);
		Klass.__subs = [];
		if (factory) Object.extend(Klass,factory);
		if ($super) {
			if (isArray) {
				Object.expand(Klass.prototype,$super.prototype);
			} else {
				KLASS_PROTO_COPY.prototype = $super.prototype;
				Klass.prototype = new KLASS_PROTO_COPY();
			};
			if (!$super.__subs) $super.__subs = [Klass];
			else $super.__subs.push(Klass);
			Klass.__super = $super;
		};
		Object.expand(Klass.prototype,KLASS_PROTOTYPES);
		if (!Klass.prototype.__constructor) Klass.prototype.__constructor = $super || Pseudo.um;
		if (properties) Klass.addProperties(properties);
		if (methods) Klass.addMethods(methods);
		if (aliases) Klass.aliasMethods(aliases);
		Klass.prototype.constructor = Klass;
		
		return Klass;
	};
	function singleton($super,properties,methods,factory,aliases) {
		var klass = create($super,properties,methods,factory,aliases), instance = new klass();
		if (factory) Object.extend(instance,factory);	// methods re-applied; possible overwrite
		return instance;
	};
	
	// klass events
	function addHandler(eventName,handler) {
		if (!(handler instanceof Function)) {
			var error = {
				"message": "instance.addHandler: handler not a Function.",
				"target": this,
				"caller": arguments.caller,
				"event": eventName,
				"handler": handler
			};
		//	console.warn(error);
			throw error;
		};
		if (!handler.__deleted) handler.__deleted = {};
		if (!this.__handlers) this.__handlers = {};
		if (!this.__handlers[eventName]) this.__handlers[eventName] = Object.extend([],{ "__handling": false });
		if (!this.__handlers[eventName].contains(handler)) this.__handlers[eventName].push(handler);
		return this;
	};
	function removeHandler(eventName,handler) {
		if (!this.__handlers) return this;
		if (!eventName) {
			for (eventName in this.__handlers) {
				for (var i=0,h; h=this.__handlers[eventName][i]; i++) this.removeHandler(eventName,h);
			};
		} else {
			var handlers = this.__handlers[eventName];
			if (!handlers) return this;
			if (!handler) {
				if (!handlers.__handling) handlers.clear();
				else for (var i=0,h; h=handlers[i]; i++) h.__deleted[eventName] = true;
			} else {
				for (var i=0,h; h=handlers[i]; i++) {
					if (h === handler) {
						if (!handlers.__handling) handlers.removeAt(i);
						else h.__deleted[eventName] = true;
						return this;
					};
				};
			};
		};
		return this;
	};
	function isHandled(eventName,handler) {
		if (this.__handlers && this.__handlers[eventName]) {
			return this.__handlers[eventName].contains(handler);
		};
		return false;
	};
	function raise(eventName/*,eventArgs*/) {
	var trace = !!this.__trace, eventArgs = slice.call(arguments,1);
	if (trace && typeof this.__trace !== "boolean") {
		var tracers = this.__trace.split(",");
		trace = false;
		for (var i=0,t; t=tracers[i]; i++) {
			if (eventName.toUpperCase().contains(t.toUpperCase())) { trace = true; break };
		};
	};
	if (trace) {
		try { trace = eventArgs.join() } catch(x) { trace = "\u00abError\u00bb" };
		if (eventName.contains("error")) {
			console.warn(this,eventName,trace);
		} else if (eventName.contains("changed")) {
			console.log(this,eventName,trace);
		} else {
			console.info(this,eventName,trace);
		};
	};
	if (this.__handlers && this.__handlers[eventName] && !this.__handlers[eventName].__handling) {
		this.__handlers[eventName].__handling = true;
		var event = new KLASS_EVENT(eventName,this);
		for (var i=0,handler; handler=this.__handlers[eventName][i]; i++) {
			if (!handler.__deleted[eventName]) handler.apply(this,[event].concat(eventArgs));
			if (event.__stop) break;
		};
		for (var i=0,handler; handler=this.__handlers[eventName][i]; i++) {
			if (handler.__deleted && handler.__deleted[eventName]) {
				this.__handlers[eventName].splice(i--,1);
				handler.__deleted[eventName] = false;
				delete handler.__deleted[eventName];
			};
		};
		this.__handlers[eventName].__handling = false;
		return event;
	};
};
	function dispose() {
		this.raise("disposed");
		this.__trace = false;
		delete this.__pseudoID;
		this.fumble();
	};
	
	// properties - getters
	function getterGeneric(storage) { return this[storage] };
	function getterBoolean(storage) { return !!this[storage] };
	function getterNumber(storage) { return !isNaN(this[storage]) ? this[storage] : NaN };
	function getterString(storage) { return this[storage] || "" };
	function getterObject(storage) { return this[storage] || (this[storage] = {}) };
	function getterDate(storage) { return this[storage] || (this[storage] = new Date("NaN")) };
	function getterArray(storage) { return this[storage] || (this[storage] = []) };
	
	// properties - setters
	function setterGeneric(name,storage,value) {
		var oldval = this["get"+ name]();
		if (oldval !== value) {
			this[storage] = value;
			this.raise(name +"changed",oldval,value);
		};
		return this;
	};
	function setterBoolean(name,storage,value) {
		var	oldval = this["get"+ name](),
			newval = !!value;
		if (oldval !== newval) {
			this[storage] = newval;
			this.raise(name +"changed",oldval,newval);
		};
		return this;
	};
	function setterString(name,storage,value) {
		var	oldval = this["get"+ name](),
			newval = Object.isNothing(value) ? "" : String(value);
		if (oldval !== newval) {
			this[storage] = newval;
			this.raise(name +"changed",oldval,newval);
		};
		return this;
	};
	function setterChar(name,storage,value) {
		var	oldval = this["get"+ name](),
			newval = Object.isNothing(value) ? "" : String(value).left(1);
		if (oldval !== newval) {
			this[storage] = newval;
			this.raise(name +"changed",oldval,newval);
		};
		return this;
	};
	function setterNumber(name,storage,value) {
		var	oldval = this["get"+ name](),
			newval = String(value).toNumber();
		if (oldval !== newval && !(isNaN(oldval) && isNaN(newval))) {
			this[storage] = newval;
			this.raise(name +"changed",oldval,newval);
		};
		return this;
	};
	function setterInteger(name,storage,value) {
		var	oldval = this["get"+ name](),
			newval = String(value).toInteger();
		if (oldval !== newval && !(isNaN(oldval) && isNaN(newval))) {
			this[storage] = newval;
			this.raise(name +"changed",oldval,newval);
		};
		return this;
	};
	function setterObject(name,storage,value) {
		if (typeof value !== "object") throw "New value not an object";
		var oldval = this["get"+ name]();
		if (oldval !== value) {
			this[storage] = value;
			this.raise(name +"changed",oldval,value);
		};
		return this;
	};
	function setterDate(name,storage,value) {
		var	oldval = this["get"+ name](),
			newval = Object.isDate(value) ? value : (Date.fromSql(String(value)) || new Date(value));
		if (oldval.valueOf() !== newval.valueOf() && !(isNaN(oldval.valueOf()) && isNaN(newval.valueOf()))) {
			this[storage] = newval;
			this.raise(name +"changed",oldval,newval);
		};
		return this;
	};
	function setterArray(name,storage,value) {
		var	oldval = this["get"+ name](),
			newval = Object.isArray(value) ? value : value.toArray ? value.toArray() : [value];
		if (oldval !== value) {
			this[storage] = newval;
			this.raise(name +"changed",oldval,newval);
		};
		return this;
	};
	function setterRegExp(name,storage,value) {
		if (!Object.isRegExp(value)) throw "New value not an instance of a RegExp";
		var oldval = this["get"+ name]();
		if (oldval.toSource() !== value.toSource()) {
			this[storage] = value;
			this.raise(name +"changed",oldval,value);
		};
		return this;
	};
	function setterElement(name,storage,value) {
		if (value && !Object.isElement(value)) throw "New value not an instance of an Element";
		var	oldval = this["get"+ name](),
			newval = value || null;
		if (oldval !== newval) {
			this[storage] = newval;
			this.raise(name +"changed",oldval,newval);
		};
		return this;
	};
	
	// exposed methods
	return {
		"create": create,
		"module": singleton,
		"singleton": singleton,
		"Methods": KLASS_METHODS,
		"Prototypes": KLASS_PROTOTYPES,
		"Properties": KLASS_PROPERTIES
	};
}.call(Class));