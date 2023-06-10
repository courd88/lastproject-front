// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
// import required modules
import { Autoplay, FreeMode, Navigation, Pagination } from "swiper";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import "swiper/css/autoplay"

import "./swiperStyle.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./AccompanySwiper.module.css";
import jwt_decode from 'jwt-decode';

const AccompanySwiper = () => {

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

  const [datas, setDatas] = useState([]);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [accompanyRegion, setAccompanyRegion] = useState('');

  const navigate = useNavigate();

  const handlerOpenDetail = (accompanyIdx) => {
    navigate(`/accompany/detail/${accompanyIdx}`);
  }

  // const handlerAccompany = () => {
  //     navigate(`/accompany`);
  // };

  useEffect(() => {
    const params = {
      pages: pages,
      search: search,
      accompanyRegion: accompanyRegion
    };
    axios.get(`http://${process.env.REACT_APP_JKS_IP}:8080/api/accompanylistbypage`, { params })
      .then(response => {
        console.log(response.data);
        setDatas(response.data);
      })
      .catch(error => {
        console.log(error);
      })

    // axios.get(`http://localhost:8080/api/accompanypagecount`, { params })
    //     .then(response => {
    //         console.log(response.data);
    //         setPageCount(response.data);
    //     })
    //     .catch(error => {
    //         console.log(error);
    //     })

  }, [])

  return (
    <Swiper
      breakpoints={{
        // when window width is >= 576px
        // 0: {
        //   slidesPerView: 1,
        // },
        // when window width is >= 576px
        375: {
          slidesPerView: 1,
          spaceBetween: 40,
          speed: 1000,
        },
        // when window width is >= 768px
        768: {
          slidesPerView: 2,
          spaceBetween: 40,
        },
        // // when window width is >= 1024px
        // 1024: {
        //     spaceBetween: 10,
        //     slidesPerView: 3,
        // },
        1280: {
          slidesPerView: 2,
          spaceBetween: 450,
        },
      }}
      // slidesPerView={2}
      // spaceBetween={450}
      centeredSlides={true}
      pagination={{
        clickable: true,
      }}
      navigation={{ clickable: true }}
      autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: Boolean }}
      // autoplay={{
      //     delay: 0,
      //     stopOnLastSlide: false,
      //     disableOnInteraction: false
      // }}
      speed={3000}
      loop={true}
      // observer={true}
      // observeParents={true}
      modules={[Pagination, Navigation, FreeMode, Autoplay]}
      className="mySwiper"
    >
      {
        datas.map((accompany) => (
          <SwiperSlide>
            <div key={accompany.accompanyIdx} onClick={() => handlerOpenDetail(accompany.accompanyIdx)}>
              <div className={styles.accompany_each}>
                <div className={styles.accompany_each_img}>
                  <img src={`http://${process.env.REACT_APP_JKS_IP}:8080/api/getImage/${accompany.accompanyImage}`} />
                </div>
                <div className={styles.accompany_each_content}>
                  {accompany.accompanyTitle}
                </div>
                <div className={styles.accompany_each_title}>
                  <span className={styles.accompany_each_area}>
                    {accompany.accompanyRegion}
                  </span>
                  <span className={styles.accompany_each_duration}>
                    {accompany.accompanyNumbers}명
                  </span>
                  <span className={styles.accompany_each_date}>
                    {/* <DateRangeIcon style={{ verticalAlign: "middle" }} fontSize='small' /> */}
                    {accompany.accompanyStartTime}-{accompany.accompanyEndTime}
                  </span>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))
      }
    </Swiper >
  )

}

export default AccompanySwiper;