/// <reference path="..\..\blds\pseudo3.js" />

/**
 * 
 * @this {Processor}
 **/
function Processor_worker() {
	var now = new Date,
		start = now;
	while (now - start < this.per) {
		this.__iterator(this.getNext());
		now = new Date();
	}
	this.__timer = 0;
	this.__start();
}

/**
 * 
 * @constructor
 * @template T
 * @param {function(T)} iterator
 * @param {{per:number,wait:number}} options
 **/
function Processor(iterator, options) {
	if (!options) options = {
		per: 0,
		wait: 0,
	};

	/**
	 *
	 * @type {number}
	 **/
	this.__timer = 0;
	/**
	 * 
	 * @type {function(T)}
	 **/
	this.__iterator = iterator;
	/**
	 * 
	 * @type {Function}
	 **/
	this.__worker = Processor_worker.bind(this);

	/**
	 * 
	 * @type {Array.<T>}
	 **/
	this.queue = [];
	/**
	 * 
	 * @type {number}
	 **/
	this.per = options.per > 0 ? options.per : 50;
	/**
	 * 
	 * @type {number}
	 **/
	this.wait = options.wait > 0 ? options.wait : 0;
	/**
	 * 
	 * @type {boolean}
	 **/
	this.isWorking;

	DEFINE_PROP(this, "isWorking", {
		"enumerable": true,
		"configurable": true,
		"get": function() {
			return this.__timer > 0;
		},
	});
}
/** @expose */
ns.Processor = Processor;
var Processor_proto = Processor[PROTOTYPE];
/**
 * 
 * @this {Processor}
 **/
Processor_proto.dispose = function() {
	this.__timer = CLEAR_INSTANT(this.__timer) || 0;
};
/**
 * 
 * @this {Processor}
 * @template T
 * @param {T} item
 **/
Processor_proto.add = function(item) {
	this.queue.push(item);
	this.__start();
};
/**
 * 
 * @this {Processor}
 * @template T
 * @param {Array.<T>} items
 **/
Processor_proto.addRange = function(items) {
	this.queue = this.queue.concat(items);
	this.__start();
};
/**
 * 
 * @this {Processor}
 **/
Processor_proto.getNext = function() {
	return this.queue.shift();
};
/**
 * 
 * @this {Processor}
 **/
Processor_proto.__start = function() {
	if (!this.__timer && this.queue.length) {
		this.__timer = SET_INSTANT(this.__worker, this.wait);
	}
};
