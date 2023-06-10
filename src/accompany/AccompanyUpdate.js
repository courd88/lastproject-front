import Frame from "../main/Frame";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import './AccompanyUpdate.css';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import styles from "./AccompanyUpdate.module.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import jwt_decode from 'jwt-decode';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const ariaLabel = { 'aria-label': 'description' };

const AccompanyUpdate = () => {

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


  const { accompanyIdx } = useParams();


  const navigate = useNavigate();

  const [accompanyTitle, setAccompanyTitle] = useState('');
  const [accompanyContent, setAccompanyContent] = useState('');
  const [accompanyStartTime, setAccompanyStartTime] = useState('');
  const [accompanyEndTime, setAccompanyEndTime] = useState('');
  const [accompanyImage, setAccompanyImage] = useState([]);
  const [accompanyNumbers, setAccompanyNumbers] = useState('');
  const [accompanyRegion, setAccompanyRegion] = useState('');
  const [filename, setFilename] = useState('');
  const [data, setData] = useState([]);
  const [imageUrl, setImageUrl] = useState('');

  const [imageFiles, setImageFiles] = useState([]);


  useEffect(() => {
    axios.get(
      `http://localhost:8080/api/accompany/${accompanyIdx}`, { headers: header })
      .then(response => {
        console.log(response.data);
        // 초기값 설정
        setData(response.data);
        let startTime = new Date(response.data.accompanyStartTime.replace(".", "-"));
        let endTime = new Date(response.data.accompanyEndTime.replace(".", "-"));
        setAccompanyTitle(response.data.accompanyTitle);
        setAccompanyContent(response.data.accompanyContent);
        setAccompanyStartTime(startTime);
        setAccompanyEndTime(endTime);
        setAccompanyNumbers(response.data.accompanyNumbers);
        setAccompanyRegion(response.data.accompanyRegion);
        setFilename(response.data.accompanyImage);
      })
      .catch(error =>
        console.log(error));
  }, []);

  const [regions, setRegions] = useState([
    { name: "서울", check: false },
    { name: "강원도", check: false },
    { name: "제주도", check: false },
    { name: "부산", check: false },
    { name: "경기도", check: false },
    { name: "인천", check: false },
    { name: "충청도", check: false },
    { name: "경상도", check: false },
    { name: "전라도", check: false }
  ]);

  const handlerFilterSelect = (region) => {

    let regionClickCheck = [...regions];
    let tempRegion = '';

    for (let i = 0; i < regionClickCheck.length; i++) {
      if (regionClickCheck[i].name == region) {
        regionClickCheck[i].check = true;
        tempRegion = regionClickCheck[i].name;
      } else {
        regionClickCheck[i].check = false;
      }
    }
    // console.log(regionClickCheck);
    setRegions(regionClickCheck);
    setAccompanyRegion(tempRegion);
    console.log(region);
  }

  const handleChangeTitle = (e) => {
    setAccompanyTitle(e.target.value);
  };

  const handleChangeStartTime = (e) => {
    setAccompanyStartTime(e);
  };

  const handleChangeEndTime = (e) => {
    setAccompanyEndTime(e);
  };

  const handleChangeNumbers = (e) => {
    setAccompanyNumbers(e.target.value);
  };

  // 이미지 가져오기
  useEffect(() => {
    if (filename) {
      const imageUrl = `http://localhost:8080/api/getimage/${filename}`;
      axios.get(imageUrl, { responseType: 'arraybuffer' })
        .then(response => {
          const imageBlob = new Blob([response.data], { type: response.headers['content-type'] })
          const imageUrl = URL.createObjectURL(imageBlob);
          setImageUrl(imageUrl);
          console.log(imageUrl);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, [filename, accompanyImage]);

  // FORM DATA를 저장할 상태 변수를 변수 이름: 값 형식으로 설정
  let datas = {
    accompanyIdx: accompanyIdx,
    accompanyTitle: accompanyTitle,
    accompanyContent: accompanyContent,
    accompanyStartTime: accompanyStartTime,
    accompanyEndTime: accompanyEndTime,
    accompanyNumbers: accompanyNumbers,
    accompanyRegion: accompanyRegion,
    userId : userId
  };

  // 서버로 전달할 폼 데이터를 작성
  const formData = new FormData();
  formData.append(
    'data',
    new Blob([JSON.stringify(datas)], { type: 'application/json' })
  );
  Object.values(imageFiles).forEach(
    file => Object.values(file.files).forEach(
      f => formData.append(file.name, f)));

  // multipart/form-data 형식으로 서버로 전달
  const handleSubmit = (e) => {
    console.log(datas);
    console.log(formData);
    e.preventDefault();
    axios({
      method: 'PUT',
      url: `http://localhost:8080/api/accompany/update/${accompanyIdx}`,
      headers: {
        'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${jwtToken}`
      },
      data: formData
    })
      .then(response => {
        console.log(response)
        alert(`수정되었습니다`)
        navigate(`/accompany/detail/${accompanyIdx}`)
      })
      .catch(error => {
        console.log(error)
        alert(error.message)
      })
  };

  //파일변경
  const handlerChangeFile = (e) => {
    const name = e.target.name;
    const files = e.target.files;

    if (e.target.name == 'accompanyImg') {
      const imageArr = e.target.files;
      let imageURLs = [];
      let image;
      let imagesLength = imageArr.length > 6 ? 6 : imageArr.length;

      for (let i = 0; i < imagesLength; i++) {
        image = imageArr[i];

        // 이미지 미리보기 로직 FileReader라는 자체코드로 원리는 모르지만 알아서 짜줌
        const reader = new FileReader();
        reader.onload = () => {
          console.log(reader.result);
          imageURLs[i] = reader.result;
          setAccompanyImage([...imageURLs]);
        };
        reader.readAsDataURL(image);
      }
    }


    const unchangedImageFiles = imageFiles.filter(file => file.name !== name)
    setImageFiles([...unchangedImageFiles, { name, files }]);
  };

  const [lang, setLang] = useState(15);
    
  const handleChange = (event) => {

  };

  return (
    <Frame>
      <div id="accompany-main-write-img">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Bukchon_Hanok_Village_%EB%B6%81%EC%B4%8C_%ED%95%9C%EC%98%A5%EB%A7%88%EC%9D%84_October_1_2020_15.jpg/1280px-Bukchon_Hanok_Village_%EB%B6%81%EC%B4%8C_%ED%95%9C%EC%98%A5%EB%A7%88%EC%9D%84_October_1_2020_15.jpg" />
      </div>
      <div id="accompany-write-wrap">
        <ul id="accompany-write-area-ul">
          {regions.map((region) => (
            <li className={region.check == true ? "active" : ""}
              onClick={() => handlerFilterSelect(region.name)}
              value={region.name}
            >
              {region.name}
            </li>
          ))}
        </ul>
        <div id="accompany-date-pick">
          <div>시작 날짜</div>
          <DatePicker disablePast value={accompanyStartTime} onChange={handleChangeStartTime} />

          <div>종료 날짜</div>
          <DatePicker disablePast value={accompanyEndTime} onChange={handleChangeEndTime} />
        </div>
        <div id="accompany-img">
          {/* <img src="https://hanok.seoul.go.kr/images/sub/hanok_definition1.jpg" />
                </div>
                <div id="accompany-upload-btn">
                    <Button variant="contained">
                        IMG UPLOAD
                    </Button>
                    <Button variant="contained">IMG UPLOAD</Button> */}
          {
            // accompanyImage.length !== 0
            //     ?
            <>
              {/* {accompanyImage.map((image) => ( */}
              <div className={styles.imgWidth}>
                {/* <img src={`http://localhost:8080/api/getImage/${accompanyImage}`} className={styles.imgHi} /> */}
                {accompanyImage.length == 0 ?
                  <img src={imageUrl} className={styles.imgHi} /> :
                  <img src={accompanyImage} className={styles.imgHi} />
                }
                <label htmlFor="fileSlt" className={styles.label}>Select Fddile</label>
                <input
                  id="fileSlt"
                  className={styles.input}
                  type='file'
                  name='accompanyImg'
                  onChange={handlerChangeFile}
                />
              </div>
              {/* ))}  */}
            </>
            // :
            // <>
            // <img src={imageUrl} style={{ width: "100%", height: 250, objectFit: "scale-down" }} />
            //     <label htmlFor="fileSlt" className={styles.imgSelect}>Select Fidddle</label>
            //     <input
            //         id="fileSlt"
            //         type='file'
            //         name='accompanyImg'
            //         onChange={handlerChangeFile}
            //         className={styles.input}
            //     />
            // </>
          }
        </div>
        <div id="accompany-title-write">
          <div>TITLE</div>
          <Input placeholder="Placeholder" inputProps={ariaLabel} value={accompanyTitle} onChange={handleChangeTitle} />
        </div>
        <div id="accompany-content-write">
          <div>CONTENTS</div>
          <div className={styles.editor}>
            <CKEditor
              editor={ClassicEditor}
              data={accompanyContent}
              onReady={editor => {
              }}
              onChange={(event, editor) => {
                const data = editor.getData();
                // console.log({ event, editor, data });
                setAccompanyContent(data);
              }}

            />
          </div>
        </div>
        <div id="accompany-title-write">
          <div>Member</div>
          {/* <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={lang}
              defaultValue={15}
              onChange={handleChange}
              label="lang"
            >
              <MenuItem value={15}>
                <em>Kor</em>
              </MenuItem>
              <MenuItem value={10}>Eng</MenuItem>
              <MenuItem value={20}>Jap</MenuItem>
            </Select>
          </FormControl> */}
          <Input placeholder="Placeholder" inputProps={ariaLabel} value={accompanyNumbers} onChange={handleChangeNumbers} />
        </div>
        <div id="accompany-write-btn">
          <Button variant="contained" type="submit" onClick={handleSubmit}>Modify</Button>
        </div>
      </div>
    </Frame>
  )
}

export default AccompanyUpdate;