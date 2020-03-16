/// <reference path="..\..\blds\pseudo3.js" />

/**
 * Binds an inheritance chain for the child class to inheirt members from the parent class.
 * @param {!Function} child
 * @param {!Function} parent
 * @return {!Function} child
 **/
function INHERIT(child, parent) {
	child[PROTOTYPE] = OBJECT.create(parent[PROTOTYPE]);
	return child;
}

/**
 * Adds members from the parents to the child.
 * A full inheritance chain is not preserved.
 * @param {!Function} child
 * @param {...Function} mixins
 * @return {!Function} child
 **/
function MIXIN(child, mixins) {
	mixins = SLICE.call(arguments, 1);
	for (var i = 0, mixin; mixin = mixins[i]; i++) {
		DEFINE_PROPS(child[PROTOTYPE], LOOKUP_PROPS(mixin[PROTOTYPE]));
	}
	return child;
}

/**
 * Utility functions for inheritance.
 * @namespace
 * @expose
 **/
ns.Class = {
	/**
	 * Utility method to help create direct chains of prototype inheritance.
	 **/
	"inherit": INHERIT,
	/**
	 * Utility that adds the given parent classes members to the child class.
	 * Getters and setters are also copied, not the value of the getter.
	 * When multiple mixin classes are used with the same member names, the first mixin's properties are overwritten.
	 **/
	"mixin": MIXIN,
};
