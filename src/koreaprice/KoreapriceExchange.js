import axios from "axios";
import { useEffect, useState } from "react";



const KoreapriceExchange = (props) => {

  let jwtToken = null;
  if (sessionStorage.getItem("token") != null) {
    jwtToken = sessionStorage.getItem("token");
  }

  const header = {
    Authorization: `Bearer ${jwtToken}`,
  };

  const { sum, setSum } = props;

  const [exchangeList, setExchageList] = useState([]);
  const [selectExchange, setSelectExchange] = useState("");
  const [totalExchange, setTotalExchange] = useState(0);

  useEffect(() => {
    axios
      .get(`http://${process.env.REACT_APP_JKS_IP}:8080/api/exchangeList`, 
      // { headers: header }
      )
      .then((response) => {
        console.log(response.data);
        let rsp = response.data;
        for (let i = 0; i < rsp.length; i++) {
          rsp[i] = { ...rsp[i] };
        }
        console.log(rsp);
        setExchageList(rsp);
      })
      .catch((error) => console.log(error));
  }, []);

  // 환율 IDR(100), JPY(100) 변환
  const handlerSelect = (e) => {
    setSelectExchange(e.target.value);
    console.log(e.target.value);
    let arrExchange = exchangeList.filter(
      (array) => array.exchangeNationShort == e.target.value
    );
    if (arrExchange[0].exchangeIdx == 12 || arrExchange[0].exchangeIdx == 13) {
      setTotalExchange(parseFloat(arrExchange[0].exchangeRate / 100));
    } else {
      setTotalExchange(parseFloat(arrExchange[0].exchangeRate));
    }
  };

  return (
    <>
      <div id="koreaprice-exchange">
        <div id="koreaprice-exchange-won">
        {!isNaN(sum) ? 
            sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " WON" : "WON"}
        </div>
        <div id="koreaprice-exchange-others">YOUR
          <select onChange={(e) => handlerSelect(e)} value={selectExchange}>
            <option value="" disabled selected>
              Choose your currency
            </option>
            {exchangeList.map((ex) => (
              <option value={ex.exchangeNationShort} key={ex.exchangeIdx}>
                {ex.exchangeNationShort}
              </option>
            ))}
          </select>
          {!isNaN(sum / totalExchange) &&
            isFinite(sum / totalExchange) &&
            (sum / totalExchange)
              .toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          
        </div>
      </div>
      <div id="koreaprice-exchange-mobile">
        <div id="koreaprice-exchange-won">
        {!isNaN(sum) ? 
            sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " WON" : "WON"}
        </div>
        <div id="koreaprice-exchange-others">YOUR
          <select onChange={(e) => handlerSelect(e)} value={selectExchange}>
            <option value="" disabled selected>
              Choose your currency
            </option>
            {exchangeList.map((ex) => (
              <option value={ex.exchangeNationShort} key={ex.exchangeIdx}>
                {ex.exchangeNationShort}
              </option>
            ))}
          </select>
          {!isNaN(sum / totalExchange) &&
            isFinite(sum / totalExchange) &&
            (sum / totalExchange)
              .toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          
        </div>

      </div>

    </>
  )
}
export default KoreapriceExchange;