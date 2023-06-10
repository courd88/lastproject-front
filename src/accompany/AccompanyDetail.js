import Frame from "../main/Frame";
import Button from '@mui/material/Button';
import './AccompanyDetail.css';
import jwt_decode from 'jwt-decode';
import { useEffect, useState } from "react";
import ListIcon from '@mui/icons-material/List';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import MessageIcon from '@mui/icons-material/Message';
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Parser from "html-react-parser";
import styles from "./AccompanyDetail.module.css";

const AccompanyDetail = () => {

    const [userId, setUserId] = useState('');

    let nickName = null;
    let jwtToken = null;
    if (sessionStorage.getItem('token') != null) {
        jwtToken = sessionStorage.getItem('token');
        nickName = jwt_decode(jwtToken).nickname;
    }

    const header = {
        'Authorization': `Bearer ${jwtToken}`,
        'Content-Type': 'application/json'
    };

    const navigate = useNavigate();

    const { accompanyIdx } = useParams();

    const [imageUrl, setImageUrl] = useState('');
    const [filename, setFilename] = useState('');
    const [accompanyImage, setAccompanyImage] = useState([]);
    const [datas, setDatas] = useState({});

    useEffect(() => {
        if (sessionStorage.getItem('token') != null) {
            jwtToken = sessionStorage.getItem('token');
            setUserId(jwt_decode(jwtToken).sub);
        }

        axios.get(`http://localhost:8080/api/accompany/${accompanyIdx}`,)
            .then(response => {
                console.log(response.data)
                setFilename(response.data.accompanyImage);
                setDatas(response.data);
                // let str = response.data.accompanyContent;
                // console.log(typeof str);
            })
            .catch(error => {
                console.log(error);
            })

    }, []);

    // 이미지 가져오기
    useEffect(() => {
        if (filename) {
            const imageUrl = `http://${process.env.REACT_APP_JKS_IP}:8080/api/getimage/${filename}`;
            axios.get(imageUrl, { responseType: 'arraybuffer' })
                .then(response => {
                    const imageBlob = new Blob([response.data], { type: response.headers['content-type'] })
                    const imageUrl = URL.createObjectURL(imageBlob);
                    setImageUrl(imageUrl);
                    console.log(imageUrl);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }, [filename, accompanyImage]);

    const handlerToList = () => {
        navigate(`/accompany`);
    };

    const handlerUpdate = () => {
        navigate(`/accompany/update/${accompanyIdx}`);
    }

    const handlerDelete = () => {
        axios.delete(`http://localhost:8080/api/accompany/${accompanyIdx}`, {headers : header}
        )
            .then(response => {
                console.log(response);
                alert('정상적으로 삭제되었습니다.');
                navigate('/accompany');				// 정상적으로 삭제되면 목록으로 이동

            })
            .catch(error => {
                console.log(error);
                alert(`삭제에 실패했습니다. (${error.message})`);
                return;
            });
    };

    const handlerJoinChat = (accompanyIdx) => {

        if(userId == '') {
            alert('로그인 후 사용하실 수 있습니다.');
            return
        }


        let 채팅UUID = '';
        //chatController로직
        axios.get(`http://${process.env.REACT_APP_JKS_IP}:8080/chatroom/${accompanyIdx}`, { headers: header })
        .then((response) => {
            console.log(response.data);
            채팅UUID = response.data;
            let param = {
                userId : userId,
                chatroomId : 채팅UUID
            }
            axios.get(`http://${process.env.REACT_APP_JKS_IP}:8080/api/addchatuser`, 
            { params: param, headers: header})
            .then((response) => {
                console.log(response.data);
                alert('채팅방이 채팅목록에 추가되었습니다.');
            })
            .catch((error) => {
                console.log(error);
            })
        })
        .catch((error) => {
            console.log(error);
        })

    }

    return (
        <Frame>
            <div id="accompany-main-detail-img">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Bukchon_Hanok_Village_%EB%B6%81%EC%B4%8C_%ED%95%9C%EC%98%A5%EB%A7%88%EC%9D%84_October_1_2020_15.jpg/1280px-Bukchon_Hanok_Village_%EB%B6%81%EC%B4%8C_%ED%95%9C%EC%98%A5%EB%A7%88%EC%9D%84_October_1_2020_15.jpg" />
            </div>
            <div id="accompany-detail-wrap">
                <div id="accompany-detail-img">
                    <img src={imageUrl} />
                </div>
                <div id="accompany-detail-duration-box">
                    <div id="accompany-detail-duration">
                        여행기간 : {datas.accompanyStartTime} ~ {datas.accompanyEndTime}
                    </div>
                    <span id="accompany-detail-number">
                        희망인원: {datas.accompanyNumbers}
                    </span>
                </div>
                <div id="accompany-detail-title">
                    {datas.accompanyTitle}
                </div>

                <div id="accompany-detail-date-cnt">
                    <span>
                        작성시간: {datas.accompanyCreatedTime}
                    </span>
                    <span>
                        조회수: {datas.accompanyCnt}
                    </span>
                </div>

                <div id="accompany-detail-content">
                    <div className={styles.editor}>
                        {datas.accompanyContent == null ? "" : Parser(datas.accompanyContent)}
                    </div>
                </div>
                <div id="accomapny-detail-btn">
                    <Button  sx={{  color: "white", background:"#5E8FCA", ":hover": { background: "#2d6ebd"}}}variant="contained" onClick={handlerToList}><ListIcon /><span>목록보기</span></Button>
                    {!(datas.userId == userId) ?
                        <Button  sx={{  color: "white", background:"#5E8FCA", ":hover": { background: "#2d6ebd"}}}variant="contained" onClick={()=> handlerJoinChat(datas.accompanyIdx) } ><MessageIcon /><span>채팅연결</span></Button>
                        :
                        <>
                            <Button  sx={{  color: "white", background:"#5E8FCA", ":hover": { background: "#2d6ebd"}}}variant="contained" onClick={handlerUpdate}><EditIcon /><span>수정하기</span></Button>
                            <Button sx={{  color: "white", background:"#5E8FCA", ":hover": { background: "#2d6ebd"}}} onClick={handlerDelete} variant="contained"><DeleteForeverIcon /><span>삭제하기</span></Button>
                        </>
                    }
                </div>
            </div>
        </Frame>
    )
}
export default AccompanyDetail;