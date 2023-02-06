import {useState,useEffect,useLayoutEffect} from "react";
import './App.css';
//正解音のサウンドファイルのインポート(①)
import rightSnd from "./sounds/Right.mp3";
//間違い音のサウンドファイルのインポート
import mistakeSnd from "./sounds/Mistake.mp3";

function App() {
  const MIN_NUM = 3;
  const [images,setImages] = useState([]);
  const [stage,setStage] = useState(0);
  const [number,setNumber] = useState(MIN_NUM);
//入力した文字列
  const [word,setWord] = useState("");
  const [title,setTitle] = useState("スタート");
  const keyword = ["犬","ピアノ","猫","ギター","車"];
//正解音を生成(②)
  const right = new Audio(rightSnd);
//間違い音
  const mistake = new Audio(mistakeSnd);

  useEffect(() => {
    window.electronAPI.onReceiveMessage((e, data) => {
      start();
    })
  }, []);

  useLayoutEffect(() => {
    if (title !== "スタート") {
      addImage(null,stage,number);
    }
  },[stage,number]);

  const start = (e) => {
    setTitle("画像検索ワード当てクイズ");
    addImage(null,stage,number);
  }

//答えるボタンをクリックしたら呼ばれる
  const answer = (e) => {
//答えが正しいか調べる
    if (keyword[stage] === word) {
//正解音を鳴らす(③)
      right.play();
//問題のステージを次へ
      setStage((stage + 1) % keyword.length);
//初期ヒント画像を3つに
      setNumber(MIN_NUM);
//答えが正しくない場合
    } else {
//間違い音を鳴らす
      mistake.play();
//ヒント画像を1つ増やす
      setNumber(number+1);
    }
  }

  const addImage = (e,stg,num) => {
//リモートリソースを非同期で取り込み(➁)
    fetch( createURL(keyword[stg],num) )
//受け取ったデータを次のthenに渡す
    .then( function( data ) {
//取得したデータをJSONデータとして返す
      return data.json();
    })
//jsonデータを受け取る
    .then( function( json ) { 
//jsonを元に画像URLをセット
      createImage( json );
    })
  }

//リクエスト用のURLの作成(③)
  function createURL(value, num) {
//Web APIのキー
    const API_KEY = '27915605-5d59876fb880c9140b1474802';
//ベースになるURL
    const baseUrl = 'https://pixabay.com/api/?key=' + API_KEY;
//検索するキーワードの文字列
    const keyword = '&q=' + encodeURIComponent( value );
//画像を水平にし画像の数を指定
    const option = '&orientation=horizontal&per_page='+num;
//baseUrlとkeywordとoptionを繋げた文字列をURL定数に代入
    const URL = baseUrl + keyword + option;
//URLを返す
    return URL;
  }

//画像URLのJSONデータを追加
  function createImage(json) {
//array配列を空で宣言
    let array = [];
//json配列の合計ヒット数がある場合
    if( json.totalHits > 0 ) {
//json配列のヒットをループ(④)
      json.hits.forEach( function(value) {
//array配列にwebformatURLの値を追加
        array.push(value.webformatURL);
      })
//array配列をimagesステートにセット
      setImages(array);
    }
  }

  return <div className="App">
    <header>
      <h1 onClick={(e) => start(e)}>{title}</h1>
{/*入力欄に変更があった場合wordステートをセット(④)*/}
      <input type="text"
        onChange={(e) => setWord(e.target.value)}></input>
{/*答えるボタンをクリックした場合answer関数を呼び出す(⑤)*/}
      <button onClick={(e) => answer(e)}>答える</button>
    </header>
    <div>{images.map((src,i) =>
      <img src={src} key={i} alt="問題" />)}
    </div>
    <p><a href="https://pixabay.com" target="_blank">
      <img src="https://pixabay.com/static/img/logo.svg"
      alt="Pixabay" /></a></p>
  </div>
}

export default App;
