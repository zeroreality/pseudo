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
	switch (PSEUDO_KLASS_NAME(object)) {
		case "null":
			html.push('<span class="json-null">' + object + '</span>');
			break;
		case "Boolean":
			html.push('<span class="json-bool">' + object + '</span>');
			break;
		case "Number":
			html.push('<span class="json-num">' + object + '</span>');
			break;
		case "String":
			html.push('<span class="json-string">"' + object + '"</span>');
			break;
		case "Array":
			if (!OBJECT_IS_STRING(tab)) tab = "\t";
			if (!OBJECT_IS_NUMBER(depth)) depth = 0;
			html.push('<span class="json-array">[');
			if (object.length) {
				var indent = depth
					? tab.repeat(depth)
					: "";
				html.push('<br/>');
				html.push(object.map(function(obj) {
					return indent + tab + JSON_PRETTY(obj, tab, depth + 1);
				}).join(',<br/>'));
				html.push('<br/>' + indent);
			}
			html.push(']</span>');
			break;
		case "Object":
			if (!OBJECT_IS_STRING(tab)) tab = "\t";
			if (!OBJECT_IS_NUMBER(depth)) depth = 0;
			var keys = GET_KEYS(object);
			html.push('<span class="json-object">{');
			if (keys.length) {
				var indent = depth
					? tab.repeat(depth)
					: "";
				html.push('<br/>');
				html.push(keys.map(function(each) {
					return indent + tab
						+ '<span class="json-key">"' + each + '"</span>: '
						+ JSON_PRETTY(object[each], tab, depth + 1);
				}).join(',<br/>'));
				html.push('<br/>' + indent);
			}
			html.push('}</span>');
			break;
		case "undefined":
		default:
			// for non-JSON types like: undefined, Date, etc...
			html.push('<span class="json-invalid">' + object + '</span>');
			break;
	}
	return html.join("");
}

/**
 * Parses the JSON string, and handles the error if any.
 * @param {!string} jsonString
 * @param {Object=} errorContainer
 * @return {*}
 */
function JSON_PARSE_SAFE(jsonString, errorContainer) {
	var json;
	try {
		json = JSON_PARSE(jsonString);
	} catch (error) {
		[
			"name",
			"message",
		].concat(GET_ALL_KEYS(error))
			.unique()
			.forEach(function(key) {
				this[key] = error[key];
			}, errorContainer || {});
	}
	return json;
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
	/**
	 * Parses the passed JSON string and returns the parsed value.
	 * If there is an exception in parsing, the errorContainer is populated with all the details of the error and `undefined` is returned.
	 **/
	"parseSafe": JSON_PARSE_SAFE,
};