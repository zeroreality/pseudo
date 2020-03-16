/// <reference path="..\..\blds\pseudo3.js" />

//#region Codifying names/values
/**
 * A mapping for non-accented lower-case characters.
 * @type {Object.<string,string>}
 */
var DIACRITICS = {
	'\u2c61': "l", '\u2c65': "a", '\u2c66': "t", '\u2c68': "h", '\u2c6a': "k", '\u2c6c': "z", '\u2c73': "w", '\u2c76': "h",
	'\u008c': "oe", '\u009c': "oe", '\u00df': "s", '\u00e0': "a", '\u00e1': "a", '\u00e2': "a", '\u00e3': "a", '\u00e4': "a",
	'\u00e5': "a", '\u00e6': "ae", '\u00e7': "c", '\u00e8': "e", '\u00e9': "e", '\u00ea': "e", '\u00eb': "e", '\u00ec': "i",
	'\u00ed': "i", '\u00ee': "i", '\u00ef': "i", '\u00f1': "n", '\u00f2': "o", '\u00f3': "o", '\u00f4': "o", '\u00f5': "o",
	'\u00f6': "o", '\u00f8': "o", '\u00f9': "u", '\u00fa': "u", '\u00fb': "u", '\u00fc': "u", '\u00fd': "y", '\u00ff': "y",
	'\u0101': "a", '\u0103': "a", '\u0105': "a", '\u0107': "c", '\u0109': "c", '\u010b': "c", '\u010d': "c", '\u010f': "d",
	'\u0111': "d", '\u0113': "e", '\u0115': "e", '\u0117': "e", '\u0119': "e", '\u011b': "e", '\u011d': "g", '\u011f': "g",
	'\u0121': "g", '\u0123': "g", '\u0125': "h", '\u0127': "h", '\u0129': "i", '\u012b': "i", '\u012d': "i", '\u012f': "i",
	'\u0131': "i", '\u0135': "j", '\u0137': "k", '\u013a': "l", '\u013c': "l", '\u013e': "l", '\u0140': "l", '\u0142': "l",
	'\u0144': "n", '\u0146': "n", '\u0148': "n", '\u0149': "n", '\u014d': "o", '\u014f': "o", '\u0151': "o", '\u0153': "oe",
	'\u0155': "r", '\u0157': "r", '\u0159': "r", '\u015b': "s", '\u015d': "s", '\u015f': "s", '\u0161': "s", '\u0163': "t",
	'\u0165': "t", '\u0167': "t", '\u0169': "u", '\u016b': "u", '\u016d': "u", '\u016f': "u", '\u0171': "u", '\u0173': "u",
	'\u0175': "w", '\u0177': "y", '\u017a': "z", '\u017c': "z", '\u017e': "z", '\u017f': "l", '\u0180': "b", '\u0183': "b",
	'\u0188': "c", '\u018c': "d", '\u0192': "f", '\u0195': "hv", '\u0199': "k", '\u019a': "l", '\u019e': "n", '\u01a1': "o",
	'\u01a3': "oi", '\u01a5': "p", '\ua729': "tz", '\ua733': "aa", '\ua735': "ao", '\ua737': "au", '\ua739': "av", '\ua73b': "av",
	'\ua73d': "ay", '\ua73f': "c", '\ua741': "k", '\ua743': "k", '\ua745': "k", '\ua747': "l", '\ua749': "l", '\ua74b': "o",
	'\ua74d': "o", '\ua74f': "oo", '\ua751': "p", '\ua753': "p", '\ua755': "p", '\ua757': "q", '\ua759': "q", '\ua75b': "r",
	'\ua75f': "v", '\ua761': "vy", '\ua763': "z", '\ua77a': "d", '\ua77c': "f", '\ua77f': "g", '\ua781': "l", '\ua783': "r",
	'\ua785': "s", '\ua787': "t", '\ua791': "n", '\u01ad': "t", '\ua7a1': "g", '\ua7a3': "k", '\ua7a5': "n", '\ua7a7': "r",
	'\ua7a9': "s", '\u01b0': "u", '\u01b4': "y", '\u01b6': "z", '\u01c6': "dz", '\u01c9': "lj", '\u01cc': "nj", '\u01ce': "a",
	'\u01d0': "i", '\u01d2': "o", '\u01d4': "u", '\u01d6': "u", '\u01d8': "u", '\u01da': "u", '\u01dc': "u", '\u01dd': "e",
	'\u01df': "a", '\u01e1': "a", '\u01e3': "ae", '\u01e5': "g", '\u01e7': "g", '\u01e9': "k", '\u01eb': "o", '\u01ed': "o",
	'\u01f0': "j", '\u01f3': "dz", '\u01f5': "g", '\u01f9': "n", '\u01fb': "a", '\u01fd': "ae", '\u01ff': "o", '\u0201': "a",
	'\u0203': "a", '\u0205': "e", '\u0207': "e", '\u0209': "i", '\u020b': "i", '\u020d': "o", '\u020f': "o", '\u0211': "r",
	'\u0213': "r", '\u0215': "u", '\u0217': "u", '\u0219': "s", '\u021b': "t", '\u021f': "h", '\u0223': "ou", '\u0225': "z",
	'\u0227': "a", '\u0229': "e", '\u022b': "o", '\u022d': "o", '\u022f': "o", '\u0231': "o", '\u0233': "y", '\u023c': "c",
	'\u023f': "s", '\u0240': "z", '\u0247': "e", '\u0249': "j", '\u024b': "q", '\u024d': "r", '\u024f': "y", '\u0250': "a",
	'\u0253': "b", '\u0254': "o", '\u0256': "d", '\u0257': "d", '\u025b': "e", '\u0260': "g", '\u0265': "h", '\u0268': "i",
	'\u026b': "l", '\u026f': "m", '\u0271': "m", '\u0272': "n", '\u0275': "o", '\u027d': "r", '\u0288': "t", '\u0289': "u",
	'\u028b': "v", '\u028c': "v", '\uff41': "a", '\uff42': "b", '\uff43': "c", '\uff44': "d", '\uff45': "e", '\uff46': "f",
	'\uff47': "g", '\uff48': "h", '\uff49': "i", '\uff4a': "j", '\uff4b': "k", '\uff4c': "l", '\uff4d': "m", '\uff4e': "n",
	'\uff4f': "o", '\uff50': "p", '\uff51': "q", '\uff52': "r", '\uff53': "s", '\uff54': "t", '\uff55': "u", '\uff56': "v",
	'\uff57': "w", '\uff58': "x", '\uff59': "y", '\uff5a': "z", '\u1d79': "g", '\u1d7d': "p", '\u1e01': "a", '\u1e03': "b",
	'\u1e05': "b", '\u1e07': "b", '\u1e09': "c", '\u1e0b': "d", '\u1e0d': "d", '\u1e0f': "d", '\u1e11': "d", '\u1e13': "d",
	'\u1e15': "e", '\u1e17': "e", '\u1e19': "e", '\u1e1b': "e", '\u1e1d': "e", '\u1e1f': "f", '\u1e21': "g", '\u1e23': "h",
	'\u1e25': "h", '\u1e27': "h", '\u1e29': "h", '\u1e2b': "h", '\u1e2d': "i", '\u1e2f': "i", '\u1e31': "k", '\u1e33': "k",
	'\u1e35': "k", '\u1e37': "l", '\u1e39': "l", '\u1e3b': "l", '\u1e3d': "l", '\u1e3f': "m", '\u1e41': "m", '\u1e43': "m",
	'\u1e45': "n", '\u0307': "i", '\u1e47': "n", '\u1e49': "n", '\u1e4b': "n", '\u1e4d': "o", '\u1e4f': "o", '\u1e51': "o",
	'\u1e53': "o", '\u1e55': "p", '\u1e57': "p", '\u1e59': "r", '\u1e5b': "r", '\u1e5d': "r", '\u1e5f': "r", '\u1e61': "s",
	'\u1e63': "s", '\u1e65': "s", '\u1e67': "s", '\u1e69': "s", '\u1e6b': "t", '\u1e6d': "t", '\u1e6f': "t", '\u1e71': "t",
	'\u1e73': "u", '\u1e75': "u", '\u1e77': "u", '\u1e79': "u", '\u1e7b': "u", '\u1e7d': "v", '\u1e7f': "v", '\u1e81': "w",
	'\u1e83': "w", '\u1e85': "w", '\u1e87': "w", '\u1e89': "w", '\u1e8b': "x", '\u1e8d': "x", '\u1e8f': "y", '\u1e91': "z",
	'\u1e93': "z", '\u1e95': "z", '\u1e96': "h", '\u1e97': "t", '\u1e98': "w", '\u1e99': "y", '\u1e9a': "a", '\u1e9b': "s",
	'\u1ea1': "a", '\u1ea3': "a", '\u1ea5': "a", '\u1ea7': "a", '\u1ea9': "a", '\u1eab': "a", '\u1ead': "a", '\u1eaf': "a",
	'\u1eb1': "a", '\u1eb3': "a", '\u1eb5': "a", '\u1eb7': "a", '\u1eb9': "e", '\u1ebb': "e", '\u1ebd': "e", '\u1ebf': "e",
	'\u1ec1': "e", '\u1ec3': "e", '\u1ec5': "e", '\u1ec7': "e", '\u1ec9': "i", '\u1ecb': "i", '\u1ecd': "o", '\u1ecf': "o",
	'\u1ed1': "o", '\u1ed3': "o", '\u1ed5': "o", '\u1ed7': "o", '\u1ed9': "o", '\u1edb': "o", '\u1edd': "o", '\u1edf': "o",
	'\u1ee1': "o", '\u1ee3': "o", '\u1ee5': "u", '\u1ee7': "u", '\u1ee9': "u", '\u1eeb': "u", '\u1eed': "u", '\u1eef': "u",
	'\u1ef1': "u", '\u1ef3': "y", '\u1ef5': "y", '\u1ef7': "y", '\u1ef9': "y", '\u1eff': "y", '\u2184': "c", '\u24d0': "a",
	'\u24d1': "b", '\u24d2': "c", '\u24d3': "d", '\u24d4': "e", '\u24d5': "f", '\u24d6': "g", '\u24d7': "h", '\u24d8': "i",
	'\u24d9': "j", '\u24da': "k", '\u24db': "l", '\u24dc': "m", '\u24dd': "n", '\u24de': "o", '\u24df': "p", '\u24e0': "q",
	'\u24e1': "r", '\u24e2': "s", '\u24e3': "t", '\u24e4': "u", '\u24e5': "v", '\u24e6': "w", '\u24e7': "x", '\u24e8': "y",
	'\u24e9': "z",
};
/**
 * A list of UTF8 quotation marks and apostrophes.
 * @type {Array.<string>}
 */
var QUOTATIONS = [
	'\u0022', '\u0027', '\u005e', '\u0060', '\u00ab', '\u00b4',
	'\u00bb', '\u02ba', '\u02dd', '\u02ee', '\u02f6', '\u05f2',
	'\u05f4', '\u1cd3', '\u201c', '\u201d', '\u201f', '\u2033',
	'\u2036', '\u3003', '\uff02'
];
//#endregion Codifying names/values

/**
 * Creates a searchable/coded string based on a user inputted string.  Quotation marks, apostrophes, and accents are removed.
 * @param {!string} input The string to codify
 * @throws {TypeError} input value is not a string
 * @return {!string} The codified representation of the input
 */
function CODIFIER(input) {
	if (!IS_STRING(input)) throw new TypeError("input value is not a string");
	var dash = true,
		output = "";
	input = input.toLowerCase();
	for (var i = 0, l = input.length; i < l; i++) {
		var char = input[i],
			letter = DIACRITICS[char],
			code = (letter || char).charCodeAt(0),
			isQuote = !letter && QUOTATIONS.indexOf(char) > -1,
			isChar = !isQuote && (code >= 97 && code <= 122 || code >= 48 && code <= 57);
		if (isChar) output += letter || char;
		else if (!isQuote && !dash) output += '-';
		if (!isQuote) dash = !isChar;
	}
	return dash
		? output.slice(0, -1)
		: output;
}

/**
 *
 * @param {Array} a
 * @param {Array} b
 * @returns {number}
 **/
function ARRAY_SUPER_NATURAL(a, b) {
	for (var i = 0, l = MAX(a.length, b.length); i < l; i++) {
		var aValue = a[i],
			bValue = b[i],
			aNaN = isNaN(aValue),
			bNaN = isNaN(bValue);
		if (aValue === undefined) {
			// this is the case if a has fewer values in the sort array
			return -1;
		} else if (bValue === undefined) {
			// this is the case if a has more values in the sort array
			return 1;
		} else if (aNaN === bNaN) {
			// compare as if both are strings or numbers
			if (aValue < bValue) return -1;
			else if (aValue > bValue) return 1;
		} else {
			// number is higher
			return aNaN ? 1 : -1;	// same as "aNaN ? 1 : bNaN ? -1 : 0" since aNaN !== bNaN
		}
	}
	// same same
	return 0;
}
/**
 * 
 * @param {?} input
 * @returns {Array}
 */
function ARRAY_SUPER_NATURAL_SPLIT(input) {
	var parts = OBJECT_IS_NOTHING(input)
		? []
		: String(input)
			.split("")
			.map(function(char) { return DIACRITICS[char] || char; })
			.join("")
			.match(ARRAY_FILTER_NATURAL) || [];
	for (var i = 0, p; p = parts[i]; i++) {
		var number = INT(p, 10);
		parts[i] = isNaN(number)
			? p.toUpperCase()
			: number;
	}
	return parts;
}
