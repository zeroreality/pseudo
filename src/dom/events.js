/// <reference path="..\..\blds\pseudo3.js" />

var BUTTON_CODES = {
	"1": "left",
	"2": "middle",
	"3": "right",
};
if (WIN["ScriptEngineMajorVersion"] instanceof Function) {
	BUTTON_CODES["0"] = "left";
	BUTTON_CODES["4"] = "middle";
}

/**
 * A mapping of all keyboard keys to their corresponding event codes.
 * @type {Object.<string,number>}
 */
var KEYCODES = {
	"escape": 27,
	"tab": 9,
	"capslock": 20,
	"shift": 16,
	"control": 17,
	"alt": 18,
	"backspace": 8,
	"enter": 13,
	"space": 32,

	//	"printscreen": never fired
	"scrolllock": 145,
	"pause": 19,
	"cancel": 19,
	"break": 19,

	"insert": 45,
	"delete": 46,
	"home": 36,
	"end": 35,
	"pageup": 33,
	"pagedown": 34,

	// arrow keys
	"arrowleft": 37,
	"arrowup": 38,
	"arrowright": 39,
	"arrowdown": 40,

	// numpad
	"numlock": 144,
	"divide": 111,
	"multiply": 106,
	"subtract": 109,
	"numpad7": 103,
	"numpad8": 104,
	"numpad9": 105,
	"add": 107,
	"numpad4": 100,
	"numpad5": 101,
	"numpad6": 102,
	"clear": 12,
	"numpad1": 97,
	"numpad2": 98,
	"numpad3": 99,
	"numpad0": 96,
	"dot": 110,	// decimal point

	// windows keys (left and right)
	"windows": 91,
	//	"windows": 92,

	"select": 93,

	"f1": 112,
	"f2": 113,
	"f3": 114,
	"f4": 115,
	"f5": 116,
	"f6": 117,
	"f7": 118,
	"f8": 119,
	"f9": 120,
	"f10": 121,
	"f11": 122,
	"f12": 123,

	// keyboard hax
	";": 186,
	"=": 187,
	",": 188,
	"-": 189,
	".": 190,
	"/": 191,
	"`": 192,
	"[": 219,
	"]": 221,
	"\\": 220,
	"'": 222,
};
/**
 * Unused klass to trick Closure into keeping the "handler" and "capture" attributes
 * @constructor
 */
function handlerPair(handler, capture) {
	/** @expose */
	this.handler = handler;
	/** @expose */
	this.capture = !!capture;
}

/**
 * @this {handlerPair}
 * @return {boolean}
 */
function handlerFinder(pair) {
	return pair.handler === this.handler && pair.capture === this.capture;
}
/**
 * @param {Element} element
 * @param {!string} type
 * @param {!Function} handler
 * @param {!boolean=} capture
 */
function handlerAdd(element, type, handler, capture) {
	var pair = {
		"handler": handler,
		"capture": !!capture,
	};
	element.__handlers[type].push(pair);
	element.addEventListener(type, handler, !!capture);
}
/**
 * @param {Element} element
 * @param {!string} type
 * @param {!Function} handler
 * @param {!boolean=} capture
 */
function handlerRemove(element, type, handler, capture) {
	var pair = { "handler": handler, "capture": capture },
		index = element.__handlers[type].findIndex(handlerFinder, pair);
	element.__handlers[type].removeAt(index);
	element.removeEventListener(type, handler, capture);
}
/**
 * @param {Object} definition
 * @param {!string} definition.init
 * @param {!string} definition.type
 * @param {boolean=} definition.bubbles
 * @param {boolean=} definition.cancelable
 * @param {Window=} definition.view
 * @param {number=} definition.detail
 * @param {number=} definition.screenX
 * @param {number=} definition.screenY
 * @param {number=} definition.clientX
 * @param {number=} definition.clientY
 * @param {boolean=} definition.ctrlKey
 * @param {boolean=} definition.altKey
 * @param {boolean=} definition.shiftKey
 * @param {boolean=} definition.metaKey
 * @param {boolean=} definition.ctrlKey
 * @param {number=} definition.button
 * @param {number=} definition.keyCode
 * @param {number=} definition.charCode
 * @param {Node=} definition.relatedTarget
 * @param {Node=} definition.relatedNode
 * @param {string=} definition.prevValue
 * @param {string=} definition.newValue
 * @param {string=} definition.attrName
 * @param {number=} definition.attrChange
 * @return {!Event}
 */
function handlerEvent(definition) {
	var event, init = definition["init"] || "html";
	if (!("bubbles" in definition)) definition["bubbles"] = true;
	if (!("cancelable" in definition)) definition["cancelable"] = true;
	switch (init) {
		case "mouse":
			event = DOC.createEvent("MouseEvents");
			event.initMouseEvent(
				definition["type"],
				!!definition["bubbles"],
				!!definition["cancelable"],
				definition["view"] || WIN,
				INT(definition["detail"], 10) || 0,
				INT(definition["screenX"], 10) || 0,
				INT(definition["screenY"], 10) || 0,
				INT(definition["clientX"], 10) || 0,
				INT(definition["clientY"], 10) || 0,
				!!definition["ctrlKey"] || false,
				!!definition["altKey"] || false,
				!!definition["shiftKey"] || false,
				!!definition["metaKey"] || false,
				INT(definition["button"], 10) || -1,
				definition["relatedTarget"] || null
			);
			break;
		case "key":
		case "keyboard":
			event = DOC.createEvent("KeyboardEvents");
			event.initKeyboardEvent(
				definition["type"],
				!!definition["bubbles"],
				!!definition["cancelable"],
				definition["view"] || WIN,
				!!definition["ctrlKey"] || false,
				!!definition["altKey"] || false,
				!!definition["shiftKey"] || false,
				!!definition["metaKey"] || false,
				INT(definition["keyCode"], 10) || -1,
				INT(definition["charCode"], 10) || -1
			);
			break;
		/*
				case "KeyboardEvent":
				case "KeyboardEvents":
					event.initKeyboardEvent(
						definition["type"],
						!!definition["bubbles"],
						!!definition["cancelable"],
						definition["view"] || WIN,
						INT(definition["keyCode"], 10) || -1,
						INT(definition["charCode"], 10) || -1,
						FLOAT(definition["location"]) || -1,
		
						!!definition["ctrlKey"] || false,
						!!definition["altKey"] || false,
						!!definition["shiftKey"] || false,
						!!definition["metaKey"] || false,
						!!definition["repeat"] || false,
					);
					break;
		*/
		case "ui":
			event = DOC.createEvent("UIEvents");
			event.initUIEvent(
				definition["type"],
				!!definition["bubbles"],
				!!definition["cancelable"],
				definition["view"] || WIN,
				INT(definition["detail"], 10) || 0
			);
			break;
		case "mutation":
			event = DOC.createEvent("MutationEvents");
			event.initMutationEvent(
				definition["type"],
				!!definition["bubbles"],
				!!definition["cancelable"],
				definition["relatedNode"] || null,
				definition["prevValue"] || null,
				definition["newValue"] || null,
				definition["attrName"] || null,
				INT(definition["attrChange"], 10) || 0
			);
			break;
		default:
			event = DOC.createEvent("HTMLEvents");
			event.initEvent(
				definition["type"],
				!!definition["bubbles"],
				!!definition["cancelable"]
			);
			break;
	}
	return event;
}
/**
 * @this {Element}
 * @expose
 * @param {!string} type
 * @param {!Array.<!Function>|Function=} handler
 * @param {!boolean=} capture
 * @return {!Element} this
 */
HTMLElement_prototype.on = function(type, handler, capture) {
	if (handler instanceof Array) {
		for (var i = 0, l = handler.length; i < l; i++) {
			this.on(type, handler[i], capture);
		}
	} else if (handler instanceof Function) {
		if (!this.__handlers) this.__handlers = {};
		if (!this.__handlers[type]) this.__handlers[type] = [];
		handlerAdd(this, type, handler, !!capture);
	} else {
		throw new TypeError("handler not an instance of a Function");
	}
	return this;
};
/**
 * @this {Element}
 * @expose
 * @param {!string} type
 * @param {!Array.<!Function>|Function=} handler
 * @param {!boolean=} capture
 * @return {!Element} this
 */
HTMLElement_prototype.once = function(type, handler, capture) {
	function onceAndForAll() {
		this.off(type, handler, capture);
		this.off(type, onceAndForAll, capture);
	}
	this.on(type, handler, capture);
	this.on(type, onceAndForAll, capture);
	return this;
};
/**
 * @this {Element}
 * @expose
 * @param {!string} type
 * @param {!Array.<!Function>|Array.<!handlerPair>|Function=} handler
 * @param {!boolean=} capture
 * @return {!Element} this
 */
HTMLElement_prototype.off = function(type, handler, capture) {
	if (!this.__handlers) {
		// do nothing I guess
	} else if (!arguments.length) {
		var keys = GET_KEYS(this.__handlers);
		for (var i = 0, l = keys.length; i < l; i++) {
			this.off(keys[i]);
		}
	} else if (handler instanceof Array) {
		for (var i = 0, l = handler.length; i < l; i++) {
			this.off(type, handler[i].handler || handler[i], typeof capture === "boolean" ? capture : handler[i].capture);
		}
	} else if (!handler) {
		if (this.__handlers[type] instanceof Array) {
			this.off(type, this.__handlers[type].copy(), capture);
		}
	} else if (handler instanceof Function) {
		if (this.__handlers[type] instanceof Array) {
			handlerRemove(this, type, handler, !!capture);
		}
	} else {
		throw new TypeError("handler not an instance of a Function");
	}
	return this;
};
/**
 * @this {Element}
 * @expose
 * @param {string|Object} event
 * @return {!Event}
 */
HTMLElement_prototype.fire = function(event) {
	var e = handlerEvent(OBJECT_IS_STRING(event) ? { "type": event } : event);
	this.dispatchEvent(e);
	return e;
};
/**
 * @this {Element}
 * @expose
 * @param {string} type
 * @param {Function} handler
 * @param {boolean=} capture
 * @return {!boolean}
 */
HTMLElement_prototype.uses = function(type, handler, capture) {
	return this.__handlers && this.__handlers[type] ? this.__handlers[type].findIndex(handlerFinder, {
		"handler": handler,
		"capture": !!capture
	}) > -1 : false;
};

// add to SVG elements as well
//SVGElement_prototype.on = HTMLElement_prototype.on;
//SVGElement_prototype.off = HTMLElement_prototype.off;
//SVGElement_prototype.fire = HTMLElement_prototype.fire;
//SVGElement_prototype.uses = HTMLElement_prototype.uses;

/**
 * 
 * @this {Event}
 * @expose
 * @return {boolean} false
 */
Event_prototype.cancel = function() {
	this.unselect();
	this.stopPropagation();
	this.preventDefault();
	return this.returnValue = false;
};
/**
 * Verifies the mousebutton clicked.
 * @this {Event}
 * @expose
 * @return {string} "left", "right", or "middle"
 */
Event_prototype.click = function() {
	var button = BUTTON_CODES[this.which || this.button];
	if (this.type === "contextmenu") button = "right";
	if (button === "left" && this.metaKey === true) button = "middle";
	return button;
};
/**
 * 
 * @this {Event}
 * @expose
 * @return {number}
 */
Event_prototype.getKey = function() {
	return KEYCODES[(this.code || this.key || "").toLowerCase()]
		|| String.fromCharCode(this.keyCode).toUpperCase().charCodeAt(0);
};
/**
 * Removes selection from text
 * @this {Event}
 * @expose
 */
Event_prototype.unselect = function() {
	WIN.getSelection().removeAllRanges();
};
