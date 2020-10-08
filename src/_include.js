/// <reference path="..\blds\pseudo3.js" />

//#region Constant Strings
/**
 * The only way I've found to force Closure not to collapse the word "prototype".
 * @const {string}
 **/
var PROTOTYPE = (72697618120946).toString(36);	//	"prototype";	//	new String("prototype");	//for (var p = 72697618120946, i = Math.ceil((p / 2)) ; i > 0; i--) if (!(p % i)) console.log(i);
/**
 * Error message for not using a function for a predicate.
 * @const {string}
 */
var PREDICATE_ERROR = "predicate must be a function";
//#endregion Constant Strings

//#region Timers
/** @const {Function} */
var SET_TIMER = self.setTimeout;
/** @const {Function} */
var CLEAR_TIMER = self.clearTimeout;
/** @const {Function} */
var SET_EVERY = self.setInterval;
/** @const {Function} */
var CLEAR_EVERY = self.clearInterval;
/**
 * Sets a callback to happen the instance the main thread ends execution.
 * Only supported by Microsoft, so polyfill to help other browsers.
 * @param {Function} func
 * @param {...?} var_args
 * @return {number}		Handle for the callback timer.
 **/
var SET_INSTANT = self.setImmediate || function(func, var_args) {
	return SET_TIMER.apply(this, [func, 0].concat(SLICE.call(arguments)));
};
/**
 * Clears a setImmediate (or polyfilled) timeout.
 * @param {number} id	Handle for the callback timer.
 **/
var CLEAR_INSTANT = self.clearImmediate || function(id) {
	return CLEAR_TIMER(id);
};
//#endregion Timers

//#region Objects
/** @const {Object} */
var OBJECT = Object;
/** @const {Function} */
var GET_KEYS = OBJECT.keys;
/** @const {Function} */
var GET_ALL_KEYS = OBJECT.getOwnPropertyNames;
/** @const {Function} */
var LOOKUP_PROP = OBJECT.getOwnPropertyDescriptor;
/** @const {Function} */
var LOOKUP_PROPS = OBJECT.getOwnPropertyDescriptors;
/** @const {Function} */
var DEFINE_PROP = OBJECT.defineProperty;
/** @const {Function} */
var DEFINE_PROPS = OBJECT.defineProperties;
/** @const {Object} */
var Array_prototype = Array[PROTOTYPE];
/** @const {Function} */
var SLICE = Array_prototype.slice;
/** @const {Function} */
var VALUEOF = Function[PROTOTYPE].valueOf;
/** @const {Function} */
var TOSTRING = Object[PROTOTYPE].toString;
/** @type {Function} */
var JSON_PARSE = JSON.parse;
/** @type {Function} */
var JSON_STRINGIFY = JSON.stringify;

/**
 * Gets the name of the Klass
 * @param {*} object
 * @returns {string}
 */
function PSEUDO_KLASS_NAME(object) {
	return object === undefined
		? "undefined"
		: object === null
			? "null"
			: TOSTRING.call(object).slice("[object ".length, -1);
}
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
//#endregion Objects

//#region Math
/** @const {Object} */
var MATH = Math;
/** @const {Function} */
var ABS = MATH.abs;
/** @const {Function} */
var ACOS = MATH.acos;
/** @const {Function} */
var ASIN = MATH.asin;
/** @const {Function} */
var ATAN = MATH.atan;
/** @const {Function} */
var ATAN2 = MATH.atan2;
/** @const {Function} */
var CEIL = MATH.ceil;
/** @const {Function} */
var COS = MATH.cos;
/** @const {Function} */
var EXP = MATH.exp;
/** @const {Function} */
var FLOOR = MATH.floor;
/** @const {Function} */
var LOG = MATH.log;
/** @const {Function} */
var MAX = MATH.max;
/** @const {Function} */
var MIN = MATH.min;
/** @const {Function} */
var PI = MATH.PI;
/** @const {Function} */
var POW = MATH.pow;
/** @const {Function} */
var RANDOM = MATH.random;
/** @const {Function} */
var ROUND = MATH.round;
/** @const {Function} */
var SIN = MATH.sin;
/** @const {Function} */
var SQRT = MATH.sqrt;
/** @const {Function} */
var TAN = MATH.tan;
/**
 * Does fast 32bit uint multiplication (from C++).  Used mostly in ASM.
 * @param {!number} a
 * @param {!number} b
 * @return {!number}
 */
var IMUL = MATH["imul"] || function imul(a, b) {
	// polyfill from MDN
	var ah = (a >>> 16) & 0xffff;
	var al = a & 0xffff;
	var bh = (b >>> 16) & 0xffff;
	var bl = b & 0xffff;
	// the shift by 0 fixes the sign on the high part
	// the final |0 converts the unsigned value into a signed value
	return ((al * bl) + (((ah * bl + al * bh) << 16) >>> 0) | 0);
};
/** @const {Function} */
var INT = parseInt;
/** @const {Function} */
var FLOAT = parseFloat;
/**
 * Parses the given string as a base-10 integer.
 * @param {string} num
 * @return {number}
 **/
function ID(num) {
	return INT(num, 10);
}
/**
 * Rounds a number to the desired number of decimal places. Using a negative places value will round to the nearest ten.
 * @param {!number} number The number to be rounded
 * @param {number=} places The number of decimal places.  Default is 0.
 * @return {!number}
 */
function ROUND_TO(number, places) {
	var power = POW(10, places || 0);
	return ROUND(number * power) / power;
}
/**
 * Calls isNaN, but also checks that the given value is a number type.
 * @param {?} value The variable to check
 * @return {boolean}
 */
function IS_NAN(value) {
	return !OBJECT_IS_NUMBER(value) || isNaN(value);
}
/**
 * Opposite of {@link pseudo3.isNaN}.
 * @param {?} value The variable to check
 * @return {boolean}
 */
function IS_AN(value) {
	return !IS_NAN(value);
}
//#endregion Math

//#region Constant Numbers
/**
 * radians to degrees: value * (180 / pi)
 * @const {number}
 */
var RADIANS_TO_DEGREES = 180 / PI;
/**
 * degrees to radians: value * (pi / 180)
 * @const {number}
 */
var DEGREES_TO_RADIANS = PI / 180;
//#endregion Constant Numbers

//#region Iteration Helpers
/**
 * When used as an Array iterator, will return the value as given.
 * @param {?} value
 * @return {?} value
 */
function ITERATOR_VALUE(value) {
	return value;
}
/**
 * When used as a Map iterator, will return the key as given.
 * @param {?} object
 * @param {?} key
 * @return {?} key
 */
function ITERATOR_KEY(object, key) {
	return key;
}
/**
 * Chooses the best finder predicate
 * @param {?} value
 * @return {!function(?):boolean}
 */
function CHOOSE_FINDER(value) {
	return OBJECT_IS_NUMBER(value)
		&& (
			isNaN(value) && FINDER_NAN
			|| value == 0 && FINDER_ZERO
		)
		|| OBJECT_IS_NOTHING(value)
		&& FINDER_SELF
		|| FINDER_VALUE;
}
/**
 * Given as the first argument for Array#filter, and finds the matching object in the array by identity match.
 * @this {?}
 * @param {?} value
 * @return {!boolean}
 */
function FINDER_VALUE(value) {
	return value === this.valueOf();
}
/**
 * Given as the first argument for Array#filter, and finds the matching object in the array by reference.
 * Used for *null* and *undefined* search values.
 * @this {?}
 * @param {?} value
 * @return {!boolean}
 */
function FINDER_SELF(value) {
	return value === this;
}
/**
 * Given as the first argument for Array#filter, uses a special case for finding NaN values.
 * @this {?}
 * @param {?} value
 * @return {!boolean}
 */
function FINDER_NAN(value) {
	return IS_NAN(value);
}
/**
 * Given as the first argument for Array#filter, and finds a numeric value of zero.
 * Differentiates between positive zero and negative zero.
 * @this {?}
 * @param {?} value
 * @return {!boolean}
 */
function FINDER_ZERO(value) {
	return value === 0
		&& (1 / value) === (1 / this.valueOf());
}
//#endregion Iteration Helpers

/**
 * The version number of this JavaScript library.
 * @expose
 * @define {number}
 */
ns.version = 0;
