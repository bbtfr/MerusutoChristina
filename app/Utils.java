package com.kagami.merusuto;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Environment;
import android.util.Log;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.FileNotFoundException;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.json.JSONObject;

public class Utils {
  public final static long EXPIRATION = 86400000L;

  static public void writeStringAsFile(File file, final String content) {
    try {
      FileWriter out = new FileWriter(file);
      out.write(content);
      out.close();
    } catch (IOException e) {
      Log.e("com/kagami/merusuto", "File write failed: " + e.toString());
    }
  }

  static public void writeBytesAsFile(File file, final byte[] content) {
    try {
      File parent = file.getParentFile();
      if (!parent.exists()) {
        parent.mkdirs();
      }
      FileOutputStream out = new FileOutputStream(file);
      out.write(content);
      out.close();
    } catch (IOException e) {
      Log.e("com/kagami/merusuto", "File write failed: " + e.toString());
    }
  }

  static public String readFileAsString(File file) {
    StringBuilder stringBuilder = new StringBuilder();
    String line;
    BufferedReader in = null;

    try {
      in = new BufferedReader(new FileReader(file));
      while ((line = in.readLine()) != null) stringBuilder.append(line);
    } catch (FileNotFoundException e) {
      Log.e("com/kagami/merusuto", "File not found: " + e.toString());
    } catch (IOException e) {
      Log.e("com/kagami/merusuto", "Can not read file: " + e.toString());
    } 

    return stringBuilder.toString();
  }

  static public HttpResponse getHttpResponse(String filename) throws IOException {
    HttpClient client = new DefaultHttpClient();
    HttpGet method = new HttpGet("https://raw.githubusercontent.com/bbtfr/MerusutoChristina/master/data/" + filename);
    return client.execute(method);
  }

  static public JSONObject readLocalJSONData(Context context, String filename) {
    try {
      File local = new File(context.getFilesDir(), filename);
      File cache = new File(local, ".cache");
      long expiration = System.currentTimeMillis() - cache.lastModified();
      if (local.exists()) {
        Log.i("com/kagami/merusuto", "Read JSON from local file.");
        return new JSONObject(readFileAsString(local));
      } else if (cache.exists() && expiration < EXPIRATION) {
        Log.i("com/kagami/merusuto", "Read JSON from local cache file.");
        Log.i("com/kagami/merusuto", "Expiration: " + expiration);
        return new JSONObject(readFileAsString(cache));
      } else {
        return null;
      }
    } catch (Exception e) {
      Log.e("com/kagami/merusuto", e.getMessage(), e);
      return null;
    }
  }

  static public JSONObject readRemoteJSONData(Context context, String filename) {
    try {
      Log.i("com/kagami/merusuto", "Read JSON from github and write to local file.");
      HttpResponse response = getHttpResponse(filename);

      Log.i("com/kagami/merusuto", "Write JSON to local file.");
      String json = EntityUtils.toString(response.getEntity());
      File local = new File(context.getFilesDir(), filename);
      writeStringAsFile(local, json);
      return new JSONObject(json);
    } catch (Exception e) {
      Log.e("com/kagami/merusuto", e.getMessage(), e);
      return null;
    }
  }

  static public Bitmap readLocalBitmap(Context context, String filename, BitmapFactory.Options options) {
    try {
      File local = new File(Environment.getExternalStorageDirectory(), 
        "merusuto/" + filename);
      if (local.exists()) {
        Log.i("com/kagami/merusuto", "Read Bitmap from local file.");
        return BitmapFactory.decodeStream(new FileInputStream(local), null, options);
      } else {
        return null;
      }
    } catch (Exception e) {
      Log.e("com/kagami/merusuto", e.getMessage(), e);
      return null;
    }
  }
  
  static public Bitmap readRemoteBitmap(Context context, String filename, BitmapFactory.Options options) {
    try {
      Log.i("com/kagami/merusuto", "Read Bitmap from github.");
      HttpResponse response = getHttpResponse(filename);

      Log.i("com/kagami/merusuto", "Write Bitmap to local file.");
      byte[] bytes = EntityUtils.toByteArray(response.getEntity());
      File local = new File(Environment.getExternalStorageDirectory(), 
        "merusuto/" + filename);
      writeBytesAsFile(local, bytes);
      return BitmapFactory.decodeByteArray(bytes, 0, bytes.length, options);
    } catch (Exception e) {
      Log.e("com/kagami/merusuto", e.getMessage(), e);
      return null;
    }
  }
}
