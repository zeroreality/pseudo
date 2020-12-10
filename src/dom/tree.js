/// <reference path="..\..\blds\pseudo3.js" />

/**
 * An array of keys that can be used with {@link HTMLElement#read} to more easily read property values.
 * @const {Object.<string,function():string>}
 **/
var DOM_ATTR_READERS = {
	"for": /** @this {Element} */ function() {
		return this.htmlFor;
	},
	"class": /** @this {Element} */ function() {
		return this.className;
	},
};
/**
 * An array of keys that can be used with {@link HTMLElement#write} to more easily write property values.
 * @const {Object.<string,function(?)>}
 **/
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
		} else {
			for (var each in value) this.style[each] = value[each];
		}
	},
};

/**
 * Helper for converting strings, numbers, and other literals into HTML by setting innerHTML and getting content.
 * @type {HTMLTemplateElement}
 **/
var DOM_TEMPLATE = WIN["HTMLTemplateElement"]
				? DOC.createElement("template")
				: null;
/**
 * Used internally to add values to a given element.
 * @param {!Node} element
 * @param {*} value
 * @return {!Node} element
 **/
function DOM_ELEMENT_APPENDER(element, value) {
	if (
		// if the value is an Element or DocumentFragment
		// we don't check node because we shouldn't add a Document (child class of Node) in this way
		value instanceof Node
		|| value instanceof DocumentFragment
	) {
		element.appendChild(value);
	} else if (
		// if the value is an array, iterate through and recursively append the items in the array
		OBJECT_IS_ARRAY(value)
	) {
		for (var i = 0, l = value.length; i < l; i++) {
			DOM_ELEMENT_APPENDER(element, value[i]);
		}
	} else if (
		// for values that are not null or undefined
		!OBJECT_IS_NOTHING(value)
	) {
		if (DOM_TEMPLATE) {
			DOM_TEMPLATE.innerHTML = value;
			element.appendChild(DOM_TEMPLATE.content);
		} else {
			element.insertAdjacentHTML("beforeEnd", value.toString());
		}
	}
	// lastly, return the given element.
	return element;
}

/**
 * Removes itself from its parentNode.
 * Throws as exception if it is not a child of any node.
 * @this {Element}
 * @expose
 * @return {!Node} this
 **/
HTMLElement_prototype.amputate = function() {
	return this.parentNode.removeChild(this);
};
/**
 * Replaces iteself with the given node.
 * Throws as exception if it is not a child of any node.
 * @this {Element}
 * @expose
 * @return {!Node} withNode
 **/
HTMLElement_prototype.replace = function(withNode) {
	return this.parentNode.replaceChild(withNode, this);
};
/**
 * Adds all the given arguments as child nodes.
 * Any non-Element given is added as HTML.
 * @this {Element}
 * @expose
 * @param {...*} var_args
 * @return {!Node} this
 **/
HTMLElement_prototype.append = DOM_TEMPLATE
	? function(var_args) {
		this.appendChild(DOM_ELEMENT_APPENDER(DOC.createDocumentFragment(), SLICE.call(arguments)));
		return this;
	}
	: function(var_args) {
		return DOM_ELEMENT_APPENDER(this, SLICE.call(arguments));
	};
/**
 * Adds all the given arguments as child nodes starting at the first-child.
 * Any non-Element given is added as HTML.
 * @this {Element}
 * @expose
 * @param {*} value
 * @param {HTMLElement=} before
 * @return {!Node} this
 **/
HTMLElement_prototype.prepend = function(value, before) {
	throw new Error("not implemented in IE yet");
	this.insertBefore(
		DOM_ELEMENT_APPENDER(DOC.createDocumentFragment(), value),
		before || this.firstChild || null
	);
	return this;
};
/**
 * Removes all child nodes from this element.
 * @this {Element}
 * @expose
 * @return {!Node} this
 **/
HTMLElement_prototype.empty = function() {
	while (this.lastChild) {
		this.removeChild(this.lastChild);
	}
	return this;
};
/**
 * Similar to Element#insertBefore, this method will add the child after the given after node.
 * If no after node is given, it will add the child as the last child node.
 * @this {Element}
 * @expose
 * @param {!Element} child	
 * @param {!Element=} after	
 * @return {!Node} child
 **/
HTMLElement_prototype.insertAfter = function(child, after) {
	if (after && !this.contains(after)) throw "Invalid after node";
	return this.insertBefore(child, !after ? null : after.nextElementSibling || after.nextSibling || null);
};
/**
 * Replaces the contents of this element with the given arguments.
 * Any non-Element given is added as HTML.
 * @this {Element}
 * @expose
 * @param {...*} var_args
 * @return {!Node} this
 **/
HTMLElement_prototype.update = function(var_args) {
	return this.empty().append(SLICE.call(arguments));
};
/**
 * Amputates this element from its parentNode, and adds it to the new parent.
 * If the before is specified, this element will be added as a child of the parent before the given before node.
 * @this {Element}
 * @expose
 * @param {Element} parent
 * @param {Element} before
 * @return {!Node} this
 **/
HTMLElement_prototype.transplant = function(parent, before) {
	return parent.insertBefore(this.amputate(), before || null);
};
/**
 * Returns the element that is a direct descendant of this node from the given ancestor.
 * If no ancestor is given, it will return the descendant of the documentElement.
 * @this {Element}
 * @expose
 * @param {Node=} ancestor
 * @return {Element}
 **/
HTMLElement_prototype.climb = function(ancestor) {
	var child = this;
	if (!ancestor) ancestor = DOC_EL;
	if (!ancestor.contains(child)) throw new Error("ancestor does not contain this element");
	while (child.parentNode !== ancestor) child = child.parentNode;
	return child;
};
/**
 * Creates an object with the left/top pixel offsets, as well as scroll offsets, and optionally calculates based on CSS transform changes too.
 * By default, the offsets are calculated against the documentElement, but an optional ancestor node can be specified.
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
 * Returns an object with the width and height of this Element.
 * Also includes a calculation for the margin, border, and padding (named "bumper").
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
 * Returns the property value for this element's given property name.
 * If the property name starts with "on" (for properties like "onload") then the actual Function is returned.
 * @this {Element}
 * @expose
 * @param {!string} propertyName
 * @return {string|Function|Object}
 */
HTMLElement_prototype.read = function(propertyName) {
	var reader = DOM_ATTR_READERS[propertyName];
	return reader
		? reader.call(this)
		: propertyName.slice(0, 2) === "on"
			? this[propertyName] || null
			: this.getAttribute(propertyName);
};
/**
 * Writes the given value as a attribute or property for this element.
 * @this {Element}
 * @expose
 * @param {!string} propertyName
 * @param {!string|Function|Object} value
 * @return {Element} this
 */
HTMLElement_prototype.write = function(propertyName, value) {
	var writer = DOM_ATTR_WRITERS[propertyName];
	if (writer) writer.call(this, value);
	else if (propertyName.slice(0, 2) === "on") this[propertyName] = value;
	else this.setAttribute(propertyName, value);
	return this;
};

/**
 * Gets the computed style value of the given property name for this element.
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
 * Internally checks the {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/classList|Element#classList} for any of the given class names.
 * Takes multiple arguments and returns true of any match, not all match.
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
 * Takes multiple arguments, and adds all of the given class names to this element.
 * Returns itself.
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
 * Takes multiple arguments, and removes all of the given class names from this element.
 * Returns itself.
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
 * Takes multiple arguments, and either adds or removes all of the given class names from this element.
 * If the given class has already been added to this element, it is removed.  Otherwise, the class is added.
 * Returns itself.
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
 * Sets the CSS transform property values separately.
 * This method allows you to modify a single aspect of the CSS transform without replacing all aspects.
 * For example, you could add a scale() to an element that already has a translate() without needing to get and reset the translate() part of the transform property.
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
 * Selects the textContent of this element.
 * If the start and end index are not specified, then the whole text range is selected.
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
 * These method names are shared between the HTMLElement and the document and the window.
 */
["on", "once", "off", "fire", "uses", "ask", "query"].forEach(function(name) {
	DOC[name] = WIN[name] = HTMLElement_prototype[name];
});
/**
 * A quick way of creating an element in this document.
 * Internally uses {@link Element#write} to add attributes and {@link Element#on} to add event handlers.
 * @expose
 * @param {!string} nodeName
 * @param {Object=} attributes
 * @param {Object=} handlers
 * @return {Element}
 */
DOC.element = function(nodeName, attributes, handlers) {
	var elem = DOC.createElement(nodeName);
	if (attributes) for (var name in attributes) elem.write(name, attributes[name]);
	if (handlers) for (var name in handlers) elem.on(name, handlers[name]);
	return elem;
};
/**
 * Shortcut to getting an element by its id.
 * @param {string} id
 * @return {Element}
 */
WIN["$"] = function(id) {
	return DOC.getElementById(id) || null;
};
/**
 * Shortcut to getting an array of elements by matching CSS queries.
 * @param {...string} var_args
 * @return {!Array.<Element>}
 */
WIN["$$"] = function(var_args) {
	return DOC["query"](DOM_PARSE_SELECTORS(arguments));
};