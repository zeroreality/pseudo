/// <reference path="..\..\blds\pseudo3.js" />

/** @const {Object} */
var Map_prototype = Map[PROTOTYPE];

/**
 * When used as a Map iterator, will return the key as given.
 * @param {?} object
 * @param {?} key
 * @return {?} key
 */
function MAP_KEY(object, key) {
	return key;
}
/**
 * Chooses the best finder predicate
 * @param {?} value
 * @return {!function(Object,number,Array):boolean}
 */
function CHOOSE_FINDER(value) {
	return OBJECT_IS_NUMBER(value)
		&& (
			isNaN(value) && FINDER_NAN
			|| value == 0 && FINDER_ZERO
		)
		|| OBJECT_IS_NOTHING(value)
		&& FINDER_SELF
		|| FINDER_VALUE;
}
/**
 * Given as the first argument for Array#filter, and finds the matching object in the array by identity match.
 * @this {?}
 * @param {?} value
 * @return {!boolean}
 */
function FINDER_VALUE(value) {
	return value === this.valueOf();
}
/**
 * Given as the first argument for Array#filter, and finds the matching object in the array by reference.
 * Used for *null* and *undefined* search values.
 * @this {?}
 * @param {?} value
 * @return {!boolean}
 */
function FINDER_SELF(value) {
	return value === this;
}
/**
 * Given as the first argument for Array#filter, uses a special case for finding NaN values.
 * @this {?}
 * @param {?} value
 * @return {!boolean}
 */
function FINDER_NAN(value) {
	return IS_NAN(value);
}
/**
 * Given as the first argument for Array#filter, and finds a numeric value of zero.
 * Differentiates between positive zero and negative zero.
 * @this {?}
 * @param {?} value
 * @return {!boolean}
 */
function FINDER_ZERO(value) {
	return value === 0
		&& (1 / value) === (1 / this.valueOf());
}


//#region Inspection
/**
 * Returns a boolean asserting whether a value has been added to the dictionary or not.
 * @expose
 * @this {Map}
 * @param {?} value
 * @return {!boolean}
 */
Map_prototype.hasValue = function(value) {
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
 * @this {Map}
 * @param {!function(?,?,Map):boolean} predicate
 * @param {!Object=} context
 * @throws {TypeError} predicate is not a Function
 * @return {!boolean}
 */
Map_prototype.some = function(predicate, context) {
	if (!OBJECT_IS_FUNCTION(predicate)) {
		throw new TypeError("predicate is not a Function");
	}
	if (arguments.length < 2) context = this;
	var has = false;
	this.forEach(function(value, key) {
		if (!has) has = predicate.call(context, value, key, this);
	});
	return has;
};
/**
 * Checks each pair in the dictionary and returns true only if all pairs match the predicate.
 * @expose
 * @this {Map}
 * @param {!function(?,?,Map):boolean} predicate
 * @param {!Object=} context
 * @throws {TypeError} predicate is not a Function
 * @return {!boolean}
 */
Map_prototype.every = function(predicate, context) {
	if (!OBJECT_IS_FUNCTION(predicate)) {
		throw new TypeError("predicate is not a Function");
	}
	if (arguments.length < 2) context = this;
	var all = true;
	this.forEach(function(value, key) {
		if (all) all = predicate.call(context, value, key, this);
	});
	return all;
};
//#endregion Inspection

//#region Transform
/**
 * Quickly creates and returns a duplicate of this dictionary.
 * @expose
 * @this {Map}
 */
Map_prototype.copy = function() {
	return new Map(this);
};
/**
 * Builds a new dictionary with only the positive results from the predicate.
 * @expose
 * @this {Map}
 * @param {!function(?,?,Map):boolean} predicate
 * @param {!Object=} context
 * @throws {TypeError} predicate is not a Function
 * @return {!Map}
 */
Map_prototype.filter = function(predicate, context) {
	if (!OBJECT_IS_FUNCTION(predicate)) {
		throw new TypeError("predicate is not a Function");
	}
	if (arguments.length < 2) context = this;
	var results = new Map();
	this.forEach(function(value, key) {
		if (predicate.call(context, value, key, this)) {
			results.set(key, value);
		}
	}, context);
	return results;
};
/**
 * Builds an array out of the results of the predicate.
 * @expose
 * @this {Map}
 * @param {!function(?,?,Map):?} predicate
 * @param {!Object=} context
 * @throws {TypeError} predicate is not a Function
 * @return {!Array.<?>}
 */
Map_prototype.toArray = function(predicate, context) {
	if (!OBJECT_IS_FUNCTION(predicate)) {
		throw new TypeError("predicate is not a Function");
	}
	if (arguments.length < 2) context = this;
	var results = [],
		index = 0;
	this.forEach(function(value, key) {
		results[index++] = predicate.call(context, value, key, this);
	}, context);
	return results;
};
/**
 * Builds a new dictionary out of the results of the predicates.
 * @expose
 * @this {Map}
 * @param {!function(?,?,Map):?} valuePredicate
 * @param {!function(?,?,Map):?=} keyPredicate
 * @param {!Object=} context
 * @throws {TypeError} valuePredicate is not a Function
 * @throws {TypeError} keyPredicate is not a Function
 * @return {!Map}
 */
Map_prototype.map = function(valuePredicate, keyPredicate, context) {
	if (!OBJECT_IS_FUNCTION(valuePredicate)) {
		throw new TypeError("predicate is not a Function");
	}
	if (!OBJECT_IS_FUNCTION(keyPredicate)) {
		if (OBJECT_IS_NOTHING(keyPredicate)) keyPredicate = MAP_KEY;	// not required
		else throw new TypeError("predicate is not a Function");
	}
	if (arguments.length < 3) context = this;
	var results = new Map();
	this.forEach(function(value, key) {
		results.set(
			keyPredicate.call(context, value, key, this),
			valuePredicate.call(context, value, key, this)
		);
	});
	return results;
};
//#endregion Transform
