import {useState,useLayoutEffect} from "react";
import './App.css';
import rightSnd from "./sounds/Right.mp3";
import mistakeSnd from "./sounds/Mistake.mp3";

function App() {

  const MIN_NUM = 3;
  const [images,setImages] = useState([]);
  const [stage,setStage] = useState(0);
  const [number,setNumber] = useState(MIN_NUM);
  const [word,setWord] = useState("");
  const [title,setTitle] = useState("開始する");
  const keyword = ["桃","すいか","りんご","ゴリラ","カーテン"];
  const right = new Audio(rightSnd);
  const mistake = new Audio(mistakeSnd);

  useLayoutEffect(() => {
    if (title !== "開始する") {
      addImage(null,stage,number);
    }
  },[stage,number]);

  // useLayoutEffect(() => {
  //   window.electronAPI.onReceiveMassage((e, data) => {
  //     start();
  //   })
  // },[]);

  const start = (e) => {
    setTitle("画像当てクイズ");
    addImage(null,stage,number);
  }

  const answer = (e) => {
    if (keyword[stage] === word) {
      right.play();
      setStage((stage + 1) % keyword.length);
      setNumber(MIN_NUM);
    } else {
      mistake.play();
      setNumber(number+1);
    }
  }

  const addImage = (e,stg,num) => {
    fetch( createURL(keyword[stg],num) )
    .then( function( data ) {
      return data.json();
    })
    .then( function( json ) { 
      createImage( json );
    })
  }

  function createURL(value, num) {
    const API_KEY = '27915605-5d59876fb880c9140b1474802';// APIKEYを入力
    const baseUrl = 'https://pixabay.com/api/?key=' + API_KEY;
    const keyword = '&q=' + encodeURIComponent( value );
    const option = '&orientation=horizontal&per_page='+num;
    const URL = baseUrl + keyword + option;
    return URL;
  }

  function createImage(json) {
    let array = [];
    if( json.totalHits > 0 ) {
      json.hits.forEach( function(value) {
        array.push(value.webformatURL);
      })
      setImages(array);
    }
  }

  return <div className="App">
    <header>
      <h1 onClick={(e) => start(e)}>{title}</h1>
      <input type="text"
        onChange={(e) => setWord(e.target.value)}></input>
      <button onClick={(e) => answer(e)}>答える</button>
    </header>
    <div>{images.map((src,i) =>
      <img src={src} key={i} alt="問題" />)}
    </div>
    <p><a href="https://pixabay.com" target="_blank" rel="noreferrer">
      <img src="https://pixabay.com/static/img/logo.svg"
      alt="Pixabay" /></a></p>
  </div>
}

export default App;
