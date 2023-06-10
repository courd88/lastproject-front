import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Frame from "../main/Frame";
import CircularProgress from '@mui/material/CircularProgress';
import './KoreaIssue.css';
import { throttle } from "lodash";



// const URL = "/api/B551024/openArirangNewsApi/news";

const KoreaIssue = () => {


    // const [loading, setLoading] = useState(false);
    const [responseData, setResponseData] = useState([]);

    const [loading, setLoading] = useState(true);
    // API 데이터 가지고 오기
    const [pages, setPages] = useState(1);

    const handlerScroll = throttle(() => {
        //현재 스크롤 높이
        const scrolledHeight =
            window.innerHeight + document.documentElement.scrollTop;
        //현재 스크린 풀 높이
        const fullHeight = document.documentElement.offsetHeight;
        //비율
        const scrollThreshold = 0.85;

        //풀화면 높이 보다 스크롤한 높이가 더 크다면 페이지를 +1 씩 증가시켜라
        if (scrolledHeight >= fullHeight * scrollThreshold) {
            //페이지 1씩 증가
            setPages(pages + 1);
        }
    },700);


const loadItem = async (pageNo, numOfRows) => {
    try {

        await axios({
            method: 'get',
            url: `https://apis.data.go.kr/B551024/openArirangNewsApi/news?serviceKey=vm3aI2bB7NLgoK5kFerct8%2BZhgJnvvSJ%2FIR96WPVJpIvoOq3EI4%2FaxDBwPU6AVECGP2w3oYbhB9nwHiNwjM2nw%3D%3D&pageNo=${pageNo}&numOfRows=${numOfRows}`
        })
            .then(response => {
                let arrIssueItem = [];
                //1페이지라면 
                if (pageNo == 1) {
                    console.log(response)
                    //응답데이터에서 index번호 추가
                    const issueItems = response.data.items;

                    for (let i = 0; i < issueItems.length; i++) {
                        arrIssueItem[i] = { ...issueItems[i], index: i }
                    }
                    console.log(arrIssueItem);
                    setResponseData(arrIssueItem);
                    setLoading(false);
                    //2페이지지 이상이라면
                } else {
                    let prevArrIssueItem = [...responseData];
                    const issueItems = response.data.items;

                    
                    for (let i = 0; i < issueItems.length; i++) {
                        arrIssueItem[i] = { ...issueItems[i], index: i }
                    }
                    prevArrIssueItem = [...prevArrIssueItem, ...arrIssueItem];

                    console.log(prevArrIssueItem);
                    setResponseData(prevArrIssueItem);
                    setLoading(false);
                }

            })
            .catch((error) => {
                console.log(error);
            });

    } catch (error) {
        console.log(error);
    }
};

// 컴포넌트 마운트 시 API 데이터 가지고 오기
// 페이지 바뀔 때 마다 스크롤 이벤트 추가하여 가져오기
useEffect(() => {
    window.addEventListener("scroll", handlerScroll)
    loadItem(pages, 9);
    return () => (
        window.removeEventListener("scroll", handlerScroll)
    )
}, [pages]);


return (
    <Frame>
        <div id="contents-wrap">
            <h2 id="issue-title">한국 이슈</h2>
            {loading ? <CircularProgress color="secondary" /> : null}
            <ul id="issue-lists"> {
                responseData.map((apiData, index) => (
                    <li className="issue-list" key={index}>
                        <Link to=
                            {`/koreaissue/${apiData.index}`}
                            state={
                                {
                                    title: apiData.title,
                                    content: apiData.content,
                                    index: apiData.index,
                                    thum_url: apiData.thum_url,
                                    broadcast_date: apiData.broadcast_date
                                }
                            }
                        >   <div className="issue-img">
                                <img src={apiData.thum_url} />
                            </div>
                            <br />
                            <strong>{apiData.title}</strong>
                            <br />
                            <span className="issue-date">{apiData.broadcast_date.substr(0, 10)}</span>
                        </Link></li>

                ))
            }
            </ul>
        </div>
    </Frame>
);
}

export default KoreaIssue;