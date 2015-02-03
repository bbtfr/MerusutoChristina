package com.kagami.merusuto;

import android.app.Activity;
import android.app.ActionBar;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.Environment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.BaseAdapter;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.SearchView;
import android.widget.TextView;
import android.support.v4.app.ActionBarDrawerToggle;
import android.support.v4.widget.DrawerLayout;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.BufferedOutputStream;
import java.util.ArrayList;
import java.util.TreeSet;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;
import java.util.zip.ZipInputStream;

public class MainActivity extends Activity {

  public final static int ID_TEMPLATE_UNIT = 1;
  public final static int ID_TEMPLATE_MONSTER = 2;
  public final static int ID_LOAD_ZIP_DATA = 4;

  private UnitListFragment mUnitListFragment;
  private ActionBarDrawerToggle mDrawerToggle;
  private MenuItem mSearchMenu;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    setContentView(R.layout.activity_main);
    ActionBar actionBar = getActionBar();
    actionBar.setDisplayShowHomeEnabled(true);
    actionBar.setDisplayShowTitleEnabled(false);
    actionBar.setDisplayHomeAsUpEnabled(true);
    actionBar.setIcon(R.drawable.ic_logo);

    final ListView drawerList = (ListView) findViewById(R.id.left_drawer);

    Resources resources = getResources();
    DrawerListAdapter adapter = new DrawerListAdapter(this);
    adapter.addSectionHeaderItem(resources.getString(R.string.template));
    for (String title: resources.getStringArray(R.array.template_array)) {
      adapter.addItem(title);
    }
    adapter.addSectionHeaderItem(resources.getString(R.string.setting));
    for (String title: resources.getStringArray(R.array.setting_array)) {
      adapter.addItem(title);
    }

    final DrawerLayout drawerLayout = (DrawerLayout) findViewById(R.id.drawer_layout);

    drawerList.setAdapter(adapter);
    drawerList.setOnItemClickListener(new ListView.OnItemClickListener() {

      @Override
      public void onItemClick(AdapterView parent, View view, int position, long id) {
        drawerLayout.closeDrawer(drawerList);

        switch (position) {
        case ID_TEMPLATE_UNIT:
          mUnitListFragment.setTemplate(UnitListFragment.TEMPLATE_UNIT);
          invalidateOptionsMenu();
          break;
        case ID_TEMPLATE_MONSTER:
          mUnitListFragment.setTemplate(UnitListFragment.TEMPLATE_MONSTER);
          invalidateOptionsMenu();
          break;
        case ID_LOAD_ZIP_DATA:
          Intent intent = new Intent();
          intent.setAction(Intent.ACTION_GET_CONTENT);
          intent.setType("application/zip");
          startActivityForResult(intent, ID_LOAD_ZIP_DATA);
          break;
        }
      }
    });

    if (savedInstanceState == null) {
      mUnitListFragment = new UnitListFragment();
      getFragmentManager().beginTransaction()
        .add(R.id.content_frame, mUnitListFragment, "UnitListFragment")
        .commit();
    } else {
      mUnitListFragment = (UnitListFragment) getFragmentManager()
        .findFragmentByTag("UnitListFragment");
    }
  }

  @Override
  public boolean onCreateOptionsMenu(final Menu menu) {
    switch (mUnitListFragment.getTemplate()) {
    case UnitListFragment.TEMPLATE_UNIT:
      getMenuInflater().inflate(R.menu.options_unit, menu);
      break;
    case UnitListFragment.TEMPLATE_MONSTER:
      getMenuInflater().inflate(R.menu.options_monster, menu);
      break;
    }

    mSearchMenu = menu.findItem(R.id.menu_search);
    mSearchMenu.setOnActionExpandListener(new MenuItem.OnActionExpandListener() {

      public void setMenuItemVisible(boolean visible) {
        MenuItem menuItem;
        menuItem = menu.findItem(R.id.menu_level_mode);
        if (menuItem != null) menuItem.setVisible(visible);
        menuItem = menu.findItem(R.id.menu_sort_mode);
        menuItem.setVisible(visible);
        menuItem = menu.findItem(R.id.menu_filters);
        menuItem.setVisible(visible);
        menuItem = menu.findItem(R.id.menu_close_search);
        menuItem.setVisible(!visible);
      }

      @Override
      public boolean onMenuItemActionCollapse(MenuItem item) {
        mUnitListFragment.setSearchQuery(null);
        setMenuItemVisible(true);
        return true;
      }

      @Override
      public boolean onMenuItemActionExpand(MenuItem item) {
        setMenuItemVisible(false);
        return true;
      }
    });

    SearchView searchView = (SearchView) mSearchMenu.getActionView();
    searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
      @Override
      public boolean onQueryTextChange(String query) {
        if (query.isEmpty()) query = null;
        mUnitListFragment.setSearchQuery(query);
        return true;
      }

      @Override
      public boolean  onQueryTextSubmit(String query) {
        mUnitListFragment.setSearchQuery(query);
        return true;
      }
    });

    return true;
  }

  @Override
  public boolean onOptionsItemSelected(MenuItem item) {
    switch (item.getItemId()) {
    case android.R.id.home:
      mUnitListFragment.scrollToTop();
      break;
    case R.id.menu_close_search:
      mSearchMenu.collapseActionView();
      break;
    case R.id.menu_rare_0:
      mUnitListFragment.setRare(0);
      break;
    case R.id.menu_rare_1:
      mUnitListFragment.setRare(1);
      break;
    case R.id.menu_rare_2:
      mUnitListFragment.setRare(2);
      break;
    case R.id.menu_rare_3:
      mUnitListFragment.setRare(3);
      break;
    case R.id.menu_rare_4:
      mUnitListFragment.setRare(4);
      break;
    case R.id.menu_rare_5:
      mUnitListFragment.setRare(5);
      break;
    case R.id.menu_element_0:
      mUnitListFragment.setElement(0);
      break;
    case R.id.menu_element_1:
      mUnitListFragment.setElement(1);
      break;
    case R.id.menu_element_2:
      mUnitListFragment.setElement(2);
      break;
    case R.id.menu_element_3:
      mUnitListFragment.setElement(3);
      break;
    case R.id.menu_element_4:
      mUnitListFragment.setElement(4);
      break;
    case R.id.menu_element_5:
      mUnitListFragment.setElement(5);
      break;
    case R.id.menu_weapon_0:
      mUnitListFragment.setWeapon(0);
      break;
    case R.id.menu_weapon_1:
      mUnitListFragment.setWeapon(1);
      break;
    case R.id.menu_weapon_2:
      mUnitListFragment.setWeapon(2);
      break;
    case R.id.menu_weapon_3:
      mUnitListFragment.setWeapon(3);
      break;
    case R.id.menu_weapon_4:
      mUnitListFragment.setWeapon(4);
      break;
    case R.id.menu_weapon_5:
      mUnitListFragment.setWeapon(5);
      break;
    case R.id.menu_weapon_6:
      mUnitListFragment.setWeapon(6);
      break;
    case R.id.menu_weapon_7:
      mUnitListFragment.setWeapon(7);
      break;
    case R.id.menu_type_0:
      mUnitListFragment.setType(0);
      break;
    case R.id.menu_type_1:
      mUnitListFragment.setType(1);
      break;
    case R.id.menu_type_2:
      mUnitListFragment.setType(2);
      break;
    case R.id.menu_type_3:
      mUnitListFragment.setType(3);
      break;
    case R.id.menu_skin_0:
      mUnitListFragment.setSkin(0);
      break;
    case R.id.menu_skin_1:
      mUnitListFragment.setSkin(1);
      break;
    case R.id.menu_skin_2:
      mUnitListFragment.setSkin(2);
      break;
    case R.id.menu_skin_3:
      mUnitListFragment.setSkin(3);
      break;
    case R.id.menu_sort_rare:
      mUnitListFragment.setSortMode(UnitListFragment.SORT_RARE);
      break;
    case R.id.menu_sort_dps:
      mUnitListFragment.setSortMode(UnitListFragment.SORT_DPS);
      break;
    case R.id.menu_sort_mult_dps:
      mUnitListFragment.setSortMode(UnitListFragment.SORT_MULT_DPS);
      break;
    case R.id.menu_sort_life:
      mUnitListFragment.setSortMode(UnitListFragment.SORT_LIFE);
      break;
    case R.id.menu_sort_atk:
      mUnitListFragment.setSortMode(UnitListFragment.SORT_ATK);
      break;
    case R.id.menu_sort_aarea:
      mUnitListFragment.setSortMode(UnitListFragment.SORT_AAREA);
      break;
    case R.id.menu_sort_anum:
      mUnitListFragment.setSortMode(UnitListFragment.SORT_ANUM);
      break;
    case R.id.menu_sort_aspd:
      mUnitListFragment.setSortMode(UnitListFragment.SORT_ASPD);
      break;
    case R.id.menu_sort_tenacity:
      mUnitListFragment.setSortMode(UnitListFragment.SORT_TENACITY);
      break;
    case R.id.menu_sort_mspd:
      mUnitListFragment.setSortMode(UnitListFragment.SORT_MSPD);
      break;
    case R.id.menu_level_zero:
      mUnitListFragment.setLevelMode(UnitListFragment.LEVEL_ZERO);
      break;
    case R.id.menu_level_max_lv:
      mUnitListFragment.setLevelMode(UnitListFragment.LEVEL_MAX_LV);
      break;
    case R.id.menu_level_max_lv_gr:
      mUnitListFragment.setLevelMode(UnitListFragment.LEVEL_MAX_LV_GR);
      break;
    case R.id.menu_reset:
      mUnitListFragment.reset();
      break;
    }

    return super.onOptionsItemSelected(item);
  }

  private class DecompressTask extends AsyncTask<Integer, Integer, Void> {

    private ProgressDialog mProgressDialog = null;
    private String mFilename;
    private int mProgress = 0;

    public DecompressTask(String filename) {
      mFilename = filename;
    }

    @Override
    protected void onPreExecute() {
      try {
        int size = new ZipFile(mFilename).size();
        Log.i("com/kagami/merusuto", "Unzip file: " + mFilename);

        mProgressDialog = new ProgressDialog(MainActivity.this);
        mProgressDialog.setButton("取消", new DialogInterface.OnClickListener() {

          @Override
          public void onClick(DialogInterface dialog, int which) {
            mProgressDialog.dismiss();
            mProgressDialog = null;
          }
        });
        mProgressDialog.setProgressStyle(ProgressDialog.STYLE_HORIZONTAL);
        mProgressDialog.setCanceledOnTouchOutside(false);
        mProgressDialog.setTitle("请稍后再舔");
        mProgressDialog.setMessage("正在加载数据，请稍后...");
        mProgressDialog.setMax(size);
        mProgressDialog.show();
      } catch(Exception e) {
        Log.e("com/kagami/merusuto", e.getMessage(), e);
      }
    }

    @Override
    protected Void doInBackground(Integer... param) {
      try  {
        File location = new File(Environment.getExternalStorageDirectory(),
          "merusuto/");

        FileInputStream fin = new FileInputStream(mFilename);
        ZipInputStream zin = new ZipInputStream(fin);
        ZipEntry entry = null;
        while ((entry = zin.getNextEntry()) != null) {
          String name = entry.getName();
          File file = new File(location, name);

          if (entry.isDirectory()) {
            if (!file.isDirectory()) {
              file.mkdirs();
            }
          } else {
            publishProgress(mProgress++);

            int size;
            byte[] buffer = new byte[2048];

            FileOutputStream fout = new FileOutputStream(file);
            BufferedOutputStream bout = new BufferedOutputStream(fout, buffer.length);

            while ((size = zin.read(buffer, 0, buffer.length)) != -1) {
              bout.write(buffer, 0, size);
            }

            bout.flush();
            bout.close();
            fout.close();
            zin.closeEntry();
          }
        }
        zin.close();
        fin.close();
      } catch(Exception e) {
        Log.e("com/kagami/merusuto", e.getMessage(), e);
      }
      return null;
    }

    @Override
    protected void onProgressUpdate(Integer... values) {
      if (mProgressDialog != null)
        mProgressDialog.setProgress(mProgress);
    }

    @Override
    protected void onPostExecute(Void result) {
      if (mProgressDialog != null)
        mProgressDialog.dismiss();
    }
  }

  @Override
  protected void onActivityResult(int requestCode, int resultCode, Intent data) {
    if (resultCode != Activity.RESULT_OK) {
      return;
    }

    switch (requestCode) {
    case ID_LOAD_ZIP_DATA:
      String filename = data.getData().getPath();
      new DecompressTask(filename).execute();
      break;
    }
  }

  private class DrawerListAdapter extends BaseAdapter {

    private static final int TYPE_ITEM = 0;
    private static final int TYPE_SEPARATOR = 1;

    private ArrayList<String> mData = new ArrayList<String>();
    private TreeSet<Integer> sectionHeader = new TreeSet<Integer>();

    private LayoutInflater mInflater;

    public DrawerListAdapter(Context context) {
      mInflater = (LayoutInflater) context
          .getSystemService(Context.LAYOUT_INFLATER_SERVICE);
    }

    public void addItem(final String item) {
      mData.add(item);
      notifyDataSetChanged();
    }

    public void addSectionHeaderItem(final String item) {
      mData.add(item);
      sectionHeader.add(mData.size() - 1);
      notifyDataSetChanged();
    }

    @Override
    public int getItemViewType(int position) {
      return sectionHeader.contains(position) ? TYPE_SEPARATOR : TYPE_ITEM;
    }

    @Override
    public int getViewTypeCount() {
      return 2;
    }

    @Override
    public int getCount() {
      return mData.size();
    }

    @Override
    public String getItem(int position) {
      return mData.get(position);
    }

    @Override
    public long getItemId(int position) {
      return position;
    }

    public View getView(int position, View convertView, ViewGroup parent) {
      ViewHolder holder = null;
      int rowType = getItemViewType(position);

      if (convertView == null) {
        holder = new ViewHolder();
        switch (rowType) {
        case TYPE_ITEM:
          convertView = mInflater.inflate(R.layout.drawer_listview_item, null);
          holder.textView = (TextView) convertView.findViewById(R.id.text);
          break;
        case TYPE_SEPARATOR:
          convertView = mInflater.inflate(R.layout.drawer_listview_item_separator, null);
          holder.textView = (TextView) convertView.findViewById(R.id.textSeparator);
          break;
        }
        convertView.setTag(holder);
      } else {
        holder = (ViewHolder) convertView.getTag();
      }
      holder.textView.setText(mData.get(position));

      return convertView;
    }

    private class ViewHolder {
      public TextView textView;
    }
  }
}
