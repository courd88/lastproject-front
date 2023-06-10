import { useState } from "react";
import { Input } from "@mui/material";
import Swal from "sweetalert2";
import jwt_decode from 'jwt-decode';
import axios from "axios";
import ReportPop from "../report/ReportPop";

const MapDetailCommentEach = (props) => {

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
  //댓글 작성시간이랑 현재시간 차이 계산해서 00분전, 00시간전, 00일전, 0개월전, 0년전으로 보여주기
  const presentTime = new Date();
  const commentTime = new Date(comment.travelcourseCommentTime);
  const timeDifference = Math.abs(presentTime - commentTime);

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






  const [isUpdate, setIsUpdate] = useState(false);
  const [updateComment, setUpdateComment] = useState('');

  const handlerCommentUpdate = () => {
    setIsUpdate(true);
  }

  const handlerCommentUpdateCancel = () => {
    setIsUpdate(false);
  }

  const handlerCommentUpdateConfirm = () => {

    const data = {
      travelcourseComment: updateComment,
      travelcourseCommentIdx: comment.travelcourseCommentIdx
    }

    axios.put(`http://${process.env.REACT_APP_JKS_IP}:8080/api/course/comment/${comment.travelcourseCommentIdx}`, data, { headers: header })
      .then((response) => {
        console.log(response);
        let updateCommentList = [...commentList];
        //댓글idx 같으면 바뀐 댓글 내용으로 업뎃해줌.
        for (let i = 0; i < updateCommentList.length; i++) {
          if (updateCommentList[i].travelcourseCommentIdx == comment.travelcourseCommentIdx) {
            updateCommentList[i].travelcourseComment = updateComment;
          }
        }
        setCommentList(updateCommentList);
      })
      .catch((error) => {
        console.log(error);
      })

    setIsUpdate(false);
  }

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
        axios.delete(`http://${process.env.REACT_APP_JKS_IP}:8080/api/course/comment/${comment.travelcourseCommentIdx}`, { headers: header })
          .then(response => {
            console.log(response);
            if (response.data === 1) {
              alert('삭제완료');
              let updateCommentList = commentList.filter(cmnt => cmnt.travelcourseCommentIdx != comment.travelcourseCommentIdx);
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
      <div className="map-comment-each">
        <ReportPop reportedUser={comment.userId} reportedUserNickname={comment.userNickname}>
          <div className="map-comment-profile-pic">
            <img src={`http://${process.env.REACT_APP_JKS_IP}:8080/api/getimage/${comment.userImg}`} />
          </div>
        </ReportPop>
        <div className="map-comment-content-wrap">
          <div className="map-comment-content-head">
            <span className="map-comment-content-nick">{comment.userNickname}</span>
            <span className="map-comment-content-date">{getTimeDiff(timeDifference)}</span>
          </div>
          {isUpdate ?
            <>
              <div>
                <Input placeholder="댓글 수정" value={updateComment} onChange={(e) => setUpdateComment(e.target.value)} />
              </div>
              <div className="map-comment-content-foot">
                <div className="map-comment-content-modify" onClick={handlerCommentUpdateConfirm}>수정완료</div>
                <div className="map-comment-content-delete" onClick={handlerCommentUpdateCancel}>취소</div>
              </div>
            </>
            :
            <>
              <div className="map-comment-content-body">{comment.travelcourseComment}</div>
              <div className="map-comment-content-foot">
                {comment.userId == userId ? <div className="map-comment-content-modify" onClick={handlerCommentUpdate}>수정</div> : ""}
                {comment.userId == userId ? <div className="map-comment-content-delete" onClick={handlerCommentDelete}>삭제</div> : ""}
              </div>
            </>
          }

        </div>
      </div>
    </>
  )
}
export default MapDetailCommentEach;