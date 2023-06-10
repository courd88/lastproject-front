import { useState, useEffect, useRef } from "react";
import axios from "axios";
import TriedCategory from "./TriedCategory";
import TriedList from "./TriedList";
import Frame from "../main/Frame";
import './TriedMain.css';
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { throttle } from "lodash";
import PlaygroundSpeedDial from "./PlaygroundSpeedDial";

const TriedMain = () => {

    const navigate = useNavigate();

    let jwtToken = null;
    if (sessionStorage.getItem("token") != null) {
        jwtToken = sessionStorage.getItem("token");
    }

    const header = {
        Authorization: `Bearer ${jwtToken}`
    };

    const [data, setData] = useState([]);
    const [triedCategoryIdx, setTriedCategoryIdx] = useState(1);
    const [order, setOrder] = useState('recent');
    const [year, setYear] = useState('2023');
    const [pages, setPages] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isAllPagesLoaded, setIsAllPagesLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    console.log(totalPages);
    //{핸들러}무한스크롤링
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
    },700);

    //초기데이터
    useEffect(() => {
        window.addEventListener("scroll", handlerScroll)

        return () => {
            window.removeEventListener("scroll", handlerScroll)
        };
    }, [pages, totalPages]);


    // 페이지 수 가져오는 axios 요청
    const totalPageRequest = async () => {

        try {
            const response = await
                axios.get(`http://${process.env.REACT_APP_CMJ_IP}:8080/api/tried/totalpage/${triedCategoryIdx}/${order}/${year}-01-01/${year}-12-31/${pages}`, );
            setTotalPages(() => (response.data));
            console.log('총 페이지수', response.data)
        } catch (error) {
            console.error(error);
        }
    };

    //카테고리 변경되면 1페이지로 조회
    const fetchData = async () => {
        setPages(1);
        try {
            const response = await
                axios.get(`http://${process.env.REACT_APP_CMJ_IP}:8080/api/tried/${triedCategoryIdx}/${order}/${year}-01-01/${year}-12-31/1`, );
            let updateData = [];
            for (let i = 0; i < response.data.length; i++) {
                updateData.push(response.data[i])
                //console.log(response.data[i])
            }
            setData(updateData);
            //setIsLoading(false);
        } catch (error) {
            console.error(error);
            setData([]);
            //setIsLoading(false);
        }
    };


    //페이지 변경되면 해당 카테고리의 페이지대로 조회
    const fetchDataByPage = async () => {
        console.log(pages);

        try {
            const response = await
                axios.get(`http://${process.env.REACT_APP_CMJ_IP}:8080/api/tried/${triedCategoryIdx}/${order}/${year}-01-01/${year}-12-31/${pages}`, );
            let updateData = [];
            if (pages == 1) {
                updateData = [];
            } else {
                updateData = [...data];
            }
            for (let i = 0; i < response.data.length; i++) {
                updateData.push(response.data[i])
            }
            console.log(updateData)
            setData(updateData);
            setIsLoading(false);
        } catch (error) {
            console.error(error);
            setData([]);
            setIsLoading(false);
        }
    };


    //카테고리 변경시 데이터 조회
    useEffect(() => {
        fetchData();
        totalPageRequest();
    }, [triedCategoryIdx, order, year]);


    //페이지 변경시 데이터 조회
    useEffect(() => {
        fetchDataByPage();
        totalPageRequest();
        console.log("페이지변경")
        return () => {
        };
    }, [pages]);


    const handlerWrite = () => {
        navigate(`/tried/write`);
    }

    return (
        <Frame>

            <div id="travelcourse-list-img">
                <img src="https://a.cdn-hotels.com/gdcs/production140/d1583/119ec73c-cbf4-431e-b128-eadb32999939.jpg" />
            </div>
            <div id="tried-wrap">
                <TriedCategory
                    triedCategoryIdx={triedCategoryIdx}
                    setTriedCategoryIdx={setTriedCategoryIdx}
                    order={order} setOrder={setOrder}
                    year={year} setYear={setYear}
                />
                <div id="tried-worldcup">
                    <PlaygroundSpeedDial  />
                </div>
                <div id="tried-write-btn">
                    <Button type='button' variant="contained" onClick={handlerWrite}>글쓰기</Button>
                </div>
                <div className="triedMain">
                    <TriedList
                        data={data}
                        triedCategoryIdx={triedCategoryIdx}
                        order={order} setOrder={setOrder}
                        year={year} setYear={setYear}
                    />
                </div>
                <div id="scroll" style={{ height: "1px" }}></div>
                {isAllPagesLoaded && data.length > 0 && <div>글이 바닥났어요. 글을 써보시는건 어떠신가요?</div>}
            </div>
        </Frame>
    );
};

export default TriedMain;