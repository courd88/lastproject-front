import Frame from "../main/Frame";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import './AccompanyWrite.css';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import styles from "./AccompanyWrite.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import jwt_decode from 'jwt-decode';

const ariaLabel = { 'aria-label': 'description' };

const AccompanyWrite = () => {

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
            navigate('/accompany');
        }
    },[])

    let today = new Date();

    const navigate = useNavigate();

    const [accompanyTitle, setAccompanyTitle] = useState('');
    const [accompanyContent, setAccompanyContent] = useState('');
    const [accompanyStartTime, setAccompanyStartTime] = useState(today);
    const [accompanyEndTime, setAccompanyEndTime] = useState(today);
    const [accompanyImage, setAccompanyImage] = useState([]);
    const [accompanyNumbers, setAccompanyNumbers] = useState('');
    const [accompanyRegion, setAccompanyRegion] = useState('');

    // 
    const [imageFiles, setImageFiles] = useState([]);

    const inputFile = useRef();

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

                // 이미지 미리보기
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
    }

    // FORM DATA를 저장할 상태 변수를 변수 이름: 값 형식으로 설정
    let datas = {
        accompanyTitle: accompanyTitle,
        accompanyContent: accompanyContent,
        accompanyStartTime: accompanyStartTime,
        accompanyEndTime: accompanyEndTime,
        accompanyNumbers: accompanyNumbers,
        accompanyRegion: accompanyRegion,
        userId: userId
    };

    // 서버로 전달할 폼 데이터를 작성
    const formData = new FormData();
    formData.append(
        'data',
        new Blob([JSON.stringify(datas)], { type: 'application/json' })
    );

    console.log(imageFiles);
    Object.values(imageFiles).forEach(
        file => Object.values(file.files).forEach(
            f => formData.append(file.name, f)));

    // multipart/form-data 형식으로 서버로 전달
    const handleSubmit = (e) => {
        console.log(datas);
        console.log(formData.values().next());
        e.preventDefault();

        axios({
            method: 'POST',
            url: `http://${process.env.REACT_APP_JKS_IP}:8080/api/accompany/write`,
            headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${jwtToken}`},
            data: formData
        })
            .then(response => {
                console.log("xxxxxxxxxxxxx")
                console.log(response)
                alert(`${response.data}\n 등록 성공`)

                //스프링에서 채팅방 등록처리 해주면 될 듯?
                
                navigate('/accompany')
            })
            .catch(error => {
                console.log(error)
                alert(`${error.message} 아니왜 안돼!`)
            })
    };

    // 
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

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     axios.post(`http://localhost:8080/api/accompany/write`,
    //         { "accompanyTitle": title, "accompanyContent": content, "accompanyStartTime": startTime, "accompanyEndtTime": endTime, "accompanyImage": image, "accompanyNumbers": numbers, "accompanyRegion": region },
    //         // { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } }
    //     )
    //         .then(response => {
    //             console.log(response)
    //             alert("정상처리 되었습니다");
    //             navigate('/accompany')
    //         })
    //         .catch(error => {
    //             console.log(error);
    //             alert(error.message);
    //         })

    // };



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
                    {/* <li><button onChange={handleChangeRegion}>서울</button></li>
                    <li><button onChange={handleChangeRegion}>강원도</button></li>
                    <li><button onChange={handleChangeRegion}>제주도</button></li>
                    <li><button onChange={handleChangeRegion}>부산</button></li>
                    <li><button onChange={handleChangeRegion}>경기도</button></li>
                    <li><button onChange={handleChangeRegion}>인천</button></li>
                    <li><button onChange={handleChangeRegion}>충청도</button></li>
                    <li><button onChange={handleChangeRegion}>경상도</button></li>
                    <li><button onChange={handleChangeRegion}>전라도</button></li> */}
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
                        accompanyImage.length !== 0
                            ?
                            <>
                                {accompanyImage.map((image) => (
                                    <div className={styles.imgWidth}>
                                        <img src={image} className={styles.imgHi} />
                                        <label htmlFor="fileSlt" className={styles.label}>Select File</label>
                                        <input
                                            id="fileSlt"
                                            className={styles.input}
                                            type='file'
                                            name='accompanyImg'
                                            ref={inputFile}
                                            onChange={handlerChangeFile}
                                        />
                                    </div>
                                ))}
                            </>
                            :
                            <>
                                <label htmlFor="fileSlt" className={styles.imgSelect}>Select File</label>
                                <input
                                    id="fileSlt"
                                    type='file'
                                    name='accompanyImg'
                                    ref={inputFile}
                                    onChange={handlerChangeFile}
                                    className={styles.input}
                                />
                            </>
                    }
                </div>
                <div id="accompany-title-write">
                    <div>TITLE</div>
                    <Input placeholder="Placeholder" inputProps={ariaLabel} value={accompanyTitle} onChange={handleChangeTitle} />
                </div>
                <div id="accompany-content-write">
                    <div>CONTENTS</div>
                    {/* <Input placeholder="Placeholder" inputProps={ariaLabel} /> */}
                    <div className={styles.editor}>
                        <CKEditor
                            editor={ClassicEditor}
                            data="</br></br></br></br></br></br></br></br></br></br></br></br>"
                            onReady={editor => {
                                // You can store the "editor" and use when it is needed.
                                console.log('Editor is ready to use!', editor);
                            }}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                console.log({ event, editor, data });
                                setAccompanyContent(data);
                            }}
                        // onBlur={ ( event, editor ) => {
                        //     console.log( 'Blur.', editor );
                        // } }
                        // onFocus={ ( event, editor ) => {
                        //     console.log( 'Focus.', editor );
                        // } }
                        />
                    </div>
                </div>
                <div id="accompany-title-write">
                    <div>Member</div>
                    <Input placeholder="Placeholder" inputProps={ariaLabel} value={accompanyNumbers} onChange={handleChangeNumbers} />
                </div>
                <div id="accompany-write-btn">
                    <Button variant="contained" type="submit" onClick={handleSubmit}>WRITE</Button>
                </div>
            </div>
        </Frame>
    )
}

export default AccompanyWrite;