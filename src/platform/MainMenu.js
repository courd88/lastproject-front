import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@mui/material"; //추가
import styles from './MainMenu.module.css';
import LanguageIcon from '@mui/icons-material/Language';    //추가
import SearchIcon from '@mui/icons-material/Search';    //추가
import DetailMenu1 from "./DetailMenu1";
import DetailMenu2 from "./DetailMenu2";
import DetailMenu3 from "./DetailMenu3";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import i18n from "i18next";
import { useTranslation } from 'react-i18next';



const MainMenu = () => {

    const { t } = useTranslation();

    const onChangeLang = (lang) => {
        let a = "";
        switch (lang) {
            case 10: a = 'en'
                break;
            case 15: a = 'ko'
                break;
            case 20: a = 'jp'
                break;
        }
        i18n.changeLanguage(a);
    }

    const [lang, setLang] = useState(15);

    const handleChange = (event) => {
        onChangeLang(event.target.value);

        setLang(event.target.value);
    };

    return (
        <div className={styles.wrapper}>
            <nav className={styles.nav}>
                <div className={styles.logo}>
                    <Link to="/">
                        <img className={styles.logoImg} src={process.env.PUBLIC_URL+'/KADA.png'} alt="샘플이미지"></img>
                    </Link>
                </div>
                <ul className={styles.menu__list}>
                    <li className={styles.menu__menu}>
                        <div><Link to="/aboutus">{t('page:aboutUs')}</Link></div>
                    </li>
                    <li className={styles.menu__menu}>
                        <div>{t('page:nowKorea')}</div>
                        <div className={styles.subwrapper}>
                            <nav className={styles.subnav}>
                                <ul className={styles.submenu__list}>
                                    <li className={styles.submenu__menu}><Link to="/koreaissue">{t('page:koreaIssue')}</Link></li>
                                    <li className={styles.submenu__menu}><Link to="/koreaprice">{t('page:koreaPrice')}</Link></li>
                                </ul>
                            </nav>
                        </div>
                    </li>
                    <li className={styles.menu__menu}>
                        <div>{t('page:travelInfo')}</div>
                        <div className={styles.subwrapper}>
                            <nav className={styles.subnav}>
                                <ul className={styles.submenu__list}>
                                    <li className={styles.submenu__menu}><Link to="/weather">{t('page:weather')}</Link></li>
                                    <li className={styles.submenu__menu}><Link to="/course">{t('page:travelCourse')}</Link></li>
                                </ul>
                            </nav>
                        </div>
                    </li>
                    <li className={styles.menu__menu}>
                        <div>{t('page:community')}</div>
                        <div className={styles.subwrapper}>
                            <nav className={styles.subnav}>
                                <ul className={styles.submenu__list}>
                                    <li className={styles.submenu__menu}><Link to="/tried">{t('page:tried')}</Link></li>
                                    <li className={styles.submenu__menu}><Link to="/accompany">{t('page:accompany')}</Link></li>
                                    <li className={styles.submenu__menu}><Link to="/idealreal">{t('page:idealreal')}</Link></li>
                                </ul>
                            </nav>
                        </div>
                    </li>
                </ul>
                <div className={styles.language}>
                    <LanguageIcon style={{ fontSize: "30px" }} />
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                        <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={lang}
                            defaultValue={15}
                            onChange={handleChange}
                            label="lang"
                        >
                            <MenuItem value={15}>
                                <em>Kor</em>
                            </MenuItem>
                            <MenuItem value={10}>Eng</MenuItem>
                            <MenuItem value={20}>Jap</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div></div>
            </nav>
        </div >
    )
}

export default MainMenu;