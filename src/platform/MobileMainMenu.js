import './MobileMainMenu.css';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import i18n from "i18next";
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import LanguageIcon from '@mui/icons-material/Language';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import styles from './MainMenu.module.css';

const MobileMainMenu = () => {
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
        <>
            <div id="mobile-mainmenu-window">
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
                <div id="mobile-mainmenu-logo"><Link to="/" ><img src={process.env.PUBLIC_URL + '/KADA.png'} /></Link></div>
                <p><Link to="/aboutus" >{t('page:aboutUs')}</Link></p>

                <ul>
                    <div>{t('page:nowKorea')}</div>
                    <li><Link to="/koreaissue" >{t('page:koreaIssue')}</Link></li>
                    <li><Link to="/koreaprice" >{t('page:koreaPrice')}</Link></li>
                </ul>

                <ul>
                    <div>{t('page:travelInfo')}</div>
                    <li><Link to="/weather" >{t('page:weather')}</Link></li>
                    <li><Link to="/course" >{t('page:travelCourse')}</Link></li>
                </ul>

                <ul>
                    <div>{t('page:community')}</div>
                    <li><Link to="/tried" >{t('page:tried')}</Link></li>
                    <li><Link to="/accompany" >{t('page:accompany')}</Link></li>
                    <li><Link to="/idealreal" >{t('page:idealreal')}</Link></li>
                </ul>

                <ul>
                    <div>{t('page:info')}</div>
                    <li><Link to="/noticelist" >{t('page:notice')}</Link></li>
                    <li><Link to="/qnalist" >{t('page:help')}</Link></li>
                </ul>


            </div>
        </>
    )
}
export default MobileMainMenu;