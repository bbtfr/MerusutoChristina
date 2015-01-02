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
import android.content.DialogInterface;
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

public class UnitListFragment extends Fragment {

  public final static int SORT_RARE = 0;
  public final static int SORT_DPS = 1;
  public final static int SORT_MULT_DPS = 2;
  public final static int SORT_LIFE = 3;
  public final static int SORT_ATK = 4;
  public final static int SORT_AAREA = 5;
  public final static int SORT_ANUM = 6;
  public final static int SORT_ASPD = 7;
  public final static int SORT_TENACITY = 8;
  public final static int SORT_MSPD = 9;

  public final static int LEVEL_ZERO = 0;
  public final static int LEVEL_MAX_LV = 1;
  public final static int LEVEL_MAX_LV_GR = 2;

  public final static int TEMPLATE_COMPANION = 0;
  public final static int TEMPLATE_FAMILIAR = 1;

  private UnitListAdapter mAdapter;
  private int mRare = 0, mElement = 0, mWeapon = 0, mType = 0, mSkin = 0;
  private int mLevel = 0, mGrow = 0;
  private int mSortMode = 0, mLevelMode = 0;
  private int mTemplate = 0;

  private ListView mListView;

  public UnitListFragment() {
    super();
  }

  public int getTemplate() {
    return mTemplate;
  }

  public String getTemplateString() {
    String[] templates = { "companions", "familiars" };
    int index = mTemplate >= 0 && mTemplate < 2 ? mTemplate : 0;
    return templates[index];
  }

  public void setTemplate(int template) {
    mTemplate = template;
    if (mTemplate == TEMPLATE_COMPANION) {
      mSkin = 0;
    } else if (mTemplate == TEMPLATE_FAMILIAR) {
      mType = mLevelMode = 0;
    }
    mAdapter.reload();
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

  public void setSkin(int skin) {
    mSkin = skin;
    mAdapter.sort();
  }

  public void setLevelMode(int mode) {
    mLevelMode = mode;
    mAdapter.sort();
  }

  public void setSortMode(int mode) {
    mSortMode = mode;
    mAdapter.sort();
  }

  public void reset() {
    mRare = mElement = mWeapon = mLevelMode = 0;
    mAdapter.search();
  }

  public void scrollToTop() {
    mListView.post(new Runnable() {

      @Override
      public void run() {
        mListView.setSelection(0);
        mListView.smoothScrollToPosition(0);
      }
    });
  }

  @Override
  public View onCreateView(LayoutInflater inflater, ViewGroup container, 
    Bundle savedInstanceState) {
    View rootView = inflater.inflate(R.layout.fragment_companion_list, 
      container, false);
    mListView = (ListView) rootView.findViewById(R.id.companion_list);
    
    if (savedInstanceState != null) {
      onLoadInstanceState(savedInstanceState);
    }

    mAdapter = new UnitListAdapter();

    mListView.setAdapter(mAdapter);
    mListView.setOnItemClickListener(new OnItemClickListener() {

      class ReadUnitOriginalTask extends AsyncTask<Object, Void, Bitmap> {  

        private ProgressDialog mProgressDialog;

        @Override
        protected void onPreExecute() {
          mProgressDialog = new ProgressDialog(getActivity());
          mProgressDialog.setButton("取消", new DialogInterface.OnClickListener() {

            @Override
            public void onClick(DialogInterface dialog, int which) {
              mProgressDialog.dismiss();
              mProgressDialog = null;
            }
          });
          mProgressDialog.setCanceledOnTouchOutside(false);
          mProgressDialog.setTitle("请稍后再舔");
          mProgressDialog.setMessage("正在下载图片，请稍后...");
          mProgressDialog.show();
        }

        @Override
        protected Bitmap doInBackground(Object... params) {
          return Utils.readRemoteBitmap(getActivity(), (String) params[0], 
            (BitmapFactory.Options) params[1]);
        }  

        @Override  
        protected void onPostExecute(Bitmap bitmap) { 
          try { 
            if (bitmap != null && mProgressDialog != null) {
              mProgressDialog.dismiss();
              ImageDialog dialog = new ImageDialog(getActivity(), bitmap);
              dialog.show();
            }
          } catch (Exception e) {}
        }  
      }

      @Override
      public void onItemClick(AdapterView<?> parent, View view, 
        int position, long id) {
        String bitmapPath = getTemplateString() + "/original/" + id + ".png";
        BitmapFactory.Options options = new BitmapFactory.Options();
        options.inScaled = true;
        options.inDensity = 100;
        options.inTargetDensity = 150;

        Bitmap bitmap = Utils.readLocalBitmap(getActivity(), bitmapPath, options);

        if (bitmap == null) {
          new ReadUnitOriginalTask().execute(bitmapPath, options);
        } else {
          ImageDialog dialog = new ImageDialog(getActivity(), bitmap);
          dialog.show();
        }

      }
    });

    return rootView;
  }

  public void onLoadInstanceState(Bundle savedInstanceState) {
    mRare = savedInstanceState.getInt("rare");
    mElement = savedInstanceState.getInt("element");
    mWeapon = savedInstanceState.getInt("weapon");
    mType = savedInstanceState.getInt("type");
    mLevelMode = savedInstanceState.getInt("levelMode");
    mSortMode = savedInstanceState.getInt("sortMode");
    mTemplate = savedInstanceState.getInt("template");
  }
  
  @Override
  public void onSaveInstanceState(Bundle savedInstanceState) {
    savedInstanceState.putInt("rare", mRare);
    savedInstanceState.putInt("element", mElement);
    savedInstanceState.putInt("weapon", mWeapon);
    savedInstanceState.putInt("type", mType);
    savedInstanceState.putInt("levelMode", mLevelMode);
    savedInstanceState.putInt("sortMode", mSortMode);
    savedInstanceState.putInt("template", mTemplate);
  }

  private class UnitListAdapter extends BaseAdapter {

    private List<UnitItem> mAllData;
    private List<UnitItem> mDisplayedData;

    private class ReadUnitDataTask extends AsyncTask<Void, Void, JSONObject> {  
      
      @Override
      protected JSONObject doInBackground(Void... params) {
        return Utils.readRemoteJSONData(getActivity(), getTemplateString() + ".json");
      }  

      @Override  
      protected void onPostExecute(JSONObject json) { 
        if (json != null) {
          addAllJSONData(json);
          search();
        } else {
          Toast.makeText(getActivity(), "网络错误，请稍候重试...", 
            Toast.LENGTH_SHORT).show();  
        }
      }  
    }

    public UnitListAdapter() {
      mAllData = new ArrayList<UnitItem>();
      mDisplayedData = new ArrayList<UnitItem>();
      reload();
    }

    public void reload() {
      mAllData.clear();
      mDisplayedData.clear();
      notifyDataSetChanged();

      JSONObject json = Utils.readLocalJSONData(getActivity(), getTemplateString() + ".json");
      if (json == null) {
        Toast.makeText(getActivity(), "正在读取数据，请稍候...", 
          Toast.LENGTH_SHORT).show();  
        new ReadUnitDataTask().execute(); 
      } else {
        addAllJSONData(json);
        search();
      }
    }

    public void addAllJSONData(JSONObject json) {
      Iterator<?> keys = json.keys();
      while (keys.hasNext()) {
        String id = keys.next().toString();
        UnitItem item = new UnitItem(Integer.valueOf(id), 
          json.optJSONObject(id));
        mAllData.add(item);
      }
    }
    
    public void search() {
      mDisplayedData.clear();
      
      for (UnitItem item: mAllData)
        if ((mRare == 0 || item.rare == mRare) && 
          (mElement == 0 || item.element == mElement) && 
          (mWeapon == 0 || item.weapon == mWeapon) &&
          (mType == 0 || item.type == mType) &&
          (mSkin == 0 || item.skin == mSkin))
          mDisplayedData.add(item);

      sort();
    }

    public void sort() {
      Collections.sort(mDisplayedData, new Comparator<UnitItem>() {

        @Override
        public int compare(UnitItem lhs, UnitItem rhs) {
          float l = 0f, r = 0f;

          switch (mSortMode) {
          case SORT_RARE:
            l = lhs.rare;
            r = rhs.rare;
            break;
          case SORT_DPS:
            l = lhs.getDPS(mLevelMode);
            r = rhs.getDPS(mLevelMode);
            break;
          case SORT_MULT_DPS:
            l = lhs.getMultDPS(mLevelMode);
            r = rhs.getMultDPS(mLevelMode);
            break;
          case SORT_ATK:
            l = lhs.getAtk(mLevelMode);
            r = rhs.getAtk(mLevelMode);
            break;
          case SORT_LIFE:
            l = lhs.getLife(mLevelMode);
            r = rhs.getLife(mLevelMode);
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

    private class ReadUnitThumbnailTask extends AsyncTask<String, Void, Bitmap> {  
      
      private View mView;

      public ReadUnitThumbnailTask(View view) {
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

      UnitItem item = (UnitItem) getItem(position);

      String bitmapPath = getTemplateString() + "/thumbnail/" + item.id + ".png";
      Bitmap bitmap = Utils.readLocalBitmap(getActivity(), bitmapPath, null);
      if (bitmap == null) {
        thumbnailView.setImageResource(R.drawable.default_thumbnail);
        new ReadUnitThumbnailTask(convertView).execute(bitmapPath);
      } else {
        thumbnailView.setImageBitmap(bitmap);
      }

      nameView.setText(item.title + item.name);
      rareView.setText(item.getRareString());
      elementView.setMode(item.element);
      elementView.setElement(item.fire, item.aqua, item.wind, item.light, item.dark);

      textLayout.removeAllViews();

      int textViewNum = parent.getResources().getInteger(R.integer.text_view_num);
      // Log.i("com/kagami/merusuto", "textViewNum:" + textViewNum);

      addUnitTextView(textLayout, String.format(
        "生命: %d\n攻击: %d\n攻距: %d\n攻数: %d",
        item.getLife(mLevelMode), item.getAtk(mLevelMode), item.aarea, item.anum));

      if (mTemplate == TEMPLATE_COMPANION) {
        addUnitTextView(textLayout, String.format(
          "攻速: %.2f\n韧性: %d\n移速: %d\n成长: %s",
          item.aspd, item.tenacity, item.mspd, item.getTypeString()));

        if (textViewNum > 2) {
          addUnitTextView(textLayout, String.format(
            "火: %.0f%%\n水: %.0f%%\n风: %.0f%%\n光: %.0f%%",
            item.fire * 100, item.aqua * 100, item.wind * 100, 
            item.light * 100, item.dark * 100));
        }

        if (textViewNum > 3) {
          addUnitTextView(textLayout, String.format(
            "暗: %.0f%%\n国家: %s\nDPS: %d\n总DPS: %d",
            item.dark * 100, item.country, item.getDPS(mLevelMode), 
            item.getMultDPS(mLevelMode)));
        }

      } else if (mTemplate == TEMPLATE_FAMILIAR) {
        addUnitTextView(textLayout, String.format(
          "攻速: %.2f\n韧性: %d\n移速: %d\n皮肤: %s",
          item.aspd, item.tenacity, item.mspd, item.getSkinString()));

        if (textViewNum > 2) {
          addUnitTextView(textLayout, String.format(
            "技能消耗: %dSP\n技能冷却: %d\n技能: %s",
            item.sklsp, item.sklcd, item.skill));
        }

        if (textViewNum > 3) {
          addUnitTextView(textLayout, String.format(
            "获取: %s\n\nDPS: %d\n总DPS: %d",
            item.obtain, item.getDPS(mLevelMode), 
            item.getMultDPS(mLevelMode)));
        }
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
