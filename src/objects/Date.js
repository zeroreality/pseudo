/// <reference path="..\..\blds\pseudo3.js" />

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
var DATE_FILTER_FORMAT = /(\\.|[ydM]{1,4}|[hHmstT]{1,2}|[f]{1,6})/gm;

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
	"fff": 1
};

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
	date.addMilliseconds(
		-date.getMilliseconds()
		- (date.getSeconds() * DATE_MILLI_PER["ss"])
		- (date.getMinutes() * DATE_MILLI_PER["mm"])
		- (date.getHours() * DATE_MILLI_PER["hh"])
	);
	return date;
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
 * @param {Array.<string>=} kinds	Default is yyyy, MM, ww, dd, hh, mm, ss. Does not include fff.
 * @return {!Array.<{value:number,type:string}>}
 */
Date_prototype.context = function(other, levels, kinds) {
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
	other = !(other instanceof Date) || IS_NAN(other.valueOf())
		? new Date
		: new Date(other);	// create a copy of the target date
	if (IS_NAN(levels)) levels = 2;
	if (!kinds || !kinds.length) kinds = "yyyy,MM,ww,dd,hh,mm,ss".split(",");

	// cycle through helper/comparers
	var descriptor = [];
	for (var i = 0, criteria; criteria = DATE_HELPER_COMPARE[i]; i++) {
		if (kinds.includes(criteria.type)) {
			var diff = FLOOR(criteria._get.call(other) - criteria._get.call(this));
			if (diff) criteria._add.call(other, -diff);
			// only add results if there are any, or there have been some
			if (diff || descriptor.length) descriptor.push(new DateContextDescriptor(diff, criteria.type));
		}
	}

	// remove "zero" values
	return descriptor.filter(function(desc) { return desc.value; }).slice(0, levels);
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
	template = PSEUDO_MERGE(ns.Date["context"], template || {});
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
	return other instanceof Date &&
		(accuracy > 0 || this.getMilliseconds() === other.getMilliseconds()) &&
		(accuracy > 1 || this.getSeconds() === other.getSeconds()) &&
		(accuracy > 2 || this.getMinutes() === other.getMinutes()) &&
		/*accuracy > 3 ||*/ this.getHours() === other.getHours();
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
Date_prototype.isValid = function() {
	return IS_AN(this.valueOf());
};
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
 * @const {Array.<{type:string,_get:function():number,_add:function(number)}>}
 **/
var DATE_HELPER_COMPARE = [
	{ type: "yyyy", _get: Date_prototype.getFullYear, _add: Date_prototype.addYear },
	{ type: "MM", _get: Date_prototype.getMonth, _add: Date_prototype.addMonth },
	{ type: "ww", _get: function() { return FLOOR(this.getDate() / 7); }, _add: function(n) { this.addDate(n * 7); } },
	{ type: "dd", _get: Date_prototype.getDate, _add: Date_prototype.addDate },
	{ type: "hh", _get: Date_prototype.getHours, _add: Date_prototype.addHours },
	{ type: "mm", _get: Date_prototype.getMinutes, _add: Date_prototype.addMinutes },
	{ type: "ss", _get: Date_prototype.getSeconds, _add: Date_prototype.addSeconds },
	{ type: "fff", _get: Date_prototype.getMilliseconds, _add: Date_prototype.addMilliseconds },
];
