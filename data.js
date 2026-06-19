// ════════════════════════════════════════════════════
// データファイル（月1回程度、手動で更新してください）
// ════════════════════════════════════════════════════
const UPDATE_DATE = '2026年6月18日';

// ★★★ アフィリエイトID設定欄 ★★★
const RAKUTEN_AFF_ID = 'YOUR_RAKUTEN_AFFILIATE_ID';
const AMAZON_TAG = 'YOUR_AMAZON_TAG';

// メルカリ：A8.net「メルカリアンバサダー」提携済み（2026年6月20日提携、テキストリンク）。
// このリンクは検索キーワードを指定できないタイプのため、常にメルカリのトップ/紹介ページに遷移します。
const MERCARI_AFF_TEMPLATE = 'https://px.a8.net/svt/ejp?a8mat=4B60CF+4DRZ6A+5LNQ+5YJRM';

// SNKRDUNK（スニダン）：バリューコマース or A8.netで提携可能。提携後、同様に生成リンクを貼ってください。
const SNKRDUNK_AFF_TEMPLATE = '';

// ヤフオク：2015年にYahoo!アフィリエイトが終了、2016年3月末にバリューコマース経由の提携も終了し、
// 現在ヤフオク単体のアフィリエイトプログラムは存在しません（Yahoo!ショッピングとは別物）。
// そのため下記は素の検索リンク（送客のみ・収益化なし）として設置しています。
const YAHOO_AUCTION_NOTE = '※ヤフオクは現在アフィリエイト提携不可（2016年終了）。送客リンクのみ';

// アフィリエイトテンプレートにキーワードを差し込む共通関数。テンプレート未設定なら通常リンクにフォールバック。
function affLink(template, fallbackUrl, keyword){
  if(!template) return fallbackUrl;
  return template.replace('{KEYWORD}', encodeURIComponent(keyword));
}

// ── PSA鑑定ランキングデータ ──
// gem_rate: PSA10になる確率(%) / bad_rate: PSA6以下になる確率(%) / trades_30d: 直近30日の取引件数(参考)
const cards = [
  {id:1, name:'リザードンex(SAR)', set:'シャイニートレジャーex', emoji:'🔥', era:'scarlet', type:'sa', psa10:842, psa9:1203, jp_price:48000, us_price:380, trend:'up', trend_pct:'+12%', gem_rate:38.2, bad_rate:6.1, trades_30d:412, note:'最新シリーズの中でも特に人気が高いカード。発売直後から需要が続いている。'},
  {id:2, name:'ソル(SAR)', set:'シャイニートレジャーex', emoji:'☀️', era:'scarlet', type:'sa', psa10:680, psa9:1120, jp_price:38000, us_price:280, trend:'up', trend_pct:'+9%', gem_rate:34.5, bad_rate:7.8, trades_30d:298, note:'新しめのカードで今後の鑑定数の伸びに注目。'},
  {id:3, name:'カイ(SR)', set:'バイオレットex', emoji:'👤', era:'scarlet', type:'sr', psa10:2340, psa9:3890, jp_price:12000, us_price:95, trend:'down', trend_pct:'-5%', gem_rate:42.1, bad_rate:4.2, trades_30d:680, note:'再販の影響で価格は落ち着いている。'},
  {id:4, name:'ミライドンex(SAR)', set:'スカーレットex', emoji:'⚡', era:'scarlet', type:'sa', psa10:1280, psa9:2100, jp_price:18000, us_price:140, trend:'up', trend_pct:'+5%', gem_rate:40.5, bad_rate:5.5, trades_30d:355, note:'新規軸ポケモンとして安定した人気。'},
  {id:5, name:'コライドンex(SAR)', set:'バイオレットex', emoji:'🦖', era:'scarlet', type:'sa', psa10:1190, psa9:1980, jp_price:17500, us_price:135, trend:'up', trend_pct:'+4%', gem_rate:39.8, bad_rate:5.8, trades_30d:340, note:'ミライドンと並ぶ看板カード。'},
  {id:30, name:'ピィ(SAR)', set:'生命の鼓動', emoji:'💕', era:'scarlet', type:'sa', psa10:520, psa9:880, jp_price:14000, us_price:108, trend:'up', trend_pct:'+8%', gem_rate:36.0, bad_rate:6.5, trades_30d:210, note:'可愛らしいイラストで女性ファンに人気。'},
  {id:31, name:'ハバタクカミex(SAR)', set:'スノーハザード', emoji:'🦋', era:'scarlet', type:'sa', psa10:610, psa9:1020, jp_price:9800, us_price:75, trend:'stable', trend_pct:'±1%', gem_rate:37.2, bad_rate:6.0, trades_30d:185, note:'パラドックスポケモンの中でも人気の高い1枚。'},
  {id:32, name:'テツノカイナex(SAR)', set:'クレイバースト', emoji:'🦾', era:'scarlet', type:'sa', psa10:480, psa9:790, jp_price:7200, us_price:55, trend:'down', trend_pct:'-3%', gem_rate:35.8, bad_rate:7.0, trades_30d:142, note:'安定した需要のあるパラドックスシリーズ。'},
  {id:33, name:'リコ(SAR)', set:'ポケモンカード151', emoji:'🎒', era:'scarlet', type:'sa', psa10:1850, psa9:2900, jp_price:6500, us_price:48, trend:'up', trend_pct:'+15%', gem_rate:41.5, bad_rate:4.8, trades_30d:920, note:'151シリーズの人気と共に取引数が急増。'},
  {id:34, name:'ミュウex(SAR)', set:'ポケモンカード151', emoji:'✨', era:'scarlet', type:'sa', psa10:2100, psa9:3400, jp_price:8200, us_price:62, trend:'up', trend_pct:'+18%', gem_rate:43.0, bad_rate:4.0, trades_30d:1050, note:'151シリーズの看板カードで取引数トップクラス。'},
  {id:6, name:'リザードンVMAX(SA)', set:'シャイニースターV', emoji:'🔥', era:'sword', type:'sa', psa10:842, psa9:1203, jp_price:185000, us_price:1450, trend:'up', trend_pct:'+12%', gem_rate:28.4, bad_rate:9.2, trades_30d:95, note:'国内外問わず最も需要が高いカードの一つ。PSA10は流通量が限られ、価格は上昇傾向が続いている。'},
  {id:7, name:'ピカチュウVMAX(SA)', set:'ファンタジーUNBROKEN', emoji:'⚡', era:'sword', type:'sa', psa10:1530, psa9:2890, jp_price:68000, us_price:520, trend:'up', trend_pct:'+8%', gem_rate:31.2, bad_rate:7.5, trades_30d:168, note:'ピカチュウ人気で安定した需要。'},
  {id:8, name:'ミュウVMAX(SA)', set:'スターバース', emoji:'✨', era:'sword', type:'sa', psa10:980, psa9:1680, jp_price:42000, us_price:310, trend:'down', trend_pct:'-3%', gem_rate:29.5, bad_rate:8.8, trades_30d:112, note:'発売直後のピークから落ち着き、現在は適正価格帯に。'},
  {id:9, name:'ガラルファイヤーV(SA)', set:'白銀のランス', emoji:'🦅', era:'sword', type:'sa', psa10:412, psa9:790, jp_price:95000, us_price:680, trend:'up', trend_pct:'+15%', gem_rate:22.1, bad_rate:11.5, trades_30d:48, note:'鑑定数が比較的少なく、希少性が高いカード。'},
  {id:10, name:'ルギアVSTAR(SA)', set:'ロストアビス', emoji:'🌊', era:'sword', type:'sa', psa10:1120, psa9:2010, jp_price:58000, us_price:420, trend:'up', trend_pct:'+6%', gem_rate:30.8, bad_rate:8.0, trades_30d:135, note:'ロストバレットデッキの人気とともに需要が拡大。'},
  {id:11, name:'マリィ(SR)', set:'ソード&シールド', emoji:'🎀', era:'sword', type:'sr', psa10:3120, psa9:4980, jp_price:8500, us_price:62, trend:'down', trend_pct:'-2%', gem_rate:35.0, bad_rate:6.2, trades_30d:520, note:'流通量が多く価格は安定。'},
  {id:12, name:'ザシアンV(SA)', set:'ソード&シールド', emoji:'🐺', era:'sword', type:'sa', psa10:1680, psa9:2780, jp_price:24000, us_price:185, trend:'down', trend_pct:'-1%', gem_rate:33.5, bad_rate:6.8, trades_30d:210, note:'初期VMAXシリーズの代表格。'},
  {id:13, name:'カビゴンVMAX(SA)', set:'VMAXクライマックス', emoji:'😴', era:'sword', type:'sa', psa10:890, psa9:1450, jp_price:32000, us_price:240, trend:'up', trend_pct:'+7%', gem_rate:27.5, bad_rate:9.5, trades_30d:88, note:'人気の高いVMAXクライマックスSA枠。'},
  {id:14, name:'ミュウツーV-UNION(SA)', set:'最強タッグ', emoji:'🟣', era:'sword', type:'sa', psa10:560, psa9:920, jp_price:52000, us_price:390, trend:'up', trend_pct:'+10%', gem_rate:24.0, bad_rate:10.8, trades_30d:62, note:'特殊カードタイプで人気が高い。'},
  {id:15, name:'エーフィVMAX(SA)', set:'VMAXクライマックス', emoji:'🌙', era:'sword', type:'sa', psa10:720, psa9:1180, jp_price:36000, us_price:270, trend:'up', trend_pct:'+6%', gem_rate:26.8, bad_rate:9.8, trades_30d:75, note:'イーブイズシリーズの中でも人気のカード。'},
  {id:16, name:'ブラッキーVMAX(SA)', set:'VMAXクライマックス', emoji:'⚫', era:'sword', type:'sa', psa10:650, psa9:1050, jp_price:78000, us_price:590, trend:'up', trend_pct:'+18%', gem_rate:25.2, bad_rate:10.2, trades_30d:58, note:'イーブイズシリーズ最高額帯。安定した人気。'},
  {id:35, name:'ニンフィアVMAX(SA)', set:'VMAXクライマックス', emoji:'🎗️', era:'sword', type:'sa', psa10:780, psa9:1280, jp_price:45000, us_price:340, trend:'up', trend_pct:'+9%', gem_rate:26.5, bad_rate:9.9, trades_30d:80, note:'イーブイズで特に人気の高い1枚。'},
  {id:36, name:'グレイシアVMAX(SA)', set:'VMAXクライマックス', emoji:'❄️', era:'sword', type:'sa', psa10:680, psa9:1110, jp_price:28000, us_price:215, trend:'stable', trend_pct:'±0%', gem_rate:27.0, bad_rate:9.6, trades_30d:65, note:'イーブイズシリーズの中で安定した相場。'},
  {id:37, name:'ゲンガーVMAX(SA)', set:'フュージョンアーツ', emoji:'👻', era:'sword', type:'sa', psa10:920, psa9:1520, jp_price:22000, us_price:170, trend:'up', trend_pct:'+6%', gem_rate:29.8, bad_rate:8.5, trades_30d:98, note:'人気ポケモンで安定した取引数。'},
  {id:38, name:'インテレオンVMAX(SA)', set:'ソード&シールド', emoji:'🦎', era:'sword', type:'sa', psa10:1050, psa9:1750, jp_price:9500, us_price:72, trend:'down', trend_pct:'-2%', gem_rate:32.0, bad_rate:7.2, trades_30d:130, note:'御三家の最終進化系で安定の需要。'},
  {id:17, name:'ピカチュウ&ゼクロムGX(SA)', set:'タッグオールスターズ', emoji:'⚡', era:'sm', type:'sa', psa10:1340, psa9:2240, jp_price:48000, us_price:360, trend:'up', trend_pct:'+5%', gem_rate:31.5, bad_rate:7.8, trades_30d:155, note:'タッグチームGXの代表的な人気カード。'},
  {id:18, name:'ピカチュウ&ゼクロムGX(プロモ)', set:'プロモーションカード', emoji:'⚡', era:'sm', type:'promo', psa10:280, psa9:480, jp_price:62000, us_price:480, trend:'up', trend_pct:'+9%', gem_rate:24.5, bad_rate:11.0, trades_30d:32, note:'プロモ版は鑑定数が少なく希少性が高い。'},
  {id:19, name:'リザードンGX(SA)', set:'タッグオールスターズ', emoji:'🔥', era:'sm', type:'sa', psa10:1020, psa9:1780, jp_price:38000, us_price:290, trend:'down', trend_pct:'-2%', gem_rate:29.0, bad_rate:8.9, trades_30d:108, note:'安定した人気を保つロングセラー。'},
  {id:20, name:'ゲッコウガ&ザマゼンタGX(SA)', set:'ダブルブレイズ', emoji:'🐸', era:'sm', type:'sa', psa10:980, psa9:1620, jp_price:18000, us_price:140, trend:'up', trend_pct:'+4%', gem_rate:30.5, bad_rate:8.2, trades_30d:92, note:'マイナーながら一定の需要がある。'},
  {id:21, name:'ピカチュウ(イラストレーター)', set:'プロモ（コロコロ）', emoji:'⚡', era:'sm', type:'promo', psa10:12, psa9:32, jp_price:18000000, us_price:135000, trend:'up', trend_pct:'+25%', gem_rate:11.2, bad_rate:28.5, trades_30d:1, note:'世界で数十枚しか存在しないとされる伝説的レアカード。'},
  {id:39, name:'ネクロズマGX(SA)', set:'禁断の光', emoji:'🌌', era:'sm', type:'sa', psa10:540, psa9:910, jp_price:24000, us_price:185, trend:'down', trend_pct:'-4%', gem_rate:27.8, bad_rate:9.4, trades_30d:55, note:'禁断シリーズの中でも人気のカード。'},
  {id:22, name:'ピカチュウex(SA)', set:'XYBREAK', emoji:'⚡', era:'xy', type:'sa', psa10:420, psa9:780, jp_price:32000, us_price:240, trend:'up', trend_pct:'+6%', gem_rate:22.5, bad_rate:12.5, trades_30d:38, note:'XY期の人気EXカード。'},
  {id:23, name:'ゲンガーEX(SA)', set:'ファントムゲート', emoji:'👻', era:'xy', type:'sa', psa10:380, psa9:640, jp_price:28000, us_price:210, trend:'up', trend_pct:'+5%', gem_rate:21.8, bad_rate:13.0, trades_30d:32, note:'ファン人気の高いポケモン。'},
  {id:24, name:'ミュウツーEX(SA)', set:'XY', emoji:'🟣', era:'xy', type:'sa', psa10:520, psa9:890, jp_price:22000, us_price:165, trend:'stable', trend_pct:'±0%', gem_rate:23.2, bad_rate:12.0, trades_30d:45, note:'安定した相場を保つ初期EXカード。'},
  {id:25, name:'リザードン(初版/旧裏)', set:'ベース拡張パック', emoji:'🔥', era:'classic', type:'ur', psa10:118, psa9:340, jp_price:980000, us_price:7400, trend:'up', trend_pct:'+22%', gem_rate:8.5, bad_rate:35.2, trades_30d:6, note:'通称「旧裏リザードン」。コレクターズアイテムの代表格で、PSA10は極めて稀少。'},
  {id:26, name:'ミュウ(プロモ/エラー)', set:'プロモ（映画記念）', emoji:'✨', era:'classic', type:'promo', psa10:64, psa9:210, jp_price:380000, us_price:2900, trend:'up', trend_pct:'+11%', gem_rate:10.2, bad_rate:30.5, trades_30d:3, note:'初期プロモの中でも特に希少な1枚。'},
  {id:27, name:'カビゴン(初版/旧裏)', set:'ジャングル', emoji:'😴', era:'classic', type:'ur', psa10:240, psa9:520, jp_price:85000, us_price:640, trend:'up', trend_pct:'+8%', gem_rate:14.5, bad_rate:25.0, trades_30d:12, note:'初期世代の人気カード。'},
  {id:28, name:'フシギバナ(初版/旧裏)', set:'ベース拡張パック', emoji:'🌿', era:'classic', type:'ur', psa10:180, psa9:410, jp_price:120000, us_price:910, trend:'up', trend_pct:'+9%', gem_rate:12.8, bad_rate:27.2, trades_30d:9, note:'御三家の中でも特に人気が高い。'},
  {id:29, name:'サンダー(プロモ/旧裏)', set:'プロモ（コロコロ）', emoji:'⚡', era:'classic', type:'promo', psa10:95, psa9:260, jp_price:165000, us_price:1250, trend:'up', trend_pct:'+14%', gem_rate:11.0, bad_rate:29.8, trades_30d:5, note:'伝説ポケモンの初期プロモ。'},
];

const marketCards = [
  {name:'リザードンVMAX(SA)', emoji:'🔥', jp:185000, us:1450, jp_src:'国内相場（参考値）', us_src:'海外相場（参考値）', history:[60,65,68,72,78,82,85,90]},
  {name:'リザードン(初版/旧裏)', emoji:'🔥', jp:980000, us:7400, jp_src:'国内相場（参考値）', us_src:'海外相場（参考値）', history:[55,58,62,68,75,82,88,95]},
  {name:'ガラルファイヤーV(SA)', emoji:'🦅', jp:95000, us:680, jp_src:'国内相場（参考値）', us_src:'海外相場（参考値）', history:[50,52,58,62,68,75,80,88]},
  {name:'ブラッキーVMAX(SA)', emoji:'⚫', jp:78000, us:590, jp_src:'国内相場（参考値）', us_src:'海外相場（参考値）', history:[45,48,52,58,64,70,76,84]},
  {name:'ピカチュウVMAX(SA)', emoji:'⚡', jp:68000, us:520, jp_src:'国内相場（参考値）', us_src:'海外相場（参考値）', history:[40,42,45,48,50,55,58,62]},
  {name:'ルギアVSTAR(SA)', emoji:'🌊', jp:58000, us:420, jp_src:'国内相場（参考値）', us_src:'海外相場（参考値）', history:[55,56,58,60,58,62,65,68]},
  {name:'ミュウex(SAR)', emoji:'✨', jp:8200, us:62, jp_src:'国内相場（参考値）', us_src:'海外相場（参考値）', history:[30,35,42,50,58,65,72,80]},
];

const eraNames = {classic:'第1世代（〜2000年代）', xy:'XY期（2014-2016）', sm:'SM期（2017-2019）', sword:'ソード&シールド期（2020-2022）', scarlet:'スカーレット&バイオレット期（2023-）'};

// ── BOX情報データ（約29種） ──
const boxes = [
  {id:1, name:'シャイニートレジャーex', emoji:'📦', era:'scarlet', release:'2023年12月発売', price:18800, perBox:'5パック入り×?BOX', rakutenQ:'シャイニートレジャーex BOX'},
  {id:2, name:'バイオレットex', emoji:'📦', era:'scarlet', release:'2023年1月発売', price:5980, perBox:'5パック入り×30パック', rakutenQ:'バイオレットex BOX'},
  {id:3, name:'スカーレットex', emoji:'📦', era:'scarlet', release:'2023年1月発売', price:5980, perBox:'5パック入り×30パック', rakutenQ:'スカーレットex BOX'},
  {id:4, name:'クレイバースト', emoji:'📦', era:'scarlet', release:'2023年4月発売', price:6200, perBox:'5パック入り×30パック', rakutenQ:'クレイバースト BOX'},
  {id:5, name:'スノーハザード', emoji:'📦', era:'scarlet', release:'2023年4月発売', price:6200, perBox:'5パック入り×30パック', rakutenQ:'スノーハザード BOX'},
  {id:6, name:'ポケモンカード151', emoji:'📦', era:'scarlet', release:'2023年6月発売', price:24800, perBox:'5パック入り×?BOX（プレミア）', rakutenQ:'ポケモンカード151 BOX'},
  {id:7, name:'バトルパートナーズ', emoji:'📦', era:'scarlet', release:'2023年7月発売', price:6500, perBox:'5パック入り×30パック', rakutenQ:'バトルパートナーズ BOX'},
  {id:8, name:'生命の鼓動', emoji:'📦', era:'scarlet', release:'2023年9月発売', price:6500, perBox:'5パック入り×30パック', rakutenQ:'生命の鼓動 BOX'},
  {id:9, name:'レイジングサーフ', emoji:'📦', era:'scarlet', release:'2023年3月発売', price:6200, perBox:'5パック入り×30パック', rakutenQ:'レイジングサーフ BOX'},
  {id:10, name:'黒炎の支配者', emoji:'📦', era:'scarlet', release:'2023年7月発売', price:6500, perBox:'5パック入り×30パック', rakutenQ:'黒炎の支配者 BOX'},
  {id:11, name:'古代の咆哮', emoji:'📦', era:'scarlet', release:'2023年10月発売', price:6500, perBox:'5パック入り×30パック', rakutenQ:'古代の咆哮 BOX'},
  {id:12, name:'未来の一閃', emoji:'📦', era:'scarlet', release:'2023年10月発売', price:6500, perBox:'5パック入り×30パック', rakutenQ:'未来の一閃 BOX'},
  {id:13, name:'テラスタルフェスex', emoji:'📦', era:'scarlet', release:'2024年3月発売', price:7200, perBox:'5パック入り×30パック', rakutenQ:'テラスタルフェスex BOX'},
  {id:14, name:'シャイニースターV', emoji:'📦', era:'sword', release:'2020年12月発売', price:42000, perBox:'プレミア価格（廃盤）', rakutenQ:'シャイニースターV BOX'},
  {id:15, name:'VMAXクライマックス', emoji:'📦', era:'sword', release:'2021年12月発売', price:38000, perBox:'プレミア価格（廃盤）', rakutenQ:'VMAXクライマックス BOX'},
  {id:16, name:'白銀のランス', emoji:'📦', era:'sword', release:'2021年4月発売', price:28000, perBox:'プレミア価格（廃盤）', rakutenQ:'白銀のランス BOX'},
  {id:17, name:'ロストアビス', emoji:'📦', era:'sword', release:'2022年7月発売', price:16800, perBox:'5パック入り×30パック', rakutenQ:'ロストアビス BOX'},
  {id:18, name:'最強タッグ', emoji:'📦', era:'sword', release:'2021年6月発売', price:22000, perBox:'プレミア価格（廃盤）', rakutenQ:'最強タッグ BOX'},
  {id:19, name:'フュージョンアーツ', emoji:'📦', era:'sword', release:'2021年10月発売', price:18000, perBox:'5パック入り×30パック', rakutenQ:'フュージョンアーツ BOX'},
  {id:20, name:'スターバース', emoji:'📦', era:'sword', release:'2022年1月発売', price:32000, perBox:'プレミア価格（廃盤）', rakutenQ:'スターバース BOX'},
  {id:21, name:'パラダイムトリガー', emoji:'📦', era:'sword', release:'2022年4月発売', price:14000, perBox:'5パック入り×30パック', rakutenQ:'パラダイムトリガー BOX'},
  {id:22, name:'タッグオールスターズ', emoji:'📦', era:'sm', release:'2019年12月発売', price:26000, perBox:'プレミア価格（廃盤）', rakutenQ:'タッグオールスターズ BOX'},
  {id:23, name:'ダブルブレイズ', emoji:'📦', era:'sm', release:'2019年5月発売', price:9800, perBox:'5パック入り×30パック', rakutenQ:'ダブルブレイズ BOX'},
  {id:24, name:'禁断の光', emoji:'📦', era:'sm', release:'2019年8月発売', price:12000, perBox:'5パック入り×30パック', rakutenQ:'禁断の光 BOX'},
  {id:25, name:'リミックスバウト', emoji:'📦', era:'sm', release:'2019年10月発売', price:10500, perBox:'5パック入り×30パック', rakutenQ:'リミックスバウト BOX'},
  {id:26, name:'XYBREAK', emoji:'📦', era:'xy', release:'2016年1月発売', price:8500, perBox:'5パック入り×30パック', rakutenQ:'XYBREAK ポケモンカード BOX'},
  {id:27, name:'ファントムゲート', emoji:'📦', era:'xy', release:'2016年7月発売', price:8200, perBox:'5パック入り×30パック', rakutenQ:'ファントムゲート ポケモンカード BOX'},
  {id:28, name:'ベース拡張パック(復刻版)', emoji:'📦', era:'classic', release:'復刻版', price:15000, perBox:'希少・プレミア価格', rakutenQ:'ポケモンカード 旧裏 BOX'},
  {id:29, name:'ジャングル(復刻版)', emoji:'📦', era:'classic', release:'復刻版', price:12000, perBox:'希少・プレミア価格', rakutenQ:'ポケモンカード ジャングル BOX'},
];

const boxEraNames = {classic:'第1世代', xy:'XY期', sm:'SM期', sword:'S&S期', scarlet:'SV期'};

// ── オンラインオリパ（実在サービス）──
// ★各社の招待コード・アフィリエイトリンクは公式パートナープログラムへの申請が必要です
// 「おりパンダ」はA8.net提携済み（2026年6月20日提携、テキストリンク）。広告主表記としてtagsに"PR"を付与しています。
const oripas = [
  {id:6, rank:1, name:'おりパンダ', emoji:'🐼', rating:4.6, reviews:'新規会員登録で最大90%OFF特典', tags:['PR','還元大盤・特典あり','1coinから引ける'], desc:'Pandaverse株式会社運営。リリース記念で還元・特典を強化中のオンラインオリパ。1coinから引けるガチャもあり、新規会員登録特典が充実。', url:'https://px.a8.net/svt/ejp?a8mat=4B60CF+6IKW7M+5U64+5YJRM', code:'新規会員登録で最大90%OFF（公式サイト参照）'},
  {id:1, rank:2, name:'DOPA！', emoji:'🎴', rating:4.7, reviews:'11万人+フォロワー', tags:['業界最大手','還元率トップクラス','SNS当選報告No.1'], desc:'株式会社sinsa運営。会員数100万人超の業界最大級オンラインオリパ。高還元率ガチャが豊富でSNSでの当選報告も圧倒的に多い。', url:'https://dopa-place.com/', code:'招待コードあり（公式サイト参照）'},
  {id:2, rank:3, name:'日本トレカセンター', emoji:'🎯', rating:4.5, reviews:'発送速度No.1評価', tags:['発送が早い','カジサック起用','初心者向け'], desc:'当日出荷も多く、発送スピードに定評がある大手オリパサイト。口数も比較的少なく初心者でも始めやすい。', url:'https://japan-toreca.com/', code:'登録特典あり（公式サイト参照）'},
  {id:3, rank:4, name:'オリパワン', emoji:'💎', rating:4.4, reviews:'還元率業界TOP級', tags:['還元率が高い','安定感重視'], desc:'還元率の高さで定評のあるオリパサービス。安定感を重視する利用者から支持されている。', url:'#', code:'公式サイト参照'},
  {id:4, rank:5, name:'カードラッシュオリパ', emoji:'🛒', rating:4.3, reviews:'実店舗運営の安心感', tags:['大手カードショップ運営','実店舗あり'], desc:'実店舗を持つ大手カードショップ「カードラッシュ」が運営。信頼性を重視する人に向いている。', url:'https://www.cardrush-pokemon.jp/', code:''},
  {id:5, rank:6, name:'Cloveオリパ', emoji:'🍀', rating:4.1, reviews:'人気上昇中', tags:['新興サービス','話題性あり'], desc:'比較的新しいオンラインオリパサービスだが口コミでの評価が伸びている。', url:'#', code:''},
];

// ── ショップ一覧（楽天市場内の店舗は楽天アフィリエイト経由にすると収益化できる）──
const shops = [
  {name:'カードラッシュ', emoji:'🛒', desc:'業界大手のカード専門店。買取・販売ともに実績豊富。', url:'https://www.cardrush-pokemon.jp/', rakutenQ:null},
  {name:'駿河屋', emoji:'📚', desc:'中古ホビー全般を扱う大手。ポケカも幅広く取り扱い。', url:'https://www.suruga-ya.jp/', rakutenQ:'駿河屋 ポケモンカード'},
  {name:'トレファクスポーツ', emoji:'⚡', desc:'トレーディングカード専門の買取・販売チェーン。', url:'https://www.trefac.jp/', rakutenQ:null},
  {name:'晴れる屋', emoji:'☀️', desc:'TCG専門店の老舗。高額カードの取り扱いも多い。', url:'https://hareruyamtg.com/', rakutenQ:null},
  {name:'ホビーステーション', emoji:'🎮', desc:'全国展開のホビーショップ。オンライン販売も充実。', url:'https://www.hbst.jp/', rakutenQ:'ホビーステーション ポケモンカード'},
  {name:'イエローサブマリン', emoji:'🚢', desc:'ホビー・カード全般を扱う大手チェーン。', url:'https://yellowsubmarine.co.jp/', rakutenQ:'イエローサブマリン ポケモンカード'},
  {name:'楽天市場 ポケカ専門店', emoji:'🛍️', desc:'楽天市場内の人気ポケカショップをまとめて検索。', url:null, rakutenQ:'ポケモンカード'},
  {name:'Amazon ポケカストア', emoji:'📦', desc:'Amazon直送・プライム対応のポケカ商品を検索。', url:null, rakutenQ:null, amazon:true},
  {name:'ヤフオク！', emoji:'🔨', desc:'オークション形式で希少カードを探せる。', url:'https://auctions.yahoo.co.jp/category/list/2084048363/', rakutenQ:null},
  {name:'メルカリ', emoji:'📱', desc:'フリマアプリで個人出品のカードを探せる。', url:'https://jp.mercari.com/search?keyword=ポケモンカード', rakutenQ:null, mercari:true},
  {name:'SNKRDUNK（スニダン）', emoji:'👟', desc:'鑑定・全額補償付きで安心して売買できるフリマアプリ。トレカ専門コーナーも充実。', url:'https://snkrdunk.com/search?keywords=ポケモンカード&brandIds=pokemon', rakutenQ:null, snkrdunk:true},
];

const disclaimerText = `※ 「カード検索」結果は外部の公開カードデータベース（Pokémon TCG API）と連携して表示しています。検索結果の正確性は当該データベースに依存します。<br>
※ PSA鑑定数・相場・取引数・Gem率・Bad率のデータは定期的に手動更新している参考情報です。リアルタイムの正確な数値ではない場合があります。最新情報はPSA公式サイトや各取引プラットフォームでご確認ください。<br>
※ BOX価格・オリパ評価・ショップ情報は変動する可能性があります。購入前に各サイトで最新情報をご確認ください。<br>
※ オンラインオリパは賭博性に関する議論があるジャンルです。利用は自己責任のうえ、各サービスの規約・年齢制限をご確認ください。<br>
※ 本サイトはAmazon・楽天市場等のアフィリエイトプログラムに参加しており、リンク経由の購入により当サイトが紹介料を受け取る場合があります。<br>
※ 本サイトの情報は購入・投資判断の参考情報であり、価格変動による損失について運営者は責任を負いません。`;

// ── 日本語ポケモン名 → 英語名 変換辞書 ──
// 外部カードDB（Pokémon TCG API）は英語名のみ対応のため、日本語検索時はこの辞書で変換します
const jpToEn = {
  'リザードン':'Charizard','フシギバナ':'Venusaur','カメックス':'Blastoise',
  'ピカチュウ':'Pikachu','ライチュウ':'Raichu','カビゴン':'Snorlax',
  'ミュウ':'Mew','ミュウツー':'Mewtwo','ルギア':'Lugia','ホウオウ':'Ho-Oh',
  'レックウザ':'Rayquaza','カイオーガ':'Kyogre','グラードン':'Groudon',
  'ゲンガー':'Gengar','イーブイ':'Eevee','ブラッキー':'Umbreon','エーフィ':'Espeon',
  'シャワーズ':'Vaporeon','サンダース':'Jolteon','ブースター':'Flareon',
  'グレイシア':'Glaceon','リーフィア':'Leafeon','ニンフィア':'Sylveon',
  'サンダー':'Zapdos','フリーザー':'Articuno','ファイヤー':'Moltres',
  'ガラルファイヤー':'Galarian Moltres','ガラルサンダー':'Galarian Zapdos','ガラルフリーザー':'Galarian Articuno',
  'ザシアン':'Zacian','ザマゼンタ':'Zamazenta','ミライドン':'Miraidon','コライドン':'Koraidon',
  'ネクロズマ':'Necrozma','ソルガレオ':'Solgaleo','ルナアーラ':'Lunala',
  'サーナイト':'Gardevoir','ハバタクカミ':'Flutter Mane','テツノカイナ':'Iron Hands',
  'インテレオン':'Inteleon','フシギソウ':'Ivysaur','ヒトカゲ':'Charmander',
  'ゼニガメ':'Squirtle','ピチュー':'Pichu','プリン':'Jigglypuff',
  'カイリュー':'Dragonite','ハッサム':'Scizor','メタグロス':'Metagross',
  'ジラーチ':'Jirachi','デオキシス':'Deoxys','ダークライ':'Darkrai',
  'パルキア':'Palkia','ディアルガ':'Dialga','ギラティナ':'Giratina',
  'アルセウス':'Arceus','ゲッコウガ':'Greninja','マリィ':'Marnie','カイ':'Iono',
  'ソル':'Sol','リコ':'Rika',
};

function translateQuery(q){
  // 完全一致があれば変換。なければ部分一致を探す
  if(jpToEn[q]) return jpToEn[q];
  for(const key in jpToEn){
    if(q.includes(key)) return jpToEn[key];
  }
  return q; // 辞書にない場合はそのまま（英語入力等）
}

// 英語名 → 日本語名 逆引き（カード名表示の補助用）
const enToJp = Object.fromEntries(Object.entries(jpToEn).map(([jp,en])=>[en,jp]));
function findJpName(enName){
  for(const en in enToJp){
    if(enName.includes(en)) return enToJp[en];
  }
  return null;
}
