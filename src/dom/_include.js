/// <reference path="..\..\blds\pseudo3.js" />
"use strict";

/** @type {string} */
var SVGNS = "http://www.w3.org/2000/svg";

/** @type {Window} */
var WIN = window;
/** @type {Navigator} */
var NAV = navigator;
/** @type {Document} */
var DOC = document;
/** @type {Location} */
var LOC = DOC.location;
/** @type {!Element} */
var DOC_EL = DOC.documentElement;
/** @type {HTMLBodyElement} */
var BODY = DOC.body;
/** @type {History} */
var HISTORY = WIN.history;
/** @type {Storage.<string,string>} */
var STORAGE = WIN.localStorage;
/** @type {DOMApplicationCache} */
var CACHE = WIN.applicationCache;

var HTMLElement_prototype = Element[PROTOTYPE],
	//	SVGElement_prototype = SVGElement[PROTOTYPE],
	Event_prototype = Event[PROTOTYPE],
	DOM_PREFIXES = ["webkit", "moz", "ms", "o"],
	DOM_QUERY_MATCHES = "matchesSelector",
	DOM_TRANSFORM = "transform",
	l = DOM_PREFIXES.length,
	i = 0;
for (i = 0; i < l && typeof DOC_EL.style[DOM_TRANSFORM] !== "string"; i++) {
	DOM_TRANSFORM = DOM_PREFIXES[i] + "Transform";
}
for (i = 0; i < l && !HTMLElement_prototype[DOM_QUERY_MATCHES]; i++) {
	DOM_QUERY_MATCHES = DOM_PREFIXES[i] + "MatchesSelector";
}