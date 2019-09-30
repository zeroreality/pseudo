/// <reference path="..\..\blds\pseudo3.js" />

/**
 * 
 **/
[
	"matrix",	"matrix3D",
	"perspective",
	"rotate",		"rotate3D",	"rotateX",	"rotateY",	"rotateZ",
	"scale",		"scale3d",	"scaleX",		"scaleY",		"scaleZ",
	"skew",					"skewX",		"skewY",
	"translate",	"translate3d",	"translateX",	"translateY",	"translateZ",
].forEach(function(key) {
	DEFINE_PROP(CSSStyleDeclaration[PROTOTYPE], "transform" + key.toCapital(), {
		"enumerable": true,
		"configurable": true,
		"get": function() { return CSS_TRANSFORM_GET(this, key); },
		"set": function(value) { return CSS_TRANSFORM_SET(this, key, value); },
	});
});

/**
 * 
 * @param {!CSSStyleDeclaration} style
 * @return {Object}
 **/
function CSS_TRANSFORM_DICTIONARY(style) {
	var transforms = {};
	(style.transform.match(/[3acdDeiklmnoprstvwXxYZ]+\([^)]+\)/g) || []).forEach(function(transform) {
		transforms[transform.before("(")] = transform.after("(").before(")");
	});
	return transforms;
}

/**
 *
 * @param {!CSSStyleDeclaration} style
 * @param {!string} key
 **/
function CSS_TRANSFORM_GET(style, key) {
	return CSS_TRANSFORM_DICTIONARY(style)[key] || "";
}
/**
 * 
 * @param {!CSSStyleDeclaration} style
 * @param {!string} key
 * @param {!string} value
 **/
function CSS_TRANSFORM_SET(style, key, value) {
	var transforms = CSS_TRANSFORM_DICTIONARY(style);
	transforms[key] = OBJECT_IS_NOTHING(value)
		? ""
		: String(value).trim();
	style.transform = OBJECT_EACH(transforms, function(value, name) {
		return value
			? name + "(" + value + ") "
			: "";
	}).join("").trimEnd();
}
