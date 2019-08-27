/// <reference path="..\..\blds\pseudo3.js" />

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
 * @return {!string}
 */
String_prototype.toCapital = function() {
	return this[0].toUpperCase() + this.substring(1);
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
