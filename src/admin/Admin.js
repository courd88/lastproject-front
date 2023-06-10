
import { useEffect, useState } from 'react';
import Frame from '../main/Frame';
//import Style from './Admin.module.css';
import AdminBoard from './AdminBoard';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import Style from './Admin.module.css';
import AdminReport from './AdminReport';

const Admin = () => {

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

  const [isBoardStatic, setIsBoardStatic] = useState(true);
  const [isReport, setIsReport] = useState(false);

  const [page, setPage] = useState(1);
  const [reportList, setReportList] = useState([]);
  const [pageCount, setPageCount] = useState(1);

  const [isReportList, setIsReportList] = useState(false);

  const [reportedCount, setReportedCount] = useState(0);
  //여행코스, 여행코스 댓글, 어디까지, 어디까지 댓글, 여행친구, 이상과현실, 채팅 리스트조회
  const [tcList, setTcList] = useState([]);
  const [tccList, setTccList] = useState([]);
  const [trList, setTrList] = useState([]);
  const [trcList, setTrcList] = useState([]);
  const [accList, setAccList] = useState([]);
  const [irList, setIrList] = useState([]);
  const [chatList, setChatList] = useState([]);

  const [selectedReportedUser, setSelectedReportedUser] = useState('');

  const handlerOpenBoardStatic = () => {
    setIsBoardStatic(true);
    setIsReport(false);
  };

  const handlerOpenReport = () => {
    setIsBoardStatic(false);
    setIsReport(true);
  };

  useEffect(() => {

    axios.get(`http://${process.env.REACT_APP_JKS_IP}:8080/api/report/pagecount`,
      { headers: header }
    )
      .then((response) => {
        console.log(response);
        setPageCount(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
  }, [])



  useEffect(() => {

    axios.get(`http://${process.env.REACT_APP_JKS_IP}:8080/api/report/${page}`,
      { headers: header }
    )
      .then((response) => {
        console.log(response);
        setReportList(response.data);
      })
      .catch((error) => {
        console.log(error);
      })

  }, [page])

  const handlerChange = (event, value) => {
    console.log(event, value);
    setPage(value);
  }

  const handlerSelectReportedUser = (reportReportedUser) => {


    if (!isReportList) {
      setIsReportList(true);
    } else {
      setIsReportList(false);
      return
    }

    const params = {
      reportReportedUser: reportReportedUser
    }

    axios.get(`http://${process.env.REACT_APP_JKS_IP}:8080/api/report/reportedboardlist`,
      { params, headers: header }
    )
      .then((response) => {
        console.log(response);
        setReportedCount(response.data.reportedCount);
        setTcList(response.data.travelcourseList);
        setTccList(response.data.travelcourseCommentList);
        setTrList(response.data.triedList);
        setTrcList(response.data.triedCommentList);
        setAccList(response.data.accompanyList);
        setIrList(response.data.idealrealList);
        setChatList(response.data.chatList);
      })
      .catch((error) => {
        console.log(error);
      })

    setSelectedReportedUser(reportReportedUser);
  }


  return (
    <Frame>
      <div className={Style.adminTitle}>관리자페이지</div>
      <div className={Style.adminChoiceBtn}>
        <div className={Style.adminChoiceBtnBoard} onClick={handlerOpenBoardStatic}>게시글 동향</div>
        <div className={Style.adminChoiceBtnReport} onClick={handlerOpenReport}>신고관리</div>
      </div>
      <div className={Style.adminWrap}>
        {isBoardStatic ?
          <AdminBoard />
          :
          ""
        }
        {isReport ?

          <AdminReport
            reportList={reportList}
            pageCount={pageCount}
            page={page}
            reportedCount={reportedCount}
            tcList={tcList}
            tccList={tccList}
            trList={trList}
            trcList={trcList}
            accList={accList}
            irList={irList}
            chatList={chatList}
            isReportList={isReportList}
            handlerChange={handlerChange}
            handlerSelectReportedUser={handlerSelectReportedUser}
            selectedReportedUser={selectedReportedUser}
          />
          :
          ""
        }
      </div>
    </Frame>
  )
}
export default Admin;