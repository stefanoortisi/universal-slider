(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  app.views.main.Index = (function(_super) {

    __extends(Index, _super);

    function Index() {
      return Index.__super__.constructor.apply(this, arguments);
    }

    Index.prototype.after_render = function() {
      console.log("hello");
      return this.slider = new app.components.universal_slider.Slider({
        el: $("#slider"),
        width: 530,
        height: 227,
        images: ["/images/home_slider1.png", "/images/home_slider2.png", "/images/home_slider3.png"]
      });
    };

    return Index;

  })(app.AppView);

}).call(this);
