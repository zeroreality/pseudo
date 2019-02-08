/// <reference path="..\..\blds\pseudo3.js" />

/**
 * @param {!Array.<string>|Arguments} array
 */
function parseSelectors(array) {
	var selectors = SLICE.call(array).invoke("trim").join(",");
	if (selectors.indexOf(",,") > -1) throw new Error("Blank selector is invalid");
	return selectors || "*";
}

/**
 * 
 * @this {Element}
 * @expose
 * @return {Element}
 */
HTMLElement_prototype.ask = function() {
	return this.querySelector(parseSelectors(arguments));
};
/**
 * @this {Element}
 * @expose
 * @return {!Array.<HTMLElement>}
 */
HTMLElement_prototype.query = function() {
	//	return SLICE.call(this.querySelectorAll(parseSelectors(arguments)));
	return SLICE.call(this.querySelectorAll(parseSelectors(arguments)));
};
/**
 * @this {Element}
 * @expose
 * @param {...string} args
 * @return {!boolean} 
 */
HTMLElement_prototype.matches = function(args) {
	//	console.log("matches", parseSelectors(arguments), this[DOM_QUERY_MATCHES](parseSelectors(arguments)));
	return this[DOM_QUERY_MATCHES](parseSelectors(arguments));
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
		selectors = parseSelectors([query || "*"]);
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
 * Similat to the node.up() method, but first checks self to a match.
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
