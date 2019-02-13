/// <reference path="..\..\blds\pseudo3.js" />

var OBJECT_KEYS_BUG = !({ "toString": null }).propertyIsEnumerable("toString");
var OBJECT_KEYS_DONT = [
	"toString",
	"toLocaleString",
	"valueOf",
	"hasOwnProperty",
	"isPrototypeOf",
	"propertyIsEnumerable",
	"constructor",
];

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
 * Creates an array of name/value pairs.
 * @param {!Object} object
 * @return {Array.<{name:string,value:?}>}
 */
function OBJECT_PAIRS(object) {
	if (OBJECT_IS_NOTHING(object) || !OBJECT_IS_OBJECT(object)) {
		throw new TypeError("pseudo3.Object.pairs called on non-object");
	}
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
 * Similar to {@link Array#each}, allows you to iterate over the key/value pairs of an object.
 * @param {!Object} object
 * @param {function(*,string,Object,number)} predicate
 * @param {Object=} context
 * @return {Array}
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
 * Utility functions for inspecting objects.
 * @namespace
 * @expose
 **/
ns.Object = {
	/**
	 * @expose
	 */
	"isArguments": OBJECT_IS_ARGUMENTS,
	/**
	 * @expose
	 */
	"isNothing": OBJECT_IS_NOTHING,
	/**
	 * @expose
	 */
	"isBoolean": OBJECT_IS_BOOLEAN,
	/**
	 * @expose
	 */
	"isNumber": OBJECT_IS_NUMBER,
	/**
	 * @expose
	 */
	"isString": OBJECT_IS_STRING,
	/**
	 * @expose
	 */
	"pairs": OBJECT_PAIRS,
	/**
	 * @expose
	 */
	"each": OBJECT_EACH,
};