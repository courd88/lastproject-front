import Frame from "../main/Frame";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Notice.module.css";

const Notice = () => {

    const [datas, setDatas] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://${process.env.REACT_APP_JYS_IP}:8080/api/noticelist`)
            .then(response => {
                console.log(response.data)
                setDatas(response.data);
            })
            .catch(error => {
                console.log(error);
            })
    }, [])

    const handlernn = (noticeIdx) => {
        navigate(`/notice/${noticeIdx}`);
    }

    return (
        <Frame>
            <div className={styles.contentsWrap}>
                <h2>공지사항</h2>
                <div className={styles.noticeList}>
                    <ul>
                        {
                            datas.map((list, index) => (
                                // <div onClick={() => handlernn(list.noticeIdx)}>
                                    <li key={index} onClick={() => handlernn(list.noticeIdx)}>
                                        <em>공지</em><h3>{list.noticeTitle}</h3><span>{list.noticeCreatedTime}</span><strong>+</strong>
                                    </li>
                                // </div>

                            ))
                        }
                    </ul>
                </div>
            </div>
        </Frame>
    )
}
export default Notice;