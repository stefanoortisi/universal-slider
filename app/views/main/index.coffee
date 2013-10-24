#<< app/app_view
#<< app/components/universal_slider/slider 
class app.views.main.Index extends app.AppView

	after_render: () ->
		console.log "hello"

		@slider = new app.components.universal_slider.Slider
			el : $ "#slider"
			width: 530
			height: 227
			images: [
				"/images/home_slider1.png",
				"/images/home_slider2.png",
				"/images/home_slider3.png"
			]