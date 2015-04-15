;(function($){
  $.fn.scrollToTop = function(){
    var $this = $(this),
      initialY = $this.scrollTop(),
      start = +new Date,
      speed = Math.min(750, Math.min(1500, initialY)),
      now,
      t, y

    if (initialY == 0) return

    function smooth(pos){
      if ((pos/=0.5) < 1) return 0.5*Math.pow(pos,5)
      return 0.5 * (Math.pow((pos-2),5) + 2)
    }

    requestAnimationFrame(function frame(){
      now = +new Date
      t = Math.min(1, Math.max((now - start)/speed, 0))
      y = initialY - initialY * smooth(t)
      if (y<0) y = 0
      $this.scrollTop(y)
      if (y>0) requestAnimationFrame(frame)
    })
  }
})($)
;
