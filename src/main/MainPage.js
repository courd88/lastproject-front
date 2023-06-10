import React, { useEffect, useState } from 'react';
import Frame from './Frame';
import useScrollFadeIn from './useScrollFadeIn';
import styles from './MainPage.module.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccompanySwiper from './AccompanySwiper';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import EmergencyShareIcon from '@mui/icons-material/EmergencyShare';
import MonochromePhotosIcon from '@mui/icons-material/MonochromePhotos';
import { useTranslation } from 'react-i18next';

const MainPage = () => {

  const { t } = useTranslation();

  // useScrollFadeIn 훅을 사용하여 애니메이션 효과를 적용
  const koreaIssueAnimation = useScrollFadeIn('up', 1, 0);
  const accompanyAnimation = useScrollFadeIn('up', 0.5, 0);
  const nowAnimation = useScrollFadeIn('up', 1, 0);
  const courseAnimation = useScrollFadeIn('up', 1, 0.5);
  const noticeAnimation = useScrollFadeIn('up', 1, 0.5);

  const [koreaIssueData, setKoreaIssueData] = useState([]);

  const navigate = useNavigate();

  const loadItem = async (pageNo, numOfRows) => {
    try {

      await axios({
        method: 'get',
        url: `https://apis.data.go.kr/B551024/openArirangNewsApi/news?serviceKey=vm3aI2bB7NLgoK5kFerct8%2BZhgJnvvSJ%2FIR96WPVJpIvoOq3EI4%2FaxDBwPU6AVECGP2w3oYbhB9nwHiNwjM2nw%3D%3D&pageNo=${pageNo}&numOfRows=${numOfRows}`
      })
        .then(response => {
          //응답데이터에서 index번호 추가
          const issueItems = response.data.items;
          let arrIssueItem = [];
          for (let i = 0; i < issueItems.length; i++) {
            arrIssueItem[i] = { ...issueItems[i], index: i }
          }
          console.log(arrIssueItem);
          setKoreaIssueData(arrIssueItem);
          // setLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });

    } catch (error) {
      console.log(error);
    }
  };

  // 컴포넌트 마운트 시 API 데이터 가지고 오기
  useEffect(() => {
    loadItem(2, 9);
  }, []);

  const handlerWeather = () => {
    navigate(`/weather`);
  }

  const handlerExperience = () => {
    navigate(`/koreaprice`);
  }

  const handlerTried = () => {
    navigate(`/tried`);
  }

  const handlerIdealreal = () => {
    navigate(`/idealreal`);
  }

  return (
    <Frame>
      <div className={styles.main_page}>
        <div className={styles.main_koreaissue} ref={koreaIssueAnimation.ref} style={koreaIssueAnimation.style}>
          <h2 className={styles.newsMain_section_title}>
            {t('page:korea')}
            <em className={styles.style_font}>
              {t('page:issue')}
            </em>
          </h2>
          <div className={styles.main_koreaissue_ul}>
            <div className={styles.main_koreaissue_li}>
              {
                koreaIssueData.length > 1 &&
                <Link to={`/koreaissue/${koreaIssueData[0].index}`}
                  state={
                    {
                      title: koreaIssueData[0].title,
                      content: koreaIssueData[0].content,
                      index: koreaIssueData[0].index,
                      thum_url: koreaIssueData[0].thum_url,
                      broadcast_date: koreaIssueData[0].broadcast_date
                    }
                  }
                >
                  <div>
                    <img src={koreaIssueData[0].thum_url} />
                  </div>
                  <h3>{koreaIssueData[0].title}</h3>
                  <p>{koreaIssueData[0].content}</p>
                  <p><AccessTimeIcon style={{ fontSize: "21px", verticalAlign: "Text-top", marginRight: "5px" }} />{koreaIssueData[0].broadcast_date.substr(0, 10)}</p>
                </Link>
              }
            </div>
            <div className={styles.main_koreaissue_li}>
              {
                koreaIssueData.length > 1 &&
                <Link to={`/koreaissue/${koreaIssueData[1].index}`}
                  state={
                    {
                      title: koreaIssueData[1].title,
                      content: koreaIssueData[1].content,
                      index: koreaIssueData[1].index,
                      thum_url: koreaIssueData[1].thum_url,
                      broadcast_date: koreaIssueData[1].broadcast_date
                    }
                  }
                >
                  <div>
                    <img src={koreaIssueData[1].thum_url} />
                  </div>
                  <h3>{koreaIssueData[1].title}</h3>
                  <p><AccessTimeIcon style={{ fontSize: "21px", verticalAlign: "Text-top", marginRight: "5px" }} />{koreaIssueData[1].broadcast_date.substr(0, 10)}</p>
                </Link>
              }
              {
                koreaIssueData.length > 1 &&
                <Link to={`/koreaissue/${koreaIssueData[2].index}`}
                  state={
                    {
                      title: koreaIssueData[2].title,
                      content: koreaIssueData[2].content,
                      index: koreaIssueData[2].index,
                      thum_url: koreaIssueData[2].thum_url,
                      broadcast_date: koreaIssueData[2].broadcast_date
                    }
                  }
                >
                  <div>
                    <img src={koreaIssueData[2].thum_url} />
                  </div>
                  <h3>{koreaIssueData[2].title}</h3>
                  <p><AccessTimeIcon style={{ fontSize: "21px", verticalAlign: "Text-top", marginRight: "5px" }} />{koreaIssueData[2].broadcast_date.substr(0, 10)}</p>
                </Link>
              }
            </div>
            <div className={styles.main_koreaissue_li}>
              {
                koreaIssueData.length > 1 &&
                <Link to={`/koreaissue/${koreaIssueData[3].index}`}
                  state={
                    {
                      title: koreaIssueData[3].title,
                      content: koreaIssueData[3].content,
                      index: koreaIssueData[3].index,
                      thum_url: koreaIssueData[3].thum_url,
                      broadcast_date: koreaIssueData[3].broadcast_date
                    }
                  }
                >
                  <h3>{koreaIssueData[3].title}</h3>
                  <p><AccessTimeIcon style={{ fontSize: "21px", verticalAlign: "Text-top", marginRight: "5px" }} />{koreaIssueData[3].broadcast_date.substr(0, 10)}</p>
                </Link>
              }
              {
                koreaIssueData.length > 1 &&
                <Link to={`/koreaissue/${koreaIssueData[4].index}`}
                  state={
                    {
                      title: koreaIssueData[4].title,
                      content: koreaIssueData[4].content,
                      index: koreaIssueData[4].index,
                      thum_url: koreaIssueData[4].thum_url,
                      broadcast_date: koreaIssueData[4].broadcast_date
                    }
                  }
                >
                  <h3>{koreaIssueData[4].title}</h3>
                  <p><AccessTimeIcon style={{ fontSize: "21px", verticalAlign: "Text-top", marginRight: "5px" }} />{koreaIssueData[4].broadcast_date.substr(0, 10)}</p>
                </Link>
              }
              {
                koreaIssueData.length > 1 &&
                <Link to={`/koreaissue/${koreaIssueData[5].index}`}
                  state={
                    {
                      title: koreaIssueData[5].title,
                      content: koreaIssueData[5].content,
                      index: koreaIssueData[5].index,
                      thum_url: koreaIssueData[5].thum_url,
                      broadcast_date: koreaIssueData[5].broadcast_date
                    }
                  }
                >
                  <h3>{koreaIssueData[5].title}</h3>
                  <p><AccessTimeIcon style={{ fontSize: "21px", verticalAlign: "Text-top", marginRight: "5px" }} />{koreaIssueData[5].broadcast_date.substr(0, 10)}</p>
                </Link>
              }
              {
                koreaIssueData.length > 1 &&
                <Link to={`/koreaissue/${koreaIssueData[6].index}`}
                  state={
                    {
                      title: koreaIssueData[6].title,
                      content: koreaIssueData[6].content,
                      index: koreaIssueData[6].index,
                      thum_url: koreaIssueData[6].thum_url,
                      broadcast_date: koreaIssueData[6].broadcast_date
                    }
                  }
                >
                  <h3>{koreaIssueData[6].title}</h3>
                  <p><AccessTimeIcon style={{ fontSize: "21px", verticalAlign: "Text-top", marginRight: "5px" }} />{koreaIssueData[6].broadcast_date.substr(0, 10)}</p>
                </Link>
              }
              {
                koreaIssueData.length > 1 &&
                <Link to={`/koreaissue/${koreaIssueData[7].index}`}
                  state={
                    {
                      title: koreaIssueData[7].title,
                      content: koreaIssueData[7].content,
                      index: koreaIssueData[7].index,
                      thum_url: koreaIssueData[7].thum_url,
                      broadcast_date: koreaIssueData[7].broadcast_date
                    }
                  }
                >
                  <h3>{koreaIssueData[7].title}</h3>
                  <p><AccessTimeIcon style={{ fontSize: "21px", verticalAlign: "Text-top", marginRight: "5px" }} />{koreaIssueData[7].broadcast_date.substr(0, 10)}</p>
                </Link>
              }
              {
                koreaIssueData.length > 1 &&
                <Link to={`/koreaissue/${koreaIssueData[8].index}`}
                  state={
                    {
                      title: koreaIssueData[8].title,
                      content: koreaIssueData[8].content,
                      index: koreaIssueData[8].index,
                      thum_url: koreaIssueData[8].thum_url,
                      broadcast_date: koreaIssueData[8].broadcast_date
                    }
                  }
                >
                  <h3>{koreaIssueData[8].title}</h3>
                  <p><AccessTimeIcon style={{ fontSize: "21px", verticalAlign: "Text-top", marginRight: "5px" }} />{koreaIssueData[8].broadcast_date.substr(0, 10)}</p>
                </Link>
              }
            </div>
          </div>
        </div>
        <div className={styles.main_accompany} ref={accompanyAnimation.ref} style={accompanyAnimation.style}>
          <h2 className={styles.accompanyMain_section_title}>
            {t('page:travel')}
            <em className={styles.style_font}>
              {t('page:partner')}
            </em>
          </h2>
          <div className={styles.main_accompany_ul}>
            <AccompanySwiper />
          </div>
        </div>
        <div className={styles.main_now} ref={nowAnimation.ref} style={nowAnimation.style}>
          <h2 className={styles.nowMain_section_title}>
            {t('page:koreanowMain1')}
            <em className={styles.style_font}>
              {t('page:koreanowMain2')}
            </em>
          </h2>
          <div className={styles.main_now_ul}>
            <li className={styles.main_now_li} onClick={handlerWeather}>
              <img src={process.env.PUBLIC_URL + "/images/wether.jpg"} />
              <strong>{t('page:kWeather')}</strong>
              <div className={styles.bg}>
                <WbSunnyIcon className={styles.icon} />
                <em>{t('page:kWeather')}</em>
                <p>{t('page:kWeatherIntro')}</p>
              </div>
            </li>
            <li className={styles.main_now_li} onClick={handlerExperience}>
              <img src={process.env.PUBLIC_URL + "/images/experience.jpg"} />
              <strong>{t('page:priceExperience')}</strong>
              <div className={styles.bg}>
                <CurrencyExchangeIcon className={styles.icon} />
                <em>{t('page:priceExperience')}</em>
                <p>{t('page:priceExperienceIntro')}</p>
              </div>
            </li>
            <li className={styles.main_now_li} onClick={handlerTried}>
              <img src={process.env.PUBLIC_URL + "/images/tried.jpg"} />
              <strong>{t('page:koreaTried')}</strong>
              <div className={styles.bg}>
                <EmergencyShareIcon className={styles.icon} />
                <em>{t('page:koreaTried')}</em>
                <p>{t('page:koreaTriedIntro')}</p>
              </div>
            </li>
            <li className={styles.main_now_li} onClick={handlerIdealreal}>
              <img src={process.env.PUBLIC_URL + "/images/real.jpg"} />
              <strong>{t('page:idealrealMain1')} &amp; {t('page:idealrealMain2')}</strong>
              <div className={styles.bg}>
                <MonochromePhotosIcon className={styles.icon} />
                <em>{t('page:idealrealMain1')} &amp; {t('page:idealrealMain2')}</em>
                <p>{t('page:idealrealIntro')}</p>
              </div>
            </li>
          </div>
        </div>
        <div className={styles.main_course} ref={courseAnimation.ref} style={courseAnimation.style}>
          <h2 className={styles.courseMain_section_title}>
            {t('page:travelcourseMain1')}
            <em className={styles.style_font}>
              {t('page:travelcourseMain2')}
            </em>
          </h2>
          <span className={styles.course_text}>{t('page:travelcourseIntro')}</span>
          <div className={styles.btn_box}>
            <Link to="/course" className={`${styles.btn_more}`}>{t('page:more')}</Link>
          </div>
        </div>
        <div className={styles.main_notice} ref={noticeAnimation.ref} style={noticeAnimation.style}>
          {/* <p>공지사항</p> */}
          <ul className={styles.main_notice_ul}>
            <li className={styles.main_notice_li}>
              <div className={styles.txt_bx}>
                <div className={styles.tit}>{t('page:notice')}</div>
                <p className={styles.text}>{t('page:noticeIntro')}</p>
                <div className={styles.btn_box}>
                  <Link to="/qnalist" className={`${styles.btn_more}`}>{t('page:more')}</Link>
                </div>
              </div>
            </li>
            <li className={styles.main_notice_li}>
              <div className={styles.txt_bx}>
                <div className={styles.tit}>{t('page:qnaMain1')}&amp;{t('page:qnaMain2')}</div>
                <p className={styles.text}>{t('page:qnaIntro')}</p>
                <div className={styles.btn_box}>
                  <Link to="/qnalist" className={`${styles.btn_more}`}>{t('page:more')}</Link>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Frame >
  );
};

export default MainPage;