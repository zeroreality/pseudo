/* ---------------------------------------------------------------------------
 *  Pseudo JavaScript framework, version 1.1b
 *  (c) 2009 Alex Lein
 *
 *  Pseudo is based heavily on the awesome
 *  Prototype JavaScript framework (c) 2005-2009 Sam Stephenson
 *
 *  Pseudo is freely distributable under the terms of an MIT-style license.
 *  For details, see http://www.opensource.org/licenses/mit-license.php
 *--------------------------------------------------------------------------*/
Object.extend(Pseudo.Draw = {},(function(){
	var	vmlns = "urn:schemas-microsoft-com:vml",
		svgns = "http://www.w3.org/2000/svg",
		PATH_NUMBERS = /-?[.\d]+/gim,
		METHOD = (function(){
			if (document.implementation && Object.isFunction(document.implementation.hasFeature)) {
				if (document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1"))
					return "svg";
			};
			
			var supported = false, div, vml;
			div = document.documentElement.appendChild(document.createElement("div"));
			div.innerHTML = "<vml:shape id=\"test_vml\" adj=\"1\" />";
			vml = div.firstChild;
			vml.style.behavior = "url(#default#VML)";
			
			supported = vml ? typeof vml.adj === "object" : false;
			
			div.removeChild(vml);
			document.documentElement.removeChild(div);
			div = vml = null;
			
			return supported ? "vml" : "none";
		})();
	if (METHOD === "svg") {
		if (!document.documentElement.getAttribute("xmlns:svg")) document.documentElement.setAttribute("xmlns:svg",svgns);
	} else if (METHOD === "vml") {
		document.namespaces.add("vml",vmlns);
		var VML_TAGS = [
			"arc","background","callout","curve","extrusion","f","formulas","fill","group","h","handles","image",
			"imagedata","line","locks","oval","path","polyline","rect","roundrect","shadow","shape","shapetype",
			"skew","stroke","textbox","textpath","vmlframe"
		];
		(function(){
			var style = ["div.vml_canvas,"];
			for (var i=0,l=VML_TAGS.length; i<l; i++) {
				style.push("vml\\:");
				style.push(VML_TAGS[i]);
				if (i+1 !== l) style.push(",");
			};
			style.push("{behavior:url(#default#VML);position:absolute;display:inline-block;}");
			document.createStyleSheet().cssText = style.join("");
		})();
	};
	
	/* -------------------------------------------------------------------- *
	 * path utilities used by both methods (mostly)                         *
	 * -------------------------------------------------------------------- */
	function vmlPathStringFromArray(pointArray) {
		if (!pointArray) return "";
		var string = ["m ",Math.round(pointArray[0].x),",",Math.round(pointArray[0].y)];
		if (pointArray.length > 1) {
			string.push(" l ");
			for (var i=1,l=pointArray.length; i<l; i++) {
				string.push(Math.round(pointArray[i].x));
				string.push(",");
				string.push(Math.round(pointArray[i].y));
				if (i+1 !== l) string.push(", ");
			};
		};
		string.push(" e");
		return string.join("");
	};
	function svgPathStringFromArray(pointArray) {
		if (!pointArray) return "";
		var string = [];
		for (var i=0,l=pointArray.length; i<l; i++) {
			string.push(Math.round(pointArray[i].x));
			string.push(",");
			string.push(Math.round(pointArray[i].y));
			if (i+1 !== l) string.push(" ");
		};
		return string.join("");
	};
	
	function pathArrayFromString(pointString,left,top) {
		if (!pointString) return [];
		left = String(left).toNumber() || 0;
		top = String(top).toNumber() || 0;
		var points = [], matches = pointString.toString().match(PATH_NUMBERS);
		if (matches && matches.length) {
			for (var i=0,l=matches.length; i<l; i+=2) {
				points.push({ "x": matches[i].toNumber()+left, "y": matches[i+1].toNumber()+top });
			};
		};
		return points;
	};
	function pathDimensions(points) {
		if (Object.isString(points)) points = pathArrayFromString(points);
		var dimensions = { "top": 0, "left": 0, "right": 0, "bottom": 0, "width": 0, "height": 0 };
		if (points.length) {
			dimensions.top = points[0].y;
			dimensions.left = points[0].x;
			dimensions.right = points[0].x;
			dimensions.bottom = points[0].y;
			for (var i=1,l=points.length; i<l; i++) {
				if (dimensions.top > points[i].y) dimensions.top = points[i].y;
				if (dimensions.left > points[i].x) dimensions.left = points[i].x;
				if (dimensions.right < points[i].x) dimensions.right = points[i].x;
				if (dimensions.bottom < points[i].y) dimensions.bottom = points[i].y;
			};
		};
		dimensions.width = Math.abs(dimensions.right - dimensions.left);
		dimensions.height = Math.abs(dimensions.bottom - dimensions.top);
		return dimensions;
	};
	function pathAlign(points,dimensions) {
		if (Object.isString(points)) points = pathArrayFromString(points);
		dimensions = dimensions ? dimensions : pathDimensions(points);
		var reduced = [];
		for (var i=0,l=points.length; i<l; i++) {
			reduced.push({
				"x": points[i].x - dimensions.left,
				"y": points[i].y - dimensions.top
			});
		};
		return reduced;
	};
	function pathReduce(points,threshold) {
		threshold = String(threshold).toNumber().abs();
		var reduced = [];
		if (Object.isString(points)) points = pathArrayFromString(points);
		if (points.length) {
			reduced.push({ "x": points[0].x, "y": points[0].y });
			for (var i=1,l=points.length; i<l; i++) {
				var last = points[i-1];
				if (Math.abs(last.x-points[i].x) > threshold || Math.abs(last.y-points[i].y) > threshold) {
					reduced.push({ "x": points[i].x, "y": points[i].y });
				};
			};
		};
		return reduced;
	};
	
	return {
		"VML": METHOD === "vml",
		"SVG": METHOD === "svg",
		"Method": METHOD || "none",
		"namespace": METHOD === "svg" ? svgns : METHOD === "vml" ? vmlns : "",
		"Native": (function(){
			if (METHOD === "vml") return false;
			if (typeof window.SVGSVGElement !== "undefined") return true;
			var svg = document.createElementNS(svgns,"svg"), grp = document.createElementNS(svgns,"g");
			var isSupported = !!(svg.__proto__ && (svg.__proto__ !== grp.__proto__));
			svg = grp = null;
			return isSupported;
		})(),
		
		"pathStringFromArray": METHOD === "svg" ? svgPathStringFromArray : vmlPathStringFromArray,
		"pathArrayFromString": pathArrayFromString,
		"pathDimensions": pathDimensions,
		"pathAlign": pathAlign,
		"pathReduce": pathReduce,
		
		"PATH_NUMBERS": PATH_NUMBERS,
		"LINE_STYLES": { "solid": "solid", "dashed": "dashed", "dotted": "dotted" },
		"CORNER_STYLES": { "inherit": "inherit", "round": "round", "bevel": "bevel", "miter": "miter" },
		"DEFAULT_FILL": { "colour": "#ffffff", "opacity": 1 },
		"DEFAULT_STROKE": { "colour": "#000000", "weight": 1, "opacity": 1, "style": "solid", "corners": "round" }
	};
})());
if (!window.Draw) window.Draw = Pseudo.Draw;

/*****************************************************************************
*** Inheritance OR instance application **************************************
*****************************************************************************/
Object.extend(Draw,function(){
	if (this.Method === "none") return;
	var	slice = Array.prototype.slice,
		unproto = Object.prototype,
		xmlns = "http://www.w3.org/1999/xhtml",
		SHAPENAME_TRANSLATED = this.SVG ? translateSVG : translateVML,
		CREATE_TRANSLATED = this.SVG ? createSVG : createVML,
		COPY_NODE_METHODS = Pseudo.DOM.COPY_NODE_METHODS,
		CLONENODE_EXTENDS = (function(){
			if (Draw.SVG) return;
			var temp1 = document.createElement("vml:oval");
			temp1.__test = function() { return "ok" };
			var temp2 = temp1.cloneNode(true), supported = temp1.__test === temp2.__test;
			temp1 = temp2 = null;
			return supported;
		})(),
		NODE_CLONES = this.NODE_CLONES = {},
		NODE_METHODS_EXTENDED = 0,
		NODE_METHODS = this.NODE_METHODS = {
			"*": this.Native && (function(){
				var item = window.SVGElement, proto;
				if (item && item.prototype) proto = item.prototype;
				// the prototype of my prototype is my friend
				if (!proto) {
					item = window.SVGSVGElement;
					if (item && item.prototype) proto = Object.getPrototypeOf(item.prototype);
				};
				if (!proto) {
					var temp = document.createElementNS(Draw.namespace,"svg");
					item = Object.getPrototypeOf(temp);
					proto = Object.getPrototypeOf(item);
					temp = null;
				};
				item = null;
				return proto;
			})() || {}
		},
		NODE_UNCLONABLES = Object.keys(NODE_METHODS),
		NODE_CLASS_NAMES = {
			// need a decent list here...
		},
		NODE_PROTOTYPE_FINDER = function(shape) {
			// chached?
			shape = String(shape).toLowerCase();
			if (NODE_METHODS[shape]) return NODE_METHODS[shape];
			
			// element proto
			var klass = "SVG"+ NODE_CLASS_NAMES[shape] +"Element";
			if (window[klass]) return NODE_METHODS[shape] = window[klass].prototype;
			klass = "SVG"+ shape +"Element";
			if (window[klass]) return NODE_METHODS[shape] = window[klass].prototype;
			klass = "SVG"+ shape.toLowerCase().capitalize() +"Element";
			if (window[klass]) return NODE_METHODS[shape] = window[klass].prototype;
			
			// last ditch
			var element = CREATE_TRANSLATED(shape);
			var proto = element.__proto__ || element.constructor && element.constructor.prototype;
			element = null;
			if (proto) return NODE_METHODS[shape] = proto;
			
			// sorry
			return NODE_METHODS["*"];
		};
	COPY_NODE_METHODS(NODE_METHODS["*"],Pseudo.DOM.NODE_METHODS["*"]);
	
	
	// create
	function translateDraw(shape) {
		shape = String(shape).toLowerCase();
		if (shape.startsWith("vml:")) shape = shape.substring(4);
		switch (shape) {
			case "canvas":
			case "div":
			case "svg":
			case "vml": return "canvas";
			
			case "circle":
			case "ellipse":
			case "oval": return "ellipse";
			
			case "img":
			case "imgage": return "imgage";
			
			case "rect":
			case "rectangle":
			case "roundrect":
			case "square": return "rect";
			
			case "poly":
			case "polygon":
			case "shape": return "polygon";
			
			case "line":
			case "polyline": return "polyline";
		};
		return shape;
	};
	function translateSVG(shape) {
		switch (shape) {
			case "canvas": return "svg";
		/*
			case "ellipse": return "ellipse";
			case "rect": return "rect";
			case "polygon": return "polygon";
			case "polyline": return "polyline";
		*/
		};
		return shape.toLowerCase();
	};
	function translateVML(shape) {
		switch (shape) {
			case "canvas": return "div";
			case "ellipse": return "vml:oval";
			case "rect": return "vml:roundrect";
			case "polygon": return "vml:shape";
			case "polyline": return "vml:shape";
		};
		return "vml:"+ shape.toLowerCase();
	};
	function createSVG(shape) {
		return document.createElementNS(Draw.namespace,translateSVG(shape));
	};
	function createVML(shape) {
		var element = document.createElement(translateVML(shape));
		element.className = "vml_"+ shape.toLowerCase();
		return element;
	};
	function create(shapeName,attributes,fill,stroke) {
		shapeName = translateDraw(shapeName);
		if (!NODE_CLONES[shapeName]) {
			NODE_CLONES[shapeName] = CREATE_TRANSLATED(shapeName);
			if (!this.Native && CLONENODE_EXTENDS) extend(NODE_CLONES[shapeName]);
		};
		var element = NODE_CLONES[shapeName].cloneNode(true);
		if (!this.Native && !CLONENODE_EXTENDS) extend(element);
		else element.__pseudoID = Pseudo.unique();
		if (attributes) element.writeAttributes(attributes);
		if (fill) element.setFill(fill);
		if (stroke) element.setStroke(stroke);
		return element;
	};
	
	// extender methods
	function extend(element) {
		$A(arguments).flatten().each(extender);
		return element;
	};
	function extender(element) {
	//	if (!Object.isElement(element)) return;
		if (!element || !element.nodeName) return;
		var pseudo = String(element.__pseudoID).toNumber();
		if (!pseudo || pseudo < NODE_METHODS_EXTENDED) {
			var shapeName = translateDraw(element.nodeName);
			if (this.VML && shapeName === "polygon" && element.hasClass("vml_polyline")) shapeName = "polyline";
			COPY_NODE_METHODS(element,NODE_METHODS["*"],NODE_METHODS[shapeName]);
		//	if (methods) Object.expand(element,methods);
		//	Object.expand(element,NODE_METHODS["*"]);
			element.__pseudoID = Pseudo.unique();
		};
		return element;
	};
	
	var ADD_METHODS_REPEATER = function(nodeName) { DOM.addMethods(nodeName,this) };
	function addMethods(shapeNames,methods) {
		if (Object.isString(shapeNames) && shapeNames.contains(",")) {
			shapeNames.split(",").each(ADD_METHODS_REPEATER,methods);
			return NODE_METHODS_EXTENDED;
		} else if (Object.isArray(shapeNames)) {
			nodeName.each(ADD_METHODS_REPEATER,methods);
			return NODE_METHODS_EXTENDED;
		} else if (!shapeNames) {
			shapeNames = "*";
		};
		
		var shapeName = translateDraw(shapeNames);
		if (!NODE_METHODS[shapeName]) {
			if (this.Native) {
				NODE_METHODS[shapeName] = NODE_PROTOTYPE_FINDER(SHAPENAME_TRANSLATED(shapeName));
			} else {
				NODE_METHODS[shapeName] = {};
				if (!NODE_CLONES[shapeName]) {
					NODE_CLONES[shapeName] = CREATE_TRANSLATED(shapeName);
					if (!this.Native && CLONENODE_EXTENDS) extend(NODE_CLONES[shapeName]);
					COPY_NODE_METHODS(NODE_METHODS[shapeName],NODE_CLONES[shapeName]);
				};
			};
		};
		COPY_NODE_METHODS(NODE_METHODS[shapeName],methods);
		
		if (CLONENODE_EXTENDS) {
			if (shapeName === "*") {
				for (var each in NODE_CLONES) {
					if (NODE_UNCLONABLES.contains(each)) continue;
					COPY_NODE_METHODS(NODE_CLONES[each],methods);
				};
			} else {
				COPY_NODE_METHODS(NODE_CLONES[shapeName],methods);
			};
		};
		
		return NODE_METHODS_EXTENDED = Pseudo.unique();
	};
	
	if (this.SVG) {
		var canvas = NODE_CLONES["canvas"] = document.createElementNS(this.namespace,"svg");
		canvas.style.position = "absolute";
		canvas.setAttribute("version","1.1");
		canvas.setAttribute("overflow","visible");
	//	canvas.setAttribute("xmlns:xlink","http://www.w3.org/1999/xlink");
	} else if (this.VML) {
	//	NODE_CLONES["canvas"] = DOM.create("div",{ "class": "vml_canvas" });
	//	if (CLONENODE_EXTENDS) extend(NODE_CLONES["canvas"]);
	};
	
	// exposed methods
	return {
	//	"create": this.Native ? createNative : CLONENODE_EXTENDS ? createCloned : createInstance,
	//	"addMethods": this.Native ? addPrototypes : addInstanceMethods,
		"create": create,
		"addMethods": addMethods,
		"extend": this.Native ? Pseudo.um : extend,
		"extender": extender
	};
}.call(Draw));

/*****************************************************************************
*** General helper methods ***************************************************
*****************************************************************************/
Draw.addMethods("*",function(){
	if (this.Method === "none") return;
	var COLOUR_COLOR = function(style) {
		if (!style["color"] && style["colour"]) style["color"] = style["colour"];
		if (style["color"] && !style["colour"]) style["colour"] = style["color"];
		return style;
	};

	
	/* -------------------------------------------------------------------- *
	 * VML                                                                  *
	 * -------------------------------------------------------------------- */
	// http://msdn.microsoft.com/en-us/library/bb263898(VS.85).aspx
	var	VML_TRANSFORM_MATRIX = /progid\:DXImageTransform\.Microsoft\.Matrix\((.+)\)/im,
		VML_LINE_STYLES = { "inherit": "inherit", "solid": "solid", "dashed": "dash", "dotted": "dot" },
		VML_CORNER_STYLES = { "inherit": "inherit", "round": "round", "bevel": "bevel", "miter": "miter" },
		VML_LINECAP_STYLES = { "round": "round", "bevel": "flat", "miter": "square" },
		//http://dean.edwards.name/weblog/2009/10/convert-any-colour-value-to-hex-in-msie/
		VML_COLOUR_TOHEX = function(color) {
			var body = createPopup().document.body, range = body.createTextRange();
			body.style.color = color;
			var value = range.queryCommandValue("ForeColor");
			value = ((value & 0x0000ff) << 16) | (value & 0x00ff00) | ((value & 0xff0000) >>> 16);
			value = value.toString(16);
			return "#000000".slice(0, 7 - value.length) + value;
		};
	
	/* -------------------------------------------------------------------- *
	 * Global utility functions                                             *
	 * -------------------------------------------------------------------- */
	function vmlGetFill() {
		var style = { "colour": "", "opacity": 1 };
		var fill = this.getElementsByTagName("fill")[0];
		if (fill) {
			style.colour = String(fill.color);
			style.opacity = String(fill.opacity).toNumber().round(4);
			if (!style.colour.startsWith("#")) style.colour = VML_COLOUR_TOHEX(style.colour);
		};
		return COLOUR_COLOR(style);
	};
	function vmlSetFill(style) {
		if (!style) return this;
		COLOUR_COLOR(style);
		var fill = this.getElementsByTagName("fill")[0] || this.appendChild(document.createElement("vml:fill"));
		if ("colour" in style)		fill.color = style.colour;
		if ("opacity" in style)		fill.opacity = style.opacity;
		return this;
	};
	function vmlGetStroke() {
		var style = { "colour": "", "weight": 0, "opacity": 0, "corners": "", "dashes": "", "corners": "" };
		var stroke = this.getElementsByTagName("stroke")[0];
		if (stroke) {
			if (stroke.color)		style.colour = String(stroke.color);
			if (stroke.weight)		style.weight = parseFloat(stroke.weight);
			if (stroke.opacity)		style.opacity = parseFloat(stroke.opacity);
			if (stroke.dashstyle)	style.dashes = VML_LINE_STYLES[stroke.dashstyle];
			if (stroke.joinstyle)	style.corners = VML_CORNER_STYLES[stroke.joinstyle];
			if (!style.colour.startsWith("#")) style.colour = VML_COLOUR_TOHEX(style.colour);
		};
		return COLOUR_COLOR(style);
	};
	function vmlSetStroke(style) {
		if (!style) return this;
		var stroke = this.getElementsByTagName("stroke")[0] || this.appendChild(document.createElement("vml:stroke"));
		COLOUR_COLOR(style);
		if (style.colour) stroke.color = style.colour;
		if (style.opacity || style.opacity === 0) stroke.opacity = parseFloat(style.opacity);
		if (style.weight || style.weight === 0) stroke.weight = parseFloat(style.weight) +"px";
		if (style.dashes && style.dashes in VML_LINE_STYLES) stroke.dashstyle = VML_LINE_STYLES[style.dashes];
		if (style.corners && style.dashes in VML_CORNER_STYLES) {
			stroke.joinstyle = VML_CORNER_STYLES[style.corners];
			stroke.endcap = VML_LINECAP_STYLES[style.corners];
		};
		return this;
	};
	
	function vmlGetRotation() {
		var degrees = 0, filter = this.style.filter.match(VML_TRANSFORM_MATRIX);
		if (filter) {
			var cos = (filter[1].match(/M11=[\.0-9]+/i) || ["M11=0"])[0].substring(4).toNumber();
			degrees = Math.acos(cos) * Math.RadiansToDegrees;
		};
		return degrees;
	};
	function vmlSetRotation(degrees) {
		var filter = this.style.filter.remove(VML_TRANSFORM_MATRIX), radians = degrees * Math.DegreesToRadians;
		var cos = Math.cos(radians), sin = Math.sin(radians);
		this.style.filter = [filter," progid:DXImageTransform.Microsoft.Matrix(M11=",cos,",M12=",-sin,",M21=",sin,",M22=",cos,")"].join("");
		return this;
	};
	function vmlGetScale() {
		
	};
	function vmlSetScale(percent) {
		
	};
	
	/* -------------------------------------------------------------------- *
	 * SVG                                                                  *
	 * -------------------------------------------------------------------- */
	// http://www.zvon.org/xxl/svgReference/Output/
//	var SVG_TRANSFORM_MATRIX = /matrix\((.+?)\)/;
	var SVG_TRANSFORM_ROTATE = /rotate\((.+?)\)/;
//	var SVG_TRANSFORM_SCALE = /scale\((.+?)\)/;
//	var SVG_TRANSFORM_SKEWX = /skewX\((.+?)\)/;
//	var SVG_TRANSFORM_SKEWY = /skewY\((.+?)\)/;
//	var SVG_TRANSFORM_TRANSLATE = /translate\((.+?)\)/;
	var SVG_LINE_STYLES = {
		"solid": function() { return "" },
		"dashed": function(weight) { return [weight*4,weight*3].join(",") },
		"dotted": function(weight) { return [weight*(2/5),weight*(18/5)].join(",") }
	};
	var SVG_CORNER_STYLES = {
		"inherit": "inherit",
		"round": "round",
		"bevel": "bevel",
		"miter": "miter"
	};
	var SVG_LINECAP_STYLES = {
		"inherit": "inherit",
		"round": "round",
		"bevel": "butt",	// "butt" can be too narrow
		"miter": "square"
	};
	
	/* -------------------------------------------------------------------- *
	 * Global utility functions                                             *
	 * -------------------------------------------------------------------- */
	function svgGetFill() {
		return COLOUR_COLOR({
			"colour": this.getAttribute("fill"),
			"opacity": this.getAttribute("fill-opacity")
		});
	};
	function svgSetFill(style) {
		if (!style) return this;
		COLOUR_COLOR(style);
		if (style.colour) this.setAttribute("fill",style.colour);
		if (style.opacity || style.opacity === 0) this.setAttribute("fill-opacity",style.opacity);
		return this;
	};
	function svgGetStroke() {
		return COLOUR_COLOR({
			"colour": this.getAttribute("stroke") || "",
			"opacity": this.getAttribute("stroke-opacity") || "",
			"weight": (this.getAttribute("stroke-width") || "0").toNumber() || 0,
			"corners": SVG_CORNER_STYLES[this.getAttribute("stroke-linejoin")] || "",
			"dashes": this.getAttribute("stroke-dasharray") || ""
		});
	};
	function svgSetStroke(style) {
		if (!style) return this;
		COLOUR_COLOR(style);
		if (style.colour) this.setAttribute("stroke",style.colour);
		if (style.opacity || style.opacity === 0) this.setAttribute("stroke-opacity",style.opacity);
		if (style.weight || style.weight === 0) this.setAttribute("stroke-width",style.weight +"px");
		if (style.corners && style.corners in SVG_CORNER_STYLES) {
			this.setAttribute("stroke-linejoin",SVG_CORNER_STYLES[style.corners]);
			this.setAttribute("stroke-linecap",SVG_LINECAP_STYLES[style.corners]);
		};
		if (style.dashes && Object.isFunction(SVG_LINE_STYLES[style.dashes])) {
			this.setAttribute("stroke-dasharray",SVG_LINE_STYLES[style.dashes](style.weight));
		};
		return this;
	};
	function svgGetRotation() {
		var transform = (this.getAttribute("transform") || "").match(SVG_TRANSFORM_ROTATE);
		var rotate = transform ? transform[1].match(Draw.PATH_NUMBERS) : [""];
		var rotation = { "degrees": rotate[0].toNumber() };
		if (rotate.length > 1) rotation.pivot = { "x": rotate[1].toNumber(), "y": rotate[2].toNumber() };
		return rotation;
	};
	function svgSetRotation(degrees) {
		var transform = (this.getAttribute("transform") || "").remove(SVG_TRANSFORM_ROTATE);
		if (degrees) transform += " rotate("+ degrees +")";//,"+ pivot.x +","+ pivot.y +")";
		this.setAttribute("transform",transform.trim());
		return this;
	};
	function svgGetScale() {
	};
	function svgSetScale(percent) {
	};
	
	return {
	/*
		"coordinates": function() {
			var box = this.getBBox();
			return { "top": box.y, "left": box.x };
		},
		"dimensions": function() {
			var box = this.getBBox();
			return { "width": box.width, "height": box.height };
		}
	*/
	//	"getScale": this.SVG ? svgGetScale : vmlGetScale,			// ### not working yet ###
	//	"setScale": this.SVG ? svgSetScale : vmlSetScale,			// ### not working yet ###
	//	"getGradient": this.SVG ? svgGetGradient : vmlGetGradient,
	//	"setGradient": this.SVG ? svgSetGradient : vmlSetGradient,
		"getFill": this.SVG ? svgGetFill : vmlGetFill,
		"setFill": this.SVG ? svgSetFill : vmlSetFill,
		"getStroke": this.SVG ? svgGetStroke : vmlGetStroke,
		"setStroke": this.SVG ? svgSetStroke : vmlSetStroke,
		"getRotation": this.SVG ? svgGetRotation : vmlGetRotation,
		"setRotation": this.SVG ? svgSetRotation : vmlSetRotation	// ### unable to set pivot point, resizing not-standard ###
	};
}.call(Draw));

/*****************************************************************************
*** General helper methods ***************************************************
*****************************************************************************/
Draw.addMethods("canvas",function(){
	function vmlGetCanvasCoords() {
		var dimensions = {
			"left": this.style.left.toNumber() || 0,
			"top": this.style.top.toNumber() || 0,
			"width": this.style.width.toNumber() || 0,
			"height": this.style.height.toNumber() || 0
		};
		dimensions.width = Math.abs(dimensions.right) - Math.abs(dimensions.left);
		dimensions.height = Math.abs(dimensions.bottom) - Math.abs(dimensions.top);
		return dimensions;
	};
	function vmlSetCanvasCoords(left,top,width,height) {
		this.style.left = left +"px";
		this.style.top = top +"px";
		this.style.width = width +"px";
		this.style.height = height +"px";
		this.style.clip = "rect(0px, "+ width +"px, "+ height +"px, 0px)";
		return this;
	};
	function vmlGetCanvasChildrenCoords() {
	};
	function vmlShrinkCanvasCoords() {
	};
	
	function svgGetCanvasCoords() {
		var dimensions = {
			"left": this.style.left.toNumber() || 0,
			"top": this.style.top.toNumber() || 0,
			"width": (this.getAttribute("width") || "0").toNumber(),
			"height": (this.getAttribute("height") || "0").toNumber()
		};
		dimensions.right = dimensions.width - dimensions.left;
		dimensions.bottom = dimensions.height - dimensions.top;
		return dimensions;
	};
	function svgSetCanvasCoords(left,top,width,height) {
	//	this.setAttribute("x",left);
	//	this.setAttribute("y",top);
		this.style.left = left +"px";
		this.style.top = top +"px";
		this.setAttribute("width",width +"px");
		this.setAttribute("height",height +"px");
		this.setAttribute("viewBox","0 0 "+ width +" "+ height);
		return this;
	};
	function svgGetCanvasChildrenCoords() {
	};
	function svgShrinkCanvasCoords() {
	};

	return {
		"getCoords": this.SVG ? svgGetCanvasCoords : vmlGetCanvasCoords,
		"setCoords": this.SVG ? svgSetCanvasCoords : vmlSetCanvasCoords,
		"childrenSize": this.SVG ? svgGetCanvasChildrenCoords : vmlGetCanvasChildrenCoords,
		"shrinkToFit": this.SVG ? svgShrinkCanvasCoords : vmlShrinkCanvasCoords
	};
}.call(Draw));
Draw.addMethods("rect",function(){
	/* -------------------------------------------------------------------- *
	 * Rounded-Corner Rectangle                                             *
	 * -------------------------------------------------------------------- *
		http://msdn.microsoft.com/en-us/library/bb229521(VS.85).aspx
		<vml:roundrect arcsize="5%" style="width:100px;height:100px;" />
		arcsize:	percentage
	 * -------------------------------------------------------------------- */
	function vmlGetRectCoords() {
		var dimensions = {
			"left": this.style.left.toNumber() || 0,
			"top": this.style.top.toNumber() || 0,
			"width": this.style.width.toNumber() || 0,
			"height": this.style.height.toNumber() || 0
		};
		dimensions.right = dimensions.width - dimensions.left;
		dimensions.bottom = dimensions.height - dimensions.top;
		return dimensions;
	};
	function vmlSetRectCoords(left,top,width,height) {
		this.style.left = left +"px";
		this.style.top = top +"px";
		this.style.width = width +"px";
		this.style.height = height +"px";
		return this;
	};
	function vmlGetRectSize() {
		return {
			"width": this.style.width.toNumber() || 0,
			"height": this.style.height.toNumber() || 0
		};
		return this;
	};
	function vmlSetRectSize(width,height) {
		this.style.width = width +"px";
		this.style.height = height +"px";
		return this;
	};
	function vmlGetRectPosition() {
		return {
			"left": this.style.left.toNumber() || 0,
			"top": this.style.top.toNumber() || 0
		};
	};
	function vmlSetRectPosition(left,top) {
		this.style.left = left +"px";
		this.style.top = top +"px";
		return this;
	};
	function vmlGetRectCorners() {
		var rounding = this.arcsize.toNumber() || 0;
		if (Math.abs(rounding) > 1) rounding /= 100;
		return rounding;
	};
	function vmlSetRectCorners(rounding) {
		if (Math.abs(rounding) <= 1) rounding *= 100;
		this.arcsize = rounding +"%";
		return this;
	};
	
	/* -------------------------------------------------------------------- *
	 * Rounded-Corner Rectangle                                             *
	 * -------------------------------------------------------------------- *
		http://www.zvon.org/xxl/svgReference/Output/el_rect.html
		<svg:rect rx="50" x="0" y="0" width="100" height="100" />
		rx:		percentage
	 * -------------------------------------------------------------------- */
	function svgGetRectCoords() {
		var dimensions = {
			"left": this.getAttribute("x").toNumber() || 0,
			"top": this.getAttribute("y").toNumber() || 0,
			"width": this.getAttribute("width").toNumber() || 0,
			"height": this.getAttribute("height").toNumber() || 0
		};
		dimensions.right = dimensions.width - dimensions.left;
		dimensions.bottom = dimensions.height - dimensions.top;
		return dimensions;
	};
	function svgSetRectCoords(left,top,width,height) {
		this.setAttribute("x",left);
		this.setAttribute("y",top);
		this.setAttribute("width",width +"px");
		this.setAttribute("height",height +"px");
		return this;
	};
	function svgGetRectSize() {
		return {
			"width": this.getAttribute("width").toNumber() || 0,
			"height": this.getAttribute("height").toNumber() || 0
		};
	};
	function svgSetRectSize(width,height) {
		this.setAttribute("width",width +"px");
		this.setAttribute("height",height +"px");
		return this;
	};
	function svgGetRectPosition() {
		return {
			"left": this.getAttribute("x").toNumber() || 0,
			"top": this.getAttribute("y").toNumber() || 0
		};
	};
	function svgSetRectPosition(left,top) {
	//	this.setAttribute("x",left);
	//	this.setAttribute("y",top);
		return this;
	};
	function svgGetRectCorners() {
		var rounding = (this.getAttribute("rx") || "0").toNumber() * 2;
		if (Math.abs(rounding) > 1) rounding /= 100;
		return rounding;
	};
	function svgSetRectCorners(rounding) {
		if (Math.abs(rounding) > 1) rounding /= 100;
		if (Math.abs(rounding) <= 1) rounding *= 10;	// not percent, perdec? it works
		this.setAttribute("rx", (rounding*2) +"%");
		return this;
	};
	
	return {
		"getCoords": this.SVG ? svgGetRectCoords : vmlGetRectCoords,
		"setCoords": this.SVG ? svgSetRectCoords : vmlSetRectCoords,
		"getCorners": this.SVG ? svgGetRectCorners : vmlGetRectCorners,
		"setCorners": this.SVG ? svgSetRectCorners : vmlSetRectCorners,
		"getSize": this.SVG ? svgGetRectSize : vmlGetRectSize,
		"setSize": this.SVG ? svgSetRectSize : vmlSetRectSize,
		"getPosition": this.SVG ? svgGetRectPosition : vmlGetRectPosition,
		"setPosition": this.SVG ? svgSetRectPosition : vmlSetRectPosition
	};
}.call(Draw));
Draw.addMethods("oval",function(){
	/* -------------------------------------------------------------------- *
	 * Circle/Oval/Ellipse                                                  *
	 * -------------------------------------------------------------------- *
		http://msdn.microsoft.com/en-us/library/bb229516(VS.85).aspx
		<vml:oval style="top:0px;left:0px;width:100px;height:100px" />
	 * -------------------------------------------------------------------- */
	// same as rect
	function svgGetOvalCoords() {
	/*
		### not working ################################
	*/
		var cx = (this.getAttribute("cx") || "0").toNumber() || 0;
		var cy = (this.getAttribute("cx") || "0").toNumber() || 0;
		var rx = (this.getAttribute("cx") || "0").toNumber() || 0;
		var ry = (this.getAttribute("cx") || "0").toNumber() || 0;
		
		var dimensions = {
			"left": cx-rx,
			"top": cy-ry,
			"width": rx*2,
			"height": ry*2
		};
		dimensions.right = dimensions.width - dimensions.left;
		dimensions.bottom = dimensions.height - dimensions.top;
		return dimensions;
	};
	function svgSetOvalCoords(left,top,width,height) {
		this.setAttribute("cx",(left+(width/2)) +"px");
		this.setAttribute("cy",(top+(height/2)) +"px");
		this.setAttribute("rx",(width/2) +"px");
		this.setAttribute("ry",(height/2) +"px");
		return this;
	};
	function svgGetOvalSize() {
		var coords = getCircleCoords(this);
		return {
			"width": coords.width,
			"height": coords.height
		};
	};
	function svgSetOvalSize(width,height) {
		var coords = getCircleCoords(this);
		this.setAttribute("cx",(coords.left+(width/2)) +"px");
		this.setAttribute("cy",(coords.top+(height/2)) +"px");
		this.setAttribute("rx",(width/2) +"px");
		this.setAttribute("ry",(height/2) +"px");
		return this;
	};
	function svgGetOvalPosition() {
		var coords = getCircleCoords(this);
		return {
			"left": coords.left,
			"top": coords.top
		};
	};
	function svgSetOvalPosition(left,top) {
		var coords = getCircleCoords(this);
		this.setAttribute("cx",(left+(coords.width/2)) +"px");
		this.setAttribute("cy",(top+(coords.height/2)) +"px");
		this.setAttribute("rx",(width/2) +"px");
		this.setAttribute("ry",(height/2) +"px");
		return this;
	};
	
	return {
		"getCoords": this.SVG ? svgGetOvalCoords : this.NODE_METHODS["rect"].getCoords,
		"setCoords": this.SVG ? svgSetOvalCoords : this.NODE_METHODS["rect"].setCoords,
		"getSize": this.SVG ? svgGetOvalSize : this.NODE_METHODS["rect"].getSize,
		"setSize": this.SVG ? svgSetOvalSize : this.NODE_METHODS["rect"].setSize,
		"getPosition": this.SVG ? svgGetOvalPosition : this.NODE_METHODS["rect"].getPosition,
		"setPosition": this.SVG ? svgSetOvalPosition : this.NODE_METHODS["rect"].setPosition
	};
}.call(Draw));
Draw.addMethods("line",function(){
	/* -------------------------------------------------------------------- *
	 * Polyline                                                             *
	 * -------------------------------------------------------------------- *
		http://msdn.microsoft.com/en-us/library/bb263897(VS.85).aspx
		<vml:shape path="m 20,0 l 80,0,100,100,0,100 xe" />
		m: moveto		starting position
		l: lineto		draws a line between points (only needed after the first moveto)
		e: endline	ends Draw (can be followed by moveto to draw new shape within same element)
	 * -------------------------------------------------------------------- */
	function vmlGetLinePath() {
		var path = this.getElementsByTagName("path")[0];
		return path ? Draw.pathArrayFromString(path.v,this.style.left,this.style.top) : [];
	};
	function vmlSetLinePath(points) {
		if (!points) return this;
		if (Object.isString(points)) points = Draw.pathArrayFromString(points);
		var dims = Draw.pathDimensions(points);
		var path = this.getElementsByTagName("path")[0] || this.appendChild(document.createElement("vml:path"));
		
		this.coordorigin = "0 0";
		this.coordsize = dims.width +" "+ dims.height;
		this.style.left = dims.left +"px";
		this.style.top = dims.top +"px";
		this.style.width = dims.width +"px";
		this.style.height = dims.height +"px";
		path.v = Draw.pathStringFromArray(Draw.pathAlign(points,dims));
		return this;
	};
	
	
	/* -------------------------------------------------------------------- *
	 * Polyline                                                             *
	 * -------------------------------------------------------------------- *
		http://www.zvon.org/xxl/svgReference/Output/el_polyline.html
		<svg:polyline points="20,0 80,0 100,100 0,100" />
	 * -------------------------------------------------------------------- */
	function svgGetLinePath() {
		return Draw.pathArrayFromString(this.getAttribute("points"));
	};
	function svgSetLinePath(points) {
		if (!points) return this;
		if (Object.isString(points)) points = Draw.pathArrayFromString(points);
		if (Object.isArray(points)) points = Draw.pathStringFromArray(points);
		this.setAttribute("points",points);
		return this;
	};
	
	return {
		"getPath": this.SVG ? svgGetLinePath : vmlGetLinePath,
		"setPath": this.SVG ? svgSetLinePath : vmlSetLinePath
	};
}.call(Draw));
Draw.addMethods("poly",function(){
	/* -------------------------------------------------------------------- *
	 * Polygon                                                              *
	 * -------------------------------------------------------------------- *
		http://msdn.microsoft.com/en-us/library/bb263897(VS.85).aspx
		<vml:shape path="m 20,0 l 80,0,100,100,0,100 xe" />
		m: moveto		starting position
		l: lineto		draws a line between points (only needed after the first moveto)
		x: close		closes the shape (no need to add the last point with same xy and first point)
		e: endline	ends Draw (can be followed by moveto to draw new shape within same element)
	 * -------------------------------------------------------------------- */
	function vmlSetPolyPath(points) {
		if (!points) return this;
		if (Object.isString(points)) points = Draw.pathArrayFromString(points);
		var dims = Draw.pathDimensions(points);
		var path = this.getElementsByTagName("path")[0] || this.appendChild(document.createElement("vml:path"));
		
		this.coordorigin = "0 0";
		this.coordsize = dims.width +" "+ dims.height;
		this.style.left = dims.left +"px";
		this.style.top = dims.top +"px";
		this.style.width = dims.width +"px";
		this.style.height = dims.height +"px";
		path.v = Draw.pathStringFromArray(Draw.pathAlign(points,dims)).right(-2) +"xe";
		return this;
	};
	
	/* -------------------------------------------------------------------- *
	 * Polygon                                                              *
	 * -------------------------------------------------------------------- *
		http://www.zvon.org/xxl/svgReference/Output/el_polygon.html
		<svg:polygon points="20,0 80,0 100,100 0,100" />
	 * -------------------------------------------------------------------- */
	// same as polyline
	
	return {
		"getPath": this.NODE_METHODS["polyline"].getPath,
		"setPath": this.SVG ? this.NODE_METHODS["polyline"].setPath : vmlSetPolyPath
	};
}.call(Draw));
/*
Draw.addMethods("image",function(){
	/* -------------------------------------------------------------------- *
	 * Image                                                                *
	 * -------------------------------------------------------------------- *
		http://msdn.microsoft.com/en-us/library/bb263897(VS.85).aspx
		<vml:image src="path/file.ext" />
	 * -------------------------------------------------------------------- *
	function vmlGetImageSource() {
		return this.src;
	};
	function vmlSetImageSource(source) {
		this.src = source;
		return this;
	};
	
	/* -------------------------------------------------------------------- *
	 * Image                                                                *
	 * -------------------------------------------------------------------- *
		http://www.zvon.org/xxl/svgReference/Output/el_image.html
		<svg:image xlink:href="path/file.ext" x="0" y="0" width="100" height="100" />
	 * -------------------------------------------------------------------- *
	function svgGetImageSource() {
		return this.getAttribute("xlink:href");
	};
	function svgSetImageSource(source) {
		this.setAttribute("xlink:href",source);
		return this;
	};
	
	return {
		"getSrc": this.SVG ? svgGetImageSource : vmlGetImageSource,
		"setSrc": this.SVG ? svgSetImageSource : vmlSetImageSource
	};
}.call(Draw));
*/