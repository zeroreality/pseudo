/// <reference path="..\blds\pseudo3.js" />
"use strict";

/**
 * @this {Element}
 * @expose
 * @return {!Node} this
 */
HTMLElement_prototype.amputate = function() {
	return this.parentNode.removeChild(this);
};
/**
 * @this {Element}
 * @expose
 * @return {!Node} withNode
 */
HTMLElement_prototype.replace = function(withNode) {
	return this.parentNode.replaceChild(withNode, this);
};

/**
 * @param {!Node} parent
 * @param {*} value
 * @return {!Node} parent
 */
function appender(parent, value) {
	if (value instanceof Element || value instanceof DocumentFragment) {
		parent.appendChild(value);
	} else if (value instanceof Array) {
		for (var i = 0, l = value.length; i < l; i++) {
			appender(parent, value[i]);
		}
	} else if (value || OBJECT_IS_NUMBER(value)) {
		parent.insertAdjacentHTML("beforeEnd", value.toString());
		/*
	} else {
		var fragment = document.createDocumentFragment();
		if (value instanceof Array) {
			for (var i = 0, l = value.length; i < l; i++) {
				appender(fragment, value[i], nodeName);
			}
		} else if (value || OBJECT_IS_NUMBER(value)) {
			
		} else {
			var container = DOC.createElement(nodeName);
			container.innerHTML = value;
			var nodes = SLICE.call(container.childNodes);
			for (var i = 0, node = nodes[i]; node = nodes[i]; i++) {
				fragment.appendChild(node);
			}
		}
		parent.appendChild(fragment);
		*/
	}
	return parent;
}
/**
 * @this {Element}
 * @expose
 * @param {*} value
 * @return {!Node} this
 */
HTMLElement_prototype.append = function(value) {
	/*
	if (value instanceof HTMLElement || value instanceof DocumentFragment) {
		this.appendChild(value);
	} else if (value instanceof Array) {
		for (var i = 0, l = value.length; i < l; i++) {
			this.append(value[i]);
		}
	} else {
		var container = DOC.createElement(this.nodeName),
			fragment = DOC.createDocumentFragment();
		container.innerHTML = value;
		var nodes = SLICE.call(container.childNodes);
		for (var i = 0, node = nodes[i]; node = nodes[i]; i++) {
			fragment.appendChild(node);
		}
		this.appendChild(fragment);
		container = fragment = null;
	}
	return this;
	*/
	return appender(this, value);
};
/**
 * @this {Element}
 * @expose
 * @return {!Node} this
 */
HTMLElement_prototype.empty = function() {
	while (this.lastChild) {
		this.removeChild(this.lastChild);
	}
	return this;
};
/**
 * @this {Element}
 * @expose
 * @param {!Element} child	
 * @param {!Element=} after	
 * @return {!Node} child
 */
HTMLElement_prototype.insertAfter = function(child, after) {
	if (after && !this.contains(after)) throw "Invalid after node";
	return this.insertBefore(child, !after ? null : after.nextElementSibling || after.nextSibling || null);
};
/**
 * @this {Element}
 * @expose
 * @param {*=} value
 * @return {!Node} this
 */
HTMLElement_prototype.update = function(value) {
	return appender(this.empty(), value);
};
/**
 * @this {Element}
 * @expose
 * @param {Element} parent
 * @param {Element} before
 * @return {!Node} this
 */
HTMLElement_prototype.transplant = function(parent, before) {
	return parent.insertBefore(this.amputate(), before || null);
};
/**
 * @this {Element}
 * @expose
 * @param {Node=} ancestor
 * @return {Element}
 */
HTMLElement_prototype.climb = function(ancestor) {
	var child = this;
	if (!ancestor) ancestor = DOC;
	if (!ancestor.contains(child)) throw new Error("ancestor does not contain this element");
	while (child.parentNode !== ancestor) child = child.parentNode;
	return child;
};


/**
 * @this {Element}
 * @expose
 * @param {Element=} ancestor
 * @param {boolean=} includeTransforms
 * @return {!{top:number,left:number,width:number,height:number,scrollTop:number,scrollLeft:number}}
 */
HTMLElement_prototype.offsets = function(ancestor, includeTransforms) {
	var element = this,
		parent = element,
		xyTop = 0,
		xyLeft = 0,
		scTop = 0,
		scLeft = 0,
		w = element.offsetWidth,
		h = element.offsetHeight;
	if (!(ancestor instanceof HTMLElement)) ancestor = DOC_EL;
	while (element instanceof HTMLElement) {
		xyTop += element.offsetTop || 0;
		xyLeft += element.offsetLeft || 0;
		if (includeTransforms) {
			var transform = element.getStyle("transform"),
				parts = (transform || "").match(/([a-z0-9]+)/gim) || [];
			switch (parts[0].toLowerCase()) {
				case "scale":
				case "scale3d":
					var sx = FLOAT(parts[1]),
						sy = FLOAT(parts[2]);
					w *= sx;
					h *= IS_AN(sy) ? sy : sx;
					break;
				case "scalex":
					w *= FLOAT(parts[1]);
					break;
				case "scaley":
					h *= FLOAT(parts[1]);
					break;
				case "translate":
				case "translate3d":
					xyTop += FLOAT(parts[1]) || 0;
					xyLeft += FLOAT(parts[2]) || 0;
					break;
				case "translatex":
					xyTop += FLOAT(parts[1]) || 0;
					break;
				case "translatey":
					xyLeft += FLOAT(parts[1]) || 0;
					break;
				case "matrix":
					xyTop += FLOAT(parts[5]) || 0;
					xyLeft += FLOAT(parts[6]) || 0;
					break;
				//	case "matrix3d":
				//		break;
			}
		}
		parent = element;
		while (parent instanceof HTMLElement && parent !== ancestor && parent !== element.offsetParent) {
			parent = parent.parentNode;
			scTop += parent.scrollTop || 0;
			scLeft += parent.scrollLeft || 0;
		}
		element = parent;
		if (element === ancestor) break;
	}
	return {
		"top": xyTop,
		"left": xyLeft,
		"width": w,
		"height": h,
		"scrollTop": scTop,
		"scrollLeft": scLeft
	};
};
/**
 * @this {Element}
 * @expose
 * @return {!{width:number,height:number}}
 */
HTMLElement_prototype.dimensions = function() {
	var width = this.offsetWidth,
		height = this.offsetHeight,
		style = this.style,
		styleWidth = style.width,
		styleHeight = style.height,
		bumperWidth = 0,
		bumperHeight = 0;
	style.width = width + "px";
	style.height = height + "px";
	bumperWidth = this.offsetWidth - width;
	bumperHeight = this.offsetHeight - height;
	style.width = styleWidth;
	style.height = styleHeight;
	return {
		"width": width, "height": height,
		"bumperWidth": bumperWidth, "bumperHeight": bumperHeight
	};
};
/**
 * @enum {Object.<string,function():string>}
 */
var DOM_ATTR_READERS = {
	"for": /** @this {Element} */ function() {
		return this.htmlFor;
	},
	"class": /** @this {Element} */ function() {
		return this.className;
	},
};
/**
 * @enum {Object.<string,function(string)>}
 */
var DOM_ATTR_WRITERS = {
	"class": /** @this {Element} */ function(value) {
		this.className = value;
	},
	"innerHTML": /** @this {Element} */ function(value) {
		this.update(value);
	},
	"textContent":/** @this {Element} */ function(value) {
		this.textContent = value;
	},
	"dataset": /** @this {Element} */ function(value) {
		for (var each in value) this.dataset[each] = value[each];
	},
	"style": /** @this {Element} */ function(value) {
		if (typeof value === "string") {
			//	this.style.cssText = value;
			value.split(";").forEach(function(pair) {
				var values = pair.split(":"),
					name = values[0].trim(),
					value = values[1] || "";
				if (name) this[name] = value.trim();
			}, this.style);
			/*
			value.split(";").forEach(function(pair) {
				var values = pair.split(":"),
					name = values[0].trim(),
					value = values[1] || "",
					style = {};
				if (name) {
					style[name] = value;
					this.write("style", style);
				}
			}, this);
			*/
		} else {
			for (var each in value) this.style[each] = value[each];
		}
	},
};
/**
 * @this {Element}
 * @expose
 * @return {string|Function|Object}
 */
HTMLElement_prototype.read = function(name) {
	var reader = DOM_ATTR_READERS[name];
	return reader
		? reader.call(this)
		: name.slice(0, 2) == "on"
			? this[name] || null
			: this.getAttribute(name);
};
/**
 * @this {Element}
 * @expose
 * @return {Element} this
 */
HTMLElement_prototype.write = function(name, value) {
	var writer = DOM_ATTR_WRITERS[name];
	if (writer) writer.call(this, value);
	else if (name.slice(0, 2) == "on") this[name] = value;
	else this.setAttribute(name, value);
	return this;
};

/**
 * @this {Element}
 * @expose
 * @param {!string} propertyName
 * @return {!string}
 */
HTMLElement_prototype.getStyle = function(propertyName) {
	var style = WIN.getComputedStyle(this, null);
	return !style ? "" : style.getPropertyValue(propertyName) || "";
};
/**
 * @this {Element}
 * @expose
 * @param {...string} var_args
 * @return {!boolean}
 */
HTMLElement_prototype.hasClass = function(var_args) {
	return SLICE.call(arguments).some(function(className) {
		return !className ? false : this.contains(className);
	}, this.classList);
};
/**
 * @this {Element}
 * @expose
 * @param {...string} var_args
 * @return {!Element} this
 */
HTMLElement_prototype.addClass = function(var_args) {
	SLICE.call(arguments).forEach(function(className) {
		if (className) this.add(className);
	}, this.classList);
	return this;
};
/**
 * @this {Element}
 * @expose
 * @param {...string} var_args
 * @return {!Element} this
 */
HTMLElement_prototype.removeClass = function(var_args) {
	SLICE.call(arguments).forEach(function(className) {
		if (className) this.remove(className);
	}, this.classList);
	return this;
};
/**
 * @this {Element}
 * @expose
 * @param {...string} var_args
 * @return {!Element} this
 */
HTMLElement_prototype.toggleClass = function(var_args) {
	SLICE.call(arguments).forEach(function(className) {
		if (className) this.toggle(className);
	}, this.classList);
	return this;
};
/**
 * Sets the CSS transform property values separately
 * @this {Element}
 * @expose
 * @param {!string} type
 * @param {string=} values
 * @return {!Element} this
 */
HTMLElement_prototype.setTransform = function(type, values) {
	var dic = (this.style[DOM_TRANSFORM].match(/[a-z3]+\([^)]+\)/gim) || []).toDictionary(function(value) {
		return value.substring(0, value.indexOf("("));
	}, function(value) {
		return value.substring(value.indexOf("(") + 1, value.lastIndexOf(")"));
	});
	if (!values) delete dic[type];
	else dic[type] = values;
	this.style[DOM_TRANSFORM] = OBJECT_EACH(dic, function(value, key) { return key + "(" + value + ")"; }).join(" ");
	return this;
};
/**
 * @this {Element}
 * @expose
 * @param {number=} startIndex
 * @param {number=} endIndex
 */
HTMLElement_prototype.selectText = function(startIndex, endIndex) {
	this.focus();
	if (this.firstChild) {
		var length = this.textContent.length,
			range = DOC.createRange(),
			sel = WIN.getSelection(),
			start = !startIndex || startIndex < 0
				? 0
				: startIndex > length
					? length
					: startIndex,
			end = !endIndex || endIndex > length
				? length
				: endIndex < startIndex
					? startIndex
					: MAX(endIndex, 0);
		range.setStart(this.firstChild, start);
		range.setEnd(this.firstChild, end);
		//	range.collapse(false);	// to move caret to end (true for start)
		sel.removeAllRanges();
		sel.addRange(range);
	}
};

/**
 * 
 */
["on", "once", "off", "fire", "uses", "ask", "query"].forEach(function(name) {
	DOC[name] = WIN[name] = HTMLElement_prototype[name];
});
/**
 *
 * @expose
 * @param {!string} nodeName
 * @param {Object=} attributes
 * @param {Object=} handlers
 */
DOC.element = function(nodeName, attributes, handlers) {
	var elem = DOC.createElement(nodeName);
	if (attributes) for (var name in attributes) elem.write(name, attributes[name]);
	if (handlers) for (var name in handlers) elem.on(name, handlers[name]);
	return elem;
};
/**
 * 
 * @param {string} id
 * @return {HTMLElement}
 */
WIN["$"] = function(id) {
	return DOC.getElementById(id) || null;
};
/**
 * 
 * @param {...string} var_args
 * @return {!Array.<HTMLElement>}
 */
WIN["$$"] = function(var_args) {
	return DOC["query"](parseSelectors(arguments));
};