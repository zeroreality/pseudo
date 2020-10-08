/// <reference path="..\..\blds\pseudo3.js" />

/**
 * @namespace
 * @expose
 */
ns.Forms = {};

/**
 * @this {HTMLElement}
 */
function FORMS_EDITABLE_FOCUS() {
	this.dataset["_before_edit"] = this.innerHTML;
}
/**
 * @this {HTMLElement}
 */
function FORMS_EDITABLE_BLUR() {
	if (this.dataset["_before_edit"] !== this.innerHTML) this.fire("change");
}
/**
 * @this {HTMLElement}
 */
function FORMS_EDITABLE_STYLE(e) {
	// add or remove bold, italic, underline, colour, etc...
}

/**
 * @expose
 * @param {HTMLElement} div
 * @param {boolean} rich
 */
ns.Forms.editable = function(div, rich) {
	div.on("focus", FORMS_EDITABLE_FOCUS);
	div.on("blur", FORMS_EDITABLE_BLUR);
	//	if (rich) div.on("keyup", FORMS_EDITABLE_STYLE);
};


/**
 * @expose
 */
ns.Opaque = {};

/**
 * @expose
 */
ns.Opaque.create = function(title, body) {
	return DOC["element"]("article", {
		"id": "opaque",
		"innerHTML": "<div class=\"modal\"><header>" + title + "</header><article><form action=\"javascript:void(0)\" class=\"standard_form\">" + body + "</form></article></div>"
	});
	/*
	<article id="opaque">
		<div class="modal">
			<header>
				<h1><asp:literal runat="server" meta:resourcekey="SignIn" /></h1>
				<ff:language runat="server" />
			</header>
			<article>
				<form class="standard_form">
					<section class="form_chunk">
						<label for="username" class="field">
							<span class="fieldname"><asp:literal runat="server" meta:resourcekey="Username" /></span>
							<input type="email" required="required" name="username" id="username" />
							<span class="notice"><asp:literal runat="server" meta:resourcekey="Please_enter_username" /></span>
						</label>
						<label for="password" class="field">
							<span class="fieldname"><asp:literal runat="server" meta:resourcekey="Password" /></span>
							<input type="password" required="required" name="password" id="password" />
							<span class="notice"><asp:literal runat="server" meta:resourcekey="Please_enter_password" /></span>
						</label>
					</section>
					<div class="grid btnbar">
						<button class="large submit" type="button"><asp:literal runat="server" meta:resourcekey="SignIn" /></button>
					</div>
				</form>
			</article>
		</div>
	</article>
	*/
};


///**
// * Keeps the content of date fields up to date
// * @expose
// */
//ns["Dates"] = new (function() {
//	var me = this;
//	/** @type {string} */
//	var FORMAT = "";
//	/** @type {number} */
//	var TIMER = 0;
//	/** @type {Array.<LinkCompare>} */
//	var LINKS = [];
//	/** @type {{after:string,before:string,now:string}|null} */
//	var SUFFIX = null;
//	/** @type {{after:string,before:string,now:string}|null} */
//	var PREFIX = null;

//	/**
//	 * @this {HTMLElement}
//	 * @param {!LinkCompare} link
//	 * @return {boolean}
//	 */
//	function findLink(link) {
//		return link.node === this;
//	}
//	/**
//	 * @constructor
//	 * @param {!HTMLElement} node
//	 * @param {!Date} date
//	 * @param {!number} levels
//	 * @param {!string} invalid
//	 */
//	function LinkCompare(node, date, levels, invalid) {
//		/** @type {HTMLElement} */
//		this.node = node;
//		/** @type {Date} */
//		this.date = date;
//		/** @type {number} */
//		this.levels = levels;
//		/** @type {string} */
//		this.invalid = invalid;
//	}
//	/**
//	 * Kills it
//	 * @this {LinkCompare}
//	 */
//	LinkCompare[PROTOTYPE].dispose = function() {
//		this.levels = 0;
//		this.invalid = "";
//		this.node =
//		this.date =
//		this.suffix =
//		this.prefix = null;
//	};
//	/**
//	 * Updates the node
//	 * @this {LinkCompare}
//	 */
//	LinkCompare[PROTOTYPE].kajigger = function() {
//		if (DOC.contains(this.node)) {
//			var date = this.date,
//				now = new Date(),
//				full = date.toFormat(FORMAT);
//			if (IS_NAN(date.valueOf())) {
//				this.node.innerHTML = this.invalid;
//			} else if (now.isSameDay(date)) {
//				this.node.innerHTML = now.contextString(date, this.levels, this.suffix, this.prefix);
//			} else {
//				me.remove(this.node);
//				this.node.innerHTML = full;
//			}
//			this.node.title = full;
//		}
//	};

//	/**
//	 * @expose
//	 * @param {!HTMLElement} element
//	 * @param {Date=} date
//	 * @param {string=} invalid
//	 * @param {number=} levels
//	 */
//	me.merge = function(element, date, invalid, levels) {
//		var link = LINKS[LINKS.findIndex(findLink, element)];
//		if (!link) {
//			LINKS.push(link = new LinkCompare(
//				element,
//				date || DATE_INVALID,
//				INT(levels, 10) || 1,
//				invalid || DATE_INVALID.toString()
//			));
//		} else {
//			link.date = date || link.date;
//			link.levels = INT(levels, 10) || link.levels;
//			link.invalid = invalid || link.invalid;
//		}
//		link.kajigger();
//		return element;
//	};
//	/**
//	 * @expose
//	 * @param {!HTMLElement} element
//	 */
//	me.remove = function(element) {
//		var index = LINKS.findIndex(findLink, element);
//		if (index > -1) LINKS.removeAt(index);
//	};
//	/**
//	 * Begin
//	 * @expose
//	 */
//	me.start = function() {
//		if (!TIMER) TIMER = SET_EVERY(function() {
//			LINKS.forEach(function(link) {
//				link.kajigger();
//				//	console.log(link.node.innerHTML, link);
//			}, 1000);
//		});
//	};
//	/**
//	 * Knock it off
//	 * @expose
//	 */
//	me.stop = function() {
//		TIMER = CLEAR_EVERY(TIMER) || 0;
//	};
//	/**
//	 * Set full date/time format
//	 * @expose
//	 * @param {string=} format
//	 */
//	me.setFormat = function(format) {
//		FORMAT = format || "ddd, MMM d, yyyy h:mm tt";
//	};
//	/**
//	 * Set precix/suffix formats
//	 * @expose
//	 * @param {{after:string,before:string,now:string}=} suffix
//	 * @param {{after:string,before:string,now:string}=} prefix
//	 */
//	me.setContexts = function(suffix, prefix) {
//		SUFFIX = suffix || DATE_HELPER_COMPARE_SUFFIX;
//		PREFIX = prefix || DATE_HELPER_COMPARE_PREFIX;
//	};

//	// init
//	me.setFormat();
//	me.setContexts();
//	me.start();
//});
