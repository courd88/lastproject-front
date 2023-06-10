import { Button } from "@mui/material";
import styles from './MainMenu.module.css';
import { Link } from "react-router-dom";
import i18n from "i18next";
import { useTranslation } from 'react-i18next';

const DetailMenu3 = (props) => {

    const t = props.t;
    return (
        <>
            <div>
                <ul className={styles.detail1}>
                    {/* <li className={styles.detail1Li}><Link to="/webcartoon">웹 만화</Link></li> */}
                    <li className={styles.detail1Li}><Link to="/tried">{t('page:tried')}</Link></li>
                    <li className={styles.detail1Li}><Link to="/accompany">{t('page:accompany')}</Link></li>
                    <li className={styles.detail1Li}><Link to="/idealreal">{t('page:idealreal')}</Link></li>
                </ul>
            </div>
        </>
    )
}

export default DetailMenu3;