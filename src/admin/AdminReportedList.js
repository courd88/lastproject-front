import axios from 'axios';
import Style from './AdminReportedList.module.css';
import Parser from "html-react-parser";
import Swal from "sweetalert2";
import jwt_decode from 'jwt-decode';
import { useState } from 'react';

const AdminReportedList = (props) => {

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

  const { reportedCount, tcList, tccList, trList, trcList, accList, irList, chatList, selectedReportedUser } = props;
  const typeTC = "TC";
  const typeTCC = "TCC";
  const typeTR = "TR";
  const typeTRC = "TRC";
  const typeACC = "ACC";
  const typeIR = "IR";
  const typeCHAT = "CHAT";



  const handlerPostDelete = (idx, type) => {
    //삭제 처리
    console.log(idx);
    console.log(type);
    Swal.fire({
      title: "게시글 삭제",
      text: "해당글을 삭제하시겠습니까?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '삭제',
      cancelButtonText: '취소'
    })
      .then((result) => {
        if (result.isConfirmed) {
          switch (type) {
            case 'TC':
              axios.delete(`http://${process.env.REACT_APP_JKS_IP}:8080/api/course/${idx}`, { headers: header })
                .then(response => {
                  console.log(response);
                  if (response.data === 1) {
                    alert('삭제됨');
                    return;
                  }
                })
                .catch(error => {
                  console.log(error);
                  alert('삭제실패');
                  return;
                });
              break;
            case 'TCC':
              axios.delete(`http://${process.env.REACT_APP_JKS_IP}:8080/api/course/comment/${idx}`, { headers: header })
                .then(response => {
                  console.log(response);
                  if (response.data === 1) {
                    alert('삭제완료');
                    return;
                  }
                })
                .catch(error => {
                  console.log(error);
                  alert('삭제실패');
                  return;
                });
              break;
            case 'TR':
              axios.delete(`http://${process.env.REACT_APP_CMJ_IP}:8080/api/tried/${idx}`,
                { headers: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` } })
                .then(response => {
                  console.log(response);
                  alert('삭제 완료')
                  return;
                })
                .catch(error => {
                  console.log(error);
                  alert('삭제 실패');
                  return;
                });
              break;
            case 'TRC':
              axios.delete(`http://${process.env.REACT_APP_JKS_IP}:8080/api/tried/comment/${idx}`, { headers: header })
                .then(response => {
                  console.log(response);
                  if (response.data === 1) {
                    alert('삭제완료');
                    return;
                  }
                })
                .catch(error => {
                  console.log(error);
                  alert('삭제실패');
                  return;
                });
              break;
            case 'ACC':
              axios.delete(`http://localhost:8080/api/accompany/${idx}`, { headers: header })
                .then(response => {
                  console.log(response);
                  alert('정상적으로 삭제되었습니다.');
                  return;
                })
                .catch(error => {
                  console.log(error);
                  alert(`삭제에 실패했습니다.`);
                  return;
                });

              break;
            case 'IR':
              axios.delete(`http://${process.env.REACT_APP_KTG_IP}:8080/api/listidealreal/${idx}`,
                { headers: header }
              )
                .then(response => {
                  console.log(response)
                  alert('삭제되었습니다.')
                  return;
                })
                .catch(error => {
                  console.log(error)
                  alert(`삭제에 실패했습니다.`);
                  return;
                })
              break;
            default:
              break;
          }
        }
      })
  }

  //정지처리
  const today = new Date();
  const [duration, setDuration] = useState('일주일');

  const handlerSuspension = () => {

    Swal.fire({
      title: "사용자 정지",
      text: selectedReportedUser + "님을 사용정지처리 하시겠습니까? (정지기간:" + duration + ")",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '정지',
      cancelButtonText: '취소'
    })
      .then((result) => {
        if (result.isConfirmed) {

          console.log(selectedReportedUser);
          console.log(duration)
          console.log(today)
          let suspensionDate = new Date();

          switch (duration) {
            case '일주일':
              suspensionDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
              console.log(suspensionDate)
              break;
            case '한달':
              suspensionDate.setMonth(today.getMonth() + 1);
              console.log(suspensionDate)
              break;
            case '영구정지':
              suspensionDate.setFullYear(today.getFullYear() + 100);
              console.log(suspensionDate)
              break;
            default:
              return;
          }

          const year = suspensionDate.getUTCFullYear();
          const month = ("0" + (suspensionDate.getUTCMonth() + 1)).slice(-2);
          const day = ("0" + suspensionDate.getUTCDate()).slice(-2);
          const hours = ("0" + suspensionDate.getUTCHours()).slice(-2);
          const minutes = ("0" + suspensionDate.getUTCMinutes()).slice(-2);
          const seconds = ("0" + suspensionDate.getUTCSeconds()).slice(-2);

          const mysqlDatetime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

          const data = {
            userId: selectedReportedUser,
            userSuspension: mysqlDatetime
          }

          axios.put(`http://${process.env.REACT_APP_JKS_IP}:8080/api/report/suspension`, data,
            { headers: header }
          )
            .then(response => {
              console.log(response)
              alert('반영되었습니다.')
              return;
            })
            .catch(error => {
              console.log(error)
              alert(`실패했습니다.`);
              return;
            })
        }
      })

  }



  return (
    <div className={Style.reportedWrap}>
      <div className={Style.reportedWrapTop}>
        피신고자 활동 현황
      </div>

      <div className={Style.reportedCnt}>
        신고당한 횟수: {" "}
        {reportedCount}
        회
      </div>
      <div className={Style.postListWrapTop}>
        피신고자 글목록
      </div>
      <div className={Style.postListWrap}>
        <div className={Style.postListTop}>여행코스</div>
        <div className={Style.postListHead}>
          <div className={Style.postListHeadTitle}>
            글 제목
          </div>
          <div className={Style.postListHeadContent}>
            글 내용
          </div>
          <div className={Style.postListHeadTime}>
            작성시간
          </div>
          <div className={Style.postListHeadDelete}>
            삭제처리
          </div>
        </div>
        <div className={Style.postListBodyWrap}>
          {tcList && tcList.map(tc => (
            <div className={Style.postListBody}>
              <div className={Style.postListBodyTitle}>
                {tc.travelcourseTitle}
              </div>
              <div className={Style.postListBodyContent}>
                {""}
              </div>
              <div className={Style.postListBodyTime}>
                {tc.travelcourseCreatedtime}
              </div>
              <div className={Style.postListBodyDelete} onClick={() => handlerPostDelete(tc.travelcourseIdx, typeTC)}>
                삭제
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={Style.postListWrap}>
        <div className={Style.postListTop}>여행코스 댓글</div>
        <div className={Style.postListHead}>
          <div className={Style.postListHeadTitle}>

          </div>
          <div className={Style.postListHeadContent}>
            댓글 내용
          </div>
          <div className={Style.postListHeadTime}>
            작성시간
          </div>
          <div className={Style.postListHeadDelete}>
            삭제처리
          </div>
        </div>
        <div className={Style.postListBodyWrap}>
          {tccList && tccList.map(tcc => (
            <div className={Style.postListBody}>
              <div className={Style.postListBodyTitle}>
                {""}
              </div>
              <div className={Style.postListBodyContent}>
                {tcc.travelcourseComment}
              </div>
              <div className={Style.postListBodyTime}>
                {tcc.travelcourseCommentTime}
              </div>
              <div className={Style.postListBodyDelete} onClick={() => handlerPostDelete(tcc.travelcourseCommentIdx, typeTCC)}>
                삭제
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={Style.postListWrap}>
        <div className={Style.postListTop}>어디까지</div>
        <div className={Style.postListHead}>
          <div className={Style.postListHeadTitle}>
            글 제목
          </div>
          <div className={Style.postListHeadContent}>
            글 내용
          </div>
          <div className={Style.postListHeadTime}>
            작성시간
          </div>
          <div className={Style.postListHeadDelete}>
            삭제처리
          </div>
        </div>
        <div className={Style.postListBodyWrap}>
          {trList && trList.map(tr => (
            <div className={Style.postListBody}>
              <div className={Style.postListBodyTitle}>
                {tr.triedTitle}
              </div>
              <div className={Style.postListBodyContent}>
                {tr.triedContent}
              </div>
              <div className={Style.postListBodyTime}>
                {tr.triedCreatedTime}
              </div>
              <div className={Style.postListBodyDelete} onClick={() => handlerPostDelete(tr.triedIdx, typeTR)}>
                삭제
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={Style.postListWrap}>
        <div className={Style.postListTop}>어디까지 댓글</div>
        <div className={Style.postListHead}>
          <div className={Style.postListHeadTitle}>
            댓글 제목
          </div>
          <div className={Style.postListHeadContent}>
            댓글 내용
          </div>
          <div className={Style.postListHeadTime}>
            작성시간
          </div>
          <div className={Style.postListHeadDelete}>
            삭제처리
          </div>
        </div>
        <div className={Style.postListBodyWrap}>
          {trcList && trcList.map(trc => (
            <div className={Style.postListBody}>
              <div className={Style.postListBodyTitle}>
                제목없음
              </div>
              <div className={Style.postListBodyContent}>
                {trc.triedCommentContent}
              </div>
              <div className={Style.postListBodyTime}>
                {trc.triedCommentTime}
              </div>
              <div className={Style.postListBodyDelete} onClick={() => handlerPostDelete(trc.triedCommentIdx, typeTRC)}>
                삭제
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={Style.postListWrap}>
        <div className={Style.postListTop}>여행친구</div>
        <div className={Style.postListHead}>
          <div className={Style.postListHeadTitle}>
            글 제목
          </div>
          <div className={Style.postListHeadContent}>
            글 내용
          </div>
          <div className={Style.postListHeadTime}>
            작성시간
          </div>
          <div className={Style.postListHeadDelete}>
            삭제처리
          </div>
        </div>
        <div className={Style.postListBodyWrap}>
          {accList && accList.map(acc => (
            <div className={Style.postListBody}>
              <div className={Style.postListBodyTitle}>
                {acc.accompanyTitle}
              </div>
              <div className={Style.postListBodyContent}>
                {(Parser(acc.accompanyContent))}
              </div>
              <div className={Style.postListBodyTime}>
                {acc.accompanyCreatedTime}
              </div>
              <div className={Style.postListBodyDelete} onClick={() => handlerPostDelete(acc.accompanyIdx, typeACC)}>
                삭제
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={Style.postListWrap}>
        <div className={Style.postListTop}>이상과현실</div>
        <div className={Style.postListHead}>
          <div className={Style.postListHeadTitle}>
            글 제목
          </div>
          <div className={Style.postListHeadContent}>
            글 내용
          </div>
          <div className={Style.postListHeadTime}>
            작성시간
          </div>
          <div className={Style.postListHeadDelete}>
            삭제처리
          </div>
        </div>
        <div className={Style.postListBodyWrap}>
          {irList && irList.map(ir => (
            <div className={Style.postListBody}>
              <div className={Style.postListBodyTitle}>
                {ir.idealrealTitle}
              </div>
              <div className={Style.postListBodyContent}>
                {(Parser(ir.idealrealContent))}
              </div>
              <div className={Style.postListBodyTime}>
                {ir.idealrealCreatedTime}
              </div>
              <div className={Style.postListBodyDelete} onClick={() => handlerPostDelete(ir.idealrealIdx, typeIR)}>
                삭제
              </div>
            </div>
          ))}
        </div>
      </div>


      <div className={Style.chatListWrap}>
        <div className={Style.chatListTop}>채팅내역</div>
        <div className={Style.chatListHead}>
          <div className={Style.chatListHeadTime}>
            채팅시간
          </div>
          <div className={Style.chatListHeadMessage}>
            채팅내용
          </div>
        </div>
        <div className={Style.chatListBodyWrap}>
          {chatList && chatList.map(chat => (
            <div className={Style.chatListBody}>
              <div className={Style.chatListBodyTime}>
                {chat.createdDt}
              </div>
              <div className={Style.chatListBodyMessage}>
                {chat.message}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={Style.suspension}>
        <div className={Style.suspensionBody}>
          정지처리
          <div className={Style.suspensionChoice}>
            정지기한설정
            <select value={duration}
              onChange={(e) => setDuration(e.target.value)}>
              <option value="일주일">일주일</option>
              <option value="한달">한달</option>
              <option value="영구정지">영구정지</option>
            </select>
          </div>
          <div className={Style.suspensionBtn} onClick={handlerSuspension}>
            정치처리
          </div>
        </div>
      </div>

    </div>
  )
}
export default AdminReportedList;