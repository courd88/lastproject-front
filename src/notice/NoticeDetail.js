import axios from "axios"
import Frame from "../main/Frame"
import Button from '@mui/joy/Button';
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import styles from "./NoticeDetail.module.css";
import Parse from 'html-react-parser';
import jwt_decode from 'jwt-decode';

const NoticeDetail = () => {

    let nickName = null;
    let userId = null;
    let jwtToken = null;
    if (sessionStorage.getItem('token') != null) {
        jwtToken = sessionStorage.getItem('token');
        userId = jwt_decode(jwtToken).sub;
        nickName = jwt_decode(jwtToken).nickname;
    }

    const navigate = useNavigate();

    const { noticeIdx } = useParams();

    const [notice, setNotice] = useState({});

    useEffect(() => {
        axios.get(`http://${process.env.REACT_APP_JYS_IP}:8080/api/notice/${noticeIdx}`)
            .then(response => {
                console.log(response.data)
                setNotice(response.data);
                let str = response.data.noticeContent;
                console.log(typeof str);
            })
            .catch(error => {
                console.log(error);
            })
    }, [])

    const handlerClickList = () => navigate('/noticeList');

    const handlerClickDelete = () => {
        axios.delete(`http://${process.env.REACT_APP_JYS_IP}:8080/api/notice/${noticeIdx}`
            // ,{ headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } }
        )
            .then(response => {
                alert('정상적으로 삭제되었습니다.');
                navigate('/noticeList');				// 정상적으로 삭제되면 목록으로 이동

            })
            .catch(error => {
                console.log(error);
                alert(`삭제에 실패했습니다. (${error.message})`);
                return;
            });
    };

    return (
        <Frame>
            <div className={styles.contentsWrap}>
                <h2 className={styles.title}>공지사항</h2>
                <div className={styles.content}>
                    <em>공지</em>
                    <h3 className={styles.subTitle}>{notice.noticeTitle}</h3>
                    <span>{notice.noticeCreatedTime}</span>
                    <div className={styles.editor}>
                        {notice.noticeContent == null ? "" : Parse(notice.noticeContent)}
                    </div>
                    <div className={styles.attachWrap}>
                        <strong>첨부파일</strong>
                        <div>첨부파일1</div>
                        <div>첨부파일2</div>
                    </div>
                </div>
                <div className={styles.buttonWrap}>
                    { userId=='admin'?
                        <Link to={`/notice/update/${noticeIdx}`}><Button>수정하기</Button></Link>
                    :""
                    }
                    <Button style={{ marginLeft: "20px", marginRight: "20px" }} onClick={handlerClickList}>목록보기</Button>
                    { userId=='admin'?
                    <Button onClick={handlerClickDelete}>삭제하기</Button>
                    :""
                    }
                </div>
            </div>
        </Frame>
    )
}

export default NoticeDetail;