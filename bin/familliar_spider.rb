require 'nokogiri'
require 'open-uri'
require 'json'

BaseUrl = "http://xn--cckza4aydug8bd3l.gamerch.com"
KeyMap = {
  "レアリティ" => "rare",
  "属性" => "element",
  "外皮" => "skin",
  "同時攻撃数" => "anum",
  "移動速度" => "mspd",
  "リーチ" => "aarea",
  "攻撃間隔" => "aspd",
  "タフネス" => "tenacity",
  "炎属性" => "fire",
  "水属性" => "aqua",
  "風属性" => "wind",
  "光属性" => "light",
  "闇属性" => "dark",
}
ValueMap = {
  "" => "暂缺",
  "硬い" => 1,
  "柔らかい" => 2,
}
AllJson = {}
id = 0

doc = Nokogiri::HTML(open("#{BaseUrl}/%E3%83%A2%E3%83%B3%E3%82%B9%E3%82%BF%E3%83%BC%E4%B8%80%E8%A6%A7"))
doc.css("#js_async_main_column_text > table tr > td:nth-child(2) a").each do |doc|
  doc = Nokogiri::HTML(open("#{BaseUrl}#{URI::encode doc.attr("href")}"))
  json = Hash.new
  json[:name] = doc.css("#js_wikidb_main_name").text
  doc.css(".ui_wikidb_title").each do |doc|
    key = doc.text.strip
    value = doc.parent.text.sub(key, '').sub(" ", '').strip
    key = KeyMap[key] if KeyMap[key]
    value = if value =~ /^\d+\.\d+$/
        value.to_f
      elsif value =~ /^\d+.$/
        value.to_i
      elsif value =~ /^.\d+$/
        value.sub("☆", '').to_i
      elsif ValueMap[value]
        ValueMap[value]
      else
        value
      end

    json[key] = value
  end
  doc.css("[class^='zokusei']").each do |doc|
    key = doc.text.strip
    value = doc.next.text.sub(" ", '').strip
    key = KeyMap[key] if KeyMap[key]
    value = value.to_f / 100 if value =~ /^\d+\%$/
    json[key] = value
  end
  id += 1
  AllJson[id.to_s] = json
end

puts JSON.generate(AllJson)
