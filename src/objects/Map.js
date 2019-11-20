/// <reference path="..\..\blds\pseudo3.js" />

/** @const {Object} */
var Map_prototype = Map[PROTOTYPE];

//#region Inspection
/**
 * Gets an Array of keys within this dictionary.
 * @expose
 * @this {Map}
 * @return {!Array}
 */
Map_prototype.allKeys = function() {
	var results = [];
	this.forEach(function(value, key, map) {
		results.push(key);
	});
	return results;
};
/**
 * Gets the Array of values from this dictionary.
 * @expose
 * @this {Map}
 * @return {!Array}
 */
Map_prototype.allValues = function() {
	var results = [];
	this.forEach(function(value, key, map) {
		results.push(value);
	});
	return results;
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
/**
 * 
 * @expose
 * @this {Map}
 * @param {!function(?,?,Map):boolean} predicate
 * @param {!Object=} context
 * @throws {TypeError} predicate is not a Function
 * @return {!boolean}
 */
Map_prototype.find = function(predicate, context) {
	if (!OBJECT_IS_FUNCTION(predicate)) {
		throw new TypeError("predicate is not a Function");
	}
	if (arguments.length < 2) context = this;
	var found = false,
		result;
	this.forEach(function(value, key) {
		if (!found) {
			if (found = predicate.call(context, value, key, this)) {
				result = [key, value];
			}
		}
	});
	return result;
};
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
//#endregion Inspection

//#region Modification
/**
 * 
 * @expose
 * @this {Map}
 * @param {Map|Set|Array.<Array>=} iterable
 */
Map_prototype.concat = function(iterable) {
	var me = this,
		other = new Map(iterable);
	me.forEach(function(value, key) {
		other.set(key, value);
	});
	return other;
};
/**
 * 
 * @expose
 * @this {Map}
 * @param {Map|Set|Array.<Array>=} iterable
 */
Map_prototype.inject = function(iterable) {
	var me = this,
		other = new Map(iterable);
	other.forEach(function(value, key) {
		me.set(key, value);
	});
	return me;
};
/**
 * Either adds the given key/value, or replaces the value for the given key.
 * The setValue is invoked only for add operations, and the updateValue is invoked only for replace operations.
 * The setValue function is invoked with the key, and itself, and returns the value to be set.
 * The updateValue function is invoked with the existing value, a reference to the setValue function, the key, and itself, and returns the value to be set.
 * The method itself returns undefined.
 * @expose
 * @this {Map}
 * @param {?} key
 * @param {function(?,Map):?} setValue
 * @param {function(?,Function,?,Map):?} updateValue
 * @param {!Object=} context
 */
Map_prototype.setOrReplace = function(key, setValue, updateValue, context) {
	if (!OBJECT_IS_FUNCTION(setValue)) throw new TypeError("setValue is not a Function");
	if (!OBJECT_IS_FUNCTION(updateValue)) throw new TypeError("updateValue is not a Function");
	this.set(
		key,
		!this.has(key)
			? setValue.call(context, key, this)
			: updateValue.call(context, this.get(key), setValue, key, this)
	);
};
/**
 * Either adds the given key/value, or replaces the value for the given key.
 * The updateValue is invoked only for replace operations.
 * The updateValue function is invoked with the existing value, the replacement value, the key, and itself, and returns the value to be set.
 * The method itself returns undefined.
 * @expose
 * @this {Map}
 * @param {?} key
 * @param {?} value
 * @param {function(?,?,?,Map):?} updateValue
 * @param {!Object=} context
 */
Map_prototype.addOrReplace = function(key, value, updateValue, context) {
	if (!OBJECT_IS_FUNCTION(updateValue)) throw new TypeError("updateValue is not a Function");
	this.set(
		key,
		!this.has(key)
			? value
			: updateValue.call(context, this.get(key), value, key, this)
	);
};
//#endregion Modification

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
 * Creates a primitive version of the dictionary and its values.
 * @expose
 * @this {Map}
 * @return {!Object}
 */
Map_prototype.toJSON = function() {
	var object = {};
	this.forEach(function(value, key) {
		var type = PSEUDO_KLASS_NAME(value);
		if (type !== "undefined") {
			object[String(key)] = value && OBJECT_IS_FUNCTION(value.toJSON)
				? value.toJSON()
				: type !== "Number" || IS_AN(value)	// NaN becomes null
					? value
					: null;
		}
	});
	return object;
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
		if (OBJECT_IS_NOTHING(keyPredicate)) keyPredicate = ITERATOR_KEY;	// not required
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
