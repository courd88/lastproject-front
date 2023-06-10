import { useState } from "react";
import Modal from "../modal/Modal";
import styles from "./ProfileModifier.module.css";
import axios from "axios";
import { Button } from "@mui/joy";
import Imgfunc from "../imgfunc/Imgfunc";
import Swal from "sweetalert2";


const ProfileModifier = (props) => {

  const modal = props.modal1;
  const setModal = props.setModal1;
  const userId = props.userId;
  const header = props.header;
  const jwtToken = props.jwtToken;
  const userImg = props.userImg;

  const imgfunc = new Imgfunc();

  const [imageFiles, setImageFiles] = useState([]);
  const [uploadImg, setUploadImg] = useState([]);

  // FORM DATA를 저장할 상태 변수를 변수 이름: 값 형식으로 설정
  let datas = {
    userId: userId
  };

  // 서버로 전달할 폼 데이터를 작성
  let formData = new FormData();

  //폼데이터에 데이터 넣는 함수
  formData = imgfunc.formDataAppend(formData, datas);

  // formData.append(
  //   'data',
  //   new Blob([JSON.stringify(datas)], { type: 'application/json' })
  // );

  //객체로 파일 이름을 담음.
  formData = imgfunc.formdataAddFileName(imageFiles,formData);
  //폼데이터에 파일 이름 넣는 함수

  // Object.values(imageFiles).forEach(
  //   file => Object.values(file.files).forEach(
  //     f => formData.append(file.name, f)));


  // multipart/form-data 형식으로 서버로 전달
  const handleSubmit = (e) => {
    e.preventDefault();

    axios({
      method: 'PUT',
      url: `http://${process.env.REACT_APP_JKS_IP}:8080/api/mypage/profileimg`,
      headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${jwtToken}` },
      data: formData
    })
      .then(response => {
        console.log(response)
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: '성공적으로 변경되었습니다.',
          showConfirmButton: false,
          timer: 1500
      })
        window.location.reload(); //새로고침
        
      })
      .catch(error => {
        console.log(error)
        alert("파일용량이 너무 큽니다. 1MB이하 가능")
      })
  };

  const handlerChangeFile = (e) => {
    const name = e.target.name;
    const files = e.target.files;

    //input 박스의 이름이 idealrealIdealImg라면
    //-----------------------------------
    if (e.target.name == 'prfImg') {

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


  return (
    <Modal modal={modal} setModal={setModal}>
      <p className={styles.head}>프로필 이미지 변경</p>

      {uploadImg.length !== 0
        ?
        <div className={styles.imgWrap}>
          {uploadImg.map((img, id) => (
            <>
              <div key={id} className={styles.imgWidth}>
                <img src={img} style={{ width: "50%", height: 175, objectFit: "cover", borderRadius: "100%", marginBottom: 40 }} />
                <label htmlFor="fileSlt" className={styles.label}>Select File</label>
                <input
                  id="fileSlt"
                  type='file'
                  name='prfImg'
                  onChange={handlerChangeFile}
                  className={styles.input}
                />
                <div id={styles.warnMsg}>파일크기 제한 : 1MB 이하</div>
              </div>
            </>
          ))}
        </div>
        :
        <div className={styles.tempImgWrap}>
          {userImg != null ? <img src={userImg} style={{ width: "50%", height: 175, objectFit: "cover", borderRadius: "100%", marginBottom: 40 }} /> : <div className={styles.tempImg}></div>}
          <label htmlFor="fileSlt" className={styles.label}>Select File</label>
          <input
            id="fileSlt"
            className={styles.input}
            type='file'
            name='prfImg'
            onChange={handlerChangeFile}
          />
          <div id={styles.warnMsg}>파일크기 제한 : 1MB 이하</div>
        </div>
      }
      <Button sx={{ color: "white", background: "#5E8FCA", ":hover": { background: "#2d6ebd" } }} onClick={handleSubmit} type="submit">변경</Button>
    </Modal>
  )
}

export default ProfileModifier;