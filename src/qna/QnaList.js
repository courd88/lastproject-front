import Frame from "../main/Frame";
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import styles from "./QnaList.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Pagination from '@mui/material/Pagination';
import jwt_decode from 'jwt-decode';

const QnaList = () => {

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
        // 'Content-Type': 'application/json'
    };


    const [datas, setDatas] = useState([]);
    const [pages, setPages] = useState(1);
    const [search, setSearch] = useState('');
    const [pageCount, setPageCount] = useState(0);
    const navigate = useNavigate();

    const lengthDifference = 10 - datas.length;

    const refSearchInput = useRef();

    useEffect(() => {

        const params = {
            pages: pages,
            search: search
        }

        axios.get(`http://${process.env.REACT_APP_JYS_IP}:8080/api/qnalistbypage`, { params : params})
            .then(response => {
                console.log(response.data)
                setDatas(response.data);
            })
            .catch(error => {
                console.log(error);
            })

        axios.get(`http://${process.env.REACT_APP_JYS_IP}:8080/api/qnapagecount`, { params : params})
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

    }, [pages])

    const handlerChange = (event, value) => {
        console.log(event, value);
        setPages(value);
    }

    const handlerChangeSearch = (e) => {
        e.preventDefault();
        console.log(e.target.value);
        setSearch(e.target.value);
    }

    const handlerSubmitSearch = async () => {
        console.log("클릭");
        const params = {
            pages: pages,
            search: search
        }
        try {
            const response = await axios.get(`http://${process.env.REACT_APP_JYS_IP}:8080/api/qnalistbypage`, { params : params});
            console.log(response.data);
            setDatas(response.data);
            navigate(`/qnalist`);
        } catch (e) {
            console.log(e);
        }

        try {
            const response = await axios.get(`http://${process.env.REACT_APP_JYS_IP}:8080/api/qnapagecount`, { params : params});
            console.log(response.data);
            setPageCount(response.data);
            navigate(`/qnalist`);
        } catch (e) {
            console.log(e);
        }
        setPages(1);
    }

    const handlerWrite = () => {
        navigate(`/qna/write`);
    }
    const handlerDetail = (qnaIdx) => {
        navigate(`/qna/${qnaIdx}`);
    }

    const addEmptyRows = () => {
        const result = [];
        if (lengthDifference == 10) {
            return
        } else {
            for (let i = 0; i < lengthDifference; i++) {
                result.push(<tr style={{ borderTop: " 1px solid #ccc ", height: "60px" }}><td colSpan="4"></td></tr>);
            }
            return result;

        }
    }


    return (
        <Frame>
            <div className={styles.contentsWrap}>
                <h2 className={styles.title}>QNA</h2>
                <div className={styles.content}>
                    <div className={styles.search}>
                        <Input placeholder="검색어를 입력해주세요." variant="outlined" color="primary" onChange={handlerChangeSearch} value={search} ref={refSearchInput} onKeyDown={e => { if (e.key === "Enter") { handlerSubmitSearch(e); } }} />
                        <Button style={{ marginLeft: "20px" }} onClick={handlerSubmitSearch}>검색</Button>
                    </div>
                    <div className={styles.table}>
                        <table>
                            <colgroup>
                                <col width="15%" />
                                <col width="*" />
                                <col width="15%" />
                                <col width="15%" />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th scope="col">글번호</th>
                                    <th scope="col">제목</th>
                                    <th scope="col">작성일</th>
                                    <th scope="col">작성자</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    datas.length === 0 && (
                                        <tr className={styles.noData}>
                                            <td colSpan="4">일치하는 데이터가 없습니다.</td>
                                        </tr>
                                    )
                                }
                                {
                                    datas && datas.sort((a, b) => (b.qnaIdx - a.qnaIdx))
                                        .map((n) => (
                                            <tr key={n.qnaIdx} className={styles.qnaData} onClick={() => handlerDetail(n.qnaIdx)} >
                                                <td >{n.qnaIdx}</td>
                                                <td >
                                                    <Link to={`/qna/${n.qnaIdx}`} style={{ color: "black" }}>{n.qnaTitle}</Link>
                                                </td>
                                                <td style={{ color: "black" }}>{n.qnaCreatedTime}</td>
                                                <td style={{ color: "black" }}>{n.userNickname}</td>
                                            </tr>
                                        ))

                                }
                                {addEmptyRows()}
                            </tbody>
                        </table>
                    </div>
                </div>
                <Pagination count={pageCount} color="primary" page={pages} onChange={handlerChange} />
                <div className={styles.write}>
                    <Button onClick={handlerWrite}>글쓰기</Button>
                </div>
            </div>
        </Frame>
    )
}

export default QnaList;