import { Button, TextField, Autocomplete } from "@mui/material";
import Frame from "../main/Frame";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";
import axios from "axios";
import styles from './RegistGoogle.module.css';

const RegistGoogle = () => {

  const navigate = useNavigate();
  const { state } = useLocation();
  const { email, name } = state;
  const tempPwKey = 'TemporaryKey';

  const [nickName, setNickName] = useState('');
  const [nationIdx, setNationIdx] = useState(0);

  //유효성 검사시 오류 메시지
  const [confirmMsg, setConfirmMsg] = useState({
    msgNicknameDuplicate: ''
  });

  //유효성 검사 상태체크
  const [isValid, setIsValid] = useState({
    isRegistButton: false,
    isNickname: false
  });

  //닉네임 검증(중복검사 필요)
  const onChangeNickname = useCallback(e => {
    const userNicknameRegex = /^[A-Za-z0-9+]{5,}$/;
    const nicknameCurrent = e.target.value;
    setNickName(nicknameCurrent);

    // let tempIsValid = {...isValid};

    if (!userNicknameRegex.test(nicknameCurrent)) {
      setConfirmMsg({ ...confirmMsg, msgNicknameConfirm: '숫자와 영문을 포함한 5글자 이상의 문자를 입력해주세요.(특수문자 제외)' });
      setIsValid({ ...isValid, isNickname: false });
      // tempIsValid = {...tempIsValid, isNickname: false};
    } else {
      setConfirmMsg({ ...confirmMsg, msgNicknameConfirm: ' ' });
      setIsValid({ ...isValid, isNickname: true });
      // tempIsValid = {...tempIsValid, isNickname: true};
    }

    // tempIsValid = {...tempIsValid, isNickname: e.target.value.trim() !== ''};
    // setIsValid(tempIsValid);
    setIsValid(prevState => ({
      ...prevState,
      [nicknameCurrent]: e.target.value.trim() !== '' // 입력 값이 비어있지 않으면 true, 비어있으면 false
    }));
  })

  //[국가 핸들러]
  // const handlerChangeNation = (newValue) => {
  //   const selectNation = nationsObj.filter(obj =>
  //     obj.nation == newValue
  //   )
  //   console.log(selectNation);
  //   setNationIdx(selectNation.nationIdx);
  //   console.log(nationIdx);
  // }

  //[제출 핸들러]
  const handlerSubmit = (e) => {
    e.preventDefault();
    axios.post(`http://${process.env.REACT_APP_JKS_IP}:8080/api/regist`,
      {
        "userId": email,
        "userPw": tempPwKey,
        "userName": name,
        "userNickname": nickName,
        "countryIdx": nationIdx
      })
      .then((response) => {
        console.log(response);
        //회원가입 후 로그인 페이지로 리다이렉트
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
      });
    console.log("버튼누름");
  }

  const nicknameDuplicateCheck = () => {
    axios.get(`http://${process.env.REACT_APP_JKS_IP}:8080/api/nicknameduplicatecheck`,
      {
        params: { "userNickname": nickName }
      })
      .then((response) => {
        if (response.data == "중복닉네임이 있습니다.") {
          setConfirmMsg({ ...confirmMsg, msgNicknameDuplicate: '중복닉네임이 있습니다.' });
          isValid.isNickname = false;
        } else {
          setConfirmMsg({ ...confirmMsg, msgNicknameDuplicate: '중복닉네임이 없습니다.' });
          isValid.isNickname = true;
        }
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
    console.log("버튼누름");
  }

  const lastConfrimState = (isValid.isNickname && nationIdx);


  return (
    <Frame>
      <div className={styles.regist_wrap}>
        <h2 className={styles.regist_title}>회원가입</h2>
        <div id="logo-box">
          <Link to="/"><img src={process.env.PUBLIC_URL + '/KADA.png'} /></Link>
        </div>
        <div className={styles.regist_input}>
          <h2 className={styles.plusInfo}>추가 정보 입력</h2>
          <form onSubmit={(e) => handlerSubmit(e)}>
            <TextField label={'NickName'} variant="standard"
              value={nickName} onChange={onChangeNickname} onBlur={nicknameDuplicateCheck} />
            <div className={isValid.isNickname == true ? `${styles.green}` : `${styles.red}`}>
              {confirmMsg.msgNicknameDuplicate}
            </div>
            <div className={isValid.isNickname == true ? `${styles.green}` : `${styles.red}`}>
              {!isValid.isNickname && confirmMsg.msgNicknameConfirm}
            </div>
            <Autocomplete
              disablePortal
              options={nations}

              sx={{ width: 380 }}
              onChange={(e, newValue) => setNationIdx(newValue.id)}
              renderInput={(params) => <TextField {...params} label='Country'
              />} />
            <span id="regist-btn">
              {lastConfrimState ? <Button type="submit" variant="contained">REGIST</Button> : <Button type="submit" variant="contained" disabled>REGIST</Button>}
            </span>
          </form>
        </div>
      </div>

    </Frame>
  )
}

export default RegistGoogle;

const nations = [
  { label: 'Korea', id: 1 },
  { label: 'USA', id: 2 },
  { label: 'Japan', id: 3 },
  { label: 'China', id: 4 },
  { label: 'Canada', id: 5 },
  { label: 'UK', id: 6 },
  { label: 'Danmark', id: 7 },
  { label: 'Iceland', id: 8 },
  { label: 'Norway', id: 9 },
  { label: 'Turkiye', id: 10 },
  { label: 'Spain', id: 11 },
  { label: 'Portugal', id: 12 },
  { label: 'France', id: 13 },
  { label: 'Ireland', id: 14 },
  { label: 'Belgium', id: 15 },
  { label: 'Germany', id: 16 },
  { label: 'Greece', id: 17 },
  { label: 'Sweden', id: 18 },
  { label: 'Swiss', id: 19 },
  { label: 'Austria', id: 20 },
  { label: 'Netherlands', id: 21 },
  { label: 'Luxembourg', id: 22 },
  { label: 'Italy', id: 23 },
  { label: 'Finland', id: 24 },
  { label: 'Australia', id: 25 },
  { label: 'New Zealand', id: 26 },
  { label: 'Mexico', id: 27 },
  { label: 'Czech Republic', id: 28 },
  { label: 'Hungary', id: 29 },
  { label: 'Poland', id: 30 },
  { label: 'Slovakia', id: 31 },
  { label: 'Chile', id: 32 },
  { label: 'Slovenian', id: 33 },
  { label: 'Israel', id: 34 },
  { label: 'Estonia', id: 35 },
  { label: 'Latvia', id: 36 },
  { label: 'Lithuania', id: 37 },
  { label: 'Columbia', id: 38 },
  { label: 'Costa Rica', id: 39 }

]