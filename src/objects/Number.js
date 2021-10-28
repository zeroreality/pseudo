/// <reference path="..\..\blds\pseudo3.js" />

/**
 * 
 * @const {Object}
 **/
var Number_prototype = Number[PROTOTYPE];

//#region Static
/**
 * Returns an array of numbers.
 * @expose
 * @param {!number} length	The number of numbers to include
 * @param {number=} start	Optional starting number.
 * @param {number=} step		Optional increment value.
 * @return {!Array.<number>}
 **/
Number.range = function(length, start, step) {
	if (IS_NAN(start)) start = 0;
	if (IS_NAN(step)) step = 1;
	var array = [];
	for (var i = 0; i < length; i++) {
		array[i] = (start + (step * i));
	}
	return array;
}
//#endregion Static

/**
 * Internal method for returning a string representation of the given number, padded with zeros.
 * @param {number} num
 * @param {number} length
 * @param {number=} decimals
 * @param {number=} radix
 * @return {string}
 */
function ZERO_PADDED(num, length, decimals, radix) {
	var strings = num.toString(radix || 10).split(".");
	if (decimals && strings.length === 1) strings.push("0");
	if (strings[0].length < length) strings[0] = "0".repeat(length - strings[0].length) + strings[0];
	if (strings[1] && strings[1].length < decimals) strings[1] += "0".repeat(decimals - strings[1].length);
	return strings.join(".");
}

/**
 * Returns this number as a string padded with zeros.
 * @expose
 * @this {number}
 * @param {!number} length	The minimum-length of the string representing the formatted number
 * @param {number=} decimals	Optionally specify the min-len for decimals
 * @param {number=} radix	Optionally specify the radis when parsing the number to a string
 * @return {string}
 **/
Number_prototype.pad = function(length, decimals, radix) { return ZERO_PADDED(this, length, decimals, radix); };
/**
 * Returns this number as a string, with separators in groups of digits.
 * @expose
 * @this {number}
 * @param {string=} separator	Character separator between number groups.  Default is ",".
 * @param {number=} length	Length of the number groups.  Default is 3.
 * @param {string=} decimals	Character separator between decimal number groups. Default is same as "separator".
 * @param {string=} point	Character separator between integers and decimals. Default is ".".
 * @return {string}
 */
Number_prototype.group = function(separator, length, decimals, point) {
	if (!separator) separator = ",";
	if (!length) length = 3;
	else if (length < 0) throw new Error("length must be greater than zero.");
	if (!decimals) decimals = separator;
	if (!point) point = ".";
	var neg = this < 0 ? "-" : "",
		splits = ABS(this).toString().split("."),
		ints = [],
		decs = [];
	for (var i = splits[0].length; i > 0; i -= length) {
		ints.unshift(splits[0].slice(MAX(0, i - length), i));
	}
	if (splits.length > 1) {
		for (var i = 0, l = splits[1].length; i < l; i += length) {
			decs.push(splits[1].slice(i, i + length));
		}
	}
	return neg + ints.join(separator) + (decs.length ? point + decs.join(decimals) : "");
};
/**
 * Returns this number rounded to the given number of decimal places.  If no value is given, 0 is assumed.
 * @expose
 * @this {number}
 * @param {number=} places	The number of decimal places.  Default is 0.
 * @param {boolean=} rounding	When true will round up to the nearest, when false will round down to the nearest, and when not given, will round to closest.
 * @return {number}
 **/
Number_prototype.round = function(places, rounding) { return ROUND_TO(this, places, rounding); };
/**
 * Rounds this number to the nearest denominator.
 * Also works if the denominator is a decimal.
 * @expose
 * @this {number}
 * @param {number=} denominator	The closest number on which to round.  Default is 1.
 * @param {boolean=} rounding		When true will round up to the nearest, when false will round down to the nearest, and when not given, will round to closest.
 * @return {number}
 **/
Number_prototype.nearest = function(denominator, rounding) { return NEAREST(this, denominator, rounding); };
/**
 * Returns the number of decimal places in this number.
 * @expose
 * @this {number}
 * @return {number}
 */
Number_prototype.countDecimals = function() {
	return FLOOR(this) === this
		? 0
		: (this.toString().split(".")[1] || "").length;
};

/** 
 * 
 * @namespace
 * @expose
 **/
ns.Number = {
	/**
	 * Rounds a number to the desired number of decimal places. Using a negative places value will round to the nearest ten.
	 **/
	"roundTo": ROUND_TO,
	/**
	 * Similar to {@link global.isNaN}, but also returns false for nulls and other non-number types.
	 **/
	"isNaN": IS_NAN,
	/**
	 * Opposite of {@link pseudo3.isNaN}.
	 **/
	"isAn": IS_AN,
};
