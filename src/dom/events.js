/// <reference path="..\..\blds\pseudo3.js" />

/**
 * A mapping of mouse button codes to a button name.
 * @type {Object.<string,string>}
 */
var BUTTON_CODES = {
	"1": "left",
	"2": "middle",
	"3": "right",
};
if (OBJECT_IS_FUNCTION(WIN["ScriptEngineMajorVersion"])) {
	BUTTON_CODES["0"] = "left";
	BUTTON_CODES["4"] = "middle";
}

/**
 * A mapping of all keyboard keys to their corresponding event codes.
 * @const {Object.<string,number>}
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
 * 
 * @constructor
 */
function handlerPair(handler, capture) {
	/** @expose */
	this.handler = handler;
	/** @expose */
	this.capture = !!capture;
}

/**
 * 
 * @this {handlerPair}
 * @return {boolean}
 */
function handlerFinder(pair) {
	return pair.handler === this.handler && pair.capture === this.capture;
}
/**
 * 
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
 * 
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
 * Instantiates an Event of the given type and definition.
 * @param {Object} definition
 * @param {!string} definition.init		Can be "html", "mouse", "key"/"keyboard", "ui", or "mutation". Default is "html".
 * @param {!string} definition.type		The event.type. ie: "click", "keypress", "change", etc...
 * @param {boolean=} definition.bubbles		Default is true.
 * @param {boolean=} definition.cancelable	Default is true.
 * @param {Window=} definition.view		Used for mouse, keyboard, and UI events.
 * @param {number=} definition.detail		Used for mouse, and UI events.
 * @param {boolean=} definition.ctrlKey		Used for mouse, and keyboard events.
 * @param {boolean=} definition.altKey		Used for mouse, and keyboard events.
 * @param {boolean=} definition.shiftKey	Used for mouse, and keyboard events.
 * @param {boolean=} definition.metaKey		Used for mouse, and keyboard events.
 * @param {number=} definition.keyCode		Used for keyboard events.
 * @param {number=} definition.charCode		Used for keyboard events.
 * @param {number=} definition.screenX		Used for mouse events.
 * @param {number=} definition.screenY		Used for mouse events.
 * @param {number=} definition.clientX		Used for mouse events.
 * @param {number=} definition.clientY		Used for mouse events.
 * @param {number=} definition.button		Used for mouse events.
 * @param {Node=} definition.relatedTarget	Used for mouse events.
 * @param {Node=} definition.relatedNode	Used for mutation events.
 * @param {string=} definition.prevValue	Used for mutation events.
 * @param {string=} definition.newValue		Used for mutation events.
 * @param {string=} definition.attrName		Used for mutation events.
 * @param {number=} definition.attrChange	Used for mutation events.
 * @return {!Event}
 */
function handlerEvent(definition) {
	var event,
		init = definition["init"] || "html";
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
 * Adds the given function as an event handler to this element.
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
	} else if (OBJECT_IS_FUNCTION(handler)) {
		if (!this.__handlers) this.__handlers = {};
		if (!this.__handlers[type]) this.__handlers[type] = [];
		handlerAdd(this, type, handler, !!capture);
	} else {
		throw new TypeError("handler not an instance of a Function");
	}
	return this;
};
/**
 * Adds the given function as an event handler to this element, and after the event is fired, the handler is automatically removed.
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
 * Removes the given handlers from this element.
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
	} else if (OBJECT_IS_FUNCTION(handler)) {
		if (this.__handlers[type] instanceof Array) {
			handlerRemove(this, type, handler, !!capture);
		}
	} else {
		throw new TypeError("handler not an instance of a Function");
	}
	return this;
};
/**
 * Creates and fires an event based on the name or definition.
 * If the argument is a string, the event is raised as a simle html event.
 * Note: For mouse events like "click", the full definition must be specified to have the intended behaviour.
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
 * Checks this element to see if it uses the given function to handle the given event.
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
 * Cancels the event by stopping propagation, de-selecting any text ranges, preventing the default action, and returning false.
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
 * Returns the name of the mousebutton that was clicked.
 * @this {Event}
 * @expose
 * @return {string} "left", "right", or "middle"
 */
Event_prototype.click = function() {
	var button = this.type === "contextmenu"
			? "right"
			: BUTTON_CODES[this.which || this.button];
	if (button === "left" && this.metaKey === true) button = "middle";
	return button;
};
/**
 * Returns the char-code of the key pressed.
 * Note that letters are returned as their upper-case codes regardless of whether the shift key was being held.
 * @this {Event}
 * @expose
 * @return {number}
 */
Event_prototype.getKey = function() {
	return KEYCODES[(this.code || this.key || "").toLowerCase()]
		|| String.fromCharCode(this.keyCode).toUpperCase().charCodeAt(0);
};
/**
 * Removes selection from all text.
 * @this {Event}
 * @expose
 */
Event_prototype.unselect = function() {
	WIN.getSelection().removeAllRanges();
};

/**
 * Add these few functions to the document and window.
 */
["on", "once", "off", "fire", "uses", "ask", "query"].forEach(function(name) {
	DOC[name] = WIN[name] = HTMLElement_prototype[name];
});

/**
 * 
 * @namespace
 * @expose
 **/
ns.Event = {
	/**
	 * @expose
	 **/
	"buttons": BUTTON_CODES,
	/**
	 * @expose
	 **/
	"keys": KEYCODES,
};