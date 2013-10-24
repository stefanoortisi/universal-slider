(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  app.components.universal_slider.Slider = (function() {

    Slider.prototype.wrapper_class = "universal-slider";

    Slider.prototype.moving_wrapper_class = "universal-slider-inner";

    Slider.prototype.img_wrapper_class = "universal-slider-image";

    function Slider(data) {
      this.data = data;
      this._on_load = __bind(this._on_load, this);

      console.log("slider", this.data);
      this.preload(this.data.images, this._on_load);
    }

    Slider.prototype._on_load = function() {
      console.log("LOADED!");
      this._build();
      return this.resize(this.data.width, this.data.height);
    };

    Slider.prototype._build = function() {
      var img, img_wrapper, src, _i, _len, _ref;
      this.data.el.addClass(this.wrapper_class);
      this.data.el.css({
        "overflow": "hidden",
        "position": "relative"
      });
      this.moving_el = $(document.createElement("div"));
      this.moving_el.addClass(this.moving_wrapper_class);
      _ref = this.data.images;
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
        "width": this.data.width * this.data.images.length
      });
      this.data.el.append(this.moving_el);
      this.imgs_obj = this.data.el.find("." + this.img_wrapper_class);
      return console.log("." + this.img_wrapper_class, this.imgs_obj);
    };

    Slider.prototype.resize = function(w, h) {
      this.data.width = w;
      this.data.height = h;
      this.data.el.css({
        "width": this.data.width,
        "height": this.data.height
      });
      return this.imgs_obj.css({
        "width": this.data.width
      });
    };

    Slider.prototype.preload = function(images, callback) {
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

    return Slider;

  })();

}).call(this);
