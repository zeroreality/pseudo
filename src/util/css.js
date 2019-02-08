/// <reference path="..\..\blds\pseudo3.js" />

//#region CSS
/**
 * @namespace
 * @expose
 */
ns.CSS = {
	"parseTime": CSS_TIME,
	"hexColour": CSS_HEX,
	"contrast": CSS_CONTRAST,
	"dark": CSS_DARK,
};

/**
 * Parses a CSS time value into milliseconds
 * @param {string} value
 * @return {number} milliseconds
 */
function CSS_TIME(value) {
	var num = FLOAT(value);
	if (value.endsWith("ms")) {
		// nothing
	} else if (value.endsWith("s")) {
		num *= 1000;
	};
	return ROUND(num);
}

/**
 * Parses a CSS colour string into a hex colour string
 * @param {string} input
 * @return {string}
 */
function CSS_HEX(input) {
	var output = "#";
	if (input[0] === "#") {
		if (input.length !== 4) {
			output = (input + "000000").substring(0, 7);
		} else {
			var values = input.split("");
			for (var i = 1; i < 4; i++) output += ("0" + INT(values[i] + values[i], 16).toString(16)).right(2);
		}
	} else {
		var kind = input.substring(0, input.indexOf("(")),
			values = input.substring(kind.length + 1).split(",");
		switch (kind) {
			case "rgb":
			case "rgba":
				for (var i = 0; i < 3; i++) output += ("0" + INT(values[i].trim(), 10).toString(16)).right(2);
				break;
			case "hsv":
			case "hsva":
				var h = (FLOAT(values[0]) / 360) * 6,
					s = FLOAT(values[1]) / 100,
					v = FLOAT(values[2]) / 100,
					i = FLOOR(h),
					f = h - i,
					p = v * (1 - s),
					q = v * (1 - f * s),
					t = v * (1 - (1 - f) * s),
					r = [v, q, p, p, t, v],
					g = [t, v, v, q, p, p],
					b = [p, p, t, v, v, q],
					m = i % 6;
				output += (r[m] * 255).toString(16);
				output += (g[m] * 255).toString(16);
				output += (b[m] * 255).toString(16);
				break;
			//	case "hsl":
			//	case "hsla":
			//		break;
		}
	}
	return output;

}

/**
 * Returns a number between 0 and 255 indicating darkness
 * @param {!string} colour
 * @return {!number}
 */
function CSS_CONTRAST(colour) {
	var hex = CSS_HEX(colour),
		r = INT(hex.substr(1, 2), 16),
		g = INT(hex.substr(3, 2), 16),
		b = INT(hex.substr(5, 2), 16),
		yiq = ((r * 299) + (g * 587) + (b * 114)) / (299 + 587 + 114);
	return yiq;
	/*
		y = (r * 0.299) + (g * 0.587) + (b * 0.114),
		i = (r * 0.596) - (g * 0.274) - (b * 0.322),
		q = (r * 0.211) - (g * 0.523) + (b * 0.312);
	return y + i + q;
	/*
		y = (r * 0.299) + (g * 0.587) + (b * 0.114),
		u = (r * - 0.14713) - (g * 0.28886) + (b * 0.43599),
		v = (r * 0.615) - (g * 0.51499) - (b * 0.10001);
	return y + u + v;
	*/
}
/**
 * Returns true when this is a dark colour
 * @param {string} colour
 * @return {boolean}
 */
function CSS_DARK(colour) {
	//	return INT(CSS_HEX(colour).substring(1), 16) > 0xffffff / 2;
	//	return CSS_CONTRAST(colour) < 96.5;
	return CSS_CONTRAST(colour) < 128;
	/*
	var hex = CSS_HEX(colour),
		r = INT(hex.substr(1, 2), 16) / 255,
		g = INT(hex.substr(3, 2), 16) / 255,
		b = INT(hex.substr(5, 2), 16) / 255,
	//	y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722),
		y = r + g + b,
		l = 116 * y ^ 1 / 3;// - 16;
	//	console.log(y, l);
	return l < 120;
	*/
	/*
		r = INT(hex.substr(1, 2), 16) / 255,
		g = INT(hex.substr(3, 2), 16) / 255,
		b = INT(hex.substr(5, 2), 16) / 255,
		min = MIN(r, g, b),
		max = MAX(r, g, b);
//	console.log(max, min, (max + min) / 2);
	return (max + min) / 2 < 0.8;
	*/
	/*
		r = INT(hex.substr(1, 2), 16) / 255,
		g = INT(hex.substr(3, 2), 16) / 255,
		b = INT(hex.substr(5, 2), 16) / 255,
		k = 1 - MIN(r, g, b),
		c = (1 - r - k) / (1 - k),
		m = (1 - g - k) / (1 - k),
		y = (1 - b - k) / (1 - k);
//	console.log(c, m, y, k);
	return k >= 0.8;
	*/
	/*
		p = 255 * 0.43,
		r = INT(hex.substr(1, 2), 16) > p ? 1 : 0,
		g = INT(hex.substr(3, 2), 16) > p ? 1 : 0,
		b = INT(hex.substr(5, 2), 16) > p ? 1 : 0;
	console.log(
		INT(hex.substr(1, 2), 16),
		INT(hex.substr(3, 2), 16),
		INT(hex.substr(5, 2), 16)
	);
	return r + b + g > 1;
	*/
	/*
		p = 255 * 0.43,
		r = INT(hex.substr(1, 2), 16) ,
		g = INT(hex.substr(3, 2), 16) ,
		b = INT(hex.substr(5, 2), 16) ;
	console.log(r, g, b);
	return r < p || g < p || b < p;
	*/
}
//#endregion CSS

//#region CSS Transforms
/**
 * Translate(3D) function for CSS Transform
 * @constructor
 * @param {!string} kind
 * @param {Array.<string>=} values
 */
function CSSTransformTranslate(kind, values) {
	//translate(xy) => translate(xy, xy)
	//translateX(x) => translate(x, 0)
	//translateX(y) => translate(0, y)
	//translateZ(z) => translate3d(0, 0, z)
	this.x = "";
	this.y = "";
	this.z = "";
}
/**
 * Creates a string representation of the CSS function
 * @this {CSSTransformTranslate}
 * @override
 */
CSSTransformTranslate[PROTOTYPE].toString = function() {
	var is2d = !FLOAT(this.z);
	return "translate" + (is2d ? "" : "3d")
		+ "("
		+ this.x + "," + this.y
		+ (is2d ? "" : "," + this.z)
		+ ")";
}
/**
 * Rotate(3D) function for CSS Transform
 * @constructor
 * @param {!string} kind
 * @param {Array.<string>=} values
 */
function CSSTransformRotate(kind, values) {
	//rotate(a)
	//rotate3d(x, y, z, a)
	//rotateX(a) => rotate3d(1, 0, 0, a);
	//rotateY(a) => rotate3d(0, 1, 0, a);
	//rotateZ(a) => rotate3d(0, 0, 1, a);

	this.x = NaN;
	this.y = NaN;
	this.z = NaN;
	this.angle = "";
}
/**
 * Creates a string representation of the CSS function
 * @this {CSSTransformRotate}
 * @override
 */
CSSTransformRotate[PROTOTYPE].toString = function() {
	var is2d = !FLOAT(this.z);
	return "translate" + (is2d ? "" : "3d")
		+ "("
		+ this.x + "," + this.y
		+ (is2d ? "" : "," + this.z)
		+ ")";
}
/**
 * Scale(3D) function for CSS Transform
 * @constructor
 * @param {!string} kind
 * @param {Array.<string>=} values
 */
function CSSTransformScale(kind, values) {
	//scale(x, y)
	//scale(xy) => scale(xy, xy)
	//scale3d(x, y, z)
	this.x = "";
	this.y = "";
	this.z = "";
}
/**
 * Creates a string representation of the CSS function
 * @this {CSSTransformScale}
 * @override
 */
CSSTransformScale[PROTOTYPE].toString = function() {
	var is2d = !FLOAT(this.z);
	return "scale" + (is2d ? "" : "3d")
		+ "("
		+ this.x + "," + this.y
		+ (is2d ? "" : "," + this.z)
		+ ")";
}
/**
 * Skew function for CSS Transform
 * @constructor
 * @param {!string} kind
 * @param {Array.<string>=} values
 */
function CSSTransformSkew(kind, values) {
	this.x = "";
	this.y = "";
}
/**
 * Creates a string representation of the CSS function
 * @this {CSSTransformSkew}
 * @override
 */
CSSTransformSkew[PROTOTYPE].toString = function() {
	return "skew"
		+ "("
		+ this.x + "," + this.y
		+ ")";
}
/**
 * Perspective function for CSS Transform
 * @constructor
 * @param {!string} kind
 * @param {Array.<string>=} values
 */
function CSSTransformPerspective(kind, values) {
	this.length = "";
}
/**
 * Creates a string representation of the CSS function
 * @this {CSSTransformPerspective}
 * @override
 */
CSSTransformPerspective[PROTOTYPE].toString = function() {
	return !this.length
		? ""
		: "perspective"
		+ "("
		+ this.length
		+ ")";
}
/**
 * Matrix function for CSS Transform
 * @constructor
 * @param {!string} kind
 * @param {Array.<string>=} values
 */
function CSSTransformMatrix(kind, values) {
	//matrix(a, b, c, d, tx, ty)
	this.a = NaN;
	this.b = NaN;
	this.c = NaN;
	this.d = NaN;
	this.tx = NaN;
	this.ty = NaN;
}
/**
 * Creates a string representation of the CSS function
 * @this {CSSTransformMatrix}
 * @override
 */
CSSTransformMatrix[PROTOTYPE].toString = function() {
}
/**
 * Matrix 3D function for CSS Transform
 * @constructor
 * @param {!string} kind
 * @param {Array.<string>=} values
 */
function CSSTransformMatrix3d(kind, values) {
	//matrix3d(a1, b1, c1, d1, a2, b2, c2, d2, a3, b3, c3, d3, a4, b4, c4, d4)
	this.a1 = NaN;
	this.b1 = NaN;
	this.c1 = NaN;
	this.d1 = NaN;
	this.a2 = NaN;
	this.b2 = NaN;
	this.c2 = NaN;
	this.d2 = NaN;
	this.a3 = NaN;
	this.b3 = NaN;
	this.c3 = NaN;
	this.d3 = NaN;
	this.a4 = NaN;
	this.b4 = NaN;
	this.c4 = NaN;
	this.d4 = NaN;
}
/**
 * Creates a string representation of the CSS function
 * @this {CSSTransformMatrix3d}
 * @override
 */
CSSTransformMatrix3d[PROTOTYPE].toString = function() {
}


/**
 * 
 * @param {!string} transform
 * @return {!Object.<string,string>}
 */
function GET_TRANSFORM_DICTIONARY(transform) {
	var dic = {},
		values = (transform.match(/[a-z3]+\([^)]+\)/gim) || []).toDictionary(
			function(key) {
				return key.substring(0, key.indexOf("("));
			},
			function(value, key) {
				var klass = null;
				switch (key.toLowerCase()) {
					case "rotate":
					case "rotate3d":
					case "rotatex":
					case "rotatey":
					case "rotatez": klass = CSSTransformRotate; break;
					case "translate":
					case "translate3d":
					case "translatex":
					case "translatey":
					case "translatez": klass = CSSTransformTranslate; break;
					case "scale":
					case "scale3d":
					case "scalex":
					case "scaley":
					case "scalez": klass = CSSTransformScale; break;
					case "skew":
					case "skewx":
					case "skewy": klass = CSSTransformSkew; break;
					case "perspective": klass = CSSTransformPerspective; break;
					case "matrix": klass = CSSTransformMatrix; break;
					case "matrix3d": klass = CSSTransformMatrix3d; break;
				}
				return !klass
					? klass
					: new klass(
						key,
						value.substring(value.indexOf("(") + 1, value.lastIndexOf(")"))
							.split(",")
							.invoke("trim")
					);
			}
		);
	return {
	};
}
/**
 * 
 * @param {!Object.<string,string>} dic
 * @param {!string} prefix
 * @param {string=} type
 * @return {!string}
 */
function GET_TRANSFORM_COORDS(dic, prefix, type) {
	var prefix2d = (dic[prefix] || "").split(",").invoke("trim"),
		prefix3d = (dic[prefix + "3d"] || "").split(",").invoke("trim"),
		prefixX = dic[prefix + "X"] || prefix2d[0] || prefix3d[0] || "",
		prefixY = dic[prefix + "Y"] || prefix2d[1] || prefix3d[1] || "",
		prefixZ = dic[prefix + "Z"] || prefix3d[2] || "",
		prefixA = prefix3d[3] || "";	// used by rotate3d
	switch (type || prefix) {
		case prefix:
		case prefix + "3d": return prefixX || prefixY || prefixZ || prefixA
			? (prefixX || 0) + "," + (prefixY || 0)
			+ (prefixZ || prefixA ? "," + (prefixZ || 0) : "")
			+ (prefixA ? "," + (prefixA || 0) : "")
			: "";
		case prefix + "x": return prefixX || "";
		case prefix + "y": return prefixY || "";
		case prefix + "z": return prefixZ || "";
	}
	return "";
}
///**
// * @this {Element}
// * @expose
// * @param {!string} type
// * @return {!string}
// */
//HTMLElement_prototype.getTransform = function(type) {
//	type = type.toLowerCase();
//	var dic = GET_TRANSFORM_DICTIONARY(this.getStyle(DOM_TRANSFORM));
//	if (type.startsWith("translate")) return GET_TRANSFORM_COORDS(dic, "translate", type);
//	else if (type.startsWith("rotate")) return GET_TRANSFORM_COORDS(dic, "rotate", type);
//	else if (type.startsWith("scale")) return GET_TRANSFORM_COORDS(dic, "scale", type);
//	else if (type.startsWith("skew")) return GET_TRANSFORM_COORDS(dic, "skew", type);
//	else switch (type) {
//		case "perspective": return dic["perspective"] || "";
//		case "matrix": return dic["matrix"] || "";
//		case "matrix3d": return dic["matrix3d"] || "";
//	}
//	return "";
//};
///**
// * @this {Element}
// * @expose
// * @param {!string} type
// * @param {!string} values
// * @return {Element} this
// */
//HTMLElement_prototype.setTransform = function(type, values) {
//	type = type.toLowerCase();
//	var dic = GET_TRANSFORM_DICTIONARY(this.style[DOM_TRANSFORM] || ""),
//		coords = values.split(",").map(ARRAY_HELPER_MAP_TRIM),
//		existing = GET_TRANSFORM_COORDS(
//			dic,
//			type.startsWith("translate")
//				? "translate"
//				: type.startsWith("rotate")
//					? "rotate"
//					: type.startsWith("scale")
//						? "scale"
//						: type.startsWith("skew")
//							? "skew"
//							: type
//		).split(",").map(ARRAY_HELPER_MAP_TRIM);

//	dic[type] =
//	dic[type + "3d"] =
//	dic[type + "X"] =
//	dic[type + "Y"] =
//	dic[type + "Z"] = "";

//	this.style[DOM_TRANSFORM] = OBJECT_EACH(dic, function(value, key) {
//		return value
//			? key + "(" + value + ") "
//			: "";
//	}).join("").trim();
//	if (this.style[DOM_TRANSFORM].contains("matrix")) debugger;
//	return this;
//};
//#endregion CSS Transforms