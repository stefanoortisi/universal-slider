class UniversalSlider

	wrapper_class  			: "universal-slider"
	moving_wrapper_class  	: "universal-slider-inner"
	img_wrapper_class	  	: "universal-slider-image"

	evt_start 				: ""
	evt_move 				: ""
	evt_end 				: ""
	locked 					: false
	is_dragging 			: false

	options 				:
		current_index 	: 0
		reaction 		: 1 # set the reactivity of the touch
		speed_snap 		: 400 # speed of the snap after the touch is ended
		threshold_snap 	: 40 # amount of pixels needed to change slide
		use_transform 	: false
		easing 			: "ease-out"
		bg_color 		: "#000" 



	constructor: ( data ) ->

		# if it's IE < 10, then we can't use css transform 
		ie = @is_IE()
		if ie and ie < 10
			@options.use_transform = false

		# Merge the default options with the parameters given as input
		@options = @_merge_obj @options, data

		if @_is_touch()
			@evt_start = "touchstart"
			@evt_move  = "touchmove"
			@evt_end   = "touchend"
		else
			@evt_start = "mousedown"
			@evt_move  = "mousemove"
			@evt_end   = "mouseup"

		# Simple preloading
		@_preload @options.images, @_on_load

		@prefix = @_get_prefix()
		

	###
	PUBLIC METHODS
	###



	# Move the slider to the index given as input
	move_to: (index) ->

		return if @locked

		index = Math.max( 0, Math.min( index, @options.images.length - 1 ) )

		@locked = true
		value     = index * @options.width
		@options.current_index = index

		if @options.use_transform
			@_set_anim_duration @options.speed_snap

			
			
			@_move_to value

			
			setTimeout @_snap_ended, @options.speed_snap
		else

			@moving_el.animate
				"left" : -value
			, @options.speed_snap, "swing", @_snap_ended

	# Move the slider to the previous item
	prev: ( ) ->
		@move_to @options.current_index - 1

	# Move the slider to the next item
	next: ( ) ->
		@move_to @options.current_index + 1

	# Resize the slider wrapper with the given parameters
	resize: ( w, h ) ->	
		@options.width = w
		@options.height = h

		@options.el.css
			"width"  	: @options.width
			"height"  	: @options.height

		@imgs_obj.css
			"width"  	: @options.width


		@moving_el.css
			"width" : @options.width * @options.images.length

		@_move_to @options.current_index * @options.width

	# Destroy the HTML for the slider and all its properties
	destroy: ( ) ->
		@unset_triggers()
		@options.el.empty()

		for key in @
			@[key] = null		

	###
	PRIVATE METHODS
	###

	# Utility method which merges two objects
	_merge_obj: ( obj1, obj2 ) ->
		obj3 = {}

		obj3[attrname] = obj1[attrname] for attrname of obj1
		obj3[attrname] = obj2[attrname] for attrname of obj2

		obj3

	# Images Preload callback
	_on_load: ( ) =>

		@_build()

		@resize @options.width, @options.height 
		@set_triggers()

	# Build the HTML/CSS structure
	_build: ( ) ->
		@options.el.addClass @wrapper_class
		@options.el.css
			"overflow" : "hidden"
			"position" : "relative"


		@moving_el = $ document.createElement "div"
		@moving_el.addClass @moving_wrapper_class

		for src in @options.images
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
			"background" : @options.bg_color
			"width" : @options.width * @options.images.length

		@_move_to 0

		@options.el.append @moving_el

		@imgs_obj = @options.el.find ".#{@img_wrapper_class}" 

	

	# Set the triggers
	set_triggers: ( ) ->
		@options.el.on @evt_start, @_touch_start
		@options.el.on @evt_move, @_touch_move
		$(document).on @evt_end, @_touch_end

		@imgs_obj.on @evt_start, @_kill_event
		@imgs_obj.on @evt_move, @_kill_event
		@imgs_obj.on @evt_end, @_kill_event

	# Unset the triggers
	unset_triggers: ( ) ->
		@options.el.off @evt_start, @_touch_start
		@options.el.off @evt_move, @_touch_move
		$(document).off @evt_end, @_touch_end

		@imgs_obj.off @evt_start, @_kill_event
		@imgs_obj.off @evt_move, @_kill_event
		@imgs_obj.off @evt_end, @_kill_event


	_kill_event: ( e ) => 
		e.preventDefault()

	
	_touch_start: ( e ) =>
		return if @locked

		@is_dragging = true

		@point_start = @_get_point e

		@_kill_event e

	_touch_move: ( e ) =>
		return if @locked
		return if not @is_dragging

		point = @_get_point e

		@delta = (@point_start.x - point.x) * @options.reaction

		value     = @options.current_index * @options.width + @delta

		@_move_to value

		@_kill_event e
		


	_touch_end: ( e ) =>
		return if not @_can_interact()

		@is_dragging = false
		
		if @delta >= @options.threshold_snap
			@move_to @options.current_index + 1
		else if @delta <= -@options.threshold_snap
			@move_to @options.current_index - 1
		else
			@move_to @options.current_index

		
	_can_interact: ( ) ->
		return (@locked or @is_dragging)

	_move_to: (pixels) ->
		value = -pixels

		if @options.use_transform
			if @prefix.lowercase is "webkit"
				translate = 'translate3d(' + value + 'px, 0px, 0px)'
			else
				translate = 'translate(' + value + 'px, 0px)'

			prop = @prefix.css + "transform"
			
			@moving_el.css prop, translate

		else
			@moving_el.css "left", value			

	_snap_ended: ( ) =>

		@_set_anim_duration 0

		@locked = false

		@options.on_index_changed?( @options.current_index )


	_set_anim_duration: ( time ) ->
		return unless @options.use_transform

		prop = @prefix.css + "transition-duration"
		timing = @prefix.css + "transition-timing-function"

		@moving_el.css 
			prop : time + "ms"
			timing : @options.easing

	_get_point: ( e ) ->
		if e.pageX?
			evt = e
		else
			evt = e.originalEvent

		return {
			x : evt.pageX
			y : evt.pageY
		}



	_is_touch: ( ) ->
		@touchable ?= window[ "ontouchstart" ] is null

		return @touchable




	_preload: ( images, callback ) ->
		count = 0
		for src in images
			img = new Image()
			img.onload = ->
				count++
				if count >= images.length
					callback()

			img.src = src

	is_IE : () ->
		nav = navigator.userAgent.toLowerCase()
		if (nav.indexOf('msie') != -1)
			return parseInt(nav.split('msie')[1])
		else
			return false

	_get_prefix : () ->
		styles = window.getComputedStyle(document.documentElement, "")
		pre = (Array::slice.call(styles).join("").match(/-(moz|webkit|ms)-/) or (styles.OLink is "" and ["", "o"]))[1]
		dom = ("WebKit|Moz|MS|O").match(new RegExp("(" + pre + ")", "i"))[1]
		
		return {
			dom: dom
			lowercase: pre
			css: "-" + pre + "-"
			js: pre[0].toUpperCase() + pre.substr(1)	
		}

# exporting
if exports? and module and module.exports
	module.exports = UniversalSlider
else if define? and define.amd
	define -> UniversalSlider
else if window
	(window.the or= {}).UniversalSlider = UniversalSlider
