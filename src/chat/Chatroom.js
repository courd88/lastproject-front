import { Stomp } from "@stomp/stompjs";
import axios from "axios";
import { useCallback, useEffect } from "react";
import { useRef, useState } from "react";
import SockJS from "sockjs-client";
import "./Chat.css";
import ChatroomBox from "./ChatroomBox";
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import Swal from "sweetalert2";

function Chatroom(props) {

    const userId = props.userId;
    const nickName = props.nickName;
    const userImg = props.userImg;
    const header = props.header;
    const onMessageReceived = props.onMessageReceived;
    const setIsChatroom = props.setIsChatroom;
    const handler동행글Idx = props.handler동행글Idx;
    // const handlerJoinChat = props.handlerJoinChat;

    //채팅룸 리스트
    const [chatroomList, setChatroomList] = useState([]);


    //글로벌 채팅인지, 동행채팅인지
    let isGlobal = false;
    let isAccompany = false;
    let accIdx = 0;
    const setIsGlobalAccompany = props.setIsGlobalAccompany;

    //아이디 기준으로 채팅방 조회(조회성공)
    useEffect(() => {

        //userId 기준으로 등록된 채팅방들 조회
        axios.post(`http://${process.env.REACT_APP_JKS_IP}:8080/chatroombyuser`, { userId },
            { headers: header }
        )
            .then((response) => {
                console.log(response.data);

                //[할일] 퇴장 이후 채팅방에 쌓인 채팅메시지 개수(not 실시간, 새로고침 기준)


                setChatroomList(response.data);
            })
            .catch((error) => {
                console.log(error);
            })
    }, [])

    const joinChatting = () => {
        //sender없으면 실행안함.
        if (!userId) {
            return;
        }
        console.log("동행방idx", accIdx)
        console.log("채팅룸에서 global", isGlobal);
        console.log("채팅룸에서 accompany", isAccompany);
        //   "/ws" 로 stomp(채팅방) 연결함.
        props.stompClient.current = Stomp.over(() => new SockJS(`http://${process.env.REACT_APP_JKS_IP}:8080/ws`));

        //stomp의 connect함수 인자는 3개면 아래와 같음, 
        //(headers{login,passcode}, connect콜백함수, error콜백함수) 
        props.stompClient.current.connect({}, onConnected, onError);
    };

    const onConnected = () => {

        //동행 채팅 연결시 axios.get 동행Idx있다면 해당 채팅방UUID가져옴. (select)
        //만약 없다면 채팅방UUID 새로 생성해줌.(insert)

        //글로벌 채팅이면 
        // axios 해줄 필요 없이 바로 chatting 드가면 됨.
        if (isGlobal) {
            //stomp의 subscribe함수는 인자 2개 받음,
            //("구독 목적지 주소", 콜백 함수)
            //콜백함수는 보통 function(message)로, message.body가 있다면 출력해주고 없으면 없다고 출력.
            props.stompClient.current.subscribe('/topic/chatting', onMessageReceived);
            //stomp의 send함수는 인자 3개 받음,
            //("요청 목적지 주소", {헤더내용들}, body로 "문자열")
            props.stompClient.current.send('/app/chat.addUser', {},
                JSON.stringify({ userId, userNickname: nickName, userImg, type: 'JOIN' }));      //sender : sender, type : 'JOIN'
        }

        //동행 채팅이면
        //axios.get 해서 동행채팅idx 있는지 확인 필요, 없다면 채팅방 생성해줌, 있다면 채팅방UUID반환 
        if (isAccompany) {

            let 채팅방UUID = '';

            axios.get(`http://${process.env.REACT_APP_JKS_IP}:8080/chatroom/${accIdx}`, { headers: header })
                .then((response) => {

                    채팅방UUID = response.data;

                    //채팅방 구독
                    props.stompClient.current.subscribe(`/topic/chatting/${채팅방UUID}`, onMessageReceived);

                    //채팅방 메시지 및 조인
                    props.stompClient.current.send(`/app/chat.addUser/${채팅방UUID}`, {},
                        JSON.stringify({ chatroomId: 채팅방UUID, userNickname: nickName, userImg, userId, type: 'JOIN' }));
                })
                .catch((error) => {
                    console.log(error);
                })
        }
        //채팅룸 닫기 -> 채팅방 열기
        setIsChatroom(false);
    };


    //{콜백함수: 연결 실패시}  오류 로그출력 
    const onError = useCallback((error) => {
        console.log('연결실패', error);
    }, []);

    //{핸들러} 글로벌채팅방일 경우 -> 
    const handlerJoinGlobalChat = () => {
        //채팅창에서 사용할 변수
        setIsGlobalAccompany(false);    //채팅창에서 메시지를 글로벌로 보낼지 동행으로 보낼지 확인할 수 있는 변수

        //채팅룸에서 사용할 변수
        isGlobal = true;
        isAccompany = false;

        //채팅참여 처리
        joinChatting();
    }

    //{핸들러} 동행채팅방일 경우 -> 동행방Idx까지 줘서 채팅방ID 값을 채팅창에서 조회할 수 있게 함.
    const handlerJoinAccompanyChat = (accompanyIdx) => {

        //채팅창에서 사용할 변수
        handler동행글Idx(accompanyIdx);   //동행글Idx 설정하기
        setIsGlobalAccompany(true);     //채팅창에서 메시지를 글로벌로 보낼지 동행으로 보낼지 확인할 수 있는 변수

        //채팅룸에서 사용할 변수
        isGlobal = false;
        isAccompany = true;
        accIdx = accompanyIdx;

        //채팅참여 처리
        joinChatting();
    }

    //{핸들러} 동행글에서 채팅연결 누를 시 작동
    // const handler = () => {
    //     let accmIdx = handlerJoinChat();
    //     if(accmIdx == null){
    //         return
    //     }
    //     handlerJoinAccompanyChat(accmIdx);
    // }

    // handler();

    //채팅방에서 퇴장하기(내 채팅방 리스트에서 삭제)
    const handlerLeaveChatroom = (chatroomId) => {

        //userId가 .com으로 끝나서 백으로 못넘겨주기 때문에, 임시로 "." 을 "-"로 변형해서 넘겨줌.
        let tempUserId = userId.replace(".", "-");
        Swal.fire({
            title: "채팅방 삭제",
            text: "채팅목록에서 삭제하시겠습니까?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '확인',
            cancelButtonText: '취소'
        })
            .then((result) => {
                if (result.isConfirmed) {
                    axios.delete(`http://${process.env.REACT_APP_JKS_IP}:8080/chatroom/delete/${chatroomId}/${tempUserId}`,
                        { headers: header })
                        .then((response) => {

                            //삭제하는 방이름을 반환받아서 채팅방 목록에서도 지워줌.
                            const tempChatroomList = chatroomList.filter(prevList =>
                                prevList.chatroomId !== response.data
                            )

                            setChatroomList(tempChatroomList);

                        }).catch((error) => {
                            console.log(error);
                        })
                }
            })

    }

    return (
        <>
            <div id="chat-wrap">
                <div id="chat">
                    <div id="chatroomlist">
                        <div className="chatroomList-global" onClick={() => handlerJoinGlobalChat()}><PublicRoundedIcon />글로벌 채팅방</div>
                        {chatroomList && chatroomList.map((chatroom, idx) => (
                            <div className="chatroombox">
                                <ChatroomBox
                                    header={header}
                                    userId={userId}
                                    chatroomId={chatroom.chatroomId}
                                    chatroomTitle={chatroom.accompanyTitle}
                                    handlerLeaveChatroom={() => handlerLeaveChatroom(chatroom.chatroomId)}
                                    handlerJoinAccompanyChat={() => handlerJoinAccompanyChat(chatroom.accompanyIdx)} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
};

export default Chatroom;
