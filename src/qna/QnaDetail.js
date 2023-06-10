import Button from '@mui/joy/Button';
import Frame from "../main/Frame";
import styles from "./QnaDetail.module.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import Textarea from '@mui/joy/Textarea';
import Parser from "html-react-parser";
import { useState, useEffect } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

const QnaDetail = () => {

    let nickName = null;
    let userId = null;
    let jwtToken = null;
    if (sessionStorage.getItem('token') != null) {
        jwtToken = sessionStorage.getItem('token');
        userId = jwt_decode(jwtToken).sub;
        nickName = jwt_decode(jwtToken).nickname;
    }

    const header = {
        'Authorization': `Bearer ${jwtToken}`,
        'Content-Type': 'application/json'
    };


    const navigate = useNavigate();

    const { qnaIdx } = useParams();

    const [qna, setQna] = useState([]);
    const [comment, setComment] = useState([]);

    const [contents, setContents] = useState('');

    useEffect(() => {
        axios.get(`http://${process.env.REACT_APP_JYS_IP}:8080/api/qna/${qnaIdx}`)
            .then(response => {
                console.log(response.data)
                setQna(response.data.selectQnaInfo);
                setComment(response.data.selectCommentList);
                let str = response.data.selectQnaInfo.qnaContent;
                console.log(typeof str);
            })
            .catch(error => {
                console.log(error);
            })
    }, [])

    const handlerClickList = () => navigate('/qnalist');

    const handlerClickDelete = () => {
        axios.delete(`http://${process.env.REACT_APP_JYS_IP}:8080/api/qna/${qnaIdx}`, {headers : header}
        )
            .then(response => {
                alert('정상적으로 삭제되었습니다.');
                navigate('/qnalist');				// 정상적으로 삭제되면 목록으로 이동

            })
            .catch(error => {
                console.log(error);
                alert(`삭제에 실패했습니다. (${error.message})`);
                return;
            });
    };

    const handlerChangeContents = (e) => {
        setContents(e.target.value);
    }

    const handlerSubmit = e => {
        e.preventDefault();

        axios.post(`http://${process.env.REACT_APP_JYS_IP}:8080/api/qna/comments/write/${qnaIdx}`, 
            { "qnaCommentContent": contents , "userId" : userId}, {headers : header})
            .then(response => {
                console.log(response);
                alert('코맨트가 정상적으로 등록되었습니다');
                window.location.replace(`/qna/${qnaIdx}`);
            })
            .catch(error => {
                console.log(error);
                alert(`로그인 후 사용할 수 있습니다.`);
            });
    };

    return (
        <Frame>
            <div className={styles.contentsWrap}>
                <h2 className={styles.title}>QNA</h2>
                <div className={styles.content}>
                    <h3 className={styles.subTitle}>{qna.qnaTitle}</h3>
                    <span>{qna.qnaCreatedTime}</span>
                    <div className={styles.line1}></div>
                    <div className={styles.editor}>
                        {qna.qnaContent == null ? "" : Parser(qna.qnaContent)}
                    </div>
                    <div className={styles.line2}></div>
                </div>
                <div className={styles.comment}>
                    <Textarea
                        style={{ borderRadius: "10px 0 0 10px", width: "90%" }}
                        sx={{ color: "#333", }}
                        color="primary"
                        placeholder="Type in here…"
                        minRows={3}
                    // maxRows={4}
                        value={contents}
                        onChange={handlerChangeContents}
                    />
                    <Button sx={{ color: "white", background: "#5E8FCA", ":hover": { background: "#2d6ebd" } }} style={{ borderRadius: "0 10px 10px 0", width: "10%" }} onClick={handlerSubmit} >등록</Button>
                </div>
                <div className={styles.commentList}>
                    <ul>
                        {
                            comment.map((cmt) => (
                                <li key={cmt.qnaCommentIdx}>
                                    <div className={styles.name}>
                                        <strong>{cmt.userNickname}</strong>
                                        <span>{cmt.qnaCommentTime}</span>
                                    </div>
                                    <p>{cmt.qnaCommentContent}</p>
                                </li>
                            ))
                        }
                    </ul>
                </div>
                <div className={styles.buttonWrap}>
                    { qna.userId == userId ? <Link to={`/qna/update/${qnaIdx}`}><Button sx={{ color: "white", background: "#5E8FCA", ":hover": { background: "#2d6ebd" } }}>수정하기</Button></Link> : ""}
                    <Button sx={{ color: "white", background: "#5E8FCA", ":hover": { background: "#2d6ebd" } }} style={{ marginLeft: "20px", marginRight: "20px" }} onClick={handlerClickList}>목록보기</Button>
                    { qna.userId == userId ? <Button sx={{ color: "white", background: "#5E8FCA", ":hover": { background: "#2d6ebd" } }} onClick={handlerClickDelete}>삭제하기</Button> : ""}
                </div>
            </div>
        </Frame>
    )
}

export default QnaDetail;