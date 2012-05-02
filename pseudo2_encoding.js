/* ---------------------------------------------------------------------------
 *	Pseudo JavaScript framework, v2.0 (c) 2012 Alex Lein
 *	Pseudo is freely distributable under the terms of an MIT-style license.
 *	For source code and licence, see http://code.google.com/p/pseudo/
 *----------------------------------------------------------------------------
 *  Encoding methods adapted from sources:
 *  http://www.webtoolkit.info/javascript-base64.html
 *  http://www.webtoolkit.info/javascript-crc32.html
 *  http://www.webtoolkit.info/javascript-md5.html
 *  http://www.webtoolkit.info/javascript-sha1.html
 *  http://www.webtoolkit.info/javascript-sha256.html
 *  http://www.webtoolkit.info/javascript-url-decode-encode.html
 *  http://www.webtoolkit.info/javascript-utf8.html
 *--------------------------------------------------------------------------*/
"use strict";
(function(){
	var	CRLF = /[\r\n]/g,
		UTF8_INVALID = /[^a-z0-9\+\/\=]/gim,
		BASE64_KEYS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".split(""),
		MD5_HEX1 = 0x67452301, MD5_HEX2 = 0xEFCDAB89, MD5_HEX3 = 0x98BADCFE, MD5_HEX4 = 0x10325476,
		MD5_UHEXC = 0xC0000000, MD5_UHEX8 = 0x80000000, MD5_UHEX4 = 0x40000000, MD5_UHEX3 = 0x3FFFFFFF;
	
	// utf8
	function encodeUtf8(string) {
		string = string.replace(CRLF,"\n");
		var i = 0, l = string.length, c, utf8 = [];
		while (i < l) {
			c = string.charCodeAt(i++);
			if (c < 128) {
				utf8.push(String.fromCharCode(c));
			} else if((c > 127) && (c < 2048)) {
				utf8.inject([
					String.fromCharCode((c >> 6) | 192),
					String.fromCharCode((c & 63) | 128)
				]);
			} else {
				utf8.inject([
					String.fromCharCode((c >> 12) | 224),
					String.fromCharCode(((c >> 6) & 63) | 128),
					String.fromCharCode((c & 63) | 128)
				]);
			}
		};
		return utf8.join("");
	};
	function decodeUtf8(string) {
		var i = 0, l = string.length, c = 0, c1 = 0, c2 = 0, utf8 = [];
		while (i < l) {
			c = string.charCodeAt(i);
			if (c < 128) {
				utf8.push(String.fromCharCode(c));
				i++;
			} else if((c > 191) && (c < 224)) {
				c2 = string.charCodeAt(i+1);
				utf8.push(String.fromCharCode(((c & 31) << 6) | (c2 & 63)));
				i += 2;
			} else {
				c2 = string.charCodeAt(i+1);
				c3 = string.charCodeAt(i+2);
				utf8.push(String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)));
				i += 3;
			};
		};
		return utf8.join("");
	};
	
	// md5
	function wordArray(string) {
		var	i = 0,
			pos = 0,
			count = 0,
			length = string.length,
			numberOfWords = ((((length + 8) - ((length + 8) % 64)) / 64) + 1) * 16,
			array = new Array(numberOfWords-1);
		while (i < length) {
			count = (i-(i % 4))/4;
			pos = (i % 4)*8;
			array[count] = (array[count] | (string.charCodeAt(i)<<pos));
			i++;
		};
		count = (i-(i % 4))/4;
		pos = (i % 4)*8;
		array[count] = array[count] | (0x80<<pos);
		array[numberOfWords-2] = length<<3;
		array[numberOfWords-1] = length>>>29;
		return array;
	};
	function rotate(value,shift) { return (value<<shift) | (value>>>(32-shift)) };
	function F(x,y,z) { return (x & y) | ((~x) & z) };
	function FF(a,b,c,d,x,s,ac) {
		a = unsigned(a, unsigned(unsigned(F(b, c, d), x), ac));
		return unsigned(rotate(a, s), b);
	};
	function G(x,y,z) { return (x & z) | (y & (~z)) };
	function GG(a,b,c,d,x,s,ac) {
		a = unsigned(a, unsigned(unsigned(G(b, c, d), x), ac));
		return unsigned(rotate(a, s), b);
	};
	function H(x,y,z) { return (x ^ y ^ z) };
	function HH(a,b,c,d,x,s,ac) {
		a = unsigned(a, unsigned(unsigned(H(b, c, d), x), ac));
		return unsigned(rotate(a, s), b);
	};
	function I(x,y,z) { return (y ^ (x | (~z))) };
	function II(a,b,c,d,x,s,ac) {
		a = unsigned(a, unsigned(unsigned(I(b, c, d), x), ac));
		return unsigned(rotate(a, s), b);
	};
	function unsigned(x,y) {
		var	x8 = (x & MD5_UHEX8),
			y8 = (y & MD5_UHEX8),
			x4 = (x & MD5_UHEX4),
			y4 = (y & MD5_UHEX4),
			xy = (x & MD5_UHEX3) + (y & MD5_UHEX3);
		if (x4 & y4) return xy ^ MD5_UHEX8 ^ x8 ^ y8;
		else if (!(x4 | y4)) return xy ^ x8 ^ y8;
		else if (xy & MD5_UHEX4) return xy ^ MD5_UHEXC ^ x8 ^ y8;
		else return xy ^ MD5_UHEX4 ^ x8 ^ y8;
	};
	function wordToHex(word) {
		var i = 0, byte, hex = "", temp = "";
		for (; i<=3; i++) {
			byte = (word>>>(i*8)) & 255;
			temp = "0"+ byte.toString(16);
			hex += temp.substr(temp.length-2,2);
		};
		return hex;
	};
	
	return this.Encoding = {
		// utf8
		"encodeUtf8": encodeUtf8,
		"decodeUtf8": decodeUtf8,
		
		// url
		"encodeUrl": function encodeUrl(string) { return escape(encodeUtf8(string)) },
		"decodeUrl": function decodeUrl(string) { return decodeUtf8(unescape(string)) },
		
		// base64
		"encodeBase64": function encodeBase64(string) {
			string = encodeUtf8(string);
			var chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0, l = string.length, base64 = [];
			while (i < l) {
				chr1 = input.charCodeAt(i++);
				chr2 = input.charCodeAt(i++);
				chr3 = input.charCodeAt(i++);
				enc1 = chr1 >> 2;
				enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
				enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
				enc4 = chr3 & 63;
				if (isNaN(chr2)) enc3 = enc4 = 64;
				else if (isNaN(chr3)) enc4 = 64;
				base64.inject([BASE64_KEYS[enc1],BASE64_KEYS[enc2],BASE64_KEYS[enc3],BASE64_KEYS[enc4]]);
			};
			return base64.join("");
		},
		"decodeBase64": function decodeBase64(base64) {
			base64 = base64.replace(UTF8_INVALID,"");
			var string = [], i = 0, l = base64.length, chr1, chr2, chr3, enc1, enc2, enc3, enc4;
			while (i < l) {
				enc1 = BASE64_KEYS.indexOf(base64.charAt(i++));
				enc2 = BASE64_KEYS.indexOf(base64.charAt(i++));
				enc3 = BASE64_KEYS.indexOf(base64.charAt(i++));
				enc4 = BASE64_KEYS.indexOf(base64.charAt(i++));
				chr1 = (enc1 << 2) | (enc2 >> 4);
				chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
				chr3 = ((enc3 & 3) << 6) | enc4;
				string.push(String.fromCharCode(chr1));
				if (enc3 != 64) string.push(String.fromCharCode(chr2));
				if (enc4 != 64) string.push(String.fromCharCode(chr3));
			};
			return decodeUtf8(string.join(""));
		},
		
		// md5
		"md5": function md5(string) {
			var	x = wordArray(encodeUtf8(string)),
				k = 0, l = x.length,
				a = MD5_HEX1, b = MD5_HEX2, c = MD5_HEX3, d = MD5_HEX4,
				AA, BB, CC, DD,
				S11 = 7, S12 = 12, S13 = 17, S14 = 22,
				S21 = 5, S22 = 9 , S23 = 14, S24 = 20,
				S31 = 4, S32 = 11, S33 = 16, S34 = 23,
				S41 = 6, S42 = 10, S43 = 15, S44 = 21;
			for (; k<l; k+=16) {
				AA = a;
				BB = b;
				CC = c;
				DD = d;
				a = FF(a,b,c,d,x[k+0], S11,0xD76AA478);
				d = FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
				c = FF(c,d,a,b,x[k+2], S13,0x242070DB);
				b = FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
				a = FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
				d = FF(d,a,b,c,x[k+5], S12,0x4787C62A);
				c = FF(c,d,a,b,x[k+6], S13,0xA8304613);
				b = FF(b,c,d,a,x[k+7], S14,0xFD469501);
				a = FF(a,b,c,d,x[k+8], S11,0x698098D8);
				d = FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
				c = FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
				b = FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
				a = FF(a,b,c,d,x[k+12],S11,0x6B901122);
				d = FF(d,a,b,c,x[k+13],S12,0xFD987193);
				c = FF(c,d,a,b,x[k+14],S13,0xA679438E);
				b = FF(b,c,d,a,x[k+15],S14,0x49B40821);
				a = GG(a,b,c,d,x[k+1], S21,0xF61E2562);
				d = GG(d,a,b,c,x[k+6], S22,0xC040B340);
				c = GG(c,d,a,b,x[k+11],S23,0x265E5A51);
				b = GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
				a = GG(a,b,c,d,x[k+5], S21,0xD62F105D);
				d = GG(d,a,b,c,x[k+10],S22,0x2441453);
				c = GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
				b = GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
				a = GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
				d = GG(d,a,b,c,x[k+14],S22,0xC33707D6);
				c = GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
				b = GG(b,c,d,a,x[k+8], S24,0x455A14ED);
				a = GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
				d = GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
				c = GG(c,d,a,b,x[k+7], S23,0x676F02D9);
				b = GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
				a = HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
				d = HH(d,a,b,c,x[k+8], S32,0x8771F681);
				c = HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
				b = HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
				a = HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
				d = HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
				c = HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
				b = HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
				a = HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
				d = HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
				c = HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
				b = HH(b,c,d,a,x[k+6], S34,0x4881D05);
				a = HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
				d = HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
				c = HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
				b = HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
				a = II(a,b,c,d,x[k+0], S41,0xF4292244);
				d = II(d,a,b,c,x[k+7], S42,0x432AFF97);
				c = II(c,d,a,b,x[k+14],S43,0xAB9423A7);
				b = II(b,c,d,a,x[k+5], S44,0xFC93A039);
				a = II(a,b,c,d,x[k+12],S41,0x655B59C3);
				d = II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
				c = II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
				b = II(b,c,d,a,x[k+1], S44,0x85845DD1);
				a = II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
				d = II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
				c = II(c,d,a,b,x[k+6], S43,0xA3014314);
				b = II(b,c,d,a,x[k+13],S44,0x4E0811A1);
				a = II(a,b,c,d,x[k+4], S41,0xF7537E82);
				d = II(d,a,b,c,x[k+11],S42,0xBD3AF235);
				c = II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
				b = II(b,c,d,a,x[k+9], S44,0xEB86D391);
				a = unsigned(a,AA);
				b = unsigned(b,BB);
				c = unsigned(c,CC);
				d = unsigned(d,DD);
			};
			return (wordToHex(a)+wordToHex(b)+wordToHex(c)+wordToHex(d)).toLowerCase();
		},
		
		// crc
		"crc32": function crc32(string) {
			string = encodeUtf8(string);
			var crc = -1, x = 0, y = 0, i = 0, l = string.length;
			for (; i<l; i++) {
				y = (crc ^ string.charCodeAt(i)) & 0xFF;
				x = "0x"+ CRC_TABLE.substr(y * 9, 8);
				crc = (crc >>> 8) ^ x;
			};
			return crc ^ (-1);
		}
	};
}).call(Pseudo);