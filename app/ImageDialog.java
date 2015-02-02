package com.kagami.merusuto;

import android.app.Activity;
import android.app.Dialog;
import android.content.Context;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.support.v4.view.PagerAdapter;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewGroup.LayoutParams;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import java.util.ArrayList;

class ImageDialog extends Dialog {
  private Bitmap mBitmap;
  private UnitItem mItem;
  private int mTemplate;

  public ImageDialog(Context context, UnitItem item, Bitmap bitmap, int template) {
    super(context, R.style.NobackgroundDialog);
    mItem = item;
    mBitmap = bitmap;
    mTemplate = template;
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    setContentView(R.layout.dialog_image);

    getWindow().setLayout(LayoutParams.MATCH_PARENT,
      LayoutParams.MATCH_PARENT);

    LayoutInflater layoutInflater = getLayoutInflater().from(getContext());

    ZoomImageView imageView = (ZoomImageView) layoutInflater.inflate(R.layout.view_zoom_image, null);
    imageView.setImageBitmap(mBitmap);
    imageView.setOnClickListener(new View.OnClickListener() {

      @Override
      public void onClick(View v) {
        dismiss();
      }
    });

    View detailView = (View) layoutInflater.inflate(R.layout.view_detail, null);
    detailView.setOnClickListener(new View.OnClickListener() {

      @Override
      public void onClick(View v) {
        dismiss();
      }
    });

    TextView nameView = (TextView) detailView.findViewById(R.id.name);
    TextView rareView = (TextView) detailView.findViewById(R.id.rare);

    UnitItem item = mItem;

    nameView.setText(item.title + item.name);
    rareView.setText(item.getRareString());

    LinearLayout textLayout = (LinearLayout) detailView.findViewById(R.id.text_layout1);

    if (mTemplate == UnitListFragment.TEMPLATE_UNIT) {
      addUnitTextView(textLayout, String.format(
        "初始生命: %d\n满级生命: %d\n满觉生命: %d\n初始攻击: %d\n满级攻击: %d\n满觉攻击: %d",
        item.getLife(0), item.getLife(1), item.getLife(2), item.getAtk(0), item.getAtk(1), item.getAtk(2)));

      addUnitTextView(textLayout, String.format(
        "攻距: %d\n攻数: %d\n攻速: %.2f\n韧性: %d\n移速: %d\n成长: %s",
        item.aarea, item.anum, item.aspd, item.tenacity, item.mspd, item.getTypeString()));

    } else if (mTemplate == UnitListFragment.TEMPLATE_MONSTER) {

      addUnitTextView(textLayout, String.format(
        "生命: %d\n攻击: %d\n攻距: %d\n攻数: %d",
        item.getLife(0), item.getAtk(0), item.aarea, item.anum));

      addUnitTextView(textLayout, String.format(
        "攻速: %.2f\n韧性: %d\n移速: %d\n皮肤: %s",
        item.aspd, item.tenacity, item.mspd, item.getSkinString()));
    }

    textLayout = (LinearLayout) detailView.findViewById(R.id.text_layout2);

    if (mTemplate == UnitListFragment.TEMPLATE_UNIT) {
      addUnitTextView(textLayout, String.format(
        "初始DPS: %d\n满级DPS: %d\n满觉DPS: %d\n初始总DPS: %d\n满级总DPS: %d\n满觉总DPS: %d",
        item.getDPS(0), item.getDPS(1), item.getDPS(2), item.getMultDPS(0), item.getMultDPS(1), item.getMultDPS(2)));

      addUnitTextView(textLayout, String.format(
        "国家: %s\n火: %.0f%%\n水: %.0f%%\n风: %.0f%%\n光: %.0f%%\n暗: %.0f%%",
        item.country, item.fire * 100, item.aqua * 100, item.wind * 100,
        item.light * 100, item.dark * 100));

    } else if (mTemplate == UnitListFragment.TEMPLATE_MONSTER) {
      addUnitTextView(textLayout, String.format(
        "\n\n\nDPS: %d\n总DPS: %d",
        item.getDPS(0), item.getMultDPS(0)));

      addUnitTextView(textLayout, String.format(
        "火: %.0f%%\n水: %.0f%%\n风: %.0f%%\n光: %.0f%%\n暗: %.0f%%",
        item.fire * 100, item.aqua * 100, item.wind * 100,
        item.light * 100, item.dark * 100));

      TextView textView = (TextView) detailView.findViewById(R.id.text_view1);
      textView.setVisibility(View.VISIBLE);
      textView.setText(String.format(
        "技能: \n技能SP: %d\n技能CD: %d\n%s",
        item.sklsp, item.sklcd, item.skill));

      textView = (TextView) detailView.findViewById(R.id.text_view2);
      textView.setVisibility(View.VISIBLE);
      textView.setText(String.format(
        "获取: \n%s", item.obtain));
    }

    final ArrayList<View> viewList = new ArrayList<View>();
    viewList.add(imageView);
    viewList.add(detailView);

    PagerAdapter pagerAdapter = new PagerAdapter() {

      @Override
      public boolean isViewFromObject(View arg0, Object arg1) {
        return arg0 == arg1;
      }

      @Override
      public int getCount() {
        return viewList.size();
      }

      @Override
      public void destroyItem(ViewGroup container, int position,
      Object object) {
        container.removeView(viewList.get(position));
      }

      @Override
      public int getItemPosition(Object object) {
        return super.getItemPosition(object);
      }

      @Override
      public Object instantiateItem(ViewGroup container, int position) {
        View view = viewList.get(position);
        container.addView(view);
        return view;
      }
    };
    ZoomImageViewPager viewPager = (ZoomImageViewPager) findViewById(R.id.view_pager);
    viewPager.setAdapter(pagerAdapter);
  }

  private void addUnitTextView(LinearLayout layout, String text) {
    LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
    LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT, 1f);
    View textLayout = LayoutInflater.from(getContext())
      .inflate(R.layout.text_view_unit_item, null);
    TextView textView = (TextView) textLayout.findViewById(R.id.text_view);
    textView.setText(text);
    layout.addView(textLayout, params);
  }
}
