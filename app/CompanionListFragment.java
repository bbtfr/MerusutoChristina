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

  private CompanionListAdapter mAdapter;
  private int mRare = 0, mElement = 0, mWeapon = 0, mLevel = 0;
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
    
    if (savedInstanceState != null) {
      mRare = savedInstanceState.getShort("rare");
      mElement = savedInstanceState.getShort("element");
      mWeapon = savedInstanceState.getShort("weapon");
      mLevel = savedInstanceState.getShort("level");
      mSortMode = savedInstanceState.getShort("mode", (short) SORT_RARE);
    }

    mAdapter = new CompanionListAdapter();
    // Log.i("com/kagami/merusuto", "mAdapter:" + mAdapter.toString());

    listview.setAdapter(mAdapter);
    listview.setOnItemClickListener(new OnItemClickListener() {

      @Override
      public void onItemClick(AdapterView<?> parent, View view, 
        int position, long id) {
        Bitmap bitmap = null;
        try {
          BitmapFactory.Options options = new BitmapFactory.Options();
          options.inScaled = true;
          options.inDensity = 100;
          options.inTargetDensity = 150;
          bitmap = BitmapFactory.decodeStream(
            getResources().getAssets().open("original/" + id + ".png"),
            null, options);
        } catch (IOException e) {
          Log.e("com/kagami/merusuto", "File Not Found: " + e.getMessage());
        }

        if (bitmap == null) return;

        ImageDialog dialog = new ImageDialog(getActivity(), bitmap);
        dialog.show();
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
    savedInstanceState.putShort("level", (short) mLevel);
    savedInstanceState.putShort("mode", (short) mSortMode);
  }

  private class CompanionListAdapter extends BaseAdapter {

    private List<CompanionItem> mAllData;
    private List<CompanionItem> mDisplayedData;

    private class ReadCompanionDataTask extends AsyncTask<Void, Void, JSONObject> {  
      @Override
      protected JSONObject doInBackground(Void... params) {  
        return Utils.readCompanionData(getActivity());
      }  

      @Override  
      protected void onPostExecute(JSONObject json) { 
        if (json != null) {
          Iterator<?> keys = json.keys();
          while (keys.hasNext()) {
            String id = keys.next().toString();
            CompanionItem item = new CompanionItem(Integer.valueOf(id), json.optJSONObject(id));
            mAllData.add(item);
          }

          search();
        }
      }  
    }

    public CompanionListAdapter() {
      mAllData = new ArrayList<CompanionItem>();
      mDisplayedData = new ArrayList<CompanionItem>();

      new ReadCompanionDataTask().execute(); 
    }
    
    public void search() {
      mDisplayedData.clear();
      
      for (CompanionItem item:mAllData)
        if ((mRare == 0 || item.rare == mRare) && 
          (mElement == 0 || item.element == mElement) && 
          (mWeapon == 0 || item.weapon == mWeapon))
          mDisplayedData.add(item);

      sort();
    }

    public void sort() {
      Collections.sort(mDisplayedData, new Comparator<CompanionItem>() {

        @Override
        public int compare(CompanionItem lhs, CompanionItem rhs) {
          int l = 0, r = 0;

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

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
      if (convertView == null) {
        convertView = LayoutInflater.from(parent.getContext())
          .inflate(R.layout.cell_companion_item, null);
      }

      ImageView thumbnailView = (ImageView) convertView.findViewById(R.id.thumbnail);
      TextView nameView = (TextView) convertView.findViewById(R.id.name);
      TextView rareView = (TextView) convertView.findViewById(R.id.rare);
      ElementView elementView = (ElementView) convertView.findViewById(R.id.element);
      LinearLayout textLayout = (LinearLayout) convertView.findViewById(R.id.text_layout);

      Bitmap bitmap = null;
      try {
        bitmap = BitmapFactory.decodeStream(
          getResources().getAssets().open("thumbnail/" + getItemId(position) + ".png"));
      } catch (IOException e) {
        Log.e("com/kagami/merusuto", "File Not Found: " + e.getMessage());
      }

      if (bitmap == null)
        thumbnailView.setImageResource(R.drawable.default_thumbnail);
      else
        thumbnailView.setImageBitmap(bitmap);

      CompanionItem item = (CompanionItem) getItem(position);

      nameView.setText(item.title + item.name);
      rareView.setText(item.getRareString());
      elementView.setElement(item.fire, item.aqua, item.wind, item.light, item.dark);

      textLayout.removeAllViews();

      addUnitTextView(parent.getContext(), textLayout, String.format(
        "生命: %d\n攻击: %d\n射程: %d\n攻数: %d",
        item.getLife(mLevel), item.getAtk(mLevel), item.aarea, item.anum));

      addUnitTextView(parent.getContext(), textLayout, String.format(
        "攻速: %.2f\n韧性: %d\n移速: %d\n成长: %s",
        item.aspd, item.tenacity, item.mspd, item.getTypeString()));

      int textViewNum = parent.getResources().getInteger(R.integer.text_view_num);
      // Log.i("com/kagami/merusuto", "textViewNum:" + textViewNum);

      if (textViewNum > 2) {
        addUnitTextView(parent.getContext(), textLayout, String.format(
          "火: %.0f%%\n水: %.0f%%\n风: %.0f%%\n光: %.0f%%",
          item.fire * 100, item.aqua * 100, item.wind * 100, 
          item.light * 100, item.dark * 100));
      }

      if (textViewNum > 3) {
        addUnitTextView(parent.getContext(), textLayout, String.format(
          "暗: %.0f%%\n\nDPS: %d\n总DPS: %d",
          item.dark * 100, item.getDPS(mLevel), item.getMultDPS(mLevel)));
      }

      return convertView;
    }

    private void addUnitTextView(Context context, LinearLayout layout, String text) {
      LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
        LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT, 1f);
      View textLayout = LayoutInflater.from(context)
          .inflate(R.layout.text_view_companion_item, null);
      TextView textView = (TextView) textLayout.findViewById(R.id.text_view);
      textView.setText(text);
      layout.addView(textLayout, params);
    }
  }
}
