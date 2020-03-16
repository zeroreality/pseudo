/// <reference path="..\..\blds\pseudo3.js" />

/**
 * Reference to an IFRAME element in use by some of the protocol checking hacks.
 * @type {Window}
 */
var PROTOCOL_TARGET = WIN;
/**
 * Reference to an IFRAME element in use by some of the protocol checking hacks.
 * @type {HTMLIFrameElement}
 */
var PROTOCOL_CHECK_IFRAME = null;
/**
 * Reference to the timer in use by some of the protocol checking hacks.
 * @type {!number}
 */
var PROTOCOL_TIMER = 0;
/**
 * 
 * @type {Function}
 */
var PROTOCOL_SUCCESS = null;
/**
 * 
 * @type {Function}
 */
var PROTOCOL_FAILURE = null;
/**
 * 
 * @type {number}
 */
var PROTOCOL_FAILURE_TIMEOUT = 5 * 1000;	// 5 seconds
/**
 * Gets the protocol checker <iframe> element. If it doesn't exist, it is created.
 * @returns {HTMLIFrameElement}
 */
function PROTOCOL_IFRAME() {
	return PROTOCOL_CHECK_IFRAME
		|| (PROTOCOL_CHECK_IFRAME = BODY.appendChild(DOC.element("iframe", {
			"style": "position:absolute;top:-9999px;visibility:hidden",
		})));
}
/**
 * 
 * @param {Event} event
 */
function PROTOCOL_BLUR_SUCCESS(event) {
	//	console.info("PROTOCOL_BLUR_SUCCESS");
	CLEAR_TIMER(PROTOCOL_TIMER);
	PROTOCOL_TARGET.off("blur", PROTOCOL_BLUR_SUCCESS);
	PROTOCOL_SUCCESS();
}
/**
 * 
 * @param {Event=} event
 */
function PROTOCOL_BLUR_FAILURE(event) {
	//	console.info("PROTOCOL_BLUR_FAILURE");
	CLEAR_TIMER(PROTOCOL_TIMER);
	PROTOCOL_TARGET.off("blur", PROTOCOL_BLUR_SUCCESS);
	PROTOCOL_FAILURE();
}

/**
 * Runs a series of checks to see if a given protocol is in use.
 * This type of check is useful if you want to know if a given application like Steam of Join.Me is installed.
 * @param {!string} uri
 * @param {Function=} success
 * @param {Function=} failure
 */
function checkProtocolHandled(uri, success, failure) {
	if (PROTOCOL_FAILURE) PROTOCOL_FAILURE();

	/**
	 * Wrapper function to invoke the success callback if it is defined.
	 */
	PROTOCOL_SUCCESS = function() {
		PROTOCOL_SUCCESS =
			PROTOCOL_FAILURE = null;
		if (success) success(uri);
	};
	/**
	 * Wrapper function to invoke the failure callback if it is defined.
	 */
	PROTOCOL_FAILURE = function() {
		PROTOCOL_SUCCESS =
			PROTOCOL_FAILURE = null;
		if (failure) failure(uri);
	};

	switch (PSEUDO_BROWSER()) {
		//	case "edge": for when Edge beta is released into the wild
		case "chrome":
			openUriWithTimeoutHack(uri);
			break;
		case "firefox":
			openUriWithHiddenFrameException(uri);
			break;
		case "ie":
		case "edge":
			if (NAV["msLaunchUri"]) {
				//for IE and Edge in Win 8 and Win 10
				openUriWithMsLaunchUri(uri);
			} else {
				openUriWithHiddenFrame(uri);
			}
			break;
		case "opera":
		default:
			PROTOCOL_FAILURE();
			break;
	}
}
/**
 * Returns a Promise that will either be resolved or rejected when checking the protocol.
 * @param {!string} uri
 * @return {!Promise}
 **/
function checkProtocolPromise(uri) {
	return new Promise(function(resolve, reject) {
		checkProtocolHandled(uri, resolve, reject);
	});
}

/**
 * Attempt to launch an application URI using the IE specific msLaunchUri function.
 * @param {!string} uri
 */
function openUriWithMsLaunchUri(uri) {
	NAV["msLaunchUri"](
		uri,
		PROTOCOL_SUCCESS,
		PROTOCOL_FAILURE
	);
}
/**
 * Attempt to launch an application URI by navigating the main window away from its current path.
 * This method waits for X second before deciding that the navigation failed.
 * @param {!string} uri
 */
function openUriWithTimeoutHack(uri) {
	PROTOCOL_TARGET = WIN;
	while (PROTOCOL_TARGET !== PROTOCOL_TARGET.parent) PROTOCOL_TARGET = PROTOCOL_TARGET.parent;	// blur event from top level window
	PROTOCOL_TARGET.once("blur", PROTOCOL_BLUR_SUCCESS);
	PROTOCOL_TIMER = SET_TIMER(PROTOCOL_BLUR_FAILURE, PROTOCOL_FAILURE_TIMEOUT);
	WIN.location = uri;
}
/**
 * Attempt to launch an application URI using an embedded IFRAME.
 * This method checks for an exception to be thrown when trying to set the frame's path.
 * @param {!string} uri
 */
function openUriWithHiddenFrameException(uri) {
	try {
		PROTOCOL_IFRAME().contentWindow.location.href = uri;
		PROTOCOL_SUCCESS();
	} catch (e) {
		if (e.name === "NS_ERROR_UNKNOWN_PROTOCOL") {
			PROTOCOL_FAILURE();
		} else {
			// unknown condition?
			throw e;
		}
	}
}
/**
 * Attempt to launch an application URI using an embedded IFRAME.
 * This method waits for X second before deciding that the navigation failed.
 * @param {!string} uri
 */
function openUriWithHiddenFrame(uri) {
	PROTOCOL_TARGET = WIN.once("blur", PROTOCOL_BLUR_SUCCESS);
	PROTOCOL_TIMER = SET_TIMER(PROTOCOL_BLUR_FAILURE, PROTOCOL_FAILURE_TIMEOUT);
	PROTOCOL_IFRAME().contentWindow.location.href = uri;
}

/** @expose */
ns.protocol = {
	/**
	 * Attempts to run the given URI to see if the protocol is handled in the browser.
	 **/
	"check": checkProtocolHandled,
	/**
	 * Returns a Promise that will either be resolved or rejected when checking the protocol.
	 **/
	"promise": checkProtocolPromise,
};
