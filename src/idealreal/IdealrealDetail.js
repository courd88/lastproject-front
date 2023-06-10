import { useState, useEffect } from "react";
import axios from "axios";
import Thumb from "./Thumb";
import { useNavigate, useParams } from "react-router-dom";
import Frame from "../main/Frame";
import styles from "./IdealrealDetail.module.css";
import Parser from "html-react-parser";
import Button from '@mui/joy/Button';
import jwt_decode from 'jwt-decode';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';

function IdealrealDetail() {

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


    const [data, setData] = useState([]);
    const [idealrealTitle, setIdealrealTitle] = useState('');
    const [idealrealContent, setIdealrealContent] = useState('');
    const [userId, setUserId] = useState('');
    const [userNickname, setUserNickname] = useState('');
    const [idealrealCreatedTime, setIdealrealCreatedTime] = useState('');
    const [idealrealCnt, setIdealrealCnt] = useState('');
    const [idealrealIdealImg, setIdealrealIdealImg] = useState([]);
    const [idealrealRealImg, setIdealrealRealImg] = useState([]);
    const [idealrealRcmd, setIdealrealRcmd] = useState('');

    const handlerChangeTitle = e => setIdealrealTitle(e.target.value)
    const handlerChangeContent = e => setIdealrealContent(e.target.value)

    const { idealrealIdx } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        // if (!sessionStorage.getItem('token')) {
        //     alert("로그인 했어?")
        //     history.push("/login")
        //     return
        // }

        axios.get(`http://${process.env.REACT_APP_KTG_IP}:8080/api/listidealreal/detail/${idealrealIdx}`
            , 
        )
            .then(response => {
                console.log(response);
                setIdealrealTitle(response.data.idealrealTitle);
                setIdealrealContent(response.data.idealrealContent);
                setUserId(response.data.userId);
                setUserNickname(response.data.userNickname);
                setIdealrealCreatedTime(response.data.idealrealCreatedTime);
                setIdealrealCnt(response.data.idealrealCnt);
                setIdealrealIdealImg(response.data.idealrealIdealImg);
                setIdealrealRealImg(response.data.idealrealRealImg);
                setIdealrealRcmd(response.data.idealrealRcmd);
            })
            .catch(error => console.log(error));
    }, []);

    //목록 수정 삭제 버튼 클릭시 이동
    const hanlderClickList = () => navigate('/idealreal')


    const handlerClickRetouch = () => navigate(`/idealrealretouch/${idealrealIdx}`, { state: { idealImg: idealImg, realImg: realImg } })


    const handlerClickDelete = () => {
        axios.delete(`http://${process.env.REACT_APP_KTG_IP}:8080/api/listidealreal/${idealrealIdx}`,
            { headers: header }
        )
            .then(response => {
                console.log(response)
                alert('삭제되었습니다.')
                navigate('/idealreal');
            })
            .catch(error => {
                console.log(error)
                return
            })
    };

     //{핸들러} 트위터 공유하기
     const handlerShareTwitter = () => {
        let sendText = "KADA " + idealrealTitle;
        let sendURL = `http://localhost:3000/idealreal/detail/${idealrealIdx}`;

        window.open("https://twitter.com/intent/tweet?text=" + sendText + "&url=" + sendURL);
    }

    //{핸들러} 페이스북 공유하기
    const handlerShareFacebook = () => {
        let sendURL = `http://abcd.com/idealreal/detail/${idealrealIdx}`;

        window.open("http://www.facebook.com/sharer/sharer.php?u=" + sendURL);
    }


    // 이미지를 가져오는 주소를 설정
    const idealImg = `http://${process.env.REACT_APP_KTG_IP}:8080/api/getimage/${idealrealIdealImg}`;
    const realImg = `http://${process.env.REACT_APP_KTG_IP}:8080/api/getimage/${idealrealRealImg}`;


    return (
        <Frame>
            <div className={styles.containerWrap}>
                <h2 className={styles.realTitle}>이상과 현실</h2>
                <div className={styles.content}>
                    <h3 className={styles.subTitle}>{idealrealTitle}</h3>
                    <span className={styles.userId}>{userNickname}</span>
                    <div className={styles.timeCnt}>
                        <span className={styles.time}>{idealrealCreatedTime}</span>
                        <span>조회수 {idealrealCnt}</span>
                    </div>
                    <div className={styles.contentBox}>
                        <div className={styles.imgBox}>
                            <img src={realImg} className={styles.img} />
                            <img src={idealImg} className={styles.img} />
                        </div>
                        <div className={styles.lineBox}>
                            <div className={styles.line1}></div>
                            <div className={styles.editor}>
                                {idealrealContent == null ? "" : Parser(idealrealContent)}
                            </div>
                            <div className={styles.line2}></div>
                        </div>
                        
                    </div>
                    <div style={{ margin: "20px 0" }}><Thumb idealrealIdx={idealrealIdx} /></div>
                    <div>공유하기</div>
                        <div className="triedDetail-shareIcon">
                            <div className="triedDetail-shareIcon-twitter" onClick={handlerShareTwitter}>
                                <TwitterIcon />
                            </div>
                            <div className="triedDetail-shareIcon-facebook" onClick={handlerShareFacebook}>
                                <FacebookIcon />
                            </div>
                        </div>
                </div>
                <div className={styles.buttonWrap}>
                    { loginUserId == userId ?<Button sx={{ color: "white", background: "#5E8FCA", ":hover": { background: "#2d6ebd" } }} id="edit" value="수정하기" onClick={handlerClickRetouch}>수정하기</Button>:""}
                    <Button sx={{ color: "white", background: "#5E8FCA", ":hover": { background: "#2d6ebd" } }} style={{ marginLeft: "20px", marginRight: "20px" }} id="list" value="목록으로" onClick={hanlderClickList}>목록보기</Button>
                    { loginUserId == userId ? <Button sx={{ color: "white", background: "#5E8FCA", ":hover": { background: "#2d6ebd" } }} id="delete" value="삭제하기" onClick={handlerClickDelete} >삭제하기</Button>:""}
                </div>

            </div>
        </Frame>
    );
}

export default IdealrealDetail;