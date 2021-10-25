/// <reference path="..\blds\pseudo3.js" />

/** @const */
var PSEUDO_FILTER_CLASS = /^\[object\s(.*)\]$/;
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
