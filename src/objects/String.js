/// <reference path="..\..\blds\pseudo3.js" />

//#region Codifying names/values
/**
 * A mapping for non-accented lower-case characters.
 * @type {Object.<string,string>}
 */
var DIACRITICS = {
	'\u2c61': "l", '\u2c65': "a", '\u2c66': "t", '\u2c68': "h", '\u2c6a': "k", '\u2c6c': "z", '\u2c73': "w", '\u2c76': "h",
	'\u008c': "oe", '\u009c': "oe", '\u00df': "s", '\u00e0': "a", '\u00e1': "a", '\u00e2': "a", '\u00e3': "a", '\u00e4': "a",
	'\u00e5': "a", '\u00e6': "ae", '\u00e7': "c", '\u00e8': "e", '\u00e9': "e", '\u00ea': "e", '\u00eb': "e", '\u00ec': "i",
	'\u00ed': "i", '\u00ee': "i", '\u00ef': "i", '\u00f1': "n", '\u00f2': "o", '\u00f3': "o", '\u00f4': "o", '\u00f5': "o",
	'\u00f6': "o", '\u00f8': "o", '\u00f9': "u", '\u00fa': "u", '\u00fb': "u", '\u00fc': "u", '\u00fd': "y", '\u00ff': "y",
	'\u0101': "a", '\u0103': "a", '\u0105': "a", '\u0107': "c", '\u0109': "c", '\u010b': "c", '\u010d': "c", '\u010f': "d",
	'\u0111': "d", '\u0113': "e", '\u0115': "e", '\u0117': "e", '\u0119': "e", '\u011b': "e", '\u011d': "g", '\u011f': "g",
	'\u0121': "g", '\u0123': "g", '\u0125': "h", '\u0127': "h", '\u0129': "i", '\u012b': "i", '\u012d': "i", '\u012f': "i",
	'\u0131': "i", '\u0135': "j", '\u0137': "k", '\u013a': "l", '\u013c': "l", '\u013e': "l", '\u0140': "l", '\u0142': "l",
	'\u0144': "n", '\u0146': "n", '\u0148': "n", '\u0149': "n", '\u014d': "o", '\u014f': "o", '\u0151': "o", '\u0153': "oe",
	'\u0155': "r", '\u0157': "r", '\u0159': "r", '\u015b': "s", '\u015d': "s", '\u015f': "s", '\u0161': "s", '\u0163': "t",
	'\u0165': "t", '\u0167': "t", '\u0169': "u", '\u016b': "u", '\u016d': "u", '\u016f': "u", '\u0171': "u", '\u0173': "u",
	'\u0175': "w", '\u0177': "y", '\u017a': "z", '\u017c': "z", '\u017e': "z", '\u017f': "l", '\u0180': "b", '\u0183': "b",
	'\u0188': "c", '\u018c': "d", '\u0192': "f", '\u0195': "hv", '\u0199': "k", '\u019a': "l", '\u019e': "n", '\u01a1': "o",
	'\u01a3': "oi", '\u01a5': "p", '\ua729': "tz", '\ua733': "aa", '\ua735': "ao", '\ua737': "au", '\ua739': "av", '\ua73b': "av",
	'\ua73d': "ay", '\ua73f': "c", '\ua741': "k", '\ua743': "k", '\ua745': "k", '\ua747': "l", '\ua749': "l", '\ua74b': "o",
	'\ua74d': "o", '\ua74f': "oo", '\ua751': "p", '\ua753': "p", '\ua755': "p", '\ua757': "q", '\ua759': "q", '\ua75b': "r",
	'\ua75f': "v", '\ua761': "vy", '\ua763': "z", '\ua77a': "d", '\ua77c': "f", '\ua77f': "g", '\ua781': "l", '\ua783': "r",
	'\ua785': "s", '\ua787': "t", '\ua791': "n", '\u01ad': "t", '\ua7a1': "g", '\ua7a3': "k", '\ua7a5': "n", '\ua7a7': "r",
	'\ua7a9': "s", '\u01b0': "u", '\u01b4': "y", '\u01b6': "z", '\u01c6': "dz", '\u01c9': "lj", '\u01cc': "nj", '\u01ce': "a",
	'\u01d0': "i", '\u01d2': "o", '\u01d4': "u", '\u01d6': "u", '\u01d8': "u", '\u01da': "u", '\u01dc': "u", '\u01dd': "e",
	'\u01df': "a", '\u01e1': "a", '\u01e3': "ae", '\u01e5': "g", '\u01e7': "g", '\u01e9': "k", '\u01eb': "o", '\u01ed': "o",
	'\u01f0': "j", '\u01f3': "dz", '\u01f5': "g", '\u01f9': "n", '\u01fb': "a", '\u01fd': "ae", '\u01ff': "o", '\u0201': "a",
	'\u0203': "a", '\u0205': "e", '\u0207': "e", '\u0209': "i", '\u020b': "i", '\u020d': "o", '\u020f': "o", '\u0211': "r",
	'\u0213': "r", '\u0215': "u", '\u0217': "u", '\u0219': "s", '\u021b': "t", '\u021f': "h", '\u0223': "ou", '\u0225': "z",
	'\u0227': "a", '\u0229': "e", '\u022b': "o", '\u022d': "o", '\u022f': "o", '\u0231': "o", '\u0233': "y", '\u023c': "c",
	'\u023f': "s", '\u0240': "z", '\u0247': "e", '\u0249': "j", '\u024b': "q", '\u024d': "r", '\u024f': "y", '\u0250': "a",
	'\u0253': "b", '\u0254': "o", '\u0256': "d", '\u0257': "d", '\u025b': "e", '\u0260': "g", '\u0265': "h", '\u0268': "i",
	'\u026b': "l", '\u026f': "m", '\u0271': "m", '\u0272': "n", '\u0275': "o", '\u027d': "r", '\u0288': "t", '\u0289': "u",
	'\u028b': "v", '\u028c': "v", '\uff41': "a", '\uff42': "b", '\uff43': "c", '\uff44': "d", '\uff45': "e", '\uff46': "f",
	'\uff47': "g", '\uff48': "h", '\uff49': "i", '\uff4a': "j", '\uff4b': "k", '\uff4c': "l", '\uff4d': "m", '\uff4e': "n",
	'\uff4f': "o", '\uff50': "p", '\uff51': "q", '\uff52': "r", '\uff53': "s", '\uff54': "t", '\uff55': "u", '\uff56': "v",
	'\uff57': "w", '\uff58': "x", '\uff59': "y", '\uff5a': "z", '\u1d79': "g", '\u1d7d': "p", '\u1e01': "a", '\u1e03': "b",
	'\u1e05': "b", '\u1e07': "b", '\u1e09': "c", '\u1e0b': "d", '\u1e0d': "d", '\u1e0f': "d", '\u1e11': "d", '\u1e13': "d",
	'\u1e15': "e", '\u1e17': "e", '\u1e19': "e", '\u1e1b': "e", '\u1e1d': "e", '\u1e1f': "f", '\u1e21': "g", '\u1e23': "h",
	'\u1e25': "h", '\u1e27': "h", '\u1e29': "h", '\u1e2b': "h", '\u1e2d': "i", '\u1e2f': "i", '\u1e31': "k", '\u1e33': "k",
	'\u1e35': "k", '\u1e37': "l", '\u1e39': "l", '\u1e3b': "l", '\u1e3d': "l", '\u1e3f': "m", '\u1e41': "m", '\u1e43': "m",
	'\u1e45': "n", '\u0307': "i", '\u1e47': "n", '\u1e49': "n", '\u1e4b': "n", '\u1e4d': "o", '\u1e4f': "o", '\u1e51': "o",
	'\u1e53': "o", '\u1e55': "p", '\u1e57': "p", '\u1e59': "r", '\u1e5b': "r", '\u1e5d': "r", '\u1e5f': "r", '\u1e61': "s",
	'\u1e63': "s", '\u1e65': "s", '\u1e67': "s", '\u1e69': "s", '\u1e6b': "t", '\u1e6d': "t", '\u1e6f': "t", '\u1e71': "t",
	'\u1e73': "u", '\u1e75': "u", '\u1e77': "u", '\u1e79': "u", '\u1e7b': "u", '\u1e7d': "v", '\u1e7f': "v", '\u1e81': "w",
	'\u1e83': "w", '\u1e85': "w", '\u1e87': "w", '\u1e89': "w", '\u1e8b': "x", '\u1e8d': "x", '\u1e8f': "y", '\u1e91': "z",
	'\u1e93': "z", '\u1e95': "z", '\u1e96': "h", '\u1e97': "t", '\u1e98': "w", '\u1e99': "y", '\u1e9a': "a", '\u1e9b': "s",
	'\u1ea1': "a", '\u1ea3': "a", '\u1ea5': "a", '\u1ea7': "a", '\u1ea9': "a", '\u1eab': "a", '\u1ead': "a", '\u1eaf': "a",
	'\u1eb1': "a", '\u1eb3': "a", '\u1eb5': "a", '\u1eb7': "a", '\u1eb9': "e", '\u1ebb': "e", '\u1ebd': "e", '\u1ebf': "e",
	'\u1ec1': "e", '\u1ec3': "e", '\u1ec5': "e", '\u1ec7': "e", '\u1ec9': "i", '\u1ecb': "i", '\u1ecd': "o", '\u1ecf': "o",
	'\u1ed1': "o", '\u1ed3': "o", '\u1ed5': "o", '\u1ed7': "o", '\u1ed9': "o", '\u1edb': "o", '\u1edd': "o", '\u1edf': "o",
	'\u1ee1': "o", '\u1ee3': "o", '\u1ee5': "u", '\u1ee7': "u", '\u1ee9': "u", '\u1eeb': "u", '\u1eed': "u", '\u1eef': "u",
	'\u1ef1': "u", '\u1ef3': "y", '\u1ef5': "y", '\u1ef7': "y", '\u1ef9': "y", '\u1eff': "y", '\u2184': "c", '\u24d0': "a",
	'\u24d1': "b", '\u24d2': "c", '\u24d3': "d", '\u24d4': "e", '\u24d5': "f", '\u24d6': "g", '\u24d7': "h", '\u24d8': "i",
	'\u24d9': "j", '\u24da': "k", '\u24db': "l", '\u24dc': "m", '\u24dd': "n", '\u24de': "o", '\u24df': "p", '\u24e0': "q",
	'\u24e1': "r", '\u24e2': "s", '\u24e3': "t", '\u24e4': "u", '\u24e5': "v", '\u24e6': "w", '\u24e7': "x", '\u24e8': "y",
	'\u24e9': "z",
};
/**
 * A list of UTF8 quotation marks and apostrophes.
 * @type {Array.<string>}
 */
var QUOTATIONS = [
	'\u0022', '\u0027', '\u005e', '\u0060', '\u00ab', '\u00b4',
	'\u00bb', '\u02ba', '\u02dd', '\u02ee', '\u02f6', '\u05f2',
	'\u05f4', '\u1cd3', '\u201c', '\u201d', '\u201f', '\u2033',
	'\u2036', '\u3003', '\uff02'
];

/**
 * Creates a searchable/coded string based on a user inputted string.  Quotation marks, apostrophes, and accents are removed.
 * @param {!string} input The string to codify
 * @throws {TypeError} input value is not a string
 * @return {!string} The codified representation of the input
 */
function CODIFIER(input) {
	var dash = true,
		output = "";
	input = OBJECT_IS_NOTHING(input) ? "" : String(input).toLocaleLowerCase();
	for (var i = 0, l = input.length; i < l; i++) {
		var char = input[i],
			letter = DIACRITICS[char],
			code = (letter || char).charCodeAt(0),
			isQuote = !letter && QUOTATIONS.includes(char),
			isChar = !isQuote && (code >= 97 && code <= 122 || code >= 48 && code <= 57);
		if (isChar) output += letter || char;
		else if (!isQuote && !dash) output += '-';
		if (!isQuote) dash = !isChar;
	}
	return dash
		? output.slice(0, -1)
		: output;
}
//#endregion Codifying names/values

/**
 * 
 * @const {Object}
 **/
var String_prototype = String[PROTOTYPE];

/**
 * Similar to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes|String#includes},
 * but instead of taking a second argument as startIndex, it takes N arguments and returns true if any of the objects are present in the array.
 * Additionally, the function accepts both {@link String}s and {@link RegExp}s as arguments.
 * @expose
 * @this {String}
 * @param {...string|RegExp} var_args
 * @return {!boolean}
 */
String_prototype.hasAny = function(var_args) {
	for (var i = 0, l = arguments.length; i < l; i++) {
		if ((arguments[i] instanceof RegExp ? this.search(arguments[i]) : this.indexOf(arguments[i])) > -1) {
			return true;
		}
	}
	return false;
};
/**
 * Similar to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes|String#includes},
 * but instead of taking a second argument as startIndex, it takes N arguments and returns true if all of the objects are present in the array.
 * Additionally, the function accepts both {@link String}s and {@link RegExp}s as arguments.
 * @expose
 * @this {String}
 * @param {...string|RegExp} var_args
 * @return {!boolean}
 */
String_prototype.hasAll = function(var_args) {
	for (var i = 0, l = arguments.length; i < l; i++) {
		if ((arguments[i] instanceof RegExp ? this.search(arguments[i]) : this.indexOf(arguments[i])) < 0) {
			return false;
		}
	}
	return true;
};
/**
 * Counts the number of instances this string contains the given value.
 * @expose
 * @this {String}
 * @param {string} value
 * @return {!number}
 */
String_prototype.count = function(value) {
	return this.split(value).length - 1;
};

/**
 * Returns a string with this characters in reverse order.
 * @expose
 * @this {String}
 * @return {!string}
 */
String_prototype.reverse = function() {
	return this.split("").reverse().join("");
};

/**
 * Checks to see if this string begins with the given {@link String} or {@link RegExp} pattern.
 * @expose
 * @this {String}
 * @param {string|RegExp} object
 * @return {!boolean}
 */
String_prototype.startsWith = function(object) {
	return (object instanceof RegExp ? this.search(object) : this.indexOf(object)) === 0;
}
/**
 * Checks to see if this string ends with the given {@link String} or {@link RegExp} pattern.
 * @expose
 * @this {String}
 * @param {string|RegExp} object
 * @return {!boolean}
 */
String_prototype.endsWith = function(object) {
	var success = false;
	if (object instanceof RegExp) {
		//	if (!object.source.endsWith("$")) object = new RegExp("(?:" + object.source + ")$");
		success = object.source.endsWith("$")
			? object.test(this)
			: (new RegExp("(?:" + object.source + ")$")).test(this);
	} else if (!OBJECT_IS_NOTHING(object)) {
		var string = object.toString(),
			last = this.lastIndexOf(string);
		success = last > -1
			&& last === this.length - string.length;
	}
	return success;
	/*
	var last = -1;
	return object instanceof RegExp
		? object.source.endsWith("$")
			? object.test(this)
			: (new RegExp("(?:" + object.source + ")$")).test(this)
		: (last = this.lastIndexOf(object)) > -1 && last === this.length - String(object).length;
	//this.slice(-(object = object.toString()).length) === object;
	*/
};

/**
 * Similar to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim|String#trim},
 * but also takes a {@link String} or {@link RegExp} argument to trim from the start and end of this string.
 * @expose
 * @this {String}
 * @param {string|RegExp} object
 * @return {!string}
 */
String_prototype.prune = function(object) {
	return !this.length ? "" : this.pruneEnd(object).pruneStart(object);
};
/**
 * Similar to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trimStart|String#trimStart},
 * but also takes a {@link String} or {@link RegExp} argument to trim from the start of this string.
 * @expose
 * @this {String}
 * @param {string|RegExp} object
 * @return {!string}
 */
String_prototype.pruneStart = function(object) {
	var pruned = this.valueOf();
	if (!pruned) return "";
	if (arguments.length < 1) return this.trimStart();
	if (object instanceof RegExp) {
		while (pruned.search(object) === 0) {
			pruned = pruned.substring(pruned.match(object)[0].length, pruned.length);
		}
	} else {
		var string = String(object);
		while (pruned.indexOf(object) === 0) {
			pruned = pruned.substring(string.length, pruned.length);
		}
	}
	return pruned;
};
/**
 * Similar to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trimEnd|String#trimEnd},
 * but also takes a {@link String} or {@link RegExp} argument to trim from the end of this string.
 * @expose
 * @this {String}
 * @param {string|RegExp} object
 * @return {!string}
 */
String_prototype.pruneEnd = function(object) {
	var pruned = this.valueOf();
	if (!pruned) return "";
	if (arguments.length < 1) return this.trimEnd();
	if (object instanceof RegExp) {
		var matches = pruned.match(object) || [],
			match = matches[matches.length - 1],
			last = !match ? null : pruned.lastIndexOf(match);
		while (match && last === pruned.length - match.length) {
			pruned = pruned.substring(0, last);
			matches = pruned.match(object) || [];
			match = matches[matches.length - 1];
			last = !match ? null : pruned.lastIndexOf(match);
		}
	} else {
		var string = String(object), last = pruned.lastIndexOf(object);
		while (last > -1 && last === pruned.length - string.length) {
			pruned = pruned.substring(0, last);
			last = pruned.lastIndexOf(string);
		}
	}
	return pruned;
};
/**
 * Similar to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace|String#replace},
 * but will replace all instances of the given string.  The replacement string is optional and defaults to blank.
 * @expose
 * @this {String}
 * @param {string} find
 * @param {string=} replacement
 * @return {!string}
 */
String_prototype.replaceAll = function(find, replacement) {
	if (!find) return this.valueOf();
	if (arguments.length < 2) replacement = "";
	return this.split(find).join(replacement);
};

/**
 * Returns the left-most N characters of this string.
 * If a negative number is used, it will return that number of right-most characters instead.
 * @expose
 * @this {String}
 * @param {number} length
 * @return {!string}
 */
String_prototype.left = function(length) {
	return length < 0
		? this.slice(-length)
		: this.substring(0, length);
};
/**
 * Returns the right-most N characters of this string.
 * If a negative number is used, it will return that number of left-most characters instead.
 * @expose
 * @this {String}
 * @param {number} length
 * @return {!string}
 */
String_prototype.right = function(length) {
	return length < 0
		? this.substring(0, length + this.length)
		: this.slice(-length);
};

/**
 * Returns a concatenated string composed of this string N times.
 * @expose
 * @this {String}
 * @param {number} number
 * @return {!string}
 */
String_prototype.repeat = function(number) {
	var me = [];
	for (var i = 0; i < number; i++) {
		me[i] = this;
	}
	return me.join("");
};
/**
 * Returns this string but with the first letter in upper-case.
 * The rest of the string is not made lower-case.
 * @expose
 * @this {String}
 * @param {boolean=} lower	When true, changes the first letter to lower-case.
 * @return {!string}
 */
String_prototype.toCapital = function(lower) {
	return this.length
		? this[0][lower ? "toLowerCase" : "toUpperCase"]() + this.substring(1)
		: "";
};

/**
 * Returns the section of this string after the first instance of the given value.
 * If the value is not found, a blank string is returned.
 * @expose
 * @this {String}
 * @param {string} value
 * @return {!string}
 */
String_prototype.after = function(value) {
	var index = this.indexOf(value);
	return index < 0
		? ""
		: this.substring(index + value.length);
};
/**
 * Returns the section of this string after the last instance of the given value.
 * If the value is not found, a blank string is returned.
 * @expose
 * @this {String}
 * @param {string} value
 * @return {!string}
 */
String_prototype.afterLast = function(value) {
	var index = this.lastIndexOf(value);
	return index < 0
		? ""
		: this.substring(index + value.length);
};
/**
 * Returns the section of this string before the first instance of the given value.
 * If the value is not found, the whole string is returned.
 * @expose
 * @this {String}
 * @param {string} value
 * @return {!string}
 */
String_prototype.before = function(value) {
	var index = this.indexOf(value);
	return index < 0
		? this.valueOf()
		: this.substring(0, index);
};
/**
 * Returns the section of this string before the last instance of the given value.
 * If the value is not found, the whole string is returned.
 * @expose
 * @this {String}
 * @param {string} value
 * @return {!string}
 */
String_prototype.beforeLast = function(value) {
	var index = this.lastIndexOf(value);
	return index < 0
		? this.valueOf()
		: this.substring(0, index);
};

/**
 * Formats a well formed template string with the given values.
 * @expose
 * @this {String}
 * @param {Object} values
 * @param {RegExp=} regex
 * @param {string=} notFound
 * @return {!string}
 */
String_prototype.format = function(values, regex, notFound) {
	return this.replace(regex || /\{[^}]+\}/gim, function(match, index, string) {
		var name = match.slice(1, -1),
			value = name in values
				? values[name]
				: (notFound || "");
		return OBJECT_IS_FUNCTION(value)
			? value(match, index, string)
			: value;
	});
};

/** 
 * Exposing the predicates that are used internally for sorting arrays.
 * @namespace
 * @expose
 **/
ns.String = {
	/**
	 * Converts the given string into an dash-deliminated, lower-case, special/accent characters replaced, quotation removed string.
	 * Helpful for creating page slugs.
	 **/
	"slug": CODIFIER,
	/**
	 * Alternates upper-case and lower-case letters for a given string.
	 * @param {!string} string
	 **/
	"sarcasm": function(string) {
		var i = 0;
		return OBJECT_IS_NOTHING(string)
			? ""
			: String(string).split("").map(function(char) {
				if (!char.search(/[a-z]/i)) i++;
				return char[i % 2 ? "toUpperCase" : "toLowerCase"]();
			}).join("");
	},
};
