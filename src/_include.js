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
/** @type {Function} */
var SET_TIMER = self.setTimeout;
/** @type {Function} */
var CLEAR_TIMER = self.clearTimeout;
/** @type {Function} */
var SET_EVERY = self.setInterval;
/** @type {Function} */
var CLEAR_EVERY = self.clearInterval;
/**
 * Sets a callback to happen the instance the main thread ends execution.
 * Only supported by Microsoft, so polyfill to help other browsers.
 * @param {Function} func
 * @param {...?} var_args
 * @return {number}		Handle for the callback timer.
 **/
var SET_INSTANT = self.setImmediate || function(func, var_args) {
	return SET_TIMER.apply(this, [func, 0].concat(SLICE.call(arguments, 0)));
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
/** @type {Object} */
var OBJECT = Object;
/** @type {Function} */
var GET_KEYS = OBJECT.keys;
/** @type {Function} */
var GET_ALL_KEYS = OBJECT.getOwnPropertyNames;
/** @type {Function} */
var DEFINE_PROP = OBJECT.defineProperty;
/** @type {Function} */
var DEFINE_PROPS = OBJECT.defineProperties;
/** @type {Object} */
var Array_prototype = Array[PROTOTYPE];
/** @type {Function} */
var SLICE = Array_prototype.slice;
/** @type {Function} */
var VALUEOF = Function[PROTOTYPE].valueOf;
/** @type {Function} */
var TOSTRING = Object[PROTOTYPE].toString;
//#endregion Objects

//#region Math
/** @type {Object} */
var MATH = Math;
/** @type {Function} */
var ABS = MATH.abs;
/** @type {Function} */
var ACOS = MATH.acos;
/** @type {Function} */
var ASIN = MATH.asin;
/** @type {Function} */
var ATAN = MATH.atan;
/** @type {Function} */
var ATAN2 = MATH.atan2;
/** @type {Function} */
var CEIL = MATH.ceil;
/** @type {Function} */
var COS = MATH.cos;
/** @type {Function} */
var EXP = MATH.exp;
/** @type {Function} */
var FLOOR = MATH.floor;
/** @type {Function} */
var LOG = MATH.log;
/** @type {Function} */
var MAX = MATH.max;
/** @type {Function} */
var MIN = MATH.min;
/** @type {Function} */
var PI = MATH.PI;
/** @type {Function} */
var POW = MATH.pow;
/** @type {Function} */
var RANDOM = MATH.random;
/** @type {Function} */
var ROUND = MATH.round;
/** @type {Function} */
var SIN = MATH.sin;
/** @type {Function} */
var SQRT = MATH.sqrt;
/** @type {Function} */
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
/** @type {Function} */
var INT = parseInt;
/** @type {Function} */
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
 * Calls isNaN, but also checks for null.
 * @param {?} value The variable to check
 * @return {boolean}
 */
function IS_NAN(value) {
	return !OBJECT_IS_NUMBER(value) || isNaN(value);
}
/**
 * Opposite of IS_NAN
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
 * @type {number}
 */
var RADIANS_TO_DEGREES = 180 / PI;
/**
 * degrees to radians: value * (pi / 180)
 * @type {number}
 */
var DEGREES_TO_RADIANS = PI / 180;
//#endregion Constant Numbers
