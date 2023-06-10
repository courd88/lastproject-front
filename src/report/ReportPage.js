import Style from './ReportPage.module.css';
import { useLocation, useNavigate } from "react-router-dom";
import Frame from "../main/Frame";
import { InputLabel, MenuItem, Select } from "@mui/material";
import { useState } from "react";
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Swal from "sweetalert2";
import axios from 'axios';
import jwt_decode from 'jwt-decode';


const ReportPage = () => {

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

  const location = useLocation();
  const navigate = useNavigate();

  const reportedUser = location.state.reportedUser;
  const reportedUserNickname = location.state.reportedUserNickname;
  //신고하기 기능 어케 하죠잉?

  const [reportReason, setReportReason] = useState('');
  const [reportContent, setReportContent] = useState('');

  const handleChange = (e) => {
    setReportReason(e.target.value);
    console.log(e.target.value);
  }

  const handlerReportContent = (e) => {
    setReportContent(e.target.value);
    console.log(e.target.value);
  }

  const handlerReport = () => {
    if(reportedUser == userId){
      alert("본인은 본인을 신고할 수 없습니다.");
      return
    }

    Swal.fire({
      title: "사용자 신고",
      text: reportedUserNickname + "님을 신고하시겠습니까?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '신고',
      cancelButtonText: '취소'
    })
      .then((result) => {
        if (result.isConfirmed) {

          const data={
            reportReporter : userId,
            reportReportedUser : reportedUser,
            reportContent : reportContent,
            reportReasonIdx : reportReason
          };

          axios.post(`http://${process.env.REACT_APP_JKS_IP}:8080/api/report`, data, { headers: header })
            .then((response) => {
              console.log(response)
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: '성공적으로 신고되었습니다.',
                showConfirmButton: false,
                timer: 1500
              })
              navigate(`/`);
              
            })
            .catch((error) => {
              console.log(error);
              Swal.fire({
                position: 'center',
                icon: 'fali',
                title: '신고에 실패했습니다.',
                showConfirmButton: false,
                timer: 1500
              })
            })
        }
      })
  }

  return (
    <Frame>
      <div className={Style.reportWrap}>

        <div className={Style.reportContainer}>
          <div className={Style.title}>사용자 신고</div>
          <div className={Style.reported}>
            <div className={Style.reportedUserWrap}>
              <div className={Style.reportedUserTitle}>
                신고 아이디
              </div>
              <div className={Style.reportedUser}>
                {reportedUser}
              </div>
            </div>
            <div className={Style.reportedUserNicknameWrap}>
              <div className={Style.reportedUserNicknameTitle}>
                신고자 닉네임
              </div>
              <div className={Style.reportedUserNickname}>
                {reportedUserNickname}
              </div>
            </div>
          </div>
          <div className={Style.reportedReason} >
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">신고사유</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={reportReason}
                label="신고사유"
                onChange={handleChange}
              >
                <MenuItem value={1}>욕설 및 비속어</MenuItem>
                <MenuItem value={2}>광고 및 스팸</MenuItem>
                <MenuItem value={3}>도배</MenuItem>
                <MenuItem value={4}>불법 콘텐츠</MenuItem>
                <MenuItem value={5}>사기 및 사기성 행위</MenuItem>
                <MenuItem value={6}>인신공격 및 협박</MenuItem>
                <MenuItem value={7}>개인정보 침해</MenuItem>
                <MenuItem value={8}>권리 침해</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className={Style.reportedContent}>
            <textarea placeholder="구체적인 신고 내용을 입력해주세요." value={reportContent} onChange={handlerReportContent} >
            </textarea>
          </div>
          <div className={Style.reportBtn}>
            <Button variant="contained" color="error" onClick={handlerReport}>신고</Button>
          </div>
        </div>
      </div>
    </Frame>
  )
}
export default ReportPage;

