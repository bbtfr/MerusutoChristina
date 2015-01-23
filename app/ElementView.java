package com.kagami.merusuto;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Paint.Style;
import android.graphics.Path;
import android.graphics.PointF;
import android.util.AttributeSet;
import android.view.View;

public class ElementView extends View {

  private float fire;
  private float aqua;
  private float wind;
  private float light;
  private float dark;

  private int mMode = 0;

  private Paint mPaint;
  private PointF[] mBoundPoints;
  private Path mBoundPath;
  private Path mHalfBoundPath;
  private Path mElementBoundPath;
  private float mElementBoundPointRadio;
  private float mElementViewTopPadding;

  private final static int[] COLORS = { 0xffe74c3c, 0xff3498db, 0xff2ecc71, 0xfff1c40f, 0xff9b59b6 };

  public ElementView(Context context) {
    super(context);
    initView();
  }

  public ElementView(Context context, AttributeSet attrs) {
    super(context, attrs);
    initView();
  }

  private void initView() {
    mPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
    mPaint.setStyle(Style.STROKE);
    mBoundPoints = new PointF[5];
    mBoundPath = new Path();
    mHalfBoundPath = new Path();
    mElementBoundPath = new Path();
    mElementBoundPointRadio = getContext().getResources()
      .getDimension(R.dimen.element_bound_point_radio);
    mElementViewTopPadding = getContext().getResources()
      .getDimension(R.dimen.element_view_top_padding);
  }

  private PointF getPoint(float centerX, float centerY, float r, int i) {
    double th = (Math.PI * 2) / 360;
    PointF point = new PointF((float) (centerX + r * Math.cos((-i * 72 + 90) * th)),
      (float) (centerY - r * Math.sin((-i * 72 + 90) * th)) + mElementViewTopPadding);
    return point;
  }

  public void setMode(int mode) {
    mMode = mode;
  }

  public void setElement(float fire, float aqua, float wind, float light, float dark) {
    this.fire = fire;
    this.aqua = aqua;
    this.wind = wind;
    this.light = light;
    this.dark = dark;
  }

  @Override
  protected void onSizeChanged(int w, int h, int oldw, int oldh) {
    float centerX = getWidth() / 2.0f;
    float centerY = getHeight() / 2.0f;
    float r = Math.min(centerX, centerY) - mElementBoundPointRadio / 2;

    mBoundPoints = new PointF[5];
    for (int i = 0; i < 5; i++)
      mBoundPoints[i] = getPoint(centerX, centerY, r, i);

    mBoundPath.reset();
    mBoundPath.moveTo(mBoundPoints[0].x, mBoundPoints[0].y);
    for (int i = 1; i < 5; i++)
      mBoundPath.lineTo(mBoundPoints[i].x, mBoundPoints[i].y);
    mBoundPath.close();

    mHalfBoundPath.reset();
    PointF tmpPoint = getPoint(centerX, centerY, r / 2.0f, 0);
    mHalfBoundPath.moveTo(tmpPoint.x, tmpPoint.y);
    for (int i = 1; i < 5; i++) {
      tmpPoint = getPoint(centerX, centerY, r / 2.0f, i);
      mHalfBoundPath.lineTo(tmpPoint.x, tmpPoint.y);
    }
    mHalfBoundPath.close();
  }

  @Override
  protected void onDraw(Canvas canvas) {
    mPaint.setStyle(Style.FILL);
    mPaint.setColor(0x11000000);
    canvas.drawPath(mBoundPath, mPaint);
    mPaint.setStyle(Style.FILL);
    mPaint.setColor(0x11000000);
    canvas.drawPath(mHalfBoundPath, mPaint);

    //Element
    mPaint.setStyle(Style.FILL);
    int index = (mMode > 0 && mMode < 6) ? mMode - 1 : 0;
    mPaint.setColor(COLORS[index] & 0x88FFFFFF);
    float centerX = getWidth() / 2.0f;
    float centerY = getHeight() / 2.0f;
    float r = Math.min(centerX, centerY) - mElementBoundPointRadio / 2;

    mElementBoundPath.reset();
    PointF tmpPoint = getPoint(centerX, centerY, r / 2.0f * fire, 0);
    mElementBoundPath.moveTo(tmpPoint.x, tmpPoint.y);
    tmpPoint = getPoint(centerX, centerY, r / 2.0f * aqua, 1);
    mElementBoundPath.lineTo(tmpPoint.x, tmpPoint.y);
    tmpPoint = getPoint(centerX, centerY, r / 2.0f * wind, 2);
    mElementBoundPath.lineTo(tmpPoint.x, tmpPoint.y);
    tmpPoint = getPoint(centerX, centerY, r / 2.0f * light, 3);
    mElementBoundPath.lineTo(tmpPoint.x, tmpPoint.y);
    tmpPoint = getPoint(centerX, centerY, r / 2.0f * dark, 4);
    mElementBoundPath.lineTo(tmpPoint.x, tmpPoint.y);
    mElementBoundPath.close();
    canvas.drawPath(mElementBoundPath, mPaint);

    //Circle
    mPaint.setStyle(Style.FILL);
    for (int i = 0; i < 5; i++) {
      mPaint.setColor(COLORS[i]);
      canvas.drawCircle(mBoundPoints[i].x, mBoundPoints[i].y,
        mElementBoundPointRadio, mPaint);
    }
  }
}
