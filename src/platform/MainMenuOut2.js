import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@mui/material"; //추가
import styles from './MainMenuOut2.module.css';
import LanguageIcon from '@mui/icons-material/Language';    //추가
import SearchIcon from '@mui/icons-material/Search';    //추가

const MainMenuOut2 = () => {

    const [ isHovering, setIsHovering ] = useState(0);

    return (
        <>
        {/*  header */}
        <nav className={styles.nav}>
            <div className={styles.logo}>
                <Link to="/">
                <img src="https://via.placeholder.com/220x60" alt="샘플이미지"></img>
                </Link>
            </div>
        	<ul className={styles.navContainer}>
            	<li 
                    className={styles.mainLi}
                    onMouseOver={ () => setIsHovering(1) }
                	onMouseOut={ () => setIsHovering(0) }
                >
                	<Link to="/">ABOUT_US</Link>
                    {
                    	isHovering ? (
                            <div className={styles.box}>
                                <ul className={styles.detailUl}>
                                    <li></li>
                                </ul>
                            </div>
                        ) : (
                      		""
                        )
                 	}
               	</li>
                <li 
                    className={styles.mainLi}
                    onMouseOver={ () => setIsHovering(1) }
                	onMouseOut={ () => setIsHovering(0) }
                >
                	<Link to="/">지금 한국은</Link>
                    {
                    	isHovering ? (
                            <div className={styles.box}>
                                <ul className={styles.detailUl}>
                                    <li><Link to="/"><Button variant="text">음식</Button></Link></li>
                                    <li><Link to="/"><Button variant="text">패션</Button></Link></li>
                                    <li><Link to="/"><Button variant="text">문화</Button></Link></li>
                                </ul>
                            </div>
                        ) : (
                      		""
                        )
                 	}
               	</li>
                <li 
                    className={styles.mainLi}
                    onMouseOver={ () => setIsHovering(1) }
                	onMouseOut={ () => setIsHovering(0) }
                >
                	<Link to="/">여행정보</Link>
                    {
                    	isHovering ? (
                            <div className={styles.box}>
                                <ul className={styles.detailUl}>
                                    <li><Link to="/"><Button variant="text">날씨</Button></Link></li>
                                    <li><Link to="/"><Button variant="text">여행코스</Button></Link></li>
                                    <li><Link to="/"><Button variant="text">카드뉴스</Button></Link></li>
                                </ul>
                            </div>
                        ) : (
                      		""
                        )
                 	}
               	</li>
                <li 
                    className={styles.mainLi}
                    onMouseOver={ () => setIsHovering(1) }
                	onMouseOut={ () => setIsHovering(0) }
                >
                	<Link to="/">커뮤니티</Link>
                    {
                    	isHovering ? (
                            <div className={styles.box}>
                                <ul className={styles.detailUl}>
                                    <li><Link to="/"><Button variant="text">글로벌채팅</Button></Link></li>
                                    <li><Link to="/"><Button variant="text">웹만화</Button></Link></li>
                                    <li><Link to="/"><Button variant="text">어디까지</Button></Link></li>
                                    <li><Link to="/"><Button variant="text">여행친구</Button></Link></li>
                                    <li><Link to="/"><Button variant="text">이상과현실</Button></Link></li>
                                    <li><Link to="/"><Button variant="text">물가체험</Button></Link></li>
                                </ul>
                            </div>
                        ) : (
                      		""
                        )
                 	}
               	</li>
         	</ul>
            <div className={styles.serchBox}>
                <span><LanguageIcon style={{fontSize:"25px", marginRight:30}}  /></span>
                <span><SearchIcon style={{fontSize:"25px"}}  /></span>
            </div>
      	</nav>
        </>
    )
}

export default MainMenuOut2;