import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import axios from 'axios';
import { useEffect, useState } from 'react';
import GroupIcon from '@mui/icons-material/Group';


const ChatroomBox = (props) => {
    const header = props.header;
    const userId = props.userId;
    const chatroomId = props.chatroomId;
    const handlerLeaveChatroom = props.handlerLeaveChatroom;
    const chatroomTitle = props.chatroomTitle;
    const handlerJoinAccompanyChat = props.handlerJoinAccompanyChat;

    const [ unreadmsg, setUnreadmsg] = useState(0);

    //[할일]방별로 안읽은(추가된) 채팅개수 가져와야함.
    //방별로 axios 때리면 되잖아? 개쉽네???
    //유저 Id기준으로 때리기
    useEffect(()=>{

        let tempUserId = userId.replace(".", "-");

        axios.get(`http://${process.env.REACT_APP_JKS_IP}:8080/chatroom/unreadmessage/${chatroomId}/${tempUserId}`,
            { headers: header })
            .then((response) => {
                console.log(response)
                setUnreadmsg(response.data);

            }).catch((error) => {
                console.log(error);
            })
    },[])

    return (
        <>
            <div>
                <div className="chatroombox-wrap">
                    <div className="chatroombox-title" onClick={handlerJoinAccompanyChat} >
                        <GroupIcon/>{chatroomTitle}
                    </div>
                    <div className="chatroombox-no-reading">
                        {unreadmsg}
                    </div>
                </div>
                <ExitToAppIcon onClick={handlerLeaveChatroom}/>
            </div>
        </>
    )
};
export default ChatroomBox;