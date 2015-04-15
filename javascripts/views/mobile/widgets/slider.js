/* ========================================================================
 * Ratchet: sliders.js v2.0.2
 * http://goratchet.com/components#sliders
 * ========================================================================
   Adapted from Brad Birdsall's swipe
 * Copyright 2014 Connor Sears
 * Licensed under MIT (https://github.com/twbs/ratchet/blob/master/LICENSE)
 * ======================================================================== */


!(function () {
  'use strict';

  var pageX;
  var pageY;
  var slider;
  var deltaX;
  var deltaY;
  var offsetX;
  var lastSlide;
  var startTime;
  var resistance;
  var sliderWidth;
  var slideNumber;
  var isScrolling;
  var scrollableArea;

  var getSlider = function (target) {
    var i;
    var sliders = document.querySelectorAll('.slider > .slide-group');

    for (; target && target !== document; target = target.parentNode) {
      for (i = sliders.length; i--;) {
        if (sliders[i] === target) {
          return target;
        }
      }
    }
  };

  var getScroll = function () {
    if ('webkitTransform' in slider.style) {
      var translate3d = slider.style.webkitTransform.match(/translate3d\(([^,]*)/);
      var ret = translate3d ? translate3d[1] : 0;
      return parseInt(ret, 10);
    }
  };

  var setSlideNumber = function (offset) {
    var round = offset ? (deltaX < 0 ? 'ceil' : 'floor') : 'round';
    slideNumber = Math[round](getScroll() / (scrollableArea / slider.children.length));
    slideNumber += offset;
    slideNumber = Math.min(slideNumber, 0);
    slideNumber = Math.max(-(slider.children.length - 1), slideNumber);
  };

  var onTouchStart = function (e) {
    slider = getSlider(e.target);

    if (!slider) {
      return;
    }

    var firstItem  = slider.querySelector('.slide');

    scrollableArea = firstItem.offsetWidth * slider.children.length;
    isScrolling    = undefined;
    sliderWidth    = slider.offsetWidth;
    resistance     = 1;
    lastSlide      = -(slider.children.length - 1);
    startTime      = +new Date();
    pageX          = e.touches[0].pageX;
    pageY          = e.touches[0].pageY;
    deltaX         = 0;
    deltaY         = 0;

    setSlideNumber(0);

    slider.style['-webkit-transition-duration'] = 0;
  };

  var onTouchMove = function (e) {
    if (e.touches.length > 1 || !slider) {
      return; // Exit if a pinch || no slider
    }

    deltaX = e.touches[0].pageX - pageX;
    deltaY = e.touches[0].pageY - pageY;
    pageX  = e.touches[0].pageX;
    pageY  = e.touches[0].pageY;

    if (typeof isScrolling === 'undefined') {
      isScrolling = Math.abs(deltaY) > Math.abs(deltaX);
    }

    if (isScrolling) {
      return;
    }

    offsetX = (deltaX / resistance) + getScroll();

    e.preventDefault();

    resistance = slideNumber === 0         && deltaX > 0 ? (pageX / sliderWidth) + 1.25 :
                 slideNumber === lastSlide && deltaX < 0 ? (Math.abs(pageX) / sliderWidth) + 1.25 : 1;

    slider.style.webkitTransform = 'translate3d(' + offsetX + 'px,0,0)';
  };

  var onTouchEnd = function (e) {
    if (!slider || isScrolling) {
      return;
    }

    setSlideNumber(
      (+new Date()) - startTime < 1000 && Math.abs(deltaX) > 15 ? (deltaX < 0 ? -1 : 1) : 0
    );

    offsetX = slideNumber * sliderWidth;

    slider.style['-webkit-transition-duration'] = '.2s';
    slider.style.webkitTransform = 'translate3d(' + offsetX + 'px,0,0)';

    e = new CustomEvent('slide', {
      detail: { slideNumber: Math.abs(slideNumber) },
      bubbles: true,
      cancelable: true
    });

    slider.parentNode.dispatchEvent(e);
  };

  window.Ratchet.Sliders = {
    onTouchStart: onTouchStart,
    onTouchMove: onTouchMove,
    onTouchEnd: onTouchEnd
  };

}());
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  App.Widgets.Slider = (function(_super) {
    __extends(Slider, _super);

    function Slider() {
      return Slider.__super__.constructor.apply(this, arguments);
    }

    Slider.prototype.events = {
      "touchstart": "onTouchStart",
      "touchmove": "onTouchMove",
      "touchend": "onTouchEnd",
      "mousedown": "onMouseDown",
      "mousemove": "onMouseMove",
      "mouseup": "onMouseUp",
      "mouseup .slide-next": "slideToNext",
      "mouseup .slide-prev": "slideToPrev"
    };

    Slider.prototype.afterRender = function() {
      this.slider = this.$(".slide-group").get(0);
      return this.slideNumber = 0;
    };

    Slider.prototype.getScroll = function() {
      var offsetX, translate3d;
      if (this.slider.style.webkitTransform != null) {
        translate3d = this.slider.style.webkitTransform.match(/translate3d\(([^,]*)/);
        offsetX = translate3d ? translate3d[1] : 0;
        return parseInt(offsetX, 10);
      }
    };

    Slider.prototype.setSlideNumber = function(offset) {
      var round, slideNumber;
      round = offset ? (this.deltaX < 0 ? 'ceil' : 'floor') : 'round';
      slideNumber = Math[round](this.getScroll() / (this.scrollableArea / this.slider.children.length));
      slideNumber += offset;
      slideNumber = Math.min(slideNumber, 0);
      slideNumber = Math.max(-(this.slider.children.length - 1), slideNumber);
      return this.slideNumber = slideNumber;
    };

    Slider.prototype.onTouchStart = function(event) {
      var firstItem;
      firstItem = this.$('.slide').get(0);
      this.scrollableArea = firstItem.offsetWidth * this.slider.children.length;
      this.isScrolling = void 0;
      this.sliderWidth = this.slider.offsetWidth;
      this.resistance = 1;
      this.lastSlide = -(this.slider.children.length - 1);
      this.startTime = +new Date();
      this.pageX = event.touches[0].pageX;
      this.pageY = event.touches[0].pageY;
      this.deltaX = 0;
      this.deltaY = 0;
      this.setSlideNumber(0);
      return this.slider.style['-webkit-transition-duration'] = 0;
    };

    Slider.prototype.onTouchMove = function(event) {
      var offsetX;
      if (event.touches.length > 1) {
        return;
      }
      this.deltaX = event.touches[0].pageX - this.pageX;
      this.deltaY = event.touches[0].pageY - this.pageY;
      this.pageX = event.touches[0].pageX;
      this.pageY = event.touches[0].pageY;
      this.isScrolling || (this.isScrolling = Math.abs(this.deltaY) > Math.abs(this.deltaX));
      if (this.isScrolling) {
        return;
      }
      offsetX = (this.deltaX / this.resistance) + this.getScroll();
      event.preventDefault();
      this.resistance = this.slideNumber === 0 && this.deltaX > 0 ? (this.pageX / this.sliderWidth) + 1.25 : this.slideNumber === this.lastSlide && this.deltaX < 0 ? (Math.abs(this.pageX) / this.sliderWidth) + 1.25 : 1;
      return this.slider.style.webkitTransform = 'translate3d(' + offsetX + 'px,0,0)';
    };

    Slider.prototype.onTouchEnd = function(event) {
      var offset, offsetX;
      if (this.isScrolling) {
        return;
      }
      offset = (+new Date()) - this.startTime < 1000 && Math.abs(this.deltaX) > 15 ? (this.deltaX < 0 ? -1 : 1) : 0;
      this.setSlideNumber(offset);
      offsetX = this.slideNumber * this.sliderWidth;
      this.slider.style['-webkit-transition-duration'] = '.2s';
      this.slider.style.webkitTransform = 'translate3d(' + offsetX + 'px,0,0)';
      event = new CustomEvent('slide', {
        detail: {
          slideNumber: Math.abs(this.slideNumber)
        },
        bubbles: true,
        cancelable: true
      });
      return this.slider.parentNode.dispatchEvent(event);
    };

    Slider.prototype.slideTo = function(event, slideNumber) {
      var offsetX;
      offsetX = slideNumber * this.sliderWidth;
      this.slider.style['-webkit-transition-duration'] = '.2s';
      return this.slider.style.webkitTransform = 'translate3d(' + offsetX + 'px,0,0)';
    };

    Slider.prototype.slideToNext = function(event) {
      this.setSlideNumber(-1);
      this.slideTo(event, this.slideNumber);
      event.stopPropagation();
      return event.preventDefault();
    };

    Slider.prototype.slideToPrev = function(event) {
      this.setSlideNumber(1);
      this.slideTo(event, this.slideNumber);
      event.stopPropagation();
      return event.preventDefault();
    };

    Slider.prototype._imitateTouchEvent = function(event) {
      event.touches || (event.touches = [_.pick(event, "pageX", "pageY")]);
      return event;
    };

    Slider.prototype.onMouseDown = function(event) {
      if (this.mouseIsDown) {
        event.stopPropagation();
        event.preventDefault();
      }
      this.mouseIsDown = true;
      return this.onTouchStart(this._imitateTouchEvent(event));
    };

    Slider.prototype.onMouseMove = function(event) {
      if (this.mouseIsDown) {
        return this.onTouchMove(this._imitateTouchEvent(event));
      }
    };

    Slider.prototype.onMouseUp = function(event) {
      this.mouseIsDown = false;
      return this.onTouchEnd(this._imitateTouchEvent(event));
    };

    return Slider;

  })(Backbone.View);

}).call(this);
