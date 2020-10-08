/// <reference path="..\..\blds\pseudo3.js" />

/** @const {Object} */
var Set_prototype = Set[PROTOTYPE];


/**
 *
 * @this {Set}
 * @param {?} value
 */
function SET_ADD(value) {
	this.add(value);
}



/**
 * Creates a new Set as a concatenation of this Set and the given iterables.
 * @expose
 * @this {Set}
 * @param {...?} var_args
 * @return {!Set}
 */
Set_prototype.concat = function(var_args) {
	var result = new Set(this);
	SLICE.call(arguments).forEach(function(iterable) {
		var set = new Set(iterable);
		set.forEach(function(value) {
			result.add(value);
		});
	});
	return result;
};
/**
 * Quickly creates and returns a duplicate of this dictionary.
 * @expose
 * @this {Set}
 */
Set_prototype.copy = function() {
	return new Set(this);
};



/**
 * 
 * @expose
 * @this {Set}
 * @param {!number} index
 * @return {!boolean}
 */
Set_prototype.entryAt = function(index) {
	return this.toArray()[index];
};
/**
 * Checks each value in the Set and returns true only if all values match the predicate.
 * @expose
 * @this {Set}
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


/**
 * Builds a new Set with only the positive results from the predicate.
 * @expose
 * @this {Set}
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
	}, this);
	return results;
};
/**
 * 
 * @expose
 * @this {Set}
 * @param {!function(?,Set):boolean} predicate
 * @param {!Object=} context
 * @throws {TypeError} predicate is not a Function
 * @return {!boolean}
 */
Set_prototype.find = function(predicate, context) {
	if (!OBJECT_IS_FUNCTION(predicate)) {
		throw new TypeError("predicate is not a Function");
	}
	if (arguments.length < 2) context = this;
	var has = false,
		result;
	this.forEach(function(value) {
		if (!has) {
			if (has = predicate.call(context, value, this)) {
				result = value;
			}
		}
	});
	return result;
};





/**
 * 
 * @expose
 * @this {Set}
 * @param {?} value
 * @return {!boolean}
 */
Set_prototype.indexOf = function(value) {
	return this.toArray().indexOf(value);
};




/**
 * 
 * @expose
 * @this {Set}
 * @param {?} separator
 * @return {!boolean}
 */
Set_prototype.join = function(separator) {
	return this.toArray().join(separator);
};




/**
 * 
 * @expose
 * @this {Set}
 * @param {?} value
 * @return {!boolean}
 */
Set_prototype.lastIndexOf = function(value) {
	return this.toArray().lastIndexOf(value);
};




/**
 * 
 * @expose
 * @this {Set}
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
	}, this);
	return results;
};





/**
 * Removes the last item from a set and returns that item.
 * If there is an item to remove, the {@link Set#size} is modified.
 * @expose
 * @this {Set}
 * @return {?}
 */
Set_prototype.pop = function() {
	var entry;
	if (this.size > 0) {
		entry = this.entryAt(this.size - 1);
		this.remove(entry);
	}
	return entry;
};






/**
 * 
 * @expose
 * @this {Set}
 * @param {!function(?,?,number,Set):?} predicate
 * @param {?=} initialValue
 * @return {?}
 */
Set_prototype.reduce = function(predicate, initialValue) {
	var me = this,
		skip = arguments.length < 2,
		index = 0,
		result = initialValue;
	me.forEach(function(value) {
		result = skip && !index
			? value
			: predicate(result, value, index, me);
		index++;
	});
	return result;
};
/**
 * 
 * @expose
 * @this {Set}
 * @param {!function(?,?,number,Set):boolean} predicate
 * @param {?=} initialValue
 * @return {?}
 */
Set_prototype.reduceRight = function(predicate, initialValue) {
	var me = this,
		skip = arguments.length < 2,
		index = 0,
		result = initialValue;
	this.toArray().reverse().forEach(function(value) {
		result = skip && !index
			? value
			: predicate(result, value, index, me);
		index++;
	});
	return result;
};
/**
 * 
 * @expose
 * @this {Set}
 * @return {Set} this
 */
Set_prototype.reverse = function() {
	var entries = this.toArray().reverse();
	this.clear();
	entries.forEach(SET_ADD, this);
	return this;
};




/**
 * 
 * @expose
 * @this {Set}
 * @return {?}
 */
Set_prototype.shift = function() {
	var entry;
	if (this.size > 0) {
		entry = this.entryAt(0);
		this.remove(entry);
	}
	return entry;
};
/**
 * 
 * @expose
 * @this {Set}
 * @param {number=} begin
 * @param {number=} end
 * @return {Set}
 */
Set_prototype.slice = function(begin, end) {
	if (IS_NAN(begin)) begin = 0;
	if (IS_NAN(end)) end = 0;
	var index = 0,
		results = new Set;
	this.forEach(function(value) {
		if (index >= begin && index < end) {
			results.add(value);
		}
		index++;
	});
	return results;
};



/**
 * 
 * @expose
 * @this {Set}
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
 * 
 * @expose
 * @this {Set}
 * @param {function(?,?):number=} compareFunction
 */
Set_prototype.sort = function(compareFunction) {
	if (arguments.length > 0 && !OBJECT_IS_FUNCTION(compareFunction)) {
		throw new TypeError("compareFunction is not a Function");
	}
	var entries = this.toArray();
	entries.sort(compareFunction);
	this.clear();
	entries.forEach(SET_ADD, this);
};
/**
 * 
 * @expose
 * @this {Set}
 * @param {!number} start
 * @param {number=} deleteCount
 * @param {...?} var_args
 */
Set_prototype.splice = function(start, deleteCount, var_args) {
	var entries = this.toArray(),
		removed = entries.splice.apply(entries, [start, deleteCount].concat(SLICE.call(arguments, 2)));
	this.clear();
	entries.forEach(SET_ADD, this);
	return removed;
};








/**
 * Builds an array out of the results of the predicate.
 * @expose
 * @this {Set}
 * @param {!function(?,Set):?} predicate
 * @param {!Object=} context
 * @throws {TypeError} predicate is not a Function
 * @return {!Array.<?>}
 */
Set_prototype.toArray = function(predicate, context) {
	if (OBJECT_IS_NOTHING(predicate)) {
		predicate = ITERATOR_VALUE;
	} else if (!OBJECT_IS_FUNCTION(predicate)) {
		throw new TypeError("predicate is not a Function");
	}
	if (arguments.length < 2) context = this;
	var results = [],
		index = 0;
	this.forEach(function(value) {
		results[index++] = predicate.call(context, value, this);
	}, this);
	return results;
};

/**
 * 
 * @expose
 * @this {Set}
 * @param {...?} var_args
 * @return {!number}
 */
Set_prototype.unshift = function(var_args) {
	var entries = this.toArray();
	this.clear();
	SLICE.call(arguments).concat(entries).forEach(SET_ADD, this);
	return this.size;
};

/**
 * Similar to {@link Array#inject}, will add the items of the given list to itself, then return itself.
 * @expose
 * @this {Set}
 * @param {Set|Array} list
 * @return {!Set}
 */
Set_prototype.inject = function(list) {
	list.forEach(SET_ADD, this);
	return this;
};
