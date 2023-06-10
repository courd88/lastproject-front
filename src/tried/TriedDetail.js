import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Frame from "../main/Frame";
import './TriedDetail.css';
import { Button } from "@mui/material";
import TriedThumb from "./TriedThumb";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TriedComment from "./TriedComment";
import Textarea from '@mui/joy/Textarea';
import jwt_decode from 'jwt-decode';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import Parser from "html-react-parser";

const TriedDetail = () => {

    let jwtToken = null;
    let userId = null;
    if (sessionStorage.getItem("token") != null) {
        jwtToken = sessionStorage.getItem("token");
        userId = jwt_decode(jwtToken).sub;
    }

    const header = {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json'
    };

    const navigate = useNavigate();

    const { triedIdx } = useParams();

    const [imageUrl, setImageUrl] = useState('');
    const [filename, setFilename] = useState('');
    const [triedImg, setTriedImg] = useState([]);
    const [tried, setTried] = useState({});
    const [commentList, setCommentList] = useState([]);
    const [comment, setComment] = useState('');

    useEffect(() => {

        //글정보 가져오기
        axios.get(`http://${process.env.REACT_APP_CMJ_IP}:8080/api/tried/detail/${triedIdx}`,
            )
            .then(response => {
                setFilename(response.data.triedImg);
                setTried(response.data);
                console.log(response.data)

            })
            .catch(error =>
                console.log(error)
            );

        fetchCommentData();


        //마지막 글 여부 확인하기 만약 마지막 글이라면 다음글 버튼이 안보이도록 처리


    }, []);

    const fetchCommentData = () => {
        //댓글정보 가져오기
        axios.get(`http://${process.env.REACT_APP_CMJ_IP}:8080/api/tried/comment/${triedIdx}`,
            )
            .then(response => {
                setCommentList(response.data);
                console.log(response.data);
            })
            .catch(error =>
                console.log(error)
            );
    }

    // 이미지 가져오기
    useEffect(() => {
        if (filename) {
            const imageUrl = `http://${process.env.REACT_APP_CMJ_IP}:8080/api/getimage/${filename}`;
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
    }, [filename, triedImg]);

    // 버튼 => 목록
    const handlerClickList = () => {
        navigate('/tried');
    };

    // 버튼 => 수정
    const handlerClickUpdate = (imgUrl) => {
        navigate(`/tried/update/${triedIdx}`, { state: { imgUrl: imgUrl } });
    };

    // 버튼 => 삭제
    const handlerClickDelete = () => {
        if (window.confirm('삭제하시겠습니까?')) {
            axios.delete(`http://${process.env.REACT_APP_CMJ_IP}:8080/api/tried/${triedIdx}`,
                { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } })
                .then(response => {
                    console.log(response);
                    alert('삭제 완료')
                    navigate('/tried');
                })
                .catch(error => {
                    console.log(error);
                    alert('삭제 실패');
                });
        }
    };

    //{핸들러}이전글로 이동 + 추가로 이전 글 번호를 알아와야 하지 않을까 싶음???
    const handlerMoveToBeforeCont = () => {
        let beforeContIdx = triedIdx - 1;
        navigate(`/tried/detail/${beforeContIdx}`);
        window.location.reload();
    }

    //{핸들러}다음글로 이동 + 추가로 다음이 마지막 글인지 알아와야 하지 않을까 싶음???
    const handlerMoveToAfterCont = () => {
        let afterContIdx = parseInt(triedIdx) + 1;
        navigate(`/tried/detail/${afterContIdx}`);
        window.location.reload();
    }

    //{핸들러} 댓글 입력칸
    const handlerChangeComment = (e) => {
        setComment(e.target.value)
        console.log(comment);
    }

    //{핸들러} 댓글 작성
    const handlerCommentWrite = () => {

        const data = {
            userId: userId,
            triedIdx: triedIdx,
            triedCommentContent: comment
        }

        axios.post(`http://${process.env.REACT_APP_CMJ_IP}:8080/api/tried/comment/${triedIdx}`, data, { headers: header })
            .then((response) => {
                console.log(response.data);
                //작성 후 댓글 재 조회
                fetchCommentData();
                setComment('');
            })
            .catch((error) => {
                console.log(error);
                alert('로그인 후 사용하실 수 있습니다.');
            })
    }

    //{핸들러} 트위터 공유하기
    const handlerShareTwitter = () => {
        let sendText = "KADA " + tried.triedTitle;
        let sendURL = `http://localhost:3000/tried/detail/${triedIdx}`;

        window.open("https://twitter.com/intent/tweet?text=" + sendText + "&url=" + sendURL);
    }

    //{핸들러} 페이스북 공유하기
    const handlerShareFacebook = () => {
        let sendURL = `http://localhost:3000/tried/detail/${triedIdx}`;

        window.open("http://www.facebook.com/sharer/sharer.php?u=" + sendURL);
    }

    return (
        <Frame>
            <div id="travelcourse-list-img">
                <img src="https://a.cdn-hotels.com/gdcs/production140/d1583/119ec73c-cbf4-431e-b128-eadb32999939.jpg" />
            </div>
            <div className="triedDetail-container">
                <form action="" method="POST" id="frm" name="frm">
                    <input type="hidden" name="triedIdx" />
                    <div className="tried-title">

                        <div className="triedDetail-title">{tried.triedTitle}</div>
                        <div className="triedDetail-writer">{tried.userNickname}</div>

                        <div className="triedDetail-etc">
                            <div>{tried.triedCreatedTime}</div>
                            <div>조회수 {tried.triedCnt}</div>
                            <div>추천수 {tried.triedRcmd}</div>
                        </div>
                        <div className="triedDetail-img">
                            <img src={imageUrl} />
                            <TriedThumb triedIdx={triedIdx}/>
                        </div>
                        <div className="triedDetail-content">
                            <div>{tried.triedContent == null ? "" : Parser(tried.triedContent)}</div>
                        </div>
                    </div>
                    <div>공유하기</div>
                    <div className="triedDetail-shareIcon">
                        <div className="triedDetail-shareIcon-twitter" onClick={handlerShareTwitter}>
                            <TwitterIcon />
                        </div>
                        <div className="triedDetail-shareIcon-facebook" onClick={handlerShareFacebook}>
                            <FacebookIcon />
                        </div>
                    </div>
                    <div className="triedDetail-comnt-wrap">
                        댓글
                        {commentList && commentList.map(comment => (
                            <>
                                <TriedComment comment={comment} commentList={commentList} setCommentList={setCommentList} />
                            </>
                        ))}
                        <div className="triedDetail-comnt-write">
                            <div className="triedDetail-comnt-write-area">
                                <Textarea
                                    style={{ borderRadius: "10px 0 0 10px", width: "90%" }}
                                    sx={{ color: "#333", }}
                                    color="primary"
                                    placeholder="Type in here…"
                                    minRows={3}
                                    // maxRows={4}
                                    value={comment}
                                    onChange={handlerChangeComment}
                                />
                                <Button sx={{ color: "white", background: "#5E8FCA", ":hover": { background: "#2d6ebd" } }} style={{ borderRadius: "0 10px 10px 0", width: "10%" }} onClick={handlerCommentWrite} >등록</Button>
                            </div>
                        </div>
                    </div>
                </form>


                <div className="triedDetail-btns">
                    {triedIdx == 1 ? <div className="triedDetail-nextCont-btn"></div> :
                        <div onClick={handlerMoveToBeforeCont}><ArrowBackIcon />이전글</div>
                    }
                    <div>
                        <Button type='button' variant="contained" onClick={handlerClickList}>목록</Button>
                        {userId == tried.userId ? <Button type='button' variant="contained" onClick={() => handlerClickUpdate(imageUrl)}>수정</Button> : ""}
                        {userId == tried.userId ? <Button type='button' variant="contained" onClick={handlerClickDelete}>삭제</Button> : ""}
                    </div>
                    <div onClick={handlerMoveToAfterCont}>다음글<ArrowForwardIcon /></div>
                </div>


                {/* <input type="button" id="list" className="btn" value="목록" onClick={handlerClickList} />
                <input type="button" id="edit" className="btn" value="수정" onClick={() => handlerClickUpdate(imageUrl)} />
                <input type="button" id="delete" className="btn" value="삭제" onClick={handlerClickDelete} /> */}
            </div>
        </Frame>
    );
};

export default TriedDetail;