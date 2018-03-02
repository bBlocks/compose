/** @namespace bb */

(function () {
	
	/** 
	 * Compose two or more objects
	 * @param {...object} Objects to compose.  target, source1, source2, ...
	 * @return {object} Target object.
	 * @memberof bb
	*/
	function compose() {
		var args = arguments;
		var source = args[0];
		if (source == undefined) { return; }
		if (args.length <= 1) { return source; }

		for (let i = 1; i < args.length; i++) {
			let obj = args[i];
			if (typeof obj != 'object') {
				console.warn('Invalid parameter type "' + (typeof obj) + '" for the parameter #' + i);
				continue;
			}
			Object.defineProperties(source, Object.getOwnPropertyDescriptors(obj));
		}
		return source;
	}

	/** 
	 * Inherit and compose
	 * @param {...object} Prototype and optional additional sources for composition
	 * @return {object} New object created from the prototype and results of composition
	 * @memberof bb
	*/
	function inherit() {
		var args = arguments;
		if (args[0] == undefined) { args[0] = Object.prototype; }
		args[0] = Object.create(args[0], Object.getOwnPropertyDescriptors(args[0]));
		if (args.length == 1) { return args[0]; }
		return compose.apply(this, args);
	}

	// Object.getOwnPropertyDescriptors polyfill for IE11
	if (!Object.hasOwnProperty('getOwnPropertyDescriptors')) {
		let supportsSymbol = Object.hasOwnProperty('getOwnPropertySymbols');
		Object.defineProperty(
			Object,
			'getOwnPropertyDescriptors',
			{
				configurable: true,
				writable: true,
				value: function getOwnPropertyDescriptors(object) {
					var keys = Object.getOwnPropertyNames(object);
					if (supportsSymbol) {
						keys = keys.concat(Object.getOwnPropertySymbols(object));
					}

					return keys.reduce(function (descriptors, key) {
						return Object.defineProperty(
							descriptors,
							key,
							{
								configurable: true,
								enumerable: true,
								writable: true,
								value: Object.getOwnPropertyDescriptor(object, key)
							}
						);
					}, {});
				}
			}
		);
	}

	// Object assign polyfill for IE11
	if (!Object.assign) {
		function assign(target, firstSource) {
			if (target === undefined || target === null) {
				throw new TypeError('Cannot convert first argument to object');
			}

			var to = Object(target);
			for (var i = 1; i < arguments.length; i++) {
				var nextSource = arguments[i];
				if (nextSource === undefined || nextSource === null) {
					continue;
				}

				var keysArray = Object.keys(Object(nextSource));
				for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
					var nextKey = keysArray[nextIndex];
					var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
					if (desc !== undefined && desc.enumerable) {
						to[nextKey] = nextSource[nextKey];
					}
				}
			}
			return to;
		}
		Object.defineProperty(Object, 'assign', {
			enumerable: false,
			configurable: true,
			writable: true,
			value: assign
		});
	}
 
	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
		module.exports = {inherit: inherit, compose: compose};
	} else if (window) {
		window.bb = window.bb || {};
		window.bb.inherit = inherit;
		window.bb.compose = compose;
	} else {
		console.warn('Unknown environment');
	}		
})();