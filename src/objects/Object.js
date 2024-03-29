﻿/// <reference path="..\..\blds\pseudo3.js" />

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
 * Defines a complex attribute getter and setter.
 * @param {!Object} klass
 * @param {!string} name
 * @param {!Function} getter
 * @param {Function=} setter
 **/
function DEFINE_COMPLEX(klass, name, getter, setter) {
	var propertyDef = {
		"enumerable": true,
		"configurable": true,
		"get": getter,
	};
	if (setter instanceof Function) propertyDef["set"] = setter;
	DEFINE_PROP(klass, name, propertyDef);
}
/**
 * Defines non-writable attribute values.
 * @param {!Object} klass
 * @param {!Object.<string,?>} values
 **/
function DEFINE_READONLY_VALUES(klass, values) {
	for (var keys = GET_KEYS(values), i = 0, key; key = keys[i]; i++) {
		DEFINE_PROP(klass, key, {
			"writable": false,
			"enumerable": true,
			"configurable": true,
			"value": values[key],
		});
	}
}
/**
 * Defines complex attribute getters, but no setters.
 * @param {!Object} klass
 * @param {!Object.<string,!Function>} getters
 **/
function DEFINE_READONLY_GETTERS(klass, getters) {
	for (var keys = GET_KEYS(getters), i = 0, key; key = keys[i]; i++) {
		DEFINE_COMPLEX(klass, key, getters[key]);
	}
}
/**
 * Defines complex attribute getters and (optional) setters.
 * @param {!Object} klass
 * @param {!Object.<string,{get:Function,set:Function}>} complexes
 **/
function DEFINE_COMPLEXES(klass, complexes) {
	for (var keys = GET_KEYS(complexes), i = 0, key; key = keys[i]; i++) {
		DEFINE_COMPLEX(klass, key, complexes[key]["get"], complexes[key]["set"]);
	}
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
	"isMap": OBJECT_IS_MAP,
	/**
	 * @expose
	 */
	"isSet": OBJECT_IS_SET,
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
	/**
	 * @expose
	 */
	"define": DEFINE_COMPLEXES,
	/**
	 * @expose
	 */
	"getters": DEFINE_READONLY_GETTERS,
	/**
	 * @expose
	 */
	"readonly": DEFINE_READONLY_VALUES,
};
