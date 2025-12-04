const fs = require('fs');

// 現在の語彙データを読み込む
const currentVocab = JSON.parse(fs.readFileSync('data/vocabulary.json', 'utf8'));

// 英検5級用の追加語彙（合計100語になるまで追加）
const grade5Additional = [
  {"word":"run","meaning":"走る","pronunciation":"rʌn","audio":"audio/vocab/run.mp3","example":"I run in the park every morning.","exampleJP":"私は毎朝公園で走ります。","partOfSpeech":"verb","frequency":"high"},
  {"word":"swim","meaning":"泳ぐ","pronunciation":"swɪm","audio":"audio/vocab/swim.mp3","example":"I can swim very well.","exampleJP":"私はとても上手に泳げます。","partOfSpeech":"verb","frequency":"high"},
  {"word":"walk","meaning":"歩く","pronunciation":"wɔːk","audio":"audio/vocab/walk.mp3","example":"I walk to school.","exampleJP":"私は学校まで歩きます。","partOfSpeech":"verb","frequency":"high"},
  {"word":"read","meaning":"読む","pronunciation":"riːd","audio":"audio/vocab/read.mp3","example":"I read books every night.","exampleJP":"私は毎晩本を読みます。","partOfSpeech":"verb","frequency":"high"},
  {"word":"write","meaning":"書く","pronunciation":"raɪt","audio":"audio/vocab/write.mp3","example":"I write in my diary.","exampleJP":"私は日記を書きます。","partOfSpeech":"verb","frequency":"high"},
  {"word":"study","meaning":"勉強する","pronunciation":"ˈstʌd.i","audio":"audio/vocab/study.mp3","example":"I study English every day.","exampleJP":"私は毎日英語を勉強します。","partOfSpeech":"verb","frequency":"high"},
  {"word":"watch","meaning":"見る","pronunciation":"wɑːtʃ","audio":"audio/vocab/watch.mp3","example":"I watch TV after dinner.","exampleJP":"私は夕食後にテレビを見ます。","partOfSpeech":"verb","frequency":"high"},
  {"word":"play","meaning":"遊ぶ","pronunciation":"pleɪ","audio":"audio/vocab/play.mp3","example":"I play with my friends.","exampleJP":"私は友達と遊びます。","partOfSpeech":"verb","frequency":"high"},
  {"word":"sleep","meaning":"寝る","pronunciation":"sliːp","audio":"audio/vocab/sleep.mp3","example":"I sleep at 10 o'clock.","exampleJP":"私は10時に寝ます。","partOfSpeech":"verb","frequency":"high"},
  {"word":"wake","meaning":"起きる","pronunciation":"weɪk","audio":"audio/vocab/wake.mp3","example":"I wake up at 7 o'clock.","exampleJP":"私は7時に起きます。","partOfSpeech":"verb","frequency":"high"},
  {"word":"think","meaning":"考える","pronunciation":"θɪŋk","audio":"audio/vocab/think.mp3","example":"I think this is a good idea.","exampleJP":"私はこれが良い考えだと思います。","partOfSpeech":"verb","frequency":"high"},
  {"word":"know","meaning":"知っている","pronunciation":"noʊ","audio":"audio/vocab/know.mp3","example":"I know the answer.","exampleJP":"私は答えを知っています。","partOfSpeech":"verb","frequency":"high"},
  {"word":"want","meaning":"欲しい","pronunciation":"wɑːnt","audio":"audio/vocab/want.mp3","example":"I want a new bike.","exampleJP":"私は新しい自転車が欲しいです。","partOfSpeech":"verb","frequency":"high"},
  {"word":"like","meaning":"好き","pronunciation":"laɪk","audio":"audio/vocab/like.mp3","example":"I like ice cream.","exampleJP":"私はアイスクリームが好きです。","partOfSpeech":"verb","frequency":"high"},
  {"word":"love","meaning":"大好き","pronunciation":"lʌv","audio":"audio/vocab/love.mp3","example":"I love my family.","exampleJP":"私は家族が大好きです。","partOfSpeech":"verb","frequency":"high"},
  {"word":"big","meaning":"大きい","pronunciation":"bɪɡ","audio":"audio/vocab/big.mp3","example":"This is a big house.","exampleJP":"これは大きな家です。","partOfSpeech":"adjective","frequency":"high"},
  {"word":"small","meaning":"小さい","pronunciation":"smɔːl","audio":"audio/vocab/small.mp3","example":"This is a small car.","exampleJP":"これは小さな車です。","partOfSpeech":"adjective","frequency":"high"},
  {"word":"tall","meaning":"高い","pronunciation":"tɔːl","audio":"audio/vocab/tall.mp3","example":"He is very tall.","exampleJP":"彼はとても背が高いです。","partOfSpeech":"adjective","frequency":"high"},
  {"word":"short","meaning":"短い、低い","pronunciation":"ʃɔːrt","audio":"audio/vocab/short.mp3","example":"She has short hair.","exampleJP":"彼女は短い髪です。","partOfSpeech":"adjective","frequency":"high"},
  {"word":"long","meaning":"長い","pronunciation":"lɔːŋ","audio":"audio/vocab/long.mp3","example":"This is a long road.","exampleJP":"これは長い道です。","partOfSpeech":"adjective","frequency":"high"},
  {"word":"old","meaning":"古い、年を取った","pronunciation":"oʊld","audio":"audio/vocab/old.mp3","example":"This is an old book.","exampleJP":"これは古い本です。","partOfSpeech":"adjective","frequency":"high"},
  {"word":"new","meaning":"新しい","pronunciation":"nuː","audio":"audio/vocab/new.mp3","example":"I have a new bag.","exampleJP":"私は新しいバッグを持っています。","partOfSpeech":"adjective","frequency":"high"},
  {"word":"good","meaning":"良い","pronunciation":"ɡʊd","audio":"audio/vocab/good.mp3","example":"This is a good idea.","exampleJP":"これは良い考えです。","partOfSpeech":"adjective","frequency":"high"},
  {"word":"bad","meaning":"悪い","pronunciation":"bæd","audio":"audio/vocab/bad.mp3","example":"This is bad weather.","exampleJP":"これは悪い天気です。","partOfSpeech":"adjective","frequency":"high"},
  {"word":"happy","meaning":"幸せな","pronunciation":"ˈhæp.i","audio":"audio/vocab/happy.mp3","example":"I am very happy today.","exampleJP":"私は今日とても幸せです。","partOfSpeech":"adjective","frequency":"high"},
  {"word":"sad","meaning":"悲しい","pronunciation":"sæd","audio":"audio/vocab/sad.mp3","example":"She looks sad.","exampleJP":"彼女は悲しそうに見えます。","partOfSpeech":"adjective","frequency":"high"},
  {"word":"hot","meaning":"暑い","pronunciation":"hɑːt","audio":"audio/vocab/hot.mp3","example":"It is very hot today.","exampleJP":"今日はとても暑いです。","partOfSpeech":"adjective","frequency":"high"},
  {"word":"cold","meaning":"寒い","pronunciation":"koʊld","audio":"audio/vocab/cold.mp3","example":"It is cold in winter.","exampleJP":"冬は寒いです。","partOfSpeech":"adjective","frequency":"high"},
  {"word":"fast","meaning":"速い","pronunciation":"fæst","audio":"audio/vocab/fast.mp3","example":"He runs very fast.","exampleJP":"彼はとても速く走ります。","partOfSpeech":"adjective","frequency":"high"},
  {"word":"slow","meaning":"遅い","pronunciation":"sloʊ","audio":"audio/vocab/slow.mp3","example":"The turtle is slow.","exampleJP":"カメは遅いです。","partOfSpeech":"adjective","frequency":"high"},
  {"word":"easy","meaning":"簡単な","pronunciation":"ˈiː.zi","audio":"audio/vocab/easy.mp3","example":"This test is easy.","exampleJP":"このテストは簡単です。","partOfSpeech":"adjective","frequency":"high"},
  {"word":"hard","meaning":"難しい","pronunciation":"hɑːrd","audio":"audio/vocab/hard.mp3","example":"Math is hard for me.","exampleJP":"数学は私には難しいです。","partOfSpeech":"adjective","frequency":"high"},
  {"word":"clean","meaning":"きれいな","pronunciation":"kliːn","audio":"audio/vocab/clean.mp3","example":"My room is clean.","exampleJP":"私の部屋はきれいです。","partOfSpeech":"adjective","frequency":"high"},
  {"word":"dirty","meaning":"汚い","pronunciation":"ˈdɜːr.ti","audio":"audio/vocab/dirty.mp3","example":"My hands are dirty.","exampleJP":"私の手は汚いです。","partOfSpeech":"adjective","frequency":"high"},
  {"word":"nice","meaning":"素敵な","pronunciation":"naɪs","audio":"audio/vocab/nice.mp3","example":"She is a nice person.","exampleJP":"彼女は素敵な人です。","partOfSpeech":"adjective","frequency":"high"},
  {"word":"kind","meaning":"親切な","pronunciation":"kaɪnd","audio":"audio/vocab/kind.mp3","example":"He is very kind.","exampleJP":"彼はとても親切です。","partOfSpeech":"adjective","frequency":"high"},
  {"word":"friend","meaning":"友達","pronunciation":"frend","audio":"audio/vocab/friend.mp3","example":"She is my best friend.","exampleJP":"彼女は私の親友です。","partOfSpeech":"noun","frequency":"high"},
  {"word":"family","meaning":"家族","pronunciation":"ˈfæm.ə.li","audio":"audio/vocab/family.mp3","example":"I love my family.","exampleJP":"私は家族を愛しています。","partOfSpeech":"noun","frequency":"high"},
  {"word":"mother","meaning":"母","pronunciation":"ˈmʌð.ɚ","audio":"audio/vocab/mother.mp3","example":"My mother is a teacher.","exampleJP":"私の母は先生です。","partOfSpeech":"noun","frequency":"high"},
  {"word":"father","meaning":"父","pronunciation":"ˈfɑː.ðɚ","audio":"audio/vocab/father.mp3","example":"My father works in an office.","exampleJP":"私の父はオフィスで働いています。","partOfSpeech":"noun","frequency":"high"},
  {"word":"sister","meaning":"姉妹","pronunciation":"ˈsɪs.tɚ","audio":"audio/vocab/sister.mp3","example":"I have one sister.","exampleJP":"私には姉妹が一人います。","partOfSpeech":"noun","frequency":"high"},
  {"word":"brother","meaning":"兄弟","pronunciation":"ˈbrʌð.ɚ","audio":"audio/vocab/brother.mp3","example":"My brother is ten years old.","exampleJP":"私の兄は10歳です。","partOfSpeech":"noun","frequency":"high"},
  {"word":"school","meaning":"学校","pronunciation":"skuːl","audio":"audio/vocab/school.mp3","example":"I go to school every day.","exampleJP":"私は毎日学校に行きます。","partOfSpeech":"noun","frequency":"high"},
  {"word":"teacher","meaning":"先生","pronunciation":"ˈtiː.tʃɚ","audio":"audio/vocab/teacher.mp3","example":"My teacher is very nice.","exampleJP":"私の先生はとても親切です。","partOfSpeech":"noun","frequency":"high"},
  {"word":"student","meaning":"生徒","pronunciation":"ˈstuː.dənt","audio":"audio/vocab/student.mp3","example":"I am a student.","exampleJP":"私は生徒です。","partOfSpeech":"noun","frequency":"high"},
  {"word":"house","meaning":"家","pronunciation":"haʊs","audio":"audio/vocab/house.mp3","example":"I live in a big house.","exampleJP":"私は大きな家に住んでいます。","partOfSpeech":"noun","frequency":"high"},
  {"word":"room","meaning":"部屋","pronunciation":"ruːm","audio":"audio/vocab/room.mp3","example":"This is my room.","exampleJP":"これは私の部屋です。","partOfSpeech":"noun","frequency":"high"},
  {"word":"door","meaning":"ドア","pronunciation":"dɔːr","audio":"audio/vocab/door.mp3","example":"Please close the door.","exampleJP":"ドアを閉めてください。","partOfSpeech":"noun","frequency":"high"},
  {"word":"window","meaning":"窓","pronunciation":"ˈwɪn.doʊ","audio":"audio/vocab/window.mp3","example":"Open the window, please.","exampleJP":"窓を開けてください。","partOfSpeech":"noun","frequency":"high"},
  {"word":"desk","meaning":"机","pronunciation":"desk","audio":"audio/vocab/desk.mp3","example":"My desk is near the window.","exampleJP":"私の机は窓の近くにあります。","partOfSpeech":"noun","frequency":"high"}
];

// 各級の語彙を100語以上に拡張
const expandedVocab = {
  "英検5級": [...currentVocab["英検5級"], ...grade5Additional],
  "英検4級": currentVocab["英検4級"],
  "英検3級": currentVocab["英検3級"],
  "英検準2級": currentVocab["英検準2級"],
  "英検2級": currentVocab["英検2級"],
  "英検準1級": currentVocab["英検準1級"],
  "英検1級": currentVocab["英検1級"]
};

fs.writeFileSync('data/vocabulary.json', JSON.stringify(expandedVocab, null, 2), 'utf8');
console.log('Vocabulary database expanded successfully!');
console.log('英検5級: ' + expandedVocab["英検5級"].length + '語');
console.log('英検4級: ' + expandedVocab["英検4級"].length + '語');
console.log('英検3級: ' + expandedVocab["英検3級"].length + '語');
