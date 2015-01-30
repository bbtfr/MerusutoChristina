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
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.IOException;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.json.JSONArray;

public class Utils {
  public final static long EXPIRATION = 14400000L;
  private final static String BASEURL =
    "https://bbtfr.github.io/MerusutoChristina/data/";

  static public void ensureParentDirectoryExists(File file) {
    File parent = file.getParentFile();
    if (!parent.exists()) {
      parent.mkdirs();
    }
  }

  static public void writeStringAsFile(File file, final String content) {
    try {
      ensureParentDirectoryExists(file);
      FileWriter out = new FileWriter(file);
      out.write(content);
      out.close();
    } catch (IOException e) {
      Log.e("com/kagami/merusuto", "File write failed: " + e.toString());
    }
  }

  static public void writeBytesAsFile(File file, final byte[] content) {
    try {
      ensureParentDirectoryExists(file);
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

  static public String readStreamAsString(InputStream stream) {
    StringBuilder stringBuilder = new StringBuilder();
    String line;
    BufferedReader in = null;

    try {
      in = new BufferedReader(new InputStreamReader(stream));
      while ((line = in.readLine()) != null) stringBuilder.append(line);
    } catch (IOException e) {
      Log.e("com/kagami/merusuto", "Can not read stream: " + e.toString());
    }

    return stringBuilder.toString();
  }

  static public HttpResponse getHttpResponse(String url) throws IOException {
    HttpClient client = new DefaultHttpClient();
    HttpGet method = new HttpGet(url);
    return client.execute(method);
  }

  static public JSONArray readLocalJSONData(Context context, String filename) {
    try {
      InputStream stream = null;
      try {
        stream = context.getAssets().open("data/" + filename);
      } catch (Exception e) {}
      File local = new File(Environment.getExternalStorageDirectory(),
        "merusuto/" + filename);
      File cache = new File(context.getFilesDir(), filename);
      long expiration = System.currentTimeMillis() - cache.lastModified();
      if (stream != null) {
        Log.i("com/kagami/merusuto", "Read JSON from internal stream.");
        return new JSONArray(readStreamAsString(stream));
      } else if (local.exists()) {
        Log.i("com/kagami/merusuto", "Read JSON from local file: " +
          local.getAbsolutePath() + ".");
        return new JSONArray(readFileAsString(local));
      } else if (cache.exists() && expiration < EXPIRATION) {
        Log.i("com/kagami/merusuto", "Read JSON from local cache file: " +
          cache.getAbsolutePath() + ", expiration: " + expiration + ".");
        return new JSONArray(readFileAsString(cache));
      } else {
        return null;
      }
    } catch (Exception e) {
      Log.e("com/kagami/merusuto", e.getMessage(), e);
      return null;
    }
  }

  static public JSONArray readRemoteJSONData(Context context, String filename) {
    try {
      String url = BASEURL + filename;
      Log.i("com/kagami/merusuto", "Read JSON from github: " + url + ".");
      HttpResponse response = getHttpResponse(url);
      String json = EntityUtils.toString(response.getEntity(), "UTF8");
      JSONArray jsonObj = new JSONArray(json);

      File cache = new File(context.getFilesDir(), filename);
      Log.i("com/kagami/merusuto", "Write JSON to local cache file: " +
        cache.getAbsolutePath() + ".");
      writeStringAsFile(cache, json);
      return jsonObj;
    } catch (Exception e) {
      Log.e("com/kagami/merusuto", e.getMessage(), e);
      return null;
    }
  }

  static public Bitmap readLocalBitmap(Context context, String filename, BitmapFactory.Options options) {
    try {
      InputStream stream = null;
      try {
        stream = context.getAssets().open("data/" + filename);
      } catch (Exception e) {}
      File local = new File(Environment.getExternalStorageDirectory(),
        "merusuto/" + filename);
      if (stream != null) {
        Log.i("com/kagami/merusuto", "Read Bitmap from internal stream.");
        return BitmapFactory.decodeStream(stream, null, options);
      } else if (local.exists()) {
        Log.i("com/kagami/merusuto", "Read Bitmap from local file: " +
          local.getAbsolutePath() + ".");
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
      String url = BASEURL + filename;
      Log.i("com/kagami/merusuto", "Read Bitmap from github: " + url + ".");
      HttpResponse response = getHttpResponse(url);
      byte[] bytes = EntityUtils.toByteArray(response.getEntity());
      Bitmap bitmap = BitmapFactory.decodeByteArray(bytes, 0, bytes.length, options);

      File local = new File(Environment.getExternalStorageDirectory(),
        "merusuto/" + filename);
      Log.i("com/kagami/merusuto", "Write Bitmap to local file: " +
        local.getAbsolutePath() + ".");
      writeBytesAsFile(local, bytes);
      return bitmap;
    } catch (Exception e) {
      Log.e("com/kagami/merusuto", e.getMessage(), e);
      return null;
    }
  }
}
