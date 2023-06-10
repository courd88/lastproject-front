import './Koreaprice.css';
import Frame from "../main/Frame";
import KoreapriceEachItem from './KoreapriceEachItem';
import KoreapriceCart from './KoreapriceCart';
import KoreapriceExchange from './KoreapriceExchange';
import { useEffect, useState } from 'react';
import axios from 'axios';
import apple from "./img/apple.jpg";
import bigmac from "./img/bigmac.jpg";
import garlic from "./img/garlic.jpg";
import salt from "./img/salt.jpg";
import rice from "./img/rice.jpg";
import egg from "./img/egg.jpg";
import chicken from "./img/chicken.jpg";
import pork from "./img/pork.jpg";
import beef from "./img/beef.jpg";
import cheese from "./img/cheese.jpg";
import carrot from "./img/carrot.jpg";
import chilipepperpaste from "./img/chilipepperpaste.jpg";
import cucumber from "./img/cucumber.jpg";
import flour from "./img/cucumber.jpg";
import mackerel from "./img/mackerel.jpg";
import mayonnaise from "./img/mayonnaise.jpg";
import onion from "./img/onion.jpg";
import potato from "./img/potato.jpg";
import ramen from "./img/ramen.jpg";
import seaweed from "./img/seaweed.jpg";
import soysauce from "./img/soysauce.jpg";
import squid from "./img/squid.jpg";
import strawberry from "./img/strawberry.jpg";
import sugar from "./img/sugar.jpg";
import sweetpotato from "./img/sweetpotato.jpg";
import tofu from "./img/tofu.jpg";
import tomato from "./img/tomato.jpg";
import spam from "./img/spam.jpg";
import beer from "./img/beer.jpg";
import water from "./img/water.jpg";
import soju from "./img/soju.jpg";
import orangejuice from "./img/orangejuice.jpg";
import milk from "./img/milk.jpg";
import cola from "./img/cola.jpg";
import shampoo from "./img/shampoo.jpg";
import toothpaste from "./img/toothpaste.jpg";
import toiletpaper from "./img/toiletpaper.jpg";

const Koreaprice = () => {

  let jwtToken = null;
  if (sessionStorage.getItem("token") != null) {
    jwtToken = sessionStorage.getItem("token");
  }

  const header = {
    Authorization: `Bearer ${jwtToken}`,
  };

  const imgArray = [
    apple,
    garlic,
    bigmac,
    salt,
    rice,
    egg,
    chicken,
    pork,
    beef,
    cheese,
    potato,
    sweetpotato,
    carrot,
    onion,
    cucumber,
    tomato,
    strawberry,
    mackerel,
    seaweed,
    squid,
    soysauce,
    chilipepperpaste,
    tofu,
    ramen,
    mayonnaise,
    flour,
    sugar,
    spam,
    beer,
    water,
    soju,
    orangejuice,
    milk,
    cola,
    shampoo,
    toothpaste,
    toiletpaper
  ];
  
  //상품 리스트 변수
  const [productLists, setProductLists] = useState([]);

  const [ sum ,setSum] = useState(0);

  //컴포넌트 마운트시 상품리스트에 이미지 이름 추가하기
  useEffect(() => {
    axios
      .get(`http://${process.env.REACT_APP_JKS_IP}:8080/api/koreaprice`, 
      // { headers: header }
      )
      .then((response) => {
        console.log(response.data);
        let rsp = response.data;
        for (let i = 0; i < rsp.length; i++) {
          rsp[i] = { ...rsp[i], img: imgArray[i] };
        }
        console.log(rsp);
        setProductLists(rsp);
      })
      .catch((error) => console.log(error));
  }, []);


  const [nameAndPrice, setNameAndPrice] = useState([{ price: 0 }]);

  const handlerSetNameAndPrice = (name, price, capacity) => {
    if (nameAndPrice[0].price == 0) {
      setNameAndPrice(() => [{ name, price, capacity, count: 0 }]);
    } else {
      // 중복 확인
      const isDuplicate = nameAndPrice.some((item) => item.name === name);

      // 중복되지 않은 경우에만 추가
      if (!isDuplicate) {
        setNameAndPrice((prevNameAndPrice) => [
          ...prevNameAndPrice,
          { name, price, capacity, count: 0 },
        ]);
      }
    }
  };


  return (
    <Frame>
      <div id="koreaprice-img">
        <img src="https://t2.daumcdn.net/thumb/R720x0.fjpg/?fname=http://t1.daumcdn.net/brunch/service/user/bkmN/image/86lbHcV9oRWUv0Gn0Y-FLPJycbw"/>
      </div>
      <div id="koreaprice-wrap">
        <p id="koreaprice-title">물가체험</p>
        <div id="koreaprice-price-window">
          {/* 인포 */}
          <KoreapriceCart sum={sum} setSum={setSum} nameAndPrice={nameAndPrice} setNameAndPrice={setNameAndPrice}/>
          <KoreapriceExchange sum={sum} setSum={setSum}/>
        </div>
        <div id="koreaprice-price-window-mobile">
          {/* 인포 */}
          <KoreapriceCart sum={sum} setSum={setSum} nameAndPrice={nameAndPrice} setNameAndPrice={setNameAndPrice}/>
          <KoreapriceExchange sum={sum} setSum={setSum}/>
        </div>
        <div id="koreaprice-items-list">
          {productLists.map((item) => {
            return (
              <KoreapriceEachItem item={item} handlerSetNameAndPrice={handlerSetNameAndPrice}/>)
          })}
        </div>
      </div>
    </Frame>
  )
}
export default Koreaprice;