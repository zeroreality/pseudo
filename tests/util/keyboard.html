/// <reference path="..\..\blds\pseudo3.js" />

/**
 * Keyboard shortcuts and utility module
 * @expose
 */
ns.keyboard = (function() {
	/**
	 * ShortcutOptions
	 * @constructor
	 */
	function ShortcutOptions() {
		/** @expose */
		this.type = "keydown";
		/** @expose */
		this.propagate = false;
		/** @expose */
		this.notMatching = "";	// "input, textarea";
		/** @expose */
		this.target = DOC;
		/** @expose */
		this.code = 0;
	}
	/**
	 * ShortcutKeys
	 * @constructor
	 */
	function ShortcutKeys() {
		this.ctrl = false;
		this.shft = false;
		this.alt = false;
		this.meta = false;
		this.code = 0;
	}
	/**
	 * 
	 * @this {ShortcutKeys}
	 * @return {!boolean}
	 */
	ShortcutKeys[PROTOTYPE].equals = function(other) {
		return !!other
			&& this.ctrl == other.ctrl
			&& this.shft == other.shft
			&& this.alt == other.alt
			&& this.meta == other.meta
			&& this.code == other.code;
	};
	/**
	 * ShortcutHandle
	 * @constructor
	 * @param {ShortcutKeys} shortcut
	 * @param {ShortcutOptions} options
	 * @param {Function=} func
	 */
	function ShortcutHandle(shortcut, callback, options, func) {
		this.shortcut = shortcut;
		this.type = options.type;
		this.target = options.target;
		this.callback = callback;
		this.func = func;
	}
	/**
	 * 
	 * @this {ShortcutHandle}
	 * @param {ShortcutHandle} other
	 * @param {boolean=} skipCallback
	 * @return {!boolean}
	 */
	ShortcutHandle[PROTOTYPE].equals = function(other, skipCallback) {
		return !!other
			&& (skipCallback || this.callback === other.callback)
			&& this.target === other.target
			&& this.type === other.type
			&& this.shortcut.equals(other.shortcut);
	};

	/**
	 * 
	 * @type {ShortcutOptions}
	 */
	var DEFAULTS = new ShortcutOptions;
	/**
	 * 
	 * @type {Array.<ShortcutHandle>}
	 */
	var SHORTCUTS = [];

	/**
	 * Creates a ShortcutOptions from the given object.
	 * @param {Object=} opts
	 * @return {ShortcutOptions}
	 */
	function makeOptions(opts) {
		var options = new ShortcutOptions;
		for (var each in DEFAULTS) options[each] = DEFAULTS[each];
		if (opts) for (var each in opts) if (each in options) options[each] = opts[each];
		return options;
	}
	/**
	 * Creates a ShortcutKeys from the given string.
	 * @param {string=} keys
	 * @return {ShortcutKeys}
	 */
	function makeShortcut(keys) {
		return keys.split("+").reduce(function(sc, k) {
			switch ((k = k.toLowerCase()).trim()) {
				case "ctrl":
				case "control": sc.ctrl = true; break;
				case "shft":
				case "shift": sc.shft = true; break;
				case "alt":
				case "alternate": sc.alt = true; break;
				case "meta":
				case "win":
				case "windows": sc.meta = true; break;

				default: sc.code = DOM_EVENT_KEY_CODES[k] || k[0].toUpperCase().charCodeAt(0);
			}
			return sc;
		}, new ShortcutKeys);
	}
	/**
	 * Finds the index of a keyboard shortcut
	 * @param {ShortcutHandle} handle
	 * @param {boolean=} skipCallback
	 * @return {!number}
	 */
	function findHandle(handle, skipCallback) {
		return SHORTCUTS.findIndex(function(h) {
			return this.equals(h, skipCallback);
		}, handle);
	}

	/**
	 * Adds a keyboard shortcut
	 * @param {!string} keys
	 * @param {!Function} callback
	 * @param {ShortcutOptions=} opts
	 * @return {!boolean}
	 */
	function addShortcut(keys, callback, opts) {
		var shortcut = makeShortcut(keys),
			options = makeOptions(opts);

		function func(event) {
			//	var key = (event.key || "").toLowerCase(),
			//		code = KEYCODES[key] || String.fromCharCode(event.keyCode).toUpperCase().charCodeAt(0);
			/*
			console.log(
				shortcut.code,
				event.keyCode,
				options.notMatching,
				event.target.jump(options.notMatching, this)
			//	key,
			//	code
			//	String.fromCharCode(event.keyCode),
			//	String.fromCharCode(event.keyCode).toUpperCase(),
			//	String.fromCharCode(event.keyCode).toLowerCase()
			);
			*/
			if (
				// only if event comes from a non-input, or it doesn't matter
				(!options.notMatching || !event.target.jump(options.notMatching, this))
				// and correct key combination
				&& shortcut.ctrl === !!event.ctrlKey
				&& shortcut.shft === !!event.shiftKey
				&& shortcut.alt === !!event.altKey
				&& shortcut.meta === !!event.metaKey
				//	&& shortcut.code === event.keyCode
				//	&& shortcut.code === code
				&& shortcut.code === event.getKey()
			) {
				// invoke callback if shortcut applicable
				callback(event);

				if (!options["propagate"]) {
					// no event propagation
					event.cancelBubble = true;
					event.returnValue = false;

					event.stopPropagation();
					event.preventDefault();
					return false;
				}
			}
			return true;
		}
		var success = findHandle(new ShortcutHandle(shortcut, callback, options)) < 0;
		if (success) {
			options.target.on(options.type, func);
			SHORTCUTS.push(new ShortcutHandle(shortcut, callback, options, func));
		} else {
			//	debugger;
			//	console.warn("addShortcut", shortcut, callback, options);
		}
		return success;
	}
	/**
	 * Removes a keyboard shortcut
	 * @param {!string} keys
	 * @param {Function=} callback
	 * @param {ShortcutOptions=} opts
	 * @return {!boolean}
	 */
	function removeShortcut(keys, callback, opts) {
		var shortcut = makeShortcut(keys),
			options = makeOptions(opts);
		if (!callback) {
			return SHORTCUTS.slice().filter(function(handle) {
				return this.equals(handle, true) && removeShortcut(keys, handle.callback, opts);
			}, new ShortcutHandle(shortcut, callback, options)).length > 0;
		} else {
			var index = findHandle(new ShortcutHandle(shortcut, callback, options)),
				handle = SHORTCUTS[index] || null;
			if (handle) {
				handle.target.off(handle.type, handle.func);
				SHORTCUTS.splice(index, 1);
			} else {
				//	debugger;
				//	console.warn("removeShortcut", shortcut, callback, options);
			}
			return !!handle;
		}
	}
	/**
	 * Finds the index of a keyboard shortcut
	 * @param {!string} keys
	 * @param {Function=} callback
	 * @param {ShortcutOptions=} opts
	 * @return {!boolean}
	 */
	function hasShortcut(keys, callback, opts) {
		var shortcut = makeShortcut(keys),
			options = makeOptions(opts);
		return findHandle(new ShortcutHandle(shortcut, callback, options), !callback) > -1;
	}

	return {
		"codes": DOM_EVENT_KEY_CODES,

		"addShortcut": addShortcut,
		"hasShortcut": hasShortcut,
		"removeShortcut": removeShortcut,
	};
})();
