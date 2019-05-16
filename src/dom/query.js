/// <reference path="..\..\blds\pseudo3.js" />

// polyfill
if (!HTMLElement_prototype.matches) {
	/**
	 * Internally uses the browser's prefixed or native matchesSelector function.
	 * Takes multiple selector arguments.
	 * @this {Element}
	 * @expose
	 * @param {...string} var_args
	 * @return {!boolean} 
	 */
	HTMLElement_prototype.matches = function(var_args) {
		//	console.log("matches", parseSelectors(arguments), this[DOM_QUERY_MATCHES](parseSelectors(arguments)));
		return this[DOM_QUERY_MATCHES](DOM_PARSE_SELECTORS(arguments));
	};
}

/**
 * Parses all given selectors into a single string to use in Element#querySelector.
 * @param {!Array.<string>|Arguments} array
 * @return {!string}
 */
function DOM_PARSE_SELECTORS(array) {
	var selectors = SLICE.call(array).invoke("trim").join(",");
	if (selectors.indexOf(",,") > -1) throw new Error("Blank selector is invalid");
	return selectors || "*";
}

/**
 * Similar to {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelectorAll|Element#querySelector}.
 * Takes multiple selector arguments.
 * @this {Element}
 * @expose
 * @param {...string} var_args
 * @return {Element}
 */
HTMLElement_prototype.ask = function(var_args) {
	return this.querySelector(DOM_PARSE_SELECTORS(arguments));
};
/**
 * Similar to {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelectorAll|Element#querySelectorAll}, but will return an array of Nodes instead of a live {@linkhttps://developer.mozilla.org/en-US/docs/Web/API/NodeList|NodeList}.
 * Takes multiple selector arguments.
 * @this {Element}
 * @expose
 * @param {...string} var_args
 * @return {!Array.<HTMLElement>}
 */
HTMLElement_prototype.query = function(var_args) {
	return SLICE.call(this.querySelectorAll(DOM_PARSE_SELECTORS(arguments)));
};
/**
 * Moves up the tree to find the first node that matches the given query or undefined if it reaches the ancestorNode first.
 * @this {Element}
 * @expose
 * @param {Array.<string>|string=} query
 * @param {HTMLElement=} ancestorNode
 * @return {HTMLElement|undefined}
 */
HTMLElement_prototype.up = function(query, ancestorNode) {
	var elem = this,
		selectors = DOM_PARSE_SELECTORS([query || "*"]);
	while ((elem = elem.parentNode) instanceof HTMLElement) {
		if (elem[DOM_QUERY_MATCHES](selectors)) {
			break;
		} else if (elem === ancestorNode) {
			elem = undefined;
			break;
		}
	}
	return elem instanceof HTMLElement ? elem : undefined;
};
/**
 * Similar to the node.up() method, but first checks itself for a match.
 * @this {Element}
 * @expose
 * @param {Array.<string>|string=} query
 * @param {HTMLElement=} ancestorNode
 */
HTMLElement_prototype.jump = function(query, ancestorNode) {
	return this.matches(query)
		? this
		: this.up(query, ancestorNode);
};
