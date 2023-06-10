import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@mui/material"; //추가
import styles from './MenuOut.module.css';
import LanguageIcon from '@mui/icons-material/Language';    //추가
import SearchIcon from '@mui/icons-material/Search';    //추가

const MainMenu = () => {
    const menuLst = [ "ABOUT US", "지금 한국은", "여행정보", "커뮤니티" ];
    const [hide, setHide] = useState({
        ABOUT_US : false,
        지금_한국은 : false,
        여행정보 : false,
        커뮤니티 : false 
    });

    const mouseEvent = (menuName, bool) => {
        const change = {...hide};
        change[menuName] = bool;
        setHide(change);
    };
    return (
        <nav className={styles.nav}>
            <div className={styles.logo}>
                <Link to="/">
                <img src="https://via.placeholder.com/220x60" alt="샘플이미지"></img>
                </Link>
            </div>
            <ul className={styles.navContainer}>
                {menuLst.map((v, index) => (
                    <li
                        kye={index}
                        className={hide[v] ? "active" : "none"}
                        onMouseEnter={() => mouseEvent(v, true)}
                        onMouseLeave={() => mouseEvent(v, false)}
                    >
                        <Link to="">{v}</Link>
                    </li>
                ))}
            </ul>
            <div className={styles.detailMenu} >
                    <ul
                        onMouseEnter={() => mouseEvent(true)}
                        onMouseLeave={() => mouseEvent(false)}
                        className={styles.detailUl}
                    >
                        <li className={styles.detailLi} ></li>
                        <li className={styles.detailLi}>
                            <ul>
                                <li><Button variant="text">음식</Button></li>
                                <li><Button variant="text">패션</Button></li>
                                <li><Button variant="text">문화</Button></li>
                            </ul>
                        </li>
                        <li className={styles.detailLi}>
                            <ul>
                                <li><Button variant="text">날씨</Button></li>
                                <li><Button variant="text">여행코스</Button></li>
                                <li><Button variant="text">카드뉴스</Button></li>
                            </ul>
                        </li>
                        <li className={styles.detailLi}>
                            <ul>
                                <li><Button variant="text">글로벌채팅</Button></li>
                                <li><Button variant="text">웹만화</Button></li>
                                <li><Button variant="text">어디까지</Button></li>
                                <li><Button variant="text">여행친구</Button></li>
                                <li><Button variant="text">이상과현실</Button></li>
                                <li><Button variant="text">물가체험</Button></li>
                            </ul>
                        </li>
                    </ul>
            </div>
            <div className={styles.serchBox}>
                <span><LanguageIcon style={{fontSize:"25px", marginRight:30}}  /></span>
                <span><SearchIcon style={{fontSize:"25px"}}  /></span>
            </div>
        </nav>
    )
}

export default MainMenu;