// import { useEffect, useState } from "react";
// import { Link } from 'react-router-dom';
// import axios from 'axios';


// const URL = "/api/json/press.do";

// const KoreaNews = () => {
//     const [responseData, setResponseData] = useState([]);


//     useEffect(() => {
//         axios.get(URL,
//             {
//                 params: {
//                     page: 1,
//                     pageSize: 20
//                 }
//             }
//         ).then((response) => {
//             setResponseData(response.data.boardList);
//             console.log(response.data.boardList);
//         }).catch((error) => {
//             console.log(error);
//         });
//     }, []);

//     return (
//         <>
//             <h2>한국 이슈</h2>
//             <ul> {
//                 responseData.map((a, index) => (
//                     <li key={index}><Link to={`/koreanewsdetail/${a.IDX}`}><img src={`https://www.kocis.go.kr/${a.IMAGE_PATH}`} alt="안나옴" /><em></em><strong>{a.TITLE}</strong><span>{a.POSTDATE}</span></Link></li>

//                 ))
//             }
//             </ul>
//         </>
//     ); 
// }

// export default KoreaNews;