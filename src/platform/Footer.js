import axios from "axios";
import jwtDecode from "jwt-decode";
import { useState } from "react";
import styles from './Footer.module.css';


const Footer = () => {

    const [tempText, setTempText] = useState('');
    const [translateText, setTranslateText] = useState('');

    //[번역핸들러]
    const handlerTranslate = () => {
        const token = sessionStorage.getItem('token');

        axios.get(`http://${process.env.REACT_APP_JKS_IP}:8080/translate/${tempText}`,
            {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then((response) => {
                console.log(response);
                setTranslateText(response.data);
            })
            .catch((error) => {
                console.log(error);
            })
    };

    return (
        <>
            <div>
                <div className={styles.footer}>
                    <ul className={styles.footerContainer}>
                        <li>개인정보처리방침</li>
                        <li>찾아오시는길</li>
                        <li>사이트맵</li>
                    </ul>
                    <div>서울 종로구 인사동길 12 대일빌딩 7층, 15층 Tel 02-723-0008</div>
                    <div>COPYRIGHT@ 프로젝트.ALL RIGHTS RESERVED</div>
                </div>
                {
                    translateText != null ?
                        <p>{translateText}</p>
                        :
                        ""
                }
            </div>
        </>
    )
}

export default Footer;