import { Button, TextField, Autocomplete } from "@mui/material";
import Frame from "../main/Frame";
import './Regist.css';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import GoogleLoginWindow from "../login/GoogleLoginWindow";
import { FcGoogle } from 'react-icons/fc';
import { useCallback, useState } from "react";
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import axios from "axios";
import Swal from "sweetalert2";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useTranslation } from 'react-i18next';

const Regist = () => {

    const { t } = useTranslation();

    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pw, setPw] = useState('');
    const [pwConfirm, setPwConfirm] = useState('');
    const [nickName, setNickName] = useState('');
    const [nationIdx, setNationIdx] = useState(0);

    //유효성 검사시 오류 메시지
    const [confirmMsg, setConfirmMsg] = useState({
        msgIdConfirm: '',
        msgEmailConfirm: '',
        msgPwConfirm: '',
        msgPwMatchConfirm: '',
        msgIdDuplicate: '',
        msgNicknameDuplicate: ''
    });

    //유효성 검사 상태체크
    const [isValid, setIsValid] = useState({
        // isId: false,
        isEmail: false,
        isNickname: false,
        isPassword: false,
        isPasswordConfirm: false,
        isRegistButton: false,
        // isIdDuplicate: false,
        // isNicknameDuplicate: false
    });




    //이메일 검증(중복검사 필요)
    const onChangeEmail = useCallback(e => {
        const emailRegex = /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
        const emailCurrent = e.target.value;
        setEmail(emailCurrent);
        // let tempIsValid = {...isValid};

        if (!emailRegex.test(emailCurrent)) {
            setConfirmMsg({ ...confirmMsg, msgEmailConfirm: '이메일 형식이 틀렸습니다. 다시 확인해주세요.' });
            // tempIsValid = {...tempIsValid, isEmail: false};
            setIsValid({ ...isValid, isEmail: false });
        } else {
            setConfirmMsg({ ...confirmMsg, msgEmailConfirm: ' ' });
            setIsValid({ ...isValid, isEmail: true });
            // tempIsValid = {...tempIsValid, isEmail: true};
        }

        // tempIsValid = {...tempIsValid, isEmail: e.target.value.trim() !== ''};
        // setIsValid(tempIsValid);

        setIsValid(prevState => ({
            ...prevState,
            [emailCurrent]: e.target.value.trim() !== '' // 입력 값이 비어있지 않으면 true, 비어있으면 false
        }));
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

    //이름 검증
    const onChangeName = useCallback(e => {
        // const nameRegex = /[가-힣]/;
        const nameRegex = /^(?=.*[a-zA-Z)(?=.*[가-힣])/;
        const nameCurrent = e.target.value;
        setName(nameCurrent);

        if (!nameRegex.test(nameCurrent)) {
            setConfirmMsg({ ...confirmMsg, msgNameConfirm: '이름을 정확히 입력해주세요.' });
            setIsValid({ ...isValid, isName: false });
        } else {
            setConfirmMsg({ ...confirmMsg, msgNameConfirm: ' ' });
            setIsValid({ ...isValid, isName: true });
        }

        setIsValid(prevState => ({
            ...prevState,
            [nameCurrent]: e.target.value.trim() !== '' // 입력 값이 비어있지 않으면 true, 비어있으면 false
        }));
    })

    //비밀번호 검증
    const onChangePw = useCallback(e => {
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
        const passwordCurrent = e.target.value;
        setPw(passwordCurrent);

        if (!passwordRegex.test(passwordCurrent)) {
            setConfirmMsg({ ...confirmMsg, msgPwConfirm: '숫자+영문자+특수문자 조합으로 8자리 이상 입력해주세요.' });
            setIsValid({ ...isValid, isPassword: false });
        } else {
            setConfirmMsg({ ...confirmMsg, msgPwConfirm: ' ' });
            setIsValid({ ...isValid, isPassword: true });
        }

        setIsValid(prevState => ({
            ...prevState,
            [passwordCurrent]: e.target.value.trim() !== '' // 입력 값이 비어있지 않으면 true, 비어있으면 false
        }));
    })

    //비밀번호 확인 검증
    const onChangePwConfirm = useCallback(e => {
        const passwordConfirmCurrent = e.target.value;
        setPwConfirm(passwordConfirmCurrent);

        if (pw === passwordConfirmCurrent) {
            setConfirmMsg({ ...confirmMsg, msgPwMatchConfirm: '비밀번호가 일치합니다.' });
            setIsValid({ ...isValid, isPasswordConfirm: true });
        } else {
            setConfirmMsg({ ...confirmMsg, msgPwMatchConfirm: '비밀번호가 일치하지 않아요. 다시 확인해주세요.' });
            setIsValid({ ...isValid, isPasswordConfirm: false });
        }

        setIsValid(prevState => ({
            ...prevState,
            [passwordConfirmCurrent]: e.target.value.trim() !== '' // 입력 값이 비어있지 않으면 true, 비어있으면 false
        }));
    })

    const handlerSubmit = (e) => {
        e.preventDefault();
        axios.post(`http://${process.env.REACT_APP_JKS_IP}:8080/api/regist`,
            {
                "userId": email,
                "userPw": pw,
                "userName": name,
                "userNickname": nickName,
                "countryIdx": nationIdx
            })
            .then((response) => {
                console.log(response);
                //회원가입 후 로그인 페이지로 리다이렉트
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: '성공적으로 가입되었습니다.',
                    showConfirmButton: false,
                    timer: 1500
                })
                navigate("/login");
            })
            .catch((error) => {
                console.log(error);
            });
        console.log("버튼누름");
    }

    const idDuplicateCheck = () => {
        axios.get(`http://${process.env.REACT_APP_JKS_IP}:8080/api/idduplicatecheck`,
            {
                params: { "userId": email }
            })
            .then((response) => {
                if (response.data == "중복아이디가 있습니다.") {
                    setConfirmMsg({ ...confirmMsg, msgIdDuplicate: '중복아이디가 있습니다.' });
                    isValid.isEmail = false;

                } else {
                    setConfirmMsg({ ...confirmMsg, msgIdDuplicate: '중복아이디가 없습니다.' });
                    isValid.isEmail = true;
                }
                console.log(response);
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

    const lastConfrimState = (isValid.isEmail && isValid.isNickname && isValid.isName && isValid.isPassword && isValid.isPasswordConfirm && nationIdx);


    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const [googleLoginModal, setGoogleLoginModal] = useState(false);

    const handlerOpenGoogle = () => {
        setGoogleLoginModal(true);
    }

    return (
        <Frame>
            <div id="regist-wrap">
                <h2 id="regist-title">{t('page:regist')}</h2>
                <div id="logo-box">
                    <Link to="/"><img src={process.env.PUBLIC_URL + '/KADA.png'} /></Link>
                </div>
                <div id="regist-input">
                    <form onSubmit={handlerSubmit}>

                        <TextField label={'Email'} variant="standard"
                            value={email} onChange={onChangeEmail} onBlur={idDuplicateCheck} />
                        {/* <CheckCircleOutlineIcon /><CheckCircleIcon /> */}
                        {/* <Button type="button" variant="contained" onClick={idDuplicateCheck}>ID중복확인</Button> */}
                        <div className={isValid.isEmail == true ? "green" : "red"}>
                            {confirmMsg.msgIdDuplicate}
                        </div>
                        <div className={isValid.isEmail == true ? "green" : "red"}>
                            {!isValid.isEmail && confirmMsg.msgEmailConfirm}
                        </div>
                        <TextField label={'NickName'} variant="standard"
                            value={nickName} onChange={onChangeNickname} onBlur={nicknameDuplicateCheck} />
                        {/* <CheckCircleOutlineIcon /><CheckCircleIcon /> */}
                        {/* <Button type="button" variant="contained" onClick={nicknameDuplicateCheck}>닉네임중복확인</Button> */}
                        <div className={isValid.isNickname == true ? "green" : "red"}>
                            {confirmMsg.msgNicknameDuplicate}
                        </div>
                        <div className={isValid.isNickname == true ? "green" : "red"}>
                            {!isValid.isNickname && confirmMsg.msgNicknameConfirm}
                        </div>

                        <TextField label={'Name'} variant="standard"
                            value={name} onChange={onChangeName} />
                        <div className={isValid.isName == true ? "green" : "red"}>
                            {!isValid.isName && confirmMsg.msgNameConfirm}
                        </div>

                        <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
                            <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                            <Input
                                id="standard-adornment-password"
                                type={showPassword ? 'text' : 'password'}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                value={pw} onChange={onChangePw}
                            />
                        </FormControl>
                        <div className={isValid.isPassword == true ? "green" : "red"}>
                            {!isValid.isPassword && confirmMsg.msgPwConfirm}
                        </div>

                        <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
                            <InputLabel htmlFor="standard-adornment-password">Password Confirm</InputLabel>
                            <Input
                                id="standard-adornment-password"
                                type={showPassword ? 'text' : 'password'}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                value={pwConfirm} onChange={onChangePwConfirm}
                            />
                        </FormControl>
                        <div className={isValid.isPasswordConfirm == true ? "green" : "red"}>
                            {confirmMsg.msgPwMatchConfirm}
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
                <div id="regist-login-sns">
                    <span>SNS 계정으로 로그인하기</span>
                    <div id="regist-google-logo">
                        <FcGoogle onClick={handlerOpenGoogle} />
                        {googleLoginModal &&
                            <GoogleLoginWindow googleLoginModal={googleLoginModal}
                                setGoogleLoginModal={setGoogleLoginModal} />}
                        {/* <BsApple />
                        <SiNaver />
                        <RiKakaoTalkFill /> */}
                    </div>
                </div>
            </div>
        </Frame>
    )
}

export default Regist;

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