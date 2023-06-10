import { Button, TextField } from "@mui/material";
import { FcGoogle } from 'react-icons/fc';
import Frame from "../main/Frame";
import './LoginPage.css';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useState } from "react";
import GoogleLoginWindow from "./GoogleLoginWindow";
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import axios from "axios";
import Swal from "sweetalert2";
import { useTranslation } from 'react-i18next';
// const googleAuthUrl = 'https://oauth2.googleapis.com';
// const googleLoginUrl = 'https://accounts.google.com';
// const googleRedirectUrl = 'http://localhost:8080/google/login/redirect';
// const GOOGLECLIENTID = '248755996027-vfjb4igodn9qj0mjn5us426g2e9ma1o5.apps.googleusercontent.com';
// const GOOGLEAUTHPW = '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';


const LoginPage = () => {

    const { t } = useTranslation();

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [pw, setPw] = useState('');

    const [googleLoginModal, setGoogleLoginModal] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };




    //구글 로그인
    const handlerOpenGoogle = () => {
        setGoogleLoginModal(true);
    }


    const handlerSubmit = (e) => {
        e.preventDefault();

        const params = {
            userId: email
        }

        //정지 기한 검증
        axios.get(`http://${process.env.REACT_APP_JKS_IP}:8080/api/user/suspension`, { params: params })
            .then((response) => {
                console.log(response.data)
                if (response.data > 0) {
                    alert("사용정지기한이 " + response.data + "일 남아있어 로그인이 불가합니다.")
                    return
                } else {
                    axios.post(`http://${process.env.REACT_APP_JKS_IP}:8080/login`,
                        {
                            "userId": email,
                            "userPw": pw,
                        })
                        .then((response) => {
                            console.log(response);
                            sessionStorage.setItem("token", response.data);
                            //회원가입 후 로그인 페이지로 리다이렉트
                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                title: '로그인 되었습니다.',
                                showConfirmButton: false,
                                timer: 1500
                            })
                            navigate("/");
                        })
                        .catch((error) => {
                            alert("이메일 또는 비밀번호를 확인해주세요.")
                            console.log(error);

                        });
                    console.log("버튼누름");
                }
            })
            .catch(error => {
                alert("이메일 또는 비밀번호를 확인해주세요.")
                console.log(error)
            })



    }



    return (
        <Frame>
            <div id="login-wrap">
                <h2 id="login-title">{t('page:login')}</h2>
                <div id="logo-box">
                    <Link to="/"><img src={process.env.PUBLIC_URL + '/KADA.png'} /></Link>
                </div>
                <form onSubmit={handlerSubmit}>
                    <div id="login-input" >
                        <TextField label={'Email(ID)'} variant="standard" value={email} onChange={(e) => setEmail(e.target.value)} />
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
                                value={pw} onChange={(e) => setPw(e.target.value)}
                            />
                        </FormControl>
                        <span id="login-btn">
                            <Button type='submit' variant="contained">LOGIN</Button>
                        </span>
                    </div>
                </form>
                <div>
                    <span>계정이 없으신가요?</span>
                </div>
                <div id="link-regist">
                    <Link to="/regist"> <span>회원가입하기</span></Link>
                </div>
                <div id="login-sns">
                    <span>SNS 계정으로 로그인하기</span>
                    <div id="login-google-logo">
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
export default LoginPage;