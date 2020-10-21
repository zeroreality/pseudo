/// <reference path="..\..\blds\pseudo3.js" />

// polyfill
if (!Array.of) {
	/**
	 * Polyfill for creating an Array instance from nearly any kind of enumerable.
	 * @expose
	 * @param {...T} var_args	A list of objects.  For example, a NodeList.
	 * @return {!Array.<T>}
	 **/
	Array.of = function(var_args) {
		return SLICE.call(arguments);
	};
}

/**
 * Returns an array of numbers.
 * @expose
 * @param {!number} length	The number of numbers to include
 * @param {number=} start	Optional starting number.
 * @return {!Array.<number>}
 **/
Array.range = function(length, start) {
	var array = [];
	for (var i = (start || 0); i <= length; i++) array.push(i);
	return array;
}

/**
 * Quickly creates and returns a duplicate of this array.
 * You can also use array.slice() for the same effect.
 * @expose
 * @this {Array}
 */
Array_prototype.copy = function() {
	return this.slice();
};

//#region Sorting
/**
 * This expression will help string sorting algorithms by sorting alphabetically and numerically.
 * @const {RegExp}
 */
var ARRAY_FILTER_NATURAL = /[a-z][a-z\d]*|[\d]+/gim;
/**
 * Simple comparable function that helps {@link Array#sort}.
 * @param {?} a
 * @param {?} b
 * @returns {number}
 **/
function ARRAY_COMPARE(a, b) {
	return a < b
		? -1
		: a > b
			? 1
			: 0;
}
/**
 * Uses "natural" sorting by trying to sort by words alphabetically and numbers numerically.
 * @param {string} a
 * @param {string} b
 * @returns {number}
 **/
function ARRAY_NATURAL(a, b) {
	var aNothing = OBJECT_IS_NOTHING(a),
		bNothing = OBJECT_IS_NOTHING(b);
	if (aNothing && bNothing) return 0;
	else if (aNothing) return -1;
	else if (bNothing) return 1;

	var first = a.toString().match(ARRAY_FILTER_NATURAL),
		second = b.toString().match(ARRAY_FILTER_NATURAL);
	if (!first && !second) return ARRAY_COMPARE(a, b);
	else if (!first) return -1;
	else if (!second) return 1;

	for (var i = 0, l = MAX(first.length, second.length); i < l; i++) {
		var aValue = (first[i] || "").toUpperCase(),
			bValue = (second[i] || "").toUpperCase();
		if (!aValue) return -1;
		else if (!bValue) return 1;
		var aNum = INT(aValue, 10),
			bNum = INT(bValue, 10),
			aNaN = IS_NAN(aNum),
			bNaN = IS_NAN(bNum);
		if (aNaN && bNaN) {
			if (aValue < bValue) return -1;
			else if (aValue > bValue) return 1;
		} else if (!aNaN && !bNaN) {
			if (aNum < bNum) return -1;
			else if (aNum > bNum) return 1;
		} else {
			if (!aNaN) return -1;
			else if (!bNaN) return 1;
		}
	}
	return 0;
}
/**
 * Sorts strings as if they were numbers.  Sorts non-numbers to the end of the list.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 **/
function ARRAY_NUMERIC(a, b) {
	var aNum = FLOAT(a),
		aNaN = IS_NAN(aNum),
		bNum = FLOAT(b),
		bNaN = IS_NAN(bNum);
	return aNum < bNum || !aNaN && bNaN ? -1 : aNum > bNum || aNaN && !bNaN ? 1 : 0;
}
/**
 * Uses pre-computed Arrays containing strings and numbers to sort.
 * Very similar to "natural" sorting, but faster for repeated comparisons due to pre-computed values.
 * @param {Array} a
 * @param {Array} b
 * @returns {number}
 **/
function ARRAY_SUPER_NATURAL(a, b) {
	for (var i = 0, l = MAX(a.length, b.length); i < l; i++) {
		var aValue = a[i],
			bValue = b[i],
			aNaN = IS_NAN(aValue),
			bNaN = IS_NAN(bValue);
		if (aValue === undefined) {
			// this is the case if a has fewer values in the sort array
			return -1;
		} else if (bValue === undefined) {
			// this is the case if a has more values in the sort array
			return 1;
		} else if (aNaN === bNaN) {
			// compare as if both are strings or numbers
			if (aValue < bValue) return -1;
			else if (aValue > bValue) return 1;
		} else {
			// number is higher
			return aNaN ? 1 : -1;	// same as "aNaN ? 1 : bNaN ? -1 : 0" since aNaN !== bNaN
		}
	}
	// same same
	return 0;
}
/**
 * Converts the input into an Array of strings and numbers so it can be sorted using the "super natural" algorithm.
 * @param {?} input
 * @returns {Array}
 **/
function ARRAY_SUPER_NATURAL_SPLIT(input) {
	if (OBJECT_IS_NOTHING(input)) return [];

	var string = input.toString().split("");
	for (var i = 0, l = string.length; i < l; i++) {
		var char = DIACRITICS[string[i]]
		if (char) string[i] = char;
	}
	var parts = string.join("")
					.toLowerCase()
					.match(ARRAY_FILTER_NATURAL) || [];
	for (var i = 0, l = parts.length; i < l; i++) {
		var number = FLOAT(parts[i]);
		if (!IS_NAN(number)) parts[i] = number;
	}
	return parts;
}

/**
 * Sorts this array with the given predicate and returns itself.
 * @expose
 * @this {Array}
 * @param {Function=} predicate
 * @param {?=} context
 * @return {!Array} this
 */
Array_prototype.order = function(predicate, context) {
	if (OBJECT_IS_NOTHING(predicate)) predicate = ARRAY_NATURAL;
	if (typeof predicate !== "function") throw new TypeError(PREDICATE_ERROR);
	this.sort(
		predicate.bind(
			arguments.length < 2
				? this
				: context
		)
	);
	return this;
};
/**
 * Sorts this array using "natural" sorting based on the given key names.
 * This prototype expects the array to be filled with non-nullable objects, and that the key names passed exist on each object.
 * @expose
 * @this {Array}
 * @param {...string} var_args
 * @return {!Array} this
 */
Array_prototype.orderBy = function(var_args) {
	var_args = SLICE.call(arguments);
	this.sort(function(a, b) {
		var result = 0;
		for (var i = 0, key = var_args[i]; key = var_args[i]; i++) {
			if (result = ARRAY_NATURAL(a[key], b[key])) break;
		}
		return result;
	});
	return this;
};
/**
 * Sorts this array with the given predicates.
 * If the predicate returns zero, then the next predicate is called until no more predicates are available or a non-zero value is returned.
 * @expose
 * @this {Array}
 * @param {...function(?,?):number} var_args
 * @return {!Array} this
 */
Array_prototype.orderWith = function(var_args) {
	var_args = SLICE.call(arguments);
	if (var_args.map(function(predicate) {
		if (typeof predicate !== "function") throw new TypeError(PREDICATE_ERROR);
	}).length < 1) throw new TypeError("must provide at least one predicate");
	this.sort(function(a, b) {
		var result = 0;
		for (var i = 0, func = var_args[i]; func = var_args[i]; i++) {
			if (result = func(a, b)) break;
		}
		return result;
	});
	return this;
};
//#endregion Sorting

//#region Minimum/Maximum/Sum
/**
 * Helper used to pick the greater of two given values.
 * 
 * @param {?} a
 * @param {?} b
 */
function ARRAY_HELPER_MAX(a, b) {
	return b > a ? b : a;
}
/**
 * Helper used to pick the lesser of two given values.
 * 
 * @param {?} a
 * @param {?} b
 */
function ARRAY_HELPER_MIN(a, b) {
	return b < a ? b : a;
}
/**
 * Adds the two values together and returns the result.
 * @param {?} a
 * @param {?} b
 */
function ARRAY_HELPER_SUM(a, b) {
	return a + b;
}

/**
 * Finds the greatest value in this array.
 * Uses an optional predicate to help find the maximum value.
 * If an initialValue is not given, zero is used by default.
 * Internally uses {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce|Array#reduce}.
 * @expose
 * @this {Array}
 * @param {Function=} predicate
 * @param {?=} initialValue
 * @return {?}
 */
Array_prototype.max = function(predicate, initialValue) {
	if (OBJECT_IS_NOTHING(predicate)) predicate = ARRAY_HELPER_MAX;
	else if (typeof predicate !== "function") throw new TypeError(PREDICATE_ERROR);
	return this.reduce(predicate, OBJECT_IS_NOTHING(initialValue) ? 0 : initialValue);
};
/**
 * Finds the lessest value in this array.
 * Uses an optional predicate to help find the minimum value.
 * If an initialValue is not given, zero is used by default.
 * Internally uses {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce|Array#reduce}.
 * @expose
 * @this {Array}
 * @param {Function=} predicate
 * @param {?=} initialValue
 * @return {?}
 */
Array_prototype.min = function(predicate, initialValue) {
	if (OBJECT_IS_NOTHING(predicate)) predicate = ARRAY_HELPER_MIN;
	else if (typeof predicate !== "function") throw new TypeError(PREDICATE_ERROR);
	return this.reduce(predicate, OBJECT_IS_NOTHING(initialValue) ? 0 : initialValue);
};
/**
 * Adds all the values in this array together.
 * If an initialValue is not given, zero is used by default.
 * Internally uses {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce|Array#reduce}.
 * @expose
 * @this {Array}
 * @param {Function=} predicate
 * @param {?=} initialValue
 * @return {?}
 */
Array_prototype.sum = function(predicate, initialValue) {
	if (OBJECT_IS_NOTHING(predicate)) predicate = ARRAY_HELPER_SUM;
	else if (typeof predicate !== "function") throw new TypeError(PREDICATE_ERROR);
	return this.reduce(predicate, OBJECT_IS_NOTHING(initialValue) ? 0 : initialValue);
};
//#endregion Minimum/Maximum/Sum

//#region Iterating
/**
 * Similar to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach|Array#forEach}, but returns itself.
 * @expose
 * @this {Array}
 * @param {Function} predicate
 * @param {?=} context
 * @return {!Array} this
 */
Array_prototype.each = function(predicate, context) {
	if (typeof predicate !== "function") throw new TypeError(PREDICATE_ERROR);
	this.forEach(
		predicate,
		arguments.length < 2
			? this
			: context
	);
	return this;
};
/**
 * Iterates through all this array's items and returns the value of the objects' given key.
 * This prototype expects the array to be filled with non-nullable objects, and that the key names passed exist on each object.
 * @expose
 * @this {Array}
 * @param {!string} key
 * @return {!Array}
 */
Array_prototype.gather = function(key) {
	var result = [];
	for (var i = 0, l = this.length; i < l; i++) {
		result[i] = this[i][key];
	}
	return result;
};
/**
 * Iterates through all this array's items and returns the result of executing the objects' function with the given key.
 * This prototype expects the array to be filled with non-nullable objects, and that the keys passed are functions on each object.
 * @expose
 * @this {Array}
 * @param {!string} methodName
 * @param {...?} var_args
 * @return {!Array}
 */
Array_prototype.invoke = function(methodName, var_args) {
	var results = [], args = SLICE.call(arguments, 1);
	for (var i = 0, l = this.length; i < l; i++) {
		results[i] = this[i][methodName].apply(this[i], args);
	}
	return results;
};
/**
 * Iterates through all this array's arrays and injects the values of the contained arrays into a single flat-result.
 * Optionally specify the deepest level to flatten.
 * @expose
 * @this {Array}
 * @param {number=} levels
 * @return {!Array}
 */
Array_prototype.flatten = function(levels) {
	var result = [];
	for (var i = 0, l = this.length; i < l; i++) {
		if (!(levels < 1) && this[i] instanceof Array) {
			result.inject(this[i].flatten(levels - 1));
		} else {
			result.push(this[i]);
		}
	}
	return result;
};
//#endregion Iterating

//#region Searching
/**
 * Iterates through this array and returns the first item where the given predicate returns true.
 * @expose
 * @this {Array}
 * @param {Function} predicate
 * @param {?=} context
 * @return {!*}
 */
Array_prototype.find = Array_prototype.find || function(predicate, context) {
	if (typeof predicate !== "function") throw new TypeError(PREDICATE_ERROR);
	if (arguments.length < 2) context = this;
	for (var i = 0, l = this.length; i < l; i++) {
		if (predicate.call(context, this[i], i, this)) {
			return this[i];
		}
	}
};
/**
 * Iterates through this array and returns the index of the first item where the given predicate returns true.
 * @expose
 * @this {Array}
 * @param {Function} predicate
 * @param {?=} context
 * @return {!number}
 */
Array_prototype.findIndex = Array_prototype.findIndex || function(predicate, context) {
	if (typeof predicate !== "function") throw new TypeError(PREDICATE_ERROR);
	if (arguments.length < 2) context = this;
	for (var i = 0, l = this.length; i < l; i++) {
		if (predicate.call(context, this[i], i, this)) {
			return i;
		}
	}
	return -1;
};
/**
 * Iterates through this array and returns all the indexes of the items where the given predicate returns true.
 * @expose
 * @this {Array}
 * @param {Function} predicate
 * @param {?=} context
 * @return {!Array.<number>}
 */
Array_prototype.findIndexes = function(predicate, context) {
	if (typeof predicate !== "function") throw new TypeError(PREDICATE_ERROR);
	if (arguments.length < 2) context = this;
	var result = [];
	for (var i = 0, l = this.length; i < l; i++) {
		if (predicate.call(context, this[i], i, this)) {
			result.push(i);
		}
	}
	return result;
};
/**
 * Returns the last item in this array.
 * Same as array[array.length - 1], but can be chained.
 * @expose
 * @this {Array}
 * @return {?}
 */
Array_prototype.last = function() {
	return this[this.length - 1];
};
//#endregion Searching

//#region Modification
/**
 * Similar to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat|Array#concat}, but instead of creating a new array, will add the items of the given array to itself, then return itself.
 * @expose
 * @this {Array}
 * @param {Array} array
 * @return {!Array}
 */
Array_prototype.inject = function(array) {
	for (var i = 0, c = this.length, l = array.length; i < l; i++) {
		this[c++] = array[i];
	}
	return this;
};
/**
 * Internally uses {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice|Array#splice} to insert an item into this array at the given index.
 * If the index is not specified, then the item is added at the end.
 * @expose
 * @this {Array}
 * @param {?} item
 * @param {number=} index
 * @return {!Array} this
 */
Array_prototype.insert = function(item, index) {
	this.splice(IS_AN(index) ? index : this.length, 0, item);
	return this;
};
/**
 * Similar to {@link Array#insert}, the given item is inserted into the array before the first reference of the before item.
 * If the before item is not found, then the given item is added at the end of the array.
 * @expose
 * @this {Array}
 * @param {?} item
 * @param {?} before
 * @return {!Array} this
 */
Array_prototype.insertBefore = function(item, before) {
	var index = this.indexOf(before);
	return this.insert(item, index > -1 ? index : this.length);
};
/**
 * Removes all instances of the given item from this array.
 * Returns itself.
 * @expose
 * @this {Array}
 * @param {...*} var_args
 * @return {!Array} this
 */
Array_prototype.remove = function(var_args) {
	var args = SLICE.call(arguments);
	for (var i = 0; i < this.length; i++) {
		if (args.includes(this[i])) {
			this.splice(i--, 1);
		}
	}
	return this;	//return results;
};
/**
 * Shorthand for {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice|Array#splice}, but only used for removing an item at the given index.
 * Optionally you can specify a number of elements to remove at the index, but the default is one.
 * @expose
 * @this {Array}
 * @param {number} index
 * @param {number=} number
 * @return {!Array}
 */
Array_prototype.removeAt = function(index, number) {
	if (IS_NAN(number)) number = 1;
	return this.splice(index, number);
};
/**
 * Replaces all instances of the given item with the replacement item.
 * @expose
 * @this {Array}
 * @param {?} item
 * @param {?} replacement
 * @return {!Array} this
 */
Array_prototype.replace = function(item, replacement) {
	var i = this.length;
	while (i--) if (this[i] === item) this[i] = replacement;
	return this;
};
/**
 * Iterates through this array's items and adds the given value to each item using the given property name.
 * @expose
 * @this {Array}
 * @param {string} propertyName
 * @param {?=} value
 * @return {!Array}
 */
Array_prototype.plant = function(propertyName, value) {
	for (var i = 0, l = this.length; i < l; i++) {
		this[i][propertyName] = value;
	}
	return this;
};
/**
 * Similar to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push|Array#push}, will only add the value to the array if it does not already contain it.  Returns the length of the array.
 * @expose
 * @this {Array}
 * @param {?=} value
 * @return {!number}
 */
Array_prototype.shove = function(value) {
	return this.includes(value)
		? this.length
		: this.push(value);
};
//#endregion Modification

//#region Inspection
/**
 * Similar to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes|Array#includes},
 * but instead of taking a second argument as startIndex, it takes N arguments and returns true if any of the objects are present in the array.
 * @expose
 * @this {Array}
 * @param {...*} var_args
 * @return {!boolean}
 */
Array_prototype.hasAny = function(var_args) {
	for (var i = 0, l = arguments.length; i < l; i++) {
		if (this.indexOf(arguments[i]) > -1) return true;
	}
	return false;
};

/**
 * Similar to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes|Array#includes},
 * but instead of taking a second argument as startIndex, it takes N arguments and returns true if all the objects are present in the array.
 * @expose
 * @this {Array}
 * @param {...*} var_args
 * @return {!boolean}
 */
Array_prototype.hasAll = function(var_args) {
	for (var i = 0, l = arguments.length; i < l; i++) {
		if (this.indexOf(arguments[i]) < 0) return false;
	}
	return true;
};
/**
 * Finds and counts all instances of the given item in this array.
 * @expose
 * @this {Array}
 * @param {?} item
 * @return {!number}
 */
Array_prototype.count = function(item) {
	var count = 0;
	for (var i = 0, l = this.length; i < l; i++) if (this[i] === item) count++;
	return count;
};
/**
 * Examines the array using the predicate and returns a count of where the predicate returned true.
 * @expose
 * @this {Array}
 * @param {function(*,number,Array):boolean} predicate
 * @return {!number}
 */
Array_prototype.poll = function(predicate, context) {
	if (typeof predicate !== "function") throw new TypeError(PREDICATE_ERROR);
	if (arguments.length < 2) context = this;
	var count = 0;
	for (var i = 0, l = this.length; i < l; i++) {
		if (predicate.call(context, this[i], i, this)) count++;
	}
	return count;
};
/**
 * Creates an object where the keys are created using the given predicate, and the values are arrays where each item in this array's generated key is the same.
 * @expose
 * @this {Array}
 * @param {function(*,number,Array):string} predicate
 * @param {?=} context
 * @return {!Object.<string,Object>}
 */
Array_prototype.group = function(predicate, context) {
	if (typeof predicate !== "function") throw new TypeError(PREDICATE_ERROR);
	if (arguments.length < 2) context = this;
	var groups = {};
	for (var i = 0, l = this.length; i < l; i++) {
		var obj = this[i],
			key = predicate.call(context, this[i], i, this),
			group = groups[key] || (groups[key] = []);
		group.push(obj);
	}
	return groups;
};
/**
 * Internally uses {@link Array#group} to create a group object using the given property name of each item in this array.
 * @expose
 * @this {Array}
 * @param {!string} propertyName
 * @return {!Object.<string,Object>}
 */
Array_prototype.groupBy = function(propertyName) {
	return this.group(function(obj) {
		return obj[propertyName];
	});
};
//#endregion Inspection

//#region Transform
/**
 * Helper to find identical items in an array during compare operations.
 * @param {?} a
 * @param {?} b
 */
function ARRAY_HELPER_IDENTITY(a, b) {
	return a === b;
}
/**
 * Creates a new Array containing only those items that are contained in both this array, and the given array.
 * @expose
 * @this {Array}
 * @param {!Array} array
 * @return {!Array}
 */
Array_prototype.overlaps = function(array) {
	var results = [];
	for (var i = 0, l = this.length; i < l; i++) {
		for (var j = 0, c = array.length; j < c; j++) {
			if (this[i] === array[j]) {
				results.push(this[i]);
				break;
			}
		}
	}
	return results;
};
/**
 * Creates a new Array containing only those items that are contained in this array, and not contained in the given array.
 * @expose
 * @this {Array}
 * @param {!Array} array
 * @return {!Array}
 */
Array_prototype.without = function(array) {
	var results = [];
	for (var i = 0, l = this.length; i < l; i++) {
		var found = false;
		for (var j = 0, c = array.length; j < c; j++) {
			found = this[i] === array[j];
			if (found) break;
		}
		if (!found) results.push(this[i]);
	}
	return results;
};
/**
 * Returns an array of unique values.
 * @expose
 * @this {Array}
 * @param {function(*, *):boolean=} predicate	Used to identify duplicates.
 * @param {?=} context
 * @return {!Array}
 */
Array_prototype.unique = function(predicate, context) {
	if (!predicate) predicate = ARRAY_HELPER_IDENTITY;
	else if (typeof predicate !== "function") throw new TypeError(PREDICATE_ERROR);
	if (arguments.length < 2) context = this;
	var result = [];
	for (var i = 0, l = this.length; i < l; i++) {
		var found = false;
		for (var j = i + 1; j < l; j++) {
			found = predicate.call(context, this[i], this[j]);
			if (found) break;
		}
		if (!found) result.push(this[i]);
	}
	return result;
};
/**
 * Similar to unique in that it returns an array of unique values, but also sorted as most common within the original array.
 * @expose
 * @this {Array}
 * @return {!Array}
 */
Array_prototype.distinct = function() {
	var result = [],
		counts = [],
		sorted = [];
	for (var i = 0, l = this.length; i < l; i++) {
		var found = false;
		for (var j = 0, c = result.length; j < c; j++) {
			found = this[i] === result[j];
			if (found) {
				counts[j]++;
				break;
			}
		}
		if (!found) {
			result.push(this[i]);
			counts.push(1);
		}
	}
	var max = counts.max();
	while (max) {
		for (var i = 0, l = counts.length; i < l; i++) {
			if (counts[i] === max) sorted.push(result[i]);
		}
		max--;
	}
	return sorted;
};
/**
 * Creates an object using the given predicates to define keys, and (optionally) values.
 * The key creating predicate should return a string; the key is changed to a string internally when used as the key in the result object.
 * The value creating predicate is optional, and when not specified, the array item is added as the value in the Map.
 * @expose
 * @this {Array}
 * @param {!function(?,number,Object):string} keyPredicate
 * @param {function(?,string,number,Object):?=} valuePredicate
 * @param {Object=} dictionary
 * @return {!Object} dictionary
 */
Array_prototype.toDictionary = function(keyPredicate, valuePredicate, dictionary) {
	if (typeof keyPredicate !== "function" || valuePredicate && typeof valuePredicate !== "function") {
		throw new TypeError(PREDICATE_ERROR);
	}
	if (!dictionary) dictionary = {};
	for (var i = 0, l = this.length; i < l; i++) {
		var value = this[i],
			key = String(keyPredicate.call(this, value, i, dictionary));
		dictionary[key] = !valuePredicate
			? value
			: valuePredicate.call(this, value, key, i, dictionary);
	}
	return dictionary;
};
/**
 * Creates a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map|Map} using the given predicates to define keys, and (optionally) values.
 * Both the key and value creating predicate can return any type.
 * The value creating predicate is optional, and when not specified, the array item is added as the value in the Map.
 * @expose
 * @this {Array}
 * @param {!function(?,number,Array):?} keyPredicate
 * @param {function(?,string,?,Array):?=} valuePredicate
 * @param {?=} context
 * @return {!Map}
 **/
Array_prototype.toMap = function(keyPredicate, valuePredicate, context) {
	if (
		!OBJECT_IS_FUNCTION(keyPredicate)
		|| !OBJECT_IS_NOTHING(valuePredicate)
		&& !OBJECT_IS_FUNCTION(valuePredicate)
	) {
		throw new TypeError(PREDICATE_ERROR);
	}
	var map = new Map;
	if (arguments.length < 3) context = map;
	for (var i = 0, l = this.length; i < l; i++) {
		var value = this[i],
			key = keyPredicate.call(context, value, i, this);
		map.set(
			key,
			!valuePredicate
				? value
				: valuePredicate.call(context, value, key, i, this)
		);
	}
	return map;
};
/**
 * Creates a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set|Set} using the given predicate.
 * The predicate is optional, and when not specified, the array item is added as the value in the Set.
 * @expose
 * @this {Array}
 * @param {function(?,number,Object):?=} predicate
 * @param {?=} context
 * @return {!Set}
 **/
Array_prototype.toSet = function(predicate, context) {
	if (
		!OBJECT_IS_NOTHING(predicate)
		&& !OBJECT_IS_FUNCTION(predicate)
	) {
		throw new TypeError(PREDICATE_ERROR);
	}
	if (arguments.length < 2) context = this;
	var set = new Set;
	for (var i = 0, l = this.length; i < l; i++) {
		set.add(
			!predicate
				? this[i]
				: predicate.call(context, this[i], i, this)
		);
	}
	return set;
};
//#endregion Transform

//#region async-iteration tests
/**
 * Experimental!
 * Uses a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise|Promise} to resolve the predicate for each item in this array.
 * I see no point to this method even existing.
 * @expose
 * @this {Array}
 * @param {function(?,number,Array)} predicate
 * @param {?=} context
 * @return {!Promise}
 */
Array_prototype.asyncForEach = function(predicate, context) {
	if (typeof predicate !== "function") throw new TypeError(PREDICATE_ERROR);
	if (arguments.length < 2) context = this;


	/**
	 * 
	 * working
	 *
	function asyncFunc(value, index, array) {
		//	console.log("promise", index);
		return new Promise(function(resolve, reject) {
			predicate.call(context, value, index, array);
			resolve();
			//	console.log("resolved", index);
		});
	}
	return this.reduce(function(promise, value, index, array) {
		return promise.then(function(result) {
			return asyncFunc(value, index, array);
		});
	}, Promise.resolve());
	 */


	return this.reduce(function(promiseChain, value, index, array) {
		return promiseChain.then(function() {
			return new Promise(function(resolve) {
				predicate.call(context, value, index, array);
				resolve(array);
			});
		});
	}, Promise.resolve());
};
/**
 * Experimental!
 * Uses a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise|Promise} and {@link https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/setInterval|setInterval} to resolve the predicate for each item in this array.
 * This can be used to simulate asynchronously processing items in an array.
 * @expose
 * @this {Array}
 * @param {function(?,number,Array)} predicate
 * @param {?=} context
 * @param {number=} delay
 * @return {!Promise}
 */
Array_prototype.deferForEach = function(predicate, context, delay) {
	if (typeof predicate !== "function") throw new TypeError(PREDICATE_ERROR);
	if (arguments.length < 2) context = this;
	if (!delay || delay < 0) delay = 0;
	var timer,
		array = this.slice(),
		length = array.length,
		index = 0;
	return new Promise(function(resolve) {
		timer = SET_EVERY(
			function(scope) {
				if (index < length) {
					predicate.call(scope, array[index], index++, array);
				} else {
					CLEAR_EVERY(timer);
					resolve(array);
				}
			},
			delay,
			context
		);
	});
	/**
	 *
	 * working
	 * 
	 * 
	function asyncFunc(value, index, array) {
		//	console.log("promise", index);
		return new Promise(function(resolve, reject) {
			SET_TIMER(function() {
				predicate.call(context, value, index, array);
				resolve();
				//	console.log("resolved", index);
			}, delay);
		});
	}
	return this.reduce(function(promise, value, index, array) {
		return promise.then(function(result) {
			return asyncFunc(value, index, array);
		});
	}, Promise.resolve());
	 */
	/**
	 *
	 * also working
	 *
	 *
	return this.reduce(function(promiseChain, value, index, array) {
		return promiseChain.then(function() {
			return new Promise(function(resolve) {
				predicate.call(context, value, index, array);
				SET_INSTANT(resolve);
			});
		});
	}, Promise.resolve());
	 */
};
/**
 * Experimental!
 * Uses a {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise|Promise} and {@link https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame|requestAnimationFrame} to resolve the predicate for each item in this array.
 * Similar to {Array#deferForEach}, this can be used to simulate asynchronously processing items in an array.
 * @expose
 * @this {Array}
 * @param {function(?,number,Array)} predicate
 * @param {?=} context
 * @return {!Promise}
 */
Array_prototype.animForEach = function(predicate, context) {
	if (typeof predicate !== "function") throw new TypeError(PREDICATE_ERROR);
	if (arguments.length < 2) context = this;
	var array = this.slice(),
		length = array.length,
		index = 0;
	return new Promise(function(resolve, reject) {
		function animForEach() {
			if (index < length) {
				predicate.call(context, array[index], index++, array);
				WIN.requestAnimationFrame(animForEach);
			} else {
				resolve(array);
			}
		}
		WIN.requestAnimationFrame(animForEach);
	});
};
//#endregion async-iteration tests

/** 
 * Exposing the predicates that are used internally for sorting arrays.
 * @namespace
 * @expose
 **/
ns.Array = {
	/**
	 * A predicate passed to {@link Array#sort}, it uses "natural" sorting by trying to sort by words alphabetically and numbers numerically.
	 **/
	"natural": ARRAY_NATURAL,
	/**
	 * Similar to {@link pseudo3.Array.natural}, but compares pre-computed mixed arrays of numbers/strings.
	 **/
	"superNatural": ARRAY_SUPER_NATURAL,
	/**
	 * The input is converted to a mixed array of numbers/strings to be used in {@link pseudo3.Array.superNatural} sorting.
	 **/
	"superSplit": ARRAY_SUPER_NATURAL_SPLIT,
	/**
	 * A predicate passed to {@link Array#sort}, it sorts strings as if they were numbers.  Sorts non numbers to the end of the list.
	 **/
	"numeric": ARRAY_NUMERIC,
	/**
	 * A predicate passed to {@link Array#sort}, it simply compares values are returns -1, 0 or 1.
	 **/
	"compare": ARRAY_COMPARE,
};
