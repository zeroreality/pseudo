﻿/// <reference path="..\..\blds\pseudo3.js" />

/**
 * 
 * @const {Object}
 **/
var Date_prototype = Date[PROTOTYPE];
/**
 * This is an invalid date object used for comparison purposes.
 * @const {Date}
 **/
var DATE_INVALID = new Date(NaN);
/**
 * This is the format helper tofor parsing date/time format strings.
 * @const {RegExp}
 **/
var DATE_FILTER_FORMAT = /(\\.|d{1,4}|M{1,4}|y{1,4}|h{1,2}|H{1,2}|m{1,2}|s{1,2}|t{1,2}|T{1,2}|f{1,6})/gm;

/**
 * A dictionary/reference of the number of milliseconds in each date-part.
 **/
var DATE_MILLI_PER = {
	/**
	 * The number of milliseconds in a (non-leap) year.
	 * @const {number}
	 **/
	"yyyy": 365 * 24 * 3600 * 1000,
	/**
	 * The number of milliseconds in a (31 day) month.
	 * @const {number}
	 **/
	"MM": 31 * 24 * 3600 * 1000,
	/**
	 * The number of milliseconds in a week.
	 * @const {number}
	 **/
	"ww": 7 * 24 * 3600 * 1000,
	/**
	 * The number of milliseconds in a day.
	 * @const {number}
	 **/
	"dd": 24 * 3600 * 1000,
	/**
	 * The number of milliseconds in an hour.
	 * @const {number}
	 **/
	"hh": 3600 * 1000,
	/**
	 * The number of milliseconds in a minute.
	 * @const {number}
	 **/
	"mm": 60 * 1000,
	/**
	 * The number of milliseconds in a second.
	 * @const {number}
	 **/
	"ss": 1000,
	/**
	 * The number of milliseconds in a millisecond... Why is this even defined?
	 * @const {number}
	 **/
	"fff": 1,
};
/**
 * Context for creating date/time comparisons.
 **/
var DATE_MILLI_CONTEXT = new Map([
	["yyyy", DATE_MILLI_PER["yyyy"]],
	["MM", DATE_MILLI_PER["yyyy"] / 12],	// not DATE_MILLI_PER["MM"]
	["ww", DATE_MILLI_PER["ww"]],
	["dd", DATE_MILLI_PER["dd"]],
	["hh", DATE_MILLI_PER["hh"]],
	["mm", DATE_MILLI_PER["mm"]],
	["ss", DATE_MILLI_PER["ss"]],
	["fff", DATE_MILLI_PER["fff"]],
]);

//#region Static
/**
 * Returns a new Date with the time zeroed.
 * If no date is given as input, it uses "now".
 * @expose
 * @param {Date=} date
 * @return {!Date}
 */
Date.midnight = function(date) {
	if (date instanceof Date || IS_AN(date)) {
		date = new Date(date);
	} else {
		date = new Date;
	}
	return date.zero("h", "m", "s", "f");
};
//#endregion Static

/**
 * Returns a new Date instance with an identical value.
 * @expose
 * @this {Date}
 * @return {!Date}
 */
Date_prototype.copy = function() { return new Date(this); };

//#region Comparison
/**
 * Compares this date to the given value and returns an array containing a sum of differential values.
 * @expose
 * @this {Date}
 * @param {Date=} other			Default is "now".
 * @param {number=} levels		Default is 2.
 * @param {Array.<{type:string,get:function():number,inc:function(number)}>=} comparers
 * @return {!Array.<{value:number,type:string}>}
 **/
Date_prototype.context = function(other, levels, comparers) {
	/**
	 * A part of the description of the difference between two dates.
	 * @constructor
	 * @param {!number} value
	 * @param {!string} type
	 **/
	function DateContextDescriptor(value, type) {
		/**
		 * Numeric value for this difference.
		 * @expose
		 **/
		this.value = value;
		/**
		 * Abbreviation of the kind of difference.
		 * @expose
		 **/
		this.type = type;
	}
	var descriptors = [],
		copy = new Date(IS_NAN(other) ? new Date : other),
		future = this > copy,
		diff = ABS(this - copy);
	if (IS_NAN(levels)) levels = 2;
	if (!comparers || !comparers.length) comparers = DATE_MILLI_CONTEXT.allKeys();
	for (var i = 0, l = comparers.length; levels && diff && i < l; i++) {
		var type = comparers[i],
			milli = DATE_MILLI_CONTEXT.get(type),
			//func = levels > 1 ? FLOOR : ROUND,
			value = FLOOR(diff / milli);
		if (value) {
			descriptors.push(new DateContextDescriptor(value * (!future || -1), type));
			diff -= value * milli;
			levels--;
		}
	}
	return descriptors;
};
/**
 * Internally invoked {@link Date#context} and returns a concatenated string describing the difference between this date and the given value.
 * @expose
 * @this {Date}
 * @param {Date=} value									Default is "now".
 * @param {number=} levels								Default is 2.
 * @param {{after:string,before:string,now:string}=} template	Strings are templates that use {diff} as the replacement value.
 * @param {Array.<string>=} kinds							Default is yyyy, MM, ww, dd, hh, mm, ss. Does not include fff.
 * @return {!string}
 **/
Date_prototype.contextString = function(value, levels, template, kinds) {
	template = PSEUDO_MERGE({}, ns.Date["context"], template || {});
	var array = this.context(value, levels, kinds),
		i = array.length,
		results = [],
		context = i === 0 ? "now" : array[0]["value"] > 0 ? "after" : "before";
	while (i--) results[i] = ABS(array[i]["value"]) + " " + ns.Date["parts"][array[i]["type"]];
	return template[context].format({
		"diff": results.join(", "),
	});
};
//#endregion Comparison

//#region Format
/**
 * Returns a copy of this date with the time zeroed.
 * @expose
 * @this {Date}
 * @return {!Date}
 */
Date_prototype.getMidnight = function getMidnight() {
	return Date.midnight(this);
};
/**
 * Returns the name of the weekday for this date.
 * Internally uses the {@link pseudo3.Date.dayNames} array; you can update the values if the day names should be different/translated.
 * @expose
 * @this {Date}
 * @return {!string}
 */
Date_prototype.getDayName = function getDayName() {
	return ns.Date["dayNames"][this.getDay()] || "";
};
/**
 * Returns the name of the month for this date.
 * Internally uses the {@link pseudo3.Date.monthNames} array; you can update the values if the day names should be different/translated.
 * @expose
 * @this {Date}
 * @return {!string}
 */
Date_prototype.getMonthName = function getMonthName() {
	return ns.Date["monthNames"][this.getMonth()] || "";
};
/**
 * Returns the meridiem (AM/PM) for this date.
 * Internally uses the {@link pseudo3.Date.meridiem} array; you can update the values if the day names should be different/translated.
 * @expose
 * @this {Date}
 * @return {!string}
 */
Date_prototype.getMeridiem = function getMonthName() {
	return ns.Date["meridiem"][this.getHours() > 11 ? 1 : 0];
};
/**
 * Uses the given format string to return a human readable date.
 * Use a \ to escape a character in the format string. ie: "h\h m\m" => "9h 30m"
 * Internally uses the {@link pseudo3.Date.dayNames}, {@link pseudo3.Date.monthNames}, and {@link pseudo3.Date.meridiem} arrays.
 * @expose
 * @example
 * // four digit year
 * yyyy or yyyy
 * @example
 * // last two digits of the year
 * yy
 * @example
 * // last digit of the year
 * y
 * @example
 * // month name
 * MMMM
 * @example
 * // first three characters of the month name
 * MMM
 * @example
 * // zero-padded two digit month
 * MM
 * @example
 * // one or two digit month
 * M
 * @example
 * // weekday name
 * dddd
 * @example
 * // first three characters of the weekday name
 * ddd
 * @example
 * // zero-padded two digit date
 * dd
 * @example
 * // one or two digit date
 * d
 * @example
 * // zero-padded two digit hour in base 24
 * HH
 * @example
 * // one or two digit hour in base 24
 * H
 * @example
 * // zero-padded two digit hour in base 12
 * hh
 * @example
 * // one or two digit hour in base 12
 * h
 * @example
 * // zero-padded two digit minute
 * mm
 * @example
 * // one or two digit minute
 * m
 * @example
 * // zero-padded three digit millisecond
 * fff
 * @example
 * // zero-padded two digit millisecond
 * ff
 * @example
 * // zero-padded one digit millisecond
 * f
 * @example
 * // upper-case meridiem
 * TT
 * @example
 * // first character of upper-case meridiem
 * T
 * @example
 * // lower-case meridiem
 * tt
 * @example
 * // first character of lower-case meridiem
 * t
 * @this {Date}
 * @param {string=} string	The format string; dddd MMMM d, yyyy
 * @param {string=} invalid	What string to return for invalid date values
 * @return {!string}
 */
Date_prototype.toFormat = function(string, invalid) {
	if (IS_NAN(this.valueOf())) return arguments.length > 1 ? invalid : DATE_INVALID.toString();
	return (string || "").split(DATE_FILTER_FORMAT).map(function(piece) {
		if (!piece) return "";
		else if (piece.startsWith("\\")) return piece.substring(1);
		switch (piece) {
			case "yyyy":
			case "yyy": return this.getFullYear();
			case "yy":
			case "y": return this.getFullYear().toString().right(piece.length);
			case "MMMM": return this.getMonthName();
			case "MMM": return this.getMonthName().left(3);
			case "MM":
			case "M": return ZERO_PADDED(this.getMonth() + 1, piece.length);
			case "dddd": return this.getDayName();
			case "ddd": return this.getDayName().left(3);
			case "dd":
			case "d": return ZERO_PADDED(this.getDate(), piece.length);
			//	case "ww":
			//	case "w": return ZERO_PADDED(this.getWeek(), piece.length);
			case "HH":
			case "H": return ZERO_PADDED(this.getHours(), piece.length);
			case "hh":
			case "h": return ZERO_PADDED(this.getHoursBase12(), piece.length);
			case "mm":
			case "m": return ZERO_PADDED(this.getMinutes(), piece.length);
			case "ssss":
			case "sss":
			case "ss":
			case "s": return ZERO_PADDED(this.getSeconds(), piece.length);
			case "ffffff":
			case "fffff":
			case "ffff":
			case "fff":
			case "ff":
			case "f": return ZERO_PADDED(FLOAT("0." + this.getMilliseconds()), 0, piece.length).substring(2);
			case "TT": return this.getMeridiem().toUpperCase();
			case "tt": return this.getMeridiem().toLowerCase();
			case "T": return this.getMeridiem()[0].toUpperCase();
			case "t": return this.getMeridiem()[0].toLowerCase();
			default: return piece;
		}
	}, this).join("");
};
/**
 * Returns a string in the same format as {@link Date#toISOString}, but in the local timezone and without the Zulu suffix.
 * @expose
 * @this {Date}
 * @return {!string}
 **/
Date_prototype.toLocalString = function toLocalString() { return this.toFormat("yyyy-MM-dd\\THH:mm:ss.fff"); };
//#endregion Format

//#region Inspection
/**
 * Compares the given date and returns true if both have the same month and year.
 * @expose
 * @this {Date}
 * @param {!Date} other
 * @return {!boolean}
 */
Date_prototype.isSameMonth = function(other) {
	return other instanceof Date &&
		this.getMonth() === other.getMonth() &&
		this.getFullYear() === other.getFullYear();
};
/**
 * Compares the given date and returns true if both have the same day, month, and year.
 * @expose
 * @this {Date}
 * @param {!Date} other
 * @return {!boolean}
 */
Date_prototype.isSameDay = function(other) {
	return other instanceof Date &&
		this.getDate() === other.getDate() &&
		this.getMonth() === other.getMonth() &&
		this.getFullYear() === other.getFullYear();
};
/**
 * Compares the given date and returns true if both have the same hour/minute/second/millisecond.
 * The day is ignoted for the calculation; see {@link Date#isSameDay}.
 * @expose
 * @this {Date}
 * @param {!Date} other
 * @param {number=} accuracy	0 (or undefined): to the millisecond, 1: to the second, 2: to the minute, 3: to the hour.
 * @return {!boolean}
 */
Date_prototype.isSameTime = function(other, accuracy) {
	if (IS_NAN(accuracy)) accuracy = 0;
	return other instanceof Date
		&& (accuracy > 0 || this.getMilliseconds() === other.getMilliseconds())
		&& (accuracy > 1 || this.getSeconds() === other.getSeconds())
		&& (accuracy > 2 || this.getMinutes() === other.getMinutes())
		&& (/*accuracy > 3 ||*/ this.getHours() === other.getHours());
};
/**
 * Checks to see if this date is midnight using given the accuracy.
 * @expose
 * @this {Date}
 * @param {number=} accuracy	0 (or undefined): to the millisecond, 1: to the second, 2: to the minute, 3: to the hour.
 * @return {!boolean}
 */
Date_prototype.isMidnight = function(accuracy) {
	var midnight = Date.midnight(this);
	if (IS_NAN(accuracy)) accuracy = 0;
	return this.isSameTime(midnight, accuracy);
};
/**
 * Checks to see if this Date#valud() returns NaN.
 * @expose
 * @this {Date}
 * @return {!boolean}
 */
Date_prototype.isValid = function() { return IS_AN(this.valueOf()); };
/**
 * Returns the first weekday of the month.
 * @expose
 * @this {Date}
 * @return {!number}
 */
Date_prototype.getFirstDay = function() {
	var day = new Date(this.valueOf());
	day.setDate(1);
	return day.getDay();
};
/**
 * Returns the last date of the month.
 * @expose
 * @this {Date}
 * @return {!number}
 */
Date_prototype.getLastDate = function() {
	var last = new Date(this.valueOf());
	last.setDate(1);
	last.setMonth(1 + last.getMonth());
	last.setDate(0);
	return last.getDate();
};
/**
 * Returns the hours in base 12.  Substitutes midnight (0) for 12.
 * @expose
 * @this {Date}
 * @return {!number}
 */
Date_prototype.getHoursBase12 = function() {
	var hours = this.getHours() % 12;
	return hours === 0 ? 12 : hours;
};
//#endregion Inspection

//#region Modification
/**
 * Add the given value as years to this date instance.
 * If no value is given, the default is 1.
 * @expose
 * @this {Date}
 * @param {number=} value	Default is 1.
 * @return {!Date} this
 */
Date_prototype.addYear = function(value) {
	if (!IS_AN(value)) value = 1;
	this.setFullYear(this.getFullYear() + value);
	return this;
};
/**
 * Add the given value as months to this date instance.
 * If no value is given, the default is 1.
 * @expose
 * @this {Date}
 * @param {number=} value	Default is 1.
 * @return {!Date} this
 */
Date_prototype.addMonth = function(value) {
	if (!IS_AN(value)) value = 1;
	this.setMonth(this.getMonth() + value);
	return this;
};
/**
 * Add the given value as weeks (7 days) to this date instance.
 * If no value is given, the default is 1.
 * @expose
 * @this {Date}
 * @param {number=} value	Default is 1.
 * @return {!Date} this
 **/
Date_prototype.addWeek = function(value) {
	if (!IS_AN(value)) value = 1;
	this.setDate(this.getDate() + (value * 7));
	return this;
};
/**
 * Add the given value as days to this date instance.
 * If no value is given, the default is 1.
 * @expose
 * @this {Date}
 * @param {number=} value	Default is 1.
 * @return {!Date} this
 */
Date_prototype.addDate = function(value) {
	if (!IS_AN(value)) value = 1;
	this.setDate(this.getDate() + value);
	return this;
};
/**
 * Add the given value as hours to this date instance.
 * If no value is given, the default is 1.
 * @expose
 * @this {Date}
 * @param {number=} value	Default is 1.
 * @return {!Date} this
 */
Date_prototype.addHours = function(value) {
	if (!IS_AN(value)) value = 1;
	this.setHours(this.getHours() + value);
	return this;
};
/**
 * Add the given value as minutes to this date instance.
 * If no value is given, the default is 1.
 * @expose
 * @this {Date}
 * @param {number=} value	Default is 1.
 * @return {!Date} this
 */
Date_prototype.addMinutes = function(value) {
	if (!IS_AN(value)) value = 1;
	this.setMinutes(this.getMinutes() + value);
	return this;
};
/**
 * Add the given value as seconds to this date instance.
 * If no value is given, the default is 1.
 * @expose
 * @this {Date}
 * @param {number=} value	Default is 1.
 * @return {!Date} this
 */
Date_prototype.addSeconds = function(value) {
	if (!IS_AN(value)) value = 1;
	this.setSeconds(this.getSeconds() + value);
	return this;
};
/**
 * Add the given value as milliseconds to this date instance.
 * If no value is given, the default is 1.
 * @expose
 * @this {Date}
 * @param {number=} value	Default is 1.
 * @return {!Date} this
 */
Date_prototype.addMilliseconds = function(value) {
	if (!OBJECT_IS_NOTHING(value)) value = value.valueOf();
	if (!IS_AN(value)) value = 1;
	this.setMilliseconds(this.getMilliseconds() + value);
	return this;
};
/**
 * Alias for {@link Date#addMilliseconds}.
 * @expose
 * @this {Date}
 * @param {number=} value	Default is 1.
 * @return {!Date} this
 */
Date_prototype.add = Date_prototype.addMilliseconds;
/**
 * Resets the given date parts to zero.
 * @expose
 * @this {Date}
 * @param {...string} var_args
 * @return {!Date} this
 **/
Date_prototype.zero = function(var_args) {
	var_args = SLICE.call(arguments);
	for (var i = 0, l = var_args.length; i < l; i++) {
		var part = var_args[i] || "",
			index = part.endsWith("+")
				? DATE_PART_INDEX.indexOf(part[0])
				: -1;
		if (part[0] === "w") index++;
		if (index > -1) var_args.inject(DATE_PART_INDEX.slice(index + 1).remove("w"));
	}
	var_args.order(function(a, b) {
		var aIndex = DATE_PART_INDEX.indexOf(a),
			bIndex = DATE_PART_INDEX.indexOf(b);
		return ARRAY_COMPARE(bIndex, aIndex);// reversed because index is highest to lowest, but zeroing should be lowest to highest
	}).forEach(function(part) {
		switch (part[0]) {
			case "y": this.setFullYear(1970); break;
			case "M": this.setMonth(0); break;
			case "w": this.setDate(this.getDate() - this.getDay()); break;
			case "d": this.setDate(1); break;
			case "h": this.setHours(0); break;
			case "m": this.setMinutes(0); break;
			case "s": this.setSeconds(0); break;
			case "f": this.setMilliseconds(0); break;
		}
	}, this);
	return this;
};
/**
 * Zeros this date to the given part.
 * When also giving a denominator, will invoke the {@link Number#nearest} on that part's value.
 * @expose
 * @this {Date}
 * @param {!string} part
 * @param {number=} denominator	The closest number on which to round.  Default is 1.
 * @param {boolean=} rounding		When true will round up to the nearest, when false will round down to the nearest, and when not given, will round to closest.
 * @return {!Date} this
 **/
Date_prototype.nearest = function(part, denominator, rounding) {
	var index = DATE_PART_INDEX.indexOf((part || "")[0]),
		zero = DATE_PART_INDEX[index + 1],
		comparer = DEFAULT_DATE_CONTEXT_COMPARERS[index];
	if (comparer) {
		var value = comparer.get.call(this);
		if (zero) this.zero(zero + "+");
		comparer._set.call(this, NEAREST(value, denominator, rounding));
	} else if (zero) {
		this.zero(zero + "+");
	}
	return this;
};
/**
 * Returns a new Date that is adjusted to UTC based on the browser's timezone.
 * @expose
 * @this {Date}
 * @return {!Date}
 **/
Date_prototype.toUtc = function() { return (new Date(this)).addMinutes(this.getTimezoneOffset()); }
//#endregion Modification

/** 
 * Publicly exposed members which are all used internally by Date prototypes.
 * @namespace
 * @expose
 **/
ns.Date = {
	/**
	 * A dictionary where the key is a date-part and the value is the name of that part.
	 * When working in a different language, change these values so {@link Date#compare} responses are correct.
	 * @const {Object}
	 **/
	"parts": {
		"yyyy": "years",
		"MM": "months",
		"ww": "weeks",
		"dd": "days",
		"hh": "hours",
		"mm": "minutes",
		"ss": "seconds",
		"fff": "milliseconds",
	},
	/**
	 * A dictionary where the key is a date-part and the value is the number of milliseconds in that part.
	 * @const {Object}
	 **/
	"milli": OBJECT.freeze(DATE_MILLI_PER),
	/**
	 * A two-item array containing the abbreviations for A.M. and P.M.
	 * When working in a different language, change these values so {@link Date#compare} responses are correct.
	 * @const {Array.<string>}
	 **/
	"meridiem": [
		"am",
		"pm"
	],
	/**
	 * A seven-item array containing the names of the days of the week.
	 * When working in a different language, change these values so {@link Date#compare} responses are correct.
	 * @const {Array.<string>}
	 **/
	"dayNames": [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	],
	/**
	 * A twelve-item array containing the names of the months.
	 * When working in a different language, change these values so {@link Date#context} responses are correct.
	 * @const {Array.<string>}
	 **/
	"monthNames": [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	],
	/**
	 * A dictionary where the key is one of "before", "after", and "now", and the value is a string.
	 * Each string can optionally contain the value "{diff}" which is replaced with the date comparisn context string value.
	 * When working in a different language, change these values so {@link Date#contextString} responses are correct.
	 * @const {Object}
	 **/
	"context": {
		"before": "{diff} until",
		"after": "{diff} ago",
		"now": "now",
	},
};

/**
 * An array used by the {@link Date#context} function.
 * This is added to the bottom of the file so all the prototypes ae defined.
 * @const {Array.<{type:string,_min:string,get:function():number,_set:function(number),inc:function(number)}>}
 **/
var DEFAULT_DATE_CONTEXT_COMPARERS = [
	{
		type: "yyyy",
		//_min: "y",
		get: Date_prototype.getFullYear,
		_set: Date_prototype.setFullYear,
		inc: Date_prototype.addYear,
	},
	{
		type: "MM",
		//_min: "MM",
		get: Date_prototype.getMonth,
		_set: Date_prototype.setMonth,
		inc: Date_prototype.addMonth,
	},
	{
		type: "ww",
		//_min: "ww",
		/**
		 * 
		 * @this  {Date}
		 **/
		get: function() { return FLOOR(this.getDate() / 7); },
		/**
		 * 
		 * @this  {Date}
		 **/
		_set: function(value) { /* what to do here */ },
		/**
		 * 
		 * @this  {Date}
		 **/
		inc: function(n) { this.addDate(n * 7); },
	},
	{
		type: "dd",
		//_min: "dd",
		get: Date_prototype.getDate,
		_set: Date_prototype.setDate,
		inc: Date_prototype.addDate,
	},
	{
		type: "hh",
		//_min: "hh",
		get: Date_prototype.getHours,
		_set: Date_prototype.setHours,
		inc: Date_prototype.addHours,
	},
	{
		type: "mm",
		//_min: "mm",
		get: Date_prototype.getMinutes,
		_set: Date_prototype.setMinutes,
		inc: Date_prototype.addMinutes,
	},
	{
		type: "ss",
		//_min: "ss",
		get: Date_prototype.getSeconds,
		_set: Date_prototype.setSeconds,
		inc: Date_prototype.addSeconds,
	},
	{
		type: "fff",
		//_min: "fff",
		get: Date_prototype.getMilliseconds,
		_set: Date_prototype.setMilliseconds,
		inc: Date_prototype.addMilliseconds,
	},
];

/**
 *
 * @const {Array.<string>}
 **/
var DATE_PART_INDEX = DEFAULT_DATE_CONTEXT_COMPARERS.map(function(c) {
	return c._min = c.type[0];
});
