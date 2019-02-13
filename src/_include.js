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
/** @const {Object} */
var OBJECT = Object;
/** @const {Function} */
var GET_KEYS = OBJECT.keys;
/** @const {Function} */
var GET_ALL_KEYS = OBJECT.getOwnPropertyNames;
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
 * @const {number}
 */
var RADIANS_TO_DEGREES = 180 / PI;
/**
 * degrees to radians: value * (pi / 180)
 * @const {number}
 */
var DEGREES_TO_RADIANS = PI / 180;
//#endregion Constant Numbers
