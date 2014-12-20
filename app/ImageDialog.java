package com.kagami.merusuto;

import android.app.Activity;
import android.app.Dialog;
import android.content.Context;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup.LayoutParams;
import android.widget.ImageView;
import android.widget.TextView;
import android.util.Log;

class ImageDialog extends Dialog {

  private Bitmap mBitmap;

  public ImageDialog(Context context, Bitmap bitmap) {
    super(context, R.style.NobackgroundDialog);  
    mBitmap = bitmap;
  }

  @Override     
  protected void onCreate(Bundle savedInstanceState) {          
    super.onCreate(savedInstanceState); 
    setContentView(R.layout.dialog_image);

    getWindow().setLayout(LayoutParams.MATCH_PARENT, 
      LayoutParams.MATCH_PARENT);

    ZoomImageView imageView = (ZoomImageView) findViewById(R.id.original_image);
    imageView.setOnClickListener(new View.OnClickListener() {

      @Override
      public void onClick(View v) {
        dismiss();
      }
    });
    
    imageView.setImageBitmap(mBitmap);
  }


}  