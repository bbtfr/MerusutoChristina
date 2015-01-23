package com.kagami.merusuto;

import org.json.JSONObject;

public class UnitItem {

  public String name;
  public int id;
  public int rare;
  public int element; // 1火 2水 3风 4光 5暗

  public float fire;
  public float aqua;
  public float wind;
  public float light;
  public float dark;

  // =====
  // 同伴
  public String title;
  public int atk;
  public int life;
  public int mspd;
  public int tenacity;
  public float aspd;
  public String country;

  public int weapon; // 1斩击 2突击 3打击 4弓箭 5魔法 6铳弹 7回复
  public int aarea;
  public int anum;
  public int type; // 1早熟 2平均 3晚成
  // =====

  // =====
  // 魔宠
  public int skin; // 1坚硬 2常规 3柔软
  public int sklsp;
  public int sklcd;
  public String skill;
  public String obtain;
  // =====
  public UnitItem(JSONObject json) {
    this.id = json.optInt("id", 0);
    this.name = json.optString("name", "");
    this.rare = json.optInt("rare", 0);
    this.element = json.optInt("element", 0);

    this.fire = (float)json.optDouble("fire", 0);
    this.aqua = (float)json.optDouble("aqua", 0);
    this.wind = (float)json.optDouble("wind", 0);
    this.light = (float)json.optDouble("light", 0);
    this.dark = (float)json.optDouble("dark", 0);

    this.title = json.optString("title", "");
    this.life = json.optInt("life", 0);
    this.atk = json.optInt("atk", 0);
    this.mspd = json.optInt("mspd", 0);
    this.aspd = (float) json.optDouble("aspd", 0);
    this.tenacity = json.optInt("tenacity", 0);
    this.weapon = json.optInt("weapon", 0);
    this.aarea = json.optInt("aarea", 0);
    this.type = json.optInt("type", 0);
    this.anum = json.optInt("anum", 0);
    this.country = json.optString("country", "");

    this.skin = json.optInt("skin", 0);
    this.sklsp = json.optInt("sklsp", 0);
    this.sklcd = json.optInt("sklcd", 0);
    this.skill = json.optString("skill", "");
    this.obtain = json.optString("obtain", "");
  }

  public String getRareString() {
    String[] elements = { "", "★", "★★", "★★★", "★★★★", "★★★★★" };
    int index = rare >= 0 && rare < 6 ? rare : 0;
    return elements[index];
  }

  public String getElementString() {
    String[] elements = { "", "火", "水", "风", "光", "暗" };
    int index = element >= 0 && element < 6 ? element : 0;
    return elements[index];
  }

  // =====
  // 同伴
  public String getTypeString() {
    String[] types = { "", "早熟", "平均", "晚成" };
    int index = type >= 0 && type < 4 ? type : 0;
    return types[index];
  }

  private float calcF() {
    return 1.8f + 0.1f * type;
  }

  // 零觉满级
  private int calcMaxLv(int value) {
    return (int) (value * calcF());
  }

  // 满觉满级
  private int calcMaxLvAndGrow(int value) {
    float f = calcF();
    int levelPart = (int) (value * f);
    int growPart = ((int) (value * (f - 1) / (19 + 10 * rare))) *
      5 * (rare == 1 ? 5 : 15);
    return levelPart + growPart;
  }

  // 满觉满级
  private int calcByLevel(int mode, int value) {
    switch (mode) {
    case 1:
      return calcMaxLv(value);
    case 2:
      return calcMaxLvAndGrow(value);
    default:
      return value;
    }
  }

  public int getAtk(int mode) {
    return (int) calcByLevel(mode, atk);
  }

  public int getLife(int mode) {
    return (int) calcByLevel(mode, life);
  }

  public float calcDPS(int mode) {
    return calcByLevel(mode, atk) / aspd;
  }

  public int getDPS(int mode) {
    return (int) calcDPS(mode);
  }

  public int getMultDPS(int mode) {
    return (int) calcDPS(mode) * anum;
  }
  // =====

  // =====
  // 魔宠
  public String getSkinString() {
    String[] skins = { "", "坚硬", "常规", "柔软" };
    int index = skin >= 0 && skin < 4 ? skin : 0;
    return skins[index];
  }
  // =====
}
