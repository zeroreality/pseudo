/// <reference path="..\..\blds\pseudo3.js" />
"use strict";

/**
 * Polyfill for creating an Array instance from nearly any kind of enumerable.
 * @expose
 * @param {Object} list	A list of objects.  For example, a NodeList.
 * @return {Array}
 **/
Array.of = Array.of || function(list) {
	return SLICE.call(list);
};

/**
 * Quickly creates and returns a duplicate of this array.
 * You can also use array.slice() for the same effect.
 * @expose
 * @this {Array}
 */
Array_prototype.copy = function() {
	return SLICE.call(this);
};

//#region Sorting
/**
 * This expression will help string sorting algorithms by sorting alphabetically and numerically.
 * @const {RegExp}
 */
var ARRAY_FILTER_NATURAL = /[a-z][a-z0-9]*|[0-9]+/gim;
/**
 * Simple comparable function that helps Array#sort.
 * @param {?} a
 * @param {?} b
 * @returns {number}
 */
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
 */
function ARRAY_NATURAL(a, b) {
	if (!a && !b) return 0;
	else if (!a) return -1;
	else if (!b) return 1;

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
		} else if (!aNaN && bNaN) {
			return -1;
		} else if (aNaN && !bNaN) {
			return 1;
		} else if (!aNaN && !bNaN) {
			if (aNum < bNum) return -1;
			else if (aNum > bNum) return 1;
		}
	}
	return 0;
}
/**
 * Sorts strings as if they were numbers.  Sorts non numbers to the end of the list.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function ARRAY_NUMERIC(a, b) {
	var aNum = FLOAT(a),
		aNaN = IS_NAN(aNum),
		bNum = FLOAT(b),
		bNaN = IS_NAN(bNum);
	return aNum < bNum || !aNaN && bNaN ? -1 : aNum > bNum || aNaN && !bNaN ? 1 : 0;
}
/** @expose **/
Array.natural = ARRAY_NATURAL;
/** @expose **/
Array.numeric = ARRAY_NUMERIC;
/** @expose **/
Array.compare = ARRAY_COMPARE;

/**
 * Sorts this array with the given predicate and returns itself.
 * @expose
 * @this {Array}
 * @param {Function=} predicate
 * @return {!Array} this
 */
Array_prototype.order = function(predicate) {
	if (OBJECT_IS_NOTHING(predicate)) predicate = ARRAY_NATURAL;
	if (typeof predicate !== "function") throw new TypeError(PREDICATE_ERROR);
	this.sort(predicate);
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
	else if (arguments.length < 2) context = this;
	this.forEach(predicate, context);
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
 * Optionally, if skipNested is true, only the top-level arrays are flattened.
 * @expose
 * @this {Array}
 * @param {number=} levels
 * @return {!Array}
 */
Array_prototype.flatten = function(levels) {
	var result = [];
	for (var i = 0, l = this.length; i < l; i++) {
		if (!(levels < 0) && this[i] instanceof Array) result.inject(this[i].flatten(levels - 1));
		else result.push(this[i]);
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
 * @param {*=} context
 * @return {!*}
 */
Array_prototype.find = Array_prototype.find || function(predicate, context) {
	if (typeof predicate !== "function") throw new TypeError(PREDICATE_ERROR);
	else if (arguments.length < 2) context = this;
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
 * @param {*=} context
 * @return {!number}
 */
Array_prototype.findIndex = Array_prototype.findIndex || function(predicate, context) {
	if (typeof predicate !== "function") throw new TypeError(PREDICATE_ERROR);
	else if (arguments.length < 2) context = this;
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
 * @param {*=} context
 * @return {!Array.<number>}
 */
Array_prototype.findIndexes = function(predicate, context) {
	if (typeof predicate !== "function") throw new TypeError(PREDICATE_ERROR);
	else if (arguments.length < 2) context = this;
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
 * 
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
 * 
 * @expose
 * @this {Array}
 * @param {?} object
 * @param {number=} index
 * @return {!Array} this
 */
Array_prototype.insert = function(object, index) {
	this.splice(IS_AN(index) ? index : this.length, 0, object);
	return this;
};
/**
 * 
 * @expose
 * @this {Array}
 * @param {?} object
 * @param {?} before
 * @return {!Array} this
 */
Array_prototype.insertBefore = function(object, before) {
	var index = this.indexOf(before);
	return this.insert(object, index > -1 ? index : this.length);
};
/**
 * 
 * @expose
 * @this {Array}
 * @param {?} object
 * @return {!Array} this
 */
Array_prototype.remove = function(object) {
	var results = [];
	for (var i = 0; i < this.length; i++) {
		if (this[i] === object) {
			results.push(this.splice(i--, 1)[0]);
		}
	}
	return this;	//return results;
};
/**
 * 
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
 * 
 * @expose
 * @this {Array}
 * @param {?} object
 * @param {?} replacement
 * @return {!Array} this
 */
Array_prototype.replace = function(object, replacement) {
	var i = this.length;
	while (i--) if (this[i] === object) this[i] = replacement;
	return this;
};
/**
 * 
 * @expose
 * @this {Array}
 * @param {string} propertyName
 * @param {*=} value
 * @return {!Array}
 */
Array_prototype.plant = function(propertyName, value) {
	for (var i = 0, l = this.length; i < l; i++) {
		this[i][propertyName] = value;
	}
	return this;
};
//#endregion Modification

//#region Inspection
/**
 * Similar to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes|Array#includes}, but instead of taking a second argument as startIndex, it takes N arguments and returns true if any of the objects are present in the array.
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
 * Similar to {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes|Array#includes}, but instead of taking a second argument as startIndex, it takes N arguments and returns true if all the objects are present in the array.
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
 * 
 * @expose
 * @this {Array}
 * @param {?} object
 * @return {!number}
 */
Array_prototype.count = function(object) {
	var count = 0;
	for (var i = 0, l = this.length; i < l; i++) if (this[i] === object) count++;
	return count;
};
/**
 * 
 * @expose
 * @this {Array}
 * @param {Function} predicate
 * @param {*=} context
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
 * 
 * @expose
 * @this {Array}
 * @param {!string} key
 * @return {!Object.<string,Object>}
 */
Array_prototype.groupBy = function(key) {
	return this.group(function(obj) {
		return obj[key];
	});
};
//#endregion Inspection

//#region Transform
/**
 * @param {?} a
 * @param {?} b
 */
function ARRAY_HELPER_IDENTITY(a, b) {
	return a === b;
}
/**
 * 
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
 * 
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
 * Returns an array of unique values
 * @expose
 * @this {Array}
 * @param {function(*, *):boolean=} predicate	Used to identify duplicates.
 * @param {*=} context
 * @return {!Array}
 */
Array_prototype.unique = function(predicate, context) {
	if (!predicate) predicate = ARRAY_HELPER_IDENTITY;
	else if (typeof predicate !== "function") throw new TypeError(PREDICATE_ERROR);
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
 * 
 * @expose
 * @this {Array}
 * @param {!function(?,number,Object):string} keyPredicate
 * @param {function(?,string,number,Object):?=} valuePredicate
 * @param {Object=} dictionary
 * @return {!Array} this
 */
Array_prototype.toDictionary = function(keyPredicate, valuePredicate, dictionary) {
	if (typeof keyPredicate !== "function" || valuePredicate && typeof valuePredicate !== "function") throw new TypeError(PREDICATE_ERROR);
	return this.reduce(function(object, value, index, array) {
		var key = keyPredicate.call(array, value, index, object);
		object[key] = !valuePredicate
			? value
			: valuePredicate.call(array, value, key, index, object);
		return object;
	}, dictionary || {});
};
//#endregion Transform

//#region async-iteration tests
/**
 *
 * @expose
 * @this {Array}
 * @param {function(?,number,Array)} predicate
 * @param {*=} context
 * @return {!Promise}
 */
Array_prototype.asyncForEach = function(predicate, context) {
	if (typeof predicate !== "function") throw new TypeError(PREDICATE_ERROR);
	if (!context) context = this;


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
 *
 * @expose
 * @this {Array}
 * @param {function(?,number,Array)} predicate
 * @param {*=} context
 * @param {number=} delay
 * @return {!Promise}
 */
Array_prototype.deferForEach = function(predicate, context, delay) {
	if (typeof predicate !== "function") throw new TypeError(PREDICATE_ERROR);
	if (!context) context = this;
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
 *
 * @expose
 * @this {Array}
 * @param {function(?,number,Array)} predicate
 * @param {*=} context
 * @return {!Promise}
 */
Array_prototype.animForEach = function(predicate, context) {
	if (typeof predicate !== "function") throw new TypeError(PREDICATE_ERROR);
	if (!context) context = this;
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
