import axios from "axios";
import { useEffect, useRef, useState } from "react";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Button from '@mui/joy/Button';
import jwt_decode from 'jwt-decode';

function TriedThumb(props) {

  let nickName = null;
  let loginUserId = null;
  let jwtToken = null;
  if (sessionStorage.getItem('token') != null) {
      jwtToken = sessionStorage.getItem('token');
      loginUserId = jwt_decode(jwtToken).sub;
      nickName = jwt_decode(jwtToken).nickname;
  }

  const header = {
      'Authorization': `Bearer ${jwtToken}`,
      'Content-Type': 'application/json'
  };

  const triedIdx = props.triedIdx;
  const [likeCount, setLikeCount] = useState(0)
  const [likeCheck, setLikeCheck] = useState(0);

  useEffect(() => {

    const params = {
      userId : loginUserId,
      triedIdx : triedIdx
    };

    //해당 글 좋아요 수 조회
    axios.get(`http://${process.env.REACT_APP_JKS_IP}:8080/api/tried/rcmd/${triedIdx}`, { params, headers:header})
      .then(response => {
        console.log(response);
        setLikeCount(response.data);
      })
      .catch(error => console.log(error));

    //이 사람이 좋아요를 눌른 놈인지 아닌지
    axios.get(`http://${process.env.REACT_APP_JKS_IP}:8080/api/tried/rcmd/user`, {params, headers:header})
      .then(response => {
        console.log(response);
        setLikeCheck(response.data);
      })
      .catch(error => console.log(error));


  }, []);


  //좋아요 수 업데이트(추가/삭제) 
  const LikeCountHandler = () => {

    if(loginUserId == null ){
      alert('로그인 후 사용하실 수 있습니다.');
      return
    }

    let params = {
      userId: loginUserId,
      triedIdx: Number(triedIdx)
    }

    let headers = {
      // 'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`
    };

    if (likeCheck == 0) {

      setLikeCount(prev => prev + 1)
      axios.post(`http://${process.env.REACT_APP_JKS_IP}:8080/api/tried/rcmd/user`,
        "", {params, headers: headers})
        .then(response => {
          console.log(response);
          setLikeCheck(1);
        })
        .catch(error => {
          console.log(error);
          
          return;
        });
    } else if (likeCheck == 1) {
      setLikeCount(prev => prev - 1)
      axios.delete(`http://${process.env.REACT_APP_JKS_IP}:8080/api/tried/rcmd/user`,
        { params , headers: headers})
        .then(response => {
          console.log(response);
          setLikeCheck(0);
        })
        .catch(error => {
          console.log(error);
          return;
        });
    }
  }

  return (
    <>
      <Button sx={{ color: "white", background: "#5E8FCA", ":hover": { background: "#2d6ebd" } }}  onClick={LikeCountHandler}>
        <strong style={{marginRight:"10px"}}>
          {likeCheck == 0 ?
            <FavoriteBorderIcon /> 
            :
            <FavoriteIcon  />
          }
        </strong>
        <em style={{ fontSize: "23px", boxSizing:"border-box", paddingBottom:"5px" }}>{likeCount} </em>
      </Button>
    </>
  );
}

export default TriedThumb;