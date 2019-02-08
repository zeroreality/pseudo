/// <reference path="..\..\blds\pseudo3.js" />

var Function_prototype = Function[PROTOTYPE];
/**
 * Defers the execution of a function for 1ms
 * @this {Function}
 * @expose
 * @param {...?} var_args
 * @return {number} Timer identifier for use with window.clearTimeout.
 */
Function_prototype.defer = function(var_args) {
	var method = this;
	var_args = SLICE.call(arguments);
	return SET_TIMER(function() { return method.apply(WIN, var_args) }, 1);
};
/**
 * Returns a Promise using this function as the executor
 * @this {Function}
 * @expose
 * @return {Promise}
 */
Function_prototype.promise = function() {
	return new Promise(this);
};
