import { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import Style from './AdminBoard.module.css';
import { ResponsiveLine } from '@nivo/line'

const AdminBoard = () => {

  let nickName = null;
  let jwtToken = null;
  if (sessionStorage.getItem('token') != null) {
    jwtToken = sessionStorage.getItem('token');
    nickName = jwt_decode(jwtToken).nickname;
  }

  const header = {
    'Authorization': `Bearer ${jwtToken}`,
    'Content-Type': 'application/json'
  };

  const [isTcData, setIsTcData] = useState(false);
  const [isTrData, setIsTrData] = useState(false);
  const [isAccData, setIsAccData] = useState(false);
  const [isIdrlData, setIsIdrlData] = useState(false);

  const [tcDayData, setTcDayData] = useState({});
  const [trDayData, setTrDayData] = useState({});
  const [accDayData, setAccDayData] = useState({});
  const [idrlDayData, setIdrlDayData] = useState({});
  const [totalDayData, setTotalDayData] = useState([]);

  const [tcMonthData, setTcMonthData] = useState({});
  const [trMonthData, setTrMonthData] = useState({});
  const [accMonthData, setAccMonthData] = useState({});
  const [idrlMonthData, setIdrlMonthData] = useState({});
  const [totalMonthData, setTotalMonthData] = useState([]);

  const date = new Date();
  const [year, setYear] = useState(date.getFullYear());
  const [month, setMonth] = useState(date.getMonth() + 1);
  let lastDay = getMonthLastDay(year, month);
  //월의 마지막 날짜 구하기
  function getMonthLastDay(year, month) {
    return new Date(year, month, 0).getDate();  //다음 월의 0번째는 현재 월의 마지막 날짜와 같음.(month는 인덱스가 0 부터 시작)
  }

  const monthArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];


  useEffect(() => {

    const params = {
      startDay: year + "-" + month + "-01",
      endDay: year + "-" + month + "-" + lastDay
    };

    //월 일자별 데이터 가져오기
    axios.get(`http://${process.env.REACT_APP_JKS_IP}:8080/api/admin/daypostcnt`, { params, headers: header })
      .then(response => {
        console.log(response.data);
        let travelcourseList = response.data.travelcourse;
        let triedList = response.data.tried;
        let accompanyList = response.data.accompany;
        let idrlList = response.data.idealreal;

        let dayList = [];
        for (let i = 1; i < lastDay + 1; i++) {
          dayList = [...dayList, i];
        }

        //여행코스 일별 정리
        let tcDayList = [...dayList];

        for (let i = 0; i < tcDayList.length; i++) {
          for (let j = 0; j < travelcourseList.length; j++) {
            if (tcDayList[i] == new Date(travelcourseList[j].day).getDate()) {
              tcDayList[i] = { x: (i + 1), y: travelcourseList[j].count }
            }
          }
          if (tcDayList[i].x == null) tcDayList[i] = { x: (i + 1), y: 0 };
        }

        setTcDayData({ id: "여행코스", data: tcDayList });
        //어디까지 일별 정리
        let trDayList = [...dayList];

        for (let i = 0; i < trDayList.length; i++) {
          for (let j = 0; j < triedList.length; j++) {
            if (trDayList[i] == new Date(triedList[j].day).getDate()) {
              trDayList[i] = { x: (i + 1), y: triedList[j].count }
            }
          }
          if (trDayList[i].x == null) trDayList[i] = { x: (i + 1), y: 0 };
        }

        setTrDayData({ id: "어디까지", data: trDayList });
        //여행친구 일별 정리
        let accDayList = [...dayList];

        for (let i = 0; i < accDayList.length; i++) {
          for (let j = 0; j < accompanyList.length; j++) {
            if (accDayList[i] == new Date(accompanyList[j].day).getDate()) {
              accDayList[i] = { x: (i + 1), y: accompanyList[j].count }
            }
          }
          if (accDayList[i].x == null) accDayList[i] = { x: (i + 1), y: 0 };
        }

        setAccDayData({ id: "여행친구", data: accDayList });
        //이상현실 일별 정리
        let idrlDayList = [...dayList];

        for (let i = 0; i < idrlDayList.length; i++) {
          for (let j = 0; j < idrlList.length; j++) {
            if (idrlDayList[i] == new Date(idrlList[j].day).getDate()) {
              idrlDayList[i] = { x: (i + 1), y: idrlList[j].count }
            }
          }
          if (idrlDayList[i].x == null) idrlDayList[i] = { x: (i + 1), y: 0 };
        }

        setIdrlDayData({ id: "이상현실", data: idrlDayList });

        let totalDayDatas = [{ id: "여행코스", data: tcDayList }, { id: "어디까지", data: trDayList }, { id: "여행친구", data: accDayList }, { id: "이상현실", data: idrlDayList }]

        console.log(totalDayDatas);
        setTotalDayData(totalDayDatas);


      })
      .catch(error => {
        console.log(error);
      })

    //년 월별 데이터 가져오기
    const yearParam = {
      year: year
    };

    axios.get(`http://${process.env.REACT_APP_JKS_IP}:8080/api/admin/monthpostcnt`, { params: yearParam, headers: header })
      .then(response => {
        console.log(response.data);

        let travelcourseList = response.data.travelcourse;
        let triedList = response.data.tried;
        let accompanyList = response.data.accompany;
        let idrlList = response.data.idealreal;

        let monthList = [];
        for (let i = 1; i < 12 + 1; i++) {
          monthList = [...monthList, i];
        }

        //여행코스 일별 정리
        let tcMonthList = [...monthList];

        for (let i = 0; i < tcMonthList.length; i++) {
          for (let j = 0; j < travelcourseList.length; j++) {
            if (tcMonthList[i] == travelcourseList[j].month) {
              tcMonthList[i] = { x: (i + 1), y: travelcourseList[j].count }
            }
          }
          if (tcMonthList[i].x == null) tcMonthList[i] = { x: (i + 1), y: 0 };
        }

        setTcMonthData({ id: "여행코스", data: tcMonthList });

        //어디까지 일별 정리
        let trMonthList = [...monthList];

        for (let i = 0; i < trMonthList.length; i++) {
          for (let j = 0; j < triedList.length; j++) {
            if (trMonthList[i] == triedList[j].month) {
              trMonthList[i] = { x: (i + 1), y: triedList[j].count }
            }
          }
          if (trMonthList[i].x == null) trMonthList[i] = { x: (i + 1), y: 0 };
        }

        setTrMonthData({ id: "어디까지", data: trMonthList });

        //여행친구 일별 정리
        let accMonthList = [...monthList];

        for (let i = 0; i < accMonthList.length; i++) {
          for (let j = 0; j < accompanyList.length; j++) {
            if (accMonthList[i] == accompanyList[j].month) {
              accMonthList[i] = { x: (i + 1), y: accompanyList[j].count }
            }
          }
          if (accMonthList[i].x == null) accMonthList[i] = { x: (i + 1), y: 0 };
        }

        setAccMonthData({ id: "여행친구", data: accMonthList });

        //이상현실 일별 정리
        let idrlMonthList = [...monthList];

        for (let i = 0; i < idrlMonthList.length; i++) {
          for (let j = 0; j < idrlList.length; j++) {
            if (idrlMonthList[i] == idrlList[j].month) {
              idrlMonthList[i] = { x: (i + 1), y: idrlList[j].count }
            }
          }
          if (idrlMonthList[i].x == null) idrlMonthList[i] = { x: (i + 1), y: 0 };
        }

        setIdrlMonthData({ id: "이상현실", data: idrlMonthList });

        let totalMonthDatas = [{ id: "여행코스", data: tcMonthList }, { id: "어디까지", data: trMonthList }, { id: "여행친구", data: accMonthList }, { id: "이상현실", data: idrlMonthList }]

        console.log(totalMonthDatas);
        setTotalMonthData(totalMonthDatas);

      })
      .catch(error => {
        console.log(error);
      })

  }, [year, month])

  //게시판별 눌림상태 체크
  useEffect(() => {

    let TempTotalDayData = [];
    let TempTotalMonthData = [];

    if (isTcData) {
      TempTotalDayData = [...TempTotalDayData, tcDayData];
      TempTotalMonthData = [...TempTotalMonthData, tcMonthData];
    }
    if (isTrData) {
      TempTotalDayData = [...TempTotalDayData, trDayData];
      TempTotalMonthData = [...TempTotalMonthData, trMonthData];
    }
    if (isAccData) {
      TempTotalDayData = [...TempTotalDayData, accDayData];
      TempTotalMonthData = [...TempTotalMonthData, accMonthData];
    }
    if (isIdrlData) {
      TempTotalDayData = [...TempTotalDayData, idrlDayData];
      TempTotalMonthData = [...TempTotalMonthData, idrlMonthData];
    }
    setTotalDayData(TempTotalDayData);
    setTotalMonthData(TempTotalMonthData);

  }, [isTcData, isTrData, isAccData, isIdrlData])

  //{핸들러} 여행코스 눌림/풀림
  const handlerTcState = () => {
    if (isTcData == true) {
      setIsTcData(false);
    } else {
      setIsTcData(true);
    }
  }

  //{핸들러} 어디까지 눌림/풀림
  const handlerTrState = () => {
    if (isTrData == true) {
      setIsTrData(false);
    } else {
      setIsTrData(true);
    }
  }

  //{핸들러} 여행친구 눌림/풀림
  const handlerAccState = () => {
    if (isAccData == true) {
      setIsAccData(false);
    } else {
      setIsAccData(true);
    }
  }

  //{핸들러} 이상현실 눌림/풀림
  const handlerIRState = () => {
    if (isIdrlData == true) {
      setIsIdrlData(false);
    } else {
      setIsIdrlData(true);
    }
  }


  return (
    <div className={Style.adminSubTitle}>게시글 동향 도표
      <select value={year}
        onChange={(e) => setYear(e.target.value)}>
        <option value="2023">2023</option>
        <option value="2022">2022</option>
        <option value="2021">2021</option>
      </select>
      <span>년</span>
      <select value={month}
        onChange={(e) => setMonth(e.target.value)}>

        <option selected >월 선택</option>
        <option value="01">1</option>
        <option value="02">2</option>
        <option value="03">3</option>
        <option value="04">4</option>
        <option value="05">5</option>
        <option value="06">6</option>
        <option value="07">7</option>
        <option value="08">8</option>
        <option value="09">9</option>
        <option value="10">10</option>
        <option value="11">11</option>
        <option value="12">12</option>
      </select>
      <span>월</span>
      {isTcData ?
        <button className={Style.buttonActive} onClick={handlerTcState}>여행코스</button>
        :
        <button className={Style.buttonNonActive} onClick={handlerTcState}>여행코스</button>
      }
      {isTrData ?
        <button className={Style.buttonActive} onClick={handlerTrState}>어디까지</button>
        :
        <button className={Style.buttonNonActive} onClick={handlerTrState}>어디까지</button>
      }
      {isAccData ?
        <button className={Style.buttonActive} onClick={handlerAccState}>여행친구</button>
        :
        <button className={Style.buttonNonActive} onClick={handlerAccState}>여행친구</button>
      }
      {isIdrlData ?
        <button className={Style.buttonActive} onClick={handlerIRState}>이상현실</button>
        :
        <button className={Style.buttonNonActive} onClick={handlerIRState}>이상현실</button>
      }
      <div className={Style.chart}>
        <span className={Style.chartTitle}>게시판별 월별 게시글 등록 개수</span>
        <div className={Style.dayList}>
          <ResponsiveLine
            data={totalMonthData}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{
              type: 'linear',
              min: 'auto',
              max: 'auto',
              stacked: true,
              reverse: false
            }}
            yFormat=" >-.2f"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: '월',
              legendOffset: 36,
              legendPosition: 'middle'
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: '게시글 개수',
              legendOffset: -40,
              legendPosition: 'middle'
            }}
            colors={{ scheme: 'category10' }}
            enablePoints={false}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
              {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemBackground: 'rgba(0, 0, 0, .03)',
                      itemOpacity: 1
                    }
                  }
                ]
              }
            ]}
          />
        </div>
      </div>
      <div className={Style.chart}>
        <span className={Style.chartTitle}>게시판별 일별 게시글 등록 개수</span>
        <div className={Style.dayList}>

          <ResponsiveLine
            data={totalDayData}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{
              type: 'linear',
              min: 'auto',
              max: 'auto',
              stacked: true,
              reverse: false
            }}
            yFormat=" >-.2f"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: '일자',
              legendOffset: 36,
              legendPosition: 'middle'
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: '게시글 개수',
              legendOffset: -40,
              legendPosition: 'middle'
            }}
            colors={{ scheme: 'category10' }}
            enablePoints={false}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[
              {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemBackground: 'rgba(0, 0, 0, .03)',
                      itemOpacity: 1
                    }
                  }
                ]
              }
            ]}
          />
        </div>
      </div>
    </div>
  )
}
export default AdminBoard;