import axios from "axios";
import { useCallback, useEffect } from "react";
import { useRef, useState } from "react";
import './Chat.css';
import ChattingTranslate from "./ChattingTranslate";
import SendRoundedIcon from '@mui/icons-material/SendRounded';

function ChattingWindow(props) {

    //글로벌 채팅인지, 동행채팅인지
    const isGlobalAccompany = props.isGlobalAccompany;

    console.log("채팅창에서 동행여부", isGlobalAccompany);
    const 동행글Idx = props.동행글Idx;

    const userId = props.userId;
    const header = props.header;
    const nickName = props.nickName;
    const userImg = props.userImg;
    const chatHistory = props.chatHistory;
    const setChatHistory = props.setChatHistory;
    const onMessageReceived = props.onMessageReceived;
    const isChatroom = props.isChatroom;
    const setIsChatroom = props.setIsChatroom;

    //상태변수 지정
    const [message, setMessage] = useState('');
    const [translateState, setTranslateState] = useState([]);

    //ref지정(요소 컨트롤)
    const refDialogDiv = useRef();
    const refMessageInput = useRef();

    //{핸들러: 메시지 전송}
    //stomp의 send함수는 3개 인자 받고, JOIN(connect)과 달리 type을 CHAT으로 하고 message 내용도 담음.
    const sendMessage = useCallback(e => {
        e.preventDefault();

        //false라면(글로벌)
        if (!isGlobalAccompany) {
            console.log('여기까지 되나?')
            if (props.stompClient) {
                props.stompClient.current.send('/app/chat.sendMessage', {},
                    JSON.stringify({ userId, message, userNickname: nickName, userImg, type: 'CHAT' }));  //sender : sender, message : message, type : 'CHAT'       
            }

            //메시지 보냈으면 초기화 해주고, 다시 인풋 태그 가리킴.
            setMessage('');
            refMessageInput.current.focus();
        }

        console.log(nickName);
        //true라면(동행)
        if (isGlobalAccompany) {
            let 채팅방UUID = '';
            //동행글idx 기준으로 확인해봄, 
            //백에서 동행글Idx로 만들어진 채팅방이 없다면, 새로 생성해주고, 채팅방ID를 반환해줌.
            axios.get(`http://${process.env.REACT_APP_JKS_IP}:8080/chatroom/${동행글Idx}`, { headers: header })
                .then((response) => {

                    //채팅방ID반환하여 구독해줌.
                    채팅방UUID = response.data;

                    //구독을 시도하고, Chat 메시지를 보냄 JSON객체로.
                    if (props.stompClient) {
                        props.stompClient.current.send(`/app/chat.sendMessage/${채팅방UUID}`, {},
                            JSON.stringify({ chatroomId: 채팅방UUID, userNickname: nickName, userImg, userId, message, type: 'CHAT' }));  //sender : sender, message : message, type : 'CHAT'       
                    }

                    //메시지 보냈으면 초기화 해주고, 다시 인풋 태그 가리킴.
                    setMessage('');
                    refMessageInput.current.focus();

                })
                .catch((error) => {
                    console.log(error);
                })
        }
    }, [message]);

    //{핸들러: 연결끊기}
    const handlerDisconnect = () => {
        props.stompClient.current.disconnect(function () {
            alert("see you");
            setIsChatroom(true);
            //채팅내역 초기화
            setChatHistory([]);
        });
    }

    


    //채팅 내역이 바뀌면, 스크롤을 내려줌.
    useEffect(() => {
        //스크롤 내림
        refDialogDiv.current.scroll({
            top: refDialogDiv.current.scrollHeight,
            behavior: 'smooth'
        });

        let translatelist = [...chatHistory];
        for (let i = 0 ; i < translatelist.length; i++){
            translatelist[i]=false;
        }
        setTranslateState(translatelist);
        console.log(translateState);
    }, [chatHistory])


    const translateOpen = (index) =>{
        console.log('눌리긴 하나?', index)
        let translatelist = [...translateState];
            translatelist[index]=true;
        setTranslateState(translatelist);
        console.log(translatelist)
    }
    console.log(userImg);
    console.log(chatHistory);

    return (
        <>
            <div id="chat-wrap">
                <div id="chat-window">
                    <div id="dialog">
                        <div className="dialog-board"  ref={refDialogDiv}>
                            {chatHistory ?
                                chatHistory.map((item, idx) => (
                                    <>
                                        <div key={idx} className={item.userId === userId ? "dialog-me" : "dialog-other"}>
                                            <div id="dialog-box">
                                                <img id="dialog-profile-img" src={`http://${process.env.REACT_APP_JKS_IP}:8080/api/getimage/${item.userImg}`} />
                                                <div id={item.type=="CHAT"? "dialog-message-box": "dialog-message-box-other"}>
                                                    <span id="dialog-profile-nickname">{item.userNickname}</span>
                                                    {/* <span><b>{item.userId}</b></span> */}
                                                    <div id="dialog-message" onClick={()=>translateOpen(idx)} >{item.message}</div>
                                                    {/* 번역되면 메시지 아래에 번역문 보이도록 */}
                                                    { translateState[idx] && <ChattingTranslate
                                                        key={idx}
                                                        message={item.message}
                                                        header={header}
                                                        translateState={translateState}
                                                    />}
                                                </div>
                                            </div>
                                            <span className="dialog-date">{item.createdDt}</span>
                                        </div>
                                    </>
                                )) : ""}
                        </div>
                    </div>

                    <div id="divMessage">
                        {/* <label>메시지</label> */}
                        <div id="blank"></div>
                        <textarea id="messageInput" value={message} ref={refMessageInput}
                            // 값이 바뀌면 메시지 상태변수 수정해주고, 엔터 누르면 메시지 전송 함수 실행
                            onChange={e => setMessage(e.target.value)}
                            onKeyDown={e => { if (e.key === "Enter") { sendMessage(e); } }}>
                        </textarea>

                        <button type="button" value="Send" id="btnSend" onClick={sendMessage}><SendRoundedIcon/></button>
                        {/* <button type="button" onClick={handlerDisconnect}>나가기</button> */}
                    </div>
                </div>
            </div>
        </>
    )
};

export default ChattingWindow;