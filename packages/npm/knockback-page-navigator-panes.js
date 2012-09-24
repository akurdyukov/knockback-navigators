/*
  knockback-page-navigator-panes.js 0.1.1
  (c) 2011, 2012 Kevin Malakoff - http://kmalakoff.github.com/knockback/
  License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
(function() {
  return (function(factory) {
    // AMD
    if (typeof define === 'function' && define.amd) {
      return define('knockback-page-navigator-panes', factory);
    }
    // CommonJS/NodeJS or No Loader
    else {
      return factory.call(this);
    }
  })(function() {// Generated by CoffeeScript 1.3.3
var ACTIVE_CHECK_INTERVAL, bind, checkPanesForActivate, kb, ko, root, throwMissing, throwUnexpected, _;

throwMissing = function(instance, message) {
  throw "" + (_.isString(instance) ? instance : instance.constructor.name) + ": " + message + " is missing";
};

throwUnexpected = function(instance, message) {
  throw "" + (_.isString(instance) ? instance : instance.constructor.name) + ": " + message + " is unexpected";
};

try {
  this.kb = kb = !this.kb && (typeof require !== 'undefined') ? require('knockback') : this.kb;
} catch (e) {
  ({});
}

this.kb || (this.kb = kb || (kb = {}));

this.Backbone || (this.Backbone = this.kb.Backbone);

try {
  ko = !this.ko && (typeof require !== 'undefined') ? require('knockout') : this.ko;
} catch (e) {
  ({});
}

ko || (ko = {});

if (!ko.observable) {
  ko.dataFor = function(el) {
    return null;
  };
  ko.removeNode = function(el) {
    return $(el).remove();
  };
  ko.observable = function(initial_value) {
    var value;
    value = initial_value;
    return function(new_value) {
      if (arguments.length) {
        return value = new_value;
      } else {
        return value;
      }
    };
  };
  ko.observableArray = function(initial_value) {
    var observable;
    observable = ko.observable(arguments.length ? initial_value : []);
    observable.push = function() {
      return observable().push.apply(observable(), arguments);
    };
    observable.pop = function() {
      return observable().pop.apply(observable(), arguments);
    };
    return observable;
  };
}

_ = this._ ? this._ : (kb._ ? kb._ : {});

if (!_.bindAll) {
  bind = function(obj, fn_name) {
    var fn;
    fn = obj[fn_name];
    return obj[fn_name] = function() {
      return fn.apply(obj, arguments);
    };
  };
  _.bindAll = function(obj, fn_name1) {
    var fn_name, _i, _len, _ref;
    _ref = Array.prototype.slice.call(arguments, 1);
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      fn_name = _ref[_i];
      bind(obj, fn_name);
    }
  };
}

if (!_.isElement) {
  _.isElement = function(obj) {
    return obj && (obj.nodeType === 1);
  };
}

if (this.x$) {
  this.$ = this.x$;
}

kb.PageNavigatorPanes = (function() {

  function PageNavigatorPanes(el, options) {
    if (options == null) {
      options = {};
    }
    el || throwMissing(this, 'el');
    _.bindAll(this, 'hasHistory', 'activePage', 'previousPage', 'activeUrl', 'loadPage', 'goBack', 'dispatcher');
    this.el = el.length ? el[0] : el;
    $(this.el).addClass('page');
    this.pane_navigator = new kb.PaneNavigator(el, options);
  }

  PageNavigatorPanes.prototype.destroy = function() {
    this.destroyed = true;
    this.el = null;
    this.pane_navigator.destroy();
    return this.pane_navigator = null;
  };

  PageNavigatorPanes.prototype.hasHistory = function() {
    return !this.pane_navigator.no_history;
  };

  PageNavigatorPanes.prototype.activePage = function() {
    return this.pane_navigator.activePane();
  };

  PageNavigatorPanes.prototype.activeUrl = function() {
    var active_page;
    if ((active_page = this.pane_navigator.activePane())) {
      return active_page.url;
    } else {
      return null;
    }
  };

  PageNavigatorPanes.prototype.previousPage = function() {
    return this.pane_navigator.previousPane();
  };

  PageNavigatorPanes.prototype.previousUrl = function() {
    var previous_page;
    if ((previous_page = this.pane_navigator.previousPage())) {
      return previous_page.url;
    } else {
      return null;
    }
  };

  PageNavigatorPanes.prototype.loadPage = function(info) {
    var active_page, transition;
    info || throwMissing(this, 'page info');
    transition = kb.popOverrideTransition();
    if (this.activeUrl() === window.location.hash) {
      active_page = this.activePage();
      active_page.el || pane_navigator.ensureElement(active_page);
      if (active_page.el.parentNode !== this.el) {
        this.el.appendChild(active_page.el);
      }
      return active_page;
    }
    return this.pane_navigator.push(new kb.Pane(info, window.location.hash), transition ? {
      transition: transition
    } : null);
  };

  PageNavigatorPanes.prototype.goBack = function() {
    var active_page, transition;
    transition = kb.popOverrideTransition();
    this.pane_navigator.pop();
    !(active_page = this.pane_navigator.activePane()) || kb.loadUrl(active_page.url);
    return active_page;
  };

  PageNavigatorPanes.prototype.dispatcher = function(callback) {
    var page_navigator;
    page_navigator = this;
    return function() {
      page_navigator.destroyed || page_navigator.routeTriggered(this, callback, arguments);
    };
  };

  PageNavigatorPanes.prototype.routeTriggered = function(router, callback, args) {
    var active_page, previous_page, url;
    url = window.location.hash;
    if ((active_page = this.activePage()) && (active_page.url === window.location.hash)) {
      return this.loadPage(active_page);
    } else if ((previous_page = this.previousPage()) && (previous_page.url === url)) {
      return this.goBack();
    } else if (callback) {
      return callback.apply(router, args);
    }
  };

  return PageNavigatorPanes;

})();

if (typeof exports !== 'undefined') {
  exports.PageNavigatorPanes = kb.PageNavigatorPanes;
}

if (ko && ko.bindingHandlers) {
  ko.bindingHandlers['PageNavigatorPanes'] = {
    'init': function(element, value_accessor, all_bindings_accessor, view_model) {
      var options, page_navigator;
      options = ko.utils.unwrapObservable(value_accessor());
      if (!('no_remove' in options)) {
        options.no_remove = true;
      }
      page_navigator = new kb.PageNavigatorPanes(element, options);
      kb.utils.wrappedPageNavigator(element, page_navigator);
      ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
        if (typeof options.unloaded === "function") {
          options.unloaded(page_navigator);
        }
        return kb.utils.wrappedPageNavigator(element, null);
      });
      return typeof options.loaded === "function" ? options.loaded(page_navigator) : void 0;
    }
  };
}

root = this;

ACTIVE_CHECK_INTERVAL = 100;

checkPanesForActivate = function(pane_navigator) {
  var $pane_els, active_pane, parent_el;
  if (active_pane = pane_navigator.activePane()) {
    parent_el = active_pane.el.parentNode;
    while (parent_el && (parent_el !== pane_navigator.el)) {
      parent_el = parent_el.parentNode;
    }
    if (parent_el) {
      return;
    }
    pane_navigator.clear();
  }
  $pane_els = $(pane_navigator.el).children().filter('.pane');
  if ($pane_els.length) {
    return pane_navigator.push(new kb.Pane($pane_els[0]));
  }
};

kb.PaneNavigator = (function() {

  function PaneNavigator(el, options) {
    var key, value,
      _this = this;
    el || throwMissing(this, 'el');
    for (key in options) {
      value = options[key];
      this[key] = value;
    }
    this.panes = ko.observableArray();
    this.el = el && el.length ? el[0] : el;
    $(this.el).addClass('pane-navigator');
    this.interval = root.setInterval(function() {
      return checkPanesForActivate(_this);
    });
  }

  PaneNavigator.prototype.destroy = function() {
    root.clearInterval(this.interval);
    this.interval = null;
    this.el = null;
    return this.clear({
      silent: true
    });
  };

  PaneNavigator.prototype.clear = function(options) {
    var active_pane, array, pane, panes;
    if (options == null) {
      options = {};
    }
    this.cleanupTransition(true);
    if ((active_pane = this.activePane())) {
      active_pane.destroy(this);
    }
    array = this.panes();
    panes = array.slice();
    panes.pop();
    array.splice(0, array.length);
    while (pane = panes.pop()) {
      if (pane.el) {
        pane.destroy(this);
      }
    }
    if (!options.silent) {
      this.panes([]);
    }
    return this;
  };

  PaneNavigator.prototype.activePane = function() {
    return this.paneAt(-1);
  };

  PaneNavigator.prototype.previousPane = function() {
    return this.paneAt(-2);
  };

  PaneNavigator.prototype.paneAt = function(offset) {
    var index, panes;
    panes = this.panes();
    index = offset < 0 ? panes.length + offset : offset;
    if (index >= 0 && index < panes.length) {
      return panes[index];
    } else {
      return null;
    }
  };

  PaneNavigator.prototype.push = function(active_pane, options) {
    var clean_up_fn, cleaned_up, previous_pane,
      _this = this;
    if (options == null) {
      options = {};
    }
    if (!active_pane) {
      return;
    }
    this.cleanupTransition(true);
    if ('transition' in options) {
      active_pane.transition = options.transition;
    }
    active_pane.ensureElement(this.el);
    if (options.silent) {
      this.panes().push(active_pane);
    } else {
      this.panes.push(active_pane);
    }
    previous_pane = this.previousPane();
    cleaned_up = false;
    clean_up_fn = function() {
      var panes;
      if (cleaned_up) {
        return;
      }
      cleaned_up = true;
      _this.cleanupTransition();
      if (previous_pane) {
        if (_this.no_history) {
          panes = _this.panes();
          panes.splice(_.indexOf(panes, previous_pane), 1);
          return previous_pane.destroy(_this);
        } else {
          return previous_pane.deactivate(_this);
        }
      }
    };
    if (active_pane && (active_pane.transition || this.transition)) {
      this.startTransition(active_pane, previous_pane, clean_up_fn, true);
      active_pane.activate(this.el);
    } else {
      active_pane.activate(this.el);
      clean_up_fn();
    }
    return active_pane;
  };

  PaneNavigator.prototype.pop = function(options) {
    var active_pane, clean_up_fn, cleaned_up, previous_pane,
      _this = this;
    if (options == null) {
      options = {};
    }
    previous_pane = this.previousPane();
    if (!previous_pane) {
      return null;
    }
    previous_pane.ensureElement();
    this.cleanupTransition(true);
    active_pane = this.activePane();
    if ('transition' in options) {
      active_pane.transition = options.transition;
    }
    this.panes.pop();
    cleaned_up = false;
    clean_up_fn = function() {
      if (cleaned_up) {
        return;
      }
      cleaned_up = true;
      _this.cleanupTransition();
      if (active_pane) {
        return active_pane.destroy(_this);
      }
    };
    if (active_pane && (active_pane.transition || this.transition)) {
      this.startTransition(active_pane, previous_pane, clean_up_fn, false);
      previous_pane.activate(this.el);
    } else {
      previous_pane.activate(this.el);
      clean_up_fn();
    }
    return previous_pane;
  };

  PaneNavigator.prototype.startTransition = function(active_pane, previous_pane, callback, forward) {
    var container_height, info, key, options, start_state, transition, use_previous, value, _ref, _ref1;
    if (!active_pane) {
      return;
    }
    if (active_pane.transition && active_pane.transition.options) {
      use_previous = active_pane.transition.options.use_previous;
    }
    if (use_previous) {
      _ref = [previous_pane, active_pane], active_pane = _ref[0], previous_pane = _ref[1];
      forward = !forward;
    }
    transition = active_pane.transition ? active_pane.transition : this.transition;
    if (!transition) {
      return null;
    }
    if (typeof transition === 'string') {
      transition = {
        name: transition
      };
    }
    kb.active_transitions[transition.name] || throwMissing(this, "transition " + transition.name);
    options = {
      forward: forward
    };
    for (key in transition) {
      value = transition[key];
      options[key] = value;
    }
    if (options.inverse) {
      _ref1 = [previous_pane, active_pane], active_pane = _ref1[0], previous_pane = _ref1[1];
      options.forward = !options.forward;
    }
    delete options.inverse;
    if (active_pane) {
      active_pane.activate(this.el);
    }
    if (previous_pane) {
      previous_pane.activate(this.el);
    }
    info = {
      container: this.el,
      from: previous_pane ? previous_pane.el : null,
      to: active_pane ? active_pane.el : null,
      callback: callback
    };
    start_state = new kb.TransitionSavedState(info);
    !info.to || $(info.to).addClass('in-transition');
    !info.from || $(info.from).addClass('in-transition');
    container_height = this.el.clientHeight;
    if (!container_height) {
      container_height = info.from ? Math.max(info.to.clientHeight, info.from.clientHeight) : info.to.clientHeight;
    }
    $(this.el).css({
      'overflow': 'hidden',
      height: container_height
    });
    this.active_transition = {
      callback: callback,
      start_state: start_state,
      info: info
    };
    return new kb.active_transitions[transition.name](info, options);
  };

  PaneNavigator.prototype.cleanupTransition = function(cancel) {
    var transition;
    if (!this.active_transition) {
      return;
    }
    transition = this.active_transition;
    this.active_transition = null;
    if (cancel) {
      !transition.info.to || $(transition.info.to).stopTransition();
      !transition.info.from || $(transition.info.from).stopTransition();
    }
    transition.start_state.restore();
    return transition.callback();
  };

  return PaneNavigator;

})();

if (typeof exports !== 'undefined') {
  exports.PaneNavigator = kb.PaneNavigator;
}

kb.transitions || (kb.transitions = {});

if (!_.indexOf) {
  _.indexOf = function(array, value) {
    var index, test;
    for (index in array) {
      test = array[index];
      if (test === value) {
        return index;
      }
    }
    return -1;
  };
}

kb.utils || (kb.utils = {});

kb.utils.wrappedPaneNavigator = function(el, value) {
  if ((arguments.length === 1) || (el.__kb_pane_navigator === value)) {
    return el.__kb_pane_navigator;
  }
  if (el.__kb_pane_navigator) {
    el.__kb_pane_navigator.destroy();
  }
  el.__kb_pane_navigator = value;
  return value;
};

if (this.$ && $.fn) {
  $.fn.findByPath = function(path) {
    var $current_el, component, components, current_el, el, results, _i, _j, _len, _len1;
    results = [];
    for (_i = 0, _len = this.length; _i < _len; _i++) {
      el = this[_i];
      components = path.split('/');
      current_el = el;
      for (_j = 0, _len1 = components.length; _j < _len1; _j++) {
        component = components[_j];
        if (component[0] === '^') {
          path = component.substring(1);
          if (path) {
            $current_el = $(current_el).closest(path);
            current_el = $current_el.length ? $current_el[0] : null;
          } else {
            current_el = current_el.parentNode;
          }
        } else if (component === '..') {
          current_el = current_el.parentNode;
        } else {
          $current_el = $(current_el).find(component);
          current_el = $current_el.length ? $current_el[0] : null;
        }
        if (!current_el) {
          break;
        }
      }
      if (current_el) {
        results.push(current_el);
      }
    }
    return $(results);
  };
  $.fn.findPaneNavigator = function() {
    var $pane_navigator_el, $parent, el, pane_navigator, pane_navigator_el, path, _i, _j, _len, _len1, _ref;
    for (_i = 0, _len = this.length; _i < _len; _i++) {
      el = this[_i];
      if (path = el.getAttribute('data-path')) {
        $pane_navigator_el = this.findByPath(path);
        if ($pane_navigator_el.length && (pane_navigator = kb.utils.wrappedPaneNavigator($pane_navigator_el[0]))) {
          return pane_navigator;
        } else {
          return null;
        }
      } else {
        $parent = $(el).parent();
        while ($parent.length && !$parent.is('div')) {
          $parent = $parent.parent();
        }
        _ref = $parent.parent().find('.pane-navigator');
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          pane_navigator_el = _ref[_j];
          if ((pane_navigator = kb.utils.wrappedPaneNavigator(pane_navigator_el))) {
            return pane_navigator;
          }
        }
        $pane_navigator_el = $(el).closest('.pane-navigator');
        if ($pane_navigator_el.length && (pane_navigator = kb.utils.wrappedPaneNavigator($pane_navigator_el[0]))) {
          return pane_navigator;
        }
      }
      return null;
    }
  };
}

kb.nextPane = function(obj, event) {
  var active_pane, el, next_el, pane_navigator;
  el = _.isElement(obj) ? obj : (obj.currentTarget ? obj.currentTarget : event.currentTarget);
  pane_navigator = $(el).findPaneNavigator();
  if (!(pane_navigator && (active_pane = pane_navigator.activePane()))) {
    return;
  }
  next_el = active_pane.el;
  while ((next_el = next_el.nextSibling)) {
    if (_.isElement(next_el) && $(next_el).hasClass('pane')) {
      break;
    }
  }
  if (next_el) {
    return pane_navigator.push(new kb.Pane(next_el));
  }
};

kb.previousPane = function(obj, event) {
  var el, pane_navigator;
  el = _.isElement(obj) ? obj : (obj.currentTarget ? obj.currentTarget : event.currentTarget);
  pane_navigator = $(el).findPaneNavigator();
  if (pane_navigator && pane_navigator.activePane()) {
    return pane_navigator.pop();
  }
};

if (ko.bindingHandlers) {
  ko.bindingHandlers['PaneNavigator'] = {
    'init': function(element, value_accessor, all_bindings_accessor, view_model) {
      var options, pane_navigator;
      options = ko.utils.unwrapObservable(value_accessor());
      if (!('no_remove' in options)) {
        options.no_remove = true;
      }
      pane_navigator = new kb.PaneNavigator(element, options);
      kb.utils.wrappedPaneNavigator(element, pane_navigator);
      ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
        return kb.utils.wrappedPaneNavigator(element, null);
      });
      return $(element).addClass('pane-navigator');
    }
  };
}

kb.override_transitions = [];

kb.popOverrideTransition = function() {
  if (kb.override_transitions.length) {
    return kb.override_transitions.pop();
  } else {
    return null;
  }
};

kb.dispatchUrl = function(url) {
  window.location.hash = url;
  if (window.Backbone && window.Backbone.History.started) {
    return window.Backbone.history.loadUrl(url);
  } else if (window.Path) {
    return window.Path.dispatch(url);
  }
};

kb.loadUrl = function(url, transition) {
  kb.override_transitions.push(transition);
  return kb.dispatchUrl(url);
};

kb.loadUrlFn = function(url, transition) {
  return function(vm, event) {
    kb.loadUrl(url, transition);
    (!vm || !vm.stopPropagation) || (event = vm);
    !(event && event.stopPropagation) || (event.stopPropagation(), event.preventDefault());
  };
};

kb.utils || (kb.utils = {});

kb.utils.wrappedPageNavigator = function(el, value) {
  if ((arguments.length === 1) || (el.__kb_page_navigator === value)) {
    return el.__kb_page_navigator;
  }
  if (el.__kb_page_navigator) {
    el.__kb_page_navigator.destroy();
  }
  el.__kb_page_navigator = value;
  return value;
};

kb.Pane = (function() {

  function Pane(info, url) {
    if (arguments.length) {
      this.url = url;
    }
    this.setInfo(info);
  }

  Pane.prototype.destroy = function(options) {
    if (options == null) {
      options = {};
    }
    this.deactivate(options);
    this.removeElement(options, true);
    this.create = null;
    return this.el = null;
  };

  Pane.prototype.setInfo = function(info) {
    var key, value;
    if (_.isElement(info)) {
      this.el = info;
    } else {
      for (key in info) {
        value = info[key];
        this[key] = value;
      }
    }
    if (this.el) {
      $(this.el).addClass('pane');
    }
  };

  Pane.prototype.ensureElement = function() {
    var info;
    if (this.el) {
      return this.el;
    }
    this.create || throwMissing(this, 'create');
    info = this.create.apply(this, this.args);
    if (info) {
      this.setInfo(info);
    }
    this.el || throwMissing(this, 'element');
    if (this.el) {
      $(this.el).addClass('pane');
    }
  };

  Pane.prototype.removeElement = function(options, force) {
    if (options == null) {
      options = {};
    }
    if (!this.el) {
      return this;
    }
    if (options.no_remove) {
      return;
    }
    if (force || (this.create && !options.no_destroy)) {
      ko.removeNode(this.el);
      this.el = null;
    } else if (this.el.parentNode) {
      this.el.parentNode.removeChild(this.el);
    }
  };

  Pane.prototype.activate = function(container_el) {
    var view_model;
    this.ensureElement();
    if ($(this.el).hasClass('active')) {
      return;
    }
    $(this.el).addClass('active');
    if (this.el.parentNode !== container_el) {
      container_el.appendChild(this.el);
    }
    view_model = this.view_model ? this.view_model : ko.dataFor(this.el);
    if (view_model && view_model.activate) {
      view_model.activate(this);
    }
  };

  Pane.prototype.deactivate = function(options) {
    var view_model;
    if (options == null) {
      options = {};
    }
    if (!(this.el && $(this.el).hasClass('active'))) {
      return;
    }
    $(this.el).removeClass('active');
    view_model = this.view_model ? this.view_model : ko.dataFor(this.el);
    if (view_model && view_model.deactivate) {
      view_model.deactivate(this);
    }
    this.removeElement(options);
  };

  return Pane;

})();

if (typeof exports !== 'undefined') {
  exports.Pane = kb.Pane;
}
; return kb;});
}).call(this);