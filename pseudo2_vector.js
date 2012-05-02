/* ---------------------------------------------------------------------------
 *	Pseudo JavaScript framework, v2.0 (c) 2012 Alex Lein
 *	Pseudo is freely distributable under the terms of an MIT-style license.
 *	For source code and licence, see http://code.google.com/p/pseudo/
 *----------------------------------------------------------------------------
 *	Cross-browser SVG/VML assistant library
 *--------------------------------------------------------------------------*/
"use strict";
(function(){
	var	DOC_ELEM = document.documentElement,
		NAMESPACE = SVG ? "svg" : (function(){
			var supported = false, div, vml;
			div = DOC_ELEM.appendChild(document.createElement("div"));
			div.innerHTML = "<vml:shape id=\"test_vml\" adj=\"1\" />";
			vml = div.firstChild;
			vml.style.behavior = "url(#default#VML)";
			
			supported = vml ? typeof vml.adj === "object" : false;
			
			div.removeChild(vml);
			DOC_ELEM.removeChild(div);
			div = vml = null;
			
			return supported ? "vml" : "none";
		})(),
		SVG = window.SVGElement,
		SVGNS = "http://www.w3.org/2000/svg",
		SVG_PROTO = SVG && SVG.prototype,
		VML = null,
		VMLNS = "urn:schemas-microsoft-com:vml",
		VML_PROTO = {};
	
	if (NAMESPACE === "svg") {
		if (!DOC_ELEM.getAttribute("xmlns:svg")) DOC_ELEM.setAttribute("xmlns:svg",SVGNS);
	} else if (NAMESPACE === "vml") {
		document.namespaces.add("vml",VMLNS);
		document.createStyleSheet().cssText = "vml\\:"+ [
			"arc","background","callout","curve","extrusion","f","formulas","fill","group","h","handles",
			"image","imagedata","line","locks","oval","path","polyline","rect","roundrect","shadow","shape",
			"shapetype","skew","stroke","textbox","textpath","vmlframe"
		].join(",vml\\:") +"{behavior:url(#default#VML);position:absolute;display:inline-block;}";
	};
	return this.Vector = {
		"namespace": SVG ? SVGNS : VMLNS,
		"Element": SVG || VML,
		"Prototype": SVG_PROTO || VML_PROTO,
		
		"addMethods": function addMethods(nodeName,methods) {
			var proto;
			if (!nodeName || nodeName.contains("*")) proto = SVG_PROTO;
			else if (nodeName.contains(",")) {
				var nodeNames = nodeName.split(","), i = 0, l = nodeNames.length;
				for (;i<l;i++) addMethods(nodeNames[i],methods);
				return;
			} else proto = Object.getPrototypeOf(document.vector(nodeName));
			return Pseudo.augment(proto,methods);
		}
	};
}).call(Pseudo);
Pseudo.DOM.addMethods("#document",(function(){
	var	TRANSLATE = function(nodeName) {
		switch (nodeName.toLowerCase()) {
			case "svg": return "div";
			case "ellipse": return "vml:oval";
			case "image": return "vml:image";
			case "rect": return "vml:roundrect";
			case "path": return "vml:path";
			case "polyline": return "vml:polyline";
			case "polygon": return "vml:shape";
			case "text": return "vml:textbox";
			case "textPath": return "vml:textpath";
		};
		throw new Error("unsupported shape");
	};
	return {
		"vector": Pseudo.Vector.Element ? function vectorSVG(nodeName,attributes,handlers) {
			var element = document.createElementNS(nodeName,Pseudo.Vector.namespace);
			return element;
		} : function vectorVML(nodeName,attributes,handlers) {
			var element = document.createElement(TRANSLATE(nodeName));
			return element;
		}
	};
}).call(Pseudo));
Pseudo.Vector.addMethods("*",(function(){
//	PATH_NUMBERS = /-?[.\d]+/gim
	return {
	};
}).call(Pseudo));