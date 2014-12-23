package com.kagami.merusuto;

import android.app.Activity;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.util.Log;

public class MainActivity extends Activity {

	private CompanionListFragment mCompanionListFragment;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		setContentView(R.layout.activity_main);
		getActionBar().setDisplayShowTitleEnabled(false);

		if (savedInstanceState == null) {
			mCompanionListFragment = new CompanionListFragment();
			getFragmentManager().beginTransaction()
				.add(R.id.container, mCompanionListFragment, "CompanionListFragment")
				.commit();
		} else {
			mCompanionListFragment = (CompanionListFragment) getFragmentManager()
				.findFragmentByTag("CompanionListFragment");
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
			mCompanionListFragment.setRare(0);
			break;
		case R.id.menu_rare_1:
			mCompanionListFragment.setRare(1);
			break;
		case R.id.menu_rare_2:
			mCompanionListFragment.setRare(2);
			break;
		case R.id.menu_rare_3:
			mCompanionListFragment.setRare(3);
			break;
		case R.id.menu_rare_4:
			mCompanionListFragment.setRare(4);
			break;
		case R.id.menu_rare_5:
			mCompanionListFragment.setRare(5);
			break;
		case R.id.menu_element_0:
			mCompanionListFragment.setElement(0);
			break;
		case R.id.menu_element_1:
			mCompanionListFragment.setElement(1);
			break;
		case R.id.menu_element_2:
			mCompanionListFragment.setElement(2);
			break;
		case R.id.menu_element_3:
			mCompanionListFragment.setElement(3);
			break;
		case R.id.menu_element_4:
			mCompanionListFragment.setElement(4);
			break;
		case R.id.menu_element_5:
			mCompanionListFragment.setElement(5);
			break;
		case R.id.menu_weapon_0:
			mCompanionListFragment.setWeapon(0);
			break;
		case R.id.menu_weapon_1:
			mCompanionListFragment.setWeapon(1);
			break;
		case R.id.menu_weapon_2:
			mCompanionListFragment.setWeapon(2);
			break;
		case R.id.menu_weapon_3:
			mCompanionListFragment.setWeapon(3);
			break;
		case R.id.menu_weapon_4:
			mCompanionListFragment.setWeapon(4);
			break;
		case R.id.menu_weapon_5:
			mCompanionListFragment.setWeapon(5);
			break;
		case R.id.menu_weapon_6:
			mCompanionListFragment.setWeapon(6);
			break;
		case R.id.menu_weapon_7:
			mCompanionListFragment.setWeapon(7);
			break;
		case R.id.menu_type_0:
			mCompanionListFragment.setType(0);
			break;
		case R.id.menu_type_1:
			mCompanionListFragment.setType(1);
			break;
		case R.id.menu_type_2:
			mCompanionListFragment.setType(2);
			break;
		case R.id.menu_type_3:
			mCompanionListFragment.setType(3);
			break;
		case R.id.menu_sort_rare:
			mCompanionListFragment.setSortMode(CompanionListFragment.SORT_RARE);
			break;
		case R.id.menu_sort_dps:
			mCompanionListFragment.setSortMode(CompanionListFragment.SORT_DPS);
			break;
		case R.id.menu_sort_mult_dps:
			mCompanionListFragment.setSortMode(CompanionListFragment.SORT_MULT_DPS);
			break;
		case R.id.menu_sort_life:
			mCompanionListFragment.setSortMode(CompanionListFragment.SORT_LIFE);
			break;
		case R.id.menu_sort_atk:
			mCompanionListFragment.setSortMode(CompanionListFragment.SORT_ATK);
			break;
		case R.id.menu_sort_aarea:
			mCompanionListFragment.setSortMode(CompanionListFragment.SORT_AAREA);
			break;
		case R.id.menu_sort_anum:
			mCompanionListFragment.setSortMode(CompanionListFragment.SORT_ANUM);
			break;
		case R.id.menu_sort_aspd:
			mCompanionListFragment.setSortMode(CompanionListFragment.SORT_ASPD);
			break;
		case R.id.menu_sort_tenacity:
			mCompanionListFragment.setSortMode(CompanionListFragment.SORT_TENACITY);
			break;
		case R.id.menu_sort_mspd:
			mCompanionListFragment.setSortMode(CompanionListFragment.SORT_MSPD);
			break;
		case R.id.menu_level_0:
			mCompanionListFragment.setLevel(0);
			break;
		case R.id.menu_level_1:
			mCompanionListFragment.setLevel(1);
			break;
		case R.id.menu_level_2:
			mCompanionListFragment.setLevel(2);
			break;
		case R.id.menu_reset:
			mCompanionListFragment.reset();
			break;
		}

		return super.onOptionsItemSelected(item);
	}

}
