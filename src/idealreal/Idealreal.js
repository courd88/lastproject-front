import { useEffect, useState } from "react";
import LNButton from "./LNButton";
import axios from "axios";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Thumb from "./Thumb";
import { useParams } from "react-router-dom";
import { Pagination } from "@mui/material";
import Frame from "../main/Frame";
import styles from "./IdealReal.module.css"
import Button from '@mui/joy/Button';
import jwt_decode from 'jwt-decode';
import FavoriteIcon from '@mui/icons-material/Favorite';

function Idealreal() {

    let nickName = null;
    // let userId = null;
    let jwtToken = null;
    if (sessionStorage.getItem('token') != null) {
        jwtToken = sessionStorage.getItem('token');
        // userId = jwt_decode(jwtToken).sub;
        nickName = jwt_decode(jwtToken).nickname;
    }

    const header = {
        'Authorization': `Bearer ${jwtToken}`,
        'Content-Type': 'application/json'
    };

    const navigate = useNavigate();

    const [idealreal, setIdealreal] = useState("")
    const [data, setData] = useState([])
    const [userId, setUserId] = useState('')
    const [rcmdIdx, setRcmdIdx] = useState('')
    const [idealrealIdealImg, setIdealrealIdealImg] = useState([]);
    const [idealrealRealImg, setIdealrealRealImg] = useState([]);
    const { idealrealIdx } = useParams();
    const [likeCount, setLikeCount] = useState(0);
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const lengthDifference = 10 - data.length;

    useEffect(() => {
        // if (!sessionStorage.getItem('token')) {
        //     alert("로그인이 필요합니다.")
        //     navigate(`/login`);
        //     return
        // }

        //1페이지 리스트 조회
        axios.get(`http://${process.env.REACT_APP_KTG_IP}:8080/api/listidealreal/${page}`, )
            .then(response => {
                console.log(response.data)
                setData(response.data);
            })
            .catch(error => {
                console.log(error);
            })

        //페이지수 조회
        axios.get(`http://${process.env.REACT_APP_KTG_IP}:8080/api/listidealrealpagecount`, )
            .then(response => {
                console.log(response.data)
                // let pageCount = response.data;
                // if( pageCount > 1){
                //     pageCount = 10;
                // }
                // setPageCount(pageCount);
                setPageCount(response.data);
            })
            .catch(error => {
                console.log(error);
            })
    }, [])



    useEffect(() => {
        //1페이지 리스트 조회
        axios.get(`http://${process.env.REACT_APP_KTG_IP}:8080/api/listidealreal/${page}`,)
            .then(response => {
                console.log(response.data)
                setData(response.data);
            })
            .catch(error => {
                console.log(error);
            })

        //페이지수 조회
        axios.get(`http://${process.env.REACT_APP_KTG_IP}:8080/api/listidealrealpagecount`,)
            .then(response => {
                console.log(response.data)
                // let pageCount = response.data;
                // if( pageCount > 1){
                //     pageCount = 10;
                // }
                // setPageCount(pageCount);
                setPageCount(response.data);
            })
            .catch(error => {
                console.log(error);
            })
    }, [page])


    // 원본이 없어도 사진 보이고 싶었는데 잘 안됩니다
    // const idealImg = `http://${process.env.REACT_APP_KTG_IP}:8080/api/getimage/${idealrealIdealImg}`;
    // const realImg = `http://${process.env.REACT_APP_KTG_IP}:8080/api/getimage/${idealrealRealImg}`;


    // 페이징
    const handlerChange = (event, value) => {
        console.log(event, value);
        setPage(value);
    }

    const addEmptyRows = () => {
        const result = [];
        if (!lengthDifference == 8) {

            for (let i = 0; i < lengthDifference; i++) {
                result.push(<tr style={{ borderTop: "1px solid rgba(94, 143, 202, 0.2)", height: "60px" }}><td colSpan="4"></td></tr>);
            }
        }

        return result;
    }

    const handlerInpage = (idealrealIdx) => {
        navigate(`/idealreal/detail/${idealrealIdx}`);
    }


    return (
        <Frame>
            <div className={styles.containerWrap}>
                <h2 className={styles.realTitle}>이상과 현실</h2>
                <LNButton setData={setData} page={page} setPage={setPage}/>

                <div className={styles.wrapper}>
                    <div className={styles.box1}>
                        {data &&
                            data.map((idealreal, rcmd) => (
                                <div key={idealreal.idealrealIdx} className={styles.tdBox} onClick={() => {
                                    handlerInpage(idealreal.idealrealIdx)
                                }}   >
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td style={{ width: "50%" }}>
                                                    <div className={styles.topBox}>
                                                        <em className={styles.flexTitle}>{idealreal.idealrealTitle}</em>
                                                        <span className={styles.flexLike}>LIKE {idealreal.likeCount}</span>
                                                    </div>
                                                    <div className={styles.imgBox}>
                                                        <img
                                                            className={styles.image}
                                                            src={`http://${process.env.REACT_APP_KTG_IP}:8080/api/getimage/${idealreal.idealrealRealImg}`}
                                                        />
                                                        <img
                                                            className={styles.image}
                                                            src={`http://${process.env.REACT_APP_KTG_IP}:8080/api/getimage/${idealreal.idealrealIdealImg}`}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                            {addEmptyRows()}
                                        </tbody>
                                    </table>

                                </div>
                            ))}
                    </div>
                </div>
                <div className={styles.write}>
                    <Button><Link to="/idealreal/write" className={styles.buttonContainer}>글쓰기</Link></Button>
                </div>
                <Pagination count={pageCount} color="primary" page={page} onChange={handlerChange} />
            </div>
            {/* <Link to="/idealreal/write" className={styles.buttonContainer}>글쓰기</Link> */}
        </Frame>
    )
}


export default Idealreal;