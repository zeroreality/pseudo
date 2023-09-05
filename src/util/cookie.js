/// <reference path="..\..\blds\pseudo3.js" />

/**
 * Gets a cookie by the given (case-sensitive) name.
 * If no cookie is set, returns undefined.
 * @param {!string} name
 * @return {string|undefined}
 **/
function COOKIE_GETTER(name) {
	var values = DOC.cookie.split(new RegExp("\\b" + encodeURIComponent(name) + "=([^;]*)"));
	return values.length > 0
		? decodeURIComponent(values[1].replace(/\+/g, " "))
		: undefined;
}
/**
 * Sets a cookie with the given value, path, and expiriation.
 * If no path is given, the root is used by default.
 * If no expiration is given, it will add a default of "now + 1 day".
 * @param {!string} name
 * @param {!string} value
 * @param {string=} path
 * @param {Date=} expiry
 * @return {!string}
 **/
function COOKIE_SETTER(name, value, path, expiry) {
	expiry = new Date(expiry instanceof Date ? expiry.valueOf() : IS_AN(expiry) ? expiry : Date.parse(String(expiry)));
	DOC.cookie = encodeURIComponent(name) + "=" + (OBJECT_IS_NOTHING(value) ? "" : encodeURIComponent(value))
		+ "; path=" + (path || "/")
		+ "; expires=" + (IS_AN(expiry.valueOf()) ? expiry : (new Date).addDate(1)).toUTCString();
	return COOKIE_GETTER(name);
}
/**
 * Removes a cookie by the given (case-sensitive) name.
 * If no path is given, the root is used by default.
 * Returns true when the cooke was successfully removed.
 * @param {!string} name
 * @param {string=} path
 * @return {!boolean}
 **/
function COOKIE_REMOVE(name, path) {
	return !COOKIE_SETTER(name, "", path || "/", new Date(0));
}

/**
 * 
 * @namespace
 * @expose
 **/
ns.cookies = {
	"get": COOKIE_GETTER,
	"set": COOKIE_SETTER,
	"remove": COOKIE_REMOVE,
};
