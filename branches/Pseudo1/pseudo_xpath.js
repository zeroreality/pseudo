/* ---------------------------------------------------------------------------
 *  Pseudo JavaScript framework, version 0.1b
 *  (c) 2009 Alex Lein
 *
 *  Pseudo is based heavily on the awesome
 *  Prototype JavaScript framework (c) 2005-2009 Sam Stephenson
 *
 *  Pseudo is freely distributable under the terms of an MIT-style license.
 *  For details, see the Prototype web site: http://www.prototypejs.org/
 *
 *--------------------------------------------------------------------------*/
Object.extend(Pseudo,{
	"XPath": !!document.evaluate
});
/* ---------------------------------------------------------------------------
 * CSS selectors
 * -------------------------------------------------------------------------*/
DOM.addMethods(["*","__document"],(function(){
/*
	*				//*
	div				//div
	div p			//div//p
	#unique			//*[@id="unique"]
	div#unique		//div[@id="unique"]
	.classname		//*[contains(concat(" ",normalize-space(@class)," "), " classname ")]
	div.classname		//div[contains(concat(" ",normalize-space(@class)," "), " classname ")]
	
	div > p			//div/p
	div + p			//div/following-sibling::*[1]/self::p
	div:first-child	//[not(preceding-sibling::*)]
	div:last-child		//[not(following-sibling::*)]
	div:only-child		//[not(preceding-sibling::* or following-sibling::*)]
	div:empty			//[count(*) = 0 and (count(text()) = 0)]
	div:checked		//[@checked]
	div:disabled		//[(@disabled) and (@type!="hidden")]
	div:enabled		//[not(@disabled) and (@type!="hidden")]
	
	div:lang(en)		//div[@xml:lang="en" or starts-with(@xml:lang,concat("en","-"))]
	div[lang|="en"]	//div[@lang="en" or starts-with(@lang,concat("en","-"))]
	div[class~="icon"]	//div[contains(concat(" ",normalize-space(@class)," "), " classname ")]
	
	
	div[attr]			//div[@attr]
	div[attr!=value]	//div[@attr!="value"]
	div[attr^=value]	//div[starts-with(@attr,"value")]
	
	div[attr$=value]	//div[substring(@attr,(string-length(@attr)-string-length("value")+1))="value"
	div[attr*=value]	//div[contains(@attr,"value")]
	div[attr~=value]	//div[contains(concat(" ",@attr," ")," value ")]
	div[attr|=value]	//div[contains(concat("-",@attr,"-"),"-value-")]
*/
	var XPATH_TRANSLATORS = Pseudo.DOM.__XPATH_TRANSLATORS = {
		"tag": {
			// css:	div
			// xpath:	//div
			"regexp": /([a-z]*[a-z0-9]+|\*)/i,
			"builder": function(tag) {
				return tag || "*";
			}
		},
		"descendant": {
			// css:	div p
			// xpath:	//div//p
			"regexp": /([a-z]*[a-z0-9]+)\s([a-z]*[a-z0-9]+)/i,
			"builder": function(parentTag,childTag) {
				return [parentTag || "*","//",childTag || "*"].join("");
			}
		},
		"child": {
			// css:	div > p
			// xpath:	//div/p
			"regexp": /[a-z]*[a-z0-9]+\s*\>\s*[a-z]*[a-z0-9]+/i,
			"builder": function(parentTag,childTag) {
				return [parentTag || "*","/",childTag || "*"].join("");
			}
		},
		"attr-contains": {
			// css:	div[attr*=value]
			// xpath:	//div[contains(@attr,"value")]
			"regexp": /(.*)\[([a-z]*[a-z0-9]+)\*=\'?([^\']+)\'?\]/i,
			"builder": function(tag,attr,value) {
				return [tag||"*","[contains(@",attr,",\"",value,"\")]"].join("");
			}
		}
	};
	var XPATH_QUERY_CACHE = Pseudo.DOM.__XPATH_QUERY_CACHE = {};
	function XPATH_BUILD_EXPRESSION(cssText) {
		// deja vue?
		cssText = cssText.trim();
		if (XPATH_QUERY_CACHE[cssText]) return XPATH_QUERY_CACHE[cssText];
		
		// multi selector
		if (cssText.contains(",")) {
			var multi = [];
			cssText.split(/\s*,\s*/).each(function(css) { multi.push(XPATH_BUILD_EXPRESSION(css)) });
			return XPATH_QUERY_CACHE[cssText] = multi.join("|");
		};
		
		var xpathExpression = ["//"];
		
		
		return XPATH_QUERY_CACHE[cssText] = xpathExpression.join("");
	};
	
	function selectorQuery(cssText) {
		return $A(this.querySelectorAll(cssText));
	};
	function selectorXPath(cssText) {
		var results = [], xpathExpression = XPATH_BUILD_EXPRESSION(cssText);
		var query = document.evaluate(xpathExpression,this,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
		for (var i=0,l=query.snapshotLength; i<l; i++) results.push(DOM.extend(query.snapshotItem(i)));
		return results;
	};
	function selectorSizzle(cssText) {
		return Sizzle(cssText,this);
	};
	
	return {
		"select": Pseudo.SelectorsAPI ? selectorQuery : selectorSizzle
	};
})());