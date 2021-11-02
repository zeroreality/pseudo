/// <reference path="..\..\blds\pseudo3.js" />

/** @const {Promise} */
var PLEASE = Promise;
/** @const {Object} */
var Promise_prototype = PLEASE[PROTOTYPE];
/**
 * 
 * @enum {string}
 **/
var PROMISE_STATUS = {
	"pending": "pending",
	"fulfilled": "fulfilled",
	"rejected": "rejected",
};

/**
 * Returns a fulfilled promise with the given value.
 * @param {?} value
 * @return {Promise}
 **/
function PROMISE_RESOLVE_RETURNED(value) {
	return PLEASE.resolve(value);
};
/**
 * Returns a rejected promise with the given value.
 * @param {?} value
 * @return {Promise}
 **/
function PROMISE_REJECT_RETURNED(value) {
	return PLEASE.reject(value);
};

/**
 * Returns a promise that resolves after all of the given promises have either fulfilled or rejected,
 * with an array of objects that each describes the outcome of each promise.
 * @expose
 * @param {Array.<Promise>} promises
 * @returns {Promise}
 * @see {@link https://medium.com/trabe/using-promise-allsettled-now-e1767d43e480}
 **/
PLEASE.allSettled = PLEASE.allSettled
				|| function allSettled(promises) {
					return PLEASE.all(
						promises.map(function(promise) {
							return promise.then(function(value) {
								return {
									"status": PROMISE_STATUS.fulfilled,
									"value": value,
								};
							}).catch(function(reason) {
								return {
									"status": PROMISE_STATUS.rejected,
									"reason": reason,
								};
							})
						})
					);
				};

/**
 * 
 * @expose
 * @param {Array.<Promise>} promises
 * @returns {Promise}
 * @see {@link https://stackoverflow.com/questions/37234191/how-do-you-implement-a-racetosuccess-helper-given-a-list-of-promises/37235274#37235274}
 **/
PLEASE.any = PLEASE.any
	|| function any(promises) {
		return PLEASE.all(
			promises.map(function(promise) {
				return promise.then(
					// If a request fails, count that as a resolution so it will keep waiting for other possible successes.
					PROMISE_REJECT_RETURNED,
					// If a request succeeds, treat it as a rejection so Promise.all immediately bails out.
					PROMISE_RESOLVE_RETURNED
				);
			})
		).then(
			// If '.all' fulfilled, we've just got an array of errors.
			PROMISE_REJECT_RETURNED,
			// If '.all' rejected, we've got the result we wanted.
			PROMISE_RESOLVE_RETURNED
		);
	};

/**
 * 
 * @expose
 * @this {Promise}
 * @param {function(?):Promise} callback
 * @returns {Promise}
 * @see {pseudo3.Promise.STATUS} For possible values
 **/
Promise_prototype.settled = function(callback) {
	return this.then(callback, callback);
};

/**
 * Returns a {@link Promise} that will execute immediately and return the status of this Promise.
 * @expose
 * @this {Promise}
 * @param {function(PROMISE_STATUS):Promise} callback
 * @returns {Promise}
 * @see {pseudo3.Promise.STATUS} For possible values
 **/
Promise_prototype.checkStatus = function(callback) {
	var promise = this,
		unique = {},
		fulfilled = PROMISE_RESOLVE_RETURNED(unique);
	return PLEASE.race([
		promise,
		fulfilled,
	]).then(
		function(value) { return callback(value === unique ? PROMISE_STATUS.pending : PROMISE_STATUS.fulfilled); },
		function(reason) { return callback(PROMISE_STATUS.rejected); }
	);
};

/** 
 * 
 * @namespace
 * @expose
 **/
ns.Promise = {
	/**
	 * 
	 **/
	"STATUS": PROMISE_STATUS,
};
