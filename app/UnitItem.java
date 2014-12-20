package com.kagami.merusuto;

import org.json.JSONObject;

public class UnitItem {
  public String name1;
  public String name2;
  public int id;
  public int element;
  public int atk;
  public int life;
  public int speed;
  public float quick;
  public int tough;
  public int rare;
  
  public int weapon; // 1斩击 2突击 3打击 4弓箭 5魔法 6铳弹 7回复
  public int reach;
  public int num;
  public int type; // 1早熟 2平均 3晚成

  public float fire;
  public float aqua;
  public float wind;
  public float light;
  public float dark;
  
  public UnitItem(int id, JSONObject json) {
    this.id = id;
    this.name1 = json.optString("name1", "");
    this.name2 = json.optString("name2", "");
    this.element = json.optInt("element", 0);
    this.life = json.optInt("life", 0);
    this.atk = json.optInt("atk", 0);
    this.speed = json.optInt("speed", 0);
    this.quick = (float) json.optDouble("quick", 0);
    this.tough = json.optInt("tough", 0);
    this.rare = json.optInt("rare", 0);
    this.weapon = json.optInt("weapon", 0);
    this.reach = json.optInt("reach", 0);
    this.type = json.optInt("type", 0);
    this.num = json.optInt("num", 0);
    
    this.fire = (float)json.optDouble("fire", 0);
    this.aqua = (float)json.optDouble("aqua", 0);
    this.wind = (float)json.optDouble("wind", 0);
    this.light = (float)json.optDouble("light", 0);
    this.dark = (float)json.optDouble("dark", 0);
  }
  
  public String getRareString() {
    String ret = "";
    for(int i = 0; i < rare; i++)
      ret += "★";
    return ret;
  }

  public String getTypeString() {
    String text = "";
    switch (type) {
      case 1:
        text = "早熟";
        break;
      case 2:
        text = "平均";
        break;
      case 3:
        text = "晚成";
        break;
    }
    return text;
  }

  private float calcF() {
    return 1.8f + 0.1f * type;
  }

  // 零觉满级
  private int calcMaxLv(int n) {
    return (int) (n * calcF());
  }

  // 满觉满级
  private int calcMaxLvAndGrow(int n) {
    float f = calcF();
    int levelPart = (int) (n * f);
    int growPart = ((int) (n * (f - 1) / (19 + 10 * rare))) * 75;
    return levelPart + growPart;
  }

  // 满觉满级
  private int calcByLevel(int level, int n) {
    switch (level) {
    case 1:
      return calcMaxLv(n);
    case 2:
      return calcMaxLvAndGrow(n);
    default:
      return n;
    }
  }
  
  public int getAtk(int level) {
    return (int) calcByLevel(level, atk);
  }

  public int getLife(int level) {
    return (int) calcByLevel(level, life);
  }

  public float calcDPS(int level) {
    return calcByLevel(level, atk) / quick;
  }

  public int getDPS(int level) {
    return (int) calcDPS(level);
  }
  
  public int getMultDPS(int level) {
    return (int) calcDPS(level) * num;
  }
}
