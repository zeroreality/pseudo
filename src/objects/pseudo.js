﻿/// <reference path="..\blds\pseudo3.js" />

/** @const */
var PSEUDO_FILTER_CLASS = /^\[object\s(.*)\]$/;
/** @private */
var DOC_HEAD = DOC.getElementsByTagName("head")[0] || DOC_EL.appendChild(DOC.createElement("head"));
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
	if (media) file.setAttribute("media", media);
	return DOC_HEAD.appendChild(file);
}
/**
 * Creates an HTTP safe string for transmission similar to the {@link window.escape} function.
 * @param {string} input
 * @return {!string}
 */
function PSEUDO_ESCAPE(input) {
	//	return escape(input).split("+").join("%2b").split("%20").join("+");
	return input.replace(/[\r\%\?\=\&\+\s]/gim, function(char) {
		switch (char) {
			case "\r": return "";
			case " ": return "+";
			case "+": return "%2b";
			default: return escape(char);
		}
	});
}

/**
 * Returns a string identifying the browser.
 * @return {string|null}
 */
function PSEUDO_BROWSER() {
	return WIN["chrome"]
		? !WIN["chrome"]["loadTimes"] //|| NAV.appVersion.search(/Edge?/) > -1
			? "edge"
			: "chrome"
		: WIN["InstallTrigger"]
			? "firefox"
			: DOC["documentMode"]
				? "ie"
				: WIN["opera"]
					? "opera"
					: null;
}
/**
 * Does a deep copy/clone of the given object.  Automatically omits recursive branches.
 * @param {?} object			The object to copy/clone.
 * @param {number=} depth		How deep into the object's branches to traverse.  Default is 5.
 * @param {Array.<Object>=} chain	A list of objects not to copy.  Used internally to detect recursion.
 * @return {?}
 */
function PSEUDO_CLONE(object, depth, chain) {
	return typeof object === "object"
		? object instanceof Array
			? PSEUDO_CLONE_ARRAY(object, depth, chain)
			: PSEUDO_CLONE_OBJECT(object, depth, chain)
		: object;
}
/**
 * Does a deep copy/clone of the given object.  Automatically omits recursive branches.
 * @param {!Object} object		The object to copy/clone.
 * @param {number=} depth		How deep into the object's branches to traverse.  Default is 5.
 * @param {Array.<Object>=} chain	A list of objects not to copy.  Used internally to detect recursion.
 * @return {!Object}
 */
function PSEUDO_CLONE_OBJECT(object, depth, chain) {
	var keys = GET_KEYS(object),
		result = {};
	if (IS_NAN(depth)) depth = 5;
	if (!chain) chain = [];
	for (var i = 0, l = keys.length; i < l; i++) {
		var key = keys[i],
			value = object[key];
		if (typeof value === "object" && !OBJECT_IS_NOTHING(value)) {
			if (depth > 0 && chain.indexOf(value) < 0) {
				result[key] = value instanceof Array
					? PSEUDO_CLONE_ARRAY(value, depth - 1, [value].concat(chain))
					: PSEUDO_CLONE_OBJECT(value, depth - 1, [value].concat(chain));
			}
		} else {
			result[key] = value;
		}
	}
	return result;
}
/**
 * Does a deep copy/clone of the given array.  Automatically omits recursive branches.
 * @param {!Array} array			The array to copy/clone.
 * @param {number=} depth		How deep into the object's branches to traverse.  Default is 5.
 * @param {Array.<Object>=} chain	A list of objects not to copy.  Used internally to detect recursion.
 * @return {!Object}
 */
function PSEUDO_CLONE_ARRAY(array, depth, chain) {
	var result = [];
	if (IS_NAN(depth)) depth = 5;
	if (!chain) chain = [];
	for (var i = 0, l = array.length; i < l; i++) {
		var value = array[i];
		if (typeof value === "object") {
			if (depth > 0 && chain.indexOf(value) < 0) {
				result.push(
					value instanceof Array
						? PSEUDO_CLONE_ARRAY(value, depth - 1, [value].concat(chain))
						: PSEUDO_CLONE_OBJECT(value, depth - 1, [value].concat(chain))
				);
			}
		} else {
			result.push(value);
		}
	}
	return result;
}

/**
 * Merges the keys of the given objects together onto a new object.
 * Keys in the first object(s) are overwritten by key values in the later object(s).
  * @param {...Object} var_args
 * @return {!Object}
 **/
function PSEUDO_MERGE(var_args) {
	return SLICE.call(arguments).reduce(function(object, other) {
		GET_KEYS(other).forEach(function(key) {
			object[key] = other[key];
		});
		return object;
	}, {});
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
 * Returns the class name of the given object like "Array", "Document", or "Number".
 * For null and undefined will return "null" and "undefined" respectively.
 * @expose
 **/
ns.className = PSEUDO_KLASS_NAME;
/**
 * Does a deep-copy of the given object/array.
 * Omits recursive branches.
 * @expose
 **/
ns.clone = PSEUDO_CLONE;
/**
 * Does a deep-copy of the given object.
 * @expose
 **/
ns.cloneObject = PSEUDO_CLONE_OBJECT;
/**
 * Does a deep-copy of the given array.
 * @expose
 **/
ns.cloneArray = PSEUDO_CLONE_ARRAY;
/**
 * Merges the keys of the given objects together onto a new object.
 * Keys in the first object(s) are overwritten by key values in the later object(s).
 * @expose
 **/
ns.merge = PSEUDO_MERGE;
/**
 * Similar to {@link global.escape}, removes return characters, and substitutes spaces for "+" and "+" for "%2b".
 * @expose
 **/
ns.escape = PSEUDO_ESCAPE;
/**
 * Similar to {@link global.isNaN}, but also returns false for nulls and other non-number types.
 * @expose
 **/
ns.isNaN = IS_NAN;
/**
 * Opposite of {@link pseudo3.isNaN}.
 * @expose
 **/
ns.isN = IS_AN;
/**
 * Returns a string identifying the browser.
 * If the browser cannot be identified, returns null.
 * @expose
 **/
ns.checkBrowser = PSEUDO_BROWSER;
