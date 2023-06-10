import React from "react";
// import styled from "styled-worldcup";
import { FlexBox } from "./Style";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Frame from "../main/Frame";
import jwt_decode from 'jwt-decode';
// import Winpage from "./Winpage";


const Game1 = () => {

  let jwtToken = null;
  let loginUserId = null;
  if (sessionStorage.getItem("token") != null) {
    jwtToken = sessionStorage.getItem("token");
    loginUserId = jwt_decode(jwtToken).sub;
  }

  const header = {
    'Authorization': `Bearer ${jwtToken}`,
    'Content-Type': 'application/json'
  };

  const navigate = useNavigate();

  const [foods, setFoods] = useState([]);
  const [displays, setDisplays] = useState([]);
  const [winners, setWinners] = useState([]);
  // const [ winpage, setWinpage ] = useState([]);

  const triedCategoryIdx = 1;
  const [tournament, setTournament] = useState([]);

  useEffect(() => {

    if(loginUserId == null ){
      alert('로그인 후 사용하실 수 있습니다.');
      navigate("/tried");
      return
    }

    axios.get(`http://localhost:8080/api/rawinfo/${triedCategoryIdx}`, { headers: header })
      .then((response) => {
        console.log(response.data);
        let rawinfoTemp = response.data;
        rawinfoTemp.sort(() => Math.random() - 0.5);
        //푸드에 16강 정보 입력
        setTournament(rawinfoTemp.length);
        setFoods(rawinfoTemp);
        //2개 먼저 화면에 출력
        setDisplays([rawinfoTemp[0], rawinfoTemp[1]]);
      })
      .catch((error) => {
        console.log(error);
      })
  },
    []);

  const clickHandler = (food) => () => {
    //foods가 뭐야? 16개
    if (foods.length <= 2) {
      //위너에 자리가 아직 없다??이건 결승에서만 성립
      if (winners.length === 0) {
        setDisplays([food]);
        console.log("우승상품" + food.rawinfoName)
        //axios.put(`http://localhost:8080/api/idealworldcup/${rawinfoIdx}`, headers)
        //으로 food의 rawinfoIdx 값으로 update 우승횟수 + 1
        axios.put(`http://localhost:8080/api/idealworldcup/${food.rawinfoIdx}`,"", { headers: header })
          .then(response => {
            console.log('우승입력', response.data);
            // navigate(`/detail/${food.rawinfoIdx}`);
            // navigate(`/Winpage/${food.rawinfoIdx}`);
            navigate(`/winpage/${food.rawinfoIdx}/${triedCategoryIdx}`);
          })
          .catch((error) => {
            console.log(error);
          });


        // update rawinfo set idealworldcup_wincnt = idealworldcup_wincnt + 1 
        // where rawinfo_idx = #{rawinfoIdx}

        // navigate으로 result화면 컴포넌트로 food 정보랑 같이 넘기고
        // 결과 화면에 



      } else {
        //16~4강이라면
        //updated 된 음식 배열을 정리 
        let updatedFood = [...winners, food];
        setFoods(updatedFood);
        setDisplays([updatedFood[0], updatedFood[1]])
        setWinners([]);
        setTournament(tournament / 2);
        console.log("선택상품" + food.rawinfoName);

      }
      //
    } else if (foods.length > 2) {
      //위너스 배열에 우승한 food객체 정보 추가
      setWinners([...winners, food])
      //그 다음 2개 화면에 출력하고
      setDisplays([foods[2], foods[3]])
      //선택완료된 foods배열의 앞 2개를 foods에서 날림
      setFoods(foods.slice(2))
      console.log("선택상품" + food.rawinfoName);
    };

  };


  return (
    <Frame>
      <FlexBox>
        <h1 className="title">어디까지 해봤니?월드컵</h1>
        <h2 className="round">{tournament}강</h2>

        {displays.map(d => {
          return (
            <div className="flex-1"
              key={d.rawinfoName}
              onClick={clickHandler(d)}>
              <img className="food-img" src={d.rawinfoImg} />
              <div className="name">{d.rawinfoName}</div>
            </div>
          );
        })}
      </FlexBox>
    </Frame>
  );
};

export default Game1;