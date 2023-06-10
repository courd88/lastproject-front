import { Link } from "react-router-dom";
import './TriedItem.css';

const TriedItem = ({ tried, imageUrl }) => {

    //console.log(tried);
    return (
        <div className="triedTitle">
            <Link to={`/tried/detail/${tried.triedIdx}`}>
                <div className="img">{imageUrl && <img src={imageUrl} />}</div>

                <div className="trieditem-title">{tried.triedTitle}</div>
            </Link>
            <div className="trieditem-writer">{tried.userNickname}</div>

            <div className="trieditem-cnt-rcmd">
                <div>조회수 {tried.triedCnt}</div>
                <div>추천수 {tried.triedRcmd}</div>
            </div>

        </div>
    );
};

export default TriedItem;