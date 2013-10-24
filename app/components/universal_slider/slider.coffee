class app.components.universal_slider.Slider 

	wrapper_class  			: "universal-slider"
	moving_wrapper_class  	: "universal-slider-inner"
	img_wrapper_class	  	: "universal-slider-image"

	constructor: ( @data ) ->
		console.log "slider", @data


		@preload @data.images, @_on_load

		


	_on_load: ( ) =>
		console.log "LOADED!"
		@_build()

		@resize @data.width, @data.height 


	_build: ( ) ->
		@data.el.addClass @wrapper_class
		@data.el.css
			"overflow" : "hidden"
			"position" : "relative"


		@moving_el = $ document.createElement "div"
		@moving_el.addClass @moving_wrapper_class

		for src in @data.images
			img_wrapper = $ document.createElement "div"
			img_wrapper.addClass @img_wrapper_class

			img = $ document.createElement "img"
			img.attr "src", src

			img.css 
				"display"  	: "block"
				"width" 	: "100%"

			img_wrapper.css
				"display"   : "inline-block"
				"margin" 	: 0
				"padding" 	: 0

			img_wrapper.append img
			@moving_el.append img_wrapper


		

		@moving_el.css
			"position" : "absolute"
			"left" : 0
			"top" : 0
			"width" : @data.width * @data.images.length

		@data.el.append @moving_el

		@imgs_obj = @data.el.find ".#{@img_wrapper_class}" 

		console.log ".#{@img_wrapper_class}" , @imgs_obj

	resize: ( w, h ) ->
		@data.width = w
		@data.height = h

		@data.el.css
			"width"  	: @data.width
			"height"  	: @data.height

		@imgs_obj.css
			"width"  	: @data.width




	preload: ( images, callback ) ->
		count = 0
		for src in images
			img = new Image()
			img.onload = ->
				count++
				if count >= images.length
					callback()

			img.src = src

