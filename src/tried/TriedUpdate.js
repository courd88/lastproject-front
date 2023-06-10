import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Frame from "../main/Frame";
import jwt_decode from 'jwt-decode';
import Imgfunc from "../imgfunc/Imgfunc";
import { Button } from "@mui/joy";
import Input from '@mui/material/Input';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "./CkHeight.css";
import styles from "./TriedUpdate.module.css";

const ariaLabel = { 'aria-label': 'description' };


const TriedUpdate = () => {

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

    const imgfunc = new Imgfunc();
    const navigate = useNavigate();
    const location = useLocation();

    //필요없음
    const { imgUrl } = location.state;

    const { triedIdx } = useParams();


    const [userId, setUserId] = useState('');
    const [tried, setTried] = useState({});
    const [triedTitle, setTriedTitle] = useState('');
    const [triedContent, setTriedContent] = useState('');
    const [triedCreatedTime, setTriedCreatedTime] = useState('');
    const [imageFiles, setImageFiles] = useState([]);
    const [filename, setFilename] = useState('');
    const [uploadImg, setUploadImg] = useState([]); //1 
    const [imageUrl, setImageUrl] = useState('');


    //
    useEffect(() => {
        axios.get(
            `http://${process.env.REACT_APP_CMJ_IP}:8080/api/tried/detail/${triedIdx}`, { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } })
            .then(response => {
                console.log(response.data);
                setTried(response.data);
                setUserId(response.data.userId);
                setTriedTitle(response.data.triedTitle);
                setTriedContent(response.data.triedContent);
                setTriedCreatedTime(response.data.triedCreatedTime);
                setFilename(response.data.triedImg);
            })
            .catch(error =>
                console.log(error));
    }, [triedIdx]);

    // 제목 수정
    const handlerTitleChange = (e) => {
        setTriedTitle(e.target.value);
    };

    // 내용 수정
    const handlerContentChange = (e) => {
        setTriedContent(e.target.value);
    };

    // 리스트 페이지로 이동
    const handlerClickList = () => {
        console.log(navigate);
        navigate('/tried');
    };

    // 이미지 가져오기
    // useEffect(() => {
    //     if (triedImg) {
    //       const imageUrl = `http://${process.env.REACT_APP_CMJ_IP}:8080/api/getimage/${triedImg}`;
    //       axios.get(imageUrl, { responseType: 'arraybuffer' })
    //         .then(response => {
    //           const imageBlob = new Blob([response.data], { type: response.headers['content-type'] });
    //           const imageUrl = URL.createObjectURL(imageBlob);
    //           setImageUrl(imageUrl);
    //         })
    //         .catch(error => {
    //           console.log(error);
    //         });
    //     }
    //   }, [triedImg]);

    // 이미지 수정 
    // const handleFileChange = (e) => {
    //     const files = e.target.files;
    //     setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    // };

    const handleFileChange = (e) => {
        const name = e.target.name;
        const files = e.target.files;
    
        //input 박스의 이름이 idealrealIdealImg라면
        //-----------------------------------
        if (e.target.name == 'updateImg') {
    
          const imageArr = e.target.files;
          let imageURLs = [];
          let image;
          //이미지 개수가 6보다 크면 6 아니면 이미지 개수.
          let imagesLength = imageArr.length > 6 ? 6 : imageArr.length;
    
          //이미지 개수만큼 반복
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
        //-------------------------------------
    
        //바뀌지 않은 파일들은 필터로 걸러서 복붙해줌.
        const unchangedImageFiles = imageFiles.filter(file => file.name !== name)
        //이미지 파일 이름, 파일명 재설정
        setImageFiles([...unchangedImageFiles, { name, files }]);
    };

    // formData를 저장할 상태 변수 설정 => 변수 이름 : 값
    let datas = {
        userId:  loginUserId,
        triedTitle: triedTitle,
        triedContent: triedContent,
    };

    // 서버로 전달할 폼 데이터를 작성
    let formData = new FormData();

    formData = imgfunc.formDataAppend(formData, datas);

    formData = imgfunc.formdataAddFileName(imageFiles,formData);

    // Multipart/formData 형식으로 서버로 전달
    const handlerSubmit = (e) => {
        e.preventDefault();
        if (window.confirm("글을 작성하시겠습니까?")) {

            axios.put(`http://${process.env.REACT_APP_CMJ_IP}:8080/api/tried/${triedIdx}`, formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                    }
                })
                .then(response => {
                    console.log(response)
                    alert('수정 완료')
                    navigate(`/tried/detail/${triedIdx}`)
                })
                .catch(error => {
                    console.log(error)
                    alert(error.message)
                })
        };
    };

    console.log(uploadImg);


    return (
        <Frame>
            <div id="travelcourse-list-img">
                <img src="https://a.cdn-hotels.com/gdcs/production140/d1583/119ec73c-cbf4-431e-b128-eadb32999939.jpg" />
            </div>
            <div className={styles.triedDetail_container}>
                <form onSubmit={handlerSubmit} action="" method="POST" id="frm" name="frm" className={styles.frm}>
                    {/* <h2>게시판 수정</h2>
                    <div value={triedIdx}>글번호: {tried.triedIdx}</div>
                    <div value={userId}>작성자: {tried.userId}</div>
                    <div value={triedCreatedTime}>작성일: {tried.triedCreatedTime}</div> */}
                    {/* <div>
                        <div> 제목 </div>
                        <input type="text" name="triedTitle" value={triedTitle || ''}
                            onChange={handlerTitleChange} />
                    </div> */}
                    <div className={styles.tried_title_write}>
                        <div>TITLE</div>
                        <Input placeholder="Placeholder" name="triedTitle"  inputProps={ariaLabel} value={triedTitle || ''} onChange={handlerTitleChange} />
                    </div>
                    {/* <div className={styles.update_img}>
                        {uploadImg.length == 0 && <img src={`http://${process.env.REACT_APP_CMJ_IP}:8080/api/getimage/${filename}`} style={{ width: '500px' }} />}
                    </div> */}
                    {/* <div className="update-img">
                        {uploadImg.map((file, index) => (
                            <img key={index}
                                src={file}
                                style={{ width: '500px' }} />
                        ))}
                        <input type="file" name="updateImg" multiple onChange={handleFileChange} />
                    </div> */}
                    <div className={styles.tried_img}>
                    {
                        <>
                            <div className={styles.imgWidth}>
                                {uploadImg.length == 0 && <img src={`http://${process.env.REACT_APP_CMJ_IP}:8080/api/getimage/${filename}`} className={styles.imgHi} />
                                }
                                <label htmlFor="fileSlt" className={styles.label}>Select Fddile</label>
                                <input
                                    id="fileSlt"
                                    className={styles.input}
                                    type='file'
                                    name='uploadImg'
                                    onChange={handleFileChange}
                                />
                            </div>
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
                    <div className={styles.tried_content_write}>
                        <div>CONTENTS</div>
                        {/* <input type="btn" name="triedContent" value={triedContent || ''}
                            onChange={handlerContentChange} /> */}
                        <div className={styles.editor}>
                            <CKEditor
                                editor={ClassicEditor}
                                data={triedContent || ''}
                                onReady={editor => {
                                }}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    // console.log({ event, editor, data });
                                    setTriedContent(data);
                                }}

                            />
                        </div>
                    </div>
                    <div className={styles.tried_write_btn}>
                        <Button ariant="contained" type="button" id="list" className={styles.btn} value="목록"
                            onClick={handlerClickList}>List</Button>
                        <Button ariant="contained" type="submit" id="update" className={styles.btn} value="수정" >Modify</Button>
                    </div>
                    {/* <input type="button" id="list" className="btn" value="목록"
                        onClick={handlerClickList} />
                    <input type="submit" id="update" className="btn" value="수정" /> */}
                </form>
            </div>
        </Frame>
    );
};

export default TriedUpdate;