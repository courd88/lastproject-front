import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const DetailMenu = () => {
    return (
        <>
            <div></div>
            <div>
                <ul>
                    <li><Link to=""><Button variant="text">음식</Button></Link></li>
                    <li><Link to=""><Button variant="text">패션</Button></Link></li>
                    <li><Link to=""><Button variant="text">문화</Button></Link></li>
                </ul>
            </div>
            <div>
                <ul>
                    <li><Link to="/weather"><Button variant="text">날씨</Button></Link></li>
                    <li><Link to="/course"><Button variant="text">여행코스</Button></Link></li>
                    <li><Link to=""><Button variant="text">카드뉴스</Button></Link></li>
                </ul>
            </div>
            <div>
                <ul>
                    <li><Link to="/chat"><Button variant="text">글로벌채팅</Button></Link></li>
                    <li><Link to=""><Button variant="text">웹만화</Button></Link></li>
                    <li><Link to=""><Button variant="text">어디까지</Button></Link></li>
                    <li><Link to="/accompany"><Button variant="text">여행친구</Button></Link></li>
                    <li><Link to=""><Button variant="text">이상과현실</Button></Link></li>
                    <li><Link to=""><Button variant="text">물가체험</Button></Link></li>
                </ul>
            </div>
        </>
    )
}

export default DetailMenu;