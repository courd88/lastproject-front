import './MapWrite.css';
import styles from './MapWrite.module.css';
import React, { useEffect, useState } from "react";
import { Add } from "@mui/icons-material";
import { Button, Input } from "@mui/material";
import CourseWrite from "./CourseWrite";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import MapObject from "./MapObject";
import Frame from "../main/Frame";
import { DatePicker } from "@mui/x-date-pickers";
import jwt_decode from 'jwt-decode';
import { format, getDay, isAfter, isBefore } from 'date-fns';


const MapWrite = () => {

  let today = new Date();


  //0------------토큰확인----------------
  let nickName = null;
  let userId = null;
  let jwtToken = null;
  if (sessionStorage.getItem('token') != null) {
    jwtToken = sessionStorage.getItem('token');
    userId = jwt_decode(jwtToken).sub;
    nickName = jwt_decode(jwtToken).nickname;
  }

  const header = {
    'Authorization': `Bearer ${jwtToken}`,
    'Content-Type': 'application/json'
  };

  useEffect(()=>{
    if(userId == null){
        alert('로그인 후 사용하실 수 있습니다.');
        navigate('/corse');
    }
},[])
  //0-------------------------------------


  //1------------변수설정-----------------
  const navigate = useNavigate();

  const [startDate, setStartDate] = useState(today);//일정 시작 시간
  const [endDate, setEndDate] = useState(today);    //일정 끝 시간
  const [title, setTitle] = useState('');        //글 제목

  const [choiceDay, setChoiceDay] = useState(1);  //Day선택
  const [lat, setLat] = useState(0);              //구글맵에서 받아오는 위도
  const [lng, setLng] = useState(0);              //구글맵에서 받아오는 경도
  const [placeName, setPlaceName] = useState(''); //구글맵에서 받아오는 장소명

  const [uploadImg, setUploadImg] = useState([]);
  const [imageFiles, setImageFiles] = useState([]); //이름 형태로 파일 저장
  const [imageFile, setImageFile] = useState([]); //blob형태로 파일 저장
  const [counter, setCounter] = useState(1);


  const dayCount = Math.floor((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24) + 1);
  console.log(startDate);
  console.log(endDate);
  console.log("총일수", dayCount)

  //CourseDay 배열
  const [arrCourseDay, setArrCourseDay] = useState([{
    day: 1,
    dayinfo: [{
      orders: 1,
      placeName: "Example",
      lat: 1,
      lng: 1
    }],
    dayDescription: ""
  }]);
  //1---------------------------------------

  //2----------핸들러----------------------
  //2-1.{핸들러} 글쓰기 버튼
  const handlerSubmit = (e) => {
    e.preventDefault();

    //Request Data 본문
    const data = {
      userId: userId,
      travelcourseStartDate: startDate,
      travelcourseEndDate: endDate,
      travelcourseTitle: title,
      travelcourseDetailList: arrCourseDay
    }

    //이미지 추가 formData생성 및 data 추가
    let formData = new FormData();

    formData.append(
      'data',
      new Blob([JSON.stringify(data)], { type: 'application/json' })
    );

    Object.values(imageFiles).forEach(
      file => Object.values(file.files).forEach(
        f => formData.append(file.name, f)));

    //data에 장소명이 누락된 Day가 있다면 등록 불가
    let emptydataCheck = false;
    arrCourseDay.forEach(day => { if (day.dayinfo.length == 0) emptydataCheck = true });
    //체크 true면 바로 리턴
    if (emptydataCheck) {
      alert("코스가 비어있는 DAY가 있어요. DAY를 삭제하거나 코스를 추가해주세요.")
      return
    }

    console.log(data);
    axios.post(`http://${process.env.REACT_APP_JKS_IP}:8080/api/course`, formData,
      { headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${jwtToken}` } })
      //, 'Authorization': `Bearer ${jwtToken}` 
      .then(response => {
        console.log(response);
        if (response.data === "정상처리") {
          navigate('/course');
        } else {
          alert(response.data.message);
          return;
        }
      })
      .catch(error => {
        console.log(error);
        alert(`${error.response.data.message} (${error.message})`);
        return;
      });
  };

  //2-2.{핸들러} DAY 선택
  const 데이선택핸들러 = (day) => {
    setChoiceDay(day);
    console.log("day" + day + " 선택");
  }

  //2-3.{핸들러} 일정 추가
  const handlerAddDay = () => {
    console.log("추가 클릭");
    if (arrCourseDay.length == dayCount) {
      alert("기간상 더이상 일정을 추가할 수 없습니다.");
      return
    } else {
      const 배열복사본 = [...arrCourseDay];
      배열복사본.push({
        day: 배열복사본.length + 1,
        dayinfo: []
      })
      setArrCourseDay(배열복사본);
    }
  }

  //2-4.{핸들러} 장소저장`
  const 장소저장 = () => {
    //일단 현재 배열값 복사하고, 순서를 위해서 
    const 배열복사본 = [...arrCourseDay];
    const 객체 = 배열복사본.filter(arr => arr.day == choiceDay);
    console.log(객체);
    let order번호 = (객체[0].dayinfo.length == 0 ? 1 : 객체[0].dayinfo[객체[0].dayinfo.length - 1].orders + 1)
    const newDayInfo = {
      orders: order번호,
      placeName: placeName,
      lat: lat,
      lng: lng
    }
    배열복사본[choiceDay - 1].dayinfo.push(newDayInfo);
    setArrCourseDay(배열복사본);
  }

  //2-5.{핸들러}칩 삭제 버튼
  const 장소삭제 = (chipday, chipPlace) => {
    let 배열복사본 = [...arrCourseDay];
    //칩에 날짜랑 동일한 객체(DAY) 반환
    let 객체 = 배열복사본.filter(arr => arr.day == chipday);

    //해당 날짜 객체에서
    const 수정객체dayinfo = 객체[0].dayinfo.filter(객체 => 객체.placeName !== chipPlace);

    객체[0].dayinfo = 수정객체dayinfo;
    배열복사본[chipday - 1] = 객체[0];
    setArrCourseDay(배열복사본);
  }

  //2-6.{핸들러} 일정 삭제
  const 일정삭제 = (courseDay) => {
    let 배열복사본 = [...arrCourseDay];

    //삭제버튼 누른 
    let 수정배열 = 배열복사본.filter(arr => arr.day != courseDay);
    for (let i = 0; i < 수정배열.length; i++) {
      수정배열[i].day = i + 1;
    }
    setArrCourseDay(수정배열);
  }

  //2-7.{핸들러} 일정 올리기
  const 일정올리기 = (courseDay) => {
    let 배열복사본 = [...arrCourseDay]; //배열복사하여 2개를 사용 한개의 배열의 값이 바뀌기 때문에
    let 배열복사본2 = [...arrCourseDay];  //초기값을 두개로 설정해둠.

    let 데이복사본 = 배열복사본.slice(courseDay - 1, courseDay); //day 2라면, 2일차 꺼내기
    배열복사본2.splice(courseDay - 1, 1); //2일차를 원래 배열에서 삭제하기
    let 배열복사본3 = [...배열복사본2];
    배열복사본3.splice(courseDay - 2, 0, 데이복사본[0]); //앞의 일자에 집어넣기

    for (let i = 0; i < 배열복사본3.length; i++) {
      배열복사본3[i].day = i + 1;
    }
    setArrCourseDay(배열복사본3);

  }

  //2-8.{핸들러} 일정 내리기
  const 일정내리기 = (courseDay) => {
    let 배열복사본 = [...arrCourseDay];
    let 배열복사본2 = [...배열복사본];
    let 데이복사본 = 배열복사본.slice(courseDay - 1, courseDay); //day2라면, 2일차 꺼내기
    배열복사본2.splice(courseDay - 1, 1); //2일차를 원래 배열에서 삭제하기
    let 배열복사본3 = [...배열복사본2];
    배열복사본3.splice(courseDay, 0, 데이복사본[0]); //뒤에 일자에 집어넣기

    for (let i = 0; i < 배열복사본3.length; i++) {
      배열복사본3[i].day = i + 1;
    }

    setArrCourseDay(배열복사본3);
  }

  //2-9.{핸들러} 코스소개
  const 코스소개작성 = (day, 코스내용) => {
    let 배열복사본 = [...arrCourseDay];
    배열복사본[day - 1].dayDescription = 코스내용;
    setArrCourseDay(배열복사본);
  }

  //2--------------------------------------------
  //뒤로가기 같은걸 누르면 작성을 취소하시겠습니까? 컨펌창 키기

  const handlerStartDate = (e) => {
    if (isAfter(e, endDate)) {
      alert("startDate은 endDate보다 후일 수 없다.")
      setStartDate(endDate);
      return
    }
    setStartDate(e);
  }

  const handlerEndDate = (e) => {
    if (isBefore(e, startDate)) {
      alert("endDate은 startDate보다 전일 수 없다.")
      setEndDate(startDate);
      return
    }
    setEndDate(e);
  }


  //파일 추가시 미리보기, 
  const handlerChangeFile = (e) => {
    const name = e.target.name;
    const files = e.target.files;

    //input 박스의 이름이 idealrealIdealImg라면
    //-----------------------------------
    if (e.target.name == 'courseImg') {

      let imageArr;

      if (imageFile.length == 0) {
        imageArr = e.target.files;
        setImageFile([...e.target.files]);
      } else {
        imageArr = [...imageFile, ...e.target.files];
        setImageFile((prevFiles) => [...prevFiles, ...e.target.files]);
      }
      console.log(imageFile);
      console.log(imageFiles);
      // let imageFile = e.target.files;
      let imageURLs = [];
      let image;
      //이미지 개수가 6보다 크면 6 아니면 이미지 개수.
      let imagesLength = imageArr.length > 6 ? 6 : imageArr.length;

      //이미지 개수만큼 반복(미리보기에 추가)
      for (let i = 0; i < imagesLength; i++) {
        image = imageArr[i];
        // 이미지 미리보기 로직 FileReader
        const reader = new FileReader();
        reader.onload = () => {

          console.log(reader.result);

          imageURLs[i] = reader.result;
          setUploadImg([...imageURLs]);
        };
        reader.readAsDataURL(image);
      }
    }
    //바뀌지 않은 파일들은 필터로 걸러서 복붙해줌.
    const unchangedImageFile = imageFile.filter(file => file.name !== name);
    // setImageFile([...unchangedImageFile]);

    let unchangedImageFiles;

    const file = e.target.files[0];

    if (imageFiles.length == 0) {
      setImageFiles([{ name, files }]);
    } else {
      // unchangedImageFiles = imageFiles[0].files.filter(file => file.name !== name);
      unchangedImageFiles = imageFiles[0].files;
      console.log(unchangedImageFiles)

      unchangedImageFiles = { ...unchangedImageFiles, [counter]: file };

      //unchangedImageFiles[0].files.append(files);
      setCounter(prev => prev + 1);
      setImageFiles([{ name, files: unchangedImageFiles }]);
    }

    console.log(imageFiles);
    console.log(unchangedImageFiles);
    //이미지 파일 이름, 파일명 재설정
    //같은 이름에 

  }

  return (
    <Frame>
      <div id="map-write-wrap">
        <h1>여행코스등록</h1>
        <div id="course-date-duration">
          <span className='course-date-duration-label'>START</span>
          <span id="course-date-picker">
            {/* <DateRangePicker defaultValue={[today, tomorrow]} disableFuture /> */}
            <DatePicker value={startDate} onChange={(e) => handlerStartDate(e)} disableFuture />
          </span>
          <span className='course-date-duration-label'>END</span>
          <span id="course-date-picker">
            {/* <DateRangePicker defaultValue={[today, tomorrow]} disableFuture /> */}
            <DatePicker value={endDate} onChange={(e) => handlerEndDate(e)} disableFuture />
          </span>
        </div>
        <MapObject
          lat={lat}
          setLat={setLat}
          lng={lng}
          setLng={setLng}
          setPlaceName={setPlaceName} />
        <Button variant="contained" endIcon={<Add />} onClick={장소저장}>
          장소 저장
        </Button>
        <form id='map-write-form' name='frm' onSubmit={(e) => handlerSubmit(e)}>
          <h2 id="map-write-title">제목</h2>
          <div id="map-write-title-input">
            <Input placeholder="Write title" name='title' value={title}
              onChange={(e) => setTitle(e.target.value)} />
          </div>

          <CourseWrite
            lat={lat}
            setLat={setLat}
            lng={lng}
            setLng={setLng}
            placeName={placeName}
            setPlaceName={setPlaceName}
            choiceDay={choiceDay}
            arrCourseDay={arrCourseDay}
            코스소개작성={코스소개작성}
            데이선택핸들러={데이선택핸들러}
            장소삭제={장소삭제}
            일정삭제={일정삭제}
            일정올리기={일정올리기}
            일정내리기={일정내리기} />
          <div id="course-plus-btn" onClick={handlerAddDay}>
            <Button variant="contained" endIcon={<Add />}>
              일정추가
            </Button>
          </div>
          <p className={styles.imgTitle}>이미지</p>

          {uploadImg.length !== 0
            ?
            <div className={styles.imgWrap}>
              {uploadImg.map((img, id) => (
                <>
                  <div key={id} className={styles.imgWidth}>
                    <img className={styles.imgs} src={img} />
                    {/* <label htmlFor="fileSlt" className={styles.label}>Select File</label> */}
                    <input
                      id="fileSlt"
                      type='file'
                      name='courseImg'
                      onChange={handlerChangeFile}
                      className={styles.input}

                    />
                    {/* <div id={styles.warnMsg}>파일크기 제한 : 1MB 이하</div> */}
                  </div>
                </>
              ))}
            </div>
            :
            <div className={styles.tempImgWrap}>
              {/* {userImg != null ? <img src={userImg} style={{ width: "50%", height: 175, objectFit: "cover", borderRadius: "100%", marginBottom: 40 }} /> : <div className={styles.tempImg}></div>} */}
              {/* <label htmlFor="fileSlt" className={styles.label}>Select File</label> */}
              <input
                id="fileSlt"
                className={styles.input}
                type='file'
                name='courseImg'
                onChange={handlerChangeFile}
              />
              
            </div>
          }
          <div id={styles.warnMsg}>파일크기 제한 : 1MB 이하</div>
          <label id="fileSltLabel" htmlFor="fileSlt" className={styles.label}>
            {/* <Button variant="contained"> */}
              <div className={styles.imgLabelBtn}>
              이미지 업로드
              </div>
              
            {/* </Button> */}
          </label>
          
          <hr></hr>
          <div id="map-write-bottom-btn">
            <Button type='submit' id='submit' variant="contained">
              등록
            </Button>
            <Button variant="contained" onClick={() => navigate(`/course`)}>
              목록
            </Button>
          </div>
        </form>
      </div>
    </Frame>
  );
}

export default MapWrite;