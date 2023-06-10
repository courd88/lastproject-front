// import { useState } from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import styles from "./LNButton.module.css";

function LNButton(props) {

    const setData = props.setData;
    const [idealreal, setIdealreal] = useState([]);
    const [ likeCount, setLikeCount ] = useState(0);
    const { idealrealIdx } = useParams();
    const page = props.page;
    const setPage = props.setPage;

    const handleLikeChange = (e) => {
        axios.get(`http://${process.env.REACT_APP_KTG_IP}:8080/api/listidealrealwithlike/${page}`)
            .then(response => {
                setData(response.data);
                setPage(1);
                console.log(response);
            })
            .catch(error => {
                console.log(error);
                return;
            });
    }

    const handleListChange = (e) => {
        axios.get(`http://${process.env.REACT_APP_KTG_IP}:8080/api/listidealreal/${page}`)
            .then(response => {
                setData(response.data);
                setPage(1);
                console.log(response);
            })
            .catch(error => {
                console.log(error);
                return;
            });
    }


    return (

        <ul className={styles.buttonBox}>
            <li className={styles.buttonContainer} onClick={handleLikeChange}>인기순</li>
            <li className={styles.buttonContainer} onClick={handleListChange}>최신순</li>
        </ul>

    )
}

export default LNButton;