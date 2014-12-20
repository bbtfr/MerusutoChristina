package com.kagami.merusuto;

import android.app.Activity;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.util.Log;

public class MainActivity extends Activity {

	private UnitListFragment mUnitListFragment;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		setContentView(R.layout.activity_main);
		getActionBar().setDisplayShowTitleEnabled(false);

		if (savedInstanceState == null) {
			mUnitListFragment = new UnitListFragment();
			getFragmentManager().beginTransaction()
				.add(R.id.container, mUnitListFragment, "UnitListFragment")
				.commit();
		} else {
			mUnitListFragment = (UnitListFragment) getFragmentManager()
				.findFragmentByTag("UnitListFragment");
		}
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		getMenuInflater().inflate(R.menu.main, menu);
		return true;
	}

	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
		switch (item.getItemId()) {
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
		case R.id.menu_sort_rare:
			mUnitListFragment.setSortMode(UnitListFragment.SORT_RARE);
			break;
		case R.id.menu_sort_dps:
			mUnitListFragment.setSortMode(UnitListFragment.SORT_DPS);
			break;
		case R.id.menu_sort_mult_dps:
			mUnitListFragment.setSortMode(UnitListFragment.SORT_MULT_DPS);
			break;
		case R.id.menu_sort_atk:
			mUnitListFragment.setSortMode(UnitListFragment.SORT_ATK);
			break;
		case R.id.menu_sort_life:
			mUnitListFragment.setSortMode(UnitListFragment.SORT_LIFE);
			break;
		case R.id.menu_level_0:
			mUnitListFragment.setLevel(0);
			break;
		case R.id.menu_level_1:
			mUnitListFragment.setLevel(1);
			break;
		case R.id.menu_level_2:
			mUnitListFragment.setLevel(2);
			break;
		case R.id.menu_reset:
			mUnitListFragment.reset();
			break;
		}

		return super.onOptionsItemSelected(item);
	}

}
