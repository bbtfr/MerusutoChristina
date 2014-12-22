package com.kagami.merusuto;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.json.JSONObject;

import android.content.Context;
import android.util.Log;

public class Utils {
	static public JSONObject readCompanionData(Context context) {
		try {
      HttpClient client = new DefaultHttpClient();
      HttpGet method = new HttpGet("https://raw.githubusercontent.com/bbtfr/MerusutoChristina/master/data/companions.json");

      HttpResponse response = client.execute(method);

      String json = EntityUtils.toString(response.getEntity());
      return new JSONObject(json);
    } catch (Exception e) {
      Log.e("com/kagami/merusuto", e.getMessage(), e);
  		return null;
    }
  }
}
