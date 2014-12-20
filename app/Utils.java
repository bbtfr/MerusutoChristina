package com.kagami.merusuto;

import java.io.InputStream;
import org.json.JSONObject;

import android.content.Context;
import android.util.Log;

public class Utils {
	static public JSONObject readData(Context context) {
		try {
      InputStream is = context.getAssets().open("data/list.json");
      int size = is.available();
      byte[] bytes = new byte[size];

      is.read(bytes);
      is.close();

      String str = new String(bytes, "UTF-8");

			return new JSONObject(str);
		} catch (Exception e) {
      Log.e("com/kagami/merusuto", e.getMessage(), e);
		}
		
		return null;
	}

}
