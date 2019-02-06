/// <reference path="..\blds\pseudo3.js" />
"use strict";

/**
 * @param {number} num
 * @param {number} length
 * @param {number=} decimals
 * @param {number=} radix
 */
function ZERO_PADDED(num, length, decimals, radix) {
	var strings = num.toString(radix || 10).split(".");
	if (decimals && strings.length === 1) strings.push("0");
	if (strings[0].length < length) strings[0] = "0".repeat(length - strings[0].length) + strings[0];
	if (strings[1] && strings[1].length < decimals) strings[1] += "0".repeat(decimals - strings[1].length);
	return strings.join(".");
}

/**
 * @expose
 * @this {number}
 * @param {!number} length	The minimum-length of the string representing the formatted number
 * @param {number=} decimals	Optionally specify the min-len for decimals
 * @param {number=} radix	Optionally specify the radis when parsing the number to a string
 * @return {string}
 */
Number[PROTOTYPE].pad = function(length, decimals, radix) {
	return ZERO_PADDED(this, length, decimals, radix);
};
/**
 * @expose
 * @this {number}
 * @param {string=} separator	Character separator between number groups.  Default is ",".
 * @param {number=} length	Length of the number groups.  Default is 3.
 * @param {string=} decimals	Character separator between decimal number groups. Default is same as "separator".
 * @param {string=} point	Character separator between integers and decimals. Default is ".".
 * @return {string}
 */
Number[PROTOTYPE].group = function(separator, length, decimals, point) {
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
 * @expose
 * @this {number}
 * @param {number=} places The number of decimal places.  Default is 0.
 * @return {number}
 */
Number[PROTOTYPE].round = function(places) {
	return ROUND_TO(this, places);
};
/**
 * 
 * @expose
 * @this {number}
 * @return {number}
 */
Number[PROTOTYPE].countDecimals = function() {
	return FLOOR(this) === this
		? 0
		: this.toString().split(".")[1].length || 0;
};