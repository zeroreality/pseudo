/// <reference path="..\..\blds\pseudo3.js" />

/**
 * Makes the JSON pretty
 * @param {?} object
 * @param {!string} tab
 * @param {!number} depth
 * @return {!string}
 */
function JSON_PRETTY(object, tab, depth) {
	var html = [];
	if (OBJECT_IS_STRING(object)) {
		//	if (depth) html.push(tab.repeat(depth));
		html.push("<span class='json-string'>\"" + object + "\"</span>");
	} else if (OBJECT_IS_NUMBER(object)) {
		//	if (depth) html.push(tab.repeat(depth));
		html.push("<span class='json-num'>" + object + "</span>");
	} else if (OBJECT_IS_BOOLEAN(object)) {
		//	if (depth) html.push(tab.repeat(depth));
		html.push("<span class='json-bool'>" + object + "</span>");
	} else if (OBJECT_IS_OBJECT(object)) {
		if (!OBJECT_IS_STRING(tab)) tab = "\t";
		if (!OBJECT_IS_NUMBER(depth)) depth = 0;
		var indent = depth ? tab.repeat(depth) : "";
		if (object instanceof Array) {
			html.push("<span class='json-array'>[");
			if (object.length) {
				html.push("<br/>");
				html.push(object.map(function(obj) {
					return indent + tab + JSON_PRETTY(obj, tab, depth + 1);
				}).join(",<br/>"));
				html.push("<br/>" + indent);
			}
			html.push("]</span>");
		} else if (object) {
			html.push("<span class='json-object'>{");
			var keys = GET_KEYS(object);
			if (keys.length) {
				html.push("<br/>");
				html.push(keys.map(function(each) {
					return indent + tab
						+ "<span class='json-key'>\"" + each + "\"</span>: "
						+ JSON_PRETTY(object[each], tab, depth + 1);
				}).join(",<br/>"));
				html.push("<br/>" + indent);
			}
			html.push("}</span>");
		} else {
			html.push("<span class='json-null'>null</span>");
		}
	}
	return html.join("");
}

/**
 * 
 * @namespace
 * @expose
 **/
ns.JSON = {
	/**
	 * Returns a string of HTML so an object can be styled in the browser.
	 **/
	"pretty": JSON_PRETTY,
};