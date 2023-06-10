import './MapList.css';
import { useEffect, useState } from "react"
import axios from "axios";
import jwt_decode from 'jwt-decode';
import Frame from "../main/Frame";
import MapEach from "./MapEach";
import Button from '@mui/material/Button';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import MapDetail from './MapDetail';
import Input from '@mui/material/Input';
import SearchIcon from '@mui/icons-material/Search';
import throttle from 'lodash/throttle';

const MapList = () => {

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

    //모달을 배열로 변경
    const [modalState, setModalState] = useState([]);
    const [modal, setModal] = useState(false);
    const modalOpen = (index) => {
        let updateArray = [...modalState];
        updateArray[index] = true;
        console.log('몇번째 모달 켜진거지?', updateArray)
        setModalState(updateArray);
    }

    const modalStateClose = (index) => {
        let updateArray = [...modalState];
        updateArray[index] = false;
        setModalState(updateArray);
        document.body.style.cssText = `
        position: static;`
    }
    const [datas, setDatas] = useState([]);
    const [filterDatas, setFilterDatas] = useState([]);
    const [days, setDays] = useState([]);
    const [pages, setPages] = useState(1);
    const [search, setSearch] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const [isAllPagesLoaded, setIsAllPagesLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    //{핸들러} 스크롤 감지해서 페이지 1씩 증가, throttle사용해서 0.7초 동안 스크롤 안하면 작동
    const handlerScroll = throttle(() => {
        //현재 스크롤 높이
        const scrolledHeight =
            window.innerHeight + document.documentElement.scrollTop;
        //현재 스크린 풀 높이
        const fullHeight = document.documentElement.offsetHeight;
        //비율
        const scrollThreshold = 0.8;

        //풀화면 높이 보다 스크롤한 높이가 더 크다면 페이지를 +1 씩 증가시켜라
        if (scrolledHeight >= fullHeight * scrollThreshold && !isLoading) {
            //페이지 1씩 증가
            console.log('현재페이지', pages);
            console.log('총페이지', totalPages);
            if (pages >= totalPages) {
                setIsAllPagesLoaded(true);
                return

            } else {
                setPages(pages + 1);
            }
        }
    }, 700);

    //page바뀌면 스크롤 핸들러 작동 
    useEffect(() => {
        window.addEventListener("scroll", handlerScroll)

        return () => {
            window.removeEventListener("scroll", handlerScroll)
        };

    }, [pages, totalPages]);

    const fetchData = () => {
        const params = {
            pages: pages,
            search: search
        }

        axios.get(`http://${process.env.REACT_APP_JKS_IP}:8080/api/course`, { params }
        )
            .then(response => {
                console.log(response);
                let arrItem = [];
                //페이지 1일 경우
                if (pages == 1) {
                    //기본 정보
                    setFilterDatas(response.data);

                    //모달배열만들기 ( 글 개수만큼 )
                    let array = response.data;
                    let updateModalArray = [...array];
                    for (let i = 0; i < array.length; i++) {
                        updateModalArray[i] = false;
                    }
                    console.log(updateModalArray);
                    setModalState(updateModalArray);
                    setIsLoading(false);
                    //페이지 2 이상일 경우
                } else {
                    let prevArr = [...filterDatas];
                    arrItem = response.data;
                    prevArr = [...prevArr, ...arrItem];
                    setFilterDatas(prevArr);

                    //모달배열만들기 ( 글 개수만큼 )
                    let array = prevArr
                    let updateModalArray = [...array];
                    for (let i = 0; i < array.length; i++) {
                        updateModalArray[i] = false;
                    }
                    console.log(updateModalArray);
                    setModalState(updateModalArray);
                    setIsLoading(false);
                }
            })
            .catch(error => {
                console.log(error);
            })
    };

    //현재 검색어 기준 총 페이지 수 요청
    const fetchDataPageCount = () => {
        const params = {
            search: search
        }

        axios.get(`http://${process.env.REACT_APP_JKS_IP}:8080/api/course/totalpages`, { params }
        )
            .then(response => {
                console.log(response);
                setTotalPages(response.data);
            })
            .catch(error => {
                console.log(error);
            })
    }

    useEffect(() => {
        fetchData();
        fetchDataPageCount();
    }, [pages])


    const handlerChangeSearch = (e) => {
        e.preventDefault();
        console.log(e.target.value);
        setSearch(e.target.value);
    }


    const handlerSubmitSearch = () => {
        //검색시 페이지 1로 변경
        setPages(1);
        fetchData();
        fetchDataPageCount();
    }


    return (
        <Frame>
            <div id="travelcourse-list-img">
                <img src="https://hearthookhome.com/wp-content/uploads/2018/08/How-to-make-a-travel-map-with-pins-1024x683.jpg" />
            </div>
            <div id='travelcourse-list-wrap'>
                <div id="travelcourse-list-title">여행코스</div>

                <div id="travelcourse-list-write">
                    <Link to="/course/mapwrite">
                        <Button variant="contained">WRITE</Button>
                    </Link>
                    <div>
                        <Input placeholder="Search" variant="outlined" color="primary" onChange={handlerChangeSearch} value={search} onKeyDown={e => { if (e.key === "Enter") { handlerSubmitSearch(e); } }} />
                        <SearchIcon onClick={() => handlerSubmitSearch()} />
                    </div>
                </div>
                <div id="travelcourse-list-lists">
                    {filterDatas && filterDatas.map((course, index) => (
                        <>
                            <MapEach
                                modalOpen={() => modalOpen(index)}
                                userNickname={course.userNickname}
                                userImg={course.userImg}
                                startDate={course.travelcourseStartDate.substr(0, 10)}
                                endDate={course.travelcourseEndDate.substr(0, 10)}
                                title={course.travelcourseTitle}
                                img={course.travelcourseImg}
                                days={course.travelcourseDetailList}
                                modal={modal}
                                setModal={setModal}
                            />
                            {modalState[index] &&
                                <MapDetail
                                    modal={modal}
                                    setModal={setModal}
                                    userId={course.userId}
                                    userImg={course.userImg}
                                    userNickname={course.userNickname}
                                    startDate={course.travelcourseStartDate.substr(0, 10)}
                                    endDate={course.travelcourseEndDate.substr(0, 10)}
                                    title={course.travelcourseTitle}
                                    travelcourseIdx={course.travelcourseIdx}
                                    days={course.travelcourseDetailList}
                                    modalStateClose={() => modalStateClose(index)}
                                />
                            }
                        </>
                    ))}
                </div>
                {
                    datas.length === 0 && (
                        <div>
                            <span> 데이터가 없다.</span>
                        </div>
                    )
                }
            </div>
        </Frame>
    );
};

export default MapList;