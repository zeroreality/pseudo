/* ---------------------------------------------------------------------------
 *	Pseudo JavaScript framework, v2.0 (c) 2012 Alex Lein
 *	Pseudo is freely distributable under the terms of an MIT-style license.
 *	For source code and licence, see http://code.google.com/p/pseudo/
 *----------------------------------------------------------------------------
 *	Advanced HTML controls; Calendar, Chooser, Clock, Colour, Draggable,
 *	Orderable, Progress, Slider, Tabs, and more...
 *--------------------------------------------------------------------------*/
"use strict";
(function(){
	
	return this.Controls = {
	};
}).call(Pseudo);

/***********************
*** Calendar ***********
***********************/
Pseudo.Controls.Calendar = Pseudo.Class(null,null,{
	"constructor": function(initial,options) {
		options = Pseudo.expand(options||{},this.constructor.defaults);
		this.earliest = options.earliest.copy();
		this.latest = options.latest.copy();
		this.selected = initial instanceof Date ? initial.copy() : !initial ? new Date() : new Date(Date.parse(initial));
		this.working = this.selected.copy().set(Date.day,1));
		
		// DOM
		this.element = DOM.create("table",{
			"class": "calendar",
			"innerHTML": [
				"<thead>",
				"<tr><th class=\"prev\">",options.prev,"</th><th colspan=\"5\"></th><th class=\"next\">",options.next,"</th></tr>",
				"<tr><td>",Date.DayNames.invoke("left",3).join("</td><td>"),"</td></tr>",
				"</thead><tbody>",
				"<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>",
				"<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>",
				"<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>",
				"<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>",
				"<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>",
				"<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>",
				"</tbody>"
			].join("")
		});
		this.element.store("owner",this);
		
		var heads = this.element.query("th"), body = this.element.query("tbody")[0];
		this.__prev = heads[0];
		this.__month = heads[1];
		this.__next = heads[2];
		this.__days = body.query("td");
		
		this.__prev.handle("click",Calendar.clickPrevMonth.bind(this));
		this.__next.handle("click",Calendar.clickNextMonth.bind(this));
		body.handle("click",Calendar.clickDay.bind(this));
		
		// init
		this.handle("Selectedchanged",Calendar.changeSelected);
		this.handle("Workingchanged",Calendar.changeWorking);
		this.redraw();
	},
	"dispose": function() {
		this.element.dispose(true);
		this.element = null;
		
		this.__prev = this.__month = this.__next = null;
		
		this.__days.clear();
		this.__days = null;
		
		this.fumble();
	},
	"redraw": function() {
		var selected = this.getSelected(), working = this.getWorking();
		var early = this.getEarliest(), late = this.getLatest(), now = new Date();
		var iterator = working.copy().set(Date.Day,1);
		iterator.add(Date.Day,-iterator.getDay());
		
		this.__prev[working.copy().set(Date.Day,0) < early ? "addClass" : "removeClass"]("disabled");
		this.__next[working.copy().set(Date.Day,1).add(Date.Month,1) > late ? "addClass" : "removeClass"]("disabled");
		this.__month.innerHTML = working.toFormat("MMMM yyyy");
		
		for (var i=0; i<42; i++) {
			var day = this.__days[i];
			day.innerHTML = iterator.getDate();
			day.className = "";
			
			if (iterator <= early) day.addClass("disabled");
			else if (iterator >= late) day.addClass("disabled");
			else if (iterator.isSameDay(selected)) day.addClass("active");
			
			if (iterator.isSameDay(now)) day.addClass("now");
			else if (iterator < now) day.addClass("past");
			else if (iterator > now) day.addClass("soon");
			
			if (!iterator.isSameMonth(working)) {
				if (iterator < working) day.addClass("prev");
				else if (iterator > working) day.addClass("next");
			};
			
			iterator.add(Date.Day,1);
		};
		
		return this;
	}
},{
	"defaults": {
		"earliest": new Date(Date.parse("1979-01-01")),
		"latest": new Date(Date.parse("9999-12-31")),
		"prev": "&laquo;",
		"next": "&raquo;"
	},
	"changeSelected": function(event,old) {
		var selected = this.getSelected(), redraw = selected.isSameMonth(this.getWorking());
		this.setWorking(selected.copy().set(Date.Day,1));
		if (redraw) this.redraw();
	},
	"changeWorking": function(event,old) {
		if (!old.isSameMonth(this.getWorking())) this.redraw();
	},
	"clickDay": function(event) {
		var element = event.element(), temp = this.getWorking().copy();
		if (element.hasClass("disabled") || element.hasClass("selected")) return;
		
		if (element.hasClass("prev")) temp.set(Date.Day,1).add(Date.Month,-1);
		else if (element.hasClass("next")) temp.set(Date.Day,1).add(Date.Month,1);
		temp.set(Date.Day,element.innerHTML.toNumber());
		
		this.setSelected(temp);
	},
	"clickPrevMonth": function(event) {
		var element = event.element();
		if (element.hasClass("disabled")) return;
		
		this.setWorking(this.getWorking().copy().set(Date.Day,1).add(Date.Month,-1));
	},
	"clickNextMonth": function(event) {
		var element = event.element();
		if (element.hasClass("disabled")) return;
		
		this.setWorking(this.getWorking().copy().set(Date.Day,1).add(Date.Month,1));
	}
});

/***********************
*** Chooser ************
***********************/
Pseudo.Controls.Chooser = Pseudo.Class();

/***********************
*** Clock **************
***********************/
Pseudo.Controls.Clock = Pseudo.Class();

/***********************
*** Colour *************
***********************/
Pseudo.Controls.Colour = Pseudo.Class();

/***********************
*** Draggable **********
***********************/
Pseudo.Controls.Draggable = Pseudo.Class();

/***********************
*** Orderable **********
***********************/
Pseudo.Controls.Orderable = Pseudo.Class();

/***********************
*** Progress ***********
***********************/
Pseudo.Controls.Progress = Pseudo.Class();

/***********************
*** Slider *************
***********************/
Pseudo.Controls.Slider = Pseudo.Class();

/***********************
*** Tabs ***************
***********************/
Pseudo.Controls.Tabs = Pseudo.Class();

/***********************
*** Globals ************
***********************/
var	Calendar = Pseudo.Controls.Calendar,
	Chooser = Pseudo.Controls.Chooser,
	Clock = Pseudo.Controls.Clock,
	Colour = Pseudo.Controls.Colour,
	Draggable = Pseudo.Controls.Draggable,
	Orderable = Pseudo.Controls.Orderable,
	Progress = Pseudo.Controls.Progress,
	Slider = Pseudo.Controls.Slider,
	Tabs = Pseudo.Controls.Tabs;