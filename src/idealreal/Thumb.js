import axios from "axios";
import { useEffect, useRef, useState } from "react";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Button from '@mui/joy/Button';
import jwt_decode from 'jwt-decode';

function Thumb(props) {

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

  const [idealrealIdx, setIdealrealIdx] = useState(props.idealrealIdx);
  const [userId, setUserId] = useState(props.userId);
  const [likeCount, setLikeCount] = useState(0)
  const [likeCheck, setLikeCheck] = useState(0);

  const refLikeInput = useRef();

  useEffect(() => {
    // const token = sessionStorage.getItem('token');
    // const decodedToken = jwt_decode(token);
    // console.log(decodedToken);
    // setUserNickname(decodedToken.userNickname);


    //해당 글 좋아요 수 조회
    axios.get(`http://${process.env.REACT_APP_KTG_IP}:8080/api/${idealrealIdx}/getlike`, )
      .then(response => {
        console.log(response);
        setLikeCount(response.data);
      })
      .catch(error => console.log(error));

    //이 사람이 좋아요를 눌른 놈인지 아닌지
    let tempLoginUserId = "";
    if( loginUserId != null ){
      tempLoginUserId = loginUserId.replace(".", "-");
    }
    axios.get(`http://${process.env.REACT_APP_KTG_IP}:8080/api/listidealreal/detail/likecheck/${idealrealIdx}/${tempLoginUserId}`, {headers:header})
      .then(response => {
        console.log(response);
        setLikeCheck(response.data);
      })
      .catch(error => console.log(error));


  }, []);


  //좋아요 수 업데이트(추가/삭제) 
  const LikeCountHandler = () => {

    //추후 로그인 토큰 값으로 변경 필요!!!
    // let loginId = 'jks@jks.com';
    if (loginUserId==null){
      alert('로그인 후 사용하실 수 있습니다.');
      return
    }

    let data = {
      userId: loginUserId,
      idealrealIdx: idealrealIdx
    }

    let headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`
    };

    if (likeCheck == 0) {

      setLikeCount(prev => prev + 1)
      axios.post(`http://${process.env.REACT_APP_KTG_IP}:8080/api/${idealrealIdx}/like`,
        data, {headers:header})
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
      axios.delete(`http://${process.env.REACT_APP_KTG_IP}:8080/api/${idealrealIdx}/unlike`,
        { data, headers: header})
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
      {/* <div style={{ display: "felx", background: "pink" }}>
        <em style={{fontSize:"30px"}}>Joasis{likeCount} </em>
        <strong>
          {likeCheck == 0 ?
            <FavoriteBorderIcon onClick={LikeCountHandler} /> :
            <FavoriteIcon onClick={LikeCountHandler} />
          }
        </strong>
      </div> */}
    </>
  );
}

export default Thumb;