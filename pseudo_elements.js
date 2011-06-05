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
Object.extend(Pseudo.DOM = {}, {
//	"XPath": !!document.evaluate,
	"Sizzle": !!window.Sizzle,
	"NWMatcher": !!(window.NW && window.NW.Dom),
	"SelectorsAPI": !!document.querySelectorAll,
	"SelectorsAPI2": !!document.matchesSelector,
	"Native": (function() {
	//	if (Pseudo.Engine.Webkit && Pseudo.Browser.Mobile) return false;
		if (typeof window.HTMLDivElement !== "undefined") return true;
		var	div = document.createElement("div"),
			form = document.createElement("form"),
			isSupported = !!(div.__proto__ && (div.__proto__ !== form.__proto__));
		div = form = null;
		return isSupported;
	})()
});
Object.extend(Pseudo.Event = {}, {
	"Native": (function() {
		var constructor = window.HTMLEvent || window.Event;
		return !!(constructor && constructor.prototype);
	})(),
	"Extensions": (function() {
	//	if (Pseudo.Browser.IE && Pseudo.BrowserVersion <= 6) return false;
		if (window.Event && window.Event.prototype && window.MouseEvent && window.MouseEvent.prototype) {
			var ep = window.Event.prototype, kp = window.MouseEvent.prototype;
			return !!(ep.initEvent && ep.initEvent !== kp.initEvent);
		};
		return false;
	})()
});
if (!window.DOM) window.DOM = Pseudo.DOM;
if (!window.Event) window.Event = Pseudo.Event;

/*****************************************************************************
*** Node, Elements, Documents ************************************************
*****************************************************************************/
if (!window.Node) window.Node = {};
Object.expand(Node,{
	"ELEMENT_NODE": 1,
	"ATTRIBUTE_NODE": 2,
	"TEXT_NODE": 3,
	"CDATA_SECTION_NODE": 4,
	"ENTITY_REFERENCE_NODE": 5,
	"ENTITY_NODE": 6,
	"PROCESSING_INSTRUCTION_NODE": 7,
	"COMMENT_NODE": 8,
	"DOCUMENT_NODE": 9,
	"DOCUMENT_TYPE_NODE": 10,
	"DOCUMENT_FRAGMENT_NODE": 11,
	"NOTATION_NODE": 12
});

/*****************************************************************************
*** Inheritance OR instance application **************************************
*****************************************************************************/
Object.extend(DOM,function(){
	var	slice = Array.prototype.slice,
		unproto = Object.prototype,
		NODE_CLONES = this.NODE_CLONES = {
			"#text": document.createTextNode(""),
			"div": document.createElement("div")
		},
		CLONENODE_EXTENDS = (function(){
			var temp1 = document.createElement("div");
			temp1.__test = function() { return "ok" };
			var	temp2 = temp1.cloneNode(true),
				supported = temp1.__test === temp2.__test;
			
			temp1 = temp2 = null;
			return supported;
		})(),
		ADD_METHODS_REPEATER = function(nodeName) { DOM.addMethods(nodeName,this) },
		COPY_NODE_METHODS = function(destination/*,sources*/) {
			var sources = slice.call(arguments,1);
			for (var i=0,l=sources.length; i<l; i++) {
				if (!sources[i]) continue;
				for (var each in sources[i]) try {
				//	if (each === "constructor") continue;
					var newfunc = sources[i][each], oldfunc = destination[each];
					if (Object.isFunction(newfunc) && (!Object.isFunction(oldfunc) || !oldfunc.isNative())) destination[each] = newfunc;
				//	if (!Object.isFunction(newfunc) || !newfunc.isNative() && !Object.isFunction(oldfunc) || !oldfunc.isNative()) destination[each] = newfunc;
				} catch(x) {};
			};
			return destination;
		},
		NODE_METHODS_EXTENDED = 0,
		NODE_METHODS = this.NODE_METHODS = {
			"#document": Object.getPrototypeOf(document) || document,
			"#window": Object.getPrototypeOf(window) || window,
			"#text": this.Native && (function(){
				var item = window.Text, proto;
				if (item) proto = item.prototype;
				if (!proto) {
					item = document.createTextNode("text");
					proto = Object.getPrototypeOf(item);
				};
				item = null;
				return proto;
			})() || {},
			"*": this.Native && (function(){
				var item = window.HTMLElement, proto;
				if (item && item.prototype) proto = item.prototype;
				// the prototype of my prototype is my friend
				if (!proto) {
					item = window.HTMLDivElement;
					if (item && item.prototype) proto = Object.getPrototypeOf(item.prototype);
				};
				if (!proto) {
					var temp = document.createElement("div");
					item = Object.getPrototypeOf(temp);
					proto = Object.getPrototypeOf(item);
					temp = null;
				};
				if (!proto) {
					item = window.Element;
					if (item && item.prototype) proto = item.prototype;
				};
				item = null;
				return proto;
			})() || {}
		},
		NODE_UNCLONABLES = Object.keys(NODE_METHODS),
		NODE_CLASS_NAMES = {
			"OPTGROUP": "OptGroup", "TEXTAREA": "TextArea", "P": "Paragraph",
			"FIELDSET": "FieldSet", "UL": "UList", "OL": "OList", "DL": "DList",
			"DIR": "Directory", "H1": "Heading", "H2": "Heading", "H3": "Heading",
			"H4": "Heading", "H5": "Heading", "H6": "Heading", "Q": "Quote",
			"INS": "Mod", "DEL": "Mod", "A": "Anchor", "IMG": "Image",
			"CAPTION": "TableCaption", "COL": "TableCol", "COLGROUP": "TableCol",
			"THEAD": "TableSection", "TFOOT": "TableSection", "TBODY": "TableSection",
			"TR": "TableRow", "TH": "TableCell", "TD": "TableCell",
			"FRAMESET": "FrameSet", "IFRAME": "IFrame"
		},
		NODE_PROTOTYPE_FINDER = function(nodeName) {
			// chached?
			nodeName = String(nodeName).toLowerCase();
			if (NODE_METHODS[nodeName]) return NODE_METHODS[nodeName];
			
			// element proto
			var klass = "HTML"+ NODE_CLASS_NAMES[nodeName] +"Element";
			if (window[klass]) return NODE_METHODS[nodeName] = window[klass].prototype;
			klass = "HTML"+ nodeName +"Element";
			if (window[klass]) return NODE_METHODS[nodeName] = window[klass].prototype;
			klass = "HTML"+ nodeName.toLowerCase().capitalize() +"Element";
			if (window[klass]) return NODE_METHODS[nodeName] = window[klass].prototype;
			
			// last ditch
			var	element = document.createElement(nodeName),
				proto = Object.getPrototypeOf(element);
			element = null;
			if (proto && proto !== unproto) return NODE_METHODS[nodeName] = proto;
			
			// sorry
			return NODE_METHODS["*"];
		};
	
	// create
	function create(nodeName,attributes,handlers) {
		nodeName = nodeName.toLowerCase();
		if (!NODE_CLONES[nodeName]) {
			NODE_CLONES[nodeName] = document.createElement(nodeName);
			if (!this.Native && CLONENODE_EXTENDS) extend(NODE_CLONES[nodeName]);
		};
		var element = NODE_CLONES[nodeName].cloneNode(this.Native ? false : (CLONENODE_EXTENDS || nodeName === "#text"));
		if (!this.Native && !CLONENODE_EXTENDS) extend(element);
		else element.__pseudoID = Pseudo.unique();
		if (attributes) element.writeAttributes(attributes);
		if (handlers) for (var each in handlers) element.handle(each,handlers[each]);
		return element;
	};
	
	// extender methods
//	var hswth = DOM.HOLYSHIT_WHATTHEHELL = {};
	function extend(element) {
		$A(arguments).flatten().each(extender);
		return element;
	};
	function extender(element) {
	//	if (!Object.isElement(element)) return;
		if (!element || !element.nodeName) return;
		var pseudo = String(element.__pseudoID).toNumber();
		if (!pseudo || pseudo < NODE_METHODS_EXTENDED) {
		//	var methods = NODE_METHODS[element.nodeName.toLowerCase()];
		//	if (methods) Object.expand(element,methods);
		//	Object.expand(element,NODE_METHODS["*"]);
			COPY_NODE_METHODS(element,NODE_METHODS["*"],NODE_METHODS[element.nodeName.toLowerCase()]);
			element.__pseudoID = Pseudo.unique();
//			hswth[element.__pseudoID] = element;
		};
		return element;
	};
	
	// add methods
	function addMethods(nodeNames,methods) {
		if (Object.isString(nodeNames) && nodeNames.contains(",")) {
			nodeNames.split(",").each(ADD_METHODS_REPEATER,methods);
			return NODE_METHODS_EXTENDED;
		} else if (Object.isArray(nodeNames)) {
			nodeName.each(ADD_METHODS_REPEATER,methods);
			return NODE_METHODS_EXTENDED;
		} else if (!nodeNames) {
			nodeNames = "*";
		};
		
		var nodeName = String(nodeNames).toLowerCase();
		if (!NODE_METHODS[nodeName]) {
			if (this.Native) {
				NODE_METHODS[nodeName] = NODE_PROTOTYPE_FINDER(nodeName);
			} else {
				NODE_METHODS[nodeName] = {};
				if (!NODE_CLONES[nodeName]) {
					NODE_CLONES[nodeName] = document.createElement(nodeName);
					if (!this.Native && CLONENODE_EXTENDS) extend(NODE_CLONES[nodeName]);
					COPY_NODE_METHODS(NODE_METHODS[nodeName],NODE_CLONES[nodeName]);
				};
			};
		};
		COPY_NODE_METHODS(NODE_METHODS[nodeName],methods);
		
		if (CLONENODE_EXTENDS) {
			if (nodeName === "*") {
				for (var each in NODE_CLONES) {
					if (NODE_UNCLONABLES.contains(each)) continue;
					COPY_NODE_METHODS(NODE_CLONES[each],methods);
				};
			} else if (!NODE_UNCLONABLES.contains(nodeName)) {
				COPY_NODE_METHODS(NODE_CLONES[nodeName],methods);
			};
		};
		
		return NODE_METHODS_EXTENDED = Pseudo.unique();
	};
	
	// exposed methods
	return {
		"COPY_NODE_METHODS": COPY_NODE_METHODS,
	//	"create": this.Native ? createNative : CLONENODE_EXTENDS ? createCloned : createInstance,
	//	"addMethods": this.Native ? addPrototypes : addInstanceMethods,
		"create": create,
		"addMethods": addMethods,
		"extend": this.Native ? Pseudo.um : extend,
		"extender": extender,
		"extentions": function() { return NODE_METHODS_EXTENDED }
	};
}.call(DOM));


/*****************************************************************************
*** General helper methods ***************************************************
*****************************************************************************/
DOM.addMethods("*",function(){
	var	slice = Array.prototype.slice,
		div = document.createElement("div"),
		APPENDER = function(element) { this.appendChild(element) };
	
	/* -------------------------------------------------------------------- *
	 * Simple attribute helpers                                             *
	 * -------------------------------------------------------------------- */
	var	VALID_IDNAME = this.VALID_IDNAME = /^[a-z][a-z0-9\.\-\_\:]+$/i,
		READ_ATTRIBUTE = this.READ_ATTRIBUTE_TRANSLATORS = {
			"id": function() { return this.id },
			"for": function() { return this.htmlFor },
			"name": function() { return this.name },
			"class": function() { return this.className },
			"className": function() { return this.className },
			"innerHTML": function() { return this.innerHTML }
		},
		WRITE_ATTRIBUTE = this.WRITE_ATTRIBUTE_TRANSLATORS = {
			"id": function(value) {
				if (VALID_IDNAME.test(value)) this.id = value;
				else throw "Invalid element id";
			},
			"for": function(value) { this.htmlFor = value },
			"name": function(value) {
				if (VALID_IDNAME.test(value)) this.name = value;
				else throw "Invalid element name";
			},
			"class": function(value) { this.className = value },
			"className": function(value) { this.className = value },
			"innerHTML": setHtml
		};
	
	function readAttribute(name) {
		if (name in READ_ATTRIBUTE) return READ_ATTRIBUTE[name].call(this);
		return this.getAttribute(name);
	};
	function writeAttribute(name,value) {
		if (!(name in WRITE_ATTRIBUTE)) this.setAttribute(name,value);
		else if (Object.isNothing(value)) this.removeAttribute(name);
		else WRITE_ATTRIBUTE[name].call(this,value);
		return this;
	};
	function readAttributes(names) {
		var attributes = {};
		for (var i=0,l=names.length; i<l; i++) {
			if (!attributes[names[i]]) attributes[names[i]] = this.readAttribute(names[i]);
		};
		return attributes;
	};
	function writeAttributes(attributes) {
		for (var each in attributes) this.writeAttribute(each,attributes[each]);
		return this;
	};
	
	/* -------------------------------------------------------------------- *
	 * innerHTML helper                                                     *
	 * -------------------------------------------------------------------- */
	var	INNERHTML_HELPERS = {},
		BUGGY_TABLE = this.TABLE_INNERHTML_BUGGY = (function(){
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
			return isBuggy;
		})(),
		BUGGY_SELECT = this.SELECT_INNERHTML_BUGGY = (function(){
			var isBuggy = true, element = document.createElement("select");
			element.innerHTML = "<option value=\"test\">test</option>";
			try {
				isBuggy = element.options[0].nodeName.toLowerCase() !== "option";
			} catch(x) {
				isBuggy = true;
			};
			element = null;
			return isBuggy;
		})(),
		INNERHTML_HELPER = function(element,htmlString) {
			var	i=0,l,
				nodes = [],
				name = element.nodeName.toLowerCase(),
				helper = INNERHTML_HELPERS[name],
				container = helper ? DOM.NODE_CLONES["div"] : (DOM.NODE_CLONES[name] || DOM.create(name));
			
			if (helper) {
				container.innerHTML = helper[0] + htmlString + helper[1];
				nodes.inject(container.getElementsByTagName(name)[0].childNodes);
			} else {
				container.innerHTML = htmlString;
				nodes.inject(container.childNodes);
			};
			for (l=nodes.length; i<l; i++) element.appendChild(nodes[i]);
			container.innerHTML = "";
			container = null;
		};
	if (BUGGY_TABLE) {
		Object.extend(INNERHTML_HELPERS,{
			"table":	["<table>","</table>"],
			"caption":["<table><caption>","</caption></table>"],
			"tbody":	["<table><tbody>","</tbody></table>"],
			"td":	["<table><tbody><tr><td>","</td></tr></tbody></table>"],
			"tfoot":	["<table><tfoot>","</tfoot><tbody></tbody></table>"],
			"th":	["<table><tbody><tr><th>","</th></tr></tbody></table>"],
			"thead":	["<table><thead>","</thead><tbody></tbody></table>"],
			"tr":	["<table><tbody><tr>","</tr></tbody></table>"]
		});
	};
	if (BUGGY_SELECT) {
		INNERHTML_HELPERS["select"] = ["<select>","</select>"];
	};
	
	function setHtml(value) {
	//	this.innerHTML = "";	// IE7 bug with <table>/<select> tags
		while (this.childNodes.length) this.removeChild(this.lastChild);
		if (!Object.isNothing(value)) this.addHtml(value);
		return this;
	};
	function addHtml(value) {
		if (Object.isElement(value)) {
			this.appendChild(value);
		} else if (Object.isDocument(value)) {
			$A(value.childNodes).each(APPENDER,this);
		} else if (!Object.isNothing(value)) {
			INNERHTML_HELPER(this,String(value).stripScripts());
		};
		return this;
	};
	function removeHtml(value) {
		if (Object.isElement(value)) {
			if (this.contains(value)) value.parentNode.removeChild(value);
		} else if (Object.isDocument(value)) {
			for (var i=0,e,kids=value.childNodes; e=kids[i]; i++) {
				if (this.contains(e)) e.parentNode.removeChild(e);
			};
		} else if (!Object.isNothing(value)) {
			// find every instance of the text node in the tree, remove it from it's parent
		};
		return this;
	};
	function cleanWhitespace(deep) {
		for (var i=this.childNodes.length-1; i>=0; i--) {
			if (deep && this.childNodes[i].nodeType === 1) this.cleanWhitespace(!!deep);
			else if (this.childNodes[i].nodeType === 3) this.removeChild(this.childNodes[i]);
		};
		return this;
	};
	
	
	// exposed methods
	return {
		"readAttribute": readAttribute,
		"readAttributes": readAttributes,
		"writeAttribute": writeAttribute,
		"writeAttributes": writeAttributes,
		
		"setHtml": setHtml,
		"update": setHtml,
		"addHtml": addHtml,
		"removeHtml": removeHtml,
		"cleanWhitespace": cleanWhitespace
	};
}.call(DOM));


/*****************************************************************************
*** Selectors API ************************************************************
*****************************************************************************/
DOM.addMethods("*,#document",function(){
	var	NEEDS_EXTENDING = !this.Native,
		QUERY_ATTRIBUTE_QUOTES = /\[.+=[^"]+\]/,
		QUERY_ATTRIBUTE_QUOTE_SPLITTER = /=|\]/;
	
	function containCompare(element) {
		return !!(this.compareDocumentPosition(element) & 16);
	};
	function containSelect(element) {
		return $A(this.getElementsByTagName(element.nodeName.toLowerCase())).contains(element);
	};
	function descendantOf(element) {
		return $(element).contains(this);
	};
	function root() {
		var root = this.ownerDocument && this.ownerDocument.documentElement;
		if (root) return DOM.extend(root);
		var results = Object.recursive(this,"parentNode",Number.MAX_VALUE);
		while (results.length && !Object.isElement(results.last())) results.pop();
		return results.length ? DOM.extend(results.last()) : undefined;
	};
	
	// Selectors API level 1
	function querySelectorsAPI(/*cssText,cssText2,cssTextN*/) {
		var results = [];
		for (var i=0,l=arguments.length; i<l; i++) results.inject(this.querySelectorAll(arguments[i]));
		if (NEEDS_EXTENDING && results.length) DOM.extend(results);
		return results;
	};
	function matchSelectorsAPI(cssText) {
		var root = this.root();
		if (!root) return false;
		var elements = $A(root.querySelectorAll(cssText));
		return elements.contains(this);
	};
	function ancestorSelectorsAPI(cssText) {
		var	element = Object.isElement(this.parentNode) ? this.parentNode : undefined,
			root = element ? this.root() : undefined;
		if (!element || !root) return;
		else if (element && cssText && cssText !== "*") {
			var matches = $A(root.querySelectorAll(cssText));
			if (matches.length) while (Object.isElement(element) && !matches.contains(element)) element = element.parentNode;
		};
		return !element || !NEEDS_EXTENDING ? element : DOM.extend(element);
	};
	function ancestorsSelectorsAPI(cssText) {
		var results = [];
		if (!cssText || cssText === "*") {
			results.inject(Object.recursive(this,"parentNode",Number.MAX_VALUE));
			while (results.length && !Object.isElement(results.last())) results.pop();
		} else {
			var	element = Object.isElement(this.parentNode) ? this.parentNode : undefined,
				root = element ? this.root() : undefined,
				matches = root ? $A(root.querySelectorAll(cssText)) : undefined;
			if (matches && matches.length) {
				while (Object.isElement(element)) {
					if (matches.contains(element)) results.push(element);
					element = element.parentNode;
				};
			};
		};
		if (NEEDS_EXTENDING) DOM.extend(results);
		return results;
	};
	
	// Selectors API level 2
//	function querySelectorsAPI2() {}; // same as querySelectorsAPI
	function matchSelectorsAPI2(cssText) {
		return this.matchesSelector(cssText/*,refNode:scope*/);
	};
	function ancestorSelectorsAPI2(cssText) {
		var element = Object.isElement(this.parentNode) ? this.parentNode : undefined;
		if (element) {
			while (Object.isElement(element) && element.matchesSelector(cssText/*,refNode:scope*/)) element = element.parentNode;
			if (!Object.isElement(element)) element = undefined;
		};
		return !element || !NEEDS_EXTENDING ? element : DOM.extend(element);
	};
	function ancestorsSelectorsAPI2(cssText) {
		var results = [];
		if (!cssText || cssText === "*") {
			results.inject(Object.recursive(this,"parentNode",Number.MAX_VALUE));
			while (results.length && !Object.isElement(results.last())) results.pop();
		} else {
			var element = this.parentNode;
			while (Object.isElement(element)) {
				if (element.matchesSelector(cssText/*,refNode:scope*/)) results.push(element);
				element = element.parentNode;
			};
		};
		if (NEEDS_EXTENDING) DOM.extend(results);
		return results;
	};
	
	// Sizzle: sizzlejs.com
	function querySizzle(/*cssText,cssText2,cssTextN*/) {
		var results = [];
		for (var i=0,l=arguments.length; i<l; i++) Sizzle(arguments[i],this,results);
		if (NEEDS_EXTENDING && results.length) DOM.extend(results);
		return results;
	};
	function matchSizzle(cssText) {
		return Sizzle.match(cssText,[this]).length > 0;
	};
	function ancestorSizzle(cssText) {
		var element = Object.isElement(this.parentNode) ? this.parentNode : undefined;
		if (element && cssText && cssText !== "*") {
			while (Object.isElement(element) && !Sizzle.match(cssText,[element]).length) element = element.parentNode;
			if (!Object.isElement(element)) element = undefined;
		};
		return !element || !NEEDS_EXTENDING ? element : DOM.extend(element);
	};
	function ancestorsSizzle(cssText) {
		var results = [], parents = Object.recursive(this,"parentNode",Number.MAX_VALUE);
		while (results.length && !Object.isElement(results.last())) results.pop();
		if (!cssText || cssText === "*") results.inject(parents);
		else results.inject(Sizzle.match(cssText,parents));
		if (NEEDS_EXTENDING) DOM.extend(results);
		return results;
	};
	
	// NWMatcher: javascript.nwbox.com/NWMatcher
	function queryNWMatcher(/*cssText,cssText2,cssTextN*/) {
		var results = [];
		for (var i=0,l=arguments.length; i<l; i++) results.inject(NW.Dom.select(arguments[i],this));
		if (NEEDS_EXTENDING && results.length) DOM.extend(results);
		return results;
	};
	function matchNWMatcher(cssText) {
		return NW.Dom.match(this,cssText);
	};
	function ancestorNWMatch(cssText) {
		var element = Object.isElement(this.parentNode) ? this.parentNode : undefined;
		if (element && cssText && cssText !== "*") {
			while (Object.isElement(element) && !NW.Dom.match(element,cssText)) element = element.parentNode;
			if (!Object.isElement(element)) element = undefined;
		};
		return !element || !NEEDS_EXTENDING ? element : DOM.extend(element);
	};
	function ancestorsNWMatch(cssText) {
		var results = [];
		if (!cssText || cssText === "*") {
			results.inject(Object.recursive(this,"parentNode",Number.MAX_VALUE));
			while (results.length && !Object.isElement(results.last())) results.pop();
		} else {
			var element = this.parentNode;
			while (Object.isElement(element)) {
				if (NW.Dom.match(element,cssText)) results.push(element);
				element = element.parentNode;
			};
		};
		if (NEEDS_EXTENDING) DOM.extend(results);
		return results;
	};
	
	// exposed methods
	return {
		"contains": document.compareDocumentPosition ? containCompare : containSelect,
		"descendantOf": descendantOf,
		"root": root,
		
		"query": this.NWMatcher && queryNWMatcher || this.Sizzle && querySizzle || this.SelectorsAPI && querySelectorsAPI || Pseudo.um,
		"match": this.NWMatcher && matchNWMatcher || this.Sizzle && matchSizzle || this.SelectorsAPI2 && matchSelectorsAPI2 || this.SelectorsAPI && matchSelectorsAPI || Pseudo.um,
		"ancestor": this.NWMatcher && ancestorNWMatch || this.Sizzle && ancestorSizzle || this.SelectorsAPI2 && ancestorSelectorsAPI2 || this.SelectorsAPI && ancestorSelectorsAPI || Pseudo.um,
		"up": this.NWMatcher && ancestorNWMatch || this.Sizzle && ancestorSizzle || this.SelectorsAPI2 && ancestorSelectorsAPI2 || this.SelectorsAPI && ancestorSelectorsAPI || Pseudo.um,
		"ancestors": this.NWMatcher && ancestorsNWMatch || this.Sizzle && ancestorsSizzle || this.SelectorsAPI2 && ancestorsSelectorsAPI2 || this.SelectorsAPI && ancestorsSelectorsAPI || Pseudo.um
	};
}.call(DOM));

/*****************************************************************************
*** Style and CSS ************************************************************
*****************************************************************************/
DOM.addMethods("*",function(){
	(function(){
		var prefix = function(corner) { return corner +"-"+ this };
		var mozilla = ["radius-topleft","radius-topright","radius-bottomright","radius-bottomleft"];
		var corners = ["top-left-radius","top-right-radius","bottom-right-radius","bottom-left-radius"];
		this.OPACITY_NATIVE = this.OPACITY_BROWSER = false;
		this.BORDER_RADIUS_NATIVE = this.OUTLINE_RADIUS_NATIVE = false;
		this.BORDER_RADIUS_BROWSER = this.OUTLINE_RADIUS_BROWSER = false;
	
		var div = document.createElement("div");
		div.style.cssText = "opacity:0.5;border-radius:10px;outline-radius:10px;";
		this.OPACITY_NATIVE = String(div.style.opacity).contains(".5");
		this.BORDER_RADIUS_NATIVE = String(div.style.borderTopLeftRadius).contains("10px");
		this.OUTLINE_RADIUS_NATIVE = String(div.style.outlineTopLeftRadius).contains("10px");
		if (Pseudo.Engine.Webkit) {
			div.style.cssText = "-webkit-opacity:0.5;-webkit-border-radius:10px;-webkit-outline-radius:10px;";
			this.OPACITY_BROWSER = String(div.style.webkitOpacity).contains(".5");
			this.BORDER_RADIUS_BROWSER = String(div.style.webkitBorderTopLeftRadius).contains("10px");
			this.OUTLINE_RADIUS_BROWSER = String(div.style.webkitOutlineTopLeftRadius).contains("10px");
		} else if (Pseudo.Engine.Gecko) {
			div.style.cssText = "-moz-opacity:0.5;-moz-border-radius:10px;-moz-outline-radius:10px;";
			this.OPACITY_BROWSER = String(div.style.MozOpacity).contains(".5");
			this.BORDER_RADIUS_BROWSER = String(div.style.MozBorderRadiusTopleft).contains("10px");
			this.OUTLINE_RADIUS_BROWSER = String(div.style.MozOutlineRadiusTopleft).contains("10px");
		};
		div = null;
		
		if (this.BORDER_RADIUS_NATIVE) this.BORDER_RADIUS_CORNERS = corners.invoke(prefix,"border");
		else if (this.BORDER_RADIUS_BROWSER && Pseudo.Engine.Webkit) this.BORDER_RADIUS_CORNERS = corners.invoke(prefix,"-webkit-border");
		else if (this.BORDER_RADIUS_BROWSER && Pseudo.Engine.Gecko) this.BORDER_RADIUS_CORNERS = mozilla.invoke(prefix,"-moz-border");
		if (this.OUTLINE_RADIUS_NATIVE) this.OUTLINE_RADIUS_CORNERS = corners.invoke(prefix,"outline");
		else if (this.OUTLINE_RADIUS_BROWSER && Pseudo.Engine.Webkit) this.OUTLINE_RADIUS_CORNERS = corners.invoke(prefix,"-webkit-border");
		else if (this.OUTLINE_RADIUS_BROWSER && Pseudo.Engine.Gecko) this.OUTLINE_RADIUS_CORNERS = mozilla.invoke(prefix,"-moz-border");
	}).call(this);
	
	var	STYLE_READER = window.getComputedStyle ? function(element,propertyName) {
			var style = window.getComputedStyle(element,null);
			return !style ? "" : style.getPropertyValue(propertyName.dasherize()) || "";
		} : function(element,propertyName) {
			var style = element.currentStyle;
			return !style ? "" : style[propertyName.camelize()] || "";
		},
		STYLE_GENERICS = this.STYLE_GENERICS = (function(){
			function copier(prefix,suffix) { return [prefix||"",this,suffix||""].join("") };
		//	function copier(prefix) {return [!prefix ? "" : prefix,this].join("") };
			var	clockwise = ["top","right","bottom","left"],
				borders = ["width","style","color"],
				bortrbl = [
					borders.invoke(copier,"border-top-"),
					borders.invoke(copier,"border-right-"),
					borders.invoke(copier,"border-bottom-"),
					borders.invoke(copier,"border-left-")
				],
				outtrbl = [
					borders.invoke(copier,"outline-top-"),
					borders.invoke(copier,"outline-right-"),
					borders.invoke(copier,"outline-bottom-"),
					borders.invoke(copier,"outline-left-")
				];
			return {
				"background": [
					"background-color",
					"background-image",
					"background-repeat",
					"background-attachment",
					"background-position"
				],
				"border": bortrbl.flatten(),
				"border-top": bortrbl[0],
				"border-right": bortrbl[1],
				"border-bottom": bortrbl[2],
				"border-left": bortrbl[3],
				"border-radius": this.BORDER_RADIUS_CORNERS,
				"border-width": clockwise.invoke(copier,"border-","-width"),
				"border-style": clockwise.invoke(copier,"border-","-style"),
				"border-color": clockwise.invoke(copier,"border-","-color"),
				"margin": clockwise.invoke(copier,"margin-"),
				"outline": outtrbl.flatten(),
				"outline-top": outtrbl[0],
				"outline-right": outtrbl[1],
				"outline-bottom": outtrbl[2],
				"outline-left": outtrbl[3],
				"outline-radius": this.OUTLINE_RADIUS_CORNERS,
				"outline-width": clockwise.invoke(copier,"outline-","-width"),
				"outline-style": clockwise.invoke(copier,"outline-","-style"),
				"outline-color": clockwise.invoke(copier,"outline-","-color"),
				"padding": clockwise.invoke(copier,"padding-")
			};
		}).call(this),
		STYLE_READ_SPECIFICS = this.STYLE_READ_SPECIFICS = (function(){
			var specifics = {};
			if (Pseudo.Browser.IE && Pseudo.BrowserVersion <= 8) {
				specifics["opacity"] = function(element) {
					var filter = null;
					try { filter = element.filters.item("DXImageTransform.Microsoft.Alpha") }
					catch(x) { filter = null };
					return !filter || !filter.enabled ? "1" : String(filter.opacity / 100);
				};
			} else if (Pseudo.Engine.Gecko) {
				if (!this.OPACITY_NATIVE && this.OPACITY_BROWSER) {
				//	specifics["opacity"] = function(element) { return element.style.MozOpacity };
					specifics["opacity"] = function(element) { return element.getStyle("MozOpacity") };
				};
			} else if (Pseudo.Engine.Webkit) {
				if (!this.OPACITY_NATIVE && this.OPACITY_BROWSER) {
				//	specifics["opacity"] = function(element) { return element.style.WebkitOpacity };
					specifics["opacity"] = function(element) { return element.getStyle("WebkitOpacity") };
				};
			};
			return specifics;
		}).call(this),
		STYLE_WRITE_SPECIFICS = this.STYLE_WRITE_SPECIFICS = (function(){
			var specifics = {};
			if (Pseudo.Browser.IE && Pseudo.BrowserVersion <= 8) {
				specifics["opacity"] = function(element,value) {
					if (isNaN(value=parseFloat(value))) value = 100;
					if (value > 100) value %= 100;
					else if (value < 0) value = 0;
					else if (value < 1) value *= 100;
					var cssText = "", filter = null;
					try { filter = element.filters.item("DXImageTransform.Microsoft.Alpha") }
					catch(x) {
						cssText = String(element.style.filter).trim();
						if (cssText) cssText += ", ";
						cssText += "progid:DXImageTransform.Microsoft.Alpha(opacity=100,enabled=false)";
						element.style.filter = cssText;
						filter = element.filters.item("DXImageTransform.Microsoft.Alpha");
					};
					filter.enabled = value !== 100;
					filter.opacity = value;
				};
			} else if (Pseudo.Engine.Gecko) {
				if (!this.OPACITY_NATIVE && this.OPACITY_BROWSER) {
					specifics["opacity"] = function(element,value) { element.style.MozOpacity = value };
				};
			} else if (Pseudo.Engine.Webkit) {
				if (!this.OPACITY_NATIVE && this.OPACITY_BROWSER) {
					specifics["opacity"] = function(element,value) { element.style.WebkitOpacity = value };
				};
			};
			return specifics;
		}).call(this);
	if (!STYLE_GENERICS["border-radius"]) delete STYLE_GENERICS["border-radius"];
	if (!STYLE_GENERICS["outline-radius"]) delete STYLE_GENERICS["outline-radius"];
	
	// utility functions
	var PARSE_STYLE_FILTER = /\s*;\s*/gim, PARSE_STYLE_STRING = function(cssText) {
		var styles = {};
		cssText.split(PARSE_STYLE_FILTER).each(function(pair) {
			var	key = pair.substring(0,pair.indexOf(":")).trim(),
				value = pair.substring(key.length+1).trim();
			if (key) styles[key] = value;
		});
		return styles;
	};
	function getStyle(properties) {
		if (arguments.length > 1) properties = $A(arguments);
		if (Object.isString(properties)) {
			if (properties.contains(",")) return this.getStyle(properties.split(PARSE_STYLE_FILTER)).join(",");
			var name = properties.dasherize();
			if (STYLE_READ_SPECIFICS[name]) return STYLE_READ_SPECIFICS[name](this);
			else if (STYLE_GENERICS[name]) return this.getStyle(STYLE_GENERICS[name]).join(" ");
			else return this.style[name.camelize()] || STYLE_READER(this,name);
		} else if (Object.isArray(properties)) {
			var result = [];
			for (var i=0,l=properties.length; i<l; i++) result.push(this.getStyle(properties[i]));
			return result;
		} else if (Object.isObject(properties)) {
			for (var name in properties) properties[name] = this.getStyle(name);
			return properties;
		};
	};
	function setStyle(properties) {
		if (Object.isString(properties)) properties = PARSE_STYLE_STRING(properties);
		for (var each in properties) {
			if (STYLE_WRITE_SPECIFICS[each]) STYLE_WRITE_SPECIFICS[each](this,properties[each]);
		//	else if (STYLE_GENERICS[name]) return this.getStyle(STYLE_GENERICS[name]).join(" "); gotta figure this out
			else this.style[each.camelize()] = String(properties[each]);
		};
		return this;
	};
	
	// exposed methods
	this.WRITE_ATTRIBUTE_TRANSLATORS["style"] = setStyle;
	return {
		"getStyle": getStyle,
		"setStyle": setStyle
	};
}.call(DOM));


/*****************************************************************************
*** Utility Methods **********************************************************
*****************************************************************************/
DOM.addMethods("*",function(){
	var slice = Array.prototype.slice;
	// display and style - utility/helpers
	function hide() {
		this.style.display = "none";
		return this;
	};
	function show() {
		this.style.display = "";
		return this;
	};
	function isHidden() {
		return this.getStyle("display") === "none";// || this.getStyle("visibility") === "hidden";
	};
	function toggle() {
		this[this.getStyle("display") !== "none" ? "hide" : "show"]();
		return this;
	};
	
	function hasClass(className) {
		return !!this.className.split(" ").contains(className);
	};
	function addClass(/*classNames*/) {
		var classNames = !this.className ? [] : this.className.split(" ");
		slice.call(arguments,0).flatten().each(function(className) {
			if (!classNames.contains(className)) classNames.push(className);
		});
		this.className = classNames.join(" ");
		return this;
	};
	function removeClass(/*classNames*/) {
		var classNames = !this.className ? [] : this.className.split(" ");
		slice.call(arguments,0).flatten().each(function(className) {
			classNames.remove(className);
		});
		this.className = classNames.join(" ");
		return this;
	};
	function toggleClass(/*classNames*/) {
		var classNames = this.className.split(" ");
		slice.call(arguments,0).flatten().each(function(className) {
			if (!classNames.contains(className)) this.addClass(className);
			else this.removeClass(className);
		},this);
		return this;
	};
	
	function firstText() {
		var element = this.firstChild;
		while (element && element.nodeType !== 3) element = element.nextSibling;
		return element;
	};
	function nextText() {
		var element = this.nextSibling;
		while (element && element.nodeType !== 3) element = element.nextSibling;
		return element;
	};
	function previousText() {
		var element = this.previousSibling;
		while (element && element.nodeType !== 3) element = element.previousSibling;
		return element;
	};
	function lastText() {
		var element = this.lastChild;
		while (element && element.nodeType !== 3) element = element.previousSibling;
		return element;
	};
	
	function childElements() {
		var elements = [];
		for (var i=0,l=this.childNodes.length; i<l; i++) {
			if (Object.isElement(this.childNodes[i])) elements.push(this.childNodes[i]);
		};
		return DOM.extend(elements);
	};
	function firstElement() {
		var element = this.firstChild;
		while (element && !Object.isElement(element)) element = element.nextSibling;
		return DOM.extend(element);
	};
	function nextElement() {
		var element = this.nextSibling;
		while (element && !Object.isElement(element)) element = element.nextSibling;
		return DOM.extend(element);
	};
	function previousElement() {
		var element = this.previousSibling;
		while (element && !Object.isElement(element)) element = element.previousSibling;
		return DOM.extend(element);
	};
	function lastElement() {
		var element = this.lastChild;
		while (element && !Object.isElement(element)) element = element.previousSibling;
		return DOM.extend(element);
	};
	
	// working with the DOM
	function clone(/*attributes,children,handlers,storage*/) {	// do specifics later
		var element = this.cloneNode(false), attrs = {}, name, value;
		for (var i=0,a; a=this.attributes[i]; i++) {
			name = a.nodeName;
			value = a.nodeValue;
			if (typeof value === "string" && element.attributes[name].nodeValue !== value) attrs[name] = value;
		};
		element.innerHTML = this.innerHTML;
		DOM.extend(element,element.query("*"));
		element.__pseudoID = Pseudo.unique();
		element.writeAttributes(attrs);
		
		// events?
		// storage clone?
		
		return element;
	};
	function amputate() {
		return this.parentNode.removeChild(this);
	};
	function dispose(deep,dontRemove) {
		this.fumble();
	/*
		var store = this.emporium();
		for (var each in store) delete store[each];
	*/
		delete DOM.ELEMENT_STORAGE_CACHE[this.__pseudoID];
		
		if (deep) this.query("*").invoke("dispose",false,true);
		if (!dontRemove && this.parentNode) this.amputate();
		
		return this;
	};
	function transplant(element,before) {
		return $(element).insertBefore(this.amputate(),before || null);
	};
	function insertAfter(element,after) {
		return this.insertBefore(element,$(after) && after.nextSibling || null);
	};
	
	// positioning
	function offset(ancestor) {
		var element = this, coords = { "top": 0, "left": 0 };
		DOM.extend(ancestor);
		while (element) {
		//	var vis = element.style.visibility, dis = element.style.display;
		//	element.style.visibility = "visible";
		//	element.style.display = "";
			
			coords.top += element.offsetTop;
			coords.left += element.offsetLeft;
			
		//	element.style.visibility = vis;
		//	element.style.display = dis;
			
			// next
			element = element.offsetParent;
			if (element === ancestor || !element) break;
		};
		return coords;
	};
	function coordinates(adjustLeft,adjustTop) {
		var top, left, dis = this.getStyle("display");
		if (isNaN(adjustLeft)) adjustLeft = 0;
		if (isNaN(adjustTop)) adjustTop = adjustLeft;
		if (dis !== "none") {
			top = this.offsetTop;
			left = this.offsetLeft;
		} else {
			var pos = this.style.position, dis = this.style.display;
			this.style.position = "absolute";
			this.style.display = "";
			top = this.offsetTop;
			left = this.offsetLeft;
			this.style.position = pos;
			this.style.display = dis;
		};
		return { "left": left + adjustLeft, "top": top + adjustTop };
	};
	function dimensions(adjustWidth,adjustHeight) {
		var width, height, dis = this.getStyle("display");
		if (isNaN(adjustWidth)) adjustWidth = 0;
		if (isNaN(adjustHeight)) adjustHeight = adjustWidth;
		if (dis !== "none") {
			width = this.offsetWidth;
			height = this.offsetHeight;
		} else {
			var dpos = this.style.position, ddis = this.style.display;
			var pos = this.getStyle("position");
			if (pos !== "relative" && pos !== "absolute") this.style.position = "relative";
			if (ddis === "none") this.style.display = "";
			width = this.offsetWidth;
			height = this.offsetHeight;
			this.style.position = dpos;
			this.style.display = ddis;
		};
		return { "width": width + adjustWidth, "height": height + adjustHeight };
	};
	function resize(width,height) {
		var w = String(width).toNumber(), h = String(height).toNumber();
		if (isNaN(w) || isNaN(h)) return this;
		return this.setStyle({
			"width": w,
			"height": h
		});
	};
	function reposition(x,y,width,height) {
		if (isNaN(x) || isNaN(y)) return this;
		var top = this.getStyle("top"), bottom = this.getStyle("bottom");
		var left = this.getStyle("left"), right = this.getStyle("right");
		
		var style = {};
		style[!left ? !right ? "left" : "right" : "left"] = x;
		style[!top ? !bottom ? "top" : "bottom" : "top"] = y;
		
		return this.setStyle(style).resize(width,height);
	};
	
	// missing in Firefox... not sure how to add this yet
	function contains(element) {
		return !!(this.compareDocumentPosition(element) & 16);
	};
	
	// exposed methods
	return {
		// classes
		"hasClass": hasClass,
		"addClass": addClass,
		"removeClass": removeClass,
		"toggleClass": toggleClass,
		
		// child nodes
		"childElements": childElements,
		"firstElement": firstElement,
		"nextElement": nextElement,
		"prevElement": previousElement,
		"previousElement": previousElement,
		"lastElement": lastElement,
		"firstText": firstText,
		"nextText": nextText,
		"previousText": previousText,
		"lastText": lastText,
		
		// comparison
		"offset": offset,
		
		// positioning
		"coordinates": coordinates,
		"dimensions": dimensions,
		"reposition": reposition,
		"resize": resize,
		
		// working with the DOM
		"amputate": amputate,
		"clone": clone,
	//	"remove": amputate,
		"dispose": dispose,
		"transplant": transplant,
		"insertAfter": insertAfter,
		
		// display and style
		"hide": hide,
		"show": show,
		"toggle": toggle,
		"isHidden": isHidden
	};
}.call(DOM));

/*****************************************************************************
*** Storage (prevents memory leaks) ******************************************
*****************************************************************************/
DOM.addMethods("*,#document,#window",function(){
	var STORAGE_CACHE = this.ELEMENT_STORAGE_CACHE = {};
	
	function emporium() {
		if (!this.__pseudoID) this.__pseudoID = Pseudo.unique();
		if (!STORAGE_CACHE[this.__pseudoID]) STORAGE_CACHE[this.__pseudoID] = {};
		return STORAGE_CACHE[this.__pseudoID];
	};
	function store(name,value) {
		var storage = this.emporium(), old = storage[name];
		if (old !== value) {
			storage[name] = value;
		//	this.raise(name +"changed",old);
		};
		return value;
	};
	function retrieve(name) {
		return this.emporium()[name];
	};
	function discard(name) {
		var storage = this.emporium(), value = storage[name];
		storage[name] = undefined;
		delete storage[name];
		return value;
	};
	
	return {
		"emporium": emporium,
		"store": store,
		"retrieve": retrieve,
		"discard": discard
	};
}.call(DOM));

/* ---------------------------------------------------------------------------
 * Form Element methods
 * -------------------------------------------------------------------------*/
(function(){
	function getFormQuery() {
		var query = [];
		this.inputs().each(function(input) { query.push(input.getQueryString()) });
		return query.join("&");
	};
	function inputs() { return this.query("input,select,textarea,button") };
	function enableForm() {
		this.query("input,select,textarea,button").invoke("enable");
		return this;
	};
	function disableForm() {
		this.query("input,select,textarea,button").invoke("disable");
		return this;
	};
	
	function enableInput() {
		this.disabled = false;
		return this;
	};
	function disableInput() {
		this.disabled = true;
		return this;
	};
	function toggleInput() {
		this.disabled = !this.disabled;
		return this;
	};
	function getSimpleValue() { return this.value || this.innerHTML };
	function setSimpleValue(value) {
		this.value = String(value);
		return this;
	};
	function getSelectValues() {
		var values = [];
		for (var i=0,o; o=this.options[i]; i++) if (o.selected) values.push(o.value);
		return values;
	};
	function setSelectValues() {
		var values = $A(arguments).flatten();
		for (var i=0,o; o=this.options[i]; i++) {
			if (values.contains(o.value)) o.selected = true;
			else if (o.selected) o.selected = false;
		};
		return this;
	};
	function getSelectValue() {
		return this.getValues().join(",");
	};
	function setSelectValue(value) {
		return this.setValues(String(value).split(","));
	};
	function getSimpleQuery() {
		return this.getAttribute("name") +"="+ escape(this.getValue());
	};
	function getSelectQuery() {
		var values = this.getValues();
		values.each(function(value,index) { values[index] = escape(value) });
		return this.getAttribute("name") +"="+ values.join(",");
	};
	function getInputQuery() {
		var str = [], type = this.getAttribute("type"), name = this.getAttribute("name");
		if (!name) return "";
		if (type === "checkbox") {
			str.push(name);
			str.push("=");
			str.push(this.checked);
		} else if (type === "radio") {
			if (this.checked) {
				str.push(name);
				str.push("=");
				str.push(this.value);
			};
		} else {
			str.push(getSimpleQuery.call(this));
		};
		return str.join("");
	};
	
	DOM.addMethods("form",{
		"disable": disableForm,
		"enable": enableForm,
		"getQueryString": getFormQuery,
		"inputs": inputs
	});
	DOM.addMethods("input,select,option,textarea,button",{
		"disable": disableInput,
		"enable": enableInput,
		"toggle": toggleInput
	});
	DOM.addMethods("textarea,button",{
		"getQueryString": getSimpleQuery,
		"getValue": getSimpleValue,
		"setValue": setSimpleValue
	});
	DOM.addMethods("select",{
		"getQueryString": getSelectQuery,
		"getValues": getSelectValues,
		"setValues": setSelectValues,
		"getValue": getSelectValue,
		"setValue": setSelectValue
	});
	DOM.addMethods("input",{
		"getQueryString": getInputQuery,
		"getValue": getSimpleValue,
		"setValue": setSimpleValue
	});
})();
function $F(element) {
	if (arguments.length > 1) {
		var values = [];
		for (var i=0,l=arguments.length; i<l; i++) values.push($F(arguments[i]));
		return values;
	};
	if (Object.isString(element)) element = $(element);
	return element.getValue();
};

/*****************************************************************************
*** Event handlers ***********************************************************
*****************************************************************************/
Object.extend(Event,function(){
	var	COPY_NODE_METHODS = Pseudo.DOM.COPY_NODE_METHODS,
		UNSUPPORTED_EVENTS = this.UNSUPPORTED_EVENTS = {},
		EVENT_METHODS_EXTENDED = 0,
		EVENT_METHODS = this.EVENT_METHODS = {
			"*": this.Native && (function(){
				var item = window.HTMLEvent, proto;
				if (item) proto = item.prototype;
				if (!proto) {
					item = window.Event;
					if (item) proto = item.prototype;
				};
				if (!proto) {
					item = document.createEvent ? document.createEvent("HTMLEvents") : document.createEventObject();
					if (item) proto = Object.getPrototypeOf(item);
				};
				item = null;
				return proto;
			})() || {}
		},
		KEYCODES = {
			"BACK": 8,
			"BACKSPACE": 8,
			"TAB": 9,

			"ENT": 13,
			"ENTER": 13,
			"RETURN": 13,
			"SHIFT": 16,
			"CTRL": 17,
			"CONTROL": 17,
			"ALT": 18,
			"ALTERNATE": 18,
			"PAUSE": 19,
			"BREAK": 19,

			"ESC": 27,
			"ESCAPE": 27,

			"PAGEUP": 33,
			"PAGEDOWN": 34,
			"END": 35,
			"HOME": 36,
			"LEFT": 37,
			"UP": 38,
			"RIGHT": 39,

			"DOWN": 40,
			"INSERT": 45,
			"DEL": 46,
			"DELETE": 46,

			// not standard
			"LEFT_WINDOWS": 91,
			"RIGHT_WINDOWS": 92,
			"CONTEXT": 93,
			"NUMLOCK": 144,
			"SCROLLLOCK": 145
		};

	function findEventClass(eventName) {
		switch (eventName) {
		//	case "DOMContentLoaded": return "Event";
		
			case "abort":
			case "beforeunload":
			case "blur":
			case "change":
			case "error":
			case "focus":
			case "load":
			case "reset":
			case "resize":
			case "scroll":
			case "select":
			case "submit":
			case "unload": return "HTMLEvents";
			
			case "keypress":
			case "keyup":
			case "keydown": return "KeyboardEvent";
			
			case "click":
			case "dblclick":
			case "mousedown":
			case "mousemove":
			case "mouseout":
			case "mouseover":
			case "mouseup": return "MouseEvent";
			
			case "DOMActivate":
			case "DOMFocusIn":
			case "DOMFocusOut": return "UIEvents";
			
			case "DOMAttrModified":
			case "DOMNodeInserted":
			case "DOMNodeRemoved":
			case "DOMCharacterDataModified":
			case "DOMNodeInsertedIntoDocument":
			case "DOMNodeRemovedFromDocument":
			case "DOMSubtreeModified": return "MutationEvents";
		};
		return "Event";
	};
	
	// extend event prototype
	function addMethods(methods) {
		COPY_NODE_METHODS(EVENT_METHODS["*"],methods);
		return EVENT_METHODS_EXTENDED = Pseudo.unique();
	};
	
	// extend event instance
	function extend(event) {
		if (!event.__pseudoID || event.__pseudoID < EVENT_METHODS_EXTENDED) {
			Object.expand(event,EVENT_METHODS["*"]);
			event.__pseudoID = Pseudo.unique();
		};
		return event;
	};
	function registerCustom(eventName,nodeName) {
		if (eventName.startsWith("on")) eventName = eventName.substring(2);
		
		var tags = UNSUPPORTED_EVENTS[eventName];
		if (!tags) tags = UNSUPPORTED_EVENTS[eventName] = [];
		
		if (!nodeName) tags.push("*");
		else if (!tags.contains(nodeName)) tags.push(nodeName);
		return this;
	};
	
	
	// exposed methods
	return Object.extend(this,{
		"KeyCodes": KEYCODES,
		"findClass": findEventClass,
		"addMethods": addMethods,
		"extend": this.Native ? Pseudo.um : extend,
		"custom": registerCustom
	});
}.call(Pseudo.Event));


/*****************************************************************************
*** Event Helper Methods *****************************************************
*****************************************************************************/
Event.addMethods(function(){
	var docEl = document.documentElement, eventsTargetFix = ["load","error","click"];
	var BUTTON_CODES = this.ButtonCodes = { "1": "left", "3": "right", "2": "middle" };
	if (Pseudo.Browser.IE) Object.extend(BUTTON_CODES,{ "0": "left", "2": "right", "4": "middle" });
	
	function cancel() {
		if (this.stopPropagation) this.stopPropagation();
		this.cancelBubble = true;
		this.__cancelled = true;
	};
	function prevent() {
		if (this.preventDefault) this.preventDefault();
		this.returnValue = false;
		this.__preventted = true;
	};
	function stop() {
		this.cancel();
		this.prevent();
	};
	function element() {
		var element = this.target || this.srcElement, current = this.currentTarget;
		if (current && current.nodeName && eventsTargetFix.contains(this.type)) {
			if (current.nodeName.toLowerCase() === "input" && current.type === "radio") element = current;
		};
		return DOM.extend(!Object.isTextNode(element) ? element : element.parentNode);
	};
	function related() {
		return DOM.extend(this.relatedTarget || this.fromElement || this.toElement);
	};
	function pointer() {
		var body = document.body || { "scrollTop": 0, "scrollLeft": 0 };
		return {
			"y": this.pageY || (this.clientY + (body.scrollTop || docEl.scrollTop) - (docEl.clientTop || 0)),
			"x": this.pageX || (this.clientX + (body.scrollLeft || docEl.scrollLeft) - (docEl.clientLeft || 0))
		};
	}
	function click() {
		var button = BUTTON_CODES[this.which || this.button];
		if (button === "left") {
			if (this.type === "contextmenu") button = "right";
			else if (this.metaKey === true) button = "middle";
		};
		return button;
	};
	function isLeft() { return this.click() === "left" };
	function isMiddle() { return this.click() === "middle" };
	function isRight() { return this.click() === "right" };
	
	// exposed methods
	return this.Prototypes = {
		"element": element,
		"isLeft": isLeft,
		"isMiddle": isMiddle,
		"isRight": isRight,
		"pointer": pointer,
		"related": related,
		"click": click,
		"cancel": cancel,
		"prevent": prevent,
		"stop": stop
	};
}.call(Pseudo.Event));


/*****************************************************************************
*** DOM Event Handling *******************************************************
*****************************************************************************/
DOM.addMethods("*,#document,#window",function(){
	var NOT_A_FUNCTION = function(target,handler,eventName,useCapture) {
		return {
			"message": "element.addHandler: handler not a Function.",
			"target": target,
			"event": eventName,
			"handler": handler,
			"useCapture": !!useCapture
		};
	};
	var UNSUPPORTED_EVENTS = this.UNSUPPORTED_EVENTS;
	
	// storage
	function getHandlerStorage(element) {
		var handlers = element.retrieve("__pseudo hanlders");
		if (!handlers) handlers = element.store("__pseudo hanlders",{});
		return handlers;
	};
	function getEventStorage(handlers,eventName,useCapture) {
		var storeName = eventName + (!useCapture ? " false" : " true"), listeners = handlers[storeName];
		if (!listeners) listeners = handlers[storeName] = [];
		return listeners;
	};
	
	// utility
	function isHandled(eventName,handler,useCapture) {
		var listeners = getEventStorage(getHandlerStorage(this),eventName,useCapture);
		for (var i=0,e; e=listeners[i]; i++) if (e === handler) return true;
		return false;
	};
	function wrapHandler(scope,eventName,handler) {
		return Object.extend(function(e) {
			var occurrence = Event.extend(e || window.event);
			if (eventName !== occurrence.type) {
				if (occurrence.eventName !== eventName) return;
				else if (occurrence.applicableTag === "*") {/* good to go */}
				else if (Object.isElement(scope) && occurrence.applicableTag !== scope.nodeName.toLowerCase()) return;
				else if (Object.isDocument(scope) && occurrence.applicableTag !== "#document") return;
				else if (Object.isWindow(scope) && occurrence.applicableTag !== "#window") return;
			};
			handler.call(scope,occurrence);
		},{
			"__scope": scope,
			"__eventName": eventName,
			"__handler": handler
		});
	};
	function findHandler(listeners,scope,handler) {
		for (var i=0,h; h=listeners[i]; i++) {
			if (h === handler || h.__handler === handler && h.__scope === scope) return i;
		};
	};
	
	
	// listeners implementation
	function addHandler(eventName,handler,useCapture) {
		if (Object.isArray(handler)) {
			for (var i=0,l=handler.length; i<l; i++) this.handle(eventName,handler[i],useCapture);
			return this;
		} else if (!Object.isFunction(handler)) {
			throw NOT_A_FUNCTION(this,handler,eventName,useCapture);
		} else if (eventName.startsWith("on")) {
			eventName = eventName.substring(2);
		};
		useCapture = !!useCapture;
		
		var listeners = getEventStorage(getHandlerStorage(this),eventName,useCapture);
		if (!isNaN(findHandler(listeners,this,handler))) return;	// no duplicates
		
		var tag, tags = UNSUPPORTED_EVENTS[eventName];
		if (tags) {
			if (tags.contains("*")) tag = "*";
			else if (Object.isElement(this)) tag = this.nodeName.toLowerCase();
			else if (Object.isDocument(this)) tag = "#document";
			else if (Object.isWindow(this)) tag = "#window";
			if (tag && tags.contains(tag)) {
				handler = wrapHandler(this,eventName,handler);
				eventName = "dataavailable";
			};
		};
		
		this.addEventListener(eventName,handler,useCapture);
		listeners.push(handler);
		
		return this;
	};
	function removeHandler(eventName,handler,useCapture) {
		if (handler && !Object.isFunction(handler)) throw NOT_A_FUNCTION(this,handler,eventName,useCapture);
		
		var tag, handlers = getHandlerStorage(this);
		if (!eventName) {
			for (var each in handlers) {
				if (Object.isUndefined(useCapture) || each.endsWith(" "+ String(useCapture))) {
					eventName = each.split(" ")[0];
					var tags = UNSUPPORTED_EVENTS[eventName];
					if (tags) {
						if (!tag) {
							if (tags.contains("*")) tag = "*";
							else if (Object.isElement(this)) tag = this.nodeName.toLowerCase();
							else if (Object.isDocument(this)) tag = "#document";
							else if (Object.isWindow(this)) tag = "#window";
						};
						if (tag && tags.contains(tag)) eventName = "dataavailable";
					};
					for (var i=0,h; h=handlers[each][i]; i++) {
						this.removeEventListener(eventName,h,String(useCapture) === "true");
					};
				};
			//	handlers[each].clear();
				delete handlers[each];
			};
		} else {
			if (eventName.startsWith("on")) eventName = eventName.substring(2);
			useCapture = !!useCapture;
			
			var tags = UNSUPPORTED_EVENTS[eventName];
			var listeners = getEventStorage(handlers,eventName,useCapture);
			if (tags) {
				if (tags.contains("*")) tag = "*";
				else if (Object.isElement(this)) tag = this.nodeName.toLowerCase();
				else if (Object.isDocument(this)) tag = "#document";
				else if (Object.isWindow(this)) tag = "#window";
				if (tag && tags.contains(tag)) eventName = "dataavailable";
			};
			if (!handler) {
				for (var i=0,h; h=listeners[i]; i++) this.removeEventListener(eventName,h,useCapture);
				listeners.clear();
			} else {
				var index = findHandler(listeners,this,handler);
				if (index >= 0) {
					this.removeEventListener(eventName,listeners[index],useCapture);
					listeners.removeAt(index);
				};
			};
		};
		
		return this;
	};
	
	// attachment implementation
	function attachHandler(eventName,handler) {
		if (Object.isArray(handler)) {
			for (var i=0,l=handler.length; i<l; i++) this.handle(eventName,handler[i]);
			return this;
		} else if (!Object.isFunction(handler)) {
			throw NOT_A_FUNCTION(this,handler,eventName,false);
		} else if (eventName.startsWith("on")) {
			eventName = eventName.substring(2);
		};
		
		var listeners = getEventStorage(getHandlerStorage(this),eventName,false);
		if (!isNaN(findHandler(listeners,this,handler))) return;	// no duplicates
		
		handler = wrapHandler(this,eventName,handler);
		var tag, tags = UNSUPPORTED_EVENTS[eventName];
		if (tags) {
			if (tags.contains("*")) tag = "*";
			else if (Object.isElement(this)) tag = this.nodeName.toLowerCase();
			else if (Object.isDocument(this)) tag = "#document";
			else if (Object.isWindow(this)) tag = "#window";
			if (tag && tags.contains(tag)) eventName = "dataavailable";
		};
		
		this.attachEvent("on"+ eventName,handler);
		listeners.push(handler);
		
		return this;
	};
	function detachHandler(eventName,handler) {
		if (handler && !Object.isFunction(handler)) throw NOT_A_FUNCTION(this,handler,eventName,false);
		
		var tag, handlers = getHandlerStorage(this);
		if (!eventName) {
			for (var each in handlers) {
				eventName = each.split(" ")[0];
				var tags = UNSUPPORTED_EVENTS[eventName];
				if (tags) {
					if (!tag) {
						if (tags.contains("*")) tag = "*";
						else if (Object.isElement(this)) tag = this.nodeName.toLowerCase();
						else if (Object.isDocument(this)) tag = "#document";
						else if (Object.isWindow(this)) tag = "#window";
					};
					if (tag && tags.contains(tag)) eventName = "dataavailable";
				};
				for (var i=0,h; h=handlers[each][i]; i++) this.detachEvent("on"+ eventName,h);
			//	handlers[each].clear();
				delete handlers[each];
			};
		} else {
			if (eventName.startsWith("on")) eventName = eventName.substring(2);
			
			var tags = UNSUPPORTED_EVENTS[eventName];
			var listeners = getEventStorage(handlers,eventName,false);
			if (tags) {
				if (tags.contains("*")) tag = "*";
				else if (Object.isElement(this)) tag = this.nodeName.toLowerCase();
				else if (Object.isDocument(this)) tag = "#document";
				else if (Object.isWindow(this)) tag = "#window";
				if (tag && tags.contains(tag)) eventName = "dataavailable";
			};
			if (!handler) {
				for (var i=0,h; h=listeners[i]; i++) this.detachEvent("on"+ eventName,h);
				listeners.clear();
			} else {
				var index = findHandler(listeners,this,handler);
				if (index >= 0) {
					this.detachEvent("on"+ eventName,listeners[index]);
					listeners.removeAt(index);
				};
			};
		};
		
		return this;
	};
	
	// raising events
	function dispatchHandler(eventName,options) {
		var tag, tags = UNSUPPORTED_EVENTS[eventName];
		if (tags) {
			if (tags.contains("*")) tag = "*";
			else if (Object.isElement(this)) tag = this.nodeName.toLowerCase();
			else if (Object.isDocument(this)) tag = "#document";
			else if (Object.isWindow(this)) tag = "#window";
		};
		var className = Event.findClass(tag ? "dataavailable" : eventName);
		var event = Object.extend(document.createEvent(className),{
			"eventName": eventName,
			"applicableTag": tag
		});
		
		if (!options) options = {};
		switch (className) {
			case "UIEvents": {
				event.initEvent(
					tag ? "dataavailable" : eventName,
					options.canBubble || options.bubble || options.bubbles || true,
					options.cancelable || options.cancel || true,
					options.windowObject || options.window || window,
					options.detail || options.details
				);
				break;
			}
			case "KeyboardEvent": {
				event.initKeyEvent(
					tag ? "dataavailable" : eventName,
					options.canBubble || options.bubble || options.bubbles || true,
					options.cancelable || options.cancel || true,
					options.windowObject || options.window || window,
					!!options.ctrlKey,
					!!options.altKey,
					!!options.shiftKey,
					!!options.metaKey,
					parseInt(options.keyCode || options.key) || 0,
					parseInt(options.charCode || options.char) || 0
				);
				break;
			}
			case "MouseEvents": {
				event.initMouseEvent(
					tag ? "dataavailable" : eventName,
					options.canBubble || options.bubble || options.bubbles || true,
					options.cancelable || options.cancel || true,
					options.windowObject || options.window || window,
					options.screenX || 0,	// get screen position
					options.screenY || 0,	// get screen position
					options.clientX || 0,	// get element position
					options.clientY || 0,	// get element position
					!!options.ctrlKey,
					!!options.altKey,
					!!options.shiftKey,
					!!options.metaKey,
					options.button || 1,	// left button different in IE... fix
					options.relatedTarget || null
				);
				break;
			}
			case "MutationEvents": {
				event.initMutationEvent(
					tag ? "dataavailable" : eventName
					// the rest here is a mystery so far
				);
				break;
			}
			default: {
				event.initEvent(
					tag ? "dataavailable" : eventName,
					options.canBubble || options.bubble || options.bubbles || true,
					options.cancelable || options.cancel || true
				);
				Object.extend(event,{
					"relatedTarget": options.relatedTarget || null,
					"screenX": options.screenX || 0,
					"screenY": options.screenY || 0,
					"clientX": options.clientX || 0,
					"clientY": options.clientY || 0,
					"ctrlKey": !!options.ctrlKey ,
					"altKey": !!options.altKey,
					"shiftKey": !!options.shiftKey,
					"metaKey": !!options.metaKey,
					"button": options.button || 0,
					"detail": options.detail || options.details || null
				});
				break;
			}
		};
		return this.dispatchEvent(event);
	};
	function fireHandler(eventName,options) {
		if (eventName.startsWith("on")) eventName = eventName.substring(2);
		var event = Object.extend(
			document.createEventObject(),
			{ "eventName": eventName }
		);
		if (options) {
			Object.extend(event,{
				"bubbles": options.canBubble || options.bubble || options.bubbles || true,
				"fromElement": options.relatedTarget || null,
				"screenX": options.screenX || 0,
				"screenY": options.screenY || 0,
				"clientX": options.clientX || 0,
				"clientY": options.clientY || 0,
				"ctrlKey": !!options.ctrlKey ,
				"altKey": !!options.altKey,
				"shiftKey": !!options.shiftKey,
				"metaKey": !!options.metaKey,
				"button": options.button || 0,
				"detail": options.detail || options.details || null
			});
		};
		
		var tags = UNSUPPORTED_EVENTS[eventName];
		if (tags) {
			if (tags.contains("*")) event.applicableTag = "*";
			else if (Object.isElement(this)) event.applicableTag = this.nodeName.toLowerCase();
			else if (Object.isDocument(this)) event.applicableTag = "#document";
			else if (Object.isWindow(this)) event.applicableTag = "#window";
			if (event.applicableTag) eventName = "ondataavailable";
		};
		
		return this.fireEvent(eventName,event);
	};
	
	// exposed methods
	return {
		"handle": document.addEventListener ? addHandler : attachHandler,
		"fumble": document.removeEventListener ? removeHandler : detachHandler,
		"raise": document.createEvent ? dispatchHandler : fireHandler,
		"isHandled": isHandled
	/*
		"addHandler": addHandler,
		"removeHandler": removeHandler,
		"dispatchHandler": dispatchHandler,
		"attachHandler": attachHandler,
		"detachHandler": detachHandler,
		"fireHandler": fireHandler
	*/
	};
}.call(Pseudo.Event));


/*****************************************************************************
*** Utility methods $() and $$() *********************************************
*****************************************************************************/
function $(element) {
	if (arguments.length > 1) {
		var elements = [];
		for (var i=0,l=arguments.length; i<l; i++) elements.push($(arguments[i]));
		return elements;
	};
	if (Object.isString(element)) element = document.getElementById(element);
	return DOM.extend(element);
};
function $$(cssText) {
	return document.query(cssText);
};

/*****************************************************************************
*** pseudo-compatibility fakeout *********************************************
*****************************************************************************/
if (Pseudo.Browser.IE) (function(){
//	DOM.extend(window,document);
	var version = this.BrowserVersion.toNumber();
	
	// prevent background-image from reloading from :hover style
	if (version < 7) document.execCommand("BackgroundImageCache",false,true);
	
	// pseudo-event; content loaded (implemented in IE9)
	if (version < 9) {
		Event.custom("DOMContentLoaded","#document");
		(function(){
			try {
				document.documentElement.doScroll("left");
				document.raise("DOMContentLoaded");
			} catch(e) { setTimeout(arguments.callee,1) };
		})();
	};
}).call(Pseudo);
/*
else if (Pseudo.Engine.Webkit) (function(){	// older versions
	Event.custom("DOMContentLoaded","#document");
	var timer = setInterval(function(){
		if (document.readyState === "loaded" || document.readyState === "complete") {
			clearInterval(timer);
			document.raise("DOMContentLoaded");
		};
	},0);
	window.handle("load",function() {
		clearInterval(timer);
	});
}).call(Pseudo);
*/
