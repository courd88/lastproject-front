// import { useEffect, useState, useRef } from "react";
// import { Link } from 'react-router-dom';
// import axios from 'axios';


// // const URL = "/api/B551024/openArirangNewsApi/news";

// const KoreaIssuescroll = ({params}) => {
//     const [bottom, setBottom] = useState(null);
//     const bottomObserver = useRef(null);

//     // const [loading, setLoading] = useState(false);
//     const [responseData, setResponseData] = useState([]);

//     // API 데이터 가지고 오기

//     const loadItem = async (pageNo, numOfRows) => {

//         await axios({
//             method: 'get',
//             url: `https://apis.data.go.kr/B551024/openArirangNewsApi/news?serviceKey=vm3aI2bB7NLgoK5kFerct8%2BZhgJnvvSJ%2FIR96WPVJpIvoOq3EI4%2FaxDBwPU6AVECGP2w3oYbhB9nwHiNwjM2nw%3D%3D&pageNo=${pageNo}&numOfRows=${numOfRows}`
//         })
//             .then(response => {
//                 //응답데이터에서 index번호 추가
//                 const issueItems = response.data.items;
//                 let arrIssueItem = [];
//                 for (let i = 0; i < issueItems.length; i++) {
//                     arrIssueItem[i] = { ...issueItems[i], index: i }
//                 }
//                 console.log(arrIssueItem);
//                 setResponseData(arrIssueItem);
//             })
//             .catch((error) => {
//                 console.log(error);
//             });
//     };

//     // 컴포넌트 마운트 시 API 데이터 가지고 오기
//     useEffect(() => {
//         loadItem(1, 9);
//         const observer = new IntersectionObserver(
//             entries => {
//                 if (entries[0].isIntersecting) {
//                     const { page, totalElement, limit } = params.pageData;
//                     if (totalElement < limit * (page - 1)) {
//                         return;
//                     }
//                     params.getProductList({ page: page + 1 });
//                 }
//             },
//             { threshold: 0.25, rootMargin: '80px' },
//         );
//         bottomObserver.current = observer;
//     }, []);

//     useEffect(() => {
//         const observer = bottomObserver.current;
//         if (bottom) {
//             observer.observe(bottom);
//         }
//         return () => {
//             if (bottom) {
//                 observer.unobserve(bottom);
//             }
//         };
//     }, [bottom]);

//     return (
//         <>
//             <h2>한국 이슈</h2>
//             <ul> {
//                 responseData.map((apiData, index) => (
//                     <li key={index} ><Link to={`/koreaissuedetail/${apiData.index}`}><img src={apiData.thum_url} /><strong>{apiData.title}</strong><span>{apiData.broadcast_date}</span></Link></li>

//                 ))
//             }
//             </ul>
//         </>
//     );
// }

// export default KoreaIssuescroll;