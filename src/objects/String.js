/// <reference path="..\blds\pseudo3.js" />

var String_prototype = String[PROTOTYPE];
var FILTER_TRIM_LEFT = /^\s+/gm;
var FILTER_TRIM_RIGHT = /\s+$/gm;
/**
 * 
 * @expose
 * @this {string}
 * @param {string|RegExp} object
 * @return {!boolean}
 */
String_prototype.contains = function(object) {
	return (object instanceof RegExp ? this.search(object) : this.indexOf(object)) > -1;
};
/**
 * 
 * @expose
 * @this {string}
 * @param {string} string
 * @return {!number}
 */
String_prototype.count = function(string) {
	return this.split(string).length - 1;
};
/**
 * 
 * @expose
 * @this {string}
 * @return {!string}
 */
String_prototype.reverse = function() {
	return this.split("").reverse().join("");
};
/**
 * 
 * @expose
 * @this {string}
 * @param {string|RegExp} object
 * @return {!boolean}
 */
String_prototype.startsWith = function(object) {
	return (object instanceof RegExp ? this.search(object) : this.indexOf(object)) === 0;
}
/**
 * 
 * @expose
 * @this {string}
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
 * 
 * @expose
 * @this {string}
 * @param {string|RegExp} object
 * @return {!string}
 */
String_prototype.prune = function(object) {
	return !this.length ? "" : this.pruneEnd(object).pruneStart(object);
};
/**
 * 
 * @expose
 * @this {string}
 * @param {string|RegExp} object
 * @return {!string}
 */
String_prototype.pruneStart = function(object) {
	var pruned = this.valueOf();
	if (!pruned) return "";
	else if (arguments.length < 1) object = FILTER_TRIM_LEFT;
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
 * 
 * @expose
 * @this {string}
 * @param {string|RegExp} object
 * @return {!string}
 */
String_prototype.pruneEnd = function(object) {
	var pruned = this.valueOf();
	if (!pruned) return "";
	else if (arguments.length < 1) object = FILTER_TRIM_RIGHT;
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
 * 
 * @expose
 * @this {string}
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
 * 
 * @expose
 * @this {string}
 * @param {number} length
 * @return {!string}
 */
String_prototype.left = function(length) {
	return length < 0 ? this.slice(-length) : this.substring(0, length);
};
/**
 * 
 * @expose
 * @this {string}
 * @param {number} length
 * @return {!string}
 */
String_prototype.right = function(length) {
	return length < 0 ? this.substring(0, length + this.length) : this.slice(-length);
};
/**
 * 
 * @expose
 * @this {string}
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
 * 
 * @expose
 * @this {string}
 * @return {!string}
 */
String_prototype.toCapital = function() {
	return this[0].toUpperCase() + this.substring(1);
};
/**
 * 
 * @expose
 * @this {string}
 * @param {string} string
 * @return {!string}
 */
String_prototype.after = function(string) {
	return this.substring(this.indexOf(string) + string.length);
};
/**
 * 
 * @expose
 * @this {string}
 * @param {string} string
 * @return {!string}
 */
String_prototype.afterLast = function(string) {
	return this.substring(this.lastIndexOf(string) + string.length);
};
/**
 * 
 * @expose
 * @this {string}
 * @param {string} string
 * @return {!string}
 */
String_prototype.before = function(string) {
	return this.substring(0, this.indexOf(string));
};
/**
 * 
 * @expose
 * @this {string}
 * @param {string} string
 * @return {!string}
 */
String_prototype.beforeLast = function(string) {
	return this.substring(0, this.lastIndexOf(string));
};
