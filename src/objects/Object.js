/// <reference path="..\..\blds\pseudo3.js" />

/**
 * Checks to see if this browser has a bug in not overriding property enumerables.
 * @const {boolean}
 **/
var OBJECT_KEYS_BUG = !({ "toString": null }).propertyIsEnumerable("toString");
/**
 * When OBJECT_KEYS_BUG is true, this list is used in special cases when enumerating an object's keys.
 * @const {Array.<string>}
 **/
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
	return cn === "Arguments"
		|| cn === "Object"
		&& IS_AN(object.length)
		&& "callee" in object;
};
/**
 * Checks to see if the given parameter is an array.
 * @param {?} value The variable to check
 * @return {!boolean}
 */
function OBJECT_IS_ARRAY(value) {
	return PSEUDO_KLASS_NAME(value) === "Array";
}
/**
 * Checks for both null and undefined
 * @param {?} value The variable to check
 * @return {!boolean}
 */
function OBJECT_IS_NOTHING(value) {
	var cn = PSEUDO_KLASS_NAME(value);
	return cn === "null"
		|| cn === "undefined";
}
/**
 * Checks to see if the given parameter is a boolean object or literal.
 * @param {?} value The variable to check
 * @return {!boolean}
 */
function OBJECT_IS_BOOLEAN(value) {
	return PSEUDO_KLASS_NAME(value) === "Boolean";
}
/**
 * Checks to see if the given parameter is a number object or literal.
 * @param {?} value The variable to check
 * @return {!boolean}
 */
function OBJECT_IS_NUMBER(value) {
	return PSEUDO_KLASS_NAME(value) === "Number";
}
/**
 * Checks to see if the given parameter is a string object or literal.
 * @param {?} value The variable to check
 * @return {!boolean}
 */
function OBJECT_IS_STRING(value) {
	return PSEUDO_KLASS_NAME(value) === "String";
}
/**
 * Checks to see if the given parameter is a function.
 * @param {?} value The variable to check
 * @return {!boolean}
 */
function OBJECT_IS_FUNCTION(value) {
	return PSEUDO_KLASS_NAME(value) === "Function";
}
/**
 * Checks to see if the given parameter is a RegExp object or literal.
 * @param {?} value The variable to check
 * @return {boolean}
 */
function OBJECT_IS_REGEXP(value) {
	return PSEUDO_KLASS_NAME(value) === "RegExp";
}
/**
 * Checks to see if the given parameter is a Date object.
 * @param {?} value The variable to check
 * @return {boolean}
 */
function OBJECT_IS_DATE(value) {
	return PSEUDO_KLASS_NAME(value) === "Date";
}
/**
 * Checks to see if the given parameter is an object, not undefined or a primitive type.
 * @param {?} value The variable to check
 * @return {boolean}
 */
function OBJECT_IS_OBJECT(value) {
	return PSEUDO_KLASS_NAME(value) === "Object";
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
 * Similar to {@link Array#forEach}, allows you to iterate over the key/value pairs of an object.
 * @param {!Object} object
 * @param {function(*,string,Object,number)} predicate
 * @param {Object=} context
 * @param {function(string,string):number=} keyOrder
 * @return {Array}
 */
function OBJECT_EACH(object, predicate, context, keyOrder) {
	if (typeof predicate !== "function") throw new TypeError(PREDICATE_ERROR);
	else if (arguments.length < 3) context = object;
	var results = [],
		keys = GET_KEYS(object);
	if (keyOrder) keys.sort(keyOrder);
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
	"isArray": OBJECT_IS_ARRAY,
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
	"isFunction": OBJECT_IS_FUNCTION,
	/**
	 * @expose
	 */
	"isRegExp": OBJECT_IS_REGEXP,
	/**
	 * @expose
	 */
	"isDate": OBJECT_IS_DATE,
	/**
	 * @expose
	 */
	"isObject": OBJECT_IS_OBJECT,
	/**
	 * @expose
	 */
	"pairs": OBJECT_PAIRS,
	/**
	 * @expose
	 */
	"each": OBJECT_EACH,
};
