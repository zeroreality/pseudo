/// <reference path="..\..\blds\pseudo3.js" />
"use strict";

var OBJECT_KEYS_BUG = !({ "toString": null }).propertyIsEnumerable("toString");
var OBJECT_KEYS_DONT = ["toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor"];

/**
 * Checks for an Arguments object
 * @param {*} object
 * @returns {boolean}
 */
function OBJECT_IS_ARGUMENTS(object) {
	var cn = PSEUDO_KLASS_NAME(object);
	return cn === "Arguments" || cn === "Object" && IS_AN(object.length) && "callee" in object;
};
/**
 * Checks for both null and undefined
 * @param {?} value The variable to check
 * @return {!boolean}
 */
function OBJECT_IS_NOTHING(value) {
	return value === null || typeof value === "undefined";
}
/**
 * Checks to see if the given parameter is a number object or number literal.
 * @param {?} value The variable to check
 * @return {!boolean}
 */
function OBJECT_IS_BOOLEAN(value) {
	return typeof value === "boolean" || value instanceof Boolean;
}
/**
 * Checks to see if the given parameter is a number object or number literal.
 * @param {?} value The variable to check
 * @return {!boolean}
 */
function OBJECT_IS_NUMBER(value) {
	return typeof value === "number" || value instanceof Number;
}
/**
 * Checks to see if the given parameter is a number object or number literal.
 * @param {?} value The variable to check
 * @return {!boolean}
 */
function OBJECT_IS_STRING(value) {
	return typeof value === "string" || value instanceof String;
}
/**
 * Checks to see if the given parameter is an object, not undefined or a number/string/boolean object.
 * @param {?} value The variable to check
 * @return {boolean}
 */
function OBJECT_IS_OBJECT(value) {
	return typeof value !== "undefined"
		&& !OBJECT_IS_BOOLEAN(value)
		&& !OBJECT_IS_NUMBER(value)
		&& !OBJECT_IS_STRING(value);
}

/**
 * @param {!Object} object
 */
function OBJECT_PAIRS(object) {
	if (object === null || typeof object !== "object" && typeof object !== "function") throw new TypeError("Object.pairs called on non-object");
	var results = [];
	for (var each in object) {
		if (object.hasOwnProperty(each)) {
			results.push({ "name": each, "value": object[each] });
		}
	}
	if (OBJECT_KEYS_BUG) {
		for (var i = 0, each = ""; each = OBJECT_KEYS_DONT[i]; i++) {
			if (object.hasOwnProperty(each)) {
				results.push({ "name": each, "value": object[each] });
			}
		}
	}
	return results;
};
/**
 * @param {!Object} object
 * @param {function(*,string,Object,number)} predicate
 * @param {Object=} context
 */
function OBJECT_EACH(object, predicate, context) {
	if (typeof predicate !== "function") throw new TypeError(PREDICATE_ERROR);
	else if (arguments.length < 3) context = object;
	var results = [],
		keys = GET_KEYS(object)
	for (var i = 0, l = keys.length; i < l; i++) {
		var key = keys[i];
		results[i] = predicate.call(context, object[key], key, object, i);
	}
	return results;
}

/**
 * @expose
 */
Object.isArguments = OBJECT_IS_ARGUMENTS;
/**
 * @expose
 */
Object.isNothing = OBJECT_IS_NOTHING;
/**
 * @expose
 */
Object.isBoolean = OBJECT_IS_BOOLEAN;
/**
 * @expose
 */
Object.isNumber = OBJECT_IS_NUMBER;
/**
 * @expose
 */
Object.isString = OBJECT_IS_STRING;
/**
 * @expose
 */
Object.pairs = OBJECT_PAIRS;
/**
 * @expose
 */
Object.each = OBJECT_EACH;
