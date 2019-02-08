/// <reference path="..\..\blds\pseudo3.js" />
"use strict";


/**
 * Gets a cookie by the given (case-sensitive) name.
 * If no cookie is set, returns undefined.
 * @param {!string} name
 * @return {string|undefined}
 */
function COOKIE_GETTER(name) {
	return DOC.cookie.split(new RegExp("\\b" + name + "=([^;]*)"))[1];
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
 */
function COOKIE_SETTER(name, value, path, expiry) {
	expiry = new Date(expiry instanceof Date ? expiry.valueOf() : IS_AN(expiry) ? expiry : Date.parse(String(expiry)));
	DOC.cookie = name + "=" + value
		+ "; path=" + (path || "/")
		+ "; expires=" + (IS_AN(expiry.valueOf()) ? expiry : (new Date).addDate(1)).toUTCString();
	return COOKIE_GETTER(name);
}
/**
 * Removes a cookie by the given (case-sensitive) name.
 * Returns true when the cooke was successfully removed.
 * @param {!string} name
 * @return {!boolean}
 */
function COOKIE_REMOVE(name) {
	return !COOKIE_SETTER(name, "", new Date(0));
}

/** @expose */
ns.cookies = {
	"get": COOKIE_GETTER,
	"set": COOKIE_SETTER,
	"remove": COOKIE_REMOVE,
};