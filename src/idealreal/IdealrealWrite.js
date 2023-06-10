import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from "./IdealrealWrite.module.css";
import Frame from '../main/Frame';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Button } from "@mui/joy";
import jwt_decode from 'jwt-decode';


function IdealrealWrite() {

  const navigate = useNavigate();

  //[로그인 유저 정보 토큰에서 가져오기]
  let nickName = null;
  let userId = null;
  let jwtToken = null;
  if (sessionStorage.getItem('token') != null) {
    jwtToken = sessionStorage.getItem('token');
    userId = jwt_decode(jwtToken).sub;
    nickName = jwt_decode(jwtToken).nickname;
  }

  // const header = {
  //   'Authorization': `Bearer ${jwtToken}`,
  //   'Content-Type': 'application/json'
  // };

  const [name, setName] = useState('');                                     //제목
  const [contents, setContents] = useState('')                              //내용
  const [idealrealIdealImg, setIdealrealIdealImg] = useState([])            //이상사진
  const [idealrealRealImg, setIdealrealRealImg] = useState([])              //현실사진
  const [imageFiles, setImageFiles] = useState([])                          //업로드이미지파일

  //[컴포넌트 마운트시 로그인 여부 체크]
  useEffect(()=>{
    if(userId == null){
        alert('로그인 후 사용하실 수 있습니다.');
        navigate('/idealreal');
    }
},[])


  //{핸들러} 제목변경
  const handleChangeName = (e) => {
    setName(e.target.value);
  };

  // FORM DATA를 저장할 상태 변수를 변수 이름: 값 형식으로 설정
  let datas = {
    userId: userId,
    idealrealTitle: name,
    idealrealContent: contents
  };

  // 서버로 전달할 폼 데이터를 작성
  const formData = new FormData();
  formData.append(
    'data',
    new Blob([JSON.stringify(datas)], { type: 'application/json' })
  );

  //객체로 파일 이름을 담음.
  Object.values(imageFiles).forEach(
    file => Object.values(file.files).forEach(
      f => formData.append(file.name, f)));

  // multipart/form-data 형식으로 서버로 전달
  const handleSubmit = (e) => {
    e.preventDefault();

    axios({
      method: 'POST',
      url: `http://${process.env.REACT_APP_KTG_IP}:8080/api/idealreal`,
      headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${jwtToken}` },
      data: formData
    })
      .then(response => {
        console.log(response)
        alert(response.data)
        navigate('/idealreal')
      })
      .catch(error => {
        console.log(error)
        alert(error.message)
      })
  };

  const handlerChangeFile = (e) => {
    const name = e.target.name;
    const files = e.target.files;

    //input 박스의 이름이 idealrealIdealImg라면
    if (e.target.name == 'idealrealIdealImg') {

      const imageArr = e.target.files;
      let imageURLs = [];
      let image;
      //이미지 개수가 6보다 크면 6 아니면 이미지 개수.
      let imagesLength = imageArr.length > 6 ? 6 : imageArr.length;

      //이미지 개수만큼 반복
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

    //input 박스의 이름이 idealrealIdealImg라면
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

    //바뀌지 않은 파일들은 필터로 걸러서 복붙해줌.
    const unchangedImageFiles = imageFiles.filter(file => file.name !== name)
    //이미지 파일 이름, 파일명 재설정
    setImageFiles([...unchangedImageFiles, { name, files }]);
  };

  return (
    <Frame>
      <div className={styles.contentsWrap}>
        <h2 className={styles.qnaTitle}>이상과 현실</h2>
        <h3 className={styles.subTitle}>제목</h3>
        <input placeholder="제목을 적어주세요" id="name" name="name" value={name} onChange={handleChangeName} style={{ border: "none", borderBottom: "1px solid #5E8FCA", borderRadius: 0, width: "59%" }} />
        <div className={styles.imgBox1} >
          {
            idealrealIdealImg.length !== 0
              ?
              <>
                {idealrealIdealImg.map((image, id) => (
                  <>
                    <div key={id} className={styles.imgWidth}>
                      <img src={image} style={{ width: "100%", height: 300, objectFit: "scale-down" }} />
                      <label htmlFor="fileSltLeft" className={styles.label}>Select File</label>
                      <input
                        id="fileSltLeft"
                        className={styles.input}
                        type='file'
                        name='idealrealIdealImg'
                        onChange={handlerChangeFile}
                      />
                    </div>
                  </>
                ))}
              </>
              :
              <>
                <label htmlFor="fileSltLeft" className={styles.imgSelect} >Select File</label>
                <input
                  id="fileSltLeft"
                  type='file'
                  name='idealrealIdealImg'
                  onChange={handlerChangeFile}
                  className={styles.input}
                />

              </>
          }

          {
            idealrealRealImg.length !== 0
              ?
              <>
                {idealrealRealImg.map((image, id) => (
                  <><div key={id} className={styles.imgWidth}>
                    <img src={image} style={{ width: "100%", height: 300, objectFit: "scale-down" }} />
                    <label htmlFor="fileSltRight" className={styles.label}>Select File</label>
                    <input
                      id="fileSltRight"
                      type='file'
                      name='idealrealRealImg'
                      onChange={handlerChangeFile}
                      className={styles.input}
                    /></div></>
                ))}
              </>
              :
              <>
                <label htmlFor="fileSltRight" className={`${styles.imgSelect}`} >Select File</label>
                <input
                  id="fileSltRight"
                  type='file'
                  name='idealrealRealImg'
                  onChange={handlerChangeFile}
                  className={styles.input}
                />
              </>
          }

        </div>
        <h3 className={styles.subTitle}>내용</h3>
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
              setContents(data);
            }}
          />
        </div>
        <Button sx={{ color: "white", background: "#5E8FCA", ":hover": { background: "#2d6ebd" } }} onClick={handleSubmit} type="submit">작성 완료</Button>
      </div>
    </Frame>
  );
}

export default IdealrealWrite;