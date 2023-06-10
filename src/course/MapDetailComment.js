import { useEffect, useState } from 'react';
import './MapDetailComment.css';
import MapDetailCommentEach from './MapDetailCommentEach';
import CreateIcon from '@mui/icons-material/Create';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

const A = [1, 2, 3, 4, 5, 6, 7];

const MapDetailComment = (props) => {

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

  const travelcourseIdx=props.travelcourseIdx;

  const [ comment, setComment ] = useState('');
  const [ commentList, setCommentList] = useState([]);

  const handlerComment = (e) =>{
    setComment(e.target.value);
    console.log(comment);
  }

  
  useEffect(()=>{
    fetchDataCommentList();
  },[])


  //댓글목록 조회
  const fetchDataCommentList = () =>{
    axios.get(`http://${process.env.REACT_APP_JKS_IP}:8080/api/course/comment/${travelcourseIdx}`)
    .then(response => {
        console.log(response);
        setCommentList(response.data);
    })
    .catch(error => console.log(error));
  }

  //댓글 작성
  const handlerWriteComment = ()=>{

    const data = {
      travelcourseComment: comment,
      travelcourseIdx: travelcourseIdx,
      userId : userId
    }

    axios.post(`http://${process.env.REACT_APP_JKS_IP}:8080/api/course/comment/${travelcourseIdx}`, data, { headers: header })
    .then(response => {
        console.log(response);
        //입력 후 댓글 목록 업데이트
        fetchDataCommentList();
        //댓글 input 내용 초기화
        setComment('');
        
    })
    .catch(error => {
      console.log(error)
      alert("로그인 후 사용하실 수 있습니다.")
    });
  }


  return (
    <>
      <div id="mapdetail-comment-container">
        <div id="mapdetail-comment-wrap">
          {commentList && commentList.map(comment => (
            <MapDetailCommentEach comment={comment} commentList={commentList} setCommentList={setCommentList}/>
          ))}
        </div>
        <div id="mapdetail-comment-write">
          <input id="mapdetail-comment-write-input" placeholder='댓글 작성 칸' value={comment} onChange={(e)=>{handlerComment(e)}}></input>
          <button id="mapdetail-comment-write-btn" onClick={handlerWriteComment}><CreateIcon/></button>
        </div>
      </div>
    </>
  )
}

export default MapDetailComment;