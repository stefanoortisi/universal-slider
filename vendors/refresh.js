// Generated by CoffeeScript 1.4.0
(function() {
  var Refresh;

  Refresh = (function() {

    function Refresh() {
      var socket;
      socket = io.connect("http://localhost");
      socket.on("refresh", function(data) {
        if (data.js != null) {
          return location.reload();
        }
        if (data.style) {
          return $('link').each(function(index, item) {
            var url;
            url = ($(item).attr('href')).split('?')[0];
            return $(item).attr('href', url + ("?" + (Math.random())));
          });
        }
      });
    }

    return Refresh;

  })();

  new Refresh();

}).call(this);