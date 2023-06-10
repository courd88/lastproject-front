import axios from 'axios';
import './MapEach.css';
import PinDropRoundedIcon from '@mui/icons-material/PinDropRounded';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useState } from 'react';
import MapDetail from './MapDetail';

const MapEach = (props) => {

  const modalOpen = props.modalOpen;
  const userNickname = props.userNickname;  //작성자닉네임
  const userImg = props.userImg;
  const startDate = props.startDate;        //시작일
  const endDate = props.endDate;            //끝일
  const title = props.title;                //제목
  const img = props.img;                    //썸넬 이미지
  const days = props.days;                  //데이정보


  // console.log(days);

  // let day식별자 =[];

  // const 객체배열담기 = (origin) => {
  //   const 원본배열 = origin;
  //   const 담을배열 = [];
  //   let 임시객체 = [];

  //   //고유키값설정
  //   day식별자 = removeDuplicates(원본배열, 'day');
  //   console.log(day식별자);

  //   for (let i = 0; i < day식별자.length; i++) {
  //     for (let j = 0; j < 원본배열.length; j++) {
  //       if (day식별자[i].day == 원본배열[j].day) {
  //         임시객체 = [
  //           ...임시객체, {
  //             day: 원본배열[j].day,
  //             dayDescription: 원본배열[j].dayDescription,
  //             lat: 원본배열[j].lat,
  //             lng: 원본배열[j].lat,
  //             orders: 원본배열[j].orders,
  //             placeName: 원본배열[j].placeName
  //           }
  //         ]
  //       }
  //     }
  //     if (임시객체 != 0) {
  //       담을배열.push(임시객체);
  //     }
  //     임시객체 = [];//초기화
  //   }
  //   return 담을배열;
  // }

  // //중복제거 함수
  // const removeDuplicates = (array, key) => {
  //   const uniqueArray = [];
  //   const uniqueKeys = [];

  //   array.forEach((item) => {
  //     const value = item[key];
  //     if (!uniqueKeys.includes(value)) {
  //       uniqueKeys.push(value);
  //       uniqueArray.push(item);
  //     }
  //   });

  //   return uniqueArray;
  // };

  //days를 사용해서 DAY별 객체로 담음. days는 day중복있는 데이터.
  // const 필터day = 객체배열담기(days)
  // console.log(필터day);

  const [dayIndex, setDayIndex] = useState(0);

  const 이전코스핸들러 = () => {
    if (dayIndex == 0) {
      return
    } else {
      setDayIndex(dayIndex - 1);
    }
  }

  const 다음코스핸들러 = () => {
    if (dayIndex == days.length - 1) {
      return
    } else {
      setDayIndex(dayIndex + 1);
    }
  }

  // console.log(days.length != 0 && days[dayIndex].day);
  const thumnailImg = `http://${process.env.REACT_APP_JKS_IP}:8080/api/getimage/${img}`;
  const profileImg = `http://${process.env.REACT_APP_JKS_IP}:8080/api/getimage/${userImg}`;

  // onClick={props.modalOpen}
  return (
    <>
      <div id="map-each-wrap" >
        <div id="map-each-head-wrap">
          <div id="map-each-user-img">
            <PinDropRoundedIcon fontSize='large' />
            <img src={profileImg} />
          </div>
          <div id="map-each-user-info">
            <div id="map-each-user-userid">
              {userNickname}
            </div>
            <div id="map-each-date-area">
              <span>{startDate}~{endDate}</span><br />
              {/* <span>경기도</span> */}
            </div>
          </div>
        </div>
        <div id="map-each-main-img" onClick={()=>modalOpen()}>
          <img src={thumnailImg} />
        </div>
        <div id="map-each-course-info">
          <div id="map-each-course-title">
            <span>{title}</span>
          </div>
          <div id="map-each-course-wrap">
            {dayIndex == 0 ? <div className='map-each-course-blank-btn'></div> :
              <ArrowBackIosNewIcon onClick={이전코스핸들러} />
            }
            <div id="map-each-course-days">
              { days[dayIndex] && 
              <div id="map-each-course-day">DAY{days[dayIndex].day}</div>
              }
              <div id="map-each-course-list">
                { days.length != 0 && days[dayIndex].dayinfo && days[dayIndex].dayinfo.map(day => (
                  <span>{day.placeName}</span>
                ))}
              </div>
            </div>
            {dayIndex == days.length-1 ? <div className='map-each-course-blank-btn'></div> :
            <ArrowForwardIosIcon onClick={다음코스핸들러} />
            }
          </div>
        </div>
      </div>

    </>
  )
}
export default MapEach;