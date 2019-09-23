/// <reference path="..\..\blds\pseudo3.js" />

/** @const {Object} */
var Set_prototype = Set[PROTOTYPE];

//#region Inspection
/**
 * Returns a boolean asserting whether a value has been added to the dictionary or not.
 * @expose
 * @this {Set.<V>}
 * @param {V} value
 * @return {!boolean}
 */
Set_prototype.hasValue = function(value) {
	var has = false,
		finder = CHOOSE_FINDER(value);
	this.forEach(function(v, k) {
		if (!has) has = finder.call(value, v);
	});
	return has;
};
/**
 * Checks each pair in the dictionary and returns true if one pair matches the predicate.
 * @expose
 * @this {Set.<V>}
 * @param {!function(?,Set):boolean} predicate
 * @param {!Object=} context
 * @throws {TypeError} predicate is not a Function
 * @return {!boolean}
 */
Set_prototype.some = function(predicate, context) {
	if (!OBJECT_IS_FUNCTION(predicate)) {
		throw new TypeError("predicate is not a Function");
	}
	if (arguments.length < 2) context = this;
	var has = false;
	this.forEach(function(value) {
		if (!has) has = predicate.call(context, value, this);
	});
	return has;
};
/**
 * Checks each pair in the dictionary and returns true only if all pairs match the predicate.
 * @expose
 * @this {Set.<V>}
 * @param {!function(?,Set):boolean} predicate
 * @param {!Object=} context
 * @throws {TypeError} predicate is not a Function
 * @return {!boolean}
 */
Set_prototype.every = function(predicate, context) {
	if (!OBJECT_IS_FUNCTION(predicate)) {
		throw new TypeError("predicate is not a Function");
	}
	if (arguments.length < 2) context = this;
	var all = true;
	this.forEach(function(value) {
		if (all) all = predicate.call(context, value, this);
	});
	return all;
};
//#endregion Inspection

//#region Modification
//#endregion Modification

//#region Transform
/**
 * Quickly creates and returns a duplicate of this dictionary.
 * @expose
 * @this {Set.<V>}
 */
Set_prototype.copy = function() {
	return new Set(this);
};
/**
 * Builds a new dictionary with only the positive results from the predicate.
 * @expose
 * @this {Set.<V>}
 * @param {!function(?,Set):boolean} predicate
 * @param {!Object=} context
 * @throws {TypeError} predicate is not a Function
 * @return {!Set}
 */
Set_prototype.filter = function(predicate, context) {
	if (!OBJECT_IS_FUNCTION(predicate)) {
		throw new TypeError("predicate is not a Function");
	}
	if (arguments.length < 2) context = this;
	var results = new Set();
	this.forEach(function(value) {
		if (predicate.call(context, value, this)) {
			results.add(value);
		}
	}, context);
	return results;
};
/**
 * Builds an array out of the results of the predicate.
 * @expose
 * @this {Set.<V>}
 * @param {!function(?,Set):?} predicate
 * @param {!Object=} context
 * @throws {TypeError} predicate is not a Function
 * @return {!Array.<?>}
 */
Set_prototype.toArray = function(predicate, context) {
	if (!OBJECT_IS_FUNCTION(predicate)) {
		throw new TypeError("predicate is not a Function");
	}
	if (arguments.length < 2) context = this;
	var results = [],
		index = 0;
	this.forEach(function(value) {
		results[index++] = predicate.call(context, value, this);
	}, context);
	return results;
};
/**
 * Builds a new dictionary out of the results of the predicates.
 * @expose
 * @this {Set.<V>}
 * @param {!function(?,Set):?} predicate
 * @param {!Object=} context
 * @throws {TypeError} predicate is not a Function
 * @return {!Set}
 */
Set_prototype.map = function(predicate, context) {
	if (!OBJECT_IS_FUNCTION(predicate)) {
		throw new TypeError("predicate is not a Function");
	}
	if (arguments.length < 3) context = this;
	var results = new Set();
	this.forEach(function(value) {
		results.add(predicate.call(context, value, this));
	});
	return results;
};
//#endregion Transform
