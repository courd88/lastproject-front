import { Reset } from "styled-reset";
import SubMenu from "../platform/SubMenu";
import MainMenu from "../platform/MainMenu";
import DetailMenu from "../platform/DetailMenu";
import Footer from "../platform/Footer";
import ChatPort from "../chat/ChatPort";
import { useRef, useState } from "react";
import ChatParent from "../chat/ChatParent";
import "./Frame.css";
import { useNavigate } from 'react-router-dom';
import VerticalAlignTopRoundedIcon from '@mui/icons-material/VerticalAlignTopRounded';

const Frame = ({ children }) => {

    const [isChatModal, setIsChatIsModal] = useState(true);
    const navigate = useNavigate();

    let isLogin = false;

    if (sessionStorage.getItem('token') != null) {
        isLogin = true;
    }

    const handlerChatModal = () => {
        if (isChatModal) {
            setIsChatIsModal(false);
            console.log(isChatModal);
        } else {
            setIsChatIsModal(true);
        };
    };

    const handlerChatPage = () => {
        navigate('/mobilechat');
    };

    //스크롤 최상단으로 이동
    const handlerTopMove = () => {
        window.scroll({
            top:0
        });
    };

    return (
        <>
            <Reset />
            <div id="body">
            </div>
            <SubMenu />
            <div id="mainmenu">
                <MainMenu />
            </div>
            {children}
            {isLogin && isChatModal &&
                <>
                    <div id="chatport-web" onClick={handlerChatModal}>
                        <ChatPort />
                    </div>
                    <div id="chatport-mobile" onClick={handlerChatPage}>
                        <ChatPort />
                    </div>
                </>
            }
            {isLogin && !isChatModal &&
                <ChatParent handlerChatModal={handlerChatModal} isChatModal={isChatModal}/>
            }
            <div id="top-arrow" onClick={handlerTopMove}>
                <VerticalAlignTopRoundedIcon />
            </div>
            <Footer />
        </>
    )
}
export default Frame;