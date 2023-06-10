import './MapDetail.css';
import CourseModal from "../modal/CourseModal";
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import { LegendToggleOutlined } from '@mui/icons-material';
import MapIcon from '@mui/icons-material/Map';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import jwt_decode from 'jwt-decode';
import NavigateBeforeRoundedIcon from '@mui/icons-material/NavigateBeforeRounded';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { Swiper, SwiperSlide } from 'swiper/react';
import MapDetailComment from './MapDetailComment';
import Swal from "sweetalert2";
import MapdetailSwiper from './MapDetailSwiper';


function MapDetail(props) {

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



    const googleMapKey = 'AIzaSyA5TChzH-V9NZ7sp0JKZd2AK64_7LjFAEw';
    const [mapMarkers, setMapMarkers] = useState('');
    const [arrMarker, setArrMarker] = useState([]);
    const [markerNumber, setMarkerNumber] = useState(1);

    let googleMapURL = `https://maps.googleapis.com/maps/api/staticmap?&size=296x250&maptype=roadmap&${mapMarkers}&key=${googleMapKey}`;
    let googleMapURLmobile = `https://maps.googleapis.com/maps/api/staticmap?&size=280x180&maptype=roadmap&${mapMarkers}&key=${googleMapKey}`;

    const modal = props.modal;
    const setModal = props.setModal;
    const title = props.title;
    const writer = props.userId;
    const userImg = props.userImg;
    const userNickname = props.userNickname;
    const startDate = props.startDate;
    const endDate = props.endDate;
    const days = props.days;
    const travelcourseIdx = props.travelcourseIdx;
    const modalStateClose = props.modalStateClose;

    console.log(travelcourseIdx);
    const [courseImg, setCourseImg] = useState([]);

    const navigate = useNavigate();

    //마커정리하기
    const handlerChangeMarkers = (index) => {
        let tempMakers = '';
        let number = 1;
        let tempArrMarker = [];
        days[index].dayinfo.forEach(element => {
            tempMakers = tempMakers + "&markers=color:red%7Clabel:" + number++ + "%7C" + element.lat + "," + element.lng + "&markers=size:tiny";
            tempArrMarker.push(`${element.lat},${element.lng}`)
        });
        setArrMarker(tempArrMarker);
        setMapMarkers(tempMakers);
        setMarkerNumber(1);
        console.log(tempArrMarker);
    }

    //{핸들러} 구글맵으로 이동
    const handlerMoveToGoogleMap = () => {

        window.open(`https://www.google.com/maps/search/${arrMarker[markerNumber - 1]}`, '_blank');
    }

    //{핸들러} 구글맵으로 이동할 마커번호 줄이기
    const handlerMarkerNumberMinus = () => {

        if (markerNumber == 1) {
            return
        } else {
            setMarkerNumber(markerNumber - 1);
        }
    }

    const handlerMarkerNumberPlus = () => {

        if (markerNumber == arrMarker.length) {
            return
        } else {
            setMarkerNumber(markerNumber + 1);
        }
    }

    useEffect(() => {
        axios.get(`http://${process.env.REACT_APP_JKS_IP}:8080/api/course/img/${travelcourseIdx}`)
            .then(response => {
                console.log(response);
                setCourseImg(response.data);
            })
            .catch(error => console.log(error));
    }, []);

    // const handlerClickUpdate = () => {
    //     axios.put(`http://localhost:8080/api/course/${travelcourseIdx}`,
    //         { 'travelcoursetitle': travelcourseTitle, 'travelcoursecontents': travelcourseContents })
    //         .then(response => {
    //             console.log(response);
    //             if (response.data === 1) {
    //                 alert('수정됨.');
    //             } else {
    //                 alert('수정안됨.');
    //                 return;
    //             }
    //         })
    //         .catch(error => {
    //             console.log(error);
    //             alert(`수정에 실패. (${error.message})`);
    //             return;
    //         });
    // };

    const handlerClickDelete = () => {

        Swal.fire({
            title: "게시글 삭제",
            text: "해당 글을 삭제하시겠습니까?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '삭제',
            cancelButtonText: '취소'
        })
            .then((result) => {
                if (result.isConfirmed) {

                    axios.delete(`http://${process.env.REACT_APP_JKS_IP}:8080/api/course/${travelcourseIdx}`, { headers: header })
                        .then(response => {
                            console.log(response);
                            if (response.data === 1) {
                                alert('삭제됨');
                                navigate('/course');
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
    };

    let arrPlaceList = [];

    const getPlaceList = () => {
        let array = [];
        let strPlaceList = '';
        if (days) {
            for (let i = 0; i < days.length; i++) {
                for (let j = 0; j < days[i].dayinfo.length; j++) {
                    strPlaceList = strPlaceList + days[i].dayinfo[j].placeName + " - ";

                }
                strPlaceList = strPlaceList.slice(0, -3);
                array.push(strPlaceList);
                strPlaceList = '';
            }
        } else {
            return
        }

        return array;
    }

    const profileImg = `http://${process.env.REACT_APP_JKS_IP}:8080/api/getimage/${userImg}`;

    arrPlaceList = getPlaceList();
    console.log(arrPlaceList);

    return (
        <CourseModal modal={modal} setModal={setModal} modalStateClose={modalStateClose}>
            <div className="container">
                <div id="mapdetail-wrap">
                    <span id="mapdetail-title">{title}</span>
                    {writer == userId &&
                        <>
                            <span id="mapdetail-edit-btn"><EditNoteOutlinedIcon /></span>
                            <span id="mapdetail-delete-btn" onClick={handlerClickDelete}><DeleteForeverOutlinedIcon /></span>
                        </>
                    }
                    <div className="camera-black-line"></div>

                    <div id="camera-center-back">
                        <img id="mapdetail-userpic"
                            src={profileImg} />
                        <span id="mapdetail-userid">{userNickname}</span>
                        <div id="mapdetail-img-list">
                            <MapdetailSwiper img={courseImg} />
                        </div>
                        <MapDetailComment travelcourseIdx={travelcourseIdx} />
                        <span id="mapdetail-date">{startDate}~{endDate}</span>
                    </div>

                    <div className="camera-black-line"></div>
                    <div id="mapdetail-course-list-wrap">
                        <div id="mapdetail-map">
                            {/* <img src={googleMapURL} /> */}
                            <img src={googleMapURLmobile} />
                            <div id="mapdetail-map-googlemap" >
                                <img style={{ width: "15px" }} src="https://play-lh.googleusercontent.com/Kf8WTct65hFJxBUDm5E-EpYsiDoLQiGGbnuyP6HBNax43YShXti9THPon1YKB6zPYpA" />
                                <span id="mapdetail-map-googlemap-btn" onClick={handlerMoveToGoogleMap}>구글맵에서 보기</span>
                                <span id="mapdetail-map-googlemap-pin">
                                    <ArrowLeftIcon onClick={() => handlerMarkerNumberMinus()} />
                                    {markerNumber}
                                    <ArrowRightIcon onClick={() => handlerMarkerNumberPlus()} />
                                </span>
                            </div>
                        </div>

                        <div id="mapdetail-course-list">

                            {/* day식별자로 중복제외한 day내용만 사용 */}
                            {days && days.map((days, index) => (
                                <div onClick={() => handlerChangeMarkers(index)}>
                                    <div>
                                        <h2>DAY{days.day}</h2>
                                        <span>{days.dayDescription}</span>
                                    </div>
                                    <br />
                                    <p>{arrPlaceList[index]}</p>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>

        </CourseModal >
    );

}
export default MapDetail;