import { Link, useLocation } from 'react-router-dom';
import Frame from "../main/Frame";
import styles from "./KoreaIssueDetail.module.css";
import Button from '@mui/material/Button';
import Parse from 'html-react-parser';


const KoreaIssueDetail = (props) => {
    //Link to 로 프랍스 받는 변수 
    const location = useLocation();
    // const title = location.state.title;
    // const content = location.state.content;
    // const index = location.state.index;
    // const thum_url = location.state.thum_url;
    // const broadcast_date = location.state.broadcast_date;
    const { title, content, thum_url, broadcast_date } = location.state;
    console.log(content);

    const crlfParse = (target) => {
        console.log(target)
        target.replace('\n', '<br/>');
        console.log(target)
        return target;
    }

    return (
        <Frame>
            <div className={styles.contentsWrap}>
                <h2>한국 이슈</h2>

                <h3>{title}</h3>
                <em>{broadcast_date.substr(0,10)}</em>
                <img src={thum_url}></img>
                <pre>{content}</pre>
                <Link to="/koreaissue/"><Button variant="contained">목록으로</Button></Link>
            </div>
        </Frame>
    );
}

export default KoreaIssueDetail;