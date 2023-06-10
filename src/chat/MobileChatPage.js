import "./Chat.css";
import './MobileChatPage.css';
import Frame from "../main/Frame";
import Chatroom from './Chatroom';
import ChattingWindow from './ChattingWindow';
import { useRef, useState } from "react";
import jwt_decode from 'jwt-decode';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const MobileChatPage = (props) => {

    let nickName = null;
    let jwtToken = null;
    let userImg = null;
    if (sessionStorage.getItem('token') != null) {
        jwtToken = sessionStorage.getItem('token');
        userImg = jwt_decode(jwtToken).userImg;
        nickName = jwt_decode(jwtToken).nickname;
    }

    console.log(jwt_decode(jwtToken));

    const header = {
        'Authorization': `Bearer ${jwtToken}`,
        'Content-Type': 'application/json'
    };

    // const handlerJoinChat = props.handlerJoinChat;
    const handlerChatModal = props.handlerChatModal;

    const [isChatroom, setIsChatroom] = useState(true);
    const [ visible, setVisible] = useState(true);

    //굳이 parent에서 관리할 필요 없을 듯
    const [isGlobalAccompany, setIsGlobalAccompany] = useState(false);

    const [userId, setUserId] = useState(jwt_decode(sessionStorage.getItem('token')).sub);
    const [chatHistory, setChatHistory] = useState([]);
    const [동행글Idx, set동행글Idx] = useState(0);
    const stompClient = useRef(null);   //stomp를 바라보게 해둠. 하위컴포넌트로 props로 전달 함.

    //{콜백함수: 구독 메시지 수신시}
    const onMessageReceived = payload => {
        const message = JSON.parse(payload.body);

        //수신된 메시지가 type이 JOIN이면서, 메시지의 sender와 sender가 같다면
        //IsJoin을 true로 설정하고, 채팅내역을 반영해줌.
        //아니면 채팅내역만 반영해줌.
        if (message.type === 'JOIN' && message.userId === userId) {
            // setIsJoin(true);
            message.history.map(msg => setChatHistory(chatHistory => [...chatHistory, msg]))

        } else {
            setChatHistory(chatHistory => [...chatHistory, message]);

        }
    };

    //뒤로 가기(연결끊기)
    const handlerArrowBack = () => {
        stompClient.current.disconnect(function () {
            // alert("see you");
            setIsChatroom(true);
            setChatHistory([]);
        });
    }

    const handlerOutBtn = () => {
        setVisible(false);

        setTimeout(() => {
            if (isChatroom) {
                handlerChatModal();
                return
            } else {
                handlerArrowBack();
                handlerChatModal();
            }
        },200)
    }

    //{핸들러} 동행글Idx 설정
    const handler동행글Idx = (idx) => {
        set동행글Idx(idx);
        console.log(idx);
    }

    return (
        <Frame>


            <div id="mobilechat-wrap">
                {/* <div id="chatTitle">
                    <em>Chat Room</em>
                </div>

                <button type="button" onClick={handlerGlobalChat}>글로벌채팅방</button>
                <button type="button" onClick={handlerAccompanyChat}>동행채팅방</button> */}
                <div id="chatParentTitle">
                    {!(isChatroom) ? <ArrowBackIcon id="ArrowBackIcon" onClick={handlerArrowBack} /> :
                        <span id="ArrowBackIconTemp"></span>}
                    <em>MESSENGER</em>
                    <CloseIcon id="CloseIcon" onClick={() => handlerOutBtn()} />
                </div>

                {isChatroom ? <Chatroom
                    stompClient={stompClient}
                    userId={userId}
                    nickName={nickName}
                    userImg={userImg}
                    setIsGlobalAccompany={setIsGlobalAccompany}
                    header={header}
                    handler동행글Idx={handler동행글Idx}
                    onMessageReceived={onMessageReceived}
                    setIsChatroom={setIsChatroom}
                     />
                    : <ChattingWindow
                        stompClient={stompClient}
                        userId={userId}
                        isGlobalAccompany={isGlobalAccompany}
                        header={header}
                        nickName={nickName}
                        userImg={userImg}
                        동행글Idx={동행글Idx}
                        chatHistory={chatHistory}
                        setChatHistory={setChatHistory}
                        onMessageReceived={onMessageReceived}
                        isChatroom={isChatroom}
                        setIsChatroom={setIsChatroom} />}
            </div>
        </Frame>
    )
}
export default MobileChatPage;