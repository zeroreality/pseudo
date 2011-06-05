/* ---------------------------------------------------------------------------
 *  Pseudo JavaScript framework, version 0.1b
 *  (c) 2009 Alex Lein
 *
 *  Pseudo is based heavily on the awesome
 *  Prototype JavaScript framework (c) 2005-2009 Sam Stephenson
 *
 *  Pseudo is freely distributable under the terms of an MIT-style license.
 *  For details, see the Prototype web site: http://www.prototypejs.org/
 *
 *--------------------------------------------------------------------------*/

/* ---------------------------------------------------------------------------
 * Calendar
 * -------------------------------------------------------------------------*/
var Calendar = Class.create(null,{
	"Working": Class.Properties.Date,
	"Selected": Class.Properties.Date,
	"Earliest": Class.Properties.Date,
	"Latest": Class.Properties.Date
},{
	"constructor": function(initial/*,options*/) {
		var options = Object.expand(arguments[1]||{},{
			"earliest": Date.fromSql("1970-01-01",true), "latest": Date.today().add(Date.Year,1000),
			"prev": "&laquo;", "next": "&raquo;"
		});
		
		this.setEarliest(options.earliest.copy());
		this.setLatest(options.latest.copy());
		this.setSelected(initial instanceof Date ? initial.copy() : !initial ? new Date() : Date.fromSql(initial,true));
		this.setWorking(this.getSelected().copy().set(Date.Day,1));
		
		// DOM
	/*
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
	*/
		this.element = DOM.create("div",{
			"innerHTML": [
				"<table>",
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
				"</tbody>",
				"</table>"
			].join("")
		}).firstElement();
		this.element.addClass("calendar");
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


/* ---------------------------------------------------------------------------
 * Clock
 * -------------------------------------------------------------------------*/
var Clock = Class.create(null,{
	"Selected": Class.Properties.Date,
	"Earliest": Class.Properties.Date,
	"Latest": Class.Properties.Date
},{
	"constructor": function(initial/*,options*/) {
		var options = Object.expand(arguments[1]||{},{
			"earliest": Date.fromSql("2000-01-01 00:00:00",true),
			"latest": Date.fromSql("2000-01-01 23:59:59.999",true),
			"up": "up", "down": "down"
		});
		
		this.setEarliest(options.earliest.copy());
		this.setLatest(options.latest.copy());
		this.setSelected(initial instanceof Date ? initial.copy() : !initial ? new Date() : Date.fromSql(initial,true));
		
		// DOM
		this.element = DOM.create("div",{
			"class": "clock",
			"innerHTML": [
				"<input type=\"text\" class=\"hour\" />:",
				"<input type=\"text\" class=\"minute\" />",
				"<input type=\"text\" class=\"meridium\" />",
				"<a href=\"#?up\" class=\"up\">",options.next,"</button>",
				"<a href=\"#?down\" class=\"down\">",options.prev,"</button>"
			].join("")
		});
		this.element.store("owner",this);
		
		this.__inputs = this.element.query("input");
		this.__focus = this.__inputs[0];
		var buttons = this.element.query("a");
		
		buttons[0].handle("mousedown",Clock.clickUp.bind(this));
		buttons[1].handle("mousedown",Clock.clickDown.bind(this));
		this.__inputs[0].handle("keypress",Clock.keyHour.bind(this));
		this.__inputs[1].handle("keypress",Clock.keyMinute.bind(this));
		this.__inputs[2].handle("keypress",Clock.keyMeridium.bind(this));
		
		// focusing events
		var focuser = Clock.focus.bind(this), blurer = Clock.blur.bind(this);
		this.__inputs.each(function(input) {
			input.handle("focus",focuser);
			input.handle("blur",blurer);
		});
		
		// init
		this.handle("Selectedchanged",this.redraw);
		this.redraw();
	},
	"dipose": function() {
		this.element.dispose(true);
		this.element = null;
		
		this.__inputs.clear();
		this.__inputs = this.__focus = null;
		
		this.fumble();
	},
	"redraw": function() {
		//yay?
		var selected = this.getSelected();
		this.__inputs[0].value = selected.getHoursBase12().zeroPadded(2);
		this.__inputs[1].value = selected.getMinutes().zeroPadded(2);
		this.__inputs[2].value = selected.getHours() > 11 ? "PM" : "AM";
	}
},(function(){
	var timer;
	function clearTimer() {
		try { clearTimeout(timer) } catch(x) {};
		try { clearInterval(timer) } catch(x) {};
		timer = null;
		document.body.fumble("mouseup",arguments.callee,true);
	};
	function pseudoHold(func,context) {
		timer = setTimeout(function(){
			func.call(context);
			timer = setInterval(function(){ func.call(context) },100);
		},800);
		document.body.handle("mouseup",clearTimer,true);
	};
	return {
		"blur": function(event) {
			var temp = this.getSelected().copy();
			var hours = !isNaN(this.__inputs[0].value) ? this.__inputs[0].value.toNumber() : temp.getHours();
			var minutes = !isNaN(this.__inputs[1].value) ? this.__inputs[1].value.toNumber() : temp.getMinutes();
			var morning = !this.__inputs[2].value.toUpperCase().contains("P");
			
			if (hours > 12) hours = hours % 12;
			if (minutes >= 60) minutes = minutes % 60;
			
			temp.set(Date.Hour,!morning ? hours+12 : hours);
			temp.set(Date.Minute,minutes);
			this.setSelected(temp);
		},
		"keyHour": function(event) {
			if (event.keyCode == Event.KeyCodes.UP || event.keyCode == Event.KeyCodes.DOWN) {
				var hours = this.__inputs[0].value.toNumber();
				if (isNaN(hours)) hours = this.getSelected().getHours();
				
				hours += (event.keyCode == Event.KeyCodes.UP) ? 1 : -1;
				if (hours > 12) hours = hours % 12;
				if (hours <= 0) hours = 12;
				
				this.__inputs[0].value = hours.zeroPadded(2);
			} else if (event.keyCode == Event.KeyCodes.ESC) {
				this.__inputs[0].value = this.getSelected().getHours().zeroPadded(2);
			};
		},
		"keyMinute": function(event) {
			if (event.keyCode == Event.KeyCodes.UP || event.keyCode == Event.KeyCodes.DOWN) {
				var minutes = this.__inputs[1].value.toNumber();
				if (isNaN(minutes)) minutes = this.getSelected().getMinutes();
				
				minutes += (event.keyCode == Event.KeyCodes.UP) ? 1 : -1;
				if (minutes >= 60) minutes = minutes % 60;
				else if (minutes < 0) minutes = 59;
				
				this.__inputs[1].value = minutes.zeroPadded(2);
			} else if (event.keyCode == Event.KeyCodes.ESC) {
				this.__inputs[1].value = this.getSelected().getMinutes().zeroPadded(2);
			};
		},
		"keyMeridium": function(event) {
			if (event.keyCode == Event.KeyCodes.UP || event.keyCode == Event.KeyCodes.DOWN) {
				var morning = !this.__inputs[2].value.toUpperCase().contains("P");
				this.__inputs[2].value = !morning ? "AM" : "PM";	// backwards to enable switching with up/down keys
			} else if (event.keyCode == Event.KeyCodes.ESC) {
				this.__inputs[2].value = (this.getSelected().getHours() >= 12) ? "PM" : "AM"
			};
		},
		
		"focus": function(event) {
			this.__focus = event.element();
		},
		"clickUp": function(event) {
			event.stop();
			var temp = this.getSelected().copy();
			
			if (this.__focus.hasClass("hour")) temp.add(Date.Hour,1);
			else if (this.__focus.hasClass("minute")) temp.add(Date.Minute,1);
			else temp.add(Date.Hour,12);
			
			this.setSelected(temp);
			if (!timer) pseudoHold(arguments.callee,this);
		},
		"clickDown": function(event) {
			event.stop();
			var temp = this.getSelected().copy();
			
			if (this.__focus.hasClass("hour")) temp.add(Date.Hour,-1);
			else if (this.__focus.hasClass("minute")) temp.add(Date.Minute,-1);
			else temp.add(Date.Hour,-12);
			
			this.setSelected(temp);
			if (!timer) pseudoHold(arguments.callee,this);
		}
	};
})());

/* ---------------------------------------------------------------------------
 * Date/Time Picker
 * -------------------------------------------------------------------------*/
var DateTimePicker = Class.create(null,null,{
	"constructor": function(initial,calendarOpts,clockOpts) {
		this.calendar = new Calendar(initial,calendarOpts);
		this.clock = new Clock(initial,clockOpts);
		
		// DOM
		this.element = DOM.create("div",{ "class": "datetimepicker" });
		this.element.store("owner",this);
		this.element.appendChild(this.calendar.element);
		this.element.appendChild(this.clock.element);
		
		// init
		this.__synchronizer = DateTimePicker.synchronizer.bind(this);
		this.calendar.handle("Selectedchanged",this.__synchronizer);
		this.clock.handle("Selectedchanged",this.__synchronizer);
		this.__synchronizer();
	},
	"dipose": function() {
		this.calendar.dipose();
		this.clock.dipose();
		
		this.element.dispose(true);
		this.element = null;
		
		this.__synchronizer = null;
		
		this.fumble();
	},
	"getSelected": function() {
		var calendar = this.calendar.getSelected(), clock = this.clock.getSelected();
		return Date.fromSql([
			calendar.getFullYear(),"-",
			(calendar.getMonth()+1).zeroPadded(2),"-",
			calendar.getDate().zeroPadded(2)," ",
			clock.getHours().zeroPadded(2),":",
			clock.getMinutes().zeroPadded(2),":",
			clock.getSeconds().zeroPadded(2),".",
			clock.getMilliseconds()
		].join(""),true);
	},
	"setSelected": function(date) {
		var oldDate = this.getSelected();
		this.calendar.fumble("Selectedchanged",this.__synchronizer);
		this.clock.fumble("Selectedchanged",this.__synchronizer);
		this.calendar.setSelected(date);
		this.clock.setSelected(date);
		this.calendar.handle("Selectedchanged",this.__synchronizer);
		this.clock.handle("Selectedchanged",this.__synchronizer);
		this.raise("Selectedchanged",oldDate);
	}
},{
	"synchronizer": function(event,oldDate) {
		this.raise("Selectedchanged",oldDate);
	}
});

/* ---------------------------------------------------------------------------
 * Chooser (radio button replacement)
 * -------------------------------------------------------------------------*/
var Chooser = (function(){
	var	TAGS_LISTS = ["UL","OL","TR"],
		TAGS_ITEMS = ["LI","TD"],
		GET_ACTIVE = function(element) {
			var active = element;
			if (!TAGS_ITEMS.contains(active.nodeName)) active = element.up(TAGS_ITEMS.join(","));
			return active;
		},
		HELPER_SINGLE = function(element) { if (this !== element) element.removeClass("active") },
		HELPER_INDEXES = function(element) { return element.hasClass("active") },
		HELPER_ACTIVES = function(tag) { return tag +".active" },
		HANDLER = function(event) {
			if (!this.element.hasClass("disabled")) this.select(GET_ACTIVE(event.element()));
		},
		
		Single = Class.create(null,null,{
			"constructor": function(element,defaultIndex,optional) {
				this.element = $(element);
				this.list = this.element.query(TAGS_LISTS.join(","))[0];
				
				this.required = !optional;
				defaultIndex = parseInt(defaultIndex);
				if (this.required && !defaultIndex) defaultIndex = 0;
				this.select(defaultIndex);
				
				this.__handler = HANDLER.bind(this);
				this[element.hasClass("disabled") ? "disable" : "enable"]();
			},
			"dispose": function($super) {
				this.list.dispose();
				this.element.dispose();
				
				this.__handler = null;
				this.element = this.list = null;
				
				return $super();
			},
			"enable": function() {
				this.element.removeClass("disabled");
				this.element.handle("click",this.__handler);
			},
			"disable": function() {
				this.element.fumble("click",this.__handler);
				this.element.addClass("disabled");
			},
			"select": function(object) {
				var old, active, elements = this.element.query(TAGS_ITEMS.join(","));
				if (!Object.isElement(object)) active = elements[object];
				else active = elements.contains(object) ? object : null;
				if (active || !this.required) {
					old = this.getSelected();
					if (active === old && this.required) return;
					if (active) active.addClass("active");
					if (old) old.removeClass("active");
					this.raise("changed",active,old);
				};
			},
			"getSelected": function() {
				return this.element.query(TAGS_ITEMS.examine(HELPER_ACTIVES).join(","))[0];
			},
			"getIndex": function() {
				return this.element.query(TAGS_ITEMS.join(",")).findIndex(HELPER_INDEXES);
			}
		}),
		Multiple = Class.create(Single,null,{
			"constructor": function($super,element) {
				$super(element,-1,true);
			},
			"select": function(objects) {
				objects = $A(arguments).flatten();
				var changed = [], active, elements = this.element.query(TAGS_ITEMS.join(","));
				objects.each(function(object) {
					if (!Object.isElement(object)) active = elements[object];
					else active = elements.contains(object) ? object : null;
					if (active) changed.push(active.toggleClass("active"));
				});
				if (changed.length) this.raise("changed",changed);
			},
			"getSelected": function() {
				return this.element.query(TAGS_ITEMS.examine(HELPER_ACTIVES).join(","));
			},
			"getIndex": function() {
				return this.element.query(TAGS_ITEMS.join(",")).findAllIndex(HELPER_INDEXES);
			}
		});
	
	function single(event) {
		if (this.hasClass("disabled")) return;
		var active = GET_ACTIVE(event.element());
		if (!active) return;
		active.addClass("active");
		this.query(active.nodeName).each(HELPER_SINGLE,active);
		event.stop();
	};
	function multiple(event) {
		if (this.hasClass("disabled")) return;
		var active = GET_ACTIVE(event.element());
		if (!active) return;
		active.toggleClass("active");
		event.stop();
	};
	
	return {
		"single": single,
		"multiple": multiple,
		"Single": Single,
		"Multiple": Multiple
	};
})();

/* ---------------------------------------------------------------------------
 * Tabs
 * -------------------------------------------------------------------------*/
var Tabs = Class.create(null,{
	"ActiveTab": Class.Properties.Generic,
	"ActivePanel": Class.Properties.Generic
},{
	"constructor": function(tabContainer,panelContainer,defaultTab) {
		// DOM
		this.tabContainer = $(tabContainer);
		this.panelContainer = $(panelContainer);
		
		// init
		this.tabContainer.handle("click",Tabs.clicker.bind(this));
		this.handle("ActiveTabchanged",Tabs.changedTab.bind(this));
		this.handle("ActivePanelchanged",Tabs.changedPanel.bind(this));
		this.selectAt(defaultTab||0);
	},
	"getTabs": function() { return this.tabContainer.childElements() },
	"getPanels": function() { return this.panelContainer.childElements() },
	"getTab": function(index) { return this.getTabs()[index] },
	"getPanel": function(index) { return this.getPanels()[index] },
	"getElementIndex": function(element) {
		if (!Object.isElement(element)) return;
		var tabs = this.getTabs();
		for (var i=0,e; e=tabs[i]; i++) if (e === element) return i;
		var panels = this.getPanels();
		for (var i=0,e; e=panels[i]; i++) if (e === element) return i;
	},
	
	"select": function(tab) {
		var index = this.getElementIndex(tab);
		if (!isNaN(index)) this.selectAt(index);
		return this;
	},
	"selectAt": function(index) {
		var tab = this.getTab(index), panel = this.getPanel(index);
		this.setActiveTab(tab);
		this.setActivePanel(panel);
		return this;
	},
	"add": function(tab,panel,before) {
		return this.addAt(tab,panel,this.getElementIndex(before));
	},
	"addAt": function(tab,panel,index) {
		var tabs = this.getTabs();
		if (isNaN(index)) index = tabs.length;
		if (index < 0) index += tabs.length;
		this.tabContainer.insertBefore(tab.removeClass("active"),tabs[index]||null);
		this.panelContainer.insertBefore(panel.hide(),this.getPanels()[index]||null);
		this.raise("added",tab,panel,index);
		if (tabs.length <= 0) {
			this.setActiveTab(tab);
			this.setActivePanel(panel);
		};
		return index;
	},
	"remove": function(element) {
		return this.removeAt(this.getElementIndex(element));
	},
	"removeAt": function(index) {
		var tabs = this.getTabs(), panels = this.getPanels();
		if (tabs[index] && panels[index]) {
			var tab = tabs[index].amputate(), panel = panels[index].amputate();
			this.raise("removed",tab,panel,index);
			if (tab === this.getActiveTab()) {
				if (tabs.length > 1) {
					if (index === tabs.length-1) index--;
					if (index < 0) index = 0;
					this.selectAt(index);
				} else {
					this.setActiveTab();
					this.setActivePanel();
				};
			};
			return index;
		};
	},
	"clear": function(index) {
		var tabs = this.getTabs(), panels = this.getPanels();
		tabs.invoke("amputate");
		this.setActiveTab();
		panels.invoke("amputate");
		this.setActivePanel();
		this.raise("cleared",tabs,panels,tabs.length);
		return this;
	}
},{
	"clicker": function(event) {
		var li = event.element();
		if (li.tagName !== "LI") li = li.up("li");
		if (li) this.select(li);
	},
	"changedTab": function(event,old) {
		var tab = this.getActiveTab();
		if (old) old.removeClass("active");
		if (tab) tab.addClass("active");
	},
	"changedPanel": function(event,old) {
		var panel = this.getActivePanel();
		if (old) old.hide();
		if (panel) panel.show();
	}
});

/* ---------------------------------------------------------------------------
 * Draggable
 * -------------------------------------------------------------------------*/
var Draggable = Class.create(null,{
	"Dragging": Class.Properties.Boolean
},{
	"constructor": function(element,options,callbacks) {
		// elements
	//	this.__trace = "dragstopped";
		this.grip = this.element = $(element);
		
		// options
		options = Object.expand(options||{},Draggable.defaults);
		if (options.grip) this.grip = $(options.grip);
		if (options.container) this.container = $(options.container);
		this.dragClass = options.dragClass || "";
		this.constraint = options.constraint || "";
		
		// event watchers
		this.__mousedown = this.startDrag.bind(this);
		this.__mousemove = this.setDrag.bind(this);
		this.__mouseup = this.stopDrag.bind(this);
		if (callbacks) for (var each in callbacks) this.handle(each,callbacks[each]);
		this.grip.handle("mousedown",this.__mousedown);
		
		// default position
		this.__initialX = this.__initialY = 0;
		this.__startX = this.__startY = 0;
		this.checkContainer();
	},
	"dispose": function() {
		this.grip.dispose();
		if (this.grip !== this.element) this.element.dispose();
		this.grip = this.element = this.container = null;	// continer not disposed, might be in use elsewhere
		this.__mousedown = this.__mousemove = this.__mouseup = null;
		document.fumble("mousemove",this.__mousemove);
		document.fumble("mouseup",this.__mouseup);
		this.fumble();
	},
	"checkContainer": function() {
		if (!this.container) {
			this.__maxX = this.__maxY = NaN;
		} else {
			var dims = this.container.dimensions();
			this.__maxX = dims.width;
			this.__maxY = dims.height;
		};
	},
	"startDrag": function(event) {
		if (this.getDragging()) this.stopDrag(event);
		this.setDragging(true);
		event.stop();
		this.__initialX = event.clientX || 0;
		this.__initialY = event.clientY || 0;
		this.__startX = this.element.getStyle("left").toNumber() || 0;
		this.__startY = this.element.getStyle("top").toNumber() || 0;
		this.checkContainer();
		if (this.dragClass) this.element.addClass(this.dragClass);
		document.handle("mousemove",this.__mousemove);
		document.handle("mouseup",this.__mouseup);
		this.raise("dragstarted");
	},
	"stopDrag": function(event) {
		this.setDragging(false);
		this.__initialX = this.__initialY = 0;
		this.__startX = this.__startY = 0;
		if (this.dragClass) this.element.removeClass(this.dragClass);
		document.fumble("mousemove",this.__mousemove);
		document.fumble("mouseup",this.__mouseup);
		this.raise("dragstopped");
	},
	"setDrag": function(event) {
		var position = {};
		if (!this.constraint || this.constraint.startsWith("h")) {
			position.left = this.__startX + event.clientX - this.__initialX;
			if (!isNaN(this.__maxX)) {
				if (position.left > this.__maxX) position.left = this.__maxX;
				else if (position.left < 0) position.left = 0;
			};
			position.left += "px";
		};
		if (!this.constraint || this.constraint.startsWith("v")) {
			position.top = this.__startY + event.clientY - this.__initialY;
			if (!isNaN(this.__maxY)) {
				if (position.top > this.__maxY) position.top = this.__maxY;
				else if (position.top < 0) position.top = 0;
			};
			position.top += "px";
		};
		this.element.setStyle(position);
		this.raise("dragging",position);
	}
},{
	"defaults": {
	//	"dragClass": "dragging"
	}
});

/* ---------------------------------------------------------------------------
 * Slider
 * -------------------------------------------------------------------------*
var Slider = Class.create(Draggable,{
	"Higher": Class.Properties.Number,
	"Lower": Class.Properties.Number
},{
	"constructor": function($super,bar,input,high,low) {
		this.setHigher(high || 100);
		this.setLower(low || 0);
		
		this.container = $(bar);
		this.element = this.container.query("span")[0];
		this.input = $(input);
		$super(this.element,{
			"container": this.container,
			"constraint": "horizontal"
		});
		
		this.__focus = Slider.focus.bind(this);
		this.__keyup = Slider.keyup.bind(this);
		this.__blur = Slider.blur.bind(this);
		this.__click = Slider.click.bind(this);
		this.input.handle("focus",this.__focus);
		this.input.handle("keyup",this.__keyup);
		this.input.handle("blur",this.__keyup);
		this.input.handle("blur",this.__blur);
		this.container.handle("mousedown",this.__click);
		
		this.__drag = Slider.drag.bind(this);
		this.__blurit = Slider.blurry.bind(this);
		this.__threshold = Slider.threshold.bind(this);
		this.handle("dragstarted",this.__blurit);
		this.handle("dragging",this.__drag);
		this.handle("Higherchanged",this.__threshold);
		this.handle("Lowerchanged",this.__threshold);
	},
	"dispose": function($super) {
		this.container.dispose();
		this.input.dispose();
		this.input = null;
		
		this.__focus = this.__keyup = this.__blur = null;
		this.__drag = null;
		
		this.fumble();
		$super();
	},
	"getValue": function() {
		return this.input.value.toNumber().rangeBetween(this.getHigher(),this.getLower());
	},
	"setValue": function(value) {
		if (isNaN(value) || value < this.getLower()) value = this.getLower();
		else if (value > this.getHigher()) value = this.getHigher();
		this.setPercent(value.rangeBetween(this.getHigher(),this.getLower()));
	},
	"getPercent": function() {
		return this.element.getStyle("left").toNumber().rangeBetween(this.__maxX,0);
	},
	"setPercent": function(percent) {
		if (isNaN(percent) || percent < 0) percent = 0;
		else if (percent > 1) percent = 1;
		this.setDrag({ "clientX": percent.betweenRange(this.__maxX,0).round() });
	}
},{
	"click": function (event) {
		this.startDrag({ "clientX": this.element.offset(this.contianer).left + 5 });
	},
	"threshold": function(event) {
		this.__drag(event,{
			"top": this.element.getStyle("top"),
			"left": this.element.getStyle("left")
		});
	},
	"drag": function(event,position) {
		var percent = position.left.toNumber().rangeBetween(this.__maxX);
		this.input.value = percent.betweenRange(this.getHigher(),this.getLower());
	},
	"focus": function() {
		this.fumble("dragging",this.__drag);
		
	},
	"keyup": function() {
		this.setValue(this.input.value.toNumber());
	},
	"blurry": function() {
		this.input.blur();
	},
	"blur": function() {
		this.handle("dragging",this.__drag);
	}
});

/* ---------------------------------------------------------------------------
 * Slider
 * -------------------------------------------------------------------------*/
var Slider = Class.create(null,null,{
	"constructor": function(bar,input,options) {
		if (!options) options = Slider.DEFAULTS;
		this.bar = $(bar);
		this.grip = bar.query("span")[0];
		this.input = $(input);
		this.high = isNaN(options.high) ? Slider.DEFAULTS.high : options.high;
		this.low = isNaN(options.low) ? Slider.DEFAULTS.low : options.low;
		
		// self-events
		this.__blur = Slider.blur.bind(this);
		this.__keyup = Slider.keyup.bind(this);
		this.__mousedown = Slider.mousedown.bind(this);
		this.__mouseup = Slider.mouseup.bind(this);
		this.__mousemove = Slider.mousemove.bind(this);
		this.input.handle("blur",this.__blur);
		this.input.handle("keyup",this.__keyup);
		this.bar.handle("mousedown",this.__mousedown);
		
		// init
		this.ratio = options.percent;
		if (!isNaN(options.percent)) this.setPercent(options.percent);
		else if (!isNaN(options.value)) this.setValue(options.value);
		else this.setValue(0);
		this.redraw();
	},
	"dispose": function($super) {
		this.bar.dispose(true);
		this.input.dispose();
		this.bar = this.grip = this.input = null;
		
		this.__keyup = this.__mousedown = this.__mousemove = this.__mouseup = null;
		
		return $super();
	},
	"setValue": function(value) {		// sets input value, not slider position
		if (value > this.high) value = this.high;
		else if (value < this.low) value = this.low;
		this.ratio = value.rangeBetween(this.high,this.low);
		this.input.value = value;
	},
	"setPercent": function(percent) {	// sets slider position, not input value
		if (percent > 1) percent = 1;
		else if (percent < 0) percent = 0;
		this.ratio = percent;
		this.grip.style.left = (this.ratio*100) +"%";
	},
	"setThresholds": function(high,low) {
		this.high = isNaN(high) ? this.high : high;
		this.low = isNaN(low) ? this.low : low;
		this.redraw();
	},
	"redraw": function() {
		this.input.value = this.ratio.betweenRange(this.high,this.low);
		this.grip.style.left = (this.ratio*100) +"%";
	}
},{
	"DEFAULTS": {
		"high": 100,
		"low": 0
	},
	"blur": function(event) { this.redraw() },
	"keyup": function(event) {
		var value = parseFloat(this.input.value);
		if (!isNaN(value)) this.setPercent(value.rangeBetween(this.high,this.low));
	},
	"mousedown": function(event) {
		this.__left = this.bar.offset().left;
		this.__right = this.__left + this.bar.offsetWidth;
		document.handle("mouseup",this.__mouseup);
		document.handle("mousemove",this.__mousemove);
	},
	"mouseup": function(event) {
		document.fumble("mouseup",this.__mouseup);
		document.fumble("mousemove",this.__mousemove);
	},
	"mousemove": function(event) {
		var x = event.pointer().x, percent;
		if (x > this.__right) x = this.__right;
		else if (x < this.__left) x = this.__left;
		percent = x.rangeBetween(this.__right,this.__left);
		this.grip.style.left = (percent*100) +"%";
		this.setValue(percent.betweenRange(this.high,this.low));
	}
});

/* ---------------------------------------------------------------------------
 * Orderable (lists, ol, ul... maybe table and dl)
 * -------------------------------------------------------------------------*/
var Orderable = Class.create(null,null,{
	"constructor": function(element,options) {
		this.element = $(element);
		this.options = Object.expand(options||{},Orderable.DEFAULTS);
		
		if (this.options.plug) this.plug = this.options.plug;
		if (this.options.arrow) this.arrow = this.options.arrow;
		this.options.plug = this.options.arrow = null;
		
		// element setup
		var pos = element.getStyle("position");
		if (pos !== "relative" && pos !== "absolute") element.style.position = "relative";
		
		// internal handlers
		this.__mousedown = Orderable.mousedown.bind(this);
		this.__mousemove = Orderable.mousemove.bind(this);
		this.__mouseup = Orderable.mouseup.bind(this);
		element.handle("mousedown",this.__mousedown);
	},
	"dispose": function($super) {
		this.element.dispose(true);
		this.element = this.plug = this.arrow = null;
		this.target = this.listChilds = null;
		this.coordinates = this.arrowTops = this.offsets = null;
		
		return $super();
	},
	"orderPrepare": function(target) {
		var height, cumulative = 0, kids = this.element.childElements();
		
		this.currentIndex = -1;
		this.target = target;
		this.targetHeight = Orderable.innerHeight(target);
		this.coordinates = this.element.offset();
		this.listChilds = kids;
		this.arrowTops = new Array(kids.length+1);
		this.offsets = new Array(kids.length);
		
		for (var i=0,l=kids.length; i<l; i++) {
			height = Orderable.innerHeight(kids[i]);
			this.arrowTops[i] = cumulative;
			this.offsets[i] = cumulative + (height/2);
			cumulative += height;
		};
		this.arrowTops[kids.length] = cumulative;
		
		document.handle("mousemove",this.__mousemove);
		document.handle("mouseup",this.__mouseup);
	},
	"orderStart": function() {
		if (this.ordering) return;
		
		if (!this.plug) this.plug = DOM.create(this.target.nodeName,{
			"class": this.options.plugClass,
			"innerHTML": this.options.plugHtml
		});
		if (!this.arrow) this.arrow = DOM.create(this.target.nodeName,{
			"class": this.options.arrowClass,
			"innerHTML": this.options.arrowHtml
		});
		
		if (this.options.elementClass) this.element.addClass(this.options.elementClass);
		if (this.options.targetClass) this.target.addClass(this.options.targetClass);
		this.target.setStyle({ "position": "absolute", "z-index": "2" });
		this.arrow.setStyle({ "position": "absolute", "z-index": "3" });
		this.plug.setStyle({ "height": this.targetHeight +"px" });
		if (this.arrow.parentNode !== this.element) this.element.appendChild(this.arrow);
		if (this.plug.parentNode !== this.element) this.element.insertAfter(this.plug,this.target);
		
		this.ordering = true;
		this.raise("startorder");
	},
	"orderPreview": function(index) {
		if (!this.ordering || index < 0 || index === this.currentIndex) return;
		this.currentIndex = index;
		this.arrow.style.top = this.arrowTops[index] +"px";
		this.raise("ordering");
	},
	"orderStop": function() {
		if (!this.ordering) return;
		
		this.target.style.position = this.target.style.top = this.target.style.zIndex = "";
		if (this.options.targetClass) this.target.removeClass(this.options.targetClass);
		if (this.options.elementClass) this.element.removeClass(this.options.elementClass);
		this.element.removeChild(this.plug);
		this.element.removeChild(this.arrow);
		document.fumble("mousemove",this.__mousemove);
		document.fumble("mouseup",this.__mouseup);
		
		var index = this.listChilds.indexOf(this.target);
		if (index !== this.currentIndex && index+1 !== this.currentIndex) {
			this.target.transplant(this.element,this.listChilds[this.currentIndex]);
			this.raise("ordered");
		};
		
		this.ordering = false;
		this.raise("stoporder");
		this.target = this.listChilds = null;
	}
},(function(){
	var STYLES = { "padding-top": "", "padding-bottom": "", "border-top-width": "", "border-bottom-width": "" };
	function innerHeight(element) {
		$(element).getStyle(STYLES);
		return element.offsetHeight -
			parseInt(STYLES["padding-top"]) -
			parseInt(STYLES["padding-bottom"]) -
			(parseInt(STYLES["border-top-width"]) || 0) -
			(parseInt(STYLES["border-bottom-width"]) || 0);
	};
	
	return {
		"DEFAULTS": {
			"plugHtml": "&nbsp;",
			"plugHtml": "&nbsp;",
			"plugClass": "plug",
			"arrowHtml": "&lt;---",
			"arrowClass": "arrow",
			"elementClass": "ordering",
			"targetClass": "dragging",
			"targetIgnore": ""
		},
		"innerHeight": innerHeight,
		
		"mousedown": function(event) {
			// get target
			var ignore = this.options.targetIgnore, target = event.element();
			if (target === this.element || ignore && target.match(ignore)) return;
			while (target.parentNode !== this.element) {
				target = target.up();
				if (target === this.element || ignore && target.match(ignore)) return;
			};
			if (target) {
				this.orderPrepare(target);
				event.prevent();
			};
		},
		"mousemove": function(event) {
			if (!this.ordering) this.orderStart();
			var index = -1, top = event.clientY - this.coordinates.top;
			if (top < this.offsets[0]) {
				index = 0;
			} else if (top > this.offsets.last()) {
				index = this.offsets.length;
			} else {
				index = 1;
				for (var l=this.offsets.length; index<l; index++) if (top < this.offsets[index]) break;
			};
			top -= this.targetHeight / 2;
			this.target.style.top = top +"px";
			this.orderPreview(index);
		},
		"mouseup": function(event) {
			this.orderStop();
		}
	};
})());

/* ---------------------------------------------------------------------------
 * Drop-down menu
 * -------------------------------------------------------------------------*
var Dropdown = Class.create(null,{
	"constructor": function() {},
	"toggle": function() {},
	"openUp": function() {},
	"openDown": function() {},
	"openCentred": function() {}
},{
	
});

/* ---------------------------------------------------------------------------
 * Progress Bar
 * -------------------------------------------------------------------------*/
var ProgressBar = Class.create(null,{
	"Progress": Class.Properties.Number
},{
	"constructor": function(initial,element) {
		// DOM
		this.element = Object.isElement(element) ? element : DOM.create("div",{
			"class": "progress",
			"innerHTML": "<div class=\"bar\"><div></div></div><div class=\"num\">0%</div>"
		});
		this.__bar = this.element.query(".bar div")[0];
		this.__num = this.element.query(".num")[0];
		
		// init
		this.handle("Progresschanged",this.redraw);
		this.setProgress(String(initial).toNumber() || 0);
	},
	"dispose": function() {
		this.fumble();
		this.element.dispose(true);
		this.element = null;
		this.__bar = null;
		this.__num = null;
	},
	"redraw": function() {
		var percent = Math.round(this.getProgress() * 100) +"%";
		if (this.__bar) this.__bar.setStyle({ "width": percent });
		if (this.__num) this.__num.update(percent);
	}
});

/* ---------------------------------------------------------------------------
 * Async Looper
 * -------------------------------------------------------------------------*/
var AsyncLoop = Class.create(null,{
	"Working": Class.Properties.Boolean,
	"Interval": Class.Properties.Number,
	"Threshold": Class.Properties.Number
},{
	"constructor": function(collection,iterator,options,callbacks) {
		this.collection = collection;
		this.iterator = iterator;
		this.index = 0;
		if (!options) options = AsyncLoop.Detaults;
		else Object.expand(options,AsyncLoop.Detaults);
		this.setInterval(options.interval);
		this.setThreshold(options.threshold);
		for (var each in callbacks) this.handle(each,callbacks[each]);
	},
	"dispose": function() {
		this.stop();
		this.collection = null;
		this.fumble();
	},
	"start": function() {
		this.index = 0;
		this.started = new Date();
		this.resume();
		this.raise("started");
	},
	"pause": function() {
		this.setWorking(false);
	},
	"resume": function() {
		if (this.index < 0) this.index = 0;
		this.last = new Date();
		this.setWorking(true);
		this.next();
	},
	"next": function() {
		this.timer = AsyncLoop.repeater.delay({
			"scope": this,
			"timeout": this.getInterval()
		});
	},
	"stop": function() {
		this.setWorking(false);
		clearTimeout(this.timer);
	}
},{
	"Detaults": { "interval": 10, "threshold": 500 },
	"repeater": function() {
		if (!this.getWorking()) return;
		var thisTime = new Date().valueOf();
		
		if (this.index >= this.collection.length) {
			this.stop();
			this.raise("finished",thisTime - this.started.valueOf());
			return;
		};
		
		var	i = this.index,
			l = this.collection.length,
			thisDate = new Date(),
			lastTime = this.last.valueOf(),
			duration = thisTime - lastTime,
			timeout = thisTime + this.getThreshold() - (!i ? 0 : this.getInterval());
		for (; i<l; i++) {
			lastTime = thisTime;
			thisTime = new Date().valueOf();
			this.index = i;
			this.iterator.call(this,
				this.collection[i],	// each
				i,				// index
				this,			// AsyncLoop instance
				thisTime - lastTime	// duration between calls
			);
			if (thisTime >= timeout || !this.getWorking()) break;
			duration = thisTime - lastTime;
		};
		
		if (i<l) {
			this.index++;
			this.last = new Date(thisTime);
			this.next();
		} else {
			this.stop();
			this.raise("finished",thisTime - this.started.valueOf());
		};
/*
	},
	"repeater": function() {
		if (this.getWorking()) {
			var time = new Date().valueOf(), duration = time - this.last.valueOf();
			if (this.index >= this.collection.length) {
				this.stop();
				return this.raise("finished",time - this.started.valueOf());
			};
			
			this.iterator.call(this,
				this.collection[this.index],	// each
				this.index,				// index
				this,					// AsyncLoop instance
				duration					// duration between calls
			);
			this.index++;
			this.last.add(Date.Millisecond,time);
			this.next();
		};
*/
	}
});

/* ---------------------------------------------------------------------------
 * Interval Looper
 * -------------------------------------------------------------------------*/
var IntervalLoop = Class.create(AsyncLoop,null,{
	"constructor": function($super,collection,iterator,options) {
		$super(collection,iterator,options);
		this.__repeater = IntervalLoop.repeater.bind(this);
	},
	"resume": function() {
		if (this.index < 0) this.index = 0;
		this.last = new Date();
		this.setWorking(true);
		this.timer = setInterval(this.__repeater,this.getInterval());
	},
	"next": function() {},
	"stop": function() {
		this.setWorking(false);
		clearInterval(this.timer);
	}
},{
	"repeater": function() {
		if (!this.getWorking()) this.stop();
		
		var time = new Date().valueOf(), duration = time - this.last.valueOf();
		if (this.index >= this.collection.length) {
			this.raise("finished",time - this.started.valueOf());
			return this.stop();
		};
		
		this.iterator.call(this,
			this.collection[this.index],	// each
			this.index,				// index
			this,					// AsyncLoop instance
			duration					// duration between calls
		);
		this.index++;
		this.last.add(Date.Millisecond,time);
	}
});


/* ---------------------------------------------------------------------------
 * Hash Map (key/value pairs where the key can be an object)
 * -------------------------------------------------------------------------*/
var HashMap = Class.create(null,null,{
	"constructor": function(keys,values) {
		this.__keys = [];
		this.__values = [];
		if (Object.isArray(keys) && Object.isArray(values)) {
			this.__keys.inject(keys);
			this.__values.inject(values);
		} else if (Object.isObject(keys)) {
			for (var each in keys) {
				this.__keys.push(each);
				this.__values.push(keys[each]);
			};
		};
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
		this.raise("added",key,value,index,old);
		return index;
	},
	"remove": function(key) {
		var value, index = this.__keys.indexOf(key);
		if (index > -1) {
			value = this.__values[index];
			this.__keys.removeAt(index);
			this.__values.removeAt(index);
			this.raise("removed",key,value,index);
		};
		return value;
	},
	"findKey": function(value) {
		var index = this.__values.indexOf(value);
		if (index > -1) return this.__keys[index];
	}
});
HashMap.aliasMethods({
	"add": "set",
	"update": "set",
	"store": "set",
	"retrieve": "get"
});