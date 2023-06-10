import { Button } from "@mui/material";
import styles from './MainMenu.module.css';
import { Link } from "react-router-dom";
import i18n from "i18next";
import { useTranslation } from 'react-i18next';

const DetailMenu2 = (props) => {

    const t = props.t;
    return (
        <>
            <div>
                <ul className={styles.detail1}>
                    <li className={styles.detail1Li}><Link to="/weather">{t('page:weather')}</Link></li>
                    <li className={styles.detail1Li}><Link to="/course">{t('page:travelCourse')}</Link></li>
                </ul>
            </div>
        </>
    )
}

export default DetailMenu2;