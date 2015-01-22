package com.kagami.merusuto;

import android.content.Context;
import android.support.v4.view.ViewPager;
import android.util.AttributeSet;
import android.view.MotionEvent;
import android.view.View;

class ZoomImageViewPager extends ViewPager {

  public ZoomImageViewPager(Context context, AttributeSet attrs) {
    super(context, attrs);
  }

  @Override
  public boolean onTouchEvent(MotionEvent ev) {
    try {
      int index = getCurrentItem();
      return index == 0 && getChildAt(index).onTouchEvent(ev) || super.onTouchEvent(ev);
    } catch (Exception e) {}
    return true;
  }
}
