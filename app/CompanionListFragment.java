package com.kagami.merusuto;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Iterator;
import java.util.List;

import org.json.JSONObject;

import android.app.AlertDialog;
import android.app.Fragment;
import android.app.ProgressDialog;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.os.AsyncTask;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewGroup.LayoutParams;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemClickListener;
import android.widget.AdapterView.OnItemLongClickListener;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;
import android.util.Log;

public class CompanionListFragment extends Fragment {

  public final static int SORT_RARE = 1;
  public final static int SORT_ATK = 2;
  public final static int SORT_DPS = 3;
  public final static int SORT_MULT_DPS = 4;
  public final static int SORT_LIFE = 5;
  public final static int SORT_AAREA = 6;
  public final static int SORT_ANUM = 7;
  public final static int SORT_ASPD = 8;
  public final static int SORT_TENACITY = 9;
  public final static int SORT_MSPD = 10;

  private CompanionListAdapter mAdapter;
  private int mRare = 0, mElement = 0, mWeapon = 0, mLevel = 0, mType = 0;
  private int mSortMode = SORT_RARE;

  public CompanionListFragment() {
    super();
  }

  public void setRare(int rare) {
    mRare = rare;
    mAdapter.search();
  }

  public void setElement(int element) {
    mElement = element;
    mAdapter.search();
  }

  public void setWeapon(int weapon) {
    mWeapon = weapon;
    mAdapter.search();
  }

  public void setType(int type) {
    mType = type;
    mAdapter.search();
  }

  public void setLevel(int level) {
    mLevel = level;
    mAdapter.sort();
  }

  public void setSortMode(int mode) {
    mSortMode = mode;
    mAdapter.sort();
  }

  public void reset() {
    mRare = mElement = mWeapon = mLevel = 0;
    mSortMode = SORT_RARE;
    mAdapter.search();
  }

  @Override
  public View onCreateView(LayoutInflater inflater, ViewGroup container, 
    Bundle savedInstanceState) {
    View rootView = inflater.inflate(R.layout.fragment_companion_list, 
      container, false);
    ListView listview = (ListView) rootView.findViewById(R.id.companion_list);
    
    if (savedInstanceState == null) {
      Toast.makeText(getActivity(), "正在读取数据，请稍候...", 
        Toast.LENGTH_SHORT).show();  
    } else {
      mRare = savedInstanceState.getShort("rare");
      mElement = savedInstanceState.getShort("element");
      mWeapon = savedInstanceState.getShort("weapon");
      mType = savedInstanceState.getShort("type");
      mLevel = savedInstanceState.getShort("level");
      mSortMode = savedInstanceState.getShort("mode", (short) SORT_RARE);
    }

    mAdapter = new CompanionListAdapter();
    // Log.i("com/kagami/merusuto", "mAdapter:" + mAdapter.toString());

    listview.setAdapter(mAdapter);
    listview.setOnItemClickListener(new OnItemClickListener() {

      class ReadCompanionOriginalTask extends AsyncTask<Object, Void, Bitmap> {  

        private ProgressDialog mProgressDialog;

        @Override
        protected void onPreExecute() {
          mProgressDialog = ProgressDialog.show(getActivity(), 
            "请稍后再舔", "正在读取图片，请稍后...");
        }

        @Override
        protected Bitmap doInBackground(Object... params) {
          return Utils.readRemoteBitmap(getActivity(), (String) params[0], 
            (BitmapFactory.Options) params[1]);
        }  

        @Override  
        protected void onPostExecute(Bitmap bitmap) { 
          try { 
            mProgressDialog.dismiss();
            if (bitmap != null) {
              ImageDialog dialog = new ImageDialog(getActivity(), bitmap);
              dialog.show();
            }
          } catch (Exception e) {}
        }  
      }

      @Override
      public void onItemClick(AdapterView<?> parent, View view, 
        int position, long id) {
        String bitmapPath = "companions/original/" + id + ".png";
        BitmapFactory.Options options = new BitmapFactory.Options();
        options.inScaled = true;
        options.inDensity = 100;
        options.inTargetDensity = 150;

        Bitmap bitmap = Utils.readLocalBitmap(getActivity(), bitmapPath, options);

        if (bitmap == null) {
          new ReadCompanionOriginalTask().execute(bitmapPath, options);
        } else {
          ImageDialog dialog = new ImageDialog(getActivity(), bitmap);
          dialog.show();
        }

      }
    });

    return rootView;
  }
  
  @Override
  public void onSaveInstanceState(Bundle savedInstanceState) {
    // Log.i("com/kagami/merusuto", "savedInstanceState:" + savedInstanceState.toString());
    savedInstanceState.putShort("rare", (short) mRare);
    savedInstanceState.putShort("element", (short) mElement);
    savedInstanceState.putShort("weapon", (short) mWeapon);
    savedInstanceState.putShort("type", (short) mType);
    savedInstanceState.putShort("level", (short) mLevel);
    savedInstanceState.putShort("mode", (short) mSortMode);
  }

  private class CompanionListAdapter extends BaseAdapter {

    private List<CompanionItem> mAllData;
    private List<CompanionItem> mDisplayedData;

    private class ReadCompanionDataTask extends AsyncTask<Void, Void, JSONObject> {  
      
      @Override
      protected JSONObject doInBackground(Void... params) {
        return Utils.readRemoteJSONData(getActivity(), "companions.json");
      }  

      @Override  
      protected void onPostExecute(JSONObject json) { 
        if (json != null) {
          Iterator<?> keys = json.keys();
          while (keys.hasNext()) {
            String id = keys.next().toString();
            CompanionItem item = new CompanionItem(Integer.valueOf(id), 
              json.optJSONObject(id));
            mAllData.add(item);
          }

          search();
        } else {
          Toast.makeText(getActivity(), "网络错误，请稍候重试...", 
            Toast.LENGTH_SHORT).show();  
        }
      }  
    }

    public CompanionListAdapter() {
      mAllData = new ArrayList<CompanionItem>();
      mDisplayedData = new ArrayList<CompanionItem>();

      JSONObject json = Utils.readLocalJSONData(getActivity(), "companions.json");
      if (json == null) {
        new ReadCompanionDataTask().execute(); 
      } else {
        Iterator<?> keys = json.keys();
        while (keys.hasNext()) {
          String id = keys.next().toString();
          CompanionItem item = new CompanionItem(Integer.valueOf(id), 
            json.optJSONObject(id));
          mAllData.add(item);
        }

        search();
      }
    }
    
    public void search() {
      mDisplayedData.clear();
      
      for (CompanionItem item:mAllData)
        if ((mRare == 0 || item.rare == mRare) && 
          (mElement == 0 || item.element == mElement) && 
          (mWeapon == 0 || item.weapon == mWeapon) &&
          (mType == 0 || item.type == mType))
          mDisplayedData.add(item);

      sort();
    }

    public void sort() {
      Collections.sort(mDisplayedData, new Comparator<CompanionItem>() {

        @Override
        public int compare(CompanionItem lhs, CompanionItem rhs) {
          float l = 0f, r = 0f;

          switch (mSortMode) {
          case SORT_RARE:
            l = lhs.rare;
            r = rhs.rare;
            break;
          case SORT_DPS:
            l = lhs.getDPS(mLevel);
            r = rhs.getDPS(mLevel);
            break;
          case SORT_MULT_DPS:
            l = lhs.getMultDPS(mLevel);
            r = rhs.getMultDPS(mLevel);
            break;
          case SORT_ATK:
            l = lhs.getAtk(mLevel);
            r = rhs.getAtk(mLevel);
            break;
          case SORT_LIFE:
            l = lhs.getLife(mLevel);
            r = rhs.getLife(mLevel);
            break;
          case SORT_AAREA:
            l = lhs.aarea;
            r = rhs.aarea;
            break;
          case SORT_ANUM:
            l = lhs.anum;
            r = rhs.anum;
            break;
          case SORT_ASPD:
            l = rhs.aspd;
            l = l == 0f ? 9999f : l;
            r = lhs.aspd;
            break;
          case SORT_TENACITY:
            l = lhs.tenacity;
            r = rhs.tenacity;
            break;
          case SORT_MSPD:
            l = lhs.mspd;
            r = rhs.mspd;
            break;
          }
          
          if (l < r) return 1;
          else if (l == r) return 0;
          else return -1;
        }
      });

      notifyDataSetChanged();
    }

    @Override
    public int getCount() {
      return mDisplayedData.size();
    }

    @Override
    public Object getItem(int position) {
      return mDisplayedData.get(position);
    }

    @Override
    public long getItemId(int position) {
      return mDisplayedData.get(position).id;
    }

    private class ReadCompanionThumbnailTask extends AsyncTask<String, Void, Bitmap> {  
      
      private View mView;

      public ReadCompanionThumbnailTask(View view) {
        super();
        mView = view;
      }

      @Override
      protected void onPreExecute() {
        mView.setTag(this);
      }

      @Override
      protected Bitmap doInBackground(String... params) {
        return Utils.readRemoteBitmap(getActivity(), params[0], null);
      }  

      @Override  
      protected void onPostExecute(Bitmap bitmap) { 
        try {
          mView.setTag(null);
          if (bitmap != null) {
            ImageView thumbnailView = (ImageView) mView.findViewById(R.id.thumbnail);
            thumbnailView.setImageBitmap(bitmap);
          }
        } catch (Exception e) {}
      }  
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
      if (convertView == null || convertView.getTag() != null) {
        convertView = LayoutInflater.from(parent.getContext())
          .inflate(R.layout.cell_companion_item, null);
      }

      ImageView thumbnailView = (ImageView) convertView.findViewById(R.id.thumbnail);
      TextView nameView = (TextView) convertView.findViewById(R.id.name);
      TextView rareView = (TextView) convertView.findViewById(R.id.rare);
      ElementView elementView = (ElementView) convertView.findViewById(R.id.element);
      LinearLayout textLayout = (LinearLayout) convertView.findViewById(R.id.text_layout);

      CompanionItem item = (CompanionItem) getItem(position);

      String bitmapPath = "companions/thumbnail/" + item.id + ".png";
      Bitmap bitmap = Utils.readLocalBitmap(getActivity(), bitmapPath, null);
      if (bitmap == null) {
        thumbnailView.setImageResource(R.drawable.default_thumbnail);
        new ReadCompanionThumbnailTask(convertView).execute(bitmapPath);
      } else {
        thumbnailView.setImageBitmap(bitmap);
      }

      nameView.setText(item.title + item.name);
      rareView.setText(item.getRareString());
      elementView.setMode(item.element);
      elementView.setElement(item.fire, item.aqua, item.wind, item.light, item.dark);

      textLayout.removeAllViews();

      addUnitTextView(textLayout, String.format(
        "生命: %d\n攻击: %d\n攻距: %d\n攻数: %d",
        item.getLife(mLevel), item.getAtk(mLevel), item.aarea, item.anum));

      addUnitTextView(textLayout, String.format(
        "攻速: %.2f\n韧性: %d\n移速: %d\n成长: %s",
        item.aspd, item.tenacity, item.mspd, item.getTypeString()));

      int textViewNum = parent.getResources().getInteger(R.integer.text_view_num);
      // Log.i("com/kagami/merusuto", "textViewNum:" + textViewNum);

      if (textViewNum > 2) {
        addUnitTextView(textLayout, String.format(
          "火: %.0f%%\n水: %.0f%%\n风: %.0f%%\n光: %.0f%%",
          item.fire * 100, item.aqua * 100, item.wind * 100, 
          item.light * 100, item.dark * 100));
      }

      if (textViewNum > 3) {
        addUnitTextView(textLayout, String.format(
          "暗: %.0f%%\n\nDPS: %d\n总DPS: %d",
          item.dark * 100, item.getDPS(mLevel), item.getMultDPS(mLevel)));
      }

      return convertView;
    }

    private void addUnitTextView(LinearLayout layout, String text) {
      LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
        LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT, 1f);
      View textLayout = LayoutInflater.from(getActivity())
          .inflate(R.layout.text_view_companion_item, null);
      TextView textView = (TextView) textLayout.findViewById(R.id.text_view);
      textView.setText(text);
      layout.addView(textLayout, params);
    }
  }
}
