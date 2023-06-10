import { Button } from "@mui/material";
import styles from './MainMenu.module.css';
import { Link } from "react-router-dom";
import i18n from "i18next";
import { useTranslation } from 'react-i18next';

const DetailMenu1 = (props) => {

    const t = props.t;
    return (
        <>
            <div >
                <ul className={styles.detail1}>
                    <li className={styles.detail1Li}><Link to="/koreaissue">{t('page:koreaIssue')}</Link></li>
                    <li className={styles.detail1Li}><Link to="/koreaprice">{t('page:koreaPrice')}</Link></li>
                </ul>
            </div>
        </>
    )
}

export default DetailMenu1;