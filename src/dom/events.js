/// <reference path="..\..\blds\pseudo3.js" />

/**
 * A mapping of mouse button codes to a button name.
 * @type {Object.<string,string>}
 */
var DOM_EVENT_BUTTON_CODES = {
	"1": "left",
	"2": "middle",
	"3": "right",
};
// additional for IE
if (OBJECT_IS_FUNCTION(WIN["ScriptEngineMajorVersion"])) {
	DOM_EVENT_BUTTON_CODES["0"] = "left";
	DOM_EVENT_BUTTON_CODES["4"] = "middle";
}

/**
 * A mapping of all keyboard keys to their corresponding event codes.
 * @const {Object.<string,number>}
 */
var DOM_EVENT_KEY_CODES = {
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
 * A container for an event handler function and event phase to which it is bound.
 * @constructor
 * @param {function(Event)} handler
 * @param {boolean=} phase
 **/
function HandlerPair(handler, phase) {
	/**
	 * A reference to the event handler.
	 * @type {function(Event)}
	 **/
	this.handler = handler;
	/**
	 * When true, the event handler is bound to the capture phase.
	 * When false, it's bound to the bubble phase.
	 * @type {!boolean}
	 **/
	this.phase = !!phase;
}

/**
 * Finds a HandlerPair that matches the event handler and the event phase.
 * Does not match by identity.
 * @this {HandlerPair}
 * @return {boolean}
 */
function DOM_EVENT_HANDLER_FINDER(pair) {
	return pair.handler === this.handler
		&& pair.phase === this.phase;
}
/**
 * Adds an event handler to this element, and makes a reference to it for later checking.
 * @param {Element} element
 * @param {!string} type
 * @param {!Function} handler
 * @param {!boolean=} phase
 */
function DOM_EVENT_HANDLER_ADDER(element, type, handler, phase) {
	var pair = new HandlerPair(handler, phase);
	element.__handlers[type].push(pair);
	element.addEventListener(type, pair.handler, pair.phase);
}
/**
 * Removes an event handler from this element, and also removes its reference.
 * @param {Element} element
 * @param {!string} type
 * @param {!Function} handler
 * @param {!boolean=} phase
 */
function DOM_EVENT_HANDLER_REMOVER(element, type, handler, phase) {
	var pair = new HandlerPair(handler, phase),
		index = element.__handlers[type].findIndex(DOM_EVENT_HANDLER_FINDER, pair);
	element.__handlers[type].removeAt(index);
	element.removeEventListener(type, pair.handler, pair.phase);
}

/**
 * The supported types of event initializations.
 * @enum {!string}
 **/
var EventDefinitionInitKinds = {
	/**
	 * 
	 **/
	"html": "html",
	/**
	 * 
	 **/
	"mouse": "mouse",
	/**
	 * 
	 **/
	"key": "keyboard",
	/**
	 * 
	 **/
	"keyboard": "keyboard",
	/**
	 * 
	 **/
	"ui": "ui",
};
/**
 * 
 * @constructor
 * @param {!string} type
 * @param {string=} init
 * @param {boolean=} bubbles
 * @param {boolean=} cancelable
 **/
function EventDefinition(type, init, bubbles, cancelable) {
	/**
	 * The event.type. ie: "click", "keypress", "change", etc...
	 * @type {!string}
	 **/
	this.type = type || "";
	/**
	 * 
	 * Default is "html".
	 * @type {!EventDefinitionInitKinds}
	 **/
	this.init = EventDefinitionInitKinds[init]
		|| (/mouse|click|contextmenu/gim).test(this.type)
		? EventDefinitionInitKinds.mouse
		: this.type.includes("key")
			? EventDefinitionInitKinds.keyboard
			: (/abort|unload|load|error|resize|scroll|select/gim).test(this.type)
				? EventDefinitionInitKinds.ui
				: EventDefinitionInitKinds.html;
	/**
	 * 
	 * Default is true.
	 * @type {!boolean}
	 **/
	this.bubbles = !OBJECT_IS_BOOLEAN(bubbles) || bubbles;
	/**
	 * 
	 * Default is true.
	 * @type {!boolean}
	 **/
	this.cancelable = !OBJECT_IS_BOOLEAN(cancelable) || cancelable;
}
/**
 * 
 * @constructor
 * @extends {EventDefinition}
 * @param {Object} definition
 **/
function EventDefinitionMouse(definition) {
	EventDefinition.call(
		this,
		definition["type"],
		definition["init"],
		definition["bubbles"],
		definition["cancelable"]
	);
	/**
	 * 
	 * @type {!Object}
	 **/
	this.view = definition["view"] || WIN;
	/**
	 * 
	 * @type {!number}
	 **/
	this.detail = definition["detail"] || 0;
	/**
	 * 
	 * @type {!boolean}
	 **/
	this.ctrlKey = !!definition["ctrlKey"];
	/**
	 * 
	 * @type {!boolean}
	 **/
	this.altKey = !!definition["altKey"];
	/**
	 * 
	 * @type {!boolean}
	 **/
	this.shiftKey = !!definition["shiftKey"];
	/**
	 * 
	 * @type {!boolean}
	 **/
	this.metaKey = !!definition["metaKey"];
	/**
	 * 
	 * @type {!number}
	 **/
	this.screenX = definition["screenX"] || 0;
	/**
	 * 
	 * @type {!number}
	 **/
	this.screenY = definition["screenY"] || 0;
	/**
	 * 
	 * @type {!number}
	 **/
	this.clientX = definition["clientX"] || 0;
	/**
	 * 
	 * @type {!number}
	 **/
	this.clientY = definition["clientY"] || 0;
	/**
	 * 
	 * @type {!number}
	 **/
	this.button = definition["button"] || 0;
}
/**
 * 
 * @constructor
 * @extends {EventDefinition}
 * @param {Object} definition
 **/
function EventDefinitionKeyboard(definition) {
	EventDefinition.call(
		this,
		definition["type"],
		definition["init"],
		definition["bubbles"],
		definition["cancelable"]
	);
	/**
	 * 
	 * @type {!Object}
	 **/
	this.view = definition["view"] || WIN;
	/**
	 * 
	 * @type {!boolean}
	 **/
	this.ctrlKey = !!definition["ctrlKey"];
	/**
	 * 
	 * @type {!boolean}
	 **/
	this.altKey = !!definition["altKey"];
	/**
	 * 
	 * @type {!boolean}
	 **/
	this.shiftKey = !!definition["shiftKey"];
	/**
	 * 
	 * @type {!boolean}
	 **/
	this.metaKey = !!definition["metaKey"];
	/**
	 *
	 * @type {!number}
	 **/
	this.keyCode = definition["keyCode"] || 0;
	/**
	 *
	 * @type {!number}
	 **/
	this.charCode = definition["charCode"] || 0;
}
/**
 * 
 * @constructor
 * @extends {EventDefinition}
 * @param {Object} definition
 **/
function EventDefinitionUi(definition) {
	EventDefinition.call(
		this,
		definition["type"],
		definition["init"],
		definition["bubbles"],
		definition["cancelable"]
	);
	/**
	 * 
	 * @type {!Object}
	 **/
	this.view = definition["view"] || WIN;
	/**
	 * 
	 * @type {!number}
	 **/
	this.detail = definition["detail"] || 0;
}

/**
 * Instantiates an Event of the given type and definition.
 * @param {EventDefinition} definition
 * @return {!Event}
 */
function DOM_EVENT_INIT(definition) {
	var event;
	if (!("bubbles" in definition)) definition["bubbles"] = true;
	if (!("cancelable" in definition)) definition["cancelable"] = true;
	switch (definition.init || EventDefinitionInitKinds.html) {
		case EventDefinitionInitKinds.mouse:
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
		case EventDefinitionInitKinds.key:
		case EventDefinitionInitKinds.keyboard:
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
		case EventDefinitionInitKinds.ui:
			event = DOC.createEvent("UIEvents");
			event.initUIEvent(
				definition["type"],
				!!definition["bubbles"],
				!!definition["cancelable"],
				definition["view"] || WIN,
				INT(definition["detail"], 10) || 0
			);
			break;
		case EventDefinitionInitKinds.html:
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
 * @param {!string|Array.<string>} type
 * @param {!Array.<function(Event)>|function(Event)} handler
 * @param {!boolean=} capture
 * @return {!Element} this
 */
HTMLElement_prototype.on = function(type, handler, capture) {
	if (OBJECT_IS_ARRAY(type)) {
		for (var i = 0, l = type.length; i < l; i++) {
			this.on(type[i], handler, capture);
		}
	} else if (OBJECT_IS_ARRAY(handler)) {
		for (var i = 0, l = handler.length; i < l; i++) {
			this.on(type, handler[i], capture);
		}
	} else if (OBJECT_IS_FUNCTION(handler)) {
		if (!this.__handlers) this.__handlers = {};
		if (!this.__handlers[type]) this.__handlers[type] = [];
		DOM_EVENT_HANDLER_ADDER(
			this,
			type,
			handler,
			capture
		);
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
 * @param {!Array.<function(Event)>|function(Event)} handler
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
 * @param {!Array.<!function(Event)>|Array.<!HandlerPair>|function(Event)=} handler
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
	} else if (OBJECT_IS_ARRAY(type)) {
		for (var i = 0, l = type.length; i < l; i++) {
			this.off(
				type[i],
				handler,
				capture !== undefined
					? capture
					: handler.phase
			);
		}
	} else if (OBJECT_IS_ARRAY(handler)) {
		for (var i = 0, l = handler.length; i < l; i++) {
			this.off(
				type,
				handler[i].handler || handler[i],
				capture !== undefined
					? capture
					: handler[i].phase
			);
		}
	} else if (!handler) {
		if (OBJECT_IS_ARRAY(this.__handlers[type])) {
			this.off(
				type,
				this.__handlers[type].slice(),
				capture
			);
		}
	} else if (OBJECT_IS_FUNCTION(handler)) {
		if (this.__handlers[type] instanceof Array) {
			DOM_EVENT_HANDLER_REMOVER(
				this,
				type,
				handler,
				capture
			);
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
 * @param {!string|EventDefinition|EventDefinitionMouse|EventDefinitionKeyboard|EventDefinitionMutant|EventDefinitionUi} event
 * @return {!Event}
 */
HTMLElement_prototype.fire = function(event) {
	var e = DOM_EVENT_INIT(
		OBJECT_IS_STRING(event)
			? new EventDefinition(event)
			: event
	);
	this.dispatchEvent(e);
	return e;
};
/**
 * Checks this element to see if it uses the given function to handle the given event.
 * @this {Element}
 * @expose
 * @param {string} type
 * @param {function(Event)} handler
 * @param {boolean=} capture
 * @return {!boolean}
 */
HTMLElement_prototype.uses = function(type, handler, capture) {
	return this.__handlers && this.__handlers[type]
		? this.__handlers[type].findIndex(DOM_EVENT_HANDLER_FINDER, new HandlerPair(handler, capture)) > -1
		: false;
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
			: DOM_EVENT_BUTTON_CODES[this.which || this.button];
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
	return DOM_EVENT_KEY_CODES[(this.key || "").toLowerCase()]
		|| String.fromCharCode(this.keyCode).toUpperCase().charCodeAt(0);
};
/**
 * Returns true when the Keyboard event's key produces a character.
 * True for Numbers, letters, and symbols; false for control characters.
 * @this {Event}
 * @expose
 * @return {boolean}
 */
Event_prototype.isContentKey = function() {
	return (this.key || "").length === 1;
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
	 * 
	 * @expose
	 **/
	"buttons": DOM_EVENT_BUTTON_CODES,
	/**
	 * 
	 * @expose
	 **/
	"keys": DOM_EVENT_KEY_CODES,
	/**
	 *
	 * @expose
	 **/
	"definitions": EventDefinitionInitKinds,

	// included so the export works properly
	EventDefinition: EventDefinition,
	EventDefinitionMouse: EventDefinitionMouse,
	EventDefinitionKeyboard: EventDefinitionKeyboard,
	EventDefinitionUi: EventDefinitionUi,
};
