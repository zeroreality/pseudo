/* ---------------------------------------------------------------------------
 *	Pseudo JavaScript framework, v2.0 (c) 2012 Alex Lein
 *	Pseudo is freely distributable under the terms of an MIT-style license.
 *	For source code and licence, see http://code.google.com/p/pseudo/
 *----------------------------------------------------------------------------
 *	Useful gadgets for client-side programming; AsyncLoop, Hashmap,
 *	IntervalLoop, and more...
 *--------------------------------------------------------------------------*/
"use strict";
(function(){
	
	
	
	return this.Gadgets = {
	};
}).call(Pseudo);

/***********************
*** AsyncLoop **********
***********************/
Pseudo.Gadgets.AsyncLoop = Class.create(null,null,{
	"constructor": function(collection,iterator,options,callbacks) {
		this.collection = collection;
		this.iterator = iterator;
		this.index = 0;
		
		options = Pseudo.expand(options||{},this.constructor.defaults);
		this.__repeater = this.constructor.repeater.bind(this);
		this.__working = false;
		this.__breaks = 0;
		this.interval = parseFloat(options.interval);
		this.threshold = parseFloat(options.threshold);
		
		for (var each in callbacks) this.on(each,callbacks[each]);
	},
	"dispose": function($super) {
		this.stop();
		this.collection = null;
		return $super();
	},
	"start": function() {
		this.__breaks = 0;
		this.index = 0;
		this.started = new Date().valueOf();
		this.fire("started");
		this.resume();
	},
	"pause": function() {
		this.__working = false;
	},
	"resume": function() {
		if (this.index < 0) this.index = 0;
	//	this.last = new Date();
		this.__working = true;
		this.next();
	},
	"next": function() {
		this.__timer = setTimeout(this.__repeater,this.interval);
	},
	"stop": function() {
		this.__working = false;
		clearTimeout(this.__timer);
		this.fire("stopped");
	}
},{
	"detaults": {
		"interval": 10,
		"threshold": 500
	},
	"repeater": function() {
		if (!this.__working) return;
		else this.__breaks++;
		
		while (this.index < this.collection.length) {
			if (this.last - this.started > this.threshold) return this.next();
			this.iterator.call(this,
				this.collection[this.index],		// each
				this.index,					// index
				this,						// instance
				new Date().valueOf() - this.last	// duration between calls
			);
			this.index++;
			this.last = new Date().valueOf();
		};
		
		this.__working = false;
		this.fire("finished",{
			"breaks": this.__breaks,
			"duration": new Date().valueOf() - this.started
		});
	}
});

/***********************
*** Hashmap ************
***********************/
Pseudo.Gadgets.Hashmap = Class.create(null,null,{
	"constructor": function(keys,values) {
		this.__keys = [];
		this.__values = [];
		if (Array.isArray(keys)) {
			if (!values) values = [];
			for (var i=0,l=keys.length; i<l; i++) {
				this.__keys[i] = keys[i];
				this.__values[i] = values[i];
			};
		} else if (keys) {
			for (var each in keys) {
				this.__keys.push(each);
				this.__values.push(keys[each]);
			};
		};
		this.length = this.__keys.length;
	},
	"get": function(key) {
		var index = this.__keys.indexOf(key);
		if (index > -1) return this.__values[index];
	},
	"set": function(key,value) {
		var old, index = this.__keys.indexOf(key);
		if (index > -1) {
			var old = this.__values[index];
			this.__values[index] = value;
		} else {
			index = this.__keys.length;
			this.__keys.push(value);
			this.__values.push(value);
		};
		this.length = this.__keys.length;
		this.fire("added",{ "key": key, "value": value, "index": index, "previousValue": old });
		return index;
	},
	"remove": function(key) {
		var value, index = this.__keys.indexOf(key);
		if (index > -1) {
			value = this.__values[index];
			this.__keys.removeAt(index);
			this.__values.removeAt(index);
			this.fire("removed",{ "key": key, "value": value, "index": index });
		};
		this.length = this.__keys.length;
		return value;
	},
	"findKey": function(value) {
		var index = this.__values.indexOf(value);
		if (index > -1) return this.__keys[index];
	}
});

/***********************
*** IntervalLoop *******
***********************/
Pseudo.Gadgets.IntervalLoop = Class.create(Pseudo.Gadgets.AsyncLoop,null,{
	"next": function() {
		this.__timer = setInterval(this.__repeater,this.interval);
	},
	"stop": function() {
		this.__working = false;
		clearInterval(this.__timer);
		this.fire("stopped");
	}
},{
	"detaults": {
		"interval": 10,
		"threshold": 0
	},
	"repeater": function() {
		if (!this.__working) return;
		else this.__breaks++;
		
		if (this.index < this.collection.length) {
			this.iterator.call(this,
				this.collection[this.index],		// each
				this.index,					// index
				this,						// instance
				new Date().valueOf() - this.last	// duration between calls
			);
			this.index++;
			this.last = new Date().valueOf();
		};
		if (this.index >= this.collection.length) {
			this.__working = false;
			clearInterval(this.__timer);
			this.fire("finished",{
				"breaks": this.__breaks,
				"duration": new Date().valueOf() - this.started
			});
		};
	}
});

/***********************
*** Globals ************
***********************/
var	AsyncLoop = Pseudo.Gadgets.AsyncLoop,
	Hashmap = Pseudo.Gadgets.Hashmap,
	IntervalLoop = Pseudo.Gadgets.IntervalLoop;