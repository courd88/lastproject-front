import axios from "axios";
import { useEffect, useState } from "react";
import jwt_decode from 'jwt-decode';

const ChattingTranslate = (props) => {

  const message = props.message;
  const header = props.header;
  const translateState = props.translateState;
  const [translateText, setTranslateText] = useState('');

  //유저 국가로 번역하기
  let jwtToken = null;
  let countryIdx = null;
  if (sessionStorage.getItem('token') != null) {
    jwtToken = sessionStorage.getItem('token');
    console.log(jwt_decode(jwtToken));
    countryIdx = jwt_decode(jwtToken).countryIdx;
    console.log(countryIdx);
  }

  const langNation = nationList.filter(nation => nation.id == countryIdx);
  console.log(langNation);

  const params = {

    message : message,
    lang : langNation[0].lang,
    
  }

  useEffect(() => {
    handlerTranslate(message);
  }, [translateState])



  const handlerTranslate = (message) => {
    if (typeof message == "undefined") {
      return
    }
    console.log(header);
    axios.get(`http://${process.env.REACT_APP_JKS_IP}:8080/translate`,
    {params : params, headers: header})
      .then((response) => {
        console.log(response);

        setTranslateText(response.data);

      })
      .catch((error) => {
        console.log(error);
      })

  }

  return (
    <>
      <span>{translateText}</span>
    </>
  )
}
export default ChattingTranslate;

const nationList = [
  { id: 1, lang : 'ko', name : '한국' },
  { id: 2, lang : 'en', name : '미국' },
  { id: 3, lang : 'ja', name : '일본' },
  { id: 4, lang : 'zh', name : '중국' },
  { id: 5, lang : 'en', name : '캐나다' },
  { id: 6, lang : 'en', name : '영국' },
  { id: 7, lang : 'da', name : '덴마크' },
  { id: 8, lang : 'is', name : '아이슬란드' },
  { id: 9, lang : 'no', name : '노르웨이' },
  { id: 10, lang : 'tr', name : '튀르키예' },
  { id: 11, lang : 'es', name : '스페인' },
  { id: 12, lang : 'pt', name : '포르투갈' },
  { id: 13, lang : 'fr', name : '프랑스' },
  { id: 14, lang : 'ga', name : '아일랜드' },
  { id: 15, lang : 'nl', name : '벨기에' },
  { id: 16, lang : 'de', name : '독일' },
  { id: 17, lang : 'el', name : '그리스' },
  { id: 18, lang : 'sv', name : '스웨덴' },
  { id: 19, lang : 'en', name : '스위스' },
  { id: 20, lang : 'de', name : '오스트리아' },
  { id: 21, lang : 'nl', name : '네덜란드' },
  { id: 22, lang : 'lb', name : '룩셈부르크' },
  { id: 23, lang : 'it', name : '이탈리아' },
  { id: 24, lang : 'fi', name : '핀란드' },
  { id: 25, lang : 'en', name : '오스트레일리아' },
  { id: 26, lang : 'en', name : '뉴질랜드' },
  { id: 27, lang : 'es', name : '멕시코' },
  { id: 28, lang : 'cs', name : '체코' },
  { id: 29, lang : 'hu', name : '헝가리' },
  { id: 30, lang : 'ps', name : '폴란드' },
  { id: 31, lang : 'sk', name : '슬로바키아' },
  { id: 32, lang : 'es', name : '칠레' },
  { id: 33, lang : 'sl', name : '슬로베니아' },
  { id: 34, lang : 'iw', name : '이스라엘' },
  { id: 35, lang : 'et', name : '에스토니아' },
  { id: 36, lang : 'lv', name : '라트비아' },
  { id: 37, lang : 'lt', name : '리투아니아' },
  { id: 38, lang : 'es', name : '콜롬비아' },
  { id: 39, lang : 'es', name : '코스타리카' }
];