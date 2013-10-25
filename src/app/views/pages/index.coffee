AppView = require 'app/views/app_view'
UniversalSlider = require 'app/components/universal_slider'

module.exports = class Index extends AppView
	after_render: ( ) ->
		console.log "index"
		@slider = new UniversalSlider
			el : $ "#slider"
			width: 500
			height: 227
			images: [
				"/images/home_slider1.png",
				"/images/home_slider2.png",
				"/images/home_slider3.png"
			]

		$("#prev").on "click", => @slider.prev()
		$("#next").on "click", => @slider.next()


		$(window).on "resize", @resize

	resize: ( ) =>
		@slider.resize 600, 300