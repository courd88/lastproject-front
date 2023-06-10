import './Mypage.css';
import { useNavigate } from 'react-router-dom';
import EditNoteIcon from '@mui/icons-material/EditNote';
import FlipCameraIosIcon from '@mui/icons-material/FlipCameraIos';
import { useEffect, useState } from 'react';
import Frame from '../main/Frame';
import ProfileModifier from './ProfileModifier';
import NicknameModifier from './NicknameModifier';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import jwt_decode from 'jwt-decode';
import axios from 'axios';

const Mypage = () => {

    const navigate = useNavigate();

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

    //모달 관련 변수, 핸들러
    const [modal1, setModal1] = useState(false);
    const [modal2, setModal2] = useState(false);

    const [user, setUser] = useState({});

    //게시글 관련 변수
    const [boardVisible, setBoardVisible] = useState([true, true, true, true]);
    const [totalVisible, setTotalVisible] = useState(false);

    const [accompanyList, setAccompanyList] = useState([]);
    const [idealrealList, setIdealrealList] = useState([]);
    const [travelcourseList, setTravelcourseList] = useState([]);
    const [triedList, setTriedList] = useState([]);

    //{핸들러}게시판 목록 표시 여부
    const handlerBoardVisibleOne = (index) => {
        let boardVisibleArr = [false, false, false, false];
        boardVisibleArr[index] = true;
        setBoardVisible(boardVisibleArr);
        setTotalVisible(true);
        console.log("누른기야?")
    }

    const handlerBoardVisibleFour = () => {
        let boardVisibleArr = [true, true, true, true];
        setBoardVisible(boardVisibleArr);
        setTotalVisible(false);
    }


    //{핸들러}프사 변경 모달
    const modal1Open = () => {
        setModal1(true);
    }
    //{핸들러}닉넴 변경 모달
    const modal2Open = () => {
        setModal2(true);
    }

    //프로필 이미지 미리보기 필요



    //페이지 접속시, 회원정보, 게시글 조회 필요
    useEffect(() => {

        axios.get(`http://${process.env.REACT_APP_JKS_IP}:8080/api/mypage`,
            { params: { userId: encodeURI(userId) }, headers: header }
        )
            .then((response) => {
                console.log(response);
                const { accompany, idealreal, travelcourse, tried, user } = response.data;
                setAccompanyList(accompany);
                setIdealrealList(idealreal);
                setTravelcourseList(travelcourse);
                setTriedList(tried);
                setUser(user);
            })
            .catch((error) => {
                console.log(error);
            })

    }, [])


    //조회된 게시글이 4개 이상이면 4개로 줄이는 함수
    const arrUnder4List = (array) => {
        let TempArrList = [];
        if (array.length > 4) {
            TempArrList = array.slice(0, 4)
        } else {
            TempArrList = array;
        }

        return TempArrList;
    }

    //얘는 디테일 컴포넌트 따로 만들어 줘야 됨.
    const handlerMoveToCourseDetail = (idx) => {

    }

    //어디까지 디테일 페이지로 전달
    const handlerMoveToTriedDetail = (idx) => {
        navigate(`/tried/detail/${idx}`);
    }

    //동행 디테일 페이지로 전달
    const handlerMoveToAccmDetail = (idx) => {
        navigate(`/accompany/detail/${idx}`);
    }

    //이상과현실 디테일 페이지로 전달
    const handlerMoveToIdealrealDetail = (idx) => {
        navigate(`/idealreal/detail/${idx}`);
    }


    const profileImg = `http://${process.env.REACT_APP_JKS_IP}:8080/api/getimage/${user.userImg}`;
    // 여행코스는 어떻게 해야 하지??


    return (
        <Frame>
            <div id="profile-wrap">
                <div id="profile-title">
                    My Page
                </div>
                <div id="profile">
                    <img src={profileImg}></img>
                    <p>{user.userNickname}</p>
                    <span className="modifier" onClick={modal1Open}><FlipCameraIosIcon />프로필 사진 변경</span>
                    <span className="modifier" onClick={modal2Open}><EditNoteIcon />닉네임 변경</span>
                </div>
                <div id="profile-recent-list">최근 작성글 목록</div>
                <div id="profile-board-wrap">
                    {boardVisible[0] &&
                        <div className="profile-board-list">
                            <div className="profile-board-title"><div>여행코스</div>
                                {totalVisible ?
                                    <RemoveIcon onClick={() => handlerBoardVisibleFour()} /> :
                                    <AddIcon onClick={() => handlerBoardVisibleOne(0)} />
                                }
                            </div>
                            {travelcourseList.length == 0 && <div className='profile-board-cont'>현재 작성한 글이 없습니다</div>}
                            {!totalVisible && travelcourseList && arrUnder4List(travelcourseList).map((post, id) => (
                                <div className='profile-board-cont' onClick={()=>handlerMoveToCourseDetail(post.travelcourseIdx)} >{post.travelcourseTitle}</div>
                            ))}
                            {totalVisible && travelcourseList && travelcourseList.map((post, id) => (
                                <div className='profile-board-cont' onClick={()=>handlerMoveToCourseDetail(post.travelcourseIdx)} >{post.travelcourseTitle}</div>
                            ))}
                        </div>
                    }
                    {boardVisible[1] &&
                        <div className="profile-board-list">
                            <div className="profile-board-title"><div>어디까지</div>
                                {totalVisible ?
                                    <RemoveIcon onClick={() => handlerBoardVisibleFour()} /> :
                                    <AddIcon onClick={() => handlerBoardVisibleOne(1)} />
                                }
                            </div>
                            {triedList.length == 0 && <div className='profile-board-cont'>현재 작성한 글이 없습니다</div>}
                            {!totalVisible && triedList && arrUnder4List(triedList).map((post, id) => (
                                <div className='profile-board-cont' onClick={()=>handlerMoveToTriedDetail(post.triedIdx)} >{post.triedTitle}</div>
                            ))}
                            {totalVisible && triedList && triedList.map((post, id) => (
                                <div className='profile-board-cont' onClick={()=>handlerMoveToTriedDetail(post.triedIdx)} >{post.triedTitle}</div>
                            ))}
                        </div>
                    }
                    {boardVisible[2] &&
                        <div className="profile-board-list">
                            <div className="profile-board-title"><div>여행친구</div>
                                {totalVisible ?
                                    <RemoveIcon onClick={() => handlerBoardVisibleFour()} /> :
                                    <AddIcon onClick={() => handlerBoardVisibleOne(2)} />
                                }
                            </div>
                            {accompanyList.length == 0 && <div className='profile-board-cont'>현재 작성한 글이 없습니다</div>}
                            {!totalVisible && accompanyList && arrUnder4List(accompanyList).map((post, id) => (
                                <div className='profile-board-cont' onClick={()=>handlerMoveToAccmDetail(post.accompanyIdx)} >{post.accompanyTitle}</div>
                            ))}
                            {totalVisible && accompanyList && accompanyList.map((post, id) => (
                                <div className='profile-board-cont' onClick={()=>handlerMoveToAccmDetail(post.accompanyIdx)} >{post.accompanyTitle}</div>
                            ))}
                        </div>
                    }
                    {boardVisible[3] &&
                        <div className="profile-board-list">
                            <div className="profile-board-title"><div>이상과현실</div>
                                {totalVisible ?
                                    <RemoveIcon onClick={() => handlerBoardVisibleFour()} /> :
                                    <AddIcon onClick={() => handlerBoardVisibleOne(3)} />
                                }
                            </div>
                            {idealrealList.length == 0 && <div className='profile-board-cont'>현재 작성한 글이 없습니다</div>}
                            {!totalVisible && idealrealList && arrUnder4List(idealrealList).map((post, id) => (
                                <div className='profile-board-cont' onClick={()=>handlerMoveToIdealrealDetail(post.idealrealIdx)} >{post.idealrealTitle}</div>
                            ))}
                            {totalVisible && idealrealList && idealrealList.map((post, id) => (
                                <div className='profile-board-cont' onClick={()=>handlerMoveToIdealrealDetail(post.idealrealIdx)} >{post.idealrealTitle}</div>
                            ))}

                        </div>
                    }
                </div>
            </div>
            {modal1 && <ProfileModifier modal1={modal1} setModal1={setModal1} userId={userId} header={header} jwtToken={jwtToken} userImg={profileImg} />}
            {modal2 && <NicknameModifier modal2={modal2} setModal2={setModal2} userId={userId} header={header} jwtToken={jwtToken} userNickname={user.userNickname} />}
        </Frame>
    )
}

export default Mypage;