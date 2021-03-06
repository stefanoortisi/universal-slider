// Generated by CoffeeScript 1.6.3
var UniversalSlider,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

UniversalSlider = (function() {
  UniversalSlider.prototype.wrapper_class = "universal-slider";

  UniversalSlider.prototype.moving_wrapper_class = "universal-slider-inner";

  UniversalSlider.prototype.img_wrapper_class = "universal-slider-image";

  UniversalSlider.prototype.evt_start = "";

  UniversalSlider.prototype.evt_move = "";

  UniversalSlider.prototype.evt_end = "";

  UniversalSlider.prototype.locked = false;

  UniversalSlider.prototype.is_dragging = false;

  UniversalSlider.prototype.options = {
    current_index: 0,
    reaction: 1,
    speed_snap: 400,
    threshold_snap: 40,
    use_transform: false,
    easing: "ease-out",
    bg_color: "#000"
  };

  function UniversalSlider(data) {
    this._snap_ended = __bind(this._snap_ended, this);
    this._touch_end = __bind(this._touch_end, this);
    this._touch_move = __bind(this._touch_move, this);
    this._touch_start = __bind(this._touch_start, this);
    this._kill_event = __bind(this._kill_event, this);
    this._on_load = __bind(this._on_load, this);
    var ie;
    ie = this.is_IE();
    if (ie && ie < 10) {
      this.options.use_transform = false;
    }
    this.options = this._merge_obj(this.options, data);
    if (this._is_touch()) {
      this.evt_start = "touchstart";
      this.evt_move = "touchmove";
      this.evt_end = "touchend";
    } else {
      this.evt_start = "mousedown";
      this.evt_move = "mousemove";
      this.evt_end = "mouseup";
    }
    this._preload(this.options.images, this._on_load);
    this.prefix = this._get_prefix();
  }

  /*
  	PUBLIC METHODS
  */


  UniversalSlider.prototype.move_to = function(index) {
    var value;
    if (this.locked) {
      return;
    }
    index = Math.max(0, Math.min(index, this.options.images.length - 1));
    this.locked = true;
    value = index * this.options.width;
    this.options.current_index = index;
    if (this.options.use_transform) {
      this._set_anim_duration(this.options.speed_snap);
      this._move_to(value);
      return setTimeout(this._snap_ended, this.options.speed_snap);
    } else {
      return this.moving_el.animate({
        "left": -value
      }, this.options.speed_snap, "swing", this._snap_ended);
    }
  };

  UniversalSlider.prototype.prev = function() {
    return this.move_to(this.options.current_index - 1);
  };

  UniversalSlider.prototype.next = function() {
    return this.move_to(this.options.current_index + 1);
  };

  UniversalSlider.prototype.resize = function(w, h) {
    this.options.width = w;
    this.options.height = h;
    this.options.el.css({
      "width": this.options.width,
      "height": this.options.height
    });
    this.imgs_obj.css({
      "width": this.options.width
    });
    this.moving_el.css({
      "width": this.options.width * this.options.images.length
    });
    return this._move_to(this.options.current_index * this.options.width);
  };

  UniversalSlider.prototype.destroy = function() {
    var key, _i, _len, _results;
    this.unset_triggers();
    this.options.el.empty();
    _results = [];
    for (_i = 0, _len = this.length; _i < _len; _i++) {
      key = this[_i];
      _results.push(this[key] = null);
    }
    return _results;
  };

  /*
  	PRIVATE METHODS
  */


  UniversalSlider.prototype._merge_obj = function(obj1, obj2) {
    var attrname, obj3;
    obj3 = {};
    for (attrname in obj1) {
      obj3[attrname] = obj1[attrname];
    }
    for (attrname in obj2) {
      obj3[attrname] = obj2[attrname];
    }
    return obj3;
  };

  UniversalSlider.prototype._on_load = function() {
    this._build();
    this.resize(this.options.width, this.options.height);
    return this.set_triggers();
  };

  UniversalSlider.prototype._build = function() {
    var img, img_wrapper, src, _i, _len, _ref;
    this.options.el.addClass(this.wrapper_class);
    this.options.el.css({
      "overflow": "hidden",
      "position": "relative"
    });
    this.moving_el = $(document.createElement("div"));
    this.moving_el.addClass(this.moving_wrapper_class);
    _ref = this.options.images;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      src = _ref[_i];
      img_wrapper = $(document.createElement("div"));
      img_wrapper.addClass(this.img_wrapper_class);
      img = $(document.createElement("img"));
      img.attr("src", src);
      img.css({
        "display": "block",
        "width": "100%"
      });
      img_wrapper.css({
        "display": "inline-block",
        "margin": 0,
        "padding": 0
      });
      img_wrapper.append(img);
      this.moving_el.append(img_wrapper);
    }
    this.moving_el.css({
      "position": "absolute",
      "left": 0,
      "top": 0,
      "background": this.options.bg_color,
      "width": this.options.width * this.options.images.length
    });
    this._move_to(0);
    this.options.el.append(this.moving_el);
    return this.imgs_obj = this.options.el.find("." + this.img_wrapper_class);
  };

  UniversalSlider.prototype.set_triggers = function() {
    this.options.el.on(this.evt_start, this._touch_start);
    this.options.el.on(this.evt_move, this._touch_move);
    $(document).on(this.evt_end, this._touch_end);
    this.imgs_obj.on(this.evt_start, this._kill_event);
    this.imgs_obj.on(this.evt_move, this._kill_event);
    return this.imgs_obj.on(this.evt_end, this._kill_event);
  };

  UniversalSlider.prototype.unset_triggers = function() {
    this.options.el.off(this.evt_start, this._touch_start);
    this.options.el.off(this.evt_move, this._touch_move);
    $(document).off(this.evt_end, this._touch_end);
    this.imgs_obj.off(this.evt_start, this._kill_event);
    this.imgs_obj.off(this.evt_move, this._kill_event);
    return this.imgs_obj.off(this.evt_end, this._kill_event);
  };

  UniversalSlider.prototype._kill_event = function(e) {
    return e.preventDefault();
  };

  UniversalSlider.prototype._touch_start = function(e) {
    if (this.locked) {
      return;
    }
    this.is_dragging = true;
    this.point_start = this._get_point(e);
    return this._kill_event(e);
  };

  UniversalSlider.prototype._touch_move = function(e) {
    var point, value;
    if (this.locked) {
      return;
    }
    if (!this.is_dragging) {
      return;
    }
    point = this._get_point(e);
    this.delta = (this.point_start.x - point.x) * this.options.reaction;
    value = this.options.current_index * this.options.width + this.delta;
    this._move_to(value);
    return this._kill_event(e);
  };

  UniversalSlider.prototype._touch_end = function(e) {
    if (!this._can_interact()) {
      return;
    }
    this.is_dragging = false;
    if (this.delta >= this.options.threshold_snap) {
      return this.move_to(this.options.current_index + 1);
    } else if (this.delta <= -this.options.threshold_snap) {
      return this.move_to(this.options.current_index - 1);
    } else {
      return this.move_to(this.options.current_index);
    }
  };

  UniversalSlider.prototype._can_interact = function() {
    return this.locked || this.is_dragging;
  };

  UniversalSlider.prototype._move_to = function(pixels) {
    var prop, translate, value;
    value = -pixels;
    if (this.options.use_transform) {
      if (this.prefix.lowercase === "webkit") {
        translate = 'translate3d(' + value + 'px, 0px, 0px)';
      } else {
        translate = 'translate(' + value + 'px, 0px)';
      }
      prop = this.prefix.css + "transform";
      return this.moving_el.css(prop, translate);
    } else {
      return this.moving_el.css("left", value);
    }
  };

  UniversalSlider.prototype._snap_ended = function() {
    var _base;
    this._set_anim_duration(0);
    this.locked = false;
    return typeof (_base = this.options).on_index_changed === "function" ? _base.on_index_changed(this.options.current_index) : void 0;
  };

  UniversalSlider.prototype._set_anim_duration = function(time) {
    var prop, timing;
    if (!this.options.use_transform) {
      return;
    }
    prop = this.prefix.css + "transition-duration";
    timing = this.prefix.css + "transition-timing-function";
    return this.moving_el.css({
      prop: time + "ms",
      timing: this.options.easing
    });
  };

  UniversalSlider.prototype._get_point = function(e) {
    var evt;
    if (e.pageX != null) {
      evt = e;
    } else {
      evt = e.originalEvent;
    }
    return {
      x: evt.pageX,
      y: evt.pageY
    };
  };

  UniversalSlider.prototype._is_touch = function() {
    if (this.touchable == null) {
      this.touchable = window["ontouchstart"] === null;
    }
    return this.touchable;
  };

  UniversalSlider.prototype._preload = function(images, callback) {
    var count, img, src, _i, _len, _results;
    count = 0;
    _results = [];
    for (_i = 0, _len = images.length; _i < _len; _i++) {
      src = images[_i];
      img = new Image();
      img.onload = function() {
        count++;
        if (count >= images.length) {
          return callback();
        }
      };
      _results.push(img.src = src);
    }
    return _results;
  };

  UniversalSlider.prototype.is_IE = function() {
    var nav;
    nav = navigator.userAgent.toLowerCase();
    if (nav.indexOf('msie') !== -1) {
      return parseInt(nav.split('msie')[1]);
    } else {
      return false;
    }
  };

  UniversalSlider.prototype._get_prefix = function() {
    var dom, pre, styles;
    styles = window.getComputedStyle(document.documentElement, "");
    pre = (Array.prototype.slice.call(styles).join("").match(/-(moz|webkit|ms)-/) || (styles.OLink === "" && ["", "o"]))[1];
    dom = "WebKit|Moz|MS|O".match(new RegExp("(" + pre + ")", "i"))[1];
    return {
      dom: dom,
      lowercase: pre,
      css: "-" + pre + "-",
      js: pre[0].toUpperCase() + pre.substr(1)
    };
  };

  return UniversalSlider;

})();

if ((typeof exports !== "undefined" && exports !== null) && module && module.exports) {
  module.exports = UniversalSlider;
} else if ((typeof define !== "undefined" && define !== null) && define.amd) {
  define(function() {
    return UniversalSlider;
  });
} else if (window) {
  (window.the || (window.the = {})).UniversalSlider = UniversalSlider;
}
