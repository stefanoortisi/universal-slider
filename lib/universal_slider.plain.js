/*! UniversaSlider.JS - v0.1.0dev - 2013-09-26
 * http://github.com/stefanoortisi/universal-slider.js
 *
 * Structure inspired by Hammer.js <http://eightmedia.github.com/hammer.js>
 * Copyright (c) 2013 Stefano Ortisi <stefanoortisi@gmail.com>;
 * Licensed under the MIT license */

(function(window, undefined) {
    'use strict';

/**
 * UniversalSlider
 * use this to create instances
 * @param   {Object}   options
 * @returns {UniversalSlider.Instance}
 * @constructor
 */
var UniversalSlider = function(element, options) {
    return new UniversalSlider.Instance(element, options || {});
};

// default settings
UniversalSlider.defaults = {
    current_index   : 0,
    reaction        : 1,
    speed_snap      : 400,
    threshold_snap  : 40, 
    use_transform   : false,
    easing          : "ease-out",
    bg_color        : "#000" 
};

UniversalSlider.HAS_TOUCHEVENTS = ('ontouchstart' in window);
UniversalSlider.MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android|silk/i;
UniversalSlider.NO_MOUSEEVENTS = UniversalSlider.HAS_TOUCHEVENTS && window.navigator.userAgent.match(UniversalSlider.MOBILE_REGEX);
UniversalSlider.IS_OLD_IE = false;
UniversalSlider.CSS_PREFIX = "";

UniversalSlider.WRAPPER_CLASS = "universal-slider";
UniversalSlider.MOVING_WRAPPER_CLASS = "universal-slider-inner";
UniversalSlider.IMG_WRAPPER_CLASS = "universal-slider-image";

UniversalSlider.EVT_START = "";
UniversalSlider.EVT_MOVE = "";
UniversalSlider.EVT_END = "";

UniversalSlider.READY = false;

UniversalSlider.COUNTER = 0;

// Shortcut
var U = UniversalSlider;

/**
 * setup events to detect gestures on the document
 */
function setup() {
    if(UniversalSlider.READY) {
        return;
    }

    if( UniversalSlider.NO_MOUSEEVENTS ) {
        UniversalSlider.EVT_START = "touchstart";
        UniversalSlider.EVT_MOVE = "touchmove";
        UniversalSlider.EVT_END = "touchend";
    } else {
        UniversalSlider.EVT_START = "mousedown";
        UniversalSlider.EVT_MOVE = "mousemove";
        UniversalSlider.EVT_END = "mouseup";
    }

    UniversalSlider.IS_OLD_IE = UniversalSlider.utils.is_old_ie();

    UniversalSlider.defaults.use_transform = !UniversalSlider.IS_OLD_IE;

    UniversalSlider.CSS_PREFIX = UniversalSlider.utils.get_css_prefix()
    // UniversalSlider is ready...!
    UniversalSlider.READY = true;
}


/**
 * create new universal slider instance
 * all methods should return the instance itself, so it is chainable.
 * @param   {HTMLElement}       element
 * @param   {Object}            [options={}]
 * @returns {UniversalSlider.Instance}
 * @constructor
 */
UniversalSlider.Instance = function(element, options) {
    var self = this;


    // setup UnivesalSlider window events
    // this also sets up the default options
    setup();

    this.element = element;

    this.id = U.WRAPPER_CLASS + "_" + UniversalSlider.COUNTER++;
    this.is_dragging = false;

    this.images_loaded = false;
    this.locked = true;

    // merge options
    this.options = UniversalSlider.utils.extend(
        UniversalSlider.utils.extend({}, UniversalSlider.defaults),
        options || {});


    return this;
};


UniversalSlider.Instance.prototype = {
    
    /**
    * load the images and call the callback
    * @param   {function}       callback
    * @returns {UniversalSlider.Instance}
    */
    load: function load( callback ) {
        var self = this;
        this._build_before_loading();

        UniversalSlider.utils.preload_images( this.options.images, function(){
            self._build();
            self.images_loaded = true;
            self.locked = false;
            if( typeof callback != "undefined" ) {
                
                callback();
            }
        } );
        return this;
    },

    /**
    * Move the slider to the index given as input
    * @param   {integer}       index
    * @returns {UniversalSlider.Instance}
    */
    move_to: function( index ) {
        if( this.locked ){
            return this;

        }

        index = Math.max( 0, Math.min( index, this.options.images.length - 1 ) );

        this.locked = true;
        var value = index * this.options.width;
        this.options.current_index = index;

        

        if( this.options.use_transform ){
            this._set_anim_duration( this.options.speed_snap );
            this._move_to( value );

            setTimeout( U.utils.bind( this._snap_ended, this ), this.options.speed_snap );
        }   
        else {
            this.moving_el.animate({ 
                "left" : -value
            }, this.options.speed_snap, "swing", U.utils.bind( this._snap_ended, this ) );
        }

        return this;
    },

    /**
    * Callback called when the animation has ended
    * @returns null
    */
    _snap_ended: function() {

        this._set_anim_duration( 0 );

        this.locked = false;

        if( typeof this.options.on_index_changed != "undefined" ){
            this.options.on_index_changed( this.options.current_index );
        }
    },

    /**
    * sets the css transition duration
    * @param   {integer}       time
    * @returns null
    */
    _set_anim_duration: function( time ) {
        if( !this.options.use_transform ){
            return;
        }

        var prop = UniversalSlider.CSS_PREFIX.js + "TransitionDuration"
        var timing = UniversalSlider.CSS_PREFIX.js + "TransitionTimingFunction"

        this.moving_el.style[ prop ] = time + "ms";
        this.moving_el.style[ timing ] = this.options.easing;
            
    },

    _build_before_loading: function() {
        this.element.classList.add( U.WRAPPER_CLASS );
        this.element.style.overflow = "hidden";
        this.element.style.position = "relative";
        this.element.style.backgroundColor = this.options.bg_color;
        this.element.style.width = this.options.width;
        this.element.style.height = this.options.height;
    },

    _build: function() {

        this.moving_el = document.createElement( "div" );
        this.moving_el.classList.add( U.MOVING_WRAPPER_CLASS );
        this.moving_el.classList.add( this.id );

        var img_wrapper, img;
        for( var i = 0; i < this.options.images.length; i++ ){
            img_wrapper = document.createElement( "div" );
            img_wrapper.classList.add( U.IMG_WRAPPER_CLASS );

            img = document.createElement( "img" );
            img.src = this.options.images[ i ];

            img.style.display = "block";
            img.style.width = "100%";

            img_wrapper.style.display = "inline-block";
            img_wrapper.style.margin = 0;
            img_wrapper.style.padding = 0;

            img_wrapper.appendChild( img );
            this.moving_el.appendChild( img_wrapper );
        }

        this.moving_el.style.position = "absolute";
        this.moving_el.style.left = 0;
        this.moving_el.style.top = 0;
        this.moving_el.style.width = this.options.width * this.options.images.length;

        

        this.element.appendChild( this.moving_el );

        
        this.imgs_obj = document.querySelectorAll( "." + this.id + " ." + U.IMG_WRAPPER_CLASS );
        this._move_to( this.options.current_index );

        this.resize( this.options.width, this.options.height );

        this.set_triggers();
    },

    resize: function( w, h ) {
        this.options.width = w;
        this.options.height = h;

        this.element.style.width = this.options.width;
        this.element.style.height = this.options.height;

        for( var i = 0; i < this.imgs_obj.length; i++ ){
            this.imgs_obj[ i ].style.width = this.options.width;
        }

        this.moving_el.style.width = this.options.width * this.options.images.length;

        this._move_to( this.options.current_index * this.options.width );
    },

    destroy: function() {
        this.unset_triggers;

        // Very bad version. Just temporary
        this.element.innerHTML = "";

        for( var key in this ) {
            this[ key ] = null;
        }
    },

    set_triggers: function( )  {
        var self = this;

        U.utils.add_event( this.element, U.EVT_START, function(e){
            self._touch_start( e );
        });
        U.utils.add_event( this.element, U.EVT_MOVE, function(e){
            self._touch_move( e );
        });
        U.utils.add_event( document, U.EVT_END, function(e){
            self._touch_end( e );
        });

        U.utils.add_event( this.imgs_obj, U.EVT_START, U.utils.kill_event );
        U.utils.add_event( this.imgs_obj, U.EVT_MOVE, U.utils.kill_event );
        U.utils.add_event( this.imgs_obj, U.EVT_END, U.utils.kill_event );
    },

    unset_triggers: function( )  {
        var self = this;

        U.remove_event( this.element, U.EVT_START, function(e){
            self._touch_start( e );
        });
        U.remove_event( this.element, U.EVT_MOVE, function(e){
            self._touch_move( e );
        });
        U.remove_event( document, U.EVT_END, function(e){
            self._touch_end( e );
        });

        U.utils.remove_event( this.imgs_obj, U.EVT_START, U.utils.kill_event );
        U.utils.remove_event( this.imgs_obj, U.EVT_MOVE, U.utils.kill_event );
        U.utils.remove_event( this.imgs_obj, U.EVT_END, U.utils.kill_event );
    },

    prev: function() {
        this.move_to( this.options.current_index - 1 );
    },

    next: function() {
        this.move_to( this.options.current_index + 1 );
    },

    _touch_start: function( e ) {
        if( this.locked ) {
            return;
        }

        this.is_dragging = true;
        this.point_start = this._get_point( e );

        U.utils.kill_event( e );
    },

    _touch_move: function( e ) {
        if( this.locked || !this.is_dragging ) {
            return;
        }

        var point = this._get_point( e );

        this.delta = ( this.point_start.x - point.x ) * this.options.reaction;

        this._move_to( this.options.current_index * this.options.width + this.delta );
    },

    _touch_end: function( e ) {
        if( this.locked || !this.is_dragging ){
            return;
        }

        this.is_dragging = false;

        if( this.delta >= this.options.threshold_snap ){
            this.move_to( this.options.current_index + 1 );
        } else if( this.delta <= -this.options.threshold_snap ) {
            this.move_to( this.options.current_index - 1 );
        } else {
            this.move_to( this.options.current_index );
        }
    },

    _move_to: function( pixels ){
        var value = -pixels;
        var translate, prop;
        if( this.options.use_transform ){
            if( U.CSS_PREFIX.lowercase == "webkit" ){
                translate = 'translate3d(' + value + 'px, 0px, 0px)';
            } else {
                translate = 'translate(' + value + 'px, 0px)';
            }
            prop = U.CSS_PREFIX.js + "Transform"


            this.moving_el.style[ prop ] = translate;
        } else {
            this.moving_el.style.left = value;
        }
    },

    _get_point: function( e ) {
        var evt;
        if( typeof e.pageX != "undefined" ){
            evt = e;
        } else {
            evt = e.originalEvent;
        }

        return {
            x : evt.pageX,
            y : evt.pageY
        };
    }


        


};


UniversalSlider.utils = {
    /**
     * extend method,
     * also used for cloning when dest is an empty object
     * @param   {Object}    dest
     * @param   {Object}    src
     * @parm    {Boolean}   merge       do a merge
     * @returns {Object}    dest
     */
    extend: function extend(dest, src, merge) {
        for (var key in src) {
            if(dest[key] !== undefined && merge) {
                continue;
            }
            dest[key] = src[key];
        }
        return dest;
    },

     /**
     * preload_images method,
     * ppreload an array of images and call the callback when finished
     * @param   {Array}    images
     * @param   {function}    callback
     * 
     * @returns null
     */
    preload_images: function ( images, callback ) {
        var count = 0;
        for( var i in images ){
            var img = new Image()
            img.onload = function(){

                count++;
                if( count >= images.length ){
                    callback();
                }
            }
            img.src = images[ i ];
        }

    },

     /**
     * get_css_prefix method,
     * returns an object with info about the css prefix depending on the browser
     * @returns {Object} info
     */
    get_css_prefix: function() {
        
        var styles = window.getComputedStyle(document.documentElement, "");
        var pre = ([].slice.call(styles).join("").match(/-(moz|webkit|ms)-/) || (styles.OLink == "" && ["", "o"]))[1];
        var dom = ("WebKit|Moz|MS|O").match(new RegExp("(" + pre + ")", "i"))[1];


        var info = {
            dom: dom,
            lowercase: pre,
            css: "-" + pre + "-",
            js: pre[0].toUpperCase() + pre.substr(1)    
        }

        return info;
    },

    /**
    * get_css_prefix method,
    * detect if the browser is IE < 9
    * @returns {Boolean} is_ie
    */
    is_old_ie: function() {
        var nav = navigator.userAgent.toLowerCase();
        return (nav.indexOf('msie') != -1);
    },

    add_class : function(el, css) {
        var tem, C = el.className.split(/\s+/), A=[];    
        while(C.length){
            tem= C.shift();
            if(tem && tem!= css) A[A.length]= tem;
        }
        A[A.length]= css;
        return el.className = A.join(' ');   
    },

    add_event: function( el, event_type, handler ) {
        if( typeof el[ 0 ] != "undefined" ){
            for(var t=0; t<el.length; t++) {
                this._add_event( el[ t ], event_type, handler );    
            }
        } else {
            this._add_event( el, event_type, handler );
        }
    },

    _add_event: function( el, event_type, handler ){
        var types = event_type.split(' ');
        for(var t=0; t<types.length; t++) {
            el.addEventListener(types[t], handler, false);
        }
    },

    remove_event: function( el, event_type, handler ) {
        if( typeof el[ 0 ] != "undefined" ){
            for(var t=0; t<el.length; t++) {
                this._remove_event( el[ t ], event_type, handler );    
            }
        } else {
            this._remove_event( el, event_type, handler );
        }
    },

    _remove_event: function( el, event_type, handler ) {
        var types = event_type.split(' ');
        for(var t=0; t<types.length; t++) {
            el.removeEventListener(types[t], handler, false);
        }
    },

    kill_event: function( e ) {
        e.preventDefault();
    },

    bind : function( funktion, scope ) {;
        return function() {
            return funktion.apply(scope, arguments);
        }
    }

};


 // Based off Lo-Dash's excellent UMD wrapper (slightly modified) - https://github.com/bestiejs/lodash/blob/master/lodash.js#L5515-L5543
    // some AMD build optimizers, like r.js, check for specific condition patterns like the following:
    if(typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
        // define as an anonymous module
        define(function() {
            return UniversalSlider;
        });
    // check for `exports` after `define` in case a build optimizer adds an `exports` object
    } else if(typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = UniversalSlider;
    } else {
        window.UniversalSlider = UniversalSlider;
    }

})(this);