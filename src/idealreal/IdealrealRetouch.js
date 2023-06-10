import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useRef } from "react";
import Frame from "../main/Frame";
import styles from "./IdealrealRetouch.module.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Button from '@mui/joy/Button';
import { Input } from "@mui/material";
import jwt_decode from 'jwt-decode';

function IdealrealRetouch() {

    const navigate = useNavigate();
    const location = useLocation();
    const prevIdealImg = location.state.idealImg;
    const prevRealImg = location.state.realImg;

    let nickName = null;
    let loginUserId = null;
    let jwtToken = null;
    if (sessionStorage.getItem('token') != null) {
        jwtToken = sessionStorage.getItem('token');
        loginUserId = jwt_decode(jwtToken).sub;
        nickName = jwt_decode(jwtToken).nickname;
    }

    const header = {
        'Authorization': `Bearer ${jwtToken}`,
        'Content-Type': 'application/json'
    };
    const [contents, setContents] = useState('')
    const [name, setName] = useState('');
    const [idealrealTitle, setIdealrealTitle] = useState('');
    const [idealrealContent, setIdealrealContent] = useState('');
    const [userId, setUserId] = useState('');
    const [idealrealCreatedTime, setIdealrealCreatedTime] = useState('');
    const [idealrealCnt, setIdealrealCnt] = useState('');
    const [idealrealIdealImg, setIdealrealIdealImg] = useState([])
    const [idealrealRealImg, setIdealrealRealImg] = useState([])

    const [imageFiles, setImageFiles] = useState([])

    const { idealrealIdx } = useParams();



    useEffect(() => {
        axios.get(`http://${process.env.REACT_APP_KTG_IP}:8080/api/listidealreal/detail/${idealrealIdx}`, {headers: header}
            // { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } }
        )
            .then(response => {
                console.log(response);
                setIdealrealTitle(response.data.idealrealTitle);
                setIdealrealContent(response.data.idealrealContent);
                setUserId(response.data.userId);
                setIdealrealCreatedTime(response.data.idealrealCreatedTime);
                setIdealrealCnt(response.data.idealrealCnt);

            })
            .catch(error => console.log(error));
    }, []);


    //{핸들러}이름변경
    const handlerTitleChange = (e) => {
        setIdealrealTitle(e.target.value);
    }
    
    // FORM DATA를 저장할 상태 변수를 변수 이름: 값 형식으로 설정
    let datas = {
        userId : loginUserId,
        idealrealIdx: idealrealIdx,
        idealrealTitle: idealrealTitle,
        idealrealContent: contents
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
            url: `http://${process.env.REACT_APP_KTG_IP}:8080/api/idealreal/${idealrealIdx}`,
            headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${jwtToken}` },
            data: formData
        })
            .then(response => {
                console.log(response)
                alert(`${response.data}\n오 수정`)
                navigate('/idealreal')
            })
            .catch(error => {
                console.log(error)
                alert(error.message)
            })
        console.log(`Name: ${name}, Comment: ${contents}`);
    };


    // const changeImageFiles = (data, type) => {
    //     console.log(data, type);
    //     const newImageFiles = [...imageFiles];

    //     if (type === 'ideal')
    //         newImageFiles[0] = data;
    //     else
    //         newImageFiles[1] = data;

    //     setImageFiles(newImageFiles);
    // };

    //const inputFiles1 = useRef();
    //const inputFiles2 = useRef();

    //파일변경
    const handlerChangeFile = (e) => {
        const name = e.target.name;
        const files = e.target.files;

        if (e.target.name == 'idealrealIdealImg') {
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
                    setIdealrealIdealImg([...imageURLs]);
                };
                reader.readAsDataURL(image);
            }
        }

        if (e.target.name == 'idealrealRealImg') {
            const imageArr = e.target.files;
            let imageURLs = [];
            let image;
            let imagesLength = imageArr.length > 6 ? 6 : imageArr.length;

            for (let i = 0; i < imagesLength; i++) {
                image = imageArr[i];

                const reader = new FileReader();
                reader.onload = () => {
                    console.log(reader.result);
                    imageURLs[i] = reader.result;
                    setIdealrealRealImg([...imageURLs]);
                };
                reader.readAsDataURL(image);
            }
        }

        const unchangedImageFiles = imageFiles.filter(file => file.name !== name)
        setImageFiles([...unchangedImageFiles, { name, files }]);
    };


    //const idealImg = `http://${process.env.REACT_APP_KTG_IP}:8080/api/getimage/${idealrealIdealImg}`;
    //const realImg = `http://${process.env.REACT_APP_KTG_IP}:8080/api/getimage/${idealrealRealImg}`;


    return (
        <Frame>
            <div className={styles.containerWrap}>
                <h2 className={styles.realTitle}>이상과 현실</h2>
                <div className={styles.content}>
                    <Input placeholder="제목을 적어주세요" id="idealrealTitle" name="idealrealTitle" value={idealrealTitle} onChange={handlerTitleChange} className={styles.titleInput}  />
                    <span className={styles.userId}>{userId}</span>
                    <div className={styles.timeCnt}>
                        <span className={styles.time}>{idealrealCreatedTime}</span>
                        <span>조회수 {idealrealCnt}</span>
                    </div>
                    <div className={styles.contentBox}>
                        <div className={styles.imgBox}>
                            <div className={styles.imgBox1} >
                                {
                                    idealrealRealImg.length !== 0
                                        ?
                                        <>
                                            {idealrealRealImg.map((image, id) => (
                                                <><div key={id} className={styles.imgWidth}>
                                                    <img src={image} style={{ width: "100%", height: 250, objectFit: "scale-down" }} />
                                                    <label htmlFor="fileSltRight" className={styles.label}>Select File</label>
                                                    <input
                                                        id="fileSltRight"
                                                        type='file'
                                                        name='idealrealRealImg'
                                                        //ref={inputFiles2}
                                                        onChange={handlerChangeFile}
                                                        className={styles.input}
                                                    /></div></>
                                            ))}
                                        </>
                                        :
                                        <>
                                        <div className={styles.imgWidth}>
                                            <img src={prevRealImg} style={{ width: "100%", height: 250, objectFit: "scale-down" }} />
                                            <label htmlFor="fileSltRight" className={styles.label}>Select File</label>
                                            <input
                                                id="fileSltRight"
                                                type='file'
                                                name='idealrealRealImg'
                                                //ref={inputFiles2}
                                                onChange={handlerChangeFile}
                                                className={styles.input}
                                        
                                            />
                                            </div>
                                        </>
                                }

                                {
                                    idealrealIdealImg.length !== 0
                                        ?
                                        <>
                                            {idealrealIdealImg.map((image, id) => (
                                                <><div key={id} className={styles.imgWidth}>
                                                    <img src={image} style={{ width: "100%", height: 250, objectFit: "scale-down" }} />
                                                    <label htmlFor="fileSltLeft" className={styles.label}>Select File</label>
                                                    <input
                                                        id="fileSltLeft"
                                                        className={styles.input}
                                                        type='file'
                                                        name='idealrealIdealImg'
                                                        //ref={inputFiles1}
                                                        onChange={handlerChangeFile}
                                                    />
                                                </div></>
                                            ))}
                                        </>
                                        :
                                        <>
                                        <div className={styles.imgWidth}>
                                            
                                            <img src={prevIdealImg} style={{ width: "100%", height: 250, objectFit: "scale-down" }} />
                                            <label htmlFor="fileSltLeft" className={styles.label}>Select File</label>
                                            <input
                                                id="fileSltLeft"
                                                type='file'
                                                name='idealrealIdealImg'
                                                //ref={inputFiles1}
                                                onChange={handlerChangeFile}
                                                className={styles.input}
                                 
                                            />
                                            </div>
                                        </>
                                }

                            </div>
                        </div>
                        <div className={styles.lineBox}>
                            <div className={styles.line1}></div>
                            <div className={styles.editor}>
                                <CKEditor
                                    value={idealrealContent}
                                    editor={ClassicEditor}
                                    data={idealrealContent}
                                    onReady={editor => {
                                        // You can store the "editor" and use when it is needed.
                                        console.log('Editor is ready to use!', editor);
                                    }}

                                    onChange={(event, editor) => {
                                        const data = editor.getData();
                                        console.log({ event, editor, data });
                                        setContents(data);
                                    }}

                                />
                            </div>

                            <div className={styles.line2}></div>
                        </div>
                    </div>

                </div>
               
                <Button style={{ marginTop: "30px" }} sx={{ color: "white", background: "#5E8FCA", ":hover": { background: "#2d6ebd" } }} id="edit" value="수정안하기" onClick={handleSubmit}>수정할꼬야?</Button>

            </div>
        </Frame>
    )
}

export default IdealrealRetouch;