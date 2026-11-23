// node_modules/@verno.digital/moon-modal/dist/index.js
var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b ||= {})
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};
var getWidthScrollBar = () => {
  const div = document.createElement("div");
  div.style.overflow = "scroll";
  div.style.width = "50px";
  div.style.height = "50px";
  div.style.position = "absolute";
  div.style.pointerEvents = "none";
  document.body.append(div);
  const scrollWidth = div.offsetWidth - div.clientWidth;
  div.remove();
  return scrollWidth;
};
var widthScrollBar = getWidthScrollBar();
var showScrollBar = (cssVar) => {
  if (!document.documentElement.style.getPropertyValue(cssVar)) {
    return;
  }
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";
  document.documentElement.style.removeProperty(cssVar);
};
var hideScrollbar = (cssVar) => {
  document.body.style.overflow = "hidden";
  document.body.style.paddingRight = `${widthScrollBar}px`;
  document.documentElement.style.setProperty(cssVar, `${widthScrollBar}px`);
};
var removeClass = (el, className) => {
  el.classList.remove(className);
};
var addClass = (el, className) => {
  el.classList.add(className);
};
var dispatchEvent = (eventName, currentModal) => {
  currentModal.dispatchEvent(
    new CustomEvent(eventName, { bubbles: true, detail: { currentModal } })
  );
};
var getActiveClass = (modal, associated) => {
  for (const key in associated) {
    if (modal.classList.contains(key))
      return associated[key];
  }
  return void 0;
};
var isElement = (value) => {
  return value instanceof HTMLElement;
};
var getDom = (selector) => {
  const element = document.querySelector(selector);
  if (element) {
    return element;
  }
  throw Error(`\u042D\u043B\u0435\u043C\u043F\u0435\u043D\u0442 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D: ${selector}`);
};
var getEl = (value) => {
  return isElement(value) ? value : getDom(String(value));
};
var defaultOptions = {
  dispatch: {
    open: {
      start: "mm:open",
      transitionEnd: "mm:open:end"
    },
    close: {
      start: "mm:close",
      transitionEnd: "mm:close:end"
    }
  },
  cssVars: {
    sizeScrollBar: "--mm-scrollbar"
  },
  timeout: 200
};
var fillOptions = (options) => {
  return __spreadValues(__spreadValues({}, defaultOptions), options);
};
var _options;
var _state;
var _getActiveClass;
var getActiveClass_fn;
var _animationOpen;
var animationOpen_fn;
var _hotClose;
var hotClose_fn;
var _animationClose;
var animationClose_fn;
var _timeout;
var timeout_fn;
var _setIsAnimation;
var setIsAnimation_fn;
var _coldOpen;
var coldOpen_fn;
var _stateClose;
var stateClose_fn;
var _stateOpen;
var stateOpen_fn;
var MoonModal = class {
  constructor(options) {
    __privateAdd(this, _getActiveClass);
    __privateAdd(this, _animationOpen);
    __privateAdd(this, _hotClose);
    __privateAdd(this, _animationClose);
    __privateAdd(this, _timeout);
    __privateAdd(this, _setIsAnimation);
    __privateAdd(this, _coldOpen);
    __privateAdd(this, _stateClose);
    __privateAdd(this, _stateOpen);
    __privateAdd(this, _options, void 0);
    __privateAdd(this, _state, void 0);
    __privateSet(this, _options, fillOptions(options));
    __privateSet(this, _state, {
      overlay: getEl(options.overlay.el),
      active: void 0,
      prev: void 0,
      isAnimation: false
    });
  }
  open(el, options) {
    const { hidingScrollbar = true } = options != null ? options : {};
    if (__privateGet(this, _state).isAnimation) {
    }
    const domModal = getEl(el);
    __privateGet(this, _state).active ? __privateMethod(this, _hotClose, hotClose_fn).call(this) : __privateMethod(this, _coldOpen, coldOpen_fn).call(this, hidingScrollbar);
    __privateMethod(this, _animationOpen, animationOpen_fn).call(this, domModal);
    __privateMethod(this, _stateOpen, stateOpen_fn).call(this, domModal);
    dispatchEvent(__privateGet(this, _options).dispatch.open.start, domModal);
    return {
      current: __privateGet(this, _state).active,
      prev: __privateGet(this, _state).prev
    };
  }
  close() {
    if (!__privateGet(this, _state).active) {
      return;
    }
    __privateMethod(this, _animationClose, animationClose_fn).call(this);
    __privateMethod(this, _stateClose, stateClose_fn).call(this);
    dispatchEvent(__privateGet(this, _options).dispatch.close.start, __privateGet(this, _state).prev);
    return {
      current: __privateGet(this, _state).prev
    };
  }
  set timeout(value) {
    __privateGet(this, _options).timeout = value;
  }
  get info() {
    return {
      overlay: __privateGet(this, _state).overlay,
      active: __privateGet(this, _state).active,
      prev: __privateGet(this, _state).prev,
      timeout: __privateGet(this, _options).timeout
    };
  }
};
_options = /* @__PURE__ */ new WeakMap();
_state = /* @__PURE__ */ new WeakMap();
_getActiveClass = /* @__PURE__ */ new WeakSet();
getActiveClass_fn = function(modal) {
  const activeClass = getActiveClass(modal, __privateGet(this, _options).modal.associated);
  return activeClass != null ? activeClass : __privateGet(this, _options).modal.active;
};
_animationOpen = /* @__PURE__ */ new WeakSet();
animationOpen_fn = function(modal) {
  __privateMethod(this, _setIsAnimation, setIsAnimation_fn).call(this, true);
  addClass(modal, __privateMethod(this, _getActiveClass, getActiveClass_fn).call(this, modal));
  __privateMethod(this, _timeout, timeout_fn).call(this, () => {
    dispatchEvent(__privateGet(this, _options).dispatch.open.transitionEnd, modal);
    __privateMethod(this, _setIsAnimation, setIsAnimation_fn).call(this, false);
  });
};
_hotClose = /* @__PURE__ */ new WeakSet();
hotClose_fn = function() {
  const modal = __privateGet(this, _state).active;
  removeClass(modal, __privateMethod(this, _getActiveClass, getActiveClass_fn).call(this, modal));
  dispatchEvent(__privateGet(this, _options).dispatch.close.start, modal);
  __privateMethod(this, _timeout, timeout_fn).call(this, () => {
    dispatchEvent(__privateGet(this, _options).dispatch.close.transitionEnd, modal);
  });
};
_animationClose = /* @__PURE__ */ new WeakSet();
animationClose_fn = function() {
  const modal = __privateGet(this, _state).active;
  __privateMethod(this, _setIsAnimation, setIsAnimation_fn).call(this, true);
  removeClass(modal, __privateMethod(this, _getActiveClass, getActiveClass_fn).call(this, modal));
  removeClass(__privateGet(this, _state).overlay, __privateGet(this, _options).overlay.active);
  __privateMethod(this, _timeout, timeout_fn).call(this, () => {
    showScrollBar(__privateGet(this, _options).cssVars.sizeScrollBar);
    dispatchEvent(__privateGet(this, _options).dispatch.close.transitionEnd, modal);
    __privateMethod(this, _setIsAnimation, setIsAnimation_fn).call(this, false);
  });
};
_timeout = /* @__PURE__ */ new WeakSet();
timeout_fn = function(cb) {
  setTimeout(cb, __privateGet(this, _options).timeout);
};
_setIsAnimation = /* @__PURE__ */ new WeakSet();
setIsAnimation_fn = function(value) {
  __privateGet(this, _state).isAnimation = value;
};
_coldOpen = /* @__PURE__ */ new WeakSet();
coldOpen_fn = function(hidingScrollbar) {
  addClass(__privateGet(this, _state).overlay, __privateGet(this, _options).overlay.active);
  if (hidingScrollbar) {
    hideScrollbar(__privateGet(this, _options).cssVars.sizeScrollBar);
  }
};
_stateClose = /* @__PURE__ */ new WeakSet();
stateClose_fn = function() {
  __privateGet(this, _state).prev = __privateGet(this, _state).active;
  __privateGet(this, _state).active = void 0;
};
_stateOpen = /* @__PURE__ */ new WeakSet();
stateOpen_fn = function(modal) {
  __privateGet(this, _state).prev = __privateGet(this, _state).active;
  __privateGet(this, _state).active = modal;
};
