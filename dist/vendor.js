/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(28);
	module.exports = __webpack_require__(37);


/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(29);
	
	__webpack_require__(33);
	
	__webpack_require__(34);
	
	__webpack_require__(35);
	
	__webpack_require__(36);

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate) {(function (root) {
	
	  // Store setTimeout reference so promise-polyfill will be unaffected by
	  // other code modifying setTimeout (like sinon.useFakeTimers())
	  var setTimeoutFunc = setTimeout;
	
	  function noop() {}
	  
	  // Polyfill for Function.prototype.bind
	  function bind(fn, thisArg) {
	    return function () {
	      fn.apply(thisArg, arguments);
	    };
	  }
	
	  function Promise(fn) {
	    if (typeof this !== 'object') throw new TypeError('Promises must be constructed via new');
	    if (typeof fn !== 'function') throw new TypeError('not a function');
	    this._state = 0;
	    this._handled = false;
	    this._value = undefined;
	    this._deferreds = [];
	
	    doResolve(fn, this);
	  }
	
	  function handle(self, deferred) {
	    while (self._state === 3) {
	      self = self._value;
	    }
	    if (self._state === 0) {
	      self._deferreds.push(deferred);
	      return;
	    }
	    self._handled = true;
	    Promise._immediateFn(function () {
	      var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
	      if (cb === null) {
	        (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
	        return;
	      }
	      var ret;
	      try {
	        ret = cb(self._value);
	      } catch (e) {
	        reject(deferred.promise, e);
	        return;
	      }
	      resolve(deferred.promise, ret);
	    });
	  }
	
	  function resolve(self, newValue) {
	    try {
	      // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
	      if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.');
	      if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
	        var then = newValue.then;
	        if (newValue instanceof Promise) {
	          self._state = 3;
	          self._value = newValue;
	          finale(self);
	          return;
	        } else if (typeof then === 'function') {
	          doResolve(bind(then, newValue), self);
	          return;
	        }
	      }
	      self._state = 1;
	      self._value = newValue;
	      finale(self);
	    } catch (e) {
	      reject(self, e);
	    }
	  }
	
	  function reject(self, newValue) {
	    self._state = 2;
	    self._value = newValue;
	    finale(self);
	  }
	
	  function finale(self) {
	    if (self._state === 2 && self._deferreds.length === 0) {
	      Promise._immediateFn(function() {
	        if (!self._handled) {
	          Promise._unhandledRejectionFn(self._value);
	        }
	      });
	    }
	
	    for (var i = 0, len = self._deferreds.length; i < len; i++) {
	      handle(self, self._deferreds[i]);
	    }
	    self._deferreds = null;
	  }
	
	  function Handler(onFulfilled, onRejected, promise) {
	    this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
	    this.onRejected = typeof onRejected === 'function' ? onRejected : null;
	    this.promise = promise;
	  }
	
	  /**
	   * Take a potentially misbehaving resolver function and make sure
	   * onFulfilled and onRejected are only called once.
	   *
	   * Makes no guarantees about asynchrony.
	   */
	  function doResolve(fn, self) {
	    var done = false;
	    try {
	      fn(function (value) {
	        if (done) return;
	        done = true;
	        resolve(self, value);
	      }, function (reason) {
	        if (done) return;
	        done = true;
	        reject(self, reason);
	      });
	    } catch (ex) {
	      if (done) return;
	      done = true;
	      reject(self, ex);
	    }
	  }
	
	  Promise.prototype['catch'] = function (onRejected) {
	    return this.then(null, onRejected);
	  };
	
	  Promise.prototype.then = function (onFulfilled, onRejected) {
	    var prom = new (this.constructor)(noop);
	
	    handle(this, new Handler(onFulfilled, onRejected, prom));
	    return prom;
	  };
	
	  Promise.all = function (arr) {
	    var args = Array.prototype.slice.call(arr);
	
	    return new Promise(function (resolve, reject) {
	      if (args.length === 0) return resolve([]);
	      var remaining = args.length;
	
	      function res(i, val) {
	        try {
	          if (val && (typeof val === 'object' || typeof val === 'function')) {
	            var then = val.then;
	            if (typeof then === 'function') {
	              then.call(val, function (val) {
	                res(i, val);
	              }, reject);
	              return;
	            }
	          }
	          args[i] = val;
	          if (--remaining === 0) {
	            resolve(args);
	          }
	        } catch (ex) {
	          reject(ex);
	        }
	      }
	
	      for (var i = 0; i < args.length; i++) {
	        res(i, args[i]);
	      }
	    });
	  };
	
	  Promise.resolve = function (value) {
	    if (value && typeof value === 'object' && value.constructor === Promise) {
	      return value;
	    }
	
	    return new Promise(function (resolve) {
	      resolve(value);
	    });
	  };
	
	  Promise.reject = function (value) {
	    return new Promise(function (resolve, reject) {
	      reject(value);
	    });
	  };
	
	  Promise.race = function (values) {
	    return new Promise(function (resolve, reject) {
	      for (var i = 0, len = values.length; i < len; i++) {
	        values[i].then(resolve, reject);
	      }
	    });
	  };
	
	  // Use polyfill for setImmediate for performance gains
	  Promise._immediateFn = (typeof setImmediate === 'function' && function (fn) { setImmediate(fn); }) ||
	    function (fn) {
	      setTimeoutFunc(fn, 0);
	    };
	
	  Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
	    if (typeof console !== 'undefined' && console) {
	      console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
	    }
	  };
	
	  /**
	   * Set the immediate function to execute callbacks
	   * @param fn {function} Function to execute
	   * @deprecated
	   */
	  Promise._setImmediateFn = function _setImmediateFn(fn) {
	    Promise._immediateFn = fn;
	  };
	
	  /**
	   * Change the function to execute on unhandled rejection
	   * @param {function} fn Function to execute on unhandled rejection
	   * @deprecated
	   */
	  Promise._setUnhandledRejectionFn = function _setUnhandledRejectionFn(fn) {
	    Promise._unhandledRejectionFn = fn;
	  };
	  
	  if (typeof module !== 'undefined' && module.exports) {
	    module.exports = Promise;
	  } else if (!root.Promise) {
	    root.Promise = Promise;
	  }
	
	})(this);
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(30).setImmediate))

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var apply = Function.prototype.apply;
	
	// DOM APIs, for completeness
	
	exports.setTimeout = function() {
	  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
	};
	exports.setInterval = function() {
	  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
	};
	exports.clearTimeout =
	exports.clearInterval = function(timeout) {
	  if (timeout) {
	    timeout.close();
	  }
	};
	
	function Timeout(id, clearFn) {
	  this._id = id;
	  this._clearFn = clearFn;
	}
	Timeout.prototype.unref = Timeout.prototype.ref = function() {};
	Timeout.prototype.close = function() {
	  this._clearFn.call(window, this._id);
	};
	
	// Does not start the time, just sets up the members needed.
	exports.enroll = function(item, msecs) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = msecs;
	};
	
	exports.unenroll = function(item) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = -1;
	};
	
	exports._unrefActive = exports.active = function(item) {
	  clearTimeout(item._idleTimeoutId);
	
	  var msecs = item._idleTimeout;
	  if (msecs >= 0) {
	    item._idleTimeoutId = setTimeout(function onTimeout() {
	      if (item._onTimeout)
	        item._onTimeout();
	    }, msecs);
	  }
	};
	
	// setimmediate attaches itself to the global object
	__webpack_require__(31);
	exports.setImmediate = setImmediate;
	exports.clearImmediate = clearImmediate;


/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
	    "use strict";
	
	    if (global.setImmediate) {
	        return;
	    }
	
	    var nextHandle = 1; // Spec says greater than zero
	    var tasksByHandle = {};
	    var currentlyRunningATask = false;
	    var doc = global.document;
	    var registerImmediate;
	
	    function setImmediate(callback) {
	      // Callback can either be a function or a string
	      if (typeof callback !== "function") {
	        callback = new Function("" + callback);
	      }
	      // Copy function arguments
	      var args = new Array(arguments.length - 1);
	      for (var i = 0; i < args.length; i++) {
	          args[i] = arguments[i + 1];
	      }
	      // Store and register the task
	      var task = { callback: callback, args: args };
	      tasksByHandle[nextHandle] = task;
	      registerImmediate(nextHandle);
	      return nextHandle++;
	    }
	
	    function clearImmediate(handle) {
	        delete tasksByHandle[handle];
	    }
	
	    function run(task) {
	        var callback = task.callback;
	        var args = task.args;
	        switch (args.length) {
	        case 0:
	            callback();
	            break;
	        case 1:
	            callback(args[0]);
	            break;
	        case 2:
	            callback(args[0], args[1]);
	            break;
	        case 3:
	            callback(args[0], args[1], args[2]);
	            break;
	        default:
	            callback.apply(undefined, args);
	            break;
	        }
	    }
	
	    function runIfPresent(handle) {
	        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
	        // So if we're currently running a task, we'll need to delay this invocation.
	        if (currentlyRunningATask) {
	            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
	            // "too much recursion" error.
	            setTimeout(runIfPresent, 0, handle);
	        } else {
	            var task = tasksByHandle[handle];
	            if (task) {
	                currentlyRunningATask = true;
	                try {
	                    run(task);
	                } finally {
	                    clearImmediate(handle);
	                    currentlyRunningATask = false;
	                }
	            }
	        }
	    }
	
	    function installNextTickImplementation() {
	        registerImmediate = function(handle) {
	            process.nextTick(function () { runIfPresent(handle); });
	        };
	    }
	
	    function canUsePostMessage() {
	        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
	        // where `global.postMessage` means something completely different and can't be used for this purpose.
	        if (global.postMessage && !global.importScripts) {
	            var postMessageIsAsynchronous = true;
	            var oldOnMessage = global.onmessage;
	            global.onmessage = function() {
	                postMessageIsAsynchronous = false;
	            };
	            global.postMessage("", "*");
	            global.onmessage = oldOnMessage;
	            return postMessageIsAsynchronous;
	        }
	    }
	
	    function installPostMessageImplementation() {
	        // Installs an event handler on `global` for the `message` event: see
	        // * https://developer.mozilla.org/en/DOM/window.postMessage
	        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages
	
	        var messagePrefix = "setImmediate$" + Math.random() + "$";
	        var onGlobalMessage = function(event) {
	            if (event.source === global &&
	                typeof event.data === "string" &&
	                event.data.indexOf(messagePrefix) === 0) {
	                runIfPresent(+event.data.slice(messagePrefix.length));
	            }
	        };
	
	        if (global.addEventListener) {
	            global.addEventListener("message", onGlobalMessage, false);
	        } else {
	            global.attachEvent("onmessage", onGlobalMessage);
	        }
	
	        registerImmediate = function(handle) {
	            global.postMessage(messagePrefix + handle, "*");
	        };
	    }
	
	    function installMessageChannelImplementation() {
	        var channel = new MessageChannel();
	        channel.port1.onmessage = function(event) {
	            var handle = event.data;
	            runIfPresent(handle);
	        };
	
	        registerImmediate = function(handle) {
	            channel.port2.postMessage(handle);
	        };
	    }
	
	    function installReadyStateChangeImplementation() {
	        var html = doc.documentElement;
	        registerImmediate = function(handle) {
	            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
	            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
	            var script = doc.createElement("script");
	            script.onreadystatechange = function () {
	                runIfPresent(handle);
	                script.onreadystatechange = null;
	                html.removeChild(script);
	                script = null;
	            };
	            html.appendChild(script);
	        };
	    }
	
	    function installSetTimeoutImplementation() {
	        registerImmediate = function(handle) {
	            setTimeout(runIfPresent, 0, handle);
	        };
	    }
	
	    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
	    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
	    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;
	
	    // Don't get fooled by e.g. browserify environments.
	    if ({}.toString.call(global.process) === "[object process]") {
	        // For Node.js before 0.9
	        installNextTickImplementation();
	
	    } else if (canUsePostMessage()) {
	        // For non-IE10 modern browsers
	        installPostMessageImplementation();
	
	    } else if (global.MessageChannel) {
	        // For web workers, where supported
	        installMessageChannelImplementation();
	
	    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
	        // For IE 6–8
	        installReadyStateChangeImplementation();
	
	    } else {
	        // For older browsers
	        installSetTimeoutImplementation();
	    }
	
	    attachTo.setImmediate = setImmediate;
	    attachTo.clearImmediate = clearImmediate;
	}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(32)))

/***/ },
/* 32 */
/***/ function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};
	
	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.
	
	var cachedSetTimeout;
	var cachedClearTimeout;
	
	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }
	
	
	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }
	
	
	
	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 33 */
/***/ function(module, exports) {

	(function(self) {
	  'use strict';
	
	  if (self.fetch) {
	    return
	  }
	
	  var support = {
	    searchParams: 'URLSearchParams' in self,
	    iterable: 'Symbol' in self && 'iterator' in Symbol,
	    blob: 'FileReader' in self && 'Blob' in self && (function() {
	      try {
	        new Blob()
	        return true
	      } catch(e) {
	        return false
	      }
	    })(),
	    formData: 'FormData' in self,
	    arrayBuffer: 'ArrayBuffer' in self
	  }
	
	  if (support.arrayBuffer) {
	    var viewClasses = [
	      '[object Int8Array]',
	      '[object Uint8Array]',
	      '[object Uint8ClampedArray]',
	      '[object Int16Array]',
	      '[object Uint16Array]',
	      '[object Int32Array]',
	      '[object Uint32Array]',
	      '[object Float32Array]',
	      '[object Float64Array]'
	    ]
	
	    var isDataView = function(obj) {
	      return obj && DataView.prototype.isPrototypeOf(obj)
	    }
	
	    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
	      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
	    }
	  }
	
	  function normalizeName(name) {
	    if (typeof name !== 'string') {
	      name = String(name)
	    }
	    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
	      throw new TypeError('Invalid character in header field name')
	    }
	    return name.toLowerCase()
	  }
	
	  function normalizeValue(value) {
	    if (typeof value !== 'string') {
	      value = String(value)
	    }
	    return value
	  }
	
	  // Build a destructive iterator for the value list
	  function iteratorFor(items) {
	    var iterator = {
	      next: function() {
	        var value = items.shift()
	        return {done: value === undefined, value: value}
	      }
	    }
	
	    if (support.iterable) {
	      iterator[Symbol.iterator] = function() {
	        return iterator
	      }
	    }
	
	    return iterator
	  }
	
	  function Headers(headers) {
	    this.map = {}
	
	    if (headers instanceof Headers) {
	      headers.forEach(function(value, name) {
	        this.append(name, value)
	      }, this)
	
	    } else if (headers) {
	      Object.getOwnPropertyNames(headers).forEach(function(name) {
	        this.append(name, headers[name])
	      }, this)
	    }
	  }
	
	  Headers.prototype.append = function(name, value) {
	    name = normalizeName(name)
	    value = normalizeValue(value)
	    var oldValue = this.map[name]
	    this.map[name] = oldValue ? oldValue+','+value : value
	  }
	
	  Headers.prototype['delete'] = function(name) {
	    delete this.map[normalizeName(name)]
	  }
	
	  Headers.prototype.get = function(name) {
	    name = normalizeName(name)
	    return this.has(name) ? this.map[name] : null
	  }
	
	  Headers.prototype.has = function(name) {
	    return this.map.hasOwnProperty(normalizeName(name))
	  }
	
	  Headers.prototype.set = function(name, value) {
	    this.map[normalizeName(name)] = normalizeValue(value)
	  }
	
	  Headers.prototype.forEach = function(callback, thisArg) {
	    for (var name in this.map) {
	      if (this.map.hasOwnProperty(name)) {
	        callback.call(thisArg, this.map[name], name, this)
	      }
	    }
	  }
	
	  Headers.prototype.keys = function() {
	    var items = []
	    this.forEach(function(value, name) { items.push(name) })
	    return iteratorFor(items)
	  }
	
	  Headers.prototype.values = function() {
	    var items = []
	    this.forEach(function(value) { items.push(value) })
	    return iteratorFor(items)
	  }
	
	  Headers.prototype.entries = function() {
	    var items = []
	    this.forEach(function(value, name) { items.push([name, value]) })
	    return iteratorFor(items)
	  }
	
	  if (support.iterable) {
	    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
	  }
	
	  function consumed(body) {
	    if (body.bodyUsed) {
	      return Promise.reject(new TypeError('Already read'))
	    }
	    body.bodyUsed = true
	  }
	
	  function fileReaderReady(reader) {
	    return new Promise(function(resolve, reject) {
	      reader.onload = function() {
	        resolve(reader.result)
	      }
	      reader.onerror = function() {
	        reject(reader.error)
	      }
	    })
	  }
	
	  function readBlobAsArrayBuffer(blob) {
	    var reader = new FileReader()
	    var promise = fileReaderReady(reader)
	    reader.readAsArrayBuffer(blob)
	    return promise
	  }
	
	  function readBlobAsText(blob) {
	    var reader = new FileReader()
	    var promise = fileReaderReady(reader)
	    reader.readAsText(blob)
	    return promise
	  }
	
	  function readArrayBufferAsText(buf) {
	    var view = new Uint8Array(buf)
	    var chars = new Array(view.length)
	
	    for (var i = 0; i < view.length; i++) {
	      chars[i] = String.fromCharCode(view[i])
	    }
	    return chars.join('')
	  }
	
	  function bufferClone(buf) {
	    if (buf.slice) {
	      return buf.slice(0)
	    } else {
	      var view = new Uint8Array(buf.byteLength)
	      view.set(new Uint8Array(buf))
	      return view.buffer
	    }
	  }
	
	  function Body() {
	    this.bodyUsed = false
	
	    this._initBody = function(body) {
	      this._bodyInit = body
	      if (!body) {
	        this._bodyText = ''
	      } else if (typeof body === 'string') {
	        this._bodyText = body
	      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
	        this._bodyBlob = body
	      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
	        this._bodyFormData = body
	      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	        this._bodyText = body.toString()
	      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
	        this._bodyArrayBuffer = bufferClone(body.buffer)
	        // IE 10-11 can't handle a DataView body.
	        this._bodyInit = new Blob([this._bodyArrayBuffer])
	      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
	        this._bodyArrayBuffer = bufferClone(body)
	      } else {
	        throw new Error('unsupported BodyInit type')
	      }
	
	      if (!this.headers.get('content-type')) {
	        if (typeof body === 'string') {
	          this.headers.set('content-type', 'text/plain;charset=UTF-8')
	        } else if (this._bodyBlob && this._bodyBlob.type) {
	          this.headers.set('content-type', this._bodyBlob.type)
	        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
	        }
	      }
	    }
	
	    if (support.blob) {
	      this.blob = function() {
	        var rejected = consumed(this)
	        if (rejected) {
	          return rejected
	        }
	
	        if (this._bodyBlob) {
	          return Promise.resolve(this._bodyBlob)
	        } else if (this._bodyArrayBuffer) {
	          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as blob')
	        } else {
	          return Promise.resolve(new Blob([this._bodyText]))
	        }
	      }
	
	      this.arrayBuffer = function() {
	        if (this._bodyArrayBuffer) {
	          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
	        } else {
	          return this.blob().then(readBlobAsArrayBuffer)
	        }
	      }
	    }
	
	    this.text = function() {
	      var rejected = consumed(this)
	      if (rejected) {
	        return rejected
	      }
	
	      if (this._bodyBlob) {
	        return readBlobAsText(this._bodyBlob)
	      } else if (this._bodyArrayBuffer) {
	        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
	      } else if (this._bodyFormData) {
	        throw new Error('could not read FormData body as text')
	      } else {
	        return Promise.resolve(this._bodyText)
	      }
	    }
	
	    if (support.formData) {
	      this.formData = function() {
	        return this.text().then(decode)
	      }
	    }
	
	    this.json = function() {
	      return this.text().then(JSON.parse)
	    }
	
	    return this
	  }
	
	  // HTTP methods whose capitalization should be normalized
	  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']
	
	  function normalizeMethod(method) {
	    var upcased = method.toUpperCase()
	    return (methods.indexOf(upcased) > -1) ? upcased : method
	  }
	
	  function Request(input, options) {
	    options = options || {}
	    var body = options.body
	
	    if (typeof input === 'string') {
	      this.url = input
	    } else {
	      if (input.bodyUsed) {
	        throw new TypeError('Already read')
	      }
	      this.url = input.url
	      this.credentials = input.credentials
	      if (!options.headers) {
	        this.headers = new Headers(input.headers)
	      }
	      this.method = input.method
	      this.mode = input.mode
	      if (!body && input._bodyInit != null) {
	        body = input._bodyInit
	        input.bodyUsed = true
	      }
	    }
	
	    this.credentials = options.credentials || this.credentials || 'omit'
	    if (options.headers || !this.headers) {
	      this.headers = new Headers(options.headers)
	    }
	    this.method = normalizeMethod(options.method || this.method || 'GET')
	    this.mode = options.mode || this.mode || null
	    this.referrer = null
	
	    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
	      throw new TypeError('Body not allowed for GET or HEAD requests')
	    }
	    this._initBody(body)
	  }
	
	  Request.prototype.clone = function() {
	    return new Request(this, { body: this._bodyInit })
	  }
	
	  function decode(body) {
	    var form = new FormData()
	    body.trim().split('&').forEach(function(bytes) {
	      if (bytes) {
	        var split = bytes.split('=')
	        var name = split.shift().replace(/\+/g, ' ')
	        var value = split.join('=').replace(/\+/g, ' ')
	        form.append(decodeURIComponent(name), decodeURIComponent(value))
	      }
	    })
	    return form
	  }
	
	  function parseHeaders(rawHeaders) {
	    var headers = new Headers()
	    rawHeaders.split('\r\n').forEach(function(line) {
	      var parts = line.split(':')
	      var key = parts.shift().trim()
	      if (key) {
	        var value = parts.join(':').trim()
	        headers.append(key, value)
	      }
	    })
	    return headers
	  }
	
	  Body.call(Request.prototype)
	
	  function Response(bodyInit, options) {
	    if (!options) {
	      options = {}
	    }
	
	    this.type = 'default'
	    this.status = 'status' in options ? options.status : 200
	    this.ok = this.status >= 200 && this.status < 300
	    this.statusText = 'statusText' in options ? options.statusText : 'OK'
	    this.headers = new Headers(options.headers)
	    this.url = options.url || ''
	    this._initBody(bodyInit)
	  }
	
	  Body.call(Response.prototype)
	
	  Response.prototype.clone = function() {
	    return new Response(this._bodyInit, {
	      status: this.status,
	      statusText: this.statusText,
	      headers: new Headers(this.headers),
	      url: this.url
	    })
	  }
	
	  Response.error = function() {
	    var response = new Response(null, {status: 0, statusText: ''})
	    response.type = 'error'
	    return response
	  }
	
	  var redirectStatuses = [301, 302, 303, 307, 308]
	
	  Response.redirect = function(url, status) {
	    if (redirectStatuses.indexOf(status) === -1) {
	      throw new RangeError('Invalid status code')
	    }
	
	    return new Response(null, {status: status, headers: {location: url}})
	  }
	
	  self.Headers = Headers
	  self.Request = Request
	  self.Response = Response
	
	  self.fetch = function(input, init) {
	    return new Promise(function(resolve, reject) {
	      var request = new Request(input, init)
	      var xhr = new XMLHttpRequest()
	
	      xhr.onload = function() {
	        var options = {
	          status: xhr.status,
	          statusText: xhr.statusText,
	          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
	        }
	        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
	        var body = 'response' in xhr ? xhr.response : xhr.responseText
	        resolve(new Response(body, options))
	      }
	
	      xhr.onerror = function() {
	        reject(new TypeError('Network request failed'))
	      }
	
	      xhr.ontimeout = function() {
	        reject(new TypeError('Network request failed'))
	      }
	
	      xhr.open(request.method, request.url, true)
	
	      if (request.credentials === 'include') {
	        xhr.withCredentials = true
	      }
	
	      if ('responseType' in xhr && support.blob) {
	        xhr.responseType = 'blob'
	      }
	
	      request.headers.forEach(function(value, name) {
	        xhr.setRequestHeader(name, value)
	      })
	
	      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
	    })
	  }
	  self.fetch.polyfill = true
	})(typeof self !== 'undefined' ? self : this);


/***/ },
/* 34 */
/***/ function(module, exports) {

	'use strict';
	
	/* eslint-disable prefer-rest-params */
	// Polyfill based on:
	// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/from
	// Production steps of ECMA-262, Edition 6, 22.1.2.1
	if (!Array.from) {
	   (function () {
	      var toStr = Object.prototype.toString;
	      var isCallable = function isCallable(fn) {
	         return typeof fn === 'function' || toStr.call(fn) === '[ object Function ]';
	      };
	      var toInteger = function toInteger(value) {
	         var number = Number(value);
	         if (isNaN(number)) {
	            return 0;
	         }
	         if (number === 0 || !isFinite(number)) {
	            return number;
	         }
	         return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
	      };
	      var maxSafeInteger = Math.pow(2, 53) - 1;
	      var toLength = function toLength(value) {
	         var len = toInteger(value);
	         return Math.min(Math.max(len, 0), maxSafeInteger);
	      };
	
	      // The length property of the from method is 1.
	      Array.from = function from(arrayLike /*, mapFn, thisArg */) {
	         // 1. Let C be the this value.
	         var C = this;
	
	         // 2. Let items be ToObject(arrayLike).
	         var items = Object(arrayLike);
	
	         // 3. ReturnIfAbrupt(items).
	         if (arrayLike == null) {
	            throw new TypeError('Array.from requires an array-like object - not null or undefined');
	         }
	
	         // 4. If mapfn is undefined, then let mapping be false.
	         // eslint-disable-next-line no-void
	         var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
	         var T = void 0;
	         if (typeof mapFn !== 'undefined') {
	            // 5. else
	            // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
	            if (!isCallable(mapFn)) {
	               throw new TypeError('Array.from: when provided, the second argument must be a function');
	            }
	
	            // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
	            if (arguments.length > 2) {
	               T = arguments[2];
	            }
	         }
	
	         // 10. Let lenValue be Get(items, "length").
	         // 11. Let len be ToLength(lenValue).
	         var len = toLength(items.length);
	
	         // 13. If IsConstructor(C) is true, then
	         // 13. a. Let A be the result of calling the [ [Construct] ] internal method
	         // of C with an argument list containing the single item len.
	         // 14. a. Else, Let A be ArrayCreate(len).
	         var A = isCallable(C) ? Object(new C(len)) : new Array(len);
	
	         // 16. Let k be 0.
	         var k = 0;
	         // 17. Repeat, while k < len… (also steps a - h)
	         var kValue = void 0;
	         while (k < len) {
	            kValue = items[k];
	            if (mapFn) {
	               A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
	            } else {
	               A[k] = kValue;
	            }
	            k += 1;
	         }
	         // 18. Let putStatus be Put(A, "length", len, true).
	         A.length = len;
	         // 20. Return A.
	         return A;
	      };
	   })();
	}

/***/ },
/* 35 */
/***/ function(module, exports) {

	'use strict';
	
	// Polyfill based on:
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
	// Alternatives seem to cause problems with MSIE (e.g. by relying on a `global` object).
	if (!Array.prototype.includes) {
	   // eslint-disable-next-line no-extend-native
	   Array.prototype.includes = function (searchElement, optionalFromIndex) {
	      'use strict';
	
	      if (this == null) {
	         throw new TypeError('Array.prototype.includes called on null or undefined');
	      }
	      var list = Object(this);
	      var n = parseInt(list.length, 10) || 0;
	      if (n === 0) {
	         return false;
	      }
	
	      var start = parseInt(optionalFromIndex, 10) || 0;
	      var k = start >= 0 ? start : Math.max(0, n + start);
	
	      // detect special case (only NaN !== NaN):
	      // eslint-disable-next-line no-self-compare
	      if (searchElement !== searchElement) {
	         while (k < n) {
	            if (list[k] !== list[k]) {
	               return true;
	            }
	            k++;
	         }
	         return false;
	      }
	
	      while (k < n) {
	         if (searchElement === list[k]) {
	            return true;
	         }
	         k++;
	      }
	      return false;
	   };
	}

/***/ },
/* 36 */
/***/ function(module, exports) {

	'use strict';
	
	/* eslint-disable prefer-rest-params */
	// Polyfill based on:
	// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
	if (!Object.assign) {
	   Object.assign = function (target) {
	      'use strict';
	      // We must check against these specific cases.
	
	      if (target === undefined || target === null) {
	         throw new TypeError('Cannot convert undefined or null to object');
	      }
	
	      var output = Object(target);
	      for (var index = 1; index < arguments.length; index++) {
	         var source = arguments[index];
	         if (source !== undefined && source !== null) {
	            for (var nextKey in source) {
	               // eslint-disable-next-line max-depth
	               if (source.hasOwnProperty(nextKey)) {
	                  output[nextKey] = source[nextKey];
	               }
	            }
	         }
	      }
	      return output;
	   };
	}

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	exports.plainAdapter = exports.instances = exports.string = exports.object = exports.assert = undefined;
	exports.bootstrap = bootstrap;
	
	var _assert = __webpack_require__(38);
	
	var _assert2 = _interopRequireDefault(_assert);
	
	var _object = __webpack_require__(39);
	
	var object = _interopRequireWildcard(_object);
	
	var _string = __webpack_require__(40);
	
	var string = _interopRequireWildcard(_string);
	
	var _services = __webpack_require__(41);
	
	var _plain_adapter = __webpack_require__(79);
	
	var plainAdapter = _interopRequireWildcard(_plain_adapter);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /**
	                                                                                                                                                                                                     * Copyright 2016 aixigo AG
	                                                                                                                                                                                                     * Released under the MIT license.
	                                                                                                                                                                                                     * http://laxarjs.org/license
	                                                                                                                                                                                                     */
	
	/**
	 * The API entry point for boostrapping LaxarJS applications.
	 * Also, provides a couple of utilities to deal with assertions, objects and strings.
	 *
	 * @module laxar
	 */
	
	// Get a reference to the global object of the JS environment.
	// See http://stackoverflow.com/a/6930376 for details
	var global = void 0;
	try {
	   // eslint-disable-next-line no-new-func, no-eval
	   global = Function('return this')() || (1, eval)('this');
	} catch (_) {
	   // if it forbids eval, it's probably a browser
	   global = window;
	}
	
	/**
	 * Bootstraps AngularJS on the provided `anchorElement` and sets up the LaxarJS runtime.
	 *
	 * @param {HTMLElement} anchorElement
	 *    the element to insert the page in
	 * @param {Object} [optionalOptions]
	 *    optional options for bootstrapping
	 * @param {Array} optionalOptions.widgetAdapters
	 *    widget adapters that are used in this application
	 * @param {Object} optionalOptions.configuration
	 *    configuration for the laxar application. See http://laxarjs.org/docs/laxar-latest/manuals/configuration/
	 *    for further information on available properties
	 * @param {Object} optionalOptions.artifacts
	 *    an artifact listing for the application, generated by the utilized built tool (e.g. webpack)
	 *
	 * @memberof laxar
	 */
	function bootstrap(anchorElement) {
	   var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	       _ref$widgetAdapters = _ref.widgetAdapters,
	       widgetAdapters = _ref$widgetAdapters === undefined ? [] : _ref$widgetAdapters,
	       _ref$configuration = _ref.configuration,
	       configuration = _ref$configuration === undefined ? {} : _ref$configuration,
	       _ref$artifacts = _ref.artifacts,
	       artifacts = _ref$artifacts === undefined ? {} : _ref$artifacts;
	
	   (0, _assert2.default)(anchorElement).isNotNull();
	   (0, _assert2.default)(widgetAdapters).hasType(Array).isNotNull();
	   (0, _assert2.default)(artifacts).hasType(Object).isNotNull();
	   (0, _assert2.default)(configuration).hasType(Object).isNotNull();
	
	   var services = (0, _services.create)(configuration, artifacts);
	
	   var globalEventBus = services.globalEventBus,
	       log = services.log,
	       storage = services.storage,
	       themeLoader = services.themeLoader,
	       widgetLoader = services.widgetLoader;
	
	   themeLoader.load();
	
	   var adapterServices = {
	      artifactProvider: services.artifactProvider,
	      configuration: services.configuration,
	      flowService: services.flowService,
	      globalEventBus: globalEventBus,
	      heartbeat: services.heartbeat,
	      log: log,
	      pageService: services.pageService,
	      storage: storage,
	      tooling: services.toolingProviders,
	      widgetLoader: services.widgetLoader
	   };
	
	   var adapterModules = [plainAdapter].concat(_toConsumableArray(widgetAdapters));
	   var adapters = bootstrapWidgetAdapters(anchorElement, adapterServices, adapterModules, artifacts);
	   widgetLoader.registerWidgetAdapters(adapters);
	
	   announceInstance(services);
	
	   var flowName = services.configuration.get('flow.name');
	   if (!flowName) {
	      log.trace('LaxarJS Bootstrap complete: No `flow.name` configured.');
	      return;
	   }
	
	   whenDocumentReady(function () {
	      log.trace('LaxarJS loading Flow: ' + flowName);
	      services.pageService.createControllerFor(anchorElement);
	      services.flowController.loadFlow().then(function () {
	         log.trace('Flow loaded');
	      }, function (err) {
	         log.fatal('LaxarJS failed to load flow.');
	         log.fatal('Error [0].\nStack: [1]', err, err && err.stack);
	      });
	   });
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function whenDocumentReady(callback) {
	   if (document.readyState === 'complete') {
	      callback();
	   } else {
	      document.addEventListener('DOMContentLoaded', callback);
	   }
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function bootstrapWidgetAdapters(anchorElement, services, adapterModules, artifacts) {
	   var log = services.log;
	
	   var adapterModulesByTechnology = {};
	   var artifactsByTechnology = {};
	
	   adapterModules.forEach(function (module) {
	      adapterModulesByTechnology[module.technology] = module;
	      artifactsByTechnology[module.technology] = { widgets: [], controls: [] };
	   });
	
	   ['widgets', 'controls'].forEach(function (type) {
	      artifacts[type].forEach(function (artifact) {
	         var technology = artifact.descriptor.integration.technology;
	
	         if (!adapterModulesByTechnology[technology]) {
	            var name = artifact.descriptor.name;
	
	            log.fatal('Unknown widget technology: [0], required by [1] "[2]"', technology, type, name);
	            return;
	         }
	         artifactsByTechnology[technology][type].push(artifact);
	      });
	   });
	
	   var adaptersByTechnology = {};
	   Object.keys(adapterModulesByTechnology).forEach(function (technology) {
	      var adapterModule = adapterModulesByTechnology[technology];
	      var artifacts = artifactsByTechnology[technology];
	      adaptersByTechnology[technology] = adapterModule.bootstrap(artifacts, services, anchorElement);
	   });
	   return adaptersByTechnology;
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function announceInstance(services) {
	   var configuration = services.configuration,
	       log = services.log,
	       storage = services.storage;
	
	
	   if (configuration.get('tooling.enabled')) {
	      instances()[configuration.get('name', 'unnamed')] = services;
	   }
	
	   var idGenerator = configuration.get('logging.instanceId', simpleId);
	   if (idGenerator === false) {
	      return;
	   }
	
	   var instanceIdStorageKey = 'axLogTags.INST';
	   var store = storage.getApplicationSessionStorage();
	   var instanceId = store.getItem(instanceIdStorageKey);
	   if (!instanceId) {
	      instanceId = idGenerator();
	      store.setItem(instanceIdStorageKey, instanceId);
	   }
	   log.addTag('INST', instanceId);
	
	   function simpleId() {
	      return '' + Date.now() + Math.floor(Math.random() * 100);
	   }
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Provide tooling access to LaxarJS services.
	 *
	 * Each laxar#bootstrap call creates a new set of services such as a logger, global event bus etc. For tools
	 * like the laxar-developer-tools-widget, it may be necessary to access these services for a given instance,
	 * or for all instances.
	 *
	 * @param {String} [optionalName]
	 *   The configuration name of a LaxarJS instance to inspect.
	 *   May be omitted to access all application instances by name.
	 *
	 * @return {Object}
	 *   The tooling services for a specified instance, or for all instances that have tooling enabled.
	 *
	 * @memberof laxar
	 */
	function instances(optionalName) {
	   var instances = global.laxarInstances = global.laxarInstances || {};
	   return optionalName ? instances[optionalName] : instances;
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	exports.assert = _assert2.default;
	exports.object = object;
	exports.string = string;
	exports.instances = instances;
	exports.plainAdapter = plainAdapter;

/***/ },
/* 38 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	/**
	 * Copyright 2016 aixigo AG
	 * Released under the MIT license.
	 * http://laxarjs.org/license
	 */
	/**
	 * The *assert* module provides some simple assertion methods for type checks, truthyness tests and guards
	 * invalid code paths.
	 * When importing the module as `default` module, it is the {@link assert} function itself.
	 *
	 * When requiring `laxar`, it is available as `laxar.assert`.
	 *
	 * @module assert
	 */
	
	/**
	 * Constructor for an Assertion.
	 *
	 * @param {*} subject
	 *    the object assertions are made for
	 * @param {String} [optionalDetails]
	 *    details that should be printed in case no specific details are given for an assertion method
	 *
	 * @constructor
	 * @private
	 */
	function Assertion(subject, optionalDetails) {
	   this.subject_ = subject;
	   this.details_ = optionalDetails || null;
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Throws an error if the subject is `null` or `undefined`.
	 *
	 * @param {String} [optionalDetails]
	 *    details to append to the error message
	 *
	 * @return {Assertion}
	 *    this instance
	 */
	Assertion.prototype.isNotNull = function isNotNull(optionalDetails) {
	   if (this.subject_ == null) {
	      fail('Expected value to be defined and not null.', optionalDetails || this.details_);
	   }
	
	   return this;
	};
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Throws an error if the subject is not of the given type. No error is thrown for `null` or `undefined`.
	 *
	 * @param {Function} type
	 *    the expected type of the subject
	 * @param {String} [optionalDetails]
	 *    details to append to the error message
	 *
	 * @return {Assertion}
	 *    this instance
	 */
	Assertion.prototype.hasType = function hasType(type, optionalDetails) {
	   if (typeof this.subject_ === 'undefined' || this.subject_ === null) {
	      return this;
	   }
	
	   if (typeof type !== 'function') {
	      fail('type must be a constructor function. Got ' + (typeof type === 'undefined' ? 'undefined' : _typeof(type)) + '.');
	   }
	
	   if (!checkType(this.subject_, type)) {
	      var actualString = functionName(this.subject_.constructor);
	      var expectedString = functionName(type);
	
	      fail('Expected value to be an instance of "' + expectedString + '" but was "' + actualString + '".', optionalDetails || this.details_);
	   }
	
	   return this;
	};
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Throws an error if the subject is no object or the given property is not defined on it.
	 *
	 * @param {String} property
	 *    the property that is expected for the subject
	 * @param {String} [optionalDetails]
	 *    details to append to the error message
	 *
	 * @return {Assertion}
	 *    this instance
	 */
	Assertion.prototype.hasProperty = function hasProperty(property, optionalDetails) {
	   if (_typeof(this.subject_) !== 'object') {
	      fail('value must be an object. Got ' + _typeof(this.subject_) + '.');
	   }
	
	   if (!(property in this.subject_)) {
	      fail('value is missing mandatory property "' + property + '".', optionalDetails || this.details_);
	   }
	
	   return this;
	};
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function fail(message, optionalDetails) {
	   var details = '';
	   if (optionalDetails) {
	      var detailString = (typeof optionalDetails === 'undefined' ? 'undefined' : _typeof(optionalDetails)) === 'object' ? JSON.stringify(optionalDetails) : optionalDetails;
	      details = ' Details: ' + detailString;
	   }
	   throw new Error('Assertion error: ' + message + details);
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	var TYPE_TO_CONSTRUCTOR = {
	   'string': String,
	   'number': Number,
	   'boolean': Boolean,
	   'function': Function
	};
	function checkType(subject, type) {
	   if ((typeof subject === 'undefined' ? 'undefined' : _typeof(subject)) === 'object') {
	      return subject instanceof type;
	   }
	
	   var actualType = TYPE_TO_CONSTRUCTOR[typeof subject === 'undefined' ? 'undefined' : _typeof(subject)];
	   return actualType === type;
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	var FUNCTION_NAME_MATCHER = /^function ([^\(]*)\(/i;
	function functionName(func) {
	   var match = FUNCTION_NAME_MATCHER.exec(func.toString().trim());
	   return match[1].length ? match[1] : 'n/a';
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Creates and returns a new `Assertion` instance for the given `subject`.
	 *
	 * **Note**: this function is no member of the module, but the module itself. Thus when using `assert` via
	 * laxar, `assert` is will be no simple object, but this function having the other functions as
	 * properties.
	 *
	 * Example:
	 * ```js
	 * define( [ 'laxar' ], function( ax ) {
	 *    ax.assert( ax.assert ).hasType( Function );
	 *    ax.assert.state( typeof ax.assert.codeIsUnreachable === 'function' );
	 * } );
	 * ```
	 *
	 * @param {*} subject
	 *    the object assertions are made for
	 * @param {String} [optionalDetails]
	 *    details that should be printed in case no specific details are given when calling an assertion method
	 *
	 * @return {Assertion}
	 *    the assertion instance
	 */
	function assert(subject, optionalDetails) {
	   return new Assertion(subject, optionalDetails);
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Marks a code path as erroneous by throwing an error when reached.
	 *
	 * @param {String} [optionalDetails]
	 *    details to append to the error message
	 */
	assert.codeIsUnreachable = function codeIsUnreachable(optionalDetails) {
	   fail('Code should be unreachable!', optionalDetails);
	};
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Throws an error if the given expression is falsy.
	 *
	 * @param {*} expression
	 *    the expression to test for truthyness
	 * @param {String} [optionalDetails]
	 *    details to append to the error message
	 */
	assert.state = function state(expression, optionalDetails) {
	   if (!expression) {
	      fail('State does not hold.', optionalDetails);
	   }
	};
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	exports.default = assert;
	var codeIsUnreachable = exports.codeIsUnreachable = assert.codeIsUnreachable;
	var state = exports.state = assert.state;

/***/ },
/* 39 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	exports.options = options;
	exports.forEach = forEach;
	exports.path = path;
	exports.setPath = setPath;
	exports.deepClone = deepClone;
	exports.tabulate = tabulate;
	/**
	 * Copyright 2016 aixigo AG
	 * Released under the MIT license.
	 * http://laxarjs.org/license
	 */
	
	/**
	 * Utilities for dealing with objects.
	 *
	 * When requiring `laxar`, it is available as `laxar.object`.
	 *
	 * @module object
	 */
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Returns all properties from `obj` with missing properties completed from `defaults`. If `obj` is `null`
	 * or `undefined`, an empty object is automatically created. `obj` and `defaults` are not modified by this
	 * function. This is very useful for optional map arguments, resembling some kind of configuration.
	 *
	 * Example:
	 * ```js
	 * object.options( { validate: true }, {
	 *    validate: false,
	 *    highlight: true
	 * } );
	 * // =>
	 * // {
	 * //    validate: true,
	 * //    highlight: true
	 * // }
	 * ```
	 *
	 * @param {Object} obj
	 *    the options object to use as source, may be `null` or `undefined`
	 * @param {Object} defaults
	 *    the defaults to take missing properties from
	 *
	 * @return {Object}
	 *    the completed options object
	 */
	function options(obj, defaults) {
	   return Object.assign({}, defaults, obj);
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Iterates over the keys of an object and calls the given iterator function for each entry.
	 * On each iteration the iterator function is passed the `value`, the `key` and the complete `object` as
	 * arguments.
	 * If `object` is an array, the native `Array.prototype.forEach` function is called.
	 * In this case the keys are the indices of the array.
	 *
	 * Example:
	 * ```
	 * object.forEach( { name: Peter, age: 12 }, ( value, key ) => {
	 *    console.log( `${key} = ${value}\n` );
	 * });
	 * // =>
	 * // name = Peter
	 * // age = 12
	 * ```
	 *
	 * @param {Object} object
	 *    the object to run the iterator function on
	 * @param {Function} iteratorFunction
	 *    the iterator function to run on each key-value pair
	 */
	function forEach(object, iteratorFunction) {
	   if (Array.isArray(object)) {
	      object.forEach(iteratorFunction);
	      return;
	   }
	
	   for (var key in object) {
	      if (hasOwnProperty(object, key)) {
	         iteratorFunction(object[key], key, object);
	      }
	   }
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Finds a property in a nested object structure by a given path. A path is a string of keys, separated
	 * by a dot from each other, used to traverse that object and find the value of interest. An additional
	 * default is returned, if otherwise the value would yield `undefined`.
	 *
	 * Note that `path()` must only be used in situations where all path segments are also valid
	 * JavaScript identifiers, and should never be used with user-specified paths:
	 *
	 *  - there is no mechanism to escape '.' in path segments; a dot always separates keys,
	 *  - an empty string as a path segment will abort processing and return the entire sub-object under the
	 *    respective position. For historical reasons, the path interpretation differs from that performed by
	 *    {@link #setPath()}.
	 *
	 *
	 * Example:
	 *
	 * ```js
	 * object.path( { one: { two: 3 } }, 'one.two' ); // => 3
	 * object.path( { one: { two: 3 } }, 'one.three' ); // => undefined
	 * object.path( { one: { two: 3 } }, 'one.three', 42 ); // => 42
	 * object.path( { one: { two: 3 } }, 'one.' ); // => { two: 3 }
	 * object.path( { one: { two: 3 } }, '' ); // => { one: { two: 3 } }
	 * object.path( { one: { two: 3 } }, '.' ); // => { one: { two: 3 } }
	 * ```
	 *
	 * @param {Object} obj
	 *    the object to traverse
	 * @param {String} thePath
	 *    the path to search for
	 * @param {*} [optionalDefault]
	 *    the value to return instead of `undefined` if nothing is found
	 *
	 * @return {*}
	 *    the value at the given path
	 */
	function path(obj, thePath) {
	   var optionalDefault = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
	
	   var pathArr = thePath.split('.');
	   var node = obj;
	   var key = pathArr.shift();
	
	   while (key) {
	      if (node && (typeof node === 'undefined' ? 'undefined' : _typeof(node)) === 'object' && hasOwnProperty(node, key)) {
	         node = node[key];
	         key = pathArr.shift();
	      } else {
	         return optionalDefault;
	      }
	   }
	
	   return node;
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Sets a property in a nested object structure at a given path to a given value. A path is a string of
	 * keys, separated by a dot from each other, used to traverse that object and find the place where the
	 * value should be set. Any missing subtrees along the path are created.
	 *
	 * Note that `setPath()` must only be used in situations where all path segments are also valid
	 * JavaScript identifiers, and should never be used with user-specified paths:
	 *
	 *  - there is no mechanism to escape '.' in path segments; a dot will always create separate keys,
	 *  - an empty string as a path segment will create an empty string key in the object graph where missing.
	 *    For historical reasons, this path interpretation differs from that performed by #path (see there).
	 *
	 *
	 * Example:
	 *
	 * ```js
	 * object.setPath( {}, 'name.first', 'Peter' ); // => { name: { first: 'Peter' } }
	 * object.setPath( {}, 'pets.1', 'Hamster' ); // => { pets: [ null, 'Hamster' ] }
	 * object.setPath( {}, '', 'Hamster' ); // => { '': 'Hamster' } }
	 * object.setPath( {}, '.', 'Hamster' ); // => { '': { '': 'Hamster' } } }
	 * ```
	 *
	 * @param {Object} obj
	 *    the object to modify
	 * @param {String} path
	 *    the path to set a value at
	 * @param {*} value
	 *    the value to set at the given path
	 *
	 * @return {*}
	 *    the full object (for chaining)
	 */
	function setPath(obj, path, value) {
	   var node = obj;
	   var pathArr = path.split('.');
	   var last = pathArr.pop();
	
	   pathArr.forEach(function (pathFragment, index) {
	      if (!node[pathFragment] || _typeof(node[pathFragment]) !== 'object') {
	         var lookAheadFragment = pathArr[index + 1] || last;
	         if (lookAheadFragment.match(/^[0-9]+$/)) {
	            node[pathFragment] = [];
	            fillArrayWithNull(node[pathFragment], parseInt(lookAheadFragment, 10));
	         } else {
	            node[pathFragment] = {};
	         }
	      }
	
	      node = node[pathFragment];
	   });
	
	   if (Array.isArray(node) && last > node.length) {
	      fillArrayWithNull(node, last);
	   }
	
	   node[last] = value;
	
	   return obj;
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Returns a deep clone of the given object. Note that the current implementation is intended to be used
	 * for simple object literals only. There is no guarantee that cloning objects instantiated via
	 * constructor function works and cyclic references will lead to endless recursion.
	 *
	 * @param {*} object
	 *    the object to clone
	 *
	 * @return {*}
	 *    the clone
	 */
	function deepClone(object) {
	   if (!object || (typeof object === 'undefined' ? 'undefined' : _typeof(object)) !== 'object') {
	      return object;
	   }
	
	   // Using plain for-loops here for performance-reasons.
	   var result = void 0;
	   if (Array.isArray(object)) {
	      result = [];
	      for (var i = 0, length = object.length; i < length; ++i) {
	         result[i] = deepClone(object[i]);
	      }
	   } else {
	      result = {};
	      for (var key in object) {
	         if (hasOwnProperty(object, key)) {
	            result[key] = deepClone(object[key]);
	         }
	      }
	   }
	
	   return result;
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Creates a lookup table from a function and a list of inputs to the function.
	 *
	 * @param {Function} fn
	 *    The callback to apply to all inputs
	 * @param {String[]|Number[]|Boolean[]} keys
	 *    The keys for the lookup table, and inputs to the function.
	 *
	 * @return {Object}
	 *    An object mapping the given keys to their values under `fn`.
	 */
	function tabulate(fn, keys) {
	   return keys.reduce(function (table, k) {
	      table[k] = fn(k);return table;
	   }, {});
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	// eslint-disable-next-line valid-jsdoc
	/**
	 * Sets all entries of the given array to `null`.
	 *
	 * @private
	 */
	function fillArrayWithNull(arr, toIndex) {
	   for (var i = arr.length; i < toIndex; ++i) {
	      arr[i] = null;
	   }
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	var hasOwnProp = Object.prototype.hasOwnProperty;
	// eslint-disable-next-line valid-jsdoc
	/**
	 * @private
	 */
	function hasOwnProperty(object, property) {
	   return hasOwnProp.call(object, property);
	}

/***/ },
/* 40 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	exports.format = format;
	exports.createFormatter = createFormatter;
	/**
	 * Copyright 2016 aixigo AG
	 * Released under the MIT license.
	 * http://laxarjs.org/license
	 */
	/**
	 * Utilities for dealing with strings.
	 *
	 * When requiring `laxar`, it is available as `laxar.string`.
	 *
	 * @module string
	 */
	
	//
	var BACKSLASH = '\\';
	var OPENING_BRACKET = '[';
	var CLOSING_BRACKET = ']';
	var INTEGER_MATCHER = /^[0-9]+$/;
	
	/**
	 * A map of all available default format specifiers to their respective formatter function.
	 * The following specifiers are available:
	 *
	 * - `%d` / `%i`: Format the given numeric value as integer. Decimal places are removed
	 * - `%f`: Format the given numeric value as floating point value. This specifier supports precision as
	 *   sub-specifier (e.g. `%.2f` for 2 decimal places)
	 * - `%s`: use simple string serialization using `toString`
	 * - `%o`: Format complex objects using `JSON.stringify`
	 *
	 * @type {Object}
	 * @name DEFAULT_FORMATTERS
	 */
	var DEFAULT_FORMATTERS = exports.DEFAULT_FORMATTERS = Object.freeze({
	   's': function s(input) {
	      return '' + input;
	   },
	   'd': function d(input) {
	      return input.toFixed(0);
	   },
	   'i': function i(input, subSpecifierString) {
	      return DEFAULT_FORMATTERS.d(input, subSpecifierString);
	   },
	   'f': function f(input, subSpecifierString) {
	      var precision = subSpecifierString.match(/^\.(\d)$/);
	      if (precision) {
	         return input.toFixed(precision[1]);
	      }
	
	      return '' + input;
	   },
	   'o': function o(input) {
	      return JSON.stringify(input);
	   },
	   'default': function _default(input, subSpecifierString) {
	      return DEFAULT_FORMATTERS.s(input, subSpecifierString);
	   }
	});
	
	var DEFAULT_FORMATTER = createFormatter(DEFAULT_FORMATTERS);
	
	///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Substitutes all unescaped placeholders in the given string for a given indexed or named value.
	 * A placeholder is written as a pair of brackets around the key of the placeholder. An example of an
	 * indexed placeholder is `[0]` and a named placeholder would look like this `[replaceMe]`. If no
	 * replacement for a key exists, the placeholder will simply not be substituted.
	 *
	 * Some examples:
	 * ```javascript
	 * string.format( 'Hello [0], how do you like [1]?', [ 'Peter', 'Cheeseburgers' ] );
	 * // => 'Hello Peter, how do you like Cheeseburgers?'
	 * ```
	 * ```javascript
	 * string.format( 'Hello [name] and [partner], how do you like [0]?', [ 'Pizza' ], {
	 *    name: 'Hans',
	 *    partner: 'Roswita'
	 * } );
	 * // => 'Hello Hans and Roswita, how do you like Pizza?'
	 * ```
	 * If a pair of brackets should not be treated as a placeholder, the opening bracket can simply be escaped
	 * by backslashes (thus to get an actual backslash in a JavaScript string literal, which is then treated as
	 * an escape symbol, it needs to be written as double backslash):
	 * ```javascript
	 * string.format( 'A [something] should eventually only have \\[x].', {
	 *    something: 'checklist'
	 * } );
	 * // => 'A checklist should eventually only have [x].'
	 * ```
	 * A placeholder key can be any character string besides `[`, `]` and `:` to keep parsing simple and fast.
	 * By using `:` as separator it is possible to provide a type specifier for string serialization or other
	 * additional mapping functions for the value to insert. Type specifiers always begin with an `%` and end
	 * with the specifier type. Builtin specifiers and their according formatter functions are defined
	 * as {@link DEFAULT_FORMATTERS}.
	 *
	 * When no specifier is provided, by default `%s` is assumed.
	 *
	 * Example:
	 * ```javascript
	 * string.format( 'Hello [0:%s], you owe me [1:%.2f] euros.', [ 'Peter', 12.1243 ] );
	 * // => 'Hello Peter, you owe me 12.12 euros.'
	 * ```
	 *
	 * Mapping functions should instead consist of simple strings and may not begin with a `%` character. It is
	 * advised to use the same naming rules as for simple JavaScript functions. Type specifiers and mapping
	 * functions are applied in the order they appear within the placeholder.
	 *
	 * An example, where we assume that the mapping functions `flip` and `double` where defined by the user
	 * when creating the `formatString` function using {@link #createFormatter()}:
	 * ```javascript
	 * formatString( 'Hello [0:%s:flip], you owe me [1:double:%.2f] euros.', [ 'Peter', 12 ] );
	 * // => 'Hello reteP, you owe me 24.00 euros.'
	 * ```
	 *
	 * Note that there currently exist no builtin mapping functions.
	 *
	 * If a type specifier is used that doesn't exist, an exception is thrown. In contrast to that the use of
	 * an unknown mapping function results in a no-op. This is on purpose to be able to use filter-like
	 * functions that, in case they are defined for a formatter, transform a value as needed and in all other
	 * cases simply are ignored and don't alter the value.
	 *
	 * @param {String} string
	 *    the string to replace placeholders in
	 * @param {Array} [optionalIndexedReplacements]
	 *    an optional array of indexed replacements
	 * @param {Object} [optionalNamedReplacements]
	 *    an optional map of named replacements
	 *
	 * @return {String}
	 *    the string with placeholders substituted for their according replacements
	 */
	function format(string, optionalIndexedReplacements, optionalNamedReplacements) {
	   return DEFAULT_FORMATTER(string, optionalIndexedReplacements, optionalNamedReplacements);
	}
	
	///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Creates a new format function having the same api as {@link #format()}. If the first argument is
	 * omitted or `null`, the default formatters for type specifiers are used. Otherwise only the provided map
	 * of specifiers is available to the returned format function. Each key of the map is a specifier character
	 * where the `%` is omitted and the value is the formatting function. A formatting function receives the
	 * value to format (i.e. serialize) and the sub-specifier (if any) as arguments. For example for the format
	 * specifier `%.2f` the sub-specifier would be `.2` where for `%s` it would simply be the empty string.
	 *
	 * Example:
	 * ```js
	 * const format = string.createFormatter( {
	 *    'm': function( value ) {
	 *       return value.amount + ' ' + value.currency;
	 *    },
	 *    'p': function( value, subSpecifier ) {
	 *       return Math.pow( value, parseInt( subSpecifier, 10 ) );
	 *    }
	 * } );
	 *
	 * format( 'You owe me [0:%m].', [ { amount: 12, currency: 'EUR' } ] );
	 * // => 'You owe me 12 EUR.'
	 *
	 * format( '[0]^3 = [0:%3p]', [ 2 ] );
	 * // => '2^3 = 8'
	 * ```
	 *
	 * The second argument is completely additional to the behavior of the default {@link #format()}
	 * function. Here a map from mapping function id to actual mapping function can be passed in. Whenever the
	 * id of a mapping function is found within the placeholder, that mapping function is called with the
	 * current value and its return value is either passed to the next mapping function or rendered
	 * instead of the placeholder if there are no more mapping function ids or type specifiers within the
	 * placeholder string.
	 *
	 * ```javascript
	 * const format = string.createFormatter( null, {
	 *    flip: function( value ) {
	 *       return ( '' + s ).split( '' ).reverse().join( '' );
	 *    },
	 *    double: function( value ) {
	 *       return value * 2;
	 *    }
	 * } );
	 *
	 * format( 'Hello [0:%s:flip], you owe me [1:double:%.2f] euros.', [ 'Peter', 12 ] );
	 * // => 'Hello reteP, you owe me 24.00 euros.'
	 * ```
	 *
	 * @param {Object} typeFormatters
	 *    map from format specifier (single letter without leading `%`) to formatting function
	 * @param {Object} [optionalValueMappers]
	 *    map from mapping identifier to mapping function
	 *
	 * @return {Function}
	 *    a function having the same api as {@link #format()}
	 */
	function createFormatter() {
	   var typeFormatters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_FORMATTERS;
	   var optionalValueMappers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	
	
	   function format(string, optionalIndexedReplacements, optionalNamedReplacements) {
	      if (typeof string !== 'string') {
	         return defaultTypeFormatter(typeFormatters)(string);
	      }
	
	      var indexed = Array.isArray(optionalIndexedReplacements) ? optionalIndexedReplacements : [];
	      var named = {};
	      if (optionalNamedReplacements) {
	         named = optionalNamedReplacements || {};
	      } else if (!Array.isArray(optionalIndexedReplacements)) {
	         named = optionalIndexedReplacements || {};
	      }
	
	      var chars = string.split('');
	      var output = '';
	      for (var i = 0, len = chars.length; i < len; ++i) {
	         if (chars[i] === BACKSLASH) {
	            if (i + 1 === len) {
	               throw new Error('Unterminated escaping sequence at index ' + i + ' of string: "' + string + '".');
	            }
	
	            output += chars[++i];
	         } else if (chars[i] === OPENING_BRACKET) {
	            var closingIndex = string.indexOf(CLOSING_BRACKET, i + 1);
	            if (closingIndex === -1) {
	               throw new Error('Unterminated placeholder at index ' + i + ' of string: "' + string + '".');
	            }
	
	            var key = string.substring(i + 1, closingIndex);
	
	            output += replacePlaceholder(key, named, indexed, { string: string, index: i });
	
	            i = closingIndex;
	         } else {
	            output += chars[i];
	         }
	      }
	      return output;
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function replacePlaceholder(placeholder, named, indexed, context) {
	      var specifier = '';
	      var subSpecifierString = '';
	      var placeholderParts = placeholder.split(':');
	      var key = placeholderParts[0];
	
	      var value = void 0;
	      if (INTEGER_MATCHER.test(key) && key < indexed.length) {
	         value = indexed[key];
	      } else if (key in named) {
	         value = named[key];
	      } else {
	         return OPENING_BRACKET + placeholder + CLOSING_BRACKET;
	      }
	
	      if (placeholderParts.length > 1) {
	
	         if (placeholderParts[1].charAt(0) !== '%') {
	            value = defaultTypeFormatter(typeFormatters)(value);
	         }
	
	         return placeholderParts.slice(1).reduce(function (value, part) {
	            if (part.indexOf('%') === 0) {
	               var specifierMatch = part.match(/^%(.*)(\w)$/);
	               specifier = specifierMatch ? specifierMatch[2] : '';
	               subSpecifierString = specifierMatch ? specifierMatch[1] : '';
	               if (specifier in typeFormatters) {
	                  return typeFormatters[specifier](value, subSpecifierString);
	               }
	               var knownSpecifiers = Object.keys(typeFormatters).filter(function (_) {
	                  return _ !== 'default';
	               }).map(function (_) {
	                  return '%' + _;
	               }).join(', ');
	
	               throw new Error('Unknown format specifier "%' + specifier + '" for placeholder' + (' at index ' + context.index + ' of string: "' + context.string + '"') + (' (Known specifiers are: ' + knownSpecifiers + ').'));
	            }
	            if (part in optionalValueMappers) {
	               return optionalValueMappers[part](value);
	            }
	
	            return value;
	         }, value);
	      }
	
	      return defaultTypeFormatter(typeFormatters)(value);
	   }
	
	   ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   return format;
	}
	
	///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function defaultTypeFormatter(typeFormatters) {
	   if ('default' in typeFormatters) {
	      return typeFormatters['default'];
	   }
	
	   return DEFAULT_FORMATTERS['default'];
	}

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	exports.create = create;
	
	var _page = __webpack_require__(42);
	
	var _page2 = _interopRequireDefault(_page);
	
	var _assert = __webpack_require__(38);
	
	var _assert2 = _interopRequireDefault(_assert);
	
	var _configuration = __webpack_require__(45);
	
	var _browser = __webpack_require__(46);
	
	var _log = __webpack_require__(47);
	
	var _event_bus = __webpack_require__(48);
	
	var _artifact_provider = __webpack_require__(49);
	
	var _control_loader = __webpack_require__(50);
	
	var _css_loader = __webpack_require__(51);
	
	var _layout_loader = __webpack_require__(52);
	
	var _page_loader = __webpack_require__(53);
	
	var _theme_loader = __webpack_require__(61);
	
	var _widget_loader = __webpack_require__(62);
	
	var _storage = __webpack_require__(63);
	
	var _timer = __webpack_require__(64);
	
	var _flow_controller = __webpack_require__(65);
	
	var _flow_service = __webpack_require__(67);
	
	var _heartbeat = __webpack_require__(68);
	
	var _page_service = __webpack_require__(69);
	
	var _pagejs_router = __webpack_require__(72);
	
	var _locale_event_manager = __webpack_require__(73);
	
	var _visibility_event_manager = __webpack_require__(74);
	
	var _widget_services = __webpack_require__(75);
	
	var _tooling = __webpack_require__(78);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Copyright 2016 aixigo AG
	 * Released under the MIT license.
	 * http://laxarjs.org/license
	 */
	function create(configurationSource, assets) {
	
	   var configurationDefaults = {
	      baseHref: undefined,
	      eventBusTimeoutMs: 120 * 1000,
	      router: {
	         query: {
	            enabled: false
	         }
	         // 'pagejs' is not configured here:
	         // any deviation from the page.js library defaults must be set by the application
	      },
	      flow: {
	         entryPoint: {
	            target: 'default',
	            parameters: {}
	         }
	      },
	      i18n: {
	         fallback: 'en',
	         strict: false,
	         locales: {
	            'default': 'en'
	         }
	      },
	      logging: {
	         levels: {},
	         threshold: 'INFO'
	      },
	      name: 'unnamed',
	      theme: 'default',
	      storagePrefix: undefined,
	      tooling: {
	         enabled: false
	      }
	   };
	   var configuration = (0, _configuration.create)(configurationSource, configurationDefaults);
	
	   var browser = (0, _browser.create)();
	   var log = (0, _log.create)(configuration, browser);
	   var collectors = (0, _tooling.createCollectors)(configuration, log);
	
	   var storage = (0, _storage.create)(configuration, browser);
	   var timer = (0, _timer.create)(log, storage);
	
	   var artifactProvider = (0, _artifact_provider.create)(assets, browser, configuration, log);
	
	   var heartbeat = (0, _heartbeat.create)();
	
	   // MSIE Bug we have to wrap setTimeout to pass assertion
	   var timeoutFn = function timeoutFn(f, t) {
	      return setTimeout(f, t);
	   };
	   var globalEventBus = (0, _event_bus.create)(configuration, log, heartbeat.onNext, timeoutFn);
	
	   var cssLoader = (0, _css_loader.create)();
	   var themeLoader = (0, _theme_loader.create)(artifactProvider, cssLoader);
	   var layoutLoader = (0, _layout_loader.create)(artifactProvider, cssLoader);
	   var pageLoader = (0, _page_loader.create)(artifactProvider, collectors.pages);
	   var controlLoader = (0, _control_loader.create)(artifactProvider, cssLoader);
	   var widgetServices = {
	      forWidget: function forWidget() {
	         _assert2.default.codeIsUnreachable('Using widget services before they are available');
	      }
	   };
	   var widgetLoader = (0, _widget_loader.create)(log, artifactProvider, controlLoader, cssLoader, collectors.pages, function () {
	      var _widgetServices;
	
	      return (_widgetServices = widgetServices).forWidget.apply(_widgetServices, arguments);
	   });
	
	   var localeManager = (0, _locale_event_manager.create)(globalEventBus, configuration);
	   var visibilityManager = (0, _visibility_event_manager.create)(globalEventBus);
	   var pageService = (0, _page_service.create)(globalEventBus, pageLoader, layoutLoader, widgetLoader, localeManager, visibilityManager, collectors.pages);
	
	   var router = (0, _pagejs_router.create)(_page2.default, browser, configuration);
	
	   var flowController = (0, _flow_controller.create)(artifactProvider, configuration, globalEventBus, log, pageService, router, timer);
	   var flowService = (0, _flow_service.create)(flowController);
	
	   var toolingProviders = (0, _tooling.createProviders)(collectors);
	
	   widgetServices = (0, _widget_services.create)(artifactProvider, configuration, controlLoader, globalEventBus, flowService, log, heartbeat, pageService, storage, toolingProviders);
	
	   return {
	      configuration: configuration,
	      cssLoader: cssLoader,
	      artifactProvider: artifactProvider,
	      flowController: flowController,
	      flowService: flowService,
	      globalEventBus: globalEventBus,
	      heartbeat: heartbeat,
	      layoutLoader: layoutLoader,
	      log: log,
	      pageService: pageService,
	      storage: storage,
	      themeLoader: themeLoader,
	      timer: timer,
	      toolingProviders: toolingProviders,
	      widgetLoader: widgetLoader
	   };
	}

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {  /* globals require, module */
	
	  'use strict';
	
	  /**
	   * Module dependencies.
	   */
	
	  var pathtoRegexp = __webpack_require__(43);
	
	  /**
	   * Module exports.
	   */
	
	  module.exports = page;
	
	  /**
	   * Detect click event
	   */
	  var clickEvent = ('undefined' !== typeof document) && document.ontouchstart ? 'touchstart' : 'click';
	
	  /**
	   * To work properly with the URL
	   * history.location generated polyfill in https://github.com/devote/HTML5-History-API
	   */
	
	  var location = ('undefined' !== typeof window) && (window.history.location || window.location);
	
	  /**
	   * Perform initial dispatch.
	   */
	
	  var dispatch = true;
	
	
	  /**
	   * Decode URL components (query string, pathname, hash).
	   * Accommodates both regular percent encoding and x-www-form-urlencoded format.
	   */
	  var decodeURLComponents = true;
	
	  /**
	   * Base path.
	   */
	
	  var base = '';
	
	  /**
	   * Running flag.
	   */
	
	  var running;
	
	  /**
	   * HashBang option
	   */
	
	  var hashbang = false;
	
	  /**
	   * Previous context, for capturing
	   * page exit events.
	   */
	
	  var prevContext;
	
	  /**
	   * Register `path` with callback `fn()`,
	   * or route `path`, or redirection,
	   * or `page.start()`.
	   *
	   *   page(fn);
	   *   page('*', fn);
	   *   page('/user/:id', load, user);
	   *   page('/user/' + user.id, { some: 'thing' });
	   *   page('/user/' + user.id);
	   *   page('/from', '/to')
	   *   page();
	   *
	   * @param {string|!Function|!Object} path
	   * @param {Function=} fn
	   * @api public
	   */
	
	  function page(path, fn) {
	    // <callback>
	    if ('function' === typeof path) {
	      return page('*', path);
	    }
	
	    // route <path> to <callback ...>
	    if ('function' === typeof fn) {
	      var route = new Route(/** @type {string} */ (path));
	      for (var i = 1; i < arguments.length; ++i) {
	        page.callbacks.push(route.middleware(arguments[i]));
	      }
	      // show <path> with [state]
	    } else if ('string' === typeof path) {
	      page['string' === typeof fn ? 'redirect' : 'show'](path, fn);
	      // start [options]
	    } else {
	      page.start(path);
	    }
	  }
	
	  /**
	   * Callback functions.
	   */
	
	  page.callbacks = [];
	  page.exits = [];
	
	  /**
	   * Current path being processed
	   * @type {string}
	   */
	  page.current = '';
	
	  /**
	   * Number of pages navigated to.
	   * @type {number}
	   *
	   *     page.len == 0;
	   *     page('/login');
	   *     page.len == 1;
	   */
	
	  page.len = 0;
	
	  /**
	   * Get or set basepath to `path`.
	   *
	   * @param {string} path
	   * @api public
	   */
	
	  page.base = function(path) {
	    if (0 === arguments.length) return base;
	    base = path;
	  };
	
	  /**
	   * Bind with the given `options`.
	   *
	   * Options:
	   *
	   *    - `click` bind to click events [true]
	   *    - `popstate` bind to popstate [true]
	   *    - `dispatch` perform initial dispatch [true]
	   *
	   * @param {Object} options
	   * @api public
	   */
	
	  page.start = function(options) {
	    options = options || {};
	    if (running) return;
	    running = true;
	    if (false === options.dispatch) dispatch = false;
	    if (false === options.decodeURLComponents) decodeURLComponents = false;
	    if (false !== options.popstate) window.addEventListener('popstate', onpopstate, false);
	    if (false !== options.click) {
	      document.addEventListener(clickEvent, onclick, false);
	    }
	    if (true === options.hashbang) hashbang = true;
	    if (!dispatch) return;
	    var url = (hashbang && ~location.hash.indexOf('#!')) ? location.hash.substr(2) + location.search : location.pathname + location.search + location.hash;
	    page.replace(url, null, true, dispatch);
	  };
	
	  /**
	   * Unbind click and popstate event handlers.
	   *
	   * @api public
	   */
	
	  page.stop = function() {
	    if (!running) return;
	    page.current = '';
	    page.len = 0;
	    running = false;
	    document.removeEventListener(clickEvent, onclick, false);
	    window.removeEventListener('popstate', onpopstate, false);
	  };
	
	  /**
	   * Show `path` with optional `state` object.
	   *
	   * @param {string} path
	   * @param {Object=} state
	   * @param {boolean=} dispatch
	   * @param {boolean=} push
	   * @return {!Context}
	   * @api public
	   */
	
	  page.show = function(path, state, dispatch, push) {
	    var ctx = new Context(path, state);
	    page.current = ctx.path;
	    if (false !== dispatch) page.dispatch(ctx);
	    if (false !== ctx.handled && false !== push) ctx.pushState();
	    return ctx;
	  };
	
	  /**
	   * Goes back in the history
	   * Back should always let the current route push state and then go back.
	   *
	   * @param {string} path - fallback path to go back if no more history exists, if undefined defaults to page.base
	   * @param {Object=} state
	   * @api public
	   */
	
	  page.back = function(path, state) {
	    if (page.len > 0) {
	      // this may need more testing to see if all browsers
	      // wait for the next tick to go back in history
	      history.back();
	      page.len--;
	    } else if (path) {
	      setTimeout(function() {
	        page.show(path, state);
	      });
	    }else{
	      setTimeout(function() {
	        page.show(base, state);
	      });
	    }
	  };
	
	
	  /**
	   * Register route to redirect from one path to other
	   * or just redirect to another route
	   *
	   * @param {string} from - if param 'to' is undefined redirects to 'from'
	   * @param {string=} to
	   * @api public
	   */
	  page.redirect = function(from, to) {
	    // Define route from a path to another
	    if ('string' === typeof from && 'string' === typeof to) {
	      page(from, function(e) {
	        setTimeout(function() {
	          page.replace(/** @type {!string} */ (to));
	        }, 0);
	      });
	    }
	
	    // Wait for the push state and replace it with another
	    if ('string' === typeof from && 'undefined' === typeof to) {
	      setTimeout(function() {
	        page.replace(from);
	      }, 0);
	    }
	  };
	
	  /**
	   * Replace `path` with optional `state` object.
	   *
	   * @param {string} path
	   * @param {Object=} state
	   * @param {boolean=} init
	   * @param {boolean=} dispatch
	   * @return {!Context}
	   * @api public
	   */
	
	
	  page.replace = function(path, state, init, dispatch) {
	    var ctx = new Context(path, state);
	    page.current = ctx.path;
	    ctx.init = init;
	    ctx.save(); // save before dispatching, which may redirect
	    if (false !== dispatch) page.dispatch(ctx);
	    return ctx;
	  };
	
	  /**
	   * Dispatch the given `ctx`.
	   *
	   * @param {Context} ctx
	   * @api private
	   */
	  page.dispatch = function(ctx) {
	    var prev = prevContext,
	      i = 0,
	      j = 0;
	
	    prevContext = ctx;
	
	    function nextExit() {
	      var fn = page.exits[j++];
	      if (!fn) return nextEnter();
	      fn(prev, nextExit);
	    }
	
	    function nextEnter() {
	      var fn = page.callbacks[i++];
	
	      if (ctx.path !== page.current) {
	        ctx.handled = false;
	        return;
	      }
	      if (!fn) return unhandled(ctx);
	      fn(ctx, nextEnter);
	    }
	
	    if (prev) {
	      nextExit();
	    } else {
	      nextEnter();
	    }
	  };
	
	  /**
	   * Unhandled `ctx`. When it's not the initial
	   * popstate then redirect. If you wish to handle
	   * 404s on your own use `page('*', callback)`.
	   *
	   * @param {Context} ctx
	   * @api private
	   */
	  function unhandled(ctx) {
	    if (ctx.handled) return;
	    var current;
	
	    if (hashbang) {
	      current = base + location.hash.replace('#!', '');
	    } else {
	      current = location.pathname + location.search;
	    }
	
	    if (current === ctx.canonicalPath) return;
	    page.stop();
	    ctx.handled = false;
	    location.href = ctx.canonicalPath;
	  }
	
	  /**
	   * Register an exit route on `path` with
	   * callback `fn()`, which will be called
	   * on the previous context when a new
	   * page is visited.
	   */
	  page.exit = function(path, fn) {
	    if (typeof path === 'function') {
	      return page.exit('*', path);
	    }
	
	    var route = new Route(path);
	    for (var i = 1; i < arguments.length; ++i) {
	      page.exits.push(route.middleware(arguments[i]));
	    }
	  };
	
	  /**
	   * Remove URL encoding from the given `str`.
	   * Accommodates whitespace in both x-www-form-urlencoded
	   * and regular percent-encoded form.
	   *
	   * @param {string} val - URL component to decode
	   */
	  function decodeURLEncodedURIComponent(val) {
	    if (typeof val !== 'string') { return val; }
	    return decodeURLComponents ? decodeURIComponent(val.replace(/\+/g, ' ')) : val;
	  }
	
	  /**
	   * Initialize a new "request" `Context`
	   * with the given `path` and optional initial `state`.
	   *
	   * @constructor
	   * @param {string} path
	   * @param {Object=} state
	   * @api public
	   */
	
	  function Context(path, state) {
	    if ('/' === path[0] && 0 !== path.indexOf(base)) path = base + (hashbang ? '#!' : '') + path;
	    var i = path.indexOf('?');
	
	    this.canonicalPath = path;
	    this.path = path.replace(base, '') || '/';
	    if (hashbang) this.path = this.path.replace('#!', '') || '/';
	
	    this.title = document.title;
	    this.state = state || {};
	    this.state.path = path;
	    this.querystring = ~i ? decodeURLEncodedURIComponent(path.slice(i + 1)) : '';
	    this.pathname = decodeURLEncodedURIComponent(~i ? path.slice(0, i) : path);
	    this.params = {};
	
	    // fragment
	    this.hash = '';
	    if (!hashbang) {
	      if (!~this.path.indexOf('#')) return;
	      var parts = this.path.split('#');
	      this.path = parts[0];
	      this.hash = decodeURLEncodedURIComponent(parts[1]) || '';
	      this.querystring = this.querystring.split('#')[0];
	    }
	  }
	
	  /**
	   * Expose `Context`.
	   */
	
	  page.Context = Context;
	
	  /**
	   * Push state.
	   *
	   * @api private
	   */
	
	  Context.prototype.pushState = function() {
	    page.len++;
	    history.pushState(this.state, this.title, hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
	  };
	
	  /**
	   * Save the context state.
	   *
	   * @api public
	   */
	
	  Context.prototype.save = function() {
	    history.replaceState(this.state, this.title, hashbang && this.path !== '/' ? '#!' + this.path : this.canonicalPath);
	  };
	
	  /**
	   * Initialize `Route` with the given HTTP `path`,
	   * and an array of `callbacks` and `options`.
	   *
	   * Options:
	   *
	   *   - `sensitive`    enable case-sensitive routes
	   *   - `strict`       enable strict matching for trailing slashes
	   *
	   * @constructor
	   * @param {string} path
	   * @param {Object=} options
	   * @api private
	   */
	
	  function Route(path, options) {
	    options = options || {};
	    this.path = (path === '*') ? '(.*)' : path;
	    this.method = 'GET';
	    this.regexp = pathtoRegexp(this.path,
	      this.keys = [],
	      options);
	  }
	
	  /**
	   * Expose `Route`.
	   */
	
	  page.Route = Route;
	
	  /**
	   * Return route middleware with
	   * the given callback `fn()`.
	   *
	   * @param {Function} fn
	   * @return {Function}
	   * @api public
	   */
	
	  Route.prototype.middleware = function(fn) {
	    var self = this;
	    return function(ctx, next) {
	      if (self.match(ctx.path, ctx.params)) return fn(ctx, next);
	      next();
	    };
	  };
	
	  /**
	   * Check if this route matches `path`, if so
	   * populate `params`.
	   *
	   * @param {string} path
	   * @param {Object} params
	   * @return {boolean}
	   * @api private
	   */
	
	  Route.prototype.match = function(path, params) {
	    var keys = this.keys,
	      qsIndex = path.indexOf('?'),
	      pathname = ~qsIndex ? path.slice(0, qsIndex) : path,
	      m = this.regexp.exec(decodeURIComponent(pathname));
	
	    if (!m) return false;
	
	    for (var i = 1, len = m.length; i < len; ++i) {
	      var key = keys[i - 1];
	      var val = decodeURLEncodedURIComponent(m[i]);
	      if (val !== undefined || !(hasOwnProperty.call(params, key.name))) {
	        params[key.name] = val;
	      }
	    }
	
	    return true;
	  };
	
	
	  /**
	   * Handle "populate" events.
	   */
	
	  var onpopstate = (function () {
	    var loaded = false;
	    if ('undefined' === typeof window) {
	      return;
	    }
	    if (document.readyState === 'complete') {
	      loaded = true;
	    } else {
	      window.addEventListener('load', function() {
	        setTimeout(function() {
	          loaded = true;
	        }, 0);
	      });
	    }
	    return function onpopstate(e) {
	      if (!loaded) return;
	      if (e.state) {
	        var path = e.state.path;
	        page.replace(path, e.state);
	      } else {
	        page.show(location.pathname + location.hash, undefined, undefined, false);
	      }
	    };
	  })();
	  /**
	   * Handle "click" events.
	   */
	
	  function onclick(e) {
	
	    if (1 !== which(e)) return;
	
	    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
	    if (e.defaultPrevented) return;
	
	
	
	    // ensure link
	    // use shadow dom when available
	    var el = e.path ? e.path[0] : e.target;
	    while (el && 'A' !== el.nodeName) el = el.parentNode;
	    if (!el || 'A' !== el.nodeName) return;
	
	
	
	    // Ignore if tag has
	    // 1. "download" attribute
	    // 2. rel="external" attribute
	    if (el.hasAttribute('download') || el.getAttribute('rel') === 'external') return;
	
	    // ensure non-hash for the same path
	    var link = el.getAttribute('href');
	    if (!hashbang && el.pathname === location.pathname && (el.hash || '#' === link)) return;
	
	
	
	    // Check for mailto: in the href
	    if (link && link.indexOf('mailto:') > -1) return;
	
	    // check target
	    if (el.target) return;
	
	    // x-origin
	    if (!sameOrigin(el.href)) return;
	
	
	
	    // rebuild path
	    var path = el.pathname + el.search + (el.hash || '');
	
	    // strip leading "/[drive letter]:" on NW.js on Windows
	    if (typeof process !== 'undefined' && path.match(/^\/[a-zA-Z]:\//)) {
	      path = path.replace(/^\/[a-zA-Z]:\//, '/');
	    }
	
	    // same page
	    var orig = path;
	
	    if (path.indexOf(base) === 0) {
	      path = path.substr(base.length);
	    }
	
	    if (hashbang) path = path.replace('#!', '');
	
	    if (base && orig === path) return;
	
	    e.preventDefault();
	    page.show(orig);
	  }
	
	  /**
	   * Event button.
	   */
	
	  function which(e) {
	    e = e || window.event;
	    return null === e.which ? e.button : e.which;
	  }
	
	  /**
	   * Check if `href` is the same origin.
	   */
	
	  function sameOrigin(href) {
	    var origin = location.protocol + '//' + location.hostname;
	    if (location.port) origin += ':' + location.port;
	    return (href && (0 === href.indexOf(origin)));
	  }
	
	  page.sameOrigin = sameOrigin;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(32)))

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	var isarray = __webpack_require__(44)
	
	/**
	 * Expose `pathToRegexp`.
	 */
	module.exports = pathToRegexp
	module.exports.parse = parse
	module.exports.compile = compile
	module.exports.tokensToFunction = tokensToFunction
	module.exports.tokensToRegExp = tokensToRegExp
	
	/**
	 * The main path matching regexp utility.
	 *
	 * @type {RegExp}
	 */
	var PATH_REGEXP = new RegExp([
	  // Match escaped characters that would otherwise appear in future matches.
	  // This allows the user to escape special characters that won't transform.
	  '(\\\\.)',
	  // Match Express-style parameters and un-named parameters with a prefix
	  // and optional suffixes. Matches appear as:
	  //
	  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
	  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
	  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
	  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))'
	].join('|'), 'g')
	
	/**
	 * Parse a string for the raw tokens.
	 *
	 * @param  {String} str
	 * @return {Array}
	 */
	function parse (str) {
	  var tokens = []
	  var key = 0
	  var index = 0
	  var path = ''
	  var res
	
	  while ((res = PATH_REGEXP.exec(str)) != null) {
	    var m = res[0]
	    var escaped = res[1]
	    var offset = res.index
	    path += str.slice(index, offset)
	    index = offset + m.length
	
	    // Ignore already escaped sequences.
	    if (escaped) {
	      path += escaped[1]
	      continue
	    }
	
	    // Push the current path onto the tokens.
	    if (path) {
	      tokens.push(path)
	      path = ''
	    }
	
	    var prefix = res[2]
	    var name = res[3]
	    var capture = res[4]
	    var group = res[5]
	    var suffix = res[6]
	    var asterisk = res[7]
	
	    var repeat = suffix === '+' || suffix === '*'
	    var optional = suffix === '?' || suffix === '*'
	    var delimiter = prefix || '/'
	    var pattern = capture || group || (asterisk ? '.*' : '[^' + delimiter + ']+?')
	
	    tokens.push({
	      name: name || key++,
	      prefix: prefix || '',
	      delimiter: delimiter,
	      optional: optional,
	      repeat: repeat,
	      pattern: escapeGroup(pattern)
	    })
	  }
	
	  // Match any characters still remaining.
	  if (index < str.length) {
	    path += str.substr(index)
	  }
	
	  // If the path exists, push it onto the end.
	  if (path) {
	    tokens.push(path)
	  }
	
	  return tokens
	}
	
	/**
	 * Compile a string to a template function for the path.
	 *
	 * @param  {String}   str
	 * @return {Function}
	 */
	function compile (str) {
	  return tokensToFunction(parse(str))
	}
	
	/**
	 * Expose a method for transforming tokens into the path function.
	 */
	function tokensToFunction (tokens) {
	  // Compile all the tokens into regexps.
	  var matches = new Array(tokens.length)
	
	  // Compile all the patterns before compilation.
	  for (var i = 0; i < tokens.length; i++) {
	    if (typeof tokens[i] === 'object') {
	      matches[i] = new RegExp('^' + tokens[i].pattern + '$')
	    }
	  }
	
	  return function (obj) {
	    var path = ''
	    var data = obj || {}
	
	    for (var i = 0; i < tokens.length; i++) {
	      var token = tokens[i]
	
	      if (typeof token === 'string') {
	        path += token
	
	        continue
	      }
	
	      var value = data[token.name]
	      var segment
	
	      if (value == null) {
	        if (token.optional) {
	          continue
	        } else {
	          throw new TypeError('Expected "' + token.name + '" to be defined')
	        }
	      }
	
	      if (isarray(value)) {
	        if (!token.repeat) {
	          throw new TypeError('Expected "' + token.name + '" to not repeat, but received "' + value + '"')
	        }
	
	        if (value.length === 0) {
	          if (token.optional) {
	            continue
	          } else {
	            throw new TypeError('Expected "' + token.name + '" to not be empty')
	          }
	        }
	
	        for (var j = 0; j < value.length; j++) {
	          segment = encodeURIComponent(value[j])
	
	          if (!matches[i].test(segment)) {
	            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
	          }
	
	          path += (j === 0 ? token.prefix : token.delimiter) + segment
	        }
	
	        continue
	      }
	
	      segment = encodeURIComponent(value)
	
	      if (!matches[i].test(segment)) {
	        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
	      }
	
	      path += token.prefix + segment
	    }
	
	    return path
	  }
	}
	
	/**
	 * Escape a regular expression string.
	 *
	 * @param  {String} str
	 * @return {String}
	 */
	function escapeString (str) {
	  return str.replace(/([.+*?=^!:${}()[\]|\/])/g, '\\$1')
	}
	
	/**
	 * Escape the capturing group by escaping special characters and meaning.
	 *
	 * @param  {String} group
	 * @return {String}
	 */
	function escapeGroup (group) {
	  return group.replace(/([=!:$\/()])/g, '\\$1')
	}
	
	/**
	 * Attach the keys as a property of the regexp.
	 *
	 * @param  {RegExp} re
	 * @param  {Array}  keys
	 * @return {RegExp}
	 */
	function attachKeys (re, keys) {
	  re.keys = keys
	  return re
	}
	
	/**
	 * Get the flags for a regexp from the options.
	 *
	 * @param  {Object} options
	 * @return {String}
	 */
	function flags (options) {
	  return options.sensitive ? '' : 'i'
	}
	
	/**
	 * Pull out keys from a regexp.
	 *
	 * @param  {RegExp} path
	 * @param  {Array}  keys
	 * @return {RegExp}
	 */
	function regexpToRegexp (path, keys) {
	  // Use a negative lookahead to match only capturing groups.
	  var groups = path.source.match(/\((?!\?)/g)
	
	  if (groups) {
	    for (var i = 0; i < groups.length; i++) {
	      keys.push({
	        name: i,
	        prefix: null,
	        delimiter: null,
	        optional: false,
	        repeat: false,
	        pattern: null
	      })
	    }
	  }
	
	  return attachKeys(path, keys)
	}
	
	/**
	 * Transform an array into a regexp.
	 *
	 * @param  {Array}  path
	 * @param  {Array}  keys
	 * @param  {Object} options
	 * @return {RegExp}
	 */
	function arrayToRegexp (path, keys, options) {
	  var parts = []
	
	  for (var i = 0; i < path.length; i++) {
	    parts.push(pathToRegexp(path[i], keys, options).source)
	  }
	
	  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options))
	
	  return attachKeys(regexp, keys)
	}
	
	/**
	 * Create a path regexp from string input.
	 *
	 * @param  {String} path
	 * @param  {Array}  keys
	 * @param  {Object} options
	 * @return {RegExp}
	 */
	function stringToRegexp (path, keys, options) {
	  var tokens = parse(path)
	  var re = tokensToRegExp(tokens, options)
	
	  // Attach keys back to the regexp.
	  for (var i = 0; i < tokens.length; i++) {
	    if (typeof tokens[i] !== 'string') {
	      keys.push(tokens[i])
	    }
	  }
	
	  return attachKeys(re, keys)
	}
	
	/**
	 * Expose a function for taking tokens and returning a RegExp.
	 *
	 * @param  {Array}  tokens
	 * @param  {Array}  keys
	 * @param  {Object} options
	 * @return {RegExp}
	 */
	function tokensToRegExp (tokens, options) {
	  options = options || {}
	
	  var strict = options.strict
	  var end = options.end !== false
	  var route = ''
	  var lastToken = tokens[tokens.length - 1]
	  var endsWithSlash = typeof lastToken === 'string' && /\/$/.test(lastToken)
	
	  // Iterate over the tokens and create our regexp string.
	  for (var i = 0; i < tokens.length; i++) {
	    var token = tokens[i]
	
	    if (typeof token === 'string') {
	      route += escapeString(token)
	    } else {
	      var prefix = escapeString(token.prefix)
	      var capture = token.pattern
	
	      if (token.repeat) {
	        capture += '(?:' + prefix + capture + ')*'
	      }
	
	      if (token.optional) {
	        if (prefix) {
	          capture = '(?:' + prefix + '(' + capture + '))?'
	        } else {
	          capture = '(' + capture + ')?'
	        }
	      } else {
	        capture = prefix + '(' + capture + ')'
	      }
	
	      route += capture
	    }
	  }
	
	  // In non-strict mode we allow a slash at the end of match. If the path to
	  // match already ends with a slash, we remove it for consistency. The slash
	  // is valid at the end of a path match, not in the middle. This is important
	  // in non-ending mode, where "/test/" shouldn't match "/test//route".
	  if (!strict) {
	    route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?'
	  }
	
	  if (end) {
	    route += '$'
	  } else {
	    // In non-ending mode, we need the capturing groups to match as much as
	    // possible by using a positive lookahead to the end or next path segment.
	    route += strict && endsWithSlash ? '' : '(?=\\/|$)'
	  }
	
	  return new RegExp('^' + route, flags(options))
	}
	
	/**
	 * Normalize the given path string, returning a regular expression.
	 *
	 * An empty array can be passed in for the keys, which will hold the
	 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
	 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
	 *
	 * @param  {(String|RegExp|Array)} path
	 * @param  {Array}                 [keys]
	 * @param  {Object}                [options]
	 * @return {RegExp}
	 */
	function pathToRegexp (path, keys, options) {
	  keys = keys || []
	
	  if (!isarray(keys)) {
	    options = keys
	    keys = []
	  } else if (!options) {
	    options = {}
	  }
	
	  if (path instanceof RegExp) {
	    return regexpToRegexp(path, keys, options)
	  }
	
	  if (isarray(path)) {
	    return arrayToRegexp(path, keys, options)
	  }
	
	  return stringToRegexp(path, keys, options)
	}


/***/ },
/* 44 */
/***/ function(module, exports) {

	module.exports = Array.isArray || function (arr) {
	  return Object.prototype.toString.call(arr) == '[object Array]';
	};


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.create = create;
	
	var _assert = __webpack_require__(38);
	
	var _assert2 = _interopRequireDefault(_assert);
	
	var _object = __webpack_require__(39);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Copyright 2016 aixigo AG
	 * Released under the MIT license.
	 * http://laxarjs.org/license
	 */
	/**
	 * Module providing the Configuration factory.
	 *
	 * To use the Configuration in a widget, request the {@link widget_services#axConfiguration axConfiguration}
	 * injection. In compatibility mode with LaxarJS v1.x, it is also available under `laxar.configuration`.
	 *
	 * @module configuration
	 */
	function create(source, defaults) {
	
	  /**
	   * Provides access to the configuration that was passed during application bootstrapping.
	   *
	   * A *Configuration* instance provides convenient readonly access to the underlying LaxarJS
	   * application bootstrapping configuration. The configuration values are passed to
	   * {@link laxar#bootstrap()} on startup (before LaxarJS v2.x, these configuration values were read from
	   * `window.laxar`). When using the LaxarJS application template, the configuration values are set in the
	   * file `application/application.js` under your project's root directory.
	   *
	   * @name Configuration
	   * @constructor
	   */
	  return { get: get, ensure: ensure };
	
	  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	  /**
	   * Returns the configured value for the specified attribute path or `undefined` in case it wasn't
	   * configured. If a default value was passed as second argument this is returned instead of `undefined`.
	   *
	   * Services should use this to get configuration values for which there are universal fallback behaviors.
	   *
	   * Examples:
	   * ```js
	   * // ... inject `axConfiguration` as parameter `config` ...
	   * config.get( 'logging.threshold' ); // -> 'INFO'
	   * config.get( 'iDontExist' ); // -> undefined
	   * config.get( 'iDontExist', 42 ); // -> 42
	   * ```
	   *
	   * @param {String} key
	   *    a  path (using `.` as separator) to the property in the configuration object
	   * @param {*} [optionalDefault]
	   *    the value to return if no value was set for `key`
	   *
	   * @return {*}
	   *    either the configured value, `undefined` or `optionalDefault`
	   *
	   * @memberof Configuration
	   */
	  function get(key, optionalDefault) {
	    var value = (0, _object.path)(source, key);
	    return value !== undefined ? value : (0, _object.path)(defaults, key, optionalDefault);
	  }
	
	  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	  /**
	   * Retrieves a configuration value by key, failing if it is `undefined` or `null`.
	   *
	   * Services should use this to get configuration values for which no universal default or fallback exists.
	   *
	   * Examples:
	   * ```js
	   * // ... inject `axConfiguration` as parameter `config` ...
	   * config.ensure( 'logging.threshold' ); // -> 'INFO'
	   * config.ensure( 'iDontExist' ); // -> throws
	   * ```
	   *
	   * @param {String} key
	   *    a  path (using `.` as separator) to the property in the configuration object
	   *
	   * @return {*}
	   *    the configured value (if `undefined` or `null`, an exception is thrown instead)
	   *
	   * @memberof Configuration
	   */
	  function ensure(key) {
	    var value = get(key);
	    (0, _assert2.default)(value).isNotNull('Configuration is missing mandatory entry: ' + key);
	    return value;
	  }
	}

/***/ },
/* 46 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	exports.create = create;
	/**
	 * Copyright 2016 aixigo AG
	 * Released under the MIT license.
	 * http://laxarjs.org/license
	 */
	/**
	 * Module providing the Browser factory.
	 *
	 * Provides abstractions for browser APIs used internally by LaxarJS, which might need a different
	 * implementation in a server-side environment, or for testing.
	 * This service is internal to LaxarJS and not available to widgets and activities.
	 *
	 * @module browser
	 */
	
	/**
	 * Create a browser abstraction environment.
	 *
	 * @return {Browser}
	 *    a fresh browser instance
	 *
	 * @private
	 */
	function create() {
	
	   // for the MSIE `resolve`-workaround, cache the temporary HTML document
	   var resolveDoc = void 0;
	   var resolveDocBase = void 0;
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   /**
	    * A brower mostly abstracts over the location-related DOM window APIs, and provides a console wrapper.
	    * Since it is internal to LaxarJS, only relevant APIs are included.
	    *
	    * @name Browser
	    * @constructor
	    */
	   return {
	      /**
	      * Calculates an absolute URL from a (relative) URL, and an optional base URL.
	      *
	      * If no base URL is given, the `document.baseURI` is used instead. The given base URL may also be
	      * relative, in which case it is resolved against the `document.baseURI` before resolving the first URL.
	      *
	      * For browser environments that do not support the `new URL( url, baseUrl )` constructor for resolving
	      * URLs or that do not support `document.baseURI`, fallback mechanisms are used.
	      *
	      * @param {String} url
	      *    the URL to resolve
	      * @param {String} baseUrl
	      *    the base to resolve from
	      *
	      * @return {String}
	      *    an absolute URL based on the given URL
	      *
	      * @type {Function}
	      * @memberof Browser
	      */
	      resolve: selectResolver(),
	
	      /**
	       * Provides easily mocked access to `window.location`
	       *
	       * @return {Location}
	       *    the current (window's) DOM location
	       *
	       * @type {Function}
	       * @memberof Browser
	       */
	      location: function location() {
	         return window.location;
	      },
	
	      /**
	       * Provides easily mocked access to `window.fetch` or a suitable polyfill:
	       *
	       * @param {String|Request} input
	       *    the URL to fetch or the request to perform
	       * @param {Object} [init]
	       *    additional options, described here in more detail:
	       *    https://developer.mozilla.org/en-US/docs/Web/API/Globalfetch/fetch#Parameters
	       *
	       * @return {Promise<Response>}
	       *    the resulting promise
	       *
	       * @type {Function}
	       * @memberof Browser
	       */
	      fetch: function fetch(input, init) {
	         return window.fetch(input, init);
	      },
	
	      /**
	       * Provides easily mocked access to `window.console`:
	       *
	       * @return {Console}
	       *    the browser console promise
	       *
	       * @type {Function}
	       * @memberof Browser
	       */
	      console: function console() {
	         return window.console;
	      }
	   };
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   // perform the exception-based feature-detect only once (for performance, and to be nice to debugger users)
	   function selectResolver() {
	      try {
	         var href = window.location.href;
	
	         return new URL('', href).href === href ? resolveUsingUrl : resolveUsingLink;
	      } catch (e) {
	         return resolveUsingLink;
	      }
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   // Resolve using the DOM URL API (Chrome, Firefox, Safari, MS Edge)
	   function resolveUsingUrl(url, baseUrl) {
	      var absoluteBaseUrl = baseUrl ? abs(baseUrl) : document.baseURI || abs('.');
	      return new URL(url, absoluteBaseUrl).href;
	
	      function abs(url) {
	         return new URL(url, document.baseURI || resolveUsingLink('.'));
	      }
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   // Resolve using the a-tag fallback (MSIE)
	   function resolveUsingLink(url, baseUrl) {
	      var absoluteBaseUrl = abs(baseUrl);
	      if (!resolveDoc) {
	         resolveDoc = document.implementation.createHTMLDocument('');
	         resolveDocBase = resolveDoc.createElement('base');
	         resolveDoc.head.appendChild(resolveDocBase);
	      }
	      resolveDocBase.href = absoluteBaseUrl;
	      return abs(url, resolveDoc);
	
	      function abs(url) {
	         var baseDocument = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;
	
	         var a = baseDocument.createElement('a');
	         // MSIE does not process empty URLs correctly (http://stackoverflow.com/a/7966835)
	         a.href = url || '#';
	         return url ? a.href : a.href.slice(0, -1);
	      }
	   }
	}

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	exports.BLACKBOX = exports.levels = undefined;
	exports.create = create;
	exports.createConsoleChannel = createConsoleChannel;
	
	var _assert = __webpack_require__(38);
	
	var _assert2 = _interopRequireDefault(_assert);
	
	var _object = __webpack_require__(39);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /**
	                                                                                                                                                                                                     * Copyright 2016 aixigo AG
	                                                                                                                                                                                                     * Released under the MIT license.
	                                                                                                                                                                                                     * http://laxarjs.org/license
	                                                                                                                                                                                                     */
	/**
	 * Module providing the Logger factory.
	 *
	 * To use the Log service in a widget, request the {@link widget_services#axLog axLog} injection.
	 *
	 * @module log
	 */
	
	
	/**
	 * Log levels that are available by default, sorted by increasing severity:
	 *
	 * - TRACE (level 100)
	 * - DEBUG (level 200)
	 * - INFO (level 300)
	 * - WARN (level 400)
	 * - ERROR (level 500)
	 * - FATAL (level 600)
	 *
	 * @type {Object}
	 * @name levels
	 */
	var levels = exports.levels = {
	   TRACE: 100,
	   DEBUG: 200,
	   INFO: 300,
	   WARN: 400,
	   ERROR: 500,
	   FATAL: 600
	};
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Pass this as an additional replacement parameter to a log-method, in order to blackbox your logging call.
	 * Blackboxed callers are ignored when logging the source information (file, line).
	 *
	 * @type {Object}
	 * @name BLACKBOX
	 */
	var BLACKBOX = exports.BLACKBOX = {};
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function create(configuration, optionalBrowser) {
	   var startChannels = optionalBrowser ? [createConsoleChannel(optionalBrowser)] : [];
	   return new Logger(configuration, startChannels);
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	// eslint-disable-next-line valid-jsdoc
	/**
	 * A flexible logger.
	 *
	 * It is recommended to prefer this logger over `console.log` and friends, at least for any log messages that
	 * might make their way into production code. For once, this logger is safe to use across browsers and allows
	 * to attach additional channels for routing messages to (i.e. to send them to a server process for
	 * persistence). If a browser console is available, messages will be logged to that console using the builtin
	 * console channel.
	 * For testing, a silent mock for this logger is used, making it simple to test the logging behavior of
	 * widgets and activities, while avoiding noisy log messages in the test runner output.
	 *
	 * All messages produced
	 *
	 * @constructor
	 * @private
	 */
	function Logger(configuration) {
	   var _this = this;
	
	   var channels = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
	
	   this.levels = Object.assign({}, levels, configuration.get('logging.levels'));
	
	   this.queueSize_ = 100;
	   this.channels_ = channels;
	   this.counter_ = 0;
	   this.messageQueue_ = [];
	   this.threshold_ = 0;
	   this.tags_ = {};
	
	   this.levelToName_ = function (levels) {
	      var result = {};
	      (0, _object.forEach)(levels, function (level, levelName) {
	         _this[levelName.toLowerCase()] = function () {
	            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	               args[_key] = arguments[_key];
	            }
	
	            _this.log.apply(_this, [level].concat(args, [BLACKBOX]));
	         };
	         result[level] = levelName;
	      });
	      return result;
	   }(this.levels);
	
	   this.setLogThreshold(configuration.ensure('logging.threshold'));
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Logs a message. A message may contain placeholders in the form `[#]` where `#` resembles the index
	 * within the list of `replacements`. `replacements` are incrementally counted starting at `0`. If the
	 * log level is below the configured log threshold, the message is simply discarded.
	 *
	 * It is recommended not to use this method directly, but instead one of the short cut methods for the
	 * according log level.
	 *
	 * @param {Number} level
	 *    the level for this message
	 * @param {String} message
	 *    the message to log
	 * @param {...*} replacements
	 *    objects that should replace placeholders within the message
	 */
	Logger.prototype.log = function (level, message) {
	   for (var _len2 = arguments.length, replacements = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
	      replacements[_key2 - 2] = arguments[_key2];
	   }
	
	   if (level < this.threshold_) {
	      return;
	   }
	
	   var blackboxDepth = 0;
	   while (replacements[replacements.length - 1] === BLACKBOX) {
	      ++blackboxDepth;
	      replacements.pop();
	   }
	
	   var messageObject = {
	      id: this.counter_++,
	      level: this.levelToName_[level],
	      text: message,
	      replacements: replacements,
	      time: new Date(),
	      tags: this.gatherTags(),
	      sourceInfo: gatherSourceInformation(blackboxDepth + 1) // add 1 depth to exclude this function
	   };
	
	   this.channels_.forEach(function (channel) {
	      channel(messageObject);
	   });
	
	   if (this.messageQueue_.length === this.queueSize_) {
	      this.messageQueue_.shift();
	   }
	   this.messageQueue_.push(messageObject);
	};
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Logs a message in log level `TRACE`. See {@link Logger#log} for further information.
	 *
	 * *Important note*: This method is only available, if no custom log levels were defined via
	 * configuration or custom log levels include this method as well.
	 *
	 * @param {String} message
	 *    the message to log
	 * @param {...*} replacements
	 *    objects that should replace placeholders within the message
	 */
	Logger.prototype.trace = function () {};
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Logs a message in log level `DEBUG`. See {@link Logger#log} for further information.
	 *
	 * *Important note*: This method is only available, if no custom log levels were defined via
	 * configuration or custom log levels include this method as well.
	 *
	 * @param {String} message
	 *    the message to log
	 * @param {...*} replacements
	 *    objects that should replace placeholders within the message
	 */
	Logger.prototype.debug = function () {};
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Logs a message in log level `INFO`. See {@link Logger#log} for further information.
	 *
	 * *Important note*: This method is only available, if no custom log levels were defined via
	 * configuration or custom log levels include this method as well.
	 *
	 * @param {String} message
	 *    the message to log
	 * @param {...*} replacements
	 *    objects that should replace placeholders within the message
	 */
	Logger.prototype.info = function () {};
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Logs a message in log level `WARN`. See {@link Logger#log} for further information.
	 *
	 * *Important note*: This method is only available, if no custom log levels were defined via
	 * configuration or custom log levels include this method as well.
	 *
	 * @param {String} message
	 *    the message to log
	 * @param {...*} replacements
	 *    objects that should replace placeholders within the message
	 */
	Logger.prototype.warn = function () {};
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Logs a message in log level `ERROR`. See {@link Logger#log} for further information.
	 *
	 * *Important note*: This method is only available, if no custom log levels were defined via
	 * configuration or custom log levels include this method as well.
	 *
	 * @param {String} message
	 *    the message to log
	 * @param {...*} replacements
	 *    objects that should replace placeholders within the message
	 */
	Logger.prototype.error = function () {};
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Logs a message in log level `FATAL`. See {@link Logger#log} for further information.
	 *
	 * *Important note*: This method is only available, if no custom log levels were defined via
	 * configuration or custom log levels include this method as well.
	 *
	 * @param {String} message
	 *    the message to log
	 * @param {...*} replacements
	 *    objects that should replace placeholders within the message
	 */
	Logger.prototype.fatal = function () {};
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Adds a new channel to forward log messages to. A channel is called synchronously for every log message
	 * and can do whatever necessary to handle the message according to its task. Note that blocking or
	 * performance critical actions within a channel should always take place asynchronously to prevent from
	 * blocking the application. Ideally a web worker is used for heavier background tasks.
	 *
	 * Each message is an object having the following properties:
	 * - `id`: the unique, ascending id of the log message
	 * - `level`: the log level of the message in string representation
	 * - `text`: the actual message that was logged
	 * - `replacements`: the raw list of replacements passed along the message
	 * - `time`: JavaScript Date instance when the message was logged
	 * - `tags`: A map of all log tags currently set for the logger
	 * - `sourceInfo`: if supported, a map containing `file`, `line` and `char` where the logging took place
	 *
	 * @param {Function} channel
	 *    the log channel to add
	 */
	Logger.prototype.addLogChannel = function (channel) {
	   this.channels_.push(channel);
	   this.messageQueue_.forEach(function (entry) {
	      channel(entry);
	   });
	};
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Removes a log channel and thus stops sending further messages to it.
	 *
	 * @param {Function} channel
	 *    the log channel to remove
	 */
	Logger.prototype.removeLogChannel = function (channel) {
	   var channelIndex = this.channels_.indexOf(channel);
	   if (channelIndex > -1) {
	      this.channels_.splice(channelIndex, 1);
	   }
	};
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Adds a value for a log tag. If a tag is already known, the value is appended to the existing one using a
	 * `;` as separator. Note that no formatting of the value takes place and a non-string value will just have
	 * its appropriate `toString` method called.
	 *
	 * Log tags can be used to mark a set of log messages with a value giving further information on the
	 * current logging context. For example laxar sets a tag `'INST'` with a unique-like identifier for the
	 * current browser client. If then for example log messages are persisted on a server, messages belonging
	 * to the same client can be accumulated.
	 *
	 * @param {String} tag
	 *    the id of the tag to add a value for
	 * @param {String} value
	 *    the value to add
	 */
	Logger.prototype.addTag = function (tag, value) {
	   (0, _assert2.default)(tag).hasType(String).isNotNull();
	
	   if (!this.tags_[tag]) {
	      this.tags_[tag] = [value];
	   } else {
	      this.tags_[tag].push(value);
	   }
	};
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Sets a value for a log tag. If a tag is already known, the value is overwritten by the given one. Note
	 * that no formatting of the value takes place and a non-string value will just have its appropriate
	 * `toString` method called. For further information on log tags, see {@link Logger#addTag}.
	 *
	 * @param {String} tag
	 *    the id of the tag to set a value for
	 * @param {String} value
	 *    the value to set
	 */
	Logger.prototype.setTag = function (tag, value) {
	   (0, _assert2.default)(tag).hasType(String).isNotNull();
	
	   this.tags_[tag] = [value];
	};
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Removes a log tag. For further information on log tags, see {@link Logger#addTag}.
	 *
	 * @param {String} tag
	 *    the id of the tag to set a value for
	 */
	Logger.prototype.removeTag = function (tag) {
	   (0, _assert2.default)(tag).hasType(String).isNotNull();
	
	   delete this.tags_[tag];
	};
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Returns a map of all tags. If there are multiple values for the same tag, their values are concatenated
	 * using a `;` as separator. For further information on log tags, see {@link Logger#addTag}.
	 *
	 * @return {Object}
	 *    a mapping from tag to its value(s)
	 */
	Logger.prototype.gatherTags = function () {
	   var tags = {};
	   (0, _object.forEach)(this.tags_, function (values, tag) {
	      tags[tag] = values.join(';');
	   });
	   return tags;
	};
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Sets the threshold for log messages. Log messages with a lower level will be discarded upon logging.
	 *
	 * @param {String|Number} threshold
	 *    the numeric or the string value of the log level to use as threshold
	 */
	Logger.prototype.setLogThreshold = function (threshold) {
	   if (typeof threshold === 'string') {
	      _assert2.default.state(threshold.toUpperCase() in this.levels, 'Unsupported log threshold "' + threshold + '".');
	      this.threshold_ = this.levels[threshold.toUpperCase()];
	   } else {
	      (0, _assert2.default)(threshold).hasType(Number);
	      this.threshold_ = threshold;
	   }
	};
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	var EMPTY_CALL_INFORMATION = { file: '?', line: -1, char: -1 };
	
	function gatherSourceInformation(blackboxDepth) {
	   var e = new Error();
	
	   if (!e.stack) {
	      try {
	         // IE >= 10 only generates a stack if the error object is really thrown
	         throw new Error();
	      } catch (err) {
	         e = err;
	      }
	      if (!e.stack) {
	         return EMPTY_CALL_INFORMATION;
	      }
	   }
	
	   var rows = e.stack.split(/[\n]/);
	   var interpret = void 0;
	   if (rows[0] === 'Error') {
	      rows.shift();
	      interpret = chromeStackInterpreter;
	   } else if (rows[0].indexOf('@') !== -1) {
	      interpret = firefoxStackInterpreter;
	   } else {
	      return EMPTY_CALL_INFORMATION;
	   }
	
	   var row = rows[blackboxDepth + 1]; // add 1 depth to exclude this function
	   return row ? interpret(row) : EMPTY_CALL_INFORMATION;
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	var CHROME_AND_IE_STACK_MATCHER = /\(?([^\( ]+):(\d+):(\d+)\)?$/;
	
	function chromeStackInterpreter(row) {
	   var match = CHROME_AND_IE_STACK_MATCHER.exec(row);
	   return {
	      file: match ? match[1] : '?',
	      line: match ? match[2] : -1,
	      char: match ? match[3] : -1
	   };
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	var FIREFOX_STACK_MATCHER = /@(.+):(\d+)$/;
	
	function firefoxStackInterpreter(row) {
	   var match = FIREFOX_STACK_MATCHER.exec(row);
	   return {
	      file: match ? match[1] : '?',
	      line: match ? match[2] : -1,
	      char: -1
	   };
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function createConsoleChannel(browser) {
	
	   return function log(messageObject) {
	      var browserConsole = browser.console();
	      if (!browserConsole) {
	         return;
	      }
	
	      var level = messageObject.level,
	          text = messageObject.text,
	          replacements = messageObject.replacements,
	          _messageObject$source = messageObject.sourceInfo,
	          file = _messageObject$source.file,
	          line = _messageObject$source.line;
	
	
	      var logMethod = level.toLowerCase();
	      if (!(logMethod in browserConsole) || logMethod === 'trace') {
	         // In console objects trace doesn't define a valid log level but is used to print stack traces. We
	         // thus need to change it something different.
	         logMethod = 'log';
	      }
	
	      if (!(logMethod in browserConsole)) {
	         return;
	      }
	
	      var callArgs = [level + ': '].concat(mergeTextAndReplacements(text, replacements)).concat(['(@ ' + file + ':' + line + ')']);
	
	      browserConsole[logMethod].apply(browserConsole, _toConsumableArray(callArgs));
	   };
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function mergeTextAndReplacements(text, replacements) {
	   var parts = [];
	   var pos = 0;
	   var buffer = '';
	
	   while (pos < text.length) {
	      var character = text.charAt(pos);
	
	      switch (character) {
	         case '\\':
	            {
	               ++pos;
	               if (pos === text.length) {
	                  throw new Error('Unterminated string: "' + text + '"');
	               }
	
	               buffer += text.charAt(pos);
	               break;
	            }
	         case '[':
	            {
	               parts.push(buffer);
	               buffer = '';
	
	               var end = text.indexOf(']', pos);
	               if (end === -1) {
	                  throw new Error('Unterminated replacement at character ' + pos + ': "' + text + '"');
	               }
	
	               var replacementIndex = parseInt(text.substring(pos + 1, end), 10);
	
	               parts.push(replacements[replacementIndex]);
	               pos = end;
	
	               break;
	            }
	         default:
	            {
	               buffer += character;
	               break;
	            }
	      }
	
	      ++pos;
	   }
	
	   if (buffer.length > 0) {
	      parts.push(buffer);
	   }
	
	   return parts;
	}

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	exports.create = create;
	
	var _assert = __webpack_require__(38);
	
	var _assert2 = _interopRequireDefault(_assert);
	
	var _object = __webpack_require__(39);
	
	var object = _interopRequireWildcard(_object);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); } /**
	                                                                               * Copyright 2016 aixigo AG
	                                                                               * Released under the MIT license.
	                                                                               * http://laxarjs.org/license
	                                                                               */
	/**
	 * Module providing the EventBus factory.
	 *
	 * To use the EventBus in a widget, request the {@link widget_services#axEventBus axEventBus} injection, or
	 * use the `eventBus` property on the {@link widget_services#axContext axContext} injection.
	 * In some cases, it may be useful to inject the global EventBus instance backing all widget instances of the
	 * same bootstrapping context, by requesting the {@link widget_services#axGlobalEventBus axGlobalEventBus}
	 * injection.
	 *
	 * @module event_bus
	 */
	
	
	var WILDCARD = '*';
	var SUBSCRIBER_FIELD = '.';
	
	var TOPIC_SEPARATOR = '.';
	var SUB_TOPIC_SEPARATOR = '-';
	var REQUEST_MATCHER = /^([^.])([^.]*)Request(\..+)?$/;
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * @param {Object} configuration
	 *    configuration for the event bus instance.
	 *    The key `eventBusTimeoutMs` is used to determine the will/did timeout.
	 * @param {Object} log
	 *    a logger instance for error reporting
	 * @param {Function} nextTick
	 *    a next tick function like `process.nextTick`, `setImmediate` or AngularJS' `$timeout`
	 * @param {Function} timeoutFunction
	 *    a timeout function like `window.setTimeout` or AngularJS' `$timeout`
	 * @param {Function} [errorHandler]
	 *    a custom handler for thrown exceptions. By default exceptions are logged using the global logger.
	 *
	 * @constructor
	 * @private
	 */
	function EventBus(configuration, log, nextTick, timeoutFunction) {
	   var errorHandler = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : createLogErrorHandler(log);
	
	   this.nextTick_ = function (f) {
	      return nextTick(f);
	   };
	   this.timeoutFunction_ = function (f, ms) {
	      return timeoutFunction(f, ms);
	   };
	   this.timeoutMs_ = configuration.ensure('eventBusTimeoutMs');
	   this.errorHandler_ = errorHandler;
	
	   this.cycleCounter_ = 0;
	   this.eventQueue_ = [];
	   this.subscriberTree_ = {};
	
	   this.waitingPromiseResolves_ = [];
	   this.currentCycle_ = -1;
	   this.inspectors_ = [];
	   this.log_ = log;
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Adds an inspector, that gets notified when certain actions within the event bus take place. Currently
	 * these actions may occur:
	 *
	 * - `subscribe`: a new subscriber registered for an event
	 * - `publish`: an event is published but not yet delivered
	 * - `deliver`: an event is actually delivered to a subscriber
	 *
	 * An inspector receives a map with the following properties:
	 *
	 * - `action`: one of the actions from above
	 * - `source`: the origin of the `action`
	 * - `target`: the name of the event subscriber (`deliver` action only)
	 * - `event`: the full name of the event or the subscribed event (`subscribe` action only)
	 * - `eventObject`: the published event item (`publish` action only)
	 * - `subscribedTo`: the event, possibly with omissions, the subscriber subscribed to (`deliver` action only)
	 * - `cycleId`: the id of the event cycle
	 *
	 * The function returned by this method can be called to remove the inspector again and prevent it from
	 * being called for future event bus actions.
	 *
	 * @param {Function} inspector
	 *    the inspector function to add
	 *
	 * @return {Function}
	 *    a function to remove the inspector
	 */
	EventBus.prototype.addInspector = function (inspector) {
	   (0, _assert2.default)(inspector).hasType(Function).isNotNull();
	
	   this.inspectors_.push(inspector);
	   return function () {
	      var index = this.inspectors_.indexOf(inspector);
	      if (index !== -1) {
	         this.inspectors_.splice(index, 1);
	      }
	   }.bind(this);
	};
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Subscribes to an event by name. An event name consists of so called *topics*, where each topic is
	 * separated from another by dots (`.`). If a topic is omitted, this is treated as a wildcard. Note that
	 * two dots in the middle or one dot at the beginning of an event name must remain, whereas a dot at the
	 * end may be omitted. As such every event name has an intrinsic wildcard at its end. For example these are
	 * all valid event names:
	 *
	 * - `some.event`: matches `some.event`, `some.event.again`
	 * - `.event`: matches `some.event`, `any.event`, `any.event.again`
	 * - `some..event`: matches `some.fancy.event`, `some.special.event`
	 *
	 * Additionally *subtopics* are supported. Subtopics are fragments of a topic, separated from another by
	 * simple dashes (`-`). Here only suffixes of subtopics may be omitted when subscribing. Thus subscribing
	 * to `some.event` would match an event published with name `some.event-again` or even
	 * `some.event-another.again`.
	 *
	 * **The subscriber function**
	 *
	 * When an event is delivered, the subscriber function receives two arguments:
	 * The first one is the event object as it was published. If `optionalOptions.clone` yields `true` this is a
	 * simple deep copy of the object (note that only properties passing a JSON-(de)serialization remain). If
	 * `false` the object is frozen using `Object.freeze` recursively.
	 *
	 * The second one is a meta object with these properties:
	 *
	 * - `name`: The name of the event as it actually was published (i.e. without wildcards).
	 * - `cycleId`: The id of the cycle the event was published (and delivered) in
	 * - `sender`: The id of the event sender, may be `null`.
	 * - `initiator`: The id of the initiator of the cycle. Currently not implemented, thus always `null`.
	 * - `options`: The options that were passed to `publish` or `publishAndGatherReplies` respectively.
	 *
	 * @param {String} eventName
	 *    the name of the event to subscribe to
	 * @param {Function} subscriber
	 *    a function to call whenever an event matching `eventName` is published
	 * @param {Object} [optionalOptions]
	 *    additional options for the subscribe action
	 * @param {String} [optionalOptions.subscriber=null]
	 *    the id of the subscriber. Default is `null`
	 * @param {Boolean} [optionalOptions.clone=true]
	 *    if `false` the event will be send frozen to the subscriber, otherwise it will receive a deep copy.
	 *    Default is `true`
	 *
	 * @return {Function}
	 *    a function that when called unsubscribes from this subscription again
	 */
	EventBus.prototype.subscribe = function (eventName, subscriber, optionalOptions) {
	   var _this = this;
	
	   (0, _assert2.default)(eventName).hasType(String).isNotNull();
	   (0, _assert2.default)(subscriber).hasType(Function).isNotNull();
	
	   var options = object.options(optionalOptions, {
	      subscriber: null,
	      clone: true
	   });
	   var subscriberItem = {
	      name: eventName,
	      subscriber: subscriber,
	      subscriberName: options.subscriber,
	      subscriptionWeight: calculateSubscriptionWeight(eventName),
	      options: options
	   };
	
	   var eventNameParts = eventName.split(TOPIC_SEPARATOR);
	   var node = eventNameParts.reduce(function (node, eventNamePart) {
	      var bucketName = eventNamePart || WILDCARD;
	      if (!(bucketName in node)) {
	         node[bucketName] = {};
	      }
	      return node[bucketName];
	   }, this.subscriberTree_);
	
	   if (!(SUBSCRIBER_FIELD in node)) {
	      node[SUBSCRIBER_FIELD] = [];
	   }
	   node[SUBSCRIBER_FIELD].push(subscriberItem);
	
	   notifyInspectors(this, {
	      action: 'subscribe',
	      source: options.subscriber,
	      target: '-',
	      event: eventName,
	      cycleId: this.currentCycle_
	   });
	
	   return function () {
	      unsubscribeRecursively(_this, _this.subscriberTree_, eventNameParts, subscriber);
	   };
	};
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Asynchronously publishes an event on the event bus. The returned promise will be enqueued as soon as this
	 * event is delivered and, if during delivery a new event was enqueued, resolved after that new event was
	 * delivered. If no new event is published during delivery of this event, the promise is instantly resolved.
	 * To make this a bit clearer, lets assume we publish and thus enqueue an event at time `t`. It then will
	 * be delivered at time `t+1`. At that precise moment the promise is enqueued to be resolved soon. We then
	 * distinguish between two cases:
	 *
	 * - At time `t+1` no subscriber publishes (i.e. enqueues) an event: Thus there is no event in the same
	 *   cycle and the promise is also resolved at time `t+1`.
	 * - At least one subscriber publishes an event at time `t+1`: The promise is then scheduled to be resolved
	 *   as soon as this event is delivered at time `t+2`.
	 *
	 * The implication of this is the following:
	 *
	 * We have two collaborators, A and B. A listens to event b and B listens to event a.
	 * Whenever A publishes a and B than instantly (i.e. in the same event cycle of the JavaScript runtime
	 * where its subscriber function was called) *responds* by publishing b, b arrives at the subscriber
	 * function of A, before the promise of A's publish action is resolved.
	 * It is hence possible to observe possible effects of an event sent by oneself, under the conditions
	 * mentioned above. Practically this is used internally for the implementation of
	 * {@link #EventBus.publishAndGatherReplies()}.
	 *
	 * @param {String} eventName
	 *    the name of the event to publish
	 * @param {Object} [optionalEvent]
	 *    the event to publish
	 * @param {Object} [optionalOptions]
	 *    additional options for the publish action
	 * @param {String} [optionalOptions.sender=null]
	 *    the id of the event sender. Default is `null`
	 * @param {Boolean} [optionalOptions.deliverToSender=true]
	 *    if `false` the event will not be send to subscribers whose subscriber name matches
	 *    `optionalOptions.sender`, else all subscribers will receive the event. Default is `true`
	 *
	 * @return {Promise}
	  *   the delivery promise
	 */
	EventBus.prototype.publish = function (eventName) {
	   var _this2 = this;
	
	   var optionalEvent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	   var optionalOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
	
	   (0, _assert2.default)(eventName).hasType(String).isNotNull();
	
	   var event = JSON.parse(JSON.stringify(optionalEvent));
	   var options = Object.assign({ deliverToSender: true, sender: null }, optionalOptions);
	
	   return new Promise(function (resolve) {
	      var eventItem = {
	         meta: {
	            name: eventName,
	            cycleId: _this2.currentCycle_ > -1 ? _this2.currentCycle_ : _this2.cycleCounter_++,
	            sender: options.sender,
	            initiator: null,
	            options: options
	         },
	         event: event,
	         resolvePublish: resolve
	      };
	      enqueueEvent(_this2, eventItem);
	
	      notifyInspectors(_this2, {
	         action: 'publish',
	         source: options.sender,
	         target: '-',
	         event: eventName,
	         eventObject: event,
	         cycleId: eventItem.meta.cycleId
	      });
	   });
	};
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Publishes an event that follows the *request-will-did pattern* and awaits all replies. This pattern has
	 * evolved over time and is of great use when handling the asynchronous nature of event bus events.
	 *
	 * Certain rules need to be fulfilled: First the initiator needs to call this method with an event whose
	 * name has the suffix `Request`, e.g. `takeActionRequest`. All collaborators that want to react to this
	 * event then either do so in the same event cycle by sending a `didTakeAction` event or announce that they
	 * will do something asynchronously by publishing a `willTakeAction` event. In the latter case they need to
	 * broadcast the fulfillment of their action some time later by sending a `didTakeAction` event. Note that for
	 * both events the same sender name needs to be given. Otherwise they cannot be mapped and the event bus
	 * doesn't know if all asynchronous replies were already received.
	 *
	 * Additionally a timer is started using either the globally configured `pendingDidTimeout` ms value or the
	 * value provided as option to this method. If that timer expires before all `did*` events to all given
	 * `will*` events were received, the error handler is called to handle the incident and the promise is
	 * rejected with all responses received up to now.
	 *
	 * @param {String} eventName
	 *    the name of the event to publish
	 * @param {Object} [optionalEvent]
	 *    the event to publish
	 * @param {Object} [optionalOptions]
	 *    additional options for the publish action
	 * @param {String} [optionalOptions.sender=null]
	 *    the id of the event sender. Default is `null`
	 * @param {Number} [optionalOptions.pendingDidTimeout]
	 *    the timeout in milliseconds for pending did* events. Default is the timeout option used when the
	 *    event bus instance was created
	 *
	 * @return {Promise}
	 *   the delivery promise. It receives a list of all collected `did*` events and according meta information
	 */
	EventBus.prototype.publishAndGatherReplies = function (eventName, optionalEvent, optionalOptions) {
	   var _this3 = this;
	
	   (0, _assert2.default)(eventName).hasType(String).isNotNull();
	
	   var matches = REQUEST_MATCHER.exec(eventName);
	   _assert2.default.state(!!matches, 'Expected eventName to end with "Request" but got ' + eventName);
	
	   var options = Object.assign({ pendingDidTimeout: this.timeoutMs_ }, optionalOptions);
	
	   var eventNameSuffix = matches[1].toUpperCase() + matches[2];
	   if (matches[3]) {
	      eventNameSuffix += matches[3];
	   }
	   var deferred = {};
	   deferred.promise = new Promise(function (resolve, reject) {
	      deferred.resolve = resolve;
	      deferred.reject = reject;
	   });
	   var willWaitingForDid = [];
	   var givenDidResponses = [];
	   var cycleFinished = false;
	
	   var unsubscribeWillCollector = this.subscribe('will' + eventNameSuffix, function (event, meta) {
	      (0, _assert2.default)(meta.sender).hasType(String).isNotNull('A response with will to a request-event must contain a sender.');
	
	      willWaitingForDid.push(meta.sender);
	   }, { subscriber: options.sender });
	
	   var unsubscribeDidCollector = this.subscribe('did' + eventNameSuffix, function (event, meta) {
	      givenDidResponses.push({ event: event, meta: meta });
	      var senderIndex = void 0;
	      do {
	         senderIndex = willWaitingForDid.indexOf(meta.sender);
	         if (senderIndex !== -1) {
	            willWaitingForDid.splice(senderIndex, 1);
	         }
	      } while (senderIndex !== -1);
	
	      if (willWaitingForDid.length === 0 && cycleFinished) {
	         finish();
	      }
	   }, { subscriber: options.sender });
	
	   var timeoutRef = this.timeoutFunction_(function () {
	      if (willWaitingForDid.length > 0) {
	         var message = 'Timeout while waiting for pending did' + eventNameSuffix + ' on ' + eventName + '.';
	         _this3.errorHandler_(message, {
	            'Sender': options.sender,
	            'After ms timeout': options.pendingDidTimeout,
	            'Responses missing from': willWaitingForDid.join(', ')
	         });
	         finish(true);
	      }
	   }, options.pendingDidTimeout);
	
	   this.publish(eventName, optionalEvent, options).then(function () {
	      unsubscribeWillCollector();
	      if (willWaitingForDid.length === 0) {
	         // either there was no will or all did responses were already given in the same cycle as the will
	         finish();
	         return;
	      }
	      cycleFinished = true;
	   });
	
	   function finish(wasCanceled) {
	      clearTimeout(timeoutRef);
	      unsubscribeDidCollector();
	      (wasCanceled ? deferred.reject : deferred.resolve)(givenDidResponses);
	   }
	
	   return deferred.promise;
	};
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function enqueueEvent(self, eventItem) {
	   if (self.eventQueue_.length === 0) {
	      self.nextTick_(function () {
	         var queuedEvents = self.eventQueue_;
	
	         self.eventQueue_ = [];
	
	         processWaitingPublishPromises(self, processQueue(self, queuedEvents));
	      });
	   }
	   self.eventQueue_.push(eventItem);
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function processQueue(self, queuedEvents) {
	   return queuedEvents.map(function (eventItem) {
	      var meta = eventItem.meta;
	      self.currentCycle_ = meta.cycleId;
	
	      var subscribers = findSubscribers(self, meta.name);
	      if (subscribers.length === 0) {
	         self.currentCycle_ = -1;
	         return eventItem.resolvePublish;
	      }
	
	      var serializedEvent = null;
	      if (subscribers.length > 1) {
	         serializedEvent = JSON.stringify(eventItem.event);
	      }
	
	      var senderName = meta.sender;
	      var options = meta.options;
	
	      subscribers.forEach(function (subscriberItem) {
	         var subscriberName = subscriberItem.subscriberName;
	         if (!options.deliverToSender && senderName && senderName === subscriberName) {
	            return;
	         }
	
	         try {
	            var event = void 0;
	            if (subscriberItem.options.clone) {
	               event = serializedEvent ? JSON.parse(serializedEvent) : eventItem.event;
	            } else {
	               event = eventItem.event;
	            }
	            subscriberItem.subscriber(event, meta);
	         } catch (e) {
	            var message = 'error while calling subscriber "' + subscriberName + '"' + (' for event ' + meta.name) + (' published by "' + senderName + '" (subscribed to: ' + subscriberItem.name + ')');
	            self.errorHandler_(message, {
	               'Exception': e,
	               'Published event': eventItem.event,
	               'Event meta information': meta,
	               'Caused by Subscriber': subscriberItem
	            });
	         }
	
	         notifyInspectors(self, {
	            action: 'deliver',
	            source: senderName,
	            target: subscriberName,
	            event: meta.name,
	            eventObject: eventItem.event,
	            subscribedTo: subscriberItem.name,
	            cycleId: meta.cycleId
	         });
	      });
	
	      self.currentCycle_ = -1;
	
	      return eventItem.resolvePublish;
	   });
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function processWaitingPublishPromises(self, newPromiseResolves) {
	   var waitingResolves = self.waitingPromiseResolves_;
	   self.waitingPromiseResolves_ = newPromiseResolves;
	
	   waitingResolves.forEach(function (resolve) {
	      return resolve();
	   });
	
	   if (self.eventQueue_.length === 0) {
	      // nothing was queued by any subscriber. The publishers can instantly be notified of delivery.
	      newPromiseResolves.forEach(function (resolve) {
	         return resolve();
	      });
	      self.waitingPromiseResolves_ = [];
	   }
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function unsubscribeRecursively(self, node, parts, subscriber) {
	   if (parts.length === 0 && Array.isArray(node[SUBSCRIBER_FIELD])) {
	      var subscribers = node[SUBSCRIBER_FIELD];
	      for (var i = subscribers.length - 1; i >= 0; --i) {
	         if (subscribers[i].subscriber === subscriber) {
	            notifyInspectors(self, {
	               action: 'unsubscribe',
	               source: subscribers[i].subscriberName,
	               target: '-',
	               event: subscribers[i].name,
	               cycleId: self.currentCycle_
	            });
	            subscribers.splice(i, 1);
	         }
	      }
	   }
	
	   var _parts = _toArray(parts),
	       part = _parts[0],
	       rest = _parts.slice(1);
	
	   var searchPart = part || WILDCARD;
	   if (searchPart in node) {
	      unsubscribeRecursively(self, node[searchPart], rest, subscriber);
	   }
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function findSubscribers(self, eventName) {
	   var subscribers = [];
	   var parts = eventName.split(TOPIC_SEPARATOR);
	   var node = self.subscriberTree_;
	
	   findSubscribersRecursively(node, parts, subscribers);
	   subscribers.sort(function (a, b) {
	      var aWeight = a.subscriptionWeight;
	      var bWeight = b.subscriptionWeight;
	      if (aWeight[0] === bWeight[0]) {
	         return bWeight[1] - aWeight[1];
	      }
	
	      return bWeight[0] - aWeight[0];
	   });
	
	   return subscribers;
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function findSubscribersRecursively(node, parts, subscribers) {
	   if (Array.isArray(node[SUBSCRIBER_FIELD])) {
	      subscribers.push.apply(subscribers, _toConsumableArray(node[SUBSCRIBER_FIELD]));
	   }
	
	   if (parts.length === 0) {
	      return;
	   }
	
	   var _parts2 = _toArray(parts),
	       part = _parts2[0],
	       remainder = _parts2.slice(1);
	
	   if (part.indexOf(SUB_TOPIC_SEPARATOR) !== -1) {
	      var index = part.length;
	      var currentPart = part;
	      do {
	         currentPart = currentPart.substring(0, index);
	         if (currentPart in node) {
	            findSubscribersRecursively(node[currentPart], remainder, subscribers);
	         }
	         index = currentPart.lastIndexOf(SUB_TOPIC_SEPARATOR);
	      } while (index !== -1);
	   } else if (part in node) {
	      findSubscribersRecursively(node[part], remainder, subscribers);
	   }
	
	   if (WILDCARD in node) {
	      findSubscribersRecursively(node[WILDCARD], remainder, subscribers);
	   }
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function calculateSubscriptionWeight(eventName) {
	   var parts = eventName.split(TOPIC_SEPARATOR);
	   var weight = [0, 0];
	   parts.forEach(function (part) {
	      if (part.length > 0) {
	         weight[0]++;
	         weight[1] += part.split(SUB_TOPIC_SEPARATOR).length - 1;
	      }
	   });
	   return weight;
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function notifyInspectors(self, infoObject) {
	   self.inspectors_.forEach(function (inspector) {
	      inspector(infoObject);
	   });
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function createLogErrorHandler(log) {
	   return function (message, optionalErrorInformation) {
	      var sensitiveData = ['Published event'];
	
	      log.error('EventBus: ' + message);
	
	      if (optionalErrorInformation) {
	         object.forEach(optionalErrorInformation, function (info, title) {
	            var formatString = '   - [0]: [1:%o]';
	            if (sensitiveData.indexOf(title) !== -1) {
	               formatString = '   - [0]: [1:%o:anonymize]';
	            }
	
	            log.error(formatString, title, info);
	
	            if (info instanceof Error && info.stack) {
	               log.error('   - Stacktrace: ' + info.stack);
	            }
	         });
	      }
	   };
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Creates and returns a new event bus instance using the given configuration.
	 *
	 * @param {Object} configuration
	 *    configuration for the event bus instance.
	 *    The key `eventBusTimeoutMs` is used to determine the will/did timeout.
	 * @param {Object} log
	 *    a logger to use for error reporting
	 * @param {Function} nextTick
	 *    a next tick function like `process.nextTick` or AngularJS' `$timeout`
	 * @param {Function} timeoutFunction
	 *    a timeout function like `window.setTimeout` or AngularJS' `$timeout`
	 * @param {Function} [errorHandler]
	 *    a custom handler for thrown exceptions. By default exceptions are logged using the global logger.
	 *
	 * @return {EventBus}
	 *    an event bus instance
	 *
	 * @private
	 */
	function create(configuration, log, nextTick, timeoutFunction, errorHandler) {
	   (0, _assert2.default)(configuration.ensure).hasType(Function).isNotNull();
	   (0, _assert2.default)(log.error).hasType(Function).isNotNull();
	   (0, _assert2.default)(nextTick).hasType(Function).isNotNull();
	   (0, _assert2.default)(timeoutFunction).hasType(Function).isNotNull();
	   (0, _assert2.default)(errorHandler).hasType(Function);
	
	   return new EventBus(configuration, log, nextTick, timeoutFunction, errorHandler);
	}

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * Copyright 2016 aixigo AG
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * Released under the MIT license.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * http://laxarjs.org/license
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          */
	
	
	exports.create = create;
	
	var _assert = __webpack_require__(38);
	
	var _assert2 = _interopRequireDefault(_assert);
	
	var _object = __webpack_require__(39);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var NOT_FOUND = { content: null };
	
	function create(artifacts, browser, configuration, log) {
	
	   var baseHref = configuration.get('baseHref');
	
	   var resolve = baseHref ? function (_) {
	      return browser.resolve(_, baseHref);
	   } : function (_) {
	      return _;
	   };
	
	   var _ref = function (themeRef) {
	      var themeIndex = artifacts.aliases.themes[themeRef];
	      var theme = artifacts.themes[themeIndex];
	      if (!theme) {
	         log.error('The configured theme ' + themeRef + ' is not available.');
	         return ['default', 'default.theme'];
	      }
	      return [themeRef, theme.descriptor.name];
	   }(configuration.ensure('theme')),
	       _ref2 = _slicedToArray(_ref, 2),
	       themeRef = _ref2[0],
	       themeName = _ref2[1];
	
	   return {
	      forFlow: makeProvider('flows', ['descriptor'], ['definition']),
	      forTheme: makeProvider('themes', ['descriptor', 'assets']).bind(null, themeRef),
	      forPage: makeProvider('pages', ['descriptor'], ['definition']),
	      forLayout: makeProvider('layouts', ['descriptor', 'assets']),
	      forWidget: makeProvider('widgets', ['descriptor', 'assets', 'module']),
	      forControl: makeProvider('controls', ['descriptor', 'assets', 'module'])
	   };
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function makeProvider(bucket) {
	      var keys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
	      var cloneKeys = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
	
	      return function (ref) {
	         var api = {};
	         var index = artifacts.aliases[bucket][ref];
	         var artifactPromise = index === undefined ? Promise.reject(new Error('Artifact ' + ref + ' not found in ' + bucket)) : Promise.resolve(artifacts[bucket][index]);
	
	         ['definition', 'module', 'descriptor'].forEach(function (key) {
	            if (cloneKeys.includes(key)) {
	               api[key] = function () {
	                  return artifactPromise.then(function (_) {
	                     return (0, _object.deepClone)(_[key]);
	                  });
	               };
	            } else if (keys.includes(key)) {
	               api[key] = function () {
	                  return artifactPromise.then(function (_) {
	                     return _[key];
	                  });
	               };
	            }
	         });
	
	         if (keys.includes('assets')) {
	            (function () {
	               var lookup = function lookup(name) {
	                  (0, _assert2.default)(name).hasType(String).isNotNull();
	                  return function (_ref3) {
	                     var _ref3$assets = _ref3.assets,
	                         assets = _ref3$assets === undefined ? {} : _ref3$assets;
	
	                     return assets[name] || NOT_FOUND;
	                  };
	               };
	
	               var lookupForTheme = function lookupForTheme(name) {
	                  (0, _assert2.default)(name).hasType(String).isNotNull();
	                  return function (_ref4) {
	                     var _ref4$assets = _ref4.assets,
	                         assets = _ref4$assets === undefined ? {} : _ref4$assets;
	
	                     var themedAssets = assets[themeName];
	                     if (themedAssets && themedAssets[name]) {
	                        return themedAssets[name];
	                     }
	                     var defaultAssets = assets['default.theme'];
	                     if (defaultAssets && defaultAssets[name]) {
	                        return defaultAssets[name];
	                     }
	                     return NOT_FOUND;
	                  };
	               };
	
	               var provide = function provide(_ref5) {
	                  var url = _ref5.url,
	                      content = _ref5.content;
	
	                  if (content == null && url) {
	                     return browser.fetch(resolve(url)).then(function (_) {
	                        return _.text();
	                     });
	                  }
	                  return content || null;
	               };
	
	               var provideUrl = function provideUrl(_ref6) {
	                  var url = _ref6.url;
	                  return url ? resolve(url) : null;
	               };
	
	               api.asset = function (name) {
	                  return artifactPromise.then(lookup(name)).then(provide);
	               };
	
	               api.assetUrl = function (name) {
	                  return artifactPromise.then(lookup(name)).then(provideUrl);
	               };
	
	               api.assetForTheme = function (name) {
	                  return artifactPromise.then(lookupForTheme(name)).then(provide);
	               };
	
	               api.assetUrlForTheme = function (name) {
	                  return artifactPromise.then(lookupForTheme(name)).then(provideUrl);
	               };
	            })();
	         }
	
	         return api;
	      };
	   }
	}

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * Copyright 2016 aixigo AG
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * Released under the MIT license.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * http://laxarjs.org/license
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          */
	/**
	 * The control loader helps to load control assets and implementations.
	 *
	 * @module control_loader
	 */
	
	
	exports.create = create;
	
	var _string = __webpack_require__(40);
	
	function create(artifactProvider, cssLoader) {
	
	   var notDeclaredMessage = 'Tried to load control reference [0] without declaration in widget.json.\nDetails: [1]';
	   var errorInfoLink = 'https://github.com/LaxarJS/laxar/blob/master/docs/manuals/providing_controls.md#compatibility';
	
	   var aliases = {};
	   var modules = {};
	
	   /**
	    * @constructor
	    * @name ControlLoader
	    */
	   return {
	      load: load,
	      provide: provide
	   };
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   /**
	    * Provides the implementation module of the given control, for manual instantiation by a widget.
	    *
	    * Because the method must return synchronously, it may only be called for controls that have been
	    * loaded before (using {@link #load()})!
	    * For controls that are correctly listed in the `controls` section of the `widget.json`, this is ensured
	    * by the widget loader.
	    *
	    * @param {String} controlRef
	    *   a valid control reference as used in the `widget.json`
	    *
	    * @return {*}
	    *   the module for the requested control reference
	    *
	    * @memberof ControlLoader
	    */
	   function provide(controlRef) {
	      var module = modules[aliases[controlRef]];
	      if (!module) {
	         var message = (0, _string.format)('axControls: ' + notDeclaredMessage, [controlRef, errorInfoLink]);
	         throw new Error(message);
	      }
	      return module;
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   /**
	    * Fetches the descriptor for a given control reference, and saves it as a side-effect.
	    * This is part of the internal API used by the widget loader.
	    *
	    * This process must be completed before the descriptor or the module for a control can be provided.
	    * For this reason, `load` is called by the widget-loader, using information from the `widget.json` file.
	    *
	    * @param {String} controlRef
	    *   a valid control reference as used in the `widget.json`
	    *
	    * @return {Promise}
	    *   a promise for the (fetched or synthesized) control descriptor
	    *
	    * @memberof ControlLoader
	    */
	   function load(controlRef) {
	      var _artifactProvider$for = artifactProvider.forControl(controlRef),
	          assetUrlForTheme = _artifactProvider$for.assetUrlForTheme,
	          descriptor = _artifactProvider$for.descriptor,
	          module = _artifactProvider$for.module;
	
	      return Promise.all([descriptor(), module()]).then(function (_ref) {
	         var _ref2 = _slicedToArray(_ref, 2),
	             descriptor = _ref2[0],
	             module = _ref2[1];
	
	         var name = descriptor.name;
	
	         aliases[controlRef] = name;
	         modules[name] = module;
	         return assetUrlForTheme(descriptor.styleSource || 'css/' + name + '.css').then(function (url) {
	            if (url) {
	               cssLoader.load(url);
	            }
	         }).then(function () {
	            return descriptor;
	         });
	      });
	   }
	}

/***/ },
/* 51 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	exports.create = create;
	/**
	 * Copyright 2016 aixigo AG
	 * Released under the MIT license.
	 * http://laxarjs.org/license
	 */
	
	function create() {
	   var mergedCssFileLoaded = Array.from(document.getElementsByTagName('link')).some(function (link) {
	      return link.hasAttribute('data-ax-merged-css');
	   });
	
	   if (mergedCssFileLoaded) {
	      return {
	         load: function load() {}
	      };
	   }
	
	   var loadedFiles = [];
	   return {
	      /**
	       * If not already loaded, loads the given file into the current page by appending a `link` element to
	       * the document's `head` element.
	       *
	       * @param {String} url
	       *    the url of the css file to load. If `null`, loading is skipped
	       */
	      load: function load(url) {
	         if (!loadedFiles.includes(url)) {
	            var element = document.createElement('link');
	            element.type = 'text/css';
	            element.id = 'cssLoaderStyleSheet' + loadedFiles.length;
	            element.rel = 'stylesheet';
	            element.href = url;
	            document.getElementsByTagName('head')[0].appendChild(element);
	
	            loadedFiles.push(url);
	         }
	      }
	   };
	}

/***/ },
/* 52 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	exports.create = create;
	/**
	 * Copyright 2016 aixigo AG
	 * Released under the MIT license.
	 * http://laxarjs.org/license
	 */
	
	function create(artifactProvider, cssLoader) {
	   return {
	      load: function load(layoutRef) {
	         var _artifactProvider$for = artifactProvider.forLayout(layoutRef),
	             descriptor = _artifactProvider$for.descriptor,
	             assetForTheme = _artifactProvider$for.assetForTheme,
	             assetUrlForTheme = _artifactProvider$for.assetUrlForTheme;
	
	         return descriptor().then(function (_ref) {
	            var name = _ref.name,
	                templateSource = _ref.templateSource,
	                styleSource = _ref.styleSource;
	            return Promise.all([assetForTheme(templateSource || name + ".html"), assetUrlForTheme(styleSource || "css/" + name + ".css"), Promise.resolve(name)]);
	         }).then(function (_ref2) {
	            var _ref3 = _slicedToArray(_ref2, 3),
	                html = _ref3[0],
	                cssUrl = _ref3[1],
	                name = _ref3[2];
	
	            if (cssUrl) {
	               cssLoader.load(cssUrl);
	            }
	            return { name: name, className: name + "-layout", html: html };
	         });
	      }
	   };
	}

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * Copyright 2016 aixigo AG
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * Released under the MIT license.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * http://laxarjs.org/license
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          */
	
	
	exports.create = create;
	
	var _assert = __webpack_require__(38);
	
	var _assert2 = _interopRequireDefault(_assert);
	
	var _object = __webpack_require__(39);
	
	var object = _interopRequireWildcard(_object);
	
	var _string = __webpack_require__(40);
	
	var string = _interopRequireWildcard(_string);
	
	var _json_validator = __webpack_require__(54);
	
	var _features_provider = __webpack_require__(58);
	
	var featuresProvider = _interopRequireWildcard(_features_provider);
	
	var _page = __webpack_require__(59);
	
	var _page2 = _interopRequireDefault(_page);
	
	var _pages = __webpack_require__(60);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	var SEGMENTS_MATCHER = /[_/-]./g;
	
	var ID_SEPARATOR = '-';
	var ID_SEPARATOR_MATCHER = /\-/g;
	var SUBTOPIC_SEPARATOR = '+';
	
	var COMPOSITION_EXPRESSION_MATCHER = /^(!?)\$\{([^}]+)\}$/;
	var COMPOSITION_TOPIC_PREFIX = 'topic:';
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function PageLoader(artifactProvider, pageCollector) {
	   this.artifactProvider_ = artifactProvider;
	   this.pageToolingCollector_ = pageCollector;
	   this.idCounter_ = 0;
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Loads a page specification and resolves all extension and compositions. The result is a page were all
	 * referenced page fragments are merged in to one JavaScript object. As loading of all relevant files is
	 * already asynchronous, this method is also asynchronous and thus returns a promise that is either
	 * resolved with the constructed page or rejected with a JavaScript `Error` instance.
	 *
	 * @param {String} pageRef
	 *    the page to load. Usually a path relative to the base url, with the `.json` suffix omitted
	 *
	 * @return {Promise}
	 *    the result promise
	 *
	 * @private
	 */
	PageLoader.prototype.load = function (pageRef) {
	   return loadPageRecursively(this, pageRef, []);
	};
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function loadPageRecursively(self, pageRef, extensionChain) {
	   var page = void 0;
	
	   if (extensionChain.includes(pageRef)) {
	      throwError({ name: pageRef }, 'Cycle in page extension detected: ' + extensionChain.concat([pageRef]).join(' -> '));
	   }
	
	   var _self$artifactProvide = self.artifactProvider_.forPage(pageRef),
	       definition = _self$artifactProvide.definition,
	       descriptor = _self$artifactProvide.descriptor;
	
	   return Promise.all([definition(), descriptor()]).then(function (_ref) {
	      var _ref2 = _slicedToArray(_ref, 2),
	          foundPage = _ref2[0],
	          descriptor = _ref2[1];
	
	      validatePage(foundPage, pageRef);
	
	      page = foundPage;
	      page.name = descriptor.name;
	
	      if (!page.areas) {
	         page.areas = {};
	      }
	   }).then(function () {
	      return processExtends(self, page, extensionChain);
	   }).then(function () {
	      generateMissingIds(self, page);
	      // we need to check ids before and after expanding compositions
	      checkForDuplicateIds(self, page);
	      return processCompositions(self, page, pageRef);
	   }).then(function () {
	      checkForDuplicateIds(self, page);
	      removeDisabledWidgets(self, page);
	   }).then(function () {
	      self.pageToolingCollector_.collectPageDefinition(pageRef, page, _pages.FLAT);
	      return page;
	   });
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//
	// Processing inheritance (i.e. the `extends` keyword)
	//
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function processExtends(self, page, extensionChain) {
	   if (has(page, 'extends')) {
	      return loadPageRecursively(self, page['extends'], extensionChain.concat([page.name])).then(function (basePage) {
	         mergePageWithBasePage(page, basePage);
	      });
	   }
	   return Promise.resolve();
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function mergePageWithBasePage(page, basePage) {
	   var extendingAreas = page.areas;
	   var mergedPageAreas = object.deepClone(basePage.areas);
	   if (has(basePage, 'layout')) {
	      if (has(page, 'layout')) {
	         throwError(page, string.format('Page overwrites layout set by base page "[name]', basePage));
	      }
	      page.layout = basePage.layout;
	   }
	
	   object.forEach(extendingAreas, function (widgets, areaName) {
	      if (!(areaName in mergedPageAreas)) {
	         mergedPageAreas[areaName] = widgets;
	         return;
	      }
	
	      mergeWidgetLists(mergedPageAreas[areaName], widgets, page);
	   });
	
	   page.areas = mergedPageAreas;
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//
	// Processing compositions
	//
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function processCompositions(self, topPage, topPageRef) {
	
	   return processNestedCompositions(topPage, null, []);
	
	   function processNestedCompositions(page, instanceId, compositionChain) {
	
	      var promise = Promise.resolve();
	
	      object.forEach(page.areas, function (widgets) {
	         widgets.slice().reverse().forEach(function (widgetSpec) {
	            if (widgetSpec.enabled === false) {
	               return;
	            }
	            ensureWidgetSpecHasId(self, widgetSpec);
	
	            if (!has(widgetSpec, 'composition')) {
	               return;
	            }
	            var compositionRef = widgetSpec.composition;
	            if (compositionChain.includes(compositionRef)) {
	               var chainString = compositionChain.concat([compositionRef]).join(' -> ');
	               var message = 'Cycle in compositions detected: ' + chainString;
	               throwError(topPage, message);
	            }
	
	            // Compositions must be loaded sequentially, because replacing the widgets in the page needs to
	            // take place in order. Otherwise the order of widgets could be messed up.
	            promise = promise.then(function () {
	               return self.artifactProvider_.forPage(compositionRef).definition();
	            }).then(function (composition) {
	               return prefixCompositionIds(composition, widgetSpec);
	            }).then(function (composition) {
	               return processCompositionExpressions(composition, widgetSpec, function (message) {
	                  throwError({ name: page.name }, 'Error loading composition "' + compositionRef + '" (id: "' + widgetSpec.id + '"). ' + message);
	               });
	            }).then(function (composition) {
	               var chain = compositionChain.concat(compositionRef);
	               return processNestedCompositions(composition, widgetSpec.id, chain).then(function () {
	                  self.pageToolingCollector_.collectCompositionDefinition(topPageRef, widgetSpec.id, composition, _pages.FLAT);
	                  return composition;
	               });
	            }).then(function (composition) {
	               mergeCompositionAreasWithPageAreas(composition, page, widgets, widgetSpec);
	            });
	         });
	      });
	
	      // now that all IDs have been created, we can store a copy of the page prior to composition expansion
	      if (page === topPage) {
	         self.pageToolingCollector_.collectPageDefinition(topPageRef, page, _pages.COMPACT);
	      } else {
	         self.pageToolingCollector_.collectCompositionDefinition(topPageRef, instanceId, page, _pages.COMPACT);
	      }
	
	      return promise;
	   }
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function mergeCompositionAreasWithPageAreas(composition, page, widgets, compositionSpec) {
	   object.forEach(composition.areas, function (compositionAreaWidgets, areaName) {
	      if (areaName === '.') {
	         insertAfterEntry(widgets, compositionSpec, compositionAreaWidgets);
	         return;
	      }
	
	      if (!(areaName in page.areas)) {
	         page.areas[areaName] = compositionAreaWidgets;
	         return;
	      }
	
	      mergeWidgetLists(page.areas[areaName], compositionAreaWidgets, page);
	   });
	
	   removeEntry(widgets, compositionSpec);
	
	   function insertAfterEntry(arr, entry, replacements) {
	      var index = arr.indexOf(entry);
	      arr.splice.apply(arr, [index, 0].concat(_toConsumableArray(replacements)));
	   }
	
	   function removeEntry(arr, entry) {
	      var index = arr.indexOf(entry);
	      arr.splice(index, 1);
	   }
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function prefixCompositionIds(composition, widgetSpec) {
	   var prefixedAreas = {};
	   object.forEach(composition.areas, function (widgets, areaName) {
	      widgets.forEach(function (widget) {
	         if (has(widget, 'id')) {
	            widget.id = widgetSpec.id + ID_SEPARATOR + widget.id;
	         }
	      });
	
	      if (areaName.indexOf('.') > 0) {
	         // All areas prefixed with a local widget id need to be prefixed as well
	         prefixedAreas[widgetSpec.id + ID_SEPARATOR + areaName] = widgets;
	         return;
	      }
	
	      prefixedAreas[areaName] = widgets;
	   });
	   composition.areas = prefixedAreas;
	   return composition;
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function processCompositionExpressions(composition, widgetSpec, throwPageError) {
	   var expressionData = {};
	
	   // feature definitions in compositions may contain generated topics for default resource names or action
	   // topics. As such these are generated before instantiating the composition's features.
	   composition.features = iterateOverExpressions(composition.features || {}, replaceExpression);
	   expressionData.features = featuresProvider.featuresForWidget(composition, widgetSpec, throwPageError);
	
	   if (_typeof(composition.mergedFeatures) === 'object') {
	      (function () {
	         var mergedFeatures = iterateOverExpressions(composition.mergedFeatures, replaceExpression);
	
	         Object.keys(mergedFeatures).forEach(function (featurePath) {
	            var currentValue = object.path(expressionData.features, featurePath, []);
	            var values = mergedFeatures[featurePath];
	            object.setPath(expressionData.features, featurePath, values.concat(currentValue));
	         });
	      })();
	   }
	
	   composition.areas = iterateOverExpressions(composition.areas, replaceExpression);
	
	   function replaceExpression(subject) {
	      var matches = subject.match(COMPOSITION_EXPRESSION_MATCHER);
	      if (!matches) {
	         return subject;
	      }
	
	      var possibleNegation = matches[1];
	      var expression = matches[2];
	      var result = void 0;
	      if (expression.indexOf(COMPOSITION_TOPIC_PREFIX) === 0) {
	         result = topicFromId(widgetSpec.id) + SUBTOPIC_SEPARATOR + expression.substr(COMPOSITION_TOPIC_PREFIX.length);
	      } else {
	         result = object.path(expressionData, expression);
	      }
	
	      return typeof result === 'string' && possibleNegation ? possibleNegation + result : result;
	   }
	
	   return composition;
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function iterateOverExpressions(obj, replacer) {
	   if (obj === null) {
	      return obj;
	   }
	
	   if (Array.isArray(obj)) {
	      return obj.map(function (value) {
	         if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
	            return iterateOverExpressions(value, replacer);
	         }
	
	         return typeof value === 'string' ? replacer(value) : value;
	      }).filter(function (_) {
	         return _ !== undefined;
	      });
	   }
	
	   var result = {};
	   object.forEach(obj, function (value, key) {
	      var replacedKey = replacer(key);
	      if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
	         result[replacedKey] = iterateOverExpressions(value, replacer);
	         return;
	      }
	
	      var replacedValue = typeof value === 'string' ? replacer(value) : value;
	      if (typeof replacedValue !== 'undefined') {
	         result[replacedKey] = replacedValue;
	      }
	   });
	
	   return result;
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//
	// Additional Tasks
	//
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function removeDisabledWidgets(self, page) {
	   object.forEach(page.areas, function (widgetList, index) {
	      page.areas[index] = widgetList.filter(function (widgetSpec) {
	         return widgetSpec.enabled !== false;
	      });
	   });
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function checkForDuplicateIds(self, page) {
	   var idCount = {};
	
	   object.forEach(page.areas, function (widgetList) {
	      object.forEach(widgetList, function (widgetSpec) {
	         idCount[widgetSpec.id] = idCount[widgetSpec.id] ? idCount[widgetSpec.id] + 1 : 1;
	      });
	   });
	
	   var duplicates = Object.keys(idCount).filter(function (widgetId) {
	      return idCount[widgetId] > 1;
	   });
	
	   if (duplicates.length) {
	      throwError(page, 'Duplicate widget/composition ID(s): ' + duplicates.join(', '));
	   }
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function generateDefaultWidgetSpecName(widgetSpec) {
	   return artifactName().replace(SEGMENTS_MATCHER, dashToCamelcase);
	
	   function artifactName() {
	      if (widgetSpec.hasOwnProperty('widget')) {
	         return widgetSpec.widget.split('/').pop();
	      }
	      if (widgetSpec.hasOwnProperty('composition')) {
	         return widgetSpec.composition;
	      }
	      if (widgetSpec.hasOwnProperty('layout')) {
	         return widgetSpec.layout;
	      }
	      // Assume that non-standard items do not require a specific name.
	      return '';
	   }
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function ensureWidgetSpecHasId(self, widgetSpec) {
	   if (widgetSpec.hasOwnProperty('id')) {
	      return;
	   }
	   widgetSpec.id = nextId(self, generateDefaultWidgetSpecName(widgetSpec));
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function generateMissingIds(self, page) {
	   object.forEach(page.areas, function (widgetList) {
	      object.forEach(widgetList, function (widgetSpec) {
	         ensureWidgetSpecHasId(self, widgetSpec);
	      });
	   });
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function validatePage(foundPage, pageName) {
	   var errors = (0, _json_validator.create)(_page2.default).validate(foundPage);
	   if (errors.length) {
	      var errorString = errors.reduce(function (errorString, errorItem) {
	         return errorString + '\n - ' + errorItem.message;
	      }, '');
	
	      throwError({ name: pageName }, 'Schema validation failed: ' + errorString);
	   }
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//
	// Common functionality and utility functions
	//
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function mergeWidgetLists(targetList, sourceList, page) {
	   sourceList.forEach(function (widgetConfiguration) {
	      if (widgetConfiguration.insertBeforeId) {
	         for (var i = 0, length = targetList.length; i < length; ++i) {
	            if (targetList[i].id === widgetConfiguration.insertBeforeId) {
	               targetList.splice(i, 0, widgetConfiguration);
	               return;
	            }
	         }
	
	         throwError(page, string.format('No id found that matches insertBeforeId value "[insertBeforeId]"', widgetConfiguration));
	      }
	
	      targetList.push(widgetConfiguration);
	   });
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function has(object, what) {
	   return typeof object[what] === 'string' && object[what].length;
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function nextId(self, prefix) {
	   return '' + prefix + ID_SEPARATOR + 'id' + self.idCounter_++;
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function dashToCamelcase(segmentStart) {
	   return segmentStart.charAt(1).toUpperCase();
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function topicFromId(id) {
	   return id.replace(ID_SEPARATOR_MATCHER, SUBTOPIC_SEPARATOR).replace(SEGMENTS_MATCHER, dashToCamelcase);
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function throwError(page, message) {
	   var text = string.format('Error loading page "[name]": [0]', [message], page);
	   throw new Error(text);
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Creates and returns a new page loader instance.
	 *
	 * @param {ArtifactProvider} artifactProvider
	 *    an ArtifactProvider to load application assets
	 * @param {PagesCollector} pagesCollector
	 *    a tooling collector to consume page and composition information
	 *
	 * @return {PageLoader}
	 *    a page loader instance
	 *
	 * @private
	 */
	function create(artifactProvider, pagesCollector) {
	   (0, _assert2.default)(artifactProvider).isNotNull();
	   (0, _assert2.default)(pagesCollector).isNotNull();
	
	   return new PageLoader(artifactProvider, pagesCollector);
	}

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	exports.JSON_SCHEMA_V4_URI = undefined;
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /**
	                                                                                                                                                                                                                                                                               * Copyright 2016 aixigo AG
	                                                                                                                                                                                                                                                                               * Released under the MIT license.
	                                                                                                                                                                                                                                                                               * http://laxarjs.org/license
	                                                                                                                                                                                                                                                                               */
	/**
	 * A wrapper around `jjv` and `jjve` for JSON validation.
	 * Enhances error messages and adds some other optional convenience.
	 *
	 * @module json_validator
	 * @private
	 */
	
	exports.create = create;
	
	var _jjv = __webpack_require__(55);
	
	var _jjv2 = _interopRequireDefault(_jjv);
	
	var _jjve = __webpack_require__(57);
	
	var _jjve2 = _interopRequireDefault(_jjve);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var JSON_SCHEMA_V4_URI = exports.JSON_SCHEMA_V4_URI = 'http://json-schema.org/draft-04/schema#';
	
	/**
	 * Creates and returns a new JSON validator for schema draft version 4.
	 * Version detection for v4 takes place by checking if the `$schema` property of the root schema equals the
	 * uri `http://json-schema.org/draft-04/schema#`.
	 * Missing or other values for `$schema` will lead to an error.
	 *
	 * It returns an object with `validate` function, accepting the object to validate against the `jsonSchema`,
	 * and it returns an array containing all errors found.
	 * If the array is empty, no errors were found.
	 * If `optionalOptions.useDefault` was set to `true`, calling `valdate` will modify the argument object by
	 * adding missing default values.
	 *
	 * @param {Object} jsonSchema
	 *    the JSON schema to use when validating
	 * @param {Object} [optionalOptions]
	 *    an optional set of options
	 * @param {Boolean} [optionalOptions.prohibitAdditionalProperties=false]
	 *    sets additionalProperties to false if not defined otherwise for the according object schema
	 * @param {Boolean} [optionalOptions.checkRequired=true]
	 *    (jjv option) if `true` it reports missing required properties, otherwise it allows missing
	 *    required properties. Default is `true`
	 * @param {Boolean} [optionalOptions.useDefault=false]
	 *    (jjv option) If true it modifies the validated object to have the default values for missing
	 *    non-required fields. Default is `false`
	 * @param {Boolean} [optionalOptions.useCoerce=false]
	 *    (jjv option) if `true` it enables type coercion where defined. Default is `false`
	 * @param {Boolean} [optionalOptions.removeAdditional=false]
	 *    (jjv option) if `true` it removes all attributes of an object which are not matched by the
	 *    schema's specification. Default is `false`
	 *
	 * @return {Object}
	 *    a new instance of JsonValidator
	 */
	function create(jsonSchema) {
	   var optionalOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	
	
	   var env = (0, _jjv2.default)();
	   var options = Object.assign({
	      prohibitAdditionalProperties: false
	   }, optionalOptions);
	   Object.assign(env.defaultOptions, options);
	
	   if (!('$schema' in jsonSchema)) {
	      throw new Error('Missing schema version. Use the $schema property to define it.');
	   }
	
	   if (jsonSchema.$schema !== JSON_SCHEMA_V4_URI) {
	      throw new Error('Unsupported schema version "' + jsonSchema.$schema + '". Only V4 is supported: "' + JSON_SCHEMA_V4_URI + '".');
	   }
	
	   if (options.prohibitAdditionalProperties) {
	      prohibitAdditionalProperties(jsonSchema);
	   }
	
	   var origValidate = env.validate;
	
	   env.validate = function (object) {
	      var result = origValidate.call(env, jsonSchema, object);
	      return !result ? [] : (0, _jjve2.default)(env)(jsonSchema, object, result).map(function (err) {
	         return Object.assign({}, err, { message: err.message + '. Path: "' + err.path + '".' });
	      });
	   };
	
	   return env;
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function prohibitAdditionalProperties(schema) {
	   if (('properties' in schema || 'patternProperties' in schema) && !('additionalProperties' in schema)) {
	      schema.additionalProperties = false;
	   }
	
	   if ('properties' in schema) {
	      Object.keys(schema.properties).forEach(function (name) {
	         prohibitAdditionalProperties(schema.properties[name]);
	      });
	   }
	
	   if ('additionalProperties' in schema && _typeof(schema.additionalProperties) === 'object') {
	      prohibitAdditionalProperties(schema.additionalProperties);
	   }
	
	   if ('patternProperties' in schema) {
	      Object.keys(schema.patternProperties).forEach(function (pattern) {
	         prohibitAdditionalProperties(schema.patternProperties[pattern]);
	      });
	   }
	
	   if ('items' in schema) {
	      prohibitAdditionalProperties(schema.items);
	   }
	}

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(56);


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* jshint proto: true */
	
	/**
	 * jjv.js -- A javascript library to validate json input through a json-schema.
	 *
	 * Copyright (c) 2013 Alex Cornejo.
	 *
	 * Redistributable under a MIT-style open source license.
	 */
	
	(function () {
	  var clone = function (obj) {
	      // Handle the 3 simple types (string, number, function), and null or undefined
	      if (obj === null || typeof obj !== 'object') return obj;
	      var copy;
	
	      // Handle Date
	      if (obj instanceof Date) {
	          copy = new Date();
	          copy.setTime(obj.getTime());
	          return copy;
	      }
	
	      // handle RegExp
	      if (obj instanceof RegExp) {
	        copy = new RegExp(obj);
	        return copy;
	      }
	
	      // Handle Array
	      if (obj instanceof Array) {
	          copy = [];
	          for (var i = 0, len = obj.length; i < len; i++)
	              copy[i] = clone(obj[i]);
	          return copy;
	      }
	
	      // Handle Object
	      if (obj instanceof Object) {
	          copy = {};
	//           copy = Object.create(Object.getPrototypeOf(obj));
	          for (var attr in obj) {
	              if (obj.hasOwnProperty(attr))
	                copy[attr] = clone(obj[attr]);
	          }
	          return copy;
	      }
	
	      throw new Error("Unable to clone object!");
	  };
	
	  var clone_stack = function (stack) {
	    var new_stack = [ clone(stack[0]) ], key = new_stack[0].key, obj = new_stack[0].object;
	    for (var i = 1, len = stack.length; i< len; i++) {
	      obj = obj[key];
	      key = stack[i].key;
	      new_stack.push({ object: obj, key: key });
	    }
	    return new_stack;
	  };
	
	  var copy_stack = function (new_stack, old_stack) {
	    var stack_last = new_stack.length-1, key = new_stack[stack_last].key;
	    old_stack[stack_last].object[key] = new_stack[stack_last].object[key];
	  };
	
	  var handled = {
	    'type': true,
	    'not': true,
	    'anyOf': true,
	    'allOf': true,
	    'oneOf': true,
	    '$ref': true,
	    '$schema': true,
	    'id': true,
	    'exclusiveMaximum': true,
	    'exclusiveMininum': true,
	    'properties': true,
	    'patternProperties': true,
	    'additionalProperties': true,
	    'items': true,
	    'additionalItems': true,
	    'required': true,
	    'default': true,
	    'title': true,
	    'description': true,
	    'definitions': true,
	    'dependencies': true
	  };
	
	  var fieldType = {
	    'null': function (x) {
	      return x === null;
	    },
	    'string': function (x) {
	      return typeof x === 'string';
	    },
	    'boolean': function (x) {
	      return typeof x === 'boolean';
	    },
	    'number': function (x) {
	      // Use x === x instead of !isNaN(x) for speed
	      return typeof x === 'number' && x === x;
	    },
	    'integer': function (x) {
	      return typeof x === 'number' && x%1 === 0;
	    },
	    'object': function (x) {
	      return x && typeof x === 'object' && !Array.isArray(x);
	    },
	    'array': function (x) {
	      return Array.isArray(x);
	    },
	    'date': function (x) {
	      return x instanceof Date;
	    }
	  };
	
	  // missing: uri, date-time, ipv4, ipv6
	  var fieldFormat = {
	    'alpha': function (v) {
	      return (/^[a-zA-Z]+$/).test(v);
	    },
	    'alphanumeric': function (v) {
	      return (/^[a-zA-Z0-9]+$/).test(v);
	    },
	    'identifier': function (v) {
	      return (/^[-_a-zA-Z0-9]+$/).test(v);
	    },
	    'hexadecimal': function (v) {
	      return (/^[a-fA-F0-9]+$/).test(v);
	    },
	    'numeric': function (v) {
	      return (/^[0-9]+$/).test(v);
	    },
	    'date-time': function (v) {
	      return !isNaN(Date.parse(v)) && v.indexOf('/') === -1;
	    },
	    'uppercase': function (v) {
	      return v === v.toUpperCase();
	    },
	    'lowercase': function (v) {
	      return v === v.toLowerCase();
	    },
	    'hostname': function (v) {
	      return v.length < 256 && (/^([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])(\.([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]{0,61}[a-zA-Z0-9]))*$/).test(v);
	    },
	    'uri': function (v) {
	      return (/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/).test(v);
	    },
	    'email': function (v) { // email, ipv4 and ipv6 adapted from node-validator
	      return (/^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/).test(v);
	    },
	    'ipv4': function (v) {
	      if ((/^(\d?\d?\d)\.(\d?\d?\d)\.(\d?\d?\d)\.(\d?\d?\d)$/).test(v)) {
	        var parts = v.split('.').sort();
	        if (parts[3] <= 255)
	          return true;
	      }
	      return false;
	    },
	    'ipv6': function(v) {
	      return (/^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/).test(v);
	     /*  return (/^::|^::1|^([a-fA-F0-9]{1,4}::?){1,7}([a-fA-F0-9]{1,4})$/).test(v); */
	    }
	  };
	
	  var fieldValidate = {
	    'readOnly': function (v, p) {
	      return false;
	    },
	    // ****** numeric validation ********
	    'minimum': function (v, p, schema) {
	      return !(v < p || schema.exclusiveMinimum && v <= p);
	    },
	    'maximum': function (v, p, schema) {
	      return !(v > p || schema.exclusiveMaximum && v >= p);
	    },
	    'multipleOf': function (v, p) {
	      return (v/p)%1 === 0 || typeof v !== 'number';
	    },
	    // ****** string validation ******
	    'pattern': function (v, p) {
	      if (typeof v !== 'string')
	        return true;
	      var pattern, modifiers;
	      if (typeof p === 'string')
	        pattern=p;
	      else {
	        pattern=p[0];
	        modifiers=p[1];
	      }
	      var regex = new RegExp(pattern, modifiers);
	      return regex.test(v);
	    },
	    'minLength': function (v, p) {
	      return v.length >= p || typeof v !== 'string';
	    },
	    'maxLength': function (v, p) {
	      return v.length <= p || typeof v !== 'string';
	    },
	    // ***** array validation *****
	    'minItems': function (v, p) {
	      return v.length >= p || !Array.isArray(v);
	    },
	    'maxItems': function (v, p) {
	      return v.length <= p || !Array.isArray(v);
	    },
	    'uniqueItems': function (v, p) {
	      var hash = {}, key;
	      for (var i = 0, len = v.length; i < len; i++) {
	        key = JSON.stringify(v[i]);
	        if (hash.hasOwnProperty(key))
	          return false;
	        else
	          hash[key] = true;
	      }
	      return true;
	    },
	    // ***** object validation ****
	    'minProperties': function (v, p) {
	      if (typeof v !== 'object')
	        return true;
	      var count = 0;
	      for (var attr in v) if (v.hasOwnProperty(attr)) count = count + 1;
	      return count >= p;
	    },
	    'maxProperties': function (v, p) {
	      if (typeof v !== 'object')
	        return true;
	      var count = 0;
	      for (var attr in v) if (v.hasOwnProperty(attr)) count = count + 1;
	      return count <= p;
	    },
	    // ****** all *****
	    'constant': function (v, p) {
	      return JSON.stringify(v) == JSON.stringify(p);
	    },
	    'enum': function (v, p) {
	      var i, len, vs;
	      if (typeof v === 'object') {
	        vs = JSON.stringify(v);
	        for (i = 0, len = p.length; i < len; i++)
	          if (vs === JSON.stringify(p[i]))
	            return true;
	      } else {
	        for (i = 0, len = p.length; i < len; i++)
	          if (v === p[i])
	            return true;
	      }
	      return false;
	    }
	  };
	
	  var normalizeID = function (id) {
	    return id.indexOf("://") === -1 ? id : id.split("#")[0];
	  };
	
	  var resolveURI = function (env, schema_stack, uri) {
	    var curschema, components, hash_idx, name;
	
	    hash_idx = uri.indexOf('#');
	
	    if (hash_idx === -1) {
	      if (!env.schema.hasOwnProperty(uri))
	        return null;
	      return [env.schema[uri]];
	    }
	
	    if (hash_idx > 0) {
	      name = uri.substr(0, hash_idx);
	      uri = uri.substr(hash_idx+1);
	      if (!env.schema.hasOwnProperty(name)) {
	        if (schema_stack && schema_stack[0].id === name)
	          schema_stack = [schema_stack[0]];
	        else
	          return null;
	      } else
	        schema_stack = [env.schema[name]];
	    } else {
	      if (!schema_stack)
	        return null;
	      uri = uri.substr(1);
	    }
	
	    if (uri === '')
	      return [schema_stack[0]];
	
	    if (uri.charAt(0) === '/') {
	      uri = uri.substr(1);
	      curschema = schema_stack[0];
	      components = uri.split('/');
	      while (components.length > 0) {
	        if (!curschema.hasOwnProperty(components[0]))
	          return null;
	        curschema = curschema[components[0]];
	        schema_stack.push(curschema);
	        components.shift();
	      }
	      return schema_stack;
	    } else // FIX: should look for subschemas whose id matches uri
	      return null;
	  };
	
	  var resolveObjectRef = function (object_stack, uri) {
	    var components, object, last_frame = object_stack.length-1, skip_frames, frame, m = /^(\d+)/.exec(uri);
	
	    if (m) {
	      uri = uri.substr(m[0].length);
	      skip_frames = parseInt(m[1], 10);
	      if (skip_frames < 0 || skip_frames > last_frame)
	        return;
	      frame = object_stack[last_frame-skip_frames];
	      if (uri === '#')
	        return frame.key;
	    } else
	      frame = object_stack[0];
	
	    object = frame.object[frame.key];
	
	    if (uri === '')
	      return object;
	
	    if (uri.charAt(0) === '/') {
	      uri = uri.substr(1);
	      components = uri.split('/');
	      while (components.length > 0) {
	        components[0] = components[0].replace(/~1/g, '/').replace(/~0/g, '~');
	        if (!object.hasOwnProperty(components[0]))
	          return;
	        object = object[components[0]];
	        components.shift();
	      }
	      return object;
	    } else
	      return;
	  };
	
	  var checkValidity = function (env, schema_stack, object_stack, options) {
	    var i, len, count, hasProp, hasPattern;
	    var p, v, malformed = false, objerrs = {}, objerr, props, matched;
	    var sl = schema_stack.length-1, schema = schema_stack[sl], new_stack;
	    var ol = object_stack.length-1, object = object_stack[ol].object, name = object_stack[ol].key, prop = object[name];
	    var errCount, minErrCount;
	
	    if (schema.hasOwnProperty('$ref')) {
	      schema_stack= resolveURI(env, schema_stack, schema.$ref);
	      if (!schema_stack)
	        return {'$ref': schema.$ref};
	      else
	        return checkValidity(env, schema_stack, object_stack, options);
	    }
	
	    if (schema.hasOwnProperty('type')) {
	      if (typeof schema.type === 'string') {
	        if (options.useCoerce && env.coerceType.hasOwnProperty(schema.type))
	          prop = object[name] = env.coerceType[schema.type](prop);
	        if (!env.fieldType[schema.type](prop))
	          return {'type': schema.type};
	      } else {
	        malformed = true;
	        for (i = 0, len = schema.type.length; i < len && malformed; i++)
	          if (env.fieldType[schema.type[i]](prop))
	            malformed = false;
	        if (malformed)
	          return {'type': schema.type};
	      }
	    }
	
	    if (schema.hasOwnProperty('allOf')) {
	      for (i = 0, len = schema.allOf.length; i < len; i++) {
	        objerr = checkValidity(env, schema_stack.concat(schema.allOf[i]), object_stack, options);
	        if (objerr)
	          return objerr;
	      }
	    }
	
	    if (!options.useCoerce && !options.useDefault && !options.removeAdditional) {
	      if (schema.hasOwnProperty('oneOf')) {
	        minErrCount = Infinity;
	        for (i = 0, len = schema.oneOf.length, count = 0; i < len; i++) {
	          objerr = checkValidity(env, schema_stack.concat(schema.oneOf[i]), object_stack, options);
	          if (!objerr) {
	            count = count + 1;
	            if (count > 1)
	              break;
	          } else {
	            errCount = objerr.schema ? Object.keys(objerr.schema).length : 1;
	            if (errCount < minErrCount) {
	                minErrCount = errCount;
	                objerrs = objerr;
	            }
	          }
	        }
	        if (count > 1)
	          return {'oneOf': true};
	        else if (count < 1)
	          return objerrs;
	        objerrs = {};
	      }
	
	      if (schema.hasOwnProperty('anyOf')) {
	        objerrs = null;
	        minErrCount = Infinity;
	        for (i = 0, len = schema.anyOf.length; i < len; i++) {
	          objerr = checkValidity(env, schema_stack.concat(schema.anyOf[i]), object_stack, options);
	          if (!objerr) {
	            objerrs = null;
	            break;
	          }
	          else {
	            errCount = objerr.schema ? Object.keys(objerr.schema).length : 1;
	            if (errCount < minErrCount) {
	                minErrCount = errCount;
	                objerrs = objerr;
	            }
	          }
	        }
	        if (objerrs)
	          return objerrs;
	      }
	
	      if (schema.hasOwnProperty('not')) {
	        objerr = checkValidity(env, schema_stack.concat(schema.not), object_stack, options);
	        if (!objerr)
	          return {'not': true};
	      }
	    } else {
	      if (schema.hasOwnProperty('oneOf')) {
	        minErrCount = Infinity;
	        for (i = 0, len = schema.oneOf.length, count = 0; i < len; i++) {
	          new_stack = clone_stack(object_stack);
	          objerr = checkValidity(env, schema_stack.concat(schema.oneOf[i]), new_stack, options);
	          if (!objerr) {
	            count = count + 1;
	            if (count > 1)
	              break;
	            else
	              copy_stack(new_stack, object_stack);
	          } else {
	            errCount = objerr.schema ? Object.keys(objerr.schema).length : 1;
	            if (errCount < minErrCount) {
	                minErrCount = errCount;
	                objerrs = objerr;
	            }
	          }
	        }
	        if (count > 1)
	          return {'oneOf': true};
	        else if (count < 1)
	          return objerrs;
	        objerrs = {};
	      }
	
	      if (schema.hasOwnProperty('anyOf')) {
	        objerrs = null;
	        minErrCount = Infinity;
	        for (i = 0, len = schema.anyOf.length; i < len; i++) {
	          new_stack = clone_stack(object_stack);
	          objerr = checkValidity(env, schema_stack.concat(schema.anyOf[i]), new_stack, options);
	          if (!objerr) {
	            copy_stack(new_stack, object_stack);
	            objerrs = null;
	            break;
	          }
	          else {
	            errCount = objerr.schema ? Object.keys(objerr.schema).length : 1;
	            if (errCount < minErrCount) {
	                minErrCount = errCount;
	                objerrs = objerr;
	            }
	          }
	        }
	        if (objerrs)
	          return objerrs;
	      }
	
	      if (schema.hasOwnProperty('not')) {
	        new_stack = clone_stack(object_stack);
	        objerr = checkValidity(env, schema_stack.concat(schema.not), new_stack, options);
	        if (!objerr)
	          return {'not': true};
	      }
	    }
	
	    if (schema.hasOwnProperty('dependencies')) {
	      for (p in schema.dependencies)
	        if (schema.dependencies.hasOwnProperty(p) && prop.hasOwnProperty(p)) {
	          if (Array.isArray(schema.dependencies[p])) {
	            for (i = 0, len = schema.dependencies[p].length; i < len; i++)
	              if (!prop.hasOwnProperty(schema.dependencies[p][i])) {
	                return {'dependencies': true};
	              }
	          } else {
	            objerr = checkValidity(env, schema_stack.concat(schema.dependencies[p]), object_stack, options);
	            if (objerr)
	              return objerr;
	          }
	        }
	    }
	
	    if (!Array.isArray(prop)) {
	      props = [];
	      objerrs = {};
	      for (p in prop)
	        if (prop.hasOwnProperty(p))
	          props.push(p);
	
	      if (options.checkRequired && schema.required) {
	        for (i = 0, len = schema.required.length; i < len; i++)
	          if (!prop.hasOwnProperty(schema.required[i])) {
	            objerrs[schema.required[i]] = {'required': true};
	            malformed = true;
	          }
	      }
	
	      hasProp = schema.hasOwnProperty('properties');
	      hasPattern = schema.hasOwnProperty('patternProperties');
	      if (hasProp || hasPattern) {
	        i = props.length;
	        while (i--) {
	          matched = false;
	          if (hasProp && schema.properties.hasOwnProperty(props[i])) {
	            matched = true;
	            objerr = checkValidity(env, schema_stack.concat(schema.properties[props[i]]), object_stack.concat({object: prop, key: props[i]}), options);
	            if (objerr !== null) {
	              objerrs[props[i]] = objerr;
	              malformed = true;
	            }
	          }
	          if (hasPattern) {
	            for (p in schema.patternProperties)
	              if (schema.patternProperties.hasOwnProperty(p) && props[i].match(p)) {
	                matched = true;
	                objerr = checkValidity(env, schema_stack.concat(schema.patternProperties[p]), object_stack.concat({object: prop, key: props[i]}), options);
	                if (objerr !== null) {
	                  objerrs[props[i]] = objerr;
	                  malformed = true;
	                }
	              }
	          }
	          if (matched)
	            props.splice(i, 1);
	        }
	      }
	
	      if (options.useDefault && hasProp && !malformed) {
	        for (p in schema.properties)
	          if (schema.properties.hasOwnProperty(p) && !prop.hasOwnProperty(p) && schema.properties[p].hasOwnProperty('default'))
	            prop[p] = schema.properties[p]['default'];
	      }
	
	      if (options.removeAdditional && hasProp && schema.additionalProperties !== true && typeof schema.additionalProperties !== 'object') {
	        for (i = 0, len = props.length; i < len; i++)
	          delete prop[props[i]];
	      } else {
	        if (schema.hasOwnProperty('additionalProperties')) {
	          if (typeof schema.additionalProperties === 'boolean') {
	            if (!schema.additionalProperties) {
	              for (i = 0, len = props.length; i < len; i++) {
	                objerrs[props[i]] = {'additional': true};
	                malformed = true;
	              }
	            }
	          } else {
	            for (i = 0, len = props.length; i < len; i++) {
	              objerr = checkValidity(env, schema_stack.concat(schema.additionalProperties), object_stack.concat({object: prop, key: props[i]}), options);
	              if (objerr !== null) {
	                objerrs[props[i]] = objerr;
	                malformed = true;
	              }
	            }
	          }
	        }
	      }
	      if (malformed)
	        return {'schema': objerrs};
	    } else {
	      if (schema.hasOwnProperty('items')) {
	        if (Array.isArray(schema.items)) {
	          for (i = 0, len = schema.items.length; i < len; i++) {
	            objerr = checkValidity(env, schema_stack.concat(schema.items[i]), object_stack.concat({object: prop, key: i}), options);
	            if (objerr !== null) {
	              objerrs[i] = objerr;
	              malformed = true;
	            }
	          }
	          if (prop.length > len && schema.hasOwnProperty('additionalItems')) {
	            if (typeof schema.additionalItems === 'boolean') {
	              if (!schema.additionalItems)
	                return {'additionalItems': true};
	            } else {
	              for (i = len, len = prop.length; i < len; i++) {
	                objerr = checkValidity(env, schema_stack.concat(schema.additionalItems), object_stack.concat({object: prop, key: i}), options);
	                if (objerr !== null) {
	                  objerrs[i] = objerr;
	                  malformed = true;
	                }
	              }
	            }
	          }
	        } else {
	          for (i = 0, len = prop.length; i < len; i++) {
	            objerr = checkValidity(env, schema_stack.concat(schema.items), object_stack.concat({object: prop, key: i}), options);
	            if (objerr !== null) {
	              objerrs[i] = objerr;
	              malformed = true;
	            }
	          }
	        }
	      } else if (schema.hasOwnProperty('additionalItems')) {
	        if (typeof schema.additionalItems !== 'boolean') {
	          for (i = 0, len = prop.length; i < len; i++) {
	            objerr = checkValidity(env, schema_stack.concat(schema.additionalItems), object_stack.concat({object: prop, key: i}), options);
	            if (objerr !== null) {
	              objerrs[i] = objerr;
	              malformed = true;
	            }
	          }
	        }
	      }
	      if (malformed)
	        return {'schema': objerrs};
	    }
	
	    for (v in schema) {
	      if (schema.hasOwnProperty(v) && !handled.hasOwnProperty(v)) {
	        if (v === 'format') {
	          if (env.fieldFormat.hasOwnProperty(schema[v]) && !env.fieldFormat[schema[v]](prop, schema, object_stack, options)) {
	            objerrs[v] = true;
	            malformed = true;
	          }
	        } else {
	          if (env.fieldValidate.hasOwnProperty(v) && !env.fieldValidate[v](prop, schema[v].hasOwnProperty('$data') ? resolveObjectRef(object_stack, schema[v].$data) : schema[v], schema, object_stack, options)) {
	            objerrs[v] = true;
	            malformed = true;
	          }
	        }
	      }
	    }
	
	    if (malformed)
	      return objerrs;
	    else
	      return null;
	  };
	
	  var defaultOptions = {
	    useDefault: false,
	    useCoerce: false,
	    checkRequired: true,
	    removeAdditional: false
	  };
	
	  function Environment() {
	    if (!(this instanceof Environment))
	      return new Environment();
	
	    this.coerceType = {};
	    this.fieldType = clone(fieldType);
	    this.fieldValidate = clone(fieldValidate);
	    this.fieldFormat = clone(fieldFormat);
	    this.defaultOptions = clone(defaultOptions);
	    this.schema = {};
	  }
	
	  Environment.prototype = {
	    validate: function (name, object, options) {
	      var schema_stack = [name], errors = null, object_stack = [{object: {'__root__': object}, key: '__root__'}];
	
	      if (typeof name === 'string') {
	        schema_stack = resolveURI(this, null, name);
	        if (!schema_stack)
	          throw new Error('jjv: could not find schema \'' + name + '\'.');
	      }
	
	      if (!options) {
	        options = this.defaultOptions;
	      } else {
	        for (var p in this.defaultOptions)
	          if (this.defaultOptions.hasOwnProperty(p) && !options.hasOwnProperty(p))
	            options[p] = this.defaultOptions[p];
	      }
	
	      errors = checkValidity(this, schema_stack, object_stack, options);
	
	      if (errors)
	        return {validation: errors.hasOwnProperty('schema') ? errors.schema : errors};
	      else
	        return null;
	    },
	
	    resolveRef: function (schema_stack, $ref) {
	      return resolveURI(this, schema_stack, $ref);
	    },
	
	    addType: function (name, func) {
	      this.fieldType[name] = func;
	    },
	
	    addTypeCoercion: function (type, func) {
	      this.coerceType[type] = func;
	    },
	
	    addCheck: function (name, func) {
	      this.fieldValidate[name] = func;
	    },
	
	    addFormat: function (name, func) {
	      this.fieldFormat[name] = func;
	    },
	
	    addSchema: function (name, schema) {
	      if (!schema && name) {
	        schema = name;
	        name = undefined;
	      }
	      if (schema.hasOwnProperty('id') && typeof schema.id === 'string' && schema.id !== name) {
	        if (schema.id.charAt(0) === '/')
	          throw new Error('jjv: schema id\'s starting with / are invalid.');
	        this.schema[normalizeID(schema.id)] = schema;
	      } else if (!name) {
	        throw new Error('jjv: schema needs either a name or id attribute.');
	      }
	      if (name)
	        this.schema[normalizeID(name)] = schema;
	    }
	  };
	
	  // Export for use in server and client.
	  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
	    module.exports = Environment;
	  else if (true)
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {return Environment;}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  else
	    this.jjv = Environment;
	}).call(this);


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;(function() {
	  'use strict';
	
	  function make(o) {
	    var errors = [];
	
	    var keys = Object.keys(o.validation);
	
	    // when we're on a leaf node we need to handle the validation errors,
	    // otherwise we continue walking
	    var leaf = keys.every(function(key) {
	      return typeof o.validation[key] !== 'object' ||
	        isArray(o.validation[key]);
	    });
	
	    if (leaf) {
	      // step through each validation issue
	      // example: { required: true }
	      keys.forEach(function(key) {
	        var error, properties;
	        try {
	          switch (key) {
	            case 'type':
	              var type = typeof o.data;
	
	              // further discover types
	              if (type === 'number' && ('' + o.data).match(/^\d+$/)) {
	                type = 'integer';
	              } else if (type === 'object' && Array.isArray(o.data)) {
	                type = 'array';
	              }
	
	              // the value of type is the required type (ex: { type: 'string' })
	              error = {
	                code: 'INVALID_TYPE',
	                message: 'Invalid type: ' + type + ' should be ' +
	                         (isArray(o.validation[key]) ?  'one of ' :  '') +
	                          o.validation[key]
	              };
	
	              break;
	            case 'required':
	              properties = o.ns;
	
	              error = {
	                code: 'OBJECT_REQUIRED',
	                message: 'Missing required property: ' +
	                         properties[properties.length - 1]
	              };
	
	              break;
	            case 'minimum':
	              error = {
	                code: 'MINIMUM',
	                message: 'Value ' + o.data + ' is less than minimum ' +
	                         o.schema.minimum
	              };
	
	              break;
	            case 'maximum':
	              error = {
	                code: 'MAXIMUM',
	                message: 'Value ' + o.data + ' is greater than maximum ' +
	                         o.schema.maximum
	              };
	
	              break;
	            case 'multipleOf':
	              error = {
	                code: 'MULTIPLE_OF',
	                message: 'Value ' + o.data + ' is not a multiple of ' +
	                         o.schema.multipleOf
	              };
	
	              break;
	            case 'pattern':
	              error = {
	                code: 'PATTERN',
	                message: 'String does not match pattern: ' + o.schema.pattern
	              };
	
	              break;
	            case 'minLength':
	              error = {
	                code: 'MIN_LENGTH',
	                message: 'String is too short (' + o.data.length + ' chars), ' +
	                         'minimum ' + o.schema.minLength
	              };
	
	              break;
	            case 'maxLength':
	              error = {
	                code: 'MAX_LENGTH',
	                message: 'String is too long (' + o.data.length + ' chars), ' +
	                         'maximum ' + o.schema.maxLength
	              };
	
	              break;
	            case 'minItems':
	              error = {
	                code: 'ARRAY_LENGTH_SHORT',
	                message: 'Array is too short (' + o.data.length + '), ' +
	                         'minimum ' + o.schema.minItems
	              };
	
	              break;
	            case 'maxItems':
	              error = {
	                code: 'ARRAY_LENGTH_LONG',
	                message: 'Array is too long (' + o.data.length + '), maximum ' +
	                         o.schema.maxItems
	              };
	
	              break;
	            case 'uniqueItems':
	              error = {
	                code: 'ARRAY_UNIQUE',
	                message: 'Array items are not unique'
	              };
	
	              break;
	            case 'minProperties':
	              error = {
	                code: 'OBJECT_PROPERTIES_MINIMUM',
	                message: 'Too few properties defined (' +
	                         Object.keys(o.data).length + '), minimum ' +
	                         o.schema.minProperties
	              };
	
	              break;
	            case 'maxProperties':
	              error = {
	                code: 'OBJECT_PROPERTIES_MAXIMUM',
	                message: 'Too many properties defined (' +
	                         Object.keys(o.data).length + '), maximum ' +
	                         o.schema.maxProperties
	              };
	
	              break;
	            case 'enum':
	              error = {
	                code: 'ENUM_MISMATCH',
	                message: 'No enum match (' + o.data + '), expects: ' +
	                         o.schema['enum'].join(', ')
	              };
	
	              break;
	            case 'not':
	              error = {
	                code: 'NOT_PASSED',
	                message: 'Data matches schema from "not"'
	              };
	
	              break;
	            case 'additional':
	              properties = o.ns;
	
	              error = {
	                code: 'ADDITIONAL_PROPERTIES',
	                message: 'Additional properties not allowed: ' +
	                         properties[properties.length - 1]
	              };
	
	              break;
	            case 'format':
	              error = {
	                code: 'FORMAT',
	                message: 'Value does not satisfy format: ' +
	                         o.schema.format
	              };
	
	              break;
	          }
	        } catch (err) {
	          // ignore errors
	        }
	
	        // unhandled errors
	        if (!error) {
	          error = {
	            code: 'FAILED',
	            message: 'Validation error: ' + key
	          };
	
	          try {
	            if (typeof o.validation[key] !== 'boolean') {
	              error.message = ' (' + o.validation[key] + ')';
	            }
	          } catch (err) {
	            // ignore errors
	          }
	        }
	
	        error.code = 'VALIDATION_' + error.code;
	        if (o.data !== undefined) error.data = o.data;
	        error.path = o.ns;
	        errors.push(error);
	      });
	    } else {
	      // handle all non-leaf children
	      keys.forEach(function(key) {
	        var s;
	
	        if (o.schema.$ref) {
	          if (o.schema.$ref.match(/#\/definitions\//)) {
	            o.schema = o.definitions[o.schema.$ref.slice(14)];
	          } else {
	            o.schema = o.schema.$ref;
	          }
	
	          if (typeof o.schema === 'string') {
	            o.schema = o.env.resolveRef(null, o.schema);
	            if (o.schema) o.schema = o.schema[0];
	          }
	
	          if (!o.schema.type) o.schema.type = 'object';
	        }
	
	        if (o.schema && o.schema.type) {
	          if (allowsType(o.schema, 'object')) {
	            if (o.schema.properties && o.schema.properties[key]) {
	              s = o.schema.properties[key];
	            }
	
	            if (!s && o.schema.patternProperties) {
	              Object.keys(o.schema.patternProperties).some(function(pkey) {
	                if (key.match(new RegExp(pkey))) {
	                  s = o.schema.patternProperties[pkey];
	                  return true;
	                }
	              });
	            }
	
	            if (!s && o.schema.hasOwnProperty('additionalProperties')) {
	              if (typeof o.schema.additionalProperties === 'boolean') {
	                s = {};
	              } else {
	                s = o.schema.additionalProperties;
	              }
	            }
	          }
	
	          if (allowsType(o.schema, 'array')) {
	            s = o.schema.items;
	          }
	        }
	
	        var opts = {
	          env: o.env,
	          schema: s || {},
	          ns: o.ns.concat(key)
	        };
	
	        try {
	          opts.data = o.data[key];
	        } catch (err) {
	          // ignore errors
	        }
	
	        try {
	          opts.validation = o.validation[key].schema ?
	            o.validation[key].schema :
	            o.validation[key];
	        } catch (err) {
	          opts.validation = {};
	        }
	
	        try {
	          opts.definitions = s.definitions || o.definitions;
	        } catch (err) {
	          opts.definitions = o.definitions;
	        }
	
	        errors = errors.concat(make(opts));
	      });
	    }
	
	    return errors;
	  }
	
	  function allowsType(schema, type) {
	    if (typeof schema.type === 'string') {
	      return schema.type === type;
	    }
	    if (isArray(schema.type)) {
	      return schema.type.indexOf(type) !== -1;
	    }
	    return false;
	  }
	
	  function isArray(obj) {
	    if (typeof Array.isArray === 'function') {
	      return Array.isArray(obj);
	    }
	    return Object.prototype.toString.call(obj) === '[object Array]';
	  }
	
	  function formatPath(options) {
	    var root = options.hasOwnProperty('root') ?
	      options.root : '$';
	
	    var sep = options.hasOwnProperty('sep') ?
	      options.sep : '.';
	
	    return function(error) {
	      var path = root;
	
	      error.path.forEach(function(key) {
	        path += key.match(/^\d+$/) ?
	          '[' + key + ']' :
	          key.match(/^[A-Z_$][0-9A-Z_$]*$/i) ?
	            (sep + key) :
	            ('[' + JSON.stringify(key) + ']');
	      });
	
	      error.path = path;
	
	      return error;
	    };
	  }
	
	  function jjve(env) {
	    return function jjve(schema, data, result, options) {
	      if (!result || !result.validation) return [];
	
	      options = options || {};
	
	      if (typeof schema === 'string') { schema = env.schema[schema]; }
	
	      var errors = make({
	        env: env,
	        schema: schema,
	        data: data,
	        validation: result.validation,
	        ns: [],
	        definitions: schema.definitions || {}
	      });
	
	      if (errors.length && options.formatPath !== false) {
	        return errors.map(formatPath(options));
	      }
	
	      return errors;
	    };
	  }
	
	  // Export for use in server and client.
	  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
	    module.exports = jjve;
	  } else if (true) {
	    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return jjve; }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else {
	    this.jjve = jjve;
	  }
	}).call(this);


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /**
	                                                                                                                                                                                                                                                                               * Copyright 2016 aixigo AG
	                                                                                                                                                                                                                                                                               * Released under the MIT license.
	                                                                                                                                                                                                                                                                               * http://laxarjs.org/license
	                                                                                                                                                                                                                                                                               */
	
	
	exports.featuresForWidget = featuresForWidget;
	
	var _json_validator = __webpack_require__(54);
	
	var _object = __webpack_require__(39);
	
	var object = _interopRequireWildcard(_object);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	// JSON schema formats:
	var TOPIC_IDENTIFIER = '([a-z][+a-zA-Z0-9]*|[A-Z][+A-Z0-9]*)';
	var SUB_TOPIC_FORMAT = new RegExp('^' + TOPIC_IDENTIFIER + '$');
	var TOPIC_FORMAT = new RegExp('^(' + TOPIC_IDENTIFIER + '(-' + TOPIC_IDENTIFIER + ')*)$');
	var FLAG_TOPIC_FORMAT = new RegExp('^[!]?(' + TOPIC_IDENTIFIER + '(-' + TOPIC_IDENTIFIER + ')*)$');
	// simplified RFC-5646 language-tag matcher with underscore/dash relaxation:
	// the parts are: language *("-"|"_" script|region|constiant) *("-"|"_" extension|privateuse)
	var LANGUAGE_TAG_FORMAT = /^[a-z]{2,8}([-_][a-z0-9]{2,8})*([-_][a-z0-9][-_][a-z0-9]{2,8})*$/i;
	
	///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function featuresForWidget(widgetSpecification, widgetConfiguration, throwError) {
	   if (!widgetSpecification.features || Object.keys(widgetSpecification.features).length === 0) {
	      return {};
	   }
	
	   var featureConfiguration = widgetConfiguration.features || {};
	   var featuresSpec = widgetSpecification.features;
	   var validator = createFeaturesValidator(featuresSpec);
	
	   object.forEach(featuresSpec.properties, function (feature, name) {
	      // ensure that simple object/array features are at least defined
	      if (name in featureConfiguration) {
	         return;
	      }
	
	      if (feature.type === 'object') {
	         featureConfiguration[name] = {};
	      } else if (feature.type === 'array') {
	         featureConfiguration[name] = [];
	      }
	   });
	
	   var errors = validator.validate(featureConfiguration);
	
	   if (errors.length) {
	      var message = errors.reduce(function (message, error) {
	         return message + '\n - ' + error.message.replace(/\[/g, '\\[');
	      }, 'Validation of feature-configuration failed. Errors: ');
	
	      throwError(message);
	   }
	
	   return featureConfiguration;
	}
	
	///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function createFeaturesValidator(featuresSpec) {
	   var validator = (0, _json_validator.create)(featuresSpec, {
	      prohibitAdditionalProperties: true,
	      useDefault: true
	   });
	
	   // allows 'mySubTopic0815', 'MY_SUB_TOPIC+OK' and variations:
	   validator.addFormat('sub-topic', function (subTopic) {
	      return typeof subTopic !== 'string' || SUB_TOPIC_FORMAT.test(subTopic);
	   });
	
	   // allows 'myTopic', 'myTopic-mySubTopic-SUB_0815+OK' and variations:
	   validator.addFormat('topic', function (topic) {
	      return typeof topic !== 'string' || TOPIC_FORMAT.test(topic);
	   });
	
	   // allows 'myTopic', '!myTopic-mySubTopic-SUB_0815+OK' and variations:
	   validator.addFormat('flag-topic', function (flagTopic) {
	      return typeof flagTopic !== 'string' || FLAG_TOPIC_FORMAT.test(flagTopic);
	   });
	
	   // allows 'de_DE', 'en-x-laxarJS' and such:
	   validator.addFormat('language-tag', function (languageTag) {
	      return typeof languageTag !== 'string' || LANGUAGE_TAG_FORMAT.test(languageTag);
	   });
	
	   // checks that object keys have the 'topic' format
	   validator.addFormat('topic-map', function (topicMap) {
	      return (typeof topicMap === 'undefined' ? 'undefined' : _typeof(topicMap)) !== 'object' || Object.keys(topicMap).every(function (topic) {
	         return TOPIC_FORMAT.test(topic);
	      });
	   });
	
	   // checks that object keys have the 'language-tag' format
	   validator.addFormat('localization', function (localization) {
	      return (typeof localization === 'undefined' ? 'undefined' : _typeof(localization)) !== 'object' || Object.keys(localization).every(function (tag) {
	         return LANGUAGE_TAG_FORMAT.test(tag);
	      });
	   });
	
	   return validator;
	}

/***/ },
/* 59 */
/***/ function(module, exports) {

	module.exports = {
		"$schema": "http://json-schema.org/draft-04/schema#",
		"type": "object",
		"properties": {
			"layout": {
				"type": "string",
				"description": "The layout to use. May be omitted if another page in the extension hierarchy defines one."
			},
			"extends": {
				"type": "string",
				"description": "The name of the page to extend."
			},
			"areas": {
				"type": "object",
				"description": "A map from area name to a list of widgets to display within that area.",
				"patternProperties": {
					"^[a-z][\\.a-zA-Z0-9_]*$": {
						"type": "array",
						"items": {
							"type": "object",
							"properties": {
								"widget": {
									"type": "string",
									"description": "Path to the widget that should be rendered."
								},
								"composition": {
									"type": "string",
									"description": "Path to the composition that should be included."
								},
								"layout": {
									"type": "string",
									"description": "Path to the layout that should be inserted."
								},
								"id": {
									"type": "string",
									"pattern": "^[a-z][a-zA-Z0-9_]*$",
									"description": "ID of the widget or composition. Will be generated if missing."
								},
								"insertBeforeId": {
									"type": "string",
									"description": "The ID of the widget this widget or composition should be inserted before."
								},
								"features": {
									"type": "object",
									"description": "Configuration of the features defined by the widget or composition."
								},
								"enabled": {
									"type": "boolean",
									"default": true,
									"description": "Set to false to omit widgets e.g. for debugging purposes."
								}
							},
							"additionalProperties": false
						}
					}
				},
				"additionalProperties": false
			}
		},
		"additionalProperties": false
	};

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	exports.COMPACT = exports.FLAT = undefined;
	exports.createProvider = createProvider;
	exports.createCollector = createCollector;
	
	var _object = __webpack_require__(39);
	
	/** Use to access the flattened page model, where compositions have been expanded. */
	var FLAT = exports.FLAT = 'FLAT';
	/** Use to access the compact page/composition model, where compositions have not been expanded. */
	/**
	 * Copyright 2016 aixigo AG
	 * Released under the MIT license.
	 * http://laxarjs.org/license
	 */
	var COMPACT = exports.COMPACT = 'COMPACT';
	
	function createProvider(collector) {
	
	   return {
	
	      /** Start collecting page/composition data. */
	      enable: function enable() {
	         collector.enable();
	      },
	
	
	      ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	      /** Stop collecting page/composition data and clean up. */
	      disable: function disable() {
	         collector.disable();
	      },
	
	
	      ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	      /**
	       * Access the current page information.
	       * Everything is returned as a copy, sothis object cannot be used to modify the host application.
	       *
	       * @return {Object}
	       *   the current page information, with the following properties:
	       *    - `pageDefinitions` {Object}
	       *       both the original as well as the expanded/flattened page model for each available page
	       *    - `compositionDefinitions` {Object}
	       *       both the original as well as the expanded/flattened composition model for each composition of
	       *       any available page
	       *    - `widgetDescriptors` {Object}
	       *       the widget descriptor for each widget that was referenced
	       *    - `pageReference` {String}
	       *       the reference for the current page, to lookup page/composition definitions
	       */
	      current: function current() {
	         return collector.current();
	      },
	
	
	      /**
	       * Add a listener function to be notified whenever the page information changes.
	       * As a side-effect, this also automatically enables collecting page/composition data.
	       * Each listener will be delivered its own copy of the page information.
	       *
	       * @param {Function} _
	       *    The listener to add. Will be called with the current page information whenever that changes.
	       */
	      addListener: function addListener(_) {
	         collector.addListener(_);
	      },
	
	
	      /**
	       * Remove a page information listener function.
	       *
	       * @param {Function} _
	       *    The listener to remove
	       */
	      removeListener: function removeListener(_) {
	         collector.removeListener(_);
	      }
	   };
	}
	
	function createCollector(configuration, log) {
	
	   var enabled = configuration.get('tooling.enabled');
	
	   var listeners = [];
	
	   var currentPageInfo = {
	      pageReference: null,
	      pageDefinitions: {},
	      compositionDefinitions: {},
	      widgetDescriptors: {}
	   };
	
	   return {
	
	      // eslint-disable-next-line valid-jsdoc
	      /** Collect a widget descriptor. */
	      collectWidgetDescriptor: function collectWidgetDescriptor(ref, descriptor) {
	         if (!enabled) {
	            return;
	         }
	         currentPageInfo.widgetDescriptors[ref] = descriptor;
	      },
	
	
	      ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	      // eslint-disable-next-line valid-jsdoc
	      /**
	       * Collect a page definition.
	       * The page is deep-copied right away, and may safely be modified by the caller.
	       */
	      collectPageDefinition: function collectPageDefinition(ref, page, type) {
	         if (!enabled) {
	            return;
	         }
	         var definitions = currentPageInfo.pageDefinitions;
	         definitions[ref] = definitions[ref] || {
	            FLAT: null,
	            COMPACT: null
	         };
	         definitions[ref][type] = (0, _object.deepClone)(page);
	      },
	
	
	      ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	      // eslint-disable-next-line valid-jsdoc
	      /**
	       * Collect a composition definition.
	       * The composition is deep-copied right away, and may safely be modified by the caller.
	       */
	      collectCompositionDefinition: function collectCompositionDefinition(pageRef, compositionInstanceId, composition, type) {
	         if (!enabled) {
	            return;
	         }
	         var definitions = currentPageInfo.compositionDefinitions;
	         var definitionsByInstance = definitions[pageRef] = definitions[pageRef] || {};
	         definitionsByInstance[compositionInstanceId] = definitionsByInstance[compositionInstanceId] || {
	            FLAT: null,
	            COMPACT: null
	         };
	         definitionsByInstance[compositionInstanceId][type] = (0, _object.deepClone)(composition);
	      },
	
	
	      ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	      // eslint-disable-next-line valid-jsdoc
	      /**
	       * Collect information about the current page, and inform all listeners.
	       * Each listener will receive its own copy of the page information.
	       */
	      collectCurrentPage: function collectCurrentPage(ref) {
	         if (!enabled) {
	            return;
	         }
	         currentPageInfo.pageReference = ref;
	         listeners.forEach(function (listener) {
	            listener((0, _object.deepClone)(currentPageInfo));
	         });
	         cleanup();
	      },
	
	
	      ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	      enable: function enable() {
	         enabled = true;
	      },
	
	
	      ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	      disable: function disable() {
	         enabled = false;
	         currentPageInfo.pageReference = null;
	         currentPageInfo.widgetDescriptors = {};
	         cleanup();
	      },
	
	
	      ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	      addListener: function addListener(listener) {
	         enabled = true;
	         listeners.push(listener);
	      },
	
	
	      ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	      removeListener: function removeListener(listener) {
	         listeners = listeners.filter(function (_) {
	            return _ !== listener;
	         });
	      },
	
	
	      ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	      current: function current() {
	         if (!enabled) {
	            log.warn('laxar page tooling: trying to access data, but collecting it was never enabled');
	         }
	         return (0, _object.deepClone)(currentPageInfo);
	      }
	   };
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function cleanup() {
	      var currentRef = currentPageInfo.pageReference;
	      ['pageDefinitions', 'compositionDefinitions'].forEach(function (collection) {
	         Object.keys(currentPageInfo[collection]).filter(function (ref) {
	            return ref !== currentRef;
	         }).forEach(function (ref) {
	            delete currentPageInfo[collection][ref];
	         });
	      });
	   }
	}

/***/ },
/* 61 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	exports.create = create;
	/**
	 * Copyright 2016 aixigo AG
	 * Released under the MIT license.
	 * http://laxarjs.org/license
	 */
	
	function create(artifactProvider, cssLoader) {
	   return {
	      load: function load() {
	         var themeProvider = artifactProvider.forTheme();
	         themeProvider.descriptor(function (descriptor) {
	            return themeProvider.assetUrl(descriptor.styleSource || 'css/theme.css').then(cssLoader.load);
	         });
	      }
	   };
	}

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	exports.adapterErrors = undefined;
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * Copyright 2016 aixigo AG
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * Released under the MIT license.
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * http://laxarjs.org/license
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          */
	
	exports.create = create;
	
	var _string = __webpack_require__(40);
	
	var string = _interopRequireWildcard(_string);
	
	var _features_provider = __webpack_require__(58);
	
	var featuresProvider = _interopRequireWildcard(_features_provider);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var TYPE_WIDGET = 'widget';
	var TYPE_ACTIVITY = 'activity';
	
	var ID_SEPARATOR = '-';
	
	/**
	 * @name AdapterErrorFactory
	 * @constructor
	 */
	var adapterErrors = exports.adapterErrors = {
	
	   /**
	    * Creates (but does not throw) an error indicating that an activity tried accessing the DOM.
	    *
	    * @param {String} details.technology
	    *    the complaining adapter's technology
	    * @param {String} details.widgetName
	    *    the canonical name of the activity causing the problem
	    *
	    * @return {Error}
	    *    the error, ready to throw
	    */
	   activityAccessingDom: function activityAccessingDom(_ref) {
	      var technology = _ref.technology,
	          widgetName = _ref.widgetName;
	
	      return new Error(technology + ' adapter: Trying to access DOM in activity ' + widgetName);
	   },
	
	
	   /**
	    * Creates (but does not throw) an error indicating that a widget requested an injection that cannot be
	    * provided by the adapter.
	    *
	    * @param {String} details.technology
	    *    the complaining adapter's technology
	    * @param {String} details.injection
	    *    the failing injection
	    * @param {String} details.widgetName
	    *    the canonical name of the widget causing the problem
	    *
	    * @return {Error}
	    *    the error, ready to throw
	    */
	   unknownInjection: function unknownInjection(_ref2) {
	      var technology = _ref2.technology,
	          injection = _ref2.injection,
	          widgetName = _ref2.widgetName;
	
	      return new Error(technology + ' adapter: Trying to inject unknown service "' + injection + ' into widget "' + widgetName + '"');
	   },
	
	
	   /**
	    * Creates (but does not throw) an error indicating that a widget was not registered with the current
	    * adapter.
	    *
	    * @param {String} details.technology
	    *    the complaining adapter's technology
	    * @param {String} details.widgetName
	    *    the canonical name of the missing widget
	    *
	    * @return {Error}
	    *    the error, ready to throw
	    */
	   unknownWidget: function unknownWidget(_ref3) {
	      var technology = _ref3.technology,
	          widgetName = _ref3.widgetName;
	
	      return new Error(technology + ' adapter: Unknown widget: ' + widgetName);
	   }
	};
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	var noOp = function noOp() {};
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Create a generic widget loader that can load widgets and activities implemented in various technologies
	 * by using appropriate adapters.
	 *
	 * @param {Log} log
	 *    log instance to use for technology compatibility warnings
	 * @param {ArtifactProvider} artifactProvider
	 *    an artifact provider for looking up widget descriptors and assets
	 * @param {ControlLoader} controlLoader
	 *    helps loading controls and their assets
	 * @param {CssLoader} cssLoader
	 *    helps loading widget- and control-stylesheets during development
	 * @param {PagesCollector} pagesCollector
	 *    used for inspection tools
	 * @param {Function} servicesForWidget
	 *    a factory method to create widget-specific services
	 *
	 * @return {WidgetLoader}
	 *    a new widget loader
	 */
	function create(log, artifactProvider, controlLoader, cssLoader, pagesCollector, servicesForWidget) {
	
	   var widgetAdapters = {};
	
	   /**
	    * @name WidgetLoader
	    * @constructor
	    */
	   return {
	      load: load,
	
	      /**
	       * Several factory methods for creating error objects that are useful for almost any adapter.
	       *
	       * @memberof WidgetLoader
	       * @type {AdapterErrorFactory}
	       */
	      adapterErrors: adapterErrors,
	
	      /**
	       * Register support for integration technologies.
	       *
	       * @param {Object} adapters
	       *    a map of widget adapters by technology to be registered with this loader
	       *
	       * @memberof WidgetLoader
	       */
	      registerWidgetAdapters: function registerWidgetAdapters(adapters) {
	         Object.assign(widgetAdapters, adapters);
	      }
	   };
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   /**
	    * Load a widget using an appropriate adapter
	    *
	    * First, get the given widget's descriptor to validate and instantiate the widget features.
	    * Then, instantiate a widget adapter matching the widget's technology. Using the adapter, create the
	    * widget controller. The adapter is returned and can be used to attach the widget to the DOM, or to
	    * destroy it.
	    *
	    * @param {Object} widgetConfiguration
	    *    a widget instance configuration (as used in page definitions) to instantiate the widget from
	    * @param {Object} [optionalOptions]
	    *    map of additonal options
	    * @param {Function} [optionalOptions.onBeforeControllerCreation]
	    *    a function to call just before the controller is set up. It receives an object of named,
	    *    widget-specific injections as arguments
	    *
	    * @return {Promise} a promise for a widget adapter, with an already instantiated controller
	    *
	    * @memberof WidgetLoader
	    */
	   function load(widgetConfiguration) {
	      var _ref4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	          _ref4$onBeforeControl = _ref4.onBeforeControllerCreation,
	          onBeforeControllerCreation = _ref4$onBeforeControl === undefined ? noOp : _ref4$onBeforeControl;
	
	      var widgetArtifactProvider = artifactProvider.forWidget(widgetConfiguration.widget);
	
	      return widgetArtifactProvider.descriptor().then(function (descriptor) {
	         // The control-descriptors must be loaded prior to controller creation.
	         // This allows the widget controller to synchronously instantiate controls.
	         return Promise.all((descriptor.controls || []).map(controlLoader.load)).then(function (controlDescriptors) {
	            controlDescriptors.forEach(checkTechnologyCompatibility(descriptor));
	            return descriptor;
	         });
	      }).then(function (descriptor) {
	
	         pagesCollector.collectWidgetDescriptor(widgetConfiguration.widget, descriptor);
	
	         var _descriptor$integrati = descriptor.integration,
	             type = _descriptor$integrati.type,
	             technology = _descriptor$integrati.technology;
	
	         var widgetName = descriptor.name;
	         if (type !== TYPE_WIDGET && type !== TYPE_ACTIVITY) {
	            throwError(widgetConfiguration, 'Unknown integration type "' + type + '"');
	         }
	
	         var throwWidgetError = throwError.bind(null, widgetConfiguration);
	         var features = featuresProvider.featuresForWidget(descriptor, widgetConfiguration, throwWidgetError);
	         var anchorElement = document.createElement('DIV');
	         anchorElement.className = widgetName;
	         anchorElement.id = 'ax' + ID_SEPARATOR + widgetConfiguration.id;
	
	         var adapterFactory = widgetAdapters[technology];
	         var _adapterFactory$servi = adapterFactory.serviceDecorators,
	             serviceDecorators = _adapterFactory$servi === undefined ? function () {
	            return {};
	         } : _adapterFactory$servi;
	
	         var _servicesForWidget = servicesForWidget(descriptor, widgetConfiguration, features, serviceDecorators(descriptor, widgetConfiguration)),
	             services = _servicesForWidget.services,
	             releaseServices = _servicesForWidget.releaseServices;
	
	         var environment = {
	            anchorElement: anchorElement,
	            services: services,
	            widgetName: widgetName,
	            onBeforeControllerCreation: onBeforeControllerCreation
	         };
	
	         return Promise.resolve(adapterFactory.create(environment)).then(function (adapter) {
	            return Object.assign({ destroy: noOp }, adapter);
	         }).then(function (adapter) {
	            return {
	               id: widgetConfiguration.id,
	               adapter: adapter,
	               destroy: function destroy() {
	                  releaseServices();
	                  adapter.destroy();
	               },
	
	               templatePromise: loadAssets(descriptor, widgetArtifactProvider)
	            };
	         });
	      }, function (err) {
	         var message = 'Could not load widget "' + widgetConfiguration.widget + '": ' + err.message;
	         log.error(message);
	         throw err;
	      });
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   /**
	    * Locates and loads the widget HTML template for this widget (if any) as well as any CSS stylesheets
	    * used by this widget or its controls.
	    *
	    * @param {Object} widgetDescriptor
	    *    a descriptor identifying the widget to load assets for
	    * @param {ArtifactProvider} artifactProviderForWidget
	    *    the provider with which to lookup or fetch artifact HTML and CSS
	    *
	    * @return {Promise}
	    *    A promise that will be resolved with the contents of any HTML template for this widget, or with
	    *    `null` if there is no template (for example, if this is an activity).
	    *
	    * @private
	    */
	   function loadAssets(widgetDescriptor, _ref5) {
	      var assetForTheme = _ref5.assetForTheme,
	          assetUrlForTheme = _ref5.assetUrlForTheme;
	      var type = widgetDescriptor.integration.type,
	          name = widgetDescriptor.name;
	
	      if (type === TYPE_ACTIVITY) {
	         return Promise.resolve(null);
	      }
	
	      return Promise.all([assetForTheme(widgetDescriptor.templateSource || name + '.html'), assetUrlForTheme(widgetDescriptor.styleSource || 'css/' + name + '.css')]).then(function (_ref6) {
	         var _ref7 = _slicedToArray(_ref6, 2),
	             html = _ref7[0],
	             cssUrl = _ref7[1];
	
	         if (cssUrl) {
	            cssLoader.load(cssUrl);
	         }
	         return html;
	      });
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function checkTechnologyCompatibility(widgetDescriptor) {
	      var name = widgetDescriptor.name,
	          technology = widgetDescriptor.integration.technology;
	
	      return function (controlDescriptor) {
	         var controlTechnology = (controlDescriptor.integration || {}).technology;
	         if (controlTechnology === 'plain') {
	            // plain is always compatible
	            return;
	         }
	
	         if (technology !== controlTechnology) {
	            log.warn('Incompatible integration technologies: widget [0] ([1]) cannot use control [2] ([3])', name, technology, controlDescriptor.name, controlTechnology);
	         }
	      };
	   }
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function throwError(widgetConfiguration, message) {
	   throw new Error(string.format('Error loading widget "[widget]" (id: "[id]"): [0]', [message], widgetConfiguration));
	}

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	exports.create = create;
	
	var _assert = __webpack_require__(38);
	
	var _assert2 = _interopRequireDefault(_assert);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var SESSION = 'sessionStorage'; /**
	                                 * Copyright 2016 aixigo AG
	                                 * Released under the MIT license.
	                                 * http://laxarjs.org/license
	                                 */
	
	/**
	 * Module providing the StorageApi factory.
	 *
	 * Widgets and activities can access their StorageApi instance by requesting the injection
	 * {@link widget_services#axStorage axStorage}, or use
	 * {@link widget_services#axGlobalStorage axGlobalStorage} for shared items.
	 *
	 * As such, in most cases only the {@link StorageApi} documentation is relevant.
	 *
	 * @module storage
	 */
	
	var LOCAL = 'localStorage';
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * @param {Object} backend
	 *    the K/V store, probably only accepting string values
	 * @param {String} namespace
	 *    prefix for all keys for namespacing purposes
	 *
	 * @return {StorageApi}
	 *    a storage wrapper to the given backend with `getItem`, `setItem` and `removeItem` methods
	 *
	 * @private
	 */
	function createStorage(backend, namespace) {
	
	   /**
	    * Provides a convenient API over the browser's `window.localStorage` and `window.sessionStorage` objects.
	    * If a browser doesn't support [web storage](http://www.w3.org/TR/webstorage/), a warning is logged to the
	    * `console` (if available) and a non-persistent in-memory store will be used instead. Note that this can
	    * for example also happen when using Mozilla Firefox with cookies disabled and as such isn't limited to
	    * older browsers.
	    *
	    * Additionally, in contrast to plain *web storage* access, non-string values will be automatically passed
	    * through JSON (de-) serialization on storage or retrieval. All keys will be prepended with a combination
	    * of a fixed (`ax.`) and an application-specific namespace (configured using `storagePrefix` with fallback
	    * to `name`) to avoid naming clashes with other (LaxarJS) web applications running on the same host and
	    * port. All {@link StorageApi} accessor methods should be called without any namespace as it is
	    * prepended automatically.
	    *
	    * @name StorageApi
	    * @constructor
	    */
	   return {
	      getItem: getItem,
	      setItem: setItem,
	      removeItem: removeItem
	   };
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   /**
	    * Retrieves a `value` by `key` from the store. JSON deserialization will automatically be applied.
	    *
	    * @param {String} key
	    *    the key of the item to retrieve (without namespace prefix)
	    *
	    * @return {*}
	    *    the value or `null` if it doesn't exist in the store
	    *
	    * @memberof StorageApi
	    */
	   function getItem(key) {
	      var item = backend.getItem(namespace + '.' + key);
	      return item && JSON.parse(item);
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   /**
	    * Sets a `value` for a `key`. The value must be JSON serializable. An existing value will be overwritten.
	    *
	    * @param {String} key
	    *    the key of the item to set (without namespace prefix)
	    * @param {*} value
	    *    the new value to set
	    *
	    * @memberof StorageApi
	    */
	   function setItem(key, value) {
	      var nsKey = namespace + '.' + key;
	      if (value === undefined) {
	         backend.removeItem(nsKey);
	      } else {
	         backend.setItem(nsKey, JSON.stringify(value));
	      }
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   /**
	    * Removes the value associated with `key` from the store.
	    *
	    * @param {String} key
	    *    the key of the item to remove (without namespace prefix)
	    *
	    * @memberof StorageApi
	    */
	   function removeItem(key) {
	      backend.removeItem(namespace + '.' + key);
	   }
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function getOrFakeBackend(browser, webStorageName) {
	   var browserConsole = browser.console();
	   var store = window[webStorageName];
	   if (store.setItem && store.getItem && store.removeItem) {
	      try {
	         var testKey = 'ax_.storage.test';
	         // In iOS Safari Private Browsing, this will fail:
	         store.setItem(testKey, 1);
	         store.removeItem(testKey);
	         return store;
	      } catch (e) {
	         // setItem failed: must use fake storage
	      }
	   }
	
	   if (browserConsole) {
	      var method = 'warn' in browserConsole ? 'warn' : 'log';
	      browserConsole[method]('window.' + webStorageName + ' not available: Using non-persistent polyfill. \n' + 'Try disabling private browsing or enabling cookies.');
	   }
	
	   var backend = {};
	   return {
	      getItem: function getItem(key) {
	         return backend[key] || null;
	      },
	      setItem: function setItem(key, val) {
	         backend[key] = val;
	      },
	      removeItem: function removeItem(key) {
	         if (key in backend) {
	            delete backend[key];
	         }
	      }
	   };
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function applicationPrefix(configuration) {
	   return configuration.get('storagePrefix', configuration.ensure('name'));
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Creates a new storage factory. In most cases this module will be called without arguments,
	 * but having the ability to provide them is useful e.g. for mocking purposes within tests.
	 * If the arguments are omitted, an attempt is made to access the native browser WebStorage api.
	 * If that fails, storage is only mocked by an in memory map (thus actually unavailable).
	 *
	 * Developers are free to use polyfills to support cases where local- or session-storage may not be
	 * available. Just make sure to initialize the polyfills before this module.
	 *
	 * @param {Object} configuration
	 *    a configuration service instance, to determine a storage prefix based on the configured name
	 * @param {Object} browser
	 *    the browser api adapter
	 * @param {Object} [localStorageBackend]
	 *    the backend for local storage. Default is `window.localStorage`
	 * @param {Object} [sessionStorageBackend]
	 *    the backend for session storage. Default is `window.sessionStorage`
	 *
	 * @return {StorageFactory}
	 *    a new storage factory
	 *
	 * @private
	 */
	function create(configuration, browser, localStorageBackend, sessionStorageBackend) {
	
	   var localBackend = localStorageBackend || getOrFakeBackend(browser, LOCAL);
	   var sessionBackend = sessionStorageBackend || getOrFakeBackend(browser, SESSION);
	   var prefix = 'ax.' + applicationPrefix(configuration) + '.';
	
	   /**
	    * The API returned by the module's `create` function.
	    *
	    * @name StorageFactory
	    * @constructor
	    */
	   return {
	
	      /**
	       * Returns a local storage object for a specific local namespace.
	       *
	       * @param {String} namespace
	       *    the namespace to prepend to keys
	       *
	       * @return {StorageApi}
	       *    the local storage object
	       *
	       * @memberof StorageFactory
	       */
	      getLocalStorage: function getLocalStorage(namespace) {
	         (0, _assert2.default)(namespace).hasType(String).isNotNull();
	
	         return createStorage(localBackend, prefix + namespace);
	      },
	
	
	      ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	      /**
	       * Returns a session storage object for a specific local namespace.
	       *
	       * @param {String} namespace
	       *    the namespace to prepend to keys
	       *
	       * @return {StorageApi}
	       *    the session storage object
	       *
	       * @memberof StorageFactory
	       */
	      getSessionStorage: function getSessionStorage(namespace) {
	         (0, _assert2.default)(namespace).hasType(String).isNotNull();
	
	         return createStorage(sessionBackend, prefix + namespace);
	      },
	
	
	      ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	      /**
	       * Returns the local storage object for application scoped keys. This is equivalent to
	       * `storage.getLocalStorage( 'app' )`.
	       *
	       * @return {StorageApi}
	       *    the application local storage object
	       *
	       * @memberof StorageFactory
	       */
	      getApplicationLocalStorage: function getApplicationLocalStorage() {
	         return createStorage(localBackend, prefix + 'app');
	      },
	
	
	      ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	      /**
	       * Returns the session storage object for application scoped keys. This is equivalent to
	       * `storage.getSessionStorage( 'app' )`.
	       *
	       * @return {StorageApi}
	       *    the application session storage object
	       *
	       * @memberof StorageFactory
	       */
	      getApplicationSessionStorage: function getApplicationSessionStorage() {
	         return createStorage(sessionBackend, prefix + 'app');
	      }
	   };
	}

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	exports.create = create;
	
	var _object = __webpack_require__(39);
	
	function create(log) {
	
	   var api = {
	      started: started
	   };
	
	   var idCounter = 0;
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function started(optionalOptions) {
	      var timer = new Timer(optionalOptions);
	      timer.start();
	      return timer;
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function Timer(optionalOptions) {
	      this.options_ = Object.assign({
	         label: 'timer' + idCounter++
	      }, optionalOptions);
	      this.startTime_ = null;
	      this.stopTime_ = null;
	      this.splitTimes_ = [];
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   Timer.prototype.getData = function () {
	      return {
	         label: this.options_.label,
	         startTime: this.startTime_,
	         stopTime: this.stopTime_,
	         splitTimes: (0, _object.deepClone)(this.splitTimes_)
	      };
	   };
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   Timer.prototype.start = function () {
	      this.startTime_ = Date.now();
	   };
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   Timer.prototype.splitTime = function (optionalLabel) {
	      this.splitTimes_.push({
	         time: Date.now(),
	         label: optionalLabel || 'split' + this.splitTimes_.length
	      });
	   };
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   Timer.prototype.stop = function () {
	      this.stopTime_ = Date.now();
	   };
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   Timer.prototype.stopAndLog = function (optionalLabel) {
	      this.stop();
	
	      var startTime = this.startTime_;
	      var endTime = Date.now();
	      var label = optionalLabel || 'Timer Stopped';
	      this.splitTimes_.push({ label: label, time: endTime });
	
	      var message = [];
	      message.push('Timer "', this.options_.label, '": ');
	      message.push('start at ', new Date(startTime).toISOString(), ' (client), ');
	      message.push(label, ' after ', (endTime - startTime).toFixed(0), 'ms ');
	      message.push('(checkpoints: ');
	      var intervals = [];
	      this.splitTimes_.reduce(function (from, data) {
	         intervals.push('"' + data.label + '"=' + (data.time - from).toFixed(0) + 'ms');
	         return data.time;
	      }, startTime);
	      message.push(intervals.join(', '), ')');
	      log.info(message.join(''));
	   };
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   return api;
	} /**
	   * Copyright 2016 aixigo AG
	   * Released under the MIT license.
	   * http://laxarjs.org/license
	   */

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	exports.TARGET_SELF = undefined;
	exports.create = create;
	
	var _assert = __webpack_require__(38);
	
	var _assert2 = _interopRequireDefault(_assert);
	
	var _json_validator = __webpack_require__(54);
	
	var _object = __webpack_require__(39);
	
	var _flow = __webpack_require__(66);
	
	var _flow2 = _interopRequireDefault(_flow);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Copyright 2016 aixigo AG
	 * Released under the MIT license.
	 * http://laxarjs.org/license
	 */
	/**
	 * Module providing the FlowController factory.
	 *
	 * This service is internal to LaxarJS and not available to widgets and activities.
	 *
	 * @module flow_controller
	 * @private
	 */
	
	var SESSION_KEY_TIMER = 'navigationTimer';
	var DEFAULT_PLACE = '';
	
	var TARGET_SELF = exports.TARGET_SELF = '_self';
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Creates and returns a new flow controller from its dependencies.
	 *
	 * @param {ArtifactProvider} artifactProvider
	 *    an artifact provider, needed to fetch the flow definition
	 * @param {Configuration} configuration
	 *    a configuration instance, to determine the name of the flow to load
	 * @param {EventBus} eventBus
	 *    an event bus instance, used to subscribe to navigateRequest events, and to publish will/did-responses
	 * @param {Logger} log
	 *    a logger that is used for reporting flow validation and navigation problems
	 * @param {PageService} pageService
	 *    the page service to use for actual page transitions (setup, teardown) during navigation
	 * @param {Router} router
	 *    router to register places with, and to use for URL construction
	 * @param {Timer} timer
	 *    timer to use for measuring page transitions
	 *
	 * @return {FlowController}
	 *    a flow controller instance
	 */
	function create(artifactProvider, configuration, eventBus, log, pageService, router, timer) {
	
	   var COLLABORATOR_ID = 'AxFlowController';
	   var availablePlaces = {};
	
	   var activeParameters = {};
	   var activePlace = void 0;
	   var navigationInProgress = false;
	   var requestedTarget = null;
	
	   eventBus.subscribe('navigateRequest', function (_ref) {
	      var target = _ref.target,
	          data = _ref.data;
	
	      if (navigationInProgress) {
	         return;
	      }
	      requestedTarget = target;
	      navigateToTarget(target, Object.assign({}, activeParameters, data));
	   }, { subscriber: COLLABORATOR_ID });
	
	   /**
	    * A flow controller can load a flow definition, setup routes, and allows to navigate between places. The
	    * flow controller handles router-initiated navigation as well as `navigateRequest` events and triggers
	    * instantiation/destruction of the associated pages.
	    *
	    * @name FlowController
	    * @constructor
	    */
	   return {
	      constructAbsoluteUrl: constructAbsoluteUrl,
	      loadFlow: loadFlow
	   };
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   /**
	    * Starts loading the configured flow definition and configures the router.
	    *
	    * @return {Promise}
	    *    a promise that is resolved when all routes have been registered
	    */
	   function loadFlow() {
	      var flowName = configuration.ensure('flow.name');
	      return artifactProvider.forFlow(flowName).definition().then(function (flow) {
	         validateFlowJson(flow);
	         router.registerRoutes(assembleRoutes(flow), createFallbackHandler(flow));
	      });
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   /**
	    * Get the place definition for a given target or place. If the provided identifier is a target of the
	    * current place, the definition of the referenced place is returned. Otherwise, the current place is
	    * returned.
	    *
	    * @param {String} targetOrPlaceId
	    *    a string identifying the target or place to obtain a definition for
	    * @param {Object} place
	    *    the corresponding place definition
	    *
	    * @return {Object}
	    *    a place definition with `targets` and `patterns` as specified in the flow definition, plus `id`
	    */
	   function placeForTarget(targetOrPlaceId) {
	      var place = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : activePlace;
	
	      var placeId = place ? place.targets[targetOrPlaceId] : null;
	      if (placeId == null) {
	         placeId = targetOrPlaceId;
	      }
	      _assert2.default.state(placeId in availablePlaces, 'Unknown target or place "' + targetOrPlaceId + '". Current place: "' + place.id + '"');
	      return availablePlaces[placeId];
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   /**
	    * Constructs an absolute URL to the given target or place using the given parameters. If a target is
	    * given as first argument, it is resolved using the currently active place.
	    *
	    * @param {String} targetOrPlace
	    *    the target or place ID to construct a URL for
	    * @param {Object} [optionalParameters]
	    *    optional map of place parameters. Missing parameters are filled base on the parameters that were
	    *    passed to the currently active place
	    *
	    * @return {String}
	    *    the generated absolute URL
	    *
	    * @memberof FlowService
	    */
	   function constructAbsoluteUrl(targetOrPlace, optionalParameters) {
	      var place = placeForTarget(targetOrPlace);
	      return router.constructAbsoluteUrl(place.patterns, withoutRedundantParameters(place, optionalParameters));
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function navigateToTarget(targetOrPlaceId, parameters, redirectFrom) {
	      var place = placeForTarget(targetOrPlaceId, redirectFrom);
	      router.navigateTo(place.patterns, withoutRedundantParameters(place, parameters), !!redirectFrom);
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function handleRouteChange(place, routerParameters) {
	      var parameters = Object.assign({}, place.defaultParameters, routerParameters);
	      if (activePlace && place.id === activePlace.id && equals(parameters, activeParameters)) {
	         navigationInProgress = false;
	         log.trace('Canceling navigation to "' + place.id + '". Already there with same parameters.');
	         return Promise.resolve();
	      }
	      if (navigationInProgress) {
	         log.trace('Canceling navigation to "' + place.id + '". Navigation already in progress.');
	         return Promise.resolve();
	      }
	      navigationInProgress = true;
	
	      var fromPlace = activePlace ? activePlace.targets[TARGET_SELF] : '';
	      var navigationTimer = timer.started({
	         label: 'navigation (' + fromPlace + ' -> ' + place.targets[TARGET_SELF] + ')',
	         persistenceKey: SESSION_KEY_TIMER
	      });
	
	      var event = {
	         target: requestedTarget || place.id,
	         place: place.id,
	         data: parameters
	      };
	      requestedTarget = null;
	
	      var options = { sender: COLLABORATOR_ID };
	      return eventBus.publish('willNavigate.' + event.target, event, options).then(function () {
	         if (activePlace && place.id === activePlace.id) {
	            activeParameters = parameters;
	            return Promise.resolve();
	         }
	
	         return pageService.controller().tearDownPage().then(function () {
	            log.setTag('PLCE', place.id);
	            activeParameters = parameters;
	            activePlace = place;
	            return pageService.controller().setupPage(place.page);
	         });
	      }).then(function () {
	         navigationInProgress = false;
	         navigationTimer.stopAndLog('didNavigate');
	         return eventBus.publish('didNavigate.' + event.target, event, options);
	      }).catch(function (err) {
	         log.error('Failed to navigate to place "' + place.id + '". Error: [0]\n', err.stack);
	         return Promise.reject(err);
	      });
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function createFallbackHandler(flow) {
	      var redirectOn = flow.redirectOn,
	          places = flow.places;
	
	      return function (path) {
	         log.warn('Received request for unknown route "' + path + '".');
	         if (redirectOn.unknownPlace in places) {
	            log.trace('- Redirecting to error place ("' + redirectOn.unknownPlace + '").');
	            handleRouteChange(places[redirectOn.unknownPlace], {});
	         } else if (DEFAULT_PLACE in places) {
	            log.trace('- Redirecting to default place ("' + DEFAULT_PLACE + '").');
	            handleRouteChange(places[DEFAULT_PLACE], {});
	         } else {
	            log.trace('- Got no unknownPlace redirect and no default place. Doing nothing.');
	         }
	      };
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function assembleRoutes(_ref2) {
	      var places = _ref2.places;
	
	      var routeMap = {};
	      (0, _object.forEach)(places, function (place, placeId) {
	         place.id = placeId;
	         place.patterns = place.patterns || ['/' + placeId];
	         (0, _object.setPath)(place, 'targets.' + TARGET_SELF, place.id);
	
	         var id = place.id,
	             patterns = place.patterns,
	             page = place.page,
	             redirectTo = place.redirectTo;
	
	         availablePlaces[id] = place;
	
	         if (redirectTo) {
	            patterns.forEach(function (pattern) {
	               routeMap[pattern] = function (parameters) {
	                  navigateToTarget(redirectTo, parameters, place);
	               };
	            });
	            return;
	         }
	
	         if (!page) {
	            log.error('flow: invalid empty place: ' + id);
	            return;
	         }
	
	         patterns.forEach(function (pattern) {
	            routeMap[pattern] = function (parameters) {
	               handleRouteChange(place, parameters);
	            };
	         });
	      });
	      return routeMap;
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function validateFlowJson(flowJson) {
	      var errors = (0, _json_validator.create)(_flow2.default).validate(flowJson);
	      if (errors.length) {
	         log.error('LaxarJS flow controller: Failed validating flow definition:\n[0]', errors.map(function (_ref3) {
	            var message = _ref3.message;
	            return ' - ' + message;
	         }).join('\n'));
	         throw new Error('Illegal flow.json format');
	      }
	   }
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function withoutRedundantParameters(place, parameters) {
	   var _place$defaultParamet = place.defaultParameters,
	       defaultParameters = _place$defaultParamet === undefined ? {} : _place$defaultParamet;
	
	   var remainingParameters = {};
	   (0, _object.forEach)(parameters, function (value, key) {
	      if (!(key in defaultParameters) || defaultParameters[key] !== value) {
	         remainingParameters[key] = value;
	      }
	   });
	   return remainingParameters;
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function equals(a, b) {
	   var aKeys = Object.keys(a);
	   var bKeys = Object.keys(b);
	   return aKeys.length === bKeys.length && aKeys.every(function (key) {
	      return key in b && a[key] === b[key];
	   });
	}

/***/ },
/* 66 */
/***/ function(module, exports) {

	module.exports = {
		"$schema": "http://json-schema.org/draft-04/schema#",
		"type": "object",
		"required": [
			"places"
		],
		"properties": {
			"redirectOn": {
				"type": "object",
				"description": "Globally defined redirects for certain edge cases",
				"properties": {
					"unknownPlace": {
						"type": "string",
						"description": "This place is loaded whenever the requested place doesn't exist."
					}
				},
				"default": {},
				"additionalProperties": false
			},
			"places": {
				"type": "object",
				"format": "topic-map",
				"description": "The places for this flow. Keys (that is, place names) must be valid event topics.",
				"additionalProperties": {
					"type": "object",
					"properties": {
						"patterns": {
							"type": "array",
							"description": "Non-empty list of URL patterns to route to this place. If omitted, the place name (prefixed with a slash) is used as the sole pattern.",
							"minItems": 1,
							"items": {
								"type": "string"
							}
						},
						"page": {
							"type": "string",
							"description": "The page to render for this place."
						},
						"redirectTo": {
							"type": "string",
							"description": "The place to redirect to when hitting this place."
						},
						"defaultParameters": {
							"type": "object",
							"default": {},
							"additionalProperties": {
								"type": [
									"string",
									"boolean",
									"null"
								]
							},
							"description": "Default values for optional (query) parameters."
						},
						"targets": {
							"type": "object",
							"format": "topic-map",
							"additionalProperties": {
								"type": "string",
								"format": "topic"
							},
							"description": "A map of symbolic targets to place-names reachable from this place."
						}
					},
					"additionalProperties": false
				}
			}
		},
		"additionalProperties": false
	};

/***/ },
/* 67 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.create = create;
	/**
	 * Copyright 2016 aixigo AG
	 * Released under the MIT license.
	 * http://laxarjs.org/license
	 */
	/**
	 * Module providing the FlowService factory.
	 *
	 * To access the FlowService in a widget, request the {@link widget_services#axFlowService axFlowService}
	 * injection.
	 *
	 * @module flow_service
	 */
	
	/**
	 * Creates a flow service  backed by the given flow controller.
	 *
	 * @param {FlowController} flowController
	 *    a flow controller, needed to respect default parameter values when generating URLs
	 *
	 * @return {FlowService}
	 *    a flow service instance
	 *
	 * @private
	 */
	function create(flowController) {
	
	  /**
	   * Allows widgets to create valid URLs without knowledge about the current place, its routing patterns, or
	   * about the actual routing implementation.
	   *
	   * @name FlowService
	   * @constructor
	   */
	  return {
	    constructAbsoluteUrl: constructAbsoluteUrl
	  };
	
	  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	  /**
	   * Constructs an absolute URL to the given target or place using the given parameters. If a target is
	   * given as first argument, it is resolved using the currently active place.
	   *
	   * @param {String} targetOrPlace
	   *    the target or place ID to construct a URL for
	   * @param {Object} [optionalParameters]
	   *    optional map of place parameters. Missing parameters are filled base on the parameters that were
	   *    passed to the currently active place
	   *
	   * @return {String}
	   *    the generated absolute URL
	   *
	   * @memberof FlowService
	   */
	  function constructAbsoluteUrl(targetOrPlace) {
	    var optionalParameters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	
	    return flowController.constructAbsoluteUrl(targetOrPlace, optionalParameters);
	  }
	}

/***/ },
/* 68 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	exports.create = create;
	/**
	 * Copyright 2016 aixigo AG
	 * Released under the MIT license.
	 * http://laxarjs.org/license
	 */
	/**
	 * Module providing the Heartbeat factory.
	 *
	 * To use the Heartbeat service in a widget, request the {@link widget_services#axHeartbeat axHeartbeat}
	 * injection.
	 *
	 * @module heartbeat
	 */
	
	/**
	 * Creates a heartbeat backed by the given scheduler.
	 *
	 * @param {Function} [customNextTick]
	 *    a function that takes a callback, and will asynchronously execute that callback as soon as possible,
	 *    but asynchronously (that is, after the calling execution stack has finished running).
	 *    If omitted, the callback is scheduled using `Promise.resolve().then( ... )`.
	 * @param {Function} [customTimeout]
	 *    an optional replacement for `window.setTimeout`, used to run coalesced callbacks in a second stage
	 *    after the immediately scheduled operation
	 *
	 * @return {FlowService}
	 *    a flow service instance
	 *
	 * @private
	 */
	function create(customNextTick, customTimeout) {
	
	   var nextTick = customNextTick || function (f) {
	      Promise.resolve().then(f);
	   };
	   var timeout = customTimeout || function (f) {
	      setTimeout(f, 0);
	   };
	
	   var heartbeatListeners = [];
	   var nextQueue = [];
	   var beforeQueue = [];
	   var afterQueue = [];
	
	   var beatRequested = false;
	
	   /**
	    * Scheduler for tasks that possibly synchronously trigger creation of new tasks, that need some common
	    * work to be done before or after all of these tasks (and all tasks scheduled in the meantime) are
	    * finished.
	    *
	    * An example would be model-manipulating operations in an application using AngularJS, that need to run
	    * `$rootScope.$apply` after all operations are done, but only *once*.
	    *
	    * @name Heartbeat
	    * @constructor
	    */
	   return {
	      registerHeartbeatListener: registerHeartbeatListener,
	      onBeforeNext: onBeforeNext,
	      onNext: onNext,
	      onAfterNext: onAfterNext
	   };
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   /**
	    * Registers a listener, that is called whenever a heartbeat occurs.
	    * It is called after the before and next queues were processed, but before working off the after queue has
	    * started.
	    * In contrast to the `on*` methods, listeners are not removed after a tick, but will be called again each
	    * time a heartbeat occurs.
	    * Instead this method returns a function to manually remove the listener again.
	    *
	    * @param  {Function} listener
	    *    the listener to register
	    *
	    * @return {Function}
	    *    a function to remove the listener again
	    *
	    * @memberof Heartbeat
	    */
	   function registerHeartbeatListener(listener) {
	      heartbeatListeners.push(listener);
	
	      return function () {
	         var index = void 0;
	         while ((index = heartbeatListeners.indexOf(listener)) !== -1) {
	            heartbeatListeners.splice(index, 1);
	         }
	      };
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   /**
	    * Schedules a function for the next heartbeat.
	    * If no heartbeat was triggered yet, it will be requested now.
	    *
	    * @param {Function} func
	    *    a function to schedule for the next tick
	    *
	    * @memberof Heartbeat
	    */
	   function onNext(func) {
	      if (!beatRequested) {
	         beatRequested = true;
	         nextTick(function () {
	            while (beforeQueue.length) {
	               beforeQueue.shift()();
	            }
	            while (nextQueue.length) {
	               nextQueue.shift()();
	            }
	            heartbeatListeners.forEach(function (listener) {
	               return listener();
	            });
	            if (afterQueue.length) {
	               // run after-queue once all directly resolvable promises are through.
	               timeout(function () {
	                  // Ensure that no further event bus deliveries were scheduled
	                  if (!beatRequested) {
	                     while (afterQueue.length) {
	                        afterQueue.shift()();
	                     }
	                  }
	               });
	            }
	            beatRequested = false;
	         });
	      }
	      nextQueue.push(func);
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   /**
	    * Schedules a function to be called before the next heartbeat occurs.
	    * Note that `func` may never be called, if there is no next heartbeat since calling this function won't
	    * trigger a new heartbeat.
	    *
	    * @param {Function} func
	    *    a function to call before the next heartbeat
	    *
	    * @memberof Heartbeat
	    */
	   function onBeforeNext(func) {
	      beforeQueue.push(func);
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   /**
	    * Schedules a function to be called after the next heartbeat occured.
	    * Note that `func` may never be called, if there is no next heartbeat since calling this function won't
	    * trigger a new heartbeat.
	    *
	    * @param {Function} func
	    *    a function to call after the next heartbeat
	    *
	    * @memberof Heartbeat
	    */
	   function onAfterNext(func) {
	      afterQueue.push(func);
	   }
	}

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	exports.create = create;
	
	var _assert = __webpack_require__(38);
	
	var _assert2 = _interopRequireDefault(_assert);
	
	var _area_helper = __webpack_require__(70);
	
	var _layout_widget_adapter = __webpack_require__(71);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /**
	                                                                                                                                                                                                     * Copyright 2016 aixigo AG
	                                                                                                                                                                                                     * Released under the MIT license.
	                                                                                                                                                                                                     * http://laxarjs.org/license
	                                                                                                                                                                                                     */
	
	
	function create(eventBus, pageLoader, layoutLoader, widgetLoader, localeManager, visibilityManager, pagesCollector) {
	
	   (0, _assert2.default)(eventBus).isNotNull();
	   (0, _assert2.default)(pageLoader).isNotNull();
	   (0, _assert2.default)(layoutLoader).isNotNull();
	   (0, _assert2.default)(widgetLoader).isNotNull();
	   (0, _assert2.default)(localeManager).isNotNull();
	   (0, _assert2.default)(visibilityManager).isNotNull();
	   (0, _assert2.default)(pagesCollector).isNotNull();
	
	   var pageController = void 0;
	
	   var pageServiceApi = {
	      createControllerFor: function createControllerFor(pageElement) {
	         _assert2.default.state(!pageController, 'Cannot create a page controller more than once.');
	         _assert2.default.state(pageElement instanceof HTMLElement, 'A page controller can only be created for a valid DOM element.');
	
	         pageController = createPageController(pageElement);
	         return pageController;
	      },
	      controller: function controller() {
	         return pageController;
	      }
	   };
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function createPageController(pageElement) {
	
	      var _areaHelper = null;
	      var api = {
	         setupPage: setupPage,
	         tearDownPage: tearDownPage,
	         areaHelper: function areaHelper() {
	            return _areaHelper;
	         }
	      };
	
	      /** Delay between sending didLifeCycle and attaching widget templates. */
	      var WIDGET_ATTACH_DELAY_MS = 5;
	      var COLLABORATOR_ID = 'AxPageController';
	      var LIFECYCLE_EVENT = { lifecycleId: 'default' };
	      var EVENT_OPTIONS = { sender: COLLABORATOR_ID };
	      var DEFAULT_AREAS = [{ name: 'activities', hidden: true }, { name: 'popups' }, { name: 'popovers' }];
	
	      var activeWidgetAdapterWrappers = [];
	      var cleanUpLayout = function cleanUpLayout() {};
	
	      pageElement.innerHTML = '';
	
	      ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	      function setupPage(pageName) {
	         (0, _assert2.default)(pageName).hasType(String).isNotNull();
	
	         return pageLoader.load(pageName).then(function (page) {
	            _areaHelper = (0, _area_helper.create)(page);
	            visibilityManager.setAreaHelper(_areaHelper);
	
	            var layoutPromise = layoutLoader.load(page.layout).then(function (layoutInfo) {
	               cleanUpLayout = renderLayout(pageElement, _areaHelper, layoutInfo);
	            });
	
	            localeManager.subscribe();
	            var layoutWidget = function layoutWidget(widget) {
	               return layoutWidgetAdapterFor(_areaHelper, widget);
	            };
	
	            // instantiate controllers wrapped by widget adapters
	            var widgetPromises = widgetsForPage(page).map(function (widget) {
	               return 'layout' in widget ? layoutWidget(widget) : widgetLoader.load(widget);
	            });
	
	            return Promise.all([].concat(_toConsumableArray(widgetPromises), [layoutPromise])).then(function (results) {
	               return results.slice(0, -1);
	            });
	         }).then(function (widgetAdapterWrappers) {
	            pagesCollector.collectCurrentPage(pageName);
	            activeWidgetAdapterWrappers = widgetAdapterWrappers;
	         }).then(localeManager.initialize).then(function () {
	            return eventBus.publishAndGatherReplies('beginLifecycleRequest.default', LIFECYCLE_EVENT, EVENT_OPTIONS);
	         }).then(visibilityManager.initialize)
	         // Give the widgets (a little) time to settle on the event bus before $digesting and painting:
	         .then(function () {
	            return delay(WIDGET_ATTACH_DELAY_MS);
	         }).then(function () {
	            return _areaHelper.attachWidgets(activeWidgetAdapterWrappers);
	         });
	      }
	
	      ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	      function tearDownPage() {
	         visibilityManager.unsubscribe();
	         localeManager.unsubscribe();
	
	         return eventBus.publishAndGatherReplies('endLifecycleRequest.default', LIFECYCLE_EVENT, EVENT_OPTIONS).then(function () {
	            activeWidgetAdapterWrappers.forEach(function (wrapper) {
	               return wrapper.destroy();
	            });
	            activeWidgetAdapterWrappers = [];
	            cleanUpLayout();
	            cleanUpLayout = function cleanUpLayout() {};
	         });
	      }
	
	      ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	      function widgetsForPage(page) {
	         return Object.keys(page.areas).reduce(function (widgets, areaName) {
	            var areaWidgets = page.areas[areaName];
	            return areaWidgets.reduce(function (widgets, widget) {
	               widget.area = areaName;
	               return [].concat(_toConsumableArray(widgets), [widget]);
	            }, widgets);
	         }, []);
	      }
	
	      ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	      function layoutWidgetAdapterFor(areaHelper, widget) {
	         return layoutLoader.load(widget.layout).then(function (_ref) {
	            var className = _ref.className,
	                html = _ref.html;
	
	            var adapter = (0, _layout_widget_adapter.create)(areaHelper, className, {
	               area: widget.area,
	               id: widget.id,
	               path: widget.layout
	            });
	
	            return {
	               id: widget.id,
	               adapter: adapter,
	               destroy: adapter.destroy,
	               templatePromise: Promise.resolve(html)
	            };
	         });
	      }
	
	      ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	      function renderLayout(pageElement, areaHelper, layoutInfo) {
	         addClass(pageElement, layoutInfo.className);
	         pageElement.innerHTML = layoutInfo.html;
	
	         var areas = (0, _area_helper.findWidgetAreas)(pageElement);
	         var deregisterFuncs = Object.keys(areas).map(function (areaName) {
	            return areaHelper.register(areaName, areas[areaName]);
	         });
	
	         DEFAULT_AREAS.forEach(function (area) {
	            if (areaHelper.exists(area.name)) {
	               return;
	            }
	
	            var node = document.createElement('div');
	            // We only set the attribute here for debugging purposes
	            node.setAttribute('ax-widget-area', area.name);
	            if (area.hidden) {
	               node.style.display = 'none';
	            }
	            deregisterFuncs.push(areaHelper.register(area.name, node));
	            pageElement.appendChild(node);
	         });
	
	         return function () {
	            deregisterFuncs.forEach(function (func) {
	               return func();
	            });
	            removeClass(pageElement, layoutInfo.className);
	         };
	      }
	
	      ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	      return api;
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   return pageServiceApi;
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function addClass(element, cssClass) {
	   if (element.classList) {
	      element.classList.add(cssClass);
	      return;
	   }
	   element.className += ' ' + cssClass;
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function removeClass(element, cssClass) {
	   if (element.classList) {
	      element.classList.remove(cssClass);
	      return;
	   }
	   element.className = element.className.split(' ').map(function (c) {
	      return c.trim();
	   }).filter(function (c) {
	      return c !== cssClass;
	   }).join(' ');
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function delay(ms) {
	   return new Promise(function (resolve) {
	      return setTimeout(resolve, ms);
	   });
	}

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	exports.create = create;
	exports.findWidgetAreas = findWidgetAreas;
	
	var _object = __webpack_require__(39);
	
	/**
	 * The area helper manages widget areas, their DOM representation and their nesting structure.
	 *
	 * It tracks widget area visibility in order to compile widgets and to attach them to their areas when
	 * these become visible.
	 * It does not interact with the event bus directly, but is consulted by the visibility event manager to
	 * determine area nesting for visibility events.
	 */
	
	function create(page) {
	
	   var exports = {
	      setVisibility: setVisibility,
	      areasInArea: areasInArea,
	      areasInWidget: areasInWidget,
	      register: register,
	      exists: exists,
	      attachWidgets: attachWidgets
	   };
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   // all initially visible widgets should be attached together, to reduce jitter and unnecessary DOM ops
	   var freeToAttach = false;
	
	   // keep the dom element for each area, to attach widgets to
	   var areaToElement = {};
	
	   // track widget adapters waiting for their area to become available so that they may attach to its DOM
	   var areaToWaitingAdapters = {};
	
	   // track the visibility status of all areas
	   var knownVisibilityState = {};
	
	   // the containing area name for each widget
	   var widgetIdToArea = {};
	   (0, _object.forEach)(page.areas, function (widgets, areaName) {
	      widgets.forEach(function (widget) {
	         widgetIdToArea[widget.id] = areaName;
	      });
	   });
	
	   // for each widget with children, and each widget area with nested areas, store a list of child names
	   var areasInAreaMap = {};
	   var areasInWidgetMap = {};
	   (0, _object.forEach)(page.areas, function (widgetEntries, areaName) {
	      var containerName = '';
	      if (areaName.indexOf('.') !== -1) {
	         var widgetId = areaName.split('.')[0];
	         areasInWidgetMap[widgetId] = areasInWidgetMap[widgetId] || [];
	         areasInWidgetMap[widgetId].push(areaName);
	         containerName = widgetIdToArea[widgetId];
	      }
	      areasInAreaMap[containerName] = areasInAreaMap[containerName] || [];
	      areasInAreaMap[containerName].push(areaName);
	   });
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function isVisible(areaName) {
	      return knownVisibilityState[areaName] || false;
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function setVisibility(areaName, visible) {
	      if (visible && freeToAttach) {
	         attachWaitingAdapters(areaName);
	      }
	      knownVisibilityState[areaName] = visible;
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function areasInArea(containerName) {
	      return areasInAreaMap[containerName];
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function areasInWidget(widgetId) {
	      return areasInWidgetMap[widgetId];
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   /**
	    * Register a widget area
	    *
	    * @param {String} name
	    *    the area name as used in the page definition
	    * @param {HTMLElement} element
	    *    an HTML element representing the widget area
	    *
	    * @return {Function}
	    *    removes the according area from the registry again
	    */
	   function register(name, element) {
	      if (name in areaToElement) {
	         throw new Error('The area "' + name + '" is defined twice in the current layout.');
	      }
	
	      areaToElement[name] = element;
	      if (freeToAttach && isVisible(name)) {
	         attachWaitingAdapters(name);
	      }
	
	      return function () {
	         delete areaToElement[name];
	      };
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function exists(name) {
	      return name in areaToElement;
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function attachWidgets(widgetAdapters) {
	      freeToAttach = true;
	      widgetAdapters.forEach(function (adapterRef) {
	         var areaName = widgetIdToArea[adapterRef.id];
	         areaToWaitingAdapters[areaName] = areaToWaitingAdapters[areaName] || [];
	         areaToWaitingAdapters[areaName].push(adapterRef);
	      });
	      (0, _object.forEach)(page.areas, function (widgets, areaName) {
	         if (isVisible(areaName)) {
	            attachWaitingAdapters(areaName);
	         }
	      });
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   // eslint-disable-next-line valid-jsdoc
	   /** @private */
	   function attachWaitingAdapters(areaName) {
	      var waitingAdapters = areaToWaitingAdapters[areaName];
	      if (!waitingAdapters || !waitingAdapters.length) {
	         return;
	      }
	
	      var element = areaToElement[areaName];
	      if (!element) {
	         return;
	      }
	
	      // Make sure that all assets are available before proceeding, so that DOM update happens en bloc.
	      Promise.all(waitingAdapters.map(function (adapterRef) {
	         return adapterRef.templatePromise;
	      })).then(function (htmlTemplates) {
	         // prepare first/last bootstrap classes for appending widgets
	         waitingAdapters.forEach(function (adapterRef, i) {
	            adapterRef.adapter.domAttachTo(element, htmlTemplates[i]);
	         });
	      });
	
	      delete areaToWaitingAdapters[areaName];
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   return exports;
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Copyright 2016 aixigo AG
	 * Released under the MIT license.
	 * http://laxarjs.org/license
	 */
	function findWidgetAreas(rootElement) {
	   var areas = {};
	   Array.from(rootElement.querySelectorAll('[ax-widget-area],[data-ax-widget-area]')).forEach(function (elem) {
	      var name = elem.getAttribute('ax-widget-area') || elem.getAttribute('data-ax-widget-area');
	
	      areas[name] = elem;
	   });
	   return areas;
	}

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	exports.create = create;
	
	var _area_helper = __webpack_require__(70);
	
	function create(areaHelper, className, widget) {
	
	   var exports = {
	      createController: createController,
	      domAttachTo: domAttachTo,
	      domDetach: domDetach,
	      destroy: destroy
	   };
	   var layoutNode = void 0;
	   var deregister = function deregister() {};
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function createController() {}
	   // noop
	
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function domAttachTo(areaElement, htmlTemplate) {
	      if (layoutNode) {
	         areaElement.appendChild(layoutNode);
	         return;
	      }
	
	      layoutNode = document.createElement('div');
	      layoutNode.id = widget.id;
	      layoutNode.className = className;
	      layoutNode.innerHTML = htmlTemplate;
	
	      var areas = (0, _area_helper.findWidgetAreas)(layoutNode);
	      var deregisterFuncs = Object.keys(areas).map(function (areaName) {
	         return areaHelper.register(widget.id + '.' + areaName, areas[areaName]);
	      });
	      deregister = function deregister() {
	         return deregisterFuncs.forEach(function (func) {
	            return func();
	         });
	      };
	
	      areaElement.appendChild(layoutNode);
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function domDetach() {
	      if (layoutNode.parentNode) {
	         layoutNode.parentNode.removeChild(layoutNode);
	      }
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function destroy() {
	      deregister();
	      layoutNode = null;
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   return exports;
	} /**
	   * Copyright 2016 aixigo AG
	   * Released under the MIT license.
	   * http://laxarjs.org/license
	   */

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /**
	                                                                                                                                                                                                                                                                               * Copyright 2016 aixigo AG
	                                                                                                                                                                                                                                                                               * Released under the MIT license.
	                                                                                                                                                                                                                                                                               * http://laxarjs.org/license
	                                                                                                                                                                                                                                                                               */
	
	
	exports.create = create;
	
	var _object = __webpack_require__(39);
	
	/**
	 * Module providing the page.js router factory.
	 *
	 * @module pagejs_router
	 */
	
	var ROUTE_PARAM_MATCHER = /\/:([^\/\?\(]+)(\(\.\*\)|\?)?/g;
	var TRAILING_SEGMENTS_MATCHER = /\/(_\/)*_?$/;
	
	/**
	 * Creates and returns a new page.js router instance from its dependencies.
	 *
	 * @param {Object} pagejs
	 *    the pagejs router module (or a compatible mock)
	 * @param {Browser} browser
	 *    the browser, used to determine the document base href
	 * @param {Configuration} configuration
	 *    the configuration instance, used to lookup router configuration as described above
	 *
	 * @return {PagejsRouter}
	 *    a router instance that will route as soon as `registerRoutes` is invoked
	 *
	 * @private
	 */
	function create(pagejs, browser, configuration) {
	
	   var hashbang = configuration.get('router.pagejs.hashbang', false);
	   var queryEnabled = configuration.ensure('router.query.enabled');
	
	   var base = configuration.get('router.base') || fallbackBase(hashbang);
	   var origin = originFromLocation(browser.location());
	   var absoluteBase = browser.resolve(base, origin);
	
	   /**
	    * Router implementation based on [page.js](https://visionmedia.github.io/page.js/).
	    *
	    * This router allows to register flow patterns in page.js syntax so that their handler is activated when
	    * the corresponding URL is entered in the browser. While that alone does not add much to the
	    * functionality built into page.js, this router also allows to construct URLs based on a pattern and
	    * corresponding substitution parameters. Finally, users can trigger navigation directly.
	    *
	    * Note that the router supports various configuration options:
	    *
	    *  - `router.pagejs`: configuration object that is directly passed to page.js (such as `click`,
	    *    `popstate`, `dispatch`, `hashbang`). The application is responsible for specifying the required
	    *    options, as LaxarJS does not touch the page.js defaults otherwise. Consult the page.js documentation
	    *    for more information
	    *  - `router.query.enabled`: if `true`, query parameters are automatically transformed into additional
	    *    place parameters and vice versa. The default is `false`
	    *  - `router.base`: The base path under which to perform routing. If omitted, the document base href is
	    *    used
	    *
	    * Note that this router encodes/decodes certain parameters in a way that is different from page.js:
	    *
	    *  - when the value `null` is encoded into a URL path segment, it is encoded as `_`
	    *  - the value `/` is double-encoded
	    *
	    * @name PagejsRouter
	    * @constructor
	    */
	   return {
	      registerRoutes: registerRoutes,
	      navigateTo: navigateTo,
	      constructAbsoluteUrl: constructAbsoluteUrl
	   };
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   /**
	    * Register all routes defined in the given route map, as well as a fallback route that should be used
	    * when none of the other routes match. Also causes the initial route to be triggered.
	    *
	    * @param {Object.<String, Function>} routeMap
	    *    a map of routing patterns in page.js syntax to the corresponding handler functions. When invoked,
	    *    the handler functions will receive the decoded parameter values for their pattern and (if configured)
	    *    from the query string, as a map from string parameter name to string value
	    * @param {Function} fallbackHandler
	    *    a handler that is invoked when none of the configured routes match. It receives the failed path as
	    *    a string argument
	    *
	    * @memberof PagejsRouter
	    */
	   function registerRoutes(routeMap, fallbackHandler) {
	      pagejs.base(base);
	      (0, _object.forEach)(routeMap, function (handler, pattern) {
	         pagejs(pattern, function (context) {
	            handler(collectParameters(pattern, context));
	         });
	      });
	      pagejs('*', function (context) {
	         fallbackHandler(context.path);
	      });
	      pagejs.start(configuration.get('router.pagejs', {}));
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   /**
	    * Change the browser location to a different routable URL, from pattern and parameters. This is also
	    * called reverse-routing.
	    *
	    * @param {String[]} patterns
	    *    a list of patterns to choose from. This allows the router to pick the "best" pattern, such as the
	    *    pattern containing the largest number of given parameters. This router always picks the first pattern
	    *    for now.
	    * @param {Object} parameters
	    *    parameter values to substitute into the pattern to generate a URL
	    * @param {Boolean} [replaceHistory=true]
	    *    if `true`, the current history entry is replaced with the new one, otherwise a new entry is pushed.
	    *    Useful to express redirects
	    *
	    * @memberof PagejsRouter
	    */
	   function navigateTo(patterns, parameters) {
	      var replaceHistory = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
	
	      var path = constructPath(patterns, parameters);
	      (replaceHistory ? pagejs.redirect : pagejs.show)(path);
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   /**
	    * Create a routable URL, from pattern and parameters. This allows to create link-hrefs without repeating
	    * URL patterns throughout the code base.
	    *
	    * @param {Array<String>} patterns
	    *    a list of patterns to choose from. This allows the router to pick the "best" pattern, such as the
	    *    pattern containing the largest number of given parameters. This router always picks the first pattern
	    *    for now.
	    * @param {Object} parameters
	    *    parameter values to substitute into the pattern to generate a URL
	    * @param {Object} parameterDefaults
	    *    only applicable if query strings are enabled by configuration: before a parameter is encoded into the
	    *    query string, it is checked against the default. Only values that are different from their default
	    *    are kept
	    *
	    * @return {String} the resulting URL, including schema and host
	    *
	    * @memberof PagejsRouter
	    */
	   function constructAbsoluteUrl(patterns, parameters, parameterDefaults) {
	      var routingPath = constructPath(patterns, parameters, parameterDefaults);
	      return hashbang ? absoluteBase + '#!' + routingPath : '' + absoluteBase + routingPath;
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function constructPath(patterns, parameters) {
	      var bestPattern = patterns[0];
	      var path = bestPattern.replace(ROUTE_PARAM_MATCHER, function ($0, $param, $modifier) {
	         var replacement = encodeSegment(parameters[$param], $modifier === '(.*)');
	         delete parameters[$param];
	         return '/' + replacement;
	      }).replace(TRAILING_SEGMENTS_MATCHER, '/');
	
	      if (queryEnabled) {
	         var _ret = function () {
	            var query = [];
	            (0, _object.forEach)(parameters, function (value, parameterName) {
	               var encodedKey = encodeURIComponent(parameterName);
	               if (value === true) {
	                  query.push(encodedKey);
	                  return;
	               }
	               if (value === false || value == null) {
	                  return;
	               }
	               query.push(encodedKey + '=' + encodeURIComponent(value));
	            });
	
	            if (query.length) {
	               return {
	                  v: path + '?' + query.join('&')
	               };
	            }
	         }();
	
	         if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	      }
	
	      return path;
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function collectParameters(pattern, context) {
	      var _context$querystring = context.querystring,
	          querystring = _context$querystring === undefined ? '' : _context$querystring,
	          _context$params = context.params,
	          params = _context$params === undefined ? {} : _context$params;
	
	      var parameters = {};
	      if (queryEnabled && querystring.length) {
	         querystring.split('&').map(function (_) {
	            return _.split('=').map(decodeURIComponent);
	         }).forEach(function (_ref) {
	            var _ref2 = _slicedToArray(_ref, 2),
	                key = _ref2[0],
	                value = _ref2[1];
	
	            parameters[key] = value !== undefined ? value : true;
	         });
	      }
	      (0, _object.forEach)(params, function (value, key) {
	         var isMultiSegment = pattern.indexOf('/:' + key + '(.*)') !== -1;
	         parameters[key] = decodeSegment(value, isMultiSegment);
	      });
	      return parameters;
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   /**
	    * Encode a parameter value for use as path segment(s) in routing.
	    *
	    * Usually, values are simply URL-encoded, but there are special cases:
	    *
	    *  - `null` and `undefined` are encoded as '_',
	    *  - other non-string values are converted to strings before URL encoding,
	    *  - slashes ('/') are double-encoded to '%252F', so that page.js ignores them during route matching,
	    *  - underscore ('_') is double-encoded to '%255F', to avoid confusion with '_' (null).
	    *
	    * When decoded, for use in didNavigate events, the original values will be restored, except for:
	    *  - non-string input values, which will always be decoded into strings,
	    *  - `undefined` values which will be decoded to `null`.
	    *
	    * @param {*} value
	    *   the parameter to encode
	    * @param {Boolean} [isMultiSegment=false]
	    *   determines if encoded value may contain slashes (true) or if slashes are double-encoded so that the
	    *   parameter can always be matched by a single path segment (false)
	    * @return {String}
	    *   the encoded value, for use as a path segment in URLs
	    *
	    * @private
	    */
	   function encodeSegment(value, isMultiSegment) {
	      if (value == null) {
	         return '_';
	      }
	      var urlSegments = encodeURIComponent(value).replace(/_/g, '%255F');
	      return isMultiSegment ? urlSegments : urlSegments.replace(/%2F/g, '%252F');
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   /**
	    * Decodes a place parameter value from a path segment, to restore it for use in will/didNavigate events.
	    *
	    * Usually, this reverses the application of {#encodeSegment} after the browser has decoded a URL, except:
	    *  - path-segments based on non-string input values, which will always be decoded into strings,
	    *  - path-segments based on `undefined` values which will be decoded to `null`.
	    *
	    * Note that while the browser has already performed URL-decoding, this function replaces `%2F` into `/`
	    * and `%5F` to `_`, to be compatible with the double-encoding performaed by {#encodeSegment}.
	    *
	    * @param {String} value
	    *   the encoded parameter segment to decode
	    * @param {Boolean} [isMultiSegment=false]
	    *   determines if url-encoded slashes in the value were part of the original input (true) or if slashes
	    *   in the given value were double-encoded by {#encodeSegment} and need additional decoding (false)
	    * @return {String}
	    *   the decoded value, for use as a path segment in URLs
	    *
	    * @private
	    */
	   function decodeSegment(value, isMultiSegment) {
	      if (value === '_' || value == null) {
	         return null;
	      }
	      var segments = value.replace(/%5F/g, '_');
	      return isMultiSegment ? segments : segments.replace(/%2F/g, '/');
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function fallbackBase(hashbang) {
	      if (hashbang) {
	         return browser.location().pathname;
	      }
	      // relies on the HTML `base` element being present
	      var documentBase = browser.resolve('.').replace(/\/$/, '');
	      return documentBase;
	   }
	}
	
	function originFromLocation(_ref3) {
	   var protocol = _ref3.protocol,
	       hostname = _ref3.hostname,
	       port = _ref3.port;
	
	   return protocol + '://' + hostname + (port ? ':' + port : '');
	}

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	exports.create = create;
	
	var _object = __webpack_require__(39);
	
	var senderOptions = { sender: 'AxPageController' }; /**
	                                                     * Copyright 2016 aixigo AG
	                                                     * Released under the MIT license.
	                                                     * http://laxarjs.org/license
	                                                     */
	
	var subscriberOptions = { subscriber: 'AxPageController' };
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * The LocaleManager initializes the locale(s) and implements changes to them.
	 *
	 * Before publishing the state of all configured locales, it listens to change requests, allowing
	 * widgets and activities (such as a LocaleSwitcherWidget) to influence the state of locales before
	 * the navigation is complete.
	 */
	
	function create(eventBus, configuration) {
	
	   var exports = {
	      initialize: initialize,
	      subscribe: subscribe,
	      unsubscribe: unsubscribe
	   };
	
	   var configLocales = configuration.ensure('i18n.locales');
	   var i18n = void 0;
	   var initialized = void 0;
	   var unsubscribeFromEventBus = function unsubscribeFromEventBus() {};
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function publish(locale) {
	      var event = { locale: locale, languageTag: i18n[locale] };
	      return eventBus.publish('didChangeLocale.' + locale, event, senderOptions);
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function initialize() {
	      initialized = true;
	      return Promise.all(Object.keys(configLocales).map(publish));
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function unsubscribe() {
	      unsubscribeFromEventBus();
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function subscribe() {
	      i18n = (0, _object.deepClone)(configLocales);
	      initialized = false;
	
	      unsubscribeFromEventBus = eventBus.subscribe('changeLocaleRequest', function (event) {
	         i18n[event.locale] = event.languageTag;
	         if (initialized) {
	            publish(event.locale);
	         }
	      }, subscriberOptions);
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   return exports;
	}

/***/ },
/* 74 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	exports.create = create;
	/**
	 * Copyright 2016 aixigo AG
	 * Released under the MIT license.
	 * http://laxarjs.org/license
	 */
	var senderOptions = { sender: 'AxPageController', deliverToSender: false };
	var subscriberOptions = { subscriber: 'AxPageController' };
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * The visibility event manager initializes and coordinates events for widget area visibility.
	 *
	 * It subscribes to all visibility changes and propagates them to nested widget areas
	 * (if applicable). It is not concerned with the resulting DOM-visibility of individual controls:
	 * the `axVisibilityService` takes care of that.
	 *
	 * @param {EventBus} eventBus
	 *    an event bus instance
	 * @return {Object}
	 *    a function to trigger initialization of the manager and initial widget visibility
	 */
	function create(eventBus) {
	
	   var exports = {
	      initialize: initialize,
	      setAreaHelper: setAreaHelper,
	      unsubscribe: unsubscribe
	   };
	
	   var areaHelper = void 0;
	   var unsubscribeFromAreaVisibilityRequest = function unsubscribeFromAreaVisibilityRequest() {};
	   var unsubscribeFromWidgetVisibilityRequest = function unsubscribeFromWidgetVisibilityRequest() {};
	   var ROOT = '';
	
	   function setAreaHelper(_) {
	      areaHelper = _;
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function initialize() {
	      // broadcast visibility changes in individual widgets to their nested areas
	      unsubscribeFromWidgetVisibilityRequest = eventBus.subscribe('changeWidgetVisibilityRequest', function (event) {
	         var affectedAreas = areaHelper.areasInWidget(event.widget);
	         var will = ['willChangeWidgetVisibility', event.widget, event.visible].join('.');
	         var did = ['didChangeWidgetVisibility', event.widget, event.visible].join('.');
	
	         eventBus.publish(will, event, senderOptions);
	
	         Promise.all((affectedAreas || []).map(event.visible ? show : hide)).then(function () {
	            return eventBus.publish(did, event, senderOptions);
	         });
	      }, subscriberOptions);
	
	      // broadcast visibility changes in widget areas to their nested areas
	      unsubscribeFromAreaVisibilityRequest = eventBus.subscribe('changeAreaVisibilityRequest', function (event) {
	         return initiateAreaChange(event.area, event.visible);
	      }, subscriberOptions);
	
	      return implementAreaChange(ROOT, true);
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function show(area) {
	      return requestAreaChange(area, true);
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function hide(area) {
	      return requestAreaChange(area, false);
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   /**
	    * First, publish a `changeAreaVisibilityRequest` to ask if some widget would like to manage the
	    * given area's visibility.
	    * If no widget responds, self-issue a will/did-response to notify interested widgets in the area
	    * of their new visibility status.
	    * In either case, manage the propagation to nested areas and inform the area helper so that it
	    * may compile and attach the templates of any newly visible widgets.
	    *
	    * @param {String} area
	    *    the area whose visibility to update
	    * @param {Boolean} visible
	    *    the new visibility state of the given area, to the best knowledge of the client
	    * @return {Promise}
	    *    promise that is resolved after the change request is completed
	    */
	   function requestAreaChange(area, visible) {
	      var request = ['changeAreaVisibilityRequest', area].join('.');
	      var event = { area: area, visible: visible };
	      return eventBus.publishAndGatherReplies(request, event, senderOptions).then(function (responses) {
	         if (responses.length === 0) {
	            // no one took responsibility, so the event manager determines visibility by area nesting
	            return initiateAreaChange(area, visible);
	         }
	         // assume the first 'did'-response to be authoritative:
	         var response = responses[0];
	         return implementAreaChange(area, response.event.visible);
	      });
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   // eslint-disable-next-line valid-jsdoc
	   /**
	    * Set the new visibility state for the given area, then issue requests for the child areas.
	    * Inform the area helper so that it may compile and attach the templates of any newly visible
	    * widgets.
	    */
	   function initiateAreaChange(area, visible) {
	      var will = ['willChangeAreaVisibility', area, visible].join('.');
	      var event = { area: area, visible: visible };
	      return eventBus.publish(will, event, senderOptions).then(function () {
	         return implementAreaChange(area, visible);
	      }).then(function () {
	         var did = ['didChangeAreaVisibility', area, visible].join('.');
	         return eventBus.publish(did, event, senderOptions);
	      });
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function implementAreaChange(ofArea, areaVisible) {
	      areaHelper.setVisibility(ofArea, areaVisible);
	      var children = areaHelper.areasInArea(ofArea);
	      if (!children) {
	         return Promise.resolve();
	      }
	
	      return Promise.all(children.map(areaVisible ? show : hide));
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function unsubscribe() {
	      unsubscribeFromWidgetVisibilityRequest();
	      unsubscribeFromAreaVisibilityRequest();
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   return exports;
	}

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	exports.create = create;
	
	var _assert = __webpack_require__(38);
	
	var _assert2 = _interopRequireDefault(_assert);
	
	var _log = __webpack_require__(47);
	
	var _widget_services_i18n = __webpack_require__(76);
	
	var _widget_services_visibility = __webpack_require__(77);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/**
	 * Copyright 2016 aixigo AG
	 * Released under the MIT license.
	 * http://laxarjs.org/license
	 */
	
	/**
	 * Factory for the services that are available to the controller of a widget, regardless of the underlying
	 * view framework.
	 *
	 * @module widget_services
	 */
	
	var INVALID_ID_MATCHER = /[^A-Za-z0-9_\.-]/g;
	var ID_SEPARATOR = '-';
	
	function create(artifactProvider, configuration, controlLoader, globalEventBus, flowService, log, heartbeat, pageService, storage, toolingProviders) {
	
	   var i18nOptions = configuration.ensure('i18n');
	
	   return {
	      forWidget: function forWidget(specification, widgetConfiguration, features) {
	         var decorators = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
	         var widgetId = widgetConfiguration.id;
	         var widgetName = specification.name;
	
	
	         var instances = {
	            /**
	             * Area helper service instance.
	             *
	             * @type {AxAreaHelper}
	             */
	            axAreaHelper: null,
	
	            /**
	             * widget asset accessor instance.
	             *
	             * @type {AxAssets}
	             */
	            axAssets: null,
	
	            /**
	             * Interface to the configuration the application was bootstrapped with.
	             *
	             * @type {Configuration}
	             */
	            axConfiguration: null,
	
	            /**
	             * Context information and tiny service collection.
	             *
	             * @type {AxContext}
	             */
	            axContext: null,
	
	            /**
	             * The control loader api to provide access to control modules used by a widget.
	             *
	             * @type {ControlLoader}
	             */
	            axControls: null,
	
	            /**
	             * Event bus instance specifically enriched for a widget instance.
	             *
	             * @type {AxEventBus}
	             */
	            axEventBus: null,
	
	            /**
	             * The features the widget was configured with.
	             * Its structure depends solely on the schema defined in the widget's descriptor file
	             * (`widget.json`)
	             *
	             * @type {Object}
	             */
	            axFeatures: null,
	
	            /**
	             * Injection for the flow service.
	             *
	             * @type {FlowService}
	             */
	            axFlowService: null,
	
	            /**
	             * The global event bus instance of the application.
	             * {@link axEventBus} should always be prefered over this, since for example unsubscribing from
	             * event subscriptions on widget destruction needs be done manually and can lead to severe memory
	             * leaks if omitted.
	             * One valid use case could be an activity, that has permanent knowledge about the application's
	             * state and lifetime, and for example adds an inspector to the event bus.
	             *
	             * @type {EventBus}
	             */
	            axGlobalEventBus: null,
	
	            /**
	             * The global logger instance.
	             *
	             * @type {Logger}
	             */
	            axGlobalLog: null,
	
	            /**
	             * The global storage factory.
	             *
	             * @type {StorageFactory}
	             */
	            axGlobalStorage: null,
	
	            /**
	             * The heartbeat instance.
	             *
	             * @type {Heartbeat}
	             */
	            axHeartbeat: null,
	
	            /**
	             * I18n api specifically for the widget instance.
	             *
	             * @type {AxI18n}
	             */
	            axI18n: null,
	
	            /**
	             * A function that generates page wide unique ids based on ids that are unique within the scope
	             * of a widget.
	             *
	             * A common use case is the connection of a `label` HTML element and an `input` element via `for`
	             * and `id` attributes.
	             * For such cases ids should **always** be generated using this service.
	             *
	             * Example:
	             * ```js
	             * widgetDom.querySelector( 'label' ).setAttribute( 'for', axId( 'myField' ) );
	             * widgetDom.querySelector( 'input' ).setAttribute( 'id', axId( 'myField' ) );
	             * ```
	             *
	             * @param {String} localUniqueId
	             *    an identifier that is unique within a widget
	             *
	             * @return {String}
	             *    an identifier that is unique for the current page
	             *
	             * @type {Function}
	             */
	            axId: null,
	
	            /**
	             * The widget logger instance.
	             * This is basically the same as the {@link #axGlobalLog}, but adds the name of the widget as
	             * prefix and its id as suffix to every log message.
	             *
	             * @type {Logger}
	             */
	            axLog: null,
	
	            /**
	             * Ready to use storage apis for a widget.
	             * All keys are namespaced by the widget id to limit visibility to this specific instance.
	             *
	             * @type {AxStorage}
	             */
	            axStorage: null,
	
	            /**
	             * Access to the tooling provider API.
	             * TODO Fix the type (and document toolingProviders)
	             *
	             * @type {*}
	             */
	            axTooling: null,
	
	            /**
	             * Visibility services for a widget instance.
	             * @type {AxVisibility}
	             */
	            axVisibility: null
	         };
	
	         var services = Object.assign({}, instances);
	         var releaseHandlers = [];
	
	         registerServiceFactory('axAreaHelper', function () {
	            return createAreaHelperForWidget(widgetId);
	         }, function () {
	            instances.axAreaHelper.release();
	         });
	         registerServiceFactory('axAssets', function () {
	            return createAssetsServiceForWidget(widgetName);
	         });
	         registerService('axConfiguration', configuration);
	         registerServiceFactory('axContext', function () {
	            return createContextForWidget(widgetConfiguration, widgetId, services);
	         });
	         registerService('axControls', controlLoader);
	         registerServiceFactory('axEventBus', function () {
	            return createEventBusForWidget(services.axGlobalEventBus, widgetName, widgetId);
	         }, function () {
	            instances.axEventBus.release();
	         });
	         registerService('axFeatures', features);
	         registerService('axFlowService', flowService);
	         registerService('axGlobalEventBus', globalEventBus);
	         registerService('axGlobalLog', log);
	         registerService('axGlobalStorage', storage);
	         registerService('axHeartbeat', heartbeat);
	
	         registerServiceFactory('axI18n', function () {
	            return (0, _widget_services_i18n.create)(services.axContext, i18nOptions);
	         });
	         registerServiceFactory('axId', function () {
	            return createIdGeneratorForWidget(widgetId);
	         });
	         registerServiceFactory('axLog', function () {
	            return createLoggerForWidget(log, widgetName, widgetId);
	         });
	         registerServiceFactory('axStorage', function () {
	            return createStorageForWidget(storage, widgetId);
	         });
	         registerServiceFactory('axVisibility', function () {
	            return (0, _widget_services_visibility.create)(services.axContext, services.axAreaHelper);
	         });
	         registerService('axTooling', toolingProviders);
	
	         return {
	            services: services,
	            releaseServices: function releaseServices() {
	               releaseHandlers.forEach(function (f) {
	                  f();
	               });
	            }
	         };
	
	         /////////////////////////////////////////////////////////////////////////////////////////////////////
	
	         function registerService(name, instance) {
	            var decorate = decorators[name];
	            instances[name] = services[name] = decorate ? decorate(instance) : instance;
	         }
	
	         /////////////////////////////////////////////////////////////////////////////////////////////////////
	
	         function registerServiceFactory(name, factory, optionalRelease) {
	            Object.defineProperty(services, name, {
	               get: function get() {
	                  if (!instances[name]) {
	                     var decorate = decorators[name];
	                     var instance = factory();
	                     instances[name] = decorate ? decorate(instance) : instance;
	                     if (optionalRelease) {
	                        releaseHandlers.push(optionalRelease);
	                     }
	                  }
	                  return instances[name];
	               }
	            });
	         }
	      }
	   };
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function createContextForWidget(widgetConfiguration, widgetId, services) {
	
	      /**
	       * This object encapsulates widget context information and provides access to the most important widget
	       * specific service instances.
	       * Most commonly this is used when working with
	       * [LaxarJS Patterns](https://github.com/LaxarJS/laxar-patterns).
	       *
	       * @name AxContext
	       * @constructor
	       */
	      return {
	
	         /**
	          * The event bus instance of the widget. This is the same as {@link #axEventBus}.
	          *
	          * @type {AxEventBus}
	          * @memberof AxContext
	          */
	         eventBus: services.axEventBus,
	
	         /**
	          * The configured features of the widget. This is the same as {@link #axFeatures}.
	          *
	          * @type {Object}
	          * @memberof AxContext
	          */
	         features: services.axFeatures,
	
	         /**
	          * The unique id generator function. This is the same as {@link #axId}.
	          *
	          * @type {Function}
	          * @memberof AxContext
	          */
	         id: services.axId,
	
	         /**
	          * The widget local log instance. This is the same as {@link #axLog}.
	          *
	          * @type {AxLog}
	          * @memberof AxContext
	          */
	         log: services.axLog,
	
	         /**
	          * Some information regarding the widget instance.
	          *
	          * The following fields are available:
	          * - `area`: full name of the area the widget is located in
	          * - `id`: the unique id of the widget on the page
	          * - `path`: path of the widget that was used to reference it in the according page or composition.
	          *    This is not the actual path on the file system, but most probably an alias known by the used
	          *    module loader.
	          *
	          * @type {Object}
	          * @memberof AxContext
	          */
	         widget: {
	            area: widgetConfiguration.area,
	            id: widgetId,
	            path: widgetConfiguration.widget
	         }
	      };
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function createAreaHelperForWidget(widgetId) {
	      var deregisterFuncs = [];
	
	      /**
	       * @name AxAreaHelper
	       * @constructor
	       */
	      return {
	         /**
	          * Looks up the global name of a widget area within a widget, as generated by LaxarJS.
	          * This is the reverse of {@link #AxAreaHelper.localName()}.
	          *
	          * @param {String} localAreaName
	          *    the widget-local name of the area
	          *
	          * @return {String}
	          *    the globally valid name of the area
	          *
	          * @memberof AxAreaHelper
	          */
	         fullName: function fullName(localAreaName) {
	            (0, _assert2.default)(localAreaName || null).hasType(String).isNotNull();
	            return qualify(localAreaName);
	         },
	
	
	         /**
	          * Returns the local part of a global area name.
	          * This is the reverse of {@link #AxAreaHelper.fullName()}.
	          *
	          * @param {String} fullAreaName
	          *    the global name of the area
	          *
	          * @return {String}
	          *    the name of the area as it is known to the widget
	          *
	          * @memberof AxAreaHelper
	          */
	         localName: function localName(fullAreaName) {
	            (0, _assert2.default)(fullAreaName).hasType(String).isNotNull();
	            return unqualify(fullAreaName);
	         },
	
	
	         /**
	          * Registers a DOM element as area of a widget with the area helper.
	          *
	          * @param {String} localAreaName
	          *    the widget-local name of the area
	          * @param {HTMLElement} element
	          *    the element to register as widget area
	          *
	          * @memberof AxAreaHelper
	          */
	         register: function register(localAreaName, element) {
	            (0, _assert2.default)(localAreaName).hasType(String).isNotNull();
	            (0, _assert2.default)(element).hasType(Object).isNotNull();
	            var areaHelper = pageService.controller().areaHelper();
	            deregisterFuncs.push(areaHelper.register(qualify(localAreaName), element));
	         },
	         release: function release() {
	            deregisterFuncs.forEach(function (_) {
	               _();
	            });
	         }
	      };
	
	      function qualify(localAreaName) {
	         return widgetId + '.' + localAreaName;
	      }
	
	      function unqualify(fullAreaName) {
	         return fullAreaName.slice(widgetId.length + 1);
	      }
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function createAssetsServiceForWidget(widgetName) {
	      var widgetArtifacts = artifactProvider.forWidget(widgetName);
	
	      /**
	       * _Note:_ This service is a function with the {@link #AxAssets.url()}, {@link #AxAssets.forTheme()} and
	       * {@link #AxAssets.urlForTheme()} functions as properties.
	       *
	       * Resolves an asset located directly in the widget folder or a subfolder of it.
	       * Valid assets are all non-binary files like JSON or text files.
	       * For binary files there exists the {@link #AxAssets.url} function.
	       *
	       * Example:
	       * ```
	       * function Controller( axAssets ) {
	       *    axAssets( 'data.json' ).then( fileContent => { ... } );
	       * }
	       * ```
	       *
	       * @param {String} name
	       *    name of the asset to resolve
	       *
	       * @return {Promise}
	       *    promise for the asset
	       *
	       * @name AxAssets
	       */
	      var assetService = function assetService(name) {
	         return widgetArtifacts.asset(name);
	      };
	
	      /**
	       * Resolves the absolute url to the given asset located directly in the widget folder or a subfolder of
	       * it.
	       * This can then be safely used in e.g. `video` or `img` tags.
	       *
	       * Example:
	       * ```
	       * function Controller( axAssets ) {
	       *    axAssets.url( 'tux.jpg' ).then( url => { img.src = url; } );
	       * }
	       * ```
	       *
	       * @param  {String} name
	       *    name of the asset the url should be returned of
	       *
	       * @return {Promise}
	       *    promise for the url
	       *
	       * @memberof AxAssets
	       */
	      assetService.url = function (name) {
	         return widgetArtifacts.assetUrl(name);
	      };
	
	      /**
	       * Resolves an asset from one of the `*.theme` subfolders of the widget.
	       * The folder from which the asset is taken, depends on the selected theme and the availability of the
	       * file within that theme (See
	       * [here](http://laxarjs.org/docs/laxar-latest/manuals/creating_themes/#how-the-runtime-finds-css) for
	       * further information on theme asset lookup).
	       * Valid assets are all non-binary files like JSON or text files.
	       * For binary files there exists the {@link #AxAssets.urlForTheme} function.
	       *
	       * Example:
	       * ```
	       * function Controller( axAssets ) {
	       *    axAssets.forTheme( 'some-template.html' ).then( template => { ... } );
	       * }
	       * ```
	       *
	       * @param {String} name
	       *    name of the asset to resolve
	       *
	       * @return {Promise}
	       *    promise for the asset
	       *
	       * @memberof AxAssets
	       */
	      assetService.forTheme = function (name) {
	         return widgetArtifacts.assetForTheme(name);
	      };
	
	      /**
	       * Resolves the absolute url to the given asset from one of the `*.theme` subfolders of the widget.
	       * This can then be safely used in e.g. `video` or `img` tags.
	       * The folder from which the asset is taken, depends on the selected theme and the availability of the
	       * file within that theme (See
	       * [here](http://laxarjs.org/docs/laxar-latest/manuals/creating_themes/#how-the-runtime-finds-css) for
	       * further information on theme asset lookup).
	       *
	       * Example:
	       * ```
	       * function Controller( axAssets ) {
	       *    axAssets.urlForTheme( 'icon.jpg' ).then( url => { img.src = url; } );
	       * }
	       * ```
	       *
	       * @param  {String} name
	       *    name of the asset the url should be returned of
	       *
	       * @return {Promise}
	       *    promise for the url
	       *
	       * @memberof AxAssets
	       */
	      assetService.urlForTheme = function (name) {
	         return widgetArtifacts.assetUrlForTheme(name);
	      };
	      return assetService;
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function createLoggerForWidget(logger, widgetName, widgetId) {
	      var newLogger = Object.create(logger);
	      newLogger.log = function (level, message) {
	         for (var _len = arguments.length, rest = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
	            rest[_key - 2] = arguments[_key];
	         }
	
	         return logger.log.apply(logger, [level, enrich(message)].concat(rest, [_log.BLACKBOX]));
	      };
	      Object.keys(logger.levels).map(function (_) {
	         return _.toLowerCase();
	      }).forEach(function (method) {
	         newLogger[method] = function (message) {
	            for (var _len2 = arguments.length, rest = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	               rest[_key2 - 1] = arguments[_key2];
	            }
	
	            return logger[method].apply(logger, [enrich(message)].concat(rest, [_log.BLACKBOX]));
	         };
	      });
	      return newLogger;
	
	      function enrich(message) {
	         return widgetName + ': ' + message + ' (widget-id: ' + widgetId + ')';
	      }
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function createStorageForWidget(storage, widgetId) {
	      var namespace = 'widget-' + widgetId;
	
	      /**
	       * Ready to use storage API for a single widget instance.
	       * All keys are namespaced by the widget id to limit visibility to this specific instance.
	       *
	       * @name AxStorage
	       * @constructor
	       */
	      return {
	         /**
	          * An instance of the storage api using the persistent `window.localStorage`.
	          *
	          * @type {StorageApi}
	          * @memberof AxStorage
	          */
	         local: storage.getLocalStorage(namespace),
	
	         /**
	          * An instance of the storage api using the non-persistent `window.sessionStorage`.
	          *
	          * @type {StorageApi}
	          * @memberof AxStorage
	          */
	         session: storage.getSessionStorage(namespace)
	      };
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function createIdGeneratorForWidget(widgetId) {
	      var charCodeOfA = 'a'.charCodeAt(0);
	      function fixLetter(l) {
	         // We map invalid characters deterministically to valid lower case letters. Thereby a collision of
	         // two IDs with different invalid characters at the same positions is less likely to occur.
	         return String.fromCharCode(charCodeOfA + l.charCodeAt(0) % 26);
	      }
	
	      var prefix = 'ax' + ID_SEPARATOR + widgetId.replace(INVALID_ID_MATCHER, fixLetter) + ID_SEPARATOR;
	      return function (localId) {
	         return prefix + ('' + localId).replace(INVALID_ID_MATCHER, fixLetter);
	      };
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function createEventBusForWidget(eventBus, widgetName, widgetId) {
	
	      var collaboratorId = 'widget.' + widgetName + '#' + widgetId;
	      var inspectorRemoveFunctions = [];
	      var unsubscribeFunctions = [];
	
	      /**
	       * This is an extension of the global {@link event_bus#EventBus EventBus} by widget specific information
	       * and tasks.
	       * For example a combination of the widget's name and its id is always used as subscriber and sender
	       * id.
	       * Hence for example {@link event_bus#EventBus.publishAndGatherReplies EventBus.publishAndGatherReplies}
	       * works without passing in any options.
	       *
	       * Additionally all subscriptions of a widget are removed as soon as the widget itself is destroyed.
	       * So in practice a widget will receive no further events after the `endLifecycleRequest` event
	       * processing has finished.
	       *
	       * The documentation for the events bus api can be found {@linkplain event_bus here}.
	       *
	       * @name AxEventBus
	       * @constructor
	       */
	      return {
	         addInspector: function addInspector(inspector) {
	            return makeAutoRemovable(inspectorRemoveFunctions, eventBus.addInspector(inspector));
	         },
	         unsubscribe: function unsubscribe(subscriber) {
	            return eventBus.unsubscribe(subscriber);
	         },
	         subscribe: function subscribe(eventName, subscriber, optionalOptions) {
	            var options = Object.assign({}, optionalOptions, { subscriber: collaboratorId });
	            var unsubscribe = eventBus.subscribe(eventName, subscriber, options);
	
	            return makeAutoRemovable(unsubscribeFunctions, unsubscribe);
	         },
	         publish: function publish(eventName, optionalEvent, optionalOptions) {
	            var options = Object.assign({}, optionalOptions, { sender: collaboratorId });
	            return eventBus.publish(eventName, optionalEvent, options);
	         },
	         publishAndGatherReplies: function publishAndGatherReplies(eventName, optionalEvent, optionalOptions) {
	            var options = Object.assign({}, optionalOptions, { sender: collaboratorId });
	            return eventBus.publishAndGatherReplies(eventName, optionalEvent, options);
	         },
	         release: function release() {
	            purgeAutoRemoveRegistries(inspectorRemoveFunctions, unsubscribeFunctions);
	         }
	      };
	
	      ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	      function makeAutoRemovable(registry, removeFunction) {
	         registry.push(removeFunction);
	         return function () {
	            removeFunction();
	            var index = registry.indexOf(removeFunction);
	            if (index !== -1) {
	               registry.splice(index, 1);
	            }
	         };
	      }
	
	      ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	      function purgeAutoRemoveRegistries() {
	         for (var _len3 = arguments.length, registries = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
	            registries[_key3] = arguments[_key3];
	         }
	
	         registries.forEach(function (registry) {
	            registry.forEach(function (_) {
	               _();
	            });
	            registry.length = 0;
	         });
	      }
	   }
	}

/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /**
	                                                                                                                                                                                                                                                                               * Copyright 2016 aixigo AG
	                                                                                                                                                                                                                                                                               * Released under the MIT license.
	                                                                                                                                                                                                                                                                               * http://laxarjs.org/license
	                                                                                                                                                                                                                                                                               */
	
	/**
	 * Factory for i18n widget service instances.
	 *
	 * @module widget_services_i18n
	 */
	
	
	exports.create = create;
	
	var _assert = __webpack_require__(38);
	
	var _assert2 = _interopRequireDefault(_assert);
	
	var _object = __webpack_require__(39);
	
	var _string = __webpack_require__(40);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var noDeliveryToSender = { deliverToSender: false };
	
	var primitives = {
	   string: true,
	   number: true,
	   boolean: true
	};
	
	var normalize = memoize(function (languageTag) {
	   return languageTag.toLowerCase().replace(/[_]/g, '-');
	});
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Creates a widget-specific helper for `didChangeLocale` events.
	 *
	 * @param {AxContext} context
	 *    the widget context/scope that the handler should work with. It uses the `eventBus` property there
	 *    with which it can do the event handling. The i18n service may be asked to `track` more context
	 *    properties `i18n`, an object that maps each locale to its current language tag.
	 * @param {Object} [optionalOptions]
	 *    the fallback language tag to use when no localization is available for a locale's current language tag
	 * @param {String} [optionalOptions.fallback]
	 *    the fallback language tag to use when no localization is available for a locale's current language tag
	 * @param {Boolean} [optionalOptions.strict]
	 *    if `true`, localizations are only used if the language tags exactly match the current locale's tag
	 *    (after normalizing case and dash/underscore). If `false` (default), specific requests can be satisfied
	 *    by general localizations (e.g. a translation for 'en' may be used when missing 'en_GB' was requested).
	 *
	 * @return {AxI18n}
	 *    an i18n instance
	 */
	function create(context) {
	   var optionalOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	   var features = context.features,
	       eventBus = context.eventBus;
	   var _optionalOptions$fall = optionalOptions.fallback,
	       fallback = _optionalOptions$fall === undefined ? 'en' : _optionalOptions$fall,
	       _optionalOptions$stri = optionalOptions.strict,
	       strict = _optionalOptions$stri === undefined ? false : _optionalOptions$stri;
	
	   var handlers = {};
	   var tags = {};
	   var callbacks = {};
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   var release = eventBus.subscribe('didChangeLocale', handleLocaleChange);
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   /**
	    * An i18n instance allows to create {@link #AxI18nHandler} instances for any feature, but is itself also
	    * an i18n handler for the feature `i18n`.
	    * So if the widget using the {@link widget_services#axI18n axI18n} injection does use the recommended
	    * name `i18n` for the localization feature, use this directly with the i18n handler API.
	    *
	    * @constructor
	    * @name AxI18n
	    */
	   return Object.assign({
	      forFeature: forFeature,
	      release: release
	   }, forFeature('i18n'));
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   /**
	    * Creates and returns an i18n handler for the loclization configuration under the given
	    * [feature path](../glossary#feature-path).
	    * The value is expected to be an object with the key `locale` that is configured with the locale to use
	    * in the widget instance.
	    *
	    * @param {String} featurePath
	    *    the feature path localization configuration can be found at
	    *
	    * @return {AxI18nHandler}
	    *    the i18n handler for the given feature path
	    *
	    * @memberof AxI18n
	    */
	   function forFeature(featurePath) {
	      (0, _assert2.default)(featurePath).hasType(String).isNotNull();
	      if (handlers[featurePath]) {
	         return handlers[featurePath];
	      }
	
	      ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	      /**
	       * @constructor
	       * @name AxI18nHandler
	       */
	      var api = {
	         format: format,
	         languageTag: languageTag,
	
	         /**
	          * Localize the given internationalized object using the given languageTag.
	          *
	          * If i18n is configured to be _strict_, the currently active language tag is used to lookup a
	          * translation.
	          * If nothing is found, the `languageTag` argument is tried.
	          * If still nothing is found, `undefined` is returned.
	          *
	          * In the case _strict_ is set to `false`, the behavior is the same as in _strict_ mode if an exact
	          * localization is available.
	          * If not, the language tag is successively generalized by stripping off the rightmost sub-tags
	          * until a localization is found.
	          * Eventually, a fallback (default: 'en') is used.
	          * This behavior is especially useful for controls (such as a datepicker), where we cannot
	          * anticipate all required language tags, as they may be app-specific.
	          *
	          * @param {*} i18nValue
	          *    a possibly internationalized value:
	          *    - when passing a primitive value, it is returned as-is
	          *    - when passing an object, the languageTag is used as a key within that object
	          * @param {*} [optionalFallbackValue]
	          *    a value to use if no localization is available for the given language tag
	          * @param {String} [languageTag]
	          *    a language tag to override the current locale tag. Only available in _strict_ mode
	          *
	          * @return {*}
	          *    the localized value if found, the fallback (or `undefined`) otherwise
	          *
	          * @memberof AxI18nHandler
	          * @name localize
	          */
	         localize: strict ? localizeStrict : localizeRelaxed,
	         track: track,
	         update: update,
	         whenLocaleChanged: whenLocaleChanged
	      };
	      handlers[featurePath] = api;
	      var locale = (0, _object.path)(features, featurePath + '.locale');
	      (0, _assert2.default)(locale).hasType(String).isNotNull('axI18n: missing feature-configuration \'' + featurePath + '.locale\' (widget: ' + context.widget.id + ')');
	      return api;
	
	      ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	      /**
	       * Updates the language tag for the configured locale by emitting the according `changeLocaleRequest`
	       * event.
	       *
	       * @param {String} languageTag
	       *    the language tag to propagate
	       *
	       * @return {Promise}
	       *    the promise of the event cycle
	       *
	       * @memberof AxI18nHandler
	       */
	      function update(languageTag) {
	         return eventBus.publishAndGatherReplies('changeLocaleRequest.' + locale, {
	            locale: locale,
	            languageTag: languageTag
	         }, noDeliveryToSender).then(function () {
	            tags[locale] = languageTag;
	         });
	      }
	
	      ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	      /**
	       * Returns the language tag set for the configured locale.
	       * If no tag is available, `undefined` is returned.
	       *
	       * @return {String}
	       *    the active language tag or `undefined`
	       *
	       * @memberof AxI18nHandler
	       */
	      function languageTag() {
	         return tags[locale];
	      }
	
	      ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	      /**
	       * Tracks the current i18n state under the given property.
	       * This includes the current locale and the currently valid tag for this locale.
	       *
	       * @param {Boolean} [enabled=true]
	       *    if `true`, tracking is enabled
	       * @param {*} [property=featurePath]
	       *    name of the context property to store the state at
	       *
	       * @memberof AxI18nHandler
	       */
	      function track() {
	         var enabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	         var property = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : featurePath;
	
	         if (enabled && property) {
	            (0, _object.setPath)(context, property, { locale: locale, tags: tags });
	         }
	      }
	
	      ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	      /**
	       * Format an i18n value, by first localizing it and then applying substitutions.
	       *
	       * These are equivalent:
	       * - `string.format( axI18n.localize( i18nValue ), numericArgs, namedArgs )`
	       * - `axI18n.format( i18nValue, numericArgs, namedArgs )`.
	       *
	       * @param {String} i18nValue
	       *    the value to localize and then format
	       * @param {Array} [optionalIndexedReplacements]
	       *    replacements for any numeric placeholders in the localized value
	       * @param {Object} [optionalNamedReplacements]
	       *    replacements for any named placeholders in the localized value
	       *
	       * @return {String}
	       *    the formatted string after localization
	       *
	       * @memberof AxI18nHandler
	       */
	      function format(i18nValue, optionalIndexedReplacements, optionalNamedReplacements) {
	         var formatString = api.localize(i18nValue);
	         return formatString && (0, _string.format)(formatString, optionalIndexedReplacements, optionalNamedReplacements);
	      }
	
	      ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	      /**
	       * Registers a callback that is called whenever the new valid locale was received via event.
	       *
	       * @param {Function} callback
	       *    the function to call on locale change
	       *
	       * @memberof AxI18nHandler
	       */
	      function whenLocaleChanged(callback) {
	         callbacks[locale] = callbacks[locale] || [];
	         callbacks[locale].push(callback);
	      }
	
	      ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	      function localizeRelaxed(i18nValue, optionalFallbackValue) {
	         if (!i18nValue || primitives[typeof i18nValue === 'undefined' ? 'undefined' : _typeof(i18nValue)]) {
	            // value is not internationalized
	            return i18nValue;
	         }
	
	         var tag = tags[locale];
	         var tagParts = tag ? tag.replace(/-/g, '_').split('_') : [];
	         while (tagParts.length > 0) {
	            var currentLocaleTag = tagParts.join('-');
	            var value = localizeStrict(i18nValue, undefined, currentLocaleTag);
	            if (value !== undefined) {
	               return value;
	            }
	            tagParts.pop();
	         }
	
	         return fallback ? localizeStrict(i18nValue, optionalFallbackValue, fallback) : optionalFallbackValue;
	      }
	
	      ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	      function localizeStrict(i18nValue, optionalFallbackValue) {
	         var languageTag = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : tags[locale];
	
	         if (!i18nValue || primitives[typeof i18nValue === 'undefined' ? 'undefined' : _typeof(i18nValue)]) {
	            // Value is not i18n
	            return i18nValue;
	         }
	         if (!languageTag) {
	            return optionalFallbackValue;
	         }
	
	         // Try one direct lookup before scanning the input keys,
	         // assuming that language-tags are written in consistent style.
	         var value = i18nValue[languageTag];
	         if (value !== undefined) {
	            return value;
	         }
	
	         var lookupKey = normalize(languageTag);
	         var availableTags = Object.keys(i18nValue);
	         var n = availableTags.length;
	         for (var i = 0; i < n; ++i) {
	            var t = availableTags[i];
	            if (normalize(t) === lookupKey) {
	               return i18nValue[t];
	            }
	         }
	
	         return optionalFallbackValue;
	      }
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function handleLocaleChange(_ref) {
	      var locale = _ref.locale,
	          languageTag = _ref.languageTag;
	
	      var newTag = normalize(languageTag);
	      if (newTag === tags[locale]) {
	         return;
	      }
	      tags[locale] = newTag;
	      callbacks[locale] = callbacks[locale] || [];
	      callbacks[locale].forEach(function (f) {
	         f(languageTag);
	      });
	   }
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function memoize(f) {
	   var cache = {};
	   return function (key) {
	      var value = cache[key];
	      if (value === undefined) {
	         value = f(key);
	         cache[key] = value;
	      }
	      return value;
	   };
	}

/***/ },
/* 77 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	exports.create = create;
	/**
	 * Copyright 2016 aixigo AG
	 * Released under the MIT license.
	 * http://laxarjs.org/license
	 */
	
	/**
	 * Factory for i18n widget service instances.
	 *
	 * @module widget_services_visibility
	 */
	
	// <-- temporary guard until https://github.com/LaxarJS/laxar-dox/issues/21 is fixed
	var noDeliveryToSender = { deliverToSender: false };
	var noOp = function noOp() {};
	
	/**
	 * Creates a widget-specific helper for `didChangeAreaVisibility` events.
	 *
	 * @param {AxContext} context
	 *    the widget context/scope that the handler should work with. It uses the `eventBus` property there
	 *    with which it can do the event handling. The visibility handler will set the boolean context property
	 *    `isVisible` which can be used to determine the visibility state of the entire widget, e.g. for use in
	 *    templates.
	 *
	 * @param {AxAreaHelper} areaHelper
	 *    an area helper to qualify/unqualify names for this widget's areas
	 *
	 * @return {AxVisibility}
	 *    a visibility handler instance
	 */
	function create(context, areaHelper) {
	
	   /**
	    *
	    *
	    * @constructor
	    * @name AxVisibility
	    */
	   var api = {
	      onChange: onChange,
	      onHide: onHide,
	      onShow: onShow,
	      release: release,
	      track: track,
	      unsubscribe: unsubscribe,
	      updateAreaVisibility: updateAreaVisibility,
	      updateWidgetVisibility: updateWidgetVisibility
	   };
	
	   var eventBus = context.eventBus;
	
	   // reading the widget visibility
	
	   var isVisible = false;
	   var trackingProperty = void 0;
	   var showListeners = [];
	   var hideListeners = [];
	   var unsubscribeToChanges = noOp;
	
	   // controlling the visibility of the widget and its areas
	   var visibilityByArea = {};
	   var overrideByArea = {};
	   var unsubscribeToAreaRequests = noOp;
	
	   return api;
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   /**
	    * Registers a callback to be run when this widget becomes hidden.
	    *
	    * @param {Function} callback
	    *    a callback to be invoked whenever the widget becomes visible, with a boolean argument indicating
	    *    the new visibility state (`false`). The callback will *not* be invoked for the start value (`false`).
	    *
	    * @return {AxVisibility}
	    *    this instance for chaining
	    *
	    * @memberof AxVisibility
	    */
	   function onHide(callback) {
	      hideListeners.push(callback);
	      updateChangeSubscription();
	      return api;
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   /**
	    * Registers a callback to be run when this widget becomes visbile.
	    *
	    * @param {Function} callback
	    *    a callback to be invoked whenever the widget becomes visible, with a boolean argument indicating
	    *    the new visibility state (`true`).
	    *
	    * @return {AxVisibility}
	    *    this instance for chaining
	    *
	    * @memberof AxVisibility
	    */
	   function onShow(callback) {
	      showListeners.push(callback);
	      updateChangeSubscription();
	      return api;
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   /**
	    * Registers a callback for changes to this widget's visibility.
	    *
	    * @param {Function} callback
	    *    a callback to be invoked whenever the widget visibility changes, with a boolean argument indicating
	    *    the new visibility state. The callback will *not* be invoked for the start value (`false`).
	    *
	    * @return {AxVisibility}
	    *    this instance for chaining
	    *
	    * @memberof AxVisibility
	    */
	   function onChange(callback) {
	      showListeners.push(callback);
	      hideListeners.push(callback);
	      updateChangeSubscription();
	      return api;
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   /**
	    * Starts tracking visibility as a property on the context.
	    *
	    * @param {Boolean} enabled
	    *    If `true` (default) an event bus subscription will be maintained to track visibility changes of the
	    *    current widget by updating a managed property on the context. If `false`, any existing subscription
	    *    will be cancelled. If set, the context property will *not* be removed.
	    * @param {String} property
	    *    The name of the context property to maintain. Changing the property name after tracking has started
	    *    once will not remove previously created properties.
	    *
	    * @return {AxVisibility}
	    *    this instance for chaining
	    *
	    * @memberof AxVisibility
	    */
	   function track() {
	      var enabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	      var property = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'isVisible';
	
	      trackingProperty = enabled ? property : null;
	      if (enabled) {
	         context[trackingProperty] = isVisible;
	      }
	      updateChangeSubscription();
	      return api;
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   /**
	    * Triggers a visibility change to the given area. The visibility of the area and its nested areas is
	    * re-evaluated over the event bus. Use this to implement e.g. tabbing/accordion/expander widgets.
	    *
	    * @param {Object} visibilityByLocalArea
	    *   A mapping of local area names (without the widget ID) to their new visibility state (Boolean).
	    *   Areas that are omitted here are left as is. Areas that have not been set at all just assume the
	    *   visibility state of the containing area.
	    * @param {Object} [optionalOptions]
	    *   Additional options
	    * @param {Object} [optionalOptions.overrideContainer]
	    *   Allows the specified areas to become visible even if the widget's container area is not visible.
	    *
	    * @return {Promise}
	    *    a promise that is resolved (without a value) when the visibility change was applied
	    *
	    * @memberof AxVisibility
	    */
	   function updateAreaVisibility(visibilityByLocalArea) {
	      var optionalOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	      var _optionalOptions$over = optionalOptions.overrideContainer,
	          overrideContainer = _optionalOptions$over === undefined ? false : _optionalOptions$over;
	
	
	      if (unsubscribeToAreaRequests === noOp) {
	         var requestEvent = 'changeAreaVisibilityRequest.' + context.widget.id;
	         unsubscribeToAreaRequests = eventBus.subscribe(requestEvent, responder(isAreaVisible));
	      }
	
	      var promises = Object.keys(visibilityByLocalArea).map(function (name) {
	         var oldVisible = visibilityByArea[name];
	         var oldOverride = overrideByArea[name];
	         var visible = visibilityByArea[name] = visibilityByLocalArea[name];
	         if (overrideContainer) {
	            overrideByArea[name] = overrideContainer;
	         } else if (oldOverride) {
	            delete overrideByArea[name];
	         }
	         if (oldVisible !== visible || oldOverride !== overrideByArea[name]) {
	            var area = areaHelper.fullName(name);
	            var eventName = 'changeAreaVisibilityRequest.' + area + '.' + visible;
	            return eventBus.publishAndGatherReplies(eventName, { area: area, visible: visible }, noDeliveryToSender);
	         }
	         return Promise.resolve();
	      });
	
	      return Promise.all(promises).then(noOp);
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   /* @private helper for updateAreaVisibility */
	   function isAreaVisible(localAreaName, containerVisible) {
	      var areaVisible = visibilityByArea[localAreaName];
	      if (areaVisible === undefined) {
	         return containerVisible;
	      }
	      return areaVisible && (containerVisible || overrideByArea[localAreaName]);
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   /**
	    * Triggers a visibility change the widget itself and all its areas, always overriding its container
	    * visibility with the given value.
	    * This simplifies implementing popup/popover/layer widgets, which always live in an invisible container
	    * area, but need to show/hide all their owned areas.
	    *
	    * To control the visibility of individual areas, use #updateAreaVisibility
	    *
	    * @param {Boolean} visible
	    *   The new visibility state of the widget.
	    *
	    * @return {AxVisibility}
	    *    this instance for chaining
	    *
	    * @memberof AxVisibility
	    */
	   function updateWidgetVisibility(visible) {
	      var widget = context.widget.id;
	      var eventName = 'changeWidgetVisibilityRequest.' + widget + '.' + visible;
	      return eventBus.publishAndGatherReplies(eventName, { widget: widget, visible: visible }, noDeliveryToSender);
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   /**
	    * Remove the given callback (registered through one or more of the on... methods) from any subscriptions.
	    *
	    * @param {Function} callback
	    *    a callback that was previously registered using any of the `on...` methods.
	    *    It will be removed from all registrations. Passing an unknown callback has no effect.
	    *
	    * @return {AxVisibility}
	    *    this instance for chaining
	    *
	    * @memberof AxVisibility
	    */
	   function unsubscribe(callback) {
	      [showListeners, hideListeners].forEach(remove);
	
	      function remove(array) {
	         var index = array.indexOf(callback);
	         if (index === -1) {
	            return;
	         }
	         array.splice(index, 1);
	         remove(array);
	      }
	      return api;
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function release() {
	      unsubscribeToAreaRequests();
	      unsubscribeToChanges();
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function updateChangeSubscription() {
	      var needsSubscription = trackingProperty || showListeners.length + hideListeners.length;
	      if (needsSubscription && unsubscribeToChanges === noOp) {
	         unsubscribeToChanges = eventBus.subscribe('didChangeAreaVisibility.' + context.widget.area, function (_ref) {
	            var visible = _ref.visible;
	
	            if (visible === isVisible) {
	               return;
	            }
	            isVisible = visible;
	            if (trackingProperty) {
	               context[trackingProperty] = visible;
	            }
	            (visible ? showListeners : hideListeners).forEach(function (f) {
	               return f(visible);
	            });
	         });
	      } else if (unsubscribeToChanges && !needsSubscription) {
	         unsubscribeToChanges();
	         unsubscribeToChanges = noOp;
	      }
	   }
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   function responder(callback) {
	      return function (_ref2) {
	         var area = _ref2.area,
	             containerVisible = _ref2.visible;
	
	         var visible = callback(areaHelper.localName(area), containerVisible);
	         if (visible === true || visible === false) {
	            var didEvent = 'didChangeAreaVisibility.' + area + '.' + visible;
	            eventBus.publish(didEvent, { area: area, visible: visible }, noDeliveryToSender);
	         }
	      };
	   }
	}

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	exports.createCollectors = createCollectors;
	exports.createProviders = createProviders;
	
	var _pages = __webpack_require__(60);
	
	// eslint-disable-next-line valid-jsdoc
	/** Collects inspection data from laxarjs services */
	function createCollectors(configuration, log) {
	   return {
	      pages: (0, _pages.createCollector)(configuration, log)
	   };
	}
	
	// eslint-disable-next-line valid-jsdoc
	/** Exposes inspection data from laxarjs services to development tools */
	/**
	 * Copyright 2016 aixigo AG
	 * Released under the MIT license.
	 * http://laxarjs.org/license
	 */
	/**
	 * Accepts and keeps laxarjs application data from various laxarjs services, and makes it available to
	 * development tools.
	 *
	 * This module has an internal API (the `collectors`-service), and an external API (the `providers` service).
	 * The collectors service is fed data by the other laxarjs services, while the provider allows external
	 * listeners to subscribe to that data's changes, or to retrieve snapshots of it.
	 */
	
	function createProviders(collectors) {
	   return {
	      pages: (0, _pages.createProvider)(collectors.pages)
	   };
	}

/***/ },
/* 79 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	   value: true
	});
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	exports.bootstrap = bootstrap;
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	/**
	 * Copyright 2016 aixigo AG
	 * Released under the MIT license.
	 * http://laxarjs.org/license
	 */
	/**
	 * Module for the plain widget adapter factory.
	 * In LaxarJS _plain_ widgets are defined as widgets without dependency to a specific view library or
	 * framwork, and instead would be implemented using simple DOM access and manipulation.
	 *
	 * A developer will never call any of the API of this module.
	 * The documentation solely exists as a blueprint for custom widget adapters and to explain certain concepts.
	 *
	 * @module plain_adapter
	 */
	
	var technology = exports.technology = 'plain';
	
	var noOp = function noOp() {};
	
	//////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/**
	 * Initializes the adapter module and returns a factory for plain widgets.
	 * Note that the plain adapter doesn't need all the provided arguments, but they are listed here for
	 * documentation purposes.
	 *
	 * @param {Object} artifacts
	 *    the artifacts available to this adapter factory
	 * @param {Object} artifacts.widgets
	 *    all widgets, that are implemented in the adapter's technology
	 * @param {Object} artifacts.controls
	 *    all controls, that are implemented in the adapter's technology
	 * @param {Object} services
	 *    a selection of services adapter implementations may need to fulfill their task
	 * @param {AdapterUtilities} services.adapterUtilities
	 *    common utilities, that may be useful to a widget adapter
	 * @param {ArtifactProvider} services.artifactProvider
	 *    the artifact provider instance
	 * @param {Configuration} services.configuration
	 *    access to the application configuration
	 * @param {EventBus} services.globalEventBus
	 *    the global event bus.
	 *    Note that an adapter should not sent any events by itself.
	 *    It may instead be necessary that the adapter makes the event bus globally available to its widgets (for
	 *    example like the AngularJS 1.x adapter), or that it registers an inspector
	 * @param {Heartbeat} services.heartbeat
	 *    the heartbeat instance.
	 *    Depending on the underlying view technology (like AngularJS 1.x) it may be important to get notified
	 *    when to re-render the user interface.
	 *    For that reason an adapter can register a callback at the heartbeat, that gets called after all events
	 *    of the current cycle were processed
	 * @param {Log} services.log
	 *    the global log instance
	 * @param {StorageFactory} services.storage
	 *    the global storage factory api
	 * @param {Tooling} services.tooling
	 *    access to the tooling api
	 * @param {HTMLElement} anchorElement
	 *    the DOM node the laxar application is bootstrapped on.
	 *    An adapter should never try to access DOM nodes that are not the `anchorElement` or any of its children,
	 *    since they are not under control of this LaxarJS application.
	 *
	 * @return {PlainAdapterFactory}
	 *    the factory for plain widget adapters
	 */
	function bootstrap(artifacts, _ref) {
	   var widgetLoader = _ref.widgetLoader,
	       artifactProvider = _ref.artifactProvider;
	   var adapterErrors = widgetLoader.adapterErrors;
	
	   /**
	    * A factory for plain widget adapters.
	    *
	    * @constructor
	    * @name PlainAdapterFactory
	    */
	
	   return {
	      create: create
	   };
	
	   ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	   /**
	    * Creates a new adapter instance for the given widget environment.
	    *
	    * @param {Object} environment
	    *    the environment for the widget to create and manage
	    * @param {HTMLElement} environment.anchorElement
	    *    the DOM node that the widget's DOM fragment should be inserted into
	    * @param {String} environment.name
	    *    the name of the widget to load, exactly as specified by the widget descriptor
	    * @param {widget_services} environment.services
	    *    the services for this widget instance
	    * @param {Function} environment.onBeforeControllerCreation
	    *    a function that the adapter must call with a map of all to-be-injected services, just before
	    *    creating the controller
	    *
	    * @return {Object}
	    *    the adapter instance
	    *
	    * @memberof PlainAdapterFactory
	    */
	   function create(_ref2) {
	      var widgetName = _ref2.widgetName,
	          anchorElement = _ref2.anchorElement,
	          services = _ref2.services,
	          onBeforeControllerCreation = _ref2.onBeforeControllerCreation;
	
	
	      var onDomAvailable = null;
	      var domAttached = false;
	
	      var provider = artifactProvider.forWidget(widgetName);
	
	      return Promise.all([provider.descriptor(), provider.module()]).then(createController, function () {
	         return adapterErrors.unknownWidget({ technology: technology, widgetName: widgetName });
	      }).then(function () {
	         return {
	            domAttachTo: domAttachTo,
	            domDetach: domDetach
	         };
	      });
	
	      ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	      function createController(_ref3) {
	         var _ref4 = _slicedToArray(_ref3, 2),
	             descriptor = _ref4[0],
	             module = _ref4[1];
	
	         services.axWithDom = function (callback) {
	            if (domAttached) {
	               callback(anchorElement);
	            }
	         };
	         var injections = (module.injections || []).map(function (injection) {
	            if (!(injection in services)) {
	               throw adapterErrors.unknownInjection({ technology: technology, injection: injection, widgetName: widgetName });
	            }
	            if (injection === 'axWithDom' && descriptor.integration.type === 'activity') {
	               throw adapterErrors.activityAccessingDom({ technology: technology, injection: injection, widgetName: widgetName });
	            }
	            return services[injection];
	         });
	
	         onBeforeControllerCreation(services);
	
	         var _ref5 = module.create.apply(module, _toConsumableArray(injections)) || {};
	
	         var _ref5$onDomAvailable = _ref5.onDomAvailable;
	         onDomAvailable = _ref5$onDomAvailable === undefined ? noOp : _ref5$onDomAvailable;
	      }
	
	      ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	      function domAttachTo(areaElement, htmlTemplate) {
	         if (htmlTemplate === null) {
	            return;
	         }
	         anchorElement.innerHTML = htmlTemplate;
	         areaElement.appendChild(anchorElement);
	         domAttached = true;
	         onDomAvailable(anchorElement);
	      }
	
	      ////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	      function domDetach() {
	         var parent = anchorElement.parentNode;
	         if (parent) {
	            parent.removeChild(anchorElement);
	         }
	         domAttached = false;
	      }
	   }
	}

/***/ }
/******/ ]);
//# sourceMappingURL=vendor.js.map