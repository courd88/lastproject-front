import Frame from '../main/Frame';
import './Accompany.css';
import Input from '@mui/material/Input';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Pagination from '@mui/material/Pagination';
import DateRangeIcon from '@mui/icons-material/DateRange';
import jwt_decode from 'jwt-decode';

// const ariaLabel = { 'aria-label': 'description' };


const Accompany = () => {

  let nickName = null;
  let jwtToken = null;
  if (sessionStorage.getItem('token') != null) {
      jwtToken = sessionStorage.getItem('token');
      nickName = jwt_decode(jwtToken).nickname;
  }

  const header = {
      'Authorization': `Bearer ${jwtToken}`,
      'Content-Type': 'application/json'
  };

  const [datas, setDatas] = useState([]);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [accompanyRegion, setAccompanyRegion] = useState('');
  const [pageCount, setPageCount] = useState(0);
  const [region, setRegion] = useState('');
  const [accompanyImage, setAccompanyImage] = useState([]);

  const [regions, setRegions] = useState([
    { name: "서울", check: false },
    { name: "강원도", check: false },
    { name: "제주도", check: false },
    { name: "부산", check: false },
    { name: "경기도", check: false },
    { name: "인천", check: false },
    { name: "충청도", check: false },
    { name: "경상도", check: false },
    { name: "전라도", check: false }
  ]);
 
  const handlerFilterSelect = (region) => {
    const params = {
      pages: 1,
      search: '',
      accompanyRegion: region
    };
    axios.get(`http://${process.env.REACT_APP_JKS_IP}:8080/api/accompanylistbypage`, { params})
      .then(response => {
        console.log(response.data);
        setDatas(response.data);
      })
      .catch(error => {
        console.log(error);
      })

    axios.get(`http://${process.env.REACT_APP_JKS_IP}:8080/api/accompanypagecount`, { params })
      .then(response => {
        console.log(response.data);
        setPageCount(response.data);
      })
      .catch(error => {
        console.log(error);
      })


      let regionClickCheck = [...regions];

      for (let i=0; i < regionClickCheck.length ; i ++){
        if(regionClickCheck[i].name == region){
          regionClickCheck[i].check = true;
        } else {
          regionClickCheck[i].check = false;
        }
      }
      console.log(regionClickCheck)
      setRegions(regionClickCheck);
      setAccompanyRegion(region);
  }

  const refSearchInput = useRef();

  const navigate = useNavigate();

  const handlerOpenDetail = (accompanyIdx) => {
    navigate(`/accompany/detail/${accompanyIdx}`);
  }

  const handlerChange = (event, value) => {
    console.log(event, value);
    setPages(value);
  }

  const handlerChangeSearch = (e) => {
    e.preventDefault();
    console.log(e.target.value);
    setSearch(e.target.value);
  }

  useEffect(() => {
    const params = {
      pages: pages,
      search: search,
      accompanyRegion: accompanyRegion
    };
    axios.get(`http://localhost:8080/api/accompanylistbypage`, { params })
      .then(response => {
        console.log(response.data);
        setDatas(response.data);
      })
      .catch(error => {
        console.log(error);
      })

    axios.get(`http://localhost:8080/api/accompanypagecount`, { params })
      .then(response => {
        console.log(response.data);
        setPageCount(response.data);
      })
      .catch(error => {
        console.log(error);
      })

  }, [pages])

  
  const handlerSubmitSearch = async () => {
    console.log("클릭");
    const params = {
      pages: pages,
      search: search,
      accompanyRegion: accompanyRegion
    }
    try {
      const response = await axios.get(`http://localhost:8080/api/accompanylistbypage`, { params });
      console.log(response.data);
      setDatas(response.data);
      // navigate(`/accompany`);
    } catch (e) {
      console.log(e);
    }

    try {
      const response = await axios.get(`http://localhost:8080/api/accompanypagecount`, { params });
      console.log(response.data);
      setPageCount(response.data);
      // navigate(`/accompany`);
    } catch (e) {
      console.log(e);
    }
    setPages(1);
  }

  return (
    <Frame>
      <div id="accompany-main-list-img">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Bukchon_Hanok_Village_%EB%B6%81%EC%B4%8C_%ED%95%9C%EC%98%A5%EB%A7%88%EC%9D%84_October_1_2020_15.jpg/1280px-Bukchon_Hanok_Village_%EB%B6%81%EC%B4%8C_%ED%95%9C%EC%98%A5%EB%A7%88%EC%9D%84_October_1_2020_15.jpg" />
      </div>
      <div id="accompany-list-wrap">
        <ul id="accompany-list-area-ul">
          {regions.map((region) => (
            <li className={region.check == true ? "active" : ""}
              onClick={() => handlerFilterSelect(region.name)}>{region.name}</li>
          ))}
        </ul>
        <div id="accompany-list-search-write">
          <Link to="/accompany/write">
            <Button sx={{  color: "white", background:"#5E8FCA", ":hover": { background: "#2d6ebd"}}} variant="contained">WRITE</Button>
          </Link>
          {/* <Input placeholder="Search" inputProps={ariaLabel}  /> */}
          <div className="right">
            <Input placeholder="Search" variant="outlined" color="primary" onChange={handlerChangeSearch} value={search} ref={refSearchInput} onKeyDown={e => { if (e.key === "Enter") { handlerSubmitSearch(e); } }} />
            <SearchIcon  onClick={handlerSubmitSearch} />
          </div>
        </div>
        <div id="accompany-list-each">
          {
            datas.map((accompany) => (
              <div key={accompany.accompanyIdx} onClick={() => handlerOpenDetail(accompany.accompanyIdx)}>
                <div id="accompany-each">
                  <div id="accompany-each-title">
                    <span id="accompany-each-area">{accompany.accompanyRegion}</span>
                    <span id="accompany-each-duration">{accompany.accompanyNumbers}</span>
                    <span id="accompany-each-date"><DateRangeIcon style={{verticalAlign:"middle"}} fontSize='small' />{accompany.accompanyStartTime}-{accompany.accompanyEndTime}</span>
                  </div>
                  <div id="accompany-each-img">
                    <img src={`http://localhost:8080/api/getimage/${accompany.accompanyImage}`}/>
                  </div>
                  <div id="accompany-each-content">
                    {accompany.accompanyTitle}
                  </div>
                </div>
              </div>
            ))
          }
        </div>
        <Pagination count={pageCount} color="primary" page={pages} onChange={handlerChange} />
      </div>
    </Frame>
  )
}
export default Accompany;