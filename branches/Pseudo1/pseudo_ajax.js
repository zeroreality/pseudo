/* ---------------------------------------------------------------------------
 *  Pseudo JavaScript framework, version 1.1b
 *  (c) 2009 Alex Lein
 *
 *  Pseudo is based heavily on the awesome
 *  Prototype JavaScript framework (c) 2005-2009 Sam Stephenson
 *
 *  Pseudo is freely distributable under the terms of an MIT-style license.
 *  For details, see http://www.opensource.org/licenses/mit-license.php
 *--------------------------------------------------------------------------*/
Object.extend(Pseudo.Xml = {},function(){
	var METHOD = "none", XML_PARSER, XML_SERIALIZER, MSXML_TYPE, MSXML_TYPES;
	
	if (document.implementation && document.implementation.createDocument && window.XMLSerializer && window.DOMParser) {
		METHOD = "W3C";
		XML_PARSER = new DOMParser();
		XML_SERIALIZER = new XMLSerializer();
	} else if (window.ActiveXObject) {
		METHOD = "MS";
		MSXML_TYPES = ["MSXML4.DOMDocument","MSXML3.DOMDocument","MSXML2.DOMDocument","MSXML.DOMDocument","Microsoft.XMLDOM"];
	};
	
	// methods
	function implementDocument(ns,name) {
		return document.implementation.createDocument(ns || "", name || "", null);
	};
	function activeXDocument(ns,name) {
		var xml = MSXML_TYPE ? new ActiveXObject(MSXML_TYPE) : null;
		if (!xml) {
			for (var i=0,x; x=MSXML_TYPES[i]; i++) {
				try { xml = new ActiveXObject(x) } catch(e) {};
				if (xml) { MSXML_TYPE = x; break };
			};
		};
		if (!xml) throw "MSXML not found";
		xml.async = false;
		if (name) xml.loadXML(!ns ? "<"+ name +" />" : "<a0:"+ name +" xmlns:a0=\""+ ns +"\" />");
		return xml;
	};
	
	var CREATE_DOCUMENT = METHOD === "W3C" ? implementDocument : METHOD === "MS" ? activeXDocument : null;
	function createDocument(namespaceURI,documentElementName,input) {
		var doc = CREATE_DOCUMENT(namespaceURI,documentElementName);
		if (Object.isString(input))			Xml.setInnerXml(doc,input);
		else if (Object.isElement(input))	Xml.setInnerXml(doc,Xml.getInnerXml(input));
		else if (Object.isDocument(input))	Xml.setInnerXml(doc,Xml.getInnerXml(input.documentElement));
		return doc;
	};
	
	function w3cGetInnerXml(element) {
		return XML_SERIALIZER.serializeToString(element);
	};
	function w3cSetInnerXml(element,innerXml) {
		while (element.hasChildNodes()) element.removeChild(element.lastChild);
		if (innerXml && innerXml.length) {
			var	doc = !element.importNode ? element.ownerDocument : element,
				temp = XML_PARSER.parseFromString(innerXml,"text/xml");
			for (var i=0,n; n=temp.childNodes[i]; i++) element.appendChild(doc.importNode(n,true));
			doc = temp = null;
		};
		return element;
	};
	function msGetInnerXml(element) {
		return element.xml;
	};
	function msSetInnerXml(element,innerXml) {
		if (!innerXml) innerXml = "";
		element.loadXML(innerXml);
		return element;
	};
	function getInnerText(element) {
		var inner = [];
		if (element.hasChildNodes()) {
			for (var i=0,n; n=element.childNodes[i]; i++) {
				if (n.nodeType === 1) inner.push(getInnerText(n));
				else if (n.nodeType === 3) inner.push(n.nodeValue);
			};
		};
		return inner.join("");
	};
	
	return {
		"METHOD": METHOD,
		"document": CREATE_DOCUMENT,
		"createDocument": createDocument,
		"getInnerXml": METHOD === "W3C" ? w3cGetInnerXml : METHOD === "MS" ? msGetInnerXml : null,
		"setInnerXml": METHOD === "W3C" ? w3cSetInnerXml : METHOD === "MS" ? msSetInnerXml : null,
		"getInnerText": getInnerText
	};
}.call(Pseudo));
Object.extend(Pseudo.Ajax = {},function(){
	var METHOD = "none", MSXHR_TYPE, MSXHR_TYPES, HEADERS = {
		"Accept": "text/javascript, text/html, application/xml, text/xml, */*",
		"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
		"X-Requested-With": "XMLHttpRequest", "X-Pseudo-Version": Pseudo.Version
	};
	
	if (window.XMLHttpRequest) {
		METHOD = "W3C";
	} else if (window.ActiveXObject) {
		METHOD = "MS";
		MSXHR_TYPES = ["MSXML4.XMLHTTP","MSXML3.XMLHTTP","MSXML2.XMLHTTP","MSXML.XMLHTTP","Microsoft.XMLHTTP"];
	};
	
	function createRequest() {
		return new XMLHttpRequest();
	};
	function activeXRequest() {
		var request = MSXHR_TYPE ? new ActiveXObject(MSXHR_TYPE) : null;
		if (!request) {
			for (var i=0,x; x=MSXHR_TYPES[i]; i++) {
				try { request = new ActiveXObject(x) } catch(e) {};
				if (request) { MSXHR_TYPE = x; break };
			};
		};
		if (!request) throw "MSXML not found";
		return request;
	};

	function getStandardHeaders() { return Object.clone(HEADERS) };
	function getText(transport) {
		var text = "";	// IE throws a fit when you access transport.responseText before it's available
		try { text = transport.responseText } catch(x) {};
		return text;
	};
	function getStatusCode(transport) {
		var results;
		try { results = transport.status } catch(x) {};
		return results;
	};
	function getStatusText(transport) {
		var results = "Socket Error";
		try { results = transport.statusText } catch(x) {};
		return results;
	};
	function getStatus(transport) {
		return {
			"code": getStatusCode(transport),
			"text": getStatusText(transport),
			"body": getText(transport)
		};
	};
	function getResponseSize(transport) {
		try { return parseInt(transport.getResponseHeader("Content-Length")) } catch(x) {};
		return NaN;
	};
	function getProgress(transport) {
		if (transport.readyState === 4) return 1;
		var percent = 0, size = getResponseSize(transport) || 0;
		if (size > 0) percent = getText(transport).length / size;
		return percent * 0.85 + (0.05 * transport.readyState);
	};
	function isResponseOK(transport) {
		var status = getStatusCode(transport);
		return !!(status >= 200 && status <= 206 || status === 304);
	};
	
	return {
		"METHOD": METHOD,
		"STANDARD_HEADERS": HEADERS,
		"headers": getStandardHeaders,
		"transport": METHOD === "W3C" ? createRequest : METHOD === "MS" ? activeXRequest : null,
		
		"getProgress": getProgress,
		"getResponseSize": getResponseSize,
		"getStatusCode": getStatusCode,
		"getStatusText": getStatusText,
		"getStatus": getStatus,
		"getText": getText,
		"isResponseOK": isResponseOK
	};
}.call(Pseudo));
if (!window.Xml) window.Xml = Pseudo.Xml;
if (!window.Ajax) window.Ajax = Pseudo.Ajax;

/*****************************************************************************
*** Request ******************************************************************
*****************************************************************************/
Ajax.Request = Class.create(null,{
	"URL": Class.Properties.String,
	"Data": Class.Properties.String,
	"Method": Class.Properties.String,
	"Sync": Class.Properties.Boolean,
	"Persist": Class.Properties.Boolean
},{
	"constructor": function(url,data,options,callbacks,headers) {
		options = Object.extend(options||{},Ajax.Request.Defaults);
		this.__transport = Ajax.transport();
		this.__responder = Ajax.Request.responder.bind(this);
		if (Pseudo.Browser.IE) {
			if (options.persist) Ajax.Request.createPersist.call(this);
			else this.handle("Persistchanged",Ajax.Request.createPersist);
		};
		
		this.setURL(url);
		this.setData(data);
		this.setMethod(options.method);
		this.setSync(options.sync);
		this.setPersist(options.persist);
		this.headers = Object.extend(Ajax.headers(),headers||{});
		if (callbacks) for (var each in callbacks) this.handle(each,callbacks[each]);
		if (options.autofire) this.load();
	},
	"dispose": function() {
		Ajax.Request.cancel(this.__transport);
		this.__transport = null;
		this.__responder = null;
		this.fumble();
	},
	"load": function(force) {
		var loaded = !force ? Ajax.getProgress(this.__transport) : 1;
		if (loaded === 1 || loaded === 0) {
			var event = this.raise("before",this.__transport);
			if (event && event.isStopped()) return;
			if (Pseudo.Ajax.METHOD === "MS") Ajax.Request.cancel(this.__transport);	// IE6 memleak
			this.__runSyncAfter = !!this.getSync();
			
			this.__transport.onreadystatechange = this.__responder;
			this.__transport.open(this.method(),this.getURL(),!this.getSync());
			for (var each in this.headers) this.__transport.setRequestHeader(each,this.headers[each]);
			
			// some browsers (IE) require the .send() for sync requests, some throw an error (Chrome/Safari)
			try { this.__transport.send(this.getData()) }
			catch(x) { /* console.warn(this,x) */ };
			if (this.__runSyncAfter) this.__responder();
			
			return true;
		} else {
			return false;
		};
	},
	"method": function() {
		var method = this.getMethod().toUpperCase();
		if (method === "AUTO") method = this.getData().length ? "POST" : "GET";
		return method;
	},
	"persist": function() {
		this.responseXML = this.__transport.responseXML;
		this.responseText = this.__transport.responseText;
	},
	"cancel": function() {
		Ajax.Request.cancel(this.__transport);
		this.raise("canceled");
		this.raise.defer(this,"ready");
		return true;
	},
	"isBusy": function() {
		var loaded = this.getProgress();
		return loaded > 0 && loaded < 1;
	},
	"isReady": function() { return !this.isBusy() },
	"isResponseOK": function() { return Ajax.isResponseOK(this.__transport) },
	"getProgress": function() { return Ajax.getProgress(this.__transport) },
	"getStatus": function() { return Ajax.getStatus(this.__transport) }
},{
	"Defaults": {
		"method": "auto",
		"sync": false,
		"persist": false
	},
	"cancel": function(transport) {
		// Firefox raises readystatechange event when the transport is aborted
		try { transport.onreadystatechange = Pseudo.um } catch(x) {};
		try { transport.abort() } catch(x) {};	// can be null when leaving page
	},
	"responder": function() {
		if (this.__transport.readyState >= 3) this.raise("loading",Ajax.getProgress(this.__transport),Ajax.getText(this.__transport));
		if (this.__transport.readyState === 4) {
			this.__runSyncAfter = false;
			if (this.getPersist()) this.persist();
			if (Ajax.isResponseOK(this.__transport)) {
				this.raise("loaded",this.__transport.responseXML,this.__transport.responseText,this.__transport);
			} else {
				this.raise("errored",Ajax.getStatus(this.__transport),this.__transport.responseText,this.__transport);
			};
			if (Pseudo.Ajax.METHOD === "MS") Ajax.Request.cancel(this.__transport);	// IE6 memleak
			this.raise.defer(this,"ready");
		};
	},
	"createPersist": function() {
		this.responseXML = Xml.createDocument();
		this.fumble("Persistchanged",arguments.callee);
	}
});
//if (Xml.METHOD === "MS") Ajax.Request.addMethods({
if (Pseudo.Browser.IE) Ajax.Request.addMethods({
	"persist": function() {
		this.responseText = this.__transport.responseText;
		Xml.setInnerXml(this.responseXML,this.__transport.responseXML ? this.responseText : "");
	}
});
Ajax.IntervalRequest = Class.create(Ajax.Request,{
	"Timer": Class.Properties.Generic,
	"Working": Class.Properties.Boolean,
	"Interval": Class.Properties.Number
},{
	"constructor": function($super,url,data,seconds,callbacks,headers) {
		this.setInterval(seconds);
		this.setWorking(false);
		$super(url,data,null,callbacks,headers);
		this.__repeater = Ajax.IntervalRequest.repeater.bind(this);
		this.handle("ready",this.__repeater);
	},
	"dispose": function($super) {
		this.stop();
		$super();
	},
	"start": function() {
		this.setWorking(true);
		this.load();
	},
	"pause": function() {
		clearTimeout(this.getTimer());
		this.setWorking(false);
	},
	"stop": function() {
		this.pause();
		this.cancel();
	},
	"toggle": function() {
		if (this.getWorking()) this.pause();
		else this.start();
	},
	"removeHandler": function($super,eventName,handler) {
		$super(eventName,handler);
		if (!this.isHandled("ready",this.__repeater)) this.handle("ready",this.__repeater);
	}
},{
	"repeater": function() {
		if (this.getWorking()) {
			this.setTimer(this.load.delay({
				"scope": this,
				"timeout": this.getInterval() * 1000
			}));
		};
	}
},{
	"fumble": "removeHandler"
});