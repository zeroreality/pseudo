/// <reference path="..\..\blds\pseudo3.js" />

/** @type {string} */
var SVGNS = "http://www.w3.org/2000/svg";

/** @type {Navigator} */
var NAV = navigator;
/** @type {Document} */
var DOC = document;
/** @type {!Element} */
var DOC_EL = DOC.documentElement;
/** @type {!Element} */
var DOC_HEAD = DOC.getElementsByTagName("head")[0] || DOC_EL.appendChild(DOC.createElement("head"));
/** @type {HTMLBodyElement} */
var BODY = DOC.body;
/** @type {History} */
var HISTORY = SELF.history;
/** @type {Storage.<string,string>} */
var STORAGE = SELF.localStorage;
/** @type {DOMApplicationCache} */
var CACHE = SELF.applicationCache;
/** @const {!string} */
var CSP_NONCE = DOC.currentScript.nonce || "";

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

/**
 * Adds a script to the document
 * @param {string} source
 * @param {Function} callback
 * @param {boolean} reload
 * @return {HTMLScriptElement}
 */
function PSEUDO_ADD_SCRIPT(source, callback, reload) {
	if (reload) PSEUDO_RELOAD("script", "src", source);

	var file = DOC.createElement("script");
	file.async = false;	// html5/IE10
	file.type = "text/javascript";
	file.setAttribute("src", source);
	if (CSP_NONCE) file.setAttribute("nonce", CSP_NONCE);
	if (callback) file.onload = callback;
	return DOC_HEAD.appendChild(file);
}
/**
 * Adds a stylesheet to the document
 * @param {string} source
 * @param {string} media
 * @param {boolean} reload
 * @return {HTMLLinkElement}
 */
function PSEUDO_ADD_SHEET(source, media, reload) {
	if (reload) PSEUDO_RELOAD("link", "href", source);

	var file = DOC.createElement("link");
	file.setAttribute("rel", "stylesheet");
	file.setAttribute("type", "text/css");
	file.setAttribute("href", source);
	if (CSP_NONCE) file.setAttribute("nonce", CSP_NONCE);
	if (media) file.setAttribute("media", media);
	return DOC_HEAD.appendChild(file);
}
/**
 * Removes a script or stylesheet from the document
 * @param {string} tag
 * @param {string} attr
 * @param {string} source
 */
function PSEUDO_RELOAD(tag, attr, source) {
	var nodes = DOC.getElementsByTagName(tag), node = null;
	for (var i = 0; node = nodes[i]; i++) {
		if (node.getAttribute(attr) === source) {
			return node.parentNode.removeChild(node);
		}
	}
}
/**
 * Returns a string identifying the browser.
 * @return {string|null}
 */
function PSEUDO_BROWSER() {
	return SELF["chrome"]
		? !SELF["chrome"]["loadTimes"] //|| NAV.appVersion.search(/Edge?/) > -1
			? "edge"
			: "chrome"
		: SELF["InstallTrigger"]
			? "firefox"
			: DOC["documentMode"]
				? "ie"
				: SELF["opera"]
					? "opera"
					: null;
}

/**
 * Adds a script to the document inside the <head> tag.
 * @expose
 **/
ns.addScript = PSEUDO_ADD_SCRIPT;
/**
 * Adds a link element for the given CSS file to the document inside the <head> tag.
 * @expose
 **/
ns.addSheet = PSEUDO_ADD_SHEET;

/**
 * Returns a string identifying the browser.
 * If the browser cannot be identified, returns null.
 * @expose
 **/
ns.checkBrowser = PSEUDO_BROWSER;
