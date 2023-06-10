import './TriedComment.css';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useState } from 'react';
import Swal from "sweetalert2";
import { Input } from "@mui/material";
import ReportPop from '../report/ReportPop';

const TriedComment = (props) => {

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

  const comment = props.comment;
  const commentList = props.commentList;
  const setCommentList = props.setCommentList;

  const presentTime = new Date();
  const commentTime = new Date(comment.triedCommentTime);
  const timeDifference = Math.abs(presentTime - commentTime);
  const [isUpdate, setIsUpdate] = useState(false);
  const [updateComment, setUpdateComment] = useState('');


  //요 내용은 반복되니까 함수로 빼는게 좋을 듯.

  const getTimeDiff = (diff) => {
    let minutes = Math.floor(diff / (1000 * 60));
    let hours = Math.floor(diff / (1000 * 60 * 60));
    let days = Math.floor(diff / (1000 * 60 * 60 * 24));
    let months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.436875)); // 평균 월 길이로 계산
    let years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)); // 평균 연 길이로 계산

    let timeDifferenceResult = "";

    if (years > 0) {
      timeDifferenceResult = years + "년 전";
    } else if (months > 0) {
      timeDifferenceResult = months + "달 전";
    } else if (days > 0) {
      timeDifferenceResult = days + "일 전";
    } else if (hours > 0) {
      timeDifferenceResult = hours + "시간 전";
    } else if (minutes > 0) {
      timeDifferenceResult = minutes + "분 전";
    } else {
      timeDifferenceResult = "방금 전"
    }
    return timeDifferenceResult
  }

  //댓글 수정 시작
  const handlerCommentUpdate = () => {
    setIsUpdate(true);
  }

  //댓글 수정 완료
  const handlerCommentUpdateConfirm = () => {
    const data = {
      triedCommentContent: updateComment,
      triedCommentIdx: comment.triedCommentIdx
    }

    axios.put(`http://${process.env.REACT_APP_CMJ_IP}:8080/api/tried/comment/${comment.travelcourseCommentIdx}`, data, { headers: header })
      .then((response) => {
        console.log(response);
        let updateCommentList = [...commentList];
        //댓글idx 같으면 바뀐 댓글 내용으로 업뎃해줌.
        for (let i = 0; i < updateCommentList.length; i++) {
          if (updateCommentList[i].triedCommentIdx == comment.triedCommentIdx) {
            updateCommentList[i].triedCommentContent = updateComment;
          }
        }
        setCommentList(updateCommentList);
      })
      .catch((error) => {
        console.log(error);
      })

    setIsUpdate(false);
  }

  const handlerCommentUpdateCancel = () => {
    setIsUpdate(false);
  }

  //댓글 삭제
  const handlerCommentDelete = () => {
    Swal.fire({
      title: "댓글 삭제",
      text: "해당 댓글을 삭제하시겠습니까?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '삭제',
      cancelButtonText: '취소'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://${process.env.REACT_APP_JKS_IP}:8080/api/tried/comment/${comment.triedCommentIdx}`, { headers: header })
          .then(response => {
            console.log(response);
            if (response.data === 1) {
              alert('삭제완료');
              let updateCommentList = commentList.filter(cmnt => cmnt.triedCommentIdx != comment.triedCommentIdx);
              setCommentList(updateCommentList);
              return;
            }
          })
          .catch(error => {
            console.log(error);
            alert('삭제실패');
            return;
          });
      }
    })
  }


  return (
    <>
      <div className='triedDetail-comnt-each'>
        <div className='triedDetail-comnt-userinfo'>
          <ReportPop reportedUser={comment.userId} reportedUserNickname={comment.userNickname}>
            <div className='triedDetail-comnt-userimg'>

              <img src={`http://${process.env.REACT_APP_CMJ_IP}:8080/api/getimage/${comment.userImg}`} />
            </div>
          </ReportPop>
          <div className='triedDetail-comnt-usernick'>{comment.userNickname}</div>
        </div>
        <div className='triedDetail-comnt-etc'>
          {isUpdate ?
            <>
              <div className="triedDetail-comnt-cont-modify"><Input placeholder="댓글 수정" value={updateComment} onChange={(e) => setUpdateComment(e.target.value)} /></div>
              <div className='triedDetail-comnt-control'>
                <div className='triedDetail-comnt-control-modify' onClick={handlerCommentUpdateConfirm}>수정완료</div>
                <div className='triedDetail-comnt-control-delete' onClick={handlerCommentUpdateCancel}>취소</div>
              </div>
            </>
            :
            <>
              <div className='triedDetail-comnt-cont'>{comment.triedCommentContent}</div>
              <div className='triedDetail-comnt-time'>{getTimeDiff(timeDifference)}</div>
              <div className='triedDetail-comnt-control'>
                {comment.userId == userId ? <div className='triedDetail-comnt-control-modify' onClick={handlerCommentUpdate}>수정</div> : ""}
                {comment.userId == userId ? <div className='triedDetail-comnt-control-delete' onClick={handlerCommentDelete}>삭제</div> : ""}
              </div>
            </>
          }
        </div>
      </div>
    </>
  )
}

export default TriedComment;